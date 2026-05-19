# visual-prompt-library-skill

Install the `visual-prompt-library` Codex skill with `npx`.

From GitHub:

```bash
npx -y github:kenchikuliu/visual-prompt-library-skill
```

From GitHub Release:

```bash
npx -y https://github.com/kenchikuliu/visual-prompt-library-skill/releases/download/v0.1.0/visual-prompt-library-skill-0.1.0.tgz
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

## Publishing

This repository includes a GitHub Actions workflow at `.github/workflows/npm-publish.yml`.

Publishing options:

- Add an `NPM_TOKEN` repository secret, then run **Publish to npm** manually or publish a GitHub Release.
- Or configure npm trusted publishing for this repository and workflow, then run the same workflow without an npm token.

Local checks before publishing:

```bash
npm publish --dry-run --access public
```
