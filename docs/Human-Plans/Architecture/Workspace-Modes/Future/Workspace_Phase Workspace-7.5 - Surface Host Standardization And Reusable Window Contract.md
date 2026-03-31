# Workspace Phase Workspace-7.5 - Surface Host Standardization And Reusable Window Contract

## Doc Header

### Doc History
1. 2026-03-31 16:47: Added this native `Workspace 7.5` future phase doc to turn the Browser-versus-Spaghetti cleanup comparison into one implementation-ready standardization lane for reusable surface host contracts, shared shell verbs, and a generic dock or toolbar ownership model that future workspace windows can adopt without re-running the Browser cleanup ladder surface by surface

### Purpose

Use this phase to turn the Browser-first host cleanup into one reusable workspace surface contract.

The goal is to stop solving shell behavior one window family at a time:
- every workspace surface should speak one shared host-mode language
- Browser should stop being the only surface with the cleanest toolbar or dock ownership seam
- Spaghetti Editor and future windows should be able to adopt the same contract without repeating the full Browser cleanup ladder

### Scope

This phase covers:
- defining one reusable workspace-owned surface placement and host-lifecycle contract
- generalizing Browser-only shell wins such as explicit dock ownership into reusable seams
- converging Spaghetti Editor onto those same shared host verbs where the feature does not truly need special behavior
- shaping future workspace surfaces so they can plug into the same slot, floating, popout, redock, and host-affinity model
- shrinking feature-local shell ownership inside host adapters once the reusable contract exists

This phase does not cover:
- the first `Workspace 7.4` convergence cleanup that should still delete temporary split adapters and land the next slot lifecycle actions first
- rewriting graph or editor feature behavior that is not actually shell ownership
- inventing a single identical titlebar UI for every surface when some feature-specific actions still belong locally
- separate independent scene or editor worlds

## Doc Body

### Summary

`Workspace 7.5` is the reusable host-contract standardization phase that should follow the earlier Browser-first cleanup and the `7.4` convergence pass.

It should deliver:
- one reusable workspace surface placement model
- one shared set of shell verbs across docked, slotted, floating, and popped-out surfaces
- less Browser-only or Spaghetti-only shell logic
- a clearer path for future windows like `Radio`, `Layer Manager`, `Export`, or other toolbar-hosted workspace surfaces

Practical read:
- Browser already proved several good cleanup ideas
- Spaghetti already proved a richer per-surface placement record
- `7.5` should combine those wins into one reusable contract instead of leaving Browser and Spaghetti as two different shell languages

### Locked Direction

`Workspace 7.5` should be:
- a reusable shell-contract phase
- a host standardization phase
- a future-surface onboarding phase
- a Browser and Spaghetti convergence phase

`Workspace 7.5` should not be:
- another Browser-only cleanup lane
- a generic visual restyle of every titlebar
- a feature rewrite of graph editing, Browser content, or viewer rendering
- a replacement for the earlier `7.4` convergence cleanup

### Why This Phase Exists

Browser currently has the cleanest workspace-owned host behavior in a few important places:
- explicit left-toolbar ownership
- shared detached-surface redock
- clearer workspace-owned dock claim behavior

Spaghetti currently has the richer per-surface placement model in other important places:
- explicit per-surface placement records
- surface-bound popout state
- restore metadata tied to one editor surface instance

But the system is still split:
- Browser still carries Browser-only shell state and Browser-only ownership seams
- Spaghetti still carries too much shell logic inside `SpaghettiWindowHost` and `useSpaghettiStore`
- future surfaces would still have to choose which custom pattern to copy instead of adopting one canonical host contract

`7.5` exists to stop that split from becoming the permanent architecture.

### Comparison Read

Current Browser strengths:
- explicit workspace-owned toolbar owner state in `src/app/workspace/useWorkspaceStore.ts`
- direct use of the shared detached-surface and redock seam
- cleaner separation between shell ownership and Browser content behavior

Current Browser residue:
- `browserToolbarOwnerSurfaceInstanceId` is still Browser-specific instead of one reusable host-route ownership seam
- `browserShell` is still a singleton-flavored shell model instead of one generic surface placement record
- BrowserDockHost still contains shell behavior that future surfaces cannot reuse directly

Current Spaghetti strengths:
- `EditorWorkspaceSurfaceState` is already closer to a reusable per-surface placement record
- Spaghetti surfaces already persist richer popout and restore metadata through workspace state
- multiple editor surfaces already behave more like true surface instances than Browser's older singleton shell path

Current Spaghetti residue:
- `SpaghettiWindowHost` still owns too many shell decisions directly
- `useSpaghettiStore` still carries shell window modes that should increasingly become workspace-owned truth
- Meatball, split view, floating, and popout all still speak one editor-specific shell dialect instead of one reusable workspace shell contract

### Locked Outcome

At the end of `Workspace 7.5`:
- one reusable workspace surface placement record can represent the shell state for Browser, Spaghetti, Console, and future surfaces
- one shared shell action model exists for `focus`, `float`, `popout`, `redock`, and slot split placement
- explicit dock or toolbar ownership is a reusable host-route concept instead of a Browser-only rule
- host adapters like `BrowserDockHost` and `SpaghettiWindowHost` become thinner renderers over shared workspace-owned host behavior
- future workspace surfaces can onboard faster because they adopt one standard shell contract instead of inventing another special host path

