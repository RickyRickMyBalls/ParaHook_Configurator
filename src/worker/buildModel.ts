import type {
  CompiledBuildData,
  PartArtifact,
} from '../shared/buildTypes'
import { buildFoothookCompatibleArtifacts } from './products/foothook/foothookCompatibilityAdapter'

export type BuildModelRequest = {
  compiledBuildData: CompiledBuildData
}

export const buildModel = ({
  compiledBuildData,
}: BuildModelRequest): PartArtifact[] =>
  buildFoothookCompatibleArtifacts({
    compiledBuildData,
  })
