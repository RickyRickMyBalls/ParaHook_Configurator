# Browser

## Doc Header

### Doc History
44. 2026-03-26 17:07: Locked the final Browser transform hierarchy in this umbrella doc so valid selected targets should expose `Transform` first and only expose `Move`, `Rotate`, and `Scale` one level deeper under that branch, while also recording the canonical staged reference breadcrumb example `Select > References > premadefoothooks > XL > Transform > Move`
43. 2026-03-26 16:58: Reframed the open Browser transform direction so `Browser-7.5` is now the real umbrella transform phase, with `7.3` and `7.4` treated as narrower transform sub-directions under that larger final-transform definition effort, and expanded the long-term Browser vision to explicitly include the later transform-history traversal and restore direction instead of leaving it only in the Browser-7 cleanup ladder
42. 2026-03-26 16:18: Expanded `Browser-7` again by adding a new `b7.4` follow-on entry for transform-history traversal and restore, explicitly separating history playback/scrub behavior from the narrower `b7.3` live-session and append-history foundation
41. 2026-03-26 16:15: Expanded `q28` under `Browser-7` so the explicit in-session option and assisted-prefill rules now apply to `Rotate` and `Scale` as well as `Move`, keeping `Vec3`, `X`, `Y`, `Z`, `XY`, `XZ`, and `YZ` as the first locked live transform option set across all three transform families
40. 2026-03-26 16:12: Locked `q28` under `Browser-7` to define the first explicit in-session `Move` options as `Vec3`, `X`, `Y`, `Z`, `XY`, `XZ`, and `YZ`, while also recording the assisted-prefill rule that `Vec3` is the default live autofill, choosing an axis/plane option clears that autofill for typed entry, and clearing typed input restores the assisted vec3 choice
39. 2026-03-26 16:00: Expanded `Browser-7` in this umbrella Browser doc by adding the first `b7.3` tracked entry plus locked `q23` through `q27`, keeping the transform follow-on reference-first, locking live-session Console behavior, commit return scope, app-store-owned append-on-commit history, and sketch-plane-style enriched history UI before later implementation
38. 2026-03-26 07:56: Marked `b7.1` under `Browser-7` shipped after landing the real viewport explicit-multi-select sync cleanup, so `Ctrl` multi-pick from the model viewport now flows through the same shared explicit-selection truth as Browser row multi-select, keeps grouped viewer highlight aligned with the shared resolved selection set, and leaves `b7.2` as the remaining open Browser-7 follow-on
37. 2026-03-25 22:17: Cleaned up the Browser architecture docs after shipping `Browser-6 - BrowserPanel Structure And Row-Family Cleanup` by moving its standalone phase record into `Browser/Shipped/`, rewriting this Browser umbrella doc to the post-Browser-6 state, and advancing the family so `Browser-7` is now the remaining open Browser follow-on
36. 2026-03-25 21:57: Refined the open `Browser-6` read in this Browser umbrella doc to match the live code and the tightened standalone phase spec, clarifying that the Browser already has extracted row-family, presenter, interaction, and menu seams and that the real remaining Browser-6 target is the heavier BrowserPanel model/controller and overlay-wiring cleanup still trapped inline
35. 2026-03-25 17:29: Added `Browser-7 - Browser Cleanup Follow-Ons` as the next small-cleanup Browser phase after Browser-6, created a dedicated Browser-7 tracking direction for narrower shipped follow-ons, and recorded the first two concrete entries for viewport-driven explicit multi-select sync and object-scope `Zoom` command expansion
34. 2026-03-25 16:20: Locked the remaining `Browser-6` structural questions in this Browser umbrella doc, deciding that shared selection, console routing, and reference batch loading must stay outside `BrowserPanel` ownership and that Browser-6 should preserve shipped Browser-5.x behavior by default while extracting seams, reducing duplication, and improving row-family organization
33. 2026-03-25 16:13: Locked `q2` under `Browser-6 - BrowserPanel Structure And Row-Family Cleanup`, deciding that Browser-6 should keep the shared row shell and click grammar centralized while moving content, reference, graph, and sketch row-family differences into narrower family-specific adapter seams instead of one giant central panel switch
32. 2026-03-25 16:09: Added a new long-term Browser vision block, locking the direction that folders and objects should eventually read as shared Browser primitives across references and generated content, with imported/reference origin shown through grey visual treatment while green/yellow bars continue to express generated/build/runtime state instead of making references and authored content stay permanently separate tree species
31. 2026-03-25 16:05: Locked `q1` under `Browser-6 - BrowserPanel Structure And Row-Family Cleanup`, deciding that the first Browser-6 pass should be a meaningful architecture cleanup rather than a cosmetic helper extraction, with `BrowserPanel` becoming a thinner host while row-vm derivation, interaction dispatch, and row-family rendering seams move outward
30. 2026-03-25 16:02: Added the first `Questions / Decisions` block under `Browser-6 - BrowserPanel Structure And Row-Family Cleanup`, tightening the next Browser cleanup phase around how far the panel split should go, where row-family behavior should live, what interaction logic should leave `BrowserPanel`, and how much Browser-5.x shipped behavior should be opportunistically refactored during the structural pass
29. 2026-03-25 15:56: Marked `Browser-5.3`, `Browser-5.4`, and `Browser-5.5` shipped after the selection-to-console, explicit multi-select, and reference batch-loading work landed, moved their standalone phase records into `Browser/Shipped/`, rewrote the Browser ladder to the post-5.5 state, and advanced the family so `Browser-6` is now the remaining open Browser cleanup follow-on
28. 2026-03-25 14:39: Created the standalone future `Browser-5.4 - Explicit Additive Multi-Select` phase doc under `Browser/Future/`, tightening the Browser selection ladder so the later `Ctrl+click` add/remove plus `Shift+click` range-selection pass now has its own implementation-ready planning surface between the shipped rooted-grouped selection work and the newer reference batch-loading follow-up
27. 2026-03-25 13:17: Added `Browser-5.5 - Reference Batch Load Queue And Aggregate Progress` to the Browser follow-up ladder, framing `Load All` reference behavior as a Browser-facing batch-loading and aggregate-progress phase owned across Browser, shared app state, and viewer reference execution rather than as a worker-first task
26. 2026-03-25 10:59: Locked the `Browser-5.3` console-context questions in this Browser umbrella doc, deciding that meaningful content/reference selection should push the Console into the nearest honest command scope, rooted grouped parent selection stays under one parent-owned `Select` scope, lightweight reference selection can enter its own lightweight reference scope without auto-starting transform, and empty-space deselect should clear selection-driven local Console context back to the nearest broader valid scope
25. 2026-03-25 10:23: Added `Browser-5.4 - Explicit Additive Multi-Select` to the Browser selection ladder, separating later `Ctrl+click` add/remove and `Shift+click` range-selection growth from the nearer `Browser-5.3` selection-to-console context work so command-scope sync and explicit multi-select no longer share one phase
24. 2026-03-25 10:20: Added the first `Questions / Decisions` block under `Browser-5.3 - Selection To Console Context For Content And References`, introducing concrete open questions plus suggestions around when selection should push console scope, how parent grouped content selection should map into one command root, how reference selection should behave before explicit transform commands, and whether empty-space deselect should also clear lightweight Browser-driven console context
23. 2026-03-25 10:16: Marked `Browser-5.2 - Implicit Parent Multi-Selection` shipped after the grouped parent-selection code landed, rewrote the old `Browser-5.2` follow-up block into a shipped-result summary, and advanced the Browser family so `Browser-5.3` plus `Browser-6` remain the next open Browser console-context and panel-structure follow-ons
22. 2026-03-25 10:06: Created the standalone future `Browser-5.2 - Implicit Parent Multi-Selection` phase doc under `Browser/Future/` and made it implementation-ready, translating the locked Browser-5.2 grouped-selection decisions into a concrete execution spec with one primary root target, a resolved descendant selection set, grouped viewport highlight rules, and the explicit boundary that later `Ctrl+click` plus `Shift+click` selection remains outside this phase
21. 2026-03-25 10:01: Updated the Browser-5.2 and Browser-5.3 follow-up notes to use the standard future row-selection click grammar, keeping ordinary click as single-select, switching additive toggle selection to `Ctrl+click`, and reserving `Shift+click` for a later anchor-to-range selection feature instead of using `Shift` for add/remove
20. 2026-03-25 09:58: Locked the remaining Browser-5.2 grouped-selection questions around immediate grouped viewport highlight plus unchanged Browser-5 deselect/replacement rules, and clarified the later explicit additive multi-select direction so current single-select stays intact while a future phase can use `Shift+click` to add or remove rows from the selection set
19. 2026-03-25 09:54: Locked the first two Browser-5.2 grouped-selection decisions in this Browser umbrella doc, deciding that selecting an `Assembly` or `Component` resolves a deterministic descendant selection set while still preserving one parent/root target as the primary selected thing for Browser, Console, and later transform ownership
18. 2026-03-25 09:51: Expanded the Browser-5 follow-up ladder by adding `Browser-5.3` for selection-to-console context integration after grouped selection lands, and added the first `Browser-5.2` `Questions / Decisions` block so the implicit parent multi-selection phase now has concrete selection-shape and highlight-behavior questions instead of only a short summary
17. 2026-03-25 09:44: Marked `Browser-5.1 - Reference Selection Cleanup` shipped after the reference-selection code landed, rewrote the old `Browser-5.1` follow-up block into a shipped-result summary, and advanced the Browser family so `Browser-5.2` plus `Browser-6` remain the next open Browser selection and structure follow-ons
16. 2026-03-25 03:18: Locked the final `Browser-5.1` visual-selection decision in this Browser umbrella doc and aligned the reference cleanup direction with the already-shipped object/component/assembly outline-glow style, so plain reference selection now clearly inherits the same lightweight selection look instead of implying a separate heavier reference-only treatment
15. 2026-03-25 03:15: Locked the first three `Browser-5.1` reference-selection decisions in this Browser umbrella doc, deciding that ordinary reference selection only highlights/selects, viewport-picked references should drive matching Browser-row selection when the mapping is clear, and empty-space click plus replacement click should handle ordinary reference deselect and replacement
14. 2026-03-25 03:08: Created the standalone future `Browser-5.1 - Reference Selection Cleanup` phase doc under `Browser/Future/`, so the next immediate post-`Browser-5` selection cleanup now has its own dedicated planning surface instead of living only as a follow-up note inside the umbrella Browser family index
13. 2026-03-25 02:58: Split the next Browser selection follow-up into `Browser-5.1 - Reference Selection Cleanup` and `Browser-5.2 - Implicit Parent Multi-Selection`, so the newer reference-selection cleanup work no longer shares one follow-up slot with the later grouped-selection growth
12. 2026-03-24 13:02: Expanded `Browser-Index.md` beyond build-policy planning by adding a broader Browser cleanup section plus a second mini-phase ladder for row interaction, selection/focus sync, and panel-structure cleanup, so the Browser family now reads as a fuller umbrella architecture surface instead of mostly one build-policy plan
11. 2026-03-24 12:57: Broke the monolithic Browser build-policy phase into a three-step subphase ladder, separating the Browser icon/fill-bar surface, inherited/effective policy truth, and real runtime build-policy execution so the UI, data model, and worker-behavior work no longer read like one oversized phase
10. 2026-03-24 12:52: Updated the remaining Browser-phase questions so `q4` now frames fill bars explicitly as runtime loading/status bars with a low yellow stale stub for dirty/manual rows, and added one new inheritance-display question about authored versus effective calc-policy when graph or parent rows cascade modes downward
9. 2026-03-24 12:49: Refined the first Browser-family phase to define the four policy modes in concrete ParaSlider terms, locking `live` as rebuild-during-drag, `release` as rebuild-on-release, `manual` as explicit-build-only, and `off` as no worker-produced geometry
8. 2026-03-24 12:46: Added the default-mode rule to the first Browser-family phase, locking the Browser/build-policy baseline so rows start in `live` and the default user experience is auto-rebuilding without requiring an explicit `Build` press for normal graph editing
7. 2026-03-24 12:41: Locked `q1`, `q2`, and `q3` in the first Browser-family phase, deciding that graph-title rows plus assembly/component/object rows are the first calc-policy scope, `off` uses a neutral gray disabled tone, and `off` means worker-produced geometry stops for that row instead of preserving old output like `manual`
6. 2026-03-24 12:39: Clarified the first Browser calc-policy scope so graph-title policy now explicitly cascades through everything below it, including assembly, component, and part/object rows, making the graph-level icon a real whole-graph mode control instead of just another isolated row toggle
5. 2026-03-24 12:38: Updated `q1` in the first Browser-family phase to include graph-title rows in the first shipped calc-policy scope, so the Browser planning now reflects the need for a top graph-level mode control where the user can set an entire graph like `Graph 1` to `live`, `release`, `manual`, or `off`
4. 2026-03-24 12:36: Added a dedicated `Questions / Decisions` section under the first Browser-family phase, using checklist-style open question headings plus short `Suggestion` blocks so the remaining policy-mode decisions can be tightened incrementally instead of staying implied in the phase summary
3. 2026-03-24 12:34: Tightened the first Browser-family phase to lock the `manual` versus `off` output rule, making `manual` preserve the last built geometry until the user explicitly builds again while `off` means the worker stops producing geometry for that row instead of acting like a hidden/manual variant
2. 2026-03-24 12:31: Added the first Browser-family phase at the bottom of this index, locking `live / release / manual / off` as the canonical Browser row calc-policy modes, separating them from the eyeball visibility control, and framing the first Browser phase around row-icon policy ownership instead of leaving that behavior implied across worker/build notes
1. 2026-03-24 12:26: Created this umbrella `Browser` family index and paired it with `Future/` and `Shipped/` folders so Browser-specific architecture and later phase docs have one canonical home under `docs/Human-Plans/Architecture/` instead of staying scattered across older Browser/content/build task docs and broader app-shell notes

