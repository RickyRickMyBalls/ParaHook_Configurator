# [ ] `Catalog-1` - `Workspace Foundation And Catalog Contract`

## Doc Header

### Doc History
10. 2026-04-17 18:53:15: Prepped `Catalog-1 / Phase 1 - Surface Kind And Catalog Registration` for implementation, grounding the next cut in the live `workspaceShellTypes.ts` and `workspaceSurfaceCatalog.ts` seams, making the current missing `catalog` union, generated-id, render-family, and optional-surface gaps explicit, and tightening the verification read around the existing workspace-store, viewport-frame, and persistence proof surfaces without widening into `Phase 2`
9. 2026-04-17 18:42:41: Reworked this `Catalog-1` future doc to the current `Architecture Setup` plan-doc format, adding `Doc Body`, `Wishlist Organization`, and top-level `[ ]` phase sections with `Summary` plus `Implementation Spec` halves while aligning the foundation scope to the newer `Catalog-Index.md` `Generation 1 Vision`, including the `Imports` baseline, lightweight card-grid read, item-page responsibilities, and preview-versus-commit wishlist tracking
8. 2026-04-15 22:59:27: Tightened `Catalog-1 / Phase 1 - Surface Kind And Catalog Registration` into an implementation-ready slice by grounding it in the live `workspaceShellTypes.ts` and `workspaceSurfaceCatalog.ts` seams, locking the exact first code cut around `catalog` kind registration plus generated-id support, and adding phase-specific file targets, risks, checklist items, verification shape, and done shape
7. 2026-04-15 22:11:59: Reworked the internal `Catalog-1` ladder again into a finer-grained ten-phase sequence so Codex can execute the foundation one narrow step at a time, separating surface-kind registration, tiled switch proof, float parity, persistence or popup decisions, item contract, manifest seam, shell regions, shell wiring, loader boundaries, and downstream ownership proof instead of bundling those seams into broader mixed phases
6. 2026-04-15 22:11:00: Reworked the internal `Catalog-1` ladder into a straight `Phase 1` through `Phase 6` sequence by renumbering the earlier `1A / 1B` onboarding split and breaking the old combined loader-boundary or ownership section into separate `Phase 5` and `Phase 6` sections so the foundation lane now reads as one continuous six-step implementation ladder
5. 2026-04-15 22:06:23: Split the old broad `Catalog-1 / Phase 1` into `Phase 1A - Tiled Workspace Mode Adoption` and `Phase 1B - Windowed Host-Mode Parity And Persistence`, keeping the later internal ladder cleanly numbered as `Phase 2` through `Phase 4` while separating the split-and-switch workspace-mode proof from the floating or persistence follow-through
4. 2026-04-15 22:03:14: Tightened `Catalog-1 / Phase 1` so the workspace-onboarding proof is now explicitly framed as a real workspace-mode adoption: the user should be able to split a `modelViewer` pane, keep the original pane as `modelViewer`, and switch the new non-primary pane to `Catalog` through the shared slot type-picker seam
3. 2026-04-15 21:57:57: Tightened `Catalog-1 / Phase 1` so floating-window support is explicit first-pass scope, locking that `Catalog` must participate in the shared workspace float and redock host-mode seam during the initial workspace-surface onboarding cut instead of leaving that behavior implied
2. 2026-04-15 21:23:37: Reworked this `Catalog-1` doc into four internal top-level `##` phase sections so the foundation lane can execute as smaller Codex-sized steps for workspace onboarding, item-contract lock, first shell definition, and loader-boundary proof instead of remaining one broad setup block
1. 2026-04-15 20:24:35: Added this first standalone `Catalog-1` phase doc to define the foundation cut for a real `Catalog` workspace, locking the initial workspace-surface onboarding, curated manifest contract, visible shell shape, and clean loader-action boundaries before later hook, shoe, footpad, and HDRI families widen the implementation

### Purpose

This phase defines the first honest foundation slice for the `Catalog` workspace in ParaHook.

Use it to answer:
- what must exist before `Catalog` can be a real workspace instead of only an idea
- how the first `Catalog` surface should read in `Generation 1`
- what the first catalog data contract and curated-source seam should look like
- how the first visible workspace shell should handle card-grid browse, imports, and preview-versus-commit boundaries
- how to keep future catalog implementation clean instead of bloating existing shell or Browser files

### Why This Phase Exists

The broader `Catalog-Vision.md` now acts as the kickoff idea and long-range family north star.

The main `Catalog-Index.md` now carries the more specific `Generation 1 Vision`.

That means this `Catalog-1` doc should no longer try to act like the whole family vision.

Instead, it should define the first real implementation-ready foundation slice under that `Generation 1` umbrella:
- make `Catalog` a real workspace surface
- lock the first curated item-contract seam
- lock the first shell contract for card-grid browse, imports reuse, item-page responsibilities, and preview-versus-commit honesty
- stop before the actual reference-family and `HDRI` onboarding lanes that belong to later `Catalog-2` and `Catalog-3`

### Scope

This phase covers:
- `Catalog` workspace-surface onboarding
- split-pane, float, redock, and persistence truth for the new surface
- the first curated catalog-item contract
- the first manifest or catalog-source seam
- the first card-grid, imports, item-page, and preview-shell contract
- placeholder shell wiring and clean file boundaries
- the first preview-versus-commit and downstream ownership contract

This phase does not cover:
- the real asset-family onboarding for `foothooks`, `shoes`, and `footpads`
- final `HDRI` family runtime
- curated external-source intake
- the later `Platform` versus `Wheel` widening
- final project recall or rebind semantics for loaded catalog items

## Doc Body

### Goal

Create the first clean foundation for `Catalog` as a real workspace family, with one explicit item-contract seam and one visible workspace shell direction, so later catalog families can ship through new focused files instead of inflating existing Browser, viewer, or shell files with special-case logic.

