# Gen4 - Cleanup 2 - Workspace Shell Setting Standardization

## Doc Header

### Doc History
1. 2026-05-11 14:59:19: Created this `Gen 4 - Cleanup 2` future plan to standardize workspace shell settings after `Cleanup 1`, starting with moving the workspace panel shell padding ParaSlider from the Settings/Properties bridge into the shared `WorkspacePanelSplitShell` contract so it affects Catalog, Settings, Properties, and later shared-shell consumers.

### Purpose

This doc owns the next cleanup lane after `Gen 4 - Cleanup 1`.

Use it to standardize workspace shell settings that should apply to every shared workspace panel shell instead of living in one workspace-specific bridge.

Primary user intent:
- the `Workspace panel shell padding` ParaSlider should affect all workspace types that use the shared shell, not only Settings and Properties.
- Catalog, Settings, and Properties should feel like one standardized workspace family while still owning their own inner content.

### Scope

This cleanup owns:
- moving shared shell preferences into the shared shell contract
- removing Settings-specific naming from shared shell padding behavior
- proving all current `WorkspacePanelSplitShell` consumers respond to the same setting
- recording future workspace-shell setting rules for later workspace types

This cleanup does not own:
- redesigning Catalog, Settings, or Properties content
- rewriting Catalog source/import/preview behavior
- adding nested or arbitrary multi-panel splitting
- replacing `WorkspacePanelSplitShell`
- moving workspace layout ownership out of the current stores

## Doc Body

### Cleanup Goal

`Gen 4 - Cleanup 1` created the shared two-panel workspace shell and migrated Catalog, Settings, and Properties onto it.

`Gen 4 - Cleanup 2` should make the settings around that shell honest and standardized.

The first mismatch is now visible:
- `workspacePanelShellPaddingPx` exists as a persisted Workspace setting.
- Settings and Properties consume it through `SettingsSurfacePanelShell`.
- Catalog still does not consume it because the setting has not been moved into `WorkspacePanelSplitShell`.

The desired direction:
- `WorkspacePanelSplitShell` should own shared shell padding.
- every `WorkspacePanelSplitShell` consumer should receive the same persisted padding by default.
- workspace-specific wrappers should only own content-specific styling.

### Current Live Read

Current shared-shell consumers:
- `src/app/workspace/SettingsSurface.tsx`
  - uses `WorkspacePanelSplitShell`
  - passes `className="SettingsSurfacePanelShell"`
  - currently sets `--settings-surface-panel-shell-padding`
- `src/app/workspace/PropertiesSurface.tsx`
  - uses `WorkspacePanelSplitShell`
  - passes `className="SettingsSurfacePanelShell"`
  - currently sets `--settings-surface-panel-shell-padding`
- `src/app/catalog/ui/CatalogShell.tsx`
  - uses `WorkspacePanelSplitShell`
  - passes `className="CatalogShell"`
  - does not consume `workspacePanelShellPaddingPx`
- `src/app/theme/surfaces/workspace-panel-shell.css`
  - owns the shared shell grid, divider, responsive stack, and left-width CSS variable
  - does not yet own shell padding
- `src/app/theme/surfaces/settings.css`
  - `.SettingsSurfacePanelShell` currently owns padding via `--settings-surface-panel-shell-padding`

### Architecture Direction

Shared shell preferences belong to `WorkspacePanelSplitShell`, not to one workspace bridge.

Workspace-specific classes can remain as stable styling hooks, but they should not own settings that are meant to apply across all shared shell consumers.

The naming should move from:
- `--settings-surface-panel-shell-padding`

Toward:
- `--workspace-panel-shell-padding`

The store setting can keep the current name:
- `workspacePanelShellPaddingPx`

That name is already correctly scoped to workspace panel shell behavior.

### Acceptance Read

This cleanup is acceptable when:
- the padding ParaSlider affects Catalog, Settings, and Properties
- Settings and Properties no longer need a Settings-named CSS variable for shared shell padding
- Catalog can opt into the same shared shell padding without custom Catalog padding logic
- tests prove the shared setting travels through the shared shell, not through one workspace-specific bridge
- future workspace types have an obvious contract: use `WorkspacePanelSplitShell`, get shared shell settings by default

## Vision

Workspace shell controls should feel like app-wide controls.

When the user adjusts a Workspace setting, every workspace using the shared shell should respond unless there is a deliberate, named exception.

This keeps the app from becoming a pile of almost-identical shells that each require a separate setting, selector, and test path.

## Wishlist Organization

### High Level Goals

