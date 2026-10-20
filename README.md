# nx-stack

nx-stack combines a NestJS API and an Angular SSR frontend in a pnpm and Nx monorepo, providing authentication, profile management, and administration for users, roles, and statistics, with generated OpenAPI types keeping the frontend and API in sync.

## Projects

| Path                 | Purpose                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| `apps/api`           | NestJS backend with CQRS, TypeORM/PostgreSQL, Redis, and Swagger/Scalar. |
| `apps/web`           | Angular frontend with Material, Tailwind CSS, and NgRx Signal Store.     |
| `libs/api-contracts` | Generated OpenAPI types exported through `@nx-stack/api-contracts`.      |

See [AGENTS.md](AGENTS.md) for coding conventions and project boundaries.

## Setup

Requires Node.js 24, pnpm 12.11.2, PostgreSQL 18, and Redis 8. Run commands from the workspace root.

```sh
pnpm install --frozen-lockfile
cp -n .env.example .env
```

Configure database, Redis, session, JWT, SMTP, and Google OAuth values in `.env`. For host development, use `DB_HOST=localhost`, `DB_PORT=5432`, `REDIS_URL=redis://localhost:6379`, and `FRONTEND_URI=http://localhost:4200`. Start PostgreSQL and Redis, then run `pnpm dev`.

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

Import `components`, `operations`, and `paths` from `@nx-stack/api-contracts`. Commit generated changes; never edit them manually. Builds use committed contracts without requiring a running API.

## Configuration and Docker

The web API URL is set at build time in `apps/web/src/environments`: development uses `http://localhost:8000`, production uses `https://api.nx-stack.com`. Update it before deploying.

Compose runs both applications, PostgreSQL, and Redis. Development Compose also runs MailHog for local email testing:

```sh
docker compose -f compose.dev.yml -p nx-stack up --build --watch
docker compose -f compose.prod.yml -p nx-stack up --build
```

Containers use `DB_HOST=db` and `REDIS_URL=redis://redis:6379`; browsers need a publicly reachable API URL. Both Compose configurations expose web on port 4200 and API on port 8000.

### Local email testing

Development Compose routes API email to MailHog at `mailhog:1025` without SMTP authentication. Open http://localhost:8025 to inspect welcome and password reset emails. Messages are stored in memory and cleared when MailHog restarts.

For production, configure your SMTP provider's host, port, credentials, and sender in `.env`. `MAIL_FROM` sets the sender; when omitted, it falls back to `MAIL_USERNAME`.

## License

By [Wilfried Musanzi](https://musanzi.me) is licensed under the MIT license.
