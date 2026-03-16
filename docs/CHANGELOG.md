# CHANGELOG

## Doc Header
Numbering rule for major entries:
- Prefix each new `###` entry section with a sequential command index: `[NNN]`.
- Increment by 1 for every new Codex-added section.

### Doc History
7. 2026-03-08 10:23: Removed planning-only entries `[132]` through `[139]` from the live changelog after moving that batch tracking back into the active `N_CodexChat.md` planning surface
6. 2026-03-07 14:41: Updated the forward changelog title-format rule so normalized entries should use the dashed date/time layout with the canonical phase title in one backticked block
5. 2026-03-07 14:24: Added normalized `HUMAN SUMMARY:` lines across all numbered changelog entries and reconstructed marker blocks using entry-body context so folded scanning is readable throughout the file
4. 2026-03-07 13:44: Added the new headerless `HUMAN SUMMARY:` rule so future changelog entries include a short 1-3 sentence readable summary directly under the entry wrapper
3. 2026-03-07 13:39: Tightened the forward changelog-title rule so new entries should use a backticked canonical phase title shape like ``### [119] 2026-03-05 23:09 `SP - Phase 6 - Resizable Debug Inspector Drawer` ``
2. 2026-03-07 13:34: Tightened the changelog rules so new permanent entries now explicitly require a canonical phase prefix in the entry title
1. 2026-03-07 13:21: Re-structured the top of this file to match the current doc rules with a proper `Doc Header` and `Doc Body` split while preserving the existing changelog entry format

### Purpose

This file is the canonical completed-work history for `/20/parahook`.

Use it for:
- permanent completed-work history
- major shipped implementation entries
- major docs/system consolidation entries that belong in permanent project history

Do not use it for:
- temporary chill-batch logging
- speculative planning
- active task execution checklists

### Changelog Rules

- each permanent changelog entry in `## Doc Body` starts with an HTML divider comment
- the main entry heading for new normalized entries should use `###` in this shape:
  - `### [NNN] - YYYY-MM-DD HH:MM - `PREFIX - Phase N - Title``
- each new permanent entry title should use the current canonical phase-prefix naming system when the work belongs to a canonical phase family
  - example:
    - `### [131] - YYYY-MM-DD HH:MM - `SP - Phase 8 - Entry Title``
- if the work is docs/meta/process work, use the canonical meta prefix when appropriate:
  - example:
    - `### [131] - YYYY-MM-DD HH:MM - `OO - Phase 13 - Entry Title``
- existing older entries do not need to be mass-rewritten just to match this title punctuation style
- the same HTML divider comment appears again directly under the main entry heading
- directly under the entry wrapper, include one headerless summary line in this shape:
  - `HUMAN SUMMARY: 1-3 sentences about what this changelog entry did`
- keep the human summary readable and compact so folding to the entry level still leaves a quick human scan
- prefer the human-summary line to use one outer backtick span for readable color grouping in VS Code, and reopen the outer span after any escaped inline file/code reference so the remaining sentence returns to the summary color
  - example:
    - `HUMAN SUMMARY: `This renamed the canonical chill-mode tracking file to \`docs/Chill-Log.md\` `and updated the repo docs to follow that new path.``
- standard entry subsections use `####`
- the normal subsection order is:
  - `HUMAN SUMMARY: ...` `headerless line, not a heading`
  - `#### Scope / Constraints Honored`
  - `#### Summary of Implementation`
  - `#### Files Changed`
  - `#### Behavior Changes (if any)`
  - `#### Verification Steps`
- reconstructed-history bands may also use visible marker headings such as:
  - `#### Reconstructed`
  - `### Reconstructed Gap`
- reconstructed entries still use numbered `###` headings underneath those markers
- keep numbering sequential unless the user explicitly requests a renumber pass



## Doc Body

<!-- ENTRY 224 -->
### [224] - 2026-03-16 00:33 - `DOC - Phase 11 - Condensed Now Next Later Planning Surface`
<!-- ENTRY 224 -->
HUMAN SUMMARY: `Added a compact planning doc that condenses the larger roadmap, vision roadmap, wishlist, and active SP planning surface into one recommended Now / Next / Later / Much Later execution order, and registered that doc in the live docs index.` 

#### Scope / Constraints Honored
- Kept this as a roadmap-adjacent planning surface instead of rewriting the main roadmap.
- Based the ordering on the live shipped/planned docs rather than older placeholder phase ladders.
- Left the detailed execution questions in the existing roadmap and phase-plan docs.

#### Summary of Implementation
- Added `docs/Human-Plans/roadmap/Now-Next-Later-Much-Later.md` as a compact build-order view.
- Grouped the current planning state into four execution buckets with a short dependency spine and explicit defer rules.
- Added the new planning doc to the active docs index under `docs/Human-Plans/roadmap/`.

#### Files Changed
- `docs/Human-Plans/roadmap/Now-Next-Later-Much-Later.md`
- `docs/Doc-Index.md`

<!-- ENTRY 223 -->
### [223] - 2026-03-12 20:20 - `VR / SP - Lane 2.1E - Shared Left-Dock Ghost Docking For Browser And Meatball Re-Entry`
<!-- ENTRY 223 -->
HUMAN SUMMARY: `Added the first fixed-slot `2.1E` dockable left-panel behavior so the Browser can ghost-preview and dock back into its top slot, while dragging the docked meatball editor out now restores the normal floating Spaghetti Editor and lets that floating editor ghost-preview back into the meatball slot.` 

#### Scope / Constraints Honored
- Kept this to the fixed-slot `2.1E` version instead of introducing arbitrary left-dock panel reordering.
- Preserved the rule that `meatball editor` is the docked toolbar-hosted presentation, not a separate floating shell.
- Reused the existing floating Spaghetti Editor shell instead of inventing a second floating editor implementation.

#### Summary of Implementation
- Added shared left-dock target wrappers in `AppShell` for the Browser and meatball slots.
- Implemented compact dashed ghost previews that appear when a dragged panel hovers over its valid dock target.
- Wired the floating Browser drag path to re-dock on drop over the Browser slot.
- Wired the docked meatball titlebar drag path to restore the normal floating Spaghetti Editor once the drag leaves the dock.
- Wired the floating Spaghetti Editor drag path to re-enter `meatball editor view` when dropped over the meatball target.
- Added focused shell tests for Browser re-docking, meatball drag-out, and meatball re-entry.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- Dragging the floating Browser back over its dock slot now shows a ghost placeholder and docks it on release.
- Dragging the docked meatball editor out now converts it back into the floating Spaghetti Editor during the same drag.
- Dragging the floating Spaghetti Editor back over the meatball slot now shows a ghost placeholder and restores `meatball editor view` on release.

#### Verification Steps
- `npm.cmd test -- --run src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 222 -->
### [222] - 2026-03-12 17:10 - `VR / SP - Lane 2.1D - Add Combined Compile-Build Quick Action Beside Graph Selector`
HUMAN SUMMARY: `Replaced the separate Compile and Build buttons with one square quick-action button beside the graph selector that runs the existing compile-then-build path in one click, leaving the Build section focused on save-only behavior.` 

#### Scope / Constraints Honored
- Kept this scoped to the Spaghetti toolbar interaction model.
- Reused the existing `requestGraphDocumentBuild(...)` path so the new quick action follows the current compile-then-build rules.
- Did not change the underlying graph compile/build pipeline behavior.

#### Summary of Implementation
- Added a small square quick-action button to the left of the standalone graph selector row.
- Wired that button to the existing combined graph build request path.
- Removed the separate `Compile` and `Build` buttons from the Build section and updated the inline help copy to match the new quick-action flow.
- Added panel test coverage for the new combined quick-action button.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The top graph row now exposes one square quick-build action instead of requiring separate compile/build buttons.
- The Build section now reads more cleanly because save is the only remaining direct button there.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 221 -->
### [221] - 2026-03-12 17:05 - `VR / SP - Lane 2.1D - Move Canvas View-Mode Toggle Out Of Graph Header`
HUMAN SUMMARY: `Cleaned up the Graph toolbar section by making the viewport graph selector span the full editor width and moving the Expanded / Collapsed toggle into the editor-surface canvas toolbar, with the same mode controls still visible while the canvas is already in collapsed mode so the user can return immediately.` 

#### Scope / Constraints Honored
- Kept this scoped to the internal Spaghetti toolbar and editor-surface mode controls.
- Did not remove any graph-view functionality; only changed where the controls live.
- Preserved the existing `expanded` / `collapsed` canvas behavior while making the return path clearer.

#### Summary of Implementation
- Removed the `Expanded` / `Collapsed` buttons from the `Graph` header section so that branch now focuses on graph binding only.
- Styled the graph-document selector as a full-width control across the Graph section.
- Passed the view-mode toggle into the actual editor surface so `Expanded` / `Collapsed` now live in the canvas toolbar for expanded view and in a matching toolbar strip for collapsed view.
- Added focused test coverage to pin the collapsed-view return path.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
- `src/app/spaghetti/ui/CollapsedEditor.test.tsx`
- `src/app/spaghetti/ui/ExpandedEditor.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The `Graph` section now reads as a clean full-width graph-binding control instead of mixing graph binding with canvas mode buttons.
- The canvas-mode toggle now lives with the rest of the canvas tools, and it remains visible even when the canvas is already in collapsed mode.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/spaghetti/ui/CollapsedEditor.test.tsx src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 220 -->
### [220] - 2026-03-12 16:57 - `VR / SP - Lane 2.1D - Reorganize Internal Spaghetti Toolbar Into Expandable Sections`
HUMAN SUMMARY: `Reorganized the internal Spaghetti toolbar into tidy collapsible sections so the growing control surface reads as grouped tool areas instead of one long wall of controls, while preserving the existing graph, node, viewer, build, legend, and diagnostics features.` 

#### Scope / Constraints Honored
- Kept all existing toolbar functionality intact and only restructured how it is presented.
- Reused native expandable section behavior instead of inventing a new toolbar state system.
- Left the titlebar `i` behavior and the rest of the `2.1D` shell/view-mode work unchanged.

#### Summary of Implementation
- Grouped the internal toolbar into expandable `Graph`, `Node Focus`, `Part Nodes`, `Samples`, `Build`, `Viewer`, `Type Legend`, and `Diagnostics` sections.
- Left the `Graph` block open by default as the core active-editing section and kept the other groups collapsed by default to reduce visual density.
- Added dedicated section styling so the new grouped controls read consistently with the existing help/details treatment.
- Expanded the `SpaghettiPanel` test coverage to assert the grouped section structure and default-open/default-closed behavior.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/Human-Plans/CodexNotes/9_CodexChatNotes.md`

#### Behavior Changes
- Opening the internal toolbar now reveals grouped collapsible tool areas instead of a single long unstructured strip of controls.
- Core graph-binding controls stay immediately available, while secondary controls can be expanded only when needed.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 219 -->
### [219] - 2026-03-12 16:48 - `VR / SP - Lane 2.1D - Consolidate Internal Spaghetti Toolbar And Retained-Band Header Collapse`
HUMAN SUMMARY: `Implemented the internal Spaghetti toolbar cleanup by moving graph/view/focus/new-part controls and the type legend into the real top toolbar area, simplifying the editor body back down to the graph surface itself, and changing the titlebar i behavior so the toolbar collapses to a thin retained band instead of disappearing outright.` 

#### Scope / Constraints Honored
- Kept this work inside the in-app Spaghetti Editor shell and internal toolbar surface.
- Reused the existing graph binding, graph-command, and collapsed-editor paths rather than introducing a new editor architecture.
- Left detached-window behavior and larger shell changes untouched.

#### Summary of Implementation
- Moved the graph selector, `Expanded` / `Collapsed` mode controls, `Focus Node`, `New Part Node`, and the type/color legend into the `SpaghettiPanel` header area.
- Simplified `SpaghettiEditor` so it now renders only the active expanded/collapsed editor surface instead of owning a second internal toolbar.
- Changed the internal header collapse behavior so the `i` button now drives a retained minimized band, while the existing resize bar can pull the toolbar back open to a custom height.
- Added panel/shell tests covering the consolidated toolbar and retained-band collapsed state.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`
- `docs/Human-Plans/CodexNotes/9_CodexChatNotes.md`

#### Behavior Changes
- The internal editor toolbar now lives in one coherent top area instead of scattering key controls through the editor body.
- The `i` button now minimizes the toolbar to a thin retained band rather than fully hiding it.
- Dragging the existing toolbar/canvas resize bar can reopen that band into a custom toolbar height.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 218 -->
### [218] - 2026-03-12 16:31 - `VR / SP - Lane 2.1D - Small Shell And Selector Fixups Roll-Up`
HUMAN SUMMARY: `Compiled the recent small UI fix-ups into one readable batch: the Spaghetti Editor kept its top-bar controls in meatball mode, the Browser header became collapsible, the floating editor height was normalized to the browser, the titlebar gained a header-toggle button, and the in-panel viewport graph selector was cleaned up, stabilized, and dark-themed.` 

#### Scope / Constraints Honored
- This is a roll-up summary of several small shipped UI follow-ups rather than a new large feature cut.
- Kept the work inside the current in-app Browser and Spaghetti Editor shell surfaces.
- Left detached/separate-browser behavior deferred.

#### Summary of Implementation
- Restored the shared Spaghetti top bar inside `meatball editor view` so the docked editor still exposes mode and exit controls.
- Made the `Browser` header collapse or expand the full Browser body for quick left-dock cleanup.
- Normalized the default floating editor height against the browser viewport instead of relying on the older fixed pixel default.
- Added the titlebar `i` button to toggle the Spaghetti header/toolbar area from the shell.
- Replaced the in-panel header-collapse strip with a viewport graph selector, then hardened that selector to use stable Zustand subscriptions and polished it to span the full row with a darker matching menu theme.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The docked meatball editor no longer feels like a dead end because its shell controls stay visible.
- The Browser panel can now be folded away at the section-header level.
- The floating Spaghetti Editor opens with a more browser-relative default height.
- Header/toolbar collapse now lives in the titlebar instead of being duplicated inside the panel body.
- The viewport graph selector now reads like a full-width dark-themed control and no longer reintroduces the `New Graph` black-screen selector crash.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx src/app/panels/BrowserPanel.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 217 -->
### [217] - 2026-03-12 16:26 - `VR / SP - Fix New Graph Black-Screen Regression From Unstable Viewport Graph Selector`
HUMAN SUMMARY: `Fixed the new black-screen-on-New-Graph regression by removing a fresh-array Zustand subscription from the new Spaghetti viewport graph selector and rebuilding those graph options from stable store slices in useMemo, matching the same selector-stability rule documented in Browser bug 2.` 

#### Scope / Constraints Honored
- Kept this fix scoped to the new Spaghetti viewport graph selector path.
- Matched the existing selector-stability fix pattern already documented in the Browser bug notes.
- Did not change the viewport graph-switching behavior itself.

#### Summary of Implementation
- Stopped subscribing `SpaghettiPanel` directly to `selectOrderedGraphDocuments(...)`, which allocates a fresh array.
- Switched the panel to subscribe only to stable `graphDocumentsById` and `graphDocumentOrder` slices.
- Rebuilt the ordered graph-document options locally in `useMemo` before rendering the viewport graph dropdown.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`

#### Behavior Changes
- Clicking `New Graph` no longer trips the React/Zustand black-screen crash through the viewport graph selector.
- The viewport graph dropdown still works, but now follows the stable-subscription rule.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx src/app/panels/BrowserPanel.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 216 -->
### [216] - 2026-03-12 16:22 - `VR / SP - Lane 2.1D - Replace In-Panel Header Toggle With Viewport Graph Selector`
HUMAN SUMMARY: `Removed the old in-panel Collapse Header row from the Spaghetti Editor and replaced it with a viewport graph dropdown so each editor surface can directly switch which graph document it is bound to while the header collapse control now lives in the top titlebar.` 

#### Scope / Constraints Honored
- Kept this scoped to the in-panel top row inside `SpaghettiPanel`.
- Reused the existing viewport rebinding path in the spaghetti store instead of inventing a new graph-switching flow.
- Left the titlebar `i` button as the single header/toolbar collapse control.

#### Summary of Implementation
- Replaced the old `Spaghetti Editor / Collapse Header` strip with a `Viewport Graph` dropdown bound to the current viewport graph document.
- Wired the dropdown to `bindEditorViewportToGraphDocument(...)` so changing the selection really switches the graph shown in that viewport.
- Added focused panel tests covering the new selector rendering and rebinding behavior.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The in-panel top row now shows a graph selector for the current viewport instead of an internal header-collapse toggle.
- Header/toolbar collapse is now controlled from the shell titlebar rather than duplicated inside the panel body.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 215 -->
### [215] - 2026-03-12 16:17 - `VR / SP - Lane 2.1D - Titlebar Header Toggle For Spaghetti Editor`
HUMAN SUMMARY: `Added a new i button to the Spaghetti Editor titlebar so the top-bar shell can directly expand or collapse the editor header/toolbar area, keeping that state in sync across the floating, split, and meatball presentations.` 

#### Scope / Constraints Honored
- Kept this scoped to the in-app Spaghetti Editor titlebar and header/toolbar collapse behavior.
- Reused the existing header-collapse path in `SpaghettiPanel` instead of inventing a second toolbar state.
- Did not change Browser behavior or detached-window behavior.

#### Summary of Implementation
- Added a new `i` titlebar button that toggles the Spaghetti header/toolbar area from the shell.
- Made `SpaghettiPanel` support controlled header-collapse state so the same toggle behavior works across floating, split, and meatball hosts.
- Added focused shell test coverage for the new titlebar header toggle.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/panels/SpaghettiPanel.tsx`

#### Behavior Changes
- The Spaghetti Editor top bar now includes an `i` control that expands or collapses the editor header/toolbar area.
- Header/toolbar collapse state is now driven consistently from either the titlebar or the in-panel header toggle.

#### Verification Steps
- `npm.cmd test -- --run src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 214 -->
### [214] - 2026-03-12 16:14 - `VR / SP - Lane 2.1D - Normalize Default Floating Editor Height`
HUMAN SUMMARY: `Adjusted the normal floating Spaghetti Editor sizing so its default height now normalizes against the current browser viewport height instead of sitting on the old fixed pixel default that could force the editor internals to scroll.` 

#### Scope / Constraints Honored
- Kept this limited to the default expanded floating-editor height behavior.
- Preserved the existing maximize, split, meatball, and close mode behavior.
- Did not change detached-window behavior or the Browser shell.

#### Summary of Implementation
- Added viewport-relative default-height normalization in `AppShell` for the standard floating editor state.
- Left user-sized floating editor dimensions intact, while making the untouched default editor height track the current browser viewport more closely.

#### Files Changed
- `src/app/AppShell.tsx`

#### Behavior Changes
- The default floating `Spaghetti Editor` now uses a browser-height-based normalized height, reducing the chance that the editor shell starts in a too-short state that forces internal scrolling.

#### Verification Steps
- `npm.cmd test -- --run src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 213 -->
### [213] - 2026-03-12 16:10 - `VR / SP - Lane 2.1D - Meatball Header Controls And Browser Panel Collapse`
HUMAN SUMMARY: `Added the missing top bar back into meatball editor view so the user keeps the shell controls while docked, and made the Browser header itself collapse the full Browser body to reclaim left-dock space quickly.`

#### Scope / Constraints Honored
- Kept this to two small follow-up UI fixes on top of the shipped `2.1D` editor-surface work and Browser shell.
- Reused the existing in-app shell controls instead of introducing new window behavior.
- Did not change detached/separate-browser behavior.

#### Summary of Implementation
- Reused the existing `SpaghettiWindowTitleBar` inside the `SpaghettiMeatballHost` so the docked editor still exposes mode-switch and close controls.
- Added a collapsible Browser panel header that hides or shows the entire Browser body, including the top action buttons and tree content.
- Added focused UI coverage for the meatball-host controls and Browser panel collapse behavior.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- `meatball editor view` now keeps a visible `Spaghetti Editor` top bar with the same shell-control cluster, so the user can leave that mode directly.
- Clicking the `Browser` header now collapses or expands the entire Browser body.

#### Verification Steps
- `npm.cmd test -- --run src/app/AppShell.test.tsx src/app/panels/BrowserPanel.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 212 -->
### [212] - 2026-03-12 15:50 - `VR / SP - Lane 2.1D - Spaghetti Floating Window Controls And View Modes`
HUMAN SUMMARY: `Implemented the 2.1D in-app spaghetti window controls by replacing the old Drag label with explicit shell actions, adding true collapsed / maximized / split-view behavior, and introducing a dedicated meatball editor host below Parts List while keeping detached browser windows deferred.`

#### Scope / Constraints Honored
- Kept this phase scoped to the active in-app editor surface and did not ship detached or separate-browser window behavior.
- Reused the existing focused editor viewport/store model instead of introducing true multi-window shell rendering.
- Preserved normal floating drag/resize behavior for the standard expanded overlay mode.

#### Summary of Implementation
- Extended the editor viewport window-mode contract with `maximized` and `split view`, plus viewport-owned split ratio and restore metadata so collapsed and split toggles can restore into the correct prior mode.
- Reworked `AppShell` so the active spaghetti editor can now render in five in-app states: floating `expanded`, header-only `collapsed`, full-overlay `maximized`, docked `split view`, and left-dock `meatball editor view`.
- Replaced the old top-right `Drag` label with explicit titlebar controls for collapse, meatball, maximize, split, and close, and added the split-mode divider interaction so the user can rebalance the model viewport against the editor pane.
- Added shell/store tests covering the new window-mode transitions and rendering paths.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The spaghetti editor titlebar now exposes explicit in-app shell controls instead of a passive `Drag` label.
- `collapsed` now means a true header-only strip that hides the editor body while keeping the editor surface available for quick return.
- `maximized` now fills the current app viewport and toggles back to the default floating editor size on the next maximize click.
- `split view` now docks the model viewport above the editor with a draggable divider, and toggling split off restores the previously captured non-split state.
- `meatball editor view` now presents the active editor in a dedicated left-dock host below `Parts List` instead of leaving it as an overlay.
- Detached/separate-browser editor behavior is still deferred.

#### Verification Steps
- `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/AppShell.test.tsx src/app/panels/BrowserPanel.test.tsx src/app/panels/selectBrowserTreeRows.test.ts`
- `npm.cmd run build`

<!-- ENTRY 211 -->
### [211] - 2026-03-12 15:02 - `VR / SP - Lane 2.1C - Browser Open Editors Cleanup`
HUMAN SUMMARY: `Completed the next 2.1C Browser cleanup slice by renaming the Browser branch from Open Viewports to Open Editors, adding a small ... overflow trigger beside selection-first rows, and tightening the Browser copy so editor-session tracking reads more honestly against the current one-active-editor shell.`

#### Scope / Constraints Honored
- Kept this scoped to Browser naming, Browser row/menu access, and Browser-shell honesty cleanup.
- Preserved the existing graph/output/viewport action set and reused the same menu surface for right-click and overflow access.
- Did not change `AppShell` into true multi-window spaghetti-editor rendering.

#### Summary of Implementation
- Updated `BrowserPanel` so graph, published-output, and editor rows expose a small `...` overflow button that opens the same menu already used by right-click.
- Renamed the Browser section from `Open Viewports` to `Open Editors` and added a one-line note clarifying that the branch tracks editor sessions while the workspace still shows the active editor surface.
- Tightened Browser row copy so graph meta now uses editor-oriented wording such as `Active editor` / `Open editor`, and the editor list rows now read as `Active editor` or `Editor zN`.
- Added a focused `BrowserPanel` interaction test under `jsdom` to cover the new overflow button and the preserved right-click path.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectBrowserGraphRows.test.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/browserRowActions.test.ts`
- `src/app/theme/v15Theme.css`
- `package.json`
- `package-lock.json`

#### Behavior Changes
- Browser rows remain selection-first on normal click, but now have a discoverable `...` menu trigger in addition to right-click.
- The Browser no longer labels the editor-session branch as `Open Viewports`; it now reads `Open Editors`.
- Browser row meta is calmer and more explicit about editor/session state.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/selectBrowserGraphRows.test.ts src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/browserRowActions.test.ts src/app/panels/BrowserPanel.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 210 -->
### [210] - 2026-03-12 14:35 - `VR / SP - Lane 2.1C - Browser Row Action Cleanup And Context Menus`
HUMAN SUMMARY: `Cleaned up the Browser rows by removing the always-visible row action strips, keeping rows selection-first, and moving existing graph/output/viewport commands into a right-click context menu so the Browser reads more like a calm tree and less like a stack of mini toolbars.`

#### Scope / Constraints Honored
- Kept this limited to Browser row interaction and presentation cleanup.
- Preserved the existing explicit graph/output/viewport action set instead of inventing new Browser commands.
- Avoided pulling deeper Browser hierarchy, materials/visibility controls, or workspace-mode work into this cut.

#### Summary of Implementation
- Updated `BrowserPanel` so graph rows, published-output rows, and viewport rows now open their action list through a row context menu instead of rendering a visible action strip on every row.
- Kept row-body click selection-first while making right-click the entry path for:
  - `Save`
  - `Open`
  - `Reveal`
  - `New Editor`
  - `Swap Editor`
  - `Focus`
  - `Close`
- Added lightweight Browser context-menu state with:
  - row selection on right-click
  - close-on-outside-click
  - close-on-escape
  - close-on-action-run behavior
- Simplified Browser row styling so the hierarchy and labels stay visually primary while the command surface remains secondary.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Browser rows no longer show the full visible action button strip by default.
- Right-clicking a graph row, published-output row, or viewport row now opens that row's Browser options menu.
- Browser rows remain selection-first on normal click.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/browserRowActions.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 209 -->
### [209] - 2026-03-12 14:15 - `SP / VR - Lane 2.1B - Browser, Editor, And Shared Viewer Coordination`
HUMAN SUMMARY: `Implemented `[2.1B]` by adding explicit Browser `Reveal` actions for graph and published-output rows, reusing the existing graph-scoped viewer-target path when shared composition is inactive, surfacing read-only shared-composition status in Browser rows, and preserving the rule that row-body click stays selection-only while explicit `Open` / `Focus` actions remain the only editor-movement path.`

#### Scope / Constraints Honored
- Kept row-body click as Browser-local selection only.
- Kept `Reveal` graph-scoped by reusing `viewerTargetGraphDocumentId`.
- Kept shared composition read-only from the Browser in this cut.
- Avoided adding any new generic viewer-emphasis state.

#### Summary of Implementation
- Extended `selectBrowserTreeRows` so graph and published-output rows now expose:
  - explicit `Reveal` actions
  - read-only shared-composition participation status for graph rows
  - disabled `Reveal` behavior while shared composition is active
- Added `browserRowActions.ts` as a pure Browser action router so:
  - graph `Reveal` targets its `graphDocumentId`
  - published-output `Reveal` also targets its source `graphDocumentId`
  - viewport `Focus` stays explicit and separate
- Updated `BrowserPanel` to wire `Reveal` through the existing `setViewerTargetGraphDocumentId` path only when shared composition is inactive.
- Closed out the `2.1B` task doc, the umbrella `2.1` doc, and the roadmap lane body to reflect the shipped `2.1A + 2.1B` Browser workspace wave.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/browserRowActions.ts`
- `src/app/panels/browserRowActions.test.ts`
- `docs/Phase-Plans/Tasks/Future/02.1B - SP-VR - Browser, Editor, And Shared Viewer Coordination.md`
- `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Graph rows and published-output rows now show an explicit `Reveal` action in the Browser.
- `Reveal` targets the source graph in single-target viewer mode.
- When shared composition is active, Browser rows show read-only participation status and `Reveal` is disabled instead of mutating composition membership.
- Browser row-body click still selects the row without moving editor focus or changing shared-composition membership.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/browserRowActions.test.ts src/app/panels/selectBrowserGraphRows.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 208 -->
### [208] - 2026-03-12 14:06 - `SP / VR - Lane 2.1B - Browser, Editor, And Shared Viewer Coordination`
HUMAN SUMMARY: `Created the dedicated implementation-ready execution spec for `[2.1B]`, locking explicit `Reveal` as the first Browser-to-viewer entry path, keeping Browser row click selection-only, keeping shared composition read-only from Browser rows, and updating the roadmap so the remaining coordination half of `[2.1]` is now ready to implement.`

#### Scope / Constraints Honored
- Kept this as a docs-only planning/spec pass.
- Kept Browser row click as selection-only.
- Kept Browser-authored shared composition membership changes out of scope.

#### Summary of Implementation
- Added:
  - `docs/Phase-Plans/Tasks/Future/02.1B - SP-VR - Browser, Editor, And Shared Viewer Coordination.md`
- Locked the new `2.1B` spec around:
  - explicit `Reveal`
  - graph-scoped first-pass reveal
  - reuse of `viewerTargetGraphDocumentId`
  - read-only shared-composition status on Browser rows
  - explicit editor movement through existing `Open` / `Focus` actions only
- Updated the umbrella `02.1` doc so it now points at `2.1B` as the next implementation-ready target after shipped `2.1A`.
- Updated roadmap trackers so `[2.1B]` now counts as:
  - `Decision Coverage` complete
  - `Plan.md Status` complete

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.1B - SP-VR - Browser, Editor, And Shared Viewer Coordination.md`
- `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the current `SP` and `VR` planning answers plus the shipped `2.1A` Browser code before writing the `2.1B` spec.
- Confirmed the new `02.1B` execution-spec doc exists in `docs/Phase-Plans/Tasks/Future`.
- Confirmed roadmap tracker rows now show `[2.1B]` as decision-complete with its own dedicated plan doc.

<!-- ENTRY 207 -->
### [207] - 2026-03-12 13:58 - `VR - Lane 2.1A - Browser Workspace Shell And Row Interaction`
HUMAN SUMMARY: `Implemented `[2.1A]` by adding a shared Browser row-shell contract, refactoring `BrowserPanel` so graph rows, published output rows, and viewport rows share one calm row anatomy, and introducing Browser-local row selection that no longer silently moves editor focus or shared-viewer state.`

#### Scope / Constraints Honored
- Kept `2.1A` Browser-local only.
- Left viewer emphasis, editor-focus coordination, and shared-viewer coordination deferred to `[2.1B]`.
- Kept the `Content` branch functionally unchanged in this cut.

#### Summary of Implementation
- Added `selectBrowserTreeRows` as the first shared Browser row-shell selector for:
  - graph-document rows
  - published graph-output rows
  - open viewport rows
- Refactored `BrowserPanel` to render those rows through one shared row shell using:
  - expand affordance
  - type icon
  - label
  - meta/state text
  - right-aligned controls
- Added Browser-local `selectedBrowserRowId` state so row selection is now separate from editor focus.
- Preserved explicit graph actions while moving graph opening/focusing to an explicit `Open` button and viewport focusing to an explicit `Focus` button.
- Added selector coverage proving the new row-shell contract and local selection behavior.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/theme/v15Theme.css`
- `docs/Phase-Plans/Tasks/Future/02.1A - VR - Browser Workspace Shell And Row Interaction.md`
- `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Single-clicking a graph row, published output row, or viewport row now selects that Browser row locally.
- Selecting a Browser row no longer opens/focuses an editor viewport.
- Graph rows now expose explicit `Open`, `Save`, `New Editor`, and `Swap Editor` controls on the row.
- Viewport rows now expose explicit `Focus` and `Close` controls on the row.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/panels/selectBrowserGraphRows.test.ts src/app/panels/selectBrowserTreeRows.test.ts`.
- Ran `npm.cmd run build`.

<!-- ENTRY 206 -->
### [206] - 2026-03-12 13:40 - `VR - Lane 2.1A - Browser Workspace Shell And Row Interaction`
HUMAN SUMMARY: `Created the dedicated implementation-ready execution spec for `[2.1A]`, locking the Browser-local row/workspace-shell cut, the graph-focused first rollout, and the explicit stop line before Browser/editor/shared-viewer coordination so the next Lane `[2]` implementation target is now ready to build.`

#### Scope / Constraints Honored
- Kept this as a docs-only planning/spec pass.
- Locked `2.1A` as Browser-local only.
- Kept viewer emphasis, editor focus movement, and shared-viewer coordination deferred to `[2.1B]`.

#### Summary of Implementation
- Added:
  - `docs/Phase-Plans/Tasks/Future/02.1A - VR - Browser Workspace Shell And Row Interaction.md`
- Locked the new `2.1A` spec around:
  - graph-document rows
  - published graph-output rows
  - open viewport rows
  - one shared row anatomy
  - Browser-local selection and local interaction state
  - preserved explicit row actions without new coordination behavior
- Updated the umbrella `02.1` doc so it now points at `2.1A` as the next implementation-ready target.
- Updated roadmap trackers so `[2.1A]` now counts as:
  - `Decision Coverage` complete
  - `Plan.md Status` complete

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.1A - VR - Browser Workspace Shell And Row Interaction.md`
- `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the current Browser planning answers and live Browser seam notes before writing the `2.1A` spec.
- Confirmed the new `02.1A` execution-spec doc exists in `docs/Phase-Plans/Tasks/Future`.
- Confirmed roadmap tracker rows now show `[2.1A]` as decision-complete with its own dedicated plan doc.

<!-- ENTRY 205 -->
### [205] - 2026-03-13 10:48 - `VR / SP - Lane 2.1 - Browser Workspace Shell And Item Interaction`
HUMAN SUMMARY: `Finished the final `ASS#` planning pass for `[2.1]` by locking the shared `VR` and `SP` question surfaces, creating the dedicated `02.1` future task doc, and updating the roadmap so the Browser workspace shell lane now reads as decision-complete with its own plan-doc home before the implementation-spec rewrite.`

#### Scope / Constraints Honored
- Kept this as a docs-only planning pass.
- Locked the shared `VR` and `SP` family question surfaces without jumping ahead into implementation details.
- Created a dedicated future task doc for `[2.1]` without falsely presenting the lane as implementation-ready or shipped.

#### Summary of Implementation
- Confirmed the shared `[2.1]` Browser workspace question surfaces are now fully locked in:
  - `docs/Phase-Plans/08_VR - Phase-Plans.md`
  - `docs/Phase-Plans/11_SP - Phase-Plans.md`
- Created:
  - `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- Seeded the new task doc with:
  - progress checklist
  - purpose and scope
  - source inputs
  - the current locked working read
  - the next implementation-spec rewrite buckets
- Updated roadmap tracker state so `[2.1]` now counts as:
  - `Decision Coverage` complete
  - `Plan.md Status` complete

#### Files Changed
- `docs/Phase-Plans/08_VR - Phase-Plans.md`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the shared `[2.1]` `VR` and `SP` question blocks to confirm they are locked.
- Confirmed the dedicated `02.1` future task doc now exists in `docs/Phase-Plans/Tasks/Future`.
- Confirmed the roadmap trackers now show `[2.1]` as decision-complete with a created plan doc.

<!-- ENTRY 204 -->
### [204] - 2026-03-13 10:06 - `SP - Phase 11 - Graphs Panel And Nested Parts`
HUMAN SUMMARY: `Implemented the first real `SP 11` Browser hierarchy cut by adding expandable `Graph Documents` rows in `BrowserPanel`, deriving one thin published-output child level from each graph's `GraphOutputSurface`, and keeping graph-row state aligned with open/focused editor viewport status without turning the Browser into the full project-content workspace yet.`

#### Scope / Constraints Honored
- Kept `SP 11` focused on the first Browser hierarchy surface rather than deeper project-content nesting.
- Read published child rows from graph-owned output surfaces in `useSpaghettiStore` instead of app-owned project-content state.
- Left richer Browser row controls, build bars, viewer orchestration, and deeper `Assembly / Component / Object / Part` structure deferred.

#### Summary of Implementation
- Added `selectBrowserGraphRows` as the first Browser-facing selector for graph rows plus published graph output child rows.
- Derived graph-row status from:
  - cached graph dirty/saved state
  - active graph focus
  - open editor viewport counts
  - focused viewport ownership
- Derived child rows from each graph document's `GraphOutputSurface.entries`, including visible state/meta for:
  - `resolved`
  - `unresolved`
  - `empty`
- Updated `BrowserPanel` so the `Graphs` branch becomes `Graph Documents` with:
  - expandable graph rows
  - one thin published-output child level
  - preserved `Save`, `New Editor`, and `Swap Editor` actions on graph rows
- Kept Browser expand/collapse state local to the panel while keeping child-row truth graph-owned.
- Updated the `SP 11` family/task docs and roadmap tracker to reflect the shipped phase.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/panels/selectBrowserGraphRows.test.ts`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Phase-Plans/Tasks/Future/01.5 - SP - Phase 11.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The Browser now shows expandable graph-document rows with published graph output children instead of only a flat graph list.
- Graph rows display clearer saved/dirty and open/focused editor state.
- Published output rows are now visible under each graph without pretending they are already full project-owned component/object/part rows.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/panels/selectBrowserGraphRows.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 203 -->
### [203] - 2026-03-12 23:44 - `SP - Phase 12 - Shared Viewport Composition`
HUMAN SUMMARY: `Implemented the first real `SP 12` shared-composition seam by adding runtime-owned shared viewer membership in `useSpaghettiStore`, explicit viewport join/leave controls in `SpaghettiPanel`, and graph-qualified multi-graph preview union rendering in `ViewerHost` so the shared viewer can present more than one graph contribution without using focus as truth.`

#### Scope / Constraints Honored
- Kept `SP 12` focused on viewer/workspace composition rather than Browser ownership or publish/receive meaning.
- Used graph documents as the first-pass composition unit and explicit viewport actions as the first authoring path.
- Preserved the existing single `viewerTargetGraphDocumentId` behavior as the fallback when no shared composition session exists.

#### Summary of Implementation
- Added runtime-only `sharedViewerComposition` state in `useSpaghettiStore` with explicit:
  - `addEditorViewportGraphToSharedViewerComposition`
  - `removeEditorViewportGraphFromSharedViewerComposition`
- Kept composition membership graph-document-based even though the authoring entry path comes from editor viewports, so focus and viewport rebinding do not silently redefine composition truth.
- Added `selectSharedPreviewRenderVm` to merge more than one graph preview contribution into one shared viewer render list.
- Qualified shared viewer identities with `graphDocumentId` so same-slot preview outputs from different graphs do not collide in the viewer.
- Updated `ViewerHost` to:
  - render the resolved union when a shared composition session exists
  - fall back to the existing single viewer-target path otherwise
- Updated `SpaghettiPanel` with first-pass shared composition membership controls and status cues.
- Updated the `SP 12` family/task docs and roadmap tracker to reflect the shipped phase.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Phase-Plans/Tasks/Future/01.6 - SP - Phase 12.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The shared viewer can now intentionally present resolved preview contributions from more than one graph document at the same time.
- Shared composition membership is now explicit and stable across focus changes instead of being inferred from the currently focused viewport.
- Two graphs with the same preview slot ids can now coexist in one shared viewer composition without clobbering each other.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 202 -->
### [202] - 2026-03-12 22:32 - `GE - Phase 12C - Cross-Graph Ownership Rules`
HUMAN SUMMARY: `Implemented the first real `12C` cross-graph ownership seam by persisting graph-authored receive references on graph documents, resolving them against explicit published-output ids in `useSpaghettiStore`, and deriving first-pass linked/unresolved receive components in `useAppStore` without falling back to active-graph or viewer-target singleton state.`

#### Scope / Constraints Honored
- Kept `12C` focused on cross-graph ownership rules and one minimal linked receive path.
- Left `Hard Copy`, richer Browser hierarchy, and later `Publish / Receive Execution` workflow work deferred.
- Preserved source-graph publication ownership while keeping receive intent graph-authored and project composition downstream.

#### Summary of Implementation
- Extended the graph document/schema contract with first-pass `receiveReferences`.
- Added explicit graph-targeted receive authoring methods in `useSpaghettiStore`:
  - `addGraphReceiveReference`
  - `removeGraphReceiveReference`
- Added selector-owned receive resolution by:
  - `sourceGraphDocumentId`
  - `sourceOutputEntryId`
- Kept linked receive resolution deterministic and independent of:
  - active graph
  - viewer target
  - focused viewport
  - graph labels or graph order
- Extended `useAppStore` project content derivation so linked receive references produce project-owned receive-link components with explicit resolved/unresolved state.
- Updated the `12C` task doc and roadmap tracker to reflect the shipped phase.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `src/app/io/graphDocumentPersistence.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.4C - GE - Phase 12C.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Graph documents can now persist explicit linked receive declarations that point at another graph's published output entry.
- Project content now surfaces linked cross-graph receive components and keeps missing source publications visible as unresolved instead of silently dropping them.
- Cross-graph receive resolution is now id-based rather than inferred from UI focus state.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/spaghetti/schema/spaghettiSchema.test.ts src/app/io/graphDocumentPersistence.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/store/useAppStore.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 201 -->
### [201] - 2026-03-11 20:56 - `GE - Phase 12B - Project Content Tree Ownership`
HUMAN SUMMARY: `Implemented the first real project-content layer above graph-owned publication by adding app-owned root-assembly and component records in \`useAppStore\`, deriving those components from resolved graph output entries, and exposing a thin Browser content surface that reads project-owned composition instead of only graph/cached-graph state.`

#### Scope / Constraints Honored
- Kept `12B` focused on project content tree ownership and a thin Browser read surface.
- Left graph-owned publication truth in `useSpaghettiStore`.
- Deferred deeper `Object / Part` hierarchy, Browser UX polish, and cross-graph `Publish / Receive` rules.

#### Summary of Implementation
- Added first-pass project content types and state to `useAppStore`:
  - `ProjectAssemblyRecord`
  - `ProjectComponentRecord`
  - `ProjectContentState`
- Added one real root assembly record behind `currentProject.rootAssemblyId`.
- Derived project-owned component records from resolved graph output entries while preserving source references back to:
  - `sourceGraphDocumentId`
  - `sourceOutputEntryId`
- Added selectors for:
  - current project content
  - root assembly
  - root components
  - Browser-facing project-content rows
- Updated `BrowserPanel` to render a thin `Content` section showing:
  - `Assembly Root`
  - derived `Component` rows
- Tightened the `12B` docs to match the shipped cut:
  - resolved outputs only
  - project content as first-pass project-owned runtime composition state
- Updated the GE family doc and roadmap lane body so `12B` now reads as implemented.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/BrowserPanel.tsx`
- `docs/Phase-Plans/Tasks/Future/01.4b - GE - Phase 12b.md`
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The app now owns a first-pass project content tree above graph-owned output surfaces.
- `rootAssemblyId` now points to one real root assembly record instead of staying as a nullable symbolic anchor.
- Resolved graph output entries now lift into project-owned component records that Browser surfaces can read without reconstructing project composition from graph/editor state.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/store/useAppStore.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 200 -->
### [200] - 2026-03-11 18:10 - `DOC - GE Phase 12B Task Doc Rewrite`
HUMAN SUMMARY: `Reworked the `GE - Phase 12B - Project Content Tree Ownership` task doc from a placeholder shell into a decision-complete implementation spec, and updated the roadmap tracker so `[1.4B]` now counts as having a real phase doc.`

#### Scope / Constraints Honored
- Updated docs only.
- Kept `12B` focused on project content tree ownership, minimal Browser read surface, and the graph-versus-project composition cut.
- Deferred cross-graph rules, deeper Browser hierarchy, and richer Browser/workspace behavior to later phases.

#### Summary of Implementation
- Rewrote `docs/Phase-Plans/Tasks/Old/01.4b - GE - Phase 12b.md` into a real execution spec.
- Locked the first-pass `12B` decisions, including:
  - one real root assembly record behind `rootAssemblyId`
  - one project-owned component per graph output entry
  - project content ownership in `useAppStore`
  - graph output ownership staying in `useSpaghettiStore`
  - a minimal `Assembly Root -> Component` Browser read surface
- Replaced placeholder sections with a real:
  - problem statement
  - direction
  - first-pass type contract
  - seam findings
  - deferred boundary
  - proof bar
- Updated `docs/Human-Plans/roadmap/roadmap.md` so `[1.4B]` now shows `Plan.md Status` as created in both the tracker section and the dedicated-plan checklist.

#### Files Changed
- `docs/Phase-Plans/Tasks/Old/01.4b - GE - Phase 12b.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the rewritten `12B` task doc to confirm it now matches the decision-complete execution-spec style used by the other active phase docs.
- Confirmed the roadmap tracker now marks `[1.4B]` as having a created task doc while parent `[1.4]` remains open.

<!-- ENTRY 199 -->
### [199] - 2026-03-11 18:02 - `DOC - GE Phase 12B Old Task Doc Skeleton`
HUMAN SUMMARY: `Created the old-task-doc format skeleton for `GE - Phase 12B - Project Content Tree Ownership`, so there is now a matching `01.4B` execution-doc shell ready to be filled in from the family-level `12B` answers.`

#### Scope / Constraints Honored
- Updated docs only.
- Created a format/setup skeleton rather than a filled implementation spec.
- Kept the new file aligned with the current old-task-doc structure used by nearby phase docs.

#### Summary of Implementation
- Added `docs/Phase-Plans/Tasks/Old/01.4b - GE - Phase 12b.md`.
- Set up the standard task-doc sections:
  - `Progress CheckList`
  - `Doc Header`
  - `Purpose`
  - `Scope`
  - `Refactor Rule For This Phase`
  - `Source Inputs`
  - `Arch Spec`
- Seeded `12B`-specific placeholder buckets for:
  - first-pass content tree shape
  - first-pass `Component` meaning
  - graph-owned versus project-owned authority
  - deferred work
  - proof bar

#### Files Changed
- `docs/Phase-Plans/Tasks/Old/01.4b - GE - Phase 12b.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the new file to confirm it matches the structure pattern used by the neighboring old task docs while staying as a setup skeleton instead of a filled spec.

<!-- ENTRY 198 -->
### [198] - 2026-03-11 17:56 - `DOC - GE Phase 12B Component Granularity Note`
HUMAN SUMMARY: `Added a short caution note under the `GE - Phase 12B` `Component` suggestion so the family doc now explicitly warns against hard-locking one-component-per-graph granularity too early before later output-structure work clarifies final grouping.`

#### Scope / Constraints Honored
- Updated docs only.
- Kept the note local to the `12B` section instead of rewriting the whole family answer set.
- Preserved the existing `12B` direction while making the `Component` wording safer for later output-structure growth.

#### Summary of Implementation
- Added a new doc-history entry to `docs/Phase-Plans/01_GE - Phase-Plans.md`.
- Added a `Granularity caution` note under the `12B Q2` suggested answer.
- Explicitly warned against prematurely hard-locking:
  - exactly one component per graph
- Added safer first-pass wording that keeps `Component` defined as the first project-owned bundle created from graph-published output.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the `12B Q2` section in `docs/Phase-Plans/01_GE - Phase-Plans.md` to confirm the new caution sits directly under the `Component` suggested answer and keeps the family doc aligned with later output-structure flexibility.

<!-- ENTRY 197 -->
### [197] - 2026-03-11 17:52 - `DOC - GE Phase 12B Suggested Answers`
HUMAN SUMMARY: `Added first-pass suggested answers to the GE family doc for `GE - Phase 12B` questions `Q1` through `Q4`, so the project-content ownership planning surface now carries a concrete proposal before those answers are formally locked.`

#### Scope / Constraints Honored
- Updated docs only.
- Added suggestions without converting the `12B` questions into locked family decisions.
- Kept the proposed `12B` boundary focused on ownership and containment rather than Browser UX or richer output-structure work.

#### Summary of Implementation
- Added a new doc-history entry to `docs/Phase-Plans/01_GE - Phase-Plans.md`.
- Added suggested-answer text under `GE - Phase 12B`:
  - `Q1` minimum project content tree shape
  - `Q2` first-pass `Component` meaning
  - `Q3` graph-versus-project parenting authority
  - `Q4` explicit out-of-scope boundary for later Browser/workspace lanes
- Kept the first-pass tree small and aligned to `Project File -> Assembly Root -> Component`.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Reviewed the new `12B` suggestions to confirm they stay inside `GE - Phase 12B` ownership work and do not pull in later Browser UX, viewer workspace controls, or final Browser-facing output structure.

<!-- ENTRY 196 -->
### [196] - 2026-03-11 17:46 - `DOC - GE Phase 12A Left-Out Boundary Note`
HUMAN SUMMARY: `Added a short `What 12A Left Out` carry-forward block to the GE family doc so the work intentionally deferred out of the shipped `12A` cut is visible directly next to the locked `12A` answers.`

#### Scope / Constraints Honored
- Updated docs only.
- Kept the note inside the GE family phase doc rather than reopening the dedicated `12A` task doc.
- Preserved the existing phase split where `12B` owns content-tree work and `12C` owns cross-graph rules.

#### Summary of Implementation
- Added a new doc-history entry to `docs/Phase-Plans/01_GE - Phase-Plans.md`.
- Added a `What 12A Left Out` section under the `GE - Phase 12` family body.
- Listed the intentionally deferred items, including:
  - project-file persistence
  - content-tree ownership beyond nullable `rootAssemblyId`
  - Browser hierarchy/workspace growth
  - cross-graph `Publish / Receive`
  - `Link` versus `Hard Copy`
  - project-owned reference assets
- Added a short carry-forward rule pointing that deferred work to `12B`, `12C`, and later `SP` / `AS` / `VR` phases.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the `GE - Phase 12` family section to confirm the new carry-forward block sits after the locked `12A` answers and before the open `12B` / `12C` question surfaces.

<!-- ENTRY 195 -->
### [195] - 2026-03-11 17:40 - `GE - Phase 12A - Project File Core And Graph Collection Ownership`
HUMAN SUMMARY: `Implemented the first real in-memory project-above-graphs model by adding `ProjectFile` ownership to `useAppStore`, mirroring project graph membership from spaghetti graph documents, and rerouting graph-aware spaghetti builds to the real current project id instead of the fake legacy runtime project id.`

#### Scope / Constraints Honored
- Added the first `12A` implementation without pulling in project-file disk persistence.
- Kept `useAppStore` as the project owner and left `useSpaghettiStore` as the graph/editor/runtime owner.
- Deferred content-tree ownership and cross-graph `Publish / Receive` rules to later phases.

#### Summary of Implementation
- Added a first-pass `ProjectFile` and `ProjectGraphDocumentEntry` model to `useAppStore`.
- Added app-store selectors for current project, current project id, and current project graph membership.
- Mirrored project graph membership from spaghetti graph-document order/name changes without deriving membership from viewport or viewer-target state.
- Updated graph-aware build requests to route through the real current `projectFileId`.
- Rejected wrong-project spaghetti build results at the app-store boundary.
- Added targeted app-store tests covering:
  - current project shape
  - project graph membership independence from viewport/viewer state
  - project membership updates after file load
  - graph-aware routing identity using the real project id
- Updated the `12A` task doc, GE family doc, and roadmap lane-body status to reflect shipped implementation.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.4A - GE - Phase 12A.md`
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Spaghetti graph-aware build requests now use the current project id from app-owned project state.
- The app now has one explicit current `ProjectFile` with graph membership/order that is separate from editor viewport and viewer-target state.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/store/useAppStore.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 194 -->
### [194] - 2026-03-11 17:18 - `DOC - GE Phase 12A Task Doc Creation`
HUMAN SUMMARY: `Created the dedicated `GE - Phase 12A - Project File Core And Graph Collection Ownership` task doc as an implementation-ready execution spec, and updated the roadmap tracker so `[1.4A]` now counts as having a real phase doc.`

#### Scope / Constraints Honored
- Updated docs only.
- Kept `12A` explicitly scoped to in-memory project ownership and graph collection ownership.
- Deferred project-file persistence, content tree ownership, and cross-graph rules to later phases.

#### Summary of Implementation
- Added `docs/Phase-Plans/Tasks/Future/01.4A - GE - Phase 12A.md`.
- Locked the first-pass `ProjectFile` contract, `useAppStore` ownership cut, project-versus-runtime boundary, and the routing change from `LEGACY_RUNTIME_PROJECT_FILE_ID` to the real current project id inside the new task doc.
- Updated `docs/Human-Plans/roadmap/roadmap.md` so `[1.4A]` now shows `Plan.md Status` as created in both the tracker section and the dedicated-plan checklist.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.4A - GE - Phase 12A.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Reviewed the new `12A` task doc to confirm it matches the current execution-spec structure used by `11A` and `10C`.
- Confirmed the roadmap tracker now marks `[1.4A]` as having a created task doc while leaving parent `[1.4]` open.

<!-- ENTRY 193 -->
### [193] - 2026-03-11 17:08 - `DOC - GE Phase 12A Suggested Answers`
HUMAN SUMMARY: `Added first-pass suggested answers to the GE family doc for `GE - Phase 12A` questions `Q1` through `Q3`, so the project-file and graph-ownership planning surface now carries a concrete proposal before those answers are formally locked.`

#### Scope / Constraints Honored
- Updated docs only.
- Added suggestions without converting the `12A` questions into locked family decisions.
- Kept the proposed boundary aligned with the current roadmap split between project ownership and runtime/editor/viewer state.

#### Summary of Implementation
- Added a new doc-history entry to `docs/Phase-Plans/01_GE - Phase-Plans.md`.
- Added suggested-answer text under `GE - Phase 12A`:
  - `Q1` minimum `ProjectFile` shape
  - `Q2` project-owned graph collection scope
  - `Q3` durable project data versus runtime-only state boundary
- Included a first-pass TypeScript shape for `ProjectFile` and `ProjectGraphDocumentEntry`.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Reviewed the `12A` suggestions to confirm they stay inside `GE - Phase 12A` ownership work and do not pull in later Browser hierarchy or richer workspace-state responsibilities.

<!-- ENTRY 192 -->
### [192] - 2026-03-11 17:02 - `DOC - GE Phase 12 Family Question Setup`
HUMAN SUMMARY: `Expanded the GE family doc's future `GE - Phase 12 - Multi-Document Graph Ownership` section into a real planning surface with explicit open questions for `12A`, `12B`, and `12C`, so the next task docs can be defined against concrete ownership decisions instead of only a placeholder summary.`

#### Scope / Constraints Honored
- Updated docs only.
- Kept `GE - Phase 12` in a planning/question state rather than pretending answers are already locked.
- Preserved the roadmap boundary where Browser workspace polish and richer output structure stay in later `SP` / `AS` / `VR` phases.

#### Summary of Implementation
- Added a new doc-history entry to `docs/Phase-Plans/01_GE - Phase-Plans.md`.
- Expanded the `GE - Phase 12` notes to show current planning state.
- Added a family-level `12A` / `12B` / `12C` question surface covering:
  - minimum `Project File` shape
  - graph collection ownership
  - project content tree boundaries
  - `Component` meaning
  - assembly/object parenting authority
  - `publish / receive`
  - `Link` versus `Hard Copy`
  - cross-graph identity requirements
  - singleton assumptions that must be broken later
- Replaced the old flat `Phase 12` checklist with grouped checklist buckets aligned to the future subphases.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Reviewed the new `GE - Phase 12` section to confirm the open questions line up with roadmap subphases `[1.4A]`, `[1.4B]`, and `[1.4C]`.
- Confirmed the checklist now reflects the same `12A` / `12B` / `12C` split instead of one flat placeholder list.

<!-- ENTRY 191 -->
### [191] - 2026-03-11 16:34 - `DOC - Roadmap GE11 Completion Sync`
HUMAN SUMMARY: Updated the roadmap lane-body status for `GE - Phase 11 - Graph Persistence And Save Load` to complete, because the shipped `11A`, `11B`, and `11C` subphases now fully cover that lane-body work even though there is still no separate umbrella `1.2` task doc.

#### Scope / Constraints Honored
- Updated docs only.
- Changed the lane-body completion state without altering the parent `[1.2]` `Plan.md Status` tracker.
- Kept the distinction between “implemented phase” and “separate umbrella task doc exists.”

#### Summary of Implementation
- Marked `### [1.2]` as `[x]` in the roadmap lane body.
- Marked the lane-body `GE - Phase 11` checklist items complete.
- Added a roadmap doc-history note explaining why the lane body is now complete while the parent `Plan.md Status` remains open.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only roadmap status sync.

#### Verification Steps
- Re-read the `GE - Phase 11` lane-body section in `docs/Human-Plans/roadmap/roadmap.md`.
- Confirmed `11A`, `11B`, and `11C` are all shipped while the parent `[1.2]` `Plan.md Status` tracker remains separate.

<!-- ENTRY 190 -->
### [190] - 2026-03-11 16:28 - `VM - Phase 15 - Browser Open Viewports Stable Order`
HUMAN SUMMARY: Kept the Browser panel's `Open Viewports` list in stable viewport-order instead of re-sorting the focused viewport to the top, so focus is now communicated by highlight without the list jumping around.

#### Scope / Constraints Honored
- Kept the change limited to Browser-panel viewport list rendering.
- Did not change viewport focus, z-order, or close behavior.
- Left the existing focused-row highlight behavior intact.

#### Summary of Implementation
- Removed the local `zOrder` sort from the `Open Viewports` render path in `BrowserPanel.tsx`.
- The panel now renders viewports in the existing `editorViewportOrder` sequence and only uses the focused-row styling/meta to indicate focus.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The focused viewport no longer jumps to the top of the Browser panel's `Open Viewports` list.
- The list order stays stable while the focused viewport remains visibly highlighted.

#### Verification Steps
- Re-read the `Open Viewports` render path in `src/app/panels/BrowserPanel.tsx`.
- Confirmed the local `zOrder` sort is removed and the focused-row styling still applies.

<!-- ENTRY 189 -->
### [189] - 2026-03-11 16:21 - `SP - Phase 10C - Graph Output Handoff Surface`
HUMAN SUMMARY: Implemented the first graph-owned output handoff seam for spaghetti by adding published output surfaces to graph runtime state, exposing output-surface selectors, and rerouting the current parts-list and debug output readers so they consume one canonical graph-owned declaration surface instead of rebuilding publication meaning independently.

#### Scope / Constraints Honored
- Implemented `10C` only.
- Kept authored `OutputPreview` node params as the source of declaration truth.
- Kept the shared viewer on the `10B` viewer-target path instead of turning viewer presentation into publication truth.
- Kept Browser hierarchy, project ownership, and richer `AS` output structure out of scope.

#### Summary of Implementation
- Added a new spaghetti output-surface module defining the first-pass `GraphOutputSurface` and `GraphPublishedOutputEntry` contract plus derivation logic from preview preparation and accepted graph-local build outputs.
- Expanded `useSpaghettiStore` graph runtime state so each graph document now owns a derived published output surface alongside compile/build and preview runtime memory.
- Added graph-output-surface selectors, including graph-by-id and viewer-target variants.
- Rerouted the spaghetti parts-list panel path to consume the graph-owned output surface through new output-surface-backed selectors.
- Updated the debug inspector path so the `OutputPreview` section now reads graph-owned output entry state directly while keeping preview-render/viewer sections on the existing viewer/render path.
- Added targeted tests proving graph-owned output-surface isolation, slot-state derivation, and output-surface-backed selector behavior.
- Refreshed the `10C` task doc, the `SP` family phase doc, and the roadmap lane-body status to reflect shipped implementation.

#### Files Changed
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/spaghetti/partsList/selectPartsListItems.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.ts`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.test.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.3C - SP - Phase 10C.md`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- In spaghetti mode, the parts list and debug inspector now read graph-owned published output state instead of reconstructing `OutputPreview` publication meaning independently.
- Each graph document now tracks a first-pass published output surface with explicit `empty`, `unresolved`, and `resolved` slot states.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/partsList/selectPartsListItems.test.ts src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 188 -->
### [188] - 2026-03-11 13:43 - `DOC - SP Phase 10C Task Doc Setup`
HUMAN SUMMARY: Created the dedicated `01.3C` task doc as the implementation-ready execution spec for graph-owned output handoff, then synced the roadmap tracker so `[1.3C]` now counts as having a dedicated plan doc.

#### Scope / Constraints Honored
- Updated docs only.
- Kept the new task doc focused on `10C` output declaration / handoff.
- Left later Browser hierarchy, project ownership, and richer output structure explicitly out of scope.

#### Summary of Implementation
- Added `docs/Phase-Plans/Tasks/Future/01.3C - SP - Phase 10C.md`.
- Wrote the new task doc in the same execution-spec shape used by `10A` and `10B`.
- Grounded the doc in the live `10C` seams across `useSpaghettiStore`, `previewPreparation`, output-facing selectors, debug surfaces, and `ViewerHost`.
- Locked the first-pass `GraphOutputSurface` contract, authored-versus-published ownership split, current seam cut, implementation order, and proof bar.
- Updated `docs/Human-Plans/roadmap/roadmap.md` so `[1.3C]` now shows `Plan.md Status` as created and the dedicated-doc totals reflect the new task doc.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.3C - SP - Phase 10C.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only planning update.

#### Verification Steps
- Re-read the new `01.3C` task doc to confirm it matches the `10A` / `10B` execution-spec shape.
- Re-read the roadmap tracker to confirm `[1.3C]` now shows `Plan.md Status` as created and the dedicated-doc totals increment accordingly.

<!-- ENTRY 187 -->
### [187] - 2026-03-11 13:31 - `DOC - SP Phase 10C Answer Lock`
HUMAN SUMMARY: Locked the `SP - Phase 10C` family-doc answers so the output-handoff planning surface now reflects a graph-owned published output seam, authored-versus-published ownership split, explicit slot-state rules, and a narrow phase boundary aligned to the vision roadmap.

- updated `docs/Phase-Plans/11_SP - Phase-Plans.md`
- converted `10C.Q1` through `10C.Q7` from open questions into locked first-pass answers
- kept the `10C` wording graph-owned and handoff-focused so it does not drift into later Browser or project hierarchy work

<!-- ============================================================ -->
### [186] - 2026-03-11 13:15 - `DOC - Vision Roadmap Phase Label Pass`
<!-- ============================================================ -->
HUMAN SUMMARY: `Normalized the rough phase list inside the vision roadmap so every lane entry now shows an explicit prefix-and-phase label, reusing real canonical ids where they already exist and marking the remaining unassigned items with visible `Phase TBD` placeholders.`  

#### Scope / Constraints Honored
- Updated docs only.
- Kept the work inside the vision roadmap draft rather than promoting placeholder labels into the canonical execution roadmap.
- Reused existing canonical family/phase ids where the phase setup and roadmap already support them.

#### Summary of Implementation
- Added a short `Phase TBD` note to the `Vision-Completion Draft` section.
- Updated all rough phase entries so they now read with explicit prefix-and-phase labels.
- Used existing canonical labels where already supported, including:
  - `SP - Phase 9`
  - `SP - Phase 10`
  - `SP - Phase 10C`
  - `SP - Phase 11`
  - `GE - Phase 11`
  - `GE - Phase 12`
  - `AS - Phase 5`
  - `AS - Phase 6`
  - `VR - Phase 5`
  - `VR - Phase 6`
  - `JK - Phase 2`
  - `EX - Phase 2 / 3 / 4 / 5`
- Marked the still-unassigned vision-draft items with explicit `Phase TBD` labels so missing canonical ownership is easy to spot.

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only planning clarity update.

#### Verification Steps
- Re-read the `Vision-Completion Draft` phase lists in `docs/Human-Plans/roadmap/Vision-roadmap.md`
- Confirmed that every phase line now shows either:
  - a concrete prefix-and-phase id
  - or a visible `Phase TBD` placeholder

<!-- ============================================================ -->
### [185] - 2026-03-11 13:11 - `DOC - Vision Roadmap Clarity Pass`
<!-- ============================================================ -->
HUMAN SUMMARY: `Tightened the vision roadmap with a compact core data-flow section, sharper `OutputPreview` wording, an explicit Lane `[1]` finish condition, a clearer `Tier 1` versus `Tier 2` distance read, and a lightweight contracts/IR note so the north-star doc is easier to use without becoming overly implementation-heavy.`  

#### Scope / Constraints Honored
- Updated docs only.
- Kept the changes inside the vision roadmap rather than moving them into the execution roadmap.
- Added the requested clarity improvements without turning the file into a detailed implementation spec.

#### Summary of Implementation
- Added a new `Core Data Flow` section showing the intended top-level truth flow:
  - `GraphDocument -> Compile / Evaluate -> Graph Runtime Memory -> Graph Output Declaration -> Project Composition -> Viewer Presentation`
- Strengthened the `OutputPreview` wording so it now reads as the first pass of the graph-owned output declaration surface.
- Added an explicit done-condition line for Lane `[1]`.
- Split the rough distance read into:
  - `Tier 1 - First real graph-native app`
  - `Tier 2 - Vision-complete studio`
- Added a short `Contracts / Schema / IR Discipline` section as a cross-cutting architecture rule instead of a new full top-level pillar.

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only vision-roadmap clarity update.

#### Verification Steps
- Re-read the updated sections in `docs/Human-Plans/roadmap/Vision-roadmap.md`:
  - `Core Data Flow`
  - `Explicit Output Handoff`
  - `Contracts / Schema / IR Discipline`
  - `Lane [1]`
  - `Rough Read On Distance Remaining`

<!-- ============================================================ -->
### [184] - 2026-03-11 12:43 - `DOC - Vision Roadmap Full Lane Draft`
<!-- ============================================================ -->
HUMAN SUMMARY: `Expanded the vision roadmap with a rough first-pass lane-and-phase completion draft so the north-star doc now shows the major work groups still needed to reach the full product vision, including Browser ownership, node/wire hardening, part/feature growth, graph-native build contracts, Jake mode, and final cleanup.`  

#### Scope / Constraints Honored
- Updated docs only.
- Kept the new content in the vision roadmap instead of turning the execution roadmap into a second product-vision doc.
- Treated the added lane map as a rough first draft rather than locked canonical sequencing.

#### Summary of Implementation
- Added a new `Vision-Completion Draft` section to `docs/Human-Plans/roadmap/Vision-roadmap.md`.
- Broke the full long-range product into six rough lanes:
  - graph-native foundation and ownership
  - node/wire/driver/authoring hardening
  - Browser workspace and project content structure
  - graph-native build/geometry/assembly/export
  - product modes and simplified editing
  - ecosystem/polish/final replacement
- Added a rough distance read distinguishing:
  - the smaller set of work likely needed for a first coherent graph-native working app
  - the larger set of work likely needed for the fuller long-range vision

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only vision-planning update.

#### Verification Steps
- Re-read the updated `Vision-Completion Draft` section in `docs/Human-Plans/roadmap/Vision-roadmap.md`
- Confirmed the new section stays:
  - broader than `roadmap.md`
  - compatible with the current roadmap direction
  - explicit about node/wire/part work in addition to Browser/ownership work

<!-- ============================================================ -->
### [183] - 2026-03-11 12:34 - `DOC - Vision Roadmap Decision Compass`
<!-- ============================================================ -->
HUMAN SUMMARY: `Rebuilt the vision roadmap into a canonical big-picture decision-check doc so product and architecture direction now lives in one stable north-star surface above the execution roadmap and phase-task planning.`  

#### Scope / Constraints Honored
- Updated docs only.
- Reused the current roadmap direction instead of inventing a competing product vision.
- Kept the new file focused on big-picture direction, guardrails, and decision filtering rather than execution sequencing.

#### Summary of Implementation
- Replaced the old loose vision-roadmap draft with a structured canonical doc using the current docs format.
- Added explicit sections for:
  - north star
  - product vision
  - architecture guardrails
  - desired end state
  - decision filters
  - early-phase guardrails
  - long-range pillars
  - quick decision questions
- Positioned the doc as the place to check future Codex decision questions against the intended destination while `roadmap.md` stays focused on execution order.

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only planning and direction update.

#### Verification Steps
- Re-read `docs/Human-Plans/roadmap/Vision-roadmap.md` to confirm it now functions as:
  - a big-picture product/architecture compass
  - a decision-check surface
  - a non-duplicative companion to `docs/Human-Plans/roadmap/roadmap.md`

<!-- ============================================================ -->
### [182] - 2026-03-11 12:28 - `DOC - Roadmap Checklist Sync After Family Alignment`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the roadmap checklist markers and totals so the tracker now counts `SP - Phase 11` and the later `AS`/`VR` carry-forward phases as roadmap-broken-down entries after the family phase-plan alignment pass, while still leaving decision coverage and task-doc status unchecked.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept the change limited to roadmap checklist markers and totals.
- Did not falsely mark later carry-forward phases as decision-complete or task-doc-ready.

#### Summary of Implementation
- Marked `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts` as roadmap-broken-down now that it has a real family planning surface.
- Marked `[2.1]` through `[2.5]` as roadmap-broken-down now that the later Browser/output/workspace carry-forward phases have explicit roadmap bodies and aligned family-doc homes.
- Left `Decision Coverage` and `Plan.md Status` unchecked for those later phases.
- Recomputed the roadmap breakdown totals from `16 / 11` to `22 / 5`.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only roadmap tracker update.

#### Verification Steps
- Reviewed the checklist marker sections and totals in `docs/Human-Plans/roadmap/roadmap.md`

<!-- ============================================================ -->
### [181] - 2026-03-11 12:25 - `DOC - Phase Plans Carry-Forward Phase Alignment`
<!-- ============================================================ -->
HUMAN SUMMARY: `Aligned the canonical phase-plan family docs with the newer roadmap carry-forward by renaming the future \`AS\` and \`VR\` phases to their current Browser/output/workspace homes and adding the missing future \`GE - Phase 12\` family section.`

#### Scope / Constraints Honored
- Updated planning/setup docs only.
- Kept the changes focused on canonical future phase naming and family-doc alignment.
- Reused the roadmap carry-forward direction instead of inventing new phase families.

#### Summary of Implementation
- Updated `00_Phase-Setup.md` so the canonical future phase ladder now uses:
  - `AS - Phase 5 - Browser-Facing Graph Output Structure`
  - `AS - Phase 6 - Project Content Inspection And Build Control Surface`
  - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
  - `VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`
- Reworked the `AS` family placeholders so `Phase 5` and `Phase 6` now describe the later Browser-facing output/content structure and build-control surfaces that the roadmap carries forward from `SP - Phase 11`.
- Reworked the `VR` family placeholders so `Phase 5` and `Phase 6` now describe the later reference/workspace layering and richer Browser/viewer controls that were intentionally deferred out of the first Browser pass.
- Added the missing `GE - Phase 12 - Multi-Document Graph Ownership` section to the `GE` family doc so the later project-file, graph-document, and project-content ownership work now has a real family-level home instead of existing only in `00_Phase-Setup.md` and the roadmap.

#### Files Changed
- `docs/Phase-Plans/00_Phase-Setup.md`
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/Phase-Plans/08_VR - Phase-Plans.md`
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only phase-plan alignment update.

#### Verification Steps
- Reviewed the updated future phase ladders in:
  - `docs/Phase-Plans/00_Phase-Setup.md`
  - `docs/Phase-Plans/07_AS - Phase-Plans.md`
  - `docs/Phase-Plans/08_VR - Phase-Plans.md`
  - `docs/Phase-Plans/01_GE - Phase-Plans.md`

<!-- ============================================================ -->
### [180] - 2026-03-11 12:19 - `SP - Phase 11 - Q6 Carry-Forward Note`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a concrete carry-forward note under \`SP - Phase 11 Q6\` so the family doc now records what the existing history and roadmap already established about the first Browser-pass boundary and what still remains to be locked before that out-of-scope answer is final.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept the change focused on `SP - Phase 11 Q6`.
- Did not prematurely mark `Q6` resolved.

#### Summary of Implementation
- Expanded the `Q6` working notes in `11_SP - Phase-Plans.md` to summarize what the current tracked history already established:
  - `SP - Phase 11` is still only a planning surface
  - the roadmap already carries a defer map into later Browser workspace, output-structure, build-control, visibility/material, and workspace-presentation phases
  - the answered `Q2` through `Q5` items already narrowed the first pass to a graph-document tree with simple open/focus behavior
- Added a short “what is still left to lock” list so `Q6` now shows the remaining out-of-scope boundary work instead of only saying `pending`.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only planning clarification.

#### Verification Steps
- Reviewed `SP - Phase 11 Q6` in `docs/Phase-Plans/11_SP - Phase-Plans.md`

<!-- ============================================================ -->
### [179] - 2026-03-11 12:16 - `SP - Phase 10B - Family Doc Cleanup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Cleaned the SP family phase doc so \`10B\` now appears only once as the canonical answered question block, removing the stale lower duplicate draft section that was still making \`10B\` look partially open.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept the cleanup focused on the `SP - Phase 10` family doc.
- Preserved the live answered `10B` block and the active `10C` question block.

#### Summary of Implementation
- Added a new family-doc history note explaining the cleanup.
- Removed the stale lower duplicate `10B` draft question block from `11_SP - Phase-Plans.md`.
- Cleared the stray leftover bullets from that removed draft so the file now reads with one canonical answered `10B` section followed by the active `10C` planning surface.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only cleanup.

#### Verification Steps
- Reviewed the `SP - Phase 10` section in `docs/Phase-Plans/11_SP - Phase-Plans.md` to confirm that `10B` appears only as the answered `10B.Q1` through `10B.Q6` block and no duplicate lower `10B` draft remains.

<!-- ============================================================ -->
### [178] - 2026-03-11 12:10 - `SP - Phase 10 - Question Label Normalization`
<!-- ============================================================ -->
HUMAN SUMMARY: `Normalized the remaining \`10B / 10C\` question labels in the SP family phase doc so the live and archived \`Phase 10\` question blocks now carry explicit subphase ids instead of ambiguous generic \`Q1 / Q2 / Q3\` markers.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept the change focused on `SP - Phase 10` question labeling clarity.
- Preserved the older draft block as history instead of deleting it.

#### Summary of Implementation
- Added a new family-doc history note explaining the label normalization.
- Marked the old lower `10B` question block as an archived draft and relabeled its checklist and headings to `10B.Draft.Q1` through `10B.Draft.Q5`.
- Left the live `10B.Q1` through `10B.Q6` block and the new `10C.Q1` through `10C.Q7` block as the canonical active question surfaces.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only clarity update.

#### Verification Steps
- Reviewed the `SP - Phase 10` sections in `docs/Phase-Plans/11_SP - Phase-Plans.md` to confirm that the live `10B` and `10C` questions are explicitly labeled and the older duplicate `10B` block is clearly marked as archived.

<!-- ============================================================ -->
### [177] - 2026-03-11 12:03 - `SP - Phase 10C - Family Question Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a dedicated \`10C\` question block to the SP family phase doc so the remaining output-declaration and graph-output handoff decisions now have their own implementation-prep surface before a dedicated \`10C\` task doc is created.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept the new questions scoped to `10C` output declaration and handoff semantics.
- Did not reopen completed `10A` routing or completed `10B` graph-local runtime ownership.

#### Summary of Implementation
- Added a `10C` checklist with seven open decision questions covering:
  - first-pass graph-owned output declaration shape
  - authored `OutputPreview` truth versus derived published output surface
  - published row identity
  - empty/unresolved/resolved slot representation
  - current seam cut
  - minimum automated proof bar
  - explicit out-of-scope boundary
- Added one subsection per `10C` question with `Why This Matters` and `Current Working Read` notes so the next planning pass can lock answers without mixing `10C` back into `10A` or `10B`.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only planning update.

#### Verification Steps
- Reviewed the updated `10C` block in `docs/Phase-Plans/11_SP - Phase-Plans.md`

<!-- ============================================================ -->
### [176] - 2026-03-11 11:16 - `SP - Phase 10B - Graph-Local Preview And Build Memory`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented \`SP - Phase 10B\` by moving accepted spaghetti build outputs into graph-local runtime state, adding explicit \`viewerTargetGraphDocumentId\` ownership for shared-viewer reads, and rerouting the main spaghetti preview/read surfaces away from app-global spaghetti \`parts\` while preserving shared presentation state such as visibility and selection.`

#### Scope / Constraints Honored
- Kept `10B` focused on graph-local preview/build memory and explicit viewer-target reads.
- Reused the shipped `10A` graph-aware request/result routing contract instead of changing worker envelopes again.
- Left `10C` output handoff semantics, Browser hierarchy growth, and project ownership work out of scope.

#### Summary of Implementation
- Expanded `GraphRuntimeState` in `useSpaghettiStore` so each graph now owns accepted build outputs and accepted preview build outputs in addition to compile/build and preview-preparation state.
- Added explicit `viewerTargetGraphDocumentId` ownership and viewer-target selectors in `useSpaghettiStore`, and wired viewport focus/rebinding paths so viewer targeting updates through explicit store state instead of implicit active-graph reads.
- Updated `useAppStore.acceptBuildResult(...)` so spaghetti build results are accepted into graph-local runtime truth instead of projecting canonical spaghetti outputs into app-global `parts`.
- Rerouted `ViewerHost`, `PartsListPanel`, `DebugInspectorDrawer`, and `ViewToolbar` so spaghetti-mode reads now follow viewer-target graph-local outputs instead of app-global spaghetti `parts`.
- Added automated coverage for graph-local accepted-output isolation, viewer-target-following behavior, and app-store acceptance preserving graph-local ownership.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `docs/Phase-Plans/Tasks/Future/01.3B - SP - Phase 10B.md`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- In spaghetti mode, accepted build outputs now persist per graph even when that graph is not the current viewer target.
- The shared viewer and the main spaghetti read surfaces now resolve spaghetti preview/build reads from explicit viewer-target state instead of the focused editor graph or app-global spaghetti `parts`.
- App-global `parts` remains the canonical legacy-mode build-output bucket; it is no longer the canonical spaghetti-mode runtime bucket.

#### Verification Steps
- `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/store/useAppStore.test.ts`
- `npm.cmd run build`

<!-- ============================================================ -->
### [175] - 2026-03-11 04:00 - `SP - Phase 10B - Implementation Doc Tightening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Rewrote the dedicated \`10B\` task doc into a code-grounded implementation-ready execution spec by carrying the locked family answers forward, defining graph-local accepted build-output ownership and explicit viewer-target state as the phase core, and grounding the plan in the current `useAppStore`, `ViewerHost`, `bootstrapBuildWiring`, and `useSpaghettiStore` seams.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept `10B` scoped to graph-local preview/build memory and shared-viewer targeting.
- Kept `10A` routing identity, `10C` output handoff, Browser hierarchy growth, and project ownership out of scope.

#### Summary of Implementation
- Replaced the `10B` setup stub with a full implementation-ready execution spec matching the `10A` doc structure.
- Marked the planning/setup checklist complete while leaving the implementation done-check open.
- Locked the first-pass `10B` direction around:
  - graph-local accepted spaghetti build-output ownership
  - graph-local preview render-source ownership
  - explicit `viewerTargetGraphDocumentId`
  - viewer-target-following spaghetti inspection/read surfaces
  - shared visibility/selection presentation state for the first pass
- Grounded the doc in the current code seams where spaghetti preview/build memory still remains too global:
  - `useAppStore`
  - `ViewerHost`
  - `bootstrapBuildWiring`
  - `useSpaghettiStore`
  - `PartsListPanel`
  - `DebugInspectorDrawer`
- Added the concrete implementation sequence, acceptance criteria, and the full locked `10B` test bar.
- Added a roadmap doc-history note so the tracker now reflects that `01.3B` is implementation-ready rather than only created.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.3B - SP - Phase 10B.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10B` now has an implementation-ready task doc instead of a setup stub.

#### Verification Steps
- Re-read the rewritten `10B` task doc against the locked `10B` family section and the live runtime/viewer seams to confirm the doc is decision-complete for implementation.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [174] - 2026-03-11 03:45 - `SP - Phase 10B - Test Bar Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked \`10B.Q6\` in the \`SP\` family phase doc so graph-local preview/build memory now has an explicit automated proof bar covering graph-local runtime isolation, graph-local preview-prep isolation, explicit viewer-target selection, build-vs-view separation, stale/wrong-graph protection, and removal of the last canonical one-global spaghetti runtime seams.`

#### Scope / Constraints Honored
- Updated planning docs only.
- Kept the change focused on the remaining `10B` proof-bar question.
- Did not rewrite the dedicated `10B` task doc yet.

#### Summary of Implementation
- Marked `10B.Q6` resolved in the `SP - Phase 10B` family checklist.
- Replaced the open `10B.Q6` placeholder with a locked-answer section defining the minimum required automated test bar.
- Added the `10B.Q6` summary line to the `10B Locked Answers So Far` block so the `10B` family section now reads as a full first-pass decision set.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10B` now has its automated proof bar locked at the family-doc level.

#### Verification Steps
- Re-read the `10B` section in the `SP` family doc to confirm `Q1` through `Q6` are now all marked resolved and the new test bar matches the already-locked `10B` seam and viewer-target rules.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [173] - 2026-03-11 03:35 - `SP - Phase 10B - First Question Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked the first five \`10B\` answers in the \`SP\` family phase doc so graph-local preview/build memory now has explicit decisions for the seam cut, reused routing contract, shared-viewer targeting, multi-graph overwrite safety, and out-of-scope boundaries, while leaving the `10B` test-bar question open.`

#### Scope / Constraints Honored
- Updated planning docs only.
- Kept `10B` partially locked rather than pretending it is fully implementation-ready.
- Left the `10B` automated proof-bar question open.
- Left `10C` and later ownership/output work untouched.

#### Summary of Implementation
- Reworked the `10B` question block so its numbering now matches the actual answered questions.
- Marked `10B.Q1` through `10B.Q5` resolved.
- Locked:
  - the exact first-pass seam cut across `useAppStore`, `bootstrapBuildWiring`, `buildDispatcher`, and `ViewerHost`
  - reuse of the minimal graph-routed request/result contract from `10A`
  - explicit `viewerTargetGraphDocumentId` ownership for shared-viewer projection
  - per-graph stale-drop and supersession rules for multi-graph safety
  - the `10B` scope boundary versus later `10C`, `AS`, `SP 11`, and `GE 12` work
- Added a compact `10B Locked Answers So Far` summary block under the resolved sections.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10B` now has a partially locked family-doc decision surface instead of a fully open question draft.

#### Verification Steps
- Re-read the `10B` section in the `SP` family doc to confirm the resolved questions and numbering now align cleanly with the new locked answers.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [172] - 2026-03-11 03:20 - `SP - Phase 10B - Question Block Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a dedicated \`10B\` question block to the \`SP\` family phase doc so graph-local preview/build memory now has its own open implementation-prep checklist covering runtime ownership, shared-viewer projection, non-focused graph result handling, seam cuts, proof-bar testing, and scope boundaries.`

#### Scope / Constraints Honored
- Updated planning docs only.
- Kept the new `10B` block open rather than pretending the phase is already decision-complete.
- Left `10C` and later project-ownership work untouched.

#### Summary of Implementation
- Added a `10B`-specific decision checklist under the `SP - Phase 10B` family section.
- Added seven open `10B` questions covering:
  - graph-local preview/build runtime ownership
  - allowed remaining app-global bridge state
  - shared viewer projection rules versus build truth
  - non-focused graph result storage behavior
  - current seam cuts across `useAppStore`, `ViewerHost`, `bootstrapBuildWiring`, and `useSpaghettiStore`
  - minimum automated proof bar
  - out-of-scope boundaries
- Added short `Why This Matters` and `Humanized Read` subsections for each question so the planning surface is easier to review before the answer-lock pass.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10B` now has its own question-driven planning section in the family phase doc.

#### Verification Steps
- Re-read the updated `10B` section in the `SP` family doc to confirm the new questions stay focused on graph-local preview/build memory and do not reopen already-locked `10A` routing decisions.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [171] - 2026-03-11 03:10 - `SP - Phase 10B - Plan Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`10B\` task doc in normalized `01.3B` form so graph-local preview/build memory now has its own planning surface, and refreshed the roadmap and `SP` family trackers so `[1.3B]` now counts as having a created plan doc.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept `10B` as a setup scaffold, not an implementation-ready spec.
- Left `10C` and later `GE - Phase 12` work untouched.

#### Summary of Implementation
- Added `docs/Phase-Plans/Tasks/Future/01.3B - SP - Phase 10B.md`.
- Set up the new task doc with:
  - a progress checklist
  - progress rules
  - a done check
  - doc history
  - purpose
  - scope
  - source inputs
  - placeholder `Arch Spec` sections for the later implementation-ready pass
- Updated the `SP` family doc to mark `10B` as clear enough to justify its own dedicated task doc.
- Updated the roadmap `Plan.md Status` tracker so `[1.3B]` now shows as having a created task doc.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.3B - SP - Phase 10B.md`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10B` now has its own dedicated planning doc in the normalized subphase naming scheme.

#### Verification Steps
- Re-read the new `10B` task doc to confirm it matches the basic task-doc setup pattern used before the implementation-ready pass.
- Re-read the roadmap and `SP` family trackers to confirm `[1.3B]` now shows `Plan.md Status` as created.
- No tests were run because this was a docs-only setup update.

<!-- ============================================================ -->
### [170] - 2026-03-11 03:00 - `SP - Phase 10A - Graph-Aware Build Identity And Routing`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the first real \`10A\` routing cut by carrying graph identity through build requests, worker progress/results, dispatcher stale-drop, graph-local runtime guards, and explicit graph-routed app entry points, then verified the new isolation behavior with targeted tests and a full build.`

#### Scope / Constraints Honored
- Implemented `10A` only.
- Kept compile locally handled in the first pass.
- Kept build routed through the shared worker path.
- Kept `10B` preview/build-memory expansion and `10C` output handoff work out of scope.

#### Summary of Implementation
- Extended `BuildRequest`, `BuildResult`, `BuildProgress`, and build-side worker errors with:
  - `projectFileId`
  - `graphDocumentId`
  - `buildRequestId`
- Reworked `buildDispatcher` stale-drop handling so build routing is keyed per graph instead of one global build bucket, with request-id matching for accepted progress/results/errors.
- Removed the worker's old one-global build drop behavior so concurrent graph builds can complete without stomping each other, while keeping assemble latest-only behavior separate.
- Added graph-local routing truth and defensive accept/clear guards in `useSpaghettiStore` through:
  - `latestIssuedBuildSeq`
  - `latestAcceptedBuildSeq`
  - `inFlightBuildRequestId`
  - `inFlightBuildSeq`
- Added canonical graph-routed app entry points in `useAppStore`:
  - `compileGraphDocument(graphDocumentId)`
  - `requestGraphDocumentBuild(graphDocumentId)`
- Kept `compileSpaghetti()` and `requestSpaghettiBuild()` only as thin wrappers over the new graph-routed entry points.
- Updated `SpaghettiPanel` compile/build actions to pass explicit viewport graph identity.
- Extended automated coverage for:
  - wrong-graph rejection
  - stale same-graph rejection
  - concurrent graph isolation
  - focus-change safety
  - viewport-switch safety
  - direct stale-write rejection in graph runtime setters
  - compatibility-wrapper forwarding into the graph-routed build path

#### Files Changed
- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.3A - SP - Phase 10A.md`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- Spaghetti build requests and worker results now carry explicit graph routing identity.
- Concurrent builds for different graph documents no longer share one global stale-drop path.
- Spaghetti compile/build actions now route through explicit graph-document entry points even though compatibility wrapper names remain.
- Non-focused graph build results no longer overwrite the currently projected global spaghetti parts/viewer bridge.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/buildDispatcher.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/worker/pipeline/buildPipeline.test.ts`.
- Ran `npm.cmd run build`.

<!-- ============================================================ -->
### [169] - 2026-03-11 01:40 - `SP - Phase 10A - Implementation Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`10A\` implementation doc in normalized `01.3A` form, rewriting the stub into a code-grounded execution spec for graph-aware build identity and routing and updating the roadmap tracker so `[1.3A]` now counts as having its own task doc.`

#### Scope / Constraints Honored
- Updated only planning/tracking docs.
- Kept `10A` as the routing-identity and stale-drop cut only.
- Left `10B` and `10C` planning untouched.

#### Summary of Implementation
- Renamed the stub task doc from `01.3 - SP - Phase 10a.md` to `01.3A - SP - Phase 10A.md`.
- Replaced the basic scaffold with a real implementation-ready execution spec that now defines:
  - the `10A` problem statement and phase boundary
  - the shared request/result routing contracts
  - graph-local routing runtime ownership
  - wrapper migration rules for compile/build entry points
  - current seam findings across `useAppStore`, `buildDispatcher`, `bootstrapBuildWiring`, `useSpaghettiStore`, and `protocol.ts`
  - the ordered implementation sequence and automated proof bar
- Updated the roadmap `Plan.md Status` tracker and dedicated-plan totals so `[1.3A]` now shows as having a created task doc.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.3A - SP - Phase 10A.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10A` now has its own implementation-ready task doc in the normalized subphase naming scheme.

#### Verification Steps
- Re-read the new `10A` task doc against the locked family-doc answers to confirm the execution spec stays within `10A` scope.
- Re-read the roadmap tracker to confirm `[1.3A]` now shows `Plan.md Status` as created and the dedicated-doc totals increment accordingly.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [168] - 2026-03-11 01:20 - `SP - Phase 10A - Family Doc Decision Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked the \`SP - Phase 10A\` routing section in the family phase doc by converting all seven open \`10A\` questions into resolved planning answers, adding the first-pass synthetic \`projectFileId\` rule, the graph-local routing-state contract, the compatibility-wrapper policy, and the minimum automated proof bar for a future task doc.`

#### Scope / Constraints Honored
- Updated only planning docs.
- Locked `10A` at the family-doc level without creating or implementing a dedicated task doc yet.
- Kept `10B` and `10C` open.

#### Summary of Implementation
- Converted the `10A` checklist from open questions to resolved decisions.
- Rewrote `10A.Q1` through `10A.Q7` into locked-answer sections covering:
  - shared request/result routing envelopes
  - synthetic runtime `projectFileId`
  - graph-local `buildSeq` ownership
  - stale-drop ownership split
  - in-flight result ownership during focus changes
  - wrapper-vs-canonical API policy
  - minimum automated routing proof bar
- Added a `10A` readiness note describing what the future task doc must cover.
- Marked `10A` as clear enough to justify a dedicated task doc in the family readiness checklist.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10A` is now decision-complete enough in the family phase doc to support a dedicated implementation task doc.

#### Verification Steps
- Re-read the updated `10A` section to confirm all seven questions are now locked and internally consistent with the existing `SP - Phase 10` family direction.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [167] - 2026-03-11 01:10 - `SP - Phase 10A - Routing Question Block`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a dedicated \`10A\` question block inside the \`SP - Phase 10\` family section so the graph-aware routing subphase now explicitly tracks the remaining request-envelope, result-envelope, build-sequence, stale-drop, focus-change, API-entry, and test-bar questions before task-doc creation.`

#### Scope / Constraints Honored
- Updated only planning docs.
- Kept the new questions under the existing `10A` subphase instead of reopening the full `SP - Phase 10` family scope.
- Did not answer or lock the `10A` questions yet.

#### Summary of Implementation
- Added a `10A`-specific open-question checklist under the `SP - Phase 10A` working breakdown.
- Added seven `10A` question subsections covering:
  - request envelope shape
  - result envelope shape
  - `buildSeq` ownership
  - stale-drop ownership
  - focus changes during in-flight builds
  - compile/build API entry-point ownership
  - minimum automated test bar
- Updated the `SP` family doc history and main `Phase 10` checklist to reflect that the `10A` question block now exists.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10A` now has a dedicated implementation-question block in the family phase doc.

#### Verification Steps
- Re-read the updated `10A` block in the `SP` family doc to confirm the new questions are phase-specific and do not duplicate the broader family direction locks.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [166] - 2026-03-11 01:00 - `SP - Phase 10 - Working Subphase Split`
<!-- ============================================================ -->
HUMAN SUMMARY: `Split the active \`SP - Phase 10\` family planning surface into explicit working subphases \`10A\`, \`10B\`, and \`10C\` so routing identity, graph-local runtime memory, and output handoff can be tracked and prepared separately in the dependency order they actually need.`

#### Scope / Constraints Honored
- Updated only planning docs.
- Kept the existing roadmap-aligned `10A / 10B / 10C` structure rather than inventing a new split.
- Did not mark any `SP - Phase 10` subphase as implemented.

#### Summary of Implementation
- Updated the `SP` family phase doc so `Phase 10` now explicitly includes:
  - a three-part working breakdown section
  - one subsection each for `10A`, `10B`, and `10C`
  - minimum win conditions for each subphase
  - explicit out-of-scope boundaries for each subphase
  - a subphase-readiness checklist for future task-doc creation
- Updated the `Phase 10` checklist and small-achievements block to reflect that the split is now part of the canonical family planning surface.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10` is now structured in the family doc as three working subphases instead of one undifferentiated planning block.

#### Verification Steps
- Re-read the updated `SP - Phase 10` section to confirm the `10A -> 10B -> 10C` dependency order and boundaries are explicit.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [165] - 2026-03-11 00:50 - `SP - Phase 10 - Graph Aware Worker And Preview Routing`
<!-- ============================================================ -->
HUMAN SUMMARY: `Promoted the \`SP - Phase 10\` family section from a placeholder into an active planning surface by carrying forward the already-locked \`[1.3A] / [1.3B] / [1.3C]\` direction and writing the remaining implementation-prep questions around request/result routing, viewer targeting, stale-drop safety, and first-pass seam cuts.`

#### Scope / Constraints Honored
- Updated only the family planning docs for `SP - Phase 10`.
- Reused locked direction from the roadmap, decisions file, and Codex notes instead of reopening settled scope.
- Kept later `AS`, `GE - Phase 12`, and `SP - Phase 11` work explicitly out of the phase-10 setup.

#### Summary of Implementation
- Replaced the old `SP - Phase 10` placeholder block in the `SP` family phase doc with:
  - an active summary
  - a small achievements block
  - a carried-forward family-level decision lock section
  - a remaining-question checklist focused on implementation readiness
- Added one subsection per remaining question so the next pass can lock:
  - current seam ownership
  - request/result contract shape
  - shared viewer target rules
  - stale-drop/overwrite rules
  - out-of-scope boundaries
- Added a matching doc-history entry to the `SP` family file.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10` is now tracked in the family phase doc as an active planning surface rather than a future placeholder.

#### Verification Steps
- Re-read the updated `SP - Phase 10` section to confirm it now separates locked family direction from the unresolved implementation-prep questions.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [164] - 2026-03-11 00:35 - `GE - Phase 11C - Save/Load Interaction With Editors`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the first explicit \`11C\` editor-action layer by adding Browser row secondary actions for opening a second editor or swapping the focused editor, splitting file load into clone-as-new-graph behavior, and routing editor save through the focused viewport's cached graph entry without disturbing the shipped \`11A\` and \`11B\` seams.`

#### Scope / Constraints Honored
- Implemented `11C` only.
- Kept raw graph-document file IO in `11A`.
- Kept Browser cached-entry lifecycle core in `11B`.
- Kept `Import Into Current Graph` deferred and explicit rather than collapsing it into `Load Into New Graph`.
- Kept project ownership and Browser hierarchy growth deferred to later phases.

#### Summary of Implementation
- Added explicit `11C` store actions in `useSpaghettiStore` for:
  - opening a graph in a new viewport even when that graph is already open elsewhere
  - swapping the focused viewport to another graph
  - loading a graph file into a fresh dirty graph copy
  - saving the graph bound to the focused editor viewport
- Preserved `openGraphDocumentInViewport(...)` as the Browser row-click `open-or-focus` path.
- Updated `BrowserPanel` so graph rows now expose:
  - `Save`
  - `New Editor`
  - `Swap Editor`
  - and so top-level file load now means `Load Into New Graph`
- Updated `SpaghettiPanel` with a first-pass editor-side `Save Graph` action routed through the focused viewport binding.
- Extended store tests to cover same-graph multi-viewport opens, focused-viewport swap behavior, clone-on-load identity rules, and focused-editor save behavior.
- Tightened the `11C` task doc and the `GE` family phase doc to reflect that `11C` is now implemented.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.2c - GE - Phase 11C.md`
- `docs/Phase-Plans/01_GE - Phase-Plans.md`

#### Behavior Changes (if any)
- Browser graph rows still open-or-focus on row click, but now also expose explicit `New Editor` and `Swap Editor` actions.
- The Browser file-load button now creates a fresh dirty graph copy instead of preserving the file's live `graphDocumentId`.
- The app now supports multiple editor viewports bound to the same graph document.
- Editor-side save now targets the graph bound to the focused viewport through the cached-entry save seam.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts`.
- Ran `npm.cmd run build`.
- Re-read the updated `11C` task doc and `GE` family phase doc after implementation to confirm they now reflect shipped behavior rather than planned behavior.

<!-- ============================================================ -->
### [163] - 2026-03-11 00:20 - `GE - Phase 11C - Task Doc Tightening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Tightened the dedicated \`11C\` task doc into a code-grounded implementation-ready spec by using Codex notes as the primary decision source, locking the first-pass editor action model, and naming the exact Browser/store seams that must change for explicit open/new-editor/swap/save behavior.`

#### Scope / Constraints Honored
- Updated the `11C` task-planning surface only.
- Kept `11C` implementation itself deferred.
- Kept raw file IO in `11A`, cached-graph lifecycle in `11B`, and project ownership in `GE 12`.
- Kept `Import Into Current Graph` explicit but out of first-pass `11C` implementation scope.

#### Summary of Implementation
- Renamed the task-doc identity from `01.08` wording to canonical `01.2C`.
- Reworked the `11C` task doc to match the shipped `11A` / `11B` implementation-ready spec format.
- Marked the planning/read/lock progress checklist complete while leaving the implementation done-check open.
- Added explicit locked behavior for:
  - `Open Graph`
  - `Load Into New Graph`
  - `Open In New Editor`
  - `Swap Current Editor`
  - focused-editor save targeting
  - Browser focus follow behavior
- Added code-grounded seam analysis for:
  - `useSpaghettiStore`
  - `BrowserPanel`
  - `SpaghettiEditor`
- Replaced generic file/ordering notes with a concrete implementation sequence and a targeted test/verification plan.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.2c - GE - Phase 11C.md`

#### Verification Steps
- Re-read the rewritten `11C` task doc after the replacement to confirm the file now follows the `11A` / `11B` execution-spec pattern.
- Verified the doc now locks:
  - same-graph multi-viewport behavior
  - focused-viewport swap behavior
  - `Load Into New Graph` clone-and-dirty semantics
  - focused-editor save routing through the cached-entry save seam
- Cross-checked the rewrite against the carry-forward decisions in:
  - `docs/Human-Plans/CodexNotes/5_CodexChatNotes.md`
  - `docs/Human-Plans/CodexNotes/6_CodexChatNotes.md`
  - `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`
  - `docs/Human-Plans/CodexNotes/8_CodexChatNotes.md`

<!-- ============================================================ -->
### [162] - 2026-03-10 22:15 - `GE - Phase 11 - 11C Family Decision Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked the remaining family-level \`GE - Phase 11C\` editor-interaction answers in the \`GE\` phase-family doc so Browser row click, graph-copy identity, viewport rebinding, save target, and Browser/editor focus rules are now explicit before \`11C\` implementation starts.`

#### Scope / Constraints Honored
- Updated the family planning surface only.
- Kept `11C` implementation work deferred.
- Kept `11C` scoped to editor interaction policy rather than raw file IO, cached-graph core, or `GE 12` ownership work.

#### Summary of Implementation
- Added a new family-doc history entry for the `11C` answer-lock pass.
- Replaced the Phase 11 `11C` question block's open state with explicit locked answers for:
  - `Open Graph`
  - `Load Into New Graph`
  - `Open In New Editor`
  - `Swap Current Editor`
  - save targeting
  - Browser/editor focus follow behavior
- Marked the family-level `11C` decision checklist and identity-policy checklist items complete while leaving implementation pending.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`

#### Verification Steps
- Re-read the `GE - Phase 11` family section after the update to confirm all seven `11C` questions now have explicit answers.
- Cross-checked the locked answers against the carry-forward decisions in:
  - `docs/Human-Plans/CodexNotes/5_CodexChatNotes.md`
  - `docs/Human-Plans/CodexNotes/6_CodexChatNotes.md`
  - `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`

<!-- ============================================================ -->
### [161] - 2026-03-10 20:40 - `GE - Phase 11B - Cached Graph Lifecycle`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the first cached-graph lifecycle layer by adding Browser-owned cached graph entries in \`useSpaghettiStore\`, moving Browser graph rows to cached-entry-backed rendering with simple dirty/saved state, and wiring first-pass Browser load/save actions without pulling \`11C\` editor policy forward.`

#### Scope / Constraints Honored
- Implemented `11B` only.
- Kept the live graph document as the authored source of truth.
- Kept `Open In New Editor`, `Swap Current Editor`, and `Load Into New Graph` deferred to `11C`.
- Kept richer Browser row build/loading bars deferred to later Browser/build-control phases.

#### Summary of Implementation
- Added `CachedGraphEntry` state and selectors to `useSpaghettiStore`.
- Seeded one cached entry per live graph document, with:
  - startup/new/duplicate in-memory graphs starting dirty
  - file-loaded graphs starting clean
- Marked cached entries dirty on committed graph edits.
- Added first-pass store actions to:
  - save a cached graph entry through the shipped `11A` persistence seam
  - load a graph document from file into a cached entry
- Updated `BrowserPanel` so graph rows are backed by cached entries instead of direct graph-document enumeration.
- Kept Browser row click behavior as `open-or-focus`.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`

#### Behavior Changes (if any)
- Browser graph rows now show simple `Dirty` / `Saved` lifecycle state alongside `Closed` / `Open` / `Focused`.
- The Browser now exposes first-pass `Load Graph File` and per-row `Save` actions.
- Loading a graph file creates or refreshes a cached Browser graph entry while keeping the same `graphDocumentId` in first pass.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/io/graphDocumentPersistence.test.ts`
- Ran `npm.cmd run build`

<!-- ============================================================ -->
### [160] - 2026-03-10 00:08 - `OO - Phase 13 - Roadmap Setup Companion Doc`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created a new \`Roadmap-Setup.md\` companion doc so roadmap format/meta/tracker guidance can gradually move out of \`roadmap.md\`, and added a small pointer link in the live roadmap so the lane body can become the main reading surface over time.`

#### Scope / Constraints Honored
- Added roadmap/docs structure only.
- Did not change lane meaning or roadmap ordering.
- Kept the live lane body in `roadmap.md`.

#### Summary of Implementation
- Added `docs/Human-Plans/roadmap/Roadmap-Setup.md`.
- Used the new file to define:
  - why the roadmap is noisy
  - what should stay in `roadmap.md`
  - what should move out later
  - a preferred future roadmap shape
  - a first cleanup direction
- Added a small pointer in `docs/Human-Plans/roadmap/roadmap.md` so the new setup companion is discoverable from the live roadmap.

#### Files Changed
- `docs/Human-Plans/roadmap/Roadmap-Setup.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Documentation/structure only.

#### Verification Steps
- Read the new `Roadmap-Setup.md` and confirmed the live roadmap now points to it near the top.

<!-- ============================================================ -->
### [159] - 2026-03-10 00:00 - `GE - Phase 11C - Save/Load Interaction With Editors Task Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`11C\` task doc for save/load interaction with editors so the editor-facing open/swap/load behavior now has its own execution-planning surface after \`11A\` and \`11B\`, and refreshed the roadmap plan-doc tracker to count that new doc.`

#### Scope / Constraints Honored
- Added planning/task-doc and roadmap-tracking updates only.
- Kept `11C` scoped to editor-facing save/load behavior rather than raw file IO or Browser cached lifecycle.
- Did not start `11C` implementation.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.08 - GE - Phase 11C.md`.
- Framed `11C` around:
  - `Open Graph`
  - `Load Into New Graph`
  - `Open In New Editor`
  - `Swap Current Editor`
  - Browser/editor coordination during save/load actions
- Grounded the doc in the current seams:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/panels/SpaghettiPanel.tsx`
  - `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- Updated roadmap `Plan.md Status` for `[1.2C]` and refreshed the dedicated plan-doc totals.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.08 - GE - Phase 11C.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Planning/docs only.

#### Verification Steps
- Re-read the roadmap `11C` section, the `GE` family phase doc, and the existing `11A` / `11B` task docs before creating the new task file.
- Read back the updated roadmap tracker sections after the patch.

<!-- ============================================================ -->
### [158] - 2026-03-09 22:37 - `OO - Phase 13 - Explicit 2.3 Carry-Forward Note For Browser Build Bars`
<!-- ============================================================ -->
HUMAN SUMMARY: `Expanded the roadmap text inside \`[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface\` so the later home for richer Browser row loading/build bars is now explicit there, rather than only implied by the earlier \`11B\` scope note.`

#### Scope / Constraints Honored
- Changed roadmap/docs only.
- Kept `11B` and `[2.3]` scope boundaries intact.
- Did not start any implementation work.

#### Summary of Implementation
- Added a new roadmap doc-history note for the `[2.3]` clarification.
- Expanded the `[2.3]` section with an explicit carry-forward block that says:
  - `11B` owns simple Browser row `dirty/saved` state
  - `[2.3]` owns later richer Browser row loading/build bars
- Added a checklist reminder in `[2.3]` so that richer row bars stay anchored to the later build-control lane.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Roadmap/planning only.

#### Verification Steps
- Read back the updated `[2.3]` section after the patch.

<!-- ============================================================ -->
### [157] - 2026-03-09 22:36 - `OO - Phase 13 - Roadmap Note For 11B Dirty State Versus Later Build Bars`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the roadmap to keep \`11B\` focused on Browser cached-entry dirty/saved state only, while explicitly deferring richer Browser row loading/build bars to the later Browser/build-control lane instead of letting that UI scope leak into cached graph lifecycle work.`

#### Scope / Constraints Honored
- Changed roadmap/docs only.
- Kept `11B` narrow and did not start implementation work.
- Preserved the later Browser/build-control phase as the home for richer row activity bars.

#### Summary of Implementation
- Added a roadmap doc-history note for the new `11B` scope clarification.
- Expanded the `[1.2B] GE - Phase 11B - Cached Graph Lifecycle` summary and checklist to include:
  - simple dirty/saved Browser row state in scope
  - richer loading/build bars deferred out of scope
- Added a carry-forward note under `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface` so later Browser row build bars have an explicit roadmap home.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Roadmap/planning only.

#### Verification Steps
- Read back the updated `11B` and `[2.3]` roadmap sections after the patch.

<!-- ============================================================ -->
### [156] - 2026-03-09 22:32 - `GE - Phase 11B - Cached Graph Lifecycle Task Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`11B\` task doc for cached graph lifecycle so the Browser-owned saved-versus-live graph layer now has its own execution-planning surface after the shipped \`11A\` persistence core, and refreshed the roadmap plan-doc tracker to count that new doc.`

#### Scope / Constraints Honored
- Added planning/task-doc and roadmap-tracking updates only.
- Kept `11B` scoped to cached graph lifecycle rather than raw file IO or editor interaction policy.
- Did not start `11B` implementation.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.07 - GE - Phase 11B.md`.
- Framed `11B` around:
  - Browser-owned cached graph entries
  - saved graph versus cached live graph behavior
  - reopen/focus behavior for cached graphs
  - keeping editor interaction policy deferred to `11C`
- Grounded the doc in the current seams:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/io/graphDocumentPersistence.ts`
- Updated roadmap `Plan.md Status` for `[1.2B]` and refreshed the dedicated plan-doc totals.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.07 - GE - Phase 11B.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Planning/docs only.

#### Verification Steps
- Re-read the roadmap `11B` section, the `GE` family phase doc, and the shipped `11A` task doc before creating the new task file.
- Read back the updated roadmap tracker sections after the patch.

<!-- ============================================================ -->
### [155] - 2026-03-09 22:26 - `GE - Phase 11A - Graph Document Persistence Core`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the first real graph-document persistence core by adding stable serialize/deserialize helpers plus browser file save/load services for one \`GraphDocument\`, routing load validation through \`parseGraphDocument()\`, and verifying the new persistence surface with targeted tests and a production build.`

#### Scope / Constraints Honored
- Kept `11A` limited to one graph-document persistence core.
- Kept Browser cache lifecycle, editor open/swap/import behavior, and project-file ownership out of this phase.
- Reused the existing graph-document schema/parse boundary instead of introducing a second persistence schema.

#### Summary of Implementation
- Added `src/app/io/graphDocumentPersistence.ts` as the first dedicated graph-document persistence module.
- Implemented:
  - `serializeGraphDocument()`
  - `deserializeGraphDocument()`
  - `saveGraphDocumentToFile()`
  - `loadGraphDocumentFromFile()`
  - supporting filename and persisted-shape helpers
- Locked the saved unit to the canonical runtime `GraphDocument` shape:
  - `graphDocumentId`
  - `name`
  - `version`
  - `graph`
- Routed load validation through the existing `parseGraphDocument()` path so malformed JSON and malformed graph-document payloads fail at the correct boundary.
- Added targeted persistence tests covering:
  - stable JSON serialization
  - deserialize roundtrip
  - invalid JSON failure
  - invalid shape failure
  - browser-file save path
  - browser-file load path
  - no-file-selected rejection
- Updated the `11A` task doc and roadmap to reflect the shipped persistence-core cut.

#### Files Changed
- `src/app/io/graphDocumentPersistence.ts`
- `src/app/io/graphDocumentPersistence.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.06 - GE - Phase 11A.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- The app now has a dedicated low-level persistence surface for saving and loading one `GraphDocument` as JSON.
- Persisted graph files exclude runtime-only graph buckets, viewport/browser state, and editor interaction state.
- Later Browser/editor save-load UX can now build on a stable persistence seam instead of inventing file behavior ad hoc.

#### Verification Steps
- `cmd /c npm test -- src/app/io/graphDocumentPersistence.test.ts src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `cmd /c npm run build`

<!-- ============================================================ -->
### [154] - 2026-03-09 22:02 - `GE - Phase 11A - Graph Document Persistence Core Spec Tightening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Tightened the \`11A\` task doc into a code-grounded implementation-ready spec by locking the live \`GraphDocument\` contract, the existing \`parseGraphDocument()\` load boundary, and the first pure-helper plus browser-file-IO persistence surface while keeping \`11B\`, \`11C\`, and \`GE 12\` work deferred.`

#### Scope / Constraints Honored
- Updated only the `11A` task doc and changelog.
- Kept `11A` limited to persistence core planning/spec work.
- Did not start `11A` implementation.

#### Summary of Implementation
- Reframed `11A` around one persisted `GraphDocument`, one load boundary, and one browser file IO seam.
- Grounded the doc in the live schema/runtime seams:
  - `src/app/spaghetti/schema/spaghettiTypes.ts`
  - `src/app/spaghetti/schema/spaghettiSchema.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
- Locked the persistence split to:
  - pure helpers: `serializeGraphDocument()` / `deserializeGraphDocument()`
  - browser file IO: `saveGraphDocumentToFile()` / `loadGraphDocumentFromFile()`
- Added tighter acceptance checks and explicit deferred boundaries for `11B`, `11C`, and `GE 12`.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.06 - GE - Phase 11A.md`

#### Behavior Changes (if any)
- None. Spec/docs only.

#### Verification Steps
- Read the updated `11A` task doc against the live schema/runtime seams before patching.

<!-- ============================================================ -->
### [153] - 2026-03-09 21:55 - `GE - Phase 11A - Graph Document Persistence Core Task Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`11A\` task doc for graph-document persistence core and updated the roadmap plan-doc tracker so the first save/load core phase now has its own implementation-planning surface before code work starts.`

#### Scope / Constraints Honored
- Added planning/task-doc and roadmap-tracking updates only.
- Kept `11A` scoped to graph-document persistence core.
- Did not start `11A` implementation.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.06 - GE - Phase 11A.md`.
- Locked the first-pass `11A` direction around:
  - one durable graph-document file contract
  - validation and parse behavior on load
  - save/load core entry points
  - keeping viewport/browser/editor runtime state out of the persisted graph-document contract
- Updated roadmap `Plan.md Status` for `[1.2A]` and refreshed the dedicated plan-doc totals.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.06 - GE - Phase 11A.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Planning/docs only.

#### Verification Steps
- Read the new `11A` task doc and refreshed roadmap plan-doc sections after the patch.

<!-- ============================================================ -->
### [152] - 2026-03-09 21:43 - `OO - Phase 13 - Roadmap Checklist Refresh After 9C`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the roadmap checklist state after the real \`9C\` cut, marking the immediate single-graph-cleanup track complete now that \`9A\`, \`9B\`, and \`9C\` have all landed while leaving later routing, persistence, and ownership work pending.`

#### Scope / Constraints Honored
- Changed only roadmap-tracking docs.
- Kept the checklist strict to what actually landed.
- Did not re-order future phases.

#### Summary of Implementation
- Added a roadmap doc-history note for the post-`9C` checklist refresh.
- Marked `Immediate CheckList` item `5. Single-Graph Cleanup In Service Of Browser` complete.
- Tightened the note under that item so it now points forward to routing, persistence, and project-ownership work instead of more single-graph cleanup.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Documentation/tracking only.

#### Verification Steps
- Read the updated roadmap checklist sections after the patch.

<!-- ============================================================ -->
### [151] - 2026-03-09 21:43 - `SP - Phase 9C - Graph-Local Compile / Preview Preparation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Moved spaghetti compile/build memory and preview-preparation memory into graph-local runtime owned by \`useSpaghettiStore\`, reconnected the app-store/build-wiring/viewer bridge to those graph-keyed buckets, and verified the bridge cut with targeted store/preview tests plus a full production build.`

#### Scope / Constraints Honored
- Kept `9C` as a bridge phase only.
- Left full worker/result routing redesign for `SP - Phase 10`.
- Left Browser-facing output hierarchy and later `AS` structure work out of this cut.
- Kept one shared worker lifecycle and one shared viewer shell.

#### Summary of Implementation
- Added graph-local runtime buckets in `useSpaghettiStore` for:
  - compile/build memory
  - preview-preparation memory
  - light build-seq to graph-document tracking
- Removed the old spaghetti-global compile/build buckets from `useAppStore`.
- Reconnected `compileSpaghetti()` and `requestSpaghettiBuild()` so they operate through graph-local runtime while preserving the active-graph bridge for this phase.
- Reconnected `bootstrapBuildWiring.ts` to read graph-keyed pending build state from `useSpaghettiStore`.
- Added a reusable preview-preparation builder and switched `ViewerHost` to consume graph-local preview-prep instead of one global active-graph path.
- Reconnected `SpaghettiPanel` and `DebugInspectorDrawer` to graph-local compile state.

#### Files Changed
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/store/useAppStore.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `docs/Phase-Plans/Tasks/Future/01.05 - SP - Phase 9C.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- Spaghetti compile/build memory is now stored per graph document instead of in one global app-store bucket.
- Preview-preparation memory is now graph-local and reused by the viewer bridge.
- Build-seq tracking now resolves through graph identity so `9C` has a clean handoff into later routing work.

#### Verification Steps
- `cmd /c npm test -- src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `cmd /c npm run build`

<!-- ============================================================ -->
### [150] - 2026-03-09 21:16 - `SP - Phase 9C - Task Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`9C\` task doc for graph-local compile/build and preview-preparation bridge work, carrying forward the locked decisions from the roadmap, Decisions file, and Codex notes so the next bridge phase now has its own implementation-planning surface.`

#### Scope / Constraints Honored
- Added only planning/task-doc and roadmap tracking updates.
- Kept `9C` scoped as a bridge phase.
- Did not start `9C` runtime implementation.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.05 - SP - Phase 9C.md`.
- Locked the `9C` implementation target around:
  - graph-local compile/build memory
  - graph-local preview-preparation memory
  - shared worker/viewer infrastructure
  - softened global compile/build seams
- Recorded the live seam focus around:
  - `useAppStore.ts`
  - `bootstrapBuildWiring.ts`
  - `ViewerHost.tsx`
  - `useSpaghettiStore.ts`
- Updated the roadmap dedicated-plan tracker so `[1.1C]` now counts as having its own plan/task doc.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.05 - SP - Phase 9C.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Re-read the locked `9C` roadmap, decisions, and Codex notes sections before writing the task doc.
- Confirmed the roadmap totals after marking `[1.1C]` as having a dedicated plan doc.

<!-- ============================================================ -->
### [149] - 2026-03-09 21:10 - `SP - Phase 9B - Browser Startup Render Loop Fix`
<!-- ============================================================ -->
HUMAN SUMMARY: `Fixed the black-screen startup regression in the new `9B` Browser shell by removing unstable Zustand array selectors from the live React components, which was causing the UI to collapse into an external-store snapshot loop right after mount.`

#### Scope / Constraints Honored
- Kept the fix inside the existing `9B` Browser/runtime surface.
- Did not change the phase boundary, persistence, or graph-routing work.
- Touched only the live React subscription pattern that was causing the startup failure.

#### Summary of Implementation
- Reworked `BrowserPanel` so it subscribes to raw graph/viewport state and derives ordered arrays locally with `useMemo` instead of subscribing with selectors that allocate new arrays every render.
- Reworked `SpaghettiEditor` the same way for the graph-document dropdown source.
- Verified that the store tests still pass and the production build succeeds after removing the unstable selector pattern.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The `9B` Browser shell should now stay mounted instead of flashing and then collapsing to a black screen on startup.

#### Verification Steps
- Ran `cmd /c npm run build`
- Ran `cmd /c npm test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`

<!-- ============================================================ -->
### [148] - 2026-03-09 21:06 - `SP - Phase 9B - Browser First Startup Fix`
<!-- ============================================================ -->
HUMAN SUMMARY: `Fixed the first `9B` startup regression where an auto-seeded spaghetti viewport could push the app into an empty graph scene too early, by switching the Browser-first flow to boot with no open spaghetti viewport and keeping the viewer on legacy parts until a real graph viewport is opened.`

#### Scope / Constraints Honored
- Kept the fix inside the existing `9B` Browser-first phase boundary.
- Did not pull in persistence, project ownership, or graph-local compile/build routing.
- Preserved the Browser-first open/focus structure from the main `9B` cut.

#### Summary of Implementation
- Changed the spaghetti store boot path so the app no longer auto-seeds an open editor viewport on startup.
- Kept the active graph-document bridge intact even when no viewport is open.
- Updated `ViewerHost` so spaghetti mode only switches the viewer onto graph preview output when a real active editor viewport exists; otherwise it keeps showing the legacy parts path.
- Updated the store tests to match the new Browser-first/no-auto-open startup behavior.
- Added the carry-forward note to the `9B` task doc close-out section.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/components/ViewerHost.tsx`
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The app now boots with Browser available but no automatically opened spaghetti viewport.
- Spaghetti mode no longer forces the viewer into an empty graph preview path unless a real graph viewport is open/focused.

#### Verification Steps
- Ran `cmd /c npm test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`
- Ran `cmd /c npm run build`

<!-- ============================================================ -->
### [147] - 2026-03-09 20:58 - `SP - Phase 9B - Browser First Multi-Viewport Foundation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the first real `9B` Browser-first runtime cut by adding a permanent left-dock Browser tree, expanding `useSpaghettiStore` into a real open/focus viewport manager, moving floating viewport geometry into store-managed viewport state, and wiring the editor header to switch graph bindings per viewport while keeping compile/build routing and project ownership out of scope.`

#### Scope / Constraints Honored
- Implemented only the `9B` Browser/open-focus structural cut.
- Kept graph truth graph-owned and viewport coordination viewport-owned.
- Kept persistence, project ownership, and graph-local compile/build routing out of this phase.
- Kept the first `9B` pass to one visible floating spaghetti surface while allowing more than one live viewport record.

#### Summary of Implementation
- Expanded the shared `EditorViewport` contract to include window mode, position, size, and z-order.
- Reworked `useSpaghettiStore` so it can:
  - create additional graph documents
  - open/focus/close editor viewports
  - bind a viewport to a different graph document
  - keep the active graph bridge/cache synchronized with the focused viewport
- Added a new Browser panel as a permanent left-dock Fusion-style hierarchy shell backed by the current graph/viewport runtime.
- Moved floating spaghetti window position/size ownership out of `AppShell` local state and into viewport-managed store state.
- Added the graph dropdown in `SpaghettiEditor` so one viewport can switch which graph document it is showing.
- Added `useSpaghettiStore` tests covering multi-document and multi-viewport bridge behavior.
- Updated the `9B` task doc and roadmap status to reflect the shipped phase.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/AppShell.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Browser is now a permanent left dock surface instead of only an implied future phase target.
- The focused spaghetti viewport is now chosen from Browser/open-focus viewport state rather than only a one-window shell assumption.
- Floating spaghetti window geometry is now viewport-managed state.
- The editor header can now switch the current viewport to another graph document.
- Multiple live viewport records can exist even though the first pass still renders only one visible floating spaghetti surface.

#### Verification Steps
- Ran `cmd /c npm test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`
- Ran `cmd /c npm run build`

<!-- ============================================================ -->
### [146] - 2026-03-09 20:36 - `OO - Phase 13 - 9B Browser-First Implementation Preference`
<!-- ============================================================ -->
HUMAN SUMMARY: `Recorded the `9B` implementation preference to build the Browser/open-focus structure first and keep only one visible floating spaghetti surface in the first pass, deferring true multiple visible windows until after the Browser coordination model is real.`

#### Scope / Constraints Honored
- Added only planning/reference doc updates.
- Did not change runtime code or implementation order.
- Kept the decision tightly scoped to first-pass `9B` sequencing.

#### Summary of Implementation
- Updated `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md` with the first-pass `9B` implementation preference.
- Recorded the same decision in `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`.
- Locked the sequence as:
  - Browser/open-focus structure first
  - one visible floating surface first
  - true multi-window later

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Confirmed the decision fits the existing `9B` phase boundary and strengthens sequencing without pulling extra scope into the phase.

<!-- ============================================================ -->
### [145] - 2026-03-09 20:34 - `OO - Phase 13 - Browser Visual Direction Capture`
<!-- ============================================================ -->
HUMAN SUMMARY: `Captured the Browser visual direction as a Fusion360-style left hierarchy tree and folded that guidance into the \`9B\` task doc plus active Codex notes, so the Browser phase now has a clearer UI target instead of only an abstract viewport-manager description.`

#### Scope / Constraints Honored
- Added only planning/reference doc updates.
- Did not change runtime code or implementation order.
- Kept the note focused on Browser shape and future row-level controls.

#### Summary of Implementation
- Updated `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md` with a new Browser surface direction section.
- Recorded the same direction in `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`.
- Locked the working Browser mental model as:
  - docked left-side hierarchy tree
  - Fusion360-style navigation surface
  - expandable rows
  - future support for loading bars and richer row-level controls

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Confirmed the new Browser direction note fits the existing `9B` phase boundary and does not pull in unrelated `9C`, persistence, or project-ownership work.

<!-- ============================================================ -->
### [144] - 2026-03-09 18:59 - `SP - Phase 9B - Decision-Complete Plan Doc`
<!-- ============================================================ -->
HUMAN SUMMARY: `Completed the \`9B\` task doc as a decision-complete implementation spec, grounding it in the live \`9A.3\` runtime seams and locking the Browser/viewport/editor coordination model, the viewport-owned vs graph-owned split, the focus and z-order rules, and the deferred boundary with \`9C\`, persistence, and project ownership.`

#### Scope / Constraints Honored
- Completed only the planning/task-doc work for `9B`.
- Kept the phase scoped to Browser-coordinated multi-editor foundation work.
- Did not start the `9B` runtime implementation.
- Preserved `9C`, persistence, and project ownership as deferred work.

#### Summary of Implementation
- Reworked `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md` into a decision-complete execution spec.
- Added explicit carry-forward rules from `9A`.
- Locked the first real `9B` runtime model:
  - multiple editor viewports
  - one focused viewport
  - one `meatball editor view` maximum
  - viewport-managed position/size/z-order
- Locked the Browser -> viewport -> panel -> editor flow and graph-switching behavior.
- Tightened the current seam findings using the live `AppShell`, `useSpaghettiStore`, `SpaghettiPanel`, and `SpaghettiEditor` runtime shape.
- Tightened acceptance criteria and deferred boundaries so `9B` does not collapse into `9C`, `GE 11`, or `GE 12`.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Re-read the live `9A.3` runtime seams in `AppShell.tsx`, `useSpaghettiStore.ts`, `SpaghettiPanel.tsx`, and `SpaghettiEditor.tsx`.
- Re-read `CHANGELOG.md`, `6_CodexChatNotes.md`, `7_CodexChatNotes.md`, `roadmap.md`, and `Decisions.MD` before tightening the `9B` task doc.

<!-- ============================================================ -->
### [143] - 2026-03-09 18:51 - `SP - Phase 9B - Task Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`9B\` task doc for the multi-editor Browser foundation, carrying forward the locked viewport, focus, z-order, graph-switching, and single-\`meatball editor view\` rules so the next Browser-foundation phase now has its own execution-planning surface.`

#### Scope / Constraints Honored
- Added only the planning/task-doc setup for `9B`.
- Kept the phase scoped to Browser-coordinated multi-editor foundation work.
- Did not start the `9B` runtime implementation.
- Updated the roadmap and changelog in the same change set.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`.
- Locked the core `9B` direction:
  - more than one graph editor surface
  - Browser-coordinated open/focused viewport state
  - graph switching inside one editor viewport
  - focus/z-order rules
  - single `meatball editor view` rule
- Kept graph truth graph-owned and viewport state viewport-owned.
- Updated the roadmap dedicated-plan tracker so `9B` is counted as having its own task doc.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Re-read the locked `9B` roadmap and decisions sections before writing the task doc.
- Reused the current `9A.x` task-doc structure so the new phase doc matches the existing planning workflow.

<!-- ============================================================ -->
### [142] - 2026-03-09 18:13 - `OO - Phase 13 - Roadmap 9A Status Refresh`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the roadmap so the `9A` lane-body checklists now reflect the real `9A.2` and `9A.3` implementation work, and refreshed the dedicated plan-doc tracker to count the finished `9A.3` task file.`

#### Scope / Constraints Honored
- Updated only roadmap tracking/docs state.
- Kept the refresh strict to work that actually landed.
- Did not mark broader `9B`, `9C`, or later lane items complete.

#### Summary of Implementation
- Added a new roadmap doc-history note for the refresh.
- Marked the `9A` phase-level lane-body checklist as partly landed where appropriate:
  - empty graph documents valid
  - minimum graph document shape locked
  - authored graph/canvas persistence truth defined
- Marked the `9A.2` lane-body checklist complete for:
  - node positions
  - edge wiring/connections
  - node values/config
  - node row mode
- Marked the `9A.3` lane-body checklist complete for:
  - viewport binding by `graphDocumentId`
  - first singleton graph/store split
  - moving spaghetti document memory out of one app-global bucket
  - keeping Browser/persistence work out of the slice
- Updated the dedicated plan-doc checklist and totals so `9A.3` is counted as having its own task doc.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Re-read the `9A` lane-body roadmap entries against the completed `9A.1`, `9A.2`, and `9A.3` task docs and the landed implementation state before marking items complete.

<!-- ============================================================ -->
### [141] - 2026-03-09 18:09 - `OO - Phase 13 - 9A Carry-Forward Lessons Capture`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a compact carry-forward note in \`7_CodexChatNotes.md\` capturing the main lessons from \`9A.1\` through \`9A.3\`, including the working store split, the usefulness of narrow temporary bridges, the authored-vs-local state boundary, and the main future pressure seams for \`9B\` and \`9C\`.`

#### Scope / Constraints Honored
- Added only planning/reference notes.
- Did not change runtime code or roadmap ordering.
- Kept the notes focused on reusable architectural lessons instead of repeating task-doc detail.

#### Summary of Implementation
- Added one new numbered notes entry in `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`.
- Captured the main `9A` carry-forward lessons:
  - `useSpaghettiStore` vs `useAppStore` ownership split
  - narrow temporary bridges are acceptable when explicit
  - graph-owned vs local presentation state boundary
  - hidden active-graph consumers across the runtime chain
  - value of phase-pure cuts
  - likely next pressure seams for `9B` and `9C`

#### Files Changed
- `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Continued the active notes numbering from `[88]` to `[89]`.
- Confirmed the note was added to the current active `7_CodexChatNotes.md` surface.

<!-- ============================================================ -->
### [140] - 2026-03-09 18:07 - `OO - Phase 13 - Codex Notes Naming Decision Capture`
<!-- ============================================================ -->
HUMAN SUMMARY: `Seeded the new active \`7_CodexChatNotes.md\` file and recorded the decision to keep the current spaghetti/app store and editor names for now, deferring any rename pass until the ownership seams settle enough to make better names obvious.`

#### Scope / Constraints Honored
- Added only a small durable notes update.
- Did not change runtime code or phase implementation state.
- Preserved the decision as a carry-forward note instead of starting a rename pass.

#### Summary of Implementation
- Created the active `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md` notes surface.
- Added one new numbered note:
  - keep current store/editor names for now
  - revisit only if the names become a real source of confusion later
  - likely first rename candidate remains `useSpaghettiUiStore`

#### Files Changed
- `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Confirmed `7_CodexChatNotes.md` was empty before seeding it.
- Continued the absolute numbered notes path after `[87]` in `6_CodexChatNotes.md`.

<!-- ============================================================ -->
### [139] - 2026-03-09 18:01 - `SP - Phase 9A.3 - Viewport Binding And First Singleton Split`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the \`9A.3\` viewport-binding cut by adding the first editor viewport container in \`useSpaghettiStore\`, keeping it synchronized with the active graph-document bridge, and rewiring the spaghetti shell/panel/editor path to consume explicit \`editorViewportId\` and \`graphDocumentId\` binding without pulling full Browser or graph-routing work forward.`

#### Scope / Constraints Honored
- Implemented only the narrow `9A.3` viewport-binding cut.
- Kept viewport state in `useSpaghettiStore`, not `useAppStore`.
- Preserved `activeGraphDocumentId` as a temporary compatibility bridge.
- Kept floating window position/size in `AppShell`.
- Did not pull in multi-viewport coordination, graph switching UX, persistence, or graph-local compile/build routing.

#### Summary of Implementation
- Added the first viewport runtime seam:
  - `EditorViewport` type
  - `editorViewportsById`
  - `editorViewportOrder`
  - `activeEditorViewportId`
  - `setActiveEditorViewportId`
- Added explicit viewport/document selectors in `useSpaghettiStore` for:
  - active viewport
  - viewport by id
  - graph document by id
  - graph by document id
- Seeded one default floating viewport bound to the active graph document and kept `activeGraphDocumentId` synchronized as the current compatibility bridge.
- Rewired the runtime component flow so:
  - `AppShell` renders spaghetti through the active viewport seam
  - `SpaghettiPanel` receives `editorViewportId`
  - `SpaghettiEditor` receives `editorViewportId` and `graphDocumentId`
  - `ExpandedEditor`, `CollapsedEditor`, and `SpaghettiCanvas` read graph data by explicit `graphDocumentId`
- Updated the `9A.3` task doc to mark the implementation complete and record close-out notes.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/AppShell.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/ui/ExpandedEditor.tsx`
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The spaghetti editor surface now mounts through an explicit editor viewport binding instead of relying only on one implicit global graph/editor seam.
- The compile/build bridge still uses the active graph document, so behavior remains stable while the editor-binding seam becomes explicit.

#### Verification Steps
- `cmd /c npm test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `cmd /c npm run build`

<!-- ============================================================ -->
### [138] - 2026-03-09 17:50 - `SP - Phase 9A.3 - Decision-Complete Plan Doc`
<!-- ============================================================ -->
HUMAN SUMMARY: `Completed the \`9A.3\` task doc as a decision-complete implementation spec, locking the first \`EditorViewport\` contract, its runtime placement in \`useSpaghettiStore\`, the explicit \`AppShell -> SpaghettiPanel -> SpaghettiEditor\` binding flow, and the temporary \`activeGraphDocumentId\` bridge so viewport binding can be implemented without dragging in \`9B\` or \`9C\`.`

#### Scope / Constraints Honored
- Completed only the planning/task-doc work for `9A.3`.
- Kept the phase narrow to single-viewport binding and the first singleton split.
- Did not start runtime implementation for viewport binding.
- Preserved `9B`, `9C`, persistence, and routing as deferred work.

#### Summary of Implementation
- Completed `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md` as an implementation-ready execution spec.
- Locked the first-pass runtime placement:
  - graph documents stay in `useSpaghettiStore`
  - the first viewport container also lives in `useSpaghettiStore`
  - `useAppStore` stays as temporary app-shell mode and compile/build bridge state
- Added explicit first-pass contracts for:
  - `EditorViewport`
  - `SpaghettiViewportState`
  - `SpaghettiPanelProps`
  - `SpaghettiEditorProps`
- Added the explicit binding flow and temporary compatibility rule so `activeGraphDocumentId` remains synchronized with the active viewport binding during `9A.3`.
- Tightened the implementation sequence, guardrails, and acceptance checks so the implementer does not need to choose where viewport state lives or how panel/editor binding should flow.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Reviewed `src/app/AppShell.tsx`, `src/app/panels/SpaghettiPanel.tsx`, `src/app/spaghetti/ui/SpaghettiEditor.tsx`, `src/app/spaghetti/store/useSpaghettiStore.ts`, and `src/app/store/useAppStore.ts` to ground the plan in the current runtime seams.
- Rechecked `docs/Human-Plans/roadmap/roadmap.md`, `docs/Human-Plans/Decisions.MD`, and `docs/Human-Plans/CodexNotes/6_CodexChatNotes.md` to keep the final `9A.3` task doc aligned with the locked roadmap direction.

<!-- ============================================================ -->
### [137] - 2026-03-09 17:43 - `SP - Phase 9A.3 - Viewport Binding Plan Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`9A.3\` task doc for viewport binding and the first singleton split, aligning it with the locked roadmap and decisions so the next editor-binding cut now has its own implementation-ready planning surface. Also refreshed the roadmap plan-doc status counts so Lane \`[1.1A.3]\` is tracked as having a dedicated task file.`

#### Scope / Constraints Honored
- Added only the planning/task-doc setup for `9A.3`.
- Kept the new doc aligned with the existing `9A.1` / `9A.2` task-doc structure.
- Did not start implementation code for viewport binding.
- Updated the roadmap and changelog in the same change set per repo maintenance rules.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md`.
- Narrowed the plan to the intended `9A.3` cut:
  - first explicit `EditorViewport` contract
  - binding editor viewport identity to `graphDocumentId`
  - breaking the one-window spaghetti assumption without absorbing `9B`
- Documented current seams in:
  - `AppShell.tsx`
  - `SpaghettiPanel.tsx`
  - `SpaghettiEditor.tsx`
- Added the standard execution sections:
  - progress checklist
  - architecture spec
  - master checklist
  - implementation plan
  - close-out notes
- Updated roadmap `Plan.md Status` for `[1.1A.3]` and refreshed the dedicated-doc totals.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Reviewed `docs/Human-Plans/roadmap/roadmap.md` and `docs/Human-Plans/Decisions.MD` to align the new task doc with the current `9A.3` planning boundary.
- Reviewed `src/app/AppShell.tsx`, `src/app/panels/SpaghettiPanel.tsx`, and `src/app/spaghetti/ui/SpaghettiEditor.tsx` to ground the new plan in the current singleton seams.

<!-- ============================================================ -->
### [136] - 2026-03-09 17:25 - `SP - Phase 9A.2 - Graph-Owned Node Row Mode`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the narrow \`9A.2\` authored-canvas cut by moving per-node row mode into graph-owned state under \`SpaghettiGraph.ui.nodeModesByNodeId\`. Kept section/group/composite collapse, composite expansion, and other viewport-local interaction state out of canonical graph truth, removed node-mode ownership from \`useSpaghettiUiStore\`, and verified the change with targeted Vitest coverage plus a full build.`

#### Scope / Constraints Honored
- Implemented only the narrow `9A.2` move.
- Kept `SpaghettiGraph.ui` as the state home instead of adding a new top-level authored-canvas object.
- Kept section/group/composite collapse local.
- Kept composite expansion, selection, hover, drag, pan/zoom, menus, and `edgeWaypoints` out of canonical graph-owned truth.
- Kept `inputMode` as temporary UI mode state.

#### Summary of Implementation
- Extended `SpaghettiGraph.ui` with sparse `nodeModesByNodeId` support.
- Added schema parsing support for graph-owned node modes.
- Added store-side node-mode selector and mutation helpers in `useSpaghettiStore`.
- Normalized node-mode storage so default `essentials` entries are omitted and stale node-mode entries are pruned during graph normalization.
- Reconnected `SpaghettiCanvas` to write node mode through graph-owned store actions.
- Reconnected `NodeView` to render from graph-owned node mode passed down from the canvas runtime.
- Removed node-mode ownership from `useSpaghettiUiStore`, leaving it responsible only for local collapse state.
- Updated tests for schema parsing, store behavior, UI-store behavior, and `NodeView` rendering.
- Marked the `9A.2` task doc as complete.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Per-node row mode is now graph-owned authored state.
- Default `essentials` mode is implicit and no longer needs explicit storage.
- `useSpaghettiUiStore` no longer owns node-mode truth.

#### Verification Steps
- Ran `cmd /c npm test -- src/app/spaghetti/schema/spaghettiSchema.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- Ran `cmd /c npm run build`

<!-- ============================================================ -->
### [135] - 2026-03-09 17:10 - `DOC - Phase 14 - Tighten SP 9A.2 Into Implementation-Ready Spec`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reworked the \`SP 9A.2\` task doc into a decision-complete implementation spec. Narrowed the phase to one concrete authored-canvas move: per-node row mode becomes graph-owned under \`SpaghettiGraph.ui\`, while section/group/composite collapse and other viewport-local canvas state stay out of scope for this cut.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept `9A.2` phase-pure and intentionally narrow.
- Did not fold `9A.3`, `9B`, persistence, or routing work into the spec.
- Kept section/group/composite collapse, composite expansion, and other viewport-local state out of canonical graph-owned truth for this phase.

#### Summary of Implementation
- Rewrote `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md` into an implementation-ready spec.
- Locked the canonical `9A.2` state contract to extend existing `SpaghettiGraph.ui` with `nodeModesByNodeId`.
- Replaced broad authored-canvas wording with code-grounded seams from `spaghettiUiStore`, `NodeView`, and `SpaghettiCanvas`.
- Locked the execution sequence around moving only node-mode ownership from `useSpaghettiUiStore` into the graph-owned seam.
- Added precise acceptance checks for schema parsing, sparse-default storage, store updates, UI reads/writes, and boundary preservation.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The `9A.2` task doc is now specific enough to implement directly without leaving ownership decisions to the implementer.

#### Verification Steps
- Re-read the current runtime seams in:
  - `src/app/spaghetti/schema/spaghettiTypes.ts`
  - `src/app/spaghetti/canvas/state/spaghettiUiStore.ts`
  - `src/app/spaghetti/canvas/NodeView.tsx`
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- Confirmed the rewritten task doc now matches the real code seams and the already-locked `Decisions.MD` direction.

<!-- ============================================================ -->
### [134] - 2026-03-09 16:20 - `DOC - Phase 14 - Create SP 9A.2 Task Doc`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the next phase-task planning doc for \`[1.1A.2] SP - Phase 9A.2 - Graph-Owned Authored Canvas State\` and updated the roadmap to show that the dedicated doc now exists. The new plan stays phase-pure: it focuses on graph-authored canvas truth, node row mode ownership, and keeping viewport/editor-local state out of canonical graph state.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept the new task doc scoped to `9A.2` only.
- Did not fold `9A.3`, `9B`, or `9C` work into this file.

#### Summary of Implementation
- Added `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md`.
- Built the new file in the same planning shape used for `9A.1`:
  - `Progress CheckList`
  - `Doc Header`
  - `Arch Spec`
  - `Master CheckList`
  - `Plan.md`
  - `Close Out notes`
- Locked the `9A.2` planning focus around graph-owned authored canvas truth, especially node row mode, while keeping `selection`, `hover`, drag, pan/zoom, menu state, and `edgeWaypoints` out of canonical graph-owned truth by default.
- Updated the roadmap `Plan.md Status` for `[1.1A.2]` and refreshed the dedicated-plan totals.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The planning system now has dedicated future task docs for both `9A.1` and `9A.2`.

#### Verification Steps
- Reviewed `docs/Phase-Plans/00_Phase-Setup.md` for task-doc placement and naming context.
- Reviewed `docs/Phase-Plans/Tasks/Future/01.01 - SP - Phase 9.md` and mirrored its planning structure for the next phase.
- Updated the roadmap to reflect the new dedicated `9A.2` task doc.

<!-- ============================================================ -->
### [133] - 2026-03-09 16:20 - `DOC - Phase 14 - Roadmap Checkbox Refresh After SP 9A.1`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the human roadmap checklists to reflect the real state after the \`SP 9A.1\` implementation cut. Marked the dedicated \`9A.1\` plan doc as created, updated the dedicated-plan totals, and checked only the specific roadmap bullets that were actually completed by the first graph-document pass.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept roadmap status strict to the work that is actually done.
- Did not mark broader `1.1`, `1.1A`, or later phases complete just because `9A.1` landed.

#### Summary of Implementation
- Added a new roadmap doc-history line explaining the post-`9A.1` checklist refresh.
- Marked `Plan.md Status` complete for `[1.1A.1] SP - Phase 9A.1 - Graph Document Shape And Identity`.
- Updated the dedicated-plan totals from `0 / 27` to `1 / 26`.
- Checked the specific `9A.1` lane-body checklist bullets that are now true:
  - `graphDocumentId`, `name`, and `version`
  - `graph.nodes` and `graph.edges` as the core payload
  - empty graph documents valid

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The roadmap now more accurately shows that `9A.1` has both a real task doc and a completed first implementation pass.

#### Verification Steps
- Reviewed the roadmap `Plan.md Status` and `Dedicated Plan.md CheckList Total` sections against the existing `01.01 - SP - Phase 9.md` task doc.
- Checked only the `9A.1` checklist bullets that are directly supported by the landed implementation.

<!-- ============================================================ -->
### [132] - 2026-03-09 16:11 - `SP - Phase 9 - Graph Document Foundations 9A.1 Cut`
<!-- ============================================================ -->
HUMAN SUMMARY: `Introduced the first canonical \`GraphDocument\` contract for spaghetti graphs, added a runtime active-document container in the spaghetti store, and re-routed app/editor/viewer consumers through the document layer while keeping viewport-only state out of the first-pass document shape. Added direct schema/store tests for the new document behavior and verified the cut with build plus targeted Vitest runs.`

#### Scope / Constraints Honored
- Implemented only the `9A.1` graph-document foundation cut.
- Kept `inputMode` as temporary UI mode state.
- Kept `edgeWaypoints` outside canonical `GraphDocument` state.
- Kept viewport/editor-local state outside canonical `GraphDocument` state.
- Did not introduce persistence, multi-viewport binding, or Browser/project ownership work.

#### Summary of Implementation
- Added `GraphDocument` and `GraphDocumentVersion` to the spaghetti schema types.
- Added `graphDocumentSchema` and `parseGraphDocument` so the first-pass document contract is validated separately from raw `SpaghettiGraph`.
- Added `graphDocumentsById`, `graphDocumentOrder`, and `activeGraphDocumentId` to `useSpaghettiStore`.
- Wrapped the current singleton graph as the first runtime `GraphDocument` and kept the legacy `graph` bridge synchronized to the active document graph during the refactor cut.
- Added `selectActiveGraphDocument` and `selectActiveGraph` selectors and switched `useAppStore`, `ViewerHost`, `PartsListPanel`, `CollapsedEditor`, `DebugInspectorDrawer`, `SpaghettiEditor`, and `SpaghettiCanvas` to consume canonical graph data through the document layer.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/Phase-Plans/Tasks/Future/01.01 - SP - Phase 9.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The spaghetti runtime now has explicit active graph-document identity instead of relying only on the singleton graph field.
- Compile/build and UI graph consumers now resolve the active graph through the document layer.
- The first-pass document contract remains limited to `graphDocumentId`, `name`, `version`, and `graph`.

#### Verification Steps
- Ran `cmd /c npm run build`
- Ran `cmd /c npm test -- src/app/spaghetti/schema/spaghettiSchema.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts`
- Added close-out implementation notes to `docs/Phase-Plans/Tasks/Future/01.01 - SP - Phase 9.md`

<!-- ============================================================ -->
### [131] - 2026-03-07 12:08 - `DOC - Phase 13 - Canonical Changelog Rewrite - Draft Recovered Entry Shapes From History Log`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reworked the Reference - Planned CHANGELOG.md Entry Shapes section in docs/Phases/OO - Phase 13 - Canonical Changelog Rewrite.md so it reads like actual draft recovered changelog entries instead of thin placeholder shapes. Used docs/History/0 - History-TaskLog.md as the main source for the early recovered Conv 8 band and tightened the later recovered entries against the canonical phase log.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Reworked the `Reference - Planned CHANGELOG.md Entry Shapes` section in `docs/Phases/OO - Phase 13 - Canonical Changelog Rewrite.md` so it reads like actual draft recovered changelog entries instead of thin placeholder shapes.
- Used `docs/History/0 - History-TaskLog.md` as the main source for the early recovered Conv 8 band and tightened the later recovered entries against the canonical phase log.
- Added a clear source rule inside the plan doc so the early recovered entries, later recovered entries, and inferred gap entries each point back to the right evidence source.
- Expanded the early recovered entry drafts with more concrete summary bullets and file lists so the phase plan now shows a more realistic preview of what will be written into the canonical rewritten changelog.

#### Files Changed
- `docs/Phases/OO - Phase 13 - Canonical Changelog Rewrite.md` (now DOC - Phase Plans.md)
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The Phase 13 planning doc now gives a much clearer preview of the recovered changelog text that will eventually be inserted into `docs/CHANGELOG.md`.

#### Verification Steps
- Reviewed `docs/History/0 - History-TaskLog.md` and `docs/Phases/00_Phase_Log.md` while revising the draft entry shapes.
- Confirmed the Phase 13 reference section now distinguishes Conv 8 source entries, Conv 9 source entries, and explicitly inferred gap entries.
- Confirmed the updated draft entries still follow the example changelog format shape already defined in the phase plan.
- No build or test run required for this documentation-only update.

<!-- ============================================================ -->
### [130] - 2026-03-07 10:51 - `DOC - Phase 12 - Phase Setup Cleanup - Add Future Phase File Checklist Format Rule`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a Future Phase File Setup Rule to docs/Phases/00_Phase-Setup.md. Defined the required top-of-file structure for future phase planning docs in docs/Phases/Future/.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added a `Future Phase File Setup Rule` to `docs/Phases/00_Phase-Setup.md`.
- Defined the required top-of-file structure for future phase planning docs in `docs/Phases/Future/`.
- Required the high-detail checklist in future phase files to use one visible parent checklist with section items and sub-checklist items underneath.
- Kept the workflow split intact so `AGENTS.md` still owns the enforcement/workflow rule while `00_Phase-Setup.md` now owns the practical setup/template guidance.

#### Files Changed
- `docs/Phases/00_Phase-Setup.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- Future phase files now have an explicit required checklist shape defined in the canonical phase setup doc.

#### Verification Steps
- Reviewed the updated `00_Phase-Setup.md` and confirmed it now includes the future phase-file naming rule, required sections, and checklist format example.
- Confirmed the `Phase Loop Rule` remains in `AGENTS.md` so setup guidance and workflow enforcement stay split cleanly.
- No build or test run required for this documentation-only update.

<!-- ============================================================ -->
### [129] - 2026-03-07 10:37 - `DOC - Phase 12 - Repo Docs And Workflow Cleanup - Consolidate Chill Batch #3`
<!-- ============================================================ -->
HUMAN SUMMARY: `Consolidated the active chill-mode work into one permanent changelog entry and one permanent docs/change-List.md line. Reworked the current phase docs so the canonical setup, checklist, and log now have a cleaner split between phase-system definition, future phase planning, and completed phase history.`

#### Scope / Constraints Honored
- Documentation-only consolidation.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.
- Consolidated only `Chill Batch #3`.

#### Summary of Implementation
- Consolidated the active chill-mode work into one permanent changelog entry and one permanent `docs/change-List.md` line.
- Reworked the current phase docs so the canonical setup, checklist, and log now have a cleaner split between phase-system definition, future phase planning, and completed phase history.
- Expanded the repo-reference docs with a clearer repository snapshot, multi-level hierarchy views, snapshot explanation notes, and a restated ownership-boundary golden rule.
- Tightened the repo workflow rules in `AGENTS.md`, including the phase-doc split, the new phase loop workflow, and a lighter chill-mode diff policy for routine small edits.
- Continued the recovered-history cleanup with formatted `COPY` files, prompt/response summaries, missing-task reconstruction, and stronger compiled history notes around the early `/20/` restart seam.

#### Files Changed
- `AGENTS.md`
- `docs/Chill-Log.md`
- `docs/DOCindex.md`
- `docs/History/0 - compiled-HISTORY.md`
- `docs/History/8 - COPY.md`
- `docs/History/9 - COPY.md`
- `docs/History/12 - COPY.md`
- `docs/History/MISSINGTASKS.md`
- `docs/Phases/00_Phase-CheckList.md`
- `docs/Phases/00_Phase-Setup.md`
- `docs/Phases/00_Phase_Log.md`
- `docs/Phases/00_Phase_List.md`
- `docs/TASKLIST.md`
- `docs/TaskHistoryCompilation.md`
- `docs/repo.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a clearer standing phase workflow: `00_Phase-Setup.md` for classification and future planning, `docs/Phases/Future/*.md` for active phase plans, and `00_Phase_Log.md` for completed detailed phase history.
- `Chill Batch #3` is now permanently recorded in the repo changelog under `[104]`.

#### Verification Steps
- Reviewed the active entries in `Chill Batch #3` and consolidated them into one permanent changelog entry.
- Added the matching one-line permanent entry to `docs/change-List.md`.
- Marked `Chill Batch #3` as compiled in `docs/Chill-Log.md`.
- No build or test run required for this documentation-only consolidation.

<!-- ============================================================ -->
### [128] - 2026-03-06 20:51 - `DOC - Phase 9 - Chill Mode Docs Workflow - Rename Canonical Chill Log To Chill-Log`
<!-- ============================================================ -->
HUMAN SUMMARY: `Renamed the canonical chill-mode file from docs/Chill-Mode-Edits.md to docs/Chill-Log.md. Updated the renamed file so its title, purpose, and canonical note use the new chill-log name.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Renamed the canonical chill-mode file from `docs/Chill-Mode-Edits.md` to `docs/Chill-Log.md`.
- Updated the renamed file so its title, purpose, and canonical note use the new chill-log name.
- Updated `AGENTS.md` and `docs/Documentation-Rules.md` so the repo's active chill-mode instructions now point to `docs/Chill-Log.md`.

#### Files Changed
- `AGENTS.md`
- `docs/Chill-Log.md`
- `docs/Documentation-Rules.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The canonical chill-mode log path is now `docs/Chill-Log.md`.

#### Verification Steps
- Reviewed the renamed chill-mode file and confirmed the active batch history remained intact.
- Updated the live chill-mode references in `AGENTS.md` and `docs/Documentation-Rules.md` to the new path.
- No build or test run required for this documentation-only rename.

<!-- ============================================================ -->
### [127] - 2026-03-06 20:47 - `DOC - Phase 11 - History And Phase-System Consolidation - Consolidate Chill Batch #2`
<!-- ============================================================ -->
HUMAN SUMMARY: `Consolidated the active chill-mode work into one permanent changelog entry and one permanent docs/change-List.md line. Rebuilt the restored history system around structured historian summaries, compiled-history continuity, ordered restored task logs, and explicit gap tracking between recovered /20/ history and the shipped changelog era.`

#### Scope / Constraints Honored
- Documentation-only consolidation.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.
- Consolidated only `Chill Batch #2`.

#### Summary of Implementation
- Consolidated the active chill-mode work into one permanent changelog entry and one permanent `docs/change-List.md` line.
- Rebuilt the restored history system around structured historian summaries, compiled-history continuity, ordered restored task logs, and explicit gap tracking between recovered `/20/` history and the shipped changelog era.
- Reworked the canonical docs and phase system around one active prefix model, including the canonical phase setup, grouped phase checklist, chronological phase list, and the supporting documentation rules.
- Added and expanded roadmap and planning docs covering the current ParaHook vision, Spaghetti Studio direction, leaving legacy, and the current product/architecture roadmap layers.
- Tightened the chill-mode file itself so the active chill log now matches the current `AGENTS.md` workflow without deleting older chill-history files.

#### Files Changed
- `docs/Chill-Mode-Edits.md`
- `docs/Change-List-COMPILED.md`
- `docs/Documentation-Rules.md`
- `docs/TaskHistoryCompilation.md`
- `docs/Bugs/0_Bug_Report.md`
- `docs/History/0 - compiled-HISTORY.md`
- `docs/History/0 - GIT.md`
- `docs/History/0 - History-TaskList.md`
- `docs/History/0 - History-TaskLog.md`
- `docs/History/1 - chatgpt.md`
- `docs/History/2 - chatgpt.md`
- `docs/History/3 - chatgpt.md`
- `docs/History/4 - chatgpt.md`
- `docs/History/5 - chatgpt.md`
- `docs/History/6 - chatgpt.md`
- `docs/History/7 - chatgpt.md`
- `docs/History/8 - chatgpt.md`
- `docs/History/9 - chatgpt.md`
- `docs/History/10 - chatgpt.md`
- `docs/History/11 - chatgpt.md`
- `docs/Phases/00_Phase-Setup.md`
- `docs/Phases/00_Phase-CheckList.md`
- `docs/Phases/00_Phase_List.md`
- `docs/Phases/00_Phase_Log.md`
- `docs/Plans/README.md`
- `docs/Plans/Architecture/Spaghetti-Editor-Arch/Spaghetti-Editor-Explained.md`
- `docs/Plans/Wish-Features/WISHLIST.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.0 - Master Spaghetti.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.5 - Muliple Spaghetti Bowls.md`
- `docs/roadmap/02_Vision-Roadmap.md`
- `docs/roadmap/03_Spaghetti-Studio.md`
- `docs/roadmap/Focused-Roadmap.md`
- `docs/roadmap/LEAVING-legacy.md`
- `docs/roadmap/Medium ROADMAP.md`
- `docs/tasks/001 - GE - Phase 1 - Clean Restart.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a more coherent history-reconstruction system, a more stable canonical phase system, and clearer roadmap docs for the current ParaHook-to-Spaghetti-Studio direction.
- `Chill Batch #2` is now permanently recorded in the repo changelog under `[102]`.

#### Verification Steps
- Reviewed the active entries in `Chill Batch #2` and consolidated them into one permanent changelog entry.
- Added the matching one-line permanent entry to `docs/change-List.md`.
- Marked `Chill Batch #2` as compiled in `docs/Chill-Mode-Edits.md`.
- No build or test run required for this documentation-only consolidation.

<!-- ============================================================ -->
### [126] - 2026-03-06 02:35 - `DOC - Phase 10 - Docs Planning Sprint - Consolidate Chill Batch #1`
<!-- ============================================================ -->
HUMAN SUMMARY: `Consolidated Chill Batch #1 into one permanent changelog entry and one permanent change-List.md line. Organized the repoï¿½s planning/docs structure around architecture, wish features, Spaghetti editor planning, roadmap cleanup, and unresolved decisions.`

#### Scope / Constraints Honored
- Documentation-only consolidation.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.
- Consolidated only `Chill Batch #1`.

#### Summary of Implementation
- Consolidated `Chill Batch #1` into one permanent changelog entry and one permanent `change-List.md` line.
- Organized the repoï¿½s planning/docs structure around architecture, wish features, Spaghetti editor planning, roadmap cleanup, and unresolved decisions.
- Added and expanded core planning docs for the current `/20/` app, including architecture history, system map, glossary, old-feature wishlist, Jake mode direction, decisions backlog, and Spaghetti editor concept docs.
- Refined the chill-mode workflow itself by adding numbered batch entries, per-doc `Doc History` rules, and timestamped local doc histories.
- Cleaned up several planning docs from pasted transcript form into structured reference notes.

#### Files Changed
- `AGENTS.md`
- `docs/chill-mode-ChangeList.md`
- `docs/change-List.md`
- `docs/Plans/File-List.md`
- `docs/Plans/Temp-CHANGELOG-Entry.md`
- `docs/Plans/Architecture/Glossary.md`
- `docs/Plans/Architecture/History.md`
- `docs/Plans/Architecture/System-Map.md`
- `docs/Plans/Decisions.MD`
- `docs/Plans/Wish-Features/00 - old-Wishes.md`
- `docs/Plans/Wish-Features/04 - Gizmo.md`
- `docs/Plans/Wish-Features/10 - radio-Sampler.md`
- `docs/Plans/Wish-Features/11 - Scenes.md`
- `docs/Plans/Wish-Features/Jake-Mode.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.0 - Master Spaghetti.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.1 - Spaghetti Editor.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.2 - Spaghetti Editor Tool Bar.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.3 - Wires ui`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.4 - Nodes.md`
- `docs/roadmap/LegacyList.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The docs system now has a clearer planning structure and a cleaner distinction between architecture docs, wishlist docs, Spaghetti editor docs, roadmap cleanup notes, and open decisions.
- `Chill Batch #1` is now permanently recorded in the repo changelog under `[101]`.

#### Verification Steps
- Reviewed all numbered entries in `Chill Batch #1` and consolidated them into one coherent permanent changelog entry.
- Added the matching one-line entry to `docs/change-List.md`.
- Marked `Chill Batch #1` as compiled in `docs/chill-mode-ChangeList.md`.
- No build or test run required for this docs-only consolidation.

<!-- ============================================================ -->
### [125] - 2026-03-05 23:57 - `DOC - Phase 9 - Chill Mode Docs Workflow - Add Temporary Chill Change Log File`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/chill-mode-ChangeList.md as a temporary logging file for chill-mode edit batches. Initialized the file with purpose text, batch rules, and a starter Chill Batch #1 template.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/chill-mode-ChangeList.md` as a temporary logging file for chill-mode edit batches.
- Initialized the file with purpose text, batch rules, and a starter `Chill Batch #1` template.
- Left permanent tracking behavior unchanged outside chill mode.

#### Files Changed
- `docs/chill-mode-ChangeList.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a dedicated temporary file for collecting chill-mode edit batches before consolidation.

#### Verification Steps
- Reviewed the new chill-mode log file structure and starter batch template.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [124] - 2026-03-05 23:54 - `DOC - Phase 9 - Chill Mode Docs Workflow - Add Chill Mode To AGENTS.md`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a Chill Mode Rule to AGENTS.md. Defined docs/Chill-Mode-Edits.md as the temporary log file for rapid small edits during chill mode.`

#### Scope / Constraints Honored
- Documentation/process update only.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.

#### Summary of Implementation
- Added a `Chill Mode Rule` to `AGENTS.md`.
- Defined `docs/Chill-Mode-Edits.md` as the temporary log file for rapid small edits during chill mode.
- Defined the active `Chill Batch` workflow, including explicit activation, one active batch at a time, and consolidation into one `docs/CHANGELOG.md` entry plus one `docs/change-List.md` line when the user says `Update changelog`.

#### Files Changed
- `AGENTS.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- `AGENTS.md` now supports a special chill-mode workflow for rapid small edits without creating a permanent changelog entry for each edit.
- Outside chill mode, the normal `docs/CHANGELOG.md` and `docs/change-List.md` rules still apply.

#### Verification Steps
- Reviewed the updated `AGENTS.md` rules for consistency with the requested chill-mode workflow.
- No build or test run required for this docs-only policy update.

<!-- ============================================================ -->
### [123] - 2026-03-05 23:43 - `DOC - Phase 8 - Wish Features Setup - Spaghetti Editor Toolbar Wishlist`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/Wish-Features/3 - Spaghetti Editor Tool Bar.md to capture the desired future cleanup of the Spaghetti Editor toolbar area. Documented the current fragmented control ownership across SpaghettiPanel, SpaghettiEditor, and SpaghettiCanvas.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/Wish-Features/3 - Spaghetti Editor Tool Bar.md` to capture the desired future cleanup of the Spaghetti Editor toolbar area.
- Documented the current fragmented control ownership across `SpaghettiPanel`, `SpaghettiEditor`, and `SpaghettiCanvas`.
- Captured the requested direction: improve help text, redesign sample/load controls, reduce info-window height, move the toolbar drag bar below the toolbar, and move canvas-toolbar controls into the main toolbar.

#### Files Changed
- `docs/Wish-Features/3 - Spaghetti Editor Tool Bar.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a dedicated wishlist doc for the future Spaghetti Editor toolbar cleanup.

#### Verification Steps
- Reviewed the new doc against the current control split in `SpaghettiPanel`, `SpaghettiEditor`, and `SpaghettiCanvas`.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [122] - 2026-03-05 23:37 - `DOC - Phase 8 - Wish Features Setup - Spaghetti Editor Wishlist`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/Wish-Features/Spaghetti Editor.md to capture future Spaghetti Editor ideas discussed in planning. Recorded current window/layout pain points, desired Toolbar/Half/Full/Browser window modes, and the desired top-right control model.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/Wish-Features/Spaghetti Editor.md` to capture future Spaghetti Editor ideas discussed in planning.
- Recorded current window/layout pain points, desired Toolbar/Half/Full/Browser window modes, and the desired top-right control model.
- Documented longer-term ideas for multiple editor instances, browser-window hosting, multi-document ownership, and shared-viewport rendering for multiple independent ParaHooks.

#### Files Changed
- `docs/Wish-Features/Spaghetti Editor.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a dedicated Spaghetti Editor wishlist doc for future UI and architecture ideas.

#### Verification Steps
- Reviewed the new wishlist doc for consistency with recent Spaghetti windowing and multi-instance architecture discussions.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [121] - 2026-03-05 23:28 - `DOC - Phase 7 - Docs Policy Cleanup - Remove TASKLIST Requirement From AGENTS.md`
<!-- ============================================================ -->
HUMAN SUMMARY: `Removed docs/TASKLIST.md from the required tracking files in AGENTS.md. Removed the dedicated TASKLIST rule block from AGENTS.md.`

#### Scope / Constraints Honored
- Documentation/process update only.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.

#### Summary of Implementation
- Removed `docs/TASKLIST.md` from the required tracking files in `AGENTS.md`.
- Removed the dedicated `TASKLIST` rule block from `AGENTS.md`.
- Updated the required maintenance sequence in `AGENTS.md` so it now requires `docs/CHANGELOG.md` and `docs/change-List.md`, but no longer requires `docs/TASKLIST.md`.

#### Files Changed
- `AGENTS.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- Future Codex implementation changes are no longer required by `AGENTS.md` to update `docs/TASKLIST.md`.
- `docs/CHANGELOG.md` and `docs/change-List.md` remain required tracking files.

#### Verification Steps
- Reviewed the updated `AGENTS.md` instructions for consistency after removing `TASKLIST` maintenance requirements.
- No build or test run required for this docs-only policy update.

<!-- ============================================================ -->
### [120] - 2026-03-05 23:23 - `SP - Phase 7 - Spaghetti Editor Window Update Phase Plan`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/Phases/UI_Window-Update_PhasePlan.md to plan the next Spaghetti window/layout phase. Captured the three current resize/layout bugs plus the new four-mode Spaghetti window feature request.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/Phases/UI_Window-Update_PhasePlan.md` to plan the next Spaghetti window/layout phase.
- Captured the three current resize/layout bugs plus the new four-mode Spaghetti window feature request.
- Recommended an ownership split where `AppShell` owns outer window modes and geometry while `SpaghettiPanel` owns header/canvas/debug split behavior.

#### Files Changed
- `docs/Phases/UI_Window-Update_PhasePlan.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a dedicated UI phase plan for Spaghetti window bugs and future window modes.

#### Verification Steps
- Reviewed the new phase plan against the current `AppShell` and `SpaghettiPanel` layout responsibilities.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [119] - 2026-03-05 23:09 - `SP - Phase 6 - Resizable Debug Inspector Drawer`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a second vertical resize handle above the Debug Inspector drawer in SpaghettiPanel. Gave the debug drawer its own height state with drag-to-resize and double-click reset behavior, matching the existing Spaghetti editor resize affordance.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept graph topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no compile, runtime, selector, or viewer behavior changes.

#### Summary of Implementation
- Added a second vertical resize handle above the `Debug Inspector` drawer in `SpaghettiPanel`.
- Gave the debug drawer its own height state with drag-to-resize and double-click reset behavior, matching the existing Spaghetti editor resize affordance.
- Updated the debug drawer layout so the toggle remains fixed while the inspector body fills the drawer and scrolls within the resized area.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- The `Debug Inspector` can now be resized vertically from a handle above the drawer.
- Double-clicking the new resize handle resets the drawer to its default height.

#### Verification Steps
- `npm.cmd run build` (passed, existing Vite chunk-size warning only)

<!-- ============================================================ -->
### [118] - 2026-03-05 22:54 - `DOC - Phase 6 - Docs Task And Phase Setup - Plain-English Engine Architecture Overview`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/Architecture/Engine-Architecture.md to explain the app's engine in plain English. Documented the main layer boundaries: app/state, worker/build execution, viewer/rendering, and shared contracts.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/Architecture/Engine-Architecture.md` to explain the app's engine in plain English.
- Documented the main layer boundaries: app/state, worker/build execution, viewer/rendering, and shared contracts.
- Explained how legacy mode and Spaghetti mode both feed the same worker pipeline, and clarified the preview identity versus build identity split.

#### Files Changed
- `docs/Architecture/Engine-Architecture.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- Repository docs now include a readable explanation of how the engine is structured and how data flows through it.

#### Verification Steps
- Reviewed the new architecture doc against current app, worker, shared, and spaghetti file structure.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [117] - 2026-03-05 22:45 - `DOC - Phase 6 - Docs Task And Phase Setup - Add Changelog-Derived Phase Checklist`
<!-- ============================================================ -->
HUMAN SUMMARY: `Populated docs/Phases/00_Phase-CheckList.md with one-line checklist entries grouped by phase family. Derived the checklist from completed CHANGELOG.md phase entries only, so listed phases are marked completed.`

#### Scope / Constraints Honored
- Documentation-only change.
- Read phase names/status from `docs/CHANGELOG.md`.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.

#### Summary of Implementation
- Populated `docs/Phases/00_Phase-CheckList.md` with one-line checklist entries grouped by phase family.
- Derived the checklist from completed `CHANGELOG.md` phase entries only, so listed phases are marked completed.
- Separated current canonical prefix-based phases from older legacy numbered phases instead of renaming historical work.

#### Files Changed
- `docs/Phases/00_Phase-CheckList.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The phase checklist now provides a changelog-derived grouped overview of completed phases.

#### Verification Steps
- Reviewed `docs/CHANGELOG.md` phase headings and populated `docs/Phases/00_Phase-CheckList.md` from those entries only.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [116] - 2026-03-05 22:37 - `DOC - Phase 6 - Docs Task And Phase Setup - Add Canonical Phase Setup Guide`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/Phases/01_Phase-Setup.md as a canonical planning-structure guide for the repo. Defined the intended roles of roadmap, phase setup docs, phase plans, task files, changelog, and change-list so each document type has a single responsibility.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/Phases/01_Phase-Setup.md` as a canonical planning-structure guide for the repo.
- Defined the intended roles of roadmap, phase setup docs, phase plans, task files, changelog, and change-list so each document type has a single responsibility.
- Documented a recommended stable track-prefix system (`GE`, `VM`, `NI`, `FS`, `PT`, `PR`, `AS`, `VR`, `DBG`, `EX`, `ADV`) and naming rules for phases/sub-phases.

#### Files Changed
- `docs/Phases/01_Phase-Setup.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- Repository planning docs now include a higher-level guide for keeping roadmap, phases, tasks, and history separated.

#### Verification Steps
- Reviewed `docs/Phases/01_Phase-Setup.md` for consistency with the current docs structure and naming direction.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [115] - 2026-03-05 22:30 - `DOC - Phase 6 - Docs Task And Phase Setup - Split NI Task Files`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added standalone task files for NI-1, NI-2, and NI-3 under docs/tasks/. Copied the current checklist/status content from docs/TASKLIST.md so the task files match the completed task blocks already tracked there.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Kept existing task wording/status sourced from `docs/TASKLIST.md`.

#### Summary of Implementation
- Added standalone task files for `NI-1`, `NI-2`, and `NI-3` under `docs/tasks/`.
- Copied the current checklist/status content from `docs/TASKLIST.md` so the task files match the completed task blocks already tracked there.
- Restored `docs/tasks/NI-3.md` after deletion and aligned it with the current canonical wording that uses `expanded` rather than `everything`.

#### Files Changed
- `docs/tasks/NI-1.md`
- `docs/tasks/NI-2.md`
- `docs/tasks/NI-3.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- Documentation now has dedicated task files for the NI-1, NI-2, and NI-3 phases.

#### Verification Steps
- Verified `docs/tasks/NI-1.md`, `docs/tasks/NI-2.md`, and `docs/tasks/NI-3.md` were created from the current `docs/TASKLIST.md` entries.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [114] - 2026-03-05 22:05 - `DBG - Phase 1 - Debug Inspector Foundation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a read-only Debug Inspector drawer to the Spaghetti panel with a show/hide toggle that only affects panel visibility. Introduced a selector-owned debug aggregation layer that surfaces compile status, received artifacts, deterministic OutputPreview slot mapping, preview render VM entries, and the exact preview renderables ViewerHost receives in spaghetti parts mode.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept graph topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept the Feature Stack IR shape unchanged.
- Kept OutputPreview invariants unchanged.
- Added no graph repair logic, debug mutation actions, selection/drag behavior changes, or part-specific debug branches.

#### Summary of Implementation
- Added a read-only `Debug Inspector` drawer to the Spaghetti panel with a show/hide toggle that only affects panel visibility.
- Introduced a selector-owned debug aggregation layer that surfaces compile status, received artifacts, deterministic OutputPreview slot mapping, preview render VM entries, and the exact preview renderables `ViewerHost` receives in spaghetti parts mode.
- Kept the inspector structured and deterministic with stable slot ordering, stable preview ordering, stable viewer-input ordering, and explicit empty/inactive states for missing artifacts or non-preview viewer modes.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/theme/v15Theme.css`
- `docs/tasks/DBG-1.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- Added a developer-facing, read-only debug drawer for spaghetti preview pipeline inspection.
- Showing or hiding the drawer does not change compile, graph, preview selector, worker, or viewer behavior.

#### Verification Steps
- `npx.cmd tsc -p tsconfig.json --noEmit` (passed)
- `npm.cmd run test -- src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts` (passed)
- `npm.cmd run test` (passed)
- `npm.cmd run build` (passed, existing Vite chunk-size warning only)
- Manual browser verification of the new drawer was not run in this terminal-only environment.

<!-- ============================================================ -->
### [113] - 2026-03-05 21:47 - `NI - Phase 5 - Modern Node Interaction Cleanup - Node Section Collapse Consistency`
<!-- ============================================================ -->
HUMAN SUMMARY: `Normalized part-node section shells in NodeView so Drivers, Inputs, Feature Stack, and Outputs share one deterministic body-visibility rule: collapsed node mode hides all section bodies, while section toggles remain node-scoped and independent. Restored deterministic node-title mode cycling through the canonical NI-2 vocabulary (collapsed -> essentials -> expanded -> collapsed) by wiring title clicks through canvas-owned node mode state instead of reintroducing any canvas-global mode owner.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept the Feature Stack IR schema unchanged.
- Kept OutputPreview invariants unchanged.
- Added no section tri-state behavior, nested node behavior, worker/runtime/compile contract expansion, or automatic mode switching.
- Preserved the NI-1 selection/drag interaction model and NI-2 node-scoped mode ownership.

#### Summary of Implementation
- Normalized part-node section shells in `NodeView` so `Drivers`, `Inputs`, `Feature Stack`, and `Outputs` share one deterministic body-visibility rule: collapsed node mode hides all section bodies, while section toggles remain node-scoped and independent.
- Restored deterministic node-title mode cycling through the canonical NI-2 vocabulary (`collapsed -> essentials -> expanded -> collapsed`) by wiring title clicks through canvas-owned node mode state instead of reintroducing any canvas-global mode owner.
- Removed real feature input-port rows from sketch/extrude feature panels, kept status-only linked-input indicators inside Feature Stack, and left actual wireable inputs owned by the `Inputs` section.

#### Files Changed
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`

#### Behavior Changes
- Collapsed mode now renders section shells only for part nodes; section bodies stay hidden until the node returns to `essentials` or `expanded`.
- Feature Stack no longer renders actual `Feature Wire Inputs` or owns wireable port rows; linked feature params now render as status-only indicators while real inputs remain in the `Inputs` section.
- Part nodes keep deterministic section order (`Drivers -> Inputs -> Feature Stack -> Outputs`) and title clicks now cycle the current nodeï¿½s mode without altering NI-1 drag ownership.

#### Verification Steps
- `npx.cmd tsc -p tsconfig.json --noEmit` (passed)
- `npm.cmd run test -- src/app/spaghetti/canvas/rowViewMode.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts src/app/spaghetti/canvas/interactionModel.test.ts` (passed)
- `npm.cmd run test` (passed)
- `npm.cmd run build` (passed, existing Vite chunk-size warning only)

<!-- ============================================================ -->
### [112] - 2026-03-05 20:57 - `NI - Phase 5 - Modern Node Interaction Cleanup - Per-Node View Mode System`
<!-- ============================================================ -->
HUMAN SUMMARY: `Replaced the canvas-global row mode with node-scoped UI-store state by adding nodeModeByNodeId, getNodeMode(nodeId), and setNodeMode(nodeId, mode), with deterministic fallback to essentials. Standardized the view-mode vocabulary to collapsed | essentials | expanded, removed the remaining internal everything token, and updated NodeView to read its mode directly from useSpaghettiUiStore.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept the Feature Stack IR schema unchanged.
- Kept OutputPreview invariants unchanged.
- Added no section tri-state behavior, node rendering refactor, collapse consistency cleanup, or automatic mode changes.
- Preserved the NI-1 selection/drag interaction model.

#### Summary of Implementation
- Replaced the canvas-global row mode with node-scoped UI-store state by adding `nodeModeByNodeId`, `getNodeMode(nodeId)`, and `setNodeMode(nodeId, mode)`, with deterministic fallback to `essentials`.
- Standardized the view-mode vocabulary to `collapsed | essentials | expanded`, removed the remaining internal `everything` token, and updated `NodeView` to read its mode directly from `useSpaghettiUiStore`.
- Removed the canvas-toolbar row-mode selector, converted the node context menu to target the clicked nodeï¿½s stored mode, and removed the old hidden auto-mode switching paths so canvas rendering no longer has a global mode owner.

#### Files Changed
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.ts`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`

#### Verification
- `npx.cmd tsc -p tsconfig.json --noEmit` (passed)
- `npm.cmd run test -- src/app/spaghetti/canvas/rowViewMode.test.ts src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/interactionModel.test.ts` (passed)
- `npm.cmd run test` (passed)
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [111] - 2026-03-05 20:21 - `NI - Phase 5 - Modern Node Interaction Cleanup - Node Selection And Drag Model`
<!-- ============================================================ -->
HUMAN SUMMARY: `Split node interaction ownership into explicit header and body paths in NodeView, with header hits reserved for drag-capable selection and body hits reserved for selection-only behavior. Updated SpaghettiCanvas to treat node-owned pointer paths separately from true empty-canvas deselection, so inside-node clicks no longer leak into stage clearing and drag can only arm from the header path.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept the Feature Stack IR schema unchanged.
- Kept OutputPreview invariants unchanged.
- Added no per-node view modes, section tri-state logic, rendering-mode redesign, or hidden automatic mode cleanup.

#### Summary of Implementation
- Split node interaction ownership into explicit header and body paths in `NodeView`, with header hits reserved for drag-capable selection and body hits reserved for selection-only behavior.
- Updated `SpaghettiCanvas` to treat node-owned pointer paths separately from true empty-canvas deselection, so inside-node clicks no longer leak into stage clearing and drag can only arm from the header path.
- Added deterministic interaction-model tests for selection, drag gating, and empty-canvas clearing, plus a `NodeView` assertion that the component renders distinct header/body interaction zones.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/interactionModel.ts`
- `src/app/spaghetti/canvas/interactionModel.test.ts`

#### Verification
- `npm.cmd run test -- src/app/spaghetti/canvas/interactionModel.test.ts src/app/spaghetti/canvas/NodeView.test.tsx` (passed)
- `npx.cmd tsc -p tsconfig.json --noEmit` (passed)
- `npm.cmd run test` (passed)
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [110] - 2026-03-05 19:36 - `DR - Phase 12 - Param And Input Node Foundation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added authored utility node registry entries for Param/Number, Param/Boolean, and Param/Vec2 with deterministic defaults, stable value outputs, and local evaluation-only compute behavior. Hid legacy Primitive/Number and Primitive/Vec2 from new add-node authoring while keeping them readable/evaluable, and added a selector-owned compact utility VM/render path so authored values no longer rely on the old Primitive/Number output-port editing special case.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept the `PartArtifact` contract unchanged.
- Kept the Feature Stack IR schema unchanged.
- Kept OutputPreview invariants unchanged.
- Kept selector/viewer architecture unchanged.
- Added no Rail Math, pin exposure, profile runtime expansion, worker/runtime geometry changes, or toolbar/palette redesign.

#### Summary of Implementation
- Added authored utility node registry entries for `Param/Number`, `Param/Boolean`, and `Param/Vec2` with deterministic defaults, stable `value` outputs, and local evaluation-only compute behavior.
- Hid legacy `Primitive/Number` and `Primitive/Vec2` from new add-node authoring while keeping them readable/evaluable, and added a selector-owned compact utility VM/render path so authored values no longer rely on the old `Primitive/Number` output-port editing special case.
- Routed utility-node edits through `setNodeParams` graph commands in the canvas, added compact helper-node styling/rendering for number/boolean/vec2 values, and expanded deterministic tests for registry contracts, evaluation, contract parity, selector VM output, and NodeView rendering.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/registry/nodeRegistry.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/__snapshots__/selectNodeVm.test.ts.snap`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/contracts/contractParity.test.ts`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- New graphs can add `Param/Number`, `Param/Boolean`, and `Param/Vec2` nodes from the add menu; legacy primitive number/vec2 nodes remain compatible but are no longer offered for new authoring.
- `Param/Number` now wires directly into existing `number:mm` inputs and `Param/Vec2` wires directly into existing `vec2:mm` inputs through the normal shared endpoint validator.
- Utility value nodes now render as compact helper nodes with selector-owned view-model data and command-routed param edits instead of relying on the old `Primitive/Number` inline output-port editor path.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [109] - 2026-03-05 19:11 - `FS - Phase 15 - Multi-Part Feature Stack Support`
<!-- ============================================================ -->
HUMAN SUMMARY: `Generalized spaghetti part ownership in compileGraph so supported part nodes compile into deterministic canonical partKeyStr values across singleton and multi-instance graphs, while preserving legacy singleton keys where required. Threaded compile-owned ordered part keys into spaghetti build request translation and shared part-key ordering helpers so Build Stats, cache rows, and worker/runtime ordering all use the same canonical source/build identity rules.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept the FS-1 solid/artifact contract unchanged.
- Kept OutputPreview invariants unchanged, including the trailing empty slot rule.
- Kept FS-2 feature ordering / enable-disable semantics unchanged.
- Kept FS-3 internal dependency visualization behavior unchanged.
- Added no boolean operations, mating/alignment systems, subgraphs/containers, export pipeline changes, or new geometry kinds.

#### Summary of Implementation
- Generalized spaghetti part ownership in `compileGraph` so supported part nodes compile into deterministic canonical `partKeyStr` values across singleton and multi-instance graphs, while preserving legacy singleton keys where required.
- Threaded compile-owned ordered part keys into spaghetti build request translation and shared part-key ordering helpers so Build Stats, cache rows, and worker/runtime ordering all use the same canonical source/build identity rules.
- Hardened worker/runtime multi-part execution so part-local sketch/profile/body identities no longer collide across different graph-owned parts, while preserving the existing `PartArtifact` and worker message contracts.
- Preserved explicit OutputPreview slot mapping through `nodeId -> sourcePartKeyStr -> artifact` and added regression coverage for multi-slot preview resolution, unresolved-slot behavior, repeated compile/build parity, and deterministic cache-hit ordering.

#### Files Changed
- `src/app/parts/partKeyResolver.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/shared/buildStatsKeys.ts`
- `src/shared/buildStatsKeys.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- Multiple supported spaghetti part nodes in the same graph now compile into deterministic canonical owned part keys and can build/render together without reusing preview slot ids as artifact identity.
- OutputPreview can now resolve multiple distinct spaghetti artifacts in one graph while preserving slot order, unresolved-slot visibility, and slot-scoped viewer identity.
- Repeated unchanged multi-part spaghetti builds now surface deterministic source/build cache rows keyed by canonical `partKeyStr`, with `assembled` still last.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [108] - 2026-03-05 19:00 - `DOC - Phase 5 - Docs Policy Cleanup - Rewrite AGENTS Into Canonical Rules`
<!-- ============================================================ -->
HUMAN SUMMARY: `Replaced the layered AGENTS.md instructions with a cleaner canonical rule set organized by purpose, required files, and maintenance sequence. Preserved the existing repository requirements for CHANGELOG.md, TASKLIST.md, and change-List.md while rewriting them in a more direct format for Codex consumption.`

#### Scope / Constraints Honored
- Documentation/process update only.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.

#### Summary of Implementation
- Replaced the layered `AGENTS.md` instructions with a cleaner canonical rule set organized by purpose, required files, and maintenance sequence.
- Preserved the existing repository requirements for `CHANGELOG.md`, `TASKLIST.md`, and `change-List.md` while rewriting them in a more direct format for Codex consumption.
- Consolidated duplicate maintenance guidance into a single readable instruction flow.

#### Files Changed
- `AGENTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Repository maintenance rules are now easier to parse, but the required maintenance behavior remains the same: update changelog, tasklist, and change-list for implementation work.

#### Verification Steps
- Reviewed rewritten `AGENTS.md` for rule completeness and consistency.
- No build or test run required for this docs-only policy update.

<!-- ============================================================ -->
### [107] - 2026-03-05 18:53 - `DOC - Phase 5 - Docs Policy Cleanup - Preserve Completed Task Blocks`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated AGENTS.md so tasklist maintenance instructions explicitly forbid deleting old phase task lists after completion. Added a rule that completed phases must remain as full completed checklist blocks with accomplished items marked [x].`

#### Scope / Constraints Honored
- Documentation/process update only.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.

#### Summary of Implementation
- Updated `AGENTS.md` so tasklist maintenance instructions explicitly forbid deleting old phase task lists after completion.
- Added a rule that completed phases must remain as full completed checklist blocks with accomplished items marked `[x]`.
- Clarified that completed phase sections should retain visible phase headers and separator lines in the tasklist, similar in spirit to changelog section boundaries.

#### Files Changed
- `AGENTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Future tasklist maintenance is now required to preserve full historical completed phase blocks instead of collapsing them into short summaries or deleting older phase task lists.

#### Verification Steps
- Reviewed updated `AGENTS.md` instructions for tasklist maintenance consistency.
- No build or test run required for this docs-only policy update.

<!-- ============================================================ -->
### [106] - 2026-03-05 18:46 - `FS - Phase 14 - Feature Stack Expansion And Dependency Visualization - Dependency Visualization`
<!-- ============================================================ -->
HUMAN SUMMARY: `Extended the shared FS-2 dependency utility to emit deterministic feature rows plus feature-to-feature and driver-to-feature dependency edges without mutating graph or feature state. Threaded selector-owned feature row ids, row indexes, and internal dependency edges through selectNodeVm so part-node rendering reads deterministic dependency VMs instead of recomputing feature graph logic in the UI.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept the FS-1 solid/artifact contract unchanged.
- Kept FS-2 feature ordering, enable/disable semantics, and compile behavior unchanged.
- Added no multi-part support, boolean operations, sketch solver tooling, or new graph wiring systems.

#### Summary of Implementation
- Extended the shared FS-2 dependency utility to emit deterministic feature rows plus feature-to-feature and driver-to-feature dependency edges without mutating graph or feature state.
- Threaded selector-owned feature row ids, row indexes, and internal dependency edges through `selectNodeVm` so part-node rendering reads deterministic dependency VMs instead of recomputing feature graph logic in the UI.
- Updated the part node UI to register stable driver/feature row anchors and render a local internal dependency overlay only in `everything` mode when the existing `Show internal wiring` toggle is enabled.
- Kept dependency styling structural-only so existing DR-1 warnings/diagnostics remain the status layer, while disabled or ineffective features/wires stay visible in muted form.
- Added deterministic regression coverage for dependency graph analysis, selector VM output, feature row anchors, and node overlay gating.

#### Files Changed
- `src/app/spaghetti/features/featureDependencies.ts`
- `src/app/spaghetti/features/featureDependencies.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Part-template nodes in `everything` mode can now show deterministic internal dependency wires for existing driver-to-feature and feature-to-feature relationships when `Show internal wiring` is enabled.
- Collapsed and compact node modes remain unchanged and do not render the internal dependency overlay.
- Disabled or ineffective features remain visible in the feature stack and dependency visualization without changing compile/runtime behavior.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [105] - 2026-03-05 18:35 - `FS - Phase 14 - Feature Stack Expansion And Dependency Visualization - Core Operations Expansion`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added generic feature-stack enabled-state support with backward-compatible default enable behavior for legacy stored features. Introduced shared feature dependency analysis so compile, validation, diagnostics, and reorder guards all use the same prior-enabled-feature ordering rules.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept the FS-1 solid/artifact contract unchanged.
- Kept selector-driven UI flow unchanged.
- Added no multi-part support, boolean operations, sketch solver tooling, or alternate geometry pipelines.

#### Summary of Implementation
- Added generic feature-stack enabled-state support with backward-compatible default enable behavior for legacy stored features.
- Introduced shared feature dependency analysis so compile, validation, diagnostics, and reorder guards all use the same prior-enabled-feature ordering rules.
- Hardened `compileFeatureStack` to emit deterministic IR from the effective enabled feature order only, while preserving feature ids and current runtime payload shape.
- Added commit-boundary feature editing actions for move-up, move-down, and enable/disable in the Spaghetti store, with deterministic rejection of dependency-breaking reorders.
- Updated the feature stack UI to expose row-level Up/Down and Enable/Disable controls while keeping disabled features visible and locally editable in place.
- Preserved Cubeï¿½s existing render path while ensuring disabled or misordered feature dependencies resolve as unresolved through the current compile/runtime/artifact pipeline.

#### Files Changed
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/featureDependencies.ts`
- `src/app/spaghetti/features/featureDependencies.test.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/app/spaghetti/features/diagnostics.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/theme/v15Theme.css`
- `src/worker/cad/featureStackRuntime.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Feature stacks now support deterministic feature enable/disable state without changing graph topology or the existing render pipeline.
- Feature reorders are allowed only when they preserve valid enabled-feature dependency ordering.
- Disabled features remain visible in the stack UI but are excluded from compiled/runtime feature execution.
- Cube remains renderable through the existing FS-1 pipeline, and disabling its extrude feature leaves it unresolved at runtime instead of producing a render artifact.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [104] - 2026-03-05 18:17 - `FS - Phase 14 - Feature Stack Expansion And Dependency Visualization - Build Stats And Cache Integration`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a shared deterministic build-stats key helper so spaghetti builds derive canonical source/build part rows from the same profile patch content already sent to the worker. Narrowed spaghetti build request translation to a minimal profile patch and carried forward a canonical partKeys list for stats seeding, keeping cube keyed by build identity rather than preview slot identity.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept the FS-1 solid/artifact contract unchanged.
- Kept title-bar stats panel expand/collapse behavior unchanged.
- Added no new node types, geometry features, cache-engine redesign, or multi-part support.

#### Summary of Implementation
- Added a shared deterministic build-stats key helper so spaghetti builds derive canonical source/build part rows from the same profile patch content already sent to the worker.
- Narrowed spaghetti build request translation to a minimal profile patch and carried forward a canonical `partKeys` list for stats seeding, keeping `cube` keyed by build identity rather than preview slot identity.
- Extended app build wiring so `BuildDispatcher` resets stats rows from a provider-driven canonical part-key list, preserving legacy ordering while letting spaghetti builds seed rows like `cube` plus `assembled`.
- Updated worker build progress routing so spaghetti builds emit part progress/cache rows for canonical spaghetti part keys derived from the payload, with `assembled` remaining last.
- Scoped cache/progress routing changes so `sp_*` changed ids invalidate the relevant spaghetti row set without redesigning cache semantics.
- Added deterministic regression coverage for shared key derivation, spaghetti build request translation, dispatcher row seeding, and worker progress/cache output.

#### Files Changed
- `src/shared/buildStatsKeys.ts`
- `src/shared/buildStatsKeys.test.ts`
- `src/app/buildDispatcher.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- `src/worker/pipeline/paramRouting.ts`
- `src/worker/pipeline/signatures.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The Build Stats panel now shows spaghetti build rows using canonical source/build identity such as `cube`, instead of falling back to the legacy fixed row list for spaghetti builds.
- Repeated unchanged spaghetti builds now surface deterministic cache-hit rows aligned with the same canonical spaghetti part keys that drive viewport-visible artifacts.
- Legacy build stats ordering remains unchanged, and `assembled` still appears as the final row.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [103] - 2026-03-05 18:08 - `SP - Phase 5 - Spaghetti Window And Layout Foundations - Split Resize Ownership Fix`
<!-- ============================================================ -->
HUMAN SUMMARY: `Moved the vertical resize handle behavior from SpaghettiEditor into SpaghettiPanel, where the actual header-versus-canvas split is defined. Changed the resize logic to control the canvas wrap height directly so dragging the handle now shrinks the expanded header block instead of only resizing content inside the canvas region.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti panel/editor layout and resize ownership.

#### Summary of Implementation
- Moved the vertical resize handle behavior from `SpaghettiEditor` into `SpaghettiPanel`, where the actual header-versus-canvas split is defined.
- Changed the resize logic to control the canvas wrap height directly so dragging the handle now shrinks the expanded header block instead of only resizing content inside the canvas region.
- Tightened the header block flex rules so the expanded header can collapse into its own scrollbar while the lower editor area grows.
- Removed the old inner-editor resize state and handle ownership from `SpaghettiEditor`.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Dragging the resize bar now resizes the actual panel split between the collapsible header section and the lower editor/canvas section.
- With the header expanded, the handle can move through space that was previously blocked because the header now shrinks and scrolls instead of staying fixed above the editor.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [102] - 2026-03-05 18:04 - `SP - Phase 5 - Spaghetti Window And Layout Foundations - Minimum Height Reduction`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reduced the Spaghetti editor minimum manual resize height from 280px to 100px. Preserved the existing top resize handle behavior and bottom-anchored editor layout while allowing the handle to move higher.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti editor resize clamp behavior.

#### Summary of Implementation
- Reduced the Spaghetti editor minimum manual resize height from `280px` to `100px`.
- Preserved the existing top resize handle behavior and bottom-anchored editor layout while allowing the handle to move higher.

#### Files Changed
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The Spaghetti editor can now be resized much shorter before the top handle hits its minimum-height stop.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [101] - 2026-03-05 17:57 - `SP - Phase 5 - Spaghetti Window And Layout Foundations - Header Scroll Relocation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Moved the scrollable overflow region up from the expanded editor toolbar area into the collapsible Spaghetti panel header block. Added a dedicated header scroll container so the section beginning at How To Use Spaghetti Editor scrolls independently when the panel is short.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti panel/editor layout behavior.

#### Summary of Implementation
- Moved the scrollable overflow region up from the expanded editor toolbar area into the collapsible Spaghetti panel header block.
- Added a dedicated header scroll container so the section beginning at `How To Use Spaghetti Editor` scrolls independently when the panel is short.
- Removed the expanded-toolbar scrollbar so the lower editor controls and canvas region remain separate from the header scroll behavior.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- When the Spaghetti panel header is expanded, the help/sample/compile/status section now owns the scrollbar.
- The expanded/collapsed mode controls and canvas area no longer show that scrollbar.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [100] - 2026-03-05 17:49 - `SP - Phase 5 - Spaghetti Window And Layout Foundations - Minimum Width Tightening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reduced the floating Spaghetti editor minimum width in AppShell from 560 to 320. Tightened the minimum window width so the editor can shrink to roughly the same width footprint as the top-left ParaHook Generator v20 title bar region.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to floating Spaghetti editor window sizing behavior.

#### Summary of Implementation
- Reduced the floating Spaghetti editor minimum width in `AppShell` from `560` to `320`.
- Tightened the minimum window width so the editor can shrink to roughly the same width footprint as the top-left `ParaHook Generator v20` title bar region.

#### Files Changed
- `src/app/AppShell.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The floating Spaghetti editor can now be resized narrower before hitting its minimum width limit.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [099] - 2026-03-05 17:43 - `SP - Phase 5 - Spaghetti Window And Layout Foundations - Vertical Resize Handle`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a drag handle above the Spaghetti editor content so users can resize the full editor block vertically from its top edge while keeping it bottom-anchored. Implemented pointer-driven editor-height resizing in SpaghettiEditor with minimum-height and parent-height clamping.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti editor layout/UI behavior.

#### Summary of Implementation
- Added a drag handle above the Spaghetti editor content so users can resize the full editor block vertically from its top edge while keeping it bottom-anchored.
- Implemented pointer-driven editor-height resizing in `SpaghettiEditor` with minimum-height and parent-height clamping.
- Added double-click reset behavior on the resize bar to restore the default flexible editor height.
- Added scrollable editor-body behavior so header controls and canvas remain reachable when the editor is resized shorter.
- Styled the resize control as a dedicated top splitter/grab bar inside the Spaghetti editor shell.

#### Files Changed
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The Spaghetti editor block can now be manually dragged taller or shorter from a top resize bar while staying anchored to the bottom of its panel.
- When the editor is resized smaller than its content, the editor body scrolls instead of clipping the header/canvas controls.
- Default behavior remains unchanged until the user drags the handle; double-click resets the manual height.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [098] - 2026-03-05 17:28 - `FS - Phase 13 - Feature Stack Solid Contract Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked src/shared/buildTypes.ts as the canonical solid artifact contract and made PartArtifact require partKey and partKeyStr. Added shared artifact identity helpers for canonical part-key parsing, validation, and viewer-part wrapping.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept selector-driven preview/viewer flow unchanged.
- Added no new geometry kinds, multi-part support, booleans, or graph architecture changes.

#### Summary of Implementation
- Locked `src/shared/buildTypes.ts` as the canonical solid artifact contract and made `PartArtifact` require `partKey` and `partKeyStr`.
- Added shared artifact identity helpers for canonical part-key parsing, validation, and viewer-part wrapping.
- Collapsed `src/shared/partsTypes.ts` onto the canonical shared contract so the repo no longer carries a second competing `PartArtifact` definition.
- Formalized preview resolution as `slotId -> sourceNodeId -> sourcePartKeyStr -> PartArtifact` in the OutputPreview selector path.
- Removed the preview-time `partKeyStr` rewrite and replaced it with explicit slot-scoped `viewerKey` metadata while preserving source artifact identity.
- Updated `ViewerHost` and `Viewer` to consume slot-keyed viewer entries with canonical artifacts, keeping spaghetti-mode slot visibility/selection behavior unchanged.
- Tightened build-result validation to treat current worker artifacts as canonical instead of optional/best-effort identity payloads.
- Added deterministic regression coverage for the shared artifact contract, preview slot/source mapping, and repeated graph-produced Cube artifact builds.

#### Files Changed
- `src/shared/buildTypes.ts`
- `src/shared/buildTypes.test.ts`
- `src/shared/partsTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/parts/partKeyResolver.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.test.ts`
- `src/viewer/Viewer.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/stageAssembler.ts`
- `src/worker/products/foothook/parts/baseplate.ts`
- `src/worker/products/foothook/parts/heelKick.ts`
- `src/worker/products/foothook/parts/toeHook.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Preview slot identity now stays explicit as `viewerKey` instead of being encoded by mutating `PartArtifact.partKeyStr`.
- Canonical artifacts retain source part identity all the way into preview/viewer flow.
- Spaghetti-mode slot visibility, selection, and unresolved-slot exclusion behavior remain unchanged.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [097] - 2026-03-05 17:10 - `FS - Phase 12 - First Renderable Part Through Existing Part Pipeline`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added Part/CubeProof as a minimal cube-aligned proof node with a deterministic rectangle-to-extrude default Feature Stack and the existing OutputPreview-consumable output kind. Extended compile-time part ownership so PART_NODE_SPECS and computeFeatureStackIrParts() map Part/CubeProof to cubeProof.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept selector-driven preview/viewer flow unchanged.
- Added no parallel mesh-output architecture, scripting nodes, or subgraph/container systems.

#### Summary of Implementation
- Added `Part/CubeProof` as a minimal cube-aligned proof node with a deterministic rectangle-to-extrude default Feature Stack and the existing OutputPreview-consumable output kind.
- Extended compile-time part ownership so `PART_NODE_SPECS` and `computeFeatureStackIrParts()` map `Part/CubeProof` to `cubeProof`.
- Documented the two critical path handoffs:
  - part node type to compile-owned `partKey`
  - OutputPreview slot edge to `nodeId -> partKey -> artifact` lookup
- Narrowed worker-side bridging to the existing pipeline:
  - reused `sp_featureStackIR` execution in the worker runtime
  - derived deterministic bounds from runtime geometry
  - emitted graph-produced `cubeProof` output as the existing `PartArtifact { kind: 'box', params }` envelope
- Relaxed shared/app-side artifact validation just enough to accept non-legacy graph-produced part ids like `cubeProof`, while preserving legacy build ordering behavior.
- Added deterministic compile/runtime/selector coverage for the proof part and preserved DR-1 unresolved-slot preview exclusion behavior.

#### Files Changed
- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/parts/partKeyResolver.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Graph-produced `cubeProof` parts now flow through the existing `PartArtifact -> OutputPreview -> selector -> ViewerHost` path.
- Missing proof-part artifacts remain excluded from preview rendering while slot connectivity behavior stays unchanged.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [096] - 2026-03-05 15:37 - `VM - Phase 5 - Selector Contract Hardening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Standardized selector access through src/app/spaghetti/selectors/index.ts and expanded barrel exports for hardened VM contracts/types. Hardened selector contracts and identities.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Added no new node types or geometry features.
- Limited this phase to selector contract hardening and UI import/consumption cleanup.

#### Summary of Implementation
- Standardized selector access through `src/app/spaghetti/selectors/index.ts` and expanded barrel exports for hardened VM contracts/types.
- Hardened selector contracts and identities:
  - `selectNodeVm` now emits full `NodeVm` metadata used by canvas/node rendering (title/template/ports/sections/row-group metadata) with stable `nodeId`.
  - `selectDriverVm` now emits stable `DriverRowVm` identities (`rowId` + `paramId` where applicable) and section-grouped row identity data.
  - `selectPreviewRenderVm` now emits `PreviewRenderVm` (`items` + `viewerParts`) with stable preview ids and viewer-ready artifacts.
  - `selectDiagnosticsVm` now emits stable diagnostics items with deterministic `id` while preserving existing DR-1 status semantics.
- Added same-reference memoization guards across hardened selectors where safe (`selectNodeVm`, `selectDriverVm`, `selectPreviewRenderVm`, `selectDiagnosticsVm`, parts-list panel VM).
- Removed remaining target UI-local shaping from raw graph/state:
  - `SpaghettiCanvas` now passes selector-provided node display metadata to `NodeView` instead of rebuilding from node definitions in render.
  - `NodeView` now consumes selector-provided driver grouping/index metadata and selector-provided OutputPreview row identities for keys.
  - `PartsListPanel` now consumes selector-shaped panel VM (`selectPartsListPanelVm`) from barrel and no longer builds slot labels/secondary text or trailing-empty handling locally.
  - `ViewerHost` now consumes selector-provided preview VM (`viewerParts`) from barrel and no longer reshapes preview artifacts locally.
- Added selector barrel contract test plus VM snapshot coverage for Node/Driver/Preview/Diagnostics contracts.

#### Files Changed
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.ts`
- `src/app/spaghetti/selectors/selectDriverVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/index.test.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.test.ts`
- `src/app/spaghetti/selectors/selectDriverVm.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/__snapshots__/selectDiagnosticsVm.test.ts.snap`
- `src/app/spaghetti/selectors/__snapshots__/selectDriverVm.test.ts.snap`
- `src/app/spaghetti/selectors/__snapshots__/selectNodeVm.test.ts.snap`
- `src/app/spaghetti/selectors/__snapshots__/selectPreviewRenderVm.test.ts.snap`
- `src/app/spaghetti/partsList/selectPartsListItems.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/WireLayer.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No feature-level behavior changes introduced.
- UI rendering now consumes hardened selector VM contracts directly for target surfaces; existing VM-1/DR-1 behavior remains preserved.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [095] - 2026-03-05 13:08 - `DR - Phase 11 - Driver Diagnostics And Invalid Wiring Visualization`
<!-- ============================================================ -->
HUMAN SUMMARY: `Extended diagnostics selector VM with deterministic edge + slot state. Kept endpoint-derived helpers secondary-only by documenting buildEndpointGroupingKey(...) for grouping/contract semantics (not diagnostics identity).`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview slot normalization invariant unchanged (exactly one trailing empty slot in graph state).
- Kept selector-driven UI integration pattern.

#### Summary of Implementation
- Extended diagnostics selector VM with deterministic edge + slot state:
  - added `edgeStatusById` keyed by stable `edgeId` identity,
  - added `slotStatus` for OutputPreview slots (`ok` / `unresolved` / `empty`),
  - added deterministic reason precedence (`missingPort > cycle > typeMismatch > unresolved > ok`) and aggregated `reasons`.
- Kept endpoint-derived helpers secondary-only by documenting `buildEndpointGroupingKey(...)` for grouping/contract semantics (not diagnostics identity).
- Updated canvas wire rendering to read diagnostics and apply dashed wire class for non-`ok` edges without changing interaction behavior.
- Updated node VM + node UI:
  - driver rows now surface warning indicators/tooltips from `edgeStatusById`,
  - OutputPreview rows now carry/render slot state and unresolved warning indicator metadata.
- Extended parts-list selector/UI with slot statuses and unresolved warning indicators while preserving panel-only trailing-empty hide behavior.
- Extended preview render selector to skip `unresolved` slots so unresolved entries remain visible in Parts List but are excluded from preview mesh rendering.
- Added deterministic tests for missing-port/type-mismatch/unresolved/cycle status classification and selector/view-model behavior.

#### Files Changed
- `src/app/spaghetti/selectors/selectDiagnosticsVm.ts`
- `src/app/spaghetti/contracts/endpoints.ts`
- `src/app/spaghetti/canvas/WireLayer.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.ts`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Non-`ok` edges now render dashed in Spaghetti canvas.
- Driver rows with non-`ok` driver-input edges now show warning indicators and tooltip diagnostics.
- OutputPreview slot state is explicitly represented as `ok` / `unresolved` / `empty`.
- Preview rendering now skips slots marked `unresolved`; unresolved slots remain visible in Parts List UI.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [094] - 2026-03-05 12:13 - `GE - Phase 10 - Contract Lock - Resolver Validator Canvas Parity`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added shared endpoint contract module at src/app/spaghetti/contracts/endpoints.ts. Rewired canvas cheap-check (validateConnectionCheap) to call shared contract only.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` behavior.
- Did not change OutputPreview invariants.
- Added no topology mutation in evaluator/selector/render/compile paths.
- Kept topology mutation limited to graph commands + deterministic normalization.

#### Summary of Implementation
- Added shared endpoint contract module at `src/app/spaghetti/contracts/endpoints.ts`:
  - driver alias canonicalization (`drv:*`/`drv:in:*` to canonical `out:drv:*`/`in:drv:*`)
  - node-type-aware canonicalization entrypoint
  - canonical endpoint key builder with driver-input param-level collapse for max-connection counting
  - unified endpoint resolver using effective ports + registry defs
  - unified `validateConnectionContract(...)` with deterministic code outcomes for port/path/type/max rules.
- Rewired canvas cheap-check (`validateConnectionCheap`) to call shared contract only:
  - preserved driver input auto-replace drop semantics via projected-edge validation using `planConnectEdgeWithAutoReplace`
  - standardized UI rejection messaging from shared reason codes.
- Rewired `validateGraph` connection decisions to shared contract:
  - added `validateGraphConnectionDecision(...)` test helper export
  - preserved cycle exclusion behavior for feature/driver path-unsupported and feature same-node unsupported edges
  - preserved deterministic edge iteration and diagnostics ordering behavior.
- Updated driver input auto-replace target keying to use shared canonical endpoint key helper.
- Added CT-1 parity test suite asserting canvas cheap-check and validator contract decision agreement (`ok` + `code`) across driver aliases, mixed alias counting behavior, unit mismatch, OutputPreview dynamic slot ports, feature virtual ports, and composite leaf-path rules.

#### Files Changed
- `src/app/spaghetti/contracts/endpoints.ts`
- `src/app/spaghetti/contracts/contractParity.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/driverInputAutoReplace.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Canvas cheap-check now derives rejection codes/messages from the shared contract engine used by `validateGraph`.
- Driver-input drop validation remains replace-friendly by validating projected post-auto-replace topology before command commit.
- Validator and canvas now share deterministic endpoint resolution/canonicalization and connection decision codes, reducing parity drift risk.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [093] - 2026-03-05 11:48 - `VM - Phase 4 - Derived View Model Selectors`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added pure deterministic selector layer under src/app/spaghetti/selectors/. Refactored SpaghettiCanvas node render-data derivation to use selectNodeVm via useMemo, removing large inline derivation logic.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` behavior.
- Did not change OutputPreview behavior/invariants.
- Added no topology mutation in selectors.
- Kept UI integration incremental with selector-backed derivation in existing render flow.

#### Summary of Implementation
- Added pure deterministic selector layer under `src/app/spaghetti/selectors/`:
  - `selectNodeVm` for node-card derived rows/details/composite input state and driver VM assembly.
  - `selectDriverVm` for driven driver row state and numeric offset/effective derivation.
  - `selectPreviewRenderVm` as OP-5 parity wrapper with `isReady` metadata.
  - `selectDiagnosticsVm` for merged/stable/grouped diagnostics VM.
- Refactored `SpaghettiCanvas` node render-data derivation to use `selectNodeVm` via `useMemo`, removing large inline derivation logic.
- Routed cycle-check diagnostics grouping through `selectDiagnosticsVm` (pure derived-only usage).
- Updated viewer preview wiring to use `selectPreviewRenderVm` while preserving render contract.
- Added selector test coverage for deterministic ordering, offset-mode correctness, OP-5 parity, stable diagnostics ordering, and idempotence.

#### Files Changed
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectDriverVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.ts`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/selectDriverVm.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/components/ViewerHost.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No topology/runtime protocol changes.
- UI derivation logic is now selector-backed, improving determinism and testability with behavior parity preserved.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [092] - 2026-03-05 11:28 - `GE - Phase 9 - Graph Command Kernel`
<!-- ============================================================ -->
HUMAN SUMMARY: `Introduced centralized graph command kernel under src/app/spaghetti/graphCommands/ with pure (graph) => nextGraph commands. Added applyGraphCommand(cmd) to useSpaghettiStore and wired it through existing normalization (normalizeGraphForStoreCommit) and waypoint pruning.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` behavior.
- Did not modify OutputPreview behavior/invariants.
- Added no new node types.
- Kept UI refactor minimal by replacing topology mutations with graph command calls.
- Preserved deterministic command behavior and post-command normalization flow.

#### Summary of Implementation
- Introduced centralized graph command kernel under `src/app/spaghetti/graphCommands/` with pure `(graph) => nextGraph` commands:
  - `addNode`, `removeNode`, `addEdge`, `removeEdge`, `replaceEdge`, `setNodeParams`, `setNodePosition`
  - `connectEdgeWithAutoReplace` + `planConnectEdgeWithAutoReplace` wrapper around driver input auto-replace planning.
- Added `applyGraphCommand(cmd)` to `useSpaghettiStore` and wired it through existing normalization (`normalizeGraphForStoreCommit`) and waypoint pruning.
- Updated store legacy `addEdge`/`removeEdge` methods to route topology changes via graph commands.
- Refactored canvas topology writes to command calls:
  - wire connect/replace now uses `planConnectEdgeWithAutoReplace` + `connectEdgeWithAutoReplace`
  - edge detach/delete now uses `removeEdge` command via `applyGraphCommand`
  - node add now uses `addNode` command via `applyGraphCommand`
- Refactored `SpaghettiEditor` node add flow to use `addNode` command.
- Added command-layer tests covering add/remove node/edge, auto-replace connect behavior, determinism, and OutputPreview non-deletable invariant through store command+normalization path.

#### Files Changed
- `src/app/spaghetti/graphCommands/types.ts`
- `src/app/spaghetti/graphCommands/addNode.ts`
- `src/app/spaghetti/graphCommands/removeNode.ts`
- `src/app/spaghetti/graphCommands/addEdge.ts`
- `src/app/spaghetti/graphCommands/removeEdge.ts`
- `src/app/spaghetti/graphCommands/replaceEdge.ts`
- `src/app/spaghetti/graphCommands/setNodeParams.ts`
- `src/app/spaghetti/graphCommands/setNodePosition.ts`
- `src/app/spaghetti/graphCommands/connectEdgeWithAutoReplace.ts`
- `src/app/spaghetti/graphCommands/index.ts`
- `src/app/spaghetti/graphCommands/graphCommands.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Topology mutations are now centralized through graph command functions plus store commit normalization.
- Existing user-facing behavior is preserved; OutputPreview singleton invariant remains enforced after command commits.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [091] - 2026-03-05 11:13 - `DR - Phase 10 - Driven Numeric Driver Offset Mode`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added optional part-node param metadata for driven numeric offsets. Extended store commit normalization to.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` implementation files.
- Did not modify OutputPreview behavior/invariants.
- Introduced no new node types.
- Kept topology mutations out of evaluation/selector/render/compile paths; normalization-only params patching used.
- Did not auto-delete edges for unresolved/invalid driver states.

#### Summary of Implementation
- Added optional part-node param metadata for driven numeric offsets:
  - `driverOffsetByParamId?: Record<string, number>`
  - `driverDrivenByParamId?: Record<string, true>`
- Extended store commit normalization to:
  - detect driven numeric nodeParam drivers via whole-port `in:drv:*` / `drv:in:*` incoming edges,
  - initialize missing numeric offsets to `0` on first driven state,
  - canonicalize and persist `driverDrivenByParamId` for currently driven numeric params,
  - preserve existing offsets on disconnect while clearing stale driven markers.
- Updated driver virtual output resolution so numeric `out:drv:*` emits:
  - base value when not driven,
  - `base + offset` when `driverDrivenByParamId[paramId] === true`.
- Extended driver VM contract for numeric rows with driven offset mode data:
  - `DriverNumberChange` now supports `kind: 'nodeParamOffset'`,
  - numeric rows can expose `offsetMode`, `drivenValue`, `offsetInput`, and `effectiveValue`.
- Updated canvas render data + driver edit path:
  - derives numeric driven/effective values from evaluation + stored offset,
  - patches `params.driverOffsetByParamId[paramId]` for offset edits.
- Updated numeric driver row UI:
  - non-driven numeric rows unchanged,
  - driven numeric rows show read-only driven value, editable offset control, and read-only effective value,
  - unresolved driven behavior remains intact with unresolved messaging.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Driven numeric driver virtual outputs now emit effective values (`driven + offset`) when driven metadata is present.
- Numeric driver rows in driven mode now expose an editable local offset and read-only effective readout.
- Driven-but-unresolved behavior remains unresolved; offset is not applied in unresolved state.
- Non-numeric drivers and non-driven numeric drivers retain prior behavior.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [090] - 2026-03-05 01:22 - `DOC - Phase 4 - Roadmap Restore - Previous Tree-Backed Layout`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reverted docs/roadmap.md from the condensed execution-queue format back to the prior version. Restored the full trailing history tree and hierarchy sections that were previously present at the end of the file.`

#### Scope / Constraints Honored
- Documentation-only rollback of roadmap structure.
- No source/runtime/schema/protocol changes.
- Preserved existing changelog entries without edits.

#### Summary of Implementation
- Reverted `docs/roadmap.md` from the condensed execution-queue format back to the prior version.
- Restored the full trailing history tree and hierarchy sections that were previously present at the end of the file.
- Preserved prior track ordering and checklist content in the restored roadmap format.

#### Files Changed
- `docs/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Roadmap document returns to the prior tree-inclusive presentation.

#### Verification Steps
- Reviewed `docs/roadmap.md` and confirmed `## History Tree` and trailing hierarchy content are present.
- Confirmed new changelog section inserted at top with next sequential index `[065]`.

<!-- ============================================================ -->
### [089] - 2026-03-05 01:21 - `DR - Phase 9 - Canonical Driver ID Contract`
<!-- ============================================================ -->
HUMAN SUMMARY: `Switched canonical driver virtual port IDs to. Preserved dual-read compatibility for legacy aliases.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph` or `evaluateGraph` implementation files.
- Did not modify OutputPreview behavior/invariants.
- No new node types introduced.
- Limited canvas changes to minimal driver-wire exposure/parity paths.

#### Summary of Implementation
- Switched canonical driver virtual port IDs to:
  - input: `in:drv:<paramId>`
  - output: `out:drv:<paramId>`
- Preserved dual-read compatibility for legacy aliases:
  - `drv:in:<paramId>`
  - `drv:<paramId>`
- Updated driver virtual port helpers to parse both canonical + legacy forms, emit canonical builders, and provide canonicalization helpers.
- Updated canvas driver-row port mapping to bind by parsed `paramId` (`rowId = drv:<paramId>`) and prefer canonical ports when both aliases are present.
- Updated driver-input auto-replace endpoint keying so canonical/legacy driver-input aliases collapse to one logical replace target.
- Updated full validator endpoint counting to canonicalize driver-input endpoint keys so mixed alias edges respect the single-connection contract.
- Expanded tests to cover canonical contract, compatibility aliases, unit mismatch rejection for `in:drv:*`, and mixed-alias max-connection behavior.

#### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/driverInputAutoReplace.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/features/effectivePorts.test.ts`
- `src/app/spaghetti/canvas/driverInputAutoReplace.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- New canonical IDs are now first-class for driver virtual wiring:
  - `out:drv:*` for driver outputs
  - `in:drv:*` for driver inputs
- Legacy IDs remain accepted for backwards compatibility.
- Mixed canonical/legacy driver-input aliases now resolve as one logical endpoint for max-connection enforcement/auto-replace semantics.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [088] - 2026-03-05 01:15 - `DOC - Phase 3 - Roadmap Reorganization - Execution Queue And Track Consolidation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Replaced docs/roadmap.md with a focused working roadmap structure. Aligned current priorities with recent logs.`

#### Scope / Constraints Honored
- Documentation-only update.
- No source code, schema, runtime, worker, or protocol changes.
- Preserved historical implementation detail in existing changelog/archive docs.

#### Summary of Implementation
- Replaced `docs/roadmap.md` with a focused working roadmap structure:
  - explicit `Now`, `Next`, and `After Next` execution queue,
  - grouped active tracks by delivery concern (driver wiring, geometry/feature stack, sketch reliability, architecture hardening),
  - separated recently completed milestones from open work,
  - moved long-form history out of the working document via reference pointers.
- Aligned current priorities with recent logs:
  - OutputPreview track marked complete through `OP-6.1`,
  - recent completions called out for `[060]` and `[062]`,
  - queue centered on open driver and parity work.

#### Files Changed
- `docs/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Planning workflow now has a single concise execution view with reduced duplication/noise.

#### Verification Steps
- Reviewed `docs/roadmap.md` section order and status grouping for consistency.
- Confirmed new entry inserted at top of `docs/CHANGELOG.md` with sequential index `[063]`.

<!-- ============================================================ -->
### [087] - 2026-03-04 22:12 - `GE - Phase 8 - Runtime Bridge Hardening - Tessellation Determinism And CCW Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Extracted runtime tessellation into compiler-local helper runtimeTessellation.ts and wired compileGraph to use it. Added deterministic tessellation constants and pipeline.`

#### Scope / Constraints Honored
- Kept tessellation strictly at the compile-to-worker boundary (`compileGraph` payload assembly path).
- Preserved worker protocol and runtime contract:
  - `schemaVersion` remains `1`,
  - runtime ops remain `sketch` and `extrude` only.
- Kept analytic `ProfileLoop.segments` authoritative in app state.
- Did not move tessellation into worker/runtime layers.

#### Summary of Implementation
- Extracted runtime tessellation into compiler-local helper `runtimeTessellation.ts` and wired `compileGraph` to use it.
- Added deterministic tessellation constants and pipeline:
  - canonicalize to 6 decimals,
  - epsilon-based duplicate suppression (`EPSILON = 1e-6`) after canonicalization,
  - closure snap after full segment emission,
  - CCW enforcement using open-ring signed area with implicit closing edge.
- Implemented closure behavior to avoid synthetic close-point appends while normalizing near-closure deterministically.
- Added compile payload determinism test for curved `sketch -> closeProfile -> extrude` fixture:
  - byte-identical payload JSON across runs,
  - `schemaVersion` lock,
  - runtime op set lock (no emitted `closeProfile` op),
  - CCW/non-negative loop area assertion.
- Added focused tessellation unit tests for epsilon join suppression, closure snap/no double-close, CCW enforcement, and repeat determinism.

#### Files Changed
- `src/app/spaghetti/compiler/runtimeTessellation.ts`
- `src/app/spaghetti/compiler/runtimeTessellation.test.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Runtime sketch vertices emitted by compile-time tessellation are now epsilon-hardened and canonicalized deterministically.
- Near-closure endpoints are snapped deterministically; runtime payload remains worker-compatible with unchanged schema/op set.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/compiler/runtimeTessellation.test.ts src/app/spaghetti/compiler/compileGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed and build succeeded.

<!-- ============================================================ -->
### [086] - 2026-03-04 22:01 - `GE - Phase 8 - Runtime Bridge Hardening - Added Next-Task Changelog Entry`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added changelog tracking entry for the queued Phase 4A runtime bridge task. No runtime behavior changes.`

#### Scope / Constraints Honored
- Documentation-only update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.

#### Summary of Implementation
- Added changelog tracking entry for the queued Phase 4A runtime bridge task:
  - analytic `ProfileLoop.segments` bridge to runtime vertex loops,
  - tessellation at compile-to-runtime boundary only,
  - runtime ops contract remains `sketch` + `extrude`.

#### Files Changed
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Change tracking now includes the Phase 4A runtime bridge next task.

#### Verification Steps
- Reviewed `docs/listofchanges.md` for format consistency and sequential section index (`[061]`).

<!-- ============================================================ -->
### [085] - 2026-03-04 20:57 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Expand Extrude Taper And Offset Inputs`
<!-- ============================================================ -->
HUMAN SUMMARY: `Expanded feature virtual input contract from Extrude.depth only to Extrude.depth, Extrude.taper, and Extrude.offset. Added deterministic virtual ID/type handling for.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- Resolver remains single source of truth across validator/canvas/evaluator/UI.
- NodeView remains generic.

#### Summary of Implementation
- Expanded feature virtual input contract from `Extrude.depth` only to `Extrude.depth`, `Extrude.taper`, and `Extrude.offset`.
- Added deterministic virtual ID/type handling for:
  - `fs:in:<featureId>:extrude:depth` (`number:mm`)
  - `fs:in:<featureId>:extrude:taper` (`number:deg`)
  - `fs:in:<featureId>:extrude:offset` (`number:mm`)
- Added optional extrude params `taper`/`offset` using locked literal defaults `{ kind: 'lit', value: 0 }`.
- Added validator + cheap-check parity for feature virtual path rejection with `FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED`.
- Extended compile/evaluate flow so taper/offset overrides are deterministic and IR extrude fields are always present:
  - `depthResolved`, `taperResolved`, `offsetResolved`.
- Extended extrude UI rows and wiring state for depth/taper/offset with driven lock + unresolved behavior consistency.
- Added/updated tests for virtual ports, validation parity, evaluate determinism, compile overrides/defaults, and UI rendering behavior.

#### Files Changed
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/featureVirtualPorts.ts`
- `src/app/spaghetti/features/featureVirtualPorts.test.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Users can now wire into extrude taper/offset feature params using feature virtual inputs.
- Feature virtual inputs remain whole-port only; path-based connections are explicitly rejected.
- Occupied `fs:in:*` endpoints still reject in cheap-check (`maxConnectionsIn = 1`), unchanged from feature input contract.
- Compiled extrude IR now always includes deterministic resolved numeric fields for taper and offset.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
### [084] - 2026-03-04 20:33 - `DOC - Phase 2 - Node Tasking And Checklist Support - Renumber Tasklist Sections`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md section numbering to resolve duplicate 7 and increment subsequent sections. Applied requested sequence adjustment.`

#### Scope / Constraints Honored
- Documentation-only update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.
- Preserved changelog format and top-insert ordering.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` section numbering to resolve duplicate `7` and increment subsequent sections.
- Applied requested sequence adjustment:
  - second `7` -> `8`,
  - all following section numbers incremented by `+1`.
- Resulting section sequence from that point is now monotonic and unambiguous.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Tasklist numbering/readability improved.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` headings to confirm corrected numbering order.
- Confirmed new changelog entry inserted at top with next sequential index `[059]`.

<!-- ============================================================ -->
### [083] - 2026-03-04 20:28 - `DOC - Phase 2 - Node Tasking And Checklist Support - Update Phase 2C v2.1 Status`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md to add Phase 2C v2.1 (Driver Input Auto-Replace) as implemented. Added completed checklist items for.`

#### Scope / Constraints Honored
- Documentation-only checklist update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes in this step.
- Preserved existing changelog format and reverse-chronological insertion.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to add Phase 2C v2.1 (`Driver Input Auto-Replace`) as implemented.
- Added completed checklist items for:
  - scoped auto-replace on `drv:in:*`,
  - duplicate-drop no-op behavior,
  - deterministic replace/heal semantics,
  - whole-port endpoint-key lock,
  - cycle check enforcement at final drop commit.
- Renumbered downstream sections to keep sequence consistent:
  - Feature wiring expansion moved to section 10,
  - Phase 3 moved to section 11,
  - Quality gates moved to section 12.
- Added Phase 2C v2.1 full regression gate completion line.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Planning/checklist documents now reflect Phase 2C v2.1 completion.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for section numbering, status marks, and quality-gate alignment with implemented work.
- Confirmed changelog entry inserted at top with next sequential index `[058]`.

<!-- ============================================================ -->
### [082] - 2026-03-04 20:26 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Driver Input Auto-Replace`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented deterministic auto-replace planning for driver virtual input targets (drv:in:*) via a new pure helper module. Added whole-port endpoint-key lock for driver virtual inputs.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- Resolver remains the single source of truth for endpoint typing/availability.
- `maxConnectionsIn` contract for `drv:in:*` remains 1 in final graph state.
- NodeView remained generic (no part-type UI branching added).

#### Summary of Implementation
- Implemented deterministic auto-replace planning for driver virtual input targets (`drv:in:*`) via a new pure helper module.
- Added whole-port endpoint-key lock for driver virtual inputs:
  - endpoint matching ignores path component and uses empty normalized path key.
- Added drop-time replacement semantics:
  - exact duplicate drop on clean occupied target is a no-op (existing edge preserved),
  - otherwise remove all existing incoming edges on same driver endpoint and append one new edge,
  - cycle checks run against the final candidate graph before commit.
- Updated canvas drop commit to use one atomic `applyGraphPatch` for replacement (remove+add together).
- Updated cheap-check semantics for occupied `drv:in:*` targets:
  - allowed when type/unit/path checks pass (replace-allowed),
  - path/type/unit invalid cases still reject as before.
- Added tests for endpoint-key behavior, replacement/no-op/healing logic, and cheap-check scope lock for occupied driver targets.

#### Files Changed
- `src/app/spaghetti/canvas/driverInputAutoReplace.ts` (new)
- `src/app/spaghetti/canvas/driverInputAutoReplace.test.ts` (new)
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Dropping a new compatible wire onto an occupied `drv:in:<paramId>` now replaces prior incoming edge(s) deterministically (`last drop wins`).
- Dropping the exact same connection again on a clean occupied driver input is now a no-op.
- Occupied non-driver inputs continue to enforce max-connection rejection in cheap-check.
- Cycle rejection still occurs at final drop commit (cheap-check still does not perform cycle checks).

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/driverInputAutoReplace.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
### [081] - 2026-03-04 20:13 - `DOC - Phase 2 - Node Tasking And Checklist Support - Update Phase 2C v2 Status`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md to mark Phase 2C v2 (Wire -> Driver) as implemented. Added explicit completed checklist coverage for.`

#### Scope / Constraints Honored
- Documentation-only update for task tracking/checklists.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.
- Preserved existing changelog format and reverse-chronological insertion.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to mark Phase 2C v2 (Wire -> Driver) as implemented.
- Added explicit completed checklist coverage for:
  - strict `drv:in:<paramId>` virtual input contract,
  - path-rejection parity code `DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED`,
  - driven-unresolved lock semantics and parity tests.
- Added Phase 2C v2 regression quality gate completion (`test` + `build` passing).
- Updated `docs/tasks/master-tasks.md` to reflect current state:
  - moved current priority to Phase 2B v2+ expansion work,
  - refreshed active/backlog items,
  - added completed milestones for Phase 2A, 2C v1, and 2C v2.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/tasks/master-tasks.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Project planning/checklist documents now reflect current implementation status.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for phase status and checklist consistency.
- Reviewed `docs/tasks/master-tasks.md` for synchronized priority/active/backlog/completed state.
- Confirmed changelog entry inserted at top with next sequential index `[056]`.

<!-- ============================================================ -->
### [080] - 2026-03-04 20:08 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Driver Virtual Inputs`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added driver virtual input contract for Part nodeParam drivers. Extended effective input resolver to include driver virtual inputs after declared and feature virtual inputs.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag/drop redesign.
- Kept NodeView generic (row-metadata-driven; no part-type branching).
- Preserved resolver parity across validator, cheap-check, evaluator, and UI pin rendering.

#### Summary of Implementation
- Added driver virtual input contract for Part nodeParam drivers:
  - `drv:in:<paramId>` with strict parser lock (`^[A-Za-z0-9_]+$`, non-empty, no extra `:`).
  - input direction, whole-port only, `maxConnectionsIn = 1`.
- Extended effective input resolver to include driver virtual inputs after declared and feature virtual inputs.
- Added deterministic path rejection for driver virtual inputs:
  - `validateGraph` emits `DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED`.
  - `validateConnectionCheap` returns matching code plus locked reason text:
    `Driver virtual inputs do not support path connections.`
- Integrated evaluation override semantics:
  - wired `drv:in:*` overrides `resolvedParams[paramId]` non-mutatively.
  - wired-but-unresolved keeps node driven/unresolved (no fallback to manual param).
  - driver virtual outputs read from resolved params, preserving deterministic order.
- Added UI wiring/render support on driver rows:
  - driver input pins + existing output pins rendered for eligible nodeParam rows.
  - driver row editor locks when driven.
  - deterministic unresolved indicator shown when driven but unresolved.
- Updated tests for parser/listing, validator parity, cheap/full parity, evaluator overrides, unresolved lock behavior, and NodeView pin/lock rendering.

#### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/features/effectivePorts.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/canvas/types.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Users can now wire `node.out -> drv:in:<paramId>` for Part nodeParam number/vec2 drivers with resolver-consistent validation.
- Driver rows can expose both input and output virtual pins; featureParam rows remain excluded.
- Driven drivers become read-only while wired.
- Wired-but-unresolved drivers remain locked and unresolved; manual param value is not silently used.
- Driver virtual input paths are deterministically rejected with parity across cheap and full validation.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/driverVirtualPorts.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/driverVm.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
### [079] - 2026-03-04 19:51 - `DOC - Phase 2 - Node Tasking And Checklist Support - Update Phase 2C v1 Status`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md to mark Phase 2C v1 Driver -> Input wiring as implemented. Marked all Phase 2C v1 checklist items complete.`

#### Scope / Constraints Honored
- Documentation-only tasklist update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler code changes in this step.
- Preserved existing changelog entry format and reverse-chronological insertion rule.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to mark Phase 2C v1 Driver -> Input wiring as implemented.
- Marked all Phase 2C v1 checklist items complete.
- Added explicit completion item for `drv:<paramId>` parser charset lock:
  - `^[A-Za-z0-9_]+$` (non-empty, no `:`).
- Restored/kept downstream future sections (`Phase 2C v2`, `Phase 2B v2+`, `Phase 3`, and quality gates) in correct order after tasklist refresh.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Project planning/task tracking now reflects Phase 2C v1 as complete.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for:
  - updated Phase 2C v1 status and items,
  - intact section ordering through sections 8-11,
  - checklist legend/difficulty format consistency.

<!-- ============================================================ -->
### [078] - 2026-03-04 19:48 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Driver ParamId Determinism Locks`
<!-- ============================================================ -->
HUMAN SUMMARY: `Hardened drv:<paramId> parsing to enforce v1 param-id charset lock. Retained single-source resolver behavior for driver virtual outputs (effectivePorts) and existing evaluator/canvas/UI integration.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag-and-drop redesign.
- Kept Phase 2C v1 scope lock: nodeParam driver outputs only; featureParam driver outputs excluded.

#### Summary of Implementation
- Hardened `drv:<paramId>` parsing to enforce v1 param-id charset lock:
  - non-empty
  - no `:`
  - regex `^[A-Za-z0-9_]+$`
- Retained single-source resolver behavior for driver virtual outputs (`effectivePorts`) and existing evaluator/canvas/UI integration.
- Added deterministic test coverage for malformed `drv:*` IDs and repeated evaluation equality for driver virtual output wiring.

#### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Malformed driver virtual output IDs (for example `drv:width-mm`, `drv:width mm`, `drv:`) are now rejected deterministically by parser/is-check.
- Deterministic driver virtual output evaluation behavior is now explicitly locked by repeat-equality test coverage.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/driverVirtualPorts.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
### [077] - 2026-03-04 19:06 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Driver Virtual Output Wiring`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added virtual driver output port module with deterministic ID contract drv:<paramId>. Extended Part driver control metadata to support explicit wireOutputType and populated it for Part nodeParam drivers.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag-and-drop redesign.
- Feature stack remains embedded in `node.params.featureStack`.
- v1 lock enforced: nodeParam drivers only (`nodeParamNumber`/`nodeParamVec2`), featureParam drivers excluded.

#### Summary of Implementation
- Added virtual driver output port module with deterministic ID contract `drv:<paramId>`.
- Extended Part driver control metadata to support explicit `wireOutputType` and populated it for Part nodeParam drivers.
- Updated effective output resolver so declared outputs and driver virtual outputs are resolved from one source.
- Updated evaluator to append driver virtual outputs into `outputsByNodeId` from canonical node param values/fallback semantics (no node compute changes).
- Updated canvas render data to expose driver output port metadata by rowId and kept cheap validation parity through shared resolver.
- Updated NodeView to render output pins on nodeParam driver rows (right-end aligned; pin remains before row move controls when present).
- Added tests for helper contract, validator/evaluator behavior, resolver parity, and UI rendering expectations.

#### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts` (new)
- `src/app/spaghetti/features/driverVirtualPorts.test.ts` (new)
- `src/app/spaghetti/features/effectivePorts.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part node nodeParam driver rows now expose wireable output pins when `wireOutputType` metadata is present.
- `drv:<paramId> -> input` edges are now resolved/validated/evaluated consistently across cheap canvas validation and full graph validation.
- Driver virtual outputs are available in evaluation output maps (for example `outputsByNodeId[nodeId]['drv:widthMm']`).
- FeatureParam drivers (for example first extrude depth) remain non-wireable in v1.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/driverVirtualPorts.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
### [076] - 2026-03-04 18:47 - `NI - Phase 4 - Node UI And Wire Layout Pass - Center Reorder Glyph`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated row reorder button text/glyph alignment to centered layout. Increased reorder button glyph size from 2px to 10px.`

#### Scope / Constraints Honored
- App-layer CSS-only UI tweak.
- No worker/protocol/scheduler changes.
- No schema/compiler/runtime behavior changes.
- No drag-and-drop changes.

#### Summary of Implementation
- Updated row reorder button text/glyph alignment to centered layout.
- Increased reorder button glyph size from `2px` to `10px`.
- Added explicit centering properties on `.SpaghettiSectionRowMoveButton`:
  - `display: inline-flex`
  - `align-items: center`
  - `justify-content: center`
  - `text-align: center`

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Up/down arrow glyphs in reorder buttons are now centered and visibly larger.

#### Verification Steps
- Confirmed CSS values in `.SpaghettiSectionRowMoveButton`:
  - `font-size: 10px`
  - centered flex alignment properties present.

<!-- ============================================================ -->
### [075] - 2026-03-04 18:46 - `NI - Phase 4 - Node UI And Wire Layout Pass - Set Reorder Button Size`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated row reorder button dimensions to requested size. Applied to .SpaghettiSectionRowMoveButton hover/non-hover selector block.`

#### Scope / Constraints Honored
- App-layer CSS style tweak only.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.
- No drag-and-drop behavior changes.

#### Summary of Implementation
- Updated row reorder button dimensions to requested size:
  - `width: 20px`
  - `height: 5px`
- Applied to `.SpaghettiSectionRowMoveButton` hover/non-hover selector block.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Reorder up/down controls now render at `20x5` size.

#### Verification Steps
- Confirmed CSS values in `.SpaghettiSectionRowMoveButton`:
  - `min-width: 20px`
  - `width: 20px`
  - `height: 5px`

<!-- ============================================================ -->
### [074] - 2026-03-04 18:46 - `NI - Phase 4 - Node UI And Wire Layout Pass - Align Output Row Reorder Controls`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated output row reorder controls to use the full-height alignment mode already used for top/bottom pinning. Output section up/down buttons now stretch/alignment-match the row container and pin top/bottom consistently instead of staying center-stacked.`

#### Scope / Constraints Honored
- App-layer UI alignment update only.
- No worker/protocol/scheduler changes.
- No schema/validation/compiler/runtime behavior changes.
- No drag-and-drop behavior changes.

#### Summary of Implementation
- Updated output row reorder controls to use the full-height alignment mode already used for top/bottom pinning.
- Output section up/down buttons now stretch/alignment-match the row container and pin top/bottom consistently instead of staying center-stacked.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Output row reorder arrows now align to full row height (top and bottom anchors), matching row container bounds.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx`
- Confirmed output row move wrapper now uses `alignToValueBar: true`.

<!-- ============================================================ -->
### [073] - 2026-03-04 18:44 - `NI - Phase 4 - Node UI And Wire Layout Pass - Pin Row Reorder Arrows`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the value-bar-aligned row move control container to stretch across the full row height. Removed offset-based positioning that pushed controls downward.`

#### Scope / Constraints Honored
- App-layer CSS alignment tweak only.
- No worker/protocol/scheduler changes.
- No schema/validation/compiler/runtime behavior changes.
- No drag-and-drop changes.

#### Summary of Implementation
- Updated the value-bar-aligned row move control container to stretch across the full row height.
- Removed offset-based positioning that pushed controls downward.
- Kept vertical `space-between` so:
  - up arrow is pinned to row top,
  - down arrow is pinned to row bottom.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Row reorder arrows now align to the top and bottom bounds of the row container instead of being offset toward the bottom.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx`
- Confirmed CSS for `.SpaghettiSectionRowMoveControls--valueBarAligned`:
  - `align-self: stretch`
  - `margin-top: 0`
  - `height: auto`
  - `min-height: 100%`
  - `justify-content: space-between`

<!-- ============================================================ -->
### [072] - 2026-03-04 18:44 - `NI - Phase 4 - Node UI And Wire Layout Pass - Resize Row Reorder Arrows`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated row reorder button dimensions from 5x5 to 8x8. Kept compact glyph sizing.`

#### Scope / Constraints Honored
- App-layer UI styling/layout update only.
- No worker/protocol/scheduler changes.
- No schema/normalization/compiler behavior changes.
- No drag-and-drop implementation changes.

#### Summary of Implementation
- Updated row reorder button dimensions from `5x5` to `8x8`.
- Kept compact glyph sizing.
- Added value-bar alignment mode for row move controls:
  - top button aligned to the top of the value-bar zone,
  - bottom button aligned to the bottom of the value-bar zone.
- Applied this alignment mode for Drivers and number-driven Inputs, while preserving centered controls for rows without value bars (for example many Outputs).

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Reorder up/down arrows are now larger (`8x8`) and vertically pinned to the value-bar bounds where applicable.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx`
- Confirmed CSS values:
  - `.SpaghettiSectionRowMoveButton` width/height `8px`
  - `.SpaghettiSectionRowMoveControls--valueBarAligned` uses `margin-top: 20px`, `height: 24px`, `justify-content: space-between`

<!-- ============================================================ -->
### [071] - 2026-03-04 18:41 - `NI - Phase 4 - Node UI And Wire Layout Pass - Shrink Row Reorder Arrow Controls`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reduced row reorder arrow control dimensions and glyph size for the SpaghettiSectionRowMoveButton style. Applied requested values.`

#### Scope / Constraints Honored
- App-layer styling update only.
- No worker/protocol/scheduler changes.
- No schema/runtime logic changes.
- No drag-and-drop or feature-stack migration changes.

#### Summary of Implementation
- Reduced row reorder arrow control dimensions and glyph size for the `SpaghettiSectionRowMoveButton` style.
- Applied requested values:
  - button size `5px x 5px`
  - `font-size: 2px`

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Reorder up/down arrow controls in Drivers/Inputs/Outputs row move UI now render at much smaller size.

#### Verification Steps
- Confirmed CSS values in `SpaghettiSectionRowMoveButton`:
  - `min-width: 5px`
  - `width: 5px`
  - `height: 5px`
  - `font-size: 2px`

<!-- ============================================================ -->
### [070] - 2026-03-04 18:40 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Row Ordering Metadata`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added partRowOrder metadata support for part params (drivers, inputs, outputs) in Part node params schemas. Added new deterministic helper module partRowOrder.ts for.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag-and-drop added.
- Feature Stack row ordering not introduced in this phase.
- NodeView kept generic (shared row-move controls, no new part-type branching logic).

#### Summary of Implementation
- Added `partRowOrder` metadata support for part params (`drivers`, `inputs`, `outputs`) in Part node params schemas.
- Added new deterministic helper module `partRowOrder.ts` for:
  - stable row ID construction (`drv:*`, `in:*`, `out:*`),
  - deterministic normalize/repair behavior,
  - section ordering application,
  - output endpoint reordering while keeping reserved output rows fixed,
  - deterministic adjacent swap + no-op metadata clearing.
- Refactored `driverVm` row IDs from index-based IDs to stable deterministic IDs.
- Integrated silent canonicalization in store normalization path (no diagnostics emitted from store).
- Integrated single-source diagnostics in `validateGraph`:
  - new warning code `partRowOrder_invalid_shape_repaired`,
  - no warning on metadata absence,
  - params validation uses repaired params for non-fatal malformed metadata handling.
- Integrated ordered VM row rendering in canvas pipeline before `NodeView` render.
- Added up/down reorder controls for Drivers/Inputs/Outputs rows in `NodeView`.
- Added deterministic persistence for row reorder operations in `SpaghettiCanvas`:
  - initializes from current natural order when metadata absent,
  - applies pure adjacent swaps,
  - clears section metadata when returning to natural order,
  - removes `partRowOrder` when all sections are empty/undefined.

#### Files Changed
- `src/app/spaghetti/parts/partRowOrder.ts`
- `src/app/spaghetti/parts/partRowOrder.test.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part VM rows now have stable deterministic IDs used for ordering metadata.
- Part nodes can persist per-section row ordering in `params.partRowOrder`.
- Invalid `partRowOrder` shapes are repaired deterministically; warning emitted only from `validateGraph` with code `partRowOrder_invalid_shape_repaired`.
- Drivers/Inputs/Outputs rows can be reordered via up/down controls; ordering is deterministic and metadata is minimized when equal to natural order.
- Reserved output rows remain fixed in natural positions and are not reorderable in v1.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/parts/partRowOrder.test.ts src/app/spaghetti/canvas/driverVm.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [069] - 2026-03-04 18:23 - `DOC - Phase 2 - Node Tasking And Checklist Support - Update Task Lists After Phase 2`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md to reflect current project status after Phase 2 v1. Updated docs/tasks/master-tasks.md from placeholder state to an actionable board.`

#### Scope / Constraints Honored
- Documentation-only update under `docs/`.
- No worker/protocol/scheduler changes.
- No source/schema/runtime behavior changes in this step.
- No drag-and-drop or feature-stack architecture migration changes in this step.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to reflect current project status after Phase 2 v1:
  - marked Phase 2B v1 virtual feature-input wiring scope as implemented,
  - split future work into Phase 2A (row ordering), Phase 2B v2+ (wiring expansion), and Phase 3 migration path,
  - refreshed quality gates with explicit Phase 2 v1 verification completion.
- Updated `docs/tasks/master-tasks.md` from placeholder state to an actionable board:
  - set current priority to Phase 2A,
  - listed active work for row-ordering metadata,
  - added backlog for Phase 2A/2B v2/Phase 3,
  - recorded completed Phase 1 and Phase 2 v1 milestones.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/tasks/master-tasks.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- None. This change updates task planning/status documents only.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for updated phase status markers and section numbering.
- Reviewed `docs/tasks/master-tasks.md` for synchronized priority/active/backlog/completed state.
- Confirmed changelog entry inserted at top with next sequential index `[044]`.

<!-- ============================================================ -->
### [068] - 2026-03-04 18:21 - `DR - Phase 8 - Virtual Feature Wiring Expansion - External Feature-Input Wiring`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added deterministic virtual feature input port contract. Added shared effective-port resolver utilities and used them across compiler/canvas/UI listing to keep endpoint behavior consistent.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- Feature Stack remains embedded in `node.params.featureStack`.
- No drag-and-drop implementation.
- Phase 2 v1 scope locked to:
  - inputs only,
  - `Extrude.depth` only,
  - no composite paths,
  - `maxConnectionsIn = 1`,
  - external-only simplification (`from.nodeId !== to.nodeId`) for feature-target edges.

#### Summary of Implementation
- Added deterministic virtual feature input port contract:
  - `fs:in:<featureId>:extrude:depth`,
  - parse/build helpers,
  - virtual input listing in feature-stack order,
  - deterministic compile-time extrude depth override utility.
- Added shared effective-port resolver utilities and used them across compiler/canvas/UI listing to keep endpoint behavior consistent.
- Updated validation/evaluation/compile pipeline:
  - `validateGraph` now resolves virtual feature inputs, enforces max incoming constraints, and emits `FEATURE_WIRE_INTRA_NODE_UNSUPPORTED` for same-node feature-target edges (documented v1 simplification).
  - `evaluateGraph` now resolves virtual feature inputs into `inputsByNodeId[nodeId][virtualPortId]`.
  - `compileGraph` now applies evaluated virtual depth inputs as deterministic in-memory overrides before feature-stack IR compilation.
- Updated UI for Extrude-only wiring row:
  - added wireable depth endpoint inside `ExtrudeFeatureView`,
  - reused canvas pointer/anchor/drop validation handlers,
  - added driven-state UX: wired depth disables manual editing and shows driven value.
- Added/updated tests for virtual port helpers, resolver consistency, validator rules, evaluation mapping, compile determinism/override behavior, and UI rendering/disabled behavior.

#### Files Changed
- `src/app/spaghetti/features/featureVirtualPorts.ts`
- `src/app/spaghetti/features/effectivePorts.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/features/featureVirtualPorts.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part nodes now expose virtual feature input endpoints for extrude depth (`fs:in:<featureId>:extrude:depth`) in app-layer validation/evaluation/UI/compile flow.
- External wires can drive `Extrude.depth`; driven values override embedded depth literals at compile time only.
- Same-node feature-target edges are rejected in v1 with deterministic error code `FEATURE_WIRE_INTRA_NODE_UNSUPPORTED`.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/featureVirtualPorts.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/compiler/compileGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/compiler/compileGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [067] - 2026-03-04 17:55 - `DOC - Phase 2 - Node Tasking And Checklist Support - Create Tasks Master File`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created new directory: docs/tasks/. Added docs/tasks/master-tasks.md as a central task-tracking document.`

#### Scope / Constraints Honored
- Documentation-only update under `docs/`.
- No worker/protocol/scheduler changes.
- No source/schema/runtime behavior changes.
- No drag-and-drop or feature-stack migration work in this step.

#### Summary of Implementation
- Created new directory: `docs/tasks/`.
- Added `docs/tasks/master-tasks.md` as a central task-tracking document.
- Seeded the file with a deterministic baseline structure:
  - legend,
  - current priority,
  - active work,
  - backlog,
  - completed.

#### Files Changed
- `docs/tasks/master-tasks.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- None. Documentation scaffolding only.

#### Verification Steps
- Confirmed `docs/tasks/` exists.
- Confirmed `docs/tasks/master-tasks.md` exists with starter sections.
- Confirmed changelog entry inserted at top with next sequential index `[042]`.

<!-- ============================================================ -->
### [066] - 2026-03-04 17:53 - `DOC - Phase 2 - Node Tasking And Checklist Support - Update Phase 1 Status`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md status markers to reflect completed Phase 1 closure work. Marked all Phase 1 checklist items complete for.`

#### Scope / Constraints Honored
- Documentation-only update in `docs`.
- No worker/protocol/scheduler changes.
- No app runtime, schema, or renderer code changes.
- No drag-and-drop or feature-stack migration implementation in this step.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` status markers to reflect completed Phase 1 closure work.
- Marked all Phase 1 checklist items complete for:
  - Part container contract (`partSlots`) metadata/normalization/invariants/diagnostics.
  - Locked Part section render order.
  - Required tests and verification tasks.
- Marked Quality Gates entries complete to match current verification and changelog compliance state.
- Left future roadmap sections (Phase 2 and Phase 3) unchanged.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- None. This change updates planning/status documentation only.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for updated `[x]` statuses in Sections 2, 3, 4, and 7.
- Confirmed changelog entry inserted at the top with next sequential index `[041]`.

<!-- ============================================================ -->
### [065] - 2026-03-04 17:51 - `PT - Phase 6 - Part Container Contract - Closure Hardening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated graph schema parsing so malformed legacy partSlots payloads do not hard-fail graph parsing. Kept deterministic normalization and repair architecture unchanged.`

#### Scope / Constraints Honored
- App-layer only changes in spaghetti schema/store/validator/canvas tests.
- No worker/protocol/scheduler changes.
- Feature Stack remains embedded in `node.params.featureStack`.
- No drag-and-drop implementation.
- Drivers/Inputs/Outputs remain VM-row generated.

#### Summary of Implementation
- Updated graph schema parsing so malformed legacy `partSlots` payloads do not hard-fail graph parsing:
  - `spaghettiNodeSchema.partSlots` now accepts unknown payloads at parse boundary.
  - `spaghettiGraphSchema` transform preserves malformed `partSlots` payloads for deterministic downstream repair/validation.
- Kept deterministic normalization and repair architecture unchanged:
  - store canonicalization (`normalizeGraphUiPositions`) still normalizes Part-node `partSlots` silently.
  - validation remains the single warning source for `partSlots` diagnostics.
- Expanded deterministic test coverage:
  - added schema compatibility tests proving malformed `partSlots` payloads parse successfully,
  - added validator invalid-shape matrix tests (`null`, array, string, partial, extra key, false value),
  - added validator reproducibility test for stable warning list/order across runs,
  - added store test proving non-Part nodes are not `partSlots`-normalized.
- Renderer contract remains locked and covered:
  - `Drivers -> Inputs -> Feature Stack -> Outputs`
  - Feature Stack still sourced from embedded `node.params.featureStack`.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Malformed legacy `partSlots` payloads no longer cause parse-time graph rejection.
- Deterministic repair path remains app-driven (store normalization + validator diagnostics), preserving backward compatibility.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/schema/spaghettiSchema.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [064] - 2026-03-04 17:43 - `DOC - Phase 2 - Node Tasking And Checklist Support - Add Easy-To-Hard Scale`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md to include an explicit difficulty scale definition. Added Easy to Hard: X/100 labels directly on each major checklist section title to provide immediate complexity guidance.`

#### Scope / Constraints Honored
- Documentation-only update in `docs`.
- No worker/protocol/scheduler changes.
- No app runtime or schema behavior changes.
- No drag-and-drop or feature-stack migration implementation.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to include an explicit difficulty scale definition:
  - `1 = easiest`, `100 = hardest`.
- Added `Easy to Hard: X/100` labels directly on each major checklist section title to provide immediate complexity guidance.
- Preserved existing checklist structure and status markers (`[ ]`, `[~]`, `[x]`).

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- None. This is a documentation clarity update only.

#### Verification Steps
- Reviewed all major section headings in `docs/NODE-tasklist.md` to confirm each includes a `1-100` difficulty score.
- Confirmed changelog entry is inserted at the top with next sequential index `[039]`.

<!-- ============================================================ -->
### [063] - 2026-03-04 17:40 - `DOC - Phase 2 - Node Tasking And Checklist Support - Add NODE Tasklist Checklist`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/NODE-tasklist.md with a full status checklist covering. Checklist uses standardized state markers: [ ], [~], [x].`

#### Scope / Constraints Honored
- Documentation-only update in app docs.
- No worker/protocol/scheduler changes.
- No schema/runtime behavior changes.
- No drag-and-drop or feature-stack migration work performed.

#### Summary of Implementation
- Added `docs/NODE-tasklist.md` with a full status checklist covering:
  - locked Phase 1 architectural decisions,
  - Phase 1 container contract tasks (`partSlots` metadata, normalization, invariants, diagnostics),
  - locked part section render order requirements,
  - required tests and verification gates,
  - Phase 2 feature-level wiring roadmap,
  - optional Phase 3 true child-container migration path.
- Checklist uses standardized state markers: `[ ]`, `[~]`, `[x]`.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- None. This change adds planning/documentation only.

#### Verification Steps
- Reviewed checklist structure and status markers for deterministic formatting.
- Confirmed changelog entry inserted at top with next sequential index.

<!-- ============================================================ -->
### [062] - 2026-03-04 17:39 - `PT - Phase 6 - Part Container Contract`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added additive partSlots structural metadata to SpaghettiNode with the Phase 1 contract keys. Added strict graph-schema parsing support for optional partSlots.`

#### Scope / Constraints Honored
- App-layer only changes in schema/store/validator/canvas tests.
- No worker/protocol/scheduler changes.
- Feature Stack remains embedded at `node.params.featureStack`.
- No drag-and-drop implementation was added.
- Node row-generation architecture remains VM-driven.

#### Summary of Implementation
- Added additive `partSlots` structural metadata to `SpaghettiNode` with the Phase 1 contract keys:
  - `drivers: true`
  - `inputs: true`
  - `featureStack: true`
  - `outputs: true`
- Added strict graph-schema parsing support for optional `partSlots`.
- Added new deterministic part-slots utility module:
  - `DEFAULT_PART_SLOTS`
  - `isPartNodeType(...)`
  - `hasValidPartSlots(...)`
  - `normalizePartSlots(...)`
- Integrated deterministic part-slots normalization into graph load canonicalization (`normalizeGraphUiPositions`) for part nodes.
- Added non-fatal deterministic validation warnings for part-slot normalization states:
  - `partSlots_missing_normalized`
  - `partSlots_invalid_shape_repaired`
- Refactored part template section rendering to an explicit ordered descriptor list, locking visible order to:
  - Drivers -> Inputs -> Feature Stack -> Outputs
- Added tests for part-slot normalization/repair, warning-code emission, render-order lock, and Feature Stack embedded-source behavior.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/parts/partSlots.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part nodes are now canonically persisted with `partSlots` metadata after load normalization.
- Legacy part nodes missing `partSlots` are deterministically normalized to the default container contract.
- Invalid `partSlots` shapes are deterministically repaired to the default container contract.
- Validator now emits deterministic warning diagnostics for missing/invalid part-slot metadata.
- Part template section rendering order is explicitly locked by descriptor ordering.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [061] - 2026-03-04 03:55 - `NI - Phase 4 - Node UI And Wire Layout Pass - Expand Collapse And Toolbar Visibility`
<!-- ============================================================ -->
HUMAN SUMMARY: `Restored toolbar control visibility by keeping the toolbar toggle button mounted in both open and closed states (show/hide states only). Unified driver section presentation to avoid duplicate top-level and grouped Drivers labels, then adjusted default driver grouping behavior.`

#### Edit Times (HH:MM)
- 03:49
- 03:52
- 03:55
- 03:56
- 04:00

#### Scope / Constraints Honored
- App-layer UI/CSS updates in Spaghetti node template controls and headers.
- No compileGraph, worker, protocol, scheduler, or schema changes.
- Kept behavior metadata-driven with generic section/group collapse interactions.

#### Summary of Implementation
- Restored toolbar control visibility by keeping the toolbar toggle button mounted in both open and closed states (show/hide states only).
- Unified driver section presentation to avoid duplicate top-level and grouped `Drivers` labels, then adjusted default driver grouping behavior.
- Enabled collapsible driver subgroups for default/unlabeled driver rows so drivers expand/collapse consistently with section/group headers (`Properties` bucket used where no explicit group label exists).

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Toolbar control button now remains visible after opening the editor.
- Duplicate `Drivers` headers for Baseplate-style default-group drivers were removed.
- Driver buckets now participate in section/group collapse interactions.
- Node dragging in Spaghetti canvas now requires pointer events to originate in top node chrome (`SpaghettiNodeHeader`, `SpaghettiNodePresetRow`, or toolbar editor region), preventing unintended drags from ports/rows.
- Added a global ï¿½Pin Sizeï¿½ toolbar slider to control port dot diameter for both input and output pins across nodes.
- Port dot size now follows a shared canvas-level CSS variable (`--sp-port-dot-size`) so updates apply instantly and consistently to all node pins (including template and legacy ports).

#### Verification Steps
- `npm.cmd run build` (passed).

<!-- ============================================================ -->
### [060] - 2026-03-04 03:38 - `NI - Phase 4 - Node UI And Wire Layout Pass - Fit Node Preset Picker Width`
<!-- ============================================================ -->
HUMAN SUMMARY: `Changed the node preset picker control width behavior so the dropdown width now shrinks to fit its displayed text (for example > default). Updated .SpaghettiNodePresetControls to auto-width and made the <select> intrinsic-content width with nowrap text.`

#### Edit Times (HH:MM)
- 03:38
- 03:44
- 03:47
- 03:29
- 03:30
- 03:32
- 03:36
- 03:39
- 03:42
- 03:48
- 03:49
- 03:52
- 03:53
- 03:55

#### Scope / Constraints Honored
- UI/CSS-only adjustment in Spaghetti node preset picker.
- No compileGraph, worker protocol, or graph schema changes.
- Added a generic, metadata-driven section/group collapse model for part-node template sections using stable UI-store keys.
- Preserved node drag/select interaction safety by marking section/group headers as `data-sp-interactive="1"` and keeping drag guard centralized.
- Kept behavior deterministic and node-specific by scoping collapse state to `nodeId` and stable section/group IDs.

#### Summary of Implementation
- Changed the node preset picker control width behavior so the dropdown width now shrinks to fit its displayed text (for example `> default`).
- Updated `.SpaghettiNodePresetControls` to auto-width and made the `<select>` intrinsic-content width with nowrap text.
- In output template rows, anchored output header text by position: node output names now align to the top-left corner and output type labels align to the bottom-right near the anchor.
- In output template rows, expanded output header to full row height so type labels can anchor to the row bottom (not only the header token height), reducing the perceived bottom offset from header padding.
- In output template rows, changed the header layout to a 3-row grid so the type sits on a lower row (with extra space) and removed the `â†’` glyph from type labels.
- Mirrored the output node-row styling to template input rows in `v15Theme.css`:
  - input rows now use the slider-driven row height variable (default 40),
  - input row header text is mirrored (name top-right, type bottom-left) with type text using `var(--sp-port-color)`,
  - input composite toggle chevrons are hidden in template sections,
  - input rows keep 50% lane width and are anchored in the left input side while matching output row padding/appearance.
- Updated `Other/Debug (Legacy)` in full part-node mode to match section header styling and added collapse toggles for the parent section and each child section.
- Added a reusable section-header render helper in `NodeView.tsx` so Feature Stack and other collapsible toolbar sections use a common collapse interaction.
- Restored the part-node toolbar control toggle button in `NodeView.tsx` and made toolbar editor rows conditional on that toggle, so the control panel expands on demand rather than always rendering.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/FeatureStackView.tsx`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Template preset picker no longer uses a fixed/stretch width and now matches the selected label width.
- `Other/Debug (Legacy)` and its child sections now support collapse controls in the same format as Drivers/Inputs/Outputs.
- Feature Stack section now collapses via the same shared helper pattern used by other node toolbar headers.
- Added generic top-level section collapse for Drivers/Inputs/Feature Stack/Outputs, plus subgroup collapse in Drivers and Feature Stack.
- Added explicit output composite wire-up for group state while keeping output composite toggle UI removed where requested for output rows.
- Toolbar control button now remains visible after opening the node toolbar editor (toggles between show/hide states rather than disappearing).
- For default unlabeled driver buckets (e.g., Baseplate), suppressed redundant inner `Drivers` group headers so only the top-level section header is shown.
- Restored default/unlabeled driver buckets as collapsible subgroups so drivers can expand/collapse like other section/group headers.
- Default/unlabeled driver bucket header now renders as `Properties` to avoid duplicating the top-level `Drivers` section label while preserving collapse behavior.

#### Verification Steps
- `npm.cmd run build` (passed).

<!-- ============================================================ -->
### [059] - 2026-03-04 03:24 - `NI - Phase 4 - Node UI And Wire Layout Pass - Global Output Height Slider`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added an Output Height slider under existing node toolbar controls (Sensitivity, wiring toggle). Implemented as global shared state in SpaghettiCanvas so changing it in any node updates all output rows.`

#### Scope / Constraints Honored
- App-layer UI/CSS update only for Spaghetti canvas/node editor controls.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Added an `Output Height` slider under existing node toolbar controls (`Sensitivity`, wiring toggle).
- Implemented as global shared state in `SpaghettiCanvas` so changing it in any node updates all output rows.
- Applied the value via CSS custom property (`--sp-output-row-min-height`) on canvas root.
- Updated output row min-height CSS to consume the variable with fallback.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Node toolbar editor now includes an `Output Height` slider.
- Output row minimum height for all nodes updates live from that single slider value.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [058] - 2026-03-04 03:21 - `NI - Phase 4 - Node UI And Wire Layout Pass - Set Output Row Minimum Height`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated output lane row minimum height to a fixed 25px for .SpaghettiTemplateSection--outputs .SpaghettiPort--out. Output endpoint rows in the Outputs section now enforce at least 25px height.`

#### Scope / Constraints Honored
- CSS/UI-only sizing update for template output rows.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Updated output lane row minimum height to a fixed `25px` for `.SpaghettiTemplateSection--outputs .SpaghettiPort--out`.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Output endpoint rows in the Outputs section now enforce at least 25px height.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [057] - 2026-03-04 03:20 - `NI - Phase 4 - Node UI And Wire Layout Pass - Increase Output Row Height`
<!-- ============================================================ -->
HUMAN SUMMARY: `Increased output row vertical size by raising output row minimum height and vertical padding. Increased output header minimum height to keep label/type alignment centered within the taller row.`

#### Scope / Constraints Honored
- CSS/UI-only update in Spaghetti template output row styling.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Increased output row vertical size by raising output row minimum height and vertical padding.
- Increased output header minimum height to keep label/type alignment centered within the taller row.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Output endpoint rows in the Outputs section now render taller than before.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [056] - 2026-03-04 03:19 - `NI - Phase 4 - Node UI And Wire Layout Pass - Half-Width Input Output Lanes`
<!-- ============================================================ -->
HUMAN SUMMARY: `Restored half-width lane behavior for template endpoint rows. Kept output pin offset at the outer right edge while preserving lane anchoring.`

#### Scope / Constraints Honored
- CSS/UI-only layout adjustments for Spaghetti node template lanes.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Restored half-width lane behavior for template endpoint rows:
  - input lane is half-width and anchored left,
  - output lane is half-width and anchored right.
- Kept output pin offset at the outer right edge while preserving lane anchoring.
- Matched output row vertical sizing to input row sizing by aligning output row padding/header min-height with input row baseline.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Input endpoint rows now occupy left half of section width.
- Output endpoint rows now occupy right half of section width.
- Output endpoint row height now visually matches input endpoint row height.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [055] - 2026-03-04 03:17 - `NI - Phase 4 - Node UI And Wire Layout Pass - Align Template Section Widths`
<!-- ============================================================ -->
HUMAN SUMMARY: `Made all template sections use the same width treatment as Drivers by applying the section margin rule to every .SpaghettiTemplateSection instead of only the first section. Matched port-column widths to driver-style full section width.`

#### Scope / Constraints Honored
- CSS/UI-only layout updates for Spaghetti node template.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Made all template sections use the same width treatment as Drivers by applying the section margin rule to every `.SpaghettiTemplateSection` instead of only the first section.
- Matched port-column widths to driver-style full section width:
  - input port column in template sections now full width,
  - outputs port column now full width (removed half-width right-anchored layout).
- Moved output pins farther right to align with the outer section edge:
  - output row overflow set to visible,
  - output pin offset moved outward.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Inputs/Feature Stack/Outputs sections now visually align in width with Drivers.
- Output rows span full section width instead of half-width.
- Output socket pin sits on the outer right edge, matching the driver-side pin feel.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [054] - 2026-03-04 03:14 - `NI - Phase 4 - Node UI And Wire Layout Pass - Fix Right-Side Click Regression`
<!-- ============================================================ -->
HUMAN SUMMARY: `Lowered Spaghetti wire layer stacking order so node surfaces are above wires for pointer interaction. This prevents wire hit targets from stealing right-side node clicks and selection interactions.`

#### Scope / Constraints Honored
- UI-layer CSS interaction fix only.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Lowered Spaghetti wire layer stacking order so node surfaces are above wires for pointer interaction.
- This prevents wire hit targets from stealing right-side node clicks and selection interactions.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Node selection/highlight interactions now take precedence over overlapping wire strokes on node rows, including right/output side clicks.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [053] - 2026-03-04 03:11 - `NI - Phase 4 - Node UI And Wire Layout Pass - Remove Output Composite Toggle`
<!-- ============================================================ -->
HUMAN SUMMARY: `Removed the output composite toggle button hook from composite output row rendering in NodeView. Inner spline output rows no longer render the right-side chevron/toggle button.`

#### Scope / Constraints Honored
- UI-only change in Spaghetti node view rendering.
- No compile graph, worker protocol, or schema/runtime changes.

#### Summary of Implementation
- Removed the output composite toggle button hook from composite output row rendering in `NodeView`.
- `Inner` spline output rows no longer render the right-side chevron/toggle button.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Composite outputs still render, but their toggle button is no longer shown in output rows.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [052] - 2026-03-04 03:09 - `NI - Phase 4 - Node UI And Wire Layout Pass - Typed Sockets And Wires`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a shared type color source in canvas layer. Updated PortView socket rendering.`

#### Scope / Constraints Honored
- App-layer Spaghetti canvas/view updates only.
- `compileGraph`, worker protocol, and graph schema were not changed.
- Node rendering remains metadata-driven via `port.type.kind` (no node-type branching).

#### Summary of Implementation
- Added a shared type color source in canvas layer:
  - `TYPE_COLOR_MAP` plus `getTypeColor(kind)` in `typeColors.ts`.
- Updated `PortView` socket rendering:
  - socket color now resolves from `getTypeColor(port.type.kind)`,
  - root port row now sets `--sp-port-color` from the same map for consistent color usage.
- Updated wire rendering to inherit source endpoint kind color:
  - `SpaghettiCanvas` resolves source endpoint kind (including composite leaf paths),
  - computes `edgeColorById` using source kind -> `getTypeColor`,
  - passes per-edge colors into `WireLayer`.
- Updated `WireLayer` rendering:
  - each wire path now uses its edge color,
  - crossing loop stroke and waypoint stroke follow the same edge color,
  - preview wire uses source color when available.
- Made compatibility blocking explicit for kind mismatch:
  - connection validation now rejects `from.kind !== to.kind` with a dedicated reason,
  - unit mismatch remains blocked as a separate check.

#### Files Changed
- `src/app/spaghetti/canvas/typeColors.ts` (new)
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/WireLayer.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Socket circles now always color from the shared type map keyed by `port.type.kind`.
- Wires now inherit color from the source endpoint type, including composite leaf-field connections.
- Drag-preview wire color follows the current source endpoint when determinable.
- Connection attempts with mismatched endpoint kinds are rejected with an explicit kind-mismatch message.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [051] - 2026-03-04 03:40 - `NI - Phase 4 - Node UI And Wire Layout Pass - Driver Section Styling And Toolbar Editor`
<!-- ============================================================ -->
HUMAN SUMMARY: `Performed iterative visual cleanup to push node styling toward Blender-like compactness. Unified/expanded section interaction model.`

#### Scope / Constraints Honored
- App-layer UI/view changes only.
- No worker/runtime/protocol/scheduler/compile-payload contract changes.
- `NodeView` remained metadata-driven (no node-type branching introduced).
- Deterministic row ordering preserved (no new sort logic added).

#### Summary of Implementation
- Performed iterative visual cleanup to push node styling toward Blender-like compactness:
  - tighter row density, smaller sockets, cleaner spacing primitives,
  - driver field endcaps redesigned as integrated clickable caps (step down/up),
  - pin/cap alignment tuned to section box boundaries.
- Unified/expanded section interaction model:
  - clickable section header hit-areas for `Drivers`, `Inputs`, `Feature Stack`, `Outputs`,
  - collapsible section behavior with pins-only rendering for driver/input/output sections.
- Added collapsed driver pin-value readout:
  - small numeric labels above output-side pins in pins-only mode.
- Added node-level toolbar editor launcher beside preset:
  - unlabeled toggle button,
  - hidden editor area above `Drivers`,
  - scrub sensitivity slider,
  - internal wiring visibility toggle.
- Reworked number field styling behavior:
  - restored and refined fill/empty contrast,
  - stronger scrub glow while dragging,
  - text casing and typography normalized to chosen header style baseline (then adjusted back to non-uppercase for field content),
  - text selectability enabled.
- Output section style modernization:
  - compact inline text style (`name -> type`),
  - half-width right-anchored output rows,
  - output row background tinted by output type color,
  - overflow/pin containment fixes within section box.
- Wire layering adjustments:
  - raised spaghetti wire layer above node baseplate/output UI surfaces per UX request.

#### Style Standards Established (Current)
- Section headers (`Drivers`, `Inputs`, etc.) define the typography baseline for node control labels.
- Driver number fields:
  - compact single-row control,
  - integrated dark endcaps,
  - distinct empty-area color vs. fill color,
  - pin visibility and line presentation tuned for clarity.
- Outputs:
  - right-anchored half-width compact presentation,
  - no fill-bar treatment for standard output rows,
  - inline directional text emphasis and type-color tinting.
- Preset row controls:
  - toolbar toggle and dropdown match height/border/background family.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/fields/NumberField.tsx`
- `src/app/spaghetti/canvas/fields/Vec2Field.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (UI)
- Drivers/Inputs/Outputs can collapse independently from section headers.
- Driver pins-only mode now shows lightweight numeric value labels near output pins.
- Node toolbar editor is opt-in per node and exposes:
  - scrub sensitivity,
  - internal wiring visibility.
- Endcaps now support click-based incremental stepping.

#### Notes
- This entry captures an iterative polish pass with many micro-adjustments in CSS/layout layering.
- Intentional outcome: preserve existing graph semantics while improving node readability and edit ergonomics.

<!-- ============================================================ -->
### [050] - 2026-03-04 01:02 - `PT - Phase 5 - Part Template Population - Shared NumberField And Driver Refactor`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added evaluator-resolved inputs exposure for UI consumption without Canvas-side partial evaluation. Extended driver VM endpoint row metadata and registry endpoint-driver metadata.`

#### Scope / Constraints Honored
- UI/view-model/compiler-evaluator app-layer changes only.
- No worker runtime, protocol contract, scheduler, or auto-build behavior changes.
- `NodeView` remains generic and metadata-driven (no node-type branching added).
- Deterministic ordering preserved from registry/VM order (no sorting introduced).

#### Summary of Implementation
- Added evaluator-resolved inputs exposure for UI consumption without Canvas-side partial evaluation:
  - `EvaluationResult.inputsByNodeId` now carries the already-resolved per-node inputs map.
- Extended driver VM endpoint row metadata and registry endpoint-driver metadata:
  - endpoint rows now support `displayValue`, `inputWiringDisabled`, and `drivenMessage`,
  - endpoint driver specs now support `wiringDisabled` and `visibility` (`always` / `connectedOnly`).
- Implemented shared numeric controls used by both port rows and driver rows:
  - new `NumberField` with Blender-like square scrub zone + numeric input (single scrub math implementation),
  - new `Vec2Field` composed from two `NumberField` controls with compact `X`/`Y` labels and equal-width layout.
- Refactored `PortView` to consume shared `NumberField` controls and added `resolvedValueLabel` support:
  - input type badge now shows resolved numeric display (e.g. `235.6 mm`) when available,
  - fallback remains type badge when unresolved.
- Refactored `NodeView` driver rows to use shared `NumberField` / `Vec2Field` controls.
- Made collapsed mode editing baseline across modes:
  - `rowViewMode.collapsed.showEditors` set to `true` with tests updated.
- Implemented Baseplate Width/Length driver refactor with selected soft compatibility:
  - Width/Length moved to non-wireable `nodeParam` drivers,
  - legacy width/length input rows preserved as connected-only, read-only migration rows.
- Updated node/port CSS to establish shared row primitives and Blender-style control visuals:
  - driver rows no longer reserve pin gutters or show ghost lane visuals,
  - outputs now support compact right-anchored badge cluster while preserving full-row hit area/wiring behavior.

#### Files Changed
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/canvas/fields/NumberField.tsx` (new)
- `src/app/spaghetti/canvas/fields/Vec2Field.tsx` (new)
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Collapsed/essentials/everything now share the same editable Number/Vec2 control baseline; expanded modes add sections/rows instead of changing control style.
- Driver controls now use a unified Blender-like scrub+input control style with no arrows/spinners.
- Numeric input badges can display resolved values when known; unresolved inputs continue to display type badges.
- Baseplate Width/Length primary editing is now in Drivers; legacy width/length input rows appear only when wired and are read-only/non-wireable.
- Output rows keep full-width interaction/wiring behavior while visually right-anchoring the output badge cluster.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/rowViewMode.test.ts src/app/spaghetti/canvas/driverVm.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts` (passed)
- `npm.cmd run test` (passed)
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [049] - 2026-03-04 00:29 - `PT - Phase 5 - Part Template Population - HeelKick Template Population`
<!-- ============================================================ -->
HUMAN SUMMARY: `Converted existing Part/HeelKick node definition to ToeHook-parity part-template shape. Added heel-specific deterministic defaults (different from ToeHook) for profile controls.`

#### Scope / Constraints Honored
- UI/data-model + spaghetti compiler/store compatibility updates only.
- No worker/protocol/scheduler runtime changes.
- `NodeView` remains generic and metadata-driven; no node-type branches added.
- Deterministic ordering preserved via registry driver order and first-seen group order.
- Registry remains the single source of truth for default node params.

#### Summary of Implementation
- Converted existing `Part/HeelKick` node definition to ToeHook-parity part-template shape:
  - Drivers (Global/Profile A/Profile B), non-wireable.
  - Inputs: `anchorSpline`, `railMath` (wireable).
  - Outputs: `hookLoft` with opaque `toeLoft` kind (wireable).
- Added heel-specific deterministic defaults (different from ToeHook) for profile controls:
  - `profileA_end`, `profileA_endCtrl`, `profileA_baseCtrl`,
  - `profileB_end`, `profileB_endCtrl`, `profileB_baseCtrl`.
- Added legacy input alias support on HeelKick:
  - `legacyInputPortAliases: { anchorSpline2: 'anchorSpline' }`.
- Mirrored ToeHook payload compatibility strategy for HeelKick in compiler:
  - added explicit heel anchor mapping helper (`uiPortId: anchorSpline`, `payloadKey: anchorSpline2`) with invariant comment,
  - added fallback resolution order for heel anchor input:
    1) canonical `anchorSpline`, then
    2) legacy `anchorSpline2`.
- Added compile-time canonicalization pass for legacy input aliases before evaluation/validation, enabling raw legacy graphs to compile without requiring store normalization first.
- Added optional dev fixture for quick manual check:
  - `createValidBaseplateHeelKickGraph()`,
  - panel button: `Load Baseplate - HeelKick`.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/dev/sampleGraph.ts`
- `src/app/panels/SpaghettiPanel.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- HeelKick now renders full part template sections with populated grouped drivers and pin-bearing inputs/outputs.
- HeelKick accepts legacy incoming anchor edges targeting `anchorSpline2` and canonicalizes/resolves them to `anchorSpline` paths.
- Build payload contract for heel remains unchanged (`...anchorSpline2`).

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [048] - 2026-03-04 00:20 - `PT - Phase 5 - Part Template Population - ToeHook Template Population`
<!-- ============================================================ -->
HUMAN SUMMARY: `Populated Part/ToeHook template metadata with deterministic default drivers/inputs/outputs. Added registry-level backward compatibility alias metadata.`

#### Scope / Constraints Honored
- UI/data-model and compiler/store compatibility updates for Spaghetti graphing.
- No worker runtime/protocol/scheduler behavior changes.
- Payload key compatibility preserved (`anchorSpline2` remains emitted for ToeHook build inputs).
- Deterministic ordering preserved for driver/input/output rows and grouped drivers (first-seen group order, registry row order).

#### Summary of Implementation
- Populated `Part/ToeHook` template metadata with deterministic default drivers/inputs/outputs:
  - Drivers (non-wireable): Global + Profile A + Profile B rows (number + vec2 param controls),
  - Inputs (wireable): `anchorSpline`, `railMath`,
  - Outputs (wireable): `toeLoft`.
- Added registry-level backward compatibility alias metadata:
  - `legacyInputPortAliases: { anchorSpline2: 'anchorSpline' }` on ToeHook.
- Added store-level canonicalization for incoming edge target input port ids using registry aliases, so legacy edges targeting `anchorSpline2` normalize to canonical `anchorSpline`.
- Added single authoritative default param source in registry:
  - `defaultParams` on node definitions,
  - `getDefaultNodeParams(type)` accessor returning a fresh cloned object,
  - updated both add-node flows (`SpaghettiCanvas`, `SpaghettiEditor`) to consume registry defaults.
- Extended generic driver VM and NodeView rendering:
  - new non-wireable node-param driver rows (number and vec2),
  - grouped Drivers rendering is fully metadata-driven and stable (no sorting),
  - no node-type branching added to `NodeView`.
- Added new opaque port kinds:
  - `railMath`, `toeLoft` in shared type/schema unions and UI color mappings.
- Tightened opaque evaluator validation:
  - accepts only `null` or `{ __opaqueRef: string }`,
  - rejects arbitrary objects to avoid silent type masking.
- Added explicit ToeHook UI-to-payload port mapping function in compiler with hard invariant comment:
  - UI input port id: `anchorSpline`,
  - payload key: `anchorSpline2`.
  - Compile path includes fallback support for legacy-stored `anchorSpline2` input edges.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/dev/sampleGraph.ts`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/driverVm.test.ts` (new)
- `src/app/spaghetti/store/useSpaghettiStore.test.ts` (new)
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- ToeHook part nodes now render meaningful default rows under:
  - Drivers -> Inputs -> Feature Stack -> Outputs.
- ToeHook Drivers are non-wireable controls; Inputs/Outputs remain pin-based wireable endpoints.
- Legacy ToeHook input edge targets using `anchorSpline2` are canonicalized to `anchorSpline` in normalized graph state.
- Build payload contract remains unchanged: ToeHook anchor value still emitted as `anchorSpline2`.
- Opaque kinds `railMath`/`toeLoft` are now wire/display-capable with strict placeholder value validation.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [047] - 2026-03-03 23:05 - `PT - Phase 5 - Part Template Population - Baseplate Outputs Cleanup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated Part/Baseplate output port declarations to the minimal public set by removing incidental outer spline output exposure. Kept existing output-driver taxonomy unchanged.`

#### Scope / Constraints Honored
- UI/registry-only cleanup.
- No edits under `src/app/spaghetti/features/**`, `src/app/spaghetti/compiler/**`, `src/app/spaghetti/integration/**`, or `src/worker/**`.
- No protocol/scheduler changes.
- Deterministic output ordering behavior preserved.

#### Summary of Implementation
- Updated `Part/Baseplate` output port declarations to the minimal public set by removing incidental outer spline output exposure:
  - kept: `anchorSpline2` (wireable public endpoint),
  - removed from public outputs: `offsetSpline2` (intermediate/internal artifact).
- Kept existing output-driver taxonomy unchanged:
  - `Inner Spline Anchor` endpoint row remains in `Outputs`,
  - reserved `Mesh Output` pending row remains endpoint-less and non-wireable.
- Updated Baseplate compute return shape to remove undeclared `offsetSpline2`, keeping evaluator validation green while preserving compiler/integration code paths unchanged.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Baseplate now exposes only intended public output endpoint (`Inner Spline Anchor`) plus reserved mesh pending row in template output rows.
- In `everything` mode, Baseplate no longer contributes incidental endpoint(s) to `Other Outputs` via port-subtraction.

#### Verification Steps
- `rg -n "offsetSpline2|Base Plate Spline \\(Outer\\)" src/app/spaghetti/registry/nodeRegistry.ts`
- `npm.cmd --prefix parahook run test`
- `npm.cmd --prefix parahook run build`

<!-- ============================================================ -->
### [046] - 2026-03-03 22:56 - `PT - Phase 5 - Part Template Population - Drivers Inputs Outputs Taxonomy`
<!-- ============================================================ -->
HUMAN SUMMARY: `Refactored part-template row taxonomy in VM and NodeView from Input Drivers/Output Drivers to. Updated driverVm output shape to drivers, inputs, outputs, otherOutputs while keeping existing metadata fields (inputDrivers, outputDrivers) unchanged for minimal API churn.`

#### Scope / Constraints Honored
- UI-only refactor in canvas/view-model layers.
- No edits under `src/app/spaghetti/features/**`, `src/app/spaghetti/compiler/**`, `src/app/spaghetti/integration/**`, or `src/worker/**`.
- No protocol/scheduler changes.
- Deterministic ordering preserved from metadata arrays and stable endpoint-key subtraction.

#### Summary of Implementation
- Refactored part-template row taxonomy in VM and `NodeView` from `Input Drivers/Output Drivers` to:
  - `Drivers` (feature-param controls, non-wireable),
  - `Inputs` (wireable endpoint rows),
  - `Outputs` (pinned endpoint rows + reserved rows),
  - `Other Outputs` (everything-only, non-pinned endpoint rows).
- Updated `driverVm` output shape to `drivers`, `inputs`, `outputs`, `otherOutputs` while keeping existing metadata fields (`inputDrivers`, `outputDrivers`) unchanged for minimal API churn.
- Updated part-template render order in `NodeView` to:
  - `Drivers -> Inputs -> Feature Stack -> Outputs`,
- Locked collapsed-mode rendering behavior in UI:
  - drivers rows render,
  - inputs rows render with anchors/pins,
  - feature stack internals are hidden,
  - outputs rows render.
- Updated reserved mesh row interaction markers:
  - row and dot now include both `data-sp-interactive="1"` and `data-sp-disabled-port="1"`,
  - row remains endpoint-less and non-wireable.
- Updated canvas interactive-target guard so disabled reserved port targets are still treated as interactive UI targets (preventing node-drag capture on that control area).

#### Files Changed
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part node sections now display locked taxonomy labels: `Drivers`, `Inputs`, `Feature Stack`, `Outputs`.
- `Outputs` remains the last core section in all modes.
- Reserved mesh pending row remains disabled/non-wireable but no longer behaves like non-interactive empty space for node drag/select hit-testing.

#### Verification Steps
- `rg -n "Baseplate|ToeHook|HeelKick|Part/Baseplate|Part/ToeHook|Part/HeelKick" src/app/spaghetti/canvas/NodeView.tsx` (no matches)
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [045] - 2026-03-03 20:44 - `NI - Phase 3 - Baseplate And Node Surface UI - Remove Title-Click Mode Buttons`
<!-- ============================================================ -->
HUMAN SUMMARY: `Removed Baseplate header click-to-open mode picker from NodeView. Removed associated callback wiring from SpaghettiCanvas.`

#### Scope / Constraints Honored
- Canvas/UI-only cleanup.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Removed Baseplate header click-to-open mode picker from `NodeView`.
- Removed associated callback wiring from `SpaghettiCanvas`.
- Removed now-unused mode-picker styles from theme.
- Right-click node context menu (`collapsed` / `essentials` / `expanded`) remains the active mode-switch UI.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Clicking Baseplate title/top no longer opens row-mode buttons.
- Row mode switching from nodes is now right-click menu driven.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [044] - 2026-03-03 20:39 - `NI - Phase 3 - Baseplate And Node Surface UI - Context Menu Routing`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated viewport right-click behavior in SpaghettiCanvas. Added canvas-level node row-mode context menu using SpaghettiContextMenu with 3 options.`

#### Scope / Constraints Honored
- Canvas/UI-only interaction update.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Updated viewport right-click behavior in `SpaghettiCanvas`:
  - If target is inside a `.SpaghettiNode`, open node row-mode context menu.
  - If target is on blank canvas area, open existing add-node search menu.
- Added canvas-level node row-mode context menu using `SpaghettiContextMenu` with 3 options:
  - `collapsed`
  - `essentials`
  - `expanded` (maps to internal `everything` row mode)
- Menus are mutually exclusive:
  - opening node mode menu closes add-node menu,
  - opening add-node menu closes node mode menu.
- Added Escape handling for the node row-mode context menu.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Right-click on blank node editor space now shows the add-node search menu only.
- Right-click on any node block (Baseplate, Toe Hook, Heel Kick, etc.) now shows row-mode options instead of add-node menu.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [043] - 2026-03-03 20:34 - `NI - Phase 3 - Baseplate And Node Surface UI - Header Mode Picker`
<!-- ============================================================ -->
HUMAN SUMMARY: `Replaced Baseplate title click behavior with a header mode picker. Clicking the top Baseplate header now toggles a 3-button mode menu.`

#### Scope / Constraints Honored
- Canvas/UI-only behavior and styling changes.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Replaced Baseplate title click behavior with a header mode picker.
- Clicking the top Baseplate header now toggles a 3-button mode menu:
  - `collapsed`
  - `essentials`
  - `expanded`
- Mode button mapping:
  - `collapsed` => row mode `collapsed`
  - `essentials` => row mode `essentials`
  - `expanded` => row mode `everything` (internal expanded mode)
- Added compact button styles and active-state highlighting for current row mode.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Clicking the top of a Baseplate node now opens mode options instead of immediately forcing `collapsed`.
- Selecting a mode button switches the canvas into that mode and closes the picker.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [042] - 2026-03-03 20:30 - `NI - Phase 3 - Baseplate And Node Surface UI - Align Scrub Slider Left Edge`
<!-- ============================================================ -->
HUMAN SUMMARY: `Introduced a shared right-column width token for Baseplate controls (clamp(140px, 50%, 170px)). Applied the shared width to.`

#### Scope / Constraints Honored
- UI-only style adjustment.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph semantic changes.

#### Summary of Implementation
- Introduced a shared right-column width token for Baseplate controls (`clamp(140px, 50%, 170px)`).
- Applied the shared width to:
  - `Preset` dropdown (`.SpaghettiNodePresetRow select`),
  - scrub controls row (`.SpaghettiNodeScrubControls`).
- Kept scrub slider at 50% width and right-anchored within that aligned control column.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Scrub slider no longer spans the full node row.
- Slider left edge now aligns with the `default` preset dropdown left edge above.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [041] - 2026-03-03 20:28 - `NI - Phase 3 - Baseplate And Node Surface UI - Scrub Toggle Presets Restored`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reintroduced scrub toggle button in Baseplate sketch header with two presets. Kept continuous slider behavior (0..100) and in-between values.`

#### Scope / Constraints Honored
- UI-only change in canvas layer.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Reintroduced scrub toggle button in Baseplate sketch header with two presets:
  - `low` preset => `0%`,
  - `high` preset => `100%`.
- Kept continuous slider behavior (`0..100`) and in-between values.
- Preset state is derived from current slider position and toggles between the two preset endpoints.
- Existing slider layout remains half-width and right-anchored.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Users can now freely scrub with the slider and also jump instantly between low/high preset values via the toggle button.
- Slider remains half-width and anchored right as requested.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [040] - 2026-03-03 20:27 - `NI - Phase 3 - Baseplate And Node Surface UI - Half-Width Scrub Slider`
<!-- ============================================================ -->
HUMAN SUMMARY: `Replaced binary scrub mode (low/high) with a continuous numeric scrub setting (0..100) in NodeView/PortView. Updated Baseplate scrub control UI.`

#### Scope / Constraints Honored
- UI-only changes in canvas/theme layers.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Replaced binary scrub mode (`low`/`high`) with a continuous numeric scrub setting (`0..100`) in `NodeView`/`PortView`.
- Updated Baseplate scrub control UI:
  - slider range now `0..100` with fractional movement (`step=0.1`),
  - removed low/high toggle button,
  - value display now shows percentage.
- Updated scrub drag behavior in `PortView` to interpolate threshold and sensitivity across the full slider range.
- Updated theme styles so the scrub slider is half-width and remains right-anchored in its row.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Scrub speed now glides smoothly from 0 to 100 and uses in-between values.
- Slider occupies half the scrub row width and stays aligned to the right.
- Scrub mode toggle button is removed in favor of continuous slider control.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [039] - 2026-03-03 20:25 - `NI - Phase 3 - Baseplate And Node Surface UI - Drivers Label Below Scrub Controls`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated Baseplate sketch header layout styles to stack content vertically. Positioned scrub speed controls on the first row and the Drivers label on the second row.`

#### Scope / Constraints Honored
- UI-only layout adjustment.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph compile/evaluate/runtime behavior changes.

#### Summary of Implementation
- Updated Baseplate sketch header layout styles to stack content vertically.
- Positioned scrub speed controls on the first row and the `Drivers` label on the second row.
- Kept existing control behavior and interaction handling unchanged.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- `Drivers` is no longer horizontally aligned with the speed controls; it now appears one row lower.
- Scrub controls remain right-aligned and functionally unchanged.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [038] - 2026-03-03 20:24 - `NI - Phase 3 - Baseplate And Node Surface UI - Title Click Forces Collapsed Mode`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a dedicated onBaseplateTitleClick callback from SpaghettiCanvas to NodeView. In NodeView, made the title text interactive only for Baseplate nodes.`

#### Scope / Constraints Honored
- Canvas/UI-only change.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph compile/evaluate semantic changes.

#### Summary of Implementation
- Added a dedicated `onBaseplateTitleClick` callback from `SpaghettiCanvas` to `NodeView`.
- In `NodeView`, made the title text interactive only for Baseplate nodes:
  - stops pointer-down propagation to avoid node drag initiation from title clicks,
  - invokes the callback on click.
- In `SpaghettiCanvas`, callback sets row mode directly to `collapsed`.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Clicking the `Baseplate` text in the node header now forces canvas row mode to `collapsed`.
- Other node title clicks are unchanged.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [037] - 2026-03-03 22:38 - `PT - Phase 5 - Part Template Population - Driver VM And Template-Flag NodeView`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added explicit part-template metadata to node definitions. Added generic driver VM resolver (driverVm.ts) that maps node metadata + params to render rows without node-type branching in NodeView.`

#### Scope / Constraints Honored
- UI-only refactor in canvas/registry/theme layers.
- No edits under `src/app/spaghetti/compiler/**`, `src/app/spaghetti/integration/**`, or `src/worker/**`.
- No protocol/scheduler changes.
- Deterministic ordering preserved via metadata order and stable endpoint keys.

#### Summary of Implementation
- Added explicit part-template metadata to node definitions:
  - `template?: 'part'`
  - `inputDrivers` and `outputDrivers` specs
  - feature-param driver (`firstExtrudeDepth`) and reserved output (`mesh`, `pending`) support.
- Added generic driver VM resolver (`driverVm.ts`) that maps node metadata + params to render rows without node-type branching in `NodeView`.
- Refactored `NodeView` to a template-driven renderer:
  - chooses part-template path only via `template === 'part'`,
  - renders canonical section order,
  - keeps Output Drivers pinned before everything-only sections,
  - renders Input Drivers rows even in collapsed mode,
  - renders reserved mesh row as disabled (dot visible, non-wireable, no endpoint registration).
- Updated `SpaghettiCanvas` to:
  - precompute and pass compact `driverVm`,
  - handle driver numeric edits generically (`nodeParam` + `featureParam:firstExtrudeDepth`),
  - keep `otherOutputs` deterministic as all outputs minus output-driver endpoints.
- Updated `FeatureStackView` with `mode: 'summary' | 'full'` and wired summary/full behavior by row mode.
- Added disabled-port interaction guard support for reserved rows using `data-sp-disabled-port="1"`.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part-node layout is now metadata/template driven rather than node-type branching in `NodeView`.
- Collapsed mode keeps Input Driver and Output Driver endpoint anchors visible; hidden internals do not register anchors.
- Essentials mode shows only drivers + feature stack summary (legacy/debug sections hidden).
- Everything mode shows drivers + full feature stack, then other outputs and legacy/debug sections.
- Reserved Mesh Output row is visibly disabled, always shows a dot, and is non-interactive for wiring.

#### Verification Steps
- `rg -n "Baseplate|ToeHook|HeelKick|Part/Baseplate|Part/ToeHook|Part/HeelKick" src/app/spaghetti/canvas/NodeView.tsx` (no matches)
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [036] - 2026-03-03 20:20 - `NI - Phase 3 - Baseplate And Node Surface UI - Input Click Promotes To Essentials`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated handleNodePointerDown in SpaghettiCanvas to resolve the clicked node before drag start. In collapsed row mode, clicking an input/source-style node now schedules setRowViewMode('essentials').`

#### Scope / Constraints Honored
- Canvas/UI-only change in allowed layer.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Updated `handleNodePointerDown` in `SpaghettiCanvas` to resolve the clicked node before drag start.
- In `collapsed` row mode, clicking an input/source-style node now schedules `setRowViewMode('essentials')`.
- Input/source-style node detection is based on node definition shape: zero inputs and at least one output.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Clicking an input/source node while canvas row mode is `collapsed` now opens row mode to `essentials`.
- Existing node selection and drag initiation behavior for non-interactive node surface remains unchanged.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [035] - 2026-03-03 20:08 - `NI - Phase 3 - Baseplate And Node Surface UI - Chevron Interaction Guard`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added reusable interactive-target predicate in canvas. Updated handleNodePointerDown in SpaghettiCanvas.`

#### Scope / Constraints Honored
- Canvas/UI-only changes.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No row-mode or composite-evaluation semantic changes.

#### Summary of Implementation
- Added reusable interactive-target predicate in canvas:
  - `isSpaghettiInteractiveTarget(target: EventTarget | null)`.
  - Matches `data-sp-interactive="1"` first, then form-control and existing Spaghetti interactive selectors.
- Updated `handleNodePointerDown` in `SpaghettiCanvas`:
  - replaced inline interactive selector logic with predicate call,
  - removed early interactive-branch `stopPropagation`,
  - retained existing drag-init path behavior for non-interactive node surface.
- Marked interactive controls with `data-sp-interactive="1"`:
  - composite chevron button,
  - value bar container/track,
  - range input,
  - context-menu root container.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- When Baseplate node is selected, clicking `Anchor Point 1` (and other composite) chevron now expands/collapses immediately without requiring deselection.
- Node drag still starts from non-interactive node areas.
- Port wire drag, value scrubbing, and context menu interactions remain available through interactive elements.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [034] - 2026-03-03 18:09 - `NI - Phase 3 - Baseplate And Node Surface UI - Anchor Bar Forces Essentials Mode`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a canvas click-capture guard that detects clicks inside Baseplate sketch anchor-point value bars. Detection now resolves to the parent composite group root port label (Anchor Point 1..5) so leaf X/Y bar clicks are included.`

#### Scope / Constraints Honored
- UI-only patch in canvas layer.
- No changes under `features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- Row-mode transition remains render/UI-only behavior.

#### Summary of Implementation
- Added a canvas click-capture guard that detects clicks inside Baseplate sketch anchor-point value bars.
- Detection now resolves to the parent composite group root port label (`Anchor Point 1..5`) so leaf `X/Y` bar clicks are included.
- Mode transition is forced one-way to `essentials` via `requestAnimationFrame` to avoid ending in any other row mode during the same click cycle.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Clicking any sketch anchor-point value bar now settles row mode to `essentials` deterministically, including clicks on expanded leaf bars.
- No compile/evaluate/runtime behavior changed.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [033] - 2026-03-03 18:03 - `NI - Phase 3 - Baseplate And Node Surface UI - Canvas Drag Rerender Guard`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a stable connectionDragAnchor snapshot in SpaghettiCanvas derived only from anchor identity fields (direction, nodeId, portId, path). Switched hover validation and input/output drop-state callbacks to depend on the stable anchor snapshot instead of the full connectionDrag object.`

#### Scope / Constraints Honored
- UI repair only in allowed canvas layer.
- No changes in `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler edits.
- Row mode and composite expansion behavior remain render-only concerns.

#### Summary of Implementation
- Added a stable `connectionDragAnchor` snapshot in `SpaghettiCanvas` derived only from anchor identity fields (`direction`, `nodeId`, `portId`, `path`).
- Switched hover validation and input/output drop-state callbacks to depend on the stable anchor snapshot instead of the full `connectionDrag` object.
- This prevents per-pointer-move callback identity churn from propagating into memoized `NodeView` props during wire dragging.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- While dragging a wire, node drop-state rendering now updates based on anchor/hover target changes rather than every pointer-position update, reducing avoidable node rerenders.
- No graph compile/evaluate semantics were changed; no row mode or composite state semantics were changed.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [032] - 2026-03-03 17:55 - `VM - Phase 3 - UI Stabilization - Composite Map State + Output Leaf Rendering`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added row-mode helper flags in rowViewMode limited to row concerns only. Added composite expansion key helper with exact parent-key format.`

#### Scope / Constraints Honored
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No CAD/feature execution logic moved into UI.
- No compiler behavior changes for graph semantics.
- Row modes remain render-only controls.

#### Summary of Implementation
- Added row-mode helper flags in `rowViewMode` limited to row concerns only:
  - `showEditors`
  - `showDebugInfo`
  - `renderLeafRows`
  - `forceLeafRows`
- Added composite expansion key helper with exact parent-key format:
  - `spComp|in|${nodeId}|${portId}`
  - `spComp|out|${nodeId}|${portId}`
- Moved composite expansion state ownership to `SpaghettiCanvas` using `Map<string, boolean>` and map-safe update helpers.
- Removed `evaluateSpaghettiGraph` usage from `NodeView`; node evaluation/derived display data are now prepared in `SpaghettiCanvas` and passed as node-scoped props.
- Kept `NodeView` render-focused and memoized while avoiding broad store subscriptions.
- Implemented composite output leaf rendering with deterministic field-tree traversal and mode-gated visibility:
  - `collapsed`: parent only
  - `essentials`: expansion-gated leaves
  - `everything`: forced leaf visibility without mutating stored expansion state
- Ensured output leaf anchors mount only when leaf rows are rendered; parent anchors remain mounted.
- Replaced per-node inline hover/drop wrappers from canvas render loop with stable shared callbacks.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/canvas/compositeExpansion.ts`
- `src/app/spaghetti/canvas/compositeExpansion.test.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes
- Row mode semantics are now explicit and deterministic for composite leaves across input/output columns.
- Composite expansion state is now parent-row scoped for both directions (`in` and `out`) and stored as canvas-local map state.
- `NodeView` no longer performs graph evaluation; UI rendering is separated from evaluation logic.
- Output composite ports now expose deterministic leaf rows/anchors when visible by mode.
- No compiler/worker/protocol behavior changes.

#### Perf Check
- Method: render-path stability audit focused on `NodeView` subtree invalidation sources.
- Verified changes:
  - node-scoped derived render payload is memoized in `SpaghettiCanvas` (`nodeRenderDataById`),
  - composite expansion mutation bumps revision for the affected node only,
  - shared hover/drop handlers are stable callbacks rather than per-node inline wrappers.
- Result: non-node canvas state updates no longer introduce avoidable node-subtree prop churn from those prior wrapper/data patterns.

#### CSS Impact
- Global theme selectors changed: none.
- Local class strategy retained; no `v15Theme.css` selector edits were required for this pass.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [031] - 2026-03-03 17:04 - `DR - Phase 7 - Expose Fields And View Modes`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added fieldTree composite definitions for spline2 and profileLoop with deterministic leaf traversal. Added deterministic tests for new fieldTree leaf paths.`

#### Scope / Constraints
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No auto-build trigger behavior changes.
- Determinism preserved for composite field ordering and path-aware endpoint handling.
- Composite context menus remain node-scoped (no `createPortal(document.body)`).
- Legacy mixed whole+leaf graphs preserved with warning behavior; no edge deletion.
- Parent composite anchor remains active in collapsed row mode.
- Part panel ordering preserved when visible: `uiSections -> params -> Feature Stack`.

#### Summary
- Added `fieldTree` composite definitions for `spline2` and `profileLoop` with deterministic leaf traversal.
- Added deterministic tests for new `fieldTree` leaf paths.
- Extended `validateGraph` tests with test-local `profileLoop` fixture node defs (no runtime node-type additions).
- Added expanded-canvas row view modes: `collapsed`, `essentials` (default), `everything`.
- Wrapped `NodeView` in `React.memo` and passed `rowViewMode` as a stable union prop from `SpaghettiCanvas`.
- Enforced composite expansion state key scope to parent row only: `spComp|in|${nodeId}|${portId}`.
- Applied mode filters:
  - `collapsed`: parent rows/anchors visible, leaf rows hidden.
  - `essentials`: labels/types/editors/composite expansion visible; debug/info hidden.
  - `everything`: full debug/info visibility and full field disclosure rendering.
- Generalized composite handling beyond vec2 while preserving existing driven-authority behavior.
- Normalized baseplate spline output display labels to:
  - `Base Plate Spline (Inner)`
  - `Base Plate Spline (Outer)`
- Added minimal `spComp_` and `spView_` CSS hooks for mode/control styling.

#### Files Changed
- `src/app/spaghetti/types/fieldTree.ts`
- `src/app/spaghetti/types/fieldTree.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes
- Composite types `spline2` and `profileLoop` now expose deterministic leaf paths in app-layer field tree introspection.
- Row mode now controls node-port disclosure without mutating graph edges or compile/evaluate semantics.
- In collapsed row mode, parent composite anchors remain wireable while leaf anchors are hidden.
- Essentials mode now suppresses debug/info UI while preserving core port labels, type tags, editors, and composite expansion interactions.
- Everything mode shows debug/info panels and full recursive composite leaf rendering.
- Baseplate spline output labels are standardized for UI display without changing port IDs/types.

#### Verification
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [030] - 2026-03-03 16:05 - `FS - Phase 11 - Feature Stack v1 Debug Preview - App-Layer IR-Driven UI`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added deterministic Feature Stack Debug Preview driven by compile-path IR (no UI-side compileFeatureStack calls). Extracted shared compile helper in compileGraph so payload emission and UI cache use the same part IR derivation path.`

#### Scope / Constraints
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No auto-build trigger behavior added.
- Deterministic ordering/labels/rendering enforced for preview and diagnostics.
- Feature Stack panel placement updated to locked order: `uiSections -> params -> Feature Stack`.

#### Summary
- Added deterministic Feature Stack Debug Preview driven by compile-path IR (no UI-side `compileFeatureStack` calls).
- Extracted shared compile helper in `compileGraph` so payload emission and UI cache use the same part IR derivation path.
- Added store-level cache and selector for per-part Feature Stack IR mapped from nodeId.
- Added sketch profile SVG previews with deterministic fit mapping, closed-loop visual enforcement, stable labels, and stable numeric formatting.
- Added extrude preview summary and profile highlight based strictly on `profileRef.profileId`.
- Applied deterministic diagnostics sort/key policy and per-level badge counts.
- Added namespaced `fsPrev_*` styles and pure-function tests for preview determinism.

#### Files Changed
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/ui/features/profilePreview.tsx`
- `src/app/spaghetti/ui/features/profilePreview.test.ts`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes
- Feature previews now consume compile-path part IR via store cache (`getPartFeatureStackIrForNode`) instead of recompiling in UI.
- Sketch preview profile ordering is now deterministic: area descending, then `profileId` ascending.
- Sketch/extrude preview labels now use `A..Z`, then `Profile <n>` fallback.
- Extrude preview highlight now keys only on `profileRef.profileId`.
- Diagnostics display now applies stable ordering (`error`, `warning`, `info`, then message, then featureId) and deterministic keys.
- Part node panel order is now `uiSections -> params -> Feature Stack`.

#### Verification
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [029] - 2026-03-03 15:37 - `FS - Phase 10 - Feature Stack v1 Worker Pipeline - Option-B Runtime Execution`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added app compile emission for Option-B sketch payload. Added worker feature stack runtime that.`

#### Scope / Constraints
- Implemented worker + CAD runtime execution for Feature Stack v1 with deterministic in-memory mesh-pack adapter.
- No scheduler behavior changes.
- No shared protocol contract changes.
- No auto-build behavior changes.
- Legacy build result envelope remains `PartArtifact[]`.
- Worker payload handling remains branch-specific flat profile patch (`payload.sp_featureStackIR` namespace).

#### Summary
- Added app compile emission for Option-B sketch payload:
  - `IRSketch.profilesResolved: [{ profileId, area, vertices[] }]`
  - deterministic ordered loop vertices with CCW normalization
  - runtime closes loops when needed
- Added worker feature stack runtime that:
  - executes parts in sorted key order
  - executes features in IR order
  - treats app-emitted `profileId` as authoritative
  - does not re-derive profiles from lines
  - extrudes by `profileRef.profileId` with `bodyId = ir.bodyId ?? ir.featureId`
  - applies first-wins policy on duplicate `bodyId`
  - performs deterministic mesh-pack merge (not CAD boolean fuse)
- Added bounded deterministic diagnostics:
  - dedup key: `${partKey}|${featureId}|${reason}`
  - single flush per build via worker build orchestrator
- Integrated runtime into active worker build path through a new thin `buildModel` coordinator while preserving legacy artifacts output.

#### Files Changed
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/worker/cad/cadTypes.ts`
- `src/worker/cad/cadKernelAdapter.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/products/foothook/buildFoothook.ts`
- `docs/listofchanges.md`

#### Behavior Changes
- App compile IR now includes `profilesResolved` loop geometry for sketch ops (Option-B lock).
- Worker Feature Stack execution is active when `sp_featureStackIR` is present in current payload patch namespace.
- Worker now emits at most one aggregated warning log per build for unique runtime warnings.
- Runtime merge semantics are deterministic mesh concatenation in stable bodyId order; no CAD boolean claims.

#### Verification
- `npm.cmd --prefix parahook run test`
- `npm.cmd --prefix parahook run build`
- Vite large-chunk warning remains unchanged (non-regression).

<!-- ============================================================ -->
### [028] - 2026-03-03 - `FS - Phase 9 - Feature Stack v1 App-Layer Alignment`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added canonical profile derivation exports. Kept compatibility alias.`

#### Scope / Constraints Honored
- App-layer only changes.
- No worker/protocol/scheduler contract changes.
- No auto-build behavior changes.
- `buildRequestSchema.profile` remains `z.record(z.string(), z.unknown())`.
- Existing composite/path/wiring behavior preserved.

#### Feature API Alignment
- Added canonical profile derivation exports:
  - `hashFnv1a32(str)`
  - `profileIdFromSignature(sig)`
  - `deriveProfiles(entities)`
- Kept compatibility alias:
  - `deriveProfilesFromLines = deriveProfiles`
- Added canonical auto-link export:
  - `pickDefaultProfileRef(stack, insertIndex)`
- Kept compatibility alias:
  - `findDefaultExtrudeProfileRef = pickDefaultProfileRef`
- Aligned diagnostics type to canonical shape:
  - `Diagnostic = { featureId, level, message }`
- Kept compatibility type alias:
  - `FeatureDiagnostic = Diagnostic`

#### Determinism and Derivation Contract
- Updated profile derivation to locked deterministic rules:
  - point keys use exact `${String(x)}|${String(y)}`
  - exact literal endpoints (no tolerance rounding path)
  - deterministic adjacency and traversal
  - canonical signature normalization (rotation + direction)
  - stable FNV-1a 32-bit base36 profile IDs
  - zero-area loop rejection
  - stable output sorting: area desc, signature asc, profileId asc

#### Store / UI Alignment
- Store now uses canonical helpers:
  - `deriveProfiles(...)`
  - `pickDefaultProfileRef(...)`
- Added/used part stack helpers:
  - `getPartFeatureStack(node)`
  - `setPartFeatureStack(node, stack)`
- Sketch profile outputs are recomputed immediately after line edits.
- Feature stack UI diagnostics no longer rely on `diagnostic.code`.
- Diagnostics keys are deterministic:
  - `${featureId}|${level}|${message}|${index}`
- Extrude collapsed summary now matches spec format:
  - `Profile: <SketchShort>/<ProfileLabel>, Depth: <value>`
- Profile labels use `A..Z` then `Profile <n>` fallback.

#### Compile / Payload Alignment
- `sp_featureStackIR` compile emission aligned to non-empty feature stack presence.
- Emitted IR payload remains:
  - `{ schemaVersion: 1, parts: Record<PartKey, IR[]> }`
- Existing part-key mapping retained (`baseplate`, `toeHook#1`, `heelKick#1`) with deterministic behavior.
- Patch/change detection path continues using stable hashing and includes `sp_featureStackIR`.

#### Files Changed
- `src/app/spaghetti/features/profileDerivation.ts`
- `src/app/spaghetti/features/autoLink.ts`
- `src/app/spaghetti/features/diagnostics.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/features/profileDerivation.test.ts`
- `src/app/spaghetti/features/autoLink.test.ts`

#### Verification
- `npm.cmd run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

#### Interaction Boundary Guard Fix (2026-03-04)
- Fix: prevent node drag/select from capturing UI control pointerdown; audit interactive markers.
- Added shared interaction helper `src/app/spaghetti/spInteractive.ts`:
  - `isInteractiveTarget(target)` selector guard
  - `SP_INTERACTIVE_PROPS` (`data-sp-interactive` + pointerdown stopPropagation)
- Updated canvas drag/select boundary handling:
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` now uses `isInteractiveTarget` in node pointerdown handling
  - stage deselect pointerdown now ignores interactive targets
- Audited/updated interactive control guards in:
  - `src/app/spaghetti/canvas/PortView.tsx`
  - `src/app/spaghetti/canvas/fields/NumberField.tsx`
  - `src/app/spaghetti/canvas/fields/Vec2Field.tsx`
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
  - `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - `src/app/spaghetti/canvas/NodeView.tsx`

<!-- ============================================================ -->
### [027] - 2026-03-03 - `SP - Phase 4 - Floating Window Follow-up - Default Geometry + Drag`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated default Spaghetti floating window open anchor to start around 30% down from viewport top. Re-enabled normal dragging immediately on open (removed resize-first drag gating).`

#### Floating Window Behavior
- Updated default Spaghetti floating window open anchor to start around 30% down from viewport top.
- Re-enabled normal dragging immediately on open (removed resize-first drag gating).
- First drag now marks the floating window as user-positioned so it behaves like a normal float window.
- Updated default open width to span from the left side to the left side of the gizmo/right overlay area.
- Updated default open height to span from the 30% top anchor down to the viewport bottom (subject to existing clamp/padding).

#### Files Changed
- `src/app/AppShell.tsx`

<!-- ============================================================ -->
### [026] - 2026-03-03 - `GE - Phase 7 - Early Modern Baseline - Compiled Master Entry`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added Vitest setup and tests for field tree, validator path rules, and evaluator precedence. Added npm run test script and vitest dev dependency.`

#### Scope / Locked Invariants
- App-layer only changes in this phase; no worker/protocol/scheduler contract changes.
- Compile/build remains explicit; canvas interactions do not auto-trigger build.
- Determinism preserved for path-aware logic and composite handling (edge traversal sorted by `edgeId` where required).
- Composite context menus remain node-scoped (no `createPortal(document.body)`).
- Parent composite anchor remains active while collapsed.
- Legacy mixed graphs (whole + leaf edges) are preserved; UI warns but does not delete edges.

#### Canvas and Node Editor UX
- Added right-click canvas node-add menu with search, placing nodes at cursor.
- Added typed color coding for ports/anchors so colors match port kinds.
- Updated anchor measurement to use actual small port-circle elements.
- Fixed floating editor/canvas anchoring so node editor fills/anchors correctly in floating window.
- Added collapsible `Preview Mode` and `Parts List` sections.
- Updated node layout to top-left inputs and bottom-right outputs.
- Baseplate node now presents `Drivers` and `Sketch Inputs` sections with grouped labels.

#### Wire Routing and Editing
- Added wire curviness slider (`0` linear, `25` baseline, `100` highly curved).
- Added reroute-point editing:
  - double-click wire to add point
  - drag point to reshape
  - double-click point to remove
  - supports multiple points per wire
- Enforced node-end tangency:
  - outputs depart right-tangent
  - inputs arrive left-tangent
- Added tangent controls for selected waypoints:
  - `Flip Tangent Side 1`
  - `Flip Tangent Side 2`
- Reworked waypoint segment routing to keep tangency through reroute points.

#### Numeric Controls and Baseplate Sketch UX
- Moved Baseplate `width`/`length` to inline port controls.
- Added matching inline template for `Primitive/Number`.
- Unified value-bar control includes:
  - blue fill by min/max range
  - label + value in one row
  - arrow step nudging
  - horizontal drag-scrub
- Added Baseplate vec2 sketch inputs `anchorPoint1..anchorPoint5` under `Sketch Inputs`.
- Each vec2 sketch input uses 50/50 `X`/`Y` inline layout.
- Width/Length driver updates resync sketch points to canonical rectangle.
- Added Baseplate scrub-speed toggle (`low` blue / `high` green) and increased `high` sensitivity.

#### Composite Field Tree and Path Endpoint System
- Added composite field introspection:
  - `getFieldTree`
  - `getFieldNodeAtPath`
  - `isCompositeFieldNode`
  - `listLeafFieldPaths`
  - vec2 mapping for `vec2:mm` and `vec2:unitless` -> `{ x, y }`
- Upgraded endpoints to optional path:
  - `EdgeEndpoint = { nodeId, portId, path?: string[] }`
  - schema keeps no-path compatibility and validates non-empty path segments when present
- Store normalization updates:
  - empty path -> `undefined`
  - legacy synthetic migrations:
    - `anchorPointNX` -> `anchorPointN` + `path: ['x']`
    - `anchorPointNY` -> `anchorPointN` + `path: ['y']`
  - connection drag now carries `fromPath`
- Canvas anchor keys and wire rendering are path-aware:
  - `buildPortAnchorKey` includes encoded path token
  - `parsePortAnchorKey` added
  - wire lookup/render includes endpoint paths
- Connection flow (`SpaghettiCanvas`) is path-aware:
  - hover compatibility checks full endpoint `(nodeId, portId, path)`
  - duplicate detection checks full endpoint
  - rewire uses exact input endpoint (including leaf path)
  - cycle check remains node-level via `validateGraph`
  - details lines display endpoint paths
- Composite renderer changes:
  - NodeView owns transient expansion map
  - PortView local expansion removed
  - composite leaf rows generated from field tree paths
  - child rows register path endpoints/anchors
  - Baseplate vec2 uses canonical `x`/`y` child paths (no synthetic scalar ports)
- Validator updates:
  - base port/path existence checks
  - path endpoints must resolve to leaf
  - leaf type exact-match
  - duplicate leaf target rejection
  - max connections enforced per endpoint key (`node + port + path`)
  - cycle detection unchanged
- Evaluator updates (deterministic):
  - composite input priority:
    1) leaf-path wires
    2) whole-port wire fallback
    3) literal fallback
    4) type-default fallback
  - respects `from.path`
  - edge ordering sorted by `edgeId`
  - unresolved optional composites inject defaults per locked decisions
- Compile helper updates:
  - whole-port compile lookup ignores target leaf edges
  - source extraction respects optional `from.path`

#### Composite Vec2 Parent UX (Break/Group + Info Menu)
- Collapsed composite vec2 parent rows render inline `X`/`Y` value bars (blue tone, 50/50 split).
- Parent anchor remains active while collapsed.
- Inline editors continue using existing literal param backing values (no new literal store).
- Whole-port driven authority mode:
  - NodeView computes local driven maps from store edges (sorted by `edgeId`)
  - whole-driven: collapsed/expanded leaf editors become read-only
  - whole-driven: leaf drop/rewire blocked with status `Driven by parent wire`
  - leaf-driven (x/y only): per-axis disable on collapsed row
  - whole display prefers evaluated source output; falls back to literal when unresolved
  - legacy whole+leaf preserved with warning badge `Leaf override exists`
- Parent-row context menu (node-scoped absolute menu):
  - `Break composite` / `Group pins`
  - `Show info` / `Hide info`
  - closes on outside click and `Escape`
  - right-click prevents default/propagation so canvas add-node menu is not triggered
- Menu positioning fix:
  - opens under cursor correctly under canvas transforms/zoom
  - coordinates account for node scale
- Removed top-right composite action buttons in favor of context menu actions.
- Added CSS support for inline XY, driven/disabled states, warning badge, and menu visuals.

#### Testing and Tooling
- Added Vitest setup and tests for field tree, validator path rules, and evaluator precedence.
- Added `npm run test` script and `vitest` dev dependency.

#### Files Changed (Grouped by Area)
- Canvas/UI core:
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - `src/app/spaghetti/canvas/WireLayer.tsx`
  - `src/app/spaghetti/canvas/spaghettiWires.ts`
  - `src/app/spaghetti/canvas/types.ts`
- Node/port/composite UI:
  - `src/app/spaghetti/canvas/NodeView.tsx`
  - `src/app/spaghetti/canvas/PortView.tsx`
  - `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
  - `src/app/spaghetti/ui/CollapsedEditor.tsx`
  - `src/app/spaghetti/ui/ExpandedEditor.tsx`
  - `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- Schema/store/types:
  - `src/app/spaghetti/schema/spaghettiTypes.ts`
  - `src/app/spaghetti/schema/spaghettiSchema.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/spaghetti/types/fieldTree.ts`
- Compiler/runtime behavior:
  - `src/app/spaghetti/compiler/validateGraph.ts`
  - `src/app/spaghetti/compiler/evaluateGraph.ts`
  - `src/app/spaghetti/compiler/compileGraph.ts`
- Registry/theme/tooling/tests:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/theme/v15Theme.css`
  - `package.json`
  - `src/app/spaghetti/types/fieldTree.test.ts`
  - `src/app/spaghetti/compiler/validateGraph.test.ts`
  - `src/app/spaghetti/compiler/evaluateGraph.test.ts`

#### Verification
- `npm.cmd run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)


<!-- ============================================================ -->
### Reconstructed from here down
<!-- ============================================================ -->
HUMAN SUMMARY: `This marks the point where the changelog shifts from shipped modern entries into reconstructed earlier history.`


<!-- ============================================================ -->
### Reconstructed `Gap`
HUMAN SUMMARY: `This marks an inferred bridge entry reconstructed from incomplete evidence rather than a fully evidenced historical log.`
### [025] - [Gap] - `First Landed Graph / Feature Stack / Expose Fields Implementation Wave`
<!-- ============================================================ -->
HUMAN SUMMARY: `Likely captured the first landed implementation wave that turned earlier graph, Feature Stack, and expose-fields planning into real shipped work. Likely bridged the restored conversation-era systems into the first visible shipped changelog band.`
#### Scope / Constraints Honored
- Recovered bridge entry with incomplete evidence.
- Preserved the distinction between recovered completed entries and inferred bridge entries.

#### Summary of Implementation
- Likely captured the first landed implementation wave that turned earlier graph, Feature Stack, and expose-fields planning into real shipped work.
- Likely bridged the restored conversation-era systems into the first visible shipped changelog band.
- Likely established enough product/runtime continuity for the later shipped entries to appear as already-standing work.

#### Files Changed
- exact file set unknown
- likely touched early Spaghetti, Feature Stack, driver, and build-integration files

#### Behavior Changes (if any)
- Likely marked the real transition from restored planning/history into the first shipped modern graph wave.

#### Verification Steps
- Review compiled gap row `[025]`.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
### Reconstructed `Gap`
HUMAN SUMMARY: `This marks an inferred bridge entry reconstructed from incomplete evidence rather than a fully evidenced historical log.`
### [024] - [Gap] - `Restored History To First Shipped Changelog Handoff`
<!-- ============================================================ -->
HUMAN SUMMARY: `Likely captured the handoff from the restored conversation-derived restart work into the first shipped changelog era. Likely stabilized enough app/store/panel/runtime behavior for the shipped changelog band to begin.`
#### Scope / Constraints Honored
- Recovered bridge entry with incomplete evidence.
- Preserved the distinction between recovered completed entries and inferred bridge entries.

#### Summary of Implementation
- Likely captured the handoff from the restored conversation-derived restart work into the first shipped changelog era.
- Likely stabilized enough app/store/panel/runtime behavior for the shipped changelog band to begin.

#### Files Changed
- exact file set unknown
- likely touched the app shell, store wiring, and early modern graph/runtime surfaces

#### Behavior Changes (if any)
- Likely marks a continuity handoff more than one single isolated feature.

#### Verification Steps
- Review compiled gap row `[024]`.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [023] - [Conv 9] - `SP - Phase 3 - Spaghetti Editor S3 - Compile To Build Integration`
<!-- ============================================================ -->
HUMAN SUMMARY: `Connected Spaghetti compile output into the live build path. Turned Spaghetti from an isolated graph/editor experiment into a real authoring input mode.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and later canonical phase reconstruction.
- Preserved the existing warm-worker runtime direction.
- Preserved the existing app -> worker -> viewer separation.

#### Summary of Implementation
- Connected Spaghetti compile output into the live build path.
- Turned Spaghetti from an isolated graph/editor experiment into a real authoring input mode.
- Preserved the current worker path while feeding it graph-produced build intent.

#### Files Changed
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/buildDispatcher.ts`
- `src/worker/buildModel.ts`
- `src/shared/buildTypes.ts`

#### Behavior Changes (if any)
- The graph system could now drive the live build path instead of staying only a planning/editor surface.

#### Verification Steps
- Review compiled row `[023]` and the canonical phase log for `SP - Phase 3`.
- Confirm the draft stays consistent with the later shipped changelog wording around early Spaghetti integration.


<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [022] - [Conv 9] - `GE - Phase 6 - Worker Affected-Part Routing And Cache Preference`
<!-- ============================================================ -->
HUMAN SUMMARY: `Defined worker-side affected-part routing as real build input. Added cache-preference thinking around unaffected parts.`
#### Scope / Constraints Honored
- Recovered history entry based on conversation-derived task logs.
- Preserved the one warm worker rule.
- Preserved the current deterministic stub-output baseline while routing work matured.

#### Summary of Implementation
- Defined worker-side affected-part routing as real build input.
- Added cache-preference thinking around unaffected parts.
- Strengthened the engine toward selective recompute without restarting the architecture.

#### Files Changed
- `src/app/buildDispatcher.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/signatures.ts`

#### Behavior Changes (if any)
- The worker could reason more directly about which parts were affected by param changes.

#### Verification Steps
- Review restored `GE - Phase 6` detail in the phase log.
- Confirm the drafted summary matches the compiled title and recovered routing/signature work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [021] - [Conv 9] - `DR - Phase 3 - Param Ownership / Routing v20`
<!-- ============================================================ -->
HUMAN SUMMARY: `Applied modern param ownership and changed-id routing to the /20/ direction. Strengthened the bridge between param namespaces, affected-part routing, and future selective recompute.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored `/20/` restart planning.
- Preserved the new canonical param-ownership direction.
- Preserved the engine-first roadmap ordering.

#### Summary of Implementation
- Applied modern param ownership and changed-id routing to the `/20/` direction.
- Strengthened the bridge between param namespaces, affected-part routing, and future selective recompute.
- Reduced flat global rebuild thinking in favor of controlled routing.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`

#### Behavior Changes (if any)
- Param changes became more explicitly tied to part-owned routing behavior.

#### Verification Steps
- Review the compiled row `[021]` and the phase log entry for `DR - Phase 3`.
- Confirm the draft stays aligned with the earlier `PT` param-ownership phases.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [020] - [Conv 9] - `SP - Phase 2 - Spaghetti Editor S2 - Compute / Evaluate / Compile Skeleton`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added the first compute/evaluate skeleton for the graph system. Introduced compile-shape thinking into the Spaghetti layer.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored Spaghetti phase mapping.
- Preserved the existing app/worker/viewer split.
- Kept Spaghetti as a graph-authoring layer rather than a second runtime.

#### Summary of Implementation
- Added the first compute/evaluate skeleton for the graph system.
- Introduced compile-shape thinking into the Spaghetti layer.
- Prepared the graph to produce deterministic build-facing data.

#### Files Changed
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`

#### Behavior Changes (if any)
- Spaghetti became capable of producing meaningful compile-oriented graph output.

#### Verification Steps
- Review compiled row `[020]` and the phase log entry for `SP - Phase 2`.
- Confirm the draft fits between `SP - Phase 1` store/schema work and `SP - Phase 3` compile-to-build integration.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [019] - [Conv 9] - `SP - Phase 1 - Spaghetti Editor S1 - Schema / Validation / Store`
<!-- ============================================================ -->
HUMAN SUMMARY: `Landed the first serious Spaghetti graph schema and registry foundation. Added validation and cycle-awareness around the graph model.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and conversation-9 reconstruction.
- Preserved the main app/worker/viewer separation.
- Added graph ownership without changing product truth outside the new graph system.

#### Summary of Implementation
- Landed the first serious Spaghetti graph schema and registry foundation.
- Added validation and cycle-awareness around the graph model.
- Gave Spaghetti its own store foundation so it became a real subsystem.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`

#### Behavior Changes (if any)
- Spaghetti became a concrete graph subsystem with real state ownership.

#### Verification Steps
- Review compiled row `[019]` and the phase log entry for `SP - Phase 1`.
- Confirm the draft matches the earliest reconstructed schema/store/validation milestone.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [018] - [Conv 9] - `VM - Phase 2 - Instance-Aware Store And ViewModel Baseline`
<!-- ============================================================ -->
HUMAN SUMMARY: `Made instance-aware state and view-model shaping part of the baseline. Reduced single-instance assumptions across store and UI logic.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored task mapping.
- Preserved the selector-first view-model discipline established earlier.
- Preserved the app/worker separation.

#### Summary of Implementation
- Made instance-aware state and view-model shaping part of the baseline.
- Reduced single-instance assumptions across store and UI logic.
- Prepared the app for more than one owned part/view path.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/store/selectors.ts`
- `src/shared/partsTypes.ts`
- `src/app/panels/PartsListPanel.tsx`

#### Behavior Changes (if any)
- The app could reason more cleanly about multiple part/view identities instead of a single monolithic output path.

#### Verification Steps
- Review compiled row `[018]` and the phase log entry for `VM - Phase 2`.
- Confirm the draft stays consistent with later multi-part and parts-list work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [017] - [Conv 9] - `AS - Phase 4 - Canonical Part Identity And Assembled Direction`
<!-- ============================================================ -->
HUMAN SUMMARY: `Clarified part identity as a canonical concept instead of one loose preview blob. Strengthened the distinction between part outputs and the assembled output.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored phase summaries.
- Preserved the Parts List and artifact-driven product direction.
- Preserved the move away from scrubber/history UI.

#### Summary of Implementation
- Clarified part identity as a canonical concept instead of one loose preview blob.
- Strengthened the distinction between part outputs and the assembled output.
- Moved the product away from looser `final` wording and toward assembled identity.

#### Files Changed
- `src/shared/partsTypes.ts`
- `src/shared/buildTypes.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/panels/PartsListPanel.tsx`

#### Behavior Changes (if any)
- The output model became easier to reason about in terms of parts versus assembled results.

#### Verification Steps
- Review compiled row `[017]` and the phase log entry for `AS - Phase 4`.
- Confirm the draft fits after the early parts/artifact baseline gap.

<!-- ============================================================ -->
### Reconstructed `Gap`
HUMAN SUMMARY: `This marks an inferred bridge entry reconstructed from incomplete evidence rather than a fully evidenced historical log.`
### [016] - [Gap] - `AS - Phase 3 - First Parts / Artifact Baseline`
<!-- ============================================================ -->
HUMAN SUMMARY: `Likely defined the first stable part/artifact identity layer between the restart and later assembled-direction work. Likely turned the product from one preview mesh into named output parts.`
#### Scope / Constraints Honored
- Recovered gap note with incomplete evidence.
- Preserved the existing parts-list and artifact-driven product direction.

#### Summary of Implementation
- Likely defined the first stable part/artifact identity layer between the restart and later assembled-direction work.
- Likely turned the product from one preview mesh into named output parts.
- Likely gave later part-order and assembled work a concrete baseline to build on.

#### Files Changed
- exact file set unknown
- likely touched `src/shared/partsTypes.ts`
- likely touched `src/shared/buildTypes.ts`
- likely touched `src/worker/pipeline/artifactEmitter.ts`

#### Behavior Changes (if any)
- Likely gave the early restart a clearer part/artifact identity model.

#### Verification Steps
- Review compiled gap row `[016]` and the gap-phase note in the canonical phase log.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
### Reconstructed Gap
HUMAN SUMMARY: `This marks an inferred bridge entry reconstructed from incomplete evidence rather than a fully evidenced historical log.`
### [015] - [Gap] - `GE - Phase 5 - First Running Box Vertical Slice`
<!-- ============================================================ -->
HUMAN SUMMARY: `Likely added the first width / length / height controls. Likely proved the first real end-to-end box slice through app, worker, and viewer.`
#### Scope / Constraints Honored
- Recovered gap note with incomplete evidence.
- Preserved the clean app -> worker -> viewer architecture.
- Preserved the one warm worker rule.

#### Summary of Implementation
- Likely added the first `width / length / height` controls.
- Likely proved the first real end-to-end box slice through app, worker, and viewer.
- Likely hardened the first dispatcher/latest-only rebuild loop around a running vertical slice.

#### Files Changed
- exact file set unknown
- likely touched `src/app/buildDispatcher.ts`
- likely touched `src/app/store/useAppStore.ts`
- likely touched `src/worker/worker.ts`
- likely touched `src/viewer/Viewer.ts`

#### Behavior Changes (if any)
- Likely turned the clean restart from a structural skeleton into a live vertical slice.

#### Verification Steps
- Review compiled gap row `[015]` and the gap-phase note in the canonical phase log.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
### Reconstructed `Gap`
HUMAN SUMMARY: `This marks an inferred bridge entry reconstructed from incomplete evidence rather than a fully evidenced historical log.`
### [014] - [Gap] - `GE - Phase 4 - First Repo Setup Execution`
<!-- ============================================================ -->
HUMAN SUMMARY: `Likely ran the clean restart Codex setup prompt against the real /20/parahook repo. Likely created the actual folder structure and starter app/viewer/worker/shared files.`
#### Scope / Constraints Honored
- Recovered gap note with incomplete evidence.
- Preserved the clean restart architecture direction.
- Preserved the early `/20/` repo setup assumptions.

#### Summary of Implementation
- Likely ran the clean restart Codex setup prompt against the real `/20/parahook` repo.
- Likely created the actual folder structure and starter app/viewer/worker/shared files.
- Likely verified the first executable repo baseline before the box vertical slice.

#### Files Changed
- exact file set unknown
- likely touched the initial repo bootstrap files under `src/`
- likely touched `package.json`, `vite.config.ts`, and `tsconfig*.json`

#### Behavior Changes (if any)
- Likely marks the first real execution step of the `/20/` clean restart.

#### Verification Steps
- Review compiled gap row `[014]` and the gap-phase note in the canonical phase log.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [013] - [Conv 8] - `ADV - Phase 2 - Roadmap Ordering`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked routing and ownership work ahead of UI polish. Locked engine foundation ahead of richer parts-toolbar expansion.`
#### Scope / Constraints Honored
- Recovered history entry based on restored conversation evidence.
- Planning-heavy entry that shaped later implementation order.
- Preserved the clean restart architecture assumptions.

#### Summary of Implementation
- Locked routing and ownership work ahead of UI polish.
- Locked engine foundation ahead of richer parts-toolbar expansion.
- Delayed real toe replacement until the routing foundation was stable enough.
- Produced the first human-readable restart roadmap that connected the clean engine baseline to later real-toe work.

#### Files Changed
- `PLANS.md`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/shared/productSchema.ts`
- `src/shared/buildTypes.ts`

#### Behavior Changes (if any)
- No immediate product behavior change.
- Established the priority order that guided the next phases of the restart.

#### Verification Steps
- Review restored `ADV - Phase 2` in the history task log and phase log.
- Confirm the draft reflects roadmap sequencing rather than shipped UI behavior.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [012] - [Conv 8] - `ADV - Phase 1 - Future-Ready Systems`
<!-- ============================================================ -->
HUMAN SUMMARY: `Identified undo/redo as canonical-state history rather than mesh history. Identified shareable URLs/codes as canonical-state serialization features.`
#### Scope / Constraints Honored
- Recovered history entry based on restored conversation evidence.
- Planning-heavy entry that defined future-ready system direction.
- Preserved the canonical-state rule.

#### Summary of Implementation
- Identified undo/redo as canonical-state history rather than mesh history.
- Identified shareable URLs/codes as canonical-state serialization features.
- Kept delta-style performance as a future goal while using full snapshots plus caching as the safer baseline.
- Preserved these systems as future-ready architecture without forcing them into the first clean restart phase.

#### Files Changed
- `src/shared/productSchema.ts`
- `src/shared/buildTypes.ts`
- `src/shared/canonicalLayout.ts`
- `src/worker/pipeline/signatures.ts`

#### Behavior Changes (if any)
- No immediate product behavior change.
- Established the correct ownership model for future undo/share/performance systems.

#### Verification Steps
- Review restored `ADV - Phase 1` detail in the history task log and phase log.
- Confirm the draft reads as a future-system direction lock, not a shipped feature drop.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [011] - [Conv 8] - `EX - Phase 1 - Future Export Shape`
<!-- ============================================================ -->
HUMAN SUMMARY: `Kept export as a worker-side concern instead of a viewer or UI convenience. Based future export on deterministic assembled/canonical state.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved worker ownership of export.
- Preserved deterministic assembled/canonical state as the export source.

#### Summary of Implementation
- Kept export as a worker-side concern instead of a viewer or UI convenience.
- Based future export on deterministic assembled/canonical state.
- Preserved export as part of the engine pipeline direction.
- Avoided tying export behavior to ad hoc UI or camera/view state.

#### Files Changed
- `src/worker/pipeline/exportService.ts`
- `src/shared/buildTypes.ts`
- `src/shared/exportTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/io/download.ts`

#### Behavior Changes (if any)
- No broad export feature landed yet, but the ownership boundary was locked correctly.

#### Verification Steps
- Review restored `EX - Phase 1` detail in the history task log and phase log.
- Confirm the draft reflects export direction rather than a full export feature rollout.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [010] - [Conv 8] - `VR - Phase 1 - Viewer Ownership`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked viewer-only controls as rebuild-free concerns. Kept camera, materials, and visibility as presentation behavior rather than CAD behavior.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the rule that viewer-only controls remain rebuild-free.
- Preserved the app/worker/viewer boundary.

#### Summary of Implementation
- Locked viewer-only controls as rebuild-free concerns.
- Kept camera, materials, and visibility as presentation behavior rather than CAD behavior.
- Preserved a clean viewer boundary for future workbench systems.
- Kept the worker focused on geometry and export artifacts instead of presentation state.

#### Files Changed
- `src/viewer/Viewer.ts`
- `src/viewer/scene/SceneManager.ts`
- `src/app/viewerBridge.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/viewer/gizmo/`
- `src/viewer/controlViz/`

#### Behavior Changes (if any)
- Viewer controls and presentation ownership were kept out of the geometry execution path.

#### Verification Steps
- Review restored `VR - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft matches the rebuild-free viewer rule.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [009] - [Conv 8] - `VM - Phase 1 - Selector Discipline`
<!-- ============================================================ -->
HUMAN SUMMARY: `Treated selectors as architecture, not late optimization. Used selectors to keep high-frequency UI surfaces subscribed only to the slices they need.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved Zustand state ownership.
- Preserved the clean app/worker separation.

#### Summary of Implementation
- Treated selectors as architecture, not late optimization.
- Used selectors to keep high-frequency UI surfaces subscribed only to the slices they need.
- Established source-state versus read-model discipline early.
- Prevented whole-store subscriptions from becoming the default pattern for the restart UI.

#### Files Changed
- `src/app/store/selectors.ts`
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/panels/BuildStatusPanel.tsx`

#### Behavior Changes (if any)
- UI rerender boundaries became more explicit and scalable.

#### Verification Steps
- Review restored `VM - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft reflects selector discipline rather than a late cleanup pass.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [008] - [Conv 8] - `JK - Phase 1 - Mode Structure`
<!-- ============================================================ -->
HUMAN SUMMARY: `Kept profileEditor as the primary geometry-authoring mode. Defined Jake Mode as a simplified wrapper over the main system.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved Profile Editor as the main geometry truth.
- Avoided creating a separate Jake geometry truth.

#### Summary of Implementation
- Kept `profileEditor` as the primary geometry-authoring mode.
- Defined Jake Mode as a simplified wrapper over the main system.
- Reserved Jake as a real product layer instead of a vague later add-on.
- Kept Jake visible in the clean-slate repo structure so it would not become a bolted-on afterthought.

#### Files Changed
- `src/app/jakeMode/JakeControls.tsx`
- `src/app/jakeMode/jakeConstraints.ts`
- `src/app/jakeMode/jakeAdapter.ts`
- `src/app/profileEditor/ProfileControls.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/productSchema.ts`

#### Behavior Changes (if any)
- The mode model became clearer: advanced authoring in the main editor, simplified control in Jake.

#### Verification Steps
- Review restored `JK - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft stays aligned with the later Jake-mode vision.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [007] - [Conv 8] - `PT - Phase 2 - Param Ownership Direction`
<!-- ============================================================ -->
HUMAN SUMMARY: `Defined the early param namespace direction around bp_*, th1_*, and hk1_*. Extended the same ownership pattern to future part instances.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the move toward part-owned params.
- Preserved routing-first sequencing.

#### Summary of Implementation
- Defined the early param namespace direction around `bp_*`, `th1_*`, and `hk1_*`.
- Extended the same ownership pattern to future part instances.
- Framed param ownership as the base for scalable per-part recompute.
- Kept param identity tied to part-instance thinking instead of falling back to flat global buckets.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/shared/partRouting.ts`
- `src/shared/buildTypes.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/signatures.ts`

#### Behavior Changes (if any)
- Params became more explicitly tied to part ownership rather than one flat namespace.

#### Verification Steps
- Review restored `PT - Phase 2` in the history task log and the canonical phase log.
- Confirm the draft matches the later routing and signature work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [006] - [Conv 8] - `PT - Phase 1 - Independent Part Thinking`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reframed the restarted app around independently buildable parts. Treated parts as focusable, visible, and eventually independently rebuildable.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the shift away from one opaque history stream.
- Preserved the move toward independently buildable parts.

#### Summary of Implementation
- Reframed the restarted app around independently buildable parts.
- Treated parts as focusable, visible, and eventually independently rebuildable.
- Prepared the product for multiple future part instances instead of one monolithic output.
- Tied part-list selection to part-focused controls so the UI could stay organized around real product pieces.

#### Files Changed
- `src/shared/partsTypes.ts`
- `src/shared/productSchema.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/store/useAppStore.ts`

#### Behavior Changes (if any)
- The product mental model shifted from one opaque result to multiple real parts.

#### Verification Steps
- Review restored `PT - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft stays aligned with the later parts-list and artifact phases.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [005] - [Conv 8] - `AS - Phase 2 - Deterministic Part Ordering`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked base parts first as the default visible ordering. Inserted future toe instances after the base parts in deterministic sequence.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the parts-list direction.
- Preserved stable deterministic ordering rules.

#### Summary of Implementation
- Locked base parts first as the default visible ordering.
- Inserted future toe instances after the base parts in deterministic sequence.
- Treated visible part order as a stable product rule rather than arbitrary UI sorting.
- Locked later parts to declared pipeline/build order instead of ad hoc UI order.

#### Files Changed
- `src/shared/partsTypes.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/panels/PartsListPanel.tsx`

#### Behavior Changes (if any)
- Part ordering became a deterministic product rule tied to the pipeline, not just display preference.

#### Verification Steps
- Review restored `AS - Phase 2` in the history task log and the canonical phase log.
- Confirm the draft stays aligned with later assembly and artifact identity work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [004] - [Conv 8] - `AS - Phase 1 - Parts List Replacement`
<!-- ============================================================ -->
HUMAN SUMMARY: `Removed the history scrubber direction from the restart baseline. Replaced it with a Parts List model.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the move away from history scrubber UI.
- Preserved artifact-driven inspection as the main direction.

#### Summary of Implementation
- Removed the history scrubber direction from the restart baseline.
- Replaced it with a Parts List model.
- Made part selection focus relevant controls instead of scrubbing through time.
- Treated future history support as optional later work layered on top of artifacts instead of the base UI.

#### Files Changed
- `src/app/panels/PartsListPanel.tsx`
- `src/app/AppShell.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/partsTypes.ts`
- `src/worker/pipeline/artifactEmitter.ts`

#### Behavior Changes (if any)
- The product moved from time-travel UI toward part-driven inspection.

#### Verification Steps
- Review restored `AS - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft stays consistent with the later deterministic ordering and assembled-direction work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [003] - [Conv 8] - `GE - Phase 3 - Engine Roadmap Foundation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Made param ownership and routing the first real engine milestone after the clean restart. Defined deterministic per-part signatures as the basis for selective recompute and artifact stability.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the clean restart architecture.
- Preserved the routing-first direction for post-restart work.

#### Summary of Implementation
- Made param ownership and routing the first real engine milestone after the clean restart.
- Defined deterministic per-part signatures as the basis for selective recompute and artifact stability.
- Ordered the roadmap as routing first, selective recompute second, and real geometry later.
- Added changed-param thinking so the worker could eventually reason about affected parts without guessing from raw UI churn.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/worker/pipeline/signatures.ts`

#### Behavior Changes (if any)
- The engine roadmap stopped being UI-first and became routing-first.

#### Verification Steps
- Review restored `GE - Phase 3` in the history task log and the canonical phase log.
- Confirm the draft fits between the clean restart and the later worker routing work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [002] - [Conv 8] - `GE - Phase 2 - Runtime And Rebuild Rules`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked one warm worker as the restart invariant. Used latest-only scheduling so rapid control churn collapses into the newest valid build request.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the one warm worker rule.
- Preserved the clean app -> worker -> viewer separation.

#### Summary of Implementation
- Locked one warm worker as the restart invariant.
- Used latest-only scheduling so rapid control churn collapses into the newest valid build request.
- Dropped stale worker results and separated render-only changes from geometry-affecting changes.
- Kept worker communication on shared protocol/schema boundaries instead of app-to-runtime reach-in.

#### Files Changed
- `src/app/buildDispatcher.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/intentClassifier.ts`
- `src/app/protocol.ts`
- `src/worker/worker.ts`
- `src/worker/scheduler.ts`
- `src/worker/validation.ts`
- `src/shared/buildTypes.ts`
- `src/shared/productSchema.ts`

#### Behavior Changes (if any)
- The runtime gained clearer rebuild rules and a safer worker scheduling model.

#### Verification Steps
- Review restored `GE - Phase 2` in the history task log and the canonical phase log.
- Confirm the draft reflects the warm-worker, latest-only, stale-drop, and render-vs-geometry split.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [001] - [Conv 8] - `GE - Phase 1 - Clean Restart Architecture`
<!-- ============================================================ -->
HUMAN SUMMARY: `Initialized the new /20/parahook stack with Vite, React, TypeScript, Three.js, Zustand, and Zod. Created the clean-slate source layout for app, viewer, worker, geometry, runtime, shared, and tests.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart conversation evidence.
- Preserved the clean app -> worker -> viewer architecture as the foundation.
- Preserved the rule that UI captures intent, worker executes CAD, and viewer renders results.

#### Summary of Implementation
- Initialized the new `/20/parahook` stack with Vite, React, TypeScript, Three.js, Zustand, and Zod.
- Created the clean-slate source layout for `app`, `viewer`, `worker`, `geometry`, `runtime`, `shared`, and `tests`.
- Built the first warm-worker and viewer skeletons and confirmed the clean restart compiled.
- Established the first hard import and ownership boundaries between app, viewer, worker, and geometry before real CAD work started.

#### Files Changed
- `src/index.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/selectors.ts`
- `src/app/buildDispatcher.ts`
- `src/app/protocol.ts`
- `src/app/profileEditor/ProfileControls.tsx`
- `src/app/jakeMode/JakeControls.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/panels/BuildStatusPanel.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/scene/SceneManager.ts`
- `src/viewer/renderers/MeshRenderer.ts`
- `src/worker/worker.ts`
- `src/worker/scheduler.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/exportService.ts`
- `src/shared/productSchema.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partsTypes.ts`
- `src/shared/constants.ts`

#### Behavior Changes (if any)
- Established the clean `/20/` restart architecture and baseline runtime bring-up.

#### Verification Steps
- Review restored `GE - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft reflects the original restart architecture, repo layout, worker skeleton, and viewer skeleton.

