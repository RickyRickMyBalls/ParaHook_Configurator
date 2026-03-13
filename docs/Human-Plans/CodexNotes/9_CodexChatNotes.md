# 9 Codex Chat Notes

## Doc Header

### Doc Notes

- This is the active Codex notes file going forward.
- Use this file for raw planning notes before implementation work.
- Current planning focus:
  - broader UI polish
  - workspace presentation
  - possible later `VR / SP` workspace-presentation planning
- Keep substantive timestamped entries on the absolute `[N]` numbering path from the previous file.

## Doc Body

## Session 1 Notes

##### [103] 2026-03-12 00:00 - Browser Read Feels Too Button-Heavy

Current read after looking at the Browser:

- the Browser hierarchy is no longer reading like a calm tree
- graph rows are carrying too many always-visible actions
- the important structure:
  - `Project`
  - `Content`
  - `Graph Documents`
  - `Open Viewports`
  is getting visually buried under action buttons

Main problem:

- the row body is trying to do two jobs at once:
  - show hierarchy and state
  - act like a toolbar

Working consequence:

- the Browser stops feeling like a project/navigation surface
- it starts feeling like a stack of mini control panels
- this makes it harder to understand what is selected, what is open, and what the row actually represents

##### [104] 2026-03-12 00:00 - Likely Direction - Move Heavy Row Actions Into Right-Click Options

Likely cleanup direction:

- move most graph-row actions out of the always-visible row body
- put them behind:
  - right click
  - or a small overflow/options affordance if needed later

Candidate actions to move:

- `Save`
- `Open`
- `Reveal`
- `New Editor`
- `Swap Editor`

Likely same rule for viewport rows:

- `Focus`
- `Close`

Why this direction looks right:

- it gives the Browser back its tree-first shape
- it makes the row label and state easier to scan
- it keeps actions available without making every row look noisy

Plain-English rule:

- the Browser row should look like a row first
- the row actions should feel secondary

##### [105] 2026-03-12 00:00 - First Browser Cleanup Rule

Proposed first-pass Browser cleanup rule:

- left side of the row should stay about hierarchy and identity:
  - expand
  - icon
  - label
  - small state/meta
- primary click should stay simple:
  - select the row
- heavy actions should not all stay permanently visible on the row face

Working read:

- the current Browser already proved the action set exists
- the next cleanup pass should improve presentation, not invent more controls

##### [106] 2026-03-12 00:00 - Open Question - Right Click Only Or Right Click Plus Small Overflow

Open design question:

- should row actions live in:
  - right click only
  - or right click plus a small `...` overflow button

Current first instinct:

- right click should definitely work
- a small overflow button may still be useful later for discoverability
- but the Browser should stop showing the full button strip on every row

Safe first-pass preference:

- remove the full visible button strip
- keep row click for selection
- add a row options menu path for the current actions

##### [107] 2026-03-12 00:00 - Browser Cleanup Goal

The Browser should feel more like:

- a calm project tree
- a navigation surface
- a selection surface

and less like:

- a dense button launcher attached to every row

Working cleanup goal:

- make the Browser understandable at a glance before adding richer Browser polish later

##### [108] 2026-03-12 00:00 - Fusion 360 Browser Read - What Actually Makes It Feel Clean

Important read from the Fusion 360 screenshot:

- the Browser is visually led by hierarchy, not actions
- every row is compact and consistent
- actions are mostly hidden until needed
- row state is communicated through:
  - expand chevrons
  - small icons
  - visibility/eye toggles
  - selection highlight
- labels get the horizontal space
- the tree indentation does most of the structural work

Most important consequence:

- Fusion does not make each row look like a toolbar
- it makes each row look like one item in a tree

##### [109] 2026-03-12 00:00 - First Browser Cleanup Principles If We Want The Fusion Direction

If ParaHook should move toward this Browser style, the cleanup principles should be:

1. tree first
2. actions second
3. icons before buttons
4. selection before command clutter
5. one row anatomy repeated everywhere

Translated into Browser behavior:

- every row should mostly be:
  - chevron
  - type/state icons
  - label
  - maybe one tiny status marker
- rows should not carry a full action strip by default
- selection should be obvious
- expansion should be obvious
- labels should stay readable without fighting button noise

##### [110] 2026-03-12 00:00 - Proposed ParaHook Browser Row Anatomy

Proposed first-pass row anatomy:

- `[Chevron] [State/Icon Cluster] [Label] [Optional Meta]`

Where:

- `Chevron`
  - expand/collapse only
- `State/Icon Cluster`
  - graph icon
  - viewport icon
  - published-output icon
  - maybe later visibility/linked/shared-composition state
- `Label`
  - the main readable identity
- `Optional Meta`
  - small, quiet, right-aligned status text only when it helps

Things that should not live in the default row face:

- `Save`
- `Open`
- `Reveal`
- `New Editor`
- `Swap Editor`
- `Focus`
- `Close`

Those belong more naturally in:

- right click context menu
- maybe later a small `...` overflow affordance

##### [111] 2026-03-12 00:00 - Likely Browser Structure Cleanup

The current Browser structure probably needs to feel more like:

- `Project`
  - `Content`
  - `Graph Documents`
  - `Open Viewports`

But each section should read as a real tree branch, not a bordered mini-panel.

Likely cleanup moves:

- reduce the heavy boxed treatment around each section
- tighten row height and vertical spacing
- make indentation and chevrons do more of the hierarchy work
- let section headers be lighter and flatter
- stop making every branch look like a separate floating card

Working read:

- Fusion feels cleaner partly because the tree reads as one continuous surface
- our Browser currently feels more segmented and card-like

##### [112] 2026-03-12 00:00 - Selection Versus Actions

Fusion-style Browser behavior suggests:

- click should primarily mean:
  - select
- double click or explicit command should mean:
  - open/focus/reveal depending on row kind
- right click should mean:
  - options for that row

This is probably healthier for ParaHook too because:

- Browser selection should not be buried under action buttons
- it makes the Browser feel more like a workspace navigator
- it separates:
  - selection
  - open/focus behavior
  - secondary actions

##### [113] 2026-03-12 00:00 - What We Should Probably Keep Visible On The Row

If we want a cleaner Fusion-like Browser, the always-visible row content should probably stay limited to:

- chevron
- row-type icon
- row label
- maybe one or two tiny passive state indicators

Examples of passive state that might stay visible:

- graph open/focused state
- shared-viewer participation state
- unresolved/missing warning state

These should read as indicators, not buttons.

Working rule:

- visible row state is good
- visible row command stacks are the problem

##### [114] 2026-03-12 00:00 - First Practical Browser Cleanup Cut

A realistic first cleanup cut could be:

- keep the current Browser hierarchy and row data mostly intact
- remove the visible button strip from graph and viewport rows
- add row selection highlight polish
- add right-click context menu support for row actions
- maybe leave one tiny overflow affordance only if discoverability becomes a real problem

This would give a visible improvement without requiring:

- final Browser hierarchy redesign
- deeper output/content structure work
- richer materials/visibility controls
- bigger Browser/workspace architecture changes

Plain-English version:

- first stop making every row look like a toolbar
- then make the tree feel calm and readable

##### [115] 2026-03-12 00:00 - `Open Viewports` Currently Reads Ahead Of The Actual UI

Current mismatch:

- the Browser currently shows `Open Viewports`
- but the visible shell still mostly shows one actual floating `Spaghetti Editor` window at a time
- so the Browser list is reading more like:
  - stored editor viewport records
  than:
  - literal visible editor windows

Why this feels wrong:

- if a human sees `Open Viewports`, the normal read is:
  - these are the editor windows I currently have open
- but the current app shell is still not presenting that literally

Working read:

- `Graph Documents`
  - what graph documents exist
- `Open Viewports`
  - current editor viewport/session records in store
- visible spaghetti editor
  - mostly the currently active/focused viewport only

Likely implication:

- the Browser label is ahead of the current UI truth
- we should either:
  - rename it sooner to something more honest
  - or wait until later multi-window work makes the current label literally true

Most likely later roadmap home:

- Browser naming/behavior honesty belongs around the current Browser lane
- true literal multiple visible editor windows belongs later in:
  - `SP - Phase 13 - Multi Window Graph Editing`

Working rule:

- do not let the Browser pretend a stronger multi-window UX already exists if the shell is still only showing one active editor surface

##### [116] 2026-03-12 00:00 - `Open Viewports` Should Be The Future Home For All Editor Surfaces

Working direction:

- we probably should not throw away the `Open Viewports` area
- instead, we should define it more clearly now and let later multi-window work grow into it

Best current read:

