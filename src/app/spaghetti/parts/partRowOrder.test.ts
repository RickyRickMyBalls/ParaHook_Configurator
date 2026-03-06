import { describe, expect, it } from 'vitest'
import type {
  DriverControlRowVm,
  InputEndpointRowVm,
  OutputPinnedRowVm,
} from '../canvas/driverVm'
import type { SpaghettiNode } from '../schema/spaghettiTypes'
import {
  applyPartRowOrderToNodeParams,
  buildDriverFeatureParamRowId,
  buildDriverNodeParamRowId,
  buildDriverRowIdFromVm,
  buildInputRowId,
  buildInputRowIdFromVm,
  buildOutputRowId,
  buildOutputRowIdFromVm,
  buildVmRowIdsForSection,
  movePartRowOrderSection,
  normalizePartRowOrder,
  orderDrivers,
  orderInputs,
  orderOutputsEndpointRowsKeepingReservedFixed,
} from './partRowOrder'

describe('partRowOrder row ids', () => {
  it('builds stable driver/input/output row ids from VM rows', () => {
    const driverNodeParam = {
      kind: 'nodeParamNumber',
      rowId: 'unused',
      label: 'Width',
      numberInput: {
        value: 30,
        change: {
          kind: 'nodeParam',
          paramId: 'widthMm',
        },
      },
    } as DriverControlRowVm
    const driverFeatureParam = {
      kind: 'featureParam',
      rowId: 'unused',
      label: 'Thickness',
      numberInput: {
        value: 6,
        change: {
          kind: 'featureParam',
          featureParamKind: 'firstExtrudeDepth',
        },
      },
    } as DriverControlRowVm
    const inputRow = {
      kind: 'endpoint',
      rowId: 'unused',
      direction: 'in',
      port: {
        portId: 'width',
        label: 'Width',
        type: { kind: 'number', unit: 'mm' },
      },
      endpointPortId: 'width',
      endpointPath: ['x'],
    } as InputEndpointRowVm
    const outputRow = {
      kind: 'endpoint',
      rowId: 'unused',
      direction: 'out',
      port: {
        portId: 'anchorSpline2',
        label: 'Anchor',
        type: { kind: 'spline2' },
      },
      endpointPortId: 'anchorSpline2',
    } as Extract<OutputPinnedRowVm, { kind: 'endpoint' }>

    expect(buildDriverNodeParamRowId('widthMm')).toBe('drv:widthMm')
    expect(buildDriverFeatureParamRowId('firstExtrudeDepth')).toBe(
      'drv:feature:firstExtrudeDepth',
    )
    expect(buildInputRowId('width', 'x')).toBe('in:width:x')
    expect(buildOutputRowId('anchorSpline2')).toBe('out:anchorSpline2')

    expect(buildDriverRowIdFromVm(driverNodeParam)).toBe('drv:widthMm')
    expect(buildDriverRowIdFromVm(driverFeatureParam)).toBe(
      'drv:feature:firstExtrudeDepth',
    )
    expect(buildInputRowIdFromVm(inputRow)).toBe('in:width:x')
    expect(buildOutputRowIdFromVm(outputRow)).toBe('out:anchorSpline2')
  })

  it('buildVmRowIdsForSection is deterministic and first-wins deduped', () => {
    const first = buildVmRowIdsForSection('node-1', [
      { rowId: 'drv:a' },
      { rowId: 'drv:b' },
      { rowId: 'drv:a' },
      { rowId: 'drv:c' },
    ])
    const second = buildVmRowIdsForSection('node-1', [
      { rowId: 'drv:a' },
      { rowId: 'drv:b' },
      { rowId: 'drv:a' },
      { rowId: 'drv:c' },
    ])
    expect(first).toEqual(['drv:a', 'drv:b', 'drv:c'])
    expect(second).toEqual(first)
  })
})

