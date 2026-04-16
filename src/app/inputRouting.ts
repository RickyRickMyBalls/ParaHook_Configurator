import { resolveViewerCameraShortcutAction } from './cameraShortcuts'

export type InputRoutingOwner =
  | 'text-field'
  | 'viewer-fly'
  | 'viewer-camera-shortcuts'
  | 'sketch-plane'
  | 'sketch-draw'
  | 'reference-selection'
  | 'reference-transform'
  | 'staged-console'
  | 'flat-console'
  | 'none'

export type InputRoutingDecision = 'handle' | 'defer-native' | 'ignore'

type KeyboardLikeEvent = {
  key: string
  code?: string
  shiftKey?: boolean
  ctrlKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  target: EventTarget | null
}

export type InputRoutingRequest = {
  event: KeyboardLikeEvent
  viewerFlyActive?: boolean
  viewerCameraShortcutsEnabled?: boolean
  sketchPlanePickStage?: 'pick' | 'adjust' | null
  geometrySketchMode?: 'draw' | 'review' | null
  selectedReferenceDeleteAvailable?: boolean
  selectedReferenceHideAvailable?: boolean
  hiddenReferenceRestoreAvailable?: boolean
  referenceTransformActive?: boolean
  referenceTransformHasPendingKeyboardTransform?: boolean
  stagedConsoleActive?: boolean
  allowFlatConsoleCapture?: boolean
}

export type InputRoutingResult = {
  owner: InputRoutingOwner
  decision: InputRoutingDecision
}

export const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  )
}

const isPrintableKey = (event: KeyboardLikeEvent): boolean =>
  event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey

const isConsoleCapturePrintableKey = (event: KeyboardLikeEvent): boolean =>
  isPrintableKey(event) && event.key !== ' '

const isViewerFlyMovementKey = (event: KeyboardLikeEvent): boolean => {
  const { key } = event
  const normalizedKey = key.toLowerCase()
  if ((normalizedKey === 'q' || normalizedKey === 'e') && event.ctrlKey) {
    return false
  }
  return (
    normalizedKey === 'w' ||
    normalizedKey === 'a' ||
    normalizedKey === 's' ||
    normalizedKey === 'd' ||
    normalizedKey === 'q' ||
    normalizedKey === 'e' ||
    normalizedKey === 'shift' ||
    normalizedKey === 'control' ||
    key === ' ' ||
    normalizedKey === 'spacebar'
  )
}

export const routeKeyboardInput = ({
  event,
  viewerFlyActive = false,
  viewerCameraShortcutsEnabled = false,
  sketchPlanePickStage = null,
  geometrySketchMode = null,
  selectedReferenceDeleteAvailable = false,
  selectedReferenceHideAvailable = false,
  hiddenReferenceRestoreAvailable = false,
  referenceTransformActive = false,
  referenceTransformHasPendingKeyboardTransform = false,
  stagedConsoleActive = false,
  allowFlatConsoleCapture = false,
}: InputRoutingRequest): InputRoutingResult => {
  if (isEditableTarget(event.target)) {
    return {
      owner: 'text-field',
      decision: 'defer-native',
    }
  }

  if (viewerFlyActive && !event.altKey && !event.metaKey && isViewerFlyMovementKey(event)) {
    return {
      owner: 'viewer-fly',
      decision: 'handle',
    }
  }

  const key = event.key.toLowerCase()

  if (event.key === 'Escape') {
    if (sketchPlanePickStage !== null) {
      return { owner: 'sketch-plane', decision: 'handle' }
    }
    if (geometrySketchMode === 'draw') {
      return { owner: 'sketch-draw', decision: 'handle' }
    }
    if (referenceTransformActive) {
      return { owner: 'reference-transform', decision: 'handle' }
    }
    if (stagedConsoleActive) {
      return { owner: 'staged-console', decision: 'handle' }
    }
    return { owner: 'none', decision: 'ignore' }
  }

  if (event.key === 'Enter') {
    if (geometrySketchMode === 'draw') {
      return { owner: 'sketch-draw', decision: 'handle' }
    }
    if (referenceTransformActive || referenceTransformHasPendingKeyboardTransform) {
      return { owner: 'reference-transform', decision: 'handle' }
    }
    if (stagedConsoleActive) {
      return { owner: 'staged-console', decision: 'handle' }
    }
    return { owner: 'none', decision: 'ignore' }
  }

  if (event.key === 'Delete') {
    if (geometrySketchMode === 'draw') {
      return { owner: 'sketch-draw', decision: 'handle' }
    }
    if (
      selectedReferenceDeleteAvailable &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      return { owner: 'reference-selection', decision: 'handle' }
    }
    return { owner: 'none', decision: 'ignore' }
  }

  if (
    key === 'h' &&
    event.shiftKey &&
    selectedReferenceHideAvailable &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.metaKey
  ) {
    return { owner: 'reference-selection', decision: 'handle' }
  }

  if (
    key === 'h' &&
    event.altKey &&
    hiddenReferenceRestoreAvailable &&
    !event.ctrlKey &&
    !event.metaKey
  ) {
    return { owner: 'reference-selection', decision: 'handle' }
  }

  if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && stagedConsoleActive) {
    return { owner: 'staged-console', decision: 'handle' }
  }

  if (key === 'm' || key === 'r') {
    if (sketchPlanePickStage === 'adjust') {
      return { owner: 'sketch-plane', decision: 'handle' }
    }
    if (referenceTransformActive) {
      return { owner: 'reference-transform', decision: 'handle' }
    }
  }

  if (referenceTransformActive && (key === 'm' || key === 'r' || key === 's')) {
    return { owner: 'reference-transform', decision: 'handle' }
  }

  if (!viewerFlyActive && viewerCameraShortcutsEnabled && resolveViewerCameraShortcutAction(event) !== null) {
    return {
      owner: 'viewer-camera-shortcuts',
      decision: 'handle',
    }
  }

  if (allowFlatConsoleCapture && isConsoleCapturePrintableKey(event)) {
    return {
      owner: stagedConsoleActive ? 'staged-console' : 'flat-console',
      decision: 'handle',
    }
  }

  return { owner: 'none', decision: 'ignore' }
}