- this section should become the Browser home for:
  - open in-app spaghetti editor float windows
  - later detached/separate editor windows
  - focus/open tracking across all editor surfaces

Best short-term rule:

- keep the Browser honest about current shell reality
- but preserve this section as the future place where all open editor surfaces will be tracked

Practical split:

- near-term Browser cleanup
  - define the intended meaning
  - clean up the wording/semantics
  - avoid overstating literal multi-window behavior today
- later `SP - Phase 13`
  - make multiple visible editor windows real
  - let this section become literal truth instead of future intent

Plain-English rule:

- `Open Viewports` is probably the right long-term home
- the current app shell just has not caught up to that meaning yet

##### [117] 2026-03-12 00:00 - Spaghetti Window Bar Should Stop Spending Top-Right Space On The Word `Drag`

Current read:

- the top-right of the floating `Spaghetti Editor` window currently says `Drag`
- this is not the best use of the most important titlebar action space
- the window already reads as draggable from the header treatment itself

Why this should change:

- top-right window-bar space is better used for explicit window actions
- `Drag` is instructional text, not a durable command
- the header can stay draggable without needing that word to occupy the action slot

Working rule:

- keep drag behavior on the title bar
- remove the visible `Drag` label from the top-right command area

##### [118] 2026-03-12 00:00 - Proposed Top-Right Spaghetti Window Actions

Proposed replacement for the current top-right `Drag` label:

- `Open In New Browser`
  - shown as an external/open arrow icon
- `Close`
  - shown as an `X`

Desired read:

- the `Spaghetti Editor` title bar should behave more like a real window frame
- top-right controls should be:
  - detach/open elsewhere
  - close

Working interaction rule:

- the rest of the title bar still supports dragging
- the far-right action cluster is reserved for real window commands

##### [119] 2026-03-12 00:00 - Split The Window-Bar Change Into Near-Term UI Cleanup Versus Later Detached-Window Truth

This idea probably has two layers:

- near-term UI cleanup
  - remove `Drag`
  - add `X`
  - add the arrow-style `Open In New Browser` affordance
  - make the floating editor header read like a real window bar
- later detached-window truth
  - make the arrow action actually open a separate browser/detached editor surface if that behavior is not fully real yet

Most likely product-safe rule:

- the close button can land as normal shell cleanup
- the open-in-new-browser button should only ship as a live action if the detach path is real enough to justify the affordance

Plain-English read:

- the titlebar cleanup is easy
- the detached-window command may belong to the later multi-window editor work if the underlying behavior is not ready yet

##### [120] 2026-03-12 00:00 - Add A Real In-App Maximize Action To The Spaghetti Window Bar

We should also add a square-style maximize button in the top-right window controls.

Desired behavior:

- this does not open a new browser window
- this does not become OS-level fullscreen
- it makes the floating `Spaghetti Editor` expand to a full-window mode inside the current ParaHook browser/app shell

Best working read:

- arrow icon
  - open in new browser / detached editor later
- square icon
  - maximize inside the current browser window
- `X`
  - close the current editor surface

Why this is useful:

- maximize is real and valuable before detached-window support is finished
- it gives the editor a more window-like control model immediately
- it separates:
  - open elsewhere
  - maximize here
  - close

Working implementation boundary:

- in-app maximize probably belongs to the nearer shell/window-behavior lane
- detached/open-in-new-browser may still depend on later multi-window support

##### [121] 2026-03-12 00:00 - Add A Minimize-To-Meatball-View Action To The Spaghetti Window Bar

We should also add a minimize control to the same titlebar action cluster.

Desired icon/read:

- downward-left arrow
  - minimize into `meatball editor view`
- upward-right arrow
  - open in new browser / detached editor
- square
  - maximize inside current app window
- `X`
  - close

Desired behavior:

- this is not close
- this is not hide-without-state
- it collapses the current floating `Spaghetti Editor` into the lighter `meatball editor view`

Why this matters:

- the titlebar should support the full basic window-state set:
  - minimize
  - maximize
  - open elsewhere
  - close
- `meatball editor view` gives ParaHook a product-specific minimize target instead of a generic taskbar metaphor

Working rule:

- if maximize is the expanded working mode
- then `meatball editor view` is the minimized/lightweight editor mode
- both should feel like state changes of the same editor surface, not separate tools

##### [122] 2026-03-12 00:00 - Maximize Should Toggle Back To The Default Floating-Editor Size

Additional behavior rule for the square maximize button:

- first click
  - maximize the current floating editor inside the current ParaHook browser/app shell
- second click while already maximized
  - restore the editor to the standard default new-window size

Working read:

- maximize should be a toggle, not a one-way action
- the restore target should be the normal default floating-editor size
- do not require the user to manually drag-resize the window back down after maximizing

Plain-English rule:

- square once = maximize
- square again = restore to the normal floating-editor size

##### [123] 2026-03-12 00:00 - Add A Half-Height Split View Action To The Spaghetti Window Bar

We should add one more top-right icon for a docked split-view state.

Desired behavior:

- clicking the new icon should stop the editor from floating over the viewport
- the current browser/app window should split vertically into two stacked halves
- viewer/viewport lives in the top half
- `Spaghetti Editor` lives in the bottom half
- the editor should take roughly half the browser height in this mode

Important read:

- this is not just "resize the floating window to be shorter"
- this is a different presentation mode where the editor is no longer overlaying the viewport
- it is closer to a docked in-app split layout than to a normal floating-window state

Working rule:

- floating mode = editor overlays the viewport and can be dragged
- split-half mode = editor docks into the lower half and the viewport owns the upper half
- maximize, minimize to `meatball editor view`, split-half, and close should all read as state changes of the same editor surface

##### [x] [124] 2026-03-12 00:00 - Split View Needs A User-Adjustable Divider, Not Just A Fixed 50/50 Cut

Once the editor enters the split-view mode, the user should be able to resize the two stacked areas.

Desired behavior:

- show a control/divider between:
  - top model viewport area
  - bottom `Spaghetti Editor` area
- let the user drag that divider to rebalance the two panes
- do not lock split mode to one permanent half-height ratio

Important read:

- the first split-state entry can default to a half-height layout
- but after entering split mode, the user should be able to adjust the proportion
- this makes split mode a real working layout, not just a temporary preset

Plain-English rule:

- split mode starts at about 50/50
- then the user can drag the divider to give more room to the viewport or the editor

##### [ ] [125] 2026-03-12 00:00 - Define What The Other Window Buttons Do While Already In Split Mode

Split mode needs explicit exit behavior for the other titlebar controls.

Locked behavior while already in split mode:

1. `meatball editor view`
   - leave split mode
   - return the model viewport to full size
   - move the `Spaghetti Editor` into the toolbar area under `Parts List` as its own separate item/surface

2. `X`
   - close the split editor surface
   - leave split mode

3. `separate browser`
   - leave split mode
   - restore the model viewport to full size
   - open/separate the `Spaghetti Editor` into its detached browser/window surface

4. `split mode`
   - acts as a toggle
   - clicking it again while already split turns split mode off
   - returns the editor to the previous non-split presentation state

5. `maximize`
   - leave split mode
   - make the `Spaghetti Editor` full-screen/fully expanded over the model viewport again like the normal in-app maximized overlay state

Important read:

- split mode is not a dead end
- every other window button should have a clean and predictable state transition from split mode
- the model viewport should recover its full-height area whenever split mode is exited unless the target mode itself replaces it

##### [x] [126] 2026-03-12 00:00 - Add A True Header-Only `collapsed` Mode Distinct From `meatball editor view`

We should also make `collapsed` a real editor-surface mode with its own `__` button.

Desired behavior:

- clicking the `__` button hides the `Spaghetti Editor` body
- only the top editor bar/header stays visible
- the model viewport returns to the main visual focus
- the user still keeps immediate access to the editor icons from that thin top strip

Important distinction:

- `collapsed`
  - header-only strip remains visible over the model viewport
- `meatball editor view`
  - editor moves into the separate dock panel below `Parts List`

Working read:

- `collapsed` is the quick "show me the model but keep editor controls near me" state
- `meatball editor view` is the more fully minimized/docked state

##### [x] [127] 2026-03-12 16:04 - `meatball editor view` Still Needs The Top Bar And Exit Controls

The current `meatball editor view` is missing an important escape/control surface.

Problem:

- once the editor moves into `meatball editor view`, the user still needs to see the editor top bar
- that top bar should retain the same shell-control cluster/icons so the user can get back out of the mode
- right now the docked editor surface is too isolated because the user loses the normal titlebar affordances

Desired behavior:

- show a compact `Spaghetti Editor` top bar inside the meatball host
- keep the shell icons visible there
- let the user leave `meatball editor view` directly from that bar

