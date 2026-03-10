import { describe, expect, it } from 'vitest'
import {
  getNodeDef,
  listNodeTypes,
  listUserAddableNodeTypes,
} from './nodeRegistry'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'

describe('OutputPreview node registry contract', () => {
  it('resolves System/OutputPreview with no declared inputs or outputs', () => {
    const nodeDef = getNodeDef(OUTPUT_PREVIEW_NODE_TYPE)
    expect(nodeDef).toBeDefined()
    expect(nodeDef?.type).toBe(OUTPUT_PREVIEW_NODE_TYPE)
    expect(nodeDef?.isUserAddable).toBe(false)
    expect(nodeDef?.inputs).toEqual([])
    expect(nodeDef?.outputs).toEqual([])
  })

  it('excludes non-user-addable node defs from addable node list', () => {
    const allTypes = listNodeTypes().map((nodeDef) => nodeDef.type)
    const addableTypes = listUserAddableNodeTypes().map((nodeDef) => nodeDef.type)

    expect(allTypes).toContain(OUTPUT_PREVIEW_NODE_TYPE)
    expect(addableTypes).not.toContain(OUTPUT_PREVIEW_NODE_TYPE)
  })

  it('registers Param/* nodes with deterministic defaults and stable value outputs', () => {
    const numberNode = getNodeDef('Param/Number')
    const booleanNode = getNodeDef('Param/Boolean')
    const vec2Node = getNodeDef('Param/Vec2')

    expect(numberNode?.defaultParams).toEqual({ value: 0 })
    expect(numberNode?.outputs).toEqual([
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'number', unit: 'mm' },
      },
    ])

    expect(booleanNode?.defaultParams).toEqual({ value: false })
    expect(booleanNode?.outputs).toEqual([
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'boolean' },
      },
    ])

    expect(vec2Node?.defaultParams).toEqual({ value: { x: 0, y: 0 } })
    expect(vec2Node?.outputs).toEqual([
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'vec2', unit: 'mm' },
      },
    ])
  })

  it('exposes Param/* for new authoring while hiding legacy primitive utility nodes', () => {
    const addableTypes = listUserAddableNodeTypes().map((nodeDef) => nodeDef.type)

    expect(addableTypes).toContain('Param/Number')
    expect(addableTypes).toContain('Param/Boolean')
    expect(addableTypes).toContain('Param/Vec2')
    expect(addableTypes).not.toContain('Primitive/Number')
    expect(addableTypes).not.toContain('Primitive/Vec2')
  })
})
