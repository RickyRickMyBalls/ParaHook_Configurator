import type { PubPartsSharedLinkCandidate } from '../pubPartsSharedLinkResolver'
import { resolvePubPartsSharedLinkDirectDownloadUrl } from '../pubPartsSharedLinkResolver'
import type { PubPartsStagedSourceRecord } from '../pubPartsDownloadsStorage'
import { SUPPORTED_REFERENCE_IMPORT_FILE_TYPES } from '../../references/importReferenceFile'

type CatalogShellSourceOptionsDialogProps = {
  stagedRecord: PubPartsStagedSourceRecord
  candidates: PubPartsSharedLinkCandidate[]
  selectedCandidateIds: string[]
  statusMessage: string | null
  isInspectingArchive: boolean
  isStaging: boolean
  onToggleCandidate: (candidateId: string) => void
  onSelectAllSupported: () => void
  onClearSelection: () => void
  onChooseLocalArchive: () => void
  onStageSelected: () => void
  onClose: () => void
}

const formatSourceCandidateType = (candidate: PubPartsSharedLinkCandidate): string => {
  if (candidate.kind === 'supported-archive-entry') {
    return `Archive ${candidate.fileType?.toUpperCase() ?? 'Entry'}`
  }

  return candidate.selectable
    ? candidate.fileType?.toUpperCase() ?? candidate.kind
    : candidate.label
}

const formatArchiveEntryType = (candidate: PubPartsSharedLinkCandidate): string => {
  if (candidate.isDirectory === true) {
    return 'Directory'
  }

  return candidate.fileType?.toUpperCase() ?? 'Unknown'
}

