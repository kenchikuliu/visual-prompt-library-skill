# visual-prompt-library-skill

Install the `visual-prompt-library` Codex skill with `npx`.

From GitHub Release:

```bash
npx -y https://github.com/kenchikuliu/visual-prompt-library-skill/releases/download/v0.1.0/visual-prompt-library-skill-0.1.0.tgz
```

After npm publishing:

```bash
npx visual-prompt-library-skill
```

By default it installs to `$CODEX_HOME/skills/visual-prompt-library`, or `~/.codex/skills/visual-prompt-library` when `CODEX_HOME` is unset.

Useful options:

```bash
npx visual-prompt-library-skill --force
npx visual-prompt-library-skill --target ~/.codex/skills
npx visual-prompt-library-skill --dry-run
```
