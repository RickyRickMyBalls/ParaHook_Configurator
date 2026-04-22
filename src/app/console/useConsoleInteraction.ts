import { useCallback, useEffect } from 'react'
import { requestRadioRuntimeWarmup } from '../../runtime/audio/radioRuntimeWarmup'
import { revealFinishedSketch } from '../sketch/finishSketchVisibility'
import {
  type RadioBurstTriggerKind,
  useAudioSamplerStore,
} from '../store/audioSamplerStore'
import {
  type ReferenceTransformSnapMode,
  DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE,
  REFERENCE_ROOT_ROW_ID,
  buildImportedReferenceRowId,
  buildReferenceCategoryRowId,
  resolveReferenceRuntimeTraits,
  resolveWorkspaceSelectedContentOwnerTarget,
  selectConsoleWorkspaceContextTarget,
  useAppStore,
} from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import { floatWorkspaceSurface, popoutWorkspaceSurface } from '../workspace/workspaceSurfaceActions'
import {
  getWorkspaceSurfaceActionEligibility,
  type WorkspaceSurfaceActionBlockedReason,
  type WorkspaceSurfaceActionFamily,
} from '../workspace/workspaceSurfaceActionEligibility'
import { parseWorkspaceSurfaceKind } from '../workspace/workspaceSurfaceCatalog'
import {
  defaultBrowserFloatingPosition,
  defaultBrowserFloatingSize,
  defaultPrimaryViewportSlotId,
  workspacePrimarySlotSupportsSurfaceKind,
  type WorkspaceDetachedSlotSurfaceState,
  type WorkspaceSurfaceKind,
  type WorkspaceViewportSlot,
} from '../workspace/workspaceShellTypes'
import {
  buildConsoleWorkspaceViewportOptions,
  type ConsoleWorkspaceSurfaceTargetOption,
  getWorkspaceViewportDisplayLabel,
  getWorkspaceViewportSurfaceLabel,
} from '../workspace/workspaceViewportLabels'
import {
  activateGraphTargetIntent,
  selectTargetIntent,
  startSketchDrawIntent,
  startSketchPlaneIntent,
  type WorkspaceIntentDeps,
} from '../store/workspaceIntents'
import {
  commitWorkspaceTargetSelection,
  deleteWorkspaceSelectedEnvironmentLightWithHistory,
} from '../store/workspaceSelectionCommands'
import { getLatestViewerCameraPose, getViewer, restoreViewerCameraPose } from '../viewerBridge'
import type { EditorViewportWindowMode } from '../spaghetti/schema/spaghettiTypes'
import {
  type GeometrySketchDrawStage,
  type SketchPlaneCommand,
  selectEditorViewportSelectedNodeId,
  selectGraphDocumentById,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import {
  buildConsolePromptSessionText,
  buildRootPromptText,
  buildStagedPromptText,
  formatStagedBreadcrumb,
  ROOT_PROMPT_TEXT,
} from './consolePromptText'
import {
  resolveGeometrySketchDrawCommandFromActionId,
  resolveGeometrySketchDrawCommandFromInput,
  SKETCH_DRAW_HELP_TEXT,
  type CanonicalGeometrySketchDrawCommand,
} from '../spaghetti/sketchCommands/drawCommands'
import {
  applyReferenceTransformSpaceShortcut as applyReferenceTransformSpaceShortcutCommand,
  commitActiveReferenceTransformFromConsole as commitActiveReferenceTransformFromConsoleCommand,
  createActiveContentObjectTransformRootSession as createActiveContentObjectTransformRootSessionCommand,
  createActiveContentObjectTransformSnapSession as createActiveContentObjectTransformSnapSessionCommand,
  createActiveReferenceTransformRootSession as createActiveReferenceTransformRootSessionCommand,
  createActiveReferenceTransformSnapSession as createActiveReferenceTransformSnapSessionCommand,
  createDeleteLatestTransformConfirmPromptSession,
  deleteLatestContentObjectTransformEntry as deleteLatestContentObjectTransformEntryCommand,
  deleteLatestReferenceTransformEntry as deleteLatestReferenceTransformEntryCommand,
  formatReferenceTransformSnapValue,
  getReferenceTransformSnapAxisValue,
  getReferenceTransformSnapDriverValue,
  getReferenceTransformSnapModeLabel,
  getReferenceTransformSnapScopeAxis,
  getReferenceTransformSnapScopeMode,
  isReferenceTransformSnapScope,
  tryHandleActiveReferenceTransformSubmission,
  tryHandleContentOwnerPromptAction,
  tryHandleReferenceContentExecuteAction,
  tryHandleReferenceContentPromptSubmission,
  tryHandleReferenceTransformRootShortcut,
} from './consoleReferenceContentCommands'
import {
  applyReferenceTransformVec3Value,
  buildReferenceConsoleWorkspaceTarget,
  getReferenceTransformPromptPrefill,
  isSameReferenceTransformPromptSession,
  resolveReferenceTransformPromptSessionFromHandle,
} from './referenceTransformConsole'
import { resolveConsoleRadioCommandIdentity } from './radioCommandIdentity'
import {
  normalizeRadioCommandIdentity,
  parseConsoleCommand,
  parseZoomCommandAction,
} from './consoleCommandParser'
import {
  parseConsoleSignedFloatLiteral,
  parseConsoleVec2Literal,
  parseConsoleVec3Literal,
} from './consoleFormatters'
import {
  cancelConsoleStagedNavigationSession,
  type ConsoleStagedNavigationContext,
  createConsoleRootSession,
  createSketchDrawRootSession,
  createSketchDrawZoomRootSession,
  createWorkspaceModesRootSession,
  createWorkspaceModeViewportSelectedSession,
  isConsoleStagedNavigationRootToken,
  resolveConsoleWorkspaceContextSync,
  submitConsoleStagedNavigationToken,
  type ConsoleStagedNavigationSession,
} from './stagedNavigation'
import type { ConsoleAssistDescriptor, ConsoleWindowMode } from './consoleTypes'
import {
  appendConsoleEntry,
  type ConsolePromptSession,
  useConsoleStore,
} from './useConsoleStore'
import {
  dispatchEditHistoryShortcut,
  isEditableTarget,
  routeKeyboardInput,
  type InputRoutingResult,
} from '../inputRouting'
import { editHistoryStore } from '../store/editHistoryStore'
import {
  frameAllCommand,
  frameEnvironmentLightCommand,
  frameExtentsCommand,
  framePreviousCommand,
  frameReferenceCommand,
  frameSelectedCommand,
  frameSelectedGeometrySketchCommand,
  frameSelectionSetCommand,
  setConsoleCameraModeCommand,
  setProjectionModeCommand,
} from '../viewCommands'

type AppState = ReturnType<typeof useAppStore.getState>
type SpaghettiState = ReturnType<typeof useSpaghettiStore.getState>

type BooleanRef = {
  current: boolean
}

type ConsoleActionContext = {
  graphDocumentId: string | null
  editorViewportId: string | null
  selectedNodeId: string | null
}

type GraphRootEditorRevealRestore =
  | {
      kind: 'close-opened-viewport'
      editorViewportId: string
      previousActiveEditorViewportId: string
    }
  | {
      kind: 'restore-window-mode'
      editorViewportId: string
      previousActiveEditorViewportId: string
      windowMode: EditorViewportWindowMode
    }

type CreatedMissingGraphNode = {
  nodeId: string
  nodeLabel: string
  stagedContext: ConsoleStagedNavigationContext
}

type SelectionSetForZoom = {
  partKeys: string[]
  referenceIds: string[]
}

type GetActiveFeatureAssistDescriptorArgs = {
  sketchPlanePickSession: SpaghettiState['sketchPlanePickSession']
  geometrySketchSession: SpaghettiState['geometrySketchSession']
  referenceWorkspace: AppState['referenceWorkspace']
  stagedNavigationSession: ConsoleStagedNavigationSession | null
}

type UseConsoleInteractionOptions = {
  windowMode: ConsoleWindowMode
  popoutWindow: Window | null
  treatSpaceAsSubmit: boolean
  consoleInputText: string
  consolePromptSession: ConsolePromptSession | null
  stagedNavigationSession: ConsoleStagedNavigationSession | null
  featureAssistDescriptor: ConsoleAssistDescriptor | null
  geometrySketchSession: SpaghettiState['geometrySketchSession']
  sketchPlanePickSession: SpaghettiState['sketchPlanePickSession']
  referenceWorkspace: AppState['referenceWorkspace']
  stagedChoiceIndex: number | null
  isStagedChoiceManualOverride: boolean
  suppressAutoCaptureRef: BooleanRef
  rootGuidedOptOutRef: BooleanRef
  previousSketchDrawIdleRef: BooleanRef
  focusMainConsoleInput: () => void
  focusPopoutConsoleInput: () => void
  setStagedNavigationSession: (session: ConsoleStagedNavigationSession | null) => void
  clearStagedNavigationSession: () => void
  setFeatureAssistDescriptor: (descriptor: ConsoleAssistDescriptor | null) => void
  setConsolePromptSession: (session: ConsolePromptSession | null) => void
  cycleStagedChoice: (direction: 'previous' | 'next') => void
  seedInputText: (text: string) => void
  buildStagedNavigationContextFromStoreState: (
    spaghettiState: SpaghettiState,
  ) => ConsoleStagedNavigationContext
  getActiveFeatureAssistDescriptor: (
    args: GetActiveFeatureAssistDescriptorArgs,
  ) => ConsoleAssistDescriptor | null
  appendEscUserEntry: () => void
  buildFeatureAssistPromptText: (descriptor: ConsoleAssistDescriptor) => string
  buildSketchDrawCameraAssistDescriptor: () => ConsoleAssistDescriptor
  buildSketchDrawCameraProjectionAssistDescriptor: () => ConsoleAssistDescriptor
  buildSketchDrawFeatureAssistDescriptor: (
    geometrySketchSession: NonNullable<SpaghettiState['geometrySketchSession']>,
  ) => ConsoleAssistDescriptor
  buildWorkspaceIntentDepsFromStoreState: () => WorkspaceIntentDeps
  closeEditorViewport: (editorViewportId: string) => void
  createMissingGraphNodeInGraphDocument: (
    graphDocumentId: string,
    nodeType: 'Geometry/Sketch' | 'Geometry/Extrude' | 'System/OutputPreview',
    labelPrefix: 'sketch' | 'extrude' | 'outputPreview',
  ) => CreatedMissingGraphNode | null
  createDetachedViewportSurfaceCopy: (
    surfaceInstanceId: string,
    mode: 'floating' | 'popout',
  ) => { surfaceInstanceId: string } | null
  detachViewportSlotSurface: (slotId: string, mode: 'floating' | 'popout') => void
  ensureSpaghettiEditorVisibleForGraphRoot: (
    graphDocumentId: string | null,
  ) => GraphRootEditorRevealRestore | null
  findFeatureAssistChoiceByInput: (
    descriptor: ConsoleAssistDescriptor,
    inputText: string,
  ) => ConsoleAssistDescriptor['choices'][number] | null
  getGeometrySketchDrawStageLabel: (drawStage: GeometrySketchDrawStage | null) => string
  graphRootEditorRevealRestoreRef: { current: GraphRootEditorRevealRestore | null }
  openReferenceTransformAxisPrompt: (axis: 'x' | 'y' | 'z') => void
  openReferenceTransformPlanePrompt: (plane: 'xy' | 'xz' | 'yz') => void
  pushCommandHistory: (command: string) => void
  resolveConsoleActionContext: (preferredGraphDocumentId?: string | null) => ConsoleActionContext
  resolveEditorViewportIdForGraphDocumentFromState: (
    spaghettiState: SpaghettiState,
    graphDocumentId: string,
  ) => string | null
  resolveEditorSurfaceInstanceIdForSlotSwitch: (currentSlot: {
    surfaceInstanceId: string
    retainedSurfaceInstanceIdsByKind: Partial<Record<WorkspaceSurfaceKind, string>>
  }) => string | null
  resolveSelectedObjectPartKeyForZoom: () => string | null
  resolveSelectedReferenceIdForZoom: () => string | null
  resolveSelectionSetForZoom: () => SelectionSetForZoom
  removeViewportSlot: (slotId: string) => void
  setActiveViewerViewportId: (surfaceInstanceId: string) => void
  setBrowserFloatingPosition: (position: { x: number; y: number }) => void
  setBrowserFloatingSize: (size: { width: number; height: number }) => void
  setBrowserViewportSplit: (split: boolean) => void
  setIsBrowserPoppedOut: (poppedOut: boolean) => void
  setViewportSlotSurfaceKind: (
    slotId: string,
    surfaceKind: WorkspaceSurfaceKind,
    options?: {
      surfaceInstanceId?: string
      discardRetainedSurfaceKinds?: ('spaghettiEditor')[]
    },
  ) => void
  splitViewportSlot: (
    slotId: string,
    side: 'top' | 'right' | 'bottom' | 'left',
    options?: { surfaceKind?: WorkspaceSurfaceKind },
  ) => string | null
  suppressNextReferenceTransformShellExitRef: BooleanRef
  switchToDocked: (focusInput?: boolean) => void
  transitionReferenceTransformAxisPrompt: (next: {
    mode: 'translate' | 'rotate' | 'scale'
    axis?: 'x' | 'y' | 'z'
  }) => void
}


const isValidRadioUrl = (input: string): boolean => {
  try {
    const url = new URL(input)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const parseRadioSampleBurstTime = (input: string): number | null => {
  const value = Number(input.trim())
  if (!Number.isFinite(value) || value <= 0) {
    return null
  }
  return value
}

const formatRadioSampleBurstTime = (value: number): string => {
  if (Number.isInteger(value)) {
    return `${value}`
  }
  return `${value}`.replace(/(\.\d*?[1-9])0+$/u, '$1').replace(/\.0$/u, '')
}

const isContentObjectTransformSnapScope = (
  scopeId: ConsoleStagedNavigationSession['scopeId'] | null | undefined,
): boolean =>
  scopeId === 'contentObjectTransformSnapRoot' ||
  scopeId === 'contentObjectTransformMoveSnapRoot' ||
  scopeId === 'contentObjectTransformRotateSnapRoot' ||
  scopeId === 'contentObjectTransformScaleSnapRoot' ||
  scopeId === 'contentObjectTransformMoveSnapXRoot' ||
  scopeId === 'contentObjectTransformMoveSnapYRoot' ||
  scopeId === 'contentObjectTransformMoveSnapZRoot' ||
  scopeId === 'contentObjectTransformRotateSnapXRoot' ||
  scopeId === 'contentObjectTransformRotateSnapYRoot' ||
  scopeId === 'contentObjectTransformRotateSnapZRoot' ||
  scopeId === 'contentObjectTransformScaleSnapXRoot' ||
  scopeId === 'contentObjectTransformScaleSnapYRoot' ||
  scopeId === 'contentObjectTransformScaleSnapZRoot'

const isValueAlignedToStep = (value: number, step: number): boolean => {
  if (!Number.isFinite(step) || step <= 0) {
    return true
  }
  const quotient = value / step
  return Math.abs(quotient - Math.round(quotient)) < 0.000001
}

const isSketchDrawLocalStagedScope = (
  session: ConsoleStagedNavigationSession | null,
): boolean =>
  session?.scopeId === 'sketchDrawRoot' ||
  session?.scopeId === 'sketchDrawCameraRoot' ||
  session?.scopeId === 'sketchDrawCameraProjectionRoot' ||
  session?.scopeId === 'sketchDrawZoomRoot'

const formatWorkspaceModeEligibilityBlockedDiagnostic = (
  actionLabel: string,
  blockedReason: WorkspaceSurfaceActionBlockedReason | null,
): string => {
  switch (blockedReason) {
    case 'primary-slot-protected':
      return `${actionLabel} is not available for the primary viewport`
    case 'catalog-host-mode-unsupported':
    case 'catalog-split-unsupported':
      return `${actionLabel} is not supported by this workspace surface`
    case 'surface-not-slotted':
      return `${actionLabel} is only available for slotted workspace viewports`
    case null:
      return `${actionLabel} is not available here`
  }
}

const buildConsoleWorkspaceSurfaceTargetOptionFromSlot = (
  slot: WorkspaceViewportSlot,
): ConsoleWorkspaceSurfaceTargetOption => ({
  viewportId: slot.surfaceInstanceId,
  surfaceInstanceId: slot.surfaceInstanceId,
  hostMode: 'slotted',
  slotId: slot.slotId,
  isPrimary: slot.slotId === defaultPrimaryViewportSlotId,
  label: getWorkspaceViewportSurfaceLabel(slot.surfaceKind),
  surfaceKind: slot.surfaceKind,
})

const buildConsoleWorkspaceSurfaceTargetOptionFromDetachedSurface = (
  surface: WorkspaceDetachedSlotSurfaceState,
): ConsoleWorkspaceSurfaceTargetOption => ({
  viewportId: surface.surfaceInstanceId,
  surfaceInstanceId: surface.surfaceInstanceId,
  hostMode: surface.hostMode,
  label: getWorkspaceViewportSurfaceLabel(surface.surfaceKind),
  surfaceKind: surface.surfaceKind,
})

type UseConsoleInteractionResult = {
  enterGuidedRootSession: (options?: { appendPrompt?: boolean }) => void
  rehydrateGuidedRootSession: () => void
  requestRadioBurst: (
    commandIdentity: string | null | undefined,
    triggerKind: RadioBurstTriggerKind,
  ) => unknown
  resolveFeatureAssistSubmitIdentity: (inputText: string) => string | null
  handleGuidedChoiceCycle: (direction: 'previous' | 'next') => void
  exitActiveReferenceTransformShell: () => boolean
  handleEscCancelCommand: () => void
  handleSubmitCommand: (inputText: string) => void
}

export function useConsoleInteraction(
  options: UseConsoleInteractionOptions,
): UseConsoleInteractionResult {
  const {
    windowMode,
    popoutWindow,
    treatSpaceAsSubmit,
    consoleInputText,
    consolePromptSession,
    stagedNavigationSession,
    featureAssistDescriptor,
    geometrySketchSession,
    sketchPlanePickSession,
    referenceWorkspace,
    stagedChoiceIndex,
    isStagedChoiceManualOverride,
    suppressAutoCaptureRef,
    rootGuidedOptOutRef,
    previousSketchDrawIdleRef,
    focusMainConsoleInput,
    focusPopoutConsoleInput,
    setStagedNavigationSession,
    clearStagedNavigationSession,
    setFeatureAssistDescriptor,
    setConsolePromptSession,
    cycleStagedChoice,
    seedInputText,
    appendEscUserEntry,
    buildFeatureAssistPromptText,
    buildSketchDrawCameraAssistDescriptor,
    buildSketchDrawCameraProjectionAssistDescriptor,
    buildSketchDrawFeatureAssistDescriptor,
    buildStagedNavigationContextFromStoreState,
    buildWorkspaceIntentDepsFromStoreState,
    closeEditorViewport,
    createMissingGraphNodeInGraphDocument,
    createDetachedViewportSurfaceCopy,
    detachViewportSlotSurface,
    ensureSpaghettiEditorVisibleForGraphRoot,
    findFeatureAssistChoiceByInput,
    getActiveFeatureAssistDescriptor,
    getGeometrySketchDrawStageLabel,
    graphRootEditorRevealRestoreRef,
    openReferenceTransformAxisPrompt,
    openReferenceTransformPlanePrompt,
    pushCommandHistory,
    resolveConsoleActionContext,
    resolveEditorViewportIdForGraphDocumentFromState,
    resolveEditorSurfaceInstanceIdForSlotSwitch,
    resolveSelectedObjectPartKeyForZoom,
    resolveSelectedReferenceIdForZoom,
    resolveSelectionSetForZoom,
    removeViewportSlot,
    setActiveViewerViewportId,
    setBrowserFloatingPosition,
    setBrowserFloatingSize,
    setBrowserViewportSplit,
    setIsBrowserPoppedOut,
    setViewportSlotSurfaceKind,
    splitViewportSlot,
    suppressNextReferenceTransformShellExitRef,
    switchToDocked,
    transitionReferenceTransformAxisPrompt,
  } = options

  const enterGuidedRootSession = useCallback((enterOptions?: { appendPrompt?: boolean }) => {
    rootGuidedOptOutRef.current = false
    const rootSession = createConsoleRootSession()
    setStagedNavigationSession(rootSession)
    if (enterOptions?.appendPrompt === true) {
      const lastEntry = useConsoleStore.getState().entries.at(-1)
      if (lastEntry?.text !== ROOT_PROMPT_TEXT) {
        appendConsoleEntry({
          layer: 'Commands',
          text: ROOT_PROMPT_TEXT,
          source: 'console',
          severity: 'info',
        })
      }
    }
  }, [rootGuidedOptOutRef, setStagedNavigationSession])

  const activateConsoleGraphTarget = useCallback(
    (
      graphDocumentId: string,
      nodeId: string | null,
      options: {
        strategy?: 'open-or-focus' | 'swap-focused-or-open' | 'open-new'
        fitNodeInViewport?: boolean
      } = {},
    ) =>
      activateGraphTargetIntent(
        buildWorkspaceIntentDepsFromStoreState(),
        {
          graphDocumentId,
          nodeId,
        },
        {
          strategy: options.strategy ?? 'open-or-focus',
          fitNodeInViewport: options.fitNodeInViewport ?? false,
        },
      ),
    [buildWorkspaceIntentDepsFromStoreState],
  )

  const rehydrateGuidedRootSession = useCallback(() => {
    if (rootGuidedOptOutRef.current === false) {
      return
    }
    const consoleState = useConsoleStore.getState()
    const spaghettiState = useSpaghettiStore.getState()
    if (
      consoleState.stagedNavigationSession !== null ||
      consoleState.consolePromptSession !== null ||
      consoleState.featureAssistDescriptor !== null ||
      consoleState.inputText.trim().length > 0 ||
      spaghettiState.sketchPlanePickSession !== null ||
      spaghettiState.geometrySketchSession?.mode === 'draw'
    ) {
      return
    }
    enterGuidedRootSession()
  }, [enterGuidedRootSession, rootGuidedOptOutRef])

  const trackRadioCommandIdentity = useCallback((commandIdentity: string | null | undefined) => {
    if (typeof commandIdentity !== 'string' || commandIdentity.length === 0) {
      return
    }
    useAudioSamplerStore.getState().ensureSamplePosition(commandIdentity)
  }, [])

  const requestRadioBurst = useCallback((
    commandIdentity: string | null | undefined,
    triggerKind: RadioBurstTriggerKind,
  ) => {
    if (typeof commandIdentity !== 'string' || commandIdentity.length === 0) {
      return null
    }
    return useAudioSamplerStore.getState().requestRadioBurst(commandIdentity, triggerKind)
  }, [])

  const triggerBurstForActiveStagedChoice = useCallback(
    (triggerKind: Extract<RadioBurstTriggerKind, 'arrowUp' | 'arrowDown'>) => {
      const state = useConsoleStore.getState()
      const activeSession = state.stagedNavigationSession
      if (activeSession !== null) {
        const activeChoice =
          activeSession.validChoices[state.stagedChoiceIndex ?? 0] ?? null
        if (activeChoice === null) {
          return
        }
        requestRadioBurst(
          resolveConsoleRadioCommandIdentity({
            kind: 'stagedChoice',
            activeScopeId: activeSession.scopeId,
            matchedCanonicalToken: activeChoice.canonicalToken,
            matchedLabel: activeChoice.label,
          }),
          triggerKind,
        )
        return
      }

      if (state.consolePromptSession !== null) {
        return
      }

      const activeDescriptor = state.featureAssistDescriptor
      if (activeDescriptor === null) {
        return
      }

      const activeChoice = activeDescriptor.choices[state.stagedChoiceIndex ?? 0] ?? null
      if (activeChoice === null) {
        return
      }

      requestRadioBurst(
        resolveConsoleRadioCommandIdentity({
          kind: 'featureAssistChoice',
          breadcrumb: activeDescriptor.breadcrumb,
          matchedCanonicalToken: activeChoice.canonicalToken,
          matchedLabel: activeChoice.label,
        }),
        triggerKind,
      )
    },
    [requestRadioBurst],
  )

  const resolveFeatureAssistSubmitIdentity = useCallback((inputText: string): string | null => {
    const descriptor = useConsoleStore.getState().featureAssistDescriptor
    if (descriptor === null) {
      return null
    }

    const matchedChoice = findFeatureAssistChoiceByInput(descriptor, inputText)
    return resolveConsoleRadioCommandIdentity({
      kind: 'featureAssistSubmit',
      breadcrumb: descriptor.breadcrumb,
      submittedToken: inputText.trim().toUpperCase(),
      matchedCanonicalToken: matchedChoice?.canonicalToken ?? null,
      matchedLabel: matchedChoice?.label ?? null,
    })
  }, [findFeatureAssistChoiceByInput])

  const commitActiveReferenceTransformFromConsole = useCallback((rawToken: string) => {
    commitActiveReferenceTransformFromConsoleCommand({
      appendConsoleEntry,
      buildStagedNavigationContextFromStoreState,
      clearConsolePromptSession: () => useConsoleStore.getState().clearConsolePromptSession(),
      getAppState: () => useAppStore.getState(),
      getConsolePromptSession: () => useConsoleStore.getState().consolePromptSession,
      getSpaghettiState: () => useSpaghettiStore.getState(),
      getStagedNavigationSession: () => useConsoleStore.getState().stagedNavigationSession,
      getViewer,
      inputText: rawToken,
      pushCommandHistory,
      requestRadioBurst,
      resolveFeatureAssistSubmitIdentity,
      setConsolePromptSession,
      setInputText: (text, setterOptions) =>
        useConsoleStore.getState().setInputText(text, setterOptions),
      setStagedNavigationSession,
    })
  }, [
    buildStagedNavigationContextFromStoreState,
    pushCommandHistory,
    requestRadioBurst,
    resolveFeatureAssistSubmitIdentity,
    setConsolePromptSession,
    setStagedNavigationSession,
  ])

  const cycleStagedChoiceWithRadioBurst = useCallback(
    (
      direction: 'previous' | 'next',
      triggerKind: Extract<RadioBurstTriggerKind, 'arrowUp' | 'arrowDown'>,
    ) => {
      cycleStagedChoice(direction)
      triggerBurstForActiveStagedChoice(triggerKind)
    },
    [cycleStagedChoice, triggerBurstForActiveStagedChoice],
  )

  const handleGuidedChoiceCycle = useCallback(
    (direction: 'previous' | 'next') => {
      cycleStagedChoiceWithRadioBurst(
        direction,
        direction === 'previous' ? 'arrowDown' : 'arrowUp',
      )
    },
    [cycleStagedChoiceWithRadioBurst],
  )

  const dispatchImmediateShortcut = useCallback((key: 'm' | 'r' | 's') => {
    suppressAutoCaptureRef.current = true
    try {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true,
        }),
      )
    } finally {
      suppressAutoCaptureRef.current = false
    }
  }, [])

  const clearReferenceTransformPrompt = useCallback(() => {
    getViewer()?.cancelReferenceTransformDrag?.()
    getViewer()?.clearReferenceTransformHandle?.()
    useAppStore.getState().setActiveReferenceTransformHandle(null)
    useConsoleStore.getState().clearConsolePromptSession()
    const descriptor = useConsoleStore.getState().featureAssistDescriptor
    if (descriptor !== null) {
      appendConsoleEntry({
        layer: 'Commands',
        text: buildFeatureAssistPromptText(descriptor),
        source: 'console',
        severity: 'info',
      })
    }
  }, [])

  const createActiveReferenceTransformRootSession = useCallback((referenceId: string) => {
    return createActiveReferenceTransformRootSessionCommand({
      appState: useAppStore.getState(),
      buildStagedNavigationContextFromStoreState,
      referenceId,
      spaghettiState: useSpaghettiStore.getState(),
    })
  }, [buildStagedNavigationContextFromStoreState])

  const createActiveContentObjectTransformRootSession = useCallback((objectId: string) => {
    return createActiveContentObjectTransformRootSessionCommand({
      appState: useAppStore.getState(),
      objectId,
    })
  }, [])

  const deleteLatestReferenceTransformEntry = useCallback((referenceId: string) => {
    return deleteLatestReferenceTransformEntryCommand(useAppStore.getState(), referenceId)
  }, [])

  const deleteLatestContentObjectTransformEntry = useCallback((objectId: string) => {
    return deleteLatestContentObjectTransformEntryCommand(useAppStore.getState(), objectId)
  }, [])

  const createActiveReferenceTransformSnapSession = useCallback((
    referenceId: string,
    mode: ReferenceTransformSnapMode,
  ) => {
    return createActiveReferenceTransformSnapSessionCommand({
      createActiveReferenceTransformRootSession,
      mode,
      referenceId,
      stagedContext: buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
    })
  }, [buildStagedNavigationContextFromStoreState, createActiveReferenceTransformRootSession])

  const createActiveContentObjectTransformSnapSession = useCallback((
    objectId: string,
    mode: ReferenceTransformSnapMode,
  ) => {
    return createActiveContentObjectTransformSnapSessionCommand({
      createActiveContentObjectTransformRootSession,
      mode,
      objectId,
      stagedContext: buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
    })
  }, [buildStagedNavigationContextFromStoreState, createActiveContentObjectTransformRootSession])

  const applyReferenceTransformSpaceShortcut = useCallback((
    space: 'local' | 'world',
    rawToken: string,
    options?: {
      closePromptToModeRoot?: boolean
    },
  ) => {
    return applyReferenceTransformSpaceShortcutCommand({
      appendConsoleEntry,
      buildFeatureAssistPromptText,
      clearConsolePromptSession: () => useConsoleStore.getState().clearConsolePromptSession(),
      closePromptToModeRoot: options?.closePromptToModeRoot === true,
      createActiveReferenceTransformRootSession,
      getActiveFeatureAssistDescriptor,
      getAppState: () => useAppStore.getState(),
      getSpaghettiState: () => useSpaghettiStore.getState(),
      getViewer,
      inputText: rawToken,
      pushCommandHistory,
      requestRadioBurst,
      resolveFeatureAssistSubmitIdentity: () =>
        resolveConsoleRadioCommandIdentity({
          kind: 'stagedExecute',
          activeScopeId: 'referenceTransformRoot',
          actionId:
            space === 'local'
              ? 'reference.transform.space.local'
              : 'reference.transform.space.world',
        }),
      setStagedNavigationSession,
      space,
    })
  }, [
    buildFeatureAssistPromptText,
    createActiveReferenceTransformRootSession,
    getActiveFeatureAssistDescriptor,
    pushCommandHistory,
    requestRadioBurst,
    setStagedNavigationSession,
  ])

  const cancelActiveReferenceTransformSession = useCallback(() => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    const activeReferenceId = activeSession?.referenceId ?? null
    if (activeSession === null || activeReferenceId === null) {
      return
    }
    const baseline = activeSession.entryOrigin ?? activeSession.draftTransform
    getViewer()?.cancelReferenceTransformDrag()
    getViewer()?.clearReferenceTransformHandle()
    appState.cancelActiveReferenceTransformEntry()
    getViewer()?.setReferenceTransformOverride?.(activeReferenceId, baseline)
    useConsoleStore.getState().clearConsolePromptSession()

    suppressNextReferenceTransformShellExitRef.current = true
    queueMicrotask(() => {
      suppressNextReferenceTransformShellExitRef.current = false
    })
    setStagedNavigationSession(createActiveReferenceTransformRootSession(activeReferenceId))
  }, [createActiveReferenceTransformRootSession, setStagedNavigationSession])

  const cancelActiveContentObjectTransformSession = useCallback(() => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeContentObjectTransformSession
    if (activeSession === null) {
      return
    }
    const baseline = activeSession.entryOrigin ?? activeSession.draftTransform
    getViewer()?.cancelReferenceTransformDrag()
    getViewer()?.clearReferenceTransformHandle()
    appState.setContentObjectTransformOverride(activeSession.objectId, baseline)
    appState.cancelActiveContentObjectTransformEntry()
  }, [])

  const exitActiveContentObjectTransformShell = useCallback(() => {
    const appState = useAppStore.getState()
    if (appState.referenceWorkspace.activeContentObjectTransformSession === null) {
      return false
    }
    getViewer()?.cancelReferenceTransformDrag?.()
    getViewer()?.clearReferenceTransformHandle?.()
    appState.exitContentObjectTransformShell()
    useConsoleStore.getState().clearConsolePromptSession()
    appendConsoleEntry({
      layer: 'Transforms',
      text: 'Exited Viewer Transform',
      source: 'console',
      severity: 'info',
    })
    return true
  }, [])

  const exitActiveReferenceTransformShell = useCallback(() => {
    const appState = useAppStore.getState()
    const activeReferenceId =
      appState.referenceWorkspace.activeReferenceTransformSession?.referenceId ?? null
    if (activeReferenceId === null) {
      return false
    }

    getViewer()?.cancelReferenceTransformDrag?.()
    getViewer()?.clearReferenceTransformHandle?.()
    appState.exitReferenceTransformShell()
    useConsoleStore.getState().clearConsolePromptSession()

    const nextReferenceSession = resolveConsoleWorkspaceContextSync(
      buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
      buildReferenceConsoleWorkspaceTarget(appState.referenceWorkspace, activeReferenceId),
    ).session

    if (nextReferenceSession !== null) {
      setStagedNavigationSession(nextReferenceSession)
      appendConsoleEntry({
        layer: 'Commands',
        text: formatStagedBreadcrumb(nextReferenceSession.breadcrumb),
        source: 'console',
        severity: 'info',
      })
      appendConsoleEntry({
        layer: 'Commands',
        text: buildStagedPromptText(nextReferenceSession, nextReferenceSession.validChoices),
        source: 'console',
        severity: 'info',
      })
    }
    return true
  }, [setStagedNavigationSession])

  const routeConsoleGlobalKey = useCallback((event: KeyboardEvent) => {
    const spaghettiState = useSpaghettiStore.getState()
    const appState = useAppStore.getState()
    const consoleState = useConsoleStore.getState()
    const selectedConsoleTarget = selectConsoleWorkspaceContextTarget(appState)
    const selectedReferenceDeleteAvailable =
      (selectedConsoleTarget?.kind === 'object' &&
        typeof selectedConsoleTarget.referenceId === 'string' &&
        selectedConsoleTarget.canDelete === true) ||
      (selectedConsoleTarget?.kind === 'multi-select' &&
        selectedConsoleTarget.canDelete === true &&
        Array.isArray(selectedConsoleTarget.referenceDeleteIds) &&
        selectedConsoleTarget.referenceDeleteIds.length > 1)
    const selectedReferenceHideAvailable =
      (selectedConsoleTarget?.kind === 'object' &&
        typeof selectedConsoleTarget.referenceId === 'string' &&
        selectedConsoleTarget.canHide === true) ||
      (selectedConsoleTarget?.kind === 'multi-select' &&
        selectedConsoleTarget.canHide === true &&
        Array.isArray(selectedConsoleTarget.referenceHideIds) &&
        selectedConsoleTarget.referenceHideIds.length > 1)
    const hiddenReferenceRestoreAvailable = appState.referenceWorkspace.importedReferenceOrder.some(
      (referenceId) => (appState.referenceWorkspace.visibilityById[referenceId] ?? false) === false,
    )
    return routeKeyboardInput({
      event,
      editHistoryCanUndo: editHistoryStore.canUndo(),
      editHistoryCanRedo: editHistoryStore.canRedo(),
      consoleCommandSessionUndoOwner:
        spaghettiState.geometrySketchSession?.mode === 'draw' ? 'sketch-draw' : null,
      consoleInputAllowsCommandSessionUndo:
        consoleState.inputText.trim().length === 0 ||
        (
          consoleState.isStagedChoiceManualOverride !== true &&
          (
            consoleState.stagedNavigationSession !== null ||
            consoleState.consolePromptSession !== null ||
            consoleState.featureAssistDescriptor !== null
          )
        ),
      viewerFlyActive: getViewer()?.isFlyModeActive?.() === true,
      viewerCameraShortcutsEnabled:
        appState.workspaceSelection.activeSurface === 'viewer' && getViewer() !== null,
      sketchPlanePickStage: spaghettiState.sketchPlanePickSession?.stage ?? null,
      geometrySketchMode:
        consoleState.featureAssistDescriptor !== null
          ? null
          : spaghettiState.geometrySketchSession?.mode ?? null,
      selectedReferenceDeleteAvailable,
      selectedReferenceHideAvailable,
      hiddenReferenceRestoreAvailable,
      referenceTransformActive:
        appState.referenceWorkspace.activeReferenceTransformSession?.entryActive === true ||
        appState.referenceWorkspace.activeContentObjectTransformSession?.entryActive === true,
      stagedConsoleActive:
        consoleState.stagedNavigationSession !== null ||
        consoleState.consolePromptSession !== null ||
        consoleState.featureAssistDescriptor !== null,
      allowFlatConsoleCapture: true,
    })
  }, [])

  const dispatchSketchDrawShortcut = useCallback((
    routing: InputRoutingResult,
    event: KeyboardEvent,
  ): boolean => {
    if (routing.owner !== 'sketch-draw' || routing.decision !== 'handle') {
      return false
    }
    const spaghettiState = useSpaghettiStore.getState()
    if (routing.sketchDrawAction === 'undo') {
      event.preventDefault()
      event.stopImmediatePropagation()
      return spaghettiState.undoGeometrySketchStagedCommand()
    }
    if (routing.sketchDrawAction === 'redo') {
      event.preventDefault()
      event.stopImmediatePropagation()
      return spaghettiState.redoGeometrySketchStagedCommand()
    }
    return false
  }, [])

  const resolveWorkspaceModeRuntimeGuard = useCallback(
    (
      stagedResult: Extract<
        ReturnType<typeof submitConsoleStagedNavigationToken>,
        { kind: 'execute' }
      >,
      action: WorkspaceSurfaceActionFamily,
      options: {
        actionLabel: string
        missingTargetDiagnostic: string
      },
    ) => {
      const targetViewportId = stagedResult.selections.workspaceViewportId ?? null
      const workspaceState = useWorkspaceStore.getState()
      const targetSlot =
        targetViewportId === null
          ? null
          : Object.values(workspaceState.viewportSlotsById).find(
              (slot) => slot.surfaceInstanceId === targetViewportId,
            ) ?? null
      const targetDetachedSurface =
        targetSlot !== null || targetViewportId === null
          ? null
          : workspaceState.detachedSlotSurfaceById[targetViewportId] ?? null
      const target =
        targetSlot !== null
          ? buildConsoleWorkspaceSurfaceTargetOptionFromSlot(targetSlot)
          : targetDetachedSurface !== null
            ? buildConsoleWorkspaceSurfaceTargetOptionFromDetachedSurface(targetDetachedSurface)
            : null

      if (target === null) {
        setStagedNavigationSession(stagedResult.session)
        appendConsoleEntry({
          layer: 'Diagnostics',
          text: options.missingTargetDiagnostic,
          source: 'console',
          severity: 'warn',
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
          source: 'console',
          severity: 'info',
        })
        return null
      }

      const eligibilityEntry = getWorkspaceSurfaceActionEligibility({
        surfaceKind: target.surfaceKind,
        hostMode: target.hostMode,
        isPrimary: target.isPrimary === true,
      })[action]

      if (!eligibilityEntry.supported) {
        setStagedNavigationSession(stagedResult.session)
        appendConsoleEntry({
          layer: 'Diagnostics',
          text: formatWorkspaceModeEligibilityBlockedDiagnostic(
            options.actionLabel,
            eligibilityEntry.blockedReason,
          ),
          source: 'console',
          severity: 'warn',
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
          source: 'console',
          severity: 'info',
        })
        return null
      }

      if (targetSlot === null) {
        setStagedNavigationSession(stagedResult.session)
        appendConsoleEntry({
          layer: 'Diagnostics',
          text: options.missingTargetDiagnostic,
          source: 'console',
          severity: 'warn',
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
          source: 'console',
          severity: 'info',
        })
        return null
      }

      return {
        workspaceState,
        target,
        targetSlot,
        eligibilityEntry,
      }
    },
    [setStagedNavigationSession],
  )

  const deleteSelectedReferenceTargets = useCallback((): boolean => {
    const appState = useAppStore.getState()
    const selectedConsoleTarget = selectConsoleWorkspaceContextTarget(appState)
    if (
      selectedConsoleTarget?.kind === 'object' &&
      typeof selectedConsoleTarget.referenceId === 'string' &&
      selectedConsoleTarget.canDelete === true
    ) {
      appState.removeImportedReference(selectedConsoleTarget.referenceId)
      appState.requestConsoleContextSync('target-selection')
      appendConsoleEntry({
        layer: 'Browser',
        text: `Deleted ${selectedConsoleTarget.label}`,
        source: 'console',
        severity: 'info',
      })
      return true
    }
    if (
      selectedConsoleTarget?.kind === 'multi-select' &&
      selectedConsoleTarget.canDelete === true &&
      Array.isArray(selectedConsoleTarget.referenceDeleteIds) &&
      selectedConsoleTarget.referenceDeleteIds.length > 1
    ) {
      selectedConsoleTarget.referenceDeleteIds.forEach((referenceId) => {
        appState.removeImportedReference(referenceId)
      })
      appState.requestConsoleContextSync('target-selection')
      appendConsoleEntry({
        layer: 'Browser',
        text: `Deleted ${selectedConsoleTarget.referenceDeleteIds.length} reference objects`,
        source: 'console',
        severity: 'info',
      })
      return true
    }
    appendConsoleEntry({
      layer: 'Browser',
      text: 'Delete is not available for the selected reference object',
      source: 'console',
      severity: 'warn',
    })
    return false
  }, [])

  const explodeSelectedReferenceTarget = useCallback((): boolean => {
    const appState = useAppStore.getState()
    const selectedConsoleTarget = selectConsoleWorkspaceContextTarget(appState)
    if (
      selectedConsoleTarget?.kind === 'object' &&
      typeof selectedConsoleTarget.referenceId === 'string' &&
      selectedConsoleTarget.canExplode === true
    ) {
      if (!appState.explodeImportedReference(selectedConsoleTarget.referenceId)) {
        appendConsoleEntry({
          layer: 'Browser',
          text: 'Explode failed for the selected reference object',
          source: 'console',
          severity: 'warn',
        })
        return false
      }
      appState.requestConsoleContextSync('target-selection')
      appendConsoleEntry({
        layer: 'Browser',
        text: `Exploded ${selectedConsoleTarget.label}`,
        source: 'console',
        severity: 'info',
      })
      return true
    }
    appendConsoleEntry({
      layer: 'Browser',
      text: 'Explode is not available for the selected reference object',
      source: 'console',
      severity: 'warn',
    })
    return false
  }, [appendConsoleEntry])

  const setSelectedContentContainerVisibility = useCallback(
    ({
      assemblyId,
      componentId,
      visibilityPartKeys,
      visible,
    }: {
      assemblyId?: string | null
      componentId?: string | null
      visibilityPartKeys?: string[]
      visible: boolean
    }): boolean => {
      const appState = useAppStore.getState()
      const uniquePartKeys = [
        ...new Set((visibilityPartKeys ?? []).filter((partKey) => partKey.length > 0)),
      ]
      if (uniquePartKeys.length === 0) {
        appendConsoleEntry({
          layer: 'Browser',
          text: `${visible ? 'Show' : 'Hide'} is not available for the selected content container`,
          source: 'console',
          severity: 'warn',
        })
        return false
      }
      uniquePartKeys.forEach((partKey) => {
        appState.setPartVisibility(partKey, visible)
      })
      appState.requestConsoleContextSync('target-selection')
      const label =
        assemblyId !== null && assemblyId !== undefined
          ? appState.projectContent.assembliesById[assemblyId]?.label ?? assemblyId
          : componentId !== null && componentId !== undefined
            ? appState.projectContent.componentsById[componentId]?.label ?? componentId
            : 'content container'
      appendConsoleEntry({
        layer: 'Browser',
        text: `${visible ? 'Shown' : 'Hidden'} ${label}`,
        source: 'console',
        severity: 'info',
      })
      return true
    },
    [appendConsoleEntry],
  )

  const hideReferenceTargets = useCallback(
    (
      referenceIds: string[],
      options?: {
        selectTargetAfterHide?: { kind: 'object'; objectId: string } | null
      },
    ): boolean => {
      const appState = useAppStore.getState()
      const uniqueReferenceIds = [...new Set(referenceIds)]
      if (uniqueReferenceIds.length === 0) {
        return false
      }
      uniqueReferenceIds.forEach((referenceId) => {
        appState.setReferenceItemVisibility(referenceId, false)
      })
      if (options?.selectTargetAfterHide != null) {
        commitWorkspaceTargetSelection(
          {
            setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
            selectPart: appState.selectPart,
            requestConsoleContextSync: appState.requestConsoleContextSync,
          },
          options.selectTargetAfterHide,
          {
            selectedPartKey: null,
          },
        )
      } else {
        appState.requestConsoleContextSync('target-selection')
      }
      appendConsoleEntry({
        layer: 'Browser',
        text:
          uniqueReferenceIds.length === 1
            ? `Hidden ${appState.referenceWorkspace.importedReferencesById[uniqueReferenceIds[0]]?.label ?? uniqueReferenceIds[0]}`
            : `Hidden ${uniqueReferenceIds.length} reference objects`,
        source: 'console',
        severity: 'info',
      })
      return true
    },
    [appendConsoleEntry],
  )

  const hideSelectedReferenceTargets = useCallback((): boolean => {
    const appState = useAppStore.getState()
    const selectedConsoleTarget = selectConsoleWorkspaceContextTarget(appState)
    if (
      selectedConsoleTarget?.kind === 'object' &&
      typeof selectedConsoleTarget.referenceId === 'string' &&
      selectedConsoleTarget.canHide === true
    ) {
      return hideReferenceTargets([selectedConsoleTarget.referenceId])
    }
    if (
      selectedConsoleTarget?.kind === 'multi-select' &&
      selectedConsoleTarget.canHide === true &&
      Array.isArray(selectedConsoleTarget.referenceHideIds) &&
      selectedConsoleTarget.referenceHideIds.length > 1
    ) {
      return hideReferenceTargets(selectedConsoleTarget.referenceHideIds)
    }
    appendConsoleEntry({
      layer: 'Browser',
      text: 'Hide is not available for the selected reference object',
      source: 'console',
      severity: 'warn',
    })
    return false
  }, [appendConsoleEntry, hideReferenceTargets])

  const unhideAllReferenceTargets = useCallback((): boolean => {
    const appState = useAppStore.getState()
    const hiddenReferenceIds = appState.referenceWorkspace.importedReferenceOrder.filter(
      (referenceId) => (appState.referenceWorkspace.visibilityById[referenceId] ?? false) === false,
    )
    if (hiddenReferenceIds.length === 0) {
      appendConsoleEntry({
        layer: 'Browser',
        text: 'No hidden reference objects to restore',
        source: 'console',
        severity: 'info',
      })
      return false
    }
    hiddenReferenceIds.forEach((referenceId) => {
      appState.setReferenceItemVisibility(referenceId, true)
    })
    appState.requestConsoleContextSync('target-selection')
    appendConsoleEntry({
      layer: 'Browser',
      text:
        hiddenReferenceIds.length === 1
          ? `Restored ${appState.referenceWorkspace.importedReferencesById[hiddenReferenceIds[0]]?.label ?? hiddenReferenceIds[0]}`
          : `Restored ${hiddenReferenceIds.length} reference objects`,
      source: 'console',
      severity: 'info',
    })
    return true
  }, [appendConsoleEntry])

  const unhideReferenceTargets = useCallback((referenceIds: string[]): boolean => {
    const appState = useAppStore.getState()
    const uniqueReferenceIds = [...new Set(referenceIds)]
    if (uniqueReferenceIds.length === 0) {
      return false
    }
    uniqueReferenceIds.forEach((referenceId) => {
      appState.setReferenceItemVisibility(referenceId, true)
    })
    appState.requestConsoleContextSync('target-selection')
    appendConsoleEntry({
      layer: 'Browser',
      text:
        uniqueReferenceIds.length === 1
          ? `Restored ${appState.referenceWorkspace.importedReferencesById[uniqueReferenceIds[0]]?.label ?? uniqueReferenceIds[0]}`
          : `Restored ${uniqueReferenceIds.length} reference objects`,
      source: 'console',
      severity: 'info',
    })
    return true
  }, [appendConsoleEntry])

  const unhideSelectedReferenceTargets = useCallback((): boolean => {
    const appState = useAppStore.getState()
    const selectedConsoleTarget = selectConsoleWorkspaceContextTarget(appState)
    if (
      selectedConsoleTarget?.kind === 'multi-select' &&
      selectedConsoleTarget.canUnhide === true &&
      Array.isArray(selectedConsoleTarget.referenceUnhideIds) &&
      selectedConsoleTarget.referenceUnhideIds.length > 1
    ) {
      return unhideReferenceTargets(selectedConsoleTarget.referenceUnhideIds)
    }
    appendConsoleEntry({
      layer: 'Browser',
      text: 'Unhide is not available for the selected reference object',
      source: 'console',
      severity: 'warn',
    })
    return false
  }, [appendConsoleEntry, unhideReferenceTargets])

  const cancelActiveStagedNavigationSession = useCallback(() => {
    const activeSession = useConsoleStore.getState().stagedNavigationSession
    if (activeSession === null) {
      return false
    }
    const cancelled = cancelConsoleStagedNavigationSession()
    clearStagedNavigationSession()
    if (activeSession.scopeId === 'root') {
      rootGuidedOptOutRef.current = true
    }
    const revealRestore = graphRootEditorRevealRestoreRef.current
    graphRootEditorRevealRestoreRef.current = null
    if (revealRestore !== null) {
      const spaghettiState = useSpaghettiStore.getState()
      if (revealRestore.kind === 'close-opened-viewport') {
        if (spaghettiState.editorViewportsById[revealRestore.editorViewportId] !== undefined) {
          spaghettiState.closeEditorViewport(revealRestore.editorViewportId)
        }
      } else if (spaghettiState.editorViewportsById[revealRestore.editorViewportId] !== undefined) {
        spaghettiState.setEditorViewportWindowMode(
          revealRestore.editorViewportId,
          revealRestore.windowMode,
        )
      }
      if (
        revealRestore.previousActiveEditorViewportId.length > 0 &&
        useSpaghettiStore.getState().editorViewportsById[
          revealRestore.previousActiveEditorViewportId
        ] !== undefined
      ) {
        useSpaghettiStore
          .getState()
          .setActiveEditorViewportId(revealRestore.previousActiveEditorViewportId)
      }
    }
    appendConsoleEntry({
      layer: 'App',
      text: 'Staged navigation cancelled',
      source: 'console',
      severity: 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildRootPromptText(cancelled.validChoices.map((choice) => choice.label)),
      source: 'console',
      severity: 'info',
    })
    return true
  }, [clearStagedNavigationSession])

  const stepActiveStagedNavigationSessionOneLevel = useCallback(() => {
    const activeSession = useConsoleStore.getState().stagedNavigationSession
    if (activeSession === null) {
      return false
    }

    appendEscUserEntry()

    if (activeSession.scopeId === 'root') {
      cancelActiveStagedNavigationSession()
      return true
    }

    if (isSketchDrawLocalStagedScope(activeSession)) {
      return true
    }

    if (activeSession.scopeId === 'graphRoot' || activeSession.scopeId === 'radioRoot') {
      enterGuidedRootSession()
      appendConsoleEntry({
        layer: 'Commands',
        text: ROOT_PROMPT_TEXT,
        source: 'console',
        severity: 'info',
      })
      return true
    }

    const spaghettiState = useSpaghettiStore.getState()
    const stagedResult = submitConsoleStagedNavigationToken(
      activeSession,
      'BACK',
      buildStagedNavigationContextFromStoreState(spaghettiState),
    )

    if (stagedResult.kind !== 'advance') {
      cancelActiveStagedNavigationSession()
      return true
    }

    if (stagedResult.selections.graphDocumentId !== null) {
      activateConsoleGraphTarget(
        stagedResult.selections.graphDocumentId,
        stagedResult.selections.selectedNodeId,
        {
          strategy: 'open-or-focus',
        },
      )
    }

    setStagedNavigationSession(stagedResult.session)
    appendConsoleEntry({
      layer: 'Commands',
      text: formatStagedBreadcrumb(stagedResult.breadcrumb),
      source: 'console',
      severity: 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildStagedPromptText(stagedResult.session, stagedResult.validChoices),
      source: 'console',
      severity: 'info',
    })
    return true
  }, [
    appendEscUserEntry,
    cancelActiveStagedNavigationSession,
    enterGuidedRootSession,
    setStagedNavigationSession,
  ])

  const stepActiveConsolePromptSessionBack = useCallback(() => {
    const activePromptSession = useConsoleStore.getState().consolePromptSession
    if (activePromptSession === null) {
      return false
    }

    if (
      activePromptSession.kind === 'reference-transform.axis' ||
      activePromptSession.kind === 'reference-transform.plane'
    ) {
      appendEscUserEntry()
      clearReferenceTransformPrompt()
      return true
    }

    appendEscUserEntry()
    setStagedNavigationSession(activePromptSession.returnSession)
    appendConsoleEntry({
      layer: 'Commands',
      text: formatStagedBreadcrumb(activePromptSession.returnSession.breadcrumb),
      source: 'console',
      severity: 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildStagedPromptText(
        activePromptSession.returnSession,
        activePromptSession.returnSession.validChoices,
      ),
      source: 'console',
      severity: 'info',
    })
    return true
  }, [appendEscUserEntry, clearReferenceTransformPrompt, setStagedNavigationSession])

  const handleEscCancelCommand = useCallback(() => {
    if (stepActiveConsolePromptSessionBack()) {
      return
    }
    const activeSession = useConsoleStore.getState().stagedNavigationSession
    const appState = useAppStore.getState()
    const activeReferenceSession = appState.referenceWorkspace.activeReferenceTransformSession
    const activeContentObjectSession =
      appState.referenceWorkspace.activeContentObjectTransformSession
    if (
      activeSession?.scopeId === 'referenceTransformRoot' &&
      activeReferenceSession !== null &&
      !activeReferenceSession.entryActive
    ) {
      if (suppressNextReferenceTransformShellExitRef.current) {
        return
      }
      appendEscUserEntry()
      exitActiveReferenceTransformShell()
      return
    }
    if (
      activeSession?.scopeId === 'contentObjectTransformRoot' &&
      activeContentObjectSession !== null &&
      !activeContentObjectSession.entryActive
    ) {
      appendEscUserEntry()
      exitActiveContentObjectTransformShell()
      return
    }
    if (
      activeSession?.scopeId === 'contentAssemblySelected' ||
      activeSession?.scopeId === 'contentComponentSelected' ||
      activeSession?.scopeId === 'contentObjectSelected'
    ) {
      appendEscUserEntry()
      setStagedNavigationSession(null)
      appState.setWorkspaceExplicitSelection({
        selectedTarget: null,
        explicitSelectedTargets: [],
        selectionAnchorTarget: null,
      })
      appState.selectPart(null)
      appState.requestConsoleContextSync('surface-clear')
      return
    }
    if (
      activeSession?.scopeId === 'referencesSelected' ||
      activeSession?.scopeId === 'referenceCategorySelected' ||
      activeSession?.scopeId === 'referenceSelected'
    ) {
      appendEscUserEntry()
      setStagedNavigationSession(null)
      appState.setWorkspaceExplicitSelection({
        selectedTarget: null,
        explicitSelectedTargets: [],
        selectionAnchorTarget: null,
      })
      appState.selectPart(null)
      appState.requestConsoleContextSync('surface-clear')
      return
    }
    if (
      activeReferenceSession?.entryActive === true &&
      (activeSession?.scopeId === 'referenceTransformSettingsRoot' ||
        activeSession?.scopeId === 'referenceTransformSpaceRoot' ||
        isReferenceTransformSnapScope(activeSession?.scopeId))
    ) {
      if (stepActiveStagedNavigationSessionOneLevel()) {
        return
      }
    }
    if (
      activeContentObjectSession?.entryActive === true &&
      (activeSession?.scopeId === 'contentObjectTransformSettingsRoot' ||
        activeSession?.scopeId === 'contentObjectTransformSpaceRoot' ||
        isContentObjectTransformSnapScope(activeSession?.scopeId))
    ) {
      if (stepActiveStagedNavigationSessionOneLevel()) {
        return
      }
    }
    if (
      activeReferenceSession?.entryActive === true
    ) {
      cancelActiveReferenceTransformSession()
      return
    }
    if (activeContentObjectSession?.entryActive === true) {
      cancelActiveContentObjectTransformSession()
      return
    }
    if (stepActiveStagedNavigationSessionOneLevel()) {
      return
    }
    setConsoleCameraModeCommand(null)
    const spaghettiState = useSpaghettiStore.getState()
    if (spaghettiState.sketchPlanePickSession !== null) {
      spaghettiState.runSketchPlaneCommand('esc')
      return
    }
    if (spaghettiState.geometrySketchSession?.mode === 'draw') {
      spaghettiState.runGeometrySketchDrawCommand('esc')
    }
  }, [
    appendEscUserEntry,
    cancelActiveContentObjectTransformSession,
    cancelActiveReferenceTransformSession,
    exitActiveContentObjectTransformShell,
    exitActiveReferenceTransformShell,
    setStagedNavigationSession,
    stepActiveConsolePromptSessionBack,
    stepActiveStagedNavigationSessionOneLevel,
  ])

  const primeSketchDrawStagedRootForTyping = useCallback(() => {
    const consoleState = useConsoleStore.getState()
    const spaghettiState = useSpaghettiStore.getState()
    const isSketchDrawIdle =
      spaghettiState.geometrySketchSession?.mode === 'draw' &&
      spaghettiState.geometrySketchSession.activeTool === null
    if (!isSketchDrawIdle || consoleState.stagedNavigationSession !== null) {
      return
    }
    setStagedNavigationSession(
      createSketchDrawRootSession(buildStagedNavigationContextFromStoreState(spaghettiState)),
    )
  }, [setStagedNavigationSession])


  const cycleActiveReferenceTransformModeWithTab = useCallback(() => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    const stagedSession = useConsoleStore.getState().stagedNavigationSession
    const promptSession = useConsoleStore.getState().consolePromptSession
    const isReferenceTransformPrompt =
      promptSession?.kind === 'reference-transform.axis' ||
      promptSession?.kind === 'reference-transform.plane'
    if (
      activeSession === null ||
      (!isReferenceTransformPrompt && stagedSession?.scopeId !== 'referenceTransformRoot')
    ) {
      return false
    }
    const nextMode =
      activeSession.mode === 'translate'
        ? 'rotate'
        : activeSession.mode === 'rotate'
          ? 'scale'
          : 'translate'
    if (activeSession.entryActive || isReferenceTransformPrompt) {
      transitionReferenceTransformAxisPrompt({ mode: nextMode })
    } else {
      appState.beginReferenceTransformEntry(nextMode)
      const nextSession = useAppStore.getState().referenceWorkspace.activeReferenceTransformSession
      useConsoleStore.getState().clearConsolePromptSession()
      getViewer()?.setReferenceTransformSession?.({
        referenceId: activeSession.referenceId,
        mode: nextMode,
        space: activeSession.space,
        entryOrigin: nextSession?.entryOrigin ?? null,
      })
    }
    setStagedNavigationSession(createActiveReferenceTransformRootSession(activeSession.referenceId))
    return true
  }, [
    createActiveReferenceTransformRootSession,
    setStagedNavigationSession,
    transitionReferenceTransformAxisPrompt,
  ])

  const cycleActiveContentObjectTransformModeWithTab = useCallback(() => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeContentObjectTransformSession
    const stagedSession = useConsoleStore.getState().stagedNavigationSession
    if (activeSession === null || stagedSession?.scopeId !== 'contentObjectTransformRoot') {
      return false
    }
    const nextMode =
      activeSession.mode === 'translate'
        ? 'rotate'
        : activeSession.mode === 'rotate'
          ? 'scale'
          : 'translate'
    appState.beginContentObjectTransformEntry(nextMode)
    const nextSession = useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession
    useConsoleStore.getState().clearConsolePromptSession()
    getViewer()?.setContentObjectTransformSession?.({
      objectId: activeSession.objectId,
      mode: nextMode,
      space: activeSession.space,
      entryOrigin: nextSession?.entryOrigin ?? null,
    })
    if (nextMode === 'rotate') {
      getViewer()?.activateRotateCenterHandle?.()
    } else if (nextMode === 'scale') {
      getViewer()?.activateScaleCenterHandle?.()
    } else {
      getViewer()?.activateTranslateCenterHandle?.()
    }
    setStagedNavigationSession(createActiveContentObjectTransformRootSession(activeSession.objectId))
    return true
  }, [
    createActiveContentObjectTransformRootSession,
    setStagedNavigationSession,
  ])

  const handleSubmitCommand = useCallback(
    (inputText: string) => {
      const trimmedInput = inputText.trim().toLowerCase()
      const spaghettiState = useSpaghettiStore.getState()
      const activePromptSession = useConsoleStore.getState().consolePromptSession
      const activeStagedSession = useConsoleStore.getState().stagedNavigationSession
      const stagedContext = buildStagedNavigationContextFromStoreState(spaghettiState)

      if (activePromptSession !== null) {
        const rawToken = inputText.trim()

        if (
          (activePromptSession.kind === 'transform.delete-latest.confirm' ||
            activePromptSession.kind === 'reference-transform.axis' ||
            activePromptSession.kind === 'reference-transform.plane' ||
            activePromptSession.kind === 'content.owner.label') &&
          tryHandleReferenceContentPromptSubmission({
            activePromptSession,
            appendConsoleEntry,
            applyReferenceTransformSpaceShortcut,
            buildFeatureAssistPromptText,
            clearConsolePromptSession: () => useConsoleStore.getState().clearConsolePromptSession(),
            commitActiveReferenceTransformFromConsole,
            createActiveContentObjectTransformRootSession,
            createActiveReferenceTransformRootSession,
            deleteLatestContentObjectTransformEntry,
            deleteLatestReferenceTransformEntry,
            getActiveFeatureAssistDescriptor,
            getAppState: () => useAppStore.getState(),
            getConsolePromptSession: () => useConsoleStore.getState().consolePromptSession,
            getSpaghettiState: () => useSpaghettiStore.getState(),
            getStagedNavigationSession: () => useConsoleStore.getState().stagedNavigationSession,
            getViewer,
            inputText,
            pushCommandHistory,
            setInputText: (text, options) => useConsoleStore.getState().setInputText(text, options),
            setStagedNavigationSession,
            transitionReferenceTransformAxisPrompt,
          })
        ) {
          return
        }

        appendConsoleEntry({
          layer: 'Commands',
          commandLineKind: 'user',
          text: `> ${rawToken}`,
        })
        pushCommandHistory(rawToken)

        if (activePromptSession.kind === 'radio.url') {
          if (!isValidRadioUrl(rawToken)) {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(activePromptSession.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Diagnostics',
              text: `Invalid radio url: ${rawToken}`,
              source: 'console',
              severity: 'warn',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildConsolePromptSessionText(activePromptSession),
              source: 'console',
              severity: 'info',
            })
            useConsoleStore.getState().setInputText(rawToken)
            return
          }

          const commandIdentity = resolveConsoleRadioCommandIdentity({
            kind: 'promptSubmit',
            promptKind: activePromptSession.kind,
          })
          trackRadioCommandIdentity(commandIdentity)
          useAudioSamplerStore.getState().setRadioUrl(rawToken)
          requestRadioRuntimeWarmup(rawToken)
          requestRadioBurst(commandIdentity, 'enter')
          setStagedNavigationSession(activePromptSession.returnSession)
          appendConsoleEntry({
            layer: 'Commands',
            text: formatStagedBreadcrumb(activePromptSession.breadcrumb),
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'App',
            text: `Radio url: ${rawToken}`,
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'App',
            text: 'Radio on',
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'Commands',
            text: buildStagedPromptText(
              activePromptSession.returnSession,
              activePromptSession.returnSession.validChoices,
            ),
            source: 'console',
            severity: 'info',
          })
          return
        }

        const sampleBurstTime = parseRadioSampleBurstTime(rawToken)
        if (sampleBurstTime === null) {
          appendConsoleEntry({
            layer: 'Commands',
            text: formatStagedBreadcrumb(activePromptSession.breadcrumb),
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'Diagnostics',
            text: `Invalid sample burst time: ${rawToken}`,
            source: 'console',
            severity: 'warn',
          })
          appendConsoleEntry({
            layer: 'Commands',
            text: buildConsolePromptSessionText(activePromptSession),
            source: 'console',
            severity: 'info',
          })
          useConsoleStore.getState().setInputText(rawToken)
          return
        }

        const commandIdentity = resolveConsoleRadioCommandIdentity({
          kind: 'promptSubmit',
          promptKind: activePromptSession.kind,
        })
        trackRadioCommandIdentity(commandIdentity)
        useAudioSamplerStore.getState().setSampleBurstTime(sampleBurstTime)
        requestRadioBurst(commandIdentity, 'enter')
        setStagedNavigationSession(activePromptSession.returnSession)
        appendConsoleEntry({
          layer: 'Commands',
          text: formatStagedBreadcrumb(activePromptSession.breadcrumb),
          source: 'console',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'App',
          text: `Sample burst time: ${formatRadioSampleBurstTime(sampleBurstTime)}`,
          source: 'console',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildStagedPromptText(
            activePromptSession.returnSession,
            activePromptSession.returnSession.validChoices,
          ),
          source: 'console',
          severity: 'info',
        })
        return
      }

      const referenceWorkspaceState = useAppStore.getState().referenceWorkspace
      const activeReferenceSession = referenceWorkspaceState.activeReferenceTransformSession
      const activeReferenceId = activeReferenceSession?.referenceId ?? null
      if (
        tryHandleActiveReferenceTransformSubmission({
          activeStagedSession,
          appendConsoleEntry,
          applyReferenceTransformSpaceShortcut,
          cancelActiveReferenceTransformSession,
          commitActiveReferenceTransformFromConsole,
          createActiveReferenceTransformSnapSession,
          dispatchImmediateShortcut,
          featureAssistChoiceMatcher: findFeatureAssistChoiceByInput,
          featureAssistDescriptor,
          getAppState: () => useAppStore.getState(),
          getConsolePromptSession: () => useConsoleStore.getState().consolePromptSession,
          getViewer,
          inputText,
          openReferenceTransformAxisPrompt,
          openReferenceTransformPlanePrompt,
          pushCommandHistory,
          requestRadioBurst,
          resolveFeatureAssistSubmitIdentity,
          setInputText: (text, options) => useConsoleStore.getState().setInputText(text, options),
          setStagedNavigationSession,
        })
      ) {
        return
      }
      if (
        activeReferenceSession !== null &&
        activeReferenceSession.entryActive &&
        !isReferenceTransformSnapScope(activeStagedSession?.scopeId)
      ) {
        const rawToken = inputText.trim()
        const matchedChoice =
          featureAssistDescriptor !== null
            ? findFeatureAssistChoiceByInput(featureAssistDescriptor, inputText)
            : null
        const normalizedReferenceToken = normalizeRadioCommandIdentity(rawToken)
        const submitReferenceTransformCommand = () => {
          const commandIdentity = resolveFeatureAssistSubmitIdentity(rawToken)
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${rawToken}`,
          })
          pushCommandHistory(rawToken)
          requestRadioBurst(commandIdentity, 'enter')
        }

        if (normalizedReferenceToken === 'ESC' || normalizedReferenceToken === 'BACK' || normalizedReferenceToken === 'B') {
          submitReferenceTransformCommand()
          cancelActiveReferenceTransformSession()
          return
        }

        if (normalizedReferenceToken === 'M' || normalizedReferenceToken === 'MOVE') {
          submitReferenceTransformCommand()
          dispatchImmediateShortcut('m')
          return
        }
        if (normalizedReferenceToken === 'R' || normalizedReferenceToken === 'ROTATE') {
          submitReferenceTransformCommand()
          dispatchImmediateShortcut('r')
          return
        }
        if (normalizedReferenceToken === 'S' || normalizedReferenceToken === 'SCALE') {
          submitReferenceTransformCommand()
          dispatchImmediateShortcut('s')
          return
        }
        if (normalizedReferenceToken === 'L' || normalizedReferenceToken === 'LOCAL') {
          applyReferenceTransformSpaceShortcut('local', rawToken)
          return
        }
        if (normalizedReferenceToken === 'W' || normalizedReferenceToken === 'WORLD') {
          applyReferenceTransformSpaceShortcut('world', rawToken)
          return
        }

        const parsedVec3 = parseConsoleVec3Literal(rawToken)
        if (parsedVec3 !== null) {
          const appState = useAppStore.getState()
          getViewer()?.cancelReferenceTransformDrag?.()
          appState.setActiveReferenceTransformHandle(null)
          getViewer()?.clearReferenceTransformHandle?.()
          const nextTransformOverride = applyReferenceTransformVec3Value(
            activeReferenceSession.draftTransform,
            activeReferenceSession.mode,
            parsedVec3,
          )
          appState.setActiveReferenceTransformDraft(nextTransformOverride)
          getViewer()?.setReferenceTransformOverride(
            activeReferenceSession.referenceId,
            nextTransformOverride,
          )
          commitActiveReferenceTransformFromConsole(rawToken)
          return
        }

        if (
          (activeReferenceSession.mode === 'rotate' || activeReferenceSession.mode === 'scale') &&
          parseConsoleSignedFloatLiteral(rawToken) !== null
        ) {
          const scalarValue = parseConsoleSignedFloatLiteral(rawToken)!
          const appState = useAppStore.getState()
          getViewer()?.cancelReferenceTransformDrag?.()
          appState.setActiveReferenceTransformHandle(null)
          getViewer()?.clearReferenceTransformHandle?.()
          const nextTransformOverride = applyReferenceTransformVec3Value(
            activeReferenceSession.draftTransform,
            activeReferenceSession.mode,
            { x: scalarValue, y: scalarValue, z: scalarValue },
          )
          appState.setActiveReferenceTransformDraft(nextTransformOverride)
          getViewer()?.setReferenceTransformOverride(
            activeReferenceSession.referenceId,
            nextTransformOverride,
          )
          commitActiveReferenceTransformFromConsole(rawToken)
          return
        }

        switch (matchedChoice?.canonicalToken) {
          case 'SNAP': {
            submitReferenceTransformCommand()
            const snapSession = createActiveReferenceTransformSnapSession(
              activeReferenceSession.referenceId,
              activeReferenceSession.mode,
            )
            if (snapSession !== null) {
              setStagedNavigationSession(snapSession)
              const snapState =
                useAppStore.getState().referenceWorkspace.transformSnapByReferenceId[
                  activeReferenceSession.referenceId
                ] ?? DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
              useConsoleStore.getState().setInputText(
                formatReferenceTransformSnapValue(
                  getReferenceTransformSnapDriverValue(snapState[activeReferenceSession.mode]),
                ),
                { preserveGuidedReplace: true },
              )
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(snapSession, snapSession.validChoices),
                source: 'console',
                severity: 'info',
              })
            }
            return
          }
          case 'VEC3':
            commitActiveReferenceTransformFromConsole(rawToken)
            return
          case 'X':
          case 'Y':
          case 'Z':
            submitReferenceTransformCommand()
            openReferenceTransformAxisPrompt(matchedChoice.canonicalToken.toLowerCase() as 'x' | 'y' | 'z')
            appendConsoleEntry({
              layer: 'Commands',
              text: buildConsolePromptSessionText(useConsoleStore.getState().consolePromptSession!),
              source: 'console',
              severity: 'info',
            })
            return
          case 'XY':
          case 'XZ':
          case 'YZ':
            submitReferenceTransformCommand()
            openReferenceTransformPlanePrompt(matchedChoice.canonicalToken.toLowerCase() as 'xy' | 'xz' | 'yz')
            appendConsoleEntry({
              layer: 'Commands',
              text: buildConsolePromptSessionText(useConsoleStore.getState().consolePromptSession!),
              source: 'console',
              severity: 'info',
            })
            return
          default:
            break
        }
      }

      if (
        activeReferenceSession !== null &&
        activeReferenceId !== null &&
        activeStagedSession?.scopeId === 'referenceTransformRoot'
      ) {
        if (
          tryHandleReferenceTransformRootShortcut({
            activeReferenceId,
            appendConsoleEntry,
            createActiveReferenceTransformRootSession,
            deleteLatestReferenceTransformEntry,
            inputText,
            pushCommandHistory,
            requestRadioBurst,
            scopedCommandIdentity: resolveConsoleRadioCommandIdentity({
              kind: 'stagedExecute',
              activeScopeId: 'referenceTransformRoot',
              actionId: 'reference.transform.deleteLatest',
            }),
            stagedSession: activeStagedSession,
            setStagedNavigationSession,
          })
        ) {
          return
        }
      }

      const shouldHandleAsStagedNavigation =
        (activeStagedSession !== null && activeStagedSession.scopeId !== 'root') ||
        (
          spaghettiState.sketchPlanePickSession === null &&
          spaghettiState.geometrySketchSession?.mode !== 'draw' &&
          isConsoleStagedNavigationRootToken(inputText)
        )

      if (shouldHandleAsStagedNavigation) {
        const rawToken = inputText.trim()
        const normalizedRawToken = normalizeRadioCommandIdentity(rawToken)
        const appStateForGraphShortcut = useAppStore.getState()
        const workspaceContextTargetForGraphShortcut =
          selectConsoleWorkspaceContextTarget(appStateForGraphShortcut)
        const contextFallbackGraphDocumentId =
          workspaceContextTargetForGraphShortcut !== null &&
          'fallbackGraphDocumentId' in workspaceContextTargetForGraphShortcut
            ? workspaceContextTargetForGraphShortcut.fallbackGraphDocumentId ?? null
            : null
        const directGraphShortcutGraphDocumentId = resolveConsoleActionContext().graphDocumentId
        const isContextScopedGraphShortcut =
          activeStagedSession !== null &&
          (activeStagedSession.scopeId.startsWith('content') ||
            activeStagedSession.scopeId.startsWith('reference') ||
            activeStagedSession.scopeId === 'referencesSelected' ||
            activeStagedSession.scopeId === 'referenceCategorySelected' ||
            activeStagedSession.scopeId === 'referenceSelected' ||
            activeStagedSession.scopeId === 'multiSelectSelected')
        const shouldDirectContextGraphSelection =
          (normalizedRawToken === 'GRAPH' || normalizedRawToken === 'G') &&
          (contextFallbackGraphDocumentId !== null || isContextScopedGraphShortcut) &&
          directGraphShortcutGraphDocumentId !== null &&
          activeStagedSession?.scopeId !== 'graphRoot' &&
          activeStagedSession?.scopeId !== 'graphSelected'
        if (shouldDirectContextGraphSelection) {
          const commandIdentity = resolveConsoleRadioCommandIdentity({
            kind: 'stagedAdvance',
            activeScopeId: activeStagedSession?.scopeId ?? null,
            matchedCanonicalToken: 'GRAPH',
            matchedLabel: 'Graph',
          })
          trackRadioCommandIdentity(commandIdentity)
          graphRootEditorRevealRestoreRef.current = ensureSpaghettiEditorVisibleForGraphRoot(
            directGraphShortcutGraphDocumentId,
          )
          activateConsoleGraphTarget(directGraphShortcutGraphDocumentId, null, {
            strategy: 'open-or-focus',
          })
          const directedGraphHandoff = resolveConsoleWorkspaceContextSync(
            buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
            {
              graphDocumentId: directGraphShortcutGraphDocumentId,
              nodeId: null,
            },
          ).session
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${rawToken}`,
          })
          pushCommandHistory(rawToken)
          if (directedGraphHandoff !== null) {
            setStagedNavigationSession(directedGraphHandoff)
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(directedGraphHandoff.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(
                directedGraphHandoff,
                directedGraphHandoff.validChoices,
              ),
              source: 'console',
              severity: 'info',
            })
          }
          requestRadioBurst(commandIdentity, 'enter')
          return
        }
        if (
          (
            (activeStagedSession === null &&
              isConsoleStagedNavigationRootToken(inputText)) ||
            activeStagedSession?.scopeId === 'root'
          ) &&
          (normalizedRawToken === 'GRAPH' || normalizedRawToken === 'G')
        ) {
          const consoleActionContext = resolveConsoleActionContext()
          graphRootEditorRevealRestoreRef.current = ensureSpaghettiEditorVisibleForGraphRoot(
            consoleActionContext.graphDocumentId,
          )
          if (consoleActionContext.graphDocumentId !== null) {
            activateConsoleGraphTarget(consoleActionContext.graphDocumentId, null, {
              strategy: 'open-or-focus',
            })
          }
        }
        appendConsoleEntry({
          layer: 'Commands',
          commandLineKind: 'user',
          text: `> ${rawToken}`,
        })
        pushCommandHistory(rawToken)
        const stagedResult = submitConsoleStagedNavigationToken(
          activeStagedSession,
          inputText,
          stagedContext,
        )
        if (stagedResult.kind === 'advance') {
          const isObjectLocalViewerNavigation =
            (activeStagedSession?.scopeId === 'contentObjectSelected' &&
              (stagedResult.session.scopeId === 'contentObjectZoomRoot' ||
                stagedResult.session.scopeId === 'contentObjectTransformRoot')) ||
            ((activeStagedSession?.scopeId === 'contentObjectZoomRoot' ||
              activeStagedSession?.scopeId === 'contentObjectTransformRoot') &&
              stagedResult.session.scopeId === 'contentObjectSelected')
          const commandIdentity = resolveConsoleRadioCommandIdentity({
            kind: 'stagedAdvance',
            activeScopeId: activeStagedSession?.scopeId ?? null,
            matchedCanonicalToken: stagedResult.matchedChoice.canonicalToken,
            matchedLabel: stagedResult.matchedChoice.label,
          })
          trackRadioCommandIdentity(commandIdentity)
          requestRadioBurst(commandIdentity, 'enter')
          if (stagedResult.session.scopeId === 'referencesSelected') {
            const appState = useAppStore.getState()
            if (
              stagedResult.matchedChoice.canonicalToken === 'REFERENCES' ||
              (activeStagedSession?.scopeId === 'referenceCategorySelected' &&
                stagedResult.matchedChoice.canonicalToken === 'BACK')
            ) {
              commitWorkspaceTargetSelection(
                {
                  setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
                  selectPart: appState.selectPart,
                  requestConsoleContextSync: appState.requestConsoleContextSync,
                },
                {
                  kind: 'assembly',
                  assemblyId: REFERENCE_ROOT_ROW_ID,
                },
                {
                  selectedPartKey: null,
                },
              )
            }
          }
          if (
            (activeStagedSession?.scopeId === 'contentAssemblySelected' ||
              activeStagedSession?.scopeId === 'contentComponentSelected' ||
              activeStagedSession?.scopeId === 'contentObjectSelected') &&
            stagedResult.matchedChoice.canonicalToken === 'BACK'
          ) {
            const appState = useAppStore.getState()
            appState.setWorkspaceExplicitSelection({
              selectedTarget: null,
              explicitSelectedTargets: [],
              selectionAnchorTarget: null,
            })
            appState.selectPart(null)
          }
          if (
            activeStagedSession?.scopeId === 'referencesSelected' &&
            stagedResult.matchedChoice.canonicalToken === 'BACK'
          ) {
            const appState = useAppStore.getState()
            appState.setWorkspaceExplicitSelection({
              selectedTarget: null,
              explicitSelectedTargets: [],
              selectionAnchorTarget: null,
            })
            appState.selectPart(null)
          }
          if (
            stagedResult.session.scopeId === 'referenceCategorySelected' &&
            typeof stagedResult.selections.referenceCategoryId === 'string'
          ) {
            const appState = useAppStore.getState()
            commitWorkspaceTargetSelection(
              {
                setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
                selectPart: appState.selectPart,
                requestConsoleContextSync: appState.requestConsoleContextSync,
              },
              {
                kind: 'component',
                componentId: buildReferenceCategoryRowId(
                  stagedResult.selections.referenceCategoryId as any,
                ),
              },
              {
                selectedPartKey: null,
              },
            )
          }
          if (
            stagedResult.session.scopeId === 'referenceSelected' &&
            typeof stagedResult.selections.referenceId === 'string'
          ) {
            const appState = useAppStore.getState()
            commitWorkspaceTargetSelection(
              {
                setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
                selectPart: appState.selectPart,
                requestConsoleContextSync: appState.requestConsoleContextSync,
              },
              {
                kind: 'object',
                objectId: buildImportedReferenceRowId(stagedResult.selections.referenceId),
              },
              {
                selectedPartKey: null,
              },
            )
          }
          if (stagedResult.session.scopeId === 'contentObjectTransformRoot') {
            const appState = useAppStore.getState()
            const selectedTarget = appState.workspaceSelection.selectedTarget
            if (selectedTarget?.kind === 'object') {
              const activeObjectId =
                appState.referenceWorkspace.activeContentObjectTransformSession?.objectId ?? null
              if (activeObjectId !== selectedTarget.objectId) {
                appState.beginContentObjectTransformShell(selectedTarget.objectId)
              }
            }
          }
          if (
            activeStagedSession?.selections.selectedNodeId !== null &&
            stagedResult.selections.selectedNodeId === null &&
            !isObjectLocalViewerNavigation &&
            stagedResult.selections.graphDocumentId !== null
          ) {
            selectTargetIntent(buildWorkspaceIntentDepsFromStoreState(), {
              kind: 'graph-document',
              graphDocumentId: stagedResult.selections.graphDocumentId,
            })
          } else if (
            stagedResult.selections.selectedNodeId !== null &&
            !isObjectLocalViewerNavigation &&
            stagedResult.selections.graphDocumentId !== null
          ) {
            activateConsoleGraphTarget(
              stagedResult.selections.graphDocumentId,
              stagedResult.selections.selectedNodeId,
              {
                strategy: 'open-or-focus',
              },
            )
          } else if (stagedResult.selections.graphDocumentId !== null) {
            if (!isObjectLocalViewerNavigation) {
              activateConsoleGraphTarget(stagedResult.selections.graphDocumentId, null, {
                strategy: 'open-or-focus',
              })
            }
          }
          if (
            activeStagedSession?.scopeId === 'graphSelected' &&
            stagedResult.validChoices.every((choice) => choice.canonicalToken === 'BACK') &&
            stagedResult.selections.graphDocumentId !== null
          ) {
            const missingNodeRequest =
              stagedResult.session.scopeId === 'graphSketchList'
                ? {
                    nodeType: 'Geometry/Sketch' as const,
                    labelPrefix: 'sketch' as const,
                  }
                : stagedResult.session.scopeId === 'graphExtrudeList'
                  ? {
                      nodeType: 'Geometry/Extrude' as const,
                      labelPrefix: 'extrude' as const,
                    }
                  : stagedResult.session.scopeId === 'graphOutputPreviewList'
                    ? {
                        nodeType: 'System/OutputPreview' as const,
                        labelPrefix: 'outputPreview' as const,
                      }
                    : null
            if (missingNodeRequest !== null) {
              const createdNode = createMissingGraphNodeInGraphDocument(
                stagedResult.selections.graphDocumentId,
                missingNodeRequest.nodeType,
                missingNodeRequest.labelPrefix,
              )
              if (createdNode !== null) {
              const resumedResult = submitConsoleStagedNavigationToken(
                activeStagedSession,
                inputText,
                createdNode.stagedContext,
              )
              if (resumedResult.kind === 'advance') {
                setStagedNavigationSession(resumedResult.session)
                const preAutoBreadcrumb =
                  resumedResult.autoSelections.length === 0
                    ? resumedResult.breadcrumb
                    : resumedResult.breadcrumb.slice(
                        0,
                        Math.max(0, resumedResult.breadcrumb.length - resumedResult.autoSelections.length),
                      )
                appendConsoleEntry({
                  layer: 'Commands',
                  text: formatStagedBreadcrumb(preAutoBreadcrumb),
                  source: 'console',
                  severity: 'info',
                })
                appendConsoleEntry({
                  layer: 'App',
                  text: `Created ${createdNode.nodeLabel}`,
                  source: 'console',
                  severity: 'info',
                })
                resumedResult.autoSelections.forEach((choice) => {
                  appendConsoleEntry({
                    layer: 'Commands',
                    text: `Auto-selected ${choice.label}`,
                    source: 'console',
                    severity: 'info',
                  })
                })
                if (resumedResult.autoSelections.length > 0) {
                  appendConsoleEntry({
                    layer: 'Commands',
                    text: formatStagedBreadcrumb(resumedResult.breadcrumb),
                    source: 'console',
                    severity: 'info',
                  })
                }
                appendConsoleEntry({
                  layer: 'Commands',
                  text: buildStagedPromptText(resumedResult.session, resumedResult.validChoices),
                  source: 'console',
                  severity: 'info',
                })
                return
              }
            }
            }
          }
          if (
            activeStagedSession?.scopeId === 'sketchDrawZoomRoot' &&
            stagedResult.matchedChoice.canonicalToken === 'BACK'
          ) {
            setStagedNavigationSession(null)
            return
          }
          setStagedNavigationSession(stagedResult.session)
          const stagedSnapMode = getReferenceTransformSnapScopeMode(stagedResult.session.scopeId)
          if (stagedSnapMode !== null && typeof stagedResult.selections.referenceId === 'string') {
            const snapState =
              useAppStore.getState().referenceWorkspace.transformSnapByReferenceId[
                stagedResult.selections.referenceId
              ] ?? DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
            const stagedSnapAxis = getReferenceTransformSnapScopeAxis(stagedResult.session.scopeId)
            useConsoleStore
              .getState()
              .setInputText(
                formatReferenceTransformSnapValue(
                  stagedSnapAxis === null
                    ? getReferenceTransformSnapDriverValue(snapState[stagedSnapMode])
                    : getReferenceTransformSnapAxisValue(snapState[stagedSnapMode], stagedSnapAxis),
                ),
                { preserveGuidedReplace: true },
              )
          }
          const preAutoBreadcrumb =
            stagedResult.autoSelections.length === 0
              ? stagedResult.breadcrumb
              : stagedResult.breadcrumb.slice(
                  0,
                  Math.max(0, stagedResult.breadcrumb.length - stagedResult.autoSelections.length),
                )
          appendConsoleEntry({
            layer: 'Commands',
            text: formatStagedBreadcrumb(preAutoBreadcrumb),
            source: 'console',
            severity: 'info',
          })
          stagedResult.autoSelections.forEach((choice) => {
            appendConsoleEntry({
              layer: 'Commands',
              text: `Auto-selected ${choice.label}`,
              source: 'console',
              severity: 'info',
            })
          })
          if (stagedResult.autoSelections.length > 0) {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
          }
          appendConsoleEntry({
            layer: 'Commands',
            text: buildStagedPromptText(stagedResult.session, stagedResult.validChoices),
            source: 'console',
            severity: 'info',
          })
          return
        }
        if (stagedResult.kind === 'execute') {
          const commandIdentity = resolveConsoleRadioCommandIdentity({
            kind: 'stagedExecute',
            activeScopeId: activeStagedSession?.scopeId ?? null,
            actionId: stagedResult.actionId,
          })
          trackRadioCommandIdentity(commandIdentity)
          if (
            tryHandleContentOwnerPromptAction({
              appendConsoleEntry,
              buildStagedNavigationContextFromStoreState,
              commandIdentity,
              getAppState: () => useAppStore.getState(),
              getSpaghettiState: () => useSpaghettiStore.getState(),
              requestRadioBurst,
              setConsolePromptSession,
              setStagedNavigationSession,
              stagedResult,
            })
          ) {
            return
          }
          if (
            tryHandleReferenceContentExecuteAction({
              activeReferenceSession,
              appendConsoleEntry,
              buildFeatureAssistPromptText,
              commandIdentity,
              createActiveContentObjectTransformRootSession,
              createActiveContentObjectTransformSnapSession,
              createActiveReferenceTransformRootSession,
              createActiveReferenceTransformSnapSession,
              createDeleteLatestTransformConfirmPromptSession,
              deleteLatestContentObjectTransformEntry,
              deleteLatestReferenceTransformEntry,
              getActiveFeatureAssistDescriptor,
              getAppState: () => useAppStore.getState(),
              getSpaghettiState: () => useSpaghettiStore.getState(),
              getStagedNavigationSession: () => useConsoleStore.getState().stagedNavigationSession,
              getViewer,
              inputText: rawToken,
              requestRadioBurst,
              setConsolePromptSession,
              setStagedNavigationSession,
              stagedResult,
            })
          ) {
            return
          }
          if (
            stagedResult.actionId === 'radio.on' ||
            stagedResult.actionId === 'radio.off' ||
            stagedResult.actionId === 'radio.randomizeSampleTimes' ||
            stagedResult.actionId === 'radio.openToolbar' ||
            stagedResult.actionId === 'radio.closeToolbar'
          ) {
            let radioStateAfterAction = null as ReturnType<typeof useAudioSamplerStore.getState> | null
            const sketchDrawResumeSession =
              isSketchDrawLocalStagedScope(activeStagedSession) ? activeStagedSession : null
            const returnToSketchDrawAfterRadio = spaghettiState.geometrySketchSession?.mode === 'draw'
            if (stagedResult.actionId === 'radio.on') {
              if (returnToSketchDrawAfterRadio) {
                setStagedNavigationSession(sketchDrawResumeSession)
              } else {
                enterGuidedRootSession()
              }
              useAudioSamplerStore.getState().turnRadioOn()
              radioStateAfterAction = useAudioSamplerStore.getState()
              requestRadioRuntimeWarmup(radioStateAfterAction.sourceUrl)
            } else if (stagedResult.actionId === 'radio.off') {
              if (returnToSketchDrawAfterRadio) {
                setStagedNavigationSession(sketchDrawResumeSession)
              } else {
                enterGuidedRootSession()
              }
              useAudioSamplerStore.getState().turnRadioOff()
            } else if (stagedResult.actionId === 'radio.openToolbar') {
              setStagedNavigationSession(stagedResult.session)
              useAudioSamplerStore.getState().openRadioToolbar()
            } else if (stagedResult.actionId === 'radio.closeToolbar') {
              setStagedNavigationSession(stagedResult.session)
              useAudioSamplerStore.getState().closeRadioToolbar()
            } else {
              setStagedNavigationSession(stagedResult.session)
              useAudioSamplerStore.getState().randomizeSampleTimes()
            }
            requestRadioBurst(commandIdentity, 'enter')
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'App',
              text:
                stagedResult.actionId === 'radio.on'
                  ? 'Radio on'
                  : stagedResult.actionId === 'radio.off'
                    ? 'Radio off'
                    : stagedResult.actionId === 'radio.openToolbar'
                      ? 'Radio toolbar opened'
                      : stagedResult.actionId === 'radio.closeToolbar'
                        ? 'Radio toolbar closed'
                        : 'randomized sample times',
              source: 'console',
              severity: 'info',
            })
            if (stagedResult.actionId === 'radio.on' && radioStateAfterAction !== null) {
              appendConsoleEntry({
                layer: 'App',
                text: `Radio url: ${radioStateAfterAction.sourceUrl}`,
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'App',
                text: `Sample burst time: ${radioStateAfterAction.sampleBurstTime}`,
                source: 'console',
                severity: 'info',
              })
            }
            if (stagedResult.actionId === 'radio.on' || stagedResult.actionId === 'radio.off') {
              if (returnToSketchDrawAfterRadio) {
                if (sketchDrawResumeSession !== null) {
                  appendConsoleEntry({
                    layer: 'Commands',
                    text: buildStagedPromptText(
                      sketchDrawResumeSession,
                      sketchDrawResumeSession.validChoices,
                    ),
                    source: 'console',
                    severity: 'info',
                  })
                } else {
                  const nextDescriptor = getActiveFeatureAssistDescriptor({
                    sketchPlanePickSession: useSpaghettiStore.getState().sketchPlanePickSession,
                    geometrySketchSession: useSpaghettiStore.getState().geometrySketchSession,
                    referenceWorkspace: useAppStore.getState().referenceWorkspace,
                    stagedNavigationSession: useConsoleStore.getState().stagedNavigationSession,
                  })
                  if (nextDescriptor !== null) {
                    appendConsoleEntry({
                      layer: 'Commands',
                      text: buildFeatureAssistPromptText(nextDescriptor),
                      source: 'console',
                      severity: 'info',
                    })
                  }
                }
              } else {
                appendConsoleEntry({
                  layer: 'Commands',
                  text: 'Returned to root',
                  source: 'console',
                  severity: 'info',
                })
                appendConsoleEntry({
                  layer: 'Commands',
                  text: ROOT_PROMPT_TEXT,
                  source: 'console',
                  severity: 'info',
                })
              }
            } else {
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
                source: 'console',
                severity: 'info',
              })
            }
            return
          }
          if (
            stagedResult.actionId === 'workspace.viewport.split.top' ||
            stagedResult.actionId === 'workspace.viewport.split.right' ||
            stagedResult.actionId === 'workspace.viewport.split.bottom' ||
            stagedResult.actionId === 'workspace.viewport.split.left'
          ) {
            const splitDockSide =
              stagedResult.actionId === 'workspace.viewport.split.top'
                ? 'top'
                : stagedResult.actionId === 'workspace.viewport.split.right'
                  ? 'right'
                  : stagedResult.actionId === 'workspace.viewport.split.bottom'
                    ? 'bottom'
                    : 'left'

            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })

            const runtimeGuard = resolveWorkspaceModeRuntimeGuard(stagedResult, 'split', {
              actionLabel: 'Workspace split',
              missingTargetDiagnostic: 'Workspace split target is no longer available',
            })
            if (runtimeGuard === null) {
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            const { workspaceState, targetSlot } = runtimeGuard

            const sourceViewer =
              targetSlot.surfaceKind === 'modelViewer' ? getViewer(targetSlot.surfaceInstanceId) : null
            const sourceCameraPose =
              targetSlot.surfaceKind === 'modelViewer'
                ? typeof sourceViewer?.getCameraPose === 'function'
                  ? sourceViewer.getCameraPose()
                  : getLatestViewerCameraPose(targetSlot.surfaceInstanceId)
                : null
            const nextSlotId = splitViewportSlot(targetSlot.slotId, splitDockSide, {
              surfaceKind: targetSlot.surfaceKind,
            })
            if (targetSlot.surfaceKind === 'modelViewer' && sourceCameraPose !== null) {
              restoreViewerCameraPose(targetSlot.surfaceInstanceId, sourceCameraPose)
            }
            if (targetSlot.surfaceKind === 'modelViewer' && nextSlotId !== null && sourceCameraPose !== null) {
              const nextSlot = useWorkspaceStore.getState().viewportSlotsById[nextSlotId] ?? null
              if (nextSlot !== null) {
                restoreViewerCameraPose(nextSlot.surfaceInstanceId, sourceCameraPose)
              }
            }

            const refreshedWorkspaceState = useWorkspaceStore.getState()
            const nextSlot = nextSlotId === null ? null : refreshedWorkspaceState.viewportSlotsById[nextSlotId] ?? null
            const nextSession =
              nextSlot === null
                ? stagedResult.session
                : createWorkspaceModeViewportSelectedSession(
                    nextSlot.surfaceInstanceId,
                    getWorkspaceViewportDisplayLabel(
                      refreshedWorkspaceState.viewportSlotsById,
                      refreshedWorkspaceState.primaryViewportId,
                      nextSlot.surfaceInstanceId,
                    ) ?? getWorkspaceViewportSurfaceLabel(nextSlot.surfaceKind),
                    {
                      workspaceViewportOptions: buildConsoleWorkspaceViewportOptions(
                        refreshedWorkspaceState.viewportSlotsById,
                        refreshedWorkspaceState.primaryViewportId,
                        refreshedWorkspaceState.detachedSlotSurfaceById,
                      ),
                    },
                  )

            setStagedNavigationSession(nextSession)
            appendConsoleEntry({
              layer: 'App',
              text: `${
                getWorkspaceViewportDisplayLabel(
                  workspaceState.viewportSlotsById,
                  workspaceState.primaryViewportId,
                  targetSlot.surfaceInstanceId,
                ) ?? getWorkspaceViewportSurfaceLabel(targetSlot.surfaceKind)
              } split ${splitDockSide}`,
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(nextSession, nextSession.validChoices),
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          const workspaceViewportTypePrefix = 'workspace.viewport.type.'
          if (stagedResult.actionId.startsWith(workspaceViewportTypePrefix)) {
            const nextSurfaceKind = parseWorkspaceSurfaceKind(
              stagedResult.actionId.slice(workspaceViewportTypePrefix.length),
            )

            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })

            const runtimeGuard = resolveWorkspaceModeRuntimeGuard(stagedResult, 'viewportType', {
              actionLabel: 'Workspace viewport type',
              missingTargetDiagnostic: 'Workspace viewport type target is no longer available',
            })
            if (runtimeGuard === null) {
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            const { workspaceState, targetSlot } = runtimeGuard

            if (nextSurfaceKind === null) {
              setStagedNavigationSession(stagedResult.session)
              appendConsoleEntry({
                layer: 'Diagnostics',
                text: 'Workspace viewport type is not available here',
                source: 'console',
                severity: 'warn',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            }

            if (
              targetSlot.slotId === defaultPrimaryViewportSlotId &&
              !workspacePrimarySlotSupportsSurfaceKind(nextSurfaceKind)
            ) {
              setStagedNavigationSession(stagedResult.session)
              appendConsoleEntry({
                layer: 'Diagnostics',
                text: 'Primary viewport type changes are not available for that surface here',
                source: 'console',
                severity: 'warn',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            }

            if (targetSlot.surfaceKind === nextSurfaceKind) {
              setStagedNavigationSession(stagedResult.session)
              appendConsoleEntry({
                layer: 'App',
                text: `${
                  getWorkspaceViewportDisplayLabel(
                    workspaceState.viewportSlotsById,
                    workspaceState.primaryViewportId,
                    targetSlot.surfaceInstanceId,
                  ) ?? getWorkspaceViewportSurfaceLabel(targetSlot.surfaceKind)
                } already uses ${getWorkspaceViewportSurfaceLabel(nextSurfaceKind)}`,
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            }

            if (
              targetSlot.surfaceKind === 'browser' &&
              Object.values(workspaceState.viewportSlotsById).filter((slot) => slot.surfaceKind === 'browser')
                .length <= 1 &&
              workspaceState.browserShell.isViewportSplit
            ) {
              setBrowserViewportSplit(false)
            }
            const nextSurfaceInstanceId =
              nextSurfaceKind === 'spaghettiEditor'
                ? resolveEditorSurfaceInstanceIdForSlotSwitch(targetSlot)
                : null
            if (nextSurfaceKind === 'spaghettiEditor' && nextSurfaceInstanceId === null) {
              setStagedNavigationSession(stagedResult.session)
              appendConsoleEntry({
                layer: 'Diagnostics',
                text: 'Spaghetti Editor is not available here because no graph editor viewport could be prepared',
                source: 'console',
                severity: 'warn',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            const isDestructiveSpaghettiReplace =
              targetSlot.surfaceKind === 'spaghettiEditor' && nextSurfaceKind !== 'spaghettiEditor'
            setViewportSlotSurfaceKind(targetSlot.slotId, nextSurfaceKind, {
              ...(nextSurfaceInstanceId === null ? {} : { surfaceInstanceId: nextSurfaceInstanceId }),
              ...(isDestructiveSpaghettiReplace
                ? { discardRetainedSurfaceKinds: ['spaghettiEditor' as const] }
                : {}),
            })
            if (isDestructiveSpaghettiReplace) {
              closeEditorViewport(targetSlot.surfaceInstanceId)
            }

            const refreshedWorkspaceState = useWorkspaceStore.getState()
            const refreshedTargetSlot =
              refreshedWorkspaceState.viewportSlotsById[targetSlot.slotId] ?? null
            const nextViewportLabel =
              refreshedTargetSlot === null
                ? getWorkspaceViewportSurfaceLabel(nextSurfaceKind)
                : getWorkspaceViewportDisplayLabel(
                    refreshedWorkspaceState.viewportSlotsById,
                    refreshedWorkspaceState.primaryViewportId,
                    refreshedTargetSlot.surfaceInstanceId,
                  ) ?? getWorkspaceViewportSurfaceLabel(nextSurfaceKind)
            const nextSession = {
              ...stagedResult.session,
              breadcrumb: ['Root', 'Workspace Modes', nextViewportLabel, 'Viewport Type Menu'],
              selections: {
                ...stagedResult.session.selections,
                workspaceViewportId: refreshedTargetSlot?.surfaceInstanceId ?? null,
              },
            }

            setStagedNavigationSession(nextSession)
            appendConsoleEntry({
              layer: 'App',
              text: `${nextViewportLabel} switched to ${getWorkspaceViewportSurfaceLabel(nextSurfaceKind)}`,
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(nextSession, nextSession.validChoices),
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          if (stagedResult.actionId === 'workspace.viewport.openInNewBrowser') {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })

            const runtimeGuard = resolveWorkspaceModeRuntimeGuard(stagedResult, 'popout', {
              actionLabel: 'Open In New Browser',
              missingTargetDiagnostic: 'Workspace Open In New Browser target is no longer available',
            })
            if (runtimeGuard === null) {
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            const { workspaceState, targetSlot } = runtimeGuard

            if (targetSlot.surfaceKind === 'modelViewer') {
              const detachedSurface = createDetachedViewportSurfaceCopy(
                targetSlot.surfaceInstanceId,
                'popout',
              )
              if (detachedSurface !== null) {
                const sourceViewer = getViewer(targetSlot.surfaceInstanceId)
                const sourceCameraPose =
                  typeof sourceViewer?.getCameraPose === 'function'
                    ? sourceViewer.getCameraPose()
                    : getLatestViewerCameraPose(targetSlot.surfaceInstanceId)
                if (sourceCameraPose !== null) {
                  restoreViewerCameraPose(detachedSurface.surfaceInstanceId, sourceCameraPose)
                }
              }
            } else if (targetSlot.surfaceKind === 'browser') {
              setIsBrowserPoppedOut(true)
            } else {
              popoutWorkspaceSurface(targetSlot.surfaceInstanceId)
            }

            setStagedNavigationSession(stagedResult.session)
            appendConsoleEntry({
              layer: 'App',
              text: `${
                getWorkspaceViewportDisplayLabel(
                  workspaceState.viewportSlotsById,
                  workspaceState.primaryViewportId,
                  targetSlot.surfaceInstanceId,
                ) ?? getWorkspaceViewportSurfaceLabel(targetSlot.surfaceKind)
              } opened in new browser`,
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          if (stagedResult.actionId === 'workspace.viewport.float') {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })

            const runtimeGuard = resolveWorkspaceModeRuntimeGuard(stagedResult, 'float', {
              actionLabel: 'Workspace float',
              missingTargetDiagnostic: 'Workspace float target is no longer available',
            })
            if (runtimeGuard === null) {
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            const { workspaceState, targetSlot } = runtimeGuard

            if (targetSlot.surfaceKind === 'browser') {
              if (
                Object.values(workspaceState.viewportSlotsById).filter((slot) => slot.surfaceKind === 'browser')
                  .length <= 1
              ) {
                setBrowserViewportSplit(false)
              }
              setBrowserFloatingSize(defaultBrowserFloatingSize)
              setBrowserFloatingPosition(defaultBrowserFloatingPosition)
              floatWorkspaceSurface(targetSlot.surfaceInstanceId)
            } else if (targetSlot.surfaceKind === 'modelViewer') {
              detachViewportSlotSurface(targetSlot.slotId, 'floating')
              setActiveViewerViewportId(targetSlot.surfaceInstanceId)
              useAppStore.getState().setActiveSurface('viewer')
            } else {
              floatWorkspaceSurface(targetSlot.surfaceInstanceId)
            }

            setStagedNavigationSession(stagedResult.session)
            appendConsoleEntry({
              layer: 'App',
              text: `${
                getWorkspaceViewportDisplayLabel(
                  workspaceState.viewportSlotsById,
                  workspaceState.primaryViewportId,
                  targetSlot.surfaceInstanceId,
                ) ?? getWorkspaceViewportSurfaceLabel(targetSlot.surfaceKind)
              } floated`,
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          if (stagedResult.actionId === 'workspace.viewport.close') {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })

            const runtimeGuard = resolveWorkspaceModeRuntimeGuard(stagedResult, 'close', {
              actionLabel: 'Workspace close',
              missingTargetDiagnostic: 'Workspace close target is no longer available',
            })
            if (runtimeGuard === null) {
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            const { workspaceState, targetSlot } = runtimeGuard

            const closedViewportLabel =
              getWorkspaceViewportDisplayLabel(
                workspaceState.viewportSlotsById,
                workspaceState.primaryViewportId,
                targetSlot.surfaceInstanceId,
              ) ?? getWorkspaceViewportSurfaceLabel(targetSlot.surfaceKind)

            removeViewportSlot(targetSlot.slotId)
            if (targetSlot.surfaceKind === 'browser') {
              if (
                Object.values(workspaceState.viewportSlotsById).filter((slot) => slot.surfaceKind === 'browser')
                  .length <= 1 &&
                workspaceState.browserShell.isViewportSplit
              ) {
                setBrowserViewportSplit(false)
              }
            } else if (targetSlot.surfaceKind === 'console') {
              switchToDocked(false)
            }

            const refreshedContext = buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState())
            const nextSession = createWorkspaceModesRootSession(refreshedContext)
            setStagedNavigationSession(nextSession)
            appendConsoleEntry({
              layer: 'App',
              text: `${closedViewportLabel} closed`,
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(nextSession, nextSession.validChoices),
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          if (
            stagedResult.actionId === 'sketchdraw.tool.line' ||
            stagedResult.actionId === 'sketchdraw.tool.pline' ||
            stagedResult.actionId === 'sketchdraw.tool.rectangle' ||
            stagedResult.actionId === 'sketchdraw.tool.circle' ||
            stagedResult.actionId === 'sketchdraw.previous' ||
            stagedResult.actionId === 'sketchdraw.delete' ||
            stagedResult.actionId === 'sketchdraw.done' ||
            stagedResult.actionId === 'sketchdraw.back' ||
            stagedResult.actionId === 'sketchdraw.exit'
          ) {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            if (stagedResult.actionId === 'sketchdraw.done') {
              const finishedSketchNodeId =
                useSpaghettiStore.getState().geometrySketchSession?.nodeId ?? null
              if (finishedSketchNodeId !== null) {
                revealFinishedSketch(finishedSketchNodeId)
              }
              setStagedNavigationSession(null)
              useSpaghettiStore.getState().closeGeometrySketchSession()
              const spaghettiState = useSpaghettiStore.getState()
              const resumedHandoff =
                spaghettiState.activeGraphDocumentId.length > 0
                  ? resolveConsoleWorkspaceContextSync(
                      buildStagedNavigationContextFromStoreState(spaghettiState),
                      {
                        graphDocumentId: spaghettiState.activeGraphDocumentId,
                        nodeId: spaghettiState.selectedNodeId,
                      },
                    )
                  : { session: null, selectedLabel: null }
              if (resumedHandoff.session !== null) {
                setStagedNavigationSession(resumedHandoff.session)
                appendConsoleEntry({
                  layer: 'Commands',
                  text: buildStagedPromptText(
                    resumedHandoff.session,
                    resumedHandoff.session.validChoices,
                  ),
                  source: 'console',
                  severity: 'info',
                })
              }
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            setStagedNavigationSession(null)
            const sketchDrawCommand = resolveGeometrySketchDrawCommandFromActionId(
              stagedResult.actionId,
            )
            if (sketchDrawCommand === null) {
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            useSpaghettiStore.getState().runGeometrySketchDrawCommand(sketchDrawCommand)
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          if (
            stagedResult.actionId === 'radio.url' ||
            stagedResult.actionId === 'radio.sampleBurstTime'
          ) {
            const audioSamplerState = useAudioSamplerStore.getState()
            const promptSession: ConsolePromptSession = {
              kind:
                stagedResult.actionId === 'radio.url'
                  ? 'radio.url'
                  : 'radio.sampleBurstTime',
              breadcrumb: stagedResult.breadcrumb,
              label:
                stagedResult.actionId === 'radio.url'
                  ? 'Radio Url'
                  : 'Radio SampleBurstTime',
              prefill:
                stagedResult.actionId === 'radio.url'
                  ? audioSamplerState.sourceUrl
                  : formatRadioSampleBurstTime(audioSamplerState.sampleBurstTime),
              returnSession: stagedResult.session,
            }
            setConsolePromptSession(promptSession)
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildConsolePromptSessionText(promptSession),
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          if (
            stagedResult.actionId === 'content.delete'
          ) {
            const appState = useAppStore.getState()
            const environmentLightId = stagedResult.selections.environmentLightId ?? null
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            if (environmentLightId !== null) {
              const lightLabel =
                useUiPrefsStore
                  .getState()
                  .view.lighting.lights.find((light) => light.id === environmentLightId)?.name ??
                environmentLightId
              const deletedTarget = deleteWorkspaceSelectedEnvironmentLightWithHistory(
                {
                  setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
                  selectLight: useUiPrefsStore.getState().selectLight,
                  deleteLight: useUiPrefsStore.getState().deleteLight,
                  requestConsoleContextSync: appState.requestConsoleContextSync,
                  requestConsoleWorkspaceContextHandoff:
                    appState.requestConsoleWorkspaceContextHandoff,
                },
                {
                  kind: 'environment-light',
                  lightId: environmentLightId,
                },
              )
              appendConsoleEntry({
                layer: 'Browser',
                text:
                  deletedTarget === null
                    ? 'Delete is not available for this environment object'
                    : `Deleted ${lightLabel}`,
                source: 'console',
                severity: deletedTarget === null ? 'warn' : 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            const assemblyId = stagedResult.selections.contentAssemblyId ?? null
            const componentId = stagedResult.selections.contentComponentId ?? null
            const deleteTarget =
              assemblyId !== null
                ? ({ kind: 'assembly', assemblyId } as const)
                : componentId !== null
                  ? ({ kind: 'component', componentId } as const)
                  : null
            if (deleteTarget === null) {
              appendConsoleEntry({
                layer: 'Browser',
                text: 'Delete requires a selected content owner',
                source: 'console',
                severity: 'warn',
              })
              return
            }
            const childCount =
              deleteTarget.kind === 'assembly'
                ? appState.projectContent.assembliesById[deleteTarget.assemblyId]?.childRowIds.length ?? 0
                : appState.projectContent.componentsById[deleteTarget.componentId]?.childObjectIds.length ?? 0
            const label =
              deleteTarget.kind === 'assembly'
                ? appState.projectContent.assembliesById[deleteTarget.assemblyId]?.label ?? deleteTarget.assemblyId
                : appState.projectContent.componentsById[deleteTarget.componentId]?.label ?? deleteTarget.componentId
            if (
              childCount > 0 &&
              typeof window.confirm === 'function' &&
              !window.confirm(`Delete ${label} and its subtree?`)
            ) {
              return
            }
            if (!appState.deleteProjectContentOwner(deleteTarget)) {
              appendConsoleEntry({
                layer: 'Browser',
                text: 'Delete is not available for this content owner',
                source: 'console',
                severity: 'warn',
              })
              return
            }
            appState.requestConsoleContextSync('target-selection')
            appendConsoleEntry({
              layer: 'Browser',
              text: `Deleted ${label}`,
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          if (
            stagedResult.actionId === 'content.visibility.hide' ||
            stagedResult.actionId === 'content.visibility.show'
          ) {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            const environmentLightId = stagedResult.selections.environmentLightId ?? null
            if (environmentLightId !== null) {
              useUiPrefsStore.getState().updateLight(environmentLightId, {
                enabled: stagedResult.actionId === 'content.visibility.show',
              })
              useAppStore.getState().requestConsoleContextSync('target-selection')
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            if (
              setSelectedContentContainerVisibility({
                assemblyId: stagedResult.selections.contentAssemblyId ?? null,
                componentId: stagedResult.selections.contentComponentId ?? null,
                visibilityPartKeys: stagedResult.selections.contentVisibilityPartKeys ?? [],
                visible: stagedResult.actionId === 'content.visibility.show',
              })
            ) {
              requestRadioBurst(commandIdentity, 'enter')
            }
            return
          }
          if (
            stagedResult.actionId === 'reference.explode'
          ) {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            if (explodeSelectedReferenceTarget()) {
              requestRadioBurst(commandIdentity, 'enter')
            }
            return
          }
          if (
            stagedResult.actionId === 'reference.delete' ||
            stagedResult.actionId === 'reference.multiDelete'
          ) {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            if (deleteSelectedReferenceTargets()) {
              requestRadioBurst(commandIdentity, 'enter')
            }
            return
          }
          if (
            stagedResult.actionId === 'reference.hide' ||
            stagedResult.actionId === 'reference.multiHide'
          ) {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            const referenceIds =
              stagedResult.actionId === 'reference.multiHide'
                ? stagedResult.selections.multiSelectReferenceHideIds ?? []
                : typeof stagedResult.selections.referenceId === 'string'
                  ? [stagedResult.selections.referenceId]
                  : []
            const selectTargetAfterHide =
              activeStagedSession?.scopeId === 'referenceHideRoot' &&
              typeof stagedResult.selections.referenceId === 'string'
                ? {
                    kind: 'object' as const,
                    objectId: buildImportedReferenceRowId(stagedResult.selections.referenceId),
                  }
                : null
            if (
              (referenceIds.length > 0 &&
                hideReferenceTargets(referenceIds, {
                  selectTargetAfterHide,
                })) ||
              hideSelectedReferenceTargets()
            ) {
              requestRadioBurst(commandIdentity, 'enter')
            }
            return
          }
          if (stagedResult.actionId === 'reference.multiUnhide') {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            const referenceIds = stagedResult.selections.multiSelectReferenceUnhideIds ?? []
            if (
              (referenceIds.length > 0 && unhideReferenceTargets(referenceIds)) ||
              unhideSelectedReferenceTargets()
            ) {
              requestRadioBurst(commandIdentity, 'enter')
            }
            return
          }
          if (stagedResult.actionId === 'reference.unhideAll') {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            if (unhideAllReferenceTargets()) {
              requestRadioBurst(commandIdentity, 'enter')
            }
            return
          }
          if (
            stagedResult.actionId === 'camera.pan' ||
            stagedResult.actionId === 'camera.orbit' ||
            stagedResult.actionId === 'camera.projection.orthographic' ||
            stagedResult.actionId === 'camera.projection.perspective' ||
            stagedResult.actionId === 'sketchdraw.camera.projection.orthographic' ||
            stagedResult.actionId === 'sketchdraw.camera.projection.perspective' ||
            stagedResult.actionId === 'zoom.model.all' ||
            stagedResult.actionId === 'zoom.model.extents' ||
            stagedResult.actionId === 'zoom.model.previous' ||
            stagedResult.actionId === 'zoom.model.window' ||
            stagedResult.actionId === 'zoom.model.object' ||
            stagedResult.actionId === 'zoom.canvas.all' ||
            stagedResult.actionId === 'zoom.canvas.extents' ||
            stagedResult.actionId === 'zoom.canvas.previous' ||
            stagedResult.actionId === 'zoom.canvas.window' ||
            stagedResult.actionId === 'zoom.canvas.object'
          ) {
            const viewer = getViewer()
            const consoleActionContext = resolveConsoleActionContext(
              stagedResult.selections.graphDocumentId ?? null,
            )
            const commandLabel = formatStagedBreadcrumb(stagedResult.breadcrumb)
            const selectedReferenceId = resolveSelectedReferenceIdForZoom()
            const selectedEnvironmentLightId =
              typeof stagedResult.selections.environmentLightId === 'string' &&
              stagedResult.selections.environmentLightId.length > 0
                ? stagedResult.selections.environmentLightId
                : null
            const executeModelZoomObject = (): boolean => {
              if (stagedResult.session.scopeId === 'sketchDrawZoomRoot') {
                return frameSelectedGeometrySketchCommand()
              }
              if (
                stagedResult.session.scopeId === 'contentAssemblyZoomRoot' ||
                stagedResult.session.scopeId === 'referencesZoomRoot' ||
                stagedResult.session.scopeId === 'referenceCategoryZoomRoot'
              ) {
                if (stagedResult.session.scopeId === 'contentAssemblyZoomRoot') {
                  const selectionSet = resolveSelectionSetForZoom()
                  return frameSelectionSetCommand(selectionSet.partKeys, selectionSet.referenceIds)
                }
                return frameSelectionSetCommand(
                  [],
                  stagedResult.session.selections.referenceZoomIds ?? [],
                )
              }
              if (
                stagedResult.session.scopeId === 'multiSelectZoomRoot' ||
                stagedResult.session.scopeId === 'multiSelectSelected'
              ) {
                const selectionSet = resolveSelectionSetForZoom()
                return frameSelectionSetCommand(selectionSet.partKeys, selectionSet.referenceIds)
              }
              const selectedObjectPartKey = resolveSelectedObjectPartKeyForZoom()
              const zoomAnimationOptions = {
                animate: true,
                durationMs: useUiPrefsStore.getState().cameraShortcutTransitionDurationMs,
              } as const
              if (selectedObjectPartKey !== null) {
                frameSelectedCommand(selectedObjectPartKey, undefined, zoomAnimationOptions)
                return true
              }
              if (selectedEnvironmentLightId !== null) {
                if (
                  frameEnvironmentLightCommand(
                    selectedEnvironmentLightId,
                    undefined,
                    zoomAnimationOptions,
                  )
                ) {
                  return true
                }
                appendConsoleEntry({
                  layer: 'Diagnostics',
                  text: 'Zoom Object could not find the selected environment light',
                  source: 'console',
                  severity: 'warn',
                })
                return false
              }
              if (selectedReferenceId !== null) {
                frameReferenceCommand(selectedReferenceId, undefined, zoomAnimationOptions)
                return true
              }
              appendConsoleEntry({
                layer: 'Diagnostics',
                text: 'Zoom Object requires a selected part, object, or reference',
                source: 'console',
                severity: 'warn',
              })
              return false
            }

            const executeCanvasZoomAction = (
              action: 'all' | 'extents' | 'previous' | 'window' | 'object',
            ): boolean => {
              const workspaceSelectedTarget = useAppStore.getState().workspaceSelection.selectedTarget
              const workspaceSelectedGraphDocumentId =
                workspaceSelectedTarget?.kind === 'graph-document'
                  ? workspaceSelectedTarget.graphDocumentId
                  : workspaceSelectedTarget?.kind === 'graph-node'
                    ? workspaceSelectedTarget.graphDocumentId
                    : null
              const graphDocumentId =
                stagedResult.selections.graphDocumentId ??
                workspaceSelectedGraphDocumentId ??
                useConsoleStore.getState().stagedNavigationSession?.selections.graphDocumentId ??
                consoleActionContext.graphDocumentId
              if (graphDocumentId === null) {
                appendConsoleEntry({
                  layer: 'Diagnostics',
                  text: 'Graph zoom requires an active graph selection',
                  source: 'console',
                  severity: 'warn',
                })
                return false
              }
              const editorViewportId = resolveEditorViewportIdForGraphDocumentFromState(
                useSpaghettiStore.getState(),
                graphDocumentId,
              )
              if (editorViewportId === null) {
                appendConsoleEntry({
                  layer: 'Diagnostics',
                  text: 'Graph zoom requires an open editor viewport for the selected graph',
                  source: 'console',
                  severity: 'warn',
                })
                return false
              }
              const spaghettiState = useSpaghettiStore.getState()
              if (action === 'all' || action === 'extents') {
                spaghettiState.requestEditorViewportCanvasFit(editorViewportId)
                appendConsoleEntry({
                  layer: 'View',
                  text: 'Graph canvas zoom extents',
                  source: 'console',
                  severity: 'info',
                })
                return true
              }
              if (action === 'object') {
                const selectedNodeId =
                  stagedResult.selections.selectedNodeId ??
                  selectEditorViewportSelectedNodeId(spaghettiState, editorViewportId)
                const selectedGraph =
                  selectGraphDocumentById(spaghettiState, graphDocumentId)?.graph ?? null
                const selectedNodeExists =
                  selectedNodeId !== null &&
                  (selectedGraph?.nodes.some((node) => node.nodeId === selectedNodeId) ?? false)
                if (!selectedNodeExists || selectedNodeId === null) {
                  appendConsoleEntry({
                    layer: 'Diagnostics',
                    text: 'Graph canvas Zoom Object requires a selected node in the current graph',
                    source: 'console',
                    severity: 'warn',
                  })
                  return false
                }
                spaghettiState.requestEditorViewportNodeFit(editorViewportId, selectedNodeId)
                appendConsoleEntry({
                  layer: 'View',
                  text: `Graph canvas zoom object: ${selectedNodeId}`,
                  source: 'console',
                  severity: 'info',
                })
                return true
              }
              appendConsoleEntry({
                layer: 'Diagnostics',
                text: `Graph canvas ${action === 'previous' ? 'Zoom Previous' : 'Zoom Window'} is not implemented yet`,
                source: 'console',
                severity: 'warn',
              })
              return false
            }

            appendConsoleEntry({
              layer: 'Commands',
              text: commandLabel,
              source: 'console',
              severity: 'info',
            })

            let actionSucceeded = true
            if (stagedResult.actionId === 'camera.pan' || stagedResult.actionId === 'camera.orbit') {
              setConsoleCameraModeCommand(
                stagedResult.actionId === 'camera.pan' ? 'pan' : 'orbit',
              )
              appendConsoleEntry({
                layer: 'View',
                text:
                  stagedResult.actionId === 'camera.pan'
                    ? 'Pan armed: drag in the viewport with LMB'
                    : 'Orbit armed: drag in the viewport with LMB',
                source: 'console',
                severity: 'info',
              })
            } else if (
              stagedResult.actionId === 'camera.projection.orthographic' ||
              stagedResult.actionId === 'camera.projection.perspective' ||
              stagedResult.actionId === 'sketchdraw.camera.projection.orthographic' ||
              stagedResult.actionId === 'sketchdraw.camera.projection.perspective'
            ) {
              const projectionMode =
                stagedResult.actionId === 'camera.projection.orthographic' ||
                stagedResult.actionId === 'sketchdraw.camera.projection.orthographic'
                  ? 'orthographic'
                  : 'perspective'
              setProjectionModeCommand(projectionMode)
              appendConsoleEntry({
                layer: 'View',
                text: `Projection: ${
                  projectionMode === 'orthographic' ? 'Orthographic' : 'Perspective'
                }`,
                source: 'console',
                severity: 'info',
              })
            } else if (
              stagedResult.actionId === 'zoom.model.all' ||
              stagedResult.actionId === 'zoom.model.extents'
            ) {
              if (stagedResult.session.scopeId === 'sketchDrawZoomRoot') {
                viewer?.frameGeometrySketch()
              } else if (stagedResult.actionId === 'zoom.model.all') {
                frameAllCommand()
              } else {
                frameExtentsCommand()
              }
            } else if (stagedResult.actionId === 'zoom.model.previous') {
              framePreviousCommand()
            } else if (stagedResult.actionId === 'zoom.model.window') {
              setConsoleCameraModeCommand('zoom-window')
              appendConsoleEntry({
                layer: 'View',
                text: 'Zoom Window armed: drag a box in the viewport with LMB',
                source: 'console',
                severity: 'info',
              })
            } else if (stagedResult.actionId === 'zoom.model.object') {
              actionSucceeded = executeModelZoomObject()
            } else {
              const canvasAction =
                stagedResult.actionId === 'zoom.canvas.all'
                  ? 'all'
                  : stagedResult.actionId === 'zoom.canvas.extents'
                    ? 'extents'
                    : stagedResult.actionId === 'zoom.canvas.previous'
                      ? 'previous'
                      : stagedResult.actionId === 'zoom.canvas.window'
                        ? 'window'
                        : 'object'
              actionSucceeded = executeCanvasZoomAction(canvasAction)
            }

            let nextStagedSession: ConsoleStagedNavigationSession | null = stagedResult.session
            if (actionSucceeded && stagedResult.actionId.startsWith('zoom.')) {
              const stagedContext = buildStagedNavigationContextFromStoreState(
                useSpaghettiStore.getState(),
              )
              let unwindSession = stagedResult.session
              while (
                unwindSession.scopeId === 'zoomRoot' ||
                unwindSession.scopeId === 'sketchDrawZoomRoot' ||
                unwindSession.scopeId === 'contentAssemblyZoomRoot' ||
                unwindSession.scopeId === 'contentObjectZoomRoot' ||
                unwindSession.scopeId === 'multiSelectZoomRoot' ||
                unwindSession.scopeId === 'referencesZoomRoot' ||
                unwindSession.scopeId === 'referenceCategoryZoomRoot' ||
                unwindSession.scopeId === 'referenceZoomRoot' ||
                unwindSession.scopeId === 'graphZoomRoot' ||
                unwindSession.scopeId === 'graphZoomCanvas' ||
                unwindSession.scopeId === 'graphZoomModelViewport'
              ) {
                const resumedResult = submitConsoleStagedNavigationToken(
                  unwindSession,
                  'back',
                  stagedContext,
                )
                if (resumedResult.kind !== 'advance') {
                  break
                }
                unwindSession = resumedResult.session
              }
              nextStagedSession = unwindSession
            } else if (
              actionSucceeded &&
              (stagedResult.actionId === 'sketchdraw.camera.projection.orthographic' ||
                stagedResult.actionId === 'sketchdraw.camera.projection.perspective')
            ) {
              nextStagedSession = createSketchDrawRootSession(
                buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
              )
            }

            setStagedNavigationSession(nextStagedSession)
            if (nextStagedSession !== null) {
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(nextStagedSession, nextStagedSession.validChoices),
                source: 'console',
                severity: 'info',
              })
            }
            if (actionSucceeded) {
              requestRadioBurst(commandIdentity, 'enter')
            }
            return
          }
          if (
            (stagedResult.actionId === 'reference.loadAll' ||
              stagedResult.actionId === 'reference.category.loadAll' ||
              stagedResult.actionId === 'reference.loadModel' ||
              stagedResult.actionId === 'content.selectAll') &&
            (stagedResult.actionId === 'reference.loadAll' ||
              stagedResult.actionId === 'reference.category.loadAll' ||
              typeof stagedResult.selections.referenceId === 'string' ||
              stagedResult.actionId === 'content.selectAll')
          ) {
            const appState = useAppStore.getState()
            setStagedNavigationSession(stagedResult.session)
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            if (stagedResult.actionId === 'reference.loadAll') {
              appState.startReferenceLoadBatchForAll()
              appendConsoleEntry({
                layer: 'Browser',
                text: 'Load All: References',
                source: 'console',
                severity: 'info',
              })
            } else if (stagedResult.actionId === 'reference.category.loadAll') {
              const categoryId = stagedResult.selections.referenceCategoryId ?? null
              if (typeof categoryId === 'string') {
                appState.startReferenceLoadBatchForCategory(categoryId as any)
              }
              appendConsoleEntry({
                layer: 'Browser',
                text: `Load All: ${stagedResult.session.breadcrumb.at(-1) ?? 'Category'}`,
                source: 'console',
                severity: 'info',
              })
            } else if (stagedResult.actionId === 'reference.loadModel') {
              const referenceId = stagedResult.selections.referenceId as string
              const nextReferenceSession = resolveConsoleWorkspaceContextSync(
                buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
                buildReferenceConsoleWorkspaceTarget(
                  appState.referenceWorkspace,
                  referenceId,
                  stagedResult.session.breadcrumb.at(-1) ?? referenceId,
                ),
              ).session
              const referenceRuntimeTraits = resolveReferenceRuntimeTraits(appState, referenceId)
              const currentLoadState = referenceRuntimeTraits.loadState
              const isCurrentlyVisible = referenceRuntimeTraits.isVisible
              if (!isCurrentlyVisible && currentLoadState === 'unloaded') {
                appState.retryReferenceItemLoad(referenceId)
              } else {
                appState.setReferenceItemVisibility(referenceId, true)
              }
              if (nextReferenceSession !== null) {
                setStagedNavigationSession(nextReferenceSession)
              }
              appendConsoleEntry({
                layer: 'Browser',
                text: `Load Model: ${stagedResult.session.breadcrumb.at(-1) ?? referenceId}`,
                source: 'console',
                severity: 'info',
              })
            } else if (stagedResult.actionId === 'content.selectAll') {
              const selectedTarget = appState.workspaceSelection.selectedTarget
              const selectedOwnerTarget = resolveWorkspaceSelectedContentOwnerTarget(
                appState,
                selectedTarget,
              )
              if (
                selectedTarget === null ||
                selectedOwnerTarget === null ||
                !selectedOwnerTarget.supportsSelectAll
              ) {
                appendConsoleEntry({
                  layer: 'Browser',
                  text: 'SelectAll requires a selected content parent',
                  source: 'console',
                  severity: 'warn',
                })
              } else {
                appState.setWorkspaceExplicitSelection({
                  selectedTarget,
                  explicitSelectedTargets: [selectedTarget],
                  selectionAnchorTarget: selectedTarget,
                })
                appState.requestConsoleContextSync('target-selection')
                appendConsoleEntry({
                  layer: 'Browser',
                  text: `SelectAll: ${stagedResult.session.breadcrumb.at(-1) ?? 'Content'}`,
                  source: 'console',
                  severity: 'info',
                })
              }
            }
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(
                useConsoleStore.getState().stagedNavigationSession ?? stagedResult.session,
                (useConsoleStore.getState().stagedNavigationSession ?? stagedResult.session).validChoices,
              ),
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          if (
            stagedResult.actionId === 'node.delete' &&
            stagedResult.selections.graphDocumentId !== null &&
            stagedResult.selections.selectedNodeId !== null
          ) {
            const deletedNodeLabel = stagedResult.session.breadcrumb.at(-1) ?? 'node'
            useSpaghettiStore
              .getState()
              .removeGraphNodeWithHistory(stagedResult.selections.selectedNodeId)
            activateConsoleGraphTarget(stagedResult.selections.graphDocumentId, null, {
              strategy: 'open-or-focus',
            })
            const resumedHandoff = resolveConsoleWorkspaceContextSync(
              buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
              {
                graphDocumentId: stagedResult.selections.graphDocumentId,
                nodeId: null,
              },
            )
            if (resumedHandoff.session !== null) {
              setStagedNavigationSession(resumedHandoff.session)
            } else {
              enterGuidedRootSession()
            }
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'App',
              text: `Deleted ${deletedNodeLabel}`,
              source: 'console',
              severity: 'info',
            })
            if (resumedHandoff.session !== null) {
              appendConsoleEntry({
                layer: 'Commands',
                text: formatStagedBreadcrumb(resumedHandoff.session.breadcrumb),
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(
                  resumedHandoff.session,
                  resumedHandoff.session.validChoices,
                ),
                source: 'console',
                severity: 'info',
              })
            }
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          if (
            (stagedResult.actionId === 'graph.editor.collapsed' ||
              stagedResult.actionId === 'graph.editor.essentials' ||
              stagedResult.actionId === 'graph.editor.expanded') &&
            stagedResult.selections.graphDocumentId !== null
          ) {
            setStagedNavigationSession(stagedResult.session)
            const targetViewportId = activateConsoleGraphTarget(
              stagedResult.selections.graphDocumentId,
              null,
              {
                strategy: 'open-or-focus',
              },
            ).editorViewportId
            if (targetViewportId !== null && targetViewportId.length > 0) {
              const presentationMode =
                stagedResult.actionId === 'graph.editor.collapsed'
                  ? 'collapsed'
                  : stagedResult.actionId === 'graph.editor.essentials'
                    ? 'essentials'
                    : 'expanded'
              useSpaghettiStore
                .getState()
                .setEditorViewportPresentationMode(targetViewportId, presentationMode)
            }
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'App',
              text: `Editor mode: ${stagedResult.matchedChoice.label}`,
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          graphRootEditorRevealRestoreRef.current = null
          if (
            (stagedResult.actionId === 'sketch.draw' ||
              stagedResult.actionId === 'sketch.plane') &&
            stagedResult.selections.graphDocumentId !== null &&
            stagedResult.selections.sketchNodeId !== null
          ) {
            clearStagedNavigationSession()
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            if (stagedResult.actionId === 'sketch.plane') {
              startSketchPlaneIntent(
                buildWorkspaceIntentDepsFromStoreState(),
                stagedResult.selections.graphDocumentId,
                stagedResult.selections.sketchNodeId,
              )
              const sketchPlaneDescriptor = getActiveFeatureAssistDescriptor({
                sketchPlanePickSession: useSpaghettiStore.getState().sketchPlanePickSession,
                geometrySketchSession: useSpaghettiStore.getState().geometrySketchSession,
                referenceWorkspace: useAppStore.getState().referenceWorkspace,
                stagedNavigationSession: useConsoleStore.getState().stagedNavigationSession,
              })
              if (sketchPlaneDescriptor !== null) {
                appendConsoleEntry({
                  layer: 'Commands',
                  text: buildFeatureAssistPromptText(sketchPlaneDescriptor),
                  source: 'console',
                  severity: 'info',
                })
              }
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            startSketchDrawIntent(
              buildWorkspaceIntentDepsFromStoreState(),
              stagedResult.selections.graphDocumentId,
              stagedResult.selections.sketchNodeId,
            )
            const sketchDrawSession = createSketchDrawRootSession(
              buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
            )
            setStagedNavigationSession(sketchDrawSession)
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(sketchDrawSession.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(sketchDrawSession, sketchDrawSession.validChoices),
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          enterGuidedRootSession()
          appendConsoleEntry({
            layer: 'Commands',
            text: formatStagedBreadcrumb(stagedResult.breadcrumb),
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'App',
            text: `Staged action: ${stagedResult.matchedChoice.label}`,
            source: 'console',
            severity: 'info',
          })
          requestRadioBurst(commandIdentity, 'enter')
          return
        }
        if (stagedResult.kind === 'invalid') {
          if (
            isSketchDrawLocalStagedScope(activeStagedSession) &&
            spaghettiState.geometrySketchSession?.mode === 'draw'
          ) {
            // Let sketch-draw runtime commands like Enter/Status/Help continue through the
            // draw-session handler instead of treating them as staged-navigation errors.
          } else {
            if (stagedResult.session !== null) {
              setStagedNavigationSession(stagedResult.session)
            }
            appendConsoleEntry({
              layer: 'Commands',
              text:
                stagedResult.breadcrumb.length === 0
                  ? 'Select'
                  : formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Diagnostics',
              text: `Invalid token for current scope: ${rawToken}`,
              source: 'console',
              severity: 'warn',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(stagedResult.session, stagedResult.validChoices),
              source: 'console',
              severity: 'info',
            })
            return
          }
        }
      }
      graphRootEditorRevealRestoreRef.current = null
      const sketchPlanePickSession = useSpaghettiStore.getState().sketchPlanePickSession
      if (sketchPlanePickSession !== null) {
        if (
          sketchPlanePickSession.adjustScope === 'move-snap' ||
          sketchPlanePickSession.adjustScope === 'rotate-snap'
        ) {
          const numericValue = Number(trimmedInput)
          if (Number.isFinite(numericValue)) {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const prefsState = useUiPrefsStore.getState()
            if (sketchPlanePickSession.adjustScope === 'move-snap') {
              prefsState.setSketchPlaneToolbarTranslateSnapValue(numericValue)
              prefsState.setSketchPlaneToolbarTranslateSnapEnabled(true)
            } else {
              prefsState.setSketchPlaneToolbarRotateSnapValue(numericValue)
              prefsState.setSketchPlaneToolbarRotateSnapEnabled(true)
            }
            useSpaghettiStore.getState().runSketchPlaneCommand('back')
            return
          }
          if (trimmedInput === 'on' || trimmedInput === 'off') {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const prefsState = useUiPrefsStore.getState()
            const enabled = trimmedInput === 'on'
            if (sketchPlanePickSession.adjustScope === 'move-snap') {
              prefsState.setSketchPlaneToolbarTranslateSnapEnabled(enabled)
            } else {
              prefsState.setSketchPlaneToolbarRotateSnapEnabled(enabled)
            }
            useSpaghettiStore.getState().runSketchPlaneCommand('back')
            return
          }
        }
        if (
          sketchPlanePickSession.adjustScope === 'move-axis' &&
          (sketchPlanePickSession.activeTransformAxis === 'x' ||
            sketchPlanePickSession.activeTransformAxis === 'y' ||
            sketchPlanePickSession.activeTransformAxis === 'z')
        ) {
          const axis = sketchPlanePickSession.activeTransformAxis
          const pendingConfirmation = sketchPlanePickSession.pendingMoveAxisOffSnapConfirmation
          if (pendingConfirmation !== null) {
            if (trimmedInput === 'confirm') {
              const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${trimmedInput}`,
              })
              pushCommandHistory(trimmedInput)
              requestRadioBurst(commandIdentity, 'enter')
              const store = useSpaghettiStore.getState()
              store.setSketchPlanePickTranslationAxis(axis, pendingConfirmation.value)
              store.acceptActiveSketchPlaneTransformCommand()
              return
            }
            if (trimmedInput === 'deny') {
              const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${trimmedInput}`,
              })
              pushCommandHistory(trimmedInput)
              requestRadioBurst(commandIdentity, 'enter')
              useSpaghettiStore.getState().clearSketchPlaneMoveAxisOffSnapConfirmation()
              return
            }
          }
          const axisValue = parseConsoleSignedFloatLiteral(trimmedInput)
          if (axisValue !== null) {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const prefsState = useUiPrefsStore.getState()
            const snapEnabled = prefsState.sketchPlaneToolbarTranslateSnapEnabled
            const snapValue = prefsState.sketchPlaneToolbarTranslateSnapValue
            const store = useSpaghettiStore.getState()
            if (snapEnabled && snapValue > 0 && !isValueAlignedToStep(axisValue, snapValue)) {
              store.setSketchPlaneMoveAxisOffSnapConfirmation(axis, axisValue, trimmedInput)
              return
            }
            store.clearSketchPlaneMoveAxisOffSnapConfirmation()
            store.setSketchPlanePickTranslationAxis(axis, axisValue)
            store.acceptActiveSketchPlaneTransformCommand()
            return
          }
        }
        if (sketchPlanePickSession.adjustScope === 'move') {
          const moveVector = parseConsoleVec3Literal(trimmedInput)
          if (moveVector !== null) {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const store = useSpaghettiStore.getState()
            store.setSketchPlanePickTranslationAxis('x', moveVector.x)
            store.setSketchPlanePickTranslationAxis('y', moveVector.y)
            store.setSketchPlanePickTranslationAxis('z', moveVector.z)
            store.acceptActiveSketchPlaneTransformCommand()
            return
          }
        }
        if (sketchPlanePickSession.adjustScope === 'rotate') {
          const rotateVector = parseConsoleVec3Literal(trimmedInput)
          if (rotateVector !== null) {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const store = useSpaghettiStore.getState()
            store.setSketchPlanePickRotationAxis('x', rotateVector.x)
            store.setSketchPlanePickRotationAxis('y', rotateVector.y)
            store.setSketchPlanePickRotationAxis('z', rotateVector.z)
            store.acceptActiveSketchPlaneTransformCommand()
            return
          }
        }
        if (
          trimmedInput === 'xy' ||
          trimmedInput === 'xz' ||
          trimmedInput === 'yz' ||
          trimmedInput === 'move' ||
          (sketchPlanePickSession.adjustScope !== 'move' && trimmedInput === 'm') ||
          (sketchPlanePickSession.adjustScope === 'move' && trimmedInput === 'move again') ||
          (sketchPlanePickSession.adjustScope === 'move' && trimmedInput === 'm') ||
          trimmedInput === 'rotate' ||
          trimmedInput === 'r' ||
          trimmedInput === 'done' ||
          trimmedInput === 'd' ||
          trimmedInput === 'confirmtosketch' ||
          trimmedInput === 'c' ||
          ((sketchPlanePickSession.adjustScope === 'move' ||
            sketchPlanePickSession.adjustScope === 'rotate') &&
            trimmedInput === 'snap') ||
          (sketchPlanePickSession.adjustScope === 'move' && trimmedInput === 'x') ||
          (sketchPlanePickSession.adjustScope === 'move' && trimmedInput === 'y') ||
          (sketchPlanePickSession.adjustScope === 'move' && trimmedInput === 'z') ||
          (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'x') ||
          (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'y') ||
          (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'z') ||
          trimmedInput === 'move x' ||
          trimmedInput === 'mx' ||
          trimmedInput === 'move y' ||
          trimmedInput === 'my' ||
          trimmedInput === 'move z' ||
          trimmedInput === 'mz' ||
          trimmedInput === 'rotate x' ||
          trimmedInput === 'rx' ||
          trimmedInput === 'rotate y' ||
          trimmedInput === 'ry' ||
          trimmedInput === 'rotate z' ||
          trimmedInput === 'rz'
        ) {
          const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          requestRadioBurst(commandIdentity, 'enter')
          let command: SketchPlaneCommand
          if (trimmedInput === 'xy' || trimmedInput === 'xz' || trimmedInput === 'yz') {
            command = trimmedInput
          } else if (trimmedInput === 'move again' || trimmedInput === 'm') {
            command = sketchPlanePickSession.adjustScope === 'move' ? 'move-again' : 'move'
          } else if (trimmedInput === 'move') {
            command = 'move'
          } else if (trimmedInput === 'rotate' || trimmedInput === 'r') {
            command = 'rotate'
          } else if (trimmedInput === 'done' || trimmedInput === 'd') {
            command = 'done'
          } else if (trimmedInput === 'confirmtosketch' || trimmedInput === 'c') {
            command = 'confirm-to-sketch'
          } else if (trimmedInput === 'snap') {
            command =
              sketchPlanePickSession.adjustScope === 'rotate' ? 'rotate-snap' : 'move-snap'
          } else if (
            (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'x') ||
            trimmedInput === 'rotate x' ||
            trimmedInput === 'rx'
          ) {
            command = 'rotate-x'
          } else if (
            (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'y') ||
            trimmedInput === 'rotate y' ||
            trimmedInput === 'ry'
          ) {
            command = 'rotate-y'
          } else if (
            (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'z') ||
            trimmedInput === 'rotate z' ||
            trimmedInput === 'rz'
          ) {
            command = 'rotate-z'
          } else if (trimmedInput === 'x' || trimmedInput === 'move x' || trimmedInput === 'mx') {
            command = 'move-x'
          } else if (trimmedInput === 'y' || trimmedInput === 'move y' || trimmedInput === 'my') {
            command = 'move-y'
          } else {
            command = 'move-z'
          }
          useSpaghettiStore.getState().runSketchPlaneCommand(command)
          return
        }
        if (trimmedInput === 'esc' || trimmedInput === 'back' || trimmedInput === 'b') {
          const commandIdentity =
            trimmedInput === 'esc' ? null : resolveFeatureAssistSubmitIdentity(trimmedInput)
          if (trimmedInput !== 'esc') {
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
          }
          pushCommandHistory(trimmedInput)
          requestRadioBurst(commandIdentity, 'enter')
          useSpaghettiStore
            .getState()
            .runSketchPlaneCommand(trimmedInput === 'esc' ? 'esc' : 'back')
          return
        }
      }
      const geometrySketchSession = spaghettiState.geometrySketchSession
      if (geometrySketchSession?.mode === 'draw') {
        const submitDrawCommand = (
          rawCommand: string,
          command: CanonicalGeometrySketchDrawCommand,
        ) => {
          if (rawCommand !== 'esc') {
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${rawCommand}`,
            })
          }
          pushCommandHistory(rawCommand)
          spaghettiState.runGeometrySketchDrawCommand(command)
          useConsoleStore.getState().setInputText('')
          if (
            command === 'esc' ||
            command === 'back' ||
            command === 'x'
          ) {
            const nextDescriptor = getActiveFeatureAssistDescriptor({
              sketchPlanePickSession: useSpaghettiStore.getState().sketchPlanePickSession,
              geometrySketchSession: useSpaghettiStore.getState().geometrySketchSession,
              referenceWorkspace: useAppStore.getState().referenceWorkspace,
              stagedNavigationSession: useConsoleStore.getState().stagedNavigationSession,
            })
            if (nextDescriptor !== null) {
              appendConsoleEntry({
                layer: 'Commands',
                text: buildFeatureAssistPromptText(nextDescriptor),
                source: 'console',
                severity: 'info',
              })
            }
          }
        }

        if (trimmedInput.length === 0) {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: '> enter',
          })
          pushCommandHistory('enter')
          spaghettiState.runGeometrySketchDrawCommand('enter')
          return
        }
        if (trimmedInput === 'radio' || trimmedInput === 'r') {
          const rawToken = inputText.trim()
          const stagedResult = submitConsoleStagedNavigationToken(
            isSketchDrawLocalStagedScope(activeStagedSession) ? activeStagedSession : null,
            rawToken,
            stagedContext,
          )
          if (stagedResult.kind === 'advance' && stagedResult.session.scopeId === 'radioRoot') {
            const commandIdentity = resolveConsoleRadioCommandIdentity({
              kind: 'stagedAdvance',
              activeScopeId: null,
              matchedCanonicalToken: stagedResult.matchedChoice.canonicalToken,
              matchedLabel: stagedResult.matchedChoice.label,
            })
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${rawToken}`,
            })
            pushCommandHistory(rawToken)
            trackRadioCommandIdentity(commandIdentity)
            requestRadioBurst(commandIdentity, 'enter')
            setStagedNavigationSession(stagedResult.session)
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(stagedResult.session, stagedResult.validChoices),
              source: 'console',
              severity: 'info',
            })
            return
          }
        }
        if (geometrySketchSession.activeTool === null) {
          const sketchDrawSession: ConsoleStagedNavigationSession =
            activeStagedSession !== null && isSketchDrawLocalStagedScope(activeStagedSession)
              ? activeStagedSession
              : createSketchDrawRootSession(stagedContext)
          const stagedResult = submitConsoleStagedNavigationToken(
            sketchDrawSession,
            trimmedInput,
            stagedContext,
          )
          if (stagedResult.kind === 'advance') {
            const commandIdentity = resolveConsoleRadioCommandIdentity({
              kind: 'stagedAdvance',
              activeScopeId: sketchDrawSession.scopeId,
              matchedCanonicalToken: stagedResult.matchedChoice.canonicalToken,
              matchedLabel: stagedResult.matchedChoice.label,
            })
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            trackRadioCommandIdentity(commandIdentity)
            requestRadioBurst(commandIdentity, 'enter')
            setStagedNavigationSession(stagedResult.session)
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(stagedResult.session, stagedResult.validChoices),
              source: 'console',
              severity: 'info',
            })
            return
          }
          if (stagedResult.kind === 'execute') {
            const commandIdentity = resolveConsoleRadioCommandIdentity({
              kind: 'stagedExecute',
              activeScopeId: sketchDrawSession.scopeId,
              actionId: stagedResult.actionId,
            })
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            trackRadioCommandIdentity(commandIdentity)
            if (
              stagedResult.actionId === 'sketchdraw.tool.line' ||
              stagedResult.actionId === 'sketchdraw.tool.pline' ||
              stagedResult.actionId === 'sketchdraw.tool.rectangle' ||
              stagedResult.actionId === 'sketchdraw.tool.circle' ||
              stagedResult.actionId === 'sketchdraw.previous' ||
              stagedResult.actionId === 'sketchdraw.delete' ||
              stagedResult.actionId === 'sketchdraw.back' ||
              stagedResult.actionId === 'sketchdraw.exit'
            ) {
              appendConsoleEntry({
                layer: 'Commands',
                text: formatStagedBreadcrumb(stagedResult.breadcrumb),
                source: 'console',
                severity: 'info',
              })
              setStagedNavigationSession(null)
              const sketchDrawCommand = resolveGeometrySketchDrawCommandFromActionId(
                stagedResult.actionId,
              )
              if (sketchDrawCommand === null) {
                requestRadioBurst(commandIdentity, 'enter')
                return
              }
              spaghettiState.runGeometrySketchDrawCommand(sketchDrawCommand)
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            if (
              stagedResult.actionId === 'sketchdraw.camera.projection.orthographic' ||
              stagedResult.actionId === 'sketchdraw.camera.projection.perspective'
            ) {
              const projectionMode =
                stagedResult.actionId === 'sketchdraw.camera.projection.orthographic'
                  ? 'orthographic'
                  : 'perspective'
              setProjectionModeCommand(projectionMode)
              setStagedNavigationSession(createSketchDrawRootSession(stagedContext))
              appendConsoleEntry({
                layer: 'Commands',
                text: formatStagedBreadcrumb(stagedResult.breadcrumb),
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'View',
                text: `Projection: ${
                  projectionMode === 'orthographic' ? 'Orthographic' : 'Perspective'
                }`,
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(
                  createSketchDrawRootSession(stagedContext),
                  createSketchDrawRootSession(stagedContext).validChoices,
                ),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
          }
        }
        const assistBreadcrumb = featureAssistDescriptor?.breadcrumb ?? null
        const isSketchDrawRootAssist =
          assistBreadcrumb !== null &&
          assistBreadcrumb.length === 3 &&
          assistBreadcrumb[0] === 'Graph' &&
          assistBreadcrumb[1] === 'Sketch' &&
          assistBreadcrumb[2] === 'Sketch Draw'
        const isSketchDrawCameraAssist =
          assistBreadcrumb !== null &&
          assistBreadcrumb.length === 4 &&
          assistBreadcrumb[0] === 'Graph' &&
          assistBreadcrumb[1] === 'Sketch' &&
          assistBreadcrumb[2] === 'Sketch Draw' &&
          assistBreadcrumb[3] === 'Camera'
        const isSketchDrawCameraProjectionAssist =
          assistBreadcrumb !== null &&
          assistBreadcrumb.length === 5 &&
          assistBreadcrumb[0] === 'Graph' &&
          assistBreadcrumb[1] === 'Sketch' &&
          assistBreadcrumb[2] === 'Sketch Draw' &&
          assistBreadcrumb[3] === 'Camera' &&
          assistBreadcrumb[4] === 'Projection'
        if (isSketchDrawRootAssist && (trimmedInput === 'camera' || trimmedInput === 'c')) {
          const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          requestRadioBurst(commandIdentity, 'enter')
          const nextDescriptor = buildSketchDrawCameraAssistDescriptor()
          useConsoleStore.getState().setFeatureAssistDescriptor(nextDescriptor)
          appendConsoleEntry({
            layer: 'Commands',
            text: buildFeatureAssistPromptText(nextDescriptor),
            source: 'console',
            severity: 'info',
          })
          return
        }
        if (isSketchDrawCameraAssist) {
          if (trimmedInput === 'projection') {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const nextDescriptor = buildSketchDrawCameraProjectionAssistDescriptor()
            useConsoleStore.getState().setFeatureAssistDescriptor(nextDescriptor)
            appendConsoleEntry({
              layer: 'Commands',
              text: buildFeatureAssistPromptText(nextDescriptor),
              source: 'console',
              severity: 'info',
            })
            return
          }
          if (trimmedInput === 'back' || trimmedInput === 'b') {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const nextDescriptor = buildSketchDrawFeatureAssistDescriptor(geometrySketchSession)
            useConsoleStore.getState().setFeatureAssistDescriptor(nextDescriptor)
            appendConsoleEntry({
              layer: 'Commands',
              text: buildFeatureAssistPromptText(nextDescriptor),
              source: 'console',
              severity: 'info',
            })
            return
          }
        }
        if (isSketchDrawCameraProjectionAssist) {
          if (
            trimmedInput === 'orthographic' ||
            trimmedInput === 'o' ||
            trimmedInput === 'perspective' ||
            trimmedInput === 'p'
          ) {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const projectionMode =
              trimmedInput === 'orthographic' || trimmedInput === 'o'
                ? 'orthographic'
                : 'perspective'
            setProjectionModeCommand(projectionMode)
            appendConsoleEntry({
              layer: 'View',
              text: `Projection: ${
                projectionMode === 'orthographic' ? 'Orthographic' : 'Perspective'
              }`,
              source: 'console',
              severity: 'info',
            })
            const nextDescriptor = buildSketchDrawFeatureAssistDescriptor(geometrySketchSession)
            useConsoleStore.getState().setFeatureAssistDescriptor(nextDescriptor)
            appendConsoleEntry({
              layer: 'Commands',
              text: buildFeatureAssistPromptText(nextDescriptor),
              source: 'console',
              severity: 'info',
            })
            return
          }
          if (trimmedInput === 'back' || trimmedInput === 'b') {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const nextDescriptor = buildSketchDrawCameraAssistDescriptor()
            useConsoleStore.getState().setFeatureAssistDescriptor(nextDescriptor)
            appendConsoleEntry({
              layer: 'Commands',
              text: buildFeatureAssistPromptText(nextDescriptor),
              source: 'console',
              severity: 'info',
            })
            return
          }
        }
        if (trimmedInput === 'zoom' || trimmedInput === 'z') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          const zoomSession = createSketchDrawZoomRootSession()
          setStagedNavigationSession(zoomSession)
          useConsoleStore.getState().setInputText('')
          appendConsoleEntry({
            layer: 'Commands',
            text: formatStagedBreadcrumb(zoomSession.breadcrumb),
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'Commands',
            text: buildStagedPromptText(zoomSession, zoomSession.validChoices),
            source: 'console',
            severity: 'info',
          })
          return
        }
        if (
          geometrySketchSession.activeTool !== null &&
          (geometrySketchSession.activeTool === 'line' ||
            geometrySketchSession.activeTool === 'pline' ||
            geometrySketchSession.activeTool === 'rectangle')
        ) {
          const parsedVec2 = parseConsoleVec2Literal(trimmedInput)
          if (parsedVec2 !== null) {
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            spaghettiState.confirmGeometrySketchDrawPoint(parsedVec2, null)
            useConsoleStore.getState().setInputText('')
            return
          }
        }
        if (geometrySketchSession.activeTool === 'circle') {
          if ((geometrySketchSession.drawDraft?.points.length ?? 0) === 0) {
            const parsedVec2 = parseConsoleVec2Literal(trimmedInput)
            if (parsedVec2 !== null) {
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${trimmedInput}`,
              })
              pushCommandHistory(trimmedInput)
              spaghettiState.confirmGeometrySketchDrawPoint(parsedVec2, null)
              useConsoleStore.getState().setInputText('')
              return
            }
          } else {
            const parsedRadius = parseConsoleSignedFloatLiteral(trimmedInput)
            if (parsedRadius !== null) {
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${trimmedInput}`,
              })
              pushCommandHistory(trimmedInput)
              spaghettiState.confirmGeometrySketchDrawRadius(parsedRadius)
              useConsoleStore.getState().setInputText('')
              return
            }
          }
        }
        const sketchDrawCommand = resolveGeometrySketchDrawCommandFromInput(trimmedInput)
        if (sketchDrawCommand !== null) {
          submitDrawCommand(trimmedInput, sketchDrawCommand)
          return
        }
        if (trimmedInput === 'status') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: '> status',
          })
          pushCommandHistory('status')
          appendConsoleEntry({
            layer: 'App',
            text:
              `Draw Sketch ${getGeometrySketchDrawStageLabel(geometrySketchSession.drawStage)} ` +
              `tool=${
                geometrySketchSession.activeTool === null
                  ? 'none'
                  : geometrySketchSession.activeTool.toUpperCase()
              } ` +
              `target=${
                geometrySketchSession.activeTool === 'circle'
                  ? geometrySketchSession.drawDraft?.points.length === 0
                    ? 'Center'
                    : 'Radius'
                  : geometrySketchSession.activeTool === 'line' ||
                      geometrySketchSession.activeTool === 'rectangle'
                    ? `P${geometrySketchSession.drawDraft?.points.length === 0 ? 1 : 2}`
                    : `P${(geometrySketchSession.drawDraft?.points.length ?? 0) + 1}`
              } ` +
              `points=${geometrySketchSession.drawDraft?.points.length ?? 0} ` +
              `hover=${
                geometrySketchSession.drawDraft?.hoverPoint === null
                  ? 'none'
                  : `${geometrySketchSession.drawDraft?.hoverPoint.x.toFixed(1)},${geometrySketchSession.drawDraft?.hoverPoint.y.toFixed(1)}`
              }`,
            source: 'console',
            severity: 'info',
          })
          return
        }
        if (trimmedInput === 'help') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: '> help',
          })
          pushCommandHistory('help')
          appendConsoleEntry({
            layer: 'Commands',
            text: SKETCH_DRAW_HELP_TEXT,
            severity: 'info',
          })
          return
        }
      }
      if (trimmedInput === 'x' && useSpaghettiStore.getState().sketchPlanePickSession !== null) {
        appendConsoleEntry({
          layer: 'Commands',
          commandLineKind: 'user',
          text: '> x',
        })
        pushCommandHistory('x')
        useSpaghettiStore.getState().runSketchPlaneCommand('x')
        return
      }

      const parsed = parseConsoleCommand(inputText)
      if (parsed === null) {
        useConsoleStore.getState().setInputText('')
        return
      }

      appendConsoleEntry({
        layer: 'Commands',
        commandLineKind: 'user',
        text: `> ${parsed.raw}`,
      })
      pushCommandHistory(parsed.raw)
      const flatCommandIdentity = resolveConsoleRadioCommandIdentity({
        kind: 'flatCommand',
        commandName: parsed.name,
      })
      trackRadioCommandIdentity(flatCommandIdentity)

      const appState = useAppStore.getState()
      const activeTransformReferenceId =
        appState.referenceWorkspace.activeReferenceTransformSession?.referenceId ?? null
      const transformSnapState =
        activeTransformReferenceId === null
          ? DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
          : appState.referenceWorkspace.transformSnapByReferenceId[activeTransformReferenceId] ??
            DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE

      switch (parsed.name) {
        case 'help':
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'Commands',
            text: 'Commands: help, console, clear, history, frame, zoom, pan, orbit, move, rotate, scale, snap, echo, status',
            severity: 'info',
          })
          return
        case 'console': {
          useConsoleStore.getState().toggleExpanded()
          const nextState = useConsoleStore.getState()
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'App',
            text:
              nextState.windowMode === 'docked' && nextState.isExpanded
                ? 'Console expanded'
                : 'Console collapsed',
            source: 'console',
            severity: 'info',
          })
          return
        }
        case 'clear':
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'Diagnostics',
            text: 'Console clear is disabled for now',
            source: 'console',
            severity: 'warn',
          })
          return
        case 'history':
          requestRadioBurst(flatCommandIdentity, 'enter')
          if (useConsoleStore.getState().commandHistory.length === 0) {
            appendConsoleEntry({
              layer: 'Commands',
              text: 'No command history yet',
              source: 'console',
              severity: 'info',
            })
            return
          }
          appendConsoleEntry({
            layer: 'Commands',
            text: `History: ${useConsoleStore
              .getState()
              .commandHistory.slice(-8)
              .join(' | ')}`,
            source: 'console',
            severity: 'info',
          })
          return
        case 'frame':
          frameAllCommand()
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'View',
            text: 'Frame all',
            source: 'console',
            severity: 'info',
          })
          return
        case 'zoom':
          {
            const zoomAction = parseZoomCommandAction(parsed.args)
            if (zoomAction === null) {
              const stagedResult = submitConsoleStagedNavigationToken(
                null,
                'zoom',
                buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
              )
              if (stagedResult.kind === 'advance') {
                setStagedNavigationSession(stagedResult.session)
                appendConsoleEntry({
                  layer: 'Commands',
                  text: formatStagedBreadcrumb(stagedResult.breadcrumb),
                  source: 'console',
                  severity: 'info',
                })
                appendConsoleEntry({
                  layer: 'Commands',
                  text: buildStagedPromptText(stagedResult.session, stagedResult.validChoices),
                  source: 'console',
                  severity: 'info',
                })
                requestRadioBurst(flatCommandIdentity, 'enter')
                return
              }
            }
            const selectedReferenceId = resolveSelectedReferenceIdForZoom()
            const selectedObjectPartKey = resolveSelectedObjectPartKeyForZoom()
            const workspaceSelectedTarget = useAppStore.getState().workspaceSelection.selectedTarget
            const selectedEnvironmentLightId =
              workspaceSelectedTarget?.kind === 'environment-light'
                ? workspaceSelectedTarget.lightId
                : null
            if (zoomAction === 'all') {
              frameAllCommand()
            } else if (zoomAction === 'extents') {
              frameExtentsCommand()
            } else if (zoomAction === 'previous') {
              framePreviousCommand()
            } else if (zoomAction === 'window') {
              setConsoleCameraModeCommand('zoom-window')
              appendConsoleEntry({
                layer: 'View',
                text: 'Zoom Window armed: drag a box in the viewport with LMB',
                source: 'console',
                severity: 'info',
              })
            } else if (
              useSpaghettiStore.getState().geometrySketchSession?.mode === 'draw' &&
              (useSpaghettiStore.getState().geometrySketchSession?.selectedComponentIds.length ?? 0) > 0
            ) {
              const didFrameSelectedSketch = frameSelectedGeometrySketchCommand()
              if (!didFrameSelectedSketch) {
                requestRadioBurst(flatCommandIdentity, 'enter')
                return
              }
            } else if (selectedObjectPartKey !== null) {
              frameSelectedCommand(selectedObjectPartKey, undefined, {
                animate: true,
                durationMs: useUiPrefsStore.getState().cameraShortcutTransitionDurationMs,
              })
            } else if (selectedEnvironmentLightId !== null) {
              const didFrameEnvironmentLight = frameEnvironmentLightCommand(
                selectedEnvironmentLightId,
                undefined,
                {
                  animate: true,
                  durationMs: useUiPrefsStore.getState().cameraShortcutTransitionDurationMs,
                },
              )
              if (!didFrameEnvironmentLight) {
                appendConsoleEntry({
                  layer: 'Diagnostics',
                  text: 'Zoom Object could not find the selected environment light',
                  source: 'console',
                  severity: 'warn',
                })
                requestRadioBurst(flatCommandIdentity, 'enter')
                return
              }
            } else if (selectedReferenceId !== null) {
              frameReferenceCommand(selectedReferenceId, undefined, {
                animate: true,
                durationMs: useUiPrefsStore.getState().cameraShortcutTransitionDurationMs,
              })
            } else {
              appendConsoleEntry({
                layer: 'Diagnostics',
                text: 'Zoom Object requires a selected part, object, or reference',
                source: 'console',
                severity: 'warn',
              })
                requestRadioBurst(flatCommandIdentity, 'enter')
                return
              }
            if (useSpaghettiStore.getState().geometrySketchSession?.mode === 'draw') {
              const sketchDrawSession = createSketchDrawRootSession(
                buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
              )
              setStagedNavigationSession(sketchDrawSession)
              appendConsoleEntry({
                layer: 'Commands',
                text: formatStagedBreadcrumb(sketchDrawSession.breadcrumb),
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(sketchDrawSession, sketchDrawSession.validChoices),
                source: 'console',
                severity: 'info',
              })
            } else {
              enterGuidedRootSession({ appendPrompt: true })
            }
            requestRadioBurst(flatCommandIdentity, 'enter')
          }
          return
        case 'pan':
          setConsoleCameraModeCommand('pan')
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'View',
            text: 'Pan armed: drag in the viewport with LMB',
            source: 'console',
            severity: 'info',
          })
          return
        case 'orbit':
          setConsoleCameraModeCommand('orbit')
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'View',
            text: 'Orbit armed: drag in the viewport with LMB',
            source: 'console',
            severity: 'info',
          })
          return
        case 'move':
          requestRadioBurst(flatCommandIdentity, 'enter')
          dispatchImmediateShortcut('m')
          return
        case 'rotate':
          requestRadioBurst(flatCommandIdentity, 'enter')
          dispatchImmediateShortcut('r')
          return
        case 'scale':
          requestRadioBurst(flatCommandIdentity, 'enter')
          dispatchImmediateShortcut('s')
          return
        case 'snap':
          if (activeTransformReferenceId === null) {
            requestRadioBurst(flatCommandIdentity, 'enter')
            appendConsoleEntry({
              layer: 'Diagnostics',
              text: 'Snap requires an active reference transform session',
              source: 'console',
              severity: 'warn',
            })
            return
          }
          {
            const activeMode =
              appState.referenceWorkspace.activeReferenceTransformSession?.mode ?? 'translate'
            const nextEnabled = !transformSnapState[activeMode].enabled
            appState.setReferenceTransformSnapEnabled(
              activeTransformReferenceId,
              activeMode,
              nextEnabled,
            )
            const modeLabel = getReferenceTransformSnapModeLabel(activeMode)
            requestRadioBurst(flatCommandIdentity, 'enter')
            appendConsoleEntry({
              layer: 'Transforms',
              text: `${modeLabel} snap ${nextEnabled ? 'enabled' : 'disabled'}`,
              source: 'console',
              severity: 'info',
            })
            return
          }
        case 'echo':
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'Commands',
            text: parsed.argumentText.length === 0 ? '(empty)' : parsed.argumentText,
            source: 'console',
            severity: 'info',
          })
          return
        case 'status':
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'App',
            text: 'Status: spaghetti preview active',
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'Selection',
            text: `Selected: ${appState.selectedPartKey ?? 'none'}`,
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'Shortcuts',
            text:
              activeReferenceId === null
                ? 'Viewer Transform: none'
                : `Viewer Transform: ${
                    appState.referenceWorkspace.activeReferenceTransformSession?.mode ?? 'translate'
                  } ${activeReferenceId}`,
            source: 'console',
            severity: 'info',
          })
          return
        default:
          appendConsoleEntry({
            layer: 'Diagnostics',
            text: `Unknown command: ${parsed.raw}`,
            source: 'console',
            severity: 'warn',
          })
      }
    },
    [
      cancelActiveReferenceTransformSession,
      clearStagedNavigationSession,
      commitActiveReferenceTransformFromConsole,
      createActiveContentObjectTransformRootSession,
      createActiveReferenceTransformRootSession,
      createDeleteLatestTransformConfirmPromptSession,
      createMissingGraphNodeInGraphDocument,
      deleteSelectedReferenceTargets,
      hideReferenceTargets,
      hideSelectedReferenceTargets,
      setSelectedContentContainerVisibility,
      unhideReferenceTargets,
      unhideSelectedReferenceTargets,
      unhideAllReferenceTargets,
      deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry,
      dispatchImmediateShortcut,
      enterGuidedRootSession,
      featureAssistDescriptor,
      openReferenceTransformAxisPrompt,
      openReferenceTransformPlanePrompt,
      pushCommandHistory,
      requestRadioBurst,
      resolveConsoleActionContext,
      resolveWorkspaceModeRuntimeGuard,
      resolveSelectedObjectPartKeyForZoom,
      resolveSelectedReferenceIdForZoom,
      resolveSelectionSetForZoom,
      setConsolePromptSession,
      setStagedNavigationSession,
      trackRadioCommandIdentity,
      transitionReferenceTransformAxisPrompt,
    ],
  )


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }
      if (isEditableTarget(event.target)) {
        const routing = routeConsoleGlobalKey(event)
        dispatchSketchDrawShortcut(routing, event)
        return
      }
      if (getViewer()?.isFlyModeActive?.() === true) {
        return
      }
      if (event.key === '/' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        return
      }
      if (
        event.key === 'Tab' &&
        !event.shiftKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        (cycleActiveReferenceTransformModeWithTab() ||
          cycleActiveContentObjectTransformModeWithTab())
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        return
      }
      if (
        event.key === 'Escape' &&
        (useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive ===
          true ||
          useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession
            ?.entryActive === true)
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        handleEscCancelCommand()
        return
      }
      const routing = routeConsoleGlobalKey(event)
      if (routing.owner === 'viewer-fly') {
        return
      }
      if (dispatchEditHistoryShortcut(routing, event, editHistoryStore)) {
        return
      }
      if (routing.owner === 'reference-selection' && event.key === 'Delete') {
        event.preventDefault()
        event.stopImmediatePropagation()
        deleteSelectedReferenceTargets()
        return
      }
      if (routing.owner === 'reference-selection' && event.shiftKey && event.key.toLowerCase() === 'h') {
        event.preventDefault()
        event.stopImmediatePropagation()
        hideSelectedReferenceTargets()
        return
      }
      if (routing.owner === 'reference-selection' && event.altKey && event.key.toLowerCase() === 'h') {
        event.preventDefault()
        event.stopImmediatePropagation()
        unhideAllReferenceTargets()
        return
      }
      const keyTarget = event.target instanceof HTMLElement ? event.target : null
      const shouldSubmitFlatConsoleDraft =
        event.key === 'Enter' &&
        routing.owner === 'none' &&
        stagedNavigationSession === null &&
        consolePromptSession === null &&
        featureAssistDescriptor === null &&
        useConsoleStore.getState().inputText.trim().length > 0 &&
        keyTarget?.closest('button, [role="button"], a, summary, select') === null
      const shouldStepBackReferenceTransformPromptOnEscape =
        event.key === 'Escape' &&
        (consolePromptSession?.kind === 'reference-transform.axis' ||
          consolePromptSession?.kind === 'reference-transform.plane')
      if (
        shouldStepBackReferenceTransformPromptOnEscape ||
        (routing.owner === 'staged-console' && event.key === 'Escape')
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        handleEscCancelCommand()
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null ||
          shouldSubmitFlatConsoleDraft) &&
        (event.key === 'Enter' || (treatSpaceAsSubmit && event.key === ' '))
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        handleSubmitCommand(useConsoleStore.getState().inputText)
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowUp'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        cycleStagedChoiceWithRadioBurst('next', 'arrowUp')
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowDown'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        cycleStagedChoiceWithRadioBurst('previous', 'arrowDown')
        return
      }
      if (
        suppressAutoCaptureRef.current ||
        routing.decision !== 'handle' ||
        ((routing.owner !== 'flat-console' && routing.owner !== 'staged-console') &&
          !(
            useSpaghettiStore.getState().geometrySketchSession?.mode === 'draw' &&
            useSpaghettiStore.getState().geometrySketchSession?.activeTool === null
          ))
      ) {
        return
      }
      event.preventDefault()
      event.stopImmediatePropagation()
      focusMainConsoleInput()
      primeSketchDrawStagedRootForTyping()
      seedInputText(event.key)
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [
    consolePromptSession,
    cycleActiveContentObjectTransformModeWithTab,
    cycleActiveReferenceTransformModeWithTab,
    cycleStagedChoiceWithRadioBurst,
    deleteSelectedReferenceTargets,
    dispatchSketchDrawShortcut,
    hideSelectedReferenceTargets,
    unhideAllReferenceTargets,
    featureAssistDescriptor,
    focusMainConsoleInput,
    handleEscCancelCommand,
    handleSubmitCommand,
    primeSketchDrawStagedRootForTyping,
    routeConsoleGlobalKey,
    seedInputText,
    stagedNavigationSession,
    suppressAutoCaptureRef,
    treatSpaceAsSubmit,
  ])

  useEffect(() => {
    if (windowMode !== 'popout' || popoutWindow === null) {
      return
    }

    const handlePopoutKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }
      if (isEditableTarget(event.target)) {
        const routing = routeConsoleGlobalKey(event)
        dispatchSketchDrawShortcut(routing, event)
        return
      }
      if (event.key === '/' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        return
      }
      if (
        event.key === 'Tab' &&
        !event.shiftKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        (cycleActiveReferenceTransformModeWithTab() ||
          cycleActiveContentObjectTransformModeWithTab())
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        return
      }
      if (
        event.key === 'Escape' &&
        (useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive ===
          true ||
          useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession
            ?.entryActive === true)
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        handleEscCancelCommand()
        return
      }
      const routing = routeConsoleGlobalKey(event)
      if (dispatchEditHistoryShortcut(routing, event, editHistoryStore)) {
        return
      }
      if (routing.owner === 'reference-selection' && event.key === 'Delete') {
        event.preventDefault()
        event.stopImmediatePropagation()
        deleteSelectedReferenceTargets()
        return
      }
      if (routing.owner === 'reference-selection' && event.shiftKey && event.key.toLowerCase() === 'h') {
        event.preventDefault()
        event.stopImmediatePropagation()
        hideSelectedReferenceTargets()
        return
      }
      if (routing.owner === 'reference-selection' && event.altKey && event.key.toLowerCase() === 'h') {
        event.preventDefault()
        event.stopImmediatePropagation()
        unhideAllReferenceTargets()
        return
      }
      const keyTarget = event.target instanceof HTMLElement ? event.target : null
      const shouldSubmitFlatConsoleDraft =
        event.key === 'Enter' &&
        routing.owner === 'none' &&
        stagedNavigationSession === null &&
        consolePromptSession === null &&
        featureAssistDescriptor === null &&
        useConsoleStore.getState().inputText.trim().length > 0 &&
        keyTarget?.closest('button, [role="button"], a, summary, select') === null
      const shouldStepBackReferenceTransformPromptOnEscape =
        event.key === 'Escape' &&
        (consolePromptSession?.kind === 'reference-transform.axis' ||
          consolePromptSession?.kind === 'reference-transform.plane')
      if (
        shouldStepBackReferenceTransformPromptOnEscape ||
        (routing.owner === 'staged-console' && event.key === 'Escape')
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        handleEscCancelCommand()
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null ||
          shouldSubmitFlatConsoleDraft) &&
        (event.key === 'Enter' || (treatSpaceAsSubmit && event.key === ' '))
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        handleSubmitCommand(useConsoleStore.getState().inputText)
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowUp'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        cycleStagedChoiceWithRadioBurst('next', 'arrowUp')
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowDown'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        cycleStagedChoiceWithRadioBurst('previous', 'arrowDown')
        return
      }
      if (
        suppressAutoCaptureRef.current ||
        routing.decision !== 'handle' ||
        ((routing.owner !== 'flat-console' && routing.owner !== 'staged-console') &&
          !(
            useSpaghettiStore.getState().geometrySketchSession?.mode === 'draw' &&
            useSpaghettiStore.getState().geometrySketchSession?.activeTool === null
          ))
      ) {
        return
      }
      event.preventDefault()
      event.stopImmediatePropagation()
      focusPopoutConsoleInput()
      primeSketchDrawStagedRootForTyping()
      seedInputText(event.key)
    }

    popoutWindow.addEventListener('keydown', handlePopoutKeyDown, true)
    return () => {
      popoutWindow.removeEventListener('keydown', handlePopoutKeyDown, true)
    }
  }, [
    consolePromptSession,
    cycleActiveContentObjectTransformModeWithTab,
    cycleActiveReferenceTransformModeWithTab,
    cycleStagedChoiceWithRadioBurst,
    deleteSelectedReferenceTargets,
    dispatchSketchDrawShortcut,
    hideSelectedReferenceTargets,
    unhideAllReferenceTargets,
    featureAssistDescriptor,
    focusPopoutConsoleInput,
    handleEscCancelCommand,
    handleSubmitCommand,
    popoutWindow,
    primeSketchDrawStagedRootForTyping,
    routeConsoleGlobalKey,
    seedInputText,
    stagedNavigationSession,
    suppressAutoCaptureRef,
    treatSpaceAsSubmit,
    windowMode,
  ])

  useEffect(() => {
    const isSketchDrawIdle =
      geometrySketchSession?.mode === 'draw' && geometrySketchSession.activeTool === null
    const isSketchDrawLocalStagedScope = (
      session: ConsoleStagedNavigationSession | null,
    ): boolean =>
      session?.scopeId === 'sketchDrawRoot' ||
      session?.scopeId === 'sketchDrawCameraRoot' ||
      session?.scopeId === 'sketchDrawCameraProjectionRoot' ||
      session?.scopeId === 'sketchDrawZoomRoot'
    if (geometrySketchSession?.mode !== 'draw' && isSketchDrawLocalStagedScope(stagedNavigationSession)) {
      clearStagedNavigationSession()
      previousSketchDrawIdleRef.current = false
      return
    }
    if (!isSketchDrawIdle || consolePromptSession !== null) {
      previousSketchDrawIdleRef.current = isSketchDrawIdle
      return
    }
    if (stagedNavigationSession !== null && !isSketchDrawLocalStagedScope(stagedNavigationSession)) {
      previousSketchDrawIdleRef.current = isSketchDrawIdle
      return
    }
    if (stagedNavigationSession === null) {
      const sketchDrawRootSession = createSketchDrawRootSession(
        buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
      )
      const existingInputText = useConsoleStore.getState().inputText
      setStagedNavigationSession(sketchDrawRootSession)
      if (existingInputText.trim().length > 0) {
        useConsoleStore.getState().setInputText(existingInputText, { startManualOverride: true })
      }
      if (!previousSketchDrawIdleRef.current) {
        appendConsoleEntry({
          layer: 'Commands',
          text: 'Graph > Sketch > Sketch Draw',
          source: 'console',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildStagedPromptText(sketchDrawRootSession, sketchDrawRootSession.validChoices),
          source: 'console',
          severity: 'info',
        })
      }
    }
    previousSketchDrawIdleRef.current = isSketchDrawIdle
  }, [
    buildStagedNavigationContextFromStoreState,
    clearStagedNavigationSession,
    consolePromptSession,
    geometrySketchSession,
    previousSketchDrawIdleRef,
    setStagedNavigationSession,
    stagedNavigationSession,
  ])

  useEffect(() => {
    const nextDescriptor = getActiveFeatureAssistDescriptor({
      sketchPlanePickSession,
      geometrySketchSession,
      referenceWorkspace,
      stagedNavigationSession,
    })
    if (stagedNavigationSession?.scopeId === 'root' && nextDescriptor !== null) {
      clearStagedNavigationSession()
    }
    setFeatureAssistDescriptor(nextDescriptor)
  }, [
    clearStagedNavigationSession,
    geometrySketchSession,
    getActiveFeatureAssistDescriptor,
    referenceWorkspace,
    setFeatureAssistDescriptor,
    sketchPlanePickSession,
    stagedNavigationSession,
  ])

  useEffect(() => {
    if (
      consolePromptSession === null ||
      (consolePromptSession.kind !== 'reference-transform.axis' &&
        consolePromptSession.kind !== 'reference-transform.plane')
    ) {
      return
    }
    const nextPrefill = getReferenceTransformPromptPrefill(consolePromptSession, referenceWorkspace)
    useConsoleStore.getState().updateConsolePromptSessionPrefill(nextPrefill)
  }, [consolePromptSession, referenceWorkspace])

  useEffect(() => {
    const activeSession = referenceWorkspace.activeReferenceTransformSession
    const activeHandle = referenceWorkspace.activeReferenceTransformSession?.activeHandle ?? null
    const isReferenceTransformPrompt =
      consolePromptSession?.kind === 'reference-transform.axis' ||
      consolePromptSession?.kind === 'reference-transform.plane'
    if (isReferenceTransformPrompt && (activeSession === null || !activeSession.entryActive)) {
      useConsoleStore.getState().clearConsolePromptSession()
      return
    }
    if (activeHandle === null) {
      return
    }
    const nextPromptSession = resolveReferenceTransformPromptSessionFromHandle({
      referenceWorkspace,
      stagedNavigationSession,
      activeHandle,
    })
    if (nextPromptSession === null) {
      useConsoleStore.getState().setConsolePromptSession(null)
      return
    }
    if (!isSameReferenceTransformPromptSession(consolePromptSession, nextPromptSession)) {
      setConsolePromptSession(nextPromptSession)
    }
  }, [
    consolePromptSession,
    referenceWorkspace,
    setConsolePromptSession,
    stagedNavigationSession,
  ])

  useEffect(() => {
    if (sketchPlanePickSession?.stage !== 'pick') {
      useSpaghettiStore.getState().setSketchPlanePickPreviewPlane(null)
      return
    }
    const normalizedInput = consoleInputText.trim().toUpperCase()
    const previewToken =
      isStagedChoiceManualOverride === true
        ? normalizedInput
        : featureAssistDescriptor?.choices[stagedChoiceIndex ?? 0]?.canonicalToken ?? normalizedInput
    useSpaghettiStore.getState().setSketchPlanePickPreviewPlane(
      previewToken === 'XY' || previewToken === 'XZ' || previewToken === 'YZ'
        ? previewToken
        : null,
    )
  }, [
    consoleInputText,
    featureAssistDescriptor,
    isStagedChoiceManualOverride,
    sketchPlanePickSession?.stage,
    stagedChoiceIndex,
  ])

  useEffect(() => {
    const consoleState = useConsoleStore.getState()
    const spaghettiState = useSpaghettiStore.getState()
    if (
      rootGuidedOptOutRef.current ||
      consoleState.stagedNavigationSession !== null ||
      consoleState.consolePromptSession !== null ||
      consoleState.featureAssistDescriptor !== null ||
      consoleState.inputText.trim().length > 0 ||
      spaghettiState.sketchPlanePickSession !== null ||
      spaghettiState.geometrySketchSession?.mode === 'draw'
    ) {
      return
    }

    enterGuidedRootSession({ appendPrompt: true })
  }, [
    consolePromptSession,
    enterGuidedRootSession,
    featureAssistDescriptor,
    rootGuidedOptOutRef,
    stagedNavigationSession,
  ])

  return {
    enterGuidedRootSession,
    rehydrateGuidedRootSession,
    requestRadioBurst,
    resolveFeatureAssistSubmitIdentity,
    handleGuidedChoiceCycle,
    exitActiveReferenceTransformShell,
    handleEscCancelCommand,
    handleSubmitCommand,
  }
}
