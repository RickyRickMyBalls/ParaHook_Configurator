import { resolveActiveViewerCameraShortcutAction } from './viewerCameraShortcutRuntime'

export type InputRoutingOwner =
  | 'edit-history'
  | 'text-field'
  | 'viewer-fly'
  | 'viewer-display-mode'
  | 'viewer-camera-shortcuts'
  | 'console-entry'
  | 'sketch-plane'
  | 'sketch-draw'
  | 'reference-selection'
  | 'reference-transform'
  | 'staged-console'
  | 'flat-console'
  | 'none'

export type InputRoutingDecision = 'handle' | 'defer-native' | 'ignore'

export type EditHistoryShortcutAction = 'undo' | 'redo'

export type ConsoleInputPriorityMode = 'console-first' | 'shortcuts-first'

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
  editHistoryCanUndo?: boolean
  editHistoryCanRedo?: boolean
  consoleCommandSessionUndoOwner?: 'sketch-draw' | null
  consoleInputAllowsCommandSessionUndo?: boolean
  viewerFlyActive?: boolean
  viewerDisplayModeShortcutsEnabled?: boolean
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
  consoleInputPriorityMode?: ConsoleInputPriorityMode
}

export type InputRoutingResult = {
  owner: InputRoutingOwner
  decision: InputRoutingDecision
  editHistoryAction?: EditHistoryShortcutAction
  sketchDrawAction?: EditHistoryShortcutAction
}

export type EditHistoryShortcutOwner = {
  canUndo: () => boolean
  canRedo: () => boolean
  undo: () => unknown
  redo: () => unknown
}

type PreventableKeyboardEvent = {
  preventDefault: () => void
  stopImmediatePropagation?: () => void
  stopPropagation?: () => void
}

export const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable ||
    target.getAttribute('contenteditable') === 'true'
  )
}

const isConsoleInputTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  target.closest('[data-console-input="true"]') !== null

const isPrintableKey = (event: KeyboardLikeEvent): boolean =>
  event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey

const isConsoleCapturePrintableKey = (event: KeyboardLikeEvent): boolean =>
  isPrintableKey(event) && event.key !== ' '

const isDeliberateConsoleEntryKey = (event: KeyboardLikeEvent): boolean =>
  event.key.toLowerCase() === 'c' &&
  !event.shiftKey &&
  !event.ctrlKey &&
  !event.altKey &&
  !event.metaKey

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

const isViewerDisplayModeShortcut = (event: KeyboardLikeEvent): boolean =>
  event.code === 'KeyD' &&
  event.shiftKey === true &&
  !event.ctrlKey &&
  !event.altKey &&
  !event.metaKey

const isUndoShortcut = (event: KeyboardLikeEvent): boolean => {
  const key = event.key.toLowerCase()
  const modifierPressed = event.ctrlKey === true || event.metaKey === true
  return modifierPressed && key === 'z' && event.shiftKey !== true && event.altKey !== true
}

const isRedoShortcut = (event: KeyboardLikeEvent): boolean => {
  const key = event.key.toLowerCase()
  const modifierPressed = event.ctrlKey === true || event.metaKey === true
  if (!modifierPressed || event.altKey === true) {
    return false
  }
  return key === 'y' || (key === 'z' && event.shiftKey === true)
}

export const dispatchEditHistoryShortcut = (
  routing: InputRoutingResult,
  event: PreventableKeyboardEvent,
  owner: EditHistoryShortcutOwner,
): boolean => {
  if (routing.owner !== 'edit-history' || routing.decision !== 'handle') {
    return false
  }

  if (routing.editHistoryAction === 'undo' && owner.canUndo()) {
    event.preventDefault()
    event.stopImmediatePropagation?.()
    owner.undo()
    return true
  }

  if (routing.editHistoryAction === 'redo' && owner.canRedo()) {
    event.preventDefault()
    event.stopImmediatePropagation?.()
    owner.redo()
    return true
  }

  return false
}

export const routeKeyboardInput = ({
  event,
  editHistoryCanUndo = false,
  editHistoryCanRedo = false,
  consoleCommandSessionUndoOwner = null,
  consoleInputAllowsCommandSessionUndo = false,
  viewerFlyActive = false,
  viewerDisplayModeShortcutsEnabled = false,
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
  consoleInputPriorityMode = 'console-first',
}: InputRoutingRequest): InputRoutingResult => {
  if (
    consoleInputAllowsCommandSessionUndo &&
    (geometrySketchMode === 'draw' || consoleCommandSessionUndoOwner === 'sketch-draw') &&
    isConsoleInputTarget(event.target)
  ) {
    if (isUndoShortcut(event)) {
      return { owner: 'sketch-draw', decision: 'handle', sketchDrawAction: 'undo' }
    }
    if (isRedoShortcut(event)) {
      return { owner: 'sketch-draw', decision: 'handle', sketchDrawAction: 'redo' }
    }
  }

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

  if (isUndoShortcut(event)) {
    if (geometrySketchMode === 'draw') {
      return { owner: 'sketch-draw', decision: 'handle', sketchDrawAction: 'undo' }
    }
    return editHistoryCanUndo
      ? { owner: 'edit-history', decision: 'handle', editHistoryAction: 'undo' }
      : { owner: 'none', decision: 'ignore' }
  }

  if (isRedoShortcut(event)) {
    if (geometrySketchMode === 'draw') {
      return { owner: 'sketch-draw', decision: 'handle', sketchDrawAction: 'redo' }
    }
    return editHistoryCanRedo
      ? { owner: 'edit-history', decision: 'handle', editHistoryAction: 'redo' }
      : { owner: 'none', decision: 'ignore' }
  }

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

  if (
    !viewerFlyActive &&
    viewerDisplayModeShortcutsEnabled &&
    isViewerDisplayModeShortcut(event)
  ) {
    return {
      owner: 'viewer-display-mode',
      decision: 'handle',
    }
  }

  if (
    !viewerFlyActive &&
    viewerCameraShortcutsEnabled &&
    resolveActiveViewerCameraShortcutAction(event, consoleInputPriorityMode) !== null
  ) {
    return {
      owner: 'viewer-camera-shortcuts',
      decision: 'handle',
    }
  }

  if (
    allowFlatConsoleCapture &&
    consoleInputPriorityMode === 'shortcuts-first' &&
    isDeliberateConsoleEntryKey(event)
  ) {
    return {
      owner: 'console-entry',
      decision: 'handle',
    }
  }

  if (
    allowFlatConsoleCapture &&
    consoleInputPriorityMode === 'console-first' &&
    isConsoleCapturePrintableKey(event)
  ) {
    return {
      owner: stagedConsoleActive ? 'staged-console' : 'flat-console',
      decision: 'handle',
    }
  }

  return { owner: 'none', decision: 'ignore' }
}
