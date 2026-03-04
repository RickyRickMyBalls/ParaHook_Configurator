import type { BuildResult, PartArtifact } from '../../shared/buildTypes'

export const emitArtifacts = (
  seq: number,
  parts: PartArtifact[],
  changedParamIds?: string[],
): BuildResult => ({
  type: 'build_result',
  seq,
  parts,
  ...(changedParamIds !== undefined ? { changedParamIds: [...changedParamIds] } : {}),
})
