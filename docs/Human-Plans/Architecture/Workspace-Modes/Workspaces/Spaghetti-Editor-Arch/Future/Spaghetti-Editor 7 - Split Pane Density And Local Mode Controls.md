# `Spaghetti-Editor 7` - `Split Pane Density And Local Mode Controls`

## Doc Header

### Doc History
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

- [ ] `Spaghetti-SplitPane-HLG-1. When Spaghetti Editor is in a split workspace pane, the titlebar and graph selectors should not overlap or become too large.`
- [ ] `Spaghetti-SplitPane-HLG-2. The split-pane editor should have useful local e and + modes.`
- [ ] `Spaghetti-SplitPane-HLG-3. The local - button should not stay as a confusing or broken control when the editor already lives in a dedicated workspace pane.`
- [ ] `Spaghetti-SplitPane-HLG-4. The canvas toolbar should fit narrow split panes without oversized labels or control collisions.`

### Codex Level Goals

- [ ] CLG 1. Ground the split-pane fit problem in the live Spaghetti host, workspace frame, and canvas-toolbar seams.
- [ ] CLG 2. Add responsive titlebar, selector, and toolbar layout rules without changing graph or node truth.
- [ ] CLG 3. Implement split-host-aware `e / +` presentation behavior using existing editor presentation state.
- [ ] CLG 4. Decide and implement the split-pane local `-` rule without duplicating workspace pane close ownership.
- [ ] CLG 5. Verify the narrow-pane user experience with focused tests and a screenshot/manual check.

### `Spaghetti-Editor 7 / Phase 1`

- [ ] Inspect current split-hosted Spaghetti titlebar and canvas-toolbar layout.
- [ ] Fix text overflow and control collision in the top titlebar and graph selector row.
- [ ] Fix lower canvas-toolbar wrapping, truncation, or icon/short-label behavior for narrow panes.
- [ ] Keep the phase limited to chrome fit; leave `e / +` behavior and local `-` policy to Phases 2 and 3.
- [ ] `HLG 1. When Spaghetti Editor is in a split workspace pane, the titlebar and graph selectors should not overlap or become too large.`
- [ ] `HLG 4. The canvas toolbar should fit narrow split panes without oversized labels or control collisions.`

### `Spaghetti-Editor 7 / Phase 2`

- [ ] Make split-hosted `e` enter a compact local editor state that remains usable inside the pane.
- [ ] Make split-hosted `+` restore full local editor content inside the same pane.
- [ ] Keep `O` overlay behavior separate.
- [ ] `HLG 2. The split-pane editor should have useful local e and + modes.`

### `Spaghetti-Editor 7 / Phase 3`

- [ ] Decide whether split-hosted local `-` should be hidden, disabled with explanation, or remapped to a real local compact state.
- [ ] Keep workspace-pane close/remove behavior on the shared pane shell.
- [ ] Add focused proof that the local `-` no longer appears broken in split panes.
- [ ] `HLG 3. The local - button should not stay as a confusing or broken control when the editor already lives in a dedicated workspace pane.`

### `Spaghetti-Editor 7 / Phase 4`

- [ ] Add visual or DOM-level proof for narrow split-pane Spaghetti layout.
- [ ] Re-run focused host and workspace tests for touched seams.
- [ ] Record any remaining visual polish as a later follow-on instead of widening this phase family.
- [ ] `HLG 1. When Spaghetti Editor is in a split workspace pane, the titlebar and graph selectors should not overlap or become too large.`
- [ ] `HLG 2. The split-pane editor should have useful local e and + modes.`
- [ ] `HLG 3. The local - button should not stay as a confusing or broken control when the editor already lives in a dedicated workspace pane.`
- [ ] `HLG 4. The canvas toolbar should fit narrow split panes without oversized labels or control collisions.`

## [ ] `Spaghetti-Editor 7 / Phase 1` - `Split Pane Chrome Fit`

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

## [ ] `Spaghetti-Editor 7 / Phase 2` - `Split Pane e And + Mode Behavior`

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

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Read the current `setEditorViewportPresentationMode(...)` behavior for split-hosted surfaces.
2. Make `essentials` collapse local Spaghetti editor chrome enough for a narrow split pane while keeping the canvas usable.
3. Make `expanded` restore full local editor content inside the same workspace pane.
4. Keep the active `editorViewportId`, `graphDocumentId`, and console focus handoff stable while switching modes.
5. Add focused tests for split-hosted `e -> +` and `+ -> e` transitions.

#### Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/AppShell.test.tsx`

#### Verification Shape

- `e` creates a compact usable split-pane editor view
- `+` restores the full editor body in the same pane
- mode switching does not unbind the editor from its graph
- `O` remains a separate overlay mode and does not get triggered by `e`

## [ ] `Spaghetti-Editor 7 / Phase 3` - `Split Pane Local Minus Rule`

### Phase 3 Summary

#### Purpose

Decide and implement the split-pane rule for the local Spaghetti `-` control so it no longer reads as broken or redundant.

#### Owns

- split-hosted local `-` visibility or behavior
- avoiding duplicated workspace pane close/remove ownership
- tests proving the chosen rule is stable

#### Does Not Own

- workspace pane `x` close control
- split tree mutation behavior
- Browser presentation controls

### Phase 3 Implementation Spec

#### Decision Options

Preferred option:
- hide the local Spaghetti `-` control in split panes if it only means floating-window collapse.

Acceptable option:
- disable it with an accessible explanation if hiding would create control jitter or a confusing mode gap.

Only use this option if it is genuinely useful:
- map it to a real local collapsed Spaghetti body inside the split pane, without removing the pane or duplicating workspace close behavior.

#### Exact First Code Cut

1. Decide which option matches the live host behavior after Phases 1 and 2.
2. Implement the selected rule in the Spaghetti presentation control render path.
3. Preserve shared workspace pane close/remove behavior in `ViewportFrame` and workspace store.
4. Add focused tests proving the split-hosted local `-` no longer appears as a broken action.

#### Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/workspace/ViewportFrame.test.tsx`

#### Verification Shape

- split-pane Spaghetti no longer shows a confusing or broken local `-`
- workspace-level close/remove remains available through the shared shell where eligible
- floating or non-split Spaghetti presentation behavior is not regressed

## [ ] `Spaghetti-Editor 7 / Phase 4` - `Narrow Pane Visual Proof And Closeout`

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

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. Add or run a narrow split-pane scenario for Spaghetti Editor.
2. Verify titlebar, graph selector, canvas toolbar, `e`, `+`, and the chosen `-` rule.
3. Capture any remaining polish as a later follow-on if it is not required for the original screenshot problem.
4. Update this doc and the index with the shipped closeout status.

#### Likely Files

- `src/app/AppShell.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.test.tsx`
- this doc
- `Spaghetti-Editor-index.md`

#### Verification Shape

- automated tests cover the core host and mode behavior
- manual or screenshot validation confirms the narrow split pane no longer overlaps controls
- the plan closes only after `e / +` behavior and the local `-` rule are both honest