### Boundaries

This phase should:
- start only after the `Generation 0` cleanup band has removed the old Browser-resident preload baseline
- make `Catalog` a real hosted workspace surface
- lock the baseline `Generation 1` browse contract around a lightweight card grid, item-page decision surface, and imports reuse area
- keep `Load Preview` separate from `Add To Project`
- keep asset-type loader boundaries honest before later family onboarding begins

This phase should not:
- onboard the full real reference families themselves
- onboard final `HDRI` behavior as if it were the same thing as geometry-reference loading
- pull `Generation 2` widening into the baseline
- become a giant all-in-one catalog implementation without clean seams

### Architecture Direction

The right architectural read for this phase is:
- `Catalog` owns browse and choose
- `Browser`, project truth, and viewer state own the loaded result
- the catalog contract should stay explicit and curated
- the shell should be browse-first and preview-first
- imports may be surfaced for reuse after intake, but the import pipeline itself must stay import-owned

The healthy first-pass product read is:
- the user can split a `modelViewer` pane and switch the new non-primary pane to `Catalog`
- the user sees a lightweight card-grid browse surface with no auto-loaded previews
- the user can reach an item page whose primary responsibilities are preview, description, and the honest action for that asset type
- the user can reuse already-known imported items through an `Imports` area without collapsing `Catalog` into the import system
- `Load Preview` stays temporary, and `Add To Project` stays the explicit commit action

### Current Live Read

Current workspace registration seam:
- `src/app/workspace/workspaceShellTypes.ts`
  - owns `WorkspaceSurfaceKind`
  - owns generated surface-instance ids for slotted surfaces
- `src/app/workspace/workspaceSurfaceCatalog.ts`
  - owns canonical surface metadata such as:
    - `scope`
    - split support
    - floating support
    - persistence participation

Current workspace rendering seam:
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - is the likely first render registration owner once `catalog` is a real surface kind
- `src/app/workspace/ViewportFrame.tsx`
  - is the likely non-primary slot type-picker seam

Current likely persistence seam:
- `src/app/workspace/workspacePersistence.ts`
  - is the likely owner for serialize and restore truth once `catalog` participates in persisted workspace layout

Current gap read:
- there is no shipped `Catalog` workspace surface yet
- there is no explicit catalog-item contract yet
- there is no manifest or curated-source seam yet
- there is no shipped `CatalogSurface` contract for card-grid browse, imports, item page, or preview actions yet

### Acceptance Read

This phase is healthy when:
- `Catalog` exists as a real optional workspace surface
- the workspace system can split, switch, float, redock, and persist that surface honestly
- the repo has one explicit catalog-item contract and one explicit catalog-source seam
- the first shell contract clearly includes:
  - lightweight card-grid browse
  - no auto-loaded previews
  - an `Imports` area for already-known imported items
  - an item-page decision surface
  - temporary preview versus explicit commit separation
- the asset-type loader split is explicit enough that later `Catalog-2` and `Catalog-3` do not have to reopen the same ownership questions

## Wishlist Organization

### High Level Goals

- [ ] `HLG 1. Catalog Is A Real Workspace Surface`
- [ ] `HLG 2. Catalog Has A Lightweight Card-Grid, Imports, And Item-Page Baseline`
- [ ] `HLG 3. Preview Stays Separate From Add To Project`
- [ ] `HLG 4. Catalog Uses Explicit Item Metadata And Curated Source Truth`
- [ ] `HLG 5. Catalog Stays Distinct From Browser, Import, And Viewer Ownership`

### `Catalog-1 Phase 1`

- [ ] `1. Catalog Registers As A Real Workspace Surface Kind`
- [ ] `2. Catalog Gets Deterministic Surface-Instance Ids`
- [ ] `3. Catalog Metadata Lives In The Canonical Workspace Surface Catalog`
- [ ] `HLG 1. Catalog Is A Real Workspace Surface`

### `Catalog-1 Phase 2`

- [ ] `4. A Non-Primary Split Pane Can Switch To Catalog`
- [ ] `5. Catalog Gets One Minimal First Surface Owner`
- [ ] `6. The Primary Protected Model Slot Stays Model-Only`
- [ ] `HLG 1. Catalog Is A Real Workspace Surface`

### `Catalog-1 Phase 3`

- [ ] `7. Tiled Catalog Switching Reuses The Shared Workspace Path`
- [ ] `8. Catalog Tiled Behavior Is Proven Against Existing Optional Surfaces`
- [ ] `HLG 1. Catalog Is A Real Workspace Surface`

### `Catalog-1 Phase 4`

- [ ] `9. Catalog Floats And Redocks Through The Shared Host-Mode Path`
- [ ] `10. Catalog Does Not Need A One-Off Floating Shell`
- [ ] `HLG 1. Catalog Is A Real Workspace Surface`

### `Catalog-1 Phase 5`

- [ ] `11. Workspace Persistence Serializes And Restores Catalog Honestly`
- [ ] `12. Popup Or Popout Scope Is Decided Explicitly Instead Of Left Vague`
- [ ] `HLG 1. Catalog Is A Real Workspace Surface`

### `Catalog-1 Phase 6`

- [ ] `13. Catalog Gets One Explicit Shared Item Contract`
- [ ] `14. The Baseline Contract Includes The Fields Needed For Card-Grid Browse`
- [ ] `15. The Baseline Contract Distinguishes Asset Type And Honest Action Kind`
- [ ] `16. The Baseline Contract Includes The Imports-Area Read Without Making Imports The Owner`
- [ ] `HLG 2. Catalog Has A Lightweight Card-Grid, Imports, And Item-Page Baseline`
- [ ] `HLG 4. Catalog Uses Explicit Item Metadata And Curated Source Truth`

### `Catalog-1 Phase 7`

