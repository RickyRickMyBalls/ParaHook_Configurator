import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { routeKeyboardInput } from '../inputRouting'
import { ParaSelect } from './ParaSelect'
import { ParaSlider } from './ParaSlider'
import { ParaVec3Slider } from './ParaVec3Slider'
import { ReferenceTimelineGraph } from './ReferenceTimelineGraph'
import {
  ViewportOverlayToolPanel,
  type ViewportOverlayToolPanelResizeDirection,
} from './ViewportOverlayToolPanel'
import {
  DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE,
  getReferenceTransformHistoryLatestScrubIndex,
  selectReferenceWorkspaceItems,
  type ReferenceTransformSnapAxis,
  type ReferenceTransformSnapMode,
  useAppStore,
} from '../store/useAppStore'
import { getViewer } from '../viewerBridge'
import { SpaghettiContextMenu } from '../spaghetti/ui/SpaghettiContextMenu'
import {
  buildReferenceTimelineConfig,
  evaluateReferenceTimelineChannelValue,
  evaluateReferenceTransformOverrideWithTimelines,
  getReferenceTimelineDefaultRange,
  type ReferenceTimelineChannelKey,
  type ReferenceTimelineConfig,
  type ReferenceTimelineCycle,
  type ReferenceTimelineMode,
  type ReferenceTimelineRange,
} from '../references/referenceTimeline'
import { appendConsoleEntry, useConsoleStore } from '../console/useConsoleStore'
import {
  buildReferenceTransformStatusPath,
  getReferenceTransformChannelSelectionFromHandle,
  getReferenceTransformChannelSelectionFromPrompt,
} from '../console/referenceTransformConsole'

const formatTransformValue = (value: number): string => {
  if (Math.abs(value) < 0.0005) {
    return '0.00'
  }
  return value.toFixed(2)
}

const TRANSFORM_SNAP_PRESETS: Record<ReferenceTransformSnapMode, readonly number[]> = {
  translate: [1, 5, 10, 25, 50],
  rotate: [1, 5, 11.25, 15, 22.5, 30, 45, 90],
  scale: [0.1, 0.25, 0.5, 1],
}
const TIMELINE_CYCLE_OPTIONS: Array<{ value: ReferenceTimelineCycle; label: string }> = [
  { value: 'left-to-right', label: 'Left to Right' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'right-to-left', label: 'Right to Left' },
]

type Axis = 'x' | 'y' | 'z'
type TransformSectionKey = 'translate' | 'rotate' | 'scale'
type TransformChannelGroup = 'position' | 'rotationDeg' | 'scale'

type TransformChannelMeta = {
  channel: Exclude<ReferenceTimelineChannelKey, 'rotate-snap'>
  axis: Axis
  group: TransformChannelGroup
  sectionKey: TransformSectionKey
  label: string
  step: number
  allowWrap?: boolean
}

type TransformSectionMeta = {
  key: TransformSectionKey
  label: string
  channels: TransformChannelMeta[]
}

type ChannelContextMenuState = {
  channel: ReferenceTimelineChannelKey
  x: number
  y: number
}

type PendingShortcutActivation = 'translate-center' | 'rotate-center' | 'scale-center'

type ToolbarSize = {
  width: number
  height: number
}

type ResizeDirection = ViewportOverlayToolPanelResizeDirection

type ActiveKeyboardChannelSelection = {
  section: TransformSectionKey
  axis: Axis | 'all'
} | null

type ReferenceTransformHistoryEntries = NonNullable<
  ReturnType<typeof useAppStore.getState>['referenceWorkspace']['transformHistoryByReferenceId'][string]
>

type ReferenceTransformHistoryEntry = ReferenceTransformHistoryEntries[number]

type IndexedReferenceTransformHistoryEntry = {
  historyIndex: number
  entry: ReferenceTransformHistoryEntry
}

type GroupedReferenceTransformHistorySession = {
  sessionId: string
  sessionOrdinal: number
  entries: IndexedReferenceTransformHistoryEntry[]
}

const TRANSFORM_SECTIONS: TransformSectionMeta[] = [
  {
    key: 'translate',
    label: 'Move',
    channels: [
      { channel: 'move-x', axis: 'x', group: 'position', sectionKey: 'translate', label: 'X', step: 1 },
      { channel: 'move-y', axis: 'y', group: 'position', sectionKey: 'translate', label: 'Y', step: 1 },
      { channel: 'move-z', axis: 'z', group: 'position', sectionKey: 'translate', label: 'Z', step: 1 },
    ],
  },
  {
    key: 'rotate',
    label: 'Rotate',
    channels: [
      {
        channel: 'rotate-x',
        axis: 'x',
        group: 'rotationDeg',
        sectionKey: 'rotate',
        label: 'X',
        step: 1,
        allowWrap: true,
      },
      {
        channel: 'rotate-y',
        axis: 'y',
        group: 'rotationDeg',
        sectionKey: 'rotate',
        label: 'Y',
        step: 1,
        allowWrap: true,
      },
      {
        channel: 'rotate-z',
        axis: 'z',
        group: 'rotationDeg',
        sectionKey: 'rotate',
        label: 'Z',
        step: 1,
        allowWrap: true,
      },
    ],
  },
  {
    key: 'scale',
    label: 'Scale',
    channels: [
      { channel: 'scale-x', axis: 'x', group: 'scale', sectionKey: 'scale', label: 'X', step: 0.01 },
      { channel: 'scale-y', axis: 'y', group: 'scale', sectionKey: 'scale', label: 'Y', step: 0.01 },
      { channel: 'scale-z', axis: 'z', group: 'scale', sectionKey: 'scale', label: 'Z', step: 0.01 },
    ],
  },
]

const formatSnapValue = (value: number): string => {
  if (Math.abs(value - Math.round(value)) < 0.0005) {
    return `${Math.round(value)}`
  }
  return `${Number(value.toFixed(4))}`
}

const scaleSnapValuesFromDriver = (
  value: { x: number; y: number; z: number },
  nextDriverValue: number,
): { x: number; y: number; z: number } => {
  if (Math.abs(value.x) < 0.000001) {
    return {
      x: nextDriverValue,
      y: value.y,
      z: value.z,
    }
  }
  const scaleFactor = nextDriverValue / value.x
  return {
    x: nextDriverValue,
    y: Math.abs(value.y) < 0.000001 ? 0 : Number((value.y * scaleFactor).toFixed(4)),
    z: Math.abs(value.z) < 0.000001 ? 0 : Number((value.z * scaleFactor).toFixed(4)),
  }
}

const formatSpeedValue = (value: number): string => `${value.toFixed(2)}x`
const DEFAULT_TOOLBAR_WIDTH = 300
const MIN_TOOLBAR_WIDTH = 300
const MIN_TOOLBAR_HEIGHT = 240
const TOOLBAR_VIEWPORT_MARGIN = 12

const buildDefaultTransformOverride = () => ({
  position: { x: 0, y: 0, z: 0 },
  rotationDeg: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
})

const normalizeRange = (range: ReferenceTimelineRange): ReferenceTimelineRange => ({
  min: Math.min(range.min, range.max),
  max: Math.max(range.min, range.max),
})

const transformModeLabel = (mode: TransformSectionKey): string => {
  switch (mode) {
    case 'translate':
      return 'Move'
    case 'rotate':
      return 'Rotate'
    case 'scale':
      return 'Scale'
  }
}

const formatHistoryEntryKindLabel = (kind: ReferenceTransformHistoryEntry['kind']): string =>
  kind === 'move' ? 'Move' : kind === 'rotate' ? 'Rotate' : 'Scale'

const formatHistoryAbsoluteVectorLabel = (value: ReferenceTransformHistoryEntry['after']): string =>
  `Vec(${formatTransformValue(value.x)}, ${formatTransformValue(value.y)}, ${formatTransformValue(
    value.z,
  )})`

const formatHistoryDeltaValue = (value: number): string =>
  `${value >= 0 ? '+' : ''}${formatTransformValue(value)}`

const formatHistoryEntryTitle = (
  entry: ReferenceTransformHistoryEntry,
  historyIndex: number,
): string =>
  `${historyIndex + 1}. ${formatHistoryEntryKindLabel(entry.kind)} ${formatHistoryAbsoluteVectorLabel(entry.after)}`

const getHistoryEntrySliderConfig = (
  entry: ReferenceTransformHistoryEntry,
): { min: number; max: number; step: number; allowWrap?: boolean } => {
  switch (entry.kind) {
    case 'move':
      return { min: -300, max: 300, step: 1 }
    case 'rotate':
      return { min: -180, max: 180, step: 1, allowWrap: true }
    case 'scale':
      return { min: -9.99, max: 9.99, step: 0.01 }
  }
}

