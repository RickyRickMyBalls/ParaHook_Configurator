export const recentItemsStorageSnapshotKey = 'parahook.recentItems.workingSet.v1'
export const recentItemsStoragePolicyKey = 'parahook.recentItems.policy.v1'
export const recentItemsStoragePolicyChangedEvent = 'parahook:recent-items-policy-changed'
export const defaultRecentItemsLimit = 12

export type RecentItemOwner = 'workspace' | 'graph' | 'browser'

export type RecentItemTarget = {
  owner: RecentItemOwner
  targetId: string
}

export type RecentItem = {
  itemId: string
  label: string
  target: RecentItemTarget
  updatedAt: string
}

export type RecentItemsSnapshot = {
  version: 1
  itemsById: Record<string, RecentItem>
  itemOrder: string[]
  activeItemId: string | null
}

export type RecentItemsPolicy = {
  version: 1
  rememberRecentItems: boolean
}

export type RecentItemsStorageBucketDescriptor = {
  id: 'recent-items'
  label: 'Recent items'
  storageKey: typeof recentItemsStorageSnapshotKey
  ownerSeam: 'src/app/recentItems/recentItemsPersistence.ts'
}

type StorageLike = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

type RecentItemsSnapshotSource = Pick<
  RecentItemsSnapshot,
  'itemsById' | 'itemOrder' | 'activeItemId'
>

export const recentItemsStorageBucketDescriptor: RecentItemsStorageBucketDescriptor = {
  id: 'recent-items',
  label: 'Recent items',
  storageKey: recentItemsStorageSnapshotKey,
  ownerSeam: 'src/app/recentItems/recentItemsPersistence.ts',
}

export const defaultRecentItemsPolicy: RecentItemsPolicy = {
  version: 1,
  rememberRecentItems: true,
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const getBrowserStorage = (): StorageLike | null => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }
  return window.localStorage
}

const normalizeText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

const normalizeRecentItemTarget = (value: unknown): RecentItemTarget | null => {
  if (!isRecord(value)) {
    return null
  }
  const owner = value.owner
  if (owner !== 'workspace' && owner !== 'graph' && owner !== 'browser') {
    return null
  }
  const targetId = normalizeText(value.targetId)
  if (targetId.length === 0) {
    return null
  }
  return {
    owner,
    targetId,
  }
}

const normalizeRecentItem = (itemId: string, value: unknown): RecentItem | null => {
  if (!isRecord(value)) {
    return null
  }
  const normalizedItemId = normalizeText(value.itemId) || itemId.trim()
  if (normalizedItemId.length === 0) {
    return null
  }
  const target = normalizeRecentItemTarget(value.target)
  if (target === null) {
    return null
  }
  const label = normalizeText(value.label)
  const updatedAt = normalizeText(value.updatedAt)
  return {
    itemId: normalizedItemId,
    label: label.length > 0 ? label : target.targetId,
    target,
    updatedAt: updatedAt.length > 0 ? updatedAt : '1970-01-01T00:00:00.000Z',
  }
}

const cloneRecentItem = (item: RecentItem): RecentItem => ({
  itemId: item.itemId,
  label: item.label,
  target: {
    owner: item.target.owner,
    targetId: item.target.targetId,
  },
  updatedAt: item.updatedAt,
})

const normalizeLimit = (limit: number): number =>
  Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : defaultRecentItemsLimit

export const serializeRecentItemsSnapshot = (
  source: RecentItemsSnapshotSource,
  limit = defaultRecentItemsLimit,
): RecentItemsSnapshot => {
  const itemOrder = source.itemOrder.filter(
    (itemId, index, order) =>
      typeof itemId === 'string' &&
      itemId.length > 0 &&
      order.indexOf(itemId) === index &&
      source.itemsById[itemId] !== undefined,
  )
  for (const itemId of Object.keys(source.itemsById).sort((left, right) => left.localeCompare(right))) {
    if (!itemOrder.includes(itemId)) {
      itemOrder.push(itemId)
    }
  }
  const boundedOrder = itemOrder.slice(0, normalizeLimit(limit))
  const itemsById: Record<string, RecentItem> = {}
  for (const itemId of boundedOrder) {
    itemsById[itemId] = cloneRecentItem(source.itemsById[itemId])
  }
  const activeItemId =
    source.activeItemId !== null && itemsById[source.activeItemId] !== undefined
      ? source.activeItemId
      : boundedOrder[0] ?? null
  return {
    version: 1,
    itemsById,
    itemOrder: boundedOrder,
    activeItemId,
  }
}