- [ ] `17. Catalog Gets One Curated Manifest Or Source Seam`
- [ ] `18. Repo-Backed Items And Imports-Area Entries Read Through Explicit Source Truth`
- [ ] `19. The Shell Stops Depending On Raw Folder Walking Or Filename Guessing`
- [ ] `HLG 2. Catalog Has A Lightweight Card-Grid, Imports, And Item-Page Baseline`
- [ ] `HLG 4. Catalog Uses Explicit Item Metadata And Curated Source Truth`

### `Catalog-1 Phase 8`

- [ ] `20. The First Visible Shell Uses A Lightweight Card Grid`
- [ ] `21. Catalog Opens With No Auto-Loaded Previews`
- [ ] `22. The Shell Includes Categories Or Filters, The Grid, The Item Page, And The Honest Action Area`
- [ ] `23. The Item Page Is The Main Decision Surface For A Selected Entry`
- [ ] `HLG 2. Catalog Has A Lightweight Card-Grid, Imports, And Item-Page Baseline`
- [ ] `HLG 3. Preview Stays Separate From Add To Project`

### `Catalog-1 Phase 9`

- [ ] `24. CatalogSurface Splits Into Focused Shell Files Instead Of One Overloaded Component`
- [ ] `25. Placeholder Wiring Can Prove The Shell Contract Before Real Family Loaders Exist`
- [ ] `26. The Imports Area Has A Dedicated Shell Region Or Subsurface Contract`
- [ ] `HLG 2. Catalog Has A Lightweight Card-Grid, Imports, And Item-Page Baseline`
- [ ] `HLG 4. Catalog Uses Explicit Item Metadata And Curated Source Truth`

### `Catalog-1 Phase 10`

- [ ] `27. Load Preview Stays Temporary`
- [ ] `28. Add To Project Stays The Explicit Commit Action`
- [ ] `29. Multiple Temporary Previews Are Allowed By Contract`
- [ ] `30. Reference Loading And HDRI Apply Stay Separate`
- [ ] `HLG 3. Preview Stays Separate From Add To Project`
- [ ] `HLG 5. Catalog Stays Distinct From Browser, Import, And Viewer Ownership`

### `Catalog-1 Phase 11`

- [ ] `31. Catalog Never Becomes The Hidden Runtime Owner After Commit`
- [ ] `32. Browser Or Project Truth Owns Reference Results`
- [ ] `33. Viewer Or Environment State Owns HDRI Results`
- [ ] `34. Imports Reuse Still Stays Separate From The Import Pipeline`
- [ ] `HLG 3. Preview Stays Separate From Add To Project`
- [ ] `HLG 5. Catalog Stays Distinct From Browser, Import, And Viewer Ownership`

## [ ] `Catalog-1` - `Phase 1 - Surface Kind And Catalog Registration`

### Phase 1 Summary
#### Purpose

Add `Catalog` as a first-class workspace surface kind before any UI, manifest, or loader work begins.

#### Owns

- `catalog` in `WorkspaceSurfaceKind`
- deterministic generated-id support for `catalog`
- canonical surface metadata for `catalog`
- optional-surface participation for `catalog`

#### Does Not Own

- visible `CatalogSurface` UI
- slot switching behavior
- manifest reads
- preview or commit behavior

#### Current Live Read

The current registration seam is already narrow and explicit:

- `src/app/workspace/workspaceShellTypes.ts`
  - owns the canonical `WorkspaceSurfaceKind` union
  - owns `createWorkspaceSurfaceInstanceIdForSlot(...)`
  - owns the default slot creation helpers that seed a slot with a generated surface instance id
  - currently hard-codes generated slot ids for:
    - `modelViewer`
    - `browser`
    - `console`
    - `notepad`
    - `dashboard`
    - fallback `spaghettiEditor`
  - currently does not include `catalog` in the `WorkspaceSurfaceKind` union
  - currently sends any unknown future surface kind through the `spaghetti-${slotId}` fallback branch
- `src/app/workspace/workspaceSurfaceCatalog.ts`
  - is the bounded source of truth for surface metadata
  - owns:
    - `defaultLabel`
    - `renderFamily`
    - `scope`
    - `supports.slotted`
    - `supports.floating`
    - `supports.popout`
    - `supports.split`
    - persistence participation
    - coordination profile
  - currently treats optional surfaces as:
    - `dashboard`
    - `notepad`
  - currently does not include:
    - `catalog` in `WorkspaceSurfaceRenderFamily`
    - `catalog` in `OptionalWorkspaceSurfaceKind`
    - one canonical `catalog` metadata entry

The strongest nearby consumer and proof seams are already visible:

- `src/app/workspace/workspacePersistence.ts`
  - already calls `parseWorkspaceSurfaceKind(...)` while normalizing persisted surface records
  - will automatically expose whether the new kind is wired truthfully or still missing catalog-level parse support
- `src/app/workspace/ViewportFrame.tsx`
  - already types the slot surface picker against `WorkspaceSurfaceKind`
  - will surface any accidental typing drift once `catalog` joins the union
- `src/app/workspace/useWorkspaceStore.ts`
  - already relies on `createWorkspaceSurfaceInstanceIdForSlot(...)` when creating and switching slot surfaces
  - will expose whether `catalog` still falls through to the `spaghetti` prefix during shared slot flows

#### First Pass Decisions

- `catalog` should enter as an optional workspace surface, not as a core surface
- `catalog` should get its own explicit generated slot-instance prefix instead of falling through the `spaghettiEditor` fallback branch
- `catalog` should be marked as participating in split and persistence from the start, because later tiled and restore phases should not need to reopen metadata truth
- `catalog` should use plain coordination in this phase
- no render registry or type-picker widening belongs in this phase yet

### Phase 1 Implementation Spec
#### Exact First Code Cut

