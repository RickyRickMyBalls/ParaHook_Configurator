export type WorkspaceSplitDirection = 'horizontal' | 'vertical'

export type WorkspaceSplitPriority = 'balanced' | 'favorFirst' | 'favorSecond'

export type WorkspaceSplitDockSide = 'top' | 'right' | 'bottom' | 'left'

export const defaultWorkspaceSplitDirection: WorkspaceSplitDirection = 'horizontal'

export const defaultWorkspaceSplitPriority: WorkspaceSplitPriority = 'balanced'

export const resolveWorkspaceSplitDirectionForDockSide = (
  splitDockSide: WorkspaceSplitDockSide,
): WorkspaceSplitDirection => (splitDockSide === 'left' || splitDockSide === 'right' ? 'vertical' : 'horizontal')

export const resolveDefaultWorkspaceSplitDockSide = (
  splitDirection: WorkspaceSplitDirection,
): WorkspaceSplitDockSide => (splitDirection === 'vertical' ? 'right' : 'bottom')
