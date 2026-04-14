# Worker Phase Worker 11 - Viewport Result Presentation Contract

## Doc Header

### Doc History
5. 2026-04-13 18:15:23: Added the explicit branch-local visual stability rule, locking the per-object presentation split for local edits so unchanged siblings remain fully loaded/base and visually stable while only the edited branch shows a dimmed retained baseline plus preview overlay
4. 2026-04-13 18:12:11: Tightened the `draft` contract so accepted settled draft/base must still show the whole loaded scene, including retained siblings such as untouched parallel extrudes, instead of collapsing visibility down to only the changed branch once everything has finished loading
3. 2026-04-13 18:10:39: Added the explicit `final` condition list, locking the final-mode gate, idle, drag, waiting, optional authoritative-comparison, and promotion behavior so the viewport contract now has the same condition shape across `auto / live`, `draft`, and `final`
2. 2026-04-13 17:55:41: Added the first explicit condition lists for `auto / live` and `draft`, turning the earlier suggested-answer sketch into a concrete viewport-state contract with named gates, drag-time behavior, post-release behavior, and no-broad-fallback rules before any further Worker 10 follow-up patches land
1. 2026-04-13 17:49:32: Created this standalone future Worker phase doc to freeze the intended viewport result-presentation contract before more live-preview patches land, turning the recent Worker 10 ambiguity into one explicit decision surface with suggested answers for `auto`, `draft`, and `final` behavior

### Purpose

This doc defines the intended viewport presentation contract for committed, draft, and preview-ready geometry.

Use it to answer:
- what the user should see while dragging a parameter
- what should remain visible after mouse release while authoritative preview is still pending
- when geometry should be treated as committed versus preview-only
- how `auto`, `draft`, and `final` viewport modes should differ

### Why This Phase Exists

Recent `Worker 10` work has improved the seams, but the target behavior is still not frozen tightly enough.

Current problem:
- local rebuild truth and viewport truth are getting closer
- but the presentation contract is still partly implicit
- that makes each patch feel risky because a locally-correct seam can still disagree with the intended user experience

This phase exists to lock the answers first, so later implementation can be judged against one stable contract instead of against shifting expectations discovered mid-patch.

### Vision Alignment

This contract follows `docs/Vision.md`, especially:
- graph-authored truth stays upstream of viewer presentation
- preview meshes stay downstream from geometry truth
- viewer presentation should not quietly become a second owner of geometry state

That means this doc is about presentation semantics only:
- what to show
- when to show it
- how to style it

It is not a reason to invent new geometry truth outside the accepted draft, accepted authoritative, or preview-ready lanes that already exist.

## Doc Body

## [ ] Worker 11 - Viewport Result Presentation Contract

### Header

Purpose:
- freeze one explicit viewport result-presentation contract before more Worker 10 follow-up patches

Owns:
- the user-visible contract for `last committed`, `preview mesh`, `preview b-rep`, and post-commit presentation

Does not own:
- Worker 9 invalidation or execution scope
- artifact generation
- acceptance storage schemas
- color-theme redesign beyond clarifying which existing presentation state should be used

### Current Ambiguity

Open questions that keep surfacing during Worker 10:
- when drag starts, should the old committed object remain visible underneath preview
- after release, should accepted draft geometry still look like preview or should it look committed
- should `draft` mode ever show blue committed geometry
- when `previewBrep` is ready, should it overlay the committed base or replace it visually

### Locked Conditions So Far

The following conditions are the currently recommended contract unless the user explicitly chooses a different behavior.

### Branch-Local Visual Stability Rule

When one branch is being edited inside a multi-object scene:
- unchanged objects remain fully loaded/base and keep ordinary `lastLoaded` presentation
- the edited branch keeps its pre-edit committed shape visible as a retained baseline
- that retained baseline for the edited branch may use a dimmed `lastLoaded` treatment to distinguish it from unchanged loaded objects
- only the edited branch receives live preview overlay treatment such as `previewMesh`

Core values:
- visual stability
  - unchanged objects should not visually churn during branch-local edits
- locality of preview
  - preview styling belongs only to the branch being edited
- retained baseline honesty
  - the edited branch should keep its pre-edit committed shape visible underneath the current preview
- loaded-scene completeness
  - when the scene is settled, every object that should be loaded remains visible, including retained siblings
- no collateral styling
  - unchanged siblings must not dim, turn yellow, disappear, or otherwise look "in edit" when they are not being edited
- no flicker
  - the viewport should not bounce unchanged objects through transient presentation states during a local edit

Concrete two-extrude example:
- if `Extrude 2` is being edited and `Extrude 1` is unchanged:
  - `Extrude 1` stays fully loaded/base and reads as `100%` blue
  - `Extrude 2` keeps its pre-edit retained baseline visible and may read as a dimmed `50%` blue baseline underneath the live preview
  - only `Extrude 2` receives the yellow `previewMesh` overlay
  - the viewport should not flicker or visually reclassify `Extrude 1`

