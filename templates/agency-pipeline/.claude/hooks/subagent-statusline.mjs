// subagentStatusLine: formats each line in the agent panel below the input.
//
// WHY: this system spreads nine agents across three model tiers, and that assignment
// is the core of the design: Opus where a wrong judgment costs more than the tokens.
// The default line (`name · description · token count`) doesn't show the model. So you
// can't see whether Haiku is answering a security question or Opus is counting
// breakpoints. Both would be mistakes, and otherwise you only see them on the bill.
//
// CONTRACT (status line docs):
//   stdin  : one JSON object with `columns` and `tasks[]`
//            per task: id, name, type, status, description, label, startTime,
//                      model, effort, contextWindowSize, tokenCount, cwd
//   stdout : ONE JSON line per line to override:
//            {"id": "<task id>", "content": "<line>"}
//            omit id       = keep the default rendering
//            empty content = hide the line
//
// Never blocks. If something fails, the line is simply not overridden.

import { readFileSync } from 'node:fs';

const C = {
  reset: '\x1b[0m', grau: '\x1b[90m', weiss: '\x1b[97m',
  rot: '\x1b[31m', gruen: '\x1b[32m', gelb: '\x1b[33m',
  blau: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m'
};

let d = {};
try {
  d = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // no/invalid stdin → default rendering
}

const tasks = Array.isArray(d.tasks) ? d.tasks : [];
if (tasks.length === 0) process.exit(0);

const breite = Number.isFinite(d.columns) && d.columns > 20 ? d.columns : 80;

// ── Detect and colour the model tier ────────────────────────────────────────
// The colour is the actual signal: magenta = expensive, cyan = standard,
// grey = cheap. A magenta `qa` stands out immediately.
function modellBadge(modelId) {
  const m = String(modelId ?? '').toLowerCase();
  if (!m) return { text: '·····', farbe: C.grau };
  if (m.includes('opus')) return { text: 'OPUS ', farbe: C.magenta };
  if (m.includes('fable')) return { text: 'FABLE', farbe: C.blau };
  if (m.includes('sonnet')) return { text: 'SONN ', farbe: C.cyan };
  if (m.includes('haiku')) return { text: 'HAIKU', farbe: C.grau };
  return { text: m.slice(0, 5).toUpperCase().padEnd(5), farbe: C.grau };
}

// ── Status symbol ───────────────────────────────────────────────────────────
function statusZeichen(status) {
  const s = String(status ?? '').toLowerCase();
  if (s.includes('fail') || s.includes('error')) return { z: '✗', farbe: C.rot };
  if (s.includes('complete') || s.includes('done')) return { z: '✓', farbe: C.gruen };
  if (s.includes('idle') || s.includes('wait')) return { z: '◌', farbe: C.grau };
  return { z: '●', farbe: C.gelb }; // running
}

// ── Running time ────────────────────────────────────────────────────────────
function laufzeit(startTime) {
  if (!startTime) return '';
  const start = typeof startTime === 'number' ? startTime : Date.parse(startTime);
  if (!Number.isFinite(start)) return '';
  const sek = Math.max(0, Math.round((Date.now() - start) / 1000));
  if (sek < 60) return `${sek}s`;
  const min = Math.floor(sek / 60);
  if (min < 60) return `${min}:${String(sek % 60).padStart(2, '0')}`;
  return `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`;
}

// ── The agent's context usage ───────────────────────────────────────────────
function kontext(task) {
  const { tokenCount: t, contextWindowSize: w } = task;
  if (!Number.isFinite(t) || !Number.isFinite(w) || w <= 0) return null;
  const pct = Math.round((t / w) * 100);
  const farbe = pct >= 85 ? C.rot : pct >= 65 ? C.gelb : C.grau;
  return `${farbe}${pct}%${C.reset}`;
}

function sichtbareLaenge(s) {
  return s.replace(/\x1b\[[0-9;]*m/g, '').length;
}

for (const task of tasks) {
  if (!task?.id) continue;

  // Role: the agent type says more than the name the lead gave it,
  // because the roles in this system are fixed.
  const rolle = String(task.type ?? task.name ?? '?').slice(0, 10);
  const badge = modellBadge(task.model);
  const st = statusZeichen(task.status);
  const zeit = laufzeit(task.startTime);
  const ctx = kontext(task);

  // What the agent is doing right now. label is usually shorter than description.
  const was = String(task.label ?? task.description ?? '').replace(/\s+/g, ' ').trim();

  const links =
    `${C.weiss}${rolle.padEnd(10)}${C.reset} ` +
    `${badge.farbe}${badge.text}${C.reset} ` +
    `${st.farbe}${st.z}${C.reset} `;

  const rechts =
    (zeit ? `${C.grau}${zeit}${C.reset}` : '') +
    (zeit && ctx ? `${C.grau} · ${C.reset}` : '') +
    (ctx ?? '');

  // Trim the description to the remaining space.
  const belegt = sichtbareLaenge(links) + sichtbareLaenge(rechts) + 3;
  const platz = Math.max(0, breite - belegt);
  const kurz = was.length > platz ? was.slice(0, Math.max(0, platz - 1)) + '…' : was;

  const fueller = ' '.repeat(Math.max(1, platz - kurz.length + 1));
  const content = `${links}${C.grau}${kurz}${C.reset}${fueller}${rechts}`;

  process.stdout.write(JSON.stringify({ id: task.id, content }) + '\n');
}

process.exit(0);
