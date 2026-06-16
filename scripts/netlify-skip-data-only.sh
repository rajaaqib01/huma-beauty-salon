#!/usr/bin/env bash
# Netlify build ignore: exit 0 = skip build, exit 1 = run build.
# Skip when the push only changed JSON data files (bookings, messages, etc.).

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
    *) exit 1 ;;
  esac
done <<< "$changes"

exit 0
