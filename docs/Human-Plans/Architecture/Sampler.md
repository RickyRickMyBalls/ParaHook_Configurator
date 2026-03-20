# Sampler

## Doc Header

### Doc History
1. 2026-03-20 16:57: Created this architecture doc to capture the first simple sampler-sequencer vision for ParaHook, including step-count selection, BPM-driven playback, per-step source-cue assignment, and a narrow note-repeat control block

### Purpose

This doc defines the architecture direction for the ParaHook `Sampler`.

Use it to answer:
- what the first `Sampler` should do
- how the simple sequencer should be shaped
- how step count, BPM, and playback should work
- how per-step source-cue assignment should work
- what `Note Repeat` should control in the first pass

### Why This Doc Exists

The repo already has:
- an older wish-feature memory for `Radio Sampler`
- the current `Radio` architecture direction
- a growing runtime/store seam for source playback and burst triggering

What it does not yet have is one focused architecture doc for a deliberately simple first sequencer.

This doc exists to lock that smaller direction:
- one row
- one current source
- one BPM control
- one play loop
- one optional note-repeat block

That is the right level for the first honest sampler instead of jumping straight to a full DAW or multi-lane editor.

### Scope

This doc covers:
- a simple single-row step sequencer
- step-count selection through one `ParaSlider`
- BPM control through one `ParaSlider`
- per-step random cue assignment against the current radio/url source
- looped playback of the current pattern
- a narrow first-pass `Note Repeat` control surface

This doc does not cover:
- multi-track arrangement
- piano-roll editing
- MIDI input/output
- sample-library management
- waveform editing
- offline rendering/export
- deep effects chains

## Doc Body

### Short Version

The first `Sampler` should be a simple step sequencer built around the current radio/url source.

The user should:
- choose a step count with one `ParaSlider`
- see one horizontal row of step cells
- let each cell point at a random cue time in the current source
- set the tempo with one BPM `ParaSlider`
- press `Play` to hear the pattern loop
- optionally turn on `Note Repeat` for faster retriggers inside each step

This should feel closer to a playful drum-machine lane than to a full production tool.

### Core Product Direction

The first sampler should be:
- simple
- visual
- loop-based
- source-driven
- easy to reroll and replay

The first sampler should not try to solve:
- full song arrangement
- advanced sequencing grammar
- deep per-step modulation
- full instrument routing

The goal is to make one current source musically explorable through a compact repeated pattern.

### Current Source Rule

The sequencer should use the current radio/url source that already exists in the app.

In the first pass:
- the sampler does not manage a large audio library
- the sampler does not need one separate file per step
- each step points into the same currently active source
- that source can still be described to the user as the current radio/url

Important internal rule:
- a sequencer step is not the same thing as an imported audio sample file
- each visible cell should be treated as a step/cue slot that references a time position inside the current source

That distinction matters because the UI may say `sample` casually, but the state model should stay clear.

### Sequencer Length Control

The main sequence-length `ParaSlider` should lock to:
- `4`
- `8`
- `16`
- `32`

The intended read is:
- `4` = quarter-note grid for one bar
- `8` = eighth-note grid for one bar
- `16` = sixteenth-note grid for one bar
- `32` = thirty-second-note grid for one bar

This gives the user one simple control that changes how many step cells exist in the pattern.

When the count changes:
- the visible row should resize to that many cells
- existing leading cells can be preserved when possible
- newly created cells should receive fresh random cue assignments
- cells beyond the new length can be dropped from the active pattern

### Step Row

The sampler should render one horizontal row of step cells.

Each step cell should represent:
- one trigger point in the pattern
- one cue position in the current source
- one enabled/disabled state

Useful first-pass step reads:
- step index
- cue position
- active/inactive state
- optional reroll action

The row should be scannable at a glance.

This means the first UI should prefer:
- compact repeated cells
- a clear active-playhead state
- simple per-step status instead of heavy editors or nested popovers

### Random Cue Assignment

Each step should get a random time position from the current radio/url source.

The important behavior is:
- random across the row
- stable for that step until rerolled or regenerated

That means:
- step `1` keeps its assigned cue
- step `2` keeps a different assigned cue
- pressing `Play` reuses the current stored cue plan instead of re-randomizing every loop

The randomizer should avoid the exact end tail of the source so bursts still produce audible sound.

Good first-pass controls:
- reroll one step
- reroll all steps

### Playback Model

Pressing `Play` should start a looping transport that walks the row from left to right.

Core rules:
- the pattern is one bar long
- the selected step count defines the subdivision inside that bar
- each active step triggers its stored cue at the correct transport moment
- after the last step, playback loops back to the first step

The minimum transport controls should be:
- `Play`
- `Stop`

Optional later controls can include:
- `Pause`
- `Restart`
- one-bar progress readout

### BPM Control

The BPM `ParaSlider` should control the transport tempo for the sequencer.

The first pass should keep the read simple:
- higher BPM means the pattern cycles faster
- lower BPM means the pattern cycles slower

Because the pattern is treated as one bar:
- `4` steps at a given BPM feel like quarter notes
- `8` steps feel like eighth notes
- `16` steps feel like sixteenth notes
- `32` steps feel like thirty-second notes

This keeps the mental model easy for the user and easy to reason about in code.

### Note Repeat

`Note Repeat` should be an optional block with its own on/off button.

In the first pass, it should stay narrow.

Recommended first-pass controls:
- `Enabled`
- `Repeat Count`
- `Repeat Rate`

Recommended behavior:
- when `Note Repeat` is off, a step triggers once
- when `Note Repeat` is on, that same step can retrigger multiple times inside its step window
- the retriggers should fit inside the current step duration instead of spilling into the next step by accident

Good default settings:
- `Enabled = off`
- `Repeat Count = 1` for normal playback
- `Repeat Rate` derived from the current step window or chosen from a small select like `2x`, `4x`, `8x`

The simplest user-facing model is:
- `1` = normal hit
- `2` = double
- `4` = four quick hits
- `8` = dense roll

Useful later additions, but not required for the first pass:
- gate length
- velocity decay
- swing
- probability

### Suggested UI Surface

One clean first-pass layout is:
- source/status strip for the current radio/url
- step-count `ParaSlider`
- BPM `ParaSlider`
- main row of step cells
- transport buttons
- `Note Repeat` section with one on/off button plus compact controls

That keeps the first sampler understandable:
- source at the top
- pattern controls in the middle
- playback below
- repeat options grouped together instead of scattered across each step

### Practical State Shape

The first data model only needs a few concepts:
- current source identity
- BPM
- step count
- ordered step list
- playback state
- note-repeat settings

Each step likely needs fields like:
- `id`
- `index`
- `enabled`
- `cueRatio` or `cueSeconds`

The note-repeat block likely needs:
- `enabled`
- `count`
- `rate`

The first pass should avoid exploding this into a giant sequencer schema.

### Relationship To Radio

This sampler direction should reuse the current radio/runtime source seams where possible.

The intended relationship is:
- `Radio` remains the broader source/playback concept
- `Sampler` becomes the simple sequencer surface that plays repeated cue bursts from that source

That means `Sampler` should feel related to `Radio`, but it should not stay trapped as only a hidden radio sub-feature.

### First Honest Version

A good first honest version is complete when the user can:
- pick `4`, `8`, `16`, or `32` steps
- see a row with that many step cells
- have each step hold a stable random cue into the current source
- set the BPM
- press `Play` and hear the loop run
- enable `Note Repeat` and hear denser retriggers

If those actions work clearly, the sampler is already useful.

That is enough for the first pass.
