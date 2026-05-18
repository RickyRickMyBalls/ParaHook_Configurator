import type { ExportRequest, ExportResult } from '../../shared/exportTypes'
import {
  getAuthoritativeShapeSet,
  type AuthoritativeShapeSetResource,
} from '../authoritativeGeometryStore'
import { getOc } from '../oc/ocInit'
import type { OpenCascadeInstance } from '../oc/opencascadeTypes'
import { writeStepFromAuthoritativeShapeSet } from './stepExportWriter'

export type ExportServiceDependencies = {
  getShapeSet?: (handleId: string) => AuthoritativeShapeSetResource | null
  getOcInstance?: () => Promise<OpenCascadeInstance>
  writeStep?: (
    oc: OpenCascadeInstance,
    shapeSet: AuthoritativeShapeSetResource,
    filename: string,
  ) => string
}

const toBase64 = (value: string): string => btoa(value)

export const exportService = async (
  request: ExportRequest,
  dependencies: ExportServiceDependencies = {},
): Promise<ExportResult> => {
  const buildRequestId = request.input.request.buildRequestId
  if (request.format !== 'step') {
    throw new Error(`Unsupported export format: ${request.format}`)
  }
  const filename = `parahook-${buildRequestId}.${request.format}`
  const getShapeSet = dependencies.getShapeSet ?? getAuthoritativeShapeSet
  const shapeSet = getShapeSet(request.input.authoritativeHandle.handleId)
  if (shapeSet === null) {
    throw new Error('Authoritative geometry is unavailable for export.')
  }
  const oc = await (dependencies.getOcInstance ?? getOc)()
  const stepText = (dependencies.writeStep ?? writeStepFromAuthoritativeShapeSet)(
    oc,
    shapeSet,
    filename,
  )
  return {
    requestId: request.requestId,
    format: request.format,
    filename,
    dataBase64: toBase64(stepText),
  }
}
