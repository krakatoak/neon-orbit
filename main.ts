// NEON ORBIT — best-game-01 entrypoint (make.fun), authored by the build agent.
// Node 22, standard library only; runs as-is with `node main.ts`.
//
// This program hands the game in. It:
//   1. resolves this repository (the folder that holds main.ts),
//   2. copies game/ and screenshots/ into the output directory,
//   3. builds the dossier with the vendored make.fun library,
//   4. writes dossier.json there and prints a short progress log.
//
// The dossier bytes are exactly buildDossier's. The grader rebuilds it with the
// same vendored file and compares byte for byte, so nothing is added or pretty
// printed here — the library's canonical JSON goes straight to disk.
//
// Local run:   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve game:  node serve.ts   ->   http://localhost:8080

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const REPO = fileURLToPath(new URL('.', import.meta.url));
const OUT = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The caps the scorer hands buildDossier (its reference/gate.json). Only
// text_max_bytes shapes the bytes; the rest refuse an entry the scorer would.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function copyFolder(name: string): void {
  const source = join(REPO, name);
  if (!existsSync(source)) {
    console.warn(`neon-orbit: no ${name}/ beside main.ts, skipped`);
    return;
  }
  mkdirSync(join(OUT, name), { recursive: true });
  cpSync(source, join(OUT, name), { recursive: true });
  console.log(`neon-orbit: copied ${name}/`);
}

function main(): void {
  mkdirSync(OUT, { recursive: true });
  copyFolder('game');
  copyFolder('screenshots');

  let bytes: Uint8Array;
  try {
    bytes = buildDossier(OUT, CAPS);
  } catch (err) {
    console.error(`neon-orbit: buildDossier refused the entry: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  const target = join(OUT, 'dossier.json');
  writeFileSync(target, bytes);
  console.log(`neon-orbit: wrote ${target} (${bytes.length} bytes)`);
}

main();
process.exit(0);
