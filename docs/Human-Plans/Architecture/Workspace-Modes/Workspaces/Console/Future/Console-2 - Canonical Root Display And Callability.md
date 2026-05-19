# Console-2 - Canonical Root Display And Callability

## Doc Header

### Doc History
9. 2026-05-19 13:35:02: Implemented and shipped `Console-2 / Phase 4 - Viewport Handoff Regression Proof And Closeout` by tightening fallback Root prompt and viewer `surface-clear` handoff tests to assert every canonical Root label, preserving scoped assist behavior, and closing `Console-2` as complete with the broad ConsoleDock suite limitation recorded.
8. 2026-05-19 13:28:29: Prepped `Console-2 / Phase 4 - Viewport Handoff Regression Proof And Closeout` for implementation by grounding the slice in existing viewer `surface-clear`, fallback prompt, `ConsoleBar`, and `ConsoleDock` tests, narrowing the next code cut to canonical full-root label proof after viewport handoff and honest `Console-2` closeout.
7. 2026-05-19 13:20:52: Implemented and shipped `Console-2 / Phase 3 - Root Callability Display Guardrails` by adding focused no-filter parity tests for fallback Root prompt labels and staged Root callability labels, with a local code comment preserving the current all-visible Root contract before later filtering work.
6. 2026-05-19 13:17:51: Prepped `Console-2 / Phase 3 - Root Callability Display Guardrails` for implementation by grounding the slice in staged root choices, exported root display labels, canonical fallback root prompt text, and focused no-filter display/callability parity tests without adding filtering metadata.
5. 2026-05-19 13:09: Implemented and shipped `Console-2 / Phase 2 - Scoped Mode Labeling And Priority Proof` by adding focused `ConsoleBar` scoped-summary regression tests for Sketch Plane, Sketch Draw, feature-assist-over-root priority, and status-style scoped assist without changing runtime command behavior.
4. 2026-05-19 13:02:49: Prepped `Console-2 / Phase 2 - Scoped Mode Labeling And Priority Proof` for implementation by grounding the slice in `ConsoleBar` active-summary priority, feature-assist descriptor breadcrumbs from `ConsoleDock`, and existing ConsoleBar summary tests, narrowing the next code cut to scoped-summary regression coverage before changing any runtime labels.
3. 2026-05-19 13:00: Implemented and shipped `Console-2 / Phase 1 - Root Prompt Source Unification` by exporting canonical root labels from staged navigation, making fallback root prompt text derive from that source, and adding prompt/root alignment proof for the newer root-callable commands without changing command execution or filtering.
2. 2026-05-19 09:03:46: Prepped `Console-2 / Phase 1` for implementation by grounding the live test seams, choosing a staged-navigation-owned root display label export, narrowing the exact code cut, and locking focused verification around prompt/root alignment without introducing filtering.
1. 2026-05-19 09:00:17: Created `Console-2` as the canonical root display and callability plan after code research found the full staged root, stale fallback root prompt text, and scoped viewport/sketch assist surfaces could appear as different roots with fewer options.

### Purpose

This Family Phase Doc plans the correction that makes Console display one canonical Root for now.

Use it to answer:
- how Root display should derive from one source
- why every root-callable command remains visible for now
- how scoped viewport/sketch assist should be labeled
- which implementation phases should correct the current smaller-root confusion

Do not use it for:
- hiding root commands
- user-customizable command display
- macro or scripting behavior
- full command-language redesign
- changing command execution ownership

### Scope

This phase covers Console root display and the handoff between root, viewport focus, and scoped feature assist summaries.

It does not change the product rule that all root-callable commands are visible in Root for now.

## Doc Body

### Family Phase Goal

Console should have one canonical displayed Root.

When the console says `Root`, the user should see the same full set of root-callable commands regardless of whether the prompt is rendered from an active staged root session or from fallback prompt text.

Viewport and sketch workflows may still expose contextual assist, but those summaries should clearly identify themselves as scoped modes such as `Sketch Draw`, `Sketch Plane Pick`, or later `Extrude`, rather than feeling like smaller alternate roots.

### Current Live Read

