import type { BoxParams, PartArtifact } from '../shared/buildTypes'
import type { RuntimeDiagnostic } from './cad/cadTypes'
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
  }
  return legacyParts
}