1. Add `catalog` to the `WorkspaceSurfaceKind` union in `workspaceShellTypes.ts`.
2. Add an explicit `catalog-${slotId}` branch to `createWorkspaceSurfaceInstanceIdForSlot(...)`.
3. Verify the default slot helpers still type-check cleanly with the widened union and do not accidentally fall back to the `spaghetti` prefix.
4. Add `catalog` to `WorkspaceSurfaceRenderFamily` in `workspaceSurfaceCatalog.ts`.
5. Add one `catalog` entry to `workspaceSurfaceCatalogEntries` with:
   - an explicit default label
   - `scope: 'optional'`
   - honest split, floating, popout, and slotted support metadata
   - persistence participation enabled
   - `coordination: 'plain'`
6. Widen `OptionalWorkspaceSurfaceKind` so `catalog` is part of the optional surface set.
7. Stop before any `ViewportSurfaceRegistry`, `ViewportFrame`, or shell wiring work begins.

#### Likely Files

- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspaceSurfaceCatalog.ts`
- likely focused proof surfaces:
  - `src/app/workspace/useWorkspaceStore.test.ts`
  - `src/app/workspace/ViewportFrame.test.tsx`
  - persistence-adjacent proof if needed through:
    - `src/app/AppShell.test.tsx`

#### No-Widening Rule

- do not start visible surface rendering in this phase
- do not widen into slot switching in this phase
- do not add manifest or shell concerns in this phase

#### Implementation Risks

- forgetting the generated-id branch and silently inheriting the `spaghetti-${slotId}` fallback
- widening the surface union without widening the optional-surface helper types
- adding `catalog` metadata in UI files before the canonical surface catalog is updated
- overreaching into slot switching or rendering work that belongs in `Phase 2`

#### Checklist

- [ ] add `catalog` to `WorkspaceSurfaceKind`
- [ ] add explicit generated slot-instance id support for `catalog`
- [ ] add `catalog` to the surface render-family union
- [ ] add one canonical `catalog` metadata entry to `workspaceSurfaceCatalogEntries`
- [ ] widen the optional-surface helper type to include `catalog`
- [ ] keep render registry, slot switching, and host-mode work deferred to later phases

#### Verification Shape

Minimum verification for this phase should cover:

- `catalog` can be represented by the canonical workspace kind union without type errors
- `createWorkspaceSurfaceInstanceIdForSlot('catalog', slotId)` produces a `catalog-...` id instead of falling through to another surface prefix
- `parseWorkspaceSurfaceKind('catalog')` resolves cleanly through the catalog metadata seam
- `isWorkspaceSurfaceOptional('catalog')` treats `catalog` as an optional surface
- `workspaceSurfaceSupportsSplit('catalog')` and the related support helpers reflect the intended metadata truth
- nearby shared workspace proof still type-checks or passes once `catalog` joins the union, especially around:
  - slot-surface creation or switching
  - slot-frame surface-kind typing
  - persistence normalization of surface kinds

#### Done Shape

`Phase 1` is done when:

- the canonical workspace type system knows `catalog`
- the canonical workspace metadata catalog knows `catalog`
- generated slot-instance ids for `catalog` are explicit and deterministic
- later phases can build slot switching and shell work on top of shared workspace truth instead of local exceptions

## [ ] `Catalog-1` - `Phase 2 - Tiled Slot Switching And First CatalogSurface`

### Phase 2 Summary
#### Purpose

Prove the first real workspace-mode user flow: split a `modelViewer` and switch the new non-primary pane to `Catalog`.

#### Owns

- one minimal `CatalogSurface`
- non-primary slot switching to `Catalog`
- the protected-primary-slot rule staying `modelViewer`-only

#### Does Not Own

- full shell layout
- manifest-driven data
- preview or commit behavior
- floating or persistence proof

#### Current Live Read

The likely current owners are:

- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - likely render registry seam for the first `CatalogSurface`
- `src/app/workspace/ViewportFrame.tsx`
  - likely slot type-picker seam for non-primary panes
- `src/app/workspace/WorkspaceViewportTree.tsx`
  - likely host for the shared split-tree read that should remain untouched except for honest surface registration

#### First Pass Decisions

- the first `CatalogSurface` can be intentionally minimal in this phase
- the goal is to prove shared split-and-switch flow, not to finish the full browse surface
- the primary protected slot should stay `modelViewer`-only
- `Catalog` should appear through the same optional-surface path used by neighboring hosted surfaces

### Phase 2 Implementation Spec
#### Exact First Code Cut

1. Add one minimal `CatalogSurface` owner under the workspace surface area.
2. Register that surface in `ViewportSurfaceRegistry.tsx`.
3. Expose `Catalog` in the non-primary slot type picker.
4. Keep the primary protected slot `modelViewer`-only.
5. Stop once the user can keep the model visible in one pane and switch the sibling pane to a minimal `CatalogSurface`.

#### Likely Files

- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`

#### No-Widening Rule

- do not add the full shell contract in this phase
- do not add manifest parsing in this phase
- do not widen into floating behavior in this phase

#### Implementation Risks

- letting the first `CatalogSurface` become an improvised full shell before the shell contract is locked
- breaking the protected-primary-slot rule
- adding catalog-only slot-switching exceptions instead of using the shared path

#### Checklist

- [ ] add one minimal `CatalogSurface`
- [ ] register `Catalog` in the surface registry
- [ ] expose `Catalog` in the non-primary slot type picker
- [ ] keep the primary protected slot `modelViewer`-only
- [ ] stop before full shell work begins

#### Verification Shape

Minimum verification for this phase should cover:

- the user can split a `modelViewer`
- the new non-primary pane can switch to `Catalog`
- the original pane stays `modelViewer`
- the primary protected slot still cannot switch away from `modelViewer`

#### Done Shape

`Phase 2` is done when:

- `Catalog` renders as a real non-primary split-pane target
- the shared workspace split-and-switch path remains intact
- later shell work can build on a truthful first hosted surface instead of a shell special case

