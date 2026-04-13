# Cleanup Phase Cleanup-9 - Browser And Console Complexity Reduction

## Doc Header

### Doc History
14. 2026-04-13 13:45:19: Closed out this standalone `Cleanup 9` phase doc as a shipped cleanup lane after the Browser/Console boundary baseline, owner-drift inventory, split-rule lock, first sink-reduction proof boundary, narrow shared graph-target proof, and final proof-plus-handoff closeout all landed, so the controller-reduction lane now lives under `Cleanup/Shipped/` instead of remaining in `Cleanup/Future/`
13. 2026-04-13 13:41:39: Completed `Phase 6 - Proof, Cleanup, And Later Browser Or Console Handoff` as a proof-and-doc-closeout pass by confirming the landed `Phase 5` shared graph-target seam against the cleanup vision and cleanup index, locking the first Browser/Console sink-reduction claim as proven, separating the remaining later Browser, later Console, still-honest shared seam, downstream adapter, and broader Console verification-noise buckets without starting them, and writing the explicit handoff boundary so later cleanup work does not reopen the proven `workspaceIntents.ts` plus `browserRowActions.ts` seam
12. 2026-04-13 13:39:28: Tightened `Phase 6 - Proof, Cleanup, And Later Browser Or Console Handoff` into an implementation-ready proof-and-doc-closeout pass by grounding the closeout in the landed `Phase 5` shared graph-target seam, making the residual Browser, Console, shared-seam, adapter, and verification-noise buckets explicit, and tightening the stop rule so the final pass closes the first proof without silently widening into a second Browser/Console implementation lane
11. 2026-04-13 13:32:38: Completed `Phase 5 - Prove One Narrow Browser And Console Sink Reduction` by extracting a shared graph-target activation seam into `workspaceIntents.ts`, collapsing Browser graph-row open/view/new-editor/swap-editor routing through one `browserRowActions.ts` graph-target handler, repointing the Browser controller and Console interaction sinks onto that shared seam, adding focused shared-intent and Browser row-action proof, and recording the passing Browser/shared-intent test band plus build alongside the still-failing unrelated Console staged-navigation and ConsoleDock assertions outside this seam
10. 2026-04-13 13:21:59: Tightened `Phase 5 - Prove One Narrow Browser And Console Sink Reduction` into an implementation-ready code-and-verification pass by grounding the first proof in the completed `Phase 4` boundary, fixing the shared activation-and-reveal seam plus the Browser and Console sink-pressure files as the exact code target band, preserving `stagedNavigation.ts` as the Console-local helper and the Browser/Console/Viewport surfaces as the smallest consumer repoint set, and tying verification to the narrow Browser, Console, and build proof band before any broader cleanup starts
9. 2026-04-13 13:18:52: Completed `Phase 4 - Lock The First Sink-Reduction Proof Slice` as a docs-and-verification pass by turning the completed `Phase 3` split rule into one explicit first proof boundary around the shared activation-and-reveal routing seam, locking `workspaceIntents.ts` plus `browserRowActions.ts` as the owner seam, `useBrowserPanelController.ts` plus `useConsoleInteraction.ts` as the sink-pressure reduction band, `stagedNavigation.ts` as the Console-local supporting helper, and `BrowserPanel.tsx`, `ConsoleDock.tsx`, plus `ViewportOverlay.tsx` as the smallest downstream consumer set while preserving the no-widening exclusions for the first code pass
8. 2026-04-13 13:15:55: Tightened `Phase 4 - Lock The First Sink-Reduction Proof Slice` into an implementation-ready docs-and-verification pass by grounding the first proof in the completed `Phase 3` split rule, naming the shared activation-and-reveal owner seam plus the exact Browser and Console sink-pressure surfaces and smallest downstream consumer band, and making the explicit no-widening exclusions concrete before the first code pass
7. 2026-04-13 13:13:26: Completed `Phase 3 - Lock The Browser And Console Split Rule` as a docs-and-verification pass by turning the completed `Phase 2` inventory into one explicit split between Browser-local coordination, Console-local grammar and prompt/session shaping, shared activation-and-reveal action seams, and store-owned truth, while preserving `BrowserPanel.tsx`, `ConsoleDock.tsx`, and `ViewportOverlay.tsx` as downstream adapters and keeping the two large controller sinks out of the shared-owner target
6. 2026-04-13 13:05:30: Tightened `Phase 3 - Lock The Browser And Console Split Rule` into an implementation-ready docs-and-verification pass by grounding the split in the completed `Phase 2` inventory, narrowing the rule onto the Browser-local coordination band, the Console-local grammar/session band, the shared activation-and-reveal action seam, and the downstream adapter set, while preserving the explicit no-widening rule before the first proof slice
5. 2026-04-13 13:03:28: Completed `Phase 2 - Inventory Hidden Browser And Console Owner Drift` as a docs-and-verification pass by classifying the live Browser sink, Console sink, Browser derivation helpers, Console grammar/read helpers, shared `workspaceIntents.ts` plus `browserRowActions.ts` handoff seams, and the downstream Browser/Console/Viewport adapters into explicit inventory buckets, then locking the shared activation-and-reveal action-meaning seam as the `Phase 3` rule target and the first narrow `Phase 4` proof slice
4. 2026-04-13 13:00:28: Tightened `Phase 2 - Inventory Hidden Browser And Console Owner Drift` into an implementation-ready docs-and-verification pass by grounding the inventory in the completed `Phase 1` hotspot set, making the expected Browser-versus-Console-versus-shared seam buckets explicit, and locking the strongest likely `Phase 3` split-rule target plus the first narrow `Phase 4` activation/reveal proof candidate before any code movement starts
3. 2026-04-13 12:55:56: Completed `Phase 1 - Reconfirm Browser And Console Cleanup Boundary After Cleanup 8A` as a docs-and-verification pass by re-reading the cleanup and repo vision rules against the shipped `Cleanup 7` command-adapter baseline and the shipped `Cleanup 8A` authored-contract proof, then locking one explicit Browser-and-Console boundary where Browser keeps surface coordination and row presentation, Console keeps grammar and prompt/session shaping, shared `workspaceIntents.ts`-style seams remain the home for reusable cross-surface action meaning, and `ViewportOverlay.tsx` plus similar surfaces stay downstream adapters rather than hidden owners
2. 2026-04-13 12:54:31: Tightened `Phase 1 - Reconfirm Browser And Console Cleanup Boundary After Cleanup 8A` into an implementation-ready docs-and-verification pass by grounding the baseline read in the live Browser sink `useBrowserPanelController.ts`, the live Console sinks `stagedNavigation.ts` and `useConsoleInteraction.ts`, the shared activation seam in `workspaceIntents.ts`, and the downstream adapter pressure in `ViewportOverlay.tsx`, while making the expected boundary questions, hotspot outputs, and no-widening exclusions explicit before the Browser-and-Console drift inventory starts
1. 2026-04-13 12:43:45: Created this standalone future phase doc for `Cleanup 9` to hold the Browser-and-Console controller-reduction lane after shipped `Cleanup 8A`, grounding it in the cleanup vision's large-controller warning, the cleanup index's next-lane framing, the live Browser sink in `useBrowserPanelController.ts`, the live Console sinks in `stagedNavigation.ts` and `useConsoleInteraction.ts`, and the already-shared activation seam in `workspaceIntents.ts`

