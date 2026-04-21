import type { PubPartsRawPartRecord } from '../pubPartsSource'

export const PUB_PARTS_ALL_PARTS_SOURCE_URL = 'https://pubparts.xyz/parts.json'
export const PUB_PARTS_ALL_PARTS_CACHED_AT = '2026-04-20'

export const PUB_PARTS_ALL_PARTS_RECORDS = [
  {
    title: '3d Printed Gripples',
    fabricationMethod: ['3d Printed'],
    typeOfPart: ['Footpad Attachment'],
    imageSrc: 'https://media.printables.com/media/prints/598759/images/4771812_7f901f92-4361-45f4-8527-f2138176b0cc_2b4d4f70-7556-4a39-9213-6cec593be284/thumbs/inside/1280x960/jpg/pxl_20230930_171633812.webp',
    platform: ['Miscellaneous Items'],
    externalUrl: 'https://www.printables.com/model/598759',
    dropboxUrl: 'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
    dropboxZipLastUpdated: '2024-11-16',
  },
] as const satisfies readonly PubPartsRawPartRecord[]
