# Old Wishes

## Doc History
1. 2026-03-06 01:13: Updated doc history format to include time
2. 2026-03-06 01:13: Added local doc history block
3. 2026-03-06 01:13: Created the consolidated old-feature wishlist for missing or reduced features from the classic app era

This file is the plain-English master list of notable features, tools, and UX capabilities that existed in the older ParaHook Generator snapshots and are missing, reduced, or only partially present in `/20/`.

Purpose:
- keep one consolidated wishlist for "things the old app had"
- separate nostalgia from actual architecture history
- make it easier to decide what should come back, what should be modernized, and what should stay retired

Important note:
- this is not a command to restore everything exactly as it was
- some old features should return as cleaner modern systems, not as direct copy-paste ports

## Highest-Value Missing Areas

- Old clickable top-right gizmo style with richer controls and stronger visual identity
- Old `Scenes` system (`Stars`, `Nebula`, `Swarm`) with per-scene controls
- Old radio / sampler behavior tied to UI controls
- Richer reference-comparison workspace:
  - premade hook overlays
  - footpad references
  - shoe reference overlays
- Layer/material targeting and visibility controls for many scene objects
- More viewer inspection tools:
  - stronger section-cut workflow
  - frame/focus actions for different asset groups
  - richer camera/control modes
- Old single-screen "design cockpit" feeling where many tools were visible and quickly reachable

## Viewer / Gizmo

- Clickable top-right axis gizmo with stronger old visual style
- Gizmo edge/corner picking behavior
- Gizmo labels with the old text look
- Gizmo visual controls:
  - line opacity
  - sphere scale
  - text size / text height
- Better parity with the old top-right overlay layout
- More obvious "viewer tool" identity instead of a stripped-down utility gizmo

Status:
- dedicated parity doc already exists: `docs/Wish-Features/04 - Gizmo.md`

## Scenes

Old scenes that existed:
- `Stars`
- `Nebula`
- `Swarm`

Old scene-system qualities worth bringing back:
- scene presets that changed the whole atmosphere of the viewport
- many sliders per scene
- playful but still useful visual environments
- a more "alive" viewer compared with the flatter modern presentation

Verified old controls:

- `Stars`
  - `Count`
  - `Motion`
  - `Glow`
  - `Wires`
  - `Line Likelihood`
  - `Line Distance`
  - `Node Size`
  - `Max Distance`

- `Nebula`
  - `Density`
  - `Scale`
  - `Turbulence`
  - `Drift`
  - `Glow`
  - `Color Shift`

- `Swarm`
  - `Count`
  - `Speed`
  - `Cohesion`
  - `Separation`
  - `Alignment`
  - `Jitter`
  - `Anim Length`
  - `Progress`
  - `Explode Strength`
  - `Explode` toggle

Status:
- dedicated parity doc already exists: `docs/Wish-Features/11 - Scenes.md`

## Radio / Sampler

Old radio behavior worth preserving:
- a lightweight music/sound toy built into the workbench
- SoundCloud-backed `Keota` / `Gusano` era behavior
- clicking a given button/control could trigger a stable-random cue:
  - random per button
  - the same button always played the same moment

Why it mattered:
- it gave the old tool personality
- it made parameter interaction feel playful instead of sterile

Status:
- dedicated parity doc already exists: `docs/Wish-Features/10 - radio-Sampler.md`

## Reference Workspace

Older versions had a much richer comparison environment around the generated model.

Missing or reduced reference features:
- premade hook STEP overlays
- multiple footpad reference models
- shoe reference overlay
- transform controls for references
- quick visibility toggles for each reference family
- easier compare-generated-vs-reference workflow
- one-screen composition of generated model plus real-world references

Why this matters:
- the old app was not only a model viewer
- it was a fitting and comparison workspace

## Layers And Materials

Older snapshots had much richer scene-layer and material control.

Missing or reduced capabilities:
- targetable layers for different scene object groups
- per-layer visibility control
- per-layer material adjustment
- material targeting for:
  - generated model
  - shoe
  - footpads
  - hook overlays
  - debug / control-point visualizations
  - baseplate visualizations
  - profile visualizations

Likely modern version:
- this should return as a structured scene/layer system, not as scattered viewer toggles

## Section Cut / Inspection

Older versions had stronger inspection feel around cutaways and debug viewing.

Missing or reduced capabilities:
- more prominent section-cut workflow
- clearer section / plan viewing modes
- stronger stencil-cap / cutaway presentation
- inspection-first controls for understanding geometry failures

Why this matters:
- the old app sometimes felt like a CAD inspection station, not just a part preview

## Camera / Framing Tools

Older viewer snapshots supported richer camera behavior than the current simplified feel.

Missing or reduced capabilities:
- stronger camera control-mode options
- frame/focus actions for specific asset groups
- better snap/view workflow around the gizmo
- richer "look at this subsystem" camera actions

## Build / Status UX

Older snapshots exposed more runtime/build feel directly in the UI.

Missing or reduced capabilities:
- more visible title stats / build stats presentation
- stronger build-status storytelling in the main workbench
- more explicit boot/runtime readiness feel
- more of the "engine is doing work" visibility that late classic versions had

Note:
- some of this is returning in modern form through debug tools and build stats
- the gap is mostly UX presentation, not complete engine absence

## All-In-One Workbench Feel

One major thing the old app had was a specific kind of density:
- lots of tools visible
- lots of direct manipulation
- lots of comparison assets
- lots of viewer personality

What feels missing in `/20/`:
- the sense that the app is one rich design cockpit
- fast access to viewer-side tools
- stronger atmosphere and identity
- more "toolbench" energy

This does not mean `/20/` should go back to one giant monolithic file.

The goal should be:
- keep the modern layered architecture
- reintroduce the best old workbench features as clean modern systems

## Suggested Priority Order

- Bring back the old gizmo style and controls
- Restore `Scenes`
- Restore richer reference workspace controls
- Improve section-cut and camera/framing workflows
- Improve build/status presentation
- Reintroduce radio/sampler as an optional personality feature
- Rebuild old layer/material control in a cleaner structured system

## Related Docs

- `docs/Architecture/History.md`
- `docs/Wish-Features/04 - Gizmo.md`
- `docs/Wish-Features/10 - radio-Sampler.md`
- `docs/Wish-Features/11 - Scenes.md`
- `docs/Wish-Features/02 - Spaghetti Editor.md`
- `docs/Wish-Features/03 - Spaghetti Editor Tool Bar.md`