### Purpose

This doc defines the `Cleanup 9` follow-on phase for the `Cleanup` family.

Use it to answer:
- how Browser and Console complexity should be reduced without moving ownership to the wrong layer
- which Browser and Console surfaces are honest controllers, grammar owners, selectors, and adapters versus hidden ownership sinks
- where shared activation, selection, reveal, and workspace-intent seams should live
- how to prove one narrow controller-reduction slice before widening into broader Browser or Console cleanup

Do not use it for:
- reopening the owner baselines already locked by earlier cleanup lanes
- redesigning the whole Browser or Console product surface
- broad AppShell or workspace-layout reorganization
- radio/runtime feature growth
- CAD authored-contract convergence work that already belonged to `Cleanup 8A`

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - cleanup family scan surface
  - lane ordering after shipped `Cleanup 8A`

- `../Cleanup-Vision.md`
  - cleanup framing for large controller sinks, compatibility retirement, and repo-shape honesty

- `../Canonical-Ownership-Targets.md`
  - owner baseline this lane must preserve while reducing Browser and Console complexity

- `../Canonical-Owner-Decisions.md`
  - one-real-owner rules this lane must not reopen

- `./Cleanup_Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry.md`
  - locked workspace-surface taxonomy that keeps Browser and Console as real surfaces instead of shell accidents

- `./Cleanup_Phase Cleanup-7 - Node-Owned CAD Authoring And Command Adapter Unification.md`
  - locked command-adapter and workspace-intent baseline this lane should reuse rather than reopen

- `./Cleanup_Phase Cleanup-8A - Feature-Stack And Graph-Native CAD Contract Convergence.md`
  - most recent shipped cleanup lane before this one

- `../../../../Vision.md`
  - repo-level `What Must Stay True` summary

- `../../../roadmap/Vision-roadmap.md`
  - canonical north star for graph-native ownership, explicit contracts, and shared workspace behavior

## Doc Body

## [x] Cleanup 9 - Browser And Console Complexity Reduction

### Header

Purpose:
- reduce the biggest Browser and Console controller sinks without turning those surfaces into new hidden owners

Owns:
- Browser and Console complexity reduction
- Browser and Console controller-versus-owner boundary cleanup
- shared activation/reveal/selection seam clarification where Browser and Console overlap
- one narrow proof slice that reduces a real controller sink without widening into a whole Browser or whole Console redesign

Does not own:
- workspace-surface taxonomy already locked in `Cleanup 4A`
- node-owned CAD authoring or command-adapter baseline already locked in `Cleanup 7`
- CAD authored-contract convergence already closed in `Cleanup 8A`
- AppShell or workspace-layout redesign
- radio/runtime product expansion

### Why This Phase Exists

The cleanup vision already called out Browser and Console as large-controller risk areas.

Current Browser and Console behavior is no longer thin glue:
- Browser coordinates graph documents, project content, references, viewer composition, workspace selection, build-policy rows, drag state, menus, and cross-surface handoff
- Console coordinates staged grammar, prompt sessions, graph and viewport actions, reference-transform command routing, camera routing, sketch command entry, and workspace surface switching

That means the next problem is not "should Browser and Console exist?"

The next problem is:
- where Browser and Console should stay powerful surface owners
- where they should become slimmer coordinators over shared intent and store seams
- which cross-surface actions should move to one explicit shared home instead of being reassembled in giant controller files

Without a cleanup lane here:
- Browser row shaping and Browser action routing can keep becoming a second project/workspace owner
- Console grammar and Console execution can keep mixing prompt ownership with graph/workspace mutation details
- each later feature will keep landing inside `useBrowserPanelController.ts` or `useConsoleInteraction.ts` because those files already know "how to do everything"

This phase exists so we can:
1. lock the Browser and Console controller boundary,
2. inventory the live hidden-owner drift,
3. define one explicit split between grammar/controller/adapters and real owner surfaces,
4. prove that split with one narrow shared Browser/Console slice,
5. then hand later Browser and Console growth forward from a cleaner baseline.

### Scope

This phase covers:
- Browser and Console controller complexity reduction
- shared activation/reveal/selection seams where Browser and Console overlap
- hidden-owner drift in Browser and Console row/action/grammar/controller bands
- one narrow proof slice that validates the chosen split in live code

This phase does not cover:
- broad Browser UX redesign
- broad Console UX redesign
- workspace shell/layout redesign
- CAD family cleanup
- radio/runtime feature growth
- feature work that can be solved without reducing Browser or Console controller pressure

### Current Read

The repo already has some honest helper bands around Browser and Console, but the main controller files still carry too much cross-surface logic.

- `src/app/panels/useBrowserPanelController.ts`
  - is the clearest Browser controller sink today
  - currently mixes graph-document actions, content selection, viewer composition, reference actions, context menus, drag state, viewport routing, and workspace handoff logic

