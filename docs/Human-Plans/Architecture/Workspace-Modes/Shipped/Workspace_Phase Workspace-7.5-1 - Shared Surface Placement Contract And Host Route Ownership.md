# Workspace Phase Workspace-7.5-1 - Shared Surface Placement Contract And Host Route Ownership

## Doc Header

### Doc History
1. 2026-04-01 00:51: Closed the `Workspace 7.5-1` implementation and verification checklist after re-checking the shipped contract-extraction work against the live generic placement, host-route ownership, Browser repoint, persistence migration, and focused test coverage, so this phase record can now move from `Future/` into `Shipped/` as honest landed history
1. 2026-03-31 23:21: Tightened this native `Workspace 7.5-1` subphase into an implementation-ready contract-extraction spec by locking the exact first-cut host-route ownership shape, the minimum generic placement-record fields, the first shared `useWorkspaceStore` action set, the Browser-first migration order, the feature-local boundary, and the persistence compatibility rule after the umbrella `Workspace 7.5` question pass
2. 2026-03-31 23:13: Added this native `Workspace 7.5-1` subphase doc to make the first `7.5` cut implementation-ready around generic workspace surface placement, shared shell verbs, and reusable host-route ownership after the Browser-versus-Spaghetti shell comparison showed that Browser currently proves the cleanest ownership seam while Spaghetti still needs a later split-truth migration pass

### Purpose

Use this phase to define the reusable shared shell contract before the heavier Spaghetti split migration starts.

The goal is to make Browser's ownership wins generic instead of Browser-specific:
- one workspace-owned placement record per surface instance
- one reusable host-route ownership seam
- one shared shell action set for focus, float, popout, redock, and split-side placement

### Scope

This phase covers:
- defining the generic replacement target for Browser singleton shell state and editor-only placement state
- extracting reusable host-route ownership out of Browser-only naming
- centralizing the first shared shell verbs in workspace-owned actions
- adapting Browser to those generic seams without changing visible behavior first

This phase does not cover:
- migrating the Spaghetti drag-to-edge split path yet
- deleting the old editor-owned `split view` branch inside `SpaghettiWindowHost`
- the later adapter-retirement and future-surface proof cut

## Doc Body

### Summary

`Workspace 7.5-1` is the contract-extraction cut.

It should deliver:
- one generic `WorkspaceSurfacePlacementState`
- one reusable host-route ownership model instead of `browserToolbarOwnerSurfaceInstanceId`
- one first shared shell action surface that Browser and later Spaghetti can call

Practical read:
- this cut should rename and reshape Browser's best shell seams into reusable workspace truth
- it should not try to solve the Spaghetti split hybrid yet
- it should leave Browser looking the same while the contract underneath becomes generic

### Current Code Read

