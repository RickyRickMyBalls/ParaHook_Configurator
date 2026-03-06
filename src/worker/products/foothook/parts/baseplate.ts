import type { PartArtifact } from '../../../../shared/partsTypes'

export const createBaseplatePart = (seed: number): PartArtifact => ({
  id: `baseplate-${seed}`,
  label: 'Baseplate',
  kind: 'box',
  params: {
    length: 1,
    width: 1,
    height: 1,
  },
  partKeyStr: `baseplate-${seed}`,
  partKey: {
    id: `baseplate-${seed}`,
    instance: null,
  },
})
