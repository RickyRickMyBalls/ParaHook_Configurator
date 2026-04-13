# Cleanup Index

## Doc Header

### Doc History
16. 2026-04-13 10:15:35: Closed out `Cleanup 8 - CAD Node Family Packaging And Command Library Extraction` as a shipped cleanup lane after the packaging-boundary baseline, mixed-placement inventory, family-folder contract, sketch-command-library contract, narrow `OutputPreview` plus draw-command extraction, and final proof/handoff phases all landed, moved its standalone phase record into `Cleanup/Shipped/`, and refreshed the family ladder so the CAD packaging lane now reads as completed history before `Cleanup 8A`
15. 2026-04-13 08:45:27: Added the standalone future phase doc for `Cleanup 8 - CAD Node Family Packaging And Command Library Extraction`, aligning the next cleanup lane to the shipped `Cleanup 7` ownership baseline plus the broader cleanup and repo vision docs while turning the index's CAD packaging step into a real implementation-ready planning surface under `Cleanup/Future/`
14. 2026-04-13 08:38:44: Closed out `Cleanup 7 - Node-Owned CAD Authoring And Command Adapter Unification` as a shipped cleanup lane after the owner-baseline, command-drift inventory, command-start narrowing, cross-surface sketch-intent unification, and final proof phases all landed, moved its standalone phase record into `Cleanup/Shipped/`, and refreshed the family ladder so the node-owned CAD authoring lane now reads as completed history before the later CAD packaging cleanup
13. 2026-04-13 07:07:53: Closed out `Cleanup 6 - Graph Runtime And Accepted Result Ownership` as a shipped cleanup lane after the owner-baseline, drift-inventory, app/project narrowing, viewport fan-out narrowing, and final proof phases all landed, moved its standalone phase record into `Cleanup/Shipped/`, and refreshed the family ladder so the accepted-result ownership lane now reads as completed history before the later CAD authoring and Browser/Console cleanup phases
12. 2026-04-12 22:53:27: Closed out `Cleanup 4A - Workspace Surface Catalog And Capability Registry` as a shipped cleanup lane after the taxonomy baseline, capability-drift inventory, canonical catalog contract, and initial source-catalog repoint all landed, moved its standalone phase record into `Cleanup/Shipped/`, and refreshed the family ladder so the workspace-surface catalog cleanup now reads as finished history before the later optional-surface scope decisions
11. 2026-04-12 22:30:43: Refined the family ladder handoff between `Cleanup 4A` and `Cleanup 10` so `Radio` is now called out explicitly as the main current example of an optional workspace surface versus background-runtime taxonomy mismatch in `Cleanup 4A`, while `Cleanup 10` keeps the final product-scope decision for dashboard, notepad, and radio
10. 2026-04-12 21:44:03: Shipped `Cleanup 3 - Shared Boundary And Worker Contract Repair`, moved its standalone phase record from `Cleanup/Future/` to `Cleanup/Shipped/`, and refreshed the family ladder so the boundary-repair lane now reads as completed before the workspace-truth cleanup phase
9. 2026-04-12 21:10: Added two focused follow-on cleanup seams to the family ladder, introducing `Cleanup 4A - Workspace Surface Catalog And Capability Registry` after the workspace-truth phase and `Cleanup 8A - Feature-Stack And Graph-Native CAD Contract Convergence` after the CAD packaging phase so the index now captures the next likely cross-cutting organization work without overloading Cleanup with viewer-only or future motion-family architecture
8. 2026-04-12 20:45: Split the CAD cleanup ladder more cleanly by keeping `Cleanup 7` focused on node-owned authoring truth and command-adapter unification, adding a new `Cleanup 8 - CAD Node Family Packaging And Command Library Extraction`, and shifting the later umbrella phases up by one so node-family packaging has its own explicit cleanup lane
7. 2026-04-12 20:15: Reframed `Cleanup 7` from the narrower transform-session wording into the broader `Node-Owned CAD Authoring And Command Adapter Unification` lane, locking that spaghetti CAD nodes should own authored truth while toolbar, console, and viewport command flows act as adapters over shared graph mutation and preview seams, and added the standalone future phase doc for that cleanup lane
6. 2026-04-12 19:55: Shipped `Cleanup 1 - Startup Path Canonicalization`, corrected the earlier starter-asset assumption after a live rescan showed `public/vite.svg` is still used by `index.html` as the favicon, and moved the phase record into `Cleanup/Shipped/` after retiring the real dead starter entry residue
5. 2026-04-12 13:42: Added standalone future phase docs for `Cleanup 2` through `Cleanup 6` so the big-vision ownership and boundary lanes now have real planning surfaces under `Cleanup/Future/`
4. 2026-04-12 13:31: Expanded the Cleanup family phase ladder into a broader big-vision cleanup roadmap based on `Cleanup-Vision.md` and `Canonical-Ownership-Targets.md`, adding follow-on umbrella phases for owner decisions, shared boundaries, workspace/app-shell simplification, project-and-browser ownership cleanup, graph/runtime acceptance, transform unification, Browser/Console cleanup, optional-surface scope decisions, and final naming/docs hardening
3. 2026-04-12 13:12: Added `Canonical-Owner-Decisions.md` as the compact cleanup decision register for one-real-owner rules and refreshed this index so the Cleanup family now distinguishes between broad ownership targets and a tighter decision sheet
2. 2026-04-12 13:01: Added the standalone `Cleanup 1 - Startup Path Canonicalization` future phase doc under `Cleanup/Future/` and refreshed the family index so the first cleanup phase now points at a real implementation-ready planning surface
1. 2026-04-12 12:46: Created this umbrella index for the `Cleanup/` architecture family, aligned it to the standard family-folder pattern, and set `Cleanup 1 - Startup Path Canonicalization` as the first planned cleanup phase

