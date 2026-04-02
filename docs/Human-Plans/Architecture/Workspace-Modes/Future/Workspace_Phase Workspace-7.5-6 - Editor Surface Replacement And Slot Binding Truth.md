# Workspace Phase Workspace-7.5-6 - Editor Surface Replacement And Slot Binding Truth

## Doc Header

### Doc History
1. 2026-04-01 16:45: Closed `Workspace 7.5-6` after the final manual confidence pass came back clean, marking `Phase 3 - Final Replacement Confidence` complete and recording that the shipped replace-versus-preserve behavior now feels honest enough across the tested slot-switch flows to end this follow-on without adding another residue implementation slice
1. 2026-04-01 16:42: Added a dedicated `Phase 3 - Final Replacement Confidence` question block so the close-out slice now has its own unresolved decisions around which host paths must obey the same replace-versus-preserve rules, when a last bug still belongs inside `7.5-6` versus a new follow-on phase, and what exact closure evidence is required before marking the workspace replacement cleanup complete
1. 2026-04-01 16:38: Implemented `Phase 2 - Constructive Bind When Entering Editor`, locking the switch-to-editor answers around valid same-slot retained editor reuse versus opening a new editor, then updating the shared slot-switch seam so `Browser -> Spaghetti Editor` no longer lands on a blank shell, stale retained ids are ignored, and switching another slot to editor opens a fresh viewport instead of stealing an already-visible one
1. 2026-04-01 16:26: Moved the existing question block under `Phase 1 - Destructive Replace When Leaving Editor` and added a new `Phase 2 - Constructive Bind When Entering Editor` question set with suggested answers so each sub-phase now has its own decision surface instead of one shared top-level question block
1. 2026-04-01 16:18: Reformatted the locked-question block in this `Workspace 7.5-6` doc into a clearer checklistable structure, moving the question list under its own `###` section and converting each decision into a `#### [x]` question heading with a nested `##### Suggestion / Locked Answer` block so future question-driven planning updates can scan more cleanly
1. 2026-04-01 16:15: Reformatted this `Workspace 7.5-6` doc to match the more phase-collapsible section style used by `Workspace 7.5-5`, promoting the remaining work into explicit per-phase blocks with their own purpose, main work, done shape, checklist, and verification sections without changing the locked decisions or shipped `Phase 1` read
1. 2026-04-01 16:08: Implemented `Phase 1 - Destructive Replace When Leaving Editor`, updating the workspace slot-replacement seam so split-slot `Spaghetti Editor -> other surface` replacement now clears stale retained spaghetti ids, closes the outgoing `editorViewportId` instead of auto-floating it, and locks that behavior with a focused `AppShell` regression while keeping `Phase 2` reserved for the later constructive switch-to-editor bind fix
1. 2026-04-01 16:01: Locked the remaining `Phase 1` questions and tightened that first slice into implementation-ready form after chat clarified that split-slot replace should close immediately with no confirmation, that only explicit preserve actions such as `float`, `pop out`, and `duplicate` may keep an editor alive, that the outgoing bound `editorViewportId` should be closed rather than orphaned or silently rebound, and that the implementation should live in one shared replacement seam with focused regressions proving `Editor -> Browser` replacement does not auto-float while graph-rendered objects stay alive under Browser truth
1. 2026-04-01 15:57: Locked the first two `Phase 1` decisions after clarifying the exact user action and expected behavior in chat: the right-click split-slot `-` surface menu counts as a true destructive replace when it changes `Spaghetti Editor` to `Browser`, and that replacement closes the outgoing editor surface instance without auto-floating it while still leaving graph-rendered objects alive under Browser and build-policy truth
1. 2026-04-01 15:51: Created this future follow-on phase doc after new post-`Workspace 7.5-5` observations showed two remaining shell-truth seams around surface swapping: replacing a `Spaghetti Editor` split slot with another surface still tries to preserve that editor by auto-floating it, and replacing a non-editor slot with `Spaghetti Editor` can still leave a blank editor shell because the slot changes surface kind without ensuring a bound editor viewport

### Purpose