const formatArchiveEntrySize = (candidate: PubPartsSharedLinkCandidate): string => {
  const sizeBytes = candidate.fileSizeBytes
  if (sizeBytes === undefined || !Number.isFinite(sizeBytes)) {
    return 'Unknown size'
  }

  if (sizeBytes < 1024) {
    return `${sizeBytes} bytes`
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatArchiveEntryBlockedReason = (candidate: PubPartsSharedLinkCandidate): string | null => {
  switch (candidate.archiveEntryBlockedReason) {
    case 'absolute-path':
      return 'Absolute path'
    case 'directory':
      return 'Directory'
    case 'empty-path':
      return 'Empty path'
    case 'hidden-or-system-path':
      return 'Hidden/system path'
    case 'nul-path':
      return 'NUL path'
    case 'oversized':
      return 'Oversized'
    case 'path-traversal':
      return 'Path traversal'
    case 'too-many-entries':
      return 'Too many entries'
    case 'unknown-size':
      return 'Unknown size'
    case 'windows-drive-path':
      return 'Windows drive path'
    case undefined:
      return null
  }
}

const formatArchiveEntrySupportState = (candidate: PubPartsSharedLinkCandidate): string => {
  const blockedReason = formatArchiveEntryBlockedReason(candidate)

  if (candidate.selectable) {
    return 'Supported'
  }

  switch (candidate.archiveEntryClassification) {
    case 'blocked':
      return blockedReason ?? 'Blocked'
    case 'directory':
      return 'Directory'
    case 'unsafe':
      return blockedReason ?? 'Unsafe path'
    case 'unsupported':
      return 'Unsupported'
    case 'supported':
      return 'Blocked'
    case undefined:
      return candidate.selectable ? 'Supported' : candidate.label
  }
}

const PREVIEW_AFTER_STAGING_FILE_TYPES = new Set<string>(SUPPORTED_REFERENCE_IMPORT_FILE_TYPES)

const formatArchiveEntryPreviewState = (candidate: PubPartsSharedLinkCandidate): string =>
  candidate.selectable &&
  candidate.fileType !== undefined &&
  PREVIEW_AFTER_STAGING_FILE_TYPES.has(candidate.fileType)
    ? 'In Import review after staging'
    : 'Not available'

const isArchiveEntryCandidate = (candidate: PubPartsSharedLinkCandidate): boolean =>
  candidate.kind === 'supported-archive-entry' || candidate.kind === 'unsupported-archive-entry'

const getSourceFileExtension = (sourceUrl: string): string | null => {
  try {
    const { pathname } = new URL(sourceUrl)
    return /\.([a-z0-9]+)$/iu.exec(pathname)?.[1]?.toLowerCase() ?? null
  } catch {
    return /\.([a-z0-9]+)(?:[?#].*)?$/iu.exec(sourceUrl)?.[1]?.toLowerCase() ?? null
  }
}

const resolveSourceActionLabel = (sourceUrl: string): string =>
  getSourceFileExtension(sourceUrl) === 'zip' ? 'Download ZIP' : 'Open Source'

const resolveSourceDetailLabel = (sourceUrl: string): string =>
  getSourceFileExtension(sourceUrl) === 'zip' ? 'Source ZIP' : 'Source link'

export function CatalogShellSourceOptionsDialog(
  props: CatalogShellSourceOptionsDialogProps,
) {
  const {
    stagedRecord,
    candidates,
    selectedCandidateIds,
    statusMessage,
    isInspectingArchive,
    isStaging,
    onToggleCandidate,
    onSelectAllSupported,
    onClearSelection,
    onChooseLocalArchive,
    onStageSelected,
    onClose,
  } = props
  const selectableCount = candidates.filter((candidate) => candidate.selectable).length
  const selectedCount = selectedCandidateIds.length
  const isBusy = isStaging || isInspectingArchive
  const sourceActionLabel = resolveSourceActionLabel(stagedRecord.sourceCandidateUrl)
  const sourceActionUrl = resolvePubPartsSharedLinkDirectDownloadUrl(
    stagedRecord.sourceCandidateUrl,
  )
  const sourceDetailLabel = resolveSourceDetailLabel(stagedRecord.sourceCandidateUrl)
  const showsStagedZipEntries = candidates.some((candidate) =>
    isArchiveEntryCandidate(candidate),
  )

  return (
    <div className="CatalogSourceOptionsBackdrop" role="presentation">
      <section
        className="CatalogSourceOptionsDialog"
        role="dialog"
        aria-modal="true"
        aria-label="PubParts source options"
        data-catalog-pubparts-source-options-dialog={stagedRecord.catalogItemId}
      >
        <header className="CatalogSourceOptionsHeader">
          <div>
            <p className="CatalogShellRegionEyebrow">PubParts Source Options</p>
            <h3>{stagedRecord.catalogItemLabel}</h3>
          </div>
          <button
            type="button"
            className="CatalogSourceOptionsClose"
            aria-label="Close PubParts source options"
            onClick={onClose}
          >
            x
          </button>
        </header>

        <p className="CatalogSourceOptionsCopy">
          This staged importer uses the PubParts source link for this item. Use {sourceActionLabel}{' '}
          to let the browser open or save the ZIP, then use Upload ZIP to grant ParaHook access to
          the saved file. The browser controls where the ZIP is saved; ParaHook only reads the file
          after you choose it here.
        </p>

        <div
          className="CatalogSourceOptionsSourceDetails"
          aria-label="PubParts source metadata"
        >
          <span>Provider: {stagedRecord.providerName}</span>
          {stagedRecord.sourcePageUrl !== undefined ? (
            <span>Source page: {stagedRecord.sourcePageUrl}</span>
          ) : null}
          <span>{sourceDetailLabel}: {stagedRecord.sourceCandidateUrl}</span>
        </div>

        <div className="CatalogSourceOptionsMeta">
          <span>{candidates.length} {showsStagedZipEntries ? 'entries' : 'candidates'}</span>
          <span>{selectableCount} supported</span>
          <span>{selectedCount} selected</span>
        </div>

        <div
          className="CatalogSourceOptionsList"
          role="region"
          aria-label={
            showsStagedZipEntries
              ? 'PubParts staged ZIP entry list'
              : 'PubParts source candidate list'
          }
          {...(showsStagedZipEntries
            ? { 'data-catalog-pubparts-staged-zip-entry-list': true }
            : {})}
        >
          {candidates.map((candidate) => {
            const isSelected = selectedCandidateIds.includes(candidate.candidateId)
            const isArchiveEntry = isArchiveEntryCandidate(candidate)
            const blockedReason = formatArchiveEntryBlockedReason(candidate)
            return (
              <label
                key={candidate.candidateId}
                className={`CatalogSourceOptionsRow ${
                  candidate.selectable ? '' : 'isDisabled'
                }`}
                {...(isArchiveEntry
                  ? { 'data-catalog-pubparts-staged-zip-entry-row': candidate.candidateId }
                  : {})}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={!candidate.selectable || isBusy}
                  onChange={() => onToggleCandidate(candidate.candidateId)}
                  {...(isArchiveEntry
                    ? { 'data-catalog-pubparts-staged-zip-entry-checkbox': candidate.candidateId }
                    : {})}
                />
                <span className="CatalogSourceOptionsRowMain">
                  <span className="CatalogSourceOptionsRowTitle">{candidate.fileName}</span>
                  {isArchiveEntry ? (
                    <span className="CatalogSourceOptionsStagedEntryFields">
                      <span>Archive path: {candidate.archivePath ?? candidate.fileName}</span>
                      <span>File name: {candidate.fileName}</span>
                      <span>Type: {formatArchiveEntryType(candidate)}</span>
                      <span>Size: {formatArchiveEntrySize(candidate)}</span>
                      <span
                        data-catalog-pubparts-staged-zip-entry-support-state={
                          candidate.candidateId
                        }
                      >
                        Support state: {formatArchiveEntrySupportState(candidate)}
                      </span>
                      <span
                        data-catalog-pubparts-staged-zip-entry-preview-state={
                          candidate.candidateId
                        }
                      >
                        Preview: {formatArchiveEntryPreviewState(candidate)}
                      </span>
                      {blockedReason !== null ? (
                        <span>Blocked reason: {blockedReason}</span>
                      ) : null}
                      <span>Selected: {isSelected ? 'Yes' : 'No'}</span>
                    </span>
                  ) : (
                    <>
                      <span className="CatalogSourceOptionsRowDescription">
                        {candidate.description}
                      </span>
                      {candidate.archivePath !== undefined ? (
                        <span className="CatalogSourceOptionsRowUrl">
                          Archive path: {candidate.archivePath}
                        </span>
                      ) : null}
                      {candidate.fileSizeBytes !== undefined ? (
                        <span className="CatalogSourceOptionsRowUrl">
                          Size: {candidate.fileSizeBytes} bytes
                        </span>
                      ) : null}
                    </>
                  )}
                  <span className="CatalogSourceOptionsRowDescription">
                    {candidate.description}
                  </span>
                  {!isArchiveEntry ? (
                    <span className="CatalogSourceOptionsRowUrl">
                      Source: {candidate.sourceUrl}
                    </span>
                  ) : null}
                </span>
                <span className="CatalogSourceOptionsRowType">
                  {isArchiveEntry
                    ? formatArchiveEntrySupportState(candidate)
                    : formatSourceCandidateType(candidate)}
                </span>
              </label>
            )
          })}
        </div>

        {statusMessage !== null ? (
          <p className="CatalogSourceOptionsStatus" data-catalog-pubparts-source-options-status>
            {statusMessage}
          </p>
        ) : null}

        <footer className="CatalogSourceOptionsActions">
          <button
            type="button"
            className="CatalogSourceOptionsAction"
            onClick={onSelectAllSupported}
            disabled={selectableCount === 0 || isBusy}
          >
            Select All Supported
          </button>
          <button
            type="button"
            className="CatalogSourceOptionsAction"
            onClick={onClearSelection}
            disabled={selectedCount === 0 || isBusy}
          >
            Clear Selection
          </button>
          <a
            className="CatalogSourceOptionsLink"
            data-catalog-pubparts-source-download-link
            href={sourceActionUrl}
            target="_blank"
            rel="noreferrer"
          >
            {sourceActionLabel}
          </a>
          <button
            type="button"
            className="CatalogSourceOptionsAction"
            data-catalog-pubparts-choose-local-zip
            onClick={onChooseLocalArchive}
            disabled={isBusy}
          >
            Upload ZIP
          </button>
          <button
            type="button"
            className="CatalogSourceOptionsAction CatalogSourceOptionsAction--primary"
            data-catalog-pubparts-stage-selected-source-options
            onClick={onStageSelected}
            disabled={selectedCount === 0 || isBusy}
          >
            {isInspectingArchive
              ? 'Inspecting...'
              : isStaging
                ? 'Staging to Import Review...'
                : 'Stage Selected to Import Review'}
          </button>
        </footer>
      </section>
    </div>
  )
}
