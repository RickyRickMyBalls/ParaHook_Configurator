const formatExtrudeBodyMemberIndex = (memberIndex: number): string =>
  `${memberIndex + 1}`.padStart(3, '0')

export const buildExtrudeBodyId = (
  nodeId: string,
  memberIndex?: number | null,
): string =>
  memberIndex === null || memberIndex === undefined
    ? `${nodeId}:body`
    : `${nodeId}:body:${formatExtrudeBodyMemberIndex(memberIndex)}`
