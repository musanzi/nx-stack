# Add relevant API unit tests with Nest testing and Vitest

## Problem Statement

API developers cannot run automated unit tests to detect regressions in authentication, permissions, user workflows, or shared response handling.
Vitest is already declared in the workspace, but the API has no test runner configuration, test target, or existing specs.
The API also lacks `@nestjs/testing`. Its current TypeScript check excludes spec files, and CI runs only lint and build.

The team needs useful regression protection without creating tests for boilerplate or requiring a running development stack.

## Solution

Provide an isolated API unit test suite using Vitest and `@nestjs/testing`.
Cover meaningful behavior throughout the existing API, including successful outcomes, rejected operations, error handling, and consequential side effects.
Use the existing public methods of providers and pure helpers as the test boundaries.

Developers can run the suite once or in watch mode from the repository root.
CI runs the tests and checks their TypeScript types alongside the existing checks.
Document the working commands and criteria for deciding when a unit test adds value.

## User Stories

1. As an API developer, I want a working Vitest runner, so that I can execute API unit tests locally.
2. As an API developer, I want Nest testing modules for dependency-injected classes, so that tests resolve providers through Nest's dependency injection.
3. As an API developer, I want direct tests for pure helpers, so that testing simple behavior requires little setup.
4. As a contributor, I want tests to run without PostgreSQL or Redis, so that I can work without starting infrastructure.
5. As a contributor, I want tests to avoid external network services, so that service availability does not affect the suite.
6. As an API developer, I want a command that runs tests once and exits, so that I can verify changes before submitting them.
7. As an API developer, I want a watch command, so that relevant tests rerun while I edit code.
8. As an API developer, I want to run a focused subset of tests, so that I can investigate a particular behavior.
9. As a maintainer, I want an Nx test target, so that testing fits the existing workspace commands.
10. As a reviewer, I want CI to fail when an API unit test fails, so that regressions receive attention before changes merge.
11. As a reviewer, I want CI to check test-file types, so that invalid mocks and fixtures cannot pass through transpilation alone.
12. As a maintainer, I want specs to follow existing lint and formatting rules, so that test code remains maintainable.
13. As a contributor, I want documented setup and commands, so that I can run and extend the suite.
14. As a maintainer, I want tests selected by meaningful behavior, so that suite size reflects regression protection.
15. As a maintainer, I want assertions on observable outcomes, so that internal refactors do not require unnecessary test rewrites.
16. As an API developer, I want deterministic fixtures and dependency replacements, so that test failures are reproducible.
17. As an API developer, I want tests for credential acceptance and rejection, so that authentication changes preserve access rules.
18. As an API developer, I want tests for password workflows and their failures, so that password changes and resets follow intended behavior.
19. As an API developer, I want tests for public and protected access, so that authentication guards preserve route access decisions.
20. As an API developer, I want tests for missing users, required roles, and administrator access, so that authorization decisions remain correct.
21. As an API developer, I want tests for user creation, default roles, and password selection, so that account creation preserves its rules.
22. As an API developer, I want tests for the create and update branches of user lookup workflows, so that existing user data is preserved appropriately.
23. As an API developer, I want tests for avatar upload preconditions, so that invalid uploads fail before consequential work occurs.
24. As an API developer, I want tests for avatar transaction outcomes and cleanup, so that failures do not delete the wrong files or retain unwanted files.
25. As an API developer, I want tests for avatar path checks, so that cleanup respects the allowed storage location.
26. As an API developer, I want tests for CSV parsing and normalization, so that accepted input produces the intended user data.
27. As an API developer, I want tests for malformed CSV and import failures, so that invalid input and failed imports follow intended error behavior.
28. As an API developer, I want tests for meaningful CSV export behavior, so that exported content preserves required values and formatting.
29. As an API developer, I want tests for pagination defaults and invalid parameters, so that result limits follow the API's rules.
30. As an API developer, I want tests for email escaping and conditional content, so that generated messages preserve intended content.
31. As an API developer, I want tests for mail event handlers and failures, so that application behavior around message delivery remains predictable.
32. As an API developer, I want tests for password hashing decisions, so that insert and update behavior handles passwords appropriately.
33. As an API developer, I want tests for response envelopes and special response cases, so that response handling preserves intended output.
34. As an API developer, I want tests for expected and unexpected exceptions, so that the exception filter produces the intended response.
35. As an API developer, I want tests for responses whose headers have already been sent, so that response processing avoids duplicate writes.
36. As a reviewer, I want failure-path tests to assert that prohibited side effects do not occur, so that rejected operations cannot silently perform work.
37. As a maintainer, I want clear bugs found by tests to receive regression tests and fixes, so that the same defects do not return.
38. As a product owner, I want ambiguous behavior raised for a decision, so that tests do not silently establish unintended product rules.
39. As a maintainer, I want the initial suite to have no numeric coverage threshold, so that test selection follows behavior before coverage percentages.
40. As a contributor, I want the limits of mocked tests documented, so that I understand which guarantees require integration tests.

## Implementation Decisions

