export type InputRoutingOwner =
  | 'text-field'
  | 'sketch-plane'
  | 'sketch-draw'
  | 'reference-transform'
  | 'staged-console'
  | 'flat-console'
  | 'none'

export type InputRoutingDecision = 'handle' | 'defer-native' | 'ignore'

type KeyboardLikeEvent = {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  target: EventTarget | null
}

export type InputRoutingRequest = {
  event: KeyboardLikeEvent
  sketchPlanePickStage?: 'pick' | 'adjust' | null
  geometrySketchMode?: 'draw' | 'review' | null
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

export const routeKeyboardInput = ({
  event,
  sketchPlanePickStage = null,
  geometrySketchMode = null,
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
    if (referenceTransformHasPendingKeyboardTransform) {
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
    return { owner: 'none', decision: 'ignore' }
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

  if (
    referenceTransformActive &&
    (key === 'm' || key === 'r' || key === 's' || key === 'x' || key === 'y' || key === 'z')
  ) {
    return { owner: 'reference-transform', decision: 'handle' }
  }

  if (allowFlatConsoleCapture && isConsoleCapturePrintableKey(event)) {
    return {
      owner: stagedConsoleActive ? 'staged-console' : 'flat-console',
      decision: 'handle',
    }
  }

  return { owner: 'none', decision: 'ignore' }
}
