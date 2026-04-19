# Environment Phase Environment-2 Phase 5 - Cleanup, Grade Fidelity, And Persistence Honesty

## Doc Header

### Doc History
1. 2026-04-19 10:18:08: Created this standalone `Environment-2 / Phase 5` cleanup plan after review found that the first four `Environment-2` phases landed the right grade-state scaffold but still need cleanup for grading fidelity, persistence honesty, and final closeout language before the environment family should be treated as fully polished

### Purpose

This doc is the dedicated cleanup execution surface for `Environment-2 / Phase 5`.

Use it to answer:
- how to turn the shipped Environment-2 grade surface from a useful scaffold into a more honest production workflow
- where local HDRI persistence, per-viewport wording, and grade-runtime fidelity should be repaired
- how to split the cleanup into small internal phases without reopening Environment-1 scene ownership

### Scope

This cleanup phase covers:
- grade-control behavior that currently reads more Photoshop-shaped than Photoshop-like
- persistence honesty for repo-backed and locally browsed HDRI/EXR environments
- doc and UI wording cleanup where the shipped behavior is global, temporary, or approximate
- final verification and closeout for the Environment-2 cleanup lane

This cleanup phase does not cover:
- changing the locked startup environment baseline
- moving HDRI browsing ownership out of `Catalog`
- replacing the Environment-owned active source contract
- adding a new broad environment family phase unless the cleanup reveals a larger missing family

## Doc Body

### Summary

`Environment-2 / Phase 1` through `Phase 4` landed useful structure: the nested `environmentGrade` seam, visible grade controls, persistence bridge, and remembered-look helpers are all real.

The review read is more nuanced than the closeout wording:
- the state ownership shape is good
- the visible slider surface exists
- the grade math is still approximate
- local HDRI persistence can restore a dead object URL after reload
- the docs currently overstate some behavior as per-viewport and production-ready

`Phase 5` exists to clean that up without throwing away the scaffold.

### Current Live Read

- Environment grade state lives in `ViewSettings.environmentGrade`
- active environment source state lives in `ViewSettings.environmentSource`
- repo HDRI/EXR apply paths can restore because they point at stable repo assets
- local browsed HDRI/EXR apply paths currently store a temporary object URL
- persistence currently saves one global UI prefs view snapshot
- the viewer currently maps several grade sliders into renderer exposure plus a CSS filter approximation
- recall and A/B compare helpers are in-memory workflow helpers, not a second persisted scene owner

### Cleanup Contract

This cleanup should keep the shipped ownership model:
- `Environment` owns the active environment source and grade look
- `Catalog` owns browseable HDRI/EXR entries
- the viewer applies the chosen look
- Browser remains a downstream read/control surface

Important rule:
- keep cleanup narrow and honest
- do not reopen the Environment-1 lighting, preset, Browser, or HDRI runtime ladder
- do not silently relabel approximate behavior as finished behavior

## Vision

### Vision Summary

`Environment-2 / Phase 5` should make the landed Environment-2 workflow honest enough to trust.

The goal is not to start over.
The goal is to keep the good scaffold and repair the places where the current implementation overclaims polish.

### Human Level Goals

- `Environment-2-Phase5-HLG-1. Make Grade Controls Behave More Honestly`
- `Environment-2-Phase5-HLG-2. Make Persistence Honest For Repo And Local Environments`
- `Environment-2-Phase5-HLG-3. Clean Up Overclaimed Per-Viewport And Production-Ready Language`
- `Environment-2-Phase5-HLG-4. Close Environment-2 With Focused Proof Instead Of Assumption`

## Wishlist Organization

### High Level Goals

- [ ] `Environment-2-Phase5-HLG-1. Make Grade Controls Behave More Honestly`
- [ ] `Environment-2-Phase5-HLG-2. Make Persistence Honest For Repo And Local Environments`
- [ ] `Environment-2-Phase5-HLG-3. Clean Up Overclaimed Per-Viewport And Production-Ready Language`
- [ ] `Environment-2-Phase5-HLG-4. Close Environment-2 With Focused Proof Instead Of Assumption`

### Codex Level Goals

- [ ] CLG 1. Audit the current grade runtime and either improve the slider behavior or rename the exposed behavior so users are not misled by Photoshop-like wording.
- [ ] CLG 2. Repair local HDRI/EXR persistence so temporary object URLs are not restored as durable environment sources.
- [ ] CLG 3. Make the persistence story explicit as global or per-viewport, then align code, docs, and UI language to that truth.
- [ ] CLG 4. Add focused proof for the cleanup path and update closeout docs only after the repaired behavior is verified.

