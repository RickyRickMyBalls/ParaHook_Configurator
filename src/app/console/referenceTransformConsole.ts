import {
  buildImportedReferenceRowId,
  selectReferenceWorkspaceBrowserTree,
  selectReferenceWorkspaceItems,
  type ActiveReferenceTransformHandle,
  type ConsoleWorkspaceContextTarget,
  type ReferenceTransformMode,
  useAppStore,
} from '../store/useAppStore'
import type { ConsoleAssistDescriptor } from './consoleTypes'
import type { ConsolePromptSession } from './useConsoleStore'
import {
  createConsoleRootSession,
  type ConsoleStagedNavigationSession,
} from './stagedNavigation'

type ReferenceWorkspace = ReturnType<typeof useAppStore.getState>['referenceWorkspace']
type ActiveReferenceTransformSession = NonNullable<ReferenceWorkspace['activeReferenceTransformSession']>
type ReferenceTransformOverride = NonNullable<ReferenceWorkspace['transformOverrideById'][string]>
type ViewerTransformStatusSession = {
  mode: ActiveReferenceTransformSession['mode']
  draftTransform: ReferenceTransformOverride
}

const VIEWER_TRANSFORM_LABEL = 'Viewer Transform'

export type ReferenceTransformChannelSelection = {
  section: ReferenceTransformMode
  axis: 'x' | 'y' | 'z'
} | null

const buildDefaultReferenceTransformOverride = (): ReferenceTransformOverride => ({
  position: { x: 0, y: 0, z: 0 },
  rotationDeg: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
})

export const formatReferenceTransformVec3Status = (values: {
  x: number
  y: number
  z: number
}): string => `Vec3 [${values.x.toFixed(1)}, ${values.y.toFixed(1)}, ${values.z.toFixed(1)}]`

export const getReferenceTransformModeLabel = (
  mode: ActiveReferenceTransformSession['mode'],
): 'Move' | 'Rotate' | 'Scale' => {
  switch (mode) {
    case 'rotate':
      return 'Rotate'
    case 'scale':
      return 'Scale'
    case 'translate':
      return 'Move'
  }
}

export const buildReferenceTransformConsoleBreadcrumb = ({
  referenceLabel,
  targetKindLabel = 'Reference',
  stagedNavigationSession,
  mode,
  leafLabel = null,
}: {
  referenceLabel: string | null
  targetKindLabel?: 'Reference' | 'Object' | 'Environment Light'
  stagedNavigationSession: ConsoleStagedNavigationSession | null
  mode: ActiveReferenceTransformSession['mode']
  leafLabel?: string | null
}): string[] => {
  const modeLabel = getReferenceTransformModeLabel(mode)
  const resolvedReferenceLabel = referenceLabel ?? 'Reference'
  const defaultRootLabel = targetKindLabel === 'Object' ? 'Content' : targetKindLabel
  const breadcrumbBase =
    stagedNavigationSession?.scopeId === 'referenceTransformRoot' ||
    stagedNavigationSession?.scopeId === 'contentObjectTransformRoot'
      ? stagedNavigationSession.breadcrumb
      : ['Select', defaultRootLabel, resolvedReferenceLabel, VIEWER_TRANSFORM_LABEL]
  return [...breadcrumbBase, leafLabel ?? modeLabel]
}

export const formatReferenceTransformBreadcrumb = (breadcrumb: string[]): string =>
  breadcrumb.join(' > ')

export const getReferenceTransformCurrentVector = (
  referenceWorkspace: ReferenceWorkspace,
): { x: number; y: number; z: number } => {
  const activeSession = referenceWorkspace.activeReferenceTransformSession
  const activeTransformOverride =
    activeSession?.draftTransform ?? buildDefaultReferenceTransformOverride()
  switch (activeSession?.mode ?? 'translate') {
    case 'rotate':
      return activeTransformOverride.rotationDeg
    case 'scale':
      return activeTransformOverride.scale
    case 'translate':
      return activeTransformOverride.position
  }
}

export const buildReferenceConsoleWorkspaceTarget = (
  referenceWorkspace: ReferenceWorkspace,
  referenceId: string,
  fallbackLabel?: string | null,
): Extract<ConsoleWorkspaceContextTarget, { kind: 'object' }> => {
  const referenceItem =
    selectReferenceWorkspaceItems({ referenceWorkspace }).find(
      (item) => item.referenceId === referenceId,
    ) ?? null
  const categoryId = referenceItem?.categoryId ?? 'shoes'
  const categoryLabel =
    selectReferenceWorkspaceBrowserTree({ referenceWorkspace }).categories.find(
      (category) => category.categoryId === categoryId,
    )?.label ??
    referenceItem?.categoryId ??
    'References'
  return {
    kind: 'object',
    objectId: buildImportedReferenceRowId(referenceId),
    label: referenceItem?.label ?? fallbackLabel ?? referenceId,
    fallbackGraphDocumentId: null,
    referenceId,
    canLoadModel: referenceItem ? !referenceItem.isVisible && referenceItem.loadState !== 'error' : false,
    canDelete: referenceItem?.sourceKind === 'imported',
    canHide: referenceItem?.isVisible ?? false,
    referenceCategoryId: categoryId,
    referenceCategoryLabel: categoryLabel,
  }
}

