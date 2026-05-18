import type { AuthoritativeShapeSetResource } from '../authoritativeGeometryStore'
import type { OpenCascadeInstance } from '../oc/opencascadeTypes'

type OcConstructor = new (...args: unknown[]) => unknown
type OcCallable = (...args: unknown[]) => unknown
type OcOwnedResource = {
  delete?: () => void
}

type OcFileSystem = {
  readdir: (path: string) => string[]
  readFile: (path: string, options?: { encoding?: 'utf8' | 'binary' }) => string | Uint8Array
  unlink?: (path: string) => void
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isOwnedResource = (value: unknown): value is OcOwnedResource =>
  typeof value === 'object' && value !== null

const getOcCandidateNames = (target: object, baseName: string): string[] => {
  const members = new Set<string>()
  for (let current: object | null = target; current !== null; current = Object.getPrototypeOf(current)) {
    for (const name of Object.getOwnPropertyNames(current)) {
      members.add(name)
    }
  }
  const suffixedNames = [...members]
    .filter((name) => name === baseName || name.startsWith(`${baseName}_`))
    .sort((left, right) => {
      if (left === baseName) {
        return -1
      }
      if (right === baseName) {
        return 1
      }
      const leftIndex = Number(left.slice(baseName.length + 1))
      const rightIndex = Number(right.slice(baseName.length + 1))
      return leftIndex - rightIndex
    })
  return suffixedNames.length > 0 ? suffixedNames : [baseName]
}

const constructOcValue = (
  oc: OpenCascadeInstance,
  constructorName: string,
  args: unknown[] = [],
): unknown => {
  let lastError: unknown = null
  for (const candidateName of getOcCandidateNames(oc, constructorName)) {
    const candidate = oc[candidateName]
    if (typeof candidate !== 'function') {
      continue
    }
    try {
      return Reflect.construct(candidate as OcConstructor, args)
    } catch (error: unknown) {
      lastError = error
    }
  }
  throw lastError ?? new Error(`OpenCascade constructor unavailable: ${constructorName}`)
}

const invokeOcMethod = (
  target: object,
  methodNames: readonly string[],
  args: unknown[],
): unknown => {
  let lastError: unknown = null
  for (const methodName of methodNames) {
    for (const candidateName of getOcCandidateNames(target, methodName)) {
      const candidate = (target as Record<string, unknown>)[candidateName]
      if (typeof candidate !== 'function') {
        continue
      }
      try {
        return (candidate as OcCallable).apply(target, args)
      } catch (error: unknown) {
        lastError = error
      }
    }
  }
  throw lastError ?? new Error(`OpenCascade method unavailable: ${methodNames.join(' | ')}`)
}

const getOcFs = (oc: OpenCascadeInstance): OcFileSystem => {
  const fs = oc.FS
  if (
    !isRecord(fs) ||
    typeof fs.readdir !== 'function' ||
    typeof fs.readFile !== 'function'
  ) {
    throw new Error('OpenCascade filesystem is unavailable for STEP export.')
  }
  return fs as OcFileSystem
}

const isDoneStatus = (oc: OpenCascadeInstance, status: unknown): boolean => {
  const returnStatus = oc.IFSelect_ReturnStatus
  if (isRecord(returnStatus) && status === returnStatus.IFSelect_RetDone) {
    return true
  }
  if (isRecord(status) && status.value === 1) {
    return true
  }
  return false
}

const toRootFilePath = (filename: string): string =>
  filename.startsWith('/') ? filename : `/${filename}`

const listRootFiles = (fs: OcFileSystem): Set<string> =>
  new Set(fs.readdir('/').filter((entry) => !['.', '..', 'tmp', 'home', 'dev', 'proc'].includes(entry)))

const readWrittenStepFile = (
  fs: OcFileSystem,
  requestedFilename: string,
  existingRootFiles: Set<string>,
): string => {
  const requestedPath = toRootFilePath(requestedFilename)
  try {
    const directRead = fs.readFile(requestedPath, { encoding: 'utf8' })
    if (typeof directRead === 'string') {
      return directRead
    }
  } catch {
    // Some opencascade.js builds bind STEPControl_Writer.Write strings poorly and
    // create a mangled MEMFS filename. Fall through and detect the newly added file.
  }

  const newRootFiles = [...listRootFiles(fs)].filter((entry) => !existingRootFiles.has(entry))
  for (const newRootFile of newRootFiles) {
    const readResult = fs.readFile(toRootFilePath(newRootFile), { encoding: 'utf8' })
    if (typeof readResult === 'string') {
      return readResult
    }
  }
  throw new Error('STEP writer completed but no output file was readable.')
}

const cleanupWrittenFiles = (
  fs: OcFileSystem,
  requestedFilename: string,
  existingRootFiles: Set<string>,
): void => {
  if (typeof fs.unlink !== 'function') {
    return
  }
  const candidates = new Set<string>([toRootFilePath(requestedFilename)])
  for (const newRootFile of [...listRootFiles(fs)].filter((entry) => !existingRootFiles.has(entry))) {
    candidates.add(toRootFilePath(newRootFile))
  }
  for (const candidate of candidates) {
    try {
      fs.unlink(candidate)
    } catch {
      // Best-effort cleanup only.
    }
  }
}

const toExportShape = (
  oc: OpenCascadeInstance,
  shapeSet: AuthoritativeShapeSetResource,
): { shape: OcOwnedResource; transientResources: OcOwnedResource[] } => {
  const shapes = shapeSet.ownedResources.filter(isOwnedResource)
  if (shapes.length === 0) {
    throw new Error('Authoritative shape set is empty.')
  }
  if (shapes.length === 1) {
    return {
      shape: shapes[0],
      transientResources: [],
    }
  }

  const builder = constructOcValue(oc, 'BRep_Builder') as OcOwnedResource
  const compound = constructOcValue(oc, 'TopoDS_Compound') as OcOwnedResource
  invokeOcMethod(builder, ['MakeCompound'], [compound])
  for (const shape of shapes) {
    invokeOcMethod(builder, ['Add'], [compound, shape])
  }
  return {
    shape: compound,
    transientResources: [builder, compound],
  }
}

export const writeStepFromAuthoritativeShapeSet = (
  oc: OpenCascadeInstance,
  shapeSet: AuthoritativeShapeSetResource,
  filename: string,
): string => {
  const fs = getOcFs(oc)
  const writer = constructOcValue(oc, 'STEPControl_Writer') as OcOwnedResource
  const existingRootFiles = listRootFiles(fs)
  const exportShape = toExportShape(oc, shapeSet)
  try {
    const transferStatus = invokeOcMethod(writer, ['Transfer'], [exportShape.shape, 0, true])
    if (!isDoneStatus(oc, transferStatus)) {
      throw new Error('STEP writer transfer failed.')
    }
    const writeStatus = invokeOcMethod(writer, ['Write'], [filename])
    if (!isDoneStatus(oc, writeStatus)) {
      throw new Error('STEP writer file write failed.')
    }
    return readWrittenStepFile(fs, filename, existingRootFiles)
  } finally {
    for (const resource of exportShape.transientResources) {
      resource.delete?.()
    }
    writer.delete?.()
    cleanupWrittenFiles(fs, filename, existingRootFiles)
  }
}
