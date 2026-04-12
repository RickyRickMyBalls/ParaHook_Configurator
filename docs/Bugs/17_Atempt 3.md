# 17 - Attempt 3 - Extrude SketchProfiles Port Contract Repair

## Doc History
14. 2026-04-11 09:52:48: Marked `Attempt 3 Chunk 4b - Repair The Stale Canvas Extrude Row Vm` complete after making the canvas explicitly bust selector reuse on graph-document revision changes and remount node views on that same revision boundary, which narrows the stale live extrude row owner to canvas refresh semantics instead of reopening evaluator or debug truth
13. 2026-04-11 09:48:35: Tightened `Attempt 3 Chunk 4b - Repair The Stale Canvas Extrude Row Vm` into an implementation-ready follow-up by grounding it in the current `SpaghettiCanvas.tsx` node-render-data memoization plus the global identity-cache inside `selectNodeVm.ts`, which now look like the most likely owners for a live canvas extrude row staying stale even while Debug Inspector already reads the newer resolved graph truth
12. 2026-04-11 09:46:59: Added `Attempt 3 Chunk 4b - Repair The Stale Canvas Extrude Row Vm` after live screenshots plus Debug Inspector proof showed the parent `SketchProfiles` wire color, evaluated profile input, evaluated body output, and connected `OutputPreview` publication are already correct while the visible canvas `Geometry/Extrude` rows still render stale `No SketchProfiles ...` and `SolidBodies = Waiting` surface state
11. 2026-04-11 09:39:35: Marked `Attempt 3 Chunk 4a - Repair The Live Extrude Header Status Note` complete after adding one selector-owned raw `profileWireCount` fallback and using it in `NodeView.tsx` so the extrude parent row can no longer claim `No SketchProfiles contributors yet` while a whole-profile wire is visibly connected, even if contributor-entry details temporarily drop out of the row state
10. 2026-04-11 09:30:09: Tightened `Attempt 3 Chunk 4a - Repair The Live Extrude Header Status Note` into an implementation-ready follow-up by grounding it in the current `selectNodeVm.ts` contributor-entry derivation and the `NodeView.tsx` `profileSummary` header-status branch that still falls back to `No SketchProfiles contributors yet` whenever live `profileInputEntries` truth drops out despite connected/building geometry
9. 2026-04-11 09:30:09: Added a new top-of-doc `Current Problem List` section so this attempt now carries an explicit numbered live problem index and clearly marks the doc focus as the parent `Geometry/Extrude.ExtrusionProfile` contract plus its remaining row-surface truth follow-up
8. 2026-04-11 09:28:04: Added `Attempt 3 Chunk 4a - Repair The Live Extrude Header Status Note` as the next narrow follow-up after live screenshots showed the upstream `SketchProfiles` wire color is now correct but the extrude parent-row header/status note still falls back to a false `No SketchProfiles ...` state while geometry continues building successfully
7. 2026-04-11 09:14:41: Marked `Attempt 3 Chunk 4 - Repair The Visible Extrude Parent Row Surface` complete after fixing the visible `Geometry/Extrude` parent-row summary/copy ladder in `NodeView.tsx`, then tracing the remaining screenshot-backed singular wire-tone symptom to `SpaghettiCanvas.tsx` so the upstream `SketchProfiles` parent wire now stays on the collection color even when stale source-path metadata survives on the edge payload
6. 2026-04-11 09:02:28: Added one screenshot-backed chunk-4 note that the live `SketchProfiles` wire still renders with the singular `SketchProfile` tone, recording that visible color mismatch as part of the same parent-row surface verification pass unless implementation proves it belongs to a different UI owner
5. 2026-04-11 08:58:18: Tightened `Attempt 3 Chunk 4 - Repair The Visible Extrude Parent Row Surface` into a more implementation-ready node-surface pass by grounding it in the current `src/app/spaghetti/canvas/NodeView.tsx` parent-row summary, contributor-entry, and placeholder branches that still own the visible `Awaiting SketchProfiles contributors` copy after chunk 3 made evaluator and selector truth explicit
4. 2026-04-11 08:47:26: Marked `Attempt 3 Chunk 3 - Align Evaluator And Selector To One Explicit Collection Contract` complete after normalizing `Geometry/Extrude.ExtrusionProfile` evaluation to one flat resolved profile collection, then updating selector and debug reads to narrate contributor mode from that same explicit collection contract instead of re-deriving mixed nested shapes
3. 2026-04-11 08:41:01: Marked `Attempt 3 Chunk 2 - Replace Compat-Only Validation With A Real Mixed-Contributor Contract` complete after replacing the old aggregate-only `SketchProfiles -> ExtrusionProfile` validation exception with one explicit extrude-contributor contract that accepts both `sketchProfiles` and `sketchProfile` sources into the parent collection input, then adding focused validate/parity proof for the singular whole-port lane
2. 2026-04-11 08:37:19: Marked `Attempt 3 Chunk 1 - Correct The Declared Extrude Parent Input Contract` complete after changing the declared `Geometry/Extrude.ExtrusionProfile` port kind from `sketchProfile` to `sketchProfiles` and updating the registry plus node-view contract tests so the parent extrude row now carries the honest collection type/tone at the declared contract layer
1. 2026-04-11 08:32:51: Created this fresh attempt-3 execution note after bug 17 attempt 2 grew too large to stay readable, carrying forward only the still-live root-cause evidence that `Geometry/Extrude.ExtrusionProfile` is currently labeled like a `SketchProfiles` collection row but still declared and surfaced as a singular `sketchProfile` port