export const buildReferenceTransformAssistChoices = (
  currentVector: { x: number; y: number; z: number },
  mode: ReferenceTransformMode,
): ConsoleAssistDescriptor['choices'] => {
  const vec3Label = formatReferenceTransformVec3Status(currentVector)
  const choices: ConsoleAssistDescriptor['choices'] = [
    {
      canonicalToken: 'VEC3',
      aliases: [vec3Label.trim().toUpperCase()],
      label: vec3Label,
    },
    { canonicalToken: 'SNAP', aliases: ['SN'], label: 'Snap' },
    { canonicalToken: 'X', aliases: [], label: 'X' },
    { canonicalToken: 'Y', aliases: [], label: 'Y' },
    { canonicalToken: 'Z', aliases: [], label: 'Z' },
  ]
  if (mode !== 'rotate') {
    choices.push(
      { canonicalToken: 'XY', aliases: [], label: 'XY' },
      { canonicalToken: 'XZ', aliases: [], label: 'XZ' },
      { canonicalToken: 'YZ', aliases: [], label: 'YZ' },
    )
  }
  return choices
}

export const buildReferenceTransformAssistDescriptor = (
  referenceWorkspace: ReferenceWorkspace,
  stagedNavigationSession: ConsoleStagedNavigationSession | null,
): ConsoleAssistDescriptor | null => {
  const activeSession = referenceWorkspace.activeReferenceTransformSession
  const activeReferenceId = activeSession?.referenceId ?? null
  if (activeSession === null || !activeSession.entryActive) {
    return null
  }
  const activeReference =
    selectReferenceWorkspaceItems({ referenceWorkspace }).find(
      (item) => item.referenceId === activeReferenceId,
    ) ?? null
  const currentVector = getReferenceTransformCurrentVector(referenceWorkspace)
  const referenceLabel = activeReference?.label ?? activeReferenceId
  const vec3Label = formatReferenceTransformVec3Status(currentVector)
  const breadcrumb = buildReferenceTransformConsoleBreadcrumb({
    referenceLabel,
    stagedNavigationSession,
    mode: activeSession.mode,
  })
  return {
    label: formatReferenceTransformBreadcrumb(breadcrumb),
    breadcrumb,
    choices: buildReferenceTransformAssistChoices(currentVector, activeSession.mode),
    prefill: vec3Label,
  }
}

export const formatReferenceTransformAxisPromptPrefill = (value: number): string => `@${value}`

export const getReferenceTransformPromptPrefill = (
  promptSession: Extract<
    ConsolePromptSession,
    { kind: 'reference-transform.axis' | 'reference-transform.plane' }
  >,
  referenceWorkspace: ReferenceWorkspace,
): string => {
  const currentVector = getReferenceTransformCurrentVector(referenceWorkspace)
  if (promptSession.kind === 'reference-transform.axis') {
    return formatReferenceTransformAxisPromptPrefill(currentVector[promptSession.axis])
  }
  return formatReferenceTransformVec3Status(currentVector)
}

export const buildReferenceTransformAxisPromptSession = ({
  referenceWorkspace,
  stagedNavigationSession,
  axis,
}: {
  referenceWorkspace: ReferenceWorkspace
  stagedNavigationSession: ConsoleStagedNavigationSession | null
  axis: 'x' | 'y' | 'z'
}): Extract<ConsolePromptSession, { kind: 'reference-transform.axis' }> | null => {
  const activeSession = referenceWorkspace.activeReferenceTransformSession
  const activeReferenceId = activeSession?.referenceId ?? null
  if (activeSession === null || activeReferenceId === null) {
    return null
  }
  const activeReference =
    selectReferenceWorkspaceItems({ referenceWorkspace }).find(
      (item) => item.referenceId === activeReferenceId,
    ) ?? null
  const currentVector = getReferenceTransformCurrentVector(referenceWorkspace)
  const session = stagedNavigationSession ?? createConsoleRootSession()
  const referenceLabel = activeReference?.label ?? activeReferenceId
  const modeLabel = getReferenceTransformModeLabel(activeSession.mode)
  const breadcrumb = [
    ...buildReferenceTransformConsoleBreadcrumb({
      referenceLabel,
      stagedNavigationSession: session,
      mode: activeSession.mode,
    }),
    `${modeLabel} ${axis.toUpperCase()}`,
  ]
  return {
    kind: 'reference-transform.axis',
    breadcrumb,
    label: formatReferenceTransformBreadcrumb(breadcrumb),
    prefill: formatReferenceTransformAxisPromptPrefill(currentVector[axis]),
    returnSession: session,
    mode: activeSession.mode,
    axis,
  }
}