## [ ] `Catalog-1` - `Phase 3 - Tiled Behavior Regression Proof`

### Phase 3 Summary
#### Purpose

Verify the new tiled `Catalog` surface behaves like the other hosted non-primary surfaces before host-mode widening begins.

#### Owns

- split and switch proof for `catalog`
- retained-surface reuse proof for `catalog`
- regression coverage against existing optional surfaces

#### Does Not Own

- floating behavior
- persistence
- shell-contract widening

#### Current Live Read

The likely proof owners are:

- `src/app/workspace/useWorkspaceStore.ts`
  - likely surface-slot state owner for retained-surface behavior
- existing workspace tests around slot switching and retained surfaces

#### First Pass Decisions

- keep this phase a proof pass
- prove `catalog` can participate in the same tiled lifecycle as neighboring optional surfaces
- only clean up real friction exposed by proof

### Phase 3 Implementation Spec
#### Exact First Code Cut

1. Add focused tiled switching coverage for `catalog`.
2. Prove retained-surface reuse or equivalent shared lifecycle truth works for `catalog`.
3. Confirm the new surface does not break existing non-primary optional-surface switching.
4. Only if proof exposes friction, make the smallest store or surface-catalog cleanup needed.

#### Likely Files

- `src/app/workspace/useWorkspaceStore.ts`
- existing workspace tests around slot switching and retained surfaces

#### No-Widening Rule

- do not begin floating or persistence work in this phase
- do not widen shell behavior in this phase
- do not bury fixes in `CatalogSurface` if the real owner is store or metadata truth

#### Implementation Risks

- skipping regression proof and discovering shared-slot issues later during floating or persistence work
- widening a proof phase into unrelated surface behavior work
- hiding a store-level issue inside a local `CatalogSurface` patch

#### Checklist

- [ ] prove split and switch behavior for `catalog`
- [ ] prove retained-surface reuse for `catalog`
- [ ] prove neighboring optional surfaces still switch correctly
- [ ] keep this phase a proof-and-cleanup pass only

#### Verification Shape

Minimum verification for this phase should cover:

- `catalog` can be opened, switched away from, and returned to through the shared tiled path
- existing optional surfaces still behave correctly after `catalog` joins the set
- any retained-surface rules remain honest for `catalog`

#### Done Shape

`Phase 3` is done when:

- the tiled `Catalog` path is proven stable enough to widen into floating behavior next
- no local `Catalog` exception was needed to keep the tiled workspace honest

## [ ] `Catalog-1` - `Phase 4 - Float And Redock Host-Mode Parity`

### Phase 4 Summary
#### Purpose

Make `Catalog` behave like the other optional hosted surfaces in the shared floating-window lifecycle.

#### Owns

- float behavior for `Catalog`
- redock behavior for `Catalog`
- keeping host-mode truth on the shared path

#### Does Not Own

- popup or popout scope
- persistence
- full browse shell

#### Current Live Read

The likely owners are:

- `src/app/workspace/workspaceSurfaceActions.ts`
  - likely surface host-mode action seam
- `src/app/workspace/useWorkspaceStore.ts`
  - likely surface-instance and host-mode state owner

#### First Pass Decisions

- `Catalog` should participate in the same float and redock lifecycle as other optional surfaces
- avoid a `Catalog`-specific floating shell branch
- keep this phase about shared host-mode parity, not shell polish

### Phase 4 Implementation Spec
#### Exact First Code Cut

1. Verify `Catalog` can enter the shared floating host mode.
2. Verify `Catalog` can redock back to the shared slotted mode.
3. Add focused proof that `Catalog` uses the same host-mode action path as the other optional surfaces.
4. Only if necessary, make narrow shared-host cleanup in store or action owners.

#### Likely Files

- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- focused workspace host-mode tests

#### No-Widening Rule

- do not widen into popup or popout decisions yet
- do not polish the final shell UI yet
- do not add a `Catalog`-only floating wrapper if the shared host path can own it

#### Implementation Risks

- letting `Catalog` float through a one-off path instead of the shared host-mode contract
- blurring floating parity with later persistence or popup work
- assuming tiled proof already guarantees floating truth without dedicated coverage

#### Checklist

- [ ] verify `Catalog` can float
- [ ] verify `Catalog` can redock
- [ ] keep `Catalog` on the shared floating host-mode path
- [ ] avoid a catalog-only floating shell branch

#### Verification Shape

Minimum verification for this phase should cover:

- `Catalog` can move into floating mode
- `Catalog` can return to the slotted layout
- shared optional surfaces remain correct after `Catalog` joins the same host-mode lifecycle

#### Done Shape

`Phase 4` is done when:

- `Catalog` participates in the same float and redock lifecycle as the other optional workspace surfaces
- no catalog-only floating lifecycle exception is needed

## [ ] `Catalog-1` - `Phase 5 - Persistence And Popup Decision`

### Phase 5 Summary
#### Purpose

Finish the workspace-hosting foundation by making persistence explicit and deciding whether popup support belongs in this lane.

#### Owns

- persistence truth for `catalog`
- explicit popup or popout scope decision
- restore behavior for the surface

#### Does Not Own

- broad popup implementation if it does not clearly belong here
- shell-contract widening
- loader behavior

#### Current Live Read

The likely owners are:

- `src/app/workspace/workspacePersistence.ts`
  - likely serialize and normalize owner for persisted workspace layout
- `src/app/workspace/PopupWorkspaceShell.tsx`
  - likely owner only if popup or popout support is intentionally included

#### First Pass Decisions

- persistence is baseline scope and should be explicit in this phase
- popup or popout support must be decided explicitly instead of being left vague
- if the popup answer is `no`, that should be recorded cleanly without widening the code

### Phase 5 Implementation Spec
#### Exact First Code Cut

