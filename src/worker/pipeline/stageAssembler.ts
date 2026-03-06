import type { ProductId } from '../../shared/productSchema'
import type { PartArtifact } from '../../shared/partsTypes'
import { buildFoothookParts } from '../products/foothook/buildFoothook'

const createGenericPart = (product: ProductId, seed: number): PartArtifact => ({
  id: `${product}-${seed}`,
  label: `${product} body`,
  kind: 'box',
  params: {
    length: 1,
    width: 1,
    height: 1,
  },
  partKeyStr: `${product}-${seed}`,
  partKey: {
    id: `${product}-${seed}`,
    instance: null,
  },
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
