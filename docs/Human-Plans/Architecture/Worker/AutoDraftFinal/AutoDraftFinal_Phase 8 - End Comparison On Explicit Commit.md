# AutoDraftFinal Phase 8 - End Comparison On Explicit Commit

## Doc Header

### Doc History
7. 2026-04-14 08:58: Completed `Phase 8.5 - Auto Live Read-Through Proof And Verification` as the intended proof-only closeout by extending the existing branch-local `Auto / Live` handoff coverage in `ViewerHost.test.tsx` so the same two-branch graph now explicitly proves both the active comparison state and the settled winner-only state, and by adding a matching `buildViewportResultSelectorOptions.test.ts` projection proof that the lingering graph interaction flag no longer keeps `isInteractionActive` alive once UI interaction ends
6. 2026-04-14 08:53: Prepped `Phase 8.5 - Auto Live Read-Through Proof And Verification` for implementation by narrowing the remaining risk after the 8.3 and 8.4 producer fixes: the control/store seams now have explicit typed-commit, pointer-release, and explicit-build settle proofs, but the final family gap is still the producer-to-viewport handoff, so this slice now owns one real `Auto / Live` read-through that starts from active branch-local comparison and proves the settled selector plus host path drops the old baseline while keeping the winner visible
5. 2026-04-14 08:49: Completed `Phase 8.4 - End Comparison On Pointer Release` as the intended proof-first canvas settle slice by adding the missing `NodeView.geometryMode.test.tsx` read-through that drives the real primitive drag lane through `pointerdown`, `pointermove`, and `pointerup`, proving pointer release clears both `isInteracting` and `browserInteractionGraphDocumentIds[graphDocumentId]` without requiring any runtime patch to `PortView.tsx` or `NodeView.tsx`
4. 2026-04-14 08:42: Prepped `Phase 8.4 - End Comparison On Pointer Release` for implementation by locking the current canvas-side seam read: `PortView.tsx` already owns a dedicated pointer-up interaction end for primitive drag rows and `NodeView.tsx` already forwards that lifecycle through `beginGraphParameterInteraction` and `endGraphParameterInteraction`, so this slice is now intentionally proof-first and only allowed to mutate runtime code if the read-through proofs expose a real mismatch between pointer release and viewport settle timing
3. 2026-04-14 00:36: Completed `Phase 8.3 - End Comparison On Typed Commit` by making the feature-stack typed numeric path treat `Enter` and `Escape` as explicit settle edges instead of waiting for `blur` to be the first lifecycle end: `FeatureValueBar.tsx` now ends the existing interaction lifecycle immediately on explicit typed commit while suppressing the duplicate blur cleanup edge, and the focused `FeatureStackView` proof now locks that typed numeric editing keeps both interaction channels active during raw typing but clears both channels as soon as `Enter` commits
2. 2026-04-14 00:31: Completed `Phase 8.1 - Find The Remaining Explicit-Commit Leak` by tracing the current explicit-commit producers after the Phase 7/8 work and locking the remaining leak attribution: the settled selector recipe is not the primary remaining issue, explicit `Build` now already has a dedicated target-graph settle path in `useAppStore.ts`, and the strongest remaining explicit-commit leak is the feature-stack typed numeric path where `FeatureValueBar.tsx` still keeps comparison active until `blur`; canvas primitive editing in `PortView.tsx` already has better explicit settle edges via `Enter` and pointer release, so the next live fix should target typed feature-stack commit first instead of reopening selector logic
1. 2026-04-14 00:27: Added `Phase 8 - End Comparison On Explicit Commit` as the next narrow follow-up after the Phase 7 settle work exposed one remaining lifecycle gap: `Auto / Live` can still keep the old changed-part `50%` blue comparison baseline visible after the user has explicitly committed a parameter because some explicit commit seams are not terminating viewport comparison soon enough, so this phase now owns the shared explicit-commit settle rule without reopening selector result meaning

