import { isCatalogStartingAssemblyItem, type CatalogItemRecord } from '../catalogItemContract'
import type { CatalogSourceSnapshot } from '../catalogSource'
import type {
  PubPartsSelectedSupportedFile,
  PubPartsSourceInspectionResult,
  PubPartsStagedSourceRecord,
} from '../pubPartsDownloadsStorage'
import type { ReferenceFileType } from '../../references/referenceManifest'
import type { ImportedReferenceSourceAttribution } from '../../references/importReferenceFile'

export type CatalogBrowseMode = 'part' | 'platform'

export type CatalogSectionOption = {
  sectionKey: string
  label: string
  count: number
  description: string
}

export type CatalogBrowseModeOption = {
  browseMode: CatalogBrowseMode
  label: string
  description: string
}

export type CatalogFilterGroupKey =
  | 'systemKey'
  | 'platformCompatibility'
  | 'partType'
  | 'partGroups'
  | 'brand'

export type CatalogSelectedFilters = Partial<Record<CatalogFilterGroupKey, string[]>>

export type CatalogFilterOption = {
  value: string
  count: number
}

export type CatalogFilterGroup = {
  groupKey: CatalogFilterGroupKey
  label: string
  description: string
  options: CatalogFilterOption[]
}

type CatalogFilterGroupDefinition = {
  groupKey: CatalogFilterGroupKey
  label: string
  description: string
  resolveValues: (item: CatalogItemRecord) => string[]
}

const CATALOG_FILTER_GROUP_DEFINITIONS: CatalogFilterGroupDefinition[] = [
  {
    groupKey: 'platformCompatibility',
    label: 'Platform Compatibility',
    description:
      'Canonical ADV, XR, GT, Pint, XR Classic, and Other families from the shared item contract.',
    resolveValues: (item) => item.platformCompatibility ?? [],
  },
  {
    groupKey: 'partType',
    label: 'Part Type',
    description: 'Local part type metadata from the shared item contract.',
    resolveValues: (item) => (item.partType === undefined ? [] : [item.partType]),
  },
  {
    groupKey: 'partGroups',
    label: 'Part Groups',
    description: 'First-pass part groups such as Footpads, FootHolds, and Shoes.',
    resolveValues: (item) => item.partGroups ?? [],
  },
  {
    groupKey: 'systemKey',
    label: 'System',
    description: 'Local organizer values such as Platform, Wheel, and Hardware.',
    resolveValues: (item) => (item.systemKey === undefined ? [] : [item.systemKey]),
  },
  {
    groupKey: 'brand',
    label: 'Brand',
    description: 'Brand metadata kept on the shared catalog item contract.',
    resolveValues: (item) => (item.brand === undefined ? [] : [item.brand]),
  },
]

export type CatalogContentMode = 'grid' | 'item-page'

export const resolveCatalogBrowseModeLabel = (browseMode: CatalogBrowseMode): string =>
  browseMode === 'part' ? 'Part' : 'Platform'

export const resolveCatalogBrowseModeDescription = (browseMode: CatalogBrowseMode): string =>
  browseMode === 'part'
    ? 'Part read centers part type, product name, position, and local part-group metadata.'
    : 'Platform read centers system ownership and platform compatibility metadata.'

export function buildCatalogBrowseModeOptions(): CatalogBrowseModeOption[] {
  return (['part', 'platform'] as const).map((browseMode) => ({
    browseMode,
    label: resolveCatalogBrowseModeLabel(browseMode),
    description: resolveCatalogBrowseModeDescription(browseMode),
  }))
}

function resolveCatalogBrowseSectionKeys(
  item: CatalogItemRecord,
  browseMode: CatalogBrowseMode,
): string[] {
  if (item.source.sourceKind === 'imports') {
    return ['imports']
  }

  if (item.assetKind === 'environment') {
    return ['hdris']
  }

  const browseSectionKeys =
    browseMode === 'platform'
      ? item.platformCompatibility?.length
        ? item.platformCompatibility
        : ['Other']
      : item.partGroups?.length
        ? item.partGroups
        : [item.partType ?? item.familyKey]

  return Array.from(new Set(browseSectionKeys))
}

function resolveCatalogBaseItems(
  snapshot: CatalogSourceSnapshot,
  activeSection: string,
  browseMode: CatalogBrowseMode,
): CatalogItemRecord[] {
  if (activeSection === 'all') {
    return snapshot.allItems
  }

  if (activeSection === 'imports') {
    return snapshot.importsItems
  }

  if (activeSection === 'hdris') {
    return snapshot.repoItems.filter((item) => item.assetKind === 'environment')
  }

  return snapshot.allItems.filter((item) =>
    resolveCatalogBrowseSectionKeys(item, browseMode).includes(activeSection),
  )
}

function resolveCatalogItemSearchableParts(item: CatalogItemRecord): string[] {
  return [
    item.label,
    item.familyKey,
    item.sectionKey,
    item.description,
    ...item.tags,
    ...(item.notes ?? []),
    ...((item.metadata ?? []).flatMap((entry) => [entry.label, entry.value])),
  ]
}

function resolveCatalogSearchFilteredItems(
  items: CatalogItemRecord[],
  searchText: string,
): CatalogItemRecord[] {
  const normalizedSearchText = searchText.trim().toLowerCase()

  if (normalizedSearchText.length === 0) {
    return items
  }

  return items.filter((item) =>
    resolveCatalogItemSearchableParts(item).some((part) =>
      part.toLowerCase().includes(normalizedSearchText),
    ),
  )
}

function resolveCatalogItemFilterValues(
  item: CatalogItemRecord,
): Record<CatalogFilterGroupKey, string[]> {
  return CATALOG_FILTER_GROUP_DEFINITIONS.reduce<Record<CatalogFilterGroupKey, string[]>>(
    (valuesByGroup, definition) => {
      valuesByGroup[definition.groupKey] = definition.resolveValues(item)
      return valuesByGroup
    },
    {
      systemKey: [],
      platformCompatibility: [],
      partType: [],
      partGroups: [],
      brand: [],
    },
  )
}

function matchesCatalogSelectedFilters(
  item: CatalogItemRecord,
  selectedFilters: CatalogSelectedFilters,
): boolean {
  const valuesByGroup = resolveCatalogItemFilterValues(item)

  return Object.entries(selectedFilters).every(([groupKey, selectedValues]) => {
    if (selectedValues === undefined || selectedValues.length === 0) {
      return true
    }

    const candidateValues = valuesByGroup[groupKey as CatalogFilterGroupKey]
    return selectedValues.some((selectedValue) => candidateValues.includes(selectedValue))
  })
}

