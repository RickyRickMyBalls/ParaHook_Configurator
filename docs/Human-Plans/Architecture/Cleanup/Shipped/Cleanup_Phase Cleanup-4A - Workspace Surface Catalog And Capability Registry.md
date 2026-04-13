# Cleanup Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry

## Doc Header

### Doc History
11. 2026-04-12 22:53:27: Closed out this standalone `Cleanup 4A` phase record after all four internal phases shipped, marked the top-level lane complete, and prepared the doc to move from `Cleanup/Future/` into `Cleanup/Shipped/` so the family ladder now points at a finished workspace-surface catalog cleanup record instead of an in-progress future plan
10. 2026-04-12 22:49:04: Completed `Phase 4 - Repoint Repeated Surface Policy To The Catalog` as a focused code-and-verification pass by adding the real `src/app/workspace/workspaceSurfaceCatalog.ts` module, repointing the main label, render, persistence, action, and selector seams to it, and verifying with `cmd /c npm.cmd run build` while intentionally keeping consumer-specific formatting and the `Radio` taxonomy/scope question outside the catalog
9. 2026-04-12 22:43:45: Tightened `Phase 4 - Repoint Repeated Surface Policy To The Catalog` into an implementation-ready code-and-verification pass grounded in the locked surface-catalog contract, narrowing the next step to introducing the catalog in source and repointing the highest-value render, label, persistence, action, and selector seams to it without widening into a broader workspace redesign or a `Radio` scope change
8. 2026-04-12 22:42:16: Completed `Phase 3 - Define The Canonical Surface Catalog Contract` as a docs-and-verification pass by adding one explicit bounded catalog shape for current workspace surfaces, separating catalog truth from consumer-specific view logic, defining the future-surface onboarding rule, and carrying the `Radio` background-runtime mismatch forward without forcing it into the current `WorkspaceSurfaceKind` set
7. 2026-04-12 22:40:19: Tightened `Phase 3 - Define The Canonical Surface Catalog Contract` into an implementation-ready docs-and-verification pass grounded in the completed taxonomy baseline and capability-drift inventory, narrowing the next step to locking one explicit workspace-surface catalog shape, separating catalog truth from consumer-specific view logic, and carrying the `Radio` background-runtime mismatch forward without forcing it into the current `WorkspaceSurfaceKind` set
6. 2026-04-12 22:37:26: Completed `Phase 2 - Audit Capability Drift Across Current Surface Branches` as a docs-and-verification pass by adding one explicit capability-drift inventory across render routing, action helpers, persistence seams, labels/options, and host selectors, separating likely future catalog inputs from consumer-specific view logic while keeping the final registry shape for the next phase
5. 2026-04-12 22:34:57: Tightened `Phase 2 - Audit Capability Drift Across Current Surface Branches` into an implementation-ready docs-and-verification pass grounded in the live surface-policy duplication across `ViewportSurfaceRegistry.tsx`, `workspaceSurfaceActions.ts`, `workspacePersistence.ts`, `workspaceViewportLabels.ts`, and `useAppShellWorkspaceSelectors.ts`, so the next pass can produce one explicit capability-drift inventory against the locked taxonomy baseline
4. 2026-04-12 22:32:58: Completed `Phase 1 - Lock The Workspace Surface Taxonomy Baseline` as a docs-and-verification pass by adding one explicit classification baseline for current workspace surfaces, optional workspace surfaces, viewport-local tools, background runtimes, and non-workspace feature families, while making the `RadioRuntimeHost.tsx` mismatch explicit without prematurely forcing the later capability-catalog or product-scope decisions
3. 2026-04-12 22:24:40: Tightened `Phase 1 - Lock The Workspace Surface Taxonomy Baseline` into an implementation-ready docs-and-verification pass grounded in the live `WorkspaceSurfaceKind` union, popup-shell allowed kinds, viewport-label exclusions, and the `RadioRuntimeHost.tsx` mismatch so the next pass can lock the current workspace-surface classification buckets before capability-catalog work starts
2. 2026-04-12 22:21:41: Refreshed the `Cleanup 4A` prerequisite reference after `Cleanup 4 - Workspace Truth And AppShell Simplification` shipped, so this follow-on lane now points at the moved `Cleanup/Shipped/` phase record instead of the old future-path handoff
1. 2026-04-12 21:24: Created this standalone `Cleanup 4A` future phase doc to hold the workspace-surface catalog and capability-registry cleanup lane under the Cleanup family

### Purpose

This doc defines the `Cleanup 4A` follow-on phase for the `Cleanup` family.

Use it to answer:
- what workspace-surface taxonomy problem still remains after `Cleanup 4`
- how workspace surfaces should be cataloged without scattering policy across many `surfaceKind` branches
- what the likely cleanup ladder is for converging on one capability registry and onboarding rule

Do not use it for:
- deciding final optional-surface product scope for dashboard, notepad, or radio
- designing new workspace UX behavior
- replacing the broader `Workspace-Modes/` architecture family

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface

- `../Cleanup-Vision.md`
  - repo-shape north star and workspace-surface framing

- `../Canonical-Ownership-Targets.md`
  - workspace ownership targets and scope hotspots

- `../Shipped/Cleanup_Phase Cleanup-4 - Workspace Truth And AppShell Simplification.md`
  - prerequisite top-level workspace owner cleanup

- `../../Workspace-Modes/Workspace-Modes-Index.md`
  - broader workspace-family architecture direction

## Doc Body

## [x] Cleanup 4A - Workspace Surface Catalog And Capability Registry

### Header

Purpose:
- make workspace-surface capabilities and taxonomy explicit in one place so surface policy stops being inferred from repeated `surfaceKind` branches spread across workspace render, actions, persistence, labels, and host selectors

