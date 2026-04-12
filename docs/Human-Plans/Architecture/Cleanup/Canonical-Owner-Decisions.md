# Canonical Owner Decisions

## Doc Header

### Doc History
1. 2026-04-12 13:12: Created this compact cleanup decision register so ParaHook has one fast reference for "which truth lives where" alongside the broader `Canonical-Ownership-Targets.md` target map

### Purpose

This doc records the current canonical owner decisions for ParaHook.

Use it to answer:
- which file or layer should be treated as the one real owner for an important truth
- which surfaces are explicitly derived only
- where cleanup refactors should move behavior when ownership is unclear

Do not use it for:
- deep implementation sequencing
- long audit explanations
- proving that every decision is already fully reflected in code
- replacing the broader reasoning in `Canonical-Ownership-Targets.md`

### Relationship To Other Docs

- `Canonical-Ownership-Targets.md`
  - broader ownership target map
  - hotspot and reasoning doc

- `Cleanup-Vision.md`
  - broader cleanup north star
  - lane framing

- `Cleanup-Index.md`
  - family scan surface
  - cleanup phase ladder

## Doc Body

### Why This Doc Exists

`Canonical-Ownership-Targets.md` is useful, but it is still a fuller architecture read.

This companion doc is the fast decision sheet.

Its job is simple:
- name the truth
- name the real owner
- name what must stay derived

When a cleanup refactor starts and someone asks "where should this really live?", this doc should give the shortest honest answer.

### Decision Rules

- Each important product truth should have one real owner.
- Hosts, selectors, panels, overlays, and view-models may read or project that truth, but should not quietly become second owners.
- Compatibility layers and migration helpers are never long-term owners.
- If app, worker, and viewer all depend on the same contract, that contract should live in an explicit shared boundary.
- If a thing is mainly a UI projection, it should stay derived rather than being stored as canonical product truth.

### Canonical Owner Decisions

#### 1. App startup path

Truth:
- app startup path

Canonical owner:
- `src/main.tsx`

Derived or supporting only:
- `src/app/main.tsx`
  - root composition
- `src/app/bootstrapBuildWiring.ts`
  - startup glue
- `src/App.tsx`
  - should be retired as starter residue

Decision:
- app startup lives in `src/main.tsx`

#### 2. Workspace layout and surface placement

Truth:
- viewport slot tree
- split layout nodes
- detached and floating and popout placement
- surface kind per slot
- active viewer viewport id
- viewport-local chrome and local-view state

Canonical owner:
- `src/app/workspace/useWorkspaceStore.ts`

Derived or supporting only:
- `AppShell`
- host components
- popup shells

Decision:
- workspace layout lives in `useWorkspaceStore`

#### 3. Active workspace surface and selected workspace target

Truth:
- active surface kind
- selected target
- explicit selected targets
- selection anchor target
- resolved content selection

Canonical owner:
- `src/app/store/useAppStore.ts`

Derived or supporting only:
- Browser
- Console
- Spaghetti host logic
- viewer-related command routing

Decision:
- app-wide active selection and selected workspace target live in `useAppStore`

#### 4. Graph document truth and editor graph state

Truth:
- graph documents
- graph topology
- node params
- node positions
- edge state
- editor viewport bindings
- graph editing sessions
- graph-local compile and build runtime state

Canonical owner:
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Derived or supporting only:
- browser controllers
- console staged navigation state
- node render components

Decision:
- graph document truth lives in `useSpaghettiStore`

#### 5. Worker request lifecycle

Truth:
- request sequencing
- routing identities
- stale-versus-latest handling
- supersession bookkeeping
- worker transport normalization
- authoritative handle release plumbing

Canonical owner:
- `src/app/buildDispatcher.ts`

Derived or supporting only:
- `bootstrapBuildWiring`
  - wiring glue, not lifecycle owner

Decision:
- worker request lifecycle lives in `buildDispatcher`

#### 6. Build result acceptance per graph document

Truth:
- last accepted draft result
- last accepted authoritative result
- accepted build outputs
- accepted preview outputs
- accepted build impact

Canonical owner:
- graph runtime state inside `src/app/spaghetti/store/useSpaghettiStore.ts`