### Purpose

This doc defines the architecture direction for the ParaHook `Browser`.

This file is the umbrella index for the `Browser` family.

Use it to answer:
- what the Browser should own
- what the Browser should not own
- where Browser-specific future and shipped docs should live
- how Browser planning should relate to AppShell, Worker, Console, and content/viewer truth

### Family Structure

Use this folder like this:

- `Browser-Index.md`
  - umbrella Browser architecture direction
  - live seam read
  - Browser-family summary
- `Future/`
  - standalone implementation-ready Browser phase docs
- `Shipped/`
  - later shipped Browser phase records

### Why This Doc Exists

ParaHook now has enough Browser-specific behavior that it should stop living only as scattered notes inside:
- older phase-task docs
- worker/build docs
- app-shell cleanup docs
- one-off browser-row fixes

The Browser needs its own family home because it is becoming a real product surface with its own concerns:
- row identity
- expand/collapse behavior
- visibility controls
- build-policy display
- graph/content/reference structure
- selection and focus handoff to the rest of the workspace

### Scope

This doc covers:
- Browser structure and ownership
- Browser row behavior
- Browser interaction rules
- Browser alignment with build/runtime truth

This doc does not cover:
- full worker internals
- viewer rendering internals
- console architecture
- app-shell window/dock hosting except where Browser placement affects Browser behavior

