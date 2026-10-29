# Repository guidelines

## Project structure

Place code and assets in these directories.

- `apps/api/src` contains the NestJS API. Organize domain modules under `apps/api/src/modules/`. Keep CQRS commands, queries, handlers, controllers, DTOs, and entities in their domain modules. Put database migrations and seeds in `apps/api/src/modules/database/`.
- `apps/web/src/app` contains the Angular frontend. Organize each domain module into `data-access`, `features`, `interfaces`, and `ui`. Put code shared across domains in `apps/web/src/app/core/` and `apps/web/src/app/shared/`. Put static assets in `apps/web/public/`.
- `libs/api-contracts` contains the OpenAPI document and generated TypeScript contracts. Import shared types through `@nx-stack/api-contracts`.
- `tools/` contains API generation scripts.

Build output goes to `dist/apps/`.

## Development commands

Use Node.js 24.x and pnpm 12.11.2. Run these commands from the repository root.

- Run `pnpm install --frozen-lockfile` to install locked dependencies.
- Run `pnpm dev` to serve both apps. To serve one app, run `pnpm dev:api` or `pnpm dev:web`.
- Run `pnpm build` to build both apps.
- Run `pnpm lint` to check lint rules.
- Run `pnpm typecheck` to check TypeScript compatibility.
- After API changes, run `pnpm generate:api` to regenerate the OpenAPI document and shared types offline. Commit both generated outputs. Regenerate these files rather than edit them by hand.
- Run `pnpm db:up` to apply migrations.
- Run `pnpm db:seed` to reset development seed accounts.

For Docker setup and required services, follow [README.md](README.md).

## Code style and naming

Use TypeScript with two-space indentation, single quotes, semicolons, a 120-character line width, and no trailing commas.
Format changed files with `pnpm exec prettier --write <paths>`.

Use kebab-case filenames, PascalCase classes, and camelCase members. Follow existing Angular names such as `users-list.ts` and NestJS suffixes such as `.controller.ts` and `.handler.ts`. ESLint enforces TypeScript rules and Angular template accessibility.

For frontend implementation, use the `angular-developer` skill.

## Commits and pull requests

Use Conventional Commits, such as `feat:`, `fix(users):`, `docs:`, or `chore:`. Commitlint enforces this format.
The pre-commit hook runs lint. CI runs lint and build.

In each PR, explain the behavior change, link related issues, and list the checks you ran. Include screenshots for visible UI changes. Describe any migration or configuration changes.

## Read task-specific instructions

Read the relevant document before you start the task.

- Before issue operations, read [Issue tracker](docs/agents/issue-tracker.md). Issues and specs live in GitHub Issues for `musanzi/nx-stack`.
- Before you triage issues, read [Triage labels](docs/agents/triage-labels.md). Use the five default labels defined there.
- Before you explore the codebase, read [Domain docs](docs/agents/domain.md). Use one shared domain context, with `GLOSSARY.md` at the repository root and architectural decision records in `docs/adr/`.