Derived or supporting only:
- app-level project presentation
- browser-facing result presentation

Decision:
- accepted build result truth lives in graph runtime state inside `useSpaghettiStore`

#### 7. Project content hierarchy

Truth:
- assemblies
- components
- content-object ownership
- parent-child content hierarchy
- visibility flags
- content-side transform ownership

Canonical owner:
- `src/app/store/useAppStore.ts`

Derived or supporting only:
- Browser rows

Decision:
- project content hierarchy lives in `useAppStore`

#### 8. Browser tree rows and row state

Truth:
- browser row view-models

Canonical owner:
- no canonical owner store should exist

Derived or supporting only:
- `src/app/panels/selectBrowserTreeRows.ts`
- current-project row builders in `useAppStore`

Decision:
- browser rows are derived only

#### 9. Reference registry and reference load state

Truth:
- imported reference records
- category membership
- load state
- visibility
- transform state
- timeline configuration
- active reference transform sessions

Canonical owner:
- `src/app/store/useAppStore.ts`

Derived or supporting only:
- Viewer
- toolbar
- Browser
- Console

Decision:
- reference registry and load state live in `useAppStore`

#### 10. Reference and content-object transform sessions

Truth:
- active transform session identity
- transform draft state
- transform history
- snap state
- transform space
- committed transform results

Canonical owner:
- `src/app/store/useAppStore.ts`

Derived or supporting only:
- `Viewer`
- `ReferenceTransformToolbar`
- `Console`
- Browser actions

Decision:
- transform sessions live in `useAppStore`

#### 11. Viewport result preference and viewport-local display state

Truth:
- viewport result mode
- viewport-local chrome state
- viewport-local camera and display preferences that belong to workspace presentation

Canonical owner:
- `src/app/workspace/useWorkspaceStore.ts`

Derived or supporting only:
- selectors that choose which result to display

Decision:
- viewport result preference lives in `useWorkspaceStore`

#### 12. Worker-facing contracts

Truth:
- app-worker shared contract types

Canonical owner:
- explicit shared boundary surface such as:
  - `src/shared/`
  - or `src/app/protocol.ts` if that becomes the chosen boundary

Derived or supporting only:
- worker-local imports from app implementation folders
  - should be retired

Decision:
- worker-facing shared contracts live in an explicit shared boundary, not app implementation folders

#### 13. Viewer runtime state

Truth:
- scene and runtime objects
- renderer-owned state
- engine-local interaction and runtime details

Canonical owner:
- viewer layer

App-owned instead:
- accepted data
- result mode preference
- selection and intent

Decision:
- viewer engine state lives in the viewer layer; app truth stays app-side

#### 14. Console command grammar and staged navigation grammar

Truth:
- staged console navigation grammar
- scope transitions
- valid staged choices

Canonical owner:
- `src/app/console/stagedNavigation.ts`

Derived or supporting only:
- graph truth from stores
- workspace truth from stores
- reference truth from stores

Decision:
- console grammar lives in `stagedNavigation.ts`; it reads other truths but does not own them

#### 15. Product scope for optional workspace families

Truth:
- whether dashboard, notepad, and radio are core, optional, or retired

Canonical owner:
- one explicit product decision surface in docs and architecture

Derived or supporting only:
- `AppShell` wiring
  - wiring alone does not make a surface a core product pillar

Decision:
- optional workspace family scope must be decided explicitly in docs, not implied by shell wiring

### Quick Rules Of Thumb

If you are unsure where something belongs, use these checks:

1. If changing it should update the real product truth, it needs a canonical owner.
2. If it is mainly formatting, projection, or rendering shape, it should stay derived.
3. If multiple UI surfaces can drive the same state, that usually means the state belongs in a store, not in one of those surfaces.
4. If both app and worker need it, move it to a shared contract boundary.
5. If a migration helper still looks like the owner, the cleanup is not done yet.

### Current Decision Gaps

These still need later tightening even though the direction is already visible:

- exact shared boundary for worker-facing contracts
- explicit product decision surface for dashboard, notepad, and radio
- any remaining hotspots where accepted build output presentation still feels split away from graph runtime truth

### Related Files

- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/System-Map.md`
