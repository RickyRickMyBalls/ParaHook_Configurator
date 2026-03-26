import type {
  CompiledBuildData,
} from '../../shared/buildTypes'

export type EngineMode = 'stub_box'
export type ControlMode = 'profile_editor'

const stableStringify = (value: unknown): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`
  }

  const entries = Object.entries(value as Record<string, unknown>).sort((a, b) =>
    a[0].localeCompare(b[0]),
  )
  return `{${entries
    .map(([key, nested]) => `${JSON.stringify(key)}:${stableStringify(nested)}`)
    .join(',')}}`
}

export type BuildSignatureInput = {
  compiledBuildData: CompiledBuildData
}

const serializePayload = (payload: BuildSignatureInput): string => stableStringify(payload)

export const makeBuildSignature = (
  payload: BuildSignatureInput,
  engineMode: EngineMode,
  controlMode: ControlMode,
): string =>
  `build|engine=${engineMode}|control=${controlMode}|payload=${serializePayload(payload)}`

export const makePartSignature = (
  partKey: string,
  payload: BuildSignatureInput,
  engineMode: EngineMode,
  controlMode: ControlMode,
): string =>
  `part|key=${partKey}|${makeBuildSignature(payload, engineMode, controlMode)}`