## Doc Body

### Status

- `[in_progress]`

### Reference

Use this file as the clean execution surface for the next repair passes.

Background history, screenshots, and earlier attempt notes remain in:

- `docs/Bugs/17_2026-04-10_21-20-39_extrude-sketchprofiles-awaiting-state-with-resolved-parent-collection.md`

### Current Problem List

- `Problem 1 - Parent extrude contract drift`
  `Geometry/Extrude.ExtrusionProfile` was authored and surfaced as if it were a singular `SketchProfile` lane even though the intended user-facing contract is one parent `SketchProfiles` collection input.
- `Problem 2 - Cross-layer truth drift`
  Declared contract, validation, evaluator, selector, debug, and visible node surface did not all agree on that same parent collection input, which let one layer say "collection" while another still behaved like "singular" or "awaiting."
- `Problem 3 - Remaining live row-note bug`
  The upstream `SketchProfiles` wire color now appears correct, but the live extrude parent-row header/status note can still fall back to a false `No SketchProfiles ...` message while geometry continues building.

This attempt is focused on `Problem 1` and `Problem 2` end-to-end, with the current next task narrowed to the remaining `Problem 3` row-note follow-up in chunk `4a`.

### Current Root-Cause Read

The strongest current read is no longer "one more stale edge shape."

The newer live evidence suggests the parent extrude input contract itself is still wrong:

- the row label says `SketchProfiles`
- the row is visibly colored like a singular `sketchProfile` channel, not a `sketchProfiles` collection channel
- the node registry currently declares `Geometry/Extrude.ExtrusionProfile` as `type.kind = sketchProfile`
- validation currently compensates for that mismatch with a one-off compat rule that allows `SketchProfiles -> ExtrusionProfile`
- evaluation and selector logic already special-case the same port as a mixed aggregate-or-singular contributor lane

Put simply:

- the graph/runtime path has partial special handling for a collection input
- but the declared port contract and visible row styling still advertise a singular-profile lane

That mismatch is now the strongest likely owner for:

- the wrong input-row color
- the wrong collection-versus-singular narration
- the parent extrude row staying in an awaiting branch even while compile/debug truth resolves aggregate profiles

### What Must Stay True

- the extrude parent row should behave as one collection input for aggregate `SketchProfiles`
- singular `SketchProfile` contributors must still remain valid contributors into that same parent input
- the fix should remove mismatch, not add more one-off fallback branches
- grouped versus split `Output Preview` semantics should remain unchanged
- downstream `SolidBodies` and `Output Preview` should only be claimed fixed if they become correct from the same repaired parent-input contract

## [x] Attempt 3 Chunk 1 - Correct The Declared Extrude Parent Input Contract

### Goal

Make the declared `Geometry/Extrude.ExtrusionProfile` port contract honest:

- row label = `SketchProfiles`
- row color/type = collection contract
- input semantics = parent collection input that can still accept singular contributors

### Required Work

- change the declared extrude input port kind from `sketchProfile` to `sketchProfiles`
- update any direct registry and node-contract snapshots that still assert the singular type
- confirm `effectivePorts` and visible port resolution now surface the collection kind for the parent extrude row

### Likely Files

- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/registry/nodeRegistry.test.ts`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`

### Proof

- the visible extrude parent row uses the `sketchProfiles` tone
- the parent row still exists as one managed parent row, not four synthetic singular rows

### Implemented Result

- changed the declared `Geometry/Extrude.ExtrusionProfile` port kind in `src/app/spaghetti/registry/nodeRegistry.ts` from `sketchProfile` to `sketchProfiles` while keeping the existing parent row label and unbounded incoming-connection contract
- updated the direct registry contract assertion in `src/app/spaghetti/registry/nodeRegistry.test.ts`
- updated the extrude parent-row fixtures in:
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
- kept the sketch-side singular `SketchProfile` child outputs untouched; this chunk only corrected the declared parent extrude input contract
- refreshed two stale `NodeView.test.tsx` collection-summary assertions so they match the current `Body Collection Output` copy already shipped in the node surface

### Verification

- `npm.cmd exec vitest run src/app/spaghetti/registry/nodeRegistry.test.ts src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/canvas/NodeView.test.tsx`

## [x] Attempt 3 Chunk 2 - Replace Compat-Only Validation With A Real Mixed-Contributor Contract

### Goal

Keep singular `SketchProfile` contributors working after chunk 1 without relying on a misleading type mismatch plus one-off compat exception.

### Required Work

- update connection-contract logic so `ExtrusionProfile` is treated as a collection input that explicitly accepts:
  - whole-port `SketchProfiles`
  - whole-port `SketchProfile`
  - sketch profile member outputs
- remove or reduce the current special-case rule that only exists because the target port is declared as singular
- keep `maxConnectionsIn = unbounded` and duplicate/whole-path rules stable

### Likely Files

- `src/app/spaghetti/contracts/endpoints.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/contracts/contractParity.test.ts`

### Proof

- `SketchProfiles -> ExtrusionProfile` remains valid
- `SketchProfile -> ExtrusionProfile` remains valid
- multiple singular profile contributors into the parent collection remain valid
- non-profile contributors are still rejected

### Implemented Result

- replaced the old aggregate-only helper in `src/app/spaghetti/contracts/endpoints.ts` with one explicit extrude-profile contributor contract that now accepts both:
  - `from.type.kind = sketchProfiles`
  - `from.type.kind = sketchProfile`
  into the parent `Geometry/Extrude.ExtrusionProfile` collection input
- kept the rule scoped to the whole parent extrude input so the connection contract stays explicit instead of broadening unrelated port-type compatibility
- added one focused validation regression in `src/app/spaghetti/compiler/validateGraph.test.ts` proving that whole-port `SketchProfile -> ExtrusionProfile` wiring now remains valid under the repaired collection contract
- added one focused projected-contract parity regression in `src/app/spaghetti/contracts/contractParity.test.ts` proving the same singular whole-port lane stays accepted by the cheap/projected validation path too
- preserved the already-existing validation proof that:
  - sketch profile member outputs remain valid contributors
  - multiple singular contributors remain valid
  - mixed aggregate-plus-singular contributor sets remain valid
  - non-profile contributors are still rejected

### Verification

- `npm.cmd exec vitest run src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/contracts/contractParity.test.ts`

## [x] Attempt 3 Chunk 3 - Align Evaluator And Selector To One Explicit Collection Contract

### Goal

Remove the current "declared singular, evaluated as mixed collection" ambiguity so evaluator truth and selector truth read from one explicit contract.

### Required Work

- confirm `evaluateGraph.ts` handles the repaired declared type without fallback ambiguity
- keep aggregate parent `SketchProfiles` contributing a resolved profile array
- keep singular contributors valid as collection members
- make selector-owned `profileTargetMode`, `hasProfile`, `profileCount`, and `profileInputEntries` derive from that same explicit contract

### Likely Files

- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`

### Proof

- compile/debug/canvas all agree on aggregate parent-input resolution
- exact captured bug-17 payload still resolves as aggregate input
- singular-contributor regressions still pass

### Implemented Result

- updated `src/app/spaghetti/features/extrudeProfileConnections.ts` with one shared extrude-profile normalization helper so aggregate and singular contributors can be flattened into one ordered resolved profile collection
- updated `src/app/spaghetti/compiler/evaluateGraph.ts` so `Geometry/Extrude.ExtrusionProfile` now always evaluates to one flat `sketchProfiles`-shaped profile array, even when the parent input is fed by:
  - whole-port `SketchProfiles`
  - whole-port `SketchProfile`
  - sketch profile member outputs
  - mixed aggregate-plus-singular contributor sets
- updated `src/app/spaghetti/registry/nodeRegistry.ts` so extrude compute now reads that same explicit collection contract directly instead of recursively tolerating the older mixed nested contributor bag
- updated `src/app/spaghetti/selectors/selectNodeVm.ts` so `hasProfile`, `profileCount`, `resolvedProfileMembers`, and single-profile metadata now derive from the evaluated collection input while contributor-mode narration still comes from explicit edge classification
- updated `src/app/spaghetti/selectors/selectDebugInspectorVm.ts` so debug capture summarizes the repaired collection input from the same evaluator-owned profile array while preserving aggregate-versus-single contributor wording where possible
- added focused regression updates in:
  - `src/app/spaghetti/compiler/evaluateGraph.test.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`

### Verification

- `npm.cmd exec vitest run src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/selectors/selectNodeVm.test.ts src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- `npm.cmd exec vitest run src/app/spaghetti/registry/nodeRegistry.test.ts`

## [x] Attempt 3 Chunk 4 - Repair The Visible Extrude Parent Row Surface

### Goal

Make the visible parent row narrate the repaired contract honestly.

### Required Work

- remove any row-surface assumptions that still treat the parent extrude row as singular
- keep the parent row summary collection-shaped
- ensure the expanded row language distinguishes:
  - aggregate parent `SketchProfiles` contributor
  - singular `SketchProfile` contributor
- ensure the wrong awaiting branch is no longer reachable for a resolved parent collection

### Current Surface Read

Chunk 3 now made evaluator and selector truth explicit enough that the remaining owner looks local to the visible extrude row surface.

The strongest live owner seams appear to be inside `src/app/spaghetti/canvas/NodeView.tsx`:

- `profileSummary`
  - still chooses between collection-ready versus singular-style summary text
- `profileRequirementLabel`
  - still feeds waiting/build-requirement narration that can fall back to generic contributor wording
- `renderExtrudeProfileAttachedBody(...)`
  - still owns the `Profile Target` explanation copy
  - still decides when aggregate-versus-single narration appears
- the expanded placeholder branch under `data-sp-extrude-placeholder="profile"`
  - still owns the visible `Awaiting SketchProfiles contributors` / `No SketchProfiles contributors yet` path

Latest screenshot-backed note:

- the live wire drawn from the upstream `SketchProfiles` parent row still appears in the singular `SketchProfile` color/tone
- unless implementation proves that wire tone is owned by a different rendering seam than the parent row copy, treat that mismatch as part of the same chunk-4 visible-surface fix and verification pass

Put simply:

- compile/selector/debug now know the parent input is one explicit collection
- the next question is whether the visible extrude parent row is still narrating that collection as if it were waiting on a singular-style contributor lane

### Locked Goal For This Chunk

- keep one parent `SketchProfiles` input row
- make its collapsed summary read like one collection input, not one singular-profile slot
- keep expanded contributor rows honest:
  - aggregate parent contributor row
  - singular contributor row
  - resolved member rows underneath the same owning parent collection when available
- stop the generic `Awaiting SketchProfiles contributors` branch from appearing when:
  - the parent aggregate contributor is already wired
  - the evaluated collection has already resolved closed profiles

### Questions / Decisions

#### [ ] Question 1 - What should decide the parent-row waiting copy?

##### Suggested answer
- the selector-owned collection truth from chunk 3:
  - `profileTargetMode`
  - `hasProfile`
  - `profileCount`
  - `profileInputEntries`
  - `resolvedProfileMembers`

##### Why
- chunk 3 already made those fields the explicit contract owner
- chunk 4 should consume that truth, not rebuild another node-surface fallback owner

#### [ ] Question 2 - What visible state should replace the stale generic awaiting branch?

##### Suggested answer
- three explicit collection states:
  - no contributors wired yet
  - aggregate contributor wired but currently resolving zero closed profiles
  - resolved collection with one or more closed profile members

##### Why
- those are the real user-facing states now exposed by the repaired contract
- they separate `no wire yet` from `wire present but zero closed profiles`, which is exactly where the stale bug wording has been misleading

#### [ ] Question 3 - Where should chunk 4 stop?