- [ ] `Cleanup-Gen4-HLG-5` - Standardize shared workspace shell settings so one ParaSlider affects all workspace shell types.
- [ ] `Cleanup-Gen4-HLG-6` - Keep workspace-specific content owned by each workspace while moving shared frame behavior into the shared shell.
- [ ] `Cleanup-Gen4-HLG-7` - Make future workspace shell settings obvious to add without duplicating Settings/Properties/Catalog glue.

### Codex Level Goals

- [ ] Move shared panel-shell padding consumption into `WorkspacePanelSplitShell`.
- [ ] Replace Settings-named shared shell padding CSS with workspace-shell naming.
- [ ] Prove Catalog, Settings, and Properties all respond to `workspacePanelShellPaddingPx`.
- [ ] Document the rule that future shared-shell settings should be implemented at the shared shell layer first.

### `Gen 4 - Cleanup 2 / Phase 1`

- [ ] `Cleanup-Gen4-HLG-5` - Standardize shared workspace shell settings so one ParaSlider affects all workspace shell types.
- [ ] Move `workspacePanelShellPaddingPx` consumption into `WorkspacePanelSplitShell`.
- [ ] Make Catalog respond to the same Workspace padding ParaSlider.
- [ ] Keep the default at `0 px`.

### `Gen 4 - Cleanup 2 / Phase 2`

- [ ] `Cleanup-Gen4-HLG-6` - Keep workspace-specific content owned by each workspace while moving shared frame behavior into the shared shell.
- [ ] Remove Settings-specific shared shell padding naming.
- [ ] Keep Settings/Properties content-fill CSS where it still belongs.
- [ ] Keep Catalog-specific shell hooks only where they still express Catalog content needs.

### `Gen 4 - Cleanup 2 / Phase 3`

- [ ] `Cleanup-Gen4-HLG-7` - Make future workspace shell settings obvious to add without duplicating Settings/Properties/Catalog glue.
- [ ] Add final shared-shell setting contract notes.
- [ ] Record any remaining future shared-shell candidates without implementing them.
- [ ] Close `Cleanup 2` with clear follow-up boundaries.

## [ ] `Gen 4 - Cleanup 2 / Phase 1` - `Shared Padding Setting Adoption`

### Phase 1 Summary

#### Purpose

Make the existing `Workspace panel shell padding` ParaSlider affect every current `WorkspacePanelSplitShell` consumer.

#### Owns

- moving padding consumption into `WorkspacePanelSplitShell`
- making Catalog respond to `workspacePanelShellPaddingPx`
- keeping Settings/Properties behavior intact
- focused tests for all three current shared-shell consumers

#### Does Not Own

- renaming every shell class
- redesigning shell visuals
- adding new shell settings beyond padding
- changing the persisted setting name
- changing panel width resize behavior

#### Current Live Read

`workspacePanelShellPaddingPx` is already:
- stored in `useUiPrefsStore`
- persisted through UI prefs
- editable with a `ParaSlider` in Settings > Workspace

But the value is currently consumed through Settings/Properties surface-level CSS variables, so Catalog does not respond.

### Phase 1 Implementation Spec

#### Exact First Code Cut

Move the `workspacePanelShellPaddingPx` subscription and CSS variable emission into `WorkspacePanelSplitShell`.

Recommended shape:
- import `useUiPrefsStore` inside `WorkspacePanelSplitShell.tsx`
- read `workspacePanelShellPaddingPx`
- add `--workspace-panel-shell-padding: ${workspacePanelShellPaddingPx}px` to the shell style
- update `workspace-panel-shell.css` so `.WorkspacePanelSplitShell` uses `padding: var(--workspace-panel-shell-padding, 0)`
- remove surface-level padding variable wiring from `SettingsSurface.tsx` and `PropertiesSurface.tsx`
- remove `.SettingsSurfacePanelShell { padding: var(--settings-surface-panel-shell-padding, 0); }`
- keep `.SettingsSurfacePanelShell .SettingsSurfaceRail, .SettingsSurfacePanelShell .SettingsSurfaceContent` if still needed for content fill
- decide whether `.CatalogShell { padding: 0; }` should be removed so shared padding can apply cleanly; if it remains, it must not override the shared shell padding

#### Likely Files

