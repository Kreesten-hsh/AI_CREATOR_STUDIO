"""
Convert raw studio-backdrop 3D avatar renders into clean transparent RGBA sticker PNGs
(pure Python + Pillow, zero numpy/scipy):
  1. Edge-sealed exterior flood-fill (diff <= 24, neighbor step <= 7, blocked at grad >= 15)
     so bright cream overshirt shoulders NEVER get eaten even when luminance matches the backdrop.
  2. Enclosed studio-grey pocket detection (flat grad == 0, diff <= 14, 400 <= area <= 15000)
     so closed pockets (pose 07 arm-to-neck triangle, pose 05 under-arm pocket) are removed
     while eye sclera, teeth, and shirt highlights remain 100% untouched.
  3. keep_largest_component + 1px MinFilter(3) halo trim.
  4. fit_in_canvas(900x1050, padding=50 all sides, stick_to_bottom=False) + smooth circular
     14px white (#FFFFFF) + 6px ink black (#171313) double die-cut rim.
"""
from __future__ import annotations

import json
import math
from collections import deque
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
AVATAR_DIR = ROOT / "assets" / "avatar"

POSE_ORDER = [
    ("01_hook_lean_in", "raw_01_hook_lean_in.jpg"),
    ("02_talking_confident", "raw_02_talking_confident.jpg"),
    ("03_thinking_chin", "raw_03_thinking_chin.jpg"),
    ("04_stop_warning", "raw_04_stop_warning.jpg"),
    ("05_eureka_snap", "raw_05_eureka_snap.jpg"),
    ("06_working_tablet", "raw_06_working_tablet.jpg"),
    ("07_facepalm_oops", "raw_07_facepalm_oops.jpg"),
    ("08_amazed_wow", "raw_08_amazed_wow.jpg"),
    ("09_relaxed_arms_crossed", "raw_09_relaxed_arms_crossed.jpg"),
    ("10_head_badge", "raw_10_head_badge.jpg"),
    ("11_working_laptop", "raw_11_working_laptop.jpg"),
]

WHITE_BORDER_PX = 14
BLACK_BORDER_PX = 6
INK_BLACK = (23, 19, 19, 255)
PURE_WHITE = (255, 255, 255, 255)


