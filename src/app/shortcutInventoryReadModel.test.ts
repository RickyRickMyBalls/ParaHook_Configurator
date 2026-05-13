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
    expect(cameraGroup?.rows.every((row) => row.editability === 'editable')).toBe(true)
    expect(cameraGroup?.rows.map((row) => row.bindingValue)).toEqual([
      { kind: 'keyboard', code: 'Numpad5', shiftKey: undefined },
      { kind: 'keyboard', code: 'Numpad2', shiftKey: undefined },
      { kind: 'keyboard', code: 'Numpad8', shiftKey: undefined },
      { kind: 'keyboard', code: 'Numpad4', shiftKey: undefined },
      { kind: 'keyboard', code: 'Numpad6', shiftKey: undefined },
      { kind: 'keyboard', code: 'KeyZ', shiftKey: true },
    ])
  })

  it('normalizes the Fly Mode entry gesture and in-flight controls into displayable rows', () => {
    const model = getShortcutInventoryReadModel()
    const flyGroup = model.groups.find((group) => group.id === 'viewer-fly-mode-entry')

    expect(flyGroup).toMatchObject({
      label: 'Fly Mode',
      modeLabel: 'Viewport',
      status: 'cataloged',
      sourceId: 'viewer-fly-mode-entry',
      deferredReason: undefined,
    })
    expect(flyGroup?.rows).toEqual([
      {
        id: 'viewer-fly-mode-entry:fly-mode-entry-right-click-hold',
        commandLabel: 'Enter Fly Mode',
        keyChord: 'Right click hold',
        modeLabel: 'Viewport',
        sourceId: 'viewer-fly-mode-entry',
        editability: 'read-only',
        sectionLabel: 'Entry',
        contextNote: 'Current default fly activation mode.',
      },
      {
        id: 'viewer-fly-mode-entry:fly-mode-look-mouse-move',
        commandLabel: 'Look',
        keyChord: 'Mouse move',
        modeLabel: 'Viewport',
        sourceId: 'viewer-fly-mode-entry',
        editability: 'read-only',
        sectionLabel: 'While flying',
        contextNote: 'Active while right click is held in Fly Mode.',
      },
      {
        id: 'viewer-fly-mode-entry:fly-mode-forward',
        commandLabel: 'Forward',
        keyChord: 'W',
        modeLabel: 'Viewport',
        sourceId: 'viewer-fly-mode-entry',
        editability: 'read-only',
        sectionLabel: 'While flying',
        contextNote: undefined,
      },
      {
        id: 'viewer-fly-mode-entry:fly-mode-backward',
        commandLabel: 'Backward',
        keyChord: 'S',
        modeLabel: 'Viewport',
        sourceId: 'viewer-fly-mode-entry',
        editability: 'read-only',
        sectionLabel: 'While flying',
        contextNote: undefined,
      },
      {
        id: 'viewer-fly-mode-entry:fly-mode-left',
        commandLabel: 'Left',
        keyChord: 'A',
        modeLabel: 'Viewport',
        sourceId: 'viewer-fly-mode-entry',
        editability: 'read-only',
        sectionLabel: 'While flying',
        contextNote: undefined,
      },
      {
        id: 'viewer-fly-mode-entry:fly-mode-right',
        commandLabel: 'Right',
        keyChord: 'D',
        modeLabel: 'Viewport',
        sourceId: 'viewer-fly-mode-entry',
        editability: 'read-only',
        sectionLabel: 'While flying',
        contextNote: undefined,
      },
      {
        id: 'viewer-fly-mode-entry:fly-mode-up',
        commandLabel: 'Up',
        keyChord: 'Space',
        modeLabel: 'Viewport',
        sourceId: 'viewer-fly-mode-entry',
        editability: 'read-only',
        sectionLabel: 'While flying',
        contextNote: undefined,
      },
      {
        id: 'viewer-fly-mode-entry:fly-mode-down',
        commandLabel: 'Down',
        keyChord: 'Control',
        modeLabel: 'Viewport',
        sourceId: 'viewer-fly-mode-entry',
        editability: 'read-only',
        sectionLabel: 'While flying',
        contextNote: undefined,
      },
      {
        id: 'viewer-fly-mode-entry:fly-mode-boost',
        commandLabel: 'Boost',
        keyChord: 'Shift',
        modeLabel: 'Viewport',
        sourceId: 'viewer-fly-mode-entry',
        editability: 'read-only',
        sectionLabel: 'While flying',
        contextNote: undefined,
      },
      {
        id: 'viewer-fly-mode-entry:fly-mode-roll-left',
        commandLabel: 'Roll left',
        keyChord: 'Q',
        modeLabel: 'Viewport',
        sourceId: 'viewer-fly-mode-entry',
        editability: 'read-only',
        sectionLabel: 'While flying',
        contextNote: 'Drone mode only.',
      },
      {
        id: 'viewer-fly-mode-entry:fly-mode-roll-right',
        commandLabel: 'Roll right',
        keyChord: 'E',
        modeLabel: 'Viewport',
        sourceId: 'viewer-fly-mode-entry',
        editability: 'read-only',
        sectionLabel: 'While flying',
        contextNote: 'Drone mode only.',
      },
    ])
  })

  it('normalizes normal camera controls as read-only Viewport gesture rows', () => {
    const model = getShortcutInventoryReadModel()
    const cameraControlsGroup = model.groups.find(
      (group) => group.id === 'viewer-normal-camera-controls',
    )

    expect(cameraControlsGroup).toMatchObject({
      label: 'Normal camera controls',
      modeLabel: 'Viewport',
      status: 'cataloged',
      sourceId: 'viewer-normal-camera-controls',
      deferredReason: undefined,
    })
    expect(cameraControlsGroup?.rows).toEqual([
      {
        id: 'viewer-normal-camera-controls:normal-camera-orbit',
        commandLabel: 'Orbit',
        keyChord: 'Ctrl+middle mouse drag',
        modeLabel: 'Viewport',
        sourceId: 'viewer-normal-camera-controls',
        editability: 'read-only',
        sectionLabel: 'Normal camera',
        contextNote: undefined,
      },
      {
        id: 'viewer-normal-camera-controls:normal-camera-pan',
        commandLabel: 'Pan',
        keyChord: 'Middle mouse drag',
        modeLabel: 'Viewport',
        sourceId: 'viewer-normal-camera-controls',
        editability: 'read-only',
        sectionLabel: 'Normal camera',
        contextNote: 'Starts after the held middle button moves past the click threshold.',
      },
      {
        id: 'viewer-normal-camera-controls:normal-camera-zoom',
        commandLabel: 'Zoom',
        keyChord: 'Mouse wheel',
        modeLabel: 'Viewport',
        sourceId: 'viewer-normal-camera-controls',
        editability: 'read-only',
        sectionLabel: 'Normal camera',
        contextNote: 'Normal viewing uses OrbitControls wheel zoom; Fly Mode remaps wheel to speed.',
      },
    ])
    expect(cameraControlsGroup?.rows.every((row) => row.bindingValue === undefined)).toBe(true)
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
      'cataloged',
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

  it('keeps only viewer camera keyboard rows editable until other families get owner contracts', () => {
    const model = getShortcutInventoryReadModel()
    const editableRows = model.groups.flatMap((group) =>
      group.rows.filter((row) => row.editability === 'editable'),
    )
    const readOnlyRows = model.groups.flatMap((group) =>
      group.rows.filter((row) => row.editability === 'read-only'),
    )
    const deferredGroups = model.groups.filter((group) => group.status !== 'cataloged')

    expect(editableRows.map((row) => row.id)).toEqual([
      'viewer-camera-shortcuts:preset-top',
      'viewer-camera-shortcuts:preset-front',
      'viewer-camera-shortcuts:preset-back',
      'viewer-camera-shortcuts:preset-left',
      'viewer-camera-shortcuts:preset-right',
      'viewer-camera-shortcuts:zoom-object',
    ])
    expect(editableRows.every((row) => row.bindingValue?.kind === 'keyboard')).toBe(true)
    expect(readOnlyRows.every((row) => row.bindingValue === undefined)).toBe(true)
    expect(deferredGroups.every((group) => group.rows.length === 0)).toBe(true)
  })
})