## Doc Body

### Short Version

The Browser is a truth-reading workspace surface.

It should:
- present project structure clearly
- expose row-level actions and visibility cleanly
- reflect build/runtime state honestly
- hand selection and focus into the right workspace surface

It should not:
- become the hidden owner of worker semantics
- invent a second build model in local UI state forever
- overload row clicks with too many unrelated actions

### Initial Direction

The Browser family should eventually own planning for:
- row families and row identity
- icon, fill-bar, and visibility control semantics
- Browser-to-viewer selection/focus behavior
- Browser build-policy display and control semantics
- Browser graph/content/reference/sketch subtree behavior
- Browser row action and click ownership
- Browser structure and panel cleanup where the Browser surface has become too overloaded

### Long-Term Vision

Long-term, the Browser should move toward one more unified tree model built from shared container and target primitives:

- folders are folders
- objects are objects
- assemblies and components remain real structured content containers
- imported/reference-backed things should not need to stay a forever-separate Browser species if they are functionally just folders or objects with a different origin

Direction:
- a reference folder like `Footpads` or `Shoes` should eventually behave like a real folder the user can:
  - rename
  - reorganize
  - add sibling folders beside
  - later move into other containers such as an assembly when that broader content move model exists
- a reference item should eventually behave like a real object with imported origin, not like a permanently special non-object tree entry
- imported/reference-backed rows should communicate their origin visually through the Browser treatment:
  - darker/grey reference-origin styling shows the thing was imported
  - green/yellow runtime bars continue to show generated/build/runtime state

This means the long-term Browser should distinguish:
- what the thing is:
  - folder
  - object
  - assembly
  - component
- from where the thing came from:
  - imported / reference-backed
  - generated / authored
  - later mixed or derived if needed

Hard direction:
- do not lock the Browser forever into two fully separate worlds where references and generated content can never converge
- let the nearer Browser families still use practical row-family seams today
- but keep the architecture open so imported folders/objects can later participate in the same broader content tree and move/reorganization model

Transform direction:
- the Browser should also grow toward one honest transform model across selected Browser targets instead of leaving transform forever split into unrelated reference-only and authored-object-only paths
- the long-term transform vision should include:
  - one clear Browser-owned command entry into transform for valid selected targets
  - a staged hierarchy where the selected target exposes `Transform` first
  - `Move`, `Rotate`, and `Scale` one level deeper under that `Transform` branch
  - target-honest transform session ownership by target kind
  - shared Console transform grammar where practical
  - target-local transform history
  - later history traversal, preview, and restore behavior
- this later traversal and restore layer is the `7.4` direction:
  - move backward and forward through committed transform history
  - preview earlier committed states
  - explicitly restore/apply a chosen state without forcing that larger model into the first history-foundation pass

### Current Placeholder Phase Direction

Likely first Browser-family phase topics:
- canonical Browser row/action ownership cleanup
- Browser build-policy icon semantics
- Browser truth versus worker/build truth
- Browser visibility versus calc/build-policy separation

### Broader Browser Cleanup

Build policy is only one part of the Browser cleanup.

The Browser family also needs to cover:

- row click ownership
  - selection
  - focus/open
  - build requests
  - expand/collapse
- Browser-to-viewer selection sync
- Browser-to-graph focus sync
- row-family consistency across:
  - graph rows
  - content rows
  - sketch rows
  - reference rows
  - viewport rows
- BrowserPanel structure cleanup where too many row kinds and behaviors are still handled inline in one surface

### Browser Cleanup Phase Ladder

The Browser family likely needs two parallel mini-ladders:

- build-policy ladder
  - `Browser-1`
  - `Browser-2`
  - `Browser-3`
- general Browser cleanup ladder
  - `Browser-4`
  - `Browser-5`
  - `Browser-6`
  - `Browser-7`

## Browser Build Policy Phase Ladder

### Why This Needs More Than One Phase

This work crosses three different layers:

- Browser UI surface
- canonical policy ownership and inheritance
- real build/runtime execution behavior

Trying to ship all of that as one Browser phase would make the first cut too muddy.

The safer split is:
- `Browser-1`
  - Browser icon/fill-bar surface
- `Browser-2`
  - cascade and effective-mode truth
- `Browser-3`
  - actual runtime build-policy behavior

## [x] Browser-1 - Build Policy Icon Surface

### Purpose

Restore an explicit Browser-side calc-policy control on the left row icon so the user can tell, at a glance, how a Browser row participates in build/calc behavior.

### Owns

- the first canonical Browser row policy modes:
  - `live`
  - `release`
  - `manual`
  - `off`
- left-icon color semantics for those modes
- the separation between calc/build policy and viewer visibility
- fill-bar language as runtime/loading status
- the first rule for which Browser rows expose policy cycling

### Does Not Own

- full worker/runtime policy execution
- final graph/node inheritance rules
- final Browser row redesign
- final build scheduling semantics during every interaction path

### Locked Direction

The Browser should use two separate controls:

- eyeball:
  - viewer visibility only
  - show/hide in the viewport
- left row icon background:
  - calc/build policy only
  - cycle the row between `live`, `release`, `manual`, and `off`

Hard rule:
- `off` must not mean hidden
- `off` means do not run the heavy calc/build participation for that row
- hiding remains the job of the eyeball only
- `manual` keeps the last built geometry visible until the user explicitly builds again
- `off` means the worker stops producing geometry for that row

### First UI Direction

The first visual pass should use the row icon background itself as the policy signal:

- `live`
  - green
- `release`
  - blue
- `manual`
  - yellow
- `off`
  - neutral gray disabled tone

The row icon letter itself should stay the same:
- `A`
- `C`
- `O`
- later graph-title row letters or other row-family letters that need policy control

The fill bar should act like a runtime/loading bar:
- `done`
  - full green bar
- `building`
  - animated blue/cyan bar
- `dirty / rebuild`
  - mostly empty bar with a small yellow left stub around `5%`

### First Surface Scope

The safest first scope is:
- graph-title rows
- `assembly`
- `component`
- `object`

Graph-title policy should cascade through everything below that graph:
- `assembly`
- `component`
- `object` / part rows

Later Browser phases can decide whether:
- whether `sketch`
- graph rows
- reference rows
- or node rows
should also expose calc-policy cycling

### Questions / Decisions

#### [x] q1 - Which Browser row families should expose calc-policy cycling in the first shipped cut?

Question:
- should phase 1 stay limited to `assembly`, `component`, and `object`, or should graph-title rows and other graph-owned rows also get the same icon-mode control immediately?

Suggestion:
- include graph-title rows in the first shipped scope so the user can set a whole graph like `Graph 1` to `live`, `release`, `manual`, or `off`
- graph-title policy should cascade through everything under that graph:
  - `assembly`
  - `component`
  - `object` / part rows
- still defer lower-priority Browser families like `sketch` and references until the first calc-policy behavior is stable

Decision:
- lock the first shipped scope to:
  - graph-title rows
  - `assembly`
  - `component`
  - `object` / part rows

#### [x] q2 - What exact color should `off` use?

Question:
- should `off` read as neutral gray, dark disabled, or a more warning-like muted red?

Suggestion:
- use a dark neutral disabled tone first
- avoid making `off` look like an error state

Decision:
- `off` uses a neutral gray disabled tone
- do not style `off` like an error state

#### [x] q4 - How should dirty/stale state appear for `manual` rows?

Question:
- if `manual` keeps the last built geometry, how should the Browser show that the row is now stale and waiting for explicit rebuild?