Use this phase to tighten the meaning of workspace surface replacement for `Spaghetti Editor`.

The goal is:
- replacing an editor surface with another surface should be allowed to truly replace it
- replacing another surface with `Spaghetti Editor` should always result in a live bound editor viewport
- a visible `Spaghetti Editor` shell should never settle into a blank unbound state after an intentional surface switch

### Scope

This phase covers:
- split-slot and host-slot surface replacement semantics involving `Spaghetti Editor`
- the boundary between destructive replace and explicit preserve actions like float, popout, or duplicate
- guaranteeing that any visible `Spaghetti Editor` slot is backed by a real `editorViewportId`

This phase does not cover:
- the broader AppShell architecture refactor deferred after `Workspace 7.5-5`
- new `Open Editors` UX or editor-launcher product work
- graph-runtime, Browser ownership, or Output Preview work already handled under `Workspace 7.5-5`

## Doc Body

### Summary

`Workspace 7.5-6` is the next likely shell follow-on after `7.5-5`.

It exists because two slot-replacement behaviors are still not honest:
- when a split slot changes from `Spaghetti Editor` to `Browser`, the editor tries to survive by auto-floating instead of being truly replaced
- when a slot changes from `Browser` or another non-editor surface to `Spaghetti Editor`, the slot can render a blank editor shell because no editor viewport gets created or rebound

These are related seams.
Both mean the workspace still treats `surface kind` and `bound editor viewport` as slightly separate truths during replacement.

### Locked Direction

`Workspace 7.5-6` should be:
- a slot-replacement truth cleanup
- a surface lifecycle clarification phase
- a narrow shell-behavior follow-on, not a large architecture rewrite

`Workspace 7.5-6` should not be:
- a broad AppShell cleanup bucket
- another Browser or multi-graph ownership phase
- a new editor-session model

### Current Read

Current product expectation:
- `Editor -> Browser` should be a destructive replace unless the user explicitly chose a preserve action first
- `Browser -> Editor` should be a constructive replace that ensures a real editor viewport exists immediately
- closing an editor surface through slot replacement must not suppress already-published graph objects that Browser or build policy still says should render

Current likely shell mismatch:
- some slot-replacement paths still behave as if every editor surface must survive somewhere, so an editor being replaced gets rescued into floating mode
- some switch-to-editor paths still only change the slot surface kind and do not guarantee a concrete bound `editorViewportId`, which leaves a blank `Spaghetti Editor` shell as a final UI state

Desired invariant:
- any visible `Spaghetti Editor` shell must have a bound `editorViewportId`

### Likely Files

