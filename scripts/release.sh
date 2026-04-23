#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Run 'gh auth login' first."
  exit 1
fi

TAG="${1:-}"
TITLE="${2:-}"

if [ -z "$TAG" ]; then
  echo "Usage: scripts/release.sh <tag> [title]"
  exit 1
fi

if [ -z "$TITLE" ]; then
  TITLE="$TAG"
fi

gh release create "$TAG" \
  --title "$TITLE" \
  --generate-notes