### Purpose

This doc defines the architecture direction for the `Cleanup` family.

This file is the umbrella index for `Architecture/Cleanup/`.

Use it to answer:
- what the Cleanup family is for
- how the cleanup docs in this folder relate to each other
- which cleanup lanes belong under this umbrella
- what the current cleanup phase ladder is
- where standalone future and shipped cleanup phase docs should live

Do not use it for:
- the full cleanup vision narrative
- detailed implementation checklists
- proving that a cleanup phase already shipped
- holding every ownership target directly in one file

### Family Structure

Use this folder like this:

- `Cleanup-Index.md`
  - umbrella cleanup direction
  - family summary
  - cleanup phase ladder
- `Cleanup-Vision.md`
  - broad cleanup north star
  - lane framing
  - cleanup principles
- `Canonical-Ownership-Targets.md`
  - canonical owner map
  - ownership cleanup targets
  - current spread-truth hotspots
- `Canonical-Owner-Decisions.md`
  - compact decision register
  - one-real-owner rules
  - fast reference for ownership calls
- `Future/`
  - standalone implementation-ready cleanup phase docs
- `Shipped/`
  - shipped records for completed cleanup phase docs

### Relationship To Other Docs

- `Cleanup-Vision.md`
  - broad cleanup north star
  - why cleanup matters
  - main cleanup lanes and suggested order

- `Canonical-Ownership-Targets.md`
  - one-owner target map
  - current spread-truth hotspots
  - ownership refactor convergence points

- `Canonical-Owner-Decisions.md`
  - compact owner-decision sheet
  - current cleanup decisions in `truth -> owner -> derived-only` form

- `../System-Map.md`
  - current architecture map
  - baseline for deciding where ownership should converge

- `../Architecture Setup.md`
  - family-folder pattern
  - how `Future/` and `Shipped/` should be used

## Doc Body

### Why This Doc Exists

Cleanup now needs its own umbrella surface instead of living only as:
- one broad vision doc
- one ownership-target doc
- scattered follow-on notes in other feature families

This index exists so the Cleanup family has one fast scan surface that says:
- what this family is trying to clean up
- which docs hold the vision versus the execution details
- which cleanup phases are currently active or planned
- where new cleanup phase docs should be added

### Short Version

`Cleanup/` is a cross-cutting architecture family.

