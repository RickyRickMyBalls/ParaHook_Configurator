import { useMemo, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { newId } from '../spaghetti/utils/id'
import type {
  ReferenceTimelineHandle,
  ReferenceTimelinePoint,
  ReferenceTimelineRange,
} from '../references/referenceTimeline'

type ReferenceTimelineGraphProps = {
  points: ReferenceTimelinePoint[]
  range: ReferenceTimelineRange
  onChange: (points: ReferenceTimelinePoint[]) => void
}

const GRAPH_WIDTH = 332
const GRAPH_HEIGHT = 164
const GRAPH_PADDING_X = 18
const GRAPH_PADDING_Y = 14
const MIN_POINT_GAP = 0.03

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const clonePoint = (point: ReferenceTimelinePoint): ReferenceTimelinePoint => ({
  pointId: point.pointId,
  t: point.t,
  value: point.value,
  inHandle: point.inHandle === null ? null : { ...point.inHandle },
  outHandle: point.outHandle === null ? null : { ...point.outHandle },
})

const sortPoints = (points: ReferenceTimelinePoint[]): ReferenceTimelinePoint[] =>
  [...points].sort((left, right) => left.t - right.t)

const buildDefaultInHandle = (
  point: ReferenceTimelinePoint,
  previousPoint: ReferenceTimelinePoint,
): ReferenceTimelineHandle => ({
  t: point.t - (point.t - previousPoint.t) / 3,
  value: point.value,
})

const buildDefaultOutHandle = (
  point: ReferenceTimelinePoint,
  nextPoint: ReferenceTimelinePoint,
): ReferenceTimelineHandle => ({
  t: point.t + (nextPoint.t - point.t) / 3,
  value: point.value,
})

const innerWidth = GRAPH_WIDTH - GRAPH_PADDING_X * 2
const innerHeight = GRAPH_HEIGHT - GRAPH_PADDING_Y * 2

const pointToScreen = (t: number, value: number, range: ReferenceTimelineRange) => ({
  x: GRAPH_PADDING_X + t * innerWidth,
  y:
    GRAPH_PADDING_Y +
    (1 - clamp((value - range.min) / Math.max(range.max - range.min, 0.0001), 0, 1)) * innerHeight,
})

const screenToPoint = (
  x: number,
  y: number,
  range: ReferenceTimelineRange,
): { t: number; value: number } => ({
  t: clamp((x - GRAPH_PADDING_X) / innerWidth, 0, 1),
  value: clamp(
    range.min + (1 - clamp((y - GRAPH_PADDING_Y) / innerHeight, 0, 1)) * (range.max - range.min),
    range.min,
    range.max,
  ),
})

const buildPath = (points: ReferenceTimelinePoint[], range: ReferenceTimelineRange): string => {
  const orderedPoints = sortPoints(points)
  return orderedPoints
    .map((point, index) => {
      const current = pointToScreen(point.t, point.value, range)
      if (index === 0) {
        return `M ${current.x} ${current.y}`
      }
      const previous = orderedPoints[index - 1]
      if (previous === undefined) {
        return ''
      }
      const previousOut = previous.outHandle ?? buildDefaultOutHandle(previous, point)
      const currentIn = point.inHandle ?? buildDefaultInHandle(point, previous)
      const control1 = pointToScreen(previousOut.t, previousOut.value, range)
      const control2 = pointToScreen(currentIn.t, currentIn.value, range)
      return `C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${current.x} ${current.y}`
    })
    .join(' ')
}

export function ReferenceTimelineGraph({
  points,
  range,
  onChange,
}: ReferenceTimelineGraphProps) {
  const hostRef = useRef<SVGSVGElement | null>(null)
  const orderedPoints = useMemo(() => sortPoints(points), [points])
  const pathD = useMemo(() => buildPath(orderedPoints, range), [orderedPoints, range])

  const commitPoints = (nextPoints: ReferenceTimelinePoint[]) => {
    onChange(sortPoints(nextPoints))
  }

  const beginDrag = (
    event: ReactPointerEvent<SVGElement>,
    kind: 'point' | 'in-handle' | 'out-handle',
    pointId: string,
  ) => {
    if (event.button !== 0) {
      return
    }
    event.preventDefault()
    event.stopPropagation()

    const host = hostRef.current
    if (host === null) {
      return
    }
    const rect = host.getBoundingClientRect()

    const move = (moveEvent: PointerEvent) => {
      const local = screenToPoint(moveEvent.clientX - rect.left, moveEvent.clientY - rect.top, range)
      commitPoints(
        orderedPoints.map((point, index) => {
          if (point.pointId !== pointId) {
            return clonePoint(point)
          }
          const previousPoint = orderedPoints[index - 1]
          const nextPoint = orderedPoints[index + 1]
          if (kind === 'point') {
            const nextT = clamp(
              local.t,
              previousPoint === undefined ? 0 : previousPoint.t + MIN_POINT_GAP,
              nextPoint === undefined ? 1 : nextPoint.t - MIN_POINT_GAP,
            )
            const nextValue = clamp(local.value, range.min, range.max)
            const deltaT = nextT - point.t
            const deltaValue = nextValue - point.value
            return {
              ...clonePoint(point),
              t: nextT,
              value: nextValue,
              inHandle:
                point.inHandle === null
                  ? null
                  : {
                      t: clamp(
                        point.inHandle.t + deltaT,
                        previousPoint === undefined ? 0 : previousPoint.t,
                        nextT,
                      ),
                      value: clamp(point.inHandle.value + deltaValue, range.min, range.max),
                    },
              outHandle:
                point.outHandle === null
                  ? null
                  : {
                      t: clamp(
                        point.outHandle.t + deltaT,
                        nextT,
                        nextPoint === undefined ? 1 : nextPoint.t,
                      ),
                      value: clamp(point.outHandle.value + deltaValue, range.min, range.max),
                    },
            }
          }

          if (kind === 'in-handle') {
            return {
              ...clonePoint(point),
              inHandle: {
                t: clamp(
                  local.t,
                  previousPoint === undefined ? 0 : previousPoint.t,
                  point.t,
                ),
                value: clamp(local.value, range.min, range.max),
              },
            }
          }

          return {
            ...clonePoint(point),
            outHandle: {
              t: clamp(
                local.t,
                point.t,
                nextPoint === undefined ? 1 : nextPoint.t,
              ),
              value: clamp(local.value, range.min, range.max),
            },
          }
        }),
      )
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

  const handleBackgroundPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) {
      return
    }
    const host = hostRef.current
    if (host === null) {
      return
    }
    const rect = host.getBoundingClientRect()
    const local = screenToPoint(event.clientX - rect.left, event.clientY - rect.top, range)
    const insertIndex = orderedPoints.findIndex((point) => point.t > local.t)
    const previousPoint = orderedPoints[Math.max(0, insertIndex - 1)] ?? orderedPoints[0]
    const nextPoint =
      insertIndex === -1 ? orderedPoints.at(-1) : orderedPoints[insertIndex]
    if (previousPoint === undefined || nextPoint === undefined) {
      return
    }
    const nextT = clamp(
      local.t,
      previousPoint.t + MIN_POINT_GAP,
      nextPoint.t - MIN_POINT_GAP,
    )
    const nextPointRecord: ReferenceTimelinePoint = {
      pointId: `timeline-point:${newId()}`,
      t: nextT,
      value: clamp(local.value, range.min, range.max),
      inHandle: {
        t: previousPoint.t + (nextT - previousPoint.t) / 2,
        value: clamp(local.value, range.min, range.max),
      },
      outHandle: {
        t: nextT + (nextPoint.t - nextT) / 2,
        value: clamp(local.value, range.min, range.max),
      },
    }
    commitPoints([...orderedPoints, nextPointRecord])
  }

  const handlePointContextMenu = (
    event: ReactPointerEvent<SVGCircleElement>,
    pointId: string,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    const pointIndex = orderedPoints.findIndex((point) => point.pointId === pointId)
    if (pointIndex <= 0 || pointIndex >= orderedPoints.length - 1) {
      return
    }
    commitPoints(orderedPoints.filter((point) => point.pointId !== pointId))
  }

  return (
    <div className="ReferenceTimelineGraphShell">
      <svg
        ref={hostRef}
        className="ReferenceTimelineGraph"
        viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
        onPointerDown={handleBackgroundPointerDown}
      >
        <rect
          x={0}
          y={0}
          width={GRAPH_WIDTH}
          height={GRAPH_HEIGHT}
          className="ReferenceTimelineGraphFrame"
          rx={10}
        />
        {[0.25, 0.5, 0.75].map((ratio) => (
          <g key={ratio}>
            <line
              className="ReferenceTimelineGraphGridLine"
              x1={GRAPH_PADDING_X + innerWidth * ratio}
              y1={GRAPH_PADDING_Y}
              x2={GRAPH_PADDING_X + innerWidth * ratio}
              y2={GRAPH_HEIGHT - GRAPH_PADDING_Y}
            />
            <line
              className="ReferenceTimelineGraphGridLine"
              x1={GRAPH_PADDING_X}
              y1={GRAPH_PADDING_Y + innerHeight * ratio}
              x2={GRAPH_WIDTH - GRAPH_PADDING_X}
              y2={GRAPH_PADDING_Y + innerHeight * ratio}
            />
          </g>
        ))}
        <path className="ReferenceTimelineGraphPath" d={pathD} />
        {orderedPoints.map((point, index) => {
          const pointPosition = pointToScreen(point.t, point.value, range)
          const previousPoint = orderedPoints[index - 1]
          const nextPoint = orderedPoints[index + 1]
          const inHandle = point.inHandle ?? (previousPoint === undefined ? null : buildDefaultInHandle(point, previousPoint))
          const outHandle = point.outHandle ?? (nextPoint === undefined ? null : buildDefaultOutHandle(point, nextPoint))
          return (
            <g key={point.pointId}>
              {inHandle !== null ? (() => {
                const handlePosition = pointToScreen(inHandle.t, inHandle.value, range)
                return (
                  <>
                    <line
                      className="ReferenceTimelineGraphHandleLine"
                      x1={pointPosition.x}
                      y1={pointPosition.y}
                      x2={handlePosition.x}
                      y2={handlePosition.y}
                    />
                    <circle
                      className="ReferenceTimelineGraphHandle"
                      cx={handlePosition.x}
                      cy={handlePosition.y}
                      r={4}
                      onPointerDown={(event) => beginDrag(event, 'in-handle', point.pointId)}
                    />
                  </>
                )
              })() : null}
              {outHandle !== null ? (() => {
                const handlePosition = pointToScreen(outHandle.t, outHandle.value, range)
                return (
                  <>
                    <line
                      className="ReferenceTimelineGraphHandleLine"
                      x1={pointPosition.x}
                      y1={pointPosition.y}
                      x2={handlePosition.x}
                      y2={handlePosition.y}
                    />
                    <circle
                      className="ReferenceTimelineGraphHandle"
                      cx={handlePosition.x}
                      cy={handlePosition.y}
                      r={4}
                      onPointerDown={(event) => beginDrag(event, 'out-handle', point.pointId)}
                    />
                  </>
                )
              })() : null}
              <circle
                className="ReferenceTimelineGraphPoint"
                cx={pointPosition.x}
                cy={pointPosition.y}
                r={5.5}
                onPointerDown={(event) => beginDrag(event, 'point', point.pointId)}
                onContextMenu={(event) => handlePointContextMenu(event, point.pointId)}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