export const formatCatalogSectionLabel = (sectionKey: string): string =>
  sectionKey
    .split('-')
    .map((part) => (part.length > 0 ? `${part[0].toUpperCase()}${part.slice(1)}` : part))
    .join(' ')

export const formatCatalogFamilyLabel = (familyKey: string): string =>
  formatCatalogSectionLabel(familyKey)

export type CatalogSourceDetailRow = {
  label: string
  value: string
}

function formatCatalogFileSize(fileSizeBytes: number | null | undefined): string {
  return fileSizeBytes === undefined || fileSizeBytes === null
    ? ''
    : `${(fileSizeBytes / 1_000_000).toFixed(1)} MB`
}

export type CatalogLinkedArchiveHandoffState =
  | 'no-linked-archive'
  | 'linked-archive-available'
  | 'linked-archive-planned'

export type CatalogLinkedArchiveHandoff = {
  state: CatalogLinkedArchiveHandoffState
  label: string
  description: string
  url: string | null
  isUserInspectable: boolean
}

export type CatalogLinkedArchiveClassificationKind =
  | 'no-linked-archive'
  | 'supported-model-candidate'
  | 'archive-container-inspect-needed'
  | 'unsupported-file-candidate'
  | 'unknown-linked-candidate'

export type CatalogLinkedArchiveClassification = {
  kind: CatalogLinkedArchiveClassificationKind
  label: string
  description: string
  url: string | null
  fileExtension: string | null
  isSupportedModelCandidate: boolean
  requiresArchiveInspection: boolean
}

export type CatalogExternalSourceActionBoundaryState =
  | 'not-external-pubparts'
  | 'source-link-stage-ready'
  | 'source-link-staged'
  | 'no-source-candidate'

export type CatalogExternalSourceActionBoundary = {
  state: CatalogExternalSourceActionBoundaryState
  label: string
  description: string
  candidateUrl: string | null
  isAvailable: false
}

export type CatalogPubPartsStagedSourceInspectionRead = {
  label: string
  description: string
  sourceCandidateUrl: string
  fileExtension: string | null
  requiresArchiveInspection: boolean
  isMetadataInspected: boolean
}

export type CatalogPubPartsSupportedFileChooserState =
  | 'not-inspected'
  | 'supported-file-choice-ready'
  | 'supported-file-selected'
  | 'archive-source-needs-inspection'
  | 'unsupported-source-candidate'
  | 'unknown-source-candidate'

export type CatalogPubPartsSupportedFileChooserRead = {
  state: CatalogPubPartsSupportedFileChooserState
  label: string
  description: string
  sourceCandidateUrl: string
  fileExtension: string | null
  selectedSupportedFile: PubPartsSelectedSupportedFile | null
  isSelectable: boolean
}

export type CatalogSelectedPubPartsImportHandoffState =
  | 'not-external-pubparts'
  | 'no-staged-source'
  | 'no-selected-supported-file'
  | 'selected-file-import-handoff-planned'
  | 'selected-file-import-type-needs-import-support'

export type CatalogSelectedPubPartsImportHandoffAttribution = {
  providerId: 'pubparts'
  providerName: 'PubParts'
  catalogItemId: string
  catalogItemLabel: string
  sourceCollectionKey?: string
  sourceCollectionLabel?: string
  sourceCandidateUrl: string
  linkedArchiveUrl: string
  sourcePageUrl?: string
  externalItemUrl?: string
  sourceUrl?: string
  previewImageUrl?: string
  sourceLastUpdated?: string
  archiveLastUpdated?: string
  sourceMetadata: PubPartsStagedSourceRecord['sourceMetadata']
  binaryStatus: PubPartsStagedSourceRecord['binaryStatus']
  importStatus: PubPartsStagedSourceRecord['importStatus']
}

export type CatalogSelectedPubPartsImportHandoff = {
  state: CatalogSelectedPubPartsImportHandoffState
  label: string
  description: string
  selectedFileUrl: string | null
  selectedFileType: PubPartsSelectedSupportedFile['fileExtension'] | null
  selectedFile: PubPartsSelectedSupportedFile | null
  sourceAttribution: CatalogSelectedPubPartsImportHandoffAttribution | null
  importOwner: 'import-family' | null
  canCreateProjectAsset: false
}

export type CatalogPubPartsSourceDownloadHandoffState =
  | 'not-external-pubparts'
  | 'no-source-download'
  | 'source-download-ready'

export type CatalogPubPartsSourceDownloadHandoff = {
  state: CatalogPubPartsSourceDownloadHandoffState
  label: string
  description: string
  sourceUrl: string | null
  downloadUrl: string | null
  canOpenDownload: boolean
}

export type CatalogPubPartsDropboxChooserStatusState =
  | 'idle'
  | 'chooser-opening'
  | 'fetching-selected-file'
  | 'ready-for-import-review'
  | 'chooser-canceled'
  | 'chooser-unavailable'
  | 'unsupported-dropbox-file'
  | 'fetch-failed'
  | 'import-type-unsupported'

export type CatalogPubPartsDropboxChooserStatus = {
  state: CatalogPubPartsDropboxChooserStatusState
  label: string
  description: string
  fileName?: string
}

const CATALOG_SUPPORTED_LINKED_MODEL_EXTENSIONS = new Set<ReferenceFileType | 'stp'>([
  'glb',
  'obj',
  'stl',
  'step',
  'stp',
])

const CATALOG_CURRENT_IMPORT_HANDOFF_FILE_TYPES = new Set<ReferenceFileType>([
  'glb',
  'obj',
  'stl',
  'step',
])

const CATALOG_SHARED_ARCHIVE_HOST_PATTERNS = ['dropbox.com']

const formatCatalogExternalProviderLabel = (item: CatalogItemRecord): string =>
  item.source.sourceKind === 'external' ? item.source.provider.providerName : 'External'

export const resolveCatalogItemSourceLabel = (item: CatalogItemRecord): string => {
  switch (item.source.sourceKind) {
    case 'repo':
      return 'Repo-backed'
    case 'imports':
      return 'Imports reuse'
    case 'external':
      return `External-linked ${formatCatalogExternalProviderLabel(item)}`
    case 'planned':
      return 'Planned source'
  }
}

export const resolveCatalogItemModeLabel = (item: CatalogItemRecord): string => {
  if (isCatalogStartingAssemblyItem(item)) {
    return 'Starting Assembly'
  }

  switch (item.source.sourceKind) {
    case 'repo':
      return 'Catalog Item'
    case 'imports':
      return 'Imports Reuse'
    case 'external':
      return 'External Linked Source'
    case 'planned':
      return 'Planned Source'
  }
}

