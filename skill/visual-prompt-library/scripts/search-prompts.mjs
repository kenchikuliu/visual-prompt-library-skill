#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skillRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const indexPath = path.join(skillRoot, 'references', 'prompt-index.json');

function usage() {
  return `Search the visual prompt library.

Usage:
  node scripts/search-prompts.mjs [query] [options]

Options:
  --kind image|video|all       Filter by prompt kind.
  --collection <name>          Filter by collection, e.g. gpt-image-gallery or craftian.
  --group <name>               Filter by group.
  --category <text>            Filter by image category.
  --label <name>               Filter by Craftian label.
  --source <text>              Filter by source name.
  --limit <number>             Result limit. Defaults to 8.
  --json                       Print machine-readable JSON.
  --full                       Include full prompt text in plain output.
  --stats                      Print collection stats.
  -h, --help                   Show this help.
`;
}

function parseArgs(argv) {
  const options = {
    query: [],
    kind: 'all',
    collection: undefined,
    group: undefined,
    category: undefined,
    label: undefined,
    source: undefined,
    limit: 8,
    json: false,
    full: false,
    stats: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '-h' || arg === '--help') {
      options.help = true;
      continue;
    }

    if (arg === '--json') {
      options.json = true;
      continue;
    }

    if (arg === '--full') {
      options.full = true;
      continue;
    }

    if (arg === '--stats') {
      options.stats = true;
      continue;
    }

    if (
      [
        '--kind',
        '--collection',
        '--group',
        '--category',
        '--label',
        '--source',
        '--limit',
      ].includes(arg)
    ) {
      const value = argv[index + 1];

      if (!value) {
        throw new Error(`${arg} requires a value`);
      }

      const key = arg.slice(2);
      options[key] = key === 'limit' ? Number.parseInt(value, 10) : value;
      index += 1;
      continue;
    }

    options.query.push(arg);
  }

  if (!['image', 'video', 'all'].includes(options.kind)) {
    throw new Error('--kind must be image, video, or all');
  }

  if (!Number.isFinite(options.limit) || options.limit < 1) {
    throw new Error('--limit must be a positive number');
  }

  return {
    ...options,
    query: options.query.join(' ').trim(),
  };
}

function loadIndex() {
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Missing prompt index: ${indexPath}`);
  }

  return JSON.parse(fs.readFileSync(indexPath, 'utf8'));
}

function normalize(value) {
  return String(value ?? '').toLowerCase();
}

function compactText(parts) {
  return parts.filter(Boolean).join(' ');
}

function truncate(value, maxLength = 260) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}

function entryHaystack(entry) {
  return {
    title: normalize(entry.title),
    metadata: normalize(
      compactText([
        entry.category,
        entry.group,
        entry.collection,
        entry.source,
        ...(entry.labels ?? []),
      ])
    ),
    summary: normalize(compactText([entry.promptSummary, entry.note, entry.use])),
    prompt: normalize(entry.prompt),
  };
}

function scoreEntry(entry, query) {
  if (!query) {
    const popularity = Number.parseFloat(entry.score ?? '0') || 0;
    return popularity;
  }

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const haystack = entryHaystack(entry);
  let score = 0;

  for (const term of terms) {
    if (haystack.title.includes(term)) {
      score += 30;
    }

    if (haystack.metadata.includes(term)) {
      score += 14;
    }

    if (haystack.summary.includes(term)) {
      score += 8;
    }

    if (haystack.prompt.includes(term)) {
      score += 3;
    }
  }

  return score;
}

function matchesFilters(entry, options) {
  if (options.kind !== 'all' && entry.kind !== options.kind) {
    return false;
  }

  if (options.collection && entry.collection !== options.collection) {
    return false;
  }

  if (options.group && entry.group !== options.group) {
    return false;
  }

  if (options.category && !normalize(entry.category).includes(normalize(options.category))) {
    return false;
  }

  if (options.label && !(entry.labels ?? []).includes(options.label)) {
    return false;
  }

  if (options.source && !normalize(entry.source).includes(normalize(options.source))) {
    return false;
  }

  return true;
}

function search(index, options) {
  return index.entries
    .filter((entry) => matchesFilters(entry, options))
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, options.query),
    }))
    .filter((result) => !options.query || result.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, options.limit)
    .map(({ entry, score }) => ({ ...entry, matchScore: score }));
}

function printStats(index) {
  const byCollection = {};
  const byKind = {};
  const byGroup = {};
  const byLabel = {};

  for (const entry of index.entries) {
    byCollection[entry.collection] = (byCollection[entry.collection] ?? 0) + 1;
    byKind[entry.kind] = (byKind[entry.kind] ?? 0) + 1;
    byGroup[entry.group ?? 'none'] = (byGroup[entry.group ?? 'none'] ?? 0) + 1;

    for (const label of entry.labels ?? []) {
      byLabel[label] = (byLabel[label] ?? 0) + 1;
    }
  }

  console.log(JSON.stringify({
    generatedAt: index.generatedAt,
    stats: index.stats,
    byCollection,
    byKind,
    byGroup,
    topLabels: Object.fromEntries(
      Object.entries(byLabel).sort((a, b) => b[1] - a[1]).slice(0, 20)
    ),
  }, null, 2));
}

function printPlain(results, options) {
  if (results.length === 0) {
    console.log('No matching prompts found.');
    return;
  }

  for (const [index, entry] of results.entries()) {
    console.log(`${index + 1}. ${entry.title}`);
    console.log(
      `   ${entry.kind} | ${entry.collection} | ${entry.group ?? entry.category ?? 'uncategorized'}`
    );
    console.log(`   Source: ${entry.source}${entry.sourceUrl ? ` (${entry.sourceUrl})` : ''}`);
    console.log(`   Detail: ${entry.detailPath}`);

    if (entry.video) {
      console.log(`   Video: ${entry.video}`);
    }

    if (entry.image) {
      console.log(`   Image: ${entry.image}`);
    }

    if (entry.poster) {
      console.log(`   Poster: ${entry.poster}`);
    }

    const summary = entry.promptSummary || entry.use || entry.note;

    if (summary) {
      console.log(`   Summary: ${truncate(summary)}`);
    }

    console.log(`   Prompt: ${options.full ? entry.prompt : truncate(entry.prompt)}`);
    console.log('');
  }
}

try {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    console.log(usage());
    process.exit(0);
  }

  const index = loadIndex();

  if (options.stats) {
    printStats(index);
    process.exit(0);
  }

  const results = search(index, options);

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    printPlain(results, options);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  console.error('');
  console.error(usage());
  process.exit(1);
}
