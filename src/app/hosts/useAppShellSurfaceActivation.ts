import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from 'react'
import {
  selectEditorViewportSelectedNodeId,
  useSpaghettiStore,
  type SketchPlanePickSession,
} from '../spaghetti/store/useSpaghettiStore'
import {
  useAppStore,
  type AppState,
  type ConsoleContextSyncSource,
  type FloatingShellActivationRequest,
} from '../store/useAppStore'
import { setActiveViewer } from '../viewerBridge'

type ViewportSpawnMenuState = {
  viewportId: string
  x: number
  y: number
  query: string
}

type SpaghettiActivationTarget = {
  graphDocumentId?: string | null
  nodeId?: string | null
  mode?: 'graph' | 'node'
}

type UseAppShellSurfaceActivationInput = {
  floatingShellActivationRequest: FloatingShellActivationRequest | null
  hasFocusableSpaghettiSurface: boolean
  hasVisibleSpaghettiInAppShell: boolean
  isBrowserFloating: boolean
  isBrowserPoppedOut: boolean
  requestConsoleContextSync: AppState['requestConsoleContextSync']
  requestConsoleWorkspaceContextHandoff: AppState['requestConsoleWorkspaceContextHandoff']
  setActiveEditorViewportId: (editorViewportId: string) => void
  setActiveFloatingShell: Dispatch<SetStateAction<'spaghetti' | 'browser' | null>>
  setActiveSurface: AppState['setActiveSurface']
  setActiveViewerViewportId: (viewportId: string) => void
  setViewportSpawnMenu: (menu: ViewportSpawnMenuState | null) => void
  setWorkspaceSelectedTarget: AppState['setWorkspaceSelectedTarget']
  sketchPlanePickSession: SketchPlanePickSession | null
  workspaceActiveSurface: AppState['workspaceSelection']['activeSurface']
}

