import { describe, expect, it } from 'vitest'
import { getFieldTree, getFieldNodeAtPath, listLeafFieldPaths } from './fieldTree'

describe('fieldTree', () => {
  it('builds vec2:mm tree with number:mm x/y leaves', () => {
    const tree = getFieldTree({
      kind: 'vec2',
      unit: 'mm',
    })

    expect(tree.kind).toBe('object')
    const xNode = getFieldNodeAtPath(tree, ['x'])
    const yNode = getFieldNodeAtPath(tree, ['y'])
    expect(xNode).toBeDefined()
    expect(yNode).toBeDefined()
    expect(xNode?.kind).toBe('leaf')
    expect(yNode?.kind).toBe('leaf')
    expect(xNode?.type).toEqual({ kind: 'number', unit: 'mm' })
    expect(yNode?.type).toEqual({ kind: 'number', unit: 'mm' })
  })

  it('lists spline2 leaf paths in deterministic order', () => {
    const tree = getFieldTree({ kind: 'spline2' })
    const leaves = listLeafFieldPaths(tree)

    expect(leaves.map((leaf) => leaf.path.join('.'))).toEqual([
      'end.x',
      'end.y',
      'start.x',
      'start.y',
    ])
    expect(leaves.map((leaf) => leaf.node.type)).toEqual([
      { kind: 'number', unit: 'mm' },
      { kind: 'number', unit: 'mm' },
      { kind: 'number', unit: 'mm' },
      { kind: 'number', unit: 'mm' },
    ])
  })

  it('lists profileLoop leaf paths in deterministic order', () => {
    const tree = getFieldTree({ kind: 'profileLoop' })
    const leaves = listLeafFieldPaths(tree)

    expect(leaves.map((leaf) => leaf.path.join('.'))).toEqual([
      'area',
      'centroid.x',
      'centroid.y',
    ])
    expect(leaves.map((leaf) => leaf.node.type)).toEqual([
      { kind: 'number' },
      { kind: 'number', unit: 'mm' },
      { kind: 'number', unit: 'mm' },
    ])
  })
})
