# Issue tracker: GitHub

Issues and specs live in GitHub Issues for `musanzi/nx-stack`.
Use the `gh` CLI from this repository.

## Target repository

Before the first issue creation in a session, verify the target:

```sh
gh repo view --json nameWithOwner
```

The expected repository is `musanzi/nx-stack`.
If the target differs, confirm it with the user before creating issues.
File issues in the user's repository, never in the skills' source repository.

## Issue operations

- Create an issue with `gh issue create --title "..." --body-file <path>`.
  For multiline bodies, write the exact text to a temporary file first.
- Read an issue with `gh issue view <number> --json number,title,body,labels,comments`.
- List issues with `gh issue list --state open --json number,title,body,labels,comments`.
  Add label and state filters as needed.
- Comment with `gh issue comment <number> --body-file <path>`.
- Apply a label with `gh issue edit <number> --add-label "<label>"`.
- Remove a label with `gh issue edit <number> --remove-label "<label>"`.
- To close an issue, post the explanation as a comment, then run `gh issue close <number>`.
  Post comments separately even when an issue is already closed.

When a skill says "publish to the issue tracker", create a GitHub issue.
When it says "fetch the relevant ticket", read the GitHub issue.

## Parent issues and blockers

Use GitHub's native sub-issues and issue dependencies when available.
Check the installed CLI's help for supported flags.

To link a sub-issue through the API:

```sh
gh api --method POST repos/musanzi/nx-stack/issues/<parent>/sub_issues -F sub_issue_id=<child-database-id>
```

To add a blocker through the API:

```sh
gh api --method POST repos/musanzi/nx-stack/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-database-id>
```

Retrieve an issue's database ID with:

```sh
gh api repos/musanzi/nx-stack/issues/<number> --jq .id
```

Database IDs differ from issue numbers and node IDs.

If native relationships are unavailable, put `Part of #<parent>` and
`Blocked by: #<number>, #<number>` at the top of the child issue body.
Also list fallback child issues in the parent's task list.
A ticket is unblocked when every blocker is closed.

## Pull requests as a triage surface

PRs as a request surface: no.

If enabled later, triage external PRs with the same labels and states.
Use `gh pr view`, `gh pr diff`, `gh pr comment`, `gh pr edit`, and `gh pr close`.
Read the PR body and comments separately.

GitHub shares issue and PR numbers. Resolve ambiguous references with
`gh pr view <number>`, then fall back to `gh issue view <number>`.

## Wayfinding operations

- Create one map issue labelled `wayfinder:map`.
  Its body holds Notes, Decisions-so-far, and Fog.
- Link child tickets as sub-issues, or use the parent fallback above.
- Label children `wayfinder:<type>`, where the type is `research`, `prototype`, `grilling`, or `task`.
- Select the first open child in map order with no open blockers and no assignee.
- Claim it with `gh issue edit <number> --add-assignee @me`.
- Resolve it with an answer comment, close it, then add the finding and ticket link to the map's Decisions-so-far.
