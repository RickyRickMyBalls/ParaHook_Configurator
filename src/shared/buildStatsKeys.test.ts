import { describe, expect, it } from 'vitest'
import {
  deriveSpaghettiSourcePartKeysFromProfilePatch,
  orderSpaghettiSourcePartKeys,
} from './buildStatsKeys'

describe('buildStatsKeys', () => {
  it('derives spaghetti source/build part keys from canonical profile patch content', () => {
    expect(
      deriveSpaghettiSourcePartKeysFromProfilePatch({
        viewerKey: 's001',
        sp_featureStackIR: {
          schemaVersion: 1,
          parts: {
            cube: [],
          },
        },
      }),
    ).toEqual(['cube'])
  })

  it('orders mixed spaghetti source/build part keys deterministically', () => {
    expect(
      orderSpaghettiSourcePartKeys(['heelKick#1', 'cube', 'alpha', 'baseplate', 'cube']),
    ).toEqual(['baseplate', 'cube', 'heelKick#1', 'alpha'])
  })

  it('orders numbered multi-part keys by canonical base rank and instance number', () => {
    expect(
      orderSpaghettiSourcePartKeys([
        'cube#2',
        'toeHook#2',
        'cube#1',
        'baseplate#2',
        'heelKick#1',
        'baseplate#1',
      ]),
    ).toEqual([
      'baseplate#1',
      'baseplate#2',
      'cube#1',
      'cube#2',
      'toeHook#2',
      'heelKick#1',
    ])
  })
})
