# NI-2 - Per-Node View Mode System

Tasklist entry: `[087] 2026-03-05 20:57`

[x] View mode vocabulary
    [x] Standardized canvas node mode type to `ViewMode = 'collapsed' | 'essentials' | 'expanded'`
    [x] Removed remaining `'everything'` usage from active canvas code/tests

[x] UI store ownership
    [x] Added `nodeModeByNodeId`
    [x] Added `getNodeMode(nodeId)` with deterministic `essentials` fallback
    [x] Added `setNodeMode(nodeId, mode)` as the only mutation entry point
    [x] Extended per-node UI cleanup to clear stored node mode entries

[x] Node/canvas integration
    [x] Removed `NodeView` mode prop and made `NodeView` read mode by `node.nodeId`
    [x] Removed canvas-global render-mode ownership and toolbar mode selector
    [x] Retargeted node mode context menu actions to the clicked node only
    [x] Removed hidden automatic mode switching paths
    [x] Preserved NI-1 selection/drag behavior

[x] Deterministic coverage
    [x] Added UI-store tests for fallback, set/get, per-node isolation, cleanup, and selection-state isolation
    [x] Updated NodeView mode coverage to use stored per-node modes
    [x] Verification: `npx.cmd tsc -p tsconfig.json --noEmit`
    [x] Verification: `npm.cmd run test -- src/app/spaghetti/canvas/rowViewMode.test.ts src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/interactionModel.test.ts`
    [x] Verification: `npm.cmd run test`
    [x] Verification: `npm.cmd run build`
