import { describe, expect, it } from 'vitest'
import { viewerCameraShortcutBindings } from './cameraShortcuts'
import { getShortcutInventorySourceMap } from './shortcutInventorySourceMap'

describe('shortcutInventorySourceMap', () => {
  it('catalogs viewer camera shortcuts from the existing binding owner', () => {
    const sourceMap = getShortcutInventorySourceMap()
    const cameraEntry = sourceMap.find((entry) => entry.id === 'viewer-camera-shortcuts')

    expect(cameraEntry).toMatchObject({
      label: 'Viewer camera shortcuts',
      status: 'cataloged',
      kind: 'binding-registry',
      modeLabel: 'Viewport',
      sourceFiles: ['src/app/cameraShortcuts.ts'],
      routingOwners: ['viewer-camera-shortcuts'],
    })
    expect(cameraEntry?.bindings).toBe(viewerCameraShortcutBindings)
    expect(cameraEntry?.bindings?.map((binding) => binding.action)).toEqual([
      'preset-top',
      'preset-front',
      'preset-back',
      'preset-left',
      'preset-right',
      'zoom-object',
    ])
  })

  it('separates shared routing owners from displayable binding registries', () => {
    const sourceMap = getShortcutInventorySourceMap()
    const routingEntry = sourceMap.find((entry) => entry.id === 'shared-input-routing-owners')
    const displayModeEntry = sourceMap.find((entry) => entry.id === 'viewer-display-mode-shortcut')

    expect(routingEntry).toMatchObject({
      status: 'routing-owner-only',
      kind: 'routing-owner',
      sourceFiles: ['src/app/inputRouting.ts'],
    })
    expect(routingEntry?.bindings).toBeUndefined()
    expect(routingEntry?.routingOwners).toContain('viewer-display-mode')
    expect(routingEntry?.routingOwners).toContain('console-entry')
    expect(routingEntry?.deferredReason).toContain('not yet a displayable shortcut binding registry')

    expect(displayModeEntry).toMatchObject({
      status: 'routing-owner-only',
      kind: 'routing-owner',
      routingOwners: ['viewer-display-mode'],
    })
    expect(displayModeEntry?.sourceFiles).toEqual([
      'src/app/inputRouting.ts',
      'src/app/useViewerDisplayModeMenu.ts',
    ])
    expect(displayModeEntry?.deferredReason).toContain('Shift+D')
  })

  it('records shortcut behavior settings and fragmented inline handlers as deferred work', () => {
    const sourceMap = getShortcutInventorySourceMap()
    const consolePriorityEntry = sourceMap.find((entry) => entry.id === 'console-input-priority')
    const fragmentedEntry = sourceMap.find((entry) => entry.id === 'fragmented-inline-shortcuts')

    expect(consolePriorityEntry).toMatchObject({
      label: 'Console first input priority',
      status: 'behavior-setting',
      kind: 'settings-owner-backed-behavior',
      modeLabel: 'Console',
    })
    expect(consolePriorityEntry?.sourceFiles).toContain('src/app/workspace/SettingsSurface.tsx')
    expect(consolePriorityEntry?.deferredReason).toContain('relocation into Key Bindings belongs to a later phase')

    expect(fragmentedEntry).toMatchObject({
      status: 'fragmented',
      kind: 'inline-handler',
      modeLabel: 'Mixed surfaces',
    })
    expect(fragmentedEntry?.sourceFiles).toContain('src/app/panels/useBrowserPanelController.ts')
    expect(fragmentedEntry?.deferredReason).toContain('without one clean binding-owner seam')
  })
})

