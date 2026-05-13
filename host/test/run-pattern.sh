#!/usr/bin/env bash
# Utility: run a specific test file (or pattern) inside the test container.
# Resolves __tests__/**/<pattern>.test.js on the host, then hands the matches
# to `node --test` in the docker compose `test` service.
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <pattern> [extra node args...]" >&2
  echo "  matches __tests__/**/<pattern>.test.js" >&2
  exit 1
fi

pattern="$1"
shift

cd "$(dirname "$0")"

matches=()
# read loop instead of `mapfile` — macOS ships bash 3.2, which lacks mapfile
while IFS= read -r line; do
  matches+=("$line")
done < <(find __tests__ -type f -name "${pattern}.test.js")

if [[ ${#matches[@]} -eq 0 ]]; then
  echo "no tests matched: ${pattern}.test.js" >&2
  exit 1
fi

echo "running ${#matches[@]} test file(s):" >&2
printf '  %s\n' "${matches[@]}" >&2

docker compose run --rm \
  -v "$PWD/__tests__/lib:/test/__tests__/lib" \
  -v "$PWD/lib:/test/lib" \
  --entrypoint node test --test "$@" "${matches[@]}"