export const resolveCatalogItemSectionLabel = (item: CatalogItemRecord): string => {
  switch (item.source.sourceKind) {
    case 'imports':
      return 'Imports'
    case 'external':
      return `${formatCatalogExternalProviderLabel(item)} External`
    case 'planned':
      return 'Planned Starting Assembly'
    case 'repo':
      return formatCatalogSectionLabel(item.sectionKey)
  }
}

export function buildCatalogItemSourceDetails(item: CatalogItemRecord): CatalogSourceDetailRow[] {
  switch (item.source.sourceKind) {
    case 'repo':
      return [{ label: 'Repo Asset Path', value: item.source.assetPath }]
    case 'imports':
      return [
        { label: 'Import Source', value: item.source.importId },
        { label: 'Import Asset Path', value: item.source.assetPath },
        { label: 'Remembered Catalog Item', value: item.source.catalogItemId ?? '' },
      ].filter((entry) => entry.value.trim().length > 0)
    case 'external':
      return [
        { label: 'External Provider', value: item.source.provider.providerName },
        {
          label: 'Source Collection',
          value:
            item.source.provider.sourceCollectionLabel ??
            item.source.provider.sourceCollectionKey ??
            '',
        },
        { label: 'Source URL', value: item.source.sourceUrl ?? '' },
        { label: 'External Item URL', value: item.source.externalItemUrl ?? '' },
        { label: 'Preview Image URL', value: item.source.previewImageUrl ?? '' },
        { label: 'Linked Archive URL', value: item.source.linkedArchiveUrl ?? '' },
        { label: 'Source Updated', value: item.source.sourceLastUpdated ?? '' },
        { label: 'Archive Updated', value: item.source.archiveLastUpdated ?? '' },
      ].filter((entry) => entry.value.trim().length > 0)
    case 'planned':
      return [
        { label: 'Planned Source', value: item.source.sourceLabel },
        { label: 'Source Candidate Path', value: item.source.sourceAssetPath ?? '' },
        {
          label: 'Source Format',
          value:
            item.source.sourceAssetFormat === 'step-or-stp'
              ? 'STEP/STP preferred source asset'
              : '',
        },
        {
          label: 'Source File Size',
          value: formatCatalogFileSize(item.source.sourceFileSizeBytes),
        },
        {
          label: 'Source Status',
          value:
            item.source.sourceStatus === 'known-heavy-source'
              ? 'Known heavy source - Add To Project imports source; preview and starting-configuration load are planned'
              : '',
        },
        ...buildCatalogSourceAssetSetDetails(item),
      ].filter((entry) => entry.value.trim().length > 0)
  }
}

export function buildCatalogSourceAssetSetDetails(
  item: CatalogItemRecord,
): CatalogSourceDetailRow[] {
  if (item.source.sourceKind !== 'planned' || item.source.sourceAssetSet === undefined) {
    return []
  }

  const sourceAssetSet = item.source.sourceAssetSet
  const currentVersion =
    sourceAssetSet.versions.find(
      (version) => version.versionId === sourceAssetSet.currentVersionId,
    ) ?? sourceAssetSet.versions[0] ?? null

  if (currentVersion === null) {
    return [
      { label: 'Source Identity', value: sourceAssetSet.sourceId },
      { label: 'Current Source Version', value: sourceAssetSet.currentVersionId },
    ].filter((entry) => entry.value.trim().length > 0)
  }

  const formatVariantValue = (variantRole: string): string => {
    const variant = currentVersion.variants.find(
      (candidateVariant) => candidateVariant.role === variantRole,
    )

    if (variant === undefined) {
      return ''
    }

    return [
      variant.label ?? '',
      variant.format.toUpperCase(),
      variant.sourcePath,
      formatCatalogFileSize(variant.fileSizeBytes),
    ]
      .filter((part) => part.trim().length > 0)
      .join(' - ')
  }

  return [
    { label: 'Source Identity', value: sourceAssetSet.sourceId },
    {
      label: 'Current Source Version',
      value: `${currentVersion.versionLabel} (${currentVersion.versionId})`,
    },
    { label: 'Source Version Status', value: currentVersion.status },
    { label: 'Preferred Source Variant', value: formatVariantValue('preferred-source') },
    { label: 'Companion Mesh Variant', value: formatVariantValue('companion-mesh') },
  ].filter((entry) => entry.value.trim().length > 0)
}

export function buildCatalogWheelFitmentDetails(item: CatalogItemRecord): CatalogSourceDetailRow[] {
  if (item.systemKey !== 'Wheel' || item.wheelFitment === undefined) {
    return []
  }

  return [
    { label: 'Motor Version', value: item.wheelFitment.motorVersion ?? '' },
    { label: 'Hub Size', value: item.wheelFitment.hubSizeInches ?? '' },
    { label: 'Tire Size', value: item.wheelFitment.tireSize ?? '' },
    { label: 'Tire Compound', value: item.wheelFitment.tireCompound ?? '' },
  ].filter((entry) => entry.value.trim().length > 0)
}

export function buildCatalogStartingAssemblyDetails(
  item: CatalogItemRecord,
): CatalogSourceDetailRow[] {
  if (!isCatalogStartingAssemblyItem(item)) {
    return []
  }

  const sourceAssetPreference =
    item.startingAssembly?.sourceAssetPreference === 'step-or-stp'
      ? 'STEP/STP preferred source asset'
      : ''

  return [
    { label: 'Catalog Role', value: 'Starting Assembly' },
    {
      label: 'Starting Configuration',
      value: 'Planned - load-as-starting-configuration is not wired yet',
    },
    { label: 'Platform Family', value: item.startingAssembly?.platformFamily ?? '' },
    { label: 'Source Asset Preference', value: sourceAssetPreference },
  ].filter((entry) => entry.value.trim().length > 0)
}

export function resolveCatalogExternalSourcePageUrl(item: CatalogItemRecord): string | null {
  if (item.source.sourceKind !== 'external') {
    return null
  }

  const externalItemUrl = item.source.externalItemUrl?.trim() ?? ''
  if (externalItemUrl.length > 0) {
    return externalItemUrl
  }

  const sourceUrl = item.source.sourceUrl?.trim() ?? ''
  return sourceUrl.length > 0 ? sourceUrl : null
}

