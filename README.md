# Starter

An integrated Nx workspace containing the Angular web application, NestJS API, and generated OpenAPI contracts. Dependencies and tooling are managed from this directory with one package manifest and pnpm lockfile.

```text
apps/
  api/                  NestJS API, CQRS modules, database configuration
  web/                  Angular SSR application, Material UI, Signal Stores
libs/
  api-contracts/        Generated OpenAPI types and their public barrel
tools/                 Explicit API contract generation
```

## Requirements and installation

Use Node.js 24 (24.16.0 is recorded in `.node-version` and `.nvmrc`) and pnpm 12.11.2. The workspace's `packageManager` field pins pnpm; Corepack can activate it:

```sh
corepack enable
corepack prepare pnpm@12.11.2 --activate
pnpm install --frozen-lockfile
```

Angular remains on 22.1 and NestJS on 12. Nx and its plugins use 23.3.0. Generated API contracts are committed, so installation and builds do not need a running API. Dependency installation requires registry access or an already populated pnpm store.

The original Angular template license continues to apply to `apps/web`; the imported API retains its original MIT license. This private workspace does not grant additional redistribution rights.

## Local development

Copy `apps/api/.env.example` to `apps/api/.env` if a local environment is not already present. Supply database, Redis, session, JWT, SMTP, and Google OAuth settings. For applications running directly on the host, use `DB_HOST=localhost`, `DB_PORT=5432`, and `REDIS_URL=redis://localhost:6379`. Set `FRONTEND_URI=http://localhost:4200` and use the appropriate Google callback URL.

Start PostgreSQL 18 and Redis 8 before starting the API. Run commands from the workspace root:

| Command                    | Purpose                                                                        |
| -------------------------- | ------------------------------------------------------------------------------ |
| `pnpm dev`                 | Run API and web development servers concurrently                               |
| `pnpm dev:api`             | Run NestJS with compilation and restart on changes                             |
| `pnpm dev:web`             | Run Angular with development environment replacements                          |
| `pnpm build`               | Build both applications for production                                         |
| `pnpm exec nx build api`   | Build only the API                                                             |
| `pnpm exec nx build web`   | Build only the web application                                                 |
| `pnpm lint`                | Check both applications and type-check generated contracts; no automatic fixes |
| `pnpm start:api`           | Run an existing API build                                                      |
| `PORT=4200 pnpm start:web` | Run an existing web SSR build                                                  |
| `pnpm exec nx graph`       | Inspect the workspace dependency graph                                         |

The web development server listens at http://localhost:4200. The API defaults to http://localhost:8000; documentation is at http://localhost:8000/docs and the OpenAPI document at http://localhost:8000/openapi.json.

Production outputs are `dist/apps/api/src/main.js` and `dist/apps/web/server/server.mjs`. API commands use `apps/api` as their working directory, so its `.env` and `uploads/` remain application-local. Database entities, subscribers, and migrations are resolved relative to their compiled modules.

The web API URL is a build-time setting:

| Configuration | File                                                   | URL                       |
| ------------- | ------------------------------------------------------ | ------------------------- |
| Development   | `apps/web/src/environments/environment.development.ts` | `http://localhost:8000`   |
| Production    | `apps/web/src/environments/environment.ts`             | `https://api.starter.com` |

Change the production URL before building for another deployment. Angular preserves the existing server-rendered public area and client-rendered authentication, user, and admin routes. Cookie authentication, HTTP response unwrapping, binary downloads, Material UI, Tailwind, and Signal Stores retain their existing behavior.

## OpenAPI contracts

NestJS Swagger metadata is the source of truth. With the API running, refresh the contracts explicitly:

```sh
pnpm generate:api
pnpm sync:api
```

`sync:api` generates contracts and builds the web application to catch incompatible API changes. You can select a different server or a local JSON/YAML document. Local paths are relative to the workspace root:

```sh
OPENAPI_INPUT=https://api.example.com/openapi.json pnpm generate:api
OPENAPI_INPUT=./openapi.json pnpm generate:api
OPENAPI_INPUT=./openapi.yaml pnpm generate:api
```

Generation uses openapi-typescript's Node API and replaces `libs/api-contracts/src/lib/schema.ts` only after complete successful generation. A download or schema failure leaves the current contracts intact. The generation target is never cached, and neither application build runs it automatically. Commit the generated file after changes; do not edit it manually.

Import the generated interfaces through `@starter/api-contracts`. Use indexed types directly:

```ts
import type { components, operations } from '@starter/api-contracts';

// Examples within interface declarations or existing HTTP call generics:
// components['schemas']['UserResponse']
// components['schemas']['CreateUserDto']
// operations['UsersController_findAll']['responses'][200]['content']['application/json']['data']
```

