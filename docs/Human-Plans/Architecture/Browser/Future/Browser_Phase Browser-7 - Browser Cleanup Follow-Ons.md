# Browser Phase Browser-7 - Browser Cleanup Follow-Ons

## Doc Header

### Doc History
1. 2026-03-25 17:29: Created this standalone future Browser-7 phase doc as the next cleanup-tracking surface after Browser-6, explicitly reserving it for smaller Browser follow-on entries such as viewport multi-select sync and per-object zoom command-surface expansion

### Purpose

This phase is the small-follow-on Browser cleanup surface after Browser-6.

Use it to track:
- narrower Browser improvements that are real product behavior changes but do not need another large structural phase
- cleanup entries that should stay grouped under one Browser follow-on instead of being left as scattered chat-only notes
- Browser/viewer/console interaction gaps discovered while using the shipped Browser-6 structure

## Doc Body

## [ ] Browser-7 - Browser Cleanup Follow-Ons

### Summary

Browser-7 is the cleanup bucket for the next small, real Browser behavior improvements after the Browser-6 panel-structure split.

Phase outcome:
- small Browser cleanup work gets one canonical tracking surface
- Browser/viewer/console sync follow-ons stay attached to the Browser phase ladder
- each landed improvement can be recorded as one concrete Browser-7 entry instead of living only in transient chat context

### Owns

- smaller Browser follow-on improvements after Browser-6
- Browser/viewer/console interaction cleanup that is narrower than another structural panel phase
- incremental command-surface and selection-sync cleanup for existing row families

### Does Not Own

- another large BrowserPanel architecture rewrite
- full Browser primitive convergence across authored and imported content
- unrelated viewer-only camera or rendering work unless the Browser command surface explicitly owns the user-facing behavior

### Entry Tracking Rule

Browser-7 should be used as an accumulating cleanup phase.

Locked rule:
- add small concrete cleanup items under one visible tracked-entry list
- keep each item narrow and implementation-facing
- when one item lands, mark it shipped in the Browser-7 tracking list and log the real code change normally in `docs/CHANGELOG.md`
- do not let small Browser cleanup discoveries disappear into chat without a Browser-7 record

### Tracked Entries

#### [ ] b7.1 - Viewport explicit multi-select should sync back into Browser multi-select

Problem:
- when the user holds `Ctrl` and multi-selects multiple objects in the model viewport, Browser selection does not yet reliably mirror that explicit object set

Required outcome:
- explicit object multi-selection created from the model viewport should sync into Browser row multi-selection
- the synced Browser state should use the same shared explicit-selection truth already established by Browser-5.4 instead of a viewer-local parallel selection set

Constraints:
- keep one primary shared explicit selection set
- do not reintroduce Browser-local selection ownership
- preserve current single-select behavior when `Ctrl` is not used

Expected verification:
- `Ctrl` multi-pick multiple objects in the viewport
- Browser shows the same objects as explicitly selected
- Console multi-select context remains honest
- grouped viewer highlight stays aligned with the shared selection set

#### [ ] b7.2 - Every object should expose the `Zoom` command family

Problem:
- object-level command surfaces do not yet expose the `Zoom` option and its children consistently

Required outcome:
- every object command surface should include `Zoom`
- the object `Zoom` path should include its child options consistently with the broader Console zoom grammar

Constraints:
- keep naming and child-option grammar consistent with the existing Console zoom families
- do not add one-off object-only zoom wording if the shared zoom command family already has a better canonical shape

Expected verification:
- select an object from Browser
- select an object from viewport
- confirm both paths expose `Zoom`
- confirm the child zoom options are reachable and execute from the object scope

### Assumptions

- Browser-6 remains the large structural cleanup phase.
- Browser-7 is the next smaller cleanup follow-on bucket rather than another major panel-architecture rewrite.
- Shared selection truth and Console routing remain canonical across Browser, viewport, and Console surfaces.
