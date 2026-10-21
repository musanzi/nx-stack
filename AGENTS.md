# Workspace

Nx monorepo: NestJS (`apps/api`), Angular (`apps/web`), and generated OpenAPI contracts (`libs/api-contracts`). Apply path-specific rules only to relevant files.

## General

- Use pnpm and Nx from the workspace root.
- Follow existing architecture, conventions, and formatting.
- Prefer simple, maintainable solutions; avoid overengineering and handle realistic edge cases.
- Do not generate tests or database migrations.
- Verify changes efficiently: review the diff, run `git diff --check`, then targeted lint/typecheck when relevant. Check only affected projects, limit parallelism to 1, and keep caching enabled. Avoid unnecessary builds, tests, watch processes, Docker, and tool installations. Fix only introduced errors; report verification results and skipped checks.

## API — `apps/api`

- Follow existing NestJS CQRS patterns: queries for reads, commands for mutations, events only when useful.
- Respect module boundaries: never access another module's repository directly; use its commands or queries.
- Follow the existing module structure:
  - `queries/{impl,handlers}` — read operations.
  - `commands/{impl,handlers}` — write operations.
  - `controllers`, `dto`, `entities`, `interfaces`, `helpers` — respective responsibilities.
- Keep shared types/interfaces in `interfaces`, not inline in controllers, handlers, commands, queries, or events.

## Web — `apps/web`

- Use Angular Material and existing Angular conventions.
- Organize modules under `domains/<domain>/modules/<module>/`:
  - `data-access`: NgRx Signal Store for mutations; `httpResource` for GET requests without local state.
  - `features`: feature-level views and orchestration.
  - `interfaces`: types/interfaces prefixed with `I`, never defined inline in components or services.
  - `ui`: presentational components without direct store access; avoid gradients and prefer `rounded-md` cards.
- Keep domain-wide shared code in `domains/<domain>/shared`, never inside individual modules.
- Use category barrel exports (`index.ts`) for cross-category imports:
  - `@web/domains/<domain>/shared/<category>`
  - `@web/domains/<domain>/modules/<module>/<category>`
  - `@web/shared/<category>`
- Use relative imports within the same category to avoid circular dependencies. Avoid deep imports into other categories. Preserve existing `@web/*`, `@web/core/*`, and `@web/environments/*` aliases.

## API Contracts — `libs/api-contracts`

- Never edit generated files manually.
- Regenerate contracts using `pnpm generate:api` from the workspace root when API changes require it.