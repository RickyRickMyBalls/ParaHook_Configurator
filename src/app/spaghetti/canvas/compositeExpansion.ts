export type CompositeExpansionDirection = 'in' | 'out'

export const buildCompositeExpansionKey = (
  direction: CompositeExpansionDirection,
  nodeId: string,
  portId: string,
): string => `spComp|${direction}|${nodeId}|${portId}`
