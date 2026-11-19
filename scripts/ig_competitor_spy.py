#!/usr/bin/env python3
"""Outil gratuit de veille concurrentielle Instagram Reels (sans Apify ni compte secondaire).

Pipeline :
1. Découvre ou scanne automatiquement les derniers Reels publics d'une liste de comptes
   (grille publique via Playwright Chromium, ou JSON `discover_account`).
2. Calcule la médiane de vues par compte sur les Reels récents non épinglés (`is_pinned=False`)
   et isole les Reels qui surperforment (outliers >= min_ratio, défaut 2.0x).
3. Télécharge chaque outlier dans /tmp/ig-spy-cache/, transcrit 100 % de l'audio avec
   faster-whisper (timecodes segment par segment + découpage Hook/Mécanisme/CTA) et
   génère une planche contact visuelle complète `storyboard.jpg` (frames 0.5s, 1.5s, 3.0s
   puis toutes les 3s).

Zéro pollution du workspace : tous les fichiers temporaires et rapports bruts restent dans
/tmp/ig-spy-cache/.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import re
import shutil
import statistics
import subprocess
import sys
import uuid
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any

DEDICATED_VENV_PYTHON = Path.home() / ".local/share/ig-spy-venv/bin/python"
DEFAULT_CACHE_DIR = Path("/tmp/ig-spy-cache")
FFMPEG_CANDIDATES = [
    Path.home() / ".local/bin/ffmpeg",
    Path("/usr/bin/ffmpeg"),
    Path("/usr/local/bin/ffmpeg"),
]
FFPROBE_CANDIDATES = [
    Path.home() / ".local/bin/ffprobe",
    Path("/usr/bin/ffprobe"),
    Path("/usr/local/bin/ffprobe"),
]


def ensure_dedicated_venv() -> None:
    """Relance le script dans ~/.local/share/ig-spy-venv si disponible."""
    if os.environ.get("IG_SPY_NO_REEXEC") == "1":
        return
    if DEDICATED_VENV_PYTHON.exists() and Path(sys.executable).resolve() != DEDICATED_VENV_PYTHON.resolve():
        os.execv(str(DEDICATED_VENV_PYTHON), [str(DEDICATED_VENV_PYTHON), *sys.argv])


@dataclass
class ReelItem:
    handle: str
    shortcode: str
    url: str
    views: int | None = None
    likes: int = 0
    comments: int = 0
    caption: str = ""
    timestamp: str = ""
    source: str = "unknown"
    duration_sec: float | None = None
    is_pinned: bool = False

    @property
    def engagement_score(self) -> int:
        return self.likes + (self.comments * 5)

    @property
    def comments_per_100_views(self) -> float:
        if self.views and self.views > 0 and self.comments > 0:
            return round((self.comments / self.views) * 100, 2)
        return 0.0


@dataclass
class TranscriptSegment:
    start: float
    end: float
    text: str
    phase: str


@dataclass
class OutlierAnalysis:
    handle: str
    shortcode: str
    url: str
    views: int | None
    likes: int
    comments: int
    median_baseline: float
    outlier_ratio: float
    metric_used: str
    below_threshold: bool
    duration_sec: float
    caption: str
    full_transcript: str
    phases: dict[str, str]
    segments: list[TranscriptSegment]
    storyboard_path: str
    source: str
    is_pinned: bool = False
    comments_per_100_views: float = 0.0

    def __post_init__(self) -> None:
        if self.comments_per_100_views == 0.0 and self.views and self.views > 0 and self.comments > 0:
            self.comments_per_100_views = round((self.comments / self.views) * 100, 2)


@dataclass
class AccountSummary:
    handle: str
    total_fetched: int
    median_baseline: float
    metric_used: str
    confidence: str
    outliers_found: int
    followers_count: int | None = None
    bio: str = ""
    sources_used: list[str] = field(default_factory=list)


def normalize_handle(raw: str) -> str:
    """Extrait le nom d'utilisateur propre depuis @handle ou une URL Instagram."""
    cleaned = raw.strip()
    if cleaned.startswith("http"):
        match = re.search(r"instagram\.com/([^/?#]+)", cleaned)
        if match:
            cleaned = match.group(1)
    return cleaned.lstrip("@").strip("/").lower()


def extract_shortcode(url_or_code: str) -> str:
    """Extrait le shortcode d'une URL /reel/<code/> ou /p/<code/>."""
    match = re.search(r"/(?:reel|reels|p|tv)/([A-Za-z0-9_-]+)", url_or_code)
    if match:
        return match.group(1)
    return url_or_code.strip("/").split("/")[-1]


