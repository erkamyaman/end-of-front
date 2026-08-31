import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'docs');

const stageDirs = readdirSync(ROOT)
  .filter((d) => d.startsWith('stage-'))
  .sort((a, b) => stageNumber(a) - stageNumber(b));

function stageNumber(dir) {
  return Number(dir.match(/^stage-([\d.]+)/)[1]);
}

function stageTitle(dir) {
  const readme = tryRead(join(ROOT, dir, 'README.md'));
  const heading = readme?.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : dir;
}

function tryRead(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

function fileNumber(name) {
  return Number(basename(name).match(/^([\d.]+)/)?.[1] ?? 0);
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

/** A file with no code under its header is a topic not started yet. */
function statusOf(code) {
  return code.length > 0 ? 'done' : 'todo';
}

for (const stale of readdirSync(OUT, { withFileTypes: true }).filter((e) => e.isFile())) {
  rmSync(join(OUT, stale.name));
}
mkdirSync(join(OUT, '.vitepress'), { recursive: true });

const index = [];
let totalTopics = 0;
let startedTopics = 0;

for (const dir of stageDirs) {
  const files = readdirSync(join(ROOT, dir))
    .filter((f) => f.endsWith('.js'))
    .sort((a, b) => fileNumber(a) - fileNumber(b));

  const title = stageTitle(dir);
  const started = [];
  const lines = [`# ${title}`, ''];

  const readme = tryRead(join(ROOT, dir, 'README.md')) ?? '';
  const book = readme.match(/^\*\*Book:\*\*([\s\S]*?)(?=\n\n)/m);
  if (book) lines.push(`> **Book:**${book[1].trim().replace(/\n/g, ' ')}`, '');

  for (const file of files) {
    const { prose, code } = splitTopic(readFileSync(join(ROOT, dir, file), 'utf8'));
    const status = statusOf(code);

    totalTopics += 1;
    if (status === 'done') {
      startedTopics += 1;
      started.push(file);
    }

    const [heading, ...rest] = prose.split('\n\n');

    lines.push(`## ${heading.replace(/\n/g, ' ').trim()}`, '');
    lines.push(`<Badge type="${status === 'done' ? 'tip' : 'info'}" text="${status}" />`, '');
    lines.push(`\`${file}\``, '');

    for (const para of rest) lines.push(para.replace(/\n/g, ' ').trim(), '');

    if (code) lines.push('```js', code, '```', '');
  }

  const slug = dir.replace(/^stage-/, 'stage-');
  writeFileSync(join(OUT, `${slug}.md`), lines.join('\n'));

  index.push({ slug, title, total: files.length, started: started.length });
}

const home = [
  '---',
  'layout: home',
  'hero:',
  '  name: end-of-front',
  '  text: JS/TS fundamentals, Angular-flavored',
  '  tagline: Having fun with JS/TS and their connection with Angular',
  'features:',
  ...index.map((s) =>
    [
      `  - title: ${s.title.replace(/:/g, '')}`,
      `    details: ${s.started} of ${s.total} topics written`,
      `    link: /${s.slug}`,
    ].join('\n'),
  ),
  '---',
  '',
  `**${startedTopics} of ${totalTopics} topics written.**`,
  '',
].join('\n');

writeFileSync(join(OUT, 'index.md'), home);
writeFileSync(
  join(OUT, '.vitepress', 'sidebar.json'),
  JSON.stringify(
    index.map((s) => ({ text: s.title, link: `/${s.slug}` })),
    null,
    2,
  ),
);

console.log(`docs: ${index.length} stages, ${startedTopics}/${totalTopics} topics written`);
