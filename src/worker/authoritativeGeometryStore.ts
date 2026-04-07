type AuthoritativeOwnedResource = {
  delete?: () => void
}

export type AuthoritativeShapeSetResource = {
  ownedResources: readonly AuthoritativeOwnedResource[]
}

const authoritativeShapeSets = new Map<string, AuthoritativeShapeSetResource>()
let nextAuthoritativeHandleId = 1

export const registerAuthoritativeShapeSet = (
  resource: AuthoritativeShapeSetResource,
): { resourceType: 'shape_set'; handleId: string } => {
  const handleId = `shape-set-${nextAuthoritativeHandleId++}`
  authoritativeShapeSets.set(handleId, {
    ownedResources: [...resource.ownedResources],
  })
  return {
    resourceType: 'shape_set',
    handleId,
  }
}

const disposeAuthoritativeShapeSetResource = (resource: AuthoritativeShapeSetResource): void => {
  for (const ownedResource of resource.ownedResources) {
    if (typeof ownedResource.delete === 'function') {
      ownedResource.delete()
    }
  }
}

export const releaseAuthoritativeShapeSet = (handleId: string): boolean => {
  const resource = authoritativeShapeSets.get(handleId)
  if (resource === undefined) {
    return false
  }
  authoritativeShapeSets.delete(handleId)
  disposeAuthoritativeShapeSetResource(resource)
  return true
}

export const releaseAuthoritativeShapeSets = (handleIds: readonly string[]): number => {
  let releasedCount = 0
  for (const handleId of handleIds) {
    if (releaseAuthoritativeShapeSet(handleId)) {
      releasedCount += 1
    }
  }
  return releasedCount
}

export const resetAuthoritativeShapeSetsForTests = (): void => {
  for (const handleId of [...authoritativeShapeSets.keys()]) {
    releaseAuthoritativeShapeSet(handleId)
  }
  nextAuthoritativeHandleId = 1
}
