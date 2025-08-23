#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
"$(dirname "$0")/add-basic-service.sh" admin-service 8086
