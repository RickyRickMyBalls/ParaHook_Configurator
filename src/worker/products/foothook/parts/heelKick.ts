import type { PartArtifact } from '../../../../shared/partsTypes'

export const createHeelKickPart = (seed: number): PartArtifact => ({
  id: `heel-kick-${seed}`,
  label: 'Heel Kick',
  order: 1,
})
