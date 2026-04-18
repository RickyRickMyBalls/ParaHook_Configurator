import { Mesh, MeshStandardMaterial, type Object3D } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import type { ReferenceFileType } from '../app/references/referenceManifest'
import { loadStepReferenceObject } from './stepReferenceLoader'

export type ReferenceAssetLoadSource = {
  fileType: ReferenceFileType
  assetPath: string
}

const referenceAssetObjectCache = new Map<string, Object3D>()
const referenceAssetLoadPromises = new Map<string, Promise<Object3D>>()

const resolveReferenceAssetCacheKey = (reference: ReferenceAssetLoadSource) =>
  `${reference.fileType}:${reference.assetPath}`

const cloneReferenceObjectTree = (object: Object3D): Object3D => {
  const clonedObject = object.clone(true)
  clonedObject.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return
    }
    child.geometry = child.geometry.clone()
    if (Array.isArray(child.material)) {
      child.material = child.material.map((material) => material.clone())
      return
    }
    child.material = child.material.clone()
  })
  return clonedObject
}

const loadReferenceAssetObjectUncached = async (
  reference: ReferenceAssetLoadSource,
): Promise<Object3D> => {
  if (reference.fileType === 'glb') {
    const loader = new GLTFLoader()
    return new Promise<Object3D>((resolve, reject) => {
      loader.load(
        reference.assetPath,
        (result) => resolve(result.scene),
        undefined,
        reject,
      )
    })
  }

  if (reference.fileType === 'obj') {
    const loader = new OBJLoader()
    return new Promise<Object3D>((resolve, reject) => {
      loader.load(
        reference.assetPath,
        (object) => resolve(object),
        undefined,
        reject,
      )
    })
  }

  if (reference.fileType === 'stl') {
    const loader = new STLLoader()
    return new Promise<Object3D>((resolve, reject) => {
      loader.load(
        reference.assetPath,
        (geometry) => {
          const mesh = new Mesh(
            geometry,
            new MeshStandardMaterial({
              color: '#7f8fae',
              metalness: 0.08,
              roughness: 0.86,
            }),
          )
          resolve(mesh)
        },
        undefined,
        reject,
      )
    })
  }

  return loadStepReferenceObject(reference)
}

export const hasWarmReferenceAssetObject = (reference: ReferenceAssetLoadSource): boolean =>
  referenceAssetObjectCache.has(resolveReferenceAssetCacheKey(reference))

export const readWarmReferenceAssetObjectClone = (
  reference: ReferenceAssetLoadSource,
): Object3D | null => {
  const cachedObject = referenceAssetObjectCache.get(resolveReferenceAssetCacheKey(reference))
  return cachedObject === undefined ? null : cloneReferenceObjectTree(cachedObject)
}

export const loadReferenceAssetObject = async (
  reference: ReferenceAssetLoadSource,
): Promise<Object3D> => {
  const warmObject = readWarmReferenceAssetObjectClone(reference)
  if (warmObject !== null) {
    return warmObject
  }

  const cacheKey = resolveReferenceAssetCacheKey(reference)
  let loadPromise = referenceAssetLoadPromises.get(cacheKey)
  if (loadPromise === undefined) {
    loadPromise = loadReferenceAssetObjectUncached(reference).then(
      (loadedObject) => {
        referenceAssetObjectCache.set(cacheKey, loadedObject)
        referenceAssetLoadPromises.delete(cacheKey)
        return loadedObject
      },
      (error) => {
        referenceAssetLoadPromises.delete(cacheKey)
        throw error
      },
    )
    referenceAssetLoadPromises.set(cacheKey, loadPromise)
  }

  const loadedObject = await loadPromise
  return cloneReferenceObjectTree(loadedObject)
}

export const disposeReferenceObjectTree = (object: Object3D): void => {
  object.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return
    }
    child.geometry.dispose()
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose())
      return
    }
    child.material.dispose()
  })
}

export const resetReferenceAssetObjectCacheForTests = (): void => {
  for (const cachedObject of referenceAssetObjectCache.values()) {
    disposeReferenceObjectTree(cachedObject)
  }
  referenceAssetObjectCache.clear()
  referenceAssetLoadPromises.clear()
}
