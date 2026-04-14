# Cleanup Phase Cleanup-11 - Naming, Docs, And Honest Label Hardening

## Doc Header

### Doc History
1. 2026-04-13 13:58:45: Created this standalone future phase doc for `Cleanup 11` to hold the final naming/docs hardening lane after `Cleanup 10`, grounding it in the cleanup vision's honest-label rule, the cleanup index's final-lane framing, the live stale-label seams across build/runtime ids, workspace compatibility bridges, dashboard persistence keys, and the architecture terminology docs

### Purpose

This doc defines the `Cleanup 11` follow-on phase for the `Cleanup` family.

Use it to answer:
- which `legacy`, `compat`, migration, and carry-forward labels are still honest versus stale
- where architecture docs, terminology docs, and source labels still tell an older story than the shipped ownership model
- how to keep real backward-compatibility seams explicit without letting them read like the permanent architecture
- how to prove one narrow naming/docs hardening slice before widening into repo-wide rename churn

Do not use it for:
- reopening ownership decisions already locked by earlier cleanup lanes
- broad product redesign
- forced codewide renames that are not grounded in a finished cleanup boundary
- removing live compatibility behavior before its replacement path is proven
- treating every old label as incorrect just because it is old

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - cleanup family scan surface
  - final-lane framing after `Cleanup 10`

- `../Cleanup-Vision.md`
  - cleanup framing for naming honesty, migration retirement, and docs that match runtime truth

- `../Canonical-Ownership-Targets.md`
  - owner baseline this lane should describe honestly instead of re-deciding

- `../Canonical-Owner-Decisions.md`
  - one-real-owner rules this lane should reflect in naming and documentation

- `./Cleanup_Phase Cleanup-10 - Optional Workspace Family Scope Decisions.md`
  - most recent cleanup lane before this one

- `../../Terminology-Decisions.md`
  - current architecture-side home for accepted and active terminology transitions

- `../../../../Vision.md`
  - repo-level rule that transitional legacy seams are temporary replacement paths, not permanent architecture

- `../../../roadmap/Vision-roadmap.md`
  - canonical north star for post-cleanup architecture language and product honesty

## Doc Body

## [ ] Cleanup 11 - Naming, Docs, And Honest Label Hardening

### Header

Purpose:
- make the shipped cleanup direction read honestly in code and docs by retiring stale labels, preserving only still-real compatibility wording, and leaving one consistent naming story for the repo handoff

Owns:
- naming and docs hardening after the earlier cleanup lanes
- stale `legacy`, `compat`, migration, fallback, and carry-forward label review
- architecture-doc wording updates that should mirror the shipped owner model
- one narrow proof slice that shows how to replace stale labels without widening into unsafe churn

Does not own:
- re-deciding owners already locked by earlier cleanup lanes
- removing still-needed compatibility behavior without proof
- broad runtime or product rewrites
- large code-motion work that belongs to another cleanup lane
- vocabulary invention that is not tied to a real shipped boundary

### Why This Phase Exists

The cleanup vision already says naming and documentation honesty is its own lane.

Current repo reality shows why:
- some `legacy` labels are still honest because they guard active backward-compatibility behavior
- some labels now describe a story that earlier cleanup phases already narrowed or retired
- some architecture docs already point at the right owner direction, but the source labels still imply an older runtime model
- some source names still do real work, but their wording is vague enough that later cleanup will struggle to tell whether they are live compatibility seams or just residue

That means the final problem is not "rename everything old."

The final problem is:
- which old names still describe a real active compatibility seam
- which old names should be retired because the migration is already effectively over
- which docs should move from provisional wording to shipped wording
- where one explicit terminology home should carry the rename direction so code and docs stop drifting apart

Without a cleanup lane here:
- shipped cleanup work can keep reading half-finished because old labels survive by inertia
- future contributors can keep misreading real owners because docs and source names tell different stories
- compatibility seams can keep feeling permanent because the code never records whether they are still active or just old

This phase exists so we can:
1. lock the naming/docs boundary after the earlier cleanup lanes,
2. inventory the live stale-label and honest-compatibility hotspots,
3. define one explicit rule for when old wording stays versus when it must go,
4. prove that rule on one narrow live seam,
5. then hand the cleanup family off with clearer language and less drift.

### Scope

This phase covers:
- stale-label review across code and architecture docs
- naming drift between shipped cleanup decisions and current source/docs wording
- explicit distinction between honest compatibility labels and stale residue labels
- one narrow proof slice that validates the naming/docs rule in live code or docs

This phase does not cover:
- broad feature redesign
- broad store or runtime extraction
- semantics-only rename churn with no cleanup boundary behind it
- removal of compatibility readers that still protect persisted or worker-facing data
- replacing the dedicated terminology doc with scattered one-off rename notes

