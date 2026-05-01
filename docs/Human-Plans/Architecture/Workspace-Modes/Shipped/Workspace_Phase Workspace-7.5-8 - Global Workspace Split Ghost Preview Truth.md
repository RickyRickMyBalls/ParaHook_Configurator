# Workspace Phase Workspace-7.5-8 - Global Workspace Split Ghost Preview Truth

## Doc Header

### Doc History
1. 2026-04-30 20:14:30: Closed `Workspace 7.5-8` as shipped after changelog entries `[881]` through `[890]` confirmed the shared local/global split commands, shared ghost-preview contract, floating Console command and preview adoption, and follow-up console drag-out polish had landed; prepared this record to move from `Future/` to `Shipped/`.
1. 2026-04-02 10:57: Recorded the continuous console drag-out handoff follow-up after the remaining repeat repro was narrowed to a drag-ownership seam, noting that `AppShell.tsx` now owns the full slotted-console-to-floating transition drag until pointer-up so a console dragged out of split view keeps following the cursor, keeps the shared split ghost alive, and no longer visibly drops into the model viewport before release even on the second `float -> split right -> drag out again` pass
1. 2026-04-02 10:21: Recorded the second-drag titlebar clamp follow-up after the repeat console repro was narrowed further, noting that `ConsoleDock.tsx` now clamps floating console drag against the primary viewport body instead of the full shell so a re-floated console cannot slip under the model viewport titlebar and lose its draggable header during the repeat drag-out path
1. 2026-04-02 10:02: Recorded the final console re-float size truth after the repeat drag-out follow-up was re-tested, noting that `AppShell.tsx` should preserve the stored compact floating console size when a re-docked console is dragged back out instead of adapting to the hosted split viewport size so the repeated `float -> split right -> drag out again` path returns to the same smaller default float-window shape users get on first float
1. 2026-04-02 09:56: Recorded the last floating-console follow-up after the main `Phase 6` ship, noting that `AppShell.tsx` now reseeds console drag-out from the live redocked slot size instead of the older parked floating size so the repeat `float -> split right -> drag out again` template path keeps following the pointer smoothly instead of slipping back into the stale handoff behavior
1. 2026-04-02 09:48: Recorded the follow-up floating-console drag-out polish after the main `Phase 6` ship, noting that `AppShell.tsx` now pre-seeds console's floating rect during the slotted header drag handoff so the split `Console top / Model Viewport bottom` template case no longer visibly snaps through the old parked floating position before the live floating drag continues
1. 2026-04-02 09:34: Marked `Phase 6 - Floating Console Shared Ghost Preview Adoption` complete after wiring floating console drag through the shared `workspaceSplitPreview` resolver inside `ConsoleDock.tsx`, rendering the same scope-aware split ghost overlay used by the other floating surfaces, and verifying through focused `ConsoleDock` plus `AppShell` coverage that floating console drag now predicts and commits the same directional split truth as the shipped four-way floating menu
1. 2026-04-02 09:12: Locked the open `Phase 6 - Floating Console Shared Ghost Preview Adoption` assumptions and tightened that phase into an implementation-ready drag-preview slice, recording that floating console should use the exact same edge thresholds, local/global ghost bounds, and directional drop truth as Browser while keeping left-dock snap work explicitly out of scope and treating the shipped four-way floating console menu as the source-of-truth behavior the drag ghost must visually predict
1. 2026-04-02 09:09: Tightened the shipped `Phase 5 - Floating Console Shared Split Command Adoption` outcome so floating console now mirrors Browser's floating titlebar menu language with the same four directional split commands instead of the temporary right-only local/global pair, keeping the command adoption aligned to the existing floating-window UX while preserving the shared helper routing underneath
1. 2026-04-02 09:00: Marked `Phase 5 - Floating Console Shared Split Command Adoption` complete after wiring floating console into the shared floating-titlebar split menu, routing right-side local/global console splits through the existing shared workspace split helpers, and proving in focused `ConsoleDock` plus `AppShell` coverage that floating console now adopts the same command language as Browser and `Spaghetti Editor` without pulling drag-preview work forward from `Phase 6`
1. 2026-04-02 08:37: Tightened `Phase 5 - Floating Console Shared Split Command Adoption` into an implementation-ready execution slice after confirming the current command seams, locking that floating console already reuses shared float/popout actions through `ConsoleDock.tsx`, that shared console split support already exists inside `workspaceSurfaceActions.ts`, and that the missing work is mainly command exposure rather than split-engine invention so the next slice can stay command-only ahead of the later drag-preview adoption
1. 2026-04-02 08:31: Marked `Phase 4 - Floating Console Split Adoption Research` complete after the console ownership trace finished, recording that floating console is self-hosted inside `ConsoleDock.tsx`, that `ConsolePanel.tsx` only forwards header pointer-down, that `workspaceSurfaceActions.ts` already carries reusable console float/popout plus split-helper support, and that `AppShell.tsx` only owns the slotted-console header drag seed so `Phase 5` can start from the real command-adoption seams
1. 2026-04-02 08:28: Tightened `Phase 4 - Floating Console Split Adoption Research` into an implementation-ready research slice after tracing the current console ownership seams, locking that floating console does not have a separate host like Browser or `Spaghetti Editor`, that `ConsoleDock.tsx` owns floating drag directly while `ConsolePanel.tsx` only forwards header pointer-down, that `workspaceSurfaceActions.ts` already carries console float/popout and split-helper support, and that `AppShell.tsx` only seeds slotted-console header drags so the next console adoption work can target the real files instead of searching for a non-existent `ConsoleDockHost`
1. 2026-04-02 08:22: Extended the `7.5-8` ladder with new follow-on console-adoption phases after the shared Browser plus Spaghetti ghost-preview contract stabilized, keeping floating `Console` inside the same phase family by adding `Phase 4 - Floating Console Split Adoption Research`, `Phase 5 - Floating Console Shared Split Command Adoption`, and `Phase 6 - Floating Console Shared Ghost Preview Adoption` instead of starting a separate doc family
1. 2026-04-02 08:16: Marked `Phase 2 - Implement Global Split Ghost Preview Cleanup` shipped after the shared preview contract landed in code, recording that Browser and `Spaghetti Editor` now both resolve drag ghosts through the new shared `workspaceSplitPreview` helper, that Browser test coverage now uses the normalized `local` versus `global` preview scopes instead of the older `pane-local` versus `whole-browser` names, and that focused host tests plus a full build verified the corrected outer-edge `global` and next-inward `local` contract
1. 2026-04-02 08:03: Tightened `Phase 2 - Implement Global Split Ghost Preview Cleanup` into an implementation-ready execution slice after tracing Browser's current drag-preview engine, locking the next work around flipping the shared outer-band versus inner-band mapping to match the newly agreed `global` then `local` trigger contract, reusing Browser's existing preview owner as the first shared shell seam, and treating `Spaghetti Editor` as the first new adopter of that corrected global preview system rather than as a one-off drag implementation
1. 2026-04-02 08:00: Marked `Phase 1 - Lock Global Split Ghost Ownership And Truth` shipped after the first implementation slice landed, recording that `Spaghetti Editor` floating titlebar split commands now expose explicit `Split Right Locally` versus `Split Right Globally` actions through the shared `workspaceSurfaceActions` helpers and that focused `AppShell` coverage now proves those two commands diverge correctly in the `Console top / Model Viewport bottom` layout
1. 2026-04-02 07:47: Tightened `Phase 1 - Lock Global Split Ghost Ownership And Truth` into a fully implementation-ready planning slice now that the four-side local-versus-global split contract is locked, adding the exact first code slice, the highest-signal shell and action seams, and the concrete verification target that `Spaghetti Editor` should adopt Browser’s shared local/global split language through `workspaceSurfaceActions` without changing the semantics again during implementation
1. 2026-04-02 07:45: Updated this phase doc after chat fully clarified the local-versus-global split model, locking the reusable rule that all four sides support both scopes, that the outer edge band is the `global` split trigger, that the next inward band is the `local` split trigger, that `local` always splits only the hovered leaf pane, and that `global` always splits the workspace root so `7.5-8` now has a concrete preview and command contract instead of a vague right-split-only idea
1. 2026-04-02 07:36: Tightened `Phase 1 - Lock Global Split Ghost Ownership And Truth` into an implementation-ready planning slice after tracing the existing Browser-versus-Spaghetti split helpers, locking the shared owner and meaning of `Split Right Locally` versus `Split Right Globally`, promoting `workspaceSurfaceActions` as the canonical action seam, and adding the highest-signal files plus implementation cut that should make `Spaghetti Editor` the first adopter without turning `7.5-8` into a spaghetti-only command clone
1. 2026-04-02 07:30: Updated this phase doc after tracing the current Browser-versus-Spaghetti split action seams, locking the next `7.5-8` framing around shared workspace split-command ownership as well as shared ghost-preview ownership so the phase now explicitly treats `Split Right Locally` versus `Split Right Globally` as reusable workspace-surface commands that `Spaghetti Editor` should adopt first through the existing `workspaceSurfaceActions` helpers rather than by copying Browser-only host logic
1. 2026-04-02 07:30: Added this future phase doc after `Workspace 7.5-7` stabilized enough to move on, locking the next cleanup around the global AppShell or workspace split-ghost system rather than writing more spaghetti-only drag-preview logic so `Spaghetti Editor` can serve as the first validation surface for a broader shell-owned split preview contract that should later work for Browser, Console, and future toolbar-like surfaces too

