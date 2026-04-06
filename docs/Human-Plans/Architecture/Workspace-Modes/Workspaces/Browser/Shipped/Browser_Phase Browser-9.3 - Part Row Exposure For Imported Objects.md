# Browser-9.3 - Part Row Exposure For Imported Objects

## Summary

Exposed truthful child `Part` rows under imported objects when the loaded source already contains real internal part structure, while keeping object ownership and current imported-object transform compatibility intact.

Shipped result:
- imported object rows can now expand to show child `Part` rows when the loaded reference contains multiple real leaf parts
- flat imported objects still stay flat and do not invent synthetic parts
- imported-object rows keep the darker/static object treatment above their part children
- Browser part rows stay Browser-local in this pass, so current reference transform and generated-content part selection semantics are not forced to converge early

## What Landed

- added a viewer-side reference-part descriptor seam that derives part descriptors from the real loaded reference `Object3D` hierarchy
- stored those descriptors in reference workspace state so Browser can render them as child rows under landed imported objects
- expanded Browser content-tree derivation so imported reference-backed object rows can become expandable when real part rows exist
- kept imported-object transform ownership on the parent object row instead of promoting part rows into the current shared workspace target model
- hardened top-level assembly row derivation to tolerate legacy root assemblies whose `parentAssemblyId` is absent instead of explicitly `null`

## Notes

This shipped phase intentionally stops short of:
- synthetic part creation for flat imports
- shared object-transform backend convergence
- making imported-object part rows first-class workspace `part` targets
