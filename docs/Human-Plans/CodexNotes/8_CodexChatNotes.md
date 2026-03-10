# 8 Codex Chat Notes

## Doc Header

### Doc Notes

- Working notes for the current planning pass after reading:
  - `docs/Doc-Index.md`
  - `docs/CHANGELOG.md`
  - `docs/Human-Plans/roadmap/roadmap.md`
  - `docs/Human-Plans/Decisions.MD`
  - `docs/Phase-Plans/Tasks/Future/01.07 - GE - Phase 11B.md`
  - `docs/Phase-Plans/Tasks/Future/01.08 - GE - Phase 11C.md`
- Use this file as the temporary Codex scratchpad for:
  - current-state summary
  - next implementation candidates
  - open planning questions before implementation

## Doc Body

## Session 1 Notes

##### [92] 2026-03-10 00:00 - Current State Snapshot

Current read:

- `9A`, `9B`, `9C`, and `11A` are implemented.
- `11B` and `11C` are the most implementation-ready near-term task docs.
- `SP 10` and `GE 12` are roadmap-broken-down, but they do not yet have dedicated task docs.
- `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts` is the main Lane `[1]` planning gap still marked as not broken down enough.

Working consequence:

- the project has already done the groundwork for:
  - graph documents
  - Browser/editor viewport coordination
  - graph-local compile/preview prep
  - low-level graph save/load persistence
- the next work should probably choose between:
  - implementing `11B`
  - implementing `11C`
  - tightening the planning/doc surface for `SP 10`, `GE 12`, or `[1.5]`

##### [93] 2026-03-10 00:00 - Current Boundary Read

Locked enough already:

- `11B`
  - Browser owns cached graph entries
  - saved graph != cached live graph
  - cached graph identity must stay separate from viewport identity
- `11C`
  - editor-facing actions must stay explicit
  - `Open Graph`, `Load Into New Graph`, `Open In New Editor`, and `Swap Current Editor` should not blur together
- later phases
  - `SP 10` owns graph-aware routing
  - `GE 12` owns project-level graph collection/content ownership
  - `[1.5]` owns the first richer Browser hierarchy surface

Main planning pressure:

- the docs already lock many ownership rules
- the biggest remaining ambiguity is less about architecture direction and more about:
  - which near-term cut should land first
  - what exact user-facing behavior should be considered the first acceptable implementation for that cut

##### [94] 2026-03-10 00:00 - Questions To Resolve Before Implementation

Questions for the next user pass:

- do we want the next code implementation to be `11B` first, `11C` first, or a planning/doc pass for another lane first
- if `11B` is next:
  - should the first pass support loading from disk straight into a Browser cached entry immediately
  - should Browser rows already show only `dirty/saved`, or any additional state in this cut
- if `11C` is next:
  - what should be the default human-facing action when a user chooses a graph from the Browser:
    - focus existing editor
    - swap focused editor
    - open new editor
  - should `Load Into New Graph` mean cloning the loaded file contents into a brand new graph identity immediately
- if planning comes first:
  - should the next planning target be `[1.5] SP - Phase 11`
  - or should we instead create dedicated task docs for `SP 10A/10B/10C` or `GE 12A/12B/12C`
