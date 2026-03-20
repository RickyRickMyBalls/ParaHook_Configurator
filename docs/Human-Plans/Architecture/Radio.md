# Radio

## Doc Header

### Doc History
33. 2026-03-20 17:34: Tightened `Phase 10` into an implementation-ready shared-toolbar execution spec by locking the separate-panel end-state decision, mapping the merge onto the current live `RadioPanel` / `AudioSamplerPanel` / store / shell seams, and defining the disclosure-state, migration, test, and completion targets for the next sampler UI refactor
32. 2026-03-20 17:27: Added a new post-sampler phase for folding the sequencer back into the shared `Radio` toolbar as a disclosure-tree surface with sibling `Radio` / `Sampler` sections, a collapsible steps area above `Note Repeat`, and expandable per-step detail rows
31. 2026-03-20 17:18: Marked `Phase 9` complete after the first sampler sequencer slice landed as a hosted panel with one-row pattern state, BPM and step-count controls, rerollable per-step cues, a narrow note-repeat block, and an app-level loop that reuses the current radio source/runtime path
30. 2026-03-20 17:16: Tightened `Phase 9` into an implementation-ready execution spec by locking the first sampler ownership decision, mapping the sequencer onto the current live radio/runtime code seams, and adding a clearer baseline-versus-delta read plus concrete state, timing, file, and test targets
29. 2026-03-20 17:12: Added a new post-radio sampler phase to this architecture doc so the next major build step is now spelled out as a simple one-row sequencer that reuses the current radio source/runtime seams, with one locked ownership question plus an implementation-ready spec
28. 2026-03-20 17:03: Marked `Phase 7` complete after the radio toolbar/control surface landed as a real hosted panel with console `OpenToolbar` / `CloseToolbar` commands, live transport/status readout, seek/reload control seams, and focused store/console/panel/app-shell regressions
27. 2026-03-20 15:28: Extended the `Phase 7` toolbar spec so the radio toolbar is opened and closed from the console `Radio` scope through new sibling commands `OpenToolbar` and `CloseToolbar`, with aliases `OT` and `CT`
26. 2026-03-20 15:24: Aligned `Phase 7` to the shared toolbar template direction in `Toolbar.md`, so the first visible radio UI now explicitly reuses the floating toolbar shell/layout contract instead of being described as a generic custom panel
25. 2026-03-20 15:21: Raised the `Phase 7` toolbar/control-surface bar so it now explicitly requires a real time-position readout plus a seekable `ParaSlider`, making transport truth and user time adjustment part of the first visible radio UI instead of a deferred later control
24. 2026-03-20 15:18: Reworked `Phase 7` into an implementation-ready toolbar/control-surface spec by locking the first visible-surface decisions, mapping the work onto the current radio runtime/store seams, and defining the first control set, placement rule, test targets, and completion order for the post-console radio UI
23. 2026-03-20 14:40: Marked `Phase 6` complete after the runtime now resolves supported SoundCloud URLs into a real-link path, reports unsupported custom links explicitly, and preserves the generated-tone bridge as an honest fallback when supported real-link playback is unavailable
22. 2026-03-20 14:34: Reworked `Phase 6` into an implementation-ready execution spec by locking the first real-link playback direction, keeping source-resolution ownership in the runtime audio layer, and defining how supported, fallback, and unsupported links should behave without reopening the earlier console phases
21. 2026-03-20 14:30: Expanded the post-fallback radio roadmap inside this doc by inserting a dedicated real-link playback phase after the fallback runtime bridge, then a toolbar/control-surface phase after that, and pushing the old hardening pass down so the later work now matches the intended implementation order
20. 2026-03-20 14:25: Marked `Phase 5` complete after the runtime bridge landed with a fallback generated source, one app-level burst-request subscriber, and real status reporting for fallback, blocked, and error playback states
19. 2026-03-20 14:19: Reworked `Phase 5` into an implementation-ready execution spec by locking the first playback-bridge direction, mapping it onto the now-landed `requestRadioBurst(...)` store seam plus the empty `src/runtime/audio/*` placeholders, and defining one narrow runtime-consumer path that can make the console radio audible without widening into a full audio workstation
18. 2026-03-20 14:14: Marked `Phase 4` complete after the console now publishes burst requests for accepted submits and staged `ArrowUp` / `ArrowDown` highlight changes through the radio sampler seam, while leaving `Phase 5` open for real playback bridging
17. 2026-03-20 14:12: Reworked `Phase 4` into an implementation-ready execution spec by giving it the `[4.1O3]` heading, locking the highlight-trigger decisions, mapping it onto the current `ConsoleDock` submit and arrow-cycle seams, and defining one narrow burst-request handoff that `Phase 5` can later fulfill with real playback
16. 2026-03-20 14:03: Marked the `Phase 2` and `Phase 3` title checkboxes complete to match the already-landed radio session-state and command-identity code work, without changing the later open radio phases
15. 2026-03-20 13:52: Tightened `Phase 3` into an implementation-ready execution spec by locking its question blocks as decided, inventorying the current live command-id strings in `ConsoleDock.tsx`, naming one concrete resolver seam to add, and giving a direct file-by-file completion order for normalizing radio command identities without widening into playback
14. 2026-03-20 13:48: Reworked `Phase 3` into the structured execution-spec format by adding a `[4.1O2]` heading, explicit identity-design question blocks, and an implementation spec tied to the current `ConsoleDock` command-identity tracking and `audioSamplerStore` sample-position mapping seam
13. 2026-03-20 13:43: Expanded `Phase 2` into an implementation-ready spec by mapping it onto the current landed console-radio code, adding concrete code-to-target files, a current-baseline versus remaining-delta read, explicit command-routing ownership, transcript/prompt seeding rules, test targets, and a direct completion order for `[4.1O2]`
12. 2026-03-20 13:39: Updated the radio console-flow spec so `Off` also returns the user to root after submit and corrected the first alias read so `On -> O` and `Off -> FF` are used consistently instead of the older single-`F` shortcut
11. 2026-03-20 13:37: Updated the radio console-flow spec so selecting `On` and pressing `Enter` returns the user to root instead of leaving them inside the `Radio` scope, and aligned the phase header, submit rules, acceptance shape, and Phase 2 command ownership to that return behavior
10. 2026-03-20 13:35: Reworked `Phase 2` into the same structured execution-spec format as `Radio 1`, adding a titled `[4.1O2]` heading, a dedicated `Header`, one explicit `Q1` decision block around what `Off` should clear, and a concrete implementation spec for the canonical radio session state seam
9. 2026-03-20 13:29: Renamed the first shipped radio phase/checklist read from the narrow `Grammar And Scope` label to `Root, Scope, And Guided Prompt Sessions`, marked that phase complete to match the landed console work, and synced the local roadmap-mapping text to the same title
8. 2026-03-20 13:13: Expanded `Radio 1` into an implementation-ready phase spec by adding current code-to-target mapping, a concrete prompt-session seam, exact staged-navigation additions, likely first data shapes, and a direct implementation order against the current console files
7. 2026-03-20 13:11: Renamed the first radio phase heading to include its roadmap id, so `Phase 1` now reads as `[4.1O1] - Radio 1 - Grammar And Scope` and the local roadmap-mapping block uses the same label
6. 2026-03-20 13:06: Synced this radio architecture note with the live roadmap by mapping the first console-first implementation trio to `[4.1O]`, `[4.1O1]`, `[4.1O2]`, and `[4.1O3]`, so the radio spec now points at the same console mini-family used in `roadmap.md`
5. 2026-03-20 13:01: Revised `Phase 1` `Q1` so `Url` and `SampleBurstTime` now follow the normal console suggestion model, with a prefilled suggested answer that the user can overwrite rather than a separate custom freeform-prompt behavior
4. 2026-03-20 12:57: Expanded `Phase 1 - Console Radio Grammar And Scope` into the new structured format, using a dedicated `### [ ] Q1` question block plus a concrete implementation spec for the first radio command grammar and prompt-state behavior
3. 2026-03-20 12:54: Added a bottom `phases` execution section for the console-first radio idea, breaking the work into narrow implementation cuts and recording the main remaining decisions around command identity and SoundCloud fallback behavior
2. 2026-03-20 12:52: Added a console-first implementation direction for `Radio`, defining the staged root/menu flow, the default `Gusano` SoundCloud URL behavior, the session-stable per-command sample-time template rule, and the first `Enter` / `ArrowUp` / `ArrowDown` console trigger semantics
1. 2026-03-20 12:42: Created this architecture doc to turn the older `radio sampler` wishlist idea into an implementation-facing `Radio` system spec for ParaHook, including ownership, trigger rules, runtime seams, and a realistic first-pass scope

### Purpose

This doc defines the architecture direction for the ParaHook `Radio`.

Use it to answer:
- what the `Radio` is supposed to be in the current app
- how `Radio` relates to the older `radio sampler` wish-feature notes
- what the runtime audio system should own
- what other app surfaces are allowed to trigger
- what the first honest implementation should and should not do
- where the likely code seams should live

### Why This Doc Exists

ParaHook already has documented memory of the old `/14/` `Gusano` / `Keota Radio` feature.

That memory lives in:
- historical notes
- roadmap references
- the wish-feature doc `docs/Human-Plans/Wish-Features/10 - radio-Sampler.md`

The current repo also already has likely code placeholders:
- `src/app/panels/RadioPanel.tsx`
- `src/app/panels/AudioSamplerPanel.tsx`
- `src/app/store/audioSamplerStore.ts`
- `src/runtime/audio/*`

But there is not yet one active architecture doc that says what the modern ParaHook `Radio` should actually be.

This doc exists to define that seam before implementation starts growing ad hoc.

### Scope

This doc covers:
- the app-facing `Radio` system
- the relationship between manual playback controls and interaction-triggered sampling
- ownership boundaries between shell, store, runtime audio, and trigger publishers
- the first realistic implementation cut
- the likely code structure for the current repo

This doc does not cover:
- final visual styling
- full DAW or sequencer behavior
- worker-side audio logic
- audio export/render-to-file
- broad media-library management

## Doc Body

### Short Version

ParaHook should gain one optional app-wide `Radio` system.

That `Radio` should combine two ideas:
- a small user-visible playback panel
- an interaction sampler that can play short audio bursts when the user touches chosen controls

The old `Keota Radio` idea is still the right personality direction, but the modern architecture should treat it as:
- an optional runtime subsystem
- fully app-side
- separate from the worker/build pipeline

The first implementation should stay intentionally narrow:
- one bundled track or clip source
- one radio panel
- one app-level store
- one runtime audio engine
- one stable cue-assignment map for trigger ids
- a very small first trigger surface

### Core Naming Decision

Use these terms:

- `Radio`
  - the full optional audio personality system
- `Radio Panel`
  - the user-visible control surface
- `Sampler`
  - the trigger-driven burst behavior inside `Radio`
- `Trigger`
  - a published UI interaction that is allowed to request a burst
- `Cue Map`
  - the stable trigger-id to cue-position assignment table
- `Burst`
  - a short sampled playback window

Historical labels:
- `Gusano`
- `Keota Radio`

Important rule:
- keep the old names as historical flavor/reference material
- use `Radio` as the modern architecture name

### Product Intent

The `Radio` should not be treated as required CAD/build functionality.

It should be treated as:
- an optional personality layer
- a playful interaction system
- an atmosphere and feedback system attached to the workbench

Plain-English rule:
- the app must still work perfectly when `Radio` is disabled
- `Radio` should add character without becoming a dependency for core authoring

### Main UX Shape

#### 1. `Radio Panel`

The first visible UI should be one small panel/surface that exposes the current radio state.

It should support:
- play / pause
- volume
- seek
- sampler enabled / disabled
- burst duration

Later possible controls:
- track selection
- mute / solo style controls
- cue-map randomize/reset
- trigger-group enable/disable

Important rule:
- the first panel should be simple and honest
- it does not need to become a full timeline workstation

#### 2. Manual Playback

The user should be able to use the `Radio` as a basic playback surface even when no triggers are firing.

Reason:
- the old feature was partly a small radio/player
- manual playback makes the subsystem legible before the sampler behavior starts firing

#### 3. Interaction Sampler

The more interesting behavior is the sampler layer.

When approved UI interactions occur:
- the trigger publisher sends a trigger id
- the sampler resolves that id through the cue map
- the audio engine seeks or schedules playback at that cue
- the engine plays a short burst

This is the core behavior worth restoring.

### Core Architecture Rule

`Radio` is an app/runtime subsystem.

It is not a worker subsystem.

The worker should know nothing about:
- track state
- cue assignments
- UI trigger audio
- playback transport

The worker computes geometry/build work.

The `Radio` lives entirely in the app/runtime layer:
- UI surfaces publish trigger events
- app/store state owns user-facing settings and mappings
- runtime audio code owns actual playback execution

### Core Behavior Rule

The defining old behavior should remain intact:
- random per trigger
- stable for that same trigger later

That means:
- a trigger id gets assigned a cue position once
- later activations of that same trigger reuse that cue
- different triggers usually land on different cue positions

Important rule:
- do not make every click fully random every time
- stable randomness is the personality layer

### Cue-Assignment Rule

The `Cue Map` should be keyed by a stable trigger id, not by transient component instances alone.

Good first examples:
- `ReferenceTransform.Move`
- `ReferenceTransform.Rotate`
- `ReferenceTransform.Axis.X`
- `Console.Accept`
- `Browser.Row.Open`

Avoid first-pass ids like:
- raw React instance ids
- ephemeral DOM node ids
- object identities that change every render

First-pass persistence rule:
- session-stable is enough for the first implementation
- full saved-project persistence can come later if it still feels valuable

### Trigger Publishing Rule

Not every interaction in the app should trigger audio.

The first implementation should use a very small allowlist.

Good first candidates:
- explicit toolbar buttons
- high-signal mode/action buttons
- selected console acceptance actions
- a narrow transform flow if it is already easy to identify clean stable ids

Avoid first-pass triggers like:
- every slider tick
- every pointer move
- high-frequency drag updates
- all keyboard events globally

Plain-English rule:
- keep it expressive, not noisy

### Runtime Audio Rule

The runtime audio layer should own actual playback mechanics.

It should handle:
- loading/holding the active track or clip source
- browser audio-context readiness
- play / pause / seek
- burst start and burst stop
- transport state reporting back to the store/UI

It should not own:
- panel placement
- app layout
- trigger-allowlist policy
- long-lived canonical app identity outside the audio domain

Important browser rule:
- the first sound must respect browser gesture-gating requirements
- the system should initialize cleanly after a user gesture instead of assuming autoplay

### Target Ownership Split

#### Shell/UI Placement

Owned by:
- `src/app/AppShell.tsx`
- whichever panel host currently owns optional docked/floating surfaces

Responsibilities:
- render the `Radio Panel`
- decide where the panel is shown
- keep the feature optional and removable from the shell

#### Canonical Radio State

Should be owned by:
- `src/app/store/audioSamplerStore.ts`

Responsibilities:
- enabled / disabled state
- playback state
- current time / duration view state
- burst duration
- active track metadata
- cue-map data
- trigger allowlist config

#### Runtime Audio Execution

Should be owned by:
- `src/runtime/audio/AudioEngine.ts`
- `src/runtime/audio/TimelineTransport.ts`
- `src/runtime/audio/ClipLibrary.ts`
- `src/runtime/audio/SamplerKeys.ts`

Responsibilities:
- actual audio playback
- seek/start/stop behavior
- burst timing
- track/clip source registration
- stable trigger-key normalization if that logic belongs near playback

#### Trigger Publishing

Should stay owned by:
- the feature surfaces already handling the real interaction

Examples:
- console publishes a radio trigger when a chosen command action is accepted
- toolbar buttons publish a radio trigger when clicked
- transform tools publish a radio trigger only for selected action boundaries

Important rule:
- `Radio` listens to interaction outcomes
- it does not become the owner of those features

### First Honest Implementation

The first implementation should stay narrow enough that it can actually ship.

Recommended first cut:
- one bundled local audio asset or one very small clip library
- one radio panel
- manual play / pause / volume / seek
- sampler enable / disable
- configurable burst duration
- one in-memory session cue map
- one narrow trigger publisher seam

Recommended first trigger surface:
- a handful of explicit buttons with stable ids

Why:
- that proves the cue-map idea
- keeps debugging straightforward
- avoids turning v1 into a global event-noise problem

### Console-First Implementation Direction

The first real implementation should begin inside the existing `Console`.

Reason:
- the console already has a staged root/menu model
- console choices already have stable canonical tokens and aliases
- this gives `Radio` a natural template surface without manually wiring every random sample time by hand

Important rule:
- the first radio/sampler trigger template should be command-driven
- not yet panel-driven and not yet app-global

#### Root Entry

The console root should gain a second first-level option.

First intended root choices:
- `[Graph, Radio]`
- aliases: `[G, R]`

That means:
- `Graph` keeps the current staged graph flow
- `Radio` enters the radio control scope

#### Radio Scope Choices

When the user enters `Radio`, the first intended choices are:
- `On`
  - alias: `O`
- `Off`
  - alias: `F`