Important read:

- `meatball editor view` should feel like the same editor surface in a minimized docked state
- it should not look like a dead-end embedded panel with no clear path back to:
  - `collapsed`
  - `expanded`
  - `maximized`
  - `split view`
  - `close`

Plain-English rule:

- if the editor is in `meatball editor view`, the user should still see the editor bar and its mode/exit icons
- docking the editor should not hide the controls needed to undock or change modes

##### [x] [128] 2026-03-12 16:06 - The `Browser` Section Header Should Collapse The Entire Browser Body

The `Browser` title itself should act like a real collapsible panel header.

Desired behavior:

- clicking the `Browser` header row collapses the full Browser body
- collapsing it hides all Browser child content, including:
  - the top Browser action buttons
  - project/content branches
  - graph document rows
  - open editor rows
- clicking the header again expands it back open

Important read:

- this is panel-level collapse, not just tree-branch collapse
- the goal is to let the user quickly reclaim left-dock space when the Browser is not needed
- the header should make that capability obvious with the usual collapse affordance

Plain-English rule:

- `Browser` should work like a foldable section
- the label is not just decorative text; it is the control that shows or hides the whole Browser panel body

##### [x] [129] 2026-03-12 16:33 - The `i` Button Should Be Defined As A Simple Two-State Header/Toolbar Toggle

We should clean up the meaning of the titlebar `i` button.

Locked read:

- the `i` button controls the `Spaghetti Editor` header/toolbar area only
- it is not the same as the shell `collapsed` mode
- it should be treated as a simple two-state toggle:
  - `expanded`
    - the editor header/toolbar area is visible
    - sample/load/save/build/help/status controls remain shown
  - `collapsed`
    - the editor header/toolbar area is hidden
    - the canvas/editor body stays visible

Important distinction:

- `__`
  - collapses the whole editor shell down to the top strip
- `i`
  - collapses only the internal editor header/toolbar area

Plain-English rule:

- clicking `i` should switch only between:
  - `header expanded`
  - `header collapsed`
- the user should still keep the editor surface open in both states

##### [x] [130] 2026-03-12 16:36 - The Internal Spaghetti Toolbar Needs A Real Top-Bar Layout Pass

The internal `Spaghetti Editor` toolbar/header area is still visually disorganized.

Problem read:

- there are still controls living in the middle of the editor body that feel like toolbar content
- the color legend chips and some other graph/editor controls are sitting in the wrong area
- there is still a drag/grip-style control living in the middle instead of the toolbar feeling intentional
- the `i` button can now hide/show the internal header area, so that area needs to be worth showing

Desired direction:

- treat the internal `Spaghetti Editor` header/toolbar as one real top toolbar zone
- move toolbar-like controls up into that top area instead of leaving them stranded in the main editor body
- likely include things like:
  - graph selector
  - key graph action buttons
  - color/type legend
  - other small mode/status controls that belong to editor setup, not the node canvas body

Toolbar contents to pull up into that area:

- `Graph`
- current graph selector:
  - `Graph 1`
- graph presentation mode controls:
  - `Expanded`
  - `Collapsed`
- type/color legend entries:
  - `number` `#ffffff`
  - `boolean` `#f6d365`
  - `vec2` `#38bdf8`
  - `vec3` `#22d3ee`
  - `spline2` `#ff4e4e`
  - `spline3` `#fb7185`
  - `profileLoop` `#34d399`
  - `stations` `#a78bfa`
  - `railMath` `#9ca3af`
  - `toeLoft` `#cbd5e1`
- `Focus Node`
- current focus-node selector/value:
  - `node-500f7bbd-e00c-4de7-88ce-bf59a6cce980`
- `New Part Node`

Important distinction:

- the titlebar at the very top is the window/shell bar
- the internal toolbar under it is the editor-function toolbar
- the canvas body should feel like the working graph surface, not a place where toolbar fragments are floating around

Plain-English rule:

- when the user clicks the `i` button:
  - show the full internal editor toolbar/header area
  - or collapse that area down to a thin retained band
- the controls inside that area should be consolidated into the toolbar, not scattered across the canvas region

Additional behavior to lock:

- when the user clicks the `i` button to collapse the internal toolbar/header area, it should not disappear completely
- instead, it should reduce down to a very small retained height, around `10px`
- that lets the toolbar feel hidden visually while still leaving a thin adjustable surface
- the user should still be able to grab/drag that retained bar downward to restore a custom toolbar height

Important read:

- this should behave more like a minimized resizable header band than a full remove/show toggle
- the user should not lose the ability to manually pull the toolbar back open from the editor surface itself

Confirmed behavior read:

- yes, the `i` button should adjust the internal toolbar/header height down to its minimized retained band
- no, it should not fully hide/remove the toolbar area

##### [x] [131] 2026-03-12 16:52 - The Internal Toolbar Should Be Reorganized Into Expandable Sections Without Removing Features

Suggested cleanup direction:

- keep all current `Spaghetti Editor` toolbar features
- do not remove buttons, legends, selectors, or status reads
- instead, reorganize the toolbar into clear collapsible sections like `How To Use Spaghetti Editor`

Why:

- the toolbar is growing
- even after consolidating controls into the top area, it can still feel visually dense
- not every section needs to stay open all the time

Suggested section pattern:

- each toolbar group should be its own collapsible block
- blocks should default to `closed` unless they are core to the current editing session
- the user can expand only the groups they need

Suggested grouping:

- `Graph`
  - current graph selector
  - `Expanded`
  - `Collapsed`
- `Node Focus`
  - `Focus Node`
  - focus-node selector/value
- `Part Nodes`
  - `New Part Node`
  - add/create controls
- `Samples`
  - `Load Baseplate`
  - `Load Baseplate - ToeHook`
  - `Load Baseplate - HeelKick`
  - `Load Cycle`
- `Build`
  - `Save Graph`
  - `Compile`
  - `Build`
  - build/status messaging
- `Viewer`
  - `Add To Shared Viewer`
  - `Remove From Shared Viewer`
- `Type Legend`
  - all type/color legend chips
- `Diagnostics`
  - topo length
  - diagnostics counts
  - warnings/errors

Important read:

- this is a structure cleanup, not a feature cut
- the goal is to reduce clutter and improve scanning
- the `i` button still controls the whole internal toolbar band
- the collapsible groups live inside that toolbar band once it is open

Plain-English rule:

- opening the toolbar with `i` should not dump every control in one long wall
- it should reveal a set of tidy expandable sections the user can open as needed

##### [ ] [132] 2026-03-12 17:41 - Add A Titlebar `live / pause` Toggle Between The Graph Dropdown And Build Button

Suggested read:

- this is not a brand-new build system
- the app already has most of the plumbing needed
- the real work is mostly surfacing the existing build policy in the `Spaghetti Editor` titlebar and wiring spaghetti graph edits into it cleanly

Current seam read:

- `useAppStore` already has `buildPolicy: 'live' | 'release' | 'manual'`
- `useAppStore.setBuildPolicy(...)` already exists
- `useAppStore.requestGraphDocumentBuild(graphDocumentId)` already exists
- the spaghetti build path already computes changed-only work through `buildRequestFromBuildInputs(...)`
- that means the "only rebuild the parts / outputs that changed" behavior is already mostly the existing path, not new logic

Important reality check:

- the new button itself is easy
- but I do not currently see a spaghetti-side live-edit subscription that automatically calls `requestGraphDocumentBuild(...)` when the graph changes
- so this is not just a one-button CSS pass
- it is a small UI feature plus one behavior-glue pass

Recommended product read:

- label the button as `Live` when auto-build is enabled
- label it as `Pause` when auto-build is disabled
- place it in the titlebar between:
  - graph dropdown
  - manual build button

Recommended technical read:

- do not invent a separate new "live titlebar mode"
- reuse `buildPolicy`
- for the first pass, the titlebar toggle should map to:
  - `Live` -> `buildPolicy = 'live'`
  - `Pause` -> `buildPolicy = 'manual'`
- ignore `release` in this titlebar control unless we explicitly want a three-state cycle later

What still needs to be added:

- a spaghetti-edit watcher/subscription
- when the active/focused graph document changes in spaghetti mode:
  - if `buildPolicy === 'live'`
  - request `requestGraphDocumentBuild(activeGraphDocumentId)`
- this should be guarded so simple UI shell changes do not trigger unnecessary builds
- likely debounce slightly so rapid node drags / rewires do not spam build requests

Good implementation seam candidates:

- `src/app/AppShell.tsx`
  - add the new titlebar button between dropdown and build
