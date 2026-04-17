## Purpose

This file defines the repository maintenance rules Codex must follow when making implementation changes and document changes.

Implementation changes include:
- source code
- configuration
- schema
- UI behavior

Document changes include:
- architecture docs
- planning docs
- README/docs structure
- repository process/rules docs

## Core Rule

For every implementation change or document change, Codex must update the required project-tracking docs in the same change set unless the user explicitly says otherwise.

Canonical tracking files:
- `docs/CHANGELOG.md` for code and shipped implementation work
- `docs/Doc-Log.md` for document changes

Canonical direction and docs-structure references:
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Human-Plans/Architecture/`
- `docs/Doc-Index.md`
- `docs/Agents/Implementation-Behavior.md`
- `docs/Phase-Plans/00_Phase-Setup.md`

## Implementation Behavior Rule

For implementation, cleanup, and refactor work, Codex should follow
`docs/Agents/Implementation-Behavior.md` as the default behavior guide for:
- file ownership and splitting decisions
- hook/effect boundaries
- component extraction and prop-flow judgment
- migration and compatibility retirement
- behavior-first testing and cleanup bias

If a more local architecture/task doc gives a narrower rule for the current
system, follow the narrower local rule without violating the general cleanup and
retirement principles above.

## File Reference Rule

When Codex references repo files in responses:
- prefer clickable markdown links for local repo files in chat responses
- prefer workspace-root-relative links when the client resolves them correctly
- use absolute filesystem paths only as a fallback when a relative markdown link is known not to work
- when pointing to a specific location, prefer the repo's clickable markdown-link format if the client supports it
- do not assume the repo root and the current workspace root are different unless the environment clearly shows that they are

Examples:
- valid in this workspace chat client: `[Doc Log](./docs/Doc-Log.md)`
- valid in this workspace chat client: `[AGENTS.md](./AGENTS.md)`
- fallback only if needed: `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook\docs\Doc-Log.md`

## CHANGELOG Rule

Primary file:
- `docs/CHANGELOG.md`

Use it for:
- source-code changes
- configuration/schema changes
- runtime behavior changes
- shipped implementation work

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

## Doc-Log Rule

Primary file:
- `docs/Doc-Log.md`

Use it for:
- docs under `docs/`
- `README.md`
- architecture/planning/rules documentation
- repo documentation structure changes

Do not use it for:
- shipped code or runtime behavior changes that belong in `docs/CHANGELOG.md`

Requirements:
1. Never delete or rewrite previous entries unless the user explicitly asks for doc-log cleanup.
2. Add new entries at the top of the live entry list.
3. Preserve the existing formatting style already used in the file.
4. Use the current system time.
5. Keep wording deterministic so diffs remain stable.

## Vision Alignment Rule

Before making product, UX, architecture, naming, ownership, or workflow-structure decisions:
- read `docs/Vision.md` first
- use `docs/Human-Plans/roadmap/Vision-roadmap.md` as the deeper canonical north-star source
- prefer the vision over local convenience unless the user explicitly directs otherwise
- preserve the long-range direction captured under `What Must Stay True`

## Architecture Family Planning Rule

The main planning home for product, workspace, and system families lives in:
- `docs/Human-Plans/Architecture/`

Use that area when:
- reading or revising a family vision
- creating or revising a family index
- organizing wishlist items into generations or phases
- creating standalone future execution docs
- moving completed family work into shipped records
- checking adjacent-family ownership boundaries

Preferred family planning flow:
1. Start with the family vision and capture the full desired direction without dropping wishlist items.
2. Create or revise the family index so the wishlist is organized into explicit generations or phases instead of one flat idea list.
3. When a family needs pre-start cleanup or a major widening boundary, use an explicit generation planning surface such as `Generation 0`, `Generation 2`, or another clearly named generation index.
4. For each phase that is close enough to build, create one standalone future execution doc with clear scope, boundary rules, implementation direction, and acceptance read.
5. Implement against the owning phase doc, then validate against the wishlist items and intended phase outcome.
6. If the implemented phase does not fully achieve the intended wishlist items, create a new follow-on phase or sub-phase instead of silently checking the wishlist item off.

Catalog-style family structure should usually look like:
- `*-Vision.md`
  - north-star and what must stay true
- `*-Index.md`
  - umbrella family index
  - family structure
  - wishlist organization into generations or phases
- optional generation indexes such as `*-Gen0-Index.md`
  - cleanup, prep, or widening lanes that should not be confused with the first main implementation phase
- `Future/`
  - standalone implementation-ready phase docs
- `Shipped/`
  - completed family records

Important planning rules:
- preserve wishlist items when reorganizing them into phases
- prefer the family docs under `docs/Human-Plans/Architecture/` over scattered planning notes when a real family home already exists
- use generations for major readiness or widening boundaries
- use phases for the ordered implementation ladder inside a family or generation
- keep prep-only work honest instead of presenting it as already-started implementation

## Phase Docs Rule

The repo-wide canonical phase-system source of truth lives in:
- `docs/Phase-Plans/00_Phase-Setup.md`

Use that file when:
- deciding the correct phase prefix
- adding or revising family phase-plan structure
- checking phase-plan lifecycle rules
- checking checklist marker meanings

The active architecture-family planning home lives in:
- `docs/Human-Plans/Architecture/`

Use the family docs there when:
- the real planning home for a family already exists there
- the user is shaping wishlist, vision, generations, or family-phase order
- creating or revising family indexes, future docs, or shipped records
- checking how one family should stay separated from neighboring architecture families

Current phase-plan workspace:
- `docs/Phase-Plans/Tasks/Future/` = planned, not started
- `docs/Phase-Plans/Tasks/` = active
- `docs/Phase-Plans/Tasks/Old/` = completed or retired task files
- family docs such as `docs/Phase-Plans/14_DOC - Phase-Plans.md` hold prefix-level planning/history

If phase-system instructions in another file conflict with `docs/Phase-Plans/00_Phase-Setup.md`, prefer `00_Phase-Setup.md`.

If a narrower family doc under `docs/Human-Plans/Architecture/` exists and does not conflict with vision or canonical phase-system rules, prefer that family doc as the planning truth for that family.

Active task implementation rule:
- when Codex implements code-changing work from a task doc in `docs/Phase-Plans/Tasks/`, that work must receive a proper permanent `docs/CHANGELOG.md` entry in the same change set
- updating only the task doc's local checklist, status text, or `Doc History` is not enough for completed implementation work
- prefer using the task's canonical phase prefix/title in the changelog entry so the shipped work stays tied to the execution spec that drove it

## Required Sequence

When Codex performs implementation work:
1. Implement the requested change.
2. Run verification when requested or when it is reasonably needed.
3. If code/system behavior changed, update `docs/CHANGELOG.md` unless the user explicitly says not to.
4. If docs changed, update `docs/Doc-Log.md` unless the user explicitly says not to.
5. If the implementation came from an active task in `docs/Phase-Plans/Tasks/`, make sure the changelog entry is a full permanent entry, not just task-doc maintenance.

Do not skip required maintenance updates silently.