Code research found these likely seams:
- `src/app/console/stagedNavigation.ts`
  - `buildRootChoices()` contains the full current root list.
  - `createConsoleRootSession()` creates the canonical staged root.
  - `createSketchDrawRootSession()` creates a scoped Sketch Draw command surface.
- `src/app/console/consolePromptText.ts`
  - `ROOT_PROMPT_TEXT` still uses a separate hard-coded root choice list that omits newer commands.
- `src/app/console/useConsoleInteraction.ts`
  - `enterGuidedRootSession()` creates the real root session but appends the stale fallback prompt text.
  - feature-assist effects can clear the root when a scoped descriptor is active.
- `src/app/console/ConsoleBar.tsx`
  - active summary priority prefers feature assist, then prompt sessions, then staged navigation, then parsed fallback prompt text.
- `src/app/components/ViewerHost.tsx`
  - viewport picks set the active surface to `viewer`, which can make the transition feel like the root changed.

### Boundary Rules

- do not introduce root command filtering in this phase
- do not create a second root registry
- do not make `ROOT_PROMPT_TEXT` own root choices separately from the staged root
- do not remove scoped feature assist
- do not make Console own Sketch, Extrude, graph, viewer, or workspace behavior
- do not widen into `ConsoleDock` decomposition

### Acceptance Read

This family phase is complete when:
- every Root display path uses the canonical root choices
- fallback root text contains the same visible commands as the staged root
- viewport click/focus no longer causes a stale smaller Root display
- scoped feature assist summaries are clearly labeled as scoped modes
- tests prove the no-filter rule: all root-callable commands are visible in Root for now
- the future filtered-root direction is documented without being implemented

## Vision

`Console-2` advances Console Generation 1 by making the root command surface legible and trustworthy.

The user-facing promise is simple:
- Root is one thing.
- For now, Root shows everything that can be called from Root.
- Scoped modes can guide the current workflow, but they are not alternate roots.
- Later filtering can hide commands visually only after callability and display have separate contracts.

## Wishlist Organization

### High Level Goals

- [ ] `Console-Gen1-HLG-7. Console should display one canonical root for now so Root always means the same full command surface.`
- [ ] `Console-Gen1-HLG-8. Every root-callable command should be visible in the root until a later intentional filtering system exists.`
- [ ] `Console-Gen1-HLG-9. Viewport, sketch, and feature assist modes should be labeled as scoped modes instead of feeling like smaller alternate roots.`
- [ ] `Console-Gen1-HLG-10. Later command hiding should separate display filtering from command callability instead of disabling commands.`

### Codex Level Goals

- [ ] Console-Gen1-CLG-7. Derive all root display text and root summaries from the same canonical root choice source used by the staged root session.
- [ ] Console-Gen1-CLG-8. Keep root command resolution and root display aligned so all root-callable commands are displayed during the current no-filter phase.
- [ ] Console-Gen1-CLG-9. Ensure feature-assist and sketch-draw summaries use scoped breadcrumbs and do not masquerade as a smaller Root list.
- [ ] Console-Gen1-CLG-10. Add focused regression coverage around viewport click/focus handoff so canonical Root is not accidentally replaced by stale prompt text.

### `Console-2 / Phase 1`

- [x] Replace stale fallback root prompt choices with canonical staged root choices.
- [x] Keep all root-callable commands visible.
- [x] Add tests that `ROOT_PROMPT_TEXT` and `createConsoleRootSession().validChoices` stay aligned.
- [x] Advance `Console-Gen1-HLG-7`.
- [x] Advance `Console-Gen1-HLG-8`.
- [x] Advance `Console-Gen1-CLG-7`.
- [x] Advance `Console-Gen1-CLG-8`.

### `Console-2 / Phase 2`

- [x] Audit active summary priority for feature assist versus staged root display.
- [x] Ensure scoped sketch/feature assist summaries use scoped breadcrumbs and labels.
- [x] Add focused tests for scoped summary display where the live seams allow it.
- [x] Advance `Console-Gen1-HLG-9`.
- [x] Advance `Console-Gen1-CLG-9`.

### `Console-2 / Phase 3`

