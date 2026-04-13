import { defaultPrimaryViewportSlotId, type WorkspaceViewportSlot } from './workspaceShellTypes'
import type { WorkspaceSplitDockSide } from './workspaceSplitTypes'
import {
  getWorkspaceSurfaceDefaultLabel,
  isWorkspaceSurfaceCore,
  type CoreWorkspaceSurfaceKind,
} from './workspaceSurfaceCatalog'

export type ConsoleWorkspaceSurfaceKind = CoreWorkspaceSurfaceKind

export type WorkspaceViewportOption = {
  viewportId: string
  slotId: string
  isPrimary: boolean
  label: string
  surfaceKind: WorkspaceViewportSlot['surfaceKind']
}

export type ConsoleWorkspaceViewportOption = Omit<WorkspaceViewportOption, 'surfaceKind'> & {
  surfaceKind: ConsoleWorkspaceSurfaceKind
}

export const getWorkspaceViewportSurfaceLabel = (
  surfaceKind: WorkspaceViewportSlot['surfaceKind'],
): string => getWorkspaceSurfaceDefaultLabel(surfaceKind)

export const getOrderedWorkspaceViewportSlots = (
  viewportSlotsById: Record<string, WorkspaceViewportSlot>,
  primaryViewportId: string,
  options?: {
    includeSpaghettiEditor?: boolean
  },
): WorkspaceViewportSlot[] =>
  Object.values(viewportSlotsById)
    .filter((slot) => options?.includeSpaghettiEditor !== false || slot.surfaceKind !== 'spaghettiEditor')
    .sort((left, right) => {
      const leftRank = left.surfaceInstanceId === primaryViewportId ? 0 : 1
      const rightRank = right.surfaceInstanceId === primaryViewportId ? 0 : 1
      if (leftRank !== rightRank) {
        return leftRank - rightRank
      }
      return left.slotId.localeCompare(right.slotId)
    })

export const buildWorkspaceViewportOptions = (
  viewportSlotsById: Record<string, WorkspaceViewportSlot>,
  primaryViewportId: string,
): WorkspaceViewportOption[] => {
  const orderedSlots = getOrderedWorkspaceViewportSlots(viewportSlotsById, primaryViewportId)
  const browserSlots = orderedSlots.filter((slot) => slot.surfaceKind === 'browser')
  let browserIndex = 0
  return orderedSlots.map((slot, index) => {
    if (slot.surfaceKind === 'browser') {
      browserIndex += 1
      return {
        viewportId: slot.surfaceInstanceId,
        slotId: slot.slotId,
        isPrimary: slot.slotId === defaultPrimaryViewportSlotId,
        label:
          browserSlots.length <= 1
            ? getWorkspaceViewportSurfaceLabel(slot.surfaceKind)
            : `${getWorkspaceViewportSurfaceLabel(slot.surfaceKind)} ${browserIndex}`,
        surfaceKind: slot.surfaceKind,
      }
    }
    return {
      viewportId: slot.surfaceInstanceId,
      slotId: slot.slotId,
      isPrimary: slot.slotId === defaultPrimaryViewportSlotId,
      label: `${getWorkspaceViewportSurfaceLabel(slot.surfaceKind)} ${index + 1}`,
      surfaceKind: slot.surfaceKind,
    }
  })
}

export const buildConsoleWorkspaceViewportOptions = (
  viewportSlotsById: Record<string, WorkspaceViewportSlot>,
  primaryViewportId: string,
): ConsoleWorkspaceViewportOption[] =>
  buildWorkspaceViewportOptions(viewportSlotsById, primaryViewportId).filter(
    (option): option is ConsoleWorkspaceViewportOption =>
      isWorkspaceSurfaceCore(option.surfaceKind),
  )

export const getWorkspaceViewportDisplayLabel = (
  viewportSlotsById: Record<string, WorkspaceViewportSlot>,
  primaryViewportId: string,
  surfaceInstanceId: string,
): string | null => {
  const viewportOption =
    buildWorkspaceViewportOptions(viewportSlotsById, primaryViewportId).find(
      (option) => option.viewportId === surfaceInstanceId,
    ) ?? null
  return viewportOption?.label ?? null
}

export const getWorkspaceSplitActionLabel = (splitDockSide: WorkspaceSplitDockSide): string =>
  splitDockSide === 'top'
    ? 'Split Top'
    : splitDockSide === 'right'
      ? 'Split Right'
      : splitDockSide === 'bottom'
        ? 'Split Bottom'
        : 'Split Left'
