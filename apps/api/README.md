# API

NestJS 12 API using CQRS, TypeORM/PostgreSQL, Redis-backed sessions and caching, Passport authentication, Swagger/Scalar documentation, and Pino logging. Original author: Wilfried M; original package license: MIT.

Run commands from the [workspace root](../../README.md):

```sh
pnpm dev:api
pnpm exec nx build api
pnpm exec nx lint api
pnpm start:api
```

Commands run with `apps/api` as the working directory. Configure `.env` here from `.env.example`; uploaded files remain under `uploads`. Compiled output is `dist/apps/api/src`, relative to the workspace root. The Nest CLI retains its Swagger compiler plugin and decorator metadata.

## Modules

- `auth`: local and Google authentication, sessions, profiles, and password recovery
- `users`: management, roles, avatar uploads, CSV import and export
- `roles`: role management and pagination
- `stats`: administrator statistics
- `health`: database and disk health
- `database`: entities, subscribers, existing migrations, and development seeds

Follow the existing query/command/event structure and repository boundaries in [AGENTS.md](AGENTS.md).

## HTTP and contracts

The API defaults to port 8000. `/docs` serves Scalar and `/openapi.json` serves OpenAPI 3.1 from the existing Swagger metadata. JSON success responses use `{ success: true, statusCode, data }`; empty values become `data: null`. Errors use `{ success: false, statusCode, message, error }`. Binary downloads and responses handled directly by controllers keep their existing behavior.

User and role lists return `{ success: true, statusCode: 200, data: [items, total] }`. Their OpenAPI schemas use fixed `prefixItems` tuples. User pagination defaults to page 1 and 20 items. Role lists without query parameters return all roles; with query parameters they default to page 1 and 20 items. See controller descriptions for filter and pagination details.

After API changes, run `pnpm sync:api` with the API running. This regenerates the workspace contract library using openapi-typescript and builds its web consumers. API and web do not import backend DTO classes across application boundaries.

## Database and Docker

Use the root `pnpm db:up`, `pnpm db:down`, `pnpm db:seed`, and `name=example pnpm db:migrate` commands. These build first and load the compiled TypeORM configuration. Seeds reset the predefined development accounts. No migration or seed runs automatically.

Unified Docker development and production workflows, environment setup, and existing volume mappings are documented in the [workspace README](../../README.md#docker).
