# [ ] Catalog-1 - Workspace Foundation And Catalog Contract

## Header

### Doc History
8. 2026-04-15 22:59:27: Tightened `Catalog-1 / Phase 1 - Surface Kind And Catalog Registration` into an implementation-ready slice by grounding it in the live `workspaceShellTypes.ts` and `workspaceSurfaceCatalog.ts` seams, locking the exact first code cut around `catalog` kind registration plus generated-id support, and adding phase-specific file targets, risks, checklist items, verification shape, and done shape
7. 2026-04-15 22:11:59: Reworked the internal `Catalog-1` ladder again into a finer-grained ten-phase sequence so Codex can execute the foundation one narrow step at a time, separating surface-kind registration, tiled switch proof, float parity, persistence or popup decisions, item contract, manifest seam, shell regions, shell wiring, loader boundaries, and downstream ownership proof instead of bundling those seams into broader mixed phases
6. 2026-04-15 22:11:00: Reworked the internal `Catalog-1` ladder into a straight `Phase 1` through `Phase 6` sequence by renumbering the earlier `1A / 1B` onboarding split and breaking the old combined loader-boundary or ownership section into separate `Phase 5` and `Phase 6` sections so the foundation lane now reads as one continuous six-step implementation ladder
5. 2026-04-15 22:06:23: Split the old broad `Catalog-1 / Phase 1` into `Phase 1A - Tiled Workspace Mode Adoption` and `Phase 1B - Windowed Host-Mode Parity And Persistence`, keeping the later internal ladder cleanly numbered as `Phase 2` through `Phase 4` while separating the split-and-switch workspace-mode proof from the floating or persistence follow-through
4. 2026-04-15 22:03:14: Tightened `Catalog-1 / Phase 1` so the workspace-onboarding proof is now explicitly framed as a real workspace-mode adoption: the user should be able to split a `modelViewer` pane, keep the original pane as `modelViewer`, and switch the new non-primary pane to `Catalog` through the shared slot type-picker seam
3. 2026-04-15 21:57:57: Tightened `Catalog-1 / Phase 1` so floating-window support is explicit first-pass scope, locking that `Catalog` must participate in the shared workspace float and redock host-mode seam during the initial workspace-surface onboarding cut instead of leaving that behavior implied
2. 2026-04-15 21:23:37: Reworked this `Catalog-1` doc into four internal top-level `##` phase sections so the foundation lane can execute as smaller Codex-sized steps for workspace onboarding, item-contract lock, first shell definition, and loader-boundary proof instead of remaining one broad setup block
1. 2026-04-15 20:24:35: Added this first standalone `Catalog-1` phase doc to define the foundation cut for a real `Catalog` workspace, locking the initial workspace-surface onboarding, curated manifest contract, visible shell shape, and clean loader/action boundaries before later hook, shoe, footpad, and HDRI families widen the implementation

### Purpose

This phase defines the first honest foundation slice for the `Catalog` workspace in ParaHook.

Use it to answer:
- what must exist before `Catalog` can be a real workspace instead of only an idea
- what the first catalog data contract should look like
- what the first visible workspace shell should contain
- how to keep future catalog implementation clean instead of bloating existing shell or Browser files
- what should count as done for the first `Catalog` setup cut

## Body

### Goal

Create the first clean foundation for `Catalog` as a real workspace family, with one explicit item-contract seam and one visible workspace shell direction, so later catalog families can ship through new focused files instead of inflating existing Browser, viewer, or shell files with special-case logic.

### Main Risks

The main risks in this phase are:

- treating `Catalog` as a quick one-off shell and forcing later cleanup
- burying the catalog item contract inside a large existing workspace or Browser file
- pretending reference assets and HDRIs can share one fake universal apply path
- making loaded catalog results stay catalog-local instead of becoming explicit downstream truth
- over-building a giant catalog system before the first honest workspace foundation exists

Healthy rule:
- `Catalog` owns browse and choose
- downstream systems own the loaded result
- the first pass should create small explicit seams instead of one overloaded setup file

### Clean-File Rule

This foundation phase exists specifically to keep later `Catalog` work clean.

The first implementation cut should prefer adding new focused seams such as:
- a workspace-surface registration entry for `Catalog`
- a catalog manifest/catalog item contract module
- a dedicated catalog workspace shell component
- later asset-family loader/apply helpers

Avoid:
- burying catalog manifest parsing inside a large existing workspace host
- burying catalog UI inside an unrelated Browser or AppShell component
- mixing geometry-reference and HDRI apply logic into one fake universal loader file

Important rule:
- if a later implementation choice would make `Catalog` depend on one overloaded existing file, stop and extract the smaller focused seam first