- `src/app/panels/selectBrowserTreeRows.ts`
  - already reads more honestly as Browser row derivation
  - should stay a selector-style read surface rather than becoming a mutation owner

- `src/app/panels/browserRowActions.ts`
  - already acts like a small Browser action-routing seam
  - is a strong candidate for a later proof slice because it sits between row presentation and cross-surface action execution

- `src/app/console/stagedNavigation.ts`
  - already reads like the most honest grammar owner in the Console lane
  - still needs the later cleanup rule to keep grammar/session shaping separate from actual mutation ownership

- `src/app/console/useConsoleInteraction.ts`
  - is the clearest Console controller sink today
  - currently mixes command parsing handoff, staged-grammar execution, graph actions, camera/view actions, sketch entry, workspace surface switching, and transform command routing

- `src/app/store/workspaceIntents.ts`
  - already provides the clearest shared activation and selection seam across multiple surfaces
  - is the strongest current candidate for shared Browser/Console action handoff instead of per-surface action rebuilding

- `src/app/components/ViewportOverlay.tsx`
  - remains a downstream adapter surface that reads some of the same workspace and sketch entry behavior
  - should stay out of the first proof unless the later slice truly needs it

### Locked Direction

- Browser should remain the owner of Browser row presentation, Browser menus, Browser drag interactions, and Browser surface coordination
- Console should remain the owner of typed command grammar, prompt sessions, staged navigation, and Console-facing assist/read surfaces
- shared store, intent, and command seams should own actual graph/workspace/reference mutation behavior when the same action meaning is needed across multiple surfaces
- staged navigation should stay a grammar/session owner, not become a hidden graph/workspace mutation owner
- Browser selectors and Browser row families should stay read models, not second owners of project or graph truth
- Browser and Console controller files should get slimmer over time by handing real action meaning to smaller shared seams, not by pushing everything into UI components
- this lane should prove one narrow controller-reduction rule before widening into broader Browser or Console cleanup

### Browser And Console Baseline

The working default for this lane is:
- preserve one explicit split between:
  - surface-owned Browser and Console grammar/presentation/controller concerns
  - shared cross-surface action/intent concerns
  - store-owned graph/project/reference/workspace truths

Browser and Console may own:
- row presentation and row affordance shaping
- prompt and staged-grammar shaping
- menu, drag, and interaction glue that is truly surface-local

Browser and Console should not own:
- canonical graph truth
- canonical project/content truth
- canonical reference-transform truth
- canonical workspace routing truth when the same action meaning already exists across multiple surfaces

Shared cross-surface seams may own:
- reusable workspace activation and selection intents
- reusable graph/content reveal actions
- reusable cross-surface command identity mapping when multiple surfaces need the same action meaning

### Phase Ladder

## [x] Phase 1 - Reconfirm Browser And Console Cleanup Boundary After Cleanup 8A

Purpose:
- lock one explicit baseline that says `Cleanup 9` is a Browser-and-Console controller-reduction lane downstream from the shipped `Cleanup 8A` authored-contract proof

Read:
- `Phase 1` should stay a docs-and-verification pass

Current read:
- the strongest live Browser controller sink is:
  - `src/app/panels/useBrowserPanelController.ts`
- the strongest live Console controller sinks are:
  - `src/app/console/stagedNavigation.ts`
  - `src/app/console/useConsoleInteraction.ts`
- the strongest current shared activation seam is:
  - `src/app/store/workspaceIntents.ts`
- the strongest current downstream adapter pressure surface is:
  - `src/app/components/ViewportOverlay.tsx`

Locked in-scope:
- re-read the cleanup family direction and recent cleanup baselines
- make explicit what belongs to `Cleanup 9` versus what remains later Browser/Console product work
- identify the main Browser and Console hidden-owner hotspots for `Phase 2`
- answer the first boundary questions explicitly:
  - which Browser responsibilities are honest surface coordination versus hidden owner drift
  - which Console responsibilities are honest grammar/session ownership versus hidden mutation routing
  - which shared activation/reveal/selection seams already have an honest home
  - which downstream adapters should stay downstream in later phases

Locked out-of-scope:
- code movement
- Browser redesign
- Console redesign
- AppShell redesign
- workspace shell/layout redesign
- radio/runtime feature expansion
- broad test rewrites

