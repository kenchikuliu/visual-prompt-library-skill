# visual-prompt-library-skill

Install the `visual-prompt-library` Codex skill with `npx`. It bundles a searchable prompt index for GPT Image 2 image prompts, EvoLinkAI image/API cases, Craftian video generation prompts, and image-to-video examples.

Current public release: `v0.1.3`.

From GitHub:

```bash
npx -y github:kenchikuliu/visual-prompt-library-skill
```

From GitHub Release:

```bash
npx -y https://github.com/kenchikuliu/visual-prompt-library-skill/releases/download/v0.1.3/visual-prompt-library-skill-0.1.3.tgz
```

After npm publishing, the shorter npm registry command is:

```bash
npx -y visual-prompt-library-skill
```

By default it installs to `$CODEX_HOME/skills/visual-prompt-library`, or `~/.codex/skills/visual-prompt-library` when `CODEX_HOME` is unset.

Useful options:

```bash
npx visual-prompt-library-skill --force
npx visual-prompt-library-skill --target ~/.codex/skills
npx visual-prompt-library-skill --dry-run
```

## Verify

```bash
npm run check
```

The package currently includes 854 indexed prompt entries: 820 image prompts and 34 video prompts.

## Publishing

This repository includes a GitHub Actions workflow at `.github/workflows/npm-publish.yml`.

Publishing options:

- Run **Publish to npm** manually with `mode=dry-run` to verify package contents without credentials.
- Add an `NPM_TOKEN` repository secret, then run **Publish to npm** with `mode=publish` or publish a GitHub Release.
- Or configure npm trusted publishing for this repository and workflow, set repository variable `NPM_TRUSTED_PUBLISHING=true`, then run the workflow with `mode=publish` or publish a GitHub Release without an npm token.
- Without either credential path, release-triggered runs only validate the package and skip npm publishing.

Local checks before publishing:

```bash
npm publish --dry-run --access public
```
