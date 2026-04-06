# Browser-9.1 - Reference Tree Convergence Baseline

## Summary

Converged the older special Browser `References` tree toward the same standard hierarchy language used by authored Browser content, while preserving current reference-transform compatibility.

Shipped result:
- `References` now reads as the assembly-like root in Browser
- `Footpads`, `Shoes`, and `Premade Foothooks` now read as component-like rows
- reference items now read as object-like rows
- Browser keeps the old reference/item target identities underneath so current reference-transform flows continue to work
- imported/reference-backed rows remain visually distinct from generated/build-driven content rows

## What Landed

- Browser reference root/category/item rows now use assembly/component/object-style icon language:
  - `References` -> `A`
  - categories -> `C`
  - reference items -> `O`
- Browser row descriptions now describe those rows through normal hierarchy language instead of `reference/category/item` wording
- the Browser tree still preserves the current reference target identities behind the scenes, so the transform/session plumbing is not forced to migrate in the same pass

## Notes

This shipped phase intentionally converges the Browser tree language first without also forcing:
- import landing redesign
- part-row exposure
- shared object-transform backend convergence
