import { describe, expect, it } from 'vitest'
import {
  buildRequestFromBuildInputs,
  type SpaghettiBuildInputs,
} from './buildInputsToRequest'

const cubeBuildInputs = (): SpaghettiBuildInputs => ({
  instances: {
    heelKickInstances: [1],
    toeHookInstances: [1],
  },
  orderedPartKeys: ['cube'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        cube: [],
      },
    },
  },
})

describe('buildRequestFromBuildInputs', () => {
  it('derives spaghetti stats part keys from the minimal profile patch', () => {
    expect(buildRequestFromBuildInputs(cubeBuildInputs())).toEqual({
      profilePatch: {
        sp_featureStackIR: {
          schemaVersion: 1,
          parts: {
            cube: [],
          },
        },
      },
      instances: {
        heelKickInstances: [1],
        toeHookInstances: [1],
      },
      changedParamIds: ['sp_full'],
      partKeys: ['cube', 'assembled'],
    })
  })

  it('keeps repeated spaghetti build translation deterministic', () => {
    const current = cubeBuildInputs()
    const first = buildRequestFromBuildInputs(current)
    const second = buildRequestFromBuildInputs(current, current)

    expect(first.partKeys).toEqual(['cube', 'assembled'])
    expect(second.partKeys).toEqual(['cube', 'assembled'])
    expect(second.changedParamIds).toEqual([])
  })

  it('uses compile-owned ordered part keys for deterministic multi-part stats rows', () => {
    const buildInputs: SpaghettiBuildInputs = {
      instances: {
        heelKickInstances: [1],
        toeHookInstances: [1],
      },
      orderedPartKeys: ['cube#2', 'cube#1'],
      resolvedParts: {},
      resolvedShared: {
        sp_featureStackIR: {
          schemaVersion: 1,
          parts: {
            'cube#2': [],
            'cube#1': [],
          },
        },
      },
    }

    expect(buildRequestFromBuildInputs(buildInputs).partKeys).toEqual([
      'cube#1',
      'cube#2',
      'assembled',
    ])
  })
})
