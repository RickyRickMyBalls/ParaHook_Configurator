# Canonical Ownership Targets

## Doc Header

### Doc History
1. 2026-04-12 17:18: Added this dedicated Cleanup follow-on doc after the whole-`src` audit and Cleanup Vision pass identified that one of the main cleanup needs is deciding which truths must become canonical owners instead of remaining spread across stores, hosts, selectors, and compatibility seams

### Purpose

This doc captures the current canonical-ownership cleanup targets for ParaHook.

Use it to answer:
- which parts of the codebase should have exactly one source of truth
- which current truths feel spread out or duplicated
- which surfaces should remain derived read-models rather than owners
- where cleanup refactors should converge when splitting large files

Do not use it for:
- detailed implementation sequencing
- proving that a canonical ownership split already shipped
- listing every selector or helper in the repo

### Relationship To Other Docs

- `Cleanup-Vision.md`
  - broad cleanup north star
  - lane framing
  - sequencing direction

- `../System-Map.md`
  - current architecture map
  - ownership baseline

## Doc Body

### Why This Doc Exists

ParaHook currently has a lot of behavior that works, but some important truths feel spread across:
- app stores
- workspace stores
- host components
- browser and console controllers
- selectors
- migration helpers
- worker-facing adapters

That spread causes a few recurring problems:
- it becomes unclear where a behavior should really be changed
- selectors and hosts start feeling like hidden state owners
- compatibility seams survive longer than intended
- cleanup work turns into "move things around until it feels better"

This doc exists to make the ownership target explicit before the code fully matches it.

### North Star

For each important product truth, ParaHook should have:
- one canonical owner
- clear derived readers
- explicit command/update paths

Selectors, panels, and overlays may format or project that truth.
They should not quietly become second owners of it.

### Canonical Ownership Rules

#### 1. Canonical truth should live in the smallest stable owner that can honestly own it

Examples:
- graph editing truth belongs in the Spaghetti store
- workspace slot/layout truth belongs in the workspace store
- worker request lifecycle truth belongs in the dispatcher

#### 2. Derived UI structures should not become canonical

Examples:
- browser row trees
- debug inspector VMs
- viewport overlays
- node render fragments

These may be important.
They still should not be owners.

#### 3. Migration and compatibility layers should never become permanent truth owners

If a migration helper or compatibility adapter still appears to own real behavior, cleanup should treat that as unfinished work.

#### 4. Shared boundaries need shared contracts

If app, worker, and viewer all need the same truth, that truth should usually move into:
- `src/shared/`
- or another explicit shared boundary surface

It should not remain owned by one implementation folder while the others reach inward.

### Canonical Ownership Targets

#### 1. App startup path

Canonical owner:
- `src/main.tsx`

Why:
- this is the real runtime entry point
- it starts React
- it calls `bootstrapBuildWiring()`

Cleanup note:
- `src/App.tsx` is starter residue and should not continue to look like a second app entry path

#### 2. Workspace layout and surface placement

Canonical owner:
- `src/app/workspace/useWorkspaceStore.ts`

This should be the one source of truth for:
- viewport slot tree
- split layout nodes
- detached surfaces
- floating versus popout versus slotted placement
- surface kind per slot
- active viewer viewport id
- viewport-local chrome and local-view state

This should not be re-owned by:
- `AppShell`
- host components
- popup shells

Those surfaces may compose and render the layout.
They should not become layout truth owners.

#### 3. Active workspace surface and selected workspace target

Canonical owner:
- `src/app/store/useAppStore.ts`

This should be the one source of truth for:
- active surface kind
- selected target
- explicit selected targets
- selection anchor target
- resolved content selection

This should be read by:
- Browser
- Console
- Spaghetti host logic
- viewer-related command routing

Important rule:
- hosts may respond to active selection state
- they should not invent parallel focus truth

#### 4. Graph document truth and editor graph state

Canonical owner:
- `src/app/spaghetti/store/useSpaghettiStore.ts`

This should own:
- graph documents
- graph topology
- node params
- node positions
- edge state
- editor viewport bindings
- graph editing sessions
- graph-local compile/build runtime state

This should not be duplicated into:
- browser controllers
- console staged navigation state
- node render components

Those may derive from graph truth.
They should not own it.

#### 5. Worker request lifecycle

Canonical owner:
- `src/app/buildDispatcher.ts`

This should be the one source of truth for:
- request sequencing
- routing identities
- latest-request-versus-stale handling
- supersession bookkeeping
- worker transport normalization
- authoritative handle release plumbing

Important rule:
- `bootstrapBuildWiring` may glue app state into the dispatcher
- it should not become a second owner of worker request lifecycle semantics

#### 6. Build result acceptance per graph document

Canonical owner:
- graph runtime state inside `useSpaghettiStore`

This should be the one accepted source of truth for:
- last accepted draft result
- last accepted authoritative result
- accepted build outputs
- accepted preview outputs
- accepted build impact

Cleanup note:
- app-level project presentation can derive from accepted graph runtime truth
- it should not become a competing accepted-result owner

#### 7. Project content hierarchy

Canonical owner:
- `src/app/store/useAppStore.ts`

This should own:
- assemblies
- components
- content-object ownership
- parent-child content hierarchy
- visibility flags and content-side transform ownership

Important rule:
- Browser rows are derived presentation over project content truth
- Browser row structures should never become the canonical content hierarchy

#### 8. Browser tree rows and browser row state

