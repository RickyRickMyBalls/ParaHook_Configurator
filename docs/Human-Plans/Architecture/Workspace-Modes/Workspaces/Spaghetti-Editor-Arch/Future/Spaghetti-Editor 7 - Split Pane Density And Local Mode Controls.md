# `Spaghetti-Editor 7` - `Split Pane Density And Local Mode Controls`

## Doc Header

### Doc History
11. 2026-05-19 00:34:37: Implemented and closed `Spaghetti-Editor 7 / Phase 4 - Narrow Pane Visual Proof And Closeout` as a proof-only closeout by rerunning the focused split-host fit, one-button `e / +`, essentials-body, panel/canvas, AppShell handoff, and production build checks; no runtime files needed changes, the closeout uses existing DOM-level proof instead of adding a screenshot-only harness, and no follow-on polish was required for the original split-pane density goals.
10. 2026-05-19 00:29:23: Prepped `Spaghetti-Editor 7 / Phase 4 - Narrow Pane Visual Proof And Closeout` against the shipped Phase 1 through Phase 3 split-pane work, locking the closeout slice to narrow split-pane visual/manual proof, focused regression reruns for the one-button `e / +` header and essentials body propagation, and honest follow-on capture without adding new density, toolbar, graph, node, overlay, or workspace-shell behavior.
9. 2026-05-19 00:20:11: Added the `Spaghetti-Editor 7 / Phase 3` follow-up fix after the split-pane button correctly switched to `e` but the slotted editor body stayed expanded; `ViewportSurfaceRegistry` now forwards the editor viewport presentation flags into `SpaghettiPanel` so split-hosted essentials mode hides expanded panel chrome and canvas toolbar content.
8. 2026-05-19 00:14:12: Implemented and closed `Spaghetti-Editor 7 / Phase 3 - Split Pane Local Minus Rule` by folding split-pane Spaghetti `e / +` density behavior onto the shared primary `ViewportFrame` button, removing the adjacent duplicate density supplement, preserving right-click viewport-type access, and keeping floating/windowed Spaghetti `- / e / + / O` behavior unchanged.
7. 2026-05-19 00:08:47: Corrected the `Spaghetti-Editor 7 / Phase 3 - Split Pane Local Minus Rule` prep after the live screenshot showed two adjacent split-pane header buttons: the shared `ViewportFrameModeButton` still displays `-` beside the new Spaghetti `+` density button. Phase 3 is now locked to merge the split-pane Spaghetti `e / +` density action onto the shared primary header button, remove the extra Spaghetti density supplement button, preserve right-click viewport-type access, and keep floating/windowed `- / e / + / O` behavior unchanged.
6. 2026-05-19 00:05:51: Prepped `Spaghetti-Editor 7 / Phase 3 - Split Pane Local Minus Rule` against the shipped Phase 2 split-pane header path and the live floating Spaghetti titlebar cycle, locking the next slice to prove split-hosted panes do not expose a Spaghetti-local `-`, preserve shared workspace close/remove ownership, and leave floating/windowed `- / e / + / O` behavior intact.
5. 2026-05-19 00:01:35: Implemented and closed `Spaghetti-Editor 7 / Phase 2 - Split Pane e And + Mode Behavior` by adding a Spaghetti-only `ViewportFrame` header density control for split-hosted panes, wiring `+` to compact essentials and `e` to full editor restore through the existing editor viewport presentation state, preserving slotted placement and overlay separation, and adding focused tree/store/AppShell proof while leaving the local `-` policy for Phase 3.
4. 2026-05-18 23:56:25: Prepped `Spaghetti-Editor 7 / Phase 2 - Split Pane e And + Mode Behavior` against the live workspace-frame header supplement seam, split-host Spaghetti registry path, Spaghetti presentation store, and console activation tests, locking the implementation to pane-local `e -> +` density controls in the shared `ViewportFrame` header without adding a second Spaghetti floating titlebar, changing overlay `O`, deciding the local `-` policy, or touching graph/node truth.
3. 2026-05-18 23:46:59: Implemented and closed `Spaghetti-Editor 7 / Phase 1 - Split Pane Chrome Fit` with split-host fit targeting, shrink-safe Spaghetti focus row and floating-titlebar lanes, compact accessible canvas-toolbar labels, disabled toolbar readability, and focused panel/canvas/registry proof while leaving split-pane `e / +` behavior and the local `-` rule for later phases.
2. 2026-05-18 15:41:11: Prepped `Spaghetti-Editor 7 / Phase 1 - Split Pane Chrome Fit` for implementation against the live split-slot wrapper, Spaghetti floating-handle titlebar lanes, graph-document picker CSS, and canvas-toolbar long-label controls, locking the first cut to responsive fit, truncation, wrapping, disabled-state readability, and focused host/layout proof without changing `e / +`, local `-`, node row-density, or workspace close behavior.
1. 2026-05-18 15:31:57: Created this future plan doc after the split-workspace Spaghetti Editor screenshot showed overlapping titlebar text, crowded graph selectors, oversized canvas-toolbar labels, an unhelpful or non-working local `-` affordance, and the need to make `e` and `+` useful inside a dedicated split workspace pane.

