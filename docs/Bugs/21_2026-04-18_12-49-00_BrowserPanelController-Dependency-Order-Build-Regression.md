# 21 - BrowserPanelController Browser-Tree Dependency Order Build Regression

## Doc History
1. 2026-04-18 12:49: Added this report for the TypeScript build failure introduced after recent `Catalog-Gen0.2.1` Browser baseline edits where `browserTreeRows` was referenced in a memo dependency before declaration in `useBrowserPanelController.ts`.

## Status

- `[investigating]`

## Summary

`npm run build` fails with `TS2448`/`TS2454` in `src/app/panels/useBrowserPanelController.ts` because `browserTreeRows` is accessed inside a `useMemo` dependency array before the `browserTreeRows` const is declared later in the same scope.

## Repro

- run: `npm run build`
- observe:
  - `src/app/panels/useBrowserPanelController.ts:670:7 - error TS2448: Block-scoped variable 'browserTreeRows' used before its declaration.`
  - `src/app/panels/useBrowserPanelController.ts:670:7 - error TS2454: Variable 'browserTreeRows' is used before it is assigned.`

## Current Strongest Read

The `mountedReferenceContainerRowIds` memo is declared above the `browserTreeRows` memo but its dependency array reads `browserTreeRows.contentRows`. This violates lexical block scope order and causes TypeScript compile-time failure.

## Likely Fix

- move the `useMemo` declaration for `browserTreeRows` above any memo that depends on it (`mountedReferenceContainerRowIds`).
- re-run build to confirm the compile errors are resolved.

## Likely Files

- `src/app/panels/useBrowserPanelController.ts`

## Notes

- This is currently a build-blocking regression and should be treated as a hotfix before any runtime behavior checks.

