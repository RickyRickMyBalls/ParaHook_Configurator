import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three'
import { describe, expect, it } from 'vitest'
import { extractReferencePartDescriptors } from './referencePartDescriptors'

describe('extractReferencePartDescriptors', () => {
  it('returns named mesh descriptors when a reference contains multiple parts', () => {
    const root = new Group()
    const left = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial())
    left.name = 'Shell'
    const right = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial())
    right.name = 'Mount'
    root.add(left, right)

    expect(extractReferencePartDescriptors('ref-1', root)).toEqual([
      { partKey: 'reference-part:ref-1:0', label: 'Shell', sourceMeshIndex: 0 },
      { partKey: 'reference-part:ref-1:1', label: 'Mount', sourceMeshIndex: 1 },
    ])
  })

  it('stays flat for single-mesh references', () => {
    const root = new Group()
    root.add(new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial()))

    expect(extractReferencePartDescriptors('ref-1', root)).toEqual([])
  })
})
