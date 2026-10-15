#!/usr/bin/env bash
set -euo pipefail

REPOSITORY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8000}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: Python 3 is required to run the local development server." >&2
  exit 1
fi

cd "$REPOSITORY_ROOT"
echo "Human Bridge is available at http://localhost:${PORT}"
exec python3 -m http.server "$PORT"
