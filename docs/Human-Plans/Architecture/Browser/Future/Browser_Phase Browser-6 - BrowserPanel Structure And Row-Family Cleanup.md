# Browser Phase Browser-6 - BrowserPanel Structure And Row-Family Cleanup

## Doc Header

### Doc History
1. 2026-03-24 13:11: Created this standalone future Browser phase doc so the later BrowserPanel structure and row-family cleanup now has its own planning home under `Browser/Future/` instead of staying folded into the Browser umbrella note only

### Purpose

This phase reduces BrowserPanel overload and clarifies row-family behavior.

Use it to answer:
- how BrowserPanel should be decomposed
- how row VMs and row behavior should be separated
- how graph/content/reference/sketch/viewport rows should follow clearer shared rules

## Doc Body

## [ ] Browser-6 - BrowserPanel Structure And Row-Family Cleanup

Summary:
- shrink BrowserPanel overload
- separate Browser row VM generation from row behavior more cleanly
- make row-family rules easier to reason about and extend

Owns:
- BrowserPanel structure cleanup
- row-family consistency standards
- reducing inline row-kind special cases

