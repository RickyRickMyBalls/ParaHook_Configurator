import { useConsoleStore } from '../console/useConsoleStore'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import {
  defaultBrowserHostRouteId,
  defaultBrowserToolbarOwnerSurfaceInstanceId,
  defaultPrimaryViewportSlotId,
  type WorkspaceSurfaceKind,
  type WorkspaceViewportSlotId,
} from './workspaceShellTypes'
import type { WorkspaceSplitDockSide } from './workspaceSplitTypes'
import { useWorkspaceStore } from './useWorkspaceStore'

function findSlotBySurfaceInstanceId(surfaceInstanceId: string) {
  const workspaceState = useWorkspaceStore.getState()
  return (
    Object.values(workspaceState.viewportSlotsById).find(
      (slot) => slot.surfaceInstanceId === surfaceInstanceId,
    ) ?? null
  )
}

export function findSlottedSurfaceInstanceIdByKind(
  surfaceKind: 'browser' | 'console' | 'spaghettiEditor' | 'modelViewer',
) {
  const workspaceState = useWorkspaceStore.getState()
  const matchingSlot =
    Object.values(workspaceState.viewportSlotsById).find((slot) => slot.surfaceKind === surfaceKind) ??
    null
  return matchingSlot?.surfaceInstanceId ?? null
}

function resolveSurfaceKindForAction(surfaceInstanceId: string): WorkspaceSurfaceKind | null {
  const workspaceState = useWorkspaceStore.getState()
  const slottedSurface = findSlotBySurfaceInstanceId(surfaceInstanceId)
  if (slottedSurface !== null) {
    return slottedSurface.surfaceKind
  }
  const detachedSurface = workspaceState.detachedSlotSurfaceById[surfaceInstanceId] ?? null
  if (detachedSurface !== null) {
    return detachedSurface.surfaceKind
  }
  const currentBrowserSurfaceInstanceId =
    workspaceState.browserToolbarOwnerSurfaceInstanceId ??
    defaultBrowserToolbarOwnerSurfaceInstanceId
  if (surfaceInstanceId === currentBrowserSurfaceInstanceId) {
    return 'browser'
  }
  if (useSpaghettiStore.getState().editorViewportsById[surfaceInstanceId] !== undefined) {
    return 'spaghettiEditor'
  }
  return null
}

function resolveDefaultTargetSlotId(): WorkspaceViewportSlotId {
  const workspaceState = useWorkspaceStore.getState()
  const targetViewerSlot =
    Object.values(workspaceState.viewportSlotsById).find(
      (slot) =>
        slot.surfaceKind === 'modelViewer' && slot.surfaceInstanceId === workspaceState.primaryViewportId,
    ) ?? workspaceState.viewportSlotsById[defaultPrimaryViewportSlotId]
  return targetViewerSlot?.slotId ?? defaultPrimaryViewportSlotId
}

export function floatWorkspaceSurface(surfaceInstanceId: string) {
  const workspaceState = useWorkspaceStore.getState()
  const slottedSurface = findSlotBySurfaceInstanceId(surfaceInstanceId)
  if (slottedSurface === null) {
    return null
  }
  if (slottedSurface.surfaceKind === 'browser') {
    const detachedSurface = workspaceState.detachViewportSlotSurface(
      slottedSurface.slotId,
      'floating',
    )
    if (detachedSurface === null) {
      return null
    }
    workspaceState.setBrowserFloating(true)
    return detachedSurface
  }
  const detachedSurface = workspaceState.detachViewportSlotSurface(slottedSurface.slotId, 'floating')
  if (detachedSurface === null) {
    return null
  }
  if (slottedSurface.surfaceKind === 'console') {
    useConsoleStore.getState().switchToFloating()
    return detachedSurface
  }
  if (slottedSurface.surfaceKind === 'spaghettiEditor') {
    const spaghettiState = useSpaghettiStore.getState()
    spaghettiState.setActiveEditorViewportId?.(surfaceInstanceId)
    spaghettiState.setEditorViewportWindowMode(surfaceInstanceId, 'expanded')
    return detachedSurface
  }
  return detachedSurface
}

