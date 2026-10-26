#!/usr/bin/env node
// Meshopt-compresses the hero preform model into public/models/.
//   npm run compress:glb
// Meshopt was chosen over Draco: ~282 KB raw / ~63 KB brotli, and its ~10 KB decoder ships with
// three (no WASM download). Only compression is applied (no `optimize`): mesh names must
// survive because HeroPreform gives the thread mesh its own renderOrder.
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'assets/metco-pet-preform.glb');
const out = join(root, 'public/models/metco-pet-preform.glb');
mkdirSync(dirname(out), { recursive: true });

const cli = join(root, 'node_modules/@gltf-transform/cli/bin/cli.js');
execFileSync(process.execPath, [cli, 'meshopt', src, out, '--level', 'medium'], {
  stdio: 'inherit',
});

const kb = (p) => (statSync(p).size / 1024).toFixed(0) + ' KB';
console.log(`\n${kb(src)} → ${kb(out)}  (public/models/metco-pet-preform.glb)`);