- `src/app/AppShell.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

### Phase Sections

## [x] Phase 1 - Destructive Replace When Leaving Editor
### info
Purpose:
- make `Editor -> Browser` or `Editor -> other surface` behave like a true slot replacement instead of an implicit rescue-to-floating path

Current read:
- the exact user-triggered seam is the right-click split-slot `-` surface menu
- the old mismatch was not that replacement failed, but that fallback preservation logic still treated the outgoing editor like something that needed to survive elsewhere
- Browser/build-policy truth for already-published graph content should remain independent from whether that editor shell is still open

Main work:
- identify the exact shared slot-replacement path reached from the right-click split-slot `-` surface menu when `Spaghetti Editor` is changed to `Browser`
- stop that path from auto-floating or otherwise rescuing the outgoing editor when the user explicitly replaced the slot surface kind
- close the outgoing bound `editorViewportId` instead of leaving it orphaned or silently rebinding it
- preserve editor surfaces only for explicit preserve actions
- keep graph-rendered objects alive under Browser and build-policy truth after the editor surface closes

Done shape:
- switching a split slot away from `Spaghetti Editor` can truly close that editor surface
- the shell no longer auto-floats an editor just because its slot was intentionally replaced
- the replaced slot hosts the new surface immediately while graph objects continue following Browser/runtime truth

Shipped read:
- the shared slot replacement seam now supports destructive replace for outgoing `Spaghetti Editor` surfaces by clearing stale retained spaghetti ids on intentional `editor -> other surface` replacement
- `AppShell` now closes the outgoing `editorViewportId` instead of letting fallback shell behavior rescue it into floating mode
- focused regression coverage now locks the exact right-click split-slot `-` menu path so future shell cleanup can build on honest replace-versus-preserve behavior

Locked direction:
- treat the right-click split-slot `-` surface menu as a true slot replacement seam, not a preserve-or-relocate seam
- do not add confirmation by default
- do not mix `Editor -> Browser` destructive replace with the later `Browser -> Editor` constructive bind logic
- keep this slice centered on leaving-editor behavior only unless the exact same shared helper seam naturally exposes the Phase 2 bind path

### Questions / Decisions

#### [x] Question 1 - What should happen when a slot is switched away from `Spaghetti Editor`?

##### Suggestion / Locked Answer
- when the user uses the right-click split-slot `-` surface menu to change `Spaghetti Editor` to `Browser`, treat that exact action as a true replace by default
- close that editor surface instance unless the user explicitly chose `float`, `pop out`, `duplicate`, or another preserve action first
- do not auto-float the outgoing editor as a rescue fallback

##### Why
- replacing a slot is different from preserving a surface
- auto-floating on replace makes the shell feel like it is fighting the user

#### [x] Question 2 - What should happen to graph output when a slot is switched away from `Spaghetti Editor`?

##### Suggestion / Locked Answer
- closing the outgoing editor surface instance does not suppress or unload graph-rendered objects by itself
- graph output should keep rendering if Browser or build policy still says it should render

##### Why
- editor-surface lifetime and project-render lifetime need to stay separate
- Browser and build policy already own runtime presence truth for project content

#### [x] Question 3 - What should count as an explicit preserve action?

##### Suggestion / Locked Answer
- `float`
- `pop out`
- `duplicate`
- any later deliberate `move surface` action if the shell already treats it as preserve-first behavior

##### Why
- these are user-directed preservation actions
- slot replacement should not silently behave like one of them

#### [x] Question 4 - Should split-slot replace ask for confirmation?

##### Suggestion / Locked Answer
- no, close immediately by default
- only add a warning later if the repo already has a concrete unsaved-editor-risk signal worth honoring
- even if a warning is added later, the choices should still be `replace` or `cancel`, not an implicit float rescue

##### Why
- the user is intentionally changing what lives in that slot
- adding auto-rescue or extra friction by default would keep the shell behavior muddy

#### [x] Question 5 - What should happen to the outgoing bound `editorViewportId`?

##### Suggestion / Locked Answer
- unbind it from the replaced slot and close that editor viewport instance
- do not keep it as a hidden orphan
- do not silently rebind it somewhere else

##### Why
- the user is closing that editor surface by replacing the slot
- leaving orphaned editor viewports alive is exactly the kind of hidden shell truth that caused the earlier parity bugs

#### [x] Question 6 - Where should the destructive-replace rule live?

##### Suggestion / Locked Answer
- in one shared slot-replacement seam
- likely in shared workspace surface actions or one host-controller path, not duplicated separately across `AppShell` and `SpaghettiWindowHost`

##### Why
- replace-versus-preserve is a workspace-surface rule, not an individual panel quirk
- duplicating the rule across hosts would make later shell behavior drift again

#### [x] Question 7 - What is the likely current bug shape?

##### Suggestion / Locked Answer
- fallback “editor must survive somewhere” logic is probably firing during an intentional slot replace
- the replace path needs an explicit destructive-replace route so rescue logic does not run afterward

##### Why
- the current bad behavior looks like preserve logic is being triggered after the slot kind changes
- that is more likely than the user action itself literally meaning “float this editor”

#### [x] Question 8 - What invariant should hold after `Editor -> Browser` replacement completes?

##### Suggestion / Locked Answer
- the slot now hosts `Browser`
- the outgoing editor surface is closed
- no floating editor was auto-created
- graph-rendered objects still follow Browser and build-policy truth

##### Why
- this captures the correct separation between editor-surface lifetime and runtime/project render lifetime
- it also gives the tests one clear post-condition instead of several fuzzy expectations

Likely files:
- `src/app/AppShell.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

