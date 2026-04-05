## Doc Header

### Doc History
5. 2026-04-05 09:30: Tightened the `Extrude-2` toolbar plan again by locking that the node should drop the visible `Extrude Geometry` title from the shared template, reuse that header area for one toolbar-open button instead, and prove the button-driven toolbar-launch pattern on `Extrude` first before the same titleless-launcher move is applied to `Sketch`
4. 2026-04-05 09:28: Tightened the `Extrude-2` node-surface direction by locking that the authored extrude controls should live under `Inputs`, the old `Details` section should be deleted instead of expanded, and the node shell should settle into `Inputs` plus `Outputs` even while the broader toolbar work remains open
3. 2026-04-04 22:54: Marked `Extrude-2.1 - Extrude Input Pin Template Parity` complete after the dedicated extrude template adopted the managed row-and-pin treatment for its `ExtrusionProfile` input, and kept the wider toolbar shell as the next still-open `Extrude-2` follow-on
1. 2026-04-04 22:37: Split the broad `Extrude-2` toolbar-polish bucket so the first real task now has its own dedicated future doc `Extrude_Phase Extrude-2.1 - Extrude Input Pin Template Parity.md`, keeping `Extrude-2` as the umbrella enrichment phase while repointing the first execution slice to the narrower input-pin parity work
2. 2026-04-04 22:37: Tightened the `Extrude-2.1` read inside this umbrella doc so the first task is now explicitly row-only, grounded in the decent managed sketch input-row language from `SketchPlane` and `SketchDraw`, and no longer framed as a broad sketch-template cleanup

## [ ] - `Extrude-2` - `Node Enrichment And Toolbar Polish`

### Summary

#### Purpose:
- turn the now-truthful first-pass extrude result into a more usable authored surface with a dedicated extrude toolbar

#### Owns:
- the first dedicated `Extrude` toolbar
- a richer node-facing extrude surface for the current honest single-profile seam
- toolbar, node, and console wording alignment for active extrude authoring
- a clearer user flow for reviewing profile target, depth, and direction without widening the kernel contract yet
- deleting the old `Details` section so the node surface stays `Inputs` plus `Outputs`
- removing the visible `Extrude Geometry` title from the node template for this family
- using that reclaimed header area for one button that opens the extrude toolbar

#### Does not own:
- reopening the landed `Extrude-1A` placement repair
- the full graph-node versus feature-stack contract cleanup from `Extrude-1B`
- plural profile-input rollout
- boolean or richer extent-family behavior
- `taper/offset` runtime support unless a later contract-honesty phase explicitly takes that work

#### Current seam read:

- the authored-plane and preview-alignment ladder is now landed well enough that users can trust where the body appears
- the current `Geometry/Extrude` node still reads as a thin proof surface compared to `Sketch`
- there is still no dedicated extrude toolbar, so the user has no single focused place to review or tweak active extrude authoring
- the first toolbar must stay honest to the currently supported runtime contract instead of surfacing future-only controls too early
- the node shell itself should also stay honest and simple:
  - authored controls belong under `Inputs`
  - the node should not keep or regrow a separate `Details` section
- the old visible node title is also expendable for this family:
  - remove `Extrude Geometry` from the template-owned title area
  - use that area for one toolbar-open button instead
  - let `Extrude` prove that launcher pattern before `Sketch` adopts the same move later

Current strongest read:
- the next highest-value extrude improvement is no longer another placement fix
- it is a clearer authored surface centered on one dedicated extrude toolbar and better node polish

#### Sub-phase breakdown:
- `[x] Extrude-2.1 - Extrude Input Pin Template Parity`
  - first dedicated execution slice inside `Extrude-2`
  - owns matching the extrude profile input row and pin to the decent managed sketch-row language already visible on `SketchPlane` and `SketchDraw`
  - dedicated future doc:
    - `Extrude_Phase Extrude-2.1 - Extrude Input Pin Template Parity.md`

### Questions

#### [x] Question 1 - Should the first enrichment phase create a dedicated extrude toolbar?

##### Locked answer
- yes

##### Why
- `Extrude` now has a trustworthy viewport result and needs a matching authored control surface
- the current node-only surface is too thin for repeated day-to-day extrude authoring

#### [x] Question 2 - Should the new toolbar become the durable source of truth for extrude data?

