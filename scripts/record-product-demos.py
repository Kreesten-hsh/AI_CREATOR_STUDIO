#!/usr/bin/env python3
"""
scripts/record-product-demos.py
Capture plein écran 1920x1080 (16:9 uniquement), posée (>= 20s chacune) et fluide
avec trajectoire souris enregistrée en continu via requestAnimationFrame pour un vrai
suivi caméra amorti dans Remotion (sans cadre, sans texte ajouté, sans bruitage).

Sorties :
  output/videos/raw-mini-cours-desktop.mp4
  output/videos/raw-solde-desktop.mp4
  output/videos/demo-cues.json
"""

from __future__ import annotations

import functools
import http.server
import json
import os
import shutil
import socketserver
import subprocess
import sys
import tempfile
import threading
import time
from pathlib import Path
from typing import Any

from playwright.sync_api import Locator, Page, sync_playwright

ROOT_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = ROOT_DIR / "dist"
OUTPUT_DIR = ROOT_DIR / "output" / "videos"
VIDEO_STUDIO_ASSETS_DIR = ROOT_DIR / "video-studio" / "assets" / "demos"

FPS = 30
VIEWPORT_W = 1920
VIEWPORT_H = 1080
MIN_DURATION_MS = 21500  # Strictement >= 20.0s pile (~21.5s posé)

CHROME_CANDIDATES = [
    os.environ.get("CHROME_BIN", ""),
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/opt/google/chrome/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
]

