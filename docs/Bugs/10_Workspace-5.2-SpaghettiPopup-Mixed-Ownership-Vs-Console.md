# 10 - Workspace 5.2 Spaghetti Popup Mixed Ownership Versus Console

## Doc History
2. 2026-03-30 14:46: Expanded this note with the current simplification read for the Spaghetti Editor, documenting that the real complexity is coming from one host trying to cover floating, split, meatball, maximized, collapsed, essentials, and child-window roles across two stores at once, and captured the main simplification directions: separate shell from content, define one canonical editor-surface record, stop popup render from depending on active viewport discovery, break `SpaghettiWindowHost` into smaller hosts, and treat some current window modes as presentation variants instead of true placement modes
1. 2026-03-30 14:42: Created this bug note to capture the stronger Console-versus-Spaghetti comparison finding: Console popout is a single-owner child-window surface while Spaghetti popout still mixes shared workspace placement truth with legacy `useSpaghettiStore` viewport/runtime truth, and documented the concrete repair sequence needed to make the detached editor popup render from one canonical detached surface record

## Status

- `[planned]`

## Summary

The detached Spaghetti popup bug is no longer best understood as "a popup lifecycle glitch."

After comparing the working Console popout path with the failing Spaghetti popout path, the stronger read is:

- Console popout is a single-owner feature
- Spaghetti popout is still a mixed-owner feature
- that mixed ownership is the most likely reason the popup window can open and theme correctly while the real editor surface still never paints

This note exists to track that architecture finding separately from the user-facing blank-popup symptom in `Bug 9`.

## Core Finding

Console popout works because it follows a simple model:

- one store owns popout mode
- one popup host opens from that mode
- one direct render branch paints the popout contents
- one close path docks the surface back in

Spaghetti popout does not yet follow that model.

Instead it currently depends on overlapping truth from:

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/SpaghettiWindowHost.tsx`

That means the detached popup can enter an in-between state where:

- the child window exists
- the popup title and background are correct
- but the real detached editor surface is still not being rendered from one stable canonical source

## Console Comparison

## What Console Does Right

The working Console popout path in:

- `src/app/console/ConsoleDock.tsx`
- `src/app/console/useConsoleStore.ts`

is simple and coherent:

1. `useConsoleStore` owns one window mode
   - `docked`
   - `floating`
   - `popout`

2. `ConsoleDock` opens the child window directly from that mode through:
   - `useWorkspaceChildWindow(...)`

3. The popup content is rendered from one direct branch:
   - `ConsolePanel`
   - `ConsoleBar`

4. Dock-back is also a single-owner transition:
   - `handlePopoutWindowClosed()`
   - `switchToDocked(...)`

Console does not need to rediscover popup content from a second runtime model after the popup opens.

## What Spaghetti Still Does Differently

The current Spaghetti popup path in:

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/useWorkspaceStore.ts`

still mixes several moving parts:

- workspace-owned detached placement state
- legacy viewport records in `editorViewportsById`
- viewport ordering in `editorViewportOrder`
- active-surface compatibility behavior through `activeEditorViewportId`
- detached viewport discovery before popup rendering

That makes the popup render path dependent on both:

- the new workspace surface model
- the older active-editor viewport model

So even when the popup host is healthy, the actual detached editor render branch can still collapse or fail to paint.

## Why This Explains The Blank Popup

This comparison explains the current live symptom well:

- the popup window itself works
- the shared child-window hook is at least good enough to open and theme the popup
- but the detached Spaghetti surface still depends on mixed old/new state before anything renders

That is why we can get:

- correct popup title
- correct popup dark background
- still no visible titlebar, panel, or editor content

The strongest read is that the popup is no longer blocked by browser mechanics.
It is blocked by detached-surface ownership and render derivation still being split across two systems.

## Why Spaghetti Is Hard To Fix Right Now

The detached popup bug is hard because the Spaghetti Editor is currently doing too many jobs through one host.

### One surface is covering many roles

The current Spaghetti surface has to support:

- floating window
- split view
- meatball dock view
- separate browser window
- maximized mode
- collapsed mode
- essentials mode

That means one surface host is carrying both:

- true placement/state responsibilities
- several presentation variants

### Ownership is split across two stores

The current system still divides truth between:

- shared workspace placement/state in:
  - `src/app/workspace/useWorkspaceStore.ts`
- live editor/runtime/viewport identity in:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`

That split is manageable for in-app rendering, but it becomes much more fragile once a child-window popup is added.

### `SpaghettiWindowHost` has become a mega-adapter

`src/app/hosts/SpaghettiWindowHost.tsx` now carries:

- floating drag behavior
- split docking behavior
- meatball docking behavior
- popout behavior
- popup host behavior
- titlebar behavior
- active viewport compatibility behavior
- render branching for several window modes

That makes detached popup repair hard because even small popup changes still pass through a very large host with several unrelated responsibilities.

### The editor subtree is deep

The popup does not render one shallow panel the way Console does.

It renders through:

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/ui/ExpandedEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`