### Purpose

Use this phase to make split ghost previews an honest global workspace-shell affordance instead of a collection of surface-specific drag hints.

The goal is:
- one clear global split-ghost contract owned by the workspace shell
- one honest preview that matches the real drop result
- one reusable preview system that `Spaghetti Editor` can validate first without turning the feature into spaghetti-only code
- one shared local-versus-global split command template that `Spaghetti Editor` can adopt first without copying Browser-only host behavior

### Scope

This phase covers:
- AppShell or workspace-slot ghost preview ownership
- split ghost positioning, sizing, and target truth
- drag or dock preview behavior for slotted and floating surfaces entering the split system
- shared workspace split-command semantics such as local split versus global split
- using `Spaghetti Editor` as the first validation surface for the shared ghost-preview contract

This phase does not cover:
- `Spaghetti Editor` presentation mode cleanup, which belongs in `Workspace 7.5-9`
- popout repair, which belongs in `Workspace 7.5-10`
- split-versus-floating visual parity polish, which belongs in `Workspace 7.5-11`
- broader console architecture cleanup
- one-off spaghetti-only drag hacks that bypass the shared workspace shell

## Doc Body

### Summary

`Workspace 7.5-8` is the split ghost preview cleanup follow-on inside the larger `Workspace 7.5` cleanup ladder.

It exists because the split ghost preview should be owned by the workspace shell, not by one special surface:
- the ghost is part of the global AppShell or workspace split language
- `Spaghetti Editor` is simply the first surface where the mismatch is obvious enough to fix
- future surfaces like Browser, Console, and toolbar-like panels should be able to use the same ghost-preview rules

It also exists because the split commands themselves are already partly shared in `workspaceSurfaceActions`, but they are not exposed consistently:
- Browser already benefits from both local slot-split and root/global split commands
- `Spaghetti Editor` still exposes only a narrower subset of those commands
- the next cleanup should therefore clarify and reuse the command template instead of re-implementing Browser behavior inside spaghetti-only host code

So the main framing for `7.5-8` is:
- global workspace split-ghost truth first
- shared workspace split-command truth alongside it
- `Spaghetti Editor` validation second

### Locked Direction

`Workspace 7.5-8` should be:
- a global workspace ghost-preview cleanup
- an AppShell or workspace-slot interaction cleanup
- a reusable split-preview contract that later surfaces can inherit

`Workspace 7.5-8` should not be:
- spaghetti-only drag-preview logic
- a visual-polish-only pass
- a hidden AppShell rewrite bucket
- a replacement for the later presentation, popout, or visual-parity tasks

### Current Read

