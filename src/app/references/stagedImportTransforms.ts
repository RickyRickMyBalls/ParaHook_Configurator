import type { ReferenceTransformVector3 } from './referenceManifest'

export type StagedImportTransformUpAxis = 'z-up' | 'y-up' | 'x-up'
export type StagedImportTransformScaleAlignment =
  | 'current-size'
  | 'millimeters'
  | 'centimeters'
  | 'meters'
  | 'inches'

export type StagedImportResolvedScaleAlignment =
  | StagedImportTransformScaleAlignment
  | 'custom'

export const resolveStagedImportUpAxisRotationDeg = (
  upAxis: StagedImportTransformUpAxis,
): ReferenceTransformVector3 =>
  upAxis === 'z-up'
    ? { x: 0, y: 0, z: 0 }
    : upAxis === 'y-up'
      ? { x: 90, y: 0, z: 0 }
      : { x: 0, y: -90, z: 0 }

export const resolveStagedImportScaleAlignmentFactor = (
  scaleAlignment: StagedImportResolvedScaleAlignment,
): number => {
  switch (scaleAlignment) {
    case 'millimeters':
      return 1
    case 'centimeters':
      return 10
    case 'meters':
      return 1000
    case 'inches':
      return 25.4
    case 'custom':
    case 'current-size':
    default:
      return 1
  }
}

export const resolveStagedImportScaleMultiplier = (file: {
  scaleAlignment: StagedImportResolvedScaleAlignment
  scaleMultiplier?: number | null
}): number => {
  if (typeof file.scaleMultiplier === 'number' && Number.isFinite(file.scaleMultiplier)) {
    return Number(file.scaleMultiplier.toFixed(4))
  }
  return resolveStagedImportScaleAlignmentFactor(file.scaleAlignment)
}

export const resolveStagedImportScaleAlignmentFromMultiplier = (
  scaleMultiplier: number,
): StagedImportResolvedScaleAlignment => {
  const normalizedMultiplier = Number(scaleMultiplier.toFixed(4))
  if (normalizedMultiplier === 1) {
    return 'millimeters'
  }
  if (normalizedMultiplier === 10) {
    return 'centimeters'
  }
  if (normalizedMultiplier === 1000) {
    return 'meters'
  }
  if (normalizedMultiplier === 25.4) {
    return 'inches'
  }
  return 'custom'
}
