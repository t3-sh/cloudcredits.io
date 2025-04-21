install:
	pnpm install

dev:
	pnpm run dev

dev-search: build
	pnpm run dev

build:
	pnpm run build:local

preview: build
	pnpm run preview

clean:
	pnpm run clean

format:
	pnpm run format

.PHONY: dev dev-search build preview clean format install
