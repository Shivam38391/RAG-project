install:
	cd apps/api && uv sync
	cd apps/web && npm install

backend:
	cd apps/api && uv run python main.py

frontend:
	cd apps/web && npm run dev

run:
	make -j2 backend frontend

format:
	cd apps/api && ruff format .
	cd apps/web && npm run lint

clean:
	rm -rf data/chroma