Current likely mismatch:
- split ghost preview behavior is still easier to observe through `Spaghetti Editor`, but the real ownership should live higher in the workspace shell
- if we fix ghost preview only inside spaghetti-specific code, we will likely have to re-solve the same problem later for Browser, Console, and future toolbar-like surfaces
- Browser already has a broader split-action set through the shared `workspaceSurfaceActions` helpers:
  - `splitWorkspaceSurfaceToSide(...)`
  - `commitWorkspaceSurfaceSlotSplit(...)`
  - `commitWorkspaceSurfaceRootSplit(...)`
- `Spaghetti Editor` currently uses only the narrower `splitWorkspaceSurfaceToSide(...)` path in the highest-signal host seams
- the next cleanup should therefore identify both:
  - the shared split-ghost owner
  - the shared split-command truth for `local` versus `global` split before any surface-specific polish
- the local-versus-global distinction is now clearer:
  - all four sides support both scopes
  - the outer edge band is the `global` trigger
  - the next inward band is the `local` trigger
  - `local` always splits only the hovered leaf pane
  - `global` always splits the workspace root

Desired invariant:
- a drag toward a split target produces one ghost preview that belongs to the workspace shell
- the ghost preview matches the eventual split result
- local versus global split commands are shared workspace-surface commands, not Browser-only affordances
- the same preview rules can be reused by future dockable or splittable surfaces
- the same side means the same result shape in both scopes:
  - `local top/right/bottom/left` splits the hovered pane on that side
  - `global top/right/bottom/left` splits the workspace root on that side

### Likely Files

- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.test.tsx`

### Phase Sections

## [x] Phase 1 - Lock Global Split Ghost Ownership And Truth
### info
Purpose:
- define who owns split ghost preview and what the preview is supposed to mean before implementation starts

Current read:
- the ghost preview is currently being felt through `Spaghetti Editor`, but the right long-term owner is the workspace shell
- if the preview contract stays surface-specific, later surfaces will likely drift or duplicate logic

Main work:
- lock where split ghost preview should live in the shell
- lock where local-versus-global split commands should live
- lock what target truth the ghost is allowed to represent
- lock the rule that the preview must match the real drop result
- lock how `Split Right Locally` and `Split Right Globally` should differ
- define the first validation flow around `Spaghetti Editor`

Done shape:
- the doc answers who owns split ghost preview
- the doc answers what surfaces should reuse the same ghost rules
- the doc answers where `local` versus `global` split commands should live and what they mean
- the next implementation slice can clean up the real shell seam instead of adding spaghetti-specific exceptions

### Questions / Decisions

#### [x] Question 1 - Who should own split ghost preview behavior?

##### Suggestion
- the workspace shell or AppShell split system should own it
- not `Spaghetti Editor` itself

##### Why
- split ghost preview is a layout affordance, not a content-surface behavior
- future surfaces should inherit the same system instead of re-implementing it

#### [x] Question 2 - What should the split ghost preview represent?

##### Suggestion
- the exact target split result the user will get if they drop now

##### Why
- the preview should be honest and should not suggest a different layout than the final drop outcome

#### [x] Question 3 - Which surfaces should this contract eventually support?

##### Suggestion
- `Spaghetti Editor` first
- then Browser, Console, and future toolbar-like or dockable workspace surfaces that use the same split-entry path

##### Why
- `Spaghetti Editor` is the first validation surface, but the contract should stay reusable

#### [x] Question 4 - Where should local-versus-global split commands live?

##### Suggestion
- in the shared workspace-surface action layer
- not inside Browser-only or Spaghetti-only host logic
- treat `workspaceSurfaceActions` as the canonical action seam unless the code trace later proves that seam is missing required state

##### Why
- the underlying helpers already exist in `workspaceSurfaceActions`
- future surfaces should be able to adopt the same commands without cloning Browser behavior

#### [x] Question 5 - What should `Split Right Locally` mean?

##### Suggestion
- split inside the current local viewport-slot context
- use the shared slot-targeted command path, likely `commitWorkspaceSurfaceSlotSplit(...)`
- for `Spaghetti Editor`, this means splitting within the current model viewport region instead of across the entire workspace root
- the trigger should come from the inner band just inside the outer global band
- this rule should work the same on all four sides, not only the right side

##### Why
- this matches the current mental model of splitting within the current model viewport region instead of across the whole workspace root

#### [x] Question 6 - What should `Split Right Globally` mean?

##### Suggestion
- split across the root workspace layout rather than only inside the current local slot tree
- use the shared root-targeted command path, likely `commitWorkspaceSurfaceRootSplit(...)`
- for `Spaghetti Editor`, this should mirror the broader Browser-style split that can cross the full current workspace layout instead of only the current local slot context
- the trigger should come from the outermost edge band at the workspace boundary
- this rule should work the same on all four sides, not only the right side

##### Why
- Browser already exposes this broader split language, and `Spaghetti Editor` should be able to adopt the same workspace-level affordance

#### [x] Question 7 - Should the local-versus-global distinction work only on the right side?

##### Suggestion
- no
- all four sides should support both `local` and `global`

##### Why
- the split language should stay symmetric and predictable
- the user should not have to learn a special-case rule where only the right side supports both scopes

#### [x] Question 8 - How should the trigger bands be defined?

##### Suggestion
- outer edge band = `global`
- next inward band = `local`
- examples already clarified in chat:
  - right edge:
    - `0px -> 14px` from the workspace edge = `global right`
    - `14px -> 28px` from the hovered pane edge = `local right`
  - the same idea should generalize to top, left, and bottom

##### Why
- this gives one consistent preview grammar the user can learn
- it also keeps the two scopes visually and spatially distinct

#### [x] Question 9 - What exact result scope should each preview imply?

##### Suggestion
- `local`
  - ghost is clipped to the hovered leaf pane
  - dropping restructures only that pane
- `global`
  - ghost spans the full workspace layout bounds
  - dropping restructures the workspace root

##### Why
- this makes the preview honest and directly predictive of the real layout result

#### [x] Question 10 - What should the first execution slice validate?

##### Suggestion
- make `Spaghetti Editor` support the same local-versus-global right-split command set Browser already has
- do that by routing through the shared workspace action helpers, not by cloning Browser host code

##### Why
- that proves the shared command template is real while keeping the first adopter concrete enough to test

#### [x] Question 11 - What should stay out of scope for this first ghost-preview phase?

##### Suggestion
- deep visual polish
- presentation-mode cleanup
- popout repair
- split-versus-float stylistic parity

##### Why
- the first job is honest global preview truth, not later polish layers

Checklist:
- [x] Lock global split-ghost ownership at the AppShell or workspace level
- [x] Lock that the ghost must match the real drop result
- [x] Lock local-versus-global split commands as shared workspace actions
- [x] Lock the meaning of `Split Right Locally` versus `Split Right Globally`
- [x] Lock that all four sides support both scopes
- [x] Lock the outer-band/global and inner-band/local trigger rule
- [x] Lock the preview/result scope difference between `local` and `global`
- [x] Lock that `Spaghetti Editor` is the first validation surface, not the only target
- [x] Lock the future-surface reuse direction
- [x] Lock the out-of-scope boundaries for later `7.5.x` tasks
- [x] Ship the first floating `Spaghetti Editor` adopter slice for `Split Right Locally`
- [x] Ship the first floating `Spaghetti Editor` adopter slice for `Split Right Globally`
- [x] Prove that `local right` keeps a `Console top / Model Viewport bottom` root layout intact while only splitting the model pane
- [x] Prove that `global right` creates a new workspace-root right column in the same `Console top / Model Viewport bottom` layout

Likely files:
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

Highest-signal seams:
- Browser’s existing local-versus-global split command exposure in `BrowserDockHost`
- the shared action helpers in `workspaceSurfaceActions`
- the current Spaghetti floating or slotted split entry path in `SpaghettiWindowHost`
- any ghost-preview state or preview-target resolution that still assumes Browser-only command ownership

Implementation cut:
1. Trace Browser’s current split command exposure and map which actions are already shared versus still host-specific.
2. Confirm `workspaceSurfaceActions` is the canonical seam for:
   - local slot split
   - root/global split
3. Define the first `Spaghetti Editor` adoption target as:
   - `Split Right Locally`
   - `Split Right Globally`
4. Generalize the same rule set across top, right, bottom, and left:
   - outer band = global
   - next inward band = local
5. Keep the first implementation slice focused on command truth plus preview truth, not later visual polish.

Verification:
- the doc now locks one clear owner for split ghost preview
- the doc now locks one clear shared owner for local-versus-global split commands
- the doc now locks one clear 4-side trigger model for `local` versus `global`
- the next implementation slice can target `workspaceSurfaceActions` and the Browser-versus-Spaghetti host seams directly instead of reopening the semantics question
- the first shipped implementation slice now exposes explicit `Split Right Locally` and `Split Right Globally` actions in the floating `Spaghetti Editor` split menu
- the shared root split helper now accepts `Spaghetti Editor` as a first adopter
- focused `AppShell` coverage now proves the two right-side commands produce different layout results in the same workspace

First implementation slice:
1. Reuse the shared workspace action helpers instead of adding new spaghetti-only split commands:
   - `commitWorkspaceSurfaceSlotSplit(...)` for `local`
   - `commitWorkspaceSurfaceRootSplit(...)` for `global`
2. Expose those two commands first for `Spaghetti Editor` in the highest-signal host/menu seam.
3. Keep Browser behavior unchanged while making the command language visibly shared.
4. Defer deeper ghost geometry polish until after command truth is working for the first adopter.

Implementation-ready defaults:
- first adopter: `Spaghetti Editor`
- first side to validate in code: `right`
- preserve the newly locked rule that later top/left/bottom support must follow the same outer/global and inner/local model
- do not widen the first slice into presentation-mode cleanup, popout repair, or visual styling work

Highest-signal implementation seams:
- `src/app/workspace/workspaceSurfaceActions.ts`
  - canonical local/global split command behavior
- `src/app/hosts/BrowserDockHost.tsx`
  - reference implementation for current Browser command exposure
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - first adoption target for `Spaghetti Editor`
- `src/app/AppShell.tsx`
  - any shared split menu or shared preview ownership that must stop assuming Browser-only command access
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

Implementation cut:
1. Trace how Browser currently exposes `local` versus `global` split commands through host UI.
2. Confirm the exact shared helper mapping:
   - local = `commitWorkspaceSurfaceSlotSplit(...)`
   - global = `commitWorkspaceSurfaceRootSplit(...)`
3. Add the same command exposure for `Spaghetti Editor` without copying Browser-only behavior.
4. Verify the first concrete result:
   - `Spaghetti Editor` can `Split Right Locally`
   - `Spaghetti Editor` can `Split Right Globally`
   - both route through shared workspace actions
5. Leave the more detailed multi-side ghost-trigger polish for the next execution slice if needed.

Concrete verification target:
- with a layout like `Console` on top and `Model Viewport` on bottom:
  - `Spaghetti Editor -> Split Right Locally` should split only the bottom hovered pane
  - `Spaghetti Editor -> Split Right Globally` should create a new right column across the whole workspace root
- Browser should continue to behave the same as before
- the code should read as a shared workspace command template, not a spaghetti-only branch

## [x] Phase 2 - Implement Global Split Ghost Preview Cleanup
### info
Purpose:
- repair the shared split ghost-preview system at the shell level

Current read:
- Browser already owns the highest-signal drag-preview seam in `BrowserDockHost`, but its current edge-band mapping still uses the older opposite contract:
  - outer band = `pane-local`
  - inner band = `whole-browser`
- the newly locked product truth for `7.5-8` is the reverse:
  - outer band = `global`
  - next inward band = `local`
- `Spaghetti Editor` still lacks that two-scope drag-preview language entirely
- so the next honest slice is not vague ghost polish; it is a shared drag-preview contract correction plus first-adopter rollout:
  - flip the shared Browser ghost semantics to match the new contract
  - reuse that corrected shell path for `Spaghetti Editor`
  - keep the command truth from `Phase 1` intact

Main work:
- trace Browser's current drag-preview owner and band math in `BrowserDockHost`
- correct the shared edge-band mapping so:
  - outer band = `global`
  - next inward band = `local`
- keep the shared preview result honest:
  - `global` ghost spans workspace layout bounds
  - `local` ghost is clipped to the hovered leaf pane
- reuse that corrected preview contract for `Spaghetti Editor` drag/drop validation instead of inventing a spaghetti-only ghost system
- preserve the command truth from `Phase 1` so menu-driven and drag-driven behavior now agree
- keep the design extensible for future Browser, Console, and toolbar-like surfaces

Done shape:
- the shell exposes one corrected shared drag-preview contract
- Browser drag previews now match the newly locked local/global semantics instead of the older reversed bands
- `Spaghetti Editor` can use the same corrected preview language for drag/drop validation
- menu-driven local/global commands and drag-driven local/global previews agree about the final layout result
- the cleaned-up preview path remains reusable for later surfaces without inventing a new one-off system

### Questions / Decisions

#### [x] Question 1 - What is the highest-signal shared preview seam to fix first?

##### Suggestion
- Browser's existing drag-preview resolver in `BrowserDockHost`

##### Why
- it already owns both local and global preview scopes today
- it is the clearest place where the old opposite band mapping still exists

#### [x] Question 2 - What exact semantic correction should Phase 2 make?

##### Suggestion
- flip the current drag-preview band mapping so it matches the locked product truth:
  - outer edge band = `global`
  - next inward band = `local`

##### Why
- Phase 1 already proved the command truth
- Phase 2 should make the ghost-preview truth match it

#### [x] Question 3 - Should Phase 2 try to redesign all drag-preview geometry from scratch?

##### Suggestion
- no
- keep Browser's current preview owner and geometry seam, but correct the scope decision and reuse it

##### Why
- that keeps the slice responsible
- it avoids turning `7.5-8` into a giant shell rewrite

#### [x] Question 4 - What should happen to Browser's existing tests that currently assert the old reversed bands?

##### Suggestion
- update them to the new contract rather than preserving the old semantics

##### Why
- those tests are now documenting behavior we explicitly decided is wrong

#### [x] Question 5 - What should Spaghetti Editor validate in this phase?

##### Suggestion
- the same corrected drag-preview language as Browser, starting with the right side first:
  - outer right band = `global right`
  - next inward right band = `local right`

##### Why
- right-side validation stays aligned with the first command slice from Phase 1
- later sides can follow the same shared pattern

#### [x] Question 6 - What should stay out of scope for this slice?

##### Suggestion
- deep styling polish
- popout behavior
- presentation mode
- a brand-new shell preview subsystem

##### Why
- the immediate task is semantic correctness and shared preview truth, not a broader rewrite

Checklist:
- [x] Trace the current shared split ghost-preview seam
- [x] Confirm that Browser's current drag-preview bands still encode the older reversed local/global contract
- [x] Lock the next correction around flipping Browser's outer-band versus inner-band scope mapping
- [x] Lock Browser's current preview resolver as the highest-signal shared seam to target first
- [x] Lock `Spaghetti Editor` as the first new adopter of that corrected preview contract
- [x] Lock the right side as the first drag-preview validation side for this execution slice
- [x] Lock the out-of-scope boundaries so this remains a semantics repair, not a shell rewrite
- [x] Correct the drag-preview scope mapping so outer = `global` and inner = `local`
- [x] Update Browser ghost tests to the new shared contract
- [x] Reuse the corrected preview language for `Spaghetti Editor`
- [x] Validate the cleanup first through `Spaghetti Editor`
- [x] Leave the shared preview system reusable for later Browser, Console, and toolbar-like surfaces

Likely files:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`

