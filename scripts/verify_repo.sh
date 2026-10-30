#!/usr/bin/env bash
# Single verification contract shared by humans, coding agents and CI.
# Usage: ./scripts/verify_repo.sh   (from the repository root)
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -d backend/node_modules ]; then
  echo "[setup] Installing dependencies (npm ci in backend/)"
  npm ci --prefix backend --no-audit --no-fund
fi

echo "[1/4] Tests"
npm test --silent

echo "[2/4] Lint"
npm run lint --silent

echo "[3/4] Repository contract"
node scripts/check_repo_contract.js

echo "[4/4] Security check"
node scripts/check_secrets.js

echo "VERIFY_REPO: PASS"