export function popoutWorkspaceSurface(surfaceInstanceId: string) {
  const workspaceState = useWorkspaceStore.getState()
  const slottedSurface = findSlotBySurfaceInstanceId(surfaceInstanceId)
  if (slottedSurface === null) {
    return null
  }
  if (slottedSurface.surfaceKind === 'browser') {
    workspaceState.popoutSurface(surfaceInstanceId)
    return slottedSurface.slotId
  }
  const detachedSurface = workspaceState.detachViewportSlotSurface(slottedSurface.slotId, 'popout')
  if (detachedSurface === null) {
    return null
  }
  if (slottedSurface.surfaceKind === 'console') {
    useConsoleStore.getState().switchToPopout()
    return detachedSurface
  }
  if (slottedSurface.surfaceKind === 'spaghettiEditor') {
    const spaghettiState = useSpaghettiStore.getState()
    spaghettiState.setActiveEditorViewportId?.(surfaceInstanceId)
    spaghettiState.setEditorViewportWindowMode(surfaceInstanceId, 'separateWindow')
    return detachedSurface
  }
  return detachedSurface
}

export function redockWorkspaceSurface(
  surfaceInstanceId: string,
  options?: {
    routeId?: string
    splitDockSide?: WorkspaceSplitDockSide
  },
) {
  const workspaceState = useWorkspaceStore.getState()
  const detachedSurface = workspaceState.detachedSlotSurfaceById[surfaceInstanceId] ?? null
  if (options?.routeId === defaultBrowserHostRouteId) {
    return workspaceState.redockSurface(surfaceInstanceId, { routeId: defaultBrowserHostRouteId })
  }
  if (detachedSurface === null) {
    return null
  }
  return workspaceState.redockDetachedSurface(surfaceInstanceId, options?.splitDockSide)
}

export function restoreDetachedSurfaceByKind(
  surfaceKind: WorkspaceSurfaceKind,
  options?: {
    routeId?: string
    splitDockSide?: WorkspaceSplitDockSide
  },
) {
  const workspaceState = useWorkspaceStore.getState()
  const detachedSurface =
    Object.values(workspaceState.detachedSlotSurfaceById).find(
      (surface) => surface.surfaceKind === surfaceKind,
    ) ?? null
  if (detachedSurface === null) {
    return null
  }
  return redockWorkspaceSurface(detachedSurface.surfaceInstanceId, {
    routeId: options?.routeId,
    splitDockSide: options?.splitDockSide ?? detachedSurface.preferredSplitDockSide,
  })
}

export function splitWorkspaceSurfaceToSide(
  surfaceInstanceId: string,
  splitDockSide: WorkspaceSplitDockSide,
  options?: {
    preferredRatio?: number
    targetSlotId?: WorkspaceViewportSlotId
  },
) {
  const workspaceState = useWorkspaceStore.getState()
  const spaghettiState = useSpaghettiStore.getState()
  const slottedSurface = findSlotBySurfaceInstanceId(surfaceInstanceId)
  const detachedSurface = workspaceState.detachedSlotSurfaceById[surfaceInstanceId] ?? null
  const currentBrowserSurfaceInstanceId =
    workspaceState.browserToolbarOwnerSurfaceInstanceId ?? defaultBrowserToolbarOwnerSurfaceInstanceId
  const isSpaghettiSurface =
    slottedSurface?.surfaceKind === 'spaghettiEditor' ||
    detachedSurface?.surfaceKind === 'spaghettiEditor' ||
    spaghettiState.editorViewportsById[surfaceInstanceId] !== undefined

  if (
    slottedSurface?.surfaceKind === 'browser' ||
    surfaceInstanceId === currentBrowserSurfaceInstanceId
  ) {
    const nextSplitResult = workspaceState.splitSurfaceToSide(surfaceInstanceId, splitDockSide)
    if (options?.preferredRatio !== undefined) {
      workspaceState.setBrowserViewportSplitRatio(options.preferredRatio)
    }
    return nextSplitResult
  }
  if (detachedSurface?.surfaceKind === 'browser') {
    if (options?.preferredRatio !== undefined) {
      workspaceState.setBrowserViewportSplitRatio(options.preferredRatio)
    }
    workspaceState.setBrowserFloating(false)
    workspaceState.setBrowserViewportSplit(false)
    return workspaceState.redockDetachedSurface(surfaceInstanceId, splitDockSide)
  }

  const targetSlotId = options?.targetSlotId ?? resolveDefaultTargetSlotId()
  const targetSlot = workspaceState.viewportSlotsById[targetSlotId]
  if (targetSlot === undefined) {
    return null
  }

  if (slottedSurface?.surfaceKind === 'console' || detachedSurface?.surfaceKind === 'console') {
    if (detachedSurface !== null) {
      return workspaceState.redockDetachedSurface(surfaceInstanceId, splitDockSide)
    }
    return workspaceState.splitViewportSlot(targetSlotId, splitDockSide, {
      surfaceKind: 'console',
      surfaceInstanceId,
      preferredRatio: options?.preferredRatio,
    })
  }

  if (isSpaghettiSurface) {
    spaghettiState.setActiveEditorViewportId?.(surfaceInstanceId)
    spaghettiState.setEditorViewportSplitDockSide(surfaceInstanceId, splitDockSide)
    spaghettiState.setEditorViewportWindowMode(surfaceInstanceId, 'expanded')
    if (detachedSurface !== null) {
      return workspaceState.redockDetachedSurface(surfaceInstanceId, splitDockSide)
    }
    return workspaceState.splitViewportSlot(targetSlotId, splitDockSide, {
      surfaceKind: 'spaghettiEditor',
      surfaceInstanceId,
      preferredRatio: options?.preferredRatio,
    })
  }

  if (slottedSurface?.surfaceKind === 'modelViewer' || detachedSurface?.surfaceKind === 'modelViewer') {
    if (detachedSurface !== null) {
      return workspaceState.redockDetachedSurface(surfaceInstanceId, splitDockSide)
    }
    return workspaceState.splitViewportSlot(targetSlotId, splitDockSide, {
      surfaceKind: 'modelViewer',
      surfaceInstanceId,
      preferredRatio: options?.preferredRatio,
    })
  }

  return null
}

