#!/usr/bin/env sh
set -e

ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SEED=false
for arg in "$@"; do
  case "$arg" in
    --seed) SEED=true ;;
  esac
done

if [ ! -f .env ]; then
  cp .env.example .env
  echo 'Создан .env из .env.example'
fi

docker compose up -d --build

if [ "$SEED" = true ]; then
  echo 'Запуск сидирования (--seed)...'
  docker compose --profile seed run --rm seed
fi

echo 'Готово.'
echo '  Front: http://localhost:3001'
echo '  API:   http://localhost:3000'