BROWSER_CHOREO_JS = r"""
(() => {
  if (window.__demoRuntimeInstalled) return;
  window.__demoRuntimeInstalled = true;

  const state = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    zoom: 1.0,
    tracking: false,
    originPerfMs: 0,
    samples: [],
    lastSampleMs: -999,
  };

  const ensureOverlay = () => {
    if (!document.body) return null;
    let cursor = document.getElementById('__demo_cursor');
    if (!cursor) {
      const style = document.createElement('style');
      style.textContent = `
        #__demo_cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 26px;
          height: 30px;
          pointer-events: none;
          z-index: 2147483647;
          transform: translate3d(-100px, -100px, 0);
          filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.34));
          will-change: transform;
        }
        #__demo_ripple {
          position: fixed;
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          margin-left: -15px;
          margin-top: -15px;
          border-radius: 9999px;
          border: 2px solid rgba(17, 17, 17, 0.45);
          background: rgba(255, 255, 255, 0.25);
          pointer-events: none;
          z-index: 2147483646;
          opacity: 0;
          transform: translate3d(-100px, -100px, 0) scale(0.3);
          will-change: transform, opacity;
        }
        #__demo_ripple.is-popping {
          animation: __demoRipplePop 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes __demoRipplePop {
          0% { opacity: 0.85; transform: translate3d(var(--rx), var(--ry), 0) scale(0.35); }
          100% { opacity: 0; transform: translate3d(var(--rx), var(--ry), 0) scale(1.7); }
        }
      `;
      (document.head || document.documentElement).appendChild(style);

      cursor = document.createElement('div');
      cursor.id = '__demo_cursor';
      cursor.innerHTML = `
        <svg width="26" height="30" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 2L3 25L9.5 19L14.5 29L18.5 27L13.5 17L23 17L3 2Z"
                fill="#111111" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      `;
      document.body.appendChild(cursor);

      const ripple = document.createElement('div');
      ripple.id = '__demo_ripple';
      document.body.appendChild(ripple);

      const hb = document.createElement('div');
      hb.id = '__demo_heartbeat';
      hb.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;background:#888;opacity:0.004;pointer-events:none;z-index:2147483645;';
      document.body.appendChild(hb);
    }
    return cursor;
  };

  const renderCursor = () => {
    const cursor = ensureOverlay();
    if (cursor) {
      cursor.style.transform = `translate3d(${(state.x - 3).toFixed(2)}px, ${(state.y - 2).toFixed(2)}px, 0)`;
    }
  };

  let hbFlip = false;
  const recordSample = (nowPerf) => {
    if (!state.tracking) return;
    const hb = document.getElementById('__demo_heartbeat');
    if (hb) {
      hbFlip = !hbFlip;
      hb.style.opacity = hbFlip ? '0.004' : '0.008';
    }
    const tMs = Math.max(0, Math.round(nowPerf - state.originPerfMs));
    if (tMs - state.lastSampleMs >= 16) {
      state.lastSampleMs = tMs;
      state.samples.push({
        tMs,
        nx: Number(Math.max(0, Math.min(1, state.x / window.innerWidth)).toFixed(4)),
        ny: Number(Math.max(0, Math.min(1, state.y / window.innerHeight)).toFixed(4)),
        zoom: Number(state.zoom.toFixed(3)),
      });
    }
  };

  const tick = (nowPerf) => {
    recordSample(nowPerf);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  window.__demoStartTracking = (startX, startY, initialZoom = 1.0) => {
    state.x = startX;
    state.y = startY;
    state.zoom = initialZoom;
    state.originPerfMs = performance.now();
    state.lastSampleMs = -999;
    state.samples = [];
    state.tracking = true;
    renderCursor();
    recordSample(state.originPerfMs);
  };

  window.__demoSetZoom = (z) => {
    state.zoom = z;
  };

  window.__demoGetSamples = () => {
    recordSample(performance.now());
    return state.samples;
  };

  window.__demoGlideTo = (tx, ty, durationMs = 680) => {
    return new Promise((resolve) => {
      ensureOverlay();
      const sx = state.x;
      const sy = state.y;
      const start = performance.now();
      const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

      const step = (now) => {
        const p = Math.min(1, (now - start) / Math.max(1, durationMs));
        const e = easeInOutCubic(p);
        state.x = sx + (tx - sx) * e;
        state.y = sy + (ty - sy) * e;
        renderCursor();
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          state.x = tx;
          state.y = ty;
          renderCursor();
          resolve(true);
        }
      };
      requestAnimationFrame(step);
    });
  };

  window.__demoScrollBy = (deltaY, durationMs = 650) => {
    return new Promise((resolve) => {
      const startY = window.scrollY;
      const targetY = Math.max(0, startY + deltaY);
      const start = performance.now();
      const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

      const step = (now) => {
        const p = Math.min(1, (now - start) / Math.max(1, durationMs));
        const e = easeInOutCubic(p);
        window.scrollTo(0, startY + (targetY - startY) * e);
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          window.scrollTo(0, targetY);
          resolve(true);
        }
      };
      requestAnimationFrame(step);
    });
  };

  window.__demoPopRipple = (x, y) => {
    ensureOverlay();
    const ripple = document.getElementById('__demo_ripple');
    if (!ripple) return;
    ripple.style.setProperty('--rx', `${x}px`);
    ripple.style.setProperty('--ry', `${y}px`);
    ripple.classList.remove('is-popping');
    void ripple.offsetWidth;
    ripple.classList.add('is-popping');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCursor, { once: true });
  } else {
    renderCursor();
  }
})();
"""


class QuietSpaHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args: Any, directory: str, spa_fallback: bool = False, **kwargs: Any) -> None:
        self.spa_fallback = spa_fallback
        super().__init__(*args, directory=directory, **kwargs)

    def log_message(self, format: str, *args: Any) -> None:  # noqa: A002
        return

    def send_head(self) -> Any:
        if self.spa_fallback:
            req_path = self.path.split("?", 1)[0]
            translated = Path(self.translate_path(req_path))
            if not translated.exists() or translated.is_dir():
                index_file = Path(self.directory) / "index.html"
                if index_file.exists():
                    self.path = "/index.html"
        return super().send_head()


class ReusableTcpServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


