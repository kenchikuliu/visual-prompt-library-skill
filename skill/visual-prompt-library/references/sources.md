# Sources

Use this reference when the user asks where the visual prompt examples came from or how to refresh the package.

## Included Collections

- `gpt-image-gallery`: image-generation prompts from the GPT Image Prompt Gallery site.
- `EvoLinkAI`: imported GPT Image 2 cases from `https://github.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts`.
- `craftian`: public Craftian examples with video prompts, image prompts, local MP4 references, metrics, and topic labels.

## Refresh Workflow

In the source repository:

```bash
pnpm content:generate
node scripts/build-visual-prompt-skill-index.mjs
python3 /path/to/skill-creator/scripts/quick_validate.py packages/visual-prompt-library-skill/skill/visual-prompt-library
```

Before publishing the npm package:

```bash
npm pack ./packages/visual-prompt-library-skill --pack-destination /tmp
```