So popup bugs can come from:

- surface ownership
- popup host lifecycle
- shell layout
- panel-level assumptions
- canvas/runtime assumptions

### Old single-active-editor assumptions still survive

Even after `Workspace 5.2`, the old dominant active-editor bridge still matters a lot.

That means the system is trying to support:

- multiple live editor surfaces
- detached popup surfaces
- while still centering important behavior on one active viewport

That is the main split-brain pressure behind this bug family.

## Simplification Direction

If we want this family to get easier to maintain and easier to debug, the best simplification direction is not more popup patching alone.

It is to simplify the editor surface model itself.

### 1. Separate shell from content

Treat these as different layers:

- shell
  - drag
  - dock
  - split
  - popout
  - placement
- content
  - panel
  - graph binding
  - editor
  - canvas

That would let the same editor content mount under simpler surface hosts.

### 2. Define one canonical editor surface record

One record should answer:

- which editor surface this is
- which graph document it is bound to
- where it lives
- who owns the window
- how it docks back in

Then all detached rendering should come from that one record.

### 3. Stop popup render from depending on active viewport discovery

Detached popup rendering should not depend on:

- `activeEditorViewportId`
- `editorViewportOrder`
- fallback viewport scanning

The popup should render because a detached editor surface exists, not because the compatibility bridge can rediscover it.

### 4. Break `SpaghettiWindowHost` into smaller hosts

The likely target shape is something closer to:

- `SpaghettiFloatingSurfaceHost`
- `SpaghettiSplitSurfaceHost`
- `SpaghettiPopoutSurfaceHost`
- shared `SpaghettiSurfaceFrame`

This would reduce how much unrelated behavior flows through one giant render file.

### 5. Reclassify some current modes as presentation variants

Some current states may not need to be true placement modes.

A simpler model would likely distinguish:

- real placement modes
  - floating
  - split
  - meatball
  - separate window
- presentation variants
  - maximized
  - collapsed
  - essentials

That would reduce the amount of state branching the popup path has to honor.

## Likely Fix Direction

The fix should make Spaghetti popup more Console-like at the ownership boundary, not by copying Console UI, but by copying its single-owner popout contract.

## Repair Plan

### Step 1 - Define one canonical detached editor surface record

Use one workspace-owned detached record as the direct source for popup rendering.

That record should be enough to answer:

- which editor surface is detached
- what graph document it is bound to
- who owns the surface
- how it should dock back in
- which popup spec it uses

Do not require popup rendering to rediscover that surface from:

- `activeEditorViewportId`
- `editorViewportOrder`
- compatibility-only viewport scanning

### Step 2 - Render detached popup content directly from that record

In `SpaghettiWindowHost.tsx`, the child-window branch should render from the canonical detached surface record first.

The popup path should stop depending on "find the right detached viewport through mixed store state and then maybe render it."

The order should become:

1. read canonical detached editor surface
2. open/reuse popup host
3. render that one detached editor surface directly

### Step 3 - Push legacy viewport state behind the popup adapter

`useSpaghettiStore` can still provide runtime/editor behavior for now, but it should act as an adapter under the detached surface record instead of being a co-owner of popup truth.

That means:

- keep compatibility behavior where necessary
- stop letting the old active-editor bridge decide whether the popup is allowed to exist

### Step 4 - Add a real child-window render proof

Current popup tests mock `SpaghettiPanel`, which is too shallow for this bug family.

We need one focused proof that exercises more of the real detached render path, or at minimum a stronger host-level assertion that the popup body receives visible shell content rather than only the themed document background.

### Step 5 - Only then continue `Workspace 5.3`

Do not build more multi-graph workspace UX on top of the current detached-editor seam until one detached Spaghetti Editor can render honestly and stably.

## Concrete First Cut

The safest first implementation cut is:

1. add an explicit detached-editor surface selector/helper under `src/app/workspace/`
2. make `SpaghettiWindowHost` render popout surfaces from that selector rather than from mixed ordered-viewport discovery
3. keep the dock-back contract and existing popup hook
4. leave multi-graph additive UX and broader editor-surface multiplication to `Workspace 5.3`

## Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/useWorkspaceChildWindow.ts`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

## Exit Criteria

This bug should count as fixed only when:

- clicking `PO` opens a detached Spaghetti popup
- the popup shows the real titlebar and editor shell
- the popup shows real graph/editor content, not just a themed blank window
- the popup stays alive while another in-app editor surface becomes active
- closing the popup docks the editor back in correctly

## Related Docs

- `/docs/Bugs/9_Workspace-5.2-SpaghettiEditor-Detached-Popup-Blank.md`
- `/docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5.2 - Multiple Editor Surface Instances And Graph Binding.md`
- `/docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5.3 - Open Editors Multi-Graph Workspace UX And Session Truth.md`
