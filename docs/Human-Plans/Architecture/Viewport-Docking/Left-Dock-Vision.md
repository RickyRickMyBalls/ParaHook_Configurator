# Left Dock Vision

## Doc Header

### Doc History
1. 2026-05-02 10:16:10: Added this dedicated `Left-Dock-Vision.md` planning home under `Viewport-Docking` so the Browser, Meatball Editor, Runtime Inspector, and later hosted left-dock surfaces can grow through one shared dock-stack layout system instead of scattered surface-local resize behavior

### Purpose

This doc captures the long-range vision for the primary viewport's hosted left dock in ParaHook.

Use it to answer:
- what the left dock is supposed to feel like when it is good
- which hosted surfaces belong to the left dock stack
- how dock width, stack height, and internal panel splits should relate
- how Browser, Meatball Editor, Runtime Inspector, and later hosted panels should share one dock layout model
- what should stay owned by the dock system versus by the hosted surfaces themselves

Do not use it for:
- one specific implementation-phase checklist
- pretending Browser or Meatball owns the dock layout alone
- scattering left-dock resize rules across individual host files without one shared contract

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for keeping left-dock growth aligned with the shared workspace-shell direction instead of turning each hosted panel into its own windowing system

- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - deeper product and architecture north star
  - useful for checking that dock polish still serves the hybrid workspace and explicit surface-hosting direction

- `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md`
  - broad shell and host-organization family
  - useful when left-dock work touches shared runtime host extraction, shell readability, or top-level AppShell ownership splits

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
  - workspace surface and shell behavior family
  - useful when docked editor or docked tool behavior overlaps broader workspace-mode expectations

- `docs/Human-Plans/Architecture/Viewport-Docking/Left-Dock-Vision.md`
  - this vision doc
  - useful as the stable north-star surface before later generation indexes and future phase docs are added

## Doc Body

### Why This Doc Exists

ParaHook already has a real hosted left dock in the primary viewport, but its behavior is still only partially systemized.

Today the dock already owns:
- the shared left-dock width
- Browser hosting
- Meatball Editor hosting
- dock preview targets

What it does not yet own cleanly enough is:
- total hosted stack height
- the shared divider between multiple hosted panels
- panel-slot participation rules for surfaces beyond Browser and Meatball Editor
- one honest persistence model for dock stack layout

Without a dedicated planning home, the left dock risks drifting into one of two bad shapes:
- each hosted surface invents its own resize rules and the stack becomes inconsistent
- the shell keeps special-casing Browser, Meatball Editor, and Runtime Inspector separately instead of treating them as participants in one dock system

This doc exists to keep the left dock on the narrow honest path between those failures.

### Short Version

The left dock should become one shared hosted surface stack attached to the primary viewport.

When it is good, it should feel:
- stable
- adjustable
- persistent
- layout-honest
- consistent across hosted panels
- easy to understand without hidden resize rules

The left dock should not become:
- a Browser-owned mini layout engine
- a Meatball-only special case
- a pile of one-off height hacks for whichever panel was added most recently

### Left Dock North Star

The long-range target is a left-dock stack that:
- hosts multiple viewport-adjacent tool surfaces inside one shared shell lane
- gives the user direct control over dock width, stack height, and internal panel splits
- persists that layout state cleanly
- allows hosted panels to appear, disappear, and reorder without breaking the shared resize model
- keeps panel content ownership separate from dock layout ownership

The dock system should be thought of as:
- the layout and hosting owner for left-edge viewport tools

not as:
- the owner of Browser behavior
- the owner of Meatball Editor behavior
- the owner of Runtime Inspector content behavior

Hosted surfaces should continue to own:
- their internal UI
- their content and actions
- their panel-specific modes

The left dock should own:
- width
- total visible stack height
- internal splitter positions
- slot occupancy rules
- resize handles
- persistence of those layout values

### Hosted Surface Scope

The left dock should be able to host at least:
- Browser
- Meatball Editor
- Runtime Inspector

Later hosted left-dock surfaces should be allowed only if they can participate honestly in the shared dock-stack contract.

That means new participants should fit:
- the same width owner
- the same stack-height owner
- the same shared divider model
- the same persistence model

If a future surface needs fundamentally different layout rules, it should probably not be added to this dock family by default.

### Left Dock Generations

The left dock should now be treated as a generation ladder instead of one flat bucket of UI cleanup.

#### Generation 1 - Shared Dock Stack Resizing Baseline

This should be the first left-dock generation.

`Generation 1` should make true:
- the user can resize left-dock width consistently
- the user can resize the total hosted stack height
- the user can resize the shared divider when multiple hosted panels are present
- Browser, Meatball Editor, and Runtime Inspector participate through one honest stack model instead of per-panel hacks
- layout state persists and restores predictably

This generation should stay read-only at first when useful for shell validation, but the model itself should be designed as the real long-term owner rather than a temporary demo-only branch.

#### Generation 2 - Shared Slot Policy And Dock Surface Expansion

`Generation 2` should widen the family only after the resizing baseline is honest.

This later generation can cover:
- clearer slot/participant rules
- explicit ordering and occupancy policy
- additional hosted-panel support if still appropriate
- better visual affordances and shell polish around the shared stack

Important rule:
- do not widen into more hosted-panel ideas until `Generation 1` proves the stack-height and shared-divider contract cleanly

### What Must Stay True

1. The left dock is one shared shell system, not a Browser-only feature.

2. Hosted panel layout ownership must stay separate from hosted panel content ownership.

3. Width, stack height, and internal split state should be explicit and persisted rather than inferred from temporary DOM conditions.

4. Browser, Meatball Editor, and Runtime Inspector should participate through the same dock-stack contract whenever they are hosted in this lane.

5. The dock should stay understandable to users: outer edge changes total dock size, internal edge changes the relationship between hosted panels.

6. Read-only shell validation is acceptable as a first step, but it should not hard-code a fake behavior model that will need to be thrown away immediately afterward.

7. New hosted left-dock surfaces should only be added when they can fit the shared dock contract honestly.
