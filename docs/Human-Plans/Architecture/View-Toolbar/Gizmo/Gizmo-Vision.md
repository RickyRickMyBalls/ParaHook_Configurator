# Gizmo Vision

## Doc Header

### Doc History
3. 2026-04-14 15:10:34: Added an explicit `Generation 2` direction for orientation-gizmo visual depth, making the next-stage helper carry-forward include connector/cage lines between the snap spheres so the implied cube sides read clearly instead of leaving that visual completeness detail as an unplaced wishlist item
2. 2026-04-14 15:05:09: Reframed this vision around explicit gizmo `generations`, making the current shared transform manipulator read as `Generation 1` and adding a small generation ladder plus boundary rule so future gizmo quality and capability work can be organized without smuggling later behavior into the current baseline
1. 2026-04-14 15:00:25: Added this dedicated gizmo vision doc under `docs/Human-Plans/Architecture/View-Toolbar/Gizmo/` so the repo now has one stable north-star surface for transform-gizmo quality, ownership boundaries, legacy carry-forward expectations, and the split between view helpers, transform manipulators, toolbar controls, and camera gestures

### Purpose

This doc captures the long-range vision for gizmo behavior in ParaHook.

Use it to answer:
- what the gizmo is supposed to feel like when it is good
- what `generation` the gizmo is in today
- what later gizmo generations should add without blurring ownership
- which gizmo behaviors belong to the viewport manipulator itself
- which behaviors belong to `Transform`, `Camera-Controls`, and `View-Toolbar` instead
- what quality bar should be carried forward from the earlier better-feeling gizmo generation

Do not use it for:
- one specific implementation phase checklist
- proof that a particular gizmo bug is already fixed
- collapsing transform ownership into a view-helper-only document

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for keeping gizmo work aligned with authored transform and shared workspace ownership

- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - deeper product and architecture north star
  - useful for confirming that transform remains a shared authored system rather than a viewer-only trick

- `docs/Human-Plans/Architecture/View-Toolbar/View-Toolbar-Index.md`
  - explicit view-toolbar ownership
  - useful for separating transform gizmo behavior from orientation-gizmo and helper visibility controls

- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
  - gesture and camera ownership
  - useful for separating gizmo drag rules from raw orbit/pan/fly camera behavior

- `docs/Human-Plans/Architecture/Transform/transform-index.md`
  - canonical transform-family ownership
  - useful for target ownership, history, snap, hierarchy, and session questions that are broader than the viewport manipulator itself

- `docs/Phase-Plans/Tasks/Old/02.4D - VR - Reference Transform Controls.md`
  - older carry-forward reference for the first fuller transform-gizmo generation
  - useful as one proof source for legacy quality expectations

## Doc Body

### Why This Doc Exists

ParaHook already has several gizmo-adjacent planning homes:
- `Transform`
- `View-Toolbar`
- `Camera-Controls`
- older reference-transform and sketch-plane implementation history

What is still missing is one stable answer to:
- what makes the gizmo feel good instead of merely functional
- what the gizmo itself should own
- what should stay outside the gizmo and be handled by transform state, toolbar state, or camera rules
- which older qualities are worth explicitly preserving while the newer shared viewer gizmo matures

Without this doc, the gizmo risks drifting into one of two bad shapes:
- a thin wrapper around library defaults that never regains legacy quality
- a bloated surface that quietly starts owning transform, camera, and toolbar behavior all at once

This doc exists to keep the gizmo on the narrow honest path between those two failures.

### Short Version

The gizmo should become a calm, trustworthy, viewer-resident manipulation surface for authored transform targets.

When it is good, it should feel:
- stable
- predictable
- non-jumpy
- interruption-resistant
- precise
- consistent across mouse, keyboard, toolbar, and console entry paths

The gizmo should not become:
- the hidden owner of transform truth
- the owner of camera gesture policy
- a mixed blob of transform handles plus unrelated view-helper toggles

This should now be read as a generation ladder instead of one flat destination.

### Gizmo North Star

The long-range target is a shared viewport manipulator that:
- acts on explicit transform targets
- reads and writes one honest transform session
- feels consistent whether entered by viewport click, keyboard shortcut, toolbar surface, or console path
- can be reused across reference transform, content transform, sketch-plane adjust, and later authored object transforms without each surface inventing its own half-gizmo

