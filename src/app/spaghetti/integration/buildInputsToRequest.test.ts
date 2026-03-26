import { describe, expect, it } from 'vitest'
import {
  buildRequestFromBuildInputs,
  type SpaghettiBuildInputs,
} from './buildInputsToRequest'
import type { GraphPreviewPreparation } from '../previewPreparation'

const cubeBuildInputs = (): SpaghettiBuildInputs => ({
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

const previewPreparation = (): GraphPreviewPreparation => ({
  outputPreviewNodeId: 'node-output-preview',
  outputSlotIds: ['s001', 's002'],
  previewCandidateSlotIds: ['s001'],
  previewCandidatePartKeys: ['cube'],
  sourceNodeIdBySlotId: {
    s001: 'node-cube',
  },
  sourcePartKeyBySlotId: {
    s001: 'cube',
  },
  sourcePortIdBySlotId: {
    s001: 'SolidBody',
  },
  sourcePartKeyByNodeId: {
    'node-cube': 'cube',
  },
  slotStatusBySlotId: {
    s001: 'ok',
    s002: 'empty',
  },
  buildStatsReadyPartKeys: [],
  previewIntent: 'outputPreview',
})

describe('buildRequestFromBuildInputs', () => {
  it('builds graph-native compiled build data plus output-entry build units', () => {
    expect(buildRequestFromBuildInputs(cubeBuildInputs(), previewPreparation())).toEqual({
      compiledBuildData: {
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
        outputEntries: [
          {
            buildUnitId: 'output-entry:s001:node-cube',
            outputEntryId: 'output-entry:s001:node-cube',
            sourceNodeId: 'node-cube',
            partKey: 'cube',
          },
        ],
      },
      targetBuildUnitIds: ['output-entry:s001:node-cube'],
      affectedBuildUnitIds: ['output-entry:s001:node-cube'],
      changedParamIds: ['sp_full'],
      buildStatsPartKeys: ['cube'],
    })
  })

  it('excludes empty output-preview slots from build-unit targeting', () => {
    const translated = buildRequestFromBuildInputs(cubeBuildInputs(), previewPreparation())

    expect(translated.targetBuildUnitIds).toEqual(['output-entry:s001:node-cube'])
    expect(translated.affectedBuildUnitIds).toEqual(['output-entry:s001:node-cube'])
    expect(translated.targetBuildUnitIds).not.toContain('output-entry:s002:unbound')
  })

  it('keeps repeated spaghetti build translation deterministic', () => {
    const current = cubeBuildInputs()
    const first = buildRequestFromBuildInputs(current, previewPreparation())
    const second = buildRequestFromBuildInputs(current, previewPreparation(), current)

    expect(first.buildStatsPartKeys).toEqual(['cube'])
    expect(second.buildStatsPartKeys).toEqual(['cube'])
    expect(second.changedParamIds).toEqual([])
    expect(second.targetBuildUnitIds).toEqual(['output-entry:s001:node-cube'])
  })

  it('uses compile-owned ordered part keys for deterministic multi-part stats rows', () => {
    const buildInputs: SpaghettiBuildInputs = {
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

    expect(
      buildRequestFromBuildInputs(buildInputs, previewPreparation()).buildStatsPartKeys,
    ).toEqual([
      'cube#1',
      'cube#2',
    ])
  })
})
