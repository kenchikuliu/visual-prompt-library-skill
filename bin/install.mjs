#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourceSkillDir = path.join(packageRoot, 'skill', 'visual-prompt-library');
const skillName = 'visual-prompt-library';

function usage() {
  return `Install the ${skillName} Codex skill.

Usage:
  npx visual-prompt-library-skill [--target <skills-dir>] [--force] [--dry-run]

Options:
  --target <skills-dir>  Skill root directory. Defaults to "$CODEX_HOME/skills" or "~/.codex/skills".
  --force                Replace an existing skill without creating a backup.
  --dry-run              Print what would happen without writing files.
  -h, --help             Show this help.
`;
}

function parseArgs(argv) {
  const options = {
    target: undefined,
    force: false,
    dryRun: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--target') {
      const value = argv[index + 1];

      if (!value) {
        throw new Error('--target requires a directory path');
      }

      options.target = value;
      index += 1;
      continue;
    }

    if (arg === '--force') {
      options.force = true;
      continue;
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '-h' || arg === '--help') {
      options.help = true;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function defaultSkillsDir() {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
  return path.join(codexHome, 'skills');
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function assertSourceSkill() {
  const skillFile = path.join(sourceSkillDir, 'SKILL.md');

  if (!fs.existsSync(skillFile)) {
    throw new Error(`Package is missing ${skillFile}`);
  }
}

function install(options) {
  assertSourceSkill();

  const skillsDir = path.resolve(options.target || defaultSkillsDir());
  const targetSkillDir = path.join(skillsDir, skillName);

  if (options.dryRun) {
    console.log(`Would install ${sourceSkillDir}`);
    console.log(`Target: ${targetSkillDir}`);
    return;
  }

  fs.mkdirSync(skillsDir, { recursive: true });

  if (fs.existsSync(targetSkillDir)) {
    if (options.force) {
      fs.rmSync(targetSkillDir, { recursive: true, force: true });
    } else {
      const backupDir = `${targetSkillDir}.backup-${timestamp()}`;
      fs.renameSync(targetSkillDir, backupDir);
      console.log(`Existing skill backed up to ${backupDir}`);
    }
  }

  fs.cpSync(sourceSkillDir, targetSkillDir, {
    recursive: true,
    dereference: true,
  });

  console.log(`Installed ${skillName} to ${targetSkillDir}`);
  console.log('Try: Use $visual-prompt-library to find video prompts for travel vlogs.');
}

try {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    console.log(usage());
    process.exit(0);
  }

  install(options);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  console.error('');
  console.error(usage());
  process.exit(1);
}
