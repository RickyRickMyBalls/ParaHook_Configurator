import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PUB_PARTS_FULL_PARTS_SOURCE_URL = 'https://pubparts.xyz/parts.json'
const OUTPUT_RELATIVE_PATH = 'src/app/catalog/pubpartsSourceData/fullParts.ts'
const RAW_PART_FIELDS = [
  'title',
  'fabricationMethod',
  'typeOfPart',
  'imageSrc',
  'platform',
  'externalUrl',
  'dropboxUrl',
  'dropboxZipLastUpdated',
]

function readString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function readStringList(value) {
  if (typeof value === 'string') {
    const item = readString(value)
    return item.length > 0 ? [item] : []
  }

  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => readString(item))
    .filter((item) => item.length > 0)
}

function readMetadataKey(value) {
  return readStringList(value).join(', ').toLowerCase()
}

function readDedupeKey(record) {
  const externalUrl = readString(record.externalUrl)
  if (externalUrl.length > 0) {
    return `external:${externalUrl.toLowerCase()}`
  }

  const dropboxUrl = readString(record.dropboxUrl)
  if (dropboxUrl.length > 0) {
    return `archive:${dropboxUrl.toLowerCase()}`
  }

  return [
    'fallback',
    readString(record.title).toLowerCase(),
    readMetadataKey(record.typeOfPart),
    readMetadataKey(record.platform),
  ].join(':')
}

function sanitizeRecord(record) {
  const sanitized = {}

  for (const field of RAW_PART_FIELDS) {
    if (!(field in record)) {
      continue
    }

    const value = record[field]
    if (typeof value === 'string') {
      const item = readString(value)
      if (item.length > 0) {
        sanitized[field] = item
      }
      continue
    }

    if (Array.isArray(value)) {
      const items = readStringList(value)
      if (items.length > 0) {
        sanitized[field] = items
      }
    }
  }

  return sanitized
}

function sortRecords(records) {
  return [...records].sort((left, right) => {
    const leftKey = readDedupeKey(left)
    const rightKey = readDedupeKey(right)
    if (leftKey !== rightKey) {
      return leftKey.localeCompare(rightKey)
    }

    return readString(left.title).localeCompare(readString(right.title))
  })
}

function formatValue(value, indent) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => JSON.stringify(item)).join(', ')}]`
  }

  return JSON.stringify(value)
}

function formatRecord(record) {
  const lines = ['  {']

  for (const field of RAW_PART_FIELDS) {
    if (field in record) {
      lines.push(`    ${field}: ${formatValue(record[field])},`)
    }
  }

  lines.push('  }')
  return lines.join('\n')
}

function formatModule(records, cachedAt) {
  return `import type { PubPartsRawPartRecord } from '../pubPartsSource'

export const PUB_PARTS_FULL_PARTS_SOURCE_URL = '${PUB_PARTS_FULL_PARTS_SOURCE_URL}'
export const PUB_PARTS_FULL_PARTS_CACHED_AT = '${cachedAt}'

export const PUB_PARTS_FULL_PARTS_RECORDS = [
${records.map(formatRecord).join(',\n')}
] as const satisfies readonly PubPartsRawPartRecord[]
`
}

async function main() {
  const response = await fetch(PUB_PARTS_FULL_PARTS_SOURCE_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${PUB_PARTS_FULL_PARTS_SOURCE_URL}: ${response.status}`)
  }

  const payload = await response.json()
  if (!Array.isArray(payload)) {
    throw new Error('Expected PubParts parts endpoint to return an array')
  }

  const records = sortRecords(payload.map(sanitizeRecord))
  const cachedAt = new Date().toISOString().slice(0, 10)
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
  const outputPath = path.join(repoRoot, OUTPUT_RELATIVE_PATH)

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, formatModule(records, cachedAt))

  console.log(`Wrote ${records.length} PubParts part records to ${OUTPUT_RELATIVE_PATH}`)
}

await main()