def start_server(directory: Path, spa_fallback: bool = False) -> tuple[ReusableTcpServer, str]:
    handler = functools.partial(QuietSpaHandler, directory=str(directory), spa_fallback=spa_fallback)
    server = ReusableTcpServer(("127.0.0.1", 0), handler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, f"http://127.0.0.1:{port}"


def find_chrome() -> str | None:
    for candidate in CHROME_CANDIDATES:
        if candidate and Path(candidate).exists():
            return candidate
    return None


class SmoothChoreographer:
    def __init__(self, page: Page) -> None:
        self.page = page
        self.t0_ms = 0.0

    def start(self, x: float = VIEWPORT_W * 0.5, y: float = VIEWPORT_H * 0.45, zoom: float = 1.0) -> None:
        self.t0_ms = time.monotonic() * 1000.0
        self.page.mouse.move(x, y)
        self.page.evaluate("([x, y, z]) => window.__demoStartTracking(x, y, z)", [x, y, zoom])

    def now_ms(self) -> int:
        return max(0, round(time.monotonic() * 1000.0 - self.t0_ms))

    def set_zoom(self, zoom: float) -> None:
        self.page.evaluate("(z) => window.__demoSetZoom(z)", zoom)

    def glide_to(self, tx: float, ty: float, duration_ms: int = 720, zoom: float | None = None) -> None:
        if zoom is not None:
            self.set_zoom(zoom)
        self.page.evaluate(
            "([x, y, d]) => window.__demoGlideTo(x, y, d)",
            [tx, ty, duration_ms],
        )
        self.page.mouse.move(tx, ty)

    def center_of(self, locator: Locator) -> tuple[float, float]:
        box = locator.bounding_box()
        if not box or box["y"] < 40 or box["y"] + box["height"] > VIEWPORT_H - 40:
            locator.scroll_into_view_if_needed()
            self.page.wait_for_timeout(120)
            box = locator.bounding_box()
        if not box:
            raise RuntimeError(f"Bounding box introuvable pour : {locator}")
        return box["x"] + box["width"] / 2.0, box["y"] + box["height"] / 2.0

    def glide_and_click(
        self,
        locator: Locator,
        duration_ms: int = 700,
        hover_ms: int = 240,
        zoom: float | None = None,
    ) -> tuple[float, float]:
        tx, ty = self.center_of(locator)
        self.glide_to(tx, ty, duration_ms=duration_ms, zoom=zoom)
        if hover_ms > 0:
            self.page.wait_for_timeout(hover_ms)
        self.page.evaluate("([x, y]) => window.__demoPopRipple(x, y)", [tx, ty])
        self.page.mouse.click(tx, ty)
        return tx, ty

    def smooth_scroll(self, delta_y: float, duration_ms: int = 700) -> None:
        self.page.evaluate("([dy, d]) => window.__demoScrollBy(dy, d)", [delta_y, duration_ms])

    def collect_track(self) -> list[dict[str, Any]]:
        raw = self.page.evaluate("() => window.__demoGetSamples()")
        track: list[dict[str, Any]] = []
        for s in raw:
            t_ms = int(s["tMs"])
            track.append(
                {
                    "tMs": t_ms,
                    "frame": round((t_ms / 1000.0) * FPS),
                    "nx": float(s["nx"]),
                    "ny": float(s["ny"]),
                    "zoom": float(s["zoom"]),
                }
            )
        return track


def probe_nb_frames(mp4_path: Path) -> int:
    probe = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-count_frames",
            "-show_entries",
            "stream=nb_read_frames",
            "-of",
            "default=nw=1:nk=1",
            str(mp4_path),
        ],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return int(probe.stdout.strip())


def transcode_silent_cfr_mp4(
    raw_webm: Path,
    out_mp4: Path,
    target_duration_sec: float,
) -> int:
    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    temp_full = out_mp4.with_name(f".{out_mp4.stem}.full.tmp.mp4")
    try:
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(raw_webm),
                "-an",
                "-vf",
                f"fps={FPS},setpts=PTS-STARTPTS",
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-crf",
                "12",
                "-preset",
                "ultrafast",
                str(temp_full),
            ],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        full_frames = probe_nb_frames(temp_full)
        full_dur_sec = full_frames / FPS
        trim_start_sec = max(0.0, full_dur_sec - target_duration_sec)
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-ss",
                f"{trim_start_sec:.3f}",
                "-i",
                str(temp_full),
                "-t",
                f"{target_duration_sec:.3f}",
                "-an",
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-crf",
                "14",
                "-preset",
                "medium",
                "-movflags",
                "+faststart",
                str(out_mp4),
            ],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        return probe_nb_frames(out_mp4)
    finally:
        temp_full.unlink(missing_ok=True)