- `Url`
  - alias: `U`
- `SampleBurstTime`
  - alias: `SBT`
- `RandomizeSampleTimes`
  - alias: `RST`

Important rule:
- this should remain a small control scope
- the first pass does not need nested radio submenus beyond these actions

#### Default URL Rule

When the user turns the radio on through `On`, the first default source should be:
- `https://soundcloud.com/keota-us/gusano`

Important rule:
- `On` should both enable the radio system and ensure this default URL is loaded if the user has not already chosen a different URL in the current session

#### `Off` Rule

`Off` should disable the radio system.

When `Radio` is off:
- console commands should no longer trigger audio bursts
- staged-choice cycling in the console should no longer trigger audio bursts

Plain-English rule:
- the console still works normally
- it just becomes silent again

#### `Url` Rule

When the user enters `Url` or `U`:
- the console should prompt for a URL string
- when the user pastes or types a URL and presses `Enter`
- that URL becomes the active radio source
- the radio should turn on

Important rule:
- the first implementation should treat this as a direct command-driven source swap
- not as a separate settings panel flow

#### `SampleBurstTime` Rule

When the user enters `SampleBurstTime`:
- the console should prompt for a float value
- the prompt should show the current burst time

First default value:
- `0.1`

When the user submits a new float:
- accept the value as the new sample-burst duration
- return the user to the `Radio` scope

#### `RandomizeSampleTimes` Rule

When the user enters `RandomizeSampleTimes`:
- re-randomize all stored sample times for console command triggers in the current session
- print:
  - `randomized sample times`

Important rule:
- this command resets the session template assignments
- after that, each console command should still resolve consistently for the rest of the session until randomized again

#### Console Trigger Rule

The first trigger surface should be the console command system itself.

When `Radio` is on:
- pressing `Enter` to accept a console command should play the assigned sample burst
- pressing `ArrowUp` or `ArrowDown` to cycle the staged highlighted selection should also play the assigned sample burst

Important scope boundary:
- this first rule is about console command interactions only
- not every app action yet

#### Template Assignment Rule

Every console command should get its own sample time automatically.

The intent is:
- no manual per-command sample-time authoring
- the system derives a stable-random sample time from the console command identity

That means:
- each console command token or staged command identity gets a different random time
- that time remains consistent throughout the current session
- different commands should generally land on different sample times

Good first examples:
- `Graph`
- `Radio`
- `On`
- `Off`
- `Url`
- `SampleBurstTime`
- `RandomizeSampleTimes`
- any staged graph commands that later pass through `Enter`

Important rule:
- this is a template system
- not a hand-authored lookup table the developer must fill manually for every command

#### Recommended First Runtime Read

For the console-first cut, the radio runtime can be read as:
- radio enabled state
- active URL
- burst duration
- one session-stable console-command sample-time map

The console should be able to ask:
- is radio enabled?
- what source URL is active?
- what burst duration should be used?
- what sample time belongs to this command identity right now?

#### First-Pass Notes

- the first pass may still need a practical bridge for SoundCloud playback readiness and browser gesture rules
- if a concrete SoundCloud integration is not ready yet, the console-side command/template behavior should still remain the owning design
- broader non-console trigger publishing can wait until this command-template seam feels correct

### First-Pass Non-Goals

Do not let the first implementation absorb:
- SoundCloud widget embedding
- remote streaming dependencies
- pop-out browser-window audio surfaces
- project-file persistence of cue maps
- multiple-track banks
- piano keys / pad grid sampler UI
- timeline editing
- waveform editing
- recording/export
- app-wide trigger coverage

Plain-English rule:
- ship the radio seam first
- do not try to ship a music workstation

### Suggested Code Shape

Existing likely seams already exist and should be filled rather than replaced:

- `src/app/panels/RadioPanel.tsx`
  - main radio control surface
- `src/app/panels/AudioSamplerPanel.tsx`
  - optional later split if the UI grows beyond one panel
- `src/app/store/audioSamplerStore.ts`
  - canonical UI-facing radio/sampler state
- `src/runtime/audio/AudioEngine.ts`
  - playback engine
- `src/runtime/audio/TimelineTransport.ts`
  - current-time / duration / seek transport helpers
- `src/runtime/audio/ClipLibrary.ts`
  - bundled source registration
- `src/runtime/audio/SamplerKeys.ts`
  - stable trigger id helpers / normalization

Likely app integration seams:
- `src/app/AppShell.tsx`
- `src/app/console/`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/panels/BrowserPanel.tsx`

### Relationship To Existing Docs

This doc is the implementation-facing architecture counterpart to:
- `docs/Human-Plans/Wish-Features/10 - radio-Sampler.md`

Use the wish-feature doc for:
- old feature memory
- flavor
- long-range expansion ideas

Use this architecture doc for:
- ownership
- code seams
- implementation scope
- runtime rules

### Recommended First Implementation Order

1. make `audioSamplerStore.ts` hold the canonical user-facing state
2. make `AudioEngine.ts` able to load and play one local source
3. build one honest `RadioPanel.tsx`
4. add sampler burst support driven by stable trigger ids
5. wire one narrow trigger publisher seam from a small chosen set of controls
6. prove enable/disable and burst duration behavior
7. stop before broadening into multi-track or timeline work

### Acceptance Shape

The first implementation should count as architecturally correct when:
- the app can show one working `Radio Panel`
- manual playback works from one local source
- a small chosen set of stable trigger ids can fire bursts
- the same trigger reuses the same cue point within the session
- the worker remains completely unaware of the radio system
- disabling `Radio` cleanly removes the behavior without breaking core authoring

# phases

### Roadmap Mapping

The first live roadmap home for this work is:
- `[4.1O]` `Console-First Radio Sampler Return`

The first implementation trio maps like this:
- `[4.1O1]`
  - this doc's `Phase 1 - [4.1O1] - Radio 1 - Root, Scope, And Guided Prompt Sessions`
- `[4.1O2]`
  - this doc's `Phase 2 - [4.1O2] - Radio 2 - Canonical Session State And Defaults`
  - plus `Phase 3 - Command Identity Template System`
- `[4.1O3]`
  - this doc's `Phase 4 - Console Trigger Wiring`
  - plus `Phase 5 - Runtime Source Bridge`

Current read:
- the original `[4.1O1-3]` trio is now fully landed as the console-first radio proof
- the next radio work should proceed in this order:
  - `Phase 7 - Radio Toolbar And Control Surface`
  - `Phase 8 - Hardening And Follow-Through`

## [x] Phase 1 - `[4.1O1]` - `Radio 1 - Root, Scope, And Guided Prompt Sessions`
### Header
- add `Radio` as a second console root branch beside `Graph`
- make the first root choices:
  - `[Graph, Radio]`
  - aliases: `[G, R]`
- define the first `Radio` scope choices:
  - `On`
  - `Off`
  - `Url`
  - `SampleBurstTime`
  - `RandomizeSampleTimes`
- lock the first aliases as:
  - `On -> O`
  - `Off -> FF`
  - `Url -> U`
  - `SampleBurstTime -> SBT`
  - `RandomizeSampleTimes -> RST`
- make `Url` enter a prompt state that accepts one pasted/typed URL
- make `SampleBurstTime` enter a prompt state that accepts one float
- after successful `On` submission, return the user to root
- after successful `Off` submission, return the user to root
- after successful `Url` or `SampleBurstTime` submission, return the user to the `Radio` scope
- keep normal console cancel/back behavior intact rather than inventing a separate radio-only close model

Acceptance shape:
- the console can enter `Radio` from root
- the `Radio` scope can display the intended choices and aliases
- `Url` and `SampleBurstTime` can prefill a suggested answer, let the user overwrite it, and then return to the `Radio` scope after submit

### [x] `Q1` - Lock `Url` And `SampleBurstTime` To Guided Prompt Sessions

#### Suggestion
- locked direction:
- keep `Url` and `SampleBurstTime` inside the normal console flow
- use the normal suggested-answer behavior rather than a special radio-only prompt product
- entering `Url` should prefill the current or default URL as the suggested answer
- entering `SampleBurstTime` should prefill the current burst-time value as the suggested answer
- if the user types something different, the suggested answer should clear and the new typed value should become the accepted candidate
- after valid submit, return directly to the parent `Radio` scope
- after `Esc`, abandon the current prompt and return to the parent `Radio` scope

### Implementation Spec

Purpose:
- make the first `Radio` grammar fit the current console architecture by adding one new staged root branch and two normal console prompt states that use prefilled suggested answers without inventing a second command system

#### Scope

Owned here:
- adding `Radio` as a root-level staged branch beside `Graph`
- defining the first `Radio` scope commands and aliases
- defining the normal suggested-answer prompt behavior for `Url`
- defining the normal suggested-answer prompt behavior for `SampleBurstTime`
- defining how valid submit, invalid submit, `Back`, and `Esc` should behave inside the first radio flow

Not owned here:
- runtime audio playback
- sample-time assignment
- `Enter` / `ArrowUp` / `ArrowDown` sound triggering
- SoundCloud bridge details
- non-console trigger surfaces

#### Main Decision

The main decision in `Phase 1` is:
- should `Url` and `SampleBurstTime` become deeper nested radio submenus, or should they stay inside the normal console suggestion flow with prefilled answers the user can overwrite?

Locked answer:
- keep them inside the normal console suggestion flow
- keep `Radio` inside the normal staged console model
- prefill a suggested answer for each one
- let normal typing replace that suggestion cleanly
- return to the parent `Radio` scope after valid submit

#### Current Code-To-Target Mapping

Current live seams:
- `src/app/console/stagedNavigation.ts`
  - owns:
    - staged root choices
    - staged scope ids
    - finite-choice scope transitions
    - execute versus advance results
- `src/app/console/useConsoleStore.ts`
  - owns:
    - active staged session
    - feature assist descriptor
    - staged choice index
    - manual-override tracking
    - seeded input text
- `src/app/console/ConsoleBar.tsx`
  - owns:
    - staged summary rendering
    - prefilled choice display
    - `ArrowUp / ArrowDown` cycling
    - submit and cancel handoff

Current gap:
- the console already supports:
  - finite staged choices
  - suggested prefill
  - manual typing override
- but it does not yet support:
  - one explicit prompt-session seam for accepting free-typed submit values while still behaving like a guided console state

Implementation-ready read:
- `Radio 1` should extend the staged grammar for:
  - root `Radio`
  - `Radio` finite choices
- and add one narrow prompt-session seam for:
  - `Url`
  - `SampleBurstTime`

#### First New Seam

`Radio 1` should add one narrow shared prompt-session seam at the console layer.

Recommended first read:
- `consolePromptSession`
  - nullable
  - owned near `useConsoleStore`

First intended responsibilities:
- identify when the console is waiting for a free-typed value instead of a finite staged choice
- carry the prompt label
- carry the parent breadcrumb
- carry the suggested input value
- carry the prompt kind:
  - `url`
  - `float`
- preserve enough state to return to the parent `Radio` scope after submit or `Esc`

Important rule:
- this should be a console seam, not a radio-only one-off if avoidable
- but it should still stay narrow enough that `Radio 1` does not turn into a general prompt-language redesign

#### First Likely Data Shape

Recommended first prompt-session shape:
- `kind`
  - `radio.url`
  - `radio.sampleBurstTime`
- `breadcrumb`
  - for example:
    - `['Radio', 'Url']`
    - `['Radio', 'SampleBurstTime']`
- `promptLabel`
  - user-facing prompt text
- `prefill`
  - suggested input text
- `returnScopeId`
  - `radioRoot`

Recommended first staged additions:
- `ConsoleStagedNavigationScopeId`
  - add:
    - `radioRoot`
- `ConsoleStagedNavigationExecuteResult['actionId']`
  - add:
    - `radio.on`
    - `radio.off`
    - `radio.url`
    - `radio.sampleBurstTime`
    - `radio.randomizeSampleTimes`

#### Root And Radio Grammar Mapping

Recommended staged-navigation additions:
- root choices:
  - existing:
    - `Graph`
  - add:
    - `Radio`
- new `radioRoot` scope choices:
  - `On`
  - `Off`
  - `Url`
  - `SampleBurstTime`
  - `RandomizeSampleTimes`
  - `Back`

Recommended result behavior:
- `On`
  - execute
  - then return to root
- `Off`
  - execute
  - then return to root
- `RandomizeSampleTimes`
  - execute
- `Url`
  - execute into prompt-session handoff
- `SampleBurstTime`
  - execute into prompt-session handoff
- `Back`
  - advance back to root

Important rule:
- `Url` and `SampleBurstTime` still belong to the same command family
- they simply hand off from finite staged choice into a prompt-session seam

#### Prompt Handoff Rule

When staged navigation executes `radio.url` or `radio.sampleBurstTime`:
- do not end in a dead execute-only result
- create the matching prompt session
- seed the input with the suggested value
- keep the summary/breadcrumb visibly inside the `Radio` family

Recommended first prefill values:
- `radio.url`
  - current radio URL if already set
  - otherwise the default `Gusano` URL
- `radio.sampleBurstTime`
  - current burst-time value
  - otherwise `0.1`

#### Submit Ownership Rule

`Radio 1` should define ownership, not yet the full final side effects.

Recommended first ownership split:
- staged navigation owns:
  - finite root/radio token selection
- prompt-session seam owns:
  - free-typed URL/float acceptance
  - validation
  - return-to-`Radio` behavior
- later radio state seam in `[4.1O2]` owns:
  - durable radio settings such as:
    - enabled flag
    - active URL
    - burst time

Important rule:
- `Radio 1` may still need a tiny temporary state bridge so the prompt can show a real current/default value
- but do not let `Radio 1` absorb the full `[4.1O2]` radio-state phase

#### Root Shape

The first root-level choices should be:
- `Graph`
  - alias: `G`
- `Radio`
  - alias: `R`

Important rule:
- `Graph` keeps its current meaning
- `Radio` becomes a peer root branch, not a replacement root

#### Radio Scope Shape

The first `Radio` scope should expose:
- `On`
  - alias: `O`
- `Off`
  - alias: `FF`
- `Url`
  - alias: `U`
- `SampleBurstTime`
  - alias: `SBT`
- `RandomizeSampleTimes`
  - alias: `RST`
- `Back`
  - alias: `B`

Important rule:
- `Back` should keep its normal staged-navigation meaning
- do not invent a special radio-only close token if standard staged back/cancel behavior already works

#### Prompt-State Rule

`Url` and `SampleBurstTime` should not behave like finite-choice staged scopes.

They should behave as normal console prompt states with a suggested answer:
- `Url`
  - prefills the current or default URL
  - accepts one pasted or typed URL string
- `SampleBurstTime`
  - prefills the current burst-time value
  - accepts one float value

Plain-English rule:
- the user is still inside the `Radio` flow
- the console shows a suggested answer first
- if the user types something else, that typed value replaces the suggestion

#### Submit Rule

When the user enters `On`:
- enable radio
- accept the state change
- return the user to root after submit

Important rule:
- `On` should behave like an apply-and-exit action in the first pass
- it should not leave the user sitting inside the `Radio` scope

When the user enters `Off`:
- disable radio
- accept the state change
- return the user to root after submit

Important rule:
- `Off` should also behave like an apply-and-exit action in the first pass
- it should not leave the user sitting inside the `Radio` scope

When the user enters `Url`:
- show a prompt that the console is awaiting a source URL
- prefill the suggested URL value in the input
- allow pasted or typed text
- on valid submit:
  - accept the URL value
  - return to `Radio`

When the user enters `SampleBurstTime`:
- show a prompt that the console is awaiting a float
- show the current burst-time value in the prompt read
- prefill that current burst-time value in the input
- on valid submit:
  - accept the new float value
  - return to `Radio`

Important rule:
- successful submit always returns to `Radio`
- it does not leave the user in a separate custom prompt product

#### Invalid Input Rule

For the first pass:
- invalid `Url` input should not exit the radio flow
- invalid `SampleBurstTime` input should not exit the radio flow
- invalid input should emit a short readable console feedback line
- after invalid input, the user should remain in the same prompt state so they can correct the value

Recommended first behavior:
- invalid URL:
  - keep the `Url` prompt active
  - emit a short validation message
- invalid float:
  - keep the `SampleBurstTime` prompt active
  - emit a short validation message

#### Escape And Back Rule

While inside the `Radio` choice scope:
- `Back`
  - returns to root
- `Esc`
  - follows the normal console staged-cancel behavior

While inside the `Url` or `SampleBurstTime` prompt state:
- `Esc`
  - abandons the temporary prompt
  - returns to the parent `Radio` scope

Important rule:
- these prompt states should feel recoverable
- they should never trap the user

#### Alias Normalization Rule

Aliases should normalize to one canonical command identity before the console decides what branch or prompt to enter.

Examples:
- `R` and `Radio`
  - same root command
- `U` and `Url`
  - same radio action
- `SBT` and `SampleBurstTime`
  - same radio action

Important rule:
- later transcript behavior and sample-time mapping should not depend on which alias spelling the user typed

#### Suggested Prompt Read

Suggested first prompt copy:
- entering `Radio`:
  - `Radio > Choose next [On, Off, Url, SampleBurstTime, RandomizeSampleTimes, Back]`
- entering `Url`:
  - `Radio > Url > Enter source URL`
  - suggested input: current URL or default `Gusano` URL
- entering `SampleBurstTime`:
  - `Radio > SampleBurstTime > Enter float [current: 0.1]`
  - suggested input: current burst-time value

These lines do not need to be final UI copy, but the first implementation should preserve this shape:
- scope label
- current prompt purpose
- clear next expected input

#### Transcript And Validation Read

The first implementation should produce readable command feedback.

Recommended first reads:
- invalid URL:
  - `Radio Url: invalid URL`
- invalid float:
  - `Radio SampleBurstTime: invalid float`

Recommended first validation behavior:
- `Url`
  - first pass only needs a lightweight non-empty URL-shaped validation
  - it does not need a network check
- `SampleBurstTime`
  - first pass should parse a float
  - reject:
    - empty
    - `NaN`
    - non-positive values if the radio system expects burst length to stay greater than zero

Important rule:
- validation stays local and synchronous in `Radio 1`
- do not block this phase on playback/source readiness checks

#### Likely First Implementation Cut

`Radio 1` should likely land as one narrow vertical slice:
- root can enter `Radio`
- `Radio` can present finite commands
- `Url` and `SampleBurstTime` can enter prompt sessions with suggested answers
- typed override works
- validation works
- submit/cancel return to `Radio`

This phase should stop before:
- real source loading
- real sound triggering
- sample-time template assignment

#### First Implementation Steps

`Phase 1` should likely be completed in this order:

1. extend `stagedNavigation.ts` root choices to include `Radio`
2. add `radioRoot` scope and its finite choices
3. extend staged execute results with the first radio action ids
4. add one narrow prompt-session state seam in `useConsoleStore.ts`
5. teach `ConsoleBar.tsx` to render and preserve prompt-session breadcrumb/prompt reads
6. seed prompt-session input with the suggested URL / float values
7. route submit so valid values return to `radioRoot`
8. route invalid values to a readable validation line while keeping the prompt active
9. route `Esc` from prompt session back to `radioRoot`
10. verify the root/radio/prompt transitions with focused tests

#### Hard Rules

- do not create a second command system beside staged console navigation
- do not turn `Url` and `SampleBurstTime` into deeper radio submenu trees in the first pass
- do not invent a special radio-only prompt interaction when the normal console suggestion behavior already fits
- do not widen this phase into playback/runtime work
- do not make alias spellings behave like different commands
- do not leave the user in an unrecoverable prompt state after invalid input or `Esc`

#### Acceptance Shape

- root can enter `Radio` through either `Radio` or `R`
- the `Radio` scope exposes the intended canonical commands and aliases
- `On` returns the user to root after successful submit
- `Off` returns the user to root after successful submit
- `Url` enters a normal console prompt with a suggested URL value and can return to `Radio` on submit
- `SampleBurstTime` enters a normal console prompt with a suggested float value and can return to `Radio` on submit
- typing a new value clears the autosuggested answer and uses the new typed value instead
- invalid prompt input stays recoverable
- `Back` and `Esc` behave like normal console recovery tools rather than radio-specific hacks
- the phase can be pointed at concrete files and state seams in the current console code without reopening the whole console architecture

## [x] Phase 2 - `[4.1O2]` - `Radio 2 - Canonical Session State And Defaults`
### Header
- create one canonical console-radio state surface
- store:
  - `isEnabled`
  - `activeUrl`
  - `sampleBurstTime`
  - `consoleCommandSampleTimes`
- use `0.1` as the first default `sampleBurstTime`
- use `https://soundcloud.com/keota-us/gusano` as the first default URL
- `On` should:
  - enable radio
  - ensure an active URL exists
  - load the default `Gusano` URL if the session has not chosen another one yet
  - return the user to root after submit