The gizmo should be thought of as:
- the live manipulation face of transform

not as:
- the owner of transform semantics

Transform semantics should stay broader than the gizmo:
- target selection
- move / rotate / scale meaning
- history and commit rules
- snap ownership
- world versus local interpretation
- later authored transform persistence

The gizmo is the viewport interaction surface over that system.

### Gizmo Generations

The gizmo should be described as evolving through explicit generations.

The point of the generations is not branding.

The point is to make it easy to say:
- what we already have
- what quality gaps still belong to the current baseline
- what should wait for a later generation instead of being smuggled into the current one

#### Generation 1 - Shared Transform Manipulator Baseline

This is the current gizmo generation.

`Generation 1` means ParaHook already has:
- one real shared viewport transform manipulator instead of only one-off feature-local handles
- explicit move / rotate / scale interaction entry through the current gizmo runtime
- one visible bridge between viewport manipulation and surrounding toolbar / mode state
- a stable enough baseline to measure current behavior against the older better-feeling gizmo generation

What `Generation 1` is trying to make true:
- the gizmo is one named shared system
- transform handle behavior is no longer hiding inside unrelated feature shells
- quality work can now be organized as improvements to one shared baseline instead of ad hoc fixes

What `Generation 1` still needs to improve:
- drag-start trust
- drag continuity under nearby UI churn
- keyboard-path credibility
- supporting in-context UI polish
- overall feel compared with the previous stronger gizmo generation

In short:

`Generation 1` is the current shared gizmo baseline.

It is not yet the final polished manipulator, but it is the first generation that future quality work should attach to instead of inventing another parallel gizmo identity.

#### Generation 2 - Orientation Helper Visual Depth

`Generation 2` should be the first stage where the orientation/view helper becomes more spatially legible instead of reading like only loose spheres around an axis cross.

This generation should add helper-surface depth such as:
- connector or cage lines between the snap spheres
- clearer implied cube sides or volume edges
- stronger visual read of face, edge, and corner regions before text or richer styling is layered on top

One concrete carry-forward detail for this generation:
- add lines between the spheres so the sides of the orientation gizmo read clearly

Why this belongs in `Generation 2`:
- it is not basic transform-manipulator trust work
- it is not merely a size or opacity tuning knob
- it changes the helper from a loose point cloud into a clearer spatial orientation object

Important boundary:
- this is still helper-side visual structure, not transform-session ownership or camera-policy ownership

#### Later Generations

Later generations should be added only when the repo is ready to name a real qualitative step beyond `Generation 2`.

Good reasons to open a later generation:
- the gizmo gains a clearly new capability tier instead of one more polish fix
- a new generation needs its own quality bar and review questions
- the work would otherwise overload the current generation with goals that are meaningfully different in scope

#### Generation Boundaries

Use the generations as a scoping rule:

- if a change is about making the current shared manipulator more trustworthy, stable, and legacy-quality, it is still `Generation 1`
- if a change is about making the orientation helper read as a clearer spatial object through connector/cage structure, it belongs in `Generation 2`
- if a change would introduce a meaningfully new gizmo tier beyond those two lanes, it likely belongs in a later generation

Important rule:

do not open a new gizmo generation just to avoid finishing the quality bar of the current one.

### What Must Stay True

#### 1. The Gizmo Must Feel Trustworthy

The user should feel that:
- grabbing a handle starts the action they meant
- the object does not jump unexpectedly
- the drag stays live until they finish it
- changing nearby UI state does not silently cancel the active drag
- returning to the same tool later feels consistent

If the gizmo is mathematically correct but feels slippery or interrupt-prone, it is still not good enough.

#### 2. The Gizmo Must Not Become The Hidden Owner

The gizmo should not quietly become the owner of:
- transform truth
- selection truth
- camera policy
- toolbar-mode truth
- console prompt state

It should consume those systems through explicit seams and project them into live viewport interaction.

#### 3. Entry Path Parity Matters

