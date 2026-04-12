import { describe, expect, it } from 'vitest'
import {
  getNodeDef,
  listNodeTypes,
  listUserAddableNodeTypes,
} from './nodeRegistry'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'

describe('OutputPreview node registry contract', () => {
  it('registers Geometry/Extrude as a user-addable extrude template node', () => {
    const nodeDef = getNodeDef('Geometry/Extrude')
    const addableTypes = listUserAddableNodeTypes().map((entry) => entry.type)

    expect(nodeDef).toBeDefined()
    expect(nodeDef?.label).toBe('Extrude')
    expect(nodeDef?.template).toBe('extrude')
    expect(nodeDef?.inputs).toEqual([
      {
        portId: 'ExtrusionProfile',
        label: 'SketchProfiles',
        type: { kind: 'sketchProfiles' },
        optional: true,
        maxConnectionsIn: Number.MAX_SAFE_INTEGER,
      },
      {
        portId: 'Type',
        label: 'Type',
        type: { kind: 'number', unit: 'unitless' },
        optional: true,
        maxConnectionsIn: 1,
      },
      {
        portId: 'Direction',
        label: 'Direction',
        type: { kind: 'number', unit: 'unitless' },
        optional: true,
        maxConnectionsIn: 1,
      },
      {
        portId: 'Depth',
        label: 'Depth',
        type: { kind: 'number', unit: 'mm' },
        optional: true,
      },
      {
        portId: 'StartDepth',
        label: 'Start Depth',
        type: { kind: 'number', unit: 'mm' },
        optional: true,
      },
      {
        portId: 'EndDepth',
        label: 'End Depth',
        type: { kind: 'number', unit: 'mm' },
        optional: true,
      },
      {
        portId: 'TaperAngle',
        label: 'Taper Angle',
        type: { kind: 'number', unit: 'deg' },
        optional: true,
        maxConnectionsIn: 1,
      },
    ])
    expect(nodeDef?.outputs).toEqual([
      {
        portId: 'SolidBody',
        label: 'SolidBodies',
        type: { kind: 'solidBodies' },
      },
    ])
    expect(addableTypes).toContain('Geometry/Extrude')
  })

  it('registers Geometry/Sketch as a user-addable sketch template node', () => {
    const nodeDef = getNodeDef('Geometry/Sketch')
    const addableTypes = listUserAddableNodeTypes().map((entry) => entry.type)

    expect(nodeDef).toBeDefined()
    expect(nodeDef?.label).toBe('Sketch')
    expect(nodeDef?.template).toBe('sketch')
    expect(nodeDef?.inputs).toEqual([
      {
        portId: 'SketchPlane',
        label: 'SketchPlane',
        type: { kind: 'plane' },
        optional: true,
      },
      {
        portId: 'SketchEntities',
        label: 'SketchDraw',
        type: { kind: 'sketchEntities' },
        optional: true,
      },
    ])
    expect(nodeDef?.outputs).toEqual([
      {
        portId: 'SketchProfiles',
        label: 'SketchProfiles',
        type: { kind: 'sketchProfiles' },
      },
      {
        portId: 'SketchProfile',
        label: 'SketchProfile',
        type: { kind: 'sketchProfile' },
      },
    ])
    expect(addableTypes).toContain('Geometry/Sketch')
  })

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