- [x] Document and test the current no-filter contract for root display.
- [x] Add a narrow callability/display guardrail without adding filtering behavior.
- [x] Leave future `visibleInRoot` or category filtering deferred.
- [x] Advance `Console-Gen1-HLG-8`.
- [x] Advance `Console-Gen1-HLG-10`.
- [x] Advance `Console-Gen1-CLG-8`.

### `Console-2 / Phase 4`

- [x] Prove viewport click/focus handoff does not show a smaller stale root.
- [x] Cover the fallback-prompt path used when no active staged root summary exists.
- [x] Close the phase only if Root remains one full visible command surface.
- [x] Advance `Console-Gen1-HLG-7`.
- [x] Advance `Console-Gen1-HLG-9`.
- [x] Advance `Console-Gen1-CLG-10`.

## [x] `Console-2 / Phase 1` - `Root Prompt Source Unification`

### Phase 1 Summary

#### Purpose

Phase 1 should remove the stale root prompt source by making fallback root prompt text derive from the same canonical choices as the staged root session.

#### Owns

- root prompt text choice-source unification
- full root display for all current root-callable commands
- prompt-text alignment tests

#### Does Not Own

- scoped feature assist summary changes
- viewport handoff behavior
- command filtering
- command execution changes

#### Current Live Read

Live files:
- `src/app/console/stagedNavigation.ts`
  - `buildRootChoices()` owns the current canonical root choice order.
  - `createConsoleRootSession()` exposes those choices as the staged root.
  - `stagedNavigation.test.ts` already proves the full root command token list includes `SKETCH`, `NEW_SKETCH`, `EXTRUDE`, `SETTINGS`, and `CONSOLEINPUT`.
- `src/app/console/consolePromptText.ts`
  - `buildRootPromptText()` currently has its own default list and is the drift point.
  - `ROOT_PROMPT_TEXT` is currently built from that stale default list.
- `src/app/console/consolePromptText.test.ts`
  - currently only proves `buildRootPromptText()` equals `ROOT_PROMPT_TEXT` and that custom choices format correctly.
  - should gain the root alignment proof.
- `src/app/console/stagedNavigation.test.ts`
  - should remain the root command surface proof.
- `src/app/console/ConsoleBar.test.tsx`
  - may need a focused fallback prompt summary update only if existing expected fallback text assumes the shorter root list.

#### First Pass Decisions

- Root display labels should be exported from the staged-navigation root owner, most likely through a small helper such as `getConsoleRootChoiceLabels()`.
- `consolePromptText.ts` may import that label helper, but `stagedNavigation.ts` should not import `consolePromptText.ts`; this avoids a circular import between navigation ownership and formatting.
- The displayed prompt should preserve current labels and order.
- For now, adding a root command means it appears in the displayed Root list.
- Existing `buildRootPromptText(['One', 'Two'])` custom formatting should stay available for tests and non-root callers.

### Phase 1 Implementation Spec

#### Exact First Code Cut

- Export a canonical root-display label helper from `stagedNavigation.ts`, using `buildRootChoices().map((choice) => choice.label)`.
- Update `ROOT_PROMPT_TEXT` so it uses canonical root labels.
- Update `consolePromptText.test.ts` so `ROOT_PROMPT_TEXT` equals `buildRootPromptText(getConsoleRootChoiceLabels())`.
- Add explicit expectations that the root prompt contains the newer root labels: `Sketch`, `New Sketch`, `Extrude`, `Settings`, and `Console Input`.
- Update any fallback summary test text that still hard-codes the stale shorter root list.
- Leave command execution, aliases, staged navigation submit behavior, and feature assist untouched.

#### No-Widening Rule

Do not introduce `visibleInRoot`, command categories, user preferences, compact display, or command registry migration in Phase 1.

#### Implementation Risks

- circular imports between prompt text and staged navigation
- tests that assert the old shorter fallback prompt
- accidentally changing command aliases while only changing display text

#### Checklist

- [x] Replace hard-coded fallback root choices.
- [x] Preserve root choice order.
- [x] Cover `Sketch`, `New Sketch`, `Extrude`, `Settings`, and `ConsoleInput` in the prompt alignment proof.
- [x] Keep custom `buildRootPromptText([...])` formatting behavior intact.
- [x] Verify existing root command tests still pass.

