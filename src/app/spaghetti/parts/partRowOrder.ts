import type {
  DriverControlRowVm,
  InputEndpointRowVm,
  OutputPinnedRowVm,
  DriverNumberChange,
} from '../canvas/driverVm'
import type { SpaghettiNode } from '../schema/spaghettiTypes'

export type PartRowOrderSection = 'drivers' | 'inputs' | 'outputs'

export type PartRowOrder = {
  drivers?: string[]
  inputs?: string[]
  outputs?: string[]
}

export type PartRowOrderNormalized = PartRowOrder

export type PartRowOrderNormalizationWarning = {
  code: 'partRowOrder_invalid_shape_repaired'
  message: string
  nodeId: string
}

type NormalizeSectionResult = {
  normalized: string[] | undefined
  invalidShape: boolean
}

const SECTION_KEYS: readonly PartRowOrderSection[] = ['drivers', 'inputs', 'outputs']

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const arrayEquals = (a: readonly string[], b: readonly string[]): boolean => {
  if (a.length !== b.length) {
    return false
  }
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) {
      return false
    }
  }
  return true
}

const normalizeRowOrderAgainstNatural = (
  configuredOrder: readonly string[],
  naturalRowIds: readonly string[],
): string[] => {
  const known = new Set(naturalRowIds)
  const dedupedKnown: string[] = []
  const seen = new Set<string>()
  for (const rowId of configuredOrder) {
    if (!known.has(rowId) || seen.has(rowId)) {
      continue
    }
    seen.add(rowId)
    dedupedKnown.push(rowId)
  }
  for (const rowId of naturalRowIds) {
    if (seen.has(rowId)) {
      continue
    }
    seen.add(rowId)
    dedupedKnown.push(rowId)
  }
  return dedupedKnown
}

const normalizeSection = (
  rawSectionValue: unknown,
  naturalRowIds: readonly string[],
): NormalizeSectionResult => {
  if (rawSectionValue === undefined) {
    return {
      normalized: undefined,
      invalidShape: false,
    }
  }
  if (!isStringArray(rawSectionValue)) {
    return {
      normalized: undefined,
      invalidShape: true,
    }
  }
  const normalized = normalizeRowOrderAgainstNatural(rawSectionValue, naturalRowIds)
  if (normalized.length === 0 || arrayEquals(normalized, naturalRowIds)) {
    return {
      normalized: undefined,
      invalidShape: false,
    }
  }
  return {
    normalized,
    invalidShape: false,
  }
}

const buildCanonicalPartRowOrder = (
  normalized: PartRowOrderNormalized,
): PartRowOrder | undefined => {
  const canonical: PartRowOrder = {
    ...(normalized.drivers === undefined ? {} : { drivers: normalized.drivers }),
    ...(normalized.inputs === undefined ? {} : { inputs: normalized.inputs }),
    ...(normalized.outputs === undefined ? {} : { outputs: normalized.outputs }),
  }
  if (
    canonical.drivers === undefined &&
    canonical.inputs === undefined &&
    canonical.outputs === undefined
  ) {
    return undefined
  }
  return canonical
}

const rawPartRowOrderEqualsCanonical = (
  raw: unknown,
  canonical: PartRowOrder | undefined,
): boolean => {
  if (canonical === undefined) {
    return raw === undefined
  }
  if (!isRecord(raw)) {
    return false
  }

  for (const rawKey of Object.keys(raw)) {
    if (!SECTION_KEYS.includes(rawKey as PartRowOrderSection)) {
      if (raw[rawKey] !== undefined) {
        return false
      }
    }
  }

  for (const section of SECTION_KEYS) {
    const rawValue = raw[section]
    const canonicalValue = canonical[section]
    if (canonicalValue === undefined) {
      if (rawValue !== undefined) {
        return false
      }
      continue
    }
    if (!isStringArray(rawValue)) {
      return false
    }
    if (!arrayEquals(rawValue, canonicalValue)) {
      return false
    }
  }
  return true
}

const buildPartRowOrderWarning = (nodeId: string): PartRowOrderNormalizationWarning => ({
  code: 'partRowOrder_invalid_shape_repaired',
  message: `Part node "${nodeId}" has invalid partRowOrder; repaired to deterministic canonical row order metadata.`,
  nodeId,
})

const encodePath = (path: string[] | undefined): string | undefined => {
  if (path === undefined || path.length === 0) {
    return undefined
  }
  return path.join('.')
}

