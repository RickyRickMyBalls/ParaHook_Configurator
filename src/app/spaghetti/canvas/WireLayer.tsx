import { useMemo } from 'react'
import type { SpaghettiEdge } from '../schema/spaghettiTypes'
import {
  buildWireCrossings,
  buildWireGeometries,
  getBezierPath,
  getCrossingGapPath,
  getCrossingLoopPath,
} from './spaghettiWires'
import type { EdgeWaypointMap, Point2, PortAnchorMap, PortDirection } from './types'
import { buildPortAnchorKey } from './types'
import { getTypeColor } from './typeColors'

type WireLayerProps = {
  edges: SpaghettiEdge[]
  edgeWaypoints: EdgeWaypointMap
  edgeColorById: Record<string, string>
  portAnchors: PortAnchorMap
  wireCurviness: number
  width: number
  height: number
  selectedEdgeId: string | null
  hoveredEdgeId: string | null
  selectedWaypoint: { edgeId: string; waypointId: string } | null
  previewFrom: { nodeId: string; portId: string; path?: string[]; direction: PortDirection } | null
  previewPointer: Point2 | null
  previewColor: string | null
  onEdgeHover: (edgeId: string | null) => void
  onEdgeSelect: (edgeId: string | null) => void
  onEdgeDoubleClick: (edgeId: string, clientX: number, clientY: number) => void
  onWaypointPointerDown: (
    edgeId: string,
    waypointId: string,
    clientX: number,
    clientY: number,
  ) => void
  onWaypointDoubleClick: (edgeId: string, waypointId: string) => void
}

export function WireLayer({
  edges,
  edgeWaypoints,
  edgeColorById,
  portAnchors,
  wireCurviness,
  width,
  height,
  selectedEdgeId,
  hoveredEdgeId,
  selectedWaypoint,
  previewFrom,
  previewPointer,
  previewColor,
  onEdgeHover,
  onEdgeSelect,
  onEdgeDoubleClick,
  onWaypointPointerDown,
  onWaypointDoubleClick,
}: WireLayerProps) {
  const geometries = useMemo(
    () => buildWireGeometries(edges, portAnchors, edgeWaypoints, wireCurviness),
    [edgeWaypoints, edges, portAnchors, wireCurviness],
  )

  const crossings = useMemo(
    () => buildWireCrossings(geometries, selectedEdgeId, hoveredEdgeId),
    [geometries, selectedEdgeId, hoveredEdgeId],
  )

  const previewPath = useMemo(() => {
    if (previewFrom === null || previewPointer === null) {
      return null
    }
    const fromAnchorKey = buildPortAnchorKey(
      previewFrom.nodeId,
      previewFrom.direction,
      previewFrom.portId,
      previewFrom.path,
    )
    const fromAnchor = portAnchors[fromAnchorKey]
    if (fromAnchor === undefined) {
      return null
    }
    return getBezierPath(
      { x: fromAnchor.x, y: fromAnchor.y },
      { x: previewPointer.x, y: previewPointer.y },
      wireCurviness,
      {
        startMode: previewFrom.direction === 'out' ? 'out' : 'in',
        endMode: 'auto',
      },
    ).d
  }, [portAnchors, previewFrom, previewPointer, wireCurviness])

  return (
    <svg className="SpaghettiWireLayer spaghettiWireSvg" viewBox={`0 0 ${width} ${height}`}>
      {geometries.map((geometry) => {
        const isSelected = geometry.edge.edgeId === selectedEdgeId
        const isHovered = geometry.edge.edgeId === hoveredEdgeId
        const wireColor = edgeColorById[geometry.edge.edgeId] ?? getTypeColor('number')
        return (
          <path
            key={geometry.edge.edgeId}
            d={geometry.bezier.d}
            className={`SpaghettiWire ${
              isSelected ? 'SpaghettiWire--selected' : isHovered ? 'SpaghettiWire--hovered' : ''
            }`}
            style={{ stroke: wireColor }}
            onMouseEnter={() => onEdgeHover(geometry.edge.edgeId)}
            onMouseLeave={() => onEdgeHover(null)}
            onClick={(event) => {
              event.stopPropagation()
              onEdgeSelect(geometry.edge.edgeId)
            }}
            onDoubleClick={(event) => {
              event.stopPropagation()
              onEdgeDoubleClick(geometry.edge.edgeId, event.clientX, event.clientY)
            }}
          />
        )
      })}

      {geometries.map((geometry) => {
        const waypoints = edgeWaypoints[geometry.edge.edgeId]
        if (waypoints === undefined || waypoints.length === 0) {
          return null
        }
        const wireColor = edgeColorById[geometry.edge.edgeId] ?? getTypeColor('number')
        return waypoints.map((waypoint) => (
          <circle
            key={`waypoint-${geometry.edge.edgeId}-${waypoint.waypointId}`}
            cx={waypoint.x}
            cy={waypoint.y}
            r={6}
            className={`SpaghettiWireWaypoint ${
              selectedWaypoint !== null &&
              selectedWaypoint.edgeId === geometry.edge.edgeId &&
              selectedWaypoint.waypointId === waypoint.waypointId
                ? 'SpaghettiWireWaypoint--selected'
                : geometry.edge.edgeId === hoveredEdgeId
                  ? 'SpaghettiWireWaypoint--hovered'
                  : ''
            }`}
            style={{ stroke: wireColor }}
            onMouseEnter={() => onEdgeHover(geometry.edge.edgeId)}
            onMouseLeave={() => onEdgeHover(null)}
            onPointerDown={(event) => {
              event.stopPropagation()
              onWaypointPointerDown(
                geometry.edge.edgeId,
                waypoint.waypointId,
                event.clientX,
                event.clientY,
              )
            }}
            onDoubleClick={(event) => {
              event.stopPropagation()
              onWaypointDoubleClick(geometry.edge.edgeId, waypoint.waypointId)
            }}
          />
        ))
      })}

      {crossings.map((crossing) => (
        <path
          key={`gap-${crossing.crossingId}`}
          d={getCrossingGapPath(crossing)}
          className="SpaghettiWireGap"
        />
      ))}

      {crossings.map((crossing) => (
        <path
          key={`loop-${crossing.crossingId}`}
          d={getCrossingLoopPath(crossing)}
          className={`SpaghettiWireLoop ${
            crossing.overEdgeId === selectedEdgeId
              ? 'SpaghettiWireLoop--selected'
              : crossing.overEdgeId === hoveredEdgeId
                ? 'SpaghettiWireLoop--hovered'
                : ''
          }`}
          style={{ stroke: edgeColorById[crossing.overEdgeId] ?? getTypeColor('number') }}
        />
      ))}

      {previewPath !== null ? (
        <path
          d={previewPath}
          className="SpaghettiWire SpaghettiWire--preview"
          style={previewColor === null ? undefined : { stroke: previewColor }}
        />
      ) : null}
    </svg>
  )
}
