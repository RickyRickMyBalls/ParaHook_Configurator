# Browser

## Doc Header

### Doc History
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

## [ ] Browser-4 - Row Click And Action Ownership Cleanup

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

#### [ ] q11 - What should a plain left-click on a Browser row do by default?

Question:
- should ordinary left-click primarily select the row, focus/open its target, or do both at once?

Suggestion:
- make plain left-click mean select first
- only focus/open when the row kind has a clear single target and that focus behavior is already expected
- avoid mixing selection, expansion, and action execution into one click

#### [ ] q12 - Which controls must own expand/collapse instead of row-click?

Question:
- should expand/collapse only belong to the tree chevron/branch control, or can row-click still collapse certain container rows?

Suggestion:
- keep expand/collapse on the explicit tree control only
- do not make ordinary row-click toggle open state
- this keeps row-click semantics stable across graph, content, reference, and sketch rows

#### [ ] q13 - Should double-click open/focus the row target where that concept exists?

Question:
- when a row has a meaningful target surface, should double-click be the stronger open/focus gesture while single-click remains selection-first?

Suggestion:
- yes
- use double-click as the stronger open/focus gesture for rows that have a real editor/view target
- keep single-click simpler so Browser rows do not feel overloaded

#### [ ] q14 - Which row actions should stay inline versus move fully to right-click/context menus?

Question:
- after removing the inline `...` buttons, which remaining actions should still stay visible inline, and which should only live in the right-click menu?

Suggestion:
- keep only the actions that have constant high-frequency value inline:
  - expand/collapse
  - visibility
  - build-policy icon
  - graph save if it remains a true always-visible quick action
- move lower-frequency row actions to the right-click menu

#### [ ] q15 - Should row click ever trigger build behavior directly?

Question:
- should selecting or focusing a Browser row ever dispatch build behavior, or should build remain explicit through policy/runtime and dedicated commands?

Suggestion:
- no
- row click should not trigger build behavior directly
- build should stay owned by runtime policy, explicit `Build`, or other dedicated commands rather than selection side effects

## [ ] Browser-5 - Selection And Focus Sync

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

## [ ] Browser-6 - BrowserPanel Structure And Row-Family Cleanup

### Purpose

Reduce the amount of Browser-specific behavior trapped in one large panel component and make row-family behavior easier to reason about and extend.

### Owns

- BrowserPanel structural cleanup
- row-shell versus row-behavior separation
- row-family consistency standards
- reducing inline special-case handling for every row kind

### Suggested Direction

- keep Browser row VM generation separate from Browser interaction behavior
- shrink special-case inline row handling where possible
- make graph/content/reference/sketch/viewport rows follow clearer shared rules before adding more Browser features