Suggestion:
- keep the policy color on the icon
- treat the fill bar as a runtime/loading-status bar, not a policy bar
- recommended runtime bar language:
  - `done` = full green bar
  - `building` = animated blue/cyan bar
  - `dirty / rebuild` = mostly empty bar with a small yellow left stub around `5%`
- this lets `manual` rows stay yellow on the icon while still showing stale state in the bar without bringing back status text

Decision:
- lock the fill bar as runtime/loading status, not policy
- `manual` rows keep their yellow policy icon
- stale / dirty state shows through the bar as a mostly empty row with a small yellow left stub

## [x] Browser-2 - Cascade And Effective Policy Truth

### Purpose

Make graph-title and parent-row build-policy settings behave like real inherited product truth instead of isolated per-row UI toggles.

### Owns

- graph-title cascade rules
- parent-to-child effective mode behavior
- authored-versus-effective mode read
- canonical app/runtime ownership of policy state instead of forever-local Browser state

### Does Not Own

- final worker scheduling behavior
- final viewer/output retention semantics beyond the already-locked `manual` versus `off` distinction

### Locked Direction

This phase should stop treating Browser build policy as a forever-local presentational trick.

The long-term owner must become canonical app/runtime truth so:
- Browser icons
- worker/build dispatch
- console build narration
- row dirty/build state
all read the same policy meaning

#### [x] q5 - Should parent calc-policy override children in phase 1?

Question:
- if an `assembly` is switched to `off` or `manual`, should that effective policy dominate child `component` and `object` rows immediately?

Suggestion:
- use parent-effective override for runtime behavior in the first cut
- keep the deeper authored-versus-effective inheritance model as a later cleanup decision if needed

Decision:
- parent policy applies as the default effective behavior for inheriting children
- explicitly independent children can still override that parent policy
- nearest effective policy wins

#### [x] q6 - When policy cascades from a graph or parent row, should child rows show authored mode, effective mode, or both?

Question:
- if a graph-title row or parent content row forces children into `live`, `release`, `manual`, or `off`, should the child icon display its own authored mode, the inherited effective mode, or some combination?

Suggestion:
- show the effective mode first in phase 1 so the Browser matches actual runtime behavior
- if authored-versus-effective distinction becomes important later, add a secondary visual hint instead of weakening the first-pass read

Decision:
- child rows show effective mode first
- authored-versus-effective distinction is communicated secondarily through inherited/independent treatment and tooltip text
- do not weaken the first-pass read by trying to show both equally

## [x] Browser-3 - Runtime Build Policy Execution

### Purpose

Make the real build/runtime path obey the Browser policy modes instead of leaving them as mostly Browser-side meaning.

### Owns

- real `live / release / manual / off` execution behavior
- default `live` auto-rebuild baseline
- model-parameter rebuild-during-edit versus rebuild-on-release behavior
- `manual` explicit-build-only behavior
- `off` stopping worker-produced geometry for that row

### Locked Direction

Default rule:
- the default Browser/build-policy baseline should be `live`
- normal graph editing should auto-rebuild by default
- the user should not need to press `Build` in the normal baseline flow

Vision rule:
- `ParaSlider` in this Browser/build-policy family means model parameters
- it does not only mean literal slider widgets
- the same runtime policy should apply to any authored model-parameter edit that changes downstream geometry:
  - slider drag
  - typed parameter change
  - sketch geometry edit
  - sketch dimension edit
  - gizmo-driven authored parameter change
  - other future parametric graph edits

Mode meanings:
- `live`
  - auto-rebuild as the user changes values live
  - for model-parameter editing, rebuild while the authored parameter is actively changing
  - if a sketch drives an extrusion, editing that sketch should update the downstream 3D result live under `live`
- `release`
  - defer work until interaction release / commit
  - for model-parameter editing, rebuild when the current continuous interaction ends or commits
- `manual`
  - mark dirty and wait for explicit build
  - only build when the user explicitly presses `Build`
  - keep the last accepted built result until the user requests a new build
- `off`
  - do not run `replicad` / worker math for that row
  - treat the row as calc-disabled
  - stop producing geometry for that row

### Questions / Decisions

#### [x] q7 - What is the first real runtime build target for Browser-3?

Question:
- should Browser-3 first drive runtime execution at the whole `graph-document` level, the lower `component / object` level, or both at once?

Suggestion:
- start with graph-document rebuild execution as the first honest runtime target
- let `assembly`, `component`, and `object` continue to own Browser policy truth and dirty read, but avoid widening the first Browser-3 dispatch cut until the real execution seam is stable
- expand to deeper per-row execution only after the graph-level runtime path is behaving correctly

Decision:
- lock the first Browser-3 runtime execution target to `graph-document`
- this is acceptable because current graphs mostly behave like one produced component in practice
- keep `assembly`, `component`, and `object` as Browser policy and dirty-truth rows for now
- widen runtime execution below graph only after multi-component graph behavior becomes real

#### [x] q8 - Can an explicit independent child keep building when its parent is `off`?

Question:
- if a parent row is set to `off`, should a child that was explicitly made independent still be allowed to run `live`, `release`, or `manual` behavior?

Suggestion:
- yes
- if independence is real, the nearest authored effective policy should win for runtime too
- otherwise `Make Independent` becomes visually real but runtime-fake

Decision:
- yes
- an explicitly independent child can keep building even when its parent is `off`
- nearest authored effective policy must win for runtime too

#### [x] q9 - What exactly should count as a `release` boundary?

Question:
- if `ParaSlider` really means model parameters, which authored interaction endings should dispatch the deferred rebuild for `release` mode?

Suggestion:
- treat `ParaSlider` as product language for model parameters, not just visible slider controls
- `release` should mean:
  - the end of a continuous authored interaction
- first `release` boundaries:
  - slider pointer-up
  - typed model-parameter commit
  - sketch point / sketch entity drag end
  - sketch dimension commit
  - gizmo drag end for authored graph changes
  - numeric commit / enter
  - text-field commit / blur
  - graph edit commit where the user has clearly finished the current interaction
- important rule:
  - if editing a sketch should update a downstream extrusion live, sketch editing must participate in the same policy-aware authored-edit pipeline as slider changes and typed parameter edits
- discrete one-shot edits should still build on commit under `live` / `release`, while `release` mainly matters for interactions that have `start -> update -> end`

Decision:
- lock `ParaSlider` in this Browser/build-policy family as product language for model parameters
- lock `release` as the end of a continuous authored interaction
- include sketch edits, typed parameter commits, and other downstream parametric model edits in the same policy-aware authored-edit pipeline

#### [x] q10 - What should explicit `Build` mean for mixed `live / release / manual / off` rows?

Question:
- when the user invokes `Build`, should that primarily mean “build dirty manual rows,” should it skip `off` rows, and should `live / release` already be considered current by normal runtime behavior?

Suggestion:
- `Build` should primarily be meaningful for dirty `manual` rows
- `live` and `release` should normally already keep themselves current through automatic runtime behavior
- `Build` should continue to skip `off` rows
- keep scope honest:
  - graph build = build eligible dirty `manual` targets in that graph
  - targeted row build = build eligible dirty `manual` targets in that row scope
- do not let explicit `Build` silently bypass `off`
- if the product later needs a cross-mode retry path for `live` / `release`, add that as a separate later command such as `Force Rebuild`, not by weakening the meaning of normal `Build`

Decision:
- normal `Build` is primarily for dirty `manual` rows
- `live` and `release` should normally already be current
- `off` remains excluded from normal `Build`
- any later retry path for `live` / `release` should be a separate concept such as `Force Rebuild`

