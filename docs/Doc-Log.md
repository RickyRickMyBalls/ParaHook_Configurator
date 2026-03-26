# Doc Log

## Doc Header

### Doc History
271. 2026-03-25 21:49: Cleaned up the Console architecture docs after shipping `[5.1G] Surface-Agnostic Command Ownership And Adapter Expansion` by moving its standalone phase record from `Console/Future/` into `Console/Shipped/`, updating `docs/Human-Plans/Architecture/Console/Console.md` plus the architecture docs map and cross-family roadmap to the post-`5.1G` state, and keeping the console family aligned with the now-landed owner-first command-expansion cut
270. 2026-03-25 21:28: Tightened `docs/Human-Plans/Architecture/Console/Future/Console_Phase 5.1G - Surface-Agnostic Command Ownership And Adapter Expansion.md` against the live `Console`, `Browser`, workspace-intent, viewer bridge, and viewport overlay seams so the console family now has an implementation-ready owner-first command migration spec with concrete command families, migration order, file targets, and verification expectations
269. 2026-03-25 21:10: Cleaned up the Worker architecture docs after shipping `[5.3A-7] Graph-Native Worker Cutover And Legacy Contract Deletion` by moving its standalone phase record from `Worker/Future/` into `Worker/Shipped/`, updating `docs/Human-Plans/Architecture/Worker/Worker.md` plus both roadmap trackers to the fully shipped worker-family state, and refreshing `docs/Doc-Index.md` so the Worker subtree no longer lists any open future worker phase docs
268. 2026-03-25 20:41: Tightened `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-7 - Graph-Native Worker Cutover And Legacy Contract Deletion.md` against the live shared contract, dispatcher, app/runtime, worker entry, compatibility adapter, and viewer seams so the final worker cutover now reads as an implementation-ready deletion spec with explicit API removals, migration order, concrete file targets, and a verification bar grounded in the actual remaining `BoxParams`, `assemble`, and compatibility-wrapper surfaces
267. 2026-03-25 20:37: Locked `q1` through `q5` under `[5.3A-7] Graph-Native Worker Cutover And Legacy Contract Deletion` in `docs/Human-Plans/Architecture/Worker/Worker.md`, created the standalone future phase doc `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-7 - Graph-Native Worker Cutover And Legacy Contract Deletion.md`, and refreshed `docs/Doc-Index.md` so the Worker subtree now lists the final graph-native worker cutover as its own implementation-ready future phase surface
266. 2026-03-25 20:22: Expanded `docs/Human-Plans/Architecture/Worker/Worker.md` under `[5.3A-7] Graph-Native Worker Cutover And Legacy Contract Deletion` with a first `Questions / Decisions` block, adding focused open questions plus suggestions around final translation ownership, bundle-versus-flat-selector cutover, the fate of `assemble`, where any surviving product adapters should live after legacy deletion, and the verification bar required to claim the graph-native worker cutover is actually complete
265. 2026-03-25 20:13: Cleaned up the Worker architecture docs after the shipped `[5.3A-6]` implementation by moving `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-6 - Result Semantics, Browser Truth, And Console Truth.md` into `Worker/Shipped/`, updating the Worker umbrella plus both roadmap trackers to the post-`5.3A-6` state, and refreshing `docs/Doc-Index.md` so the Worker subtree now lists the result-semantics phase under shipped history instead of future work
264. 2026-03-25 19:37: Tightened `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-6 - Result Semantics, Browser Truth, And Console Truth.md` against the live shared result, app acceptance, spaghetti runtime, Browser output-surface, and worker transcript seams so the phase now reads as an implementation-ready execution spec with a concrete wire-envelope recommendation, explicit bundle/entry fields, migration order, and exact verification files
263. 2026-03-25 19:37: Locked `q1` through `q5` under `[5.3A-6] Result Semantics, Browser Truth, And Console Truth` in `docs/Human-Plans/Architecture/Worker/Worker.md`, created the standalone future phase doc `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-6 - Result Semantics, Browser Truth, And Console Truth.md`, and refreshed `docs/Doc-Index.md` so the Worker subtree now lists the new semantic-strengthening future phase beside the shipped `[5.3A-1]` through `[5.3A-5]` records
262. 2026-03-25 19:05: Expanded `docs/Human-Plans/Architecture/Worker/Worker.md` under `[5.3A-6] Result Semantics, Browser Truth, And Console Truth` with a first `Questions / Decisions` block, adding focused open questions plus suggestions around canonical result payload shape, retained-sibling semantics, preview-versus-final publication rules, Browser parent aggregate truth, and Console narration depth before the later worker cutover phase
261. 2026-03-25 19:03: Cleaned up the Worker architecture docs after the shipped `[5.3A-5]` implementation by moving `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-5 - Legacy Runtime And Startup Fallback Removal.md` into `Worker/Shipped/`, updating `docs/Human-Plans/Architecture/Worker/Worker.md` plus both roadmap trackers to the post-`5.3A-5` state, and refreshing `docs/Doc-Index.md` so the Worker subtree now lists the legacy-runtime removal phase under shipped history instead of future work
260. 2026-03-25 18:34: Created `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-5 - Legacy Runtime And Startup Fallback Removal.md` as the standalone implementation-ready worker follow-on, updated `docs/Human-Plans/Architecture/Worker/Worker.md` to point at that new future phase surface and lock `q1` through `q5`, and refreshed `docs/Doc-Index.md` so the Worker subtree now lists the runtime-removal phase beside the shipped `[5.3A-1]` through `[5.3A-4]` records
259. 2026-03-25 18:25: Expanded `docs/Human-Plans/Architecture/Worker/Worker.md` under `[5.3A-5] Legacy Runtime And Startup Fallback Removal` with the first `Questions / Decisions` block, adding focused open questions plus suggestions around the future worker-core versus product-adapter seam, graph-first startup silence, legacy build-stats-order fallback deletion, preview-path placement, and targeted child-rebuild preservation during runtime cleanup
258. 2026-03-25 18:22: Cleaned up the Worker architecture docs after the shipped `[5.3A-4]` implementation by moving `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md` into `Worker/Shipped/`, updating `docs/Human-Plans/Architecture/Worker/Worker.md` plus both roadmap trackers to the post-`5.3A-4` state, and refreshing `docs/Doc-Index.md` so the Worker subtree now lists the dispatcher-boundary cleanup under shipped history instead of future work
257. 2026-03-25 18:06: Tightened `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md` against the live `src/app` seams so the dispatcher-boundary follow-up now explicitly records bootstrap-owned provider wiring, one whole-object runtime-hooks registration shape, deterministic hook ordering, and the concrete code/test verification targets needed to treat it as implementation-ready
256. 2026-03-25 17:29: Added the new standalone future Browser phase doc `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-7 - Browser Cleanup Follow-Ons.md`, updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` so the Browser ladder now continues into a small-follow-on `Browser-7` cleanup bucket with the first two tracked entries for viewport explicit multi-select sync and object-scope `Zoom` command expansion, and refreshed `docs/Doc-Index.md` so the Browser subtree now lists the new future phase surface beside `Browser-6`
255. 2026-03-25 16:35: Reframed `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-6 - BrowserPanel Structure And Row-Family Cleanup.md` to read more clearly as a long-term Browser-vision enabler, tightening its purpose and summary around later shared Browser primitives while keeping the actual phase contract behavior-preserving, implementation-bounded, and explicitly separate from the full end-state convergence work

254. 2026-03-25 16:20: Locked the remaining `Browser-6` questions in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` and made `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-6 - BrowserPanel Structure And Row-Family Cleanup.md` implementation-ready, aligning both docs around a meaningful layered BrowserPanel split, family-specific adapter seams, shared Browser-5.x ownership staying outside the panel, and a behavior-preserving cleanup strategy
253. 2026-03-25 16:13: Locked `q2` under `Browser-6 - BrowserPanel Structure And Row-Family Cleanup` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, deciding that Browser-6 should keep the shared row shell and click grammar centralized while moving content, reference, graph, and sketch row-family differences into narrower family-specific adapter seams instead of one giant central panel switch
252. 2026-03-25 16:09: Expanded `docs/Human-Plans/Architecture/Browser/Browser-Index.md` with a new long-term Browser vision block, locking the direction that folders and objects should eventually act like shared Browser primitives across imported/reference-backed and generated/authored content, with origin shown through Browser styling rather than by keeping those tree branches permanently architecturally separate
251. 2026-03-25 16:05: Locked `q1` under `Browser-6 - BrowserPanel Structure And Row-Family Cleanup` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, deciding that the first Browser-6 pass should be a meaningful architecture cleanup rather than a cosmetic helper extraction, with `BrowserPanel` becoming a thinner host while row-vm derivation, interaction dispatch, and row-family seams move outward
250. 2026-03-25 16:02: Expanded `docs/Human-Plans/Architecture/Browser/Browser-Index.md` under `Browser-6 - BrowserPanel Structure And Row-Family Cleanup` by adding the first open questions plus suggestions covering how far the first structural split should go, where row-family behavior should live, which Browser-5.x shared seams must stay out of `BrowserPanel`, and how behavior-preserving the Browser-6 cleanup should remain
249. 2026-03-25 15:56: Cleaned up the Browser architecture docs after the shipped `Browser-5.3`, `Browser-5.4`, and `Browser-5.5` implementation work by moving their standalone phase records from `docs/Human-Plans/Architecture/Browser/Future/` into `Browser/Shipped/`, rewriting `docs/Human-Plans/Architecture/Browser/Browser-Index.md` plus `docs/Human-Plans/roadmap/Architecture-roadmap.md` to the post-5.5 shipped state, and refreshing `docs/Doc-Index.md` so the Browser subtree now shows only `Browser-6` under `Future/`
248. 2026-03-25 14:39: Created `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5.4 - Explicit Additive Multi-Select.md` as the standalone implementation-ready Browser multi-select follow-up, updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` to point at that new future phase surface, and refreshed `docs/Doc-Index.md` so the Browser family map now lists the explicit additive multi-select phase beside the existing Browser-5.3 and Browser-5.5 follow-ups
247. 2026-03-25 13:20: Tightened `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5.5 - Reference Batch Load Queue And Aggregate Progress.md` into an implementation-ready spec, locking the shared `referenceLoadBatch` state shape, deterministic queue ordering, batch replacement semantics, aggregate progress math, and the concrete store/viewer/browser/console verification seams for the next reference loading pass
246. 2026-03-25 13:17: Expanded `docs/Human-Plans/Architecture/Browser/Browser-Index.md` with a new `Browser-5.5 - Reference Batch Load Queue And Aggregate Progress` follow-up, created the standalone future phase doc `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5.5 - Reference Batch Load Queue And Aggregate Progress.md`, and refreshed `docs/Doc-Index.md` so the Browser family map now lists the new reference batch-loading phase beside the existing Browser-5.x follow-ups
245. 2026-03-25 10:59: Locked all four open `Browser-5.3` console-context questions in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, created the standalone implementation-ready future phase doc `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5.3 - Selection To Console Context For Content And References.md`, and refreshed `docs/Doc-Index.md` so the Browser family map now lists the new content/reference selection-to-console follow-up beside the shipped Browser-5.x records
244. 2026-03-25 10:28: Expanded `Browser-5.3 q2` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` with the selection-path direction for Browser-driven Console context, explicitly distinguishing `> Select > Object 1`, rooted parent scopes like `> Select > Assembly 1`, and the later synthetic `> Multi Select > [...]` scope for explicit mixed multi-selection
243. 2026-03-25 10:25: Refined `Browser-5.3 q1` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` so the Browser/Console direction now explicitly favors giving every meaningful row family a Console context even when the first command set is intentionally tiny, using `5.3` as the routing foundation instead of waiting for fully rich row-specific command surfaces
242. 2026-03-25 10:23: Expanded `docs/Human-Plans/Architecture/Browser/Browser-Index.md` again by adding `Browser-5.4 - Explicit Additive Multi-Select`, separating later `Ctrl+click` add/remove and `Shift+click` range-selection growth from the nearer `Browser-5.3` selection-to-console context phase so the Browser selection ladder now distinguishes command-scope sync from explicit multi-select set editing
241. 2026-03-25 10:20: Expanded `docs/Human-Plans/Architecture/Browser/Browser-Index.md` under `Browser-5.3 - Selection To Console Context For Content And References` by adding the first open questions plus suggestions covering when Browser selection should push Console scope, how grouped parent content selection should map into one command root, how lightweight reference selection should relate to future reference Console scopes, and whether empty-space deselect should also clear Browser-driven Console context
240. 2026-03-25 10:16: Marked Browser-5.2 shipped after the grouped parent-selection code landed, moved `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5.2 - Implicit Parent Multi-Selection.md` into `docs/Human-Plans/Architecture/Browser/Shipped/`, updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` plus the shipped `Browser-5` record and `docs/Human-Plans/roadmap/Architecture-roadmap.md` to the new Browser family state, and refreshed `docs/Doc-Index.md` so the Browser subtree now points at the shipped Browser-5.2 path
239. 2026-03-25 10:06: Created `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5.2 - Implicit Parent Multi-Selection.md` as a standalone implementation-ready Browser follow-up doc, updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` to record that new future phase surface, and refreshed `docs/Doc-Index.md` so the Browser subtree now lists the grouped parent-selection phase beside the shipped Browser-5 and Browser-5.1 records
238. 2026-03-25 10:01: Updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` under the Browser-5.2 and Browser-5.3 follow-up notes to use the standard future row-selection click grammar, keeping ordinary click as single-select, switching additive multi-select toggling to `Ctrl+click`, and reserving `Shift+click` for later anchor-to-range selection
237. 2026-03-25 09:58: Locked `q3` and `q4` under `Browser-5.2 - Implicit Parent Multi-Selection` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, deciding that parent selection should immediately highlight all resolved descendants with the same lightweight outline/glow treatment and should keep the existing Browser-5 deselect/replacement rules, while also clarifying that later explicit additive multi-select should preserve current single-click behavior and use `Shift+click` to add or remove rows from the selection set
236. 2026-03-25 09:54: Locked `q1` and `q2` under `Browser-5.2 - Implicit Parent Multi-Selection` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, deciding that selecting an `Assembly` or `Component` resolves a deterministic grouped descendant set while still preserving one parent/root target as the primary selected thing for Browser, Console, and later transform ownership
235. 2026-03-25 09:51: Expanded `docs/Human-Plans/Architecture/Browser/Browser-Index.md` under the Browser-5 follow-up ladder by adding `Browser-5.3` for later selection-to-console context integration after grouped selection lands, and added the first `Browser-5.2` open questions plus suggestions covering resolved descendant sets, primary-versus-resolved selection truth, grouped viewport highlight behavior, and grouped-selection deselect/replacement rules
234. 2026-03-25 09:44: Marked Browser-5.1 shipped after the reference-selection cleanup landed in code, moved `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5.1 - Reference Selection Cleanup.md` into `docs/Human-Plans/Architecture/Browser/Shipped/`, updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` plus the shipped `Browser-5` record and `docs/Human-Plans/roadmap/Architecture-roadmap.md` to the new Browser family state, and refreshed `docs/Doc-Index.md` so the Browser subtree now points at the shipped Browser-5.1 path
233. 2026-03-25 03:18: Locked `q4` and turned `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5.1 - Reference Selection Cleanup.md` into an implementation-ready spec, aligning plain reference highlight styling with the already-shipped object/component/assembly outline-glow treatment and adding the concrete Browser/viewer/store seams plus required verification plan for the reference-selection cleanup cut
232. 2026-03-25 03:15: Locked the first three `Browser-5.1` reference-selection decisions across both `docs/Human-Plans/Architecture/Browser/Browser-Index.md` and the standalone `Browser_Phase Browser-5.1 - Reference Selection Cleanup.md`, deciding that ordinary reference selection stays lightweight, viewport-picked references should follow into matching Browser rows when the mapping is clear, and empty-space click plus replacement click own normal reference deselect and replacement
231. 2026-03-25 03:13: Locked `q2` in `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5.1 - Reference Selection Cleanup.md`, deciding that viewport-picked references should drive Browser row selection whenever one clear matching reference row exists while still avoiding fake sync for ambiguous cases
230. 2026-03-25 03:12: Locked `q1` in `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5.1 - Reference Selection Cleanup.md`, deciding that ordinary reference selection only highlights/selects the reference while stronger transform ownership must remain a separate explicit action instead of starting from normal row or viewport selection
229. 2026-03-25 03:08: Created `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5.1 - Reference Selection Cleanup.md`, updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` to record that new standalone follow-up surface, and refreshed `docs/Doc-Index.md` so the Browser family map now lists the immediate post-`Browser-5` reference-selection cleanup as its own future phase doc
228. 2026-03-25 03:00: Created `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Future/Master_Spaghetti_Phase Master Spaghetti-1 - Smart Wiring And Intent-Aware Auto-Insert First Pass.md`, linked it from `master spaghetti-index.md`, and refreshed `docs/Doc-Index.md` so the Spaghetti editor umbrella now has a standalone implementation-ready future phase doc for the first smart-wiring QoL slice grounded on the real `SketchProfile -> Geometry/Extrude -> OutputPreview` path
227. 2026-03-25 03:00: Expanded `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/master spaghetti-index.md` with the first explicit `Master Spaghetti` phase, framing `Master Spaghetti-1 - Smart Wiring And Intent-Aware Auto-Insert First Pass` as a narrow umbrella QoL slice for sketch-wire-to-output auto-extrude insertion while also updating the family-status language so the new index reads as having one proving-slice phase rather than still claiming no phase structure at all
226. 2026-03-25 02:50: Marked Browser-5 shipped after the selection/focus sync work landed in code, moved `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5 - Selection And Focus Sync.md` into `docs/Human-Plans/Architecture/Browser/Shipped/`, updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` plus `docs/Human-Plans/roadmap/Architecture-roadmap.md` to the shipped state, and refreshed `docs/Doc-Index.md` so the Browser family map now points at the shipped Browser-5 path
225. 2026-03-25 02:41: Refined the `Nodes` section inside `docs/Human-Plans/roadmap/Architecture-roadmap.md` so the roadmap now groups node-family work under foldable `Sketch` and `Extrude` subsections, with the individual node tasks moved down to `####` headings for easier scanning in VS Code
224. 2026-03-25 02:38: Reworked `docs/Human-Plans/roadmap/Architecture-roadmap.md` into one foldable family-by-family status surface, replacing the old split `Quick Checklist` plus repeated lower family summaries with status-marked `##` family headers and foldable `###` phase headers for easier scanning in the editor
223. 2026-03-25 02:32: Expanded `docs/Human-Plans/roadmap/Architecture-roadmap.md` so the cross-family tracker now also covers `Pasta Path`, `Radio`, `Camera Controls`, and `View Toolbar`, adding their source-doc references plus honest current-status reads for concept-only, shipped, and still-open family phases
222. 2026-03-25 02:26: Turned `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-5 - Selection And Focus Sync.md` into an implementation-ready spec by locking shared target ownership across Browser/Viewer/Console/Graph, the selection-versus-focus split, Viewer follow behavior, deselection rules, editor-focus disagreement handling, and the immediate `Browser-5.1` grouped-selection follow-up
221. 2026-03-25 02:24: Corrected `q17` to checked and added a new `Browser-5.1` follow-up note in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, explicitly splitting implicit parent-to-descendant grouped selection from later explicit additive multi-select so Browser-5 now records that selecting an assembly or component should resolve to a default multi-selection of its children
220. 2026-03-25 02:23: Locked `q21` under `Browser-5 - Selection And Focus Sync` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, deciding that single-select always re-targets the shared workspace selection immediately while stronger graph/editor focus changes remain row-family dependent so content selection can move Browser/viewport target truth without always stealing graph-editor focus
219. 2026-03-25 02:14: Corrected and locked `q19` plus locked `q20` under `Browser-5 - Selection And Focus Sync` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, deciding that Viewer selection should mirror into Browser rows when a clear match exists and that every meaningful Browser row family should eventually drive the console into the nearest valid command scope, with content rows later gaining their own object/assembly command layers
218. 2026-03-25 02:13: Updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` under `Browser-5 - Selection And Focus Sync` to lock `q18` around lightweight selection versus stronger focus/open ownership, and added plus locked new `q22` so Browser/content deselection now explicitly uses empty-space click as the primary clear path with `Esc` only as a backup when no active tool/session owns it
217. 2026-03-25 02:04: Updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` under `Browser-5 - Selection And Focus Sync` to record that content-row selection glow/highlight already landed early as a real workspace-target foundation for `Assembly` / `Component` / `Object` rows, while keeping fuller selection-style controls and the rest of Browser-5 sync cleanup as future work
216. 2026-03-25 01:51: Refined `q17` and `q20` under `Browser-5 - Selection And Focus Sync` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, locking the split between `Content` subtree-selection targets and `Graph Documents` authoring-context selection, while also making graph/sketch Browser selection explicitly responsible for driving console scope sync to the nearest valid command layer
215. 2026-03-25 01:45: Added `docs/Human-Plans/roadmap/Architecture-roadmap.md` as a new cross-family tracker for the current architecture phase ladders under `Browser`, `Console`, `Spaghetti Editor`, `Nodes`, `Worker`, and `AppShell`, and updated `docs/Doc-Index.md` so the roadmap subtree now lists that new architecture roadmap alongside the existing execution and vision roadmap files
214. 2026-03-25 01:46: Expanded `Browser-5 - Selection And Focus Sync` inside `docs/Human-Plans/Architecture/Browser/Browser-Index.md` with a new `Questions / Decisions` block covering shared target truth, selection-versus-focus ownership, viewer-to-Browser sync, console-context sync, and how to handle disagreement between selected Browser targets and active graph/editor focus
213. 2026-03-25 01:31: Created `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/extrude-index.md` plus `Shipped/` and `Future/` under `Nodes/Extrude/`, then expanded the new extrude family doc with its first phase ladder, locked `Extrude-1` `q1` to carry `plane + planeTransform` through the extrude contract, and aligned the longer-term extrude vision with Fusion-style profile picking, graph-wire profile authoring, multi-profile consumption, and the broader `EWR` direction
212. 2026-03-25 01:14: Marked Browser-4 shipped after the row-click and action-ownership cleanup landed in code, moved `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-4 - Row Click And Action Ownership Cleanup.md` into `docs/Human-Plans/Architecture/Browser/Shipped/`, and updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` plus `docs/Doc-Index.md` so the Browser family map now shows Browser-1 through Browser-4 as shipped
211. 2026-03-25 01:07: Turned `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-4 - Row Click And Action Ownership Cleanup.md` into an implementation-ready spec by locking the fixed Browser row-slot template, family-specific single-click behavior, explicit branch-owned expand/collapse, double-click focus/open rules, inline-versus-context-menu action ownership, and the hard rule that ordinary row click never directly triggers build behavior
210. 2026-03-25 01:03: Locked `q15` and `q16` under `Browser-4 - Row Click And Action Ownership Cleanup` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, deciding that row click never directly triggers build behavior and that ordinary Browser rows should converge on one fixed slot template with passive placeholders instead of per-family layout drift
209. 2026-03-25 01:00: Locked `q14` under `Browser-4 - Row Click And Action Ownership Cleanup` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` so Browser rows now target one shared inline slot template, removed the legacy graph save quick-button from the preferred row surface, and added new open `q16` to decide whether every Browser row should reserve the same fixed slot layout even when some controls are passive placeholders
208. 2026-03-25 00:53: Locked `q12` and `q13` under `Browser-4 - Row Click And Action Ownership Cleanup` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, deciding that expand/collapse belongs only to explicit branch controls while double-click becomes the stronger open/focus gesture only for row families with a real target surface or context
207. 2026-03-25 00:49: Locked `q11` under `Browser-4 - Row Click And Action Ownership Cleanup` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` so content rows are now selection-first for scene/content objects while graph-document rows are graph-context select/focus rows, and tightened the `q12` suggestion so explicit expand/collapse stays owned by the branch control rather than ordinary row-click
206. 2026-03-25 00:45: Added a new `Questions / Decisions` block under `Browser-4 - Row Click And Action Ownership Cleanup` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, covering default left-click meaning, explicit expand/collapse ownership, double-click focus/open behavior, which actions should stay inline versus right-click only, and the hard rule that row click should not directly dispatch build behavior
205. 2026-03-25 00:39: Marked Browser-3 shipped after the runtime build-policy execution work landed in code, moved `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-3 - Runtime Build Policy Execution.md` into `docs/Human-Plans/Architecture/Browser/Shipped/`, and updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` plus `docs/Doc-Index.md` so the Browser family map now shows Browser-1 through Browser-3 as shipped
204. 2026-03-25 00:05: Locked `q7` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` to `graph-document` as the first real Browser-3 runtime execution target, and refreshed `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-3 - Runtime Build Policy Execution.md` so the implementation-ready spec now matches the broader model-parameter vision, graph-first runtime scope, independent-child runtime behavior under parent `off`, and the now-tighter explicit-`Build` meaning
203. 2026-03-24 23:59: Updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` to check off the Browser questions that are now actually locked, adding explicit `Decision:` blocks for `q4`, `q5`, `q6`, `q8`, `q9`, and `q10` so the Browser umbrella doc now distinguishes settled policy/runtime direction from the remaining truly open Browser-3 target-scope question
202. 2026-03-24 23:55: Updated `q10` under `Browser-3 - Runtime Build Policy Execution` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` so explicit `Build` is now framed as mainly for dirty `manual` rows, keeps `off` excluded, and defers any later cross-mode retry behavior to a separate future concept like `Force Rebuild`
201. 2026-03-24 23:51: Updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` so the Browser-3 phase now explicitly defines `ParaSlider` as product language for model parameters rather than literal slider widgets, and clarified `q9` plus the Browser-3 locked direction to include sketch edits, typed parameters, and other downstream parametric model changes in the same runtime policy vision
200. 2026-03-24 23:47: Refined `q9` under `Browser-3 - Runtime Build Policy Execution` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` so `release` is now framed as the end of any continuous authored interaction rather than only literal slider release, explicitly pulling sketch edits and other downstream live-parametric changes into the same policy-aware authored-edit model
199. 2026-03-24 23:39: Updated `docs/Human-Plans/Architecture/Browser/Browser-Index.md` under `Browser-3 - Runtime Build Policy Execution` by adding the missing runtime `Questions / Decisions` block for target granularity, independent-child behavior under parent `off`, `release` boundaries, and explicit `Build` meaning so the umbrella Browser doc now better frames the remaining Browser-3 sequencing decisions
198. 2026-03-24 23:30: Cleaned up `Browser-2` to match the real explicit-independence shipped behavior, marked `Browser-1` and `Browser-2` shipped, moved both Browser phase docs from `docs/Human-Plans/Architecture/Browser/Future/` into `Shipped/`, and updated `docs/Doc-Index.md` so the Browser family map now reflects that only `Browser-3` onward remain open future phases
197. 2026-03-24 23:20: Turned `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-3 - Runtime Build Policy Execution.md` into an implementation-ready spec by locking the effective-policy execution model, `live / release / manual / off` runtime timing, explicit-build semantics, and the dirty/output rules that must change before Browser build policy controls real rebuild dispatch
196. 2026-03-24 23:01: Added a cleanup follow-up section to `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-2 - Cascade And Effective Policy Truth.md`, recording the new preferred UX decision that child rows should inherit parent policy by default and only become independent through an explicit `Make Independent` / `Return To Parent` action rather than silent override creation on ordinary icon clicks
195. 2026-03-24 14:36: Turned `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-2 - Cascade And Effective Policy Truth.md` into an implementation-ready spec by locking the authored-versus-effective Browser build-policy model, graph/assembly/component/object cascade rules, override semantics, Browser tooltip/display rules, selector/store ownership, and the exact boundaries that remain deferred to Browser-3 runtime execution
194. 2026-03-24 14:19: Created `docs/Human-Plans/Architecture/Console/Future/Console_Phase 5.1G - Surface-Agnostic Command Ownership And Adapter Expansion.md`, updated `docs/Human-Plans/Architecture/Console/Console.md` to link the new standalone future phase and reflect the folderized console phase-doc layout, and refreshed `docs/Doc-Index.md` so the console subtree now lists the new `Future/` planning surface
193. 2026-03-24 14:15: Updated `docs/Human-Plans/Architecture/Console/Console.md` with a new bottom moving-forward summary and open `[5.1G] Surface-Agnostic Command Ownership And Adapter Expansion` follow-on, locking the owner-versus-adapter rule for `Console`, `Browser`, `Model Viewport`, and `View Toolbar` while keeping workspace placement and the already-existing `5.1F`/`5.1C` seams distinct
192. 2026-03-24 13:42: Turned `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-1 - Build Policy Icon Surface.md` into an implementation-ready spec, grounding it in the current `BrowserPanel` and `useAppStore` seams while locking canonical keyed-map policy state, first graph/content row scope, icon colors, fill-bar semantics, and the non-runtime boundary for the first Browser policy surface cut
191. 2026-03-24 13:11: Created the six new standalone Browser phase docs under `docs/Human-Plans/Architecture/Browser/Future/` for `Browser-1` through `Browser-6`, and updated `docs/Doc-Index.md` so the Browser family now has dedicated future planning surfaces for build-policy, cascade truth, runtime execution, row-click cleanup, selection/focus sync, and BrowserPanel structure cleanup
190. 2026-03-24 13:02: Expanded `docs/Human-Plans/Architecture/Browser/Browser-Index.md` into a fuller Browser umbrella doc by adding a broader cleanup section plus new `Browser-4`, `Browser-5`, and `Browser-6` phases for row-click ownership, selection/focus sync, and BrowserPanel structure cleanup beyond the existing build-policy ladder
189. 2026-03-24 12:57: Broke the Browser build-policy work in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` into a three-phase ladder, separating `Browser-1` icon/fill-bar surface work, `Browser-2` cascade-and-effective-policy truth, and `Browser-3` real runtime build-policy execution so the Browser family no longer treats UI, inheritance, and worker behavior as one oversized phase
188. 2026-03-24 12:52: Refined the remaining open questions in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, updating `q4` so fill bars are explicitly framed as runtime/loading bars with a low yellow stale stub for dirty/manual rows and adding `q6` for the remaining authored-versus-effective inherited-policy display decision
187. 2026-03-24 12:49: Refined the first Browser-family phase in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` so the `live / release / manual / off` mode meanings are now defined in concrete `ParaSlider` terms, with rebuild-during-drag, rebuild-on-release, explicit-build-only, and no-worker-output behavior respectively
186. 2026-03-24 12:46: Added the default-mode rule to `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, locking the Browser/build-policy baseline to `live` so the intended normal user experience is auto-rebuilding without an explicit `Build` press
185. 2026-03-24 12:41: Locked `q1`, `q2`, and `q3` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md`, deciding that graph-title plus assembly/component/object rows are the first calc-policy scope, `off` uses a neutral gray disabled tone, and `off` is the stronger mode where worker-produced geometry stops instead of preserving old output like `manual`
184. 2026-03-24 12:39: Tightened `q1` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` so the new graph-title calc-policy control now explicitly cascades through assembly, component, and part/object rows below that graph instead of reading like a graph-row-only toggle
183. 2026-03-24 12:38: Refined `q1` in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` so the first Browser calc-policy scope now explicitly includes graph-title rows, reflecting the need for a top graph-level `live / release / manual / off` control in addition to the lower content-row icon modes
182. 2026-03-24 12:36: Expanded the first Browser-family phase in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` with a dedicated `Questions / Decisions` section, using checklist-style open-question headings plus short `Suggestion` blocks for scope, `off` color, `off` output behavior, `manual` stale state, and parent-child policy override
181. 2026-03-24 12:34: Refined the first Browser-family phase in `docs/Human-Plans/Architecture/Browser/Browser-Index.md` so `manual` now explicitly preserves the last built geometry until the user requests another build, while `off` is locked as the stronger mode where the worker stops producing geometry for that row
180. 2026-03-24 12:31: Extended `docs/Human-Plans/Architecture/Browser/Browser-Index.md` with the first Browser-family phase, locking `live / release / manual / off` as the canonical left-icon calc-policy modes, separating them from the eyeball visibility control, and defining the first Browser-phase scope around assembly/component/object row policy cycling
179. 2026-03-24 12:26: Added the new `Browser` architecture family scaffold, creating `docs/Human-Plans/Architecture/Browser/Browser-Index.md` plus `Future/` and `Shipped/` folders and updating `docs/Doc-Index.md` so Browser-specific planning now has its own umbrella family home alongside `AppShell`, `Worker`, and `View-Toolbar`
178. 2026-03-23 22:42: Logged the new `SketchDraw` `Done` command in `docs/CHANGELOG.md`, covering the staged `G > S > SD > Done` console action, the explicit return-to-selected-sketch-scope behavior, and the focused console/staged-navigation regressions
177. 2026-03-23 22:30: Logged the viewport-typing hybrid-capture cleanup in `docs/CHANGELOG.md`, covering the shared input-routing change that now lets plain letters seed the console again after clicking the model viewport, including while idle `SketchDraw`
176. 2026-03-23 22:25: Updated the standalone `[5.0I-1] View Toolbar` phase doc with the shipped orthographic-pan lesson, explicitly recording that the last real bug was on the normal viewport `OrbitControls` path and that `screenSpacePanning = true` was the fix that finally restored visible up/down pan in ortho
175. 2026-03-23 22:23: Logged the OrbitControls screen-space pan alignment follow-up in `docs/CHANGELOG.md`, covering the shared camera-controller change that switches normal viewport panning to screen-space mode so orthographic pan follows the visible camera axes
174. 2026-03-23 22:20: Logged the shared orthographic-pan basis correction in `docs/CHANGELOG.md`, covering the camera-controller update that now reads vertical pan from the active camera's real matrix up column plus the new plane-aligned orthographic regression and passing build verification
173. 2026-03-23 22:14: Logged the sketch-draw projection re-align follow-up in `docs/CHANGELOG.md`, covering the viewer change that now re-applies sketch-plane camera alignment after projection switches while idle `SketchDraw` is active
172. 2026-03-23 22:10: Logged the sketch-plane camera-up alignment follow-up in `docs/CHANGELOG.md`, covering the new sketch-plane Y-axis export plus the viewer/camera update that now aligns orthographic sketch views to the plane's real in-plane up direction
171. 2026-03-23 22:06: Logged the pure-vertical orthographic-pan follow-up in `docs/CHANGELOG.md`, covering the camera-controller basis correction that stops vertical drags from collapsing when no horizontal drag component is present
170. 2026-03-23 21:34: Logged the small build-unblock follow-up in `docs/CHANGELOG.md`, covering the `ConsoleDock` nullability narrowing that fixes the staged `SketchDraw` session TypeScript error and restores a clean `npm run build`
169. 2026-03-23 21:32: Logged the orthographic-pan vertical-basis follow-up in `docs/CHANGELOG.md`, recording the shared camera-controller update that now computes screen-up from the live camera basis so aligned sketch-view orthographic pan no longer loses vertical motion
168. 2026-03-23 21:26: Logged the shipped sketch-draw pan follow-up in `docs/CHANGELOG.md`, covering the viewer change that lets explicit console-armed camera drag modes override the sketch pointer layer plus the new idle `SketchDraw` `pan` regression test
167. 2026-03-23 21:24: Logged the shipped orthographic-pan follow-up in `docs/CHANGELOG.md`, covering the shared camera-controller basis fix that now uses the active camera's matrix columns for pan and the new orthographic top-view regression test
166. 2026-03-23 21:19: Logged the shipped `Zoom Window First Pass` follow-up in `docs/CHANGELOG.md`, covering the new model-viewport drag-box camera mode, the target-plane camera-fit math, and the console changes that arm `Zoom Window` from both root zoom and idle `SketchDraw`
165. 2026-03-23 21:10: Logged the shipped `[3.2B-Console-2]` zoom-object follow-up in `docs/CHANGELOG.md`, covering the new sketch-selection framing seam in the viewer plus the console-routing change that lets idle `SketchDraw` `Zoom Object` use selected sketch entities and resume the local sketch-draw scope
164. 2026-03-23 18:16: Logged the shipped `[3.2B-Console-2]` sketch-console routing pass in `docs/CHANGELOG.md`, capturing the new local `SketchDraw` staged command scopes, shared staged projection/zoom flow, and the focused console test coverage that now passes against that implementation
163. 2026-03-23 17:57: Reworked the live `docs/index.md` landing page into a more presentable MkDocs home screen with grouped quick-link cards, browse-by-area links, and clearer direct entry points into the roadmap, architecture, bugs, and core repo doc surfaces without changing the underlying inferred-nav publish model
162. 2026-03-23 17:29: Tightened the standalone `[3.2B-Console-2] SketchDraw Staged Command Routing` phase doc into a more handoff-ready implementation spec, locking the exact local staged scope ids, action ids, `Back` versus `X` behavior, staged-to-runtime handoff rules, and the concrete verification targets for the next sketch-console routing pass
161. 2026-03-23 17:39: Logged the shipped MkDocs `Phase 3` hosting pass that updates the existing GitHub Pages workflow and `mkdocs.yml` for one combined app-root plus `/docs/` publish artifact, while refreshing both `docs/index.md` and `docs/Phase-Plans/mkDocs.md` to describe that live same-repo hosting model
160. 2026-03-23 17:19: Logged the shipped `[3.2B-Console-1]` follow-through by moving the standalone sketch-console phase record into `Shipped/`, updating `Sketch.md` and `roadmap.md` to mark the first scoped-console cleanup complete, and refreshing the docs map so the new shipped path replaces the old future listing
159. 2026-03-23 17:18: Logged the new `mkDocs.md` hosting follow-up that adds `Phase 3 - GitHub Pages Combined App And Docs Publish`, locking the same-repo GitHub Pages plan around one combined artifact with the app kept at `/` and the MkDocs site published under `/docs/` through the existing Pages workflow
158. 2026-03-23 17:12: Logged the MkDocs dark-mode pass that updates `mkdocs.yml` to start the published docs site in Material's `slate` palette by default while keeping a light-mode toggle, and refreshed both `docs/index.md` and `docs/Phase-Plans/mkDocs.md` so the live docs notes match that new theme behavior
157. 2026-03-23 17:03: Logged the `CHANGELOG.md` foldability migration that wraps every numbered changelog entry's detailed body in a collapsed HTML `details` block while keeping each title and `HUMAN SUMMARY` visible, including the local changelog-rule update that makes the same entry layout the forward default
156. 2026-03-23 15:02: Logged the new `3.2B-Console` sketch-console mini-family, including the `Sketch.md` umbrella update, the three standalone future phase docs for scoped `SketchDraw` command cleanup and staged routing, and the docs-map refresh that lists those new planning surfaces under the sketch subtree
155. 2026-03-23 14:40: Logged the `Doc-Index.md` foldability prototype that wraps the top `Doc Header` section in an HTML `details` block, keeping the large docs-map metadata collapsible in MkDocs without rewriting the rest of the file into a fully indented admonition structure
154. 2026-03-23 14:18: Logged the first shipped `mkDocs` Phase 2 upkeep pass that updates `mkdocs.yml` with small Material navigation improvements, rewrites `docs/index.md` into a real live-site landing page with auto-publish and exclusion guidance, and refreshes `docs/Phase-Plans/mkDocs.md` so the new Phase 2 maintenance lane reads as implemented instead of planning-only
153. 2026-03-23 14:12: Logged the `mkDocs.md` follow-up that adds `Phase 2 - MkDocs Update And Published-Docs Maintenance`, reframes the MkDocs planning note as a two-phase track instead of one finished baseline, and records the current rule that new docs auto-publish under inferred nav unless `exclude_docs` or a later manual `nav:` change says otherwise
152. 2026-03-23 14:07: Logged the new standalone `[5.0I-1] View Toolbar Phase - Shared View Command Dispatch And Projection Console Entry` future doc, updated `View-Toolbar-Index.md` so the family points at the first implementation-ready phase record, and refreshed the docs map so the new `View-Toolbar/Future/` subtree now includes the initial orthographic-versus-perspective console/toolbar phase
151. 2026-03-23 13:50: Logged the shipped `[3.2A-0.1]` follow-through by moving the standalone `Nodes-Fondation` phase record into `Shipped/`, marking the node-family index and roadmap state forward, updating the docs map to the new shipped path, and flipping the dedicated sketch-to-extrude bug notes from implementation-ready to code-resolved pending manual app verification
150. 2026-03-23 13:32: Refreshed the `Sketch To Extrude` bug-planning surfaces after the shipped worker-contract cleanup, tightening both the standalone `[3.2A-0.1]` phase doc and the dedicated bug note around the actual remaining downstream `worker mesh -> PartArtifact -> Viewer` seam, updating the likely files/tests, and marking the bug as implementation-ready instead of still framed around the stale `compileGraph loop.segments` diagnosis
149. 2026-03-23 13:24: Logged the shipped `[5.3A-2]` worker-contract follow-through by moving the standalone phase record into `Worker/Shipped/`, refreshing `Worker.md`, `roadmap.md`, and `Doc-Index.md` to the shipped state, and updating the open `[5.3A-4]` dispatcher doc so it now treats the graph-native request/build-unit contract as completed groundwork instead of still-pending work
148. 2026-03-23 00:43: Tightened the open `[3.2B-DrawSketch-6.1] Endpoint Snap First Pass` child phase into a more implementation-ready spec inside both `Sketch.md` and its standalone future phase doc, locking the current snap seams, the first committed endpoint extraction set, the origin-versus-endpoint ranking rule, the first `hoverSnapTarget` expansion, and the concrete helper/store/viewer verification targets
147. 2026-03-23 00:31: Added `docs/Human-Plans/Architecture/AutoCAD-Command-Backlog.md` as a new broad architecture-side AutoCAD-style command inventory for ParaHook, grouping the long-term backlog into view/navigation, selection, snaps, draw tools, modify/edit tools, annotation/constraints, and content/reference-related commands instead of leaving that growing command target scattered across the sketch and camera family docs
146. 2026-03-23 00:20: Added a bigger-vision AutoCAD-style modify-command backlog to the top of the open `[3.2B-DrawSketch-7] Entity Transform And Modify Tools` family in both `Sketch.md` and its standalone future phase doc, explicitly framing `DrawSketch-7` as the long-term home for transform, reshape/topology, and structure/cleanup commands on existing sketch entities
145. 2026-03-23 00:16: Expanded the new open `[3.2B-DrawSketch-7] Entity Transform And Modify Tools` family in both `Sketch.md` and its standalone future phase doc to include the broader AutoCAD-style modify backlog, then re-split it into a safer six-step ladder of `[7.0] Move Copy And Rotate`, `[7.1] Scale Mirror And Array`, `[7.2] Offset Fillet And Chamfer`, `[7.3] Stretch`, `[7.4] Trim And Extend`, and `[7.5] Explode And Join`
144. 2026-03-23 00:09: Added a new open `[3.2B-DrawSketch-7] Entity Transform And Modify Tools` family in `Sketch.md` plus its standalone future phase doc, splitting the next post-snap sketch-edit growth into a minimum-safe ladder of `[7.0] Move And Rotate`, `[7.1] Scale Mirror And Array`, `[7.2] Stretch`, and `[7.3] Trim And Extend`
143. 2026-03-23 00:00: Broke the larger `DrawSketch-6` snap vision into a concrete minimum-safe subphase ladder in both `Sketch.md` and its standalone future phase doc, recommending a seven-step `[3.2B-DrawSketch-6.0]` through `[3.2B-DrawSketch-6.6]` progression that separates toolbar/shared controls, endpoint snap, simple geometric snaps, computed relation snaps, ortho/polar tracking, object snap tracking, and later preferences/symbol growth
142. 2026-03-22 23:56: Expanded the open `DrawSketch-6` snap-family planning with a broader AutoCAD-like long-term vision in both `Sketch.md` and its standalone future phase doc, adding object-snap and tracking categories, a suggested growth order after endpoint snap, and a longer-term view-toolbar direction for master snap controls, per-snap rows, tracking aids, polar settings, and later symbol customization
141. 2026-03-22 23:45: Reframed `[3.2B-DrawSketch-6]` from one monolithic endpoint-only phase into a wider `Snap Growth` parent in both `Sketch.md` and its standalone future phase doc, then added the first child split with `[3.2B-DrawSketch-6.0] Snap Toolbar And Shared Snap Controls` and `[3.2B-DrawSketch-6.1] Endpoint Snap First Pass` so later midpoint/center/object-snap follow-ons can land cleanly under the same family
140. 2026-03-22 23:39: Extended the open `[3.2B-DrawSketch-6] Endpoint Snap` plan with the current sketch-draw snap-settings research, explicitly locking the first toolbar cleanup that moves `Snap` and `Snap Distance` out of the sketch-draw settings submenu into a dedicated main `Snap` section while reusing the already-shipped sketch-draw snap prefs and naming the relevant overlay/store/viewer seams
139. 2026-03-22 23:28: Logged the new `View-Toolbar/ThreeViewier.md` planning doc, added it to the docs map, and captured one broad practical inventory of current plus possible Three.js viewer settings for ParaHook across projection, framing, background, grid, helpers, lighting, materials, render quality, and console-aligned view control growth
138. 2026-03-22 23:30: Tightened the open `[3.2B-DrawSketch-6] Endpoint Snap` planning surface in both `Sketch.md` and its standalone future phase doc, locking the exact first endpoint extraction set per entity type, the shared origin-versus-endpoint ranking rule, the active-tool-only snap boundary, the first user-visible snap feedback contract, and the concrete store/viewer/helper seams plus verification targets
137. 2026-03-22 22:55: Logged the new `View-Toolbar` architecture family, created `Future/` and `Shipped/` under `docs/Human-Plans/Architecture/View-Toolbar/`, added `View-Toolbar-Index.md` as the umbrella planning surface, and grounded the first direction around console alignment, projection mode controls, `ParaSelect`, `FOV`, grid controls, and legacy gizmo carry-forward
136. 2026-03-22 22:32: Logged the shipped `[5.0H-4] Camera Console Commands` follow-up that moves the standalone phase record into `Camera-Controls/Shipped/`, updates the camera family index and roadmap to reflect the landed root/scoped `Zoom` plus console `Pan` / `Orbit` cut, refreshes the docs map to the shipped path, and tightens the wording so `Zoom Object` only claims the current selected part/reference seam while unsupported paths stay explicit
135. 2026-03-22 22:00: Logged the `[5.0H-4]` implementation-readiness pass that grounds `Zoom Object` on the existing browser/app selection seam instead of a new viewport-pick feature, locks the reusable root/scoped `Zoom` tree shape, and names the concrete console/viewer files plus first verification targets
134. 2026-03-22 21:52: Logged the `[5.0H-4]` console-camera follow-up that locks `Zoom` as a reusable scoped command family, with root `Zoom` living beside `Graph` as the model-viewport default while `Graph > Zoom` now defaults to `Canvas` first and still exposes `Model Viewport` as the secondary branch
133. 2026-03-22 21:47: Logged the new standalone `[5.0H-4] Camera Console Commands` future phase doc, updated `Camera_Controls-Index.md` to point at it, and refreshed the docs map so the next open camera-controls cut now has its own implementation-ready planning surface after the shipped sketch, viewport-baseline, and canvas/model coexistence work
132. 2026-03-22 21:40: Logged the shipped `[5.0H-3] Spaghetti Canvas And Model Viewport Coexistence` follow-up that moves the standalone phase record into `Camera-Controls/Shipped/`, updates the camera family index and roadmap to mark the coexistence cut complete, and advances the remaining open camera-controls work to console commands plus the later shared input-owner model
131. 2026-03-22 21:26: Logged the `[5.0H-3]` coexistence correction that makes the model viewport baseline explicit again as `wheel zoom`, `MMB` pan, `Ctrl + MMB` orbit, and `MMB` double-click fit, with the canvas now described as simply adding `Shift` to forward those same model gestures while hovered
130. 2026-03-22 21:24: Logged the `[5.0H-3]` pass-through redesign that replaces the mixed canvas/model modifier proposal with a cleaner `+Shift` rule, so while hovering the canvas the model viewport now uses `Shift + wheel` for zoom, `Shift + MMB` for pan, and `Shift + Ctrl + MMB` for orbit
129. 2026-03-22 21:19: Logged the `[5.0H-3]` pass-through correction that replaces the earlier split `Ctrl + MMB` pan plus `Ctrl + Shift + MMB` orbit idea with the simpler rule that model orbit should just use normal `Ctrl + MMB`, while `Shift + wheel` remains the canvas-to-model zoom pass-through
128. 2026-03-22 21:15: Logged the `[5.0H-3] Spaghetti Canvas And Model Viewport Coexistence` follow-up that tightens its standalone phase doc around the real graph-canvas runtime, locking the current plain-wheel plus empty-background-`LMB` ownership, recording that only expanded-view `Ctrl + MMB` orbit exists today, and making the next cut explicitly add new canvas-to-viewer zoom/pan seams with `Shift + wheel` replacing the older `Ctrl + wheel` idea
127. 2026-03-22 21:11: Logged the new standalone `[5.0H-3] Spaghetti Canvas And Model Viewport Coexistence` future phase doc, updated `Camera_Controls-Index.md` to point at it, and refreshed the docs map so the next camera-controls cut now has its own implementation-ready planning surface with the safer `Shift + wheel` pass-through zoom direction
126. 2026-03-22 20:52: Logged the shipped `[5.0H-2] Fusion-Style Model Viewport Camera Baseline` follow-up that moves the standalone phase record into `Camera-Controls/Shipped/`, marks the camera family and roadmap state forward after the implementation landed, and refreshes the docs map so the model-viewport gesture baseline now reads as completed history instead of a future planning surface
125. 2026-03-22 20:44: Logged the `[5.0H-2] Fusion-Style Model Viewport Camera Baseline` follow-up that tightens its standalone phase doc around the current camera/runtime seams, locking the real starting `OrbitControls` mouse map, the absence of an existing viewer double-click camera path, and `Viewer.frameAll()` as the first zoom-fit target so the implementer does not have to guess those details
124. 2026-03-22 20:42: Logged the new standalone `[5.0H-2] Fusion-Style Model Viewport Camera Baseline` future phase doc, updated `Camera_Controls-Index.md` to list it under the `Camera-Controls` family, and refreshed the docs map so the next camera-controls cut now has a dedicated implementation-ready planning surface after the shipped sketch-camera ownership block
123. 2026-03-22 20:27: Logged the shipped `[5.0H-1] Sketch Draw Camera Blocking` follow-up that moves the standalone phase record into `Camera-Controls/Shipped/`, marks the camera family and roadmap state forward after the implementation landed, and refreshes the docs map so the first camera/input cleanup cut now reads as completed history instead of a future planning surface
122. 2026-03-22 19:56: Logged the `[5.0H-1] Sketch Draw Camera Blocking` follow-up that tightens its standalone phase doc around the real viewer/runtime seams, replacing the earlier generic input-routing guesses with a narrower implementation path through `Viewer`, `CameraController`, and the temporary orbit bridge while keeping the cut scoped to blocking camera `LMB` ownership during `Sketch Draw`
121. 2026-03-22 19:50: Logged the new standalone `Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md` future doc, updated `Worker.md` to point at it from the Worker family summary, and refreshed the docs map so the dispatcher-boundary cleanup now has its own implementation-ready planning surface after the graph-native request/build-unit and lane/intent groundwork
120. 2026-03-22 19:40: Logged the small shipped-doc cleanup for `Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md`, correcting the phase-order framing so the record now reads as early lane-and-intent groundwork that landed after the shipped audit but before the still-pending `5.3A-2` request/build-unit replacement work
119. 2026-03-22 19:29: Logged the `5.3A-2` worker-contract follow-up that refreshes the future phase doc for the post-`5.3A-3` world, rewriting it as a request-plus-result-first implementation phase that replaces the legacy `BoxParams` request seam under the shipped lane-and-intent scaffold while also updating `Worker.md` so the local phase ladder describes the same corrected sequencing
118. 2026-03-22 19:19: Logged the `Worker.md` phase-ladder sync that replaces the older generic `Phase 1` through `Phase 7` headings with the real `[5.3A-1]` through `[5.3A-7]` titles, updates the local checklist state to match the shipped `5.3A-3` lane work, and points the relevant items at their standalone future/shipped Worker phase records
117. 2026-03-22 19:15: Logged the shipped `[5.3A-3]` worker lane-definition cut that moves `Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md` into `Worker/Shipped/`, updates `Worker.md` to point at the shipped record, marks the roadmap worker lane subphase complete, and refreshes the docs map to the new shipped path
116. 2026-03-22 19:05: Logged the new standalone `Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md` future doc, updated `Worker.md` to point at it from the family index, and refreshed the docs map so the lane-definition and execution-intent follow-up now has its own implementation-ready planning surface under the Worker family
115. 2026-03-22 18:18: Logged the `5.3A-2` worker-contract follow-up that rewrites the future phase doc into a decision-complete contract spec, locking `output entry` as the first canonical build unit, keeping `executionIntent` minimal in this phase, and replacing the earlier suggestion-driven sections with one explicit request/result target plus a hard compatibility boundary for later worker cleanup phases
114. 2026-03-22 18:09: Logged the new standalone `Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md` future doc, updated `Worker.md` to point at it from the family index, and refreshed the docs map so the next worker-contract phase now has its own implementation-ready planning surface after the shipped audit
113. 2026-03-22 18:04: Logged the shipped `[5.3A-1]` worker audit pass that converts the first worker phase doc into a completed read-only audit record, moves it from `Worker/Future/` to `Worker/Shipped/`, updates `Worker.md` to point at the shipped record, marks the roadmap worker audit subphase complete with the parent worker lane still partial, and refreshes the docs map to the new shipped path
112. 2026-03-22 17:57: Logged the `Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md` follow-up that makes the first worker phase more implementation-ready, locking the concrete audit questions by file, required written outputs, handoff artifact shape for `[5.3A-2]`, suggested verification commands, and stricter definition-of-done criteria
111. 2026-03-22 14:57: Logged the worker-family follow-up that renames the roadmap mini-family to `[5.3A]` with subphases `[5.3A-1]` through `[5.3A-7]`, adds `Future/` and `Shipped/` under `docs/Human-Plans/Architecture/Worker/`, creates the standalone `Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md` planning surface, and refreshes the docs map so the worker family now mirrors the newer AppShell-style umbrella-plus-phase-doc structure
110. 2026-03-22 14:57: Logged the roadmap follow-up that expands `[5.3] Build Sequencing, Build Bars, And Output Build Control` into the real worker/build mini-family `[5.3-1]` through `[5.3-7]`, so the worker audit, graph-native contract, dispatcher cleanup, legacy startup removal, stronger Browser/Console build truth, and final cutover now have one concrete roadmap home under the existing build lane
109. 2026-03-22 14:56: Logged the new standalone `[5.0H-1] Sketch Draw Camera Blocking` future phase doc, updated `Camera_Controls-Index.md` to list it under the `Camera-Controls` family, and refreshed the docs map so the first camera-controls cut now has a dedicated implementation-ready planning surface under `Future/`
108. 2026-03-22 14:57: Logged the `Worker.md` workspace-modes boundary note that shell placement must preserve one shared worker/build truth for `Browser` and `Console`, while keeping the actual tiled/windowed/pop-out layout follow-through in the separate `Workspace Modes` phase family instead of widening the worker lane
107. 2026-03-22 14:54: Logged the `Worker.md` startup-legacy cleanup follow-up that ties removal of fallback `baseplate` / `heelKick` / `toeHook` boot output to the existing worker phases, so the graph-native cutover now explicitly forbids legacy default instances, legacy build-stats ordering, and legacy startup narration from surviving the worker cleanup
106. 2026-03-22 14:44: Logged the `Worker.md` follow-up that makes the downstream `Browser` and `Console` obligations explicit, so the worker architecture now says separate-build identity must survive into tree rows and transcript/progress surfaces without flattening child rebuilds into fake parent rebuild language
105. 2026-03-22 14:44: Logged the `Worker.md` sequencing clarification that separate-build ownership and the graph-native request contract must land before any broad worker refactor, and that `Pasta Path` timeline scrubbing should be treated as a later downstream consumer of that cleaner build seam instead of driving the first worker cut
104. 2026-03-22 14:18: Logged the `Pasta-Path-Index.md` follow-up that adds `#### Suggestion` blocks under every open `Questions / Decisions` item, so the timeline concept now carries concrete recommended answers for placement, first-cut scope, mapping, branching, sync, and representation instead of leaving those choices as neutral prompts only
103. 2026-03-22 14:15: Logged the `Pasta-Path-Index.md` follow-up that adds a dedicated `Questions / Decisions` section, turning the main unresolved concept choices into explicit `### [ ] qN - ...` headings so the timeline idea can be tightened incrementally instead of leaving the key decisions implied across the rest of the doc
102. 2026-03-22 14:12: Logged the `Pasta-Path-Index.md` follow-up that adds the first `Fusion` visual-takeaways guidance, so the timeline concept now explicitly borrows the low-profile footer density, horizontal step-strip readability, and strong playhead emphasis of a Fusion-style history bar without pretending ParaHook has the same strictly linear feature stack
101. 2026-03-22 14:12: Logged the shipped `5.0F-2` AppShell follow-up that marks the window/dock-host extraction complete, moves the standalone phase record into `AppShell/Shipped/`, refreshes `AppShell-Index.md` to the fully shipped `[5.0F]` state, updates the roadmap checkboxes, and syncs the docs map to the shipped path
100. 2026-03-22 14:10: Logged the `Pasta-Path-Index.md` follow-up that adds the first workspace-placement suggestion, locking the direction that `Pasta Path` should likely live as another top-left `+/e/-` style surface mode with a slim full-width bottom footprint and only grow taller when parallel branch rows are actually needed
99. 2026-03-22 14:06: Logged the new `Pasta-Path` architecture family setup, including the new folderized `Pasta-Path-Index.md` umbrella note plus reserved `Future/` and `Shipped/` folders and the docs-map registration, so the graph-to-timeline hybrid history concept now has one canonical planning home under `docs/Human-Plans/Architecture/`
98. 2026-03-22 14:04: Logged the `Nodes-Index.md` follow-up that moves the planned sketch-plane `Flip` boolean out of `Transform` and under `Plane`, so the `Geometry/Sketch` input hierarchy now matches the intended surface layout where plane orientation owns the flip toggle and `Transform` stays focused on `Vec3` motion channels
97. 2026-03-22 14:00: Logged the `Nodes-Index.md` follow-up that renames its local four-phase ladder to the roadmap-owned `[3.2A-1]` through `[3.2A-4]` ids, so the node-family planning surface now aligns directly with the new `[3.2A]` mini-family structure in `roadmap.md` instead of still using generic `Phase 1` through `Phase 4` labels
96. 2026-03-22 13:56: Logged the roadmap follow-up that turns `[3.2A] Data Types And Sketch Foundation` into a parent mini-family, preserving the shipped original cut as `[3.2A-0]` and adding open `[3.2A-1]` through `[3.2A-4]` subphases so the `EWR` and geometry-node hierarchy planning from `Nodes-Index.md` now has a real roadmap home under the foundational geometry lane
95. 2026-03-22 14:00: Logged the `Nodes-Index.md` follow-up that breaks the current node-family and `EWR` direction into four execution phases, using the fewest safe phases that still separate the shared row-model foundation, the first `Geometry/Sketch` vertical slice, the downstream geometry-node follow-ons, and the later registry/legacy cleanup pass while adding explicit `Questions / Decisions` and `Suggestion` blocks for each phase
94. 2026-03-22 13:49: Logged the `Nodes-Index.md` follow-up that rewrites the full `Geometry Nodes` section into a cleaner EWR-first family map, grouping each geometry node by `inputs`, `outputs`, and relevant expandable hierarchy so the geometry block now reads as one coherent wireable-node contract
93. 2026-03-22 13:43: Logged the `Nodes-Index.md` follow-up that adds `Expandable Wireable Rows` (`EWR`) as the user-facing term for the expandable pin-bearing row hierarchy, pairing it with the code-facing `WireableRowNode` and `WireableRowTree` names so the new row-tree model has one canonical vocabulary
92. 2026-03-22 13:36: Logged the `Nodes-Index.md` follow-up that expands `SketchPlane > Transform` into the locked 3D row tree, so `Move` and `Rotate` now read as `Vec3 -> X/Y/Z Float`, later `Scale` is reserved as another `Vec3`, and `Flip` is treated as `Boolean`
91. 2026-03-22 13:31: Logged the `Nodes-Index.md` follow-up that expands `SketchPoint = Vec2` into `X` and `Y` float children inside the simplified sketch hierarchy, so the compact row tree now explicitly supports one more level of direct numeric expansion instead of leaving `Vec2` opaque
90. 2026-03-22 13:28: Logged the AppShell planning follow-up that refreshes `AppShell-Index.md` to the post-`5.0F-1` state, adds the new standalone `5.0F-2` future phase doc, and updates the docs map so the remaining browser/editor window-and-dock extraction has a dedicated implementation-ready planning surface
89. 2026-03-22 13:29: Logged the `Nodes-Index.md` follow-up that expands the simplified `Geometry/Sketch` input side, breaking `SketchPlane` and `Sketch Draw` into clearer nested substructure so the sketch node now reads as one compact input/output tree instead of a flat pair of input labels plus a deep output-only hierarchy
88. 2026-03-22 13:26: Logged the `Nodes-Index.md` follow-up that expands the simplified `Geometry/Sketch` hierarchy so `SketchLine`, `SketchCircle`, `SketchRectangle`, and `SketchPLine` each now show a clearer internal row breakdown, making the wireable sketch-object tree more concrete
87. 2026-03-22 13:23: Logged the `Nodes-Index.md` follow-up that tightens the simplified `Geometry/Sketch` hierarchy example, correcting sketch-point leaf typing from `Vec3` to `Vec2`, normalizing `Point A / Point B` naming, and fixing the nested `SketchPLine` indentation so the compact row-tree read stays consistent
86. 2026-03-22 13:19: Logged the `Spaghetti-Types.md` alignment pass that updates its future sketch/geometry planning to match `Nodes-Index.md`, shifting `Sketch` toward a `SketchProfiles`-first expandable hierarchy, adding the composite-versus-atomic sketch-object rule, and tightening the future geometry-node wording around the current `Geometry/*` family
85. 2026-03-22 13:14: Logged the `Nodes-Index.md` follow-up that adds the wireable sketch-object hierarchy under `Geometry/Sketch`, locking the direction that `SketchProfiles` is the one top-level profile output and that expandable profile/entity/point rows are derived reference layers without demoting first-class composite entities like `Rectangle` and `PLine`
84. 2026-03-22 13:10: Logged the shipped `5.0F-1` AppShell follow-up that marks the runtime-host phase complete, moves the standalone phase record into `AppShell/Shipped/`, updates the family index and roadmap state, and refreshes the docs map to the shipped path after the `RadioRuntimeHost` extraction landed
83. 2026-03-22 13:10: Logged the `Nodes-Index.md` follow-up that reformats the `Geometry Nodes` checklist into a nested `inputs / outputs` contract, so `Geometry/Sketch`, `Geometry/Extrude`, and planned `Geometry/Loft` now read as compact node-interface summaries instead of only flat family names
82. 2026-03-22 13:06: Logged the `Nodes-Index.md` correction that broadens the bottom checklist from geometry-only into the real live node registry, keeping `System/OutputPreview` and `Output/Assembled` in the main inventory and trimming the mistaken primitive-node entries out of the `[L]` legacy list
81. 2026-03-22 13:00: Logged the `Nodes-Index.md` follow-up that turns the new bottom `Nodes` and `Legacy` sections into real checklists, separating current/planned geometry node families from `[L]` legacy nodes and the still-live `toeLoft` seam that should be removed later
80. 2026-03-22 12:49: Logged the new `Nodes-Index.md` umbrella note, updated the docs map, and captured the planning decision that AutoCAD-style command growth is currently a `Geometry/Sketch` backlog while `Extrude` and `Loft` still need their own dedicated node-family docs
79. 2026-03-22 12:40: Logged the AppShell family refresh that reworks `AppShell-Index.md` around the live runtime-versus-shell seam read, adds the new standalone `5.0F-1` future phase doc, updates the docs map, and records the extraction-order decision in the active Codex notes so the AppShell lane now has a roadmap-aligned index plus an implementation-ready first subphase plan
78. 2026-03-22 12:32: Logged the camera-controls follow-up that adds the new `[5.0H] Camera Controls And View Input Ownership` roadmap family with `[5.0H-1]` through `[5.0H-5]`, reworks the moved `Camera_Controls-Index.md` into the umbrella family index, and updates the docs map to the new folderized camera-controls path
77. 2026-03-22 12:31: Logged the roadmap follow-up that checks off `[5.0G]`, `[5.0G-1]`, and `[5.0G-2]` after the theme split and cleanup both landed, so the live lane now reads as fully completed instead of leaving the shipped theme-system work only implied by changelog and architecture updates
76. 2026-03-22 12:26: Logged the `v15Theme.md` follow-up that marks `[5.0G-2]` complete after the CSS owner-cleanup pass landed, so the architecture note now reflects the current post-cleanup theme state instead of still describing the second `:root`, `Spaghetti` override chronology, and `base.css` owner leaks as open work
75. 2026-03-22 12:16: Logged the `Camera_Controls.md` follow-up that breaks the new camera/input architecture into five safe rollout phases, so the note now separates `Sketch Draw` ownership blocking, Fusion-style model gestures, graph-canvas coexistence, console camera commands, and the later shared viewport-input owner model instead of leaving one large unsequenced cleanup block
74. 2026-03-22 12:16: Logged the `Camera_Controls.md` follow-up that adds the first AutoCAD-style camera-console suggestions, so the architecture note now recommends a `zoom` / `z` command family with `All`, `Extents`, `Previous`, `Window`, and `Object` sub-options plus simple `pan` and `orbit` view commands
73. 2026-03-22 12:16: Logged the `Camera_Controls.md` follow-up that adds the `Ctrl` pass-through suggestion for combined graph-plus-model work, so the architecture note now recommends canvas-local zoom/pan/edit by default while `Ctrl + wheel` and `Ctrl`-modified middle-mouse gestures explicitly forward camera navigation to the model viewport
72. 2026-03-22 12:11: Logged the `Camera_Controls.md` follow-up that separates `Spaghetti Editor` canvas navigation from model-view camera navigation, so the architecture note now explicitly keeps pointer-centered canvas zoom, canvas pan, and graph-edit `LMB` ownership from being stolen by viewer camera controls while the user is working in the node canvas
71. 2026-03-22 12:06: Logged the `v15Theme.md` follow-up that marks `[5.0G-1]` complete and makes `[5.0G-2]` implementation-ready around the live post-split cleanup hotspots, while also capturing the same phase-boundary decision in the active Codex notes so the theme lane now treats the next pass as in-place cleanup instead of another decomposition phase
70. 2026-03-22 11:53: Logged the `Camera_Controls.md` follow-up that locks the preferred baseline gesture map toward Fusion-style navigation, so the architecture note now treats scroll as mouse-point zoom, `MMB` drag as pan, `Shift + MMB` drag as orbit, and `MMB` double-click as zoom-fit while preserving plain `LMB` for authoring interactions
69. 2026-03-22 11:53: Added the new `Camera_Controls.md` architecture note, updated the docs map, and captured the viewport input-ownership direction in the active Codex notes so camera navigation cleanup now has one canonical planning surface instead of living only in sketch-selection chat context
68. 2026-03-22 11:48: Logged the shipped `3.2B-DrawSketch-3` selection-and-delete implementation, moved the standalone phase record into `Sketch/Shipped/`, and synced `Sketch.md` plus `roadmap.md` so the sketch docs now treat idle entity selection, `Window` / `Crossing` box behavior, and delete as landed `Sketch Draw` behavior instead of future planning
67. 2026-03-22 11:40: Logged the `v15Theme.md` rewrite that turns the initial architecture note into a much more implementation-ready two-phase plan, locking the current code seam read, the recommended `src/app/theme/` folder/file layout, and the exact low-risk split strategy without adding more roadmap phases
66. 2026-03-22 11:15: Logged the `3.2B-DrawSketch-3` implementation-readiness follow-up that separates committed entity selection from profile review, locks it onto idle `Sketch Draw`, and records the current code seams plus replace-only selection-set behavior for the first cut
65. 2026-03-22 11:03: Logged the `3.2B-DrawSketch-3` correction that moves selection out of a peer tool slot and into idle/review `Sketch Draw`, so the active sketch docs now match the desired AutoCAD-like flow where draw-tool commits fall back to selection and `Enter` / `Previous` re-arm the last command
64. 2026-03-22 10:58: Logged the `3.2B-DrawSketch-3` follow-up that adds blue `Window Selection` and green `Crossing Selection`, so the active sketch docs now treat delete as operating on a real selection set instead of the earlier single-select-only wording
63. 2026-03-22 10:43: Logged the `3.2B-DrawSketch-3` refocus from a stale parent-bucket placeholder into `Selection And Delete`, so the active sketch docs and roadmap now treat that phase as the first single-entity selection plus delete pass instead of a broad mixed editing umbrella
62. 2026-03-22 10:35: Logged the new `v15Theme.md` architecture note and updated the docs map so the repo now has one canonical planning surface for the oversized app theme stylesheet, its target split strategy, and the narrow `[5.0G]` cleanup direction before any implementation split starts
61. 2026-03-22 10:35: Logged the shipped `3.2B-DrawSketch-5` circle implementation, moved the standalone phase record into `Sketch/Shipped/`, and synced `Sketch.md` plus the parent `DrawSketch-3` bucket so the sketch docs now treat `Circle` / `cc` center-then-radius draw sessions as landed behavior instead of future planning
60. 2026-03-22 10:23: Logged the roadmap follow-up that adds `[5.0G] Theme System And Stylesheet Decomposition` plus the new `[5.0G-1]` and `[5.0G-2]` subphases, so the oversized `v15Theme.css` cleanup now has a real bridge-phase home under the pre-workspace shell lane instead of being buried inside `[5.0E]` naming cleanup or `[5.0F]` AppShell extraction
59. 2026-03-22 10:20: Logged the `3.2B-DrawSketch-5` viewport-flow clarification that makes the circle phase implementation-ready at the interaction level, locking the live console path as `Center > Vec2` then `Radius > Float`, with mouse movement updating those values in the viewport and clicks acting as the commit for center then radius
58. 2026-03-22 10:15: Logged the `3.2B-DrawSketch-5` correction that changes the primary circle typed flow from `cc > Vec2 > Vec2` to `cc > Vec2 > Float`, so the first circle phase now reads as center-then-radius for the user while still allowing viewport radius-witness picks and preserving the current internal `center + edge` storage shape
57. 2026-03-22 10:10: Logged the `3.2B-DrawSketch-5` follow-up that makes `Circle Tool And Center-Radius Workflow` implementation-ready, locking the typed flow as `cc > Vec2 > Vec2`, the first committed `center + edge` circle shape, the current draw-tool routing gap, and the first-cut boundary that excludes diameter/tangent variants
56. 2026-03-22 08:35: Logged the shipped `3.2B-DrawSketch-4` rectangle implementation, moved the standalone phase record into `Sketch/Shipped/`, and synced `Sketch.md` plus the active Codex notes so the sketch docs now treat `Rectangle` / `rec` two-point draw sessions as landed behavior instead of future planning
55. 2026-03-22 08:06: Logged the `3.2B-DrawSketch-4` follow-up that makes `Rectangle Tool And Corner Workflow` implementation-ready, locking the typed flow as `rec > Vec2 > Vec2`, immediate second-point commit, axis-aligned two-corner geometry, and the current command/helper gaps that the runtime cut must close
54. 2026-03-22 07:58: Logged the sketch-doc numbering cleanup that renames the new draw-tool follow-ons from `3A / 3B / 3C` to `[3.2B-DrawSketch-4]`, `[3.2B-DrawSketch-5]`, and `[3.2B-DrawSketch-6]`, so the `DrawSketch` family now reads as one clean numeric sequence instead of mixing numbered and letter-suffixed phase ids
53. 2026-03-22 07:47: Logged the sketch-planning follow-up that splits the broad `DrawSketch-3` bucket into concrete `Rectangle`, `Circle`, and endpoint-snap subphases, so the next AutoCAD-like sketch tool work now has dedicated future docs, updated architecture notes, and a durable Codex planning note instead of staying buried in one mixed placeholder
52. 2026-03-21 23:38: Logged the shipped `3.2B-DrawSketch-2` implementation, moved the standalone phase record into `Sketch/Shipped/`, and synced `Sketch.md` plus `roadmap.md` so the docs now treat multi-step `Line` / `PLine` command sessions, live `P1 / P2 / P3` console status, and local `Previous` / `undo` as landed runtime behavior instead of future planning
51. 2026-03-21 22:24: Logged the shipped `3.2B-S7` transform-history implementation and moved the phase record into `Sketch/Shipped/`, so the sketch docs now record persistent toolbar-visible move history, viewport history segments, and the shipped `Merge History` / `Lock` behavior instead of leaving `S7` in future planning
50. 2026-03-21 22:00: Logged the shipped `3.2B-S8` viewport shortcut follow-up in `CHANGELOG.md`, so the `M` key now re-enters move correctly after mouse-driven sketch-plane move accepts instead of staying stuck when the session returns to root with translate still active
49. 2026-03-21 19:29: Logged the shipped `3.2B-S8` move follow-up in `CHANGELOG.md`, so the new local `Move Again` action and `M` alias under `SketchPlane > Move` now have a permanent completed-work record alongside the runtime tests
48. 2026-03-21 19:14: Logged the new standalone `Future/Sketch_Phase 3.2B-S8 - SketchPlane Move Again Re-Arm.md`, so the local `Move Again` choice and `M` alias under `SketchPlane > Move` now have a clean future phase home instead of being mixed into shipped `S6` or transform-history planning
47. 2026-03-21 19:08: Logged the `3.2B-S7` follow-up that makes `Merge History` destructive in the first cut with no dedicated unmerge action, and keeps locked-entry meaning in the toolbar/path logic only without special viewport styling
46. 2026-03-21 19:04: Logged the `3.2B-S7` row-label clarification that transform-history entries should print signed per-step diffs like `Vec(+3, +6, -5)`, so the toolbar reads as a move path explanation instead of only a list of absolute landed points
45. 2026-03-21 19:00: Logged the `3.2B-S7` wording clarification that the top-right compaction action should be called `Merge History`, separating it cleanly from the section chevron collapse/expand behavior in the `Transform History` toolbar section
44. 2026-03-21 18:56: Logged the `3.2B-S7` origin-anchor clarification, so `Origin` is now explicitly treated as a persistent always-preserved first history point that survives collapse without acting like a normal lock-toggle row
43. 2026-03-21 18:54: Logged the `3.2B-S7` persistence clarification, so sketch-plane transform history is now explicitly treated as kept placement state that restores when the user leaves and later re-enters `SketchPlane` instead of resetting as a temporary session-only chain
42. 2026-03-21 18:49: Logged the new standalone `Future/Sketch_Phase 3.2B-S7 - SketchPlane Transform History.md`, so the committed sketch-plane point-chain, toolbar history section, collapse rules, and locked-entry behavior now have their own implementation-ready phase doc instead of living only inside the parent sketch architecture index
41. 2026-03-21 18:46: Logged the `3.2B-S7` clarification that sketch-plane transform history should read as a committed point-to-point path, so the toolbar rows and viewport guide lines now explicitly preserve the full landed sequence `origin -> p1 -> p2 -> ...` instead of only implying separate translation diffs
40. 2026-03-21 18:37: Logged the roadmap follow-up that adds `[5.0F] AppShell Cleanup And Host Seam Extraction` plus the new `[5.0F-1]` and `[5.0F-2]` subphases, so AppShell overload cleanup now has a real bridge-phase home under the pre-workspace shell lane instead of being left implicit between `[5.0E]` and `[5.1]`
39. 2026-03-21 18:41: Logged the new `3.2B-S7` sketch follow-on in `Sketch.md`, so the sketch architecture now records a toolbar-visible `Transform History` direction for committed sketch-plane move steps, matching viewport path lines plus later collapse and locked-entry behavior
38. 2026-03-21 18:24: Logged the new `AppShell-Index.md` architecture note and updated the docs map so the repo now has one canonical planning surface for the current `AppShell` overload, the target shell vision, and the first extraction phases before any standalone AppShell phase docs exist
37. 2026-03-21 18:18: Logged the `Radio.md` follow-up that clarifies `Phase 11` so trustworthy provider-backed waveform display is allowed for `SoundCloud` as a limited visual aid, meaning the toolbar may show a SoundCloud-style waveform/fill/progress strip without claiming exact analyzable waveform data
36. 2026-03-21 17:50: Logged the shipped sketch-plane move-guide follow-up in the permanent changelog, so the new command-origin marker and guide-line behavior now has a canonical completed-work record instead of living only in code and tests
35. 2026-03-21 13:17: Logged the shipped `3.2B-S6` sketch move-axis implementation, moving the phase record into `Shipped/` and syncing `Sketch.md` plus `roadmap.md` so the docs now treat `SketchPlane > Move > X / Y / Z` as landed runtime behavior instead of an open follow-on
34. 2026-03-21 13:11: Logged the MkDocs follow-up that moves the current-page heading tree to the right-side TOC, so the left sidebar can stay dedicated to the browseable docs tree
33. 2026-03-21 13:06: Logged the MkDocs follow-up that publishes the full non-archive `/docs` tree in the inferred sidebar, so the live site now behaves like a browseable docs tree instead of a two-page starter shell
32. 2026-03-21 13:03: Logged the `3.2B-S6` sketch follow-up that locks the phase as implementation-ready, so the doc now calls out the current runtime gap precisely, defines a first recommended axis-leaf state shape, adds concrete store/console/overlay implementation steps, and records a targeted verification matrix
31. 2026-03-21 13:01: Logged the `3.2B-S6` sketch follow-up that locks the first off-snap confirm prompt shape, so the phase now uses `confirm <value> off snap` with `[confirm, deny]` choices and an assisted `confirm` prefill instead of a looser warning sentence
30. 2026-03-21 12:56: Logged the `3.2B-S6` sketch follow-up that locks snap behavior inside move-axis leaves, so the phase now says axis-leaf dragging must still honor move snap and typed off-snap values require one extra confirmation message before the exact number can be applied
29. 2026-03-21 12:52: Logged the `3.2B-S6` sketch follow-up that locks the first accepted axis-entry float grammar, so the phase now explicitly accepts signed numbers plus shorthand decimal forms like `.1` and `-.1` for `Move > X / Y / Z`
28. 2026-03-21 12:51: Logged the `3.2B-S6` sketch follow-up that clarifies axis-leaf interaction, so the phase now states directly that `Move > X / Y / Z` should keep live mouse dragging active while first typed input still clears and replaces the current assisted value for direct numeric entry
27. 2026-03-21 12:35: Logged the live MkDocs Phase 1 setup, covering the new root config, docs landing page, dependency file, and the planning/doc-index updates that mark the baseline docs-site pass complete
26. 2026-03-21 12:33: Logged the `mkDocs.md` follow-up that turns `Phase 1` into an implementation-ready execution spec, locking the minimal first-pass config, commands, files, and verification steps
25. 2026-03-21 12:41: Logged the `3.2B-6` sketch follow-up that makes the browser hierarchy explicit, so the phase doc now states directly that `Sketches` is a sibling family beside `Assembly` under `Content` rather than an assembly child
24. 2026-03-21 12:36: Logged the sketch-doc reorganization that splits standalone sketch phase docs into `Shipped/` and `Future/` subfolders, so the sketch architecture index now has a clearer status-based phase layout instead of one mixed planning/history folder
23. 2026-03-21 12:25: Logged the `mkDocs.md` follow-up that adds a bounded one-phase rollout plan, so the repo now treats the first MkDocs adoption step as baseline setup rather than a mixed setup-plus-polish migration
22. 2026-03-21 12:23: Logged the `mkDocs.md` follow-up that records the current-page heading-tree decision and the native navigation limits, so the plan now distinguishes practical TOC navigation from true editor-style folding
21. 2026-03-21 12:23: Logged the first shipped `[3.2B-6]` sketch ownership/browser cut, updating the sketch architecture/phase docs and roadmap so they now record that browser-visible `Sketches` rows are implemented while later export remains deferred
20. 2026-03-21 12:18: Logged the `mkDocs.md` follow-up that adds a Material for MkDocs starter config block and notes the current `tags_file` deprecation so the planning doc now captures a safer modern baseline
19. 2026-03-21 12:15: Logged the new `mkDocs.md` planning note under `docs/Phase-Plans/` and updated the docs map so the repo has a dedicated place to capture a future MkDocs setup
18. 2026-03-21 10:04: Logged the `Audio-Patchbay.md` follow-up that adds `FM Voice` as a first-class early node candidate and explains why FM synthesis is a strong flagship generated-source direction that matches ParaHook's broader generator identity and the shared node-and-wire model
17. 2026-03-21 09:59: Logged the `Audio-Patchbay.md` follow-up that docks the tempting `SoundCloud proxy into full effects graph` idea, documenting both the technical limitation and the policy-risk warning so the repo has a permanent note against using SoundCloud as the main legal/technical basis for patchbay FX processing
16. 2026-03-21 09:41: Logged the `Audio-Patchbay.md` follow-up that locks the naming split so `Audio Patchbay` stays the umbrella system name while `Spaghetti Sounds` becomes the preferred UI-level toolbar label
15. 2026-03-21 09:31: Logged the new `Audio-Patchbay.md` architecture idea doc and updated the docs map so the broader post-`Radio` node-and-wire audio editor vision now has a dedicated canonical planning surface under `docs/Human-Plans/Architecture/`
14. 2026-03-21 08:46: Logged the `Radio.md` follow-up that marks `Phase 10` complete after the shared toolbar absorbed the horizontal sampler row, its shipped controls, step disclosure state, and per-step time-position editing into one merged green radio/sampler surface
13. 2026-03-21 08:34: Logged the `Radio.md` follow-up that tightens `Phase 10` so the primary per-step control in the vertical detail section is a time-position `ParaSlider` for moving each step to another point in the song
12. 2026-03-21 08:33: Logged the `Radio.md` follow-up that tightens `Phase 10` again so the merged toolbar must preserve the current horizontal sampler pattern and shipped controls/buttons, while also adopting the sampler's green visual language
11. 2026-03-20 17:34: Logged the `Radio.md` follow-up that tightens `Phase 10` into an implementation-ready shared-toolbar execution spec for merging the sampler UI back into the radio toolbar without forking the existing sampler runtime/state model
10. 2026-03-20 17:27: Logged the `Radio.md` follow-up that adds a new shared-toolbar sampler expansion phase for merging `Sampler` back into the `Radio` toolbar as a disclosure tree with sibling sections, a collapsible steps block, and expandable per-step detail rows
9. 2026-03-20 17:24: Logged the new Codex context note that captures the collapsible `Radio` toolbar tree for the future sampler, including global BPM, note-repeat defaults, track lanes, and expandable per-step controls
8. 2026-03-20 17:16: Logged the `Radio.md` follow-up that tightens `Phase 9` into an implementation-ready sampler execution spec tied to the current live store/runtime/UI seams
7. 2026-03-20 17:12: Logged the `Radio.md` follow-up that adds a new sampler phase with one locked ownership question plus an implementation-ready spec, so the next radio-adjacent build step is now spelled out inside the main radio architecture note
6. 2026-03-20 16:57: Logged the new `Sampler.md` architecture note and updated the docs map so the simple sequencer plus note-repeat direction now has a dedicated canonical planning surface under `docs/Human-Plans/Architecture/`
5. 2026-03-20 15:28: Logged the `Radio.md` follow-up that adds console-driven `OpenToolbar` / `CloseToolbar` commands to the `Phase 7` radio toolbar plan
4. 2026-03-20 15:24: Logged the `Radio.md` follow-up that aligns `Phase 7` to the shared toolbar template layout from `Toolbar.md`
3. 2026-03-20 15:21: Logged the `Radio.md` follow-up that makes the `Phase 7` toolbar spec explicitly require real transport readout and a seekable `ParaSlider`
2. 2026-03-20 15:18: Logged the `Radio.md` update that turns `Phase 7` from a placeholder into an implementation-ready toolbar/control-surface spec
1. 2026-03-18 16:09: Created this file as the canonical permanent log for document changes and split docs tracking away from `docs/CHANGELOG.md`

### Purpose

This file is the canonical permanent history for document changes in `/20/parahook`.

Use it for:
- docs created, renamed, reorganized, or rewritten under `docs/`
- `README.md` updates
- architecture, planning, and repo-rules documentation changes
- documentation-structure and canonical-source updates

Do not use it for:
- shipped code, schema, config, or runtime behavior changes
- temporary chill-mode batch logging
- active task checklists that belong inside their own task docs

### Doc-Log Rules

- each permanent doc-log entry in `## Doc Body` starts with an HTML divider comment
- the main entry heading for new entries should use `###` in this shape:
  - `### [NNN] - YYYY-MM-DD HH:MM - `DOC - Title``
- increment `[NNN]` by `1` for each new permanent entry
- add new permanent entries at the top of the live entry list
- directly under the entry wrapper, include one headerless summary line in this shape:
  - `HUMAN SUMMARY: 1-3 sentences about what this document change did`
- standard entry subsections use `####`
- prefer this subsection order:
  - `HUMAN SUMMARY: ...`
  - `#### Scope`
  - `#### Summary`
  - `#### Files Changed`
  - `#### Notes`
- when chill mode is active, use `docs/Chill-Log.md` for rapid doc-batch logging and consolidate later into `docs/Doc-Log.md` when needed
- keep numbering sequential unless the user explicitly asks for a renumber pass

## Doc Body

### [268] - 2026-03-25 20:41 - `DOC - Tighten Worker 5.3A-7 Final Cutover Phase Against Live Code`

Tightened the standalone `[5.3A-7] Graph-Native Worker Cutover And Legacy Contract Deletion` phase doc against the live shared contract, dispatcher, app/runtime, worker entry, compatibility adapter, and viewer seams so the final worker cutover now reads as an implementation-ready deletion spec with explicit API removals, migration order, concrete file targets, and a verification bar grounded in the actual remaining `BoxParams`, `assemble`, and compatibility-wrapper surfaces.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-7 - Graph-Native Worker Cutover And Legacy Contract Deletion.md`
- `docs/Doc-Log.md`

### [267] - 2026-03-25 20:37 - `DOC - Lock Worker 5.3A-7 Decisions And Create Future Phase Doc`

Locked `q1` through `q5` under `[5.3A-7] Graph-Native Worker Cutover And Legacy Contract Deletion` in the Worker umbrella doc, created the standalone future phase doc for that final worker cutover, and refreshed the docs map so the Worker family now points at one implementation-ready planning surface for outer-edge-only translation, bundle-first consumer cutover, `assemble` deletion, product-neutral core boundaries, and the deletion-grade verification bar.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Worker.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-7 - Graph-Native Worker Cutover And Legacy Contract Deletion.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

### [266] - 2026-03-25 20:22 - `DOC - Add Worker 5.3A-7 Cutover Questions`

Expanded the open `[5.3A-7] Graph-Native Worker Cutover And Legacy Contract Deletion` section in the Worker umbrella doc with a first `Questions / Decisions` block, adding focused open questions plus suggestions around final translation ownership, bundle-versus-flat-selector cutover, the fate of `assemble`, where any surviving product adapters should live after legacy deletion, and the verification bar required to prove the graph-native worker cutover is actually complete.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Worker.md`
- `docs/Doc-Log.md`

### [265] - 2026-03-25 20:13 - `DOC - Ship Worker 5.3A-6 Docs And Roadmaps`

Cleaned up the Worker architecture docs after the shipped `[5.3A-6] Result Semantics, Browser Truth, And Console Truth` implementation by moving the standalone phase record from `Worker/Future/` into `Worker/Shipped/`, updating the Worker umbrella plus both roadmap trackers to the post-`5.3A-6` state, and refreshing the docs map so the Worker subtree now lists the result-semantics phase as landed history before the remaining `[5.3A-7]` cutover.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Worker.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-6 - Result Semantics, Browser Truth, And Console Truth.md`
- `docs/Human-Plans/roadmap/Architecture-roadmap.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`

### [264] - 2026-03-25 19:37 - `DOC - Tighten Worker 5.3A-6 Result Semantics Phase Against Live Code`

Tightened the standalone `[5.3A-6] Result Semantics, Browser Truth, And Console Truth` phase doc against the live shared result, app acceptance, spaghetti runtime, Browser output-surface, and worker transcript seams so the phase now reads as an implementation-ready execution spec with a concrete `BuildResult` wire-envelope recommendation, explicit bundle and entry fields, migration order, and exact verification files.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-6 - Result Semantics, Browser Truth, And Console Truth.md`
- `docs/Doc-Log.md`

### [263] - 2026-03-25 19:37 - `DOC - Lock Worker 5.3A-6 Result Semantics Decisions And Create Future Phase Doc`

Locked `q1` through `q5` under `[5.3A-6] Result Semantics, Browser Truth, And Console Truth` in the Worker umbrella doc, created the standalone future phase doc for that next semantic-strengthening cut, and refreshed the docs map so the Worker family now points at one implementation-ready planning surface for build-result bundles, explicit rebuilt/retained/evicted truth, result-class coexistence, Browser parent honesty, and Console-as-narrator ownership.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Worker.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-6 - Result Semantics, Browser Truth, And Console Truth.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

### [262] - 2026-03-25 19:05 - `DOC - Add Worker 5.3A-6 Result Semantics Questions`

Expanded the open `[5.3A-6] Result Semantics, Browser Truth, And Console Truth` section in the Worker umbrella doc with a first `Questions / Decisions` block, adding focused open questions plus suggestions around canonical result payload shape, retained-sibling semantics, preview-versus-final publication rules, Browser parent aggregate truth, and Console narration depth before the later worker cutover phase.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Worker.md`
- `docs/Doc-Log.md`

### [261] - 2026-03-25 19:03 - `DOC - Ship Worker Phase 5.3A-5 Architecture Follow-Through`

Cleaned up the Worker architecture docs after the shipped `[5.3A-5] Legacy Runtime And Startup Fallback Removal` implementation by moving its standalone record into `Worker/Shipped/`, rewriting the Worker umbrella and roadmap trackers to the post-`5.3A-5` state, and refreshing the docs map so the Worker subtree now treats the runtime-removal phase as landed history instead of future work.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-5 - Legacy Runtime And Startup Fallback Removal.md`
- `docs/Human-Plans/Architecture/Worker/Worker.md`
- `docs/Human-Plans/roadmap/Architecture-roadmap.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

### [260] - 2026-03-25 18:34 - `DOC - Create Worker Phase 5.3A-5 Runtime Removal Plan`

Created the standalone `[5.3A-5] Legacy Runtime And Startup Fallback Removal` phase doc as an implementation-ready future planning surface, grounded it against the live startup/request/worker seams, and synchronized the Worker umbrella doc so the newly locked anonymized-core, silence-on-empty, request-driven-stats, preview-split, and no-full-wipe decisions now point at one canonical future execution spec.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-5 - Legacy Runtime And Startup Fallback Removal.md`
- `docs/Human-Plans/Architecture/Worker/Worker.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

### [259] - 2026-03-25 18:25 - `DOC - Add Worker 5.3A-5 Legacy Runtime Removal Questions`

Expanded the open `[5.3A-5] Legacy Runtime And Startup Fallback Removal` section in the Worker umbrella doc with a first `Questions / Decisions` block, adding focused open questions plus suggestions around the future worker-core versus product-adapter seam, graph-first startup silence, legacy build-stats-order fallback deletion, preview-path placement, and targeted child-rebuild preservation during runtime cleanup.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Worker.md`
- `docs/Doc-Log.md`

### [258] - 2026-03-25 18:22 - `DOC - Ship Worker Phase 5.3A-4 Architecture Follow-Through`

Cleaned up the Worker architecture docs after the shipped `[5.3A-4] Dispatcher Boundary Cleanup` implementation by moving its standalone record into `Worker/Shipped/`, rewriting the Worker umbrella and roadmap trackers to the post-`5.3A-4` state, and refreshing the docs map so the Worker subtree now treats the dispatcher-boundary cleanup as landed history instead of future work.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md`
- `docs/Human-Plans/Architecture/Worker/Worker.md`
- `docs/Human-Plans/roadmap/Architecture-roadmap.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

### [257] - 2026-03-25 18:06 - `DOC - Tighten Worker 5.3A-4 Dispatcher Boundary Phase Against Live Code`

Tightened the standalone `[5.3A-4] Dispatcher Boundary Cleanup` phase doc against the live `src/app` seams, explicitly recording that `bootstrapBuildWiring.ts` already owns provider wiring, locking a single runtime-hooks registration object plus deterministic hook ordering, and adding the concrete app/store/test verification targets needed before implementation starts.

Files changed:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md`
- `docs/Doc-Log.md`

### [193] - 2026-03-23 17:29 - `DOC - Tighten Sketch Console Phase 3.2B-Console-2`

Tightened the standalone `[3.2B-Console-2] SketchDraw Staged Command Routing` phase doc into a more handoff-ready implementation spec, adding the exact local staged command model, recommended scope ids and action ids, the locked `Back` versus `X` split, stronger `ConsoleDock` handoff rules, and clearer automated/manual verification expectations for the next sketch-console routing phase.

Files changed:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-Console-2 - SketchDraw Staged Command Routing.md`
- `docs/Doc-Log.md`

### [192] - 2026-03-23 17:19 - `DOC - Ship Sketch Console Phase 3.2B-Console-1`

Moved the standalone `[3.2B-Console-1] SketchDraw Scoped Command Surface` record into `Shipped/`, updated the sketch and roadmap family surfaces to mark the first scoped-console cleanup complete, and refreshed the docs map so the sketch subtree now points at the shipped path instead of the old future record.

Files changed:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-Console-1 - SketchDraw Scoped Command Surface.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-Console-1 - SketchDraw Scoped Command Surface.md` (removed)
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

### [190] - 2026-03-23 15:02 - `DOC - Add Sketch Console Mini-Family`
<!-- DOC ENTRY 190 -->
HUMAN SUMMARY: `Added a new open \`3.2B-Console\` sketch-console mini-family to the sketch architecture, created three standalone future phase docs for the staged \`SketchDraw\` command-surface cleanup ladder, and refreshed the docs map so those new planning surfaces are discoverable under the existing sketch subtree.`

#### Scope
- Kept the work inside the existing `Sketch` architecture family rather than creating a second competing console-planning home outside the sketch node docs.
- Split the new mini-family into a narrow three-step ladder so command-surface cleanup, staged `SketchDraw` routing, and later shared sketch command-tree/provider work stay separated.
- Updated the docs map and permanent doc log alongside the sketch-family docs so the new planning surfaces are discoverable and historically recorded.

#### Summary
- Updated `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md` with a new `Sketch Console Vision - 3.2B-Console` parent section plus three open subphases: `[3.2B-Console-1] SketchDraw Scoped Command Surface`, `[3.2B-Console-2] SketchDraw Staged Command Routing`, and `[3.2B-Console-3] Shared Sketch Command Tree And Scope Providers`.
- Added three standalone future phase docs under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/` so each new console-cleanup step has its own dedicated implementation/planning surface.
- Updated `docs/Doc-Index.md` so the `Spaghetti-Editor-Arch` subtree now lists the three new sketch-console phase docs.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-Console-1 - SketchDraw Scoped Command Surface.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-Console-2 - SketchDraw Staged Command Routing.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-Console-3 - Shared Sketch Command Tree And Scope Providers.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This is docs-only planning work.
- The new mini-family intentionally stays sketch-local and does not claim a whole-app generic command-registry redesign.

### [189] - 2026-03-23 13:50 - `DOC - Ship Sketch To Extrude Preview Repair Phase Record`
<!-- DOC ENTRY 189 -->
HUMAN SUMMARY: `Moved the standalone \`[3.2A-0.1]\` sketch-to-extrude repair doc into \`Nodes-Fondation/Shipped/\`, refreshed the node-family and roadmap/docs-map surfaces to the shipped state, and updated the bug records so this geometry-fidelity repair now reads as code-resolved pending manual in-app verification instead of still implementation-ready planning.`

#### Scope
- Kept the doc follow-through focused on the existing `Nodes`, roadmap, docs-map, and bug-tracking surfaces that explicitly referenced `[3.2A-0.1]`.
- Preserved earlier planning and bug-history entries rather than rewriting the pre-shipment investigation record.
- Kept the bug state conservative by using `[resolved?]` until the irregular authored `PLine` case is manually verified in-app.

#### Summary
- Moved `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Fondation/Future/Nodes_Phase 3.2A-0.1 - Sketch To Extrude To Preview Contract Repair.md` into `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Fondation/Shipped/` and updated the standalone phase record so it describes the landed mesh-preview repair instead of future implementation steps.
- Updated `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md` and `docs/Human-Plans/roadmap/roadmap.md` so `[3.2A-0.1]` now reads as completed groundwork ahead of the later `EWR` phases.
- Updated `docs/Doc-Index.md` so the architecture docs map points at the shipped `Nodes-Fondation/Shipped/` phase record.
- Updated `docs/Bugs/4_GeometrySketch-Extrude-Profile-Handoff-Regression.md` and `docs/Bugs/0_Bug_Report.md` so the bug now reads as code-resolved pending manual app verification.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Fondation/Shipped/Nodes_Phase 3.2A-0.1 - Sketch To Extrude To Preview Contract Repair.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`
- `docs/Bugs/4_GeometrySketch-Extrude-Profile-Handoff-Regression.md`
- `docs/Bugs/0_Bug_Report.md`
- `docs/Doc-Log.md`

### [188] - 2026-03-23 13:32 - `DOC - Tighten Sketch To Extrude Repair Plan Around Result Semantics`
<!-- DOC ENTRY 188 -->
HUMAN SUMMARY: `Updated the standalone \`[3.2A-0.1]\` repair phase doc and the dedicated sketch-to-extrude bug note so both now reflect the post-\`[5.3A-2]\` reality: the old graph-native compile handoff issue is now a verification checkpoint, while the actual implementation target is the downstream \`worker mesh -> PartArtifact -> Viewer\` collapse.`

#### Scope
- Kept the doc changes limited to the standalone `Nodes` repair phase doc and the dedicated bug note.
- Preserved the broader `EWR` and worker-roadmap boundaries instead of widening this into another family rewrite.
- Added new permanent top-of-file doc-log history rather than rewriting earlier bug-planning history.

#### Summary
- Refreshed `Nodes_Phase 3.2A-0.1 - Sketch To Extrude To Preview Contract Repair.md` so its implementation spec now names the concrete shared result, dispatcher validation, worker build-model, and viewer seams as the main work.
- Updated `4_GeometrySketch-Extrude-Profile-Handoff-Regression.md` so the stale `compileGraph loop.segments` diagnosis no longer reads as the primary remaining bug cause.
- Marked the bug note implementation-ready and tightened the likely files, decisions, implementation steps, verification set, and definition of done around mesh-capable preview artifacts.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Fondation/Future/Nodes_Phase 3.2A-0.1 - Sketch To Extrude To Preview Contract Repair.md`
- `docs/Bugs/4_GeometrySketch-Extrude-Profile-Handoff-Regression.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs-only planning correction.
- The updated plan still keeps a narrow compile-path verification step so the old upstream handoff bug stays closed while the downstream result-contract repair lands.

### [187] - 2026-03-23 13:24 - `DOC - Ship Worker Phase 5.3A-2 Planning Surface`
<!-- DOC ENTRY 187 -->
HUMAN SUMMARY: `Moved the \`[5.3A-2]\` worker-contract phase record into \`Worker/Shipped/\`, refreshed the umbrella worker and roadmap/docs-map surfaces to the shipped state, and tightened the open dispatcher-cleanup doc so it now treats the graph-native request/build-unit contract as completed groundwork rather than future speculation.`

#### Scope
- Kept the doc changes inside the existing Worker family, roadmap, and docs-map surfaces without widening into unrelated worker phases.
- Preserved the current `[5.3A-6]` result-semantics boundary so the shipped `5.3A-2` docs only claim the request-and-state contract work that actually landed.
- Left older doc-log and local doc-history entries intact and added new top entries instead of rewriting history.

#### Summary
- Moved `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md` into `docs/Human-Plans/Architecture/Worker/Shipped/` and updated the standalone phase record to describe the landed contract precisely.
- Refreshed `docs/Human-Plans/Architecture/Worker/Worker.md` so the umbrella family now marks `[5.3A-2]` complete and describes the live graph-build seam as `compiledBuildData + buildIdentity + invalidation` with coarse result semantics still deferred.
- Updated `docs/Human-Plans/roadmap/roadmap.md` and `docs/Doc-Index.md` so the roadmap and docs map both point at the shipped `5.3A-2` record instead of the old future path.
- Updated `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md` so its prerequisite wording now treats `[5.3A-2]` as shipped groundwork rather than a still-pending dependency.

#### Files Changed
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md`
- `docs/Human-Plans/Architecture/Worker/Worker.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md`

#### Verification / Consistency Checks
- Confirmed the shipped Worker family path now appears in `Worker.md`, `roadmap.md`, and `Doc-Index.md`.
- Confirmed the open `[5.3A-4]` doc now references `[5.3A-2]` as shipped groundwork instead of a future prerequisite.

<!-- ENTRY 186 -->
### [186] - 2026-03-23 11:08 - `DOC - Add 3.2A-0.1 Standalone Nodes Repair Phase`
<!-- ENTRY 186 -->
HUMAN SUMMARY: Added the standalone `[3.2A-0.1] Sketch To Extrude To Preview Contract Repair` phase doc under the `Nodes` family, updated `Nodes-Index.md` to include it as the pre-`EWR` cleanup phase, and refreshed the docs map so the new post-foundation geometry repair now has a real implementation-ready planning surface.

#### Scope
- Added one new standalone future phase doc under the `Nodes` family.
- Updated `Nodes-Index.md` to include `[3.2A-0.1]` ahead of the later `EWR` phases.
- Updated the docs map and permanent doc log.

#### Summary
- Created a dedicated implementation-ready plan for repairing the current `Sketch -> Extrude -> Output Preview` fidelity gap.
- Kept the phase explicitly separate from the broader `EWR` rollout.
- Positioned it as the immediate post-foundation cleanup under shipped `[3.2A-0]`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Future/Nodes_Phase 3.2A-0.1 - Sketch To Extrude To Preview Contract Repair.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This is a docs-only planning pass.
- The new phase intentionally stays focused on geometry-result fidelity and avoids widening into the full worker-contract family or the later `EWR` hierarchy work.

<!-- ENTRY 185 -->
### [185] - 2026-03-23 11:02 - `DOC - Add 3.2A-0.1 Sketch To Extrude Cleanup To Roadmap`
<!-- ENTRY 185 -->
HUMAN SUMMARY: Updated the roadmap to add `[3.2A-0.1] Sketch To Extrude To Preview Contract Repair` directly under the shipped `[3.2A-0]` foundation, giving the newly confirmed graph-native geometry fidelity cleanup a real roadmap home before the later `EWR` phases begin.

#### Scope
- Updated the live roadmap only.
- Added the new `3.2A-0.1` checklist row and detailed phase block under the `[3.2A]` family.
- Logged the roadmap follow-up in the permanent doc log.

#### Summary
- Kept `[3.2A-0]` intact as shipped history.
- Added `[3.2A-0.1]` as the immediate cleanup phase for the sketch-to-extrude-to-preview contract.
- Left `[3.2A-1]` through `[3.2A-4]` as the later `EWR` and downstream node-structure wave.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This change intentionally treats the geometry fidelity repair as a pre-`EWR` cleanup instead of the first `EWR` phase itself.

<!-- ENTRY 184 -->
### [184] - 2026-03-23 01:19 - `DOC - Make Sketch To Extrude Bug Note Implementation Ready`
<!-- ENTRY 184 -->
HUMAN SUMMARY: Extended the new `Geometry Sketch To Extrude Profile Handoff Regression` bug note with an implementation-ready fix block at the bottom, translating the current sketch-profile data-loss suspicion into a concrete contract-repair plan with a header, seam read, locked decisions, and implementation spec.

#### Scope
- Updated the dedicated Bug 4 regression note only.
- Added an implementation-ready bottom section without changing any runtime code.
- Logged the docs follow-up in the permanent doc log.

#### Summary
- Added a `Fix Spec` section for the sketch-to-extrude contract repair.
- Captured the current seam read across `compileGraph`, `nodeRegistry`, `evaluateGraph`, `compileFeatureStack`, and `featureStackRuntime`.
- Locked the main decisions so the next implementation cut can focus on contract fidelity instead of reopening the same bug-triage question.

#### Files Changed
- `docs/Bugs/4_GeometrySketch-Extrude-Profile-Handoff-Regression.md`
- `docs/Doc-Log.md`

#### Notes
- This is still a bug note, not a new feature phase doc.
- The implementation-ready section is intentionally narrow and keeps the broader `EWR` rollout out of scope.

<!-- ENTRY 183 -->
### [183] - 2026-03-23 01:10 - `DOC - Add Geometry Sketch To Extrude Handoff Bug Note`
<!-- ENTRY 183 -->
HUMAN SUMMARY: Added a dedicated bug note for the current graph-native `Geometry/Sketch -> Geometry/Extrude` shape-loss regression, then refreshed the master bug report and docs map so the new irregular-profile extrusion failure is now tracked as a first-class open bug instead of only living in chat context.

#### Scope
- Added one new dedicated bug doc under `docs/Bugs/`.
- Updated the running master bug report with a new `Bug 7` entry and priority placement.
- Updated the docs index so the new bug note appears in the canonical docs map.

#### Summary
- Created a focused bug note describing the symptom where irregular `Sketch Draw` profiles extrude to the wrong body shape.
- Recorded the current strongest suspicion that the graph-native compile path rebuilds a reduced sketch/profile payload and drops the richer loop structure before runtime extrusion.
- Linked the broader bug inventory to the new dedicated note so the issue is easier to discover and revisit later.

#### Files Changed
- `docs/Bugs/4_GeometrySketch-Extrude-Profile-Handoff-Regression.md`
- `docs/Bugs/0_Bug_Report.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs-only tracking update; no runtime code changed.
- The current bug note intentionally frames `OutputPreview` as a downstream suspect rather than the primary likely fault.

<!-- ENTRY 182 -->
### [182] - 2026-03-22 21:26 - `DOC - Correct Camera Controls Phase 5.0H-3 Baseline Mapping`
<!-- ENTRY 182 -->
HUMAN SUMMARY: Corrected the planned `[5.0H-3]` coexistence wording so the model viewport baseline is explicit again as `wheel zoom`, `MMB` pan, `Ctrl + MMB` orbit, and `MMB` double-click fit, with the canvas now described as simply adding `Shift` to forward those same model gestures while hovered.

#### Scope
- Updated the standalone `[5.0H-3]` future phase doc.
- Updated the camera-controls family index wording for the same baseline clarification.
- Logged the planning correction in the permanent doc log.

#### Summary
- Restored the explicit model-viewport baseline wording to match the intended `Ctrl + MMB` orbit direction.
- Kept the canvas pass-through rule as "normal model gesture plus Shift".
- Left the rest of the coexistence phase scope unchanged.

#### Files Changed
- `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-3 - Spaghetti Canvas And Model Viewport Coexistence.md`
- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning correction only; no runtime code changed.
- The phase still remains focused on canvas/model coexistence and leaves camera console commands plus the shared input-owner model for later phases.

<!-- ENTRY 181 -->
### [181] - 2026-03-22 21:24 - `DOC - Redesign Camera Controls Phase 5.0H-3 Pass-Through Set`
<!-- ENTRY 181 -->
HUMAN SUMMARY: Replaced the planned `[5.0H-3]` canvas/model pass-through set with a cleaner `+Shift` rule so, while hovering the canvas, the model viewport reuses its normal camera gestures plus `Shift` instead of relying on a mixed modifier scheme.

#### Scope
- Updated the standalone `[5.0H-3]` future phase doc.
- Updated the camera-controls family index wording for the same pass-through redesign.
- Logged the planning correction in the permanent doc log.

#### Summary
- Kept `Shift + wheel` as the canvas-to-model zoom pass-through.
- Changed model pan to `Shift + MMB`.
- Changed model orbit to `Shift + Ctrl + MMB`.

#### Files Changed
- `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-3 - Spaghetti Canvas And Model Viewport Coexistence.md`
- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning correction only; no runtime code changed.
- The phase still remains focused on canvas/model coexistence and leaves camera console commands plus the shared input-owner model for later phases.

<!-- ENTRY 180 -->
### [180] - 2026-03-22 21:19 - `DOC - Correct Camera Controls Phase 5.0H-3 Orbit Pass-Through`
<!-- ENTRY 180 -->
HUMAN SUMMARY: Corrected the planned `[5.0H-3]` canvas/model pass-through set so model orbit now uses the simpler normal `Ctrl + MMB` gesture, while `Shift + wheel` stays as the explicit canvas-to-model zoom path.

#### Scope
- Updated the standalone `[5.0H-3]` future phase doc.
- Updated the camera-controls family index wording for the same pass-through correction.
- Logged the planning correction in the permanent doc log.

#### Summary
- Replaced the earlier split `Ctrl + MMB` pan plus `Ctrl + Shift + MMB` orbit plan.
- Locked `Ctrl + MMB` as the canonical model-orbit pass-through while hovering the canvas.
- Kept `Shift + wheel` as the model-zoom pass-through.

#### Files Changed
- `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-3 - Spaghetti Canvas And Model Viewport Coexistence.md`
- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning correction only; no runtime code changed.
- The phase still remains focused on canvas/model coexistence and leaves camera console commands plus the shared input-owner model for later phases.

<!-- ENTRY 179 -->
### [179] - 2026-03-22 21:15 - `DOC - Tighten Camera Controls Phase 5.0H-3 Into A More Concrete Spec`
<!-- ENTRY 179 -->
HUMAN SUMMARY: Tightened the standalone `[5.0H-3] Spaghetti Canvas And Model Viewport Coexistence` phase doc into a more implementation-ready spec by grounding it in the current graph-canvas runtime. The plan now records that `SpaghettiCanvas.tsx` already owns plain wheel zoom and empty-background `LMB` pan, that only expanded-view `Ctrl + MMB` temporary orbit exists today, and that the next cut must add explicit canvas-to-viewer zoom and pan seams rather than pretending those paths already exist.

#### Scope
- Updated the standalone `[5.0H-3]` future phase doc.
- Replaced a few generic canvas/pass-through assumptions with the current concrete runtime state.
- Logged the implementation-readiness tightening in the permanent doc log.

#### Summary
- Added a new local doc-history line to the phase doc.
- Refined `Current Seam Read` with the current canvas wheel, pan, and temporary orbit bridge behavior.
- Marked the current `q1` through `q4` decisions as locked in the doc.
- Tightened `Implementation Spec` so `viewerBridge.ts` and likely new canvas-to-viewer zoom/pan seams are explicit requirements.

#### Files Changed
- `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-3 - Spaghetti Canvas And Model Viewport Coexistence.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The phase remains intentionally focused on canvas/model coexistence and still leaves camera console commands plus the shared input-owner model for later phases.

<!-- ENTRY 178 -->
### [178] - 2026-03-22 21:11 - `DOC - Add Camera Controls Phase 5.0H-3 Future Plan`
<!-- ENTRY 178 -->
HUMAN SUMMARY: Added a new standalone future phase doc for `[5.0H-3] Spaghetti Canvas And Model Viewport Coexistence`, giving the next camera-controls cut its own implementation-ready planning surface after the shipped sketch and model-viewport baseline work.

#### Scope
- Created the standalone `[5.0H-3]` future phase doc.
- Updated the camera-controls family index to list the new doc and the newer `Shift + wheel` pass-through zoom idea.
- Refreshed the docs map to include the new future phase path.

#### Summary
- Added `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-3 - Spaghetti Canvas And Model Viewport Coexistence.md`.
- Updated `Camera_Controls-Index.md` so the future family list and `[5.0H-3]` checklist now point at `Shift + wheel` for model zoom pass-through instead of `Ctrl + Scroll`.
- Updated `docs/Doc-Index.md` so the camera-controls subtree lists the new future phase doc.

#### Files Changed
- `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-3 - Spaghetti Canvas And Model Viewport Coexistence.md`
- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The phase is still intentionally scoped to canvas/model coexistence and leaves camera console commands plus the shared input-owner model for later phases.

<!-- ENTRY 177 -->
### [177] - 2026-03-22 20:52 - `DOC - Ship Camera Controls Phase 5.0H-2 Docs`
<!-- ENTRY 177 -->
HUMAN SUMMARY: Moved the standalone `[5.0H-2] Fusion-Style Model Viewport Camera Baseline` phase record from `Future/` to `Shipped/`, marked the camera-controls family and roadmap state forward, and refreshed the docs map so the model-viewport gesture baseline now reads as landed history instead of pending planning.

#### Scope
- `Camera-Controls` family status sync after the shipped `5.0H-2` runtime implementation.
- Roadmap, family-index, phase-doc, and docs-map updates only.

#### Summary
- Moved `Camera_Controls_Phase 5.0H-2 - Fusion-Style Model Viewport Camera Baseline.md` from `Future/` to `Shipped/`.
- Marked `[5.0H-2]` complete in `Camera_Controls-Index.md` and `roadmap.md`.
- Updated `docs/Doc-Index.md` so the camera-controls subtree points at the shipped path.

#### Files Changed
- `docs/Human-Plans/Architecture/Camera-Controls/Shipped/Camera_Controls_Phase 5.0H-2 - Fusion-Style Model Viewport Camera Baseline.md`
- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This entry covers only the docs/family-state updates after the runtime implementation.
- The shipped code/runtime behavior is recorded separately in `docs/CHANGELOG.md`.

<!-- ENTRY 176 -->
### [176] - 2026-03-22 20:44 - `DOC - Tighten Camera Controls Phase 5.0H-2 Into A More Concrete Spec`
<!-- ENTRY 176 -->
HUMAN SUMMARY: Tightened the standalone `[5.0H-2] Fusion-Style Model Viewport Camera Baseline` phase doc into a more implementation-ready spec by grounding it in the current camera runtime. The plan now names the real starting `OrbitControls` mouse map, explicitly states that there is no current viewer double-click camera path, and locks `Viewer.frameAll()` as the first zoom-fit target instead of leaving those details implicit.

#### Scope
- Updated the standalone `[5.0H-2]` future phase doc.
- Replaced a few generic gesture and seam assumptions with the current concrete runtime state.
- Logged the implementation-readiness tightening in the permanent doc log.

#### Summary
- Added a new local doc-history line to the phase doc.
- Refined `Current Seam Read` with the current `OrbitControls` button mapping and the absence of a viewer double-click camera path.
- Marked the current `q1` through `q4` decisions as locked in the doc.
- Tightened `Implementation Spec` so `Viewer.ts` is explicitly required and `Viewer.frameAll()` is the first zoom-fit target for `MMB` double-click.

#### Files Changed
- `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-2 - Fusion-Style Model Viewport Camera Baseline.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The phase remains intentionally model-viewport-only and still leaves graph-canvas coexistence to `[5.0H-3]`.

<!-- ENTRY 175 -->
### [175] - 2026-03-22 20:42 - `DOC - Add Camera Controls Phase 5.0H-2 Future Plan`
<!-- ENTRY 175 -->
HUMAN SUMMARY: Added a new standalone future phase doc for `[5.0H-2] Fusion-Style Model Viewport Camera Baseline`, giving the next camera-controls cut its own implementation-ready planning surface under `Future/` after the shipped `[5.0H-1]` sketch-camera ownership block.

#### Scope
- Created `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-2 - Fusion-Style Model Viewport Camera Baseline.md`.
- Updated `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md` to list the new future phase doc.
- Updated `docs/Doc-Index.md` so the docs map now shows the new camera-controls future planning surface.

#### Summary
- Added the new `[5.0H-2]` future phase doc with:
  - `Purpose`
  - `Why This Phase Exists`
  - `Scope`
  - `Header`
  - `Target Result`
  - `Current Seam Read`
  - `Questions / Decisions`
  - `Implementation Spec`
- Kept the phase model-viewport-only around the Fusion-style gesture baseline:
  - wheel zoom
  - `MMB` pan
  - `Shift + MMB` orbit
  - `MMB` double-click zoom fit
- Explicitly deferred graph-canvas coexistence, camera console commands, and the shared owner model to later camera phases.

#### Files Changed
- `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-2 - Fusion-Style Model Viewport Camera Baseline.md`
- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The new phase doc assumes the shipped `[5.0H-1]` `Sketch Draw` camera block stays intact while the broader model-viewport gesture baseline changes.

<!-- ENTRY 174 -->
### [174] - 2026-03-22 20:27 - `DOC - Mark Camera Controls Phase 5.0H-1 Shipped`
<!-- ENTRY 174 -->
HUMAN SUMMARY: Marked `[5.0H-1] Sketch Draw Camera Blocking` shipped after the viewer-side camera block landed. The standalone phase record moved from `Camera-Controls/Future/` to `Camera-Controls/Shipped/`, the camera family index and roadmap now mark `5.0H-1` complete, and the docs map points at the shipped path.

#### Scope
- Moved the standalone `[5.0H-1]` phase record into the `Shipped/` folder.
- Updated the `Camera_Controls-Index.md` family state.
- Updated `roadmap.md` to mark `[5.0H-1]` complete and parent `[5.0H]` partial.
- Updated `Doc-Index.md` to the shipped camera-controls path.

#### Summary
- Added a shipped-result note and completion history line to the `5.0H-1` phase record before moving it.
- Refreshed the camera family index so `[5.0H-1]` now reads as completed while `[5.0H-2]` through `[5.0H-5]` remain open.
- Refreshed the roadmap and docs map so the repo no longer shows the first camera-controls cut as a pending future phase.

#### Files Changed
- `docs/Human-Plans/Architecture/Camera-Controls/Shipped/Camera_Controls_Phase 5.0H-1 - Sketch Draw Camera Blocking.md`
- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This doc-log entry covers the documentation/state sync only; the shipped runtime behavior itself is recorded in `docs/CHANGELOG.md`.
- The broader Fusion-style viewport baseline remains deferred to `[5.0H-2]`.

<!-- ENTRY 173 -->
### [173] - 2026-03-22 19:56 - `DOC - Tighten Camera Controls Phase 5.0H-1 Around Real Viewer Seams`
<!-- ENTRY 173 -->
HUMAN SUMMARY: Tightened the standalone `[5.0H-1] Sketch Draw Camera Blocking` phase doc into a more implementation-ready spec by grounding it in the current runtime seams. The plan no longer leans on fuzzy `inputRouting` guesses and now points directly at the existing viewer overlay/session feed in `ViewerHost`, the camera-left-button claim in `CameraController`, and the temporary orbit bridge path exposed through `viewerBridge.ts`.

#### Scope
- Updated the standalone `[5.0H-1]` future phase doc.
- Replaced generic seam guesses with the current concrete viewer/runtime path.
- Logged the implementation-readiness tightening in the permanent doc log.

#### Summary
- Added a new local doc-history line to the phase doc.
- Rewrote `Current Seam Read` around:
  - `ViewerHost.tsx`
  - `Viewer.ts`
  - `CameraController.ts`
  - `viewerBridge.ts`
- Tightened the `Questions / Decisions` and `Implementation Spec` sections so the first cut now clearly means:
  - derive the block in `Viewer`
  - disable left-button orbit ownership in `CameraController`
  - suppress temporary orbit drag while blocked
- Removed the earlier implication that `inputRouting.ts` was likely the main seam for this phase.

#### Files Changed
- `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-1 - Sketch Draw Camera Blocking.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The phase is still intentionally narrow: it blocks camera `LMB` ownership during `Sketch Draw` without widening into the full Fusion-style gesture remap owned by `[5.0H-2]`.

<!-- ENTRY 172 -->
### [172] - 2026-03-22 14:56 - `DOC - Add Camera Controls Phase 5.0H-1 Future Plan`
<!-- ENTRY 172 -->
HUMAN SUMMARY: Added a new standalone future phase doc for `[5.0H-1] Sketch Draw Camera Blocking`, using the stronger implementation-ready structure from the AppShell family template so the first camera-controls cut now has explicit scope, decisions, file seams, implementation steps, and verification instead of living only as a checklist line in the umbrella camera-controls index.

#### Scope
- Created `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-1 - Sketch Draw Camera Blocking.md`.
- Updated `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md` to list the new future phase doc.
- Updated `docs/Doc-Index.md` so the docs map now shows the new camera-controls future planning surface.

#### Summary
- Added the new `[5.0H-1]` future phase doc with:
  - `Purpose`
  - `Why This Phase Exists`
  - `Scope`
  - `Header`
  - `Target Result`
  - `Current Seam Read`
  - `Questions / Decisions`
  - `Implementation Spec`
- Kept the phase intentionally narrow around blocking camera ownership from stealing plain `LMB` while `Sketch Draw` is open.
- Used the `AppShell_Phase 5.0F-1` structure as the template for the decision and implementation sections, as requested.

#### Files Changed
- `docs/Human-Plans/Architecture/Camera-Controls/Future/Camera_Controls_Phase 5.0H-1 - Sketch Draw Camera Blocking.md`
- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The new phase doc intentionally stops short of the full Fusion-style camera remap so `[5.0H-2]` can still own the broader viewport baseline cleanly later.

<!-- ENTRY 171 -->
### [171] - 2026-03-22 14:18 - `DOC - Add Suggestion Blocks To Pasta Path Questions`
<!-- ENTRY 171 -->
HUMAN SUMMARY: Updated `Pasta-Path-Index.md` so every `Questions / Decisions` item now includes a `#### Suggestion` block. The doc no longer just lists open questions; it now records a recommended direction for each unresolved decision around placement, first-cut behavior, mapping, branch display, editor sync, and timeline representation.

#### Scope
- Updated the `Questions / Decisions` section in the umbrella `Pasta Path` index doc.
- Added one `#### Suggestion` block under each existing `q1` through `q6` question.
- Logged the structure/content upgrade in the permanent doc log.

#### Summary
- Added concrete suggestions for:
  - keeping `Pasta Path` in the top-left mode family first
  - making the first cut read-only and scrub-only
  - using deterministic execution-order mapping with conditional parallel rows
  - keeping the default strip single-row until branch detail is really needed
  - syncing filtered render with `Spaghetti Editor` highlight feedback
  - using a mixed grouped abstraction layer instead of raw-node-only or feature-only history

#### Files Changed
- `docs/Human-Plans/Architecture/Pasta-Path/Pasta-Path-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The suggestions are intentionally first-pass recommendations and can still be revised later as the `Pasta Path` concept tightens.

<!-- ENTRY 170 -->
### [170] - 2026-03-22 14:15 - `DOC - Add Questions And Decisions Section To Pasta Path Index`
<!-- ENTRY 170 -->
HUMAN SUMMARY: Updated `Pasta-Path-Index.md` to add a dedicated `Questions / Decisions` section using the `### [ ] qN - ...` heading format. The doc now surfaces the main unresolved placement, mapping, branching, sync, and representation choices as explicit decision points instead of leaving them scattered implicitly through the concept text.

#### Scope
- Updated the umbrella `Pasta Path` index doc.
- Added a new `Questions / Decisions` section near the bottom of the file.
- Logged the structure change in the permanent doc log.

#### Summary
- Added explicit question headings for:
  - workspace placement
  - read-only versus editable first cut
  - graph-to-timeline mapping
  - automatic versus expanded branch rows
  - viewport/editor sync during rollback
  - node-level versus feature-level timeline representation

#### Files Changed
- `docs/Human-Plans/Architecture/Pasta-Path/Pasta-Path-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The new section only introduces explicit question headings for now; it does not yet lock answers or add suggestions under each question.

<!-- ENTRY 169 -->
### [169] - 2026-03-22 14:12 - `DOC - Add Fusion Visual Takeaways To Pasta Path Index`
<!-- ENTRY 169 -->
HUMAN SUMMARY: Updated `Pasta-Path-Index.md` to capture the first concrete visual/form-factor takeaways from a Fusion-style timeline reference. The doc now explicitly recommends borrowing the low-profile footer-like density, horizontal step-strip readability, and strong playhead emphasis of that UI pattern while adapting it to ParaHook's branching graph reality.

#### Scope
- Updated the umbrella `Pasta Path` index doc.
- Added the first explicit visual-takeaways section for the timeline surface.
- Logged the visual-direction follow-up in the permanent doc log.

#### Summary
- Added a `Fusion Visual Takeaways` section.
- Locked the recommendation to borrow:
  - low vertical footprint
  - full-width horizontal history strip
  - compact icon/chip step presentation
  - strong vertical playhead emphasis
  - footer-like presentation
- Also locked the adaptation rule that ParaHook should not copy Fusion's purely linear assumption and should allow vertical branch rows only when needed.

#### Files Changed
- `docs/Human-Plans/Architecture/Pasta-Path/Pasta-Path-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The new section is intentionally about visual/form-factor principles, not a full implementation spec or pixel-accurate UI clone target.

<!-- ENTRY 168 -->
### [168] - 2026-03-22 14:10 - `DOC - Add Slim Workspace Mode Suggestion To Pasta Path Index`
<!-- ENTRY 168 -->
HUMAN SUMMARY: Updated `Pasta-Path-Index.md` to capture the first placement suggestion for the concept inside the existing editor-mode system. The doc now recommends that `Pasta Path` likely live as another `+/e/-` style surface mode with a slim, full-width, bottom timeline footprint rather than starting as another full-height editor.

#### Scope
- Updated the umbrella `Pasta Path` index doc.
- Added the first concrete workspace-placement guidance for the concept.
- Logged the placement direction in the permanent doc log.

#### Summary
- Added a `Suggested Workspace Placement` section.
- Locked the recommendation that:
  - `Pasta Path` likely belongs in the same top-left mode family as the current `+/e/-` editor surfaces
  - it should start as a slim bottom timeline surface around `100px` tall
  - it should preserve width for long horizontal history reading
  - it should only grow vertically when parallel branch rows are actually needed
- Added one more first-constraint note reinforcing the slim-by-default direction.

#### Files Changed
- `docs/Human-Plans/Architecture/Pasta-Path/Pasta-Path-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The change captures placement/form-factor direction without yet breaking the family into execution phases.

<!-- ENTRY 167 -->
### [167] - 2026-03-22 14:06 - `DOC - Add Pasta Path Architecture Family And Index`
<!-- ENTRY 167 -->
HUMAN SUMMARY: Added a new folderized `Pasta Path` architecture family under `docs/Human-Plans/Architecture/`, created the first umbrella `Pasta-Path-Index.md` note, reserved `Future/` and `Shipped/` folders for later work, and registered the new family in the docs map so the graph-to-timeline history concept now has one canonical planning home.

#### Scope
- Created a new `docs/Human-Plans/Architecture/Pasta-Path/` family folder.
- Added the first umbrella note at `docs/Human-Plans/Architecture/Pasta-Path/Pasta-Path-Index.md`.
- Reserved `Future/` and `Shipped/` folders for later standalone phase and shipped records.
- Updated the docs map to include the new family.

#### Summary
- Added the new `Pasta Path` concept as a folder-root architecture/index doc instead of a flat single-file note.
- Framed the concept around:
  - timeline scrubbing
  - parallel layers
  - history rollback through partial evaluation
  - graph-to-timeline mapping
- Locked the relationship that the `Spaghetti Editor` remains source-of-truth while `Pasta Path` is a derived temporal/history surface.
- Registered the family in `docs/Doc-Index.md`.

#### Files Changed
- `docs/Human-Plans/Architecture/Pasta-Path/Pasta-Path-Index.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The new family intentionally starts with only one umbrella index so later execution docs can be added under `Future/` and `Shipped/` without restructuring again.

<!-- ENTRY 166 -->
### [166] - 2026-03-22 14:04 - `DOC - Move SketchPlane Flip Under Plane In Nodes Index`
<!-- ENTRY 166 -->
HUMAN SUMMARY: Updated the `Geometry/Sketch` input hierarchy in `Nodes-Index.md` so the planned `Flip` boolean now hangs under `Plane` instead of under `Transform`. This keeps the sketch-plane row tree aligned with the intended UI surface where plane orientation owns the flip toggle and `Transform` stays focused on `Move`, `Rotate`, and later `Scale`.

#### Scope
- Updated the `Geometry/Sketch` input tree in `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Adjusted the related phase-decision suggestion so it no longer treats `Flip` as part of the `Transform` row.
- Logged the hierarchy correction in the permanent doc log.

#### Summary
- Added a new local doc-history line in `Nodes-Index.md` for the hierarchy correction.
- Moved `Flip = Boolean` from under `Transform` to under `Plane`.
- Reworded the `Geometry Sketch EWR Vertical Slice` question suggestion so `Transform` stays `Vec3`-channel-only while `Plane` owns `Flip`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The change is intentionally narrow: it corrects hierarchy placement without changing the broader `SketchPlane` planning direction.

<!-- ENTRY 165 -->
### [165] - 2026-03-22 14:00 - `DOC - Rename Nodes Index Phase Ladder To 3.2A Subphase Ids`
<!-- ENTRY 165 -->
HUMAN SUMMARY: Updated `Nodes-Index.md` so its local four-phase rollout no longer uses generic `Phase 1` through `Phase 4` labels. The phase ladder now uses the roadmap-owned `[3.2A-1]` through `[3.2A-4]` ids, keeping the node-family planning surface aligned with the new `[3.2A]` mini-family structure in `roadmap.md`.

#### Scope
- Renamed the local phase headings in `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Preserved the existing checklist and `Questions / Decisions` content under each phase.
- Logged the phase-id alignment in the permanent doc log.

#### Summary
- Added a new local doc-history line in `Nodes-Index.md` for the roadmap sync.
- Renamed:
  - `Phase 1` -> `[3.2A-1] EWR Foundation And Shared Row Contract`
  - `Phase 2` -> `[3.2A-2] Geometry Sketch EWR Vertical Slice`
  - `Phase 3` -> `[3.2A-3] Downstream Geometry Node Hierarchy Expansion`
  - `Phase 4` -> `[3.2A-4] Registry Alignment And Legacy Cleanup`

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The content of each phase stayed the same; only the phase ids and naming were aligned to the live roadmap structure.

<!-- ENTRY 164 -->
### [164] - 2026-03-22 13:56 - `DOC - Reframe 3.2A As EWR And Geometry Node Hierarchy Family`
<!-- ENTRY 164 -->
HUMAN SUMMARY: Updated the live roadmap so `[3.2A]` is no longer just one shipped phase entry. It now acts as the parent family for the original shipped `Data Types And Sketch Foundation` cut plus the newer `EWR` and geometry-node hierarchy follow-on work, giving the `Nodes-Index.md` phase ladder a real roadmap home under the existing foundational geometry lane.

#### Scope
- Turned `[3.2A]` from a single shipped roadmap phase into a parent mini-family.
- Preserved the original shipped scope as `[3.2A-0] Data Types And Sketch Foundation`.
- Added the open follow-on subphases `[3.2A-1]` through `[3.2A-4]` for `EWR`, sketch vertical-slice hierarchy, downstream geometry-node expansion, and registry/legacy cleanup.

#### Summary
- Added a new roadmap doc-history note for the `3.2A` family restructure.
- Updated the Lane `[3]` quick checklist so `[3.2A]` is partial and exposes `[3.2A-0]` through `[3.2A-4]`.
- Rewrote the body of the `[3.2A]` roadmap section so it now describes the full family purpose rather than only the already-shipped historical cut.
- Added standalone body sections for:
  - `[3.2A-0] Data Types And Sketch Foundation`
  - `[3.2A-1] EWR Foundation And Shared Row Contract`
  - `[3.2A-2] Geometry Sketch EWR Vertical Slice`
  - `[3.2A-3] Downstream Geometry Node Hierarchy Expansion`
  - `[3.2A-4] Registry Alignment And Legacy Cleanup`

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The restructure keeps the shipped historical `3.2A` truth intact while giving the newer `Nodes-Index.md` hierarchy work one consistent roadmap slot instead of splitting it into a separate unrelated family.

<!-- ENTRY 163 -->
### [163] - 2026-03-22 14:00 - `DOC - Break Nodes Index Into Four EWR And Node Family Phases`
<!-- ENTRY 163 -->
HUMAN SUMMARY: Updated `Nodes-Index.md` to add a real phased rollout under `## Phases`. The doc now breaks the direction into four phases that separate the shared `EWR` foundation, the first `Geometry/Sketch` vertical slice, the downstream geometry-node family expansion, and the later registry/legacy cleanup work while giving each phase its own checklist plus `Questions / Decisions` and `Suggestion` blocks.

#### Scope
- Updated the `## Phases` section in `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the rollout to four phases as the fewest safe split for the current combined node-family and row-hierarchy direction.
- Logged the phase split in the permanent doc log.

#### Summary
- Added:
  - `Phase 1 - EWR Foundation And Shared Row Contract`
  - `Phase 2 - Geometry Sketch EWR Vertical Slice`
  - `Phase 3 - Downstream Geometry Node Family Expansion`
  - `Phase 4 - Registry Alignment, Legacy Cleanup, And Family Hardening`
- Added checklist bullets for what each phase should accomplish.
- Added explicit `Questions / Decisions` plus `Suggestion` blocks inside every phase section.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The phase split intentionally minimizes count while still isolating the risky shared row-model foundation from the sketch vertical slice and the later registry cleanup work.

<!-- ENTRY 162 -->
### [162] - 2026-03-22 13:49 - `DOC - Rewrite Geometry Nodes As EWR First Family Map`
<!-- ENTRY 162 -->
HUMAN SUMMARY: Reworked the full `Geometry Nodes` block in `Nodes-Index.md` so it now reads as one cleaner EWR-first family map. Instead of a partly-accumulated sketch-only tree plus shallow follow-on bullets, each geometry node now has a clearer `inputs` / `outputs` contract and the sketch node keeps its deeper expandable hierarchy in one consistent place.

#### Scope
- Rewrote the `#### Geometry Nodes` section in `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the change inside the existing node index instead of splitting the geometry family into new docs yet.
- Logged the restructuring in the permanent doc log.

#### Summary
- Reworked `Geometry/Sketch` into:
  - `inputs`
  - `outputs`
  - `EWR output tree`
  - `structure rules`
- Expanded the later geometry nodes so they now also show compact contracts for:
  - `Geometry/Extrude`
  - `Geometry/Loft`
  - `Geometry/Revolve`
  - `Geometry/Sweep`
  - `Geometry/Boolean`
- Kept the sketch hierarchy as the deepest example because it is the current main EWR-driven geometry node.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The later geometry-node contracts remain planning reads, not claims of shipped implementation.

<!-- ENTRY 161 -->
### [161] - 2026-03-22 13:43 - `DOC - Add Expandable Wireable Rows Terminology To Nodes Index`
<!-- ENTRY 161 -->
HUMAN SUMMARY: Updated `Nodes-Index.md` to define `Expandable Wireable Rows` (`EWR`) as the user-facing name for the expandable row hierarchy with output pins. The same section also locks the code-facing names `WireableRowNode` and `WireableRowTree` so future node/tree planning can refer to the same concept consistently.

#### Scope
- Updated `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the change focused on naming and row-model vocabulary.
- Logged the terminology decision in the permanent doc log.

#### Summary
- Added `Expandable Wireable Rows` as the user-facing term.
- Added `EWR` as the short form.
- Added:
  - `WireableRowNode`
  - `WireableRowTree`
  as the code-facing naming pair.
- Added the `object rows` versus `value rows` split with examples.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The new terminology is intended to sit beside the existing node/type language, not replace node-family names like `Geometry/Sketch`.

<!-- ENTRY 160 -->
### [160] - 2026-03-22 13:36 - `DOC - Expand SketchPlane Transform Into Vec3 Channels`
<!-- ENTRY 160 -->
HUMAN SUMMARY: Updated the simplified `Geometry/Sketch` input tree in `Nodes-Index.md` so `SketchPlane > Transform` now reflects the intended 3D structure. `Move` and `Rotate` are now shown as expandable `Vec3` rows with `X / Y / Z` float children, later `Scale` is reserved the same way, and `Flip` is now treated as `Boolean`.

#### Scope
- Updated the `SketchPlane > Transform` portion of `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the change limited to the simplified sketch input hierarchy.
- Logged the refinement in the permanent doc log.

#### Summary
- Expanded `Move` into `Vec3` with `X / Y / Z` float children.
- Expanded `Rotate` into `Vec3` with `X / Y / Z` float children.
- Added later `Scale = Vec3` with the same child-float structure.
- Changed `Flip` from a vague later transform item into explicit `Boolean`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The simplified node tree is intentionally describing expandable wireable structure, not claiming all of these rows are already implemented in UI today.

<!-- ENTRY 159 -->
### [159] - 2026-03-22 13:31 - `DOC - Expand SketchPoint Vec2 Leaves Into X And Y Floats`
<!-- ENTRY 159 -->
HUMAN SUMMARY: Updated the simplified sketch hierarchy in `Nodes-Index.md` so `SketchPoint = Vec2` no longer stays opaque. The compact row tree now shows that a `SketchPoint` row may expand again into `X` and `Y` float children for direct numeric wiring and editing.

#### Scope
- Updated the simplified `Geometry/Sketch` hierarchy in `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the change focused on the point-leaf expansion rule.
- Logged the refinement in the permanent doc log.

#### Summary
- Added `X = Float` and `Y = Float` under the existing `SketchPoint = Vec2` leaves.
- Applied the same leaf expansion pattern to:
  - `SketchLine`
  - `SketchCircle`
  - `SketchRectangle`
  - `SketchPLine`
- Kept the rest of the simplified hierarchy unchanged.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The row tree is intentionally describing expandable wireable structure, not claiming that every one of these child rows is already implemented in UI today.

<!-- ENTRY 158 -->
### [158] - 2026-03-22 13:28 - `DOC - Add Implementation Ready AppShell 5.0F-2 Future Plan`
<!-- ENTRY 158 -->
HUMAN SUMMARY: Refreshed `AppShell-Index.md` to the real post-`5.0F-1` state and added the new standalone `5.0F-2` future phase doc. The AppShell docs now treat the remaining browser/editor window-and-dock controller cleanup as the active implementation-ready bridge before workspace modes instead of leaving it as a short umbrella-note stub.

#### Scope
- Updated `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md` to remove stale runtime-host leakage language and point the open `[5.0F-2]` lane at a dedicated future phase doc.
- Created `docs/Human-Plans/Architecture/AppShell/Future/AppShell_Phase 5.0F-2 - AppShell Window And Dock Host Extraction.md`.
- Updated the docs map so the new future AppShell phase doc is discoverable in `docs/Doc-Index.md`.

#### Summary
- Reworked the AppShell umbrella index so it now reflects the shipped `RadioRuntimeHost` seam and the remaining inline browser/editor shell-controller overload in `src/app/AppShell.tsx`.
- Added an implementation-ready `[5.0F-2]` future doc that locks the recommended first cut around:
  - `BrowserDockHost`
  - `SpaghettiWindowHost`
  - keeping shared left-dock and menu state in `AppShell` for the first pass
- Added the new future doc to the AppShell subtree in the canonical docs map.

#### Files Changed
- `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md`
- `docs/Human-Plans/Architecture/AppShell/Future/AppShell_Phase 5.0F-2 - AppShell Window And Dock Host Extraction.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- No roadmap or changelog state changed in this pass because `[5.0F-2]` remains planned, not shipped.

<!-- ENTRY 157 -->
### [157] - 2026-03-22 13:29 - `DOC - Expand Simplified Sketch Input Breakdown`
<!-- ENTRY 157 -->
HUMAN SUMMARY: Updated the simplified `Geometry/Sketch` contract in `Nodes-Index.md` so the input side now breaks down more like the output side. `SketchPlane` and `Sketch Draw` now show clearer nested substructure, which makes the sketch node read as one compact tree instead of a shallow input list feeding a much deeper output hierarchy.

#### Scope
- Updated the simplified `Geometry/Sketch` input hierarchy in `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the change limited to the compact input/output contract example.
- Logged the follow-up in the permanent doc log.

#### Summary
- Expanded `SketchPlane` into:
  - `Plane`
  - `Transform`
    - `Move`
    - `Rotate`
    - later `Flip`
  - later `Source`
    - `Origin Plane`
    - `Planar Face`
- Expanded `Sketch Draw` into:
  - `Line`
  - `PLine`
  - `Rectangle`
  - `Circle`
  - later `Selection`
  - later `Snaps`

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The `later` labels are intentional where the compact input tree is naming the owned command families before all of them are fully shipped.

<!-- ENTRY 156 -->
### [156] - 2026-03-22 13:26 - `DOC - Expand Simplified Sketch Entity Breakdown`
<!-- ENTRY 156 -->
HUMAN SUMMARY: Updated the simplified `Geometry/Sketch` hierarchy example in `Nodes-Index.md` so the core sketch entity rows now break down more concretely. `SketchLine`, `SketchCircle`, `SketchRectangle`, and `SketchPLine` now show clearer point/radius/segment structure instead of stopping at one shallow placeholder line each.

#### Scope
- Updated the simplified `Geometry/Sketch` nested hierarchy in `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the change limited to the compact row-tree example under the sketch output hierarchy.
- Logged the follow-up in the permanent doc log.

#### Summary
- Expanded `SketchCircle` into:
  - `Center = SketchPoint`
  - `Radius = Float`
- Expanded `SketchRectangle` into four derived `SketchLine` children, each with `Point A / Point B`.
- Expanded `SketchPLine` into multiple `SketchLine` children plus later `SketchArc`.
- Kept `SketchLine` itself as the atomic two-point entity.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The rectangle and polyline segment rows remain derived child structure under first-class composite entities, not a statement that those parents should be downgraded to flat stored line lists.

<!-- ENTRY 155 -->
### [155] - 2026-03-22 13:23 - `DOC - Tighten Simplified Sketch Hierarchy Example`
<!-- ENTRY 155 -->
HUMAN SUMMARY: Updated the simplified `Geometry/Sketch` hierarchy example in `Nodes-Index.md` to use the cleaner structure agreed in chat. The compact row-tree now uses `Point A / Point B`, treats `SketchPoint` as `Vec2` instead of `Vec3`, and keeps the nested `SketchPLine` example aligned to the rest of the hierarchy.

#### Scope
- Updated the simplified `Geometry/Sketch` nested output example in `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the change purely structural/naming-focused.
- Logged the correction in the permanent doc log.

#### Summary
- Replaced `Point a` / `Point b` with `Point A` / `Point B`.
- Corrected `SketchPoint` from `Vec3` to `Vec2`.
- Fixed the nested `SketchPLine` indentation so `later SketchArc` stays clearly under the polyline segment breakdown.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- `Vec2` remains the correct sketch-local point type even though viewer/world projection later maps sketch points into 3D space.

<!-- ENTRY 154 -->
### [154] - 2026-03-22 13:19 - `DOC - Align Spaghetti Types Future Geometry Planning To Nodes Index`
<!-- ENTRY 154 -->
HUMAN SUMMARY: Updated `Spaghetti-Types.md` so its future-facing sketch and geometry planning now matches the newer `Nodes-Index.md` direction. The type doc now favors a `SketchProfiles`-first expandable hierarchy, keeps `Rectangle` and `PLine` first-class composite entities, and leans on the current `Geometry/*` node family instead of older parallel feature-node naming.

#### Scope
- Updated the future-planning portions of `docs/Human-Plans/Architecture/Spaghetti-Types.md`.
- Kept the change focused on overlapping sketch/geometry direction and did not attempt a full rewrite of the older type doc.
- Logged the alignment pass in the permanent doc log.

#### Summary
- Reworked the future sketch-output read from:
  - top-level `SketchProfile` plus `SketchProfiles`
  to:
  - top-level `SketchProfiles`
  - expandable child `SketchProfile` rows
  - optional later `SketchCurves`
- Added the wireable hierarchy language for:
  - `SketchProfiles`
  - `SketchProfile`
  - `SketchEntity`
  - `SketchPoint`
- Added the structure rule that `Rectangle` and `PLine` remain first-class composite entities while `Line` remains atomic.
- Tightened the future-node wording so the doc now points more directly at `Geometry/Loft`, `Geometry/Revolve`, `Geometry/Sweep`, and `Geometry/Boolean` instead of leaning on older parallel `Feature/*` naming.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Types.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning alignment pass only; no runtime code changed.
- The broader current-registry and identity-map sections in `Spaghetti-Types.md` remain useful and were intentionally left intact.

<!-- ENTRY 153 -->
### [153] - 2026-03-22 13:14 - `DOC - Add Wireable Sketch Object Hierarchy To Nodes Index`
<!-- ENTRY 153 -->
HUMAN SUMMARY: Updated `Nodes-Index.md` to capture the deeper wireable sketch-object structure under `Geometry/Sketch`. The doc now says `SketchProfiles` should be the one top-level profile output, expandable into per-profile rows, member entity references, and then entity-to-point expansion while keeping composite entities like `Rectangle` and `PLine` first-class.

#### Scope
- Updated the `Geometry/Sketch` block in `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the change focused on object hierarchy and row/output semantics.
- Logged the decision in the permanent doc log.

#### Summary
- Added an `output hierarchy` block under `Geometry/Sketch` for:
  - `SketchProfiles`
  - `SketchProfile`
  - `SketchEntity`
  - `SketchPoint`
- Added `structure rules` that define:
  - `Rectangle` as a first-class composite entity with derived line children
  - `PLine` as a first-class composite entity with ordered segment children
  - `Line` as an atomic entity with two point children
  - child rows as derived/reference layers unless a later explicit explode workflow exists

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The new hierarchy intentionally favors one top-level `SketchProfiles` output over exposing both a collection pin and a second top-level selected-profile pin by default.

<!-- ENTRY 152 -->
### [152] - 2026-03-22 13:10 - `DOC - Reformat Geometry Nodes Into Input Output Contracts`
<!-- ENTRY 152 -->
HUMAN SUMMARY: Updated the `Geometry Nodes` block in `Nodes-Index.md` to match the nested formatting the user started. `Geometry/Sketch`, `Geometry/Extrude`, and planned `Geometry/Loft` now show compact `inputs` and `outputs` lists grounded in the current planning and registry docs instead of reading only as flat names.

#### Scope
- Updated the `Geometry Nodes` section in `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the change limited to node-interface formatting and did not yet restyle the non-geometry families the same way.
- Logged the follow-up in the permanent doc log.

#### Summary
- Filled in the user-started `Geometry/Sketch` nested block with:
  - `SketchPlane`
  - `Sketch Draw`
  - `SketchProfiles`
  - `SketchProfile`
- Added matching nested `inputs / outputs` rows for `Geometry/Extrude`.
- Added the first planned `inputs / outputs` rows for `Geometry/Loft`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- `Loft` remains planned, so its nested contract is still a planning read rather than a claim of shipped runtime support.

<!-- ENTRY 151 -->
### [151] - 2026-03-22 13:06 - `DOC - Correct Nodes Checklist To Match Live Registry`
<!-- ENTRY 151 -->
HUMAN SUMMARY: Corrected the bottom checklist in `Nodes-Index.md` so it now reflects the real live node registry instead of only the geometry slice. The doc now keeps the current output nodes in the main inventory, adds the existing part/param/primitive/utility families, and removes the mistaken primitive entries from the `[L]` legacy list.

#### Scope
- Updated `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the follow-up inside the same umbrella doc instead of splitting to another note.
- Logged the correction in the permanent doc log.

#### Summary
- Reworked `## Nodes` into grouped family checklists for:
  - geometry
  - part
  - output
  - param
  - primitive
  - utility
- Kept `System/OutputPreview` and `Output/Assembled` in the live inventory as current output nodes to keep tracking.
- Removed `Primitive/Number` and `Primitive/Vec2` from the `[L]` legacy list after checking the current registry/status docs.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning correction only; no runtime code changed.
- `toeLoft` remains in the legacy list because it is still a live node-adjacent type seam in code.

<!-- ENTRY 150 -->
### [150] - 2026-03-22 13:00 - `DOC - Add Node And Legacy Checklists To Nodes Index`
<!-- ENTRY 150 -->
HUMAN SUMMARY: Updated `Nodes-Index.md` so the new bottom `Nodes` and `Legacy` sections are now real checklists instead of empty placeholders. The doc now has one scan-friendly list for current/planned geometry node families and one `[L]` cleanup list for legacy nodes and seams that are still present in code.

#### Scope
- Updated `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`.
- Kept the change inside the existing `Nodes` umbrella doc rather than creating another file.
- Logged the follow-up in the permanent doc log.

#### Summary
- Added a `Nodes` checklist for:
  - `Geometry/Sketch`
  - `Geometry/Extrude`
  - `Geometry/Loft`
  - later `Revolve / Sweep / Boolean`
- Added a `Legacy` checklist using `[L]` for still-live cleanup targets:
  - `Part/CubeProof`
  - `Primitive/Number`
  - `Primitive/Vec2`
  - `toeLoft`
- Kept the checklist language aligned to the repo-wide legend where `[L]` means legacy and still in code.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- `toeLoft` is listed here intentionally as a legacy node-adjacent seam because it still affects node/port typing even though it is not itself a node family.

<!-- ENTRY 149 -->
### [149] - 2026-03-22 12:49 - `DOC - Add Nodes Umbrella Index`
<!-- ENTRY 149 -->
HUMAN SUMMARY: Added a new umbrella `Nodes-Index.md` under the `Spaghetti-Editor-Arch/Nodes` family so geometry-node planning now has one canonical place to say what already exists, what folders are still placeholders, and what AutoCAD-style sketch commands are shipped versus still needed. Also updated the docs map and captured the core planning decision in the active Codex notes.

#### Scope
- Added `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md` as the new node-family umbrella planning surface.
- Updated `docs/Doc-Index.md` so the architecture docs map now exposes the new `Nodes` index and the live `Sketch` family doc under `Spaghetti-Editor-Arch`.
- Added one matching planning note to `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`.

#### Summary
- Created a new `Nodes Index` doc with:
  - current `Sketch / Extrude / Loft` family coverage
  - a first practical inventory of shipped sketch commands
  - a grouped AutoCAD-style command backlog
  - recommended near-term command order
- Explicitly treated AutoCAD-like command growth as primarily a `Geometry/Sketch` backlog for now.
- Recorded that `Extrude` and `Loft` still need their own dedicated family docs in this folder.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Doc-Index.md`
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This was a docs/planning pass only; no runtime code changed.
- The new index intentionally keeps camera/view commands out of scope because those belong in the separate `Camera-Controls` family.

<!-- ENTRY 148 -->
### [148] - 2026-03-22 12:31 - `DOC - Mark Theme System Roadmap Lane Complete`
<!-- ENTRY 148 -->
HUMAN SUMMARY: Updated the roadmap lane checkboxes for the theme-system cleanup family. The live roadmap now marks `[5.0G]`, `[5.0G-1]`, and `[5.0G-2]` as complete so the lane matches the shipped manifest split, the landed cascade cleanup, and the already-updated `v15Theme.md` architecture note.

#### Scope
- Updated the live `[5.0G]` roadmap lane and its two subphase blocks in `docs/Human-Plans/roadmap/roadmap.md`.
- Kept the change limited to status markers and local checklist completion for the shipped theme lane.
- Logged the roadmap sync in the permanent doc log.

#### Summary
- Checked off the top lane quick-list entries for `[5.0G]`, `[5.0G-1]`, and `[5.0G-2]`.
- Marked the main `[5.0G]` section header as complete.
- Marked the `[5.0G-1]` and `[5.0G-2]` subphase headers and checklist items as complete.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This was a roadmap/doc sync only; the shipped runtime CSS work remains recorded in `docs/CHANGELOG.md`.

<!-- ENTRY 147 -->
### [147] - 2026-03-22 12:26 - `DOC - Mark v15Theme Phase 2 Complete`
<!-- ENTRY 147 -->
HUMAN SUMMARY: Updated `v15Theme.md` to reflect that the Phase 2 owner-cleanup pass is now implemented. The doc now treats the second `:root` removal, the `Spaghetti` override consolidation, and the `base.css` surface-owner cleanup as landed behavior instead of still-open work.

#### Scope
- Updated `docs/Human-Plans/Architecture/v15Theme.md` so the theme architecture note matches the current post-cleanup code.
- Kept this doc follow-up focused on status and current-state accuracy instead of reopening the theme plan.
- Logged the documentation update in the permanent doc log.

#### Summary
- Marked `[5.0G-2]` complete in `v15Theme.md` and checked off the Phase 2 checklist.
- Updated the short version and current ownership read so they now describe the live cleaned-up theme state.
- Replaced the earlier open-hotspot wording with completed Phase 2 outcomes for:
  - second global `:root` removal
  - `Spaghetti` override consolidation
  - browser/radio owner cleanup out of `foundation/base.css`

#### Files Changed
- `docs/Human-Plans/Architecture/v15Theme.md`
- `docs/Doc-Log.md`

#### Notes
- This entry logs the doc sync only; the shipped runtime CSS work is recorded separately in `docs/CHANGELOG.md`.

<!-- ENTRY 146 -->
### [146] - 2026-03-22 12:06 - `DOC - Mark v15Theme Phase 1 Complete And Lock Phase 2 Cleanup Spec`
<!-- ENTRY 146 -->
HUMAN SUMMARY: Updated `v15Theme.md` to reflect that the theme manifest split has landed, checked off the full `[5.0G-1]` phase, and rewrote `[5.0G-2]` around the real post-split cleanup hotspots in `foundation/`, `viewport-overlay`, and `spaghetti`. Also captured the same planning decision in the active Codex notes so the repo now treats the next theme pass as in-place cleanup of the landed split rather than a new decomposition phase.

#### Scope
- Updated `docs/Human-Plans/Architecture/v15Theme.md` to match the live post-Phase-1 theme layout and make `[5.0G-2]` implementation-ready.
- Added the corresponding phase-boundary note to `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`.
- Logged this documentation follow-up in the permanent doc log.

#### Summary
- Marked `[5.0G-1]` complete in `v15Theme.md` and checked off its implementation checklist.
- Updated the current theme seam read so the doc now reflects the live manifest-plus-subfiles layout instead of the earlier single-file pre-split state.
- Reworked `[5.0G-2]` around concrete cleanup targets:
  - second global `:root` / `--sp-*` token ownership
  - late `Spaghetti` override-history clusters
  - `foundation/base.css` shared-primitives boundary
  - `viewport-overlay.css` plus `ViewToolbar*` ownership
- Kept the theme lane at `2` phases and explicitly did not add a new rename-only or extra decomposition phase.

#### Files Changed
- `docs/Human-Plans/Architecture/v15Theme.md`
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- No runtime code changed in this pass.
- The Phase 2 plan is intentionally scoped as cleanup within the landed `9`-file theme split, not a broader workspace-mode or naming pass.

<!-- ENTRY 145 -->
### [145] - 2026-03-22 11:40 - `DOC - Make v15Theme Architecture Doc Implementation Ready`
<!-- ENTRY 145 -->
HUMAN SUMMARY: Reworked `v15Theme.md` into a much more implementation-ready planning surface. The doc now locks the current code seam read, names the exact `src/app/theme/` folders and files the split should create, keeps the phase count at the minimum safe `2`, and gives both phases a concrete checklist, decision block, and implementation spec.

#### Scope
- Rewrote `docs/Human-Plans/Architecture/v15Theme.md` into a more execution-facing architecture doc.
- Kept the roadmap family at `[5.0G]`, `[5.0G-1]`, and `[5.0G-2]` instead of adding more phases.
- Logged the document rewrite in the permanent doc log.

#### Summary
- Added a concrete current-code seam read covering the live import path, current theme folder shape, and the main TSX owner/verification files.
- Locked the recommended first-pass folder/file structure under `src/app/theme/foundation/`, `src/app/theme/shell/`, and `src/app/theme/surfaces/`.
- Reworked both phases into the requested structure:
  - `Info`
  - `Checklist`
  - `Decision / Questions`
  - `Implementation Spec`
- Locked the recommended low-risk direction:
  - keep `src/index.css` importing `v15Theme.css`
  - keep `v15Theme.css` as the manifest file
  - keep class names stable in Phase 1
  - reserve cleanup and override reduction for Phase 2

#### Files Changed
- `docs/Human-Plans/Architecture/v15Theme.md`
- `docs/Doc-Log.md`

#### Notes
- No runtime code changed in this pass.
- The phase count intentionally stayed at `2` because that is the minimum safe split between parity extraction and later cascade cleanup.

<!-- ENTRY 144 -->
### [144] - 2026-03-22 10:35 - `DOC - Add v15Theme Architecture Surface`
<!-- ENTRY 144 -->
HUMAN SUMMARY: Added a new architecture doc for the app theme system and registered it in the docs map. The repo now has one canonical planning surface for `src/app/theme/v15Theme.css`, including its current ownership read, the recommended split strategy, and the intended meaning of the new `[5.0G]` roadmap family.

#### Scope
- Created `docs/Human-Plans/Architecture/v15Theme.md` as a new architecture/planning doc.
- Updated `docs/Doc-Index.md` so the architecture docs map includes the new theme doc.
- Kept this pass document-only and did not change runtime styling files.

#### Summary
- Added a new `v15Theme.md` doc with:
  - current-state read of the single imported `v15Theme.css` system
  - target manifest-plus-surface-file split direction
  - ownership rules for global tokens versus surface-owned styling
  - phase index alignment for `[5.0G-1]` and `[5.0G-2]`
- Recorded that the theme cleanup should stay structural and parity-focused rather than becoming a redesign or styling-library migration.
- Registered the new doc in the canonical docs index.

#### Files Changed
- `docs/Human-Plans/Architecture/v15Theme.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- No runtime code changed in this pass.
- The new doc is intended to sit beside `Workspace-Modes.md` and `AppShell/AppShell-Index.md`, not replace either one.

<!-- ENTRY 143 -->
### [143] - 2026-03-22 10:35 - `DOC - Mark DrawSketch-5 Circle Phase Shipped`
<!-- ENTRY 143 -->
HUMAN SUMMARY: Marked `DrawSketch-5` as shipped after the circle implementation landed. The sketch docs now treat `Circle` / `cc` as real shipped `Sketch Draw` behavior, moved the standalone circle phase record from `Future/` to `Shipped/`, and updated the parent draw bucket so only endpoint snap remains open in that immediate follow-on lane.

#### Scope
- Marked the mirrored `DrawSketch-5` section in `Sketch.md` as shipped and synced its landed runtime behavior.
- Moved the standalone `DrawSketch-5` phase record into `Sketch/Shipped/`.
- Updated the parent `DrawSketch-3` future bucket so it now reads `Circle` as landed and keeps endpoint snap as the next open follow-on.

#### Summary
- Added a new `Sketch.md` doc-history note that `DrawSketch-5` landed on `2026-03-22`.
- Replaced the open/future circle planning block in `Sketch.md` with shipped behavior, console/status, and implementation-notes sections.
- Converted the standalone circle phase doc into a shipped record under `Sketch/Shipped/`.
- Updated the parent `DrawSketch-3` bucket to move `Circle` into the landed list and narrow the next implementation order down to endpoint snap.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-3 - Selection, Editing, And Richer Sketch Feedback.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-DrawSketch-5 - Circle Tool And Center-Radius Workflow.md`

#### Notes
- No new planning decisions were introduced in this pass; this was a status-sync after the shipped runtime implementation.
- The old `Future/Sketch_Phase 3.2B-DrawSketch-5 - Circle Tool And Center-Radius Workflow.md` path no longer exists because that record was moved into `Shipped/`.

<!-- ENTRY 142 -->
### [142] - 2026-03-22 10:23 - `DOC - Add Theme System Decomposition Phase To Roadmap`
<!-- ENTRY 142 -->
HUMAN SUMMARY: Added a new roadmap bridge phase for the oversized theme stylesheet cleanup. The roadmap now gives `v15Theme.css` decomposition its own `[5.0G]` family with one first cut for the manifest-plus-file split and one follow-on for cascade/override cleanup, instead of hiding that work inside editor naming or `AppShell` extraction.

#### Scope
- Updated the live roadmap quick checklist under Lane `[5]`.
- Added a new parent `[5.0G]` roadmap section plus the `[5.0G-1]` and `[5.0G-2]` child sections.
- Kept the existing `[5.0E]` and `[5.0F]` phase ownership intact instead of widening either phase to absorb theme-system cleanup.

#### Summary
- Added `[5.0G]` as the pre-workspace home for theme-system and stylesheet decomposition.
- Added `[5.0G-1]` for the stable theme manifest and first surface-owned file split.
- Added `[5.0G-2]` for later cascade cleanup, override reduction, and ownership hardening after the split.
- Recorded that this work should stay structural/parity-focused and should not turn into a CSS-modules migration, styling-library migration, or visual redesign pass.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- No runtime code changed in this pass.
- The new phase family intentionally sits beside `[5.0E]` and `[5.0F]` rather than being nested under either one.

<!-- ENTRY 141 -->
### [141] - 2026-03-22 10:20 - `DOC - Tighten DrawSketch-5 Circle Viewport Console Flow`
<!-- ENTRY 141 -->
HUMAN SUMMARY: Tightened `DrawSketch-5` again so the circle phase now explicitly defines the viewport-assisted console path instead of leaving it implied. The docs now lock stage 1 as live `Center > Vec2(N,N)` hover feedback and stage 2 as live `Radius > Float(N)` distance feedback, with clicks committing center and radius respectively.

#### Scope
- Updated the mirrored `DrawSketch-5` section in `Sketch.md`.
- Updated the standalone future phase doc for `3.2B-DrawSketch-5`.
- Focused only on the user-facing interaction contract and did not change the already-locked component storage shape.

#### Summary
- Added the explicit live command-line wording for stage 1 and stage 2.
- Locked stage 1 mouse movement to update the live center `Vec2`.
- Locked stage 2 mouse movement to update the live radius `Float` from center-to-cursor distance.
- Locked click behavior so the first click commits center and the second click commits radius.
- Added the viewport preview requirement for a radius witness line plus live circle ghost during stage 2.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-5 - Circle Tool And Center-Radius Workflow.md`

#### Notes
- No runtime code changed in this pass.
- `DrawSketch-5` now has an explicit viewport-plus-console interaction contract for implementation.

<!-- ENTRY 140 -->
### [140] - 2026-03-22 10:15 - `DOC - Correct DrawSketch-5 Circle Flow To Center Plus Radius`
<!-- ENTRY 140 -->
HUMAN SUMMARY: Corrected the just-tightened `DrawSketch-5` circle phase so the primary typed command is now `cc > Vec2 > Float` instead of `cc > Vec2 > Vec2`. The docs now match the intended user-facing flow of placing a center point and then specifying a radius, while still allowing viewport radius-witness picking and keeping the current internal `center + edge` component shape for the first implementation.

#### Scope
- Corrected the mirrored `DrawSketch-5` section in `Sketch.md`.
- Corrected the standalone future phase doc for `3.2B-DrawSketch-5`.
- Kept the phase implementation-ready and did not reopen unrelated circle-phase decisions.

#### Summary
- Changed the typed happy path from `cc > Vec2 > Vec2` to `cc > Vec2 > Float`.
- Reframed the second step as typed radius input first, with viewport edge-witness picking as the alternate path.
- Updated the status-path wording so the second step now reads as float-driven in the typed path.
- Kept the first implementation’s stored circle shape as `center + edge`, with typed radius translated into an internal edge witness along local `+X`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-5 - Circle Tool And Center-Radius Workflow.md`

#### Notes
- No runtime code changed in this pass.
- The next implementation can still support both typed radius entry and viewport-picked radius witnesses under one circle command.

<!-- ENTRY 139 -->
### [139] - 2026-03-22 10:10 - `DOC - Make DrawSketch-5 Circle Phase Implementation Ready`
<!-- ENTRY 139 -->
HUMAN SUMMARY: Tightened `DrawSketch-5` into an implementation-ready circle-tool spec. The sketch docs now lock the exact `cc > Vec2 > Vec2` center-plus-edge flow, keep the first circle as one first-class `center + edge` component, and ground the next implementation cut in the current runtime truth that committed circles already exist but the active draw-command seam still does not route `circle`.

#### Scope
- Tightened the mirrored `DrawSketch-5` section in `Sketch.md` so the main architecture doc now records the exact implementation contract for the first circle tool.
- Tightened the standalone future phase doc for `3.2B-DrawSketch-5` to match the same locked flow and current code truth.
- Kept the phase open/future and did not mark any runtime behavior as shipped.

#### Summary
- Added a new `Sketch.md` doc-history note that `DrawSketch-5` is now implementation-ready.
- Locked the typed happy path as `cc > Vec2 > Vec2`.
- Locked the first committed circle shape as one first-class `circle` component storing `center` plus `edge`.
- Clarified that the first cut should keep the shared two-point `P1 / P2` status model while prompt/help text describes `center` and `edge`.
- Added the explicit first-cut rule that zero-radius circles do not commit.
- Grounded the phase in the current code seam that still excludes `circle` from the active two-point draw-tool routing.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-5 - Circle Tool And Center-Radius Workflow.md`

#### Notes
- No runtime code changed in this pass.
- `DrawSketch-5` remains the next open circle-tool implementation phase after shipped `DrawSketch-4`.

<!-- ENTRY 138 -->
### [138] - 2026-03-22 08:35 - `DOC - Mark DrawSketch-4 Rectangle Phase Shipped`
<!-- ENTRY 138 -->
HUMAN SUMMARY: Marked `DrawSketch-4` as shipped after the rectangle implementation landed. The sketch docs now treat `Rectangle` / `rec` as real shipped `Sketch Draw` behavior, moved the standalone rectangle phase record from `Future/` to `Shipped/`, and updated the active Codex notes to capture the important console-assist input-preservation fix discovered during implementation.

#### Scope
- Marked the mirrored `DrawSketch-4` section in `Sketch.md` as shipped and synced its landed runtime shape.
- Added the standalone shipped rectangle phase record under `Sketch/Shipped/`.
- Updated the parent `DrawSketch-3` future bucket so it now reads `Rectangle` as landed and keeps `Circle` plus endpoint snap as the next open follow-ons.
- Recorded the implementation outcome in the active Codex notes file.

#### Summary
- Added a new `Sketch.md` doc-history note that `DrawSketch-4` landed on `2026-03-22`.
- Changed the main `DrawSketch-4` section from open/future language to shipped/landed language.
- Added a shipped-behavior block covering:
  - `rectangle` / `rec`
  - `rec > Vec2 > Vec2`
  - first-corner / opposite-corner commit
  - empty `Enter` accepting hovered `P2`
  - full closed rectangle ghost preview
- Added a new standalone shipped phase doc for `3.2B-DrawSketch-4`.
- Removed the older `Future/` copy for `DrawSketch-4` so the status split stays truthful.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-3 - Selection, Editing, And Richer Sketch Feedback.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-DrawSketch-4 - Rectangle Tool And Corner Workflow.md`
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- `DrawSketch-5` and `DrawSketch-6` remain open future follow-ons.

<!-- ENTRY 137 -->
### [137] - 2026-03-22 08:06 - `DOC - Tighten DrawSketch-4 Rectangle Flow Into Implementation-Ready Spec`
<!-- ENTRY 137 -->
HUMAN SUMMARY: Tightened the open `DrawSketch-4` rectangle phase into an implementation-ready spec. The phase now locks the typed happy path as `rec > Vec2 > Vec2`, states directly that the second accepted point commits immediately with no extra finish step, limits the first cut to axis-aligned first-corner/opposite-corner rectangles, and grounds the phase in the actual current runtime gaps around command exposure and live helper preview.

#### Scope
- Updated the standalone `DrawSketch-4` phase doc with more concrete locked decisions and execution details.
- Synced the mirrored `DrawSketch-4` section in the main `Sketch.md` architecture doc.
- Recorded the reusable planning decision in the active Codex notes file.
- Logged the document-only tightening in the permanent doc log.

#### Summary
- Added the locked typed command flow:
  - `rec > Vec2 > Vec2`
- Added the rule that the second accepted point commits immediately and returns to idle `Sketch Draw`.
- Added the rule that the first rectangle cut is axis-aligned in sketch space using two opposite corners.
- Added current code-to-target mapping that calls out the actual remaining runtime gaps in:
  - `runGeometrySketchDrawCommand(...)`
  - `GeometrySketchDrawHelper.ts`
- Expanded acceptance checks so implementation has a concrete command/session contract.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-4 - Rectangle Tool And Corner Workflow.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This pass intentionally tightens only `Rectangle`; `Circle` and `Endpoint Snap` remain separate future follow-ons.

<!-- ENTRY 136 -->
### [136] - 2026-03-22 07:58 - `DOC - Rename DrawSketch 3A 3B 3C To DrawSketch 4 5 6`
<!-- ENTRY 136 -->
HUMAN SUMMARY: Renamed the new sketch draw follow-ons from the temporary letter-suffixed ids `[3.2B-DrawSketch-3A]`, `[3.2B-DrawSketch-3B]`, and `[3.2B-DrawSketch-3C]` to the cleaner numbered ids `[3.2B-DrawSketch-4]`, `[3.2B-DrawSketch-5]`, and `[3.2B-DrawSketch-6]`. The phase titles and scope stayed the same; this was a numbering cleanup so the `DrawSketch` family reads as one clean numeric sequence.

#### Scope
- Renamed the live sketch-architecture references from the temporary letter suffixes to numeric `DrawSketch-N` ids.
- Renamed the three standalone future phase doc files to match the new numeric ids.
- Added a new planning note capturing the numbering decision.
- Logged the document-only rename in the permanent doc log.

#### Summary
- Renamed `Rectangle Tool And Corner Workflow` to phase id `[3.2B-DrawSketch-4]`.
- Renamed `Circle Tool And Center-Radius Workflow` to phase id `[3.2B-DrawSketch-5]`.
- Renamed `Endpoint Snap` to phase id `[3.2B-DrawSketch-6]`.
- Updated the parent `DrawSketch-3` bucket and `Sketch.md` references to point at the new ids.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-3 - Selection, Editing, And Richer Sketch Feedback.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-4 - Rectangle Tool And Corner Workflow.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-5 - Circle Tool And Center-Radius Workflow.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-6 - Endpoint Snap.md`
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- The earlier entry that introduced the split remains intact as historical truth; this new entry records only the follow-up numbering cleanup.

<!-- ENTRY 135 -->
### [135] - 2026-03-22 07:47 - `DOC - Split DrawSketch-3 Into Rectangle Circle And Endpoint Snap Subphases`
<!-- ENTRY 135 -->
HUMAN SUMMARY: Split the broad open `DrawSketch-3` sketch bucket into three narrower AutoCAD-like follow-ons so the next drafting work now has concrete implementation-ready homes for `Rectangle`, `Circle`, and endpoint snap. The main `Sketch.md` architecture note now reflects the shipped `Line` / `PLine` reality, the parent `DrawSketch-3` doc now reads as a subphase bucket, and new standalone future phase docs capture the `rec`, `cc`, and endpoint-snap directions explicitly.

#### Scope
- Updated the main sketch architecture doc to reflect the shipped `Line` / `PLine` base and the new follow-on ordering.
- Tightened the existing standalone `DrawSketch-3` doc so it now acts as the parent bucket for narrower next phases.
- Added three new standalone future phase docs for `Rectangle`, `Circle`, and endpoint snap.
- Recorded the reusable planning decision in the active Codex notes file.
- Logged the document-only change in the permanent doc log.

#### Summary
- Added `[3.2B-DrawSketch-3A] Rectangle Tool And Corner Workflow` with alias `rec` and first-corner / opposite-corner commit rules.
- Added `[3.2B-DrawSketch-3B] Circle Tool And Center-Radius Workflow` with alias `cc` and center-then-edge commit rules.
- Added `[3.2B-DrawSketch-3C] Endpoint Snap` as the first object-snap pass extending the current origin-only snap behavior.
- Updated `Sketch.md` so `DrawSketch-1` and `DrawSketch-2` now describe the already shipped `Line` / `PLine` reality instead of older placeholder rectangle/circle wording.
- Added a Codex planning note explaining why the next sketch growth should stay split into narrow tool-first follow-ons before later broad editing work.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-3 - Selection, Editing, And Richer Sketch Feedback.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-3A - Rectangle Tool And Corner Workflow.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-3B - Circle Tool And Center-Radius Workflow.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-3C - Endpoint Snap.md`
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This pass intentionally stops before deeper selection/editing work, because the immediate product value is the first two primitive tools plus one narrow object-snap follow-on.

<!-- ENTRY 134 -->
### [134] - 2026-03-21 23:05 - `DOC - Tighten DrawSketch-2 PLine Status And Finish Rules`
<!-- ENTRY 134 -->
HUMAN SUMMARY: Tightened the open `DrawSketch-2` phase again so `PLine` now follows an AutoCAD-like progressive point-entry model with explicit `P1 / P2 / P3` status labels and a live `Vec(N,N)` readout in the top command path. The phase now also says the real input should stay empty by default once `PLine` is finishable so empty `Enter` can cleanly mean `Finish` while typed `Vec2` remains a first-class point-entry override.

#### Scope
- Kept the update local to the open `DrawSketch-2` phase doc.
- Clarified `PLine` finish behavior and the split between top-path live point display versus real typed input.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Added the progressive AutoCAD-style `PLine` point-entry flow.
- Added explicit `P1 / P2 / P3` current-target labels for the top command/status path.
- Added the rule that live candidate `Vec(N,N)` should display in the top path rather than permanently occupying the real input field.
- Added the rule that once `PLine` is finishable, empty `Enter` should mean `Finish` while additional clicks or typed `Vec2` submissions continue the chain.
- Clarified that `PLine` should use the same canonical hybrid point-submission seam as `Line`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-2 - Multi-Step Tool Sessions And Commit Rules.md`
- `docs/Doc-Log.md`

#### Notes
- This pass still leaves some `DrawSketch-2` lifecycle details open, but the point-entry display and finish model are now much more implementation-ready.

<!-- ENTRY 133 -->
### [133] - 2026-03-21 23:00 - `DOC - Add DrawSketch-2 Previous Tool Re-Arm Decision`
<!-- ENTRY 133 -->
HUMAN SUMMARY: Tightened the open `DrawSketch-2` phase doc again so `Line` now explicitly ends back at idle after commit and a new local `Previous` convenience command is recorded for re-selecting the last draw tool. The phase now states that `Previous` uses shortcut `P` and only re-arms the last tool without auto-chaining from the prior endpoint.

#### Scope
- Kept the update local to the open `DrawSketch-2` phase doc.
- Clarified post-commit `Line` behavior and the first `Previous` tool-rearm rule.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Added the explicit rule that `Line` ends and returns to idle `Sketch Draw` after commit.
- Added `Previous` as a local draw-session convenience command.
- Added shortcut `P` for `Previous`.
- Locked the first-cut behavior so `Previous` only re-selects the most recently used draw tool and does not continue from the last endpoint.
- Added `previous` to the temporary console lifecycle command list for this phase.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-2 - Multi-Step Tool Sessions And Commit Rules.md`
- `docs/Doc-Log.md`

#### Notes
- This pass only locks the `Previous` direction in planning; no runtime draw-tool behavior changed yet.

<!-- ENTRY 132 -->
### [132] - 2026-03-21 22:55 - `DOC - Tighten DrawSketch-2 Hybrid Line Session Flow`
<!-- ENTRY 132 -->
HUMAN SUMMARY: Updated the open `DrawSketch-2` phase doc so `Line` is now explicitly defined as a hybrid console-and-viewport command session. The phase now records the normal `L -> Enter -> click point 1 -> click point 2` mouse path, the `Vec2` console fallback path, and the rule that live viewport hover should mirror an assisted `Vec2` into the console input without blocking typed override.

#### Scope
- Kept the update local to the open `DrawSketch-2` phase doc.
- Clarified `Line` session behavior without widening the change into `PLine` runtime or deeper editing work.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Promoted the `Line` interaction flow from suggestion-level wording into an explicit decision.
- Added the viewport-first `Line` path using two mouse clicks after console tool-arm.
- Added the console-first fallback path using two `Vec2` submissions.
- Added the rule that mouse hover should mirror the current point into the console as assisted `Vec2` text, with first typed input replacing that mirrored value.
- Clarified in the implementation spec that `Line` should use one canonical two-point session state machine rather than separate mouse and console workflows.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-2 - Multi-Step Tool Sessions And Commit Rules.md`
- `docs/Doc-Log.md`

#### Notes
- This pass only tightened the planning spec for `Line`. `PLine` and the remaining `DrawSketch-2` console-lifecycle decisions are still open.

<!-- ENTRY 131 -->
### [131] - 2026-03-21 22:24 - `DOC - Mark Sketch Phase 3.2B-S7 Shipped`
<!-- ENTRY 131 -->
HUMAN SUMMARY: Moved `Sketch_Phase 3.2B-S7 - SketchPlane Transform History.md` into `Sketch/Shipped/` and updated the sketch tracking docs so `S7` now reads as landed instead of future planning. The sketch index and roadmap now both reflect that transform history is implemented with toolbar rows, viewport path segments, and `Merge History` / `Lock` behavior.

#### Scope
- Updated the shipped sketch phase record and the main sketch index.
- Synced the live roadmap to include `S7` as completed.
- Logged the shipped runtime work in the permanent changelog.

#### Summary
- Moved the standalone `S7` phase doc from `Future/` to `Shipped/`.
- Updated the `S7` phase heading/status markers to shipped.
- Added a new `Sketch.md` history line and switched the parent sketch index summary/section read from open to shipped.
- Added a new `[3.2B-S7]` completed checklist block in `roadmap.md`.
- Added the permanent shipped-code entry to `CHANGELOG.md`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-S7 - SketchPlane Transform History.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Notes
- This doc sync covers `S7`. I left the separate `S8` future planning file alone in this pass even though `Move Again` runtime work has already landed.

<!-- ENTRY 130 -->
### [130] - 2026-03-21 18:37 - `DOC - Add AppShell Cleanup Bridge Phase To Roadmap`
<!-- ENTRY 130 -->
HUMAN SUMMARY: Updated `roadmap.md` to add `[5.0F] AppShell Cleanup And Host Seam Extraction` as a new pre-workspace bridge phase under Lane `[5.0]`. The roadmap now also includes two narrow subphases so AppShell cleanup can be tracked as prep work without absorbing the broader `[5.1] Workspace Modes` architecture.

#### Scope
- Updated the live roadmap under the existing Lane `[5]` shell/workspace family.
- Recorded the roadmap-only change in the permanent doc log.

#### Summary
- Added one new local `Doc History` line to `roadmap.md`.
- Added `[5.0F]` to the top roadmap lane checklist.
- Expanded the parent `[5.0]` checklist with a direct AppShell-cleanup bridge item.
- Added the new `[5.0F]` section plus `[5.0F-1] AppShell Runtime Host Extraction` and `[5.0F-2] AppShell Window And Dock Host Extraction`.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This keeps `AppShell` cleanup in the prep/cleanup lane while leaving final workspace-host architecture in `[5.1]`.

<!-- ENTRY 128 -->
### [128] - 2026-03-21 18:24 - `DOC - Add AppShell Architecture Index`
<!-- ENTRY 128 -->
HUMAN SUMMARY: Created a new `AppShell-Index.md` architecture note under `docs/Human-Plans/Architecture/AppShell/` so the repo now has one canonical place to describe what `AppShell` owns today, what it should own later, and which extraction phases should cleanly reduce the current overload. The docs map was updated in the same change so the new AppShell planning surface is discoverable.

#### Scope
- Created a new AppShell architecture doc under `docs/Human-Plans/Architecture/AppShell/`.
- Updated the canonical docs map to include the new AppShell entry.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Added one new local `Doc History` line to the new AppShell doc.
- Documented the current `AppShell` state as a mixed composition root, window manager, and feature-runtime host.
- Defined the target vision as a thinner shell that mounts explicit host seams instead of directly owning large amounts of feature logic.
- Added a first phase index for auditing seams, extracting radio runtime hosting, browser docking logic, spaghetti window-shell logic, and final shell normalization.

#### Files Changed
- `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This is a docs-only planning change. No `AppShell` code moved in this pass.

<!-- ENTRY 127 -->
### [127] - 2026-03-21 18:18 - `DOC - Clarify Limited SoundCloud Waveform Display In Radio Phase 11`
<!-- ENTRY 127 -->
HUMAN SUMMARY: Updated `Radio.md` so `Phase 11 - Source Waveform Visualization` now explicitly allows a trustworthy provider-backed `SoundCloud` waveform strip as a limited visual aid. The phase still keeps the honesty rule intact: a SoundCloud-style waveform/fill/progress surface may be shown for display, but it must not be treated as exact analyzable audio data.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio/Radio.md`.
- Recorded the document-only clarification in the permanent doc log.

#### Summary
- Added one new local `Doc History` line to `Radio.md`.
- Clarified the locked waveform-fidelity read so provider-backed waveform display is allowed while still classified as `limited`.
- Expanded the `limited` source-state definition to include provider waveform images/summary data.
- Tightened the `SoundCloud Read` section so the doc now explicitly allows a SoundCloud-style waveform strip/fill/progress display without allowing loudness analysis or exact waveform claims.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This is a docs-only clarification. It does not change the current waveform implementation in code.

<!-- ENTRY 126 -->
### [126] - 2026-03-21 17:50 - `DOC - Log SketchPlane Move Command Origin Guide`
<!-- ENTRY 126 -->
HUMAN SUMMARY: Added the permanent changelog record for the sketch-plane move-guide follow-up that keeps the last committed move point visible as the active move baseline. This doc-side entry exists only to track that shipped-history update.

#### Scope
- Updated the permanent completed-work changelog.
- Recorded that changelog update in the permanent doc log.

#### Summary
- Added one new changelog entry for the `3.2B-S6` follow-up that carries the move command origin forward visually inside `SketchPlane > Move`.

#### Files Changed
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Notes
- No architecture or roadmap docs changed in this follow-up; the behavior record belongs in shipped history.

<!-- ENTRY 125 -->
### [125] - 2026-03-21 13:17 - `DOC - Mark Sketch Phase 3.2B-S6 Shipped`
<!-- ENTRY 125 -->
HUMAN SUMMARY: Updated the sketch planning docs so `[3.2B-S6] SketchPlane Move Axis Numeric Entry` is now treated as shipped instead of future work. The sketch index, roadmap, and standalone phase-doc layout now match the landed runtime state.

#### Scope
- Updated the sketch architecture index.
- Updated the roadmap status for `[3.2B-S6]`.
- Refiled the standalone phase doc from `Future/` to `Shipped/`.

#### Summary
- Added local `Doc History` lines in `Sketch.md` and `roadmap.md` describing the landed move-axis child-leaf behavior.
- Updated the sketch continuation order so it no longer lists `[3.2B-S6]` as a pending next step.
- Marked the roadmap checklist and detailed `[3.2B-S6]` section complete.
- Logged the standalone phase doc as shipped and moved it into the sketch `Shipped/` folder.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- Earlier `Doc-Log.md` entries that referenced the `Future/` path remain valid historical records of where the phase doc lived during planning.

<!-- ENTRY 124 -->
### [124] - 2026-03-21 13:11 - `DOC - Move MkDocs Current-Page TOC To Right Sidebar`
<!-- ENTRY 124 -->
HUMAN SUMMARY: Updated the live MkDocs setup so the current page heading tree now appears in the standard right-side table of contents instead of being merged into the left sidebar. The planning note now records that split too, so the left side stays focused on page browsing while the right side handles in-page section jumps.

#### Scope
- Updated the live MkDocs config.
- Updated the MkDocs planning note to reflect the live TOC placement.
- Recorded the document-side follow-up in the permanent doc log.

#### Summary
- Removed `toc.integrate` from `mkdocs.yml`.
- Kept `toc.follow` so the current page TOC still follows the active heading.
- Updated the `Live Nav Note` in `docs/Phase-Plans/mkDocs.md` so it now describes the right-side TOC behavior.

#### Files Changed
- `mkdocs.yml`
- `docs/Phase-Plans/mkDocs.md`
- `docs/Doc-Log.md`

#### Notes
- This is a navigation-layout follow-up only. It does not change which docs are published in the site tree.

<!-- ENTRY 123 -->
### [123] - 2026-03-21 13:06 - `DOC - Expand MkDocs Site To All Non-Archive Docs`
<!-- ENTRY 123 -->
HUMAN SUMMARY: Updated the live MkDocs setup so the site now publishes the full non-archive `/docs` tree. The planning note now records that live behavior too, so the docs site is browseable through the sidebar instead of acting like a tiny two-page shell.

#### Scope
- Updated the live MkDocs config.
- Updated the MkDocs planning note to reflect the new live nav behavior.
- Recorded the document-side follow-up in the permanent doc log.

#### Summary
- Removed the earlier hand-written tiny nav from `mkdocs.yml`.
- Added archive exclusion patterns so everything else under `docs/` can appear in the inferred site tree.
- Added a `Live Nav Note` to `docs/Phase-Plans/mkDocs.md` explaining the current published behavior and its inferred ordering tradeoff.

#### Files Changed
- `mkdocs.yml`
- `docs/Phase-Plans/mkDocs.md`
- `docs/Doc-Log.md`

#### Notes
- This is the nav/publication-scope follow-up after the baseline MkDocs setup. It does not add branding, deployment, or custom navigation code.

<!-- ENTRY 122 -->
### [122] - 2026-03-21 13:03 - `DOC - Make Sketch Move Axis Phase Implementation-Ready`
<!-- ENTRY 122 -->
HUMAN SUMMARY: Tightened the open `3.2B-S6` sketch move-axis phase into a locked implementation-ready execution spec. The phase now identifies the exact current runtime gap, recommends the first narrow axis-leaf state shape inside the existing sketch-plane session, and spells out concrete changes across the store, console, viewport overlay, and targeted test coverage.

#### Scope
- Updated `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`.
- Recorded the document-only tightening in the permanent doc log.

#### Summary
- Marked the phase as locked and implementation-ready.
- Added current-code truth that `Move X / Y / Z` already exist as commands but still route through the parent move scope instead of a true axis leaf.
- Added a first recommended state shape for the move-axis leaf inside `sketchPlanePickSession`.
- Added concrete implementation steps covering `useSpaghettiStore`, `ConsoleDock`, `ViewportOverlay`, and targeted tests.
- Added a verification matrix for breadcrumb depth, float parsing, snap drag behavior, and off-snap confirm handling.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`

#### Notes
- This is a documentation tightening only; it does not change runtime behavior yet.
- The phase remains open until the deeper `Graph > Sketch > SketchPlane > Move > X / Y / Z` runtime path is implemented and verified.

<!-- ENTRY 121 -->
### [121] - 2026-03-21 13:01 - `DOC - Lock First Off-Snap Confirm Prompt For Sketch Move Axis Leaves`
<!-- ENTRY 121 -->
HUMAN SUMMARY: Tightened the open `3.2B-S6` sketch move-axis phase so the first off-snap confirm prompt is explicit instead of freeform. The phase now says typed off-snap values should transition into `confirm <value> off snap` with `[confirm, deny]` choices and an assisted `confirm` prefill so the user can press `Enter` immediately to allow the exact value.

#### Scope
- Updated `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`.
- Recorded the document-only clarification in the permanent doc log.

#### Summary
- Added a locked decision for the first exact off-snap confirm prompt shape.
- Replaced the looser warning example with a constrained `confirm / deny` choice flow.
- Clarified that `confirm` should be prefilled so a second `Enter` is enough to accept the off-snap value.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`

#### Notes
- This is a documentation clarification only; it does not change runtime behavior yet.
- The phase remains open because the deeper `Graph > Sketch > SketchPlane > Move > X / Y / Z` runtime path is still not implemented.

<!-- ENTRY 120 -->
### [120] - 2026-03-21 12:56 - `DOC - Lock Snap And Off-Snap Confirm Rules For Sketch Move Axis Leaves`
<!-- ENTRY 120 -->
HUMAN SUMMARY: Tightened the open `3.2B-S6` sketch move-axis phase so snap behavior inside `Move > X / Y / Z` is explicit instead of implied. The phase now says live axis dragging must still honor move snap, and typed values that do not line up to the active snap interval require one extra confirmation message before the exact off-snap number can be applied.

#### Scope
- Updated `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`.
- Recorded the document-only clarification in the permanent doc log.

#### Summary
- Added a locked decision that axis-leaf dragging still participates in move snap.
- Added a locked decision that typed off-snap values remain allowed after one extra confirmation step.
- Expanded the implementation spec with explicit snap inheritance and off-snap confirm behavior.
- Added acceptance checks covering snap-aligned drag and exact off-snap numeric entry.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`

#### Notes
- This is a documentation clarification only; it does not change runtime behavior yet.
- The phase remains open because the deeper `Graph > Sketch > SketchPlane > Move > X / Y / Z` runtime path is still not implemented.

<!-- ENTRY 119 -->
### [119] - 2026-03-21 12:52 - `DOC - Lock First Sketch Move Axis Float Grammar`
<!-- ENTRY 119 -->
HUMAN SUMMARY: Tightened the open `3.2B-S6` sketch move-axis phase so the first accepted numeric grammar is explicit instead of implied. The phase now says `Move > X / Y / Z` should accept signed integer and decimal forms including shorthand decimals like `.1` and `-.1`.

#### Scope
- Updated `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`.
- Recorded the document-only clarification in the permanent doc log.

#### Summary
- Added a locked decision for the first accepted float grammar in sketch move-axis leaves.
- Added explicit accepted examples for positive, negative, and shorthand decimal input.
- Clarified that axis-leaf parsing allows an optional leading sign and does not require a leading zero before the decimal point.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`

#### Notes
- This is a documentation clarification only; it does not change runtime behavior yet.
- The phase remains open because the deeper `Graph > Sketch > SketchPlane > Move > X / Y / Z` runtime path is still not implemented.

<!-- ENTRY 118 -->
### [118] - 2026-03-21 12:51 - `DOC - Clarify Drag And Type Interop For Sketch Move Axis Leaves`
<!-- ENTRY 118 -->
HUMAN SUMMARY: Tightened the open `3.2B-S6` sketch move-axis phase so the axis leaf interaction model is explicit instead of implied. The phase now says `Move > X / Y / Z` should keep live mouse dragging active for the selected axis while first typed input still clears and replaces the current assisted value for direct numeric entry.

#### Scope
- Updated `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`.
- Recorded the document-only clarification in the permanent doc log.

#### Summary
- Added a locked decision that axis-leaf entry should preserve live active-axis dragging.
- Clarified that typed input from the same leaf still uses replace-on-type behavior.
- Expanded the implementation spec with explicit drag-versus-typing interop rules.
- Added acceptance checks covering live drag continuity and typed overwrite behavior.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`

#### Notes
- This is a documentation clarification only; it does not change runtime behavior yet.
- The phase remains open because the deeper `Graph > Sketch > SketchPlane > Move > X / Y / Z` runtime path is still not implemented.

<!-- ENTRY 117 -->
### [117] - 2026-03-21 12:35 - `DOC - Land MkDocs Phase 1 Setup`
<!-- ENTRY 117 -->
HUMAN SUMMARY: Added the live Phase 1 MkDocs setup to the repo, including the root `mkdocs.yml`, the first `docs/index.md` landing page, a small docs dependency file, and a `site/` ignore rule for generated output. Updated the planning note and docs map too, so the implementation and the docs tracking now agree that the baseline MkDocs pass is complete.

#### Scope
- Added the live MkDocs config and first published docs page.
- Updated the MkDocs planning note to mark Phase 1 complete after verification.
- Updated the canonical docs map for the new `docs/index.md` page.
- Recorded the docs-side maintenance in the permanent doc log.

#### Summary
- Added `mkdocs.yml` with the locked minimal Material baseline from the planning doc.
- Added `docs/index.md` as the first site landing page.
- Added `requirements-docs.txt` to document the docs-site dependency install path.
- Added `site` to `.gitignore` so MkDocs build output stays out of normal repo changes.
- Updated `docs/Phase-Plans/mkDocs.md` to mark the Phase 1 completion checklist complete.

#### Files Changed
- `mkdocs.yml`
- `requirements-docs.txt`
- `.gitignore`
- `docs/index.md`
- `docs/Phase-Plans/mkDocs.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This doc-log entry covers the documentation and docs-structure side of the same implemented Phase 1 setup. The config/runtime-side change is recorded in `docs/CHANGELOG.md`.

<!-- ENTRY 116 -->
### [116] - 2026-03-21 12:33 - `DOC - Make MkDocs Phase 1 Implementation Ready`
<!-- ENTRY 116 -->
HUMAN SUMMARY: Tightened `docs/Phase-Plans/mkDocs.md` so `Phase 1 - MkDocs Baseline Setup` now reads as an implementation-ready execution spec instead of a loose setup idea. The phase now locks the minimal first-pass decisions, names the exact files and commands, and narrows the config baseline so the first implementation can succeed without getting blocked by branding assets, tags, or deployment work.

#### Scope
- Updated `docs/Phase-Plans/mkDocs.md`.
- Recorded the document-only follow-up in the permanent doc log.

#### Summary
- Added locked decisions for `Phase 1`, including `mkdocs.yml`, `mkdocs-material`, curated nav, and `toc.follow` plus `toc.integrate`.
- Added explicit Phase 1 file targets, install/build commands, and a smaller exact baseline config.
- Added a content rule that keeps the first published surface to `docs/index.md` plus `docs/Phase-Plans/mkDocs.md`.
- Replaced the older generic completion list with a more implementation-facing verification sequence and tighter completion checklist.

#### Files Changed
- `docs/Phase-Plans/mkDocs.md`
- `docs/Doc-Log.md`

#### Notes
- This is still planning-only documentation. No live `mkdocs.yml`, `docs/index.md`, or package install was added in this change.

<!-- ENTRY 115 -->
### [115] - 2026-03-21 12:41 - `DOC - Clarify Sketches As A Sibling Of Assembly`
<!-- ENTRY 115 -->
HUMAN SUMMARY: Tightened the open `3.2B-6` sketch ownership phase doc so the browser hierarchy is explicit instead of implied. The phase now says directly that `Sketches` belongs beside `Assembly` under `Content`, while per-sketch authored rows and `SketchPlane` stay below that family boundary.

#### Scope
- Updated `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-6 - Sketch Content Ownership And Later Export.md`.
- Recorded the document-only clarification in the permanent doc log.

#### Summary
- Added a direct hierarchy rule to the `3.2B-6` phase doc.
- Clarified that `Sketches` is a sibling family of `Assembly` under `Content`.
- Clarified that authored sketches live under `Sketches` and `SketchPlane` stays nested inside each sketch.
- Tightened the current-code wording so it matches that same hierarchy model.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-6 - Sketch Content Ownership And Later Export.md`

#### Notes
- This is a documentation clarification only; it does not change runtime behavior.
- The phase remains partial because later export and deeper sketch-owned child surfaces are still future work.

<!-- ENTRY 114 -->
### [114] - 2026-03-21 12:36 - `DOC - Split Sketch Phase Docs Into Shipped And Future`
<!-- ENTRY 114 -->
HUMAN SUMMARY: Reorganized the standalone sketch phase docs under the sketch architecture folder so fully shipped phases now live in `Shipped/` and open or partial phases live in `Future/`. Updated the main `Sketch.md` index text to describe that status-based layout as the new canonical structure for sketch phase planning/history docs.

#### Scope
- Moved standalone sketch phase docs under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/`.
- Updated the sketch architecture index to describe the new `Shipped/` and `Future/` layout.
- Recorded the document-only reorganization in the permanent doc log.

#### Summary
- Moved all fully shipped `[x]` sketch phase docs into `Sketch/Shipped/`.
- Moved all open `[ ]` and partial `[~]` sketch phase docs into `Sketch/Future/`.
- Added a new sketch doc-history note so the canonical architecture doc records when the phase-doc structure changed.
- Replaced the old “same folder” wording in `Sketch.md` with an explicit status-based folder rule.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B - Sketch Operation Authoring Family Map.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-0 - Existing Sketch Operation Authoring.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-DrawSketch-1 - Viewer-Owned Live Draw Preview.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-DrawSketch-1-Cleanup - Viewport Draw Workflow Cleanup.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-S1 - Sketch Session Hierarchy Model.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-S2 - SketchPlane Session Cleanup.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-S3 - SketchDraw Session Cleanup.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-S4 - Sketch Return One Level.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-S5 - Sketch Toolbar and Console Command Alignment.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Shipped/Sketch_Phase 3.2B-SketchPlane-1 - Source And Transform Surface.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-4 - Sketch Exposure And Browser Structure.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-5 - Sketch Browser Depth And Authored Content Surfaces.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-6 - Sketch Content Ownership And Later Export.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-2 - Multi-Step Tool Sessions And Commit Rules.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-DrawSketch-3 - Selection, Editing, And Richer Sketch Feedback.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-SketchPlane-2 - Viewport-First Source Pick And Sketch Origin Gizmo.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-SketchPlane-2-Cleanup - Main Viewport Integration And First-Pass Workflow Cleanup.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Future/Sketch_Phase 3.2B-SketchPlane-3 - Geometry-Driven Auto-Setup And Selection Highlighting.md`

#### Notes
- This is a document-organization change only; it does not change shipped runtime behavior.
- `Future/` intentionally includes partial phases like `[~] [3.2B-6]` so active follow-on work stays with the planning surface instead of being mixed into the historical shipped bucket.

<!-- ENTRY 113 -->
### [113] - 2026-03-21 12:25 - `DOC - Add One-Phase MkDocs Rollout Plan`
<!-- ENTRY 113 -->
HUMAN SUMMARY: Updated `docs/Phase-Plans/mkDocs.md` with a final `Phases` section that keeps the first MkDocs adoption pass to one bounded setup phase. The new section defines what belongs in that phase, what stays out of scope, and why one phase is safe if the repo treats deployment, branding, and broader docs curation as later follow-ons.

#### Scope
- Updated `docs/Phase-Plans/mkDocs.md`.
- Recorded the document-only follow-up in the permanent doc log.

#### Summary
- Added a final `## Phases` section to the MkDocs planning note.
- Defined `Phase 1 - MkDocs Baseline Setup` as the current recommended rollout shape.
- Added explicit in-scope and out-of-scope boundaries so the phase remains implementation-safe.
- Added a short completion checklist centered on config, dependencies, local serve/build, nav reachability, and section-tree behavior.

#### Files Changed
- `docs/Phase-Plans/mkDocs.md`
- `docs/Doc-Log.md`

#### Notes
- This is still planning-only documentation. No live MkDocs setup files or dependencies were added yet.

<!-- ENTRY 112 -->
### [112] - 2026-03-21 12:23 - `DOC - Add MkDocs Section Tree And Navigation Decision Notes`
<!-- ENTRY 112 -->
HUMAN SUMMARY: Updated `docs/Phase-Plans/mkDocs.md` so the MkDocs plan now captures the practical section-tree decision for this repo. The doc now distinguishes built-in current-page heading navigation from the editor-style folding that Material for MkDocs does not natively provide, and it records `toc.follow` / `toc.integrate` as the current recommended baseline.

#### Scope
- Updated `docs/Phase-Plans/mkDocs.md`.
- Recorded the document-only follow-up in the permanent doc log.

#### Summary
- Added `theme.features` guidance for `toc.follow`, `toc.integrate`, and optional `navigation.expand`.
- Added a new section that records the repo decision to keep normal Markdown headings and avoid per-doc HTML wrappers for collapsible content.
- Added a limits section explaining what Material can and cannot collapse natively.
- Added a short recommended baseline showing the current-page heading tree setup.

#### Files Changed
- `docs/Phase-Plans/mkDocs.md`
- `docs/Doc-Log.md`

#### Notes
- This remains planning-only documentation. No live MkDocs config or theme behavior changed in the repo yet.

<!-- ENTRY 111 -->
### [111] - 2026-03-21 12:23 - `DOC - Mark First 3.2B-6 Sketch Ownership Browser Cut Shipped`
<!-- ENTRY 111 -->
HUMAN SUMMARY: Updated the sketch planning docs after the first `3.2B-6` implementation landed in code. The sketch architecture, the standalone `3.2B-6` phase doc, and the roadmap now all record that browser-visible `Sketches` rows are shipped while the later vector-export portion remains deferred.

#### Scope
- Updated the sketch architecture and roadmap docs to match the shipped browser/content ownership cut.
- Kept the documentation honest about what landed now versus what remains for a later export follow-on.
- Recorded the doc maintenance in the permanent doc log.

#### Summary
- Marked the standalone `3.2B-6` sketch phase doc partial and added the shipped browser/content summary.
- Updated `Sketch.md` so the main sketch architecture now records the first shipped `Sketches` browser-family cut.
- Added a matching partial `3.2B-6` entry to the roadmap.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch_Phase 3.2B-6 - Sketch Content Ownership And Later Export.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation maintenance for already-shipped code behavior. It does not add new runtime behavior beyond the implementation recorded in `docs/CHANGELOG.md`.

<!-- ENTRY 110 -->
### [110] - 2026-03-21 12:18 - `DOC - Add Material MkDocs Starter Config To Planning Note`
<!-- ENTRY 110 -->
HUMAN SUMMARY: Updated `docs/Phase-Plans/mkDocs.md` with the friend-sent Material for MkDocs starter block so the repo now has a concrete candidate theme and extension baseline. Also added implementation-safe notes about required assets, built-in Material plugins, and the current deprecation of `tags_file`.

#### Scope
- Updated `docs/Phase-Plans/mkDocs.md`.
- Recorded the document-only follow-up in the permanent doc log.

#### Summary
- Added a `Material Starter Config Candidate` section with a planning-safe Material theme, palette, Markdown extension, and plugin block.
- Kept the tags plugin in the candidate config, but removed `tags_file` from the main recommended block.
- Added notes explaining that the favicon/logo paths require matching assets and that the listed plugins are built into Material for MkDocs.
- Added an open question about whether the current `head-fi` branding filenames should be replaced by ParaHook-specific assets.

#### Files Changed
- `docs/Phase-Plans/mkDocs.md`
- `docs/Doc-Log.md`

#### Notes
- This remains a docs-only planning update. No root `mkdocs.yml`, packages, or site assets were added to the repo yet.

<!-- ENTRY 109 -->
### [109] - 2026-03-21 12:15 - `DOC - Add MkDocs Planning Note Under Phase-Plans`
<!-- ENTRY 109 -->
HUMAN SUMMARY: Added `docs/Phase-Plans/mkDocs.md` as a lightweight planning note for a possible MkDocs documentation layer in this repo. Updated the docs map too, so the new file is discoverable from the canonical docs index instead of existing as an untracked one-off.

#### Scope
- Added `docs/Phase-Plans/mkDocs.md`.
- Updated `docs/Doc-Index.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Created a new fold-friendly doc with local `Doc History`, `Purpose`, and a simple MkDocs setup outline.
- Captured the default `mkdocs.yml` path plus the repo-specific note that a custom `mkdocs.yaml` filename would require `-f`.
- Added the new file to the `docs/Phase-Plans` branch of the canonical docs map.

#### Files Changed
- `docs/Phase-Plans/mkDocs.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This is a docs-only planning surface. It does not add MkDocs to the repo or create a live site configuration yet.

<!-- ENTRY 108 -->
### [108] - 2026-03-21 11:33 - `DOC - Mark Console Phase 4.1P Complete After Implementation`
<!-- ENTRY 108 -->
HUMAN SUMMARY: Updated the console planning docs after the `4.1P` implementation landed in code. The parent console architecture, the standalone `4.1P` phase doc, and the roadmap now all reflect that assisted prefills replace on first printable typing, preserve manual override until explicit assisted re-entry, and support the focused paste case.

#### Scope
- Updated `docs/Human-Plans/Architecture/Console/Console.md`.
- Updated `docs/Human-Plans/Architecture/Console/Console_Phase 4.1P - Assisted Prefill Replace-On-Type Across Levels.md`.
- Updated `docs/Human-Plans/roadmap/roadmap.md`.
- Recorded the document-only sync in the permanent doc log.

#### Summary
- Marked the standalone `4.1P` phase file complete.
- Added a new `Console.md` doc-history line recording the shipped implementation.
- Marked the `4.1P` console phase index entry complete and checked off its checklist items.
- Added a new roadmap doc-history line for the shipped `4.1P` implementation.
- Marked both the short roadmap lane list and the detailed console-lane section complete for `[4.1P]`.

#### Files Changed
- `docs/Human-Plans/Architecture/Console/Console.md`
- `docs/Human-Plans/Architecture/Console/Console_Phase 4.1P - Assisted Prefill Replace-On-Type Across Levels.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This is the docs sync for already-landed runtime behavior. The code implementation itself is tracked in `docs/CHANGELOG.md`.

<!-- ENTRY 107 -->
### [107] - 2026-03-21 11:24 - `DOC - Tighten Console Phase 4.1P Into A Safer Input-Override Spec`
<!-- ENTRY 107 -->
HUMAN SUMMARY: Tightened `Console_Phase 4.1P - Assisted Prefill Replace-On-Type Across Levels.md` so the new overwrite follow-on is more implementation-safe. The phase doc now explicitly covers first-key replacement versus append behavior, paste handling, assisted-follow state transitions, caret semantics, and a small verification matrix instead of leaving those edge cases implicit.

#### Scope
- Updated `docs/Human-Plans/Architecture/Console/Console_Phase 4.1P - Assisted Prefill Replace-On-Type Across Levels.md`.
- Recorded the document-only refinement in the permanent doc log.

#### Summary
- Added an explicit replace-trigger definition for printable input and paste.
- Added a compact assisted-follow state transition table.
- Added caret/selection semantics so the implementation reads as full-value replacement rather than append-after-caret editing.
- Added extra edge rules for paste and manual override behavior.
- Added a small verification matrix covering staged replacement, paste replacement, assisted cycling, re-entry into assisted-follow, and unchanged unconstrained typing.

#### Files Changed
- `docs/Human-Plans/Architecture/Console/Console_Phase 4.1P - Assisted Prefill Replace-On-Type Across Levels.md`
- `docs/Doc-Log.md`

#### Notes
- This is a docs-only implementation-spec refinement. It does not change the current console runtime yet.

<!-- ENTRY 106 -->
### [106] - 2026-03-21 10:04 - `DOC - Add FM Voice As A Flagship Audio Patchbay Node`
<!-- ENTRY 106 -->
HUMAN SUMMARY: Updated `Audio-Patchbay.md` to promote `FM Voice` into the first real generated-sound node shortlist and explain why FM synthesis is a particularly good fit for ParaHook. The new note ties FM directly to the app's broader generator identity and the desire to reuse the same node-and-wire authoring language across both 3D and audio generation.

#### Scope
- Updated `docs/Human-Plans/Architecture/Audio-Patchbay.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Added `FM Voice` to the early node-family list.
- Added a dedicated section explaining why FM synthesis is a strong first flagship generated-source direction.
- Captured the conceptual symmetry between:
  - `Spaghetti` as graph-driven model generation
  - `Audio Patchbay` as graph-driven sound generation
- Added a first-pass control/routing read for how an early `FM Voice` node could fit beside `Sequencer`, `Gain`, and later effects.

#### Files Changed
- `docs/Human-Plans/Architecture/Audio-Patchbay.md`
- `docs/Doc-Log.md`

#### Notes
- This is a docs-only architecture direction update. It does not implement any audio-synthesis code yet.

<!-- ENTRY 105 -->
### [105] - 2026-03-21 09:59 - `DOC - Dock SoundCloud Proxy Effects Path In Audio Patchbay`
<!-- ENTRY 105 -->
HUMAN SUMMARY: Updated `Audio-Patchbay.md` to permanently dock the tempting idea of resolving a `SoundCloud` link into a direct stream, proxying it for CORS, and then running it through the full `Audio Patchbay` effects graph. The new note explains why the DSP architecture is technically plausible in general, why it is still the wrong product path for `SoundCloud`, and why the repo should treat it as policy-risk rather than a future hidden workaround.

#### Scope
- Updated `docs/Human-Plans/Architecture/Audio-Patchbay.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Added one new local `Doc History` line to the audio architecture note.
- Added a dedicated docked-idea section explaining:
  - the attractive proxy-based architecture
  - the current widget/raw-stream limitation
  - why full effect nodes need source ownership
  - why `SoundCloud` policy risk makes this a docked path
- Added a lasting warning to re-check `SoundCloud` policy before revisiting the idea later.
- Clarified that the real first-class source targets for future effect nodes should be imported, self-hosted, or generated audio.

#### Files Changed
- `docs/Human-Plans/Architecture/Audio-Patchbay.md`
- `docs/Doc-Log.md`

#### Notes
- This is a docs-only architecture and policy clarification. It does not change the current runtime or `Radio` implementation.

<!-- ENTRY 104 -->
### [104] - 2026-03-21 09:57 - `DOC - Mark Radio_Phase 11 Complete After Waveform Implementation`
<!-- ENTRY 104 -->
HUMAN SUMMARY: Marked the split-out `Radio_Phase 11` file complete after the waveform implementation landed in code, so the new per-phase radio doc folder now reflects the shipped state for exact generated-tone waveforms, limited SoundCloud waveform mode, and merged-toolbar playhead plus cue markers.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio/Radio_Phase 11`.
- Recorded the document-only sync in the permanent doc log.

#### Summary
- Marked `Phase 11 - Source Waveform Visualization` complete.
- Kept the phase file aligned with the now-shipped implementation outcome in code.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio/Radio_Phase 11`
- `docs/Doc-Log.md`

#### Notes
- This was a documentation sync after the implementation landed and verified successfully.

<!-- ENTRY 103 -->
### [103] - 2026-03-21 09:41 - `DOC - Lock Audio Patchbay Versus Spaghetti Sounds Naming Split`
<!-- ENTRY 103 -->
HUMAN SUMMARY: Updated `Audio-Patchbay.md` to lock the naming split between the broader system and the friendlier UI label. `Audio Patchbay` now stays as the umbrella architecture name, while `Spaghetti Sounds` is explicitly positioned as the preferred toolbar-level surface name.

#### Scope
- Updated `docs/Human-Plans/Architecture/Audio-Patchbay.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Added one new local `Doc History` line to the audio architecture note.
- Added `Spaghetti Sounds` as an explicit naming option with a clearer recommendation boundary.
- Added a dedicated `Naming Split` section so the repo now has one canonical read for system name versus UI-facing toolbar label.

#### Files Changed
- `docs/Human-Plans/Architecture/Audio-Patchbay.md`
- `docs/Doc-Log.md`

#### Notes
- This is a docs-only naming clarification. It does not rename any current runtime surface in code.

<!-- ENTRY 103 -->
### [103] - 2026-03-21 09:36 - `DOC - Tighten Radio_Phase 11 Into An Implementation-Ready Waveform Spec`
<!-- ENTRY 103 -->
HUMAN SUMMARY: Reworked the new split-out `Radio_Phase 11` file under `docs/Human-Plans/Architecture/Radio/` into an implementation-ready waveform phase spec, locking the first fidelity decisions, first exact-source target, file seams, state shape, test bar, and completion criteria for a future waveform pass. This also carries the radio planning workflow into the new per-phase folder structure instead of relying only on the older giant umbrella doc.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio/Radio_Phase 11`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Promoted `Phase 11 - Source Waveform Visualization` from a general idea note into a concrete execution spec.
- Locked the two key decisions:
  - the first waveform must be provider-aware and honest
  - `generated-tone` should be the first exact waveform source
- Added:
  - concrete code targets
  - canonical waveform state shape
  - recommended helper names
  - rendering and marker rules
  - implementation order
  - completion check

#### Files Changed
- `docs/Human-Plans/Architecture/Radio/Radio_Phase 11`
- `docs/Doc-Log.md`

#### Notes
- This is a doc-only change.
- The new phase file now matches the same implementation-ready bar used earlier in the radio planning workflow.

<!-- ENTRY 102 -->
### [102] - 2026-03-21 09:33 - `DOC - Add Radio Waveform Visualization Phase`
<!-- ENTRY 102 -->
HUMAN SUMMARY: Added a new waveform-visualization phase to `Radio.md` so the radio/sampler planning surface now explicitly answers how a detailed waveform could fit into the merged toolbar without faking exact waveform data for sources like the current SoundCloud widget path. The new phase locks a provider-aware fidelity model and gives the work a concrete question, suggestion, and implementation spec.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Added `Phase 11 - Source Waveform Visualization` at the end of the radio architecture note.
- Locked the main design answer:
  - yes, detailed waveform UI is possible
  - but it should be provider-aware and honest about exact versus limited waveform data
- Added the first-pass state model, ownership split, rendering rules, marker rules, test targets, and likely file seams for a future implementation pass.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This is a planning/doc-only change.
- The new phase explicitly treats `SoundCloud widget` as waveform-limited until a trustworthy waveform-data path exists.

<!-- ENTRY 101 -->
### [101] - 2026-03-21 09:31 - `DOC - Add Audio Patchbay Umbrella Architecture Note`
<!-- ENTRY 101 -->
HUMAN SUMMARY: Added a new architecture idea doc for the broader post-`Radio` audio direction, framing the current `Radio` and `Sampler` work as one branch of a future node-and-wire audio editor that could grow toward a DAW-like ParaHook subsystem. The docs map was updated so this new umbrella planning surface is discoverable beside the existing architecture docs.

#### Scope
- Added `docs/Human-Plans/Architecture/Audio-Patchbay.md`.
- Updated `docs/Doc-Index.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Created a new canonical architecture note for the bigger audio-graph vision beyond the current `Radio` toolbar and simple sequencer scope.
- Recommended `Audio Patchbay` as the current working name while keeping the naming decision explicitly open inside the doc.
- Captured the relationship to `Radio`, `Sampler`, and `Spaghetti`, plus likely node families, wire types, guardrails, and an honest first expansion path.
- Added the new file to the architecture docs map so it is easy to find later.

#### Files Changed
- `docs/Human-Plans/Architecture/Audio-Patchbay.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This is an architecture-only planning surface; it does not change the current implementation scope in `Radio.md` or `Sampler.md`.

<!-- ENTRY 100 -->
### [100] - 2026-03-21 08:46 - `DOC - Mark Radio Phase 10 Complete After Shared Toolbar Merge`
<!-- ENTRY 100 -->
HUMAN SUMMARY: Marked `Phase 10` complete in `Radio.md` after the live UI stopped using the separate sampler panel as the primary toolbar surface and moved the sampler into the shared radio toolbar. The phase now reflects the shipped state: preserved horizontal pattern row, preserved sampler controls, store-backed disclosure state, per-step time-position editing, and the merged sampler-green styling direction.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md`.
- Recorded the document-only sync in the permanent doc log.

#### Summary
- Marked the `Phase 10` title checkbox complete.
- Added one new local `Doc History` line describing the shipped merged-toolbar state.
- Synced the architecture doc to the actual live implementation outcome.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This was a documentation sync after the implementation landed and verified successfully.

<!-- ENTRY 099 -->
### [099] - 2026-03-21 08:34 - `DOC - Prioritize Per-Step Time Position ParaSlider In Radio Phase 10`
<!-- ENTRY 099 -->
HUMAN SUMMARY: Tightened `Phase 10` in `Radio.md` so the most important per-step control in the expanded vertical detail area is now an explicit time-position `ParaSlider`. The phase now treats manual cue placement for each step as the primary step-detail editing action, ahead of extra per-step modulation or lower-priority controls.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Updated the Phase 10 header/detail language so per-step detail is centered on a time-position `ParaSlider`.
- Added a dedicated `Per-Step Time Position Rule`.
- Expanded the test targets so the phase now requires proving that moving a step's `ParaSlider` updates the stored cue assignment.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This was a doc-only planning update. No runtime code or tests changed in this step.

<!-- ENTRY 098 -->
### [098] - 2026-03-21 08:33 - `DOC - Preserve Horizontal Sampler And Green Styling In Radio Phase 10`
<!-- ENTRY 098 -->
HUMAN SUMMARY: Tightened `Phase 10` in `Radio.md` again so the shared-toolbar merge now explicitly preserves the already-shipped horizontal sampler row and existing sampler buttons/controls instead of replacing them with a purely vertical disclosure UI. The update also locks the visual direction that the merged `Radio` toolbar should adopt the sampler's green styling language.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Updated the `Phase 10` header, main decisions, baseline, remaining delta, and completion shape.
- Added explicit rules for:
  - preserving the horizontal sampler pattern
  - preserving the existing `Phase 9` sampler controls/buttons
  - styling the merged toolbar with the sampler-green direction
- Expanded the tests, likely file edits, and implementation order so the next UI refactor keeps the current sampler interaction model intact while merging it into the shared radio toolbar.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This was a doc-only planning update. No runtime code or tests changed in this step.

<!-- ENTRY 097 -->
### [097] - 2026-03-20 17:34 - `DOC - Tighten Radio Phase 10 Into Implementation-Ready Shared Toolbar Spec`
<!-- ENTRY 097 -->
HUMAN SUMMARY: Tightened `Phase 10` in `Radio.md` so the shared-toolbar sampler follow-on now reads like a real execution target instead of a general UI direction note. The update locks the end-state decision, maps the merge onto the current live `RadioPanel` / `AudioSamplerPanel` / store / shell seams, and adds clearer disclosure-state, migration, preservation, test, and completion rules for the sampler UI refactor.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Marked the `Phase 10` ownership/migration question as decided.
- Added stronger implementation-ready language around:
  - merged-toolbar ownership
  - disclosure-state actions and persistence
  - preserved sampler behavior from `Phase 9`
  - migration away from the separate sampler panel
- Expanded the file targets, tests, implementation order, and completion checks so the next phase can be implemented directly from the doc.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This was a doc-only planning update. No runtime code or tests changed in this step.

<!-- ENTRY 096 -->
### [096] - 2026-03-20 17:27 - `DOC - Add Shared Radio Toolbar Sampler Expansion Phase`
<!-- ENTRY 096 -->
HUMAN SUMMARY: Added a new `Phase 10` to `Radio.md` for the next sampler UI expansion: folding `Sampler` back into the shared `Radio` toolbar as a disclosure-tree surface with sibling `Radio` / `Sampler` sections, a collapsible `Steps` block above `Note Repeat`, and expandable per-step rows. The new phase also locks the end-state direction that the separate sampler panel from `Phase 9` should be transitional once the shared-toolbar version is complete.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Added `Phase 10 - Shared Radio Toolbar Tree And Step Detail Expansion`.
- Structured the phase with:
  - `Header`
  - `Q1`
  - `Suggestion`
  - `Locked Read`
  - `Implementation Spec`
- Locked the intended shared-toolbar tree shape:
  - `Radio`
  - `Sampler`
  - `Steps`
  - `Note Repeat`
- Added disclosure-state guidance, step-row presentation rules, future-track direction, file targets, tests, and implementation order.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This was a doc-only planning update. No runtime code or tests changed in this step.

<!-- ENTRY 095 -->
### [095] - 2026-03-20 17:24 - `DOC - Capture Radio Sampler Toolbar Tree In Codex Notes`
<!-- ENTRY 095 -->
HUMAN SUMMARY: Added a new active Codex-notes context block for the radio sampler idea so the current chat preserves the intended toolbar tree shape: `Radio` plus `Sampler`, global BPM and note-repeat controls, track lanes, and expandable per-step settings using the existing `collapsed / essentials / expanded` app pattern.

#### Scope
- Updated `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`.
- Recorded the document-only notes update in the permanent doc log.

#### Summary
- Added a new numbered Codex-notes entry that captures the desired radio-toolbar structure for the future sampler.
- Locked the high-level rule that the sampler should live inside the shared radio toolbar as a collapsible tree rather than as a separate unrelated panel.
- Recorded the intended ownership split between sampler-global controls, track/lane rows, and deeper per-step settings that open only when expanded.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is a documentation/working-context update only; no runtime, toolbar, or sampler code changed in this step.

<!-- ENTRY 094 -->
### [094] - 2026-03-20 17:16 - `DOC - Tighten Radio Phase 9 Into Implementation-Ready Sampler Spec`
<!-- ENTRY 094 -->
HUMAN SUMMARY: Tightened `Phase 9` in `Radio.md` so the sampler follow-on now reads as a true implementation-ready execution spec instead of a broad architecture note. The update locks the ownership question, maps the work onto the current live radio/runtime files, and adds a baseline-versus-delta read plus concrete helper, state, timing, file, and test targets.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Marked the Phase 9 ownership question as decided.
- Added a `Current Landed Baseline` section tied to the already-shipped radio toolbar/runtime work.
- Added a clearer `Remaining Delta To Close This Phase` section.
- Tightened the file mapping for `AudioSamplerPanel.tsx`, `TimelineTransport.ts`, `AudioEngine.ts`, `AppShell.tsx`, and `audioSamplerStore.ts`.
- Added a first honest runtime direction, recommended concrete state/helper names, and a more execution-oriented implementation order.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This was a doc-only planning update. No runtime code or tests changed in this step.

<!-- ENTRY 093 -->
### [093] - 2026-03-20 17:12 - `DOC - Add Sampler Phase To Radio Architecture`
<!-- ENTRY 093 -->
HUMAN SUMMARY: Added a new `Phase 9 - Sampler Sequencer Surface` block to `Radio.md` so the radio architecture now includes the first concrete sequencer follow-on: a simple one-row sampler that reuses the current radio source/runtime seams. The new phase includes one locked ownership question plus a full implementation-ready spec covering state, timing, UI, runtime, and test targets.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md`.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Added a new post-hardening sampler phase after the existing radio toolbar and hardening phases.
- Structured the new phase with:
  - `Header`
  - one `Q1` section
  - `Suggestion`
  - `Locked Read`
  - `Implementation Spec`
- Locked the first sampler to reuse current radio source/runtime ownership while giving sampler its own pattern, BPM, step, playback, and note-repeat state.
- Added file targets, state shape, timing rules, playback rules, note-repeat rules, test targets, and implementation order for the first honest sequencer pass.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This is a planning-only update. No runtime code or tests changed in this step.

<!-- ENTRY 092 -->
### [092] - 2026-03-20 16:57 - `DOC - Add Sampler Architecture Vision`
<!-- ENTRY 092 -->
HUMAN SUMMARY: Created `Sampler.md` as a dedicated architecture note for a simple one-row sequencer driven by the current radio/url source, including the first locked controls for step count, BPM, looping playback, and a narrow note-repeat block. Updated `Doc-Index.md` so the new sampler planning surface is discoverable beside the broader `Radio` architecture doc.

#### Scope
- Created `docs/Human-Plans/Architecture/Sampler.md`.
- Updated `docs/Doc-Index.md` to list the new architecture doc in the foldable docs map.
- Recorded the document-only change in the permanent doc log.

#### Summary
- Added a new `Sampler` architecture note that captures the first simple sequencer vision as one horizontal row of `4`, `8`, `16`, or `32` steps over one bar.
- Locked the current-source rule so each step points at a stable random cue time inside the current radio/url source rather than acting like a separate imported sample file.
- Defined the first user-facing control set around sequence length, BPM, play/stop transport, and a compact `Note Repeat` block with `Enabled`, `Repeat Count`, and `Repeat Rate`.
- Updated the docs map so future work can reference `Sampler.md` directly instead of overloading `Radio.md` with every sequencer-specific decision.

#### Files Changed
- `docs/Human-Plans/Architecture/Sampler.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This is a documentation/spec update only; no runtime, store, or UI code changed in this step.

<!-- ENTRY 091 -->
### [091] - 2026-03-20 15:28 - `DOC - Add Console OpenToolbar CloseToolbar To Radio 7`
<!-- ENTRY 091 -->
HUMAN SUMMARY: Updated `Phase 7` in `Radio.md` so the radio toolbar is explicitly opened and closed from the console `Radio` scope instead of being treated as shell-only UI. The spec now adds `OpenToolbar` and `CloseToolbar` as sibling radio commands with aliases `OT` and `CT`, plus the matching canonical visibility-state rule.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change limited to the `Phase 7` radio-toolbar planning layer.
- Recorded the document-only follow-up in the permanent doc log.

#### Summary
- Added one local `Doc History` line describing the new console-driven toolbar visibility plan.
- Extended `Phase 7` with explicit `OpenToolbar` and `CloseToolbar` radio-scope commands.
- Added the `OT` and `CT` aliases, the canonical toolbar-visibility-state rule, and the file/test targets for console execution plus visibility sync.
- Updated the implementation order and completion shape so console-driven toolbar visibility is part of the first toolbar phase.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This is a documentation/spec update only; no runtime or console code changed in this step.

<!-- ENTRY 090 -->
### [090] - 2026-03-20 15:24 - `DOC - Align Radio 7 To Shared Toolbar Template`
<!-- ENTRY 090 -->
HUMAN SUMMARY: Updated `Phase 7` in `Radio.md` so the first visible radio UI is no longer described as a generic custom panel. It now explicitly reuses the shared toolbar template direction from `Toolbar.md`, including the shell/layout contract centered on `ViewportOverlayToolPanel.tsx`.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change limited to the `Phase 7` toolbar/control-surface planning layer.
- Recorded the document-only follow-up in the permanent doc log.

#### Summary
- Added one local `Doc History` line describing the toolbar-template alignment.
- Updated `Phase 7` so the locked read now requires the shared toolbar template layout.
- Added explicit toolbar-template, layout-shape, title-bar, and section-ownership rules.
- Expanded the file targets and implementation order so `ViewportOverlayToolPanel.tsx` is the shared shell/template seam for the radio toolbar where feasible.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This is a documentation/spec update only; no runtime or UI code changed in this step.

<!-- ENTRY 089 -->
### [089] - 2026-03-20 15:21 - `DOC - Raise Radio 7 To Require Real Transport And ParaSlider Seek`
<!-- ENTRY 089 -->
HUMAN SUMMARY: Reworked `Phase 7` in `Radio.md` again so the first visible radio UI must now expose real transport truth: current time, duration, and a seekable `ParaSlider` for time position. This makes user-adjustable time position part of the first toolbar/control-surface phase instead of leaving seek deferred.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change limited to the `Phase 7` toolbar/control-surface spec.
- Recorded the document-only follow-up in the permanent doc log.

#### Summary
- Added one local `Doc History` line describing the raised `Phase 7` transport bar.
- Updated the `Phase 7` header, locked control set, and acceptance shape to require current-time readout, duration readout, and a seekable `ParaSlider`.
- Added explicit `Transport Truth`, `ParaSlider`, and `Seek` rules plus the needed store/runtime seams, file targets, test targets, and completion order changes.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This is a documentation/spec update only; no runtime or UI code changed in this step.

<!-- ENTRY 088 -->
### [088] - 2026-03-20 15:18 - `DOC - Make Radio 7 Implementation Ready`
<!-- ENTRY 088 -->
HUMAN SUMMARY: Reworked `Phase 7` in `Radio.md` into an implementation-ready spec for the first visible radio toolbar/control surface. The doc now locks the compact hosted-panel direction, defines the first required control set, and maps the work onto the current app-shell, panel, store, and runtime seams.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change limited to the post-`Phase 6` planning/spec layer.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Added one local `Doc History` line describing the new `Phase 7` planning pass.
- Replaced the old placeholder `Phase 7` block with a structured implementation-ready spec.
- Locked the first visible-surface decision, first required controls, file targets, test targets, implementation order, and hard rules for the radio toolbar/control surface.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This is a documentation/planning update only; no runtime or UI code changed in this step.

<!-- ENTRY 087 -->
### [087] - 2026-03-20 14:40 - `DOC - Mark Radio 6 Complete`
<!-- ENTRY 087 -->
HUMAN SUMMARY: Updated `Radio.md` after the Phase 6 real-link runtime work landed. The doc now marks `Phase 6` complete, records that supported SoundCloud playback is active, and moves the next-work read forward to the toolbar and hardening phases.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change limited to implementation-status sync after the landed real-link bridge work.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Added one local `Doc History` line describing the shipped Phase 6 runtime behavior.
- Marked `Phase 6 - Real Link Playback Bridge` complete.
- Updated the `Current read` block so the next open radio work starts at `Phase 7`.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This is a documentation/status sync only; the shipped runtime changes are logged separately in `docs/CHANGELOG.md`.

<!-- ENTRY 086 -->
### [086] - 2026-03-20 14:34 - `DOC - Make Radio 6 Implementation Ready`
<!-- ENTRY 086 -->
HUMAN SUMMARY: Reworked `Phase 6` in `Radio.md` from a placeholder into an implementation-ready real-link playback spec. The doc now locks a provider-aware first real-link path, keeps the fallback bridge as the safety net, and defines unsupported custom links as explicit runtime state instead of silent fallback success.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change focused on the next radio execution phase after the landed fallback bridge.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Locked the first real-link direction as provider-aware, not generic arbitrary URL playback.
- Kept `ClipLibrary.ts` as the source-resolution owner and `AudioEngine.ts` as the runtime execution owner.
- Added current-baseline, remaining-delta, source-descriptor, runtime-status, test-target, and implementation-order sections for `Phase 6`.
- Defined unsupported custom links as an explicit runtime/source state instead of a hidden fallback downgrade.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This is a documentation/spec update only; no runtime code changed in this step.

<!-- ENTRY 085 -->
### [085] - 2026-03-20 14:30 - `DOC - Add Real Link And Toolbar Follow-On Radio Phases`
<!-- ENTRY 085 -->
HUMAN SUMMARY: Expanded the later radio phase ladder in `Radio.md` now that fallback playback is working. The doc now inserts a dedicated real-link playback phase first, then a toolbar/control-surface phase after that, and moves the older hardening block down so the post-fallback implementation order matches the intended product direction.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change focused on the later radio phase ladder after the landed fallback bridge.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Added `Phase 6 - Real Link Playback Bridge`.
- Added `Phase 7 - Radio Toolbar And Control Surface`.
- Renamed the old hardening block to `Phase 8 - Hardening And Follow-Through`.
- Updated the local `Current read` summary so the next radio work order is now:
  - real-link playback
  - toolbar/control surface
  - hardening

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This was a documentation-only planning update; no code changed in this step.

<!-- ENTRY 084 -->
### [084] - 2026-03-20 14:25 - `DOC - Mark Radio 5 And 4.1O Family Complete`
<!-- ENTRY 084 -->
HUMAN SUMMARY: Updated the radio planning docs after the fallback playback bridge landed. `Radio.md` now marks `Phase 5` complete, and `roadmap.md` now marks `[4.1O2]`, `[4.1O3]`, and the parent `[4.1O]` complete so the live planning surfaces finally match the shipped console-first radio family end to end.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` and `docs/Human-Plans/roadmap/roadmap.md`.
- Kept the change limited to implementation-status sync after the landed Phase 5 runtime work.
- Recorded the document-only status update in the permanent doc log.

#### Summary
- Marked `Phase 5 - [4.1O3] - Runtime Source Bridge` complete in `Radio.md`.
- Added one local `Doc History` line to `Radio.md` describing the landed runtime bridge.
- Marked `[4.1O2]`, `[4.1O3]`, and the parent `[4.1O]` complete in `roadmap.md`.
- Added one local `Doc History` line to `roadmap.md` describing the completed radio mini-family.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This was a documentation-only status sync after the code implementation; no additional runtime behavior changed in this step.

<!-- ENTRY 083 -->
### [083] - 2026-03-20 14:19 - `DOC - Make Radio 5 Implementation Ready`
<!-- ENTRY 083 -->
HUMAN SUMMARY: Reworked `Phase 5` in `Radio.md` from a short placeholder into an implementation-ready runtime playback spec. The phase now locks the first playback bridge to an honest fallback local source, ties the work to the landed `requestRadioBurst(...)` store seam plus the empty `src/runtime/audio/*` placeholders, and defines one app-level runtime subscriber path that can make the console radio audible without moving playback into `ConsoleDock`.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change focused on making `Phase 5` directly actionable against the current repo.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Renamed the phase heading to `Phase 5 - [4.1O3] - Runtime Source Bridge`.
- Added two locked question blocks:
  - one for using a practical fallback local source instead of requiring direct SoundCloud control first
  - one for keeping the runtime consumer app-level instead of console-local
- Added a full implementation spec covering:
  - current code-to-target mapping
  - current landed baseline versus remaining delta
  - source resolution, runtime subscriber, audio-engine, transport, and store-status rules
  - likely file edits, tests, implementation order, and completion checks
- Removed the stale bottom `Questions / Decisions` block once those decisions were absorbed into the implementation-ready phase structure.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This was a documentation-only implementation-planning update; no code changed in this step.

<!-- ENTRY 082 -->
### [082] - 2026-03-20 14:14 - `DOC - Mark Radio 4 Complete And Set 4.1O3 Partial`
<!-- ENTRY 082 -->
HUMAN SUMMARY: Updated the radio planning docs after the Phase 4 implementation landed. `Radio.md` now marks `Phase 4` complete, and `roadmap.md` now marks `[4.1O3]` partial so the live planning surfaces match the shipped trigger-wiring half while still leaving playback bridging open.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` and `docs/Human-Plans/roadmap/roadmap.md`.
- Kept the change limited to implementation-status sync after the landed Phase 4 code work.
- Recorded the document-only status update in the permanent doc log.

#### Summary
- Marked `Phase 4 - [4.1O3] - Radio 3 - Console Trigger Wiring` complete in `Radio.md`.
- Added one local `Doc History` line to `Radio.md` describing the landed trigger-wiring implementation.
- Marked `[4.1O3]` partial in `roadmap.md` because trigger wiring is now implemented while the playback bridge remains open.
- Added one local `Doc History` line to `roadmap.md` describing the new `[4.1O3]` partial status.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This was a documentation-only status sync after the code implementation; no additional runtime behavior changed in this step.

<!-- ENTRY 081 -->
### [081] - 2026-03-20 14:12 - `DOC - Make Radio 4 Implementation Ready`
<!-- ENTRY 081 -->
HUMAN SUMMARY: Reworked `Phase 4` in `Radio.md` from a short idea block into an implementation-ready execution spec for the console trigger-wiring pass. The phase now has a `[4.1O3]` heading, locked decisions for highlight identity and arrow-trigger scope, concrete code targets in `ConsoleDock`, `useConsoleStore`, `radioCommandIdentity`, and `audioSamplerStore`, plus a narrow burst-request seam that cleanly hands off to the later playback bridge.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change focused on making `Phase 4` directly actionable against the current repo.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Renamed the phase heading to `Phase 4 - [4.1O3] - Radio 3 - Console Trigger Wiring`.
- Added two locked question blocks:
  - one for using the same semantic identity for highlight and accept
  - one for limiting arrow-trigger sound to real staged-choice cycling
- Added a full implementation spec covering:
  - current code-to-target mapping
  - current landed baseline versus remaining delta
  - trigger-boundary rules for `Enter`, `ArrowUp`, and `ArrowDown`
  - the recommended `requestRadioBurst(...)` handoff seam
  - likely file edits, tests, implementation order, and completion checks

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This was a documentation-only implementation-planning update; no code changed in this step.

<!-- ENTRY 080 -->
### [080] - 2026-03-20 14:03 - `DOC - Check Off Radio 2 And Radio 3 Phase Titles`
<!-- ENTRY 080 -->
HUMAN SUMMARY: Updated the phase-title checklist state in `Radio.md` so the document now reflects the radio work that already landed in code. `Phase 2` and `Phase 3` are now marked complete at the heading level, while the later playback-oriented phases remain open.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Limited the change to phase-title checklist status plus one matching local doc-history line.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Marked `Phase 2 - [4.1O2] - Radio 2 - Canonical Session State And Defaults` complete.
- Marked `Phase 3 - [4.1O2] - Command Identity Template System` complete.
- Added one `Doc History` line inside `Radio.md` so the local history matches the permanent doc-log entry.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This was a documentation-only status sync; no code changed in this step.

<!-- ENTRY 079 -->
### [079] - 2026-03-20 13:52 - `DOC - Make Radio 3 Implementation Ready`
<!-- ENTRY 079 -->
HUMAN SUMMARY: Tightened `Phase 3` in `Radio.md` from a well-structured planning block into an implementation-ready execution spec. The updated phase now inventories the current live command-id strings emitted by `ConsoleDock.tsx`, marks those formats as transitional, names one concrete `resolveConsoleRadioCommandIdentity(...)` seam to add, and gives a direct file-edit and completion-check read for normalizing the radio command-template identity system.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change focused on making `Phase 3` directly actionable against the current repo.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Marked the two `Phase 3` question blocks as locked decisions rather than still-open design questions.
- Added `Current Live Identity Inventory` for the existing `prompt:`, `staged:`, `invalid:`, and `flat:` tracking strings already used in `ConsoleDock.tsx`.
- Added a `Canonical Versus Transitional Identity Rule` so the doc now clearly separates the current temporary formats from the intended final command-identity grammar.
- Added a concrete `resolveConsoleRadioCommandIdentity(...)` seam, recommended inputs/outputs, likely file edits, and a direct completion check for the phase.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`

#### Notes
- This was a documentation-only implementation-planning update; no code changed in this step.

<!-- ENTRY 078 -->
### [078] - 2026-03-20 13:48 - `DOC - Structure Radio 3 As An Execution Spec`
<!-- ENTRY 078 -->
HUMAN SUMMARY: Reworked `Phase 3` in `Radio.md` from a short concept block into the same execution-spec format used by the earlier radio phases. The phase now has a `[4.1O2]` heading, explicit question blocks about semantic identities and allocation boundaries, and a code-targeted implementation spec tied to the current `ConsoleDock` tracking strings and `audioSamplerStore` sample-position seam.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change focused on making `Phase 3` implementation-ready.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Renamed the phase heading to `Phase 3 - [4.1O2] - Command Identity Template System`.
- Added `Q1` for semantic identity versus raw typed text.
- Added `Q2` for where sample-time allocation should occur in the console flow.
- Added an `Implementation Spec` that defines:
  - current code-to-target mapping
  - current landed baseline versus remaining delta
  - the recommended canonical identity grammar
  - alias normalization rules
  - prompt-submit identity rules
  - store/resolver ownership
  - test targets and implementation order

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`

#### Notes
- This change only structures the planning doc; it does not change runtime radio behavior.

<!-- ENTRY 077 -->
### [077] - 2026-03-20 13:43 - `DOC - Make Radio 2 Implementation Ready`
<!-- ENTRY 077 -->
HUMAN SUMMARY: Expanded `Phase 2` in `Radio.md` from a mostly product-level state spec into an implementation-ready execution spec tied directly to the current console-radio code. The updated phase now names the concrete code seams already carrying radio state, distinguishes the landed baseline from the remaining `[4.1O2]` delta, and adds explicit command-routing, test-target, and completion-order sections so the next radio state pass can be implemented without reopening ownership questions.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change focused on making `[4.1O2]` implementation-ready against the current repo.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Marked the `Off` decision block as a locked `Q1` instead of an open question.
- Added `Current Code-To-Target Mapping` for:
  - `audioSamplerStore.ts`
  - `ConsoleDock.tsx`
  - `useConsoleStore.ts`
  - `stagedNavigation.ts`
- Added a `Current Landed Baseline` section and a `Remaining Delta To Close [4.1O2]` section so the doc reflects the real current code state.
- Added explicit command-routing ownership, prompt seeding rules, transcript-read rules, concrete test targets, and a direct completion order for the remaining Phase 2 work.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`

#### Notes
- This change does not alter runtime behavior; it only makes the next radio-state phase executable against the current codebase.

<!-- ENTRY 076 -->
### [076] - 2026-03-20 13:39 - `DOC - Make Radio Off Return To Root And Rename Its Alias`
<!-- ENTRY 076 -->
HUMAN SUMMARY: Updated `Radio.md` so `Off` now mirrors `On` as an apply-and-return-to-root action in the console-radio flow. The same doc pass also corrected the first alias read from the older `Off -> F` wording to `Off -> FF`, so the spec now consistently reads `On -> O` and `Off -> FF`.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change focused on the `Off` command flow and alias wording.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Changed the `Phase 1` alias read from `Off -> F` to `Off -> FF`.
- Added the `Off -> return to root after submit` rule to the `Radio 1` header, staged result behavior, submit rules, and acceptance shape.
- Updated the local `Radio` scope alias read to `FF`.
- Synced `Phase 2` command ownership so `Off` also carries the same return-to-root behavior after submit.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`

#### Notes
- This was a documentation-only behavior clarification and alias correction; no code changed in this step.

<!-- ENTRY 075 -->
### [075] - 2026-03-20 13:37 - `DOC - Make Radio On Return To Root`
<!-- ENTRY 075 -->
HUMAN SUMMARY: Updated `Radio.md` so the console-radio flow now explicitly says `On` should return the user to root after submit. The change aligns the `Radio 1` header, staged-result behavior, submit rules, acceptance shape, and the `Phase 2` command-ownership read so `On` consistently behaves as an apply-and-exit action rather than a stay-in-radio command.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change focused on the `On` command flow and state-ownership wording.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Added the `On -> return to root after submit` rule to the `Radio 1` header.
- Updated the staged result/read sections in `Phase 1` so `On` executes and then returns to root.
- Added explicit `Submit Rule` wording that `On` is an apply-and-exit action.
- Updated the local acceptance shape to require root return after successful `On`.
- Synced `Phase 2` command ownership so the `On` state change also carries the same return-to-root behavior.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`

#### Notes
- This was a documentation-only behavior clarification; no code changed in this step.

<!-- ENTRY 074 -->
### [074] - 2026-03-20 13:35 - `DOC - Structure Radio 2 As An Execution Spec`
<!-- ENTRY 074 -->
HUMAN SUMMARY: Reworked `Phase 2` in `Radio.md` from a loose bullet list into the same execution-spec format used by the shipped `Radio 1` section. The phase now has a dedicated `[4.1O2]` title, a `Header`, one explicit `Q1` decision about what `Off` should clear, and a concrete implementation spec for the canonical radio session-state seam.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md` only.
- Kept the change focused on Phase 2 structure and implementation-readiness.
- Recorded the document-only update in the permanent doc log.

#### Summary
- Renamed the local phase heading to `Phase 2 - [4.1O2] - Radio 2 - Canonical Session State And Defaults`.
- Added a structured `Header` block and acceptance shape.
- Added `Q1` for the `Off`-as-silence-gate versus destructive-reset decision and locked the recommendation.
- Added an `Implementation Spec` that defines:
  - the canonical owner in `audioSamplerStore.ts`
  - the first state shape and defaults
  - command ownership for `On`, `Off`, `Url`, `SampleBurstTime`, and `RandomizeSampleTimes`
  - transcript behavior
  - implementation order and hard rules

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`

#### Notes
- This change does not alter code or roadmap status; it only makes the next radio phase easier to execute directly.

<!-- ENTRY 073 -->
### [073] - 2026-03-20 13:29 - `DOC - Sync Radio 1 Titles With The Shipped Console Cut`
<!-- ENTRY 073 -->
HUMAN SUMMARY: Updated the radio architecture doc and the live roadmap so the first shipped radio cut no longer uses the too-narrow `Grammar And Scope` label. The docs now call `[4.1O1]` `Radio 1 - Root, Scope, And Guided Prompt Sessions`, mark that cut shipped in the roadmap, and keep the local `Radio.md` checklist titles aligned with the implemented console behavior.

#### Scope
- Updated `docs/Human-Plans/Architecture/Radio.md`.
- Updated `docs/Human-Plans/roadmap/roadmap.md`.
- Recorded the document-only sync in the permanent doc log.

#### Summary
- Renamed `Phase 1 / [4.1O1]` in `Radio.md` to `Radio 1 - Root, Scope, And Guided Prompt Sessions`.
- Marked the local `Phase 1` read complete and renamed the resolved `Q1` block so it reads as a locked decision instead of an open design question.
- Renamed the matching `[4.1O1]` roadmap item to the same title.
- Marked the parent `[4.1O]` roadmap family partial and `[4.1O1]` complete so the roadmap status matches the shipped console-radio first cut.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Notes
- This change only updates documentation labels/status reads; it does not change the shipped radio code or phase breakdown beyond naming/status alignment.

<!-- ENTRY 072 -->
### [072] - 2026-03-20 13:13 - `DOC - Make Radio 1 Implementation Ready`
<!-- ENTRY 072 -->
HUMAN SUMMARY: Expanded `Radio 1 - Grammar And Scope` in `Radio.md` into an implementation-ready phase spec by mapping it directly onto the current console code. The updated phase now names the concrete staged-navigation and console-store seams to extend, introduces one narrow prompt-session concept for `Url` and `SampleBurstTime`, and gives a direct first implementation order that can be carried into code without reopening the whole radio architecture.

#### Scope
- Updated the existing `docs/Human-Plans/Architecture/Radio.md` note only.
- Kept the change focused on making `[4.1O1] Radio 1` concrete enough to implement directly against the current console architecture.
- Recorded the document change in the permanent doc log.

#### Summary
- Added `Current Code-To-Target Mapping` for the current console files:
  - `stagedNavigation.ts`
  - `useConsoleStore.ts`
  - `ConsoleBar.tsx`
- Added a concrete prompt-session seam for the first radio prompt handoff behavior.
- Defined likely first data shapes for the new `radioRoot` staged scope, radio action ids, and prompt-session payload.
- Added explicit validation rules and a direct first implementation order aimed at the current codebase.
- Tightened the phase acceptance shape so `Radio 1` now reads as a true implementation-ready cut instead of only a product/UX note.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This update still keeps real radio state, sample-time mapping, and playback/runtime bridging in later `[4.1O2]` and `[4.1O3]` cuts.

<!-- ENTRY 071 -->
### [071] - 2026-03-20 13:11 - `DOC - Align Radio Phase 1 Heading With 4.1O1 Roadmap Id`
<!-- ENTRY 071 -->
HUMAN SUMMARY: Updated `Radio.md` so the first phase heading now includes its live roadmap id and label, making the architecture note read consistently with the new `[4.1O1]` roadmap entry. The local roadmap-mapping block now points at the same `Radio 1 - Grammar And Scope` wording instead of the older phase-only title.

#### Scope
- Updated the existing `docs/Human-Plans/Architecture/Radio.md` note only.
- Kept the change focused on naming alignment between the radio architecture doc and the live roadmap.
- Recorded the document change in the permanent doc log.

#### Summary
- Renamed the first radio phase heading to:
  - `Phase 1 - [4.1O1] - Radio 1 - Grammar And Scope`
- Updated the `Roadmap Mapping` block so the `[4.1O1]` mapping line now uses the same phase title.
- Kept the underlying phase content unchanged.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This update is naming-only and does not change the scope or acceptance shape of the phase.

<!-- ENTRY 070 -->
### [070] - 2026-03-20 13:06 - `DOC - Add Console Radio Mini-Family To Roadmap And Sync Radio Mapping`
<!-- ENTRY 070 -->
HUMAN SUMMARY: Added a new `[4.1O]` console-radio mini-family to the live roadmap so the first implementation path for `VR - Phase 4 - Radio Sampler Return` now has an explicit home under the console lane instead of requiring a new roadmap lane. Synced `Radio.md` with that structure by mapping the first implementation trio to `[4.1O1]`, `[4.1O2]`, and `[4.1O3]`.

#### Scope
- Updated the live roadmap to add the new console-radio mini-family under `[4.1]`.
- Updated `Radio.md` so its local phase ladder points at the same `[4.1O]` roadmap structure.
- Recorded the document change in the permanent doc log.

#### Summary
- Added `[4.1O]`, `[4.1O1]`, `[4.1O2]`, and `[4.1O3]` to the Lane `[4]` quick checklist and the detailed `[4.1]` body in `roadmap.md`.
- Kept the canonical product home for the feature as `VR - Phase 4 - Radio Sampler Return`, while making the first technical path explicitly console-first under the live console roadmap family.
- Added a `Roadmap Mapping` block to `Radio.md` so the architecture spec now clearly maps:
  - `Phase 1` -> `[4.1O1]`
  - `Phase 2 + Phase 3` -> `[4.1O2]`
  - `Phase 4 + Phase 5` -> `[4.1O3]`
- Left `Phase 6` in `Radio.md` as later hardening follow-through after the first roadmap trio.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This update changes planning structure only; it does not yet create a task doc or runtime implementation for the radio system.

<!-- ENTRY 069 -->
### [069] - 2026-03-20 13:01 - `DOC - Revise Radio Phase 1 Q1 To Use Normal Console Suggestion Flow`
<!-- ENTRY 069 -->
HUMAN SUMMARY: Revised `Phase 1` `Q1` in `Radio.md` so `Url` and `SampleBurstTime` now follow the normal console suggestion model instead of being described as special freeform prompt states. The updated spec now says each command should prefill a suggested answer, and if the user types something different, that new typed value replaces the autosuggested answer cleanly.

#### Scope
- Updated the existing `docs/Human-Plans/Architecture/Radio.md` note only.
- Kept the change focused on the `Phase 1` command/prompt behavior for `Url` and `SampleBurstTime`.
- Recorded the document change in the permanent doc log.

#### Summary
- Rewrote the `Q1` suggestion so `Url` and `SampleBurstTime` stay inside the normal console suggestion flow.
- Updated the `Implementation Spec` to replace the earlier special freeform-prompt framing with suggested-answer behavior.
- Locked the direction that each of those commands should prefill a current/default value and let normal typing override that suggestion.
- Updated the acceptance shape so the phase now explicitly expects autosuggest replacement when the user types a different value.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This update changes the interaction design only; it still does not add runtime playback or source-loading behavior.

<!-- ENTRY 068 -->
### [068] - 2026-03-20 12:57 - `DOC - Expand Radio Phase 1 Into Structured Mini Spec`
<!-- ENTRY 068 -->
HUMAN SUMMARY: Expanded `Phase 1 - Console Radio Grammar And Scope` in `Radio.md` into a fuller mini spec and aligned it with the new question-heading rule, so the phase now uses its own `### [ ] Q1` block and records the first concrete prompt-state behavior for `Url` and `SampleBurstTime`.

#### Scope
- Updated the existing `docs/Human-Plans/Architecture/Radio.md` note only.
- Kept the change focused on making `Phase 1` implementation-ready and matching the new question-section format.
- Recorded the document change in the permanent doc log.

#### Summary
- Added a dedicated `### [ ] Q1` section under `Phase 1`.
- Locked the direction that `Url` and `SampleBurstTime` should behave as temporary inline prompt states inside the normal console flow rather than deeper nested radio submenus.
- Expanded the `Implementation Spec` with the first root/radio scope shape, alias normalization rule, invalid-input behavior, and `Back` / `Esc` recovery behavior.
- Added suggested prompt-read examples and a recommended implementation order for the first console-radio grammar cut.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This update still does not decide runtime playback mechanics; it only makes the first console grammar phase concrete enough to implement directly.

<!-- ENTRY 067 -->
### [067] - 2026-03-20 12:54 - `DOC - Add Radio Phase Ladder And Open Decisions`
<!-- ENTRY 067 -->
HUMAN SUMMARY: Expanded `Radio.md` with a bottom `phases` section so the console-first radio idea now reads as a real execution ladder instead of only a concept note. The new section breaks the work into narrow cuts, adds acceptance shape per phase, and records the two main unresolved decisions around command-identity mapping and SoundCloud fallback behavior.

#### Scope
- Updated the existing `docs/Human-Plans/Architecture/Radio.md` note only.
- Kept the change focused on execution planning and remaining decision capture for the console-first radio idea.
- Recorded the document change in the permanent doc log.

#### Summary
- Added a bottom `# phases` section to `Radio.md`.
- Broke the console-first radio work into six narrow phases covering grammar/scope, session state/defaults, command-identity template mapping, console trigger wiring, runtime source bridging, and hardening.
- Added acceptance shape under each phase so the document now reads more like an implementation spec than a high-level wishlist note.
- Recorded the key remaining decisions around:
  - what exact semantic command identity should own stable sample-time mapping
  - what fallback playback bridge should be used if direct SoundCloud control is not practical in-browser

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This update still does not choose the final playback mechanism; it only makes the staged implementation order and decision points explicit.

<!-- ENTRY 066 -->
### [066] - 2026-03-20 12:52 - `DOC - Add Console-First Radio Command Template Direction`
<!-- ENTRY 066 -->
HUMAN SUMMARY: Expanded `Radio.md` with a concrete console-first implementation direction so the first radio cut now has a defined root command entry, radio command menu, default `Gusano` URL behavior, and a session-stable per-command sample-time template rule instead of staying only at the broader subsystem level.

#### Scope
- Updated the existing `docs/Human-Plans/Architecture/Radio.md` note only.
- Kept the change focused on the first console-driven implementation shape for radio behavior.
- Recorded the document change in the permanent doc log.

#### Summary
- Added a new `Console-First Implementation Direction` section to `Radio.md`.
- Locked the intended root command expansion from `[Graph]` to `[Graph, Radio]` with `G` / `R` aliases.
- Defined the first `Radio` scope commands as `On`, `Off`, `Url`, `SampleBurstTime`, and `RandomizeSampleTimes`, including the intended aliases and behavior.
- Recorded the default SoundCloud source as `https://soundcloud.com/keota-us/gusano`.
- Captured the first trigger rule that `Enter`, `ArrowUp`, and `ArrowDown` in the console should fire radio bursts when radio is enabled.
- Locked the key design direction that sample times should be assigned automatically per console command identity and remain stable throughout the session until re-randomized.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Notes
- This update records the console-command template direction only and does not yet decide the exact SoundCloud integration mechanism or fallback behavior if the external source is not ready.

<!-- ENTRY 065 -->
### [065] - 2026-03-20 12:42 - `DOC - Add Radio Architecture Planning Surface`
<!-- ENTRY 065 -->
HUMAN SUMMARY: Added a new `Radio.md` architecture doc so the old `radio sampler` idea now has an implementation-facing home under `docs/Human-Plans/Architecture/`. The new doc translates the older `Gusano` / `Keota Radio` wish-feature memory into concrete ownership, runtime, trigger, and first-scope rules, and the docs index now lists it as a canonical architecture surface.

#### Scope
- Added a new architecture doc for the modern `Radio` subsystem.
- Updated the docs index so the new architecture surface is discoverable in the architecture map.
- Recorded the change in the permanent doc log.

#### Summary
- Created `docs/Human-Plans/Architecture/Radio.md` as the implementation-facing architecture counterpart to the older `docs/Human-Plans/Wish-Features/10 - radio-Sampler.md` note.
- Defined the modern `Radio` as an optional app/runtime personality subsystem rather than a worker or build feature.
- Locked the first ownership split across shell placement, app/store state, runtime audio execution, and feature-owned trigger publishing.
- Recorded the stable-random cue-map rule, the narrow first-pass trigger allowlist direction, and the first honest implementation boundaries.
- Updated `docs/Doc-Index.md` so `Radio.md` appears in the live architecture-doc listing.

#### Files Changed
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

#### Notes
- This update defines architecture direction only and does not yet wire any runtime audio code or UI into `src/`.

<!-- ENTRY 064 -->
### [064] - 2026-03-20 12:24 - `DOC - Add User Controlled Worker Cost And Preview Direction`
<!-- ENTRY 064 -->
HUMAN SUMMARY: `Updated the worker architecture note to explicitly plan for user-controlled execution cost. The new direction says heavy geometry should not force one exact slow rebuild path for every edit, and records the likely need for preview versus final modes, per-part detail controls, execution toggles, and a possible fast Three.js preview path alongside slower exact worker builds.` 

#### Scope
- Updated the existing `Worker.md` architecture note only.
- Kept the change focused on worker architecture direction and execution-policy planning, not runtime code.
- Recorded the document change in the canonical permanent doc log.

#### Summary
- Added a new local `Doc History` line in `docs/Human-Plans/Architecture/Worker.md`.
- Expanded the short version and target worker contract to say the user should eventually control worker cost explicitly.
- Added recommended control families covering:
- `preview` versus `final` style execution intent
- per-part detail level
- render/update toggles for expensive work
- Added the possible direction that heavy exact geometry may stay worker-side while fast interactive preview could use simplified runtime geometry or a viewer-side Three.js preview surface.
- Expanded cleanup goals, open questions, and `Phase 3` / `Phase 5` / `Phase 6` so preview-versus-final semantics become part of the worker roadmap instead of staying an implicit performance concern.

#### Files Changed
- `docs/Human-Plans/Architecture/Worker.md`
- `docs/Doc-Log.md`

#### Notes
- This update records the architectural direction only; it does not yet choose whether the first fast-preview path should live primarily in the worker, in the viewer, or in a hybrid preview/final split.

<!-- ENTRY 063 -->
### [063] - 2026-03-20 12:13 - `DOC - Add Parent Versus Child Rebuild Ownership Rule To Worker Architecture`
<!-- ENTRY 063 -->
HUMAN SUMMARY: `Updated the worker architecture note to make rebuild ownership explicit: rebuilding a child must not automatically mean the parent component or assembly rebuilt. The new wording clarifies that parent rows may aggregate child dirtiness or rebuild activity without implying a real parent-owned rebuild, and ties that rule into the worker planning phases.` 

#### Scope
- Updated the existing `Worker.md` architecture note only.
- Kept the change focused on rebuild semantics and planning clarity, not runtime code.
- Recorded the document change in the canonical permanent doc log.

#### Summary
- Added a new local `Doc History` line in `docs/Human-Plans/Architecture/Worker.md`.
- Added an explicit rebuild-ownership rule under the worker ownership split.
- Added a new current-problem subsection explaining that rebuild ownership is still too blurry in the present architecture.
- Expanded cleanup goals and the phase roadmap so `Phase 3`, `Phase 5`, and `Phase 6` now directly cover:
- child rebuilds not implying parent rebuilds
- preserving unaffected siblings and parent structure
- distinguishing aggregate parent status from true parent rebuild results

#### Files Changed
- `docs/Human-Plans/Architecture/Worker.md`
- `docs/Doc-Log.md`

#### Notes
- This update locks the architectural rule, but the live worker/runtime and browser semantics still need follow-through implementation before the behavior fully matches the new wording.

<!-- ENTRY 062 -->
### [062] - 2026-03-20 10:12 - `DOC - Add Worker Cleanup Phases Roadmap`
<!-- ENTRY 062 -->
HUMAN SUMMARY: `Updated the worker architecture note with a dedicated phases roadmap so the current hybrid worker can be planned as explicit cleanup and migration slices instead of staying only as high-level direction. The new section breaks the worker follow-through into contract, lanes, dispatcher, runtime, result-semantics, and cutover phases.` 

#### Scope
- Updated the existing `Worker.md` architecture note only.
- Kept the change focused on planning structure and execution sequencing, not runtime code.
- Recorded the document change in the canonical permanent doc log.

#### Summary
- Added a new local `Doc History` line in `docs/Human-Plans/Architecture/Worker.md`.
- Added a dedicated `phases` section to the worker architecture doc.
- Broke the worker cleanup into explicit checkbox phases covering:
- current-state audit
- graph-native request contract
- lane definition
- dispatcher thinning
- legacy-versus-target runtime separation
- result semantics
- final contract cutover

#### Files Changed
- `docs/Human-Plans/Architecture/Worker.md`
- `docs/Doc-Log.md`

#### Notes
- The new phased roadmap is planning guidance only; it does not yet resolve the open design questions around the final graph-native request shape or the permanent worker lane set.

<!-- ENTRY 061 -->
### [061] - 2026-03-19 23:48 - `DOC - Update vi2 Console Spec From Left Right To Up Down Cycling`
<!-- ENTRY 061 -->
HUMAN SUMMARY: `Updated the active `vi2` console architecture guidance so staged choice assist now uses `ArrowUp` and `ArrowDown` instead of `Left` and `Right`. The revised spec keeps normal caret movement intact while matching the shipped keyboard-routing fix that allows staged sibling cycling to work even before the input is focused.` 

#### Scope
- Updated the existing `Console.md` architecture note only.
- Kept the change focused on active staged-console input guidance and implementation-spec accuracy, not runtime code.
- Recorded the document change in the canonical permanent doc log.

#### Summary
- Added a new local `Doc History` line in `docs/Human-Plans/Architecture/Console.md`.
- Updated the active staged-choice assist wording from `Left Arrow` / `Right Arrow` to `ArrowUp` / `ArrowDown`.
- Synced the planned refinement note, the `vi2` vision section, and the `### Implementation Spec` acceptance/steps language to the new key choice.
- Preserved the earlier history entries instead of rewriting them, while making the active architecture text match the shipped behavior.

#### Files Changed
- `docs/Human-Plans/Architecture/Console.md`
- `docs/Doc-Log.md`

#### Notes
- The active console spec now better reflects the intended typing model because `ArrowUp` / `ArrowDown` can act as staged-choice cycling keys without stealing normal left/right caret movement inside the input field.

<!-- ENTRY 060 -->
### [060] - 2026-03-19 23:34 - `DOC - Make vi2 Staged Choice Prefill And Arrow Cycling Implementation Ready`
<!-- ENTRY 060 -->
HUMAN SUMMARY: `Expanded the new console `vi2` staged-choice prefill and arrow-cycling note into an implementation-ready spec. The console architecture doc now locks the first-pass prefill, highlighted-choice summary strip, left/right cycling, manual-typing override behavior, and acceptance shape as one narrow staged-navigation refinement task.` 

#### Scope
- Updated the existing `Console.md` architecture note only.
- Kept the change focused on implementation-ready staged-console UX behavior and task scoping, not runtime code.
- Recorded the document change in the canonical permanent doc log.

#### Summary
- Added a new local `Doc History` line in `docs/Human-Plans/Architecture/Console.md`.
- Expanded `## [ ]Vision Idea `vi2` - Staged Choice Prefill And Arrow Cycling` with a real `### Implementation Spec` block.
- Locked the first-pass behavior around:
  - input prefill from the first valid staged choice
  - bottom-left summary highlighting of the targeted choice
  - `Left Arrow` / `Right Arrow` sibling cycling
  - `Enter` / command-scoped `Space` submission of the targeted choice
  - manual typing as an explicit override
- Added scope boundaries, likely state shape, implementation steps, hard rules, and acceptance criteria.

#### Files Changed
- `docs/Human-Plans/Architecture/Console.md`
- `docs/Doc-Log.md`

#### Notes
- The updated `vi2` section now reads as a single implementation task spec and stays aligned with the earlier rule that staged-choice assist should improve navigation speed and visibility without replacing the underlying typed staged-command model.

<!-- ENTRY 059 -->
### [059] - 2026-03-19 23:26 - `DOC - Add Staged Choice Prefill And Arrow Cycling Vision To Console Architecture`
<!-- ENTRY 059 -->
HUMAN SUMMARY: `Updated the console architecture doc with a new vision note for staged-choice prefill and left/right cycling. The new section records the direction that staged command scopes should prefill the first valid choice into the input row, highlight the current choice in the single-row summary area, and let arrow keys cycle sibling options while preserving free typing.`

#### Scope
- Updated the existing `Console.md` architecture note only.
- Kept the change focused on future staged-console UX direction and suggestion-level guidance, not runtime code.
- Recorded the document change in the canonical permanent doc log.

#### Summary
- Added a new local `Doc History` line in `docs/Human-Plans/Architecture/Console.md`.
- Added a new `## Vision Idea - Staged Choice Prefill And Arrow Cycling` section at the bottom of the console architecture doc.
- Described the suggested behavior for:
  - input prefill with the first valid staged choice
  - bottom-left summary highlighting of the current staged choice
  - `Left Arrow` / `Right Arrow` cycling across sibling choices
  - `Enter` / command-scoped `Space` submission of the targeted choice
- Kept explicit boundaries so the idea remains a staged-navigation refinement rather than a replacement for freeform command entry.

#### Files Changed
- `docs/Human-Plans/Architecture/Console.md`
- `docs/Doc-Log.md`

#### Notes
- The new note stays aligned with the earlier console direction that staged-choice assist should improve visibility and speed without becoming the underlying reason the command model works.

<!-- ENTRY 058 -->
### [058] - 2026-03-19 23:12 - `DOC - Make Command Transcript Sublayers Vision Implementation Ready`
<!-- ENTRY 058 -->
HUMAN SUMMARY: `Expanded the new console `Command Transcript Sublayers` idea into an implementation-ready spec. The console architecture doc now locks the first-pass `Commands.User` versus `Commands.System` model, the narrow ownership and filtering rules, and the acceptance shape for landing that change as one transcript refinement task instead of a broader console redesign.`

#### Scope
- Updated the existing `Console.md` architecture note only.
- Kept the change focused on implementation-ready console transcript semantics and task scoping, not runtime code.
- Recorded the document change in the canonical permanent doc log.

#### Summary
- Added a new local `Doc History` line in `docs/Human-Plans/Architecture/Console.md`.
- Expanded the new `### Implementation spec` section under `## Vision Idea - Command Transcript Sublayers`.
- Locked the first implementation cut around one `Commands` family with two subtypes:
  - `Commands.User`
  - `Commands.System`
- Added scope boundaries, ownership guidance, likely data-shape guidance, implementation steps, hard rules, and acceptance criteria.

#### Files Changed
- `docs/Human-Plans/Architecture/Console.md`
- `docs/Doc-Log.md`

#### Notes
- The updated section now reads like a single implementation task specification rather than only a loose future UX note, while still keeping the change narrow and separate from broader transcript-history redesign work.

<!-- ENTRY 057 -->
### [057] - 2026-03-19 23:08 - `DOC - Add Commands User/System Transcript Vision To Console Architecture`
<!-- ENTRY 057 -->
HUMAN SUMMARY: `Updated the console architecture doc with a new bottom-of-file vision idea for splitting the existing `Commands` transcript layer into `Commands.User` and `Commands.System`. The note keeps that refinement inside the same layered transcript model so typed input and returned prompts/results become easier to scan without inventing a separate logging product.`

#### Scope
- Updated the existing `Console.md` architecture note only.
- Kept the change focused on console transcript semantics and future UX clarity, not runtime code.
- Recorded the document change in the canonical permanent doc log.

#### Summary
- Added a new local `Doc History` line in `docs/Human-Plans/Architecture/Console.md`.
- Added a new `## Vision Idea - Command Transcript Sublayers` section at the bottom of the console architecture doc.
- Defined the proposed `Commands.User` and `Commands.System` split as a refinement inside the existing `Commands` family.
- Added purpose, boundaries, and short transcript examples showing typed input separated from returned prompts/results.

#### Files Changed
- `docs/Human-Plans/Architecture/Console.md`
- `docs/Doc-Log.md`

#### Notes
- The new idea stays consistent with the current one-transcript layered-console direction by making command back-and-forth easier to read without turning command input and command output into detached console products.

<!-- ENTRY 056 -->
### [056] - 2026-03-19 13:41 - `DOC - Add Sketch Plane Section Map To Sketch Architecture Doc`
<!-- ENTRY 056 -->
HUMAN SUMMARY: `Updated the sketch architecture note so the new bottom-of-file section map now breaks `Sketch plane` into the real current toolbar parts instead of leaving it blank. The same pass also cleaned the adjacent `Sketch Draw` placeholder labels so the two maps read consistently.`

#### Scope
- Updated the existing `Sketch.md` architecture note only.
- Kept the change focused on document structure and planning readability, not runtime code.
- Recorded the doc change in the canonical permanent doc log.

#### Summary
- Added a new bottom-of-file heading map for `Sketch plane`.
- Broke the sketch-plane placeholder into:
  - `Title Bar`
  - `I Menu`
  - `Toolbar Window`
  - `Sketch Plane UI`
  - `Plane Selection`
  - `Transform`
  - `Move`
  - `Rotate`
- Cleaned the adjacent `Sketch Draw` placeholder headings to `Title Bar` and `Section`.
- Added the corresponding local `Doc History` entry inside `Sketch.md`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- The new sketch-plane map matches the current overlay surface more closely than the prior blank placeholder, so later detail work can hang off the real section names already used by the toolbar.

<!-- ENTRY 055 -->
### [055] - 2026-03-19 00:07 - `DOC - Update Toolbar Template Doc With New Shared Features`
<!-- ENTRY 055 -->
HUMAN SUMMARY: `Updated the shared toolbar architecture doc so it reflects the newer template features already proven by the sketch-plane toolbar. The note now covers title-bar density modes, accent-tinted body scrollbars, and the reusable horizontal subsection split bar.` 

#### Scope
- Updated the shared toolbar architecture doc only.
- Kept the change focused on documenting new template capabilities, not changing runtime code.
- Used the existing `Toolbar.md` note as the canonical template doc instead of creating a duplicate `Template.md`.

#### Summary
- Added the newer shared toolbar-template features to `docs/Human-Plans/Architecture/Toolbar.md`.
- Documented:
  - `collapsed / essentials / expanded` density modes
  - the shared `-/e/+` title-bar density-cycle pattern
  - accent-tinted body scrollbar expectations
  - the reusable horizontal subsection split bar
- Updated the ownership and guardrail sections so these behaviors are treated as shared shell features rather than sketch-only behavior.

#### Files Changed
- `docs/Human-Plans/Architecture/Toolbar.md`
- `docs/Doc-Log.md`

#### Notes
- `Toolbar.md` is currently the canonical shared template note under `docs/Human-Plans/Architecture/`; there is no separate `Template.md` file there right now.

<!-- ENTRY 054 -->
### [054] - 2026-03-18 23:58 - `DOC - Add Toolbar Architecture Doc`
<!-- ENTRY 054 -->
HUMAN SUMMARY: `Added a new architecture doc for the reusable viewport toolbar template so the shared shell contract is documented outside the sketch doc. The new note locks the key template details: draggable title bar, title-bar close action, all-edge and all-corner resize, sectioned body layout, and object-type-based color theming.` 

#### Scope
- Added one new architecture doc under `docs/Human-Plans/Architecture/`.
- Kept the change focused on documenting the shared toolbar template rather than changing runtime code.
- Captured the color-theme rule explicitly so future viewport toolbars inherit object-type-driven chrome.

#### Summary
- Created `docs/Human-Plans/Architecture/Toolbar.md`.
- Documented the reusable viewport toolbar shell as a floating-window template.
- Recorded the important shared requirements:
  - draggable title bar
  - title-bar close action
  - all-edge resize
  - all-corner resize
  - sectioned body layout
  - object-type-based color theme
- Clarified the ownership split between shared shell chrome and tool-specific body content.

#### Files Changed
- `docs/Human-Plans/Architecture/Toolbar.md`
- `docs/Doc-Log.md`

#### Notes
- The first concrete consumer remains the sketch-plane toolbar, but the new doc is intentionally generic so future viewport tools can reuse the same template honestly.

<!-- ENTRY 053 -->
### [053] - 2026-03-18 22:49 - `DOC - Split Sketch Cleanup Part 2 Into 2A And 2B`
<!-- ENTRY 053 -->
HUMAN SUMMARY: `Split the sketch architecture doc’s single `3.2B-2-Cleanup Part 2` implementation-ready spec into two smaller implementation-ready subphases so real Three ghost-plane ownership lands first in `2A`, and reused `TransformGizmo` attachment plus live draft transform lands second in `2B`.` 

#### Scope
- Updated the sketch node architecture doc only.
- Kept the change focused on breaking one larger cleanup phase into two smaller implementation-ready phases.
- Did not change runtime code.

#### Summary
- Replaced the single `3.2B-2-Cleanup Part 2` implementation-ready spec with:
  - `3.2B-2-Cleanup Part 2A - Real Three Ghost Planes And Preview Pivot`
  - `3.2B-2-Cleanup Part 2B - Reused TransformGizmo Attachment And Live Draft Transform`
- Kept `2A` focused on viewer ownership, Three ghost planes, preview pivot, grid/helper, and raycast plane picking.
- Kept `2B` focused on attaching the existing viewer `TransformGizmo` to the preview pivot and mapping live draft move/rotate back into sketch-plane draft state.
- Recorded the sequencing/default assumption that `2A` should ship before `2B`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- Both new subphases remain origin-plane only and keep geometry-derived picking deferred to `3.2B-3`.

<!-- ENTRY 052 -->
### [052] - 2026-03-18 22:44 - `DOC - Make Sketch Cleanup Part 2 Implementation-Ready`
<!-- ENTRY 052 -->
HUMAN SUMMARY: `Updated the sketch architecture doc so `3.2B-2-Cleanup Part 2` is now implementation-ready, locking the reuse of the existing viewer `TransformGizmo`, the addition of three real Three-rendered ghost origin planes, and the ownership split between `ViewportOverlay`, `sketchPlanePickSession`, and a new viewer-side sketch-plane helper module.` 

#### Scope
- Updated the sketch node architecture doc only.
- Turned the previous open-question checklist into a locked implementation-ready spec.
- Did not change runtime code.

#### Summary
- Replaced the open `Cleanup Part 2` question list with locked defaults.
- Recorded the decision to reuse the existing viewer `TransformGizmo` for sketch-plane `move + rotate`.
- Recorded the decision to add three real Three-rendered ghost planes around a temporary sketch-plane preview pivot.
- Added an implementation-ready spec covering:
  - viewer ownership
  - temporary preview pivot/helper lifecycle
  - raycasting against ghost planes
  - live draft mapping
  - overlay-vs-viewer responsibilities
  - visual defaults
  - test targets

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This section is now ready to drive the next implementation pass directly.

<!-- ENTRY 051 -->
### [051] - 2026-03-18 22:37 - `DOC - Add Sketch Cleanup Part 2 Three-Render Decision Checklist`
<!-- ENTRY 051 -->
HUMAN SUMMARY: `Added a new `3.2B-2-Cleanup Part 2` section to the sketch architecture doc so the next cleanup pass has a structured decision checklist for replacing the DOM/CSS ghost planes and origin cues with real Three-rendered viewer content.` 

#### Scope
- Updated the sketch node architecture doc only.
- Focused on planning the next cleanup pass after the first main-viewport integration.
- Did not change runtime code or lock final implementation answers yet.

#### Summary
- Added a dedicated `3.2B-2-Cleanup Part 2` section under the sketch architecture doc.
- Captured the intended target of moving the origin gizmo, axis cues, and ghost origin planes into real viewer-owned Three rendering.
- Added checklist-style open questions with suggestions for:
  - viewer ownership
  - Three meshes/helpers
  - raycasting
  - draft-state mapping
  - active-plane highlighting
  - temporary lifecycle
  - test expectations
  - a possible dedicated sketch-plane viewer helper module

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This keeps the next cleanup pass decision-focused before implementation starts.

<!-- ENTRY 050 -->
### [050] - 2026-03-18 22:19 - `DOC - Refine Sketch 3.2B-2 Cleanup Visual Targets`
<!-- ENTRY 050 -->
HUMAN SUMMARY: `Refined the sketch `3.2B-2-Cleanup` phase so it now explicitly owns restoring the compact sketch-plane toolbar style and moving the source-pick interaction into the real main model viewport with a central origin gizmo and three clickable ghost origin planes.` 

#### Scope
- Updated the sketch node architecture doc only.
- Tightened the cleanup-phase product targets rather than changing runtime code.
- Kept the change local to `3.2B-2-Cleanup`.

#### Summary
- Added the requirement that cleanup should return the sketch-plane session toolbar to the earlier compact title-bar style keyed off the sketch-plane pin color.
- Added the intended main-viewport interaction composition:
  - origin gizmo at the world origin
  - three ghost origin planes/boxes
  - direct click targets on those planes
  - compact side controls instead of a faux embedded viewport panel
- Updated the cleanup findings and acceptance targets to match that intended layout.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This keeps the cleanup phase focused on making the first `3.2B-2` viewport-pick cut read honestly in the main viewer before broader geometry-pick or transform-tool follow-on work.

<!-- ENTRY 049 -->
### [049] - 2026-03-18 22:14 - `DOC - Add Sketch 3.2B-2 Cleanup Phase Definition`
<!-- ENTRY 049 -->
HUMAN SUMMARY: `Added a real `3.2B-2-Cleanup` phase section to the sketch architecture doc so the post-implementation cleanup work for the first viewport-first sketch-plane pick cut is now captured explicitly instead of living as ad hoc follow-up.` 

#### Scope
- Updated the sketch node architecture doc only.
- Focused on replacing the placeholder `3.2B-2-Cleanup` phase with a concrete cleanup definition.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Replaced the placeholder `3.2B-2-Cleanup` heading with a real titled cleanup phase.
- Documented what that cleanup phase owns after the first viewport-first source-pick implementation lands.
- Captured the current cleanup findings around:
  - faux mini-viewport feel
  - main model viewport ownership
  - draft-versus-committed cleanup
  - temporary console/dev seams
- Added a recommended acceptance target so this cleanup phase can later become implementation-ready without rediscovering the same issues.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This phase intentionally stays inside `3.2B-2` follow-through.
- It does not pull `3.2B-3` geometry-driven picking or later generic transform-tool work forward.

<!-- ENTRY 048 -->
### [048] - 2026-03-18 21:54 - `DOC - Make Sketch 3.2B-2 Section Implementation-Ready`
<!-- ENTRY 048 -->
HUMAN SUMMARY: `Revised the `3.2B-2` phase section in the sketch node architecture doc so it now contains its own implementation-ready spec, including the locked viewport-first source-pick flow, implementation seams, acceptance checks, and out-of-scope boundaries, and promoted the remaining `3.2B-2` default suggestions into explicit decisions so the phase reads as decision-complete in one place.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `3.2B-2` phase section and its matching decision checklist.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added an implementation-ready spec directly under the `3.2B-2` phase heading.
- Locked the remaining `3.2B-2` defaults covering origin-only scope, world-space-only first gizmo behavior, preview boundaries, row/live-session behavior, deferred face picking, and extension of the existing `sketchPlanePickSession` seam.
- Reframed the `3.2b-2` decision block as a decision-complete checklist rather than an open-question surface.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is a docs-only planning/spec update intended to make the next implementation command straightforward.

<!-- ENTRY 047 -->
### [047] - 2026-03-18 21:47 - `DOC - Lock Sketch 3.2B-2 Live Gizmo Session And First Gizmo Scope`
<!-- ENTRY 047 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc to answer `3.2B-2` decisions `6` and `7`, locking the first viewport-first source-pick cut to one continuous live placement session and keeping the first gizmo toolset to `move + rotate` while leaving `Flip` outside the gizmo for now.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to two `3.2B-2` product decisions about same-session gizmo behavior and first gizmo control scope.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Marked `3.2B-2` checklist items `6` and `7` as decided.
- Recorded that origin-plane pick should immediately open the sketch-origin gizmo in the same live placement session and stay active until `Done` or `Enter`.
- Clarified that the first viewport gizmo should support `move + rotate`, while `Flip` remains in the row/control surface until a later phase.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and does not yet implement the viewport gizmo session.

<!-- ENTRY 046 -->
### [046] - 2026-03-18 21:42 - `DOC - Restore Numeric Order In Sketch 3.2B-2 Decisions`
<!-- ENTRY 046 -->
HUMAN SUMMARY: `Reordered the `3.2B-2` viewport-pick decision questions in the sketch node architecture doc so the later-added picker replacement questions no longer interrupt the numeric flow and the checklist now reads cleanly from `1` through `15`.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to question ordering/readability inside the `3.2B-2` decision block.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Moved `3.2B-2` questions `14` and `15` down below question `13`.
- Preserved the decision content for `14` and the open suggestion for `15`.
- Restored a strictly increasing numeric order for the full decision checklist.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is a readability/maintenance cleanup only.

<!-- ENTRY 045 -->
### [045] - 2026-03-18 21:41 - `DOC - Lock Sketch 3.2B-2 Picker Replacement Direction`
<!-- ENTRY 045 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc to answer `3.2B-2` decision `14`, locking the direction that the current sketch-plane picker should be expanded into the newer viewport-first source-pick tool and should replace the old overlay picker instead of living beside it as a second long-term workflow.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on one `3.2B-2` product decision about picker replacement versus parallel picker systems.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Marked `3.2B-2` checklist item `14` as decided.
- Recorded that the existing sketch-plane picker should be expanded into the newer viewport-first source-pick tool.
- Clarified that the newer viewport-first path should become the canonical replacement workflow rather than leaving two equal long-term picker systems alive.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and still allows a short transitional overlap during implementation if needed.

<!-- ENTRY 044 -->
### [044] - 2026-03-18 21:39 - `DOC - Update Sketch Viewport-Pick Plan With Current Code Reality`
<!-- ENTRY 044 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc with current code findings so the viewport-first source-pick plan now explicitly reflects the repo's existing collapsed-window shell, distinguishes it from panel header collapse, and records that the current `Pick In Viewport` flow is still an older overlay-based `XY / XZ / YZ` picker that `3.2B-2` should replace.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Refined the `3.2B-2` planning surface with current implementation truth from the app shell, panel, and viewport overlay code.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added a `Current code reality` block to the sketch viewport-pick section.
- Clarified that the existing compact source-pick surface should reuse the real window-level `Spaghetti Editor` `collapsed mode`, not the separate panel header-collapse behavior.
- Added two new `3.2B-2` planning questions covering replacement of the legacy overlay picker and whether to extend the current `sketchPlanePickSession` seam versus introducing a richer dedicated session model.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and reflects code research rather than shipped implementation.

<!-- ENTRY 043 -->
### [043] - 2026-03-18 21:35 - `DOC - Lock Sketch 3.2B-2 Collapsed-Mode Bar Decision`
<!-- ENTRY 043 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc to answer `3.2B-2` decision `3`, locking the viewport-pick compact surface to the existing preset `Spaghetti Editor` `collapsed mode` so source picking hides the editor body and reuses the top bar instead of introducing a separate mini-shell concept.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to one answered `3.2B-2` decision about the compact source-pick surface.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Marked `3.2B-2` checklist item `3` as decided.
- Recorded that entering viewport-first source pick should force the `Spaghetti Editor` into its preset `collapsed mode`.
- Clarified that this mode hides the editor body and reuses the remaining top bar as the visible shell during active pick.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and does not yet implement the collapsed-mode transition.

<!-- ENTRY 042 -->
### [042] - 2026-03-18 21:33 - `DOC - Normalize Sketch 3.2B-2 Questions Into Collapsible Question Blocks`
<!-- ENTRY 042 -->
HUMAN SUMMARY: `Reformatted the `3.2B-2` viewport-pick decision area in the sketch node architecture doc so each question now has its own collapsible `####` block with nested `##### Decision` and `##### Suggestion` sections, making the planning surface easier to collapse and use question-by-question.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the formatting and readability of the `3.2B-2` decision surface.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Converted the remaining `3.2B-2` questions into consistent collapsible question blocks.
- Added a `##### Suggestion` subsection under each question.
- Cleaned up the already-answered first two questions so they match the same structure as the unanswered ones.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning/doc-structure cleanup only and does not itself answer the remaining open `3.2B-2` questions.

<!-- ENTRY 041 -->
### [041] - 2026-03-18 21:28 - `DOC - Refocus Vision Roadmap Into A True North-Star Document`
<!-- ENTRY 041 -->
HUMAN SUMMARY: `Performed a large cleanup pass on the vision roadmap so it now reads more like a true north-star document and less like a second execution roadmap, keeping the product destination, guardrails, and major feature families while removing most of the lane-and-phase-style execution residue.` 

#### Scope
- Updated the high-level vision roadmap under `docs/Human-Plans/roadmap/`.
- Reworked the internal structure substantially while preserving the main ParaHook product and architecture direction.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Replaced the older detailed lane/phase-heavy middle of `Vision-roadmap.md` with cleaner sections for:
  - `Core System Shape`
  - `What Must Stay True`
  - `Desired End State`
  - `Major Future Feature Families`
  - `High-Level Growth Path`
- Kept the higher-level `North Star`, `Product Vision`, `First-Pass Guardrails`, `Decision Filter`, and closing decision-check surfaces.
- Preserved important long-range directions including graph-native ownership, explicit output handoff, browser/content separation, the app-wide console command-language idea, and the Replicad-aligned node-language direction.

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This was an architecture/documentation refocus pass only and does not change the execution roadmap or create new implementation phases by itself.

<!-- ENTRY 040 -->
### [040] - 2026-03-18 21:22 - `DOC - Add Console Command-Language Vision To Vision Roadmap`
<!-- ENTRY 040 -->
HUMAN SUMMARY: `Cleaned up the vision roadmap slightly by adding the long-term app-wide `Console` command-language direction to the higher-level `Product Vision` and `User Experience Shape` sections, so the north-star doc now reflects that future workspace grammar instead of leaving it only in the detailed console architecture file.` 

#### Scope
- Updated the high-level vision roadmap under `docs/Human-Plans/roadmap/`.
- Kept the cleanup intentionally small and limited to the long-term console/workspace-command direction.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added one `Product Vision` bullet describing the future app-wide `Console` as a command language across workspace, graph, node, and feature domains.
- Added one `User Experience Shape` bullet clarifying that console command flows should become part of the same workspace grammar rather than spawning per-feature mini command systems.
- Added the matching local doc-history entry.

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This is vision/architecture alignment only and does not create a new execution phase by itself.

<!-- ENTRY 039 -->
### [039] - 2026-03-18 21:20 - `DOC - Add Long-Term Console Command-Language Sentence To Roadmap`
<!-- ENTRY 039 -->
HUMAN SUMMARY: `Updated the live roadmap so Lane `[4]` now explicitly acknowledges the long-term console direction as an app-wide command language that can navigate and act across workspace, graph, node, and feature domains, while leaving the fuller detail in the dedicated console architecture doc.` 

#### Scope
- Updated the live roadmap under `docs/Human-Plans/roadmap/`.
- Limited the change to one roadmap-level sentence plus local roadmap doc history.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added one long-term console-command-language sentence to the Lane `[4]` summary in `roadmap.md`.
- Kept the roadmap change short and high level.
- Left the detailed command-language structure in `docs/Human-Plans/Architecture/Console.md`.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This is roadmap/architecture alignment only and does not create a new execution phase by itself.

<!-- ENTRY 038 -->
### [038] - 2026-03-18 21:19 - `DOC - Add Long-Term Graph And Node Command-Language Vision To Console Architecture`
<!-- ENTRY 038 -->
HUMAN SUMMARY: `Expanded the app-wide console architecture doc with a larger long-term command-language vision, recording that the console should eventually be able to navigate graph and node domains entirely through typed command sequences and that future sketch-console actions should plug into that same command system instead of becoming a separate sketch-only console design.` 

#### Scope
- Updated the app-wide console architecture doc under `docs/Human-Plans/Architecture/`.
- Focused the change on the console's long-term command-language direction.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added a new long-term command-language section to `Console.md`.
- Recorded the future direction that the console should support hierarchical command navigation across app, workspace, graph, node, and later sketch-specific domains.
- Added example command-path language for selecting graphs, entering node scope, and finding or adding sketch nodes.
- Clarified that sketch-plane console actions should eventually plug into the app-wide console grammar rather than creating a separate sketch-only command system.

#### Files Changed
- `docs/Human-Plans/Architecture/Console.md`
- `docs/Doc-Log.md`

#### Notes
- This is architecture/planning work only and does not change the first-pass console implementation boundary.

<!-- ENTRY 037 -->
### [037] - 2026-03-18 21:11 - `DOC - Add Sketch Console Integration Architecture Section`
<!-- ENTRY 037 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc with a dedicated `Console integration` section so the project now has one stable place to define how early `SketchPlane` viewport-pick work should expose session tracing, status inspection, and temporary developer-side console commands without confusing that debugging seam with the permanent user-facing UI.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the early viewport-pick/debugging workflow around `SketchPlane`.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added a dedicated `Console integration` section to the sketch architecture doc.
- Defined console integration as a development/debugging seam rather than the final primary interface.
- Recorded three desired console roles: session tracing, status inspection, and temporary command hooks.
- Captured currently planned/accepted command examples like `Enter` for confirm and `x` for cancel, plus future candidates like `status` and `help`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This section is intended to support the early `3.2B-2` viewport-pick buildout before every session action has a polished permanent UI surface.

<!-- ENTRY 036 -->
### [036] - 2026-03-18 21:10 - `DOC - Lock Sketch 3.2B-2 Exit Model Decision`
<!-- ENTRY 036 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc to answer `3.2B-2` decision `2`, locking the viewport-pick exit model so the active sketch-plane source session can be exited by the `X` action in the sketch-plane surface, by `Esc`, and by typing `x` in the console during development.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to one answered `3.2B-2` decision and its exit-model notes.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Marked `3.2B-2` checklist item `2` as decided.
- Recorded that the active viewport-pick session should exit from the `X` action in the sketch-plane surface.
- Recorded `Esc` as the keyboard exit action and `x` in the console as a development/debugging exit path.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and does not yet implement the exit behavior.

<!-- ENTRY 035 -->
### [035] - 2026-03-18 21:08 - `DOC - Lock Sketch 3.2B-2 Confirm-On-Accept Decision`
<!-- ENTRY 035 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc to answer `3.2B-2` decision `1`, locking the viewport-first pick session to stay live until the user explicitly confirms, adding the direction for a confirm action plus `Enter` shortcut, and recording that session steps/actions should be written to the console during development.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to one answered `3.2B-2` decision and its associated implementation notes.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Marked `3.2B-2` checklist item `1` as decided.
- Recorded that viewport-pick should wait for explicit user confirmation instead of auto-committing on first valid click.
- Added the recommendation for a confirm action in the `SketchPlane` surface, an `Enter` shortcut, and console/session tracing while the workflow is still being built.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and does not yet implement the confirm flow or console tracing.

<!-- ENTRY 034 -->
### [034] - 2026-03-18 21:24 - `DOC - Number Sketch 3.2B-2 Decision Checklist Items`
<!-- ENTRY 034 -->
HUMAN SUMMARY: `Added explicit numbering to the open `3.2B-2` viewport-pick checklist items in the sketch node architecture doc so each remaining decision can be referenced directly during planning discussion and later implementation follow-through.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to numbering the existing `3.2B-2` checklist items.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added explicit numbers `1` through `13` to the `3.2B-2` open decision checklist.
- Kept the existing option lists and decision wording intact.
- Made the section easier to reference in follow-up planning conversations.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation-formatting work only and does not change the underlying phase scope.

<!-- ENTRY 033 -->
### [033] - 2026-03-18 21:22 - `DOC - Convert Sketch 3.2B-2 Open Questions Into A Checklist`
<!-- ENTRY 033 -->
HUMAN SUMMARY: `Reformatted the open `3.2B-2` viewport-pick product questions in the sketch node architecture doc into a checklist so the remaining decisions for that phase can be answered and tracked directly in place as the planning converges.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to formatting the open `3.2B-2` decision list into checklist form.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Converted the `3.2b-2` open questions into checkbox items.
- Kept the option lists underneath the affected decisions so the current design space remains visible.
- Made the section easier to use as a live planning/decision checklist.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation-formatting work only and does not change the underlying sketch-phase direction.

<!-- ENTRY 032 -->
### [032] - 2026-03-18 21:19 - `DOC - Add Sketch 3.2B-2 Implementation Questions To Decisions Section`
<!-- ENTRY 032 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc with a new `Decisions` section for `3.2B-1` through `3.2B-3`, marking `3.2B-1` as effectively settled and capturing the remaining product questions that still need answers before `3.2B-2` can be treated as implementation-ready.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on execution-readiness and open questions for the next sketch viewport-pick phase.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added concrete blocking questions under `3.2b-2` covering viewport-pick commit model, exit behavior, compact-bar controls, valid geometry types, gizmo scope, preview requirements, and whether model-face picking belongs in the first cut.
- Clarified that `3.2b-1` is effectively complete for planning purposes.
- Clarified that geometry-derived picking decisions should mostly remain in `3.2b-3` unless intentionally pulled earlier.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This change is planning/documentation only and is meant to make the next sketch phase easier to scope before implementation begins.

<!-- ENTRY 031 -->
### [031] - 2026-03-18 21:12 - `DOC - Normalize Sketch 3.2B-N Subphase Heading Format`
<!-- ENTRY 031 -->
HUMAN SUMMARY: `Reformatted the local `3.2B-N` subphase map in the sketch node architecture doc so the subphases now use one consistent checkbox-style `##` heading pattern, marking the first shipped sketch cuts as complete and the remaining follow-ons as future work.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to subphase-heading formatting and local doc history.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Normalized the `3.2B-N` subphase headings to a consistent `## [ ] / [x]` format.
- Marked `3.2B-0` and `3.2B-1` as completed in the local planning map.
- Marked `3.2B-2` through `3.2B-6` as unchecked future phases.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This change is documentation-structure cleanup only and does not alter the underlying sketch architecture direction.

<!-- ENTRY 030 -->
### [030] - 2026-03-18 20:54 - `DOC - Create Transform Tool Architecture Surface`
<!-- ENTRY 030 -->
HUMAN SUMMARY: `Created a new architecture doc for the ParaHook `Transform Tool`, using the current reference toolbar as the first proof surface and defining what must change for the tool to become a general transform/session architecture that can target more than references.` 

#### Scope
- Added one new architecture doc under `docs/Human-Plans/Architecture/`.
- Focused the change on transform-tool ownership, target generalization, and the boundary between viewer/runtime transforms and authored/source transforms.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added a dedicated `Transform Tool` architecture surface.
- Defined the current `ReferenceTransformToolbar` as the first proof, not the final product.
- Recorded the need for generic target identity, target adapters, capability matrices, and per-target persistence policy.
- Clarified how sketch-plane placement can reuse transform-tool language while still remaining an authored/source target rather than a plain viewer/runtime target.

#### Files Changed
- `docs/Human-Plans/Architecture/Transform-Tool.md`
- `docs/Doc-Log.md`

#### Notes
- This doc complements the existing future task doc `[2.4F]` by providing the broader architecture direction above the phase/task layer.

<!-- ENTRY 029 -->
### [029] - 2026-03-18 20:51 - `DOC - Add Expanded SketchPlane Row Parameter-Stack Vision`
<!-- ENTRY 029 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so the `SketchPlane` setup flow is now explicitly described as conceptual steps that should render as grouped editable rows inside the expanded input surface, not as a locked wizard, allowing the user to adjust reference, move, rotate, and flip in any order.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `Sketch plane` UI-structure vision.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added an explicit expanded-row UI structure for `SketchPlane`.
- Clarified that the setup “steps” are planning/mental-model steps, not enforced interaction order.
- Recorded that the expanded row should behave like a grouped parameter stack using `ParaSelect` and `ParaSlider` rows.
- Clarified that users should be free to set `Flip`, move, rotate, or reference values in any order.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This strengthens the distinction between conceptual setup flow and the actual node-row interaction model.

<!-- ENTRY 028 -->
### [028] - 2026-03-18 20:39 - `DOC - Reframe SketchPlane Pick-In-Viewport As One Hybrid Source Workflow`
<!-- ENTRY 028 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc so `Pick In Viewport` is no longer described as two separate modes and is instead framed as one hybrid source workflow where the session opens on the origin planes by default but also accepts existing sketch geometry and model faces in the same placement flow.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `Sketch plane` source-pick framing.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Removed the stricter two-mode wording from the `Pick In Viewport` planning surface.
- Reframed viewport source picking as one hybrid workflow.
- Kept the origin/world-plane entry state, but clarified that the same session should also accept existing sketch geometry and model faces as valid source references.
- Clarified that the later sketch-origin gizmo / transform tool should remain the same regardless of how the initial source was chosen.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This replaces the earlier stronger two-mode framing with a simpler hybrid interaction model.

<!-- ENTRY 027 -->
### [027] - 2026-03-18 20:38 - `DOC - Add Default Origin-Mode And Three-Plane Viewport Entry To SketchPlane Pick Flow`
<!-- ENTRY 027 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so `Pick In Viewport` now explicitly starts in `Origin Mode`, places the sketch-origin gizmo at the world origin by default, and shows the three Fusion-style origin reference boxes/planes as the first viewport picking surface.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `Sketch plane` viewport-pick interaction.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added the rule that `Pick In Viewport` should load into `Origin Mode` by default.
- Added the rule that the sketch-origin gizmo should appear at the world origin on entry.
- Added the requirement that the user initially sees the three origin reference boxes/planes, similar to Fusion-style origin-plane picking.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This clarifies the initial entry state for viewport picking before the user switches into geometry-derived source behavior.

<!-- ENTRY 026 -->
### [026] - 2026-03-18 20:36 - `DOC - Clarify Two Pick-In-Viewport Input Modes For SketchPlane`
<!-- ENTRY 026 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so `Source > Pick In Viewport` now explicitly supports two input modes: an origin/world-plane mode starting from `0,0,0`, and a geometry-derived mode that starts from existing model references such as edges before entering the same sketch-plane placement workflow.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `Sketch plane` viewport-pick planning surface.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added an explicit two-mode model for `Pick In Viewport`.
- Defined `Origin Mode` as starting from `0,0,0` plus one of the world/origin planes.
- Defined `Geometry Mode` as deriving the sketch-plane start from existing model geometry, with edges as the first likely useful reference.
- Clarified that both modes should converge back into the same sketch-plane placement workflow and transform tool.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning structure only and does not yet add or rename any implementation phases.

<!-- ENTRY 025 -->
### [025] - 2026-03-18 20:32 - `DOC - Add 3.2B-N Sketch Subphase Map To Sketch Architecture Doc`
<!-- ENTRY 025 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc with a local `3.2B-N` subphase map that treats the current shipped `[3.2B]` work as `3.2B-0` and breaks the next sketch follow-ons into numbered cuts for source, viewport pick, geometry-driven setup, browser structure, and later sketch-content growth.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Added planning structure only; no runtime code, schema, or UI behavior changed.
- Focused the change on decomposing sketch work into future `3.2B-N` subphases inside the architecture doc.

#### Summary
- Added a `3.2B-N` sketch subphase map.
- Treated the currently shipped `[3.2B] Sketch Operation Authoring` work as `3.2B-0`.
- Added future subphases `3.2B-1` through `3.2B-6` for sketch-plane source/transform, viewport-first picking, geometry-driven setup, browser structure, browser depth, and later sketch-content/export ownership.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This numbering split currently lives in the architecture doc as the sketch-local decomposition direction and does not by itself rewrite the live roadmap file.

<!-- ENTRY 024 -->
### [024] - 2026-03-18 20:27 - `DOC - Add SketchPlane Flip Control To Architecture Vision`
<!-- ENTRY 024 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so the long-term `SketchPlane` transform surface now includes a simple `Flip` control, described as a `ParaSelect`-style direction toggle for quickly reversing sketch direction without requiring deeper manual rotation.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `Sketch plane` transform/control vision.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added `Flip` to the long-term `SketchPlane` transform surface.
- Recorded that `Flip` should use `ParaSelect` as a simple discrete orientation control.
- Clarified that `Flip` is meant to quickly reverse sketch direction, not replace the richer transform controls.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This change extends the control-template rules already captured for `ParaSelect` and `ParaSlider` in the same sketch node architecture surface.

<!-- ENTRY 023 -->
### [023] - 2026-03-18 20:26 - `DOC - Add Free SketchPlane Placement And Geometry-Selection Highlighting Vision`
<!-- ENTRY 023 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so the long-term `SketchPlane` source workflow now explicitly includes free placement/orientation through the sketch-origin gizmo and geometry-driven auto-setup with required viewport edge/highlight feedback.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the long-term `Sketch plane` source and viewport-selection vision.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added the requirement that the sketch-origin gizmo should allow the user to place the sketch plane wherever they want and rotate it however they want.
- Added the direction that model-geometry selection should eventually auto-set the sketch plane from qualifying references.
- Recorded the need for viewer-side edge highlighting, fill/tint feedback, and clear hover-versus-committed selection states during that workflow.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This extends the existing `Pick In Viewport` and sketch-origin gizmo vision rather than replacing it.

<!-- ENTRY 022 -->
### [022] - 2026-03-18 20:24 - `DOC - Add Collapsed Pick-In-Viewport And Sketch Origin Gizmo Vision`
<!-- ENTRY 022 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so the long-term `Pick In Viewport` flow now explicitly collapses the spaghetti editor into a compact bar, promotes a dedicated sketch-origin gizmo/transform tool in the viewport, and calls for extra spatial reference cues during sketch-plane placement.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the long-term viewport-pick interaction under the `Sketch plane` section.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added the explicit interaction sequence for `Pick In Viewport`.
- Recorded that the spaghetti editor should collapse into a compact top bar while source-pick is active.
- Clarified that the viewport should show a dedicated sketch-origin gizmo / transform tool for placement.
- Added the need for additional spatial reference cues around that origin gizmo during placement.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This extends the existing viewport-first `SketchPlane` source direction and makes the temporary collapsed editor presentation explicit.

<!-- ENTRY 021 -->
### [021] - 2026-03-18 20:22 - `DOC - Add SketchPlane Viewport Gizmo And Ghost Preview Requirement`
<!-- ENTRY 021 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so the long-term `SketchPlane` source direction now explicitly calls for viewport gizmo support and ghost plane/grid rendering, making it clear that future source picking should become a real placement workflow rather than remain only a static picker.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to the long-term `Sketch plane` source-pick vision.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added the requirement that the future sketch-plane picker should gain a viewport gizmo.
- Added the requirement for ghost plane boxes and ghost grid previews in the viewport.
- Clarified that the long-term source workflow should become a real placement workflow before sketch drawing begins.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This extends the existing viewport-first source-pick direction already captured in the same sketch node architecture doc.

<!-- ENTRY 020 -->
### [020] - 2026-03-18 20:20 - `DOC - Add SketchPlane Vision To Sketch Node Architecture Doc`
<!-- ENTRY 020 -->
HUMAN SUMMARY: `Expanded the sketch node architecture surface with a dedicated `Sketch plane` section that defines `SketchPlane` as the sketch's nested source/setup surface, locks the `Source + Transform` mental model, and records the intended row-mode, viewport-pick, and browser-boundary rules for future work.` 

#### Scope
- Updated the moved sketch architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the new `## Sketch plane` section and local doc history.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added the `Sketch plane` vision directly into the sketch node architecture doc.
- Defined `SketchPlane` as a nested setup surface rather than the whole sketch object.
- Locked the user-facing split of `Source` plus `Transform`.
- Recorded the intended `collapsed / essentials / expanded` behavior, viewport-first source-pick direction, and the rule that `SketchPlane` remains nested under `Sketches`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- The user had already moved the original sketch architecture file into the Spaghetti editor architecture tree before this update.

<!-- ENTRY 019 -->
### [019] - 2026-03-18 20:14 - `DOC - Create Sketch Architecture Surface`
<!-- ENTRY 019 -->
HUMAN SUMMARY: `Created a new dedicated architecture doc for \`Sketch\` so the project has one stable place to define sketch source/setup, browser placement, viewport exposure, and future sketch-content ownership before Phase 190 implementation continues.` 

#### Scope
- Added one new architecture doc under `docs/Human-Plans/Architecture/`.
- Kept the change focused on the broader `Sketch` object direction rather than a single `SketchPlane` row tweak.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added a new `Sketch` architecture surface.
- Locked the direction that `Sketch` is the wider authored content family while `SketchPlane` remains a nested setup/input surface.
- Recorded the intended browser structure `Content > References / Assembly / Sketches`.
- Recorded the expose/eyeball direction for sketch viewport preview without downstream consumption.
- Separated immediate source-workflow planning from later sketch-content and export work.

#### Files Changed
- `docs/Human-Plans/Architecture/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This new architecture doc is intended to absorb and stabilize sketch direction that had previously been spread across the active Codex notes.

<!-- ENTRY 018 -->
### [018] - 2026-03-18 19:29 - `DOC - Split SketchPlane Browser Phase Into 6A And 6B`
<!-- ENTRY 018 -->
HUMAN SUMMARY: `Reworked note `190` so the old single browser-integration phase is now split into `6A` and `6B`, with `6A` captured as the implementation-ready browser-structure and sketch-exposure pass and `6B` left as the prepared deeper integration follow-on once source-pick state is stable.` 

#### Scope
- Limited this change to active planning/document-structure capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on making the browser phase of the sketch-plane plan implementation-safe.

#### Summary
- Replaced the single `190 Phase 6 - Browser Integration` block with:
  - `190 Phase 6A - Browser Structure And Sketch Exposure`
  - `190 Phase 6B - Deeper Browser Integration`
- Moved the browser-family and eyeball/exposure suggestions into `6A`.
- Kept source-pick relaunch, active session state, and richer sketch child-row behavior in `6B`.
- Clarified that `6A` is the recommended first browser pass and that `6B` remains a prepared follow-on.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 017 -->
### [017] - 2026-03-18 19:25 - `DOC - Add Sketch Exposure Eyeball Suggestion To Picker And Browser Plan`
<!-- ENTRY 017 -->
HUMAN SUMMARY: `Expanded the active sketch-plane/browser planning note with a new suggestion that sketches should gain an `eyeball`-style expose toggle, allowing an in-progress sketch to be surfaced into content/browser preview flows and shown in the model viewport even before it drives a downstream output node.` 

#### Scope
- Limited this change to active planning/product-behavior capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on sketch preview exposure during authoring.

#### Summary
- Updated note `[190]` in the active Codex notes file.
- Added the recommendation that sketches should support an explicit expose/visibility toggle for content/browser preview.
- Clarified that exposed sketches should be previewable in the viewport without requiring a downstream output-producing node and should align with the future `Content > Sketches` family.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 016 -->
### [016] - 2026-03-18 19:24 - `DOC - Add Content-Level Sketches Browser Structure Suggestion To Picker Plan`
<!-- ENTRY 016 -->
HUMAN SUMMARY: `Expanded the active sketch-plane picker plan with a browser-structure suggestion that `Sketches` should eventually become a first-class `Content` family alongside `References` and `Assembly`, while keeping `SketchPlane` and `Source` nested inside each sketch rather than lifting them to the top level.` 

#### Scope
- Limited this change to active planning/information-architecture capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on the browser placement suggestion for future sketch content.

#### Summary
- Updated note `[190]` in the active Codex notes file.
- Added the recommendation that browser structure should eventually read as `Content > References / Assembly / Sketches`.
- Clarified that `Sketches` would be the lifted family, while `SketchPlane` / `Source` remain child state within each sketch item.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 015 -->
### [015] - 2026-03-18 19:19 - `DOC - Add Browser Integration Phase To SketchPlane Picker Plan`
<!-- ENTRY 015 -->
HUMAN SUMMARY: `Expanded the active sketch-plane picker plan so `190` now includes a browser-integration phase, capturing the recommendation that sketch-plane/source state and source-pick re-entry should eventually be surfaced in the browser instead of living only inside the node row.` 

#### Scope
- Limited this change to active planning/product-structure capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on browser integration for the future sketch-plane/source workflow.

#### Summary
- Updated note `[190]` in the active Codex notes file.
- Added a new browser-integration phase to the sketch-plane picker roadmap.
- Captured the recommendation that the browser should expose sketch source state and provide a way to relaunch source-pick once the underlying picker/session model is stabilized.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 014 -->
### [014] - 2026-03-18 19:17 - `DOC - Reframe SketchPlane Picker Note Around Execution Phases`
<!-- ENTRY 014 -->
HUMAN SUMMARY: `Reworked the active sketch-plane picker note again so `190` is now organized around a few implementation phases instead of many small topic headers, making it easier to collapse by execution slice and use as a practical roadmap.` 

#### Scope
- Limited this change to active planning/document-structure cleanup under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on making note `[190]` read like phased execution work.

#### Summary
- Added phase-based subsection headers to note `[190]`.
- Grouped the existing planning content into picker cleanup, viewport-first mode, live preview, face-pick decision, and source-summary follow-through phases.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 013 -->
### [013] - 2026-03-18 19:13 - `DOC - Break SketchPlane Source Picker Note Into Collapsible Subsections`
<!-- ENTRY 013 -->
HUMAN SUMMARY: `Reworked the active sketch-plane source-picker note into clearly headed sub-sections so the `190` planning entry can collapse cleanly in the editor and be scanned as smaller implementation slices instead of one long block.` 

#### Scope
- Limited this change to active planning/document-structure cleanup under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on making note `[190]` easier to navigate in the editor.

#### Summary
- Broke note `[190]` into labeled sub-sections covering current state, problem, goal, UX requirements, preview guidance, session-state guidance, naming, open product choice, and implementation order.
- Kept the underlying planning content intact while making it easier to collapse and reopen by topic.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 012 -->
### [012] - 2026-03-18 19:11 - `DOC - Expand SketchPlane Source Picker Note With Viewport-First UX Requirements`
<!-- ENTRY 012 -->
HUMAN SUMMARY: `Expanded the active sketch-plane source-picker note with two concrete UX requirements: entering source-pick should collapse/minimize the spaghetti editor enough to favor the model viewport, and the viewport should show live plane/face preview feedback similar to Fusion-style sketch-plane picking.` 

#### Scope
- Limited this change to active planning/UX-direction capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on viewport-first picker behavior for the future `SketchPlane` source flow.

#### Summary
- Updated note `[190]` in the active Codex notes file.
- Added the requirement that source-pick mode should shift the user into a viewport-first temporary state by collapsing/minimizing the spaghetti editor.
- Added the requirement that the viewport should show live origin-plane and/or face preview feedback during source picking.
- Updated the recommended implementation order to include editor-collapse behavior and preview work before richer source-summary follow-ons.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 011 -->
### [011] - 2026-03-18 19:09 - `DOC - Add SketchPlane Source Picker Upgrade Note`
<!-- ENTRY 011 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry for the next `SketchPlane` follow-on pass, focused on upgrading the current `Pick In Viewport` action and floating sketch-plane picker so they match the newer `Source` model instead of the older temporary plane-picker wording and framing.` 

#### Scope
- Limited this change to active planning/UI-flow capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on the future `SketchPlane` source-picker and viewport-pick flow.

#### Summary
- Added a new `[190]` note to the active Codex notes file.
- Captured the mismatch between the new `SketchPlane > Source` structure and the older temporary viewport plane-picker wording.
- Recorded the recommended next-pass goals, naming cleanup, and implementation order for the picker upgrade.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 010 -->
### [010] - 2026-03-18 19:00 - `DOC - Add Implementation-Ready SketchPlane V1 Consolidation Note`
<!-- ENTRY 010 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry that consolidates the recent `SketchPlane` planning into one implementation-ready v1 plan, including the locked `Source` and `Transform` control groups, row-mode behavior, shared `ParaSelect` and `ParaSlider` control choices, and the explicit deferred-scope boundaries.` 

#### Scope
- Limited this change to active planning/implementation-prep capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on turning the recent `SketchPlane` planning thread into one implementation-ready reference entry.

#### Summary
- Added a new `[189]` note to the active Codex notes file.
- Consolidated the current `SketchPlane` v1 structure, hierarchy, control-template rules, and row-mode behavior.
- Added explicit sections for deferred scope, invariants that must remain true during implementation, and the recommended implementation order.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 009 -->
### [009] - 2026-03-18 18:58 - `DOC - Add SketchPlane ParaSlider Control-Template Note`
<!-- ENTRY 009 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry locking the control-template direction that future authored `SketchPlane` controls should reuse the shared `ParaSlider` language already established in the spaghetti `i` menu and related surfaces, instead of introducing one-off numeric controls.` 

#### Scope
- Limited this change to active planning/UI-control-language capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on the shared control-template decision for future `SketchPlane` authoring rows.

#### Summary
- Added a new `[188]` note to the active Codex notes file.
- Recorded that future authored numeric controls under `SketchPlane` should default to the repo's shared `ParaSlider` template.
- Clarified that this applies to editable nested controls in `essentials` / `expanded`, not necessarily the compact collapsed top-row summary.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 008 -->
### [008] - 2026-03-18 18:56 - `DOC - Add SketchPlane V1 Source And Transform Plan Note`
<!-- ENTRY 008 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry that defines the recommended `SketchPlane` v1 structure as just two user-facing control groups, `Source` and `Transform`, and explicitly records what that first version should still leave out for later phases.` 

#### Scope
- Limited this change to active planning/product-structure capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on the `SketchPlane` v1 product shape and deferred-scope boundaries.

#### Summary
- Added a new `[187]` note to the active Codex notes file.
- Captured the recommended v1 `SketchPlane` split of `Source` plus `Transform`.
- Added a dedicated section describing what v1 should intentionally leave out and what follow-on work still needs to be added later.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 007 -->
### [007] - 2026-03-18 18:48 - `DOC - Add Replicad SketchPlane Orientation Model Note`
<!-- ENTRY 007 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry capturing the verified `replicad` plane/orientation model, the gap between that model and the repo's current `SketchPlane` enum, and the resulting recommendation that future sketch-plane work should move toward a richer composite authored object.` 

#### Scope
- Limited this change to active planning/reference capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on verified `replicad` plane/orientation capabilities and their implications for the future `SketchPlane` structure.

#### Summary
- Added a new `[186]` note to the active Codex notes file.
- Recorded that the repo currently only supports `XY | YZ | XZ` for `SketchPlane`.
- Captured that `replicad` supports richer named planes plus real `Plane` objects with origin and axis orientation data.
- Recorded the resulting structure recommendation that future `SketchPlane` work should likely evolve toward a richer composite object instead of staying a thin primitive plane enum forever.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 006 -->
### [006] - 2026-03-18 18:42 - `DOC - Add SketchPlane Composite-Type Structure Note`
<!-- ENTRY 006 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry capturing the likely schema direction that \`SketchPlane\` should remain the parameter name while its underlying value evolves into a richer composite type that can hold plane, transform, and offset together.` 

#### Scope
- Limited this change to active planning/schema-structure capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on the future `SketchPlane` parameter/type relationship.

#### Summary
- Added a new `[185]` note to the active Codex notes file.
- Recorded the recommendation to keep `SketchPlane` as the port/parameter name.
- Captured the likely direction of introducing a richer composite type such as `sketchPlane` instead of overloading primitive `plane`.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 005 -->
### [005] - 2026-03-18 18:37 - `DOC - Add SketchPlane Parent Row And Nested Transform Row Note`
<!-- ENTRY 005 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry locking the structure decision that \`SketchPlane\` remains the parent managed input row while \`Transform\` becomes a nested child row inside it, with parent row mode controlling body visibility and child row mode controlling transform-surface depth.` 

#### Scope
- Limited this change to active planning/interaction-architecture capture under `docs/`.
- Did not change runtime code or UI behavior.
- Focused the note on the managed `SketchPlane` input-row hierarchy.

#### Summary
- Added a new `[184]` note to the active Codex notes file.
- Captured the parent/child hierarchy for `SketchPlane` and its future nested `Transform` row.
- Locked the distinction between parent row mode and child transform-row mode for future implementation work.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 004 -->
### [004] - 2026-03-18 18:31 - `DOC - Add SketchPlane Transform-Surface Row-Mode Note`
<!-- ENTRY 004 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry describing the future vision for embedding full transform controls inside the managed \`SketchPlane\` input row and defining how that transform surface should be divided across \`collapsed\`, \`essentials\`, and \`expanded\` row modes.` 

#### Scope
- Limited this change to active planning/UX-architecture capture under `docs/`.
- Did not change runtime code or UI behavior.
- Focused the note on the managed `SketchPlane` input row and its future transform-surface design.

#### Summary
- Added a new `[183]` note to the active Codex notes file.
- Captured the transform-surface vision for the managed `SketchPlane` input row.
- Recorded recommended grouping, row-mode division, and the sequencing rule that the data model should be settled before the full UI is implemented.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 003 -->
### [003] - 2026-03-18 18:31 - `DOC - Add SketchPlane Input Row Vision And Terminology Note`
<!-- ENTRY 003 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry that locks the correct term for the current \`SketchPlane\` surface and records the intended product direction for upgrading it from a generic port-details row into a dedicated sketch-plane control surface.` 

#### Scope
- Limited this change to active planning/terminology capture under `docs/`.
- Did not change runtime code or UI behavior.
- Focused the note on the managed `SketchPlane` input row only.

#### Summary
- Added a new `[182]` note to the active Codex notes file.
- Locked the preferred term as `managed SketchPlane input row`.
- Captured the current-code truth, why `input node` is the wrong term, and the desired future UX direction for the row.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 002 -->
### [002] - 2026-03-18 18:03 - `DOC - Add Sketch Output Cleanup Research Note To Active Codex Notes`
<!-- ENTRY 002 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry documenting the current sketch-output-row architecture, why it still feels older than the cleaned-up input row, and what concrete code targets remain to migrate the output rows onto the same shared port-row style.` 

#### Scope
- Limited this change to active planning/research notes under `docs/`.
- Did not change any runtime code or UI behavior.
- Kept the note focused on the current `Geometry/Sketch` output-row cleanup path.

#### Summary
- Added a new `[181]` note to the active Codex notes file.
- Captured the current output-row render path and the specific wrapper still causing the older output-row behavior.
- Recorded the recommended migration direction, open UX questions, concrete file targets, and acceptance goals for the future cleanup.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 012 -->
### [012] - 2026-03-21 12:06 - `DOC - Add Sketch Follow-On For Move Axis Numeric Console Depth`
<!-- ENTRY 012 -->
HUMAN SUMMARY: `Added a new open sketch phase for \`SketchPlane > Move > X / Y / Z\` so axis-specific movement now has a dedicated planning home with float-only console entry, return-to-\`Move\` behavior, and matching sketch/roadmap index references.` 

#### Scope
- Limited this change to active sketch and roadmap planning docs under `docs/`.
- Did not change any runtime code or console behavior.
- Kept the new phase narrow to `SketchPlane > Move` child-depth and numeric entry behavior.

#### Summary
- Added `[3.2B-S6] SketchPlane Move Axis Numeric Entry` to the sketch architecture doc history and hierarchy-cleanup index.
- Created the standalone phase doc for `[3.2B-S6]`.
- Added the new open phase to the roadmap and corrected the stale `[3.2B-S5]` detailed roadmap status/checklist so it matches shipped reality.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch_Phase 3.2B-S6 - SketchPlane Move Axis Numeric Entry.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 001 -->
### [001] - 2026-03-18 16:09 - `DOC - Create Doc-Log And Split Document Tracking From CHANGELOG`
<!-- ENTRY 001 -->
HUMAN SUMMARY: `Created the new permanent document-history file at \`docs/Doc-Log.md\` and updated \`AGENTS.md\` so document changes now route here while shipped code and runtime work continue to use \`docs/CHANGELOG.md\`.` 

#### Scope
- Limited this change to repository documentation workflow rules.
- Did not rewrite existing `docs/CHANGELOG.md` history.
- Kept `docs/Chill-Log.md` reserved for chill-mode logging.

#### Summary
- Added `docs/Doc-Log.md` as the canonical permanent log for documentation changes.
- Updated `AGENTS.md` so code/system work continues to use `docs/CHANGELOG.md`.
- Updated `AGENTS.md` so document changes use `docs/Doc-Log.md`.
- Fixed the stale Codex-notes path in `AGENTS.md` so it points at the current `docs/Human-Plans/CodexNotes/` location.

#### Files Changed
- `AGENTS.md`
- `docs/Doc-Log.md`

#### Notes
- This file starts at entry `[001]`.
- Earlier documentation history remains in existing docs and local `Doc History` sections.
