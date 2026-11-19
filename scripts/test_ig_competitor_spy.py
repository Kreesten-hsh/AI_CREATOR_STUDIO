#!/usr/bin/env python3
"""Tests unitaires pour scripts/ig_competitor_spy.py."""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ig_competitor_spy as spy  # noqa: E402


class TestIgCompetitorSpy(unittest.TestCase):
    def test_parse_compact_number(self) -> None:
        self.assertEqual(spy.parse_compact_number("12.4K"), 12400)
        self.assertEqual(spy.parse_compact_number("24.3K"), 24300)
        self.assertEqual(spy.parse_compact_number("1,2 M"), 1200000)
        self.assertEqual(spy.parse_compact_number("3,130"), 3130)
        self.assertEqual(spy.parse_compact_number("1,234,567"), 1234567)
        self.assertEqual(spy.parse_compact_number("850 k"), 850000)
        self.assertEqual(spy.parse_compact_number("45 200"), 45200)
        self.assertEqual(spy.parse_compact_number("698"), 698)
        self.assertEqual(spy.parse_compact_number(980), 980)
        self.assertIsNone(spy.parse_compact_number(""))

    def test_parse_followers_from_meta(self) -> None:
        self.assertEqual(
            spy.parse_followers_from_meta('5M Followers, 636 Following, 4,612 Posts - Alex Hormozi (@hormozi) on Instagram: "Scaling"'),
            5000000,
        )
        self.assertEqual(
            spy.parse_followers_from_meta('48.5K Followers, 200 Following, 310 Posts - Creator (@creator)'),
            48500,
        )
        self.assertEqual(
            spy.parse_followers_from_meta('12,400 Followers, 105 Following, 90 Posts - Small Creator'),
            12400,
        )
        self.assertEqual(
            spy.parse_followers_from_meta('82,3K abonnés, 120 suivis, 45 publications - Créateur FR'),
            82300,
        )
        self.assertIsNone(spy.parse_followers_from_meta("No numbers here"))

    def test_normalize_handle_and_shortcode(self) -> None:
        self.assertEqual(spy.normalize_handle("@Hormozi"), "hormozi")
        self.assertEqual(spy.normalize_handle("https://www.instagram.com/TenfoldMarc/reels/"), "tenfoldmarc")
        self.assertEqual(spy.extract_shortcode("https://www.instagram.com/reel/CxYz123/?igsh=1"), "CxYz123")

    def test_classify_phase(self) -> None:
        self.assertEqual(spy.classify_phase(0.4), "0-3s Hook")
        self.assertEqual(spy.classify_phase(3.0), "3-15s Problème/Mécanisme")
        self.assertEqual(spy.classify_phase(15.0), "15s-Fin Preuve/Transition/CTA")

    def test_compute_outliers_excludes_pinned_and_uses_2x_default(self) -> None:
        reels = [
            spy.ReelItem(handle="creator", shortcode="pin1", url="https://ig/reel/pin1", views=1_500_000, is_pinned=True),
            spy.ReelItem(handle="creator", shortcode="pin2", url="https://ig/reel/pin2", views=900_000, is_pinned=True),
            spy.ReelItem(handle="creator", shortcode="new1", url="https://ig/reel/new1", views=400),
            spy.ReelItem(handle="creator", shortcode="new2", url="https://ig/reel/new2", views=500),
        ] + [
            spy.ReelItem(handle="creator", shortcode=f"base{i}", url=f"https://ig/reel/base{i}", views=1000)
            for i in range(6)
        ] + [
            spy.ReelItem(handle="creator", shortcode="hit24", url="https://ig/reel/hit24", views=2400),
            spy.ReelItem(handle="creator", shortcode="hit65", url="https://ig/reel/hit65", views=6500),
        ]
        summary, selected = spy.compute_outliers("creator", reels, skip_newest=2, followers_count=42000)
        self.assertEqual(summary.metric_used, "views")
        self.assertEqual(summary.followers_count, 42000)
        self.assertEqual(summary.median_baseline, 1000.0)
        self.assertEqual(summary.outliers_found, 2)
        self.assertEqual([row[0].shortcode for row in selected], ["hit65", "hit24"])
        self.assertEqual(selected[1][2], 2.4)

    def test_compute_storyboard_timestamps(self) -> None:
        pts = spy.compute_storyboard_timestamps(19.0)
        self.assertEqual(pts[:4], [0.5, 1.5, 3.0, 6.0])
        self.assertIn(18.0, pts)

    def test_build_storyboard_grid_and_cleanup(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            tmp_dir = Path(tmp)
            frames: list[tuple[float, Path]] = []
            for idx, ts in enumerate([0.5, 1.5, 3.0, 6.0, 9.0]):
                frame_path = tmp_dir / f"f{idx}.jpg"
                Image.new("RGB", (540, 960), color=(40 * idx, 80, 120)).save(frame_path)
                frames.append((ts, frame_path))
            out = tmp_dir / "storyboard.jpg"
            result = spy.build_storyboard_grid(frames, out, columns=4)
            self.assertTrue(result.exists())
            with Image.open(result) as board:
                self.assertEqual(board.size, (4 * 270 + 5 * 12, 2 * 480 + 3 * 12))

    def test_load_discover_json(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "discover.json"
            p.write_text(
                json.dumps(
                    {
                        "username": "CompBrand",
                        "media": [
                            {"media_type": "VIDEO", "permalink": "https://www.instagram.com/reel/AbC12/", "view_count": 25000, "like_count": 900, "comments_count": 40},
                            {"media_type": "IMAGE", "permalink": "https://www.instagram.com/p/Img1/", "like_count": 100},
                        ],
                    }
                ),
                encoding="utf-8",
            )
            loaded = spy.load_discover_json(p)
            self.assertIn("compbrand", loaded)
            self.assertEqual(len(loaded["compbrand"]), 1)
            self.assertEqual(loaded["compbrand"][0].views, 25000)

    def test_default_swipe_file_is_outside_workspace(self) -> None:
        parser = spy.build_parser()
        args = parser.parse_args(["spy", "@abigailpeugh"])
        self.assertTrue(str(args.swipe_file).startswith("/tmp/ig-spy-cache"))
        self.assertEqual(args.min_ratio, 2.0)

    def test_comments_per_100_views(self) -> None:
        reel_ok = spy.ReelItem(
            handle="creator",
            shortcode="c1",
            url="https://ig/reel/c1",
            views=10_000,
            comments=250,
        )
        self.assertEqual(reel_ok.comments_per_100_views, 2.5)
        self.assertEqual(
            spy.ReelItem(handle="creator", shortcode="c2", url="https://ig/reel/c2", views=None, comments=40).comments_per_100_views,
            0.0,
        )
        self.assertEqual(
            spy.ReelItem(handle="creator", shortcode="c3", url="https://ig/reel/c3", views=0, comments=40).comments_per_100_views,
            0.0,
        )

        analysis = spy.OutlierAnalysis(
            handle="creator",
            shortcode="c1",
            url="https://ig/reel/c1",
            views=12_000,
            likes=480,
            comments=300,
            median_baseline=2_000.0,
            outlier_ratio=6.0,
            metric_used="views",
            below_threshold=False,
            duration_sec=32.0,
            caption="Commente CLAUDE",
            full_transcript="Commente CLAUDE",
            phases={"0-3s Hook": "Stop aux PDF morts"},
            segments=[],
            storyboard_path="/tmp/ig-spy-cache/storyboard.jpg",
            source="playwright",
        )
        self.assertEqual(analysis.comments_per_100_views, 2.5)

        with tempfile.TemporaryDirectory() as tmp:
            swipe_file = Path(tmp) / "swipe_report.md"
            summary = spy.AccountSummary(
                handle="creator",
                total_fetched=10,
                median_baseline=2_000.0,
                metric_used="views",
                confidence="high",
                outliers_found=1,
            )
            spy.append_to_swipe_md(swipe_file, [summary], [analysis])
            content = swipe_file.read_text(encoding="utf-8")
            self.assertIn("| Com/100v |", content)
            self.assertIn("| 2.50 |", content)


if __name__ == "__main__":
    unittest.main()