### Current Code Read

Current likely seams:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.tsx`

Important current mismatch:
- `Browser` still leans on `browserShell` plus `browserToolbarOwnerSurfaceInstanceId`
- `Spaghetti Editor` already uses `editorSurfacePlacementById`, but the live shell behavior still routes through editor-specific window modes
- both surfaces already use the shared detached-surface seam, but they do not yet consume one unified shell contract on top of it

### Locked Questions / Decisions

#### [x] Workspace 7.5 - Question 1 - What exact problem is this phase solving?

##### Locked Answer
- stop Browser and Spaghetti from remaining two different shell architectures
- turn the landed Browser cleanup ideas into one reusable workspace host contract
- make future surfaces adopt that contract instead of forcing one more one-off cleanup ladder

##### Why
- otherwise every new surface family will repeat the same host cleanup in slightly different code

#### [x] Workspace 7.5 - Question 2 - What should the reusable unit be?

##### Locked Answer
- one workspace-owned surface placement record per surface instance
- not one Browser singleton shell model and one editor-only placement model

##### Why
- the real reusable unit is the hosted surface instance, not the feature family

#### [x] Workspace 7.5 - Question 3 - What shell verbs should become canonical?

##### Locked Answer
- `focus`
- `float`
- `popout`
- `redock`
- `split top`
- `split right`
- `split bottom`
- `split left`
- optional named-host claim actions like `dock left` when a specific host route exists

##### Why
- those are the cross-surface shell actions that should feel the same no matter which workspace surface is active

#### [x] Workspace 7.5 - Question 4 - What Browser-specific seam should be generalized first?

##### Locked Answer
- explicit dock or toolbar route ownership
- Browser proved the need for that seam first, but the ownership concept itself should become generic

##### Why
- future toolbar-hosted or dock-hosted surfaces should not need one custom ownership rule each

#### [x] Workspace 7.5 - Question 5 - What should stay feature-local even after standardization?

##### Locked Answer
- feature actions like Browser tree commands, graph build actions, or viewer controls
- feature-specific titlebar content that is not actually shell ownership

##### Why
- `7.5` should standardize shell ownership and host lifecycle, not erase valid feature differences

#### [x] Workspace 7.5 - Question 6 - What should stay explicitly out of scope here?

##### Locked Answer
- the earlier `7.4` adapter and slot-lifecycle cleanup
- large feature rewrites inside Browser or Spaghetti
- purely visual titlebar redesign work with no host-behavior payoff

##### Why
- this phase should standardize reusable shell truth, not expand sideways into unrelated polish

### Important Interfaces And Types To Lock

- `WorkspaceSurfacePlacementState`
  - should be the generic replacement target for Browser singleton shell state and editor-only placement state
  - should express:
    - `surfaceKind`
    - `surfaceInstanceId`
    - `hostMode`
    - geometry for floating or popout as needed
    - host affinity such as `hostViewportId`
    - restore metadata
    - optional named-host ownership data

- `WorkspaceHostRouteOwnership`
  - should represent explicit ownership of a route like a left dock, toolbar lane, or other named shell host
  - should not be Browser-specific by type name

- shared shell action contract
  - host adapters should be able to call one reusable set of workspace actions for:
    - focus
    - float
    - popout
    - redock
    - split on one side
    - claim a named host route when allowed

Important rule:
- the reusable contract should be workspace-owned truth
- host adapters should increasingly render and delegate, not re-invent lifecycle logic

### First Implementation Cut

`Workspace 7.5` should land in the smallest safe sequence:

1. define the generic workspace surface placement and host-route ownership types
2. identify the minimum shared shell action set and centralize those workspace actions
3. adapt Browser to consume the generic types without changing visible behavior first
4. adapt Spaghetti to the same contract, deleting the most obvious editor-only shell duplication
5. prove at least one future-ready non-Browser surface can adopt the same host contract without another Browser-style cleanup ladder

Implementation boundary:
- first prove the shared contract with Browser plus Spaghetti
- do not promise every future surface conversion in the same cut

### Likely Files

- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.test.ts`
- `src/app/AppShell.test.tsx`

### Acceptance And Done Shape

`Workspace 7.5` is done when:
- Browser and Spaghetti share one canonical workspace host contract
- Browser-only dock or toolbar ownership is replaced by a reusable named-host ownership seam
- shell action behavior feels parallel across Browser, Spaghetti, and Console where the same action exists
- future surfaces can be added by adopting the shared contract instead of copying Browser-specific or editor-specific shell logic
- at least one major host adapter becomes materially thinner because the workspace layer now owns more of the lifecycle truth

### Verification Shape

Minimum verification for `Workspace 7.5` should cover:
- Browser shell actions still behave the same after conversion onto the generic contract
- Spaghetti floating, popout, split, and dock-back flows still behave the same after conversion onto the shared contract
- route ownership for left dock or toolbar-style hosts remains deterministic after the generic ownership seam replaces Browser-only naming
- persistence and restore still preserve the generic placement records honestly
- a newly standardized surface action path does not require feature-local special casing to complete a normal host transition