def parse_compact_number(raw: str | int | float | None) -> int | None:
    """Convertit '12.4K', '1,2 M', '3,130', '850 k', '45 200' en entier."""
    if raw is None:
        return None
    if isinstance(raw, (int, float)):
        return int(raw)
    text = str(raw).strip().lower().replace("\u202f", "").replace("\xa0", "").replace(" ", "")
    if not text:
        return None
    if re.fullmatch(r"\d{1,3}(?:[.,]\d{3})+", text):
        return int(text.replace(",", "").replace(".", ""))
    match = re.search(r"([0-9]+(?:[.,][0-9]+)*)\s*(k|m|b|md|mio)?", text)
    if not match:
        return None
    num_str = match.group(1)
    suffix = match.group(2) or ""
    if re.fullmatch(r"\d{1,3}(?:,\d{3})+", num_str):
        num_str = num_str.replace(",", "")
    elif re.fullmatch(r"\d{1,3}(?:\.\d{3})+", num_str) and not suffix:
        num_str = num_str.replace(".", "")
    else:
        num_str = num_str.replace(",", ".")
        if num_str.count(".") > 1:
            num_str = num_str.replace(".", "")
    try:
        value = float(num_str)
    except ValueError:
        return None
    multiplier = {"": 1, "k": 1_000, "m": 1_000_000, "mio": 1_000_000, "b": 1_000_000_000, "md": 1_000_000_000}.get(suffix, 1)
    return int(round(value * multiplier))


def parse_followers_from_meta(meta_content: str | None) -> int | None:
    """Extrait le nombre d'abonnés depuis la balise meta[name='description'] d'Instagram."""
    if not meta_content:
        return None
    match = re.search(
        r"([0-9][0-9.,\s\u202f\xa0]*\s*(?:k|m|b|md|mio)?)\s*(?:followers|abonn[ée]s)",
        meta_content,
        flags=re.IGNORECASE,
    )
    if not match:
        return None
    return parse_compact_number(match.group(1))


def extract_bio_from_meta(meta_content: str | None) -> str:
    """Extrait l'aperçu de bio depuis meta[name='description'] d'Instagram."""
    if not meta_content:
        return ""
    match = re.search(r'(?:on|sur)\s+Instagram\s*:\s*"(.*)"\s*$', meta_content, flags=re.DOTALL | re.IGNORECASE)
    if match:
        return " ".join(match.group(1).split())
    return ""


def classify_phase(start_sec: float) -> str:
    """Classe un segment audio dans la structure de rétention 9:16."""
    if start_sec < 3.0:
        return "0-3s Hook"
    if start_sec < 15.0:
        return "3-15s Problème/Mécanisme"
    return "15s-Fin Preuve/Transition/CTA"


def find_binary(candidates: list[Path], fallback_name: str) -> str:
    """Localise ffmpeg/ffprobe sur le système."""
    found = shutil.which(fallback_name)
    if found:
        return found
    for candidate in candidates:
        if candidate.exists():
            return str(candidate)
    raise FileNotFoundError(f"Binaire introuvable : {fallback_name}")


def load_discover_json(json_path: Path) -> dict[str, list[ReelItem]]:
    """Charge un export JSON issu de `discover_account` / `compare_accounts`."""
    payload = json.loads(json_path.read_text(encoding="utf-8"))
    accounts_raw = payload if isinstance(payload, list) else payload.get("accounts") or [payload]
    by_handle: dict[str, list[ReelItem]] = {}

    for entry in accounts_raw:
        if not isinstance(entry, dict):
            continue
        handle = normalize_handle(str(entry.get("username") or entry.get("handle") or "unknown"))
        media_list = entry.get("media") or entry.get("posts") or entry.get("data") or []
        items: list[ReelItem] = []
        for media in media_list:
            if not isinstance(media, dict):
                continue
            media_type = str(media.get("media_type") or media.get("media_product_type") or "").upper()
            permalink = str(media.get("permalink") or media.get("url") or "")
            if media_type and media_type not in {"VIDEO", "REELS", "REEL"} and "/reel/" not in permalink:
                continue
            if not permalink:
                continue
            views = parse_compact_number(media.get("view_count") or media.get("video_view_count") or media.get("play_count"))
            items.append(
                ReelItem(
                    handle=handle,
                    shortcode=extract_shortcode(permalink),
                    url=permalink,
                    views=views,
                    likes=int(media.get("like_count") or 0),
                    comments=int(media.get("comments_count") or 0),
                    caption=str(media.get("caption") or ""),
                    timestamp=str(media.get("timestamp") or ""),
                    source="discover_account",
                )
            )
        if items:
            by_handle[handle] = items
    return by_handle


def _extract_reels_from_graphql_obj(obj: Any, handle: str, sink: dict[str, ReelItem]) -> None:
    """Parcourt récursivement une réponse GraphQL Instagram pour extraire les Reels."""
    if isinstance(obj, list):
        for item in obj:
            _extract_reels_from_graphql_obj(item, handle, sink)
        return
    if not isinstance(obj, dict):
        return

    media = obj.get("media") if isinstance(obj.get("media"), dict) else obj
    code = media.get("code") or media.get("shortcode")
    if isinstance(code, str) and (
        "play_count" in media or "video_view_count" in media or "view_count" in media or media.get("media_type") == 2
    ):
        views = parse_compact_number(
            media.get("play_count") or media.get("video_view_count") or media.get("view_count")
        )
        caption_obj = media.get("caption")
        caption_text = caption_obj.get("text", "") if isinstance(caption_obj, dict) else str(caption_obj or "")
        existing = sink.get(code)
        if existing is None or (existing.views is None and views is not None):
            sink[code] = ReelItem(
                handle=handle,
                shortcode=code,
                url=f"https://www.instagram.com/reel/{code}/",
                views=views,
                likes=int(media.get("like_count") or 0),
                comments=int(media.get("comment_count") or 0),
                caption=caption_text,
                timestamp=str(media.get("taken_at") or ""),
                source="playwright_graphql",
            )

    for value in obj.values():
        if isinstance(value, (dict, list)):
            _extract_reels_from_graphql_obj(value, handle, sink)