##### Locked answer
- no
- the graph node and store remain the durable source of truth
- the toolbar is the active authoring surface layered on top of that stored node data

##### Why
- this keeps the repo aligned with the existing authored-graph truth model
- it avoids creating a second hidden extrude state model

#### [x] Question 3 - What should the first toolbar expose?

##### Locked answer
- expose only the currently honest first-pass controls:
  - current profile target summary
  - profile re-pick / review entry
  - depth
  - direction / flip
  - lightweight start / review / commit flow affordances
- defer future-only controls until they are backed by a real runtime contract

##### Why
- the first toolbar should make the current extrude seam easier to use, not pretend the later feature family is already shipped
- honest narrower controls are better than another surface with visible no-op debt

#### [x] Question 4 - Should `Extrude-2` wait for `Extrude-1B`?

##### Locked answer
- no
- `Extrude-2` can begin now as long as it stays inside the current honest single-profile runtime surface

##### Why
- the user-facing toolbar and node polish do not need to wait for the full later contract-convergence lane
- this keeps the next improvement focused on workflow quality while `Extrude-1B` remains the deeper contract-honesty follow-on

#### [x] Question 5 - Should the node keep the visible `Extrude Geometry` title once the toolbar exists?

##### Locked answer
- no
- remove the visible `Extrude Geometry` title from the template for this family
- use that same title/header area for one button that opens the extrude toolbar

##### Why
- the title is lower-value than a direct toolbar entry once `Extrude` has a real authored control surface
- the node already communicates its family through placement and surrounding context, while the header area is scarce UI real estate

#### [x] Question 6 - Should `Sketch` switch to the same titleless toolbar-launch pattern now?

##### Locked answer
- no
- prove the pattern on `Extrude` first
- move `Sketch` to the same launcher pattern later as a separate follow-on

##### Why
- `Extrude` is the active proving ground for the dedicated-toolbar pattern right now
- landing both families together would widen the pass and make it harder to judge whether the launcher pattern itself is good

### Spec

Locked first-cut direction:
- create one dedicated extrude toolbar as the main active extrude authoring surface
- keep the graph node as the durable authored truth
- align toolbar labels, node summary text, and console wording around the same first-pass single-profile contract
- keep the first toolbar honest to the already-supported runtime behavior
- keep the node shell to:
  - `Inputs`
  - `Outputs`
- delete the old `Details` section instead of treating it as the home for later extrude controls
- remove the visible `Extrude Geometry` title from the node template for this family
- use that header/title area for one toolbar-open button
- keep `Sketch` on its current pattern for now and treat the later sketch launcher move as a separate follow-on after `Extrude` proves the interaction
- do not widen this phase into boolean, plural profile, or no-op parameter growth

Likely implementation seams:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- one new dedicated extrude-toolbar surface and its host wiring near the existing workspace or spaghetti toolbar surfaces

Suggested execution order:
1. Implement `Extrude-2.1` first so the extrude profile input row and pin match the decent managed sketch-row language before wider toolbar polish begins.
2. Remove the visible `Extrude Geometry` title and replace that header area with one toolbar-open button.
3. Define the first toolbar shell and how it activates from the current extrude node flow.
4. Mirror the honest current extrude controls into that toolbar:
   - profile target summary
   - depth
   - direction / flip
5. Refresh node summary text so the node and toolbar describe the same authored state.
6. Keep `taper/offset` and richer extent controls out of the first toolbar unless the underlying runtime contract becomes honest first.
7. Add focused UI coverage for toolbar visibility, node-toolbar sync, titleless header-button behavior, and unchanged extrude build behavior.

Acceptance checks:
- the user has one dedicated toolbar for active extrude authoring
- the visible `Extrude Geometry` title is gone from the node surface
- the reclaimed header area now contains one button that opens the extrude toolbar
- the toolbar and node surface describe the same current extrude state
- the first toolbar exposes only honest currently supported controls
- the node surface uses only `Inputs` and `Outputs`
- authored extrude controls no longer live under a `Details` section
- the landed authored-plane and preview-alignment fixes remain unchanged by the new surface work

Definition of done:
- `Geometry/Extrude` no longer relies only on a thin node surface for everyday authoring
- the first extrude toolbar exists and feels aligned with the current runtime truth
- later contract cleanup can still proceed separately through `Extrude-1B`