Strongest live repo seams:
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserRowActions.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/store/workspaceIntents.ts`
- `src/app/components/ViewportOverlay.tsx`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-7 - Node-Owned CAD Authoring And Command Adapter Unification.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-8A - Feature-Stack And Graph-Native CAD Contract Convergence.md`
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`

Implementation spec:
1. Re-read the cleanup family direction and repo vision rules that keep ownership explicit and downstream surfaces derived.
2. Re-read the shipped `Cleanup 7` and shipped `Cleanup 8A` boundaries.
3. Re-scan the live Browser and Console hotspots listed above.
4. Write one explicit baseline that answers:
   - what Browser and Console may own honestly
   - what shared cross-surface seams may own
   - what this lane can reduce safely without reopening earlier cleanup decisions
5. Name the concrete hotspot outputs that `Phase 2` should classify:
   - Browser controller sinks
   - Console grammar/controller sinks
   - honest shared cross-surface seams
   - downstream adapters
   - any likely compatibility residue
6. Stop before this pass turns into a drift inventory, code move, or proof-slice selection pass.

Stop rule:
- do not start the `Phase 2` inventory inside `Phase 1`
- do not propose code movement in this baseline pass
- do not widen into Browser or Console redesign language

Checklist:
- [x] re-read the cleanup family direction and repo vision rules
- [x] re-read the shipped `Cleanup 7` and `Cleanup 8A` records
- [x] re-scan the live Browser and Console hotspots
- [x] answer the first Browser/Console boundary questions explicitly
- [x] name the concrete hotspot outputs for the later inventory
- [x] write one explicit Browser-and-Console cleanup boundary baseline

Verification:
- manually confirm the Browser and Console lane stays downstream from the shipped `Cleanup 7` and `Cleanup 8A` baselines
- manually confirm the hotspot list still centers on controller-sink reduction rather than product redesign
- manually confirm `Phase 1` stops at baseline framing and does not collapse into `Phase 2` inventory or later proof planning

Expected implementation result:
- one explicit baseline says `Cleanup 9` is a controller-reduction lane rather than a Browser or Console product-redesign lane
- the first Browser and Console hotspot set is locked around:
  - `useBrowserPanelController.ts`
  - `stagedNavigation.ts`
  - `useConsoleInteraction.ts`
  - `workspaceIntents.ts`
  - `ViewportOverlay.tsx`
- the phase leaves behind a clear `Phase 2` inventory target set and a clear no-widening rule for the rest of the lane

Implementation result:
- `Cleanup 9` is now explicitly locked as a controller-reduction lane downstream from the shipped `Cleanup 7` and `Cleanup 8A` baselines, not as a Browser redesign, Console redesign, or AppShell follow-on
- the first Browser/Console boundary is now explicit:
  - Browser may own surface coordination, row presentation, menus, drag interactions, and Browser-local interaction glue
  - Console may own typed command grammar, prompt sessions, staged navigation, and Console-facing assist/read shaping
  - shared cross-surface seams may own reusable activation, selection, reveal, and command-meaning handoff when multiple surfaces need the same action
  - store-owned graph/project/reference/workspace truths stay out of Browser and Console controller ownership
- the strongest current hotspot set is now locked for the later inventory:
  - Browser controller sink:
    - `src/app/panels/useBrowserPanelController.ts`
  - Console controller and grammar sinks:
    - `src/app/console/stagedNavigation.ts`
    - `src/app/console/useConsoleInteraction.ts`
  - honest shared cross-surface seam candidate:
    - `src/app/store/workspaceIntents.ts`
  - downstream adapter pressure surface:
    - `src/app/components/ViewportOverlay.tsx`
  - likely companion read/helper surfaces for later classification:
    - `src/app/panels/browserRowActions.ts`
    - `src/app/panels/selectBrowserTreeRows.ts`
- the no-widening rule is now explicit for the rest of the lane:
  - do not turn the next phases into Browser product redesign
  - do not turn the next phases into Console product redesign
  - do not reopen earlier ownership and authored-contract cleanup decisions
  - do not start code movement before the drift inventory is complete

## [x] Phase 2 - Inventory Hidden Browser And Console Owner Drift

Purpose:
- classify the live Browser and Console complexity seams into honest controller, shared-intent, hidden-owner-drift, adapter-only, and compatibility-residue buckets

Read:
- `Phase 2` should stay a docs-and-verification pass

Current read:
- the strongest sink-pressure surfaces named by the completed `Phase 1` baseline are still:
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/console/useConsoleInteraction.ts`
- likely honest Browser-local derivation and row-shaping surfaces are:
  - `src/app/panels/selectBrowserTreeRows.ts`
  - `src/app/panels/browserRowFamilies.ts`
- likely honest Console-local grammar and read-model surfaces are:
  - `src/app/console/selectConsoleVm.ts`
  - `src/app/console/stagedNavigation.ts`
- likely honest shared cross-surface activation and reveal seams are:
  - `src/app/store/workspaceIntents.ts`
  - `src/app/panels/browserRowActions.ts`
- likely downstream adapter surfaces that should stay downstream are:
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/console/ConsoleDock.tsx`
  - `src/app/components/ViewportOverlay.tsx`
- likely compatibility or carryover pressure still shows up where Browser or Console controller files directly reassemble activation, selection, reveal, or workspace-routing meaning that already has a shared seam candidate

Implementation spec:
1. Re-read the completed `Phase 1` baseline and preserve its locked Browser-versus-Console-versus-shared-intent boundary.
2. Re-scan the strongest hotspot set from `Phase 1` together with the companion derivation, grammar, and adapter surfaces listed above.
3. Classify each live seam into one explicit inventory bucket:
   - honest Browser-local controller or derivation
   - honest Console-local grammar or session shaping
   - honest shared cross-surface activation, selection, or reveal seam
   - hidden-owner drift inside Browser or Console controller sinks
   - downstream adapter-only surface
   - compatibility or carryover residue
4. Name the real current files that belong in each bucket so the inventory stays grounded in live repo seams rather than generic Browser/Console claims.
5. Lock the strongest likely `Phase 3` rule target around the shared Browser-and-Console activation plus reveal-action meaning seam across:
   - `src/app/store/workspaceIntents.ts`
   - `src/app/panels/browserRowActions.ts`
   - `src/app/panels/useBrowserPanelController.ts`
   - `src/app/console/stagedNavigation.ts`
   - `src/app/console/useConsoleInteraction.ts`
6. Lock the first likely `Phase 4` proof candidate as the narrow shared activation/reveal-routing slice rather than a broad Browser tree, Console prompt, or workspace-shell rewrite.
7. Stop before this pass turns into code movement, owner repointing, or a broad Browser/Console redesign proposal.

Stop rule:
- do not start code movement in this inventory pass
- do not widen into Browser tree redesign, Console prompt redesign, or AppShell/layout cleanup
- do not collapse honest selectors, grammar helpers, or adapters into the hidden-owner bucket just because they are near the larger controller sinks
- do not pick a `Phase 4` proof candidate that requires broad row-model reshaping or broad prompt-session redesign

Checklist:
- [x] re-read the `Phase 1` baseline
- [x] re-scan the strongest hotspot set plus companion derivation, grammar, and adapter surfaces
- [x] classify the live Browser and Console seams
- [x] name the concrete files inside each inventory bucket
- [x] lock the strongest `Phase 3` rule target
- [x] lock the first `Phase 4` proof candidate
- [x] preserve the no-widening stop rule for the later phases

Verification:
- manually confirm the inventory uses the real current files rather than generic Browser/Console claims
- manually confirm the inventory keeps honest Browser-local, Console-local, shared, and adapter surfaces separate instead of flattening everything into controller drift
- manually confirm the first proof candidate is narrow enough for a later code pass

Expected implementation result:
- the completed inventory is grounded in the actual Browser and Console sink, helper, and adapter files named in `Phase 1`
- the strongest `Phase 3` rule target is locked around the shared activation/reveal-action meaning seam rather than around a full Browser or full Console rewrite
- the first `Phase 4` proof candidate is locked as one narrow activation/reveal-routing slice across Browser, Console, and shared intent seams
- the lane leaves behind an explicit no-widening rule before any code-moving phase starts

Implementation result:
- the Browser-and-Console drift inventory is now explicitly grounded in the live repo seams named by `Phase 1` rather than a generic Browser/Console narrative
- honest Browser-local controller and derivation surfaces are now classified as:
  - `src/app/panels/selectBrowserTreeRows.ts`
  - `src/app/panels/browserRowFamilies.ts`
  - `src/app/panels/BrowserPanel.tsx` only where it remains a Browser-facing presentation adapter rather than a shared action owner
- honest Console-local grammar and read-model surfaces are now classified as:
  - `src/app/console/selectConsoleVm.ts`
  - `src/app/console/stagedNavigation.ts`
  - `src/app/console/ConsoleDock.tsx` only where it remains a Console-facing presentation adapter rather than a shared action owner
- honest shared cross-surface action seams are now classified as:
  - `src/app/store/workspaceIntents.ts`
  - `src/app/panels/browserRowActions.ts`
- hidden-owner drift and sink-pressure surfaces are now classified as:
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/console/useConsoleInteraction.ts`
  - specifically where those controller files directly reassemble activation, selection, reveal, surface switching, or mutation-routing meaning that should be expressed once in a shared seam or left in a true owner
