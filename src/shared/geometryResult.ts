const GEOMETRY_RESULT_SCHEMA_VERSION = 1 as const

export type GeometryResultClass = 'draft' | 'authoritative'

export type GeometryResultStatus = 'ok'

export type GeometryResultRequestIdentity = {
  graphDocumentId: string
  buildRequestId: string
  partKeys: string[]
}

export type GeometryMesh = {
  vertices: number[]
  indices: number[]
}

export type GeometryBody = {
  kind: 'extrusion' | 'mesh_pack_merge'
  bodyId: string
  featureId: string
  op: string
  mesh: GeometryMesh
  partKey: string
}

export type GeometryDiagnostic = {
  partKey: string
  featureId: string
  reason: string
  message: string
}

export type GeometryTraceBody = {
  bodyKey: string
  bodyId: string
  partKey: string
  featureId: string
  op: string
  executionIndex: number
}

export type GeometryResultAuthoritativeHandle = {
  resourceType: 'shape_set'
  handleId: string
}

export type GeometryResultBundle = {
  schemaVersion: typeof GEOMETRY_RESULT_SCHEMA_VERSION
  request: GeometryResultRequestIdentity
  resultClass: GeometryResultClass
  status: GeometryResultStatus
  bodies: Record<string, GeometryBody>
  meshPreview: GeometryMesh | null
  diagnostics: GeometryDiagnostic[]
  trace: GeometryTraceBody[]
  authoritativeHandle: GeometryResultAuthoritativeHandle | null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isGeometryMesh = (value: unknown): value is GeometryMesh =>
  isRecord(value) &&
  Array.isArray(value.vertices) &&
  value.vertices.every(isFiniteNumber) &&
  value.vertices.length % 3 === 0 &&
  Array.isArray(value.indices) &&
  value.indices.every(
    (item) =>
      typeof item === 'number' &&
      Number.isInteger(item) &&
      Number.isFinite(item) &&
      item >= 0,
  )

const isGeometryBody = (value: unknown): value is GeometryBody =>
  isRecord(value) &&
  (value.kind === 'extrusion' || value.kind === 'mesh_pack_merge') &&
  typeof value.bodyId === 'string' &&
  typeof value.featureId === 'string' &&
  typeof value.op === 'string' &&
  typeof value.partKey === 'string' &&
  isGeometryMesh(value.mesh)

const isGeometryDiagnostic = (value: unknown): value is GeometryDiagnostic =>
  isRecord(value) &&
  typeof value.partKey === 'string' &&
  typeof value.featureId === 'string' &&
  typeof value.reason === 'string' &&
  typeof value.message === 'string'

const isGeometryTraceBody = (value: unknown): value is GeometryTraceBody =>
  isRecord(value) &&
  typeof value.bodyKey === 'string' &&
  typeof value.bodyId === 'string' &&
  typeof value.partKey === 'string' &&
  typeof value.featureId === 'string' &&
  typeof value.op === 'string' &&
  typeof value.executionIndex === 'number' &&
  Number.isInteger(value.executionIndex)

export const isGeometryResultAuthoritativeHandle = (
  value: unknown,
): value is GeometryResultAuthoritativeHandle =>
  isRecord(value) &&
  value.resourceType === 'shape_set' &&
  typeof value.handleId === 'string' &&
  value.handleId.length > 0

export const isGeometryResultClass = (value: unknown): value is GeometryResultClass =>
  value === 'draft' || value === 'authoritative'

export const isGeometryResultStatus = (value: unknown): value is GeometryResultStatus =>
  value === 'ok'

export const isGeometryResultRequestIdentity = (
  value: unknown,
): value is GeometryResultRequestIdentity =>
  isRecord(value) &&
  typeof value.graphDocumentId === 'string' &&
  value.graphDocumentId.length > 0 &&
  typeof value.buildRequestId === 'string' &&
  value.buildRequestId.length > 0 &&
  isStringArray(value.partKeys) &&
  value.partKeys.every((partKey) => partKey.length > 0)

export const isGeometryResultBundle = (value: unknown): value is GeometryResultBundle =>
  isRecord(value) &&
  value.schemaVersion === GEOMETRY_RESULT_SCHEMA_VERSION &&
  isGeometryResultRequestIdentity(value.request) &&
  isGeometryResultClass(value.resultClass) &&
  isGeometryResultStatus(value.status) &&
  isRecord(value.bodies) &&
  Object.values(value.bodies).every(isGeometryBody) &&
  (value.meshPreview === null || isGeometryMesh(value.meshPreview)) &&
  Array.isArray(value.diagnostics) &&
  value.diagnostics.every(isGeometryDiagnostic) &&
  Array.isArray(value.trace) &&
  value.trace.every(isGeometryTraceBody) &&
  ((value.resultClass === 'draft' && value.authoritativeHandle === null) ||
    (value.resultClass === 'authoritative' &&
      isGeometryResultAuthoritativeHandle(value.authoritativeHandle)))

export const createGeometryResultBundle = (options: {
  request: GeometryResultRequestIdentity
  resultClass: GeometryResultClass
  status: GeometryResultStatus
  bodies: Record<string, GeometryBody>
  meshPreview: GeometryMesh | null
  diagnostics: readonly GeometryDiagnostic[]
  trace: readonly GeometryTraceBody[]
  authoritativeHandle?: GeometryResultAuthoritativeHandle | null
}): GeometryResultBundle => {
  const authoritativeHandle = options.authoritativeHandle ?? null
  if (options.resultClass === 'draft' && authoritativeHandle !== null) {
    throw new Error('Draft geometry results cannot carry an authoritative handle.')
  }
  if (options.resultClass === 'authoritative' && authoritativeHandle === null) {
    throw new Error('Authoritative geometry results require an authoritative handle.')
  }
  return {
    schemaVersion: GEOMETRY_RESULT_SCHEMA_VERSION,
    request: {
      graphDocumentId: options.request.graphDocumentId,
      buildRequestId: options.request.buildRequestId,
      partKeys: [...options.request.partKeys],
    },
    resultClass: options.resultClass,
    status: options.status,
    bodies: Object.fromEntries(
      Object.entries(options.bodies).map(([bodyKey, shape]) => [
        bodyKey,
        {
          ...shape,
          mesh: {
            vertices: [...shape.mesh.vertices],
            indices: [...shape.mesh.indices],
          },
        },
      ]),
    ),
    meshPreview:
      options.meshPreview === null
        ? null
        : {
            vertices: [...options.meshPreview.vertices],
            indices: [...options.meshPreview.indices],
          },
    diagnostics: options.diagnostics.map((diagnostic) => ({ ...diagnostic })),
    trace: options.trace.map((traceItem) => ({ ...traceItem })),
    authoritativeHandle:
      authoritativeHandle === null
        ? null
        : {
            resourceType: authoritativeHandle.resourceType,
            handleId: authoritativeHandle.handleId,
          },
  }
}

export const cloneGeometryResultBundle = (
  bundle: GeometryResultBundle,
): GeometryResultBundle =>
  createGeometryResultBundle({
    request: bundle.request,
    resultClass: bundle.resultClass,
    status: bundle.status,
    bodies: bundle.bodies,
    meshPreview: bundle.meshPreview,
    diagnostics: bundle.diagnostics,
    trace: bundle.trace,
    authoritativeHandle: bundle.authoritativeHandle,
  })

export const getGeometryResultAuthoritativeHandleId = (
  bundle: GeometryResultBundle | null | undefined,
): string | null =>
  bundle?.resultClass === 'authoritative' ? bundle.authoritativeHandle?.handleId ?? null : null

export const createDraftGeometryResultBundle = (options: {
  request: GeometryResultRequestIdentity
  bodies: Record<string, GeometryBody>
  meshPreview: GeometryMesh | null
  diagnostics: readonly GeometryDiagnostic[]
  trace: readonly GeometryTraceBody[]
}): GeometryResultBundle =>
  createGeometryResultBundle({
    request: options.request,
    resultClass: 'draft',
    status: 'ok',
    bodies: options.bodies,
    meshPreview: options.meshPreview,
    diagnostics: options.diagnostics,
    trace: options.trace,
    authoritativeHandle: null,
  })

export const createAuthoritativeGeometryResultBundle = (options: {
  request: GeometryResultRequestIdentity
  bodies: Record<string, GeometryBody>
  meshPreview: GeometryMesh | null
  diagnostics: readonly GeometryDiagnostic[]
  trace: readonly GeometryTraceBody[]
  authoritativeHandle: GeometryResultAuthoritativeHandle
}): GeometryResultBundle =>
  createGeometryResultBundle({
    request: options.request,
    resultClass: 'authoritative',
    status: 'ok',
    bodies: options.bodies,
    meshPreview: options.meshPreview,
    diagnostics: options.diagnostics,
    trace: options.trace,
    authoritativeHandle: options.authoritativeHandle,
  })