function HistoryLockIcon({ locked }: { locked: boolean }) {
  return (
    <svg
      className="ReferenceTransformToolbarHistoryLockIcon"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
    >
      <rect x="3.5" y="7" width="9" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d={locked ? 'M5.5 7V5.75a2.5 2.5 0 0 1 5 0V7' : 'M10.5 7V5.75a2.5 2.5 0 0 0-5 0'}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const groupReferenceTransformHistoryEntries = (
  entries: ReadonlyArray<ReferenceTransformHistoryEntry>,
): GroupedReferenceTransformHistorySession[] => {
  const groupsBySessionId = new Map<string, GroupedReferenceTransformHistorySession>()
  entries.forEach((entry, historyIndex) => {
    const currentGroup = groupsBySessionId.get(entry.sessionId)
    if (currentGroup === undefined) {
      groupsBySessionId.set(entry.sessionId, {
        sessionId: entry.sessionId,
        sessionOrdinal: entry.sessionOrdinal,
        entries: [{ historyIndex, entry }],
      })
      return
    }
    currentGroup.entries.push({ historyIndex, entry })
  })
  return [...groupsBySessionId.values()]
}

export function ReferenceTransformToolbar() {
  const referenceWorkspace = useAppStore((state) => state.referenceWorkspace)
  const beginReferenceTransformEntry = useAppStore((state) => state.beginReferenceTransformEntry)
  const exitReferenceTransformShell = useAppStore((state) => state.exitReferenceTransformShell)
  const requestReferenceTransformShellExit = useAppStore(
    (state) => state.requestReferenceTransformShellExit,
  )
  const setActiveReferenceTransformSpace = useAppStore(
    (state) => state.setActiveReferenceTransformSpace,
  )
  const setActiveReferenceTransformDraft = useAppStore(
    (state) => state.setActiveReferenceTransformDraft,
  )
  const resetReferenceTransform = useAppStore((state) => state.resetReferenceTransform)
  const cancelActiveReferenceTransformEntry = useAppStore(
    (state) => state.cancelActiveReferenceTransformEntry,
  )
  const setReferenceChannelClampRange = useAppStore((state) => state.setReferenceChannelClampRange)
  const setReferenceTimelineMode = useAppStore((state) => state.setReferenceTimelineMode)
  const setReferenceTimelineSpeed = useAppStore((state) => state.setReferenceTimelineSpeed)
  const setReferenceTimelineCycle = useAppStore((state) => state.setReferenceTimelineCycle)
  const setReferenceTimelinePoints = useAppStore((state) => state.setReferenceTimelinePoints)
  const setReferenceTransformSnapEnabled = useAppStore(
    (state) => state.setReferenceTransformSnapEnabled,
  )
  const setReferenceTransformSnapValue = useAppStore(
    (state) => state.setReferenceTransformSnapValue,
  )
  const setReferenceTransformSnapAxisValue = useAppStore(
    (state) => state.setReferenceTransformSnapAxisValue,
  )
  const setReferenceTransformSnapLocked = useAppStore(
    (state) => state.setReferenceTransformSnapLocked,
  )
  const setReferenceTransformMoveSnapDotScale = useAppStore(
    (state) => state.setReferenceTransformMoveSnapDotScale,
  )
  const setReferenceTransformMoveSnapDotsEnabled = useAppStore(
    (state) => state.setReferenceTransformMoveSnapDotsEnabled,
  )
  const setReferenceTransformPreviewLastMoveSnapDotsEnabled = useAppStore(
    (state) => state.setReferenceTransformPreviewLastMoveSnapDotsEnabled,
  )
  const setReferenceTransformMoveSnapDotDelayMs = useAppStore(
    (state) => state.setReferenceTransformMoveSnapDotDelayMs,
  )
  const setReferenceTransformMoveSnapDotNearScale = useAppStore(
    (state) => state.setReferenceTransformMoveSnapDotNearScale,
  )
  const setReferenceTransformMoveSnapDotFarScale = useAppStore(
    (state) => state.setReferenceTransformMoveSnapDotFarScale,
  )
  const setReferenceTransformMoveSnapDotVisibleRadiusMultiplier = useAppStore(
    (state) => state.setReferenceTransformMoveSnapDotVisibleRadiusMultiplier,
  )
  const setReferenceTransformRotateSnapPreviewEnabled = useAppStore(
    (state) => state.setReferenceTransformRotateSnapPreviewEnabled,
  )
  const setReferenceTransformRotateSnapPreviewLineSize = useAppStore(
    (state) => state.setReferenceTransformRotateSnapPreviewLineSize,
  )
  const setReferenceTransformRotateSnapPreviewLineThickness = useAppStore(
    (state) => state.setReferenceTransformRotateSnapPreviewLineThickness,
  )
  const setReferenceTransformRotateSnapPreviewRadiusDeg = useAppStore(
    (state) => state.setReferenceTransformRotateSnapPreviewRadiusDeg,
  )
  const setReferenceTransformRotateSnapPreviewDelayMs = useAppStore(
    (state) => state.setReferenceTransformRotateSnapPreviewDelayMs,
  )
  const toggleReferenceTransformHistoryLock = useAppStore(
    (state) => state.toggleReferenceTransformHistoryLock,
  )
  const setReferenceTransformHistoryEntryDeltaValue = useAppStore(
    (state) => state.setReferenceTransformHistoryEntryDeltaValue,
  )
  const deleteReferenceTransformHistoryEntry = useAppStore(
    (state) => state.deleteReferenceTransformHistoryEntry,
  )
  const setActiveReferenceTransformHistoryScrubIndex = useAppStore(
    (state) => state.setActiveReferenceTransformHistoryScrubIndex,
  )
  const mergeReferenceTransformHistory = useAppStore((state) => state.mergeReferenceTransformHistory)
  const consolePromptSession = useConsoleStore((state) => state.consolePromptSession)

  const referenceItems = useMemo(
    () => selectReferenceWorkspaceItems({ referenceWorkspace }),
    [referenceWorkspace],
  )

  const activeReference = useMemo(
    () =>
      referenceWorkspace.activeReferenceTransformSession === null
        ? null
        : referenceItems.find(
            (item) =>
              item.referenceId ===
              referenceWorkspace.activeReferenceTransformSession?.referenceId,
          ) ?? null,
    [referenceItems, referenceWorkspace.activeReferenceTransformSession],
  )
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [size, setSize] = useState<ToolbarSize | null>(null)
  const [scaleLocked, setScaleLocked] = useState(false)
  const [isClampEditing, setIsClampEditing] = useState(false)
  const [isCameraLocked, setIsCameraLocked] = useState(false)
  const [showShortcutHelp, setShowShortcutHelp] = useState(false)
  const [timelineNowMs, setTimelineNowMs] = useState(() => performance.now())
  const [channelContextMenu, setChannelContextMenu] = useState<ChannelContextMenuState | null>(null)
  const [pendingShortcutActivation, setPendingShortcutActivation] =
    useState<PendingShortcutActivation | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<TransformSectionKey, boolean>>({
    translate: true,
    rotate: true,
    scale: true,
  })
  const [historyExpanded, setHistoryExpanded] = useState(true)
  const [snapExpanded, setSnapExpanded] = useState(true)
  const [quickSnapButtonsVisibleByMode, setQuickSnapButtonsVisibleByMode] = useState<
    Record<ReferenceTransformSnapMode, boolean>
  >({
    translate: false,
    rotate: false,
    scale: false,
  })
  const [expandedSnapVec3ByMode, setExpandedSnapVec3ByMode] = useState<
    Record<ReferenceTransformSnapMode, boolean>
  >({
    translate: false,
    rotate: false,
    scale: false,
  })
  const [expandedHistorySessions, setExpandedHistorySessions] = useState<Record<string, boolean>>({})
  const [selectedSection, setSelectedSection] = useState<TransformSectionKey | null>(
    referenceWorkspace.activeReferenceTransformSession?.mode ?? null,
  )
  const [activeKeyboardChannelSelection, setActiveKeyboardChannelSelection] =
    useState<ActiveKeyboardChannelSelection>(null)

  useEffect(() => {
    if (activeReference === null) {
      return
    }
    if (position !== null) {
      return
    }
    const viewportWidth = typeof window === 'undefined' ? 1280 : window.innerWidth
    setPosition({
      x: Math.max(
        TOOLBAR_VIEWPORT_MARGIN,
        viewportWidth - DEFAULT_TOOLBAR_WIDTH - TOOLBAR_VIEWPORT_MARGIN,
      ),
      y: 22,
    })
  }, [activeReference, position])

  useEffect(() => {
    return () => {
      getViewer()?.setReferenceCameraLock(null)
    }
  }, [])

  useEffect(() => {
    setChannelContextMenu(null)
  }, [activeReference?.referenceId])

  const activeSession = referenceWorkspace.activeReferenceTransformSession
  const activeMode = activeSession?.mode ?? 'translate'
  const activeSpace = activeSession?.space ?? 'local'
  const entryActive = activeSession?.entryActive ?? false

  const activeReferenceId = activeSession?.referenceId ?? null
  const activeTransformOverride =
    activeSession?.draftTransform ?? buildDefaultTransformOverride()
  const transformHistory =
    activeReferenceId === null
      ? []
      : referenceWorkspace.transformHistoryByReferenceId[activeReferenceId] ?? []
  const latestHistoryScrubIndex = useMemo(
    () => getReferenceTransformHistoryLatestScrubIndex(transformHistory),
    [transformHistory],
  )
  const activeHistoryScrubIndex = useMemo(
    () =>
      Math.min(
        latestHistoryScrubIndex,
        Math.max(0, Math.trunc(activeSession?.historyScrubIndex ?? latestHistoryScrubIndex)),
      ),
    [activeSession?.historyScrubIndex, latestHistoryScrubIndex],
  )
  const historyScrubActive = activeHistoryScrubIndex < latestHistoryScrubIndex
  const groupedTransformHistory = useMemo(
    () => groupReferenceTransformHistoryEntries(transformHistory),
    [transformHistory],
  )
  const channelClampRanges =
    activeReferenceId === null
      ? {}
      : referenceWorkspace.channelClampRangeByReferenceId[activeReferenceId] ?? {}
  const channelModes =
    activeReferenceId === null
      ? {}
      : referenceWorkspace.timelineModeByReferenceId[activeReferenceId] ?? {}
  const channelTimelineConfigs =
    activeReferenceId === null
      ? {}
      : referenceWorkspace.timelineConfigByReferenceId[activeReferenceId] ?? {}
  const transformSnapState =
    activeReferenceId === null
      ? DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
      : referenceWorkspace.transformSnapByReferenceId[activeReferenceId] ??
        DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
  const moveSnapDotScale = referenceWorkspace.moveSnapDotScale
  const moveSnapDotsEnabled = referenceWorkspace.moveSnapDotsEnabled
  const previewLastMoveSnapDotsEnabled = referenceWorkspace.previewLastMoveSnapDotsEnabled
  const moveSnapDotDelayMs = referenceWorkspace.moveSnapDotDelayMs
  const moveSnapDotNearScale = referenceWorkspace.moveSnapDotNearScale
  const moveSnapDotFarScale = referenceWorkspace.moveSnapDotFarScale
  const moveSnapDotVisibleRadiusMultiplier =
    referenceWorkspace.moveSnapDotVisibleRadiusMultiplier
  const rotateSnapPreviewEnabled = referenceWorkspace.rotateSnapPreviewEnabled
  const rotateSnapPreviewLineSize = referenceWorkspace.rotateSnapPreviewLineSize
  const rotateSnapPreviewLineThickness = referenceWorkspace.rotateSnapPreviewLineThickness
  const rotateSnapPreviewRadiusDeg = referenceWorkspace.rotateSnapPreviewRadiusDeg
  const rotateSnapPreviewDelayMs = referenceWorkspace.rotateSnapPreviewDelayMs

  const getChannelRange = (channel: ReferenceTimelineChannelKey): ReferenceTimelineRange =>
    normalizeRange(channelClampRanges[channel] ?? getReferenceTimelineDefaultRange(channel))
  const getChannelMode = (channel: ReferenceTimelineChannelKey): ReferenceTimelineMode =>
    channelModes[channel] ?? 'basic'
  const getChannelConfig = (channel: ReferenceTimelineChannelKey): ReferenceTimelineConfig | null =>
    channelTimelineConfigs[channel] ?? null

  const hasActiveReferenceTimelines = useMemo(
    () => Object.values(channelModes).some((mode) => mode === 'timeline'),
    [channelModes],
  )

  useEffect(() => {
    if (!hasActiveReferenceTimelines) {
      return
    }
    let frameId = 0
    const tick = (nextNowMs: number) => {
      setTimelineNowMs(nextNowMs)
      frameId = window.requestAnimationFrame(tick)
    }
    frameId = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [hasActiveReferenceTimelines])

  const evaluatedTransformOverride = useMemo(
    () =>
      evaluateReferenceTransformOverrideWithTimelines(
        activeTransformOverride,
        timelineNowMs,
        (channel) => getChannelMode(channel),
        (channel) => getChannelConfig(channel),
        (channel) => getChannelRange(channel),
      ),
    [activeTransformOverride, timelineNowMs, channelClampRanges, channelModes, channelTimelineConfigs],
  )

  const evaluatedTransformSnap = useMemo(
    () => ({
      ...transformSnapState,
      translate: {
        ...transformSnapState.translate,
        values: { ...transformSnapState.translate.values },
      },
      scale: {
        ...transformSnapState.scale,
        values: { ...transformSnapState.scale.values },
      },
      rotate: {
        ...transformSnapState.rotate,
        values:
          getChannelMode('rotate-snap') === 'timeline' && transformSnapState.rotate.xyzLocked
            ? scaleSnapValuesFromDriver(
                transformSnapState.rotate.values,
                evaluateReferenceTimelineChannelValue(
                  getChannelMode('rotate-snap'),
                  getChannelConfig('rotate-snap'),
                  transformSnapState.rotate.values.x,
                  getChannelRange('rotate-snap'),
                  timelineNowMs,
                ),
              )
            : { ...transformSnapState.rotate.values },
      },
    }),
    [transformSnapState, timelineNowMs, channelClampRanges, channelModes, channelTimelineConfigs],
  )

  const activeTranslateStep =
    transformSnapState.translate.enabled
      ? Math.max(evaluatedTransformSnap.translate.values.x, 0.0001)
      : 1
  const activeRotateStep =
    transformSnapState.rotate.enabled
      ? Math.max(evaluatedTransformSnap.rotate.values.x, 0.0001)
      : 1
  const activeScaleStep =
    transformSnapState.scale.enabled
      ? Math.max(evaluatedTransformSnap.scale.values.x, 0.0001)
      : 0.01

  const activeSessionPath = useMemo(
    () =>
      buildReferenceTransformStatusPath({
        referenceLabel: activeReference?.label ?? 'Reference',
        activeSession:
          activeSession === null
            ? null
            : {
                ...activeSession,
                draftTransform: evaluatedTransformOverride,
              },
      }),
    [activeReference?.label, activeSession, evaluatedTransformOverride],
  )

  useEffect(() => {
    if (activeReferenceId === null) {
      setPendingShortcutActivation(null)
      setActiveKeyboardChannelSelection(null)
    }
  }, [activeReferenceId])

  useEffect(() => {
    const sessionIds = groupedTransformHistory.map((session) => session.sessionId)
    const newestSessionId = sessionIds.at(-1) ?? null
    setExpandedHistorySessions((current) => {
      if (sessionIds.length === 0) {
        return Object.keys(current).length === 0 ? current : {}
      }
      const hasNewSession = sessionIds.some((sessionId) => current[sessionId] === undefined)
      const next: Record<string, boolean> = {}
      for (const sessionId of sessionIds) {
        if (hasNewSession) {
          next[sessionId] = sessionId === newestSessionId
          continue
        }
        next[sessionId] = current[sessionId] ?? sessionId === newestSessionId
      }
      const currentKeys = Object.keys(current)
      const changed =
        currentKeys.length !== sessionIds.length ||
        sessionIds.some((sessionId) => current[sessionId] !== next[sessionId]) ||
        currentKeys.some((sessionId) => next[sessionId] === undefined)
      return changed ? next : current
    })
  }, [groupedTransformHistory])

  useEffect(() => {
    if (activeReferenceId === null) {
      setSelectedSection(null)
      setActiveKeyboardChannelSelection(null)
      return
    }
    setSelectedSection(activeMode)
  }, [activeMode, activeReferenceId])

  useEffect(() => {
    if (pendingShortcutActivation === null) {
      return
    }
    const viewer = getViewer()
    if (viewer === null) {
      return
    }
    if (pendingShortcutActivation === 'translate-center' && activeMode === 'translate') {
      viewer.activateTranslateCenterHandle()
      setPendingShortcutActivation(null)
      return
    }
    if (pendingShortcutActivation === 'rotate-center' && activeMode === 'rotate') {
      viewer.activateRotateCenterHandle()
      setPendingShortcutActivation(null)
      return
    }
    if (pendingShortcutActivation === 'scale-center' && activeMode === 'scale') {
      viewer.activateScaleCenterHandle()
      setPendingShortcutActivation(null)
    }
  }, [activeMode, pendingShortcutActivation])

  const activateModeShortcut = (mode: TransformSectionKey) => {
    appendConsoleEntry({
      layer: 'Shortcuts',
      text: transformModeLabel(mode),
      source: 'reference-transform',
      severity: 'info',
    })
    setSelectedSection(mode)
    setActiveKeyboardChannelSelection({ section: mode, axis: 'all' })
    setPendingShortcutActivation(
      mode === 'translate'
        ? 'translate-center'
        : mode === 'rotate'
          ? 'rotate-center'
          : 'scale-center',
    )
    beginReferenceTransformEntry(mode)
  }

  const activateAxisShortcut = (section: TransformSectionKey, axis: Axis) => {
    setSelectedSection(section)
    setActiveKeyboardChannelSelection({ section, axis })
    appendConsoleEntry({
      layer: 'Shortcuts',
      text: `${transformModeLabel(section)}: ${axis.toUpperCase()} axis`,
      source: 'reference-transform',
      severity: 'info',
    })
    if (section === 'translate') {
      getViewer()?.activateTranslateHandle(axis.toUpperCase() as 'X' | 'Y' | 'Z')
      return
    }
    if (section === 'rotate') {
      getViewer()?.activateRotateHandle(axis.toUpperCase() as 'X' | 'Y' | 'Z')
      return
    }
    getViewer()?.activateScaleHandle(axis.toUpperCase() as 'X' | 'Y' | 'Z')
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }
      const key = event.key.toLowerCase()
      const routing = routeKeyboardInput({
        event,
        referenceTransformActive: activeReferenceId !== null,
      })
      if (routing.owner !== 'reference-transform' || routing.decision !== 'handle') {
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        getViewer()?.commitReferenceTransformSession()
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        if (activeReferenceId !== null) {
          getViewer()?.cancelReferenceTransformDrag()
          getViewer()?.clearReferenceTransformHandle()
          if (entryActive) {
            cancelActiveReferenceTransformEntry()
          } else {
            exitReferenceTransformShell()
          }
        }
        return
      }
      if (key === 'm') {
        event.preventDefault()
        activateModeShortcut('translate')
        return
      }
      if (activeMode === 'translate' && (key === 'x' || key === 'y' || key === 'z')) {
        event.preventDefault()
        activateAxisShortcut('translate', key as Axis)
        return
      }
      if (key === 'r') {
        event.preventDefault()
        activateModeShortcut('rotate')
        return
      }
      if (activeMode === 'rotate' && (key === 'x' || key === 'y' || key === 'z')) {
        event.preventDefault()
        activateAxisShortcut('rotate', key as Axis)
        return
      }
      if (key === 's') {
        event.preventDefault()
        activateModeShortcut('scale')
        return
      }
      if (activeMode === 'scale' && (key === 'x' || key === 'y' || key === 'z')) {
        event.preventDefault()
        activateAxisShortcut('scale', key as Axis)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    activeMode,
    activeReferenceId,
    beginReferenceTransformEntry,
    cancelActiveReferenceTransformEntry,
    entryActive,
    exitReferenceTransformShell,
  ])

  const updateTransformAxis = (
    group: TransformChannelGroup,
    axis: Axis,
    value: number,
  ) => {
    if (activeReferenceId === null) {
      return
    }
    const nextOverride = {
      position: { ...activeTransformOverride.position },
      rotationDeg: { ...activeTransformOverride.rotationDeg },
      scale: { ...activeTransformOverride.scale },
    }
    if (group === 'scale' && scaleLocked) {
      nextOverride.scale = {
        x: value,
        y: value,
        z: value,
      }
    } else {
      nextOverride[group] = {
        ...nextOverride[group],
        [axis]: value,
      }
    }
    setActiveReferenceTransformDraft(nextOverride)
  }

  const beginToolbarDrag = (pointerId: number | null, startX: number, startY: number) => {
    const host = toolbarRef.current
    if (host === null) {
      return
    }
    const startPosition = position ?? {
      x: host.offsetLeft,
      y: host.offsetTop,
    }

    const move = (moveEvent: PointerEvent | MouseEvent) => {
      if ('pointerId' in moveEvent && pointerId !== null && moveEvent.pointerId !== pointerId) {
        return
      }
      const nextX = startPosition.x + (moveEvent.clientX - startX)
      const nextY = startPosition.y + (moveEvent.clientY - startY)
      const viewportWidth = typeof window === 'undefined' ? nextX + host.offsetWidth : window.innerWidth
      const viewportHeight =
        typeof window === 'undefined' ? nextY + host.offsetHeight : window.innerHeight
      setPosition({
        x: Math.max(12, Math.min(nextX, viewportWidth - host.offsetWidth - 12)),
        y: Math.max(12, Math.min(nextY, viewportHeight - host.offsetHeight - 12)),
      })
    }

    const stop = (stopEvent?: PointerEvent | MouseEvent) => {
      if (
        stopEvent !== undefined &&
        'pointerId' in stopEvent &&
        pointerId !== null &&
        stopEvent.pointerId !== pointerId
      ) {
        return
      }
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', stop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', stop)
  }

  const handleHeaderPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    beginToolbarDrag(event.pointerId, event.clientX, event.clientY)
  }

  const handleHeaderMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    beginToolbarDrag(null, event.clientX, event.clientY)
  }

  const handleResizePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
    direction: ResizeDirection,
  ) => {
    const host = toolbarRef.current
    if (host === null || position === null) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const startX = event.clientX
    const startY = event.clientY
    const startWidth = host.offsetWidth
    const startHeight = host.offsetHeight
    const startPosition = position

    const move = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      const viewportWidth = typeof window === 'undefined' ? 1440 : window.innerWidth
      const viewportHeight = typeof window === 'undefined' ? 900 : window.innerHeight

      let nextWidth = startWidth
      let nextHeight = startHeight
      let nextX = startPosition.x
      let nextY = startPosition.y

      if (direction.includes('e')) {
        nextWidth = startWidth + deltaX
      }
      if (direction.includes('s')) {
        nextHeight = startHeight + deltaY
      }
      if (direction.includes('w')) {
        nextWidth = startWidth - deltaX
        nextX = startPosition.x + deltaX
      }
      if (direction.includes('n')) {
        nextHeight = startHeight - deltaY
        nextY = startPosition.y + deltaY
      }

      const maxWidth = Math.max(MIN_TOOLBAR_WIDTH, viewportWidth - TOOLBAR_VIEWPORT_MARGIN * 2)
      const maxHeight = Math.max(MIN_TOOLBAR_HEIGHT, viewportHeight - TOOLBAR_VIEWPORT_MARGIN * 2)
      nextWidth = Math.min(Math.max(nextWidth, MIN_TOOLBAR_WIDTH), maxWidth)
      nextHeight = Math.min(Math.max(nextHeight, MIN_TOOLBAR_HEIGHT), maxHeight)

      if (direction.includes('w')) {
        nextX = startPosition.x + (startWidth - nextWidth)
      }
      if (direction.includes('n')) {
        nextY = startPosition.y + (startHeight - nextHeight)
      }

      nextX = Math.max(
        TOOLBAR_VIEWPORT_MARGIN,
        Math.min(nextX, viewportWidth - nextWidth - TOOLBAR_VIEWPORT_MARGIN),
      )
      nextY = Math.max(
        TOOLBAR_VIEWPORT_MARGIN,
        Math.min(nextY, viewportHeight - nextHeight - TOOLBAR_VIEWPORT_MARGIN),
      )

      setPosition({ x: nextX, y: nextY })
      setSize({ width: nextWidth, height: nextHeight })
    }

    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  if (activeReference === null || activeReferenceId === null) {
    return null
  }

  const handleFrameReference = () => {
    getViewer()?.frameReference(activeReferenceId)
  }

  const handleToggleCameraLock = () => {
    const nextLocked = !isCameraLocked
    setIsCameraLocked(nextLocked)
    const viewer = getViewer()
    viewer?.setReferenceCameraLock(nextLocked ? activeReferenceId : null)
    appendConsoleEntry({
      layer: 'View',
      text: `${nextLocked ? 'Lock' : 'Unlock'} camera: ${activeReference.label}`,
      source: 'reference-transform',
      severity: 'info',
    })
  }

  const updateTransformSnapEnabled = (mode: ReferenceTransformSnapMode, enabled: boolean) => {
    setReferenceTransformSnapEnabled(activeReferenceId, mode, enabled)
    appendConsoleEntry({
      layer: 'Transforms',
      text: `${transformModeLabel(mode)} snap ${enabled ? 'enabled' : 'disabled'}`,
      source: 'reference-transform',
      severity: 'info',
    })
  }

  const updateTransformSnapValue = (mode: ReferenceTransformSnapMode, value: number) => {
    setReferenceTransformSnapValue(activeReferenceId, mode, value)
    appendConsoleEntry({
      layer: 'Transforms',
      text: `${transformModeLabel(mode)} snap value: ${formatSnapValue(value)}`,
      source: 'reference-transform',
      severity: 'info',
    })
  }

  const updateTransformSnapAxisValue = (
    mode: ReferenceTransformSnapMode,
    axis: ReferenceTransformSnapAxis,
    value: number,
  ) => {
    setReferenceTransformSnapAxisValue(activeReferenceId, mode, axis, value)
    appendConsoleEntry({
      layer: 'Transforms',
      text: `${transformModeLabel(mode)} ${axis.toUpperCase()} snap value: ${formatSnapValue(value)}`,
      source: 'reference-transform',
      severity: 'info',
    })
  }

  const updateTransformSnapLocked = (mode: ReferenceTransformSnapMode, locked: boolean) => {
    setReferenceTransformSnapLocked(activeReferenceId, mode, locked)
    appendConsoleEntry({
      layer: 'Transforms',
      text: `${transformModeLabel(mode)} snap XYZ ${locked ? 'locked' : 'unlocked'}`,
      source: 'reference-transform',
      severity: 'info',
    })
  }

  const handleTimelineModeChange = (
    channel: ReferenceTimelineChannelKey,
    mode: ReferenceTimelineMode,
  ) => {
    if (mode === 'timeline' && channel === 'rotate-snap') {
      updateTransformSnapEnabled('rotate', true)
    }
    setReferenceTimelineMode(activeReferenceId, channel, mode, performance.now())
    setChannelContextMenu(null)
  }

  const openChannelContextMenu = (
    event: ReactMouseEvent<Element>,
    channel: ReferenceTimelineChannelKey,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    setChannelContextMenu({
      channel,
      x: event.clientX,
      y: event.clientY,
    })
  }

  const renderTimelineControls = (
    channel: ReferenceTimelineChannelKey,
    baseValue: number,
  ) => {
    const range = getChannelRange(channel)
    const config = getChannelConfig(channel) ?? buildReferenceTimelineConfig(baseValue, range, performance.now())
    return (
      <div className="ReferenceTransformToolbarTimelineBox">
        <div className="ReferenceTransformToolbarTimelineControls">
          <ParaSlider
            label="Speed"
            min={0.05}
            max={4}
            step={0.05}
            value={config.speed}
            onChange={(value) => setReferenceTimelineSpeed(activeReferenceId, channel, value)}
            formatValue={formatSpeedValue}
            displayValue={formatSpeedValue(config.speed)}
          />
        </div>
        <ReferenceTimelineGraph
          points={config.points}
          range={range}
          onChange={(points) => setReferenceTimelinePoints(activeReferenceId, channel, points)}
        />
        <div className="ReferenceTransformToolbarTimelineFooter">
          <span className="ReferenceTransformToolbarInlineLabel">Cycle</span>
          <select
            className="ReferenceTransformToolbarCycleSelect"
            value={config.cycle}
            onChange={(event) =>
              setReferenceTimelineCycle(
                activeReferenceId,
                channel,
                event.target.value as ReferenceTimelineCycle,
              )
            }
          >
            {TIMELINE_CYCLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  const renderChannelRow = (
    options: {
      channel: ReferenceTimelineChannelKey
      label: string
      value: number
      liveValue: number
      min: number
      max: number
      step: number
      formatValue: (value: number) => string
      onChange: (value: number) => void
      isHighlighted?: boolean
      allowWrap?: boolean
      showContinuousDragPreview?: boolean
    },
  ) => {
    const range = getChannelRange(options.channel)
    const isTimeline = getChannelMode(options.channel) === 'timeline'
    return (
      <div
        key={options.channel}
        className={`ReferenceTransformToolbarChannelBox ${isTimeline ? 'isTimeline' : ''} ${
          options.isHighlighted ? 'isHighlighted' : ''
        }`}
        data-channel={options.channel}
        onContextMenu={(event) => openChannelContextMenu(event, options.channel)}
      >
        <ParaSlider
          label={options.label}
          value={options.value}
          displayedTrackValue={isTimeline ? options.liveValue : undefined}
          min={options.min}
          max={options.max}
          step={options.step}
          allowWrap={options.allowWrap}
          showContinuousDragPreview={options.showContinuousDragPreview}
          clampMin={range.min}
          clampMax={range.max}
          isEditingClamp={isClampEditing}
          onChange={options.onChange}
          onClampChange={(nextRange) =>
            setReferenceChannelClampRange(activeReferenceId, options.channel, normalizeRange(nextRange))
          }
          displayLabel={
            isClampEditing ? options.formatValue(range.min) : options.label
          }
          displayValue={
            isClampEditing
              ? options.formatValue(range.max)
              : options.formatValue(isTimeline ? options.liveValue : options.value)
          }
          formatValue={options.formatValue}
          onContextMenu={(event) => openChannelContextMenu(event, options.channel)}
        />
        {isTimeline ? renderTimelineControls(options.channel, options.value) : null}
      </div>
    )
  }

  const renderSnapModeRow = (mode: ReferenceTransformSnapMode) => {
    const snapState = transformSnapState[mode]
    const evaluatedSnapState = evaluatedTransformSnap[mode]
    const quickButtonsVisible = quickSnapButtonsVisibleByMode[mode]
    const vec3Expanded = expandedSnapVec3ByMode[mode]
    const min =
      mode === 'translate'
        ? 0.0001
        : mode === 'rotate'
          ? getChannelRange('rotate-snap').min
          : 0.0001
    const max =
      mode === 'translate' ? 300 : mode === 'rotate' ? getChannelRange('rotate-snap').max : 10
    const step = mode === 'translate' ? 0.01 : mode === 'rotate' ? 0.0001 : 0.01
    return (
      <div key={mode} className="ReferenceTransformToolbarSnapModeGroup">
        <div className="ReferenceTransformToolbarTransformSectionHeader ReferenceTransformToolbarTransformSectionHeader--nested">
          <span className="ReferenceTransformToolbarTransformSectionLabel">
            {transformModeLabel(mode)}
          </span>
          <div className="ReferenceTransformToolbarTransformSectionActions">
            <button
              type="button"
              className={`ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact ${snapState.enabled ? 'isActive' : ''}`}
              onClick={() => updateTransformSnapEnabled(mode, !snapState.enabled)}
            >
              {snapState.enabled ? 'On' : 'Off'}
            </button>
            <button
              type="button"
              className={`ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact ReferenceTransformToolbarButton--lock ${snapState.xyzLocked ? 'isActive' : ''}`}
              onClick={() => updateTransformSnapLocked(mode, !snapState.xyzLocked)}
            >
              {snapState.xyzLocked ? 'Locked' : 'Unlocked'}
            </button>
            <button
              type="button"
              className={`ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact ReferenceTransformToolbarButton--quick ${quickButtonsVisible ? 'isActive' : ''}`}
              aria-label={`${quickButtonsVisible ? 'Hide' : 'Show'} ${transformModeLabel(mode)} quick snap buttons`}
              title={`${quickButtonsVisible ? 'Hide' : 'Show'} quick snap buttons`}
              onClick={() =>
                setQuickSnapButtonsVisibleByMode((current) => ({
                  ...current,
                  [mode]: !current[mode],
                }))
              }
            >
              Q
            </button>
          </div>
        </div>
        {snapState.xyzLocked ? (
          mode === 'rotate' ? (
            renderChannelRow({
              channel: 'rotate-snap',
              label: 'Snap',
              value: snapState.values.x,
              liveValue: evaluatedSnapState.values.x,
              min,
              max,
              step,
              formatValue: formatSnapValue,
              onChange: (value) => updateTransformSnapAxisValue(mode, 'x', value),
              isHighlighted: false,
            })
          ) : (
            <div className="ReferenceTransformToolbarChannelBox">
              <ParaSlider
                label="Snap"
                value={snapState.values.x}
                min={min}
                max={max}
                step={step}
                onChange={(value) => updateTransformSnapAxisValue(mode, 'x', value)}
                displayLabel="Snap"
                displayValue={formatSnapValue(evaluatedSnapState.values.x)}
                formatValue={formatSnapValue}
              />
            </div>
          )
        ) : (
          <div className="ReferenceTransformToolbarSnapVec3Group">
            <div className="ReferenceTransformToolbarSnapVec3Toggle">
              <button
                type="button"
                className="ReferenceTransformToolbarSnapVec3Chevron"
                aria-label={`${vec3Expanded ? 'Collapse' : 'Expand'} ${transformModeLabel(mode)} Vec3 snap axes`}
                aria-expanded={vec3Expanded}
                onClick={() =>
                  setExpandedSnapVec3ByMode((current) => ({
                    ...current,
                    [mode]: !current[mode],
                  }))
                }
              >
                <span className="ReferenceTransformToolbarSectionToggle">
                  {vec3Expanded ? 'v' : '>'}
                </span>
              </button>
              <div className="ReferenceTransformToolbarChannelBox ReferenceTransformToolbarChannelBox--snap-vec3">
                <ParaVec3Slider
                  value={snapState.values}
                  min={min}
                  max={max}
                  step={step}
                  allowWrap={mode === 'rotate'}
                  onChangeAxis={(axis, value) => updateTransformSnapAxisValue(mode, axis, value)}
                  formatValue={(_axis, value) => formatSnapValue(value)}
                  displayValue={(axis) => formatSnapValue(evaluatedSnapState.values[axis])}
                />
              </div>
            </div>
            {vec3Expanded ? (
              <div className="ReferenceTransformToolbarSnapVec3Rows">
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="X"
                    value={snapState.values.x}
                    min={min}
                    max={max}
                    step={step}
                    allowWrap={mode === 'rotate'}
                    onChange={(value) => updateTransformSnapAxisValue(mode, 'x', value)}
                    displayLabel="X"
                    displayValue={formatSnapValue(evaluatedSnapState.values.x)}
                    formatValue={formatSnapValue}
                  />
                </div>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="Y"
                    value={snapState.values.y}
                    min={min}
                    max={max}
                    step={step}
                    allowWrap={mode === 'rotate'}
                    onChange={(value) => updateTransformSnapAxisValue(mode, 'y', value)}
                    displayLabel="Y"
                    displayValue={formatSnapValue(evaluatedSnapState.values.y)}
                    formatValue={formatSnapValue}
                  />
                </div>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="Z"
                    value={snapState.values.z}
                    min={min}
                    max={max}
                    step={step}
                    allowWrap={mode === 'rotate'}
                    onChange={(value) => updateTransformSnapAxisValue(mode, 'z', value)}
                    displayLabel="Z"
                    displayValue={formatSnapValue(evaluatedSnapState.values.z)}
                    formatValue={formatSnapValue}
                  />
                </div>
              </div>
            ) : null}
          </div>
        )}
        {quickButtonsVisible ? (
          <div className="ReferenceTransformToolbarSnapButtons">
            {TRANSFORM_SNAP_PRESETS[mode].map((preset) => (
              <button
                key={preset}
                type="button"
                className={`ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact ${
                  Math.abs(snapState.values.x - preset) < 0.0005 &&
                  Math.abs(snapState.values.y - preset) < 0.0005 &&
                  Math.abs(snapState.values.z - preset) < 0.0005
                    ? 'isActive'
                    : ''
                }`}
                onClick={() => updateTransformSnapValue(mode, preset)}
              >
                {formatSnapValue(preset)}
              </button>
            ))}
            <button
              type="button"
              className="ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact"
              onClick={() => updateTransformSnapValue(mode, Math.max(min, snapState.values.x / 2))}
            >
              /2
            </button>
            <button
              type="button"
              className="ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact"
              onClick={() => updateTransformSnapValue(mode, Math.min(max, snapState.values.x * 2))}
            >
              x2
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  const contextMenuItems =
    channelContextMenu === null
      ? []
      : [
          {
            id: 'basic',
            label: 'Basic',
            disabled: getChannelMode(channelContextMenu.channel) === 'basic',
            onSelect: () => handleTimelineModeChange(channelContextMenu.channel, 'basic'),
          },
          {
            id: 'timeline',
            label: 'Timeline',
            disabled:
              getChannelMode(channelContextMenu.channel) === 'timeline' ||
              (channelContextMenu.channel === 'rotate-snap' && !transformSnapState.rotate.xyzLocked),
            onSelect: () => handleTimelineModeChange(channelContextMenu.channel, 'timeline'),
          },
        ]

  const promptDrivenChannelSelection: ActiveKeyboardChannelSelection =
    getReferenceTransformChannelSelectionFromPrompt(consolePromptSession)

  const activeHandleDrivenChannelSelection: ActiveKeyboardChannelSelection =
    getReferenceTransformChannelSelectionFromHandle(activeSession?.activeHandle ?? null)

  const isChannelHighlighted = (section: TransformSectionKey, axis: Axis): boolean =>
    promptDrivenChannelSelection !== null
      ? promptDrivenChannelSelection.section === section &&
        promptDrivenChannelSelection.axis === axis
      : activeHandleDrivenChannelSelection !== null
        ? activeHandleDrivenChannelSelection.section === section &&
          activeHandleDrivenChannelSelection.axis === axis
        : activeSession?.activeHandle !== null && activeSession?.activeHandle !== undefined
          ? false
          : activeKeyboardChannelSelection !== null &&
            activeKeyboardChannelSelection.section === section &&
            (activeKeyboardChannelSelection.axis === 'all' ||
              activeKeyboardChannelSelection.axis === axis)

  const stopTitleActionPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const stopTitleActionMouseDown = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <ViewportOverlayToolPanel
      ref={toolbarRef}
      className="ReferenceTransformToolbar"
      title="Transform Reference"
      titleMeta={activeReference.label}
      titleActions={
        <>
          <button
            type="button"
            className={`ReferenceTransformToolbarHeaderAction ${showShortcutHelp ? 'isActive' : ''}`}
            onPointerDown={stopTitleActionPointerDown}
            onMouseDown={stopTitleActionMouseDown}
            onClick={() => setShowShortcutHelp((current) => !current)}
            aria-label="Toggle keyboard shortcuts help"
            aria-pressed={showShortcutHelp}
            title="Keyboard shortcuts"
          >
            <span className="ReferenceTransformToolbarInfoGlyph" aria-hidden="true">
              i
            </span>
          </button>
          <button
            type="button"
            className="ReferenceTransformToolbarHeaderAction"
            onPointerDown={stopTitleActionPointerDown}
            onMouseDown={stopTitleActionMouseDown}
            onClick={handleFrameReference}
            aria-label="Zoom to reference object"
            title="Zoom to object"
          >
            <span className="ReferenceTransformToolbarZoomGlyph" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`ReferenceTransformToolbarHeaderAction ${isCameraLocked ? 'isActive' : ''}`}
            onPointerDown={stopTitleActionPointerDown}
            onMouseDown={stopTitleActionMouseDown}
            onClick={handleToggleCameraLock}
            aria-label="Lock camera to reference object"
            aria-pressed={isCameraLocked}
            title="Lock camera to object"
          >
            <span className="ReferenceTransformToolbarLockGlyph" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="ReferenceTransformToolbarClose"
            onPointerDown={stopTitleActionPointerDown}
            onMouseDown={stopTitleActionMouseDown}
            onClick={() => {
              requestReferenceTransformShellExit('toolbar-close')
            }}
            aria-label="Close reference transform toolbar"
            title="Close"
          >
            x
          </button>
        </>
      }
      onTitleBarPointerDown={handleHeaderPointerDown}
      onTitleBarMouseDown={handleHeaderMouseDown}
      onResizeHandlePointerDown={(direction, event) => handleResizePointerDown(event, direction)}
      style={
        position === null
          ? undefined
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              right: 'auto',
              width: `${size?.width ?? DEFAULT_TOOLBAR_WIDTH}px`,
              height: size === null ? undefined : `${size.height}px`,
            }
      }
    >
      <div className="ReferenceTransformToolbarBody">
        {showShortcutHelp ? (
          <div className="ReferenceTransformToolbarShortcuts" aria-label="Reference transform keyboard shortcuts">
            <div className="ReferenceTransformToolbarShortcutsTitle">Keyboard Shortcuts</div>
            <div className="ReferenceTransformToolbarShortcutRow">
              <span className="ReferenceTransformToolbarShortcutKeys">M</span>
              <span className="ReferenceTransformToolbarShortcutText">Move center handle</span>
            </div>
            <div className="ReferenceTransformToolbarShortcutRow">
              <span className="ReferenceTransformToolbarShortcutKeys">M then X / Y / Z</span>
              <span className="ReferenceTransformToolbarShortcutText">Constrain move axis</span>
            </div>
            <div className="ReferenceTransformToolbarShortcutRow">
              <span className="ReferenceTransformToolbarShortcutKeys">R</span>
              <span className="ReferenceTransformToolbarShortcutText">Rotate outer ring</span>
            </div>
            <div className="ReferenceTransformToolbarShortcutRow">
              <span className="ReferenceTransformToolbarShortcutKeys">R then X / Y / Z</span>
              <span className="ReferenceTransformToolbarShortcutText">Constrain rotate axis</span>
            </div>
            <div className="ReferenceTransformToolbarShortcutRow">
              <span className="ReferenceTransformToolbarShortcutKeys">S</span>
              <span className="ReferenceTransformToolbarShortcutText">Scale all axes</span>
            </div>
            <div className="ReferenceTransformToolbarShortcutRow">
              <span className="ReferenceTransformToolbarShortcutKeys">S then X / Y / Z</span>
              <span className="ReferenceTransformToolbarShortcutText">Constrain scale axis</span>
            </div>
            <div className="ReferenceTransformToolbarShortcutRow">
              <span className="ReferenceTransformToolbarShortcutKeys">Esc</span>
              <span className="ReferenceTransformToolbarShortcutText">Cancel active transform session</span>
            </div>
            <div className="ReferenceTransformToolbarShortcutsTitle">Viewport</div>
            <div className="ReferenceTransformToolbarChannelBox">
              <ParaSelect
                label="Move Snap Dots"
                value={moveSnapDotsEnabled ? 'on' : 'off'}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                onChange={(value) => setReferenceTransformMoveSnapDotsEnabled(value === 'on')}
              />
            </div>
            {moveSnapDotsEnabled ? (
              <>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSelect
                    label="Preview Last Move Snap Dots"
                    value={previewLastMoveSnapDotsEnabled ? 'on' : 'off'}
                    options={[
                      { value: 'off', label: 'Off' },
                      { value: 'on', label: 'On' },
                    ]}
                    onChange={(value) =>
                      setReferenceTransformPreviewLastMoveSnapDotsEnabled(value === 'on')
                    }
                  />
                </div>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="Dot Size"
                    value={moveSnapDotScale}
                    min={0.1}
                    max={4}
                    step={0.1}
                    onChange={setReferenceTransformMoveSnapDotScale}
                  />
                </div>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="Dot Delay"
                    value={moveSnapDotDelayMs}
                    min={0}
                    max={500}
                    step={10}
                    formatValue={(value) => `${Math.round(value)} ms`}
                    onChange={setReferenceTransformMoveSnapDotDelayMs}
                  />
                </div>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="Dot On Gizmo"
                    value={moveSnapDotNearScale}
                    min={0.1}
                    max={3}
                    step={0.05}
                    onChange={setReferenceTransformMoveSnapDotNearScale}
                  />
                </div>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="Dot Furthest"
                    value={moveSnapDotFarScale}
                    min={0}
                    max={1.5}
                    step={0.02}
                    onChange={setReferenceTransformMoveSnapDotFarScale}
                  />
                </div>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="Dot Radius"
                    value={moveSnapDotVisibleRadiusMultiplier}
                    min={1}
                    max={200}
                    step={1}
                    onChange={setReferenceTransformMoveSnapDotVisibleRadiusMultiplier}
                  />
                </div>
              </>
            ) : null}
            <div className="ReferenceTransformToolbarChannelBox">
              <ParaSelect
                label="Rotate Snap Preview"
                value={rotateSnapPreviewEnabled ? 'on' : 'off'}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                onChange={(value) => setReferenceTransformRotateSnapPreviewEnabled(value === 'on')}
              />
            </div>
            {rotateSnapPreviewEnabled ? (
              <>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="Line Size"
                    value={rotateSnapPreviewLineSize}
                    min={0.25}
                    max={3}
                    step={0.05}
                    onChange={setReferenceTransformRotateSnapPreviewLineSize}
                  />
                </div>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="Line Thickness"
                    value={rotateSnapPreviewLineThickness}
                    min={0.25}
                    max={3}
                    step={0.05}
                    onChange={setReferenceTransformRotateSnapPreviewLineThickness}
                  />
                </div>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="Preview Radius"
                    value={rotateSnapPreviewRadiusDeg}
                    min={10}
                    max={180}
                    step={5}
                    formatValue={(value) => `${Math.round(value)} deg`}
                    onChange={setReferenceTransformRotateSnapPreviewRadiusDeg}
                  />
                </div>
                <div className="ReferenceTransformToolbarChannelBox">
                  <ParaSlider
                    label="Preview Delay"
                    value={rotateSnapPreviewDelayMs}
                    min={0}
                    max={500}
                    step={10}
                    formatValue={(value) => `${Math.round(value)} ms`}
                    onChange={setReferenceTransformRotateSnapPreviewDelayMs}
                  />
                </div>
              </>
            ) : null}
          </div>
        ) : null}
        <div className="ReferenceTransformToolbarStatus" aria-label="Reference transform status">
          <span className="ReferenceTransformToolbarStatusPath">{activeSessionPath}</span>
        </div>
        <div className="ReferenceTransformToolbarSection ReferenceTransformToolbarSection--controls">
          <div className="ReferenceTransformToolbarActions">
            <span className="ReferenceTransformToolbarInlineLabel">Space</span>
            <button
              type="button"
              className={`ReferenceTransformToolbarButton ${activeSpace === 'local' ? 'isActive' : ''}`}
              onClick={() =>
                setActiveReferenceTransformSpace(activeSpace === 'local' ? 'world' : 'local')
              }
              aria-pressed={activeSpace === 'local'}
            >
              {activeSpace === 'local' ? 'Local' : 'World'}
            </button>
            <button
              type="button"
              className={`ReferenceTransformToolbarButton ${isClampEditing ? 'isActive' : ''}`}
              onClick={() => setIsClampEditing((current) => !current)}
            >
              {isClampEditing ? 'Done Clamp' : 'Edit Clamp'}
            </button>
            <button
              type="button"
              className="ReferenceTransformToolbarButton ReferenceTransformToolbarButton--pushRight"
              onClick={() => resetReferenceTransform(activeReferenceId)}
            >
              Reset Transform
            </button>
          </div>
        </div>
        <div className="ReferenceTransformToolbarSection" aria-label="Reference transform history">
          <div className="ReferenceTransformToolbarTransformSection isActive">
            <div className="ReferenceTransformToolbarTransformSectionHeader">
              <button
                type="button"
                className="ReferenceTransformToolbarSectionToggle"
                aria-label={`${historyExpanded ? 'Collapse' : 'Expand'} Transform History section`}
                aria-expanded={historyExpanded}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setHistoryExpanded((current) => !current)
                }}
              >
                {historyExpanded ? 'v' : '>'}
              </button>
              <span className="ReferenceTransformToolbarTransformSectionLabel">Transform History</span>
              <div className="ReferenceTransformToolbarTransformSectionActions">
                <button
                  type="button"
                  className="ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    if (activeReferenceId !== null) {
                      mergeReferenceTransformHistory(activeReferenceId)
                    }
                  }}
                >
                  Merge History
                </button>
              </div>
            </div>
            {historyExpanded ? (
              <div className="ReferenceTransformToolbarTransformSectionBody">
                <div className="ReferenceTransformToolbarHistoryScrubControl">
                  <ParaSlider
                    label="History Scrub"
                    value={activeHistoryScrubIndex}
                    min={0}
                    max={Math.max(latestHistoryScrubIndex, 0)}
                    step={1}
                    onChange={(value) => setActiveReferenceTransformHistoryScrubIndex(value)}
                    displayLabel="Entry"
                    displayValue={`${activeHistoryScrubIndex} / ${latestHistoryScrubIndex}`}
                  />
                </div>
                <div
                  className={`ReferenceTransformToolbarHistoryRow ${
                    activeHistoryScrubIndex === 0 ? 'isActive' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="ReferenceTransformToolbarHistoryEntryButton"
                    aria-pressed={activeHistoryScrubIndex === 0}
                    onClick={() => setActiveReferenceTransformHistoryScrubIndex(0)}
                  >
                    <span className="ReferenceTransformToolbarHistoryLabel">Origin</span>
                  </button>
                </div>
                {groupedTransformHistory.map((sessionGroup) => {
                  const sessionExpanded =
                    expandedHistorySessions[sessionGroup.sessionId] ??
                    sessionGroup.sessionId === groupedTransformHistory.at(-1)?.sessionId
                  return (
                    <div
                      key={sessionGroup.sessionId}
                      className="ReferenceTransformToolbarHistorySession"
                    >
                      <div className="ReferenceTransformToolbarHistoryRow">
                        <button
                          type="button"
                          className="ReferenceTransformToolbarHistorySessionButton"
                          aria-label={`${sessionExpanded ? 'Collapse' : 'Expand'} Transform ${sessionGroup.sessionOrdinal}`}
                          aria-expanded={sessionExpanded}
                          onClick={() =>
                            setExpandedHistorySessions((current) => ({
                              ...current,
                              [sessionGroup.sessionId]: !sessionExpanded,
                            }))
                          }
                        >
                          <span className="ReferenceTransformToolbarSectionToggle">
                            {sessionExpanded ? 'v' : '>'}
                          </span>
                          <span className="ReferenceTransformToolbarHistorySessionLabel">
                            {`Transform ${sessionGroup.sessionOrdinal}`}
                          </span>
                        </button>
                      </div>
                      {sessionExpanded ? (
                        <div className="ReferenceTransformToolbarHistorySessionChildren">
                          {sessionGroup.entries.map(({ historyIndex, entry }) => {
                            const sliderConfig = getHistoryEntrySliderConfig(entry)
                            const entryScrubIndex = historyIndex + 1
                            const isScrubbedEntry = activeHistoryScrubIndex === entryScrubIndex
                            const isFutureEntry = historyScrubActive && entryScrubIndex > activeHistoryScrubIndex
                            return (
                              <div
                                key={entry.entryId}
                                className={`ReferenceTransformToolbarHistoryEntry ${
                                  isScrubbedEntry ? 'isActive' : ''
                                } ${isFutureEntry ? 'isInactive' : ''}`}
                              >
                                <div
                                  className={`ReferenceTransformToolbarHistoryRow ReferenceTransformToolbarHistoryRow--child ${
                                    isScrubbedEntry ? 'isActive' : ''
                                  } ${isFutureEntry ? 'isInactive' : ''}`}
                                >
                                  <button
                                    type="button"
                                    className="ReferenceTransformToolbarHistoryEntryButton"
                                    aria-label={`Jump to Transform ${sessionGroup.sessionOrdinal} entry ${historyIndex + 1}`}
                                    aria-pressed={isScrubbedEntry}
                                    onClick={() =>
                                      setActiveReferenceTransformHistoryScrubIndex(entryScrubIndex)
                                    }
                                  >
                                    <span className="ReferenceTransformToolbarHistoryLabel">
                                      {formatHistoryEntryTitle(entry, historyIndex)}
                                    </span>
                                  </button>
                                  <div className="ReferenceTransformToolbarHistoryEntryActions">
                                    <button
                                      type="button"
                                      className={`ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact ReferenceTransformToolbarHistoryLockButton ${
                                        entry.locked ? 'isActive' : ''
                                      }`}
                                      aria-label={`${
                                        entry.locked ? 'Unlock' : 'Lock'
                                      } Transform ${sessionGroup.sessionOrdinal} entry ${historyIndex + 1}`}
                                      aria-pressed={entry.locked}
                                      title={entry.locked ? 'Unlock entry' : 'Lock entry'}
                                      onClick={() =>
                                        toggleReferenceTransformHistoryLock(activeReferenceId, entry.entryId)
                                      }
                                    >
                                      <HistoryLockIcon locked={entry.locked} />
                                    </button>
                                    <button
                                      type="button"
                                      className="ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact ReferenceTransformToolbarHistoryDeleteButton"
                                      aria-label={`Delete Transform ${sessionGroup.sessionOrdinal} entry ${historyIndex + 1}`}
                                      title="Delete entry"
                                      onClick={() =>
                                        deleteReferenceTransformHistoryEntry(
                                          activeReferenceId,
                                          entry.entryId,
                                        )
                                      }
                                    >
                                      x
                                    </button>
                                  </div>
                                </div>
                                <div
                                  className={`ReferenceTransformToolbarHistoryEntryValues ${
                                    isFutureEntry ? 'isInactive' : ''
                                  }`}
                                  aria-label={`Transform ${sessionGroup.sessionOrdinal} entry ${historyIndex + 1} values`}
                                >
                                  <ParaVec3Slider
                                    value={entry.delta}
                                    min={sliderConfig.min}
                                    max={sliderConfig.max}
                                    step={sliderConfig.step}
                                    allowWrap={sliderConfig.allowWrap}
                                    onChangeAxis={(axis, value) => {
                                      if (isFutureEntry) {
                                        return
                                      }
                                      setReferenceTransformHistoryEntryDeltaValue(
                                        activeReferenceId,
                                        entry.entryId,
                                        axis,
                                        value,
                                      )
                                    }}
                                    formatValue={(_axis, value) => formatHistoryDeltaValue(value)}
                                    displayValue={(_axis, value) => formatHistoryDeltaValue(value)}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
        <div className="ReferenceTransformToolbarSection" aria-label="Reference transform snap settings">
          <div className="ReferenceTransformToolbarTransformSection isActive">
            <div className="ReferenceTransformToolbarTransformSectionHeader">
              <button
                type="button"
                className="ReferenceTransformToolbarSectionToggle"
                aria-label={`${snapExpanded ? 'Collapse' : 'Expand'} Snap section`}
                aria-expanded={snapExpanded}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setSnapExpanded((current) => !current)
                }}
              >
                {snapExpanded ? 'v' : '>'}
              </button>
              <span className="ReferenceTransformToolbarTransformSectionLabel">Snap</span>
            </div>
            {snapExpanded ? (
              <div className="ReferenceTransformToolbarTransformSectionBody">
                <div className="ReferenceTransformToolbarValueStack">
                  {(['translate', 'rotate', 'scale'] as const).map((mode) => renderSnapModeRow(mode))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="ReferenceTransformToolbarSection" aria-label="Reference transform values">
          {TRANSFORM_SECTIONS.map((section) => (
            <div
              className={`ReferenceTransformToolbarTransformSection ${selectedSection === section.key ? 'isActive' : ''} ${
                expandedSections[section.key] ? 'isExpanded' : 'isCollapsed'
              }`}
              key={section.key}
            >
              <div
                className="ReferenceTransformToolbarTransformSectionHeader"
                onClick={() => activateModeShortcut(section.key)}
                role="button"
                tabIndex={0}
                aria-pressed={selectedSection === section.key}
              >
                <button
                  type="button"
                  className="ReferenceTransformToolbarSectionToggle"
                  aria-label={`${expandedSections[section.key] ? 'Collapse' : 'Expand'} ${section.label} section`}
                  aria-expanded={expandedSections[section.key]}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setExpandedSections((current) => ({
                      ...current,
                      [section.key]: !current[section.key],
                    }))
                  }}
                >
                  {expandedSections[section.key] ? 'v' : '>'}
                </button>
                <span className="ReferenceTransformToolbarTransformSectionLabel">{section.label}</span>
                <div className="ReferenceTransformToolbarTransformSectionActions">
                  {section.key === 'scale' ? (
                    <button
                      type="button"
                      className={`ReferenceTransformToolbarButton ReferenceTransformToolbarButton--lock ${scaleLocked ? 'isActive' : ''}`}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        setScaleLocked((current) => !current)
                      }}
                      aria-pressed={scaleLocked}
                      aria-label="Lock scale axes"
                      title="Lock scale axes"
                    >
                      Lock
                    </button>
                  ) : null}
                </div>
              </div>
              {expandedSections[section.key] ? (
                <div className="ReferenceTransformToolbarTransformSectionBody">
                  <div className="ReferenceTransformToolbarValueStack">
                    {section.channels.map((channelMeta) => {
                      const baseValue = activeTransformOverride[channelMeta.group][channelMeta.axis]
                      const liveValue = evaluatedTransformOverride[channelMeta.group][channelMeta.axis]
                      return renderChannelRow({
                        channel: channelMeta.channel,
                        label: channelMeta.label,
                        value: baseValue,
                        liveValue,
                        min: getChannelRange(channelMeta.channel).min,
                        max: getChannelRange(channelMeta.channel).max,
                        step:
                          channelMeta.sectionKey === 'rotate'
                            ? activeRotateStep
                            : channelMeta.sectionKey === 'translate'
                              ? activeTranslateStep
                              : channelMeta.sectionKey === 'scale'
                                ? activeScaleStep
                                : channelMeta.step,
                        formatValue: formatTransformValue,
                        isHighlighted: isChannelHighlighted(section.key, channelMeta.axis),
                        allowWrap: channelMeta.allowWrap,
                        showContinuousDragPreview:
                          transformSnapState[channelMeta.sectionKey].enabled,
                        onChange: (value) =>
                          updateTransformAxis(channelMeta.group, channelMeta.axis, value),
                      })
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <SpaghettiContextMenu
        open={channelContextMenu !== null}
        x={channelContextMenu?.x ?? 0}
        y={channelContextMenu?.y ?? 0}
        items={contextMenuItems}
        onClose={() => setChannelContextMenu(null)}
        containerClassName="ReferenceTransformToolbarContextMenu"
      />
    </ViewportOverlayToolPanel>
  )
}