### `auto / live` Conditions

Mode gate:
- viewport mode is `auto`
- browser execution policy is `live`

#### Condition 1 - Idle

When:
- no parameter drag is active
- no fresher preview result exists than the accepted current result

Show:
- current accepted committed/base geometry only
- style: `lastLoaded`

#### Condition 2 - Live Drag Started

When:
- user is actively dragging a parameter
- there is a pre-drag accepted committed result

Show:
- retained pre-drag committed base
- style: `lastLoaded`

And if affected preview geometry exists:
- overlay only the affected changed geometry
- style: `previewMesh`

Do not:
- dim unchanged siblings
- paint untouched retained geometry yellow
- let unchanged siblings flicker or otherwise leave their ordinary loaded/base presentation

#### Condition 3 - Live Drag Started, But Narrowed Preview Not Ready Yet

When:
- drag is active
- retained committed base exists
- only broad whole-scene draft fallback exists
- no narrowed affected-only overlay is ready yet

Show:
- retained committed base only
- style: `lastLoaded`

Do not:
- draw the broad whole-scene yellow fallback

#### Condition 4 - Mouse Released, Draft Accepted, Authoritative Not Ready

When:
- drag has ended
- current draft result is now the accepted current result
- no newer authoritative-ready result exists yet

Show:
- accepted current result as the main base
- style: `lastLoaded`

Do not:
- keep showing yellow `previewMesh`

#### Condition 5 - Authoritative Preview Ready After Release

When:
- drag has ended
- accepted current result exists
- a newer authoritative-ready result exists but is not yet the committed base

Show:
- accepted current base as `lastLoaded`
- newer authoritative-ready comparison as overlay
- style: `previewBrep`

#### Condition 6 - Promotion Complete

When:
- authoritative result becomes the new committed accepted result

Show:
- new committed geometry only
- style: `lastLoaded`

Short story:
1. Idle: blue base.
2. Dragging: blue old base plus yellow changed-only overlay.
3. Dragging before narrow overlay exists: blue old base only.
4. Released, waiting: blue new accepted base.
5. B-rep ready: blue accepted base plus green authoritative overlay.
6. Promoted: blue new final base.

### `draft` Conditions

Mode gate:
- viewport mode is `draft`

#### Condition 1 - Idle

When:
- no parameter drag is active
- an accepted current draft result exists

Show:
- accepted current draft geometry only
- style: `lastLoaded`

Loaded-scene rule:
- this settled draft/base must include every object that should currently be loaded
- retained siblings such as an untouched `Extrude 1` must remain visible alongside the changed branch
- settling draft/base must not collapse the scene to only the branch that just changed

Do not:
- keep idle accepted draft yellow just because the mode is `draft`

#### Condition 2 - Live Drag Started

When:
- user is actively dragging a parameter
- there is a pre-drag accepted draft result

Show:
- retained pre-drag accepted draft base
- style: `lastLoaded`

And if affected live draft preview exists:
- overlay only the affected changed geometry
- style: `previewMesh`

Do not:
- dim unchanged siblings
- paint untouched retained geometry yellow
- let unchanged siblings flicker or otherwise leave their ordinary loaded/base presentation

#### Condition 3 - Live Drag Started, But Narrowed Preview Not Ready Yet

When:
- drag is active
- retained accepted draft base exists
- only broad whole-scene draft fallback exists
- no narrowed affected-only overlay is ready yet

Show:
- retained accepted draft base only
- style: `lastLoaded`

Do not:
- draw the broad whole-scene yellow fallback

#### Condition 4 - Mouse Released, New Draft Accepted

When:
- drag has ended
- current draft result is now the accepted current draft result
- no fresher comparison result exists

Show:
- accepted current draft geometry only
- style: `lastLoaded`

Do not:
- keep showing `previewMesh`

#### Condition 5 - Newer Draft Comparison Exists

When:
- drag has ended
- accepted current draft result exists
- a fresher draft-side comparison result exists and we intentionally want to compare it

Suggested answer:
- usually do not show a separate overlay here
- prefer replacing the base once the new accepted draft is current

Reason:
- `draft` mode is already the draft-truth mode
- adding a second draft-versus-draft overlay will likely feel noisy unless there is a very explicit compare state

#### Condition 6 - No Draft Result Available Yet

When:
- draft mode is selected
- there is no accepted current draft result yet

Show:
- nothing, or the existing empty/placeholder viewport contract

Short story:
1. Idle: blue accepted draft base.
2. Dragging: blue old draft base plus yellow changed-only overlay.
3. Dragging before narrow overlay exists: blue old draft base only.
4. Released: blue new accepted draft base.
5. No persistent yellow after commit.
6. All loaded objects that belong in the accepted current draft scene remain visible after settle.

Key rule:
- `draft` means "show draft truth"
- not "everything draft stays styled as preview forever"

