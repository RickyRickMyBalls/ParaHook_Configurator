# Browser Phase Browser-8.8.2 - Target Clarity And Trust Tuning

## Doc Header

### Doc History
3. 2026-03-28 15:28: Marked `Browser-8.8.2 - Target Clarity And Trust Tuning` shipped after tightening Browser drag target trust around filtered-row mapping, exact gap-band bias, nearest-legal fallback for illegal middle-band object hovers, and test-harness legality alignment while keeping the simpler `8.8.1` visible drag grammar intact
2. 2026-03-28 15:13: Tightened `Browser-8.8.2 - Target Clarity And Trust Tuning` into a more implementation-ready Browser follow-on by locking the exact trust-tuning scope around row-band boundaries, nearest-legal fallback, collapsed-owner readability, and a sharper verification matrix, while keeping the simpler `8.8.1` visible drag grammar intact
1. 2026-03-28 21:14: Created this standalone future Browser phase doc so the Browser drag restart now has a dedicated second-step tuning surface for improving target clarity and user trust only after the simpler `8.8.1` rearrange baseline feels correct

### Purpose

This phase follows shipped `Browser-8.8.1`.

Use it to:
- tune the simpler drag baseline until it feels trustworthy
- improve target clarity without reintroducing fake-tree complexity

## Doc Body

## [x] Browser-8.8.2 - Target Clarity And Trust Tuning

### Summary

Improve the clarity and trustworthiness of the simplified Browser drag target feedback.

Phase outcome:
- insert-line placement feels exact
- `into` owner highlight reads clearly
- invalid-target feedback is easier to understand
- collapsed-owner targeting stays readable

Shipped result:
- Browser drag now resolves hovered content rows by stable `rowId` instead of reusing filtered row-metric indices against the full content tree, which prevents reorder targets from drifting when some rows are omitted from geometry collection
- exact midpoint releases inside a vertical gap now bias toward the lower row, keeping gap hover and gap release behavior aligned instead of snapping back to the earlier row
- illegal middle-band `into` hovers on object rows now resolve to the nearest legal reorder intent instead of being treated as valid `into` targets
- the Browser panel regression harness now mirrors real store legality more closely by allowing object-to-object reorder only for `before` / `after`, while object-to-component `into` stays the explicit reparent path

### Owns

- target-indicator clarity
- insert-line positioning polish
- owner-highlight readability
- invalid-target feedback polish
- collapsed-owner feedback tuning

### Does Not Own

- richer fake-tree preview
- heavier motion polish
- depth-lane interaction
- new legality behavior

### Locked Direction

- keep the visible model simple:
  - dragged row
  - insert line
  - owner highlight
- do not widen drag intelligence yet:
  - no richer hierarchy preview
  - no depth-lane interaction
  - no heavier motion ownership
- improve:
  - insert-line placement accuracy
  - owner-highlight clarity
  - invalid-target readability
  - collapsed-owner readability
- tune the trust seams that make the current system feel inconsistent:
  - top/middle/bottom band boundaries on hovered rows
  - gap-to-row transitions when the pointer sits near row edges
  - when Browser should keep the current intent versus switch to the nearest legal one
  - when Browser should surface explicit invalid feedback instead of guessing
- keep the fallback rule explicit:
  - if the current hovered band is illegal but the row has one nearby legal intent, resolve to that nearest legal intent
  - if the row has no legal intent, show invalid-target feedback and never fake a likely drop
- for collapsed valid owners:
  - keep `into` readable without making it look like `before` / `after`
  - improve the distinction through highlight treatment, not placeholder branches
- do not add back hidden-source-row or duplicate-branch behavior here

### Implementation Targets

Primary seams:
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserContentDrag.ts`
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/theme/surfaces/browser.css`

Supporting verification:
- `src/app/panels/BrowserPanel.test.tsx`

Primary code-shape expectation:
- `useBrowserPanelController.ts`
  - keeps the pointer/session lifecycle stable while exposing cleaner hovered-band inputs to the resolver
- `browserContentDrag.ts`
  - owns the trust-tuning rules for band boundaries, nearest-legal fallback, and invalid resolution
- `browserTreeRowPresenter.tsx`
  - keeps row-level `before` / `after` / `into` feedback visually distinct and calm
- `browser.css`
  - sharpens insert-line placement and owner-highlight contrast without adding richer preview systems

### Checklist

- tune insert-line position accuracy
- tune band boundary behavior near row edges
- tune nearest-legal fallback behavior
- tune `into` owner highlight clarity
- tune invalid-target treatment
- tune collapsed-owner targeting readability
- keep visible drag grammar simple

### Test Plan

- insert-line lands where the user expects for same-parent reorder
- row-edge hover does not flicker unpredictably between `before`, `into`, and `after`
- when a hovered band is illegal but one nearby legal intent exists, Browser resolves to that nearest legal intent consistently
- when no legal intent exists for the hovered row, Browser stays invalid and never falsely commits
- `into` highlight is distinct from `before` / `after`
- invalid targets render clear feedback without false commitment
- collapsed valid owners still read as legal targets
- the source row remains visually stable while trust-tuning changes land
- Browser create/rename/delete and selection handoff remain unchanged

### Assumptions

- `8.8.1` is already in place and behaving correctly
- this phase improves trust, not drag architecture
