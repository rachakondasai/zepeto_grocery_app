#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/add-user-impl.sh" "$ROOT"
"$DIR/add-cart-impl.sh" "$ROOT"
"$DIR/add-order-impl.sh" "$ROOT"
"$DIR/add-admin-impl.sh" "$ROOT"
"$DIR/add-search-impl.sh" "$ROOT"
"$DIR/add-store-impl.sh" "$ROOT"
"$DIR/../scripts_macos_safe/update-gateway-routes.sh" "$ROOT" 2>/dev/null || true
"$DIR/update-gateway-routes.sh" "$ROOT" 2>/dev/null || true
echo "✅ All remaining services implemented."