Owns:
- workspace-surface capability catalog direction
- workspace-surface taxonomy cleanup
- future surface onboarding rules
- reducing duplicated workspace-surface policy branches

Does not own:
- top-level workspace layout truth
- final optional-surface keep/retire decisions
- viewer-local tool or command-family design

### Why This Phase Exists

The repo already has one real seam for workspace surfaces:
- `src/app/workspace/workspaceShellTypes.ts`

But the actual surface-policy story is still spread around:
- render routing in `ViewportSurfaceRegistry.tsx`
- surface action behavior in `workspaceSurfaceActions.ts`
- persistence allow-lists in `workspacePersistence.ts`
- labels and menu affordances in `workspaceViewportLabels.ts` and `ViewportFrame.tsx`
- host assumptions in `useAppShellWorkspaceSelectors.ts` and related shell helpers

That spread is manageable with a small surface set.

It becomes riskier as ParaHook grows more workspace candidates such as:
- Browser
- Console
- Spaghetti Editor
- Model Viewport
- Dashboard
- Notepad
- later Export, Layers, Debug Inspector, comparison surfaces, and others

There is also one especially important mismatch already visible:
- `Radio` behaves like a real product/runtime surface through `RadioRuntimeHost.tsx`
- but it is not a `WorkspaceSurfaceKind`

This phase exists so cleanup can answer those questions deliberately instead of letting them stay encoded in one-off branches.

### Scope

This phase covers:
- current workspace-surface taxonomy
- capability rules for current workspace surfaces
- where surface policy should be stored
- new-surface onboarding rules

This phase does not cover:
- adding new workspace families
- final keep/optional/retire calls for secondary surfaces
- turning viewport-local tools into workspace surfaces by default

### Current Read

The live repo already contains a partially centralized surface model, but not a complete one.

- `src/app/workspace/workspaceShellTypes.ts`
  - already defines `WorkspaceSurfaceKind`
  - already carries core workspace placement types
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - still hardcodes render behavior per surface kind
- `src/app/workspace/workspaceSurfaceActions.ts`
  - still hardcodes action behavior and compatibility seams per surface kind
- `src/app/workspace/workspacePersistence.ts`
  - still hardcodes which surface kinds are persisted and restored
- `src/app/workspace/workspaceViewportLabels.ts`
  - still hardcodes surface labels and naming rules
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
  - still contains repeated detached-surface and slot-count logic by surface kind

Current taxonomy ambiguity also remains around distinctions such as:
- real workspace surface
- optional workspace surface
- viewport-local tool
- background runtime
- non-workspace feature family

### Locked Direction

- `WorkspaceSurfaceKind` should stay the canonical identity seam for real workspace-hosted surfaces
- surface capabilities should be answerable from one explicit catalog instead of from repeated ad hoc branches
- the catalog should distinguish capability from scope
  - capability example: supports `slotted`, `floating`, or `popout`
  - scope example: core, optional, background-runtime, or not a workspace surface
- future surfaces should have to pass one onboarding checklist before they become first-class workspace kinds
- viewport-local tools and background runtimes should not quietly become workspace kinds just because they need UI

### Phase Ladder

## [x] Phase 1 - Lock The Workspace Surface Taxonomy Baseline

### Header

#### Purpose:
- define the current classification buckets that later `Cleanup 4A` phases should use when talking about workspace-related surfaces, so capability work starts from one explicit taxonomy baseline instead of from scattered `surfaceKind` assumptions

#### Current read:
- the live repo already has one canonical identity seam for real workspace surfaces:
  - `src/app/workspace/workspaceShellTypes.ts`
  - current `WorkspaceSurfaceKind` values are:
    - `modelViewer`
    - `browser`
    - `console`
    - `spaghettiEditor`
    - `notepad`
    - `dashboard`
- nearby seams already show that taxonomy and capability are not the same thing:
  - `PopupWorkspaceShell.tsx`
    - only allows a smaller popup subset of kinds
  - `workspaceViewportLabels.ts`
    - excludes `dashboard` and `notepad` from console-facing viewport options
  - `useAppShellWorkspaceSelectors.ts`
    - contains repeated kind-grouping logic for detached and slotted surfaces
  - `RadioRuntimeHost.tsx`
    - behaves like a real runtime surface but does not participate in `WorkspaceSurfaceKind`
- the remaining ambiguity is not yet the full capability registry
  - it is the classification baseline for what is:
    - a real workspace surface
    - an optional workspace surface
    - a viewport-local tool
    - a background runtime
    - a non-workspace feature family

#### Read:
- `Phase 1` should stay a docs-and-verification pass
- the right job here is to lock the current taxonomy buckets before `Phase 2` inventories duplicated capability policy
- this phase should not widen into catalog-contract design or implementation cleanup yet

#### Locked Phase 1 in-scope:
- restate the canonical current workspace-surface set from the live `WorkspaceSurfaceKind` seam
- classify the main nearby systems into explicit buckets such as:
  - real workspace surface
  - optional workspace surface
  - viewport-local tool
  - background runtime
  - non-workspace feature family
- name the most important current ambiguities without trying to solve all capability policy yet
- make the `Radio` mismatch explicit as a taxonomy input instead of leaving it as an unspoken exception

#### Locked Phase 1 out-of-scope:
- changing any runtime code
- deciding the final capability registry shape
- deciding final keep/retire product scope for dashboard, notepad, or radio
- moving viewport-local tools into the workspace-surface set
- reducing repeated policy branches in source files yet

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4 - Workspace Truth And AppShell Simplification.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry.md`

#### Strongest live repo seams for this pass:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/PopupWorkspaceShell.tsx`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
- `src/app/hosts/RadioRuntimeHost.tsx`
- `src/app/AppShell.tsx`

