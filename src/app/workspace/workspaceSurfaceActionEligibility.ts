import {
  workspaceSurfaceSupportsHostMode,
  workspaceSurfaceSupportsSplit,
} from './workspaceSurfaceCatalog'
import type { WorkspaceSurfaceHostMode, WorkspaceSurfaceKind } from './workspaceShellTypes'

export type WorkspaceSurfaceActionFamily =
  | 'split'
  | 'viewportType'
  | 'float'
  | 'popout'
  | 'close'

export type WorkspaceSurfaceActionBlockedReason =
  | 'catalog-host-mode-unsupported'
  | 'catalog-split-unsupported'
  | 'primary-slot-protected'
  | 'surface-not-slotted'

export type WorkspaceSurfaceActionEligibilityEntry = {
  action: WorkspaceSurfaceActionFamily
  supported: boolean
  visible: boolean
  blockedReason: WorkspaceSurfaceActionBlockedReason | null
}

export type WorkspaceSurfaceActionEligibilityTarget = {
  surfaceKind: WorkspaceSurfaceKind
  hostMode: WorkspaceSurfaceHostMode
  isPrimary: boolean
}

export type WorkspaceSurfaceActionEligibility = {
  target: WorkspaceSurfaceActionEligibilityTarget
  split: WorkspaceSurfaceActionEligibilityEntry
  viewportType: WorkspaceSurfaceActionEligibilityEntry
  float: WorkspaceSurfaceActionEligibilityEntry
  popout: WorkspaceSurfaceActionEligibilityEntry
  close: WorkspaceSurfaceActionEligibilityEntry
  canSplit: boolean
  canChangeViewportType: boolean
  canFloat: boolean
  canPopout: boolean
  canClose: boolean
}

const createEligibilityEntry = (
  action: WorkspaceSurfaceActionFamily,
  blockedReason: WorkspaceSurfaceActionBlockedReason | null,
): WorkspaceSurfaceActionEligibilityEntry => ({
  action,
  supported: blockedReason === null,
  visible: blockedReason === null,
  blockedReason,
})

const resolveSlottedActionBlockedReason = (
  target: WorkspaceSurfaceActionEligibilityTarget,
): WorkspaceSurfaceActionBlockedReason | null =>
  workspaceSurfaceSupportsHostMode(target.surfaceKind, 'slotted')
    ? target.hostMode === 'slotted'
      ? null
      : 'surface-not-slotted'
    : 'catalog-host-mode-unsupported'

const resolvePrimaryProtectedActionBlockedReason = (
  target: WorkspaceSurfaceActionEligibilityTarget,
  hostMode: Extract<WorkspaceSurfaceHostMode, 'floating' | 'popout'>,
): WorkspaceSurfaceActionBlockedReason | null => {
  const slottedBlockedReason = resolveSlottedActionBlockedReason(target)
  if (slottedBlockedReason !== null) {
    return slottedBlockedReason
  }
  if (!workspaceSurfaceSupportsHostMode(target.surfaceKind, hostMode)) {
    return 'catalog-host-mode-unsupported'
  }
  return target.isPrimary ? 'primary-slot-protected' : null
}

export function getWorkspaceSurfaceActionEligibility(
  target: WorkspaceSurfaceActionEligibilityTarget,
): WorkspaceSurfaceActionEligibility {
  const viewportTypeBlockedReason = resolveSlottedActionBlockedReason(target)
  const splitBlockedReason =
    viewportTypeBlockedReason ??
    (workspaceSurfaceSupportsSplit(target.surfaceKind) ? null : 'catalog-split-unsupported')
  const floatBlockedReason = resolvePrimaryProtectedActionBlockedReason(target, 'floating')
  const popoutBlockedReason =
    target.isPrimary && target.surfaceKind === 'modelViewer'
      ? resolveSlottedActionBlockedReason(target) ??
        (workspaceSurfaceSupportsHostMode(target.surfaceKind, 'popout')
          ? null
          : 'catalog-host-mode-unsupported')
      : resolvePrimaryProtectedActionBlockedReason(target, 'popout')
  const closeBlockedReason =
    resolveSlottedActionBlockedReason(target) ??
    (target.isPrimary ? 'primary-slot-protected' : null)

  const split = createEligibilityEntry('split', splitBlockedReason)
  const viewportType = createEligibilityEntry('viewportType', viewportTypeBlockedReason)
  const float = createEligibilityEntry('float', floatBlockedReason)
  const popout = createEligibilityEntry('popout', popoutBlockedReason)
  const close = createEligibilityEntry('close', closeBlockedReason)

  return {
    target,
    split,
    viewportType,
    float,
    popout,
    close,
    canSplit: split.supported,
    canChangeViewportType: viewportType.supported,
    canFloat: float.supported,
    canPopout: popout.supported,
    canClose: close.supported,
  }
}
