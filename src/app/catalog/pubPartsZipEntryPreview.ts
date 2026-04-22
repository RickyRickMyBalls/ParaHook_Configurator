import type { PubPartsSharedLinkCandidate } from './pubPartsSharedLinkResolver'

export const PUBPARTS_ZIP_ENTRY_PREVIEW_FILE_TYPES = ['step', 'stl', 'obj', 'glb'] as const

export type PubPartsZipEntryPreviewFileType =
  (typeof PUBPARTS_ZIP_ENTRY_PREVIEW_FILE_TYPES)[number]

export type PubPartsZipEntryPreviewArchiveByteAvailability =
  | {
      state: 'available'
      source: 'source-options-archive' | 'internal-library-archive'
    }
  | {
      state: 'metadata-only'
      source: 'local-storage-manifest' | 'internal-library-manifest'
    }
  | {
      state: 'missing'
      reason: 'no-archive-bytes' | 'stale-archive-bytes'
    }

export type PubPartsZipEntryPreviewUnavailableReason =
  | 'direct-file-candidate'
  | 'non-archive-entry-candidate'
  | 'missing-archive-path'
  | 'metadata-only'
  | 'no-archive-bytes'
  | 'stale-archive-bytes'
  | 'unsupported-file-type'
  | 'unsafe-archive-entry'
  | 'directory-archive-entry'
  | 'blocked-archive-entry'
  | 'unselectable-archive-entry'

export type PubPartsZipEntryPreviewAvailableState = {
  canPreview: true
  actionLabel: 'Preview 3D'
  candidateId: string
  archivePath: string
  normalizedArchivePath: string
  fileName: string
  fileType: PubPartsZipEntryPreviewFileType
  archiveBytesSource: Extract<
    PubPartsZipEntryPreviewArchiveByteAvailability,
    { state: 'available' }
  >['source']
  description: string
}

export type PubPartsZipEntryPreviewUnavailableState = {
  canPreview: false
  actionLabel: 'Preview unavailable'
  candidateId: string
  archivePath?: string
  normalizedArchivePath?: string
  fileName: string
  fileType?: string
  unavailableReason: PubPartsZipEntryPreviewUnavailableReason
  description: string
}

export type PubPartsZipEntryPreviewActionState =
  | PubPartsZipEntryPreviewAvailableState
  | PubPartsZipEntryPreviewUnavailableState

const isDirectCandidate = (candidate: PubPartsSharedLinkCandidate): boolean =>
  candidate.kind === 'supported-direct-file' ||
  candidate.kind === 'import-type-unsupported' ||
  candidate.kind === 'unsupported-direct-file'

export const isPubPartsZipEntryPreviewFileType = (
  fileType: string | undefined,
): fileType is PubPartsZipEntryPreviewFileType =>
  fileType !== undefined &&
  PUBPARTS_ZIP_ENTRY_PREVIEW_FILE_TYPES.includes(
    fileType as PubPartsZipEntryPreviewFileType,
  )

const normalizePreviewFileType = (
  fileType: string | undefined,
): PubPartsZipEntryPreviewFileType | undefined => {
  const normalizedFileType = fileType?.toLowerCase()
  return isPubPartsZipEntryPreviewFileType(normalizedFileType)
    ? (normalizedFileType as PubPartsZipEntryPreviewFileType)
    : undefined
}

const buildUnavailableState = (
  candidate: PubPartsSharedLinkCandidate,
  unavailableReason: PubPartsZipEntryPreviewUnavailableReason,
  description: string,
): PubPartsZipEntryPreviewUnavailableState => ({
  canPreview: false,
  actionLabel: 'Preview unavailable',
  candidateId: candidate.candidateId,
  archivePath: candidate.archivePath,
  normalizedArchivePath: candidate.normalizedArchivePath,
  fileName: candidate.fileName,
  fileType: candidate.fileType,
  unavailableReason,
  description,
})

