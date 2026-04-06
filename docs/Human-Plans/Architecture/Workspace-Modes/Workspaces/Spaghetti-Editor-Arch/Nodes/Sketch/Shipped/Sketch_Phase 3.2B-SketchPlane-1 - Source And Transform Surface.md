## [x] - `3.2B-SketchPlane-1` - `Source And Transform Surface`

### Header

Purpose:
- turn `SketchPlane` into a richer setup surface instead of a thin plane row

Owns:
- `Source + Transform`
- `collapsed / essentials / expanded` row behavior
- `ParaSelect` for plane choice
- `ParaSlider` for numeric transform values
- simple orientation actions like `Flip`

### Questions / Decisions

#### [x] - `q1` Treat this as the shipped row-surface foundation for later viewport-first work.

##### Suggestion
- yes
- keep later `SketchPlane` planning focused on viewport-first placement instead of reopening the basic row-surface contract

### Implementation Spec

- already landed
- this phase remains the source/setup row foundation that later viewport-first sketch-plane work builds on


