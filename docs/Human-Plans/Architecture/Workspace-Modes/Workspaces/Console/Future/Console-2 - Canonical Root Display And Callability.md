# Console-2 - Canonical Root Display And Callability

## Doc Header

### Doc History
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

- [ ] Replace stale fallback root prompt choices with canonical staged root choices.
- [ ] Keep all root-callable commands visible.
- [ ] Add tests that `ROOT_PROMPT_TEXT` and `createConsoleRootSession().validChoices` stay aligned.
- [ ] Advance `Console-Gen1-HLG-7`.
- [ ] Advance `Console-Gen1-HLG-8`.
- [ ] Advance `Console-Gen1-CLG-7`.
- [ ] Advance `Console-Gen1-CLG-8`.

### `Console-2 / Phase 2`

- [ ] Audit active summary priority for feature assist versus staged root display.
- [ ] Ensure scoped sketch/feature assist summaries use scoped breadcrumbs and labels.
- [ ] Add focused tests for scoped summary display where the live seams allow it.
- [ ] Advance `Console-Gen1-HLG-9`.
- [ ] Advance `Console-Gen1-CLG-9`.

### `Console-2 / Phase 3`

- [ ] Document and test the current no-filter contract for root display.
- [ ] Add a narrow callability/display guardrail without adding filtering behavior.
- [ ] Leave future `visibleInRoot` or category filtering deferred.
- [ ] Advance `Console-Gen1-HLG-8`.
- [ ] Advance `Console-Gen1-HLG-10`.
- [ ] Advance `Console-Gen1-CLG-8`.

### `Console-2 / Phase 4`

- [ ] Prove viewport click/focus handoff does not show a smaller stale root.
- [ ] Cover the fallback-prompt path used when no active staged root summary exists.
- [ ] Close the phase only if Root remains one full visible command surface.
- [ ] Advance `Console-Gen1-HLG-7`.
- [ ] Advance `Console-Gen1-HLG-9`.
- [ ] Advance `Console-Gen1-CLG-10`.

## [ ] `Console-2 / Phase 1` - `Root Prompt Source Unification`

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

- [ ] Replace hard-coded fallback root choices.
- [ ] Preserve root choice order.
- [ ] Cover `Sketch`, `New Sketch`, `Extrude`, `Settings`, and `Console Input` in the prompt alignment proof.
- [ ] Keep custom `buildRootPromptText([...])` formatting behavior intact.
- [ ] Verify existing root command tests still pass.

#### Verification Shape

- `npm test -- --run src/app/console/consolePromptText.test.ts`
- `npm test -- --run src/app/console/stagedNavigation.test.ts`
- `npm test -- --run src/app/console/ConsoleBar.test.tsx` only if fallback prompt expectations are touched

#### Done Shape

Phase 1 is done when fallback root prompt text and staged root choices cannot drift silently, and the current all-visible Root list includes every command exposed by `createConsoleRootSession()`.

## [ ] `Console-2 / Phase 2` - `Scoped Mode Labeling And Priority Proof`

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

Likely files:
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- `src/app/console/ConsoleBar.test.tsx`
- `src/app/console/useConsoleStore.test.ts`

#### First Pass Decisions

- Feature assist can override the active summary when a real scoped mode is active.
- The override must present a scoped breadcrumb such as `Graph > Sketch > Sketch Draw`.
- The UI should not call that scoped mode `Root`.

### Phase 2 Implementation Spec

#### Exact First Code Cut

- Audit scoped assist descriptors and summary fallback behavior.
- Add or update tests proving scoped assist breadcrumbs remain scoped.
- Keep the root session and scoped session concepts separate in test naming.

#### No-Widening Rule

Do not change command availability or command execution while cleaning up labels.

#### Implementation Risks

- summary priority tests may be broad and brittle
- some descriptors may intentionally be status-only
- stale fallback prompt parsing may still appear in old transcript entries

#### Checklist

- [ ] Prove Sketch Draw summary labels as scoped mode.
- [ ] Prove feature assist takes priority only as scoped assist.
- [ ] Preserve root summary behavior when no scoped assist is active.

#### Verification Shape

- focused ConsoleBar or store summary tests
- targeted existing tests around sketch draw assist if available

#### Done Shape

Phase 2 is done when scoped modes no longer look like a smaller Root in summary behavior.

## [ ] `Console-2 / Phase 3` - `Root Callability Display Guardrails`

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

Likely files:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/consolePromptText.test.ts`

#### First Pass Decisions

- Visibility and callability are the same for root commands in the current phase.
- Later filtering must be additive metadata and must not break direct command entry.

### Phase 3 Implementation Spec

#### Exact First Code Cut

- Add a focused test that the canonical root labels appear in displayed root text.
- Add a planning/code comment only if needed to prevent accidental filtering before the contract exists.
- Leave filtering APIs unimplemented.

#### No-Widening Rule

Do not add `visibleInRoot`, command categories, or compact root UI in this phase.

#### Implementation Risks

- over-specifying temporary labels could make future rename work noisy
- accidental coupling to alias internals instead of user-facing labels

#### Checklist

- [ ] Prove every current root choice is visible.
- [ ] Record that filtering is deferred.
- [ ] Keep direct root command resolution unchanged.

#### Verification Shape

- focused root display/callability tests

#### Done Shape

Phase 3 is done when tests protect the current all-visible Root rule without blocking a later intentional filtering system.

## [ ] `Console-2 / Phase 4` - `Viewport Handoff Regression Proof And Closeout`

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

Likely files:
- `src/app/components/ViewerHost.tsx`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/ConsoleBar.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`

#### First Pass Decisions

- Viewport can become the active surface.
- Active surface change should not imply a different Root command list.
- Scoped assist may appear only when a real scoped session is active.

### Phase 4 Implementation Spec

#### Exact First Code Cut

- Add the narrowest regression test that reproduces the root-display path after viewport handoff.
- Confirm the fallback prompt path still uses the canonical root display.
- Close `Console-2` only after Phase 1 through Phase 4 acceptance reads are satisfied.

#### No-Widening Rule

Do not redesign active-surface routing or viewport shortcut priority unless the regression cannot be fixed without it.

#### Implementation Risks

- broad `ConsoleDock` integration tests may carry unrelated failures
- exact viewport click simulation may need a smaller store-level proof
- feature assist should still be allowed to override root when truly active

#### Checklist

- [ ] Prove viewport active-surface handoff does not show stale root choices.
- [ ] Prove scoped assist still appears when expected.
- [ ] Close `Console-2` checklist honestly.

#### Verification Shape

- narrow store/ConsoleBar tests first
- broader ConsoleDock or viewport interaction proof only if the existing harness makes it reliable

#### Done Shape

Phase 4 is done when the user can click between Console and viewport without seeing two different Root menus.