### Current Read

The repo already has enough cleanup direction to make naming honesty actionable, but the live labels still mix honest compatibility wording with stale carry-forward wording.

- `src/shared/buildTypes.ts`
  - still exports `LEGACY_RUNTIME_PROJECT_FILE_ID` and `LEGACY_RUNTIME_GRAPH_DOCUMENT_ID`
  - is a strong candidate for a later first proof slice because these names sit in a small shared contract seam that now looks more like a retained fallback identity than the main runtime story

- `src/app/buildDispatcher.ts`
  - still emits `legacy-build-*` request ids
  - shows a live build/runtime naming seam where old wording may now be weaker than the actual ownership model

- `src/worker/buildModel.ts`
  - still uses the `legacy-build-model` wrapper id
  - makes the worker-facing side of the same build/runtime label story visible

- `src/app/workspace/useWorkspaceLegacyCompatibilityBridge.ts`
  - still looks like an honest active compatibility seam
  - is an important counterexample because this phase should not retire labels that still describe real migration behavior

- `src/app/dashboard/dashboardPersistence.ts`
  - still reads old `v1` / `v2` / `v3` storage keys alongside the live `v4` key
  - is another honest compatibility seam that should likely stay explicit until the compatibility read path is intentionally removed

- `docs/Human-Plans/Architecture/Terminology-Decisions.md`
  - already exists as the architecture-side home for active vocabulary transitions
  - should become the explicit place where accepted wording changes are recorded instead of leaving rename intent scattered

- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
  - now frames this lane as the final cleanup-shape pass
  - should stay aligned with whatever wording this lane locks

- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
  - already says docs should describe the real system instead of a hoped-for or old one
  - provides the rule that stale migration labels should be retired once the migration is actually over

This means the strongest current ambiguity is:
- some labels are still carrying honest compatibility meaning
- some labels now read more like residue or shorthand for an older architecture story
- the repo still needs one explicit rule for telling those two cases apart before code or docs are renamed

### Locked Direction

- this lane should favor honest description over blanket rename churn
- `legacy`, `compat`, migration, fallback, and bridge wording may stay when:
  - the seam still exists to read old persisted data
  - the seam still preserves an active protocol or runtime fallback
  - the seam is intentionally temporary and still materially active
- those labels should be retired when:
  - the older path is no longer the real runtime story
  - the behavior has already converged and the old wording now obscures ownership
  - the docs or source wording would mislead a new contributor about what is canonical
- architecture docs should point to one current terminology story rather than preserving several overlapping transition stories
- this lane should prove one narrow source-plus-doc hardening slice before widening into broader renames

### Naming And Docs Baseline

The working default for this lane is:
- preserve one explicit split between:
  - honest active compatibility wording
  - stale residue wording
  - canonical shipped terminology
  - future-only terminology experiments

Honest active compatibility wording may:
- mention `legacy`, `compat`, migration, fallback, or bridge behavior directly
- remain in code and docs while the older data or protocol path is still truly supported
- stay narrow and explicit about what old path is being protected

Stale residue wording should not:
- survive only because it has been around a long time
- hide the real canonical owner or runtime path
- imply a second architecture story after the cleanup lanes already settled it
- stay scattered across code and docs without one explicit terminology read

Canonical shipped terminology should:
- describe the current owner model that actually shipped
- be reflected consistently across cleanup docs, terminology docs, and the narrow source seams this lane touches

### Phase Ladder

## [ ] Phase 1 - Reconfirm Naming And Docs Boundary After Cleanup 10

Purpose:
- lock one explicit baseline that says `Cleanup 11` is the final naming/docs hardening lane downstream from the earlier ownership cleanup and the `Cleanup 10` optional-family scope baseline

Read:
- `Phase 1` should stay a docs-and-verification pass

Current read:
- the strongest framing docs are:
  - `docs/Vision.md`
  - `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
  - `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
  - `docs/Human-Plans/Architecture/Terminology-Decisions.md`
- the strongest live hotspot seams are:
  - `src/shared/buildTypes.ts`
  - `src/app/buildDispatcher.ts`
  - `src/worker/buildModel.ts`
  - `src/app/workspace/useWorkspaceLegacyCompatibilityBridge.ts`
  - `src/app/dashboard/dashboardPersistence.ts`

Locked in-scope:
- re-read the cleanup family direction and repo vision rules that require honest naming and finite migrations
- make explicit what belongs to `Cleanup 11` versus what remains later runtime removal or feature work
- identify the main stale-label and honest-compatibility hotspot set for `Phase 2`
- answer the first boundary questions directly:
  - which old labels are still honest because the compatibility path is live
  - which old labels now obscure the canonical owner story
  - which docs should act as the canonical language sources
  - which renames must wait for a later behavior-removal lane instead of happening here