def record_mini_cours(browser: Any, dist_url: str, tmp_dir: Path) -> dict[str, Any]:
    preseed_progress = json.dumps(
        {
            "schemaVersion": 4,
            "curriculumModel": "3m-3d-7l",
            "activeRoute": {"kind": "home"},
            "activeStepIdByLesson": {"lesson-02": "lesson-02-step-02"},
            "completedStepIdsByLesson": {
                "lesson-01": ["lesson-01-step-01", "lesson-01-step-02", "lesson-01-step-03"],
                "lesson-02": ["lesson-02-step-01", "lesson-02-step-02"],
            },
            "checklistAnswers": {},
            "exerciseAnswers": {},
            "quizStates": {},
            "savedPrompts": {},
            "customPromptInputs": {},
            "profile": {
                "studentName": "",
                "business": "",
                "targetAudience": "",
                "productType": "",
                "brandStyle": "",
                "mainObjective": "",
                "vibe": {"paletteId": "studio", "styleId": "brutal", "typographyId": "editorial"},
                "customVariables": {},
            },
            "lastUpdated": "2026-11-24T00:00:00.000Z",
        }
    )

    context = browser.new_context(
        viewport={"width": VIEWPORT_W, "height": VIEWPORT_H},
        device_scale_factor=1,
        record_video_dir=str(tmp_dir),
        record_video_size={"width": VIEWPORT_W, "height": VIEWPORT_H},
    )
    page = context.new_page()
    page.add_init_script(BROWSER_CHOREO_JS)
    page.add_init_script(
        f"localStorage.setItem('ai_creator_studio_progress_v1', {json.dumps(preseed_progress)});"
    )

    page_errors: list[str] = []
    page.on("pageerror", lambda err: page_errors.append(str(err)))

    page.goto(f"{dist_url}/", wait_until="networkidle")
    page.evaluate("() => document.fonts.ready")
    page.wait_for_timeout(300)

    choreo = SmoothChoreographer(page)
    choreo.start(VIEWPORT_W * 0.5, VIEWPORT_H * 0.42, zoom=1.0)

    # 1. Accueil posé (~0s -> 3.4s)
    page.wait_for_timeout(1400)
    cta_home = page.get_by_role("button", name="Continuer").first
    choreo.glide_and_click(cta_home, duration_ms=780, hover_ms=260, zoom=1.28)
    page.wait_for_timeout(900)

    # 2. Leçon 02 -> Onglet Étape 3 Valider (~3.4s -> 7.6s)
    choreo.set_zoom(1.06)
    page.wait_for_timeout(700)
    step3_tab = page.locator("#step-tab-lesson-02-step-03")
    choreo.glide_and_click(step3_tab, duration_ms=760, hover_ms=240, zoom=1.34)
    page.wait_for_timeout(900)

    # 3. Scroll doux vers la checklist & validation de 2 points (~7.6s -> 12.2s)
    choreo.smooth_scroll(320, duration_ms=700)
    page.wait_for_timeout(350)

    checks = page.locator("button[role='checkbox'], input[type='checkbox']")
    if checks.count() >= 1:
        choreo.glide_and_click(checks.nth(0), duration_ms=650, hover_ms=200, zoom=1.36)
        page.wait_for_timeout(450)
    if checks.count() >= 2:
        choreo.glide_and_click(checks.nth(1), duration_ms=560, hover_ms=180, zoom=1.36)
        page.wait_for_timeout(450)

    choreo.smooth_scroll(340, duration_ms=650)
    page.wait_for_timeout(250)

    # 4. Clic sur Terminer la Leçon 2 -> Modale & Confettis Lottie (~12.2s -> 18.2s)
    complete_btn = page.get_by_role("button", name="Terminer la Leçon 2")
    choreo.glide_and_click(complete_btn, duration_ms=700, hover_ms=240, zoom=1.32)
    page.locator('[role="dialog"]').wait_for(state="visible", timeout=5000)
    page.locator('[data-testid="confetti-animation"]').wait_for(state="visible", timeout=5000)

    # Plan large posé pour apprécier les confettis Lottie
    choreo.glide_to(VIEWPORT_W * 0.5, VIEWPORT_H * 0.5, duration_ms=600, zoom=1.0)
    page.wait_for_timeout(3900)

    # Clic sur Continuer -> Module 02 CRÉER
    dialog_continue = page.locator('[role="dialog"]').get_by_role("button", name="Continuer")
    choreo.glide_and_click(dialog_continue, duration_ms=700, hover_ms=260, zoom=1.18)
    page.wait_for_timeout(900)

    # 5. Vue finale posée sur le Module 02 (~18.2s -> 22.0s)
    choreo.glide_to(VIEWPORT_W * 0.5, VIEWPORT_H * 0.45, duration_ms=750, zoom=1.0)
    choreo.smooth_scroll(180, duration_ms=700)

    remaining = MIN_DURATION_MS - choreo.now_ms()
    if remaining > 0:
        page.wait_for_timeout(remaining + 300)
    else:
        page.wait_for_timeout(500)

    mouse_track = choreo.collect_track()
    final_ms = choreo.now_ms()
    video_path = Path(page.video.path())
    context.close()

    if page_errors:
        raise RuntimeError(f"Erreurs JS capturées sur Mini-Cours : {page_errors}")

    out_mp4 = OUTPUT_DIR / "raw-mini-cours-desktop.mp4"
    actual_frames = transcode_silent_cfr_mp4(video_path, out_mp4, final_ms / 1000.0)

    return {
        "video": str(out_mp4.relative_to(ROOT_DIR)),
        "width": VIEWPORT_W,
        "height": VIEWPORT_H,
        "durationMs": round((actual_frames / FPS) * 1000),
        "frames": actual_frames,
        "mouseTrack": mouse_track,
    }


