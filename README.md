# Starter

A pnpm and Nx monorepo with a NestJS API and an Angular SSR frontend.\
Includes authentication, profiles, and administration for users, roles, and statistics.\
Generated OpenAPI types keep the frontend aligned with the API.

## Projects

| Path                 | Purpose                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| `apps/api`           | NestJS backend with CQRS, TypeORM/PostgreSQL, Redis, and Swagger/Scalar. |
| `apps/web`           | Angular frontend with Material, Tailwind CSS, and NgRx Signal Store.     |
| `libs/api-contracts` | Generated OpenAPI types exported through `@starter/api-contracts`.       |

See [AGENTS.md](AGENTS.md) for coding conventions and project boundaries.

## Setup

Requires Node.js 24, pnpm 12.11.2, PostgreSQL 18, and Redis 8. Run commands from the workspace root.

```sh
corepack enable
corepack prepare pnpm@12.11.2 --activate
pnpm install --frozen-lockfile
cp -n apps/api/.env.example apps/api/.env
```

Configure database, Redis, session, JWT, SMTP, and Google OAuth values in `apps/api/.env`. For host development, use `DB_HOST=localhost`, `DB_PORT=5432`, `REDIS_URL=redis://localhost:6379`, and `FRONTEND_URI=http://localhost:4200`. Start PostgreSQL and Redis, then run `pnpm dev`.

Web: http://localhost:4200 · API: http://localhost:8000 · Docs: http://localhost:8000/docs

## Commands

| Command                                             | Purpose                                        |
| --------------------------------------------------- | ---------------------------------------------- |
| `pnpm dev`                                          | Start both development servers.                |
| `pnpm dev:api` / `pnpm dev:web`                     | Start one application.                         |
| `pnpm build`                                        | Build both applications into `dist/apps`.      |
| `pnpm exec nx build api` / `pnpm exec nx build web` | Build one application.                         |
| `pnpm lint`                                         | Lint applications and type-check contracts.    |
| `pnpm start:api` / `PORT=4200 pnpm start:web`       | Run existing production builds.                |
| `pnpm db:up` / `pnpm db:down`                       | Apply pending migrations or revert the latest. |
| `pnpm db:seed`                                      | Reset predefined development accounts.         |

Database commands build the API first; migrations and seeds never run automatically.

## API Contracts

With the API running, use `pnpm generate:api` to regenerate types or `pnpm sync:api` to regenerate and build the web app. The default source is http://localhost:8000/openapi.json; override it with `OPENAPI_INPUT` for another URL or a local JSON/YAML file.

Import `components`, `operations`, and `paths` from `@starter/api-contracts`. Commit generated changes; never edit them manually. Builds use committed contracts without requiring a running API.

## Configuration and Docker

The web API URL is set at build time in `apps/web/src/environments`: development uses `http://localhost:8000`, production uses `https://api.starter.com`. Update it before deploying.

Compose runs both applications, PostgreSQL, and Redis. Development Compose also runs MailHog for local email testing:

```sh
docker compose --env-file apps/api/.env -f compose.dev.yml up --build --watch
docker compose --env-file apps/api/.env -f compose.prod.yml up --build
```

Compose requires existing external volumes: `starter-api_postgres_data`, `starter-api_redis_data`, and `starter-api_uploads_data`. For a new installation, create them with `docker volume create <name>`. To reuse differently named volumes, set `POSTGRES_VOLUME_NAME`, `REDIS_VOLUME_NAME`, and `UPLOADS_VOLUME_NAME` in `apps/api/.env`.

Containers use `DB_HOST=db` and `REDIS_URL=redis://redis:6379`; browsers need a publicly reachable API URL. Both Compose configurations expose web on port 4200 and API on port 8000.

### Local email testing

Development Compose routes API email to MailHog at `mailhog:1025` without SMTP authentication. Open http://localhost:8025 to inspect welcome and password reset emails. Messages are stored in memory and cleared when MailHog restarts.

For an API running on the host, start MailHog separately:

```sh
docker compose --env-file apps/api/.env -f compose.dev.yml up -d mailhog
```

Set `MAIL_HOST=localhost`, `MAIL_PORT=1025`, `MAIL_USERNAME=`, `MAIL_PASSWORD=`, and `MAIL_FROM=Starter Support <support@starter.local>` in `apps/api/.env`, then restart the API. These are the defaults in `.env.example`. MailHog's SMTP and web ports are bound to localhost.

For production, configure your SMTP provider's host, port, credentials, and sender in `apps/api/.env`. `MAIL_FROM` sets the sender; when omitted, it falls back to `MAIL_USERNAME`.

## License

The web template by Sercan Yemen retains its [ThemeForest license](https://themeforest.net/licenses/standard); the API by Wilfried M retains its MIT license.
