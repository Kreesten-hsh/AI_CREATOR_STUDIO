import { Config } from '@remotion/cli/config';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setPublicDir('./assets');
Config.setEntryPoint('./engine/index.ts');

// Reuse locally cached Playwright chrome-headless-shell if available so offline rendering works immediately
const pwCache = path.join(os.homedir(), '.cache', 'ms-playwright');
if (fs.existsSync(pwCache)) {
  const dirs = fs.readdirSync(pwCache).filter((d) => d.startsWith('chromium_headless_shell'));
  for (const d of dirs) {
    const candidate = path.join(pwCache, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (fs.existsSync(candidate)) {
      Config.setBrowserExecutable(candidate);
      break;
    }
  }
}