- Use Vitest, which the workspace already declares, and add `@nestjs/testing` compatible with the resolved Nest packages.
- Keep unit tests independent of databases, Redis, HTTP servers, external services, and private environment configuration.
- Use Nest testing modules for dependency-injected classes, with explicit replacements for dependencies outside the behavior under test.
- Exercise pure helpers directly. Keep real business rules, parsing, mapping, and transformations within the subject under test.
- Reuse existing public methods on providers and helpers. No new production abstraction or test-only endpoint is required by this design.
- Add an API Nx test target and root commands for a single run, watch mode, and focused test execution.
- Provide a TypeScript configuration and check that include specs. The production build continues to exclude test code.
- Include API unit tests and test-file type checks in CI as required checks alongside lint and build.
- Document the verified runner setup, commands, and test selection policy in the repository documentation.
- Test the existing API contracts and behavior. No database migration, schema change, or API contract change is required to introduce the suite.
- Fix clear bugs discovered during implementation with a regression test. Obtain a product decision before changing ambiguous behavior.
- Carry forward the draft's proposed implementation defaults: colocated `*.spec.ts` files, explicit Vitest imports, and small typed local fixtures.
- Configure legacy decorators, constructor metadata, `reflect-metadata`, and API import aliases. Verify actual Nest provider resolution before expanding the suite.
- Prefer native Vite Oxc decorator support if it works with the installed toolchain. A different transformer is a fallback requiring runtime verification.
- Use the repository's required Node.js and pnpm versions. Keep dependency changes and the lockfile consistent.

## Testing Decisions

- A good test protects externally observable behavior: returned values, exceptions, emitted events, required dependency interactions, and consequential side effects.
- Tests also verify the absence of prohibited effects after rejection or failure, such as database writes, event publication, or incorrect file deletion.
- Avoid assertions on private methods, incidental internal call order, or framework implementation details.
- Do not add tests that only assert construction or repeat straightforward CQRS forwarding.
- Use the highest existing boundary compatible with isolated unit testing. For a workflow, invoke the handler's public operation and assert its outcome.
- Use public guard, filter, interceptor, subscriber, and event-handler methods for their respective behavior. Test pure transformations through their exported functions.
- Mock infrastructure and external dependencies at the subject's existing dependency boundaries. Avoid mocking the logic the test is meant to verify.
- Start with successful outcomes, rejected inputs, and important failure paths. Add boundary cases where application behavior changes.
- Cover authentication and password workflows, authentication and role guards, and user workflows containing business decisions.
- Cover avatar transaction and cleanup behavior without accessing a real database or filesystem.
- Cover meaningful CSV import and export behavior, pagination parsing, and email content generation.
- Cover password hashing decisions in subscribers and application behavior in mail event handlers.
- Cover response envelopes and exception handling, including null values, special response statuses, file responses, and headers already sent where applicable.
- Review remaining API handlers for meaningful rules and transformations. Include relevant behavior beyond the named initial candidates.
- Keep fixtures deterministic and isolate mock state between tests. Control time or randomness when the outcome depends on them.
- Use a real Nest provider-resolution test to verify decorator metadata and dependency injection in the runner configuration.
- There are no existing API unit tests or runner configuration to copy. The current web spec configuration recognizes `*.spec.ts`, but provides no established API testing pattern.
- Establish the first working provider spec and pure-helper spec as examples for later contributors.
- Do not introduce an initial numeric coverage threshold. Coverage reporting is optional and does not replace behavior-based test selection.
- Completion requires passing API unit tests, test-file type checks, repository lint, application type checks, and both application builds.
- Verify documented local commands and focused test execution. The suite must work with infrastructure stopped.
- Where a clear bug fix affects application behavior, manually verify the affected flow as required by the repository guidelines.

## Out of Scope

- HTTP integration and end-to-end suites.
- Real database queries, database locking, or transaction guarantees established against a database.
- Verification that TypeORM invokes subscribers or that the complete CQRS application wiring dispatches messages correctly.
- Passport session integration, route decorator registration, and HTTP validation-pipeline integration.
- Real email delivery, filesystem integration, Redis integration, or external service contracts.
- Frontend unit tests.
- Exhaustive tests for every class, framework internals, boilerplate, or simple delegation.
- Initial numeric coverage targets or thresholds.
- Unrelated refactors, new production abstraction layers, deployment, or changes to secrets and development seed data.

## Further Notes

The interview explicitly settled relevance, isolation, API-wide scope, CI enforcement, the absence of an initial coverage threshold, and handling discovered bugs.
The isolation decision also established Nest provider tests and mocked dependency boundaries.
The final implementation defaults were proposed in the design draft. The implementation must verify them with a running test suite.

No domain glossary or ADR exists for this area. This spec introduces testing conventions and does not add new business terminology.

The current workspace declares Vitest 4.1.10. The lockfile resolves Vite 8.1.5 and Nest common and core 12.1.3.
These versions describe the investigated state. The implementation must check compatibility against the actual installed toolchain.
Dependencies were not resolvable during the initial investigation. Runner compatibility must be verified after installing the locked dependencies.

The intended issue triage label is `ready-for-agent`, as required by the invoked to-spec workflow.
Publication awaits project issue-tracker and triage setup. Run `/setup-matt-pocock-skills` to provide that configuration.

Primary references for implementation verification are the
[Nest testing documentation](https://docs.nestjs.com/fundamentals/testing),
[Nest Vitest configuration](https://github.com/nestjs/nest/blob/master/vitest.config.mts), and
[Vite Oxc configuration](https://vite.dev/config/shared-options.html#oxc).