Highest-signal seams:
- Browser's `resolveBrowserSplitDockPreviewSide(...)` band and scope logic
- Browser's `BrowserSplitDockPreview` scope mapping and ghost rendering
- Browser tests that currently assert:
  - outer band = `pane-local`
  - inner band = `whole-browser`
- Spaghetti's current floating drag preview path, which still only exposes one split ghost scope

Implementation cut:
1. Update Browser's drag-preview resolver so the edge-band contract matches the newly locked product truth:
   - outer edge = `global`
   - next inward band = `local`
2. Update Browser's ghost-preview tests to assert the corrected contract on the right side first.
3. Reuse or adapt that corrected scope decision for `Spaghetti Editor` so floating drag toward the right edge can preview:
   - `global right`
   - `local right`
4. Keep the actual split commit behavior aligned with the already-shipped command truth from Phase 1.
5. Defer top/left/bottom rollout if the right-side first slice is enough to prove the shared contract honestly.

Verification:
- Browser's drag preview no longer uses the old reversed outer/inner scope mapping
- the first validation flow through `Spaghetti Editor` shows an honest right-side local/global split ghost preview
- drag-driven preview and menu-driven local/global commands now agree about the final layout result
- the implementation is clearly shell-owned, not spaghetti-specific

Shipped result:
- added `src/app/workspace/workspaceSplitPreview.ts` as the shared local-versus-global preview resolver
- moved `BrowserDockHost` onto that shared resolver and normalized its preview scope names to `local` and `global`
- moved `SpaghettiWindowHost` off the older side-only preview state so its floating drag ghost now uses the same shared preview rect and scope model
- verified the corrected contract through focused Browser and Spaghetti host tests plus a full production build

## [x] Phase 3 - Final Confidence And Carry Ordering
### info
Purpose:
- confirm the ghost-preview cleanup is stable enough before moving deeper into `7.5-9` through `7.5-11`

Current read:
- once the shared ghost-preview seam is honest, later presentation and visual tasks can build on it more safely

Main work:
- run a small confidence pass on the first validation surface
- decide whether Browser or another surface needs one follow-on residue slice now or later
- record the carry decision for the next `7.5.x` task

Done shape:
- `7.5-8` closes with a shared ghost-preview contract that later tasks can trust
- the next task in the cleanup ladder is explicit

Checklist:
- [x] Verify the shared ghost-preview cleanup on the first validation surface
- [x] Decide whether any immediate residue belongs here or in a later task
- [x] Record the next carry direction for the remaining `7.5.x` ladder

Verification:
- the doc can close honestly without leaving the global ghost-preview owner ambiguous

Carry result:
- the shared local-versus-global ghost-preview contract is stable enough to keep
- no immediate Browser or `Spaghetti Editor` residue is being carried inside the first three phases
- the next adoption target stays inside `7.5-8`: floating `Console`