Locked out-of-scope:
- code movement
- broad behavior removal
- broad feature redesign
- repo-wide rename churn
- deleting persistence or protocol compatibility readers without proof

Implementation spec:
1. Re-read the cleanup family direction and repo vision rules.
2. Re-read the most recent cleanup-lane boundary from `Cleanup 10`.
3. Re-scan the live source and doc hotspots listed above.
4. Write one explicit baseline that answers:
   - what counts as honest active compatibility wording
   - what counts as stale residue wording
   - what this lane may change without reopening earlier cleanup decisions
5. Name the concrete hotspot outputs that `Phase 2` should inventory.
6. Stop before this pass turns into the actual inventory or rename pass.

Stop rule:
- do not start renaming in `Phase 1`
- do not turn naming review into behavior removal
- do not treat every old label as wrong just because it is old

Checklist:
- [ ] re-read the cleanup family direction and repo vision rules
- [ ] re-read the most recent cleanup-lane boundary from `Cleanup 10`
- [ ] scan the live stale-label hotspot set
- [ ] write one explicit naming/docs boundary baseline
- [ ] name the hotspot outputs for `Phase 2`

Verification:
- manual re-read against the cleanup framing docs and the live hotspot set

Expected implementation result:
- `Cleanup 11` is explicitly framed as the final naming/docs hardening lane instead of a hidden behavior-removal lane
- the live source-plus-doc hotspot set is named directly for the next inventory pass

## [ ] Phase 2 - Inventory Stale Labels And Honest Compatibility Seams

Purpose:
- classify where current old wording is still honest versus where it now obscures the shipped architecture story

Read:
- `Phase 2` should stay a docs-and-verification pass

Current read:
- the main inventory buckets already look like:
  - honest active compatibility seams
  - stale source labels
  - stale doc labels
  - canonical terminology sources
  - downstream consumers that only need wording repoints later

Implementation spec:
1. Re-read the completed `Phase 1` baseline.
2. Inventory the live seams into explicit buckets such as:
   - active compatibility labels that should remain
   - stale labels that should be renamed
   - docs that should be updated to match shipped reality
   - terminology decisions that should move into or out of `Terminology-Decisions.md`
3. Lock the strongest likely `Phase 3` rule target around one explicit label-retirement rule.
4. Lock the strongest likely `Phase 4` proof candidate as one narrow source-plus-doc seam.

Stop rule:
- do not start renaming inside the inventory pass
- do not collapse honest compatibility seams into stale-residue buckets without proof

Checklist:
- [ ] inventory the live stale-label seams
- [ ] classify the main source/doc/terminology buckets
- [ ] lock the likely `Phase 3` rule target
- [ ] lock the likely `Phase 4` proof candidate

Verification:
- manual re-read of the hotspot set against the completed `Phase 1` baseline

Expected implementation result:
- the naming and docs hotspots are classified into explicit buckets
- the likely `Phase 3` rule target and `Phase 4` proof candidate are locked

## [ ] Phase 3 - Lock The Honest Label Rule

Purpose:
- turn the completed inventory into one explicit rule for when old wording stays, when it gets narrowed, and when it should be retired

Read:
- `Phase 3` should stay a docs-and-verification pass

Decision target:
- one explicit rule that says:
  - what must be true for a `legacy`, `compat`, migration, bridge, or fallback label to remain honest
  - what signs mean that wording is now stale
  - which docs should act as the canonical terminology sources
  - how source labels and docs should be kept aligned

Implementation spec:
1. Re-read the completed `Phase 2` inventory.
2. Write the naming/docs rule directly against the real live seams:
   - build/runtime ids
   - workspace compatibility bridge
   - dashboard persistence keys
   - architecture terminology docs
3. Preserve the earlier cleanup boundaries:
   - do not reopen owner decisions
   - do not remove live compatibility behavior
4. Keep downstream consumers downstream.

Stop rule:
- do not rename code in this phase
- do not widen into broad terminology invention

Checklist:
- [ ] re-read the completed inventory
- [ ] write one explicit honest-label rule
- [ ] preserve the earlier cleanup boundaries
- [ ] keep downstream consumers downstream

Verification:
- manual re-read against:
  - `Cleanup-Vision.md`
  - `Cleanup-Index.md`
  - `Canonical-Ownership-Targets.md`
  - `Canonical-Owner-Decisions.md`
  - `Terminology-Decisions.md`

Expected implementation result:
- one explicit rule exists for deciding whether old wording stays or goes
- the rule is grounded in live source and doc seams rather than rename taste

## [ ] Phase 4 - Lock The First Naming Hardening Proof Boundary

