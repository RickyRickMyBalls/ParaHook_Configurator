# Environment Phase Environment-2 - Photoshop-Like Grade Controls, Persistence, And Workflow Polish

## Doc Header

### Doc History
6. 2026-04-19 10:18:08: Added the `Environment-2 / Phase 5` cleanup handoff note so this original Phase 1 through Phase 4 scaffold doc no longer reads as the final closeout source after review reopened grade-fidelity, local-HDRI persistence, and closeout-language cleanup in a dedicated follow-on doc
5. 2026-04-19 00:07:26: Implemented the phase 4 recall and A/B compare helpers so the remembered environment look can now be captured, recalled, and compared against the persisted grade/workflow seam without creating a second scene owner, and closed `Environment-2` honestly after the final workflow polish landed
4. 2026-04-19 00:00:23: Implemented the phase 3 persistence bridge so `Environment-2` now saves and restores the active environment look, keeps `environmentGrade` and the scene/source settings together in the existing view persistence seam, normalizes older saved views without the nested grade state, and leaves `Phase 4` as the next legal cut
3. 2026-04-18 23:52:19: Implemented the phase 2 visible grade surface so `Environment-2` now exposes the Photoshop-like slider family, keeps the grading seam downstream from scene and HDRI ownership, and leaves persistence, recall, and compare helpers for the next legal cuts
2. 2026-04-18 23:44:14: Implemented the phase 1 grade seam so `Environment-2` now carries explicit nested post-look grade state, the scene-versus-grade split stays downstream from the locked startup baseline, and the full slider surface remains deferred to the next phase
1. 2026-04-18 23:36:37: Created this standalone future doc for `Environment-2` so the remaining environment lane now has one implementation-ready planning surface for post-look grading, explicit scene-versus-grade ownership, persistence, recall, compare helpers, and final workflow polish

### Purpose

This doc is the standalone future execution surface for `Environment-2`.

Use it to answer:
- how the later Photoshop-like grade layer should fit after `Environment-1` has already made scene and HDRI behavior honest
- how scene controls should stay separate from final-image grading controls
- how persistence, recall, and compare helpers should be phased without widening into new scene-runtime ownership
- how the remaining environment workflow should become production-ready in small Codex-sized cuts

### Scope

This family phase covers:
- Photoshop-like grade controls for the active environment look
- the explicit split between scene-state tuning and final-image grading
- per-viewport environment persistence where it belongs
- preset recall and compare helpers
- workflow polish for a finished day-to-day environment tuning loop

This family phase does not cover:
- the first baseline-lighting repair
- the first named preset language
- the first HDRI/runtime seam
- browseable HDRI catalog ownership
- any reopening of the locked startup baseline

## Doc Body

### Summary

`Environment-2` is the remaining open environment lane after `Environment-1` closed out the startup-baseline, preset, Browser, viewport, and HDRI runtime story.

The purpose of this lane is not to keep widening scene ownership.
The purpose is to add the later post-look grading layer and the workflow polish that only make sense once the underlying environment runtime is already honest.

The grading layer should feel like a Photoshop-style adjustment stack for the chosen environment look, but it should remain clearly separated from the scene-state controls that `Environment-1` already owns.

### Why This Phase Exists

The environment family still needs a later grading and polish layer so users can finish a look without confusing that work with the scene itself.

This doc exists to keep that work honest by separating:
- the already-shipped scene and HDRI controls
- the later environment-grade controls
- persistence and compare polish that belongs on top of a real runtime

### Current Live Read

- `Environment-1` is fully closed out
- the startup scene baseline remains locked
- the phase 1 grade seam is implemented
- the phase 2 slider surface is live
- persistence is implemented through the existing view/workspace seam
- the recall and quick A/B compare helpers are now implemented
- review reopened a dedicated `Environment-2 / Phase 5` cleanup doc for grade-fidelity, local-HDRI persistence, and final closeout language
- this original doc should now be read as the shipped scaffold record for `Phase 1` through `Phase 4`, not the final Environment-2 closeout source