#### Initial live taxonomy anchors:
- real workspace surface identity seam:
  - `WorkspaceSurfaceKind` in `workspaceShellTypes.ts`
- smaller capability subsets already visible:
  - popup-shell available kinds in `PopupWorkspaceShell.tsx`
  - console-facing label/options exclusions in `workspaceViewportLabels.ts`
- adjacent non-surface or not-yet-surface seam:
  - `RadioRuntimeHost.tsx`
    - mounted in `AppShell.tsx`
    - runtime-present and product-visible
    - not a workspace-hosted surface kind

#### Preferred Phase 1 implementation shape:
- keep this as a docs-and-verification pass
- write one explicit taxonomy baseline inside this doc
- stop once later `Cleanup 4A` phases can cite one named classification baseline instead of re-arguing what counts as a workspace surface every time capability drift is reviewed

### Implementation spec:
1. Re-read the shipped `Cleanup 4` owner baseline so the taxonomy pass does not reopen layout ownership.
2. Re-scan the live workspace identity seam in:
   - `workspaceShellTypes.ts`
   - popup-shell kinds
   - viewport label and option filters
   - host selector kind-grouping
   - `RadioRuntimeHost.tsx`
3. Write one explicit taxonomy baseline that answers:
   - which current kinds are real workspace surfaces
   - which of those are core versus currently optional workspace surfaces
   - which nearby systems are viewport-local tools, background runtimes, or non-workspace feature families
   - which visible mismatches should be carried into later catalog work
4. Stop once `Phase 2` can audit duplicated capability policy against one stable taxonomy baseline instead of against broad surface-language drift.

#### Implementation stop rule:
- `Phase 1` is ready to implement once the next pass can cite one explicit workspace-surface classification baseline
- do not widen this into catalog-contract design or source cleanup just to make the phase feel larger

#### Checklist:
- [x] re-read the shipped `Cleanup 4` owner baseline and the `Cleanup 4A` framing
- [x] scan the live `WorkspaceSurfaceKind` seam and the most relevant nearby branch points
- [x] write one explicit taxonomy baseline for current workspace-related surface buckets
- [x] make the `Radio` mismatch explicit without forcing an immediate product-scope decision
- [x] stop before capability-registry design or code edits

#### Target output:
- one explicit workspace-surface taxonomy baseline for later `Cleanup 4A` phases