Dates remain JSON strings and enums remain unions. Pagination uses OpenAPI 3.1 `prefixItems`, producing `[items, total]` tuples without a custom generator plugin. The frontend interceptor unwraps successful JSON envelopes. Pagination consumers therefore index the generated operation response's `data`; other existing consumers use the generated component models. Empty results still resolve to `null`, and error envelopes remain available through `HttpErrorResponse.error`.

Application-owned UI, form, and state types remain in `interfaces` folders with `I` names and barrel exports. Generated `components`, `operations`, and `paths` keep the generator's standard names. There are no generated HTTP clients or compatibility model aliases. Angular HTTP, NgRx Signal Stores for mutations/stateful reads, and `httpResource` for stateless GET requests remain in use.

## Database commands

These commands build the API first and use its compiled TypeORM configuration. They run only when requested; builds and application startup do not run migrations or seeds.

```sh
pnpm db:up
pnpm db:down
pnpm db:seed
name=add_profile_field pnpm db:migrate
```

`db:migrate` generates a migration under `apps/api/src/modules/database/migrations`; `db:up` applies pending migrations, `db:down` reverts the latest migration, and `db:seed` executes the existing development seed script. Existing migration files were moved without changing their contents. Seeding resets the predefined development accounts, so use it intentionally.

## Docker

Both Compose files use the workspace root as build context and keep web and API in separate containers, alongside PostgreSQL and Redis. Keep the Docker daemon running. Commands use the application environment file for both interpolation and the API's runtime variables:

```sh
docker compose --env-file apps/api/.env -f compose.dev.yml config --quiet
docker compose --env-file apps/api/.env -f compose.dev.yml up --build --watch

docker compose --env-file apps/api/.env -f compose.prod.yml config --quiet
docker compose --env-file apps/api/.env -f compose.prod.yml up --build
```

Development watch synchronizes application source and generated contracts; manifest or lockfile changes rebuild the images. Restart/rebuild after changing configuration files. Development PostgreSQL and Redis bind to host loopback ports 5432 and 6379 so native development servers can use them. Production leaves these services private to the Compose network.

Containers receive `DB_HOST=db` and `REDIS_URL=redis://redis:6379`. Web browsers use the host/public API URL, not the Compose service name. If server-rendered pages start fetching API data, configure an API URL reachable from the web container; `localhost` inside that container refers to the web container itself. The current public SSR page does not require API data.

### Existing persistent storage

Volumes are external so changing the Compose project name cannot silently create an empty database. The defaults match the original documented `-p starter-api` deployment:

| Data       | Existing volume             | Override variable      |
| ---------- | --------------------------- | ---------------------- |
| PostgreSQL | `starter-api_postgres_data` | `POSTGRES_VOLUME_NAME` |
| Redis      | `starter-api_redis_data`    | `REDIS_VOLUME_NAME`    |
| Uploads    | `starter-api_uploads_data`  | `UPLOADS_VOLUME_NAME`  |

Before cutover, inspect `docker volume ls` and set the override variables in `apps/api/.env` if the previous deployment used different names. Stop the previous applications before starting replacements. The migration does not run migrations, move database data, or modify Docker volumes.

For a genuinely new installation, explicitly create empty volumes first:

```sh
docker volume create starter-api_postgres_data
docker volume create starter-api_redis_data
docker volume create starter-api_uploads_data
```

The production web image builds the production environment URL. Configure that URL for the deployment before building it. Both development and production expose web on port 4200 and API on port 8000.

## Tooling and repository

Build and lint results are cached locally under `.nx/cache`; the web project depends on the contracts library so contract changes invalidate its build. Serving, contract generation, and database operations are not cached. Nx Cloud is disabled. ESLint retains separate Angular and NestJS configurations, and each application retains its formatting configuration.

The root Husky pre-commit hook runs `pnpm lint`. Commit messages use the installed Commitlint CLI and Conventional Commits. No test suite, database migration, CI workflow, cloud cache, deployment, or remote publication was added by the repository migration.

This workspace starts with fresh Git history and no remote. The original web checkout, including its Git history, was archived at `/Users/Musanzi/Documents/projects/starter/web-backup-20261018T143440Z`. The original sibling API checkout was left intact.

### Migration verification

Verified the frozen installation, Nx discovery and the web-to-contracts dependency, both production builds, application linting, generated-type checking, deterministic generation from files and HTTP, failed-generation recovery, pagination tuples, nullable fields, date strings, the public SSR shell, static assets, and authentication/user/admin route shells. Initial contracts were obtained from the migrated API's compiled Swagger controller metadata without connecting to its database or Redis.

Docker Compose configuration validates. Docker image builds and database-backed authentication, CRUD, statistics, and CSV flows still require a running Docker daemon and configured API infrastructure; they were not exercised during migration. No database migration or seed was run.

The preserved dependency versions report peer metadata warnings for NgRx 21 against Angular 22, openapi-typescript's TypeScript 5 peer against the workspace's TypeScript 6, and the Nx prompt adapter's listr2 patch version. Generation, builds, and linting passed with the installed versions; these warnings were not suppressed.