### `final` Conditions

Mode gate:
- viewport mode is `final`

#### Condition 1 - Idle

When:
- no parameter drag is active
- an accepted current authoritative/final result exists

Show:
- accepted committed/final geometry only
- style: `lastLoaded`

Do not:
- show draft overlays
- show `previewMesh`

#### Condition 2 - Live Drag Started

When:
- user is actively dragging a parameter
- a pre-drag accepted authoritative/final result exists
- draft/live work may be happening in the background

Show:
- retained pre-drag committed/final base only
- style: `lastLoaded`

Do not:
- show yellow live draft overlay
- switch the viewport into draft-style preview just because live work started

#### Condition 3 - Live Drag Started, But New Final-Comparable Result Is Not Ready Yet

When:
- drag is active
- retained final base exists
- only draft/live preview exists
- no authoritative preview-ready result exists yet

Show:
- retained final base only
- style: `lastLoaded`

Do not:
- draw broad whole-scene draft fallback
- draw changed-only yellow overlay

#### Condition 4 - Mouse Released, Authoritative Preview Not Ready Yet

When:
- drag has ended
- no newer authoritative preview-ready result exists yet
- the accepted authoritative/final result is still the current final truth

Show:
- accepted committed/final base only
- style: `lastLoaded`

Do not:
- show draft-visible accepted result
- show `previewMesh`

#### Condition 5 - Authoritative Preview Ready Comparison Exists

When:
- drag has ended or a build has advanced
- a newer authoritative preview-ready result exists
- we intentionally allow final-mode comparison behavior

Suggested answer:
- show accepted committed/final base as `lastLoaded`
- overlay newer authoritative-ready comparison as `previewBrep`

If final-mode comparison is not explicitly allowed:
- keep showing committed/final base only

Recommended default:
- use strict final by default
- allow `previewBrep` in `final` only when there is an explicit product reason

#### Condition 6 - Promotion Complete

When:
- authoritative preview-ready result becomes the new accepted final result

Show:
- new committed/final geometry only
- style: `lastLoaded`

Short story:
1. Idle: blue final base.
2. Dragging: still blue final base only.
3. Waiting for final-capable update: still blue final base only.
4. Optional comparison state only if explicitly allowed: blue base plus green `previewBrep`.
5. Promotion complete: blue new final base.

Key rule:
- `final` means "show authoritative settled truth"
- not "show whatever newest draft-visible thing exists"

### Recommended Presentation-State Mapping

Suggested mapping:
- `lastLoaded`
  - use for the visible committed/base geometry in idle states
  - also use for the frozen pre-drag retained base during active interaction
- `previewMesh`
  - use only for active interaction preview geometry
  - do not use for accepted idle draft geometry after release
- `previewBrep`
  - use only for newer authoritative-ready comparison overlay
  - do not use as the normal committed base state

### Recommended State Story

The intended story should be:
1. Idle: current accepted geometry shows as `lastLoaded`
2. Drag starts: old committed geometry stays as `lastLoaded`
3. During drag: affected current geometry overlays as `previewMesh`
4. Release before authoritative-ready: accepted current geometry returns to `lastLoaded`
5. Authoritative-ready arrives: newer comparison overlays as `previewBrep`
6. Promotion completes: new final geometry becomes ordinary `lastLoaded`

### Main Consequence For Worker 10

If this contract is accepted, then Worker 10 should be judged by these rules:
- `Phase 1` was about preserving the frozen pre-drag committed base
- `Phase 2` is about narrowing preview overlay membership to affected work only
- the next remaining follow-up is not "more yellow preview logic"
- the next remaining follow-up is normalizing accepted post-release draft presentation back to committed/base styling

### First Follow-Up Work If This Contract Stands

The next likely implementation slices become:
1. Worker 10 follow-up: make accepted post-release draft geometry present as committed/base instead of `previewMesh`
2. Worker 10 follow-up: verify `previewBrep` overlay behavior against the locked comparison rule
3. Worker 9 Phase 3: resume retained-sibling recomposition work once viewport presentation is no longer obscuring the truth

### Verification Questions

Future implementation should be considered correct only if all of these answer `yes`:
- while dragging one extrude in `auto`, does the old committed shape remain visible underneath
- while dragging one extrude in `auto`, does only the changed branch turn yellow
- after release in `auto`, does the accepted current draft stop looking like live preview
- in `draft` idle state, does accepted current draft read as settled rather than perpetually previewing
- in `final`, does drag-time live work leave the viewport on final/base truth instead of draft preview
- in `final`, does the viewport avoid draft-only overlay leakage

### Stop Rule

This doc is complete when:
- the intended viewport contract is explicit enough that later Worker 10 or Worker 11 code patches can be judged against it directly
- the suggested answers above are either accepted as-is or revised intentionally

This doc should not turn into:
- a code patch checklist
- a color-system redesign
- a second Worker 9 invalidation plan