def record_solde(browser: Any, root_url: str, tmp_dir: Path) -> dict[str, Any]:
    context = browser.new_context(
        viewport={"width": VIEWPORT_W, "height": VIEWPORT_H},
        device_scale_factor=1,
        record_video_dir=str(tmp_dir),
        record_video_size={"width": VIEWPORT_W, "height": VIEWPORT_H},
    )
    page = context.new_page()
    page.route(
        "**/*",
        lambda route: route.continue_()
        if route.request.url.startswith(("http://127.0.0.1", "data:", "blob:"))
        else route.abort(),
    )
    page.add_init_script(BROWSER_CHOREO_JS)

    page_errors: list[str] = []
    page.on("pageerror", lambda err: page_errors.append(str(err)))

    page.goto(f"{root_url}/docs/examples/solde/index.html", wait_until="load")
    page.evaluate("() => document.fonts.ready")
    page.wait_for_timeout(300)

    choreo = SmoothChoreographer(page)
    choreo.start(VIEWPORT_W * 0.5, VIEWPORT_H * 0.46, zoom=1.0)

    # 1. Écran de verrouillage .gate posé (~0s -> 4.6s)
    page.wait_for_timeout(1000)
    gate_input = page.locator("#gateInput")
    choreo.glide_and_click(gate_input, duration_ms=720, hover_ms=200, zoom=1.38)
    for ch in "SOLDE2026":
        page.keyboard.type(ch)
        page.wait_for_timeout(105)
    page.wait_for_timeout(240)

    gate_btn = page.locator("#gateSubmitBtn")
    choreo.glide_and_click(gate_btn, duration_ms=520, hover_ms=240, zoom=1.34)
    page.wait_for_timeout(950)

    # 2. Vue d'ensemble du cockpit + changement de profil (~4.6s -> 9.2s)
    choreo.glide_to(VIEWPORT_W * 0.5, VIEWPORT_H * 0.35, duration_ms=650, zoom=1.0)
    page.wait_for_timeout(900)

    creator_tab = page.locator('[data-profile="creator"]')
    choreo.glide_and_click(creator_tab, duration_ms=720, hover_ms=260, zoom=1.32)
    page.wait_for_timeout(1200)

    # 3. Crash-test imprévu +40k puis travelling souris vers le cockpit Score /100 (~9.2s -> 15.2s)
    shock_btn = page.locator('.shock-btn[data-shock="40000"]')
    choreo.glide_and_click(shock_btn, duration_ms=800, hover_ms=260, zoom=1.38)
    page.wait_for_timeout(1100)

    # Glissement lent vers le cockpit Score /100 & objectif à droite
    choreo.glide_to(VIEWPORT_W * 0.72, VIEWPORT_H * 0.44, duration_ms=1150, zoom=1.36)
    page.wait_for_timeout(1500)

    # 4. Bascule devises € EUR <-> FCFA (~15.2s -> 19.2s)
    btn_eur = page.locator("#btnEUR")
    choreo.glide_and_click(btn_eur, duration_ms=820, hover_ms=260, zoom=1.34)
    page.wait_for_timeout(1850)

    btn_fcfa = page.locator("#btnFCFA")
    choreo.glide_and_click(btn_fcfa, duration_ms=520, hover_ms=220, zoom=1.28)
    page.wait_for_timeout(950)

    # 5. Reverrouillage instantané #lockBtn (~19.2s -> 22.0s)
    lock_btn = page.locator("#lockBtn")
    choreo.glide_and_click(lock_btn, duration_ms=680, hover_ms=260, zoom=1.26)
    page.wait_for_timeout(450)
    choreo.glide_to(VIEWPORT_W * 0.5, VIEWPORT_H * 0.5, duration_ms=650, zoom=1.0)

    remaining = MIN_DURATION_MS - choreo.now_ms()
    if remaining > 0:
        page.wait_for_timeout(remaining + 300)
    else:
        page.wait_for_timeout(600)

    mouse_track = choreo.collect_track()
    final_ms = choreo.now_ms()
    video_path = Path(page.video.path())
    context.close()

    if page_errors:
        raise RuntimeError(f"Erreurs JS capturées sur SOLDE : {page_errors}")

    out_mp4 = OUTPUT_DIR / "raw-solde-desktop.mp4"
    actual_frames = transcode_silent_cfr_mp4(video_path, out_mp4, final_ms / 1000.0)

    return {
        "video": str(out_mp4.relative_to(ROOT_DIR)),
        "width": VIEWPORT_W,
        "height": VIEWPORT_H,
        "durationMs": round((actual_frames / FPS) * 1000),
        "frames": actual_frames,
        "mouseTrack": mouse_track,
    }


