import {
  viewerCameraShortcutBindings,
  type ViewerCameraShortcutBinding,
} from './cameraShortcuts'
import type { InputRoutingOwner } from './inputRouting'

export type ShortcutInventorySourceStatus =
  | 'cataloged'
  | 'routing-owner-only'
  | 'behavior-setting'
  | 'fragmented'

export type ShortcutInventorySourceKind =
  | 'binding-registry'
  | 'gesture-binding'
  | 'routing-owner'
  | 'settings-owner-backed-behavior'
  | 'inline-handler'

export type ShortcutInventoryDisplayBinding = {
  id: string
  label: string
  keyChord: string
  sectionLabel?: string
  contextNote?: string
}

export type ShortcutInventorySourceEntry = {
  id: string
  label: string
  status: ShortcutInventorySourceStatus
  kind: ShortcutInventorySourceKind
  modeLabel: string
  sourceFiles: readonly string[]
  routingOwners?: readonly InputRoutingOwner[]
  bindings?: readonly ViewerCameraShortcutBinding[]
  displayBindings?: readonly ShortcutInventoryDisplayBinding[]
  deferredReason?: string
}

export const shortcutInventorySourceMap: readonly ShortcutInventorySourceEntry[] = [
  {
    id: 'viewer-camera-shortcuts',
    label: 'Viewer camera shortcuts',
    status: 'cataloged',
    kind: 'binding-registry',
    modeLabel: 'Viewport',
    sourceFiles: ['src/app/cameraShortcuts.ts'],
    routingOwners: ['viewer-camera-shortcuts'],
    bindings: viewerCameraShortcutBindings,
  },
  {
    id: 'viewer-normal-camera-controls',
    label: 'Normal camera controls',
    status: 'cataloged',
    kind: 'gesture-binding',
    modeLabel: 'Viewport',
    sourceFiles: ['src/viewer/Viewer.ts', 'src/viewer/scene/CameraController.ts'],
    displayBindings: [
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
    ],
  },
  {
    id: 'viewer-fly-mode-entry',
    label: 'Fly Mode',
    status: 'cataloged',
    kind: 'gesture-binding',
    modeLabel: 'Viewport',
    sourceFiles: ['src/viewer/Viewer.ts', 'src/app/viewerBridge.ts', 'src/app/inputRouting.ts'],
    routingOwners: ['viewer-fly'],
    displayBindings: [
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
      {
        id: 'fly-mode-forward',
        label: 'Forward',
        keyChord: 'W',
        sectionLabel: 'While flying',
      },
      {
        id: 'fly-mode-backward',
        label: 'Backward',
        keyChord: 'S',
        sectionLabel: 'While flying',
      },
      {
        id: 'fly-mode-left',
        label: 'Left',
        keyChord: 'A',
        sectionLabel: 'While flying',
      },
      {
        id: 'fly-mode-right',
        label: 'Right',
        keyChord: 'D',
        sectionLabel: 'While flying',
      },
      {
        id: 'fly-mode-up',
        label: 'Up',
        keyChord: 'Space',
        sectionLabel: 'While flying',
      },
      {
        id: 'fly-mode-down',
        label: 'Down',
        keyChord: 'Control',
        sectionLabel: 'While flying',
      },
      {
        id: 'fly-mode-boost',
        label: 'Boost',
        keyChord: 'Shift',
        sectionLabel: 'While flying',
      },
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
    ],
  },
  {
    id: 'shared-input-routing-owners',
    label: 'Shared input routing owners',
    status: 'routing-owner-only',
    kind: 'routing-owner',
    modeLabel: 'Shared keyboard routing',
    sourceFiles: ['src/app/inputRouting.ts'],
    routingOwners: [
      'viewer-display-mode',
      'viewer-camera-shortcuts',
      'console-entry',
      'sketch-plane',
      'sketch-draw',
      'reference-selection',
      'reference-transform',
      'staged-console',
      'flat-console',
    ],
    deferredReason:
      'Routing owners describe who handles an event, but they are not yet a displayable shortcut binding registry.',
  },
  {
    id: 'viewer-display-mode-shortcut',
    label: 'Viewer display mode shortcut',
    status: 'routing-owner-only',
    kind: 'routing-owner',
    modeLabel: 'Viewport',
    sourceFiles: ['src/app/inputRouting.ts', 'src/app/useViewerDisplayModeMenu.ts'],
    routingOwners: ['viewer-display-mode'],
    deferredReason:
      'Shift+D is routed through shared input-routing logic and needs Phase 2 normalization before it becomes a row in the Settings read.',
  },
  {
    id: 'console-input-priority',
    label: 'Console first input priority',
    status: 'behavior-setting',
    kind: 'settings-owner-backed-behavior',
    modeLabel: 'Console',
    sourceFiles: [
      'src/app/store/uiPrefsStore.ts',
      'src/app/store/uiPreferenceEditHistory.ts',
      'src/app/workspace/SettingsSurface.tsx',
    ],
    routingOwners: ['console-entry', 'flat-console', 'staged-console'],
    deferredReason:
      'This is an owner-backed shortcut behavior setting, not a key binding; relocation into Key Bindings belongs to a later phase.',
  },
  {
    id: 'fragmented-inline-shortcuts',
    label: 'Fragmented inline shortcut handlers',
    status: 'fragmented',
    kind: 'inline-handler',
    modeLabel: 'Mixed surfaces',
    sourceFiles: [
      'src/app/panels/useBrowserPanelController.ts',
      'src/app/spaghetti/ui/SpaghettiContextMenu.tsx',
      'src/app/console/useConsoleInteraction.ts',
    ],
    deferredReason:
      'These areas still expose shortcut-like key handling without one clean binding-owner seam, so Phase 1 records them instead of guessing a registry.',
  },
]

export const getShortcutInventorySourceMap = (): readonly ShortcutInventorySourceEntry[] =>
  shortcutInventorySourceMap
