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

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

type PendingKeyboardTransform = {
  referenceId: string
  baseline: ReturnType<typeof buildDefaultTransformOverride> | null
  mode: TransformSectionKey
}

type ActiveKeyboardChannelSelection = {
  section: TransformSectionKey
  axis: Axis | 'all'
} | null

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
const MIN_TOOLBAR_WIDTH = 380
const MIN_TOOLBAR_HEIGHT = 240
const TOOLBAR_VIEWPORT_MARGIN = 12

const buildDefaultTransformOverride = () => ({
  position: { x: 0, y: 0, z: 0 },
  rotationDeg: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
})

const cloneTransformOverride = (
  transformOverride: ReturnType<typeof buildDefaultTransformOverride> | null,
) =>
  transformOverride === null
    ? null
    : {
        position: { ...transformOverride.position },
        rotationDeg: { ...transformOverride.rotationDeg },
        scale: { ...transformOverride.scale },
      }

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

export function ReferenceTransformToolbar() {
  const referenceWorkspace = useAppStore((state) => state.referenceWorkspace)
  const setReferenceTransformMode = useAppStore((state) => state.setReferenceTransformMode)
  const setReferenceTransformSpace = useAppStore((state) => state.setReferenceTransformSpace)
  const setReferenceTransformOverride = useAppStore((state) => state.setReferenceTransformOverride)
  const resetReferenceTransform = useAppStore((state) => state.resetReferenceTransform)
  const endReferenceTransform = useAppStore((state) => state.endReferenceTransform)
  const setReferenceChannelClampRange = useAppStore((state) => state.setReferenceChannelClampRange)
  const setReferenceTimelineMode = useAppStore((state) => state.setReferenceTimelineMode)
  const setReferenceTimelineSpeed = useAppStore((state) => state.setReferenceTimelineSpeed)
  const setReferenceTimelineCycle = useAppStore((state) => state.setReferenceTimelineCycle)
  const setReferenceTimelinePoints = useAppStore((state) => state.setReferenceTimelinePoints)
  const setReferenceRotateSnapEnabled = useAppStore((state) => state.setReferenceRotateSnapEnabled)
  const setReferenceRotateSnapValue = useAppStore((state) => state.setReferenceRotateSnapValue)

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
  const pendingKeyboardTransformRef = useRef<PendingKeyboardTransform | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<TransformSectionKey, boolean>>({
    translate: true,
    rotate: true,
    scale: true,
  })
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
    const toolbarWidth = toolbarRef.current?.offsetWidth ?? 420
    const viewportWidth = typeof window === 'undefined' ? 1280 : window.innerWidth
    setPosition({
      x: Math.max(16, Math.round((viewportWidth - toolbarWidth) / 2)),
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

  useEffect(() => {
    if (activeReferenceId === null) {
      setPendingShortcutActivation(null)
      pendingKeyboardTransformRef.current = null
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

  const commitPendingKeyboardTransform = () => {
    const pending = pendingKeyboardTransformRef.current
    getViewer()?.completeReferenceTransformDrag()
    pendingKeyboardTransformRef.current = null
    if (pending !== null) {
      appendConsoleEntry({
        layer: 'Transforms',
        text: `${transformModeLabel(pending.mode)} committed`,
        source: 'reference-transform',
        severity: 'info',
      })
    }
  }

  const cancelPendingKeyboardTransform = (mode: TransformSectionKey): boolean => {
    if (activeReferenceId === null) {
      pendingKeyboardTransformRef.current = null
      return false
    }
    const pending = pendingKeyboardTransformRef.current
    if (
      pending === null ||
      pending.referenceId !== activeReferenceId ||
      pending.mode !== mode
    ) {
      return false
    }
    setPendingShortcutActivation(null)
    getViewer()?.cancelReferenceTransformDrag()
    getViewer()?.clearReferenceTransformHandle()
    const baseline = cloneTransformOverride(pending.baseline)
    setReferenceTransformOverride(activeReferenceId, baseline)
    getViewer()?.setReferenceTransformOverride(activeReferenceId, baseline)
    pendingKeyboardTransformRef.current = null
    setSelectedSection(null)
    setActiveKeyboardChannelSelection(null)
    appendConsoleEntry({
      layer: 'Transforms',
      text: `${transformModeLabel(mode)} canceled`,
      source: 'reference-transform',
      severity: 'info',
    })
    return true
  }

  const revertPendingKeyboardTransformIfModeChanges = (nextMode: TransformSectionKey) => {
    if (activeReferenceId === null) {
      pendingKeyboardTransformRef.current = null
      return
    }
    const pending = pendingKeyboardTransformRef.current
    if (pending === null || pending.referenceId !== activeReferenceId) {
      pendingKeyboardTransformRef.current = {
        referenceId: activeReferenceId,
        baseline: cloneTransformOverride(activeTransformOverride),
        mode: nextMode,
      }
      return
    }
    if (pending.mode === nextMode) {
      return
    }
    getViewer()?.cancelReferenceTransformDrag()
    const baseline = cloneTransformOverride(pending.baseline)
    setReferenceTransformOverride(activeReferenceId, baseline)
    getViewer()?.setReferenceTransformOverride(activeReferenceId, baseline)
    appendConsoleEntry({
      layer: 'Transforms',
      text: `${transformModeLabel(pending.mode)} reverted before ${transformModeLabel(nextMode)}`,
      source: 'reference-transform',
      severity: 'info',
    })
    pendingKeyboardTransformRef.current = {
      referenceId: activeReferenceId,
      baseline,
      mode: nextMode,
    }
  }

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

  useEffect(() => {
    const handleWindowPointerDown = (event: PointerEvent) => {
      if (pendingKeyboardTransformRef.current === null) {
        return
      }
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }
      if (target.closest('.ViewportCanvasLayer') !== null || target.closest('.ViewportRoot') !== null) {
        commitPendingKeyboardTransform()
      }
    }

    window.addEventListener('pointerdown', handleWindowPointerDown, true)
    return () => {
      window.removeEventListener('pointerdown', handleWindowPointerDown, true)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }
      const key = event.key.toLowerCase()
      const pendingKeyboardMode =
        pendingKeyboardTransformRef.current?.referenceId === activeReferenceId
          ? pendingKeyboardTransformRef.current.mode
          : null
      const routing = routeKeyboardInput({
        event,
        referenceTransformActive: activeReferenceId !== null,
        referenceTransformHasPendingKeyboardTransform: pendingKeyboardMode !== null,
      })
      if (routing.owner !== 'reference-transform' || routing.decision !== 'handle') {
        return
      }
      if (event.key === 'Enter') {
        if (pendingKeyboardTransformRef.current !== null) {
          event.preventDefault()
          commitPendingKeyboardTransform()
        }
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        if (pendingKeyboardMode !== null) {
          if (cancelPendingKeyboardTransform(pendingKeyboardMode)) {
            appendConsoleEntry({
              layer: 'Shortcuts',
              text: `${pendingKeyboardMode[0].toUpperCase()}${pendingKeyboardMode.slice(1)} canceled`,
              source: 'reference-transform',
              severity: 'info',
            })
          }
          return
        }
        if (activeReferenceId !== null) {
          endReferenceTransform()
        }
        return
      }
      if (key === 'm') {
        event.preventDefault()
        if (cancelPendingKeyboardTransform('translate')) {
          appendConsoleEntry({
            layer: 'Shortcuts',
            text: 'Move canceled',
            source: 'reference-transform',
            severity: 'info',
          })
          return
        }
        revertPendingKeyboardTransformIfModeChanges('translate')
        appendConsoleEntry({
          layer: 'Transforms',
          text: 'Move started',
          source: 'reference-transform',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'Shortcuts',
          text: 'Move',
          source: 'reference-transform',
          severity: 'info',
        })
        setSelectedSection('translate')
        setActiveKeyboardChannelSelection({ section: 'translate', axis: 'all' })
        setPendingShortcutActivation('translate-center')
        if (activeMode !== 'translate') {
          setReferenceTransformMode('translate')
        }
        return
      }
      if (pendingKeyboardMode === 'translate' && (key === 'x' || key === 'y' || key === 'z')) {
        event.preventDefault()
        revertPendingKeyboardTransformIfModeChanges('translate')
        appendConsoleEntry({
          layer: 'Transforms',
          text: `Move axis: ${key.toUpperCase()}`,
          source: 'reference-transform',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'Shortcuts',
          text: `Move: ${key.toUpperCase()} axis`,
          source: 'reference-transform',
          severity: 'info',
        })
        setSelectedSection('translate')
        setActiveKeyboardChannelSelection({
          section: 'translate',
          axis: key,
        })
        getViewer()?.activateTranslateHandle(key.toUpperCase() as 'X' | 'Y' | 'Z')
        return
      }
      if (key === 'r') {
        event.preventDefault()
        if (cancelPendingKeyboardTransform('rotate')) {
          appendConsoleEntry({
            layer: 'Shortcuts',
            text: 'Rotate canceled',
            source: 'reference-transform',
            severity: 'info',
          })
          return
        }
        revertPendingKeyboardTransformIfModeChanges('rotate')
        appendConsoleEntry({
          layer: 'Transforms',
          text: 'Rotate started',
          source: 'reference-transform',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'Shortcuts',
          text: 'Rotate',
          source: 'reference-transform',
          severity: 'info',
        })
        setSelectedSection('rotate')
        setActiveKeyboardChannelSelection({ section: 'rotate', axis: 'all' })
        if (activeMode === 'rotate') {
          getViewer()?.activateRotateCenterHandle()
        } else {
          setPendingShortcutActivation('rotate-center')
          setReferenceTransformMode('rotate')
        }
        return
      }
      if (pendingKeyboardMode === 'rotate' && (key === 'x' || key === 'y' || key === 'z')) {
        event.preventDefault()
        revertPendingKeyboardTransformIfModeChanges('rotate')
        appendConsoleEntry({
          layer: 'Transforms',
          text: `Rotate axis: ${key.toUpperCase()}`,
          source: 'reference-transform',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'Shortcuts',
          text: `Rotate: ${key.toUpperCase()} axis`,
          source: 'reference-transform',
          severity: 'info',
        })
        setSelectedSection('rotate')
        setActiveKeyboardChannelSelection({
          section: 'rotate',
          axis: key,
        })
        getViewer()?.activateRotateHandle(key.toUpperCase() as 'X' | 'Y' | 'Z')
        return
      }
      if (key === 's') {
        event.preventDefault()
        if (cancelPendingKeyboardTransform('scale')) {
          appendConsoleEntry({
            layer: 'Shortcuts',
            text: 'Scale canceled',
            source: 'reference-transform',
            severity: 'info',
          })
          return
        }
        revertPendingKeyboardTransformIfModeChanges('scale')
        appendConsoleEntry({
          layer: 'Transforms',
          text: 'Scale started',
          source: 'reference-transform',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'Shortcuts',
          text: 'Scale',
          source: 'reference-transform',
          severity: 'info',
        })
        setSelectedSection('scale')
        setActiveKeyboardChannelSelection({ section: 'scale', axis: 'all' })
        if (activeMode === 'scale') {
          getViewer()?.activateScaleCenterHandle()
        } else {
          setPendingShortcutActivation('scale-center')
          setReferenceTransformMode('scale')
        }
        return
      }
      if (pendingKeyboardMode === 'scale' && (key === 'x' || key === 'y' || key === 'z')) {
        event.preventDefault()
        revertPendingKeyboardTransformIfModeChanges('scale')
        appendConsoleEntry({
          layer: 'Transforms',
          text: `Scale axis: ${key.toUpperCase()}`,
          source: 'reference-transform',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'Shortcuts',
          text: `Scale: ${key.toUpperCase()} axis`,
          source: 'reference-transform',
          severity: 'info',
        })
        setSelectedSection('scale')
        setActiveKeyboardChannelSelection({
          section: 'scale',
          axis: key,
        })
        getViewer()?.activateScaleHandle(key.toUpperCase() as 'X' | 'Y' | 'Z')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeMode, endReferenceTransform, setReferenceTransformMode])

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

  const handleHeaderPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const host = toolbarRef.current
    if (host === null) {
      return
    }
    event.preventDefault()
    event.stopPropagation()

    const startX = event.clientX
    const startY = event.clientY
    const startPosition = position ?? {
      x: host.offsetLeft,
      y: host.offsetTop,
    }

    const move = (moveEvent: PointerEvent) => {
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

    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
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

  return (
    <div
      ref={toolbarRef}
      className="ViewportOverlayWidget ReferenceTransformToolbar"
      role="toolbar"
      aria-label="Reference transform controls"
      style={
        position === null
          ? undefined
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: size === null ? undefined : `${size.width}px`,
              height: size === null ? undefined : `${size.height}px`,
            }
      }
    >
      {(['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const).map((direction) => (
        <div
          key={direction}
          className={`ReferenceTransformToolbarResizeHandle ReferenceTransformToolbarResizeHandle--${direction}`}
          onPointerDown={(event) => handleResizePointerDown(event, direction)}
        />
      ))}
      <div
        className="ReferenceTransformToolbarHeader"
        onPointerDown={handleHeaderPointerDown}
      >
        <span className="ReferenceTransformToolbarTitle">Transform Reference</span>
        <span className="ReferenceTransformToolbarTarget">{activeReference.label}</span>
        <button
          type="button"
          className={`ReferenceTransformToolbarHeaderAction ${showShortcutHelp ? 'isActive' : ''}`}
          onPointerDown={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
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
          onPointerDown={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onClick={handleFrameReference}
          aria-label="Zoom to reference object"
          title="Zoom to object"
        >
          <span className="ReferenceTransformToolbarZoomGlyph" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`ReferenceTransformToolbarHeaderAction ${isCameraLocked ? 'isActive' : ''}`}
          onPointerDown={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
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
          onPointerDown={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onClick={endReferenceTransform}
          aria-label="Close reference transform toolbar"
          title="Close"
        >
          x
        </button>
      </div>
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
              <span className="ReferenceTransformToolbarShortcutText">Cancel current keyboard transform</span>
            </div>
          </div>
        ) : null}
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
                onClick={() => {
                  appendConsoleEntry({
                    layer: 'Transforms',
                    text: `Mode: ${section.label}`,
                    source: 'reference-transform',
                    severity: 'info',
                  })
                  setSelectedSection(section.key)
                  setActiveKeyboardChannelSelection({
                    section: section.key,
                    axis: 'all',
                  })
                  setReferenceTransformMode(section.key)
                }}
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
      </div>
      <SpaghettiContextMenu
        open={channelContextMenu !== null}
        x={channelContextMenu?.x ?? 0}
        y={channelContextMenu?.y ?? 0}
        items={contextMenuItems}
        onClose={() => setChannelContextMenu(null)}
        containerClassName="ReferenceTransformToolbarContextMenu"
      />
    </div>
  )
}
