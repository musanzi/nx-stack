# Workspace

Use pnpm and Nx from the workspace root. Keep application code in apps/api and apps/web, and generated OpenAPI types in libs/api-contracts.

Follow the scoped AGENTS.md in each application. Do not generate tests or database migrations. Never edit generated contracts manually; use pnpm generate:api.