- `Off` should:
  - disable radio
  - stop console-triggered sounds from firing
  - return the user to root after submit
- `Url` submit should:
  - set `activeUrl`
  - turn radio on
- `RandomizeSampleTimes` should:
  - regenerate the console command sample-time map
  - emit `randomized sample times`

Acceptance shape:
- the radio session state can be inspected as one coherent object
- `On`, `Off`, `Url`, and `SampleBurstTime` update that state correctly
- `RandomizeSampleTimes` resets the session mapping and prints the intended confirmation line

### [x] `Q1` - Lock `Off` As A Silence Gate, Not A Destructive Reset

#### Suggestion
- locked direction:
- `Off` should only disable radio
- `Off` should not clear:
  - `activeUrl`
  - `sampleBurstTime`
  - the current session command-to-sample-time map
- `RandomizeSampleTimes` remains the explicit map reset action
- a later `On` should reuse the previously chosen URL and session map unless the user explicitly changes them
- this keeps `Off` as a silence gate rather than a destructive reset command

### Implementation Spec

Purpose:
- make `Radio` real as one inspectable session object so later trigger wiring and playback work can depend on honest shared state instead of scattered console-only behavior

#### Scope

Owned here:
- one canonical radio session state surface
- first default values for:
  - enabled state
  - active URL
  - burst time
- first command ownership for:
  - `On`
  - `Off`
  - `Url`
  - `SampleBurstTime`
  - `RandomizeSampleTimes`
- readable transcript outputs for radio-state changes

Not owned here:
- actual playback bridge behavior
- browser audio readiness
- SoundCloud widget/runtime decisions
- final trigger firing from `Enter` / `ArrowUp` / `ArrowDown`
- broader non-console radio surfaces

#### Main Decision

The main decision in `Phase 2` is:
- should `Off` act like a destructive reset, or should it only disable radio while preserving the current session settings and mapping?

Locked answer:
- `Off` is a silence gate only
- keep the current URL
- keep the current `SampleBurstTime`
- keep the current session command sample-time map
- use `RandomizeSampleTimes` as the explicit reset for the mapping

#### Canonical Owner

The canonical first owner should be:
- `src/app/store/audioSamplerStore.ts`

Responsibilities:
- expose one coherent radio-state object
- hold the first default values
- provide narrow command-facing update methods
- remain app-side and session-scoped

Important rule:
- do not spread radio settings across:
  - console-local component state
  - prompt-session-only state
  - runtime playback classes

`Phase 2` should make the store the source of truth.

#### Current Code-To-Target Mapping

Current live seams already in play:
- `src/app/store/audioSamplerStore.ts`
  - currently owns:
    - enabled flag
    - active URL
    - burst time
    - session command-sample map
    - randomization helpers
- `src/app/console/ConsoleDock.tsx`
  - currently owns:
    - radio command side effects
    - transcript reads for radio actions
    - prompt-session submit handoff into store updates
    - return-to-root / return-to-radio flow behavior
- `src/app/console/useConsoleStore.ts`
  - currently owns:
    - radio prompt-session state
    - guided prompt prefill behavior
    - prompt cancel/back recovery
- `src/app/console/stagedNavigation.ts`
  - currently owns:
    - radio command action ids
    - `Radio` finite-choice scope execution results

Implementation-ready read:
- `Phase 2` no longer starts from zero
- it should finish by tightening the current radio state seam into the canonical shape the rest of the radio stack will depend on

#### Current Landed Baseline

Already landed in code:
- one radio store exists
- the first default URL exists
- the first default burst time exists
- `On`, `Off`, `Url`, `SampleBurstTime`, and `RandomizeSampleTimes` already route through console actions
- `Url` and `SampleBurstTime` prompts already seed from store-backed values
- transcript lines already describe the radio state outcomes

This means `Phase 2` is not about inventing the seam anymore.

It is about locking:
- the canonical state contract
- the canonical method names / meanings
- the exact non-destructive behavior rules
- the exact ownership split the later phases should trust

#### Remaining Delta To Close `[4.1O2]`

What still needs to be made explicit and finished for `Phase 2`:
- decide whether the store keeps its current field names or gets normalized to the doc’s canonical names
- make the command-to-sample map read as a first-class radio-state field, not just an implementation detail
- ensure `On` and `Off` share one honest apply-and-return behavior rather than ad hoc per-command transcript handling
- verify there are no duplicated defaults still living in console-only code paths
- make the non-destructive `Off` rule explicit in tests
- make the `RandomizeSampleTimes` scope explicit in tests:
  - reset the map only
  - keep URL
  - keep burst time
  - keep enabled/disabled state unchanged

#### First State Shape

Recommended first state read:
- `isEnabled`
  - boolean
- `activeUrl`
  - string
- `sampleBurstTime`
  - number
- `consoleCommandSampleTimes`
  - command-identity to sample-time mapping

Recommended first helper actions:
- `turnOn()`
- `turnOff()`
- `setActiveUrl(url)`
- `setSampleBurstTime(value)`
- `randomizeCommandSampleTimes()`
- one helper to read or allocate the command sample time for a semantic command identity

Important rule:
- the state shape should already look like something `Phase 3` and `Phase 4` can keep using
- do not treat this as throwaway temporary console glue

Recommended current-code alignment:
- current code already uses:
  - `isRadioEnabled`
  - `sourceUrl`
  - `sampleBurstTime`
  - `samplePositionByCommandId`
- `Phase 2` should either:
  - keep those names and declare them canonical for the current app
  - or do one narrow normalization pass now before later phases depend on them more broadly

Recommendation:
- if no broader radio consumers exist yet, a small naming normalization is still acceptable in `Phase 2`
- if we want to minimize churn, keep the current store keys but explicitly map them to the architecture terms in the doc

#### Default Value Rule

The first session defaults should be:
- `isEnabled`
  - `false`
- `activeUrl`
  - `https://soundcloud.com/keota-us/gusano`
- `sampleBurstTime`
  - `0.1`

Important rule:
- the default URL should exist in state even before playback wiring is complete
- this keeps the console prompts and later runtime bridge aligned around one known source value

#### Command Ownership Rule

`On`
- sets `isEnabled = true`
- does not overwrite a previously chosen URL
- if no real URL is present yet, ensures the default `Gusano` URL exists
- returns the user to root after submit

`Off`
- sets `isEnabled = false`
- does not clear the URL
- does not clear `sampleBurstTime`
- does not clear the current session mapping
- returns the user to root after submit

`Url`
- sets `activeUrl`
- turns radio on

`SampleBurstTime`
- updates `sampleBurstTime`
- keeps the rest of the state intact

`RandomizeSampleTimes`
- keeps `isEnabled`
- keeps `activeUrl`
- keeps `sampleBurstTime`
- regenerates the current session command sample-time map

#### Command Routing Mapping

The current command-to-state ownership should be locked as:
- `stagedNavigation.ts`
  - identifies the radio command action ids
- `ConsoleDock.tsx`
  - translates those action ids into store mutations and transcript lines
- `audioSamplerStore.ts`
  - owns the actual state mutation results

Important rule:
- do not move state authority back into `ConsoleDock.tsx`
- `ConsoleDock.tsx` is the dispatcher
- `audioSamplerStore.ts` is the owner

#### Console Prompt Ownership Rule

`Phase 1` already created the console prompt/session behavior.

`Phase 2` should clarify the handoff:
- prompt-session input owns temporary user typing
- canonical radio state owns the accepted values after validation

That means:
- `Url` prompt submit writes to `activeUrl`
- `SampleBurstTime` prompt submit writes to `sampleBurstTime`
- the console prompt should read its suggested value from the canonical store rather than from hidden duplicated defaults

Implementation-ready read:
- `consolePromptSession` should not start owning radio defaults
- it should only hold:
  - temporary prompt context
  - breadcrumb
  - suggested current value copied from canonical state
  - return target

#### Transcript Rule

State-changing radio actions should emit readable transcript lines.

Recommended first reads:
- `On`
  - `Radio on`
- `Off`
  - `Radio off`
- `Url`
  - `Radio url: <url>`
- `SampleBurstTime`
  - `Sample burst time: <value>`
- `RandomizeSampleTimes`
  - `randomized sample times`

Important rule:
- transcript reads should describe the state outcome
- not just the clicked command label

Recommended first completion check:
- every radio transcript line should be derivable from the resulting store state
- avoid transcript text that implies hidden side effects not reflected in canonical radio state

#### Session Persistence Rule

For the first cut:
- session-scoped in-memory state is enough
- do not widen this phase into project-file persistence
- do not widen this phase into localStorage persistence unless the user explicitly asks for it later

Plain-English rule:
- keep the values consistent for the current app session
- restart persistence can come later if it still feels worthwhile

#### Test Targets

`Phase 2` should be treated as implementation-ready when it points at concrete tests.

Primary test files:
- `src/app/store/audioSamplerStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/console/useConsoleStore.test.ts`

Key assertions to keep or add:
- store boots with the default URL and burst time
- `On`
  - enables radio
  - preserves a previously chosen URL
  - returns the user to root
- `Off`
  - disables radio
  - preserves URL
  - preserves burst time
  - preserves current session map
  - returns the user to root
- `Url`
  - writes the new URL
  - turns radio on
- `SampleBurstTime`
  - writes the new float
- `RandomizeSampleTimes`
  - changes the command map
  - does not clear URL
  - does not clear burst time
  - does not implicitly disable radio

#### Implementation Order

`Phase 2` should likely be completed in this order:

1. audit the current `audioSamplerStore.ts` shape against the intended canonical contract
2. decide whether to normalize current field names or bless the current names as canonical
3. define or tighten the first default values in that same store
4. add or tighten narrow state-update actions for:
   - `On`
   - `Off`
   - `Url`
   - `SampleBurstTime`
   - `RandomizeSampleTimes`
5. make `ConsoleDock.tsx` route all radio actions through those store actions and keep return behavior consistent
6. make the `Url` and `SampleBurstTime` prompts seed only from canonical store state
7. make transcript lines reflect actual stored outcomes
8. verify that `Off` behaves as silence-only, not reset
9. verify that `RandomizeSampleTimes` resets only the command map
10. verify the root-return behavior for both `On` and `Off`

#### Hard Rules

- do not keep radio defaults duplicated in multiple console files once the canonical store exists
- do not make `Off` silently clear the URL or burst time
- do not make `Off` silently clear the current session command map
- do not force `Url` submit to depend on playback/runtime readiness
- do not widen this phase into the playback bridge
- do not widen this phase into app-global persistence

#### Acceptance Shape

- one canonical radio session object exists in the app store
- `On`, `Off`, `Url`, `SampleBurstTime`, and `RandomizeSampleTimes` update that object coherently
- `Off` acts like a silence gate rather than a destructive reset
- `On` and `Off` both return the user to root after successful submit
- the `Url` and `SampleBurstTime` console prompts read from and write back to canonical store state
- the session mapping can be regenerated independently from the rest of the radio settings
- later phases can point at this state seam without reopening ownership questions

## [x] Phase 3 - `[4.1O2]` - `Command Identity Template System`
### Header
- define the console command identity used for sample-time assignment
- assign one stable-random sample time per command identity
- keep assignments stable for the session until `RandomizeSampleTimes` is used
- avoid hand-authored per-command sample-time tables
- cover at least:
  - root commands like `Graph` and `Radio`
  - radio scope commands like `On`, `Off`, `Url`, `SampleBurstTime`, and `RandomizeSampleTimes`
  - staged graph choices that later execute through `Enter`

Recommended rule:
- use semantic command identities, not raw transient UI state

Examples:
- `Console.Root.Graph`
- `Console.Root.Radio`
- `Console.Radio.On`
- `Console.Radio.Url.Submit`
- `Console.Graph.Sketch.Draw`

Acceptance shape:
- two different command identities usually receive different sample times
- the same command identity reuses the same sample time throughout the session
- `RandomizeSampleTimes` produces a different mapping without requiring manual per-command edits

### [x] `Q1` - Lock The Mapping To Semantic Command Identities

#### Suggestion
- locked direction:
- key the mapping off semantic command identities
- do not key only off raw typed text
- aliases like:
  - `R`
  - `Radio`
  - `O`
  - `On`
  - `FF`
  - `Off`
  should collapse onto the same canonical command identity
- the mapping should survive visible prompt-label copy changes as long as the semantic command outcome stays the same

### [x] `Q2` - Lock Allocation To Interaction Outcome Boundaries

#### Suggestion
- locked direction:
- allocate and read the command identity at the interaction outcome boundary
- first-pass boundaries should be:
  - root command acceptance
  - staged action acceptance
  - prompt submit acceptance
  - later in `Phase 4`, highlighted staged-choice movement for `ArrowUp` / `ArrowDown`
- do not allocate identities for:
  - every typed character
  - transient input text edits
  - raw prompt prefill strings before the user actually commits an outcome

### Implementation Spec

Purpose:
- make the radio sampler template system honest by defining one canonical command-identity grammar that later trigger wiring and playback can reuse without depending on alias spellings, transcript copy, or transient UI state

#### Scope

Owned here:
- the canonical console command-identity grammar
- the rule for where identities are allocated/read
- the mapping seam between command identity and session-stable sample time
- the first coverage expectations for:
  - root commands
  - radio commands
  - staged graph commands
  - prompt-submit outcomes

