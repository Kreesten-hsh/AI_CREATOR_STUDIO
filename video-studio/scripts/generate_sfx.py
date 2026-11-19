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


def make_key_tick(dur: float = 0.035) -> list[float]:
    n = int(SAMPLE_RATE * dur)
    out = []
    seed = 9876543
    lp = 0.0
    for i in range(n):
        t = i / SAMPLE_RATE
        seed = (1103515245 * seed + 12345) & 0x7FFFFFFF
        noise = (seed / 0x7FFFFFFF) * 2.0 - 1.0
        lp = lp + 0.32 * (noise - lp)
        attack = min(1.0, t / 0.0015)
        body = math.sin(2 * math.pi * 290 * t) * math.exp(-t * 155.0) * 0.55
        switch_tap = lp * math.exp(-t * 210.0) * 0.45
        out.append(0.72 * attack * (body + switch_tap))
    return out


def make_check(dur: float = 0.14) -> list[float]:
    """Double blip sinusoidal ascendant court et cristallin (520->880 Hz puis 780->1320 Hz)."""
    n = int(SAMPLE_RATE * dur)
    out = [0.0] * n
    pulses = [
        (0.0, 0.07, 520.0, 880.0, 0.45),
        (0.055, 0.14, 780.0, 1320.0, 0.65),
    ]
    for t_start, t_end, f0, f1, amp in pulses:
        i_start = int(t_start * SAMPLE_RATE)
        i_end = min(n, int(t_end * SAMPLE_RATE))
        span = max(1e-6, t_end - t_start)
        phase = 0.0
        for i in range(i_start, i_end):
            lt = (i - i_start) / SAMPLE_RATE
            k = min(1.0, lt / span)
            freq = f0 + (f1 - f0) * (1.0 - math.exp(-5.0 * k))
            phase += 2.0 * math.pi * freq / SAMPLE_RATE
            env = math.sin(min(1.0, lt / 0.005) * math.pi * 0.5) * math.exp(-lt * 26.0)
            out[i] += amp * env * math.sin(phase)
    return out


def make_select(dur: float = 0.045) -> list[float]:
    """Impulsion feutree douce (900->420 Hz, 0.045s) pour activation d'un onglet ou module."""
    n = int(SAMPLE_RATE * dur)
    out = []
    phase = 0.0
    for i in range(n):
        t = i / SAMPLE_RATE
        k = t / dur
        freq = 900.0 - 480.0 * (1.0 - math.exp(-4.5 * k))
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        env = math.sin(min(1.0, t / 0.004) * math.pi * 0.5) * math.exp(-t * 68.0)
        out.append(0.62 * env * math.sin(phase))
    return out


def make_whoosh_soft(dur: float = 0.22) -> list[float]:
    """Souffle filtre doux (0.22s) pour accompagner WhipStageTransition."""
    n = int(SAMPLE_RATE * dur)
    out = []
    seed = 2468135
    lp = 0.0
    for i in range(n):
        seed = (1103515245 * seed + 12345) & 0x7FFFFFFF
        noise = (seed / 0x7FFFFFFF) * 2.0 - 1.0
        u = i / max(1, n - 1)
        env = math.sin(u * math.pi) ** 2.0
        alpha = 0.04 + 0.16 * math.sin(u * math.pi)
        lp = lp + alpha * (noise - lp)
        out.append(0.36 * env * lp)
    return out


if __name__ == "__main__":
    existing_generators = [
        ("pop", make_pop),
        ("click", make_click),
        ("stamp", make_stamp),
        ("whoosh", make_whoosh),
        ("error_buzz", make_error_buzz),
        ("chime_success", make_chime_success),
        ("key_tick", make_key_tick),
    ]
    for name, fn in existing_generators:
        if not (OUT_DIR / f"{name}.wav").exists():
            write_wav(name, fn())

    write_wav("check", make_check())
    write_wav("select", make_select())
    write_wav("whoosh_soft", make_whoosh_soft())
