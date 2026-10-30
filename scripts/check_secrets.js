#!/usr/bin/env node
// Fails if tracked files contain secret-looking values or .env files are tracked.
const { execSync } = require('child_process');
const fs = require('fs');

const files = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean);
const patterns = [
  /ghp_[A-Za-z0-9]{36}/, /github_pat_[A-Za-z0-9_]{50,}/, /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (RSA |EC )?PRIVATE KEY-----/, /sk-[A-Za-z0-9]{32,}/
];
const errors = [];
for (const f of files) {
  if (/(^|\/)\.env(\.|$)/.test(f)) errors.push(`Tracked env file: ${f}`);
  if (f.includes('node_modules/') || !fs.existsSync(f) || fs.statSync(f).size > 2_000_000) continue;
  const src = fs.readFileSync(f, 'utf8');
  for (const p of patterns) if (p.test(src)) errors.push(`Secret-like value in ${f} (${p})`);
}
if (errors.length) {
  console.log('SECURITY_CHECK: FAIL');
  errors.forEach(e => console.log(` - ${e}`));
  process.exit(1);
}
console.log('SECURITY_CHECK: PASS');
