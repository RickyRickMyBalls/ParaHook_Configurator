import type { RadioBurstTriggerKind } from '../store/audioSamplerStore'
import {
  DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE,
  buildObjectPartKeys,
  resolveSingleTargetContentSelection,
  resolveWorkspaceSelectedContentOwnerTarget,
  type ReferenceTransformSnapAxis,
  type ReferenceTransformSnapMode,
  useAppStore,
} from '../store/useAppStore'
import type { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import type { ConsoleAssistDescriptor, ConsoleAppendEntryInput } from './consoleTypes'
import { normalizeRadioCommandIdentity } from './consoleCommandParser'
import {
  parseConsoleSignedFloatLiteral,
  parseConsoleVec3Literal,
} from './consoleFormatters'
import {
  buildConsolePromptSessionText,
  buildStagedPromptText,
} from './consolePromptText'
import {
  applyReferenceTransformAxisValue,
  applyReferenceTransformPlaneValue,
  applyReferenceTransformVec3Value,
  buildReferenceConsoleWorkspaceTarget,
  buildReferenceTransformAxisPromptSession,
  buildReferenceTransformPlanePromptSession,
  parseReferenceTransformAxisInput,
} from './referenceTransformConsole'
import {
  createConsoleRootSession,
  createContentObjectTransformRootSession,
  createReferenceTransformRootSessionForTarget,
  resolveConsoleWorkspaceContextSync,
  submitConsoleStagedNavigationToken,
  type ConsoleStagedNavigationExecuteResult,
  type ConsoleStagedNavigationSession,
} from './stagedNavigation'
import type { ConsolePromptSession } from './useConsoleStore'

type AppState = ReturnType<typeof useAppStore.getState>
type SpaghettiState = ReturnType<typeof useSpaghettiStore.getState>
type ViewerHandle = {
  [key: string]: any
} | null
type ReferenceTransformHistoryEntry =
  AppState['referenceWorkspace']['transformHistoryByReferenceId'][string][number] | null
type ContentObjectTransformHistoryEntry =
  AppState['referenceWorkspace']['transformHistoryByObjectId'][string][number] | null
type StagedNavigationContext = Parameters<
  typeof createReferenceTransformRootSessionForTarget
>[0]

export type ConsoleReferenceContentBaseDeps = {
  appendConsoleEntry: (entry: ConsoleAppendEntryInput) => void
  clearConsolePromptSession: () => void
  getAppState: () => AppState
  getConsolePromptSession: () => ConsolePromptSession | null
  getSpaghettiState: () => SpaghettiState
  getStagedNavigationSession: () => ConsoleStagedNavigationSession | null
  getViewer: (viewportId?: string | null) => ViewerHandle
  pushCommandHistory: (inputText: string) => void
  requestRadioBurst: (
    commandIdentity: string | null,
    triggerKind: RadioBurstTriggerKind,
  ) => void
  setConsolePromptSession: (session: ConsolePromptSession) => void
  setInputText: (
    inputText: string,
    options?: {
      preserveGuidedReplace?: boolean
    },
  ) => void
  setStagedNavigationSession: (
    session: ConsoleStagedNavigationSession | null,
  ) => void
}

export type ConsoleReferenceContentFeatureAssistDeps = {
  buildFeatureAssistPromptText: (descriptor: ConsoleAssistDescriptor) => string
  featureAssistDescriptor: ConsoleAssistDescriptor | null
  getActiveFeatureAssistDescriptor: (params: {
    geometrySketchSession: SpaghettiState['geometrySketchSession']
    referenceWorkspace: AppState['referenceWorkspace']
    sketchPlanePickSession: SpaghettiState['sketchPlanePickSession']
    stagedNavigationSession: ConsoleStagedNavigationSession | null
  }) => ConsoleAssistDescriptor | null
  resolveFeatureAssistSubmitIdentity: (inputText: string) => string | null
}

export const formatReferenceTransformSnapValue = (value: number): string =>
  Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(4))}`

export const getReferenceTransformSnapModeLabel = (
  mode: ReferenceTransformSnapMode,
): 'Move' | 'Rotate' | 'Scale' =>
  mode === 'translate' ? 'Move' : mode === 'rotate' ? 'Rotate' : 'Scale'

export const getReferenceTransformSnapAxisLabel = (
  axis: ReferenceTransformSnapAxis,
): 'X' | 'Y' | 'Z' => (axis === 'x' ? 'X' : axis === 'y' ? 'Y' : 'Z')

export const getReferenceTransformSnapDriverValue = (
  snapState: (typeof DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE)[ReferenceTransformSnapMode],
): number => snapState.values.x

export const getReferenceTransformSnapAxisValue = (
  snapState: (typeof DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE)[ReferenceTransformSnapMode],
  axis: ReferenceTransformSnapAxis,
): number => snapState.values[axis]

export const getReferenceTransformSnapScopeMode = (
  scopeId: ConsoleStagedNavigationSession['scopeId'] | null | undefined,
): ReferenceTransformSnapMode | null =>
  scopeId === 'referenceTransformMoveSnapRoot' ||
  scopeId === 'referenceTransformMoveSnapXRoot' ||
  scopeId === 'referenceTransformMoveSnapYRoot' ||
  scopeId === 'referenceTransformMoveSnapZRoot'
    ? 'translate'
    : scopeId === 'referenceTransformRotateSnapRoot' ||
        scopeId === 'referenceTransformRotateSnapXRoot' ||
        scopeId === 'referenceTransformRotateSnapYRoot' ||
        scopeId === 'referenceTransformRotateSnapZRoot'
      ? 'rotate'
      : scopeId === 'referenceTransformScaleSnapRoot' ||
          scopeId === 'referenceTransformScaleSnapXRoot' ||
          scopeId === 'referenceTransformScaleSnapYRoot' ||
          scopeId === 'referenceTransformScaleSnapZRoot'
        ? 'scale'
        : null

export const getReferenceTransformSnapScopeAxis = (
  scopeId: ConsoleStagedNavigationSession['scopeId'] | null | undefined,
): ReferenceTransformSnapAxis | null =>
  scopeId === 'referenceTransformMoveSnapXRoot' ||
  scopeId === 'referenceTransformRotateSnapXRoot' ||
  scopeId === 'referenceTransformScaleSnapXRoot'
    ? 'x'
    : scopeId === 'referenceTransformMoveSnapYRoot' ||
        scopeId === 'referenceTransformRotateSnapYRoot' ||
        scopeId === 'referenceTransformScaleSnapYRoot'
      ? 'y'
      : scopeId === 'referenceTransformMoveSnapZRoot' ||
          scopeId === 'referenceTransformRotateSnapZRoot' ||
          scopeId === 'referenceTransformScaleSnapZRoot'
        ? 'z'
        : null

export const isReferenceTransformSnapScope = (
  scopeId: ConsoleStagedNavigationSession['scopeId'] | null | undefined,
): boolean =>
  getReferenceTransformSnapScopeMode(scopeId) !== null ||
  scopeId === 'referenceTransformSnapRoot'

export const createActiveReferenceTransformRootSession = ({
  appState,
  buildStagedNavigationContextFromStoreState,
  referenceId,
  spaghettiState,
}: {
  appState: AppState
  buildStagedNavigationContextFromStoreState: (
    spaghettiState: SpaghettiState,
  ) => StagedNavigationContext
  referenceId: string
  spaghettiState: SpaghettiState
}): ConsoleStagedNavigationSession => {
  const target = buildReferenceConsoleWorkspaceTarget(
    appState.referenceWorkspace,
    referenceId,
  )
  const context = buildStagedNavigationContextFromStoreState(spaghettiState)
  return createReferenceTransformRootSessionForTarget(
    context,
    target.label,
    referenceId,
    target.referenceCategoryId,
    target.referenceCategoryLabel,
  )
}

export const createActiveContentObjectTransformRootSession = ({
  appState,
  objectId,
}: {
  appState: AppState
  objectId: string
}): ConsoleStagedNavigationSession => {
  const objectRecord = appState.projectContent.objectsById[objectId] ?? null
  const hasCommittedEntriesInHistory =
    (appState.referenceWorkspace.transformHistoryByObjectId[objectId] ?? []).length >
    0
  const breadcrumbLabels = (() => {
    if (objectRecord === null) {
      return ['Object']
    }
    const labels = [objectRecord.label]
    let nextComponentId = objectRecord.parentComponentId
    let nextAssemblyId = objectRecord.parentAssemblyId ?? null

    while (nextComponentId !== null) {
      const currentComponentId = nextComponentId
      const componentRecord =
        appState.projectContent.componentsById[currentComponentId] ?? null
      labels.unshift(componentRecord?.label ?? currentComponentId)
      nextAssemblyId =
        componentRecord?.parentAssemblyId ??
        nextAssemblyId ??
        Object.values(appState.projectContent.assembliesById).find((assembly) =>
          assembly.childRowIds.includes(currentComponentId),
        )?.assemblyId ??
        null
      nextComponentId = null
    }

    while (nextAssemblyId !== null) {
      const assemblyRecord =
        appState.projectContent.assembliesById[nextAssemblyId] ?? null
      labels.unshift(assemblyRecord?.label ?? nextAssemblyId)
      nextAssemblyId = assemblyRecord?.parentAssemblyId ?? null
    }

    return labels
  })()

  return createContentObjectTransformRootSession(
    breadcrumbLabels,
    objectRecord?.sourceGraphDocumentId ?? objectRecord?.ownerGraphDocumentId ?? null,
    objectId,
    hasCommittedEntriesInHistory,
  )
}

export const createDeleteLatestTransformConfirmPromptSession = (
  target:
    | { kind: 'reference'; referenceId: string }
    | { kind: 'content-object'; objectId: string },
  returnSession: ConsoleStagedNavigationSession,
): ConsolePromptSession => ({
  kind: 'transform.delete-latest.confirm',
  breadcrumb: [...returnSession.breadcrumb, 'DeleteLatest'],
  label: 'Are you sure?',
  prefill: 'yes',
  returnSession,
  target,
})

export const deleteLatestReferenceTransformEntry = (
  appState: AppState,
  referenceId: string,
) => {
  const currentEntries =
    appState.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? []
  const latestEntry = currentEntries.at(-1) ?? null
  if (latestEntry !== null) {
    appState.deleteReferenceTransformHistoryEntry(referenceId, latestEntry.entryId)
  }
  return latestEntry
}

export const deleteLatestContentObjectTransformEntry = (
  appState: AppState,
  objectId: string,
) => {
  const currentEntries =
    appState.referenceWorkspace.transformHistoryByObjectId[objectId] ?? []
  const latestEntry = currentEntries.at(-1) ?? null
  if (latestEntry !== null) {
    appState.deleteContentObjectTransformHistoryEntry(objectId, latestEntry.entryId)
  }
  return latestEntry
}

export const createActiveReferenceTransformSnapSession = ({
  createActiveReferenceTransformRootSession,
  mode,
  referenceId,
  stagedContext,
}: {
  createActiveReferenceTransformRootSession: (
    referenceId: string,
  ) => ConsoleStagedNavigationSession
  mode: ReferenceTransformSnapMode
  referenceId: string
  stagedContext: StagedNavigationContext
}): ConsoleStagedNavigationSession | null => {
  const rootSession = createActiveReferenceTransformRootSession(referenceId)
  const settingsResult = submitConsoleStagedNavigationToken(
    rootSession,
    'settings',
    stagedContext,
  )
  if (settingsResult.kind !== 'advance') {
    return null
  }
  const snapResult = submitConsoleStagedNavigationToken(
    settingsResult.session,
    'snap',
    stagedContext,
  )
  if (snapResult.kind !== 'advance') {
    return null
  }
  const modeToken =
    mode === 'translate' ? 'move' : mode === 'rotate' ? 'rotate' : 'scale'
  const modeResult = submitConsoleStagedNavigationToken(
    snapResult.session,
    modeToken,
    stagedContext,
  )
  return modeResult.kind === 'advance' ? modeResult.session : null
}

export const createActiveContentObjectTransformSnapSession = ({
  createActiveContentObjectTransformRootSession,
  mode,
  objectId,
  stagedContext,
}: {
  createActiveContentObjectTransformRootSession: (
    objectId: string,
  ) => ConsoleStagedNavigationSession
  mode: ReferenceTransformSnapMode
  objectId: string
  stagedContext: StagedNavigationContext
}): ConsoleStagedNavigationSession | null => {
  const rootSession = createActiveContentObjectTransformRootSession(objectId)
  const settingsResult = submitConsoleStagedNavigationToken(
    rootSession,
    'settings',
    stagedContext,
  )
  if (settingsResult.kind !== 'advance') {
    return null
  }
  const snapResult = submitConsoleStagedNavigationToken(
    settingsResult.session,
    'snap',
    stagedContext,
  )
  if (snapResult.kind !== 'advance') {
    return null
  }
  const modeToken =
    mode === 'translate' ? 'move' : mode === 'rotate' ? 'rotate' : 'scale'
  const modeResult = submitConsoleStagedNavigationToken(
    snapResult.session,
    modeToken,
    stagedContext,
  )
  return modeResult.kind === 'advance' ? modeResult.session : null
}

export const closeReferenceTransformPromptToModeRoot = ({
  clearConsolePromptSession,
  getAppState,
  getViewer,
}: Pick<
  ConsoleReferenceContentBaseDeps,
  'clearConsolePromptSession' | 'getAppState' | 'getViewer'
>): { mode: 'translate' | 'rotate' | 'scale'; referenceId: string } | null => {
  const appState = getAppState()
  const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
  if (activeSession === null) {
    return null
  }
  getViewer()?.cancelReferenceTransformDrag?.()
  getViewer()?.clearReferenceTransformHandle?.()
  appState.setActiveReferenceTransformHandle(null)
  clearConsolePromptSession()
  return {
    referenceId: activeSession.referenceId,
    mode: activeSession.mode,
  }
}

export const applyReferenceTransformSpaceShortcut = ({
  appendConsoleEntry,
  buildFeatureAssistPromptText,
  closePromptToModeRoot = false,
  clearConsolePromptSession,
  createActiveReferenceTransformRootSession,
  getActiveFeatureAssistDescriptor,
  getAppState,
  getSpaghettiState,
  getViewer,
  inputText,
  pushCommandHistory,
  requestRadioBurst,
  resolveFeatureAssistSubmitIdentity,
  setStagedNavigationSession,
  space,
}: {
  appendConsoleEntry: (entry: ConsoleAppendEntryInput) => void
  buildFeatureAssistPromptText: (descriptor: ConsoleAssistDescriptor) => string
  closePromptToModeRoot?: boolean
  clearConsolePromptSession: () => void
  createActiveReferenceTransformRootSession: (
    referenceId: string,
  ) => ConsoleStagedNavigationSession
  getActiveFeatureAssistDescriptor: ConsoleReferenceContentFeatureAssistDeps['getActiveFeatureAssistDescriptor']
  getAppState: () => AppState
  getSpaghettiState: () => SpaghettiState
  getViewer: (viewportId?: string | null) => ViewerHandle
  inputText: string
  pushCommandHistory: (inputText: string) => void
  requestRadioBurst: ConsoleReferenceContentBaseDeps['requestRadioBurst']
  resolveFeatureAssistSubmitIdentity: (inputText: string) => string | null
  setStagedNavigationSession: (
    session: ConsoleStagedNavigationSession | null,
  ) => void
  space: 'local' | 'world'
}): boolean => {
  const appState = getAppState()
  const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
  if (activeSession === null) {
    return false
  }

  appendConsoleEntry({
    layer: 'Commands',
    commandLineKind: 'user',
    text: `> ${inputText}`,
  })
  pushCommandHistory(inputText)
  requestRadioBurst(resolveFeatureAssistSubmitIdentity(inputText), 'enter')

  if (closePromptToModeRoot) {
    getViewer()?.cancelReferenceTransformDrag?.()
    getViewer()?.clearReferenceTransformHandle?.()
    appState.setActiveReferenceTransformHandle(null)
    clearConsolePromptSession()
  }

  const alreadyApplied = activeSession.space === space
  if (!alreadyApplied) {
    appState.setActiveReferenceTransformSpace(space)
  }

  const nextTransformRootSession = createActiveReferenceTransformRootSession(
    activeSession.referenceId,
  )
  setStagedNavigationSession(nextTransformRootSession)
  appendConsoleEntry({
    layer: 'Transforms',
    text: `Space: ${space === 'local' ? 'Local' : 'World'}${
      alreadyApplied ? ' already applied' : ' applied'
    }`,
    source: 'console',
    severity: 'info',
  })

  const nextDescriptor = getActiveFeatureAssistDescriptor({
    sketchPlanePickSession: getSpaghettiState().sketchPlanePickSession,
    geometrySketchSession: getSpaghettiState().geometrySketchSession,
    referenceWorkspace: getAppState().referenceWorkspace,
    stagedNavigationSession: nextTransformRootSession,
  })
  if (nextDescriptor !== null) {
    appendConsoleEntry({
      layer: 'Commands',
      text: buildFeatureAssistPromptText(nextDescriptor),
      source: 'console',
      severity: 'info',
    })
    return true
  }

  appendConsoleEntry({
    layer: 'Commands',
    text: buildStagedPromptText(
      nextTransformRootSession,
      nextTransformRootSession.validChoices,
    ),
    source: 'console',
    severity: 'info',
  })
  return true
}

export const commitActiveReferenceTransformFromConsole = ({
  appendConsoleEntry,
  buildStagedNavigationContextFromStoreState,
  clearConsolePromptSession,
  getAppState,
  getSpaghettiState,
  getViewer,
  inputText,
  pushCommandHistory,
  requestRadioBurst,
  resolveFeatureAssistSubmitIdentity,
  setInputText,
  setStagedNavigationSession,
}: ConsoleReferenceContentBaseDeps &
  Pick<
    ConsoleReferenceContentFeatureAssistDeps,
    'resolveFeatureAssistSubmitIdentity'
  > & {
    buildStagedNavigationContextFromStoreState: (
      spaghettiState: SpaghettiState,
    ) => StagedNavigationContext
    inputText: string
  }): void => {
  const appState = getAppState()
  const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
  const activeReferenceId = activeSession?.referenceId ?? null
  if (activeSession === null || activeReferenceId === null) {
    return
  }

  appendConsoleEntry({
    layer: 'Commands',
    commandLineKind: 'user',
    text: `> ${inputText}`,
  })
  pushCommandHistory(inputText)
  requestRadioBurst(resolveFeatureAssistSubmitIdentity(inputText), 'enter')
  appState.setActiveReferenceTransformHandle(null)
  getViewer()?.clearReferenceTransformHandle?.()
  appState.commitActiveReferenceTransformEntry()
  clearConsolePromptSession()

  const nextTransformRootSession = createActiveReferenceTransformRootSession({
    appState: getAppState(),
    buildStagedNavigationContextFromStoreState,
    referenceId: activeReferenceId,
    spaghettiState: getSpaghettiState(),
  })
  setStagedNavigationSession(nextTransformRootSession)
  setInputText(nextTransformRootSession.validChoices[0]?.label ?? '')
}

export const openReferenceTransformAxisPrompt = ({
  axis,
  getAppState,
  getStagedNavigationSession,
  getViewer,
  setConsolePromptSession,
}: Pick<
  ConsoleReferenceContentBaseDeps,
  'getAppState' | 'getStagedNavigationSession' | 'getViewer' | 'setConsolePromptSession'
> & { axis: 'x' | 'y' | 'z' }): void => {
  const appState = getAppState()
  const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
  const activeReferenceId = activeSession?.referenceId ?? null
  if (activeSession === null || activeReferenceId === null) {
    return
  }
  const stagedSession = getStagedNavigationSession() ?? createConsoleRootSession()
  const viewerAxis = axis.toUpperCase() as 'X' | 'Y' | 'Z'
  if (activeSession.mode === 'translate') {
    getViewer()?.activateTranslateHandle?.(viewerAxis)
  } else if (activeSession.mode === 'rotate') {
    getViewer()?.activateRotateHandle?.(viewerAxis)
  } else {
    getViewer()?.activateScaleHandle?.(viewerAxis)
  }
  const nextPromptSession = buildReferenceTransformAxisPromptSession({
    referenceWorkspace: appState.referenceWorkspace,
    stagedNavigationSession: stagedSession,
    axis,
  })
  if (nextPromptSession !== null) {
    setConsolePromptSession(nextPromptSession)
  }
}

export const openReferenceTransformPlanePrompt = ({
  getAppState,
  getStagedNavigationSession,
  plane,
  setConsolePromptSession,
}: Pick<
  ConsoleReferenceContentBaseDeps,
  'getAppState' | 'getStagedNavigationSession' | 'setConsolePromptSession'
> & {
  plane: 'xy' | 'xz' | 'yz'
}): void => {
  const appState = getAppState()
  const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
  const activeReferenceId = activeSession?.referenceId ?? null
  if (activeSession === null || activeReferenceId === null) {
    return
  }
  const stagedSession = getStagedNavigationSession() ?? createConsoleRootSession()
  const nextPromptSession = buildReferenceTransformPlanePromptSession({
    referenceWorkspace: appState.referenceWorkspace,
    stagedNavigationSession: stagedSession,
    plane,
  })
  if (nextPromptSession !== null) {
    setConsolePromptSession(nextPromptSession)
  }
}

const cancelReferenceTransformLeafForTransition = ({
  clearConsolePromptSession,
  getAppState,
  getViewer,
}: Pick<
  ConsoleReferenceContentBaseDeps,
  'clearConsolePromptSession' | 'getAppState' | 'getViewer'
>): { referenceId: string; space: 'local' | 'world' } | null => {
  const appState = getAppState()
  const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
  const activeReferenceId = activeSession?.referenceId ?? null
  if (activeSession === null || activeReferenceId === null) {
    return null
  }
  const baseline = activeSession.entryOrigin ?? activeSession.draftTransform
  getViewer()?.cancelReferenceTransformDrag?.()
  getViewer()?.clearReferenceTransformHandle?.()
  appState.setActiveReferenceTransformHandle(null)
  appState.cancelActiveReferenceTransformEntry()
  appState.setActiveReferenceTransformDraft(baseline)
  getViewer()?.setReferenceTransformOverride?.(activeReferenceId, baseline)
  clearConsolePromptSession()
  return {
    referenceId: activeReferenceId,
    space: activeSession.space,
  }
}

export const transitionReferenceTransformAxisPrompt = ({
  clearConsolePromptSession,
  getAppState,
  getViewer,
  next,
  openReferenceTransformAxisPrompt,
}: Pick<
  ConsoleReferenceContentBaseDeps,
  'clearConsolePromptSession' | 'getAppState' | 'getViewer'
> & {
  next: {
    axis?: 'x' | 'y' | 'z'
    mode: 'translate' | 'rotate' | 'scale'
  }
  openReferenceTransformAxisPrompt: (axis: 'x' | 'y' | 'z') => void
}): void => {
  const transitionState = cancelReferenceTransformLeafForTransition({
    clearConsolePromptSession,
    getAppState,
    getViewer,
  })
  if (transitionState === null) {
    return
  }
  const appState = getAppState()
  appState.beginReferenceTransformEntry(next.mode)
  const nextSession = getAppState().referenceWorkspace.activeReferenceTransformSession
  getViewer()?.setReferenceTransformSession?.({
    referenceId: transitionState.referenceId,
    mode: next.mode,
    space: transitionState.space,
    entryOrigin: nextSession?.entryOrigin ?? null,
  })
  if (next.axis !== undefined) {
    openReferenceTransformAxisPrompt(next.axis)
    return
  }
  clearConsolePromptSession()
}

export const tryHandleReferenceContentPromptSubmission = ({
  activePromptSession,
  appendConsoleEntry,
  applyReferenceTransformSpaceShortcut,
  buildFeatureAssistPromptText,
  clearConsolePromptSession,
  commitActiveReferenceTransformFromConsole,
  createActiveContentObjectTransformRootSession,
  createActiveReferenceTransformRootSession,
  deleteLatestContentObjectTransformEntry,
  deleteLatestReferenceTransformEntry,
  getActiveFeatureAssistDescriptor,
  getAppState,
  getConsolePromptSession,
  getSpaghettiState,
  getStagedNavigationSession,
  getViewer,
  inputText,
  pushCommandHistory,
  setInputText,
  setStagedNavigationSession,
  transitionReferenceTransformAxisPrompt,
}: {
  activePromptSession: Extract<
    ConsolePromptSession,
    {
      kind:
        | 'transform.delete-latest.confirm'
        | 'reference-transform.axis'
        | 'reference-transform.plane'
        | 'content.owner.label'
    }
  >
  appendConsoleEntry: ConsoleReferenceContentBaseDeps['appendConsoleEntry']
  applyReferenceTransformSpaceShortcut: (
    space: 'local' | 'world',
    rawToken: string,
    options?: {
      closePromptToModeRoot?: boolean
    },
  ) => boolean
  buildFeatureAssistPromptText: (descriptor: ConsoleAssistDescriptor) => string
  clearConsolePromptSession: () => void
  commitActiveReferenceTransformFromConsole: (rawToken: string) => void
  createActiveContentObjectTransformRootSession: (
    objectId: string,
  ) => ConsoleStagedNavigationSession
  createActiveReferenceTransformRootSession: (
    referenceId: string,
  ) => ConsoleStagedNavigationSession
  deleteLatestContentObjectTransformEntry: (
    objectId: string,
  ) => ContentObjectTransformHistoryEntry
  deleteLatestReferenceTransformEntry: (
    referenceId: string,
  ) => ReferenceTransformHistoryEntry
  getActiveFeatureAssistDescriptor: ConsoleReferenceContentFeatureAssistDeps['getActiveFeatureAssistDescriptor']
  getAppState: () => AppState
  getConsolePromptSession: () => ConsolePromptSession | null
  getSpaghettiState: () => SpaghettiState
  getStagedNavigationSession: () => ConsoleStagedNavigationSession | null
  getViewer: (viewportId?: string | null) => ViewerHandle
  inputText: string
  pushCommandHistory: (inputText: string) => void
  setInputText: ConsoleReferenceContentBaseDeps['setInputText']
  setStagedNavigationSession: ConsoleReferenceContentBaseDeps['setStagedNavigationSession']
  transitionReferenceTransformAxisPrompt: (next: {
    axis?: 'x' | 'y' | 'z'
    mode: 'translate' | 'rotate' | 'scale'
  }) => void
}): boolean => {
  const rawToken = inputText.trim()
  const normalizedPromptToken = normalizeRadioCommandIdentity(rawToken)

  if (activePromptSession.kind === 'transform.delete-latest.confirm') {
    appendConsoleEntry({
      layer: 'Commands',
      commandLineKind: 'user',
      text: `> ${rawToken}`,
    })
    pushCommandHistory(rawToken)
    if (
      normalizedPromptToken === 'YES' ||
      normalizedPromptToken === 'Y' ||
      normalizedPromptToken === 'CONFIRM'
    ) {
      if (activePromptSession.target.kind === 'reference') {
        const latestEntry = deleteLatestReferenceTransformEntry(
          activePromptSession.target.referenceId,
        )
        const nextTransformRootSession = createActiveReferenceTransformRootSession(
          activePromptSession.target.referenceId,
        )
        setStagedNavigationSession(nextTransformRootSession)
        clearConsolePromptSession()
        appendConsoleEntry({
          layer: 'Transforms',
          text:
            latestEntry === null
              ? 'Delete latest skipped: no committed transform entry'
              : 'Deleted latest transform entry',
          source: 'console',
          severity: latestEntry === null ? 'warn' : 'info',
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildStagedPromptText(
            nextTransformRootSession,
            nextTransformRootSession.validChoices,
          ),
          source: 'console',
          severity: 'info',
        })
        return true
      }

      const latestEntry = deleteLatestContentObjectTransformEntry(
        activePromptSession.target.objectId,
      )
      const nextTransformRootSession = createActiveContentObjectTransformRootSession(
        activePromptSession.target.objectId,
      )
      setStagedNavigationSession(nextTransformRootSession)
      clearConsolePromptSession()
      appendConsoleEntry({
        layer: 'Transforms',
        text:
          latestEntry === null
            ? 'Delete latest skipped: no committed transform entry'
            : 'Deleted latest transform entry',
        source: 'console',
        severity: latestEntry === null ? 'warn' : 'info',
      })
      appendConsoleEntry({
        layer: 'Commands',
        text: buildStagedPromptText(
          nextTransformRootSession,
          nextTransformRootSession.validChoices,
        ),
        source: 'console',
        severity: 'info',
      })
      return true
    }

    if (
      normalizedPromptToken === 'NO' ||
      normalizedPromptToken === 'N' ||
      normalizedPromptToken === 'BACK' ||
      normalizedPromptToken === 'B' ||
      normalizedPromptToken === 'ESC' ||
      normalizedPromptToken === 'CANCEL'
    ) {
      clearConsolePromptSession()
      setStagedNavigationSession(activePromptSession.returnSession)
      appendConsoleEntry({
        layer: 'Transforms',
        text: 'Delete latest cancelled',
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
    }

    appendConsoleEntry({
      layer: 'Commands',
      text: buildConsolePromptSessionText(activePromptSession),
      source: 'console',
      severity: 'info',
    })
    setInputText(rawToken)
    return true
  }

  if (activePromptSession.kind === 'reference-transform.axis') {
    if (normalizedPromptToken === 'L' || normalizedPromptToken === 'LOCAL') {
      applyReferenceTransformSpaceShortcut('local', rawToken, {
        closePromptToModeRoot: true,
      })
      return true
    }
    if (normalizedPromptToken === 'W' || normalizedPromptToken === 'WORLD') {
      applyReferenceTransformSpaceShortcut('world', rawToken, {
        closePromptToModeRoot: true,
      })
      return true
    }

    const currentAxisToken = activePromptSession.axis.toUpperCase()
    if (
      normalizedPromptToken === 'X' ||
      normalizedPromptToken === 'Y' ||
      normalizedPromptToken === 'Z'
    ) {
      if (normalizedPromptToken !== currentAxisToken) {
        appendConsoleEntry({
          layer: 'Commands',
          commandLineKind: 'user',
          text: `> ${rawToken}`,
        })
        pushCommandHistory(rawToken)
        transitionReferenceTransformAxisPrompt({
          mode: activePromptSession.mode,
          axis: normalizedPromptToken.toLowerCase() as 'x' | 'y' | 'z',
        })
        const nextPromptSession = getConsolePromptSession()
        if (nextPromptSession !== null) {
          appendConsoleEntry({
            layer: 'Commands',
            text: buildConsolePromptSessionText(nextPromptSession),
            source: 'console',
            severity: 'info',
          })
        }
        return true
      }
    }

    if (
      normalizedPromptToken === 'MOVE' ||
      normalizedPromptToken === 'M' ||
      normalizedPromptToken === 'ROTATE' ||
      normalizedPromptToken === 'R' ||
      normalizedPromptToken === 'SCALE' ||
      normalizedPromptToken === 'S'
    ) {
      const nextMode =
        normalizedPromptToken === 'MOVE' || normalizedPromptToken === 'M'
          ? 'translate'
          : normalizedPromptToken === 'ROTATE' || normalizedPromptToken === 'R'
            ? 'rotate'
            : 'scale'
      if (activePromptSession.mode !== nextMode) {
        appendConsoleEntry({
          layer: 'Commands',
          commandLineKind: 'user',
          text: `> ${rawToken}`,
        })
        pushCommandHistory(rawToken)
        transitionReferenceTransformAxisPrompt({ mode: nextMode })
        const nextDescriptor = getActiveFeatureAssistDescriptor({
          sketchPlanePickSession: getSpaghettiState().sketchPlanePickSession,
          geometrySketchSession: getSpaghettiState().geometrySketchSession,
          referenceWorkspace: getAppState().referenceWorkspace,
          stagedNavigationSession: getStagedNavigationSession(),
        })
        if (nextDescriptor !== null) {
          appendConsoleEntry({
            layer: 'Commands',
            text: buildFeatureAssistPromptText(nextDescriptor),
            source: 'console',
            severity: 'info',
          })
        }
        return true
      }
    }

    const axisInput = parseReferenceTransformAxisInput(rawToken)
    if (axisInput === null) {
      appendConsoleEntry({
        layer: 'Commands',
        commandLineKind: 'user',
        text: `> ${rawToken}`,
      })
      pushCommandHistory(rawToken)
      appendConsoleEntry({
        layer: 'Commands',
        text: buildConsolePromptSessionText(activePromptSession),
        source: 'console',
        severity: 'info',
      })
      setInputText(rawToken)
      return true
    }

    const appState = getAppState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    const activeReferenceId = activeSession?.referenceId ?? null
    if (activeSession === null || activeReferenceId === null) {
      clearConsolePromptSession()
      return true
    }
    const axisBaselineTransform =
      axisInput.absolute === true
        ? activeSession.draftTransform
        : activeSession.entryOrigin ?? activeSession.draftTransform
    const nextTransformOverride = applyReferenceTransformAxisValue(
      axisBaselineTransform,
      activePromptSession.mode,
      activePromptSession.axis,
      axisInput.value,
      { absolute: axisInput.absolute },
    )
    getViewer()?.cancelReferenceTransformDrag?.()
    appState.setActiveReferenceTransformDraft(nextTransformOverride)
    getViewer()?.setReferenceTransformOverride(
      activeSession.referenceId,
      nextTransformOverride,
    )
    commitActiveReferenceTransformFromConsole(rawToken)
    return true
  }

  if (activePromptSession.kind === 'reference-transform.plane') {
    if (normalizedPromptToken === 'L' || normalizedPromptToken === 'LOCAL') {
      applyReferenceTransformSpaceShortcut('local', rawToken, {
        closePromptToModeRoot: true,
      })
      return true
    }
    if (normalizedPromptToken === 'W' || normalizedPromptToken === 'WORLD') {
      applyReferenceTransformSpaceShortcut('world', rawToken, {
        closePromptToModeRoot: true,
      })
      return true
    }

    const parsedVec3 = parseConsoleVec3Literal(rawToken)
    if (parsedVec3 === null) {
      appendConsoleEntry({
        layer: 'Commands',
        commandLineKind: 'user',
        text: `> ${rawToken}`,
      })
      pushCommandHistory(rawToken)
      appendConsoleEntry({
        layer: 'Commands',
        text: buildConsolePromptSessionText(activePromptSession),
        source: 'console',
        severity: 'info',
      })
      setInputText(rawToken)
      return true
    }

    const appState = getAppState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    const activeReferenceId = activeSession?.referenceId ?? null
    if (activeSession === null || activeReferenceId === null) {
      clearConsolePromptSession()
      return true
    }
    const nextTransformOverride = applyReferenceTransformPlaneValue(
      activeSession.draftTransform,
      activePromptSession.mode,
      activePromptSession.plane,
      parsedVec3,
    )
    getViewer()?.cancelReferenceTransformDrag?.()
    appState.setActiveReferenceTransformDraft(nextTransformOverride)
    getViewer()?.setReferenceTransformOverride(
      activeSession.referenceId,
      nextTransformOverride,
    )
    commitActiveReferenceTransformFromConsole(rawToken)
    return true
  }

  appendConsoleEntry({
    layer: 'Commands',
    commandLineKind: 'user',
    text: `> ${rawToken}`,
  })
  pushCommandHistory(rawToken)
  const nextLabel = rawToken.trim()
  if (nextLabel.length === 0) {
    appendConsoleEntry({
      layer: 'Diagnostics',
      text: 'Name cannot be empty',
      source: 'console',
      severity: 'warn',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildConsolePromptSessionText(activePromptSession),
      source: 'console',
      severity: 'info',
    })
    setInputText(rawToken)
    return true
  }

  const renamed = getAppState().renameProjectContentOwner(
    activePromptSession.target,
    nextLabel,
  )
  if (!renamed) {
    appendConsoleEntry({
      layer: 'Diagnostics',
      text: 'Rename is not available for this content owner',
      source: 'console',
      severity: 'warn',
    })
    return true
  }
  getAppState().requestConsoleContextSync('target-selection')
  clearConsolePromptSession()
  setStagedNavigationSession(activePromptSession.returnSession)
  appendConsoleEntry({
    layer: 'Browser',
    text: `Renamed to ${nextLabel}`,
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
}

export const tryHandleActiveReferenceTransformSubmission = ({
  activeStagedSession,
  appendConsoleEntry,
  applyReferenceTransformSpaceShortcut,
  cancelActiveReferenceTransformSession,
  commitActiveReferenceTransformFromConsole,
  createActiveReferenceTransformSnapSession,
  dispatchImmediateShortcut,
  featureAssistChoiceMatcher,
  featureAssistDescriptor,
  getAppState,
  getConsolePromptSession,
  getViewer,
  inputText,
  openReferenceTransformAxisPrompt,
  openReferenceTransformPlanePrompt,
  pushCommandHistory,
  requestRadioBurst,
  resolveFeatureAssistSubmitIdentity,
  setInputText,
  setStagedNavigationSession,
}: {
  activeStagedSession: ConsoleStagedNavigationSession | null
  appendConsoleEntry: ConsoleReferenceContentBaseDeps['appendConsoleEntry']
  applyReferenceTransformSpaceShortcut: (
    space: 'local' | 'world',
    rawToken: string,
  ) => boolean
  cancelActiveReferenceTransformSession: () => void
  commitActiveReferenceTransformFromConsole: (rawToken: string) => void
  createActiveReferenceTransformSnapSession: (
    referenceId: string,
    mode: ReferenceTransformSnapMode,
  ) => ConsoleStagedNavigationSession | null
  dispatchImmediateShortcut: (key: 'm' | 'r' | 's') => void
  featureAssistChoiceMatcher: (
    descriptor: ConsoleAssistDescriptor,
    inputText: string,
  ) => ConsoleAssistDescriptor['choices'][number] | null
  featureAssistDescriptor: ConsoleAssistDescriptor | null
  getAppState: () => AppState
  getConsolePromptSession: () => ConsolePromptSession | null
  getViewer: (viewportId?: string | null) => ViewerHandle
  inputText: string
  openReferenceTransformAxisPrompt: (axis: 'x' | 'y' | 'z') => void
  openReferenceTransformPlanePrompt: (plane: 'xy' | 'xz' | 'yz') => void
  pushCommandHistory: (inputText: string) => void
  requestRadioBurst: ConsoleReferenceContentBaseDeps['requestRadioBurst']
  resolveFeatureAssistSubmitIdentity: (inputText: string) => string | null
  setInputText: ConsoleReferenceContentBaseDeps['setInputText']
  setStagedNavigationSession: ConsoleReferenceContentBaseDeps['setStagedNavigationSession']
}): boolean => {
  const referenceWorkspaceState = getAppState().referenceWorkspace
  const activeReferenceSession = referenceWorkspaceState.activeReferenceTransformSession
  if (
    activeReferenceSession === null ||
    !activeReferenceSession.entryActive ||
    isReferenceTransformSnapScope(activeStagedSession?.scopeId)
  ) {
    return false
  }

  const rawToken = inputText.trim()
  const matchedChoice =
    featureAssistDescriptor !== null
      ? featureAssistChoiceMatcher(featureAssistDescriptor, inputText)
      : null
  const normalizedReferenceToken = normalizeRadioCommandIdentity(rawToken)
  const submitReferenceTransformCommand = () => {
    appendConsoleEntry({
      layer: 'Commands',
      commandLineKind: 'user',
      text: `> ${rawToken}`,
    })
    pushCommandHistory(rawToken)
    requestRadioBurst(resolveFeatureAssistSubmitIdentity(rawToken), 'enter')
  }

  if (
    normalizedReferenceToken === 'ESC' ||
    normalizedReferenceToken === 'BACK' ||
    normalizedReferenceToken === 'B'
  ) {
    submitReferenceTransformCommand()
    cancelActiveReferenceTransformSession()
    return true
  }

  if (normalizedReferenceToken === 'M' || normalizedReferenceToken === 'MOVE') {
    submitReferenceTransformCommand()
    dispatchImmediateShortcut('m')
    return true
  }
  if (
    normalizedReferenceToken === 'R' ||
    normalizedReferenceToken === 'ROTATE'
  ) {
    submitReferenceTransformCommand()
    dispatchImmediateShortcut('r')
    return true
  }
  if (normalizedReferenceToken === 'S' || normalizedReferenceToken === 'SCALE') {
    submitReferenceTransformCommand()
    dispatchImmediateShortcut('s')
    return true
  }
  if (normalizedReferenceToken === 'L' || normalizedReferenceToken === 'LOCAL') {
    applyReferenceTransformSpaceShortcut('local', rawToken)
    return true
  }
  if (normalizedReferenceToken === 'W' || normalizedReferenceToken === 'WORLD') {
    applyReferenceTransformSpaceShortcut('world', rawToken)
    return true
  }

  const parsedVec3 = parseConsoleVec3Literal(rawToken)
  if (parsedVec3 !== null) {
    const appState = getAppState()
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
    return true
  }

  const scalarValue = parseConsoleSignedFloatLiteral(rawToken)
  if (
    (activeReferenceSession.mode === 'rotate' ||
      activeReferenceSession.mode === 'scale') &&
    scalarValue !== null
  ) {
    const appState = getAppState()
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
    return true
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
          getAppState().referenceWorkspace.transformSnapByReferenceId[
            activeReferenceSession.referenceId
          ] ?? DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
        setInputText(
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
      return true
    }
    case 'VEC3':
      commitActiveReferenceTransformFromConsole(rawToken)
      return true
    case 'X':
    case 'Y':
    case 'Z':
      submitReferenceTransformCommand()
      openReferenceTransformAxisPrompt(
        matchedChoice.canonicalToken.toLowerCase() as 'x' | 'y' | 'z',
      )
      appendConsoleEntry({
        layer: 'Commands',
        text: buildConsolePromptSessionText(getConsolePromptSession()!),
        source: 'console',
        severity: 'info',
      })
      return true
    case 'XY':
    case 'XZ':
    case 'YZ':
      submitReferenceTransformCommand()
      openReferenceTransformPlanePrompt(
        matchedChoice.canonicalToken.toLowerCase() as 'xy' | 'xz' | 'yz',
      )
      appendConsoleEntry({
        layer: 'Commands',
        text: buildConsolePromptSessionText(getConsolePromptSession()!),
        source: 'console',
        severity: 'info',
      })
      return true
    default:
      return false
  }
}

export const tryHandleReferenceTransformRootShortcut = ({
  activeReferenceId,
  appendConsoleEntry,
  createActiveReferenceTransformRootSession,
  deleteLatestReferenceTransformEntry,
  inputText,
  pushCommandHistory,
  requestRadioBurst,
  scopedCommandIdentity,
  stagedSession,
  setStagedNavigationSession,
}: {
  activeReferenceId: string
  appendConsoleEntry: ConsoleReferenceContentBaseDeps['appendConsoleEntry']
  createActiveReferenceTransformRootSession: (
    referenceId: string,
  ) => ConsoleStagedNavigationSession
  deleteLatestReferenceTransformEntry: (
    referenceId: string,
  ) => ReferenceTransformHistoryEntry
  inputText: string
  pushCommandHistory: (inputText: string) => void
  requestRadioBurst: ConsoleReferenceContentBaseDeps['requestRadioBurst']
  scopedCommandIdentity: string | null
  stagedSession: ConsoleStagedNavigationSession | null
  setStagedNavigationSession: ConsoleReferenceContentBaseDeps['setStagedNavigationSession']
}): boolean => {
  if (stagedSession?.scopeId !== 'referenceTransformRoot') {
    return false
  }
  const normalizedReferenceToken = normalizeRadioCommandIdentity(inputText.trim())
  if (
    normalizedReferenceToken !== 'DELETELATEST' &&
    normalizedReferenceToken !== 'DELETE' &&
    normalizedReferenceToken !== 'DEL' &&
    normalizedReferenceToken !== 'D'
  ) {
    return false
  }

  appendConsoleEntry({
    layer: 'Commands',
    commandLineKind: 'user',
    text: `> ${inputText.trim()}`,
  })
  pushCommandHistory(inputText.trim())
  requestRadioBurst(scopedCommandIdentity, 'enter')
  const latestEntry = deleteLatestReferenceTransformEntry(activeReferenceId)
  const nextTransformRootSession =
    createActiveReferenceTransformRootSession(activeReferenceId)
  setStagedNavigationSession(nextTransformRootSession)
  appendConsoleEntry({
    layer: 'Transforms',
    text:
      latestEntry === null
        ? 'Delete latest skipped: no committed transform entry'
        : 'Deleted latest transform entry',
    source: 'console',
    severity: latestEntry === null ? 'warn' : 'info',
  })
  appendConsoleEntry({
    layer: 'Commands',
    text: buildStagedPromptText(
      nextTransformRootSession,
      nextTransformRootSession.validChoices,
    ),
    source: 'console',
    severity: 'info',
  })
  return true
}

export const tryHandleContentOwnerPromptAction = ({
  appendConsoleEntry,
  buildStagedNavigationContextFromStoreState,
  commandIdentity,
  getAppState,
  getSpaghettiState,
  requestRadioBurst,
  setConsolePromptSession,
  setStagedNavigationSession,
  stagedResult,
}: {
  appendConsoleEntry: ConsoleReferenceContentBaseDeps['appendConsoleEntry']
  buildStagedNavigationContextFromStoreState: (
    spaghettiState: SpaghettiState,
  ) => StagedNavigationContext
  commandIdentity: string | null
  getAppState: () => AppState
  getSpaghettiState: () => SpaghettiState
  requestRadioBurst: ConsoleReferenceContentBaseDeps['requestRadioBurst']
  setConsolePromptSession: ConsoleReferenceContentBaseDeps['setConsolePromptSession']
  setStagedNavigationSession: ConsoleReferenceContentBaseDeps['setStagedNavigationSession']
  stagedResult: ConsoleStagedNavigationExecuteResult
}): boolean => {
  if (
    stagedResult.actionId !== 'content.newAssembly' &&
    stagedResult.actionId !== 'content.newComponent' &&
    stagedResult.actionId !== 'content.rename'
  ) {
    return false
  }

  const appState = getAppState()
  appendConsoleEntry({
    layer: 'Commands',
    text: stagedResult.breadcrumb.join(' > '),
    source: 'console',
    severity: 'info',
  })

  if (stagedResult.actionId === 'content.newAssembly') {
    const assemblyId = appState.createProjectAssembly()
    appState.requestConsoleContextSync('target-selection')
    const assemblyLabel =
      getAppState().projectContent.assembliesById[assemblyId]?.label ?? 'Assembly'
    const returnSession =
      resolveConsoleWorkspaceContextSync(
        buildStagedNavigationContextFromStoreState(getSpaghettiState()),
        {
          kind: 'assembly',
          assemblyId,
          label: assemblyLabel,
          fallbackGraphDocumentId: null,
          canDelete: true,
        },
      ).session ?? stagedResult.session
    const promptSession: Extract<ConsolePromptSession, { kind: 'content.owner.label' }> = {
      kind: 'content.owner.label',
      breadcrumb: [...stagedResult.session.breadcrumb, assemblyLabel],
      label: 'Assembly Name',
      prefill: assemblyLabel,
      returnSession,
      target: { kind: 'assembly', assemblyId },
    }
    setStagedNavigationSession(returnSession)
    setConsolePromptSession(promptSession)
    appendConsoleEntry({
      layer: 'Commands',
      text: buildConsolePromptSessionText(promptSession),
      source: 'console',
      severity: 'info',
    })
    requestRadioBurst(commandIdentity, 'enter')
    return true
  }

  if (stagedResult.actionId === 'content.newComponent') {
    const assemblyId = stagedResult.selections.contentAssemblyId ?? null
    if (assemblyId === null) {
      appendConsoleEntry({
        layer: 'Browser',
        text: 'New Component requires a selected assembly',
        source: 'console',
        severity: 'warn',
      })
      return true
    }
    const componentId = appState.createProjectComponent(assemblyId)
    if (componentId === null) {
      appendConsoleEntry({
        layer: 'Browser',
        text: 'New Component is not available for this target',
        source: 'console',
        severity: 'warn',
      })
      return true
    }
    appState.requestConsoleContextSync('target-selection')
    const componentLabel =
      getAppState().projectContent.componentsById[componentId]?.label ?? 'Component'
    const returnSession =
      resolveConsoleWorkspaceContextSync(
        buildStagedNavigationContextFromStoreState(getSpaghettiState()),
        {
          kind: 'component',
          componentId,
          label: componentLabel,
          fallbackGraphDocumentId: null,
          canRename: true,
          canDelete: true,
        },
      ).session ?? stagedResult.session
    const promptSession: Extract<ConsolePromptSession, { kind: 'content.owner.label' }> = {
      kind: 'content.owner.label',
      breadcrumb: [...stagedResult.session.breadcrumb, componentLabel],
      label: 'Component Name',
      prefill: componentLabel,
      returnSession,
      target: { kind: 'component', componentId },
    }
    setStagedNavigationSession(returnSession)
    setConsolePromptSession(promptSession)
    appendConsoleEntry({
      layer: 'Commands',
      text: buildConsolePromptSessionText(promptSession),
      source: 'console',
      severity: 'info',
    })
    requestRadioBurst(commandIdentity, 'enter')
    return true
  }

  const assemblyId = stagedResult.selections.contentAssemblyId ?? null
  const componentId = stagedResult.selections.contentComponentId ?? null
  const promptSession: Extract<ConsolePromptSession, { kind: 'content.owner.label' }> | null =
    assemblyId !== null
      ? {
          kind: 'content.owner.label',
          breadcrumb: stagedResult.breadcrumb,
          label: 'Assembly Name',
          prefill: appState.projectContent.assembliesById[assemblyId]?.label ?? 'Assembly',
          returnSession: stagedResult.session,
          target: { kind: 'assembly', assemblyId },
        }
      : componentId !== null
        ? {
            kind: 'content.owner.label',
            breadcrumb: stagedResult.breadcrumb,
            label: 'Component Name',
            prefill:
              appState.projectContent.componentsById[componentId]?.label ?? 'Component',
            returnSession: stagedResult.session,
            target: { kind: 'component', componentId },
          }
        : null
  if (promptSession === null) {
    return false
  }
  setConsolePromptSession(promptSession)
  appendConsoleEntry({
    layer: 'Commands',
    text: buildConsolePromptSessionText(promptSession),
    source: 'console',
    severity: 'info',
  })
  requestRadioBurst(commandIdentity, 'enter')
  return true
}

export const tryHandleReferenceContentExecuteAction = ({
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
  getAppState,
  getSpaghettiState,
  getStagedNavigationSession,
  getViewer,
  inputText,
  requestRadioBurst,
  setConsolePromptSession,
  setStagedNavigationSession,
  stagedResult,
}: {
  activeReferenceSession: AppState['referenceWorkspace']['activeReferenceTransformSession']
  appendConsoleEntry: ConsoleReferenceContentBaseDeps['appendConsoleEntry']
  buildFeatureAssistPromptText: (descriptor: ConsoleAssistDescriptor) => string
  commandIdentity: string | null
  createActiveContentObjectTransformRootSession: (
    objectId: string,
  ) => ConsoleStagedNavigationSession
  createActiveContentObjectTransformSnapSession: (
    objectId: string,
    mode: ReferenceTransformSnapMode,
  ) => ConsoleStagedNavigationSession | null
  createActiveReferenceTransformRootSession: (
    referenceId: string,
  ) => ConsoleStagedNavigationSession
  createActiveReferenceTransformSnapSession: (
    referenceId: string,
    mode: ReferenceTransformSnapMode,
  ) => ConsoleStagedNavigationSession | null
  createDeleteLatestTransformConfirmPromptSession: (
    target:
      | { kind: 'reference'; referenceId: string }
      | { kind: 'content-object'; objectId: string },
    returnSession: ConsoleStagedNavigationSession,
  ) => ConsolePromptSession
  deleteLatestContentObjectTransformEntry: (
    objectId: string,
  ) => ContentObjectTransformHistoryEntry
  deleteLatestReferenceTransformEntry: (
    referenceId: string,
  ) => ReferenceTransformHistoryEntry
  getActiveFeatureAssistDescriptor: ConsoleReferenceContentFeatureAssistDeps['getActiveFeatureAssistDescriptor']
  getAppState: () => AppState
  getSpaghettiState: () => SpaghettiState
  getStagedNavigationSession: () => ConsoleStagedNavigationSession | null
  getViewer: (viewportId?: string | null) => ViewerHandle
  inputText: string
  requestRadioBurst: ConsoleReferenceContentBaseDeps['requestRadioBurst']
  setConsolePromptSession: ConsoleReferenceContentBaseDeps['setConsolePromptSession']
  setStagedNavigationSession: ConsoleReferenceContentBaseDeps['setStagedNavigationSession']
  stagedResult: ConsoleStagedNavigationExecuteResult
}): boolean => {
  const actionId = stagedResult.actionId
  const handlesAction =
    actionId === 'reference.transform.commitShell' ||
    actionId === 'reference.transform.deleteLatest' ||
    actionId === 'reference.transform.move' ||
    actionId === 'reference.transform.rotate' ||
    actionId === 'reference.transform.scale' ||
    actionId === 'reference.transform.space.local' ||
    actionId === 'reference.transform.space.world' ||
    actionId.startsWith('reference.transform.snap.') ||
    actionId === 'content.transform.move' ||
    actionId === 'content.transform.rotate' ||
    actionId === 'content.transform.scale' ||
    actionId === 'content.transform.deleteLatest' ||
    actionId === 'content.transform.space.local' ||
    actionId === 'content.transform.space.world' ||
    actionId.startsWith('content.transform.snap.')
  if (!handlesAction) {
    return false
  }

  const appState = getAppState()
  setStagedNavigationSession(stagedResult.session)
  appendConsoleEntry({
    layer: 'Commands',
    text: stagedResult.breadcrumb.join(' > '),
    source: 'console',
    severity: 'info',
  })

  if (actionId === 'reference.transform.commitShell') {
    appState.requestReferenceTransformShellExit('commit-shell')
    requestRadioBurst(commandIdentity, 'enter')
    return true
  }

  if (actionId === 'reference.transform.deleteLatest') {
    const referenceId = stagedResult.selections.referenceId as string
    const currentEntries =
      appState.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? []
    const latestEntry = currentEntries.at(-1) ?? null
    const shouldConfirmDeleteLatest =
      latestEntry !== null &&
      appState.referenceWorkspace.activeReferenceTransformSession?.referenceId === referenceId &&
      latestEntry.sessionId !==
        appState.referenceWorkspace.activeReferenceTransformSession?.sessionId
    if (shouldConfirmDeleteLatest) {
      const promptSession = createDeleteLatestTransformConfirmPromptSession(
        { kind: 'reference', referenceId },
        stagedResult.session,
      )
      setConsolePromptSession(promptSession)
      appendConsoleEntry({
        layer: 'Transforms',
        text: 'Delete latest will remove an entry from the previous transform. Are you sure?',
        source: 'console',
        severity: 'warn',
      })
      appendConsoleEntry({
        layer: 'Commands',
        text: buildConsolePromptSessionText(promptSession),
        source: 'console',
        severity: 'info',
      })
      requestRadioBurst(commandIdentity, 'enter')
      return true
    }
    const deletedEntry = deleteLatestReferenceTransformEntry(referenceId)
    const nextTransformRootSession =
      createActiveReferenceTransformRootSession(referenceId)
    setStagedNavigationSession(nextTransformRootSession)
    appendConsoleEntry({
      layer: 'Transforms',
      text:
        deletedEntry === null
          ? 'Delete latest skipped: no committed transform entry'
          : 'Deleted latest transform entry',
      source: 'console',
      severity: deletedEntry === null ? 'warn' : 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildStagedPromptText(
        nextTransformRootSession,
        nextTransformRootSession.validChoices,
      ),
      source: 'console',
      severity: 'info',
    })
    requestRadioBurst(commandIdentity, 'enter')
    return true
  }

  if (
    actionId === 'reference.transform.move' ||
    actionId === 'reference.transform.rotate' ||
    actionId === 'reference.transform.scale'
  ) {
    const referenceId = stagedResult.selections.referenceId as string
    const transformMode =
      actionId === 'reference.transform.rotate'
        ? 'rotate'
        : actionId === 'reference.transform.scale'
          ? 'scale'
          : 'translate'
    appState.beginReferenceTransformShell(referenceId)
    appState.beginReferenceTransformEntry(transformMode)
    const nextSession =
      getAppState().referenceWorkspace.activeReferenceTransformSession
    getViewer()?.setReferenceTransformSession?.({
      referenceId,
      mode: transformMode,
      space: getAppState().referenceWorkspace.activeReferenceTransformSession?.space ?? 'local',
      entryOrigin: nextSession?.entryOrigin ?? null,
    })
    if (transformMode === 'rotate') {
      getViewer()?.activateRotateCenterHandle?.()
    } else if (transformMode === 'scale') {
      getViewer()?.activateScaleCenterHandle?.()
    } else {
      getViewer()?.activateTranslateCenterHandle?.()
    }
    appendConsoleEntry({
      layer: 'Transforms',
      text: `${
        transformMode === 'rotate'
          ? 'Rotate'
          : transformMode === 'scale'
            ? 'Scale'
            : 'Move'
      } armed`,
      source: 'console',
      severity: 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildStagedPromptText(
        getStagedNavigationSession() ?? stagedResult.session,
        (getStagedNavigationSession() ?? stagedResult.session).validChoices,
      ),
      source: 'console',
      severity: 'info',
    })
    requestRadioBurst(commandIdentity, 'enter')
    return true
  }

  if (
    actionId === 'reference.transform.space.local' ||
    actionId === 'reference.transform.space.world'
  ) {
    const referenceId = stagedResult.selections.referenceId as string
    const nextSpace =
      actionId === 'reference.transform.space.world' ? 'world' : 'local'
    const currentSession = appState.referenceWorkspace.activeReferenceTransformSession
    const alreadyApplied =
      currentSession?.referenceId === referenceId &&
      currentSession.space === nextSpace
    if (!alreadyApplied) {
      appState.setActiveReferenceTransformSpace(nextSpace)
    }
    const nextTransformRootSession =
      createActiveReferenceTransformRootSession(referenceId)
    setStagedNavigationSession(nextTransformRootSession)
    appendConsoleEntry({
      layer: 'Transforms',
      text: `Space: ${nextSpace === 'local' ? 'Local' : 'World'}${
        alreadyApplied ? ' already applied' : ' applied'
      }`,
      source: 'console',
      severity: 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildStagedPromptText(
        nextTransformRootSession,
        nextTransformRootSession.validChoices,
      ),
      source: 'console',
      severity: 'info',
    })
    requestRadioBurst(commandIdentity, 'enter')
    return true
  }

  if (actionId.startsWith('reference.transform.snap.')) {
    const referenceId = stagedResult.selections.referenceId as string
    const snapMode = actionId.includes('.translate.')
      ? 'translate'
      : actionId.includes('.rotate.')
        ? 'rotate'
        : 'scale'
    const isModeValueAction = actionId === `reference.transform.snap.${snapMode}.value`
    const snapAxis = actionId.endsWith('.x.value')
      ? 'x'
      : actionId.endsWith('.y.value')
        ? 'y'
        : actionId.endsWith('.z.value')
          ? 'z'
          : null
    const isAxisValueAction = snapAxis !== null
    const isOnAction = actionId.endsWith('.on')
    const isLockAction = actionId.endsWith('.lock')
    const isUnlockAction = actionId.endsWith('.unlock')
    const numericValue = parseConsoleSignedFloatLiteral(inputText.trim())
    const nextSession =
      activeReferenceSession?.entryActive === true
        ? createActiveReferenceTransformSnapSession(referenceId, snapMode)
        : createActiveReferenceTransformRootSession(referenceId)
    if (isModeValueAction && numericValue !== null) {
      appState.setReferenceTransformSnapValue(referenceId, snapMode, numericValue)
    } else if (isAxisValueAction && numericValue !== null) {
      appState.setReferenceTransformSnapAxisValue(
        referenceId,
        snapMode,
        snapAxis,
        numericValue,
      )
    } else if (isLockAction || isUnlockAction) {
      appState.setReferenceTransformSnapLocked(referenceId, snapMode, isLockAction)
    } else {
      appState.setReferenceTransformSnapEnabled(referenceId, snapMode, isOnAction)
    }
    if (nextSession !== null) {
      setStagedNavigationSession(nextSession)
    }
    const nextSnapState =
      getAppState().referenceWorkspace.transformSnapByReferenceId[referenceId] ??
      DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
    const modeLabel = getReferenceTransformSnapModeLabel(snapMode)
    appendConsoleEntry({
      layer: 'Transforms',
      text: isModeValueAction
        ? `${modeLabel} snap value: ${formatReferenceTransformSnapValue(
            getReferenceTransformSnapDriverValue(nextSnapState[snapMode]),
          )}`
        : isAxisValueAction
          ? `${modeLabel} ${getReferenceTransformSnapAxisLabel(
              snapAxis,
            )} snap value: ${formatReferenceTransformSnapValue(
              getReferenceTransformSnapAxisValue(nextSnapState[snapMode], snapAxis),
            )}`
          : isLockAction || isUnlockAction
            ? `${modeLabel} snap XYZ: ${isLockAction ? 'Locked' : 'Unlocked'}`
            : `${modeLabel} snap: ${isOnAction ? 'On' : 'Off'}`,
      source: 'console',
      severity: 'info',
    })
    if (nextSession !== null) {
      if (activeReferenceSession?.entryActive === true) {
        const nextDescriptor = getActiveFeatureAssistDescriptor({
          sketchPlanePickSession: getSpaghettiState().sketchPlanePickSession,
          geometrySketchSession: getSpaghettiState().geometrySketchSession,
          referenceWorkspace: getAppState().referenceWorkspace,
          stagedNavigationSession: nextSession,
        })
        if (nextDescriptor !== null) {
          appendConsoleEntry({
            layer: 'Commands',
            text: buildFeatureAssistPromptText(nextDescriptor),
            source: 'console',
            severity: 'info',
          })
        }
      } else {
        appendConsoleEntry({
          layer: 'Commands',
          text: buildStagedPromptText(nextSession, nextSession.validChoices),
          source: 'console',
          severity: 'info',
        })
      }
    }
    requestRadioBurst(commandIdentity, 'enter')
    return true
  }

  if (
    actionId === 'content.transform.space.local' ||
    actionId === 'content.transform.space.world'
  ) {
    const activeSession = appState.referenceWorkspace.activeContentObjectTransformSession
    const objectId = activeSession?.objectId ?? stagedResult.selections.contentObjectId ?? null
    if (objectId === null) {
      appendConsoleEntry({
        layer: 'Transforms',
        text: 'Viewer Transform space requires an active content object transform session',
        source: 'console',
        severity: 'warn',
      })
      requestRadioBurst(commandIdentity, 'enter')
      return true
    }
    const nextSpace =
      actionId === 'content.transform.space.world' ? 'world' : 'local'
    const alreadyApplied = activeSession?.space === nextSpace
    if (!alreadyApplied) {
      appState.setActiveContentObjectTransformSpace(nextSpace)
    }
    const nextTransformRootSession =
      createActiveContentObjectTransformRootSession(objectId)
    setStagedNavigationSession(nextTransformRootSession)
    appendConsoleEntry({
      layer: 'Transforms',
      text: `Space: ${nextSpace === 'local' ? 'Local' : 'World'}${
        alreadyApplied ? ' already applied' : ' applied'
      }`,
      source: 'console',
      severity: 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildStagedPromptText(
        nextTransformRootSession,
        nextTransformRootSession.validChoices,
      ),
      source: 'console',
      severity: 'info',
    })
    requestRadioBurst(commandIdentity, 'enter')
    return true
  }

  if (actionId.startsWith('content.transform.snap.')) {
    const activeSession = appState.referenceWorkspace.activeContentObjectTransformSession
    const objectId = activeSession?.objectId ?? stagedResult.selections.contentObjectId ?? null
    if (objectId === null) {
      appendConsoleEntry({
        layer: 'Transforms',
        text: 'Viewer Transform snap requires an active content object transform session',
        source: 'console',
        severity: 'warn',
      })
      requestRadioBurst(commandIdentity, 'enter')
      return true
    }
    const snapMode = actionId.includes('.translate.')
      ? 'translate'
      : actionId.includes('.rotate.')
        ? 'rotate'
        : 'scale'
    const isModeValueAction = actionId === `content.transform.snap.${snapMode}.value`
    const snapAxis = actionId.endsWith('.x.value')
      ? 'x'
      : actionId.endsWith('.y.value')
        ? 'y'
        : actionId.endsWith('.z.value')
          ? 'z'
          : null
    const isAxisValueAction = snapAxis !== null
    const isOnAction = actionId.endsWith('.on')
    const isLockAction = actionId.endsWith('.lock')
    const isUnlockAction = actionId.endsWith('.unlock')
    const numericValue = parseConsoleSignedFloatLiteral(inputText.trim())
    const nextSession =
      activeSession?.entryActive === true
        ? createActiveContentObjectTransformSnapSession(objectId, snapMode)
        : createActiveContentObjectTransformRootSession(objectId)
    if (isModeValueAction && numericValue !== null) {
      appState.setContentObjectTransformSnapValue(objectId, snapMode, numericValue)
    } else if (isAxisValueAction && numericValue !== null) {
      appState.setContentObjectTransformSnapAxisValue(
        objectId,
        snapMode,
        snapAxis,
        numericValue,
      )
    } else if (isLockAction || isUnlockAction) {
      appState.setContentObjectTransformSnapLocked(objectId, snapMode, isLockAction)
    } else {
      appState.setContentObjectTransformSnapEnabled(objectId, snapMode, isOnAction)
    }
    if (nextSession !== null) {
      setStagedNavigationSession(nextSession)
    }
    const nextSnapState =
      getAppState().referenceWorkspace.transformSnapByObjectId[objectId] ??
      DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
    const modeLabel = getReferenceTransformSnapModeLabel(snapMode)
    appendConsoleEntry({
      layer: 'Transforms',
      text: isModeValueAction
        ? `${modeLabel} snap value: ${formatReferenceTransformSnapValue(
            getReferenceTransformSnapDriverValue(nextSnapState[snapMode]),
          )}`
        : isAxisValueAction
          ? `${modeLabel} ${getReferenceTransformSnapAxisLabel(
              snapAxis,
            )} snap value: ${formatReferenceTransformSnapValue(
              getReferenceTransformSnapAxisValue(nextSnapState[snapMode], snapAxis),
            )}`
          : isLockAction || isUnlockAction
            ? `${modeLabel} snap XYZ: ${isLockAction ? 'Locked' : 'Unlocked'}`
            : `${modeLabel} snap: ${isOnAction ? 'On' : 'Off'}`,
      source: 'console',
      severity: 'info',
    })
    if (nextSession !== null) {
      appendConsoleEntry({
        layer: 'Commands',
        text: buildStagedPromptText(nextSession, nextSession.validChoices),
        source: 'console',
        severity: 'info',
      })
    }
    requestRadioBurst(commandIdentity, 'enter')
    return true
  }

  if (actionId === 'content.transform.deleteLatest') {
    const activeSession = getAppState().referenceWorkspace.activeContentObjectTransformSession
    const objectId = activeSession?.objectId ?? stagedResult.selections.contentObjectId ?? null
    if (objectId === null) {
      appendConsoleEntry({
        layer: 'Transforms',
        text: 'Delete latest requires an active content object transform session',
        source: 'console',
        severity: 'warn',
      })
      requestRadioBurst(commandIdentity, 'enter')
      return true
    }
    const currentEntries =
      getAppState().referenceWorkspace.transformHistoryByObjectId[objectId] ?? []
    const latestEntry = currentEntries.at(-1) ?? null
    const shouldConfirmDeleteLatest =
      latestEntry !== null &&
      activeSession?.objectId === objectId &&
      latestEntry.sessionId !== activeSession.sessionId
    if (shouldConfirmDeleteLatest) {
      const promptSession = createDeleteLatestTransformConfirmPromptSession(
        { kind: 'content-object', objectId },
        stagedResult.session,
      )
      setConsolePromptSession(promptSession)
      appendConsoleEntry({
        layer: 'Transforms',
        text: 'Delete latest will remove an entry from the previous transform. Are you sure?',
        source: 'console',
        severity: 'warn',
      })
      appendConsoleEntry({
        layer: 'Commands',
        text: buildConsolePromptSessionText(promptSession),
        source: 'console',
        severity: 'info',
      })
      requestRadioBurst(commandIdentity, 'enter')
      return true
    }
    const deletedEntry = deleteLatestContentObjectTransformEntry(objectId)
    const nextTransformRootSession =
      createActiveContentObjectTransformRootSession(objectId)
    setStagedNavigationSession(nextTransformRootSession)
    appendConsoleEntry({
      layer: 'Transforms',
      text:
        deletedEntry === null
          ? 'Delete latest skipped: no committed transform entry'
          : 'Deleted latest transform entry',
      source: 'console',
      severity: deletedEntry === null ? 'warn' : 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildStagedPromptText(
        nextTransformRootSession,
        nextTransformRootSession.validChoices,
      ),
      source: 'console',
      severity: 'info',
    })
    requestRadioBurst(commandIdentity, 'enter')
    return true
  }

  const selectedTarget = appState.workspaceSelection.selectedTarget
  const selectedOwnerTarget = resolveWorkspaceSelectedContentOwnerTarget(
    appState,
    selectedTarget,
  )
  if (
    selectedTarget?.kind !== 'object' ||
    selectedOwnerTarget?.ownerKind !== 'object-part'
  ) {
    appendConsoleEntry({
      layer: 'Transforms',
      text: 'Object transform requires a selected object',
      source: 'console',
      severity: 'warn',
    })
  } else {
    const objectRecord = appState.projectContent.objectsById[selectedTarget.objectId] ?? null
    if (!selectedOwnerTarget.supportsViewerTransform || objectRecord === null) {
      appendConsoleEntry({
        layer: 'Transforms',
        text: 'Viewer Transform is only available for published objects in this phase',
        source: 'console',
        severity: 'warn',
      })
    } else {
      const objectPartKey =
        appState.selectedPartKey ??
        (objectRecord !== null ? (buildObjectPartKeys(objectRecord)[0] ?? null) : null) ??
        resolveSingleTargetContentSelection(appState, selectedTarget)?.partKeys[0] ??
        null
      const transformMode =
        actionId === 'content.transform.rotate'
          ? 'rotate'
          : actionId === 'content.transform.scale'
            ? 'scale'
            : 'translate'
      if (objectPartKey === null) {
        appendConsoleEntry({
          layer: 'Transforms',
          text: 'Viewer Transform requires a resolved published object with visible viewer parts',
          source: 'console',
          severity: 'warn',
        })
      } else {
        appState.beginContentObjectTransformShell(selectedTarget.objectId)
        appState.beginContentObjectTransformEntry(transformMode)
        appState.selectPart(objectPartKey)
        const nextSession =
          getAppState().referenceWorkspace.activeContentObjectTransformSession
        getViewer()?.setSelectedPart?.(objectPartKey)
        getViewer()?.setContentObjectTransformSession?.({
          objectId: selectedTarget.objectId,
          mode: transformMode,
          space: nextSession?.space ?? 'local',
          entryOrigin: nextSession?.entryOrigin ?? null,
        })
        if (transformMode === 'rotate') {
          getViewer()?.activateRotateCenterHandle?.()
        } else if (transformMode === 'scale') {
          getViewer()?.activateScaleCenterHandle?.()
        } else {
          getViewer()?.activateTranslateCenterHandle?.()
        }
        appendConsoleEntry({
          layer: 'Transforms',
          text: `${
            transformMode === 'rotate'
              ? 'Rotate'
              : transformMode === 'scale'
                ? 'Scale'
                : 'Move'
          } armed`,
          source: 'console',
          severity: 'info',
        })
      }
    }
  }
  appendConsoleEntry({
    layer: 'Commands',
    text: buildStagedPromptText(
      getStagedNavigationSession() ?? stagedResult.session,
      (getStagedNavigationSession() ?? stagedResult.session).validChoices,
    ),
    source: 'console',
    severity: 'info',
  })
  requestRadioBurst(commandIdentity, 'enter')
  return true
}
