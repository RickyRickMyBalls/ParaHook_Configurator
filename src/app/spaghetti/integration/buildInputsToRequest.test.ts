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

const extrudeBuildInputs = (): SpaghettiBuildInputs => ({
  orderedPartKeys: ['extrude#1', 'extrude#2'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        'extrude#1': [{ op: 'extrude', featureId: 'node-extrude-1' }],
        'extrude#2': [{ op: 'extrude', featureId: 'node-extrude-2' }],
      },
    },
  },
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
            bodyId: null,
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

  it('drops authored extrudes that are not wired into output preview from worker-facing build data', () => {
    const translated = buildRequestFromBuildInputs(extrudeBuildInputs(), {
      ...previewPreparation(),
      outputSlotIds: [],
      previewCandidateSlotIds: [],
      previewCandidatePartKeys: [],
      sourceNodeIdBySlotId: {},
      sourcePartKeyBySlotId: {},
      sourcePortIdBySlotId: {},
      sourcePartKeyByNodeId: {},
      slotStatusBySlotId: {},
    })

    expect(translated.compiledBuildData.orderedPartKeys).toEqual([])
    expect(translated.buildStatsPartKeys).toEqual([])
    expect(translated.compiledBuildData.resolvedShared?.sp_featureStackIR).toEqual({
      schemaVersion: 1,
      parts: {},
    })
  })

  it('keeps unresolved output-preview extrudes out of the required worker part list', () => {
    const translated = buildRequestFromBuildInputs(extrudeBuildInputs(), {
      ...previewPreparation(),
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude#2'],
      sourceNodeIdBySlotId: {
        s001: 'node-extrude-2',
      },
      sourcePartKeyBySlotId: {
        s001: 'extrude#2',
      },
      sourcePortIdBySlotId: {
        s001: 'SolidBody',
      },
      sourcePartKeyByNodeId: {
        'node-extrude-2': 'extrude#2',
      },
      slotStatusBySlotId: {
        s001: 'unresolved',
      },
    })

    expect(translated.compiledBuildData.orderedPartKeys).toEqual([])
    expect(translated.buildStatsPartKeys).toEqual([])
    expect(translated.targetBuildUnitIds).toEqual(['output-entry:s001:node-extrude-2'])
    expect(translated.compiledBuildData.resolvedShared?.sp_featureStackIR).toEqual({
      schemaVersion: 1,
      parts: {},
    })
  })

  it('keeps output-preview-ready extrudes in the worker-facing required part list', () => {
    const translated = buildRequestFromBuildInputs(extrudeBuildInputs(), {
      ...previewPreparation(),
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude#2'],
      sourceNodeIdBySlotId: {
        s001: 'node-extrude-2',
      },
      sourcePartKeyBySlotId: {
        s001: 'extrude#2',
      },
      sourcePortIdBySlotId: {
        s001: 'SolidBody',
      },
      sourcePartKeyByNodeId: {
        'node-extrude-2': 'extrude#2',
      },
      slotStatusBySlotId: {
        s001: 'ok',
      },
    })

    expect(translated.compiledBuildData.orderedPartKeys).toEqual(['extrude#2'])
    expect(translated.buildStatsPartKeys).toEqual(['extrude#2'])
    expect(translated.compiledBuildData.resolvedShared?.sp_featureStackIR).toEqual({
      schemaVersion: 1,
      parts: {
        'extrude#2': [{ op: 'extrude', featureId: 'node-extrude-2' }],
      },
    })
  })

  it('fans split publication into multiple deterministic output-entry build units', () => {
    const translated = buildRequestFromBuildInputs(extrudeBuildInputs(), {
      ...previewPreparation(),
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude#2'],
      sourceNodeIdBySlotId: {
        s001: 'node-extrude-2',
      },
      sourcePartKeyBySlotId: {
        s001: 'extrude#2',
      },
      sourcePortIdBySlotId: {
        s001: 'SolidBody',
      },
      sourcePartKeyByNodeId: {
        'node-extrude-2': 'extrude#2',
      },
      publicationModeBySlotId: {
        s001: 'split',
      },
      splitMemberCountBySlotId: {
        s001: 2,
      },
      slotStatusBySlotId: {
        s001: 'ok',
      },
    })

    expect(translated.compiledBuildData.outputEntries).toEqual([
      {
        buildUnitId: 'output-entry:s001:node-extrude-2:member-001',
        outputEntryId: 'output-entry:s001:node-extrude-2:member-001',
        sourceNodeId: 'node-extrude-2',
        partKey: 'extrude#2',
        bodyId: 'node-extrude-2:body:001',
      },
      {
        buildUnitId: 'output-entry:s001:node-extrude-2:member-002',
        outputEntryId: 'output-entry:s001:node-extrude-2:member-002',
        sourceNodeId: 'node-extrude-2',
        partKey: 'extrude#2',
        bodyId: 'node-extrude-2:body:002',
      },
    ])
    expect(translated.targetBuildUnitIds).toEqual([
      'output-entry:s001:node-extrude-2:member-001',
      'output-entry:s001:node-extrude-2:member-002',
    ])
  })

  it('builds unique output-entry ids when one slot flattens multiple contributors from the same node', () => {
    const translated = buildRequestFromBuildInputs(extrudeBuildInputs(), {
      ...previewPreparation(),
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude#2'],
      sourceNodeIdBySlotId: {
        s001: 'node-extrude-2',
      },
      sourcePartKeyBySlotId: {
        s001: 'extrude#2',
      },
      sourcePortIdBySlotId: {
        s001: 'SolidBody:001',
      },
      sourcePartKeyByNodeId: {
        'node-extrude-2': 'extrude#2',
      },
      sourceEntriesBySlotId: {
        s001: [
          {
            slotId: 's001',
            sourceNodeId: 'node-extrude-2',
            sourcePartKeyStr: 'extrude#2',
            sourcePortId: 'SolidBody:001',
          },
          {
            slotId: 's001',
            sourceNodeId: 'node-extrude-2',
            sourcePartKeyStr: 'extrude#2',
            sourcePortId: 'SolidBody:002',
          },
        ],
      },
      slotStatusBySlotId: {
        s001: 'ok',
      },
    })

    expect(translated.compiledBuildData.outputEntries).toEqual([
      {
        buildUnitId: 'output-entry:s001:node-extrude-2:port-SolidBody%3A001',
        outputEntryId: 'output-entry:s001:node-extrude-2:port-SolidBody%3A001',
        sourceNodeId: 'node-extrude-2',
        partKey: 'extrude#2',
        bodyId: 'node-extrude-2:body:001',
      },
      {
        buildUnitId: 'output-entry:s001:node-extrude-2:port-SolidBody%3A002',
        outputEntryId: 'output-entry:s001:node-extrude-2:port-SolidBody%3A002',
        sourceNodeId: 'node-extrude-2',
        partKey: 'extrude#2',
        bodyId: 'node-extrude-2:body:002',
      },
    ])
    expect(translated.targetBuildUnitIds).toEqual([
      'output-entry:s001:node-extrude-2:port-SolidBody%3A001',
      'output-entry:s001:node-extrude-2:port-SolidBody%3A002',
    ])
  })
})
