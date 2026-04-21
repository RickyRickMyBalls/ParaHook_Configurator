import type { PubPartsRawPartRecord } from '../pubPartsSource'

export const PUB_PARTS_GT_PARTS_SOURCE_URL = 'https://pubparts.xyz/parts/gt.json'
export const PUB_PARTS_GT_PARTS_CACHED_AT = '2026-04-20'

export const PUB_PARTS_GT_PARTS_RECORDS = [
  {
    title: 'Celeste: Stock Controller Box Gasket',
    fabricationMethod: ['3d Printed'],
    typeOfPart: ['Gasket', 'Controller Box'],
    imageSrc: 'https://media.printables.com/media/prints/919483/images/7018416_1b0e6aed-f664-435b-a98c-965818ff9e01_af6fb348-20d1-4f38-85d3-a96b1c6f4743/thumbs/inside/1280x960/jpeg/img_0609.webp',
    platform: ['GT/GT-S'],
    externalUrl: 'https://www.printables.com/model/919483',
    dropboxUrl: 'https://www.dropbox.com/scl/fi/6n3fasa6g0oam9srgi4qh/onewheel-gt-controller-box-gasket-model_files.zip?rlkey=sns2p0a6n5qdxkruqfo4jgzmm&st=xb6yjzx4&dl=0',
    dropboxZipLastUpdated: '2024-08-28',
  },
  {
    title: 'FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs',
    fabricationMethod: ['3d Printed'],
    typeOfPart: ['Rim Saver'],
    imageSrc: 'https://media.printables.com/media/prints/1207270/images/9067137_6e3cb25e-35e8-4ad5-8acd-cf325702863d_8bc31f64-1368-4943-9aa0-f7861103cae6/thumbs/inside/1280x960/jpg/1000003801.webp',
    platform: ['Floatwheel', 'GT/GT-S', 'Pint/X/S', 'XR Classic', 'XR/Funwheel'],
    externalUrl: 'https://www.printables.com/model/1207270',
    dropboxUrl: 'https://www.dropbox.com/scl/fi/vbl66ojz68jrhmoq9iuib/floatnlc-rimmy-one-wheel-rim-protection-for-6-and-65-hubs-model_files-1.zip?rlkey=41s5zalhowpc65gcg7aakynca&st=jh4569t8&dl=0',
    dropboxZipLastUpdated: '2025-03-24',
  },
] as const satisfies readonly PubPartsRawPartRecord[]