Not owned here:
- actual audio playback
- browser/audio runtime readiness
- the final `Enter` / `ArrowUp` / `ArrowDown` trigger wiring
- non-console trigger families

#### Main Decision

The main decision in `Phase 3` is:
- should the sampler mapping be keyed by semantic command identity, or by whatever raw text the user happened to type?

Locked answer:
- use semantic command identities
- normalize aliases and equivalent command outcomes to one identity
- keep the mapping independent from:
  - raw alias spelling
  - visible prompt copy
  - transient input text

#### Current Code-To-Target Mapping

Current live seams:
- `src/app/console/ConsoleDock.tsx`
  - currently owns:
    - `trackRadioCommandIdentity(...)`
    - the current string identity construction for:
      - staged commands
      - prompt submits
      - flat commands
      - invalid attempts
- `src/app/store/audioSamplerStore.ts`
  - currently owns:
    - `ensureSamplePosition(commandId)`
    - the session-stable mapping in `samplePositionByCommandId`
    - `randomizeSampleTimes()`
- `src/app/console/stagedNavigation.ts`
  - currently owns:
    - canonical radio and graph action ids
    - staged command outcomes with stable action meaning

Implementation-ready read:
- `Phase 3` should tighten these existing seams
- not replace them with a second identity system

#### Current Landed Baseline

Already landed in code:
- the radio store can already allocate one stable sample position per string command id
- `ConsoleDock.tsx` already records command ids for:
  - root/staged paths
  - prompt submits
  - flat commands
  - invalid attempts
- `RandomizeSampleTimes` already resets the current session mapping

This means `Phase 3` is not about inventing the mapping.

It is about locking:
- the identity grammar
- the naming format
- the allowed allocation boundaries
- the exact relationship between command outcome and mapped sample time

#### Remaining Delta To Close This Phase

What still needs to be locked for `Phase 3`:
- replace ad hoc command-id strings with one explicit identity grammar
- decide whether invalid attempts should keep their own identity family or stay out of the sampler system
- decide exactly how prompt-submit identities should read:
  - action-enter
  - prompt-submit
  - or value-specific submit
- define which current `ConsoleDock.tsx` identity strings are canonical and which are transitional
- verify the same semantic outcome always resolves to the same identity even when the user takes a different alias path

Implementation-ready read:
- the remaining work is now mostly a normalization/refactor pass
- not a fresh subsystem design pass

#### Current Live Identity Inventory

The current code already emits radio-related identity strings, but they are still transitional.

Current seen patterns in `ConsoleDock.tsx`:
- `prompt:${activePromptSession.kind}`
- `staged:${activeStagedSession?.scopeId ?? 'root'}:${stagedResult.matchedChoice.canonicalToken}`
- `invalid:${activeStagedSession?.scopeId ?? 'root'}:${normalizeRadioCommandIdentity(rawToken)}`
- `flat:${parsed.name}`
- `flat:${normalizeRadioCommandIdentity(parsed.raw)}`

Important read:
- these strings already prove the mapping seam works
- but they are not yet the canonical grammar the rest of the radio system should depend on

#### Canonical Versus Transitional Identity Rule

For `Phase 3`, treat the current string patterns as transitional.

Canonical after this phase:
- named semantic identities like:
  - `Console.Root.Radio`
  - `Console.Radio.On`
  - `Console.Radio.Off`
  - `Console.Radio.Url.PromptSubmit`
  - `Console.Graph.Build`

Transitional and to be replaced:
- prefixed inline strings like:
  - `staged:...`
  - `prompt:...`
  - `flat:...`
  - `invalid:...`

Important rule:
- do not let later phases build on the transitional formats once a resolver seam exists

#### Canonical Identity Grammar

Recommended first grammar:
- prefix:
  - `Console`
- next level:
  - `Root`
  - `Radio`
  - `Graph`
  - later other console families as needed
- final segments:
  - semantic outcome
  - optionally the interaction boundary when it materially matters

Recommended examples:
- `Console.Root.Graph`
- `Console.Root.Radio`
- `Console.Radio.On`
- `Console.Radio.Off`
- `Console.Radio.Url.PromptSubmit`
- `Console.Radio.SampleBurstTime.PromptSubmit`
- `Console.Radio.RandomizeSampleTimes`
- `Console.Graph.Build`
- `Console.Graph.Sketch.Draw`
- `Console.Graph.Editor.Expanded`

Important rule:
- the identity should describe what the console outcome means
- not how the user happened to spell it

#### Alias Normalization Rule

Alias normalization should happen before sample-time lookup.

Examples:
- `r`
  and `Radio`
  => `Console.Root.Radio`
- `o`
  and `On`
  => `Console.Radio.On`
- `ff`
  and `Off`
  => `Console.Radio.Off`
- `u`
  and `Url`
  => `Console.Radio.Url.PromptSubmit` after prompt submit

Important rule:
- there should not be separate sample times for:
  - `O` versus `On`
  - `FF` versus `Off`
  - `R` versus `Radio`

#### Allocation Boundary Rule

The mapping should be read/allocated at the moment a semantic command outcome becomes real.

First-pass outcome boundaries:
- root command accepted
- staged command accepted
- prompt submit accepted
- later in `Phase 4`, highlighted staged-choice movement

Do not allocate on:
- transient text edits
- partially typed prompt values
- raw prefill values before submit
- generic focus/blur events

Plain-English rule:
- map outcomes, not typing noise

#### Prompt Identity Rule

Prompt states should not use the current typed value as the identity key.

Recommended first read:
- `Url` prompt submit:
  - `Console.Radio.Url.PromptSubmit`
- `SampleBurstTime` prompt submit:
  - `Console.Radio.SampleBurstTime.PromptSubmit`

Important rule:
- if the user enters two different valid URLs, the prompt-submit identity can still stay the same in this phase
- `Phase 3` is about command template identity, not value-specific sonic identity

#### Invalid Input Rule

Recommended first direction:
- invalid prompt values should not become first-class sampler identities by default
- validation feedback is console behavior, but not yet a required sampler template family

If we later want invalid-feedback sounds, that can be a separate explicit family like:
- `Console.Radio.Url.Invalid`
- `Console.Radio.SampleBurstTime.Invalid`

But that does not need to be part of the first canonical mapping grammar.

#### Store Mapping Rule

The canonical store seam should remain:
- one identity string in
- one stable sample position out

Recommended first contract:
- `ensureSamplePosition(commandIdentity: string): number`

Important rule:
- `audioSamplerStore.ts` owns the stable mapping result
- `ConsoleDock.tsx` should not become the owner of randomized sample allocation logic

Recommended first store completion check:
- `audioSamplerStore.ts` should stay ignorant of:
  - aliases
  - console breadcrumbs
  - transcript copy
- it should only receive canonical command identities

#### Command Routing Mapping

The intended ownership split should be:
- `stagedNavigation.ts`
  - owns command meaning
- `ConsoleDock.tsx`
  - derives the canonical command identity string at the outcome boundary
- `audioSamplerStore.ts`
  - resolves that identity to a stable sample position

Important rule:
- command identity creation should become a small named seam in `ConsoleDock.tsx`
- not a growing pile of inline string concatenation

#### Suggested First Named Seam

Recommended first helper shape:
- `resolveConsoleRadioCommandIdentity(...)`

Likely inputs:
- command family
- staged action id or flat command name
- prompt kind and submit outcome
- maybe scope metadata when needed

Likely output:
- one canonical identity string

Important rule:
- `Phase 3` should prefer one small resolver seam over many scattered string templates

Recommended first ownership:
- place the resolver in:
  - `src/app/console/ConsoleDock.tsx` first if we want the smallest pass
  - or a tiny nearby console helper file if the identity logic starts becoming noisy

Recommendation:
- if the implementation stays small, keep it local first
- if more than a handful of branches need it, extract immediately into a dedicated helper

#### First Likely Resolver Inputs

Recommended first inputs:
- `kind`
  - `root`
  - `staged`
  - `promptSubmit`
  - later `highlight`
- `actionId`
  - from staged results where available
- `scopeId`
  - when needed to disambiguate graph families
- `flatCommandName`
  - for normal non-staged commands
- `promptKind`
  - `radio.url`
  - `radio.sampleBurstTime`

Recommended first output:
- one canonical identity string only

Important rule:
- the resolver should return meaning
- not transcript labels and not raw user text

#### Test Targets

Primary test files:
- `src/app/store/audioSamplerStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- later, if the resolver is extracted:
  - one focused command-identity resolver test file

Key assertions to keep or add:
- the same semantic command identity reuses the same sample position
- two different semantic command identities usually receive different sample positions
- aliases collapse correctly:
  - `R` and `Radio`
  - `O` and `On`
  - `FF` and `Off`
- prompt-submit outcomes use stable command identities rather than raw entered values
- `RandomizeSampleTimes` changes later allocations without requiring manual command tables

Recommended focused additions:
- one test that proves:
  - `R`
  - `Radio`
  both resolve to the same identity
- one test that proves:
  - `O`
  - `On`
  both resolve to the same identity
- one test that proves prompt-submit identity stays stable even when the submitted URL text changes
- one test that proves invalid prompt text does not accidentally create the same identity as a valid prompt submit unless explicitly designed that way later

#### Implementation Order

`Phase 3` should likely be completed in this order:

1. inventory the current command-id strings emitted by `ConsoleDock.tsx`
2. define the canonical identity grammar in one doc-backed helper or resolver seam
3. replace scattered inline identity string construction with that seam
4. normalize aliases and prompt-submit outcomes onto semantic command identities
5. verify the store mapping still stays session-stable
6. verify `RandomizeSampleTimes` changes allocations without changing command meaning
7. add focused tests for alias collapse and prompt-submit identity stability

#### Likely File Edits

The most likely completion set for this phase is:
- `src/app/console/ConsoleDock.tsx`
  - replace inline transitional identity strings with the canonical resolver seam
- optionally one new nearby helper file under:
  - `src/app/console/`
  if the resolver logic becomes noisy enough to justify extraction
- `src/app/store/audioSamplerStore.ts`
  - keep the existing mapping contract narrow and confirm it only receives canonical identities
- `src/app/store/audioSamplerStore.test.ts`
  - add or tighten mapping-stability assertions
- `src/app/console/ConsoleDock.test.tsx`
  - add alias-collapse and prompt-submit identity stability coverage

#### Completion Check

`Phase 3` should count as implementation-ready and done when:
- there is one named resolver seam for console radio command identity
- the resolver emits canonical semantic identities instead of ad hoc string formats
- aliases no longer create different mapping keys
- prompt-submit outcomes no longer depend on literal submitted values
- the store mapping still stays session-stable and easy to reset with `RandomizeSampleTimes`

#### Hard Rules

- do not key the sampler mapping only by raw typed text
- do not key prompt-submit sounds by the literal entered URL or float value in the first pass
- do not allocate identities for every text-edit keystroke
- do not spread identity-string creation across many unrelated console branches once a resolver seam exists
- do not widen this phase into playback or actual sound triggering

#### Acceptance Shape

- one canonical command-identity grammar exists for the console-radio sampler template system
- aliases resolve to the same semantic command identity
- prompt-submit outcomes resolve to stable semantic command identities
- the same semantic identity reuses the same sample time throughout the session
- `RandomizeSampleTimes` re-rolls the mapping without requiring hand-authored per-command tables
- later trigger-wiring work can point at this identity seam without reopening naming or normalization rules

## [x] Phase 4 - `[4.1O3]` - `Radio 3 - Console Trigger Wiring`
### Header
- wire the first real console-trigger boundaries into the radio system
- when radio is enabled, `Enter` should request one radio burst for the accepted command identity
- when radio is enabled, staged `ArrowUp` should request one radio burst for the newly highlighted choice identity
- when radio is enabled, staged `ArrowDown` should request one radio burst for the newly highlighted choice identity
- when radio is disabled, those console interactions should stay silent
- keep the trigger surface narrow:
  - first pass is `Enter`
  - staged `ArrowUp`
  - staged `ArrowDown`
- do not fire on:
  - prompt typing
  - backspace
  - generic text cursor movement
  - history recall
  - `/`
  - unrelated global shortcuts

Important rule:
- this phase owns trigger-request plumbing from the console interaction boundary to one narrow radio burst-request seam
- this phase does not yet own real source loading or browser-audio playback

Acceptance shape:
- `Enter`, staged `ArrowUp`, and staged `ArrowDown` are the only first-pass console trigger points
- `Enter` and staged-choice cycling can resolve one canonical command identity and one stable sample position at the moment of the real interaction outcome
- the console remains fully usable when radio is off
- `Phase 5` can attach real playback to the trigger seam without reopening command-boundary policy

### [x] `Q1` - Use The Same Semantic Identity For Highlight And Accept

#### Suggestion
- locked direction:
- staged `ArrowUp` and `ArrowDown` should use the same semantic command identity family as the eventual accepted command meaning
- do not create a separate highlight-only identity tree like:
  - `Console.Radio.Highlight.On`
  - `Console.Graph.Highlight.Sketch`
- the point of arrow cycling is to preview the same command-template sound the user would later hear on accept

Examples:
- highlighting `On`
  => `Console.Radio.On`
- highlighting `Sketch`
  => `Console.Graph.Sketch`
- highlighting `Back`
  => the same `Back` identity that staged accept would use in that scope

### [x] `Q2` - Limit Arrow Triggers To Real Staged-Choice Cycling

#### Suggestion
- locked direction:
- `ArrowUp` and `ArrowDown` should only request radio bursts when they are actually cycling a staged choice
- do not fire radio bursts for:
  - prompt-text cursor movement
  - one-value prompt prefills
  - command-history traversal
  - generic feature-assist descriptors that are not part of the staged console flow in this first cut
- `Phase 4` should stay faithful to the original console-radio promise:
  - accepted command outcomes
  - staged selection cycling
  - nothing noisier than that

### Implementation Spec

Purpose:
- connect the already-landed radio state and command-identity system to the actual console interaction boundaries that should produce sound, while still keeping real playback ownership deferred to `Phase 5`

#### Scope

Owned here:
- the first explicit console trigger boundaries:
  - accepted command submit via `Enter`
  - staged highlight movement via `ArrowUp`
  - staged highlight movement via `ArrowDown`
- the enabled/disabled silence gate at the trigger-request boundary
- the shape of the first radio burst-request payload
- the handoff seam between console interaction and later runtime playback

Not owned here:
- loading the active source URL
- browser audio-context readiness
- SoundCloud/widget integration
- actual seek/start/stop playback execution
- non-console trigger families

#### Main Decisions

The two main decisions in `Phase 4` are:
- should staged highlight sounds reuse the same semantic identity as command accept?
- where should the console hand off trigger intent before the real playback bridge exists?

Locked answers:
- highlight uses the same semantic identity family as accept
- the console should hand off one narrow burst request that `Phase 5` can consume, rather than trying to perform real playback directly inside every submit or arrow branch

#### Current Code-To-Target Mapping

Current live seams:
- `src/app/console/ConsoleDock.tsx`
  - currently owns:
    - `handleSubmitCommand(...)`
    - the exact `Enter` acceptance boundaries for:
      - prompt submit
      - staged advance
      - staged execute
    - the global and popout `keydown` handlers that already route staged `ArrowUp` / `ArrowDown`
- `src/app/console/radioCommandIdentity.ts`
  - currently owns:
    - canonical identity resolution for:
      - staged execute
      - staged advance
      - prompt submit
      - flat commands
- `src/app/console/useConsoleStore.ts`
  - currently owns:
    - `cycleStagedChoice(...)`
    - `stagedChoiceIndex`
    - the current active assist/staged choice tracking
- `src/app/store/audioSamplerStore.ts`
  - currently owns:
    - radio enabled state
    - canonical source URL
    - burst duration
    - `ensureSamplePosition(commandId)`
    - the session-stable command-to-sample-position mapping

Implementation-ready read:
- `Phase 4` should be completed by tightening these existing seams
- it should not invent a second console-trigger system

#### Current Landed Baseline

Already landed in code:
- `Enter` submission already routes through one central `handleSubmitCommand(...)` seam
- accepted staged and prompt outcomes already resolve canonical radio command identities
- the sampler store can already allocate and reuse one stable sample position per canonical identity
- staged `ArrowUp` and `ArrowDown` already cycle the active choice from both the focused input and global/popout key listeners
- radio `On` / `Off` / `Url` / `SampleBurstTime` / `RandomizeSampleTimes` already exist as real console commands

This means `Phase 4` is not about inventing trigger points.

It is about:
- turning the existing command and arrow boundaries into explicit radio burst requests
- keeping those requests gated by `isRadioEnabled`
- keeping the handoff narrow enough that `Phase 5` can fulfill it with real playback later

#### Remaining Delta To Close This Phase

What still needs to be locked for `Phase 4`:
- define one named burst-request seam instead of burying trigger work in multiple inline branches
- emit burst requests from:
  - prompt submit accept
  - staged advance accept
  - staged execute accept
  - staged `ArrowUp` / `ArrowDown` highlight changes
- decide how the newly highlighted staged choice is read after cycling
- make the off-state a true trigger silence gate without breaking the rest of the command/mapping flow
- add focused tests that prove request emission only happens at the intended boundaries

Implementation-ready read:
- the remaining work is one bounded wiring pass across the existing console seams
- not a broader playback/runtime design pass

#### Trigger Boundary Rule

For `Phase 4`, the trigger boundary is the moment a real console interaction outcome becomes true.

First-pass trigger boundaries:
- accepted prompt submit
- accepted staged advance
- accepted staged execute
- staged highlight movement after `ArrowUp`
- staged highlight movement after `ArrowDown`

Do not trigger on:
- text edits while typing into `Url`
- text edits while typing into `SampleBurstTime`
- history navigation
- prompt prefill seeding by itself
- transcript append events
- generic focus movement

Plain-English rule:
- trigger outcomes, not typing noise

#### Enter Trigger Rule

`Enter` should emit a burst request after the accepted command identity is known.

Covered first-pass `Enter` outcomes:
- root/staged command acceptance that advances to another scope
- staged command acceptance that executes an action
- prompt submit acceptance for:
  - `Console.Radio.Url.PromptSubmit`
  - `Console.Radio.SampleBurstTime.PromptSubmit`

Important rule:
- `Enter` should request the burst after identity resolution and sample-position lookup are available
- it should not depend on transcript labels or raw user spelling

#### Arrow Trigger Rule

`ArrowUp` and `ArrowDown` should emit a burst request only when they actually change the highlighted staged choice.

Recommended first read:
- cycle the staged choice
- read the resulting active staged choice from store state
- resolve that highlighted choice through the same semantic identity family used for staged advance
- request one burst for that identity

Important rule:
- arrow-trigger sound should follow the newly highlighted choice
- not the previously highlighted one

#### Prompt And Assist Boundary Rule

In this phase, prompt sessions are submit-triggered only.

That means:
- `Url` prompt typing stays silent until valid `Enter`
- `SampleBurstTime` prompt typing stays silent until valid `Enter`
- prompt-only up/down behavior does not become a radio trigger surface in this cut

Feature-assist rule:
- do not broaden `Phase 4` so every generic assist descriptor starts producing radio bursts
- keep the first pass aligned to staged console choice cycling only

#### Silence Gate Rule

`Off` should act as a trigger silence gate at the burst-request boundary.

Recommended first direction:
- still allow command identity resolution to stay canonical
- still allow the sample-position map to remain a real session object
- but do not emit a burst request when `isRadioEnabled === false`

Important rule:
- `Off` silences playback requests
- it does not destroy command meaning or reopen the template-mapping model

#### Recommended Burst-Request Seam

Recommended first named seam:
- `requestRadioBurst(...)`

Recommended first ownership:
- expose it from `audioSamplerStore.ts` as one narrow transient request contract the runtime can later consume

Recommended first payload shape:
- `commandIdentity`
- `samplePosition`
- `sourceUrl`
- `sampleBurstTime`
- `triggerKind`
  - `enter`
  - `arrowUp`
  - `arrowDown`
- one monotonically increasing request sequence or timestamp

Important rule:
- `Phase 4` should publish burst intent
- `Phase 5` should decide how that intent becomes actual audio playback

#### Highlight Resolution Rule

The arrow-cycle path needs one honest way to know which choice became active.

Recommended first implementation direction:
- keep `cycleStagedChoice(...)` as the owner of choice-index mutation
- after cycling, read the updated active staged choice from store state
- resolve its identity through the existing semantic identity helper

If the current read path becomes noisy:
- add one small nearby helper that returns the currently active staged choice metadata from store state

Important rule:
- do not scrape the DOM summary text to figure out what the active choice is
- keep highlight identity derivation in state/logic space only

#### Command Routing Mapping

The intended ownership split should be:
- `ConsoleDock.tsx`
  - decides when a real trigger boundary happened
  - resolves or requests the canonical command identity for that boundary
  - publishes one burst request when radio is enabled
- `radioCommandIdentity.ts`
  - normalizes the semantic command identity
- `audioSamplerStore.ts`
  - owns:
    - enabled state
    - source URL
    - burst duration
    - sample-position lookup
    - the transient burst-request handoff state

Important rule:
- `ConsoleDock.tsx` should own boundary policy
- `audioSamplerStore.ts` should not become the owner of console key-routing policy

#### Test Targets

Primary test files:
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/store/audioSamplerStore.test.ts`
- optionally `src/app/console/radioCommandIdentity.test.ts` if highlight resolution needs helper coverage