1. Verify workspace layout persistence can serialize and restore `catalog`.
2. Add focused proof that restored workspace layouts rehydrate `catalog` honestly.
3. Decide explicitly whether popup-local or popout support belongs in this lane or stays deferred.
4. Widen `PopupWorkspaceShell.tsx` only if the same-cut popup decision is `yes`.

#### Likely Files

- `src/app/workspace/workspacePersistence.ts`
- focused persistence tests
- `src/app/workspace/PopupWorkspaceShell.tsx` only if popup scope is intentionally accepted

#### No-Widening Rule

- do not add popup or popout support by drift
- do not widen shell layout work here
- do not treat persistence proof as a place to reopen surface registration or host-mode decisions

#### Implementation Risks

- leaving restore truth vague and rediscovering it later during shell implementation
- silently half-supporting popup or popout without a real decision
- widening persistence work into unrelated surface behavior cleanup

#### Checklist

- [ ] verify `catalog` persists through workspace layout round-trips
- [ ] verify restored layouts can rehydrate `catalog`
- [ ] decide popup or popout scope explicitly
- [ ] widen popup owners only if the explicit decision is yes

#### Verification Shape

Minimum verification for this phase should cover:

- `catalog` survives serialize and restore honestly
- persisted workspace layouts do not drop or corrupt the `Catalog` surface
- popup or popout scope is explicitly implemented or explicitly deferred

#### Done Shape

`Phase 5` is done when:

- restore behavior for `catalog` is honest
- popup support is either implemented cleanly or explicitly deferred instead of being left vague

## [ ] `Catalog-1` - `Phase 6 - Catalog Item Contract`

### Phase 6 Summary
#### Purpose

Lock one explicit curated item shape before manifest reads or shell rendering start depending on ad hoc filename logic.

#### Owns

- the first shared catalog-item contract
- baseline browse and item-page metadata fields
- honest asset-type and action-kind fields
- the first `Imports`-area contract read

#### Does Not Own

- final reference-family metadata
- final `HDRI` runtime behavior
- full `Generation 2` part-fitment widening

#### Current Live Read

There is not yet one shipped catalog-item contract.

That means this phase should create the first explicit shared read for fields such as:
- stable item id
- label
- family or category
- tags
- description
- preview media path
- source path or source reference
- asset type
- action kind
- whether the entry reads as repo-backed or imports-area reuse truth

#### First Pass Decisions

- the contract should stay generic enough for both later reference assets and later `HDRIs`
- the contract should include enough metadata for:
  - card-grid browse
  - item-page display
  - honest action labeling
- the contract should let the imports area exist as a reuse read without making imports the owner
- avoid Gen 2-only fields unless they are truly needed for baseline browse truth

### Phase 6 Implementation Spec
#### Exact First Code Cut

1. Add one shared catalog-item contract module.
2. Define the first baseline fields needed for:
   - grid display
   - item-page display
   - action labeling
   - family or section organization
   - imports-area reuse classification
3. Keep the contract generic enough for both reference assets and `HDRIs`.
4. Stop before any loader implementation tries to infer behavior from filenames instead of the new fields.

#### Likely Files

- likely new `src/app/catalog/` or `src/app/workspace/catalog/` contract file
- focused tests for the shared item-contract shape if the repo already exercises comparable config modules

#### No-Widening Rule

- do not widen into full family-specific metadata here
- do not import Gen 2 part-platform normalization into this baseline
- do not let the shell parse filenames directly instead of using the new contract

#### Implementation Risks

- making the contract too weak to support the card-grid, item-page, and action-language baseline
- making the contract too large by pulling later Gen 2 fields into the foundation
- letting imports-area entries blur into import-pipeline ownership

#### Checklist

- [ ] define the first shared catalog-item contract
- [ ] include the fields needed for grid browse and item-page display
- [ ] include explicit asset-type and action-kind fields
- [ ] include enough source classification to support an imports-area reuse read
- [ ] keep later Gen 2 widening out of the baseline contract

#### Verification Shape

Minimum verification for this phase should cover:

- the first shared item contract is explicit and importable from one canonical place
- the shell no longer depends on ad hoc filename logic as its long-term contract
- imports-area entries can be represented without pretending `Catalog` owns import intake

#### Done Shape

`Phase 6` is done when:

- the first shared item contract is explicit
- later phases can target one stable item shape for baseline `Generation 1` shell work

## [ ] `Catalog-1` - `Phase 7 - Manifest Source Seam`

### Phase 7 Summary
#### Purpose

Define where curated catalog items come from so the first runtime shell does not parse raw folders directly.

#### Owns

- one explicit manifest or catalog-source seam
- repo-backed source truth
- the imports-area source read
- separation between source truth and downstream apply behavior

#### Does Not Own

- final loader behavior
- arbitrary folder browsing
- external-source widening

#### Current Live Read

There is not yet one shipped curated-source seam for `Catalog`.

That means this phase should decide:
- where repo-backed catalog entries live
- how imports-area entries are represented for reuse
- how the shell consumes catalog data without becoming a raw filesystem browser

#### First Pass Decisions

- the source seam should stay curated and explicit
- the source seam should carry both repo-backed baseline items and imports-area entries honestly
- downstream apply behavior should not be buried inside manifest reads
- the first pass should still read as a `Generation 1` curated library, not a filesystem picker

### Phase 7 Implementation Spec
#### Exact First Code Cut

1. Add one explicit catalog-source or manifest owner.
2. Define how repo-backed entries are authored into that source.
3. Define how imports-area entries are surfaced through that source after import intake.
4. Keep the shell consuming this source instead of raw folder walking.
5. Keep downstream apply behavior out of the source read itself.

#### Likely Files

- likely new catalog manifest or source module under `src/app/catalog/` or `src/app/workspace/catalog/`
- likely lightweight authoring data file for the first curated entries
- focused tests for source normalization if the repo already exercises comparable data-source seams

