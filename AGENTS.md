# Agent Guidelines

## Working Principles

- Inspect the repository structure, scripts, and nearby code before editing. Follow existing conventions rather than introducing new patterns.
- Make the smallest complete change that solves the task. Keep code readable, maintainable, and appropriately defensive; avoid speculative features and abstractions.
- Respect module boundaries and existing public APIs. Do not refactor unrelated code or add dependencies/tools without a clear need.
- Do not generate tests or database migrations unless explicitly requested. If a migration is needed, report it for manual creation.
- Never hand-edit generated code. Use the repository's generation scripts when source changes require updated artifacts.

## Stack-Specific Rules (Only When Applicable)

- **NestJS:** Follow existing module structure and CQRS conventions. Use queries for reads, commands for mutations, and events only for useful decoupling. Access another module's data through its public operations, not its repositories. Keep reusable types in the designated interfaces folder.
- **Angular:** Follow existing domain/feature structure and import aliases. Use public barrel exports across feature/category boundaries and relative imports within a category. Keep presentational UI separate from state/data access. Reuse the project's UI library and data-access patterns; prefer lightweight reads over unnecessary state management.
- **OpenAPI:** Regenerate client contracts with the existing script (e.g., `pnpm generate:api`) when API changes require it; never edit generated types manually.
- **Nx/pnpm:** Run commands from the workspace root, target only relevant projects, limit task parallelism to 1, and keep caching enabled.
- **Docker:** Reuse running containers when useful. Do not start, restart, or rebuild containers solely for verification or contract generation. Rebuild only if runtime changes actually require it.

## Verification & Delivery

- Review the final diff and run `git diff --check` when Git is available.
- Run the cheapest meaningful verification for changed code (targeted lint, typecheck, or equivalent). Escalate to affected builds only when necessary; avoid workspace-wide checks, tests, watch processes, and tool installation by default.
- Fix errors introduced by the change, not unrelated issues. Do not repeatedly rerun a failing command without changing the cause.
- Finish with a concise summary of changes, checks that actually ran, results, and anything unverified. Never claim a skipped check passed.
