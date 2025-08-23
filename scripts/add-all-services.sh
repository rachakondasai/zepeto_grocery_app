#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
DIR="$(cd "$(dirname "$0")" && pwd)"

chmod +x "$DIR"/*.sh || true

"$DIR/add-auth-service.sh" "$ROOT"
"$DIR/add-basic-service.sh" user-service 8082
"$DIR/add-basic-service.sh" product-service 8083
"$DIR/add-basic-service.sh" cart-service 8084
"$DIR/add-basic-service.sh" order-service 8085
"$DIR/add-basic-service.sh" admin-service 8086
"$DIR/add-basic-service.sh" search-service 8087
"$DIR/add-basic-service.sh" store-service 8088

"$DIR/update-gateway-routes.sh" "$ROOT"

echo "✅ All services generated."