export const buildDriverNodeParamRowId = (paramId: string): string => `drv:${paramId}`

export const buildDriverFeatureParamRowId = (
  featureParamKind: 'firstExtrudeDepth',
): string => `drv:feature:${featureParamKind}`

export const buildInputRowId = (
  portId: string,
  encodedPath?: string | undefined,
): string => (encodedPath === undefined ? `in:${portId}` : `in:${portId}:${encodedPath}`)

export const buildOutputRowId = (
  portId: string,
  encodedPath?: string | undefined,
): string => (encodedPath === undefined ? `out:${portId}` : `out:${portId}:${encodedPath}`)

const buildDriverRowIdFromChange = (change: DriverNumberChange): string => {
  if (change.kind === 'featureParam') {
    return buildDriverFeatureParamRowId(change.featureParamKind)
  }
  return buildDriverNodeParamRowId(change.paramId)
}

export const buildDriverRowIdFromVm = (row: DriverControlRowVm): string => {
  if (row.kind === 'nodeParamVec2') {
    return buildDriverRowIdFromChange(row.xInput.change)
  }
  return buildDriverRowIdFromChange(row.numberInput.change)
}

export const buildInputRowIdFromVm = (row: InputEndpointRowVm): string =>
  buildInputRowId(row.endpointPortId, encodePath(row.endpointPath))

export const buildOutputRowIdFromVm = (
  row: Extract<OutputPinnedRowVm, { kind: 'endpoint' }>,
): string => buildOutputRowId(row.endpointPortId, encodePath(row.endpointPath))

export const buildVmRowIdsForSection = (
  _nodeId: string,
  sectionVmRows: ReadonlyArray<{ rowId: string }>,
): string[] => {
  const seen = new Set<string>()
  const rowIds: string[] = []
  for (const row of sectionVmRows) {
    if (seen.has(row.rowId)) {
      continue
    }
    seen.add(row.rowId)
    rowIds.push(row.rowId)
  }
  return rowIds
}

export const normalizePartRowOrder = (options: {
  node: SpaghettiNode
  vmDriversRowIds: readonly string[]
  vmInputsRowIds: readonly string[]
  vmOutputsRowIds: readonly string[]
}): {
  repairedNode?: SpaghettiNode
  warnings: PartRowOrderNormalizationWarning[]
  normalized: PartRowOrderNormalized
  repaired: boolean
  invalidShape: boolean
} => {
  const { node, vmDriversRowIds, vmInputsRowIds, vmOutputsRowIds } = options
  const raw = node.params.partRowOrder

  let invalidShape = false
  let normalized: PartRowOrderNormalized = {}

  if (raw !== undefined) {
    if (!isRecord(raw)) {
      invalidShape = true
    } else {
      for (const key of Object.keys(raw)) {
        if (!SECTION_KEYS.includes(key as PartRowOrderSection) && raw[key] !== undefined) {
          invalidShape = true
        }
      }

      const normalizedDrivers = normalizeSection(raw.drivers, vmDriversRowIds)
      const normalizedInputs = normalizeSection(raw.inputs, vmInputsRowIds)
      const normalizedOutputs = normalizeSection(raw.outputs, vmOutputsRowIds)

      invalidShape =
        invalidShape ||
        normalizedDrivers.invalidShape ||
        normalizedInputs.invalidShape ||
        normalizedOutputs.invalidShape

      normalized = {
        ...(normalizedDrivers.normalized === undefined
          ? {}
          : { drivers: normalizedDrivers.normalized }),
        ...(normalizedInputs.normalized === undefined ? {} : { inputs: normalizedInputs.normalized }),
        ...(normalizedOutputs.normalized === undefined
          ? {}
          : { outputs: normalizedOutputs.normalized }),
      }
    }
  }

  const canonical = buildCanonicalPartRowOrder(normalized)
  const repaired = !rawPartRowOrderEqualsCanonical(raw, canonical)
  const warnings = invalidShape ? [buildPartRowOrderWarning(node.nodeId)] : []

  if (!repaired) {
    return {
      normalized,
      warnings,
      repaired: false,
      invalidShape,
    }
  }

  const nextParams: Record<string, unknown> = {
    ...node.params,
  }
  if (canonical === undefined) {
    delete nextParams.partRowOrder
  } else {
    nextParams.partRowOrder = canonical
  }

  return {
    repairedNode: {
      ...node,
      params: nextParams,
    },
    normalized,
    warnings,
    repaired: true,
    invalidShape,
  }
}

