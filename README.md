# nx-stack

nx-stack is a full-stack starter for Angular and NestJS applications. It provides public pages, authentication, profile management, and an administration dashboard for users, roles, and statistics, with shared API types and Docker development and production environments.

## Stack and structure

This TypeScript monorepo uses pnpm and Nx to manage three projects:

| Path                 | Responsibility                                  | Main technologies                                                        |
| -------------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| `apps/api`           | Authentication, business logic, and data access | NestJS 12, CQRS, TypeORM, PostgreSQL 18, Redis 8                         |
| `apps/web`           | Public pages, accounts, and administration      | Angular 22 with SSR, Angular Material, Tailwind CSS 4, NgRx Signal Store |
| `libs/api-contracts` | Generated API types consumed by the web app     | OpenAPI, `openapi-typescript`                                            |

Authentication uses JWT, Redis-backed sessions, and Google sign-in. Email is sent through SMTP; Scalar serves the API documentation.

## Getting started

Use Docker with Compose for the full development environment. For host development, install Node.js 24.15+ and pnpm **12.11.2**, as pinned in `package.json`. Run commands from the repository root.

```sh
cp -n .env.example .env
```

Keep the example's database credentials. Set these values in `.env`; add `REDIS_URL`, which is absent from the example:

```dotenv
API_PORT=8000
WEB_PORT=4200
DB_HOST=db
REDIS_URL=redis://redis:6379
MAIL_HOST=mailhog
MAIL_PORT=1025
SESSION_SECRET=local-session-secret
SESSION_MAX_AGE=86400000
JWT_SECRET=local-jwt-secret
GOOGLE_CLIENT_ID=development-client
GOOGLE_SECRET=development-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/redirect
FRONTEND_URI=http://localhost:4200
```

Google sign-in requires real OAuth credentials; these placeholders allow local startup. Leave SMTP credentials empty for MailHog.

```sh
docker compose -f compose.dev.yml up -d --build
docker compose -f compose.dev.yml exec api pnpm db:up
docker compose -f compose.dev.yml exec api pnpm db:seed
docker compose -f compose.dev.yml watch
```

Open the [web app](http://localhost:4200), [API docs](http://localhost:8000/docs), or [MailHog inbox](http://localhost:8025). The API runs at `http://localhost:8000`; its schema is at `/openapi.json`.

The seed creates `admin@admin.com` / `admin1234` and `user@user.com` / `user1234`. Rerunning it resets those accounts' passwords and roles. Use it only with development data.

### Running on the host

Provide a local PostgreSQL database matching `DB_*`, Redis, and SMTP. Set `DB_HOST=localhost`, `REDIS_URL=redis://localhost:6379`, and your SMTP host and port in `.env`. The supplied Compose files do not publish PostgreSQL or Redis ports to the host.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm db:up
pnpm db:seed
pnpm dev
```

## Everyday commands

| Command                                           | Purpose                                         |
| ------------------------------------------------- | ----------------------------------------------- |
| `pnpm dev`                                        | Start both development servers                  |
| `pnpm dev:api` / `pnpm dev:web`                   | Start one development server                    |
| `pnpm build`                                      | Build both apps into `dist/apps`                |
| `pnpm lint`                                       | Lint both apps and type-check shared contracts  |
| `pnpm start:api` / `WEB_PORT=4200 pnpm start:web` | Run existing production builds                  |
| `pnpm db:up` / `pnpm db:down`                     | Apply migrations or revert the latest migration |
| `pnpm db:seed`                                    | Create or reset development accounts            |
| `pnpm generate:api`                               | Regenerate contracts from the API source        |
| `pnpm sync:api`                                   | Regenerate contracts and build the web app      |

`pnpm typecheck` checks both apps and shared contracts. In Docker, prefix pnpm commands with `docker compose -f compose.dev.yml exec api` or `exec web`. Database commands build the API first.

## Maintenance and deployment

- Follow [AGENTS.md](AGENTS.md). API modules use CQRS and expose their own queries and commands. Web code separates data access, features, interfaces, and presentational UI.
- After API changes, run `pnpm generate:api`. It builds the API, exports `libs/api-contracts/openapi.json` in Nest preview mode, and generates the shared types without a running API, database, Redis, or SMTP. Web build, serve, and typecheck run this pipeline automatically. `OPENAPI_INPUT` optionally selects another schema URL or local JSON/YAML file.
- Import types from `@nx-stack/api-contracts` and commit the OpenAPI document and generated types. Never edit generated files manually.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` before committing application changes. Git hooks run linting and enforce Conventional Commit messages; GitHub Actions checks lint and build.
- When adapting the starter, update branding and web API URLs in `apps/web/src/environments`. Production currently targets `https://api.nx-stack.com`. Configure real secrets, Google OAuth, SMTP, `MAIL_FROM`, and `FRONTEND_URI` before deployment; keep `.env` private.

```sh
docker compose -f compose.prod.yml up -d --build
```

Apply migrations separately during deployment. Back up PostgreSQL and uploaded files before releases. Compose persists database, Redis, and uploads in named volumes; `down` preserves them, while `down -v` deletes them.
