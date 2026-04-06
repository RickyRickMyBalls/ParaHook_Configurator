# Browser Phase Browser-12.1 - Real STEP Import Row Progress

## Doc Header

### Doc History
3. 2026-03-29 14:32: Widened the phase scope from STEP-only wording to all imported object rows handled by this loader path, so the real-progress follow-on now covers the whole imported-object loader family instead of only one file label
2. 2026-03-29 14:29: Expanded this future Browser progress phase with a dedicated `Questions / Decisions` block so the real-progress direction is tighter before implementation, including the rules around determinate-versus-indeterminate display, loader milestone truth, and the relationship between per-file row progress and aggregate category/root progress
1. 2026-03-29 14:26: Created this standalone future Browser follow-on after shipped `Browser-12` to lock a real per-file STEP import progress pass, so Browser object rows can show honest loading progress instead of stuttering from `loading` to `loaded` with only aggregate category cues

### Purpose

This phase gives imported object rows from this loader real Browser progress.

Use it to answer:
- whether Browser should keep faking or smoothing single-file imported-object row progress from this loader
- where true per-file loader progress should enter shared app state
- how Browser rows should display honest partial progress for one imported object
- what should stay out of scope so this remains a real-progress phase instead of another broad Browser cleanup

## Doc Body

## [ ] Browser-12.1 - Real STEP Import Row Progress

### Summary

`Browser-12.1` starts after:
- `Browser-10.4`
  - Browser runtime/load traits already moved toward a shared row-trait seam
- `Browser-11`
  - the reference-backed Browser tree and owner model got much more honest
- `Browser-12`
  - part-row cleanup landed as a separate narrower Browser-local polish pass

But one Browser loading behavior still feels wrong:
- imported object rows from this loader can visibly stutter
- the row often looks idle, then briefly loading, then suddenly fully loaded
- aggregate load cues higher in the tree can move, while the individual STEP row still does not show honest per-file progress

This phase fixes that honestly:
- Browser should show real per-file import progress on the actual object row
- do not fake smoothness with an invented percentage
- do not keep relying only on aggregate category/root progress if the user is looking at one imported file row

### Owns

- real per-reference or per-imported-object loading progress for Browser rows on this loader path
- plumbing true loader progress from this imported-object loading path into shared app state
- exposing that progress through Browser row derivation for imported object rows
- rendering determinate Browser row progress when true progress exists
- keeping aggregate category/root loading cues consistent with the new object-row truth

### Does Not Own

- broader Browser hierarchy cleanup
- reference-container parity work
- fake or time-based progress smoothing
- imported-file types outside this loader path unless a later phase widens this contract
- redesigning the entire viewer loading pipeline beyond the progress seam needed for honest STEP row progress

### Locked Outcome

- an imported Browser object row on this loader path should show real loading progress when true progress exists
- the Browser should not invent percentages for small or large files
- small files can still complete quickly, but the row should only display determinate progress when the loader has real progress to report
- aggregate root/category progress can remain, but object rows should no longer depend on those cues alone
- the Browser loading bar should reflect actual loader milestones or byte progress instead of a cosmetic animation that snaps to done

### Current Gap

Today the Browser already has some loading truth:
- root/category loading rows can reflect aggregate progress from broader reference loading work
- imported rows can show `unloaded`, `loading`, `loaded`, or `error`

But the object row still lacks true progress:
- this loader path does not currently give Browser a real per-file progress stream
- Browser row derivation does not expose a determinate per-object STEP progress value
- row rendering therefore cannot honestly show progress for one imported object from this loader

That is why the object row still feels like it stutters instead of loading.

### Direction

- add a real progress seam in this loader path
- store that progress in shared app state against the imported reference/object being loaded
- expose it through the normal Browser row runtime-trait path
- render determinate progress only when true progress exists
- keep fallback loading visuals minimal and honest when the loader cannot report intermediate progress

### Implementation Direction

- widen this loading pipeline so it can report meaningful progress updates during fetch/load/parse
- store those progress updates in app state keyed to the imported reference/object row the user sees in Browser
- update Browser row derivation so imported object rows can expose determinate load progress
- update Browser row presentation so the progress bar reads from that real per-row progress value
- preserve existing loaded/error/runtime truth while adding this more granular progress signal

### Questions / Decisions

#### [x] q1 - Should this phase cover all imported object rows handled by this loader, not only rows labeled as STEP imports?

Question:
- should `Browser-12.1` cover every imported object row that comes through this loader path, instead of being limited only to rows labeled as STEP imports?

Suggestion:
- yes
- the user-visible need is honest per-file progress for imported objects on this loader path, not a narrower file-label-specific rule

Decision:
- `Browser-12.1` should cover all imported object rows handled by this loader path, not only rows labeled as STEP imports
- the phase can still stay scoped to this loader family instead of widening into unrelated loader systems

#### [ ] q2 - Should determinate row progress appear only when the loader has real measurable progress to report?

Question:
- if the loader cannot provide a real measurable percentage or milestone position for a file, should the Browser avoid showing a fake determinate bar for that row?

Suggestion:
- yes
- determinate progress should only appear when the loader has real measurable progress to report

#### [ ] q3 - Should Browser prefer real loader milestones over invented byte percentages when exact byte progress is unavailable?

Question:
- if exact byte progress is not available for some STEP loads, but the loader can still report honest staged milestones such as fetch, parse, or build phases, should Browser use those real milestones instead of inventing a smoother percentage curve?

Suggestion:
- yes
- real milestone progress is still honest progress and is better than fake smoothing

#### [ ] q4 - Should per-file object-row progress become the primary cue while aggregate category/root progress stays secondary?

Question:
- once a single imported STEP object row can show real progress, should higher-level `References` or category bars remain visible only as aggregate supporting context instead of the main progress signal for that file?

Suggestion:
- yes
- the object row the user imported should carry the primary truth for that file, while higher rows keep supporting aggregate context

#### [ ] q5 - Should very small files be allowed to complete almost instantly without forcing visible intermediate progress?

Question:
- if a tiny STEP file loads too quickly to emit meaningful intermediate progress, should Browser allow the row to move to `loaded` quickly instead of artificially stretching the load just to make the bar more noticeable?

Suggestion:
- yes
- honesty matters more than visual consistency, so tiny files can still complete quickly

#### [ ] q6 - Should this first pass stay limited to this loader family instead of widening into every import path in the app?

Question:
- should `Browser-12.1` stay focused on the visible imported-object stutter problem inside this loader family and avoid widening the new progress contract into every other import path during the first pass?

Suggestion:
- yes
- land real imported-object row progress for this loader family first, then widen later only if the same progress seam proves useful elsewhere

### Concrete Implementation Targets

Primary expected targets:
- `src/viewer/stepReferenceLoader.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/browserTreeRowPresenter.tsx`

Supporting targets if needed:
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`

### Tests

- importing a file through this loader exposes real intermediate progress on the corresponding Browser object row when the loader reports it
- aggregate Browser loading cues remain correct while per-object progress is active
- very small STEP files can still complete quickly without inventing fake intermediate percentages
- large STEP files show increasing determinate progress instead of only `loading` then `loaded`
- loaded and error states still resolve correctly after progress reaches completion or failure
- existing Browser loading behavior outside this loader family does not regress

### Assumptions

- the user wants honest progress, not cosmetic smoothing
- single imported-object row progress is the missing Browser cue, even though aggregate category/root progress already exists
- this phase should stay narrowly about true imported-object row progress for this loader family so it remains a safe follow-on instead of reopening Browser architecture work