export function commitWorkspaceSurfaceSlotSplit(
  surfaceInstanceId: string,
  targetSlotId: WorkspaceViewportSlotId,
  splitDockSide: WorkspaceSplitDockSide,
  options?: {
    preferredRatio?: number
  },
) {
  const workspaceState = useWorkspaceStore.getState()
  const detachedSurface = workspaceState.detachedSlotSurfaceById[surfaceInstanceId] ?? null
  const surfaceKind = resolveSurfaceKindForAction(surfaceInstanceId)
  if (surfaceKind === null) {
    return null
  }
  if (detachedSurface !== null) {
    const nextSlotId = workspaceState.splitViewportSlot(targetSlotId, splitDockSide, {
      surfaceKind,
      surfaceInstanceId,
      preferredRatio: options?.preferredRatio,
    })
    workspaceState.clearDetachedSlotSurface(surfaceInstanceId)
    if (surfaceKind === 'browser') {
      workspaceState.setBrowserFloating(false)
      workspaceState.setBrowserViewportSplit(false)
    }
    return nextSlotId
  }
  if (surfaceKind === 'browser') {
    const nextSlotId = workspaceState.splitViewportSlot(targetSlotId, splitDockSide, {
      surfaceKind,
      surfaceInstanceId,
      preferredRatio: options?.preferredRatio,
    })
    workspaceState.releaseHostRoute(defaultBrowserHostRouteId)
    workspaceState.setBrowserFloating(false)
    workspaceState.setBrowserViewportSplit(false)
    return nextSlotId
  }
  return workspaceState.splitViewportSlot(targetSlotId, splitDockSide, {
    surfaceKind,
    surfaceInstanceId,
    preferredRatio: options?.preferredRatio,
  })
}

export function commitWorkspaceSurfaceRootSplit(
  surfaceInstanceId: string,
  splitDockSide: WorkspaceSplitDockSide,
  options?: {
    preferredRatio?: number
  },
) {
  const workspaceState = useWorkspaceStore.getState()
  const detachedSurface = workspaceState.detachedSlotSurfaceById[surfaceInstanceId] ?? null
  const surfaceKind = resolveSurfaceKindForAction(surfaceInstanceId)
  if (surfaceKind !== 'browser') {
    return null
  }
  if (detachedSurface !== null) {
    workspaceState.splitViewportRoot(splitDockSide, {
      surfaceKind,
      surfaceInstanceId,
      preferredRatio: options?.preferredRatio,
      hostViewportId: detachedSurface.hostViewportId,
    })
    workspaceState.clearDetachedSlotSurface(surfaceInstanceId)
    workspaceState.setBrowserFloating(false)
    workspaceState.setBrowserViewportSplit(false)
    return null
  }
  workspaceState.splitViewportRoot(splitDockSide, {
    surfaceKind,
    surfaceInstanceId,
    preferredRatio: options?.preferredRatio,
  })
  workspaceState.releaseHostRoute(defaultBrowserHostRouteId)
  workspaceState.setBrowserFloating(false)
  workspaceState.setBrowserViewportSplit(false)
  return null
}