Canonical owner:
- no canonical store of row VMs should exist

Browser row VMs should remain derived in selectors such as:
- `src/app/panels/selectBrowserTreeRows.ts`
- current-project content row builders in `useAppStore`

Important rule:
- row IDs may be stable
- row VMs themselves are not canonical product truth

#### 9. Reference registry and reference load state

Canonical owner:
- `src/app/store/useAppStore.ts`

This should own:
- imported reference records
- category membership
- load state
- visibility
- transform state
- timeline configuration
- active reference transform sessions

Viewer, toolbar, Browser, and Console should all speak to this same truth.

#### 10. Reference and content-object transform sessions

Canonical owner:
- `src/app/store/useAppStore.ts`

This should own:
- active transform session identity
- transform draft state
- transform history
- snap state
- transform space
- committed transform results

Important rule:
- `Viewer`
- `ReferenceTransformToolbar`
- `Console`
- Browser actions

may all drive this system, but none of them should become a second transform-session owner.

#### 11. Viewport result preference and viewport-local display state

Canonical owner:
- `src/app/workspace/useWorkspaceStore.ts`

This should own:
- viewport result mode
- viewport-local chrome state
- viewport-local camera/display preferences that belong to workspace presentation

Important rule:
- selectors may derive which result to show
- the viewport preference itself should remain canonical in the workspace layer

#### 12. Worker-facing contracts

Canonical owner target:
- an explicit shared contract surface

Likely home:
- `src/shared/`
- or a real `src/app/protocol.ts` if that is the chosen boundary name

Why:
- current lint rules already describe a cleaner contract boundary than the code actually follows
- worker files should not continue importing arbitrary app internals as if they were shared protocol

Important cleanup rule:
- if both app and worker need the type, that type probably should not live under app implementation folders

#### 13. Viewer runtime state

Canonical owner target:
- the viewer layer itself for engine/runtime details

The app should canonically own:
- accepted data
- result mode preference
- selection/intent

The viewer should canonically own:
- scene/runtime objects
- renderer-owned state
- engine-local interaction/runtime details

Important rule:
- app state should not duplicate viewer engine state
- viewer helpers should not become owners of app truth

#### 14. Console command grammar and staged navigation grammar

Canonical owner:
- `src/app/console/stagedNavigation.ts`

This should canonically own:
- the staged console navigation grammar
- scope transitions
- valid staged choices

It should not canonically own:
- graph truth
- workspace truth
- reference truth

Those should be pulled from stores and selectors, then interpreted through the console grammar layer.

#### 15. Product scope for optional workspace families

Canonical owner target:
- one explicit product decision surface, reflected in docs and architecture

Current likely candidates:
- dashboard
- notepad
- radio

Reason:
- these surfaces are currently architecturally important because they are wired into `AppShell`
- that does not automatically mean they are core product pillars

Cleanup needs one honest answer for each:
- core and fully supported
- optional and isolated
- or retired

### Things That Should Stay Derived

The following should remain derived and should not become canonical owners:

- browser row view-models
- debug inspector view-models
- preview render view-models
- viewport overlay render state
- node render fragments
- console prompt text
- tooltip text
- compatibility adapters
- migration shims
- host-local floating window geometry helpers

These are useful read surfaces.
They are not product truth.

### Current Spread-Truth Hotspots

The audit suggests these current hotspots where truth feels most spread:

#### 1. Accepted build output versus project presentation

This currently feels split across:
- graph runtime acceptance
- app/project content presentation
- browser-facing derived structures

Cleanup target:
- accepted build output should become clearly canonical at graph runtime level
- project and browser surfaces should derive from that

#### 2. Workspace active/focused surface

This currently feels influenced by:
- app store selection state
- workspace slot state
- multiple host components

Cleanup target:
- one canonical active-surface owner
- hosts react to it rather than re-deciding it

#### 3. Reference transform truth

This currently has readers and command entry points in multiple places:
- toolbar
- viewer
- browser
- console

Cleanup target:
- one transform-session owner with multiple control surfaces

#### 4. Worker contract truth

This currently feels split between:
- shared types
- app spaghetti contracts
- worker-local imports
- lint-intended but missing protocol surfaces

Cleanup target:
- one real shared worker/app protocol layer

#### 5. Viewport result meaning

This currently touches:
- workspace store
- selectors
- app store
- viewer-facing rendering paths

Cleanup target:
- viewport preference stays canonical in workspace state
- result derivation stays derived

### Suggested Cleanup Uses

Use this doc when:
- splitting `useAppStore`
- splitting `useSpaghettiStore`
- shrinking AppShell responsibilities
- creating a real worker protocol layer
- deciding whether Browser rows or project content should own a behavior
- deciding whether a transform behavior belongs in toolbar code or store code

When a cleanup refactor starts, ask:
1. what is the canonical truth here?
2. who should own it?
3. which current readers should become purely derived?
4. which migration or compatibility seams should stop existing after the refactor?

### Immediate Backlog Seeds

The current best canonical-ownership cleanup seeds are:

- remove the fake second startup story by retiring `src/App.tsx`
- define the canonical shared worker contract layer and route worker imports through it
- explicitly tighten accepted build-result ownership inside graph runtime state
- keep Browser row trees derived and avoid storing them as product truth
- keep transform sessions canonical in app store rather than in toolbar or viewer code
- reduce AppShell and host components to composition over canonical workspace/app truth

