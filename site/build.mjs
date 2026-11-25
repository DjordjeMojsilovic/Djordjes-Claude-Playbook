// Builds the course website into site/dist from the markdown in this repo. Run: cd site && npm ci && npm run build
// Every link is relative, so the site works at any base path (GitHub Pages serves it under /Djordjes-Claude-Playbook/).
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const read = (path) => readFileSync(path, 'utf8').replace(/\r\n/g, '\n');

const SITE = dirname(fileURLToPath(import.meta.url));
const REPO = join(SITE, '..');
const DIST = join(SITE, 'dist');
const GITHUB = 'https://github.com/DjordjeMojsilovic/Djordjes-Claude-Playbook';
const UTM = '?utm_source=djordjes_claude_setup&amp;utm_medium=referral';

// The modules, in order. The one-line descriptions are shared by the home page list and each module's header.
const DESC = {
  '00': 'Which Claude to use for what',
  '01': 'One big brief, then short steering',
  '02': 'Opus thinks, Sonnet builds, Haiku checks, and a second opinion before you start',
  '03': 'Short CLAUDE.md, rules that load when needed, memory',
  '04': 'What they are, where they live, how to write your own',
  '05': 'Marketplaces, MCP, the browser',
  '06': 'Subagents, pipelines, parallel sessions, and when not to',
  '07': 'The levers that actually matter',
  '08': 'References first, then prototypes that really differ, then you pick',
  '09': 'Set the limits, let Claude design the system, ask for proof',
  '10': 'Turn Claude from doer into tutor',
  '11': 'Permissions, secrets, prompt injection, whose skill is it',
  '12': 'Walk through setup/ step by step',
};
const modules = readdirSync(join(REPO, 'course')).filter((f) => /^\d\d-.+\.md$/.test(f)).sort().map((file) => {
  const md = read(join(REPO, 'course', file));
  const [, num, title] = md.match(/^#\s+(\d\d)\s+·\s+(.+)$/m);
  return { src: `course/${file}`, out: `course/${file.slice(0, -3)}/`, num, title, desc: DESC[num] ?? '', md };
});

// The other pages: repo file -> site path.
const pages = [
  { src: 'setup/README.md', out: 'setup/', label: 'Setup' },
  { src: 'setup/skills.md', out: 'setup/skills/', label: 'Setup' },
  { src: 'setup/plugins.md', out: 'setup/plugins/', label: 'Setup' },
  { src: 'skills/README.md', out: 'skills/', label: 'Skills' },
  { src: 'CREDITS.md', out: 'credits/', label: 'Credits' },
].map((p) => {
  const md = read(join(REPO, p.src));
  return { ...p, md, title: md.match(/^#\s+(.+)$/m)[1] };
});

const route = new Map([['README.md', ''], ...[...modules, ...pages].map((p) => [p.src, p.out])]);

// Page-relative link from one site path to another ('' is the home page).
const rel = (from, to) => {
  const up = from.split('/').filter(Boolean).length;
  return ('../'.repeat(up) + to) || './';
};

// A markdown link in a repo file -> a site link if that file is a page here, otherwise the file on GitHub.
function rewrite(href, fromSrc, fromOut) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [path, hash = ''] = href.split('#');
  const target = posix.normalize(posix.join(posix.dirname(fromSrc), path)).replace(/^\.\//, '');
  const anchor = hash ? `#${hash}` : '';
  if (route.has(target)) return rel(fromOut, route.get(target)) + anchor;
  if (route.has(target + 'README.md')) return rel(fromOut, route.get(target + 'README.md')) + anchor;
  return `${GITHUB}/${href.endsWith('/') ? 'tree' : 'blob'}/main/${target}${anchor}`;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (html) => html.replace(/<[^>]+>/g, '').toLowerCase().replace(/&[a-z]+;|&#\d+;/g, '').replace(/[^\w\- ]/g, '').trim().replace(/ /g, '-');
// Rendered text gets typographic apostrophes; code keeps straight ones (handled by skipping <code> and <pre> blocks).
const curly = (html) => html.split(/(<pre[\s\S]*?<\/pre>|<code>[\s\S]*?<\/code>|<[^>]+>)/).map((part, i) => (i % 2 ? part : part.replace(/(\w)'(\w)/g, '$1’$2'))).join('');

function render(md, src, out) {
  const tokens = marked.lexer(md.replace(/^#\s+.+\n+/, '')); // the h1 lives in the page header
  marked.walkTokens(tokens, (t) => { if (t.type === 'link') t.href = rewrite(t.href, src, out); });
  let html = marked.parser(tokens);
  html = html.replace(/<h([2-4])>([\s\S]*?)<\/h\1>/g, (_, n, inner) => `<h${n} id="${slug(inner)}">${inner}</h${n}>`);
  html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
  html = html.replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" rel="noopener"');
  return curly(html);
}

// ---------- shared chrome ----------
const ARROW = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 11 11 3M5 3h6v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const head = (out, title, desc) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#5d8fcf">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M2 26 12 9l5 8 4-5 9 14z' fill='%230a0c10'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${rel(out, 'assets/site.css')}">`;

const bg = (out) => `<div class="bg" aria-hidden="true">
  <img src="${rel(out, 'assets/alps-1600.webp')}" srcset="${['900', '1600', '2560'].map((w) => `${rel(out, `assets/alps-${w}.webp`)} ${w}w`).join(', ')}" sizes="100vw" alt="" fetchpriority="high">
</div>`;

const NAV_LINKS = [['Course', 'course/00-start-here/'], ['Setup', 'setup/'], ['Skills', 'setup/skills/']];
// The nav marks the link whose section the page belongs to, by path: course/… is Course, setup/skills/ is Skills, other setup/… is Setup.
const section = (out) => (out.startsWith('course/') ? 'course/00-start-here/' : out === 'setup/skills/' ? 'setup/skills/' : out.startsWith('setup/') ? 'setup/' : '');
const nav = (out) => {
  const links = NAV_LINKS.map(([label, to]) => `<a href="${rel(out, to)}"${to === section(out) ? ' aria-current="page"' : ''}>${label}</a>`).join('\n    ');
  return `<header class="nav" data-nav>
  <div class="nav-veil" aria-hidden="true">
    <span class="nav-blur" style="--b: 2px; --to: 100%"></span>
    <span class="nav-blur" style="--b: 4px; --to: 78%"></span>
    <span class="nav-blur" style="--b: 8px; --to: 60%"></span>
    <span class="nav-blur" style="--b: 16px; --to: 42%"></span>
    <span class="nav-tint"></span>
  </div>
  <a class="mark" href="${rel(out, '')}">Djordje’s Claude Playbook</a>
  <nav class="links" aria-label="Main">
    ${links}
    <a href="${GITHUB}" rel="noopener">GitHub</a>
  </nav>
  <div class="end">
    <a class="pill" href="${rel(out, 'course/00-start-here/')}">Start the course ${ARROW}</a>
    <details class="menu">
      <summary aria-label="Open menu"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 7.5h12M4 12.5h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></summary>
      <nav aria-label="Menu">
        <a href="${rel(out, '')}">Home</a>
        ${links}
        <a href="${GITHUB}" rel="noopener">GitHub</a>
      </nav>
    </details>
  </div>
</header>`;
};

const footer = (out) => `<footer class="panel foot">
  <p class="sign">Djordje’s Claude Playbook</p>
  <div class="foot-cols">
    <nav class="foot-nav" aria-label="Footer">
      <a href="${rel(out, 'course/00-start-here/')}">Course</a>
      <a href="${rel(out, 'setup/')}">Setup</a>
      <a href="${rel(out, 'setup/skills/')}">Skills</a>
      <a href="${rel(out, 'credits/')}">Credits</a>
      <a href="${GITHUB}" rel="noopener">GitHub</a>
    </nav>
    <p class="foot-note">A personal project. It has nothing to do with Google or Anthropic, and every opinion in here is mine. My own texts, skills and templates are under the <a href="${GITHUB}/blob/main/LICENSE" rel="noopener">MIT license</a>.</p>
    <p class="foot-credit">Background photo by <a href="https://unsplash.com/@gabrielgm${UTM}" rel="noopener">Gabriel Garcia Marengo</a> on <a href="https://unsplash.com/${UTM}" rel="noopener">Unsplash</a>.</p>
  </div>
</footer>`;

const scripts = (out) => `<script src="${rel(out, 'assets/site.js')}" defer></script>`;

// ---------- a reading page ----------
function page({ out, title, kicker, lede, body, current, toc, pager }) {
  const tocList = toc ? `<ol class="toc-list">${modules.map((m) => `<li><a href="${rel(out, m.out)}"${m.out === out ? ' aria-current="page"' : ''}><span class="num">${m.num}</span>${esc(m.title)}</a></li>`).join('')}</ol>` : '';
  return `${head(out, `${title} — Djordje’s Claude Playbook`, lede || title)}
</head>
<body class="doc">
${bg(out)}
${nav(out, current)}
<main id="top">
  <header class="doc-head">
    ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
    <h1>${esc(title)}</h1>
  </header>
  <div class="content">
    <div class="sheet${toc ? ' has-toc' : ''}">
      ${toc ? `<aside class="toc" aria-label="Course modules"><p class="toc-h">The course</p>${tocList}</aside>
      <details class="toc-m"><summary>All 13 modules</summary>${tocList}</details>` : ''}
      <article class="prose">
${lede ? `<p class="doc-lede">${esc(lede)}.</p>` : ''}
${body}
      </article>
      ${pager ?? ''}
    </div>
    ${footer(out)}
  </div>
</main>
${scripts(out)}
</body>
</html>
`;
}

const card = (out, to, t, s) => `<a class="card" href="${rel(out, to)}"><span><span class="card-t">${t}</span><span class="card-s">${s}</span></span><span class="go" aria-hidden="true">${ARROW}</span></a>`;

// ---------- the home page ----------
function home() {
  const out = '';
  const mods = modules.map((m) => `<li><a href="${m.out}"><span class="num">${m.num}</span><span class="ttl">${esc(m.title)}</span><span class="desc">${esc(m.desc)}</span></a></li>`).join('\n        ');
  const tools = render(read(join(REPO, 'README.md')).match(/## What I use most, and where\n+((?:\|.*\n)+)/)[1], 'README.md', out);
  return `${head(out, 'Djordje’s Claude Playbook', 'How I actually work with Claude. A free course and the exact setup I use, written down after over 1,000 sessions.')}
<script>
  // The scroll story only runs when the visitor allows motion, and is dropped again unless it starts within 3 s.
  if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    document.documentElement.classList.add('motion');
    setTimeout(function () { if (!window.motionReady) document.documentElement.classList.remove('motion'); }, 3000);
  }
</script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
</head>
<body class="home">
${bg(out)}
${nav(out)}
<main id="top">
  <section class="intro" aria-labelledby="hero-h">
    <div class="intro-pin">
      <div class="hero">
        <div class="hero-h">
          <h1 id="hero-h"><span class="line">How I actually</span> <span class="line">work with Claude.</span></h1>
        </div>
        <div class="hero-foot">
          <p class="lede">A free course and the exact setup I use, written down after over 1,000 sessions.</p>
          <p class="cap">Photo: <a href="https://unsplash.com/@gabrielgm${UTM}" rel="noopener">Gabriel Garcia Marengo</a> on <a href="https://unsplash.com/${UTM}" rel="noopener">Unsplash</a></p>
        </div>
      </div>
      <div class="about">
        <div class="hello">
          <p class="hello-name" data-in>I’m Djordje.</p>
          <p class="hello-what" data-in>SWE apprentice at Google, doing the BMS alongside it, and co-founder of <a href="https://www.avtoris.studio" rel="noopener">Avtoris</a>.</p>
        </div>
        <div class="why" data-in>
          <h2>Why I’m sharing this</h2>
          <p>Garry Tan published his Claude Code setup as <a href="https://github.com/garrytan/gstack" rel="noopener">gstack</a>, and I think more people should. So this is mine, built from over 1,000 real sessions: the prompts, the setup, and the mistakes I made along the way.</p>
        </div>
      </div>
    </div>
  </section>

  <div class="content">
    <ul class="paths" aria-label="Three ways to use this" data-rg>
      <li data-r>${card(out, 'course/00-start-here/', 'Learn', '13 modules, a few evenings')}</li>
      <li data-r>${card(out, 'setup/', 'Copy my setup', 'About 15 minutes')}</li>
      <li data-r>${card(out, 'setup/skills/', 'Find a skill', 'Sorted by topic, with install commands')}</li>
    </ul>

    <section class="panel" id="course" aria-labelledby="course-h" data-rg>
      <div class="panel-head" data-r>
        <h2 id="course-h">The course, in 13 modules</h2>
        <p>Every module works the same way: what you’ll learn, a short explanation, a real example from my work, an exercise, and the mistakes I made so you don’t have to.</p>
      </div>
      <ol class="mods" data-r>
        ${mods}
      </ol>
    </section>

    <section class="panel" id="tools" aria-labelledby="tools-h" data-rg>
      <div class="panel-head" data-r>
        <h2 id="tools-h">What I use most, and where</h2>
        <p>I’ve had about 150 skills installed at once. Most of the time I just tell Claude to pick the best skills for the job and how many to use. The install commands are in <a href="setup/skills/">the skills list</a>.</p>
      </div>
      <div class="prose prose-table" data-r>${tools}</div>
    </section>

    ${footer(out)}
  </div>
</main>
${scripts(out)}
<script src="assets/home.js" defer></script>
</body>
</html>
`;
}

// ---------- write ----------
rmSync(DIST, { recursive: true, force: true });
const write = (out, html) => { mkdirSync(join(DIST, out), { recursive: true }); writeFileSync(join(DIST, out, 'index.html'), html); };

write('', home());
modules.forEach((m, i) => {
  const prev = modules[i - 1], next = modules[i + 1];
  const pager = `<nav class="pager" aria-label="Modules">
        ${prev ? card(m.out, prev.out, `${prev.num} · ${esc(prev.title)}`, 'Previous') : '<span></span>'}
        ${next ? card(m.out, next.out, `${next.num} · ${esc(next.title)}`, 'Next') : card(m.out, 'setup/', 'Copy the setup', 'You’re done with the course')}
      </nav>`;
  write(m.out, page({ out: m.out, title: m.title, kicker: `Module ${m.num}`, lede: m.desc, body: render(m.md, m.src, m.out), current: 'Course', toc: true, pager }));
});
pages.forEach((p) => write(p.out, page({ out: p.out, title: p.title, kicker: p.label === p.title ? '' : p.label, body: render(p.md, p.src, p.out), current: p.label })));
cpSync(join(SITE, 'assets'), join(DIST, 'assets'), { recursive: true });
writeFileSync(join(DIST, '.nojekyll'), '');

// Self-check: every relative link in the output resolves to a built file.
const built = new Set();
const walk = (dir, base = '') => readdirSync(join(DIST, dir), { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(join(dir, e.name), `${base}${e.name}/`) : built.add(`${base}${e.name}`)));
walk('');
let broken = 0;
for (const f of [...built].filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(join(DIST, f), 'utf8');
  for (const [, href] of html.matchAll(/(?:href|src)="([^"#]+)/g)) {
    if (/^(https?:|mailto:|data:)/.test(href)) continue;
    let t = posix.normalize(posix.join(posix.dirname(f), href)).replace(/^\.\/?$|^\.\//, '');
    if (t === '' || t.endsWith('/')) t += 'index.html';
    if (!built.has(t)) { broken++; console.error(`broken link in ${f}: ${href}`); }
  }
}
if (broken) process.exit(1);
console.log(`built ${built.size} files, ${modules.length} modules, ${pages.length} pages, 0 broken links`);
