#!/usr/bin/env node
// Deterministic repository-readiness contract. Exit code 1 on any violation.
// BASE_REF (default: main) is used to detect edits to protected paths on a branch.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const errors = [];

// 1. Required context files
const required = [
  'AGENTS.md', 'README.md', 'REQUIREMENTS.md', 'SPEC.md', 'ARCHITECTURE.md',
  'TASKS.md', 'docs/REPO_MAP.md', 'scripts/verify_repo.sh', 'results'
];
for (const p of required) {
  if (!fs.existsSync(path.join(root, p))) errors.push(`Missing required path: ${p}`);
}

// 2. AGENTS.md declares the standard verify command
const agents = fs.existsSync(path.join(root, 'AGENTS.md'))
  ? fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8') : '';
if (!agents.includes('./scripts/verify_repo.sh')) {
  errors.push('AGENTS.md must reference ./scripts/verify_repo.sh');
}

// 3. SPEC.md only references requirement IDs that exist in REQUIREMENTS.md
const read = f => (fs.existsSync(path.join(root, f)) ? fs.readFileSync(path.join(root, f), 'utf8') : '');
const reqIds = new Set(read('REQUIREMENTS.md').match(/\b(FR|AC|NFR)-\d+(\.\d+)?\b/g) || []);
for (const doc of ['SPEC.md', 'TASKS.md']) {
  for (const id of new Set(read(doc).match(/\b(FR|AC|NFR)-\d+(\.\d+)?\b/g) || [])) {
    if (!reqIds.has(id)) errors.push(`${doc} references unknown requirement ${id}`);
  }
}

// 4. Architecture boundary: services must be framework-free pure modules
const servicesDir = path.join(root, 'backend', 'services');
for (const f of fs.readdirSync(servicesDir).filter(f => f.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(servicesDir, f), 'utf8');
  for (const forbidden of ['express', 'http', 'fs', '../app', '../server']) {
    const re = new RegExp(`require\\(['"]${forbidden.replace(/[./]/g, '\\$&')}['"]\\)`);
    if (re.test(src)) errors.push(`backend/services/${f} must not require '${forbidden}' (ARCHITECTURE.md)`);
  }
}

// 5. Protected paths must not change on a branch relative to BASE_REF
const protectedPaths = ['backend/data/movies.json', 'REQUIREMENTS.md'];
const baseRef = process.env.BASE_REF || 'main';
try {
  execSync(`git rev-parse --verify --quiet ${baseRef}`, { cwd: root, stdio: 'ignore' });
  const changed = execSync(`git diff --name-only ${baseRef}`, { cwd: root, encoding: 'utf8' })
    .split('\n').filter(Boolean);
  for (const file of changed) {
    if (protectedPaths.some(p => file === p || file.startsWith(p))) {
      errors.push(`Protected path modified vs ${baseRef}: ${file} (requires human approval)`);
    }
  }
} catch {
  console.log(`[contract] BASE_REF '${baseRef}' not found; protected-path check skipped`);
}

if (errors.length) {
  console.log('REPO_CONTRACT: FAIL');
  errors.forEach(e => console.log(` - ${e}`));
  process.exit(1);
}
console.log('REPO_CONTRACT: PASS');
