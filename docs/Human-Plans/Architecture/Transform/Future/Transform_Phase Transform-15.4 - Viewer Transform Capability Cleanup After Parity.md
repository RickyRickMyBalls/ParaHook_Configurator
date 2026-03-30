# Transform Phase Transform-15.4 - Viewer Transform Capability Cleanup After Parity

## Doc Header

### Doc History
1. 2026-03-29 10:39: Created this standalone future phase after `Transform 15.3` so the remaining reference-only versus generated-object capability differences can be audited and locked explicitly instead of lingering as accidental post-parity residue

### Purpose

This phase audits what still remains reference-only after the shared-session and feature-parity work lands.

Use it to answer:
- which remaining differences are truly capability-driven
- which reference-only features should stay reference-only for now
- how to stop later transform work from drifting back into a fuzzy “shared toolbar but uneven hidden contract” state

## Doc Body

## [ ] Transform 15.4 - Viewer Transform Capability Cleanup After Parity

### Summary

`Transform 15.4` starts after:
- `Transform 15.2`
  - one shared `Viewer Transform` session model exists
- `Transform 15.3`
  - generated objects have practical parity for history, render lines, and snap where those features belong to the shared transform surface

At that point, the remaining differences should be audited deliberately.

This phase keeps only the differences that are truly capability-driven and removes whatever still survives only because of historical reference-first residue.

### Owns

- an explicit audit of what still remains reference-only after parity
- locking which features truly stay reference-only
- cleanup of accidental leftover capability drift after the more important parity work has landed
- documentation of the clean line between shared `Viewer Transform` features and reference-only capabilities

### Does Not Own

- the earlier shared-session cleanup
- the earlier generated-object parity pass for history, render lines, and snap
- multi-select transform
- durable generated-object truth writeback

### Locked Outcome

- after this phase, any remaining reference-versus-generated-object difference should be intentional
- shared `Viewer Transform` features should stay shared
- truly reference-only features should stay reference-only only when they honestly depend on:
  - reference runtime ownership
  - reference-only runtime data
  - reference-only capability semantics
- later transform work should not have to rediscover which differences are real and which were only residue

### Current Need

Even after feature parity improves, there may still be some features that should not be widened blindly.

Likely examples include:
- timelines
- camera lock
- any transform affordance that still depends on true `referenceId`-specific runtime behavior

This phase exists so those boundaries become explicit instead of remaining ambiguous.

### Capability Audit Direction

- list the remaining reference-only features after `15.3`
- classify each one as either:
  - shared and should be widened
  - truly reference-only and should remain so for now
- remove any leftover branch that still says “object path does less” without a real capability reason

### Implementation Direction

- keep this phase narrow
- do not let it delay the more important parity work
- use it to prune or lock the remaining capability branches after the higher-value shared features have already landed
- prefer explicit capability flags and target-descriptor rules over scattered target-kind checks

### Concrete Implementation Targets

Primary cleanup targets:
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/referenceTransformConsole.ts`

Supporting runtime targets if needed:
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

### Tests

- every remaining generated-object versus reference difference is backed by an explicit capability rule
- no shared transform feature regresses back into target-specific duplicate behavior
- reference-only features that stay reference-only remain documented and intentional
- shared parity features from `15.3` remain intact

### Assumptions

- this phase is intentionally less important than `15.2` and `15.3`
- it should come after the parity work, not before it
- its job is to leave a clean boundary between:
  - shared transform features
  - truly reference-only capabilities