export function resolveCatalogExternalSourceActionBoundary(
  item: CatalogItemRecord,
  stagedRecord: PubPartsStagedSourceRecord | null = null,
): CatalogExternalSourceActionBoundary {
  if (item.source.sourceKind !== 'external' || item.source.provider.providerId !== 'pubparts') {
    return {
      state: 'not-external-pubparts',
      label: 'No External PubParts Source Action',
      description: 'This Catalog entry is not an external PubParts source entry.',
      candidateUrl: null,
      isAvailable: false,
    }
  }

  const linkedArchiveUrl = item.source.linkedArchiveUrl?.trim() ?? ''
  if (linkedArchiveUrl.length === 0) {
    return {
      state: 'no-source-candidate',
      label: 'No Source Candidate',
      description:
        'This external PubParts entry has no linked source candidate for a future staging or inspection action.',
      candidateUrl: null,
      isAvailable: false,
    }
  }

  if (stagedRecord !== null) {
    return {
      state: 'source-link-staged',
      label: 'Source Link Staged',
      description:
        'This PubParts source link is staged as metadata only. Source bytes are not downloaded, files are not inspected, and no project asset has been imported.',
      candidateUrl: linkedArchiveUrl,
      isAvailable: false,
    }
  }

  return {
    state: 'source-link-stage-ready',
    label: 'Stage Source Link',
    description:
      'Stage this PubParts source link as metadata for later inspection. ParaHook will not download, inspect, extract, import, or commit files in this step.',
    candidateUrl: linkedArchiveUrl,
    isAvailable: false,
  }
}

export function resolveCatalogLinkedArchiveHandoff(
  item: CatalogItemRecord,
): CatalogLinkedArchiveHandoff {
  if (item.source.sourceKind !== 'external') {
    return {
      state: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This Catalog entry has no external archive link metadata.',
      url: null,
      isUserInspectable: false,
    }
  }

  const linkedArchiveUrl = item.source.linkedArchiveUrl?.trim() ?? ''
  if (linkedArchiveUrl.length === 0) {
    return {
      state: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This external source record has no linked archive URL metadata.',
      url: null,
      isUserInspectable: false,
    }
  }

  return {
    state: 'linked-archive-available',
    label: 'Linked Archive Metadata Available',
    description:
      'External archive link metadata exists for source inspection only. ParaHook has not downloaded, extracted, imported, or classified this archive.',
    url: linkedArchiveUrl,
    isUserInspectable: true,
  }
}