#### [x] q3 - Should `off` immediately remove already-built geometry from the viewer, or only stop future worker output?

Question:
- when a row switches to `off`, should the current accepted geometry disappear immediately, or should `off` only block future worker-produced output until the next build pass?

Suggestion:
- treat `off` as stopping worker-produced geometry for that row
- if the product needs a softer mode that preserves old geometry while disabling recalculation, keep that as a separate later decision instead of weakening `off`

Decision:
- lock `off` as the stronger mode where worker-produced geometry stops for that row
- keep `manual` as the softer mode that preserves the last built result until explicit rebuild

### Suggested Next Standalone Docs

If this Browser ladder grows beyond the umbrella summary, create:

- `Browser_Phase 1 - Build Policy Icon Surface.md`
- `Browser_Phase 2 - Cascade And Effective Policy Truth.md`
- `Browser_Phase 3 - Runtime Build Policy Execution.md`

## [x] Browser-4 - Row Click And Action Ownership Cleanup

### Purpose

Make Browser row interactions more predictable by separating selection, focus/open, expand/collapse, visibility toggles, policy cycling, and row actions more cleanly.

### Owns

- row click semantics
- double-click semantics
- quick-action ownership
- expand/collapse ownership
- reducing overloaded row-click behavior

### Does Not Own

- build-policy mode design
- final worker execution semantics
- deep BrowserPanel decomposition

### Suggested Direction

- row click should primarily mean select/focus
- explicit controls should own:
  - expand/collapse
  - visibility
  - policy cycling
  - overflow actions
- avoid triggering hidden build behavior from ordinary selection clicks where possible

### Questions / Decisions

#### [x] q11 - What should a plain left-click on a Browser row do by default?

Question:
- should ordinary left-click primarily select the row, focus/open its target, or do both at once?

Suggestion:
- make plain left-click mean select first
- only focus/open when the row kind has a clear single target and that focus behavior is already expected
- avoid mixing selection, expansion, and action execution into one click

Decision:
- Browser row click is family-consistent by target domain, not globally identical across every row kind
- `Content` rows use single-click as selection-first against the actual scene/content object
- this keeps content-row selection compatible with the later viewer-side `Transform` flow where the user can move the Three.js solid without forcing a full `replicad` rebuild
- `Graph Documents` rows use single-click as graph-context select/focus rather than scene-object selection
- ordinary row click must not trigger rebuild behavior directly

#### [x] q12 - Which controls must own expand/collapse instead of row-click?

Question:
- should expand/collapse only belong to the tree chevron/branch control, or can row-click still collapse certain container rows?

Suggestion:
- keep expand/collapse on the explicit tree control only
- do not make ordinary row-click toggle open state
- this keeps row-click semantics stable across graph, content, reference, and sketch rows
- use the left branch control as the only expand/collapse owner for normal tree rows
- let section headers keep their own explicit collapse affordance where the section shell already owns it

Decision:
- expand/collapse is owned by the explicit branch control for normal tree rows
- ordinary row click does not toggle open state
- section headers may keep their own dedicated collapse affordance because they are section shells rather than ordinary tree rows

#### [x] q13 - Should double-click open/focus the row target where that concept exists?

Question:
- when a row has a meaningful target surface, should double-click be the stronger open/focus gesture while single-click remains selection-first?

Suggestion:
- yes
- use double-click as the stronger open/focus gesture for rows that have a real editor/view target
- keep single-click simpler so Browser rows do not feel overloaded

Decision:
- yes
- double-click is the stronger open/focus gesture where a row has a clear target surface or target context
- keep single-click simpler and selection-first
- do not force a fake double-click meaning onto row families that do not have a clear stronger target action

#### [x] q14 - Which row actions should stay inline versus move fully to right-click/context menus?

Question:
- after removing the inline `...` buttons, which remaining actions should still stay visible inline, and which should only live in the right-click menu?

Suggestion:
- keep only the actions that have constant high-frequency value inline:
  - expand/collapse
  - visibility
  - build-policy icon
- move lower-frequency row actions to the right-click menu

Decision:
- Browser rows should converge on one shared inline row template:
  - branch control (`+` / `-` / leaf)
  - row/type icon slot that also carries build-policy color where supported
  - visibility slot
  - main loading-bar label surface
- keep those slots visually aligned across row families even when a given row uses a passive/disabled placeholder instead of an active control
- remove the legacy graph save quick button from the row surface
- keep export/save-style graph actions in the right-click menu instead of spending a permanent inline slot on them
- move lower-frequency row actions to the right-click menu

#### [x] q16 - Should every Browser row use the same fixed slot template even when some controls are passive?

Question:
- should all Browser rows reserve the same left-to-right structure so future row families stay aligned, even if some rows only show passive placeholders for unsupported controls?

Suggestion:
- yes
- use one shared row template so future row types do not invent new geometry
- let unsupported controls become passive placeholders rather than changing the row layout
- this should be one of the main Browser-4 cleanup goals before more row families are added

Decision:
- yes
- Browser rows should converge on one fixed slot template even when some controls are passive
- unsupported controls use subtle passive placeholders rather than changing row geometry
- section headers may keep their own section-shell layout, but ordinary Browser rows should stop inventing new per-family layouts

#### [x] q15 - Should row click ever trigger build behavior directly?

Question:
- should selecting or focusing a Browser row ever dispatch build behavior, or should build remain explicit through policy/runtime and dedicated commands?

Suggestion:
- no
- row click should not trigger build behavior directly
- build should stay owned by runtime policy, explicit `Build`, or other dedicated commands rather than selection side effects

Decision:
- no
- row click never directly triggers build behavior
- build stays owned by runtime policy, explicit `Build`, or later dedicated commands such as `Force Rebuild`
- selection and focus clicks should remain side-effect light

## [x] Browser-5 - Selection And Focus Sync

### Purpose

Make Browser selection, viewer selection, console context, and graph/editor focus behave like one coherent system instead of loosely related updates.

### Owns

- Browser-to-viewer target sync
- Browser-to-graph/editor focus sync
- selected-row truth
- selected-target consistency across workspace surfaces

### Suggested Direction

- Browser selection should reliably map to one workspace target
- viewer highlight, graph focus, and console context should read that same target truth where appropriate
- avoid one row kind focusing a graph while another only selects locally unless that difference is explicit and intentional

### Shipped Result

- Browser/content selection now writes through shared workspace target truth instead of staying Browser-local
- viewer part/reference picks now flow back into Browser selection when a clean matching row exists
- empty viewport click now clears lightweight content/model selection
- empty Browser click now clears Browser row selection
- Browser no longer holds stale local row selection after the viewer becomes the active surface with no selected target

### Early Foundation Already Landed

- `Content` row selection now already drives real workspace-target selection for:
  - `Assembly`
  - `Component`
  - `Object`
- Browser content selection now also drives a first-pass model-viewport glow/highlight lane for the matching output geometry
- current highlight direction is intentionally narrow:
  - glow/emissive only
  - no fill-style highlight
  - no size change / scale-up
- later viewer-selection settings can still expand this into user-controlled styles such as:
  - glow tuning
  - fill/highlight modes
  - other viewport selection presentation options

### Questions / Decisions

#### [x] q17 - Should Browser row selection always set shared workspace target truth, or are there row kinds that should stay local-only?

Question:
- when the user selects a Browser row, should that always update the shared workspace target, or should some rows still only select inside the Browser without changing cross-surface truth?

Suggestion:
- target-bearing Browser rows should update shared workspace target truth
- `Content` rows should be real model-selection targets:
  - `Assembly` selection should target the whole assembly subtree
  - `Component` selection should target that component subtree
  - `Object` selection should target that object
