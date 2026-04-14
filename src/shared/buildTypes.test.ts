import { describe, expect, it } from 'vitest'
import {
  DEFAULT_BUILD_EXECUTION_INTENT,
  isBuildChangedInputHint,
  isPartArtifact,
  parsePartKeyString,
  partKeyToString,
  toViewerRenderablePart,
  type PartArtifact,
} from './buildTypes'

const cubeArtifact = (): PartArtifact => ({
  id: 'cube',
  label: 'Cube',
  kind: 'box',
  params: {
    width: 20,
    length: 20,
    height: 20,
  },
  partKeyStr: 'cube',
  partKey: {
    id: 'cube',
    instance: null,
  },
})

const extrudeMeshArtifact = (): PartArtifact => ({
  id: 'extrude',
  label: 'Extrude',
  kind: 'mesh',
  mesh: {
    vertices: [
      0, 0, 0,
      5, 0, 0,
      0, 0, 10,
      5, 0, 10,
      0, 20, 0,
      5, 20, 0,
      0, 20, 10,
      5, 20, 10,
    ],
    indices: [
      0, 2, 1,
      1, 2, 3,
      4, 5, 6,
      5, 7, 6,
    ],
  },
  partKeyStr: 'extrude',
  partKey: {
    id: 'extrude',
    instance: null,
  },
})

describe('buildTypes PartArtifact contract', () => {
  it('accepts canonical artifacts with matching partKey and partKeyStr', () => {
    expect(isPartArtifact(cubeArtifact())).toBe(true)
    expect(isPartArtifact(extrudeMeshArtifact())).toBe(true)
  })

  it('rejects artifacts whose partKey string identity does not match', () => {
    expect(
      isPartArtifact({
        ...cubeArtifact(),
        partKeyStr: 's001',
      }),
    ).toBe(false)
    expect(
      isPartArtifact({
        ...extrudeMeshArtifact(),
        partKeyStr: 's001',
      }),
    ).toBe(false)
  })

  it('rejects invalid mesh artifacts', () => {
    expect(
      isPartArtifact({
        ...extrudeMeshArtifact(),
        mesh: {
          vertices: [0, 0, 0, 1],
          indices: [0, 1, 2],
        },
      }),
    ).toBe(false)
  })

  it('parses and reserializes part keys deterministically', () => {
    expect(partKeyToString(parsePartKeyString('heelKick#2'))).toBe('heelKick#2')
    expect(partKeyToString(parsePartKeyString('cube'))).toBe('cube')
  })

  it('keeps viewer identity separate from source artifact identity', () => {
    expect(toViewerRenderablePart(cubeArtifact(), 's001')).toEqual({
      viewerKey: 's001',
      artifact: cubeArtifact(),
    })
  })

  it('exports the canonical default execution intent for live graph builds', () => {
    expect(DEFAULT_BUILD_EXECUTION_INTENT).toEqual({
      buildMode: 'final',
      quality: 'full',
      updatePolicy: 'auto',
      draftPolicy: 'live',
      authoritativePolicy: 'explicit',
      outputIntent: 'accepted_final',
      geometryTarget: 'authoritative',
    })
  })

  it('validates Worker 9 Phase 1 changed-input hints', () => {
    expect(
      isBuildChangedInputHint({
        kind: 'graph_local_extrude_params',
        changedNodeId: 'node-extrude-2',
        changedPartKey: 'extrude#2',
        changedFields: ['depthResolved', 'taperResolved'],
      }),
    ).toBe(true)

    expect(
      isBuildChangedInputHint({
        kind: 'graph_shared_upstream',
        changedPartKeys: ['extrude#1', 'extrude#2'],
        upstreamNodeIds: ['node-sketch-1'],
        reason: 'sketch_change',
      }),
    ).toBe(true)

    expect(
      isBuildChangedInputHint({
        kind: 'graph_local_extrude_params',
        changedNodeId: 'node-extrude-2',
        changedPartKey: 'extrude#2',
        changedFields: ['sp_featureStackIR'],
      }),
    ).toBe(false)
  })
})