Key assertions to add:
- when radio is on, accepted `Enter` outcomes emit one burst request with:
  - the canonical command identity
  - the mapped sample position
  - the current source URL
  - the current burst duration
- when radio is off, those same console outcomes emit no burst request
- staged `ArrowDown` emits a burst request for the newly highlighted choice
- staged `ArrowUp` emits a burst request for the newly highlighted choice
- prompt typing alone does not emit burst requests
- command-history traversal does not emit burst requests

Recommended focused additions:
- one test for `Enter` on `Radio > On`
- one test for `Enter` on a prompt submit like `Url`
- one test for staged `ArrowDown` cycling from `Sketch` to `Extrude`
- one test for staged `ArrowUp` cycling back from `Extrude` to `Sketch`
- one test proving `Off` keeps cycling/submit functional but silent

#### Likely File Edits

The most likely completion set for this phase is:
- `src/app/console/ConsoleDock.tsx`
  - add one named burst-request helper and call it from the accepted submit and arrow-cycle boundaries
- `src/app/console/useConsoleStore.ts`
  - only if needed to expose or simplify reading the currently active staged choice after cycling
- `src/app/console/radioCommandIdentity.ts`
  - reuse or slightly extend the current staged-choice identity resolution for highlight outcomes
- `src/app/store/audioSamplerStore.ts`
  - add one narrow transient burst-request seam for later runtime consumption
- `src/app/console/ConsoleDock.test.tsx`
  - add trigger-boundary coverage
- `src/app/store/audioSamplerStore.test.ts`
  - add request-contract coverage if the store owns the transient request state

#### Implementation Order

`Phase 4` should likely be completed in this order:

1. define one narrow burst-request seam and payload shape
2. route accepted `Enter` outcomes through that seam when radio is enabled
3. route staged `ArrowUp` / `ArrowDown` highlight changes through that seam
4. verify the off-state suppresses requests without breaking navigation
5. verify the request payload always uses canonical command identities and stable sample positions
6. add focused tests for submit, arrow cycling, and silent-off behavior

#### Completion Check

`Phase 4` should count as implementation-ready and done when:
- one named radio burst-request seam exists
- accepted `Enter` outcomes publish burst requests when radio is enabled
- staged `ArrowUp` / `ArrowDown` publish burst requests for the newly highlighted choice when radio is enabled
- the same semantic identity continues to map to the same session-stable sample position
- turning radio off suppresses requests without breaking console command flow
- `Phase 5` can consume the burst-request seam without reopening console trigger-boundary policy

#### Hard Rules

- do not trigger radio bursts for every typed character
- do not trigger radio bursts from generic prompt cursor movement
- do not add a second identity family just for highlighted choices
- do not put console key-routing policy inside the audio store
- do not widen this phase into actual browser-audio playback

#### Acceptance Shape

- `Enter`, staged `ArrowUp`, and staged `ArrowDown` are the only first-pass console trigger points
- those boundaries emit canonical radio burst requests only when radio is enabled
- staged highlight sound follows the newly highlighted semantic command identity
- prompt typing and other text-edit noise stay silent
- the console/radio seam is ready for `Phase 5` playback attachment without reopening trigger policy

## [x] Phase 5 - `[4.1O3]` - `Runtime Source Bridge`
### Header
- choose the first real playback bridge for the console-radio system
- consume the burst requests already published by `Phase 4`
- support loading one actual playable source for the active radio session
- support seeking or equivalent burst-position playback using the assigned sample time
- respect browser gesture-gating / autoplay restrictions
- handle not-ready state cleanly:
  - if the source is not ready yet, the system should not break the console
  - queued or skipped playback behavior must be predictable

Important rule:
- this phase proves audible playback for the console-radio seam
- it does not widen into a general audio workstation or a full SoundCloud product

Acceptance shape:
- one runtime consumer can react to `requestRadioBurst(...)`
- the active radio source can be loaded or represented by one honest first-pass bridge
- a console burst request can produce actual audible output at the assigned sample time or fail in one predictable debuggable way
- not-ready and browser-blocked states fail gracefully without breaking the console

### [x] `Q1` - Lock The First Playback Bridge To A Practical Fallback Instead Of Direct SoundCloud Control

#### Suggestion
- locked direction:
- the first technical cut should use a practical fallback bridge instead of requiring direct SoundCloud widget seeking/control on day one
- keep the user-facing radio URL state exactly as designed
- but make the first audible bridge use:
  - one bundled local audio asset
  - or one very small local clip source
- if the active URL is the default `Gusano` SoundCloud URL, the runtime can still play the first fallback asset while the app reports that radio is active

Reason:
- this makes `Phase 5` shippable
- it avoids blocking audible proof-of-life on external embed/control constraints
- it preserves the architecture so a later real SoundCloud bridge can replace only the runtime source layer

### [x] `Q2` - Lock The Runtime Consumer To One App-Level Subscriber Instead Of Console-Local Playback Code

#### Suggestion
- locked direction:
- one app/runtime subscriber should observe the store burst-request seam and drive playback
- do not put real playback execution directly inside `ConsoleDock.tsx`
- use:
  - `src/runtime/audio/AudioEngine.ts`
  - plus one small app-level host effect near `src/app/AppShell.tsx`
- keep `ConsoleDock.tsx` as the publisher of burst intent only

Reason:
- the radio is an app/runtime subsystem
- not a console-owned playback side effect
- this keeps later non-console triggers possible without rewriting the playback owner

### Implementation Spec

Purpose:
- turn the already-landed radio burst-request seam into actual audible playback through one narrow runtime bridge, while staying honest about browser constraints and avoiding direct dependency on SoundCloud widget control for the first cut

#### Scope

Owned here:
- one runtime consumer for `latestBurstRequest`
- one first-pass playable source bridge
- source readiness tracking
- burst start behavior at the mapped sample position
- burst stop timing based on `sampleBurstTime`
- one predictable not-ready / blocked-playback behavior path

Not owned here:
- a polished radio panel UI
- multiple tracks or clip banks
- waveform/timeline authoring
- persistent user media libraries
- final SoundCloud embed/widget integration

#### Main Decisions

The two main decisions in `Phase 5` are:
- what actual playback bridge should make the first console radio audible?
- where should the runtime subscriber live?

Locked answers:
- use a practical first-pass fallback bridge with one local audio source instead of requiring direct SoundCloud control
- keep the runtime subscriber app-level and feed it from the store burst-request seam

#### Current Code-To-Target Mapping

Current live seams:
- `src/app/store/audioSamplerStore.ts`
  - currently owns:
    - `latestBurstRequest`
    - `requestRadioBurst(...)`
    - radio enabled state
    - active source URL
    - burst duration
- `src/app/console/ConsoleDock.tsx`
  - currently owns:
    - publishing burst requests at the correct console interaction boundaries
  - should not gain real playback ownership in this phase
- `src/runtime/audio/AudioEngine.ts`
  - currently exists as a zero-byte placeholder
- `src/runtime/audio/TimelineTransport.ts`
  - currently exists as a zero-byte placeholder
- `src/runtime/audio/ClipLibrary.ts`
  - currently exists as a zero-byte placeholder
- `src/runtime/audio/SamplerKeys.ts`
  - currently exists as a zero-byte placeholder
- `src/app/AppShell.tsx`
  - current likely host for one app-level runtime subscription effect
- `src/app/panels/RadioPanel.tsx`
  - currently exists as a zero-byte placeholder and is not required to make this phase audible

Implementation-ready read:
- `Phase 5` should fill the empty runtime placeholders instead of inventing a second playback home
- the first host glue should live near `AppShell.tsx`, not inside the console component

#### Current Landed Baseline

Already landed in code:
- console submit and staged arrow boundaries now publish burst requests
- those requests already carry:
  - canonical command identity
  - stable sample position
  - current source URL
  - current burst duration
  - trigger kind
- turning radio off already suppresses request publication

This means `Phase 5` is not about figuring out when sound should happen.

It is about:
- reacting to those requests
- loading one actual playable source
- making sound happen at the right moment

#### Remaining Delta To Close This Phase

What still needs to be locked for `Phase 5`:
- define one first-pass playback engine contract
- decide how the active source URL maps onto the first fallback playable source
- subscribe to new burst requests without replaying stale ones on every render
- implement burst start/stop timing
- expose enough runtime status that failure is debuggable

Implementation-ready read:
- the remaining work is one bounded runtime-bridge pass
- not a new product-design pass

#### First Playback Direction

Recommended first implementation:
- use one local fallback audio asset through a simple browser playback primitive
- prefer:
  - `HTMLAudioElement`
  - or one `AudioContext` + `AudioBufferSourceNode` path if buffering/seek precision is needed quickly

Recommended first default:
- if `sourceUrl === https://soundcloud.com/keota-us/gusano`
  - map that to one bundled local fallback asset for now
- if the user enters another URL
  - keep storing it canonically
  - but the first runtime bridge may still fall back to the same local asset and surface a not-yet-directly-supported source status

Important rule:
- the first audible bridge is allowed to be an honest fallback
- do not fake full remote SoundCloud support if the runtime cannot really seek it

#### Source Resolution Rule

The first runtime bridge needs one small source-resolution step.

Recommended first seam:
- `ClipLibrary.ts`

Recommended first responsibilities:
- register the fallback local clip asset
- resolve the current radio session into one playable source descriptor
- return:
  - playable asset url or buffer key
  - source kind
  - whether the current session URL is directly supported or falling back

Important rule:
- the store should keep owning the canonical session URL
- `ClipLibrary.ts` should own the first translation from session URL to actual playable source

#### Runtime Consumer Rule

The runtime consumer should subscribe to `latestBurstRequest` and react only to new request ids.

Recommended first host:
- one small `useEffect` near `AppShell.tsx`

Recommended first behavior:
- read `latestBurstRequest`
- ignore it if:
  - request is null
  - request id was already handled
- ask `AudioEngine` to ensure the current source is ready
- if ready:
  - start playback at the requested sample position
  - stop after `sampleBurstTime`
- if not ready or blocked:
  - record one predictable runtime status instead of breaking the console

Important rule:
- do not replay the same request every render
- key runtime consumption off `requestId`

#### Audio Engine Rule

Recommended first ownership for `AudioEngine.ts`:
- hold the active media element or decoded buffer
- load/swap the currently resolved playable source
- perform seek/start
- schedule stop/end for the burst duration
- report lightweight readiness/error state back to the store

Recommended first API shape:
- `ensureSourceReady(sourceDescriptor)`
- `playBurst({ samplePosition, sampleBurstTime })`
- `stopBurst()`
- `dispose()`

Important rule:
- `AudioEngine.ts` should own browser media details
- it should not own console command identities or radio policy

#### Timeline Transport Rule

Recommended first ownership for `TimelineTransport.ts`:
- helper math for:
  - duration lookup
  - target time from normalized sample position
  - clamped burst end time

Recommended first contract:
- input:
  - track duration
  - normalized sample position
  - burst duration
- output:
  - start time
  - end time

Important rule:
- keep the first transport helper small
- it is just enough math to avoid scattering seek/burst calculations

#### Store Status Rule

`audioSamplerStore.ts` should remain the canonical UI-facing radio state owner.

Recommended first additions:
- one lightweight runtime status family, for example:
  - `idle`
  - `loading`
  - `ready`
  - `fallback`
  - `blocked`
  - `error`
- optional readouts like:
  - last handled burst request id
  - last playback error message
  - whether the current session URL is using fallback playback

Important rule:
- keep the store UI-facing and debuggable
- do not push all runtime truth into hidden component-local refs

#### Browser Gesture Rule

The first real audio must respect browser gesture gating.

Recommended first behavior:
- allow the first accepted console interaction that produced a burst request to also count as the user gesture that unlocks audio
- if the browser still blocks playback:
  - mark runtime status as `blocked`
  - do not crash the console
  - allow the next eligible interaction to retry

Important rule:
- blocked playback should be visible in status/debug output later
- not a silent no-op that looks like a broken app

#### Not-Ready Rule

If a burst request arrives before the source is ready:
- do not break console flow
- do not queue an unbounded backlog

Recommended first direction:
- keep only the most recent unhandled request while loading
- once the source is ready, either:
  - play the most recent pending request
  - or drop the pending request and record one skipped status

Recommendation:
- prefer keeping only the latest pending request
- not a queue

#### Test Targets

Primary test files:
- `src/app/store/audioSamplerStore.test.ts`
- one new runtime audio test file under:
  - `src/runtime/audio/`
- optionally one host-level app/runtime subscription test if the effect lives near `AppShell.tsx`

Key assertions to add:
- a new burst request can be consumed exactly once by request id
- the engine loads the fallback playable source for the default radio URL
- `samplePosition` becomes a real playback start time within track bounds
- `sampleBurstTime` produces a bounded stop time
- blocked or not-ready playback updates status predictably
- turning radio off does not emit new requests and does not break the runtime subscriber

