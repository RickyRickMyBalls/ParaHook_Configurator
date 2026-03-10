# 7 Codex Chat Notes

## Doc Header

### Doc Notes

- This is the active Codex notes file going forward.
- Use this file for new carry-forward Codex notes after `6_CodexChatNotes.md`.
- Keep substantive timestamped entries on the absolute `[N]` numbering path from the previous file.

## Doc Body

## Session 1 Notes

##### [88] 2026-03-09 18:07 - Naming Decision - Keep Current Store / Editor Names For Now

Decision:

- keep the current names for now:
  - `useSpaghettiStore`
  - `useAppStore`
  - `useSpaghettiUiStore`
  - current spaghetti editor/panel naming

Reason:

- the current architecture cuts are still in motion
- renaming now would add churn while the ownership seams are still settling
- the names are not ideal long term, but they are still workable enough for the current `9A.x` implementation lane

Working rule:

- do not spend time renaming these systems right now
- revisit naming only if:
  - the current names start causing real confusion
  - the graph / viewport / compile ownership split stabilizes enough that better names are obvious

Most likely later rename candidate:

- `useSpaghettiUiStore`

Why:

- after `9A.2` and `9A.3`, it increasingly looks like a smaller local presentation / collapse-state store rather than a major app-level spaghetti owner

##### [89] 2026-03-09 18:09 - Carry-Forward Lessons From `9A.1` Through `9A.3`

These are worth preserving because they change how later phases should be approached.

#### 1. The best first ownership split was:

- `useSpaghettiStore`
  - graph documents
  - graph-owned authored canvas truth
  - first viewport binding seam
- `useAppStore`
  - app-shell mode state
  - compile/build bridge state for now

Working read:

- do not pull graph/viewport ownership upward into `useAppStore`
- later phases should keep shrinking `useAppStore` toward shell/bridge concerns

#### 2. Temporary compatibility bridges were useful when they stayed narrow

Best example:

- keeping `activeGraphDocumentId` alive while introducing explicit viewport binding in `9A.3`

Why this mattered:

- it let the editor-binding cut land cleanly
- it avoided dragging `9C` / `SP 10` routing work into the same change

Working rule:

- transitional bridges are acceptable if they are:
  - explicit
  - narrow
  - clearly scheduled to shrink later

#### 3. The real authored-vs-local split is getting clearer

Graph-owned so far:

- graph document identity
- nodes
- edges
- node positions
- node row mode

Still local so far:

- floating window size/position
- `viewMode`
- `focusNodeId`
- selection / hover / drag runtime state
- collapse / expansion presentation state
- menus and temporary canvas interaction state

Working rule:

- later phases should not casually promote local presentation state into graph truth

#### 4. Hidden active-graph consumers were broader than they first looked

Important lesson:

- the active-graph seam was not only in `SpaghettiEditor`
- it also existed in:
  - `CollapsedEditor`
  - `ExpandedEditor`
  - `SpaghettiCanvas`
  - compile/build bridge calls

Working rule:

- future seam work should trace the full runtime chain, not only the top-level panel/editor file

#### 5. `9A` worked best when each cut stayed phase-pure

What helped:

- `9A.1` only:
  - graph document shape and identity
- `9A.2` only:
  - graph-owned node row mode
- `9A.3` only:
  - first viewport binding seam

Working rule:

- keep `9B` focused on multi-editor Browser coordination
- keep `9C` focused on graph-local compile/build/preview-prep memory
- do not let later cuts collapse into one giant "fix spaghetti architecture" phase

#### 6. Known future pressure seams now look real

Most likely next blockers:

- single-surface selection / hover / drag state
- lingering `selectActiveGraph` compatibility usage outside the editor path
- compile/build bridge still depending on one active graph seam
- `AppShell` still owning floating window geometry locally

This means:

- `9B` should own multi-viewport interaction and local viewport state questions
- `9C` should own graph-keyed compile/build/preview-prep memory questions

##### [90] 2026-03-09 20:34 - Browser Visual Direction - Fusion360-Style Left Hierarchy Tree

Locked UI direction:

- the Browser should essentially feel like a Fusion360-style Browser
- docked on the left
- hierarchy tree first
- expandable rows
- room for row-level controls

Working read:

- the Browser is not meant to be a flat list or temporary debug panel
- it should feel like the project/navigation spine of the app
- future controls such as loading bars and richer row-level controls should live under or beside hierarchy rows, not require a different layout model later

Phase consequence:

- `9B` should already point toward this tree-based Browser shape
- even the first pass should preserve that hierarchy-tree mental model

##### [91] 2026-03-09 20:36 - `9B` Implementation Preference - Browser/Open-Focus First, True Multi-Window Later

Decision:

- the first `9B` implementation should start with Browser-managed open/focus state first
- keep only one visible floating spaghetti surface at first
- add true multiple visible windows later once the Browser/open/focus structure is real

Why:

- Browser-first is the more structural piece
- it gives the app the right coordination model sooner
- it avoids mixing multi-window behavior and Browser architecture too early in the same cut

Working read:

- first `9B` pass:
  - Browser/open/focus structure
  - one visible floating surface
- later follow-on work:
  - true multiple visible windows