export function useAppShellSurfaceActivation(input: UseAppShellSurfaceActivationInput) {
  const {
    floatingShellActivationRequest,
    hasFocusableSpaghettiSurface,
    hasVisibleSpaghettiInAppShell,
    isBrowserFloating,
    isBrowserPoppedOut,
    requestConsoleContextSync,
    requestConsoleWorkspaceContextHandoff,
    setActiveEditorViewportId,
    setActiveFloatingShell,
    setActiveSurface,
    setActiveViewerViewportId,
    setViewportSpawnMenu,
    setWorkspaceSelectedTarget,
    sketchPlanePickSession,
    workspaceActiveSurface,
  } = input
  const lastHandledFloatingShellActivationSeqRef = useRef(0)

  const activateSpaghettiWorkspaceContext = useCallback(
    (editorViewportId?: string, options?: SpaghettiActivationTarget & { floatingShell?: boolean }) => {
      const nextEditorViewportId =
        editorViewportId !== undefined && editorViewportId.length > 0 ? editorViewportId : null
      if (nextEditorViewportId !== null) {
        setActiveEditorViewportId(nextEditorViewportId)
      }

      const spaghettiState = useSpaghettiStore.getState()
      const appState = useAppStore.getState()
      const targetEditorViewportId =
        nextEditorViewportId ??
        (spaghettiState.activeEditorViewportId.length > 0
          ? spaghettiState.activeEditorViewportId
          : null)
      const targetViewport =
        targetEditorViewportId === null
          ? null
          : spaghettiState.editorViewportsById[targetEditorViewportId] ?? null
      const resolvedGraphDocumentId =
        options?.graphDocumentId !== undefined
          ? options.graphDocumentId
          : targetViewport?.graphDocumentId ?? null
      const resolvedNodeId =
        options?.nodeId !== undefined
          ? options.nodeId
          : targetEditorViewportId === null
            ? null
            : selectEditorViewportSelectedNodeId(spaghettiState, targetEditorViewportId)
      const resolvedMode = options?.mode ?? (resolvedNodeId === null ? 'graph' : 'node')

      if (options?.floatingShell === true) {
        setActiveFloatingShell('spaghetti')
      }
      setActiveSurface('spaghetti')
      if (resolvedGraphDocumentId !== null) {
        setWorkspaceSelectedTarget(
          resolvedNodeId === null
            ? {
                kind: 'graph-document',
                graphDocumentId: resolvedGraphDocumentId,
              }
            : {
                kind: 'graph-node',
                graphDocumentId: resolvedGraphDocumentId,
                nodeId: resolvedNodeId,
              },
        )
      }
      requestConsoleWorkspaceContextHandoff({
        sourceSurface: 'spaghetti',
        mode: resolvedMode,
        graphDocumentId: resolvedGraphDocumentId,
        nodeId: resolvedNodeId,
        editorViewportId: targetEditorViewportId,
        selectedTarget: appState.workspaceSelection.selectedTarget,
      })
      requestConsoleContextSync('surface-activation')
    },
    [
      requestConsoleContextSync,
      requestConsoleWorkspaceContextHandoff,
      setActiveEditorViewportId,
      setActiveFloatingShell,
      setActiveSurface,
      setWorkspaceSelectedTarget,
    ],
  )

  const handleActivateSpaghettiFloatingWindow = useCallback(
    (editorViewportId?: string, target?: SpaghettiActivationTarget) => {
      activateSpaghettiWorkspaceContext(editorViewportId, {
        floatingShell: true,
        ...target,
      })
    },
    [activateSpaghettiWorkspaceContext],
  )

  const handleActivateSpaghettiSurface = useCallback(
    (editorViewportId?: string, target?: SpaghettiActivationTarget) => {
      activateSpaghettiWorkspaceContext(editorViewportId, target)
    },
    [activateSpaghettiWorkspaceContext],
  )

  const handleActivateViewerSurface = useCallback(
    (viewportId: string) => {
      setViewportSpawnMenu(null)
      setActiveFloatingShell(null)
      setActiveViewerViewportId(viewportId)
      setActiveViewer(viewportId)
      setActiveSurface('viewer')
      const appState = useAppStore.getState()
      requestConsoleWorkspaceContextHandoff({
        sourceSurface: 'viewer',
        mode: 'root',
        graphDocumentId: null,
        nodeId: null,
        editorViewportId: null,
        selectedTarget: appState.workspaceSelection.selectedTarget,
      })
      if (sketchPlanePickSession !== null) {
        return
      }
      requestConsoleContextSync('surface-clear', 'viewer-activation')
    },
    [
      requestConsoleContextSync,
      requestConsoleWorkspaceContextHandoff,
      setActiveFloatingShell,
      setActiveSurface,
      setActiveViewerViewportId,
      setViewportSpawnMenu,
      sketchPlanePickSession,
    ],
  )

  const handleActivateBrowserFloatingWindow = useCallback(() => {
    setActiveFloatingShell('browser')
    setActiveSurface('browser')
  }, [setActiveFloatingShell, setActiveSurface])

  const requestAppShellSurfaceClear = useCallback(
    (source: ConsoleContextSyncSource) => {
      setActiveFloatingShell(null)
      setActiveSurface(null)
      requestConsoleContextSync('surface-clear', source)
    },
    [requestConsoleContextSync, setActiveFloatingShell, setActiveSurface],
  )

  useEffect(() => {
    if (!hasFocusableSpaghettiSurface && workspaceActiveSurface === 'spaghetti') {
      requestAppShellSurfaceClear('lost-spaghetti-visibility')
    }
  }, [hasFocusableSpaghettiSurface, requestAppShellSurfaceClear, workspaceActiveSurface])

  useEffect(() => {
    if (!isBrowserFloating && !isBrowserPoppedOut && workspaceActiveSurface === 'browser') {
      setActiveFloatingShell(null)
    }
  }, [isBrowserFloating, isBrowserPoppedOut, setActiveFloatingShell, workspaceActiveSurface])

  useEffect(() => {
    if (
      floatingShellActivationRequest === null ||
      floatingShellActivationRequest.seq === lastHandledFloatingShellActivationSeqRef.current
    ) {
      return
    }

    lastHandledFloatingShellActivationSeqRef.current = floatingShellActivationRequest.seq
    if (floatingShellActivationRequest.target === 'spaghetti') {
      if (hasVisibleSpaghettiInAppShell) {
        setActiveFloatingShell('spaghetti')
        setActiveSurface('spaghetti')
      }
      return
    }
    if (isBrowserFloating || isBrowserPoppedOut) {
      setActiveFloatingShell('browser')
      setActiveSurface('browser')
    }
  }, [
    floatingShellActivationRequest,
    hasVisibleSpaghettiInAppShell,
    isBrowserFloating,
    isBrowserPoppedOut,
    setActiveFloatingShell,
    setActiveSurface,
  ])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Element &&
        (target.closest('.SpaghettiFloatingWindow') !== null ||
          target.closest('.ViewportFrame--spaghettiEditor') !== null ||
          target.closest('.WorkspaceViewportSlotSurface--spaghetti') !== null ||
          target.closest('.BrowserFloatingWindow') !== null ||
          target.closest('.ViewportFrame--browser') !== null ||
          target.closest('.WorkspaceViewportSlotSurface--browser') !== null ||
          target.closest('.BrowserPanelRoot') !== null ||
          target.closest('.BrowserPanelBody') !== null ||
          target.closest('.BrowserTree') !== null ||
          target.closest('.ViewportWorkspaceHost') !== null ||
          target.closest('.ViewportViewerSurface') !== null)
      ) {
        return
      }
      if (workspaceActiveSurface === 'spaghetti' || workspaceActiveSurface === 'browser') {
        requestAppShellSurfaceClear('global-outside-click')
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [requestAppShellSurfaceClear, workspaceActiveSurface])

  return {
    handleActivateSpaghettiFloatingWindow,
    handleActivateSpaghettiSurface,
    handleActivateViewerSurface,
    handleActivateBrowserFloatingWindow,
    requestAppShellSurfaceClear,
  }
}