const resolveByteUnavailableState = (
  candidate: PubPartsSharedLinkCandidate,
  archiveByteAvailability: PubPartsZipEntryPreviewArchiveByteAvailability,
): PubPartsZipEntryPreviewUnavailableState | null => {
  if (archiveByteAvailability.state === 'available') {
    return null
  }

  if (archiveByteAvailability.state === 'metadata-only') {
    return buildUnavailableState(
      candidate,
      'metadata-only',
      'This source-options read only has archive manifest metadata. Upload the ZIP or use a same-source-version Internal Library archive cache before previewing.',
    )
  }

  if (archiveByteAvailability.reason === 'stale-archive-bytes') {
    return buildUnavailableState(
      candidate,
      'stale-archive-bytes',
      'The cached archive bytes are stale or missing for this PubParts source version.',
    )
  }

  return buildUnavailableState(
    candidate,
    'no-archive-bytes',
    'Source options does not currently have ZIP archive bytes for this entry.',
  )
}

export function resolvePubPartsZipEntryPreviewActionState(
  candidate: PubPartsSharedLinkCandidate,
  archiveByteAvailability: PubPartsZipEntryPreviewArchiveByteAvailability,
): PubPartsZipEntryPreviewActionState {
  if (isDirectCandidate(candidate)) {
    return buildUnavailableState(
      candidate,
      'direct-file-candidate',
      'This candidate is a direct file, not an uploaded or cached ZIP entry.',
    )
  }

  if (
    candidate.kind !== 'supported-archive-entry' &&
    candidate.kind !== 'unsupported-archive-entry'
  ) {
    return buildUnavailableState(
      candidate,
      'non-archive-entry-candidate',
      'This source option is not an inspected ZIP entry.',
    )
  }

  const archivePath = candidate.archivePath ?? candidate.normalizedArchivePath
  const normalizedArchivePath = candidate.normalizedArchivePath ?? candidate.archivePath
  if (archivePath === undefined || normalizedArchivePath === undefined) {
    return buildUnavailableState(
      candidate,
      'missing-archive-path',
      'This ZIP entry does not have a stable archive path for preview.',
    )
  }

  if (candidate.archiveEntryClassification === 'unsafe') {
    return buildUnavailableState(
      candidate,
      'unsafe-archive-entry',
      'This ZIP entry is unsafe and cannot be previewed.',
    )
  }

  if (candidate.archiveEntryClassification === 'directory' || candidate.isDirectory === true) {
    return buildUnavailableState(
      candidate,
      'directory-archive-entry',
      'This ZIP entry is a directory and cannot be previewed as 3D.',
    )
  }

  if (candidate.archiveEntryClassification === 'blocked') {
    return buildUnavailableState(
      candidate,
      'blocked-archive-entry',
      'This ZIP entry is blocked by the archive safety checks and cannot be previewed.',
    )
  }

  const fileType = normalizePreviewFileType(candidate.fileType)
  if (
    fileType === undefined ||
    candidate.kind !== 'supported-archive-entry' ||
    candidate.archiveEntryClassification !== 'supported'
  ) {
    return buildUnavailableState(
      candidate,
      'unsupported-file-type',
      'This ZIP entry is not supported by the current 3D preview path.',
    )
  }

  if (!candidate.selectable) {
    return buildUnavailableState(
      candidate,
      'unselectable-archive-entry',
      'This ZIP entry is not selectable, so it cannot be previewed.',
    )
  }

  if (archiveByteAvailability.state !== 'available') {
    return (
      resolveByteUnavailableState(candidate, archiveByteAvailability) ??
      buildUnavailableState(
        candidate,
        'no-archive-bytes',
        'Source options does not currently have ZIP archive bytes for this entry.',
      )
    )
  }

  return {
    canPreview: true,
    actionLabel: 'Preview 3D',
    candidateId: candidate.candidateId,
    archivePath,
    normalizedArchivePath,
    fileName: candidate.fileName,
    fileType,
    archiveBytesSource: archiveByteAvailability.source,
    description: 'Preview this ZIP entry before staging it into Import review.',
  }
}

export function resolvePubPartsZipEntryPreviewActionStates(
  candidates: PubPartsSharedLinkCandidate[],
  archiveByteAvailability: PubPartsZipEntryPreviewArchiveByteAvailability,
): PubPartsZipEntryPreviewActionState[] {
  return candidates.map((candidate) =>
    resolvePubPartsZipEntryPreviewActionState(candidate, archiveByteAvailability),
  )
}