#### No-Widening Rule

- do not widen into external links or archives here
- do not widen into import-pipeline behavior here
- do not hide action behavior inside the manifest source

#### Implementation Risks

- replacing one ad hoc folder read with another ad hoc local parsing rule
- treating imports-area entries as if `Catalog` owns the import pipeline
- over-designing a giant source system before the first curated baseline exists

#### Checklist

- [ ] define one explicit catalog-source seam
- [ ] author repo-backed entries through that seam
- [ ] define the imports-area source read through that seam
- [ ] keep the shell off raw folder walking
- [ ] keep downstream apply behavior separate from the source read

#### Verification Shape

Minimum verification for this phase should cover:

- the repo has one honest source seam for baseline catalog items
- the shell can consume item data without inventing local parsing rules
- imports-area entries can be represented through the same curated source contract

#### Done Shape

`Phase 7` is done when:

- the repo has one honest source seam for catalog items
- later UI work can consume item data without inventing local parsing rules

## [ ] `Catalog-1` - `Phase 8 - First Catalog Shell Regions`

### Phase 8 Summary
#### Purpose

Lock the first visible browse surface so the first runtime pass does not collapse categories, grid, item page, imports, actions, and previews into one improvised component.

#### Owns

- the first card-grid shell contract
- the no-auto-preview rule
- the item-page-as-decision-surface rule
- the first explicit shell regions

#### Does Not Own

- final family-specific loaders
- real reference-family content
- final search scale-up

#### Current Live Read

The current `Catalog-1` family read already expects the first visible shell to include:
- categories or filters
- a lightweight card grid
- an `Imports` area or equivalent baseline section
- an item page whose primary responsibilities are preview, description, and honest action labeling
- no auto-loaded previews

#### First Pass Decisions

- the first shell should be card-grid based, not list-only
- previews should remain user-triggered, not auto-loaded on grid render
- selecting an item should let the user reach an item page that becomes the main decision surface
- categories, grid, item page, and action area should be explicit regions instead of being improvised inside one render function

### Phase 8 Implementation Spec
#### Exact First Code Cut

1. Define the first shell regions for:
   - categories or filters
   - lightweight card grid
   - item page or selected-item decision surface
   - explicit action area
   - imports-area entry point or region
2. Lock the no-auto-preview rule in the shell contract.
3. Lock the item-page responsibilities in the shell contract.
4. Keep the shell browse-first and type-honest.

#### Likely Files

- `src/app/workspace/CatalogSurface.tsx`
- likely extracted shell-region components under a new catalog UI folder
- associated shell tests once the first visible contract is rendered

#### No-Widening Rule

- do not widen into real family loaders in this phase
- do not let the first shell auto-preview every item
- do not let the selected-item decision surface disappear into a generic side panel without explicit contract language

#### Implementation Risks

- turning the first shell into one overloaded component with no stable region boundaries
- leaving the item page implied instead of explicit
- letting preview behavior drift into auto-load because the shell contract was not clear enough

#### Checklist

- [ ] define categories or filters as an explicit shell region
- [ ] define the lightweight card grid as an explicit shell region
- [ ] define the item page as the main decision surface for a selected entry
- [ ] define the honest action area as an explicit shell region
- [ ] lock the no-auto-preview rule
- [ ] include the imports-area shell read

#### Verification Shape

Minimum verification for this phase should cover:

- the shell regions are explicit enough to implement without reopening scope questions
- the shell contract clearly says previews are not auto-loaded
- the selected entry can be reasoned about through an item-page decision surface

#### Done Shape

`Phase 8` is done when:

- the shell layout is explicit enough for implementation without reopening UI-scope questions
- the card-grid, item-page, imports, and no-auto-preview baseline is locked

## [ ] `Catalog-1` - `Phase 9 - Shell File Boundaries And Placeholder Wiring`

### Phase 9 Summary
#### Purpose

Keep the first shell implementation clean by defining how the shell should be broken into focused files before real asset-family behavior arrives.

#### Owns

- clean file boundaries for the first shell
- placeholder data wiring against the contract and source seam
- the first explicit imports-area shell owner

#### Does Not Own

- final real family content
- loader runtime
- search scale-up

#### Current Live Read

Once `CatalogSurface` exists and the shell regions are defined, the next risk is file sprawl:
- too much shell logic staying in one surface component
- placeholder data bypassing the new contract
- imports-area concerns getting mixed into unrelated shell branches

#### First Pass Decisions

- `CatalogSurface` should remain a coordinator, not an overloaded all-in-one shell
- placeholder data can be used to prove the shell contract only if it still flows through the contract and source seam
- imports-area UI should have a dedicated shell owner instead of being mixed into generic family-grid logic

### Phase 9 Implementation Spec
#### Exact First Code Cut

1. Decide which shell concerns stay in `CatalogSurface` versus extracted region components.
2. Wire placeholder baseline data through the new catalog-item contract and source seam.
3. Add one explicit imports-area shell owner or region component.
4. Stop before any real family-specific load behavior is added.

#### Likely Files

- `src/app/workspace/CatalogSurface.tsx`
- likely extracted shell-region files under a new catalog UI folder
- catalog contract and source files from earlier phases

#### No-Widening Rule

- do not bypass the contract or manifest source with local fake objects
- do not add real family loaders in this phase
- do not let imports-area behavior dissolve into generic ad hoc shell logic

#### Implementation Risks

- placeholder wiring becoming permanent local state instead of flowing through the real contract
- `CatalogSurface` becoming the next overloaded workspace component
- importing too much future family behavior just to prove the shell layout

#### Checklist

- [ ] define clean file boundaries for the first shell
- [ ] wire placeholder data through the real contract and source seam
- [ ] add one explicit imports-area shell owner or region
- [ ] keep `CatalogSurface` as a coordinator instead of an overloaded shell