#### Done shape:
- later phases can distinguish taxonomy from capability work
- the family has one stable answer for what currently counts as a workspace surface versus an adjacent runtime or tool
- `Phase 2` can audit capability drift against one honest baseline instead of against scattered `surfaceKind` language

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry.md`

#### Verification:
- manually re-read:
  - `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
  - `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
  - `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4 - Workspace Truth And AppShell Simplification.md`
- manually confirm in the repo that:
  - `workspaceShellTypes.ts` defines the live `WorkspaceSurfaceKind` set
  - `PopupWorkspaceShell.tsx` already exposes a smaller allowed-kind subset
  - `workspaceViewportLabels.ts` already exposes capability/consumer-specific exclusions
  - `RadioRuntimeHost.tsx` remains mounted runtime behavior without being a `WorkspaceSurfaceKind`
- confirm the resulting phase wording locks only the taxonomy baseline and does not prematurely decide the later capability catalog contract

#### Workspace Surface Taxonomy Baseline

This is the locked classification baseline later `Cleanup 4A` phases should cite directly when deciding whether something is a real workspace surface, an optional workspace surface, a viewport-local tool, a background runtime, or not part of the workspace-surface set at all.

##### Real workspace surfaces

- `WorkspaceSurfaceKind` in `src/app/workspace/workspaceShellTypes.ts` is the canonical current identity seam for real workspace-hosted surfaces.
- The current real workspace surface set is:
  - `modelViewer`
  - `browser`
  - `console`
  - `spaghettiEditor`
  - `dashboard`
  - `notepad`

##### Core workspace surfaces

- current core workspace surfaces are:
  - `modelViewer`
  - `browser`
  - `console`
  - `spaghettiEditor`
- these are the surfaces the workspace model already treats as primary day-to-day workspace citizens across slotting, detached handling, and host coordination

##### Optional workspace surfaces

- current optional workspace surfaces are:
  - `dashboard`
  - `notepad`
- they are already real `WorkspaceSurfaceKind` values and already participate in workspace placement, but they should still be treated as optional-family surfaces rather than as proof that every product-visible tool must become a core workspace surface

##### Viewport-local tools and shell-local UI

- viewport-local chrome, labels, menus, and similar per-viewport controls are not workspace surfaces by themselves
- examples include:
  - viewport labels and option shaping in `workspaceViewportLabels.ts`
  - split menus, dock previews, and other host-local shell affordances around slots and surfaces
- these may target or describe workspace surfaces, but they are not separate `WorkspaceSurfaceKind` entries

##### Background runtimes

- a background runtime is product-visible runtime behavior that may remain active without being a workspace-hosted surface
- the clearest current example is `Radio`:
  - `src/app/hosts/RadioRuntimeHost.tsx` is mounted in `AppShell.tsx`
  - it behaves like a real product/runtime system
  - it is not currently a `WorkspaceSurfaceKind`
- this means `Radio` is currently classified as a background runtime, not as a real workspace surface
- later phases may decide that `Radio` should also gain an optional workspace surface identity, but this phase does not lock that outcome yet

##### Non-workspace feature families

- a non-workspace feature family may still be product-important without being a workspace surface
- examples include:
  - project content hierarchy in `useAppStore`
  - audio sampler and radio runtime state in `audioSamplerStore`
  - other app, worker, or viewer systems that provide behavior or data without participating in workspace slot placement

##### Boundary rule going forward

- if something participates in workspace slot identity, detached placement, and `WorkspaceSurfaceKind`, it is a real workspace surface
- if it is already a real workspace surface but not clearly a core day-to-day workspace pillar, treat it as an optional workspace surface until later scope work says otherwise
- if it is host-local UI, viewport-local chrome, or menu/label affordance around a surface, it is not a workspace surface
- if it is active runtime behavior without workspace-slot identity, treat it as a background runtime rather than silently promoting it into `WorkspaceSurfaceKind`
- later `Cleanup 4A` phases should treat the `Radio` seam as the main current taxonomy mismatch to carry into capability-catalog work

## [x] Phase 2 - Audit Capability Drift Across Current Surface Branches

### Header

#### Purpose:
- inventory where workspace-surface capability and policy are currently duplicated across render routing, action helpers, persistence seams, labels/options, and host selectors, so later `Cleanup 4A` phases can replace repeated `surfaceKind` branches from one honest drift map instead of from hunches

#### Current read:
- `Phase 1` now locks the taxonomy baseline:
  - real workspace surfaces
  - core versus optional workspace surfaces
  - viewport-local tools
  - background runtimes
- the next problem is not deciding what a workspace surface is
  - it is identifying where capability answers are currently repeated in code
- the strongest live duplication families are:
  - `src/app/workspace/ViewportSurfaceRegistry.tsx`
    - render routing by `surfaceKind`
  - `src/app/workspace/workspaceSurfaceActions.ts`
    - action and transition behavior by `surfaceKind`
  - `src/app/workspace/workspacePersistence.ts`
    - persistence parsing, allow-lists, and normalization by `surfaceKind`
  - `src/app/workspace/workspaceViewportLabels.ts`
    - labels, option lists, and consumer-specific exclusions by `surfaceKind`
  - `src/app/hosts/useAppShellWorkspaceSelectors.ts`
    - selector grouping, slot counting, and detached-surface filtering by `surfaceKind`
- the duplication is not all the same kind of policy
  - some branches answer render component mapping
  - some answer placement/host behavior
  - some answer persistence inclusion
  - some answer UI naming or menu inclusion
  - some answer grouped host queries

#### Read:
- `Phase 2` should stay a docs-and-verification pass
- the right job here is to write one capability-drift inventory, not to design the final catalog contract yet
- this phase should not move code or collapse branches prematurely

#### Locked Phase 2 in-scope:
- scan the main branch-heavy workspace-surface files against the locked taxonomy baseline
- inventory repeated capability answers such as:
  - render routing
  - supports slotted/floating/popout behavior
  - persistence participation
  - labeling and viewport-option inclusion
  - selector grouping and detached-surface filtering
- classify the drift by branch family so `Phase 3` can decide what the catalog contract actually needs to encode
- note the main mismatches and oddities, including places where optional surfaces are treated differently from core ones

#### Locked Phase 2 out-of-scope:
- changing source code
- deciding the final registry shape
- resolving final optional-surface scope
- promoting `Radio` into `WorkspaceSurfaceKind`
- removing repeated policy branches yet

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4 - Workspace Truth And AppShell Simplification.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry.md`

#### Strongest live repo seams for this pass:
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
- `src/app/workspace/workspaceShellTypes.ts`

#### Initial drift anchors:
- render mapping:
  - `ViewportSurfaceRegistry.tsx`
- action/transition policy:
  - `workspaceSurfaceActions.ts`
- persistence inclusion and normalization:
  - `workspacePersistence.ts`
- labels and consumer-specific options:
  - `workspaceViewportLabels.ts`
- grouped selectors and detached-surface queries:
  - `useAppShellWorkspaceSelectors.ts`

#### Preferred Phase 2 implementation shape:
- keep this as a docs-and-verification pass
- write one explicit capability-drift inventory inside this doc
- classify the drift by branch family rather than by file-size discomfort
- stop once `Phase 3` can define the catalog contract from a concrete inventory instead of from vague “many `surfaceKind` branches” language

### Implementation spec:
1. Re-read the `Phase 1` taxonomy baseline in this doc.
2. Re-scan the main live branch points in:
   - `ViewportSurfaceRegistry.tsx`
   - `workspaceSurfaceActions.ts`
   - `workspacePersistence.ts`
   - `workspaceViewportLabels.ts`
   - `useAppShellWorkspaceSelectors.ts`
3. Write one explicit capability-drift inventory that answers:
   - which capability answers are repeated
   - which files repeat them
   - which repeated answers look like true catalog inputs versus consumer-specific views
   - which mismatches should carry forward into `Phase 3`
4. Stop once the later contract-design phase can cite one stable drift inventory instead of resurveying the source files from scratch.

#### Implementation stop rule:
- `Phase 2` is ready to implement once the repo scan can produce one explicit capability-drift inventory tied to the locked taxonomy baseline
- do not widen this into source cleanup or final registry design just to make the phase feel larger

#### Checklist:
- [x] re-read the `Phase 1` taxonomy baseline
- [x] scan the main surface-policy branch files
- [x] write one explicit capability-drift inventory
- [x] separate likely catalog inputs from consumer-specific view logic
- [x] stop before contract design or code edits

#### Target output:
- one explicit workspace-surface capability-drift inventory for later `Cleanup 4A` phases

