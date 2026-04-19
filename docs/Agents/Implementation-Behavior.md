# Implementation Behavior

## Doc Header

### Doc History
2. 2026-04-18 12:48:20: Added a docs-specific execution rule so implementation passes that touch docs cleanup consult `docs/Doc-Vision.md` to avoid drift between cleanup behavior and the Gen 4 docs contract.
1. 2026-04-12 10:09:21: Added the repo-wide implementation behavior guide covering file ownership, hook/effect boundaries, JSX extraction, migration retirement, behavior-first testing, and cleanup scope discipline

## Purpose

This file defines how Codex should behave during implementation, cleanup, and
refactor passes.

These rules apply to every implementation pass regardless of task size.

Use them as the default behavior guide when deciding whether to:
- split or keep a file
- extract or delete logic
- keep or retire compatibility seams
- add tests or tighten existing ones

These are default behavior rules, not a reason to create unrelated churn in
files that are outside the requested change.

## Main Rule

Prefer small honest ownership boundaries, behavior-focused tests, and deletion
of residue over speculative abstraction.

When docs cleanup tasks are the active work stream, use `docs/Doc-Vision.md`
as the source-of-truth contract for what Gen 4 cleanup should and should not
change, especially around where to implement versus where to document.

When scope is unclear, do less and make it correct rather than more and make it
approximate.

## File Discipline

- one clear responsibility per file
- if a file is hard to describe in one sentence, it likely owns too much
- prefer splitting by ownership boundary, not by line count
- delete dead code instead of commenting it out
- if possibly-needed logic is not part of the current pass, move that idea into
  a future phase doc rather than keeping dead paths alive in code
- cleanup and refactor passes should usually reduce total code volume
- if a cleanup pass adds more lines than it removes, the added structure should
  clearly improve ownership, readability, or correctness

## Hook And Effect Rules

- extract named hooks when a `useEffect` plus the nearby state/actions belong to
  one concern
- name hooks after what they do, not where they live
- each `useEffect` should have one job
- if a dependency array grows large, treat that as a smell and re-check whether
  one effect is carrying too many concerns
- persistence belongs to its owner
- shell components compose systems; they do not hydrate them

## Component Rules

- avoid inline business logic in JSX return blocks
- if a conditional or calculation takes more than a couple of lines, prefer
  extracting it above the return as a named variable or callback
- avoid prop drilling beyond two levels when a clearer ownership seam exists
- if data or actions travel through more than two component layers, re-check
  whether they belong in a store, context, or a closer owning hook/component

## Migration And Compatibility

- every compatibility shim should carry a comment naming its retirement
  condition
- if the retirement condition is already met, delete the migration in the same
  pass
- do not let migration logic become permanent architecture
- prefer transitional seams that are explicit, narrow, and easy to remove later

## Tests

- tests should cover behavior, not implementation details
- if a test breaks because an internal variable or helper name changed while the
  behavior stayed the same, it is probably testing the wrong thing
- if a test breaks because user-visible or contract-visible behavior changed, it
  is probably testing the right thing

## Cleanup Bias

- when a task includes cleanup or refactor work, leave files smaller or simpler
  than you found them
- prefer deleting over abstracting when facing residue, duplication, or dead
  paths
- remove already-retired branches in the same pass instead of preserving them
  out of habit
- apply these rules with judgment and keep the scope honest to the user request