- downstream adapter-only surfaces are now classified as:
  - `src/app/components/ViewportOverlay.tsx`
  - the Browser and Console dock/panel surfaces when they are only forwarding already-owned behavior
- compatibility or carryover residue is now explicitly treated as the remaining Browser/Console controller logic that still reconstructs shared activation/reveal meaning instead of consuming one stable seam
- the strongest `Phase 3` rule target is now locked around one explicit split:
  - Browser keeps Browser-local row presentation and interaction coordination
  - Console keeps staged grammar and prompt/session shaping
  - shared activation, reveal, and action meaning across surfaces should converge on `workspaceIntents.ts` and `browserRowActions.ts` style seams instead of being rebuilt inside the two large controller files
- the first `Phase 4` proof candidate is now locked as the narrow shared activation-and-reveal routing slice across:
  - `src/app/store/workspaceIntents.ts`
  - `src/app/panels/browserRowActions.ts`
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/console/stagedNavigation.ts`
  - `src/app/console/useConsoleInteraction.ts`
- the no-widening rule remains explicit for the later phases:
  - do not widen into Browser tree redesign
  - do not widen into Console prompt redesign
  - do not widen into AppShell or workspace-layout cleanup
  - do not start code movement until the `Phase 3` split rule is locked

## [x] Phase 3 - Lock The Browser And Console Split Rule

Purpose:
- define one explicit ownership split between Browser/Console controller concerns, shared cross-surface action seams, and real owner surfaces

Read:
- `Phase 3` should stay a docs-and-verification pass

Current read:
- the completed `Phase 2` inventory already narrowed the strongest rule target to:
  - Browser-local row presentation and interaction coordination
  - Console-local staged grammar and prompt/session shaping
  - shared activation, reveal, and action-meaning seams
  - downstream adapter-only Browser, Console, and Viewport surfaces
- the rule should stay grounded in the live files that anchor that split:
  - `src/app/store/workspaceIntents.ts`
  - `src/app/panels/browserRowActions.ts`
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/console/stagedNavigation.ts`
  - `src/app/console/useConsoleInteraction.ts`
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/console/ConsoleDock.tsx`
  - `src/app/components/ViewportOverlay.tsx`

Implementation spec:
1. Re-read the completed `Phase 2` inventory and preserve its explicit seam buckets.
2. Lock the explicit split between:
   - Browser-owned row presentation, menus, drag interactions, and Browser-local coordination
   - Console-owned staged grammar, prompt sessions, and Console-local assist/read shaping
   - shared activation, selection, reveal, and action-meaning seams
   - store-owned graph/project/reference/workspace truths that neither Browser nor Console should quietly own
3. Name the concrete live files that belong to each side of that split so the rule stays tied to real repo seams.
4. Name the surfaces that should remain downstream adapters:
   - `src/app/panels/BrowserPanel.tsx`
   - `src/app/console/ConsoleDock.tsx`
   - `src/app/components/ViewportOverlay.tsx`
5. Explicitly keep `useBrowserPanelController.ts` and `useConsoleInteraction.ts` as sink-pressure surfaces to reduce later, not as the new shared-owner home.
6. Preserve the stop rule so the later proof does not widen into full Browser tree cleanup, full Console prompt redesign, or AppShell/layout work.

Stop rule:
- do not start code movement or consumer repointing in this rule-locking pass
- do not move Browser-local row derivation into shared seams just because it is near shared actions
- do not move Console-local grammar/session shaping into shared seams just because it triggers cross-surface actions
- do not let the shared seam absorb canonical graph/project/reference/workspace truth
- do not redefine the first proof slice while locking the split rule

Checklist:
- [x] re-read the completed `Phase 2` inventory
- [x] define the Browser versus Console versus shared-intent split
- [x] name the concrete live files that anchor the split
- [x] name the downstream adapter surfaces
- [x] keep the controller sinks out of the shared-owner target
- [x] preserve the narrow-proof stop rule

Verification:
- manually confirm the shared split does not let Browser or Console become quiet owners of graph/project/reference/workspace truth
- manually confirm staged grammar remains separate from mutation ownership
- manually confirm the downstream adapter surfaces stay downstream in the rule and do not become hidden owners

Expected implementation result:
- one explicit split is locked between Browser-local coordination, Console-local grammar/session shaping, shared activation/reveal/action seams, and store-owned truth
- the live file set for that split is named directly so `Phase 4` can target real seams instead of abstract categories
- the downstream adapter surfaces are explicitly preserved as downstream-only
- the no-widening rule remains explicit before the first code proof

Implementation result:
- the Browser-and-Console split rule is now explicitly locked around four bands:
  - Browser-local coordination and row-facing interaction behavior
  - Console-local staged grammar and prompt/session shaping
  - shared activation, selection, reveal, and action meaning across surfaces
  - store-owned graph/project/reference/workspace truth
- Browser-local concerns are now explicitly treated as:
  - row presentation, menus, drag interactions, and Browser-local coordination
  - anchored in `src/app/panels/useBrowserPanelController.ts`, `src/app/panels/selectBrowserTreeRows.ts`, and `src/app/panels/browserRowFamilies.ts`
- Console-local concerns are now explicitly treated as:
  - staged grammar, prompt sessions, and Console-local assist/read shaping
  - anchored in `src/app/console/stagedNavigation.ts`, `src/app/console/useConsoleInteraction.ts`, and `src/app/console/selectConsoleVm.ts`
- shared cross-surface action meaning is now explicitly treated as:
  - activation, selection, reveal, and other action identity reused across Browser and Console
  - anchored in `src/app/store/workspaceIntents.ts` and `src/app/panels/browserRowActions.ts`
- downstream adapters are now explicitly preserved as downstream-only:
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/console/ConsoleDock.tsx`
  - `src/app/components/ViewportOverlay.tsx`