- `src/app/store/useAppStore.ts`
  - keep `buildPolicy` as the source of truth
  - likely host the spaghetti live-build subscription or helper
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - only if needed for stable change detection signals
- `src/app/theme/v15Theme.css`
  - style the button to match the titlebar control cluster

Complexity read:

- UI only: easy
- full correct behavior: small-to-medium

Reason:

- changed-only build routing already exists
- policy state already exists
- the missing piece is the automatic trigger from spaghetti graph edits

##### [x] [133] 2026-03-12 18:04 - Clean Up The Recent Spaghetti / Meatball Titlebar And Toolbar Seams

Recent cleanup batch now landed:

- moved the graph dropdown and manual build button into the dark-blue `Spaghetti Editor` titlebar
- tightened the titlebar graph dropdown so it anchors left and behaves more like a compact label control instead of a stretched field
- renamed the docked mode header from `Spaghetti Editor` to `Meatball Editor`
- changed the docked/meatball titlebar to a stacked layout:
  - row 1 = title
  - row 2 = graph dropdown + build
  - row 3 = remaining shell buttons
- changed the mode button behavior so:
  - normal spaghetti mode shows `SP`
  - meatball mode shows `MB`
  - active meatball mode uses a red state
  - clicking the mode button while already in meatball returns back to normal spaghetti mode
- entering meatball mode now also auto-collapses the internal spaghetti header/toolbar

Important toolbar cleanup read:

- the toolbar scroll area needed follow-up work after the section reorg
- the weird behavior was not just "missing scrollbar styling"
- the real issues were:
  - the scroll region ownership was confusing
  - the toolbar box and canvas seam did not read like two clear stacked surfaces
  - resizing the toolbar could feel visually disconnected from the pointer

What was tightened:

- the boxed toolbar area is now treated as the bounded toolbar-height region
- the toolbar height restore path now defaults cleanly to `150px`
- the toolbar drag/resize state now uses a stricter fixed pixel height/flex basis so it tracks the mouse more directly
- the toolbar surface was made more opaque so the canvas does not visually bleed through it as much

Plain-English read:

- titlebar controls now feel more intentional
- meatball mode reads like its own editor surface instead of a relabeled spaghetti window
- the toolbar/canvas boundary is still an active polish seam, but it is materially cleaner than the earlier mixed/bleeding state

##### [ ] [134] 2026-03-12 18:39 - Add A Single Browser Pop-Out Mode As An In-App Floating Panel

Planning direction:

- keep exactly one `Browser`
- keep it docked in the left column by default
- add an optional in-app floating mode
- do not treat this as detached/new-browser window work

Product read:

- the user should be able to switch the same Browser between:
  - docked left-panel mode
  - floating in-app window mode
- this is a shell/layout convenience feature
- it is not multi-browser support
- it is not separate OS/browser window support

Recommended first-pass behavior:

- one Browser instance only
- default state = docked
- a titlebar or panel action can toggle `Pop Out Browser`
- floating Browser should:
  - render inside the current app window
  - be draggable
  - support close/restore back to dock
  - keep the same Browser contents and selection state
- docked restore should put it back in the normal left column without losing Browser context

Scope boundary:

- in scope:
  - Browser docked/floating shell state
  - Browser floating host in `AppShell`
  - Browser window chrome/drag/close/restore behavior
- out of scope:
  - more than one Browser
  - detached/new-browser windows
  - a generic "all panels can float" system unless that becomes the easiest implementation seam

Technical read:

- current `BrowserPanel` is just a docked panel render
- current floating-window shell exists only for `Spaghetti Editor`
- this is probably medium work, not tiny, because the Browser needs a new shell host and docked/floating state
- it is still much smaller than true detached-window support

Good implementation seam candidates:

- `src/app/AppShell.tsx`
  - own Browser docked vs floating render placement
- `src/app/panels/BrowserPanel.tsx`
  - expose a small pop-out / restore control
- `src/app/store/useAppStore.ts`
  - likely own Browser shell mode plus floating position/size if we want it outside spaghetti store
- `src/app/theme/v15Theme.css`
  - floating Browser host styling

Roadmap read:

- this belongs near the current workspace/shell lane around `[2.1]`
- it should not be pushed all the way to detached-window work

##### [ ] [135] 2026-03-12 22:16 - `Window Fill` Needs To Target All Non-Graph Spaghetti Chrome, Not Just The Title Bar

Research finding:

- the area under the blue `Spaghetti Editor` title bar is not one single body box
- the current shell is layered
- `Window Fill` cannot be treated as one wrapper-opacity setting without colliding with graph content

Current hierarchy read:

- floating shell host in `src/app/AppShell.tsx`
  - `.SpaghettiFloatingWindow.SpaghettiWindowShell`
- title bar in `src/app/AppShell.tsx`
  - `.SpaghettiFloatingHandle`
- first body wrapper under the title bar in `src/app/AppShell.tsx`
  - `.SpaghettiFloatingBody`
- panel root in `src/app/panels/SpaghettiPanel.tsx`
  - `.V15Panel.SpaghettiPanelRoot`

Then inside `SpaghettiPanelRoot`:

- `.SpaghettiPanelHeaderShell`
  - window settings section
  - focus row
  - toolbar scroll block
- `.SpaghettiPanelCanvasWrap`
  - canvas container shell
- `.SpaghettiDebugDrawer`
  - debug section shell

Then inside the canvas/editor body:

- `SpaghettiEditorBoundary`
- `SpaghettiEditor`
  - `.SpaghettiEditorRoot`
  - `.SpaghettiEditorShell`
  - `.SpaghettiEditorBody`
- `.SpaghettiCanvasStage`
  - actual graph content layer

Why the current bug happened:

- `Window Fill` was originally applied at the `.SpaghettiWindowShell` level
- that made the graph content fade too because everything lived under the same shell
- moving the effect off the shell wrapper fixed the graph-content collision
- but the current pass only reaches the title bar strongly enough, not the full non-graph body chrome

What we should do:

- define `Window Fill` as the transparency control for all non-graph editor chrome surfaces
- define `Graph Content` as only:
  - user-created node panels/cards
  - wires
  - waypoints
  - canvas-side preview/output cards
- do not apply `Graph Content` to the canvas box itself

Recommended target surfaces for `Window Fill`:

- `.SpaghettiFloatingHandle`
- `.SpaghettiFloatingBody`
- `.SpaghettiPanelRoot`
- `.SpaghettiWindowSettingsSection`
- `.SpaghettiFocusRow`
- `.SpaghettiPanelHeaderBlock`
- `.SpaghettiPanelCanvasWrap`
- `.SpaghettiDebugDrawer`

New follow-up refinement:

- the title bar should probably be separated from general `Window Fill`
- add a dedicated `Title Bar` transparency slider in the `i` window-settings section
- then redefine `Window Fill` to mean the non-titlebar editor chrome/body surfaces

Recommended slider split:

- `Title Bar`
  - only the blue top title bar / meatball title bar surface
- `Window Fill`
  - floating body
  - panel root
  - settings/focus/toolbar/debug/canvas-shell surfaces
- `Graph Content`
  - user-created graph panels/cards
  - wires
  - waypoints
  - preview/output content inside the canvas

Recommended target surfaces to exclude from `Window Fill` direct opacity:

- `.SpaghettiCanvasStage`
- graph nodes/wires/waypoints/preview cards as content

Implementation read:

- `Window Fill` should not use wrapper-level `opacity`
- instead it should drive the actual surface/background alpha of the stacked chrome layers
- this likely means a shared set of viewport-scoped CSS vars for:
  - outer body surface
  - toolbar/settings/focus surfaces
  - canvas container surface
  - debug drawer surface

Desired product read:

- lowering `Title Bar` should fade only the top shell bar
- lowering `Window Fill` should make the rest of the editor shell feel more see-through
- the user should still be able to keep graph content relatively visible or solid using the separate `Graph Content` slider
- the canvas box should remain a shell surface
- the things the user places inside the canvas should remain a separate content-opacity channel

##### [ ] [136] 2026-03-12 22:20 - The Spaghetti Editor Shell Names Should Eventually Be Aligned To Product-Surface Names

Priority read:

- this is useful
- not urgent
- should happen after the shell/body/content boundary is more stable

Why this came up:

- the current class/component names reflect implementation history more than product structure
- several names are technically accurate but do not map cleanly to the actual editor mental model
- that makes later appearance/settings/shell work harder to reason about

Current names that are a little muddy:

- `SpaghettiFloatingHandle`
- `SpaghettiFloatingBody`
- `SpaghettiPanelRoot`
- `SpaghettiPanelHeaderShell`
- `SpaghettiPanelHeaderBlock`
- `SpaghettiPanelCanvasWrap`