#### Done shape:
- later phases know exactly where capability policy is duplicated today
- `Phase 3` can define the catalog contract from a concrete inventory
- the family stops re-discovering the same `surfaceKind` branch clusters each time workspace-surface cleanup resumes

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry.md`

#### Verification:
- manually re-read the `Phase 1` taxonomy baseline in this doc
- manually confirm in the repo that:
  - `ViewportSurfaceRegistry.tsx` still answers render component mapping by `surfaceKind`
  - `workspaceSurfaceActions.ts` still answers behavior and transition paths by `surfaceKind`
  - `workspacePersistence.ts` still repeats the surface set in persistence parsing and normalization
  - `workspaceViewportLabels.ts` still answers labels and option inclusion with kind-specific exclusions
  - `useAppShellWorkspaceSelectors.ts` still groups slots and detached surfaces by hardcoded surface-kind filters
- confirm the resulting phase wording inventories the drift without prematurely deciding the final catalog contract or changing source

#### Workspace Surface Capability-Drift Inventory

This is the completed capability-drift inventory later `Cleanup 4A` phases should cite directly when deciding which repeated `surfaceKind` answers belong in the future catalog contract and which ones are still consumer-specific view logic.

##### Drift family 1: render routing

- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - maps each `WorkspaceSurfaceKind` to its render component or placeholder path
  - current repeated answers include:
    - `browser` -> `BrowserPanel`
    - `console` -> `ConsoleDock`
    - `spaghettiEditor` -> `SpaghettiPanel`
    - `dashboard` -> `DashboardSurface`
    - `notepad` -> `NotepadSurface`
    - fallback `modelViewer` placeholder branch
- read:
  - this is a strong catalog-input candidate for canonical render component mapping
  - the current viewer placeholder text is still a consumer/runtime detail, not a general surface-capability fact

##### Drift family 2: action and host-behavior policy

- `src/app/workspace/workspaceSurfaceActions.ts`
  - repeats surface-kind decisions for:
    - float behavior
    - popout behavior
    - redock/restore behavior
    - split-to-side behavior
    - root-split eligibility
    - compatibility fallbacks for browser, console, and spaghetti editor
- strongest repeated policy patterns:
  - browser gets special host-route and browser-shell handling
  - console gets docking/floating/popout coordination with console store state
  - spaghetti editor gets editor-viewport activation and window-mode coordination
  - model viewer, dashboard, and notepad each repeat simpler split/redock handling
  - only `browser`, `console`, and `spaghettiEditor` are eligible for some root-split paths
- read:
  - this file contains several likely future catalog inputs:
    - supports float/popout/split
    - needs external host coordination
    - special root-split eligibility
  - the exact store coordination side effects are implementation detail, not pure catalog data

##### Drift family 3: persistence inclusion and normalization

- `src/app/workspace/workspacePersistence.ts`
  - repeats the accepted workspace-surface set in several places:
    - viewport slot normalization
    - retained-surface-id normalization
    - generic surface-placement normalization
    - detached-surface normalization
  - also repeats default/fallback assumptions such as:
    - primary slot defaults toward `modelViewer`
    - non-primary fallback defaults toward `browser`
- read:
  - the accepted persisted surface set is a strong catalog-input candidate
  - the fallback choice for malformed or older data is persistence-specific view logic and may stay outside the general catalog contract

##### Drift family 4: labels and consumer-specific option shaping

- `src/app/workspace/workspaceViewportLabels.ts`
  - repeats surface-kind decisions for:
    - display labels
    - browser numbering behavior
    - viewport-option inclusion
    - console-specific option filtering
  - notable exclusions:
    - `dashboard` and `notepad` are filtered out of `ConsoleWorkspaceViewportOption`
    - `spaghettiEditor` can be optionally excluded from ordered viewport slots
- read:
  - canonical default label per surface kind is a strong catalog-input candidate
  - browser numbering behavior and consumer-specific exclusions are view logic layered on top of that catalog data

##### Drift family 5: selector grouping and detached-surface queries

- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
  - repeats grouped surface-kind filters for:
    - visible/slotted/detached spaghetti detection
    - browser and console slot counts
    - active detached browser/console lookup
    - detached model viewer floating/popout lookup
    - detached dashboard floating/popout lookup
    - detached notepad floating/popout lookup
    - split-menu target classification for console versus spaghetti editor
- read:
  - grouped surface queries are a strong signal that the later catalog may need reusable selector metadata or helper-driven grouping
  - the exact memoized selector outputs remain host-specific view logic, not catalog data by themselves

##### Likely future catalog inputs

- canonical surface id / kind
- default label per workspace surface kind
- render component mapping or render-family identity
- whether a surface supports:
  - slotted
  - floating
  - popout
  - split participation
- whether a surface participates in persistence
- whether a surface is core versus optional
- whether a surface has special host/runtime coordination requirements

##### Likely consumer-specific view logic, not pure catalog truth

- browser numbering in viewport labels
- console-only option filtering
- optional exclusion of spaghetti editor from some option lists
- persistence fallback defaults for malformed or older records
- exact AppShell selector memo shapes
- implementation details of console-store, browser-shell, or spaghetti-store side effects

##### Main mismatches to carry into `Phase 3`

- the accepted workspace-surface set is repeated in multiple files instead of being answered once
- capability answers such as float/popout/split eligibility are partly implied by action branches instead of being named explicitly
- optional surfaces (`dashboard`, `notepad`) are already real workspace surfaces, but some consumer-specific filters still treat them as special cases without one canonical capability story
- `modelViewer` still carries a render-path mismatch because the viewport registry currently falls back to a placeholder instead of a dedicated secondary viewer surface component path
- `Radio` remains outside this inventory as a background-runtime mismatch rather than a current `WorkspaceSurfaceKind`, which confirms it belongs beside the catalog discussion, not silently inside it

## [x] Phase 3 - Define The Canonical Surface Catalog Contract

### Header

#### Purpose:
- decide the shape of the one canonical workspace-surface catalog contract the workspace layer should depend on, so later cleanup can repoint repeated policy branches to one explicit source of truth instead of to scattered file-local `surfaceKind` logic

#### Current read:
- `Phase 1` now locks the taxonomy baseline:
  - which current kinds are real workspace surfaces
  - which are core versus optional
  - which nearby systems are viewport-local tools or background runtimes
- `Phase 2` now locks the drift inventory:
  - render mapping
  - action/host behavior
  - persistence inclusion
  - labels/options
  - selector grouping
- the next job is not code movement yet
  - it is deciding the minimum contract shape that can answer the repeated capability questions without absorbing consumer-specific view logic
- the strongest contract inputs already surfaced are:
  - canonical surface kind
  - default label
  - render-family or render-mapping identity
  - supports `slotted`
  - supports `floating`
  - supports `popout`
  - split participation
  - persistence participation
  - core versus optional classification
  - special host/runtime coordination notes

#### Read:
- `Phase 3` should stay a docs-and-verification pass
- the right job here is to lock the contract shape and its boundaries before any file repointing starts
- this phase should not yet create the source file or migrate call sites

#### Locked Phase 3 in-scope:
- define one explicit catalog contract shape for current real workspace surfaces
- distinguish catalog truth from consumer-specific view logic
- define what the contract must answer for:
  - render routing
  - capability checks
  - persistence participation
  - default labels
  - onboarding of future workspace kinds
- make explicit what happens with adjacent but not-currently-surface systems such as `Radio`

#### Locked Phase 3 out-of-scope:
- implementing the catalog in source
- repointing render, action, persistence, label, or selector files yet
- changing `WorkspaceSurfaceKind`
- making the final product-scope call for `dashboard`, `notepad`, or `radio`
- widening the contract to include every host-specific or menu-specific detail

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry.md`

