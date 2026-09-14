/**
 * NFR-17: AGPLv3 compatibility is a gate on adoption, not a later audit.
 *
 * Walks every package installed under node_modules, reads the `license` field of
 * each manifest, and fails if any licence is not on the allowlist below. Adding a
 * dependency whose licence is not there fails CI on the pull request that adds it.
 *
 *   node scripts/check-licences.mjs            # every installed package
 *   node scripts/check-licences.mjs --direct   # only the root's direct dependencies
 *
 * An SPDX expression is accepted when it can be satisfied: `A OR B` needs one side
 * allowed, `A AND B` needs both.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

/**
 * Licences a work distributed under AGPLv3 may incorporate: permissive licences,
 * and the copyleft licences the FSF lists as GPLv3/AGPLv3-compatible.
 */
const ALLOWED = new Set(
  [
    '0BSD',
    'AGPL-3.0-only',
    'AGPL-3.0-or-later',
    'Apache-2.0',
    'Artistic-2.0',
    'BlueOak-1.0.0',
    'BSD-2-Clause',
    'BSD-3-Clause',
    'CC-BY-4.0',
    'CC0-1.0',
    'GPL-2.0-or-later',
    'GPL-3.0-only',
    'GPL-3.0-or-later',
    'ISC',
    'LGPL-2.1-or-later',
    'LGPL-3.0-only',
    'LGPL-3.0-or-later',
    'MIT',
    'MIT-0',
    'MPL-2.0',
    'Python-2.0',
    'Unlicense',
    'WTFPL',
    'Zlib',
  ].map((id) => id.toLowerCase()),
);

/** Licences that are never acceptable, whatever an OR clause offers alongside them. */
const satisfied = (expression) => {
  const text = String(expression).trim();
  if (text === '') return false;
  // Strip one layer of parentheses around the whole expression.
  const inner = /^\((.*)\)$/s.exec(text);
  if (inner) return satisfied(inner[1]);
  if (/\bOR\b/i.test(text)) return splitTop(text, 'OR').some(satisfied);
  if (/\bAND\b/i.test(text)) return splitTop(text, 'AND').every(satisfied);
  return ALLOWED.has(text.replace(/\+$/, '-or-later').toLowerCase());
};

/** Split on a top-level operator, ignoring occurrences inside parentheses. */
const splitTop = (text, operator) => {
  const parts = [];
  let depth = 0;
  let current = '';
  const tokens = text.split(/\s+/);
  for (const token of tokens) {
    if (token.toUpperCase() === operator && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    depth += (token.match(/\(/g) ?? []).length - (token.match(/\)/g) ?? []).length;
    current += `${token} `;
  }
  parts.push(current.trim());
  return parts.filter((part) => part !== '');
};

const licenceOf = (manifest) => {
  if (typeof manifest.license === 'string') return manifest.license;
  if (manifest.license && typeof manifest.license.type === 'string') return manifest.license.type;
  if (Array.isArray(manifest.licenses)) {
    return manifest.licenses.map((entry) => entry.type ?? entry).join(' OR ');
  }
  return '';
};

/** Every installed package manifest, following nested node_modules. */
function* manifests(directory) {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.bin' || entry.name === '.package-lock.json') continue;
    const path = join(directory, entry.name);
    if (entry.name.startsWith('@')) {
      yield* manifests(path);
      continue;
    }
    if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
    const manifestPath = join(path, 'package.json');
    if (existsSync(manifestPath)) {
      try {
        yield JSON.parse(readFileSync(manifestPath, 'utf8'));
      } catch {
        // A directory without a readable manifest is not a dependency.
      }
    }
    yield* manifests(join(path, 'node_modules'));
  }
}

const rootManifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const directOnly = process.argv.includes('--direct');
const direct = new Set([
  ...Object.keys(rootManifest.dependencies ?? {}),
  ...Object.keys(rootManifest.devDependencies ?? {}),
]);

const seen = new Map();
for (const manifest of manifests(join(root, 'node_modules'))) {
  if (typeof manifest.name !== 'string') continue;
  if (manifest.name.startsWith('@portolan/')) continue; // our own workspaces
  if (directOnly && !direct.has(manifest.name)) continue;
  seen.set(`${manifest.name}@${manifest.version}`, licenceOf(manifest));
}

if (seen.size === 0) {
  console.error('No installed packages found. Run `npm install` first.');
  process.exit(1);
}

const rejected = [...seen].filter(([, licence]) => !satisfied(licence));

const scope = directOnly ? 'direct dependencies' : 'installed packages';
if (rejected.length > 0) {
  console.error(
    `AGPLv3 compatibility gate: ${rejected.length} of ${seen.size} ${scope} rejected.\n`,
  );
  for (const [id, licence] of rejected.sort()) {
    console.error(`  ${id} — ${licence === '' ? '(no licence field)' : licence}`);
  }
  console.error(
    '\nNFR-17 makes AGPLv3 compatibility a gate on adoption. Either drop the dependency,' +
      '\nor add its licence to ALLOWED in scripts/check-licences.mjs with the reason it is compatible.',
  );
  process.exit(1);
}

console.log(`AGPLv3 compatibility gate: ${seen.size} ${scope} checked, all compatible.`);
