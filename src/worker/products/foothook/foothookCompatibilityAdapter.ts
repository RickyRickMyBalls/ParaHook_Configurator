import type {
  GeometryBody,
  GeometryDiagnostic,
  GeometryMesh,
  GeometryResultBundle,
  GeometryResultRequestIdentity,
} from '../../../shared/geometryResult'
import {
  type ArtifactMesh,
  type CompiledBuildData,
  parsePartKeyString,
  type PartArtifact,
} from '../../../shared/buildTypes'
import { compareSpaghettiSourcePartKeys } from '../../../shared/buildStatsKeys'
import { mergeMeshPacks } from '../../cad/cadKernelAdapter'
import { runFoothookFeatureStack } from './buildFoothook'

export type FoothookCompatibilityBuildInput = {
  compiledBuildData: CompiledBuildData
  request: GeometryResultRequestIdentity
}

const GRAPH_PART_LABELS: Record<string, string> = {
  baseplate: 'Baseplate',
  cube: 'Cube',
  cubeProof: 'Cube Proof',
  extrude: 'Extrude',
  heelKick: 'Heel Kick',
  toeHook: 'Toe Hook',
}

const compareShapes = (a: GeometryBody, b: GeometryBody): number =>
  compareSpaghettiSourcePartKeys(a.partKey, b.partKey) ||
  a.bodyId.localeCompare(b.bodyId) ||
  a.featureId.localeCompare(b.featureId)

const getArtifactLabel = (partKeyStr: string): { partKey: ReturnType<typeof parsePartKeyString>; label: string } => {
  const partKey = parsePartKeyString(partKeyStr)
  const baseLabel = GRAPH_PART_LABELS[partKey.id] ?? partKey.id
  return {
    partKey,
    label: partKey.instance === null ? baseLabel : `${baseLabel} #${partKey.instance}`,
  }
}

const toMeshArtifact = (partKeyStr: string, mesh: ArtifactMesh): PartArtifact => {
  const { partKey, label } = getArtifactLabel(partKeyStr)
  return {
    id: partKey.id,
    label,
    kind: 'mesh',
    mesh,
    partKeyStr,
    partKey,
  }
}

const deriveFeatureStackMeshArtifacts = (
  bodies: Record<string, GeometryBody>,
  existingPartKeys: ReadonlySet<string>,
): PartArtifact[] => {
  const meshesByPartKey = new Map<string, GeometryMesh[]>()
  const sortedBodies = Object.values(bodies).sort(compareShapes)

  for (const body of sortedBodies) {
    const current = meshesByPartKey.get(body.partKey)
    if (current === undefined) {
      meshesByPartKey.set(body.partKey, [body.mesh])
      continue
    }
    current.push(body.mesh)
  }

  return [...meshesByPartKey.entries()]
    .filter(([partKey]) => !existingPartKeys.has(partKey))
    .sort((a, b) => compareSpaghettiSourcePartKeys(a[0], b[0]))
    .map(([partKey, meshes]) => {
      const mergedMesh = meshes.length === 1 ? meshes[0] : mergeMeshPacks(meshes)
      return toMeshArtifact(partKey, {
        vertices: [...mergedMesh.vertices],
        indices: [...mergedMesh.indices],
      })
    })
}

const flushDiagnostics = (diagnostics: readonly GeometryDiagnostic[]): void => {
  if (diagnostics.length === 0) {
    return
  }
  const unique = new Map<string, GeometryDiagnostic>()
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

export const buildFoothookCompatibleArtifacts = ({
  compiledBuildData,
  request,
}: FoothookCompatibilityBuildInput): PartArtifact[] => {
  const retainedGeometryResult = buildFoothookRetainedGeometryResult({
    compiledBuildData,
    request,
  })
  return buildFoothookCompatibleArtifactsFromRetainedGeometryResult(retainedGeometryResult)
}

export const buildFoothookRetainedGeometryResult = ({
  compiledBuildData,
  request,
}: FoothookCompatibilityBuildInput): GeometryResultBundle | null => {
  const sharedBuildData =
    typeof compiledBuildData.resolvedShared === 'object' && compiledBuildData.resolvedShared !== null
      ? compiledBuildData.resolvedShared
      : {}
  return runFoothookFeatureStack({
    profilePatch: sharedBuildData,
    request,
  })
}

export const buildFoothookCompatibleArtifactsFromRetainedGeometryResult = (
  retainedGeometryResult: GeometryResultBundle | null,
): PartArtifact[] => {
  if (retainedGeometryResult === null) {
    return []
  }
  flushDiagnostics(retainedGeometryResult.diagnostics)
  return deriveFeatureStackMeshArtifacts(retainedGeometryResult.bodies, new Set())
}
