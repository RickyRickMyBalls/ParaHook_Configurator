# Workspace Phase Workspace-7.5-9 - Spaghetti Presentation Mode Truth

## Doc Header

### Doc History
1. 2026-04-01 17:13: Renumbered this phase doc from `Workspace 7.5-7` to `Workspace 7.5-9` so the larger `Workspace 7.5` cleanup ladder now matches the intended execution order, leaving the presentation-mode scope unchanged while making room for the earlier split-mode plus ghost-preview cleanup tasks to live ahead of it
1. 2026-04-01 17:02: Revised this new `Workspace 7.5-7` plan after clarifying that the current `E` behavior is actually an overlay-on-model-viewport mode and should be split from simple reduced-chrome editor viewing, locking the direction toward a four-mode contract of `expanded`, `essentials`, `overlay`, and `collapsed` while treating `-` and `+` as collapse or restore control labels rather than the actual mode names
1. 2026-04-01 16:58: Added this future follow-on phase doc after clarifying that the `Spaghetti Editor` titlebar presentation control is still acting like a local inferred editor-state cycler instead of a clean workspace presentation-mode control, so the next cleanup should lock explicit presentation truth and align that behavior more closely with Browser presentation semantics

### Purpose

Use this phase to make the `Spaghetti Editor` primary presentation control behave like a real workspace presentation-mode control instead of a mixed local state heuristic.

The goal is:
- one explicit `Spaghetti Editor` presentation-mode contract
- one predictable meaning for `expanded`, `essentials`, `overlay`, and `collapsed`
- one clearer alignment between `Spaghetti Editor` and Browser workspace-mode behavior

### Scope

This phase covers:
- the `Spaghetti Editor` titlebar primary presentation control
- explicit editor presentation-mode truth
- how presentation mode maps onto header visibility, toolbar visibility, overlay behavior, and collapsed editor state
- keeping presentation-mode behavior consistent across slotted, floating, and popout-adjacent editor hosts

This phase does not cover:
- slot replacement truth already handled under `Workspace 7.5-6`
- Browser/project-content ownership or multi-graph runtime behavior already handled under `Workspace 7.5-5`
- broader AppShell architecture cleanup
- larger `Open Editors` UX or workspace-session redesign

## Doc Body

### Summary

`Workspace 7.5-9` is the presentation-mode cleanup follow-on inside the larger `Workspace 7.5` cleanup ladder.

It exists because the `Spaghetti Editor` primary presentation control is still not fully honest as a workspace-mode control:
- reduced-chrome editor viewing and overlay-on-model-viewport behavior are still too muddled together
- the current logic in `SpaghettiWindowHost` still infers essentials-like state from a mixed condition involving window mode, header collapse, and canvas-toolbar visibility
- that makes the control feel less like Browser's clean presentation-mode switch and more like a local editor-state trick

The next cleanup should make the control read and write one explicit presentation contract:
- `expanded`
- `essentials`
- `overlay`
- `collapsed`

The intended control read is now:
- `E` selects `essentials`
- `O` selects `overlay`
- `-` is the collapse action while the editor is open
- `+` is the restore action while the editor is collapsed

### Locked Direction

`Workspace 7.5-9` should be:
- a narrow presentation-mode truth cleanup
- a Browser-alignment follow-on for `Spaghetti Editor`
- a behavioral clarification phase, not a broad shell rewrite

`Workspace 7.5-9` should not be:
- another slot-replacement phase
- a new Browser/runtime ownership phase
- a broad `Spaghetti Editor` UX redesign
- a hidden AppShell refactor bucket

### Current Read

Current likely mismatch:
- the `Spaghetti Editor` titlebar control is acting like a mode cycler
- but `essentials` is inferred from implementation details instead of stored as one explicit truth
- and the current overlay-like behavior is still entangled with `E` instead of reading as its own explicit mode
- the result is that the control does not yet feel like a clean workspace presentation control in the same way Browser does

Desired invariant:
- the `Spaghetti Editor` primary presentation control reflects one explicit current mode
- the visible shell state is derived from that mode, not used to guess the mode afterward

### Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

### Phase Sections

## [ ] Phase 1 - Lock Explicit Presentation Mode Contract
### info
Purpose:
- lock one explicit meaning for `expanded`, `essentials`, `overlay`, and `collapsed` before changing implementation

Current read:
- the current behavior still derives `essentials` from a mixed combination of `windowMode`, header collapse, and canvas-toolbar visibility
- overlay-on-model-viewport behavior is also still muddled together with that `E` meaning
- that makes the primary presentation control less trustworthy as a real workspace-mode indicator

Main work:
- define the exact presentation-mode contract for `Spaghetti Editor`
- decide how the titlebar control should expose `E`, `O`, collapse, and restore
- lock which visible UI details are consequences of the chosen mode instead of inputs that define the mode

Done shape:
- the doc answers what `expanded`, `essentials`, `overlay`, and `collapsed` each mean
- the next implementation slice can replace inferred mode logic with explicit mode truth

### Questions / Decisions

#### [ ] Question 1 - What exact modes should the primary `Spaghetti Editor` control represent?

##### Suggestion
- `expanded`
- `essentials`
- `overlay`
- `collapsed`

##### Why
- that separates reduced-chrome editor viewing from overlay-on-model-viewport behavior instead of overloading one `E` state

#### [ ] Question 2 - Should `essentials` be inferred from header and toolbar state, or stored as an explicit presentation mode?

##### Suggestion
- store it as an explicit presentation mode

##### Why
- header collapse and toolbar visibility should be consequences of presentation mode, not the source of truth used to guess it later