#### Verification Shape

- `npm test -- --run src/app/console/consolePromptText.test.ts`
- `npm test -- --run src/app/console/stagedNavigation.test.ts`
- `npm test -- --run src/app/console/ConsoleBar.test.tsx` only if fallback prompt expectations are touched

#### Done Shape

Phase 1 is done when fallback root prompt text and staged root choices cannot drift silently, and the current all-visible Root list includes every command exposed by `createConsoleRootSession()`.

### Phase 1 Runtime Note

The shipped slice added:
- `src/app/console/stagedNavigation.ts`
  - `getConsoleRootChoiceLabels()` as the staged-navigation-owned display-label export for root choices
- `src/app/console/consolePromptText.ts`
  - fallback `ROOT_PROMPT_TEXT` now derives from the canonical staged root label source instead of a separate hard-coded list
- `src/app/console/consolePromptText.test.ts`
  - alignment proof that fallback root prompt text uses the staged root labels
  - explicit coverage for newer root-visible labels including `Sketch`, `New Sketch`, `Extrude`, `Settings`, and `ConsoleInput`

This remains intentionally display-source-only. It does not change command execution, aliases, scoped feature assist, command filtering, or root callability.

## [x] `Console-2 / Phase 2` - `Scoped Mode Labeling And Priority Proof`

### Phase 2 Summary

#### Purpose

Phase 2 should make sure contextual assist surfaces are visibly scoped modes, not smaller roots.

#### Owns

- scoped summary labeling proof
- sketch draw and feature assist breadcrumb review
- focused summary priority tests

#### Does Not Own

- changing sketch draw tools
- changing feature execution
- removing feature assist
- root prompt source work already handled by Phase 1

#### Current Live Read

Live files:
- `src/app/console/ConsoleBar.tsx`
  - `activeSummary` priority is currently:
    - status feature assist
    - prompt session
    - normal feature assist
    - staged navigation
    - parsed fallback transcript prompt
  - normal and status feature assist summaries use `featureAssistDescriptor.breadcrumb ?? [featureAssistDescriptor.label]`, so the visible summary can stay scoped even when the descriptor label is shorter.
  - staged navigation summaries use `buildStagedSummaryBreadcrumb(...)`, which already maps local sketch draw zoom to `Graph > Sketch > Sketch Draw > Zoom`.
- `src/app/console/ConsoleDock.tsx`
  - `buildSketchPlaneFeatureAssistDescriptor(...)` gives Sketch Plane descriptors breadcrumbs like `Graph > Sketch > Sketch Plane`.
  - `buildSketchDrawFeatureAssistDescriptor(...)` gives Sketch Draw descriptors breadcrumbs like `Graph > Sketch > Sketch Draw`, including active-tool status paths.
  - `buildFeatureAssistPromptText(...)` still formats choice transcripts from `descriptor.label`, so Phase 2 should avoid broad transcript rewrites unless a summary test proves visible ambiguity.
- `src/app/console/ConsoleBar.test.tsx`
  - already covers alias highlighting for a feature-assist descriptor with `Sketch Plane > Move`.
  - already covers read-only status assist descriptors without empty brackets.
  - already covers fallback root prompt alias parsing.
  - should gain focused scoped-summary priority tests before runtime behavior changes.

#### First Pass Decisions

- Feature assist can override the active summary when a real scoped mode is active.
- The override must present a scoped breadcrumb such as `Graph > Sketch > Sketch Draw`.
- The UI should not call that scoped mode `Root`.
- Phase 2 should begin as regression proof. Only change runtime labels if the tests expose a visible summary path that still renders a scoped mode as `Root` or as an unqualified smaller command surface.
- Transcript entries can remain historical text for now; this phase is about the live ConsoleBar summary display unless the implementation read finds a user-visible summary fallback bug.

### Phase 2 Implementation Spec

#### Exact First Code Cut

