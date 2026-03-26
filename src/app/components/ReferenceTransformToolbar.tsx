import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { routeKeyboardInput } from '../inputRouting'
import { ParaSlider } from './ParaSlider'
import { ReferenceTimelineGraph } from './ReferenceTimelineGraph'
import {
  ViewportOverlayToolPanel,
  type ViewportOverlayToolPanelResizeDirection,
} from './ViewportOverlayToolPanel'
import { selectReferenceWorkspaceItems, useAppStore } from '../store/useAppStore'
import { getViewer } from '../viewerBridge'
import { SpaghettiContextMenu } from '../spaghetti/ui/SpaghettiContextMenu'
import {
  DEFAULT_REFERENCE_ROTATE_SNAP,
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
import { appendConsoleEntry } from '../console/useConsoleStore'

const formatTransformValue = (value: number): string => {
  if (Math.abs(value) < 0.0005) {
    return '0.00'
  }
  return value.toFixed(2)
}

const ROTATE_SNAP_PRESETS = [1, 5, 11.25, 15, 22.5, 30, 45, 90] as const
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

const transformModeConsoleToken = (mode: TransformSectionKey): 'M' | 'R' | 'S' => {
  switch (mode) {
    case 'translate':
      return 'M'
    case 'rotate':
      return 'R'
    case 'scale':
      return 'S'
  }
}

const formatVec3Status = (vector: { x: number; y: number; z: number }): string =>
  `Vec3 [${formatTransformValue(vector.x)}, ${formatTransformValue(vector.y)}, ${formatTransformValue(vector.z)}]`

const formatHistoryDeltaValue = (value: number): string => {
  const rounded = Math.abs(value) < 0.0005 ? 0 : value
  return `${rounded >= 0 ? '+' : ''}${formatTransformValue(rounded)}`
}

const formatHistoryEntryLabel = (
  entries: ReadonlyArray<ReferenceTransformHistoryEntry>,
  entry: ReferenceTransformHistoryEntry,
): string => {
  const previousSameKind = [...entries]
    .slice(0, Math.max(entries.findIndex((candidate) => candidate.entryId === entry.entryId), 0))
    .reverse()
    .find((candidate) => candidate.kind === entry.kind) ?? null
  const baseline =
    previousSameKind?.value ??
    (entry.kind === 'scale'
      ? { x: 1, y: 1, z: 1 }
      : { x: 0, y: 0, z: 0 })
  return `${
    entry.kind === 'move' ? 'Move' : entry.kind === 'rotate' ? 'Rotate' : 'Scale'
  } Vec(${formatHistoryDeltaValue(entry.value.x - baseline.x)}, ${formatHistoryDeltaValue(
    entry.value.y - baseline.y,
  )}, ${formatHistoryDeltaValue(entry.value.z - baseline.z)})`
}

export function ReferenceTransformToolbar() {
  const referenceWorkspace = useAppStore((state) => state.referenceWorkspace)
  const setReferenceTransformMode = useAppStore((state) => state.setReferenceTransformMode)
  const setReferenceTransformSpace = useAppStore((state) => state.setReferenceTransformSpace)
  const setReferenceTransformOverride = useAppStore((state) => state.setReferenceTransformOverride)
  const resetReferenceTransform = useAppStore((state) => state.resetReferenceTransform)
  const cancelActiveReferenceTransform = useAppStore((state) => state.cancelActiveReferenceTransform)
  const setReferenceChannelClampRange = useAppStore((state) => state.setReferenceChannelClampRange)
  const setReferenceTimelineMode = useAppStore((state) => state.setReferenceTimelineMode)
  const setReferenceTimelineSpeed = useAppStore((state) => state.setReferenceTimelineSpeed)
  const setReferenceTimelineCycle = useAppStore((state) => state.setReferenceTimelineCycle)
  const setReferenceTimelinePoints = useAppStore((state) => state.setReferenceTimelinePoints)
  const setReferenceRotateSnapEnabled = useAppStore((state) => state.setReferenceRotateSnapEnabled)
  const setReferenceRotateSnapValue = useAppStore((state) => state.setReferenceRotateSnapValue)
  const toggleReferenceTransformHistoryLock = useAppStore(
    (state) => state.toggleReferenceTransformHistoryLock,
  )
  const mergeReferenceTransformHistory = useAppStore((state) => state.mergeReferenceTransformHistory)

  const referenceItems = useMemo(
    () => selectReferenceWorkspaceItems({ referenceWorkspace }),
    [referenceWorkspace],
  )

  const activeReference = useMemo(
    () =>
      referenceWorkspace.activeTransformReferenceId === null
        ? null
        : referenceItems.find(
            (item) => item.referenceId === referenceWorkspace.activeTransformReferenceId,
          ) ?? null,
    [referenceItems, referenceWorkspace.activeTransformReferenceId],
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
  const [selectedSection, setSelectedSection] = useState<TransformSectionKey | null>(
    referenceWorkspace.activeTransformMode,
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

  const activeMode = referenceWorkspace.activeTransformMode
  const activeSpace = referenceWorkspace.activeTransformSpace

  const activeReferenceId = activeReference?.referenceId ?? null
  const activeTransformOverride = activeReference?.transformOverride ?? buildDefaultTransformOverride()
  const transformHistory =
    activeReferenceId === null
      ? []
      : referenceWorkspace.transformHistoryByReferenceId[activeReferenceId] ?? []
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
  const rotateSnapState =
    activeReferenceId === null
      ? DEFAULT_REFERENCE_ROTATE_SNAP
      : referenceWorkspace.rotateSnapByReferenceId[activeReferenceId] ?? DEFAULT_REFERENCE_ROTATE_SNAP

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

  const evaluatedRotateSnap = useMemo(
    () => ({
      ...rotateSnapState,
      value: evaluateReferenceTimelineChannelValue(
        getChannelMode('rotate-snap'),
        getChannelConfig('rotate-snap'),
        rotateSnapState.value,
        getChannelRange('rotate-snap'),
        timelineNowMs,
      ),
    }),
    [rotateSnapState, timelineNowMs, channelClampRanges, channelModes, channelTimelineConfigs],
  )

  const activeRotateStep =
    rotateSnapState.enabled ? Math.max(evaluatedRotateSnap.value, 0.0001) : 1

  const activeSessionPath = useMemo(() => {
    const currentVector =
      activeMode === 'rotate'
        ? evaluatedTransformOverride.rotationDeg
        : activeMode === 'scale'
          ? evaluatedTransformOverride.scale
          : evaluatedTransformOverride.position
    return `${activeReference?.label ?? 'Reference'} > ${transformModeConsoleToken(activeMode)} > ${formatVec3Status(currentVector)}`
  }, [
    activeMode,
    activeReference?.label,
    evaluatedTransformOverride.position,
    evaluatedTransformOverride.rotationDeg,
    evaluatedTransformOverride.scale,
  ])

  useEffect(() => {
    if (activeReferenceId === null) {
      setPendingShortcutActivation(null)
      setActiveKeyboardChannelSelection(null)
    }
  }, [activeReferenceId])

  useEffect(() => {
    if (activeReferenceId === null) {
      setSelectedSection(null)
      setActiveKeyboardChannelSelection(null)
      return
    }
    setSelectedSection(referenceWorkspace.activeTransformMode)
  }, [activeReferenceId, referenceWorkspace.activeTransformMode])

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
    if (activeMode !== mode) {
      setReferenceTransformMode(mode)
    }
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
          cancelActiveReferenceTransform()
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
  }, [activeMode, activeReferenceId, cancelActiveReferenceTransform, setReferenceTransformMode])

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
    setReferenceTransformOverride(activeReferenceId, nextOverride)
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

  const updateRotateSnapEnabled = (enabled: boolean) => {
    setReferenceRotateSnapEnabled(activeReferenceId, enabled)
    appendConsoleEntry({
      layer: 'Transforms',
      text: `Rotate snap ${enabled ? 'enabled' : 'disabled'}`,
      source: 'reference-transform',
      severity: 'info',
    })
  }

  const updateRotateSnapValue = (value: number) => {
    setReferenceRotateSnapValue(activeReferenceId, value)
    appendConsoleEntry({
      layer: 'Transforms',
      text: `Rotate snap value: ${formatSnapValue(value)}`,
      source: 'reference-transform',
      severity: 'info',
    })
  }

  const handleTimelineModeChange = (
    channel: ReferenceTimelineChannelKey,
    mode: ReferenceTimelineMode,
  ) => {
    if (mode === 'timeline' && channel === 'rotate-snap') {
      updateRotateSnapEnabled(true)
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
            disabled: getChannelMode(channelContextMenu.channel) === 'timeline',
            onSelect: () => handleTimelineModeChange(channelContextMenu.channel, 'timeline'),
          },
        ]

  const showRotateSnapRow =
    rotateSnapState.enabled || getChannelMode('rotate-snap') === 'timeline'

  const isChannelHighlighted = (section: TransformSectionKey, axis: Axis): boolean =>
    activeKeyboardChannelSelection !== null &&
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
              getViewer()?.cancelReferenceTransformDrag()
              getViewer()?.clearReferenceTransformHandle()
              cancelActiveReferenceTransform()
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
                setReferenceTransformSpace(activeSpace === 'local' ? 'world' : 'local')
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
                  {section.key === 'rotate' ? (
                    <button
                      type="button"
                      className={`ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact ${rotateSnapState.enabled ? 'isActive' : ''}`}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        updateRotateSnapEnabled(!rotateSnapState.enabled)
                      }}
                      aria-pressed={rotateSnapState.enabled}
                      aria-label="Toggle rotate snap"
                      title="Toggle rotate snap"
                    >
                      Snap
                    </button>
                  ) : null}
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
                  {section.key === 'rotate' && showRotateSnapRow ? (
                    <div className="ReferenceTransformToolbarRotateSnapGroup">
                      {renderChannelRow({
                        channel: 'rotate-snap',
                        label: 'Snap',
                        value: rotateSnapState.value,
                        liveValue: evaluatedRotateSnap.value,
                        min: getChannelRange('rotate-snap').min,
                        max: getChannelRange('rotate-snap').max,
                        step: 0.0001,
                        formatValue: formatSnapValue,
                        onChange: (value) => updateRotateSnapValue(value),
                        isHighlighted: false,
                      })}
                      <div className="ReferenceTransformToolbarSnapButtons">
                        {ROTATE_SNAP_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            className={`ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact ${Math.abs(rotateSnapState.value - preset) < 0.0005 ? 'isActive' : ''}`}
                            onClick={() => updateRotateSnapValue(preset)}
                          >
                            {formatSnapValue(preset)}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact"
                          onClick={() =>
                            updateRotateSnapValue(Math.max(0.0001, rotateSnapState.value / 2))
                          }
                        >
                          /2
                        </button>
                        <button
                          type="button"
                          className="ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact"
                          onClick={() => updateRotateSnapValue(rotateSnapState.value * 2)}
                        >
                          x2
                        </button>
                      </div>
                    </div>
                  ) : null}
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
                        step: channelMeta.sectionKey === 'rotate' ? activeRotateStep : channelMeta.step,
                        formatValue: formatTransformValue,
                        isHighlighted: isChannelHighlighted(section.key, channelMeta.axis),
                        allowWrap: channelMeta.allowWrap,
                        showContinuousDragPreview:
                          channelMeta.sectionKey === 'rotate' && rotateSnapState.enabled,
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
                <div className="ReferenceTransformToolbarHistoryRow">
                  <span className="ReferenceTransformToolbarHistoryLabel">Origin</span>
                </div>
                {transformHistory.map((entry) => (
                  <div key={entry.entryId} className="ReferenceTransformToolbarHistoryRow">
                    <span className="ReferenceTransformToolbarHistoryLabel">
                      {formatHistoryEntryLabel(transformHistory, entry)}
                    </span>
                    <button
                      type="button"
                      className={`ReferenceTransformToolbarButton ReferenceTransformToolbarButton--compact ${
                        entry.locked ? 'isActive' : ''
                      }`}
                      onClick={() => toggleReferenceTransformHistoryLock(activeReferenceId, entry.entryId)}
                    >
                      {entry.locked ? 'Unlock' : 'Lock'}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
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
