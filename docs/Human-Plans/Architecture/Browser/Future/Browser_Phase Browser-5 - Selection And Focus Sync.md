# Browser Phase Browser-5 - Selection And Focus Sync

## Doc Header

### Doc History
1. 2026-03-24 13:11: Created this standalone future Browser phase doc so the later Browser/viewer/graph selection-and-focus cleanup now has its own planning home under `Browser/Future/` instead of remaining only as a Browser family bullet

### Purpose

This phase makes Browser selection and focus behave like one coherent workspace system.

Use it to answer:
- how Browser selection should map to workspace targets
- how viewer highlight, graph focus, and console context should align
- where Browser-local selection should stop and shared target truth should begin

## Doc Body

## [ ] Browser-5 - Selection And Focus Sync

Summary:
- unify Browser selection and workspace target sync
- make viewer highlight, graph focus, and console context read cleaner shared truth
- reduce row-kind-specific focus drift

Owns:
- Browser-to-viewer selection sync
- Browser-to-graph/editor focus sync
- selected-target consistency