### Phase Sections

## [ ] Phase 1 - Surface Kind And Catalog Registration

### info
Purpose:
- add `Catalog` as a first-class workspace surface kind before any UI, manifest, or loader work begins

Main work:
- add `catalog` to `WorkspaceSurfaceKind`
- add generated-id support and any default surface helpers
- register `catalog` in `workspaceSurfaceCatalog.ts` with honest split and host-mode support metadata

Likely files:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspaceSurfaceCatalog.ts`

Done shape:
- the workspace model recognizes `catalog` as a real hosted surface kind
- later phases can render and switch to `Catalog` without inventing local exceptions

### Code-Backed Read

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

The main implication:
- `Phase 1` does not need any visible shell yet
- it needs one truthful registration pass so later phases can rely on shared workspace truth instead of sprinkling `catalog` exceptions around UI files

### First Pass Decisions

- `catalog` should enter as an optional workspace surface, not as a core surface.
- `catalog` should get its own explicit generated slot-instance prefix instead of falling through the `spaghettiEditor` fallback branch.
- `catalog` should be marked as participating in split and persistence from the start, because later tiled and restore phases should not need to reopen metadata truth.
- `catalog` should use plain coordination in this phase.
- no render registry or type-picker widening belongs in this phase yet; that starts in `Phase 2`.

### Exact First Code Cut

The implementation-ready first cut is:

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

### Likely Files

- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspaceSurfaceCatalog.ts`
- focused type or store tests that already exercise workspace surface parsing or generated surface ids

### Implementation Risks

The most likely risks in this phase are:

- forgetting the generated-id branch and silently inheriting the `spaghetti-${slotId}` fallback
- widening the surface union without widening the optional-surface helper types
- adding `catalog` metadata in UI files before the canonical surface catalog is updated
- overreaching into slot switching or rendering work that belongs in `Phase 2`

Healthy constraint:
- if `catalog` cannot be represented cleanly by the current union plus metadata catalog, document that gap explicitly, but do not silently widen `Phase 1` into rendering or host-mode work

### Checklist

- [ ] Add `catalog` to `WorkspaceSurfaceKind`
- [ ] Add explicit generated slot-instance id support for `catalog`
- [ ] Add `catalog` to the surface render-family union
- [ ] Add one canonical `catalog` metadata entry to `workspaceSurfaceCatalogEntries`
- [ ] Widen the optional-surface helper type to include `catalog`
- [ ] Keep render registry, slot switching, and host-mode work deferred to later phases

### Verification Shape

Minimum verification for this phase should cover:

- `catalog` can be represented by the canonical workspace kind union without type errors
- `createWorkspaceSurfaceInstanceIdForSlot('catalog', slotId)` produces a `catalog-...` id instead of falling through to another surface prefix
- `parseWorkspaceSurfaceKind('catalog')` resolves cleanly through the catalog metadata seam
- `isWorkspaceSurfaceOptional('catalog')` treats `catalog` as an optional surface
- `workspaceSurfaceSupportsSplit('catalog')` and the related support helpers reflect the intended metadata truth

### Done Shape

`Phase 1` is done when:

- the canonical workspace type system knows `catalog`
- the canonical workspace metadata catalog knows `catalog`
- generated slot-instance ids for `catalog` are explicit and deterministic
- later phases can build slot switching and shell work on top of shared workspace truth instead of local exceptions

## [ ] Phase 2 - Tiled Slot Switching And First CatalogSurface

### info
Purpose:
- prove the first real workspace-mode user flow: split a `modelViewer` and switch the new non-primary pane to `Catalog`

Main work:
- add one minimal `CatalogSurface`
- register it in `ViewportSurfaceRegistry.tsx`
- expose `Catalog` in the non-primary slot type picker
- keep the protected primary slot `modelViewer`-only

Likely files:
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`

Done shape:
- the user can keep the model visible in one pane and browse `Catalog` in a sibling pane through the normal split-and-switch flow

## [ ] Phase 3 - Tiled Behavior Regression Proof

### info
Purpose:
- verify the new tiled `Catalog` surface behaves like the other hosted non-primary surfaces before host-mode widening begins

Main work:
- verify split, switch, and retained-surface reuse for `catalog`
- add focused tests around tiled switching behavior
- confirm the new surface does not break existing non-primary surface switching

Likely files:
- `src/app/workspace/useWorkspaceStore.ts`
- existing workspace tests around slot switching and retained surfaces

Done shape:
- the tiled `Catalog` path is proven stable enough to widen into floating behavior next

## [ ] Phase 4 - Float And Redock Host-Mode Parity

### info
Purpose:
- make `Catalog` behave like the other optional hosted surfaces in the shared floating-window lifecycle

Main work:
- verify `Catalog` can float
- verify `Catalog` can redock
- keep this on the shared host-mode path instead of a catalog-specific shell

Likely files:
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`