Highest-signal seams:
- the split-slot surface-type replacement action triggered from the right-click `-` menu
- any shared workspace action that changes a slot from `spaghetti` to another surface kind
- any fallback logic that tries to preserve or relocate an outgoing editor surface after host ownership changes
- editor viewport close or unbind helpers that decide whether the outgoing editor survives

Implementation cut:
1. Trace the right-click split-slot `-` surface menu action into the shared slot replacement seam.
2. Identify where that seam currently falls into preserve-or-float fallback behavior.
3. Add one explicit destructive-replace path for `spaghetti -> other surface`.
4. Close the outgoing `editorViewportId` through that path instead of preserving or relocating it.
5. Keep Browser/build-policy render truth untouched so graph objects remain alive after the editor surface closes.
6. Lock the behavior with focused regressions before touching the later constructive-bind work.

Checklist:
- [x] Lock the exact slot-replacement seam and behavior expectations for destructive replace when leaving editor
- [x] Lock the preserve-action set so replace and preserve are clearly separate concepts
- [x] Lock that graph-rendered objects stay alive under Browser/build-policy truth even though the editor surface closes
- [x] Keep destructive replace and explicit preserve behavior on separate code paths
- [x] Add focused regressions for `Editor -> Browser` destructive replace
- [x] Leave `Browser -> Editor` constructive bind work for `Phase 2` unless the same helper seam naturally covers both directions

Verification:
- replacing a split `Spaghetti Editor` with `Browser` closes that editor instead of auto-floating it
- explicitly floating or popping out an editor still preserves it
- replacing a split `Spaghetti Editor` with `Browser` does not ask for confirmation by default
- the outgoing editor viewport does not survive as a hidden orphan or silently rebind elsewhere
- graph-rendered objects from that closed editor remain visible if Browser/build policy still says they should render

## [x] Phase 2 - Constructive Bind When Entering Editor
### info
Purpose:
- make `Browser -> Spaghetti Editor` or `other surface -> Spaghetti Editor` always produce a live bound editor surface instead of a blank shell

Current read:
- the remaining mismatch is now the opposite direction from Phase 1
- some switch-to-editor paths still only change slot surface kind and stop short of guaranteeing a concrete bound `editorViewportId`
- this leaves a blank editor shell as a final UI state even though the user intentionally asked for `Spaghetti Editor`

Main work:
- lock one helper seam that resolves or creates the editor viewport to bind during slot replacement
- reuse the same slot's retained editor only when that retained id still points to a live editor viewport that is not already visible elsewhere
- otherwise create and bind a new editor viewport before the editor shell finishes switching into view
- make visible `Spaghetti Editor` shells and bound `editorViewportId` truth converge again

Done shape:
- switching any slot to `Spaghetti Editor` always yields a real bound editor viewport
- no visible editor shell remains blank after an intentional switch-to-editor action
- if multiple editors are already open, switching another slot to editor creates or binds the extra editor surface instead of stealing one and leaving a blank shell behind

Shipped read:
- the shared slot-switch seam now resolves `spaghettiEditor` replacements through one helper instead of trusting stale retained ids or dropping straight into a blank shell
- stale retained spaghetti ids are ignored if they no longer point to a live reusable editor viewport
- when another visible editor is already open, switching a different slot to `Spaghetti Editor` now opens a fresh editor viewport instead of reusing or stealing that visible editor

Locked direction:
- keep this slice constructive and narrow instead of reopening the destructive-replace path
- prefer one shared bind-or-create seam over scattering ad hoc viewport creation logic across shell hosts
- keep explicit preserve actions separate from ordinary switch-to-editor replacement

### Questions / Decisions

#### [x] Question 1 - When switching `Browser -> Spaghetti Editor`, should we reuse an existing unbound editor viewport or always create a new one?

##### Suggestion / Locked Answer
- reuse the same slot's retained editor only when that retained id still points to a live editor viewport that is not already visible elsewhere
- otherwise create a new editor viewport

