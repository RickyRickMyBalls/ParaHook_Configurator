# Browser-10.1 - Unified Reference-Backed Project Owner Records

## Summary

Implemented the first `Browser-10` ownership cleanup so Browser-visible reference-backed objects now commit through one canonical `imported-reference` owner path instead of carrying a second `source-reference` drag/store identity.

Shipped result:
- Browser/store no longer define a separate `source-reference` draggable owner identity
- Browser drag/drop resolution now routes reference-backed object rows through the shared `imported-reference` owner seam
- the old `place-source` placement branch and `placeBrowserSourceReferenceObject(...)` seam are removed
- shelf-versus-parented reference-backed differences remain visible as row metadata/presentation, not as a second owner identity
- current `reference-item` selection and transform compatibility stays adapter-backed for later `Browser-10` routing cleanup

## What Landed

- simplified `BrowserDraggableTarget` back to the real project-owner branches so reference-backed objects participate through the existing `imported-reference` owner model
- collapsed `resolveBrowserDraggableTargetDrop(...)` onto the shared project-owner drop resolution instead of preserving the older `source-reference` / `place-source` branch
- removed the unused `placeBrowserSourceReferenceObject(...)` store seam now that ordinary Browser drag no longer treats shelf rows as a separate owner identity
- cleaned up Browser controller and BrowserPanel test guards that still treated `source-reference` as a special drag target even though the controller already mapped those rows onto `imported-reference`
- kept visible row traits such as shelf/source presentation intact so `10.1` stays scoped to owner identity rather than forcing the later Browser-10 tree-derivation rewrite into the same pass

## Notes

This shipped phase intentionally keeps:
- `contentOriginKind: 'source-reference'` as a temporary row-level presentation trait
- `reference-item` workspace-target compatibility for selection, Console, and transform flows
- the current `referenceWorkspace`-driven Browser derivation until later `Browser-10.2`

This phase does not yet cover:
- deriving Browser rows from one unified project tree
- collapsing Browser, Console, and viewer routing onto one owner-target model
- deeper load/runtime trait cleanup
- final compatibility seam retirement