function resolveLinkedArchiveUrlParts(url: string): { hostname: string; path: string } {
  try {
    const parsedUrl = new URL(url)
    return {
      hostname: parsedUrl.hostname.toLowerCase(),
      path: parsedUrl.pathname,
    }
  } catch {
    const withoutQuery = url.split(/[?#]/u)[0] ?? ''
    return {
      hostname: '',
      path: withoutQuery,
    }
  }
}

function resolveLinkedArchiveExtension(path: string): string | null {
  const lastPathPart = path.split('/').filter((part) => part.length > 0).at(-1) ?? ''
  const extensionMatch = /\.([a-z0-9]+)$/iu.exec(lastPathPart)
  return extensionMatch?.[1]?.toLowerCase() ?? null
}

function isSharedArchiveHost(hostname: string): boolean {
  return CATALOG_SHARED_ARCHIVE_HOST_PATTERNS.some(
    (hostPattern) => hostname === hostPattern || hostname.endsWith(`.${hostPattern}`),
  )
}

export function resolveCatalogLinkedArchiveClassification(
  item: CatalogItemRecord,
): CatalogLinkedArchiveClassification {
  if (item.source.sourceKind !== 'external') {
    return {
      kind: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This Catalog entry has no linked archive metadata to classify.',
      url: null,
      fileExtension: null,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: false,
    }
  }

  const linkedArchiveUrl = item.source.linkedArchiveUrl?.trim() ?? ''
  if (linkedArchiveUrl.length === 0) {
    return {
      kind: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This external source record has no linked archive URL metadata to classify.',
      url: null,
      fileExtension: null,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: false,
    }
  }

  const { hostname, path } = resolveLinkedArchiveUrlParts(linkedArchiveUrl)
  const fileExtension = resolveLinkedArchiveExtension(path)

  if (isSharedArchiveHost(hostname) || fileExtension === 'zip') {
    return {
      kind: 'archive-container-inspect-needed',
      label: 'Archive Container - Inspection Needed',
      description:
        'This linked URL points to an archive or shared source. ParaHook has not downloaded, extracted, imported, or inspected its contents, so supported files inside remain unknown.',
      url: linkedArchiveUrl,
      fileExtension,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: true,
    }
  }

  if (
    fileExtension !== null &&
    CATALOG_SUPPORTED_LINKED_MODEL_EXTENSIONS.has(fileExtension as ReferenceFileType | 'stp')
  ) {
    return {
      kind: 'supported-model-candidate',
      label: 'Supported Model Candidate',
      description:
        'This linked URL looks like a supported model file candidate from metadata only. ParaHook has not downloaded, imported, or added it to the project.',
      url: linkedArchiveUrl,
      fileExtension,
      isSupportedModelCandidate: true,
      requiresArchiveInspection: false,
    }
  }

  if (fileExtension !== null) {
    return {
      kind: 'unsupported-file-candidate',
      label: 'Unsupported File Candidate',
      description:
        'This linked URL has a file extension that is not currently supported as a direct Catalog model import candidate.',
      url: linkedArchiveUrl,
      fileExtension,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: false,
    }
  }

  return {
    kind: 'unknown-linked-candidate',
    label: 'Unknown Linked Candidate',
    description:
      'This linked URL does not expose a reliable file extension from metadata, so ParaHook cannot classify it without a later inspection step.',
    url: linkedArchiveUrl,
    fileExtension: null,
    isSupportedModelCandidate: false,
    requiresArchiveInspection: false,
  }
}

export function resolveCatalogPubPartsStagedSourceInspectionRead(
  record: PubPartsStagedSourceRecord,
): CatalogPubPartsStagedSourceInspectionRead {
  if (record.inspectionStatus !== 'metadata-inspected' || record.inspectionResult === undefined) {
    return {
      label: 'Not inspected',
      description:
        'This PubParts source link is staged as metadata only. Source bytes are not downloaded, files are not inspected, and no project asset has been imported.',
      sourceCandidateUrl: record.sourceCandidateUrl,
      fileExtension: null,
      requiresArchiveInspection: false,
      isMetadataInspected: false,
    }
  }

  const inspectionResult: PubPartsSourceInspectionResult = record.inspectionResult
  return {
    label: inspectionResult.label,
    description: inspectionResult.description,
    sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
    fileExtension: inspectionResult.fileExtension ?? null,
    requiresArchiveInspection: inspectionResult.requiresArchiveInspection,
    isMetadataInspected: true,
  }
}

export function resolveCatalogPubPartsSupportedFileChooserRead(
  record: PubPartsStagedSourceRecord,
): CatalogPubPartsSupportedFileChooserRead {
  if (record.inspectionStatus !== 'metadata-inspected' || record.inspectionResult === undefined) {
    return {
      state: 'not-inspected',
      label: 'Inspect staged source first',
      description: 'Inspect staged source metadata before choosing supported files.',
      sourceCandidateUrl: record.sourceCandidateUrl,
      fileExtension: null,
      selectedSupportedFile: null,
      isSelectable: false,
    }
  }

  const inspectionResult = record.inspectionResult

  if (
    inspectionResult.kind === 'supported-direct-file-candidate' &&
    inspectionResult.supportedFileType !== undefined
  ) {
    if (record.selectedSupportedFile !== undefined) {
      return {
        state: 'supported-file-selected',
        label: 'Supported Source File Selected',
        description:
          'Supported source file selected for later import handoff. ParaHook has not downloaded, imported, or added it to the project.',
        sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
        fileExtension: inspectionResult.supportedFileType,
        selectedSupportedFile: record.selectedSupportedFile,
        isSelectable: false,
      }
    }

    return {
      state: 'supported-file-choice-ready',
      label: 'Choose Supported Source File',
      description:
        'This direct source URL can be selected as metadata for a later import handoff. ParaHook will not download, import, or add it to the project in this step.',
      sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
      fileExtension: inspectionResult.supportedFileType,
      selectedSupportedFile: null,
      isSelectable: true,
    }
  }

  if (inspectionResult.kind === 'archive-source-needs-inspection') {
    return {
      state: 'archive-source-needs-inspection',
      label: 'No Selectable Supported File',
      description:
        'No selectable supported file yet. Archive or shared-source contents are unknown until later inspection can list files.',
      sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
      fileExtension: inspectionResult.fileExtension ?? null,
      selectedSupportedFile: null,
      isSelectable: false,
    }
  }

  if (inspectionResult.kind === 'unsupported-direct-file-candidate') {
    return {
      state: 'unsupported-source-candidate',
      label: 'No Supported Direct File',
      description: 'No supported direct file candidate from current source metadata.',
      sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
      fileExtension: inspectionResult.fileExtension ?? null,
      selectedSupportedFile: null,
      isSelectable: false,
    }
  }

  return {
    state: 'unknown-source-candidate',
    label: 'No Selectable Supported File',
    description: 'No selectable supported file from current URL metadata.',
    sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
    fileExtension: inspectionResult.fileExtension ?? null,
    selectedSupportedFile: null,
    isSelectable: false,
  }
}

function resolvePubPartsBrowserDownloadUrl(sourceUrl: string): string {
  try {
    const parsedUrl = new URL(sourceUrl)
    const hostname = parsedUrl.hostname.toLowerCase()
    if (
      hostname === 'dropbox.com' ||
      hostname.endsWith('.dropbox.com')
    ) {
      parsedUrl.searchParams.set('dl', '1')
      return parsedUrl.toString()
    }
  } catch {
    return sourceUrl
  }

  return sourceUrl
}

export function resolveCatalogPubPartsSourceDownloadHandoff(
  item: CatalogItemRecord,
  stagedRecord: PubPartsStagedSourceRecord | null = null,
): CatalogPubPartsSourceDownloadHandoff {
  if (item.source.sourceKind !== 'external' || item.source.provider.providerId !== 'pubparts') {
    return {
      state: 'not-external-pubparts',
      label: 'No PubParts Source Download',
      description: 'This Catalog entry is not an external PubParts source entry.',
      sourceUrl: null,
      downloadUrl: null,
      canOpenDownload: false,
    }
  }

  const stagedCandidateUrl =
    stagedRecord !== null && stagedRecord.catalogItemId === item.itemId
      ? stagedRecord.sourceCandidateUrl.trim()
      : ''
  const linkedArchiveUrl = item.source.linkedArchiveUrl?.trim() ?? ''
  const sourceUrl = stagedCandidateUrl.length > 0 ? stagedCandidateUrl : linkedArchiveUrl
  if (sourceUrl.length === 0) {
    return {
      state: 'no-source-download',
      label: 'No Source Download',
      description:
        'This PubParts entry has no linked source candidate to open or download.',
      sourceUrl: null,
      downloadUrl: null,
      canOpenDownload: false,
    }
  }

  return {
    state: 'source-download-ready',
    label: 'Open Source Download',
    description:
      'Opens the PubParts source candidate in the browser. ParaHook has not downloaded, inspected, extracted, imported, or committed source bytes.',
    sourceUrl,
    downloadUrl: resolvePubPartsBrowserDownloadUrl(sourceUrl),
    canOpenDownload: true,
  }
}

export function resolveCatalogPubPartsDropboxChooserStatusRead(
  status: CatalogPubPartsDropboxChooserStatus | null,
): CatalogPubPartsDropboxChooserStatus {
  if (status === null) {
    return {
      state: 'idle',
      label: 'Open Source Options',
      description:
        'Add To Project opens the PubParts source options window for this link. Pick one, some, or all supported files, then ParaHook stages them in Import review with PubParts attribution.',
    }
  }

  return status
}

export function buildCatalogPubPartsImportedReferenceSourceAttribution(
  record: PubPartsStagedSourceRecord,
): ImportedReferenceSourceAttribution {
  return {
    sourceKind: 'external-catalog',
    providerId: record.providerId,
    providerName: record.providerName,
    catalogItemId: record.catalogItemId,
    catalogItemLabel: record.catalogItemLabel,
    sourceCollectionKey: record.sourceCollectionKey,
    sourceCollectionLabel: record.sourceCollectionLabel,
    sourceCandidateUrl: record.sourceCandidateUrl,
    linkedArchiveUrl: record.linkedArchiveUrl,
    sourcePageUrl: record.sourcePageUrl,
    externalItemUrl: record.externalItemUrl,
    sourceUrl: record.sourceUrl,
    previewImageUrl: record.previewImageUrl,
    sourceLastUpdated: record.sourceLastUpdated,
    archiveLastUpdated: record.archiveLastUpdated,
  }
}

function buildCatalogSelectedPubPartsImportHandoffAttribution(
  record: PubPartsStagedSourceRecord,
): CatalogSelectedPubPartsImportHandoffAttribution {
  return {
    providerId: record.providerId,
    providerName: record.providerName,
    catalogItemId: record.catalogItemId,
    catalogItemLabel: record.catalogItemLabel,
    sourceCollectionKey: record.sourceCollectionKey,
    sourceCollectionLabel: record.sourceCollectionLabel,
    sourceCandidateUrl: record.sourceCandidateUrl,
    linkedArchiveUrl: record.linkedArchiveUrl,
    sourcePageUrl: record.sourcePageUrl,
    externalItemUrl: record.externalItemUrl,
    sourceUrl: record.sourceUrl,
    previewImageUrl: record.previewImageUrl,
    sourceLastUpdated: record.sourceLastUpdated,
    archiveLastUpdated: record.archiveLastUpdated,
    sourceMetadata: record.sourceMetadata,
    binaryStatus: record.binaryStatus,
    importStatus: record.importStatus,
  }
}

export function resolveCatalogSelectedPubPartsImportHandoff(
  item: CatalogItemRecord,
  stagedRecord: PubPartsStagedSourceRecord | null = null,
): CatalogSelectedPubPartsImportHandoff {
  if (item.source.sourceKind !== 'external' || item.source.provider.providerId !== 'pubparts') {
    return {
      state: 'not-external-pubparts',
      label: 'No PubParts Import Handoff',
      description: 'This Catalog entry is not an external PubParts source entry.',
      selectedFileUrl: null,
      selectedFileType: null,
      selectedFile: null,
      sourceAttribution: null,
      importOwner: null,
      canCreateProjectAsset: false,
    }
  }

  if (stagedRecord === null || stagedRecord.catalogItemId !== item.itemId) {
    return {
      state: 'no-staged-source',
      label: 'No Staged Source For Import',
      description:
        'Stage and inspect a PubParts source link before selecting a supported file for import handoff.',
      selectedFileUrl: null,
      selectedFileType: null,
      selectedFile: null,
      sourceAttribution: null,
      importOwner: null,
      canCreateProjectAsset: false,
    }
  }

  const sourceAttribution = buildCatalogSelectedPubPartsImportHandoffAttribution(stagedRecord)
  const selectedSupportedFile = stagedRecord.selectedSupportedFile ?? null

  if (selectedSupportedFile === null) {
    return {
      state: 'no-selected-supported-file',
      label: 'No Selected File For Import',
      description:
        'Choose a supported direct source file before import handoff. Archive, shared-source, unsupported, and unknown records do not create import candidates by themselves.',
      selectedFileUrl: null,
      selectedFileType: null,
      selectedFile: null,
      sourceAttribution,
      importOwner: null,
      canCreateProjectAsset: false,
    }
  }

  if (selectedSupportedFile.fileExtension === 'stp') {
    return {
      state: 'selected-file-import-type-needs-import-support',
      label: 'Import Type Support Needed',
      description:
        'This selected PubParts .stp source file is preserved as source metadata, but the current Import reference path does not accept .stp yet. ParaHook has not downloaded it and has not imported it.',
      selectedFileUrl: selectedSupportedFile.sourceCandidateUrl,
      selectedFileType: selectedSupportedFile.fileExtension,
      selectedFile: selectedSupportedFile,
      sourceAttribution,
      importOwner: 'import-family',
      canCreateProjectAsset: false,
    }
  }

  if (CATALOG_CURRENT_IMPORT_HANDOFF_FILE_TYPES.has(selectedSupportedFile.fileExtension)) {
    return {
      state: 'selected-file-import-handoff-planned',
      label: 'Import Handoff Planned',
      description:
        'This selected PubParts source file is ready as source metadata for a future Import-family handoff. ParaHook has not downloaded the remote file, created an object URL, imported it, or added it to the project.',
      selectedFileUrl: selectedSupportedFile.sourceCandidateUrl,
      selectedFileType: selectedSupportedFile.fileExtension,
      selectedFile: selectedSupportedFile,
      sourceAttribution,
      importOwner: 'import-family',
      canCreateProjectAsset: false,
    }
  }

  return {
    state: 'no-selected-supported-file',
    label: 'No Selected File For Import',
    description:
      'The selected source metadata does not match a current Import-family handoff type.',
    selectedFileUrl: null,
    selectedFileType: null,
    selectedFile: null,
    sourceAttribution,
    importOwner: null,
    canCreateProjectAsset: false,
  }
}

export function shouldRenderCatalogPreviewMediaEagerly(item: CatalogItemRecord): boolean {
  const previewMedia = item.previewMedia[0] ?? null

  return (
    item.source.sourceKind === 'external' &&
    item.source.provider.providerId === 'pubparts' &&
    previewMedia?.mediaKind === 'image' &&
    previewMedia.src.trim().length > 0 &&
    item.source.previewImageUrl === previewMedia.src
  )
}

export const resolveCatalogSectionBrowseDescription = (
  sectionKey: string,
  browseMode: CatalogBrowseMode = 'part',
): string => {
  const browseModeLabel = resolveCatalogBrowseModeLabel(browseMode)

  switch (sectionKey) {
    case 'all':
      return `${browseModeLabel} read keeps the curated reference families visible without changing the shared Catalog truth.`
    case 'foothooks':
      return `${browseModeLabel} read keeps Foothooks browsing through the shared metadata contract instead of arriving as default Browser content.`
    case 'shoes':
      return `${browseModeLabel} read keeps Shoes browsing through the shared metadata contract instead of arriving as default Browser content.`
    case 'footpads':
      return `${browseModeLabel} read keeps Footpads browsing through the shared metadata contract instead of arriving as default Browser content.`
    case 'imports':
      return `Imports reuse stays separate from intake ownership while the ${browseModeLabel.toLowerCase()} read keeps previously uploaded items browsable without becoming Browser preload.`
    case 'hdris':
      return 'HDRI and EXR environments stay on their own viewer-owned apply path instead of pretending to be reference content.'
    default:
      return `${formatCatalogSectionLabel(sectionKey)} now browses here through the shared Catalog shell in ${browseModeLabel.toLowerCase()} read.`
  }
}

export const resolveCatalogGridIntroCopy = (
  activeSection: string,
  browseMode: CatalogBrowseMode = 'part',
): string => {
  if (activeSection === 'imports') {
    return `${resolveCatalogBrowseModeLabel(browseMode)} read keeps imports in the same shared content area as the curated catalog.`
  }

  return `${resolveCatalogSectionBrowseDescription(
    activeSection,
    browseMode,
  )} Click cards to build a selection. Double-click a card to open its full item page. Nothing auto-loads just because it is visible in the grid.`
}

export const resolveCatalogCardBrowseMeta = (
  item: CatalogItemRecord,
  browseMode: CatalogBrowseMode = 'part',
): string => {
  const previewSourceText = `${item.previewMedia.length} preview source${
    item.previewMedia.length === 1 ? '' : 's'
  } ready on demand`

  if (item.source.sourceKind === 'imports') {
    return item.source.catalogItemId
      ? `Imports reuse entry - remembered from Catalog - ${previewSourceText}`
      : `Imports reuse entry - ${previewSourceText}`
  }

  if (item.source.sourceKind === 'external') {
    const providerLabel = formatCatalogExternalProviderLabel(item)
    const collectionLabel =
      item.source.provider.sourceCollectionLabel ??
      item.source.provider.sourceCollectionKey ??
      'external source'
    return `External-linked ${providerLabel} entry - ${collectionLabel} - ${previewSourceText}`
  }

  if (item.source.sourceKind === 'planned') {
    return `Planned source entry - ${item.source.sourceLabel} - Add To Project imports source; preview and starting-configuration load unavailable`
  }

  if (item.assetKind === 'environment') {
    const format = item.metadata?.find((entry) => entry.label === 'Format')?.value ?? 'HDRI/EXR'
    return `Viewer environment family - ${format} - apply through the shared viewer owner`
  }

  if (isCatalogStartingAssemblyItem(item)) {
    const platformFamilyText =
      item.startingAssembly?.platformFamily ?? 'planned platform family'
    return `Starting assembly - ${platformFamilyText} - load-as-starting-configuration planned - ${previewSourceText}`
  }

  if (browseMode === 'platform') {
    const systemText = item.systemKey ?? 'Platform'
    const platformCompatibilityText =
      item.platformCompatibility?.join(', ') ?? 'local platform compatibility'
    const brandText = item.brand ?? 'Catalog'
    const productText = item.productName ?? item.label
    return `Platform read - ${systemText} - ${platformCompatibilityText} - ${brandText} - ${productText} - ${previewSourceText}`
  }

  const partTypeText = item.partType ?? formatCatalogFamilyLabel(item.familyKey)
  const positionText = item.position ?? 'unspecified position'
  const partGroupsText = item.partGroups?.join(', ') ?? 'local part groups'
  const productText = item.productName ?? item.label

  return `Part read - ${partTypeText} - ${positionText} - ${partGroupsText} - ${productText} - ${previewSourceText}`
}

export const resolveCatalogItemPageFamilyLabel = (item: CatalogItemRecord): string => {
  if (isCatalogStartingAssemblyItem(item)) {
    return 'Starting Assembly'
  }

  if (item.source.sourceKind === 'imports') {
    return 'Imports Reuse Entry'
  }

  if (item.source.sourceKind === 'external') {
    return `${formatCatalogExternalProviderLabel(item)} External Source`
  }

  if (item.source.sourceKind === 'planned') {
    return 'Planned Starting Assembly'
  }

  if (item.assetKind === 'environment') {
    return 'HDRI Environment'
  }

  return `Curated ${formatCatalogFamilyLabel(item.familyKey)} Family`
}

export const resolveCatalogItemPageFamilySummary = (item: CatalogItemRecord): string => {
  if (item.source.sourceKind === 'planned') {
    return 'Planned starting assemblies can show verified source truth and add their source file as project reference content without enabling heavy preview or load as starting configuration until later owners are wired.'
  }

  if (isCatalogStartingAssemblyItem(item)) {
    return 'Starting assemblies are planned full-build start records. Load as starting configuration remains unavailable until a downstream builder owner is wired.'
  }

  if (item.source.sourceKind === 'imports') {
    return item.source.catalogItemId
      ? 'Previously imported items can be inspected again here while still remembering which curated Catalog entry they originally came from.'
      : 'Previously imported items can be inspected again here without turning Catalog into the import-pipeline owner.'
  }

  if (item.source.sourceKind === 'external') {
    return `${formatCatalogExternalProviderLabel(item)} entries are external-linked source records for preview and source inspection; archive download, extraction, import, and compatibility mapping stay in later phases.`
  }

  if (item.assetKind === 'environment') {
    return 'HDRI and EXR environments stay viewer-owned and apply through the shared viewer environment seam instead of becoming project geometry content.'
  }

  switch (item.familyKey) {
    case 'foothooks':
      return 'Optional curated foothook references stay out of Browser until you explicitly add them to project content.'
    case 'shoes':
      return 'Optional curated shoe references stay out of Browser until you explicitly add them to project content.'
    case 'footpads':
      return 'Optional curated footpad references stay out of Browser until you explicitly add them to project content.'
    default:
      return `${formatCatalogFamilyLabel(item.familyKey)} references stay optional and commit only when you explicitly add them to project content.`
  }
}

export const resolveCatalogPrimaryActionLabel = (item: CatalogItemRecord): string => {
  switch (item.actionKind) {
    case 'add-to-project':
      return 'Add To Project'
    case 'apply-environment':
      return 'Apply Environment'
    case 'load-preview':
    default:
      return 'Load Preview'
  }
}

export function buildCatalogSectionOptions(
  snapshot: CatalogSourceSnapshot,
  browseMode: CatalogBrowseMode = 'part',
): CatalogSectionOption[] {
  const countsBySectionKey = new Map<string, number>()
  const orderedSectionKeys: string[] = []

  const incrementSectionCount = (sectionKey: string) => {
    if (!countsBySectionKey.has(sectionKey)) {
      orderedSectionKeys.push(sectionKey)
    }
    countsBySectionKey.set(sectionKey, (countsBySectionKey.get(sectionKey) ?? 0) + 1)
  }

  snapshot.repoItems.forEach((item) => {
    resolveCatalogBrowseSectionKeys(item, browseMode).forEach(incrementSectionCount)
  })

  snapshot.plannedItems.forEach((item) => {
    resolveCatalogBrowseSectionKeys(item, browseMode).forEach(incrementSectionCount)
  })

  snapshot.externalItems.forEach((item) => {
    resolveCatalogBrowseSectionKeys(item, browseMode).forEach(incrementSectionCount)
  })

  if (snapshot.importsItems.length > 0) {
    incrementSectionCount('imports')
  }

  return orderedSectionKeys.map((sectionKey) => ({
    sectionKey,
    label: sectionKey === 'imports' ? 'Imports' : formatCatalogSectionLabel(sectionKey),
    count: countsBySectionKey.get(sectionKey) ?? 0,
    description: resolveCatalogSectionBrowseDescription(sectionKey, browseMode),
  }))
}

export function buildCatalogFilterGroups(
  snapshot: CatalogSourceSnapshot,
  activeSection: string,
  searchText: string,
  browseMode: CatalogBrowseMode = 'part',
): CatalogFilterGroup[] {
  const searchFilteredItems = resolveCatalogSearchFilteredItems(
    resolveCatalogBaseItems(snapshot, activeSection, browseMode),
    searchText,
  )

  return CATALOG_FILTER_GROUP_DEFINITIONS.flatMap((definition) => {
    const countsByValue = new Map<string, number>()
    const orderedValues: string[] = []

    searchFilteredItems.forEach((item) => {
      definition.resolveValues(item).forEach((value) => {
        if (!countsByValue.has(value)) {
          orderedValues.push(value)
        }
        countsByValue.set(value, (countsByValue.get(value) ?? 0) + 1)
      })
    })

    if (orderedValues.length === 0) {
      return []
    }

    return [
      {
        groupKey: definition.groupKey,
        label: definition.label,
        description: definition.description,
        options: orderedValues.map((value) => ({
          value,
          count: countsByValue.get(value) ?? 0,
        })),
      },
    ]
  })
}

export function toggleCatalogFilterSelection(
  currentSelectedFilters: CatalogSelectedFilters,
  groupKey: CatalogFilterGroupKey,
  value: string,
): CatalogSelectedFilters {
  const currentGroupSelections = currentSelectedFilters[groupKey] ?? []
  const nextGroupSelections = currentGroupSelections.includes(value)
    ? currentGroupSelections.filter((candidateValue) => candidateValue !== value)
    : [...currentGroupSelections, value]

  if (nextGroupSelections.length === 0) {
    const { [groupKey]: _removedGroupSelections, ...nextSelectedFilters } = currentSelectedFilters
    return nextSelectedFilters
  }

  return {
    ...currentSelectedFilters,
    [groupKey]: nextGroupSelections,
  }
}

export function pruneCatalogFilterSelections(
  currentSelectedFilters: CatalogSelectedFilters,
  availableFilterGroups: CatalogFilterGroup[],
): CatalogSelectedFilters {
  const availableValuesByGroup = new Map<CatalogFilterGroupKey, Set<string>>(
    availableFilterGroups.map((group) => [
      group.groupKey,
      new Set(group.options.map((option) => option.value)),
    ]),
  )

  let hasChanges = false
  const nextSelectedFilters = Object.entries(currentSelectedFilters).reduce<CatalogSelectedFilters>(
    (nextFilters, [groupKey, selectedValues]) => {
      if (selectedValues === undefined) {
        return nextFilters
      }

      const availableValues = availableValuesByGroup.get(groupKey as CatalogFilterGroupKey)
      if (availableValues === undefined) {
        hasChanges = true
        return nextFilters
      }

      const nextGroupSelections = selectedValues.filter((value) => availableValues.has(value))
      if (nextGroupSelections.length !== selectedValues.length) {
        hasChanges = true
      }

      if (nextGroupSelections.length > 0) {
        nextFilters[groupKey as CatalogFilterGroupKey] = nextGroupSelections
      } else {
        hasChanges = true
      }

      return nextFilters
    },
    {},
  )

  const currentGroupKeys = Object.keys(currentSelectedFilters)
  if (
    !hasChanges &&
    currentGroupKeys.length === Object.keys(nextSelectedFilters).length &&
    currentGroupKeys.every((groupKey) => {
      const currentSelections = currentSelectedFilters[groupKey as CatalogFilterGroupKey] ?? []
      const nextSelections = nextSelectedFilters[groupKey as CatalogFilterGroupKey] ?? []
      return (
        currentSelections.length === nextSelections.length &&
        currentSelections.every((value, index) => value === nextSelections[index])
      )
    })
  ) {
    return currentSelectedFilters
  }

  return nextSelectedFilters
}

export function resolveCatalogSelectedFilterCount(selectedFilters: CatalogSelectedFilters): number {
  return Object.values(selectedFilters).reduce(
    (total, selectedValues) => total + (selectedValues?.length ?? 0),
    0,
  )
}

export function getCatalogVisibleItems(
  snapshot: CatalogSourceSnapshot,
  activeSection: string,
  searchText: string = '',
  selectedFilters: CatalogSelectedFilters = {},
  browseMode: CatalogBrowseMode = 'part',
): CatalogItemRecord[] {
  return resolveCatalogSearchFilteredItems(
    resolveCatalogBaseItems(snapshot, activeSection, browseMode).filter((item) =>
      matchesCatalogSelectedFilters(item, selectedFilters),
    ),
    searchText,
  )
}

export function buildCatalogTagOptions(
  snapshot: CatalogSourceSnapshot,
  activeSection: string,
  searchText: string,
  browseMode: CatalogBrowseMode = 'part',
): CatalogFilterGroup[] {
  return buildCatalogFilterGroups(snapshot, activeSection, searchText, browseMode)
}

export function resolveCatalogSearchPlaceholder(
  activeSection: string,
  browseMode: CatalogBrowseMode = 'part',
): string {
  if (activeSection === 'imports') {
    return 'Search imported reuse entries, notes, and metadata'
  }

  if (activeSection === 'hdris') {
    return 'Search HDRIs, tags, notes, and environment metadata'
  }

  if (browseMode === 'platform') {
    return 'Search systems, compatibility, notes, and metadata'
  }

  return 'Search part types, product names, groups, notes, and metadata'
}

export function resolveCatalogResultsSummary(
  visibleCount: number,
  activeSection: string,
  selectedFilterCount: number,
  searchText: string,
  browseMode: CatalogBrowseMode = 'part',
): string {
  const sectionLabel = activeSection === 'all' ? 'catalog' : formatCatalogSectionLabel(activeSection)
  const searchState =
    searchText.trim().length === 0 ? 'No text filter.' : `Search active for "${searchText.trim()}".`
  const filterState =
    selectedFilterCount === 0
      ? 'No local taxonomy filters.'
      : `${selectedFilterCount} local taxonomy filter${selectedFilterCount === 1 ? '' : 's'} active.`
  const browseLabel = resolveCatalogBrowseModeLabel(browseMode)

  return `${visibleCount} visible result${visibleCount === 1 ? '' : 's'} in ${browseLabel} read for ${sectionLabel}. ${searchState} ${filterState}`
}
