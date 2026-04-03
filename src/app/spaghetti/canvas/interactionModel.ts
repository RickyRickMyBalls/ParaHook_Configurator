import { isElementTarget, isInteractiveTarget } from '../spInteractive'

export type NodeInteractionZone = 'header' | 'body' | 'control'

export type NodeInteractionBehavior = {
  selectsNode: boolean
  startsDrag: boolean
}

export type CanvasPointerTargetState = {
  interactive: boolean
  insideNode: boolean
  insidePort: boolean
  insideWire: boolean
  insideWireWaypoint: boolean
  insideWireLoop: boolean
  insideWireGap: boolean
}

export const getNodeInteractionBehavior = (
  zone: NodeInteractionZone,
): NodeInteractionBehavior => {
  switch (zone) {
    case 'header':
      return {
        selectsNode: true,
        startsDrag: true,
      }
    case 'body':
      return {
        selectsNode: true,
        startsDrag: false,
      }
    case 'control':
      return {
        selectsNode: false,
        startsDrag: false,
      }
  }
}

export const shouldClearCanvasSelection = (
  targetState: CanvasPointerTargetState,
): boolean =>
  !targetState.interactive &&
  !targetState.insideNode &&
  !targetState.insidePort &&
  !targetState.insideWire &&
  !targetState.insideWireWaypoint &&
  !targetState.insideWireLoop &&
  !targetState.insideWireGap

export const readCanvasPointerTargetState = (
  target: EventTarget | null,
): CanvasPointerTargetState => {
  if (!isElementTarget(target)) {
    return {
      interactive: false,
      insideNode: false,
      insidePort: false,
      insideWire: false,
      insideWireWaypoint: false,
      insideWireLoop: false,
      insideWireGap: false,
    }
  }

  return {
    interactive: isInteractiveTarget(target),
    insideNode: target.closest('.SpaghettiNode') !== null,
    insidePort: target.closest('.SpaghettiPort') !== null,
    insideWire: target.closest('.SpaghettiWire') !== null,
    insideWireWaypoint: target.closest('.SpaghettiWireWaypoint') !== null,
    insideWireLoop: target.closest('.SpaghettiWireLoop') !== null,
    insideWireGap: target.closest('.SpaghettiWireGap') !== null,
  }
}