def sample_studio_bg(rgb: Image.Image) -> tuple[int, int, int]:
    """Sample upper corners and top-center studio backdrop color."""
    w, h = rgb.size
    pts = [
        rgb.getpixel((6, 6)),
        rgb.getpixel((w - 7, 6)),
        rgb.getpixel((w // 2, 6)),
        rgb.getpixel((6, h // 4)),
        rgb.getpixel((w - 7, h // 4)),
    ]
    return (
        sum(p[0] for p in pts) // len(pts),
        sum(p[1] for p in pts) // len(pts),
        sum(p[2] for p in pts) // len(pts),
    )


def keep_largest_component(img: Image.Image) -> Image.Image:
    """Keep ONLY the single largest connected foreground component (alpha > 128)."""
    w, h = img.size
    rgba = img.convert("RGBA")
    alpha = rgba.split()[3]
    ab = alpha.tobytes()

    visited = bytearray(w * h)
    best_comp: list[int] = []

    for start in range(w * h):
        if ab[start] > 128 and not visited[start]:
            comp: list[int] = []
            q: deque[int] = deque([start])
            visited[start] = 1
            while q:
                idx = q.popleft()
                comp.append(idx)
                y, x = divmod(idx, w)
                if x > 0 and ab[idx - 1] > 128 and not visited[idx - 1]:
                    visited[idx - 1] = 1
                    q.append(idx - 1)
                if x + 1 < w and ab[idx + 1] > 128 and not visited[idx + 1]:
                    visited[idx + 1] = 1
                    q.append(idx + 1)
                if y > 0 and ab[idx - w] > 128 and not visited[idx - w]:
                    visited[idx - w] = 1
                    q.append(idx - w)
                if y + 1 < h and ab[idx + w] > 128 and not visited[idx + w]:
                    visited[idx + w] = 1
                    q.append(idx + w)
            if len(comp) > len(best_comp):
                best_comp = comp

    clean_alpha = bytearray(w * h)
    for idx in best_comp:
        clean_alpha[idx] = ab[idx]

    out = rgba.copy()
    out.putalpha(Image.frombytes("L", (w, h), bytes(clean_alpha)))
    return out


def remove_flat_bg_advanced(
    img: Image.Image,
    bg_rgb: tuple[int, int, int] | None = None,
    tolerance: int = 12,
) -> Image.Image:
    """
    Edge-sealed exterior flood-fill (strict tol=12 so cream sleeve never bleeds)
    + bounded enclosed studio-grey pocket cleanup (diff <= 16, r-b < 18, 450 <= area <= 15000).
    """
    rgb = img.convert("RGB")
    w, h = rgb.size
    if bg_rgb is None:
        bg_rgb = sample_studio_bg(rgb)

    br, bg_g, bb = bg_rgb
    tol2 = tolerance * tolerance
    raw = rgb.tobytes()

    # 1. Edge barrier map (1px crisp central-difference gradient)
    edge_wall = bytearray(w * h)
    for y in range(1, h - 1):
        row = y * w
        for x in range(1, w - 1):
            p = row + x
            pl = (p - 1) * 3
            pr = (p + 1) * 3
            pu = (p - w) * 3
            pd = (p + w) * 3
            g = (
                abs(raw[pr] - raw[pl])
                + abs(raw[pr + 1] - raw[pl + 1])
                + abs(raw[pr + 2] - raw[pl + 2])
                + abs(raw[pd] - raw[pu])
                + abs(raw[pd + 1] - raw[pu + 1])
                + abs(raw[pd + 2] - raw[pu + 2])
            )
            if g >= 14:
                edge_wall[p] = 1

    # 2. Precompute background distance flags
    diff_ok = bytearray(w * h)
    pocket_ok = bytearray(w * h)
    pocket_tol2 = 16 * 16
    face_x0, face_x1 = int(w * 0.38), int(w * 0.62)
    face_y0, face_y1 = int(h * 0.20), int(h * 0.44)

    for p in range(w * h):
        o = p * 3
        r = raw[o]
        g = raw[o + 1]
        b = raw[o + 2]
        dr = r - br
        dg = g - bg_g
        db = b - bb
        d2 = dr * dr + dg * dg + db * db
        if d2 <= tol2:
            diff_ok[p] = 1
        y, x = divmod(p, w)
        if face_x0 <= x <= face_x1 and face_y0 <= y <= face_y1:
            continue
        if y < int(h * 0.85) and d2 <= pocket_tol2 and edge_wall[p] == 0:
            if abs(r - g) < 12 and abs(g - b) < 12 and abs(r - b) < 18 and 195 <= r <= 238:
                pocket_ok[p] = 1

    # 3. Exterior edge-sealed flood-fill (protects lit cream overshirt sleeve highlights)
    bg_mask = bytearray(w * h)
    q: deque[int] = deque()

    def seed(px_idx: int) -> None:
        if diff_ok[px_idx] and edge_wall[px_idx] == 0 and not bg_mask[px_idx]:
            bg_mask[px_idx] = 1
            q.append(px_idx)

    for x in range(w):
        seed(x)
        seed((h - 1) * w + x)
    for y in range(1, h - 1):
        seed(y * w)
        seed(y * w + (w - 1))

    step_limit = 5

    while q:
        idx = q.popleft()
        y, x = divmod(idx, w)
        o = idx * 3
        cr, cg, cb = raw[o], raw[o + 1], raw[o + 2]

        for nidx in (
            idx - 1 if x > 0 else -1,
            idx + 1 if x + 1 < w else -1,
            idx - w if y > 0 else -1,
            idx + w if y + 1 < h else -1,
        ):
            if nidx >= 0 and not bg_mask[nidx] and diff_ok[nidx] and edge_wall[nidx] == 0:
                no = nidx * 3
                if (
                    abs(raw[no] - cr) + abs(raw[no + 1] - cg) + abs(raw[no + 2] - cb)
                    <= step_limit * 2
                ):
                    bg_mask[nidx] = 1
                    q.append(nidx)

    # 4. Enclosed pocket removal (e.g. pose 07 arm-to-head triangle): seed >= 450px, then grow softly into adjacent shadowed pocket pixels
    pvis = bytearray(w * h)
    interior_seeds: list[int] = []
    for start in range(w * h):
        if pocket_ok[start] and not bg_mask[start] and not pvis[start]:
            comp: list[int] = []
            pq: deque[int] = deque([start])
            pvis[start] = 1
            while pq:
                idx = pq.popleft()
                comp.append(idx)
                y, x = divmod(idx, w)
                for nidx in (
                    idx - 1 if x > 0 else -1,
                    idx + 1 if x + 1 < w else -1,
                    idx - w if y > 0 else -1,
                    idx + w if y + 1 < h else -1,
                ):
                    if nidx >= 0 and pocket_ok[nidx] and not bg_mask[nidx] and not pvis[nidx]:
                        pvis[nidx] = 1
                        pq.append(nidx)
            if 450 <= len(comp) <= 15000:
                for idx in comp:
                    bg_mask[idx] = 1
                    interior_seeds.append(idx)

    # Softly absorb shaded rim pixels inside confirmed interior pockets only
    gq: deque[int] = deque(interior_seeds)
    while gq:
        idx = gq.popleft()
        y, x = divmod(idx, w)
        if y >= int(h * 0.87):
            continue
        for nidx in (
            idx - 1 if x > 0 else -1,
            idx + 1 if x + 1 < w else -1,
            idx - w if y > 0 else -1,
            idx + w if y + 1 < h else -1,
        ):
            if nidx >= 0 and not bg_mask[nidx] and edge_wall[nidx] == 0:
                no = nidx * 3
                nr, ng, nb = raw[no], raw[no + 1], raw[no + 2]
                nd2 = (nr - br) ** 2 + (ng - bg_g) ** 2 + (nb - bb) ** 2
                if nd2 <= 28 * 28 and abs(nr - nb) < 28 and nr >= 188:
                    bg_mask[nidx] = 1
                    gq.append(nidx)

    # 5. Dilate bg_mask slightly by 1px into the rim-light fringe so no grey outline remains,
    # while filling tiny interior pinholes inside the character silhouette
    fg_bytes = bytearray(255 if bg_mask[p] == 0 else 0 for p in range(w * h))
    rgba = img.convert("RGBA")
    fg_alpha = Image.frombytes("L", (w, h), bytes(fg_bytes)).filter(ImageFilter.MinFilter(5))
    rgba.putalpha(fg_alpha)

    return keep_largest_component(rgba)


def fit_in_canvas(
    img: Image.Image,
    target_size: tuple[int, int] = (900, 1050),
    padding_x: int = 50,
    padding_top: int = 50,
    stick_to_bottom: bool = False,
) -> Image.Image:
    """
    Autocrop on non-zero alpha, resize preserving proportions, and place with padding
    on all 4 sides when stick_to_bottom=False so the sticker border wraps the bottom cleanly.
    """
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    tw, th = target_size
    avail_w = max(1, tw - 2 * padding_x)
    avail_h = max(1, (th - padding_top) if stick_to_bottom else (th - 2 * padding_top))
    scale = min(avail_w / max(1, img.width), avail_h / max(1, img.height))
    new_w = max(1, int(math.floor(img.width * scale)))
    new_h = max(1, int(math.floor(img.height * scale)))
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", target_size, (0, 0, 0, 0))
    pos_x = (tw - new_w) // 2
    pos_y = (th - new_h) if stick_to_bottom else (th - new_h) // 2
    canvas.paste(resized, (pos_x, pos_y), resized)
    return canvas


def exact_circular_dilate(binary_mask: Image.Image, radius_px: int) -> Image.Image:
    """Exact 2x-supersampled Euclidean circular dilation for smooth anti-aliased rims."""
    if radius_px <= 0:
        return binary_mask.copy()

    w, h = binary_mask.size
    px = binary_mask.load()
    boundary: list[tuple[int, int]] = []
    for y in range(h):
        for x in range(w):
            if px[x, y] > 128:
                if (
                    x == 0
                    or x == w - 1
                    or y == 0
                    or y == h - 1
                    or px[x - 1, y] <= 128
                    or px[x + 1, y] <= 128
                    or px[x, y - 1] <= 128
                    or px[x, y + 1] <= 128
                ):
                    boundary.append((x, y))

    scale = 2
    hi = binary_mask.resize((w * scale, h * scale), Image.Resampling.NEAREST)
    draw = ImageDraw.Draw(hi)
    rr = radius_px * scale
    for bx, by in boundary:
        cx = bx * scale
        cy = by * scale
        draw.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=255)

    down = hi.resize((w, h), Image.Resampling.LANCZOS)
    return down.point(lambda v: 0 if v < 96 else (255 if v > 168 else int((v - 96) / 72 * 255)))


def apply_sticker_effect(nobg_canvas: Image.Image) -> Image.Image:
    """Apply smooth 14px white inner rim + 6px #171313 black outer rim around bust and head."""
    alpha = nobg_canvas.split()[3]
    smooth_solid = (
        alpha.point(lambda v: 255 if v > 128 else 0)
        .filter(ImageFilter.MaxFilter(5))
        .filter(ImageFilter.MinFilter(5))
        .filter(ImageFilter.GaussianBlur(radius=2.0))
        .point(lambda v: 255 if v > 128 else 0)
    )

    white_rim = exact_circular_dilate(smooth_solid, WHITE_BORDER_PX)
    black_rim = exact_circular_dilate(smooth_solid, WHITE_BORDER_PX + BLACK_BORDER_PX)

    w, h = nobg_canvas.size
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    black_layer = Image.new("RGBA", (w, h), INK_BLACK)
    white_layer = Image.new("RGBA", (w, h), PURE_WHITE)

    canvas = Image.composite(black_layer, canvas, black_rim)
    canvas = Image.composite(white_layer, canvas, white_rim)
    return Image.alpha_composite(canvas, nobg_canvas)


def build_contact_sheet(paths: list[tuple[str, Path]], out_path: Path) -> None:
    cols, rows = 5, 2
    cell_w, cell_h = 320, 360
    sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), (250, 246, 240))
    draw = ImageDraw.Draw(sheet)

    for idx, (label, p) in enumerate(paths):
        r, c = divmod(idx, cols)
        x0, y0 = c * cell_w, r * cell_h
        draw.rectangle(
            [x0 + 8, y0 + 8, x0 + cell_w - 8, y0 + cell_h - 36],
            fill=(234, 227, 213),
            outline=(23, 19, 19),
            width=3,
        )
        if p.exists():
            im = Image.open(p).convert("RGBA")
            im.thumbnail((cell_w - 24, cell_h - 50), Image.Resampling.LANCZOS)
            ix = x0 + (cell_w - im.width) // 2
            iy = y0 + 14 + (cell_h - 50 - im.height) // 2
            sheet.paste(im, (ix, iy), im)
        draw.text((x0 + 14, y0 + cell_h - 28), label, fill=(23, 19, 19))

    sheet.save(out_path, "PNG")
    print(f"Saved contact sheet: {out_path}")


def main() -> None:
    outputs: list[tuple[str, Path]] = []
    manifest_entries = []

    for slug, raw_name in POSE_ORDER:
        src = AVATAR_DIR / raw_name
        dst = AVATAR_DIR / f"{slug}.png"
        if not src.exists():
            print(f"MISSING raw file: {src}")
            continue

        with Image.open(src) as raw:
            nobg = remove_flat_bg_advanced(raw, tolerance=12)
            if slug == "10_head_badge":
                fitted = fit_in_canvas(
                    nobg,
                    target_size=(700, 700),
                    padding_x=50,
                    padding_top=50,
                    stick_to_bottom=False,
                )
            else:
                fitted = fit_in_canvas(
                    nobg,
                    target_size=(900, 1050),
                    padding_x=50,
                    padding_top=50,
                    stick_to_bottom=False,
                )
            sticker = apply_sticker_effect(fitted)
            sticker.save(dst, "PNG")
            print(f"Saved clean sticker: {dst}")

            if slug == "10_head_badge":
                mini_dst = AVATAR_DIR / "mini.png"
                sticker.save(mini_dst, "PNG")
                print(f"Saved mini head badge: {mini_dst}")

        outputs.append((slug, dst))
        manifest_entries.append({"id": slug, "file": f"avatar/{slug}.png"})

    if outputs:
        build_contact_sheet(outputs, AVATAR_DIR / "avatar_sheet.png")

    (AVATAR_DIR / "manifest.json").write_text(
        json.dumps(
            {
                "character": "Kreesten Faceless 3D",
                "outfit": "Cream overshirt over black tee",
                "canvas": "900x1050 (padding 50px, stick_to_bottom=False)",
                "outline": "14px white + 6px solid black (#171313)",
                "poses": manifest_entries,
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