Purpose:
- pick one explicit first proof slice that validates the naming/docs rule without widening into repo-wide churn

Read:
- `Phase 4` should stay a docs-and-verification pass

Current read:
- the strongest first proof candidate is the build/runtime label seam because:
  - it is small and shared across app, worker, and shared contract files
  - it exposes both source naming and cleanup-story drift directly
  - it is narrower than starting with workspace compatibility bridges or persistence migration readers

Preferred first proof band:
- owner seam:
  - `src/shared/buildTypes.ts`
- supporting source seams:
  - `src/app/buildDispatcher.ts`
  - `src/worker/buildModel.ts`
- smallest doc consumers:
  - `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
  - `docs/Human-Plans/Architecture/Terminology-Decisions.md`

Implementation spec:
1. Re-read the completed `Phase 3` rule.
2. Lock the first proof slice around one narrow source-plus-doc seam, preferably the build/runtime label band.
3. Name the exact owner, support, and downstream surfaces for that proof.
4. Record the explicit no-widening exclusions.

Stop rule:
- do not widen into workspace compatibility bridge cleanup
- do not widen into dashboard persistence removal
- do not turn this phase into broad codewide terminology migration

Checklist:
- [ ] re-read the completed `Phase 3` rule
- [ ] pick one narrow first proof slice
- [ ] name the exact owner/support/consumer surfaces
- [ ] record the no-widening exclusions

Verification:
- manual confirmation that the chosen proof slice is narrower than a repo-wide rename pass

Expected implementation result:
- the first naming/docs proof boundary is explicit
- the exact proof band is named directly for the first code-or-doc hardening pass

## [ ] Phase 5 - Prove One Narrow Naming And Docs Hardening Slice

Purpose:
- implement one narrow naming/docs proof that makes the chosen wording read more honestly in live code and docs

Read:
- `Phase 5` should be the first code-and-verification pass in this lane unless the chosen proof remains docs-only by design

Preferred first proof intent:
- rename or narrow one stale source label cluster so it better matches the shipped owner story
- update only the smallest supporting docs needed to keep the language aligned
- preserve still-honest compatibility wording outside the chosen proof slice

Implementation spec:
1. Re-read the completed `Phase 4` boundary.
2. Implement only the minimal source and doc edits needed to prove the first naming/docs rule.
3. Keep the touched band as small as possible:
   - prefer one owner seam
   - prefer one or two supporting consumer repoints
   - prefer one terminology or cleanup-doc alignment update
4. Add focused proof around the chosen seam.
5. Verify with the narrowest honest test band plus build if shared runtime names move.

Stop rule:
- do not widen into repo-wide rename churn
- do not remove live compatibility readers outside the chosen proof slice
- do not turn this proof into another cleanup lane

Checklist:
- [ ] implement the minimal proof seam
- [ ] keep the first proof narrow
- [ ] add focused proof
- [ ] verify with the narrowest honest band

Verification:
- to be filled by the implementation pass

Expected implementation result:
- one naming/docs decision reads more honestly in the repo
- later follow-on cleanup can start from that proof instead of from mixed old wording

## [ ] Phase 6 - Proof, Cleanup, And Final Handoff

Purpose:
- prove the first naming/docs hardening slice holds and record the remaining wording follow-ons without reopening the whole cleanup family

Read:
- `Phase 6` should be a proof-and-doc-closeout pass unless `Phase 5` exposes one small structural correction

Residual buckets to record:
- later stale-label clusters still worth revisiting
- still-honest compatibility seams that should remain explicit
- later terminology decisions that belong in `Terminology-Decisions.md`
- docs that should be updated later but do not belong to the first proof slice
- any behavior-removal follow-ons that belong to other cleanup or feature lanes instead of this one

Implementation spec:
1. Re-read the landed `Phase 5` proof against the cleanup vision and cleanup index.
2. Confirm the first naming/docs rule that is now actually proven.
3. Record the remaining follow-on buckets without starting them.
4. Write one explicit handoff so future work does not reopen the proven naming slice accidentally.
5. Stop once the first naming/docs decision is proven and the later path is explicit.

Stop rule:
- do not start a second broad rename pass here
- do not widen into behavior-removal work after the first proof lands

Checklist:
- [ ] re-read the landed proof against the cleanup framing docs
- [ ] confirm the first naming/docs rule now proven
- [ ] name the remaining follow-on buckets without starting them
- [ ] write the explicit later handoff

Verification:
- manual re-read of the landed proof against:
  - `Cleanup-Vision.md`
  - `Cleanup-Index.md`
  - `Terminology-Decisions.md`

Expected implementation result:
- the first naming/docs hardening decision is explicitly proven and closed out
- the cleanup family can hand off with a clearer language baseline and an explicit residual-bucket list
