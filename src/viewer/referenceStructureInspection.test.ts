import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Group, Mesh, MeshBasicMaterial, BoxGeometry } from 'three'

const {
  loadReferenceAssetObjectMock,
  disposeReferenceObjectTreeMock,
} = vi.hoisted(() => ({
  loadReferenceAssetObjectMock: vi.fn(),
  disposeReferenceObjectTreeMock: vi.fn(),
}))

vi.mock('./referenceAssetLoader', () => ({
  loadReferenceAssetObject: (...args: unknown[]) => loadReferenceAssetObjectMock(...args),
  disposeReferenceObjectTree: (...args: unknown[]) => disposeReferenceObjectTreeMock(...args),
}))

import { inspectImportedReferenceFileStructure } from './referenceStructureInspection'

describe('inspectImportedReferenceFileStructure', () => {
  beforeEach(() => {
    loadReferenceAssetObjectMock.mockReset()
    disposeReferenceObjectTreeMock.mockReset()
  })

  it('adds meaningful read-only hierarchy rows for structured single-object files without collapsing into part rows', async () => {
    const root = new Group()
    const genericWrapper = new Group()
    genericWrapper.name = 'STEP Node'
    const fusionComponent = new Group()
    fusionComponent.name = 'FusionComponent'
    const hubBody = new Group()
    hubBody.name = 'HubBody'
    hubBody.add(new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial()))
    fusionComponent.add(hubBody)
    genericWrapper.add(fusionComponent)
    root.add(genericWrapper)

    loadReferenceAssetObjectMock.mockResolvedValue(root)

    await expect(
      inspectImportedReferenceFileStructure('ref-structured', {
        fileType: 'step',
        objectUrl: 'blob:structured-step',
      }),
    ).resolves.toMatchObject({
      hasHierarchy: true,
      hasParts: false,
      labels: ['FusionComponent', 'HubBody'],
      partRows: [],
      hierarchyRows: [
        {
          label: 'FusionComponent',
          children: [{ label: 'HubBody', children: [] }],
        },
      ],
    })

    expect(loadReferenceAssetObjectMock).toHaveBeenCalledWith({
      fileType: 'step',
      assetPath: 'blob:structured-step',
    })
    expect(disposeReferenceObjectTreeMock).toHaveBeenCalledWith(root)
  })

  it('keeps hierarchy rows distinct from split-ready part rows when a file truthfully has both', async () => {
    const root = new Group()
    const assembly = new Group()
    assembly.name = 'Assembly'
    const body = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial())
    body.name = 'Body'
    const upper = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial())
    upper.name = 'Upper'
    assembly.add(body, upper)
    root.add(assembly)

    loadReferenceAssetObjectMock.mockResolvedValue(root)

    await expect(
      inspectImportedReferenceFileStructure('ref-split', {
        fileType: 'glb',
        objectUrl: 'blob:split-glb',
      }),
    ).resolves.toMatchObject({
      hasHierarchy: true,
      hasParts: true,
      labels: ['Assembly', 'Body', 'Upper'],
      partRows: [
        { partKey: 'reference-part:ref-split:0', label: 'Body', sourceMeshIndex: 0 },
        { partKey: 'reference-part:ref-split:1', label: 'Upper', sourceMeshIndex: 1 },
      ],
      hierarchyRows: [
        {
          label: 'Assembly',
          children: [
            { label: 'Body', children: [] },
            { label: 'Upper', children: [] },
          ],
        },
      ],
    })

    expect(disposeReferenceObjectTreeMock).toHaveBeenCalledWith(root)
  })
})
