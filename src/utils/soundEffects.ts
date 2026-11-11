type AudioContextConstructor = typeof AudioContext;

function resolveAudioContextConstructor(): AudioContextConstructor | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const win = window as Window & { webkitAudioContext?: AudioContextConstructor };
  return window.AudioContext ?? win.webkitAudioContext ?? null;
}

/**
 * Synthétise une brève sonnerie ascendante (Web Audio API, ~360 ms, gain doux)
 * pour signaler la complétion d'un module sans dépendance ni ressource externe.
 */
export function playSuccessChime(): void {
  const AudioCtx = resolveAudioContextConstructor();
  if (!AudioCtx) {
    return;
  }

  let ctx: AudioContext | null = null;
  try {
    ctx = new AudioCtx();
    if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
      void ctx.resume().catch(() => undefined);
    }

    const now = ctx.currentTime;
    // Accord majeur ascendant doux (Do5 → Mi5 → Sol5)
    const notes: ReadonlyArray<{ freq: number; offset: number; duration: number; gain: number }> = [
      { freq: 523.25, offset: 0, duration: 0.14, gain: 0.07 },
      { freq: 659.25, offset: 0.085, duration: 0.16, gain: 0.08 },
      { freq: 783.99, offset: 0.17, duration: 0.24, gain: 0.09 },
    ];

    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const startTime = now + note.offset;
      const stopTime = startTime + note.duration;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, startTime);

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(note.gain, startTime + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, stopTime);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(stopTime + 0.01);
    }

    const contextToClose = ctx;
    if (typeof window !== 'undefined' && typeof contextToClose.close === 'function') {
      window.setTimeout(() => {
        void contextToClose.close().catch(() => undefined);
      }, 600);
    }
  } catch {
    if (ctx && typeof ctx.close === 'function') {
      void ctx.close().catch(() => undefined);
    }
  }
}