- that content-row selection already has a first-pass shipped viewer result:
  - selecting those rows now causes the matching model output to glow in the viewport
- this gives the Browser the right future base for viewer-side transform/manipulation without forcing rebuild
- `Graph Documents` target-bearing rows should also set shared target truth, but as authoring-context selection instead of model-selection
- only structural/container rows with no real authored or viewer target should remain mostly local

Decision:
- target-bearing Browser rows update shared workspace target truth
- `Content` rows are real model-selection targets:
  - `Assembly` targets the whole assembly subtree
  - `Component` targets that component subtree
  - `Object` targets that object
- `Graph Documents` target-bearing rows also set shared target truth, but as authoring-context selection rather than model-selection
- only structural/container rows with no real authored or viewer target remain mostly local

#### [x] q18 - What is the exact difference between Browser `selection` and Browser `focus`?

Question:
- should single-click selection and stronger open/focus actions continue to be different, and if so what should each one own across Browser, Viewer, Graph, and Console?

Suggestion:
- keep `selection` as the lightweight shared-target act
- keep `focus` as the stronger surface-routing act
- selection should highlight or identify the target
- focus should bring the owning authoring/editor surface forward when that makes sense
- deselection should also stay in the lightweight selection lane:
  - clicking empty Browser / viewport space clears selection
  - `Esc` can act as a backup clear only when a tool/session is not actively using selection

Decision:
- keep `selection` as the lightweight shared-target act
- keep `focus` as the stronger surface-routing act
- selection highlights or identifies the target without necessarily stealing editor focus
- focus/open brings the owning authoring/editor surface forward when that row family has a real stronger target action
- deselection belongs to the lightweight selection lane, not the stronger focus/open lane

#### [x] q19 - When the user selects something in the Viewer, should the Browser always follow and select the matching row?

Question:
- if the viewer selection changes to an object/part/reference that has a Browser row, should the Browser always mirror that selection?

Suggestion:
- yes for stable target-bearing rows that the Browser can represent honestly
- Browser should follow viewer target selection when a clear matching row exists
- avoid partial fake sync for row families that do not yet have a clean one-to-one Browser target

Decision:
- yes
- Viewer selection should mirror into Browser selection when a clear matching Browser row exists
- follow the Fusion-style direction where Browser and viewport selection stay visually in sync for real target-bearing rows
- avoid inventing fake Browser follow behavior for row families that still do not have a clean target mapping

#### [x] q20 - When should Browser selection trigger Console context sync?

Question:
- should every Browser row selection request console context sync, or only the rows that materially change command context?

Suggestion:
- every meaningful Browser row family should eventually expose a real console context
- sync the console to the nearest valid command scope for the selected row target
- current concrete priority remains:
  - `Graph Documents`
  - graph nodes
  - sketches
- content rows should also grow into real command contexts later, for example:
  - `Move`
  - `Rotate`
  - `Scale`
  - `Material`
  - `Export`
  - later CAD-oriented commands such as `Shell`, `Explode To Faces`, or boolean-related operations
- until a row family has a real command layer, do not fake a noisy no-op context; route only to the nearest valid layer that actually exists

Decision:
- yes
- Browser selection should eventually trigger console context sync for every meaningful row family
- the console should move to the nearest valid command scope for the selected target
- current graph/sketch authoring rows remain the first concrete command-context families
- content rows are expected to gain their own command contexts later for object/assembly actions such as move, rotate, scale, material, export, and future CAD operations
- do not fabricate fake context for row families that do not yet have a real command layer

#### [x] q21 - What should happen when Browser target selection and active graph/editor focus disagree?

Question:
- if the selected Browser row belongs to one graph but the active editor or focused graph is another, which truth should win first?

Suggestion:
- shared target selection should update immediately
- editor/graph focus should only follow when the row family owns a real focus/open action
- do not make every selection forcibly steal editor focus if the user only meant to inspect or highlight

Decision:
- single-selecting a different Browser item always re-targets the workspace selection immediately
- Browser selection, viewport highlight, and other lightweight target-follow surfaces should move to that new selected target right away
- editor/graph focus stealing remains row-family dependent:
  - authoring-context rows may move the active graph/editor focus when that family owns focus/open behavior
  - content rows do not automatically yank the user into a different graph editor just because the selected object belongs to another graph
- keep target refocus immediate, but keep stronger editor-focus routing intentional rather than automatic everywhere

#### [x] q22 - How should the user deselect Browser / content selections?

Question:
- when the user wants to clear a Browser-driven content or viewport selection, should deselect happen through empty-space click, `Esc`, explicit commands, or some combination?

Suggestion:
- follow the lighter Fusion-style pattern:
  - clicking empty model viewport space clears the current lightweight selection
  - clicking empty Browser space clears the current Browser row selection
  - selecting a different target replaces the old selection unless later multi-select is active
  - `Esc` acts as a backup clear only when an active tool/command session is not already using `Esc` for cancel/exit semantics
- keep deselect separate from build/runtime behavior and separate from stronger focus/open actions

Decision:
- use empty-space click as the primary deselect path:
  - empty model viewport click clears the current lightweight model/content selection
  - empty Browser click clears the current Browser row selection
- selecting a different target replaces the old selection unless a later multi-select mode is active
- `Esc` is a backup clear only when no active tool/command session owns it for cancel/exit behavior

### [x] Browser-5.1 - Reference Selection Cleanup

- `Browser-5.1` is now shipped
- this cleanup landed the reference-selection parity work that Browser-5 intentionally left as the next immediate follow-up

Shipped result:
- selecting a reference only highlights/selects it
- ordinary reference selection does not start `Move` and does not enter transform mode
- viewport-picked references select the matching Browser row whenever one clear matching row exists
- empty viewport click clears lightweight reference selection
- empty Browser click clears Browser row selection
- selecting a different reference replaces the old one unless a later multi-select mode is active
- `Esc` remains a backup clear only when no stronger tool/session already owns it
- reference selection now uses the same outline/glow treatment already used for selected objects/components/assemblies
- plain reference selection still avoids fill or size-change styling
- reference rows now also distinguish `dormant` versus `active` loaded state more honestly, with loaded references and their parent rows staying visually darker while unloaded rows remain lighter

### [x] Browser-5.2 - Implicit Parent Multi-Selection

- `Browser-5.2` is now shipped
- this cleanup landed the grouped parent-selection layer that Browser-5 intentionally left as the next content-selection follow-up

Shipped result:
- selecting an `Assembly` keeps one assembly root target while resolving its selectable descendants into one grouped content-selection set
- selecting a `Component` keeps one component root target while resolving its selectable descendants into one grouped content-selection set
- selecting an `Object` resolves to just that object
- the viewport now highlights the whole resolved grouped content-selection set immediately
- the Browser now keeps the parent/root row as the stronger selected row while descendant rows in the grouped set also get a softer grouped-selection highlight
- grouped parent selection still keeps the Browser-5 deselect/replacement baseline unchanged
- ordinary click still remains single-select
- later explicit additive multi-select still remains separate:
  - `Ctrl+click` add/remove row selection
  - `Shift+click` anchor-to-range selection
  - marquee/lasso
  - mixed manual selection sets

### Questions / Decisions

#### [x] q1 - What exactly should parent content selection resolve to?

Question:
- when the user selects an `Assembly` or `Component` row, what is the actual selected set the workspace should resolve behind that one row click?

Suggestion:
- treat parent selection as implicit grouped selection of the selectable descendant content rows it owns
- `Assembly` should resolve to all selectable descendants under that assembly
- `Component` should resolve to all selectable descendants under that component
- `Object` should still resolve to just that object
- keep this selection set deterministic and tree-driven instead of inventing partial or view-dependent grouping