def _scrape_profile_on_page(page: Any, handle: str, max_reels: int = 30, timeout_ms: int = 25000) -> tuple[int | None, str, list[ReelItem]]:
    """Extrait abonnés, bio et Reels récents sur la page publique /<handle>/reels/."""
    collected: dict[str, ReelItem] = {}
    url = f"https://www.instagram.com/{handle}/reels/"
    followers_count: int | None = None
    bio = ""

    def on_response(response: Any) -> None:
        try:
            if "graphql" not in response.url and "clips" not in response.url:
                return
            if response.status != 200:
                return
            data = response.json()
            _extract_reels_from_graphql_obj(data, handle, collected)
        except Exception:
            return

    page.on("response", on_response)
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
        page.wait_for_timeout(4500)
        for label in ("Allow all cookies", "Autoriser tous les cookies", "Decline optional cookies", "Refuser les cookies optionnels"):
            btn = page.get_by_role("button", name=label)
            if btn.count() > 0:
                try:
                    btn.first.click(timeout=1500)
                    page.wait_for_timeout(1200)
                    break
                except Exception:
                    pass

        meta_locator = page.locator('meta[name="description"]')
        if meta_locator.count() > 0:
            meta_desc = meta_locator.first.get_attribute("content")
            followers_count = parse_followers_from_meta(meta_desc)
            bio = extract_bio_from_meta(meta_desc)

        dom_rows: list[dict[str, Any]] = page.evaluate(
            """() => {
                const links = Array.from(document.querySelectorAll('a[href*="/reel/"]'));
                return links.map(a => ({
                    href: a.getAttribute('href') || '',
                    text: (a.innerText || '').trim(),
                    aria: a.getAttribute('aria-label') || '',
                    svgs: Array.from(a.querySelectorAll('svg')).map(s => s.getAttribute('aria-label') || '')
                }));
            }"""
        )
        for row in dom_rows:
            code = extract_shortcode(str(row.get("href") or ""))
            if not code:
                continue
            svgs = [str(s).lower() for s in (row.get("svgs") or [])]
            is_pinned = any("pinned" in s or "épinglé" in s for s in svgs)
            views = parse_compact_number(row.get("text")) or parse_compact_number(row.get("aria"))
            if code not in collected:
                collected[code] = ReelItem(
                    handle=handle,
                    shortcode=code,
                    url=f"https://www.instagram.com/reel/{code}/",
                    views=views,
                    source="playwright_dom",
                    is_pinned=is_pinned,
                )
            else:
                if collected[code].views is None and views is not None:
                    collected[code].views = views
                if is_pinned:
                    collected[code].is_pinned = True
    except Exception:
        pass
    finally:
        page.remove_listener("response", on_response)

    return followers_count, bio, list(collected.values())[:max_reels]


def scrape_reels_playwright(handle: str, max_reels: int = 30, timeout_ms: int = 25000) -> tuple[int | None, str, list[ReelItem]]:
    """Scrape la grille /reels/ publique d'un compte avec Playwright sans connexion."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return None, "", []

    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True)
        except Exception:
            return None, "", []
        page = browser.new_page()
        try:
            return _scrape_profile_on_page(page, handle, max_reels=max_reels, timeout_ms=timeout_ms)
        finally:
            browser.close()


def enrich_reel_via_ytdlp_metadata(reel: ReelItem) -> ReelItem:
    """Tente de récupérer les métadonnées publiques d'un Reel via yt-dlp sans télécharger la vidéo."""
    try:
        import yt_dlp
    except ImportError:
        return reel

    opts = {"quiet": True, "no_warnings": True, "skip_download": True, "extract_flat": False}
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(reel.url, download=False)
            if isinstance(info, dict):
                if reel.views is None:
                    reel.views = parse_compact_number(info.get("view_count"))
                if not reel.likes:
                    reel.likes = int(info.get("like_count") or 0)
                if not reel.comments:
                    reel.comments = int(info.get("comment_count") or 0)
                if not reel.caption:
                    reel.caption = str(info.get("description") or info.get("title") or "")
                if info.get("duration"):
                    reel.duration_sec = float(info["duration"])
                reel.source = f"{reel.source}+ytdlp_meta"
    except Exception:
        pass
    return reel