## [x] Phase 4 - Floating Console Split Adoption Research
### info
Purpose:
- trace how floating `Console` is currently owned, moved, and restored so it can adopt the same shared split command and ghost-preview contract honestly

Current read:
- Browser and `Spaghetti Editor` now share the local/global split contract
- `Console` should be the next adopter
- console float behavior does have different ownership seams than Browser or `Spaghetti Editor`
- there is no separate `ConsoleDockHost`
- the floating console is self-hosted inside `ConsoleDock.tsx`, so the first responsible step is to lock the real ownership seams instead of searching the hosts folder for a missing console host

Main work:
- trace the floating console owner path
- trace how console titlebar drag currently works
- trace whether console already has reusable split command hooks
- identify what is missing versus Browser and `Spaghetti Editor`
- lock whether command adoption and ghost-preview adoption should stay separate

Done shape:
- the console-specific seams are known
- the next execution slice can adopt shared split commands without guesswork
- the later ghost-preview slice can reuse the shared preview system instead of inventing console-only drag logic

### Questions / Decisions

#### [x] Question 1 - Does floating console have a dedicated host file like Browser or `Spaghetti Editor`?

##### Suggestion
- no
- floating console is self-hosted inside `src/app/console/ConsoleDock.tsx`

##### Why
- the hosts folder has Browser and Spaghetti host files, but no console host
- the real floating console window markup and drag state live directly in `ConsoleDock.tsx`

#### [x] Question 2 - What currently owns floating console header drag?

##### Suggestion
- `ConsoleDock.tsx` owns it directly through:
  - `beginFloatingHeaderDrag(...)`
  - `handleFloatingHeaderPointerDown(...)`
- `ConsolePanel.tsx` only forwards the header pointer-down callback

##### Why
- this is the seam that will eventually need shared split-preview adoption
- it is different from Browser and `Spaghetti Editor`, which each have their own dedicated host owner

#### [x] Question 3 - Does console already have shared split-command support somewhere reusable?

##### Suggestion
- yes, partly
- `workspaceSurfaceActions.ts` already knows how to:
  - `floatWorkspaceSurface(...)` for console
  - `popoutWorkspaceSurface(...)` for console
  - `splitWorkspaceSurfaceToSide(...)` for console
  - `commitWorkspaceSurfaceSlotSplit(...)` and `commitWorkspaceSurfaceRootSplit(...)` for console through the shared surface-kind logic

##### Why
- this means command adoption should not invent a console-only split engine
- the next command slice should wire console onto the same helper contract the other adopters already use

#### [x] Question 4 - What does `AppShell.tsx` own for console today?

##### Suggestion
- only the slotted-console header drag seed and handoff path
- not the floating console drag engine itself

##### Why
- `AppShell.tsx` tracks `consoleSlotHeaderDragSeed`
- it passes that seed into `ConsoleDock`
- `ConsoleDock` consumes it when a slotted console is dragged out into floating mode

#### [x] Question 5 - Should command adoption and ghost-preview adoption ship separately?

##### Suggestion
- yes
- keep:
  - `Phase 5` = shared split command adoption
  - `Phase 6` = shared ghost-preview adoption

##### Why
- the code seams are different
- commands can reuse `workspaceSurfaceActions` earlier
- drag-preview adoption requires touching the floating console drag path in `ConsoleDock.tsx`
- separating them keeps the work easier to validate

Checklist:
- [x] Trace floating console ownership and host files
- [x] Trace console drag and titlebar movement path
- [x] Trace current split-command exposure for console
- [x] Lock the highest-signal seams for implementation
- [x] Decide whether command adoption and ghost-preview adoption should ship separately