Decision:
- treat parent selection as implicit grouped selection of the selectable descendant content rows it owns
- selecting an `Assembly` resolves to all selectable descendants under that assembly
- selecting a `Component` resolves to all selectable descendants under that component
- selecting an `Object` still resolves to just that object
- keep the resolved set deterministic and tree-driven so later move/rotate/scale can apply to the whole subtree from one root selection

#### [x] q2 - Should the parent row remain the primary selected target even when it resolves to a descendant set?

Question:
- if selecting an `Assembly` resolves to many descendants, should the shared workspace still remember the parent as the primary selected target, or should it collapse entirely into only the descendant objects?

Suggestion:
- keep both concepts:
  - parent row remains the primary selected target for Browser, Console, and future transform ownership
  - resolved descendants become the implicit grouped selection set used for viewport highlight and later transform operations
- this keeps parent intent visible without losing the real underlying selected geometry set

Decision:
- yes
- keep one parent/root as the primary selected target for Browser, Console, and later transform ownership
- keep the resolved descendants as the implicit grouped selection set used for viewport highlight and later transform operations
- this preserves one clear root target while still letting parent move/rotate/scale apply to all selected children

#### [x] q3 - How should viewport highlight behave for implicit grouped parent selection?

Question:
- when a parent row is selected and the system resolves multiple descendants, should the viewport highlight all of them immediately, and how strong should that grouped highlight be?

Suggestion:
- yes, highlight all resolved descendants immediately
- keep the first grouped-selection visual language lightweight:
  - same outline/glow family already used for object/reference selection
  - no fill
  - no size change
- avoid inventing a second heavier grouped-selection style in the same phase

Decision:
- yes
- highlight all resolved descendants immediately when the parent row is selected
- keep the grouped-selection visual language lightweight:
  - same outline/glow family already used for object/reference selection
  - no fill
  - no size change
- do not invent a second heavier grouped-selection style in the same phase

#### [x] q4 - How should deselect and replacement behave when the current selection is an implicit grouped parent selection?

Question:
- once a parent row selection has resolved to many descendants, what should happen when the user clicks a different row or clicks empty space?

Suggestion:
- keep the Browser-5 deselect baseline unchanged:
  - selecting a different target replaces the whole grouped selection
  - empty viewport click clears the grouped selection
  - empty Browser click clears the Browser row selection
  - `Esc` remains only a backup clear when no stronger tool/session owns it

Decision:
- keep the Browser-5 deselect baseline unchanged
- selecting a different target replaces the whole grouped selection
- empty viewport click clears the grouped selection
- empty Browser click clears the Browser row selection
- `Esc` remains only a backup clear when no stronger tool/session owns it

### [x] Browser-5.3 - Selection To Console Context For Content And References

- `Browser-5.3` is now shipped
- this cleanup landed the shared content/reference selection-to-console routing layer that Browser-5.2 intentionally left as the next follow-on

Shipped result:
- selecting an `Assembly`, `Component`, or `Object` now moves the Console into the matching `Select > ...` content scope without auto-starting transform
- rooted grouped parent content selection keeps the parent/root as the Console command owner while grouped descendants remain the execution set behind that root
- selecting `References`, a reference category, or a reference item now moves the Console into the matching lightweight reference scope with honest `Load All` or `Load Model` entry actions
- Browser row selection and viewer-picked selection now resolve through the same shared workspace-to-console seam for the same selected target
- empty-space deselect now clears lightweight selection-driven content/reference scope back to the nearest broader valid scope instead of leaving stale local Browser-driven context behind

### [x] Browser-5.4 - Explicit Additive Multi-Select

- `Browser-5.4` is now shipped
- this cleanup landed the explicit additive multi-select layer that Browser-5.3 intentionally left as the next selection-growth follow-on

Shipped result:
- ordinary click still replaces selection, `Ctrl+click` now toggles content/reference roots into or out of the explicit set, and `Shift+click` now builds a same-section visible range from the current anchor
- shared workspace selection now keeps one canonical primary target plus `explicitSelectedTargets` and `selectionAnchorTarget`
- removing the current primary target now promotes the most recently remaining explicit target so the shared model still keeps one stable primary target whenever the set still contains rows
- parent content targets still contribute their rooted grouped descendant payload inside explicit sets, so effective content selection becomes the union of each selected rooted payload instead of flattening parents into anonymous child-only rows
- explicit mixed multi-selection now routes the Console into synthetic `Select > Multi Select`, while collapsing back to one explicit target returns to the ordinary single-target `Select > ...` scope

### [x] Browser-5.5 - Reference Batch Load Queue And Aggregate Progress

- `Browser-5.5` is now shipped
- this cleanup landed the shared reference batch queue and aggregate-progress layer that the earlier reference loading work intentionally left as the next follow-on

Shipped result:
- root and category `Load All` actions now start one shared `referenceLoadBatch` session instead of relying on broad visible-list load discovery
- references now load sequentially in deterministic order, with later items waiting until the active item resolves
- the `References` root row and participating category rows now derive their bars from aggregate batch truth instead of replaying per-item `0 -> 100` progress
- item rows still keep their local `unloaded / loading / loaded / error` state while the root/category bars represent whole-batch progress
- Browser and Console `Load All` entrypoints now dispatch into the same shared batch-start seam, and the Console now prints both per-item loaded confirmations and one final completion line when the batch finishes

## [x] Browser-6 - BrowserPanel Structure And Row-Family Cleanup

- `Browser-6` is now shipped
- this cleanup landed the second-stage BrowserPanel structural split that the earlier Browser row-family, presenter, interaction, and menu extractions intentionally left as the next host/controller follow-on

Shipped result:
- `BrowserPanel.tsx` now reads as a thinner host/shell instead of the main mixed Browser controller
- the new `useBrowserPanelController.ts` seam now owns the heavier BrowserPanel-wide store reads, derived tree composition, menu state/lifecycle, controller closures, and Browser-scoped transcript helper wiring that previously lived inline
- the existing Browser seams remain canonical:
  - row derivation
  - row-family capability mapping
  - row interaction dispatch
  - row-shell and section rendering
  - row-action execution
  - context-menu item building
- shared Browser-5.3 / 5.4 / 5.5 ownership stayed outside `BrowserPanel`:
  - shared selection truth
  - shared console-context routing
  - shared reference batch-load ownership
  - shared workspace/view command-owner seams
- Browser behavior stayed materially the same while the structure became much easier to extend without regrowing one oversized panel file

## [ ] Browser-7 - Browser Cleanup Follow-Ons

### Purpose

Track the next small Browser cleanup entries after Browser-6 without forcing each one to become its own standalone structural phase.

### Owns

- smaller Browser cleanup follow-ons after Browser-6
- Browser/viewer/console sync cleanup that is narrower than another large panel-structure pass
- command-surface and selection-sync gaps discovered while using the shipped Browser-6 structure

### Suggested Direction

- use Browser-7 as the next accumulating cleanup bucket for small real Browser behavior changes
- keep each item narrow, concrete, and implementation-facing
- log landed Browser-7 work normally in `docs/CHANGELOG.md`, but keep the planning/tracking list here and in the standalone Browser-7 phase doc

### Initial Tracked Entries

- `b7.1`
  - shipped
  - viewport explicit multi-select now syncs back into Browser multi-select through the shared explicit-selection seam
  - grouped viewer highlight and Console multi-select context now stay aligned with the viewport-created explicit object set
- `b7.2`
  - every object should expose the `Zoom` command family
  - object command surfaces should include `Zoom` and its child options consistently with the shared Console zoom grammar
