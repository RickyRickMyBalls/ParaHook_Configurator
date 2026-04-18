import { BoxGeometry, Mesh, MeshStandardMaterial, Object3D } from 'three'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { gltfLoaderLoadMock } = vi.hoisted(() => ({
  gltfLoaderLoadMock: vi.fn(),
}))

vi.mock('three/examples/jsm/loaders/GLTFLoader.js', () => ({
  GLTFLoader: class {
    public load = gltfLoaderLoadMock
  },
}))

vi.mock('three/examples/jsm/loaders/OBJLoader.js', () => ({
  OBJLoader: class {},
}))

vi.mock('three/examples/jsm/loaders/STLLoader.js', () => ({
  STLLoader: class {},
}))

vi.mock('./stepReferenceLoader', () => ({
  loadStepReferenceObject: vi.fn(),
}))

import {
  hasWarmReferenceAssetObject,
  loadReferenceAssetObject,
  readWarmReferenceAssetObjectClone,
  resetReferenceAssetObjectCacheForTests,
} from './referenceAssetLoader'

const collectMeshes = (object: Object3D) => {
  const meshes: Mesh[] = []
  object.traverse((child) => {
    if (child instanceof Mesh) {
      meshes.push(child)
    }
  })
  return meshes
}

describe('referenceAssetLoader', () => {
  beforeEach(() => {
    gltfLoaderLoadMock.mockReset()
    resetReferenceAssetObjectCacheForTests()
  })

  afterEach(() => {
    resetReferenceAssetObjectCacheForTests()
  })

  it('keeps one warm parsed asset per source and returns deep clones for repeated loads', async () => {
    const cachedScene = new Object3D()
    cachedScene.add(
      new Mesh(
        new BoxGeometry(1, 2, 3),
        new MeshStandardMaterial({ color: '#7f8fae' }),
      ),
    )
    gltfLoaderLoadMock.mockImplementation((assetPath: string, onLoad: (result: { scene: Object3D }) => void) => {
      expect(assetPath).toBe('/Catalog/shoes/Shoe_1.glb')
      onLoad({ scene: cachedScene })
    })

    const reference = {
      fileType: 'glb' as const,
      assetPath: '/Catalog/shoes/Shoe_1.glb',
    }

    const firstObject = await loadReferenceAssetObject(reference)
    const secondObject = await loadReferenceAssetObject(reference)
    const warmClone = readWarmReferenceAssetObjectClone(reference)

    expect(gltfLoaderLoadMock).toHaveBeenCalledTimes(1)
    expect(hasWarmReferenceAssetObject(reference)).toBe(true)
    expect(warmClone).not.toBeNull()
    expect(firstObject).not.toBe(secondObject)

    const [firstMesh] = collectMeshes(firstObject)
    const [secondMesh] = collectMeshes(secondObject)
    const [warmMesh] = collectMeshes(warmClone!)

    expect(firstMesh).toBeInstanceOf(Mesh)
    expect(secondMesh).toBeInstanceOf(Mesh)
    expect(warmMesh).toBeInstanceOf(Mesh)
    expect(firstMesh.geometry).not.toBe(secondMesh.geometry)
    expect(firstMesh.geometry).not.toBe(warmMesh.geometry)
    expect(firstMesh.material).not.toBe(secondMesh.material)
    expect(firstMesh.material).not.toBe(warmMesh.material)
  })

  it('reuses one in-flight load when the same asset is requested concurrently', async () => {
    const cachedScene = new Object3D()
    cachedScene.add(
      new Mesh(
        new BoxGeometry(2, 2, 2),
        new MeshStandardMaterial({ color: '#7f8fae' }),
      ),
    )

    let resolveLoad: ((value: { scene: Object3D }) => void) | null = null
    gltfLoaderLoadMock.mockImplementation((_assetPath: string, onLoad: (result: { scene: Object3D }) => void) => {
      resolveLoad = onLoad
    })

    const reference = {
      fileType: 'glb' as const,
      assetPath: '/Catalog/shoes/Shoe_1.glb',
    }

    const firstPromise = loadReferenceAssetObject(reference)
    const secondPromise = loadReferenceAssetObject(reference)

    expect(gltfLoaderLoadMock).toHaveBeenCalledTimes(1)

    expect(resolveLoad).toBeTypeOf('function')
    if (resolveLoad === null) {
      throw new Error('Expected one in-flight GLTF load callback.')
    }
    const resolveCurrentLoad = resolveLoad as (value: { scene: Object3D }) => void
    resolveCurrentLoad({ scene: cachedScene })

    const [firstObject, secondObject] = await Promise.all([firstPromise, secondPromise])

    expect(firstObject).not.toBe(secondObject)
    expect(hasWarmReferenceAssetObject(reference)).toBe(true)
  })
})
