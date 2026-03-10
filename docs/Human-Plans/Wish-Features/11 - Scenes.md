# 11 - Scenes

## Doc History
1. 2026-03-06 01:13: Updated doc history format to include time
2. 2026-03-06 01:13: Added local doc history block
3. 2026-03-06 01:13: Renamed the doc from `Environments` to `Scenes` and aligned the naming with the old viewer system
4. 2026-03-06 01:13: Created doc from the verified old `/14/` and `/18/` Scenes system and control set

## Purpose

Bring back the old viewport `Scenes` system as a future feature for `/20/parahook`.

This was the animated background / alternate viewer-scene system with:
- `Stars`
- `Nebula`
- `Swarm`

The old system lived as a `Scenes` section under the viewer background controls.

## Source Reference

Verified sources in this workspace:
- `/14/replicad-app/index.html`
- `/14/replicad-app/src/main.ts`
- `/14/replicad-app/src/viewer.ts`
- `/18/src/viewer/viewer.ts`

Important note:
- there is no `/16/` or `/17/` folder in this workspace
- `/15.0` and `/15.1` do not appear to contain the old Scenes UI
- the actual verifiable implementation is in `/14`, with a later code copy still visible in `/18`

## Old Structure

The old viewer had a `Background` section with a nested `Scenes` subsection.

Scenes modes:
- `off`
- `stars`
- `nebula`
- `swarm`

UI behavior:
- one toggle to enable / disable Scenes
- one button each for `Stars`, `Nebula`, and `Swarm`
- only the active scene's slider group opened
- entering a scene mode temporarily overrode some camera inertia / decay settings

## Slider Controls

### Stars

- `Count`
- `Motion`
- `Glow`
- `Wires`
- `Line Likelihood`
- `Line Distance`
- `Node Size`
- `Max Distance`

### Nebula

- `Density`
- `Scale`
- `Turbulence`
- `Drift`
- `Glow`
- `Color Shift`

### Swarm

- `Count`
- `Speed`
- `Cohesion`
- `Separation`
- `Alignment`
- `Jitter`
- `Anim Length`
- `Progress`
- `Explode Strength`

Swarm also had:
- `Explode` button toggle

## Viewer-Side Feature Shape

The old viewer owned a scene-mode system:
- `VisualSceneMode = "off" | "stars" | "nebula" | "swarm"`

It had separate internal scene/camera/control sets for:
- stars
- nebula
- swarm

The viewer also exposed dedicated setters for the sliders.

Examples from the old API:
- `setVisualSceneMode`
- `toggleVisualScene`
- `getVisualSceneMode`
- `setStarsMotionScale`
- `setStarsNodeCount`
- `setStarsGlowScale`
- `setStarsWireOpacity`
- `setStarsLineLikelihood`
- `setStarsLineDistanceScale`
- `setStarsNodeScale`
- `setStarsDistanceScale`
- `setNebulaDensity`
- `setNebulaScale`
- `setNebulaTurbulence`
- `setNebulaDrift`
- `setNebulaGlow`
- `setNebulaColorShift`
- `setSwarmCount`
- `setSwarmSpeed`
- `setSwarmCohesion`
- `setSwarmSeparation`
- `setSwarmAlignment`
- `setSwarmJitter`
- `setSwarmSpinDecaySeconds`
- `setSwarmAnimationProgressPercent`
- `setSwarmExplodeEnabled`
- `setSwarmExplodeStrength`

## Wish For `/20/`

If this comes back in `/20/parahook`, it should be treated as a real viewer feature, not just a visual gimmick.

Desired shape:
- a proper `Scenes` section under viewer controls
- mode toggle for `Stars`, `Nebula`, `Swarm`
- scene-specific controls shown only for the active mode
- persistent view settings if we decide these should be saved
- separation from part/build/debug systems

## Architecture Notes

If implemented in `/20`, this should likely live in the viewer layer, not in Spaghetti/editor state.

Likely ownership split:
- UI controls in view toolbar / viewer settings UI
- persisted settings in a viewer preferences store
- rendering and animation in the viewer runtime

This should remain separate from:
- part rendering
- gizmo system
- debug inspector
- Spaghetti compile/build pipeline

## Done Means

- `/20/` has a `Scenes` viewer feature again
- `Stars`, `Nebula`, and `Swarm` can be toggled
- each scene exposes its old slider group
- the control list matches the old system
- the scene feature does not interfere with normal CAD preview rendering