Likely files:
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsolePanel.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/workspaceSplitPreview.ts`
- `src/app/AppShell.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/AppShell.test.tsx`

Highest-signal seams:
- `ConsoleDock.tsx`
  - `beginFloatingHeaderDrag(...)`
  - `handleFloatingHeaderPointerDown(...)`
  - floating window render block around `.ConsoleFloatingWindow`
  - `slotHeaderDragSeed` consume effect for slotted tear-out drags
- `ConsolePanel.tsx`
  - `.ConsolePanelHeader` forwarding `onHeaderPointerDown`
- `workspaceSurfaceActions.ts`
  - shared console float/popout support already present
  - shared slot/root split helper support already present for surface kind `console`
- `AppShell.tsx`
  - `consoleSlotHeaderDragSeed` ownership and pass-through

Implementation cut:
1. Treat `ConsoleDock.tsx` as the console host owner for the next phases instead of creating a fake `ConsoleDockHost`.
2. In `Phase 5`, wire floating console split commands into the existing shared `workspaceSurfaceActions` helpers.
3. In `Phase 6`, reuse `workspaceSplitPreview.ts` inside the floating console drag path owned by `ConsoleDock.tsx`.
4. Keep `ConsolePanel.tsx` thin: it should keep forwarding header pointer-down without becoming the owner of drag logic.
5. Use `ConsoleDock.test.tsx` plus targeted AppShell tests for verification instead of inventing a separate host harness first.

Verification:
- the doc clearly identifies the real floating console owner path
- the next command-adoption slice can start in `ConsoleDock.tsx` and `workspaceSurfaceActions.ts` without additional search work
- the later ghost-preview slice already knows the exact drag seam it must reuse

Shipped result:
- locked `ConsoleDock.tsx` as the real floating-console host owner for the next phases
- locked `ConsolePanel.tsx` as a thin header-pointer-forwarder, not a drag owner
- confirmed that `workspaceSurfaceActions.ts` already contains reusable console float/popout and shared split-helper support
- confirmed that `AppShell.tsx` only owns the slotted-console header-drag seed handoff into `ConsoleDock`

Carry-forward report:
- owner model:
  - floating console is self-hosted inside `src/app/console/ConsoleDock.tsx`
  - there is no `ConsoleDockHost` equivalent to reuse or extend
- drag model:
  - floating header drag starts in `ConsoleDock.tsx` through `handleFloatingHeaderPointerDown(...)`
  - long-running pointer movement is owned by `beginFloatingHeaderDrag(...)`
  - slotted tear-out drag is still seeded by `AppShell.tsx` through `consoleSlotHeaderDragSeed`
- panel model:
  - `ConsolePanel.tsx` should stay presentation-only
  - it forwards `onHeaderPointerDown`
  - it should not become the new owner of drag, split preview, or split commit logic
- command model:
  - `workspaceSurfaceActions.ts` already supports console in the shared surface helpers
  - future command work should reuse:
    - `floatWorkspaceSurface(...)`
    - `popoutWorkspaceSurface(...)`
    - `splitWorkspaceSurfaceToSide(...)`
    - `commitWorkspaceSurfaceSlotSplit(...)`
    - `commitWorkspaceSurfaceRootSplit(...)`
- preview model:
  - future drag preview work should reuse `src/app/workspace/workspaceSplitPreview.ts`
  - `ConsoleDock.tsx` should consume that helper directly
  - do not invent a console-only preview resolver
- testing model:
  - prefer `src/app/console/ConsoleDock.test.tsx` for owner-path verification
  - use targeted `src/app/AppShell.test.tsx` only for slot-header seed and shell integration coverage
  - do not start by inventing a new dedicated console host harness
- implementation guardrails for later phases:
  - `Phase 5` should only add shared local/global split commands to floating console
  - `Phase 6` should only add shared drag-preview adoption to the existing `ConsoleDock.tsx` owner path
  - keep commands and drag-preview adoption separate so regressions are easier to isolate

## [x] Phase 5 - Floating Console Shared Split Command Adoption
### info
Purpose:
- make floating `Console` expose the same shared local/global split commands Browser and `Spaghetti Editor` already use

Current read:
- the shared command helpers already exist
- console should become the next adopter rather than getting a custom split-command path
- floating console already routes float/popout behavior through `ConsoleDock.tsx`
- unlike Browser and `Spaghetti Editor`, console does not yet expose a floating split command surface
- the next missing piece is command exposure, not a new split engine

Main work:
- add shared local/global split commands to floating console
- route those commands through the same workspace split helpers
- keep command naming and meaning aligned with the locked `7.5-8` contract
- keep drag-preview work out of this slice

Done shape:
- floating console can perform `local` and `global` splits through the shared action layer
- command-driven console behavior matches Browser and `Spaghetti Editor`
- the command slice lands without touching the later floating-drag preview path

### Questions / Decisions

#### [x] Question 1 - Does console already have the split engine support we need?

##### Suggestion
- yes
- `workspaceSurfaceActions.ts` already supports console through:
  - `splitWorkspaceSurfaceToSide(...)`
  - `commitWorkspaceSurfaceSlotSplit(...)`
  - `commitWorkspaceSurfaceRootSplit(...)`

##### Why
- the missing work is mainly exposing the commands from floating console UI
- `Phase 5` should not invent a separate console split engine

#### [x] Question 2 - What file should own the new floating console command entry point?

##### Suggestion
- `ConsoleDock.tsx`

##### Why
- it already owns the floating console shell and floating header behavior
- it is the real owner of floating console actions

#### [x] Question 3 - Should `ConsolePanel.tsx` become the command owner?

##### Suggestion
- no
- keep `ConsolePanel.tsx` thin and presentation-oriented

##### Why
- it currently forwards callbacks and renders shared buttons
- turning it into the command owner would blur the owner boundary we just clarified in Phase 4

#### [x] Question 4 - Should Phase 5 reuse the shared floating-titlebar split menu in `AppShell.tsx`, or add console-local buttons first?

##### Suggestion
- prefer reusing the shared floating-titlebar split menu if the owner seam can stay clean
- if that seam proves awkward, fall back to a small console-local command surface only for this phase

##### Why
- reuse keeps command language aligned across Browser, `Spaghetti Editor`, and console
- but command-only progress matters more than forcing the wrong owner boundary

#### [x] Question 5 - What exact commands should be in scope first?

##### Suggestion
- match the first adopter contract already used in `7.5-8`:
  - `Split Right Locally`
  - `Split Right Globally`

##### Why
- this keeps the first console command slice small
- it matches the existing right-side-first validation path before later sides or drag preview are added

#### [x] Question 6 - What should stay out of scope for this phase?

##### Suggestion
- drag ghost preview
- edge-band detection
- floating console drag rewrite
- broader console chrome redesign

##### Why
- those belong in `Phase 6`
- `Phase 5` should remain a command-only adoption slice

Checklist:
- [x] Add shared local/global console split commands
- [x] Route console commands through shared workspace split helpers
- [x] Verify command-driven console local/global splits match the locked contract

Likely files:
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsolePanel.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/AppShell.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/AppShell.test.tsx`

Highest-signal seams:
- `ConsoleDock.tsx`
  - `handleFloatToggle(...)`
  - floating window shell around `.ConsoleFloatingWindow`
  - the place where floating-console actions are currently surfaced
- `workspaceSurfaceActions.ts`
  - existing console support in shared split helpers
- `AppShell.tsx`
  - current shared floating-titlebar split menu for Browser and `Spaghetti Editor`
  - possible reuse seam if console adopts the same menu owner path

Implementation cut:
1. Add a floating-console command entry point in `ConsoleDock.tsx`.
2. Expose `Split Right Locally` and `Split Right Globally` through that owner path, preferably by reusing the shared floating split menu pattern if it keeps ownership clean.
3. Route the commands through the shared workspace split helpers instead of console-specific split code.
4. Verify the resulting layout behavior matches the already-shipped right-side local/global contract.
5. Leave all drag-preview and edge-band behavior untouched for `Phase 6`.

Verification:
- floating console can invoke shared right-side local/global split commands
- command-driven console split results match Browser and `Spaghetti Editor`
- no drag-preview logic changed in this slice

Shipped outcome:
- `ConsoleDock.tsx` now opens the shared floating-titlebar split menu from floating console header right-click instead of needing a console-specific menu
- floating console now mirrors Browser's four-way floating titlebar split menu language:
  - `Split Top`
  - `Split Right`
  - `Split Bottom`
  - `Split Left`