#### Strongest live repo seams for this pass:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`

#### Initial contract anchors:
- canonical current identity seam:
  - `WorkspaceSurfaceKind`
- repeated default label seam:
  - `workspaceViewportLabels.ts`
- repeated render seam:
  - `ViewportSurfaceRegistry.tsx`
- repeated capability and host-behavior seam:
  - `workspaceSurfaceActions.ts`
- repeated persistence participation seam:
  - `workspacePersistence.ts`
- repeated grouping/filter seam:
  - `useAppShellWorkspaceSelectors.ts`

#### Preferred Phase 3 implementation shape:
- keep this as a docs-and-verification pass
- write one explicit catalog contract section inside this doc
- include:
  - required contract fields
  - what those fields mean
  - what stays outside the contract
  - how future surface onboarding should use the contract
- stop once `Phase 4` can repoint source files against one named contract instead of redesigning the contract mid-pass

### Implementation spec:
1. Re-read the `Phase 1` taxonomy baseline and the `Phase 2` capability-drift inventory in this doc.
2. Derive the minimum shared contract shape that covers the repeated capability answers without swallowing consumer-specific UI logic.
3. Write one explicit catalog contract section that answers:
   - which fields belong in the catalog
   - which repeated branch families those fields replace
   - which decisions stay outside the catalog
   - how future workspace surfaces should be added
   - how adjacent non-surface systems like `Radio` relate to, but do not automatically enter, the catalog
4. Stop once `Phase 4` can use that locked contract as the source target for repointing repeated policy branches.

#### Implementation stop rule:
- `Phase 3` is ready to implement once there is one explicit, bounded catalog contract later code passes can target directly
- do not widen this into source implementation or broad workspace redesign just to make the phase feel larger

#### Checklist:
- [x] re-read the `Phase 1` taxonomy baseline
- [x] re-read the `Phase 2` capability-drift inventory
- [x] write one explicit canonical surface-catalog contract shape
- [x] separate catalog truth from consumer-specific view logic
- [x] define a future-surface onboarding rule
- [x] stop before code edits or source repointing

#### Target output:
- one explicit canonical workspace-surface catalog contract for later `Cleanup 4A` phases