It is not one product feature.
It is the place where ParaHook records deliberate cleanup work around:
- startup truth
- canonical ownership
- boundary repair
- residue retirement
- large ownership-sink decomposition

`Cleanup-Vision.md` explains the north star.
`Canonical-Ownership-Targets.md` explains where one true owners should live.
`Cleanup-Index.md` is the family map that points at concrete cleanup phases.

### Scope

This family covers:
- cross-cutting cleanup work that affects multiple app surfaces
- canonical ownership cleanup
- startup-path cleanup
- boundary and contract repair
- residue, migration, and compatibility seam retirement
- future cleanup phase sequencing

This family does not replace:
- feature-family architecture docs such as `AppShell/`, `Worker/`, or `Workspace-Modes/`
- feature-specific implementation specs that still belong inside their own family folders
- the full detailed cleanup reasoning already captured in `Cleanup-Vision.md`

### Current Cleanup Read

Right now the cleanup family already has three important foundation docs:

- `Cleanup-Vision.md`
  - explains what cleanup should mean in ParaHook
  - frames the main cleanup lanes
  - gives the broad suggested ordering

- `Canonical-Ownership-Targets.md`
  - names the intended canonical owners for major product truths
  - identifies current spread-truth hotspots
  - gives a direct ownership target for future refactors

- `Canonical-Owner-Decisions.md`
  - turns the ownership target map into a faster rule sheet
  - records the current "this truth lives here" decisions
  - gives cleanup work one simple decision surface to cite

What was missing was the umbrella family index that turns those docs into an ongoing cleanup planning area with:
- a phase ladder
- `Future/` follow-on docs
- `Shipped/` cleanup history

### Cleanup Family Rules

- Keep broad cleanup vision in `Cleanup-Vision.md`.
- Keep ownership-target mapping in `Canonical-Ownership-Targets.md`.
- Put implementation-ready cleanup phase docs in `Future/`.
- Move completed cleanup phase docs into `Shipped/`.
- Use this index as the scan surface, not as the only detailed planning file.
- Prefer putting cross-cutting cleanup here instead of scattering it into unrelated feature folders.

### Cleanup Phase Ladder

## [x] Cleanup 1 - Startup Path Canonicalization

This is the first cleanup phase for the family.

Reason:
- `Canonical-Ownership-Targets.md` already names the startup path as a canonical-ownership target
- `src/main.tsx` should be the one honest runtime entry path
- `src/App.tsx` should not continue presenting a fake second startup story if it is only residue

Initial focus:
- confirm the real runtime startup path
- make `src/main.tsx` the clearly documented canonical owner of app startup
- remove or retire any residue that still suggests a parallel app entry path
- keep bootstrap wiring and root app composition honest about where startup truth lives
- keep `public/vite.svg` only because the live repo still uses it as the favicon through `index.html`

Standalone phase doc:
- `Shipped/Cleanup_Phase Cleanup-1 - Startup Path Canonicalization.md`

Target result:
- one clear startup path
- no fake secondary app-entry story
- cleaner follow-on cleanup work for app bootstrap and ownership boundaries

## [x] Cleanup 2 - Canonical Owner Decision Lock

This is the next family phase after startup cleanup.

Reason:
- `Canonical-Ownership-Targets.md` and `Canonical-Owner-Decisions.md` already show that ParaHook needs one durable answer for where major truths live
- cleanup gets fuzzy when large refactors start before the owner decisions are treated as explicit family direction

Initial focus:
- tighten the major `truth -> owner -> derived-only` rules
- resolve the still-soft owner decisions that affect multiple subsystems
- make future cleanup phases converge on explicit owners instead of taste-based reorganizing

Likely decision surfaces:
- project content hierarchy versus Browser rows
- accepted build result truth versus app presentation
- transform-session truth versus toolbar/viewer/console entry points
- worker/app shared contract ownership

Target result:
- one stable owner-decision sheet the other cleanup phases can cite directly
- fewer refactors that accidentally create second owners

Standalone phase doc:
- `Future/Cleanup_Phase Cleanup-2 - Canonical Owner Decision Lock.md`

