import { describe, expect, it } from 'vitest'
import {
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

describe('buildTypes PartArtifact contract', () => {
  it('accepts canonical artifacts with matching partKey and partKeyStr', () => {
    expect(isPartArtifact(cubeArtifact())).toBe(true)
  })

  it('rejects artifacts whose partKey string identity does not match', () => {
    expect(
      isPartArtifact({
        ...cubeArtifact(),
        partKeyStr: 's001',
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
})
