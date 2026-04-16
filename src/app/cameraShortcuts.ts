type CameraShortcutKeyboardLikeEvent = {
  key: string
  code?: string
  shiftKey?: boolean
  ctrlKey?: boolean
  altKey?: boolean
  metaKey?: boolean
}

export type ViewerCameraShortcutAction =
  | 'preset-top'
  | 'preset-front'
  | 'preset-back'
  | 'preset-left'
  | 'preset-right'

export type ViewerCameraShortcutBinding = {
  action: ViewerCameraShortcutAction
  code: string
  label: string
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
]

const actionByShortcutCode = new Map(
  viewerCameraShortcutBindings.map((binding) => [binding.code, binding.action]),
)

const hasNoExtraModifiers = (event: CameraShortcutKeyboardLikeEvent): boolean =>
  !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey

export const resolveViewerCameraShortcutAction = (
  event: CameraShortcutKeyboardLikeEvent,
): ViewerCameraShortcutAction | null => {
  if (!hasNoExtraModifiers(event)) {
    return null
  }

  if (typeof event.code !== 'string' || event.code.length === 0) {
    return null
  }

  return actionByShortcutCode.get(event.code) ?? null
}
