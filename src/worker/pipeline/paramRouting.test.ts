import { describe, expect, it } from 'vitest'
import { computeAffectedPartKeys } from './paramRouting'

describe('computeAffectedPartKeys', () => {
  it('narrows branch-local extrude hints to the changed part key', () => {
    expect(
      computeAffectedPartKeys(
        ['sp_featureStackIR'],
        ['extrude#1', 'extrude#2'],
        {
          kind: 'graph_local_extrude_params',
          changedNodeId: 'node-extrude-2',
          changedPartKey: 'extrude#2',
          changedFields: ['depthResolved'],
        },
      ),
    ).toEqual(['extrude#2'])
  })

  it('widens shared-upstream hints to the changed downstream part keys', () => {
    expect(
      computeAffectedPartKeys(
        ['sp_featureStackIR'],
        ['extrude#1', 'extrude#2', 'extrude#3'],
        {
          kind: 'graph_shared_upstream',
          changedPartKeys: ['extrude#1', 'extrude#2'],
          upstreamNodeIds: ['node-sketch-1'],
          reason: 'sketch_change',
        },
      ),
    ).toEqual(['extrude#1', 'extrude#2'])
  })

  it('falls back to changedParamIds when no changed-input hint is available', () => {
    expect(computeAffectedPartKeys(['sp_featureStackIR'], ['extrude#1', 'extrude#2'])).toEqual([
      'extrude#1',
      'extrude#2',
    ])
  })
})
