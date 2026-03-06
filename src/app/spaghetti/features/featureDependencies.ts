import type { FeatureStack } from './featureTypes'
import { isFeatureEnabled } from './featureTypes'

export type FeatureDependencyIssueCode =
  | 'CLOSE_PROFILE_SOURCE_MISSING'
  | 'CLOSE_PROFILE_PROFILE_MISSING'
  | 'EXTRUDE_PROFILE_REF_INVALID'

export type FeatureDependencyIssue = {
  featureId: string
  code: FeatureDependencyIssueCode
}

export type FeatureDependencyRow = {
  rowId: string
  featureId: string
  featureType: FeatureStack[number]['type']
  orderIndex: number
  enabled: boolean
  effective: boolean
}

export type DriverFeatureDependencyLink = {
  rowId: string
  targetFeatureId: string
}

export type FeatureDependencyEdge = {
  id: string
  kind: 'driverToFeature' | 'featureToFeature'
  sourceKind: 'driverRow' | 'feature'
  sourceId: string
  targetFeatureId: string
  targetRowId: string
  enabled: boolean
  effective: boolean
}

export type FeatureDependencyGraph = {
  featureRows: FeatureDependencyRow[]
  edges: FeatureDependencyEdge[]
}

const buildFeatureRowId = (featureId: string): string => `feature:${featureId}`

const compareDependencyEdges = (a: FeatureDependencyEdge, b: FeatureDependencyEdge): number =>
  a.id.localeCompare(b.id) ||
  a.kind.localeCompare(b.kind) ||
  a.sourceId.localeCompare(b.sourceId) ||
  a.targetFeatureId.localeCompare(b.targetFeatureId)

export const getEffectiveFeatureStack = (stack: FeatureStack): FeatureStack =>
  stack.filter((feature) => isFeatureEnabled(feature))

export const getFeatureDependencyIssues = (
  stack: FeatureStack,
): FeatureDependencyIssue[] => {
  const issues: FeatureDependencyIssue[] = []
  const effectiveStack = getEffectiveFeatureStack(stack)
  const sketchById = new Map<string, Extract<FeatureStack[number], { type: 'sketch' }>>()
  const closeProfileById = new Map<
    string,
    Extract<FeatureStack[number], { type: 'closeProfile' }>
  >()

  for (const feature of effectiveStack) {
    if (feature.type === 'sketch') {
      sketchById.set(feature.featureId, feature)
      continue
    }
    if (feature.type === 'closeProfile') {
      let valid = true
      const sourceId = feature.inputs.sourceSketchFeatureId
      if (sourceId === null || !sketchById.has(sourceId)) {
        issues.push({
          featureId: feature.featureId,
          code: 'CLOSE_PROFILE_SOURCE_MISSING',
        })
        valid = false
      } else if ((sketchById.get(sourceId)?.outputs.profiles.length ?? 0) === 0) {
        issues.push({
          featureId: feature.featureId,
          code: 'CLOSE_PROFILE_PROFILE_MISSING',
        })
        valid = false
      }
      if (valid) {
        closeProfileById.set(feature.featureId, feature)
      }
      continue
    }

    const profileRef = feature.inputs.profileRef
    if (profileRef === null) {
      continue
    }
    const closeProfile = closeProfileById.get(profileRef.sourceFeatureId)
    if (closeProfile !== undefined) {
      if (
        closeProfile.outputs.profileRef === null ||
        closeProfile.outputs.profileRef.profileId !== profileRef.profileId
      ) {
        issues.push({
          featureId: feature.featureId,
          code: 'EXTRUDE_PROFILE_REF_INVALID',
        })
      }
      continue
    }
    const sketch = sketchById.get(profileRef.sourceFeatureId)
    if (sketch === undefined) {
      issues.push({
        featureId: feature.featureId,
        code: 'EXTRUDE_PROFILE_REF_INVALID',
      })
      continue
    }
    const exists = sketch.outputs.profiles.some((profile) => profile.profileId === profileRef.profileId)
    if (!exists) {
      issues.push({
        featureId: feature.featureId,
        code: 'EXTRUDE_PROFILE_REF_INVALID',
      })
    }
  }

  return issues
}

