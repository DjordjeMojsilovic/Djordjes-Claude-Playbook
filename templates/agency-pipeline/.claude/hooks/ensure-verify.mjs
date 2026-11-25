// PostToolUse hook: adds a `verify` script to package.json if there is none.
// Idempotent: if it is already there, nothing happens. No package.json → nothing.
// That way nobody has to remember it; the gate always has something to call.
//
// NEW compared with the old version: stack-aware. The old version hard-coded
// `tsc --noEmit && eslint .`. In a project without TypeScript or without ESLint the gate
// then failed on EVERY stop and the agent could not get through any more.
// Now only what is actually configured gets added.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

if (!existsSync('package.json')) process.exit(0);

let pkg;
let roh;
try {
  roh = readFileSync('package.json', 'utf8');
  pkg = JSON.parse(roh);
} catch {
  process.exit(0); // don't touch half-written/broken JSON
}

if (pkg.scripts?.verify) process.exit(0); // already there

// Only check what exists.
const teile = [];

if (existsSync('tsconfig.json')) {
  teile.push('tsc --noEmit');
}

const eslintConfig = [
  'eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs', 'eslint.config.ts',
  '.eslintrc', '.eslintrc.js', '.eslintrc.cjs', '.eslintrc.json', '.eslintrc.yml'
].some(existsSync) || Boolean(pkg.eslintConfig);

if (eslintConfig) {
  teile.push('eslint .');
} else if (pkg.scripts?.lint) {
  teile.push('npm run lint');
}

// Neither TypeScript nor lint configured → no meaningful verify possible.
// Better none at all than one that is always red.
if (teile.length === 0) process.exit(0);

pkg.scripts ??= {};
pkg.scripts.verify = teile.join(' && ');

try {
  // Roughly keep the original indentation (2 spaces is the usual case).
  const einzug = /\n\t/.test(roh) ? '\t' : 2;
  writeFileSync('package.json', JSON.stringify(pkg, null, einzug) + '\n');
} catch { /* not writable → carry on quietly */ }

process.exit(0);
