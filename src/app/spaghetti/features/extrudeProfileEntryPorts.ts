const EXTRUDE_PROFILE_ENTRY_PORT_PREFIX = 'ExtrusionProfile::entry::'

export const buildExtrudeProfileEntryPortId = (edgeId: string): string =>
  `${EXTRUDE_PROFILE_ENTRY_PORT_PREFIX}${edgeId}`

export const parseExtrudeProfileEntryPortId = (
  portId: string,
): { edgeId: string } | null => {
  if (!portId.startsWith(EXTRUDE_PROFILE_ENTRY_PORT_PREFIX)) {
    return null
  }
  const edgeId = portId.slice(EXTRUDE_PROFILE_ENTRY_PORT_PREFIX.length)
  if (edgeId.length === 0) {
    return null
  }
  return { edgeId }
}
