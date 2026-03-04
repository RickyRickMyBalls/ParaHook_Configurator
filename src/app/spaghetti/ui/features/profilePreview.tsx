type Point2 = {
  x: number
  y: number
}

export type PreviewProfile = {
  profileId: string
  area: number
  vertices: Point2[]
}

export type PreviewProfileWithLabel = PreviewProfile & {
  label: string
}

export type Bounds2 = {
  minX: number
  maxX: number
  minY: number
  maxY: number
  width: number
  height: number
}

const pointsEqual = (a: Point2, b: Point2): boolean => a.x === b.x && a.y === b.y

export const profileLabelForIndex = (index: number): string => {
  if (index >= 0 && index < 26) {
    return String.fromCharCode(65 + index)
  }
  return `Profile ${index + 1}`
}

export const formatStableNumber = (value: number): string =>
  Number.isInteger(value) ? value.toString() : value.toFixed(3)

export const sortProfilesForPreview = (
  profiles: readonly PreviewProfile[],
): PreviewProfile[] =>
  [...profiles].sort((a, b) => b.area - a.area || a.profileId.localeCompare(b.profileId))

export const labelProfilesForPreview = (
  profiles: readonly PreviewProfile[],
): PreviewProfileWithLabel[] =>
  sortProfilesForPreview(profiles).map((profile, index) => ({
    ...profile,
    label: profileLabelForIndex(index),
  }))

export const ensureClosedLoop = (vertices: readonly Point2[]): Point2[] => {
  if (vertices.length === 0) {
    return []
  }
  const closed = [...vertices]
  const first = closed[0]
  const last = closed[closed.length - 1]
  if (!pointsEqual(first, last)) {
    closed.push(first)
  }
  return closed
}

export const computeBounds = (vertices: readonly Point2[]): Bounds2 | null => {
  if (vertices.length === 0) {
    return null
  }
  let minX = vertices[0].x
  let maxX = vertices[0].x
  let minY = vertices[0].y
  let maxY = vertices[0].y
  for (const vertex of vertices) {
    minX = Math.min(minX, vertex.x)
    maxX = Math.max(maxX, vertex.x)
    minY = Math.min(minY, vertex.y)
    maxY = Math.max(maxY, vertex.y)
  }
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

export const fitVerticesToBox = (
  vertices: readonly Point2[],
  width: number,
  height: number,
  padding = 4,
): Point2[] => {
  if (width <= 0 || height <= 0) {
    return []
  }

  const closed = ensureClosedLoop(vertices)
  const bounds = computeBounds(closed)
  if (bounds === null) {
    return []
  }

  const contentWidth = Math.max(1, width - padding * 2)
  const contentHeight = Math.max(1, height - padding * 2)
  const scaleX = bounds.width > 0 ? contentWidth / bounds.width : Number.POSITIVE_INFINITY
  const scaleY = bounds.height > 0 ? contentHeight / bounds.height : Number.POSITIVE_INFINITY
  const scale = Number.isFinite(Math.min(scaleX, scaleY)) ? Math.min(scaleX, scaleY) : 1

  const sourceCenterX = (bounds.minX + bounds.maxX) * 0.5
  const sourceCenterY = (bounds.minY + bounds.maxY) * 0.5
  const targetCenterX = width * 0.5
  const targetCenterY = height * 0.5

  return closed.map((vertex) => ({
    x: targetCenterX + (vertex.x - sourceCenterX) * scale,
    y: targetCenterY - (vertex.y - sourceCenterY) * scale,
  }))
}

export const renderProfilePreview = (
  vertices: readonly Point2[],
  width: number,
  height: number,
  padding = 4,
) => {
  const fitted = fitVerticesToBox(vertices, width, height, padding)
  const polylinePoints = fitted.map((point) => `${point.x.toFixed(3)},${point.y.toFixed(3)}`).join(' ')

  return (
    <svg
      className="fsPrev_svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Profile preview"
    >
      <rect className="fsPrev_svgBg" x={0} y={0} width={width} height={height} />
      {polylinePoints.length > 0 ? <polyline className="fsPrev_svgLoop" points={polylinePoints} /> : null}
    </svg>
  )
}