#### [ ] Question 3 - Should overlay-on-model-viewport behavior stay inside `E`, or become its own explicit mode?

##### Suggestion
- make it its own explicit `overlay` mode
- use `O` as the control label for that mode
- return `E` to the simpler reduced-chrome editor meaning

##### Why
- multiple open `Spaghetti Editors` make the old overloaded `E` behavior harder to understand
- overlay is a distinct presentation idea and should read as one

#### [ ] Question 4 - What should each mode mean?

##### Suggestion
- `expanded`: full editor chrome and normal editing surface
- `essentials`: reduced chrome with the editor still actively usable and focused on seeing more of the canvas inside its own host
- `overlay`: editor canvas presented as an overlay on the model viewport rather than as ordinary reduced-chrome editor viewing
- `collapsed`: minimized shell with editor body hidden

##### Why
- this gives the control one stable mental model and keeps later implementation from mixing mode semantics again

#### [ ] Question 5 - How should the visible control labels map onto those modes?

##### Suggestion
- `E` selects `essentials`
- `O` selects `overlay`
- `-` is the collapse action while the editor is open
- `+` is the restore action while the editor is collapsed
- treat `-` and `+` as action labels, not as the actual mode names

##### Why
- this keeps the interaction intuitive while avoiding the awkward idea that `-` is itself the formal mode identifier
- it also gives overlay a clean dedicated label

#### [ ] Question 6 - Should the primary presentation control remain presentation-only?

##### Suggestion
- yes
- keep split, float, popout, replace-surface, and close behavior separate

##### Why
- workspace replacement and host-lifecycle actions are already handled elsewhere
- this control should stay about presentation, not surface ownership

#### [ ] Question 7 - Which host paths must obey the same presentation-mode truth?

##### Suggestion
- slotted `Spaghetti Editor`
- floating `Spaghetti Editor`
- popout-adjacent `Spaghetti Editor`
- meatball-adjacent variants only where they still share the same primary presentation control semantics

##### Why
- the control should not mean something different depending on where the editor is hosted

Checklist:
- [ ] Lock the explicit presentation-mode contract
- [ ] Lock the four-mode direction of `expanded`, `essentials`, `overlay`, and `collapsed`
- [ ] Lock that `essentials` is explicit truth, not inferred mixed state
- [ ] Lock that overlay is its own explicit mode instead of overloaded inside `E`
- [ ] Lock the visible control-label mapping for `E`, `O`, `-`, and `+`
- [ ] Lock that the primary presentation control is presentation-only, not replacement or host-lifecycle control
- [ ] Lock the host paths that must share the same mode meaning

Verification:
- the doc gives one clear definition for `expanded`, `essentials`, `overlay`, and `collapsed`
- the next implementation slice has one explicit source of truth to target

## [ ] Phase 2 - Implement Presentation Mode Truth
### info
Purpose:
- replace inferred mode behavior with one explicit `Spaghetti Editor` presentation-mode path

Current read:
- `SpaghettiWindowHost` currently calculates essentials-like state from other UI flags
- the safest next cut is to centralize mode read/write first, then let the visible shell follow it

Main work:
- move the primary control behavior onto explicit presentation-mode truth
- make header and toolbar visibility follow the selected mode instead of defining it
- make overlay follow the explicit `overlay` mode instead of piggybacking on `essentials`
- keep the implementation behaviorally narrow and host-consistent

Done shape:
- the `Spaghetti Editor` primary control reads and writes one explicit presentation mode
- `E` and `O` each have one clear meaning
- the same mode produces the same shell result across the targeted hosts

Checklist:
- [ ] Add or tighten the explicit `Spaghetti Editor` presentation-mode source of truth
- [ ] Replace inferred essentials detection in `SpaghettiWindowHost`
- [ ] Separate overlay behavior from essentials behavior
- [ ] Make visible shell details follow the chosen mode
- [ ] Add focused regressions for slotted and floating editor hosts

Verification:
- the `E / O / - / +` control language always reflects the real current presentation mode or action
- switching modes behaves the same way across the targeted hosts
- the visible shell no longer has to reverse-engineer `essentials` from unrelated state

## [ ] Phase 3 - Final Confidence And Browser Alignment Read
### info
Purpose:
- confirm the cleaned-up `Spaghetti Editor` presentation control now feels honest and better aligned with Browser workspace modes

Current read:
- this should be a confidence-and-close phase unless live testing reveals one more narrow presentation-semantics bug

Main work:
- manually verify mode switching across the main hosts
- confirm the control meaning now reads clearly to the user
- record any remaining larger Browser/Spaghetti parity work separately

Done shape:
- the presentation control feels like one real mode control instead of a local implementation trick
- later Browser/Spaghetti parity work can build on a cleaner presentation contract

Checklist:
- [ ] Re-run focused automated checks for the touched presentation-mode seam
- [ ] Manually verify mode switching across the main editor hosts
- [ ] Record any broader later Browser/Spaghetti parity work separately instead of widening this phase
- [ ] Close the phase only when the control meaning feels stable and explicit

Verification:
- `expanded`, `essentials`, `overlay`, and `collapsed` have stable visible meanings
- the primary presentation control reads clearly across the targeted hosts
- remaining later parity work is explicit rather than hidden inside this cleanup

### Acceptance And Done Shape

`Workspace 7.5-9` is done when:
- the `Spaghetti Editor` primary presentation control maps to one explicit presentation contract
- `essentials` is stored or resolved as explicit presentation truth rather than inferred mixed state
- overlay is represented as its own explicit mode rather than being overloaded into `E`
- the visible shell follows the chosen presentation mode consistently across the targeted hosts
- the remaining larger Browser/Spaghetti parity work, if any, is explicit and separate
