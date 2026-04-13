import { useCallback, useEffect, useRef } from 'react'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import {
  defaultPrimaryViewportSlotId,
  type WorkspaceViewportSlotId,
} from './workspaceShellTypes'
import type { WorkspaceSplitDirection, WorkspaceSplitDockSide } from './workspaceSplitTypes'
import {
  readPersistedWorkspaceLayout,
  serializeWorkspaceLayout,
  writePersistedWorkspaceLayout,
} from './workspacePersistence'
import { splitWorkspaceSurfaceToSide } from './workspaceSurfaceActions'
import { useWorkspaceStore } from './useWorkspaceStore'

function resolveViewerTargetSlotId(): WorkspaceViewportSlotId {
  const workspaceState = useWorkspaceStore.getState()
  const targetViewerSlot =
    Object.values(workspaceState.viewportSlotsById).find(
      (slot) =>
        slot.surfaceKind === 'modelViewer' &&
        slot.surfaceInstanceId === workspaceState.primaryViewportId,
    ) ?? workspaceState.viewportSlotsById[defaultPrimaryViewportSlotId]
  return targetViewerSlot?.slotId ?? defaultPrimaryViewportSlotId
}

function resolveLegacySplitDockSide(
  splitDirection: WorkspaceSplitDirection | undefined,
  splitDockSide: WorkspaceSplitDockSide | null | undefined,
): WorkspaceSplitDockSide {
  if (splitDirection === 'vertical') {
    return splitDockSide === 'left' || splitDockSide === 'right' ? splitDockSide : 'left'
  }
  return splitDockSide ?? 'bottom'
}

export function useWorkspacePersistenceBridge() {
  const editorViewportsById = useSpaghettiStore((state) => state.editorViewportsById)
  const viewportSlotsById = useWorkspaceStore((state) => state.viewportSlotsById)
  const hydratePersistedWorkspaceLayout = useWorkspaceStore(
    (state) => state.hydratePersistedWorkspaceLayout,
  )
  const hasHydratedWorkspacePersistenceRef = useRef(false)

  const editorViewportSplitViewSignature = Object.values(editorViewportsById)
    .map((viewport) =>
      [
        viewport.editorViewportId,
        viewport.windowMode,
        viewport.splitDirection,
        viewport.splitDockSide,
        viewport.splitRatio,
      ].join(':'),
    )
    .join('|')

  const ensureLegacySplitViewMigrated = useCallback(
    (
      editorViewportId: string,
      splitDockSideForMigration: WorkspaceSplitDockSide,
      ratio: number,
    ) => {
      const existingSlot = Object.values(useWorkspaceStore.getState().viewportSlotsById).find(
        (slot) =>
          slot.surfaceKind === 'spaghettiEditor' &&
          slot.surfaceInstanceId === editorViewportId,
      )
      if (existingSlot === undefined) {
        splitWorkspaceSurfaceToSide(editorViewportId, splitDockSideForMigration, {
          preferredRatio: ratio,
          targetSlotId: resolveViewerTargetSlotId(),
        })
      }
      useSpaghettiStore.getState().setEditorViewportWindowMode(editorViewportId, 'expanded')
    },
    [],
  )

  useEffect(() => {
    if (hasHydratedWorkspacePersistenceRef.current) {
      return
    }
    hasHydratedWorkspacePersistenceRef.current = true

    const persistedLayout = readPersistedWorkspaceLayout()
    if (persistedLayout !== null) {
      const shouldRestorePersistedLayout =
        typeof window.confirm !== 'function' ||
        window.confirm('Restore your saved workspace layout? Click Cancel to start fresh.')
      if (shouldRestorePersistedLayout) {
        hydratePersistedWorkspaceLayout(persistedLayout)
        const spaghettiState = useSpaghettiStore.getState()
        const legacySplitPlacements: Array<{
          editorViewportId: string
          splitDockSide: WorkspaceSplitDockSide
          splitRatio: number
        }> = []
        for (const [editorViewportId, placement] of Object.entries(
          persistedLayout.editorSurfacePlacementById,
        )) {
          if (spaghettiState.editorViewportsById[editorViewportId] === undefined) {
            continue
          }
          spaghettiState.setEditorViewportPosition(editorViewportId, placement.position)
          spaghettiState.setEditorViewportSize(editorViewportId, placement.size)
          spaghettiState.setEditorViewportSplitRatio(editorViewportId, placement.splitRatio)
          spaghettiState.setEditorViewportSplitDirection(editorViewportId, placement.splitDirection)
          spaghettiState.setEditorViewportSplitDockSide(editorViewportId, placement.splitDockSide)
          spaghettiState.setEditorViewportSplitPriority(editorViewportId, placement.splitPriority)
          if (placement.windowMode === 'split view') {
            legacySplitPlacements.push({
              editorViewportId,
              splitDockSide: resolveLegacySplitDockSide(
                placement.splitDirection,
                placement.splitDockSide,
              ),
              splitRatio: placement.splitRatio,
            })
            spaghettiState.setEditorViewportWindowMode(editorViewportId, 'expanded')
            continue
          }
          spaghettiState.setEditorViewportWindowMode(editorViewportId, placement.windowMode)
        }
        for (const placement of legacySplitPlacements) {
          ensureLegacySplitViewMigrated(
            placement.editorViewportId,
            placement.splitDockSide,
            placement.splitRatio,
          )
        }
      }
    }

    writePersistedWorkspaceLayout(serializeWorkspaceLayout(useWorkspaceStore.getState()))
  }, [ensureLegacySplitViewMigrated, hydratePersistedWorkspaceLayout])

  useEffect(() => {
    for (const [editorViewportId, viewport] of Object.entries(editorViewportsById ?? {})) {
      if (viewport.windowMode !== 'split view') {
        continue
      }
      ensureLegacySplitViewMigrated(
        editorViewportId,
        resolveLegacySplitDockSide(viewport.splitDirection, viewport.splitDockSide),
        viewport.splitRatio ?? 0.5,
      )
    }
  }, [editorViewportSplitViewSignature, ensureLegacySplitViewMigrated, viewportSlotsById])

  useEffect(() => {
    const unsubscribe = useWorkspaceStore.subscribe((state) => {
      if (!hasHydratedWorkspacePersistenceRef.current) {
        return
      }
      writePersistedWorkspaceLayout(serializeWorkspaceLayout(state))
    })
    return unsubscribe
  }, [])
}
