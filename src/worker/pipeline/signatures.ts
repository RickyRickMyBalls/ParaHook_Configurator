import type { BoxParams } from '../../shared/buildTypes'

export type EngineMode = 'stub_box'
export type ControlMode = 'profile_editor'

const serializeBoxParams = (payload: BoxParams): string =>
  `width=${payload.width}|length=${payload.length}|height=${payload.height}`

export const makeBuildSignature = (
  payload: BoxParams,
  engineMode: EngineMode,
  controlMode: ControlMode,
): string =>
  `build|engine=${engineMode}|control=${controlMode}|${serializeBoxParams(payload)}`

export const makePartSignature = (
  partKey: string,
  payload: BoxParams,
  engineMode: EngineMode,
  controlMode: ControlMode,
): string =>
  `part|key=${partKey}|${makeBuildSignature(payload, engineMode, controlMode)}`
