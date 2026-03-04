## Change Log Maintenance Rule

All Codex-generated implementation work MUST update the project Change Log.

File:
CHANGELOG.md (or the existing Change Log document used in this repository)

Rules:

1. NEVER delete or rewrite previous entries.
2. ALWAYS insert a new entry at the top of the Change Log entries (directly under the title/rules block), not at the end.
3. Preserve the existing formatting style used in the Change Log.
4. Each new entry must include the following sections:

   Scope / Constraints Honored
   Summary of Implementation
   Files Changed
   Behavior Changes (if any)
   Verification Steps

5. Entry headers must follow this format:

   ## [NNN] YYYY-MM-DD HH:mm (Task Title)

6. Use the current system time when generating the entry.
7. `NNN` must be the next highest sequential number in the file.
8. Entries must be deterministic so git diffs remain stable.

## Behavior Requirement

Whenever Codex performs a task that modifies source code, configuration, schema, or architecture:

1. Implement the requested change.
2. Run any verification steps requested in the prompt.
3. Insert a new Change Log entry at the top (reverse order) describing the change.

Do not skip Change Log updates.

## Non-Destructive Policy

Under no circumstances may Codex:

- delete previous Change Log entries
- rewrite previous entries
- change timestamps of existing entries
- insert new entries anywhere except the top of the log entries

The Change Log is reverse-ordered with newest entries first.
