#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const hooksDir = path.join(rootDir, '.githooks');

if (!fs.existsSync(path.join(rootDir, '.git'))) {
  console.log('Skipping hook install: no .git directory found.');
  process.exit(0);
}

for (const hookName of ['pre-commit', 'pre-push']) {
  const hookPath = path.join(hooksDir, hookName);
  if (fs.existsSync(hookPath)) {
    fs.chmodSync(hookPath, 0o755);
  }
}

execFileSync('git', ['config', 'core.hooksPath', '.githooks'], {
  cwd: rootDir,
  stdio: 'inherit',
});

console.log('Installed project hooks from .githooks/');
