import { CATALOG_REPO_SEED_ITEMS } from './catalogSeedItems'
import { resolveCatalogPreviewMediaSrc, type CatalogEnvironmentFileType } from './catalogItemContract'

export type CatalogRepoEnvironmentOption = {
  label: string
  assetPath: string
  fileType: CatalogEnvironmentFileType
}

export const readCatalogRepoEnvironmentOptions = (): CatalogRepoEnvironmentOption[] =>
  CATALOG_REPO_SEED_ITEMS.flatMap((item) => {
    if (
      item.assetKind !== 'environment' ||
      item.actionKind !== 'apply-environment' ||
      item.familyKey !== 'environments'
    ) {
      return []
    }

    const normalizedAssetPath = item.assetPath.trim().toLowerCase()
    const fileType = (['hdr', 'exr'] as const).find((candidateFileType) =>
      normalizedAssetPath.endsWith(`.${candidateFileType}`),
    )
    if (fileType === undefined) {
      return []
    }

    return [
      {
        label: item.label,
        assetPath: resolveCatalogPreviewMediaSrc(item.assetPath),
        fileType,
      },
    ]
  })
