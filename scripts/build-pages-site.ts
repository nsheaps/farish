#!/usr/bin/env bun
import { existsSync } from 'node:fs';
/**
 * build-pages-site.ts — assemble the farish GitHub Pages site.
 *
 * Initial prompt step 28 requires that, on every push to `main`, CI:
 *   - publishes the built app,
 *   - publishes the docs/specs/wireframes as a rendered, browsable site,
 *   - publishes the screenshot runs so progress can be followed.
 *
 * GitHub Pages serves ONE deployment per repo, so all three must live under a
 * single site directory. This script assembles that directory:
 *
 *   <out>/                 ← the built Vue app (apps/web/dist)
 *   <out>/docs/            ← docs/**.md rendered to HTML (Mermaid-aware, A6)
 *   <out>/screenshots/     ← screenshot runs copied from docs/screenshots/
 *
 * Markdown is rendered with `marked` (an off-the-shelf, well-maintained
 * parser) — this is NOT a hand-rolled static-site generator, just glue. Each
 * page is wrapped in a small HTML template that loads Mermaid from a CDN and
 * initialises it on fenced ```mermaid blocks so diagrams render (amendment A6).
 *
 * Usage:  bun run scripts/build-pages-site.ts <out-dir>
 * Docs:   scripts/README.md
 */
import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { marked } from 'marked';

/** Repo root — this file lives in <root>/scripts/. */
const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');

/** Marked renders ```mermaid blocks as <pre class="mermaid"> so the Mermaid
 *  script (loaded in the template) can find and render them. */
marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }): string | false {
      if (lang === 'mermaid') {
        return `<pre class="mermaid">${text}</pre>`;
      }
      return false; // fall through to marked's default code renderer
    },
  },
});

/** Recursively list every file under `dir`, returned as repo-relative paths. */
async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else {
      out.push(full);
    }
  }
  return out;
}

/**
 * Wrap rendered markdown in the site HTML shell (CSS + Mermaid + nav).
 *
 * `docsHomeHref` / `appHref` are relative hrefs (from the page being wrapped)
 * to `_site/docs/index.html` and the site root `_site/` respectively. The
 * caller computes them because docs pages, the docs index, and the
 * screenshots index all sit at different depths and below different roots.
 */
function htmlShell(title: string, body: string, docsHomeHref: string, appHref: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — farish docs</title>
<style>
  body { font: 16px/1.6 system-ui, sans-serif; max-width: 860px; margin: 0 auto;
         padding: 2rem 1rem; color: #1a1a1a; }
  a { color: #1565c0; }
  pre { background: #f4f4f4; padding: 1rem; overflow-x: auto; border-radius: 6px; }
  code { background: #f4f4f4; padding: 0.1em 0.3em; border-radius: 3px; }
  pre code { background: none; padding: 0; }
  pre.mermaid { background: none; text-align: center; }
  table { border-collapse: collapse; } td, th { border: 1px solid #ddd; padding: 6px 10px; }
  nav.site { margin-bottom: 2rem; font-size: 0.9rem; }
  img { max-width: 100%; }
</style>
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true });
</script>
</head>
<body>
<nav class="site"><a href="${docsHomeHref}">farish docs home</a> · <a href="${appHref}">farish app</a></nav>
${body}
</body>
</html>
`;
}

/** Render every docs/**.md file into <out>/docs/**.html. Returns the list of
 *  generated doc pages (repo-relative .md paths) for the index. */
async function renderDocs(out: string): Promise<string[]> {
  const docsRoot = join(ROOT, 'docs');
  const files = (await walk(docsRoot)).filter((f) => f.endsWith('.md'));
  const rendered: string[] = [];
  for (const file of files) {
    const rel = relative(docsRoot, file); // e.g. pages/home/SPEC.md
    const outPath = join(out, 'docs', rel.replace(/\.md$/, '.html'));
    await mkdir(dirname(outPath), { recursive: true });
    const md = await readFile(file, 'utf8');
    // Depth of this page below _site/docs/ — `pages/home/SPEC.md` is depth 2.
    const depth = rel.split('/').length - 1;
    const docsHomeHref = `${'../'.repeat(depth)}index.html`; // → _site/docs/index.html
    const appHref = '../'.repeat(depth + 1); // → _site/ (one extra level above docs/)
    const body = await marked.parse(md);
    await writeFile(outPath, htmlShell(rel, body, docsHomeHref, appHref));
    rendered.push(rel);
  }
  return rendered.sort();
}

/** Write <out>/docs/index.html listing every rendered doc. */
async function writeDocsIndex(out: string, docs: string[]): Promise<void> {
  const items = docs
    .map((d) => `  <li><a href="${d.replace(/\.md$/, '.html')}">${d}</a></li>`)
    .join('\n');
  const body = `<h1>farish documentation</h1>
<p>Specs, wireframes, API designs and research for the farish project.
Published automatically on every push to <code>main</code> (initial prompt step 28).</p>
<ul>
${items}
</ul>`;
  // The docs index lives at _site/docs/index.html: it links to itself and to
  // the site root one level up.
  await writeFile(
    join(out, 'docs', 'index.html'),
    htmlShell('Documentation', body, 'index.html', '../'),
  );
}

/** Copy committed screenshot runs and write a run index. */
async function buildScreenshots(out: string): Promise<void> {
  const src = join(ROOT, 'docs', 'screenshots');
  const dest = join(out, 'screenshots');
  await mkdir(dest, { recursive: true });
  let runs: string[] = [];
  if (existsSync(src)) {
    await cp(src, dest, { recursive: true });
    runs = (await readdir(src, { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
      .reverse(); // newest first
  }
  const items =
    runs.length > 0
      ? runs.map((r) => `  <li><a href="${r}/">${r}</a></li>`).join('\n')
      : '  <li><em>No screenshot runs published yet.</em></li>';
  const body = `<h1>farish page screenshots</h1>
<p>Each run is a date-stamped capture of every page, taken by the CI Playwright
suite on a push to <code>main</code> (initial prompt step 28).</p>
<ul>
${items}
</ul>`;
  // The screenshots index lives at _site/screenshots/index.html: docs home is
  // one level up then into docs/; the site root is one level up.
  await writeFile(
    join(dest, 'index.html'),
    htmlShell('Screenshots', body, '../docs/index.html', '../'),
  );
}

/** Copy the built Vue app into the site root. */
async function copyApp(out: string): Promise<void> {
  const dist = join(ROOT, 'apps', 'web', 'dist');
  if (!existsSync(dist)) {
    throw new Error(`apps/web/dist not found — run \`nx run web:build\` first.`);
  }
  await cp(dist, out, { recursive: true });
}

async function main(): Promise<void> {
  const outArg = process.argv[2];
  if (!outArg) {
    process.stderr.write('usage: bun run scripts/build-pages-site.ts <out-dir>\n');
    process.exit(1);
  }
  const out = resolve(outArg);
  await mkdir(out, { recursive: true });
  await copyApp(out);
  const docs = await renderDocs(out);
  await writeDocsIndex(out, docs);
  await buildScreenshots(out);
  process.stdout.write(
    `Pages site assembled at ${out} — app + ${docs.length} doc pages + screenshots.\n`,
  );
}

main().catch((err) => {
  process.stderr.write(`build-pages-site failed: ${(err as Error).message}\n`);
  process.exit(1);
});