## [x] Cleanup 3 - Shared Boundary And Worker Contract Repair

This is the boundary-repair phase for the family.

Reason:
- `Cleanup-Vision.md` calls out shared-boundary drift as one of the main cleanup problems
- `Canonical-Ownership-Targets.md` already names worker-facing contracts as needing one explicit shared home

Initial focus:
- define the real shared worker/app protocol layer
- reroute worker-facing imports through that boundary
- stop treating app implementation folders as accidental shared protocol

Target result:
- one honest worker/app contract surface
- cleaner separation between shared contracts and app internals

Standalone phase doc:
- `Shipped/Cleanup_Phase Cleanup-3 - Shared Boundary And Worker Contract Repair.md`

## [x] Cleanup 4 - Workspace Truth And AppShell Simplification

This is the top-level workspace ownership phase.

Reason:
- `Cleanup-Vision.md` identifies AppShell/workspace simplification as a major cleanup lane
- `Canonical-Ownership-Targets.md` already says workspace layout truth belongs in `useWorkspaceStore`, not in host components or popup shells

Initial focus:
- reduce AppShell and host components to composition over workspace truth
- retire remaining migration-era workspace ownership leakage
- keep workspace placement, slot layout, and viewport-local state clearly canonical in `useWorkspaceStore`

Target result:
- `AppShell` reads mainly as composition and coordination
- workspace layout truth is not re-owned by hosts

Standalone phase doc:
- `Shipped/Cleanup_Phase Cleanup-4 - Workspace Truth And AppShell Simplification.md`

## [x] Cleanup 4A - Workspace Surface Catalog And Capability Registry

This is the workspace-surface taxonomy and capability cleanup phase.

Reason:
- the repo already has one real workspace surface-kind seam, but actual surface capabilities and onboarding rules are still spread across slot rendering, persistence, action helpers, host selectors, and per-surface assumptions
- `Cleanup 4` should simplify top-level workspace truth first so this phase can catalog surfaces against a cleaner owner instead of against old AppShell leakage
- future workspace growth should not require re-answering from scratch whether a surface is slotted, floating, popped out, singleton, duplicated, optional, viewport-local, or background-only

Initial focus:
- define one explicit workspace surface catalog for the current real surface families
- record capability rules such as:
  - supports `slotted`
  - supports `floating`
  - supports `popout`
  - singleton versus multi-instance
  - core versus optional versus background-runtime classification
- reduce duplicated capability assumptions currently spread across workspace render, actions, labels, and persistence seams
- add a clear onboarding rule for future surface families so new workspaces do not land as one-off shell special cases
- use `Radio` as the main current taxonomy example where a product-visible runtime behaves like an optional workspace surface candidate while still living outside `WorkspaceSurfaceKind`

Target result:
- one obvious place to answer what a workspace surface kind is allowed to do
- fewer repeated `surfaceKind` branches that quietly encode product policy in multiple places
- cleaner separation between real workspace surfaces, viewport-local tools, and background runtimes

Standalone phase doc:
- `Shipped/Cleanup_Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry.md`

## [x] Cleanup 5 - Project Content And Browser Derivation Cleanup

This is the app-content versus Browser cleanup phase.

Reason:
- the Browser is one of the easiest places for derived structure to quietly become fake ownership
- `Canonical-Ownership-Targets.md` already says project hierarchy lives in `useAppStore` and Browser rows are derived only

Initial focus:
- tighten project-content hierarchy ownership in `useAppStore`
- keep Browser row trees, row VMs, and Browser structure purely derived
- remove any Browser-side behavior that acts like hierarchy ownership rather than projection

Target result:
- project hierarchy truth lives in app store
- Browser rows are honest projections instead of shadow ownership surfaces

Standalone phase doc:
- `Shipped/Cleanup_Phase Cleanup-5 - Project Content And Browser Derivation Cleanup.md`

## [x] Cleanup 6 - Graph Runtime And Accepted Result Ownership

This is the graph/runtime cleanup phase.

Reason:
- accepted build output versus app/project presentation is one of the clearest spread-truth hotspots
- `Canonical-Ownership-Targets.md` already points to graph runtime state inside `useSpaghettiStore` as the accepted-result owner

