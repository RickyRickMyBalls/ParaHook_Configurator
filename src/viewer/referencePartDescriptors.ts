import { Mesh, type Object3D } from 'three'

export type ReferencePartDescriptor = {
  partKey: string
  label: string
  sourceMeshIndex: number
}

const REFERENCE_GENERIC_NAME_PATTERNS = [
  /^scene$/i,
  /^rootnode$/i,
  /^group$/i,
  /^object3d$/i,
  /^node$/i,
  /^step node$/i,
  /^step mesh \d+$/i,
  /^mesh(?:_\d+)?$/i,
] as const

const isMeaningfulPartLabel = (value: string | null | undefined): value is string => {
  if (typeof value !== 'string') {
    return false
  }
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return false
  }
  return !REFERENCE_GENERIC_NAME_PATTERNS.some((pattern) => pattern.test(trimmed))
}

const resolveReferencePartLabel = (mesh: Mesh, fallbackIndex: number): string => {
  if (isMeaningfulPartLabel(mesh.name)) {
    return mesh.name.trim()
  }
  let current: Object3D | null = mesh.parent
  while (current !== null) {
    if (isMeaningfulPartLabel(current.name)) {
      return current.name.trim()
    }
    current = current.parent
  }
  return `Part ${fallbackIndex + 1}`
}

export const extractReferencePartDescriptors = (
  referenceId: string,
  object: Object3D,
): ReferencePartDescriptor[] => {
  const leafMeshes: Mesh[] = []
  object.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return
    }
    leafMeshes.push(child)
  })

  if (leafMeshes.length <= 1) {
    return []
  }

  const labelCounts = new Map<string, number>()
  return leafMeshes.map((mesh, index) => {
    const baseLabel = resolveReferencePartLabel(mesh, index)
    const occurrence = (labelCounts.get(baseLabel) ?? 0) + 1
    labelCounts.set(baseLabel, occurrence)
    const label = occurrence === 1 ? baseLabel : `${baseLabel} ${occurrence}`
    return {
      partKey: `reference-part:${referenceId}:${index}`,
      label,
      sourceMeshIndex: index,
    }
  })
}
