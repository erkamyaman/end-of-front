import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'docs');

const stageDirs = readdirSync(ROOT)
  .filter((d) => d.startsWith('stage-'))
  .sort((a, b) => stageNumber(a) - stageNumber(b));

function stageNumber(dir) {
  return Number(dir.match(/^stage-([\d.]+)/)[1]);
}

function tryRead(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

function stageTitle(dir) {
  const heading = tryRead(join(ROOT, dir, 'README.md'))?.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : dir;
}

/** '01.2-class-fields-vs-variables.js' -> { major: '01', order: 1.2, slug: '...' } */
function parseName(file) {
  const number = basename(file, '.js').match(/^([\d.]+)/)?.[1] ?? '0';
  return {
    number,
    major: number.split('.')[0],
    order: Number(number),
    slug: basename(file, '.js'),
  };
}

/** Split a topic file into its leading block comment and the code that follows. */
function splitTopic(source) {
  const match = source.match(/^\s*\/\*\*([\s\S]*?)\*\//);
  if (!match) return { prose: '', code: source.trim() };

  const prose = match[1]
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim();

  return { prose, code: source.slice(match[0].length).trim() };
}

const KEEP = new Set(['.vitepress', 'public']);

for (const entry of readdirSync(OUT, { withFileTypes: true })) {
  if (KEEP.has(entry.name)) continue;
  rmSync(join(OUT, entry.name), { recursive: true, force: true });
}
mkdirSync(join(OUT, '.vitepress'), { recursive: true });

const sidebar = [];
const home = [];
let totalTopics = 0;
let writtenTopics = 0;

for (const dir of stageDirs) {
  const title = stageTitle(dir);
  const files = readdirSync(join(ROOT, dir))
    .filter((f) => f.endsWith('.js'))
    .sort((a, b) => parseName(a).order - parseName(b).order);

  /** Group each numbered topic with its sub-topics: 01, 01.1, 01.2 share one page. */
  const groups = new Map();
  for (const file of files) {
    const { major } = parseName(file);
    if (!groups.has(major)) groups.set(major, []);
    groups.get(major).push(file);
  }

  mkdirSync(join(OUT, dir), { recursive: true });

  const items = [];
  let stageWritten = 0;

  for (const [, group] of groups) {
    const pageSlug = parseName(group[0]).slug;
    const lines = [];
    let pageTitle = pageSlug;
    let groupWritten = 0;

    for (const [index, file] of group.entries()) {
      const { prose, code } = splitTopic(readFileSync(join(ROOT, dir, file), 'utf8'));
      const [headingRaw, ...rest] = prose.split('\n\n');
      const heading = headingRaw.replace(/\n/g, ' ').trim();
      const [name, ...summary] = heading.split(/:\s/);

      totalTopics += 1;
      if (code) {
        writtenTopics += 1;
        stageWritten += 1;
        groupWritten += 1;
      }

      const numbered = `${parseName(file).number} ${name}`;

      if (index === 0) {
        pageTitle = numbered;
        lines.push(`# ${numbered}`, '');
      } else {
        lines.push(`## ${numbered}`, '');
      }

      lines.push(`<Badge type="${code ? 'tip' : 'info'}" text="${code ? 'written' : 'todo'}" />`);
      lines.push(`\`${dir}/${file}\``, '');

      if (summary.length) lines.push(summary.join(': '), '');
      for (const para of rest) lines.push(para.replace(/\n/g, ' ').trim(), '');

      if (code) lines.push('```js', code, '```', '');
    }

    writeFileSync(join(OUT, dir, `${pageSlug}.md`), lines.join('\n'));
    items.push({ text: pageTitle, link: `/${dir}/${pageSlug}`, written: groupWritten > 0 });
  }

  const book = tryRead(join(ROOT, dir, 'README.md'))?.match(/^\*\*Book:\*\*([\s\S]*?)(?=\n\n)/m);
  const index = [`# ${title}`, ''];
  if (book) index.push(`> **Book:**${book[1].trim().replace(/\n/g, ' ')}`, '');
  index.push(`${stageWritten} of ${files.length} topics written.`, '');
  for (const item of items) {
    index.push(
      `- [${item.text}](${item.link})${item.written ? '' : ' <Badge type="info" text="todo" />'}`,
    );
  }
  writeFileSync(join(OUT, dir, 'index.md'), index.join('\n') + '\n');

  sidebar.push({
    text: title,
    collapsed: true,
    items: items.map(({ text, link }) => ({ text, link })),
  });
  home.push({ dir, title, total: files.length, written: stageWritten });
}

const homePage = [
  '---',
  'layout: home',
  'hero:',
  '  name: end-of-front',
  '  text: JS/TS fundamentals, Angular-flavoured',
  '  tagline: Having fun with JS/TS and their connection with Angular',
  'features:',
  ...home.map((s) =>
    [
      `  - title: ${s.title.replace(/:/g, '')}`,
      `    details: ${s.written} of ${s.total} topics written`,
      `    link: /${s.dir}/`,
    ].join('\n'),
  ),
  '---',
  '',
  `**${writtenTopics} of ${totalTopics} topics written.**`,
  '',
].join('\n');

writeFileSync(join(OUT, 'index.md'), homePage);
writeFileSync(join(OUT, '.vitepress', 'sidebar.json'), JSON.stringify(sidebar, null, 2));

if (!existsSync(join(OUT, '.vitepress', 'config.mjs'))) throw new Error('missing vitepress config');

console.log(
  `docs: ${sidebar.length} stages, ${sidebar.reduce((n, s) => n + s.items.length, 0)} pages, ${writtenTopics}/${totalTopics} topics written`,
);