Recommended eventual rename direction:

- `SpaghettiFloatingHandle` -> `SpaghettiWindowTitleBar`
- `SpaghettiFloatingBody` -> `SpaghettiWindowBody`
- `SpaghettiPanelRoot` -> `SpaghettiWindowContent`
- `SpaghettiPanelHeaderShell` -> `SpaghettiToolbarShell`
- `SpaghettiPanelHeaderBlock` -> `SpaghettiToolbarScrollArea`
- `SpaghettiPanelCanvasWrap` -> `SpaghettiCanvasShell`

Names that already read well enough:

- `SpaghettiCanvasStage`
- `SpaghettiDebugDrawer`

Recommendation:

- do not do this rename pass immediately
- first stabilize the window-fill vs graph-content surface boundary
- then do one dedicated naming cleanup pass before more shell-polish or appearance work is layered on top

##### [ ] [137] 2026-03-12 22:36 - Add A Reusable Slider Clamp / Range System Starting From The `i` Menu

Planning goal:

- add a new control in the `i` window-settings menu that lets the user adjust slider clamp/range behavior
- first proving ground:
  - `Title Bar`
  - `Window Fill`
  - `Graph Content`
- but the implementation should be shaped so it can later apply to all sliders across the app

Product read:

- some sliders are currently hard-fixed to one min/max range
- users may want to tighten or widen the usable range depending on the task
- this should not require rewriting every slider separately

Recommended system shape:

- create a shared slider-range model, not one-off per-slider hacks
- each slider gets:
  - `baseMin`
  - `baseMax`
  - `step`
  - `defaultValue`
  - optional `userClampMin`
  - optional `userClampMax`
- effective runtime slider range becomes:
  - `effectiveMin = max(baseMin, userClampMin if set)`
  - `effectiveMax = min(baseMax, userClampMax if set)`

Recommended terminology:

- prefer `Range` / `Clamp` / `Limits`
- example labels:
  - `Slider Range`
  - `Clamp Min`
  - `Clamp Max`
  - `Reset Slider Range`

First-pass UI direction:

- add a small section or toggle inside the `i` menu for slider range controls
- start only with the three opacity sliders:
  - `Title Bar`
  - `Window Fill`
  - `Graph Content`
- each can expose:
  - current min
  - current max
  - reset to default

Recommended architecture:

- build one reusable slider-config layer instead of storing min/max inline in JSX
- likely shape:
  - slider id
  - slider metadata
  - optional per-window override map
- for the `i` menu sliders, keep the override state per `editorViewportId`
- later, other slider groups can choose:
  - per-window overrides
  - per-panel overrides
  - global app overrides

Why this is worth doing right:

- the app already has many sliders
- if we special-case the first three now, later expansion will get messy
- a shared slider-range system lets the same mechanism drive:
  - opacity sliders
  - wire curve
  - viewport split ratios if desired later
  - material/view controls later

Good first implementation boundary:

- in scope for the first pass:
  - reusable slider-range model
  - per-viewport override storage for the `i` menu sliders
  - UI for min/max clamp on the three opacity sliders
- out of scope for the first pass:
  - migrating every slider in the app immediately
  - persistence to project data
  - full global slider-preferences system

Important behavioral rule:

- user clamp values should never exceed the hard safe base range
- reset should always return the slider to its canonical app defaults

Recommendation:

- do this as a small system pass, not as a one-off feature for the three opacity sliders only
- start with the three opacity sliders, but define the API so later sliders can adopt it with minimal new logic

##### [ ] [138] 2026-03-12 22:42 - Build A Reusable ParaHook Slider Template Before Adding Clamp Controls

Planning goal:

- before adding slider clamp/range controls, create one reusable slider visual/control template
- start from the current `i` menu sliders as the first target
- preserve the current simple native slider as the fallback/reference template for now

Product direction:

- the new slider should be more compact and easier to read at a glance
- it should feel more like the older driver slider language
- the control should combine:
  - label
  - fill bar
  - value readout
  - left/right step buttons
into one unified horizontal control

Recommended visual structure:

- left end cap button:
  - decrement
  - visually attached to the bar
- center fill bar:
  - clickable
  - draggable
  - fill amount shows current value
- label inside the left side of the bar:
  - example: `Title Bar`
- value inside the right side of the bar:
  - example: `80%`
- right end cap button:
  - increment
  - visually attached to the bar

Desired interaction model:

- drag anywhere on the fill bar to scrub value left/right
- click within the bar to jump/set the value
- click left cap to step down
- click right cap to step up
- end-cap buttons should feel like seamless extensions of the same control, not separate loose buttons

Important styling read:

- the current native range slider should stay available as the default/fallback template
- the new slider becomes a second, preferred ParaHook-specific template
- over time this new template can replace many app sliders if it proves clean enough

Why this should come first:

- clamp/range controls will be easier to show on a custom slider than on the current native range input
- this creates one design system primitive instead of repeatedly styling sliders ad hoc

Recommended implementation shape later:

- create a reusable slider component rather than rebuilding it inside each panel
- likely props:
  - label
  - value
  - min
  - max
  - step
  - onChange
  - onStepDown
  - onStepUp
  - display formatter
- later clamp markers / sub-range overlays can be added to this same component

First-pass proving ground:

- `Title Bar`
- `Window Fill`
- `Graph Content`

Future likely adoption:

- wire curve
- other editor/view sliders
- future clamp-aware sliders elsewhere in the app

[ ] [139] Add An `Edit Clamp` Mode To The New ParaHook Slider System

Planning goal:

- add a new clamp-edit button in the `i` menu that temporarily switches the new ParaHook sliders into a clamp-edit mode
- start by proving it on:
  - `Title Bar`
  - `Window Fill`
  - `Graph Content`
- build it as part of the shared slider system so the same clamp UX can spread later to other sliders in the app

Core product read:

- normal mode:
  - the slider shows the current live value fill
- `Edit Clamp` mode:
  - the slider changes visual state
  - the fill/range turns orange
  - the bar now shows the allowed clamp range instead of only the current value

Desired user interaction:

- when `Edit Clamp` is on:
  - the user can drag the left clamp boundary
  - the user can drag the right clamp boundary
- example:
  - current `Title Bar` clamp is `65` to `100`
  - the user should be able to grab the left boundary and drag it back to `0`
- when the user exits `Edit Clamp`:
  - the clamp range is saved
  - the slider returns to normal mode
  - normal value fill then respects the saved clamp range

Recommended visual behavior:

- normal value fill remains the current cool/blue style
- clamp-edit mode should switch to a clearly different orange range style
- the slider should show:
  - total possible range
  - active allowed clamp range
  - left and right draggable clamp handles
- this should feel similar to Ableton-style range editing:
  - distinct range overlay
  - clear left/right range edges
  - obvious difference between editing value vs editing clamp

Important architecture recommendation:

- do not build this as one-off logic for the three opacity sliders
- extend the shared ParaHook slider component so it can support:
  - base min/max/step
  - current value
  - optional clamp min/max
  - normal mode
  - clamp-edit mode
- later sliders elsewhere in the app should be able to opt into the same system without a redesign

Likely implementation shape later:

- shared slider state model per slider:
  - `min`
  - `max`
  - `step`
  - `value`
  - `clampMin`
  - `clampMax`
- shared UI mode flag:
  - `isEditingClamp`
- slider visuals:
  - normal fill layer
  - clamp-range layer
  - left clamp handle
  - right clamp handle

Why this is worth doing:

- gives the user direct control over slider limits instead of hardcoded clamps only
- makes the new slider system more powerful right away
- sets up a reusable clamp-aware slider primitive for future controls across ParaHook

Recommended clarifications before implementation:

- `Edit Clamp` should be one mode for the full window-settings section, not a separate mode per slider
- in clamp mode:
  - the orange band shows the allowed clamp range
  - the current value should still remain visible inside that range as its own marker
- the clamp handles and the current value marker should look visually different
- the left/right end-cap buttons should continue changing the current value, not the clamp bounds
- clamp bounds themselves should be edited by dragging the clamp handles while clamp mode is active

Recommended data model:

- do not fake this by overwriting the real slider min/max
- keep:
  - `baseMin`
  - `baseMax`
  - `clampMin`
  - `clampMax`
  - `value`
- then constrain `value` so it always lives inside the active clamp range

Recommended behavior rules:

- if the user narrows the clamp past the current value:
  - snap the value into the new allowed range
- double-click the left clamp handle:
  - reset that side to the full base minimum
- double-click the right clamp handle:
  - reset that side to the full base maximum
- `Reset Window Style` should also reset the clamp ranges for these sliders once clamp mode exists