export const buildReferenceTransformPlanePromptSession = ({
  referenceWorkspace,
  stagedNavigationSession,
  plane,
}: {
  referenceWorkspace: ReferenceWorkspace
  stagedNavigationSession: ConsoleStagedNavigationSession | null
  plane: 'xy' | 'xz' | 'yz'
}): Extract<ConsolePromptSession, { kind: 'reference-transform.plane' }> | null => {
  const activeSession = referenceWorkspace.activeReferenceTransformSession
  const activeReferenceId = activeSession?.referenceId ?? null
  if (activeSession === null || activeReferenceId === null) {
    return null
  }
  const activeReference =
    selectReferenceWorkspaceItems({ referenceWorkspace }).find(
      (item) => item.referenceId === activeReferenceId,
    ) ?? null
  const session = stagedNavigationSession ?? createConsoleRootSession()
  const referenceLabel = activeReference?.label ?? activeReferenceId
  const modeLabel = getReferenceTransformModeLabel(activeSession.mode)
  const breadcrumb = [
    ...buildReferenceTransformConsoleBreadcrumb({
      referenceLabel,
      stagedNavigationSession: session,
      mode: activeSession.mode,
    }),
    `${modeLabel} ${plane.toUpperCase()}`,
  ]
  return {
    kind: 'reference-transform.plane',
    breadcrumb,
    label: formatReferenceTransformBreadcrumb(breadcrumb),
    prefill: formatReferenceTransformVec3Status(
      getReferenceTransformCurrentVector(referenceWorkspace),
    ),
    returnSession: session,
    mode: activeSession.mode,
    plane,
  }
}

export const isSameReferenceTransformPromptSession = (
  currentPromptSession: ConsolePromptSession | null,
  nextPromptSession:
    | Extract<ConsolePromptSession, { kind: 'reference-transform.axis' }>
    | Extract<ConsolePromptSession, { kind: 'reference-transform.plane' }>
    | null,
): boolean => {
  if (currentPromptSession === nextPromptSession) {
    return true
  }
  if (currentPromptSession === null || nextPromptSession === null) {
    return false
  }
  if (currentPromptSession.kind !== nextPromptSession.kind) {
    return false
  }
  if (
    currentPromptSession.kind === 'reference-transform.axis' &&
    nextPromptSession.kind === 'reference-transform.axis'
  ) {
    return (
      currentPromptSession.mode === nextPromptSession.mode &&
      currentPromptSession.axis === nextPromptSession.axis
    )
  }
  if (
    currentPromptSession.kind === 'reference-transform.plane' &&
    nextPromptSession.kind === 'reference-transform.plane'
  ) {
    return (
      currentPromptSession.mode === nextPromptSession.mode &&
      currentPromptSession.plane === nextPromptSession.plane
    )
  }
  return false
}

const parseSignedFloatLiteral = (input: string): number | null => {
  const trimmed = input.trim()
  if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(trimmed)) {
    return null
  }
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}

export const parseReferenceTransformAxisInput = (
  input: string,
): { value: number; absolute: boolean } | null => {
  const trimmed = input.trim()
  if (trimmed.startsWith('@')) {
    const absoluteValue = parseSignedFloatLiteral(trimmed.slice(1))
    if (absoluteValue === null) {
      return null
    }
    return {
      value: absoluteValue,
      absolute: true,
    }
  }
  const relativeValue = parseSignedFloatLiteral(trimmed)
  if (relativeValue === null) {
    return null
  }
  return {
    value: relativeValue,
    absolute: false,
  }
}

export const applyReferenceTransformAxisValue = (
  transformOverride: ReferenceTransformOverride | null,
  mode: ReferenceTransformMode,
  axis: 'x' | 'y' | 'z',
  value: number,
  options?: {
    absolute?: boolean
  },
): ReferenceTransformOverride => {
  const nextTransformOverride = transformOverride ?? buildDefaultReferenceTransformOverride()
  const targetKey =
    mode === 'rotate' ? 'rotationDeg' : mode === 'scale' ? 'scale' : 'position'
  const currentValue = nextTransformOverride[targetKey][axis]
  return {
    position: { ...nextTransformOverride.position },
    rotationDeg: { ...nextTransformOverride.rotationDeg },
    scale: { ...nextTransformOverride.scale },
    [targetKey]: {
      ...nextTransformOverride[targetKey],
      [axis]: options?.absolute === true ? value : currentValue + value,
    },
  }
}

