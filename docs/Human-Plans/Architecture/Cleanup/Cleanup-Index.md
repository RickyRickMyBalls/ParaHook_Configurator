# Cleanup Index

## Doc Header

### Doc History
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

## [ ] Cleanup 1 - Startup Path Canonicalization

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

Standalone phase doc:
- `Future/Cleanup_Phase Cleanup-1 - Startup Path Canonicalization.md`

Target result:
- one clear startup path
- no fake secondary app-entry story
- cleaner follow-on cleanup work for app bootstrap and ownership boundaries

## [ ] Cleanup 2 - Canonical Owner Decision Lock

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

## [ ] Cleanup 3 - Shared Boundary And Worker Contract Repair

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
- `Future/Cleanup_Phase Cleanup-3 - Shared Boundary And Worker Contract Repair.md`

## [ ] Cleanup 4 - Workspace Truth And AppShell Simplification

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
- `Future/Cleanup_Phase Cleanup-4 - Workspace Truth And AppShell Simplification.md`

## [ ] Cleanup 5 - Project Content And Browser Derivation Cleanup

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
- `Future/Cleanup_Phase Cleanup-5 - Project Content And Browser Derivation Cleanup.md`

## [ ] Cleanup 6 - Graph Runtime And Accepted Result Ownership

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
- `Future/Cleanup_Phase Cleanup-6 - Graph Runtime And Accepted Result Ownership.md`

## [ ] Cleanup 7 - Transform Session Ownership Unification

This is the cross-surface transform cleanup phase.

Reason:
- reference/content transform state currently has multiple readers and command-entry surfaces
- `Canonical-Ownership-Targets.md` already says transform-session truth belongs in `useAppStore`

Initial focus:
- keep active transform session, draft state, history, snap, and committed results canonical in app store
- reduce toolbar, viewer, Browser, and Console to control surfaces over the same transform owner
- prevent transform behavior from splitting into parallel local session truths

Target result:
- one transform-session owner with many control surfaces
- fewer duplicate transform state machines

## [ ] Cleanup 8 - Browser And Console Complexity Reduction

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

## [ ] Cleanup 9 - Optional Workspace Family Scope Decisions

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

Target result:
- optional surfaces stop distorting core architecture by accident
- docs and folder weight better match true product scope

## [ ] Cleanup 10 - Naming, Docs, And Honest Label Hardening

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
5. project content and Browser derivation cleanup
6. graph runtime and accepted result ownership
7. transform session ownership unification
8. Browser and Console complexity reduction
9. optional workspace family scope decisions
10. naming, docs, and honest label hardening

This order may still tighten later as the family grows.

Current read:
- `Startup Path Canonicalization` is the right first cut because it is small and foundational
- `Canonical Owner Decision Lock` should happen early so the later cleanup lanes are moving toward named owners instead of vague cleanup taste
- Browser, transform, and graph-result cleanup should follow the owner decisions rather than precede them

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
