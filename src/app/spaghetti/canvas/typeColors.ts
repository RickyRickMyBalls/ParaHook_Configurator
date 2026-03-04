import type { PortKind } from '../schema/spaghettiTypes'

export const TYPE_COLOR_MAP = {
  number: '#ffffff',
  boolean: '#f6d365',
  vec2: '#38bdf8',
  vec3: '#22d3ee',
  color: '#fbbf24',
  spline2: '#ff4e4e',
  spline3: '#fb7185',
  profileLoop: '#34d399',
  stations: '#a78bfa',
  railMath: '#9ca3af',
  toeLoft: '#cbd5e1',
} as const

const DEFAULT_TYPE_COLOR = '#ffffff'

export const getTypeColor = (kind: PortKind): string => TYPE_COLOR_MAP[kind] ?? DEFAULT_TYPE_COLOR
