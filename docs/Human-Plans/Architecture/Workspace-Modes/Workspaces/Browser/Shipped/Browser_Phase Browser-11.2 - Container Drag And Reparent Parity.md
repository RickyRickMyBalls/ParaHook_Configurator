# Browser-11.2 - Container Drag And Reparent Parity

## Doc Header

### Doc History
1. 2026-03-29 08:59: Marked `Browser-11.2 - Container Drag And Reparent Parity` shipped after promoted reference category containers like `Shoes` entered the normal Browser drag path, the shared owner-drop seam started accepting those component rows, and the effective-parent store logic now lets those containers move into and back out of authored assemblies without reintroducing a second reference-only drag contract

## Doc Body

## Summary

Give promoted reference containers the same drag and reparent behavior as normal authored Browser containers.

Shipped outcome:
- promoted reference category containers such as `Shoes`, `Footpads`, and `Premade Foothooks` now enter Browser drag as normal `component` owner targets
- those promoted category containers can reparent into and back out of authored assemblies through the shared Browser/store move path
- the live Browser no longer blocks those visible category rows solely because they carry `referenceContainerKind`
- Browser drag legality stays shared instead of inventing a separate reference-container move contract

## What Landed

- removed the controller-only drag exclusion that kept visible promoted category rows out of the normal Browser drag session
- split Browser row-to-owner resolution so non-draggable rows like `References` can still act as honest owner drop targets while promoted category rows can drag
- widened the shared owner-record seam so promoted category rows resolve effective assembly parents from real assembly child order
- updated the Browser/store move path so promoted category rows can move into authored assemblies and back into `References` without requiring literal `componentsById` persistence
- kept runtime/reference affordances such as `Load All`, category expand/collapse, and existing compatibility actions intact

## Scope / Constraints Honored

- kept the change focused on container move semantics instead of mixing in grouping-label survival decisions from `11.3`
- preserved the current `References` runtime/reference affordances and kept the top-level `References` row as a drop target instead of widening this pass into full root-assembly drag parity
- avoided inventing a new reference-only draggable target kind by reusing the shared `assembly` / `component` owner path

## Follow-On Notes

- promoted category containers now have honest move/reparent behavior
- the top-level `References` assembly still stays non-draggable in this pass
- grouping-label survival and any later removal of now-unnecessary container labels remains the job of `Browser-11.3`
