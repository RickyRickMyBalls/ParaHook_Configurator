import type { PubPartsRawResourceRecord } from '../pubPartsSource'

export const PUB_PARTS_RESOURCES_SOURCE_URL = 'https://pubparts.xyz/resources.json'
export const PUB_PARTS_RESOURCES_CACHED_AT = '2026-04-20'

export const PUB_PARTS_RESOURCE_RECORDS = [
  {
    title: 'ADV 3d Printed List',
    typeOfResource: ['Spreadsheet'],
    externalUrl: 'https://docs.google.com/spreadsheets/d/1mq-P3KeisLS-J33Qv6TXYyChz70qhU_axgL4iG-yIJk/edit',
    description: '3d parts and accessories for the Floatwheel ADV platform',
  },
] as const satisfies readonly PubPartsRawResourceRecord[]