- `b7.3`
  - reference-first transform-session and history foundation
  - selected-reference `Move`, `Rotate`, and `Scale` should become one honest live transform session with target-local cumulative history
  - keep this as the narrow reference-first foundation under the broader transform direction, and use the standalone phase doc for the implementation-ready spec:
    - `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-7.3 - Reference Transform Session History.md`
- `b7.4`
  - later transform-history traversal and restore direction
  - transform history should support user traversal back and forth through committed entries without forcing that bigger playback/restore model into the first history-foundation pass
  - likely first cut:
    - row selection or cursor-based history traversal
    - previewing earlier committed snapshots
    - explicit restore/apply behavior from a chosen history state
  - keep history playback, restore semantics, and any later branching behavior separate from the narrower session-and-history-foundation work
- `b7.5`
  - Browser transform should become its own real umbrella phase
  - use `7.5` to define the final transform direction across Browser-selected targets first, then break actual implementation into narrower subphases
  - final hierarchy direction:
    - selected target scope exposes `Transform`
    - `Transform` exposes `Move`, `Rotate`, and `Scale`
    - canonical staged example:
      - `Select > References > premadefoothooks > XL > Transform > Move`
  - expected execution ladder under the umbrella:
    - `Transform 1`
      - reference-first live transform session and append-on-commit history foundation
    - `Transform 2`
      - canonical transform hierarchy, target-scope shortcut adapters, and non-reference target ownership
    - `Transform 3`
      - shared target-local transform shell and post-commit return behavior
    - `Transform 4`
      - viewport move/scale/rotate history visuals, traversal / preview / restore, and later cleanup
  - this is the phase that should answer:
    - what the final transform target model is
    - how object-owned versus reference-owned transform paths should relate
    - what shared Console grammar should be reused
    - what toolbar ownership should look like across target kinds
    - how target-local history and later traversal/restore should fit together
  - standalone phase doc:
    - `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-7.5 - Final Transform Direction And Phase Split.md`

### Questions / Decisions

#### [x] q23 - Should Browser-7.3 stay reference-first, or widen into objects and assemblies immediately?

Question:
- should the next transform/session-history follow-on try to cover selected references plus authored objects and assemblies in one patch, or should it tighten the already-existing reference transform flow first?

Suggestion:
- keep `b7.3` reference-first
- build on the already-shipped selected-reference transform surface instead of expanding phase scope into authored-content transform ownership at the same time
- shape the history/session model so later object and assembly follow-ons can reuse it without redesign

Decision:
- keep `b7.3` reference-first
- do not widen the first pass into authored object, assembly, folder, or multi-select transform ownership
- use this phase to tighten the already-existing selected-reference transform flow first
- shape the history/session model so later object and assembly follow-ons can reuse it without redesign

#### [x] q24 - While `Move`, `Rotate`, or `Scale` is active, should the Console stay at the generic selected-reference menu or enter the live transform session?

Question:
- after the user chooses `Move`, `Rotate`, or `Scale` from selected reference scope, should the Console keep rendering the ordinary `Choose next [Move, Rotate, Scale, Zoom, Back]` menu, or should it switch into the active transform session itself?

Suggestion:
- enter the live transform session
- do not keep the parent selected-reference menu on screen while transform is active
- make the active Console path honest in the same compact transform style already proven by sketch-plane transform:
  - `<Reference Label> > M > Vec3 [...]`
  - `<Reference Label> > R > Vec3 [...]`
  - `<Reference Label> > S > Vec3 [...]`

Decision:
- enter the live transform session
- do not keep the generic selected-reference menu on screen while transform is active
- make the active Console path honest in the compact transform style already used by sketch-plane transform:
  - `<Reference Label> > M > Vec3 [...]`
  - `<Reference Label> > R > Vec3 [...]`
  - `<Reference Label> > S > Vec3 [...]`

#### [x] q25 - After `CommitTransform` or `Enter`, should Console return to a persistent transform root or to the normal selected-reference scope?

Question:
- once a live reference transform is committed, should Console stay inside a dedicated post-commit transform root, or should it exit the live session and return to the ordinary selected-reference scope?

Suggestion:
- `CommitTransform` and `Enter` should both finalize the active live transform
- after commit, return to the normal selected-reference scope for that same highlighted target
- do not add a persistent post-commit transform root in the first pass

Decision:
- `CommitTransform` and `Enter` both finalize the active live transform
- after commit, return to the normal selected-reference scope for that same highlighted target
- do not add a persistent post-commit transform root in the first pass

#### [x] q26 - Where should reference transform history live, and when should it append?

Question:
- should transform-history ownership stay in the viewer because the viewer executes the live drag, or should the app/store own history and append only at explicit commit points?

Suggestion:
- keep live transform execution viewer-owned
- keep history app/store-owned in `useAppStore`, keyed by `referenceId`
- append one entry only on real commit:
  - viewport drag release
  - `Enter`
  - `CommitTransform`
- never append during live drag preview

Decision:
- keep live transform execution viewer-owned
- keep transform history app/store-owned in `useAppStore`, keyed by `referenceId`
- append one entry only on real commit:
  - viewport drag release
  - `Enter`
  - `CommitTransform`
- never append during live drag preview

#### [x] q27 - What should the first reference transform-history UI and merge model be?

Question:
- should reference transform history invent a new UI/merge rule, or should it follow the sketch-plane history model and enrich it for `Move`, `Rotate`, and `Scale`?

Suggestion:
- follow the sketch-plane history idea
- add a collapsible `Transform History` section to the reference transform toolbar
- show:
  - `Origin`
  - one row per committed transform entry
  - `Lock/Unlock` per row
  - `Merge History`
- store absolute committed snapshots, then derive display deltas from the previous committed entry
- merge should preserve:
  - the last row
  - locked rows
  - while collapsing earlier unlocked rows

#### [x] q28 - What exact in-session options should `Move`, `Rotate`, and `Scale` expose, and how should the default vec3 assist behave?

Question:
- once the user enters live `Move`, `Rotate`, or `Scale`, should Console only show a passive vec3 path, or should it expose explicit in-session transform options and assisted typed-entry behavior?

Suggestion:
- all three live transform families should expose the same first explicit in-session options:
  - `Vec3`
  - `X`
  - `Y`
  - `Z`
  - `XY`
  - `XZ`
  - `YZ`
- `Vec3` should be the default assisted/autofill option using the current live transform value
- while that assisted vec3 option is active, the user can still commit by viewport click or `Enter`
- if the user chooses an axis or plane option like `X`, delete the active vec3 autofill and let typed entry own the input
- if the user clears the typed input back to empty, restore the default assisted vec3 option

Decision:
- inside live `Move`, `Rotate`, and `Scale`, Console exposes:
  - `Vec3`
  - `X`
  - `Y`
  - `Z`
  - `XY`
  - `XZ`
  - `YZ`
- `Vec3` is the default assisted/autofill option using the current live transform value
- while `Vec3` is active, the user may still commit by viewport click or `Enter`
- choosing an axis or plane option like `X` removes the active vec3 autofill and gives typed entry control of the input
- if the user clears the typed input back to empty, restore the default assisted vec3 option

Decision:
- follow the sketch-plane history idea and enrich it for `Move`, `Rotate`, and `Scale`
- add a collapsible `Transform History` section to the reference transform toolbar
- show:
  - `Origin`
  - one row per committed transform entry
  - `Lock/Unlock` per row
  - `Merge History`
- store absolute committed snapshots and derive display deltas from the previous committed entry
- merge should preserve:
  - the last row
  - locked rows
  - while collapsing earlier unlocked rows
