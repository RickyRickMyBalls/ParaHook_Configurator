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
})
