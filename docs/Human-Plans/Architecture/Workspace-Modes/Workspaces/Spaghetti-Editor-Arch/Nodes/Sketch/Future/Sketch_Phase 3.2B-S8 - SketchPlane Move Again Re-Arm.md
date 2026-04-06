## [ ] [3.2B-S8] - `SketchPlane Move Again Re-Arm`

This follow-on adds one fast re-entry command inside `SketchPlane > Move` so the user can immediately start another whole-vector live move without backing out and re-entering the move tool family.

Phase state:
- locked
- implementation-ready
- future

Locked target read:

```text
Graph
└─ Sketch node selected
   └─ SketchPlane
      └─ Adjust
         └─ Move
            ├─ Vec3
            ├─ Move Again
            ├─ X
            ├─ Y
            ├─ Z
            └─ Back
```

Important rule:
- while the user is inside `G > S > SP > M`, there should be a `Move Again` option
- the alias for `Move Again` inside that scope should be:
  - `M`
- choosing `Move Again` should immediately re-arm the full live move behavior from the current committed sketch-plane placement
- this should not leave the user at root move setup or force them to back out of `Move`

Example:
- user path:
  - `G > S > SP > M`
- user previously committed one move
- user types:
  - `M`
- result:
  - whole-vector move is re-armed from the current final point
  - the user can drag again immediately

Current code-to-target mapping:
- current sketch-plane session already owns live move behavior in:
  - `sketchPlanePickSession`
- current move subtree already supports:
  - `Vec3`
  - `X`
  - `Y`
  - `Z`
- current gap:
  - after a move commit, there is no explicit in-scope `Move Again` action that re-arms the whole move command with local alias `M`

Phase boundary:
- `[3.2B-S8]` should only add:
  - `Move Again` under `SketchPlane > Move`
  - alias `M` in that local scope
  - shared toolbar/console entry into the whole live move path
- `[3.2B-S8]` should not add:
  - transform-history behavior
  - new axis-leaf behavior
  - rotate changes
  - broader command-template redesign

### Questions / Decisions

#### [x] `q1` Decide whether `SketchPlane > Move` needs a local whole-move re-arm action.

##### Suggestion
- locked direction:
- yes
- add `Move Again` as a first-class local choice inside `SketchPlane > Move`

#### [x] `q2` Decide what alias `Move Again` should use in that scope.

##### Suggestion
- locked direction:
- `M`
- inside `SketchPlane > Move`, `M` should mean `Move Again`

#### [x] `q3` Decide what `Move Again` should do.

##### Suggestion
- locked direction:
- re-arm the same unconstrained whole-vector live move session used by the main move path
- start from the current committed sketch-plane placement
- do not reset to origin

### Implementation Spec

Purpose:
- keep repeated sketch-plane placement adjustment fast
- let the user stay inside `Move` and re-enter whole-vector dragging with one local command

#### Current Code-To-Target Mapping

- likely runtime ownership remains near:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/components/ViewportOverlay.tsx`
  - `src/app/console/ConsoleDock.tsx`
- current code truth:
  - move-session ownership already exists
  - whole-vector move already exists
  - axis leaves already exist from shipped `[3.2B-S6]`
  - the missing piece is a local explicit whole-move re-arm command inside the `Move` scope

#### Scope

Owned here:
- `Move Again` toolbar row / console choice
- alias `M` inside `SketchPlane > Move`
- re-entry into the whole live move command from the current final point

Not owned here:
- transform history
- axis numeric parsing
- rotate parity
- root/global alias policy

#### Acceptance Checks

- inside `G > S > SP > M`, `Move Again` appears as a visible choice
- inside `G > S > SP > M`, typing `M` triggers `Move Again`
- `Move Again` re-arms the whole-vector live move command from the current committed point
- `Move Again` does not reset the plane to origin
- toolbar click and console token route through the same runtime move-rearm path
