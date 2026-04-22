import { describe, expect, it } from 'vitest'
import type { PubPartsSharedLinkCandidate } from './pubPartsSharedLinkResolver'
import {
  isPubPartsZipEntryPreviewFileType,
  resolvePubPartsZipEntryPreviewActionState,
  resolvePubPartsZipEntryPreviewActionStates,
  type PubPartsZipEntryPreviewArchiveByteAvailability,
} from './pubPartsZipEntryPreview'

const availableArchiveBytes: PubPartsZipEntryPreviewArchiveByteAvailability = {
  state: 'available',
  source: 'source-options-archive',
}

const buildSupportedArchiveCandidate = (
  fileType = 'stl',
  overrides: Partial<PubPartsSharedLinkCandidate> = {},
): PubPartsSharedLinkCandidate => ({
  candidateId: `staged:archive-entry:models/part.${fileType}`,
  kind: 'supported-archive-entry',
  fileName: `part.${fileType}`,
  fileType,
  label: `Archive Entry (${fileType.toUpperCase()})`,
  description: 'This ZIP entry is a supported source file candidate.',
  sourceUrl: 'https://pubparts.example/source.zip',
  archivePath: `models/part.${fileType}`,
  normalizedArchivePath: `models/part.${fileType}`,
  fileSizeBytes: 1234,
  isDirectory: false,
  archiveEntryClassification: 'supported',
  selectable: true,
  ...overrides,
})

const buildUnsupportedArchiveCandidate = (
  fileType = '3mf',
  overrides: Partial<PubPartsSharedLinkCandidate> = {},
): PubPartsSharedLinkCandidate => ({
  candidateId: `staged:archive-entry:models/part.${fileType}`,
  kind: 'unsupported-archive-entry',
  fileName: `part.${fileType}`,
  fileType,
  label: 'Unsupported Archive Entry',
  description: 'This ZIP entry is not supported by the current Catalog-to-Import path.',
  sourceUrl: 'https://pubparts.example/source.zip',
  archivePath: `models/part.${fileType}`,
  normalizedArchivePath: `models/part.${fileType}`,
  fileSizeBytes: 1234,
  isDirectory: false,
  archiveEntryClassification: 'unsupported',
  selectable: false,
  ...overrides,
})

