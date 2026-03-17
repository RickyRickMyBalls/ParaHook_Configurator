import { describe, expect, it } from 'vitest'
import { Group, Mesh } from 'three'
import { buildObjectFromStepImportResult } from './stepReferenceLoader'

describe('buildObjectFromStepImportResult', () => {
  it('builds a grouped three object tree from the occt STEP import JSON', () => {
    const object = buildObjectFromStepImportResult({
      success: true,
      root: {
        name: 'Hook Root',
        meshes: [],
        children: [
          {
            name: 'Large Hook',
            meshes: [0],
            children: [],
          },
        ],
      },
      meshes: [
        {
          name: 'Large Hook Mesh',
          color: [0.5, 0.25, 0.75],
          attributes: {
            position: {
              array: [
                0, 0, 0,
                10, 0, 0,
                0, 10, 0,
              ],
            },
          },
          index: {
            array: [0, 1, 2],
          },
        },
      ],
    })

    expect(object).toBeInstanceOf(Group)
    expect(object.name).toBe('Hook Root')
    expect(object.children).toHaveLength(1)
    expect(object.children[0]).toBeInstanceOf(Group)
    expect(object.children[0]?.name).toBe('Large Hook')
    expect(object.children[0]?.children[0]).toBeInstanceOf(Mesh)
    expect(object.children[0]?.children[0]?.name).toBe('Large Hook Mesh')
  })
})