The same transform action should feel coherent whether it starts from:
- clicking the gizmo handle directly
- keyboard shortcuts such as `m`, `r`, `s`, then axis selection
- toolbar controls
- later console command entry

The viewport should not have one good path and several second-class imitations.

#### 4. Stability Beats Cleverness

The gizmo should prefer:
- stable drag anchors
- explicit center-handle behavior
- clear world/local meaning
- no-op handling for repeated same-state attach/mode updates

over:
- clever automatic re-arming
- hidden state resets
- subtle camera-driven reinterpretation during a live drag

#### 5. View Helpers And Transform Handles Are Different

There are two different gizmo ideas:
- transform manipulators
- orientation/view helpers

They may live near each other in the product, but they are not the same system.

Examples:
- axis/orientation gizmo visibility belongs near `View-Toolbar`
- move/rotate/scale handle behavior belongs to the transform manipulator vision here

Do not mix them into one unnamed "gizmo settings" blob.

### Legacy Carry-Forward Quality Bar

The earlier better-feeling gizmo generation appears to have succeeded on a few concrete qualities that should remain the quality bar for the newer shared gizmo too.

#### 1. No Jump On Start

When the user starts a move:
- the object should not jump toward the cursor
- center-handle motion should begin from an honest projected gizmo center or other stable drag anchor
- keyboard-started motion should feel like the same action as clicking the same handle manually

#### 2. Drag Continuity

Once a drag is active:
- same-object re-attach churn should not tear it down
- same-mode restatement should not clear the active axis
- nearby overlay refreshes should not interrupt the drag

This continuity matters as much as raw transform correctness.

#### 3. Keyboard Path Credibility

Keyboard transform paths should be real manipulator entry paths, not fake parallel behavior.

Good direction:
- keyboard mode switches and axis picks route into the same gizmo session model
- plain center-handle activation has a clear meaning
- constrained axis follow-ups feel intentional and predictable

Bad direction:
- keyboard paths mutate transform through a completely separate non-gizmo runtime while pretending to be the same feature

#### 4. In-Context UI Polish

If the gizmo depends on supporting viewport or floating-panel UI:
- menus should open where the user expects
- overflow should not clip important controls
- active rows and current mode should be visibly legible
- supporting settings should not fight the live manipulation surface

Good gizmo feel is partly interaction polish around the manipulator, not only the handles themselves.

### Ownership Boundaries

Canonical split:

- `Transform`
  - target ownership
  - transform semantics
  - history, commit, cancel, and authored-system direction
  - snap semantics and hierarchy

- `Camera-Controls`
  - orbit/pan/fly gesture ownership
  - camera fallback and tool priority rules
  - viewport drag paths that are not transform-handle manipulation

- `View-Toolbar`
  - explicit visible controls for view helpers
  - orientation-gizmo visibility and similar helper toggles
  - user-facing view-state controls

- `Gizmo Vision`
  - viewport manipulator quality bar
  - shared transform-handle interaction expectations
  - transform-manipulator carry-forward rules

### Desired End State

When the gizmo matures, the user should be able to assume:
- the handle they grab is the action they get
- the drag anchor is stable
- world/local mode behaves clearly
- snap feedback is legible
- keyboard entry paths and direct-click paths are equivalent in intent
- different transform target types feel like one system, not separate mini-tools

The codebase should read that way too:
- one shared gizmo interaction surface
- narrow adapters for target type differences
- explicit transform/session seams
- fewer one-off viewer hacks per feature family

### Non-Goals

This doc does not argue that the first goal is:
- more settings for their own sake
- a huge library of helper toggles
- camera-feature overload inside the gizmo
- solving every sketch, transform, and toolbar concern in one pass

The main goal is:
- regain trust, stability, and shared-system honesty first

### Suggested Follow-On Questions

Useful later follow-ons from this vision:
- what are the top 5 concrete quality gaps between the older reference-transform generation and the current shared gizmo?
- which of those gaps are true manipulator-runtime gaps versus toolbar or session-shell gaps?
- what is the minimum shared gizmo contract that sketch-plane, reference transform, content transform, and later authored object transform should all follow?
- which current settings belong in `View-Toolbar`, which belong in `Transform`, and which belong nowhere because they are residue?
