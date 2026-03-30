# Workspace Phase Workspace-5 - Multi-Window Surfaces And Detached Browser Pop-Out

## Doc Header

### Doc History
4. 2026-03-30 12:14: Cleaned up this phase after the shipped first `Workspace 5` slice by narrowing the landed outcome to the shared child-window host extraction, Browser pop-out owner transfer, and Browser edge-driven viewport split follow-through that actually shipped, then rolled the remaining editor pop-out and multiple-open-graph work forward into new native `Workspace 5.1` through `Workspace 5.3` future phase docs
3. 2026-03-30 11:31: Added the two concrete post-Browser follow-on suggestions that now need to drive the next `Workspace 5` cut, locking that `Spaghetti Editor` needs a real titlebar pop-out affordance in the docked-right window controls and that multiple graphs must be able to stay open at once through multiple hosted editor surface instances instead of the old single-active-editor replacement model
2. 2026-03-30 10:56: Tightened `Workspace 5` into a more code-grounded implementation-ready spec by locking the real extraction boundary around the shipped `ConsoleDock` browser pop-out proof, naming the reusable child-window ownership responsibilities that should move into `src/app/workspace/`, and sharpening the first Browser-first migration plus verification shape so the next implementation cut follows the live portal/style-copy/close-handback contract instead of a generic multi-window idea
1. 2026-03-30 10:18: Re-homed the old `[5.1E]` multi-window and browser pop-out roadmap lane into this native Workspace-family phase doc, locking the post-`Workspace 4` questions into explicit answers, grounding the phase in the already-shipped `Console` child-window proof plus the surviving `separateWindow` type vocabulary, and turning `Workspace 5` into the active implementation-ready next phase for shared surface-instance pop-out and wider multi-window hosting

### Purpose

Use this phase to widen the workspace family from one in-app hosted-surface arrangement into true multi-window and browser-window surface hosting where needed.

The goal is to let supported surfaces move into detached browser windows without losing the shared workspace ownership model or creating duplicate in-app owners.

### Scope

This phase covers:
- browser-window `Pop-Out` as a hosted surface placement mode
- single-owner behavior when a surface moves into a child window
- multi-window surface identity where the shell needs more than one visible instance
- reuse of the shared activation and intent seams across in-app and child-window surfaces
- persistence follow-through for child-window workspace state where needed

This phase does not cover:
- a rewrite of the core workspace placement model
- project-authored content persistence
- separate independent viewer worlds
- a generic OS-native window system outside the browser-window model already proven by `Console`

## Doc Body

### Summary

`Workspace 5` is the multi-window and detached browser pop-out phase.

It should deliver:
- one shared surface-instance model that still holds when a surface moves into a browser window
- one honest single-owner rule for popped-out surfaces
- one clear path for widening beyond the current in-app-only Browser and editor hosting
- one base for later broader multi-window collaboration-facing surfaces

### Locked Direction

`Workspace 5` should be:
- a shared surface-instance widening phase
- a browser-window host phase
- a single-owner continuity phase across in-app and child-window presentation

`Workspace 5` should not be:
- a new split-authoring phase
- a viewer-runtime rewrite
- a detached native-window platform abstraction project
- a separate shell system disconnected from the shared workspace seam

### Locked Outcome

At the end of `Workspace 5`:
- supported surfaces can move into a browser window as a placement mode of the same hosted surface instance
- the in-app owner collapses instead of remaining duplicated while the child window owns that surface
- shared activation, selection, and cross-surface intents still work across both in-app and popped-out surfaces
- wider multi-window hosting can grow from one honest shared surface-instance model instead of ad-hoc per-feature pop-out logic

### What Landed

The shipped first `Workspace 5` slice landed:
- one shared child-window host contract under `src/app/workspace/`
- `ConsoleDock` re-pointed onto that shared child-window host rule instead of keeping all browser-window ownership logic private
- true Browser browser-window pop-out owner transfer on the shared workspace seam
- Browser pop-out persistence follow-through in the canonical last-layout snapshot
- Browser edge-driven viewport split parity so Browser can re-enter viewport split from any viewport edge and drag back out of viewport split into a floating shell

### Residue Carried Forward

The main residue intentionally left after the first `Workspace 5` slice:
- `Spaghetti Editor` still needs a real titlebar `Pop-Out` affordance and child-window owner-transfer path
- the editor still effectively behaves like one visible graph shell instead of multiple honest editor surface instances
- `Open Editors` still needs to become the real multi-graph launcher and switcher on top of those future multiple editor surface instances
- the broader family still does not need generic native desktop windows, collaboration transport, or multiple independent viewer runtimes

### Historical Pre-Cut Code Read

