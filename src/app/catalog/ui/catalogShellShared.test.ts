import { describe, expect, it } from 'vitest'
import { createCatalogSourceSnapshot } from '../catalogSource'
import {
  buildCatalogFilterGroups,
  getCatalogVisibleItems,
  resolveCatalogSelectedFilterCount,
  type CatalogSelectedFilters,
} from './catalogShellShared'

describe('catalogShellShared grouped filter semantics', () => {
  it('builds grouped local taxonomy filter options from the live catalog snapshot', () => {
    const snapshot = createCatalogSourceSnapshot()

    const filterGroups = buildCatalogFilterGroups(snapshot, 'all', '', 'part')

    expect(filterGroups.map((group) => group.label)).toEqual(
      expect.arrayContaining([
        'Platform Compatibility',
        'Part Type',
        'Part Groups',
        'System',
        'Brand',
      ]),
    )

    expect(
      filterGroups.find((group) => group.groupKey === 'platformCompatibility')?.options.map((option) => option.value),
    ).toEqual(expect.arrayContaining(['ADV', 'XR', 'GT', 'Pint', 'XR Classic']))
    expect(
      filterGroups.find((group) => group.groupKey === 'partGroups')?.options.map((option) => option.value),
    ).toEqual(expect.arrayContaining(['Shoes', 'FootHolds', 'Footpads']))
  })

  it('keeps OR inside one group and AND across groups while leaving search as a separate gate', () => {
    const snapshot = createCatalogSourceSnapshot()

    const orWithinOneGroup: CatalogSelectedFilters = {
      partGroups: ['Shoes', 'FootHolds'],
    }
    const andAcrossGroups: CatalogSelectedFilters = {
      platformCompatibility: ['XR'],
      partType: ['Shoe'],
      brand: ['Vans'],
    }
    const impossibleFilters: CatalogSelectedFilters = {
      ...andAcrossGroups,
      partGroups: ['FootHolds'],
    }

    expect(resolveCatalogSelectedFilterCount(orWithinOneGroup)).toBe(2)
    expect(
      getCatalogVisibleItems(snapshot, 'all', '', orWithinOneGroup, 'part').map((item) => item.label),
    ).toEqual(
      expect.arrayContaining([
        'Shoe 1',
        'Shoe 2',
        'Shoe 3',
        'Vans High Top Low',
        'Large Foothook',
        'Medium Foothook',
        'Small Foothook',
        'XL Foothook',
      ]),
    )
    expect(getCatalogVisibleItems(snapshot, 'all', '', orWithinOneGroup, 'part')).toHaveLength(8)

    expect(resolveCatalogSelectedFilterCount(andAcrossGroups)).toBe(3)
    expect(getCatalogVisibleItems(snapshot, 'all', '', andAcrossGroups, 'part')).toEqual([
      expect.objectContaining({
        itemId: 'reference:vans-high-top-low',
        label: 'Vans High Top Low',
      }),
    ])
    expect(getCatalogVisibleItems(snapshot, 'all', '', impossibleFilters, 'part')).toHaveLength(0)

    expect(
      getCatalogVisibleItems(snapshot, 'all', 'High Top', andAcrossGroups, 'part').map((item) => item.label),
    ).toEqual(['Vans High Top Low'])
    expect(getCatalogVisibleItems(snapshot, 'all', 'Shoe 1', andAcrossGroups, 'part')).toHaveLength(0)
  })
})