export const normalizeRecentItemsSnapshot = (value: unknown): RecentItemsSnapshot | null => {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.itemsById)) {
    return null
  }
  if (!Array.isArray(value.itemOrder)) {
    return null
  }
  const itemsById: Record<string, RecentItem> = {}
  for (const [itemId, rawItem] of Object.entries(value.itemsById)) {
    const item = normalizeRecentItem(itemId, rawItem)
    if (item !== null) {
      itemsById[item.itemId] = item
    }
  }
  const itemOrder = value.itemOrder.filter(
    (itemId, index, order): itemId is string =>
      typeof itemId === 'string' &&
      itemId.length > 0 &&
      order.indexOf(itemId) === index &&
      itemsById[itemId] !== undefined,
  )
  for (const itemId of Object.keys(itemsById).sort((left, right) => left.localeCompare(right))) {
    if (!itemOrder.includes(itemId)) {
      itemOrder.push(itemId)
    }
  }
  if (itemOrder.length === 0) {
    return null
  }
  const activeItemId =
    typeof value.activeItemId === 'string' && itemsById[value.activeItemId] !== undefined
      ? value.activeItemId
      : itemOrder[0]
  return serializeRecentItemsSnapshot({
    itemsById,
    itemOrder,
    activeItemId,
  })
}

export const readRecentItemsSnapshot = (
  storage: StorageLike | null = getBrowserStorage(),
): RecentItemsSnapshot | null => {
  if (storage === null) {
    return null
  }
  try {
    const rawValue = storage.getItem(recentItemsStorageSnapshotKey)
    if (rawValue === null || rawValue.length === 0) {
      return null
    }
    return normalizeRecentItemsSnapshot(JSON.parse(rawValue))
  } catch {
    return null
  }
}

export const writeRecentItemsSnapshot = (
  snapshot: RecentItemsSnapshot,
  storage: StorageLike | null = getBrowserStorage(),
): void => {
  if (storage === null) {
    return
  }
  try {
    storage.setItem(recentItemsStorageSnapshotKey, JSON.stringify(snapshot))
  } catch {
    // Ignore write failures so recent-items persistence never blocks active work.
  }
}

export const clearRecentItemsSnapshot = (
  storage: StorageLike | null = getBrowserStorage(),
): void => {
  if (storage === null) {
    return
  }
  try {
    storage.removeItem(recentItemsStorageSnapshotKey)
  } catch {
    // Ignore storage failures so a future forget control can stay non-blocking.
  }
}

export const normalizeRecentItemsPolicy = (value: unknown): RecentItemsPolicy => ({
  version: 1,
  rememberRecentItems:
    isRecord(value) && typeof value.rememberRecentItems === 'boolean'
      ? value.rememberRecentItems
      : defaultRecentItemsPolicy.rememberRecentItems,
})

export const readRecentItemsPolicy = (
  storage: StorageLike | null = getBrowserStorage(),
): RecentItemsPolicy => {
  if (storage === null) {
    return defaultRecentItemsPolicy
  }
  try {
    const rawValue = storage.getItem(recentItemsStoragePolicyKey)
    if (rawValue === null || rawValue.length === 0) {
      return defaultRecentItemsPolicy
    }
    return normalizeRecentItemsPolicy(JSON.parse(rawValue))
  } catch {
    return defaultRecentItemsPolicy
  }
}

export const writeRecentItemsPolicy = (
  policy: RecentItemsPolicy,
  storage: StorageLike | null = getBrowserStorage(),
): void => {
  if (storage === null) {
    return
  }
  try {
    storage.setItem(recentItemsStoragePolicyKey, JSON.stringify(policy))
  } catch {
    // Ignore policy write failures; the Home Page control can still update locally.
  }
}

const dispatchRecentItemsPolicyChanged = (policy: RecentItemsPolicy): void => {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
    return
  }
  window.dispatchEvent(
    new CustomEvent(recentItemsStoragePolicyChangedEvent, {
      detail: policy,
    }),
  )
}

export const setRecentItemsRememberEnabled = (
  rememberRecentItems: boolean,
  storage: StorageLike | null = getBrowserStorage(),
): RecentItemsPolicy => {
  const policy: RecentItemsPolicy = {
    version: 1,
    rememberRecentItems,
  }
  writeRecentItemsPolicy(policy, storage)
  if (!rememberRecentItems) {
    clearRecentItemsSnapshot(storage)
  }
  dispatchRecentItemsPolicyChanged(policy)
  return policy
}

export const upsertRecentItem = (
  snapshot: RecentItemsSnapshot | null,
  item: RecentItem,
  limit = defaultRecentItemsLimit,
): RecentItemsSnapshot => {
  const normalizedItem = normalizeRecentItem(item.itemId, item)
  const source = snapshot ?? {
    version: 1,
    itemsById: {},
    itemOrder: [],
    activeItemId: null,
  }
  if (normalizedItem === null) {
    return serializeRecentItemsSnapshot(source, limit)
  }
  return serializeRecentItemsSnapshot(
    {
      itemsById: {
        ...source.itemsById,
        [normalizedItem.itemId]: normalizedItem,
      },
      itemOrder: [
        normalizedItem.itemId,
        ...source.itemOrder.filter((itemId) => itemId !== normalizedItem.itemId),
      ],
      activeItemId: normalizedItem.itemId,
    },
    limit,
  )
}