describe('partRowOrder normalization', () => {
  it('drops unknown ids, dedupes first-wins, and appends missing ids in natural VM order', () => {
    const node: SpaghettiNode = {
      nodeId: 'n-part',
      type: 'Part/Baseplate',
      params: {
        partRowOrder: {
          drivers: ['drv:b', 'drv:b', 'drv:unknown', 'drv:a'],
        },
      },
    }

    const result = normalizePartRowOrder({
      node,
      vmDriversRowIds: ['drv:a', 'drv:b', 'drv:c'],
      vmInputsRowIds: ['in:width'],
      vmOutputsRowIds: ['out:anchorSpline2'],
    })

    expect(result.warnings).toEqual([])
    expect(result.normalized.drivers).toEqual(['drv:b', 'drv:a', 'drv:c'])
    expect(result.repaired).toBe(true)
  })

  it('repairs invalid shape deterministically and emits only invalid-shape warning', () => {
    const node: SpaghettiNode = {
      nodeId: 'n-part',
      type: 'Part/Baseplate',
      params: {
        partRowOrder: {
          drivers: [1, 2, 3],
          extra: true,
        },
      } as unknown as Record<string, unknown>,
    }

    const result = normalizePartRowOrder({
      node,
      vmDriversRowIds: ['drv:a'],
      vmInputsRowIds: ['in:a'],
      vmOutputsRowIds: ['out:a'],
    })

    expect(result.invalidShape).toBe(true)
    expect(result.warnings.map((warning) => warning.code)).toEqual([
      'partRowOrder_invalid_shape_repaired',
    ])
    expect(result.normalized).toEqual({})
    expect(result.repairedNode?.params.partRowOrder).toBeUndefined()
  })
})

describe('partRowOrder ordering and movement', () => {
  it('orders drivers/inputs from metadata and falls back to natural order when absent', () => {
    const drivers = [
      { kind: 'nodeParamNumber', rowId: 'drv:a' },
      { kind: 'nodeParamNumber', rowId: 'drv:b' },
      { kind: 'nodeParamNumber', rowId: 'drv:c' },
    ] as unknown as DriverControlRowVm[]
    const inputs = [
      { kind: 'endpoint', rowId: 'in:a' },
      { kind: 'endpoint', rowId: 'in:b' },
    ] as unknown as InputEndpointRowVm[]

    const orderedDrivers = orderDrivers(drivers, ['drv:c', 'drv:a', 'drv:b'])
    const orderedInputs = orderInputs(inputs, ['in:b', 'in:a'])
    const fallbackDrivers = orderDrivers(drivers, undefined)

    expect(orderedDrivers.map((row) => row.rowId)).toEqual(['drv:c', 'drv:a', 'drv:b'])
    expect(orderedInputs.map((row) => row.rowId)).toEqual(['in:b', 'in:a'])
    expect(fallbackDrivers.map((row) => row.rowId)).toEqual(['drv:a', 'drv:b', 'drv:c'])
  })

  it('keeps reserved outputs fixed while reordering endpoint rows', () => {
    const outputs: OutputPinnedRowVm[] = [
      {
        kind: 'endpoint',
        rowId: 'out:a',
        direction: 'out',
        port: { portId: 'a', label: 'A', type: { kind: 'number', unit: 'mm' } },
        endpointPortId: 'a',
      },
      {
        kind: 'reserved',
        rowId: 'out-reserved-0-mesh',
        label: 'Mesh Output',
        reservedKind: 'mesh',
        state: 'pending',
      },
      {
        kind: 'endpoint',
        rowId: 'out:b',
        direction: 'out',
        port: { portId: 'b', label: 'B', type: { kind: 'number', unit: 'mm' } },
        endpointPortId: 'b',
      },
    ]

    const ordered = orderOutputsEndpointRowsKeepingReservedFixed(outputs, ['out:b', 'out:a'])
    expect(ordered.map((row) => row.rowId)).toEqual([
      'out:b',
      'out-reserved-0-mesh',
      'out:a',
    ])
  })

  it('moves row order deterministically and clears metadata at natural order', () => {
    const natural = {
      drivers: ['drv:a', 'drv:b', 'drv:c'],
      inputs: ['in:a'],
      outputs: ['out:a'],
    } as const

    const movedUp = movePartRowOrderSection({
      normalized: {},
      naturalRowIdsBySection: natural,
      section: 'drivers',
      rowId: 'drv:b',
      direction: 'up',
    })
    expect(movedUp.changed).toBe(true)
    expect(movedUp.next.drivers).toEqual(['drv:b', 'drv:a', 'drv:c'])

    const movedBack = movePartRowOrderSection({
      normalized: movedUp.next,
      naturalRowIdsBySection: natural,
      section: 'drivers',
      rowId: 'drv:b',
      direction: 'down',
    })
    expect(movedBack.changed).toBe(true)
    expect(movedBack.next.drivers).toBeUndefined()

    const paramsWithOrder = applyPartRowOrderToNodeParams(
      {
        presetId: 'default',
      },
      movedUp.next,
    )
    const paramsWithoutOrder = applyPartRowOrderToNodeParams(
      paramsWithOrder,
      movedBack.next,
    )
    expect(paramsWithOrder.partRowOrder).toEqual({
      drivers: ['drv:b', 'drv:a', 'drv:c'],
    })
    expect(paramsWithoutOrder.partRowOrder).toBeUndefined()
  })
})