- Add focused `ConsoleBar` tests that set `featureAssistDescriptor` directly and prove:
  - a Sketch Plane descriptor with label `Sketch Plane` and breadcrumb `Graph > Sketch > Sketch Plane` renders the full scoped breadcrumb in `.ConsoleBarSummary`.
  - a Sketch Draw descriptor with label `Sketch Draw` and breadcrumb `Graph > Sketch > Sketch Draw` renders the full scoped breadcrumb and does not render `Root`.
  - a status-style descriptor with an active-tool/status breadcrumb renders the full scoped breadcrumb without empty brackets.
  - feature assist summary priority wins over a simultaneous root staged session, while still rendering the feature-assist scoped breadcrumb rather than Root.
- Add or update a staged-navigation summary test only if the existing `sketchDrawZoomRoot` mapping is not already covered by a reliable test.
- Keep root session and scoped command-summary tests named separately so future filtered-root work does not confuse them.
- Change runtime code only if the focused tests reveal that the visible summary drops the scoped breadcrumb.

#### No-Widening Rule

Do not change command availability or command execution while cleaning up labels.

Do not rewrite transcript history, command prompt execution, feature-assist ownership, root callability, or command filtering in Phase 2.

#### Implementation Risks

- summary priority tests may be broad and brittle
- some descriptors may intentionally be status-only
- stale fallback prompt parsing may still appear in old transcript entries
- `buildFeatureAssistPromptText(...)` and `ConsoleBar` summary rendering intentionally format different surfaces; changing both at once would widen the phase.

#### Checklist

- [x] Prove Sketch Draw summary labels as scoped mode.
- [x] Prove feature assist takes priority only as scoped assist.
- [x] Preserve root summary behavior when no scoped assist is active.
- [x] Prove status-style scoped assist does not render empty brackets.
- [x] Avoid command execution, alias, filtering, and transcript-history rewrites.

#### Verification Shape

- `npm.cmd exec -- vitest run src/app/console/ConsoleBar.test.tsx`
- optional targeted `ConsoleDock` scoped-assist tests only if implementation touches descriptor creation

#### Done Shape

Phase 2 is done when scoped modes no longer look like a smaller Root in summary behavior.

### Phase 2 Runtime Note

The shipped slice added:
- `src/app/console/ConsoleBar.test.tsx`
  - proof that Sketch Plane feature assist renders as `Graph > Sketch > Sketch Plane`
  - proof that Sketch Draw feature assist renders as `Graph > Sketch > Sketch Draw` instead of Root
  - proof that feature assist summary priority can win over a simultaneous root staged session while preserving the scoped breadcrumb
  - proof that status-style Sketch Draw assist renders its scoped active-tool breadcrumb without empty brackets

No runtime code changed in this phase. The tests confirmed the visible `ConsoleBar` summary already uses feature-assist breadcrumbs correctly, so Phase 2 closed as regression coverage only.

## [x] `Console-2 / Phase 3` - `Root Callability Display Guardrails`

### Phase 3 Summary

#### Purpose

Phase 3 should lock the current product rule that every root-callable command is visible in Root, while leaving room for later filtering.

#### Owns

- no-filter root display contract
- regression tests tying root display to root callability
- deferred filtering notes

#### Does Not Own

- implementing filtering
- user preferences
- command palette categories
- macro or scripting command registry

#### Current Live Read

Files and live seams:
- `src/app/console/stagedNavigation.ts`
  - `buildRootChoices()` remains the private canonical staged Root choice source.
  - `getConsoleRootChoiceLabels()` exposes the current user-facing Root labels for display text.
  - `createConsoleRootSession()` still uses `buildRootChoices()` for `validChoices`.
  - `isConsoleStagedNavigationRootToken()` still checks root tokens against `buildRootChoices()`.
  - `submitConsoleStagedNavigationToken(...)` still resolves root entry from the same root choice list when the active staged session is Root or missing.
- `src/app/console/consolePromptText.ts`
  - `buildRootPromptText()` now defaults to `getConsoleRootChoiceLabels()`.
  - `ROOT_PROMPT_TEXT` is the fallback root prompt text produced from that canonical label list.
- `src/app/console/consolePromptText.test.ts`
  - already proves the fallback root prompt includes the newer root-callable labels.
  - does not yet prove every current root display label is represented.