### Purpose

Use this doc as the dedicated planning and execution surface for making the Spaghetti Editor comfortable inside a split workspace pane.

The goal here is:
- make split-hosted Spaghetti Editor chrome fit without overlapping text or controls
- make local `e` and `+` presentation controls useful when the editor is already inside a dedicated workspace pane
- decide whether the local Spaghetti `-` control should be hidden, disabled, or given a real split-pane meaning
- keep shared workspace pane close and split behavior owned by the workspace shell instead of the Spaghetti editor body
- preserve the existing `- / e / + / O` presentation model where it remains useful outside split panes

### Scope

This phase family covers:
- split-pane Spaghetti Editor density
- titlebar, graph selector, and canvas-toolbar fit
- local `e / +` behavior in slotted or split workspace hosts
- the split-pane rule for the local Spaghetti `-` presentation affordance
- focused visual and behavioral proof for narrow split panes

This phase family does not cover:
- node row-density redesign
- changing the existing graph-authored node mode contract
- shared workspace close-button ownership
- generic workspace titlebar redesign
- `O` overlay mode ownership
- meatball dock persistence
- draft/final geometry execution

## Doc Body

### Summary

`Spaghetti-Editor 7` is the split-pane comfort cleanup after the shipped `Spaghetti-Editor 3` presentation-mode work.

The current screenshot shows the Spaghetti Editor mounted inside a split workspace pane where the editor is technically usable but visually crowded:
- the top titlebar and graph selectors are too willing to overlap
- long graph or document labels can collide with neighboring controls
- the local Spaghetti `-` affordance does not appear useful in this host
- the lower canvas toolbar uses wide text labels that do not fit a narrow pane well
- `e` and `+` need to become the meaningful split-pane local density controls