def compute_outliers(
    handle: str,
    reels: list[ReelItem],
    skip_newest: int = 2,
    min_ratio: float = 2.0,
    top_fallback: int = 2,
    max_outliers: int = 10,
    followers_count: int | None = None,
    bio: str = "",
) -> tuple[AccountSummary, list[tuple[ReelItem, float, float, str, bool]]]:
    """Calcule la médiane des Reels récents non épinglés et filtre les outliers >= min_ratio."""
    if not reels:
        return AccountSummary(handle, 0, 0.0, "views", "low", 0, followers_count=followers_count, bio=bio), []

    handle = reels[0].handle
    views_values = [r.views for r in reels if r.views is not None and r.views > 0]
    use_views = len(views_values) >= max(3, len(reels) // 2)
    metric_used = "views" if use_views else "engagement_fallback"

    def metric_of(item: ReelItem) -> float:
        if use_views:
            return float(item.views or 0)
        return float(item.engagement_score)

    unpinned = [r for r in reels if not r.is_pinned]
    pool_source = unpinned if unpinned else reels
    baseline_pool = pool_source[skip_newest:] if len(pool_source) > skip_newest + 3 else pool_source
    baseline_scores = [metric_of(r) for r in baseline_pool if metric_of(r) > 0]
    if not baseline_scores:
        baseline_scores = [metric_of(r) for r in pool_source if metric_of(r) > 0]

    median = float(statistics.median(baseline_scores)) if baseline_scores else 1.0
    if median <= 0:
        median = 1.0

    scored_unpinned: list[tuple[ReelItem, float, float, str, bool]] = []
    scored_pinned: list[tuple[ReelItem, float, float, str, bool]] = []
    for item in reels:
        score = metric_of(item)
        ratio = round(score / median, 2)
        if ratio >= min_ratio:
            target = scored_pinned if item.is_pinned else scored_unpinned
            target.append((item, median, ratio, metric_used, False))

    scored_unpinned.sort(key=lambda row: (row[2], metric_of(row[0])), reverse=True)
    scored_pinned.sort(key=lambda row: (row[2], metric_of(row[0])), reverse=True)
    scored = scored_unpinned if scored_unpinned else scored_pinned

    if not scored and top_fallback > 0:
        fallback_pool = unpinned if unpinned else reels
        ranked = sorted(fallback_pool, key=metric_of, reverse=True)[:top_fallback]
        for item in ranked:
            ratio = round(metric_of(item) / median, 2)
            scored.append((item, median, ratio, metric_used, True))

    selected = scored[:max_outliers]
    confidence = "high" if len(pool_source) >= 12 and use_views else ("medium" if len(pool_source) >= 6 else "low")
    sources = sorted({r.source for r in reels})
    summary = AccountSummary(
        handle=handle,
        total_fetched=len(reels),
        median_baseline=round(median, 1),
        metric_used=metric_used,
        confidence=confidence,
        outliers_found=sum(1 for row in selected if not row[4]),
        followers_count=followers_count,
        bio=bio,
        sources_used=sources,
    )
    return summary, selected


def download_reel_video(url: str, dest_dir: Path) -> tuple[Path, dict[str, Any]]:
    """Télécharge un Reel au format MP4 dans dest_dir (sous /tmp/ig-spy-cache)."""
    import yt_dlp

    dest_dir.mkdir(parents=True, exist_ok=True)
    out_tpl = str(dest_dir / "reel.%(ext)s")
    opts = {
        "outtmpl": out_tpl,
        "format": "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b",
        "merge_output_format": "mp4",
        "quiet": True,
        "no_warnings": True,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=True)
    mp4_path = dest_dir / "reel.mp4"
    if not mp4_path.exists():
        candidates = sorted(dest_dir.glob("reel.*"))
        if not candidates:
            raise FileNotFoundError(f"Échec du téléchargement vidéo pour {url}")
        mp4_path = candidates[0]
    return mp4_path, info if isinstance(info, dict) else {}


def get_video_duration(video_path: Path, ffmpeg_bin: str) -> float:
    """Mesure la durée exacte d'une vidéo via ffprobe ou av/ffmpeg."""
    try:
        ffprobe_bin = find_binary(FFPROBE_CANDIDATES, "ffprobe")
        res = subprocess.run(
            [ffprobe_bin, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(video_path)],
            capture_output=True,
            text=True,
            check=True,
        )
        return float(res.stdout.strip())
    except Exception:
        res = subprocess.run([ffmpeg_bin, "-i", str(video_path)], capture_output=True, text=True)
        match = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", res.stderr)
        if match:
            h, m, s = int(match.group(1)), int(match.group(2)), float(match.group(3))
            return h * 3600 + m * 60 + s
        return 30.0


def _load_wav_float32(wav_path: Path) -> Any:
    """Charge un fichier WAV PCM 16-bit mono 16kHz en numpy float32 sans dépendre de PyAV."""
    import wave
    import numpy as np

    with wave.open(str(wav_path), "rb") as wf:
        pcm = wf.readframes(wf.getnframes())
    if not pcm:
        return np.zeros(0, dtype=np.float32)
    return np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0


def transcribe_full_reel(
    video_path: Path,
    work_dir: Path,
    ffmpeg_bin: str,
    model_size: str = "base",
    language: str | None = None,
    whisper_model: Any | None = None,
) -> tuple[str, list[TranscriptSegment], dict[str, str]]:
    """Extrait l'audio complet et transcrit l'intégralité du Reel avec faster-whisper."""
    from faster_whisper import WhisperModel

    empty_phases = {
        "0-3s Hook": "",
        "3-15s Problème/Mécanisme": "",
        "15s-Fin Preuve/Transition/CTA": "",
    }
    wav_path = work_dir / "audio.wav"
    res = subprocess.run(
        [ffmpeg_bin, "-y", "-i", str(video_path), "-vn", "-acodec", "pcm_s16le", "-ac", "1", "-ar", "16000", str(wav_path)],
        capture_output=True,
        check=False,
    )
    if res.returncode != 0 or not wav_path.exists():
        return "", [], empty_phases

    audio_array = _load_wav_float32(wav_path)
    if audio_array.size == 0:
        return "", [], empty_phases

    model = whisper_model or WhisperModel(model_size, device="cpu", compute_type="int8")
    raw_segments, _ = model.transcribe(
        audio_array,
        language=None if not language or language == "auto" else language,
        beam_size=5,
        vad_filter=True,
    )

    segments: list[TranscriptSegment] = []
    phase_buckets: dict[str, list[str]] = {
        "0-3s Hook": [],
        "3-15s Problème/Mécanisme": [],
        "15s-Fin Preuve/Transition/CTA": [],
    }
    lines: list[str] = []
    for seg in raw_segments:
        text = seg.text.strip()
        if not text:
            continue
        phase = classify_phase(seg.start)
        ts_seg = TranscriptSegment(start=round(seg.start, 2), end=round(seg.end, 2), text=text, phase=phase)
        segments.append(ts_seg)
        phase_buckets[phase].append(text)
        lines.append(f"[{seg.start:05.1f}s -> {seg.end:05.1f}s] {text}")

    phases = {k: " ".join(v).strip() for k, v in phase_buckets.items()}
    return "\n".join(lines), segments, phases


def compute_storyboard_timestamps(duration_sec: float) -> list[float]:
    """Calcule les timestamps exacts : hook (0.5s, 1.5s, 3.0s) + 1 frame toutes les 3s."""
    if duration_sec <= 0.6:
        return [0.1]
    safe_end = max(0.2, duration_sec - 0.25)
    points = [0.5, 1.5, 3.0]
    cursor = 6.0
    while cursor < safe_end:
        points.append(round(cursor, 2))
        cursor += 3.0
    if safe_end > 3.5 and (not points or safe_end - points[-1] >= 1.5):
        points.append(round(safe_end, 2))
    unique = sorted({round(min(t, safe_end), 2) for t in points if t >= 0.0})
    return unique


def build_storyboard_grid(frame_paths: list[tuple[float, Path]], output_path: Path, columns: int = 4) -> Path:
    """Assemble les frames horodatées en une planche contact unique storyboard.jpg."""
    from PIL import Image, ImageDraw, ImageFont

    if not frame_paths:
        raise ValueError("Aucune frame extraite pour construire storyboard.jpg")

    thumb_w, thumb_h = 270, 480
    padding = 12
    rows = math.ceil(len(frame_paths) / columns)
    canvas_w = columns * thumb_w + (columns + 1) * padding
    canvas_h = rows * thumb_h + (rows + 1) * padding
    canvas = Image.new("RGB", (canvas_w, canvas_h), color=(18, 18, 20))
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()

    for idx, (ts, frame_file) in enumerate(frame_paths):
        row = idx // columns
        col = idx % columns
        x = padding + col * (thumb_w + padding)
        y = padding + row * (thumb_h + padding)

        with Image.open(frame_file) as img:
            img_rgb = img.convert("RGB")
            img_rgb.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            tile = Image.new("RGB", (thumb_w, thumb_h), color=(0, 0, 0))
            ox = (thumb_w - img_rgb.width) // 2
            oy = (thumb_h - img_rgb.height) // 2
            tile.paste(img_rgb, (ox, oy))
            canvas.paste(tile, (x, y))

        tag = "HOOK" if ts <= 3.05 else "BODY"
        label = f"{ts:05.1f}s [{tag}]"
        draw.rectangle([x + 6, y + 6, x + 128, y + 28], fill=(0, 0, 0))
        draw.text((x + 12, y + 11), label, fill=(255, 220, 90) if tag == "HOOK" else (240, 240, 240), font=font)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path, format="JPEG", quality=88, optimize=True)
    return output_path