Pre-cut seam before the first `Workspace 5` implementation slice:
- the shared workspace seam now owns Browser shell state, editor placement records, protected viewport identity, and last-layout persistence
- the workspace type vocabulary already includes `separateWindow`
- `Console` already has a real child-window pop-out proof through `window.open(...)` and a dedicated pop-out surface path
- `ConsoleDock` already proves the key browser-window mechanics the workspace family should reuse:
  - one named child window
  - stylesheet copying into the child document
  - one stable portal host root inside the child document
  - `beforeunload` handback when the child window closes
  - child-window key routing without forking feature state

Main residue that was still blocking honest workspace-wide pop-out before the first slice landed:
- Browser pop-out is still an in-app float/dock transition proof, not a true child-window owner transfer
- spaghetti editor placement still includes `separateWindow` in type vocabulary without a real detached browser-window path
- child-window ownership is still feature-specific in `Console` rather than a native workspace-family host rule

Practical read:
- `Console` proves the browser-window technique works
- `Workspace 5` should generalize that proof into the shared workspace surface model
- the phase should unify ownership rules first, not invent per-feature pop-out systems

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-4 - Persistence, Saved Modes, And Migration.md`
- shipped shared activation grounding:
  - `docs/Human-Plans/Architecture/Console/Shipped/Console_Phase 5.1F - Workspace Selection, Surface Activation, And Canonical Intents.md`

Current code seams:
- `src/app/workspace/`
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/store/useAppStore.ts`

Observed live proof and residue:
- `src/app/console/ConsoleDock.tsx` already opens a browser child window through `window.open(...)` and hosts the `Console` surface there
- that same proof already includes the extraction boundary `Workspace 5` should preserve:
  - the named `'parahook-console'` child window
  - `copyDocumentStyles(...)`
  - `.ConsolePopoutRoot`
  - `beforeunload` handback through `handlePopoutWindowClosed()`
- Browser still uses an in-app docked versus floating host proof
- workspace shell/editor types still expose `separateWindow` vocabulary without a generalized workspace pop-out host

### Questions / Decisions

#### `Workspace 5.Q1` - How should browser-window `Pop-Out` relate to the shared workspace host model?

Locked answer:
- treat `Pop-Out` as another placement mode of the same hosted surface instance
- collapse the in-app owner when the child window becomes active
- keep one shared surface identity instead of cloning the feature into a separate detached copy

Why:
- this preserves the same ownership model the workspace family already established for windowed and tiled placement
- it matches the already-shipped `Console` single-owner behavior

#### `Workspace 5.Q2` - What should be the first widened surface set?

Locked answer:
- reuse `Console` as the shipped reference proof
- bring `Browser` into the first generalized child-window host model
- treat `Spaghetti Editor` detached browser-window hosting as the next honest follow-on once the generalized owner-transfer seam exists

Why:
- `Console` already proves child-window plumbing works
- Browser is the most natural next candidate for a shared workspace pop-out rule
- editor detachment should reuse the same host model, not invent another path

#### `Workspace 5.Q3` - What should stay shared across in-app and child-window hosting?

Locked answer:
- one shared `activeSurface` model
- one shared cross-surface intent layer
- one shared hosted surface identity
- one shared project/content/selection truth

Why:
- child-window hosting should widen the shell, not fork feature truth
- the shipped `[5.1F]` seam already established the correct shared ownership direction

#### `Workspace 5.Q4` - What should stay adapter-based during the first cut?

Locked answer:
- keep `ConsoleDock` as the browser-window proof while extracting general rules
- keep `BrowserDockHost`
- keep `SpaghettiWindowHost`
- add the generalized child-window ownership model around those renderers instead of rewriting every host in one pass

Why:
- the existing hosts already prove useful behavior
- the next win is a shared owner-transfer rule, not a full renderer rewrite

#### `Workspace 5.Q5` - What must still stay out of scope?

Locked answer:
- separate independent viewer runtimes
- collaboration/session transport layers
- generic native desktop window abstraction
- full layout-library UX beyond the persistence groundwork already landed in `Workspace 4`

Why:
- those are larger follow-ons outside the current workspace-family need
- widening scope here would blur the concrete pop-out-hosting goal

### Locked Single-Owner Rule

When a hosted surface moves into a browser window:
- the child window becomes the active owner of that hosted surface instance
- the in-app host collapses or becomes a placeholder owner shell
- the workspace must not keep two live interactive owners for the same hosted surface instance

Important rule:
- this is not duplication
- this is placement transfer

### Locked Shared Versus Local Boundary

Keep shared:
- hosted surface identity
- project/content/selection truth
- activation and intent routing
- last-layout persistence model

Make child-window-local:
- actual DOM host
- child-window chrome
- per-window focus and event forwarding

Important rule:
- child-window-local DOM should not imply separate feature state

### Locked First Proof Rule

Use the already-shipped `Console` pop-out as the canonical first proof of browser-window hosting.