describe('pubPartsZipEntryPreview', () => {
  it('identifies previewable supported uploaded ZIP entries in source options', () => {
    expect(['step', 'stl', 'obj', 'glb'].every(isPubPartsZipEntryPreviewFileType)).toBe(true)

    const states = resolvePubPartsZipEntryPreviewActionStates(
      ['step', 'stl', 'obj', 'glb'].map((fileType) => buildSupportedArchiveCandidate(fileType)),
      availableArchiveBytes,
    )

    expect(states).toEqual([
      expect.objectContaining({
        canPreview: true,
        actionLabel: 'Preview 3D',
        archivePath: 'models/part.step',
        normalizedArchivePath: 'models/part.step',
        fileName: 'part.step',
        fileType: 'step',
        archiveBytesSource: 'source-options-archive',
      }),
      expect.objectContaining({
        canPreview: true,
        fileType: 'stl',
      }),
      expect.objectContaining({
        canPreview: true,
        fileType: 'obj',
      }),
      expect.objectContaining({
        canPreview: true,
        fileType: 'glb',
      }),
    ])
  })

  it('disables ZIP entry preview when source options only has metadata cache entries', () => {
    const candidate = buildSupportedArchiveCandidate('glb')

    expect(
      resolvePubPartsZipEntryPreviewActionState(candidate, {
        state: 'metadata-only',
        source: 'local-storage-manifest',
      }),
    ).toEqual(
      expect.objectContaining({
        canPreview: false,
        actionLabel: 'Preview unavailable',
        unavailableReason: 'metadata-only',
      }),
    )

    expect(
      resolvePubPartsZipEntryPreviewActionState(candidate, {
        state: 'missing',
        reason: 'no-archive-bytes',
      }),
    ).toEqual(
      expect.objectContaining({
        canPreview: false,
        unavailableReason: 'no-archive-bytes',
      }),
    )

    expect(
      resolvePubPartsZipEntryPreviewActionState(candidate, {
        state: 'missing',
        reason: 'stale-archive-bytes',
      }),
    ).toEqual(
      expect.objectContaining({
        canPreview: false,
        unavailableReason: 'stale-archive-bytes',
      }),
    )
  })

  it('keeps unsupported ZIP entries out of source-options 3D preview', () => {
    expect(isPubPartsZipEntryPreviewFileType('stp')).toBe(false)

    expect(
      resolvePubPartsZipEntryPreviewActionState(
        buildUnsupportedArchiveCandidate('stp', {
          archiveEntryClassification: 'unsupported',
        }),
        availableArchiveBytes,
      ),
    ).toEqual(
      expect.objectContaining({
        canPreview: false,
        unavailableReason: 'unsupported-file-type',
      }),
    )

    expect(
      resolvePubPartsZipEntryPreviewActionState(
        buildUnsupportedArchiveCandidate('stl', {
          archiveEntryClassification: 'unsafe',
          archiveEntryBlockedReason: 'path-traversal',
        }),
        availableArchiveBytes,
      ),
    ).toEqual(
      expect.objectContaining({
        canPreview: false,
        unavailableReason: 'unsafe-archive-entry',
      }),
    )

    expect(
      resolvePubPartsZipEntryPreviewActionState(
        buildUnsupportedArchiveCandidate(undefined, {
          fileName: 'models/',
          fileType: undefined,
          archivePath: 'models/',
          normalizedArchivePath: 'models/',
          archiveEntryClassification: 'directory',
          archiveEntryBlockedReason: 'directory',
          isDirectory: true,
        }),
        availableArchiveBytes,
      ),
    ).toEqual(
      expect.objectContaining({
        canPreview: false,
        unavailableReason: 'directory-archive-entry',
      }),
    )

    expect(
      resolvePubPartsZipEntryPreviewActionState(
        buildUnsupportedArchiveCandidate('glb', {
          archiveEntryClassification: 'blocked',
          archiveEntryBlockedReason: 'oversized',
        }),
        availableArchiveBytes,
      ),
    ).toEqual(
      expect.objectContaining({
        canPreview: false,
        unavailableReason: 'blocked-archive-entry',
      }),
    )
  })

  it('disables non-archive and direct candidates with stable reason data', () => {
    const directCandidate: PubPartsSharedLinkCandidate = {
      candidateId: 'staged:shared-link:part.stl',
      kind: 'supported-direct-file',
      fileName: 'part.stl',
      fileType: 'stl',
      label: 'part.stl (STL)',
      description: 'Direct file candidate.',
      sourceUrl: 'https://pubparts.example/part.stl',
      downloadUrl: 'https://pubparts.example/part.stl?dl=1',
      selectable: true,
    }

    const archiveNeedsInspectionCandidate: PubPartsSharedLinkCandidate = {
      candidateId: 'staged:shared-link:source.zip',
      kind: 'archive-needs-inspection',
      fileName: 'source.zip',
      fileType: 'zip',
      label: 'Archive Needs Inspection',
      description: 'ZIP needs inspection.',
      sourceUrl: 'https://pubparts.example/source.zip',
      selectable: false,
    }

    expect(
      resolvePubPartsZipEntryPreviewActionState(directCandidate, availableArchiveBytes),
    ).toEqual(
      expect.objectContaining({
        canPreview: false,
        unavailableReason: 'direct-file-candidate',
      }),
    )

    expect(
      resolvePubPartsZipEntryPreviewActionState(
        archiveNeedsInspectionCandidate,
        availableArchiveBytes,
      ),
    ).toEqual(
      expect.objectContaining({
        canPreview: false,
        unavailableReason: 'non-archive-entry-candidate',
      }),
    )
  })

  it('requires a stable archive path and selectable supported entry', () => {
    expect(
      resolvePubPartsZipEntryPreviewActionState(
        buildSupportedArchiveCandidate('stl', {
          archivePath: undefined,
          normalizedArchivePath: undefined,
        }),
        availableArchiveBytes,
      ),
    ).toEqual(
      expect.objectContaining({
        canPreview: false,
        unavailableReason: 'missing-archive-path',
      }),
    )

    expect(
      resolvePubPartsZipEntryPreviewActionState(
        buildSupportedArchiveCandidate('obj', {
          selectable: false,
        }),
        availableArchiveBytes,
      ),
    ).toEqual(
      expect.objectContaining({
        canPreview: false,
        unavailableReason: 'unselectable-archive-entry',
      }),
    )
  })
})
