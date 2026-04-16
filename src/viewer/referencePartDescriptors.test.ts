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

  it('disambiguates duplicate meaningful part labels in stable source order', () => {
    const root = new Group()
    const firstBracketGroup = new Group()
    firstBracketGroup.name = 'Bracket'
    firstBracketGroup.add(new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial()))
    const secondBracketGroup = new Group()
    secondBracketGroup.name = 'Bracket'
    secondBracketGroup.add(new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial()))
    root.add(firstBracketGroup, secondBracketGroup)

    expect(extractReferencePartDescriptors('ref-dup', root)).toEqual([
      { partKey: 'reference-part:ref-dup:0', label: 'Bracket', sourceMeshIndex: 0 },
      { partKey: 'reference-part:ref-dup:1', label: 'Bracket 2', sourceMeshIndex: 1 },
    ])
  })

  it('falls back to deterministic Part N labels when the source names stay generic', () => {
    const root = new Group()
    const first = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial())
    first.name = 'Mesh'
    const second = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial())
    second.name = 'Mesh_1'
    root.add(first, second)

    expect(extractReferencePartDescriptors('ref-flat', root)).toEqual([
      { partKey: 'reference-part:ref-flat:0', label: 'Part 1', sourceMeshIndex: 0 },
      { partKey: 'reference-part:ref-flat:1', label: 'Part 2', sourceMeshIndex: 1 },
    ])
  })
})