Important rule:
- `Workspace 5` should generalize that proof into the workspace-family host model
- it should not replace the proof with an unrelated detached-window system

### Locked Console-Proof Extraction Boundary

Extract from `ConsoleDock`:
- named child-window open or focus behavior
- child-document stylesheet copying
- stable child-document portal host creation
- close and `beforeunload` handback into shared owner transfer
- child-window focus and key-routing hooks where surface activation depends on them

Keep feature-local inside `ConsoleDock`:
- console transcript rendering
- console prompt/session logic
- console-specific command and assist behavior

Important rule:
- `Workspace 5` should extract the browser-window host contract
- it should not hollow out `ConsoleDock` into a generic surface renderer in the first cut

### Important Interfaces And Types To Lock

- `WorkspacePresentationMode`
  - widen to include browser-window `popout` semantics where needed
- `WorkspaceHostedSurfaceWindowOwner`
  - main app versus child window owner identity
- `WorkspacePopoutSurfaceState`
  - child-window ownership metadata keyed by hosted surface instance
- `WorkspaceChildWindowId`
  - stable browser-window host identity
- `WorkspaceChildWindowSpec`
  - stable window name, title, and feature-string inputs for one hosted surface pop-out
- `WorkspaceChildWindowHost`
  - portal-host and close-handback contract for a surface that is currently owned by a child window

Important rule:
- these types should describe ownership and placement transfer
- they should not absorb authored project state

### First Implementation Cut

`Workspace 5` should land in the smallest safe sequence:

1. define generalized child-window ownership and persisted pop-out records under `src/app/workspace/`
2. extract the reusable browser-window host contract from the existing `Console` proof:
   - open or focus the named child window
   - copy app styles into the child document
   - create one stable portal host root
   - hand ownership back cleanly when the child window closes
3. re-point `ConsoleDock` onto that shared contract without changing its feature-local transcript logic
4. adapt `BrowserDockHost` to support true child-window pop-out as a placement transfer instead of only in-app float/dock switching
5. keep shared activation, console context sync, and cross-surface intent seams aligned across the main app and child window
6. leave detached spaghetti/editor browser-window hosting as the next follow-on once the generalized host rule is stable

Important rule:
- do not attempt Browser plus editor plus every other surface in one pass
- do not rewrite the current host renderers more than needed for owner transfer

### Likely Files

- `src/app/workspace/`
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/store/useAppStore.ts`

### Concrete Implementation Targets

Recommended first file targets:
- `src/app/workspace/`
  - child-window ownership types
  - generalized pop-out ownership helpers
  - persistence follow-through for child-window placement state
- `src/app/workspace/workspaceShellTypes.ts`
  - canonical pop-out placement and child-window identity records
- `src/app/workspace/useWorkspaceStore.ts`
  - shared child-window ownership and owner-transfer state
- `src/app/workspace/workspacePersistence.ts`
  - last-layout follow-through for child-window placement when supported
- `src/app/console/ConsoleDock.tsx`
  - extract reusable owner-transfer patterns from the existing pop-out proof
- `src/app/hosts/BrowserDockHost.tsx`
  - first shared workspace-family browser-window pop-out cut
- `src/app/store/useAppStore.ts`
  - keep activation and intent seams correct across main-app and child-window surfaces

### Acceptance And Done Shape

`Workspace 5` is done when:
- one shared browser-window pop-out ownership rule exists
- the in-app owner collapses when the child window owns that hosted surface
- Browser can use the generalized pop-out rule instead of only the current in-app host proof
- shared activation and intent seams still work across in-app and child-window hosting
- closing a child window hands ownership back cleanly without leaving a dead duplicate shell behind
- later editor/browser-window follow-through has one honest host model to build on

### Forward Follow-On Split

The remaining `Workspace 5` work is now split into native follow-on phases:
- `Workspace 5.1 - Spaghetti Editor Child-Window Pop-Out And Dock-Back Restore`
- `Workspace 5.2 - Multiple Editor Surface Instances And Graph Binding`
- `Workspace 5.3 - Open Editors Multi-Graph Workspace UX And Session Truth`

Important rule:
- the editor pop-out and multiple-open-graph work should now move through those dedicated future phase docs instead of staying buried as one suggestion block inside the original Browser-first phase

### Verification Shape

Minimum verification for `Workspace 5` should cover:
- `Console` still works as the child-window proof
- Browser child-window pop-out transfers ownership cleanly
- the in-app owner does not remain as a duplicate interactive copy
- activation and console/workspace context still track the correct active surface
- persisted last-layout state can still remember child-window ownership where that first cut supports it
- blocked browser pop-out falls back cleanly without losing the in-app owner
- closing the child window restores the in-app owner and expected focus handback

Important non-goals during verification:
- do not require editor child-window hosting yet
- do not require collaboration features yet
- do not require multiple independent viewer runtimes yet