### Purpose

This doc defines the next narrow follow-up phase under `AutoDraftFinal`.

Use it to answer:
- when explicit commit should end viewport comparison
- which input seams still leave `Auto / Live` in comparison state too long
- how typed numeric commit, slider/pointer release, and explicit `Build` should terminate the old blue baseline
- how to prove the winner remains visible after comparison ends

### Why This Phase Exists

Today the family already has:
- selector-owned visible-result meaning
- explicit committed-baseline ownership
- a thinner `ViewerHost`
- disconnect clearing
- a shared settle contract from `Phase 7`

That is enough to say:
- once interaction is settled, the old comparison baseline should disappear

It is not yet enough to guarantee that all explicit commit paths actually signal that settle point in time.

Current product read:
- while the user is actively comparing old versus new, the changed branch may keep its old `50%` blue baseline
- once the user explicitly commits the parameter, that old blue baseline should disappear
- the viewport should then show only:
  - unchanged committed geometry
  - the new winning changed geometry

Current repo read:
- the selector already collapses settled `Auto / Live` back to a `base-only` `lastLoaded` winner
- the remaining issue is not mainly settled selector meaning
- the remaining issue is explicit commit lifecycle: some controls or build-entry seams still leave comparison active too long

### Scope

This phase covers:
- explicit commit ending viewport comparison for:
  - typed numeric commit
  - pointer/slider release
  - explicit `Build`
- app-store or UI-lifecycle cleanup needed to stop the old changed-part baseline after explicit commit
- proof that `Auto / Live` settles back to one visible winner after explicit commit

This phase does not cover:
- output disconnect clearing
- broad selector redesign
- new viewport mode semantics
- worker invalidation changes

## Doc Body

## [x] Phase 8 - End Comparison On Explicit Commit

### Header

Purpose:
- make explicit commit end viewport comparison immediately enough that `Auto / Live` no longer keeps the old changed-part `50%` blue baseline visible after commit

Owns:
- explicit commit lifecycle for viewport comparison
- typed-input commit settle
- pointer release settle
- explicit build settle
- proof that the old baseline disappears while the winner remains visible

Does not own:
- selector visible-result truth
- output disconnect clearing
- new mode-family behavior

### Current Constraints

This phase starts from the landed groundwork in:
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Index.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Vision.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 7 - Clear Old Comparison Baseline After Commit.md`

Locked starting constraints:
- `Phase 7` already made settled selector states collapse back to one visible winner
- `buildViewportResultSelectorOptions.ts` now defines active comparison as:
  - graph-scoped browser interaction
  - plus active UI interaction
- the next bug is a producer problem first:
  - some explicit commit seams still do not terminate comparison at the right moment

Current likely seams this phase should read against:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/ui/features/FeatureValueBar.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`

Important current-reality rule:
- explicit commit is a settle event for viewport comparison
- raw typing alone is not
- blur remains fallback cleanup, not the only meaningful settle trigger

### Locked Direction

#### 1. Explicit commit ends comparison

The guiding rule for this phase is:
- once the user has explicitly committed the change, the viewport is no longer in old-versus-new comparison mode

Explicit commit includes:
- typed numeric `Enter`
- slider or pointer release
- arrow-step click
- explicit `Build`

Important rule:
- do not keep the old blue baseline alive just because the input still has focus after explicit commit

#### 2. Raw typing does not end comparison

While the user is still typing:
- the viewport may stay in comparison state
- the old blue baseline may still be visible

Important rule:
- do not clear comparison on every `onChange`
- only clear it when the user has explicitly committed or when fallback blur cleanup runs

#### 3. The winner must survive the cleanup

The fix must preserve:
- unchanged committed geometry
- the new winning changed geometry

It must only remove:
- the old changed-part comparison baseline

Important rule:
- do not solve this by blanking the whole viewport or by suppressing the new winner

### Implementation Target

`Phase 8` should make one behavior shift real:

- after explicit commit, `Auto / Live` stops rendering the old changed-part comparison baseline even if some UI focus state lingers

The minimum meaningful behavior change should be:
1. user edits a parameter in `Auto / Live`
2. old versus new comparison appears while interaction is active
3. user explicitly commits
4. old blue baseline disappears
5. the new winner remains visible

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/ui/features/FeatureValueBar.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`

Likely supporting files:
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/ui/features/FeatureValueBar.test.tsx`
- `src/app/spaghetti/canvas/PortView.test.tsx`
- existing viewport proof files if a read-through assertion is needed

### Verification Bar

This phase is only done if it proves both:
- explicit commit ends comparison
- the new winner remains visible after the old baseline disappears

Required proof:
- one control-level proof for typed commit behavior
- one control-level proof for pointer release behavior
- one store-level proof for explicit `Build`
- existing viewport proofs stay green

### Suggested Phase Ladder

## [x] Phase 8.1 - Find The Remaining Explicit-Commit Leak

Goal:
- name which explicit commit seams still leave comparison active too long

Owns:
- code-read attribution of the remaining explicit-commit lifecycle gap

File targets:
- `src/app/spaghetti/ui/features/FeatureValueBar.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/store/useAppStore.ts`

Implementation target:
- confirm whether the remaining leak is:
  - typed commit only
  - explicit build only
  - or both

Verification bar:
- the leak owner must be named precisely before code changes begin

Done when:
- the remaining explicit-commit seam is attributable to named producers

Important rule:
- do not reopen selector recipe logic in this step

Stop rule:
- stop once the remaining explicit-commit lifecycle leak is attributable to one or more named seams

Landed result:
- settled selector meaning is not the primary remaining leak:
  - `Phase 7` already made settled `Auto / Live` collapse back to one visible `lastLoaded` winner
- explicit `Build` is no longer the strongest remaining seam:
  - `useAppStore.ts` now has `settleGraphViewportComparison(graphDocumentId)`
  - `requestGraphDocumentBuild(..., { explicit: true })` already terminates target-graph comparison before dispatch
- canvas primitive editing is not the strongest remaining seam either:
  - `PortView.tsx` already treats pointer release and typed `Enter` as explicit settle edges
  - `NodeView.tsx` already forwards those control edges through `beginGraphParameterInteraction` and `endGraphParameterInteraction`
- strongest remaining explicit-commit leak:
  - feature-stack typed numeric editing
  - `FeatureValueBar.tsx` begins comparison on `focus`
  - it still ends comparison primarily on `blur`
  - so a typed value can be effectively committed while the field still owns focus, leaving `Auto / Live` in comparison state too long

Locked read for the next sub-phase:
- `Phase 8.2` has effectively already landed as a shared explicit-build settle seam
- the next implementation slice that should change live behavior is `Phase 8.3 - End Comparison On Typed Commit`

## [ ] Phase 8.2 - End Comparison On Explicit Build

Goal:
- make explicit build terminate viewport comparison for the target graph

Owns:
- the shared app-store explicit-build settle path

File targets:
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`

Current live read:
- explicit build is a settle event for viewport comparison
- it should not wait for incidental blur
- it must not clear unrelated graph interaction

Implementation target:
- add one narrow target-graph settle path for explicit build entrypoints

Verification bar:
- explicit build clears only the target graph comparison state
- unrelated graph interaction remains intact

Done when:
- explicit build no longer leaves the old baseline alive for the target graph

Important rule:
- do not reuse delayed release-dispatch behavior for explicit settle

Stop rule:
- stop once explicit build settle is independently correct and proved

## [x] Phase 8.3 - End Comparison On Typed Commit

Goal:
- make typed numeric explicit commit end comparison without waiting for blur

Owns:
- typed numeric explicit-commit settle behavior

File targets:
- `src/app/spaghetti/ui/features/FeatureValueBar.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- related control tests