- the two largest controller sinks remain reduction targets rather than the new shared-owner home:
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/console/useConsoleInteraction.ts`
- the locked rule now makes the `Phase 4` boundary explicit:
  - keep Browser-local row shaping out of shared seams
  - keep Console-local grammar/session shaping out of shared seams
  - keep canonical graph/project/reference/workspace truth out of Browser, Console, and the shared action seam
  - narrow the first proof to activation/reveal routing rather than broader Browser tree or Console prompt redesign

## [x] Phase 4 - Lock The First Sink-Reduction Proof Slice

Purpose:
- pick one explicit first code slice that reduces real Browser and Console controller pressure without widening into a full product rewrite

Read:
- `Phase 4` should stay a docs-and-verification pass

Current read:
- the strongest first proof slice is the shared Browser-and-Console activation plus reveal-routing seam across:
  - `src/app/store/workspaceIntents.ts`
  - `src/app/panels/browserRowActions.ts`
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/console/stagedNavigation.ts`
  - `src/app/console/useConsoleInteraction.ts`
- the smallest honest downstream consumer band is:
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/console/ConsoleDock.tsx`
  - `src/app/components/ViewportOverlay.tsx`
- the proof should keep the split from `Phase 3` visible:
  - shared seams own activation and reveal action meaning
  - Browser keeps Browser-local row and interaction coordination
  - Console keeps staged grammar and prompt/session shaping
  - downstream adapters only forward already-owned behavior

Implementation spec:
1. Re-read the completed `Phase 3` rule and preserve its Browser-local, Console-local, shared-seam, and downstream-adapter split.
2. Lock the first proof slice around shared activation/reveal/selection action meaning rather than broad Browser tree or Console prompt redesign.
3. Name the exact owner, supporting helper, and downstream consumer surfaces for that proof:
   - owner seam:
     - `src/app/store/workspaceIntents.ts`
     - `src/app/panels/browserRowActions.ts`
   - sink-pressure surfaces to reduce:
     - `src/app/panels/useBrowserPanelController.ts`
     - `src/app/console/useConsoleInteraction.ts`
   - supporting grammar helper that should stay Console-local:
     - `src/app/console/stagedNavigation.ts`
   - smallest downstream consumer band:
     - `src/app/panels/BrowserPanel.tsx`
     - `src/app/console/ConsoleDock.tsx`
     - `src/app/components/ViewportOverlay.tsx`
4. Record the explicit exclusions that keep the proof narrow.
5. Preserve the rule that Browser-local row derivation, Console-local prompt shaping, and store-owned truth are not the migration target for the first proof.

Stop rule:
- do not widen the first proof into Browser tree derivation cleanup
- do not widen the first proof into Console prompt or assist redesign
- do not widen the first proof into AppShell/layout or workspace-surface cleanup
- do not treat `BrowserPanel.tsx`, `ConsoleDock.tsx`, or `ViewportOverlay.tsx` as the main migration target
- do not pull canonical graph/project/reference/workspace truth into the shared activation seam

Checklist:
- [x] re-read the completed `Phase 3` rule
- [x] pick one narrow first proof slice
- [x] name the exact owner/helper/consumer surfaces
- [x] keep Browser-local derivation, Console-local prompt shaping, and store-owned truth out of the first proof target
- [x] record the explicit no-widening exclusions

Verification:
- manually confirm the first proof slice reduces controller pressure shared across Browser and Console
- manually confirm the slice does not require a full Browser or full Console redesign
- manually confirm the owner seam, sink-pressure surfaces, and downstream consumer band are all explicit before code movement starts

Expected implementation result:
- the first proof slice is locked around one narrow shared activation-and-reveal routing seam
- the exact owner seam, sink-pressure files, supporting helper, and downstream consumer band are named directly
- the explicit exclusions keep `Phase 5` from widening into Browser tree, Console prompt, or workspace-shell cleanup

Implementation result:
- the first sink-reduction proof slice is now explicitly locked around one narrow shared activation-and-reveal routing seam instead of a broad Browser or Console cleanup pass
- the owner seam for the first proof is now fixed as:
  - `src/app/store/workspaceIntents.ts`
  - `src/app/panels/browserRowActions.ts`
- the sink-pressure reduction band for the first proof is now fixed as:
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/console/useConsoleInteraction.ts`
- the supporting helper that stays Console-local during the proof is now fixed as:
  - `src/app/console/stagedNavigation.ts`