Initial focus:
- tighten accepted draft and authoritative result ownership inside graph runtime state
- keep app-level project presentation and Browser structure derived from that accepted truth
- prevent graph result acceptance from being split across multiple presentation layers

Target result:
- accepted build-result truth has one owner
- project and Browser presentation derive from graph runtime instead of competing with it

Standalone phase doc:
- `Shipped/Cleanup_Phase Cleanup-6 - Graph Runtime And Accepted Result Ownership.md`

## [x] Cleanup 7 - Node-Owned CAD Authoring And Command Adapter Unification

This is the cross-surface CAD authoring ownership phase.

Reason:
- spaghetti CAD authoring is growing across node surfaces, viewport tools, toolbar flows, and console command entry
- cleanup needs one durable rule that node params, wiring, and outputs stay canonical while command surfaces adapt into that same truth
- `Cleanup 6` should settle graph runtime and accepted-result ownership first so later CAD command surfaces do not invent a second preview/result owner

Initial focus:
- keep authored CAD truth canonical in spaghetti node params, wiring, outputs, and graph runtime rather than in toolbar-local or viewport-local state
- treat toolbar, console, and viewport interaction as adapters over the active node and one shared graph mutation path
- make draft preview and stale authoritative result state read as graph/runtime truth instead of as toolbar-owned truth
- lock the reuse rule that node families such as `Sketch`, `Extrude`, `Loft`, and later `Transform` should follow the same node-owned authoring pattern

Important boundary:
- this phase locks the ownership rule
- it does not also need to own the repo packaging plan for every CAD node family or every 2D sketch command surface

Target result:
- one node-owned CAD authoring model with many command-entry surfaces
- fewer toolbar-local state machines and fewer hidden command-side graph mutations

Standalone phase doc:
- `Shipped/Cleanup_Phase Cleanup-7 - Node-Owned CAD Authoring And Command Adapter Unification.md`

## [x] Cleanup 8 - CAD Node Family Packaging And Command Library Extraction

This is the CAD repo-shape and family-packaging phase.

Reason:
- ParaHook can support a few node families with the current spread across `registry/`, `features/`, `ui/features/`, `system/`, store branches, and viewer helpers, but that shape will get harder to extend once many 3D node families and many 2D sketch commands are live
- `Cleanup 7` should lock ownership first so this phase can package around a stable rule instead of reorganizing folders while ownership is still unsettled
- 3D node families and 2D sketch-editing commands should not keep growing as one blended implementation bucket

Initial focus:
- define the durable folder contract for CAD node families such as `Sketch`, `Extrude`, `Loft`, `Shell`, `Combine`, `Hole`, `Array Pattern`, `Transform`, and `Output Preview`
- extract current node-family logic away from mixed placement across registry, feature helpers, UI feature views, and system helpers into family-oriented folders
- carve 2D sketch commands such as `move`, `stretch`, `polygon`, `join`, `explode`, `dimensions`, `copy`, `rotate`, and `mirror` into a command library rather than continuing to grow them as store-local behavior
- separate pure command logic from interactive tool-session adapters so viewport, toolbar, and console entry can reuse the same command library cleanly

Target result:
- CAD node families have one obvious place to live
- 2D sketch commands have one obvious place to live
- future node growth does not force every family to touch the same giant files

Standalone phase doc:
- `Shipped/Cleanup_Phase Cleanup-8 - CAD Node Family Packaging And Command Library Extraction.md`

## [ ] Cleanup 8A - Feature-Stack And Graph-Native CAD Contract Convergence

This is the CAD authored-contract convergence phase.

Reason:
- CAD node-family packaging alone will not fully solve the remaining seam between part-local feature-stack authoring and graph-native node authoring
- current families such as `Sketch` and `Extrude` still read as partially hybrid across registry, feature schema, feature-stack UI, and graph/store seams
- future CAD growth should not force every new operation to re-decide whether it is a feature-stack concept, a graph-native node, or an inconsistent mix of both

