import { describe, expect, it } from 'vitest'
import { viewerCameraShortcutBindings } from './cameraShortcuts'
import {
  buildShortcutInventoryGroups,
  getShortcutInventoryReadModel,
  shortcutPresetReads,
} from './shortcutInventoryReadModel'
import { getShortcutInventorySourceMap } from './shortcutInventorySourceMap'

describe('shortcutInventoryReadModel', () => {
  it('normalizes cataloged viewer camera bindings into displayable rows from the source owner', () => {
    const model = getShortcutInventoryReadModel()
    const cameraGroup = model.groups.find((group) => group.id === 'viewer-camera-shortcuts')

    expect(cameraGroup).toMatchObject({
      label: 'Viewer camera shortcuts',
      modeLabel: 'Viewport',
      status: 'cataloged',
      sourceId: 'viewer-camera-shortcuts',
      deferredReason: undefined,
    })
    expect(cameraGroup?.rows).toHaveLength(viewerCameraShortcutBindings.length)
    expect(cameraGroup?.rows.map((row) => row.commandLabel)).toEqual(
      viewerCameraShortcutBindings.map((binding) => binding.label),
    )
    expect(cameraGroup?.rows.map((row) => row.keyChord)).toEqual([
      'Numpad 5',
      'Numpad 2',
      'Numpad 8',
      'Numpad 4',
      'Numpad 6',
      'Shift+Z',
    ])
    expect(cameraGroup?.rows.every((row) => row.sourceId === 'viewer-camera-shortcuts')).toBe(true)
  })

  it('keeps routing-only behavior-setting and fragmented sources as deferred groups', () => {
    const groups = buildShortcutInventoryGroups()
    const routingGroup = groups.find((group) => group.id === 'viewer-display-mode-shortcut')
    const consolePriorityGroup = groups.find((group) => group.id === 'console-input-priority')
    const fragmentedGroup = groups.find((group) => group.id === 'fragmented-inline-shortcuts')

    expect(routingGroup).toMatchObject({
      status: 'routing-owner-only',
      rows: [],
    })
    expect(routingGroup?.deferredReason).toContain('Shift+D')

    expect(consolePriorityGroup).toMatchObject({
      status: 'behavior-setting',
      rows: [],
    })
    expect(consolePriorityGroup?.deferredReason).toContain('not a key binding')

    expect(fragmentedGroup).toMatchObject({
      status: 'fragmented',
      rows: [],
    })
    expect(fragmentedGroup?.deferredReason).toContain('without one clean binding-owner seam')
  })

  it('orders cataloged groups before routing owner behavior setting and fragmented groups', () => {
    const groups = buildShortcutInventoryGroups()

    expect(groups.map((group) => group.status)).toEqual([
      'cataloged',
      'routing-owner-only',
      'routing-owner-only',
      'behavior-setting',
      'fragmented',
    ])
  })

  it('exposes Default and copied Blender working preset reads over the same shortcut groups', () => {
    expect(shortcutPresetReads).toEqual([
      { id: 'default', label: 'Default' },
      { id: 'blender-working', label: 'Blender (working)', sourcePresetId: 'default' },
    ])

    const defaultModel = getShortcutInventoryReadModel('default')
    const blenderModel = getShortcutInventoryReadModel('blender-working')

    expect(defaultModel.preset).toEqual({ id: 'default', label: 'Default' })
    expect(blenderModel.preset).toEqual({
      id: 'blender-working',
      label: 'Blender (working)',
      sourcePresetId: 'default',
    })
    expect(blenderModel.groups).toEqual(defaultModel.groups)
  })

  it('normalizes all Phase 1 source-map entries into one shared group contract', () => {
    const sourceMap = getShortcutInventorySourceMap()
    const groups = buildShortcutInventoryGroups(sourceMap)

    expect(groups).toHaveLength(sourceMap.length)
    expect(groups.map((group) => group.sourceId).sort()).toEqual(
      sourceMap.map((source) => source.id).sort(),
    )
    expect(groups.every((group) => Array.isArray(group.rows))).toBe(true)
  })
})