### `Environment-2 Phase 5.1`

- [ ] audit the grade slider behavior from toolbar state through viewer application
- [ ] decide which sliders can be improved in this cleanup pass
- [ ] make any remaining approximate sliders read honestly in UI/docs
- [ ] `Environment-2-Phase5-HLG-1. Make Grade Controls Behave More Honestly`

### `Environment-2 Phase 5.2`

- [ ] distinguish durable repo HDRI/EXR sources from temporary local browsed object URLs
- [ ] prevent dead local object URLs from being restored as valid persisted environment sources
- [ ] settle whether Environment-2 persistence is global or per-viewport for the current product shape
- [ ] `Environment-2-Phase5-HLG-2. Make Persistence Honest For Repo And Local Environments`
- [ ] `Environment-2-Phase5-HLG-3. Clean Up Overclaimed Per-Viewport And Production-Ready Language`

### `Environment-2 Phase 5.3`

- [ ] update the Environment index and Environment-2 closeout language after cleanup lands
- [ ] add focused tests for the repaired grade and persistence behavior
- [ ] verify the cleanup lane and close `Environment-2 / Phase 5` honestly
- [ ] `Environment-2-Phase5-HLG-4. Close Environment-2 With Focused Proof Instead Of Assumption`

## [ ] `Environment-2 / Phase 5.1` - `Grade Runtime Honesty And Slider Fidelity`

### Phase 5.1 Summary

#### Purpose

Make the visible grade controls more honest by checking what each slider actually does and tightening the implementation or language where needed.

#### Owns

- the runtime behavior of the Environment-2 grade controls
- the honest relationship between slider names and visual output
- focused proof that grade edits remain downstream from scene and HDRI ownership

#### Does Not Own

- new scene-lighting controls
- new HDRI catalog browsing behavior
- a wholesale replacement of the renderer stack

#### Current Live Read

- `environmentGrade.exposure` maps to renderer tone mapping exposure
- contrast and saturation map through a CSS canvas filter
- highlights, shadows, whites, blacks, temperature, and tint are currently approximate filter inputs
- the UI currently presents the full family as Photoshop-like grade controls

#### First Pass Decisions

- keep `Exposure`, `Contrast`, and `Saturation` as the likely stable first-class controls
- inspect whether tonal sliders should be improved or explicitly labeled as broad grade offsets
- avoid introducing expensive image-processing machinery unless the existing viewer architecture can support it cleanly

### Phase 5.1 Implementation Spec

#### Exact First Code Cut

1. Audit `ViewToolbar`, `uiPrefsStore`, `viewSettingsTypes`, and `Viewer` grade handling.
2. Improve low-risk grade mappings where the current seam can support them.
3. Rename or clarify any controls that remain approximate.
4. Add focused tests that prove the chosen behavior.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/components/ViewToolbar.tsx`
- `src/viewer/Viewer.ts`
- focused tests near the files above

#### No-Widening Rule

- do not move scene lights or HDRI source controls into this phase
- do not make grade controls mutate presets directly
- do not claim true Photoshop tonal adjustment unless the runtime actually supports it

#### Implementation Risks

- CSS filters may not be expressive enough for true tonal-range controls
- changing slider labels can affect existing tests and user expectations
- stronger grade math may have rendering cost or browser support implications

#### Checklist

- [ ] audit current grade slider behavior
- [ ] improve or relabel approximate tonal controls
- [ ] preserve the scene-versus-grade state split
- [ ] add focused grade behavior proof

#### Verification Shape

Minimum verification should cover:
- grade edits still update `environmentGrade`
- source/HDRI ownership remains unchanged by grade edits
- viewer output receives the intended grade changes

#### Done Shape

`Phase 5.1` is done when the grade surface no longer overclaims what the runtime actually applies.

## [ ] `Environment-2 / Phase 5.2` - `Persistence And Local HDRI Honesty`

### Phase 5.2 Summary

#### Purpose

Repair persistence behavior so durable environment sources restore cleanly and temporary local HDRI/EXR selections do not come back as broken saved looks.

#### Owns

- local HDRI/EXR persistence honesty
- global versus per-viewport persistence wording and behavior alignment
- normalization of stale or temporary environment source records

#### Does Not Own

- adding a full asset-import library for local HDRIs
- moving Catalog ownership
- replacing the existing `uiPrefs` persistence bridge wholesale

#### Current Live Read

- repo-backed HDRI/EXR assets resolve to stable app paths
- locally browsed HDRI/EXR files resolve to temporary object URLs
- the persistence bridge stores one global `view` snapshot
- the docs currently refer to per-viewport persistence in places where the code does not prove per-viewport persistence

#### First Pass Decisions

- keep repo-backed HDRI/EXR persistence durable
- treat local browsed HDRI/EXR paths as session-only unless a real import/save path exists
- align docs and UI language to the current global persistence behavior unless the implementation is widened intentionally

### Phase 5.2 Implementation Spec

#### Exact First Code Cut

1. Add source-kind honesty for persisted environment sources.
2. Normalize temporary local object URLs away from persisted startup restore.
3. Decide and document whether current environment persistence is global or per-viewport.
4. Add focused tests for repo-backed restore, local temporary restore, and legacy normalization.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsPersistence.ts`
- `src/app/store/useUiPrefsPersistenceBridge.ts`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/store/useUiPrefsPersistenceBridge.test.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- Environment docs under `docs/Human-Plans/Architecture/View-Toolbar/Environment/`

