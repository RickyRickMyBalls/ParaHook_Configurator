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

  it('catalogs the Fly Mode entry gesture from the viewer owner', () => {
    const sourceMap = getShortcutInventorySourceMap()
    const flyEntry = sourceMap.find((entry) => entry.id === 'viewer-fly-mode-entry')

    expect(flyEntry).toMatchObject({
      label: 'Fly Mode',
      status: 'cataloged',
      kind: 'gesture-binding',
      modeLabel: 'Viewport',
      sourceFiles: ['src/viewer/Viewer.ts', 'src/app/viewerBridge.ts', 'src/app/inputRouting.ts'],
      routingOwners: ['viewer-fly'],
    })
    expect(flyEntry?.displayBindings).toEqual([
      {
        id: 'fly-mode-entry-right-click-hold',
        label: 'Enter Fly Mode',
        keyChord: 'Right click hold',
        sectionLabel: 'Entry',
        contextNote: 'Current default fly activation mode.',
      },
      {
        id: 'fly-mode-look-mouse-move',
        label: 'Look',
        keyChord: 'Mouse move',
        sectionLabel: 'While flying',
        contextNote: 'Active while right click is held in Fly Mode.',
      },
      { id: 'fly-mode-forward', label: 'Forward', keyChord: 'W', sectionLabel: 'While flying' },
      { id: 'fly-mode-backward', label: 'Backward', keyChord: 'S', sectionLabel: 'While flying' },
      { id: 'fly-mode-left', label: 'Left', keyChord: 'A', sectionLabel: 'While flying' },
      { id: 'fly-mode-right', label: 'Right', keyChord: 'D', sectionLabel: 'While flying' },
      { id: 'fly-mode-up', label: 'Up', keyChord: 'Space', sectionLabel: 'While flying' },
      { id: 'fly-mode-down', label: 'Down', keyChord: 'Control', sectionLabel: 'While flying' },
      { id: 'fly-mode-boost', label: 'Boost', keyChord: 'Shift', sectionLabel: 'While flying' },
      {
        id: 'fly-mode-roll-left',
        label: 'Roll left',
        keyChord: 'Q',
        sectionLabel: 'While flying',
        contextNote: 'Drone mode only.',
      },
      {
        id: 'fly-mode-roll-right',
        label: 'Roll right',
        keyChord: 'E',
        sectionLabel: 'While flying',
        contextNote: 'Drone mode only.',
      },
    ])
  })

  it('catalogs normal camera controls as read-only viewer gesture rows', () => {
    const sourceMap = getShortcutInventorySourceMap()
    const cameraControlsEntry = sourceMap.find(
      (entry) => entry.id === 'viewer-normal-camera-controls',
    )

    expect(cameraControlsEntry).toMatchObject({
      label: 'Normal camera controls',
      status: 'cataloged',
      kind: 'gesture-binding',
      modeLabel: 'Viewport',
      sourceFiles: ['src/viewer/Viewer.ts', 'src/viewer/scene/CameraController.ts'],
    })
    expect(cameraControlsEntry?.bindings).toBeUndefined()
    expect(cameraControlsEntry?.displayBindings).toEqual([
      {
        id: 'normal-camera-orbit',
        label: 'Orbit',
        keyChord: 'Ctrl+middle mouse drag',
        sectionLabel: 'Normal camera',
      },
      {
        id: 'normal-camera-pan',
        label: 'Pan',
        keyChord: 'Middle mouse drag',
        sectionLabel: 'Normal camera',
        contextNote: 'Starts after the held middle button moves past the click threshold.',
      },
      {
        id: 'normal-camera-zoom',
        label: 'Zoom',
        keyChord: 'Mouse wheel',
        sectionLabel: 'Normal camera',
        contextNote: 'Normal viewing uses OrbitControls wheel zoom; Fly Mode remaps wheel to speed.',
      },
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
