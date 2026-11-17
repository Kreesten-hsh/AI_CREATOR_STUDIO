#!/usr/bin/env node
/**
 * ATTENTION (RÈGLE STUDIO NON NÉGOCIABLE) :
 * NE JAMAIS exécuter ce script (ni le filtre FFmpeg silenceremove) sur les pistes
 * voix off ElevenLabs (`voix_epXX.wav`). Les pistes ElevenLabs doivent être utilisées
 * brutes pour préserver les pauses dramatiques naturelles : la voix commande le montage.
 *
 * Clean silences from a raw human microphone recording using FFmpeg and normalize to -14 LUFS.
 * Outputs `voix_clean.wav` next to the input file (no Whisper model required).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2];
if (!input || !fs.existsSync(input)) {
  console.error('Usage: node scripts/prepare_audio.mjs <path/to/raw_audio.(wav|mp3|m4a)>');
  process.exit(1);
}

const resolved = path.resolve(input);
const outPath = path.join(path.dirname(resolved), 'voix_clean.wav');
const ffmpegBin = process.env.FFMPEG_BIN || 'ffmpeg';

// Gentle silence trimmer keeping natural micro-breaths (< 220ms silences trimmed tightly)
const filter =
  'silenceremove=start_periods=1:start_duration=0.05:start_threshold=-42dB:stop_periods=-1:stop_duration=0.22:stop_threshold=-42dB,loudnorm=I=-14:TP=-1.5:LRA=11';

console.log(`Cleaning & normalizing ${resolved} -> ${outPath}`);
execFileSync(ffmpegBin, ['-y', '-i', resolved, '-af', filter, '-ar', '44100', '-ac', '1', outPath], {
  stdio: 'inherit',
});
console.log(`Done: ${outPath}`);