Locked recommendation:
- treat this as split-hosted Spaghetti shell polish, not node behavior
- keep workspace pane close and removal on the shared `ViewportFrame` / workspace shell path
- make `e` a compact local editor view for narrow panes
- make `+` restore full local editor content inside the pane
- decide the local `-` behavior from real split-pane usefulness instead of carrying floating-window collapse assumptions forward automatically

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/app/hosts/SpaghettiWindowHost.tsx`
  - owns the visible Spaghetti presentation controls and the current `collapsed / essentials / expanded / overlay` transition helpers
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns editor viewport presentation state, header collapse, canvas toolbar visibility, and split/workspace synchronization
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - mounts Spaghetti Editor as a workspace surface inside slotted and split hosts
- `src/app/workspace/ViewportFrame.tsx`
  - owns shared workspace pane chrome, viewport-type selector, popout, and close/split menu controls
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
  - branches the editor body between collapsed and expanded/editor content paths
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - owns the lower canvas toolbar controls such as node mode buttons, edge action buttons, tangent flip buttons, and wire-curve control
- `src/app/theme/surfaces/spaghetti.css`
  - owns most Spaghetti editor, canvas, toolbar, and node visual sizing
- `src/app/theme/foundation/base.css`
  - owns shared workspace pane and titlebar sizing that may affect split-host fit

Important architectural note:

The cramped split-pane problem should not be solved by changing canonical graph truth or node row state. The fix should stay in shell presentation, responsive layout, and workspace-host behavior.

Phase 2 live read after Phase 1:

- `src/app/workspace/WorkspaceViewportTree.tsx` already feeds Browser and Model Viewer local controls into the shared `ViewportFrame` via `headerStartSupplement`.
- `src/app/workspace/ViewportSurfaceRegistry.tsx` mounts split-hosted Spaghetti as `WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--spaghetti` with `data-spaghetti-split-pane-fit="true"` and `SpaghettiPanel`.
- Split-hosted Spaghetti does not render through `SpaghettiWindowTitleBar`; that floating titlebar still belongs to the floating/windowed editor host.
- `src/app/hosts/SpaghettiWindowHost.tsx` owns the existing floating `- / e / + / O` titlebar cycle and should not be mounted wholesale inside a workspace pane.
- `src/app/spaghetti/store/useSpaghettiStore.ts` already owns `setEditorViewportPresentationMode(...)`, header collapse state, canvas-toolbar visibility, and overlay state.
- Existing `src/app/AppShell.test.tsx` coverage proves split-host Spaghetti activation and console handoff from panel clicks and frame-header clicks; Phase 2 should preserve those handoff guarantees while adding only the local density control.

### Boundary Rules

- Split-pane `e / +` is local editor presentation, not graph authored state.
- The shared workspace pane still owns pane close, split, popout, and viewport-type controls.
- The Spaghetti-local `-` should not create a second way to remove or close a split pane.
- If `-` remains visible in split panes, it must have a clear local meaning and working behavior.
- Long graph labels and ids must truncate or wrap inside their own lanes instead of overlapping neighboring controls.
- Canvas toolbar buttons must remain usable in narrow panes without relying on full text labels always being visible.
- Disabled controls must look intentionally disabled, not broken.

### Acceptance Read

This HLG is achieved when:
- a narrow split-pane Spaghetti Editor no longer shows overlapping titlebar text or selector labels
- `e` and `+` switch the split-hosted editor between useful compact and full local presentation states
- the split-pane local `-` decision is explicit and implemented or deferred honestly
- the lower canvas toolbar fits without text collisions
- shared workspace close/split ownership stays in the workspace shell
- visual verification covers a narrow split pane similar to the reported screenshot

## Vision

When Spaghetti Editor lives in a split workspace pane, it should feel like a real pane-native editor, not a floating window squeezed into the wrong box.

The user should be able to split the workspace, put Spaghetti in one side, and immediately read the active graph, switch between compact and full editor modes, and use the canvas without fighting overlapping labels.

`e` and `+` should be the practical local density controls for this host. The local `-` should either disappear from split panes or earn its place with a clear local behavior.

## Wishlist Organization

### High Level Goals

- [x] `Spaghetti-SplitPane-HLG-1. When Spaghetti Editor is in a split workspace pane, the titlebar and graph selectors should not overlap or become too large.`
- [x] `Spaghetti-SplitPane-HLG-2. The split-pane editor should have useful local e and + modes.`
- [x] `Spaghetti-SplitPane-HLG-3. The local - button should not stay as a confusing or broken control when the editor already lives in a dedicated workspace pane.`
- [x] `Spaghetti-SplitPane-HLG-4. The canvas toolbar should fit narrow split panes without oversized labels or control collisions.`

### Codex Level Goals

- [x] CLG 1. Ground the split-pane fit problem in the live Spaghetti host, workspace frame, and canvas-toolbar seams.
- [x] CLG 2. Add responsive titlebar, selector, and toolbar layout rules without changing graph or node truth.
- [x] CLG 3. Implement split-host-aware `e / +` presentation behavior using existing editor presentation state.
- [x] CLG 4. Decide and implement the split-pane local `-` rule without duplicating workspace pane close ownership.
- [x] CLG 5. Verify the narrow-pane user experience with focused tests and DOM-level proof.

### `Spaghetti-Editor 7 / Phase 1`

- [x] Inspect current split-hosted Spaghetti titlebar and canvas-toolbar layout.
- [x] Fix text overflow and control collision in the top titlebar and graph selector row.
- [x] Fix lower canvas-toolbar wrapping, truncation, or icon/short-label behavior for narrow panes.
- [x] Keep the phase limited to chrome fit; leave `e / +` behavior and local `-` policy to Phases 2 and 3.
- [x] `HLG 1. When Spaghetti Editor is in a split workspace pane, the titlebar and graph selectors should not overlap or become too large.`
- [x] `HLG 4. The canvas toolbar should fit narrow split panes without oversized labels or control collisions.`

### `Spaghetti-Editor 7 / Phase 2`

- [x] Make split-hosted `e` enter a compact local editor state that remains usable inside the pane.
- [x] Make split-hosted `+` restore full local editor content inside the same pane.
- [x] Keep `O` overlay behavior separate.
- [x] `HLG 2. The split-pane editor should have useful local e and + modes.`

### `Spaghetti-Editor 7 / Phase 3`

- [x] Decide whether split-hosted local `-` should be hidden, disabled with explanation, or remapped to a real local compact state.
- [x] Keep workspace-pane close/remove behavior on the shared pane shell.
- [x] Add focused proof that the local `-` no longer appears broken in split panes.
- [x] `HLG 3. The local - button should not stay as a confusing or broken control when the editor already lives in a dedicated workspace pane.`

### `Spaghetti-Editor 7 / Phase 4`

- [x] Add visual or DOM-level proof for narrow split-pane Spaghetti layout.
- [x] Re-run focused host and workspace tests for touched seams.
- [x] Record any remaining visual polish as a later follow-on instead of widening this phase family.
- [x] `HLG 1. When Spaghetti Editor is in a split workspace pane, the titlebar and graph selectors should not overlap or become too large.`
- [x] `HLG 2. The split-pane editor should have useful local e and + modes.`
- [x] `HLG 3. The local - button should not stay as a confusing or broken control when the editor already lives in a dedicated workspace pane.`
- [x] `HLG 4. The canvas toolbar should fit narrow split panes without oversized labels or control collisions.`

## [x] `Spaghetti-Editor 7 / Phase 1` - `Split Pane Chrome Fit`

### Phase 1 Summary

#### Purpose

Make the split-hosted Spaghetti Editor chrome fit inside narrow workspace panes without overlapping titlebar text, graph selector labels, or canvas toolbar controls.

#### Owns

- titlebar text truncation and lane sizing for split-hosted Spaghetti
- graph selector and active document label fit
- lower canvas-toolbar fit in narrow panes
- disabled-control readability for edge and tangent actions
- focused proof that narrow panes do not collide visually

#### Does Not Own

- changing presentation-mode behavior
- removing or remapping the `-` control
- node row-density changes
- workspace pane close behavior

#### Current Live Read

The reported screenshot shows the top rows crowding badly in a split pane:
- `Graph 1` and the active graph/document label overlap
- the titlebar control lane does not seem to reserve or clamp width cleanly
- the lower canvas toolbar uses wide labels like `Delete Selected Edge` and `Flip Tangent Side 1`
- the toolbar may be technically correct but not responsive enough for a split host

Live code grounding:
- `src/app/workspace/ViewportSurfaceRegistry.tsx` mounts split-hosted Spaghetti Editor inside `WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--spaghetti`.
- `src/app/hosts/SpaghettiWindowHost.tsx` renders the Spaghetti titlebar through `SpaghettiFloatingHandle`, `SpaghettiFloatingHandleStart`, `SpaghettiFloatingHandleRow`, `SpaghettiFloatingHandleActions`, `SpaghettiFloatingHandleGraph`, and `SpaghettiFloatingHandleCoreActions`.
- `src/app/theme/surfaces/spaghetti.css` already owns the relevant titlebar selectors around `.SpaghettiFloatingHandle`, `.SpaghettiFloatingHandleTitle`, `.SpaghettiFloatingHandleGraph`, `.SpaghettiGraphDocumentPicker`, and `.SpaghettiFloatingHandleGraph .ParaSelect*`.
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` renders the long canvas-toolbar controls:
  - `Delete Selected Edge`
  - `Flip Tangent Side 1`
  - `Flip Tangent Side 2`
  - `Wire Curve: {wireCurviness}`
