import type { PartArtifact } from '../../../../shared/partsTypes'

export const createToeHookPart = (seed: number): PartArtifact => ({
  id: `toe-hook-${seed}`,
  label: 'Toe Hook',
  kind: 'box',
  params: {
    length: 1,
    width: 1,
    height: 1,
  },
  partKeyStr: `toe-hook-${seed}`,
  partKey: {
    id: `toe-hook-${seed}`,
    instance: null,
  },
})