Recommended visual read:

- normal mode:
  - blue value fill
- clamp-edit mode:
  - orange allowed-range overlay
  - current value marker still visible

Main caution:

- clamp mode should edit the allowed range, not silently replace normal value editing
- the UI should always make it obvious whether the user is changing:
  - the current value
  - or the allowed clamp range

[ ] [140] Add A Collapsible Titlebar Action Cluster With Reveal Arrow

Planning goal:

- add a new titlebar button that controls whether the full action cluster is shown or minimized
- use an arrow icon:
  - minimized state shows `<`
  - expanded state shows `>`

Core product read:

- minimized action cluster:
  - only show the core window buttons
  - intended set:
    - `__`
    - full screen / maximize
    - split
    - `X`
- expanded action cluster:
  - show the full titlebar action set
- when the full cluster is visible:
  - the reveal button should flip state and show `>`
  - clicking it should collapse the cluster back down

Recommended behavior:

- minimized:
  - action strip is compact
  - only the essential window controls stay visible
- expanded:
  - all titlebar actions are visible again
- maximized mode:
  - always show the full action set
  - do not force the reduced/minimized action strip while maximized

Recommended motion:

- do not hard-cut the buttons on/off
- animate the action cluster so the reveal arrow appears to slide over and expose or hide the buttons
- the arrow should feel like the leading edge of the action tray, not a separate floating button

Likely implementation direction later:

- reorder the titlebar buttons so the three always-visible controls stay grouped together
- place the reveal arrow adjacent to the hidden/revealed action group
- treat the hidden buttons as one animated cluster rather than individually toggling each button

Why this is worth doing:

- reduces titlebar clutter in the common compact state
- preserves access to advanced window controls without permanently occupying titlebar space
- gives the Spaghetti titlebar a cleaner shell-language that can later spread to related surfaces if it works well

[ ] [141] Constrain Spaghetti Split Mode To The Viewport And Add Internal Scroll When Compressed

Planning goal:

- fix split mode so the lower `Spaghetti Editor` pane stays contained inside the split viewport area
- prevent the editor body/toolbar from visually stretching over the docked toolbar panels beside it
- when the split gets too small vertically:
  - keep the split pane bounded
  - let the internal editor content scroll instead

Core product read:

- split mode should behave like a true bounded pane inside the viewport
- the editor should not overflow across the left/right dock UI
- if the split editor becomes too short:
  - the toolbar/header area should stay inside the pane
  - a scrollbar should appear for the content that no longer fits

Recommended implementation direction later:

- keep the split editor host clipped to the split viewport bounds
- make the relevant inner Spaghetti body region the scroll owner when space becomes constrained
- do not let the outer split pane itself visually spill past the viewport shell
- preserve the current split drag behavior, but move overflow handling inward instead of outward
- reserve a permanent scrollbar gutter on the internal scroll owner so the toolbar width does not jump when scrolling becomes necessary
- make the scrollbar width match the visual width language of the left vertical divider
- when the scrollbar appears:
  - it should use the reserved gutter
  - the neighboring resize/divider line should shift over slightly instead of shrinking the visible toolbar content width

Why this is worth doing:

- makes split mode read like a real docked layout instead of a stretched overlay
- avoids visual collisions with the surrounding toolbar panels
- keeps the editor usable even when the split ratio is pushed to a very small height

[ ] [142] Ctrl-Click The Split Spaghetti Title Bar To Detach Back Into A Floating Editor

Planning goal:

- while the `Spaghetti Editor` is in split mode:
  - `Ctrl + click` on the dark blue title bar should detach it from the split layout
  - the lower split editor should become a normal floating `Spaghetti Editor` window again

Core product read:

- this is a fast escape hatch out of split mode
- the user should not need to hunt for another shell control when they already have the title bar under the mouse
- the action should feel like "pull this editor back out of the docked split"

Expected behavior:

- `Ctrl + click` the split-mode title bar
- exit split mode immediately
- restore the main model viewport so it fills the browser window again
- still respect the current left toolbar split rules:
  - if the left dock is split/locked, keep that layout intact
  - only remove the lower split editor pane
- create or restore the normal floating `Spaghetti Editor`
- the floating editor should appear ready to move as a normal window again

Recommended implementation direction later:

- treat this as a titlebar shortcut for "detach from split"
- wire it only on the split-mode Spaghetti title bar, not all editor title bars
- restore the active viewport to the normal floating editor presentation
- do not reinterpret this as detached/new-browser behavior
- preserve the current graph binding, window appearance settings, and editor-local shell state while leaving split mode

Why this is worth doing:

- gives split mode a fast expert exit path
- matches the mental model that the split editor is a temporarily docked version of the same editor surface
- keeps split mode feeling flexible instead of trapping the editor in the lower pane

[ ] [143] Normal-Drag The Split Spaghetti Title Bar To Resize Split Height

Planning goal:

- while the `Spaghetti Editor` is in split mode:
  - normal click-and-drag on the dark blue title bar should resize the split height
  - this should mirror the existing horizontal split-bar resize behavior

Core product read:

- the split editor title bar should behave like an alternate resize grab area
- this is not a detach gesture
- this is not a floating-window drag

Expected behavior:

- normal drag on the split-mode title bar
- adjust the split ratio live, same as dragging the horizontal split divider
- keep the lower editor docked in split mode
- keep the toolbar/viewport coordination rules intact

Recommended implementation order:

- do `[142]` first
  - `Ctrl + click` detach is a cleaner, discrete command
  - it has lower gesture ambiguity
- do `[143]` second
  - normal-drag titlebar resize overlaps more directly with existing split-shell expectations
  - it should be added after split detach behavior is stable

Why this is worth doing:

- gives split mode a larger, easier grab target for height changes
- reduces reliance on the thin horizontal resize bar alone
- keeps the title bar useful in split mode without overloading the default click behavior

[ ] [144] Split Detach Should Continue As A Live Floating Drag Until Mouse-Up

Planning goal:

- when the user detaches the split `Spaghetti Editor` back into a floating window:
  - the same pointer session should continue dragging the floating editor
  - the user should be able to place it before releasing the mouse

Core product read:

- detaching from split should feel like pulling the editor out of the lower pane
- it should not snap to floating and then force a second click-drag
- docking should become available during that same live drag

Expected behavior:

- `Ctrl + click` on the split title bar:
  - quick detach
  - exit split mode
  - return to a normal floating editor without continuing a drag
- `Ctrl + drag` on the split title bar:
  - detach from split mode
  - immediately hand off into a live floating drag
  - keep the floating editor under the same pointer session until mouse-up
- on mouse-up after a `Ctrl + drag` detach:
  - if over a valid dock target, show/commit the existing ghost docking behavior
  - otherwise leave the editor floating where it was placed

Recommended implementation direction later:

- keep the commands distinct:
  - normal drag in split mode = resize split height
  - `Ctrl + click` = quick detach
  - `Ctrl + drag` = detach and continue dragging as a floating window
- treat `Ctrl + drag` detach as a handoff into the existing floating-window drag session
- preserve pointer offset from the title bar so the movement feels continuous
- reuse the same ghost-preview docking system used by Browser / meatball docking where possible
- allow the floating editor to dock back into the toolbar area only if the pointer is released over a valid target
- do not auto-dock on hover alone; only commit docking on mouse-up

Why this is worth doing:

- makes split-detach feel like direct manipulation instead of a two-step command
- reduces friction when moving from split editing back to floating editing
- creates a natural bridge into future dock/undock behaviors for the floating editor

[ ] [145] Dragging A Floating Spaghetti Editor Toward The Bottom Should Offer Split-Dock

Planning goal:

- when the `Spaghetti Editor` is floating and the user drags the blue title bar toward the bottom of the screen:
  - show a bottom ghost preview
  - allow the floating editor to auto-dock into split mode on mouse-up

Core product read:

- this should feel like docking the floating editor back into the lower split region
- the user should be able to drag downward and discover split mode as a placement target
- the bottom split ghost preview should communicate "drop here to dock into split mode"

Expected behavior:

- user drags the floating `Spaghetti Editor` downward by the title bar
- when the pointer enters the valid bottom docking zone:
  - show a ghost preview across the lower split region
  - preview should read as the future lower split editor pane
- the valid docking zone should be tight:
  - the bottom edge of the floating title bar should need to come within roughly `10-20px` of the bottom docking seam
  - do not measure this from the raw cursor alone
  - the user is visually placing the shell by the title bar, so the title bar edge should be the docking trigger
- on mouse-up over that preview:
  - convert the floating editor into split mode
  - place it into the lower split region
  - restore the model viewport to the upper split region
  - preserve existing left-toolbar split rules if they are active