Current live read:
- raw typing should keep comparison active
- `Enter` is explicit commit
- blur is fallback cleanup

Implementation target:
- ensure typed explicit commit ends the interaction lifecycle while raw typing does not

Verification bar:
- typing alone does not end comparison
- `Enter` commit does

Done when:
- old baseline no longer survives typed explicit commit

Important rule:
- do not clear comparison on every keystroke

Stop rule:
- stop once typed explicit-commit behavior is independently correct and proved

### Current live seam read

Current strongest leak owner:
- `FeatureValueBar.tsx`
  - begins comparison on `focus`
  - updates the real graph on each accepted numeric `onChange`
  - still ends comparison primarily on `blur`
- that means the graph and viewport winner can already have advanced while:
  - the field still owns focus
  - `FeatureStackView.tsx` still keeps browser interaction alive for the graph
  - `buildViewportResultSelectorOptions.ts` still sees `isInteractionActive === true`

Supporting repo read:
- `PortView.tsx` is already in better shape for explicit settle:
  - pointer release ends interaction
  - `Enter` commits then blurs
- so this sub-phase should target typed feature-stack commit first, not broaden back into canvas pointer logic

### Implementation target

This sub-phase should make one narrow behavior change real:

- in the feature-stack typed numeric path, pressing `Enter` should end comparison immediately enough that the old blue baseline disappears even if the field would otherwise have remained the active focus owner

The minimum implementation shape should be:
1. keep `focus` as the start of comparison
2. keep raw typing as still-active comparison
3. treat typed `Enter` as explicit commit
4. end the feature-stack interaction lifecycle at that commit edge
5. leave `blur` in place as fallback cleanup

### Expected file targets for 8.3

Primary implementation files:
- `src/app/spaghetti/ui/features/FeatureValueBar.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`

Likely supporting proof files:
- `src/app/spaghetti/ui/features/FeatureValueBar.test.tsx`
- `src/app/spaghetti/ui/FeatureStackView.test.tsx`
- one existing viewport proof file only if a read-through assertion is needed

### Verification bar for 8.3

This sub-phase is only done if it proves both:
- raw typing still keeps comparison active
- typed `Enter` commit ends comparison without waiting for incidental blur

Required proof:
- one `FeatureValueBar` control proof that:
  - focus starts interaction
  - raw typing alone does not end it
  - `Enter` ends it
- one `FeatureStackView` read-through proof that:
  - feature-stack numeric editing starts both interaction channels
  - typed `Enter` commit clears both interaction channels

Important rule:
- do not add a new public `onInteractionCommit` prop unless the existing lifecycle shape is truly insufficient
- prefer ending the existing interaction lifecycle at the explicit typed commit edge

Stop rule:
- stop once the feature-stack typed numeric path no longer leaves `Auto / Live` comparison active after explicit commit

Landed result:
- `FeatureValueBar.tsx` now treats typed `Enter` and `Escape` as explicit lifecycle settle edges instead of relying on `blur` to be the first interaction-ending event
- the existing `onInteractionEnd` callback still remains the only public lifecycle end signal
- `blur` is still present as fallback cleanup, but the explicit typed commit edge now ends comparison immediately and suppresses a duplicate blur cleanup call
- `FeatureStackView.test.tsx` now locks the real regression path:
  - focus starts both UI interaction and graph-scoped browser interaction
  - raw typed editing keeps both active
  - `Enter` commit clears both without requiring a manually triggered test blur step

## [x] Phase 8.4 - End Comparison On Pointer Release

Goal:
- make slider or pointer-release editing end comparison at release time

Owns:
- pointer-based explicit-commit settle behavior

File targets:
- `src/app/spaghetti/canvas/PortView.tsx`
- any adjacent value-row control that uses pointer release

Implementation target:
- ensure pointer release ends comparison immediately enough for the old baseline to disappear

Verification bar:
- pointer drag starts comparison
- pointer release ends it

