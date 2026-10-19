# Workspace

This Nx monorepo contains a NestJS API and an Angular web application. Application code lives in `apps/api` and `apps/web`. Generated OpenAPI types live in `libs/api-contracts` and connect the API to the web application.

## Shared Rules

- Use pnpm and Nx from the workspace root.
- Do not generate tests or database migrations.
- Follow the existing project structure, naming conventions, formatting, spacing, and code quality standards.
- Keep implementations simple and practical. Avoid unnecessary abstractions and overengineering, and handle edge cases reasonably expected in actual application usage.
- Apply the project-specific instructions below only within their respective paths.

## API — `apps/api`

The NestJS backend owns API endpoints, business logic, and data access.

### Module Design

Act as a senior NestJS engineer and follow the existing CQRS implementation patterns when creating features:

- Use queries for read operations whenever appropriate.
- Use commands for write or state-changing operations.
- Use events when they provide a clear benefit, such as reacting to completed actions or decoupling side effects.
- Do not access another module's repository directly. Create a query or command in the module that owns the repository, then use it from the module that requires the data or operation.

### Folder Structure

- `queries`: Queries, organized into `handlers` and `impl` subfolders.
- `commands`: Commands, organized into `handlers` and `impl` subfolders.
- `controllers`: Controllers.
- `interfaces`: Shared types and interfaces. Do not define types directly in controllers, queries, commands, handlers, or events.
- `helpers`: Reusable helpers used across the module.
- `dto`: DTOs.
- `entities`: Entities.

## Web — `apps/web`

The Angular frontend provides the user interface and consumes the API through generated contracts.

### Feature Design

Act as a senior Angular engineer and use Angular Material when creating UI elements.

### Folder Structure

- `data-access`: NgRx Signal Store for `POST`, `PATCH`, and `PUT` requests. Use `httpResource` for `GET` requests where there is no local state management.
- `features`: Different feature displays.
- `interfaces`: Types and interfaces prefixed with `I`, for example `ISignInPayload`. Do not define types directly in components or services. Use barrel exports.
- `ui`: Visual elements with no direct interaction with the store. Avoid gradient colors or backgrounds, and prefer `rounded-md` for cards.

## API Contracts — `libs/api-contracts`

This shared library provides generated OpenAPI types for API consumers.

- Never edit generated contracts manually; use `pnpm generate:api` from the workspace root.
