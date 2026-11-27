#!/usr/bin/env python3
"""Collecte des grilles YouTube Shorts : médiane de vues par chaîne et multiple par vidéo.

Usage :
    python3 grid_harvest.py @canal1 @canal2 ...
    python3 grid_harvest.py --file handles.txt --json /tmp/ig-spy-cache/yt_shorts.json --min-videos 6
"""

import argparse
import json
import re
import statistics
import sys
import urllib.error
import urllib.request

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)


def fetch(url, timeout=25):
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        "Cookie": "CONSENT=YES+1",
    })
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", errors="replace")


def extract_initial_data(html):
    """Extrait le JSON ytInitialData de la page HTML YouTube."""
    m = re.search(r"var ytInitialData\s*=\s*(\{.*?\});</script>", html, re.S)
    if not m:
        m = re.search(r'ytInitialData"\]\s*=\s*(\{.*?\});</script>', html, re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return None


_ACC_RE = re.compile(
    r"^(?P<title>.+?),\s*(?P<num>[\d.,\s]+?)\s*"
    r"(?P<unit>milliards?|millions?|milhões|milhão|bilhões|bilhão|mille|mil|mi|bi|K|M|B|k|m|b)?\s*"
    r"(?:de\s+)?(?:vues?|visualiza|views?|watch)",
    re.I,
)

_MULT = {
    "mil": 1e3, "mille": 1e3, "k": 1e3,
    "million": 1e6, "millions": 1e6, "milhão": 1e6, "milhões": 1e6, "mi": 1e6, "m": 1e6,
    "milliard": 1e9, "milliards": 1e9, "bilhão": 1e9, "bilhões": 1e9, "bi": 1e9, "b": 1e9,
}


def parse_accessibility(text):
    """'<titre>, 3,9 millions de vues ...' -> (titre, 3900000)."""
    if not text:
        return None, None
    clean = text.replace("\xa0", " ").replace("\u202f", " ").strip()
    m = _ACC_RE.match(clean)
    if not m:
        return None, None
    num, unit = m.group("num").strip(), m.group("unit")
    if unit:
        num = num.replace(" ", "").replace(".", ",")
        parts = num.split(",")
        num = parts[0] + ("." + parts[1] if len(parts) > 1 else "")
        try:
            val = float(num)
        except ValueError:
            return None, None
        return m.group("title").strip(), int(val * _MULT[unit.lower()])
    digits = re.sub(r"[.,\s]", "", num)
    if not digits.isdigit():
        return None, None
    return m.group("title").strip(), int(digits)


def walk(node, out):
    """Collecte récursivement chaque entrée shortsLockupViewModel."""
    if isinstance(node, dict):
        lock = node.get("shortsLockupViewModel")
        if isinstance(lock, dict):
            title, views = parse_accessibility(lock.get("accessibilityText", ""))
            if title and views is not None:
                vid = None
                ep = lock.get("onTap", {}).get("innertubeCommand", {})
                if isinstance(ep, dict):
                    vid = ep.get("reelWatchEndpoint", {}).get("videoId")
                out.append({"title": title, "views": views, "video_id": vid})
        for v in node.values():
            walk(v, out)
    elif isinstance(node, list):
        for v in node:
            walk(v, out)


def harvest(handle, min_videos=6):
    h = handle if handle.startswith("@") else "@" + handle
    url = "https://www.youtube.com/%s/shorts" % h
    try:
        html = fetch(url)
    except (urllib.error.URLError, urllib.error.HTTPError, OSError) as e:
        return {"handle": h, "error": "échec fetch : %s" % e, "videos": []}
    data = extract_initial_data(html)
    if data is None:
        return {"handle": h, "error": "aucun ytInitialData (page bloquée ou modifiée)", "videos": []}

    found = []
    walk(data, found)
    seen, vids = set(), []
    for v in found:
        key = v["video_id"] or v["title"]
        if key in seen:
            continue
        seen.add(key)
        vids.append(v)

    if len(vids) < min_videos:
        return {
            "handle": h,
            "error": "seulement %d vidéos trouvées (minimum %d requis pour une médiane fiable)"
            % (len(vids), min_videos),
            "videos": vids,
        }

    counts = [v["views"] for v in vids]
    median = statistics.median(counts)
    for v in vids:
        v["multiple"] = round(v["views"] / median, 1) if median else None
    vids.sort(key=lambda v: v["views"], reverse=True)
    return {
        "handle": h,
        "error": None,
        "video_count": len(vids),
        "median_views": int(median),
        "max_views": max(counts),
        "min_views": min(counts),
        "videos": vids,
    }


def main():
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")

    ap = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    ap.add_argument("handles", nargs="*", help="Handles YouTube, ex. @canal")
    ap.add_argument("--file", help="Fichier avec un handle par ligne")
    ap.add_argument("--json", help="Chemin de sortie JSON")
    ap.add_argument("--min-videos", type=int, default=6, help="Minimum de vidéos pour calculer la médiane (défaut 6)")
    ap.add_argument("--top", type=int, default=5, help="Nombre d'outliers affichés par chaîne")
    args = ap.parse_args()

    handles = list(args.handles)
    if args.file:
        with open(args.file, encoding="utf-8") as f:
            handles += [ln.strip() for ln in f if ln.strip() and not ln.startswith("#")]
    if not handles:
        ap.error("Fournis au moins un handle ou --file")

    results = []
    for h in handles:
        r = harvest(h, args.min_videos)
        results.append(r)
        if r["error"]:
            print("[!] %-24s %s" % (r["handle"], r["error"]), file=sys.stderr)
            continue
        print(
            "\n%s  -- %d shorts, médiane %s vues"
            % (r["handle"], r["video_count"], "{:,}".format(r["median_views"]).replace(",", " "))
        )
        for v in r["videos"][:args.top]:
            print(
                "   %6.1fx  %10s  %s"
                % (v["multiple"], "{:,}".format(v["views"]).replace(",", " "), v["title"][:70])
            )

    ok = [r for r in results if not r["error"]]
    print("\n%d/%d chaînes lues." % (len(ok), len(results)), file=sys.stderr)
    if ok:
        print(
            "Rappel : Shorts est un proxy de Reels/TikTok. Le titre de grille n'est pas le hook parlé. Pas de date par post.",
            file=sys.stderr,
        )

    if args.json:
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print("JSON -> %s" % args.json, file=sys.stderr)


if __name__ == "__main__":
    main()
