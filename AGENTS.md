## Purpose

This file defines the repository maintenance rules Codex must follow when making implementation changes.

Implementation changes include:
- source code
- configuration
- schema
- architecture
- UI behavior
- repository process/rules docs

## Core Rule

For every implementation change, Codex must update all required project-tracking documents in the same change set.

Required files:
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

## CHANGELOG Rule

Primary file:
`docs/CHANGELOG.md`

Requirements:
1. Never delete or rewrite previous entries.
2. Always prepend the new entry at the top of the entry list.
3. Preserve the existing formatting style.
4. Use the next sequential numeric index `[NNN]`.
5. Use the current system time.
6. Wrap each new entry header with the same separator style already used in the file.
7. Keep entries deterministic so diffs remain stable.

Required entry structure:
- `## [NNN] YYYY-MM-DD HH:mm (Task Title)`
- `### Scope / Constraints Honored`
- `### Summary of Implementation`
- `### Files Changed`
- `### Behavior Changes (if any)`
- `### Verification Steps`

Non-destructive policy:
- never delete old changelog entries
- never rewrite old changelog entries
- never change old timestamps
- never insert a new entry anywhere except the top

## TASKLIST Rule

Primary file:
`docs/TASKLIST.md`

Requirements:
1. Treat `docs/TASKLIST.md` as the main execution tasklist.
2. Update task status in the same change set as the implementation.
3. Use:
   - `[ ]` not started
   - `[~]` in progress / partial
   - `[x]` completed
4. Keep newest phase blocks at the top.
5. Never delete old phase task lists.
6. Preserve completed phases as full checklist blocks.
7. Keep completed accomplished items marked `[x]`.
8. Do not collapse completed phases into one-line summaries only.
9. If a task is blocked, mark it `[~]` and include a one-line blocker note.
10. Keep wording deterministic and concise.

Required tasklist structure:
1. `Status Legend`
2. `Active Phases (Newest -> Oldest)`
3. `Completed Log (Newest -> Oldest)`

Formatting rules for phases:
- keep visible phase headers
- keep separator lines between phase blocks
- keep tasks as checkboxes
- use indented sub-checkboxes for concrete subtasks

Completed phase expectations:
- preserve the full completed checklist block
- keep the phase readable as a historical record
- include completion date when the tasklist format already expects it
- include related changelog index `[NNN]` when available

## change-List Rule

Primary file:
`docs/change-List.md`

Requirements:
1. Add a matching entry after implementation work in the same change set.
2. Preserve the file's current numbering/ordering style.
3. Keep newest entries at the top unless the user explicitly requests restructuring.
4. Do not delete or rewrite existing entries unless the user explicitly asks for cleanup, deduplication, or reformatting.
5. Keep wording concise and deterministic.

## Required Sequence

When Codex performs implementation work:
1. Implement the requested change.
2. Run requested verification, if any.
3. Update `docs/CHANGELOG.md`.
4. Update `docs/TASKLIST.md`.
5. Update `docs/change-List.md`.

Do not skip these maintenance updates.