export const applyReferenceTransformPlaneValue = (
  transformOverride: ReferenceTransformOverride | null,
  mode: ReferenceTransformMode,
  plane: 'xy' | 'xz' | 'yz',
  value: { x: number; y: number; z: number },
): ReferenceTransformOverride => {
  const nextTransformOverride = transformOverride ?? buildDefaultReferenceTransformOverride()
  const targetKey =
    mode === 'rotate' ? 'rotationDeg' : mode === 'scale' ? 'scale' : 'position'
  const currentVector = nextTransformOverride[targetKey]
  const axes =
    plane === 'xy' ? (['x', 'y'] as const) : plane === 'xz' ? (['x', 'z'] as const) : (['y', 'z'] as const)
  const nextVector = { x: currentVector.x, y: currentVector.y, z: currentVector.z }
  axes.forEach((axis) => {
    nextVector[axis] = value[axis]
  })
  return {
    position: { ...nextTransformOverride.position },
    rotationDeg: { ...nextTransformOverride.rotationDeg },
    scale: { ...nextTransformOverride.scale },
    [targetKey]: nextVector,
  }
}

export const applyReferenceTransformVec3Value = (
  transformOverride: ReferenceTransformOverride | null,
  mode: ReferenceTransformMode,
  value: { x: number; y: number; z: number },
): ReferenceTransformOverride => {
  const nextTransformOverride = transformOverride ?? buildDefaultReferenceTransformOverride()
  const targetKey =
    mode === 'rotate' ? 'rotationDeg' : mode === 'scale' ? 'scale' : 'position'
  return {
    position: { ...nextTransformOverride.position },
    rotationDeg: { ...nextTransformOverride.rotationDeg },
    scale: { ...nextTransformOverride.scale },
    [targetKey]: { x: value.x, y: value.y, z: value.z },
  }
}

export const resolveReferenceTransformPromptSessionFromHandle = ({
  referenceWorkspace,
  stagedNavigationSession,
  activeHandle,
}: {
  referenceWorkspace: ReferenceWorkspace
  stagedNavigationSession: ConsoleStagedNavigationSession | null
  activeHandle: ActiveReferenceTransformHandle | null
}):
  | Extract<ConsolePromptSession, { kind: 'reference-transform.axis' }>
  | Extract<ConsolePromptSession, { kind: 'reference-transform.plane' }>
  | null => {
  if (activeHandle === null) {
    return null
  }
  if (activeHandle.kind === 'axis') {
    return buildReferenceTransformAxisPromptSession({
      referenceWorkspace,
      stagedNavigationSession,
      axis: activeHandle.axis,
    })
  }
  if (activeHandle.kind === 'plane') {
    return buildReferenceTransformPlanePromptSession({
      referenceWorkspace,
      stagedNavigationSession,
      plane: activeHandle.plane,
    })
  }
  return null
}

export const getReferenceTransformChannelSelectionFromPrompt = (
  promptSession: ConsolePromptSession | null,
): ReferenceTransformChannelSelection =>
  promptSession?.kind !== 'reference-transform.axis'
    ? null
    : {
        section: promptSession.mode,
        axis: promptSession.axis,
      }

export const getReferenceTransformChannelSelectionFromHandle = (
  activeHandle: ActiveReferenceTransformHandle | null,
): ReferenceTransformChannelSelection =>
  activeHandle?.kind !== 'axis'
    ? null
    : {
        section: activeHandle.mode,
        axis: activeHandle.axis,
      }

export const buildReferenceTransformStatusPath = ({
  referenceLabel,
  targetKindLabel = 'Reference',
  activeSession,
  stagedNavigationSession = null,
}: {
  referenceLabel: string
  targetKindLabel?: 'Reference' | 'Object' | 'Environment Light'
  activeSession: ViewerTransformStatusSession | null
  stagedNavigationSession?: ConsoleStagedNavigationSession | null
}): string => {
  if (activeSession === null) {
    return `${targetKindLabel === 'Object' ? 'Content' : targetKindLabel} > ${referenceLabel} > ${VIEWER_TRANSFORM_LABEL}`
  }
  const currentVector =
    activeSession.mode === 'rotate'
      ? activeSession.draftTransform.rotationDeg
      : activeSession.mode === 'scale'
        ? activeSession.draftTransform.scale
        : activeSession.draftTransform.position
  const breadcrumb = buildReferenceTransformConsoleBreadcrumb({
    referenceLabel,
    targetKindLabel,
    stagedNavigationSession,
    mode: activeSession.mode,
  })
  return `${formatReferenceTransformBreadcrumb(breadcrumb)} > ${formatReferenceTransformVec3Status(currentVector)}`
}
