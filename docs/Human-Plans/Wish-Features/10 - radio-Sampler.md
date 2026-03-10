# Radio Sampler

## Doc History
1. 2026-03-06 01:13: Updated doc history format to include time
2. 2026-03-06 01:13: Added local doc history block
3. 2026-03-06 01:13: Created doc for the old radio feature and future sampler direction from `/14/replicad-app`

Purpose:

This doc captures the old radio feature from `/14/replicad-app` and how it could evolve into a future music sampler system.

This is not a task file yet.
It is a wishlist / future-feature doc.

## Old Feature In `/14/`

The old system was a small radio panel backed by a SoundCloud widget.

In the old UI:
- the panel title was `Gusano`
- the section meta label was `Keota Radio`

Main controls included:
- Play / Pause
- Open link
- Volume
- Seek
- Sampler Burst duration

The old panel also supported float/window pop-out behavior.

## The Important Old Behavior

The most interesting part of the old radio system was not just manual playback.

It also acted like an interaction sampler.

When the user interacted with controls, the radio could jump to a cue point in the Keota track and play a short burst.

## Per-Control Random Cue Assignment

The old behavior worked like this:

- each control/input got assigned a random cue position in the track
- that random cue was assigned once per control id
- after that, the same control always reused the same cue point

So the behavior was:

- random per button/control
- stable for that same button/control on later clicks

That means:

- Button A might always jump to one part of the track
- Button B might always jump to a different part of the track
- repeated clicks on Button A would keep using Button A's assigned cue

This gave the system a feeling of:
- randomness across the interface
- consistency per control

That is a strong idea and worth keeping.

## How It Worked Technically In `/14/`

The old code used a per-input map for cue assignment.

Conceptually:
- input/control id
  ->
- stored random cue ratio
  ->
- seek to that part of the track
  ->
- play a short burst

Important behavior from the old version:
- avoid seeking to the exact track tail so the burst still produced audible sound
- if the widget was not ready yet, store a pending cue and apply it later
- keep the burst length adjustable

## Why It Was Interesting

This made the UI feel musical in a way that was tied to interaction.

It was not just:
- click play
- listen to a song

It was more like:
- the interface itself becomes a sampler surface
- different controls trigger different parts of the same track

That is the idea worth reviving.

## Future Direction

The future version should grow from `radio` into `radio sampler`.

Eventually it could become a broader music sampler system.

## Desired Future Behavior

### Basic version

- a track is loaded
- interface controls can trigger short bursts from that track
- each triggerable control gets its own stable cue point

### Stable random assignment

The old core rule should remain:

- random per button/control
- stable per button/control across repeated clicks

This is important because it gives the UI personality without becoming chaotic.

## Possible Future Expansion

The future sampler system could support:

- multiple tracks
- per-section track assignment
- per-control cue banks
- different burst lengths
- different trigger modes
- volume per sampler group
- mute / solo
- visual sampler map

It could eventually become:
- a playful UX layer
- a creative sound-design feature
- an interaction-based music system

## Candidate Trigger Types

Future triggers could include:

- buttons
- sliders
- checkboxes
- graph node actions
- toolbar actions
- panel open/close actions
- selection changes

This should be intentional, not noisy.

## Good Rule To Preserve

The sampler should feel responsive, but it should not make the UI annoying.

A good rule from the old idea is:
- each control has character
- the sound result is recognizable
- repeated use stays familiar

That is better than fully random playback on every click.

## Suggested Long-Term Version

Long term, this could become:

- a `Radio Sampler` panel
- or a broader `Music Sampler` system

Possible panel responsibilities:
- track source
- play/pause
- seek
- burst duration
- sampler enable/disable
- trigger mapping
- randomize cue map
- save/load cue assignments

## Summary

The old `/14/` radio feature was more than just a music player.

Its best idea was:

- every button/control could trigger Keota from a random part of the track
- the random point was stable for that same button/control

That behavior is worth bringing back later as a real `Radio Sampler` or `Music Sampler` feature.
