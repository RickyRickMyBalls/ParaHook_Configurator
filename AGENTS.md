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

For every implementation change, Codex must update the required project-tracking docs in the same change set unless the user explicitly says otherwise.

Canonical tracking files:
- `docs/CHANGELOG.md`
- `docs/Chill-Log.md` when chill mode is active

Canonical docs-structure references:
- `docs/Doc-Index.md`
- `docs/Phase-Plans/00_Phase-Setup.md`

## CHANGELOG Rule

Primary file:
- `docs/CHANGELOG.md`

Requirements:
1. Never delete or rewrite previous entries unless the user explicitly asks for changelog cleanup.
2. Add new entries at the top of the live entry list.
3. Preserve the existing formatting style already used in the file.
4. Use the current system time.
5. Keep wording deterministic so diffs remain stable.

Non-destructive policy:
- never rewrite old timestamps without explicit user instruction
- never silently merge or remove old entries
- prefer appending new truth rather than rewriting history

## Chill Mode Rule

The user may explicitly switch the repo into `chill mode`.

While chill mode is active:
- log small rapid edits in `docs/Chill-Log.md`
- do not add a full `docs/CHANGELOG.md` entry for every small edit
- keep the chill log clear enough that it can be consolidated later

Chill mode ends only when the user explicitly asks to update the changelog or gives a clearly equivalent instruction.

When chill mode ends:
- read the active chill batch
- consolidate it into one new `docs/CHANGELOG.md` entry unless the user asks for a different treatment

## Planning Mode Rule

The user may explicitly switch the repo into `planning mode`.

While planning mode is active:
- read `docs/Agents/Agents-Planning.md`
- follow its planning-specific workflow
- stay focused on architecture, product direction, salvageable systems, refactor candidates, new objects, and retirement candidates
- avoid drifting into implementation unless the user explicitly asks for code or file edits
- do not add `docs/CHANGELOG.md` entries for planning-mode work
- record planning-mode batch progress in the active `docs/Archive/CodexContext/History-Chats/N_CodexChat.md` file under its top-of-file `Planning-Batch` section
- keep `Planning-Batch` entries numbered newest-first
- when a doc is created or edited during planning mode, follow normal `docs/Doc-Index.md` local doc-history rules in that doc instead of creating a changelog entry

Planning mode ends only when the user explicitly exits it or clearly switches back to normal implementation work.

## Historian Mode Rule

The user may explicitly switch the repo into `historian mode`.

Use historian mode only when the user explicitly asks for history processing.

Historian workflow:
1. Read the target `docs/Archive/History/# - chatgpt.md` file or other explicitly requested history file.
2. Add a structured readable summary near the top of that same file.
3. Preserve the raw transcript underneath, preferably wrapped in an HTML comment.
4. Update `docs/Archive/History/0 - compiled-HISTORY.md` with a short index entry.

Rule:
- keep the compiled history file short
- keep the detailed write-up in the specific history file
- do not delete raw history unless the user explicitly asks

## Phase Docs Rule

The phase-system source of truth lives in:
- `docs/Phase-Plans/00_Phase-Setup.md`

Use that file when:
- deciding the correct phase prefix
- adding or revising family phase-plan structure
- checking phase-plan lifecycle rules
- checking checklist marker meanings

Current phase-plan workspace:
- `docs/Phase-Plans/Tasks/Future/` = planned, not started
- `docs/Phase-Plans/Tasks/` = active
- `docs/Phase-Plans/Tasks/Old/` = completed or retired task files
- family docs such as `docs/Phase-Plans/14_DOC - Phase-Plans.md` hold prefix-level planning/history

If phase-system instructions in another file conflict with `docs/Phase-Plans/00_Phase-Setup.md`, prefer `00_Phase-Setup.md`.

## Codex Chat Capture Rule

When a new long-form Codex working session begins, use the next
`docs/Archive/CodexContext/History-Chats/N_CodexChat.md` file as the running
notes surface for:
- key project decisions
- important architecture clarifications
- phase/prefix rule changes
- docs workflow decisions
- strong conclusions about current direction

`N_CodexChat.md` is the conversation-facing working capture.
`N_CodexContext.md` is the later distilled handoff summary.

Do not wait until the end of the session to record major reusable decisions if
the chat is clearly producing project knowledge that should survive the session.

## Required Sequence

When Codex performs implementation work:
1. Implement the requested change.
2. Run verification when requested or when it is reasonably needed.
3. Update `docs/CHANGELOG.md` unless chill mode is active or the user explicitly says not to.

Do not skip required maintenance updates silently.