- `src/app/theme/surfaces/spaghetti.css` owns the canvas toolbar selectors around `.SpaghettiCanvasToolbar`, `.SpaghettiCanvasToolbar--modeOnly`, `.SpaghettiCanvasModeToggle`, `.SpaghettiCanvasCurveControl`, `.SpaghettiCanvasRowMode`, and related control sizing.
- `src/app/theme/foundation/base.css` owns generic canvas host and workspace shell styling that may constrain the available split-pane width.

#### First Pass Decisions

- Phase 1 should prefer CSS/layout fixes over new state.
- Phase 1 may add a host-aware class or data attribute only if existing split/slotted classes are not enough to target split-pane Spaghetti safely.
- Phase 1 should make titlebar lanes shrinkable by giving flex children explicit `min-width: 0`, stable max widths, and overflow handling.
- Phase 1 should keep full text in accessible labels or titles if visible labels are shortened in narrow panes.
- Phase 1 should not hide the local Spaghetti `-` button; that policy belongs to Phase 3.
- Phase 1 should not change what `e` and `+` do; that behavior belongs to Phase 2.

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Ground the live split-host path by reading `ViewportSurfaceRegistry`, `SpaghettiWindowHost`, and the existing Spaghetti titlebar CSS.
2. Add the smallest host targeting needed for split-pane Spaghetti:
   - first try existing `WorkspaceViewportSlotSurface--spaghetti`
   - add a dedicated class or data attribute only if the existing selector cannot avoid floating/meatball/overlay regressions
3. Fix top titlebar fit:
   - make the title/titlebar start lane shrink safely
   - clamp `SpaghettiFloatingHandleTitle`
   - clamp `SpaghettiFloatingHandleGraph`
   - ensure the graph-document picker uses `min-width: 0`, visible truncation, and stable caps instead of overlapping neighboring controls
4. Fix graph selector fit:
   - preserve the current graph picker behavior
   - keep long graph/document ids readable through truncation/title text or menu content
   - do not change graph-document ownership or active graph selection behavior
5. Fix lower canvas toolbar fit:
   - let toolbar groups wrap or compress in narrow panes
   - keep `Wire Curve` and its slider usable
   - shorten visible button labels only if needed, while preserving accessible labels
   - keep disabled edge/tangent actions visibly intentional
6. Add focused proof:
   - a render or DOM-level assertion that split-hosted Spaghetti gets the narrow-fit class/path
   - a test that the long-label toolbar controls remain present and accessible after the fit changes
   - a host/layout assertion that the graph document picker remains mounted in split-hosted Spaghetti

#### Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/surfaces/spaghetti.css`
- `src/app/theme/foundation/base.css`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/AppShell.test.tsx`

#### High-Signal Selectors

- `.WorkspaceViewportSlotSurface--spaghetti`
- `.SpaghettiFloatingHandle`
- `.SpaghettiFloatingHandleStart`
- `.SpaghettiFloatingHandleTitle`
- `.SpaghettiFloatingHandleRow`
- `.SpaghettiFloatingHandleActions`
- `.SpaghettiFloatingHandleGraph`
- `.SpaghettiGraphDocumentPicker`
- `.SpaghettiFloatingHandleGraph .ParaSelect`
- `.SpaghettiCanvasToolbar`
- `.SpaghettiCanvasCurveControl`
- `.SpaghettiCanvasRowMode`

#### No-Widening Rule

Do not change mode semantics in Phase 1. This is the visual fit pass only.

Do not remove controls just because they are crowded. First make the layout honest, then let Phase 3 decide the local `-` rule.

Do not add new graph selection behavior, node mode behavior, or workspace pane close behavior.

Do not treat the disabled `Delete Selected Edge` state as a bug by itself. Phase 1 owns making the disabled state fit and read clearly, not making selection-sensitive actions available when nothing is selected.

#### Verification Shape

- titlebar text truncates instead of overlapping
- graph selector row does not collide with adjacent controls
- canvas toolbar controls fit or wrap without covering the canvas
- disabled edge actions still communicate unavailable state
- split-hosted Spaghetti remains mounted through the existing workspace surface path

#### Prep Status

Phase 1 is implementation-ready when the next code pass starts from:
- split-host selector targeting
- titlebar lane shrink/truncation
- graph picker width discipline
- canvas toolbar wrap/compression
- focused host and toolbar proof

The next code pass should not include Phase 2 `e / +` behavior or Phase 3 local `-` policy unless Phase 1 exposes a tiny mechanical dependency that cannot be separated.

## [x] `Spaghetti-Editor 7 / Phase 2` - `Split Pane e And + Mode Behavior`

### Phase 2 Summary

#### Purpose

Make `e` and `+` useful as local density controls when Spaghetti Editor is already hosted inside a split workspace pane.

#### Owns

- split-hosted essentials behavior
- split-hosted full editor restore behavior
- preserving editor focus and graph binding while switching modes
- keeping overlay `O` separate from pane-local density

#### Does Not Own

- local `-` decision
- overlay ownership
- shared workspace pane controls
- mounting the full Spaghetti floating titlebar inside a workspace pane
- Browser presentation controls or Model Viewer result-mode controls

### Phase 2 Implementation Spec

#### Current Live Read

The split-host path is:
- `WorkspaceViewportTree`
- `ViewportFrame`
- `ViewportSurfaceRegistry`
- `SpaghettiPanel`

The shared frame already has the right local-control seam:
- Browser uses `headerStartSupplement` and `ViewportFrameHeaderControlButton` for its pane-local presentation button.
- Model Viewer also uses the frame-header supplement lane for viewport-local mode controls.
- Spaghetti should use the same shared frame seam instead of adding a second Spaghetti floating titlebar inside the pane.

The split-pane Spaghetti control should be narrow and explicit:
- full pane state shows `+` as the visible control and switches to compact `e`
- compact pane state shows `e` as the visible control and restores full `+`
- titles and aria labels should spell out the real action, such as switching the Spaghetti pane to compact editor mode or full editor mode
- overlay `O` remains separate from this lane
- the local `-` policy remains out of scope for Phase 2

The implementation must preserve slotted placement. It must not move the editor into floating, collapsed, maximized, separate-window, meatball, or overlay placement while cycling `e / +`.

#### First Pass Decisions

- Implement the visible split-pane `e / +` control in `WorkspaceViewportTree.tsx` through the existing `headerStartSupplement` path.
- Derive the current split-pane density from `editorViewportHeaderCollapsedById`, `editorViewportCanvasToolbarVisibleById`, and `editorViewportOverlayModeById`.
- Prefer the existing `setEditorViewportPresentationMode(editorViewportId, 'essentials' | 'expanded')` store action if it preserves slotted/workspace placement; narrow the store behavior only if the live code tries to collapse, float, maximize, or otherwise re-place a split-hosted pane.
- Use only the visible `e` and `+` control labels for this phase.
- Use `ViewportFrameHeaderControlButton` so Spaghetti follows the shared workspace header control shape.
- Do not render or reuse `SpaghettiWindowTitleBar` inside split panes.
- Compact mode should hide/collapse local editor chrome enough to improve density and hide the canvas toolbar, while full mode restores the normal editor content and canvas toolbar.
- Preserve split-host activation and console handoff behavior when the pane header or editor body is clicked.

#### Exact First Code Cut

1. Re-read the slotted path through `WorkspaceViewportTree`, `ViewportFrame`, `ViewportSurfaceRegistry`, and `SpaghettiPanel`.
2. Add a Spaghetti-only `headerStartSupplement` when a viewport slot is hosting `surfaceKind === 'spaghettiEditor'`.
3. Derive whether the slotted editor is currently compact or full from the editor viewport presentation state.
4. When full, make the header button show `+` and call the essentials transition for that same `editorViewportId`.
5. When compact, make the header button show `e` and call the expanded transition for that same `editorViewportId`.
6. Verify the store transition preserves slotted/workspace placement and does not route through floating, collapsed, maximized, separate-window, meatball, or overlay behavior.
7. Leave overlay `O` behavior on its existing viewport overlay path.
8. Leave the local `-` decision untouched for Phase 3.
9. Add focused proof that the control toggles pane-local density, preserves graph binding, and preserves split-host console activation/handoff.

#### Likely Files

- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/AppShell.test.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`

Only touch `src/app/hosts/SpaghettiWindowHost.tsx` if a tiny shared label or presentation helper is genuinely needed. Do not move the floating titlebar into the split-pane render path.

#### No-Widening Rule

Do not decide the local `-` policy in Phase 2.

Do not change Browser or Model Viewer local presentation controls.

Do not change overlay `O` ownership, graph-document truth, node row-density, workspace close behavior, or split-tree mutation behavior.

#### Verification Shape

