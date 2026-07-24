install:
    cd apps/api && uv sync
    cd apps/web && npm install

run:
    concurrently \
      "cd apps/api && uv run python main.py" \
      "cd apps/web && npm run dev"

backend:
    cd apps/api && uv run python main.py

frontend:
    cd apps/web && npm run dev