Recommended focused additions:
- one engine test for normalized sample-position to time conversion
- one engine test for burst stop timing
- one store/runtime test proving fallback mode for the default `Gusano` URL
- one status test proving blocked playback becomes visible
- one host test proving the same `requestId` is not replayed twice

#### Likely File Edits

The most likely completion set for this phase is:
- `src/runtime/audio/AudioEngine.ts`
  - first real playback owner
- `src/runtime/audio/TimelineTransport.ts`
  - burst timing math
- `src/runtime/audio/ClipLibrary.ts`
  - fallback source registration and session-url resolution
- `src/runtime/audio/SamplerKeys.ts`
  - only if needed for small runtime helpers, not as a second identity system
- `src/app/store/audioSamplerStore.ts`
  - runtime status additions and maybe last-consumed-request tracking
- `src/app/AppShell.tsx`
  - one app-level runtime subscription effect
- one new runtime audio test file
- existing store tests

#### Implementation Order

`Phase 5` should likely be completed in this order:

1. lock one fallback playable asset and resolve it through `ClipLibrary.ts`
2. implement minimal burst timing math in `TimelineTransport.ts`
3. implement `AudioEngine.ts` with one honest ready/load/play/stop contract
4. add one app-level subscriber that consumes new `latestBurstRequest` ids
5. add runtime status reporting for ready/fallback/blocked/error
6. add focused tests for playback math, request consumption, and failure behavior

#### Completion Check

`Phase 5` should count as implementation-ready and done when:
- one real runtime consumer reacts to new burst requests
- the console-radio flow can produce audible output through the fallback bridge
- the default radio source path has one honest playable representation
- burst playback uses the mapped sample position and stored burst duration
- blocked or not-ready playback fails predictably without breaking the console
- later real SoundCloud support can replace the source-resolution layer without reopening Phases 1 through 4

#### Hard Rules

- do not move actual playback code into `ConsoleDock.tsx`
- do not claim full direct SoundCloud control unless it is really implemented
- do not let not-ready playback break console interaction flow
- do not create an unbounded pending-request queue
- do not widen this phase into a multi-track or timeline-authoring system

#### Acceptance Shape

- `Phase 4` burst requests now have one real playback consumer
- the default radio path can make audible sound through one honest fallback source bridge
- playback start uses the mapped sample position and burst duration
- blocked, loading, fallback, and error states are visible enough to debug
- the radio system becomes audibly real without reopening the earlier console/state/template phases

## [x] Phase 6 - Real Link Playback Bridge

### Header
- keep the landed fallback generated-tone bridge intact as the safety net
- add one honest real source-backed playback path beside it
- make the active radio URL materially affect what the user actually hears when the URL is supported
- support one narrow first real-link family for:
  - the default `Gusano` URL
  - later other supported links if feasible
- keep the console trigger/request system unchanged:
  - same command identities
  - same sample-position mapping
  - same burst-request seam

Important rule:
- this phase is about making the active link materially control playback when that link is genuinely supported
- not about redesigning the console, replacing the radio state model, or deleting the working fallback bridge

Acceptance shape:
- a supported active radio URL can drive actual source-backed playback instead of the fallback generated tone
- the runtime can seek or otherwise reach the requested burst position within that supported real source path
- unsupported links fail honestly and predictably instead of silently pretending to work

### [x] Q1 - What Exact Real-Link Strategy Should Own The First Non-Fallback Playback Path?

#### Suggestion
- the first non-fallback path should be provider-aware, not generic
- start with one honest supported family:
  - SoundCloud URLs first if the embed/widget bridge is practical in this app shell
- keep source-resolution ownership in the runtime audio layer so later providers can be added without reopening the console or store phases

#### Locked Read
- the first real-link path should be provider-aware and honest
- do not pretend arbitrary user URLs are all equally playable
- keep `ClipLibrary.ts` as the source-resolution owner and let it classify the URL into:
  - supported real-link playback
  - fallback playback
  - unsupported

### [x] Q2 - How Should Unsupported User Links Behave Once Real-Link Playback Exists?

#### Suggestion
- keep fallback behavior explicit
- do not silently downgrade without status
- prefer one visible runtime/source status such as:
  - `real-link`
  - `fallback`
  - `unsupported`
- the user should be able to tell whether the pasted URL is actually what is being played

#### Locked Read
- unsupported custom links should become an explicit unsupported runtime state
- they should not silently play the fallback tone while pretending the pasted link worked
- the fallback tone remains the default-path safety net for known fallback-backed radio flow, not a hidden downgrade for every unsupported custom URL

### Implementation Spec

Purpose:
- make the radio URL materially affect playback when the URL resolves to a supported real-link provider path instead of only selecting a fallback generated source descriptor

#### Scope

Owned here:
- the first supported real-link or real-source-backed playback path
- source capability detection
- honest supported-versus-unsupported status
- runtime behavior for seeking/starting bursts inside the supported real source path

Not owned here:
- a visible toolbar/panel control surface
- broad multi-provider media ingestion
- editing or authoring tools

#### Main Decisions

- Keep the current fallback generated-tone bridge alive as the known-good baseline.
- Add one provider-aware real-link path beside that fallback, not instead of it.
- Treat unsupported user links as explicit runtime/source state, not as silent fallback success.
- Keep source-resolution ownership in `ClipLibrary.ts` and runtime execution ownership in `AudioEngine.ts`.

#### Current Code-To-Target Mapping

- `src/runtime/audio/ClipLibrary.ts`
  - currently resolves every radio URL to the fallback generated-tone descriptor
  - needs to classify URLs into:
    - supported real-link source
    - fallback generated source
    - unsupported source
- `src/runtime/audio/AudioEngine.ts`
  - currently executes the fallback generated-tone path only
  - needs one additional supported real-link execution path
- `src/runtime/audio/TimelineTransport.ts`
  - currently provides the narrow timing/seek math used by the fallback bridge
  - may stay small, but needs to remain reusable by the supported real-link path if burst-position translation is shared
- `src/app/AppShell.tsx`
  - currently consumes burst requests once and always routes through the fallback-style resolution path
  - needs to branch honestly on resolved source kind and publish clearer runtime status
- `src/app/store/audioSamplerStore.ts`
  - already holds runtime status/message/source-kind fields
  - needs an explicit unsupported state/read if it does not already distinguish that cleanly enough for UI/debug use

#### Current Landed Baseline

- `Phase 5` is complete.
- Burst requests already flow from the console into one app-level runtime subscriber.
- The app can already make audible sound through the fallback generated-tone bridge.
- Runtime status can already report fallback/loading/error-style state.
- The missing capability is that the active pasted URL does not yet determine a real playable source path.

#### Remaining Delta To Close This Phase

- teach source resolution to recognize at least one supported real-link family
- add one real-link execution path in the runtime audio layer
- distinguish fallback-backed playback from supported real-link playback in status
- make unsupported pasted links fail explicitly instead of feeling like silent success

#### Recommended Direction

- keep `ClipLibrary.ts` as the source-resolution owner
- extend it so the runtime can distinguish:
  - fallback generated tone
  - supported real-link playback
  - unsupported source
- keep `AudioEngine.ts` as the execution owner
- keep `AppShell.tsx` as the single runtime subscriber/bridge host
- do not move provider logic into `ConsoleDock.tsx` or the store

#### Source Descriptor Rule

- extend the current descriptor model instead of replacing it
- the resolved source descriptor should tell the runtime enough to answer:
  - what provider/source kind is this
  - can it actually play
  - can it seek to a burst position
  - if not playable, should it report unsupported or use the known fallback descriptor
- the descriptor should make the distinction between:
  - default fallback bridge
  - supported real-link bridge
  - unsupported user link

#### First Supported Real-Link Family

- the first real-link family should be SoundCloud if the app can control it honestly enough
- if SoundCloud widget/control is still too constrained in the current shell, use one narrower real-link family that is actually controllable rather than shipping fake generic URL support
- whatever first family lands, document it as the explicitly supported family instead of implying broad arbitrary-link support

#### Unsupported Link Rule

- unsupported custom links should not auto-play the fallback generated tone as if the link worked
- they should set an explicit unsupported runtime/source status and skip playback
- the user must be able to distinguish:
  - the radio is using the known fallback path
  - the pasted URL is unsupported

#### Runtime Subscriber Rule

- keep `AppShell.tsx` as the host that consumes `latestBurstRequest`
- after source resolution, branch into:
  - supported real-link execution
  - fallback execution
  - unsupported/no-play execution
- continue marking burst requests handled once, so this phase does not reopen the earlier request ownership model

#### Audio Engine Rule

- evolve `AudioEngine.ts` from a single-source-kind executor into a small multi-source-kind executor
- keep the execution seam narrow:
  - one input burst request
  - one resolved source descriptor
  - one runtime result/status output
- do not widen this phase into a general media workstation or provider SDK dump site

#### Store Status Rule

- `audioSamplerStore.ts` should expose enough runtime truth for later UI work in `Phase 7`
- at minimum, the runtime/store read should be able to distinguish:
  - `fallback`
  - `real-link`
  - `unsupported`
  - `loading`
  - `error`
- if `unsupported` is not yet a distinct state/value, add it in this phase

#### Likely File Targets

- `src/runtime/audio/ClipLibrary.ts`
- `src/runtime/audio/AudioEngine.ts`
- `src/runtime/audio/TimelineTransport.ts`
- `src/app/store/audioSamplerStore.ts`
- `src/app/AppShell.tsx`
- later optional provider helpers under `src/runtime/audio/`

#### Likely File Edits

- `src/runtime/audio/ClipLibrary.ts`
  - add URL/provider classification
  - resolve supported real-link descriptors versus fallback versus unsupported
- `src/runtime/audio/AudioEngine.ts`
  - add one supported real-link playback path beside the fallback tone path
- `src/runtime/audio/TimelineTransport.ts`
  - reuse or extend burst-position translation only if the real-link path benefits from the same math
- `src/app/AppShell.tsx`
  - branch runtime handling by resolved source kind and publish clearer runtime state
- `src/app/store/audioSamplerStore.ts`
  - extend runtime/source status values if needed for unsupported and real-link distinction

#### Test Targets

- one runtime-source resolution test for:
  - supported real-link URL
  - fallback default URL
  - unsupported custom URL
- one playback test proving the supported real-link path can honor burst-position requests honestly enough for the first provider
- one status test proving unsupported links do not masquerade as fallback or real-link playback
- one app-bridge test proving `AppShell.tsx` reports the right runtime/source status based on resolved source kind

#### Implementation Order

1. Extend `ClipLibrary.ts` so it can classify and resolve supported real-link, fallback, and unsupported URLs.
2. Extend `audioSamplerStore.ts` runtime status/source-kind reads if `unsupported` and `real-link` are not already first-class enough.
3. Add one supported real-link execution path in `AudioEngine.ts`.
4. Update `AppShell.tsx` so burst-request consumption branches honestly by resolved source kind and reports the right runtime state.
5. Add focused tests around resolution, unsupported behavior, and real-link execution.

#### Completion Check

- a supported active radio URL now changes what the user actually hears
- the fallback generated tone still works when the system intentionally uses the fallback path
- unsupported custom links do not masquerade as working playback
- the runtime/store state is explicit enough for the later toolbar phase to read truthfully

#### Hard Rules

- do not reopen the console trigger system here
- do not pretend every arbitrary URL is supported if it is not
- do not collapse unsupported or failed real-link playback into silent fallback without status
- do not delete or destabilize the working fallback bridge before the supported real-link path is proven

## [x] Phase 7 - Radio Toolbar And Control Surface

### Header
- add one visible radio toolbar/control surface now that real-link playback exists
- let the user inspect and control the radio without relying on the console for every basic action
- keep the surface app-side, optional, and clearly bound to the already-landed radio store/runtime seams

First intended controls:
- enabled / disabled state
- current source readout
- runtime/source status
- current time readout
- total duration readout
- one seekable `ParaSlider` for time position
- sample burst time
- randomize sample times
- reload / retry source
- play / pause only if the runtime can expose it honestly in this cut

Later possible controls:
- seek readout or scrubber
- volume
- mute
- fallback versus real-link badge styling

Important rule:
- this phase should visualize and control the existing radio runtime
- not invent a second radio system beside the console/store/runtime seam

Acceptance shape:
- the user can see live radio state from a visible control surface
- the user can toggle radio, inspect source/status, adjust time position, adjust burst time, and randomize sample times without using the console
- the surface reflects whether the runtime is using real-link playback, fallback playback, blocked playback, unsupported URL state, or error state
- the console `Radio` scope exposes explicit toolbar visibility commands instead of relying on a shell-only toggle

### [x] Q1 - Should The First Visible Surface Be A Toolbar Strip Or A Small Panel?

#### Suggestion
- start as a compact hosted panel that reads visually like a toolbar strip
- use the existing `RadioPanel.tsx` seam so the first UI can live in the normal app host model instead of inventing a one-off shell strip
- keep it compact, always legible, and easy to move later if the shell hosting changes

#### Locked Read
- the first visible radio UI should be a compact hosted panel built from the shared toolbar template layout
- it should use the existing panel seam plus the shared toolbar shell contract, not a brand-new shell-only special case
- the panel should stay visually lightweight enough that it still reads like a toolbar/control surface instead of a workstation panel

### [x] Q2 - Which Controls Must Be Visible In The First UI Cut?

#### Suggestion
- minimum first controls:
  - on / off
  - source readout
  - runtime/source status readout
  - sample burst time
  - randomize sample times
  - reload / retry source
- include play / pause only if `Phase 6` exposes an honest transport command seam
- defer seek and volume unless the runtime exposes real state/commands for them

#### Locked Read
- the first shipped toolbar/panel must show:
  - on / off
  - current URL/source readout
  - runtime/source status
  - current time readout
  - total duration readout
  - one seekable `ParaSlider`
  - sample burst time
  - randomize sample times
  - reload / retry source
- play / pause is allowed only if the runtime exposes a true control seam during this phase
- volume and mute stay deferred unless the runtime already supports them honestly
- the toolbar should be opened and closed from the console `Radio` scope through:
  - `OpenToolbar`
  - `CloseToolbar`
- aliases:
  - `OpenToolbar -> OT`
  - `CloseToolbar -> CT`

### Implementation Spec

Purpose:
- expose the radio subsystem as a visible, debuggable, user-controllable tool after real-link playback now exists

#### Scope

Owned here:
- one visible hosted radio panel with toolbar-style controls
- binding the panel to canonical radio store/runtime state
- adding only the minimum store/runtime command seams required for honest user-facing controls

Not owned here:
- broad visual polish beyond a solid first ship
- advanced media browsing
- timeline editing
- a second parallel radio state model

#### Main Decisions

- use `src/app/panels/RadioPanel.tsx` as the first concrete UI seam
- use the shared toolbar template from `Toolbar.md` as the visual/layout contract
- keep `audioSamplerStore.ts` as the canonical state surface
- allow this phase to add narrow runtime/store control seams only where the UI truly needs them
- keep the first visible surface compact, readable, and obviously status-driven

#### Current Code-To-Target Mapping

- `src/app/console/stagedNavigation.ts`
  - current owner of the `Radio` scope grammar
  - needs to extend the `Radio` choice list with:
    - `OpenToolbar`
    - `CloseToolbar`
  - needs aliases:
    - `OT`
    - `CT`
- `src/app/console/ConsoleDock.tsx`
  - current owner of radio command execution routing
  - needs to route:
    - `radio.openToolbar`
    - `radio.closeToolbar`
  - and keep console transcript behavior honest
- `src/app/panels/RadioPanel.tsx`
  - current placeholder seam for the first visible radio UI
  - should become the compact hosted radio toolbar consumer for this phase
- `src/app/components/ViewportOverlayToolPanel.tsx`
  - current shared toolbar shell/template owner
  - should provide the title bar, drag/resize, body section, and split-layout contract for the first radio toolbar when feasible
- `src/app/AppShell.tsx`
  - current app/runtime bridge host
  - should mount the first radio panel in an optional visible location
- `src/app/store/audioSamplerStore.ts`
  - current canonical owner for:
    - enabled state
    - active URL
    - sample burst time
    - runtime status
    - runtime source kind
  - needs first-class transport view state for:
    - current time
    - duration
    - seek in progress / pending if needed
  - may need a few narrow UI-facing actions such as:
    - toggle on/off
    - reload/retry request marker
    - transport seek/play/pause controls if they are truly supported
- `src/runtime/audio/AudioEngine.ts`
  - current playback execution owner
  - needs one narrow transport read/control seam if the panel is going to expose:
    - current time
    - duration
    - seek
    - play/pause
- `src/runtime/audio/SoundCloudWidgetClient.ts`
  - likely first owner for any honest real-link:
    - current-time polling/subscription
    - duration readback
    - seek
    - retry/load/play/pause control
    - that is specific to the SoundCloud path

#### Current Landed Baseline

- `Phase 6` is complete.
- Radio can already be controlled from the console.
- Real-link playback now exists for the supported SoundCloud path.
- The runtime/store already expose meaningful status such as:
  - fallback
  - loading
  - blocked
  - unsupported
  - error