Primary seams:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/AppShell.tsx`

Current problem:
- Browser already proves explicit ownership and redock rules
- but that ownership is still named and shaped like Browser-only truth instead of reusable workspace truth

Specific first-cut read:
- Browser is the proof surface for the reusable contract
- `7.5-1` should extract generic types and actions from Browser first
- `7.5-2` should then use that contract to absorb the Spaghetti drag-to-edge split path

### Locked Questions / Decisions

#### [x] Workspace 7.5-1 - Question 1 - What is the reusable unit of shell state?

##### Locked Answer
- one workspace-owned placement record per hosted surface instance

##### Why
- Browser singleton shell state and editor-only placement state should converge on the same unit

#### [x] Workspace 7.5-1 - Question 2 - What should host-route ownership represent?

##### Locked Answer
- explicit ownership of a named host route such as left dock, toolbar lane, or another shared shell host
- not Browser-specific state by type name

##### Why
- the ownership concept is reusable even if Browser proved the need first

#### [x] Workspace 7.5-1 - Question 3 - What shell verbs must be centralized first?

##### Locked Answer
- `focus`
- `float`
- `popout`
- `redock`
- `split top`
- `split right`
- `split bottom`
- `split left`
- optional named-host claim when the route exists

##### Why
- these are the core cross-surface shell actions that should feel parallel

#### [x] Workspace 7.5-1 - Question 4 - What is the exact first-cut shape of host-route ownership?

##### Locked Answer
- one record keyed by named host-route id
- each ownership record should store:
  - `surfaceKind`
  - `surfaceInstanceId`
  - optional `hostViewportId`
- the first cut should only model already-real routes such as the Browser-owned left dock or toolbar route

##### Why
- this is the minimal reusable replacement for `browserToolbarOwnerSurfaceInstanceId`

#### [x] Workspace 7.5-1 - Question 5 - What is the minimum stable shape of `WorkspaceSurfacePlacementState`?

##### Locked Answer
- the generic placement record should minimally carry:
  - `surfaceKind`
  - `surfaceInstanceId`
  - `hostMode`
  - `hostViewportId?`
  - `slotId?`
  - `floatingRect?`
  - `popoutState?`
  - `restoreTarget?`
  - `namedHostRouteId?`
- fields that only matter to one surface family today may remain optional in `7.5-1`

##### Why
- the first cut needs a stable readable contract that Browser can adopt immediately and Spaghetti can target next

#### [x] Workspace 7.5-1 - Question 6 - What should stay feature-local in this cut?

##### Locked Answer
- shell ownership:
  - focus
  - float
  - popout
  - redock
  - split-side placement
  - named-host claim and release
- feature-local:
  - Browser tree and project-content actions
  - Spaghetti graph and panel actions
  - viewer-local tool actions

##### Why
- `7.5-1` standardizes host lifecycle, not feature content

#### [x] Workspace 7.5-1 - Question 7 - What is the Browser-first migration order?

##### Locked Answer
1. land generic types and route-ownership naming
2. add the first shared workspace actions
3. repoint Browser host code to those actions
4. keep visible Browser behavior frozen while the new generic contract replaces Browser-only naming underneath

##### Why
- Browser is the safest proof surface, but the goal is contract extraction rather than UX churn

#### [x] Workspace 7.5-1 - Question 8 - How should persistence work in the first cut?

##### Locked Answer
- write the new generic placement shape from `workspacePersistence`
- keep a compatibility read path for existing Browser-specific persisted state for one cut
- re-save migrated layouts back in the generic shape on the next write

##### Why
- this preserves live layouts while shifting durable truth toward the reusable contract

### Locked Contract Shape

`Workspace 7.5-1` should define:

- `WorkspaceSurfacePlacementState`
  - one generic placement record per surface instance
  - first-cut fields:
    - `surfaceKind`
    - `surfaceInstanceId`
    - `hostMode`
    - `hostViewportId?`
    - `slotId?`
    - `floatingRect?`
    - `popoutState?`
    - `restoreTarget?`
    - `namedHostRouteId?`

- `WorkspaceHostRouteOwnershipByRouteId`
  - keyed by route id
  - each value stores:
    - `surfaceKind`
    - `surfaceInstanceId`
    - optional `hostViewportId`

- first shared workspace actions
  - `focusSurface`
  - `floatSurface`
  - `popoutSurface`
  - `redockSurface`
  - `splitSurfaceToSide`
  - `claimHostRoute`
  - `releaseHostRoute`

Important rule:
- this cut should create reusable naming and ownership truth
- it should not absorb the Spaghetti split-resize path yet

### Locked Boundary

`Workspace 7.5-1` is in scope for:
- generic placement and host-route ownership types
- Browser-first adoption of the generic contract
- first shared workspace shell actions
- persistence migration for the generic contract

`Workspace 7.5-1` is out of scope for:
- Spaghetti drag-to-edge split migration
- editor-local split-resize cleanup
- host-adapter retirement beyond what Browser contract adoption strictly requires

### First Implementation Cut

1. define `WorkspaceSurfacePlacementState` and `WorkspaceHostRouteOwnershipByRouteId` under `workspaceShellTypes`
2. add compatibility mapping from Browser-specific ownership and placement state into the generic names
3. centralize `focusSurface`, `floatSurface`, `popoutSurface`, `redockSurface`, `splitSurfaceToSide`, `claimHostRoute`, and `releaseHostRoute` in `useWorkspaceStore`
4. adapt Browser host code to call those generic actions without changing visible behavior
5. update `workspacePersistence` so the generic placement shape becomes the write-side truth while one compatibility read path preserves existing layouts
6. keep Spaghetti behavior unchanged in this cut except for compatibility plumbing if needed

### Likely Files

- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.test.ts`
- `src/app/AppShell.test.tsx`

### Implementation Checklist

- [x] Add the generic placement and host-route ownership types
- [x] Add compatibility mapping from Browser-specific naming into the generic contract
- [x] Centralize the first shared shell actions in `useWorkspaceStore`
- [x] Repoint Browser host behavior onto the shared actions without visible UX change
- [x] Update persistence to write the generic shape and read old Browser state compatibly
- [x] Add or update focused tests for Browser route ownership, float, popout, redock, and persistence migration

### Shipped Read

`Workspace 7.5-1` is now shipped.

What landed:
- generic `WorkspaceSurfacePlacementState` and named host-route ownership records now exist in workspace shell types and store state
- Browser ownership and placement truth now derive through the generic contract instead of only Browser-specific naming
- the first shared workspace shell verbs landed for focus, float, popout, redock, split-side placement, and host-route claim or release
- persistence now writes the generic contract shape while keeping one compatibility read path for older Browser-owned layouts
- Browser behavior stayed visually stable while the underlying shell truth became reusable for later `7.5` cuts

Verification that landed with the shipped implementation:
- `.\node_modules\.bin\tsc.cmd --noEmit`
- `npm.cmd run test -- src/app/workspace/useWorkspaceStore.test.ts src/app/hosts/BrowserDockHost.test.tsx`

### Acceptance And Done Shape

`Workspace 7.5-1` is done when:
- Browser no longer needs Browser-specific type names to express host-route ownership
- the first shared shell verbs exist in the workspace layer
- the generic placement contract is stable enough for Spaghetti to adopt in `7.5-2`
- Browser still behaves the same from the user’s point of view while the reusable contract becomes the underlying shell truth

### Verification Shape

Minimum verification for `Workspace 7.5-1` should cover:
- Browser dock-left, float, popout, and redock still behave the same
- persistence still serializes the new generic placement data honestly
- no Browser visual behavior changes are required to prove the new contract
- compatibility hydration still restores older Browser-owned layouts for one cut before resaving them generically
