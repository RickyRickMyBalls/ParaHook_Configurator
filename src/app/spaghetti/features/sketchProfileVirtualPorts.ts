import { sketchFeatureSchema } from './featureSchema'
import { deriveProfilesWithDiagnostics } from './profileDerivation'
import type { PortSpec, SpaghettiNode } from '../schema/spaghettiTypes'
import type { ProfileOutput, SketchFeature } from './featureTypes'

const SKETCH_PROFILE_MEMBER_PORT_PREFIX = 'SketchProfile:'

export const buildSketchProfileMemberPortId = (profileId: string): string =>
  `${SKETCH_PROFILE_MEMBER_PORT_PREFIX}${profileId}`

export const parseSketchProfileMemberPortId = (
  portId: string,
): { profileId: string } | null => {
  if (!portId.startsWith(SKETCH_PROFILE_MEMBER_PORT_PREFIX)) {
    return null
  }
  const profileId = portId.slice(SKETCH_PROFILE_MEMBER_PORT_PREFIX.length)
  return profileId.length > 0 ? { profileId } : null
}

const readManagedSketchFeatureFromNode = (node: SpaghettiNode): SketchFeature | null => {
  if (node.type !== 'Geometry/Sketch') {
    return null
  }
  const rawSketch =
    typeof node.params === 'object' && node.params !== null
      ? (node.params as { sketch?: unknown }).sketch
      : undefined
  const parsed = sketchFeatureSchema.safeParse(rawSketch)
  return parsed.success ? parsed.data : null
}

const deriveResolvedProfiles = (node: SpaghettiNode): ProfileOutput[] => {
  const sketch = readManagedSketchFeatureFromNode(node)
  if (sketch === null) {
    return []
  }
  return deriveProfilesWithDiagnostics(sketch.components).profiles
}

export const listSketchProfileMemberOutputPorts = (node: SpaghettiNode): PortSpec[] =>
  deriveResolvedProfiles(node).map((profile) => ({
    portId: buildSketchProfileMemberPortId(profile.profileId),
    label: 'SketchProfile',
    type: { kind: 'sketchProfile' },
  }))

export const getSketchProfileMemberOutputValue = (
  node: SpaghettiNode,
  portId: string,
): ProfileOutput | undefined => {
  const parsed = parseSketchProfileMemberPortId(portId)
  if (parsed === null) {
    return undefined
  }
  return deriveResolvedProfiles(node).find((profile) => profile.profileId === parsed.profileId)
}
