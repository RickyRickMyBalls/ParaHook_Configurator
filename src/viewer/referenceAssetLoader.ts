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

export const loadReferenceAssetObject = async (
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