def main() -> int:
    if not DIST_DIR.exists():
        print("❌ dist/ introuvable. Lance d'abord `npm run build`.", file=sys.stderr)
        return 1

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    VIDEO_STUDIO_ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    chrome_exe = find_chrome()
    print(f"🎬 Navigateur détecté : {chrome_exe or 'Playwright bundled'}")

    dist_server, dist_url = start_server(DIST_DIR, spa_fallback=True)
    root_server, root_url = start_server(ROOT_DIR, spa_fallback=False)

    manifest: dict[str, Any] = {"fps": FPS, "clips": {}}

    try:
        with tempfile.TemporaryDirectory(prefix="demos_rec_1080_") as tmp:
            tmp_dir = Path(tmp)
            with sync_playwright() as pw:
                launch_kwargs: dict[str, Any] = {"headless": True}
                if chrome_exe:
                    launch_kwargs["executable_path"] = chrome_exe
                browser = pw.chromium.launch(**launch_kwargs)
                try:
                    for key, fn, url in [
                        ("miniCoursDesktop", record_mini_cours, dist_url),
                        ("soldeDesktop", record_solde, root_url),
                    ]:
                        print(f"🔴 Capture 1920x1080 en cours : {key}...")
                        info = fn(browser, url, tmp_dir)
                        manifest["clips"][key] = info
                        src_mp4 = ROOT_DIR / info["video"]
                        shutil.copy2(src_mp4, VIDEO_STUDIO_ASSETS_DIR / src_mp4.name)
                        last_t = info["mouseTrack"][-1]["tMs"] if info["mouseTrack"] else 0
                        sync_delta = abs(info["durationMs"] - last_t)
                        print(
                            f"   ✅ {info['video']} ({info['width']}x{info['height']}, "
                            f"{info['durationMs']}ms / {info['frames']} frames, "
                            f"{len(info['mouseTrack'])} samples souris, syncDelta={sync_delta}ms)"
                        )
                        if info["frames"] < 600:
                            raise RuntimeError(
                                f"{key} trop court : {info['frames']} frames (< 600 frames / 20.0s)"
                            )
                finally:
                    browser.close()
    finally:
        dist_server.shutdown()
        root_server.shutdown()

    manifest_path = OUTPUT_DIR / "demo-cues.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    shutil.copy2(manifest_path, VIDEO_STUDIO_ASSETS_DIR / "demo-cues.json")
    print(f"📄 Manifest écrit : {manifest_path.relative_to(ROOT_DIR)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
