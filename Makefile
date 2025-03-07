dev:
	pnpm run dev

dev-search:
	pnpm run dev:search

build:
	pnpm run build

preview: build
	pnpm run preview

clean:
	pnpm run clean

format:
	pnpm run format

.PHONY: dev dev-search build preview clean format
