#!/usr/bin/env bash
# Netlify build ignore: exit 0 = skip build, exit 1 = run build.
# Skip when the push only changed runtime JSON data (bookings, messages, etc.).
# Production deploys should run only for real code changes on main.

set -euo pipefail

if [ -z "${COMMIT_REF:-}" ] || [ -z "${CACHED_COMMIT_REF:-}" ]; then
  exit 1
fi

changes="$(git diff --name-only "$CACHED_COMMIT_REF" "$COMMIT_REF" 2>/dev/null || true)"

if [ -z "$changes" ]; then
  exit 1
fi

while IFS= read -r file; do
  [ -z "$file" ] && continue
  case "$file" in
    data/*.json) ;;
    data/*) exit 1 ;;
    *) exit 1 ;;
  esac
done <<< "$changes"

echo "Skipping Netlify build: only data/*.json changed (bookings/messages/etc.)."
exit 0