- The main missing capability is a visible non-console control surface.

#### Remaining Delta To Close This Phase

- mount a real visible radio panel in the app shell
- read live radio state from the store without duplicating ownership
- expose the first minimum UI controls
- add explicit console actions for opening and closing the toolbar from `> Radio >`
- add only the missing narrow action seams needed for:
  - retry/reload
  - transport readback
  - seek
  - optional play/pause if honest
- keep panel state synchronized with console-driven radio changes

#### Placement Rule

- the first panel should live in the normal app/panel host model
- do not special-case a floating overlay just for radio
- if the current shell makes placement ambiguous, prefer one simple always-available hosted location over a more clever but less stable layout experiment
- when possible, placement and chrome should still follow the shared toolbar template contract from `Toolbar.md`
- the user-facing way to reveal or hide that surface should still come from the console `Radio` scope, not only from a shell-local button

#### Console Toolbar Visibility Rule

- once `Phase 7` starts, the `Radio` console scope should gain two new sibling actions:
  - `OpenToolbar`
  - `CloseToolbar`
- these belong beside the existing radio actions like:
  - `On`
  - `Off`
  - `Url`
  - `SampleBurstTime`
  - `RandomizeSampleTimes`
- aliases:
  - `OpenToolbar -> OT`
  - `CloseToolbar -> CT`
- `OpenToolbar` should reveal the visible radio toolbar if it is not already open
- `CloseToolbar` should hide the visible radio toolbar if it is open
- this should use one canonical visibility state, not separate panel-local and console-local visibility flags

#### Radio Scope Extension Rule

- `Phase 7` extends the landed `Radio` scope grammar rather than replacing it
- the intended `Radio` scope for the toolbar phase becomes:
  - `On`
  - `Off`
  - `Url`
  - `SampleBurstTime`
  - `RandomizeSampleTimes`
  - `OpenToolbar`
  - `CloseToolbar`
- important rule:
  - `OpenToolbar` and `CloseToolbar` are visibility commands for the toolbar surface
  - they are not substitutes for `On` / `Off`

#### Toolbar Template Rule

- `Phase 7` should reuse the shared toolbar template layout described in `docs/Human-Plans/Architecture/Toolbar.md`
- that means the first radio UI should inherit the same shell expectations for:
  - title bar
  - close action area
  - drag behavior
  - resize behavior
  - sectioned body
  - optional split-body layout if the content honestly needs it
- the radio toolbar should not introduce a one-off shell language if the shared toolbar template already fits

#### Toolbar Layout Shape

- the first radio toolbar should read as one compact floating tool window or hosted toolbar panel using the shared shell
- recommended first body structure:
  - `Transport`
  - `Sampler`
  - optional later `Status / Source`
- if two body regions compete for height, use the shared toolbar split-layout pattern rather than inventing a radio-only divider

#### Title Bar Rule

- the radio toolbar should use the shared toolbar title-bar structure:
  - title
  - optional title meta/status
  - trailing actions
- if the radio surface exposes quick actions in the title bar, keep them consistent with the shared toolbar language instead of inventing custom chrome

#### Canonical State Rule

- `RadioPanel.tsx` should read directly from `audioSamplerStore.ts`
- it may use small derived view helpers, but it must not become a second owner of:
  - enabled state
  - URL
  - runtime status
  - burst duration
- toolbar visibility should also use one canonical owner rather than panel-local toggles

#### First Control Set

- required first controls:
  - on
  - off
  - source URL readout
  - runtime/source-kind status readout
  - current time readout
  - total duration readout
  - one `ParaSlider` seek control for time position
  - sample burst time control
  - randomize sample times
  - reload / retry source
- optional first controls:
  - play / pause only if the runtime already exposes real commands and real state

#### Toolbar Visibility State Rule

- the toolbar must have one canonical visible/hidden state
- `OpenToolbar` and `CloseToolbar` from the console must read and write that same state
- if the shell later adds a direct UI button, that button must use the same state instead of introducing a second visibility model

#### Section Ownership Rule

- the transport controls should live in one shared-labeled body section
- the sampler controls should live in a separate labeled body section
- the panel should not become one undifferentiated block of controls if the shared toolbar section model already fits

#### Transport Truth Rule

- the panel must not fake transport position
- if `Phase 7` ships a time readout and `ParaSlider`, the runtime must expose:
  - current time
  - total duration
  - seek success/failure truth
- if one source kind cannot support seek honestly, the UI must show that clearly instead of pretending the slider works

#### ParaSlider Rule

- the first visible transport control should be a `ParaSlider`
- it should bind to normalized time position derived from:
  - current time
  - total duration
- user adjustment must request a real seek in the runtime, not just move UI state locally
- if the source is loading, blocked, unsupported, or otherwise not seekable, the slider should disable or reject interaction clearly

#### Sample Burst Time Control Rule

- the toolbar/panel may use a compact numeric input or stepper-style control
- edits must write back to `audioSamplerStore.ts`
- invalid values should be rejected or clamped clearly instead of creating silent broken state

#### Randomize Rule

- the panel must expose the same `RandomizeSampleTimes` action the console already owns
- invoking it from the panel must update the same session map the console uses
- do not introduce a second panel-only randomization path

#### Reload / Retry Rule

- the panel should expose one explicit retry/reload action so the user can recover from:
  - blocked
  - unsupported after URL change
  - transient real-link load failure
- the first implementation may be narrow:
  - reload the current source
  - retry the supported provider path
- do not widen this into general media management

#### Play / Pause Rule

- only ship play / pause if the runtime can answer both of these honestly:
  - is playback currently active
  - can the runtime actually honor play or pause for the active source kind
- if the runtime cannot do that yet, show status only and defer play/pause to `Phase 8` or a follow-on

#### Seek Rule

- seek is now required in this phase
- the panel must let the user move to another time position through the `ParaSlider`
- the runtime/store path must report enough truth that the panel can show:
  - current time
  - duration
  - whether the seek target actually became active

#### Status Readout Rule

- the visible surface should clearly show:
  - whether radio is enabled
  - what URL/source is active
  - current time and duration
  - whether the runtime is:
    - real-link
    - fallback
    - loading
    - blocked
    - unsupported
    - error
- prefer plain readable labels over overly visual-only status chrome in the first cut

#### Test Targets

- one panel render test proving the visible surface reflects store state
- one console-routing test for:
  - `OpenToolbar`
  - `CloseToolbar`
- one interaction test for:
  - on / off
  - transport slider seek
  - sample burst time change
  - randomize sample times
- one status-readout test for:
  - fallback
  - soundcloud real-link
  - blocked
  - unsupported
  - error
- one transport-state test proving the panel reads:
  - current time
  - duration
  - disabled/non-seekable state correctly
- one app-shell test proving the panel mounts in the intended host surface
- one sync test proving console-driven open/close and direct panel close stay on the same visibility state

#### Likely File Edits

- `src/app/panels/RadioPanel.tsx`
  - first actual radio toolbar implementation
- `src/app/components/ViewportOverlayToolPanel.tsx`
  - reuse directly if the current shell allows, or extend narrowly if radio needs one missing shared-shell capability
- `src/app/AppShell.tsx`
  - mount the panel
- `src/app/console/stagedNavigation.ts`
  - add `OpenToolbar` / `CloseToolbar` radio grammar
- `src/app/console/ConsoleDock.tsx`
  - add console execution routing for toolbar visibility
- `src/app/store/audioSamplerStore.ts`
  - add only any missing UI-facing transport/action seams
  - and likely one canonical toolbar visibility field/action seam
- optional runtime audio files only if reload/play/pause truly need a narrow new control seam
  - and now transport readback / seek support almost certainly will

#### Implementation Order

1. Lock the first host location in `AppShell.tsx`.
2. Confirm the shared toolbar template layout from `Toolbar.md` is the shell contract for this panel.
3. Add one canonical toolbar visibility state and wire `OpenToolbar` / `CloseToolbar` into the console `Radio` scope.
4. Add the missing runtime/store transport truth for current time, duration, and seek.
5. Implement `RadioPanel.tsx` as a compact toolbar-template consumer with the `ParaSlider`.
6. Reuse or extend `ViewportOverlayToolPanel.tsx` only where the shared shell needs a narrow radio-friendly host adaptation.
7. Add any missing narrow store actions for UI-driven on/off, seek, burst time edit, randomize, and retry.
8. Add optional runtime/store play/pause only if the current real-link path can support it honestly.
9. Add focused render and interaction tests.

#### Completion Check

- the user can inspect live radio status without opening the console
- the user can perform the main radio controls, including time adjustment, from the visible panel
- console-driven and panel-driven radio actions stay synchronized through one canonical store/runtime path
- the toolbar can be opened and closed from the console `Radio` scope through `OpenToolbar` and `CloseToolbar`
- the first visible radio UI is honest about fallback, real-link, blocked, unsupported, and error state

#### Hard Rules

- do not fork radio state into panel-local ownership
- do not build a second independent transport model in the panel
- do not ship fake play/pause or seek controls that the runtime cannot really honor
- do not invent a radio-only shell layout if the shared toolbar template already fits
- do not invent a second toolbar visibility state separate from the console-owned radio command path
- do not widen this phase into a DAW-like control surface

## [ ] Phase 8 - Hardening And Follow-Through

- add transcript/status lines where they materially help explain radio behavior
- verify `Url` invalid-input handling
- verify `SampleBurstTime` float parsing and rejection rules
- verify `Off` is a real silence gate
- verify `RandomizeSampleTimes` really affects later command playback
- verify fallback versus real-link status is understandable
- verify toolbar state stays synchronized with console/radio runtime truth once the UI surface exists
- decide whether the first pass needs a visible readout of:
  - current URL
  - current burst time
  - radio enabled state
- stop before broadening into non-console trigger coverage unless the console-first cut is solid

Acceptance shape:
- the console-first radio flow feels deterministic and debuggable
- invalid radio inputs do not leave the console in a broken scope
- the first pass is strong enough to act as the template for later non-console triggers

## [x] Phase 9 - Sampler Sequencer Surface

### Header
- add one simple sampler surface that reuses the current radio/url source
- keep the first sampler deliberately narrow:
  - one row
  - one bar
  - one current source
  - one BPM control
  - one step-count control
  - one play loop
  - one optional note-repeat block
- use the current radio runtime/store seams as the source-of-truth foundation instead of inventing a second disconnected audio system

First intended sampler controls:
- source/status readout for the current radio/url source
- step-count `ParaSlider`
  - locked values:
    - `4`
    - `8`
    - `16`
    - `32`
- BPM `ParaSlider`
- one horizontal row of step cells
- per-step enabled/disabled state
- per-step stable cue assignment into the current source
- `Play`
- `Stop`
- `Reroll Step`
- `Reroll All`
- one narrow `Note Repeat` block:
  - enabled
  - repeat count
  - repeat rate

Acceptance shape:
- the user can see one row of step cells driven by the current radio/url source
- the user can pick `4`, `8`, `16`, or `32` steps and the row resizes correctly
- each step holds a stable cue until rerolled or regenerated
- the user can set BPM and hear the pattern loop as one bar
- `Note Repeat` can retrigger inside a step window without spilling into the next step accidentally

### [x] Q1 - Should The First Sampler Reuse Radio Source Ownership Or Create A Separate Sampler Source Model?

#### Suggestion
- reuse the current radio source/runtime ownership
- treat the first sampler as a sequencer surface over the active radio source, not as a second source-management subsystem
- keep source identity, provider support, fallback state, and runtime status canonical in the already-landed radio seams

#### Locked Read
- the first sampler should reuse the current radio source/runtime seams
- `Radio` remains the owner of:
  - active URL/source
  - runtime/source-kind status
  - real-link versus fallback status
  - transport/provider truth
- `Sampler` should own only:
  - pattern state
  - step list
  - BPM
  - play/stop loop state
  - note-repeat settings
- do not create a second parallel source-management model in the first sampler pass

### Implementation Spec

Purpose:
- add one honest simple sequencer that makes the current radio source musically explorable without widening immediately into a DAW or multi-lane audio workstation

#### Scope

Owned here:
- one simple single-row step sequencer surface
- one canonical sampler pattern store
- one scheduling/transport loop for a one-bar repeating pattern
- per-step stable cue assignment into the current active radio source
- one narrow note-repeat block

Not owned here:
- multi-track arrangement
- waveform editing
- imported sample-library management
- MIDI
- offline render/export
- effects chains

#### Main Decisions

- reuse the current radio source/runtime seams as the source owner
- keep the first sampler to one bar and one row
- lock the first step-count choices to:
  - `4`
  - `8`
  - `16`
  - `32`
- keep each step bound to one stable cue into the current source until rerolled
- keep the first playback model to:
  - `Play`
  - `Stop`
- keep `Note Repeat` narrow:
  - enabled
  - repeat count
  - repeat rate

#### Current Landed Baseline

- `Phase 7` shipped the first visible radio toolbar in `RadioPanel.tsx`.
- `audioSamplerStore.ts` already owns the canonical radio source, runtime/source-kind status, and transport truth.
- `AppShell.tsx` already owns the app-level runtime bridge for:
  - burst requests
  - reload requests
  - seek requests
- `AudioEngine.ts` already knows how to:
  - resolve supported/fallback radio sources
  - play one-off bursts
  - report transport state
  - perform seek for the supported SoundCloud path
- `TimelineTransport.ts` currently only exposes `resolveBurstWindow(...)`, so the sampler timing math is still mostly missing.
- `AudioSamplerPanel.tsx` exists but is still empty.

Plain-English baseline:
- the repo already has enough source/runtime truth to drive a sequencer
- what is missing is the actual sampler pattern state, timing helpers, loop scheduler, and visible sampler surface

#### Remaining Delta To Close This Phase

- define one canonical sampler state slice
- add one-bar and per-step timing helpers
- add stable per-step cue assignment and reroll behavior
- add one scheduler/loop seam that advances the playhead and fires step bursts
- implement the first visible sampler panel
- mount it in the shell without bloating the radio toolbar
- prove the loop, reroll, BPM, and note-repeat behavior with focused tests

#### Current Code-To-Target Mapping

- `src/app/store/audioSamplerStore.ts`
  - current owner of radio state and runtime transport truth
  - should stay the owner of:
    - active source URL
    - runtime/source-kind status
    - transport/provider truth
  - may provide the source/status readout the sampler consumes
- `src/runtime/audio/AudioEngine.ts`
  - current owner of burst playback
  - likely needs one narrow scheduled-trigger seam that can fire repeated cue bursts on transport timing instead of only one-off UI-triggered bursts
- `src/runtime/audio/TimelineTransport.ts`
  - current best seam for sampler timing math and burst-window scheduling
  - today it only contains `resolveBurstWindow(...)`
  - should own the first sampler timing helpers instead of pushing timing math into React components
- `src/runtime/audio/ClipLibrary.ts`
  - current owner of source descriptor resolution
  - should stay the owner of supported versus fallback source resolution
- `src/app/panels/RadioPanel.tsx`
  - current visible radio toolbar
  - should not absorb the first sampler row directly if that makes the radio toolbar bloated
- `src/app/panels/AudioSamplerPanel.tsx`
  - current empty seam
  - recommended first concrete UI host for the sampler surface in this phase
- `src/app/AppShell.tsx`
  - current host for radio/runtime surfaces
  - should mount the sampler panel once the canonical visibility and state seams exist

#### Recommended New Sampler Seams

- `src/app/store/audioSamplerStore.ts`
  - if kept as the shared radio+sampler store, add a clearly separated sampler slice for:
    - `stepCount`
    - `bpm`
    - `steps`
    - `isPlaying`
    - `playheadStepIndex`
    - `noteRepeat`
  - or add a dedicated sampler store only if the shared file becomes too muddy
- `src/runtime/audio/TimelineTransport.ts`
  - add helpers for:
    - one-bar duration from BPM
    - step duration from BPM plus step count
    - repeat timing inside a step window
- `src/runtime/audio/AudioEngine.ts`
  - add one narrow scheduled burst API for sampler playback such as:
    - trigger cue burst now
    - or queue one immediate step burst from a cue ratio plus burst duration
- `src/app/panels/AudioSamplerPanel.tsx`
  - implement the first visible sampler row and controls here

#### First Honest Runtime Direction

- the first loop scheduler should favor the already-honest generated/fallback burst path
- the supported SoundCloud path may be allowed, but the sampler must not promise drum-machine-tight timing if the widget path cannot hold that standard
- if needed, the first sampler can explicitly say:
  - generated/fallback sources are the most timing-stable
  - supported real-link sources are best-effort for the first pass

That keeps the sampler honest:
- useful immediately
- but not pretending every source provider has the same transport tightness

#### First Data Shape

- sampler state should minimally hold:
  - `stepCount`
  - `bpm`
  - `isPlaying`
  - `playheadStepIndex`
  - `steps`
  - `noteRepeat`
- each step should minimally hold:
  - `id`
  - `index`
  - `enabled`
  - `cueRatio` or `cueSeconds`
- note-repeat state should minimally hold:
  - `enabled`
  - `count`
  - `rate`