def generate_storyboard(video_path: Path, work_dir: Path, ffmpeg_bin: str, duration_sec: float) -> Path:
    """Extrait les frames (hook + toutes les 3s) et génère storyboard.jpg."""
    frames_dir = work_dir / "frames"
    frames_dir.mkdir(parents=True, exist_ok=True)
    timestamps = compute_storyboard_timestamps(duration_sec)
    extracted: list[tuple[float, Path]] = []

    for idx, ts in enumerate(timestamps):
        frame_file = frames_dir / f"frame_{idx:03d}.jpg"
        subprocess.run(
            [ffmpeg_bin, "-y", "-ss", f"{ts:.2f}", "-i", str(video_path), "-frames:v", "1", "-q:v", "2", str(frame_file)],
            capture_output=True,
            check=False,
        )
        if frame_file.exists() and frame_file.stat().st_size > 0:
            extracted.append((ts, frame_file))

    storyboard_path = work_dir / "storyboard.jpg"
    return build_storyboard_grid(extracted, storyboard_path)


def cleanup_media_intermediates(work_dir: Path) -> None:
    """Supprime .mp4, .wav et frames individuelles après génération de storyboard.jpg."""
    for target in ("reel.mp4", "audio.wav"):
        path = work_dir / target
        if path.exists():
            path.unlink()
    for extra in work_dir.glob("reel.*"):
        if extra.is_file():
            extra.unlink()
    frames_dir = work_dir / "frames"
    if frames_dir.exists():
        shutil.rmtree(frames_dir, ignore_errors=True)


