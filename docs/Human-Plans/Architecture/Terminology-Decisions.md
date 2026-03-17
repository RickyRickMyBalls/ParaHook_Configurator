# Terminology Decisions

## Doc Header

### Doc History
3. 2026-03-16 17:13: Added a new terminology transition for `Param Types` -> `Data Types` so the architecture docs now explicitly capture that the top type-system list has grown beyond pure param primitives and should use broader language going forward
2. 2026-03-16 14:13: Added a `Suggested Roadmap Placement` note pattern to the active terminology entries so naming transitions can point to a likely future lane/subphase home without pretending those roadmap labels are already canonically locked
1. 2026-03-16 14:12: Created this doc as the dedicated architecture-side home for active naming and terminology transitions so repeated renaming decisions stop getting scattered across roadmap notes, codex scratchpads, and one-off implementation passes

### Purpose

This doc tracks important naming transitions and terminology decisions for the architecture layer.

Use it when:
- a term keeps changing across docs, code, and UI
- you need to know the current term versus the target term
- you want one place to record vocabulary migrations before code renames happen

Do not use it for:
- detailed type schemas
- product vision
- implementation task breakdowns

### How To Use This Doc

- add one short entry per terminology decision
- keep each entry explicit about:
  - current term
  - target term
  - why
  - status
  - scope
- use this doc before larger codewide renames so the wording is locked first

### Status Meanings

- `[ ]` = proposed, not yet accepted
- `[~]` = active transition / should start guiding new docs and new code
- `[x]` = accepted / preferred wording is locked
- `[L]` = legacy wording to phase out

### Suggested Roadmap Placement Note

When useful, entries in this doc can include a provisional roadmap home.

These are suggestions only:
- not a locked roadmap commitment
- not a real task doc yet
- just the best current guess for where the rename/migration should live later

## Doc Body

### Active Terminology Transitions

#### 1. `Number` -> `Float`

- Status:
  - `[~]` active transition
- Current term:
  - `Number`
- Target term:
  - `Float`
- Why:
  - `Number` is too vague once the node/param system becomes more formal
  - `Float` leaves clearer room for later types like `Int`, `Angle`, `Length`, and `Enum`
- Scope:
  - architecture docs
  - type planning
  - future node/param naming
- Note:
  - UI can still use friendlier wording later if needed, but the architecture/system term should likely become `Float`
- Suggested roadmap placement:
  - suggested lane: Lane `[3]`
  - suggested subphase: `[3.2A] SP / ARCH - Param Type Vocabulary Normalization`
  - why:
    - this is a node/type-system cleanup that should happen alongside deeper authoring hardening, not inside the earlier Browser/content lanes

#### 2. `Parent Node` -> `Composite Node`

- Status:
  - `[x]` accepted
- Current term:
  - `parent node`
- Target term:
  - `Composite Node`
- Why:
  - `parent node` is informal and ambiguous
  - `Composite Node` more accurately describes a graph-facing node that contains or wraps real internal command logic
- Scope:
  - architecture docs
  - node planning
  - future editor language
- Note:
  - useful sublabels later:
    - `composite sketch node`
    - `composite feature node`
    - `composite part node`
- Suggested roadmap placement:
  - suggested lane: Lane `[3]`
  - suggested subphase: `[3.2B] SP / ARCH - Composite Node Language And Node-System Cleanup`
  - why:
    - this terminology matters most once the future `Sketch`, `Extrude`, and broader composite-node system start becoming real implementation targets

#### 3. `Feature Stack inside part-node data` -> `FeatureStack as a first-class composite candidate`

- Status:
  - `[~]` active transition
- Current term:
  - `Feature Stack belongs inside part-node data`
- Target term:
  - `FeatureStack should not be permanently trapped inside part-node data and should leave room for first-class composite ownership later`
- Why:
  - the long-range graph direction is moving toward explicit command/composite ownership
  - keeping Feature Stack permanently embedded would make that harder
- Scope:
  - architecture docs
  - roadmap interpretation
  - future node-system design
- Note:
  - this is a direction-setting terminology shift, not a claim that the code has already migrated
- Suggested roadmap placement:
  - suggested lane: Lane `[3]`
  - suggested subphase: `[3.2C] SP / ARCH - FeatureStack First-Class Ownership Direction`
  - why:
    - this is a deeper authoring-architecture shift that should be handled with the node/composite-system work, not as a small docs-only rename

#### 4. `Param Types` -> `Data Types`

- Status:
  - `[x]` accepted
- Current term:
  - `Param Types`
- Target term:
  - `Data Types`
- Why:
  - the list now covers more than param primitives
  - it also includes transforms, planes, sketch geometry, solid bodies, and composite wrapper types
  - `Data Types` better matches the broader graph/node type-system role
- Scope:
  - architecture docs
  - node-system planning
  - future pin/wire/type language
- Note:
  - keep type names themselves bracketed in docs when that helps the visual/type-color read
- Suggested roadmap placement:
  - suggested lane: Lane `[3]`
  - suggested subphase: `[3.2A] SP / ARCH - Param Type Vocabulary Normalization`
  - why:
    - this belongs with the broader type-language cleanup around `Number -> Float` and other node-system naming hardening

### Locked Vocabulary Notes

- `GraphDocument`
  - the saved/open graph document in the workspace
- `SpaghettiGraph`
  - the graph payload inside a graph document
- `SpaghettiNode`
  - one node on the canvas
- `SpaghettiEdge`
  - one wire/connection in the graph

These terms are still the current code vocabulary and should stay stable unless there is a strong reason to rename them.