Recommended first concrete names:
- `samplerStepCount`
- `samplerBpm`
- `samplerIsPlaying`
- `samplerPlayheadStepIndex`
- `samplerSteps`
- `samplerNoteRepeat`

Recommended first step shape:
- `id`
- `index`
- `enabled`
- `cueRatio`

Reason:
- `cueRatio` stays source-agnostic and fits the current radio burst model better than hard-storing absolute seconds in the first pass

#### Cue Assignment Rule

- each step gets a random cue assignment from the current active radio source
- cue assignments should be:
  - random across the row
  - stable until rerolled
- changing step count should:
  - preserve leading existing steps where possible
  - generate fresh cues only for newly created steps
  - drop steps that fall outside the new active length
- the randomizer should avoid the extreme end tail so a burst still produces audible content

#### Playback Rule

- the first sampler pattern is one bar long
- BPM defines the bar duration
- step count defines the subdivision inside that bar
- `Play` starts looping from step `1`
- each enabled step triggers its stored cue at the correct transport boundary
- after the last active step, playback loops back to the first step
- `Stop` halts the loop and resets the visible playhead

Implementation boundary:
- the scheduler should publish or invoke the same narrow burst path the repo already trusts, rather than inventing a second playback system just for sampler steps
- the sampler’s new work is:
  - deciding when the next step fires
  - which cue ratio it uses
  - how note-repeat subdivides that step window
- not replacing the existing runtime source-resolution stack

#### Note Repeat Rule

- when `Note Repeat` is off:
  - a step triggers once
- when `Note Repeat` is on:
  - the same step can retrigger multiple times inside the current step window
- retriggers must fit inside that step duration instead of drifting into the next step
- recommended first visible values:
  - count:
    - `1`
    - `2`
    - `4`
    - `8`
  - rate:
    - derived from the current step window or a small fixed multiplier family

#### Source Truth Rule

- the sampler must not pretend it owns source loading
- if the current radio source is:
  - unsupported
  - blocked
  - loading
  - fallback
  - error
  the sampler surface must show that honestly and behave accordingly
- if one source kind cannot hold tight enough timing for dense sequencing, the sampler should say so rather than pretending all sources are equally reliable

#### UI Rule

- the first sampler UI should stay visually compact and scannable
- prefer:
  - source/status strip
  - step-count slider
  - BPM slider
  - one row of cells
  - transport buttons
  - note-repeat block
- avoid:
  - nested editors
  - heavy popovers
  - per-step inspector panels in the first pass

Recommended first host rule:
- mount the sampler in `AudioSamplerPanel.tsx`
- keep it visually sibling to `RadioPanel.tsx`, not embedded inside it
- reuse the same toolbar/panel shell language when possible, but let the sampler own its own row-oriented body layout

#### Test Targets

- one store test for:
  - step-count resize behavior
  - cue preservation on shrink/grow
  - reroll one step
  - reroll all
- one transport math test for:
  - bar duration from BPM
  - step duration from BPM plus step count
  - repeat timing inside a step window
- one runtime scheduling test proving the loop walks left-to-right and restarts at step `1`
- one UI test for:
  - step-count slider updates visible cell count
  - BPM slider updates state
  - play/stop controls update playback state
- one note-repeat test proving retriggers stay within the owning step window
- one status test proving unsupported/blocked/fallback source states remain visible in the sampler surface

#### Likely First Missing Helpers

- in `TimelineTransport.ts`:
  - `resolveBarDurationSec(bpm)`
  - `resolveStepDurationSec(bpm, stepCount)`
  - `resolveStepStartTimeSec(stepIndex, bpm, stepCount)`
  - `resolveRepeatOffsetsSec(stepDurationSec, repeatCount, repeatRate)`
- in `audioSamplerStore.ts`:
  - `setSamplerStepCount(...)`
  - `setSamplerBpm(...)`
  - `toggleSamplerPlayback(...)` or explicit `playSampler()` / `stopSampler()`
  - `rerollSamplerStep(...)`
  - `rerollAllSamplerSteps()`
  - `setSamplerStepEnabled(...)`

#### Likely File Edits

- `src/app/panels/AudioSamplerPanel.tsx`
  - first real sampler panel implementation
- `src/app/store/audioSamplerStore.ts`
  - sampler slice or shared sampler additions
- `src/runtime/audio/TimelineTransport.ts`
  - step/bar timing helpers
- `src/runtime/audio/AudioEngine.ts`
  - narrow scheduled/trigger seam for sampler steps
- `src/app/AppShell.tsx`
  - mount the sampler panel and connect it to runtime/store state
- optional:
  - `src/runtime/audio/SamplerKeys.ts`
  - if sampler-specific key normalization or scheduler event ids help keep runtime logic clean

#### Implementation Order

1. Lock the sampler slice shape and ownership boundary inside the current store/runtime model.
2. Add the first bar/step timing helpers in `TimelineTransport.ts`.
3. Add step generation, stable cue assignment, and reroll behavior in store state.
4. Add one narrow playhead/scheduler seam in `AppShell.tsx` or the runtime host layer that can walk the row and fire step bursts.
5. Keep the first scheduler bound to the existing burst path instead of inventing a second playback route.
6. Implement `AudioSamplerPanel.tsx` with source/status strip, step-count slider, BPM slider, one row, and `Play` / `Stop`.
7. Add the first `Note Repeat` block after the plain loop is stable.
8. Add focused tests for timing, row resize/reroll behavior, scheduler looping, and status truth.

#### Completion Check

- the user can see and edit one step row tied to the current radio source
- the user can change step count and BPM
- the pattern loops as one bar
- each step keeps a stable cue until rerolled
- the sampler remains honest about current source/runtime state
- the implementation still reads like a simple sequencer, not an accidental mini-DAW

#### Hard Rules

- do not create a second independent source-management model beside radio in the first pass
- do not widen the first sampler into multi-track or arranger behavior
- do not hide provider/runtime limitations behind fake tightness claims
- do not randomize every step again on every loop unless the user explicitly rerolls
- do not let note-repeat spill into the next step window

## [ ] Phase 10 - Shared Radio Toolbar Tree And Step Detail Expansion

### Header
- fold the sampler surface back into the shared `Radio` toolbar instead of keeping it as a separate unrelated panel
- make `Radio` and `Sampler` sibling top-level sections inside one shared toolbar tree
- add a collapsible `Steps` section above `Note Repeat`
- make each step row expandable so step-level detail can grow without flooding the toolbar all at once

First intended top-level toolbar tree:
- `Radio`
  - `URL`
- `Sampler`
  - `Global BPM`
  - `Steps`
    - `Step 1`
    - `Step 2`
    - `Step 3`
    - ...
  - `Note Repeat`

First intended per-step detail:
- cue time or cue ratio from the current source
- enabled / disabled state
- volume
- later step-level overrides

Acceptance shape:
- the shared toolbar has sibling `Radio` and `Sampler` sections
- `Steps` appears above `Note Repeat`
- `Steps` can collapse/expand as one block
- each step row can collapse/expand independently
- collapsed rows stay lightweight while expanded rows reveal deeper controls

### [x] Q1 - Should The Shared Toolbar Tree Replace The Separate Sampler Panel Or Mirror It Temporarily?

#### Suggestion
- replace the separate sampler panel once the shared-toolbar version is functional
- keep one canonical visible sampler surface inside the shared `Radio` toolbar instead of maintaining two parallel UIs
- if a short transition is needed during implementation, keep it temporary and remove it before closing the phase

#### Locked Read
- the target end state is one shared toolbar
- `Radio` and `Sampler` should be sibling sections inside that shared surface
- the separate sampler panel from `Phase 9` should be treated as transitional once this phase lands

### Implementation Spec

Purpose:
- evolve the first sampler UI into the long-term shared-toolbar shape without reopening the source/runtime model that already landed in `Phase 9`

#### Scope

Owned here:
- shared toolbar container shape for `Radio` plus `Sampler`
- disclosure-tree layout for sampler global controls and step rows
- collapsible `Steps` section above `Note Repeat`
- expandable per-step detail rows

Not owned here:
- multi-track sequencing yet
- deep per-step modulation yet
- a second independent sampler runtime

#### Main Decisions

- `Radio` and `Sampler` become sibling top-level sections in one toolbar
- `Global BPM` stays sampler-global
- `Note Repeat` stays sampler-global in this phase
- `Steps` should appear above `Note Repeat`
- steps remain lightweight when collapsed and reveal controls only when expanded
- one track is still enough for the first honest implementation inside this new layout
- the separate sampler panel is allowed only as a temporary migration seam, not as a lasting second primary surface

#### Current Landed Baseline

- `Phase 7` already shipped one shared radio toolbar surface in `RadioPanel.tsx`
- `Phase 9` already shipped sampler state, timing helpers, and a separate `AudioSamplerPanel.tsx`
- runtime/store ownership is already in place for:
  - current source
  - sampler state
  - BPM
  - loop playback
  - note-repeat state

Plain-English baseline:
- the missing work is mostly surface composition and disclosure-state shape
- not a rewrite of the sampler runtime

Implementation-ready read:
- `Phase 10` should mostly be a UI and state-ownership refactor
- sampler playback logic from `Phase 9` should survive intact
- the main work is moving the visible controls into one canonical toolbar tree without forking the sampler state model

#### Remaining Delta To Close This Phase

- merge the visible sampler controls into the shared radio toolbar surface
- add one disclosure-tree layout for:
  - `Radio`
  - `Sampler`
  - `Steps`
  - per-step rows
- add per-step expand/collapse state
- add step detail controls without overwhelming the compact default view
- remove the separate sampler panel if the shared surface fully replaces it
- keep the same playback and sequencing actions reachable after the migration:
  - play
  - stop
  - BPM
  - step count
  - per-step enabled state
  - per-step reroll
  - note repeat

#### Current Code-To-Target Mapping

- `src/app/panels/RadioPanel.tsx`
  - current shared toolbar surface
  - likely becomes the host for both `Radio` and `Sampler` sections
- `src/app/panels/AudioSamplerPanel.tsx`
  - current separate sampler surface
  - should either be retired or reduced to a temporary implementation seam once the shared-toolbar version lands
- `src/app/components/ViewportOverlayToolPanel.tsx`
  - current shared toolbar shell and disclosure-friendly section model
  - should stay the shell contract
- `src/app/store/audioSamplerStore.ts`
  - current owner of sampler state
  - likely needs UI-facing disclosure state for:
    - `Radio` section open/closed
    - `Sampler` section open/closed
    - `Steps` section open/closed
    - per-step expanded rows
- `src/app/AppShell.tsx`
  - current mount owner for `RadioPanel` and `AudioSamplerPanel`
  - should be simplified back toward one shared visible toolbar surface when this phase closes

Recommended ownership read:
- `RadioPanel.tsx`
  - owns the merged visible toolbar tree
- `audioSamplerStore.ts`
  - owns both sampler runtime state and toolbar disclosure state if the disclosure state must survive toolbar reopen/close
- `AudioSamplerPanel.tsx`
  - should not become the long-term owner of any new sampler behavior in this phase
- `AppShell.tsx`
  - should mount only one primary radio/sampler toolbar surface by phase close

#### First Disclosure State Shape

- one shared toolbar disclosure slice should minimally hold:
  - `isRadioSectionExpanded`
  - `isSamplerSectionExpanded`
  - `isSamplerStepsExpanded`
  - `expandedSamplerStepIds`

Recommended first actions:
- `setRadioSectionExpanded(isExpanded)`
- `setSamplerSectionExpanded(isExpanded)`
- `setSamplerStepsExpanded(isExpanded)`
- `toggleSamplerStepExpanded(stepId)`
- one narrow reset helper if the toolbar tree should restore defaults on first open

Important rule:
- use the app’s existing collapsed/essentials/expanded thinking where it helps
- but keep the first state names explicit instead of over-abstracting too early

Recommendation:
- keep this disclosure state in the canonical store if the toolbar should reopen in the same disclosure shape
- keep it local to `RadioPanel.tsx` only if we intentionally want disclosure state to reset each time the toolbar remounts

Locked read:
- prefer store-owned disclosure state for this phase so console open/close and toolbar reopen do not feel lossy

#### First Visible Toolbar Tree Rule

The first merged toolbar should read in this order:
- `Radio`
- `Sampler`
  - `Global BPM`
  - `Steps`
  - `Note Repeat`

Inside `Steps`, each row should read:
- `Step N`
  - collapsed summary row
  - expanded cue / volume detail

Important rule:
- do not keep the old separate sampler panel layout as the mental model and merely embed it whole inside `RadioPanel.tsx`
- recompose it into the toolbar tree structure directly

#### Step Row Presentation Rule

- collapsed step row should show:
  - step index
  - enabled state
  - cue summary
- expanded step row should reveal:
  - cue time or cue ratio
  - volume
  - later override slots

Important rule:
- the first expanded step should reveal only a few honest controls
- do not dump every imagined future control into the first expanded row

#### Steps Section Rule

- `Steps` must sit above `Note Repeat`
- the whole `Steps` block should be collapsible
- inside that block, each step row should have its own disclosure state
- the top collapsed `Steps` block should still give a compact readable summary:
  - step count
  - maybe enabled step count
  - maybe quick reroll-all access

Recommended first collapsed summary:
- current step count
- enabled step count
- one `Reroll All` action if it already exists cleanly in sampler state

#### Future Track Rule

- this phase should prepare for later track growth without implementing full multi-track behavior yet
- acceptable first read:
  - one track implicitly exists
  - the UI tree is shaped so later `Track 1`, `Track 2`, and `Add New Track` can slot in without a full redesign
- do not force real multi-track runtime/state work into this phase unless it is required for the container shape

#### Migration Rule

The migration should happen in two honest steps:
1. make the shared `RadioPanel.tsx` capable of rendering the full sampler tree while keeping `AudioSamplerPanel.tsx` temporarily available for reference or overlap testing
2. remove or demote `AudioSamplerPanel.tsx` from primary mounting once the shared tree reaches feature parity for the first one-track sampler

Important rule:
- do not close the phase while both surfaces are still acting like equal first-class user entry points

#### State And Behavior Preservation Rule

The following already-landed sampler behaviors must still work after the UI migration:
- step count changes
- BPM changes
- play / stop
- playhead readout
- note repeat enable / count / rate
- per-step enabled toggles
- per-step cue reroll

This phase can add:
- per-step volume control
- richer step disclosure

But it should not regress the `Phase 9` sampler path just because the controls moved into a new container

#### Test Targets

- one toolbar render test proving `Radio` and `Sampler` appear as sibling sections
- one disclosure test for:
  - `Steps` collapse/expand
  - per-step expand/collapse
- one step-detail render test proving expanded rows reveal cue plus volume controls
- one migration/sync test proving the shared-toolbar sampler controls still drive the same sampler state from `Phase 9`
- one shell test proving the separate sampler panel is removed or no longer acts like a parallel primary surface once this phase closes
- one reopen test proving disclosure state behaves according to the chosen ownership rule

#### Likely File Edits

- `src/app/panels/RadioPanel.tsx`
  - shared toolbar tree host
- `src/app/panels/AudioSamplerPanel.tsx`
  - likely reduced, retired, or used only as a temporary transition seam
- `src/app/store/audioSamplerStore.ts`
  - add disclosure state for sampler tree rows if kept canonical there
- `src/app/theme/v15Theme.css`
  - disclosure-tree and step-detail styling
- `src/app/AppShell.tsx`
  - simplify visible mounting once one shared toolbar becomes the canonical surface
- `src/app/panels/RadioPanel.test.tsx`
  - expand render/disclosure assertions for the merged tree
- `src/app/panels/AudioSamplerPanel.test.tsx`
  - retire or reduce tests if the panel stops being primary

#### Implementation Order

1. Lock the merged-toolbar end state and treat `AudioSamplerPanel.tsx` as temporary.
2. Add or normalize disclosure state for top-level sections, `Steps`, and per-step rows.
3. Move the already-landed sampler global controls into `RadioPanel.tsx` under `Sampler`.
4. Rebuild the step list as a collapsible `Steps` block above `Note Repeat`.
5. Add expandable per-step rows that preserve existing step enable/reroll behavior and add cue plus volume detail.
6. Confirm the shared toolbar still drives the same sampler runtime/store behavior from `Phase 9`.
7. Remove or demote the separate sampler panel from primary shell mounting.
8. Add focused render, disclosure, and migration tests.

#### Completion Check

- one shared toolbar contains both `Radio` and `Sampler`
- `Steps` is above `Note Repeat`
- step rows stay compact by default and reveal detail only when expanded
- sampler controls still drive the same canonical sampler runtime/state
- the existing sampler controls from `Phase 9` are all reachable from the shared toolbar
- the UI is clearly ready for later track growth without already being a multi-track workstation
- `AudioSamplerPanel.tsx` no longer acts like a competing primary sampler surface

#### Hard Rules

- do not create a second parallel sampler state model for the shared toolbar
- do not keep two competing primary sampler surfaces after the phase closes
- do not widen this phase into real multi-track runtime work unless the container shape genuinely requires it
- do not expose so many per-step controls that the default toolbar stops being readable