Done when:
- pointer-based explicit commit no longer leaves the old baseline alive

Important rule:
- do not widen this into a new slider design

Stop rule:
- stop once pointer release settle is independently correct and proved

### Current live seam read

Current repo read:
- `PortView.tsx` already owns one explicit pointer-release settle edge for primitive value rows:
  - `startPrimitiveDrag(...)` begins interaction on pointer down
  - `handlePointerUp` ends interaction on release
- `NodeView.tsx` already forwards pointer-based parameter editing through:
  - `beginGraphParameterInteraction`
  - `endGraphParameterInteraction`
  - `ParaSlider` `onChangeEnd`
- so the remaining work in this slice is not a broad redesign first
- it is mainly:
  - prove the pointer-release seam is the one true explicit settle edge for canvas-side parameter editing
  - add any small cleanup only if the proof exposes a mismatch between pointer release and viewport settle timing

Important current read:
- unlike the feature-stack typed path, the canvas pointer path already looks architecturally correct
- this phase should stay small unless a proof demonstrates a real remaining mismatch

### Implementation target

This sub-phase should make one narrow behavior claim explicit and proved:

- canvas-side pointer editing ends comparison on release, so the old blue baseline does not linger after the user lets go

The minimum implementation shape should be:
1. keep pointer down as comparison start
2. keep pointer move as active comparison
3. keep pointer up as explicit settle
4. ensure the graph-scoped and UI interaction channels both clear at that release edge
5. avoid widening into typed-input or feature-stack work

### Expected file targets for 8.4

Primary implementation files:
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`

Likely supporting proof files:
- `src/app/spaghetti/canvas/PortView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- one existing viewport proof file only if a read-through assertion is still needed

### Verification bar for 8.4

This sub-phase is only done if it proves both:
- pointer release ends comparison
- the canvas-side release path clears both interaction channels

Required proof:
- one `PortView` control proof that:
  - pointer down starts interaction
  - pointer up ends it
- one `NodeView` read-through proof that:
  - canvas parameter editing starts both interaction channels
  - release clears both channels

Important rule:
- do not redesign `ParaSlider`
- do not reopen feature-stack typed semantics in this slice

Stop rule:
- stop once the canvas pointer-release path is explicitly proved or after the smallest code change needed to make that proof true

Prepared implementation read:
- strongest current likelihood:
  - this slice may land as proof-only
  - `PortView.tsx` already ends primitive drag interaction on pointer up
  - `NodeView.tsx` already maps the canvas numeric rows through the shared graph-parameter interaction seam
- that means the first implementation pass should not guess at a bug first
- it should add the missing read-through proof that canvas pointer release clears:
  - `isInteracting`
  - `browserInteractionGraphDocumentIds[graphDocumentId]`
- only if that proof fails should this slice widen into a runtime patch

Landed result:
- the slice landed as proof-only, matching the prepared implementation read
- `PortView.test.tsx` still serves as the control-level proof that primitive pointer rows start interaction on pointer down and end it on pointer up
- `NodeView.geometryMode.test.tsx` now locks the missing canvas read-through by driving the real primitive drag lane through `pointerdown`, `pointermove`, and `pointerup`
- that read-through proves canvas parameter editing clears both interaction channels on release:
  - `isInteracting`
  - `browserInteractionGraphDocumentIds[graphDocumentId]`
- no runtime patch was needed in `PortView.tsx` or `NodeView.tsx`, so this phase closes by proving the existing pointer-release settle seam is already the true explicit commit edge

## [x] Phase 8.5 - Auto Live Read-Through Proof And Verification

Goal:
- lock one end-to-end `Auto / Live` proof for explicit-commit cleanup and stop

Owns:
- the final viewport-facing proof that the old baseline disappears and the winner remains visible after explicit commit

