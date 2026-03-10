# NI-3 - Node Section Collapse Consistency

Tasklist entry: `[088] 2026-03-05 21:47`

[x] Node-local mode consistency
    [x] Kept node mode ownership in node-scoped UI state only
    [x] Restored deterministic title-click mode cycling through `collapsed -> essentials -> expanded -> collapsed`
    [x] Kept NI-1 selection/drag behavior unchanged while title clicks remain non-drag interactions

[x] Section-shell normalization
    [x] Unified `Drivers`, `Inputs`, `Feature Stack`, and `Outputs` around one deterministic section-body visibility rule
    [x] Ensured collapsed node mode hides all major section bodies while keeping section headers visible
    [x] Kept section toggle state node-scoped and independent with no cross-section side effects
    [x] Kept deterministic section order as `Drivers -> Inputs -> Feature Stack -> Outputs`

[x] Feature Stack ownership cleanup
    [x] Removed real `Feature Wire Inputs` port-row rendering from sketch/extrude feature panels
    [x] Replaced misplaced feature-port UI with status-only linked-input indicators inside Feature Stack
    [x] Kept actual wireable non-driver inputs owned by the `Inputs` section only

[x] Deterministic coverage
    [x] Added mode-cycle coverage in `rowViewMode.test.ts`
    [x] Expanded `NodeView` coverage for collapsed body hiding, independent section collapse, title-cycle affordance, feature-input ownership, and cross-part section order consistency
    [x] Verification: `npx.cmd tsc -p tsconfig.json --noEmit`
    [x] Verification: `npm.cmd run test -- src/app/spaghetti/canvas/rowViewMode.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts src/app/spaghetti/canvas/interactionModel.test.ts`
    [x] Verification: `npm.cmd run test`
    [x] Verification: `npm.cmd run build`
