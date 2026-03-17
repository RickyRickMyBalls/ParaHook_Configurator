import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshStandardMaterial,
  type Object3D,
} from 'three'
import occtimportjs, {
  type OcctImportJsModule,
  type OcctImportMesh,
  type OcctImportNode,
  type OcctImportResult,
} from 'occt-import-js/dist/occt-import-js.js'
import occtImportJsWasmUrl from 'occt-import-js/dist/occt-import-js.wasm?url'
let occtImportModulePromise: Promise<OcctImportJsModule> | null = null

const getOcctImportModule = (): Promise<OcctImportJsModule> => {
  if (occtImportModulePromise === null) {
    occtImportModulePromise = occtimportjs({
      locateFile: (path) => (path.endsWith('.wasm') ? occtImportJsWasmUrl : path),
    })
  }
  return occtImportModulePromise
}

const buildStepMeshObject = (mesh: OcctImportMesh, index: number): Mesh => {
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new Float32BufferAttribute(mesh.attributes.position.array, 3),
  )
  geometry.setIndex(mesh.index.array)
  if (mesh.attributes.normal !== undefined) {
    geometry.setAttribute('normal', new Float32BufferAttribute(mesh.attributes.normal.array, 3))
  } else {
    geometry.computeVertexNormals()
  }

  const material = new MeshStandardMaterial({
    color:
      mesh.color === undefined
        ? '#7f8fae'
        : new Color(mesh.color[0], mesh.color[1], mesh.color[2]),
    metalness: 0.08,
    roughness: 0.86,
  })

  const object = new Mesh(geometry, material)
  object.name = mesh.name?.trim().length ? mesh.name : `STEP Mesh ${index + 1}`
  return object
}

const buildStepNodeObject = (
  node: OcctImportNode,
  meshObjects: Mesh[],
  seenMeshIndexes: Set<number>,
): Object3D => {
  const group = new Group()
  group.name = node.name.trim().length > 0 ? node.name : 'STEP Node'

  for (const meshIndex of node.meshes) {
    const meshObject = meshObjects[meshIndex]
    if (meshObject === undefined || seenMeshIndexes.has(meshIndex)) {
      continue
    }
    group.add(meshObject)
    seenMeshIndexes.add(meshIndex)
  }

  for (const child of node.children) {
    group.add(buildStepNodeObject(child, meshObjects, seenMeshIndexes))
  }

  return group
}

export const buildObjectFromStepImportResult = (result: OcctImportResult): Object3D => {
  const meshObjects = result.meshes.map((mesh, index) => buildStepMeshObject(mesh, index))
  const seenMeshIndexes = new Set<number>()
  const rootObject = buildStepNodeObject(result.root, meshObjects, seenMeshIndexes)

  for (let meshIndex = 0; meshIndex < meshObjects.length; meshIndex += 1) {
    if (seenMeshIndexes.has(meshIndex)) {
      continue
    }
    const meshObject = meshObjects[meshIndex]
    if (meshObject !== undefined) {
      rootObject.add(meshObject)
    }
  }

  return rootObject
}

export const loadStepReferenceObject = async (
  reference: { assetPath: string },
): Promise<Object3D> => {
  const response = await fetch(reference.assetPath)
  if (!response.ok) {
    throw new Error(`Failed to fetch STEP reference asset (${response.status}).`)
  }

  const occtImportModule = await getOcctImportModule()
  const fileBuffer = new Uint8Array(await response.arrayBuffer())
  const result = occtImportModule.ReadStepFile(fileBuffer, null)
  if (!result.success) {
    throw new Error('Failed to import STEP reference asset.')
  }

  return buildObjectFromStepImportResult(result)
}
