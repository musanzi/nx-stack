# API unit testing

## Run the suite

Use Node.js 24.x and pnpm 12.11.2. Run commands from the repository root.

1. Install dependencies with `pnpm install --frozen-lockfile`.
2. Run `pnpm test:api` for a single test run.
3. Run `pnpm typecheck:api:tests` to check specs, fixtures, and runner configuration.

Use `pnpm test:api:watch` while editing. Press `q` to exit watch mode.
To run a focused subset, pass a path filter with `pnpm test:api --args=validate-credentials`.

`pnpm test` also runs the API unit suite. `pnpm typecheck` includes the spec type check.
CI runs lint, type checks, unit tests, and builds. Tests require no environment file or running services.

## Add a relevant test

Put `*.spec.ts` files beside the behavior under test and import Vitest functions explicitly.
Use a Nest testing module for dependency-injected providers. Invoke exported helpers directly.
The credential validation spec demonstrates provider resolution, while the pagination spec demonstrates a pure-helper test.

Assert observable outcomes through public interfaces. Cover successful results, rejected operations, exceptions, and consequential side effects.
Check that forbidden effects do not occur after failure, such as account writes, event publication, or incorrect file deletion.
Use deterministic fixtures and control time or randomness when behavior depends on them.

Replace repositories, mail, filesystem operations, token services, and CQRS buses at the subject's dependency boundaries.
Keep the actual business decisions, CSV parsing, mappings, and email generation under test.
Use real in-memory streams to check CSV output without starting an HTTP server.
Keep fixtures local until several specs need the same data. Shared fixtures live in the API's testing directory and are excluded from production builds.

Skip construction-only tests, straightforward forwarding, and assertions on private methods or incidental call order.
A clear bug receives a regression test and a fix. Raise ambiguous product behavior for a decision before changing it.
No numeric coverage threshold applies to the initial suite.

## Understand the runner

The API has its own Vitest configuration and Nx test target. Vite Oxc preserves legacy decorators and constructor metadata.
The setup imports `reflect-metadata` before providers load and suppresses expected error and warning logs during tests.
API import aliases resolve through TypeScript configuration.

The spec TypeScript configuration includes specs and test support. The production configuration excludes them.
Mock call history and spies reset between tests, and stubbed environment variables are restored.
No extra transformer is needed with the current locked Vitest and Vite versions.

## Know the boundaries

The suite covers authentication and permission decisions, password workflows, user creation and updates, avatar cleanup, CSV operations, email content and handlers, response handling, and meaningful role, user-query, and statistics behavior.
Session serialization tests exercise callbacks directly without establishing a Passport session.

Mocked tests establish application decisions around infrastructure. They do not establish SQL correctness, locking, database transaction guarantees, actual subscriber invocation, HTTP routing and validation, full CQRS wiring, Passport sessions, or delivery to external services.
Framework registration, simple forwarding handlers, DTO decorators, and Multer disk-storage plumbing need integration coverage when those guarantees are required.

The [feature spec](specs/api-unit-tests.md) records the agreed scope and exclusions.