- `src/app/console/stagedNavigation.test.ts`
  - already covers root command token resolution.
  - should own the callability side of any root display/callability parity proof.

#### First Pass Decisions

- Visibility and callability are the same for root commands in the current phase.
- The current visible Root label list is `getConsoleRootChoiceLabels()`.
- The current root-callable command list is the staged Root session's `validChoices`, backed by `buildRootChoices()`.
- Phase 3 should prove those two surfaces stay in parity without changing command ownership.
- Later filtering must be additive metadata and must not break direct command entry.
- Do not introduce `visibleInRoot`, command categories, user preferences, or compact Root display in this phase.

### Phase 3 Implementation Spec

#### Exact First Code Cut

- Add a focused `consolePromptText.test.ts` proof that every `getConsoleRootChoiceLabels()` label appears in `ROOT_PROMPT_TEXT`.
- Add a focused `stagedNavigation.test.ts` proof that `createConsoleRootSession().validChoices` labels match `getConsoleRootChoiceLabels()` exactly for the current no-filter Root.
- Keep existing direct root command resolution tests for root-callable commands unchanged.
- Add a short code comment near `getConsoleRootChoiceLabels()` only if the implementation needs a local guardrail that the exported labels intentionally mirror staged Root choices for now.
- Leave filtering APIs unimplemented.

#### No-Widening Rule

Do not add `visibleInRoot`, command categories, user preferences, or compact Root UI in this phase.

#### Implementation Risks

- over-specifying temporary labels could make future rename work noisy
- accidental coupling to alias internals instead of user-facing labels

#### Checklist

- [x] Prove every current root choice is visible.
- [x] Prove visible root labels match staged root callability labels.
- [x] Record that filtering remains deferred.
- [x] Keep direct root command resolution unchanged.

#### Verification Shape

- `npm.cmd exec -- vitest run src/app/console/consolePromptText.test.ts src/app/console/stagedNavigation.test.ts`

#### Done Shape

Phase 3 is done when tests protect the current all-visible Root rule without blocking a later intentional filtering system.

### Phase 3 Runtime Note

The shipped slice added:
- `src/app/console/consolePromptText.test.ts`
  - proof that every `getConsoleRootChoiceLabels()` label appears in `ROOT_PROMPT_TEXT`
- `src/app/console/stagedNavigation.test.ts`
  - proof that `getConsoleRootChoiceLabels()` exactly matches `createConsoleRootSession().validChoices` labels
- `src/app/console/stagedNavigation.ts`
  - a short no-filter contract comment beside `getConsoleRootChoiceLabels()`

This does not add filtering, categories, user preferences, compact Root display, or command execution changes. It only guards the current rule that every root-callable command remains visible in Root.

## [x] `Console-2 / Phase 4` - `Viewport Handoff Regression Proof And Closeout`

### Phase 4 Summary

#### Purpose

Phase 4 should prove that clicking or focusing the viewport does not make Console show a stale smaller Root.

#### Owns

- viewport focus/root display regression proof
- fallback summary behavior proof
- family phase closeout read

#### Does Not Own

- changing viewer selection semantics
- changing viewport shortcuts
- changing sketch/extrude command execution
- visual redesign of Console

#### Current Live Read

Files and live seams:
- `src/app/console/useConsoleInteraction.ts`
  - `enterGuidedRootSession({ appendPrompt: true })` appends `ROOT_PROMPT_TEXT` when returning to Root and avoids duplicate prompt entries.
  - `rehydrateGuidedRootSession()` can restore a guided Root only when no staged session, prompt session, feature assist, input text, sketch-plane pick session, or sketch draw session is active.
  - viewport `surface-clear` sync is already the likely handoff path for viewer empty-click/deselect behavior.
- `src/app/console/ConsoleDock.test.tsx`
  - already proves viewer `surface-clear` returns from selected graph/sketch/reference context to Root.
  - already has `shows root availability when viewer surface-clear happens while already at root`.
  - already has `keeps the full root prompt after viewer deselect, esc, and a second empty viewport click`.
  - those tests currently assert representative root labels and should be tightened to the full canonical Root list from `getConsoleRootChoiceLabels()`.
