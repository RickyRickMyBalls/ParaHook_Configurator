import { describe, expect, it } from 'vitest'
import { readCatalogRepoEnvironmentOptions } from './catalogEnvironmentInventory'

describe('catalogEnvironmentInventory', () => {
  it('lists the repo-backed HDRI and EXR environments for Properties source controls', () => {
    expect(readCatalogRepoEnvironmentOptions()).toEqual([
      {
        label: 'Citrus Orchard Road Puresky 2K',
        assetPath: '/ParaHook_Configurator/HDRI/citrus_orchard_road_puresky_2k.exr',
        fileType: 'exr',
      },
      {
        label: 'Docklands 02 2K',
        assetPath: '/ParaHook_Configurator/HDRI/docklands_02_2k.hdr',
        fileType: 'hdr',
      },
      {
        label: 'Rogland Clear Night 2K',
        assetPath: '/ParaHook_Configurator/HDRI/rogland_clear_night_2k.hdr',
        fileType: 'hdr',
      },
      {
        label: 'Studio Small 09 2K EXR',
        assetPath: '/ParaHook_Configurator/HDRI/studio_small_09_2k.exr',
        fileType: 'exr',
      },
      {
        label: 'Studio Small 09 2K HDR',
        assetPath: '/ParaHook_Configurator/HDRI/studio_small_09_2k.hdr',
        fileType: 'hdr',
      },
    ])
  })
})