##### Why
- this keeps replacement local to the slot instead of trying to fish an editor out of the wider workspace
- it still guarantees that the slot ends with a real bound editor surface instead of a blank shell

#### [x] Question 2 - What should count as a reusable unbound editor viewport?

##### Suggestion / Locked Answer
- a retained editor viewport id only counts as reusable when it still exists in `editorViewportsById`
- it also must not already be hosted in a visible slot, floating shell, or popout shell

##### Why
- Phase 2 needs one honest definition of `available to bind` so stale ids do not produce blank shells and visible editors are not stolen from another host path

#### [x] Question 3 - If multiple editors are already open, should switch-to-editor ever steal a visible editor viewport from another slot or floating shell?

##### Suggestion / Locked Answer
- no
- open a new editor viewport instead

##### Why
- stealing a visible editor from another host would create a new shell-truth bug while trying to fix the blank-shell bug

#### [x] Question 4 - Should a visible `Spaghetti Editor` shell ever be allowed to settle without a bound `editorViewportId`?

##### Suggestion / Locked Answer
- no
- blank editor shells should only exist as a transient internal state during the swap, never as the final rendered result

##### Why
- the user asked for an editor, not an empty shell
- this is the key invariant Phase 2 exists to restore

#### [x] Question 5 - Where should the bind-or-create logic live?

##### Suggestion / Locked Answer
- in one shared switch-to-editor helper seam used by the slot-replacement path
- not split across ad hoc `AppShell` and `SpaghettiWindowHost` fallback branches

##### Why
- constructive replace should be as centralized as destructive replace
- otherwise Phase 2 will fix one entry path and leave the others drifting

#### [x] Question 6 - What invariant should hold after `other surface -> Spaghetti Editor` replacement completes?

##### Suggestion / Locked Answer
- the slot now hosts `Spaghetti Editor`
- that slot has a real bound `editorViewportId`
- no existing visible editor surface was silently stolen from another host
- the user lands directly in a live editor instead of a blank shell

##### Why
- this gives Phase 2 a clear done-state and a concrete verification target