- `src/app/console/ConsoleBar.test.tsx`
  - already has fallback prompt rendering coverage via `keeps root alias hints when the summary is rendered from the fallback prompt text`.
  - that test still uses a shorter hard-coded fallback root prompt and should move to `ROOT_PROMPT_TEXT` plus canonical label coverage.
- `src/app/console/consolePromptText.ts`
  - `ROOT_PROMPT_TEXT` is now canonical fallback Root text.
- `src/app/console/stagedNavigation.ts`
  - `getConsoleRootChoiceLabels()` is the current no-filter Root label source.

#### First Pass Decisions

- Viewport can become the active surface.
- Active surface change should not imply a different Root command list.
- Scoped assist may appear only when a real scoped session is active.
- Phase 4 should strengthen existing regression seams before adding a broader viewport click harness.
- The root display assertion should use `getConsoleRootChoiceLabels()` rather than manually repeating representative labels.
- Fallback transcript prompt parsing should use `ROOT_PROMPT_TEXT`, not a shorter hand-authored root string.
- `Console-2` can close only if Phase 1 through Phase 4 acceptance reads remain true after implementation.

### Phase 4 Implementation Spec

#### Exact First Code Cut

- Update `ConsoleDock.test.tsx` viewer `surface-clear`/empty viewport handoff tests so their `ConsoleBarSummary` assertions iterate through `getConsoleRootChoiceLabels()` and prove the full Root list survives the handoff.
- Update the `ConsoleBar.test.tsx` fallback prompt parsing test to use `ROOT_PROMPT_TEXT` and prove the rendered choices include every canonical Root label.
- Preserve the existing scoped assist priority tests from Phase 2 and do not weaken feature-assist behavior.
- Close `Console-2` in this Future doc and `Console-Gen1-Index.md` only after the focused tests pass and the Phase 1 through Phase 4 checklist reads are satisfied.

#### No-Widening Rule

Do not redesign active-surface routing, viewport shortcut priority, viewer selection semantics, sketch/extrude command execution, or feature-assist ownership unless the regression cannot be fixed without it.

#### Implementation Risks

- broad `ConsoleDock` integration tests may carry unrelated failures
- exact viewport click simulation may need a smaller store-level proof
- feature assist should still be allowed to override root when truly active
- closing `Console-2` too early would hide a remaining stale-root seam; keep closeout tied to concrete test coverage

#### Checklist

- [x] Prove viewport active-surface handoff does not show stale root choices.
- [x] Prove fallback prompt rendering uses the canonical full Root list.
- [x] Prove scoped assist still appears when expected.
- [x] Mark Phase 4 shipped and close `Console-2` only when Phase 1 through Phase 4 are all satisfied.

#### Verification Shape

- `npm.cmd exec -- vitest run src/app/console/ConsoleBar.test.tsx src/app/console/ConsoleDock.test.tsx`
- optional `npm.cmd exec -- vitest run src/app/console/consolePromptText.test.ts src/app/console/stagedNavigation.test.ts` if the implementation touches shared root label/prompt helpers

#### Done Shape

Phase 4 is done when the user can click between Console and viewport without seeing two different Root menus, fallback prompt rendering still shows the full canonical Root list, scoped assist remains scoped, and `Console-2` can be honestly closed.

### Phase 4 Runtime Note

The shipped slice added:
- `src/app/console/ConsoleBar.test.tsx`
  - fallback prompt rendering now uses `ROOT_PROMPT_TEXT`
  - fallback summary assertions now prove every `getConsoleRootChoiceLabels()` label is visible
- `src/app/console/ConsoleDock.test.tsx`
  - viewer `surface-clear` root-availability assertions now prove every canonical Root label is visible
  - the second empty viewport handoff test now seeds through a live graph-sketch selected context before proving fallback Root remains full after Escape and another viewer clear

No runtime behavior changed. The focused Phase 4 proof passed, and the Phase 1 through Phase 4 acceptance reads are satisfied, so `Console-2` is closed. The full `ConsoleDock.test.tsx` file still has unrelated failures in the current working tree outside this Phase 4 root-display slice; those were not widened into this closeout.
