## [ ] - `3.2B-4` - `Sketch Exposure And Browser Structure`

### Header

Purpose:
- give sketches a truthful authored-content presence before downstream body consumption

Owns:
- sketch `eyeball` / expose behavior
- viewport preview for exposed sketches
- first browser family structure:
  - `Content`
    - `References`
    - `Assembly`
    - `Sketches`

### Questions / Decisions

#### [ ] - `q1` Decide the first honest expose/browser cut once the core sketch interaction seams are stable.

##### Suggestion
- expose sketch preview in the viewport
- add the first `Content > Sketches` browser family
- keep this phase separate from the core `SketchPlane` and `Draw Sketch` interaction work

### Implementation Spec

- first implementation should focus on:
  - expose toggle behavior
  - viewport visibility for exposed sketches
  - first browser family structure for `Sketches`