export const analyzeFeatureDependencyGraph = (
  stack: FeatureStack,
  options?: {
    driverLinks?: readonly DriverFeatureDependencyLink[]
  },
): FeatureDependencyGraph => {
  const issuesByFeatureId = new Map<string, FeatureDependencyIssueCode[]>()
  for (const issue of getFeatureDependencyIssues(stack)) {
    const existing = issuesByFeatureId.get(issue.featureId) ?? []
    existing.push(issue.code)
    issuesByFeatureId.set(issue.featureId, existing)
  }

  const featureRows = stack.map((feature, orderIndex) => {
    const enabled = isFeatureEnabled(feature)
    return {
      rowId: buildFeatureRowId(feature.featureId),
      featureId: feature.featureId,
      featureType: feature.type,
      orderIndex,
      enabled,
      effective: enabled && !issuesByFeatureId.has(feature.featureId),
    }
  })
  const featureRowById = new Map(featureRows.map((row) => [row.featureId, row]))

  const featureEdges: FeatureDependencyEdge[] = stack.flatMap((feature) => {
    if (feature.type === 'closeProfile') {
      const sourceFeatureId = feature.inputs.sourceSketchFeatureId
      if (sourceFeatureId === null) {
        return []
      }
      const sourceRow = featureRowById.get(sourceFeatureId)
      const targetRow = featureRowById.get(feature.featureId)
      if (sourceRow === undefined || targetRow === undefined) {
        return []
      }
      return [
        {
          id: `dep:feature:${sourceFeatureId}->feature:${feature.featureId}`,
          kind: 'featureToFeature' as const,
          sourceKind: 'feature' as const,
          sourceId: sourceFeatureId,
          targetFeatureId: feature.featureId,
          targetRowId: targetRow.rowId,
          enabled: sourceRow.enabled && targetRow.enabled,
          effective: sourceRow.effective && targetRow.effective,
        },
      ]
    }

    if (feature.type !== 'extrude' || feature.inputs.profileRef === null) {
      return []
    }

    const sourceFeatureId = feature.inputs.profileRef.sourceFeatureId
    const sourceRow = featureRowById.get(sourceFeatureId)
    const targetRow = featureRowById.get(feature.featureId)
    if (sourceRow === undefined || targetRow === undefined) {
      return []
    }
    return [
      {
        id: `dep:feature:${sourceFeatureId}->feature:${feature.featureId}`,
        kind: 'featureToFeature' as const,
        sourceKind: 'feature' as const,
        sourceId: sourceFeatureId,
        targetFeatureId: feature.featureId,
        targetRowId: targetRow.rowId,
        enabled: sourceRow.enabled && targetRow.enabled,
        effective: sourceRow.effective && targetRow.effective,
      },
    ]
  })

  const driverEdges: FeatureDependencyEdge[] = (options?.driverLinks ?? []).flatMap((link) => {
    const targetRow = featureRowById.get(link.targetFeatureId)
    if (targetRow === undefined) {
      return []
    }
    return [
      {
        id: `dep:driver:${link.rowId}->feature:${link.targetFeatureId}`,
        kind: 'driverToFeature' as const,
        sourceKind: 'driverRow' as const,
        sourceId: link.rowId,
        targetFeatureId: link.targetFeatureId,
        targetRowId: targetRow.rowId,
        enabled: targetRow.enabled,
        effective: targetRow.effective,
      },
    ]
  })

  return {
    featureRows,
    edges: [...featureEdges, ...driverEdges].sort(compareDependencyEdges),
  }
}

const moveFeatureAtIndex = (
  stack: FeatureStack,
  index: number,
  direction: 'up' | 'down',
): FeatureStack => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (index < 0 || targetIndex < 0 || index >= stack.length || targetIndex >= stack.length) {
    return stack
  }
  const next = stack.slice()
  const current = next[index]
  next[index] = next[targetIndex]
  next[targetIndex] = current
  return next
}

export const moveFeatureInStack = (
  stack: FeatureStack,
  featureId: string,
  direction: 'up' | 'down',
): FeatureStack => {
  const currentIndex = stack.findIndex((feature) => feature.featureId === featureId)
  if (currentIndex === -1) {
    return stack
  }
  const next = moveFeatureAtIndex(stack, currentIndex, direction)
  if (next === stack) {
    return stack
  }
  return getFeatureDependencyIssues(next).length === 0 ? next : stack
}

export const canMoveFeatureInStack = (
  stack: FeatureStack,
  featureId: string,
  direction: 'up' | 'down',
): boolean => moveFeatureInStack(stack, featureId, direction) !== stack