#### Verification Shape

Minimum verification for this phase should cover:

- the first shell can ship through focused files instead of one overloaded component
- placeholder data flows through the intended contract and source seam
- imports-area UI has an explicit place in the shell structure

#### Done Shape

`Phase 9` is done when:

- the first shell can ship through focused files instead of one overloaded workspace component
- the imports-area baseline and placeholder shell proof are both structurally honest

## [ ] `Catalog-1` - `Phase 10 - Preview And Loader Boundary By Asset Type`

### Phase 10 Summary
#### Purpose

Lock the first honest preview-versus-commit and asset-type loader split so references and `HDRIs` do not pretend to share one fake universal apply path.

#### Owns

- temporary preview versus explicit commit contract
- multiple temporary preview allowance by contract
- reference loading versus `HDRI` apply separation
- honest action-language boundaries

#### Does Not Own

- final family-specific reference loaders
- final `HDRI` runtime
- project recall after load

#### Current Live Read

The current foundation read now needs to explicitly cover:
- `Load Preview` is temporary
- `Add To Project` is the explicit commit action
- multiple temporary previews may remain open by contract even if later implementation details still vary
- `HDRI` apply behavior should stay separate from geometry-reference loading

#### First Pass Decisions

- multiple temporary previews should be locked as allowed behavior in the contract, not left as vague future polish
- `Load Preview` and `Add To Project` should not be ambiguous actions
- `HDRI` apply should stay a separate loader category even though final `Catalog-3` runtime comes later

### Phase 10 Implementation Spec
#### Exact First Code Cut

1. Define the file-boundary direction for:
   - temporary preview handling
   - explicit commit handling
   - reference-style load adapters
   - viewer or environment apply adapters
2. Lock the rule that multiple temporary previews are allowed by the foundation contract.
3. Keep actual heavy family-specific behavior deferred while making the split explicit enough for later implementation.

#### Likely Files

- likely catalog action or adapter files under `src/app/catalog/` or `src/app/workspace/catalog/`
- shell action wiring files
- focused tests around action-kind or adapter routing once the seams exist

#### No-Widening Rule

- do not implement the full real reference-family or `HDRI` runtime here
- do not collapse temporary preview and explicit commit back into one universal action
- do not bury viewer ownership inside reference-load helpers

#### Implementation Risks

- postponing the split too long and letting later families guess at action meaning
- treating multiple temporary previews as optional shell polish instead of baseline contract truth
- rebuilding hidden ownership drift by keeping actions vague

#### Checklist

- [ ] lock `Load Preview` as temporary state
- [ ] lock `Add To Project` as the explicit commit action
- [ ] lock multiple temporary previews as allowed baseline behavior
- [ ] separate reference loading from `HDRI` environment apply
- [ ] define explicit file-boundary direction for the action adapters

#### Verification Shape

Minimum verification for this phase should cover:

- the action language is explicit enough that preview and commit are not ambiguous
- the loader categories are explicit enough that later `Catalog-2` and `Catalog-3` do not have to reopen the same split
- the contract allows multiple temporary previews without implying hidden commit behavior

#### Done Shape

`Phase 10` is done when:

- the first asset-type loader boundary is explicit
- the preview-versus-commit contract is explicit
- later catalog-family widening can build on real load categories instead of reopening this split

## [ ] `Catalog-1` - `Phase 11 - Downstream Ownership Proof`

### Phase 11 Summary
#### Purpose

Prove that loaded results do not remain catalog-local after the user commits them.

#### Owns

- downstream ownership proof for committed reference results
- downstream ownership proof for viewer or environment results
- import-versus-catalog boundary proof

#### Does Not Own

- final project recall semantics
- final `Catalog-2` and `Catalog-3` family runtime
- external-source widening

#### Current Live Read

The key architectural risk is still ownership drift:
- `Catalog` could accidentally become the hidden owner after commit
- imports-area reuse could accidentally blur into import-pipeline ownership
- `HDRI` behavior could accidentally collapse into geometry-reference thinking

#### First Pass Decisions

- the foundation phase should finish by proving the owner split explicitly
- that proof should cover:
  - Browser or project truth for committed reference content
  - viewer or environment truth for `HDRI`-style results
  - imports reuse staying separate from the import pipeline

### Phase 11 Implementation Spec
#### Exact First Code Cut

1. Define the minimum ownership proof for committed reference content.
2. Define the minimum ownership proof for viewer or environment results.
3. Define the minimum ownership proof that imports-area reuse does not move import ownership into `Catalog`.
4. Add focused proof or tests at the first honest owner seams once the foundation actions exist.

#### Likely Files

- likely Browser or project-content handoff owners
- likely viewer or environment handoff owners
- focused tests at the adapter or owner seams once they exist
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not widen into final recall or rebind semantics here
- do not widen into later family-specific runtime just to prove ownership
- do not let `Catalog` become the only place that knows a committed item exists

#### Implementation Risks

- calling ownership “obvious” and leaving the final proof implicit
- proving only the reference path while leaving imports or viewer ownership blurry
- letting the foundation doc end before the most important architectural split is actually explicit

#### Checklist

- [ ] prove committed reference results hand off to Browser or project truth
- [ ] prove viewer or environment results hand off to the correct owner
- [ ] prove imports-area reuse stays separate from the import pipeline
- [ ] keep `Catalog` from becoming the hidden runtime owner after commit

#### Verification Shape

Minimum verification for this phase should cover:

- the owner split is explicit and testable
- a committed reference result does not stay catalog-local
- a viewer or environment result does not masquerade as project geometry content
- imports-area reuse does not redefine the import pipeline owner

#### Done Shape

`Phase 11` is done when:

- the owner split is explicit and testable
- later `Catalog-2` and `Catalog-3` can widen without turning `Catalog` into a hidden runtime owner