- on mouse-up outside the preview:
  - keep the editor floating

Recommended implementation direction later:

- reuse the existing ghost-preview approach from Browser / meatball docking where possible
- define a bottom split docking target in the viewport area rather than the left dock
- treat this as a float-to-split docking transition, not a separate new editor creation path
- preserve graph binding, window appearance settings, and editor-local shell state across the transition

Why this is worth doing:

- makes split mode discoverable from the floating-editor workflow
- gives the app a more direct "dock this editor into the bottom workspace" gesture
- complements the split-detach work by making the inverse transition feel equally direct

[ ] [146] Gizmo Should Start Small And Expand With The View Panel

Planning goal:

- make the default gizmo footprint much smaller
- make the `View` button below it match that smaller width by default
- when the user opens the `View` panel, expand both the gizmo and the `View` button back to the current larger presentation

Core product read:

- the gizmo should feel lighter and less dominant when the `View` panel is closed
- opening `View` should temporarily promote that whole right-side viewer-control area into its current larger working size
- closing `View` should return the gizmo and button width back to the compact default

Expected behavior:

- default / collapsed `View` state:
  - gizmo is noticeably smaller than it is now
  - `View` button width is also reduced to match that compact state
- when the user clicks `View`:
  - the `View` panel opens
  - the gizmo expands to the current larger size
  - the `View` button width expands with it
- while expanded:
  - the user can still resize the gizmo / view area using the existing control behavior
- when the user closes `View`:
  - the `View` panel closes
  - the gizmo returns to the smaller default size
  - the `View` button width also returns to the smaller default width

Recommended implementation direction later:

- treat this as a small viewer-control shell behavior, not a gizmo interaction redesign
- use two presentation states for the right-side viewer control cluster:
  - compact
  - expanded
- let the expanded state inherit the current larger gizmo sizing rather than inventing a new third size
- preserve manual resize while expanded, but allow close/reset to return to the compact baseline
- make the gizmo size follow the `View` panel state rather than adding a second separate gizmo toggle
- closing `View` should always return to one clean compact baseline instead of preserving a custom collapsed size
- while `View` is open, the expanded state can temporarily remember the user-adjusted size for that session
- animate both width and scale together so the gizmo feels intentionally resized rather than cropped
- keep compact-mode hit targets usable so the gizmo remains functional, not just decorative

Why this is worth doing:

- reduces visual weight in the default workspace
- keeps the gizmo available without letting it dominate the viewer corner
- makes the `View` panel feel like the thing that owns the larger right-side control footprint

[ ] [147] Preview Mode Build Policy Should Be Preserved And Moved Into The Spaghetti Editor Title Bar

Planning goal:

- keep the useful `Build Policy` behavior from the old `Preview Mode` panel
- remove the need for that policy control to live in the left toolbar
- move the control into the dark blue `Spaghetti Editor` title bar

Core product read:

- `Build Policy` is still valuable, even if `Preview Mode` itself is legacy
- the policy belongs with the active editor workflow, not in a separate startup/mode panel
- this should become part of the normal `Spaghetti Editor` shell controls
- this is not a one-time migration of the old button; every `Spaghetti Editor` viewport should have its own local build-policy control
- the control should only affect the editor viewport it belongs to, not all open editors globally
- longer term, the title-bar control should become the editor-facing entry point for a deeper Browser-owned build-policy system

Requested behavior:

- preserve the current three policy states:
  - `Live`
  - `Release`
  - `Manual`
- intended use:
  - `Live`
    - when the user changes params, the model updates while they slide
    - hooking wires should also update live
  - `Release`
    - when the user changes params, the model updates only when the user releases the slider
    - hooking wires should update on release/commit instead of continuously
  - `Manual`
    - the editor does not rebuild unless the user explicitly clicks `Build`
- add a new small title-bar button before the current build button
- in the same pass, change the build button label from `[]` to plain `Build`
- spell the three policy labels out as full words:
  - `Live`
  - `Release`
  - `Manual`

Recommended implementation direction later:

- place the new policy button in the blue title bar near the graph dropdown and build button
- keep it compact and titlebar-friendly rather than opening a large separate panel
- the control can start as a cycle button or compact dropdown, as long as the active policy is readable as full words
- this migration should happen before deleting the old `Preview Mode` panel so the feature is preserved
- the execution path will likely need to hook into editor-local param slider and wire-commit behavior rather than only reusing the old global preview-mode path
- first pass:
  - make the control local to the current `Spaghetti Editor` viewport
  - let the editor behavior respond immediately to that local policy
- later Browser-facing pass:
  - expose the same `Live / Release / Manual` policy per graph/object in the Browser
  - let the Browser become the longer-term source of truth for graph/object build behavior
  - tie that policy into the Browser build/status bar surfaces

Planned Browser feature direction:

- each graph / object should eventually expose a build policy in the Browser
- parent policy can propagate to child objects by default
- if the user changes a parent policy, all inheriting children should update to match
- later the system can allow explicit child overrides where needed
- this would let the user break down dense models more intentionally:
  - some graphs/objects `Live`
  - some `Release`
  - some `Manual`

Why this is worth doing:

- keeps one of the few genuinely useful `Preview Mode` features
- reduces the amount of leftover legacy UI that the user still has to visit
- makes build behavior feel like part of editing the graph, not part of a separate old shell
- keeps multiple open `Spaghetti Editor` viewports free to run at different rebuild policies depending on complexity
- creates a path toward Browser-side per-graph/per-object build management instead of one flat global rebuild policy

[ ] [148] Browser Build Bar Should Be One Row And Use Layered State Instead Of Extra Badges

Planning goal:

- add a slim Browser build/status control that fits the new compact ParaHook control language
- keep each graph row to one efficient line
- avoid falling back to multi-row badges or bulky status blocks

Core product read:

- Browser graph rows should stay tree-first and easy to scan
- build/runtime state should read as a compact attached bar, not a second dashboard row
- policy, build state, and open/active state need to layer without turning the row into clutter

Requested direction:

- use one row only
- graph label stays on the left
- a slim status fill bar sits on the row
- replace the current low-value `G` icon with the build-policy control on the left side of the row
- the tiny policy button cycles:
  - `Live`
  - `Release`
  - `Manual`
- the fill bar itself represents graph state:
  - clean / good
  - dirty
  - building
  - error later if needed

Layered row-state idea:

- open/active state should not require a separate large badge row
- when a graph is open and/or active, the user can click/select the row and that active highlight becomes another information layer
- closed graphs can still show build-policy + dirty/clean state without pretending they are active
- this gives the row multiple readable layers:
  - selection / active highlight
  - build-state fill bar
  - tiny policy control

Recommended implementation direction later:

- keep the Browser build bar visually aligned with the newer slider/select language:
  - one attached row
  - no stacked extra controls
- reuse the compact fill-bar feel from the new Para slider system
- reuse the overall status language from `TitleStatusBar` / `BuildStatsDrawer`, but compress it into one row
- do not add a separate text badge if the bar and active highlight can already carry the meaning
- split the work into two stages:
  - now:
    - Browser row shell redesign
    - remove/replace `G`
    - add the policy button visually
    - add the slim state bar
    - improve open/active row highlighting
  - later:
    - Browser-owned build policy as the real source of truth
    - parent/child inheritance
    - coordination with editor titlebar build policy and build bars

What can be done now:

- the row UI shell
- the one-line bar layout
- replacing `G` with the policy button
- temporary per-graph policy state if needed for the UI pass

What should wait:

- full policy inheritance
- full Browser/titlebar coordination
- deeper build-policy ownership architecture

Why this is worth doing:

- keeps Browser rows slim and readable
- lets closed graphs still communicate useful state
- gives open/active graphs one more visual layer without adding clutter
- creates a clean future home for Browser-side build-policy ownership

[x] [149] Left Dock Resize Should Temporarily Push And Lock Floating Spaghetti Editors

Planning goal:

- make the left dock resize feel physically coherent instead of letting the dock overlap floating Spaghetti editors
- preserve the floating editor width while the dock is actively being resized
- create a temporary lock mode so the editor tracks the vertical bar until pointer-up, then returns to normal free drag behavior

Core product read:

- when the user drags the left vertical bar wider, the Browser/tool dock should feel like it is pushing into the workspace
- if a floating Spaghetti editor would be overlapped by the expanding dock, the dock should "bump" the editor horizontally instead of clipping through it
- during that active resize gesture, the bumped editor should feel attached to the dock edge, not independently drifting
- after the user releases the resize drag, the editor should stop being locked and behave like a normal floating window again

Requested interaction:

- use the live left dock vertical bar as the collision reference
- if the dock expands far enough to intersect the floating Spaghetti editor:
  - keep the editor's current width
  - move the whole floating window to the right just enough to clear the dock, keeping the current `25px` gutter from the dock edge
- while the user is still holding the resize drag:
  - the editor stays horizontally locked to the dock edge
  - additional left/right dock resizing continues to move the editor with it in both directions during the same drag
- once the user releases the mouse:
  - remove the lock
  - the user can drag the floating editor normally again

Implementation shape to aim for:

- detect overlap between the current left dock width and the active floating Spaghetti editor bounds
- only apply the bump behavior to the active floating Spaghetti editor for the first pass
- only apply the behavior to floating modes:
  - expanded
  - collapsed if it still occupies the same floating shell lane
- do not apply this to:
  - split view
  - maximized view
- do not shrink the editor to solve the collision
- treat the lock as an ephemeral resize-session state, not a permanent viewport mode
- store enough information at resize start to know:
  - whether the editor was bumped by the dock
  - the horizontal offset relationship between the dock edge and editor left edge while locked

Important behavior rules:

- if the editor is already far enough right, resizing the dock should do nothing
- do not snap into the lock state unless an actual overlap would happen
- if the user manually moved the editor after the resize ends, the dock should not keep following it
- the lock only exists during the active dock resize gesture that caused the collision
- once unlocked, future dock resizes should evaluate collision fresh instead of assuming the editor is still attached
- if the user shrinks the dock back left before pointer-up, the locked editor should follow back left with it while preserving the same gutter

Recommended first-pass defaults:

- affect only the active floating Spaghetti editor
- preserve a fixed `25px` gutter from the dock edge
- keep the editor width unchanged
- let the temporary lock follow both left and right during the same resize drag
- release the lock immediately on pointer-up

Why this is worth doing:

- makes dock resizing feel intentional and spatially honest
- prevents the left tool area from visually cutting through the active editor
- keeps the editor width stable during resize, which avoids a more chaotic feeling than simple horizontal push
- gives the user a predictable temporary lock model instead of a weird overlap state

[ ] [150] Graph Row Save Control Should Become A Local-App Acknowledge Button With A Right-Click Policy Menu

Planning goal:

- separate local app/session acknowledgement from disk export so the Browser row does not force a file dialog for ordinary graph workflow
- create a future home where the row's save control also becomes the compact entry point for per-graph build policy
- reduce the need for the user to think about "saving to app" as a separate chore once the policy menu and future persistence model are in place

Core product read:

- the current Browser row mixes save state and build state too aggressively
- a graph-row control can carry save-state color and a direct local-app action without hijacking the build bar
- disk persistence should stay available, but it should read as an explicit export/persist action, not the normal meaning of the small row save control
- over time, the row save control can become more like a compact graph-state hub:
  - normal click performs the local app/session save/acknowledge action
  - right click opens a small menu
  - that menu hosts the per-graph build-policy options:
    - `Live`
    - `Release`
    - `Manual`

Requested future direction:

- add a small save control on graph rows, separate from the build-state fill bar
- normal left click on that control should perform local app/session save only:
  - no disk browser
  - no file-save dialog
  - clear the local unsaved marker
- right click on that same control should open a focused compact menu
- the right-click menu should eventually contain:
  - `Live`
  - `Release`
  - `Manual`
  - disk action later, likely named:
    - `Export Graph`
    - or `Save Graph To Disk`

Semantics to preserve:

- `Save` on the row should mean "save/acknowledge inside the app/session"
- disk persistence should be named differently so the user understands it is a file-system action
- the long-term goal is to reduce user anxiety around repeated local saves by giving the graph a stable app-owned baseline and a compact policy/action surface
- once future persistence/autosave behavior is stronger, the row save control may become less about manual rescue and more about deliberate graph-state acknowledgement

Implementation notes for later:

- this likely needs a new local/session save baseline separate from the current disk-only `isDirty` clearing path
- the row control should expose save-state color without duplicating the build bar's meaning
- the build-policy control should probably migrate off the left-side `L / R / M` chip once this save-control menu becomes real
- this should tie into the future Browser-owned per-graph build-policy system described in `[148]`

What should probably wait:

- true app-level autosave / recovery semantics
- full Browser/titlebar policy coordination
- final persistence naming across Browser, titlebar, and any project-level save/export flows

Why this is worth doing:

- keeps ordinary graph workflow inside the app without constant disk-save friction
- gives the Browser row a clearer separation of concerns:
  - build bar = build/runtime state
  - save control = local graph acknowledgement / future policy access
- creates a better future landing spot for `Live / Release / Manual` than scattering those controls around the row forever

##### [151] 2026-03-13 11:18 - Browser Graph Row Save Control Should Land In Two Stages

Planning goal:

- clean up the `Graph Documents` row without forcing the full local-save semantics and policy architecture to land all at once
- establish the future row-control shell now
- make the visual split explicit:
  - fill bar = build state
  - save button = save state
- leave the deeper local app save baseline and `Live / Release / Manual` integration for the later architecture pass

Recommended staged plan:

- stage 1:
  - add the new small save-control button on graph rows
  - place it just left of the `...` overflow button
  - shorten the current fill bar so the row has room for this control
  - let the button expose save-state color
  - redefine the fill bar to represent build state only:
    - `Rebuild`
    - `Building`
    - `Done`
  - give the button its own focused right-click / submenu surface
  - keep the submenu minimal for now:
    - `Export Graph`
    - or `Save Graph To Disk`
- stage 2:
  - add the real build-freshness model in the store/runtime layer before changing the Browser bar wording
  - introduce the real local app/session save baseline as its own separate lane
  - make normal left click on the row save button mean local app save only only after that baseline exists
  - move `Live / Release / Manual` into the save button's right-click menu only after Browser-owned policy ownership is ready
  - retire or relocate the separate `L / R / M` row chip once the new menu owns policy cleanly

Why this order is better:

- it gets the row anatomy right immediately
- it avoids lying to the user with a fake local `Save` action before the store actually supports that meaning
- it lets the future save/policy control grow from a real UI surface instead of another temporary placeholder
- it keeps the next pass small enough to ship without dragging in deeper persistence semantics

Proper ownership for stage 2:

- `useSpaghettiStore` / runtime state should own graph truth:
  - current graph revision
  - latest issued build revision
  - latest accepted build revision
  - in-flight build identity
  - disk save state
- selectors should own UI interpretation:
  - derive `Rebuild`
  - derive `Building`
  - derive `Done`
  - derive `Saved` / `Unsaved`
- `BrowserPanel` should only render the derived row VM:
  - no local Browser-only build-freshness logic
  - no overloading `isDirty` to fake build freshness

What stage 2 needs specifically:

- add a monotonic graph revision per graph document in the store
- bump that revision from the shared graph-update path so every graph edit stays consistent
- capture the graph revision when a build request is staged
- mark the accepted graph revision when a build result is accepted
- derive Browser build state by comparing:
  - current graph revision
  - latest accepted build revision
- keep save state independent from that comparison

Step-2 state split to preserve:

- save state:
  - file persistence truth
  - still owned by the cached graph entry / local-save baseline lane
- build state:
  - freshness of the accepted build relative to the current graph
  - owned by runtime/build revision tracking
- build policy:
  - `Live / Release / Manual`
  - owned by the future Browser policy lane, not by save-state logic

What stage 2 should not do:

- do not compute `Rebuild` directly in the Browser component
- do not use `isDirty` as a proxy for build freshness
- do not merge local app save, build freshness, and policy ownership into one ad hoc row-state hack
- do not let the Browser become the source of truth for any of these systems

What stage 1 should do now:

- remove `Dirty` / `Saved` text from the fill bar
- keep the fill bar focused on build/runtime state only
- define the fill-bar meanings as:
  - `Rebuild`
  - `Building`
  - `Done`
- add the save-control button shell and color language for save-state only
- rename the disk action so it no longer reads like the ordinary save verb
- preserve a clear future hook for the later local-save behavior

State split to preserve:

- fill bar:
  - build freshness / runtime status
- save button:
  - `Unsaved`
  - `Saved`
- this should allow honest combinations like:
  - `Rebuild` + `Unsaved`
  - `Done` + `Unsaved`
  - `Building` + `Saved`

What stage 1 should not pretend to solve:

- true local app save semantics
- autosave / recovery
- final Browser-owned policy architecture
- final titlebar / Browser / project-level save-language coordination

Tie-in to later notes:

- `[148]` remains the long-term Browser graph-row policy/build-state cleanup lane
- `[150]` remains the future semantic direction for local app save plus right-click policy menu
- this entry is the practical phase-cut that says what should land first versus what should wait
