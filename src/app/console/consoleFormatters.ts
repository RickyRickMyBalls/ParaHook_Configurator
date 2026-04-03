const DRAW_VEC2_LITERAL_PATTERN =
  /^\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*,\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*$/

export const parseConsoleVec2Literal = (
  rawValue: string,
): { x: number; y: number } | null => {
  const matched = rawValue.match(DRAW_VEC2_LITERAL_PATTERN)
  if (matched === null) {
    return null
  }
  const x = Number(matched[1])
  const y = Number(matched[2])
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null
  }
  return { x, y }
}

export const parseConsoleVec3Literal = (
  input: string,
): { x: number; y: number; z: number } | null => {
  const match = input.match(
    /^\s*(?:vec3\s*[\[(]\s*)?(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*(?:[\])]\s*)?$/i,
  )
  if (match === null) {
    return null
  }
  const [, xText, yText, zText] = match
  const x = Number(xText)
  const y = Number(yText)
  const z = Number(zText)
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
    return null
  }
  return { x, y, z }
}

export const parseConsoleSignedFloatLiteral = (input: string): number | null => {
  const trimmed = input.trim()
  if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(trimmed)) {
    return null
  }
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}