##### Suggested answer
- at visible extrude parent-row narration, summary, and expanded collection/member readability in `NodeView`

##### Why
- chunk 3 already owns evaluator/selector/debug truth
- chunk 5 already owns downstream `SolidBodies` / `Output Preview` verification
- this pass should not reopen publication semantics or build new selector contracts

### Implementation-Ready Checks

- re-read the `Geometry/Extrude` input-row path in `src/app/spaghetti/canvas/NodeView.tsx`, especially:
  - `profileSummary`
  - `profileRequirementLabel`
  - `renderExtrudeProfileEntryRows(...)`
  - `renderExtrudeProfileAttachedBody(...)`
  - the `data-sp-extrude-placeholder="profile"` branch
- prefer selector-owned truth from chunk 3 over new local inference:
  - if `profileTargetMode === 'allFromSketch'` and `profileInputEntries` already include one aggregate contributor, the parent row should read as collection-owned even before checking downstream body readiness
- distinguish these cases explicitly:
  - no upstream contributor yet
  - one aggregate parent contributor wired but currently zero resolved closed profiles
  - one or more singular contributors wired
  - resolved aggregate collection with member rows
- preserve the already-shipped aggregate-versus-single contributor entry rows:
  - do not collapse aggregate and singular entry narration back into one generic line
- keep the pass narrow:
  - no selector contract redesign
  - no evaluator changes
  - no `Output Preview` changes
  - no downstream `SolidBodies` claims beyond the visible parent row

### Suggested Implementation Order

1. Re-read the current `Geometry/Extrude` parent-row branch in `src/app/spaghetti/canvas/NodeView.tsx`.
2. Replace the generic waiting summary/copy with one explicit collection-state ladder keyed from chunk-3 selector truth.
3. Confirm the expanded row body still distinguishes:
   - aggregate contributor entry rows
   - singular contributor entry rows
   - resolved member rows
4. Add or tighten focused `NodeView` proof for:
   - no contributors
   - aggregate contributor wired but zero closed profiles
   - resolved aggregate collection
   - singular contributor lane
   - legacy aggregate target id

### Suggested Verification

- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/canvas/NodeView.test.tsx`

### Acceptance Checks

- the parent row color and visible copy both read as `SketchProfiles` collection truth
- the connected parent `SketchProfiles` wire no longer renders in the singular `SketchProfile` tone in the live proving graph
- the exact bug-17 graph no longer shows the stale generic awaiting copy once the aggregate parent collection is resolved
- the expanded row reads as one owning collection input with contributor/member detail underneath
- `no contributor yet` and `wired but zero closed profiles` stay visibly distinct

### Likely Files

- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`

### Proof

- the parent row color matches `sketchProfiles`
- the exact live graph no longer shows `Awaiting SketchProf...`
- expanded row content reads like one collection input with contributor/member details underneath

### Implemented Result

- updated `src/app/spaghetti/canvas/NodeView.tsx` so the dedicated extrude parent row now reads from one explicit visible state ladder:
  - no contributors yet
  - aggregate parent contributor wired but currently zero closed profiles
  - resolved collection summary
  - singular contributor collection summary
- kept one parent `SketchProfiles` row while preserving explicit aggregate-versus-single contributor entry narration and the resolved-member list under the same owning collection row when expanded
- removed the stale generic `Awaiting SketchProfiles contributors` branch from the resolved aggregate lane and replaced the waiting/build-requirement copy with contributor-aware collection wording keyed from chunk-3 selector truth
- updated `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` so the screenshot-backed wire-tone mismatch is now normalized from explicit extrude contributor classification:
  - aggregate `SketchProfiles` contributors stay on the collection wire tone even if stale source-path metadata is still present on the edge payload
  - singular `SketchProfile` contributors keep the singular tone
- added and tightened focused proof in:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`

### Verification

- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`

## [x] Attempt 3 Chunk 4a - Repair The Live Extrude Header Status Note

### Goal

Fix the still-wrong live `SketchProfiles` header/status note on `Geometry/Extrude` without reopening the wire-color work that now appears correct.

### Current Live Read

Latest live screenshots change the chunk-4 read in one important way:

- the upstream `SketchProfiles` wire now appears to be on the correct collection tone
- geometry is still building in the model viewport
- but the extrude parent-row header/status note still shows a false `No SketchProfiles ...` state, likely truncated by the row width

That means the remaining problem is no longer:

- canvas wire coloring

