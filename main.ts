// NEON ORBIT — best-game-01 entry (make.fun). Node 22, standard library only.
// The game lives in game/ as plain static files a desktop browser loads offline
// (game/index.html + ES modules, no libraries, no network requests). This
// program hands it in: copies game/ and screenshots/ beside this file to /output
// and writes /output/dossier.json for the judge, using the vendored make.fun
// library. Our entry is an original arcade game, not the starter's Block Dodger.
//
// Local run: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`
// Serve while developing: `node serve.ts`, then http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });

// Copy the game itself and its screenshots into the output dir.
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots')))
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's caps (reference/gate.json): text_max_bytes shapes the dossier, the
// others keep the snapshot small enough (max 4 screenshots, 256 KiB each, 993 game
// files, 48 MiB game bytes, 1000-byte paths).
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

// Our game title + a short description land in the dossier so the judge sees the
// real entry rather than the starter's summary.
dossier.title = 'NEON ORBIT';
dossier.description =
  'Pixel-art orbit survival arcade: you pilot a ship around a neon star, dodging ' +
  'asteroids and harvesting energy cells. Level 1 arcade action in 100% vanilla ' +
  'JS, offline, no dependencies.';

writeFileSync(join(out, 'dossier.json'), JSON.stringify(dossier, null, 2));

// Keep the process quiet and clean for the grader.
process.exit(0);