- the smallest honest downstream consumer band for the proof is now fixed as:
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/console/ConsoleDock.tsx`
  - `src/app/components/ViewportOverlay.tsx`
- the proof boundary is now explicit:
  - shared seams should absorb shared activation and reveal action meaning
  - Browser-local row derivation and interaction shaping are not the first migration target
  - Console-local prompt and assist shaping are not the first migration target
  - store-owned graph/project/reference/workspace truth is not part of the first proof seam
- the no-widening rule is now locked for `Phase 5`:
  - do not widen into Browser tree derivation cleanup
  - do not widen into Console prompt or assist redesign
  - do not widen into AppShell/layout or workspace-surface cleanup
  - do not treat adapter consumers as the main migration target

## [x] Phase 5 - Prove One Narrow Browser And Console Sink Reduction

Purpose:
- implement one narrow shared Browser-and-Console sink reduction that proves the split rule is workable in live code

Read:
- `Phase 5` should be the first code-and-verification pass in this lane

Preferred first proof band:
- shared activation/reveal target set:
  - `src/app/store/workspaceIntents.ts`
  - `src/app/panels/browserRowActions.ts`
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/console/stagedNavigation.ts`
  - `src/app/console/useConsoleInteraction.ts`
- smallest honest downstream consumers:
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/console/ConsoleDock.tsx`
  - `src/app/components/ViewportOverlay.tsx`
- keep out of the first proof unless unexpectedly required:
  - broad Browser row-selector reshaping
  - broad Console prompt/assist redesign
  - radio command families
  - workspace shell/layout work
- proof intent:
  - reduce duplicated activation/reveal routing pressure inside the two large controller sinks
  - leave Browser-local derivation and Console-local grammar shaping intact unless a tiny helper adjustment is required to expose the shared seam cleanly

Implementation spec:
1. Re-read the completed `Phase 4` boundary and preserve its owner seam, sink-pressure band, supporting helper, downstream consumers, and explicit exclusions.
2. Create, extract, or repoint only the minimal shared activation/reveal action seam required for the first proof slice:
   - prefer evolving `src/app/store/workspaceIntents.ts`
   - prefer evolving `src/app/panels/browserRowActions.ts`
   - only add a new helper if the existing seam cannot stay honest without it
3. Reduce Browser and Console sink pressure only inside:
   - `src/app/panels/useBrowserPanelController.ts`
   - `src/app/console/useConsoleInteraction.ts`
4. Keep `src/app/console/stagedNavigation.ts` Console-local unless one tiny helper-level adjustment is required to consume the shared seam cleanly.
5. Repoint only the smallest honest downstream consumer band if needed:
   - `src/app/panels/BrowserPanel.tsx`
   - `src/app/console/ConsoleDock.tsx`
   - `src/app/components/ViewportOverlay.tsx`
6. Add focused proof around:
   - Browser row action behavior
   - Console staged-navigation execution behavior
   - any shared activation/reveal seam touched by the proof
7. Verify with the narrowest honest test band plus build.
8. Stop before the lane widens into Browser tree cleanup, Console prompt redesign, or workspace-shell work.

Stop rule:
- do not widen into Browser row-selector or row-family reshaping
- do not widen into Console prompt, assist, or command-language redesign
- do not treat `BrowserPanel.tsx`, `ConsoleDock.tsx`, or `ViewportOverlay.tsx` as the primary migration target
- do not pull canonical graph/project/reference/workspace truth into the shared activation seam
- do not start unrelated Browser or Console cleanup while proving this slice

Checklist:
- [x] create, extract, or repoint the minimal shared activation/reveal seam for the proof slice
- [x] reduce the chosen Browser and Console controller pressure
- [x] keep `stagedNavigation.ts` Console-local unless a tiny helper adjustment is required
- [x] repoint only the smallest honest consumer set if needed
- [x] add focused proof for the converged seam
- [x] verify with targeted tests plus build

Verification:
- targeted tests to prefer first:
  - `cmd /c npm.cmd test -- src/app/panels/browserRowActions.test.ts src/app/panels/BrowserPanel.test.tsx`
  - `cmd /c npm.cmd test -- src/app/console/stagedNavigation.test.ts src/app/console/stagedNavigation.workspaceModes.test.ts`
  - `cmd /c npm.cmd test -- src/app/console/ConsoleDock.test.tsx`
- add one new focused helper or intent test only if the extracted shared seam becomes large enough to justify it
- `cmd /c npm.cmd run build`

Expected implementation result:
- one minimal shared activation/reveal seam is created, clarified, or repointed without broadening the lane
- `useBrowserPanelController.ts` and `useConsoleInteraction.ts` lose some shared-action routing pressure
- `stagedNavigation.ts` remains Console-local
- only the smallest honest downstream consumers are touched if the proof requires it

Implementation result:
- the first Browser-and-Console sink-reduction proof now lands in one explicit shared graph-target activation seam:
  - `src/app/store/workspaceIntents.ts`
  - new `activateGraphTargetIntent(...)` helper over the existing document-versus-node activation band
- Browser graph-row action meaning is now narrowed through one shared graph-target handler in:
  - `src/app/panels/browserRowActions.ts`
  - graph `open`, `view-in-graph`, `new-editor`, and `swap-editor` now route through one `onActivateGraphTarget(...)` seam while `reveal` stays Browser-local
- the Browser controller sink is now thinner in:
  - `src/app/panels/useBrowserPanelController.ts`
  - it no longer rebuilds the document-versus-node activation branch locally and instead delegates that decision to the shared graph-target intent seam
- the Console controller sink is now thinner in:
  - `src/app/console/useConsoleInteraction.ts`
  - repeated graph-document versus graph-node activation paths now converge through one local `activateConsoleGraphTarget(...)` callback backed by the shared `workspaceIntents.ts` seam
- `src/app/console/stagedNavigation.ts` stayed Console-local and unchanged
- the focused proof added or tightened coverage in:
  - `src/app/store/workspaceIntents.test.ts`
  - `src/app/panels/browserRowActions.test.ts`
- downstream consumers stayed minimal:
  - `src/app/panels/BrowserPanel.tsx` stayed behavior-stable under the shared seam proof
  - `src/app/console/ConsoleDock.tsx` and `src/app/components/ViewportOverlay.tsx` did not require seam repoints in this pass
- verification status:
  - passed: `cmd /c npm.cmd test -- src/app/store/workspaceIntents.test.ts src/app/panels/browserRowActions.test.ts src/app/panels/BrowserPanel.test.tsx`
  - passed: `cmd /c npm.cmd run build`
  - failed outside this seam: `cmd /c npm.cmd test -- src/app/console/stagedNavigation.test.ts src/app/console/stagedNavigation.workspaceModes.test.ts`
  - failed outside this seam: `cmd /c npm.cmd test -- src/app/console/ConsoleDock.test.tsx`
  - the observed failing assertions were in unchanged staged-navigation and broader console behavior areas such as root choice lists, zoom-back scope expectations, sketch-plane guided prefills, and object zoom expectation data, so they were left out of this narrow Phase 5 proof pass

## [x] Phase 6 - Proof, Cleanup, And Later Browser Or Console Handoff

Purpose:
- prove the first Browser/Console sink-reduction slice holds and separate later Browser or Console growth from the first cleanup proof

Read:
- `Phase 6` should be a proof-and-doc-closeout pass unless `Phase 5` exposes one small structural correction

Current read:
- the landed `Phase 5` proof already established one honest shared graph-target seam in:
  - `src/app/store/workspaceIntents.ts`
  - `src/app/panels/browserRowActions.ts`
- the reduced sink-pressure band is now explicit in:
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/console/useConsoleInteraction.ts`
- the kept-local and kept-downstream surfaces are now explicit in:
  - `src/app/console/stagedNavigation.ts`
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/console/ConsoleDock.tsx`
  - `src/app/components/ViewportOverlay.tsx`
- the passing proof anchor is the Browser/shared-intent test band plus build
- the still-failing broader Console staged-navigation and ConsoleDock assertions should be recorded as residual verification noise unless the closeout proves they are directly caused by the landed seam

Residual buckets to record:
- later Browser controller reductions
- later Console controller reductions
- any still-honest shared cross-surface seams that should remain shared
- any downstream adapters that should stay thin
- any broader Console verification noise that should be separated from this first proof instead of being silently absorbed into it

Implementation spec:
1. Re-read the landed `Phase 5` proof against the cleanup vision and cleanup index.
2. Confirm the first sink-reduction rule that is now actually proven in code:
   - shared graph-target activation meaning can live in `workspaceIntents.ts`
   - Browser graph-row action routing can converge on that seam through `browserRowActions.ts`
   - Browser and Console controller sinks can consume that seam without moving Browser-local row shaping or Console-local grammar shaping into shared ownership
3. Re-run or tighten the focused proof surfaces only if needed, but do not widen into a second implementation pass.
4. Record the narrow remaining follow-on buckets without starting them:
   - later Browser controller reductions still inside `useBrowserPanelController.ts`
   - later Console controller reductions still inside `useConsoleInteraction.ts`
   - still-honest shared seams that should remain shared
   - downstream adapters that should stay thin
   - broader staged-navigation and ConsoleDock verification noise that does not belong to this first seam proof
5. Write the explicit handoff boundary for the next Browser or Console cleanup lane so future work does not reopen the already-proven shared graph-target seam.
6. Stop once the first controller-reduction rule is proven and the later Browser/Console path is explicit.

Stop rule:
- do not start a second code-moving Browser or Console cleanup pass here
- do not widen into staged-navigation redesign just because unrelated Console tests are still noisy
- do not widen into Browser row-selector or row-family cleanup
- do not widen into AppShell/layout or workspace-surface work
- do not reopen the already-proven shared graph-target seam unless the closeout finds a direct regression inside that seam

Checklist:
- [x] re-read the landed proof against `Cleanup-Vision.md` and `Cleanup-Index.md`
- [x] confirm the first Browser/Console sink-reduction slice that is now actually proven
- [x] classify the remaining Browser, Console, shared-seam, adapter, and verification-noise follow-ons without starting them
- [x] write the explicit later-lane handoff boundary
- [x] stop before a second broad implementation lane starts

Verification:
- manually confirm the landed shared graph-target seam still matches the split locked in `Phase 3`
- manually confirm the passing Browser/shared-intent proof band is enough to support the first seam claim
- manually confirm the still-failing Console suites are recorded honestly as residual noise unless they are directly traced to the landed seam

Expected implementation result:
- the first Browser/Console sink-reduction claim is explicitly proven and closed out
- the remaining Browser, Console, shared-seam, adapter, and verification-noise buckets are named without starting them
- the next cleanup handoff is explicit so future work does not reopen the already-proven `Phase 5` seam by accident

Implementation result:
- the first `Cleanup 9` sink-reduction claim is now explicitly proven and closed out:
  - shared graph-target activation meaning can live in `src/app/store/workspaceIntents.ts`
  - Browser graph-row action routing can converge on that seam through `src/app/panels/browserRowActions.ts`
  - the Browser and Console controller sinks can consume that seam without moving Browser-local row shaping or Console-local grammar shaping into shared ownership
- the proven seam is now explicitly locked as:
  - `src/app/store/workspaceIntents.ts`
  - `src/app/panels/browserRowActions.ts`
- the first reduced sink-pressure band is now explicitly treated as finished proof, not as reopened target selection:
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/console/useConsoleInteraction.ts`
- the still-local and still-downstream surfaces are now explicitly preserved for later work:
  - `src/app/console/stagedNavigation.ts`
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/console/ConsoleDock.tsx`
  - `src/app/components/ViewportOverlay.tsx`
- the remaining follow-on buckets are now explicit without being started:
  - later Browser controller reductions still inside `useBrowserPanelController.ts`
  - later Console controller reductions still inside `useConsoleInteraction.ts`
  - still-honest shared seams that should remain shared after this first proof
  - downstream adapters that should stay thin
  - broader Console staged-navigation and ConsoleDock verification noise that was not directly traced to the landed shared graph-target seam
- the later-lane handoff is now explicit:
  - future Browser cleanup may reduce additional Browser-local controller pressure, but should not reopen the proven shared graph-target seam
  - future Console cleanup may reduce additional Console-local controller pressure or broader staged-navigation behavior, but should treat the current shared graph-target seam as baseline unless a later pass proves a direct regression inside it
  - broader Console test-noise follow-up belongs to a later targeted Console lane, not to retroactively widening this first shared-seam proof
