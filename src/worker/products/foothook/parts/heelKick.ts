import type { PartArtifact } from '../../../../shared/partsTypes'

export const createHeelKickPart = (seed: number): PartArtifact => ({
  id: `heel-kick-${seed}`,
  label: 'Heel Kick',
  kind: 'box',
  params: {
    length: 1,
    width: 1,
    height: 1,
  },
  partKeyStr: `heel-kick-${seed}`,
  partKey: {
    id: `heel-kick-${seed}`,
    instance: null,
  },
})