- `src/app/workspace/WorkspacePanelSplitShell.tsx`
- `src/app/theme/surfaces/workspace-panel-shell.css`
- `src/app/workspace/WorkspacePanelSplitShell.test.tsx`
- `src/app/workspace/SettingsSurface.tsx`
- `src/app/workspace/SettingsSurface.test.tsx`
- `src/app/workspace/PropertiesSurface.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/catalog/ui/CatalogShell.test.tsx`
- `src/app/theme/surfaces/settings.css`
- `src/app/theme/surfaces/catalog.css`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- this doc
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen4-Index.md`

#### No-Widening Rule

Do not add another setting in Phase 1.

Do not change the slider's persisted setting name.

Do not rewrite the Catalog, Settings, or Properties content layouts.

Do not implement nested panel splitting.

#### Checklist

- [ ] `WorkspacePanelSplitShell` consumes `workspacePanelShellPaddingPx`.
- [ ] Shared shell CSS owns the padding variable.
- [ ] Settings no longer emits the Settings-named padding CSS variable.
- [ ] Properties no longer emits the Settings-named padding CSS variable.
- [ ] Catalog responds to the same padding setting.
- [ ] Existing default remains `0 px`.

#### Verification Shape

- `npm test -- WorkspacePanelSplitShell.test.tsx SettingsSurface.test.tsx PropertiesSurface.test.tsx CatalogShell.test.tsx`
- targeted Catalog surface proof if needed:
  - `npm test -- CatalogSurface.test.tsx -t "uses an explicit content scroll owner inside the shared Catalog shell"`
- `npm run build`

#### Done Shape

The Workspace padding ParaSlider affects Catalog, Settings, and Properties through `WorkspacePanelSplitShell`.

## [ ] `Gen 4 - Cleanup 2 / Phase 2` - `Shared Shell Naming And Bridge Cleanup`

### Phase 2 Summary

#### Purpose

Clean up names and bridges left after Phase 1 so shared-shell settings do not look Settings-owned.

#### Owns

- Settings-named padding CSS removal
- thin bridge cleanup after shared shell setting adoption
- preserving content-specific class ownership

#### Does Not Own

- broad visual redesign
- changing shell component name
- changing store preference names unless Phase 1 discovers a real mismatch

### Phase 2 Implementation Spec

#### Exact First Code Cut

Audit class and CSS variable names after Phase 1.

Remove or rename bridge names only when they are actively misleading and safe to update in one pass.

Do not remove stable content classes simply because their names mention Settings if Properties still intentionally reuses that section/content template.

#### Likely Files

- `src/app/theme/surfaces/settings.css`
- `src/app/workspace/SettingsSurface.tsx`
- `src/app/workspace/PropertiesSurface.tsx`
- focused Settings/Properties tests
- docs/changelog/log

#### No-Widening Rule

Do not split out a full `WorkspaceSectionShell` unless the post-Phase-1 duplication is genuinely blocking clarity.

#### Checklist

- [ ] No Settings-named CSS variable owns shared shell padding.
- [ ] Remaining Settings-named classes are either Settings content classes or an intentional Settings/Properties section-template bridge.
- [ ] Tests still prove Settings and Properties render through the shared shell.

#### Verification Shape

- `npm test -- SettingsSurface.test.tsx PropertiesSurface.test.tsx`
- `npm run build`

#### Done Shape

Shared settings are named like shared settings, and workspace-specific content styling remains local.

## [ ] `Gen 4 - Cleanup 2 / Phase 3` - `Future Shared Shell Settings Contract`

### Phase 3 Summary

#### Purpose

Close Cleanup 2 with a small contract for future shared shell settings.

#### Owns

- future shell setting rules
- candidate list for later settings
- final Gen4 Cleanup 2 closeout docs

#### Does Not Own

- implementing the future settings
- starting nested panel splitting
- creating a new workspace layout store

### Phase 3 Implementation Spec

#### Exact First Code Cut

Add a short final contract note to this doc and the Gen4 index:
- shared frame settings should be consumed inside `WorkspacePanelSplitShell`
- workspace-specific content settings should stay in the owning workspace
- exceptions must be named and tested

Candidate future shared settings can be listed without implementing them:
- shared shell padding
- shared shell min/default/max left width
- shared shell divider width
- shared shell responsive breakpoint
- future persisted panel widths

#### Likely Files

- this doc
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen4-Index.md`
- `docs/Doc-Log.md`
- maybe `docs/CHANGELOG.md` only if code changed in the same pass

#### No-Widening Rule

Do not implement candidates in Phase 3.

#### Checklist

- [ ] Shared-shell setting rule documented.
- [ ] Candidate future settings listed.
- [ ] Cleanup 2 closeout recorded.

#### Verification Shape

- docs-only diff review unless code changes

#### Done Shape

Future shared shell settings have an obvious implementation home and boundary.