#### Done shape:
- later phases know exactly what the catalog must contain
- `Phase 4` can repoint repeated policy branches to one bounded contract
- the family stops re-deciding whether labels, selectors, host quirks, and capability flags all belong in the same data shape

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry.md`

#### Verification:
- manually re-read the `Phase 1` taxonomy baseline in this doc
- manually re-read the `Phase 2` capability-drift inventory in this doc
- manually confirm the resulting contract shape:
  - covers the repeated capability answers already seen in render/actions/persistence/labels/selectors
  - does not absorb browser numbering, console-only filtering, selector memo shapes, or store-specific side effects
  - keeps `Radio` explicit as an adjacent background-runtime mismatch rather than silently promoting it into `WorkspaceSurfaceKind`
  - gives future workspace surfaces one clear onboarding path

#### Canonical Surface Catalog Contract

This is the locked contract shape later `Cleanup 4A` phases should cite directly when implementing the workspace-surface catalog in source and repointing repeated policy branches to it.

##### Contract purpose

- the catalog is the canonical answer for stable workspace-surface facts
- it exists to replace repeated `surfaceKind` branches that answer the same capability questions in multiple files
- it is not a place to store host-local UI state, selector memo outputs, or store-specific side effects

##### Canonical contract shape

The catalog should define one entry per current `WorkspaceSurfaceKind`.

Suggested contract shape:

```ts
type WorkspaceSurfaceCatalogEntry = {
  kind: WorkspaceSurfaceKind
  defaultLabel: string
  renderFamily:
    | 'modelViewer'
    | 'browser'
    | 'console'
    | 'spaghettiEditor'
    | 'dashboard'
    | 'notepad'
  scope: 'core' | 'optional'
  supports: {
    slotted: boolean
    floating: boolean
    popout: boolean
    split: boolean
  }
  participatesInPersistence: boolean
  coordination:
    | 'plain'
    | 'browserShell'
    | 'consoleStore'
    | 'spaghettiViewport'
}
```

##### What each field means

- `kind`
  - canonical identity key
  - must match one `WorkspaceSurfaceKind`
- `defaultLabel`
  - the base label for the surface kind before consumer-specific formatting such as numbering or filtering
- `renderFamily`
  - the canonical render-routing identity the viewport registry should use
  - this can later map to a component or render resolver without repeating raw branch chains everywhere
- `scope`
  - whether the surface is currently a `core` or `optional` workspace surface under the locked taxonomy baseline
- `supports`
  - stable capability facts for whether the surface may participate in slotted, floating, popout, and split behavior
- `participatesInPersistence`
  - whether the surface kind is part of the persisted workspace-surface set
- `coordination`
  - a small declarative hint for whether the surface kind needs special coordination with another owner surface
  - current expected meanings are:
    - `plain`
    - `browserShell`
    - `consoleStore`
    - `spaghettiViewport`

##### What this contract should replace

- repeated default label decisions in `workspaceViewportLabels.ts`
- repeated render-family mapping in `ViewportSurfaceRegistry.tsx`
- repeated capability assumptions in `workspaceSurfaceActions.ts`
- repeated persisted-surface-set checks in `workspacePersistence.ts`
- repeated grouped selector metadata in `useAppShellWorkspaceSelectors.ts`

##### What stays outside the contract

- browser numbering in viewport labels
- console-only option filtering
- optional exclusion of spaghetti editor from some option lists
- selector memo shapes and grouped return objects
- persistence fallback defaults for malformed or older records
- direct calls into browser-shell, console-store, or spaghetti-store actions
- host-local UI wording, menu structure, preview ghosts, and dock affordances

##### Current contract read by surface kind

- `modelViewer`
  - `scope: core`
  - should support slotted, floating, popout, and split
  - participates in persistence
  - coordination is currently `plain`
  - render-family mismatch remains visible because the viewport registry still falls back to a placeholder path
- `browser`
  - `scope: core`
  - should support slotted, floating, popout, and split
  - participates in persistence
  - coordination is `browserShell`
- `console`
  - `scope: core`
  - should support slotted, floating, popout, and split
  - participates in persistence
  - coordination is `consoleStore`
- `spaghettiEditor`
  - `scope: core`
  - should support slotted, floating, popout, and split
  - participates in persistence
  - coordination is `spaghettiViewport`
- `dashboard`
  - `scope: optional`
  - should support slotted, floating, popout, and split
  - participates in persistence
  - coordination is currently `plain`
- `notepad`
  - `scope: optional`
  - should support slotted, floating, popout, and split
  - participates in persistence
  - coordination is currently `plain`

##### Relation to adjacent non-surface systems

- the catalog is only for current real workspace surfaces
- viewport-local tools and shell-local UI read from the catalog but do not become entries in it
- background runtimes such as `Radio` remain adjacent systems unless and until a later phase explicitly promotes them into `WorkspaceSurfaceKind`
- if `Radio` later becomes an optional workspace surface plus runtime pair, that should be a later taxonomy/scope decision, not an implicit side effect of this contract

##### Future-surface onboarding rule

A new product-visible candidate should only enter the workspace-surface catalog when all of these are answered explicitly:

- it is a real workspace surface, not only host-local UI and not only a background runtime
- it has a `WorkspaceSurfaceKind` identity
- its default label is known
- its render family is known
- its `supports.slotted`, `supports.floating`, `supports.popout`, and `supports.split` answers are known
- its persistence participation answer is known
- its scope is known as `core` or `optional`
- any special coordination owner is named explicitly

If those answers are not ready, the system should stay outside the catalog until they are.

## [x] Phase 4 - Repoint Repeated Surface Policy To The Catalog

### Header

#### Purpose:
- reduce repeated workspace-surface policy branches by introducing the canonical catalog in source and repointing the main render, action, persistence, label, and selector seams to read from it instead of repeating file-local `surfaceKind` logic

#### Current read:
- `Phase 3` now locks the target catalog shape and its boundaries
- the remaining work is no longer design
  - it is a focused source-of-truth repoint
- the highest-value initial repoint seams are:
  - `src/app/workspace/ViewportSurfaceRegistry.tsx`
    - render-family routing
  - `src/app/workspace/workspaceViewportLabels.ts`
    - default labels and option-surface metadata
  - `src/app/workspace/workspacePersistence.ts`
    - accepted persisted-surface set checks
  - `src/app/workspace/workspaceSurfaceActions.ts`
    - capability and coordination checks
  - `src/app/hosts/useAppShellWorkspaceSelectors.ts`
    - grouped surface metadata and detached-surface filters
- the pass still needs to stay narrow
  - browser numbering, console-only filtering, selector memo output shape, and fallback migration defaults should remain outside the catalog if they are consumer-specific view logic

#### Read:
- `Phase 4` should be a code-and-verification pass
- the right job here is to establish one real source catalog file and repoint the clearest repeated policy seams first
- this phase should not widen into product-scope changes, new workspace UX, or taxonomy redesign

#### Locked Phase 4 in-scope:
- add the canonical workspace-surface catalog in source
- repoint repeated policy branches to it for:
  - render routing
  - default labels
  - persisted-surface inclusion checks
  - capability checks used by action helpers
  - reusable grouped surface metadata for selectors where appropriate
- keep consumer-specific formatting and host-specific side effects outside the catalog
- preserve current behavior while reducing duplicated answers

#### Locked Phase 4 out-of-scope:
- changing `WorkspaceSurfaceKind`
- promoting `Radio` into the workspace-surface set
- deciding final optional-surface product scope
- redesigning selector return shapes
- broad host or AppShell refactors unrelated to catalog repointing

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry.md`
- especially:
  - `Phase 1` taxonomy baseline
  - `Phase 2` capability-drift inventory
  - `Phase 3` canonical surface catalog contract

