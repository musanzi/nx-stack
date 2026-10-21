# Agent Guidelines

## Working Principles

- Inspect the repository structure, scripts, and nearby code before editing. Follow existing conventions rather than introducing new patterns.
- Make the smallest complete change that solves the task. Keep code readable, maintainable, and appropriately defensive; avoid speculative features and abstractions.
- Respect module boundaries and existing public APIs. Do not refactor unrelated code or add dependencies/tools without a clear need.
- Do not generate tests or database migrations unless explicitly requested. If a migration is needed, report it for manual creation.

## Stack-Specific Rules (Only When Applicable)

- **NestJS:** Follow existing module structure and CQRS conventions. Use queries for reads, commands for mutations, and events only for useful decoupling. Access another module's data through its public operations, not its repositories. Keep reusable types in the designated interfaces folder.
- **Angular:** Follow existing domain/feature structure and import aliases. Use public barrel exports across feature/category boundaries and relative imports within a category. Keep presentational UI separate from state/data access. Reuse the project's UI library and data-access patterns; prefer lightweight reads over unnecessary state management.
- **OpenAPI:** Regenerate client contracts with the existing script (e.g., `pnpm generate:api`) when API changes require it; never edit generated types manually.