def append_to_swipe_md(swipe_path: Path, summaries: list[AccountSummary], analyses: list[OutlierAnalysis]) -> None:
    """Met à jour le rapport temporaire (/tmp/ig-spy-cache/swipe_report.md) avec la synthèse des outliers."""
    swipe_path.parent.mkdir(parents=True, exist_ok=True)
    today = dt.date.today().isoformat()
    header = "# Swipe file\n\n## Concepts\n\n*(Ajoute ou mets à jour les concepts validés après lecture des storyboards et scripts ci-dessous.)*\n\n"
    existing = swipe_path.read_text(encoding="utf-8") if swipe_path.exists() else header

    handles_line = ", ".join(
        f"@{s.handle} (médiane {int(s.median_baseline)} {s.metric_used}, {s.outliers_found} outliers)"
        for s in summaries
    )
    rows = [
        f"## {today} · Veille Instagram Outliers (0 Apify)",
        "",
        f"Comptes : {handles_line}",
        "",
        "| Score | Vues | Likes | Com/100v | Compte | Hook (0-3s) | Storyboard | URL |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for item in analyses:
        hook_preview = item.phases.get("0-3s Hook", "").replace("|", "/").replace("\n", " ")[:90] or "(visuel/sans parole)"
        views_str = f"{item.views:,}" if item.views is not None else "n/a"
        rows.append(
            f"| {item.outlier_ratio}x | {views_str} | {item.likes:,} | {item.comments_per_100_views:.2f} | @{item.handle} | \"{hook_preview}\" | `{item.storyboard_path}` | {item.url} |"
        )
    rows.append("")
    block = "\n".join(rows) + "\n"

    if "## Concepts" in existing:
        parts = existing.split("\n---\n", 1)
        updated = existing + "\n---\n\n" + block if len(parts) == 1 else parts[0] + "\n---\n\n" + block + parts[1]
    else:
        updated = header + block + existing
    swipe_path.write_text(updated, encoding="utf-8")


def process_selected_reels(
    selected: list[tuple[ReelItem, float, float, str, bool]],
    run_dir: Path,
    whisper_model: str,
    language: str,
    keep_raw: bool,
) -> list[OutlierAnalysis]:
    """Télécharge, transcrit intégralement et génère le storyboard pour chaque Reel retenu."""
    from faster_whisper import WhisperModel

    ffmpeg_bin = find_binary(FFMPEG_CANDIDATES, "ffmpeg")
    loaded_model = WhisperModel(whisper_model, device="cpu", compute_type="int8")
    analyses: list[OutlierAnalysis] = []

    for item, median, ratio, metric_used, below_threshold in selected:
        media_dir = run_dir / "media" / f"{item.handle}_{item.shortcode}"
        video_path, ytdlp_info = download_reel_video(item.url, media_dir)
        duration = item.duration_sec or float(ytdlp_info.get("duration") or 0.0) or get_video_duration(video_path, ffmpeg_bin)
        views = item.views if item.views is not None else parse_compact_number(ytdlp_info.get("view_count"))
        likes = item.likes or int(ytdlp_info.get("like_count") or 0)
        comments = item.comments or int(ytdlp_info.get("comment_count") or 0)
        caption = item.caption or str(ytdlp_info.get("description") or "")

        full_transcript, segments, phases = transcribe_full_reel(
            video_path,
            media_dir,
            ffmpeg_bin,
            model_size=whisper_model,
            language=language,
            whisper_model=loaded_model,
        )
        storyboard_path = generate_storyboard(video_path, media_dir, ffmpeg_bin, duration)

        if not keep_raw:
            cleanup_media_intermediates(media_dir)

        analyses.append(
            OutlierAnalysis(
                handle=item.handle,
                shortcode=item.shortcode,
                url=item.url,
                views=views,
                likes=likes,
                comments=comments,
                median_baseline=round(median, 1),
                outlier_ratio=ratio,
                metric_used=metric_used,
                below_threshold=below_threshold,
                duration_sec=round(duration, 2),
                caption=caption,
                full_transcript=full_transcript,
                phases=phases,
                segments=segments,
                storyboard_path=str(storyboard_path),
                source=item.source,
                is_pinned=item.is_pinned,
                comments_per_100_views=round((comments / views) * 100, 2) if (views and views > 0 and comments > 0) else 0.0,
            )
        )
    return analyses


def cmd_spy(args: argparse.Namespace) -> int:
    cache_root = Path(args.cache_dir)
    run_id = dt.datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + uuid.uuid4().hex[:6]
    run_dir = cache_root / "runs" / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    by_handle: dict[str, list[ReelItem]] = {}
    profile_meta: dict[str, tuple[int | None, str]] = {}
    if args.discover_json:
        by_handle.update(load_discover_json(Path(args.discover_json)))

    for raw_target in args.targets:
        handle = normalize_handle(raw_target)
        followers_count, bio, pw_reels = scrape_reels_playwright(handle, max_reels=args.max_reels)
        profile_meta[handle] = (followers_count, bio)
        existing = {r.shortcode: r for r in by_handle.get(handle, [])}
        for pw_item in pw_reels:
            if pw_item.shortcode in existing:
                if existing[pw_item.shortcode].views is None and pw_item.views is not None:
                    existing[pw_item.shortcode].views = pw_item.views
                    existing[pw_item.shortcode].source += "+playwright"
                if pw_item.is_pinned:
                    existing[pw_item.shortcode].is_pinned = True
            else:
                existing[pw_item.shortcode] = pw_item
        merged = list(existing.values())
        if args.enrich_meta:
            merged = [enrich_reel_via_ytdlp_metadata(r) if r.views is None else r for r in merged]
        by_handle[handle] = merged

    summaries: list[AccountSummary] = []
    all_selected: list[tuple[ReelItem, float, float, str, bool]] = []
    for handle, reels in by_handle.items():
        (run_dir / f"raw_{handle}.json").write_text(
            json.dumps([asdict(r) for r in reels], ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        followers_count, bio = profile_meta.get(handle, (None, ""))
        summary, selected = compute_outliers(
            handle,
            reels,
            skip_newest=args.skip_newest,
            min_ratio=args.min_ratio,
            top_fallback=args.top_fallback,
            max_outliers=args.max_outliers,
            followers_count=followers_count,
            bio=bio,
        )
        summaries.append(summary)
        all_selected.extend(selected)

    all_selected.sort(key=lambda row: (row[4], -row[2]))
    analyses: list[OutlierAnalysis] = []
    if not args.dry_run and all_selected:
        analyses = process_selected_reels(
            all_selected[: args.max_outliers],
            run_dir=run_dir,
            whisper_model=args.whisper_model,
            language=args.lang,
            keep_raw=args.keep_raw,
        )

    report = {
        "run_id": run_id,
        "cache_dir": str(run_dir),
        "summaries": [asdict(s) for s in summaries],
        "outliers": [asdict(a) for a in analyses],
    }
    report_path = run_dir / "report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.update_swipe and analyses:
        append_to_swipe_md(Path(args.swipe_file), summaries, analyses)

    print(json.dumps({"report_path": str(report_path), **report}, ensure_ascii=False, indent=2))
    return 0


def cmd_discover(args: argparse.Namespace) -> int:
    """Filtre des comptes candidats selon leur nombre d'abonnés et calcule leurs vues médianes."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print(json.dumps({"error": "playwright_missing"}))
        return 1

    cache_root = Path(args.cache_dir)
    run_id = dt.datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + uuid.uuid4().hex[:6]
    run_dir = cache_root / "runs" / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    handles: list[str] = []
    seen: set[str] = set()
    for raw in args.candidates:
        h = normalize_handle(raw)
        if h and h not in seen:
            seen.add(h)
            handles.append(h)

    matched: list[dict[str, Any]] = []
    rejected: list[dict[str, Any]] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            for handle in handles:
                followers_count, bio, reels = _scrape_profile_on_page(page, handle, max_reels=15)
                if not reels:
                    rejected.append({"handle": handle, "followers": followers_count, "reason": "no_reels_or_blocked"})
                    continue
                if followers_count is None and not args.allow_unknown_followers:
                    rejected.append({"handle": handle, "followers": None, "reason": "followers_unknown"})
                    continue
                if followers_count is not None and not (args.min_followers <= followers_count <= args.max_followers):
                    rejected.append({"handle": handle, "followers": followers_count, "reason": "out_of_follower_range"})
                    continue

                summary, selected = compute_outliers(
                    handle,
                    reels,
                    skip_newest=args.skip_newest,
                    min_ratio=args.min_ratio,
                    top_fallback=1,
                    max_outliers=3,
                    followers_count=followers_count,
                    bio=bio,
                )
                top_reel = selected[0] if selected else None
                matched.append(
                    {
                        "handle": handle,
                        "profile_url": f"https://www.instagram.com/{handle}/reels/",
                        "followers_count": followers_count,
                        "bio": bio,
                        "reels_scanned": len(reels),
                        "median_views": summary.median_baseline,
                        "outliers_found": summary.outliers_found,
                        "top_reel_url": top_reel[0].url if top_reel else "",
                        "top_reel_views": top_reel[0].views if top_reel else None,
                        "top_reel_ratio": top_reel[2] if top_reel else None,
                    }
                )
        finally:
            browser.close()

    matched.sort(key=lambda row: (row["outliers_found"], row["median_views"]), reverse=True)
    shortlisted = matched[: args.limit]
    payload = {
        "run_id": run_id,
        "min_followers": args.min_followers,
        "max_followers": args.max_followers,
        "matched_count": len(matched),
        "accounts": shortlisted,
        "rejected": rejected,
    }
    report_path = run_dir / "discover_report.json"
    report_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"report_path": str(report_path), **payload}, ensure_ascii=False, indent=2))
    return 0


def cmd_analyze_urls(args: argparse.Namespace) -> int:
    cache_root = Path(args.cache_dir)
    run_id = dt.datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + uuid.uuid4().hex[:6]
    run_dir = cache_root / "runs" / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    selected: list[tuple[ReelItem, float, float, str, bool]] = []
    for url in args.urls:
        item = enrich_reel_via_ytdlp_metadata(
            ReelItem(
                handle=normalize_handle(args.handle),
                shortcode=extract_shortcode(url),
                url=url,
                source="direct_url",
            )
        )
        selected.append((item, float(item.views or 1), 1.0, "views" if item.views else "direct", False))

    analyses = process_selected_reels(
        selected,
        run_dir=run_dir,
        whisper_model=args.whisper_model,
        language=args.lang,
        keep_raw=args.keep_raw,
    )
    report = {"run_id": run_id, "cache_dir": str(run_dir), "outliers": [asdict(a) for a in analyses]}
    report_path = run_dir / "report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"report_path": str(report_path), **report}, ensure_ascii=False, indent=2))
    return 0


def cmd_clean(args: argparse.Namespace) -> int:
    cache_root = Path(args.cache_dir)
    if cache_root.exists():
        shutil.rmtree(cache_root, ignore_errors=True)
    print(json.dumps({"cleaned": str(cache_root), "status": "ok"}))
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Veille concurrentielle Instagram Reels (0 Apify, 100% local).")
    parser.add_argument("--cache-dir", default=str(DEFAULT_CACHE_DIR), help="Dossier temporaire hors workspace (défaut: /tmp/ig-spy-cache)")
    sub = parser.add_subparsers(dest="command", required=True)

    p_spy = sub.add_parser("spy", help="Analyse des comptes concurrents et extraction des outliers")
    p_spy.add_argument("targets", nargs="*", help="Handles (@nom) ou URLs Instagram")
    p_spy.add_argument("--discover-json", help="Fichier JSON issu de discover_account / compare_accounts")
    p_spy.add_argument("--max-reels", type=int, default=30, help="Nombre max de Reels scannés par compte (défaut: 30)")
    p_spy.add_argument("--skip-newest", type=int, default=2, help="Nombre de Reels récents non épinglés exclus de la médiane (défaut: 2)")
    p_spy.add_argument("--min-ratio", type=float, default=2.0, help="Ratio minimum par rapport à la médiane (défaut: 2.0)")
    p_spy.add_argument("--top-fallback", type=int, default=2, help="Nombre max de top vidéos si aucun >= min_ratio")
    p_spy.add_argument("--max-outliers", type=int, default=10, help="Limite totale d'outliers à télécharger/transcrire")
    p_spy.add_argument("--whisper-model", default="base", help="Modèle faster-whisper (tiny, base, small, medium)")
    p_spy.add_argument("--lang", default="auto", help="Code langue (fr, en, auto)")
    p_spy.add_argument("--enrich-meta", action="store_true", help="Complète les vues manquantes via yt-dlp")
    p_spy.add_argument("--keep-raw", action="store_true", help="Conserve les .mp4/.wav/frames bruts dans /tmp/ig-spy-cache")
    p_spy.add_argument("--dry-run", action="store_true", help="Calcule médiane/outliers sans télécharger ni transcrire")
    p_spy.add_argument("--update-swipe", action="store_true", help="Ajoute la synthèse propre dans --swipe-file (hors workspace)")
    p_spy.add_argument("--swipe-file", default="/tmp/ig-spy-cache/swipe_report.md", help="Chemin du rapport swipe (défaut: /tmp/ig-spy-cache/swipe_report.md)")
    p_spy.set_defaults(func=cmd_spy)

    p_discover = sub.add_parser("discover", help="Filtre des comptes candidats selon leurs abonnés et calcule leur médiane")
    p_discover.add_argument("candidates", nargs="+", help="Handles candidats (@nom ou URL)")
    p_discover.add_argument("--min-followers", type=int, default=1000, help="Minimum d'abonnés (défaut: 1000)")
    p_discover.add_argument("--max-followers", type=int, default=150000, help="Maximum d'abonnés (défaut: 150000)")
    p_discover.add_argument("--limit", type=int, default=8, help="Nombre maximum de comptes retenus (défaut: 8)")
    p_discover.add_argument("--skip-newest", type=int, default=2, help="Reels récents exclus de la médiane (défaut: 2)")
    p_discover.add_argument("--min-ratio", type=float, default=2.0, help="Ratio outlier minimum (défaut: 2.0)")
    p_discover.add_argument("--allow-unknown-followers", action="store_true", help="Garde les profils dont meta[description] ne publie pas les abonnés")
    p_discover.set_defaults(func=cmd_discover)

    p_urls = sub.add_parser("analyze-urls", help="Transcrit intégralement et génère storyboard.jpg pour des URLs précises")
    p_urls.add_argument("urls", nargs="+", help="URLs de Reels Instagram")
    p_urls.add_argument("--handle", default="competitor", help="Handle associé pour le nommage")
    p_urls.add_argument("--whisper-model", default="base", help="Modèle faster-whisper")
    p_urls.add_argument("--lang", default="auto", help="Code langue (fr, en, auto)")
    p_urls.add_argument("--keep-raw", action="store_true", help="Conserve les fichiers bruts dans /tmp/ig-spy-cache")
    p_urls.set_defaults(func=cmd_analyze_urls)

    p_clean = sub.add_parser("clean", help="Supprime tout le cache temporaire /tmp/ig-spy-cache")
    p_clean.set_defaults(func=cmd_clean)
    return parser


def main() -> int:
    ensure_dedicated_venv()
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
