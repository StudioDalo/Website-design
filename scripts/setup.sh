#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export NEXT_TELEMETRY_DISABLED=1
node -e 'if (Number(process.versions.node.split(".")[0]) !== 24) { console.error("Use Node.js 24; see .nvmrc."); process.exit(1); }'
npm ci --cache "${STUDIO_DALO_NPM_CACHE:-/workspace/.npm-cache}" --no-audit --no-fund
npm run check
npm run build
