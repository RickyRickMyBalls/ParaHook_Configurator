// @vitest-environment jsdom

import { BoxGeometry, Mesh, MeshBasicMaterial, OrthographicCamera, Scene } from 'three'
import { describe, expect, it } from 'vitest'
import {
  WORKSPACE_SELECTION_DRAG_THRESHOLD_PX,
  collectWorkspaceSelectionWindowPicks,
  getWorkspaceSelectionWindowMode,
  hasWorkspaceSelectionDragExceededThreshold,
} from './workspaceSelectionWindow'

const createCamera = (): OrthographicCamera => {
  const camera = new OrthographicCamera(-10, 10, 10, -10, 0.1, 100)
  camera.position.set(0, 0, 10)
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()
  camera.updateMatrixWorld(true)
  return camera
}

const createCandidateMesh = (x: number, visible = true): Mesh => {
  const mesh = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial())
  mesh.position.set(x, 0, 0)
  mesh.visible = visible
  return mesh
}

describe('workspaceSelectionWindow', () => {
  it('keeps click-space separate from marquee-space until the 3 px threshold is crossed', () => {
    expect(
      hasWorkspaceSelectionDragExceededThreshold(
        100,
        100,
        100 + WORKSPACE_SELECTION_DRAG_THRESHOLD_PX - 1,
        100,
      ),
    ).toBe(false)
    expect(
      hasWorkspaceSelectionDragExceededThreshold(
        100,
        100,
        100 + WORKSPACE_SELECTION_DRAG_THRESHOLD_PX,
        100,
      ),
    ).toBe(true)
  })

  it('matches the sketch direction rule for window vs crossing mode', () => {
    expect(getWorkspaceSelectionWindowMode({ x: 100, y: 0 }, { x: 120, y: 0 })).toBe('window')
    expect(getWorkspaceSelectionWindowMode({ x: 100, y: 0 }, { x: 80, y: 0 })).toBe('crossing')
  })

  it('treats drag-right windows as fully enclosed only', () => {
    const camera = createCamera()
    const scene = new Scene()
    const leftMesh = createCandidateMesh(-4)
    const centerMesh = createCandidateMesh(0)
    const rightMesh = createCandidateMesh(4)
    scene.add(leftMesh, centerMesh, rightMesh)
    scene.updateMatrixWorld(true)

    const picks = collectWorkspaceSelectionWindowPicks(
      [
        { pick: { kind: 'part', partKey: 'left' }, object: leftMesh },
        { pick: { kind: 'part', partKey: 'center' }, object: centerMesh },
        { pick: { kind: 'part', partKey: 'right' }, object: rightMesh },
      ],
      camera,
      { width: 200, height: 200 },
      { x: 55, y: 120 },
      { x: 145, y: 80 },
    )

    expect(picks).toEqual([{ kind: 'part', partKey: 'center' }])
  })

  it('treats drag-left crossings as overlap selection and ignores invisible candidates', () => {
    const camera = createCamera()
    const scene = new Scene()
    const leftMesh = createCandidateMesh(-4)
    const centerMesh = createCandidateMesh(0, false)
    const rightMesh = createCandidateMesh(4)
    scene.add(leftMesh, centerMesh, rightMesh)
    scene.updateMatrixWorld(true)

    const picks = collectWorkspaceSelectionWindowPicks(
      [
        { pick: { kind: 'part', partKey: 'left' }, object: leftMesh },
        { pick: { kind: 'part', partKey: 'center' }, object: centerMesh },
        { pick: { kind: 'reference-item', referenceId: 'ref-1' }, object: rightMesh },
      ],
      camera,
      { width: 200, height: 200 },
      { x: 145, y: 120 },
      { x: 55, y: 80 },
    )

    expect(picks).toEqual([
      { kind: 'part', partKey: 'left' },
      { kind: 'reference-item', referenceId: 'ref-1' },
    ])
  })
})
