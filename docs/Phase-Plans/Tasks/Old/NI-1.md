# NI-1 - Node Selection & Drag Model

Tasklist entry: `[086] 2026-03-05 20:21`

[x] Interaction ownership split
    [x] Header / drag handle path selects node and remains the only drag-start path
    [x] Node body path selects node without arming drag
    [x] Interactive controls preserve selection and do not start node drag
    [x] True empty canvas path clears selection

[x] NodeView intent wiring
    [x] Added explicit header pointer callback
    [x] Added explicit body pointer callback
    [x] Kept `NodeView` free of graph mutation logic

[x] SpaghettiCanvas ownership enforcement
    [x] Routed header selection and drag through a dedicated handler
    [x] Routed body selection through a dedicated handler
    [x] Restricted stage deselection to true empty-canvas interactions

[x] Deterministic coverage
    [x] Added interaction-model tests for selection, drag gating, and empty-canvas clearing
    [x] Added `NodeView` coverage for separate header/body hit zones
    [x] Verification: `npm.cmd run test -- src/app/spaghetti/canvas/interactionModel.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
    [x] Verification: `npx.cmd tsc -p tsconfig.json --noEmit`
    [x] Verification: `npm.cmd run test`
    [x] Verification: `npm.cmd run build`
