"""Generate crisp, deterministic offline UI sound effects (WAV) for video-studio/assets/sfx/."""
import math
import struct
import wave
from pathlib import Path

SAMPLE_RATE = 44100
OUT_DIR = Path(__file__).resolve().parent.parent / "assets" / "sfx"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def write_wav(name: str, samples: list[float]) -> None:
    path = OUT_DIR / f"{name}.wav"
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        clipped = [max(-1.0, min(1.0, s)) for s in samples]
        pcm = struct.pack("<" + "h" * len(clipped), *(int(s * 32767) for s in clipped))
        wf.writeframes(pcm)
    print(f"Generated {path}")


def make_pop(dur: float = 0.11) -> list[float]:
    n = int(SAMPLE_RATE * dur)
    out = []
    phase = 0.0
    for i in range(n):
        t = i / SAMPLE_RATE
        freq = 280.0 + 520.0 * math.exp(-t * 28.0)
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        env = math.sin(min(1.0, t / 0.008) * math.pi * 0.5) * math.exp(-t * 36.0)
        out.append(0.75 * env * math.sin(phase))
    return out


def make_click(dur: float = 0.055) -> list[float]:
    n = int(SAMPLE_RATE * dur)
    out = []
    for i in range(n):
        t = i / SAMPLE_RATE
        env = math.exp(-t * 110.0)
        sig = 0.55 * math.sin(2 * math.pi * 1650 * t) + 0.45 * math.sin(2 * math.pi * 3100 * t)
        out.append(0.7 * env * sig)
    return out


def make_stamp(dur: float = 0.22) -> list[float]:
    n = int(SAMPLE_RATE * dur)
    out = []
    phase = 0.0
    for i in range(n):
        t = i / SAMPLE_RATE
        freq = 155.0 * math.exp(-t * 14.0) + 52.0
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        thud = math.sin(phase) * math.exp(-t * 18.0)
        snap = math.sin(2 * math.pi * 1100 * t) * math.exp(-t * 85.0) * 0.35
        out.append(0.85 * (thud + snap))
    return out


def make_whoosh(dur: float = 0.24) -> list[float]:
    n = int(SAMPLE_RATE * dur)
    out = []
    seed = 1234567
    lp = 0.0
    for i in range(n):
        t = i / SAMPLE_RATE
        seed = (1103515245 * seed + 12345) & 0x7FFFFFFF
        noise = (seed / 0x7FFFFFFF) * 2.0 - 1.0
        env = math.sin((i / n) * math.pi) ** 1.6
        alpha = 0.08 + 0.35 * math.sin((i / n) * math.pi)
        lp = lp + alpha * (noise - lp)
        out.append(0.55 * env * lp)
    return out


def make_error_buzz(dur: float = 0.26) -> list[float]:
    n = int(SAMPLE_RATE * dur)
    out = []
    for i in range(n):
        t = i / SAMPLE_RATE
        env = min(1.0, t / 0.01) * math.exp(-t * 8.0)
        s = 0.5 * math.sin(2 * math.pi * 150 * t) + 0.5 * math.sin(2 * math.pi * 158 * t)
        out.append(0.65 * env * s)
    return out


def make_chime_success(dur: float = 0.48) -> list[float]:
    n = int(SAMPLE_RATE * dur)
    notes = [(0.0, 587.33), (0.09, 783.99), (0.18, 1174.66)]  # D5 -> G5 -> D6
    out = [0.0] * n
    for start_t, freq in notes:
        start_i = int(start_t * SAMPLE_RATE)
        for i in range(start_i, n):
            lt = (i - start_i) / SAMPLE_RATE
            env = min(1.0, lt / 0.008) * math.exp(-lt * 8.5)
            out[i] += 0.35 * env * (math.sin(2 * math.pi * freq * lt) + 0.2 * math.sin(4 * math.pi * freq * lt))
    return out


if __name__ == "__main__":
    write_wav("pop", make_pop())
    write_wav("click", make_click())
    write_wav("stamp", make_stamp())
    write_wav("whoosh", make_whoosh())
    write_wav("error_buzz", make_error_buzz())
    write_wav("chime_success", make_chime_success())
