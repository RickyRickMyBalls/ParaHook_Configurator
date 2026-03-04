import type { ProductId } from '../../shared/productSchema'
import type { PartArtifact } from '../../shared/partsTypes'
import { buildFoothookParts } from '../products/foothook/buildFoothook'

const createGenericPart = (product: ProductId, seed: number): PartArtifact => ({
  id: `${product}-${seed}`,
  label: `${product} body`,
  order: 0,
})

export const assembleStages = (
  product: ProductId,
  profile: Record<string, unknown>,
): PartArtifact[] => {
  if (product === 'foothook') {
    return buildFoothookParts(profile)
  }

  const seed = JSON.stringify(profile).length
  return [createGenericPart(product, seed)]
}
