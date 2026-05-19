---
name: visual-prompt-library
description: Search and reuse a bundled visual prompt library covering GPT Image 2 image prompts, EvoLinkAI GPT Image 2 cases, Craftian video generation prompts, image-to-video examples, local MP4 references, and prompt-gallery maintenance. Use when the user asks to find, compare, summarize, adapt, or install image/video generation prompts from the navigation site or its source collections.
---

# Visual Prompt Library

Use the bundled prompt index first. Do not load `references/prompt-index.json` into context directly unless a narrow manual inspection is required; it is large. Use the search script to pull the relevant rows.

## Quick Search

Run from this skill folder:

```bash
node scripts/search-prompts.mjs "product ad" --kind image --limit 6
node scripts/search-prompts.mjs "travel vlog" --kind video --limit 6
node scripts/search-prompts.mjs "blueprint house" --collection craftian --full
node scripts/search-prompts.mjs --stats
```

Prefer `--json` when you need exact fields for downstream processing:

```bash
node scripts/search-prompts.mjs "fashion campaign" --json --limit 5
```

## Use Results

- Return titles, source collection, detail path, and the most relevant prompt text.
- Include the full prompt only when the user asks for it or when adapting it is the task.
- For image prompts, use `category`, `group`, `image`, `note`, `promptSummary`, and `prompt`.
- For video prompts, use `video`, `poster`, `duration`, `labels`, `use`, `promptSummary`, and `prompt`.
- Cite source URLs when present, especially for EvoLinkAI and Craftian cases.

## Adapt Prompts

When adapting a prompt, preserve the useful structure and replace only the user's requested variables:

- Subject, product, scene, location, style, duration, aspect ratio, and negative constraints.
- Keep multi-scene JSON or timestamped video beats when the source prompt uses them.
- For product ads and UI prompts, keep layout constraints and readable text requirements.
- For video prompts, keep timing, camera motion, subject consistency, and artifact-prevention rules.

## Source Maintenance

Read `references/sources.md` only when the user asks about provenance, refreshing data, or publishing the npm installer.