- `AppShell.tsx` now resolves floating console as a valid shared split-menu target and routes those four directional console commands through the shared workspace helper layer while leaving the temporary local/global command menu only on the `Spaghetti Editor` path
- `workspaceSurfaceActions.ts` now accepts floating console command commits in both slot-scoped and root-scoped split helpers and returns console to docked mode once the new hosted split lands
- focused `ConsoleDock.test.tsx` and `AppShell.test.tsx` coverage now prove the shared menu opens from the floating console header and exposes the Browser-matching four-way directional split menu correctly

## [x] Phase 6 - Floating Console Shared Ghost Preview Adoption
### info
Purpose:
- make floating console drag and drop use the same shared local/global ghost-preview system now used by Browser and `Spaghetti Editor`

Current read:
- once console has the shared split commands, the next honest step is shared drag-preview adoption
- this should reuse the existing `workspaceSplitPreview` helper, not invent a console-only preview path

Main work:
- connect console drag preview to the shared preview helper
- render scope-aware ghost previews for local versus global drops
- keep drag-driven preview and command-driven split results aligned

Done shape:
- floating console drag preview uses the same shell-owned contract
- console becomes the next real adopter of the shared global/local split system

Checklist:
- [x] Reuse the shared preview resolver for floating console drag
- [x] Render scope-aware console ghost previews
- [x] Verify drag-driven console preview and drop results match command-driven behavior

Shipped outcome:
- `ConsoleDock.tsx` now resolves floating-console drag previews through the shared `workspaceSplitPreview.ts` contract instead of only moving the floating rect
- floating console now renders the same scope-aware workspace ghost overlay language as Browser and `Spaghetti Editor`
- pointer-up commits now route through the shared workspace split helpers so floating console drag drops dock back into the workspace with the same directional truth the ghost preview showed
- focused `ConsoleDock.test.tsx` and `AppShell.test.tsx` coverage now prove both local and global floating-console drag preview paths while the existing build remains green
- follow-up polish now makes the slotted-console-to-floating handoff pre-seed the real floating rect inside `AppShell.tsx`, so the split-template drag case keeps following the pointer smoothly instead of visibly snapping through the old parked float position first
- final follow-up polish now makes repeated console re-dock drag-outs reseed floating size from the live slot frame instead of the stale parked floating rect, so the `float -> split right -> drag out again` path stays smooth after re-splitting too
- final final truth: repeated console re-dock drag-outs should keep the stored compact floating window size instead of inheriting the redocked slot viewport dimensions, so the re-float result matches the normal post-load floating console size rather than coming back as a full split-sized console window
- titlebar clamp follow-up: repeated console re-dock drag-outs now clamp against the primary viewport body top boundary, so the floating console header cannot slide under the model viewport titlebar during the second drag-out and later become ungrabbable
- continuous handoff follow-up: slotted-console drag-out now stays under one AppShell-owned pointer session until mouse-up, so the floating console keeps following the cursor, keeps the shared ghost preview active, and does not visibly drop back into the model viewport during the repeat handoff path

### Questions / Decisions

#### [x] Question 1 - Should floating `Console` reuse the exact same edge thresholds and band sizes as Browser and `Spaghetti Editor`?

##### Suggestion
- yes
- keep the same shared preview thresholds:
  - outer edge band = `global`
  - next inward band = `local`
  - same pixel distances on all four sides

##### Why
- `7.5-8` is the shared ghost-preview truth phase family
- console should become another adopter of that truth, not a special-case drag surface

#### [x] Question 2 - Should floating `Console` use the same ghost bounds model as Browser?

##### Suggestion
- yes
- ghost bounds should follow the same shared rule:
  - `local` ghost clips to the hovered leaf pane
  - `global` ghost spans the full workspace layout bounds

##### Why
- that keeps the drag preview aligned with the already-shipped Browser plus `Spaghetti Editor` contract
- it also keeps console drag behavior visually consistent with the command meanings we already locked

#### [x] Question 3 - Should left-dock snap behavior be in scope for this phase?

##### Suggestion
- no
- leave left-dock snap behavior out of scope here

##### Why
- `Phase 6` should stay focused on shared split ghost preview adoption
- adding new dock-target rules would widen this into a larger console-host behavior pass

#### [x] Question 4 - Should floating `Console` drag drops follow the same directional meaning as Browser’s floating drag?

##### Suggestion
- yes
- for `top/right/bottom/left`, the drop result should match the side and scope the ghost preview showed

##### Why
- the shared preview must be honest
- drag-driven console results should not diverge from the same four directional outcomes Browser already teaches

#### [x] Question 5 - What is the source-of-truth behavior that the drag preview should visually predict?

##### Suggestion
- the shipped floating console four-way command menu from `Phase 5`

##### Why
- the menu already expresses the expected directional outcomes
- `Phase 6` should make drag preview visually predict those same results instead of inventing a second console-specific interpretation

Likely files:
- `src/app/console/ConsoleDock.tsx`
- `src/app/workspace/workspaceSplitPreview.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/AppShell.test.tsx`

Highest-signal seams:
- `ConsoleDock.tsx`
  - `beginFloatingHeaderDrag(...)`
  - `handleFloatingHeaderPointerDown(...)`
  - the floating drag move/up path that currently updates `floatingRect`
  - `.ConsoleFloatingWindow` render path where ghost preview will need to be shown
- `workspaceSplitPreview.ts`
  - shared local/global preview side and bounds resolver
- `workspaceSurfaceActions.ts`
  - final drag-drop commit seam after preview resolves to a side and scope

Implementation cut:
1. Reuse `resolveWorkspaceSplitDockPreview(...)` inside the floating console drag move path owned by `ConsoleDock.tsx`.
2. Track the active console split preview as shared `side + scope + targetSlotId + rect`, matching the Browser/`Spaghetti Editor` preview contract.
3. Render the preview ghost from that shared state inside the existing floating-console owner path.
4. On pointer-up, commit the drop through the shared workspace split helpers so the result matches the previewed side and scope.
5. Keep left-dock snap behavior untouched and do not widen this slice into a broader console-host rewrite.

Verification:
- floating console drag preview uses the same threshold and ghost-bounds contract as Browser and `Spaghetti Editor`
- local/global preview scopes are visually honest on all four sides
- dropping after preview commits the same directional result that the preview showed
- the shipped four-way floating console split menu and the new drag preview now describe the same behavior