Done shape:
- `Catalog` participates in the same float and redock lifecycle as the other optional workspace surfaces

## [ ] Phase 5 - Persistence And Popup Decision

### info
Purpose:
- finish the workspace-hosting foundation by making persistence explicit and deciding whether popup support belongs in this lane

Main work:
- verify workspace layout persistence can serialize and restore `catalog`
- decide explicitly whether popup-local or popout support lands here or stays deferred
- widen `PopupWorkspaceShell.tsx` only if the same-cut popup decision is `yes`

Likely files:
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/PopupWorkspaceShell.tsx`

Done shape:
- restore behavior is honest
- popup support is either implemented cleanly or explicitly deferred instead of being left vague

## [ ] Phase 6 - Catalog Item Contract

### info
Purpose:
- lock one explicit curated item shape before manifest reads or shell rendering start depending on ad hoc filename logic

Main work:
- define the first catalog-item fields:
  - stable item id
  - label
  - family/category
  - tags
  - description
  - preview path
  - source path
  - asset type
  - action kind
- keep the contract generic enough for both reference assets and HDRIs

Done shape:
- the first shared item contract is explicit
- later phases can target one stable item shape

## [ ] Phase 7 - Manifest Source Seam

### info
Purpose:
- define where curated catalog items come from so the first runtime shell does not parse raw folders directly

Main work:
- define the first manifest or catalog-source seam
- keep the source explicit and curated
- keep downstream apply behavior out of the manifest read itself

Done shape:
- the repo has one honest source seam for catalog items
- later UI work can consume item data without inventing local parsing rules

## [ ] Phase 8 - First Catalog Shell Regions

### info
Purpose:
- lock the first visible browse surface so the first runtime pass does not collapse categories, details, actions, and previews into one improvised component

Main work:
- define the first shell regions for:
  - category/filter navigation
  - asset list/grid
  - details/preview
  - explicit action area
- keep the shell browse-first and type-honest

Done shape:
- the shell layout is explicit enough for implementation without reopening UI-scope questions

## [ ] Phase 9 - Shell File Boundaries And Placeholder Wiring

### info
Purpose:
- keep the first shell implementation clean by defining how the shell should be broken into focused files before real asset-family behavior arrives

Main work:
- define the clean file-boundary direction for the catalog shell
- decide what can stay in `CatalogSurface` versus what should extract into smaller regions
- allow placeholder data wiring against the contract and manifest seam without real loader behavior yet

Done shape:
- the first shell can ship through focused files instead of one overloaded workspace component

## [ ] Phase 10 - Loader Boundary By Asset Type

### info
Purpose:
- lock the first honest loader split so references and HDRIs do not pretend to share one fake universal apply path

Main work:
- keep geometry/reference loading separate from HDRI/environment application
- define the file-boundary direction for:
  - asset-type-specific load/apply adapters
  - Browser/project-content handoff
  - viewer/environment handoff

Done shape:
- the first asset-type loader boundary is explicit
- later catalog-family widening can build on real load categories instead of reopening this split

## [ ] Phase 11 - Downstream Ownership Proof

### info
Purpose:
- prove that loaded results do not remain catalog-local after the user commits them

Main work:
- lock the rule that `Catalog` browses and chooses, but downstream systems own loaded results
- define the minimum ownership proof for:
  - Browser/project-content handoff
  - viewer/environment handoff

Done shape:
- the owner split is explicit and testable
- later `Catalog-2` and `Catalog-3` can widen without turning `Catalog` into a hidden runtime owner

## [ ] Phase Checklist

- [ ] `Phase 1 - Surface Kind And Catalog Registration`
- [ ] `Phase 2 - Tiled Slot Switching And First CatalogSurface`
- [ ] `Phase 3 - Tiled Behavior Regression Proof`
- [ ] `Phase 4 - Float And Redock Host-Mode Parity`
- [ ] `Phase 5 - Persistence And Popup Decision`
- [ ] `Phase 6 - Catalog Item Contract`
- [ ] `Phase 7 - Manifest Source Seam`
- [ ] `Phase 8 - First Catalog Shell Regions`
- [ ] `Phase 9 - Shell File Boundaries And Placeholder Wiring`
- [ ] `Phase 10 - Loader Boundary By Asset Type`
- [ ] `Phase 11 - Downstream Ownership Proof`