The remaining problem is more likely:

- the header/status summary text for the parent `SketchProfiles` row
- or the live selector-to-row contributor-entry truth feeding that summary

### Current Surface Read

The current likely owner seam is narrower than chunk 4:

- `src/app/spaghetti/canvas/NodeView.tsx`
  - `profileSummary` is still the direct owner of the right-side header/status note
  - it currently falls back to `No SketchProfiles contributors yet` whenever both:
    - `hasAggregateContributor === false`
    - `hasSingularContributor === false`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - `profileInputEntries`
  - `profileTargetMode`
  - `profileCount`
  - `resolvedProfileMembers`
  - these fields now decide whether `NodeView` sees the row as empty, aggregate-wired, singular-wired, or resolved

Put simply:

- the wire can now render correctly from canvas-side normalization
- but the header/status note can still lie if live `profileInputEntries` truth does not survive into `NodeView`
- the next pass should prove whether the failure is:
  - selector truth dropping the contributor entries
  - or `NodeView` choosing the empty-state header branch despite valid contributor truth

### Required Work

- reproduce the exact live row-header/status state for the bug-17 graph
- determine whether the wrong note comes from:
  - missing `profileInputEntries`
  - stale `hasProfile` / `profileCount` / `resolvedProfileMembers`
  - row-header summary choosing the empty-state branch despite connected contributor truth
- repair the parent-row status note so the live graph no longer says `No SketchProfiles ...` while the extrude is visibly connected and building
- keep the already-fixed wire tone unchanged

### Locked Goal For This Chunk

- keep the current correct collection wire tone
- make the parent-row header/status note agree with the actual contributor state
- treat `connected and building` as incompatible with the empty-state `No SketchProfiles ...` note
- keep expanded attached-body copy and collapsed/header summary on the same truth source

### Questions / Decisions

#### [ ] Question 1 - Which field should own the header/status empty-state decision?

##### Suggested answer
- `profileInputEntries.length`

##### Why
- the live bug is specifically that the header/status note is claiming "no contributors" while the row is visibly connected
- `hasProfile` alone is not enough, because a connected aggregate parent can still temporarily resolve zero closed profiles
- the empty-state branch should require genuinely zero contributor entries, not merely zero resolved members

#### [ ] Question 2 - What is the most likely live failure mode to prove first?

##### Suggested answer
- selector contributor-entry loss for the exact live graph payload

##### Why
- `NodeView` only shows `No SketchProfiles contributors yet` when contributor counts are zero
- the screenshots now show:
  - correct wire tone
  - connected row
  - active geometry build
- that combination points more strongly to row-summary input truth than to wire classification

#### [ ] Question 3 - What counts as fixed for chunk 4a?

##### Suggested answer
- the right-side header/status note no longer claims `No SketchProfiles ...` in the proving graph, and the same graph still keeps the collection wire tone from chunk 4

##### Why
- chunk 4a is a narrow live-truth follow-up, not another full row-copy redesign

### Implementation-Ready Checks

- reproduce or encode the exact live graph shape where:
  - the sketch parent `SketchProfiles` row is connected
  - the extrude row header/status note still reads like an empty state
  - geometry is visibly building
- inspect `selectNodeVm.ts` for whether `wholeIncomingForProfile` / `validProfileIncoming` can still become empty for the proving graph despite the repaired contract
- inspect `NodeView.tsx` for whether the header/status note should use:
  - contributor-entry truth first
  - resolved-member truth second
- keep the pass narrow:
  - no wire-color changes
  - no evaluator redesign
  - no downstream `SolidBodies` / `Output Preview` widening

### Suggested Implementation Order

1. Add one focused proving regression for the live header/status bug.
2. Confirm whether `selectNodeVm.ts` is dropping `profileInputEntries` for that graph.
3. If selector truth is correct, tighten `NodeView.tsx` so the header/status branch cannot choose the empty-state note while contributor entries exist.
4. Re-check that expanded attached-body copy still agrees with the header/status summary.

### Suggested Verification

- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/selectors/selectNodeVm.test.ts`

### Acceptance Checks

- the live proving graph keeps the corrected `SketchProfiles` wire color from chunk 4
- the extrude parent-row header/status note no longer says `No SketchProfiles ...` while the row is connected
- aggregate-connected but zero-resolved and truly-empty states remain visibly distinct
- header/status summary and expanded row copy narrate the same contributor state

### Likely Files

- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

### Proof

- the live bug-17 graph keeps the correct `SketchProfiles` wire color
- the extrude parent-row header/status note no longer reports `No SketchProfiles ...` while the row is connected and geometry builds
- row-header summary and expanded attached-body copy agree on the same contributor state

### Implemented Result

- updated `src/app/spaghetti/selectors/selectNodeVm.ts` so the extrude node vm now carries a raw `profileWireCount` whenever one or more whole-profile wires target the parent `SketchProfiles` input, even if contributor-entry details are not available in the current row state
- updated `src/app/spaghetti/canvas/NodeView.tsx` so the parent-row header/status summary, waiting copy, and placeholder copy now use that raw-wire fallback before choosing the false empty-state `No SketchProfiles contributors yet` branch
- kept the chunk-4 collection wire-tone repair unchanged; this follow-up only repairs the remaining connected-row note drift
- added focused proof in:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`

### Verification

- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/selectors/selectNodeVm.test.ts`

## [x] Attempt 3 Chunk 4b - Repair The Stale Canvas Extrude Row Vm

### Goal

Make the live canvas `Geometry/Extrude` rows agree with the already-correct debug/compile truth for the proving graph.

### Current Live Read

Debug Inspector now proves that the core extrude truth is already correct for the live graph:

- evaluated profile input = `aggregate profiles (4)`
- evaluated body output = `solidBodies (4)`
- connected `OutputPreview` slot is already `resolved`

But the visible canvas node still says:

- `No SketchProfiles ...`
- `SolidBodies = Waiting`

That means the remaining bug is no longer:

- declared contract
- validation
- evaluator truth
- debug truth
- output-preview publication truth

The remaining bug is now specifically:

- stale canvas/node surface vm for the extrude node

### Current Surface Read

The current likely owner seam is narrower than the broader contract work:

- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - `evaluation`, `diagnosticsVm`, and `nodeRenderDataById` are all memoized off `graph` plus `graphDocumentRevision`
  - this is the live canvas owner that decides when the extrude node gets fresh vm props
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - still keeps one global identity-based cache:
    - `lastGraph`
    - `lastEvaluation`
    - `lastDiagnosticsVmArg`
    - `lastNodeVmResult`
  - if the live app reaches a state where those identities stay stable while the visible canvas should refresh, the stale extrude row can survive even though newer truth exists elsewhere
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
  - already keys its debug vm memoization off `graphDocumentRevision`
  - that matches the live evidence where Debug Inspector is correct while the node surface is stale

Put simply:

- debug truth is already current
- the canvas node surface is the stale consumer
- the likely remaining work is invalidation/memoization honesty, not another extrude contract rewrite

### Required Work

- trace why the canvas extrude node can keep older row state even while Debug Inspector reads the newer resolved graph truth
- inspect memoization and invalidation around:
  - `SpaghettiCanvas.tsx`
  - `selectNodeVm.ts`
  - `NodeView.tsx`
- prove whether the stale surface comes from:
  - cached selector result keyed too narrowly
  - canvas node-render data not rebuilding when the graph/runtime truth changes
  - `NodeView` holding stale props relative to the current graph document revision
- repair the live canvas node so:
  - the parent `SketchProfiles` row reflects the resolved aggregate input
  - the `SolidBodies` row reflects the resolved plural body output

### Locked Goal For This Chunk

- keep evaluator/debug/output-preview truth unchanged
- refresh the visible canvas extrude node from that already-correct truth
- make the `SketchProfiles` row and `SolidBodies` row update together from the same fresh node vm
- avoid reopening row-copy wording unless stale invalidation turns out not to be the owner

### Questions / Decisions

#### [ ] Question 1 - What is the strongest likely owner to prove first?

##### Suggested answer
- canvas selector invalidation around `SpaghettiCanvas.tsx` plus `selectNodeVm.ts`

##### Why
- Debug Inspector already proves compile/debug truth is correct for the same graph document
- the stale symptoms are both on the visible canvas node:
  - input row note
  - output row waiting state
- that points to one stale node-vm consumer more strongly than to two fresh-but-wrong row branches

#### [ ] Question 2 - What should count as the proving regression?

##### Suggested answer
- one focused canvas-facing regression where the same graph document advances from unresolved to resolved extrude truth and the rendered node surface must refresh to match the new vm

##### Why
- chunk 4b is about stale live refresh behavior, not only static render wording
- the proof should fail if the canvas keeps an older extrude vm after the graph/runtime revision advances

#### [ ] Question 3 - What should stay out of scope?

##### Suggested answer
- no new evaluator normalization
- no new debug-inspector work
- no output-preview publication redesign

##### Why
- those surfaces already appear correct from the live proof

### Implementation-Ready Checks

- inspect whether the proving graph change path actually bumps the same revision signal used by:
  - `SpaghettiCanvas.tsx`
  - `DebugInspectorDrawer.tsx`
- inspect whether the global identity cache in `selectNodeVm.ts` can reuse stale vm data across the live proving path
- check whether a canvas-side memo or prop path can keep `NodeView` mounted with older `extrudeVm` even after the graph document revision changes
- keep the pass narrow:
  - no copy rewrites unless stale invalidation is disproven
  - no wire-color changes
  - no downstream publication changes

### Suggested Implementation Order

1. Add one focused proving regression for a stale canvas extrude row refresh.
2. Verify whether `selectNodeVm.ts` cache invalidation is too weak for the live proving path.
3. Verify whether `SpaghettiCanvas.tsx` node-render-data memoization needs a stronger refresh key.
4. Repair the narrowest owner and confirm both the parent input row and `SolidBodies` row refresh together.

### Suggested Verification

- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/selectors/selectNodeVm.test.ts`

