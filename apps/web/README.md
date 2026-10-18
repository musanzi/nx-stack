# Web

Angular 22.1 SSR application with Angular Material, Tailwind CSS, NgRx Signal Store, and strict TypeScript/template checking.

Run all commands from the [workspace root](../../README.md). Use `pnpm dev:web`, `pnpm exec nx build web`, or `pnpm exec nx lint web`. Production bundles are written to `dist/apps/web`.

## Features

- Server-rendered public landing page
- Sign-in, sign-up, password recovery, cookie sessions, and guarded navigation
- User profile and password management
- Administrator statistics, users, roles, and CSV export
- Lazy-loaded website, authentication, user, and administrator routes

## Organization

`src/app/core` contains app-wide infrastructure; `domains` contains routed areas and feature modules; `shared` contains reusable presentation components and local interfaces. Each feature retains its `data-access`, `features`, `interfaces`, and `ui` boundaries as described in [AGENTS.md](AGENTS.md).

Use `@/` for application source imports and `@starter/api-contracts` for generated OpenAPI types. The contracts library exports standard `components`, `operations`, and `paths`; consumers use indexed access directly. Generate contracts explicitly with `pnpm generate:api` or generate and build with `pnpm sync:api`. See the [workspace API contract workflow](../../README.md#openapi-contracts).

The existing interceptor prefixes relative requests with the environment API URL, enables cookie credentials, unwraps JSON success envelopes, and decodes error envelopes for blob downloads. Stateful requests use Angular HTTP and Signal Stores; stateless GET screens use `httpResource`.

Development and production environment URLs remain in `src/environments`. Public routes use SSR; authentication, user, and admin routes use client rendering with hydration enabled globally.

This application derives from the Angular admin template by Sercan Yemen (`https://themeforest.net/user/srcn`). Its original [ThemeForest license](https://themeforest.net/licenses/standard) continues to apply.
