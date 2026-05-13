export type CameraShortcutKeyboardLikeEvent = {
  key: string
  code?: string
  shiftKey?: boolean
  ctrlKey?: boolean
  altKey?: boolean
  metaKey?: boolean
}

export type CameraShortcutInputPriorityMode = 'console-first' | 'shortcuts-first'

export type ViewerCameraShortcutAction =
  | 'preset-top'
  | 'preset-front'
  | 'preset-back'
  | 'preset-left'
  | 'preset-right'
  | 'zoom-object'

export type ViewerCameraShortcutBinding = {
  action: ViewerCameraShortcutAction
  code: string
  label: string
  shiftKey?: boolean
}

export const viewerCameraShortcutBindings: ViewerCameraShortcutBinding[] = [
  {
    action: 'preset-top',
    code: 'Numpad5',
    label: 'Top',
  },
  {
    action: 'preset-front',
    code: 'Numpad2',
    label: 'Front',
  },
  {
    action: 'preset-back',
    code: 'Numpad8',
    label: 'Back',
  },
  {
    action: 'preset-left',
    code: 'Numpad4',
    label: 'Left',
  },
  {
    action: 'preset-right',
    code: 'Numpad6',
    label: 'Right',
  },
  {
    action: 'zoom-object',
    code: 'KeyZ',
    label: 'Zoom Object',
    shiftKey: true,
  },
]

const hasExpectedModifiers = (
  event: CameraShortcutKeyboardLikeEvent,
  binding: ViewerCameraShortcutBinding,
): boolean =>
  Boolean(event.shiftKey) === Boolean(binding.shiftKey) &&
  !event.ctrlKey &&
  !event.altKey &&
  !event.metaKey

const matchesZoomObjectShortcut = (
  event: CameraShortcutKeyboardLikeEvent,
  inputPriorityMode: CameraShortcutInputPriorityMode,
): boolean =>
  event.code === 'KeyZ' &&
  !event.ctrlKey &&
  !event.altKey &&
  !event.metaKey &&
  (inputPriorityMode === 'shortcuts-first' ? event.shiftKey !== true : event.shiftKey === true)

export const resolveViewerCameraShortcutAction = (
  event: CameraShortcutKeyboardLikeEvent,
  inputPriorityMode: CameraShortcutInputPriorityMode = 'console-first',
): ViewerCameraShortcutAction | null => {
  if (matchesZoomObjectShortcut(event, inputPriorityMode)) {
    return 'zoom-object'
  }

  if (typeof event.code !== 'string' || event.code.length === 0) {
    return null
  }

  const binding = viewerCameraShortcutBindings.find((candidate) => candidate.code === event.code)
  if (binding === undefined || !hasExpectedModifiers(event, binding)) {
    return null
  }
  if (binding.action === 'zoom-object') {
    return null
  }

  return binding.action
}