#### Strongest live repo seams for this pass:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`

#### Recommended source target

- add one focused workspace-surface catalog module under `src/app/workspace/`
- keep the file close to the existing workspace identity seam so later onboarding stays local to the workspace family

#### Preferred Phase 4 implementation shape:
- add the catalog source file first
- repoint the clearest read-only branch families before touching the noisier coordination seams
- recommended repoint order:
  1. default labels and simple label metadata
  2. render-family mapping
  3. persisted-surface-set checks
  4. capability checks in action helpers
  5. grouped selector metadata where the catalog actually helps
- stop once the main repeated capability answers come from the new catalog, even if some consumer-specific view logic still remains in place

### Implementation spec:
1. Add the canonical workspace-surface catalog source file under `src/app/workspace/`.
2. Encode the locked `Phase 3` contract for the current `WorkspaceSurfaceKind` set.
3. Repoint the highest-value branch families to the catalog, starting with:
   - labels
   - render routing
   - persistence inclusion checks
   - action-helper capability checks
4. Repoint selector/grouping seams only where the catalog can replace repeated stable metadata without swallowing host-specific memo logic.
5. Keep behavior stable and leave consumer-specific formatting or host-side side effects outside the catalog.
6. Verify with build and a quick source scan for the targeted repeated branch families.

#### Implementation stop rule:
- `Phase 4` is ready to implement once one real source catalog exists and the main repeated capability answers have been repointed to it
- do not widen this into a full workspace-family redesign or optional-surface scope decision

#### Checklist:
- [x] add the canonical workspace-surface catalog source file
- [x] encode the locked catalog contract for current workspace surfaces
- [x] repoint label and render mapping seams
- [x] repoint persisted-surface inclusion checks
- [x] repoint the clearest action/selector capability checks where appropriate
- [x] verify behavior remains stable with build
- [x] update `docs/CHANGELOG.md` and `docs/Doc-Log.md`

#### Target output:
- one real source catalog plus initial repoints from the main repeated surface-policy seams

#### Done shape:
- the workspace layer has one obvious source of truth for current workspace-surface facts
- repeated label/render/persistence/capability answers shrink materially
- later surface additions can start from the catalog instead of recreating branch clusters across multiple files

#### Recommended file changes:
- add a new focused catalog module under `src/app/workspace/`
- update:
  - `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - `src/app/workspace/workspaceSurfaceActions.ts`
  - `src/app/workspace/workspacePersistence.ts`
  - `src/app/workspace/workspaceViewportLabels.ts`
  - `src/app/hosts/useAppShellWorkspaceSelectors.ts`
- update:
  - `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry.md`
  - `docs/CHANGELOG.md`
  - `docs/Doc-Log.md`

#### Verification:
- run:
  - `cmd /c npm.cmd run build`
- manually confirm in source that:
  - default labels no longer require a raw full surface-kind label chain
  - render routing reads from the catalog instead of only from hardcoded `surfaceKind` branches
  - persisted-surface inclusion checks no longer repeat the accepted surface set in multiple places
  - action/selector seams use the catalog for stable capability facts where appropriate
- confirm that browser numbering, console-only filtering, selector memo shape, and fallback migration defaults remain outside the catalog unless the implementation proves they belong there

#### Implementation result

This phase landed as a narrow source-of-truth repoint instead of a broad workspace rewrite.

##### New canonical source catalog

- `src/app/workspace/workspaceSurfaceCatalog.ts`
  - now holds the canonical current workspace-surface entries, default labels, render families, scope classification, capability flags, persistence participation, and coordination hints

##### Main repointed seams

- `src/app/workspace/workspaceViewportLabels.ts`
  - now reads default labels and the core-surface filter from the catalog
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - now reads render-family identity from the catalog before routing to the current surface component paths
- `src/app/workspace/workspacePersistence.ts`
  - now reads the accepted persisted surface set through catalog-backed parsing helpers instead of repeating the full surface-kind union in multiple normalization branches
- `src/app/workspace/workspaceSurfaceActions.ts`
  - now reads coordination and stable capability facts from the catalog for the main action paths
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
  - now reads catalog-backed coordination/render-family metadata for the clearest grouped surface queries

##### Explicit non-goals preserved

- browser numbering and console-only option filtering stayed outside the catalog as consumer-specific view logic
- persistence fallback defaults for malformed or older records stayed outside the catalog
- `Radio` stayed outside `WorkspaceSurfaceKind` as an adjacent taxonomy/scope question for later cleanup work

### Acceptance Checks

- one explicit doc-backed answer exists for what counts as a workspace surface
- workspace-surface capabilities are answerable from one canonical catalog contract
- repeated `surfaceKind` policy branches are reduced
- future workspace families have a clear onboarding rule instead of landing as shell special cases
- background runtimes and viewport-local tools are no longer implicitly treated as workspace surfaces

### Likely Related Files

- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
- `src/app/AppShell.tsx`
- `src/app/hosts/RadioRuntimeHost.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

### Success Read

This phase succeeds when:
- ParaHook has one clear answer for what a workspace surface is and what it can do
- adding a new workspace family no longer requires editing many unrelated policy branches without guidance
- workspace families, viewport-local tools, and background runtimes stop blurring together in the architecture story