Current cleanup source:
- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-2 Phase 5 - Cleanup, Grade Fidelity, And Persistence Honesty.md`

### Phase Contract

This lane should stay narrow:
- grading belongs after the scene system is already stable
- persistence belongs after the grade seam is real
- compare helpers belong after the user can actually make a meaningful before/after choice

Important rule:
- do not widen this lane back into the locked startup baseline
- do not make `Environment-2` a second scene-owner
- do not let persistence or compare logic become a hidden source of scene truth

## Vision

### Vision Summary

`Environment-2` should finish the environment family by adding the later Photoshop-like grading layer plus the persistence and workflow polish that make the surface feel complete.

The core idea is:
- keep scene and HDRI ownership honest
- keep the post-look grading layer clearly downstream from that scene ownership
- make the environment workflow feel durable enough for everyday use

### Human Level Goals

- `Environment-2-HLG-1. Add Photoshop-Like Grade Controls`
- `Environment-2-HLG-2. Keep Scene Controls Separate From Final Image Grading`
- `Environment-2-HLG-3. Add Persistence For Environment Look Workflows`
- `Environment-2-HLG-4. Add Recall And Compare Helpers`
- `Environment-2-HLG-5. Finish A Production-Ready Environment Workflow`

## Wishlist Organization

### High Level Goals

- [x] `Environment-2-HLG-1. Add Photoshop-Like Grade Controls`
- [x] `Environment-2-HLG-2. Keep Scene Controls Separate From Final Image Grading`
- [x] `Environment-2-HLG-3. Add Persistence For Environment Look Workflows`
- [x] `Environment-2-HLG-4. Add Recall And Compare Helpers`
- [x] `Environment-2-HLG-5. Finish A Production-Ready Environment Workflow`

### Codex Level Goals

- [ ] CLG 1. Add a dedicated grading seam that sits after the already-honest environment scene system.
- [ ] CLG 2. Keep scene-state tuning and final-image grading on separate ownership tracks.
- [ ] CLG 3. Persist environment look state in a way that does not rewrite the locked startup baseline.
- [ ] CLG 4. Add recall and compare helpers only after the grading surface can already produce meaningful looks.
- [ ] CLG 5. Finish the workflow so the surface feels ready for ordinary use instead of like a partially exposed tool.

### `Environment-2` Phase 1

- [x] add the post-look grading seam
- [x] define the explicit split between scene controls and grade controls
- [x] keep the locked startup baseline out of scope
- [x] advance `Environment-2-HLG-2`

### `Environment-2` Phase 2

- [x] land the Photoshop-like grade sliders
- [x] cover exposure, contrast, highlights, shadows, whites, blacks, temperature, tint, and saturation
- [x] keep the controls attached to the active environment look, not the baseline scene
- [x] advance `Environment-2-HLG-1`

### `Environment-2` Phase 3

- [x] add environment-look persistence
- [x] keep per-viewport behavior honest where it matters
- [x] preserve the scene-versus-grade split while saving and restoring
- [x] advance `Environment-2-HLG-3`

### `Environment-2` Phase 4

- [x] add recall and quick A/B compare helpers
- [x] finish the workflow polish that makes the environment loop feel production-ready
- [x] keep compare behavior downstream from the grade seam
- [x] advance `Environment-2-HLG-4`
- [x] advance `Environment-2-HLG-5`

## [x] `Environment-2` - `Phase 1 - Add The Post-Look Grading Seam And Split The Owners`

### Phase 1 Summary

#### Purpose

Create the dedicated seam that lets later grading live after the scene system instead of bleeding back into it.

#### Owns

- the explicit split between scene-state controls and final-image grading
- the first real grading seam for the environment family
- ownership boundaries that keep the locked startup baseline intact

#### Does Not Own

- the full Photoshop-like slider surface
- persistence or compare helpers
- any Environment-1 runtime widening

#### Current Live Read

- the environment scene system is already honest after `Environment-1`
- the explicit post-look grade seam now exists downstream from the scene state
- the visible slider surface still stays out of phase 1
- this Phase 1 through Phase 4 scaffold is shipped, with `Phase 5` now owning cleanup follow-through

#### First Pass Decisions

- make the grade seam explicit before adding a single visible slider
- keep scene controls and grade controls on different ownership tracks
- treat the locked startup baseline as out of scope

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Define the grading seam that sits after the environment scene state
2. Separate scene ownership from final-image grade ownership
3. Keep the locked baseline scene unchanged

#### Likely Files

- environment family planning docs under `docs/Human-Plans/Architecture/View-Toolbar/Environment/`
- later runtime surfaces that already own environment scene state

#### No-Widening Rule

- do not add the full slider family yet
- do not add persistence yet
- do not reopen Environment-1 scene ownership

#### Checklist

- [x] define the explicit scene-versus-grade split
- [x] add the environment grading seam contract
- [x] preserve the locked startup baseline

#### Verification Shape

Minimum verification for this phase should cover:
- the docs make the ownership split explicit
- the later grade controls are clearly downstream from the scene system
- the baseline scene remains preserved

#### Done Shape

`Phase 1` is done when the family has one honest grading seam and the docs clearly say what it owns and what it does not own.

## [x] `Environment-2` - `Phase 2 - Land Photoshop-Like Grade Sliders`

### Phase 2 Summary

#### Purpose

Add the visible slider surface that matches the later grading seam.

#### Owns

- Photoshop-like grade sliders
- exposure, contrast, highlights, shadows, whites, blacks, temperature, tint, and saturation
- the active environment look as the tuning target

#### Does Not Own

- scene-state tuning
- persistence or compare helpers
- baseline scene retuning

#### Current Live Read

- this phase is now implemented on top of the real grade seam from `Phase 1`
- the user-facing slider family exists as one coherent surface
- this Phase 1 through Phase 4 scaffold is shipped, with `Phase 5` now owning cleanup follow-through

#### First Pass Decisions

- keep the slider family together instead of scattering it across unrelated controls
- make the visible names match familiar image-grade expectations
- keep the controls attached to the active environment look, not to the locked startup baseline

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Add the Photoshop-like grade slider family
2. Connect the sliders to the grading seam
3. Keep the baseline scene separate from the active grading target

#### Likely Files

- future environment runtime surfaces that own grade state
- the View toolbar or its environment-grade child surface

#### No-Widening Rule

- do not add persistence yet
- do not add compare helpers yet
- do not blend scene controls into the grade panel

#### Checklist

- [x] add the grade slider surface
- [x] cover the full slider set
- [x] keep the scene-vs-grade split visible

#### Verification Shape

Minimum verification for this phase should cover:
- the grading sliders exist as one coherent user-facing surface
- the sliders target the environment grade layer instead of the scene owner

#### Done Shape

`Phase 2` is done when the later grading controls exist and are clearly not pretending to own scene state.

## [x] `Environment-2` - `Phase 3 - Add Persistence For Environment Look Workflows`

### Phase 3 Summary

#### Purpose

Make the environment look durable enough that users can come back to it later.

#### Owns

- persistence for environment look workflows
- per-viewport behavior where it truly matters
- save and restore behavior for the active grading state

#### Does Not Own

- the slider surface itself
- compare helpers
- any new scene-baseline ownership

#### Current Live Read

- persistence now runs through the existing view/workspace seam
- the stored look still remains downstream from the environment scene system
- older saved views without the nested grade seam normalize safely on load
- this Phase 1 through Phase 4 scaffold is shipped, with `Phase 5` now owning cleanup follow-through

#### First Pass Decisions

- persist the environment look without turning it into a second scene source
- keep any viewport-specific behavior explicit
- avoid saving the locked startup baseline as if it were user-authored grading

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Add persistence for the active environment look
2. Preserve the scene-versus-grade ownership split while saving and restoring
3. Keep viewport-specific behavior explicit where appropriate

#### Likely Files

- environment look state surfaces
- persistence storage surfaces
- future View toolbar grade-state wiring

#### No-Widening Rule

- do not add compare helpers yet
- do not reopen the baseline scene
- do not let persistence become the hidden owner of grading truth

#### Checklist

- [x] persist the active environment look
- [x] keep per-viewport behavior explicit where needed
- [x] preserve the grade-vs-scene split during restore

#### Verification Shape

Minimum verification for this phase should cover:
- the environment look survives a save and restore path
- persistence does not rewrite the locked startup baseline
- the grade layer remains downstream from the scene system

#### Done Shape

`Phase 3` is done when the environment look can be recalled from persistence without becoming a second scene owner.

## [x] `Environment-2` - `Phase 4 - Add Recall And Quick A/B Compare Helpers`

### Phase 4 Summary

#### Purpose

Finish the environment workflow with the recall and compare tools users expect when tuning a look.

#### Owns

- preset recall behavior
- quick A/B compare helpers
- production-ready workflow polish

#### Does Not Own

- the grading seam itself
- the baseline scene
- any further family widening

#### Current Live Read

- these helpers are implemented on top of the persisted environment look state
- compare behavior stays downstream from the grade layer instead of becoming a scene owner
- this Phase 1 through Phase 4 scaffold is shipped, with `Phase 5` now owning cleanup follow-through

#### First Pass Decisions

- keep compare helpers quick and readable
- make recall behavior obvious
- finish the workflow so the surface feels complete for ordinary use

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. Add recall helpers for the saved environment look
2. Add quick A/B compare behavior where it helps the workflow
3. Polish the surface until it reads as production-ready

#### Likely Files

- environment workflow surfaces
- compare helper wiring
- any remaining environment-grade presentation surfaces

#### No-Widening Rule

- do not reopen scene controls
- do not add new grading categories beyond the ones already planned
- do not let compare logic become a new owner for the look itself

#### Checklist

- [x] add recall helpers
- [x] add quick A/B compare helpers
- [x] finish the production-ready workflow polish

#### Verification Shape

Minimum verification for this phase should cover:
- the user can recall a stored look
- the user can compare looks quickly
- the workflow feels finished enough for ordinary use

#### Done Shape

`Phase 4` is done when the family has a coherent grading workflow that can be saved, recalled, and compared without blurring ownership boundaries.

`Phase 1` through `Phase 4` are shipped scaffold history. `Environment-2 / Phase 5` now owns cleanup follow-through before the family should be treated as fully polished.