- `e` creates a compact usable split-pane editor view
- `+` restores the full editor body in the same pane
- mode switching does not unbind the editor from its graph
- `O` remains a separate overlay mode and does not get triggered by `e`
- split-hosted Spaghetti remains mounted through `.WorkspaceViewportSlotSurface--spaghetti`
- console focus and handoff still target the clicked split-hosted Spaghetti editor

#### Prep Status

Phase 2 is implementation-ready when the next code pass starts from:
- the shared `ViewportFrame` header supplement seam
- the existing editor viewport presentation store state
- slotted placement preservation as a hard invariant
- focused `WorkspaceViewportTree`, store, and `AppShell` proof

#### Implementation Result

Phase 2 shipped on 2026-05-19.

Landed behavior:
- split-hosted Spaghetti panes now render a pane-local density button in the shared `ViewportFrame` header
- full panes show `+` and switch the same editor viewport into compact essentials mode
- compact panes show `e` and restore the same editor viewport to full editor mode
- overlay `O` remains separate and does not render through this split-pane density lane
- the floating Spaghetti titlebar is not mounted inside split panes
- slotted/split placement stays preserved while header collapse and canvas-toolbar visibility toggle

Files changed:
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Future/Spaghetti-Editor 7 - Split Pane Density And Local Mode Controls.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Spaghetti-Editor-index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Verification:
- `npm.cmd test -- --run src/app/workspace/WorkspaceViewportTree.test.tsx -t "split-host Spaghetti e and plus"`
- `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "setEditorViewportPresentationMode"`
- `npm.cmd test -- --run src/app/workspace/WorkspaceViewportTree.test.tsx src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - `WorkspaceViewportTree.test.tsx` passed
  - `useSpaghettiStore.test.ts` still has two unrelated existing OutputPreview normalization expectation failures around newly present `publicationMode` fields
- `npm.cmd test -- --run src/app/AppShell.test.tsx -t "split-host spaghetti"`
- `npm.cmd run build`

## [x] `Spaghetti-Editor 7 / Phase 3` - `Split Pane Local Minus Rule`

### Phase 3 Summary

#### Purpose

Decide and implement the split-pane rule for the local Spaghetti `-` control so it no longer reads as broken or redundant.

#### Owns

- split-hosted local `-` visibility policy
- avoiding duplicated workspace pane close/remove ownership
- tests proving the chosen rule is stable

#### Does Not Own

- workspace pane `x` close control
- split tree mutation behavior
- Browser presentation controls
- floating/windowed Spaghetti `- / e / + / O` behavior
- remapping split-pane `-` to a new local collapsed body mode
- changing the Phase 2 split-pane `e / +` density control
- overlay `O` ownership
- graph, node, or canvas authored state

#### Current Live Read

After Phase 2, split-hosted Spaghetti panes are rendered through:
- `WorkspaceViewportTree`
- `ViewportFrame`
- `ViewportSurfaceRegistry`
- `SpaghettiPanel`

The live screenshot shows the split-pane header currently exposes two adjacent small buttons:
- the shared `ViewportFrameModeButton`, which still displays `-`
- the Spaghetti-only `ViewportFrameHeaderControlButton`, which displays `+` or `e` for local density

That is visually confusing because it reads like two Spaghetti presentation buttons. The left `-` is technically the shared viewport type/menu button, not the floating Spaghetti collapse button, but the user-facing result is still the same ambiguity Phase 3 is supposed to remove.

The split-hosted pane still does not render:
- `SpaghettiWindowTitleBar`
- `.SpaghettiWindowAction--collapse`

The floating/windowed editor still owns the real Spaghetti titlebar cycle in `src/app/hosts/SpaghettiWindowHost.tsx`:
- `SpaghettiWindowTitleBar` renders `.SpaghettiWindowAction--collapse`
- expanded mode shows `+` with `Minimize editor`
- collapsed mode shows `-` with `Switch editor to essentials mode`
- essentials mode shows `e` with `Switch editor to full window mode`
- overlay mode hides that titlebar and remains separate

This means the honest split-pane local `-` rule is to remove the apparent two-button mode cluster: the split-pane Spaghetti `e / +` density action should move onto the shared primary header button, replacing the visible `-`, while the viewport-type menu remains available through the existing right-click/context-menu path.

#### First Pass Decision

Use the preferred option as the Phase 3 implementation rule:
- split-hosted Spaghetti panes should show one local density button, not two adjacent mode-looking buttons
- the shared `ViewportFrameModeButton` should become the visible Spaghetti `e / +` density control for split-hosted Spaghetti panes
- the separate Phase 2 `ViewportFrameHeaderControlButton` supplement should be removed for split-hosted Spaghetti panes
- right-click/context-menu viewport-type access on the shared button should remain available
- pane close/remove stays on `ViewportFrame` eligibility and inline/menu close paths
- floating and meatball/windowed Spaghetti titlebar behavior remains unchanged

### Phase 3 Implementation Spec

#### Decision Options

Selected option:
- combine the split-pane Spaghetti density affordance into the shared primary header button so split panes show `+` or `e`, not a misleading shared `-` beside a second density button.

Rejected fallback:
- disable it with an accessible explanation if hiding would create control jitter or a confusing mode gap.

Rejected widening:
- map it to a real local collapsed Spaghetti body inside the split pane, without removing the pane or duplicating workspace close behavior.

#### Exact First Code Cut

1. Re-read the Phase 2 split-host Spaghetti path in `WorkspaceViewportTree`.
2. Move the Spaghetti split-pane density click from `headerStartSupplement` to `ViewportFrame` primary-button props for `surfaceKind === 'spaghettiEditor'`.
3. Set the primary button label/title/aria for split-hosted Spaghetti to the same `+` or `e` density action used by Phase 2.
4. Remove the separate Spaghetti `ViewportFrameHeaderControlButton` supplement so only one local density button appears.
5. Preserve the shared right-click/context-menu viewport-type path on the primary button.
6. Assert that split-hosted Spaghetti panes render no `.SpaghettiWindowAction--collapse` and no visible `-` mode-looking button.
7. Assert that eligible split-pane close/remove still comes from the shared `ViewportFrame` inline/menu controls, not Spaghetti-local controls.
8. Assert that floating/windowed Spaghetti still renders and cycles the existing `- / e / +` titlebar behavior.

#### Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
- `src/app/AppShell.test.tsx`

Only touch `src/app/workspace/ViewportFrame.tsx` if shared close/remove proof reveals the pane shell is missing a test seam.

Do not touch `src/app/workspace/ViewportSurfaceRegistry.tsx` unless a leaked floating titlebar is actually coming from the registry path.

#### No-Widening Rule

Do not add a new collapsed split-pane Spaghetti mode.

Do not make the shared viewport type `-` button become a Spaghetti-local collapse button.

Do not change Browser's `- / e / +` presentation cycle.

Do not change floating Spaghetti titlebar semantics.

#### Verification Shape

- split-pane Spaghetti no longer shows a confusing or broken local `-`
- split-pane Spaghetti no longer shows two adjacent mode-looking buttons
- split-pane Spaghetti uses one primary `+` or `e` density button in the shared frame header
- workspace-level close/remove remains available through the shared shell where eligible
- floating or non-split Spaghetti presentation behavior is not regressed
- split-pane Spaghetti `e / +` behavior from Phase 2 still works
- no overlay `O` behavior is changed

#### Prep Status

Phase 3 is implementation-ready when the next code pass starts from:
- a one-button split-pane policy that folds Spaghetti `e / +` density onto the shared primary header button
- `WorkspaceViewportTree` assertions for no visible split-pane `-`, no duplicate density supplement, and `e / +` primary-button behavior
- `AppShell` or titlebar assertions for floating `- / e / +` continuity
- shared `ViewportFrame` close/remove ownership left intact

#### Implementation Result

Phase 3 shipped on 2026-05-19.

Landed behavior:
- split-pane Spaghetti now uses the shared primary `ViewportFrameModeButton` for its local `e / +` density action
- the adjacent Phase 2 `ViewportFrameHeaderControlButton` density supplement is no longer rendered for Spaghetti panes
- the visible split-pane header no longer reads as `[-] [+]`
- right-click on the primary header button still opens the viewport type picker
- floating/windowed Spaghetti keeps its existing `- / e / + / O` titlebar cycle

Files changed:
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Future/Spaghetti-Editor 7 - Split Pane Density And Local Mode Controls.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Spaghetti-Editor-index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Verification:
- `npm.cmd test -- --run src/app/workspace/WorkspaceViewportTree.test.tsx -t "primary frame button for split-host Spaghetti"`
- `npm.cmd test -- --run src/app/AppShell.test.tsx -t "moves the spaghetti first button"`
- `npm.cmd test -- --run src/app/workspace/WorkspaceViewportTree.test.tsx`
- `npm.cmd test -- --run src/app/AppShell.test.tsx -t "split-host spaghetti"`
- `npm.cmd run build`

Follow-up fix on 2026-05-19:
- split-hosted `SpaghettiPanel` now receives the same editor viewport presentation flags used by the header button
- `e` mode now actually renders the panel body in essentials mode instead of only changing the header button label
- focused proof was added in `ViewportSurfaceRegistry.test.tsx`

Follow-up verification:
- `npm.cmd test -- --run src/app/workspace/ViewportSurfaceRegistry.test.tsx -t "split-host Spaghetti essentials"`
- `npm.cmd test -- --run src/app/workspace/WorkspaceViewportTree.test.tsx -t "primary frame button for split-host Spaghetti"`
- `npm.cmd test -- --run src/app/AppShell.test.tsx -t "split-host spaghetti"`
- `npm.cmd run build`

## [x] `Spaghetti-Editor 7 / Phase 4` - `Narrow Pane Visual Proof And Closeout`

### Phase 4 Summary

#### Purpose

Prove the split-pane Spaghetti cleanup works in the narrow layout that motivated the plan and close or explicitly hand off any remaining polish.

#### Owns

- narrow split-pane verification
- focused regression suite rerun
- final doc closeout or follow-on routing

#### Does Not Own

- broad visual redesign
- unrelated node/canvas behavior
- new workspace shell features
- new split-pane density states
- new local `-` behavior
- changes to floating/windowed Spaghetti presentation controls
- graph selector ownership changes
- node row-density redesign

#### Current Live Read

Phase 4 starts after the split-pane comfort work has already landed:
- Phase 1 added split-host narrow-pane targeting and chrome/toolbar fit improvements.
- Phase 2 added split-pane `e / +` density behavior through editor viewport presentation state.
- Phase 3 folded the split-pane `e / +` density action onto the shared primary `ViewportFrameModeButton`, removed the duplicate adjacent density supplement, and preserved right-click viewport-type access.
- The Phase 3 follow-up forwards split-hosted presentation flags into `SpaghettiPanel`, so `e` mode now renders the panel body in essentials mode.

The closeout should prove the original screenshot class of issues is gone:
- no overlapping titlebar text or graph/focus picker lanes in a narrow split pane
- no adjacent `[-] [+]` mode-looking pair
- `+` switches to compact essentials and changes the body, not just the header label
- `e` restores full editor mode
- canvas toolbar labels remain compact/readable in full mode
- shared pane close/split/type controls remain workspace-owned
- floating/windowed Spaghetti `- / e / + / O` behavior is not regressed

#### First Pass Decisions

- Phase 4 is a closeout/proof slice, not a new behavior slice.
- Prefer automated DOM/regression proof already available in `WorkspaceViewportTree`, `ViewportSurfaceRegistry`, `SpaghettiPanel`, `SpaghettiCanvas`, and `AppShell`.
- Add only minimal missing proof if a specific original screenshot condition is not covered.
- Use a manual or screenshot check for the final narrow-pane visual read.
- If a new visual problem appears but is not required for the original Phase 7 goals, record it as a follow-on instead of widening Phase 4.

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. Re-run focused Phase 1 proof for split-host fit targeting, graph/focus picker lanes, compact toolbar labels, and disabled toolbar readability.
2. Re-run focused Phase 2 and Phase 3 proof:
   - split-host primary header button shows `+` in full mode
   - clicking it enters essentials and changes the body
   - button then shows `e`
   - clicking `e` restores full mode
   - no duplicate Spaghetti density supplement appears
   - right-click viewport-type picker still works
3. Re-run focused split-host AppShell proof so activation and console handoff still target the clicked split-hosted editor.
4. Run production build.
5. Perform a narrow split-pane visual/manual check against the reported screenshot shape.
6. Record any remaining polish as a later follow-on if it is not required for the original screenshot problem.
7. Update this doc and the index with shipped closeout status and final verification notes.

#### Likely Files

- `src/app/AppShell.test.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.test.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- this doc
- `Spaghetti-Editor-index.md`

