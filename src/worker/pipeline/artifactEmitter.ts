import type { BuildResult, PartArtifact } from '../../shared/buildTypes'

export const emitArtifacts = (
  options: {
    seq: number
    projectFileId: string
    graphDocumentId: string
    buildRequestId: string
  },
  parts: PartArtifact[],
  changedParamIds?: string[],
): BuildResult => ({
  type: 'build_result',
  lane: 'build',
  seq: options.seq,
  projectFileId: options.projectFileId,
  graphDocumentId: options.graphDocumentId,
  buildRequestId: options.buildRequestId,
  parts,
  ...(changedParamIds !== undefined ? { changedParamIds: [...changedParamIds] } : {}),
})