Current live seam read:
- the producer-side work is now mostly proved in isolation:
  - `FeatureStackView.test.tsx` proves typed `Enter` clears both interaction channels
  - `NodeView.geometryMode.test.tsx` proves primitive pointer release clears both interaction channels
  - `useAppStore.ts` already owns explicit target-graph settle for `Build`
- the settled viewport-facing behavior is also partly proved in isolation:
  - `selectViewportResultState.test.ts` already has a settled two-branch selector proof that drops the old branch-local baseline and keeps the changed winner visible
  - `ViewerHost.test.tsx` already has a settled host proof that renders accepted auto-live draft as a `lastLoaded` base after interaction ends
- the remaining family risk is the handoff between those two proof layers:
  - there is not yet one focused `Auto / Live` read-through that starts from active branch-local comparison, then applies the same explicit-settle transition the real app uses, and proves the selector plus host collapse to one visible winner for that same graph
- that means the likely remaining gap is no longer "typed commit versus pointer release versus build" first
- it is "does the real producer-to-selector-to-host handoff actually wipe the old comparison baseline in the same graph shape the user sees"

Important current read:
- do not assume a new runtime bug before the read-through is added
- the phase should first join the already-landed producer proofs to the already-landed settled viewport proofs
- only if that joined read-through fails should this slice widen into selector or host code changes

File targets:
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/buildViewportResultSelectorOptions.test.ts`
- any adjacent targeted lifecycle test only if the joined read-through exposes a missing projection seam

Implementation target:
- add one focused `Auto / Live` read-through that:
  1. starts from the same two-branch branch-local comparison shape used by the active interaction proofs
  2. proves the active state still renders old-versus-new comparison for the changed branch only
  3. applies the same settled interaction transition the real app should produce after explicit commit
  4. proves the selector recipe collapses back to `base-only`
  5. proves the host renders only the winning changed geometry plus unchanged stable geometry with no retained baseline or overlay left behind

Expected proof shape:
- prefer extending the existing two-branch branch-local proof graph instead of inventing a new geometry story
- prefer one selector assertion and one host assertion for the same graph/state transition
- if the handoff depends on selector-input projection, add the smallest `buildViewportResultSelectorOptions.test.ts` assertion needed to prove the settled app-store state really reaches the selector as `isInteractionActive === false`

Verification bar:
- the existing typed-commit, pointer-release, and explicit-build producer proofs stay green
- one selector proof shows the same active comparison graph collapsing to a `base-only` settled winner after explicit commit
- one host proof shows the same settled winner reaching the viewer with:
  - no `baselineParts`
  - no `overlayParts`
  - `lastLoaded` base styling
- existing viewport proof files stay green after the new read-through lands

Done when:
- the family has one locked proof for the last explicit-commit cleanup path

Important rule:
- stop after the explicit-commit cleanup is proved
- do not widen into new family redesign
- do not reopen feature-stack or canvas control semantics in this slice unless the joined viewport read-through proves one of those producer contracts is still not actually reaching the selector

Stop rule:
- stop once explicit-commit cleanup is locked across:
  - producer proofs
  - selector read-through
  - host read-through
- if the new read-through passes without runtime changes, close the phase as proof-only

Landed result:
- the slice landed as proof-only, matching the implementation target and stop rule
- `buildViewportResultSelectorOptions.test.ts` now proves the remaining app-store projection seam for the same two-branch `Auto / Live` graph:
  - active comparison still reaches the selector as `isInteractionActive === true`
  - once UI interaction ends, the lingering graph interaction flag no longer keeps comparison alive
  - the selector collapses back to a `base-only` settled winner for that same graph
- `ViewerHost.test.tsx` now locks the same graph through both halves of the handoff:
  - active state still renders branch-local retained-baseline comparison
  - settled state removes `baselineParts` and `overlayParts` while keeping the changed winner visible as `lastLoaded` base
- no runtime patch was needed in selector, host, or store code, so the explicit-commit family now closes by proving the landed producer seams really do reach the viewport cleanup path