Only touch runtime files if Phase 4 proof exposes a direct regression in the already-shipped Phase 1 through Phase 3 behavior.

#### No-Widening Rule

Do not add new controls, modes, or layout concepts in Phase 4.

Do not change graph truth, node row-density, overlay `O`, floating/windowed titlebar behavior, Browser controls, Model Viewer controls, or workspace split/close semantics.

#### Verification Shape

- automated tests cover the core host and mode behavior
- manual or screenshot validation confirms the narrow split pane no longer overlaps controls
- the plan closes only after `e / +` behavior and the local `-` rule are both honest
- any remaining cosmetic issue is either fixed only if it is directly inside the original scope or logged as a follow-on

#### Prep Status

Phase 4 is implementation-ready when the next pass starts from:
- the shipped Phase 1 through Phase 3 behavior as baseline
- focused test reruns for split-host fit, `e / +`, essentials body, and console handoff
- production build verification
- a narrow split-pane visual/manual check
- final closeout documentation instead of new behavior design

### Phase 4 Implementation Notes

Phase 4 closed as a proof-only pass. No runtime files needed changes after the focused checks confirmed the shipped split-pane behavior:
- split-hosted Spaghetti surfaces still receive narrow-pane fit targeting
- the shared primary `ViewportFrameModeButton` owns the split-pane `+ / e` density cycle without an adjacent duplicate Spaghetti density button
- split-hosted `e` mode reaches the `SpaghettiPanel` body and hides expanded panel chrome
- panel/canvas regressions still pass with compact toolbar labels and accessible controls
- split-host AppShell activation and console handoff still target the clicked Spaghetti pane

The closeout used automated DOM-level proof for the narrow-pane requirements. A screenshot-only browser harness was not added in this phase because the repo does not currently carry Playwright or another local screenshot test package, and the existing DOM-level checks cover the original split-pane button, body, and fit conditions.

No new visual follow-on was required for the original `Spaghetti-Editor 7` goals.

Verification:
- `npm.cmd test -- --run src/app/workspace/ViewportSurfaceRegistry.test.tsx -t "marks split-hosted Spaghetti surfaces"`
- `npm.cmd test -- --run src/app/workspace/WorkspaceViewportTree.test.tsx -t "primary frame button for split-host Spaghetti"`
- `npm.cmd test -- --run src/app/workspace/ViewportSurfaceRegistry.test.tsx -t "split-host Spaghetti essentials"`
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- `npm.cmd test -- --run src/app/AppShell.test.tsx -t "split-host spaghetti"`
- `npm.cmd run build`
