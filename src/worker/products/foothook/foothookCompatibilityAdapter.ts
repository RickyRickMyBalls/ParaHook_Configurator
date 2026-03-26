import {
  type ArtifactMesh,
  type CompiledBuildData,
  parsePartKeyString,
  type PartArtifact,
} from '../../../shared/buildTypes'
import { compareSpaghettiSourcePartKeys } from '../../../shared/buildStatsKeys'
import type { MeshPack, RuntimeDiagnostic, Shape3D } from '../../cad/cadTypes'
import { mergeMeshPacks } from '../../cad/cadKernelAdapter'
import { runFoothookFeatureStack } from './buildFoothook'

export type FoothookCompatibilityBuildInput = {
  compiledBuildData: CompiledBuildData
}

const GRAPH_PART_LABELS: Record<string, string> = {
  baseplate: 'Baseplate',
  cube: 'Cube',
  cubeProof: 'Cube Proof',
  extrude: 'Extrude',
  heelKick: 'Heel Kick',
  toeHook: 'Toe Hook',
}

const compareShapes = (a: Shape3D, b: Shape3D): number =>
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
  bodies: Record<string, Shape3D>,
  existingPartKeys: ReadonlySet<string>,
): PartArtifact[] => {
  const meshesByPartKey = new Map<string, MeshPack[]>()
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

export const buildFoothookCompatibleArtifacts = ({
  compiledBuildData,
}: FoothookCompatibilityBuildInput): PartArtifact[] => {
  const sharedBuildData =
    typeof compiledBuildData.resolvedShared === 'object' && compiledBuildData.resolvedShared !== null
      ? compiledBuildData.resolvedShared
      : {}
  const featureStackResult = runFoothookFeatureStack(sharedBuildData)
  if (featureStackResult !== null) {
    flushDiagnostics(featureStackResult.diagnostics)
    return deriveFeatureStackMeshArtifacts(featureStackResult.bodies, new Set())
  }
  return []
}
