#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
cat > "$ROOT/vercel.json" <<'EOF'
{
  "version": 2,
  "builds": [
    { "src": "frontend/package.json", "use": "@vercel/next" },
    { "src": "backend/Dockerfile.allinone", "use": "@vercel/docker" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
EOF
echo "✅ Vercel config switched to all-in-one backend."
