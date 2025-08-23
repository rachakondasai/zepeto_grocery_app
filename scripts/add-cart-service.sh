#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
"$(dirname "$0")/add-basic-service.sh" cart-service 8084
