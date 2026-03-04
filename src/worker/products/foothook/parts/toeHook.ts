import type { PartArtifact } from '../../../../shared/partsTypes'

export const createToeHookPart = (seed: number): PartArtifact => ({
  id: `toe-hook-${seed}`,
  label: 'Toe Hook',
  order: 2,
})