Likely files:
- `src/app/AppShell.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

Highest-signal seams:
- any slot replacement path that sets `surfaceKind = spaghettiEditor` without ensuring a live `surfaceInstanceId`
- any helper that decides whether to reuse an unbound editor viewport or create a new one
- the visible-editor-shell render path that still allows a blank unbound final state

Checklist:
- [x] Lock the exact switch-to-editor seam that currently leaves blank editor shells
- [x] Add one shared bind-or-create helper seam for switch-to-editor replacement
- [x] Reuse only a valid same-slot retained editor when one already exists
- [x] Create and bind a new editor viewport when no reusable retained editor exists
- [x] Add focused regressions for `Browser -> Spaghetti Editor` and `other surface -> Spaghetti Editor`

Verification:
- switching a `Browser` slot to `Spaghetti Editor` opens or binds a real editor viewport immediately
- the user never lands on a blank unbound `Spaghetti Editor` shell after intentionally switching a slot to editor
- if multiple editors are already open, switching another slot to `Spaghetti Editor` creates or binds the extra editor surface instead of stealing one and leaving a blank shell behind

## [x] Phase 3 - Final Replacement Confidence
### info
Purpose:
- verify the replacement rules are now consistent across split, slotted, floating, and popout-adjacent host paths

Current read:
- after Phase 1 and Phase 2, the remaining work should be confidence, residue capture, and honest closure rather than a new shell architecture pass
- this phase should be small unless live testing exposes one more real narrow replacement bug

Main work:
- run focused regressions for both replacement directions
- do a final manual confidence pass across split, slotted, floating, and popout-adjacent host paths
- document any intentionally deferred edge cases if one survives

Done shape:
- replacement semantics are predictable enough that later shell work can build on them without rediscovering slot-versus-editor binding confusion

Shipped read:
- the final manual confidence pass came back clean enough to close the follow-on without adding another residue implementation slice
- split-slot replace now feels honest in practice: leaving editor closes it by default, entering editor opens a live editor by default, and explicit preserve actions remain the only preserve-first path
- `Workspace 7.5-6` now stands as a completed shell-truth cleanup rather than an open-ended AppShell rewrite

### Questions / Decisions

#### [x] Question 1 - Which host paths must obey the same replace-versus-preserve rules before `Workspace 7.5-6` can close?

##### Suggestion / Locked Answer
- the main split-slot right-click `-` surface menu path
- ordinary slotted surface replacement through the shared workspace slot actions
- floating and popout-adjacent replacement paths wherever they route through the same surface-switch helpers
- any `Open Editors` or shell restore path that can indirectly rebind or preserve a `Spaghetti Editor`

##### Why
- Phase 3 is supposed to close the family honestly, not only prove one happy-path slot switch
- if one host path still preserves or strands editors differently, the shell truth is not really unified yet

#### [x] Question 2 - What counts as acceptable final manual confidence for `7.5-6`?

##### Suggestion / Locked Answer
- verify `Editor -> Browser` closes the outgoing editor without auto-floating
- verify `Browser -> Editor` or `other surface -> Editor` always lands in a live bound editor
- verify explicit preserve actions like `float`, `pop out`, and `duplicate` still preserve by design
- verify graph-rendered objects continue following Browser and build-policy truth even when editor surfaces close

##### Why
- this keeps Phase 3 grounded in the user-facing shell behaviors that originally exposed the bugs
- it also prevents the phase from drifting into abstract shell cleanup with no concrete close-out bar

#### [x] Question 3 - If one more bug appears during close-out, when does it still belong inside `Phase 3`?

##### Suggestion / Locked Answer
- keep it inside `Phase 3` only if it is one narrow residue bug in the same replacement/binding seam and the fix is small
- if the next issue widens into broader workspace-shell architecture, open a new future phase instead

##### Why
- Phase 3 should stay a confidence-and-closure slice, not become another hidden implementation ladder
- this protects `7.5-6` from growing the same way `7.5-5` eventually had to be split

#### [x] Question 4 - What should be explicitly deferred even if it is nearby?

##### Suggestion / Locked Answer
- any broader AppShell architecture cleanup
- any larger `Open Editors` UX redesign or launcher work
- any new editor-session or workspace-restore model beyond the replacement semantics already touched here

##### Why
- those are real future topics, but they are not required to prove the replace-versus-preserve truth cleanup is complete
- Phase 3 needs a clean stop line so the task can actually end

#### [x] Question 5 - What exact invariant must be true before `Workspace 7.5-6` is marked done?

##### Suggestion / Locked Answer
- intentional `Editor -> other surface` replacement is destructive by default
- intentional `other surface -> Editor` replacement is constructive by default
- only explicit preserve actions keep an editor alive outside its original slot
- visible editor shells and bound `editorViewportId` truth no longer drift across the main host paths

##### Why
- this turns the final close-out into one crisp rule set instead of a vague feeling that the shell is probably better now
- it also gives the doc and changelog a concrete end-state to point at when the phase closes

Checklist:
- [x] Re-run the focused automated coverage for destructive replace and constructive bind
- [x] Manually verify replace-versus-preserve behavior across the main slot-switch paths
- [x] Record any one final narrow residue fix if it is truly required
- [x] Spin any broader follow-on out into a new future phase instead of bloating `7.5-6`
- [x] Close this phase only when editor surface kind and bound editor viewport truth no longer drift during replacement

Verification:
- replacing a split `Spaghetti Editor` with `Browser` closes that editor and does not auto-float it
- switching a non-editor slot to `Spaghetti Editor` always binds a live editor viewport
- explicit preserve actions are still the only paths that keep an editor alive outside its original slot
- floating, popout, and slotted paths all respect the same replace-versus-preserve rules

### Acceptance And Done Shape

`Workspace 7.5-6` is done when:
- slot replacement semantics are honest and predictable
- `Editor -> other surface` is destructive by default
- `other surface -> Editor` is constructive by default
- explicit preserve actions are the only paths that keep an editor alive outside its original slot
- visible editor shells and bound editor viewport truth no longer drift apart during replacement
