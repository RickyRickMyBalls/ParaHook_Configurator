import {
  getPartArtifactKey,
  parsePartKeyString,
  type BoxParams,
  type PartArtifact,
} from '../shared/buildTypes'
import { compareSpaghettiSourcePartKeys } from '../shared/buildStatsKeys'
import type { MeshPack, RuntimeDiagnostic, Shape3D } from './cad/cadTypes'
import { deriveLegacyParts } from './pipeline/partsSpec'
import { runFoothookFeatureStack } from './products/foothook/buildFoothook'

type BuildInstances = {
  heelKickInstances?: number[]
  toeHookInstances?: number[]
}

type BuildModelRequest = {
  payload: BoxParams
  instances: BuildInstances
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null

type Bounds3 = {
  minX: number
  maxX: number
  minY: number
  maxY: number
  minZ: number
  maxZ: number
}

const GRAPH_PART_LABELS: Record<string, string> = {
  baseplate: 'Baseplate',
  cube: 'Cube',
  cubeProof: 'Cube Proof',
  heelKick: 'Heel Kick',
  toeHook: 'Toe Hook',
}

const boundsFromMesh = (mesh: MeshPack): Bounds3 | null => {
  if (mesh.vertices.length < 3 || mesh.vertices.length % 3 !== 0) {
    return null
  }
  let minX = mesh.vertices[0]
  let maxX = mesh.vertices[0]
  let minY = mesh.vertices[1]
  let maxY = mesh.vertices[1]
  let minZ = mesh.vertices[2]
  let maxZ = mesh.vertices[2]

  for (let index = 3; index < mesh.vertices.length; index += 3) {
    const x = mesh.vertices[index]
    const y = mesh.vertices[index + 1]
    const z = mesh.vertices[index + 2]
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
    minZ = Math.min(minZ, z)
    maxZ = Math.max(maxZ, z)
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
  }
}

const mergeBounds = (current: Bounds3, next: Bounds3): Bounds3 => ({
  minX: Math.min(current.minX, next.minX),
  maxX: Math.max(current.maxX, next.maxX),
  minY: Math.min(current.minY, next.minY),
  maxY: Math.max(current.maxY, next.maxY),
  minZ: Math.min(current.minZ, next.minZ),
  maxZ: Math.max(current.maxZ, next.maxZ),
})

const compareShapes = (a: Shape3D, b: Shape3D): number =>
  compareSpaghettiSourcePartKeys(a.partKey, b.partKey) ||
  a.bodyId.localeCompare(b.bodyId) ||
  a.featureId.localeCompare(b.featureId)

const toArtifactFromBounds = (partKeyStr: string, bounds: Bounds3): PartArtifact => {
  const partKey = parsePartKeyString(partKeyStr)
  const baseLabel = GRAPH_PART_LABELS[partKey.id] ?? partKey.id
  return {
    id: partKey.id,
    label: partKey.instance === null ? baseLabel : `${baseLabel} #${partKey.instance}`,
    kind: 'box',
    params: {
      length: bounds.maxX - bounds.minX,
      width: bounds.maxY - bounds.minY,
      height: bounds.maxZ - bounds.minZ,
    },
    partKeyStr,
    partKey,
  }
}

const deriveFeatureStackArtifacts = (
  bodies: Record<string, Shape3D>,
  existingPartKeys: ReadonlySet<string>,
): PartArtifact[] => {
  const boundsByPartKey = new Map<string, Bounds3>()
  const sortedBodies = Object.values(bodies).sort(compareShapes)

  for (const body of sortedBodies) {
    const nextBounds = boundsFromMesh(body.mesh)
    if (nextBounds === null) {
      continue
    }
    const current = boundsByPartKey.get(body.partKey)
    boundsByPartKey.set(body.partKey, current === undefined ? nextBounds : mergeBounds(current, nextBounds))
  }

  return [...boundsByPartKey.entries()]
    .filter(([partKey]) => !existingPartKeys.has(partKey))
    .sort((a, b) => compareSpaghettiSourcePartKeys(a[0], b[0]))
    .map(([partKey, bounds]) => toArtifactFromBounds(partKey, bounds))
}

const flushDiagnostics = (diagnostics: readonly RuntimeDiagnostic[]): void => {
  if (diagnostics.length === 0) {
    return
  }
  const unique = new Map<string, RuntimeDiagnostic>()
  for (const diagnostic of diagnostics) {
    const key = `${diagnostic.partKey}|${diagnostic.featureId}|${diagnostic.reason}`
    if (!unique.has(key)) {
      unique.set(key, diagnostic)
    }
  }
  if (unique.size === 0) {
    return
  }
  const sorted = [...unique.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  const lines = sorted.map(
    ([key, diagnostic]) => `${key}: ${diagnostic.message}`,
  )
  console.warn(
    `[FeatureStackRuntime] ${lines.length} unique warning(s)\n${lines.join('\n')}`,
  )
}

export const buildModel = ({ payload, instances }: BuildModelRequest): PartArtifact[] => {
  const legacyParts = deriveLegacyParts(payload, instances)
  const profilePatch = asRecord(payload)
  if (profilePatch === null) {
    return legacyParts
  }

  const featureStackResult = runFoothookFeatureStack(profilePatch)
  if (featureStackResult !== null) {
    flushDiagnostics(featureStackResult.diagnostics)
    const legacyPartKeys = new Set(legacyParts.map(getPartArtifactKey))
    return [
      ...legacyParts,
      ...deriveFeatureStackArtifacts(featureStackResult.bodies, legacyPartKeys),
    ]
  }
  return legacyParts
}