#### No-Widening Rule

- do not build a full local HDRI asset manager in this cleanup phase
- do not make Catalog the owner of active environment state
- do not claim per-viewport persistence unless the code actually persists per viewport

#### Implementation Risks

- existing local HDRI flows may need clear user-facing fallback language
- normalization must not erase valid repo HDRI/EXR environments
- tests should avoid relying on real browser object URL durability

#### Checklist

- [ ] distinguish durable environment source records from temporary local ones
- [ ] prevent dead local object URLs from restoring as active HDRIs
- [ ] align persistence wording with implementation truth
- [ ] add focused persistence proof

#### Verification Shape

Minimum verification should cover:
- repo-backed HDRI/EXR restores as active environment state
- local browsed HDRI/EXR does not restore as a broken `blob:` source
- docs and tests agree on global versus per-viewport persistence

#### Done Shape

`Phase 5.2` is done when persistence restores only honest durable environment looks and temporary local HDRIs fail gracefully or reset clearly.

## [ ] `Environment-2 / Phase 5.3` - `Closeout Proof And Family Language Cleanup`

### Phase 5.3 Summary

#### Purpose

Close the cleanup lane by updating the family docs, final closeout wording, and proof shape after `Phase 5.1` and `Phase 5.2` have made the behavior honest.

#### Owns

- final Environment-2 cleanup closeout
- Environment index status language
- cleanup verification notes
- changelog and doc-log tracking when implementation lands

#### Does Not Own

- implementing the grade-runtime changes from `Phase 5.1`
- implementing persistence changes from `Phase 5.2`
- starting a new Environment-3 lane unless cleanup reveals a truly separate future family

#### Current Live Read

- the current index marks Environment-2 complete through Phase 4
- this Phase 5 doc reopens the Environment-2 cleanup lane
- final closeout should wait until the cleanup work lands

#### First Pass Decisions

- keep this as the closeout phase, not the place where hidden implementation work happens
- make the final docs say exactly what shipped
- leave future grade ambitions visible if they outgrow this cleanup phase

### Phase 5.3 Implementation Spec

#### Exact First Code Cut

1. Review the completed `Phase 5.1` and `Phase 5.2` behavior.
2. Update Environment docs so current reality, wishlist status, and closeout language match the repaired behavior.
3. Add final focused verification notes and required tracking entries.
4. Close `Environment-2 / Phase 5` only when the cleanup has actually landed.

#### Likely Files

- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`
- this Phase 5 cleanup doc
- `docs/CHANGELOG.md` when implementation lands
- `docs/Doc-Log.md` for doc changes

#### No-Widening Rule

- do not use closeout to hide unresolved grade fidelity or persistence gaps
- do not mark Environment-2 fully complete until cleanup verification exists
- do not rewrite older shipped history; append the new truth

#### Implementation Risks

- closeout wording can drift back into overclaiming production polish
- cleanup may reveal a future phase that should stay open rather than being forced closed

#### Checklist

- [ ] update current-reality language after cleanup implementation
- [ ] update checklist statuses honestly
- [ ] record focused verification
- [ ] close `Environment-2 / Phase 5` only after proof exists

#### Verification Shape

Minimum verification should cover:
- the index points to the finished cleanup truth
- required changelog/doc-log entries exist for implemented cleanup
- the final status does not overclaim grade fidelity or persistence scope

#### Done Shape

`Phase 5.3` is done when Environment-2 has a verified cleanup closeout and the family docs describe the landed behavior without pretending the Phase 4 scaffold was more complete than it was.
