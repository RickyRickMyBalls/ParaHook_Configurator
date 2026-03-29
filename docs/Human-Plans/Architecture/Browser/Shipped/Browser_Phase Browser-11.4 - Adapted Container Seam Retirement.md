# Browser-11.4 - Adapted Container Seam Retirement

## Doc Header

### Doc History
1. 2026-03-29 09:34: Marked `Browser-11.4 - Adapted Container Seam Retirement` shipped after the Browser panel/controller/menu stopped depending on adapted root/category container branches for live owner behavior, retired the remaining Browser-facing `referenceContainerKind` plus `references-root` / `reference-category` seams for surviving rows, and kept only the narrower object-level `referenceId` runtime adapters

## Doc Body

## Summary

Delete the leftover adapted reference-container compatibility seams once real owner records and real Browser structure are in place.

Shipped outcome:
- old adapted reference-container seams no longer drive the live Browser behavior for surviving `References` and grouping rows
- Browser interactions and context routing now treat surviving root/category rows as ordinary `assembly` / `component` owners
- only the runtime/reference adapters that still provide real value survive at the object level

## What Landed

- removed the remaining Browser-panel drag/owner gating that depended on `referenceContainerKind` for surviving root/category rows
- switched live Browser expand/collapse and category-visibility handling over to owner-style `assembly` / `component` rows instead of the old `references-root` / `reference-category` interaction branches
- switched `Load All` and related live container context-menu routing over to owner-style `assembly` / `component` rows instead of adapted container variants
- refreshed focused Browser interaction and context-menu tests so the live Browser contract now exercises owner-style root/category rows instead of legacy container row kinds

## Scope / Constraints Honored

- kept the change narrowly focused on Browser-facing container seam retirement instead of widening into deeper runtime/store redesign
- preserved the settled `11.3` tree shape while retiring the remaining root/category interaction seams
- preserved narrow object-level `referenceId` adapters for runtime/reference behaviors such as load, retry, remove, and transform where those seams still honestly need them

## Follow-On Notes

- Browser-11 now reads as a fully shipped first-pass container-parity ladder
- surviving root/category rows now behave through normal owner paths across the Browser-facing controller, interaction, and context-menu seams
- deeper runtime/store cleanup beyond those Browser-facing seams remains a separate concern from the shipped Browser-11 container-parity pass