const orderRowsByConfiguredIds = <TRow extends { rowId: string }>(
  naturalRows: readonly TRow[],
  configuredOrder: readonly string[] | undefined,
): TRow[] => {
  if (configuredOrder === undefined || configuredOrder.length === 0 || naturalRows.length <= 1) {
    return [...naturalRows]
  }

  const byRowId = new Map<string, TRow>()
  for (const row of naturalRows) {
    if (!byRowId.has(row.rowId)) {
      byRowId.set(row.rowId, row)
    }
  }

  const ordered: TRow[] = []
  const used = new Set<string>()
  for (const rowId of configuredOrder) {
    const row = byRowId.get(rowId)
    if (row === undefined || used.has(rowId)) {
      continue
    }
    used.add(rowId)
    ordered.push(row)
  }
  for (const row of naturalRows) {
    if (used.has(row.rowId)) {
      continue
    }
    used.add(row.rowId)
    ordered.push(row)
  }
  return ordered
}

export const orderDrivers = (
  naturalRows: readonly DriverControlRowVm[],
  normalizedOrder: readonly string[] | undefined,
): DriverControlRowVm[] => orderRowsByConfiguredIds(naturalRows, normalizedOrder)

export const orderInputs = (
  naturalRows: readonly InputEndpointRowVm[],
  normalizedOrder: readonly string[] | undefined,
): InputEndpointRowVm[] => orderRowsByConfiguredIds(naturalRows, normalizedOrder)

export const orderOutputsEndpointRowsKeepingReservedFixed = (
  naturalRows: readonly OutputPinnedRowVm[],
  normalizedOrder: readonly string[] | undefined,
): OutputPinnedRowVm[] => {
  if (naturalRows.length <= 1) {
    return [...naturalRows]
  }
  const naturalEndpoints = naturalRows.filter(
    (row): row is Extract<OutputPinnedRowVm, { kind: 'endpoint' }> => row.kind === 'endpoint',
  )
  const orderedEndpoints = orderRowsByConfiguredIds(naturalEndpoints, normalizedOrder)
  let endpointIndex = 0
  return naturalRows.map((row) => {
    if (row.kind !== 'endpoint') {
      return row
    }
    const nextEndpoint = orderedEndpoints[endpointIndex]
    endpointIndex += 1
    return nextEndpoint ?? row
  })
}

const buildPartRowOrderNormalized = (next: PartRowOrder): PartRowOrderNormalized => ({
  ...(next.drivers === undefined || next.drivers.length === 0 ? {} : { drivers: next.drivers }),
  ...(next.inputs === undefined || next.inputs.length === 0 ? {} : { inputs: next.inputs }),
  ...(next.outputs === undefined || next.outputs.length === 0 ? {} : { outputs: next.outputs }),
})

export const movePartRowOrderSection = (options: {
  normalized: PartRowOrderNormalized
  naturalRowIdsBySection: Record<PartRowOrderSection, readonly string[]>
  section: PartRowOrderSection
  rowId: string
  direction: 'up' | 'down'
}): { next: PartRowOrderNormalized; changed: boolean } => {
  const { normalized, naturalRowIdsBySection, section, rowId, direction } = options
  const natural = [...naturalRowIdsBySection[section]]
  const baseline = [...(normalized[section] ?? natural)]
  if (baseline.length < 2) {
    return {
      next: normalized,
      changed: false,
    }
  }
  const index = baseline.indexOf(rowId)
  if (index < 0) {
    return {
      next: normalized,
      changed: false,
    }
  }
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= baseline.length) {
    return {
      next: normalized,
      changed: false,
    }
  }

  const swapped = [...baseline]
  const temp = swapped[index]
  swapped[index] = swapped[targetIndex]
  swapped[targetIndex] = temp

  const nextSectionOrder = arrayEquals(swapped, natural) ? undefined : swapped
  const next = buildPartRowOrderNormalized({
    ...normalized,
    [section]: nextSectionOrder,
  })
  return {
    next,
    changed: true,
  }
}

export const applyPartRowOrderToNodeParams = (
  params: Record<string, unknown>,
  normalized: PartRowOrderNormalized,
): Record<string, unknown> => {
  const canonical = buildCanonicalPartRowOrder(normalized)
  const next = {
    ...params,
  }
  if (canonical === undefined) {
    delete next.partRowOrder
  } else {
    next.partRowOrder = canonical
  }
  return next
}
