## [ ] - `3.2B-DrawSketch-3` - `Selection, Editing, And Richer Sketch Feedback`

### Header

Purpose:
- move beyond raw first-pass drawing into a fuller sketch authoring workflow

Owns:
- hover / selected / active draw feedback
- editing of existing sketch entities
- richer snapping and later inference aids

### Questions / Decisions

#### [ ] - `q1` Decide the first honest editing scope after raw drawing is stable.

##### Suggestion
- start with:
  - hover
  - selected
  - active
  - simple entity editing
- defer richer constraints and deeper inferencing until the raw draw session feels stable

### Implementation Spec

- detailed open questions live in the later `### 3.2B-DrawSketch` section
- first implementation should prove:
  - viewport hover / selected language
  - editing of existing line-based entities
  - richer draw feedback without overloading the first draw-session seam