Initial focus:
- define one explicit convergence rule for how feature-stack CAD contracts and graph-native CAD node contracts relate
- decide which authored fields, ports, outputs, and lowering seams should be shared between those worlds
- reduce hybrid implementation drift where one family owns partly duplicated contracts across feature helpers, graph node definitions, and UI entry surfaces
- make later node families such as `Loft`, `Shell`, `Combine`, `Hole`, `Array Pattern`, and `Transform` follow one clearer authored contract pattern

Target result:
- one clearer answer for when a CAD operation is feature-stack owned, graph-node owned, or intentionally shared through one contract
- less family-by-family reinvention as the CAD operation set expands

## [ ] Cleanup 9 - Browser And Console Complexity Reduction

This is the large-controller cleanup phase.

Reason:
- `Cleanup-Vision.md` explicitly calls out Browser and Console complexity review
- the canonical-owner docs also warn against selectors, staged navigation, or Browser structures quietly becoming owners of other truths

Initial focus:
- keep staged navigation as grammar owner rather than graph/workspace/reference owner
- split Browser and Console controllers by responsibility where needed
- reduce row-shaping, command grammar, and interaction glue sinks without moving ownership to the wrong layer

Target result:
- Browser and Console remain powerful, but their biggest files stop acting like hidden ownership buckets

## [ ] Cleanup 10 - Optional Workspace Family Scope Decisions

This is the product-scope cleanup phase.

Reason:
- `Cleanup-Vision.md` says cleanup should force an honest decision about secondary surfaces
- `Canonical-Ownership-Targets.md` names dashboard, notepad, and radio as needing one explicit product-scope answer

Initial focus:
- decide whether each optional workspace family is:
  - core and fully supported
  - optional and isolated
  - or retired
- make docs and architecture reflect that answer instead of leaving scope implied by shell wiring
- finalize the product answer for dashboard, notepad, and radio after the earlier `Cleanup 4A` taxonomy work has made it explicit whether `Radio` should remain a background runtime only or become an optional workspace surface plus runtime pair

Target result:
- optional surfaces stop distorting core architecture by accident
- docs and folder weight better match true product scope

## [ ] Cleanup 11 - Naming, Docs, And Honest Label Hardening

This is the final cleanup-shape phase.

Reason:
- `Cleanup-Vision.md` calls out naming/docs honesty as a cleanup lane of its own
- later cleanup phases will leave behind old labels unless one pass is dedicated to retiring dead stories cleanly

Initial focus:
- retire stale `legacy`, `compat`, and migration labels where the migration is actually over
- align docs with the real ownership model that shipped
- leave one honest naming story across source, docs, and cleanup history

Target result:
- names and docs describe the real system instead of preserving old architecture stories
- the cleanup family can hand off with clearer terminology and less drift

### Suggested Near-Term Family Order

The current recommended cleanup sequence under this family is:

1. startup path canonicalization
2. canonical owner decision lock
3. shared boundary and worker contract repair
4. workspace truth and AppShell simplification
5. workspace surface catalog and capability registry
6. project content and Browser derivation cleanup
7. graph runtime and accepted result ownership
8. node-owned CAD authoring and command adapter unification
9. CAD node family packaging and command library extraction
10. feature-stack and graph-native CAD contract convergence
11. Browser and Console complexity reduction
12. optional workspace family scope decisions
13. naming, docs, and honest label hardening

This order may still tighten later as the family grows.

Current read:
- `Startup Path Canonicalization` is the right first cut because it is small and foundational
- `Canonical Owner Decision Lock` should happen early so the later cleanup lanes are moving toward named owners instead of vague cleanup taste
- Browser, node-authoring, and graph-result cleanup should follow the owner decisions rather than precede them

### Success Read

This cleanup family is working well when:
- the index stays readable as the scan surface
- each real cleanup phase gets its own `Future/` doc once it becomes implementation-ready
- completed cleanup work moves into `Shipped/`
- cross-cutting cleanup decisions stop living only in scattered feature docs
- ownership cleanup has one obvious planning home

### Related Files

- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/System-Map.md`
- `docs/Human-Plans/Architecture/Architecture Setup.md`
