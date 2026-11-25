// Fetches an image asset from the client's OWN domain.
//
//   node hol-asset.mjs <asset-url> <allowed-domain> <target-path>
//
// WHY THIS SCRIPT EXISTS: `curl` and `wget` are denied in settings.json, and rightly so:
// an agent with free network access will eventually download just about anything.
// For exactly one case we still need a download: the client's logo and favicon from
// THEIR OWN site. That is not invention, it is sourcing.
//
// THE LOCKS ARE IN THE CODE, NOT IN THE PROMPT. A prompt can be argued away:
//   1. Same origin: the URL must be on the given client domain (incl. www and
//      subdomains). A logo from google.com, a third-party CDN or an image search is
//      rejected: wrong logo and a copyright problem at the same time.
//   2. Redirects are NOT followed if they change the host.
//   3. Image MIME types only, checked against the Content-Type AND the file signature.
//   4. Size limit 3 MB.
//   5. No SVG with embedded <script>.
//   6. The target path must be inside the project.
//
// Everything that gets through is logged with its source, so it stays traceable
// where each file came from.

import { writeFileSync, existsSync, mkdirSync, appendFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const [, , assetUrl, erlaubteDomain, zielPfad] = process.argv;

function raus(grund) {
  console.error(`REJECTED: ${grund}`);
  process.exit(1);
}

if (!assetUrl || !erlaubteDomain || !zielPfad) {
  console.error('Usage: node hol-asset.mjs <asset-url> <allowed-domain> <target-path>');
  process.exit(2);
}

// ── Lock 1: same origin ─────────────────────────────────────────────────────
let u;
try { u = new URL(assetUrl); } catch { raus(`not a valid URL: ${assetUrl}`); }
if (!/^https?:$/.test(u.protocol)) raus(`http/https only, not ${u.protocol}`);

const norm = (h) => h.toLowerCase().replace(/^www\./, '');
const ziel = norm(u.hostname);
const erlaubt = norm(erlaubteDomain.replace(/^https?:\/\//, '').split('/')[0]);

if (ziel !== erlaubt && !ziel.endsWith('.' + erlaubt)) {
  raus(
    `${u.hostname} does not belong to ${erlaubt}. Assets are ONLY fetched from the ` +
    `client's own domain. A logo from an image search is very likely the wrong one ` +
    `and someone else's copyright.`
  );
}

// ── Lock 6: target path inside the project ──────────────────────────────────
const projekt = resolve(process.cwd());
const zielAbs = resolve(projekt, zielPfad);
if (!zielAbs.startsWith(projekt)) raus(`target path is outside the project: ${zielPfad}`);

// ── Fetch ───────────────────────────────────────────────────────────────────
const MAX = 3 * 1024 * 1024;

let res;
try {
  res = await fetch(u, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
} catch (e) {
  raus(`fetch failed: ${e.message}`);
}

// ── Lock 2: host-changing redirects ─────────────────────────────────────────
if (res.status >= 300 && res.status < 400) {
  const ort = res.headers.get('location');
  if (!ort) raus(`redirect ${res.status} without a target`);
  const neu = new URL(ort, u);
  if (norm(neu.hostname) !== ziel) {
    raus(`redirect leaves the domain: ${u.hostname} → ${neu.hostname}`);
  }
  try {
    res = await fetch(neu, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
  } catch (e) { raus(`redirect fetch failed: ${e.message}`); }
}

if (!res.ok) raus(`HTTP ${res.status} for ${assetUrl}`);

// ── Lock 3a: Content-Type ───────────────────────────────────────────────────
const ct = (res.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
const erlaubteTypen = [
  'image/png', 'image/jpeg', 'image/jpg', 'image/webp',
  'image/svg+xml', 'image/gif', 'image/avif', 'image/x-icon', 'image/vnd.microsoft.icon'
];
if (!erlaubteTypen.includes(ct)) raus(`Content-Type "${ct}" is not an allowed image format`);

const buf = Buffer.from(await res.arrayBuffer());

// ── Lock 4: size ────────────────────────────────────────────────────────────
if (buf.length > MAX) raus(`${(buf.length / 1024 / 1024).toFixed(1)} MB exceeds the 3 MB limit`);
if (buf.length === 0) raus('empty file');

// ── Lock 3b: file signature must match the Content-Type ─────────────────────
const sig = buf.subarray(0, 12);
const istPNG = sig[0] === 0x89 && sig[1] === 0x50 && sig[2] === 0x4e && sig[3] === 0x47;
const istJPG = sig[0] === 0xff && sig[1] === 0xd8 && sig[2] === 0xff;
const istGIF = sig.subarray(0, 3).toString('ascii') === 'GIF';
const istWEBP = sig.subarray(0, 4).toString('ascii') === 'RIFF' && sig.subarray(8, 12).toString('ascii') === 'WEBP';
const istICO = sig[0] === 0x00 && sig[1] === 0x00 && (sig[2] === 0x01 || sig[2] === 0x02);
const kopf = buf.subarray(0, 400).toString('utf8').trimStart();
const istSVG = kopf.startsWith('<svg') || kopf.startsWith('<?xml');
const istAVIF = sig.subarray(4, 8).toString('ascii') === 'ftyp';

if (!(istPNG || istJPG || istGIF || istWEBP || istICO || istSVG || istAVIF)) {
  raus('file content is not an image: Content-Type lied or the file is damaged');
}

// ── Lock 5: SVG without active content ──────────────────────────────────────
if (istSVG) {
  const text = buf.toString('utf8');
  if (/<script[\s>]/i.test(text) || /\bon\w+\s*=/i.test(text) || /javascript:/i.test(text)) {
    raus('SVG contains a script or event handler, not taken over');
  }
}

// ── Write + log ─────────────────────────────────────────────────────────────
mkdirSync(dirname(zielAbs), { recursive: true });
if (existsSync(zielAbs)) raus(`${zielPfad} already exists, nothing overwritten`);
writeFileSync(zielAbs, buf);

const zeile = `${zielPfad}\t${assetUrl}\t${ct}\t${buf.length}B\n`;
try {
  mkdirSync('design', { recursive: true });
  const neu = !existsSync('design/assets-herkunft.tsv');
  if (neu) appendFileSync('design/assets-herkunft.tsv', 'file\tsource\ttype\tsize\n');
  appendFileSync('design/assets-herkunft.tsv', zeile);
} catch { /* the log is a convenience, not a reason to abort */ }

console.log(`OK  ${zielPfad}  (${ct}, ${(buf.length / 1024).toFixed(1)} KB)  source: ${assetUrl}`);
console.log('Source logged in design/assets-herkunft.tsv');
