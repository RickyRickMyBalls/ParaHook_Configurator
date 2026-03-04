import type { PartArtifact } from '../../../../shared/partsTypes'

export const createBaseplatePart = (seed: number): PartArtifact => ({
  id: `baseplate-${seed}`,
  label: 'Baseplate',
  order: 0,
})
