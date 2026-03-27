import { describe, expect, it } from 'vitest'
import { BoxGeometry, Group, Line, LineSegments, Mesh, MeshBasicMaterial } from 'three'
import type { ReferenceTransformHistoryOverlayVm } from '../app/viewerBridge'
import { ReferenceTransformHistoryHelper } from './ReferenceTransformHistoryHelper'

const makeReferenceObject = (): Group => {
  const object = new Group()
  object.visible = true
  object.userData.referenceTransformBase = {
    position: { x: 10, y: -2, z: 4 },
    rotationDeg: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  }
  object.add(new Mesh(new BoxGeometry(40, 20, 10), new MeshBasicMaterial()))
  return object
}

const makeOverlay = (
  overrides: Partial<ReferenceTransformHistoryOverlayVm> = {},
): ReferenceTransformHistoryOverlayVm => ({
  referenceId: 'shoe:shoe-1',
  movePoints: [
    { x: 0, y: 0, z: 0 },
    { x: 3, y: 0, z: 0 },
    { x: 3, y: 6, z: -5 },
  ],
  rotateEntries: [
    {
      entryId: 'rotate-1',
      position: { x: 3, y: 6, z: -5 },
      beforeRotationDeg: { x: 0, y: 0, z: 0 },
      afterRotationDeg: { x: 0, y: 90, z: 0 },
    },
  ],
  scaleEntries: [
    {
      entryId: 'scale-1',
      position: { x: 3, y: 6, z: -5 },
      rotationDeg: { x: 0, y: 90, z: 0 },
      beforeScale: { x: 1, y: 1, z: 1 },
      afterScale: { x: 2, y: 1.5, z: 1 },
    },
  ],
  ...overrides,
})

describe('ReferenceTransformHistoryHelper', () => {
  it('draws committed move history as world-space point-to-point segments from the reference base', () => {
    const helper = new ReferenceTransformHistoryHelper()
    helper.setOverlay(makeOverlay(), makeReferenceObject())

    const moveGuide = helper.getGroup().children.find(
      (child) => child.name === 'ReferenceTransformMoveHistoryGuide',
    ) as LineSegments | undefined

    expect(moveGuide?.visible).toBe(true)
    const positions = (
      moveGuide?.geometry.getAttribute('position') as { array: ArrayLike<number> } | undefined
    )?.array
    expect(Array.from(positions ?? [])).toEqual([
      10, -2, 4,
      13, -2, 4,
      13, -2, 4,
      13, 4, -1,
    ])

    helper.dispose()
  })

  it('renders rotate and scale history entries at the landed history position', () => {
    const helper = new ReferenceTransformHistoryHelper()
    helper.setOverlay(makeOverlay(), makeReferenceObject())

    const rotateGroup = helper.getGroup().children.find(
      (child) => child.name === 'ReferenceTransformRotateHistoryEntries',
    ) as Group | undefined
    const scaleGroup = helper.getGroup().children.find(
      (child) => child.name === 'ReferenceTransformScaleHistoryEntries',
    ) as Group | undefined
    const rotateEntry = rotateGroup?.children[0] as Group | undefined
    const scaleEntry = scaleGroup?.children[0] as Group | undefined

    expect(rotateEntry?.position).toMatchObject({ x: 13, y: 4, z: -1 })
    expect(scaleEntry?.position).toMatchObject({ x: 13, y: 4, z: -1 })
    expect(rotateEntry?.children.some((child) => child instanceof LineSegments)).toBe(true)
    expect(rotateEntry?.children.some((child) => child instanceof Line)).toBe(true)

    const beforeScaleRings = scaleEntry?.children[0] as Group | undefined
    const afterScaleRings = scaleEntry?.children[1] as Group | undefined
    expect(afterScaleRings?.scale.x ?? 0).toBeGreaterThan(beforeScaleRings?.scale.x ?? 0)
    expect(afterScaleRings?.scale.y ?? 0).toBeGreaterThan(beforeScaleRings?.scale.y ?? 0)

    helper.dispose()
  })

  it('hides the overlay when the active reference object is not available', () => {
    const helper = new ReferenceTransformHistoryHelper()
    helper.setOverlay(makeOverlay(), null)

    expect(helper.getGroup().visible).toBe(false)

    helper.dispose()
  })
})
