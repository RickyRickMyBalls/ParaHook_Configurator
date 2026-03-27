# Transform Phase Transform-11 - Console Snap Parity Cleanup

## Doc Header

### Doc History
1. 2026-03-27 14:20: Created this standalone `Transform 11` future phase doc as the next implementation-ready Transform follow-on, narrowing the work to Console snap grammar, action-label parity, prompt/status cleanup, and radio-identity cleanup after the shipped `Transform 10` per-axis snap model
2. 2026-03-27 14:45: Marked `Transform 11` shipped after the Console snap parity cleanup landed, moving this phase record into `Shipped/` so the family roadmap now points forward to the next transform-shell cleanup follow-on instead of leaving the Console adapter pass open

### Purpose

This phase cleaned up Console snap ownership after the shipped `Transform 10` toolbar and runtime snap work.

It answered:
- how Console snap mode roots should expose enabled-state now that the toolbar uses one toggle button
- how Console should narrate `Locked / Unlocked` snap state without drifting from the shipped toolbar wording
- how snap prompts, breadcrumbs, and radio identities should read now that per-axis snap already shipped
- how mode-local `Snap` adapters should stay honest to the same shared settings owner path

## Doc Body

## [x] Transform 11 - Console Snap Parity Cleanup

### Shipped Summary

`Transform 11` tightened the Console adapter layer after the shipped `Transform 10` per-axis snap model.

By the start of this phase, shared snap state was already real:
- `enabled`
- `xyzLocked`
- `x / y / z`

The shipped cleanup kept that model intact and only tightened Console parity:
- snap mode roots now show one honest enable-state action at a time:
  - `snap:On` while disabled
  - `snap:Off` while enabled
- mode roots continue to show only the currently available lock-state action:
  - `snapXYZ:Unlock` while locked
  - `snapXYZ:Lock` while unlocked
- Console confirmations and status text now use the same `Locked / Unlocked` wording the toolbar uses
- mode-local `Transform > Move > Snap`, `Rotate > Snap`, and `Scale > Snap` remain adapters into `Transform > Settings > Snap`

### Owned

- reference-transform Console snap mode-root wording and visible choices
- staged-navigation action labels for transform snap mode roots
- Console append/status text for snap enable, disable, lock, and unlock
- radio-command identity cleanup for the shipped snap grammar

### Did Not Own

- new snap state shape
- new viewer or gizmo snap execution
- new toolbar snap layout behavior
- transform-history or transform-shell exit behavior

### Locked Outcome

- Keep the honest owner path:
  - `Transform > Settings > Snap > Choose next [Move, Rotate, Scale]`
- Keep mode-local adapters:
  - `Transform > Move > Snap`
  - `Transform > Rotate > Snap`
  - `Transform > Scale > Snap`
  - these still resolve into the same shared owner path
- At each snap mode root, Console shows only the currently available enabled-state action:
  - if disabled, show `snap:On`
  - if enabled, show `snap:Off`
- At each snap mode root, Console shows only the currently available lock-state action:
  - if locked, show `snapXYZ:Unlock`
  - if unlocked, show `snapXYZ:Lock`
- Console status and confirmation text uses the shipped state language:
  - `Move snap: On`
  - `Move snap: Off`
  - `Move snap XYZ: Locked`
  - `Move snap XYZ: Unlocked`
- Mode-root numeric submit still targets the root driver and still writes all three axes equally
- Axis-child numeric submit keeps the shipped locked-versus-unlocked behavior from `Transform 10`

### Verification Shape

The phase verification bar covered:
- `stagedNavigation`
  - one enable-state action at each snap mode root
  - one lock-state action at each snap mode root
  - preserved `X / Y / Z` axis children
- `ConsoleDock`
  - `snap:On` and `snap:Off` append the correct status text
  - `snapXYZ:Lock` and `snapXYZ:Unlock` append `Locked / Unlocked` wording
  - mode-local `Snap` adapters still return to the owning mode root after apply
