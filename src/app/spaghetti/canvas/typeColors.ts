import type { PortKind } from '../schema/spaghettiTypes'

export const TYPE_COLOR_MAP = {
  number: '#ffffff',
  boolean: '#f6d365',
  vec2: '#38bdf8',
  vec3: '#22d3ee',
  plane: '#f59e0b',
  color: '#fbbf24',
  spline2: '#ff4e4e',
  spline3: '#fb7185',
  profileLoop: '#34d399',
  sketchEntities: '#ff7a59',
  sketchProfiles: '#10b981',
  sketchProfile: '#6ee7b7',
  solidBody: '#cbd5e1',
  solidBodies: '#cbd5e1',
  stations: '#a78bfa',
  railMath: '#9ca3af',
  toeLoft: '#cbd5e1',
} as const

const DEFAULT_TYPE_COLOR = '#ffffff'
export const STRUCTURED_WIRE_ENUM_INPUT_COLOR = '#8ea2ff'

export const getTypeColor = (kind: PortKind): string => TYPE_COLOR_MAP[kind] ?? DEFAULT_TYPE_COLOR