### Acceptance Checks

- Debug Inspector and the visible canvas extrude node agree on the same proving graph
- the parent `SketchProfiles` row reflects resolved aggregate input when debug truth says `aggregate profiles (4)`
- the `SolidBodies` row reflects resolved plural body output when debug truth says `solidBodies (4)`
- connected `OutputPreview` remains resolved and unchanged
- no new contract or evaluator drift is introduced while fixing the stale canvas refresh path

### Likely Files

- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`

### Proof

- Debug Inspector and the visible canvas extrude node agree on the same proving graph
- the parent `SketchProfiles` row no longer shows `No SketchProfiles ...` when debug truth says `aggregate profiles (4)`
- the `SolidBodies` row no longer shows `Waiting` when debug truth says `solidBodies (4)`
- connected `OutputPreview` behavior remains unchanged and still resolved

### Implemented Result

- updated `src/app/spaghetti/selectors/selectNodeVm.ts` so the selector cache now accepts an explicit caller-owned cache key instead of relying only on graph/evaluation/diagnostics object identity
- updated `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` so the live canvas now:
  - passes `graphDocumentRevision` through as the selector cache-busting key for `selectNodeVm(...)`
  - remounts each `NodeView` on that same revision boundary
- kept evaluator, debug-inspector, and output-preview truth unchanged; this pass only repairs the stale canvas consumer that could keep older extrude row state alive after the graph document revision advanced
- added focused proof in `src/app/spaghetti/selectors/selectNodeVm.test.ts` that advancing the caller-owned cache key rebuilds selector vm data even when the graph/evaluation inputs are otherwise identical

### Verification

- `npm.cmd exec vitest run src/app/spaghetti/selectors/selectNodeVm.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

## [ ] Attempt 3 Chunk 5 - Verify Downstream SolidBodies And OutputPreview Only After The Parent Contract Is Fixed

### Goal

Confirm which downstream symptoms disappear automatically once the parent input contract is repaired, without widening semantics.

### Required Work

- retest `SolidBodies` readiness for `New Objects`
- retest child `SolidBody` member visibility under the parent output row
- retest connected `Output Preview`
- preserve grouped versus split semantics exactly as authored

### Likely Files

- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/outputSurface.test.ts`
- `src/app/spaghetti/previewPreparation.ts`

### Proof

- if the connected slot is `grouped`, it still publishes one object
- if the connected slot is `split`, it fans out correctly once the repaired parent contract produces plural body truth
- no downstream behavior is claimed fixed unless the repaired parent-input contract actually unlocks it

### Definition Of Done

- `Geometry/Extrude` declares and renders its parent `SketchProfiles` input as a real collection contract
- singular `SketchProfile` contributors still work into that same parent input
- compile truth, selector truth, debug truth, and visible row truth all agree for the exact captured bug-17 graph
- the parent row no longer shows the stale awaiting state when the upstream parent collection is resolved
- any remaining downstream bug after that point is small enough to track separately without re-opening the whole parent-contract question
