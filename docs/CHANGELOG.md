# CHANGELOG

## Doc Header
Numbering rule for major entries:
- Prefix each new `###` entry section with a sequential command index: `[NNN]`.
- Increment by 1 for every new Codex-added section.

### Doc History
7. 2026-03-08 10:23: Removed planning-only entries `[132]` through `[139]` from the live changelog after moving that batch tracking back into the active `N_CodexChat.md` planning surface
6. 2026-03-07 14:41: Updated the forward changelog title-format rule so normalized entries should use the dashed date/time layout with the canonical phase title in one backticked block
5. 2026-03-07 14:24: Added normalized `HUMAN SUMMARY:` lines across all numbered changelog entries and reconstructed marker blocks using entry-body context so folded scanning is readable throughout the file
4. 2026-03-07 13:44: Added the new headerless `HUMAN SUMMARY:` rule so future changelog entries include a short 1-3 sentence readable summary directly under the entry wrapper
3. 2026-03-07 13:39: Tightened the forward changelog-title rule so new entries should use a backticked canonical phase title shape like ``### [119] 2026-03-05 23:09 `SP - Phase 6 - Resizable Debug Inspector Drawer` ``
2. 2026-03-07 13:34: Tightened the changelog rules so new permanent entries now explicitly require a canonical phase prefix in the entry title
1. 2026-03-07 13:21: Re-structured the top of this file to match the current doc rules with a proper `Doc Header` and `Doc Body` split while preserving the existing changelog entry format

### Purpose

This file is the canonical completed-work history for `/20/parahook`.

Use it for:
- permanent completed-work history
- major shipped implementation entries
- major docs/system consolidation entries that belong in permanent project history

Do not use it for:
- temporary chill-batch logging
- speculative planning
- active task execution checklists

### Changelog Rules

- each permanent changelog entry in `## Doc Body` starts with an HTML divider comment
- the main entry heading for new normalized entries should use `###` in this shape:
  - `### [NNN] - YYYY-MM-DD HH:MM - `PREFIX - Phase N - Title``
- each new permanent entry title should use the current canonical phase-prefix naming system when the work belongs to a canonical phase family
  - example:
    - `### [131] - YYYY-MM-DD HH:MM - `SP - Phase 8 - Entry Title``
- if the work is docs/meta/process work, use the canonical meta prefix when appropriate:
  - example:
    - `### [131] - YYYY-MM-DD HH:MM - `OO - Phase 13 - Entry Title``
- existing older entries do not need to be mass-rewritten just to match this title punctuation style
- the same HTML divider comment appears again directly under the main entry heading
- directly under the entry wrapper, include one headerless summary line in this shape:
  - `HUMAN SUMMARY: 1-3 sentences about what this changelog entry did`
- keep the human summary readable and compact so folding to the entry level still leaves a quick human scan
- prefer the human-summary line to use one outer backtick span for readable color grouping in VS Code, and reopen the outer span after any escaped inline file/code reference so the remaining sentence returns to the summary color
  - example:
    - `HUMAN SUMMARY: `This renamed the canonical chill-mode tracking file to \`docs/Chill-Log.md\` `and updated the repo docs to follow that new path.``
- standard entry subsections use `####`
- the normal subsection order is:
  - `HUMAN SUMMARY: ...` `headerless line, not a heading`
  - `#### Scope / Constraints Honored`
  - `#### Summary of Implementation`
  - `#### Files Changed`
  - `#### Behavior Changes (if any)`
  - `#### Verification Steps`
- reconstructed-history bands may also use visible marker headings such as:
  - `#### Reconstructed`
  - `### Reconstructed Gap`
- reconstructed entries still use numbered `###` headings underneath those markers
- keep numbering sequential unless the user explicitly requests a renumber pass



## Doc Body

<!-- ENTRY 512 -->
### [512] - 2026-03-21 09:32 - `VR - Phase 10 - Sampler Step-Length Playback And Per-Step Shaping`
<!-- ENTRY 512 -->
HUMAN SUMMARY: `Unlinked sampler-step playback from the global radio burst-time setting so each step now fills its BPM-sized window instead of borrowing the console burst length. Added per-step fade and scooch controls in the expanded step settings, with start and end scooch shaping the sampled window and generated-tone playback honoring fade in/out directly.` 

#### Scope / Constraints Honored
- Kept the console/radio burst-time control intact for console command playback.
- Moved only sampler-step playback onto its own BPM-sized timing path and step-local shaping state.

#### Summary of Implementation
- Extended `src/app/store/audioSamplerStore.ts` so each sampler step now stores:
  - `fadeInSec`
  - `fadeOutSec`
  - `startScoochSec`
  - `endScoochSec`
- Added transport helpers in `src/runtime/audio/TimelineTransport.ts` to:
  - derive sampler step playback duration from the BPM-sized step window
  - clamp start/end scooch into a valid playback window
  - scale fades so they stay inside the resolved playback duration
- Updated `src/app/AppShell.tsx` so sampler preview and loop playback now use:
  - step duration from BPM
  - step-local scooch values
  - step-local fade values
  instead of the global `sampleBurstTime`
- Updated `src/runtime/audio/AudioEngine.ts` so generated-tone bursts can render fade in/out into a dedicated burst buffer when needed.
- Extended the merged toolbar step detail UI in `src/app/panels/RadioPanel.tsx` with new controls for:
  - `Fade In`
  - `Fade Out`
  - `Start Scooch`
  - `End Scooch`

#### Files Changed
- `src/runtime/audio/TimelineTransport.ts`
- `src/runtime/audio/TimelineTransport.test.ts`
- `src/runtime/audio/AudioEngine.ts`
- `src/runtime/audio/AudioEngine.test.ts`
- `src/app/store/audioSamplerStore.ts`
- `src/app/store/audioSamplerStore.test.ts`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/panels/RadioPanel.tsx`

#### Behavior Changes (if any)
- Sampler steps no longer use the top-level radio `Sample Burst Time`.
- Each sampler step now defaults to a burst that fills the BPM-sized step window.
- `Start Scooch` and `End Scooch` trim and shift the sampled window for a step.
- `Fade In` and `Fade Out` are now stored per step and applied on the generated-tone playback path.

#### Verification Steps
- Ran `cmd /c npx vitest run src/runtime/audio/TimelineTransport.test.ts src/runtime/audio/AudioEngine.test.ts src/app/store/audioSamplerStore.test.ts src/app/panels/RadioPanel.test.tsx src/app/AppShell.test.tsx`.
- Confirmed the focused sampler/runtime suite passed with `81` tests green.
- Ran `cmd /c npm run build`.
- Confirmed the full `tsc -b && vite build` path completed successfully.

<!-- ENTRY 511 -->
### [511] - 2026-03-21 09:20 - `VR - Phase 10 - Sampler Step Lock Controls`
<!-- ENTRY 511 -->
HUMAN SUMMARY: `Added per-step lock controls to the horizontal sampler row so individual steps can be protected from reroll and cue edits. Locked steps now keep their sample position during both single-step and global rerolls, and their detail-slider time position is visibly locked as well.`

#### Scope / Constraints Honored
- Kept the change inside the existing merged `Phase 10` radio/sampler toolbar surface and canonical sampler store.
- Preserved the current preview and playback flow, only adding step-level protection around reroll and cue editing.

#### Summary of Implementation
- Extended `src/app/store/audioSamplerStore.ts` so each sampler step now carries `isLocked` state.
- Added a canonical `toggleSamplerStepLocked(...)` action and made locked steps ignore:
  - direct cue-ratio edits
  - single-step reroll
  - global reroll
- Updated `src/app/panels/RadioPanel.tsx` so each horizontal step cell now includes a third `L` lock button.
- Mirrored lock state in step detail with:
  - a `Lock / Locked` action
  - a locked-state readout
  - a disabled time-position slider shell
- Added focused regressions for the new store and toolbar behavior.

#### Files Changed
- `src/app/store/audioSamplerStore.ts`
- `src/app/store/audioSamplerStore.test.ts`
- `src/app/panels/RadioPanel.tsx`
- `src/app/panels/RadioPanel.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes (if any)
- Each sampler step now has a lock control in the horizontal row.
- Locked steps keep their current cue when the user clicks either `R` or `Reroll All`.
- Locked steps also ignore edits from the per-step time-position slider until unlocked.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/store/audioSamplerStore.test.ts src/app/panels/RadioPanel.test.tsx`.
- Confirmed the focused sampler store/panel suite passed with `19` tests green.
- Ran `cmd /c npm run build`.
- Confirmed the full `tsc -b && vite build` path completed successfully.

<!-- ENTRY 510 -->
### [510] - 2026-03-21 09:13 - `VR - Phase 9 - Fixed-Step Sampler BPM Timing`
<!-- ENTRY 510 -->
HUMAN SUMMARY: `Changed the sampler timing model so BPM now defines the duration of one step instead of defining a fixed one-bar loop that shrinks as step count rises. This makes longer step counts produce longer loops while keeping each step length stable at \`60 / bpm\`, which matches the intended sampler feel.`

#### Scope / Constraints Honored
- Kept the fix narrow to the sampler timing helper and its current app-shell consumer.
- Preserved the existing note-repeat and loop scheduler flow, only changing the step-duration rule.

#### Summary of Implementation
- Updated `src/runtime/audio/TimelineTransport.ts` so sampler step duration now resolves to `60 / bpm`.
- Kept sampler step start time tied to `stepIndex * stepDuration`.
- Updated the transport tests to lock the new fixed-step behavior instead of the old fixed-bar behavior.

#### Files Changed
- `src/runtime/audio/TimelineTransport.ts`
- `src/runtime/audio/TimelineTransport.test.ts`

#### Behavior Changes (if any)
- Increasing `Step Count` now makes the loop longer instead of making each step shorter.
- Example:
  - `150 BPM` now means `0.4s` per step
  - `8` steps now loop in `3.2s`
  - `16` steps now loop in `6.4s`

#### Verification Steps
- Ran `cmd /c npx vitest run src/runtime/audio/TimelineTransport.test.ts src/app/AppShell.test.tsx`.
- Confirmed the focused sampler/runtime suite passed with `53` tests green.
- Ran `cmd /c npm run build`.
- Confirmed the full `tsc -b && vite build` path completed successfully.

<!-- ENTRY 509 -->
### [509] - 2026-03-21 08:58 - `VR - Phase 10 - Step Detail Preview Controls`
<!-- ENTRY 509 -->
HUMAN SUMMARY: `Refined the merged sampler detail area by renaming \`Steps\` to \`Step Details\`, adding a per-step \`Play\` preview action, and making step time-position edits preview on slider release. This keeps cue editing legible and gives the user immediate audio feedback when dialing in a step's position in the song.`

#### Scope / Constraints Honored
- Kept the change inside the merged `Phase 10` radio/sampler surface and the existing shared audio runtime path.
- Reused the current radio playback helper instead of inventing a second preview engine just for step editing.

#### Summary of Implementation
- Added a canonical sampler-step preview request seam to `src/app/store/audioSamplerStore.ts`.
- Extended `src/app/AppShell.tsx` so step-preview requests are consumed through the existing `playRadioBurstFromSource(...)` runtime path.
- Updated `src/app/panels/RadioPanel.tsx` so:
  - `Steps` is now labeled `Step Details`
  - each expanded step row has a `Play` button
  - releasing the per-step time-position `ParaSlider` previews the current cue
- Extended `src/app/components/ParaSlider.tsx` with an optional end-of-change callback so release-driven preview can happen cleanly after dragging.
- Added focused regressions for the store, merged panel, and app-shell subscriber path.

#### Files Changed
- `src/app/components/ParaSlider.tsx`
- `src/app/store/audioSamplerStore.ts`
- `src/app/panels/RadioPanel.tsx`
- `src/app/AppShell.tsx`
- `src/app/store/audioSamplerStore.test.ts`
- `src/app/panels/RadioPanel.test.tsx`
- `src/app/AppShell.test.tsx`

#### Behavior Changes (if any)
- The nested sampler disclosure now reads `Step Details`.
- Each expanded step detail row now includes a `Play` button for direct preview.
- Releasing the step time-position slider now previews the step's current cue.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/store/audioSamplerStore.test.ts src/app/panels/RadioPanel.test.tsx src/app/AppShell.test.tsx`.
- Confirmed the focused suite passed with `66` tests green.
- Ran `cmd /c npm run build`.
- Confirmed the full `tsc -b && vite build` path completed successfully.

<!-- ENTRY 508 -->
### [508] - 2026-03-21 08:53 - `VR - Phase 10 - Resizable Radio Sampler Section Divider`
<!-- ENTRY 508 -->
HUMAN SUMMARY: `Added a draggable horizontal divider between the merged \`Radio\` and \`Sampler\` sections so the user can manually resize how much height the top radio section gets. This keeps the combined toolbar flexible without splitting it back into two separate panels.`

#### Scope / Constraints Honored
- Kept the change inside the merged `RadioPanel` seam and its styling.
- Preserved the single-surface `Phase 10` toolbar direction.

#### Summary of Implementation
- Added local split-drag state in `src/app/panels/RadioPanel.tsx` for resizing the top `Radio` section when both top-level sections are expanded.
- Added clamped minimum heights for both sections so the divider cannot collapse either side into an unusable state.
- Styled a visible horizontal split handle in `src/app/theme/v15Theme.css`.

#### Files Changed
- `src/app/panels/RadioPanel.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes (if any)
- The merged toolbar now shows a horizontal divider between `Radio` and `Sampler` when both sections are expanded.
- Dragging that divider changes the amount of height allocated to the `Radio` section.

#### Verification Steps
- Ran `cmd /c npm run build`.
- Confirmed the full `tsc -b && vite build` path completed successfully.

<!-- ENTRY 507 -->
### [507] - 2026-03-21 08:51 - `VR - Phase 10 - Stabilize Merged Toolbar Section Scroll Layout`
<!-- ENTRY 507 -->
HUMAN SUMMARY: `Stabilized the new merged-toolbar section scroll areas so the \`Radio\` and \`Sampler\` panes no longer jump around as runtime text and sampler state change. The fix moves the merged panel to fixed row distribution with stable internal scroll regions instead of max-height-driven reflow.`

#### Scope / Constraints Honored
- Kept the fix narrow to merged-toolbar layout CSS.
- Preserved the current merged `RadioPanel` structure and section scroll behavior.

#### Summary of Implementation
- Updated `src/app/theme/v15Theme.css` so the merged toolbar body now uses fixed grid row distribution between the `Radio` and `Sampler` sections.
- Changed the section bodies from max-height-based auto scroll to stable full-height internal scroll regions.
- Disabled outer panel-body scrolling for `RadioPanel` so only the intended section interiors handle overflow.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes (if any)
- The `Radio` and `Sampler` sections should now feel visually stable while status text, transport state, and sampler playhead state update.
- The merged toolbar should no longer reflow as aggressively when the internal scrollbars are present.

#### Verification Steps
- CSS-only change; no automated tests were run for this step.

<!-- ENTRY 506 -->
### [506] - 2026-03-21 08:50 - `VR - Phase 10 - Section Scrollbars For Merged Radio Toolbar`
<!-- ENTRY 506 -->
HUMAN SUMMARY: `Added internal scrollbars to the merged \`Radio\` and \`Sampler\` sections so the shared toolbar stays usable when its option list grows taller than the panel. This keeps the combined radio/sampler surface readable without forcing the whole floating toolbar to become excessively large.`

#### Scope / Constraints Honored
- Kept the fix narrow to the merged toolbar styling layer.
- Preserved the current merged `RadioPanel` structure and controls.

#### Summary of Implementation
- Updated `src/app/theme/v15Theme.css` so each merged section body now has its own bounded vertical scroll area.
- Added green-styled scrollbar treatment that matches the sampler-forward visual direction.
- Increased the sampler section’s internal max-height so it can show more of the horizontal row plus step detail before clipping.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes (if any)
- The `Radio` section now scrolls internally when its controls exceed the section height.
- The `Sampler` section now scrolls internally when the horizontal row, `Steps`, and `Note Repeat` controls exceed the section height.

#### Verification Steps
- CSS-only change; no automated tests were run for this step.

<!-- ENTRY 505 -->
### [505] - 2026-03-21 08:46 - `VR - Phase 10 - Shared Radio Toolbar Tree And Step Detail Expansion`
<!-- ENTRY 505 -->
HUMAN SUMMARY: `Merged the sampler into the shared radio toolbar so the app now presents one primary green radio/sampler surface instead of two competing panels. The shipped toolbar preserves the working horizontal sampler row and existing controls, adds store-backed disclosure state plus expandable step detail, and lets each step edit its song position through a per-step time slider inside the merged panel.`

#### Scope / Constraints Honored
- Preserved the current horizontal sampler row and existing `Phase 9` controls instead of redesigning the sequencer into a purely vertical UI.
- Kept the radio transport/source controls visible at the top of the merged toolbar.
- Avoided creating a second sampler state model by keeping disclosure and cue editing bound to the canonical `audioSamplerStore.ts` seam.

#### Summary of Implementation
- Extended `src/app/store/audioSamplerStore.ts` with canonical disclosure state for the merged toolbar plus direct per-step cue editing.
- Rebuilt `src/app/panels/RadioPanel.tsx` as the single primary radio/sampler surface, preserving the horizontal sampler row while adding collapsible `Radio`, `Sampler`, `Steps`, and per-step detail sections.
- Added per-step time-position editing through a `ParaSlider` in expanded step rows, backed by direct updates to each step's stored cue ratio.
- Restyled the merged toolbar in `src/app/theme/v15Theme.css` so it adopts the sampler-green visual language.
- Simplified `src/app/AppShell.tsx` so opening the radio toolbar mounts only the merged `RadioPanel` instead of mounting a second primary `AudioSamplerPanel`.
- Added focused regressions around merged-toolbar disclosure state, preserved sampler controls, step-detail rendering, and single-surface mounting.

#### Files Changed
- `src/app/store/audioSamplerStore.ts`
- `src/app/panels/RadioPanel.tsx`
- `src/app/AppShell.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/store/audioSamplerStore.test.ts`
- `src/app/panels/RadioPanel.test.tsx`
- `src/app/AppShell.test.tsx`
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Doc-Log.md`

#### Behavior Changes (if any)
- Opening the radio toolbar now shows one merged radio/sampler surface.
- The separate sampler panel no longer mounts alongside the radio toolbar as a competing primary surface.
- The merged toolbar now includes:
  - top-level collapsible `Radio` and `Sampler` sections
  - the preserved horizontal sampler step row
  - the preserved sampler `Play` / `Stop`, BPM, step-count, reroll, and note-repeat controls
  - a collapsible `Steps` detail section
  - expandable per-step rows with direct time-position editing
- The shared toolbar now uses the sampler-green visual direction instead of the older amber radio styling.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/store/audioSamplerStore.test.ts src/app/panels/RadioPanel.test.tsx src/app/AppShell.test.tsx src/app/panels/AudioSamplerPanel.test.tsx`.
- Confirmed the focused merged-toolbar suite passed with `65` tests green.
- Ran `cmd /c npm run build`.
- Confirmed the full `tsc -b && vite build` path completed successfully.

<!-- ENTRY 504 -->
### [504] - 2026-03-20 17:18 - `VR - Phase 9 - Sampler Sequencer Surface`
<!-- ENTRY 504 -->
HUMAN SUMMARY: `Landed the first sampler sequencer slice as a hosted panel that reuses the current radio source/runtime seams, with one-row step state, BPM and step-count controls, stable rerollable cue slots, a narrow note-repeat block, and an app-level loop that walks the row and triggers cue bursts through the existing audio engine path.` 

#### Scope / Constraints Honored
- Reused the existing radio source/runtime ownership instead of creating a second sampler source model.
- Kept the first sampler narrow to one row, one bar, one current source, and simple play/stop plus note-repeat controls.
- Preserved the current radio playback bridge and built the loop on top of the same `AudioEngine.playBurst(...)` behavior.

#### Summary of Implementation
- Extended `src/app/store/audioSamplerStore.ts` with a sampler slice for step count, BPM, play state, playhead state, step cues, and note-repeat settings.
- Expanded `src/runtime/audio/TimelineTransport.ts` with bar/step duration helpers and repeat-offset timing helpers for the sequencer loop.
- Implemented the first visible sampler surface in `src/app/panels/AudioSamplerPanel.tsx` using the shared toolbar shell language and a single row of step cells.
- Mounted the sampler panel from `src/app/AppShell.tsx` alongside the radio toolbar and added the first app-level sampler loop that advances the playhead and fires cue bursts through the existing audio runtime.
- Added sampler-specific styling in `src/app/theme/v15Theme.css`.
- Added focused regressions for transport timing, sampler store state, sampler panel interactions, and the app-shell loop.

#### Files Changed
- `src/app/store/audioSamplerStore.ts`
- `src/runtime/audio/TimelineTransport.ts`
- `src/app/panels/AudioSamplerPanel.tsx`
- `src/app/AppShell.tsx`
- `src/app/theme/v15Theme.css`
- `src/runtime/audio/TimelineTransport.test.ts`
- `src/app/store/audioSamplerStore.test.ts`
- `src/app/panels/AudioSamplerPanel.test.tsx`
- `src/app/AppShell.test.tsx`
- `docs/Human-Plans/Architecture/Radio.md`

#### Behavior Changes (if any)
- The app now shows a separate sampler panel when the radio toolbar is open.
- The sampler panel exposes:
  - step-count control
  - BPM control
  - one row of step cells
  - per-step enable/disable
  - per-step reroll
  - `Play` / `Stop`
  - `Reroll All`
  - a narrow `Note Repeat` block
- Starting the sampler now advances a visible playhead and triggers step cues against the current radio source through the existing runtime burst path.

#### Verification Steps
- Ran `cmd /c npx vitest run src/runtime/audio/TimelineTransport.test.ts src/app/store/audioSamplerStore.test.ts src/app/panels/AudioSamplerPanel.test.tsx src/app/AppShell.test.tsx`.
- Confirmed the focused sampler suite passed with `64` tests green.
- Ran `cmd /c npm run build`.
- Confirmed the full `tsc -b && vite build` path completed successfully.

<!-- ENTRY 503 -->
### [503] - 2026-03-20 17:03 - `VR - Phase 7 - Radio Toolbar And Control Surface`
<!-- ENTRY 503 -->
HUMAN SUMMARY: `Landed the first visible radio toolbar as a hosted overlay panel driven by the canonical radio store/runtime seams, with console-open/close commands, live status and transport readout, seek/reload plumbing, and focused regressions across the console, panel, app shell, and audio runtime. This makes the post-console radio system actually inspectable and controllable without reopening the earlier console-phase design.` 

#### Scope / Constraints Honored
- Reused the shared toolbar shell/panel path instead of inventing a radio-only container.
- Kept console grammar, radio store ownership, and runtime playback ownership intact while only adding the narrow visibility, transport, seek, and reload seams the toolbar actually needs.
- Preserved the existing fallback and SoundCloud runtime paths instead of replacing them during the UI pass.

#### Summary of Implementation
- Extended `src/app/store/audioSamplerStore.ts` with canonical toolbar visibility state, live radio transport state, seek requests, and reload requests.
- Extended the `Radio` staged console scope in `src/app/console/stagedNavigation.ts` with `OpenToolbar` / `CloseToolbar` and wired those actions through `src/app/console/ConsoleDock.tsx`.
- Added toolbar-aware semantic ids in `src/app/console/radioCommandIdentity.ts` so the new console radio actions stay inside the same canonical command-identity family.
- Finished the runtime control bridge by exposing transport readback and seek support through `src/runtime/audio/SoundCloudWidgetClient.ts`, `src/runtime/audio/AudioEngine.ts`, and the app-level radio effects in `src/app/AppShell.tsx`.
- Shipped the visible hosted toolbar in `src/app/panels/RadioPanel.tsx`, mounted it from `AppShell`, and added panel-specific styling in `src/app/theme/v15Theme.css`.
- Added and updated focused regressions covering store state, staged grammar, console toolbar commands, radio identities, the visible panel, and app-shell/runtime integration.

#### Files Changed
- `src/app/store/audioSamplerStore.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/radioCommandIdentity.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/runtime/audio/SoundCloudWidgetClient.ts`
- `src/runtime/audio/AudioEngine.ts`
- `src/app/AppShell.tsx`
- `src/app/panels/RadioPanel.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/store/audioSamplerStore.test.ts`
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/radioCommandIdentity.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/runtime/audio/AudioEngine.test.ts`
- `src/app/AppShell.test.tsx`
- `src/app/panels/RadioPanel.test.tsx`
- `docs/Human-Plans/Architecture/Radio.md`

#### Behavior Changes (if any)
- `Radio` now exposes `OpenToolbar` / `CloseToolbar` in the console scope, with aliases `OT` and `CT`.
- The radio toolbar shows live source URL, runtime/source status, current time, duration, a seekable `ParaSlider` when the source supports seeking, sample burst time, and reload/randomize/on/off controls.
- The app now keeps live transport state in sync while the toolbar is open and routes toolbar seek/reload actions through the same canonical runtime bridge used by console-driven radio playback.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/panels/RadioPanel.test.tsx src/app/store/audioSamplerStore.test.ts src/app/console/stagedNavigation.test.ts src/app/console/radioCommandIdentity.test.ts src/app/console/ConsoleDock.test.tsx src/runtime/audio/AudioEngine.test.ts src/app/AppShell.test.tsx`.
- Confirmed the focused Phase 7 radio suite passed with `171` tests green.
- Ran `cmd /c npm run build`.
- Confirmed the full `tsc -b && vite build` path completed successfully.

<!-- ENTRY 502 -->
### [502] - 2026-03-20 15:14 - `VR - Phase 6 - Build Fixes For Sketch Plane Session Shape`
<!-- ENTRY 502 -->
HUMAN SUMMARY: `Cleared the current production build break by removing one dead local in the sketch-plane store command path and updating the stale sketch-plane session fixture in `useAppStore.test.ts` to match the current session type. This brings `npm run build` back to green after the recent radio / sketch-plane work.` 

#### Scope / Constraints Honored
- Kept the fix limited to the two concrete TypeScript failures from the reported build output.
- Did not change runtime behavior beyond removing an unused local and correcting the test fixture shape.

#### Summary of Implementation
- Removed the unused `snapSession` local from the `move-snap` sketch-plane command path in `src/app/spaghetti/store/useSpaghettiStore.ts`.
- Updated the `SketchPlanePickSession` fixture in `src/app/store/useAppStore.test.ts` to include `adjustScope`, `activeTransformAxis`, `previewPlane`, and `transformCommandOrigin`.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/store/useAppStore.test.ts`

#### Behavior Changes (if any)
- No intended runtime behavior change.
- The repo now builds successfully through the full `tsc -b && vite build` path again.

#### Verification Steps
- Ran `npm run build`.
- Confirmed the full TypeScript build and Vite production build completed successfully.

<!-- ENTRY 501 -->
### [501] - 2026-03-20 15:12 - `VR - Phase 6 - Sketch Plane Feature Assist Radio Coverage`
<!-- ENTRY 501 -->
HUMAN SUMMARY: `Extended the radio identity and burst wiring through the sketch-plane feature-assist path, so the `XY/XZ/YZ` plane picker and the deeper sketch-plane assist scopes now publish radio bursts the same way the staged console menus already do. This closes the gap where radio preview stopped once the console left staged navigation and entered sketch-plane assist mode.` 

#### Scope / Constraints Honored
- Kept the fix inside the console radio resolver and sketch-plane assist submit/preview wiring.
- Preserved the existing staged-navigation radio behavior and alias grammar.
- Added focused regressions for sketch-plane feature-assist preview and submit identities.

#### Summary of Implementation
- Added `featureAssistChoice` and `featureAssistSubmit` semantic identity paths in `src/app/console/radioCommandIdentity.ts`.
- Mapped sketch-plane assist scopes for plane selection, move, move snap, rotate, rotate snap, and sketch-draw assist choices onto canonical radio identities.
- Updated `src/app/console/ConsoleDock.tsx` so arrow-preview bursts and submit bursts also resolve from the active feature-assist descriptor when the console is inside sketch-plane assist mode.
- Added resolver coverage in `src/app/console/radioCommandIdentity.test.ts`.
- Added an end-to-end console regression in `src/app/console/ConsoleDock.test.tsx` proving radio bursts fire for sketch-plane `XY/XZ/YZ` preview/submit and continue working in the deeper sketch-plane adjust scope.

#### Files Changed
- `src/app/console/radioCommandIdentity.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/radioCommandIdentity.test.ts`
- `src/app/console/ConsoleDock.test.tsx`

#### Behavior Changes (if any)
- With radio on, `ArrowUp` / `ArrowDown` now preview sketch-plane assist choices such as `XY`, `XZ`, `YZ`, and the later sketch-plane adjust choices.
- Submitting sketch-plane assist commands now publishes the corresponding radio burst request instead of going silent in that branch.

#### Verification Steps
- Ran `npx vitest run src/app/console/radioCommandIdentity.test.ts src/app/console/ConsoleDock.test.tsx`.
- Confirmed `97` focused console tests passed after the sketch-plane feature-assist radio wiring landed.

<!-- ENTRY 500 -->
### [500] - 2026-03-20 14:58 - `VR - Phase 6 - Radio Alias Cleanup`
<!-- ENTRY 500 -->
HUMAN SUMMARY: `Cleaned up the `Radio` staged-menu shorthand so the shorter aliases now read more naturally in use: `O` for `On`, full `off` for `Off`, `U` for `Url`, `SB` for `SampleBurstTime`, and `RS` for `RandomizeSampleTimes`. This keeps the canonical commands unchanged while tightening the actual console tokens the user types in the radio scope.` 

#### Scope / Constraints Honored
- Kept the change inside the staged console grammar for the `Radio` scope only.
- Preserved the existing canonical radio command names and action ids.
- Added a focused grammar regression for the cleaned alias set.

#### Summary of Implementation
- Removed the older single-letter `Off` alias.
- Changed the `SampleBurstTime` alias from `SBT` to `SB`.
- Changed the `RandomizeSampleTimes` alias from `RST` to `RS`.
- Added staged-navigation assertions proving `o`, `off`, `u`, `sb`, and `rs` all resolve to the intended radio actions.

#### Files Changed
- `src/app/console/stagedNavigation.ts`
- `src/app/console/stagedNavigation.test.ts`

#### Behavior Changes
- Inside `Radio`, the cleaned shorthand now is:
  - `O` -> `On`
  - `off` -> `Off`
  - `U` -> `Url`
  - `SB` -> `SampleBurstTime`
  - `RS` -> `RandomizeSampleTimes`

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/app/console/stagedNavigation.test.ts"`

<!-- ENTRY 499 -->
### [499] - 2026-03-20 14:56 - `VR - Phase 6 - Graph Execute Choice Preview Identity Fix`
<!-- ENTRY 499 -->
HUMAN SUMMARY: `Fixed another console-radio preview gap by teaching the staged-choice identity resolver about the execute-style graph menu items such as \`Collapsed\`, \`Essentials\`, \`Expanded\`, \`References\`, \`Open\`, and \`Build\`. Those items already existed as real graph actions, but their highlighted preview path returned no radio identity, so some graph-menu arrow cycles stayed silent even when the earlier items played correctly.` 

#### Scope / Constraints Honored
- Kept the fix inside the semantic radio command-identity resolver.
- Did not reopen the runtime audio bridge or console arrow-key plumbing.
- Focused on highlighted staged-choice preview identities only.

#### Summary of Implementation
- Extended `radioCommandIdentity.ts` so `graphSelected` staged-choice preview now resolves:
  - `References`
  - `Collapsed`
  - `Essentials`
  - `Expanded`
  - `Open`
  - `Build`
- Added identity regressions proving at least the missing `Collapsed` and `Build` cases now resolve to canonical radio identities.

#### Files Changed
- `src/app/console/radioCommandIdentity.ts`
- `src/app/console/radioCommandIdentity.test.ts`

#### Behavior Changes
- Cycling through execute-style items in the `Graph` menu now publishes real radio burst identities instead of staying silent for unmapped choices like `Collapsed`.

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/app/console/radioCommandIdentity.test.ts src/app/console/ConsoleDock.test.tsx"`

<!-- ENTRY 498 -->
### [498] - 2026-03-20 14:55 - `VR - Phase 6 - Guided Arrow Preview Burst Fix`
<!-- ENTRY 498 -->
HUMAN SUMMARY: `Fixed the console radio preview path so pressing \`ArrowUp\` or \`ArrowDown\` inside the focused console input now triggers the same radio burst behavior as the older global staged-navigation path. This closes the live bug where the highlighted choice changed visually but no sound played because the input-owned arrow-key handler only cycled choices without publishing a burst request.` 

#### Scope / Constraints Honored
- Kept the fix inside the guided console-input path and did not reopen the broader trigger/runtime design.
- Reused the existing burst-aware staged-choice callback already present in `ConsoleDock`.
- Added a regression that exercises the real input element instead of only dispatching synthetic window-level key events.

#### Summary of Implementation
- Extended `ConsoleBar.tsx` with one optional guided-choice cycle callback prop.
- Updated `ConsoleDock.tsx` so all console surfaces now route guided input arrow cycling through the existing burst-aware `cycleStagedChoiceWithRadioBurst(...)` path.
- Added a focused `ConsoleDock` regression proving that `ArrowUp` and `ArrowDown` dispatched from the actual `.ConsoleInput` element publish radio burst requests when radio is enabled.

#### Files Changed
- `src/app/console/ConsoleBar.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleDock.test.tsx`

#### Behavior Changes
- Pressing `ArrowUp` / `ArrowDown` in the focused guided console input now plays the next highlighted radio sample instead of only moving the highlighted choice silently.
- The older window-level staged arrow-preview behavior remains intact.

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/app/console/ConsoleDock.test.tsx src/app/console/useConsoleStore.test.ts src/app/store/audioSamplerStore.test.ts"`

<!-- ENTRY 497 -->
### [497] - 2026-03-20 14:49 - `VR - Phase 6 - SoundCloud Ready Timeout And Autoplay Permission`
<!-- ENTRY 497 -->
HUMAN SUMMARY: `Fixed another real-link failure path in the SoundCloud radio bridge by preventing widget source preparation from hanging forever and by explicitly granting autoplay permission to the hidden SoundCloud iframe. This means the runtime can now fail over more honestly when the widget never becomes ready, instead of getting stuck in a silent loading state.` 

#### Scope / Constraints Honored
- Kept the patch inside the existing SoundCloud runtime bridge and app-shell host.
- Preserved the earlier preload, playback-confirmation, and generated-tone fallback behavior.
- Focused only on the remaining no-sound hang path instead of widening into toolbar work or console redesign.

#### Summary of Implementation
- Updated `SoundCloudWidgetClient.ts` so `ensureSourceReady(...)` now waits for:
  - widget `READY`
  - widget `ERROR`
  - or a hard timeout
- This removes the old indefinite-wait path where the widget could stay silent forever and never reach the later fallback logic.
- Updated the hidden SoundCloud iframe in `AppShell.tsx` to use `allow="autoplay"` so the embedded player has explicit autoplay permission when the widget attempts real-link playback.

#### Files Changed
- `src/runtime/audio/SoundCloudWidgetClient.ts`
- `src/app/AppShell.tsx`

#### Behavior Changes
- Supported SoundCloud source preparation now times out instead of hanging forever.
- The runtime can now move on to honest failure/fallback behavior when the widget never becomes ready.
- The hidden SoundCloud host iframe now advertises autoplay permission explicitly.

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/runtime/audio/ClipLibrary.test.ts src/runtime/audio/TimelineTransport.test.ts src/runtime/audio/AudioEngine.test.ts src/app/store/audioSamplerStore.test.ts src/app/console/radioCommandIdentity.test.ts src/app/console/ConsoleDock.test.tsx src/app/AppShell.test.tsx"`

<!-- ENTRY 496 -->
### [496] - 2026-03-20 14:47 - `VR - Phase 6 - SoundCloud Warmup And Playback Confirmation`
<!-- ENTRY 496 -->
HUMAN SUMMARY: `Tightened the SoundCloud radio bridge so the app no longer trusts a bare widget \`play()\` call as proof of audible playback. The runtime now preloads supported SoundCloud sources when radio is enabled, warms the bridge from the console enable flow, and waits for a real widget play/progress signal before treating the link path as successful.` 

#### Scope / Constraints Honored
- Kept the follow-up inside the existing Phase 6 runtime/audio seam instead of widening into toolbar work.
- Preserved the existing console trigger model and the generated-tone fallback path.
- Focused the patch on real-link reliability rather than redesigning radio state or UI.

#### Summary of Implementation
- Added one shared runtime warmup seam in `radioRuntimeWarmup.ts` so console `On` and URL-submit flows can request eager SoundCloud preparation.
- Updated `ConsoleDock.tsx` to request runtime warmup when radio is turned on or when a new radio URL is accepted.
- Updated `AppShell.tsx` to:
  - register the warmup handler
  - preload supported SoundCloud sources when radio becomes enabled
  - keep the later burst path as the canonical status-reporting path
- Tightened `SoundCloudWidgetClient.ts` so `playWindow(...)` now waits for a real SoundCloud widget `PLAY` / `PLAY_PROGRESS` signal, and times out instead of silently pretending playback started.
- Updated `AppShell` test expectations to account for the eager-preload pass before the burst playback call.

#### Files Changed
- `src/runtime/audio/SoundCloudWidgetClient.ts`
- `src/runtime/audio/radioRuntimeWarmup.ts`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/console/ConsoleDock.tsx`

#### Behavior Changes
- Turning radio on now eagerly prepares supported SoundCloud playback before the first later burst request.
- The real-link path now waits for actual widget playback confirmation instead of marking `ready` immediately after `play()`.
- If the widget stays silent, the runtime can now fall back more honestly instead of reporting a false success state.

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/runtime/audio/ClipLibrary.test.ts src/runtime/audio/TimelineTransport.test.ts src/runtime/audio/AudioEngine.test.ts src/app/store/audioSamplerStore.test.ts src/app/console/radioCommandIdentity.test.ts src/app/console/ConsoleDock.test.tsx src/app/AppShell.test.tsx"`

<!-- ENTRY 495 -->
### [495] - 2026-03-20 14:41 - `VR - Phase 6 - Radio On Transcript State Readout`
<!-- ENTRY 495 -->
HUMAN SUMMARY: `Updated the console radio-on transcript so enabling radio now immediately prints the active URL, the current sample burst time, and the on confirmation before returning to root. This keeps the `On` action lightweight while making the active radio state visible at the moment the user enables it.` 

#### Scope / Constraints Honored
- Kept the change limited to the `radio.on` console execute transcript path.
- Preserved the existing `On` behavior of enabling radio, requesting playback, and returning to root.
- Reused the canonical radio state already stored in `audioSamplerStore` instead of duplicating console-only state.

#### Summary of Implementation
- Updated `ConsoleDock.tsx` so `radio.on` now reads the post-enable radio state and appends:
  - `Radio on`
  - `Radio url: ...`
  - `Sample burst time: ...`
- Extended the existing `radio.on` console regression to assert the new transcript lines alongside the existing root-return behavior.

#### Files Changed
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleDock.test.tsx`

#### Behavior Changes
- Accepting `On` from the `Radio` scope now prints the active radio URL and current sample burst time in the transcript before the existing `Returned to root` readout.
- `Off` behavior is unchanged.

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/app/console/ConsoleDock.test.tsx src/app/store/audioSamplerStore.test.ts"`

<!-- ENTRY 494 -->
### [494] - 2026-03-20 14:40 - `VR - Phase 6 - Real Link Playback Bridge`
<!-- ENTRY 494 -->
HUMAN SUMMARY: `Implemented the Phase 6 radio real-link bridge by teaching the runtime to resolve supported SoundCloud URLs, adding a SoundCloud widget playback path beside the generated-tone fallback, and surfacing unsupported custom links as explicit runtime state. The default \`Gusano\` link can now drive a real provider-backed playback path, while the app still falls back honestly if SoundCloud playback is unavailable in the current environment.` 

#### Scope / Constraints Honored
- Kept the console trigger system unchanged and limited the work to runtime/audio, app-bridge, and status/reporting seams.
- Added one provider-aware real-link family first instead of pretending arbitrary URLs are generically supported.
- Preserved the existing generated-tone bridge as an explicit fallback safety net instead of deleting it.

#### Summary of Implementation
- Extended `ClipLibrary.ts` so radio URLs now resolve into:
  - `soundcloud-widget` for supported SoundCloud links
  - `unsupported-url` for unsupported custom links
  - explicit generated-tone fallback descriptors when the runtime needs to degrade honestly
- Added `SoundCloudWidgetClient.ts` as the browser-side SoundCloud widget bridge and expanded `AudioEngine.ts` so it can execute either:
  - generated-tone Web Audio bursts
  - SoundCloud widget burst windows
- Updated `AppShell.tsx` to:
  - host a hidden SoundCloud iframe bridge
  - route supported links through the real-link path
  - mark unsupported custom links explicitly
  - fall back to generated tone with visible status if SoundCloud playback fails at runtime
- Extended runtime status typing in `audioSamplerStore.ts` for:
  - `unsupported`
  - `soundcloud-widget`
  - `unsupported-url`
- Added focused tests for source classification, real-link engine playback, unsupported-url status, and runtime fallback behavior.

#### Files Changed
- `src/runtime/audio/ClipLibrary.ts`
- `src/runtime/audio/ClipLibrary.test.ts`
- `src/runtime/audio/SoundCloudWidgetClient.ts`
- `src/runtime/audio/AudioEngine.ts`
- `src/runtime/audio/AudioEngine.test.ts`
- `src/app/store/audioSamplerStore.ts`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`

#### Behavior Changes
- The default `https://soundcloud.com/keota-us/gusano` radio URL now resolves to a real SoundCloud playback path instead of always mapping straight to the generated beep source.
- Unsupported custom URLs now report `unsupported` / `unsupported-url` runtime state instead of silently pretending to play.
- If SoundCloud runtime playback is unavailable, the app now degrades visibly to the generated-tone fallback instead of going silent.
- The generated-tone path remains intact and reusable as the explicit safety net.

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/runtime/audio/ClipLibrary.test.ts src/runtime/audio/AudioEngine.test.ts src/app/store/audioSamplerStore.test.ts src/app/AppShell.test.tsx"`
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/runtime/audio/ClipLibrary.test.ts src/runtime/audio/TimelineTransport.test.ts src/runtime/audio/AudioEngine.test.ts src/app/store/audioSamplerStore.test.ts src/app/console/radioCommandIdentity.test.ts src/app/console/ConsoleDock.test.tsx src/app/AppShell.test.tsx"`

<!-- ENTRY 493 -->
### [493] - 2026-03-20 14:25 - `VR - [4.1O3] Runtime Source Bridge`
<!-- ENTRY 493 -->
HUMAN SUMMARY: `Implemented the Phase 5 radio playback bridge by filling the empty runtime-audio seams, adding one app-level subscriber in \`AppShell\`, and making console burst requests audible through a fallback generated clip source. The radio now has a real runtime path from \`requestRadioBurst(...)\` to actual playback, with lightweight runtime status reporting for fallback, blocked, and error cases instead of silent no-op behavior.` 

#### Scope / Constraints Honored
- Kept the first audible bridge inside the app/runtime layer instead of moving playback into `ConsoleDock`.
- Used an honest fallback local/generated source path instead of claiming full direct SoundCloud control.
- Kept the work narrow to one source bridge, one runtime subscriber, and one playback engine contract.

#### Summary of Implementation
- Filled the empty runtime audio placeholders with real first-pass implementations:
  - `ClipLibrary.ts`
  - `TimelineTransport.ts`
  - `SamplerKeys.ts`
  - `AudioEngine.ts`
- Added runtime-facing radio status to `audioSamplerStore`, including:
  - `radioRuntimeStatus`
  - `radioRuntimeMessage`
  - `radioRuntimeSourceKind`
  - `lastHandledBurstRequestId`
- Added one app-level runtime consumer in `AppShell` that observes new `latestBurstRequest` ids, resolves the active source through the clip library, and plays bursts through the audio engine.
- Implemented fallback generated-tone playback so the default `Gusano` URL and custom URLs both have an honest first audible bridge while still reporting fallback mode.
- Added focused tests for burst-window timing math, audio-engine burst playback, store runtime-status tracking, and app-level request consumption.

#### Files Changed
- `src/runtime/audio/SamplerKeys.ts`
- `src/runtime/audio/ClipLibrary.ts`
- `src/runtime/audio/TimelineTransport.ts`
- `src/runtime/audio/AudioEngine.ts`
- `src/runtime/audio/TimelineTransport.test.ts`
- `src/runtime/audio/AudioEngine.test.ts`
- `src/app/store/audioSamplerStore.ts`
- `src/app/store/audioSamplerStore.test.ts`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`

#### Behavior Changes
- Radio burst requests now have a real runtime consumer and can produce audible output through a fallback generated source.
- The app now reports radio runtime state as `loading`, `fallback`, `blocked`, or `error` instead of silently doing nothing when playback cannot proceed normally.
- New burst requests are consumed once by request id, so the same request does not replay on every render.
- Turning radio off stops the runtime bridge from treating the session as active and resets runtime status back to `idle`.

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/runtime/audio/TimelineTransport.test.ts src/runtime/audio/AudioEngine.test.ts src/app/store/audioSamplerStore.test.ts src/app/console/radioCommandIdentity.test.ts src/app/console/ConsoleDock.test.tsx src/app/AppShell.test.tsx"`

<!-- ENTRY 492 -->
### [492] - 2026-03-20 14:15 - `VR - [4.1O3] Radio On Off Return To Root`
<!-- ENTRY 492 -->
HUMAN SUMMARY: `Fixed the console radio flow so accepting \`On\` or \`Off\` now exits the \`Radio\` scope and returns cleanly to root instead of leaving the user inside the radio menu. The root prompt is restored after the action, and the focused radio trigger-wiring tests still pass.` 

#### Scope / Constraints Honored
- Kept the change limited to the staged `radio.on` / `radio.off` execute path in `ConsoleDock`.
- Preserved the existing `RandomizeSampleTimes` behavior inside the `Radio` scope.
- Kept the recent Phase 4 burst-request wiring intact while fixing the navigation behavior.

#### Summary of Implementation
- Changed the `radio.on` and `radio.off` execute branch so those actions now:
  - clear the staged radio session
  - clear the input text
  - append `Returned to root`
  - append the root prompt `Root > Choose next [Graph, Radio]`
- Left `radio.randomizeSampleTimes` in the `Radio` scope as before.
- Added focused console regressions proving both `On` and `Off` now return to root after submit.

#### Files Changed
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleDock.test.tsx`

#### Behavior Changes
- Accepting `On` from the `Radio` scope now enables radio and returns the console to root.
- Accepting `Off` from the `Radio` scope now disables radio and returns the console to root.
- The root-return transcript now matches the existing console pattern used elsewhere.

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/app/store/audioSamplerStore.test.ts src/app/console/radioCommandIdentity.test.ts src/app/console/ConsoleDock.test.tsx"`

<!-- ENTRY 491 -->
### [491] - 2026-03-20 14:10 - `VR - [4.1O3] Radio 3 - Console Trigger Wiring`
<!-- ENTRY 491 -->
HUMAN SUMMARY: `Implemented the Phase 4 radio trigger-wiring pass by adding one transient burst-request seam to the radio sampler store and routing accepted console submits plus staged \`ArrowUp\` / \`ArrowDown\` preview changes through it. The console now publishes canonical radio burst requests with semantic command identities, stable sample positions, current source URL, and burst duration, while \`Off\` stays a real silence gate because disabled radio no longer emits requests.`

#### Scope / Constraints Honored
- Kept the work inside the console trigger-wiring seam and did not widen into real browser-audio or SoundCloud playback.
- Reused the canonical radio command-identity system from `[4.1O2]` instead of introducing highlight-only ids or raw key-based mapping.
- Preserved the existing staged console, prompt, and assist behavior while making only the intended trigger boundaries audible.

#### Summary of Implementation
- Extended `audioSamplerStore` with one narrow transient `requestRadioBurst(...)` contract plus `latestBurstRequest` state, so later playback work can consume radio burst intent without reopening console routing policy.
- Rewired `ConsoleDock` so accepted console outcomes now publish burst requests for:
  - valid radio prompt submits
  - staged advances
  - staged executes
  - valid flat commands
- Added arrow-preview burst wiring so staged `ArrowUp` and `ArrowDown` now resolve the newly highlighted staged choice through the semantic radio command-identity helper and publish `arrowUp` / `arrowDown` burst requests when radio is enabled.
- Extended `radioCommandIdentity.ts` with one `stagedChoice` path so highlighted choices like `On`, `Sketch`, and `Sketch Plane` reuse the same semantic identity family as accepted command outcomes.
- Added focused tests for disabled-radio request suppression, enabled burst-request payloads, canonical highlighted-choice identity resolution, prompt-submit burst publication, and staged arrow-preview trigger behavior.

#### Files Changed
- `src/app/store/audioSamplerStore.ts`
- `src/app/store/audioSamplerStore.test.ts`
- `src/app/console/radioCommandIdentity.ts`
- `src/app/console/radioCommandIdentity.test.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleDock.test.tsx`

#### Behavior Changes
- Accepted console submits can now publish one canonical radio burst request carrying:
  - `commandIdentity`
  - `samplePosition`
  - `sourceUrl`
  - `sampleBurstTime`
  - `triggerKind`
- Staged `ArrowUp` and `ArrowDown` now publish preview burst requests for the newly highlighted staged choice when radio is enabled.
- Turning radio off now suppresses console burst requests without clearing the session-stable command-to-sample mapping.
- Selecting `Url` prompt submit can now turn radio on and immediately publish a burst request for `Console.Radio.Url.PromptSubmit`.

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/app/store/audioSamplerStore.test.ts src/app/console/radioCommandIdentity.test.ts src/app/console/ConsoleDock.test.tsx"`

<!-- ENTRY 487 -->
### [487] - 2026-03-20 13:56 - `VR - [4.1O2] Command Identity Template System`
<!-- ENTRY 487 -->
HUMAN SUMMARY: `Implemented the Phase 3 radio command-identity pass by replacing the old ad hoc \`staged:/prompt:/flat:/invalid:\` sampler keys with one canonical console command-identity resolver seam. The radio sampler store now receives semantic identities like \`Console.Root.Radio\` and \`Console.Radio.Url.PromptSubmit\`, so aliases collapse cleanly, prompt submits no longer depend on literal entered values, and the session-stable mapping has a real contract for later trigger wiring.`

#### Scope / Constraints Honored
- Kept the work inside the Phase 3 identity/template seam and did not widen it into playback or browser-audio wiring.
- Reused the existing `audioSamplerStore.ensureSamplePosition(...)` mapping seam instead of inventing a second allocation system.
- Avoided tracking invalid prompt values or unknown flat commands as first-class sampler identities in this pass.

#### Summary of Implementation
- Added a dedicated console-side resolver in `src/app/console/radioCommandIdentity.ts` that maps valid console outcomes onto canonical semantic identities for:
  - root commands
  - staged graph/radio actions
  - prompt submits
  - flat command names
- Rewired `ConsoleDock` so radio sampler tracking now goes through that resolver instead of inline transitional strings like `staged:...`, `prompt:...`, `flat:...`, and `invalid:...`.
- Changed prompt-submit tracking so valid `Url` and `SampleBurstTime` submits allocate canonical identities like `Console.Radio.Url.PromptSubmit` without depending on the literal submitted URL or float text.
- Kept `audioSamplerStore` as the owner of stable identity-to-sample-position mapping, and updated store tests to use canonical identity examples instead of the old temporary flat-key style.
- Added focused tests that prove the resolver output, canonical key usage in the real radio URL flow, and prompt-submit identity stability across multiple submitted values.

#### Files Changed
- `src/app/console/radioCommandIdentity.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/radioCommandIdentity.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/store/audioSamplerStore.test.ts`

#### Behavior Changes
- The radio sampler mapping now stores canonical semantic identities such as `Console.Root.Radio`, `Console.Radio.Url`, and `Console.Radio.Url.PromptSubmit` instead of temporary internal key formats.
- Aliases and equivalent command outcomes now collapse onto the same mapping key because tracking happens after command normalization rather than on raw user text.
- Valid prompt submits keep one stable sampler identity even when the entered URL text changes between submits.
- Invalid prompt submits and unknown flat commands no longer create first-class sampler mapping entries in this phase.

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/app/console/radioCommandIdentity.test.ts src/app/store/audioSamplerStore.test.ts src/app/console/ConsoleDock.test.tsx"`
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/app/console/stagedNavigation.test.ts src/app/console/useConsoleStore.test.ts"`

<!-- ENTRY 486 -->
### [486] - 2026-03-20 13:26 - `VR - [4.1O1] Radio 1 - Console Radio Grammar And Scope`
<!-- ENTRY 486 -->
HUMAN SUMMARY: `Implemented the first console-radio slice by adding a real \`Root > Radio\` staged branch, radio prompt handling for \`Url\` and \`SampleBurstTime\`, and a session-stable radio sampler state store. This ships the console grammar/state side of \`[4.1O1]\` now, while leaving actual SoundCloud playback for the later playback-bridge cut.`

#### Scope / Constraints Honored
- Kept the implementation inside the console-first radio seam instead of widening into browser audio playback.
- Preserved the existing staged-console and feature-assist behavior for graph, sketch, and transcript flows.
- Added session-stable radio sample-position mapping without requiring manual per-command assignment.

#### Summary of Implementation
- Extended staged console navigation so root now exposes `Graph` and `Radio`, and added the `Radio` scope actions `On`, `Off`, `Url`, `SampleBurstTime`, and `RandomizeSampleTimes`.
- Added a narrow console prompt-session seam so `Url` and `SampleBurstTime` can prefill a suggested value, accept typed override input, validate on submit, and return cleanly to the `Radio` scope on success or `Esc`.
- Added `audioSamplerStore` with default radio settings, radio on/off/url state, sample-burst-time state, `RandomizeSampleTimes`, and session-stable command-to-sample-position assignment.
- Wired the console submit/cancel flow so radio actions write transcript feedback, restore the staged radio menu, and keep the root prompt updated as `Root > Choose next [Graph, Radio]`.

#### Files Changed
- `src/app/console/stagedNavigation.ts`
- `src/app/console/useConsoleStore.ts`
- `src/app/console/ConsoleBar.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/store/audioSamplerStore.ts`
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/useConsoleStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/store/audioSamplerStore.test.ts`

#### Behavior Changes
- Typing `r` / `radio` at console root now enters the staged `Radio` branch instead of the old flat `rotate` alias path; flat `rotate` still remains available by its full command token.
- `Radio > Url` now opens a guided prompt seeded with the current/default SoundCloud URL and valid submission turns radio on with that URL.
- `Radio > SampleBurstTime` now opens a guided prompt seeded with the current float value and valid submission stores the new burst time before returning to `Radio`.
- `RandomizeSampleTimes` now resets the current session’s stable command-to-sample mapping and reports that refresh in the transcript.
- Actual SoundCloud playback is still not wired in this entry; this patch only ships the console grammar/state/template side.

#### Verification Steps
- Ran `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx vitest run src/app/console/stagedNavigation.test.ts src/app/console/useConsoleStore.test.ts src/app/store/audioSamplerStore.test.ts src/app/console/ConsoleDock.test.tsx"`
- Attempted `cmd /c "cd /d c:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook && npx tsc --noEmit ..."` for changed-file typechecking, but the repo currently has pre-existing TypeScript blockers outside this radio patch, including `src/app/references/referenceManifest.ts` and `src/app/spaghetti/store/useSpaghettiStore.ts`

<!-- ENTRY 485 -->
### [485] - 2026-03-20 00:25 - `SK - [3.2B-S1] Sketch Session Hierarchy Model`
<!-- ENTRY 485 -->
HUMAN SUMMARY: `Implemented the first real `[3.2B-S1]` sketch hierarchy cleanup by making `SketchDraw` expose an explicit idle/tool/draft state seam instead of auto-arming `Line` on session start. This gives the sketch system a named hierarchy that later `Esc`, `Back`, and toolbar/console cleanup phases can build on without relying on fake default-tool assumptions.`

#### Scope / Constraints Honored
- Kept the change focused on the sketch hierarchy state seam, not a broad command-routing rewrite.
- Preserved the selected sketch node as the parent scope and kept `SketchPlane` on its existing two-level seam.
- Avoided widening the pass into `[3.2B-S4]`, `[3.2B-S2]`, `[3.2B-S3]`, or toolbar/console alignment work beyond the reader updates required by the new session shape.

#### Summary of Implementation
- Added an explicit `drawStage` seam to `GeometrySketchSession` and allowed `activeTool: null` so draw sessions can exist honestly in an idle state.
- Removed the old default-`line` assumption for fresh draw sessions and updated draft-cancel behavior to step back to idle instead of relying on an implicit armed tool.
- Updated the viewer bridge, viewer host, viewport overlay, and console status reads so idle draw sessions no longer silently coerce back to `line`.
- Tightened the sketch architecture doc so `[3.2B-S1] - Sketch Session Hierarchy Model` now matches the shipped hierarchy state seam.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/viewerBridge.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/viewer/geometrySketchOverlay.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/viewer/geometrySketchOverlay.test.ts`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Fresh `SketchDraw` sessions now open idle with no selected tool instead of auto-starting in `Line`.
- `SketchDraw` now exposes explicit `sessionIdle`, `toolSelected`, and `draftActive` depth through store state.
- Readers that display sketch-draw state now report idle honestly instead of treating idle as implicit `Line`.

#### Verification Steps
- `npm.cmd test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `npm.cmd test -- src/app/console/ConsoleDock.test.tsx`
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx src/viewer/geometrySketchOverlay.test.ts`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 486 -->
### [486] - 2026-03-20 00:35 - `SP - Phase 9 - SketchPlane Adjust Escape Stepback`
<!-- ENTRY 486 -->
HUMAN SUMMARY: `Cleaned up the first real `SketchPlane` two-level session behavior so `Escape` and typed `esc` now step back from `Adjust` to `Plane Selection` instead of cancelling the whole session. This keeps `SketchPlane` reading like one session with two depths, while preserving the existing full-cancel `X` path and the selected-sketch-node restore handoff on actual exit.`

#### Scope / Constraints Honored
- Kept the change inside the existing single `sketchPlanePickSession` seam.
- Preserved the existing `X` / full cancel path and the current confirm flow into `SketchDraw`.
- Kept the viewport camera-adjust exception intact so touching the viewer still does not collapse the active sketch-plane context.

#### Summary of Implementation
- Changed the sketch-plane overlay keyboard handler so `Escape` now reopens plane selection from `adjust` instead of hard-cancelling the session.
- Added the matching sketch-plane console command behavior so typed `esc` mirrors the same `adjust -> pick` stepback.
- Updated `reopenSketchPlanePickPlaneSelection()` to republish the `Sketch Plane > [XY, XZ, YZ]` prompt so the console surface stays aligned with the restored `pick` stage.
- Added focused store, console, and overlay regressions covering `adjust -> pick` without losing the current draft plane or transform.
- Updated the sketch architecture doc so `[3.2B-S2] - SketchPlane Session Cleanup` now reflects the current shipped two-level session truth.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- While `SketchPlane` is in `adjust`, `Escape` now returns to `Plane Selection` instead of exiting the session.
- Typed console `esc` during active `SketchPlane` now mirrors the same `adjust -> pick` stepback.
- Reopening plane selection now reprints `Sketch Plane > [XY, XZ, YZ]` so the console keeps the correct active prompt.

#### Verification Steps
- `npm.cmd test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `npm.cmd test -- src/app/console/ConsoleDock.test.tsx`
- `npm.cmd test -- src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 488 -->
### [488] - 2026-03-20 00:50 - `SK - [3.2B-S4] Sketch Return One Level`
<!-- ENTRY 488 -->
HUMAN SUMMARY: `Implemented the first shared sketch-local back-step seam so `SketchPlane` and `SketchDraw` now use one real `return one level` action instead of carrying separate parent-step logic in each surface. Keyboard `Escape`, console `back`, and the visible sketch toolbar `Back` actions now route through the same underlying sketch-local behavior while explicit close/exit remains on `X`.`

#### Scope / Constraints Honored
- Kept the change inside sketch-local behavior instead of widening into whole-app back-navigation architecture.
- Preserved the existing sketch session models and explicit exit paths like `X`.
- Reused the already-shipped sketch-plane and sketch-draw level behavior instead of inventing a second session seam.

#### Summary of Implementation
- Added a shared `returnActiveSketchSessionOneLevel()` action to the sketch store.
- Routed active `SketchPlane` and `SketchDraw` console `esc` plus visible `back / b` through that same shared action.
- Added sketch-draw keyboard `Escape` handling in the viewport overlay and switched sketch-plane keyboard `Escape` over to the same shared seam.
- Added visible `Back` title-bar actions for sketch-plane and sketch-draw toolbars, with draw-idle back disabled so the control does not present a misleading no-op.
- Tightened the sketch architecture doc so `[3.2B-S4] - Sketch Return One Level` now matches the shipped shared-return seam.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`

<!-- ENTRY 489 -->
### [489] - 2026-03-20 01:16 - `CS - [4.1N] Feature Session Prompt Descriptors`
<!-- ENTRY 489 -->
HUMAN SUMMARY: `Extended the console’s assisted staged-choice seam into active feature sessions so `Sketch Plane` and idle `Sketch Draw` can publish one shared prompt descriptor for prompt rendering, input prefill, targeted choice tracking, arrow cycling, and manual-typing override without relying on feature-local input seeding.`

#### Why
- The staged-choice prefill/cycling work in `[4.1M]` solved assisted choice handling only for staged navigation.
- Active feature sessions were still pushing hardcoded transcript prompt text and relying on one-off input seeding behavior.
- `Sketch Plane` and idle `Sketch Draw` are the first constrained feature-session states that need the same assisted prompt treatment as staged scopes.

#### What Changed
- Added shared `ConsoleAssistChoice` and `ConsoleAssistDescriptor` types in the console layer.
- Extended `useConsoleStore` so the console can track either:
  - a staged navigation assist source, or
  - a feature-session assist source
- Kept staged navigation higher priority, but added feature-assist fallback when no staged session is active.
- Added stale-assist cleanup so old feature-prefill tokens do not linger after the constrained feature prompt disappears.
- Updated `ConsoleBar` so feature-session descriptors participate in:
  - summary-strip prompt rendering
  - input prefill
  - `ArrowUp / ArrowDown` cycling
  - first-key manual override
- Updated `ConsoleDock` so:
  - `Sketch Plane` publishes `XY / XZ / YZ`
  - idle `Sketch Draw` publishes `Line / PLine / X`
  - sketch prompt text and feature assist descriptors now come from the same descriptor helpers instead of duplicated hardcoded strings

#### Validation
- `npm.cmd test -- src/app/console/useConsoleStore.test.ts`
- `npm.cmd test -- src/app/console/ConsoleDock.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

#### Files Changed
- `src/app/console/consoleTypes.ts`
- `src/app/console/useConsoleStore.ts`
- `src/app/console/useConsoleStore.test.ts`
- `src/app/console/ConsoleBar.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `docs/Human-Plans/Architecture/Console.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

<!-- ENTRY 490 -->
### [490] - 2026-03-20 09:20 - `SK - [3.2B-S5] Sketch Toolbar / Console Command Alignment`
<!-- ENTRY 490 -->
HUMAN SUMMARY: `Finished the first sketch toolbar/console alignment pass by adding one shared sketch command seam in the store and routing the overlapping `SketchPlane` and `SketchDraw` toolbar actions plus console tokens through those same command verbs instead of leaving duplicate behavior ownership split between `ViewportOverlay` and `ConsoleDock`.`

#### Scope / Constraints Honored
- Kept the change inside sketch-local command ownership instead of widening into a whole-app command registry.
- Reused the existing sketch-session store verbs instead of introducing a second sketch command state model.
- Left non-overlapping sketch actions like `Done`, `Reset Transform`, and `Review Profiles` outside this phase.

#### Summary of Implementation
- Added `runSketchPlaneCommand(...)` and `runGeometrySketchDrawCommand(...)` to the sketch store.
- Mapped overlapping `SketchPlane` commands through that seam:
  - `xy`
  - `xz`
  - `yz`
  - `back`
  - `x`
  - `move`
  - `rotate`
- Mapped overlapping `SketchDraw` commands through that seam:
  - `line`
  - `l`
  - `pline`
  - `pl`
  - `enter`
  - `back`
  - `b`
  - `esc`
  - `x`
- Updated `ConsoleDock` so sketch-local console token handling now delegates to those shared sketch command seams.
- Updated `ViewportOverlay` so overlapping toolbar actions and sketch-session keyboard shortcuts use the same shared sketch command seams.
- Added focused store coverage proving the new command seams drive the same sketch-session mutations as the previous direct calls.

#### Validation
- `npm.cmd test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `npm.cmd test -- src/app/console/ConsoleDock.test.tsx`
- `npm.cmd test -- src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`
- `src/app/console/ConsoleDock.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Chill-Log.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Active sketch sessions now share one sketch-local one-level-return action.
- Console `back` / `b` now works inside active `SketchPlane` and `SketchDraw` sessions.
- Viewport `Escape` now steps `SketchDraw` back through `Draft Active -> Tool Selected -> Session Idle`.
- Sketch-plane and sketch-draw toolbars now expose visible `Back` actions for one-level return.

#### Verification Steps
- `npm.cmd test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `npm.cmd test -- src/app/console/ConsoleDock.test.tsx`
- `npm.cmd test -- src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 487 -->
### [487] - 2026-03-20 00:37 - `SK - [3.2B-S3] SketchDraw Session Cleanup`
<!-- ENTRY 487 -->
HUMAN SUMMARY: `Cleaned up the first real user-facing `SketchDraw` session surface so the console and overlay now describe the explicit idle/tool/draft hierarchy honestly. `SketchDraw` now opens with an idle prompt instead of the stale `Sketch Draw started` message, repeated `Esc` steps back only to idle, and idle `Esc` keeps the draw session open while `x` remains the explicit exit path.`

#### Scope / Constraints Honored
- Kept `geometrySketchSession` as the only `SketchDraw` session model.
- Preserved the existing one-level draft cancel behavior instead of widening into a broader `returnOneLevel()` rewrite.
- Kept `SketchDraw` as a durable child session under the selected sketch node and left explicit exit on `x` / close.

#### Summary of Implementation
- Extended the existing sketch-draw prompt helper so idle draw sessions now publish `Sketch Draw > [Line, PLine, X]` as the real session prompt.
- Removed the stale staged-launch transcript `Sketch Draw started` and let the draw prompt surface speak for the active session state.
- Updated console `status` to report the named draw stage directly alongside tool/point/hover status.
- Republished the idle draw prompt when a second cancel steps `Tool Selected -> Session Idle`, keeping the console aligned with the durable draw session.
- Updated the sketch architecture doc so `[3.2B-S3] - SketchDraw Session Cleanup` now reflects the shipped console/session truth.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Chill-Log.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Entering `SketchDraw` now prints `Sketch Draw > [Line, PLine, X]` instead of `Sketch Draw started`.
- Returning to draw idle now republishes that idle prompt so the console still reflects the live session.
- Console `status` for `SketchDraw` now reports the named draw stage directly.
- Idle `Esc` leaves the `SketchDraw` session open; explicit exit remains `x` or the close button.

#### Verification Steps
- `npm.cmd test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `npm.cmd test -- src/app/console/ConsoleDock.test.tsx`
- `npm.cmd test -- src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 484 -->
### [484] - 2026-03-20 00:08 - `DBG - Phase 4.1 - Staged Enter Caret Placement Cleanup`
<!-- ENTRY 484 -->
HUMAN SUMMARY: `Adjusted chained staged assisted submission so the console keeps focus after submit but places the caret at the end of the assisted token instead of selecting the full text. This keeps the fast `Enter` chaining while making the input feel less visually heavy.`

#### Scope / Constraints Honored
- Kept the change limited to post-submit caret placement for staged assisted prompts.
- Preserved the staged focus-retention and enter-chaining behavior added in the previous step.

#### Summary of Implementation
- Replaced the post-submit full-text selection with caret placement at the end of the assisted input.
- Updated the staged chained-enter regression test to assert the new caret position.

#### Files Changed
- `src/app/console/ConsoleBar.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- After a staged assisted submit, the next assisted token keeps focus with the caret at the end instead of highlighting the whole token.

#### Verification Steps
- `cmd /c npx vitest run src/app/console/useConsoleStore.test.ts src/app/console/ConsoleDock.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 483 -->
### [483] - 2026-03-20 00:07 - `DBG - Phase 4.1 - Staged Enter Chaining Focus Retention`
<!-- ENTRY 483 -->
HUMAN SUMMARY: `Updated staged assisted submission so the console keeps focus and reselects the next assisted choice after a staged submit. This allows chained flows like `g`, `Enter`, `Enter` to continue directly into the next staged option without manually re-focusing or reselecting the autofilled text.`

#### Scope / Constraints Honored
- Kept the change limited to staged submit focus/selection handoff.
- Preserved normal blur behavior when a submit does not land in another staged assisted prompt.

#### Summary of Implementation
- Changed `ConsoleBar` submit handling to inspect the post-submit console state before deciding whether to blur or keep focus.
- When the next console state is another assisted staged prompt, the input now regains focus and selects the assisted text automatically.
- Added a focused regression test for the `g`, `Enter`, `Enter` chained staged-navigation path.

#### Files Changed
- `src/app/console/ConsoleBar.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Staged assisted prompts can now chain through repeated `Enter` presses without manual re-focus.

#### Verification Steps
- `cmd /c npx vitest run src/app/console/useConsoleStore.test.ts src/app/console/ConsoleDock.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 482 -->
### [482] - 2026-03-20 00:04 - `DBG - Phase 4.1 - Staged Prefill First-Key Override`
<!-- ENTRY 482 -->
HUMAN SUMMARY: `Changed staged assisted prefills so the first real printable key replaces the suggested input instead of appending to it. This lets users immediately override the default staged choice by typing a different token, while preserving staged `Space` submit behavior.`

#### Scope / Constraints Honored
- Kept the change limited to staged assisted input entry behavior.
- Preserved arrow-choice cycling, staged highlighting, and staged `Space` submission.

#### Summary of Implementation
- Updated staged seeded input capture so the first printable key replaces the active assisted prefill when no manual override is active yet.
- Added matching direct-input key handling so typing inside the focused console input follows the same replacement rule.
- Added focused store and console UI coverage for the first-key override behavior.

#### Files Changed
- `src/app/console/useConsoleStore.ts`
- `src/app/console/ConsoleBar.tsx`
- `src/app/console/useConsoleStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- During a staged assisted prefill, the first printable typed key now replaces the suggested option text instead of appending to it.
- Staged `Space` still submits the current assisted choice.

#### Verification Steps
- `cmd /c npx vitest run src/app/console/useConsoleStore.test.ts src/app/console/ConsoleDock.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 481 -->
### [481] - 2026-03-20 00:01 - `DBG - Phase 4.1 - Console Choice Spacing And Equal Split Default`
<!-- ENTRY 481 -->
HUMAN SUMMARY: `Adjusted the collapsed console bar so staged choices have more breathing room between them, and changed the untouched default split to start as an even 50/50 share between the status area and the typed-input area. The divider still takes over with a pixel width once you drag it.`

#### Scope / Constraints Honored
- Kept the change limited to collapsed console bar layout and staged-choice readability.
- Preserved the existing draggable divider behavior after manual resize.

#### Summary of Implementation
- Changed the default summary-width state to use the equal-share layout path until the divider is dragged.
- Updated `ConsoleBar` to render a 50/50 summary/input split by default and keep the current pixel-based split after manual resize.
- Added extra spacing around staged-choice separators so options are easier to scan in the status strip.

#### Files Changed
- `src/app/console/useConsoleStore.ts`
- `src/app/console/ConsoleBar.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The collapsed bar now starts with the status and input sections split evenly by default.
- Staged options in the status strip now have more visual spacing between them.

<!-- ENTRY 480 -->
### [480] - 2026-03-20 00:00 - `DBG - Phase 4.1 - Console Staged Choice Emphasis Styling Cleanup`
<!-- ENTRY 480 -->
HUMAN SUMMARY: `Reduced the visual weight of inactive staged choices in the collapsed console bar so the active choice reads as the clear target. Non-active options now render darker and no longer share the bold emphasis used by the active option.`

#### Scope / Constraints Honored
- Kept the change purely visual inside the collapsed console staged-choice strip.
- Left staged navigation behavior and highlight targeting unchanged.

#### Summary of Implementation
- Updated the inactive staged-choice color and font weight in the console theme.
- Kept the active staged choice at the stronger command color and bold weight.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Inactive staged choices now appear dimmer and no longer look bold.

<!-- ENTRY 479 -->
### [479] - 2026-03-19 23:58 - `DBG - Phase 4.1 - Console Staged Summary Choice Strip Rendering Fix`
<!-- ENTRY 479 -->
HUMAN SUMMARY: `Changed the collapsed console status row from a single truncating text label into a structured prompt-plus-choice strip so `Choose next [...]` options stay visible in the bar and the currently targeted option remains highlighted. The bar now also falls back to parsing prompt transcript lines when it needs to reconstruct the live choice strip from prompt text alone.`

#### Scope / Constraints Honored
- Kept the change limited to collapsed-bar staged summary rendering.
- Preserved existing staged navigation, input prefill, and highlight semantics.
- Added focused UI coverage for the parsed prompt fallback path.

#### Summary of Implementation
- Refactored `ConsoleBar` staged summary rendering into a prefix plus horizontally scrollable choice viewport instead of one truncating summary string.
- Added a parsed prompt fallback so `Choose next [...]` transcript lines can still render as a live choice strip with active-choice highlighting based on the current input token.
- Added a guarded active-choice auto-scroll path for browsers that expose `scrollIntoView`.
- Extended console UI tests to verify visible prompt choices and highlighted fallback rendering.

#### Files Changed
- `src/app/console/ConsoleBar.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/console/ConsoleDock.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The collapsed status row now renders staged options as a visible choice strip instead of collapsing them into a single truncated text node.
- The currently targeted choice stays highlighted in that strip.

#### Verification Steps
- `cmd /c npx vitest run src/app/console/ConsoleDock.test.tsx src/app/console/useConsoleStore.test.ts`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 478 -->
### [478] - 2026-03-19 23:55 - `DBG - Phase 4.1 - Console Bar Summary Width And Divider Resize Cleanup`
<!-- ENTRY 478 -->
HUMAN SUMMARY: `Relaxed the collapsed console bar summary cap so staged status text stays visible longer, and added a draggable vertical divider between the summary and input sections so the split can be adjusted directly in the bar.`

#### Scope / Constraints Honored
- Kept the cleanup narrow to the collapsed console bar layout and resize behavior.
- Preserved the existing staged summary text, input flow, and expand/collapse behavior.
- Added only focused store and UI coverage for the new summary-width state and divider drag path.

#### Summary of Implementation
- Added store-backed console summary width state with clamp limits so the collapsed bar can remember a wider preferred status area.
- Updated `ConsoleBar` to render a vertical separator and drive the bar grid from the preferred summary width instead of the previous hard 280px cap.
- Styled the new divider and widened the default summary track so status text truncates later even before manual adjustment.
- Added focused tests for summary-width clamping and divider dragging.

#### Files Changed
- `src/app/console/useConsoleStore.ts`
- `src/app/console/ConsoleBar.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/console/useConsoleStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The collapsed console bar now shows more status text by default.
- A vertical divider now sits between the summary and input sections and can be dragged left or right to adjust the split.

#### Verification Steps
- `cmd /c npx vitest run src/app/console/useConsoleStore.test.ts src/app/console/ConsoleDock.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 477 -->
### [477] - 2026-03-19 23:48 - `DBG - Phase 4.1 - vi2 Arrow Up Down Cycling And Global Staged Routing`
<!-- ENTRY 477 -->
HUMAN SUMMARY: `Adjusted the new `vi2` staged-choice assist so sibling cycling now uses `ArrowUp` and `ArrowDown` instead of `Left` and `Right`, preserving normal caret movement in the console input while also wiring staged-choice cycling through the app-wide staged-console keyboard path so it works even when the input is not already focused.` 

#### Scope / Constraints Honored
- Kept the change narrow to staged console keyboard behavior and matching focused tests.
- Preserved free typing and normal left/right caret movement inside the input.
- Avoided broader command-entry or transcript redesign.

#### Summary of Implementation
- Updated staged input handling in `ConsoleBar` so active staged sessions use `ArrowUp` / `ArrowDown` for sibling-choice cycling before falling back to normal history recall.
- Added staged-console handling for `ArrowUp` / `ArrowDown` in `inputRouting.ts`.
- Wired the global docked and pop-out console key handlers to cycle staged choices on routed `ArrowUp` / `ArrowDown` even when the input is not already focused.
- Updated focused input-routing and console UI tests to cover the new key choice and the global staged-routing path.

#### Files Changed
- `src/app/inputRouting.ts`
- `src/app/console/ConsoleBar.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/inputRouting.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- `ArrowUp` and `ArrowDown` now cycle staged sibling choices.
- `Left` and `Right` are no longer used for staged-choice cycling, so normal caret movement stays available in the console input.
- Staged-choice cycling now works through the global staged-console routing path even before the input is focused.

#### Verification Steps
- `cmd /c npx vitest run src/app/console/useConsoleStore.test.ts src/app/console/ConsoleDock.test.tsx src/app/console/stagedNavigation.test.ts src/app/inputRouting.test.ts`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 476 -->
### [476] - 2026-03-19 23:40 - `DBG - Phase 4.1 - vi2 Staged Choice Prefill And Arrow Cycling`
<!-- ENTRY 476 -->
HUMAN SUMMARY: `Implemented the first `vi2` staged-choice assist pass in the console, so staged sessions now prefill the first valid choice into the input row, highlight the current choice in the single-row summary area, and let left/right arrows cycle sibling choices without breaking manual typing or staged-session escape behavior.` 

#### Scope / Constraints Honored
- Kept the change narrow to staged console navigation, the single-row summary, and supporting store state.
- Preserved free typing as an explicit override instead of turning staged navigation into a chooser-only flow.
- Avoided broader transcript redesign, autocomplete, or non-staged command-entry changes.

#### Summary of Implementation
- Added narrow staged-choice tracking state in the console store for the current targeted choice index and manual-override status.
- Prefilled the input row with the first valid staged choice when a staged session becomes active.
- Updated the single-row console summary to render staged choices inline and visibly highlight the current targeted choice.
- Added `Left Arrow` / `Right Arrow` cycling in the input for staged sibling choices.
- Kept `Escape` cancel behavior correct by cancelling assisted staged sessions directly while still allowing manual-override input to clear normally.
- Added focused store and console UI regression coverage for prefill, cycling, highlight state, and preserved staged-session behavior.

#### Files Changed
- `src/app/console/useConsoleStore.ts`
- `src/app/console/ConsoleBar.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/console/useConsoleStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Entering a staged choice scope now prefills the input with the first valid choice.
- The bottom-left single-row console summary now highlights the current staged choice.
- `Left Arrow` and `Right Arrow` now cycle staged sibling choices in the input row.
- Manual typing still overrides the assist layer, and `Escape` still cancels assisted staged sessions cleanly.

#### Verification Steps
- `cmd /c npx vitest run src/app/console/useConsoleStore.test.ts src/app/console/ConsoleDock.test.tsx src/app/console/stagedNavigation.test.ts`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 475 -->
### [475] - 2026-03-19 23:17 - `DBG - Phase 4.1 - Command Transcript Sublayers`
<!-- ENTRY 475 -->
HUMAN SUMMARY: `Implemented the first narrow `Commands.User` versus `Commands.System` console transcript split, so user-submitted command lines now render separately from returned command prompts/results while still staying inside the existing `Commands` layer family.` 

#### Scope / Constraints Honored
- Kept the change narrow to console transcript semantics and rendering.
- Preserved the existing top-level `Commands` layer instead of inventing a second command console or new layer family.
- Avoided broader transcript-history redesign, grouping, or command-language changes.

#### Summary of Implementation
- Extended the console transcript entry model with a narrow command-line subtype field for `user` versus `system`.
- Defaulted `Commands` entries to `system` so existing non-user command prompts and returns stay classified without broad publisher churn.
- Tagged user-submitted command lines in `ConsoleDock` as `commandLineKind: 'user'`.
- Updated both expanded transcript and list-mode transcript rendering to show `[commands.user]` and `[commands.system]` labels for `Commands` entries.
- Added focused store and console UI coverage for the new subtype behavior and rendered labels.

#### Files Changed
- `src/app/console/consoleTypes.ts`
- `src/app/console/useConsoleStore.ts`
- `src/app/console/ConsolePanel.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/useConsoleStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The console transcript now visually distinguishes command input lines from command return lines as `[commands.user]` and `[commands.system]`.
- Existing command-family filtering still works through the same top-level `Commands` layer.

#### Verification Steps
- `cmd /c npx vitest run src/app/console/useConsoleStore.test.ts src/app/console/ConsoleDock.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 474 -->
### [474] - 2026-03-19 00:13 - `SP - Phase 12 - SketchPlane Transform ParaSlider Hard Font-Size Override`
<!-- ENTRY 474 -->
HUMAN SUMMARY: `Applied a stronger local font-size override to the sketch-plane transform slider rows after the previous reductions were still not visibly changing the toolbar. The transform `ParaSlider` section now uses a direct local slider font-size and explicit `9px` text for labels, inline values, and arrow caps.` 

#### Scope / Constraints Honored
- Kept this as a sketch-plane transform-only typography correction.
- Used a local row-scoped override instead of shrinking the global shared slider typography again.
- Focused only on making the visible transform toolbar text actually read smaller.

#### Summary of Implementation
- Set a local `--sp-window-font-size` override on `.ViewportOverlaySketchPlaneGizmoRows`.
- Replaced the earlier subtle inherited subtraction with explicit `9px` text on:
  - slider labels
  - inline values
  - inline value buttons/inputs
  - arrow-cap buttons

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane transform sliders now render visibly smaller text than before.
- The stronger reduction is isolated to the sketch-plane transform section.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 473 -->
### [473] - 2026-03-19 00:11 - `SP - Phase 12 - SketchPlane Transform ParaSlider Typography Reduction`
<!-- ENTRY 473 -->
HUMAN SUMMARY: `Added a stronger sketch-plane-scoped typography reduction for the transform `ParaSlider` rows so the change is actually visible in that toolbar section. The transform labels, inline values, and arrow caps now render smaller inside the sketch-plane gizmo rows.` 

#### Scope / Constraints Honored
- Kept this as a sketch-plane transform-section typography cleanup.
- Avoided another global `ParaSlider` reduction after the previous shared pass proved too subtle.
- Limited the change to the sketch-plane gizmo rows so other slider consumers keep their current sizing.

#### Summary of Implementation
- Added sketch-plane-specific font-size overrides for:
  - `ParaSlider` labels
  - inline values
  - inline value button/input
  - arrow-cap buttons
- Scoped the change to `.ViewportOverlaySketchPlaneGizmoRows`.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane transform sliders now show clearly smaller text than before.
- The reduction is local to the sketch-plane transform area instead of affecting every shared slider surface again.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 472 -->
### [472] - 2026-03-19 00:10 - `SP - Phase 12 - Overlay Tool Panel ParaSlider Text Tightening`
<!-- ENTRY 472 -->
HUMAN SUMMARY: `Reduced the shared `ParaSlider` text size slightly so the sketch-plane transform section reads tighter overall. The slider label and inline value text now sit a little smaller inside the compacted slider chrome.` 

#### Scope / Constraints Honored
- Kept this as a visual typography cleanup on the shared `ParaSlider` shell used by the overlay toolbar.
- Avoided changing slider structure, behavior, or button layout.
- Applied the change through shared CSS so the transform section tightens up without a sketch-only override.

#### Summary of Implementation
- Reduced the shared `ParaSlider` label text size slightly.
- Reduced the shared inline value button/input text size slightly to match.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane transform sliders now render slightly smaller text inside the slider row.
- The shared overlay-tool slider typography reads tighter without changing the interaction model.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 471 -->
### [471] - 2026-03-19 00:10 - `SP - Phase 12 - Overlay Tool Panel ParaSlider Density Tightening`
<!-- ENTRY 471 -->
HUMAN SUMMARY: `Tightened the shared `ParaSlider` chrome slightly so the sketch-plane transform section reads less tall and more compact. The slider caps, track, fill area, and inline value field now take up less vertical space while keeping the same overall control structure.` 

#### Scope / Constraints Honored
- Kept this as a visual density cleanup on the shared `ParaSlider` shell used by the overlay toolbar.
- Avoided changing slider behavior, value mapping, or button layout.
- Applied the change through the shared CSS so the transform section tightens up without adding a sketch-only slider variant.

#### Summary of Implementation
- Reduced the shared `ParaSlider` cap and track height from `30px` to `26px`.
- Tightened the fill/marker/clamp inset spacing to match the shorter track.
- Reduced the inline value button/input height and slightly tightened the content gap.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane transform sliders now render slightly shorter and more compact.
- The shared overlay-tool slider chrome reads tighter without changing the slider interaction model.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 470 -->
### [470] - 2026-03-19 00:09 - `SP - Phase 12 - Overlay Tool Panel ParaSlider Skin Fix`
<!-- ENTRY 470 -->
HUMAN SUMMARY: `Fixed the sketch-plane transform `ParaSlider` chrome so its arrow caps and value field use the same dark control skin as the rest of the editor surfaces instead of falling back to default white browser buttons. The toolbar now reads much closer to the spaghetti/editor control language.` 

#### Scope / Constraints Honored
- Kept this focused on the shared `ParaSlider` skin selectors used inside the overlay toolbar shell.
- Avoided changing slider behavior or value logic.
- Fixed the visual issue by extending the existing styling path rather than inventing a sketch-only slider variant.

#### Summary of Implementation
- Extended the shared `ParaSlider` button/input selector set so `ViewportOverlayToolPanel` gets the same dark slider-cap and value-button treatment as the existing editor surfaces.
- Brought the sketch-plane transform-section arrow caps and value field into line with the current ParaHook control language.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane transform sliders no longer render default white browser-style cap buttons.
- The transform-section slider arrows and value field now inherit the intended dark styled shell inside the overlay toolbar.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 469 -->
### [469] - 2026-03-19 00:06 - `SP - Phase 12 - Overlay Tool Split Section Resize`
<!-- ENTRY 469 -->
HUMAN SUMMARY: `Added a reusable horizontal split bar to the shared overlay toolbar template so stacked subsections can be resized vertically. The expanded sketch-plane toolbar now uses one divider between `Plane Selection` and `Transform`, letting the user adjust the first subsection height directly.` 

#### Scope / Constraints Honored
- Kept this focused on the shared overlay toolbar template and the sketch-plane toolbar as its first split-layout consumer.
- Limited the first split implementation to the two-section vertical case the sketch-plane tool actually needs now.
- Preserved the existing toolbar density modes and floating-window shell behavior.

#### Summary of Implementation
- Added a reusable `ViewportOverlayToolSplitLayout` component to the shared overlay tool shell.
- Added a draggable horizontal split handle with accent-tinted divider styling.
- Swapped the expanded sketch-plane toolbar body onto that shared split layout.
- Kept `essentials` mode as a single-section body and `collapsed` mode as body-hidden.
- Added focused overlay coverage that verifies the top subsection height changes when the split bar is dragged.

#### Files Changed
- `src/app/components/ViewportOverlayToolPanel.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Expanded overlay toolbars can now expose a horizontal divider between stacked sections.
- The expanded sketch-plane toolbar now lets the user resize the top `Plane Selection` subsection relative to the `Transform` subsection.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 468 -->
### [468] - 2026-03-19 00:02 - `SP - Phase 12 - SketchPlane Toolbar Density Modes`
<!-- ENTRY 468 -->
HUMAN SUMMARY: `Added a compact `-/e/+` density control beside the sketch-plane toolbar close button so the tool can switch between collapsed, essentials, and expanded body states. The sketch-plane dock now supports a lighter setup view without dropping the shared floating-window shell.` 

#### Scope / Constraints Honored
- Kept this focused on the sketch-plane toolbar behavior inside the shared overlay tool shell.
- Added one density-cycle control instead of introducing a larger toolbar settings surface.
- Preserved the existing sketch-plane workflow, drag/resize shell, and title-bar close behavior.

#### Summary of Implementation
- Added a new sketch-plane toolbar density state with:
  - `collapsed`
  - `essentials`
  - `expanded`
- Added a title-bar density button beside `X` that cycles the toolbar through `- / e / +`.
- Mapped the body states so:
  - `collapsed` hides the body
  - `essentials` shows `Plane Selection` only
  - `expanded` shows both `Plane Selection` and `Transform`
- Added overlay coverage that verifies the cycle and visible sections for each state.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane toolbar now has a `-/e/+` title-bar button to cycle body density.
- The toolbar can now collapse fully, show an essentials-only body, or show the full expanded body.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 467 -->
### [467] - 2026-03-18 23:56 - `SP - Phase 12 - Overlay Tool Panel Trailing Close And Accent Scrollbar`
<!-- ENTRY 467 -->
HUMAN SUMMARY: `Moved the sketch-plane tool close action back to the top-right of the shared title bar and added a dark accent-tinted scrollbar style to the reusable overlay tool body. The sketch-plane dock now keeps the expected title-bar layout while its scrolling body reads as part of the orange tool family.` 

#### Scope / Constraints Honored
- Kept this as a small overlay-tool shell cleanup without changing the sketch-plane workflow itself.
- Applied the scrollbar styling at the shared tool-panel body layer so future overlay tools inherit the same treatment from their accent color.
- Limited the button move to how the sketch-plane dock consumes the existing shared title-bar slots.

#### Summary of Implementation
- Swapped the sketch-plane close button from the leading slot back to the shared trailing title-bar action slot.
- Added dark-mode scrollbar styling to the shared overlay tool body with thumb colors derived from `--overlay-tool-accent`.
- Kept the sketch-plane tool as the first visible consumer, which now renders an orange-aligned body scrollbar.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane toolbar close button now renders in the top-right of the title bar.
- The sketch-plane toolbar body scrollbar now uses a dark theme with accent-tinted thumb colors aligned to the tool color.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 466 -->
### [466] - 2026-03-18 23:53 - `SP - Phase 12 - Overlay Tool Panel Drag And Resize Template`
<!-- ENTRY 466 -->
HUMAN SUMMARY: `Upgraded the reusable viewport overlay tool shell into a real floating-window template with a draggable title bar, a top-left close slot, and all 8 edge/corner resize handles. The sketch-plane tool now uses that shared window behavior directly instead of relying on a static shell.` 

#### Scope / Constraints Honored
- Kept this focused on the overlay-tool template and the sketch-plane dock as its first floating-window consumer.
- Reused the existing overlay drag/resize mechanics already proven by the sketch session window instead of inventing a separate window system.
- Preserved the sketch-plane workflow itself while changing the shared window chrome and interaction model.

#### Summary of Implementation
- Extended `ViewportOverlayToolPanel` with leading-actions support, draggable title-bar hooks, and reusable edge/corner resize handles.
- Wired the sketch-plane dock to that shared template so the title bar drags the floating tool window and all edges/corners resize it.
- Moved the sketch-plane close action into the new top-left title-bar slot and updated the shared overlay CSS to support the new floating-window layout.
- Added overlay coverage that verifies the sketch-plane dock exposes the shared drag/resize shell behavior.

#### Files Changed
- `src/app/components/ViewportOverlayToolPanel.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane toolbar title bar now drags the floating tool window.
- The sketch-plane toolbar close button now lives in the top-left of the title bar.
- The sketch-plane toolbar now supports resizing from all edges and all corners.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 465 -->
### [465] - 2026-03-18 23:49 - `SP - Phase 12 - Reusable Overlay Tool Panel Template`
<!-- ENTRY 465 -->
HUMAN SUMMARY: `Extracted the sketch-plane dock shell into a reusable overlay-tool panel template so future viewport tools can reuse the same title-bar, body, and section layout instead of rebuilding the format from scratch.` 

#### Scope / Constraints Honored
- Kept this as a structural refactor without changing sketch-plane tool behavior.
- Limited the extraction to the shared overlay shell format: panel, title bar, body, and sections.
- Preserved the existing sketch-plane-specific controls and styling language on top of the new shared shell.

#### Summary of Implementation
- Added a new reusable `ViewportOverlayToolPanel` component with a title-bar/body shell and reusable labeled sections.
- Swapped the sketch-plane dock over to the new shared component so it becomes the first consumer of the template.
- Aliased the shared shell classes into the theme so future overlay tools can opt into the same layout without inheriting sketch-specific class names.

#### Files Changed
- `src/app/components/ViewportOverlayToolPanel.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No intended behavior change for the sketch-plane tool.
- The sketch-plane toolbar now sits on a reusable overlay-tool shell that future toolbars can reuse directly.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 464 -->
### [464] - 2026-03-18 23:46 - `SP - Phase 12 - SketchPlane Tighter Title Bar`
<!-- ENTRY 464 -->
HUMAN SUMMARY: `Tightened the sketch-plane title bar so it reads closer to the Browser header language, with reduced height, tighter vertical padding, and a smaller close-button footprint.` 

#### Scope / Constraints Honored
- Kept this as a pure visual cleanup on the sketch-plane dock header.
- Left the title-bar structure, body sections, and tool behavior unchanged.
- Limited the pass to title-bar spacing and button sizing in theme CSS.

#### Summary of Implementation
- Reduced the sketch-plane title bar gap, min-height, and vertical padding.
- Tightened the title block spacing so the header reads more like the Browser chrome.
- Reduced the close-button footprint to better fit the shorter header.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane title bar is now visibly shorter and denser.
- The top header reads closer to the Browser/header chrome instead of the earlier taller tool style.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 463 -->
### [463] - 2026-03-18 23:45 - `SP - Phase 12 - SketchPlane Body Status Meta`
<!-- ENTRY 463 -->
HUMAN SUMMARY: `Moved the sketch-plane session-specific `node id / stage` text out of the title bar and into the dock body so the tool header stays cleaner and the live state reads from the first body section instead.`

#### Scope / Constraints Honored
- Kept this as a small sketch-plane dock presentation cleanup.
- Left the underlying pick / adjust session model and controls unchanged.
- Limited the pass to overlay markup and dock styling.

#### Summary of Implementation
- Removed the session-specific subtitle content from the sketch-plane title bar.
- Added a body-level status/meta row above the `Plane Selection` section that shows the active node id and current stage label.
- Added styling so the node id truncates cleanly and the stage text picks up the sketch-plane accent.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane title bar now reads as a cleaner static tool header.
- The active `node id / stage` text now lives in the first body section instead of the title bar.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 462 -->
### [462] - 2026-03-18 23:44 - `SP - Phase 12 - SketchPlane Title Bar And Sectioned Body`
<!-- ENTRY 462 -->
HUMAN SUMMARY: `Reorganized the sketch-plane dock into a clearer tool layout with a real title bar on top, the close action in the title bar, and two body sections underneath: plane selection first and transform second.`

#### Scope / Constraints Honored
- Kept this as a sketch-plane dock structure cleanup without changing the underlying pick / adjust session model.
- Preserved the existing stage action, plane chips, confirm button, and transform controls.
- Limited the pass to overlay structure and dock styling.

#### Summary of Implementation
- Replaced the old single toolbar row with a dedicated title bar that now owns the sketch-plane title, subtitle, and the top-right close action.
- Split the dock body into two labeled sections:
  - `Plane Selection`
  - `Transform`
- Moved plane-stage and plane-choice controls into the first section and kept move / rotate controls in the second section.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The `X` close action now lives in the top-right of the sketch-plane title bar.
- The sketch-plane tool now reads as a title/header plus two body sections instead of one mixed toolbar row.
- Plane selection and transform controls are separated visually to make the tool easier to scan.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 461 -->
### [461] - 2026-03-18 23:41 - `SP - Phase 12 - SketchPlane Pick Stage Hover-Only Highlight`
<!-- ENTRY 461 -->
HUMAN SUMMARY: `Adjusted the sketch-plane pick visuals so entering `Selecting Plane` no longer keeps the previous draft plane visually active; during plane-pick, only the hovered plane gets the active-looking highlight.` 

#### Scope / Constraints Honored
- Kept this as a small viewer-helper visual cleanup on top of the shipped ghost-plane hover highlight.
- Left draft plane ownership, plane reselection, and confirm / cancel behavior unchanged.
- Limited the change to pick-stage visual emphasis only.

#### Summary of Implementation
- Changed the sketch-plane helper so `draftPlane` is only treated as visually active during `adjust`, not during `pick`.
- Kept hovered-plane highlight behavior intact so the hovered ghost plane becomes the only active-looking plane while the user is selecting.
- Extended the helper test to verify that the previous draft plane stays visually inactive during pick while the hovered plane highlights.

#### Files Changed
- `src/viewer/sketch/SketchPlanePickHelper.ts`
- `src/viewer/sketch/SketchPlanePickHelper.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- When the session is in `Selecting Plane`, the previous draft plane no longer overrides the hover feedback.
- The user now sees only the hovered plane look active until they click a new plane.

#### Verification Steps
- `cmd /c npx vitest run src/viewer/sketch/SketchPlanePickHelper.test.ts`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 460 -->
### [460] - 2026-03-18 23:39 - `SP - Phase 12 - SketchPlane Ghost Plane Hover Highlight`
<!-- ENTRY 460 -->
HUMAN SUMMARY: `Added a real viewer-side hover highlight for the sketch-plane ghost planes so the user can see which origin plane is currently under the pointer before clicking it.`

#### Scope / Constraints Honored
- Kept this as a narrow viewport-pick affordance cleanup on top of the shipped Three-rendered ghost planes.
- Left plane selection, reselection, draft transform ownership, and confirm / cancel behavior unchanged.
- Kept the hover state in the real viewer helper instead of adding a fake DOM-only hover effect.

#### Summary of Implementation
- Added hovered-plane state to the sketch-plane pick helper and used it to strengthen the hovered plane fill and outline during `pick`.
- Added a viewer pointer-move handler that raycasts the real ghost planes and updates the helper hover state live.
- Added a focused helper test to lock the hovered-plane visual state.

#### Files Changed
- `src/viewer/Viewer.ts`
- `src/viewer/sketch/SketchPlanePickHelper.ts`
- `src/viewer/sketch/SketchPlanePickHelper.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- While the sketch-plane session is in plane-pick, moving the pointer over a ghost plane now makes that plane look active before click.
- The user can now see which origin plane they are about to select in the main model viewport.

#### Verification Steps
- `cmd /c npx vitest run src/viewer/sketch/SketchPlanePickHelper.test.ts`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 459 -->
### [459] - 2026-03-18 23:33 - `SP - Phase 12 - SketchPlane Plane Reselect Stage Action`
<!-- ENTRY 459 -->
HUMAN SUMMARY: `Added a stage action to the sketch-plane dock so the user can explicitly jump back into plane selection, show all three origin planes again, and reselect the base plane without wiping the current draft move / rotate values.`

#### Scope / Constraints Honored
- Kept this as a small sketch-plane session cleanup on top of the shipped single-dock toolbar.
- Preserved the existing draft transform, confirm / cancel behavior, and viewer-owned ghost plane logic.
- Did not change how selecting a new plane enters `adjust`; this pass only adds a return path back to `pick`.

#### Summary of Implementation
- Added a store action that returns the live sketch-plane session to the `pick` stage without resetting the draft transform or draft plane.
- Added a stage button in the sketch-plane dock that reads as `Selecting Plane` during plane-pick and `Reselect Plane` during adjust.
- Kept the button non-destructive so clicking it only reopens plane selection and lets the viewer show all three planes again.
- Added a focused overlay test to prove reselection preserves the current draft translation while returning the session to `pick`.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane toolbar now has an explicit stage button that tells the user whether they are selecting a plane or adjusting it.
- Clicking `Reselect Plane` sends the session back to plane-pick so the three origin planes become available again.
- Returning to plane-pick does not reset the current draft move / rotate values.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 458 -->
### [458] - 2026-03-18 23:28 - `SP - Phase 12 - SketchPlane Single Dock Toolbar Cleanup`
<!-- ENTRY 458 -->
HUMAN SUMMARY: `Collapsed the sketch-plane session chrome into one usable dock so the plane header, plane chips, Done / X, and sketch-origin gizmo controls all live in a single toolbar surface instead of two floating cards.`

#### Scope / Constraints Honored
- Kept the existing `sketchPlanePickSession`, viewer-owned ghost planes, and attached `TransformGizmo` behavior intact.
- Limited this pass to overlay markup and dock styling cleanup without expanding source-pick scope.
- Preserved the right-side dock placement and the existing move / rotate slider mirror controls.

#### Summary of Implementation
- Merged the sketch-plane session toolbar and the sketch-origin gizmo controls into one dock container in the viewport overlay.
- Removed the detached second gizmo panel layout and moved the gizmo section into the main dock body.
- Tightened the dock styling so it renders as one card with a shared chrome surface and internal section break.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The sketch-plane session now reads as one unified toolbar instead of a top title bar plus a second floating gizmo panel.
- Plane selection, cancel, confirm, gizmo mode switching, and slider editing all remain available from the same dock surface.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 457 -->
### [457] - 2026-03-18 23:17 - `SP - Phase 12 - Hide Inactive Ghost Planes During Adjust`
<!-- ENTRY 457 -->
HUMAN SUMMARY: `Tightened the sketch-plane pick flow so the three ghost plane previews only stay visible during plane selection; once the session is in adjust, only the active plane remains visible with the gizmo and grid.` 

#### Scope / Constraints Honored
- Kept this as a small viewer-helper cleanup on top of the shipped `2B` flow.
- Left gizmo attachment, draft transform ownership, and confirm / cancel behavior unchanged.
- Kept the active plane visible during `adjust` instead of hiding all plane context.

#### Summary of Implementation
- Updated the sketch-plane viewer helper so inactive ghost planes hide as soon as the session enters `adjust`.
- Kept all three ghost planes visible during `pick`.
- Added a focused helper test to lock the stage-based visibility behavior.

#### Files Changed
- `src/viewer/sketch/SketchPlanePickHelper.ts`
- `src/viewer/sketch/SketchPlanePickHelper.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- During `pick`, the user still sees all three origin plane previews.
- During `adjust`, only the active plane stays visible alongside the gizmo and active grid.

#### Verification Steps
- `cmd /c npx vitest run src/viewer/sketch/SketchPlanePickHelper.test.ts`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 456 -->
### [456] - 2026-03-18 23:14 - `SP - Phase 12 - SketchPlane Ghost Planes At Origin`
<!-- ENTRY 456 -->
HUMAN SUMMARY: `Removed the default ghost-plane separation so the `XY / XZ / YZ` sketch-plane pick helpers now intersect at the true origin instead of floating off their normal axes by default.` 

#### Scope / Constraints Honored
- Kept this as a narrow viewer-behavior cleanup on top of the shipped `2B` flow.
- Left active draft translation, rotation, and confirm / cancel behavior unchanged.
- Kept real plane offset behavior tied to `offsetMm` instead of the old preview-only separation constant.

#### Summary of Implementation
- Removed the default ghost-plane offset constant from the sketch-plane viewer helper.
- Stopped applying a built-in normal-axis translation to the three ghost origin planes.
- Kept active grid offset driven only by the authored `offsetMm` value.

#### Files Changed
- `src/viewer/sketch/SketchPlanePickHelper.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The `XZ` and `YZ` ghost origin planes no longer float away from `0,0,0` by default.
- The three sketch-plane pick helpers now intersect at the real origin, matching the intended origin-gizmo layout.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewerHost.test.tsx`
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 455 -->
### [455] - 2026-03-18 23:06 - `SP - Phase 12 - Reused TransformGizmo SketchPlane Draft Transform`
<!-- ENTRY 455 -->
HUMAN SUMMARY: `Attached the existing viewer `TransformGizmo` to the real sketch-plane preview pivot so `SketchPlane > Pick In Viewport` now supports live viewer-driven move / rotate draft editing while keeping the right-side controls as an editable mirror.` 

#### Scope / Constraints Honored
- Reused the existing viewer `TransformGizmo` instead of building a second sketch-only manipulator.
- Kept `sketchPlanePickSession` as the only source of truth and left confirm / cancel ownership unchanged.
- Kept this pass world-space only and did not add face picking, edge picking, `Flip`, `offsetMm`, or `inPlaneRotationDeg` gizmo control.

#### Summary of Implementation
- Extended the sketch-plane viewer bridge payload with `gizmoMode` and added a viewer-to-app draft-transform callback.
- Added a store action for whole-draft transform replacement so viewer object-change events can update translation and rotation together without faking axis-by-axis slider edits.
- Refactored the sketch-plane viewer helper so the preview pivot now owns draft translation and rotation, while plane roots keep only base plane orientation, offset placement, and active-plane highlighting.
- Attached the existing `TransformGizmo` to the preview pivot only during the `adjust` stage and routed its object-change events back through the new sketch-plane draft-transform callback.
- Kept the right-side move / rotate sliders fully editable and synchronized through the same session state, and restricted real viewport plane-click picking to the `pick` stage so the gizmo owns viewport interaction during `adjust`.

#### Files Changed
- `src/app/viewerBridge.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/sketch/SketchPlanePickHelper.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- `SketchPlane > Pick In Viewport` now attaches the real viewer `TransformGizmo` to the sketch-plane preview pivot once the session enters `adjust`.
- Viewer gizmo motion now updates `draftTransform.translation` and `draftTransform.rotationDeg` live without committing the authored sketch plane until `Done` / `Enter`.
- The dock sliders remain editable and mirror gizmo-driven changes through the same session state.
- Plane switching remains available from the dock during `adjust`, while viewport plane clicking is limited to the `pick` stage.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewerHost.test.tsx`
- `cmd /c npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 454 -->
### [454] - 2026-03-18 22:54 - `SP - Phase 12 - Real Three Ghost Planes And Preview Pivot`
<!-- ENTRY 454 -->
HUMAN SUMMARY: `Moved the first `SketchPlane` ghost-plane pass out of the DOM overlay and into the real viewer scene so origin-plane preview now lives in Three, with the compact dock left as chrome only.` 

#### Scope / Constraints Honored
- Kept `3.2B-2-Cleanup Part 2A` origin-plane only and did not expand into face or edge picking.
- Kept `sketchPlanePickSession` as the single source of truth and left confirm / cancel ownership unchanged.
- Kept move / rotate editing in the right-side dock for now and did not attach the reusable `TransformGizmo` yet.

#### Summary of Implementation
- Added a dedicated viewer-side `SketchPlanePickHelper` that owns the temporary preview pivot, three ghost origin-plane meshes, axis/origin cues, and the active-plane grid.
- Extended the viewer bridge so `ViewerHost` now pushes the active sketch-plane pick session into the real viewer and routes viewer plane picks back into the existing store session.
- Added viewer-side raycast plane picking so selecting `XY`, `XZ`, or `YZ` can come from the real viewport scene instead of DOM overlay buttons.
- Removed the fake viewport ghost-plane rendering from `ViewportOverlay` while keeping the compact dock, plane chips, and draft move / rotate controls intact.
- Added focused host coverage for the new viewer bridge session and updated overlay expectations to reflect that the ghost planes are no longer DOM-owned.

#### Files Changed
- `src/app/viewerBridge.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/sketch/SketchPlanePickHelper.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- `SketchPlane > Pick In Viewport` now renders its ghost origin planes, axis/origin cues, and active plane grid in the real Three viewer scene.
- Plane picks from the main viewport now flow back through the existing `sketchPlanePickSession` reducer instead of relying on overlay-owned origin-plane buttons.
- The compact sketch-plane dock remains visible, but the overlay no longer pretends to own the viewport visuals.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewerHost.test.tsx`
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 453 -->
### [453] - 2026-03-18 22:30 - `SP - Phase 12 - Main Viewport SketchPlane Cleanup`
<!-- ENTRY 453 -->
HUMAN SUMMARY: `Cleaned up the first `SketchPlane` viewport-pick pass so it now reads as one honest main-model-viewport workflow by removing the faux inner stage/preview card, keeping the real viewport as the picking surface, and tightening the session chrome into compact right-side controls.` 

#### Scope / Constraints Honored
- Kept the single `sketchPlanePickSession` model and left draft-until-confirm ownership unchanged.
- Preserved the collapsed `Spaghetti Editor` shell plus `Done` / `X`, `Enter` / `Esc`, and hidden console `x` behavior from the first `3.2B-2` pass.
- Kept this cleanup origin-plane only and did not expand into face picking, edge picking, browser exposure, or generic transform-tool work.

#### Summary of Implementation
- Removed the rendered sketch-plane stage/preview composition from the viewport overlay.
- Shifted the visible origin anchor, axis cues, and three ghost origin-plane click targets onto a viewport-covering overlay layer so the main model viewport remains the clear working surface.
- Tightened the sketch-plane session chrome into compact right-side controls with the restored sketch-plane accent color instead of the larger detached stage presentation.
- Kept move / rotate as side controls for this cleanup pass and left the viewport gizmo as a first-pass origin/plane overlay rather than a generalized transform manipulator.
- Updated viewport-overlay tests to assert the stage/preview removal and the new dock plus ghost-plane composition.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- `SketchPlane > Pick In Viewport` no longer renders the faux boxed stage/preview card inside the overlay session.
- The active sketch-plane pick session now presents the origin anchor, axis cues, and three clickable ghost planes directly over the main model viewport.
- The session controls now read as compact right-side chrome with the sketch-plane accent instead of a larger detached preview surface.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `cmd /c npx vitest run src/app/console/ConsoleDock.test.tsx`
- `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

<!-- ENTRY 451 -->
### [452] - 2026-03-18 22:07 - `SP - Phase 12 - Viewport-First Source Pick And Sketch Origin Gizmo`
<!-- ENTRY 452 -->
HUMAN SUMMARY: `Implemented the first `3.2B-2` viewport-first `SketchPlane` pick flow by replacing the old overlay-only plane picker with one live pick session that collapses the active `Spaghetti Editor` shell, shows origin-plane preview controls, opens immediate move/rotate adjustment, and commits or cancels through one temporary draft session.` 

#### Scope / Constraints Honored
- Kept this pass origin-plane only and deferred model-face or geometry-derived picking to the later sketch phase.
- Reused the existing AppShell collapsed-window mode instead of inventing a second compact spaghetti shell.
- Rooted the flow in the existing `sketchPlanePickSession` seam and extended it into a richer draft/confirm/cancel session model.
- Limited the first viewport adjustment tool to move plus rotate in world space and kept `Flip` out of the gizmo.

#### Summary of Implementation
- Expanded `sketchPlanePickSession` in the spaghetti store to track draft plane, draft transform, stage, gizmo mode, and the active viewport shell that must be restored after the session ends.
- Wired `startSketchPlanePick`, `confirmSketchPlanePick`, and `cancelSketchPlanePick` to collapse the active editor viewport into the real header-only shell, keep sketch-plane edits temporary until confirm, and restore the prior viewport window mode after confirm or cancel.
- Reworked the sketch input row so active pick sessions read from the draft plane/transform values while the session is live instead of committing immediately.
- Replaced the old draggable `XY / XZ / YZ` popup in the viewport overlay with a viewport-first sketch-plane session surface that shows:
  - origin-plane buttons
  - stage-aware title/status
  - origin-plane preview content
  - move / rotate draft controls
  - `Done` and `X` actions
- Added `Enter` and `Esc` handling inside the viewport-first sketch-plane session.
- Added temporary console support for `x` so the active sketch-plane pick session can cancel from the app console while the workflow is still being debugged.
- Added focused tests for:
  - temporary draft commit/cancel behavior
  - viewport shell collapse/restore
  - viewport-first session rendering and `Done` / `X`
  - console `x` cancellation

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- `SketchPlane > Pick In Viewport` now starts one live sketch-plane draft session instead of only showing the older overlay-based plane-button popup.
- Starting that session forces the active `Spaghetti Editor` window into the existing collapsed shell so the viewport becomes the primary working surface.
- Picking `XY`, `XZ`, or `YZ` now immediately advances the same session into sketch-plane adjustment with move / rotate controls.
- `Done` and `Enter` commit the draft sketch-plane values, while `X`, `Esc`, and temporary console `x` all cancel through the same session cleanup path.
- While the session is active, the managed `SketchPlane` row reflects draft plane/transform values without committing them until confirm.

#### Verification Steps
- `cmd /c npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx vitest run src/app/console/ConsoleDock.test.tsx`
- `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

<!-- ENTRY 451 -->
### [451] - 2026-03-18 19:07 - `SP - Phase 11 - SketchPlane Source And Transform V1 Surface`
HUMAN SUMMARY: `Implemented the first real `SketchPlane` v1 authoring surface inside the managed sketch input row by replacing the temporary generic details block with grouped `Source` and `Transform` controls, wiring `Origin Plane` through the shared `ParaSelect` control and the first transform values through shared `ParaSlider` rows backed by sketch params.` 

#### Scope / Constraints Honored
- Limited this pass to the managed `SketchPlane` input row and the schema/store seams needed to back its first transform values.
- Kept the stable top-row port presentation intact while moving the editable controls into the attached lower box.
- Reused the repo-standard `ParaSelect` and `ParaSlider` controls instead of introducing sketch-specific numeric widgets.
- Left output-row behavior and deeper sketch-plane runtime geometry mapping unchanged in this pass.

#### Summary of Implementation
- Extended the sketch feature model with an optional `planeTransform` payload and normalized it to a zeroed default shape during schema reads.
- Added store setters for sketch-plane offset, translation axes, rotation axes, and in-plane rotation.
- Extended the shared `PortView` surface so managed rows can render attached custom body content without regressing the stable top row.
- Replaced the temporary `Offset` details presentation in the `SketchPlane` row with a real `Source` section and a real `Transform` section.
- Wired `Source > Origin Plane` to a `ParaSelect` for `XY / XZ / YZ`.
- Wired `Transform` to shared `ParaSlider` controls, with compact `Offset` and `Rotation` in `essentials` and the fuller translation / rotation surface in `expanded`.
- Added new theme rules for the grouped sketch-plane control sections and the compact viewport-pick action button inside the attached row body.

#### Files Changed
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Opening `SketchPlane` from `collapsed` to `essentials` now shows a real attached lower control box instead of only the temporary generic metadata/details treatment.
- `SketchPlane` now exposes `Source > Origin Plane` as a `ParaSelect` and keeps the viewport-pick action inside the same attached control surface.
- `SketchPlane` now stores first-pass transform values in sketch params for:
  - `offset`
  - `translation x/y/z`
  - `rotation x/y/z`
  - `in-plane rotation`
- `essentials` shows the compact transform surface, while `expanded` shows the fuller transform surface.

#### Verification Steps
- `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`
- `cmd /c npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts`

<!-- ENTRY 450 -->
### [450] - 2026-03-18 18:30 - `SP - Phase 11 - SketchPlane Offset Details Group Title`
<!-- ENTRY 450 -->
HUMAN SUMMARY: `Grouped the expanded \`SketchPlane\` details area under a new visible \`Offset\` subsection title so that row now reads like a named control group rather than an unlabeled metadata dump, while still using the existing generic detail lines until a real sketch-plane offset parameter exists.`

#### Scope / Constraints Honored
- Kept this pass limited to the expanded `SketchPlane` details presentation.
- Did not invent or persist a new sketch-plane offset parameter in the graph schema.
- Left output rows and underlying detail data generation unchanged.

#### Summary of Implementation
- Extended the shared port details surface to support an optional section title.
- Passed `Offset` as the details title for the managed `SketchPlane` input row.
- Added lightweight styling for titled details groups and a focused geometry-mode assertion covering the new heading.

#### Files Changed
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

#### Behavior Changes
- Expanding `SketchPlane` now shows the details content under an `Offset` subsection title.
- This is a presentation grouping only; there is still no real sketch-plane offset field wired into the node schema yet.

#### Verification Steps
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`

<!-- ENTRY 449 -->
### [449] - 2026-03-18 18:34 - `SP - Phase 11 - Sketch Port Detail Box Full-Width Border Restore`
<!-- ENTRY 449 -->
HUMAN SUMMARY: `Reverted the last two sketch port details-box inset-frame experiments and restored the managed input/output details borders to full-width left/right alignment under the top row, so the lower box reads as one continuous attached shape again.`

#### Scope / Constraints Honored
- Kept this pass limited to the managed sketch input/output details-box border treatment.
- Preserved the current port-color accents, top-row geometry, and row-mode behavior.
- Did not change any state or interaction logic.

#### Summary of Implementation
- Removed the inset pseudo-frame override from managed sketch input/output details boxes.
- Restored direct border-color styling on the attached lower details box for both managed inputs and outputs.
- Returned the lower box to full-width left/right alignment under the top row.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The sketch input/output details boxes now align their left and right edges directly with the top row again.
- The lower box no longer uses the inset-frame treatment from the previous two visual passes.

#### Verification Steps
- Visual verification in the sketch node `Inputs` and `Outputs` blocks.

<!-- ENTRY 448 -->
### [448] - 2026-03-18 18:31 - `SP - Phase 11 - Sketch Port Detail Box Inset Frame Repair`
<!-- ENTRY 448 -->
HUMAN SUMMARY: `Repaired the managed sketch input/output details-box shape after the first inset-line pass by replacing the separate inset side strokes with one inset lower-frame shape, so the lower box now keeps coherent corners and bottom edge while still starting inward under the top-row fillets.`

#### Scope / Constraints Honored
- Kept this pass limited to the managed sketch port details-box geometry.
- Preserved the current top-row surface, port-color accents, and row-mode behavior.
- Did not change any port-row state or interaction logic.

#### Summary of Implementation
- Restored the shared details-box default side borders for generic use.
- Removed the earlier generic inset side-line pseudo-element approach.
- Switched managed sketch input/output details boxes to an inset lower-frame pseudo-element with left, right, and bottom borders plus its own lower corner radius.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The managed sketch input/output details boxes now keep a coherent lower frame instead of broken inset side lines.
- The lower frame still begins inward under the top-row fillets rather than hugging the outer row edges.

#### Verification Steps
- Visual verification in the sketch node `Inputs` and `Outputs` blocks.

<!-- ENTRY 447 -->
### [447] - 2026-03-18 18:28 - `SP - Phase 11 - Sketch Port Detail Line Inset Cleanup`
<!-- ENTRY 447 -->
HUMAN SUMMARY: `Adjusted the attached sketch input/output details boxes so the side guide lines are now thinner inset vertical lines rather than full edge borders, which makes them read as continuations from under the top-row fillets instead of outer box walls.`

#### Scope / Constraints Honored
- Kept this pass limited to the attached managed port details-box styling.
- Preserved the current top-row geometry, port-color accents, and row-mode interactions.
- Did not change any row state or render structure.

#### Summary of Implementation
- Removed the full left/right side borders from the shared details box.
- Replaced them with inset `::before` and `::after` vertical lines using a configurable inset and bottom offset.
- Bound the managed sketch input/output details-box guide lines to the live port color so they stay aligned with the existing colored border treatment.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The sketch input/output details-box side lines now sit farther inward and read as vertical continuations from the top-row fillet area.
- The details-box side lines are thinner and less boxy than the previous full-height side borders.

#### Verification Steps
- Visual verification in the sketch node `Inputs` and `Outputs` blocks.

<!-- ENTRY 446 -->
### [446] - 2026-03-18 18:23 - `SP - Phase 11 - Sketch Port Label Click Row Cycling`
<!-- ENTRY 446 -->
HUMAN SUMMARY: `Updated the managed sketch input and output rows so clicking the visible port label text, not just the chevron, now cycles the same \`collapsed -> essentials -> expanded\` row states for \`SketchPlane\`, \`SketchProfiles\`, and \`SketchProfile\`.`

#### Scope / Constraints Honored
- Kept this pass limited to managed sketch port-row interaction behavior.
- Reused the existing row-cycle handler instead of adding a second state path.
- Left pin dragging and the rest of the shared port-row logic unchanged.

#### Summary of Implementation
- Wired the managed shared port-row left header cluster to call the same cycle handler already used by the leading chevron.
- Added a small pointer cursor treatment for managed row labels so the clickable area reads correctly.
- Added focused geometry-mode tests proving that both the sketch input label and a sketch output label cycle through the same three row states as the chevron.

#### Files Changed
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

#### Behavior Changes
- Clicking `SketchPlane`, `SketchProfiles`, or `SketchProfile` text now cycles the managed row mode.
- Users no longer need to hit only the chevron to open essentials or expanded row states for those sketch rows.

#### Verification Steps
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`

<!-- ENTRY 445 -->
### [445] - 2026-03-18 18:08 - `SP - Phase 11 - Sketch Output Row Shared Port Migration`
<!-- ENTRY 445 -->
HUMAN SUMMARY: `Migrated the managed \`Geometry/Sketch\` output rows off the older outer geometry-row wrapper and onto the same shared \`PortView\` row surface as the cleaned-up input, giving \`SketchProfiles\` and \`SketchProfile\` the same direct chevron cycle, colored border treatment, and connected lower details box behavior.`

#### Scope / Constraints Honored
- Kept this pass limited to managed `Geometry/Sketch` output rows.
- Reused the existing shared port-row surface and state model instead of inventing a separate output widget.
- Left `Geometry/Extrude` and legacy node output rows unchanged in this cut.

#### Summary of Implementation
- Removed the sketch output rows from the older `renderGeometryPortRow(...)` wrapper path in `NodeView`.
- Wired `SketchProfiles` and `SketchProfile` directly into the shared output-row surface with the same `collapsed -> essentials -> expanded` chevron cycle used by the cleaned-up input row.
- Extended the shared output-port render path to accept row-chevron state, row-toggle callbacks, and managed resolved-value/detail behavior.
- Added geometry-output-specific CSS so managed sketch outputs now get:
  - port-color top-row borders
  - direct row chevrons
  - connected lower details boxes
  - mirrored geometry-shell padding/indent treatment
- Updated focused geometry-mode tests to validate direct output-row behavior instead of the removed outer wrapper.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

#### Behavior Changes
- `SketchProfiles` and `SketchProfile` now render as direct managed output rows instead of older wrapped geometry rows.
- Sketch output rows now use the same three-state chevron cycle as the cleaned-up input row.
- The managed sketch output rows now visually match the shared input-row treatment more closely, including colored borders and attached details boxes.

#### Verification Steps
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`

<!-- ENTRY 444 -->
### [444] - 2026-03-18 18:00 - `SP - Phase 11 - SketchPlane Left Gutter Tightening`
<!-- ENTRY 444 -->
HUMAN SUMMARY: `Tightened the managed \`SketchPlane\` input row further on the left side by reducing the remaining outer left gutter directly, instead of trying to span extra columns, so the port row sits closer to the sketch-node edge while preserving the recent text alignment and right-side width.`

#### Scope / Constraints Honored
- Kept this pass limited to the managed geometry input-row outer gutter.
- Preserved the current text placement, right-side width, and row/detail behavior.
- Did not change row structure or introduce a multi-column layout change.

#### Summary of Implementation
- Reduced the managed geometry input-row outer left padding to `2px`.
- Left the current tighter right-side gutter unchanged.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The SketchPlane row now sits closer to the left edge of the `Inputs` section without changing the recent arrow/text placement.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 443 -->
### [443] - 2026-03-18 17:55 - `SP - Phase 11 - SketchPlane Input Row Width Increase`
<!-- ENTRY 443 -->
HUMAN SUMMARY: `Widened the managed \`SketchPlane\` input row by tightening the outer left/right gutter inside the \`Inputs\` rail, so the row reads closer to the full sketch-node width while keeping the recent text alignment changes intact.`

#### Scope / Constraints Honored
- Kept this pass limited to the geometry input-row wrapper gutter.
- Preserved the current text alignment, color binding, and row/detail interaction behavior.
- Did not change row structure or detail content.

#### Summary of Implementation
- Reduced the managed geometry input-row left/right padding from the full pin gutter to a tighter inset using `calc(var(--sp-pin-gutter) - 4px)`.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The SketchPlane managed input row now spans wider inside the `Inputs` section and sits closer to the sketch node width.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 442 -->
### [442] - 2026-03-18 17:53 - `SP - Phase 11 - SketchPlane Input Row Gutter Alignment Pass`
<!-- ENTRY 442 -->
HUMAN SUMMARY: `Adjusted the managed \`SketchPlane\` input-row layout so the top-row chevron/label cluster sits farther left toward the pin column, and the input-row wrapper now uses matching left/right gutters for a more balanced box width inside the \`Inputs\` rail.`

#### Scope / Constraints Honored
- Kept this pass limited to geometry input-row layout CSS.
- Preserved the current color binding, row height, chevron behavior, and connected details-box structure.
- Did not change any row logic or detail content.

#### Summary of Implementation
- Updated the geometry `Inputs` rail managed input-row wrapper to use symmetric left and right `var(--sp-pin-gutter)` padding.
- Shifted the top-row left header cluster farther left so the chevron/label aligns more closely with the pin column.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The SketchPlane row now has matched left/right horizontal gutters inside the `Inputs` section.
- The top-row arrow and `SketchPlane` label sit farther left and read more in line with the left-side pin column.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 441 -->
### [441] - 2026-03-18 17:49 - `SP - Phase 11 - SketchPlane Detail Box Accent And Indent Pass`
<!-- ENTRY 441 -->
HUMAN SUMMARY: `Updated the managed \`SketchPlane\` input presentation so the lower info box now uses the same live port color on its border, the detail lines sit slightly inset, and the top-row chevron/label cluster is nudged a bit left for tighter alignment against the pin.`

#### Scope / Constraints Honored
- Kept this pass limited to geometry input-row presentation CSS.
- Preserved the current three-state row behavior, top-row height, and connected details-box structure.
- Did not change any row logic or detail content.

#### Summary of Implementation
- Bound the managed input details-box border color to the live `var(--sp-port-color)`.
- Added a small horizontal inset to the lower details box and shifted the input detail lines/dots inward slightly.
- Nudged the top-row left header cluster slightly left and tightened its internal gap.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The SketchPlane lower info box now carries the same port-color accent as the pin and top row.
- The lower detail lines are slightly indented, and the top-row arrow/text sits a bit farther left.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 440 -->
### [440] - 2026-03-18 17:51 - `SP - Phase 11 - SketchPlane Live Port Color Inheritance Fix`
<!-- ENTRY 440 -->
HUMAN SUMMARY: `Fixed the managed \`SketchPlane\` top row so it now inherits the actual live port color instead of the neutral fallback color that \`SpaghettiPortMain\` was shadowing locally, which restores the orange border and orange resolved plane label.`

#### Scope / Constraints Honored
- Kept this pass limited to the geometry input-row color inheritance path.
- Preserved the current row layout, height, chevron behavior, and details-box treatment.
- Did not change the underlying row/state logic.

#### Summary of Implementation
- Overrode the managed geometry input-row `SpaghettiPortMain` surface to inherit `--sp-port-color` from the outer port row.
- Left the existing border-color and resolved value color bindings pointed at `var(--sp-port-color)`.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The SketchPlane top-row border and `XY` resolved value now use the real pin/socket color instead of the neutral fallback color.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 439 -->
### [439] - 2026-03-18 17:47 - `SP - Phase 11 - SketchPlane Port Color Binding Cleanup`
<!-- ENTRY 439 -->
HUMAN SUMMARY: `Bound the managed \`SketchPlane\` top-row accenting more explicitly to the live port color so the row border and resolved plane label both render in the same pin/socket color.`

#### Scope / Constraints Honored
- Kept this pass limited to the geometry-node input-row color styling.
- Preserved the current row layout, height, chevron behavior, and details-box treatment.
- Did not change any interaction or state logic.

#### Summary of Implementation
- Retained the geometry input-row top border on `var(--sp-port-color)`.
- Explicitly forced the resolved value label in the geometry input row to use the same port color at full opacity.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The SketchPlane top-row border and the `XY` resolved value label now both follow the pin color.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 438 -->
### [438] - 2026-03-18 17:45 - `SP - Phase 11 - SketchPlane Top Row Border Color Match`
<!-- ENTRY 438 -->
HUMAN SUMMARY: `Updated the managed geometry input top row so its border now uses the same resolved port color as the input pin, keeping the \`SketchPlane\` row visually tied to its plane socket color.`

#### Scope / Constraints Honored
- Kept this pass limited to the geometry input-row top surface styling.
- Preserved the current row height, chevron behavior, and connected lower details box treatment.
- Did not change any row structure or interaction logic.

#### Summary of Implementation
- Updated the geometry `Inputs` rail top-row surface to use `var(--sp-port-color)` for its border color.
- Left the rest of the managed port-row styling unchanged.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The SketchPlane top-row border now matches the pin/port color instead of using the neutral shared border color.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 437 -->
### [437] - 2026-03-18 17:52 - `SP - Phase 11 - SketchPlane Input Row Regression Rollback`
<!-- ENTRY 437 -->
HUMAN SUMMARY: `Rolled back the recent \`SketchPlane\` input-row visual regressions by removing the new outer row fill, zeroing the added side padding, tightening the top-row height again, and pulling the lower details box back up so it reconnects under the main row.`

#### Scope / Constraints Honored
- Kept this pass limited to geometry-node input-row presentation CSS.
- Preserved the current SketchPlane three-state chevron cycle and existing row/detail logic.
- Did not alter the underlying `PortView` JSX structure or interaction handlers.

#### Summary of Implementation
- Scoped the geometry `Inputs` rail to render its shared input port wrapper with no extra outer background or horizontal padding.
- Reduced the managed input top-row vertical padding and header min-height so the SketchPlane row returns to its prior tighter height.
- Hid the extra inner accent line on the managed input top row.
- Pulled the lower details box upward with matching top padding so it visually reconnects beneath the stable rounded top row.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The SketchPlane managed input row no longer paints an extra filled shell around the top row and details area.
- The top row is shorter again, with no extra inner white line, and the expanded details reconnect directly underneath it.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 436 -->
### [436] - 2026-03-18 17:40 - `SP - Phase 11 - SketchPlane Detail Box Connection Cleanup`
<!-- ENTRY 436 -->
HUMAN SUMMARY: `Adjusted the split \`SketchPlane\` port surface so the lower details box no longer adds its own dark fill or horizontal inset, and now reconnects directly under the stable top row while leaving the top row visually unchanged.`

#### Scope / Constraints Honored
- Kept this pass limited to the sketch-facing shared port CSS.
- Preserved the current three-state SketchPlane chevron cycle and top-row pin anchoring.
- Did not change the actual details content or interaction logic.

#### Summary of Implementation
- Raised the top-row port box above the lower details box with a small z-index.
- Removed the lower details-box fill and horizontal padding.
- Pulled the lower details box up by one border pixel and removed its top border so it visually reconnects to the top row.
- Kept only the lower box side and bottom borders plus the lower rounded corners.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The lower SketchPlane details box now connects directly to the top row again.
- The lower box no longer introduces a separate dark background fill or extra horizontal inset.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 435 -->
### [435] - 2026-03-18 17:34 - `SP - Phase 11 - Stable SketchPlane Top Row Box`
<!-- ENTRY 435 -->
HUMAN SUMMARY: `Restructured the shared port surface so the \`SketchPlane\` top row now remains its own fully rounded box at all times, with the input pin anchored to that top row and the expanded details rendered as a separate lower box below it.`

#### Scope / Constraints Honored
- Kept this pass limited to the shared port-row surface structure and its sketch-facing presentation.
- Preserved the current SketchPlane three-state chevron behavior and details content.
- Left the actual graph/port behavior unchanged.

#### Summary of Implementation
- Split `PortView` into a `SpaghettiPortMain` top-row box plus the existing lower details box.
- Moved the port anchor/pin onto the new top-row box so it remains visually attached there.
- Shifted the border/background/radius styling from the outer port wrapper to the new top-row box.
- Restyled the lower details box to sit below the top row without stealing the top row’s rounded corners.

#### Files Changed
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The SketchPlane top row now keeps its full top and bottom fillets even when details are expanded.
- The input pin remains on the top-row line rather than feeling attached to the full expanded stack.

#### Verification Steps
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

<!-- ENTRY 434 -->
### [434] - 2026-03-18 17:34 - `SP - Phase 11 - SketchPlane Attached Details Box`
<!-- ENTRY 434 -->
HUMAN SUMMARY: `Changed the expanded \`SketchPlane\` detail presentation so the top input row stays visually unchanged and any extra info now opens into a connected lower box instead of making the row itself feel like it morphs shape.`

#### Scope / Constraints Honored
- Kept this pass limited to the visual presentation of expanded port details.
- Preserved the current three-state SketchPlane chevron cycle and resolved-value label behavior.
- Did not change the underlying details content or row-mode logic.

#### Summary of Implementation
- Wrapped expanded port-detail content in a dedicated `SpaghettiPortDetailsBox` container.
- Styled that container as an attached lower section with a divider, shared width, and matching lower corners.
- Left the top port header row structure unchanged so it remains visually stable when details open.

#### Files Changed
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- Expanded SketchPlane details now appear in a connected box below the unchanged top row.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 433 -->
### [433] - 2026-03-18 17:33 - `SP - Phase 11 - SketchPlane Essentials Chevron Direction`
<!-- ENTRY 433 -->
HUMAN SUMMARY: `Adjusted the integrated \`SketchPlane\` left chevron so the middle \`essentials\` state now points left, while the row still uses right for collapsed and down for expanded.`

#### Scope / Constraints Honored
- Kept this pass limited to the SketchPlane row chevron glyph mapping.
- Preserved the existing three-state row cycle behavior.
- Left other port chevrons unchanged.

#### Summary of Implementation
- Added an explicit glyph mapping for `collapsed`, `essentials`, and `expanded` row-chevron states in `PortView`.
- Changed the `essentials` state from the generic open/down glyph to a left-pointing caret.

#### Files Changed
- `src/app/spaghetti/canvas/PortView.tsx`

#### Behavior Changes
- The SketchPlane left chevron now points left in the `essentials` state.

#### Verification Steps
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

<!-- ENTRY 432 -->
### [432] - 2026-03-18 17:23 - `SP - Phase 11 - SketchPlane Three-State Chevron Cycle`
<!-- ENTRY 432 -->
HUMAN SUMMARY: `Moved the old port-details expansion behavior into the left \`SketchPlane\` chevron so that one control now cycles the input row through \`collapsed -> essentials -> expanded\`, while keeping the resolved plane label visible in every state and removing the old trailing details chevron from that row.`

#### Scope / Constraints Honored
- Kept this pass limited to the managed `SketchPlane` input row in the `Geometry/Sketch` node.
- Reused the existing underlying port-details payload and expansion state instead of inventing a separate duplicate details system.
- Left output-row behavior and non-sketch port-detail toggles unchanged.

#### Summary of Implementation
- Added a left-chevron row state in `PortView` that can represent `collapsed`, `essentials`, and `expanded`.
- Updated `NodeView` so the `SketchPlane` row cycles through those three states by combining the existing row-open state with the existing port-details expansion state.
- Kept the resolved `XY / XZ / YZ` plane label visible even when the row is collapsed.
- Hid the old trailing details chevron for `SketchPlane` because the left chevron now owns that cycle.

#### Files Changed
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`

#### Behavior Changes
- The `SketchPlane` left chevron now cycles `collapsed -> essentials -> expanded -> collapsed`.
- The resolved plane label remains visible in every state.
- The old trailing details chevron no longer appears on the `SketchPlane` row.

#### Verification Steps
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`

<!-- ENTRY 431 -->
### [431] - 2026-03-18 17:25 - `SP - Phase 11 - SketchPlane Chevron Box Removal`
<!-- ENTRY 431 -->
HUMAN SUMMARY: `Removed the remaining button box around the integrated \`SketchPlane\` left chevron by overriding the shared panel-button chrome at the actual \`button.SpaghettiPortChevron--leading\` selector level.`

#### Scope / Constraints Honored
- Kept this pass limited to the leading `SketchPlane` chevron button styling.
- Preserved the integrated input-row toggle behavior.
- Left the other port chevrons and shell buttons unchanged.

#### Summary of Implementation
- Replaced the earlier low-specificity leading-chevron style rule with a `V15Panel button.SpaghettiPortChevron--leading` override.
- Applied the chrome removal across normal, hover, focus-visible, and active states.
- Kept the chevron as a plain colored caret with no surrounding box.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The leading `SketchPlane` chevron no longer shows a boxed button background or border.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 430 -->
### [430] - 2026-03-18 17:24 - `SP - Phase 11 - SketchPlane Chevron Visual Cleanup`
<!-- ENTRY 430 -->
HUMAN SUMMARY: `Cleaned up the integrated \`SketchPlane\` left chevron so it no longer renders as a chunky button and instead reads like the older small plain port-row caret while keeping the managed row-mode behavior intact.`

#### Scope / Constraints Honored
- Kept this pass limited to the visual styling of the integrated `SketchPlane` row chevron.
- Preserved the managed input-row behavior and its tie-in to the sketch node’s row-mode defaults.
- Left the other port chevrons and output-row controls unchanged.

#### Summary of Implementation
- Removed the inherited button chrome from the leading input-row chevron.
- Reset the leading chevron to auto sizing with no border, radius, fill, or shadow.
- Switched the glyph color to the port color so the control reads like a native port affordance instead of a generic capsule button.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The `SketchPlane` left chevron now appears as a plain small caret instead of a large rounded button.

#### Verification Steps
- Visual verification in the sketch node `Inputs` block.

<!-- ENTRY 429 -->
### [429] - 2026-03-18 17:20 - `SP - Phase 11 - SketchPlane Input Chevron Integration`
<!-- ENTRY 429 -->
HUMAN SUMMARY: `Added a left-side chevron directly into the real \`SketchPlane\` input row so the sketch input pin can be opened and collapsed from the pin row itself without bringing back the old extra wrapper section.`

#### Scope / Constraints Honored
- Kept this pass limited to the managed `Geometry/Sketch` input row behavior.
- Preserved the flatter `Inputs -> SketchPlane -> PortView` structure requested in the previous pass.
- Left the existing output-row wrapper behavior unchanged.

#### Summary of Implementation
- Reintroduced managed row-open state for `SketchPlane`, but rendered the toggle inside `PortView` instead of in a separate outer accordion row.
- Added a leading chevron button between the input pin anchor and the input label.
- Hid the right-side input metadata when the input row is collapsed, and restored it when the row is expanded.
- Expanded the focused geometry tests and render test to cover the integrated input-row chevron behavior.

#### Files Changed
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- `SketchPlane` now has a left-side chevron directly on the input row.
- The input row can be expanded or collapsed without using a separate nested wrapper section.

#### Verification Steps
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`

<!-- ENTRY 428 -->
### [428] - 2026-03-18 17:17 - `SP - Phase 11 - Node Mode Button Fixed 10x10 Size`
<!-- ENTRY 428 -->
HUMAN SUMMARY: `Locked the standalone node mode button to a true \`10x10\` size across normal, hover, focus, and active states so the shared action-button styling can no longer make the resting state appear larger than the hovered state.`

#### Scope / Constraints Honored
- Kept this pass limited to the shared node-header mode button sizing override.
- Preserved the existing node-mode labels and click behavior.
- Left the rest of the shared `SpaghettiWindowAction` controls unchanged.

#### Summary of Implementation
- Increased the specificity of the node-mode button sizing rule to target the real `button.SpaghettiNodeModeButton` inside the panel.
- Applied the same `10x10` size override across normal, hover, focus-visible, and active states.
- Kept the explicit centering and reduced font sizing on the button.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The shared node mode button now stays `10x10` both normally and on hover.

#### Verification Steps
- Visual verification in the spaghetti node header.

<!-- ENTRY 427 -->
### [427] - 2026-03-18 17:15 - `SP - Phase 11 - Node Mode Button Size Reduction`
<!-- ENTRY 427 -->
HUMAN SUMMARY: `Reduced the standalone node mode button again so it now reads as a tighter square control, with a smaller centered glyph and matched width/height.`

#### Scope / Constraints Honored
- Kept this pass limited to the shared node-header mode button sizing.
- Preserved the existing header split, labels, and centering behavior.
- Did not change any node-mode logic or click behavior.

#### Summary of Implementation
- Reduced the node mode button width and height to the same smaller square size.
- Reduced the button font size so the glyph remains legible without crowding the control.
- Left the explicit centering rules in place so the smaller button still aligns cleanly.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The shared node mode button now renders smaller with equal width and height.

#### Verification Steps
- Visual verification in the spaghetti node header.

<!-- ENTRY 426 -->
### [426] - 2026-03-18 17:14 - `SP - Phase 11 - Node Mode Button Tightening`
<!-- ENTRY 426 -->
HUMAN SUMMARY: `Tightened the new node mode button by changing the collapsed label from \`i\` to \`-\`, explicitly centering the glyph in all states, and reducing the button size so it reads more like a compact shell control than a full titlebar button.`

#### Scope / Constraints Honored
- Kept this pass limited to the shared node-header mode button.
- Preserved the same node-mode cycling behavior and header layout split.
- Left the title text and node-type text unchanged.

#### Summary of Implementation
- Changed the collapsed-mode button label to `-`.
- Added explicit flex centering and line-height alignment to the node mode button so the glyph stays centered even when not hovered.
- Reduced the button width, height, and font size for a smaller header control footprint.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The node mode button now shows `-`, `e`, and `+` instead of `i`, `e`, and `+`.
- The button glyph is visually centered in its resting state.
- The button is smaller than the first split-header version.

#### Verification Steps
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`

<!-- ENTRY 425 -->
### [425] - 2026-03-18 17:11 - `SP - Phase 11 - Node Header Title And Mode Button Split`
<!-- ENTRY 425 -->
HUMAN SUMMARY: `Split the spaghetti node header so the node title is now plain text and the row-mode cycle control is a separate compact \`+ / e / i\` button, matching the smaller control language already used elsewhere in the workspace shell.`

#### Scope / Constraints Honored
- Kept this change limited to node-header presentation and the existing row-mode cycle control.
- Preserved the same click behavior for cycling node view modes.
- Left node-body layout and geometry-shell block behavior unchanged.

#### Summary of Implementation
- Separated the old title-button header into a small dedicated mode-cycle button plus a static title label.
- Reused the compact workspace action-button styling language for the new node mode button.
- Added header-layout styles so the button, title, and node type remain aligned cleanly.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The node name is no longer inside the mode-cycle button.
- The row-mode control now appears as a small standalone `+`, `e`, or `i` button beside the title.

#### Verification Steps
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`

<!-- ENTRY 424 -->
### [424] - 2026-03-18 17:08 - `SP - Phase 11 - Sketch Input Block Simplification`
<!-- ENTRY 424 -->
HUMAN SUMMARY: `Simplified the \`Geometry/Sketch\` input shell so the \`Inputs\` block now opens directly to the real \`SketchPlane\` input port view instead of nesting one more collapsible parent row above it.`

#### Scope / Constraints Honored
- Kept this change limited to the sketch-node input presentation.
- Preserved the top-level `Inputs` block toggle and the existing collapsible output rows.
- Did not change the sketch content sections or output-row behavior.

#### Summary of Implementation
- Stopped treating `SketchPlane` as a managed geometry port-row wrapper.
- Let the `Inputs` block render the direct input `PortView` content for `SketchPlane`.
- Updated the geometry-mode and render tests to reflect the flatter input hierarchy.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`

#### Behavior Changes
- Opening `Inputs` in `Geometry/Sketch` now shows the actual `SketchPlane` input row directly.
- The extra nested `SketchPlane` collapse header inside `Inputs` is gone.

#### Verification Steps
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`

<!-- ENTRY 423 -->
### [423] - 2026-03-18 17:06 - `SP - Phase 11 - Sketch Shell Header Button Chrome Removal`
<!-- ENTRY 423 -->
HUMAN SUMMARY: `Removed the remaining shared panel-button chrome from the top-level \`Geometry/Sketch\` shell headers so \`Inputs\`, \`Sketch\`, and \`Outputs\` no longer show the grey rounded box behind the arrow-and-text label.`

#### Scope / Constraints Honored
- Kept this fix limited to the sketch shell header toggles.
- Preserved the shared `V15Panel` button styling for every other control in the panel.
- Did not change collapse behavior or shell block layout.

#### Summary of Implementation
- Identified the shared `.V15Panel button` theme rule as the source of the remaining grey button capsule.
- Added a targeted override for `.SpaghettiGeometryNodeRailToggle` across normal, hover, focus-visible, and active states.
- Removed the inherited padding, border, radius, background, and box-shadow from that specific shell-header button class only.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- `Geometry/Sketch` top-level block headers now render without the shared rounded grey button box.

#### Verification Steps
- Visual verification in the spaghetti editor sketch node shell.

<!-- ENTRY 422 -->
### [422] - 2026-03-18 17:05 - `SP - Phase 11 - Sketch Shell Header Styling Cleanup`
<!-- ENTRY 422 -->
HUMAN SUMMARY: `Refined the new top-level \`Geometry/Sketch\` shell headers so the collapse chevron now sits on the left and the \`Inputs\`, \`Sketch\`, and \`Outputs\` labels read like plain arrow-plus-text titles instead of filled control bars.`

#### Scope / Constraints Honored
- Kept this pass limited to visual styling and header markup for the sketch shell block toggles.
- Did not change the existing block open/close behavior, row-mode defaults, or nested section and port-row interaction rules.
- Left other node templates and non-geometry header treatments unchanged.

#### Summary of Implementation
- Reordered the shell-header markup so the chevron renders before the section label.
- Simplified the block-toggle button styling to remove any bar-like filled or bordered appearance.
- Kept the full header row clickable while making the visual treatment read as plain text plus icon.

#### Files Changed
- `src/app/spaghetti/canvas/GeometryNodeShell.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- `Geometry/Sketch` top-level block headers now show their collapse/expand arrow on the left side.
- `Inputs`, `Sketch`, and `Outputs` headers no longer look like filled or bordered bars.

#### Verification Steps
- Run `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`

<!-- ENTRY 421 -->
### [421] - 2026-03-18 17:00 - `SP - Phase 11 - Sketch Node Top-Level Block Toggles`
<!-- ENTRY 421 -->
HUMAN SUMMARY: `Made the top-level \`Geometry/Sketch\` shell blocks interactive so \`Inputs\`, \`Sketch\`, and \`Outputs\` can each be collapsed or reopened directly without changing node row mode, while preserving the existing nested row and section behavior inside those blocks.`

#### Scope / Constraints Honored
- Kept this change limited to the forward `Geometry/Sketch` shell in the spaghetti editor.
- Preserved the existing geometry section and port-row open/default logic inside each block once the block body is visible.
- Left `Geometry/Extrude` and legacy node templates unchanged.

#### Summary of Implementation
- Added geometry-shell block-level toggle state in `NodeView` for `inputs`, `content`, and `outputs`.
- Applied row-mode defaults so the sketch shell opens `Inputs` in `essentials`, opens both `Inputs` and `Outputs` in `expanded`, and keeps the `Sketch` block open by default while still allowing manual collapse.
- Extended `GeometryNodeShell` to render clickable block headers with chevrons and block open-state data attributes.
- Added focused interaction tests covering block defaults, manual toggles, persistence, and compatibility with the existing sketch port-row behavior.

#### Files Changed
- `src/app/spaghetti/canvas/GeometryNodeShell.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- `Geometry/Sketch` now lets users collapse and reopen the top-level `Inputs`, `Sketch`, and `Outputs` shell blocks directly.
- Clicking those block headers no longer depends on or changes the node row mode.
- Nested sketch sections and sketch port rows still use their existing default-open and manual-override behavior after the surrounding block is reopened.

#### Verification Steps
- Run `vitest src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

<!-- ENTRY 420 -->
### [420] - 2026-03-18 16:01 - `OO - Phase 13 - Geometry Node Default-Open Mode Notes Entry`
<!-- ENTRY 420 -->
HUMAN SUMMARY: `Added a new Codex note locking the cleaner forward model for geometry nodes: row mode should only choose default-open sections and shell density, while manual section toggles must always be allowed to win after interaction.`

#### Scope / Constraints Honored
- Kept this change limited to planning notes and permanent docs-history tracking.
- Did not change runtime node-mode logic or section-toggle behavior yet.
- Captured the stronger replacement model immediately after the row-mode conflict became clear in live use.

#### Summary of Implementation
- Added note `[178]` to `12_CodexChatNotes.md` describing the double-gating problem between row mode and per-section collapse state.
- Locked the recommended simplification for forward `Geometry/*` nodes: row mode sets defaults, section state controls actual open/closed behavior.
- Recorded the proposed implementation shape, first-pass `Geometry/Sketch` defaults, and the order for replacing the temporary promotion behavior with the new model.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- None. This was a docs-only implementation-planning entry.

#### Verification Steps
- Confirmed note `[178]` appears above `[177]` in `12_CodexChatNotes.md`.
- Confirmed the note records the chosen “defaults only” row-mode contract and the implementation order for replacing the temporary geometry promotion patch.
- Confirmed this permanent changelog entry records the new planning note.

<!-- ENTRY 419 -->
### [419] - 2026-03-18 15:37 - `SP - Phase 11 - Geometry Node Section Click Promotion Fix`
<!-- ENTRY 419 -->
HUMAN SUMMARY: `Implemented the first geometry node-mode fix so clicking a `Geometry/*` section header while the node is in `collapsed` mode now promotes it back to `essentials` and reveals the target section body instead of looking like a dead toggle.`

#### Scope / Constraints Honored
- Kept the fix targeted to forward geometry templates without changing the legacy part-node mode behavior.
- Preserved the existing local section-collapse store instead of replacing the row-mode system wholesale.
- Added focused interaction coverage for the new geometry-shell behavior.

#### Summary of Implementation
- Updated `NodeView` so `sketch` and `extrude` section-header clicks detect `collapsed` node mode and first switch the node back to `essentials`.
- Ensured the clicked section is explicitly uncollapsed during that promotion path so the user sees an open body immediately after the click.
- Added a jsdom interaction test that renders a real `Geometry/Sketch` node off store state and proves a `Plane` click promotes the node and reveals the section body.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- `Geometry/Sketch` and `Geometry/Extrude` no longer keep visible-but-non-opening section shells when the node is in `collapsed` mode and the user clicks a section header.

#### Verification Steps
- `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/canvas/NodeView.test.tsx`
- `cmd /c npx tsc --noEmit`

<!-- ENTRY 418 -->
### [418] - 2026-03-18 15:37 - `OO - Phase 13 - Geometry Node Mode Fix Recommendation Notes Update`
<!-- ENTRY 418 -->
HUMAN SUMMARY: `Extended the active geometry node-mode notes with the stronger root-cause read that sketch section clicks are running into old `collapsed` node-mode behavior, and recorded the recommended forward fix: promote `Geometry/*` nodes out of `collapsed` before applying section toggles.`

#### Scope / Constraints Honored
- Kept this change limited to planning notes and permanent docs-history tracking.
- Did not change runtime code, node-mode logic, or section-toggle behavior.
- Recorded the likely root cause and recommended implementation path while the current geometry-shell behavior is still fresh.

#### Summary of Implementation
- Updated note `[177]` in `12_CodexChatNotes.md` with the current-code diagnosis that section toggles are present but suppressed by `collapsed` node mode.
- Added a concrete suggested fix path for forward `Geometry/*` nodes, including promoting the node to `essentials` before applying section toggles.
- Captured the recommended semantic split of `collapsed` as summary-only, `essentials` as the normal working mode, and `expanded` as the future fuller-detail mode.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- None. This was a docs-only diagnosis and fix-planning update.

#### Verification Steps
- Confirmed note `[177]` now includes both the root-cause read and the code-level suggested fix path.
- Confirmed the note still keeps the earlier defaults for geometry section behavior and now ties them to the inherited row-mode system.
- Confirmed this permanent changelog entry records the updated planning note.

<!-- ENTRY 417 -->
### [417] - 2026-03-18 15:31 - `OO - Phase 13 - Geometry Node Mode Cleanup Notes Entry`
<!-- ENTRY 417 -->
HUMAN SUMMARY: `Added a new `12_CodexChatNotes.md` `entry capturing the next cleanup surface after the first sketch-shell layout pass: normalizing `expanded` / `essentials` / `collapsed` behavior for forward geometry nodes and fixing the non-expanding `Plane` / `Draw` / `Entities` / `Review` sections.` 

#### Scope / Constraints Honored
- Kept this change limited to planning notes and permanent docs-history tracking.
- Did not change runtime code, section-toggle behavior, or geometry implementation.
- Recorded the current-code truth before any later node-mode refactor changes it.

#### Summary of Implementation
- Added a new top note in `12_CodexChatNotes.md` describing the current mismatch between the new geometry shell and the inherited section-collapse system.
- Captured the relevant live section ids and the shared `NodeView` collapse path that still owns geometry-section visibility.
- Added recommended defaults for how `expanded`, `essentials`, `collapsed`, and section-header clicks should work for forward `Geometry/*` nodes.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- None. This was a docs-only planning-note addition.

#### Verification Steps
- Confirmed the new `[177]` note appears above `[176]` in `12_CodexChatNotes.md`.
- Confirmed the note records both the observed sketch-section symptom and the current shared `NodeView` collapse-path ownership.
- Confirmed this permanent changelog entry records the new planning note.

<!-- ENTRY 416 -->
### [416] - 2026-03-18 15:28 - `SP - Phase 11 - Geometry Sketch Input Row Padding Clamp`
<!-- ENTRY 416 -->
HUMAN SUMMARY: `Added one more geometry-shell clamp for the `Geometry/Sketch` input row by forcing the stacked input port to use border-box sizing and a slightly larger right padding, addressing the last few pixels of visible overflow on the `SketchPlane` row.` 

#### Scope / Constraints Honored
- Kept this tweak limited to geometry-shell input row sizing.
- Left graph behavior, schema, `Geometry/Extrude`, and legacy nodes unchanged.
- Did not alter the already-landed single-column shell structure.

#### Summary of Implementation
- Added a geometry-shell-specific `border-box` sizing clamp for stacked input rows.
- Increased the right padding on geometry-shell input ports to keep the right-side plane/value text fully inside the visible row box.
- Preserved the prior header/value clamping overrides.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The `SketchPlane` input row should now stay fully inside the sketch node bounds instead of hanging a few pixels past the right edge.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`
- Ran `cmd /c npx tsc --noEmit`

<!-- ENTRY 415 -->
### [415] - 2026-03-18 15:25 - `SP - Phase 11 - Geometry Sketch Port Header Clamp Fix`
<!-- ENTRY 415 -->
HUMAN SUMMARY: `Fixed the remaining `Geometry/Sketch` input-row overflow by overriding the inherited templated input-pin grid inside the new geometry shell, so the `SketchPlane` row now uses a normal single-line header with the right-side value label clamped inside the port bounds.` 

#### Scope / Constraints Honored
- Kept this fix limited to geometry-shell input-port header styling.
- Left `Geometry/Extrude`, legacy nodes, and graph behavior unchanged.
- Did not change node contracts, schema, or runtime logic.

#### Summary of Implementation
- Overrode the inherited templated input-port header grid inside the geometry shell.
- Switched geometry-shell input rows to a normal single-line header layout with constrained right-side value text.
- Added truncation and width clamps so the `SketchPlane` value label no longer extends past the port edge.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The `SketchPlane` input port row now keeps its right-side plane/value label inside the visible row bounds.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`
- Ran `cmd /c npx tsc --noEmit`

<!-- ENTRY 414 -->
### [414] - 2026-03-18 15:19 - `SP - Phase 11 - Geometry Sketch Input Width Overflow Fix`
<!-- ENTRY 414 -->
HUMAN SUMMARY: `Fixed the new `Geometry/Sketch` shell so the stacked input/output port rows no longer inherit the older half-width template sizing, which was causing the `SketchPlane` row to overflow past the node edge.` 

#### Scope / Constraints Honored
- Kept this fix limited to geometry-shell sizing overrides.
- Left `Geometry/Extrude`, legacy nodes, and graph behavior unchanged.
- Did not change schema, ports, or node contracts.

#### Summary of Implementation
- Added geometry-shell-specific width overrides so stacked input and output port columns use the full node width.
- Applied the same full-width override to the port rows themselves to stop the inherited half-width template rule from leaking into the new sketch shell.
- Preserved the single-column geometry shell layout from the prior follow-up.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The `SketchPlane` input row now stays inside the sketch node bounds instead of visually overflowing to the right.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`
- Ran `cmd /c npx tsc --noEmit`

<!-- ENTRY 413 -->
### [413] - 2026-03-18 15:16 - `SP - Phase 11 - Geometry Sketch Shell Single-Column Follow-Up`
<!-- ENTRY 413 -->
HUMAN SUMMARY: `Collapsed the new `GeometryNodeShell` follow-up layout into a single-column stacked flow so `Geometry/Sketch` items stop competing for narrow left/right rails and each major item gets its own full row.` 

#### Scope / Constraints Honored
- Kept this follow-up limited to the new geometry shell layout.
- Left `Geometry/Extrude` and legacy node families unchanged.
- Did not alter graph behavior, ports, or schema.

#### Summary of Implementation
- Reworked `GeometryNodeShell` from a three-column rail layout into a stacked single-column shell.
- Kept the same header, summary strip, content sections, and diagnostics footer, but gave inputs and outputs their own full-width rows.
- Preserved the first-cut `Geometry/Sketch` migration while removing the cramped side-by-side presentation that did not fit current node widths.

#### Files Changed
- `src/app/spaghetti/canvas/GeometryNodeShell.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- `Geometry/Sketch` now presents inputs, workflow sections, and outputs in a full-width stacked order instead of narrow side rails.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`
- Ran `cmd /c npx tsc --noEmit`

<!-- ENTRY 412 -->
### [412] - 2026-03-18 15:13 - `SP - Phase 11 - Geometry Node Shell And Sketch Layout Cleanup`
<!-- ENTRY 412 -->
HUMAN SUMMARY: `Implemented the first graph-native node-shell cleanup cut by adding a reusable `GeometryNodeShell`, migrating `Geometry/Sketch` onto the new rail-based layout, and leaving `Geometry/Extrude` plus older node families visually unchanged as legacy.` 

#### Scope / Constraints Honored
- Kept this implementation to the first cleanup cut from note `[176]`: shared shell plus `Geometry/Sketch`.
- Left `Geometry/Extrude` functionally and visually unchanged in this pass.
- Did not change graph schema, node ids, or public port contracts.

#### Summary of Implementation
- Added a reusable `GeometryNodeShell` component for the forward `Geometry/*` node family.
- Moved `Geometry/Sketch` onto the new shell with a header, summary strip, left/right rails, content-column sections, and a diagnostics footer.
- Replaced the old forward sketch section labels with the new structural labels: `Plane`, `Draw`, `Entities`, and `Review`.
- Kept sketch viewer/session behavior intact while freezing older node layouts as the legacy presentation model.
- Updated the sketch renderer test to assert the new shell and the removal of the old prose labels.

#### Files Changed
- `src/app/spaghetti/canvas/GeometryNodeShell.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- `Geometry/Sketch` now renders through the new shared geometry shell instead of its older bespoke top/bottom section layout.
- Sketch ports now sit in left/right rails, and sketch diagnostics render in a dedicated footer area.
- Older non-geometry nodes continue to render through their existing layouts.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/spaghetti/canvas/NodeView.test.tsx`
- Ran `cmd /c npx tsc --noEmit`

<!-- ENTRY 411 -->
### [411] - 2026-03-18 15:07 - `OO - Phase 13 - Geometry Node-Shell Notes Made Implementation-Ready`
<!-- ENTRY 411 -->
HUMAN SUMMARY: `Rewrote note `[176]` in `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md` `into a decision-complete implementation spec for the first graph-native node-shell cleanup cut, locking the shared `GeometryNodeShell` contract, the first `Geometry/Sketch` migration, and legacy-node treatment.` 

#### Scope / Constraints Honored
- Kept this change limited to planning/docs and permanent project-history tracking.
- Did not change runtime code, schemas, or the active geometry implementation.
- Preserved the existing Codex-notes numbering by rewriting the contents of `[176]` instead of creating a duplicate decision note.

#### Summary of Implementation
- Reframed note `[176]` from a directional “what I would do next” entry into an executable cleanup spec.
- Locked the first cleanup cut as `shared shell + Geometry/Sketch`, with `Geometry/Extrude` explicitly deferred to the next follow-up.
- Defined the shared `GeometryNodeShell` structure, the exact first `Sketch` migration layout, the legacy/frozen treatment for older nodes, and the implementation order and acceptance criteria.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- None. This was a docs-only planning-spec rewrite.

#### Verification Steps
- Confirmed note `[176]` now contains current-code truth, chosen contract, implementation order, acceptance criteria, and explicit defers.
- Confirmed the note now locks `GeometryNodeShell` and the first `Geometry/Sketch` migration instead of leaving those as open design suggestions.
- Confirmed this permanent changelog entry records the planning-spec rewrite.

<!-- ENTRY 410 -->
### [410] - 2026-03-18 14:38 - `OO - Phase 13 - Geometry Node-Shell Cleanup Notes Expansion`
<!-- ENTRY 410 -->
HUMAN SUMMARY: `Expanded the active `12_CodexChatNotes.md` `planning surface with a concrete next-step sequence for rebuilding the graph-native geometry node shell, including suggested answers for how to treat `Sketch`, `Extrude`, and the older part-style layout.` 

#### Scope / Constraints Honored
- Kept this change limited to planning notes and permanent docs-history tracking.
- Did not change runtime code, task execution specs, or the current geometry implementation.
- Preserved the existing Codex-notes numbering flow by adding a new top entry instead of rewriting older notes.

#### Summary of Implementation
- Added a new numbered note to `12_CodexChatNotes.md` describing the recommended order for geometry-node cleanup work.
- Recorded suggested answers for where the cleanup spec should live, what the shared shell contract should look like, how to classify the older node layout, and why `Sketch` should move before `Extrude`.
- Kept the guidance framed around a reusable future `GeometryNodeShell` instead of continuing ad hoc `NodeView` branching.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- None. This was a docs-only planning-note expansion.

#### Verification Steps
- Confirmed the new `[176]` note appears at the top of `12_CodexChatNotes.md`.
- Confirmed the note includes the requested next-step list plus concrete suggested answers.
- Confirmed this permanent changelog entry records the notes expansion.

<!-- ENTRY 409 -->
### [409] - 2026-03-18 14:24 - `OO - Phase 13 - Codex Notes Surface For Node-Template Cleanup`
<!-- ENTRY 409 -->
HUMAN SUMMARY: `Created the new active `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md` `notes surface for post-`3.2B` / `3.2C` node-template cleanup planning, and updated the docs map so that new planning scratchpad is discoverable.` 

#### Scope / Constraints Honored
- Kept this change limited to documentation surfaces and permanent docs-history tracking.
- Did not change runtime code, tests, or the existing geometry implementation.
- Preserved the existing numbered Codex-notes sequence instead of rewriting older note files.

#### Summary of Implementation
- Created `12_CodexChatNotes.md` as the new active Codex-notes file for pre-`3.2D` node-template cleanup planning.
- Seeded the file with initial notes about stabilizing `Geometry/Sketch` and `Geometry/Extrude` before moving on to `Loft`.
- Updated `docs/Doc-Index.md` so the new notes file appears in both local doc history and the foldable `CodexNotes` tree.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Index.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- None. This was a docs-only planning-surface addition.

#### Verification Steps
- Confirmed `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md` exists and follows the current Codex-notes structure.
- Confirmed `docs/Doc-Index.md` now lists `12_CodexChatNotes.md` under the foldable `CodexNotes` section.
- Confirmed this permanent changelog entry records the new active notes surface.

<!-- ENTRY 408 -->
### [408] - 2026-03-18 14:15 - `SP - Phase 11 - 3.2 Roadmap Status Sync After 3.2B And 3.2C`
<!-- ENTRY 408 -->
HUMAN SUMMARY: `Updated the live roadmap so shipped `3.2B` sketch authoring and `3.2C` graph-native extrude work now read as complete, while keeping the parent `[3.2]` lane partial because `3.2D` loft is still open.` 

#### Scope / Constraints Honored
- Kept this change limited to roadmap status tracking and permanent changelog maintenance.
- Did not change runtime code, tests, or task-doc implementation specs.
- Kept the parent `[3.2]` family marker honest instead of force-closing the whole geometry lane early.

#### Summary of Implementation
- Added a new roadmap doc-history note recording the `3.2B` and `3.2C` status promotion.
- Flipped the compact Lane `[3]` checklist rows for `[3.2B]` and `[3.2C]` from open to complete.
- Marked the `### [3.2B]` and `### [3.2C]` title rows complete.
- Flipped the `3.2B` and `3.2C` checklist bodies to shipped state while leaving `[3.2D]` and the parent `[3.2]` family still open/partial.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- No runtime behavior changes. This is roadmap tracking only.

#### Verification Steps
- Read back the live Lane `[3]` summary checklist in `roadmap.md`.
- Read back the `[3.2B]` and `[3.2C]` roadmap sections to confirm their title and checklist markers now match shipped implementation state.

<!-- ENTRY 407 -->
### [407] - 2026-03-18 14:12 - `SP - Phase 11 - 3.2C Graph-Native Geometry/Extrude Implementation`
<!-- ENTRY 407 -->
HUMAN SUMMARY: `Implemented the first graph-native \`Geometry/Extrude\` slice on top of \`Geometry/Sketch\`, including the new extrude node template, selected-\`SketchProfile\` input contract, plane-aware compile/runtime lowering, and Output Preview compatibility for published \`solidBody\` results.` 

#### Scope / Constraints Honored
- Implemented `3.2C` on the graph-native geometry path instead of reviving the old feature-stack UI as the primary host.
- Kept the first public node surface narrow: selected profile input, depth, `Basic` extrude, and one `SolidBody` output.
- Preserved legacy part-node/feature-stack behavior while extending shared compile/runtime seams to carry graph-native extrude bodies.

#### Summary of Implementation
- Added a user-addable `Geometry/Extrude` node in the registry with a dedicated `extrude` template, `ExtrusionProfile` plus `Depth` inputs, and `SolidBody` output behavior gated to valid `Basic` extrudes.
- Added selector/view-model support and a dedicated canvas template so the extrude node now renders its own graph-native UI surface with profile summary, editable local depth fallback, `Basic` mode, visible deferred `Twist`, and body summary.
- Extended graph compilation so `Geometry/Extrude` is lowered into owned runtime feature-stack IR as its own build part, carrying selected-profile sketch data and sketch-plane orientation from the upstream `Geometry/Sketch`.
- Extended the worker CAD runtime so extrudes can follow `XY`, `XZ`, and `YZ` sketch planes instead of assuming global `+Z`.
- Widened Output Preview connection compatibility so dynamic `in:solid:*` slots accept graph-native `solidBody` sources while remaining compatible with legacy `toeLoft` publishers.
- Added focused tests covering registry/evaluator contracts, validation, node rendering, compile IR, plane-aware runtime execution, and build artifact output.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/registry/nodeRegistry.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/contracts/endpoints.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/parts/partKeyResolver.ts`
- `src/worker/cad/cadKernelAdapter.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/buildModel.ts`

#### Behavior Changes (if any)
- The node palette now includes a graph-native `Geometry/Extrude` node.
- `Geometry/Extrude` can publish `SolidBody` into Output Preview slots.
- Graph-native extrudes now build preview/runtime bodies that respect `XY`, `XZ`, and `YZ` sketch-plane orientation.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/spaghetti/registry/nodeRegistry.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/compiler/compileGraph.test.ts src/worker/cad/featureStackRuntime.test.ts`
- Ran `cmd /c npx tsc --noEmit`

<!-- ENTRY 406 -->
### [406] - 2026-03-18 13:11 - `SP - Phase 11 - 3.2C Graph-Native Extrude Spec Rewrite`
<!-- ENTRY 406 -->
HUMAN SUMMARY: `Rewrote the \`3.2C\` extrude task doc into a decision-complete graph-native implementation spec, locking \`Geometry/Extrude\`, selected-\`SketchProfile\` input, all-three-plane runtime honesty, and preview-pipeline participation for the first body-producing node.` 

#### Scope / Constraints Honored
- Kept this change limited to the `3.2C` task doc and permanent changelog tracking.
- Did not change runtime code, tests, roadmap status, or neighboring task files.
- Replaced remaining implementation decisions in the doc instead of adding another planning-only appendix.

#### Summary of Implementation
- Reworked `03.2C - SP-NI-FS-GE - Extrude Foundation.md` around the shipped graph-native geometry path from `Geometry/Sketch`.
- Locked `Geometry/Extrude` as the primary user-facing host, with public input restricted to selected `SketchProfile` and a minimal first-pass node surface.
- Locked runtime honesty so extrusion must follow `XY`, `XZ`, and `YZ` sketch-plane normal rather than staying on global `+Z`.
- Locked evaluator-facing `SolidBody` success/null output behavior and made preview/body visibility part of `3.2C`, not a later follow-up.
- Replaced the old prep-question tail section with concrete implementation seams, implementation order, acceptance criteria, and tests for the graph-native extrude slice.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/03.2C - SP-NI-FS-GE - Extrude Foundation.md`

#### Behavior Changes (if any)
- No runtime behavior changes. This is documentation-only.

#### Verification Steps
- Read back the updated `docs/Phase-Plans/Tasks/Future/03.2C - SP-NI-FS-GE - Extrude Foundation.md` to confirm it now locks:
  - graph-native `Geometry/Extrude`
  - selected-`SketchProfile` public input
  - `XY/XZ/YZ` plane-normal runtime requirement
  - preview/body visibility as part of `3.2C`

<!-- ENTRY 405 -->
### [405] - 2026-03-18 12:56 - `SP - Phase 11 - 3.2C Prep Decisions Restructured Into Sections`
<!-- ENTRY 405 -->
HUMAN SUMMARY: `Reworked the bottom prep block in the \`3.2C\` extrude task doc into foldable `###` decision sections, each with explicit current-code truth, the decision to lock, and a suggested default.` 

#### Scope / Constraints Honored
- Kept this change limited to task-document structure and wording.
- Did not change runtime code, tests, or roadmap status.
- Preserved the same prep topics while making them easier to execute against one by one.

#### Summary of Implementation
- Replaced the flat `Prep Questions / Decisions To Lock Before Implementation` bullet list in `03.2C - SP-NI-FS-GE - Extrude Foundation.md` with dedicated `###` subsections.
- Broke each prep topic into:
  - current code truth
  - the specific decision to lock
  - a suggested default
- Kept the sections focused on the real `3.2C` tensions:
  - graph-native `Geometry/Extrude` host shape
  - public profile-source model
  - sketch-plane normal versus current global-`Z` runtime
  - taper/offset compatibility handling
  - `SolidBody` output seam
  - first-pass node surface scope
  - failure semantics

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/03.2C - SP-NI-FS-GE - Extrude Foundation.md`

#### Behavior Changes (if any)
- No runtime behavior changes. This is documentation-only.

#### Verification Steps
- Read back the bottom of `docs/Phase-Plans/Tasks/Future/03.2C - SP-NI-FS-GE - Extrude Foundation.md` to confirm the prep topics now appear as their own `###` sections with suggested defaults.

<!-- ENTRY 404 -->
### [404] - 2026-03-18 12:53 - `SP - Phase 11 - 3.2C Extrude Prep Decision Addendum`
<!-- ENTRY 404 -->
HUMAN SUMMARY: `Appended a bottom prep-decision section to the \`3.2C\` task doc so the first graph-native extrude implementation is blocked on the real code-backed questions, especially node-host shape and the current global-\`Z\` runtime limitation.` 

#### Scope / Constraints Honored
- Kept this as task-doc preparation only.
- Did not change runtime code, tests, or roadmap status.
- Grounded the added questions in the current feature-stack extrude code and worker runtime instead of adding generic CAD planning.

#### Summary of Implementation
- Added a new `Prep Questions / Decisions To Lock Before Implementation` section at the bottom of `03.2C - SP-NI-FS-GE - Extrude Foundation.md`.
- Recorded the main implementation-prep questions around:
  - whether `3.2C` ships as a real `Geometry/Extrude` node or only reuses old feature-stack host surfaces
  - whether the public contract consumes only selected `SketchProfile`
  - whether extrusion must follow sketch-plane normal now or may temporarily stay `XY -> +Z`
  - how taper/offset remain compatibility-only
  - how the public `SolidBody` output maps to internal `bodyId`
  - how failure diagnostics should surface in the graph-native path

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/03.2C - SP-NI-FS-GE - Extrude Foundation.md`

#### Behavior Changes (if any)
- No runtime behavior changes. This is documentation-only.

#### Verification Steps
- Read back the bottom of `docs/Phase-Plans/Tasks/Future/03.2C - SP-NI-FS-GE - Extrude Foundation.md` to confirm the new prep-decision section landed with the intended code-backed questions and defaults.

<!-- ENTRY 403 -->
### [403] - 2026-03-18 12:44 - `SP - Phase 11 - Sketch Session Positioned Overlay Fix`
<!-- ENTRY 403 -->
HUMAN SUMMARY: `Made the floating sketch session window a positioned overlay element so its existing inline \`left\` / \`top\` coordinates now move it correctly instead of leaving it stuck under the Browser area.` 

#### Scope / Constraints Honored
- Kept the fix limited to the sketch session window CSS positioning path.
- Did not change sketch tool behavior, viewer rendering, or overlay state management.
- Reused the existing drag/spawn logic instead of introducing a second movement implementation.

#### Summary of Implementation
- Added `position: absolute` to `.ViewportOverlaySketchSessionWindow` in `src/app/theme/v15Theme.css`.
- This allows the existing inline `left` / `top` values from `ViewportOverlay.tsx` to take visual effect in layout.
- The change addresses both the apparent spawn-under-Browser issue and the non-moving titlebar drag behavior caused by the window still being in normal flow.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes (if any)
- The sketch draw/review window now behaves like a true floating overlay window and should visually move when dragged.
- Initial spawn positioning should now honor the existing overlay placement math instead of appearing pinned under the left Browser area.

#### Verification Steps
- No automated tests were run for this CSS-only positioning fix.
- Recommended manual check: open `Geometry/Sketch`, enter sketch draw, verify the window appears as a floating overlay and moves when dragging the title bar.

<!-- ENTRY 402 -->
### [402] - 2026-03-18 12:39 - `SP - Phase 11 - 3.2B Close-Out Drag Diagnosis Note`
<!-- ENTRY 402 -->
HUMAN SUMMARY: `Added a bottom-of-doc close-out note to the \`3.2B\` task spec capturing the current sketch session titlebar drag diagnosis and the likely missing positioned-window rule.` 

#### Scope / Constraints Honored
- Kept this update limited to task-document maintenance.
- Did not change runtime code, tests, or roadmap status.
- Recorded the current diagnosis in the phase doc rather than leaving it only in chat context.

#### Summary of Implementation
- Added a new `Close-Out Notes` section at the bottom of `03.2B - SP-NI-FS-GE - Sketch Operation Authoring.md`.
- Captured that the sketch session window still appears non-draggable in the live app because its inline `left` / `top` positioning may not take visual effect without a `position: absolute` rule.
- Noted that the current test only verifies inline style mutation and does not yet prove visible repositioning.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/03.2B - SP-NI-FS-GE - Sketch Operation Authoring.md`

#### Behavior Changes (if any)
- No runtime behavior changes. This is documentation-only.

#### Verification Steps
- Read back the bottom of `docs/Phase-Plans/Tasks/Future/03.2B - SP-NI-FS-GE - Sketch Operation Authoring.md` to confirm the new `Close-Out Notes` section landed with the intended diagnosis text.

<!-- ENTRY 401 -->
### [401] - 2026-03-18 12:49 - `SP - Phase 11 - Sketch Session Overlay Dock-Aware Spawn And Stack Fix`
<!-- ENTRY 401 -->
HUMAN SUMMARY: `Raised the sketch session overlay above Browser chrome and corrected its spawn math so the window opens relative to the live viewer overlay host instead of raw page coordinates.` 

#### Scope / Constraints Honored
- Kept the existing sketch session window model and tool flow intact.
- Focused this fix on initial placement, drag clamping, and overlay stacking without changing sketch data, viewer rendering, or tool definitions.
- Reused the existing viewport overlay component instead of introducing a second floating-window host.

#### Summary of Implementation
- Updated `ViewportOverlay.tsx` so sketch overlay spawn and drag math now resolve against the local `ViewportOverlayRoot` bounds.
- Switched the browser anchor lookup to the dock target container and corrected the computed spawn position to viewer-local coordinates.
- Reused the overlay-host bounds for sketch plane picker movement and sketch session resize clamping so these windows stay inside the active viewer pane.
- Raised `.ViewportOverlayRoot` above the left dock/browser layer in `v15Theme.css`.
- Added a `ViewportOverlay.test.tsx` regression case that exercises dock-aware spawn behavior when the overlay host does not start at page `x = 0`.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes (if any)
- The sketch session window now opens above Browser chrome instead of behind it.
- Initial sketch session placement now respects the viewer overlay host coordinate space, so it opens to the right of the docked Browser more reliably.
- Dragging and resizing now clamp to the actual overlay host dimensions instead of the full page window.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc --noEmit`

<!-- ENTRY 400 -->
### [400] - 2026-03-18 12:27 - `SP - Phase 11 - Sketch Session Titlebar Mouse Drag Fix`
<!-- ENTRY 400 -->
HUMAN SUMMARY: `Hardened the sketch session titlebar drag path for real desktop interaction by adding an explicit mouse-drag fallback and stopping the header close button from participating in drag starts.` 

#### Scope / Constraints Honored
- Kept the existing sketch session window movement and resize model intact.
- Focused this fix on the live titlebar-drag interaction path instead of changing viewer rendering, sketch tools, or session state.
- Reused the existing drag state and viewport clamping logic rather than creating a second movement system.

#### Summary of Implementation
- Refactored sketch session window dragging in `ViewportOverlay.tsx` behind a shared `beginSketchSessionWindowDrag(...)` path.
- Added a `mousedown` drag fallback on the titlebar so desktop mouse interaction works even when the pointer-only path is insufficient in the live app.
- Prevented the sketch session close button from bubbling both pointer and mouse down events into the draggable titlebar surface.
- Updated the overlay test to exercise the titlebar move path with mouse events instead of only synthetic pointer events.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Dragging the sketch session titlebar with a desktop mouse now moves the window reliably.
- Clicking the header close button no longer risks starting a drag interaction.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc --noEmit`

<!-- ENTRY 399 -->
### [399] - 2026-03-18 12:22 - `SP - Phase 11 - Sketch Session Window Drag And Resize`
<!-- ENTRY 399 -->
HUMAN SUMMARY: `Made the floating sketch draw/review window behave like a proper movable tool window by keeping titlebar dragging active, preventing header chrome from stealing drag starts, and adding resize handles on every edge and corner.` 

#### Scope / Constraints Honored
- Kept the existing sketch session flow, ParaSlider controls, and viewer-rendered sketch geometry intact.
- Limited this change to window movement and resize behavior for the floating sketch session overlay.
- Reused the repo’s existing floating-toolbar resize pattern rather than inventing a separate windowing system.

#### Summary of Implementation
- Added full edge and corner resize handles to the sketch session window in `ViewportOverlay.tsx` with viewport-clamped width, height, and position updates.
- Preserved titlebar dragging and improved it by making the titlebar explicitly non-selectable and by stopping the close button from bubbling `pointerdown` into the drag surface.
- Added overlay test coverage that verifies the resize handles render and that dragging/resizing updates the window position and size.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The floating sketch draw/review window can now be moved by dragging its title bar.
- The same window can now be resized from all four edges and all four corners.
- Window position is no longer reset on draw/review mode switches for the same active sketch session.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc --noEmit`

<!-- ENTRY 398 -->
### [398] - 2026-03-18 12:17 - `SP - Phase 11 - Sketch Draw ParaSlider Theme Scope Fix`
<!-- ENTRY 398 -->
HUMAN SUMMARY: `Extended the existing \`ParaSlider\` theme selectors into the floating sketch session window so the left/right cap buttons and value field now visually match the rest of the app's slider styling.` 

#### Scope / Constraints Honored
- Kept this fix purely in theme scoping instead of changing sketch behavior or replacing the `ParaSlider` component.
- Reused the existing ParaSlider visual system and only expanded the selector coverage to the sketch overlay container.
- Left the slider interaction model and viewer-rendered sketch behavior untouched.

#### Summary of Implementation
- Added `.ViewportOverlaySketchSessionWindow` to the existing `ParaSlider` cap, clamp-handle, and value-button theme selector groups in `v15Theme.css`.
- This makes the floating sketch draw window inherit the same cap-button borders, transparent value button styling, and hover/focus treatment already used in panels and toolbars.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The sketch draw `ParaSlider` controls now visually match the rest of the app instead of showing unthemed white cap buttons and mismatched value-field chrome.

#### Verification Steps
- CSS readback only; no runtime tests were run for this styling-only selector update.

<!-- ENTRY 397 -->
### [397] - 2026-03-18 12:08 - `SP - Phase 11 - Sketch Draw ParaSlider Controls`
<!-- ENTRY 397 -->
HUMAN SUMMARY: `Replaced the raw numeric draft inputs in the floating sketch draw window with repo-standard \`ParaSlider\` controls so every sketch draw value now uses the same slider-plus-direct-edit interaction model used elsewhere in the app.` 

#### Scope / Constraints Honored
- Kept the existing `3.2B` / `3.2B-2` sketch session flow, store draft state, and viewer rendering behavior intact.
- Limited this change to the draw-window numeric control surface instead of redesigning tool behavior or adding new sketch commands.
- Reused the existing `ParaSlider` component rather than introducing a one-off sketch-only slider.

#### Summary of Implementation
- Swapped the sketch draw draft rows in `ViewportOverlay.tsx` from plain number inputs to `ParaSlider` controls for line, arc, spline, rectangle, and circle fields.
- Applied a broad first-pass draft range with the existing `0.1` precision so slider control works across normal sketch-entry values without changing stored geometry semantics.
- Updated the overlay test to assert that the sketch draw window now renders `ParaSlider` controls.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes
- All numeric draft values in sketch draw now use `ParaSlider` controls with direct value editing built into the slider.
- The old raw number inputs are no longer the primary sketch draw control surface.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npx tsc --noEmit`

<!-- ENTRY 396 -->
### [396] - 2026-03-18 12:04 - `SP - Phase 11 - 3.2B-2 Viewer Sketch Overlay Implementation`
<!-- ENTRY 396 -->
HUMAN SUMMARY: `Implemented the \`3.2B-2\` correction by moving sketch draw/review rendering out of the floating panel and into a real \`Viewer\` overlay path, while keeping the floating sketch session window as controls-only UI.` 

#### Scope / Constraints Honored
- Kept the existing `Geometry/Sketch` node, store-owned sketch data, and `3.2B` draw/review flow intact instead of redesigning sketch authoring.
- Added a real viewer-backed render path through `viewerBridge`, `ViewerHost`, and `Viewer`, and removed the old embedded sketch preview card from the floating session window.
- Left direct viewport drawing, entity hit-testing, and richer snapping explicitly out of this cut.

#### Summary of Implementation
- Added a `GeometrySketchOverlayVm` viewer contract and a render helper that maps `XY`, `XZ`, and `YZ` sketch data into world-space overlay polylines with distinct component, profile, and selected-profile layers.
- Synced active sketch session state from `ViewerHost` into `Viewer`, where lightweight line overlay geometry is now created and cleared as sessions open, close, and switch between draw and review.
- Simplified `ViewportOverlay` so the floating sketch session window is controls-only and no longer renders the primary sketch canvas internally.

#### Files Changed
- `src/app/viewerBridge.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/theme/v15Theme.css`
- `src/viewer/Viewer.ts`
- `src/viewer/geometrySketchOverlay.ts`
- `src/viewer/geometrySketchOverlay.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Active sketch geometry now renders in the shared `Viewer` scene instead of inside the floating sketch session window.
- Review mode now highlights detected and selected profiles in the `Viewer`.
- The floating sketch session window now presents commands, numeric inputs, review controls, and entity summaries without an embedded primary preview card.

#### Verification Steps
- `cmd /c npx vitest run src/app/components/ViewerHost.test.tsx src/app/components/ViewportOverlay.test.tsx src/viewer/geometrySketchOverlay.test.ts`
- `cmd /c npx tsc --noEmit`

<!-- ENTRY 395 -->
### [395] - 2026-03-18 11:52 - `SP - Phase 11 - 3.2B-2 Viewer-Backed Sketch Overlay Spec Lock`
<!-- ENTRY 395 -->
HUMAN SUMMARY: `Rewrote the \`3.2B-2\` follow-up doc into a decision-complete implementation spec that explicitly chooses a real \`Viewer\` overlay API, removes the large embedded preview card as a requirement, and locks the bridge between store state, \`ViewerHost\`, \`viewerBridge\`, and \`Viewer\`.` 

#### Scope / Constraints Honored
- Kept this as a docs-only refinement of the existing `3.2B-2` follow-up instead of implementing the viewer overlay itself.
- Replaced the old generic “main viewport overlay path” wording with a concrete architectural choice so the implementer no longer needs to decide between HTML overlay rendering and viewer-layer rendering.
- Kept direct viewport drawing, hit-testing, snapping upgrades, and broader workspace/window architecture explicitly deferred.

#### Summary of Implementation
- Updated the `3.2B-2` task doc to lock `ViewerHost -> viewerBridge -> Viewer` as the canonical render path for sketch overlay state.
- Added the explicit `GeometrySketchOverlayVm` plus `setGeometrySketchOverlay(...)` contract, the required 2D-to-3D plane mapping rules, the tightened implementation order, and viewer-focused verification coverage.
- Converted “remove the large preview card” from a preference into a hard requirement for this follow-up.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/03.2B-2 - SP-NI-FS-GE - Main Viewport Sketch Rendering And Toolbar Split.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Read back the current `3.2B-2` doc and the live sketch-render seam in `src/app/components/ViewportOverlay.tsx`.
- Confirmed `Viewer` currently exposes no sketch overlay API and that `viewerBridge.ts` is the correct public seam to extend.
- Performed a docs readback after patching; no runtime code or automated tests were run.

<!-- ENTRY 394 -->
### [394] - 2026-03-18 11:35 - `SP - Phase 11 - 3.2B-2 Main Viewport Sketch Rendering And Toolbar Split`
<!-- ENTRY 394 -->
HUMAN SUMMARY: `Created a new future task doc for \`3.2B-2\` `to capture the follow-up correction where the floating sketch window stays controls-only and the actual sketch geometry moves into the main model viewport.` 

#### Scope / Constraints Honored
- Kept this as a narrow follow-up planning doc under the existing `3.2B` geometry lane instead of reopening the broader sketch-authoring spec.
- Locked the current shipped problem against the real code seam in `ViewportOverlay.tsx` where the embedded preview card is still acting as the active render surface.
- Left later direct viewport drawing depth, richer snapping, and broader workspace/window architecture explicitly deferred.

#### Summary of Implementation
- Added `docs/Phase-Plans/Tasks/Future/03.2B-2 - SP-NI-FS-GE - Main Viewport Sketch Rendering And Toolbar Split.md` as an implementation-ready execution spec.
- Defined the corrected surface split so the floating sketch window owns commands/context while the main model viewport owns visible sketch and review rendering.
- Locked implementation order, acceptance criteria, manual checks, and deferred items around this render-surface correction.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/03.2B-2 - SP-NI-FS-GE - Main Viewport Sketch Rendering And Toolbar Split.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Read back the live `3.2B` task doc format and neighboring geometry task docs for consistency before creating the new subtask file.
- Confirmed the current shipped seam with `rg -n "renderSketchPreview|ViewportOverlaySketchPreviewCard" src/app/components/ViewportOverlay.tsx`.
- Performed a docs readback after creation; no runtime code or automated tests were involved in this change.

<!-- ENTRY 393 -->
### [393] - 2026-03-18 11:18 - `SP - Phase 11 - 3.2B Sketch Operation Authoring`
<!-- ENTRY 393 -->
HUMAN SUMMARY: `Implemented the first real \`3.2B\` `Geometry/Sketch` `authoring slice by replacing the old placeholder shell with draw/review actions, a viewport-side sketch session window, managed rectangle/circle sketch data, and explicit selected-profile output behavior for downstream geometry work.` 

#### Scope / Constraints Honored
- Kept this cut on the graph-native `Geometry/Sketch` path instead of reviving the part feature-stack UI as the primary editor.
- Limited the implementation to the first-pass `Line / Arc3Point / BezierSpline / Rectangle / Circle` draw/review flow and selected-profile handoff.
- Preserved the existing `3.2A` plane-pick foundation and the compatibility seams already in place for later `3.2C` downstream work.

#### Summary of Implementation
- Extended managed sketch data with first-class `rectangle` and `circle` components plus selected-profile state in the sketch UI payload.
- Upgraded profile derivation so ordered closed chains can resolve multiple profiles and so `Geometry/Sketch` can publish either the explicit selected profile or the only resolved profile when there is just one.
- Added new geometry-sketch store APIs for draw/review session state, component mutation, ordering, removal, and selected-profile updates.
- Replaced the old sketch placeholders in `NodeView` with real `Draw` and `Review` rows, entity summaries, diagnostics, and review-state summaries.
- Added a viewport overlay sketch session window with draggable title bar, draw-tool switching, numeric authoring inputs, primitive preview rendering, and profile-review cards.

#### Files Changed
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/profileDerivation.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/features/profileDerivation.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- `Geometry/Sketch` now supports real in-app draw/review authoring instead of only plane selection and placeholders.
- `SketchProfile` now honors explicit selected-profile state for multi-profile sketches while still auto-resolving the only profile when there is exactly one.
- The viewport overlay now hosts a draggable sketch draw/review window in addition to the earlier sketch-plane picker.

#### Verification Steps
- `cmd /c npx vitest run src/app/spaghetti/features/profileDerivation.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/registry/nodeRegistry.test.ts`
- `cmd /c npx tsc --noEmit`

<!-- ENTRY 392 -->
### [392] - 2026-03-18 11:01 - `SP - Phase 11 - 3.2B Implementation-Ready Spec Refresh`
<!-- ENTRY 392 -->
HUMAN SUMMARY: `Refreshed the \`03.2B - SP-NI-FS-GE - Sketch Operation Authoring.md\` task doc so it now matches the shipped \`3.2A\` `Geometry/Sketch` `reality, making the next sketch-authoring phase explicitly build on the landed node shell, store session state, and viewport overlay flow instead of older feature-stack-first ownership.` 

#### Scope / Constraints Honored
- Kept this pass to docs-only implementation-planning maintenance.
- Updated only the live `03.2B` execution spec and this permanent changelog.
- Preserved the already-landed `3.2A` substrate and rewrote `03.2B` only to align it with current code truth.

#### Summary of Implementation
- Reframed `03.2B` around the shipped `Geometry/Sketch` node, its existing `Inputs / Draw/Edit Curves Inside / Close / Select Profile / Outputs` shell, and the `3.2A` plane-pick foundation.
- Replaced stale feature-stack-first ownership language with the modern primary seam set: `nodeRegistry`, `selectNodeVm`, `NodeView`, `useSpaghettiStore`, and `ViewportOverlay`.
- Demoted `SketchFeatureView`, `CloseProfileFeatureView`, and `FeatureStackView` to compatibility/reference seams only.
- Tightened the locked workflow, implementation order, interfaces, acceptance criteria, and test plan so `03.2B` now reads as the next executable draw/review phase instead of mixed old/new planning language.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/03.2B - SP-NI-FS-GE - Sketch Operation Authoring.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed. This was a docs-only implementation-readiness refresh.

#### Verification Steps
- Read back the refreshed `03.2B` task doc after editing to verify the ownership model, seam list, workflow, and test plan all align with the shipped `3.2A` `Geometry/Sketch` path.

<!-- ENTRY 391 -->
### [391] - 2026-03-18 10:54 - `OO - Phase 13 - 3.2A Task Lifecycle Move To Old`
<!-- ENTRY 391 -->
HUMAN SUMMARY: `Moved the completed \`03.2A - SP-NI-FS-GE - Data Types And Sketch Foundation.md\` phase doc from \`Tasks/Future\` to \`Tasks/Old\`, added a local doc-history note inside the moved file, and re-pointed the neighboring `3.2` family docs so they now reference the landed `3.2A` spec at its completed-history location.` 

#### Scope / Constraints Honored
- Kept this pass to phase-doc lifecycle maintenance only.
- Preserved the completed `3.2A` execution spec content and added only the small local history note needed to explain the move.
- Updated only the live neighboring phase-doc references that still pointed at the stale `Tasks/Future` location.

#### Summary of Implementation
- Added a local `Doc History` entry to `03.2A` recording that the phase shipped and was moved into completed history.
- Moved `03.2A` from `docs/Phase-Plans/Tasks/Future/` to `docs/Phase-Plans/Tasks/Old/`.
- Updated the `03.2` parent doc plus the `03.2B` and `03.2C` child docs so their source-input references now point at the `Tasks/Old` `03.2A` path.

#### Files Changed
- `docs/Phase-Plans/Tasks/Old/03.2A - SP-NI-FS-GE - Data Types And Sketch Foundation.md`
- `docs/Phase-Plans/Tasks/Future/03.2 - SP-NI-FS-GE - Foundational Geometry Node System.md`
- `docs/Phase-Plans/Tasks/Future/03.2B - SP-NI-FS-GE - Sketch Operation Authoring.md`
- `docs/Phase-Plans/Tasks/Future/03.2C - SP-NI-FS-GE - Extrude Foundation.md`

#### Behavior Changes (if any)
- The `3.2A` phase doc now lives in `Tasks/Old` instead of `Tasks/Future`, matching its shipped status.

#### Verification Steps
- Confirmed `docs/Phase-Plans/Tasks/Old/03.2A - SP-NI-FS-GE - Data Types And Sketch Foundation.md` exists and the old `Tasks/Future` path no longer exists.
- Re-ran a docs search to confirm the live `03.2` family docs now point at the `Tasks/Old` `3.2A` path.

<!-- ENTRY 390 -->
### [390] - 2026-03-18 10:36 - `OO - Phase 13 - Roadmap 3.2A Closeout Status Refresh`
<!-- ENTRY 390 -->
HUMAN SUMMARY: `Updated the live roadmap to reflect the shipped `3.2A` geometry-foundation work, marking `[3.2A]` complete and moving the parent `[3.2]` lane to partial status now that the first foundational-geometry subphase is landed while `[3.2B-D]` remain open.` 

#### Scope / Constraints Honored
- Kept this pass limited to the live roadmap status markers and checklist state for the shipped `3.2A` slice.
- Did not reclassify task-doc file locations or broaden the update into `3.2B-D` planning changes.
- Left the checklist mirror unchanged because its `3.2A` breakdown, decision, and plan-doc tracking were already aligned.

#### Summary of Implementation
- Added a new roadmap history note recording the `3.2A` closeout status change.
- Flipped the parent `[3.2]` lane from not-started to partial.
- Marked `[3.2A] Data Types And Sketch Foundation` complete.
- Marked the `3.2A` checklist items complete so the live roadmap now matches the shipped `Geometry/Sketch` shell and sketch-plane picker work.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- The live roadmap now reports `3.2A` as shipped instead of still open.

#### Verification Steps
- Read back the edited `[3.2]` and `[3.2A]` roadmap block to confirm the parent lane, subphase status marker, and checklist markers are internally consistent.

<!-- ENTRY 389 -->
### [389] - 2026-03-18 10:22 - `OO - Phase 13 - Roadmap 3.2 Subphase Breakdown And Lane 3 Checklist Sync`
<!-- ENTRY 389 -->
HUMAN SUMMARY: `Expanded the live roadmap so `[3.2A]` through `[3.2D]` now each have their own foldable `###` section under the foundational geometry lane, and synced the roadmap checklist mirror so Lane `[3]` numbering plus `3.2` subphase tracking match the live roadmap again.` 

#### Scope / Constraints Honored
- Kept this pass limited to roadmap structure and tracker alignment.
- Preserved the existing `3.2A-D` intent and checklist content instead of rewriting the actual phase decisions.
- Synced the checklist mirror only where Lane `[3]` numbering and subphase tracking were stale.

#### Summary of Implementation
- Added a new roadmap history note for the `3.2` structure change.
- Reworked the parent `[3.2]` lane so its detailed `3.2A-D` acceptance bullets now live under dedicated `###` subsections with their own `Summary` and `CheckList` blocks.
- Simplified the parent `[3.2]` checklist to lane-level staging rules now that the subphase detail lives under the dedicated subsection blocks.
- Updated `roadmapCHECKLISTS.md` so Lane `[3]` now reflects the live `3.2` foundational-geometry lane, tracks `[3.2A-D]` individually, restores the missing `[3.6]` entry, and corrects the stale plan-status markers for the existing `03.1` and `03.2*` task docs.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`

#### Behavior Changes (if any)
- The roadmap now folds `3.2A`, `3.2B`, `3.2C`, and `3.2D` as separate visible roadmap sections instead of burying their detail under one combined parent checklist.

#### Verification Steps
- Read back the edited `[3.2]` roadmap block and the Lane `[3]` checklist mirror to confirm numbering, subphase labels, and tracker counts stayed internally consistent.

<!-- ENTRY 388 -->
### [388] - 2026-03-18 10:17 - `SP - Phase 3.2A - Data Types And Sketch Foundation`
<!-- ENTRY 388 -->
HUMAN SUMMARY: `Adjusted the sketch-plane picker spawn logic so it now opens to the right of the docked Browser/left-dock column instead of defaulting underneath that shell area when first shown.` 

#### Scope / Constraints Honored
- Kept this change limited to the picker's first-open placement logic.
- Reused the existing draggable overlay window instead of changing broader workspace layout behavior.
- Did not alter plane-selection behavior or sketch-node semantics.

#### Summary of Implementation
- Added a viewport-overlay spawn helper that reads the actual docked Browser or LeftDock bounds from the current shell DOM.
- Changed the initial picker position to anchor just to the right of that left-side shell area.
- Kept the existing fallback spawn location when the docked Browser host is not present.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`

#### Behavior Changes (if any)
- The sketch-plane picker should now open beside the Browser instead of behind it.

#### Verification Steps
- Ran `cmd /c npx tsc --noEmit`

<!-- ENTRY 387 -->
### [387] - 2026-03-18 10:15 - `SP - Phase 3.2A - Data Types And Sketch Foundation`
<!-- ENTRY 387 -->
HUMAN SUMMARY: `Promoted the temporary sketch-plane picker into a draggable overlay window with a real title bar, so the `SketchPlane` chooser no longer starts trapped against the lower console strip and can be moved around the viewport while picking `XY`, `XZ`, or `YZ`.` 

#### Scope / Constraints Honored
- Kept this follow-up limited to the existing `3.2A` in-app sketch-plane picker.
- Did not expand the picker into face-pick, custom planes, or `3.2B` drawing tools.
- Preserved the current spaghetti-store plane assignment flow and only improved the overlay host behavior.

#### Summary of Implementation
- Added a proper title bar and close button to the sketch-plane picker overlay.
- Added pointer-driven drag handling so the picker can be repositioned inside the viewport.
- Changed the picker spawn position from the lower-left edge to a safer upper-left position to avoid the console strip by default.
- Kept the `XY` / `XZ` / `YZ` selection flow unchanged while improving window usability.

#### Files Changed
- `src/app/components/ViewportOverlay.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes (if any)
- The sketch-plane picker now opens as a movable window instead of a fixed bottom-corner widget.
- Users can drag the picker by its title bar and close it from the window chrome.

#### Verification Steps
- Ran `cmd /c npx tsc --noEmit`

<!-- ENTRY 386 -->
### [386] - 2026-03-18 09:39 - `SP - Phase 3.2A - Data Types And Sketch Foundation`
<!-- ENTRY 386 -->
HUMAN SUMMARY: `Implemented the first graph-facing `Geometry/Sketch` node slice with new geometry port kinds, a dedicated sketch template, evaluator-derived sketch profile outputs, and the initial in-app sketch-plane pick flow through the spaghetti store and viewport overlay.` 

#### Scope / Constraints Honored
- Kept this implementation bounded to the first executable `3.2A` sketch shell instead of drifting into `3.2B` draw/review tooling.
- Reused the existing managed `SketchFeature` schema and profile-derivation helper instead of creating a second geometry-evaluation path.
- Left compile/build/runtime graph-native geometry execution out of scope for this phase.

#### Summary of Implementation
- Added `plane`, `sketchProfiles`, `sketchProfile`, and `solidBody` as first-class port kinds in the spaghetti schema, evaluator defaults, and canvas color mapping.
- Registered `Geometry/Sketch` as a new user-addable node with a dedicated `sketch` template, a managed `sketch` payload in params, a `SketchPlane` input, and evaluator outputs for `SketchProfiles` plus only-single `SketchProfile`.
- Extended selector and canvas rendering so sketch nodes expose sketch-specific VM state and render a dedicated shell with the locked `Inputs`, `Draw/Edit Curves Inside`, `Close/Select Profile`, and `Outputs` sections.
- Added the first sketch-plane pick session path in the spaghetti store and viewport overlay so the `SketchPlane` row `+` opens an in-app `XY` / `XZ` / `YZ` picker and persists the chosen local plane.
- Added focused test coverage for the sketch registry contract, evaluator behavior, and dedicated sketch node rendering.

#### Files Changed
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/typeColors.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/registry/nodeRegistry.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`

#### Behavior Changes (if any)
- The node palette now includes a first-class `Geometry/Sketch` node.
- Sketch nodes render through their own dedicated shell instead of the part template path.
- The viewport overlay can now enter a lightweight sketch-plane pick mode for active sketch nodes.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/spaghetti/registry/nodeRegistry.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- Ran `cmd /c npx tsc --noEmit`

<!-- ENTRY 385 -->
### [385] - 2026-03-18 08:39 - `SP - Phase 3.2A - Data Types And Sketch Foundation`
<!-- ENTRY 385 -->
HUMAN SUMMARY: `Rewrote the future `03.2A` task doc into a decision-complete implementation spec for the first graph-facing `Geometry/Sketch` shell, locking the dedicated sketch template, managed `SketchFeature` payload, evaluator-only profile semantics, and the viewer-side plane-pick boundary.` 

#### Scope / Constraints Honored
- Kept this pass focused on the future `03.2A` execution doc and its implementation boundary.
- Locked the current-code seams and output semantics without spilling `3.2B` draw/review work into this phase.
- Kept graph compile/build/runtime geometry execution explicitly out of scope for `3.2A`.

#### Summary of Implementation
- Reframed `03.2A` around a first-class `Geometry/Sketch` node and a dedicated `sketch` template instead of a generic or part-wrapper shell.
- Locked the node-owned managed `SketchFeature` payload model, the evaluator-driven `SketchProfiles` plus only-single `SketchProfile` output rule, and the viewer-side `SketchPlane` pick flow through store plus overlay seams.
- Expanded the doc to name the exact schema, evaluator, node-shell, viewer-session, and non-goal seams, then added implementation order, acceptance criteria, test coverage, and assumptions so the phase no longer leaves product or architecture decisions open.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/03.2A - SP-NI-FS-GE - Data Types And Sketch Foundation.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed; this was a docs-only implementation-planning pass.

#### Verification Steps
- Reviewed the rewritten `03.2A` doc against the current code seams already used by `SketchFeature`, evaluator validation, node rendering, and viewport overlay hosting.
- Confirmed the new doc now includes explicit implementation order, acceptance criteria, test plan, and assumptions.

<!-- ENTRY 384 -->
### [384] - 2026-03-17 22:00 - `VR / Browser - Make Reference Row Click Highlight In Viewer`
<!-- ENTRY 384 -->
HUMAN SUMMARY: `Changed browser reference item clicks so they no longer act like visibility toggles; instead they ensure the reference is visible, make it the active viewer target, and apply a warm white/yellow glow in the viewport.` 

#### Scope / Constraints Honored
- Kept this pass focused on browser reference item click behavior and viewer-side reference highlighting.
- Preserved the eye toggle as the dedicated visibility control.
- Reused the existing active reference transform target rather than introducing a second competing viewer-selection state.

#### Summary of Implementation
- Changed browser reference item row clicks to use the highlight/active-reference path instead of toggling visibility.
- Kept right-click transform actions on the same underlying reference activation flow.
- Added a warm white/yellow material highlight treatment in the viewer for the active reference object and refresh hooks so the glow tracks load/visibility/session changes.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/viewer/Viewer.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Clicking a browser reference item now highlights that reference in the viewport instead of turning visibility on or off.
- The highlighted reference gets a warm white/yellow glow treatment in the viewer.

#### Verification Steps
- `npm.cmd test -- src/app/panels/BrowserPanel.test.tsx src/app/components/ViewerHost.test.tsx`

<!-- ENTRY 383 -->
### [383] - 2026-03-17 21:51 - `VR / Browser - Make Active Reference Eye Toggle Green`
<!-- ENTRY 383 -->
HUMAN SUMMARY: `Changed the browser reference eye toggle so visible rows read green when they are on, making the visibility control easier to distinguish from the blue reference highlight bar.` 

#### Scope / Constraints Honored
- Kept this pass limited to the browser reference visibility toggle styling.
- Preserved the current reference highlight bar behavior.
- Adjusted only the active eye-toggle color language.

#### Summary of Implementation
- Updated the visible-state eye toggle border, fill, and glow from blue to green.
- Kept the eye glyph itself readable while shifting the active emphasis to the new green on-state.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Browser reference eye toggles now read green when the reference layer is visible.

#### Verification Steps
- `npm.cmd test -- src/app/panels/BrowserPanel.test.tsx`

<!-- ENTRY 382 -->
### [382] - 2026-03-17 21:49 - `VR / Browser - Darken Reference Row Idle And Highlighted States`
<!-- ENTRY 382 -->
HUMAN SUMMARY: `Darkened both the idle and highlighted browser reference-row bars so the new reference highlight styling reads deeper and less washed-out against the browser tree.` 

#### Scope / Constraints Honored
- Kept this pass limited to browser reference-row styling.
- Preserved the existing highlight-vs-visibility behavior split.
- Tuned both idle and highlighted states together for a more consistent darker treatment.

#### Summary of Implementation
- Darkened the base reference row shell background and border.
- Shifted the highlighted fill to a deeper blue treatment.
- Shifted the idle fill to a darker neutral treatment so both states sit closer together visually.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Browser reference rows now read darker in both idle and highlighted states.

#### Verification Steps
- `npm.cmd test -- src/app/panels/BrowserPanel.test.tsx`

<!-- ENTRY 381 -->
### [381] - 2026-03-17 21:48 - `VR / Browser - Move Reference Fill State To Highlight`
<!-- ENTRY 381 -->
HUMAN SUMMARY: `Separated browser reference visibility from the main reference fill bar so the eye toggle now owns on/off state while the row fill bar reflects whether a reference is the actively highlighted transform target.` 

#### Scope / Constraints Honored
- Kept this pass limited to browser reference row state semantics.
- Preserved the new eye toggle as the visibility control.
- Reused the existing active reference transform target instead of inventing a new highlight system.

#### Summary of Implementation
- Added an explicit `isVisible` field to browser reference row VMs for the eye-toggle state.
- Changed the reference row bar state model from visible/hidden to highlighted/idle, while retaining loading and error states.
- Wired the browser tree selector to use `referenceWorkspace.activeTransformReferenceId` as the reference highlight source and updated selector/browser-row tests to the new semantics.

#### Files Changed
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/browserRowActions.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Reference eye buttons now indicate visibility, while the main reference fill bar indicates the currently highlighted reference target.

#### Verification Steps
- `npm.cmd test -- src/app/panels/BrowserPanel.test.tsx src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/browserRowActions.test.ts`

<!-- ENTRY 380 -->
### [380] - 2026-03-17 21:40 - `VR / Browser - Fix Reference Eye Toggle Rendering`
<!-- ENTRY 380 -->
HUMAN SUMMARY: `Reworked the new browser reference eye toggle into a reliably rendered icon and gave the visible state a blue active highlight so the control reads clearly when a reference layer is on.` 

#### Scope / Constraints Honored
- Kept this pass limited to the new browser reference visibility control.
- Preserved the same underlying reference visibility behavior.
- Focused only on the eye icon rendering and active-state readability.

#### Summary of Implementation
- Replaced the pseudo-element-only eye icon with a small explicit DOM eye/pupil/slash shape.
- Added a stronger blue active treatment to the visible state so it aligns with the browser reference fill-bar color language.
- Kept the hidden state dimmer with a clear slash overlay.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The browser reference visibility control now reads as a clearer eye icon, and visible rows show a blue active button state.

#### Verification Steps
- `npm.cmd test -- src/app/panels/BrowserPanel.test.tsx`

<!-- ENTRY 379 -->
### [379] - 2026-03-17 21:36 - `VR / Browser - Add Reference Visibility Eye Toggle`
<!-- ENTRY 379 -->
HUMAN SUMMARY: `Added a dedicated eye toggle beside the reference-row type icon in the browser so visibility state is explicit and users can turn reference layers on or off without relying only on the main row click.` 

#### Scope / Constraints Honored
- Kept this pass limited to browser reference-row UI and its existing visibility-toggle behavior.
- Added the new control beside the existing reference icon instead of reshaping the broader row action layout.
- Reused the current category/item visibility actions rather than introducing a separate visibility model.

#### Summary of Implementation
- Added a dedicated inline visibility toggle to browser reference category and item rows.
- Reused the existing reference visibility handler so the new eye button performs the same toggle action as the current row interaction.
- Styled the new control as an eye-state button with visible/hidden states and added a focused browser-panel regression.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/panels/BrowserPanel.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Reference category and item rows now show a dedicated eye toggle beside their existing icon to indicate and control visibility.

#### Verification Steps
- `npm.cmd test -- src/app/panels/BrowserPanel.test.tsx`

<!-- ENTRY 378 -->
### [378] - 2026-03-17 21:28 - `VR / Spaghetti - Add Body Top Bottom Padding Slider`
<!-- ENTRY 378 -->
HUMAN SUMMARY: `Added a second body-padding slider for top/bottom spacing in the spaghetti editor window-settings menu, so the main shell inset can now be tuned independently on both axes.` 

#### Scope / Constraints Honored
- Kept this pass limited to the existing spaghetti window appearance pipeline.
- Added the new control under `Body` alongside the side-padding slider.
- Reused the same slider/clamp model as the other appearance settings.

#### Summary of Implementation
- Extended `SpaghettiWindowAppearance` with `bodyInsetY` and its clamp range.
- Added a new `--sp-window-shell-pad-y` CSS variable in `AppShell`.
- Updated the main spaghetti panel shell padding to use both horizontal and vertical inset variables.
- Added a `Top Bottom Padding` slider in the `Body` settings group and updated the panel tests.

#### Files Changed
- `src/app/panels/spaghettiWindowAppearance.ts`
- `src/app/AppShell.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The spaghetti editor main shell now has separate sliders for side padding and top/bottom padding.

#### Verification Steps
- `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 377 -->
### [377] - 2026-03-17 21:23 - `VR / Spaghetti - Add Body Side Padding Slider`
<!-- ENTRY 377 -->
HUMAN SUMMARY: `Added a new Body > Side Padding slider to the spaghetti editor window-settings menu so the main shell’s left/right inset is now a real per-window appearance control instead of a hardcoded CSS tweak.` 

#### Scope / Constraints Honored
- Kept this pass limited to the spaghetti window appearance model and the existing `i`-menu settings surface.
- Added the new control under `Body`, directly below `Color`, as requested.
- Reused the existing appearance-variable pipeline rather than introducing a one-off DOM mutation path.

#### Summary of Implementation
- Extended `SpaghettiWindowAppearance` with a new `bodyInsetX` slider value and clamp range.
- Exposed that value in `AppShell` as a new `--sp-window-shell-pad-x` CSS variable.
- Updated the spaghetti panel shell CSS to use the new variable for main-box left/right padding.
- Added a `Body > Side Padding` `ParaSlider` to the spaghetti `i` menu and covered its presence in `SpaghettiPanel.test.tsx`.

#### Files Changed
- `src/app/panels/spaghettiWindowAppearance.ts`
- `src/app/AppShell.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The spaghetti editor main-box left/right inset can now be adjusted from the `i` menu under `Body`.

#### Verification Steps
- `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 376 -->
### [376] - 2026-03-17 21:23 - `VR / Spaghetti - Move Flush Spacing To Main Panel Shell`
<!-- ENTRY 376 -->
HUMAN SUMMARY: `Corrected the spaghetti spacing pass by restoring the subsection header/body padding and instead removing the outer left/right padding from the main spaghetti panel shell. This targets the actual gap between the editor box and the Window Settings/toolbar boxes.` 

#### Scope / Constraints Honored
- Kept this corrective pass limited to spaghetti panel spacing.
- Restored the subsection internals rather than continuing to flatten them.
- Applied the flush treatment at the main panel shell level where the user actually wanted the spacing removed.

#### Summary of Implementation
- Set the main `SpaghettiPanelRoot` padding to `0` so pinned boxes sit flush against the editor shell.
- Restored horizontal padding on the `Window Settings` subsection toggles.
- Restored horizontal padding on the `t` toolbar section summaries and bodies.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The space between the spaghetti editor shell and the top-level `Window Settings` / toolbar boxes is removed, while subsection internals keep their original padding.

#### Verification Steps
- `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 375 -->
### [375] - 2026-03-17 21:21 - `VR / Spaghetti - Remove Horizontal Section Gutters`
<!-- ENTRY 375 -->
HUMAN SUMMARY: `Removed the left/right section gutters inside the spaghetti editor’s subsection shells so the section headers and bodies now sit flush to the shell edges more like the browser treatment.` 

#### Scope / Constraints Honored
- Kept this pass limited to spaghetti section-level padding.
- Left the controls themselves intact instead of flattening their internal layout.
- Applied the flush treatment to the spaghetti settings/toolbar subsection shells.

#### Summary of Implementation
- Removed horizontal padding from the `Window Settings` subsection toggles.
- Removed horizontal padding from the `t` toolbar section summaries and bodies.
- Kept the vertical spacing intact so the sections do not collapse visually.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Spaghetti subsection headers and bodies now align flush to the left/right shell edges instead of sitting inside horizontal gutters.

#### Verification Steps
- Pending visual verification in the running app.

<!-- ENTRY 374 -->
### [374] - 2026-03-17 21:18 - `VR / Browser - Scope Wide Row Layout To Content Area`
<!-- ENTRY 374 -->
HUMAN SUMMARY: `Scoped the wider browser row layout back down to the content/reference area only. Graph Documents and Open Editors now keep their original trailing action-column structure, while reference/content rows still let their bars extend farther right.` 

#### Scope / Constraints Honored
- Kept this pass limited to browser row-grid scoping.
- Restored the old graph/open-editor row structure without reverting the content/reference row improvement.
- Left row action behavior untouched.

#### Summary of Implementation
- Restored the browser row shell’s original multi-column grid as the default.
- Added a narrower two-column grid override only for reference/content row kinds: references root, reference categories/items, and assembly/component/object rows.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Graph Documents and Open Editors regain their original right-side action layout, while content/reference rows keep the wider fill-bar span.

#### Verification Steps
- `npm.cmd test -- src/app/panels/BrowserPanel.test.tsx`

<!-- ENTRY 373 -->
### [373] - 2026-03-17 21:16 - `VR / Browser - Let Row Bars Reach The Right Edge`
<!-- ENTRY 373 -->
HUMAN SUMMARY: `Reworked the browser row grid so reference/content bars can actually extend farther right instead of stopping early because of always-reserved empty action columns. This replaces the earlier text-only padding tweak with a real row-width fix.` 

#### Scope / Constraints Honored
- Kept this pass limited to the browser row shell/layout and state-bar padding reset.
- Left the outer row shells and selection/highlight states unchanged.
- Focused on the shared row surfaces used by reference rows through assembly/content rows.

#### Summary of Implementation
- Removed the browser row’s always-present trailing empty action columns so rows without actions no longer reserve dead space on the right.
- Restored the inner state-bar padding after the earlier text-only shift, since the actual fix was to widen the row surface itself.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Browser reference/content bars can now dock farther right because the row shell no longer reserves unused action slots.

#### Verification Steps
- Pending visual verification in the running app.

<!-- ENTRY 372 -->
### [372] - 2026-03-17 21:14 - `VR / Browser - Hide Empty User References Section`
<!-- ENTRY 372 -->
HUMAN SUMMARY: `Stopped rendering the browser’s User References category when there are no imported references, which also removes the stray \`No imported references yet.\` empty-state text from the tree.` 

#### Scope / Constraints Honored
- Kept this pass limited to the browser reference-tree view model and its direct panel coverage.
- Left imported-reference rendering intact once the user actually has imported items.
- Did not alter the manifest-backed reference categories.

#### Summary of Implementation
- Updated the reference workspace browser-tree selector to omit the `User References` category when its item list is empty.
- Removed the imported-reference empty-state copy by not rendering that empty category at all.
- Added a BrowserPanel regression to ensure both the row label and the empty string stay absent when there are no imported references.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The browser no longer shows an empty `User References` row or the `No imported references yet.` message when there are no imported references.

#### Verification Steps
- `npm.cmd test -- src/app/panels/BrowserPanel.test.tsx`

<!-- ENTRY 371 -->
### [371] - 2026-03-17 21:11 - `VR / Browser - Darken Reference And Object Rows`
<!-- ENTRY 371 -->
HUMAN SUMMARY: `Darkened the browser’s main row-button surface so reference rows, object rows, and the other BrowserTreeRow items no longer read like the lighter generic panel-button slab, while keeping the existing selected and active states intact.` 

#### Scope / Constraints Honored
- Kept this pass limited to the browser row-button surface styling.
- Left the generic shared button template untouched.
- Preserved the existing selected, active-editor, and hover state structure.

#### Summary of Implementation
- Added a darker dedicated base background for `BrowserTreeRowMain`.
- Slightly darkened the open-row background treatment.
- Darkened the hover state so it still reads interactive without jumping back to the lighter generic panel-button look.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Browser reference/object rows and related tree rows now read darker at rest and on hover.

#### Verification Steps
- Pending visual verification in the running app.

<!-- ENTRY 370 -->
### [370] - 2026-03-17 21:09 - `VR / Browser - Collapse Reference Categories On Load`
<!-- ENTRY 370 -->
HUMAN SUMMARY: `Changed the browser’s initial reference workspace defaults so Footpads, Shoes, and Premade Foothooks now start collapsed on app load, which makes the browser land in a cleaner state without hiding the User References section.` 

#### Scope / Constraints Honored
- Kept this pass limited to the initial reference workspace expansion defaults.
- Left the top-level references root expanded.
- Left category toggling behavior unchanged after startup.

#### Summary of Implementation
- Added an explicit default-collapsed category list for the browser reference workspace.
- Updated the initial reference workspace state builder so `footpads`, `shoes`, and `premade-foothooks` start collapsed while other categories keep their previous startup behavior.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- On user load, the browser now starts with Footpads, Shoes, and Premade Foothooks collapsed by default.

#### Verification Steps
- `npm.cmd test -- src/app/panels/BrowserPanel.test.tsx`

<!-- ENTRY 369 -->
### [369] - 2026-03-17 21:07 - `VR / Browser - Remove Floating Browser Min-Height Floor`
<!-- ENTRY 369 -->
HUMAN SUMMARY: `Removed the remaining floating-browser minimum-height floor so the floating browser can now collapse down to the visible Project Browser content height instead of stopping at a hidden 220px shell minimum.` 

#### Scope / Constraints Honored
- Kept this corrective pass limited to the floating browser wrapper CSS.
- Left browser width behavior, active highlight, and popout sizing logic unchanged.
- Did not change the docked browser path.

#### Summary of Implementation
- Removed the hard `220px` minimum height from the floating browser wrapper.
- Dropped the now-redundant collapsed override for that same minimum-height rule.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Floating browser height can now collapse fully to match the visible Project Browser content instead of stopping at an artificial shell minimum.

#### Verification Steps
- Pending visual verification in the running app.

<!-- ENTRY 368 -->
### [368] - 2026-03-17 21:06 - `VR / Browser - Return Floating Height To Content`
<!-- ENTRY 368 -->
HUMAN SUMMARY: `Reworked the floating browser sizing again so the shell now follows the visible browser content height, which lets it collapse down with the Project Browser section instead of holding onto a stale taller wrapper height.` 

#### Scope / Constraints Honored
- Kept this corrective pass limited to floating browser sizing behavior.
- Left browser width seeding and floating activation styling intact.
- Preserved a synced floating-height ref so drag bounds can still track the actual shell height.

#### Summary of Implementation
- Removed the explicit floating browser height style so the shell can size to its content again.
- Added a floating browser `ResizeObserver` sync path so the stored floating height follows the real rendered shell height.
- Updated the floating browser shell/body CSS to support content-height sizing with clipped overflow and internal body scrolling when needed.
- Adjusted the AppShell regression coverage to match the restored content-height behavior.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Floating browser height now shrinks with the visible browser content again, including when the Project Browser section is collapsed.

#### Verification Steps
- `npm.cmd test -- src/app/AppShell.test.tsx`

<!-- ENTRY 367 -->
### [367] - 2026-03-17 20:59 - `VR / Browser - Cap Popout Height Seed`
<!-- ENTRY 367 -->
HUMAN SUMMARY: `Capped the browser popout height seed so the floating browser no longer inherits an oversized dock-host height and open much taller than expected after the recent height-lock fix.` 

#### Scope / Constraints Honored
- Kept this pass limited to the browser popout sizing seed.
- Left floating browser drag and dock return behavior unchanged.
- Preserved the restored floating height lock once the browser is already open.

#### Summary of Implementation
- Changed the dock-to-floating browser sizing seed to cap its height at the default floating browser height.
- Added an AppShell regression covering tall dock-host popout sizing.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Floating browser popout now opens at a saner capped height instead of inheriting a too-tall dock host.

#### Verification Steps
- `npm.cmd test -- src/app/AppShell.test.tsx`

<!-- ENTRY 366 -->
### [366] - 2026-03-17 20:56 - `VR / Browser - Preserve Floating Height When Body Collapses`
<!-- ENTRY 366 -->
HUMAN SUMMARY: `Restored the floating browser window height lock so collapsing inner browser sections no longer causes the whole floating browser shell to shrink down to its content height.` 

#### Scope / Constraints Honored
- Kept this pass limited to the floating browser sizing path.
- Left docked browser sizing unchanged.
- Preserved the browser header-only collapsed state behavior.

#### Summary of Implementation
- Restored the saved floating browser height onto the floating wrapper style.
- Updated the floating browser panel root to fill the wrapper height instead of sizing to content.
- Added an AppShell regression covering the floating browser wrapper height after popout.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The floating browser now keeps its window height while inner browser sections are collapsed.

#### Verification Steps
- `npm.cmd test -- src/app/AppShell.test.tsx`

<!-- ENTRY 365 -->
### [365] - 2026-03-17 20:55 - `VR / Browser - Remove Outer Browser Body Padding`
<!-- ENTRY 365 -->
HUMAN SUMMARY: `Removed the outer browser body inset so the Project Browser surface can sit flush against the browser panel shell instead of floating inside a padded gutter.` 

#### Scope / Constraints Honored
- Kept this pass limited to the outer browser panel body spacing.
- Left the inner browser tree row spacing and section content structure unchanged.
- Did not change browser interactions or tree behavior.

#### Summary of Implementation
- Removed the outer body padding on the browser panel shell.
- Removed the extra shell gap so the root Project Browser section can attach directly to the browser body edges.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The Project Browser section now sits flush to the browser panel body instead of being inset by an outer margin.

#### Verification Steps
- `npm.cmd test -- src/app/panels/BrowserPanel.test.tsx`

<!-- ENTRY 364 -->
### [364] - 2026-03-17 20:52 - `VR / Browser - Floating Window Active Highlight`
<!-- ENTRY 364 -->
HUMAN SUMMARY: `Added the same click-to-activate highlight treatment to the floating browser window and unified floating-shell focus so the browser and spaghetti shells now hand the active border/glow state back and forth cleanly.` 

#### Scope / Constraints Honored
- Kept this pass limited to floating-window active highlighting.
- Reused the AppShell floating-shell focus path instead of adding browser-local state inside the browser panel.
- Left docked browser styling unchanged.

#### Summary of Implementation
- Replaced the spaghetti-only floating highlight flag with a shared active-floating-shell state.
- Added active highlight styling to the floating browser shell.
- Wired floating browser pointer-down to activate its shell and clear the spaghetti active state.
- Extended AppShell coverage so the active highlight can move from spaghetti to browser.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Clicking the floating browser window now highlights it, and whichever floating shell is clicked most recently becomes the active highlighted one.

#### Verification Steps
- `npm.cmd test -- src/app/AppShell.test.tsx`

<!-- ENTRY 363 -->
### [363] - 2026-03-17 20:51 - `VR / Spaghetti - Floating Window Active Highlight`
<!-- ENTRY 363 -->
HUMAN SUMMARY: `Added a focused-window highlight to the floating spaghetti editor so clicking the shell now lights the window border and body seam, making the active floating editor read more clearly against the rest of the workspace.` 

#### Scope / Constraints Honored
- Kept this pass limited to the floating spaghetti window shell.
- Used the existing AppShell floating-window path instead of creating a separate focus model inside the panel.
- Left split-view and meatball-view shells unchanged for now.

#### Summary of Implementation
- Added AppShell state that tracks whether the floating spaghetti shell is active.
- Wired the floating shell to activate on pointer-down and clear when the user clicks outside it.
- Added a subtle active border/glow treatment on the floating shell, titlebar frame, and body seam.
- Added an AppShell regression test covering activation and outside-click clearing.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Clicking the floating spaghetti editor now highlights the window until focus moves elsewhere.

#### Verification Steps
- `npm.cmd test -- src/app/AppShell.test.tsx`

<!-- ENTRY 362 -->
### [362] - 2026-03-17 20:49 - `VR / Browser - Match Browser Title Bar To Spaghetti Shell`
<!-- ENTRY 362 -->
HUMAN SUMMARY: `Shifted the browser panel onto the same darker titlebar language as the spaghetti editor by swapping in a near-black shell gradient, matching chrome-button treatment, and cleaning the seam where the browser body attaches under the titlebar.` 

#### Scope / Constraints Honored
- Kept this pass focused on the browser panel titlebar shell and its immediate body seam.
- Matched the browser titlebar to the darker spaghetti-editor look without rewriting the browser panel component structure.
- Left browser tree content, row interactions, and floating/docked behavior unchanged.

#### Summary of Implementation
- Replaced the old brighter blue browser titlebar gradient with a darker spaghetti-style shell gradient.
- Changed the browser titlebar frame to use a full shell border with no bottom border, matching the spaghetti window handle treatment.
- Adjusted the browser panel body so it attaches directly under the new titlebar without the old overlap gap.
- Kept the browser chrome buttons on the same compact dark glass treatment used by the spaghetti titlebar buttons.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The browser panel now reads visually like the spaghetti floating window family instead of using its older brighter blue titlebar template.

#### Verification Steps
- Pending visual verification in the running app.

<!-- ENTRY 361 -->
### [361] - 2026-03-17 20:45 - `VR / Shell - Generator Title Bar Fill Deepen`
<!-- ENTRY 361 -->
HUMAN SUMMARY: `Darkened the main ParaHook Generator v20 title bar fill further so the shell now carries a stronger near-black base instead of staying too blue-gray throughout, while keeping the recent glow and animated border treatment layered on top.` 

#### Scope / Constraints Honored
- Kept this pass limited to the shared generator title/status bar base fill.
- Left the recent sheen, border animation, and title/status layout fixes intact.
- Did not claim automated verification because the current `AppShell` test harness mocks `TitleStatusBar`.

#### Summary of Implementation
- Deepened the title bar shell gradient.
- Added a stronger near-black stop into the lower portion of the shell fill.
- Left the border, glow, and progress styling unchanged.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The main generator title bar should now read with a darker fill and a more pronounced black base.

#### Verification Steps
- No automated test run for this visual fix; `AppShell.test.tsx` currently mocks `TitleStatusBar`.

<!-- ENTRY 360 -->
### [360] - 2026-03-17 20:43 - `VR / Shell - Generator Title Bar Animated Border Highlight`
<!-- ENTRY 360 -->
HUMAN SUMMARY: `Added a subtle animated border highlight to the main ParaHook Generator v20 title bar so the shell edge now catches the same motion language as the moving sheen, giving the title bar a more intentional lit-border feel without becoming noisy.` 

#### Scope / Constraints Honored
- Kept this pass limited to the shared generator title/status bar shell visuals.
- Matched the border motion to the existing sheen timing instead of introducing a separate competing animation rhythm.
- Did not claim automated verification because the current `AppShell` test harness mocks `TitleStatusBar`.

#### Summary of Implementation
- Added title bar shell variables for rest/peak border and glow colors.
- Added a synchronized border/glow animation that pulses in the same rhythm as the title bar sheen.
- Tuned the building, assembling, and error states with their own animated border/glow color sets.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The main generator title bar border should now carry a subtle animated highlight that moves in sync with the shell’s sheen/glow treatment.

#### Verification Steps
- No automated test run for this visual fix; `AppShell.test.tsx` currently mocks `TitleStatusBar`.

<!-- ENTRY 359 -->
### [359] - 2026-03-17 20:41 - `VR / Shell - Generator Title Bar Glow And Sheen Pass`
<!-- ENTRY 359 -->
HUMAN SUMMARY: `Added a subtle animated glow/sheen treatment to the main ParaHook Generator v20 title bar so the shell feels more alive and intentional, with a restrained moving highlight and a soft state-aware ambient glow rather than a flat static slab.` 

#### Scope / Constraints Honored
- Kept this pass limited to the shared generator title/status bar shell visuals.
- Left the title bar text, status content, and progress behavior unchanged.
- Did not claim automated verification because the current `AppShell` test harness mocks `TitleStatusBar`.

#### Summary of Implementation
- Added a layered ambient glow inside the title bar shell.
- Added a slow animated sheen pass across the title bar surface.
- Strengthened the shell shadow slightly and made the state-specific building/assembling/error shells glow a bit more.
- Kept the text and progress row above the animation layers with explicit stacking.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The main generator title bar should now have a subtle animated glow/sheen instead of reading as a static flat panel.

#### Verification Steps
- No automated test run for this visual fix; `AppShell.test.tsx` currently mocks `TitleStatusBar`.

<!-- ENTRY 358 -->
### [358] - 2026-03-17 20:38 - `VR / Shell - Generator Title Bar Width Overflow Fix`
<!-- ENTRY 358 -->
HUMAN SUMMARY: `Fixed the remaining right-edge clipping on the main ParaHook Generator v20 title bar by constraining the shell to true border-box sizing, so its padding and border no longer push it wider than the dock slot and get cut off on the right.` 

#### Scope / Constraints Honored
- Kept this pass limited to the shared generator title/status bar shell sizing.
- Left the previous background-fill and text-flex cleanup intact.
- Did not claim automated verification because the current `AppShell` test harness mocks `TitleStatusBar`.

#### Summary of Implementation
- Added `box-sizing: border-box` to the shared title bar shell.
- Added an explicit `max-width: 100%` guard to keep the shell inside its parent width.
- Left the title row, status text, and progress bar behavior unchanged.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The main generator title bar shell should no longer clip on the right edge from width overflow.

#### Verification Steps
- No automated test run for this visual fix; `AppShell.test.tsx` currently mocks `TitleStatusBar`.

<!-- ENTRY 357 -->
### [357] - 2026-03-17 20:36 - `VR / Shell - Generator Title Bar Fill And Text Clamp Fix`
<!-- ENTRY 357 -->
HUMAN SUMMARY: `Cleaned up the main ParaHook Generator v20 title bar so it now paints a proper filled surface instead of reading as transparent, and the app title now flexes cleanly against the right-side status label instead of getting cut off.` 

#### Scope / Constraints Honored
- Kept this pass limited to the shared generator title/status bar styling.
- Left the title bar content, state text, and progress logic unchanged.
- Did not claim automated verification because the current `AppShell` test harness mocks `TitleStatusBar`.

#### Summary of Implementation
- Replaced the too-transparent title bar shell background with a stronger filled dark surface.
- Allowed the title row to shrink correctly by giving the row and title label proper `min-width: 0` behavior.
- Added overflow handling to the main title text so it truncates cleanly instead of colliding with the right-side status text.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The main generator title bar should now have a visible filled background and the `ParaHook Generator v20` text should no longer clip awkwardly against the right-side status.

#### Verification Steps
- No automated test run for this visual fix; `AppShell.test.tsx` currently mocks `TitleStatusBar`.

<!-- ENTRY 356 -->
### [356] - 2026-03-17 20:34 - `VR / SP - Focus Node ParaSelect Auto-Fit Restore`
<!-- ENTRY 356 -->
HUMAN SUMMARY: `Restored the canvas auto-fit behavior when users cycle the spaghetti editor \`Focus Node\` picker left or right, so the new \`ParaSelect\`-owned focus control now triggers the same node-fit request the old custom step buttons used to send.` 

#### Scope / Constraints Honored
- Kept this pass limited to focus-node change behavior in the spaghetti editor pinned row.
- Preserved the recent `Focus Node` `ParaSelect` conversion and row layout changes.
- Re-ran the focused spaghetti panel suite after the behavior fix.

#### Summary of Implementation
- Consolidated focus-node selection changes through a shared handler.
- Wired `Focus Node` `ParaSelect` changes to increment the existing canvas fit-request state.
- Extended the focus-cycle regression test so it now verifies both the selected label change and the forwarded `fitNodeId`.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Cycling the spaghetti editor `Focus Node` control now automatically fits the selected node in the canvas again.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 355 -->
### [355] - 2026-03-17 20:31 - `VR / SP - Move Graph Picker Into Shared Focus Row`
<!-- ENTRY 355 -->
HUMAN SUMMARY: `Moved the spaghetti editor graph picker out of the titlebar and into the same pinned row as the \`Focus Node\` picker, with the two \`ParaSelect\` controls now sharing that row at an even 50/50 split while the titlebar keeps only the build/action chrome.` 

#### Scope / Constraints Honored
- Kept this pass focused on relocating the graph picker and rebalancing the pinned control row.
- Preserved the graph-binding behavior and the `Add New Graph` shortcut while changing ownership from the titlebar to the panel.
- Re-ran the focused spaghetti panel and app shell suites after the structural move.

#### Summary of Implementation
- Moved graph-document selection and graph-creation behavior from the titlebar component into `SpaghettiPanel`.
- Reworked the pinned `Focus Node` row into a two-cell layout so `Graph` and `Focus Node` now each occupy half the row width.
- Removed the titlebar graph picker while keeping the titlebar build button in place.
- Updated panel tests to cover the new pinned-row graph picker and graph-create shortcut, and updated app-shell tests to reflect that the titlebar no longer owns the picker.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor `Graph` picker now lives beside `Focus Node` in one shared pinned row, and the titlebar no longer displays the graph `ParaSelect`.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx`

<!-- ENTRY 354 -->
### [354] - 2026-03-17 20:26 - `VR / SP - Focus Node ParaSelect Middle-Track Style Fix`
<!-- ENTRY 354 -->
HUMAN SUMMARY: `Fixed a follow-up style regression from the spaghetti editor \`Focus Node\` \`ParaSelect\` conversion so the middle track no longer repaints as a gray rounded default-button slab; the center track is back to the intended transparent embedded treatment.` 

#### Scope / Constraints Honored
- Kept this pass limited to the spaghetti editor `Focus Node` row styling.
- Left the new `ParaSelect`-owned focus-node behavior and control layout unchanged.
- Re-ran the focused spaghetti panel suite after the style correction.

#### Summary of Implementation
- Added a focus-row-specific `ParaSelectTrackButton` override.
- Removed the inherited default button padding, border, radius, background, and box shadow from the focus row's middle track.
- Left the caps, fill, handle, and menu behavior intact.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor `Focus Node` `ParaSelect` should no longer show the gray rounded middle-button slab.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 353 -->
### [353] - 2026-03-17 20:24 - `VR / SP - Focus Node Row Converted To ParaSelect`
<!-- ENTRY 353 -->
HUMAN SUMMARY: `Replaced the spaghetti editor \`Focus Node\` row's old split responsibility of custom step buttons plus native \`select\` with a single \`ParaSelect\`, so that picker now owns the left/right stepping, selected-value track, and node menu in one consistent control.` 

#### Scope / Constraints Honored
- Kept this pass limited to the spaghetti editor pinned `Focus Node` row.
- Reused the shared `ParaSelect` interaction model instead of creating another one-off picker variant.
- Re-ran the focused spaghetti panel suite after the markup, styling, and test updates.

#### Summary of Implementation
- Replaced the `Focus Node` row's old custom button pair and native `select` with a `ParaSelect`.
- Mapped the current graph node list into `ParaSelect` options, with a fallback `No nodes` option when the graph is empty.
- Updated the focus-row styling to fit the shared `ParaSelect` shell and removed the now-unused native-select and step-button CSS.
- Updated the panel tests to target the new `ParaSelect` caps/track and narrowed one existing window-settings select-count assertion so it ignores the new focus picker.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor `Focus Node` picker now behaves like a standard `ParaSelect`, including integrated left/right stepping and the shared middle-track dropdown.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 352 -->
### [352] - 2026-03-17 20:21 - `VR / SP - Shared Default Button Tone Deepen`
<!-- ENTRY 352 -->
HUMAN SUMMARY: `Pushed the shared default \`V15Panel\` button tone darker one more step so standard controls sit on a deeper neutral surface, following the user's feedback after the first button-darkening pass.` 

#### Scope / Constraints Honored
- Kept this pass limited to the shared default button background tokens.
- Left the shared button border, typography, spacing, and specialized button variants unchanged.
- Re-ran the focused spaghetti panel suite after the token adjustment.

#### Summary of Implementation
- Darkened the shared default button base token again.
- Darkened the shared default button hover token to stay aligned with the deeper rest state.
- Left the rest of the button system untouched.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Default `V15Panel` buttons should now render darker than the previous pass at rest and on hover.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 351 -->
### [351] - 2026-03-17 20:20 - `VR / SP - Darker Shared Default Button Style`
<!-- ENTRY 351 -->
HUMAN SUMMARY: `Darkened the shared default \`V15Panel\` button surface tokens slightly so standard buttons like the spaghetti editor \`Edit Clamp\` and \`Reset Window Style\` controls sit on a deeper base tone without changing their size, layout, or interaction model.` 

#### Scope / Constraints Honored
- Kept this pass limited to the shared default button color tokens.
- Left specialized button variants and local button sizing overrides unchanged.
- Re-ran the focused spaghetti panel suite after the token update.

#### Summary of Implementation
- Darkened the shared default button background token.
- Darkened the shared default button hover token to match the new base tone.
- Left the shared border, radius, typography, and spacing rules intact.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Default `V15Panel` buttons should now render slightly darker at rest and on hover across surfaces that use the shared button style.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 350 -->
### [350] - 2026-03-17 20:18 - `VR / SP - Spaghetti I-Menu Row Shrink Fix`
<!-- ENTRY 350 -->
HUMAN SUMMARY: `Corrected the new resizable spaghetti editor \`i\`-menu so shrinking the \`Window Settings\` area no longer compresses the \`Title bar / Body / Text\` rows themselves; those rows now keep their natural height and the scroll bar takes over when the area becomes too small.` 

#### Scope / Constraints Honored
- Kept this pass limited to the flex/overflow behavior of the resizable `Window Settings` scroll region.
- Preserved the new resize seam, bounded height behavior, and dark scrollbar styling.
- Re-ran the focused spaghetti panel suite after the overflow fix.

#### Summary of Implementation
- Prevented the `Window Settings` subsection rows, headers, and field stacks from flex-shrinking inside the bounded scroll region.
- Kept the scroll container stretch behavior so the rows still fill the available width.
- Left the rest of the `i`-menu layout and resize interaction unchanged.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Shrinking the `Window Settings` area should now preserve the normal row heights and reveal a scrollbar instead of squeezing the subsection rows.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 349 -->
### [349] - 2026-03-17 20:16 - `VR / SP - Resizable Spaghetti I-Menu Window Settings`
<!-- ENTRY 349 -->
HUMAN SUMMARY: `Added a dedicated horizontal resize seam under the spaghetti editor \`i\`-menu \`Window Settings\` block so users can stretch that settings area up and down independently, with the controls now living inside a bounded scroll region that reuses the same dark scrollbar styling as the \`t\` toolbar.` 

#### Scope / Constraints Honored
- Kept this pass scoped to the spaghetti editor `Window Settings` area and its local resize behavior.
- Reused the existing spaghetti panel height/drag pattern instead of introducing a separate resize system.
- Re-ran the focused spaghetti panel suite after the structural and styling updates.

#### Summary of Implementation
- Added dedicated height state, max-height clamping, drag-to-resize handling, and double-click reset behavior for the `Window Settings` content area.
- Wrapped the `Window Settings` subsection stack in its own bounded scroll container so larger `i`-menu settings can scroll independently above the pinned focus row.
- Added a matching horizontal resize bar under the `i` menu and reused the toolbar dark-theme scrollbar treatment for the new scroll area.
- Added focused test coverage for the default bounded `Window Settings` height and the visibility of the new resize seam when the section is expanded or collapsed.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor `i`-menu `Window Settings` area can now be resized vertically with its own horizontal seam, and overflowing settings now scroll inside a dark-themed bounded region.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 348 -->
### [348] - 2026-03-17 20:11 - `VR / SP - Spaghetti T-Menu Section Hover And Active Match`
<!-- ENTRY 348 -->
HUMAN SUMMARY: `Brought the spaghetti editor \`t\` toolbar sections in line with the new \`i\`-menu interaction styling by adding a subtle active shell highlight when a section is open and a darker summary-row hover state across the toolbar section stack.` 

#### Scope / Constraints Honored
- Kept this pass limited to the visual states of the spaghetti editor toolbar sections.
- Left the `details/summary` structure, content, and open/close behavior unchanged.
- Re-ran the focused spaghetti panel suite after the styling update.

#### Summary of Implementation
- Added a light active border/background treatment to open toolbar sections.
- Added a darker hover/focus background to toolbar section summary rows.
- Tuned the hover state on already-open sections to stay compatible with the active shell highlight.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Open `t`-menu sections should now show a clearer active shell, and hovering toolbar section headers should darken the row before click.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 347 -->
### [347] - 2026-03-17 20:09 - `VR / SP - Spaghetti I-Menu Edge-To-Edge Section Controls`
<!-- ENTRY 347 -->
HUMAN SUMMARY: `Removed the inner body padding from expanded spaghetti editor \`Window Settings\` subsections so the \`ParaSlider\` and \`ParaSelect\` rows now stretch edge to edge inside \`Title bar\`, \`Body\`, and \`Text\` instead of sitting inset inside those shells.` 

#### Scope / Constraints Honored
- Kept this pass limited to the spacing inside expanded `Window Settings` subsection bodies.
- Left the subsection shells, hover states, and active highlight behavior unchanged.
- Re-ran the focused spaghetti panel suite after the spacing change.

#### Summary of Implementation
- Removed the inner body padding from `Window Settings` subsection content containers.
- Removed the internal vertical gap so the control rows now stack tightly from edge to edge.
- Left the top divider between each subsection header and its controls intact.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Expanded `Title bar`, `Body`, and `Text` sections should now let their slider/select rows stretch flush to the subsection edges.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 346 -->
### [346] - 2026-03-17 20:07 - `VR / SP - Spaghetti I-Menu Subsection Hover Darken`
<!-- ENTRY 346 -->
HUMAN SUMMARY: `Added a darker hover state to the spaghetti editor \`Window Settings\` subsection headers so rows like \`Title bar\`, \`Body\`, and \`Text\` give clearer rollover feedback before click, with a slightly softer version when the subsection is already expanded.` 

#### Scope / Constraints Honored
- Kept this pass limited to hover/focus styling on the `Window Settings` subsection headers.
- Preserved the existing expanded-state highlight and subsection layout.
- Re-ran the focused spaghetti panel suite after the visual-state tweak.

#### Summary of Implementation
- Added a darker hover/focus background to the subsection toggle rows.
- Tuned the hover state for already-expanded subsections so it stays readable without overpowering the active shell highlight.
- Left the controls, collapse behavior, and section structure unchanged.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Hovering the `Title bar`, `Body`, and `Text` subsection headers now darkens the row for clearer interaction feedback.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 345 -->
### [345] - 2026-03-17 20:06 - `VR / SP - Spaghetti I-Menu Expanded Section Highlight`
<!-- ENTRY 345 -->
HUMAN SUMMARY: `Added a subtle active-state treatment to expanded spaghetti editor \`Window Settings\` subsections so open groups like \`Title bar\`, \`Body\`, and \`Text\` read as selected through a slight border/background highlight instead of blending into the collapsed rows.` 

#### Scope / Constraints Honored
- Kept this pass limited to the visual state of expanded `Window Settings` subsections.
- Left the subgroup layout, controls, and collapse behavior unchanged.
- Re-ran the focused spaghetti panel suite after the styling update.

#### Summary of Implementation
- Marked expanded `Title bar`, `Body`, and `Text` subsection shells with an explicit expanded-state class.
- Added a light active border tint, slight surface lift, and a restrained inset highlight for expanded subgroup shells.
- Kept the effect subtle so it supports the existing sliders and selects instead of overpowering them.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Expanded `Window Settings` subsections should now show a clearer active state through a slightly highlighted shell.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 344 -->
### [344] - 2026-03-17 20:04 - `VR / SP - Spaghetti I-Menu Subsection Fillet Restore`
<!-- ENTRY 344 -->
HUMAN SUMMARY: `Restored the rounded fillets on the spaghetti editor \`Window Settings\` subsection rows so \`Title bar\`, \`Body\`, and \`Text\` visually match the rounded section shells used by \`Build\`, \`Viewer\`, and \`Diagnostics\`, without bringing back the earlier inset padding gap.` 

#### Scope / Constraints Honored
- Kept this pass focused on the subsection shell treatment inside the spaghetti editor `Window Settings` area.
- Preserved the recent flush parent-child spacing cleanup.
- Re-ran the focused spaghetti panel suite after the fillet restore.

#### Summary of Implementation
- Reintroduced rounded bordered subsection shells for `Title bar`, `Body`, and `Text`.
- Kept the subsection rows visually attached inside the parent `Window Settings` section by overlapping adjacent borders instead of re-adding inset padding.
- Left the existing `+ / -` toggles, controls, and menu behavior unchanged.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor `i`-menu subsection rows should now show rounded fillets similar to the lower toolbar sections while still sitting flush inside `Window Settings`.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 343 -->
### [343] - 2026-03-17 20:03 - `VR / SP - Spaghetti I-Menu Window Settings Seam Cleanup`
<!-- ENTRY 343 -->
HUMAN SUMMARY: `Removed the extra inner gap between the spaghetti editor \`Window Settings\` shell and its \`Title bar / Body / Text\` rows so those subsections now sit directly against the parent section instead of reading like floating cards with leftover padding.` 

#### Scope / Constraints Honored
- Kept this pass limited to the inner spacing and border treatment of the spaghetti editor `Window Settings` section.
- Preserved the current collapse behavior, controls, and toolbar-style header treatment.
- Re-ran the focused spaghetti panel suite after the spacing cleanup.

#### Summary of Implementation
- Removed the inner `Window Settings` group padding and inter-group gap.
- Flattened the nested group shells so they no longer draw as separate inset cards.
- Kept the section separation by using simple divider lines between `Title bar`, `Body`, and `Text`.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor `i`-menu `Window Settings` subsection stack should now sit flush against the parent box with no extra inset spacing around the `Title bar / Body / Text` rows.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 342 -->
### [342] - 2026-03-17 20:01 - `VR / SP - Spaghetti I-Menu Section Box Styling Match`
<!-- ENTRY 342 -->
HUMAN SUMMARY: `Restyled the spaghetti editor \`i\`-menu \`Window Settings\` area to follow the same clean boxed summary/body treatment as the \`t\` toolbar sections, including matching fillets, padding rhythm, and \`+ / -\` section toggles so the two surfaces feel like the same UI system.` 

#### Scope / Constraints Honored
- Kept this pass focused on the `Window Settings` shell and subsection presentation.
- Preserved the existing `Title bar`, `Body`, and `Text` controls and their current interactions.
- Re-ran the focused spaghetti panel suite after the style and toggle updates.

#### Summary of Implementation
- Restyled the top-level `Window Settings` shell to use the same boxed toolbar-section surface, border radius, and summary/body spacing rhythm as the `t` toolbar sections.
- Restyled the nested `Title bar`, `Body`, and `Text` groups into their own boxed rows with padded headers and indented bodies.
- Replaced the old `V / >` affordance with `- / +` so the toggle language matches the toolbar sections the user referenced.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor `i`-menu `Window Settings` area should now visually read much closer to the `t` toolbar section stack, including the cleaner boxed shells and `+ / -` toggles.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 341 -->
### [341] - 2026-03-17 19:57 - `VR / SP - Spaghetti I-Menu Header Typography Match`
<!-- ENTRY 341 -->
HUMAN SUMMARY: `Matched the spaghetti editor \`i\`-menu \`Window Settings\` header and subgroup label typography to the \`t\` toolbar section-summary font style, replacing the brighter uppercase treatment with the same calmer toolbar-label family, weight, size, and tone the user preferred.` 

#### Scope / Constraints Honored
- Kept this pass limited to the `Window Settings` header and subgroup label typography.
- Left the control layout, spacing, and interaction behavior unchanged.
- Re-ran the focused spaghetti panel suite after the typography update.

#### Summary of Implementation
- Aligned the `Window Settings` header font treatment with the spaghetti toolbar summary style.
- Aligned the subgroup chevrons and group labels with the same toolbar-label font size, family, weight, and dimmer text tone.
- Removed the uppercase and extra letter-spacing treatment from the subgroup titles.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor `i`-menu `Window Settings`, `Title bar`, `Body`, and `Text` labels should now read with the same font styling feel as the `t` toolbar section headers.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 340 -->
### [340] - 2026-03-17 19:55 - `VR / SP - Spaghetti Window Settings Top-Level Collapse`
<!-- ENTRY 340 -->
HUMAN SUMMARY: `Added a top-level collapse toggle to the spaghetti editor \`Window Settings\` section so the whole \`Title bar / Body / Text\` stack can be hidden without closing the \`i\` menu itself, making it easier to keep the settings surface available while reclaiming vertical space.` 

#### Scope / Constraints Honored
- Kept this pass limited to the spaghetti editor `Window Settings` section shell.
- Preserved the existing subsection toggles and settings controls inside the section.
- Re-ran the focused spaghetti panel suite after the structural change.

#### Summary of Implementation
- Added local top-level expand/collapse state for the whole `Window Settings` block.
- Turned the `Window Settings` header into a chevron toggle that folds the grouped settings stack open and closed.
- Left the header action buttons available in the section header while hiding the grouped `Title bar`, `Body`, and `Text` content when collapsed.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Users can now collapse the whole spaghetti editor `Window Settings` section independently from the `i`-menu open state.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 339 -->
### [339] - 2026-03-17 19:53 - `VR / SP - Spaghetti Window Settings Zero Padding Pass`
<!-- ENTRY 339 -->
HUMAN SUMMARY: `Set the spaghetti editor \`Window Settings\` container padding to zero as a tighter layout experiment, while leaving the inner control structure and spacing rules otherwise intact so the user can judge the denser section framing directly.` 

#### Scope / Constraints Honored
- Kept this change limited to the outer `Window Settings` container padding.
- Left the grouped controls, subsection toggles, and interaction behavior untouched.
- Re-ran the focused spaghetti panel suite after the spacing change.

#### Summary of Implementation
- Changed the `SpaghettiWindowSettingsSection` outer padding to `0`.
- Kept the previously tightened internal gaps so the zero-padding pass is isolated to the section frame.
- Preserved the existing settings controls and behavior while removing the section inset.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor `Window Settings` section now sits flush to its border with no outer padding.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 338 -->
### [338] - 2026-03-17 19:53 - `VR / SP - Spaghetti Window Settings Padding Tighten`
<!-- ENTRY 338 -->
HUMAN SUMMARY: `Tightened the spaghetti editor \`Window Settings\` section by reducing the container padding and internal group gaps, so the settings block reads denser and wastes less vertical space without changing the controls themselves.` 

#### Scope / Constraints Honored
- Kept this pass limited to spacing inside the spaghetti editor `Window Settings` section.
- Left the control behavior, grouping structure, and subsection toggles unchanged.
- Re-ran the focused spaghetti panel suite after the CSS spacing change.

#### Summary of Implementation
- Reduced the outer `Window Settings` padding.
- Tightened the header action gap, inter-group gap, and per-group spacing.
- Preserved the existing subsection dividers and control layout while making the section more compact overall.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor `Window Settings` block should now look more compact with less padding around and between its grouped controls.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 337 -->
### [337] - 2026-03-17 19:52 - `VR / SP - ParaSlider Clamp Band Hidden Outside Clamp Mode`
<!-- ENTRY 337 -->
HUMAN SUMMARY: `Removed the darker clamp-range background from normal \`ParaSlider\` rendering so the control now shows only the blue fill bar until clamp mode is explicitly enabled, matching the console slider cleanup the user referenced while preserving the clamp visuals for edit-clamp mode.` 

#### Scope / Constraints Honored
- Kept the fix limited to the shared `ParaSlider` clamp-range visual baseline.
- Preserved the existing clamp-edit mode behavior and clamp handles.
- Re-ran the focused spaghetti panel suite after the shared slider CSS change.

#### Summary of Implementation
- Changed the default `ParaSliderClampRange` background from a visible tinted band to transparent.
- Left the `isClampEditing` override in place so the clamp-range highlight still appears when clamp mode is active.
- Preserved the normal fill bar, marker, and clamp-edit behavior while removing the always-on darker background layer.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Normal `ParaSlider` rows now show only the blue fill bar; the darker clamp band appears only when clamp editing is active.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 336 -->
### [336] - 2026-03-17 19:48 - `VR / SP - Spaghetti I-Menu Dropdown Opaque Readability Pass`
<!-- ENTRY 336 -->
HUMAN SUMMARY: `Made the open spaghetti editor \`i\`-menu dropdown rows opaque so the menu no longer shows the shell and graph lines through it when a window-opacity setting is active, which restores basic readability while the menu is open.` 

#### Scope / Constraints Honored
- Kept this pass limited to the open spaghetti settings dropdown menu surfaces.
- Left the closed control-row opacity behavior and the rest of the floating window translucency model unchanged.
- Re-ran the focused spaghetti panel suite after the visual change.

#### Summary of Implementation
- Replaced the transparent open-menu background in the spaghetti settings `ParaSelect` popup with an opaque menu surface.
- Switched the option rows onto fully opaque backgrounds so the selected and unselected rows remain readable over the shell.
- Kept the attached dropdown structure and the current custom-menu interaction model intact.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- When a spaghetti `i`-menu dropdown is open, the menu rows should now render solid instead of letting the shell content show through them.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 335 -->
### [335] - 2026-03-17 19:46 - `VR / SP - Phase 5.0E - ParaSelect Snap Handle With Free Preview Fill`
<!-- ENTRY 335 -->
HUMAN SUMMARY: `Refined the new \`ParaSelect\` drag model so the blue fill now follows the mouse continuously as a live preview, while the white vertical handle stays snapped to the currently selected discrete option and only jumps when the drag crosses the next option threshold.` 

#### Scope / Constraints Honored
- Kept this refinement on the shared custom `ParaSelect` drag path.
- Preserved the existing split interaction model: white-bar drag for scrubbing, middle-track click for menu, side arrows for stepping.
- Verified the shared control plus both spaghetti surfaces that use custom `ParaSelect` still pass their focused suites.

#### Summary of Implementation
- Added a separate drag-preview fill state so the blue band can cling to the mouse independently of the snapped selected index.
- Kept the white handle anchored to the snapped option position, updating only when the drag crosses the discrete rounding threshold.
- Extended the `ParaSelect` drag regression test to prove the fill can move ahead of the handle before the selected option changes.

#### Files Changed
- `src/app/components/ParaSelect.tsx`
- `src/app/components/ParaSelect.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes
- During white-bar drags in custom `ParaSelect` controls, the blue fill now previews the live mouse position while the white handle remains snapped on the current selected option until the next threshold is crossed.

#### Verification Steps
- Ran `npm.cmd test -- src/app/components/ParaSelect.test.tsx src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx`

<!-- ENTRY 334 -->
### [334] - 2026-03-17 19:43 - `VR / SP - Phase 5.0E - ParaSelect White-Bar Drag Handle`
<!-- ENTRY 334 -->
HUMAN SUMMARY: `Implemented the split \`ParaSelect\` interaction model so the white vertical bar is now a real drag handle for scrubbing discrete selections, while plain clicks on the middle track still open the dropdown menu.` 

#### Scope / Constraints Honored
- Kept the new drag interaction on the shared custom `ParaSelect` path only, so it aligns with the surfaces already using the styled popup menu.
- Preserved the existing side-arrow step behavior and the existing center-click menu behavior.
- Verified the shared control, spaghetti settings surface, and spaghetti titlebar graph picker all still pass their focused tests.

#### Summary of Implementation
- Replaced the custom-mode static white marker with a real draggable handle layered over the track.
- Added discrete track-position scrubbing logic so dragging the white handle snaps between option indices without opening the dropdown menu.
- Kept the custom track button underneath for normal menu-open clicks and added focused regression coverage for handle dragging.

#### Files Changed
- `src/app/components/ParaSelect.tsx`
- `src/app/components/ParaSelect.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- In custom `ParaSelect` controls, users can now drag the white vertical handle left or right to change selection, while clicking the rest of the middle track still opens the dropdown.

#### Verification Steps
- Ran `npm.cmd test -- src/app/components/ParaSelect.test.tsx src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx`

<!-- ENTRY 333 -->
### [333] - 2026-03-17 19:39 - `VR / SP - Phase 5.0E - Spaghetti I-Menu ParaSelect Track Button Reset`
<!-- ENTRY 333 -->
HUMAN SUMMARY: `Removed the last big gray button slab from the spaghetti editor \`i\`-menu \`ParaSelect\` rows by resetting the middle track button against the broad \`.V15Panel button\` theme rule that was still painting that area like a normal button.` 

#### Scope / Constraints Honored
- Kept this fix limited to the spaghetti editor `i`-menu `ParaSelect` middle-track styling.
- Left the working custom-menu interaction and the dropdown-row styling intact.
- Re-ran the focused spaghetti panel suite after the CSS reset.

#### Summary of Implementation
- Identified that the shared `.V15Panel button` rule was still skinning the `ParaSelect` middle track button in the spaghetti settings surface.
- Added a spaghetti-settings-specific reset for the `ParaSelectTrackButton` so it no longer draws inherited button border, radius, background, or shadow chrome.
- Preserved the select fill, marker, and value styling while removing the unwanted giant gray button layer.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti `i`-menu `ParaSelect` rows should no longer show the large gray button bar across the middle track area.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 332 -->
### [332] - 2026-03-17 19:37 - `VR / SP - Phase 5.0E - Spaghetti I-Menu ParaSelect Fill And Marker Restore`
<!-- ENTRY 332 -->
HUMAN SUMMARY: `Finished bringing the spaghetti editor \`i\`-menu \`ParaSelect\` rows back toward the slider look by restoring the real track fill and value marker, instead of relying on the earlier flat fake-background approximation that still left the selects reading as different controls.` 

#### Scope / Constraints Honored
- Kept this pass local to the spaghetti editor `i`-menu `ParaSelect` row styling.
- Preserved the working custom popup behavior and attached dropdown styling from the previous fixes.
- Re-ran the focused spaghetti panel test suite after the visual adjustment.

#### Summary of Implementation
- Replaced the fixed gray/blue select-track approximation with the real `ParaSelect` fill and marker visuals in the spaghetti settings surface.
- Matched the settings `ParaSelect` fill, marker, and selected-value stacking more closely to the `ParaSlider` track language.
- Left the compact right-side value treatment in place while restoring the moving visual track cues that make the selects read like related controls.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti `i`-menu `ParaSelect` rows should now look much closer to the `ParaSlider` rows because they again show a fill band and white marker instead of a mostly flat bar.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 331 -->
### [331] - 2026-03-17 19:35 - `VR / SP - Phase 5.0E - Spaghetti I-Menu ParaSelect Row Chrome Match`
<!-- ENTRY 331 -->
HUMAN SUMMARY: `Brought the spaghetti editor \`i\`-menu \`ParaSelect\` rows closer to the \`ParaSlider\` rows by giving them the same blue-leaning track feel, removing the mismatched progress marker, and styling the right-side selected value like the slider's compact value area.` 

#### Scope / Constraints Honored
- Kept this pass local to the spaghetti editor `i`-menu `ParaSelect` row styling.
- Preserved the custom-menu behavior and the already-restored attached dropdown styling.
- Verified the spaghetti panel settings interactions still pass the focused test suite.

#### Summary of Implementation
- Added a spaghetti-settings-specific `ParaSelect` track background that visually matches the slider track more closely.
- Hid the `ParaSelect` fill and value marker in that settings surface so the row no longer fights the slider visual language.
- Styled the selected-value area to behave more like the slider's compact right-side value chip on hover, focus, and open states.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti `i`-menu `ParaSelect` rows should now read much closer to the `ParaSlider` rows in the same settings stack.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 330 -->
### [330] - 2026-03-17 19:33 - `VR / SP - Phase 5.0E - Spaghetti I-Menu Dropdown Slab Removal`
<!-- ENTRY 330 -->
HUMAN SUMMARY: `Removed the extra dark dropdown slab that was still sitting behind the spaghetti editor \`i\`-menu custom \`ParaSelect\` rows, so the restored attached-menu style no longer reads like a separate gray popup bar under the control.` 

#### Scope / Constraints Honored
- Kept this follow-up limited to the spaghetti editor `i`-menu dropdown styling.
- Left the working custom-menu interaction path intact.
- Verified the spaghetti panel settings controls still pass their focused test suite after the visual adjustment.

#### Summary of Implementation
- Removed the visible popup-container fill from the spaghetti settings `ParaSelect` menus.
- Moved the dropdown surface styling onto the rows themselves so the menu reads as attached stacked rows instead of a dark slab with rows inside it.
- Tightened the attached-menu border so it joins the control more cleanly without the extra top seam.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti `i`-menu dropdowns should no longer show an extra gray/dark bar behind the menu rows.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 329 -->
### [329] - 2026-03-17 19:31 - `VR / SP - Phase 5.0E - Spaghetti I-Menu ParaSelect Style Restore`
<!-- ENTRY 329 -->
HUMAN SUMMARY: `Restored the spaghetti editor \`i\`-menu dropdowns to a flatter attached dropdown look after the middle-click bug fix had forced them onto the generic popup-card style, so they behave correctly without looking like a different menu system.` 

#### Scope / Constraints Honored
- Kept this pass local to the spaghetti editor `i`-menu `ParaSelect` dropdown styling.
- Preserved the custom-menu behavior needed for reliable middle-track opening.
- Avoided changing the titlebar graph picker styling or the shared generic popup menu baseline.

#### Summary of Implementation
- Added spaghetti-settings-specific overrides for the custom `ParaSelect` popup menu.
- Flattened the popup into an attached dropdown with tighter edges, no inset card rows, and row highlighting that better matches the original settings-control feel.
- Left the working custom popup interaction path untouched while restoring the older visual language in that one settings surface.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti `i`-menu appearance dropdowns now open with a flatter attached style that reads closer to the prior settings-menu look.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 328 -->
### [328] - 2026-03-17 19:30 - `VR / SP - Phase 5.0E - Spaghetti I-Menu ParaSelect Middle-Click Fix`
<!-- ENTRY 328 -->
HUMAN SUMMARY: `Fixed the spaghetti editor \`i\`-menu \`ParaSelect\` controls so clicking the middle track opens a real popup menu again, instead of blanking the center content while only the side arrows still worked.` 

#### Scope / Constraints Honored
- Kept the fix limited to the spaghetti editor `i`-menu appearance selects.
- Left the spaghetti titlebar graph picker on its own custom path and did not change unrelated shared-panel select behavior.
- Added focused panel coverage for the exact `Text > Size` middle-click regression the user reported.

#### Summary of Implementation
- Switched the spaghetti `i`-menu appearance `ParaSelect` controls onto the explicit custom-menu path instead of relying on the hidden native-select click behavior.
- Covered the `Text > Size` control with a test that clicks the middle track and verifies the popup menu renders its options.
- Preserved the existing side-arrow cycling behavior while restoring a working center-click menu path.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti `i`-menu appearance selects now open their dropdown menus reliably from the middle track area.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 327 -->
### [327] - 2026-03-17 19:25 - `VR / SP - Phase 5.0E - Spaghetti I-Menu Section Collapse Toggles`
<!-- ENTRY 327 -->
HUMAN SUMMARY: `Added per-section expand/collapse toggles to the spaghetti editor \`i\` menu so the new \`Title bar\`, \`Body\`, and \`Text\` groups can be folded closed with \`>\` and reopened with \`V\` without changing the underlying settings model.` 

#### Scope / Constraints Honored
- Kept the work limited to the spaghetti editor `i`-menu subsection chrome and local expand/collapse state.
- Preserved the appearance-control grouping added in the previous pass and did not alter the actual appearance values or wiring.
- Added focused panel-test coverage for collapsing and re-expanding one subsection.

#### Summary of Implementation
- Added local per-section expansion state for the `Title bar`, `Body`, and `Text` groups.
- Replaced the static subsection headings with clickable row toggles that show `V` when open and `>` when closed.
- Unmounted collapsed subsection contents so folded groups truly remove their controls from the rendered settings stack.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Users can now collapse and re-expand each spaghetti `i`-menu appearance subsection independently from its own heading row.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 326 -->
### [326] - 2026-03-17 19:23 - `VR / SP - Phase 5.0E - Spaghetti I-Menu Appearance Sections`
<!-- ENTRY 326 -->
HUMAN SUMMARY: `Reorganized the spaghetti editor \`i\` menu appearance controls into full-width grouped rows under \`Title bar\`, \`Body\`, and \`Text\`, so the sliders and selects read as a cleaner settings stack instead of a mixed auto-fit grid.` 

#### Scope / Constraints Honored
- Kept this pass limited to the spaghetti editor `i`-menu appearance layout and labeling.
- Preserved the existing appearance state model and control wiring while only changing grouping, row structure, and section presentation.
- Added focused panel-test coverage to confirm the grouped settings layout still renders and behaves correctly.

#### Summary of Implementation
- Replaced the old auto-fit settings grid with three stacked appearance groups: `Title bar`, `Body`, and `Text`.
- Moved every `ParaSlider` and `ParaSelect` to its own full-width row and shortened the row labels so they read naturally inside each subsection.
- Added subsection title and divider styling so the settings sheet has clearer visual grouping without affecting the actual appearance-setting behavior.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor `i` menu now shows the appearance controls as grouped one-control-per-row sections instead of a multi-column mix of sliders and selects.

#### Verification Steps
- Ran `npm.cmd test -- src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 325 -->
### [325] - 2026-03-17 19:20 - `VR / SP - Phase 5.0E - Spaghetti Titlebar Add New Graph Shortcut`
<!-- ENTRY 325 -->
HUMAN SUMMARY: `Added an \`Add New Graph\` action to the spaghetti titlebar graph picker so users can create and bind a fresh graph directly from that menu without detouring into another surface.` 

#### Scope / Constraints Honored
- Kept the work limited to the spaghetti titlebar graph picker and its custom `ParaSelect` menu.
- Reused the existing spaghetti-store graph creation and viewport-binding actions instead of inventing a separate creation path.
- Added focused test coverage for both the shared custom-menu action support and the spaghetti titlebar integration path.

#### Summary of Implementation
- Extended `ParaSelect` custom-menu mode with optional action rows that can live under the normal option list.
- Added an `Add New Graph` action to the spaghetti titlebar graph picker that creates a new graph document, focuses the current editor viewport, and binds that viewport to the new graph.
- Updated the `AppShell` test harness so the mocked spaghetti store supports viewport-to-graph rebinding during the new shortcut flow.

#### Files Changed
- `src/app/components/ParaSelect.tsx`
- `src/app/AppShell.tsx`
- `src/app/components/ParaSelect.test.tsx`
- `src/app/AppShell.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti titlebar graph picker menu now includes an `Add New Graph` shortcut that immediately switches the current editor viewport onto the newly created graph.

#### Verification Steps
- Ran `npm.cmd test -- src/app/components/ParaSelect.test.tsx src/app/AppShell.test.tsx`

<!-- ENTRY 324 -->
### [324] - 2026-03-17 19:15 - `VR / SP - Phase 5.0E - Spaghetti Titlebar Menu Text Style Match`
<!-- ENTRY 324 -->
HUMAN SUMMARY: `Forced the spaghetti titlebar graph-picker popup rows to use the same explicit text styling as the top selected-value line, so the open menu no longer looks like it belongs to a different font/weight/padding system than the control above it.` 

#### Scope / Constraints Honored
- Kept this pass limited to the spaghetti-titlebar popup text styling.
- Left the restored shared `ParaSelect` baseline untouched and only refined the titlebar-specific overrides.
- Verified the shared component and spaghetti shell integration still pass their focused tests.

#### Summary of Implementation
- Applied explicit titlebar typography rules to the selected-value line in the graph picker so its font contract is not left to inheritance.
- Applied the same font family, size, weight, letter-spacing, case, and color rules to the titlebar popup menu rows.
- Kept the popup row inset aligned with the compact titlebar control while flattening the selected-row text treatment to match the top line.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti titlebar graph-picker popup text should now match the top selected-value text much more closely in weight, font, and padding feel.

#### Verification Steps
- Ran `npm.cmd test -- src/app/components/ParaSelect.test.tsx src/app/AppShell.test.tsx`

<!-- ENTRY 323 -->
### [323] - 2026-03-17 19:13 - `VR / SP - Phase 5.0E - ParaSelect Titlebar Custom Mode Isolation`
<!-- ENTRY 323 -->
HUMAN SUMMARY: `Isolated the custom popup-menu behavior to the spaghetti titlebar graph picker so the normal shared \`ParaSelect\` controls in the spaghetti editor's \`i\` menu and other panels return to their original baseline appearance.` 

#### Scope / Constraints Honored
- Corrected the earlier overreach by restoring the default shared `ParaSelect` path for normal panel usage.
- Kept the custom popup/menu behavior only where it was actually needed: the spaghetti titlebar graph picker.
- Verified the shared control, spaghetti settings panel, and spaghetti shell integration together.

#### Summary of Implementation
- Added a `menuMode` seam to `ParaSelect` with `native` as the default shared behavior and `custom` only for the titlebar use case.
- Restored the default shared `ParaSelect` track/layout CSS path so the spaghetti `i`-menu controls go back to the baseline styling instead of inheriting the custom titlebar behavior.
- Updated the spaghetti titlebar graph picker in `AppShell` to opt into `menuMode="custom"`.
- Updated the component test so the custom popup assertion now explicitly targets the titlebar-style custom mode.

#### Files Changed
- `src/app/components/ParaSelect.tsx`
- `src/app/components/ParaSelect.test.tsx`
- `src/app/AppShell.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Regular shared `ParaSelect` controls now use the original baseline appearance again.
- The spaghetti titlebar graph picker keeps the custom popup/menu behavior and titlebar-specific styling.

#### Verification Steps
- Ran `npm.cmd test -- src/app/components/ParaSelect.test.tsx src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx`

<!-- ENTRY 322 -->
### [322] - 2026-03-17 19:11 - `VR / SP - Phase 5.0E - ParaSelect Label Value Truncation Fix`
<!-- ENTRY 322 -->
HUMAN SUMMARY: `Fixed the shared \`ParaSelect\` track layout so longer control labels no longer collide with the selected value text, which restores the spaghetti editor's \`i\`-menu selects after the earlier popup/menu refactor.` 

#### Scope / Constraints Honored
- Kept this pass focused on the shared `ParaSelect` track text layout instead of reopening the popup behavior or titlebar-specific menu skin.
- Fixed the regression at the shared-control layer so the spaghetti settings panel and other uses recover together.
- Verified both the shared component and the spaghetti settings panel with focused tests.

#### Summary of Implementation
- Added `min-width: 0` to the shared `ParaSelectContent` container so its children can shrink predictably.
- Made the left-side `ParaSelectLabel` a truncating flex item with ellipsis instead of a non-shrinking inline span.
- Limited the selected-value segment width and added ellipsis handling to its text span so the label and selected value no longer overlap in narrow controls.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Shared `ParaSelect` controls now truncate cleanly when the label and current value compete for space.
- The spaghetti editor's `i`-menu selects should no longer show merged label/value text.

#### Verification Steps
- Ran `npm.cmd test -- src/app/components/ParaSelect.test.tsx src/app/panels/SpaghettiPanel.test.tsx`

<!-- ENTRY 321 -->
### [321] - 2026-03-17 19:09 - `VR / SP - Phase 5.0E - Spaghetti Titlebar ParaSelect Menu Typography Match`
<!-- ENTRY 321 -->
HUMAN SUMMARY: `Adjusted the spaghetti titlebar popup rows so their text now matches the top selected-value styling more closely, replacing the heavier generic menu typography with the same lighter compact titlebar treatment.` 

#### Scope / Constraints Honored
- Kept this pass limited to titlebar-specific popup row typography and inset styling.
- Left the shared `ParaSelect` component behavior unchanged and only refined the spaghetti-titlebar variant.
- Verified the shared control and shell integration still pass their focused tests.

#### Summary of Implementation
- Changed the titlebar popup menu rows to use the compact titlebar font size and family explicitly.
- Lowered the popup row weight from the heavier generic menu style to match the top selected-value text more closely.
- Kept the titlebar popup row padding aligned with the compact top control and flattened the selected-row styling so it no longer reads like a different menu family.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti titlebar graph-picker popup text now matches the top control more closely in size, weight, and general visual tone.

#### Verification Steps
- Ran `npm.cmd test -- src/app/components/ParaSelect.test.tsx src/app/AppShell.test.tsx`

<!-- ENTRY 320 -->
### [320] - 2026-03-17 19:08 - `VR / SP - Phase 5.0E - Spaghetti Titlebar ParaSelect Compact Menu Rows`
<!-- ENTRY 320 -->
HUMAN SUMMARY: `Tightened the spaghetti titlebar's popup option rows so the opened \`ParaSelect\` menu now uses the same compact row height as the top titlebar control instead of reading like a larger panel menu.` 

#### Scope / Constraints Honored
- Kept this pass limited to the compact spaghetti-titlebar `ParaSelect` popup row sizing.
- Left the shared popup behavior and general app-level `ParaSelect` menu sizing unchanged.
- Verified the shared control and shell integration still pass their focused tests.

#### Summary of Implementation
- Reduced the titlebar-specific `ParaSelectMenuOption` row height from the larger panel-menu size to the compact titlebar control height.
- Tightened the titlebar popup row padding and line-height so the menu visually matches the top selected-value track.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti titlebar graph-picker menu rows are now shorter and visually aligned with the compact top control.

#### Verification Steps
- Ran `npm.cmd test -- src/app/components/ParaSelect.test.tsx src/app/AppShell.test.tsx`

<!-- ENTRY 319 -->
### [319] - 2026-03-17 19:07 - `VR / SP - Phase 5.0E - Spaghetti Titlebar ParaSelect Menu Alignment`
<!-- ENTRY 319 -->
HUMAN SUMMARY: `Polished the spaghetti titlebar's compact \`ParaSelect\` skin so the side arrows and center track now share the same height, and the opened popup menu attaches flush to the center track with square edges instead of looking like a separate rounded card.` 

#### Scope / Constraints Honored
- Kept this follow-up limited to titlebar-specific `ParaSelect` presentation polish in the spaghetti editor shell.
- Left the shared popup/menu behavior intact and only adjusted the compact titlebar overrides.
- Verified the shared `ParaSelect` component and spaghetti shell integration still pass their focused tests.

#### Summary of Implementation
- Added box-sizing and unified track/button sizing so the titlebar caps and center track render at the same visual height.
- Applied the titlebar menu-open focus state consistently to the center track.
- Anchored the titlebar popup menu directly to the center track edges with `left` and `right` attachment instead of a floating inset card.
- Removed the titlebar popup/menu fillets and internal gaps so the opened list reads as one continuous control with the center track.
- Flattened the titlebar menu option row styling so the list items align edge-to-edge beneath the track.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti titlebar graph picker now looks like one cohesive three-part control.
- Its popup menu now aligns directly with the middle track and uses square edges instead of rounded card corners.

#### Verification Steps
- Ran `npm.cmd test -- src/app/components/ParaSelect.test.tsx src/app/AppShell.test.tsx`

<!-- ENTRY 318 -->
### [318] - 2026-03-17 19:00 - `VR / SP - Phase 5.0E - Shared ParaSelect Styled Popup`
<!-- ENTRY 318 -->
HUMAN SUMMARY: `Reworked the shared \`ParaSelect\` control to open an app-styled popup menu instead of relying on the browser's native select dropdown, which fixes the mismatched spaghetti-editor titlebar graph picker and makes the menu styling consistent with the rest of ParaHook.` 

#### Scope / Constraints Honored
- Fixed the underlying shared `ParaSelect` menu behavior instead of stacking more spaghetti-titlebar-only CSS on top of the native browser dropdown.
- Kept the existing previous/next cap behavior and hidden native select seam so current tests and programmatic change paths still work.
- Verified both the shared component and the spaghetti shell integration with focused tests.

#### Summary of Implementation
- Replaced the visible `ParaSelect` track interaction with an app-controlled track button and styled popup option list.
- Kept a hidden native `.ParaSelectNative` element in the DOM so existing tests and select-based change paths remain intact.
- Added click-outside and `Escape` close behavior for the shared popup menu.
- Added generic `ParaSelectMenu` and `ParaSelectMenuOption` styles so the opened menu now matches the app's other control surfaces.
- Let the spaghetti titlebar picker inherit that shared popup behavior automatically instead of opening the old native Windows-style dropdown.

#### Files Changed
- `src/app/components/ParaSelect.tsx`
- `src/app/components/ParaSelect.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Opening a `ParaSelect` now shows a styled in-app popup list instead of the browser-native select menu.
- The spaghetti editor graph picker now opens with the same menu language as the other shared `ParaSelect` controls.

#### Verification Steps
- Ran `npm.cmd test -- src/app/components/ParaSelect.test.tsx src/app/AppShell.test.tsx`

<!-- ENTRY 317 -->
### [317] - 2026-03-17 18:55 - `VR / SP - Phase 5.0E - Spaghetti Titlebar Graph Picker Width Fix`
<!-- ENTRY 317 -->
HUMAN SUMMARY: `Relaxed the spaghetti titlebar graph picker sizing so the shared \`ParaSelect\` no longer looks cramped, giving the selected graph name more width and dropping the extra visible \`Graph\` label inside the compact titlebar variant.` 

#### Scope / Constraints Honored
- Kept this change narrowly focused on the titlebar graph picker layout without changing the picker behavior itself.
- Preserved the shared `ParaSelect` component and only adjusted the compact spaghetti-titlebar presentation.
- Verified the shell still passes its focused regression suite after the sizing change.

#### Summary of Implementation
- Increased the computed width budget for the spaghetti titlebar graph picker in `AppShell`.
- Added a real minimum width and maximum width guard for the titlebar picker wrapper.
- Hid the extra `ParaSelectLabel` in the titlebar-specific variant so the selected graph name gets the available horizontal space.
- Added ellipsis-safe value styling so longer graph names clip cleanly instead of visually colliding with the caps and chevron.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The titlebar graph picker is wider and less visually squashed.
- The compact titlebar variant now prioritizes showing the selected graph name rather than the extra `Graph` label.

#### Verification Steps
- Ran `npm.cmd test -- AppShell.test.tsx`

<!-- ENTRY 316 -->
### [316] - 2026-03-17 18:53 - `VR / SP - Phase 5.0E - Spaghetti Titlebar Graph ParaSelect`
<!-- ENTRY 316 -->
HUMAN SUMMARY: `Replaced the spaghetti titlebar's native graph-document dropdown with the shared \`ParaSelect\` control so the editor shell now uses the same select chrome language as the rest of the app.` 

#### Scope / Constraints Honored
- Kept this change narrow to the spaghetti titlebar graph picker without broadening into unrelated `5.0E` viewport-type work.
- Reused the existing shared `ParaSelect` component instead of introducing another one-off titlebar select style.
- Verified the titlebar swap with the focused `AppShell` regression suite.

#### Summary of Implementation
- Replaced the native titlebar graph `<select>` in `AppShell` with `ParaSelect`.
- Added a dedicated `SpaghettiGraphDocumentPicker` wrapper and titlebar-scoped `ParaSelect` chrome styles so the shared control fits the compact editor header.
- Added a focused `AppShell` regression asserting the spaghetti graph picker now renders as `.ParaSelectNative`.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/AppShell.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The `Graph 1` titlebar selector now uses the app's shared `ParaSelect` appearance and interaction chrome.
- Graph document switching behavior remains the same.

#### Verification Steps
- Ran `npm.cmd test -- AppShell.test.tsx`

<!-- ENTRY 315 -->
### [315] - 2026-03-17 18:49 - `VR / SP - Phase 5.0E - Spaghetti Titlebar Essentials Cycle`
<!-- ENTRY 315 -->
HUMAN SUMMARY: `Extended the spaghetti editor's leftmost titlebar control from a simple \`- / +\` toggle into a three-state \`- / e / +\` cycle, with the new essentials state forcing the titlebar's \`c\` and \`t\` feature toggles off for that viewport.` 

#### Scope / Constraints Honored
- Kept this change inside the existing spaghetti shell/titlebar behavior without broadening into the larger `5.0E` viewport-type standardization work.
- Preserved the current right-side `c` and `t` controls while making the new `e` state drive them off automatically.
- Verified the shell change with the focused `AppShell` regression suite.

#### Summary of Implementation
- Replaced the old first-button collapse-only behavior with a primary-view-mode cycle in `SpaghettiWindowTitleBar`.
- Added a computed `essentials` state when the editor is not collapsed, the header toolbar is collapsed, and the canvas toolbar is hidden.
- Wired the cycle so:
  - `-` switches the viewport into essentials by turning the header and canvas toolbar off
  - `e` collapses the editor
  - `+` restores the editor and turns the header and canvas toolbar back on
- Updated the `AppShell` regression to verify the left-side button cycles through `-`, `e`, and `+` and that the essentials state leaves the header collapsed and canvas toolbar hidden.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor's first titlebar button now has three visible states instead of two.
- Entering essentials through the first button now guarantees the `t` and `c` titlebar controls read as off for that viewport.

#### Verification Steps
- Ran `npm.cmd test -- AppShell.test.tsx`

<!-- ENTRY 314 -->
### [314] - 2026-03-17 18:45 - `VR / SP - Phase 5.0E - Spaghetti Titlebar First-Button Standard`
<!-- ENTRY 314 -->
HUMAN SUMMARY: `Implemented the first concrete \`5.0E\` spaghetti-shell tweak by moving the editor collapse control to the far-left title position, changing its glyph cycle to \`-\` and \`+\` like Browser, and marking the roadmap's \`5.0E\` title status as complete for that entry.` 

#### Scope / Constraints Honored
- Kept this cut limited to the concrete `5.0E` entry-1 titlebar tweak instead of broadening into viewport-type model refactors.
- Preserved the existing spaghetti shell actions and collapse behavior while only changing the control position and visible symbol cycle.
- Updated the required roadmap/changelog maintenance in the same change set.

#### Summary of Implementation
- Moved the spaghetti collapse button out of the right-side core action cluster and into a new left-side title cluster ahead of the `Spaghetti Editor` / `Meatball Editor` title.
- Replaced the old `__` glyph with a Browser-style `-` when expanded and `+` when collapsed, while keeping the same collapse/expand action wiring.
- Added `aria-expanded` on the first button so the new visual cycle is reflected in the titlebar control semantics.
- Added regression coverage proving the button now sits to the left of the title text and cycles from `-` to `+` after collapsing.
- Flipped the roadmap title marker for `[5.0E]` from `[ ]` to `[x]` after landing entry `[1]`.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/AppShell.test.tsx`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The spaghetti editor's first titlebar button now visually matches the Browser pattern more closely by living on the far left and cycling between `-` and `+`.
- The rest of the spaghetti titlebar actions remain on the right-side action cluster.

#### Verification Steps
- Ran `npm test -- AppShell.test.tsx`

<!-- ENTRY 313 -->
### [313] - 2026-03-17 17:58 - `VR / SP - Phase 5.0D - Deferred Legacy Residue And Dead-Surface Cleanup`
<!-- ENTRY 313 -->
HUMAN SUMMARY: `Implemented \`5.0D\` by removing the old title-bar \`Build Stats\` drawer path, deleting dead shell surfaces left behind by the panel-era cleanup, stripping the unowned spaghetti output-list selector family, and pruning the last dead app-store \`assembled\` residue so the \`5.0\` cleanup family is fully closed.` 

#### Scope / Constraints Honored
- Kept the runtime cleanup focused on deferred residue after the shipped `5.0A-C` work.
- Removed dead shell surfaces and unowned state/selectors without broadening the cut into new feature re-homing.
- Preserved the live title-bar progress strip and dispatcher-side build bookkeeping instead of deleting still-used diagnostics/state blindly.

#### Summary of Implementation
- Removed the click-to-open title-bar `Build Stats` drawer path from `TitleStatusBar` and `AppShell`, and deleted `BuildStatsDrawer.tsx`.
- Removed `statsExpanded` / `toggleStatsExpanded` from `buildStatsStore` while keeping the still-live build progress/pulse state.
- Deleted dead shell files left behind after the earlier cleanup wave:
  - `Toolbar.tsx`
  - `PartsListPanel.tsx`
  - `BoxPanel.tsx`
- Removed the unowned spaghetti output-list selector family and its stale barrel/test coverage.
- Removed the dead app-store `assembled` / `assembledSignature` / `setAssembled` path and the now-unused bootstrap assemble-result wiring.
- Cleaned related stale CSS, imports, mocks, and tests so the deleted surfaces no longer leave residue in the shell or selector layer.
- Moved `05.0D` from `Tasks/Future` to `Tasks/Old`, updated the roadmap, and closed the `5.0` lane bookkeeping.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/components/TitleStatusBar.tsx`
- `src/app/store/buildStatsStore.ts`
- `src/app/store/useAppStore.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/AppShell.test.tsx`
- `src/app/buildDispatcher.test.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/selectors/index.test.ts`
- `src/app/theme/v15Theme.css`
- `docs/Phase-Plans/Tasks/Old/05.0D - VR-SP - Deferred Legacy Residue And Dead-Surface Cleanup.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`
- `docs/CHANGELOG.md`

#### Deleted Files
- `src/app/components/BuildStatsDrawer.tsx`
- `src/app/components/Toolbar.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/panels/BoxPanel.tsx`
- `src/app/spaghetti/partsList/selectPartsListItems.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.test.ts`

#### Behavior Changes (if any)
- Clicking `ParaHook Generator` no longer opens the old `Build Stats` drawer.
- The dead left-dock/panel-era shell files are now removed instead of lingering unused in the repo.
- The app no longer carries the dead app-store `assembled` state path that the live viewer stopped using.

#### Verification Steps
- Ran:
  - `cmd /c npm run build`
  - `cmd /c npm test -- src/app/AppShell.test.tsx src/app/buildDispatcher.test.ts src/app/spaghetti/selectors/index.test.ts src/app/store/useAppStore.test.ts`
- Result:
  - production build passed
  - `50` tests passed

<!-- ENTRY 312 -->
### [312] - 2026-03-17 17:47 - `DOC - Phase 14 - 5.0D Implementation-Ready Spec`
<!-- ENTRY 312 -->
HUMAN SUMMARY: `Reworked the deferred \`5.0D\` cleanup doc into an implementation-ready execution spec, locking the remaining residue decisions around deleting dead shell files, removing the title-bar \`Build Stats\` drawer, classifying leftover viewer state, and removing unowned spaghetti output-list selectors.` 

#### Scope / Constraints Honored
- Kept this change limited to docs/planning specification work.
- Did not change runtime residue behavior yet.
- Preserved `5.0D` as a deferred cleanup lane rather than turning it into a new feature or re-home plan.

#### Summary of Implementation
- Added a new doc-history entry marking `05.0D` implementation-ready.
- Replaced the remaining open-question posture with locked cleanup rules and a locked removal order.
- Added a stronger current-state framing tied to the live residue seams in `AppShell`, `TitleStatusBar`, `BuildStatsDrawer`, `buildStatsStore`, dead shell panels, and the spaghetti output-list selector family.
- Added explicit residue/interface locks for:
  - `statsExpanded`
  - title-bar build-stats UI
  - `assembled` / `assembledSignature`
  - output-list selectors
  - stale shell styling
- Added a concrete verification/proof bar for the eventual `5.0D` implementation pass.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/05.0D - VR-SP - Deferred Legacy Residue And Dead-Surface Cleanup.md`

#### Behavior Changes (if any)
- None. This was a planning/doc readiness update only.

#### Verification Steps
- Verified the updated `05.0D` doc now reads as a decision-complete cleanup spec rather than an open-question holding doc.
- Verified the locked spec matches the current repo read:
  - remove the title-bar `Build Stats` drawer
  - delete dead panel files instead of keeping stubs
  - remove unowned output-list helpers
  - keep `5.0D` deferred and non-blocking for `[5.1]`

<!-- ENTRY 311 -->
### [311] - 2026-03-17 17:43 - `DOC - Phase 14 - 5.0D Build Stats Residue Note`
<!-- ENTRY 311 -->
HUMAN SUMMARY: `Extended the deferred \`5.0D\` cleanup doc to explicitly track the title-bar \`Build Stats\` drawer as likely legacy shell residue, so the old \`ParaHook Generator\` click-to-open loading bars now have a named later remove-versus-rehome decision instead of staying implicit.` 

#### Scope / Constraints Honored
- Kept this as a docs/planning update only.
- Did not change runtime title-bar or build-stats behavior yet.
- Preserved `5.0D` as the deferred home for non-blocking legacy residue after the shipped `5.0A-C` work.

#### Summary of Implementation
- Added `TitleStatusBar`, `BuildStatsDrawer`, and `buildStatsStore` to the `5.0D` likely residue seams.
- Added a dedicated inventory block for the title-bar legacy drawer behavior.
- Added a new explicit decision question for whether the `Build Stats` drawer should be removed or re-homed.
- Expanded the likely-files list so the deferred cleanup phase now tracks that title-bar build-stats surface directly.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/05.0D - VR-SP - Deferred Legacy Residue And Dead-Surface Cleanup.md`

#### Behavior Changes (if any)
- None. This was a planning/doc update only.

#### Verification Steps
- Verified the updated `05.0D` doc now explicitly names the title-bar `Build Stats` drawer as deferred legacy residue tied to:
  - `TitleStatusBar`
  - `BuildStatsDrawer`
  - `buildStatsStore`

<!-- ENTRY 310 -->
### [310] - 2026-03-17 17:41 - `DOC - Phase 14 - 5.0D Deferred Cleanup Doc Sync`
<!-- ENTRY 310 -->
HUMAN SUMMARY: `Updated the deferred \`5.0D\` cleanup doc after shipping \`5.0C\`, so it now reflects the real post-branch-collapse residue still left in ParaHook instead of the older assumption that the app-level \`parts / assembled\` split was still a live runtime decision.` 

#### Scope / Constraints Honored
- Kept this change limited to docs/planning alignment.
- Did not change runtime code or roadmap status.
- Preserved `5.0D` as the deferred non-blocking cleanup lane after the shipped `5.0A-C` work.

#### Summary of Implementation
- Updated `05.0D` doc history to record the sync pass.
- Re-pointed the source references from the old `Tasks/Future` `05.0A-C` docs to their landed `Tasks/Old` locations.
- Reframed the residue inventory so it now reflects the shipped `5.0C` state:
  - dead files
  - selector ownership
  - wording cleanup
  - remaining viewer/state residue
- Replaced the stale `parts / assembled` open question with a more accurate post-`5.0C` residue-classification question.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/05.0D - VR-SP - Deferred Legacy Residue And Dead-Surface Cleanup.md`

#### Behavior Changes (if any)
- None. This was a planning/doc sync only.

#### Verification Steps
- Verified the updated `05.0D` doc now points at the landed `05.0A-C` task-doc locations and no longer treats the removed app-level `parts / assembled` split as an unresolved runtime decision.

<!-- ENTRY 309 -->
### [309] - 2026-03-17 17:09 - `VR / SP - Phase 5.0C - Legacy Input-Mode Branch Removal`
<!-- ENTRY 309 -->
HUMAN SUMMARY: `Implemented \`5.0C\` by removing the live app-level \`inputMode\` and \`Parts / Assembled\` viewer split from the runtime path, collapsing the viewer/build/browser shell onto one spaghetti-era flow, and then moving the task doc to \`Tasks/Old\` with the roadmap/docs index updated to match.` 

#### Scope / Constraints Honored
- Kept this change focused on the real runtime branch collapse promised by `5.0C`.
- Removed the live store/viewer/build-routing dependence on `legacy` mode without turning this into the full dead-file purge.
- Left broader residue cleanup deferred to `5.0D`.

#### Summary of Implementation
- Removed app-level `inputMode`, `setInputMode`, `viewMode`, and `setViewMode` usage from the live runtime/store path.
- Collapsed `useAppStore`, `bootstrapBuildWiring`, `ViewerHost`, `ViewToolbar`, `ViewportOverlay`, `ConsoleDock`, `AppShell`, and `BrowserPanel` onto a single spaghetti-era preview/build flow.
- Simplified dead-shell leftovers like `Toolbar.tsx`, `PartsListPanel.tsx`, and the debug-inspector selector contract so they no longer preserve the removed branch behavior.
- Updated focused tests for the store, Browser panel, AppShell, console publishers, and debug inspector selector.
- Moved `05.0C` from `docs/Phase-Plans/Tasks/Future/` to `docs/Phase-Plans/Tasks/Old/` and synced the roadmap/docs inventory.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/AppShell.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/components/Toolbar.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/console/consolePublishers.test.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- `docs/Phase-Plans/Tasks/Old/05.0C - VR-SP - Legacy Input-Mode Branch Removal.md`
- `docs/Phase-Plans/Tasks/Future/05.0 - VR-SP - Pre-Workspace Shell Cleanup And Legacy Panel Reduction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`

#### Behavior Changes (if any)
- The app no longer carries a live `legacy` versus `spaghetti` input-mode fork in normal runtime behavior.
- The old `Parts / Assembled` viewer split no longer exists in the live app path.
- Browser/editor/viewer/build routing now assumes the spaghetti-era preview path directly.
- Console `status` output now reports the spaghetti preview path instead of the removed mode pair.

#### Verification Steps
- Ran:
  - `cmd /c npm run build`
  - `cmd /c npm test -- src/app/store/useAppStore.test.ts src/app/panels/BrowserPanel.test.tsx src/app/AppShell.test.tsx src/app/console/consolePublishers.test.ts src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- Result:
  - build passed
  - `79` tests passed

<!-- ENTRY 308 -->
### [308] - 2026-03-17 16:59 - `VR / SP - Worker Error Console Null Guard Build Fix`
<!-- ENTRY 308 -->
HUMAN SUMMARY: `Fixed the current TypeScript build break in \`useAppStore\` by guarding the console append inside \`setWorkerError\` so clearing the worker error no longer passes \`null\` into the console transcript text field.`

#### Scope / Constraints Honored
- Kept the fix minimal and local to the failing nullability seam in `useAppStore`.
- Preserved the existing behavior where real worker errors still flow into the `Console`.
- Did not change any broader `5.0C` runtime-branch behavior.

#### Summary of Implementation
- Added a null guard in `setWorkerError`.
- `workerError` still stores `string | null`.
- Console publishing now only happens when the incoming worker error message is a real string.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Clearing `workerError` no longer tries to create a console entry with `null` text.
- Actual worker error strings still publish to the `Worker` console layer.

#### Verification Steps
- Ran:
  - `npm run build`
- Result:
  - build completed successfully

<!-- ENTRY 307 -->
### [307] - 2026-03-17 16:56 - `DOC - Phase 10 - 5.0C Implementation-Ready Spec Locked`
<!-- ENTRY 307 -->
HUMAN SUMMARY: `Tightened the \`05.0C\` task doc into a decision-complete execution spec by explicitly removing both \`inputMode\` and \`viewMode\`, locking the death of the old \`Parts / Assembled\` viewer split, and separating runtime branch collapse in \`5.0C\` from dead-file cleanup in \`5.0D\`.`

#### Scope / Constraints Honored
- Kept the change in the planning/task-doc layer only.
- Locked the remaining `5.0C` runtime decisions against the live store/viewer seams instead of broadening the phase into a full residue purge.
- Left actual code removal for the later implementation pass.

#### Summary of Implementation
- Added a new `Doc History` entry to `05.0C`.
- Updated the task purpose, scope, and outcome so the phase now explicitly removes:
  - `InputMode`
  - `setInputMode`
  - `ViewMode`
  - `setViewMode`
- Reworked the removal-order section so `5.0C` now has a six-step runtime-collapse sequence.
- Added an explicit `Locked Viewer Rule` that removes the old `Parts / Assembled` concept with the legacy branch.
- Added an explicit `Locked Cleanup Boundary` so dead-file pruning remains deferred to `5.0D`.
- Updated the proof bar and important-interface list to match the now-locked runtime behavior.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/05.0C - VR-SP - Legacy Input-Mode Branch Removal.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- The `5.0C` planning surface is now implementation-ready and decision-complete.

#### Verification Steps
- Verified the current task doc against the live seams in:
  - `src/app/store/useAppStore.ts`
  - `src/app/components/ViewerHost.tsx`
  - `src/app/components/Toolbar.tsx`
- No code tests were needed because this was a docs-only change.

<!-- ENTRY 306 -->
### [306] - 2026-03-17 16:45 - `VR / SP - Phase 5.0B - Legacy Left-Dock Panel Reduction`
<!-- ENTRY 306 -->
HUMAN SUMMARY: `Implemented \`5.0B\` by removing the old \`Parts List\` and \`Box Params\` cards from the default left dock in \`AppShell\`, leaving their deeper cleanup for later phases while restoring the Browser/meatball host stack as the simpler shell composition.`

#### Scope / Constraints Honored
- Kept `5.0B` as a narrow shell-subtraction cut:
  - removed `Parts List` from the default left-dock mount path
  - removed `Box Params` from normal user shell flow
- Did not introduce a replacement card, drawer, or mini inspector.
- Did not delete `PartsListPanel.tsx`, `BoxPanel.tsx`, or the remaining legacy/input-mode code paths; that remains later `5.0C` and `5.0D` work.

#### Summary of Implementation
- Removed `PartsListPanel` mounting from the `AppShell` left-dock stack.
- Removed the old `BoxPanel` mount path from `AppShell`.
- Simplified the left dock so it now reads as:
  - `Browser`
  - optional docked `Spaghetti` meatball host
  - dock resize/split controls
- Updated the focused `AppShell` test that previously expected the `Parts List` card in the meatball layout.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `docs/Phase-Plans/Tasks/Old/05.0B - VR-SP - Legacy Left-Dock Panel Reduction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`

#### Behavior Changes (if any)
- The default left dock no longer renders the `Parts List` card.
- The default left dock no longer renders the `Box Params` card.
- `Browser` and the optional docked meatball editor host are now the only major surfaces left in that dock stack.

#### Verification Steps
- Ran:
  - `cmd /c npm test -- src/app/AppShell.test.tsx`
- Result:
  - `31` tests passed

<!-- ENTRY 305 -->
### [305] - 2026-03-17 15:05 - `VR / SP - Phase 5.1B - Split Pane Authoring And Divider Controls`
<!-- ENTRY 305 -->
HUMAN SUMMARY: `Implemented \`5.1B\` on top of the current AppShell/Spaghetti split proof by adding stored split direction and split priority state, floating-titlebar split entry, divider context-menu actions, and horizontal/vertical divider resizing while keeping the larger shared workspace tree for later phases.`

#### Scope / Constraints Honored
- Implemented the real split-authoring work that the current shell can honestly support today:
  - split direction
  - split priority
  - divider menu actions
  - floating Spaghetti titlebar split entry
- Kept the implementation inside the existing AppShell/Spaghetti split proof instead of inventing the later shared pane-tree system from `5.1A` / `5.1C`.
- Left broader hybrid tool-surface hosting, clone policy, and persistence work to later `5.1` phases.

#### Summary of Implementation
- Added shared split direction and split priority types under `src/app/workspace/`.
- Extended Spaghetti editor viewport state so split view now carries:
  - ratio
  - direction
  - priority
- Added store setters for split direction and split priority.
- Updated `AppShell` split rendering so the current split proof can render:
  - horizontal top/bottom splits
  - vertical side-by-side splits
- Added a floating Spaghetti titlebar context menu with:
  - `Split Horizontal`
  - `Split Vertical`
- Added a divider context menu with:
  - `Split Horizontal`
  - `Split Vertical`
  - `Reset Ratio`
  - `Balanced Priority`
  - `Favor First Pane`
  - `Favor Second Pane`
  - `Close Split`
  - `Merge With Neighbor`
- Added divider double-click ratio reset and divider drag support for both horizontal and vertical split directions.
- Updated focused AppShell and Spaghetti-store tests around the new split behavior.

#### Files Changed
- `src/app/workspace/workspaceSplitTypes.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/AppShell.test.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `docs/Phase-Plans/Tasks/Old/05.1B - VR-SP - Split Pane Authoring And Divider Controls.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`

#### Behavior Changes (if any)
- Split view is no longer locked to one top/bottom layout; the current Spaghetti split proof can now switch between horizontal and vertical orientations.
- Floating Spaghetti windows can now create split view directly from a titlebar context menu.
- The split divider is now a first-class control with resize, reset, and split-priority actions.
- Split priority is now an explicit stored mode instead of a local boolean toggle.

#### Verification Steps
- Ran:
  - `cmd /c npm test -- src/app/AppShell.test.tsx src/app/spaghetti/store/useSpaghettiStore.test.ts`
- Result:
  - `88` tests passed

<!-- ENTRY 304 -->
### [304] - 2026-03-17 14:48 - `DOC - Phase 10 - Workspace Modes 5.1E Roadmap Slot Added`
<!-- ENTRY 304 -->
HUMAN SUMMARY: `Added explicit roadmap slot \`[5.1E]\` for multi-window editor surfaces and detached/browser pop-out under the existing \`[5.1] Workspace Modes\` family, and synchronized the Human-Plans architecture plus roadmap checklist tracker to match that placement.`

#### Scope / Constraints Honored
- Kept the change inside Human-Plans architecture and roadmap docs plus the required permanent changelog entry.
- Preserved the existing `[5.1A-D]` workspace foundation family instead of renumbering later lane `[5]` items.
- Did not change runtime code, active task files, or the current `2.1D` execution boundary.

#### Summary of Implementation
- Added a new local `Doc History` entry in `docs/Human-Plans/roadmap/roadmap.md`.
- Extended the `[5.1] Workspace Modes` lane summary so later multi-window editor growth and detached/browser pop-out are now explicitly described as follow-through on the same shared host model.
- Added `[5.1E] [ ] - Multi-Window Editor Surfaces And Detached Pop-Out` to the roadmap subphase family and reinforced that later multi-window `Spaghetti Editor` work should stay attached to the same workspace lane.
- Updated `docs/Human-Plans/Architecture/Workspace-Modes.md` so its roadmap relationship text, architecture boundary, and future-extension block all point to `[5.1E]` as the planned workspace-family home.
- Synced `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` so Bucket `[5]`, Lane `[5]`, and the dedicated-plan mirror now include `[5.1E]` and keep the later `[5.2+]` labels aligned.
- Cleaned up the duplicated roadmap-breakdown total created during that checklist renumber pass.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/Architecture/Workspace-Modes.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Planning docs now give multi-window `Spaghetti Editor` surfaces and detached/browser pop-out an explicit roadmap home under `[5.1]` instead of leaving that work only implied by deferred `SP - Phase 13` references.

#### Verification Steps
- Read back the `[5.1]` section in `docs/Human-Plans/roadmap/roadmap.md` to confirm `[5.1E]` appears in the summary, checklist, and subphase family.
- Read back `docs/Human-Plans/Architecture/Workspace-Modes.md` to confirm the workspace architecture now maps later multi-window growth to `[5.1E]`.
- Read back `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` to confirm the Bucket `[5]` mirrors and totals remain internally consistent after the new slot was added.

<!-- ENTRY 303 -->
### [303] - 2026-03-17 14:35 - `OO - Phase 13 - AGENTS Active Task Changelog Requirement`
<!-- ENTRY 303 -->
HUMAN SUMMARY: `Updated \`AGENTS.md\` so code-changing work implemented from active task docs in \`docs/Phase-Plans/Tasks/\` must receive a full permanent \`docs/CHANGELOG.md\` entry in the same change set instead of relying only on task-doc maintenance.`

#### Scope / Constraints Honored
- Kept the change limited to repository process/rules docs plus the required permanent changelog entry.
- Did not change runtime code, phase-plan content, or chill-mode behavior.
- Preserved the existing general changelog requirement while making the active task-implementation case explicit.

#### Summary of Implementation
- Added an `Active task implementation rule` block to `AGENTS.md`.
- Clarified that code-changing work implemented from `docs/Phase-Plans/Tasks/` must receive a proper permanent `docs/CHANGELOG.md` entry in the same change set.
- Clarified that local task-doc checklist/status/`Doc History` updates do not replace the required shipped-work changelog entry.
- Extended the `Required Sequence` section so active task implementations explicitly require a full permanent changelog entry, not just task-doc maintenance.

#### Files Changed
- `AGENTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Codex should now treat active phase-task implementation as an explicit permanent-changelog event, reducing the chance of shipped code changes being recorded only in local task docs.

#### Verification Steps
- Read back `AGENTS.md` to confirm the new active-task rule and required-sequence step align with the existing changelog and phase-doc rules.

<!-- ENTRY 302 -->
### [302] - 2026-03-17 14:30 - `VR / SP - Phase 5.0A - Spaghetti Default Startup And Preview-Mode Shell Removal`
<!-- ENTRY 302 -->
HUMAN SUMMARY: `Implemented \`5.0A\` by making \`spaghetti\` the default startup/input path, removing the visible left-dock \`Preview Mode\` card, routing worker errors into the \`Console\`, and switching bootstrap build startup onto the spaghetti-first path while leaving deeper legacy-branch deletion for later cleanup.`

#### Scope / Constraints Honored
- Kept the implementation focused on the `5.0A` runtime scope:
  - spaghetti-first startup
  - preview-panel shell removal
  - worker-error console routing
- Did not remove `Parts List` or `Box Params`; that remains `5.0B`.
- Did not delete the remaining legacy input branch from code; that remains `5.0C`.

#### Summary of Implementation
- Changed `useAppStore` so normal startup now defaults `inputMode` to `spaghetti`.
- Removed the old `Toolbar` / `Preview Mode` surface from the left-dock stack in `AppShell`.
- Updated bootstrap build wiring so startup uses the spaghetti build path when the app is in spaghetti mode instead of always forcing the legacy box build request.
- Routed `workerError` reporting into the layered `Console` transcript as `Worker` error entries.
- Updated focused tests to cover:
  - spaghetti-first startup default
  - worker-error console publishing
  - the left-dock shell after preview-panel removal

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/AppShell.tsx`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/AppShell.test.tsx`

#### Behavior Changes (if any)
- The app now opens in `spaghetti` by default instead of `legacy`.
- The visible `Preview Mode` card no longer appears in the left dock.
- Worker/build errors now surface through the `Console` instead of depending on the removed preview card.
- Startup build bootstrapping now respects the spaghetti-first path.

#### Verification Steps
- Ran:
  - `cmd /c npm test -- src/app/AppShell.test.tsx src/app/store/useAppStore.test.ts`
- Result:
  - `41` tests passed

<!-- ENTRY 301 -->
### [301] - 2026-03-17 14:21 - `DOC - Phase 10 - Workspace Modes Multi-Editor Growth Clarified`
<!-- ENTRY 301 -->
HUMAN SUMMARY: `Tightened \`docs/Human-Plans/Architecture/Workspace-Modes.md\` so the Human-Plans architecture now distinguishes current single-visible-editor shell truth from the next in-app multi-editor step and the later detached/browser-pop-out step.`

#### Scope / Constraints Honored
- Kept the change inside the Human-Plans workspace architecture doc plus the required changelog update.
- Did not change runtime code, roadmap sequencing, or the `05.1A-D` execution docs.
- Preserved the existing hybrid workspace direction while removing ambiguity around multi-instance versus detached editor growth.

#### Summary of Implementation
- Added a new local `Doc History` entry in `docs/Human-Plans/Architecture/Workspace-Modes.md`.
- Expanded the architecture purpose so the doc now explicitly covers how later multi-editor and detached-window growth should fit the same shell model.
- Added a new `Surface Instance Rule` section clarifying that the workspace model should separate surface kind, instance, and placement style instead of staying singleton-only forever.
- Reworked the `Surface Switching Rule` so first-pass workspace UX can stay move/swap-first for shared app tools without hard-locking the underlying architecture against later multi-instance `Spaghetti Editor` hosting.
- Added a new `Current Multi-Editor Truth And Growth Path` section that locks the recommended order as:
  - current single visible editor truth
  - later multiple in-app floating editor windows
  - later detached or browser-pop-out placement
- Tightened `First-Pass Non-Goals` and `Relationship To The Roadmap` so `5.1` no longer reads like it should finish detached-window work, while later `SP - Phase 13` is explicitly expected to reuse the shared workspace surface model.

#### Files Changed
- `docs/Human-Plans/Architecture/Workspace-Modes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changes; this is a Human-Plans architecture clarification for later workspace and multi-window editor work.

#### Verification Steps
- Not run; this was a docs-only update.

<!-- ENTRY 300 -->
### [300] - 2026-03-16 19:31 - `VR - Phase 5 - 02.4C User References Bucket Locked`
<!-- ENTRY 300 -->
HUMAN SUMMARY: `Locked the first \`02.4C\` Browser placement answer so imported files live under \`References\` in a dedicated \`User References\` child category instead of being mixed into the built-in library groups.`

#### Scope / Constraints Honored
- Kept the change limited to the `02.4C` planning doc plus the required changelog update.
- Did not promote `02.4C` or change any runtime Browser code yet.
- Preserved the existing built-in reference categories while giving user-imported files a separate first-pass home.

#### Summary of Implementation
- Added a new local `Doc History` entry in `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`.
- Extended `Current Understanding` to record the first Browser placement answer:
  - imported references live under `References`
  - in a dedicated `User References` child category
  - not inside `Footpads`, `Shoes`, or `Premade Foothooks`
- Updated the `Browser placement` block under `Decisions Still Needed` so the first answer is now explicitly locked.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changes; this locks the first `2.4C` Browser placement direction at the planning level.

#### Verification Steps
- Not run; this was a docs-only planning update.

<!-- ENTRY 299 -->
### [299] - 2026-03-16 19:29 - `VR - Phase 5 - 02.4C GLB Import Added To First Pass`
<!-- ENTRY 299 -->
HUMAN SUMMARY: `Updated the \`02.4C\` planning doc so `.glb` is now included alongside `.step`, `.stl`, and `.obj` in the likely first-pass user import menu under the `References` row overflow/right-click surface.`

#### Scope / Constraints Honored
- Kept the change limited to the `02.4C` planning doc plus the required changelog update.
- Did not promote `02.4C` or change any runtime import code yet.
- Preserved the existing `2.4C` scope while tightening the likely first-pass file-type list.

#### Summary of Implementation
- Added a new local `Doc History` entry in `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`.
- Updated `Current Understanding` so the likely first import menu now includes `Import .glb`.
- Updated the `File-type scope` block under `Decisions Still Needed` so `.glb` is part of the likely first answer instead of remaining an open maybe.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changes; this expands the likely first-pass `2.4C` import scope at the planning level.

#### Verification Steps
- Not run; this was a docs-only planning update.

<!-- ENTRY 298 -->
### [298] - 2026-03-16 19:28 - `VR - Phase 5 - 02.4C Workspace Only Persistence Locked`
<!-- ENTRY 298 -->
HUMAN SUMMARY: `Locked the first \`02.4C\` persistence answer in the future task doc so user-imported references remain workspace-only in the first pass and do not survive reload by default.`

#### Scope / Constraints Honored
- Kept the change limited to the `02.4C` planning doc plus the required changelog update.
- Did not promote `02.4C` or change any runtime import behavior yet.
- Preserved `2.4C` as a user-import planning surface while tightening one specific product decision.

#### Summary of Implementation
- Added a new local `Doc History` entry in `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`.
- Extended `Current Understanding` to record that imported references stay workspace-only in the first pass.
- Updated the `Persistence model` block under `Decisions Still Needed` so the first answer is now explicitly locked instead of remaining an open either/or branch.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changes; this locks the first `2.4C` persistence direction at the planning level.

#### Verification Steps
- Not run; this was a docs-only planning update.

<!-- ENTRY 297 -->
### [297] - 2026-03-16 19:27 - `VR - Phase 5 - 02.4C Import Menu Direction Added`
<!-- ENTRY 297 -->
HUMAN SUMMARY: `Updated the \`02.4C\` planning doc with the first concrete import-entry direction: the `References` row should get an overflow \`...\` button, that button should open the same menu as right-click, and the first import actions should live in that shared menu surface.`

#### Scope / Constraints Honored
- Kept the change limited to the future `02.4C` task doc plus the required changelog update.
- Did not promote `02.4C` or change any runtime Browser code yet.
- Preserved `2.4C` as the user-import phase while only tightening one part of its UX direction.

#### Summary of Implementation
- Added a new local `Doc History` entry in `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`.
- Extended the `Current Understanding` section to record the likely import-entry model:
  - overflow `...` button on the `References` row
  - same menu surface as right-click
  - import actions for `.step`, `.stl`, and `.obj`
- Updated the `Decisions Still Needed` section so the `Import entrypoint` and `File-type scope` blocks now include these likely first answers while still leaving the remaining open decisions visible.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changes; this clarifies the intended first `2.4C` Browser import UX in the planning doc.

#### Verification Steps
- Not run; this was a docs-only planning clarification update.

<!-- ENTRY 296 -->
### [296] - 2026-03-16 19:23 - `VR - Phase 5 - 02.4C Decision Checklist Added`
<!-- ENTRY 296 -->
HUMAN SUMMARY: `Expanded the \`02.4C\` future task doc with an explicit decision checklist so the remaining user-reference-import product calls are visible as concrete unresolved decisions instead of being buried only in the planning questions.`

#### Scope / Constraints Honored
- Kept the change limited to the `02.4C` planning doc plus the required changelog update.
- Did not promote `02.4C` or change any runtime code.
- Preserved the existing `2.4C` scope as user-import flow, not transform tooling or richer reference controls.

#### Summary of Implementation
- Added a new `Decisions Still Needed` section to `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`.
- Broke the remaining unresolved calls into explicit categories:
  - import entrypoint
  - persistence model
  - Browser placement
  - file-type scope
  - duplicate handling
  - error handling
  - remove behavior
- Added a new local `Doc History` entry in the `02.4C` task doc to record that clarification pass.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changes; this makes the remaining `02.4C` product decisions easier to scan and answer.

#### Verification Steps
- Not run; this was a docs-only clarification update.

<!-- ENTRY 295 -->
### [295] - 2026-03-16 19:21 - `VR - Phase 5 - 02.4D Reference Transform Controls Added To Roadmap`
<!-- ENTRY 295 -->
HUMAN SUMMARY: `Added a new \`[2.4D]\` follow-up under the reference-workspace lane so reference transform controls have a clean roadmap home with a right-click \`Transform Object\` entrypoint and a floating transform toolbar instead of being mixed into \`2.4C\` user import flow.`

#### Scope / Constraints Honored
- Kept the change limited to roadmap and tracker surfaces.
- Preserved `2.4C` as the user-import follow-up without mixing transform tooling into that phase.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Extended the main `[2.4]` roadmap entry to explicitly keep reference transform controls as a separate later follow-up.
- Added `[2.4D]` to the `Later follow-up shape inside [2.4]` list with the intended first interaction model:
  - right-click reference row
  - `Transform Object`
  - floating toolbar
  - `Move`, `Rotate`, `Scale`, `Reset Transform`
- Updated `roadmapCHECKLISTS.md` so `[2.4D]` now appears in the decision/plan tracker and lane totals.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changes; this gives the future reference-transform toolset a formal roadmap slot.

#### Verification Steps
- Not run; this was a docs/tracking update only.

<!-- ENTRY 294 -->
### [294] - 2026-03-16 19:08 - `VR - Phase 5 - Viewer Double Major Grid Set To 50`
<!-- ENTRY 294 -->
HUMAN SUMMARY: `Changed the top grid cadence from 100-unit guides to 50-unit guides so the stronger workspace reference lines appear more frequently across the 300 x 300 viewer area.`

#### Scope / Constraints Honored
- Kept the change limited to the viewer grid cadence constant.
- Left the existing 1-unit and 10-unit layers unchanged.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Changed the double-major grid step from `100` to `50`.
- Kept the same non-overlapping ownership model so the 50-unit lines remain the sole top cadence over the major and minor layers.

#### Files Changed
- `src/viewer/Viewer.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The strongest grid lines now appear every `50` units instead of every `100`.

#### Verification Steps
- Not run; this was a small viewer constant adjustment.

<!-- ENTRY 293 -->
### [293] - 2026-03-16 19:06 - `VR - Phase 5 - Viewer Grid Opacity Softened`
<!-- ENTRY 293 -->
HUMAN SUMMARY: `Softened the 10-unit and 1-unit grid layers again so the workspace reads more quietly, with major lines now at 30% white and minor lines at 10% white under the full-white 100-unit guides.`

#### Scope / Constraints Honored
- Kept the change limited to viewer grid opacity tuning.
- Left grid spacing, overlap filtering, and viewer behavior unchanged.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Lowered the major grid opacity from `0.6` to `0.3`.
- Lowered the minor grid opacity from `0.3` to `0.1`.
- Left the double-major grid at full white.

#### Files Changed
- `src/viewer/Viewer.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- 10-unit guides now render at `30%` white.
- 1-unit guides now render at `10%` white.

#### Verification Steps
- Not run; this was a small viewer style adjustment.

<!-- ENTRY 292 -->
### [292] - 2026-03-16 19:04 - `VR - Phase 5 - Viewer Grid White Opacity Rebalance`
<!-- ENTRY 292 -->
HUMAN SUMMARY: `Reverted the 100-unit guides back to clean lines and rebalanced the whole grid to a white-opacity hierarchy so the double-major lines stay crisp while the 10-unit and 1-unit lines fade behind them.`

#### Scope / Constraints Honored
- Kept the change limited to the viewer grid rendering setup.
- Preserved the current non-overlapping 1-unit, 10-unit, and 100-unit cadence ownership.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Removed the band-based 100-unit grid layer and returned the double-major cadence to a line-based layer.
- Updated the custom grid-layer helper to accept explicit opacity values.
- Set the grid hierarchy to:
  - double-major: white at `1.0`
  - major: white at `0.6`
  - minor: white at `0.3`

#### Files Changed
- `src/viewer/Viewer.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The 100-unit guides are thin white lines again instead of thicker bands.
- The 10-unit and 1-unit guides now fade behind them using the new white-opacity hierarchy.

#### Verification Steps
- Ran `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 291 -->
### [291] - 2026-03-16 19:01 - `VR - Phase 5 - Viewer Double Major Grid Thickened`
<!-- ENTRY 291 -->
HUMAN SUMMARY: `Changed the 100-unit double-major guides from another thin line layer into actual narrow floor bands so they read thicker and more intentional across the workspace.`

#### Scope / Constraints Honored
- Kept the change limited to the viewer grid rendering system.
- Preserved the same 1-unit, 10-unit, and 100-unit cadence structure.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Added origin-centered grid coordinate generation so grid layers are built symmetrically around `0`.
- Kept the minor and major cadences as custom line layers with overlap filtering.
- Replaced the double-major line layer with a band-based mesh layer using thin plane strips at each 100-unit guide.

#### Files Changed
- `src/viewer/Viewer.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The 100-unit guides now render as visibly thicker bands instead of thin lines.
- The double-major cadence now centers cleanly on `0` and extends to `-100`, `0`, and `100` within the `300 x 300` workspace.

#### Verification Steps
- Ran `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 290 -->
### [290] - 2026-03-16 18:59 - `VR - Phase 5 - Viewer Grid Overlap Removed`
<!-- ENTRY 290 -->
HUMAN SUMMARY: `Rebuilt the layered viewer grid so the 1-unit, 10-unit, and 100-unit cadences no longer draw on top of each other, which keeps the stronger guide lines clean instead of stacking brightness at shared intervals.`

#### Scope / Constraints Honored
- Kept the change limited to the viewer grid rendering implementation.
- Preserved the existing grid spacing and visibility toggle behavior.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Replaced the layered `GridHelper` setup with custom generated `LineSegments` grid layers.
- Filtered the minor layer to skip coordinates owned by the 10-unit and 100-unit layers.
- Filtered the major layer to skip coordinates owned by the 100-unit layer.
- Left the double-major layer as the sole owner of the 100-unit cadence.

#### Files Changed
- `src/viewer/Viewer.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Grid lines at `10` and `100` units no longer overlap with the finer layers.
- The 100-unit and 10-unit guides should now read cleaner without additive brightness from stacked lines.

#### Verification Steps
- Not run; this was a viewer rendering implementation change.

<!-- ENTRY 289 -->
### [289] - 2026-03-16 18:58 - `VR - Phase 5 - Viewer Double Major Grid Contrast Raised`
<!-- ENTRY 289 -->
HUMAN SUMMARY: `Raised the contrast of the 100-unit double-major grid so the long-range workspace cadence stands out more clearly over the softer 1-unit and 10-unit layers.`

#### Scope / Constraints Honored
- Kept the change limited to the top grid-layer styling.
- Left grid spacing, viewer controls, and model behavior unchanged.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Increased the two colors used by the double-major `GridHelper` layer.
- Kept the existing minor and major grid colors unchanged so only the 100-unit cadence becomes more prominent.

#### Files Changed
- `src/viewer/Viewer.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The 100-unit grid lines now render brighter and stand out more clearly against the other two grid layers.

#### Verification Steps
- Not run; this was a small viewer rendering adjustment.

<!-- ENTRY 288 -->
### [288] - 2026-03-16 18:57 - `VR - Phase 5 - Viewer Double Major Grid Added`
<!-- ENTRY 288 -->
HUMAN SUMMARY: `Added a third stronger grid cadence every 100 units so the enlarged workspace has a clearer long-range reference beyond the existing 1-unit minor grid and 10-unit major grid.`

#### Scope / Constraints Honored
- Kept the change limited to the viewer grid rendering layers.
- Left camera behavior, model transforms, and view controls unchanged.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Added a third `GridHelper` layer above the existing major/minor grids.
- Configured the new layer to divide the `300 x 300` workspace into `3` sections, creating a `100`-unit cadence.
- Offset the new layer slightly in `Y` so it renders cleanly above the other two grid layers.

#### Files Changed
- `src/viewer/Viewer.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The viewer grid now has three levels:
  - minor lines every `1` unit
  - major lines every `10` units
  - stronger double-major lines every `100` units

#### Verification Steps
- Not run; this was a small viewer grid rendering adjustment.

<!-- ENTRY 287 -->
### [287] - 2026-03-16 18:55 - `VR - Phase 5 - Viewer Minor Grid Dimmed`
<!-- ENTRY 287 -->
HUMAN SUMMARY: `Dimmed the viewer’s minor grid layer so the fine workspace lines recede further into the background while the major grid remains readable.`

#### Scope / Constraints Honored
- Kept the change limited to the viewer grid color tuning.
- Left grid size, spacing, major-grid behavior, and all viewer interactions unchanged.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Reduced the brightness of both minor-grid colors used by the layered `GridHelper` setup.
- Preserved the existing major-grid colors so only the fine line noise was reduced.

#### Files Changed
- `src/viewer/Viewer.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Minor grid lines now render darker than before across the same `300 x 300` workspace.

#### Verification Steps
- Not run; this was a small viewer color adjustment.

<!-- ENTRY 286 -->
### [286] - 2026-03-16 18:54 - `VR - Phase 5 - Viewer Major Minor Grid Pass`
<!-- ENTRY 286 -->
HUMAN SUMMARY: `Reworked the viewer grid into a calmer layered major/minor setup so the workspace reads less bright and less noisy while keeping the larger 300 x 300 footprint.`

#### Scope / Constraints Honored
- Kept the change inside the shared viewer grid setup only.
- Left camera behavior, model transforms, and view controls unchanged.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Replaced the single bright `GridHelper` with two layered helpers inside one grid group.
- Added a dimmer `300`-division minor grid and a calmer `30`-division major grid.
- Kept both layers under the same existing `gridVisible` view toggle.

#### Files Changed
- `src/viewer/Viewer.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The viewer now shows a darker fine grid plus a clearer but less bright major grid.
- Major spacing is `10` units and minor spacing is `1` unit across the same `300 x 300` area.

#### Verification Steps
- Not run; this was a small viewer grid rendering adjustment.

<!-- ENTRY 285 -->
### [285] - 2026-03-16 18:53 - `VR - Phase 5 - Viewer Grid Expanded To 300`
<!-- ENTRY 285 -->
HUMAN SUMMARY: `Expanded the main viewer workspace grid from the old small default to a fixed 300 x 300 grid so larger references and assemblies sit inside a much broader visible work area.`

#### Scope / Constraints Honored
- Limited the change to the shared Three.js viewer grid setup.
- Left camera, model placement, and other viewer behavior unchanged.
- Updated the required tracking doc in the same change set.

#### Summary of Implementation
- Replaced the old hard-coded `GridHelper(10, 20, ...)` setup with named constants for a `300`-unit grid and `300` divisions.
- Kept the existing grid colors unchanged while expanding the work area.

#### Files Changed
- `src/viewer/Viewer.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The viewer grid now spans `300 x 300` units instead of `10 x 10`.
- With `300` divisions, the cell spacing is now `1` unit per square.

#### Verification Steps
- Not run; this was a small constant update in the viewer grid helper setup.

<!-- ENTRY 284 -->
### [284] - 2026-03-16 17:18 - `VR - Phase 5 - 02.4B STEP Reference Support`
<!-- ENTRY 284 -->
HUMAN SUMMARY: `Implemented \`02.4B\` by extending the shipped reference workspace with real browser-side `.step` support through \`occt-import-js\`, populating `Premade Foothooks` with the four current hook assets, and tightening the reference error path so failed rows stay retryable instead of silently looping or disappearing.` 

#### Scope / Constraints Honored
- Kept this phase narrow to the first real `.step` reference cut on top of the existing `02.4A` static-manifest workspace.
- Preserved the existing `References` Browser placement and left user-imported references, richer controls, and broader file-type growth out of scope.
- Updated the required tracking docs in the same change set after implementation and verification.

#### Summary of Implementation
- Added `occt-import-js` to the repo and introduced `src/viewer/stepReferenceLoader.ts` plus `src/types/occt-import-js.d.ts` so the viewer can import STEP files in-browser and convert them into Three.js objects.
- Extended `src/app/references/referenceManifest.ts` to support `fileType: 'step'` and populated `Premade Foothooks` with `large.step`, `medium.step`, `small.step`, and `xl.step`.
- Updated `src/viewer/Viewer.ts` to branch STEP references through the new loader while leaving the existing `.obj`, `.glb`, and `.stl` paths intact.
- Tightened `src/app/components/ViewerHost.tsx` so failed reference loads clear viewer visibility and leave rows in a retryable `error` state instead of auto-retrying in a loop.
- Updated `src/app/panels/selectBrowserTreeRows.ts` so reference aggregate states now prefer `Loading` over `Error`, show `On` only for visible loaded items, and continue surfacing per-item `STEP` rows normally.

#### Files Changed
- `package.json`
- `package-lock.json`
- `src/types/occt-import-js.d.ts`
- `src/viewer/stepReferenceLoader.ts`
- `src/viewer/stepReferenceLoader.test.ts`
- `src/app/references/referenceManifest.ts`
- `src/viewer/Viewer.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserRowActions.test.ts`
- `docs/Phase-Plans/Tasks/Old/02.4B - VR - Expanded Reference File Support.md`
- `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`
- `docs/Phase-Plans/08_VR - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/Doc-Index.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- `Premade Foothooks` is no longer a placeholder-only Browser category; its four `.step` assets now exist as real reference rows.
- STEP references can load in the viewer through the same manifest-driven reference workspace used by footpads and shoes.
- Failed reference loads now settle into a visible `Error` row state and can be retried by clicking the row again.

#### Verification Steps
- Ran `cmd /c npx tsc -p tsconfig.app.json --noEmit`.
- Ran `cmd /c npx vitest run src/app/store/useAppStore.test.ts src/app/panels/selectBrowserTreeRows.test.ts src/app/components/ViewerHost.test.tsx src/viewer/stepReferenceLoader.test.ts src/app/panels/BrowserPanel.test.tsx src/app/panels/browserRowActions.test.ts`.

<!-- ENTRY 283 -->
### [283] - 2026-03-16 17:08 - `OO - Phase 13 - 02.4B Active Spec Promotion`
<!-- ENTRY 283 -->
HUMAN SUMMARY: `Promoted \`02.4B - VR - Expanded Reference File Support.md\` into the active task area as the next reference-workspace execution spec, moved shipped \`02.4A\` into \`Tasks/Old/\`, and synced the `VR` family, decisions, checklist, and docs-index surfaces so the lane now reads as one completed prerequisite, one active `.step` follow-up, and one later user-import follow-up.` 

#### Scope / Constraints Honored
- Kept this pass to docs/system promotion work only; no runtime reference-loader code changed here.
- Preserved the `2.4` roadmap umbrella while making `02.4B` the active execution-spec cut and `02.4A` the completed prerequisite.
- Synced the required project-tracking docs in the same change set, including the permanent changelog entry.

#### Summary of Implementation
- Moved `docs/Phase-Plans/Tasks/02.4A - VR - Static Manifest Reference Workspace.md` into `docs/Phase-Plans/Tasks/Old/` to preserve the shipped static-manifest reference workspace as completed history.
- Promoted `docs/Phase-Plans/Tasks/Future/02.4B - VR - Expanded Reference File Support.md` into `docs/Phase-Plans/Tasks/02.4B - VR - Expanded Reference File Support.md` and rewrote it as the active implementation-ready spec for the first real `.step` reference cut.
- Updated `docs/Phase-Plans/08_VR - Phase-Plans.md` so `VR - Phase 5` points at `02.4B` as the active execution surface, treats `02.4A` as the shipped prerequisite, and keeps only `02.4C` as the later user-import follow-up.
- Updated `docs/Human-Plans/Decisions.MD`, `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`, and `docs/Doc-Index.md` so decision coverage, docs presence, and the docs map all reflect the new `02.4A / 02.4B / 02.4C` state.

#### Files Changed
- `docs/Phase-Plans/Tasks/Old/02.4A - VR - Static Manifest Reference Workspace.md`
- `docs/Phase-Plans/Tasks/02.4B - VR - Expanded Reference File Support.md`
- `docs/Phase-Plans/08_VR - Phase-Plans.md`
- `docs/Human-Plans/Decisions.MD`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/Doc-Index.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The active reference-workspace execution target is now `02.4B`, not `02.4A`.
- `02.4A` now reads as completed task history, and `02.4C` remains the later user-import follow-up.
- The `VR` family/question surfaces now treat `.step` support as the active follow-up instead of a future placeholder.

#### Verification Steps
- Ran `rg` across `docs/` for stale active/future `02.4A` / `02.4B` references after the promotion pass.
- Read back the active `02.4B` task doc, `docs/Phase-Plans/08_VR - Phase-Plans.md`, `docs/Human-Plans/Decisions.MD`, `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`, and `docs/Doc-Index.md` for consistency.

<!-- ENTRY 282 -->
### [282] - 2026-03-16 16:55 - `VR - Phase 5 - Footpad Reference Axis Flip Adjustment`
<!-- ENTRY 282 -->
HUMAN SUMMARY: `Updated the shipped PubPad footpad reference to use a single `180` flip on the `Y` axis instead of the previous `Z` flip, matching the newer Blender-origin setup so the model orientation can be corrected without reintroducing the earlier placement problems.` 

#### Scope / Constraints Honored
- Kept this pass to the immediate footpad orientation tweak after the Blender-origin correction.
- Changed only the manifest-driven rotation metadata and the matching proof expectation.
- Left the rest of the reference-loading and placement path unchanged.

#### Summary of Implementation
- Updated `src/app/references/referenceManifest.ts` so the shipped PubPad footpad reference now uses `rotationDeg: { y: 180 }`.
- Removed the previous `rotationDeg: { z: 180 }` expectation from the matching store test and replaced it with the new `Y`-axis flip in `src/app/store/useAppStore.test.ts`.

#### Files Changed
- `src/app/references/referenceManifest.ts`
- `src/app/store/useAppStore.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The footpad reference should now flip on `Y` instead of `Z`, which should better match the corrected Blender origin/orientation.
- If the visible result still needs the other axis, the manifest can be switched to `X` without more viewer plumbing.

#### Verification Steps
- Ran `cmd /c npx tsc -p tsconfig.json --noEmit`.
- Ran `cmd /c npx vitest run src/app/store/useAppStore.test.ts src/app/components/ViewerHost.test.tsx`.

<!-- ENTRY 281 -->
### [281] - 2026-03-16 16:46 - `VR - Phase 5 - Footpad Reference Scale Correction`
<!-- ENTRY 281 -->
HUMAN SUMMARY: `Corrected the new footpad reference scale after re-reading the old `17.0` pipeline: the earlier `1 / 25.4` OBJ import scale had been paired with a later `25.4` unit-scale multiplier, so carrying only the import scale into `20` had shrunk the footpad out of view.` 

#### Scope / Constraints Honored
- Kept this pass to the immediate footpad visibility regression only.
- Re-used the already-added manifest transform path instead of changing the viewer plumbing again.
- Updated the matching store proof and changelog in the same pass.

#### Summary of Implementation
- Updated `src/app/references/referenceManifest.ts` so the shipped PubPad footpad reference now uses `scale: 1` instead of the incorrectly ported `1 / 25.4`.
- Preserved the current `rotationDeg.z: 180` and `centerUnderPivot: true` behavior.
- Updated `src/app/store/useAppStore.test.ts` to match the corrected manifest transform.

#### Files Changed
- `src/app/references/referenceManifest.ts`
- `src/app/store/useAppStore.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The footpad reference should now be visible again instead of being shrunk out of the scene.
- This keeps the newer centered placement path while undoing the accidental over-shrink.

#### Verification Steps
- Ran `cmd /c npx tsc -p tsconfig.json --noEmit`.
- Ran `cmd /c npx vitest run src/app/store/useAppStore.test.ts src/app/components/ViewerHost.test.tsx`.

<!-- ENTRY 280 -->
### [280] - 2026-03-16 16:42 - `VR - Phase 5 - Footpad Reference Recentering Adjustment`
<!-- ENTRY 280 -->
HUMAN SUMMARY: `Adjusted the new footpad reference transform so the scaled PubPad model stays centered near the origin instead of inheriting the old hardcoded x/z placement from the legacy footpad-only viewer flow, which had pushed the now-scaled model out of the useful view area.` 

#### Scope / Constraints Honored
- Kept this pass narrowly focused on the first follow-up after the new footpad transform landed.
- Preserved the shrink and centering behavior while removing only the legacy placement offset that did not port cleanly.
- Updated tests and changelog in the same adjustment pass.

#### Summary of Implementation
- Updated `src/app/references/referenceManifest.ts` so the shipped PubPad footpad transform no longer carries the old `{ x: -15, z: 5 }` offset.
- Kept the manifest-driven `scale: 1 / 25.4`, `rotationDeg.z: 180`, and `centerUnderPivot: true` behavior in place.
- Updated `src/app/store/useAppStore.test.ts` to match the simplified centered transform shape.

#### Files Changed
- `src/app/references/referenceManifest.ts`
- `src/app/store/useAppStore.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The footpad reference should now appear much closer to the origin instead of being shifted away after scaling down.
- This does not change shoe placement or the general reference-loading lifecycle.

#### Verification Steps
- Ran `cmd /c npx tsc -p tsconfig.json --noEmit`.
- Ran `cmd /c npx vitest run src/app/store/useAppStore.test.ts src/app/components/ViewerHost.test.tsx`.

<!-- ENTRY 279 -->
### [279] - 2026-03-16 16:37 - `VR - Phase 5 - Footpad Reference Transform Alignment`
<!-- ENTRY 279 -->
HUMAN SUMMARY: `Aligned the shipped PubPad footpad reference with the old proven viewer transform by adding manifest-driven reference display transforms and applying them through a pivot in the new viewer, so the footpad now uses the old scale-down, rotation, centering, and offset instead of the raw oversized OBJ placement.` 

#### Scope / Constraints Honored
- Kept this pass focused on the visible footpad placement problem after `02.4A` references started loading.
- Reused the old `17.0` transform values instead of inventing new ones by trial and error.
- Stored the transform as manifest metadata so the behavior stays explicit and extensible for later references.

#### Summary of Implementation
- Updated `src/app/references/referenceManifest.ts` to add optional `displayTransform` metadata to manifest items.
- Added the old PubPad footpad transform to the manifest:
  - `scale: 1 / 25.4`
  - `rotationDeg.z: 180`
  - `offset: { x: -15, z: 5 }`
  - `centerUnderPivot: true`
- Updated `src/app/store/useAppStore.ts` so the viewer-facing reference item model carries the manifest transform through the reference workspace selector.
- Updated `src/viewer/Viewer.ts` so reference assets load into a pivot, can be centered under that pivot, and apply manifest-defined scale / rotation / offset before being cached and shown.
- Updated `src/app/store/useAppStore.test.ts` to prove the footpad transform metadata survives into the viewer-facing reference workspace tree.

#### Files Changed
- `src/app/references/referenceManifest.ts`
- `src/app/store/useAppStore.ts`
- `src/viewer/Viewer.ts`
- `src/app/store/useAppStore.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The PubPad footpad reference should now appear scaled down and placed much closer to the old expected position instead of rendering as a huge raw OBJ slab.
- The transform path is now manifest-driven so future reference assets can carry their own placement defaults without more viewer-specific branching.

#### Verification Steps
- Ran `cmd /c npx tsc -p tsconfig.json --noEmit`.
- Ran `cmd /c npx vitest run src/app/store/useAppStore.test.ts src/app/components/ViewerHost.test.tsx src/app/panels/BrowserPanel.test.tsx src/app/panels/selectBrowserTreeRows.test.ts`.

<!-- ENTRY 278 -->
### [278] - 2026-03-16 16:31 - `VR - Phase 5 - Reference Workspace Loading-State Fix`
<!-- ENTRY 278 -->
HUMAN SUMMARY: `Fixed the reference workspace loading-state bug that left shoes stuck on the loading bar by removing the effect-local cancellation path in \`ViewerHost\`; visible references can now complete their async viewer load and transition from \`loading\` to \`loaded\` instead of getting stranded after the first rerender.` 

#### Scope / Constraints Honored
- Kept this pass focused on the runtime reference-loading lifecycle bug uncovered while closing out `02.4A`.
- Preserved the existing reference workspace structure and only changed the viewer-load completion logic.
- Added a direct regression test for the `loading -> loaded` transition in the same pass.

#### Summary of Implementation
- Updated `src/app/components/ViewerHost.tsx` so reference loads are no longer cancelled by effect reruns caused by `setReferenceItemLoadState(..., 'loading')`.
- Replaced the effect-local `didCancel` guard with a mounted/viewer-instance safety check so async loads can complete across rerenders while still staying safe on unmount.
- Added `src/app/components/ViewerHost.test.tsx` to prove a visible shoe reference transitions from `unloaded` to `loading` to `loaded` after the mocked viewer load resolves.

#### Files Changed
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Supported reference items should no longer stay indefinitely on the loading bar once the viewer loader resolves.
- This fix applies to the general reference workspace load path, including the shoe rows that were previously getting stuck in `loading`.

#### Verification Steps
- Ran `cmd /c npx tsc -p tsconfig.json --noEmit`.
- Ran `cmd /c npx vitest run src/app/components/ViewerHost.test.tsx src/app/store/useAppStore.test.ts src/app/panels/BrowserPanel.test.tsx src/app/panels/selectBrowserTreeRows.test.ts`.

<!-- ENTRY 277 -->
### [277] - 2026-03-16 16:28 - `VR - Phase 5 - Reference Workspace Asset Base-Path Fix`
<!-- ENTRY 277 -->
HUMAN SUMMARY: `Fixed the first real reference-loading blocker in \`02.4A\` by wiring the Browser/viewer reference items through the manifest's base-aware asset-path resolver, so reference models now use URLs under the app's \`/ParaHook_Configurator/\` base instead of raw root-relative paths that missed the deployed asset location.` 

#### Scope / Constraints Honored
- Kept this pass focused on why supported reference models were not loading at all.
- Reused the existing manifest base-path helper instead of adding a second URL-resolution path.
- Updated the required changelog entry in the same implementation pass.

#### Summary of Implementation
- Updated `src/app/store/useAppStore.ts` to import and use `resolveReferenceAssetPath(...)` when building `ReferenceWorkspaceBrowserItemVm` rows.
- Ensured the viewer-facing reference items now carry base-aware URLs instead of raw `ReferenceModels/...` paths.
- Updated `src/app/store/useAppStore.test.ts` to prove the reference workspace tree now emits the resolved asset URL for the shipped footpad item.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Supported `Footpads` and `Shoes` references should now resolve against the app base path and become loadable in the viewer when toggled on.
- This does not add new file-type support; `.step` remains deferred to `2.4B`.

#### Verification Steps
- Ran `cmd /c npx tsc -p tsconfig.json --noEmit`.
- Ran `cmd /c npx vitest run src/app/store/useAppStore.test.ts src/app/panels/BrowserPanel.test.tsx src/app/panels/selectBrowserTreeRows.test.ts`.

<!-- ENTRY 263 -->
### [276] - 2026-03-16 16:19 - `VR - Phase 5 - Reference Workspace Black Screen Regression Fix`
<!-- ENTRY 276 -->
HUMAN SUMMARY: `Fixed the new post-\`02.4A\` black-screen regression by removing the direct derived-selector Zustand subscriptions from \`BrowserPanel\` and \`ViewerHost\`, switching both back to stable \`referenceWorkspace\` slice reads, and rebuilding the derived reference tree/item arrays in \`useMemo\` so the app no longer re-enters the earlier Browser selector-crash family.` 

#### Scope / Constraints Honored
- Kept this pass scoped to the new reference-workspace black-screen regression.
- Preserved the shipped `02.4A` Browser/reference behavior while changing only the selector subscription pattern.
- Updated the dedicated bug note and changelog together in the same fix pass.

#### Summary of Implementation
- Updated `src/app/panels/BrowserPanel.tsx` so it no longer subscribes directly to `selectReferenceWorkspaceBrowserTree`.
- Updated `src/app/components/ViewerHost.tsx` so it no longer subscribes directly to `selectReferenceWorkspaceItems`.
- Switched both surfaces to read the stable `referenceWorkspace` slice from `useAppStore`.
- Rebuilt the reference Browser tree and the visible reference item array locally in `useMemo`.
- Updated `src/app/panels/BrowserPanel.test.tsx` so the mocked app-store state now includes a stable `referenceWorkspace` slice and still proves the `References` row behavior.
- Updated `docs/Bugs/3_ReferenceWorkspace-BlackScreen-Regression.md` to mark the bug resolved and record the confirmed cause/fix.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `docs/Bugs/3_ReferenceWorkspace-BlackScreen-Regression.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No intended product behavior changed.
- The app should no longer collapse to the dark/black-screen startup failure introduced by the initial `02.4A` selector wiring.

#### Verification Steps
- Ran `cmd /c npx tsc -p tsconfig.json --noEmit`.
- Ran `cmd /c npx vitest run src/app/panels/BrowserPanel.test.tsx src/app/store/useAppStore.test.ts src/app/panels/selectBrowserTreeRows.test.ts`.

<!-- ENTRY 263 -->
### [275] - 2026-03-16 16:14 - `DOC - Phase 14 - Reference Workspace Black Screen Bug Note`
<!-- ENTRY 275 -->
HUMAN SUMMARY: `Read the earlier Browser selector-crash note for Bug 2, then added a new dedicated bug document for the post-\`02.4A\` black-screen regression so the new reference-workspace startup failure now has its own concrete likely-cause writeup pointing at the freshly added unstable reference selectors.` 

#### Scope / Constraints Honored
- Kept this pass to bug-document capture only.
- Did not change runtime code or attempt a fix in the same pass.
- Updated the required changelog and docs map together with the new bug note.

#### Summary of Implementation
- Read `docs/Bugs/2_BrowserPanel-ProjectContent-Selector-Crash.md` as the pattern reference for the current regression.
- Added `docs/Bugs/3_ReferenceWorkspace-BlackScreen-Regression.md` as the new dedicated bug note for the post-`02.4A` black-screen regression.
- Recorded the most likely technical cause in that note:
  - `BrowserPanel` direct subscription to `selectReferenceWorkspaceBrowserTree`
  - `ViewerHost` direct subscription to `selectReferenceWorkspaceItems`
  - both selectors returning fresh object/array snapshots under React 19 + Zustand
- Updated `docs/Doc-Index.md` so the Bugs section now lists the dedicated Browser crash notes, including the new Bug 3 doc.

#### Files Changed
- `docs/Bugs/3_ReferenceWorkspace-BlackScreen-Regression.md`
- `docs/Doc-Index.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- The new black-screen regression now has a dedicated bug note and a likely-cause record for the next fix pass.

#### Verification Steps
- Confirmed the new bug note exists at `docs/Bugs/3_ReferenceWorkspace-BlackScreen-Regression.md`.
- Confirmed `docs/Doc-Index.md` now lists the dedicated Browser crash notes under the Bugs section.
- Confirmed the bug note explicitly points back to the same selector-instability family documented by Bug 2.

<!-- ENTRY 263 -->
### [274] - 2026-03-16 16:10 - `VR - Phase 5 - Static Manifest Reference Workspace`
<!-- ENTRY 274 -->
HUMAN SUMMARY: `Implemented the first `02.4A` reference workspace cut by adding a checked-in reference manifest, rendering `References` inside `Content`, wiring blue/gray reference visibility rows and category toggles into the Browser, and adding viewer-side lazy loading/caching for the supported `.obj` and `.glb` assets while keeping `.step` and user import as later work.` 

#### Scope / Constraints Honored
- Kept this pass scoped to `02.4A` static-manifest reference workspace behavior.
- Left `.step` support and user-imported references out of this implementation and in their later roadmap homes.
- Updated the required changelog and task/checklist tracking docs in the same change set.

#### Summary of Implementation
- Added `src/app/references/referenceManifest.ts` as the checked-in v1 reference source of truth for `Footpads`, `Shoes`, and the placeholder `Premade Foothooks` category.
- Extended `src/app/store/useAppStore.ts` with reference workspace state, Browser-tree selectors, visibility toggles, category toggles, and per-item load/error state.
- Extended `src/app/panels/selectBrowserTreeRows.ts` so the Browser now emits `References`, category, and reference-item rows inside the `Content` area.
- Updated `src/app/panels/BrowserPanel.tsx` to render the new reference rows, rename the inner root to `Project Browser`, and route row clicks so:
  - `References` toggles expansion
  - category row click toggles the whole category on/off
  - `+/-` stays the expand/collapse control
  - child reference row click toggles one reference on/off
- Updated `src/app/components/ViewerHost.tsx` and `src/viewer/Viewer.ts` so supported reference assets lazy-load on first toggle, remain cached after load, and show/hide without unloading.
- Updated `docs/Phase-Plans/Tasks/02.4A - VR - Static Manifest Reference Workspace.md` and `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` to record the first shipped cut.

#### Files Changed
- `src/app/references/referenceManifest.ts`
- `src/app/store/useAppStore.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`
- `src/app/theme/v15Theme.css`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/useAppStore.test.ts`
- `docs/Phase-Plans/Tasks/02.4A - VR - Static Manifest Reference Workspace.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The Browser now shows a `References` subtree above published assemblies inside `Content`.
- `Footpads`, `Shoes`, and `Premade Foothooks` now exist as category parents in the Browser, with category-row click toggling whole-category viewer visibility.
- Supported reference assets are hidden by default, lazy-load on first toggle, and then switch between blue `on` and gray `off` row states without unloading.

#### Verification Steps
- Ran `cmd /c npx tsc -p tsconfig.json --noEmit`.
- Ran `cmd /c npx vitest run src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/BrowserPanel.test.tsx src/app/store/useAppStore.test.ts`.

<!-- ENTRY 263 -->
### [273] - 2026-03-16 15:37 - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
<!-- ENTRY 273 -->
HUMAN SUMMARY: `Split the active `2.4` docs into one specific active cut plus two future follow-ups by renaming the live execution spec to `02.4A`, creating `02.4B` for expanded file support and `02.4C` for user reference import from disk, and syncing the `VR` family doc, docs map, and checklist tracker to that new structure.` 

#### Scope / Constraints Honored
- Kept this pass to phase-doc structure and tracker alignment only.
- Preserved `[2.4]` as the roadmap umbrella while making the active task doc specifically `02.4A`.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Renamed the active execution spec from `docs/Phase-Plans/Tasks/02.4 - VR - Reference Asset Workspace And Project View Layers.md` to `docs/Phase-Plans/Tasks/02.4A - VR - Static Manifest Reference Workspace.md`.
- Updated the active spec wording so it clearly reads as the static-manifest cut and points later work to `02.4B` and `02.4C`.
- Created two new future task docs:
  - `docs/Phase-Plans/Tasks/Future/02.4B - VR - Expanded Reference File Support.md`
  - `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`
- Updated `docs/Phase-Plans/08_VR - Phase-Plans.md` so `VR - Phase 5` now points at `02.4A` as the active spec and names `02.4B` plus `02.4C` as the later follow-up docs.
- Updated `docs/Doc-Index.md` so the active `Tasks` list shows `02.4A` and the `Tasks/Future` list shows `02.4B` and `02.4C`.
- Updated `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` so the `2.4A / 2.4B / 2.4C` split now also reflects plan-doc presence for the new docs.

#### Files Changed
- `docs/Phase-Plans/Tasks/02.4A - VR - Static Manifest Reference Workspace.md`
- `docs/Phase-Plans/Tasks/Future/02.4B - VR - Expanded Reference File Support.md`
- `docs/Phase-Plans/Tasks/Future/02.4C - VR - User Reference Import From Disk.md`
- `docs/Phase-Plans/08_VR - Phase-Plans.md`
- `docs/Doc-Index.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime or product behavior changed.
- The phase-doc system now treats `2.4A` as the active cut and `2.4B / 2.4C` as explicit future follow-ups.

#### Verification Steps
- Confirmed the active spec now exists at `docs/Phase-Plans/Tasks/02.4A - VR - Static Manifest Reference Workspace.md`.
- Confirmed new future docs exist for `02.4B` and `02.4C`.
- Confirmed `docs/Phase-Plans/08_VR - Phase-Plans.md`, `docs/Doc-Index.md`, and `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` all reflect the split.

### [272] - 2026-03-16 15:31 - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
<!-- ENTRY 272 -->
HUMAN SUMMARY: `Expanded the roadmap home for deferred reference-system work by splitting later `2.4` follow-up into `2.4A` static-manifest workspace support, `2.4B` expanded reference file support such as `.step`, and `2.4C` user-imported reference models from disk, so those future upgrades are visible instead of being left implicit.` 

#### Scope / Constraints Honored
- Kept this pass to roadmap and tracker documentation only.
- Preserved `2.4` as the reference-workspace home instead of creating a new top-level lane.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Expanded `[2.4]` in `docs/Human-Plans/roadmap/roadmap.md` with explicit carry-forward structure:
  - `[2.4A]` static-manifest reference workspace
  - `[2.4B]` expanded reference file support
  - `[2.4C]` user reference import from disk
- Added checklist notes under `[2.4]` so `.step` loading and user-added references are now called out as later follow-up work inside the same phase family.
- Mirrored the new `2.4A / 2.4B / 2.4C` breakdown into `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` so the scan surfaces reflect that future split.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime or product behavior changed.
- The roadmap now gives `.step` support and user-imported references an explicit future home under `[2.4]`.

#### Verification Steps
- Re-read `[2.4]` in `docs/Human-Plans/roadmap/roadmap.md` to confirm the new `2.4A / 2.4B / 2.4C` follow-up structure.
- Re-read the `[2.4]` entries in `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` to confirm the new sub-items appear in the tracker lists.

### [271] - 2026-03-16 15:25 - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
<!-- ENTRY 271 -->
HUMAN SUMMARY: `Promoted `02.4` into the active implementation-ready execution-spec stage, moving it out of `Tasks/Future/` and locking the first reference-asset workspace layer around a static manifest, lazy loading, Browser `References` placement inside `Content`, blue/gray viewer-state rows, and the current `footpads / shoes / hooks` asset reality.` 

#### Scope / Constraints Honored
- Kept this pass to docs/spec promotion and tracker alignment only.
- Grounded the spec in the current repo seams and current public asset folders before locking the execution details.
- Left runtime/product behavior unchanged.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Rewrote and promoted `docs/Phase-Plans/Tasks/02.4 - VR - Reference Asset Workspace And Project View Layers.md` as the active execution spec for `[2.4]`.
- Locked the active `02.4` spec around:
  - `Project Browser > Content > References`
  - `Footpads / Shoes / Premade Foothooks`
  - static manifest source model
  - lazy load on first toggle
  - hidden by default on app load
  - blue/gray viewer-state bars
  - `.step` remaining out of scope, leaving foothooks as a placeholder category in v1
- Updated `docs/Phase-Plans/08_VR - Phase-Plans.md` so `VR - Phase 5` now points at the active execution spec instead of the future planning doc.
- Updated `docs/Doc-Index.md` so `02.4` moves from the `Tasks/Future` listing into the live `Tasks` area.
- Updated `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` so `[2.4]` now reads as decision-complete as well as plan-doc-present.
- Expanded `docs/Human-Plans/Decisions.MD` just enough to honestly capture the now-locked `[2.4]` decisions.

#### Files Changed
- `docs/Phase-Plans/Tasks/02.4 - VR - Reference Asset Workspace And Project View Layers.md`
- `docs/Phase-Plans/08_VR - Phase-Plans.md`
- `docs/Doc-Index.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/Human-Plans/Decisions.MD`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime or product behavior changed.
- The docs system now treats `02.4` as the active implementation-ready execution spec.

#### Verification Steps
- Confirmed the active spec now lives at `docs/Phase-Plans/Tasks/02.4 - VR - Reference Asset Workspace And Project View Layers.md`.
- Confirmed `docs/Phase-Plans/08_VR - Phase-Plans.md` now points Phase 5 at the active `Tasks/` path.
- Confirmed `docs/Doc-Index.md` now shows `02.4` under active `Tasks` instead of `Tasks/Future`.
- Confirmed `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` now marks `[2.4]` `Decision Coverage` and `Plan.md Status` as present.
- Confirmed `docs/Human-Plans/Decisions.MD` now contains a dedicated `[2.4]` locked-decision block.

### [270] - 2026-03-16 15:19 - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
<!-- ENTRY 270 -->
HUMAN SUMMARY: `Updated the `2.4` suggested-answer block so category parents like `Footpads` now use row click to toggle the whole category on/off, while the normal `+/-` control remains responsible for expanding and collapsing the subtree.` 

#### Scope / Constraints Honored
- Kept this pass to the `2.4` planning doc only.
- Changed only the suggested-answer direction for category-parent behavior.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Added a new local doc-history entry to `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`.
- Updated `Q9` in the `Questions And Suggested Answers` section so:
  - category parents keep normal `+/-` expand/collapse controls
  - clicking the category row toggles the whole category on/off in the viewer

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime or product behavior changed.
- The `2.4` planning doc now prefers category-row click as the whole-category visibility toggle.

#### Verification Steps
- Re-read `Q9` in the updated `2.4` planning doc to confirm row click now means category on/off while `+/-` remains the expand/collapse control.

### [269] - 2026-03-16 15:16 - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
<!-- ENTRY 269 -->
HUMAN SUMMARY: `Expanded the `2.4` task doc with an explicit question list and suggested answers, consolidating the current planning direction for Browser placement, ownership, row behavior, visibility rules, and tree presentation into one readable decision block.` 

#### Scope / Constraints Honored
- Kept this pass to the `2.4` planning doc only.
- Converted existing discussion direction into suggested answers without claiming the phase is implementation-ready yet.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Added a new local doc-history entry to `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`.
- Added a `Questions And Suggested Answers` section covering:
  - Browser placement for `References`
  - first Browser tree shape
  - first ownership model
  - reference row face and click behavior
  - blue/gray viewer-state bars
  - first-pass actions
  - passive viewer-context scope
  - category-parent behavior
  - tree controls and connector lines
  - first-pass filesystem root
  - minimum project-versus-reference visibility separation

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime or product behavior changed.
- The `2.4` planning doc now has one consolidated suggested-answer block for the main open questions.

#### Verification Steps
- Re-read the updated `2.4` planning doc to confirm the new `Questions And Suggested Answers` section is present and matches the current preferred direction.

### [268] - 2026-03-16 15:12 - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
<!-- ENTRY 268 -->
HUMAN SUMMARY: `Updated the `2.4` planning doc with the newer Browser-tree presentation rule: `References` should use normal `+/-` tree controls and connector lines, and the `Content` section should adopt that same connected subtree style instead of looking like a special-case header block.` 

#### Scope / Constraints Honored
- Kept this pass to the `2.4` planning doc only.
- Recorded Browser-tree presentation expectations without changing runtime UI behavior.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Added a new local doc-history entry to `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`.
- Expanded the emerging `2.4` reference-tree direction with:
  - normal `+/-` tree buttons for `References` and its category parents
  - normal Browser connector lines through the reference subtree
  - a matching rule that `Content` should use the same subtree-control style and connecting line into its children

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime or product behavior changed.
- The `2.4` planning surface now includes the preferred Browser tree-control presentation for `Content` and `References`.

#### Verification Steps
- Re-read the updated `2.4` planning doc to confirm the new `+/-` control and connector-line notes are present.

### [267] - 2026-03-16 15:06 - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
<!-- ENTRY 267 -->
HUMAN SUMMARY: `Expanded the `VR` family phase-plan doc so `VR - Phase 5` now has a real home for the live `[2.4]` reference-asset planning work, including the current clean Browser-tree direction, the calm blue/gray reference-row behavior, and the main open questions still needed before implementation.` 

#### Scope / Constraints Honored
- Kept this pass to the `VR` family phase-plan doc only.
- Aligned the family-level `VR - Phase 5` section to the live `02.4` task doc instead of changing runtime behavior.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Added a new local doc-history entry to `docs/Phase-Plans/08_VR - Phase-Plans.md`.
- Reframed `VR - Phase 5` from a bare future placeholder into an active family planning surface.
- Pointed the family section at `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`.
- Expanded the Phase 5 summary with the current preferred Browser/reference direction:
  - `Project Browser > Content > References`
  - `Footpads / Shoes / Premade Foothooks`
  - blue/gray viewer-state rows with click-to-toggle visibility
- Added a Phase 5 question surface listing the remaining Browser/viewer decisions for references.

#### Files Changed
- `docs/Phase-Plans/08_VR - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime or product behavior changed.
- The `VR` family doc now has a real planning home for `[2.4]`.

#### Verification Steps
- Re-read the updated `VR - Phase 5` section in `docs/Phase-Plans/08_VR - Phase-Plans.md`.
- Confirmed it now points at the `02.4` task doc and includes the Phase 5 question surface.

### [266] - 2026-03-16 15:03 - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
<!-- ENTRY 266 -->
HUMAN SUMMARY: `Updated the `2.4` planning doc with the first reference-model path convention, using `public/ReferenceModels/` as the default asset root and matching the planned Browser `References` categories with `Footpads`, `Shoes`, and `PremadeFoothooks` subfolders.` 

#### Scope / Constraints Honored
- Kept this pass to the `2.4` planning doc only.
- Recorded a filesystem/path convention for reference assets without changing runtime loading behavior.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Added a new local doc-history entry to `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`.
- Added a `Reference asset path convention so far` note under the emerging `2.4` direction.
- Recorded `public/ReferenceModels/` as the first-pass root and matched the subfolders to:
  - `Footpads`
  - `Shoes`
  - `PremadeFoothooks`

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime or product behavior changed.
- The `2.4` planning surface now has a concrete reference-model folder convention.

#### Verification Steps
- Re-read the updated `2.4` planning doc to confirm the new `public/ReferenceModels/` note and the three category subfolders are present.

### [265] - 2026-03-16 15:00 - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
<!-- ENTRY 265 -->
HUMAN SUMMARY: `Expanded the new `[2.4]` planning doc with the first concrete Browser/reference-tree direction: `References` should live visually inside `Content` above the first assembly, split into `Footpads`, `Shoes`, and `Premade Foothooks`, with calm blue/gray viewer-state bars and click-to-toggle visibility behavior.` 

#### Scope / Constraints Honored
- Kept this pass to the `2.4` planning doc only.
- Recorded the newer reference-tree direction as planning guidance, not shipped behavior.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Added a new local doc-history entry to `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`.
- Updated the `First-Pass Assumptions` block so references now read as visually inside `Content` for the clean Browser tree while still remaining non-published workspace context.
- Added an `Emerging Direction From Follow-Up Notes` section capturing:
  - `Project Browser > Content > References`
  - the first `Footpads / Shoes / Premade Foothooks` parent split
  - blue/gray viewer-state bars instead of content build bars
  - click-to-toggle viewer visibility behavior for reference rows

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime or product behavior changed.
- The `2.4` planning surface now reflects the newer preferred Browser/reference-tree layout and row-behavior direction.

#### Verification Steps
- Re-read the updated `2.4` planning doc to confirm the new tree shape, category split, and viewer-state row behavior are present.

### [264] - 2026-03-16 14:55 - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
<!-- ENTRY 264 -->
HUMAN SUMMARY: `Created the dedicated future task doc for roadmap item `[2.4]`, confirming the reference-asset workspace phase as the next major untouched task and wiring that new planning surface into the docs map and roadmap checklist tracker.`

#### Scope / Constraints Honored
- Kept this pass to docs/task-planning setup only.
- Treated `[2.4]` as the next major untouched roadmap task after the shipped `[2.2]`, `[2.3]`, and `[2.1F]` work.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md` as the new future planning surface for:
  - Browser/viewer sections for external reference assets
  - first-pass `.obj`, `.glb`, and `.stl` support as workspace context
  - basic project-versus-reference visibility separation
  - the still-open planning questions needed before `[2.4]` becomes implementation-ready
- Marked `[2.4]` `Plan.md Status` complete in `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`.
- Updated `docs/Doc-Index.md` so the new future task doc appears in the foldable `Tasks/Future` docs map and is recorded in local doc history.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.4 - VR - Reference Asset Workspace And Project View Layers.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/Doc-Index.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime or product behavior changed.
- The docs system now has a dedicated future task surface for `[2.4]`.

#### Verification Steps
- Confirmed `[2.4]` is still the next major untouched roadmap item in `docs/Human-Plans/roadmap/roadmap.md`.
- Confirmed `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` now marks `[2.4]` `Plan.md Status` as present.
- Confirmed `docs/Doc-Index.md` now lists the new `02.4` task doc under `Tasks/Future`.

### [263] - 2026-03-16 14:53 - `DOC - Phase 4.2 - Selective Build Notes Added To Roadmap`
<!-- ENTRY 263 -->
HUMAN SUMMARY: `Expanded roadmap lane `[4.2]` so the later build/runtime lane now explicitly captures the selective-sibling-cache requirement: unaffected published rows must stay clean when another object changes, content rebuild bars must come from runtime chunk truth instead of graph-level fallback state, and first-build versus stale-after-change must be distinguished.` 

#### Scope / Constraints Honored
- Kept this pass to roadmap documentation only.
- Added the new selective-build notes directly under the existing `[4.2]` lane rather than creating a new lane.
- Updated the required changelog in the same change set.

#### Summary of Implementation
- Added a roadmap doc-history line describing the `[4.2]` clarification.
- Expanded the `[4.2]` checklist with explicit notes for:
  - unaffected sibling rows staying clean/cached
  - `Content` rebuild bars coming from runtime chunk truth
  - distinguishing never-built versus stale/building/clean
  - invalidation boundaries only marking downstream affected rows stale

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes
- No application behavior changes.
- The roadmap now places the “Object 2 changed but Object 1 should remain cached” requirement explicitly in `[4.2]`.

#### Verification Steps
- Read back `[4.2]` in `docs/Human-Plans/roadmap/roadmap.md` after the edit and confirmed the new selective-build bullets are present.

<!-- ENTRY 262 -->
### [262] - 2026-03-16 14:47 - `AS / VR - Phase 2.3 - Content Rebuild Rows Yellow`
<!-- ENTRY 262 -->
HUMAN SUMMARY: `Updated the published `Content` row styling so rows in the `rebuild` state now render with a yellow bar fill instead of staying visually neutral, making stale content easier to scan in the Browser.` 

#### Scope / Constraints Honored
- Scoped this change to published `Content` rows only.
- Left `Graph Documents` row styling unchanged.
- Updated the required changelog in the same implementation pass.

#### Summary of Implementation
- Changed the `BrowserContentStateBar--rebuild` fill styling to use the same yellow family already associated with in-progress or attention-needed states instead of leaving rebuild rows transparent.

#### Files Changed
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- Published `Content` rows with `buildState: rebuild` now show a yellow fill bar in the Browser.

#### Verification Steps
- `cmd /c npx vitest run src/app/panels/BrowserPanel.test.tsx`

<!-- ENTRY 261 -->
### [261] - 2026-03-16 14:44 - `VR / SP - Phase 2.1F - Graph Nodes Click-To-Fit`
<!-- ENTRY 261 -->
HUMAN SUMMARY: `Updated the Browser graph-node click path so clicking a node under `Graph Documents > Nodes` now opens or focuses the right Spaghetti editor and issues a viewport-targeted fit request, causing the editor canvas to zoom to fit that node without changing `Needs Rebuild` or `Content` row behavior.` 

#### Scope / Constraints Honored
- Scoped this change only to clicks on graph-node rows under `Graph Documents > Nodes`.
- Left `Needs Rebuild`, `Content`, and `View In Graph` behavior unchanged.
- Updated the required changelog in the same implementation pass.

#### Summary of Implementation
- Added a small store-level `editorViewportNodeFitRequest` channel in `useSpaghettiStore` so Browser-originated node-fit requests can target one specific editor viewport.
- Updated `BrowserPanel` so graph-node clicks now request a viewport-targeted node fit after opening or focusing the graph and selecting the source node.
- Updated `SpaghettiPanel` so it listens for the targeted fit request and forwards it into the existing canvas fit-node path already used inside the editor.
- Added targeted Browser and Spaghetti-panel test coverage for the new scoped behavior.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`

#### Behavior Changes
- Clicking a row inside `Graph Documents > Nodes` now:
  - opens or focuses the matching graph editor
  - selects the source node
  - zooms the Spaghetti editor to fit that node
- Clicking `Needs Rebuild` rows does not issue this fit request.

#### Verification Steps
- `cmd /c npx vitest run src/app/panels/BrowserPanel.test.tsx src/app/panels/SpaghettiPanel.test.tsx`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 260 -->
### [260] - 2026-03-16 14:40 - `VR / SP - Phase 2.1F - Needs Rebuild Empty-State Cleanup`
<!-- ENTRY 260 -->
HUMAN SUMMARY: `Removed the visible \`No pending rebuild objects.\` helper text from the empty `Needs Rebuild` graph-child section so the Browser stays cleaner when there is no pending graph-side rebuild work.` 

#### Scope / Constraints Honored
- Kept this pass to a small Browser UI cleanup only.
- Did not change graph-child ordering, filtering, or click behavior.
- Updated the required changelog in the same implementation pass.

#### Summary of Implementation
- Cleared the `Needs Rebuild` section empty label in the Browser tree selector.
- Tightened the nested empty-state render path so graph child sections only show helper text when a non-empty empty-state label is intentionally provided.

#### Files Changed
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/BrowserPanel.tsx`

#### Behavior Changes
- Empty `Needs Rebuild` sections no longer show the `No pending rebuild objects.` helper line.
- Other graph child sections can still render nested empty text if they have an explicit empty-state label.

#### Verification Steps
- `cmd /c npx vitest run src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/BrowserPanel.test.tsx`

<!-- ENTRY 259 -->
### [259] - 2026-03-16 14:39 - `VR / SP - Phase 2.1F - Browser Plain-Row Bar Cleanup`
<!-- ENTRY 259 -->
HUMAN SUMMARY: `Cleaned up the Browser row-shell styling for `Needs Rebuild`, `Nodes`, and `Open Editors` rows so their bars now use the full row surface instead of looking like nested inset pills inside the row shell.` 

#### Scope / Constraints Honored
- Kept this pass to Browser UI-shell cleanup only.
- Did not change row meaning, interaction, or graph/content behavior.
- Updated the required changelog in the same implementation pass.

#### Summary of Implementation
- Updated `BrowserPanel` row-main class assignment so plain graph-section and viewport rows use the same outer row-shell pattern as the graph/content build bars.
- Adjusted `v15Theme.css` so the plain-row bar fills the full clickable row width and height instead of reading like a smaller inner pill.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- `Needs Rebuild`
- `Nodes`
- `Open Editors`

These rows now render as one clean full-row bar surface instead of an inset inner bar.

#### Verification Steps
- `cmd /c npx vitest run src/app/panels/BrowserPanel.test.tsx`

<!-- ENTRY 258 -->
### [258] - 2026-03-16 14:31 - `VR / SP - Phase 2.1F - Graph Documents Child Sections`
<!-- ENTRY 258 -->
HUMAN SUMMARY: `Implemented `[2.1F]` by replacing the old graph child \`published-output\` list with `Needs Rebuild` plus `Nodes`, filtering the rebuild list down to produced stale or unresolved graph-owned objects, wiring graph-child click back to authoring reveal, and syncing the task/roadmap/docs index surfaces to the completed state.` 

#### Scope / Constraints Honored
- Kept this pass graph-side and Browser-side instead of rewriting the completed `Content` surface from `[2.3]`.
- Replaced the main graph child list instead of keeping the old slot/output-entry rows alive beside the new sections.
- Updated the required task, roadmap, docs-index, and changelog surfaces in the same change set.

#### Summary of Implementation
- Reworked `selectBrowserTreeRows` so graph rows now expand into `Needs Rebuild` and `Nodes` section rows instead of `published-output` rows.
- Made `Needs Rebuild` object-based, ordered by published `Content`, and filtered to produced rows that are stale or unresolved.
- Added flat graph-native `Nodes` rows ordered by graph node order.
- Updated `BrowserPanel` so graph child sections remember per-graph expand state, graph child row click reveals graph authoring context, and empty nested section messages render under the section rows.
- Updated `browserRowActions` and the Browser tests to follow the new graph child row kinds.
- Moved `02.1F - VR-SP - Graph Documents Child Sections.md` from `Tasks/Future` into `Tasks/Old` and marked the roadmap/checklist entry complete.

#### Files Changed
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/browserRowActions.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/browserRowActions.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/Phase-Plans/Tasks/Old/02.1F - VR-SP - Graph Documents Child Sections.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/Doc-Index.md`

#### Behavior Changes
- `Graph Documents` no longer shows the old raw graph child publish-entry list in the main Browser tree.
- Each expanded graph row now shows:
  - `Needs Rebuild` first and default-open
  - `Nodes` second and default-closed
- `Needs Rebuild` now hides empty/non-producing rows and already-clean rows.
- Clicking a graph child rebuild row or node row now focuses the graph authoring context instead of behaving like a published `Content` row.

#### Verification Steps
- `cmd /c npx vitest run src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/browserRowActions.test.ts src/app/panels/BrowserPanel.test.tsx`
- `cmd /c npx vitest run src/app/panels/selectBrowserGraphRows.test.ts src/app/store/useAppStore.test.ts`
- `cmd /c npx tsc -p tsconfig.json --noEmit`

<!-- ENTRY 257 -->
### [257] - 2026-03-16 14:16 - `DOC - Phase 11 - Future Task Doc For 2.1F`
<!-- ENTRY 257 -->
HUMAN SUMMARY: `Set up the new future task doc for `[2.1F] VR / SP - Graph Documents Child Sections`, turning the post-\`2.3\` \`Needs Rebuild\` plus \`Nodes\` idea into a real planning surface with scope, open implementation questions, likely files, and tracker updates so the roadmap now counts `[2.1F]` as having a dedicated task doc.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Created `2.1F` as a future planning surface, not an implementation-ready execution spec yet.
- Updated the docs index and roadmap tracker status in the same change set.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/02.1F - VR-SP - Graph Documents Child Sections.md`.
- Recorded the current locked later shape:
  - `Needs Rebuild` first/open
  - `Nodes` second/closed
  - no empty/non-producing rows in the rebuild list
- Captured the remaining implementation questions around:
  - exact rebuild-list data source
  - rebuild-row identity
  - node-list scope
  - default expand-state persistence
  - row interaction rules
- Updated `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` so `[2.1F]` now counts as having its own dedicated task doc.
- Updated `docs/Doc-Index.md` so the new future task file appears in the docs map.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.1F - VR-SP - Graph Documents Child Sections.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/Doc-Index.md`

#### Behavior Changes
- No code behavior changed in this pass.
- The repo now has a dedicated future task-planning surface for `[2.1F]`.

#### Verification Steps
- Read back the new `02.1F` task doc header, checklist, and open-question sections.
- Confirmed `roadmapCHECKLISTS.md` now marks `[2.1F]` plan-doc status as present.
- Confirmed `Doc-Index.md` now lists `02.1F` under `Tasks/Future`.

<!-- ENTRY 256 -->
### [256] - 2026-03-16 14:13 - `DOC - Phase 11 - Roadmap Home For Graph Documents Child Sections`
<!-- ENTRY 256 -->
HUMAN SUMMARY: `Added the post-\`2.3\` \`Graph Documents\` follow-up into the live roadmap as a new `[2.1F]` Browser/workspace subphase, so the later \`Needs Rebuild\` plus \`Nodes\` split now has a clear home in Lane `[2.1]` instead of being confused with \`2.4\` reference-asset work.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Added the new roadmap slot under Lane `[2.1]` instead of rewriting completed `AS6` answers or misplacing the work under `[2.4]`.
- Synced the roadmap tracker totals after adding the new item.

#### Summary of Implementation
- Added `[2.1F] VR / SP - Graph Documents Child Sections` to `docs/Human-Plans/roadmap/roadmap.md`.
- Defined the roadmap checklist for the later `Needs Rebuild` plus `Nodes` split:
  - `Needs Rebuild` first/open
  - `Nodes` second/closed
  - no empty/non-producing rows in the rebuild list
- Updated `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` so the new item appears in the lane breakdown, lane status list, dedicated-plan list, and the rolled-up totals.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`

#### Behavior Changes
- No code behavior changed in this pass.
- The roadmap now gives the later `Graph Documents` child-section cleanup a clear home as `[2.1F]`.

#### Verification Steps
- Read back the new `[2.1F]` block in `docs/Human-Plans/roadmap/roadmap.md`.
- Read back the updated Lane `[2]` tracker rows and totals in `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`.

<!-- ENTRY 255 -->
### [255] - 2026-03-16 14:12 - `DOC - Phase 11 - Graph Documents Child-Section Outline Note`
<!-- ENTRY 255 -->
HUMAN SUMMARY: `Expanded the new active Codex-notes file with a more concrete outline for the later \`Graph Documents\` child-section idea, spelling out the exact \`Needs Rebuild\` plus \`Nodes\` structure, their default open/closed behavior, and the rule that empty or already-clean rows should not appear in the rebuild list.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Added detail to the new Codex-notes surface without changing the already-locked `AS6` answers.
- Logged the notes-file update in the changelog.

#### Summary of Implementation
- Added `[173]` to `docs/Human-Plans/CodexNotes/11_CodexChatNotes.md`.
- Captured the concrete proposed structure:
  - `Needs Rebuild` first and normally open
  - `Nodes` second and normally closed
- Clarified what each section should and should not show.

#### Files Changed
- `docs/Human-Plans/CodexNotes/11_CodexChatNotes.md`

#### Behavior Changes
- No code behavior changed in this pass.
- The active Codex notes now contain a more implementation-usable outline of the later `Graph Documents` child-section idea.

#### Verification Steps
- Read back the new `[173]` entry in `docs/Human-Plans/CodexNotes/11_CodexChatNotes.md`.

<!-- ENTRY 254 -->
### [254] - 2026-03-16 14:04 - `DOC - Phase 11 - New Codex Notes File For Post-2.3 Follow-Up`
<!-- ENTRY 254 -->
HUMAN SUMMARY: `Started a new active Codex-notes file at \`11_CodexChatNotes.md\` and recorded the post-\`2.3\` roadmap discovery that the newer \`Graph Documents\` child-section idea should live as a small later Browser workspace follow-up rather than being folded into \`2.4\` or retroactively changing the locked Phase 6 answers.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Started a fresh Codex-notes file instead of appending more raw planning notes into `10_CodexChatNotes.md`.
- Updated the docs index and changelog alongside the new notes file.

#### Summary of Implementation
- Created `docs/Human-Plans/CodexNotes/11_CodexChatNotes.md` as the new active Codex notes surface.
- Added the first entry as `[172]`, continuing the absolute numbering path from `10_CodexChatNotes.md`.
- Recorded the planning conclusion that the newer `Graph Documents` child-section idea should likely become a small Lane `[2.1]` follow-up such as `[2.1F]`, with `Needs Rebuild` first/open and `Nodes` second/closed.
- Updated `docs/Doc-Index.md` so the new notes file appears in the foldable docs map.

#### Files Changed
- `docs/Human-Plans/CodexNotes/11_CodexChatNotes.md`
- `docs/Doc-Index.md`

#### Behavior Changes
- No code behavior changed in this pass.
- The repo now has a new active Codex-notes file for follow-up planning after the completed `2.3` work.

#### Verification Steps
- Read back the new `11_CodexChatNotes.md` header and first `[172]` entry.
- Confirmed `docs/Doc-Index.md` now lists `11_CodexChatNotes.md` under `Human-Plans/CodexNotes`.

<!-- ENTRY 253 -->
### [253] - 2026-03-16 14:02 - `AS - Phase 6 - Post-Phase-6 Entry Framing Cleanup`
<!-- ENTRY 253 -->
HUMAN SUMMARY: `Tightened the new \`Graph Documents\` note in the \`AS\` family doc so it now reads explicitly as a post-Phase-6 entry, preserving the original locked \`AS6.Q2\` answer as the canonical Phase 6 answer instead of looking like a retroactive rewrite.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Changed only the framing of the new note, not the locked `AS6.Q2` answer itself.
- Added the required changelog entry for the docs clarification.

#### Summary of Implementation
- Updated `docs/Phase-Plans/07_AS - Phase-Plans.md` so the new graph-child direction is labeled as a `Post-Phase-6 Entry`.
- Added explicit wording that the locked `AS6.Q2` answer above remains unchanged.

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`

#### Behavior Changes
- No code behavior changed in this pass.
- The docs now distinguish between the canonical Phase 6 answer and later carry-forward discovery more clearly.

#### Verification Steps
- Read back the updated `AS6.Q2` section in `docs/Phase-Plans/07_AS - Phase-Plans.md`.

<!-- ENTRY 252 -->
### [252] - 2026-03-16 14:01 - `AS - Phase 6 - Graph Documents Carry-Forward Clarification`
<!-- ENTRY 252 -->
HUMAN SUMMARY: `Updated the \`AS\` family doc after the shipped \`2.3\` work to record the newly clarified later direction for \`Graph Documents\`: a normally-open \`Needs Rebuild\` section above a normally-closed \`Nodes\` section, with empty/non-producing entries like \`s002\` excluded from the rebuild list.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Recorded the new `Graph Documents` direction as later carry-forward rather than rewriting the completed Phase 6 scope.
- Updated the required changelog entry for the docs change.

#### Summary of Implementation
- Added a post-Phase-6 carry-forward note under `AS6.Q2` in the `AS` family doc.
- Captured the preferred later `Graph Documents` child ordering:
  - `Needs Rebuild` first and normally open
  - `Nodes` second and normally closed
- Locked the rule that the future rebuild list should only show producing rows that actually need work, excluding empty rows like `s002`.

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`

#### Behavior Changes
- No code behavior changed in this pass.
- Documentation now records the preferred later expansion shape for graph-document child rows after the shipped `2.3` task.

#### Verification Steps
- Read back the updated `AS6.Q2` section in `docs/Phase-Plans/07_AS - Phase-Plans.md`.

<!-- ENTRY 251 -->
### [251] - 2026-03-16 13:54 - `AS - Phase 6 - Content Policy Icon Integration Cleanup`
<!-- ENTRY 251 -->
HUMAN SUMMARY: `Folded the separate \`L / R / M\` content policy chip into the existing \`A / C / O\` row icon so the icon now stays semantically tied to the row type while its color carries the current build-policy state, and the content build bar now starts immediately after that icon like the graph rows.` 

#### Scope / Constraints Honored
- Kept this pass narrowly focused on the `2.3` content-row layout/policy-control cleanup.
- Reused the existing content-row icon slot instead of introducing another control.
- Verified the Browser panel behavior with the focused Browser test suite.

#### Summary of Implementation
- Updated `BrowserPanel` so published content rows no longer render a separate policy-chip column.
- Turned the existing content-row icon into the build-policy control for `Assembly`, `Component`, and `Object`, while keeping the displayed letter as the row-type marker.
- Updated the Browser row test and icon styling so policy color now lives on the row-type icon itself.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- Published content rows no longer show a separate `L / R / M` chip.
- The `A / C / O` icon now cycles build policy and changes color to represent `Live / Release / Manual`.
- The content build/loading bar now starts immediately after the icon/lead area.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/panels/BrowserPanel.test.tsx`
- Verified `1` file passed with `26` tests.

<!-- ENTRY 250 -->
### [250] - 2026-03-16 13:51 - `AS - Phase 6 - Content Policy Chip Row Placement Cleanup`
<!-- ENTRY 250 -->
HUMAN SUMMARY: `Adjusted the Browser \`Content\` row layout again so the inline build-policy chip now sits to the left of the build/loading bar, matching the intended reading order more closely while keeping the rest of the Phase 6 row behavior intact.` 

#### Scope / Constraints Honored
- Kept this pass narrowly focused on the `2.3` content-row layout cleanup.
- Changed only the Browser row-shell order needed to move the content policy chip.
- Verified the Browser panel behavior with the focused Browser test suite.

#### Summary of Implementation
- Reordered the content-row shell in `BrowserPanel` so the content build-policy chip now renders before the row-main build/loading surface.
- Left graph-row save/build controls unchanged so this remains a content-row-only cleanup.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`

#### Behavior Changes
- Published content rows now show the `L / R / M` policy chip to the left of the loading/build bar instead of to the right.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/panels/BrowserPanel.test.tsx`
- Verified `1` file passed with `26` tests.

<!-- ENTRY 249 -->
### [249] - 2026-03-16 13:45 - `AS - Phase 6 - Content Row Build-Bar Presentation Cleanup`
<!-- ENTRY 249 -->
HUMAN SUMMARY: `Cleaned up the just-shipped \`2.3\` Browser content-row presentation so published build bars now read like the full-row graph-document bars instead of smaller inset sub-bars, keeping the content rows visually consistent with the rest of the Browser.` 

#### Scope / Constraints Honored
- Kept this pass narrowly focused on the `2.3` Browser row presentation cleanup.
- Changed only the content-row markup/CSS needed to make the build-state surface read like the graph-document rows.
- Verified the Browser panel behavior with the focused Browser test suite.

#### Summary of Implementation
- Updated `BrowserPanel` so content-row status text now renders inside the content build-state surface instead of outside a nested sub-bar.
- Updated the Browser row styling so content rows use the full row-main surface, matching the graph-document bar treatment more closely.
- Added content-row bar padding and inline status grouping so `Assembly`, `Component`, and `Object` rows read as one coherent bar rather than a bar inside a separate row shell.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- Published content build bars now visually fill the row-main surface instead of appearing as inset sub-bars.
- Build-state text and readiness/status text now sit inside the same content-row bar.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/panels/BrowserPanel.test.tsx`
- Verified `1` file passed with `26` tests.

<!-- ENTRY 248 -->
### [248] - 2026-03-16 13:35 - `AS - Phase 6 - Project Content Inspection And Build Control Surface`
<!-- ENTRY 248 -->
HUMAN SUMMARY: `Implemented Phase 6 of the Browser-facing content surface so published \`Content\` rows now behave like the first honest build/control layer: content rows rebuild on click, parent and object build bars render in the Browser, inline policy chips stay separate from view controls, and secondary \`View In Graph\` traceability is available without collapsing back into graph-row language.`

#### Scope / Constraints Honored
- Kept this pass focused on `02.3` implementation rather than later runtime/build-truth work.
- Preserved the `Graph Documents` versus `Content` split by keeping graph rows document-oriented while moving build/policy behavior onto published content rows.
- Updated the required roadmap/phase/changelog tracking docs in the same change set.

#### Summary of Implementation
- Extended project-content Browser rows in `useAppStore` so `Assembly`, `Component`, and `Object` rows now carry first-pass build state, rebuild-target graph ids, and row status labels derived from the owning graph runtime.
- Updated the Browser tree/read model so content rows expose real build bars, slimmer object-row treatment, secondary `View In Graph` actions, and the data needed for content-row rebuild behavior.
- Changed `BrowserPanel` so published content rows use `Select + Rebuild`, parent rebuild stays selective, inline content policy chips default from the current build policy, and graph rows no longer own that policy-chip surface.
- Added the first Browser-side content build-bar styling and verified the new behavior with focused store, Browser-tree, Browser-panel, and row-action tests.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/browserRowActions.ts`
- `src/app/panels/browserRowActions.test.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/Phase-Plans/Tasks/Old/02.3 - AS - Project Content Inspection And Build Control Surface.md`
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/Phase-Plans/00_Phase-Setup.md`
- `docs/Doc-Index.md`

#### Behavior Changes
- Clicking published `Assembly`, `Component`, and `Object` rows now selects that row and requests rebuild only for the graph-owned descendants that still need work.
- Published content rows now show the first Browser-facing build/loading treatment:
  - dominant bars for `Assembly` / `Component`
  - slimmer real bars for `Object`
- Published content rows now expose inline `Live / Release / Manual` policy chips without merging them with view controls.
- Published `Component` and `Object` rows now expose `View In Graph` as a secondary traceability action.

#### Verification Steps
- Ran `cmd /c npx vitest run src/app/store/useAppStore.test.ts src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/BrowserPanel.test.tsx src/app/panels/browserRowActions.test.ts`
- Verified all targeted test files passed: `4` files, `46` tests.

<!-- ENTRY 247 -->
### [247] - 2026-03-16 13:17 - `DOC - Phase 11 - 02.3 Execution Spec Promotion`
<!-- ENTRY 247 -->
HUMAN SUMMARY: `Promoted \`02.3\` from a future planning surface into the active execution spec, aligned the `AS - Phase 6` family guidance to feed that spec directly, and refreshed the roadmap/index tracker docs so the repo now has one clear active source of truth for the first honest \`Content\` build/control layer.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Promoted `02.3` into `docs/Phase-Plans/Tasks/` without drifting into code implementation.
- Aligned the nearby family/tracker docs so the new spec is the active source of truth instead of leaving stale future-task references behind.

#### Summary of Implementation
- Rewrote `docs/Phase-Plans/Tasks/02.3 - AS - Project Content Inspection And Build Control Surface.md` as the active implementation-ready execution spec with:
  - `Spec Target`
  - `Problem Statement`
  - `Reasonable Phase Cut`
  - locked interaction/build/policy/source-trace rules
  - `Implementation Order`
  - `Deferred / Out Of Scope`
  - `Acceptance / Proof Bar`
- Removed the old future-copy of `02.3` from `docs/Phase-Plans/Tasks/Future/`.
- Updated `docs/Phase-Plans/07_AS - Phase-Plans.md` so the locked `AS6.Q1` through `AS6.Q6` answers explicitly feed the active `02.3` spec and the remaining definition checklist reads complete at the family-guidance level.
- Updated `docs/Doc-Index.md` so `02.3` now appears under active `Tasks` instead of `Tasks/Future`.
- Refreshed the roadmap/tracker surfaces so the `02.3` language now matches the locked Phase 6 defaults and the `[2.3]` decision coverage line is no longer stale.

#### Files Changed
- `docs/Phase-Plans/Tasks/02.3 - AS - Project Content Inspection And Build Control Surface.md`
- `docs/Phase-Plans/Tasks/Future/02.3 - AS - Project Content Inspection And Build Control Surface.md`
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/Doc-Index.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime or app behavior changed.
- The active documentation source of truth for `[2.3]` is now `docs/Phase-Plans/Tasks/02.3 - AS - Project Content Inspection And Build Control Surface.md`.

#### Verification Steps
- Read back the promoted `02.3` spec to confirm it now reads as an implementation-ready execution doc instead of a future planning note.
- Checked `docs/Phase-Plans/07_AS - Phase-Plans.md` so the locked Phase 6 answers match the promoted spec.
- Checked `docs/Doc-Index.md` and `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` so `02.3` no longer points at `Tasks/Future/`.

<!-- ENTRY 246 -->
### [246] - 2026-03-16 13:12 - `DOC - Phase 11 - 02.3 Reasonable Phase Cut And Later Work`
<!-- ENTRY 246 -->
HUMAN SUMMARY: `Tightened the future \`02.3\` task doc into a more reasonable first implementation cut, added a separate later-work section so the phase boundary is explicit, and locked \`AS6.Q6\` in the family doc so Phase 6 now clearly stops at the first honest \`Content\` build/control surface instead of absorbing later runtime/build-truth work.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Narrowed `02.3` into a realistic first ship cut instead of letting it expand toward later runtime/build lanes.
- Added an explicit later-work section rather than leaving deferred systems implied.

#### Summary of Implementation
- Updated `docs/Phase-Plans/Tasks/Future/02.3 - AS - Project Content Inspection And Build Control Surface.md` to:
  - align with the locked `AS6.Q1` through `AS6.Q6` answers
  - replace the outdated lighter-`Object` guidance
  - add a `Reasonable Phase Cut` section describing what `02.3` should actually ship
  - add a `Later Carry-Forward` section describing what should remain outside the first `02.3` cut
  - clarify that the remaining work is now mostly implementation-order and acceptance-proof definition
- Updated `docs/Phase-Plans/07_AS - Phase-Plans.md` to lock `AS6.Q6`.
- The new `AS6.Q6` answer now states that Phase 6 owns the first honest `Content` build/control surface, but explicitly defers:
  - full `Part` truth
  - revisions
  - later `SEQ / ALL`
  - deeper worker/runtime chunk truth
  - graph-native worker-contract replacement
  - nested assembly/package systems
  - richer viewer/material/reference systems

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.3 - AS - Project Content Inspection And Build Control Surface.md`
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No application behavior changed.
- The planning docs now distinguish much more clearly between:
  - what `02.3` should actually ship
  - what must wait for later lanes

#### Verification Steps
- Read back the new `Reasonable Phase Cut` and `Later Carry-Forward` sections in `docs/Phase-Plans/Tasks/Future/02.3 - AS - Project Content Inspection And Build Control Surface.md`.
- Read back the `AS6.Q6` section and the Phase 6 question checklist in `docs/Phase-Plans/07_AS - Phase-Plans.md`.

<!-- ENTRY 245 -->
### [245] - 2026-03-16 13:08 - `DOC - Phase 11 - AS6 Q5 Policy Versus View Rule`
<!-- ENTRY 245 -->
HUMAN SUMMARY: `Locked \`AS6.Q5\` in the \`AS - Phase-Plans\` family doc so build/policy controls stay separate from view controls on published \`Content\`, with rows defaulting to \`Live\` on load and later mixed child state deferred as an extension of policy rather than a reason to merge policy and view behavior.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Locked the separation between build/policy controls and view controls at the family-guidance level for later `02.3` execution work.
- Preserved later mixed-child policy state as future layering instead of overcomplicating the first Phase 6 rule.

#### Summary of Implementation
- Updated `docs/Phase-Plans/07_AS - Phase-Plans.md` so:
  - `AS6.Q5` is now marked complete
  - the Phase 6 question checklist reflects that completion
  - the question now has a `Locked Answer` block defining the control split
- The locked rule now states:
  - build/policy controls and view controls are different surfaces
  - `generate/build on-off` should not be merged with `view on-off`
  - published `Content` defaults to `Live` on load
  - later mixed child policy state extends the policy surface instead of merging policy and view behavior

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No application behavior changed.
- The `AS` family planning guidance now has a locked answer for `AS6.Q5`.

#### Verification Steps
- Read back the `AS6.Q5` section and the Phase 6 question checklist in `docs/Phase-Plans/07_AS - Phase-Plans.md`.

<!-- ENTRY 244 -->
### [244] - 2026-03-16 13:07 - `DOC - Phase 11 - AS6 Q4 Real Object Rows Rule`
<!-- ENTRY 244 -->
HUMAN SUMMARY: `Locked \`AS6.Q4\` in the \`AS - Phase-Plans\` family doc so \`Assembly\`, \`Component\`, and \`Object\` are all real build/loading rows in Phase 6, and later \`Part\` truth is explicitly treated as an extension of \`Object\` rather than a replacement.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Locked the Phase 6 row-presentation rule in a way that avoids redoing `Object` row meaning later.
- Preserved later `Part` growth as deeper detail instead of forcing `Object` to stay artificially weak.

#### Summary of Implementation
- Updated `docs/Phase-Plans/07_AS - Phase-Plans.md` so:
  - `AS6.Q4` is now marked complete
  - the Phase 6 question checklist reflects that completion
  - the question now has a `Locked Answer` block defining row truth
- The locked rule now states:
  - `Assembly`, `Component`, and `Object` are all real build/loading rows in Phase 6
  - `Object` should not stay artificially light
  - later `Part` detail extends `Object` rather than replacing it

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No application behavior changed.
- The `AS` family planning guidance now has a locked answer for `AS6.Q4`.

#### Verification Steps
- Read back the `AS6.Q4` section and the Phase 6 question checklist in `docs/Phase-Plans/07_AS - Phase-Plans.md`.

<!-- ENTRY 243 -->
### [243] - 2026-03-16 13:04 - `DOC - Phase 11 - AS6 Q3 Source Traceability Rule`
<!-- ENTRY 243 -->
HUMAN SUMMARY: `Locked \`AS6.Q3\` in the \`AS - Phase-Plans\` family doc so graph/source traceability stays available on published \`Content\`, but moves into secondary actions such as \`View In Graph\`, right-click authoring jumps, and reveal/highlight behavior instead of defining the main row face.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Preserved source traceability for published `Content` without collapsing `Content` rows back into graph-looking rows.
- Locked the rule at the family-guidance level for the later `02.3` execution spec.

#### Summary of Implementation
- Updated `docs/Phase-Plans/07_AS - Phase-Plans.md` so:
  - `AS6.Q3` is now marked complete
  - the Phase 6 question checklist reflects that completion
  - the question now has a `Locked Answer` block defining where source traceability lives
- The locked rule now states:
  - published `Content` rows keep primary language about the published entity
  - graph/source traceability moves into `View In Graph`, right-click/context actions, reveal/highlight behavior, and internal row metadata
  - graph names, node ids, and slot ids should not dominate the main row face unless temporary disambiguation is needed

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No application behavior changed.
- The `AS` family planning guidance now has a locked answer for `AS6.Q3`.

#### Verification Steps
- Read back the `AS6.Q3` section and the Phase 6 question checklist in `docs/Phase-Plans/07_AS - Phase-Plans.md`.

<!-- ENTRY 242 -->
### [242] - 2026-03-16 13:02 - `DOC - Phase 11 - AS6 Q2 Graph Documents Simplicity Rule`
<!-- ENTRY 242 -->
HUMAN SUMMARY: `Locked \`AS6.Q2\` in the \`AS - Phase-Plans\` family doc so \`Graph Documents\` stays intentionally simple in Phase 6 as the authoring/document surface, while published build/policy behavior remains on \`Content\`; a later graph-node list under \`Graph Documents\` is now explicitly deferred.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Locked the Phase 6 split so `Graph Documents` and `Content` stay separate Browser surfaces.
- Preserved the possibility of later graph-node listing under `Graph Documents` without pulling that into the current phase.

#### Summary of Implementation
- Updated `docs/Phase-Plans/07_AS - Phase-Plans.md` so:
  - `AS6.Q2` is now marked complete
  - the Phase 6 question checklist reflects that completion
  - the question now has a `Locked Answer` block defining the surface split
- The locked rule now states:
  - `Graph Documents` stays simple and document-oriented in Phase 6
  - published build/loading/policy behavior belongs on `Content`
  - any later graph-node list under `Graph Documents` is future work, not part of this phase

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No application behavior changed.
- The `AS` family planning guidance now has a locked answer for `AS6.Q2`.

#### Verification Steps
- Read back the `AS6.Q2` section and the Phase 6 question checklist in `docs/Phase-Plans/07_AS - Phase-Plans.md`.

<!-- ENTRY 241 -->
### [241] - 2026-03-16 12:58 - `DOC - Phase 11 - AS6 Q1 Row Click Rule`
<!-- ENTRY 241 -->
HUMAN SUMMARY: `Locked \`AS6.Q1\` in the \`AS - Phase-Plans\` family doc so primary click on published \`Content\` rows now means rebuild that row scope, while parent-row rebuilds such as `Assembly` still only rebuild the descendant content that actually needs work.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Locked the interaction rule specifically for published `Content` rows, not all Browser rows.
- Preserved incremental rebuild truth by stating that parent-scope rebuilds should still rebuild only what actually needs work.

#### Summary of Implementation
- Updated `docs/Phase-Plans/07_AS - Phase-Plans.md` so:
  - `AS6.Q1` is now marked complete
  - the Phase 6 question checklist reflects that completion
  - the question now has a `Locked Answer` block defining row click behavior
- The locked rule now states:
  - primary click on published `Content` rows means rebuild that row scope
  - `Assembly` / `Component` / `Object` are in scope
  - parent rows still rebuild selectively rather than forcing unnecessary descendant rebuilds

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No application behavior changed.
- The `AS` family planning guidance now has a locked answer for `AS6.Q1`.

#### Verification Steps
- Read back the `AS6.Q1` section and the Phase 6 question checklist in `docs/Phase-Plans/07_AS - Phase-Plans.md`.

<!-- ENTRY 240 -->
### [240] - 2026-03-16 12:54 - `DOC - Phase 11 - AS Phase 5 Complete And Phase 6 Questions`
<!-- ENTRY 240 -->
HUMAN SUMMARY: `Updated the \`AS - Phase-Plans\` family doc so Phase 5 now consistently reads as completed family guidance after the shipped \`02.2\` work, and expanded Phase 6 into the new family-level question surface for \`2.3\` around content row meaning, build-state presentation, graph-versus-content separation, source-trace secondary actions, and policy-versus-view controls.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Reflected the shipped `02.2` state in the family doc instead of leaving Phase 5 framed like an open lock pass.
- Turned Phase 6 into the next family-level question surface without pretending the `02.3` implementation-ready spec already exists.

#### Summary of Implementation
- Updated `docs/Phase-Plans/07_AS - Phase-Plans.md` so:
  - `AS - Phase 5` now reads as `[x]`
  - Phase 5 summary language now reflects completed family guidance rather than future placeholder wording
  - the Phase 5 checklist is now marked complete
- Expanded `AS - Phase 6` from a placeholder into the new family question surface.
- Added a family-level `AS6.Q1` through `AS6.Q6` question set covering:
  - content row click and primary interaction meaning
  - `Graph Documents` versus `Content` surface separation
  - source-trace secondary actions
  - first assembly/component/object build-state presentation
  - policy-versus-view-control separation
  - explicit defers to later runtime/build-truth lanes
- Updated the Phase 6 checklist so it now matches the new `2.3` planning surface instead of the older generic placeholder text.

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No application behavior changed.
- The `AS` family doc now treats:
  - Phase 5 as completed family guidance
  - Phase 6 as the active family question surface for `2.3`

#### Verification Steps
- Read back the Phase 5 and Phase 6 sections in `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Confirmed the new Phase 6 questions align with the `02.3` future task doc and roadmap `[2.3]`.

<!-- ENTRY 239 -->
### [239] - 2026-03-16 12:45 - `DOC - Phase 11 - 02.3 Future Task Setup`
<!-- ENTRY 239 -->
HUMAN SUMMARY: `Set up the next post-\`02.2\` task-plan surface as \`02.3 - AS - Project Content Inspection And Build Control Surface\` in \`Tasks/Future/\`, moved the completed \`02.2\` spec into \`Tasks/Old/\`, and updated the doc index plus roadmap-checklist tracker so the task lifecycle now points at the right next planning doc.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Treated completed `02.2` as a finished task doc that belongs in `Tasks/Old/`.
- Kept `02.3` in `Tasks/Future/` because it is the next planning surface, not yet an implementation-ready execution spec.

#### Summary of Implementation
- Moved `docs/Phase-Plans/Tasks/02.2 - AS - Browser-Facing Graph Output Structure.md` to `docs/Phase-Plans/Tasks/Old/`.
- Added a local doc-history entry inside the moved `02.2` file explaining the lifecycle move.
- Created `docs/Phase-Plans/Tasks/Future/02.3 - AS - Project Content Inspection And Build Control Surface.md`.
- Set up the new `02.3` future task doc with:
  - a progress checklist
  - scope boundaries
  - source inputs
  - current carry-forward from `02.2`
  - the main unresolved planning questions
  - likely spec-rewrite buckets for the later implementation-ready promotion
- Updated `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` so `[2.3]` now shows a dedicated plan/task doc exists.
- Updated `docs/Doc-Index.md` so:
  - `02.3` appears under `Tasks/Future`
  - `02.2` appears under `Tasks/Old`

#### Files Changed
- `docs/Phase-Plans/Tasks/Old/02.2 - AS - Browser-Facing Graph Output Structure.md`
- `docs/Phase-Plans/Tasks/Future/02.3 - AS - Project Content Inspection And Build Control Surface.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/Doc-Index.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No application behavior changed.
- The docs task lifecycle now treats `02.2` as completed history and `02.3` as the next planning surface.

#### Verification Steps
- Read back the new `02.3` future task doc.
- Read back the moved `02.2` doc under `docs/Phase-Plans/Tasks/Old/`.
- Read back the `Tasks/Future` / `Tasks/Old` entries in `docs/Doc-Index.md`.
- Confirmed `roadmapCHECKLISTS.md` now marks `[2.3]` plan-doc status as present.

<!-- ENTRY 238 -->
### [238] - 2026-03-16 12:42 - `AS - Phase 5 - Browser-Facing Graph Output Structure Closeout`
<!-- ENTRY 238 -->
HUMAN SUMMARY: `Closed out \`02.2\` by replacing the last component-shaped graph publish seam with a graph-owned content surface that already tells the singleton-versus-grouped truth, adding direct graph-seam and canonical \`OutputPreview\` contract tests, and updating the roadmap/task docs so \`[2.2]\` now reads as fully complete.` 

#### Scope / Constraints Honored
- Kept this pass inside the remaining `02.2` closeout scope:
  - graph-owned publish seam truth
  - canonical authored contract read path
  - direct graph-seam proof
- Left later row policy/build bars and `Part` truth in `[2.3]` and later lanes.
- Worked around unrelated in-flight repo edits without reverting user changes.

#### Summary of Implementation
- Replaced the old graph-owned published-component seam in `src/app/spaghetti/outputSurface.ts` with a graph-owned published-content seam that emits:
  - direct object rows for singleton publish groups
  - component rows for grouped multi-object publish groups
- Added a canonical `readNormalizedOutputPreviewParams(...)` helper in `src/app/spaghetti/system/outputPreviewNode.ts` so graph-owned publish derivation reads the authored `objects[] + slots[] + nextSlotIndex` contract directly from one normalized path.
- Updated `src/app/store/useAppStore.ts` so the project-content lift consumes the new graph-owned content seam directly instead of applying singleton-collapse truth on top of a component-shaped graph seam.
- Added direct graph-seam tests in `src/app/spaghetti/outputSurface.test.ts` and a canonical contract-read test in `src/app/spaghetti/system/outputPreviewNode.test.ts`.
- Closed the remaining `02.2` status docs by marking:
  - `docs/Phase-Plans/Tasks/02.2 - AS - Browser-Facing Graph Output Structure.md`
  - `docs/Human-Plans/roadmap/roadmap.md`
  - `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
  as fully complete for `02.2`.

#### Files Changed
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/outputSurface.test.ts`
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/system/outputPreviewNode.test.ts`
- `src/app/store/useAppStore.ts`
- `docs/Phase-Plans/Tasks/02.2 - AS - Browser-Facing Graph Output Structure.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The graph-owned publish seam now reflects the same structure truth as the Browser/project-content surface instead of always shaping publication as a component.
- `02.2` is now complete at the roadmap/task level; later content-row build/control work remains in `[2.3]`.

#### Verification Steps
- Ran:
  - `cmd /c npx vitest run src/app/spaghetti/outputSurface.test.ts src/app/spaghetti/system/outputPreviewNode.test.ts src/app/store/useAppStore.test.ts src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/BrowserPanel.test.tsx src/app/panels/browserRowActions.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/system/ensureOutputPreviewSlots.test.ts src/app/spaghetti/system/ensureOutputPreviewSingleton.test.ts`
- Verified:
  - `9` test files passed
  - `115` tests passed
- Read back the updated `02.2` task doc, roadmap `[2.2]`, and roadmap-checklist tracker.

<!-- ENTRY 237 -->
### [237] - 2026-03-16 12:37 - `DOC - Phase 11 - 02.2 Task Closeout Checklist`
<!-- ENTRY 237 -->
HUMAN SUMMARY: `Added the remaining \`02.2\` closeout tasks directly to the active task/spec doc so the final work needed to move roadmap \`[2.2]\` from \`[~]\` to \`[x]\` now lives in the same execution surface as the shipped first implementation cut.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Mirrored the existing roadmap closeout work into the active `02.2` task/spec doc instead of inventing a second task surface.
- Preserved the current implementation state as “first cut shipped, closeout remaining.”

#### Summary of Implementation
- Updated `docs/Phase-Plans/Tasks/02.2 - AS - Browser-Facing Graph Output Structure.md` to add:
  - a final unfinished `Done Check` item for the `02.2` closeout pass
  - a `Doc History` entry explaining the new closeout checklist
  - a dedicated `Closeout CheckList` section under the implementation/acceptance area
- The new closeout list now explicitly tracks:
  - graph-owned publish seam cleanup
  - authored `OutputPreview` contract tightening
  - end-to-end acceptance verification
  - direct graph-seam test coverage
  - the final roadmap `[2.2]` flip from `[~]` to `[x]`

#### Files Changed
- `docs/Phase-Plans/Tasks/02.2 - AS - Browser-Facing Graph Output Structure.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No application behavior changed.
- The active `02.2` task/spec now contains the remaining closeout work instead of leaving it only in the roadmap.

#### Verification Steps
- Read back the `Done Check`, `Doc History`, and `Closeout CheckList` sections in `docs/Phase-Plans/Tasks/02.2 - AS - Browser-Facing Graph Output Structure.md`.
- Confirmed the new closeout items match the roadmap `[2.2]` closeout checklist.

<!-- ENTRY 236 -->
### [236] - 2026-03-16 12:36 - `DOC - Phase 11 - Roadmap 2.2 Closeout Checklist`
<!-- ENTRY 236 -->
HUMAN SUMMARY: `Updated roadmap \`[2.2]\` to show that the first Browser-facing graph output structure cut is shipped but not fully closed, and added an explicit closeout checklist in both the roadmap and roadmap-checklist tracker so the remaining work to reach \`[x]\` is visible.` 

#### Scope / Constraints Honored
- Kept this pass documentation-only.
- Reflected the current implementation state without overstating `02.2` as fully complete.
- Added the remaining-closeout work as explicit checklist items instead of leaving it implied in chat context.

#### Summary of Implementation
- Updated `docs/Human-Plans/roadmap/roadmap.md` so `[2.2]` now reads as `[~]` instead of `[ ]`.
- Added a short current-state summary under `[2.2]` explaining that the first ship cut is done and one closeout pass remains.
- Added a sub-phase split under `[2.2]`:
  - `[2.2A] [x]` first shipped Browser-facing content structure cut
  - `[2.2B] [ ]` graph-owned publish seam cleanup and final closeout proof
- Marked the shipped `02.2` checklist items complete in the roadmap and added a dedicated `Closeout CheckList For [2.2] -> [x]`.
- Updated `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` so `[2.2]` now shows:
  - decision coverage present
  - dedicated task/spec doc present
  - the remaining closeout tasks needed before `[2.2]` can flip to `[x]`

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No application behavior changed.
- The roadmap now explicitly distinguishes:
  - shipped `02.2` structure work
  - the remaining closeout work before full completion

#### Verification Steps
- Read back roadmap `[2.2]` in `docs/Human-Plans/roadmap/roadmap.md`.
- Read back the `[2.2]` bucket in `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`.
- Confirmed the checklist language matches the current `02.2` implementation state and remaining closeout seam.

<!-- ENTRY 235 -->
### [235] - 2026-03-16 12:31 - `AS - Phase 5 - Browser-Facing Graph Output Structure`
<!-- ENTRY 235 -->
HUMAN SUMMARY: `Implemented the first Phase 5 \`02.2\` content-structure cut so singleton published outputs and receive links now lift as direct root objects, grouped publish sets keep real component rows, and the Browser tree reads from stable project-owned content with the new source-trace/status fields carried through.` 

#### Scope / Constraints Honored
- Kept this implementation focused on the `02.2` structure contract:
  - singleton `Assembly -> Object`
  - grouped `Assembly -> Component -> Object`
- Left later build-surface behavior, row policy, revisions, and `Part` truth out of scope.
- Worked within existing in-flight Browser/theme/test edits without reverting unrelated user changes.

#### Summary of Implementation
- Updated `src/app/store/useAppStore.ts` so project content now lifts:
  - singleton published outputs as direct root object rows
  - grouped published outputs as real component rows with child objects
  - receive links as direct root object rows instead of synthetic receive-link components
- Preserved the locked Phase 5 identity rules by:
  - keeping `objectId` as the stable object identity
  - making `componentId` conditional for grouped publish sets only
  - widening object records/browser rows for root-level objects and receive-link objects
- Carried forward the Phase 5 source-trace/read-model fields through Browser content rows, including:
  - `ownerGraphDocumentId`
  - `parentComponentId`
  - `objectSourceKind`
  - `slotId`
  - passive readiness/unresolved status labels
- Updated `src/app/panels/selectBrowserTreeRows.ts` so the Browser content tree can render mixed root ordering of:
  - grouped components
  - direct singleton published objects
  - direct receive-link objects
- Expanded the selector/store/panel tests to cover:
  - singleton root objects
  - direct receive-link objects
  - preserved Browser nesting/tree guides
  - the new object/browser row shape

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `docs/Phase-Plans/Tasks/02.2 - AS - Browser-Facing Graph Output Structure.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Browser `Content` no longer forces every published output or receive link through a component row.
- Root-level `Content` can now contain either:
  - a direct object row
  - a grouped component row
- Receive-link content now appears as a direct object row under the root assembly.

#### Verification Steps
- Ran:
  - `cmd /c npx vitest run src/app/store/useAppStore.test.ts src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/BrowserPanel.test.tsx src/app/panels/browserRowActions.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/system/outputPreviewNode.test.ts src/app/spaghetti/system/ensureOutputPreviewSlots.test.ts src/app/spaghetti/system/ensureOutputPreviewSingleton.test.ts`
- Verified:
  - `8` test files passed
  - `111` tests passed

<!-- ENTRY 234 -->
### [234] - 2026-03-16 12:17 - `DOC - Phase 11 - AS Phase 5 Execution Spec Promotion`
<!-- ENTRY 234 -->
HUMAN SUMMARY: `Promoted \`02.2 - AS - Browser-Facing Graph Output Structure\` into the active task/spec area, rewrote it into an implementation-ready execution spec, and aligned the \`AS - Phase 5\` family doc plus roadmap \`[2.2]\` wording to the locked singleton-collapse and conditional-component rules.` 

#### Scope / Constraints Honored
- Promoted the existing `02.2` planning doc into the canonical active task location instead of creating a second competing spec.
- Used the current Phase 5 defaults as final locked guidance for the spec, as planned.
- Kept this pass documentation-only; no application code changed.

#### Summary of Implementation
- Moved `docs/Phase-Plans/Tasks/Future/02.2 - AS - Browser-Facing Graph Output Structure.md` into `docs/Phase-Plans/Tasks/`.
- Rewrote `02.2` into an execution spec with:
  - explicit `Spec Target`
  - `Problem Statement`
  - locked publish contract, hierarchy, id, lift, and source-trace rules
  - `Implementation Order`
  - `Deferred / Out Of Scope`
  - `Acceptance / Proof Bar`
- Updated `docs/Phase-Plans/07_AS - Phase-Plans.md` so the Phase 5 question surface now reads as locked family guidance rather than a provisional suggested-answer pass.
- Updated `docs/Human-Plans/roadmap/roadmap.md` `[2.2]` so it now reflects:
  - singleton `Assembly -> Object`
  - multi-object `Assembly -> Component -> Object`
  - conditional `componentId`
  - no mandatory one-component-per-preview simplification
- Updated `docs/Doc-Index.md` so the promoted `02.2` task now appears under the live `Tasks` area instead of `Tasks/Future`.

#### Files Changed
- `docs/Phase-Plans/Tasks/02.2 - AS - Browser-Facing Graph Output Structure.md`
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Index.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Planning behavior changed only at the documentation level:
  - `02.2` is now the active implementation-ready spec for `AS - Phase 5`.

#### Verification Steps
- Read back the promoted `02.2` execution spec in `docs/Phase-Plans/Tasks/`.
- Read back the aligned `AS - Phase 5` question/answer section in `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Read back roadmap `[2.2]` in `docs/Human-Plans/roadmap/roadmap.md`.
- Read back the `Tasks` and `Tasks/Future` listing in `docs/Doc-Index.md`.

<!-- ENTRY 233 -->
### [233] - 2026-03-16 12:05 - `DOC - Phase 11 - AS Phase 5 Future Task Doc Setup`
<!-- ENTRY 233 -->
HUMAN SUMMARY: `Created the dedicated future task doc for \`[2.2] AS - Browser-Facing Graph Output Structure\` and refreshed \`docs/Doc-Index.md\` so the phase-task lifecycle paths and current \`Tasks/Future\` listing now point at the real live task-doc set.` 

#### Scope / Constraints Honored
- Used the existing phase-task workflow in `docs/Phase-Plans/Tasks/Future/` instead of inventing a parallel planning location.
- Kept the new file as a future planning/task surface, not a premature implementation-ready execution spec.
- Left this as docs/planning work only; no application code changed.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/02.2 - AS - Browser-Facing Graph Output Structure.md`.
- Set up the new task doc with:
  - a progress checklist
  - purpose and scope boundaries
  - source inputs
  - current locked direction from `AS - Phase 5`
  - seam findings from the current code
  - likely files and next-spec rewrite buckets
- Updated `docs/Doc-Index.md` so:
  - the phase-plan lifecycle paths use the current `Tasks/Future`, `Tasks`, and `Tasks/Old` folders
  - the foldable `Tasks/Future` listing reflects the current task-doc set and includes the new `02.2` file

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.2 - AS - Browser-Facing Graph Output Structure.md`
- `docs/Doc-Index.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Planning behavior changed only at the documentation level:
  - `AS - Phase 5` now has a dedicated future task-doc surface ready for the next spec rewrite pass.

#### Verification Steps
- Read back the new `02.2 - AS - Browser-Facing Graph Output Structure.md` task doc.
- Read back the updated `Phase-Plan Lifecycle Rule` and `Tasks/Future` section in `docs/Doc-Index.md`.
- Confirmed the new changelog entry was added at the top of the live entry list.

<!-- ENTRY 232 -->
### [232] - 2026-03-16 12:03 - `DOC - Phase 11 - AS Phase 5 Remaining Questions With Suggested Answers`
<!-- ENTRY 232 -->
HUMAN SUMMARY: `Updated \`AS - Phase 5\` so every remaining open sub-question now has an explicit suggested answer, and synced those recommendations into the main \`AS5.Q4\` through \`AS5.Q6\` answer blocks.` 

#### Scope / Constraints Honored
- Kept the refinement inside the canonical `AS` family phase-plan file instead of starting a parallel note.
- Preserved the `AS5.Q1` through `AS5.Q6` structure while making the remaining unresolved items easier to resolve.
- Left this as docs/planning work only; no application code changed.

#### Summary of Implementation
- Added a new local `Doc History` entry to `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Renamed the open-items section to `Remaining Decision Questions With Suggested Answers`.
- Added explicit recommended answers for:
  - empty authored `objects[]` entries
  - multiple separate singleton publish groups in one graph document
  - accepting `slotId`-based highlight identity in Phase 5
  - receive-link content following the singleton-collapse rule on the visible Browser surface
- Synced those same recommendations into the `Suggested Answer` blocks for `AS5.Q4`, `AS5.Q5`, and `AS5.Q6`.

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Planning behavior changed only at the documentation level:
  - every remaining Phase 5 sub-decision now has a concrete recommendation attached to it.

#### Verification Steps
- Read back the `Remaining Decision Questions With Suggested Answers` block in `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Read back the updated `AS5.Q4`, `AS5.Q5`, and `AS5.Q6` suggested answer blocks in `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Confirmed the new changelog entry was added at the top of the live entry list.

<!-- ENTRY 231 -->
### [231] - 2026-03-16 11:58 - `DOC - Phase 11 - AS Phase 5 Singleton Component Label Rule`
<!-- ENTRY 231 -->
HUMAN SUMMARY: `Locked the \`AS - Phase 5\` rule that \`componentLabel\` is ignored for singleton publish groups and only becomes meaningful when a real multi-object component grouping exists.` 

#### Scope / Constraints Honored
- Kept the decision inside the canonical `AS` family phase-plan file instead of scattering it across ad hoc notes.
- Updated the existing Phase 5 answer surface and remaining-question list rather than creating a competing rule section elsewhere.
- Left this as docs/planning work only; no application code changed.

#### Summary of Implementation
- Added a new local `Doc History` entry to `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Updated the `Locked Decisions So Far` block so singleton groups now explicitly ignore `componentLabel`.
- Removed the singleton `componentLabel` item from the `Remaining Decision Questions` block because it is now settled.
- Updated the `AS5.Q1` suggested answer so the singleton-versus-multi-object meaning of `componentLabel` is recorded in the main contract guidance.

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Planning behavior changed only at the documentation level:
  - singleton publish groups now have no latent component-label meaning in the suggested Phase 5 model.

#### Verification Steps
- Read back the updated `Locked Decisions So Far`, `Remaining Decision Questions`, and `AS5.Q1` sections in `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Confirmed the new changelog entry was added at the top of the live entry list.

<!-- ENTRY 230 -->
### [230] - 2026-03-16 11:56 - `DOC - Phase 11 - AS Phase 5 Object Identity Promotion Rule`
<!-- ENTRY 230 -->
HUMAN SUMMARY: `Locked the \`AS - Phase 5\` promotion rule for singleton publish groups so an original object keeps its existing \`objectId\` if the group later becomes multi-object, while the new parent component gets its own new grouping identity.` 

#### Scope / Constraints Honored
- Kept the decision inside the canonical `AS` family phase-plan file rather than moving it into a separate scratch note.
- Updated the existing `AS5.Q1` and `AS5.Q2` answer surface instead of creating a competing rule block elsewhere.
- Left this as docs/planning work only; no application code changed.

#### Summary of Implementation
- Added a new local `Doc History` entry to `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Added the singleton-to-multi-object promotion rule to the `Locked Decisions So Far` block.
- Removed that item from the `Remaining Decision Questions` block because it is now settled.
- Updated the `Suggested Answer` blocks for `AS5.Q1` and `AS5.Q2` so the preserved `objectId` rule is written where the implementation guidance lives.

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Planning behavior changed only at the documentation level:
  - singleton publish groups now have an explicit non-churning object-identity promotion rule for later expansion into multi-object groups.

#### Verification Steps
- Read back the updated `Locked Decisions So Far`, `Remaining Decision Questions`, `AS5.Q1`, and `AS5.Q2` sections in `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Confirmed the new changelog entry was added at the top of the live entry list.

<!-- ENTRY 229 -->
### [229] - 2026-03-16 11:52 - `DOC - Phase 11 - AS Phase 5 Locked Decisions And Remaining Questions`
<!-- ENTRY 229 -->
HUMAN SUMMARY: `Added a compact locked-decisions block and a remaining-questions block to \`AS - Phase 5\`, recording the settled singleton-object rule and making the last unresolved implementation-readiness decisions explicit as sub-decisions under \`AS5.Q1\` through \`AS5.Q6\`.` 

#### Scope / Constraints Honored
- Kept the additions inside the canonical `AS` family phase-plan file instead of starting a separate scratch doc.
- Clarified the existing Phase 5 question surface without replacing the `AS5.Q1` through `AS5.Q6` structure.
- Left this as docs/planning work only; no application code changed.

#### Summary of Implementation
- Added a new local `Doc History` entry to `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Added a `Locked Decisions So Far` block that records:
  - singleton publish groups are truly object-native
  - multi-object groups create real component hierarchy only when needed
  - `objects[]` is the first-pass authored publish seam
  - `Part` remains deferred
- Added a `Remaining Decision Questions` block that makes the last unresolved Phase 5 decisions explicit and maps them back to `AS5.Q1` through `AS5.Q6`.

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Planning behavior changed only at the documentation level:
  - the last open Phase 5 decisions are now written down as explicit sub-decisions instead of remaining implicit in chat context.

#### Verification Steps
- Read back the new `Locked Decisions So Far` and `Remaining Decision Questions` blocks in `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Confirmed the new changelog entry was added at the top of the live entry list.

<!-- ENTRY 228 -->
### [228] - 2026-03-16 11:48 - `DOC - Phase 11 - AS Phase 5 Singleton Object Hierarchy Refinement`
<!-- ENTRY 228 -->
HUMAN SUMMARY: `Refined the \`AS - Phase 5\` suggested answers so single-object \`OutputPreview\` groups no longer require a visible parent component row, while multi-object publish groups still lift through a component when Browser hierarchy is actually needed.` 

#### Scope / Constraints Honored
- Kept the refinement inside the canonical `AS` family phase-plan file instead of introducing a parallel note.
- Adjusted only the suggested Phase 5 structure answers; no application code changed.
- Preserved the earlier answer blocks while tightening them to reflect the singleton-object rule.

#### Summary of Implementation
- Added a new local `Doc History` entry to `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Updated `AS5.Q1` so `componentLabel` now reads as conditional metadata rather than a mandatory visible parent for every publish group.
- Updated `AS5.Q2` so the suggested Browser hierarchy is now:
  - `Assembly -> Object` for single-object publish groups
  - `Assembly -> Component -> Object` for multi-object publish groups
- Updated `AS5.Q3` and `AS5.Q4` so `componentId` and component lift are treated as conditional structure only when a real grouping row is needed.

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Planning behavior changed only at the documentation level:
  - the suggested Phase 5 Browser content model now collapses redundant singleton component rows.

#### Verification Steps
- Read back the updated `AS5.Q1` through `AS5.Q4` suggested answers in `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Confirmed the new changelog entry was added at the top of the live entry list.

<!-- ENTRY 227 -->
### [227] - 2026-03-16 11:45 - `DOC - Phase 11 - AS Phase 5 Suggested Answers For Q1 Through Q6`
<!-- ENTRY 227 -->
HUMAN SUMMARY: `Added concrete suggested answers to \`AS5.Q1\` through \`AS5.Q6\` in \`docs/Phase-Plans/07_AS - Phase-Plans.md\`, locking the current code-backed Phase 5 direction around the first-pass publish contract, \`Assembly -> Component -> Object\` hierarchy, stable ids, lift shape, source-trace carry-forward, and explicit defers to later build/runtime work.` 

#### Scope / Constraints Honored
- Kept the work inside the canonical `AS` family phase-plan file instead of creating a separate answer doc.
- Treated the additions as suggested answers rather than prematurely marking the questions as permanently settled.
- Left the change in documentation only; no application code changed.

#### Summary of Implementation
- Added a new local `Doc History` entry to `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Expanded each Phase 5 question section with a `Suggested Answer` block.
- Locked the suggested Phase 5 authored publish contract around `componentLabel + objects[] + slots[] + nextSlotIndex`.
- Locked the suggested first-pass Browser `Content` hierarchy around `Assembly -> Component -> Object` while keeping `Part` as an explicit later extension.
- Documented the suggested stable id families, graph-to-project lift path, required source-trace fields, and explicit phase defers.

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Planning behavior changed only at the documentation level:
  - `AS - Phase 5` now contains concrete proposed answers for the implementation-readiness questions instead of only the question prompts.

#### Verification Steps
- Read back the updated `AS5.Q1` through `AS5.Q6` sections in `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Confirmed the new changelog entry was added at the top of the live entry list.

<!-- ENTRY 226 -->
### [226] - 2026-03-16 11:37 - `DOC - Phase 11 - AS Phase 5 Implementation-Readiness Question Surface`
<!-- ENTRY 226 -->
HUMAN SUMMARY: `Expanded \`docs/Phase-Plans/07_AS - Phase-Plans.md\` so \`AS - Phase 5\` is no longer a thin placeholder and now acts as the active family question surface for getting Browser-facing graph output structure implementation-ready.` 

#### Scope / Constraints Honored
- Kept the work inside the canonical `AS` family phase-plan file instead of creating a competing planning doc.
- Followed the existing family phase-plan format and kept the phase focused on `AS - Phase 5` structure questions rather than pulling in `AS - Phase 6` build-surface work.
- Left this as docs/planning work only; no application code changed.

#### Summary of Implementation
- Added a new local `Doc History` entry to `docs/Phase-Plans/07_AS - Phase-Plans.md`.
- Reframed `AS - Phase 5` from a generic future placeholder into the active planning surface for implementation readiness.
- Added a Phase 5 question checklist covering:
  - authored publish contract shape above `OutputPreview`
  - first-pass `Assembly -> Component -> Object` hierarchy
  - stable published ids and ownership split
  - graph-to-project lift shape
  - source mapping / highlight carry-forward
  - explicit scope defers to later phases
- Updated the top Phase 5 checklist so it now reflects the concrete questions that must be answered before a dedicated task doc is written.

#### Files Changed
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Planning behavior changed only at the documentation level:
  - `AS - Phase 5` now has a concrete implementation-readiness question surface instead of only a placeholder summary.

#### Verification Steps
- Read back the updated `AS - Phase 5` heading, summary, planning notes, question checklist, and expanded checklist in `docs/Phase-Plans/07_AS - Phase-Plans.md`.

<!-- ENTRY 225 -->
### [225] - 2026-03-16 11:32 - `DOC - Phase 11 - Roadmap Lane Realignment To Vision`
<!-- ENTRY 225 -->
HUMAN SUMMARY: `Realigned the live roadmap and roadmap checklist to the newer vision split by renaming the foundation lane around graph-native ownership, re-scoping Lane \`[2]\` around \`Graph Documents\` versus \`Content\`, adding the missing authoring-hardening lane, and moving the later build/control/workspace placeholder systems into Lane \`[4]\`.` 

#### Scope / Constraints Honored
- Updated the execution roadmap against the current vision roadmap instead of introducing a separate parallel planning surface.
- Preserved shipped work history and existing subphase progress where it still fit the newer lane boundaries.
- Kept this as docs/planning restructuring only; no source-code behavior changed.

#### Summary of Implementation
- Updated `docs/Human-Plans/roadmap/roadmap.md` so Lane `[1]` now reads as graph-native foundation/ownership work instead of single-graph cleanup.
- Re-scoped Lane `[2]` around Browser/project content structure, with `[2.2]` and `[2.3]` now explicitly grounded in the `Graph Documents` versus `Content` split and the staged `Assembly -> Component -> Object` build-surface model.
- Added a new Lane `[3]` for node/wire/driver/part/feature authoring hardening so the execution roadmap now has a clear home for the vision lane that was previously missing.
- Renumbered the later control/build/workspace placeholder lane to Lane `[4]` and refreshed its build/runtime language so the graph-native worker-contract and truthful build-chunk work now read as the post-workspace follow-up.
- Synced `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md` so the tracker headings, lane items, and totals follow the same lane map as the updated roadmap.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Planning behavior changed only at the documentation level:
  - Lane `[2]` is now the explicit home for the `Content` publish/build-surface work.
  - Lane `[3]` is now the explicit home for post-workspace authoring hardening.
  - Lane `[4]` is now the explicit home for later build/runtime/control/workspace replacement work.

#### Verification Steps
- Read back the updated lane handoff, Lane `[2]` content phases, new Lane `[3]`, and renumbered Lane `[4]` sections in `docs/Human-Plans/roadmap/roadmap.md`.
- Read back the corresponding bucket headings and totals in `docs/Human-Plans/roadmap/roadmapCHECKLISTS.md`.

<!-- ENTRY 224 -->
### [224] - 2026-03-16 00:33 - `DOC - Phase 11 - Condensed Now Next Later Planning Surface`
<!-- ENTRY 224 -->
HUMAN SUMMARY: `Added a compact planning doc that condenses the larger roadmap, vision roadmap, wishlist, and active SP planning surface into one recommended Now / Next / Later / Much Later execution order, and registered that doc in the live docs index.` 

#### Scope / Constraints Honored
- Kept this as a roadmap-adjacent planning surface instead of rewriting the main roadmap.
- Based the ordering on the live shipped/planned docs rather than older placeholder phase ladders.
- Left the detailed execution questions in the existing roadmap and phase-plan docs.

#### Summary of Implementation
- Added `docs/Human-Plans/roadmap/Now-Next-Later-Much-Later.md` as a compact build-order view.
- Grouped the current planning state into four execution buckets with a short dependency spine and explicit defer rules.
- Added the new planning doc to the active docs index under `docs/Human-Plans/roadmap/`.

#### Files Changed
- `docs/Human-Plans/roadmap/Now-Next-Later-Much-Later.md`
- `docs/Doc-Index.md`

<!-- ENTRY 223 -->
### [223] - 2026-03-12 20:20 - `VR / SP - Lane 2.1E - Shared Left-Dock Ghost Docking For Browser And Meatball Re-Entry`
<!-- ENTRY 223 -->
HUMAN SUMMARY: `Added the first fixed-slot `2.1E` dockable left-panel behavior so the Browser can ghost-preview and dock back into its top slot, while dragging the docked meatball editor out now restores the normal floating Spaghetti Editor and lets that floating editor ghost-preview back into the meatball slot.` 

#### Scope / Constraints Honored
- Kept this to the fixed-slot `2.1E` version instead of introducing arbitrary left-dock panel reordering.
- Preserved the rule that `meatball editor` is the docked toolbar-hosted presentation, not a separate floating shell.
- Reused the existing floating Spaghetti Editor shell instead of inventing a second floating editor implementation.

#### Summary of Implementation
- Added shared left-dock target wrappers in `AppShell` for the Browser and meatball slots.
- Implemented compact dashed ghost previews that appear when a dragged panel hovers over its valid dock target.
- Wired the floating Browser drag path to re-dock on drop over the Browser slot.
- Wired the docked meatball titlebar drag path to restore the normal floating Spaghetti Editor once the drag leaves the dock.
- Wired the floating Spaghetti Editor drag path to re-enter `meatball editor view` when dropped over the meatball target.
- Added focused shell tests for Browser re-docking, meatball drag-out, and meatball re-entry.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- Dragging the floating Browser back over its dock slot now shows a ghost placeholder and docks it on release.
- Dragging the docked meatball editor out now converts it back into the floating Spaghetti Editor during the same drag.
- Dragging the floating Spaghetti Editor back over the meatball slot now shows a ghost placeholder and restores `meatball editor view` on release.

#### Verification Steps
- `npm.cmd test -- --run src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 222 -->
### [222] - 2026-03-12 17:10 - `VR / SP - Lane 2.1D - Add Combined Compile-Build Quick Action Beside Graph Selector`
HUMAN SUMMARY: `Replaced the separate Compile and Build buttons with one square quick-action button beside the graph selector that runs the existing compile-then-build path in one click, leaving the Build section focused on save-only behavior.` 

#### Scope / Constraints Honored
- Kept this scoped to the Spaghetti toolbar interaction model.
- Reused the existing `requestGraphDocumentBuild(...)` path so the new quick action follows the current compile-then-build rules.
- Did not change the underlying graph compile/build pipeline behavior.

#### Summary of Implementation
- Added a small square quick-action button to the left of the standalone graph selector row.
- Wired that button to the existing combined graph build request path.
- Removed the separate `Compile` and `Build` buttons from the Build section and updated the inline help copy to match the new quick-action flow.
- Added panel test coverage for the new combined quick-action button.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The top graph row now exposes one square quick-build action instead of requiring separate compile/build buttons.
- The Build section now reads more cleanly because save is the only remaining direct button there.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 221 -->
### [221] - 2026-03-12 17:05 - `VR / SP - Lane 2.1D - Move Canvas View-Mode Toggle Out Of Graph Header`
HUMAN SUMMARY: `Cleaned up the Graph toolbar section by making the viewport graph selector span the full editor width and moving the Expanded / Collapsed toggle into the editor-surface canvas toolbar, with the same mode controls still visible while the canvas is already in collapsed mode so the user can return immediately.` 

#### Scope / Constraints Honored
- Kept this scoped to the internal Spaghetti toolbar and editor-surface mode controls.
- Did not remove any graph-view functionality; only changed where the controls live.
- Preserved the existing `expanded` / `collapsed` canvas behavior while making the return path clearer.

#### Summary of Implementation
- Removed the `Expanded` / `Collapsed` buttons from the `Graph` header section so that branch now focuses on graph binding only.
- Styled the graph-document selector as a full-width control across the Graph section.
- Passed the view-mode toggle into the actual editor surface so `Expanded` / `Collapsed` now live in the canvas toolbar for expanded view and in a matching toolbar strip for collapsed view.
- Added focused test coverage to pin the collapsed-view return path.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
- `src/app/spaghetti/ui/CollapsedEditor.test.tsx`
- `src/app/spaghetti/ui/ExpandedEditor.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The `Graph` section now reads as a clean full-width graph-binding control instead of mixing graph binding with canvas mode buttons.
- The canvas-mode toggle now lives with the rest of the canvas tools, and it remains visible even when the canvas is already in collapsed mode.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/spaghetti/ui/CollapsedEditor.test.tsx src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 220 -->
### [220] - 2026-03-12 16:57 - `VR / SP - Lane 2.1D - Reorganize Internal Spaghetti Toolbar Into Expandable Sections`
HUMAN SUMMARY: `Reorganized the internal Spaghetti toolbar into tidy collapsible sections so the growing control surface reads as grouped tool areas instead of one long wall of controls, while preserving the existing graph, node, viewer, build, legend, and diagnostics features.` 

#### Scope / Constraints Honored
- Kept all existing toolbar functionality intact and only restructured how it is presented.
- Reused native expandable section behavior instead of inventing a new toolbar state system.
- Left the titlebar `i` behavior and the rest of the `2.1D` shell/view-mode work unchanged.

#### Summary of Implementation
- Grouped the internal toolbar into expandable `Graph`, `Node Focus`, `Part Nodes`, `Samples`, `Build`, `Viewer`, `Type Legend`, and `Diagnostics` sections.
- Left the `Graph` block open by default as the core active-editing section and kept the other groups collapsed by default to reduce visual density.
- Added dedicated section styling so the new grouped controls read consistently with the existing help/details treatment.
- Expanded the `SpaghettiPanel` test coverage to assert the grouped section structure and default-open/default-closed behavior.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/Human-Plans/CodexNotes/9_CodexChatNotes.md`

#### Behavior Changes
- Opening the internal toolbar now reveals grouped collapsible tool areas instead of a single long unstructured strip of controls.
- Core graph-binding controls stay immediately available, while secondary controls can be expanded only when needed.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 219 -->
### [219] - 2026-03-12 16:48 - `VR / SP - Lane 2.1D - Consolidate Internal Spaghetti Toolbar And Retained-Band Header Collapse`
HUMAN SUMMARY: `Implemented the internal Spaghetti toolbar cleanup by moving graph/view/focus/new-part controls and the type legend into the real top toolbar area, simplifying the editor body back down to the graph surface itself, and changing the titlebar i behavior so the toolbar collapses to a thin retained band instead of disappearing outright.` 

#### Scope / Constraints Honored
- Kept this work inside the in-app Spaghetti Editor shell and internal toolbar surface.
- Reused the existing graph binding, graph-command, and collapsed-editor paths rather than introducing a new editor architecture.
- Left detached-window behavior and larger shell changes untouched.

#### Summary of Implementation
- Moved the graph selector, `Expanded` / `Collapsed` mode controls, `Focus Node`, `New Part Node`, and the type/color legend into the `SpaghettiPanel` header area.
- Simplified `SpaghettiEditor` so it now renders only the active expanded/collapsed editor surface instead of owning a second internal toolbar.
- Changed the internal header collapse behavior so the `i` button now drives a retained minimized band, while the existing resize bar can pull the toolbar back open to a custom height.
- Added panel/shell tests covering the consolidated toolbar and retained-band collapsed state.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`
- `docs/Human-Plans/CodexNotes/9_CodexChatNotes.md`

#### Behavior Changes
- The internal editor toolbar now lives in one coherent top area instead of scattering key controls through the editor body.
- The `i` button now minimizes the toolbar to a thin retained band rather than fully hiding it.
- Dragging the existing toolbar/canvas resize bar can reopen that band into a custom toolbar height.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 218 -->
### [218] - 2026-03-12 16:31 - `VR / SP - Lane 2.1D - Small Shell And Selector Fixups Roll-Up`
HUMAN SUMMARY: `Compiled the recent small UI fix-ups into one readable batch: the Spaghetti Editor kept its top-bar controls in meatball mode, the Browser header became collapsible, the floating editor height was normalized to the browser, the titlebar gained a header-toggle button, and the in-panel viewport graph selector was cleaned up, stabilized, and dark-themed.` 

#### Scope / Constraints Honored
- This is a roll-up summary of several small shipped UI follow-ups rather than a new large feature cut.
- Kept the work inside the current in-app Browser and Spaghetti Editor shell surfaces.
- Left detached/separate-browser behavior deferred.

#### Summary of Implementation
- Restored the shared Spaghetti top bar inside `meatball editor view` so the docked editor still exposes mode and exit controls.
- Made the `Browser` header collapse or expand the full Browser body for quick left-dock cleanup.
- Normalized the default floating editor height against the browser viewport instead of relying on the older fixed pixel default.
- Added the titlebar `i` button to toggle the Spaghetti header/toolbar area from the shell.
- Replaced the in-panel header-collapse strip with a viewport graph selector, then hardened that selector to use stable Zustand subscriptions and polished it to span the full row with a darker matching menu theme.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The docked meatball editor no longer feels like a dead end because its shell controls stay visible.
- The Browser panel can now be folded away at the section-header level.
- The floating Spaghetti Editor opens with a more browser-relative default height.
- Header/toolbar collapse now lives in the titlebar instead of being duplicated inside the panel body.
- The viewport graph selector now reads like a full-width dark-themed control and no longer reintroduces the `New Graph` black-screen selector crash.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx src/app/panels/BrowserPanel.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 217 -->
### [217] - 2026-03-12 16:26 - `VR / SP - Fix New Graph Black-Screen Regression From Unstable Viewport Graph Selector`
HUMAN SUMMARY: `Fixed the new black-screen-on-New-Graph regression by removing a fresh-array Zustand subscription from the new Spaghetti viewport graph selector and rebuilding those graph options from stable store slices in useMemo, matching the same selector-stability rule documented in Browser bug 2.` 

#### Scope / Constraints Honored
- Kept this fix scoped to the new Spaghetti viewport graph selector path.
- Matched the existing selector-stability fix pattern already documented in the Browser bug notes.
- Did not change the viewport graph-switching behavior itself.

#### Summary of Implementation
- Stopped subscribing `SpaghettiPanel` directly to `selectOrderedGraphDocuments(...)`, which allocates a fresh array.
- Switched the panel to subscribe only to stable `graphDocumentsById` and `graphDocumentOrder` slices.
- Rebuilt the ordered graph-document options locally in `useMemo` before rendering the viewport graph dropdown.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`

#### Behavior Changes
- Clicking `New Graph` no longer trips the React/Zustand black-screen crash through the viewport graph selector.
- The viewport graph dropdown still works, but now follows the stable-subscription rule.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx src/app/panels/BrowserPanel.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 216 -->
### [216] - 2026-03-12 16:22 - `VR / SP - Lane 2.1D - Replace In-Panel Header Toggle With Viewport Graph Selector`
HUMAN SUMMARY: `Removed the old in-panel Collapse Header row from the Spaghetti Editor and replaced it with a viewport graph dropdown so each editor surface can directly switch which graph document it is bound to while the header collapse control now lives in the top titlebar.` 

#### Scope / Constraints Honored
- Kept this scoped to the in-panel top row inside `SpaghettiPanel`.
- Reused the existing viewport rebinding path in the spaghetti store instead of inventing a new graph-switching flow.
- Left the titlebar `i` button as the single header/toolbar collapse control.

#### Summary of Implementation
- Replaced the old `Spaghetti Editor / Collapse Header` strip with a `Viewport Graph` dropdown bound to the current viewport graph document.
- Wired the dropdown to `bindEditorViewportToGraphDocument(...)` so changing the selection really switches the graph shown in that viewport.
- Added focused panel tests covering the new selector rendering and rebinding behavior.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The in-panel top row now shows a graph selector for the current viewport instead of an internal header-collapse toggle.
- Header/toolbar collapse is now controlled from the shell titlebar rather than duplicated inside the panel body.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 215 -->
### [215] - 2026-03-12 16:17 - `VR / SP - Lane 2.1D - Titlebar Header Toggle For Spaghetti Editor`
HUMAN SUMMARY: `Added a new i button to the Spaghetti Editor titlebar so the top-bar shell can directly expand or collapse the editor header/toolbar area, keeping that state in sync across the floating, split, and meatball presentations.` 

#### Scope / Constraints Honored
- Kept this scoped to the in-app Spaghetti Editor titlebar and header/toolbar collapse behavior.
- Reused the existing header-collapse path in `SpaghettiPanel` instead of inventing a second toolbar state.
- Did not change Browser behavior or detached-window behavior.

#### Summary of Implementation
- Added a new `i` titlebar button that toggles the Spaghetti header/toolbar area from the shell.
- Made `SpaghettiPanel` support controlled header-collapse state so the same toggle behavior works across floating, split, and meatball hosts.
- Added focused shell test coverage for the new titlebar header toggle.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/panels/SpaghettiPanel.tsx`

#### Behavior Changes
- The Spaghetti Editor top bar now includes an `i` control that expands or collapses the editor header/toolbar area.
- Header/toolbar collapse state is now driven consistently from either the titlebar or the in-panel header toggle.

#### Verification Steps
- `npm.cmd test -- --run src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 214 -->
### [214] - 2026-03-12 16:14 - `VR / SP - Lane 2.1D - Normalize Default Floating Editor Height`
HUMAN SUMMARY: `Adjusted the normal floating Spaghetti Editor sizing so its default height now normalizes against the current browser viewport height instead of sitting on the old fixed pixel default that could force the editor internals to scroll.` 

#### Scope / Constraints Honored
- Kept this limited to the default expanded floating-editor height behavior.
- Preserved the existing maximize, split, meatball, and close mode behavior.
- Did not change detached-window behavior or the Browser shell.

#### Summary of Implementation
- Added viewport-relative default-height normalization in `AppShell` for the standard floating editor state.
- Left user-sized floating editor dimensions intact, while making the untouched default editor height track the current browser viewport more closely.

#### Files Changed
- `src/app/AppShell.tsx`

#### Behavior Changes
- The default floating `Spaghetti Editor` now uses a browser-height-based normalized height, reducing the chance that the editor shell starts in a too-short state that forces internal scrolling.

#### Verification Steps
- `npm.cmd test -- --run src/app/AppShell.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 213 -->
### [213] - 2026-03-12 16:10 - `VR / SP - Lane 2.1D - Meatball Header Controls And Browser Panel Collapse`
HUMAN SUMMARY: `Added the missing top bar back into meatball editor view so the user keeps the shell controls while docked, and made the Browser header itself collapse the full Browser body to reclaim left-dock space quickly.`

#### Scope / Constraints Honored
- Kept this to two small follow-up UI fixes on top of the shipped `2.1D` editor-surface work and Browser shell.
- Reused the existing in-app shell controls instead of introducing new window behavior.
- Did not change detached/separate-browser behavior.

#### Summary of Implementation
- Reused the existing `SpaghettiWindowTitleBar` inside the `SpaghettiMeatballHost` so the docked editor still exposes mode-switch and close controls.
- Added a collapsible Browser panel header that hides or shows the entire Browser body, including the top action buttons and tree content.
- Added focused UI coverage for the meatball-host controls and Browser panel collapse behavior.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- `meatball editor view` now keeps a visible `Spaghetti Editor` top bar with the same shell-control cluster, so the user can leave that mode directly.
- Clicking the `Browser` header now collapses or expands the entire Browser body.

#### Verification Steps
- `npm.cmd test -- --run src/app/AppShell.test.tsx src/app/panels/BrowserPanel.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 212 -->
### [212] - 2026-03-12 15:50 - `VR / SP - Lane 2.1D - Spaghetti Floating Window Controls And View Modes`
HUMAN SUMMARY: `Implemented the 2.1D in-app spaghetti window controls by replacing the old Drag label with explicit shell actions, adding true collapsed / maximized / split-view behavior, and introducing a dedicated meatball editor host below Parts List while keeping detached browser windows deferred.`

#### Scope / Constraints Honored
- Kept this phase scoped to the active in-app editor surface and did not ship detached or separate-browser window behavior.
- Reused the existing focused editor viewport/store model instead of introducing true multi-window shell rendering.
- Preserved normal floating drag/resize behavior for the standard expanded overlay mode.

#### Summary of Implementation
- Extended the editor viewport window-mode contract with `maximized` and `split view`, plus viewport-owned split ratio and restore metadata so collapsed and split toggles can restore into the correct prior mode.
- Reworked `AppShell` so the active spaghetti editor can now render in five in-app states: floating `expanded`, header-only `collapsed`, full-overlay `maximized`, docked `split view`, and left-dock `meatball editor view`.
- Replaced the old top-right `Drag` label with explicit titlebar controls for collapse, meatball, maximize, split, and close, and added the split-mode divider interaction so the user can rebalance the model viewport against the editor pane.
- Added shell/store tests covering the new window-mode transitions and rendering paths.

#### Files Changed
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/theme/v15Theme.css`

#### Behavior Changes
- The spaghetti editor titlebar now exposes explicit in-app shell controls instead of a passive `Drag` label.
- `collapsed` now means a true header-only strip that hides the editor body while keeping the editor surface available for quick return.
- `maximized` now fills the current app viewport and toggles back to the default floating editor size on the next maximize click.
- `split view` now docks the model viewport above the editor with a draggable divider, and toggling split off restores the previously captured non-split state.
- `meatball editor view` now presents the active editor in a dedicated left-dock host below `Parts List` instead of leaving it as an overlay.
- Detached/separate-browser editor behavior is still deferred.

#### Verification Steps
- `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/AppShell.test.tsx src/app/panels/BrowserPanel.test.tsx src/app/panels/selectBrowserTreeRows.test.ts`
- `npm.cmd run build`

<!-- ENTRY 211 -->
### [211] - 2026-03-12 15:02 - `VR / SP - Lane 2.1C - Browser Open Editors Cleanup`
HUMAN SUMMARY: `Completed the next 2.1C Browser cleanup slice by renaming the Browser branch from Open Viewports to Open Editors, adding a small ... overflow trigger beside selection-first rows, and tightening the Browser copy so editor-session tracking reads more honestly against the current one-active-editor shell.`

#### Scope / Constraints Honored
- Kept this scoped to Browser naming, Browser row/menu access, and Browser-shell honesty cleanup.
- Preserved the existing graph/output/viewport action set and reused the same menu surface for right-click and overflow access.
- Did not change `AppShell` into true multi-window spaghetti-editor rendering.

#### Summary of Implementation
- Updated `BrowserPanel` so graph, published-output, and editor rows expose a small `...` overflow button that opens the same menu already used by right-click.
- Renamed the Browser section from `Open Viewports` to `Open Editors` and added a one-line note clarifying that the branch tracks editor sessions while the workspace still shows the active editor surface.
- Tightened Browser row copy so graph meta now uses editor-oriented wording such as `Active editor` / `Open editor`, and the editor list rows now read as `Active editor` or `Editor zN`.
- Added a focused `BrowserPanel` interaction test under `jsdom` to cover the new overflow button and the preserved right-click path.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectBrowserGraphRows.test.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/browserRowActions.test.ts`
- `src/app/theme/v15Theme.css`
- `package.json`
- `package-lock.json`

#### Behavior Changes
- Browser rows remain selection-first on normal click, but now have a discoverable `...` menu trigger in addition to right-click.
- The Browser no longer labels the editor-session branch as `Open Viewports`; it now reads `Open Editors`.
- Browser row meta is calmer and more explicit about editor/session state.

#### Verification Steps
- `npm.cmd test -- --run src/app/panels/selectBrowserGraphRows.test.ts src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/browserRowActions.test.ts src/app/panels/BrowserPanel.test.tsx`
- `npm.cmd run build`

<!-- ENTRY 210 -->
### [210] - 2026-03-12 14:35 - `VR / SP - Lane 2.1C - Browser Row Action Cleanup And Context Menus`
HUMAN SUMMARY: `Cleaned up the Browser rows by removing the always-visible row action strips, keeping rows selection-first, and moving existing graph/output/viewport commands into a right-click context menu so the Browser reads more like a calm tree and less like a stack of mini toolbars.`

#### Scope / Constraints Honored
- Kept this limited to Browser row interaction and presentation cleanup.
- Preserved the existing explicit graph/output/viewport action set instead of inventing new Browser commands.
- Avoided pulling deeper Browser hierarchy, materials/visibility controls, or workspace-mode work into this cut.

#### Summary of Implementation
- Updated `BrowserPanel` so graph rows, published-output rows, and viewport rows now open their action list through a row context menu instead of rendering a visible action strip on every row.
- Kept row-body click selection-first while making right-click the entry path for:
  - `Save`
  - `Open`
  - `Reveal`
  - `New Editor`
  - `Swap Editor`
  - `Focus`
  - `Close`
- Added lightweight Browser context-menu state with:
  - row selection on right-click
  - close-on-outside-click
  - close-on-escape
  - close-on-action-run behavior
- Simplified Browser row styling so the hierarchy and labels stay visually primary while the command surface remains secondary.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Browser rows no longer show the full visible action button strip by default.
- Right-clicking a graph row, published-output row, or viewport row now opens that row's Browser options menu.
- Browser rows remain selection-first on normal click.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/browserRowActions.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 209 -->
### [209] - 2026-03-12 14:15 - `SP / VR - Lane 2.1B - Browser, Editor, And Shared Viewer Coordination`
HUMAN SUMMARY: `Implemented `[2.1B]` by adding explicit Browser `Reveal` actions for graph and published-output rows, reusing the existing graph-scoped viewer-target path when shared composition is inactive, surfacing read-only shared-composition status in Browser rows, and preserving the rule that row-body click stays selection-only while explicit `Open` / `Focus` actions remain the only editor-movement path.`

#### Scope / Constraints Honored
- Kept row-body click as Browser-local selection only.
- Kept `Reveal` graph-scoped by reusing `viewerTargetGraphDocumentId`.
- Kept shared composition read-only from the Browser in this cut.
- Avoided adding any new generic viewer-emphasis state.

#### Summary of Implementation
- Extended `selectBrowserTreeRows` so graph and published-output rows now expose:
  - explicit `Reveal` actions
  - read-only shared-composition participation status for graph rows
  - disabled `Reveal` behavior while shared composition is active
- Added `browserRowActions.ts` as a pure Browser action router so:
  - graph `Reveal` targets its `graphDocumentId`
  - published-output `Reveal` also targets its source `graphDocumentId`
  - viewport `Focus` stays explicit and separate
- Updated `BrowserPanel` to wire `Reveal` through the existing `setViewerTargetGraphDocumentId` path only when shared composition is inactive.
- Closed out the `2.1B` task doc, the umbrella `2.1` doc, and the roadmap lane body to reflect the shipped `2.1A + 2.1B` Browser workspace wave.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/browserRowActions.ts`
- `src/app/panels/browserRowActions.test.ts`
- `docs/Phase-Plans/Tasks/Future/02.1B - SP-VR - Browser, Editor, And Shared Viewer Coordination.md`
- `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Graph rows and published-output rows now show an explicit `Reveal` action in the Browser.
- `Reveal` targets the source graph in single-target viewer mode.
- When shared composition is active, Browser rows show read-only participation status and `Reveal` is disabled instead of mutating composition membership.
- Browser row-body click still selects the row without moving editor focus or changing shared-composition membership.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/browserRowActions.test.ts src/app/panels/selectBrowserGraphRows.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 208 -->
### [208] - 2026-03-12 14:06 - `SP / VR - Lane 2.1B - Browser, Editor, And Shared Viewer Coordination`
HUMAN SUMMARY: `Created the dedicated implementation-ready execution spec for `[2.1B]`, locking explicit `Reveal` as the first Browser-to-viewer entry path, keeping Browser row click selection-only, keeping shared composition read-only from Browser rows, and updating the roadmap so the remaining coordination half of `[2.1]` is now ready to implement.`

#### Scope / Constraints Honored
- Kept this as a docs-only planning/spec pass.
- Kept Browser row click as selection-only.
- Kept Browser-authored shared composition membership changes out of scope.

#### Summary of Implementation
- Added:
  - `docs/Phase-Plans/Tasks/Future/02.1B - SP-VR - Browser, Editor, And Shared Viewer Coordination.md`
- Locked the new `2.1B` spec around:
  - explicit `Reveal`
  - graph-scoped first-pass reveal
  - reuse of `viewerTargetGraphDocumentId`
  - read-only shared-composition status on Browser rows
  - explicit editor movement through existing `Open` / `Focus` actions only
- Updated the umbrella `02.1` doc so it now points at `2.1B` as the next implementation-ready target after shipped `2.1A`.
- Updated roadmap trackers so `[2.1B]` now counts as:
  - `Decision Coverage` complete
  - `Plan.md Status` complete

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.1B - SP-VR - Browser, Editor, And Shared Viewer Coordination.md`
- `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the current `SP` and `VR` planning answers plus the shipped `2.1A` Browser code before writing the `2.1B` spec.
- Confirmed the new `02.1B` execution-spec doc exists in `docs/Phase-Plans/Tasks/Future`.
- Confirmed roadmap tracker rows now show `[2.1B]` as decision-complete with its own dedicated plan doc.

<!-- ENTRY 207 -->
### [207] - 2026-03-12 13:58 - `VR - Lane 2.1A - Browser Workspace Shell And Row Interaction`
HUMAN SUMMARY: `Implemented `[2.1A]` by adding a shared Browser row-shell contract, refactoring `BrowserPanel` so graph rows, published output rows, and viewport rows share one calm row anatomy, and introducing Browser-local row selection that no longer silently moves editor focus or shared-viewer state.`

#### Scope / Constraints Honored
- Kept `2.1A` Browser-local only.
- Left viewer emphasis, editor-focus coordination, and shared-viewer coordination deferred to `[2.1B]`.
- Kept the `Content` branch functionally unchanged in this cut.

#### Summary of Implementation
- Added `selectBrowserTreeRows` as the first shared Browser row-shell selector for:
  - graph-document rows
  - published graph-output rows
  - open viewport rows
- Refactored `BrowserPanel` to render those rows through one shared row shell using:
  - expand affordance
  - type icon
  - label
  - meta/state text
  - right-aligned controls
- Added Browser-local `selectedBrowserRowId` state so row selection is now separate from editor focus.
- Preserved explicit graph actions while moving graph opening/focusing to an explicit `Open` button and viewport focusing to an explicit `Focus` button.
- Added selector coverage proving the new row-shell contract and local selection behavior.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/theme/v15Theme.css`
- `docs/Phase-Plans/Tasks/Future/02.1A - VR - Browser Workspace Shell And Row Interaction.md`
- `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Single-clicking a graph row, published output row, or viewport row now selects that Browser row locally.
- Selecting a Browser row no longer opens/focuses an editor viewport.
- Graph rows now expose explicit `Open`, `Save`, `New Editor`, and `Swap Editor` controls on the row.
- Viewport rows now expose explicit `Focus` and `Close` controls on the row.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/panels/selectBrowserGraphRows.test.ts src/app/panels/selectBrowserTreeRows.test.ts`.
- Ran `npm.cmd run build`.

<!-- ENTRY 206 -->
### [206] - 2026-03-12 13:40 - `VR - Lane 2.1A - Browser Workspace Shell And Row Interaction`
HUMAN SUMMARY: `Created the dedicated implementation-ready execution spec for `[2.1A]`, locking the Browser-local row/workspace-shell cut, the graph-focused first rollout, and the explicit stop line before Browser/editor/shared-viewer coordination so the next Lane `[2]` implementation target is now ready to build.`

#### Scope / Constraints Honored
- Kept this as a docs-only planning/spec pass.
- Locked `2.1A` as Browser-local only.
- Kept viewer emphasis, editor focus movement, and shared-viewer coordination deferred to `[2.1B]`.

#### Summary of Implementation
- Added:
  - `docs/Phase-Plans/Tasks/Future/02.1A - VR - Browser Workspace Shell And Row Interaction.md`
- Locked the new `2.1A` spec around:
  - graph-document rows
  - published graph-output rows
  - open viewport rows
  - one shared row anatomy
  - Browser-local selection and local interaction state
  - preserved explicit row actions without new coordination behavior
- Updated the umbrella `02.1` doc so it now points at `2.1A` as the next implementation-ready target.
- Updated roadmap trackers so `[2.1A]` now counts as:
  - `Decision Coverage` complete
  - `Plan.md Status` complete

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/02.1A - VR - Browser Workspace Shell And Row Interaction.md`
- `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the current Browser planning answers and live Browser seam notes before writing the `2.1A` spec.
- Confirmed the new `02.1A` execution-spec doc exists in `docs/Phase-Plans/Tasks/Future`.
- Confirmed roadmap tracker rows now show `[2.1A]` as decision-complete with its own dedicated plan doc.

<!-- ENTRY 205 -->
### [205] - 2026-03-13 10:48 - `VR / SP - Lane 2.1 - Browser Workspace Shell And Item Interaction`
HUMAN SUMMARY: `Finished the final `ASS#` planning pass for `[2.1]` by locking the shared `VR` and `SP` question surfaces, creating the dedicated `02.1` future task doc, and updating the roadmap so the Browser workspace shell lane now reads as decision-complete with its own plan-doc home before the implementation-spec rewrite.`

#### Scope / Constraints Honored
- Kept this as a docs-only planning pass.
- Locked the shared `VR` and `SP` family question surfaces without jumping ahead into implementation details.
- Created a dedicated future task doc for `[2.1]` without falsely presenting the lane as implementation-ready or shipped.

#### Summary of Implementation
- Confirmed the shared `[2.1]` Browser workspace question surfaces are now fully locked in:
  - `docs/Phase-Plans/08_VR - Phase-Plans.md`
  - `docs/Phase-Plans/11_SP - Phase-Plans.md`
- Created:
  - `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- Seeded the new task doc with:
  - progress checklist
  - purpose and scope
  - source inputs
  - the current locked working read
  - the next implementation-spec rewrite buckets
- Updated roadmap tracker state so `[2.1]` now counts as:
  - `Decision Coverage` complete
  - `Plan.md Status` complete

#### Files Changed
- `docs/Phase-Plans/08_VR - Phase-Plans.md`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Phase-Plans/Tasks/Future/02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the shared `[2.1]` `VR` and `SP` question blocks to confirm they are locked.
- Confirmed the dedicated `02.1` future task doc now exists in `docs/Phase-Plans/Tasks/Future`.
- Confirmed the roadmap trackers now show `[2.1]` as decision-complete with a created plan doc.

<!-- ENTRY 204 -->
### [204] - 2026-03-13 10:06 - `SP - Phase 11 - Graphs Panel And Nested Parts`
HUMAN SUMMARY: `Implemented the first real `SP 11` Browser hierarchy cut by adding expandable `Graph Documents` rows in `BrowserPanel`, deriving one thin published-output child level from each graph's `GraphOutputSurface`, and keeping graph-row state aligned with open/focused editor viewport status without turning the Browser into the full project-content workspace yet.`

#### Scope / Constraints Honored
- Kept `SP 11` focused on the first Browser hierarchy surface rather than deeper project-content nesting.
- Read published child rows from graph-owned output surfaces in `useSpaghettiStore` instead of app-owned project-content state.
- Left richer Browser row controls, build bars, viewer orchestration, and deeper `Assembly / Component / Object / Part` structure deferred.

#### Summary of Implementation
- Added `selectBrowserGraphRows` as the first Browser-facing selector for graph rows plus published graph output child rows.
- Derived graph-row status from:
  - cached graph dirty/saved state
  - active graph focus
  - open editor viewport counts
  - focused viewport ownership
- Derived child rows from each graph document's `GraphOutputSurface.entries`, including visible state/meta for:
  - `resolved`
  - `unresolved`
  - `empty`
- Updated `BrowserPanel` so the `Graphs` branch becomes `Graph Documents` with:
  - expandable graph rows
  - one thin published-output child level
  - preserved `Save`, `New Editor`, and `Swap Editor` actions on graph rows
- Kept Browser expand/collapse state local to the panel while keeping child-row truth graph-owned.
- Updated the `SP 11` family/task docs and roadmap tracker to reflect the shipped phase.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/panels/selectBrowserGraphRows.test.ts`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Phase-Plans/Tasks/Future/01.5 - SP - Phase 11.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The Browser now shows expandable graph-document rows with published graph output children instead of only a flat graph list.
- Graph rows display clearer saved/dirty and open/focused editor state.
- Published output rows are now visible under each graph without pretending they are already full project-owned component/object/part rows.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/panels/selectBrowserGraphRows.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 203 -->
### [203] - 2026-03-12 23:44 - `SP - Phase 12 - Shared Viewport Composition`
HUMAN SUMMARY: `Implemented the first real `SP 12` shared-composition seam by adding runtime-owned shared viewer membership in `useSpaghettiStore`, explicit viewport join/leave controls in `SpaghettiPanel`, and graph-qualified multi-graph preview union rendering in `ViewerHost` so the shared viewer can present more than one graph contribution without using focus as truth.`

#### Scope / Constraints Honored
- Kept `SP 12` focused on viewer/workspace composition rather than Browser ownership or publish/receive meaning.
- Used graph documents as the first-pass composition unit and explicit viewport actions as the first authoring path.
- Preserved the existing single `viewerTargetGraphDocumentId` behavior as the fallback when no shared composition session exists.

#### Summary of Implementation
- Added runtime-only `sharedViewerComposition` state in `useSpaghettiStore` with explicit:
  - `addEditorViewportGraphToSharedViewerComposition`
  - `removeEditorViewportGraphFromSharedViewerComposition`
- Kept composition membership graph-document-based even though the authoring entry path comes from editor viewports, so focus and viewport rebinding do not silently redefine composition truth.
- Added `selectSharedPreviewRenderVm` to merge more than one graph preview contribution into one shared viewer render list.
- Qualified shared viewer identities with `graphDocumentId` so same-slot preview outputs from different graphs do not collide in the viewer.
- Updated `ViewerHost` to:
  - render the resolved union when a shared composition session exists
  - fall back to the existing single viewer-target path otherwise
- Updated `SpaghettiPanel` with first-pass shared composition membership controls and status cues.
- Updated the `SP 12` family/task docs and roadmap tracker to reflect the shipped phase.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Phase-Plans/Tasks/Future/01.6 - SP - Phase 12.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The shared viewer can now intentionally present resolved preview contributions from more than one graph document at the same time.
- Shared composition membership is now explicit and stable across focus changes instead of being inferred from the currently focused viewport.
- Two graphs with the same preview slot ids can now coexist in one shared viewer composition without clobbering each other.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 202 -->
### [202] - 2026-03-12 22:32 - `GE - Phase 12C - Cross-Graph Ownership Rules`
HUMAN SUMMARY: `Implemented the first real `12C` cross-graph ownership seam by persisting graph-authored receive references on graph documents, resolving them against explicit published-output ids in `useSpaghettiStore`, and deriving first-pass linked/unresolved receive components in `useAppStore` without falling back to active-graph or viewer-target singleton state.`

#### Scope / Constraints Honored
- Kept `12C` focused on cross-graph ownership rules and one minimal linked receive path.
- Left `Hard Copy`, richer Browser hierarchy, and later `Publish / Receive Execution` workflow work deferred.
- Preserved source-graph publication ownership while keeping receive intent graph-authored and project composition downstream.

#### Summary of Implementation
- Extended the graph document/schema contract with first-pass `receiveReferences`.
- Added explicit graph-targeted receive authoring methods in `useSpaghettiStore`:
  - `addGraphReceiveReference`
  - `removeGraphReceiveReference`
- Added selector-owned receive resolution by:
  - `sourceGraphDocumentId`
  - `sourceOutputEntryId`
- Kept linked receive resolution deterministic and independent of:
  - active graph
  - viewer target
  - focused viewport
  - graph labels or graph order
- Extended `useAppStore` project content derivation so linked receive references produce project-owned receive-link components with explicit resolved/unresolved state.
- Updated the `12C` task doc and roadmap tracker to reflect the shipped phase.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `src/app/io/graphDocumentPersistence.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.4C - GE - Phase 12C.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Graph documents can now persist explicit linked receive declarations that point at another graph's published output entry.
- Project content now surfaces linked cross-graph receive components and keeps missing source publications visible as unresolved instead of silently dropping them.
- Cross-graph receive resolution is now id-based rather than inferred from UI focus state.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/spaghetti/schema/spaghettiSchema.test.ts src/app/io/graphDocumentPersistence.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/store/useAppStore.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 201 -->
### [201] - 2026-03-11 20:56 - `GE - Phase 12B - Project Content Tree Ownership`
HUMAN SUMMARY: `Implemented the first real project-content layer above graph-owned publication by adding app-owned root-assembly and component records in \`useAppStore\`, deriving those components from resolved graph output entries, and exposing a thin Browser content surface that reads project-owned composition instead of only graph/cached-graph state.`

#### Scope / Constraints Honored
- Kept `12B` focused on project content tree ownership and a thin Browser read surface.
- Left graph-owned publication truth in `useSpaghettiStore`.
- Deferred deeper `Object / Part` hierarchy, Browser UX polish, and cross-graph `Publish / Receive` rules.

#### Summary of Implementation
- Added first-pass project content types and state to `useAppStore`:
  - `ProjectAssemblyRecord`
  - `ProjectComponentRecord`
  - `ProjectContentState`
- Added one real root assembly record behind `currentProject.rootAssemblyId`.
- Derived project-owned component records from resolved graph output entries while preserving source references back to:
  - `sourceGraphDocumentId`
  - `sourceOutputEntryId`
- Added selectors for:
  - current project content
  - root assembly
  - root components
  - Browser-facing project-content rows
- Updated `BrowserPanel` to render a thin `Content` section showing:
  - `Assembly Root`
  - derived `Component` rows
- Tightened the `12B` docs to match the shipped cut:
  - resolved outputs only
  - project content as first-pass project-owned runtime composition state
- Updated the GE family doc and roadmap lane body so `12B` now reads as implemented.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/BrowserPanel.tsx`
- `docs/Phase-Plans/Tasks/Future/01.4b - GE - Phase 12b.md`
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The app now owns a first-pass project content tree above graph-owned output surfaces.
- `rootAssemblyId` now points to one real root assembly record instead of staying as a nullable symbolic anchor.
- Resolved graph output entries now lift into project-owned component records that Browser surfaces can read without reconstructing project composition from graph/editor state.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/store/useAppStore.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 200 -->
### [200] - 2026-03-11 18:10 - `DOC - GE Phase 12B Task Doc Rewrite`
HUMAN SUMMARY: `Reworked the `GE - Phase 12B - Project Content Tree Ownership` task doc from a placeholder shell into a decision-complete implementation spec, and updated the roadmap tracker so `[1.4B]` now counts as having a real phase doc.`

#### Scope / Constraints Honored
- Updated docs only.
- Kept `12B` focused on project content tree ownership, minimal Browser read surface, and the graph-versus-project composition cut.
- Deferred cross-graph rules, deeper Browser hierarchy, and richer Browser/workspace behavior to later phases.

#### Summary of Implementation
- Rewrote `docs/Phase-Plans/Tasks/Old/01.4b - GE - Phase 12b.md` into a real execution spec.
- Locked the first-pass `12B` decisions, including:
  - one real root assembly record behind `rootAssemblyId`
  - one project-owned component per graph output entry
  - project content ownership in `useAppStore`
  - graph output ownership staying in `useSpaghettiStore`
  - a minimal `Assembly Root -> Component` Browser read surface
- Replaced placeholder sections with a real:
  - problem statement
  - direction
  - first-pass type contract
  - seam findings
  - deferred boundary
  - proof bar
- Updated `docs/Human-Plans/roadmap/roadmap.md` so `[1.4B]` now shows `Plan.md Status` as created in both the tracker section and the dedicated-plan checklist.

#### Files Changed
- `docs/Phase-Plans/Tasks/Old/01.4b - GE - Phase 12b.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the rewritten `12B` task doc to confirm it now matches the decision-complete execution-spec style used by the other active phase docs.
- Confirmed the roadmap tracker now marks `[1.4B]` as having a created task doc while parent `[1.4]` remains open.

<!-- ENTRY 199 -->
### [199] - 2026-03-11 18:02 - `DOC - GE Phase 12B Old Task Doc Skeleton`
HUMAN SUMMARY: `Created the old-task-doc format skeleton for `GE - Phase 12B - Project Content Tree Ownership`, so there is now a matching `01.4B` execution-doc shell ready to be filled in from the family-level `12B` answers.`

#### Scope / Constraints Honored
- Updated docs only.
- Created a format/setup skeleton rather than a filled implementation spec.
- Kept the new file aligned with the current old-task-doc structure used by nearby phase docs.

#### Summary of Implementation
- Added `docs/Phase-Plans/Tasks/Old/01.4b - GE - Phase 12b.md`.
- Set up the standard task-doc sections:
  - `Progress CheckList`
  - `Doc Header`
  - `Purpose`
  - `Scope`
  - `Refactor Rule For This Phase`
  - `Source Inputs`
  - `Arch Spec`
- Seeded `12B`-specific placeholder buckets for:
  - first-pass content tree shape
  - first-pass `Component` meaning
  - graph-owned versus project-owned authority
  - deferred work
  - proof bar

#### Files Changed
- `docs/Phase-Plans/Tasks/Old/01.4b - GE - Phase 12b.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the new file to confirm it matches the structure pattern used by the neighboring old task docs while staying as a setup skeleton instead of a filled spec.

<!-- ENTRY 198 -->
### [198] - 2026-03-11 17:56 - `DOC - GE Phase 12B Component Granularity Note`
HUMAN SUMMARY: `Added a short caution note under the `GE - Phase 12B` `Component` suggestion so the family doc now explicitly warns against hard-locking one-component-per-graph granularity too early before later output-structure work clarifies final grouping.`

#### Scope / Constraints Honored
- Updated docs only.
- Kept the note local to the `12B` section instead of rewriting the whole family answer set.
- Preserved the existing `12B` direction while making the `Component` wording safer for later output-structure growth.

#### Summary of Implementation
- Added a new doc-history entry to `docs/Phase-Plans/01_GE - Phase-Plans.md`.
- Added a `Granularity caution` note under the `12B Q2` suggested answer.
- Explicitly warned against prematurely hard-locking:
  - exactly one component per graph
- Added safer first-pass wording that keeps `Component` defined as the first project-owned bundle created from graph-published output.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the `12B Q2` section in `docs/Phase-Plans/01_GE - Phase-Plans.md` to confirm the new caution sits directly under the `Component` suggested answer and keeps the family doc aligned with later output-structure flexibility.

<!-- ENTRY 197 -->
### [197] - 2026-03-11 17:52 - `DOC - GE Phase 12B Suggested Answers`
HUMAN SUMMARY: `Added first-pass suggested answers to the GE family doc for `GE - Phase 12B` questions `Q1` through `Q4`, so the project-content ownership planning surface now carries a concrete proposal before those answers are formally locked.`

#### Scope / Constraints Honored
- Updated docs only.
- Added suggestions without converting the `12B` questions into locked family decisions.
- Kept the proposed `12B` boundary focused on ownership and containment rather than Browser UX or richer output-structure work.

#### Summary of Implementation
- Added a new doc-history entry to `docs/Phase-Plans/01_GE - Phase-Plans.md`.
- Added suggested-answer text under `GE - Phase 12B`:
  - `Q1` minimum project content tree shape
  - `Q2` first-pass `Component` meaning
  - `Q3` graph-versus-project parenting authority
  - `Q4` explicit out-of-scope boundary for later Browser/workspace lanes
- Kept the first-pass tree small and aligned to `Project File -> Assembly Root -> Component`.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Reviewed the new `12B` suggestions to confirm they stay inside `GE - Phase 12B` ownership work and do not pull in later Browser UX, viewer workspace controls, or final Browser-facing output structure.

<!-- ENTRY 196 -->
### [196] - 2026-03-11 17:46 - `DOC - GE Phase 12A Left-Out Boundary Note`
HUMAN SUMMARY: `Added a short `What 12A Left Out` carry-forward block to the GE family doc so the work intentionally deferred out of the shipped `12A` cut is visible directly next to the locked `12A` answers.`

#### Scope / Constraints Honored
- Updated docs only.
- Kept the note inside the GE family phase doc rather than reopening the dedicated `12A` task doc.
- Preserved the existing phase split where `12B` owns content-tree work and `12C` owns cross-graph rules.

#### Summary of Implementation
- Added a new doc-history entry to `docs/Phase-Plans/01_GE - Phase-Plans.md`.
- Added a `What 12A Left Out` section under the `GE - Phase 12` family body.
- Listed the intentionally deferred items, including:
  - project-file persistence
  - content-tree ownership beyond nullable `rootAssemblyId`
  - Browser hierarchy/workspace growth
  - cross-graph `Publish / Receive`
  - `Link` versus `Hard Copy`
  - project-owned reference assets
- Added a short carry-forward rule pointing that deferred work to `12B`, `12C`, and later `SP` / `AS` / `VR` phases.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Re-read the `GE - Phase 12` family section to confirm the new carry-forward block sits after the locked `12A` answers and before the open `12B` / `12C` question surfaces.

<!-- ENTRY 195 -->
### [195] - 2026-03-11 17:40 - `GE - Phase 12A - Project File Core And Graph Collection Ownership`
HUMAN SUMMARY: `Implemented the first real in-memory project-above-graphs model by adding `ProjectFile` ownership to `useAppStore`, mirroring project graph membership from spaghetti graph documents, and rerouting graph-aware spaghetti builds to the real current project id instead of the fake legacy runtime project id.`

#### Scope / Constraints Honored
- Added the first `12A` implementation without pulling in project-file disk persistence.
- Kept `useAppStore` as the project owner and left `useSpaghettiStore` as the graph/editor/runtime owner.
- Deferred content-tree ownership and cross-graph `Publish / Receive` rules to later phases.

#### Summary of Implementation
- Added a first-pass `ProjectFile` and `ProjectGraphDocumentEntry` model to `useAppStore`.
- Added app-store selectors for current project, current project id, and current project graph membership.
- Mirrored project graph membership from spaghetti graph-document order/name changes without deriving membership from viewport or viewer-target state.
- Updated graph-aware build requests to route through the real current `projectFileId`.
- Rejected wrong-project spaghetti build results at the app-store boundary.
- Added targeted app-store tests covering:
  - current project shape
  - project graph membership independence from viewport/viewer state
  - project membership updates after file load
  - graph-aware routing identity using the real project id
- Updated the `12A` task doc, GE family doc, and roadmap lane-body status to reflect shipped implementation.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.4A - GE - Phase 12A.md`
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- Spaghetti graph-aware build requests now use the current project id from app-owned project state.
- The app now has one explicit current `ProjectFile` with graph membership/order that is separate from editor viewport and viewer-target state.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/store/useAppStore.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 194 -->
### [194] - 2026-03-11 17:18 - `DOC - GE Phase 12A Task Doc Creation`
HUMAN SUMMARY: `Created the dedicated `GE - Phase 12A - Project File Core And Graph Collection Ownership` task doc as an implementation-ready execution spec, and updated the roadmap tracker so `[1.4A]` now counts as having a real phase doc.`

#### Scope / Constraints Honored
- Updated docs only.
- Kept `12A` explicitly scoped to in-memory project ownership and graph collection ownership.
- Deferred project-file persistence, content tree ownership, and cross-graph rules to later phases.

#### Summary of Implementation
- Added `docs/Phase-Plans/Tasks/Future/01.4A - GE - Phase 12A.md`.
- Locked the first-pass `ProjectFile` contract, `useAppStore` ownership cut, project-versus-runtime boundary, and the routing change from `LEGACY_RUNTIME_PROJECT_FILE_ID` to the real current project id inside the new task doc.
- Updated `docs/Human-Plans/roadmap/roadmap.md` so `[1.4A]` now shows `Plan.md Status` as created in both the tracker section and the dedicated-plan checklist.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.4A - GE - Phase 12A.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Reviewed the new `12A` task doc to confirm it matches the current execution-spec structure used by `11A` and `10C`.
- Confirmed the roadmap tracker now marks `[1.4A]` as having a created task doc while leaving parent `[1.4]` open.

<!-- ENTRY 193 -->
### [193] - 2026-03-11 17:08 - `DOC - GE Phase 12A Suggested Answers`
HUMAN SUMMARY: `Added first-pass suggested answers to the GE family doc for `GE - Phase 12A` questions `Q1` through `Q3`, so the project-file and graph-ownership planning surface now carries a concrete proposal before those answers are formally locked.`

#### Scope / Constraints Honored
- Updated docs only.
- Added suggestions without converting the `12A` questions into locked family decisions.
- Kept the proposed boundary aligned with the current roadmap split between project ownership and runtime/editor/viewer state.

#### Summary of Implementation
- Added a new doc-history entry to `docs/Phase-Plans/01_GE - Phase-Plans.md`.
- Added suggested-answer text under `GE - Phase 12A`:
  - `Q1` minimum `ProjectFile` shape
  - `Q2` project-owned graph collection scope
  - `Q3` durable project data versus runtime-only state boundary
- Included a first-pass TypeScript shape for `ProjectFile` and `ProjectGraphDocumentEntry`.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Reviewed the `12A` suggestions to confirm they stay inside `GE - Phase 12A` ownership work and do not pull in later Browser hierarchy or richer workspace-state responsibilities.

<!-- ENTRY 192 -->
### [192] - 2026-03-11 17:02 - `DOC - GE Phase 12 Family Question Setup`
HUMAN SUMMARY: `Expanded the GE family doc's future `GE - Phase 12 - Multi-Document Graph Ownership` section into a real planning surface with explicit open questions for `12A`, `12B`, and `12C`, so the next task docs can be defined against concrete ownership decisions instead of only a placeholder summary.`

#### Scope / Constraints Honored
- Updated docs only.
- Kept `GE - Phase 12` in a planning/question state rather than pretending answers are already locked.
- Preserved the roadmap boundary where Browser workspace polish and richer output structure stay in later `SP` / `AS` / `VR` phases.

#### Summary of Implementation
- Added a new doc-history entry to `docs/Phase-Plans/01_GE - Phase-Plans.md`.
- Expanded the `GE - Phase 12` notes to show current planning state.
- Added a family-level `12A` / `12B` / `12C` question surface covering:
  - minimum `Project File` shape
  - graph collection ownership
  - project content tree boundaries
  - `Component` meaning
  - assembly/object parenting authority
  - `publish / receive`
  - `Link` versus `Hard Copy`
  - cross-graph identity requirements
  - singleton assumptions that must be broken later
- Replaced the old flat `Phase 12` checklist with grouped checklist buckets aligned to the future subphases.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Verification Steps
- Reviewed the new `GE - Phase 12` section to confirm the open questions line up with roadmap subphases `[1.4A]`, `[1.4B]`, and `[1.4C]`.
- Confirmed the checklist now reflects the same `12A` / `12B` / `12C` split instead of one flat placeholder list.

<!-- ENTRY 191 -->
### [191] - 2026-03-11 16:34 - `DOC - Roadmap GE11 Completion Sync`
HUMAN SUMMARY: Updated the roadmap lane-body status for `GE - Phase 11 - Graph Persistence And Save Load` to complete, because the shipped `11A`, `11B`, and `11C` subphases now fully cover that lane-body work even though there is still no separate umbrella `1.2` task doc.

#### Scope / Constraints Honored
- Updated docs only.
- Changed the lane-body completion state without altering the parent `[1.2]` `Plan.md Status` tracker.
- Kept the distinction between “implemented phase” and “separate umbrella task doc exists.”

#### Summary of Implementation
- Marked `### [1.2]` as `[x]` in the roadmap lane body.
- Marked the lane-body `GE - Phase 11` checklist items complete.
- Added a roadmap doc-history note explaining why the lane body is now complete while the parent `Plan.md Status` remains open.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only roadmap status sync.

#### Verification Steps
- Re-read the `GE - Phase 11` lane-body section in `docs/Human-Plans/roadmap/roadmap.md`.
- Confirmed `11A`, `11B`, and `11C` are all shipped while the parent `[1.2]` `Plan.md Status` tracker remains separate.

<!-- ENTRY 190 -->
### [190] - 2026-03-11 16:28 - `VM - Phase 15 - Browser Open Viewports Stable Order`
HUMAN SUMMARY: Kept the Browser panel's `Open Viewports` list in stable viewport-order instead of re-sorting the focused viewport to the top, so focus is now communicated by highlight without the list jumping around.

#### Scope / Constraints Honored
- Kept the change limited to Browser-panel viewport list rendering.
- Did not change viewport focus, z-order, or close behavior.
- Left the existing focused-row highlight behavior intact.

#### Summary of Implementation
- Removed the local `zOrder` sort from the `Open Viewports` render path in `BrowserPanel.tsx`.
- The panel now renders viewports in the existing `editorViewportOrder` sequence and only uses the focused-row styling/meta to indicate focus.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes
- The focused viewport no longer jumps to the top of the Browser panel's `Open Viewports` list.
- The list order stays stable while the focused viewport remains visibly highlighted.

#### Verification Steps
- Re-read the `Open Viewports` render path in `src/app/panels/BrowserPanel.tsx`.
- Confirmed the local `zOrder` sort is removed and the focused-row styling still applies.

<!-- ENTRY 189 -->
### [189] - 2026-03-11 16:21 - `SP - Phase 10C - Graph Output Handoff Surface`
HUMAN SUMMARY: Implemented the first graph-owned output handoff seam for spaghetti by adding published output surfaces to graph runtime state, exposing output-surface selectors, and rerouting the current parts-list and debug output readers so they consume one canonical graph-owned declaration surface instead of rebuilding publication meaning independently.

#### Scope / Constraints Honored
- Implemented `10C` only.
- Kept authored `OutputPreview` node params as the source of declaration truth.
- Kept the shared viewer on the `10B` viewer-target path instead of turning viewer presentation into publication truth.
- Kept Browser hierarchy, project ownership, and richer `AS` output structure out of scope.

#### Summary of Implementation
- Added a new spaghetti output-surface module defining the first-pass `GraphOutputSurface` and `GraphPublishedOutputEntry` contract plus derivation logic from preview preparation and accepted graph-local build outputs.
- Expanded `useSpaghettiStore` graph runtime state so each graph document now owns a derived published output surface alongside compile/build and preview runtime memory.
- Added graph-output-surface selectors, including graph-by-id and viewer-target variants.
- Rerouted the spaghetti parts-list panel path to consume the graph-owned output surface through new output-surface-backed selectors.
- Updated the debug inspector path so the `OutputPreview` section now reads graph-owned output entry state directly while keeping preview-render/viewer sections on the existing viewer/render path.
- Added targeted tests proving graph-owned output-surface isolation, slot-state derivation, and output-surface-backed selector behavior.
- Refreshed the `10C` task doc, the `SP` family phase doc, and the roadmap lane-body status to reflect shipped implementation.

#### Files Changed
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/spaghetti/partsList/selectPartsListItems.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.ts`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.test.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.3C - SP - Phase 10C.md`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- In spaghetti mode, the parts list and debug inspector now read graph-owned published output state instead of reconstructing `OutputPreview` publication meaning independently.
- Each graph document now tracks a first-pass published output surface with explicit `empty`, `unresolved`, and `resolved` slot states.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/partsList/selectPartsListItems.test.ts src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- Ran `npm.cmd run build`

<!-- ENTRY 188 -->
### [188] - 2026-03-11 13:43 - `DOC - SP Phase 10C Task Doc Setup`
HUMAN SUMMARY: Created the dedicated `01.3C` task doc as the implementation-ready execution spec for graph-owned output handoff, then synced the roadmap tracker so `[1.3C]` now counts as having a dedicated plan doc.

#### Scope / Constraints Honored
- Updated docs only.
- Kept the new task doc focused on `10C` output declaration / handoff.
- Left later Browser hierarchy, project ownership, and richer output structure explicitly out of scope.

#### Summary of Implementation
- Added `docs/Phase-Plans/Tasks/Future/01.3C - SP - Phase 10C.md`.
- Wrote the new task doc in the same execution-spec shape used by `10A` and `10B`.
- Grounded the doc in the live `10C` seams across `useSpaghettiStore`, `previewPreparation`, output-facing selectors, debug surfaces, and `ViewerHost`.
- Locked the first-pass `GraphOutputSurface` contract, authored-versus-published ownership split, current seam cut, implementation order, and proof bar.
- Updated `docs/Human-Plans/roadmap/roadmap.md` so `[1.3C]` now shows `Plan.md Status` as created and the dedicated-doc totals reflect the new task doc.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.3C - SP - Phase 10C.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only planning update.

#### Verification Steps
- Re-read the new `01.3C` task doc to confirm it matches the `10A` / `10B` execution-spec shape.
- Re-read the roadmap tracker to confirm `[1.3C]` now shows `Plan.md Status` as created and the dedicated-doc totals increment accordingly.

<!-- ENTRY 187 -->
### [187] - 2026-03-11 13:31 - `DOC - SP Phase 10C Answer Lock`
HUMAN SUMMARY: Locked the `SP - Phase 10C` family-doc answers so the output-handoff planning surface now reflects a graph-owned published output seam, authored-versus-published ownership split, explicit slot-state rules, and a narrow phase boundary aligned to the vision roadmap.

- updated `docs/Phase-Plans/11_SP - Phase-Plans.md`
- converted `10C.Q1` through `10C.Q7` from open questions into locked first-pass answers
- kept the `10C` wording graph-owned and handoff-focused so it does not drift into later Browser or project hierarchy work

<!-- ============================================================ -->
### [186] - 2026-03-11 13:15 - `DOC - Vision Roadmap Phase Label Pass`
<!-- ============================================================ -->
HUMAN SUMMARY: `Normalized the rough phase list inside the vision roadmap so every lane entry now shows an explicit prefix-and-phase label, reusing real canonical ids where they already exist and marking the remaining unassigned items with visible `Phase TBD` placeholders.`  

#### Scope / Constraints Honored
- Updated docs only.
- Kept the work inside the vision roadmap draft rather than promoting placeholder labels into the canonical execution roadmap.
- Reused existing canonical family/phase ids where the phase setup and roadmap already support them.

#### Summary of Implementation
- Added a short `Phase TBD` note to the `Vision-Completion Draft` section.
- Updated all rough phase entries so they now read with explicit prefix-and-phase labels.
- Used existing canonical labels where already supported, including:
  - `SP - Phase 9`
  - `SP - Phase 10`
  - `SP - Phase 10C`
  - `SP - Phase 11`
  - `GE - Phase 11`
  - `GE - Phase 12`
  - `AS - Phase 5`
  - `AS - Phase 6`
  - `VR - Phase 5`
  - `VR - Phase 6`
  - `JK - Phase 2`
  - `EX - Phase 2 / 3 / 4 / 5`
- Marked the still-unassigned vision-draft items with explicit `Phase TBD` labels so missing canonical ownership is easy to spot.

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only planning clarity update.

#### Verification Steps
- Re-read the `Vision-Completion Draft` phase lists in `docs/Human-Plans/roadmap/Vision-roadmap.md`
- Confirmed that every phase line now shows either:
  - a concrete prefix-and-phase id
  - or a visible `Phase TBD` placeholder

<!-- ============================================================ -->
### [185] - 2026-03-11 13:11 - `DOC - Vision Roadmap Clarity Pass`
<!-- ============================================================ -->
HUMAN SUMMARY: `Tightened the vision roadmap with a compact core data-flow section, sharper `OutputPreview` wording, an explicit Lane `[1]` finish condition, a clearer `Tier 1` versus `Tier 2` distance read, and a lightweight contracts/IR note so the north-star doc is easier to use without becoming overly implementation-heavy.`  

#### Scope / Constraints Honored
- Updated docs only.
- Kept the changes inside the vision roadmap rather than moving them into the execution roadmap.
- Added the requested clarity improvements without turning the file into a detailed implementation spec.

#### Summary of Implementation
- Added a new `Core Data Flow` section showing the intended top-level truth flow:
  - `GraphDocument -> Compile / Evaluate -> Graph Runtime Memory -> Graph Output Declaration -> Project Composition -> Viewer Presentation`
- Strengthened the `OutputPreview` wording so it now reads as the first pass of the graph-owned output declaration surface.
- Added an explicit done-condition line for Lane `[1]`.
- Split the rough distance read into:
  - `Tier 1 - First real graph-native app`
  - `Tier 2 - Vision-complete studio`
- Added a short `Contracts / Schema / IR Discipline` section as a cross-cutting architecture rule instead of a new full top-level pillar.

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only vision-roadmap clarity update.

#### Verification Steps
- Re-read the updated sections in `docs/Human-Plans/roadmap/Vision-roadmap.md`:
  - `Core Data Flow`
  - `Explicit Output Handoff`
  - `Contracts / Schema / IR Discipline`
  - `Lane [1]`
  - `Rough Read On Distance Remaining`

<!-- ============================================================ -->
### [184] - 2026-03-11 12:43 - `DOC - Vision Roadmap Full Lane Draft`
<!-- ============================================================ -->
HUMAN SUMMARY: `Expanded the vision roadmap with a rough first-pass lane-and-phase completion draft so the north-star doc now shows the major work groups still needed to reach the full product vision, including Browser ownership, node/wire hardening, part/feature growth, graph-native build contracts, Jake mode, and final cleanup.`  

#### Scope / Constraints Honored
- Updated docs only.
- Kept the new content in the vision roadmap instead of turning the execution roadmap into a second product-vision doc.
- Treated the added lane map as a rough first draft rather than locked canonical sequencing.

#### Summary of Implementation
- Added a new `Vision-Completion Draft` section to `docs/Human-Plans/roadmap/Vision-roadmap.md`.
- Broke the full long-range product into six rough lanes:
  - graph-native foundation and ownership
  - node/wire/driver/authoring hardening
  - Browser workspace and project content structure
  - graph-native build/geometry/assembly/export
  - product modes and simplified editing
  - ecosystem/polish/final replacement
- Added a rough distance read distinguishing:
  - the smaller set of work likely needed for a first coherent graph-native working app
  - the larger set of work likely needed for the fuller long-range vision

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only vision-planning update.

#### Verification Steps
- Re-read the updated `Vision-Completion Draft` section in `docs/Human-Plans/roadmap/Vision-roadmap.md`
- Confirmed the new section stays:
  - broader than `roadmap.md`
  - compatible with the current roadmap direction
  - explicit about node/wire/part work in addition to Browser/ownership work

<!-- ============================================================ -->
### [183] - 2026-03-11 12:34 - `DOC - Vision Roadmap Decision Compass`
<!-- ============================================================ -->
HUMAN SUMMARY: `Rebuilt the vision roadmap into a canonical big-picture decision-check doc so product and architecture direction now lives in one stable north-star surface above the execution roadmap and phase-task planning.`  

#### Scope / Constraints Honored
- Updated docs only.
- Reused the current roadmap direction instead of inventing a competing product vision.
- Kept the new file focused on big-picture direction, guardrails, and decision filtering rather than execution sequencing.

#### Summary of Implementation
- Replaced the old loose vision-roadmap draft with a structured canonical doc using the current docs format.
- Added explicit sections for:
  - north star
  - product vision
  - architecture guardrails
  - desired end state
  - decision filters
  - early-phase guardrails
  - long-range pillars
  - quick decision questions
- Positioned the doc as the place to check future Codex decision questions against the intended destination while `roadmap.md` stays focused on execution order.

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only planning and direction update.

#### Verification Steps
- Re-read `docs/Human-Plans/roadmap/Vision-roadmap.md` to confirm it now functions as:
  - a big-picture product/architecture compass
  - a decision-check surface
  - a non-duplicative companion to `docs/Human-Plans/roadmap/roadmap.md`

<!-- ============================================================ -->
### [182] - 2026-03-11 12:28 - `DOC - Roadmap Checklist Sync After Family Alignment`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the roadmap checklist markers and totals so the tracker now counts `SP - Phase 11` and the later `AS`/`VR` carry-forward phases as roadmap-broken-down entries after the family phase-plan alignment pass, while still leaving decision coverage and task-doc status unchecked.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept the change limited to roadmap checklist markers and totals.
- Did not falsely mark later carry-forward phases as decision-complete or task-doc-ready.

#### Summary of Implementation
- Marked `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts` as roadmap-broken-down now that it has a real family planning surface.
- Marked `[2.1]` through `[2.5]` as roadmap-broken-down now that the later Browser/output/workspace carry-forward phases have explicit roadmap bodies and aligned family-doc homes.
- Left `Decision Coverage` and `Plan.md Status` unchecked for those later phases.
- Recomputed the roadmap breakdown totals from `16 / 11` to `22 / 5`.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only roadmap tracker update.

#### Verification Steps
- Reviewed the checklist marker sections and totals in `docs/Human-Plans/roadmap/roadmap.md`

<!-- ============================================================ -->
### [181] - 2026-03-11 12:25 - `DOC - Phase Plans Carry-Forward Phase Alignment`
<!-- ============================================================ -->
HUMAN SUMMARY: `Aligned the canonical phase-plan family docs with the newer roadmap carry-forward by renaming the future \`AS\` and \`VR\` phases to their current Browser/output/workspace homes and adding the missing future \`GE - Phase 12\` family section.`

#### Scope / Constraints Honored
- Updated planning/setup docs only.
- Kept the changes focused on canonical future phase naming and family-doc alignment.
- Reused the roadmap carry-forward direction instead of inventing new phase families.

#### Summary of Implementation
- Updated `00_Phase-Setup.md` so the canonical future phase ladder now uses:
  - `AS - Phase 5 - Browser-Facing Graph Output Structure`
  - `AS - Phase 6 - Project Content Inspection And Build Control Surface`
  - `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
  - `VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`
- Reworked the `AS` family placeholders so `Phase 5` and `Phase 6` now describe the later Browser-facing output/content structure and build-control surfaces that the roadmap carries forward from `SP - Phase 11`.
- Reworked the `VR` family placeholders so `Phase 5` and `Phase 6` now describe the later reference/workspace layering and richer Browser/viewer controls that were intentionally deferred out of the first Browser pass.
- Added the missing `GE - Phase 12 - Multi-Document Graph Ownership` section to the `GE` family doc so the later project-file, graph-document, and project-content ownership work now has a real family-level home instead of existing only in `00_Phase-Setup.md` and the roadmap.

#### Files Changed
- `docs/Phase-Plans/00_Phase-Setup.md`
- `docs/Phase-Plans/07_AS - Phase-Plans.md`
- `docs/Phase-Plans/08_VR - Phase-Plans.md`
- `docs/Phase-Plans/01_GE - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only phase-plan alignment update.

#### Verification Steps
- Reviewed the updated future phase ladders in:
  - `docs/Phase-Plans/00_Phase-Setup.md`
  - `docs/Phase-Plans/07_AS - Phase-Plans.md`
  - `docs/Phase-Plans/08_VR - Phase-Plans.md`
  - `docs/Phase-Plans/01_GE - Phase-Plans.md`

<!-- ============================================================ -->
### [180] - 2026-03-11 12:19 - `SP - Phase 11 - Q6 Carry-Forward Note`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a concrete carry-forward note under \`SP - Phase 11 Q6\` so the family doc now records what the existing history and roadmap already established about the first Browser-pass boundary and what still remains to be locked before that out-of-scope answer is final.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept the change focused on `SP - Phase 11 Q6`.
- Did not prematurely mark `Q6` resolved.

#### Summary of Implementation
- Expanded the `Q6` working notes in `11_SP - Phase-Plans.md` to summarize what the current tracked history already established:
  - `SP - Phase 11` is still only a planning surface
  - the roadmap already carries a defer map into later Browser workspace, output-structure, build-control, visibility/material, and workspace-presentation phases
  - the answered `Q2` through `Q5` items already narrowed the first pass to a graph-document tree with simple open/focus behavior
- Added a short “what is still left to lock” list so `Q6` now shows the remaining out-of-scope boundary work instead of only saying `pending`.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only planning clarification.

#### Verification Steps
- Reviewed `SP - Phase 11 Q6` in `docs/Phase-Plans/11_SP - Phase-Plans.md`

<!-- ============================================================ -->
### [179] - 2026-03-11 12:16 - `SP - Phase 10B - Family Doc Cleanup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Cleaned the SP family phase doc so \`10B\` now appears only once as the canonical answered question block, removing the stale lower duplicate draft section that was still making \`10B\` look partially open.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept the cleanup focused on the `SP - Phase 10` family doc.
- Preserved the live answered `10B` block and the active `10C` question block.

#### Summary of Implementation
- Added a new family-doc history note explaining the cleanup.
- Removed the stale lower duplicate `10B` draft question block from `11_SP - Phase-Plans.md`.
- Cleared the stray leftover bullets from that removed draft so the file now reads with one canonical answered `10B` section followed by the active `10C` planning surface.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only cleanup.

#### Verification Steps
- Reviewed the `SP - Phase 10` section in `docs/Phase-Plans/11_SP - Phase-Plans.md` to confirm that `10B` appears only as the answered `10B.Q1` through `10B.Q6` block and no duplicate lower `10B` draft remains.

<!-- ============================================================ -->
### [178] - 2026-03-11 12:10 - `SP - Phase 10 - Question Label Normalization`
<!-- ============================================================ -->
HUMAN SUMMARY: `Normalized the remaining \`10B / 10C\` question labels in the SP family phase doc so the live and archived \`Phase 10\` question blocks now carry explicit subphase ids instead of ambiguous generic \`Q1 / Q2 / Q3\` markers.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept the change focused on `SP - Phase 10` question labeling clarity.
- Preserved the older draft block as history instead of deleting it.

#### Summary of Implementation
- Added a new family-doc history note explaining the label normalization.
- Marked the old lower `10B` question block as an archived draft and relabeled its checklist and headings to `10B.Draft.Q1` through `10B.Draft.Q5`.
- Left the live `10B.Q1` through `10B.Q6` block and the new `10C.Q1` through `10C.Q7` block as the canonical active question surfaces.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only clarity update.

#### Verification Steps
- Reviewed the `SP - Phase 10` sections in `docs/Phase-Plans/11_SP - Phase-Plans.md` to confirm that the live `10B` and `10C` questions are explicitly labeled and the older duplicate `10B` block is clearly marked as archived.

<!-- ============================================================ -->
### [177] - 2026-03-11 12:03 - `SP - Phase 10C - Family Question Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a dedicated \`10C\` question block to the SP family phase doc so the remaining output-declaration and graph-output handoff decisions now have their own implementation-prep surface before a dedicated \`10C\` task doc is created.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept the new questions scoped to `10C` output declaration and handoff semantics.
- Did not reopen completed `10A` routing or completed `10B` graph-local runtime ownership.

#### Summary of Implementation
- Added a `10C` checklist with seven open decision questions covering:
  - first-pass graph-owned output declaration shape
  - authored `OutputPreview` truth versus derived published output surface
  - published row identity
  - empty/unresolved/resolved slot representation
  - current seam cut
  - minimum automated proof bar
  - explicit out-of-scope boundary
- Added one subsection per `10C` question with `Why This Matters` and `Current Working Read` notes so the next planning pass can lock answers without mixing `10C` back into `10A` or `10B`.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- None. Docs-only planning update.

#### Verification Steps
- Reviewed the updated `10C` block in `docs/Phase-Plans/11_SP - Phase-Plans.md`

<!-- ============================================================ -->
### [176] - 2026-03-11 11:16 - `SP - Phase 10B - Graph-Local Preview And Build Memory`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented \`SP - Phase 10B\` by moving accepted spaghetti build outputs into graph-local runtime state, adding explicit \`viewerTargetGraphDocumentId\` ownership for shared-viewer reads, and rerouting the main spaghetti preview/read surfaces away from app-global spaghetti \`parts\` while preserving shared presentation state such as visibility and selection.`

#### Scope / Constraints Honored
- Kept `10B` focused on graph-local preview/build memory and explicit viewer-target reads.
- Reused the shipped `10A` graph-aware request/result routing contract instead of changing worker envelopes again.
- Left `10C` output handoff semantics, Browser hierarchy growth, and project ownership work out of scope.

#### Summary of Implementation
- Expanded `GraphRuntimeState` in `useSpaghettiStore` so each graph now owns accepted build outputs and accepted preview build outputs in addition to compile/build and preview-preparation state.
- Added explicit `viewerTargetGraphDocumentId` ownership and viewer-target selectors in `useSpaghettiStore`, and wired viewport focus/rebinding paths so viewer targeting updates through explicit store state instead of implicit active-graph reads.
- Updated `useAppStore.acceptBuildResult(...)` so spaghetti build results are accepted into graph-local runtime truth instead of projecting canonical spaghetti outputs into app-global `parts`.
- Rerouted `ViewerHost`, `PartsListPanel`, `DebugInspectorDrawer`, and `ViewToolbar` so spaghetti-mode reads now follow viewer-target graph-local outputs instead of app-global spaghetti `parts`.
- Added automated coverage for graph-local accepted-output isolation, viewer-target-following behavior, and app-store acceptance preserving graph-local ownership.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `docs/Phase-Plans/Tasks/Future/01.3B - SP - Phase 10B.md`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes
- In spaghetti mode, accepted build outputs now persist per graph even when that graph is not the current viewer target.
- The shared viewer and the main spaghetti read surfaces now resolve spaghetti preview/build reads from explicit viewer-target state instead of the focused editor graph or app-global spaghetti `parts`.
- App-global `parts` remains the canonical legacy-mode build-output bucket; it is no longer the canonical spaghetti-mode runtime bucket.

#### Verification Steps
- `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/store/useAppStore.test.ts`
- `npm.cmd run build`

<!-- ============================================================ -->
### [175] - 2026-03-11 04:00 - `SP - Phase 10B - Implementation Doc Tightening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Rewrote the dedicated \`10B\` task doc into a code-grounded implementation-ready execution spec by carrying the locked family answers forward, defining graph-local accepted build-output ownership and explicit viewer-target state as the phase core, and grounding the plan in the current `useAppStore`, `ViewerHost`, `bootstrapBuildWiring`, and `useSpaghettiStore` seams.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept `10B` scoped to graph-local preview/build memory and shared-viewer targeting.
- Kept `10A` routing identity, `10C` output handoff, Browser hierarchy growth, and project ownership out of scope.

#### Summary of Implementation
- Replaced the `10B` setup stub with a full implementation-ready execution spec matching the `10A` doc structure.
- Marked the planning/setup checklist complete while leaving the implementation done-check open.
- Locked the first-pass `10B` direction around:
  - graph-local accepted spaghetti build-output ownership
  - graph-local preview render-source ownership
  - explicit `viewerTargetGraphDocumentId`
  - viewer-target-following spaghetti inspection/read surfaces
  - shared visibility/selection presentation state for the first pass
- Grounded the doc in the current code seams where spaghetti preview/build memory still remains too global:
  - `useAppStore`
  - `ViewerHost`
  - `bootstrapBuildWiring`
  - `useSpaghettiStore`
  - `PartsListPanel`
  - `DebugInspectorDrawer`
- Added the concrete implementation sequence, acceptance criteria, and the full locked `10B` test bar.
- Added a roadmap doc-history note so the tracker now reflects that `01.3B` is implementation-ready rather than only created.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.3B - SP - Phase 10B.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10B` now has an implementation-ready task doc instead of a setup stub.

#### Verification Steps
- Re-read the rewritten `10B` task doc against the locked `10B` family section and the live runtime/viewer seams to confirm the doc is decision-complete for implementation.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [174] - 2026-03-11 03:45 - `SP - Phase 10B - Test Bar Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked \`10B.Q6\` in the \`SP\` family phase doc so graph-local preview/build memory now has an explicit automated proof bar covering graph-local runtime isolation, graph-local preview-prep isolation, explicit viewer-target selection, build-vs-view separation, stale/wrong-graph protection, and removal of the last canonical one-global spaghetti runtime seams.`

#### Scope / Constraints Honored
- Updated planning docs only.
- Kept the change focused on the remaining `10B` proof-bar question.
- Did not rewrite the dedicated `10B` task doc yet.

#### Summary of Implementation
- Marked `10B.Q6` resolved in the `SP - Phase 10B` family checklist.
- Replaced the open `10B.Q6` placeholder with a locked-answer section defining the minimum required automated test bar.
- Added the `10B.Q6` summary line to the `10B Locked Answers So Far` block so the `10B` family section now reads as a full first-pass decision set.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10B` now has its automated proof bar locked at the family-doc level.

#### Verification Steps
- Re-read the `10B` section in the `SP` family doc to confirm `Q1` through `Q6` are now all marked resolved and the new test bar matches the already-locked `10B` seam and viewer-target rules.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [173] - 2026-03-11 03:35 - `SP - Phase 10B - First Question Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked the first five \`10B\` answers in the \`SP\` family phase doc so graph-local preview/build memory now has explicit decisions for the seam cut, reused routing contract, shared-viewer targeting, multi-graph overwrite safety, and out-of-scope boundaries, while leaving the `10B` test-bar question open.`

#### Scope / Constraints Honored
- Updated planning docs only.
- Kept `10B` partially locked rather than pretending it is fully implementation-ready.
- Left the `10B` automated proof-bar question open.
- Left `10C` and later ownership/output work untouched.

#### Summary of Implementation
- Reworked the `10B` question block so its numbering now matches the actual answered questions.
- Marked `10B.Q1` through `10B.Q5` resolved.
- Locked:
  - the exact first-pass seam cut across `useAppStore`, `bootstrapBuildWiring`, `buildDispatcher`, and `ViewerHost`
  - reuse of the minimal graph-routed request/result contract from `10A`
  - explicit `viewerTargetGraphDocumentId` ownership for shared-viewer projection
  - per-graph stale-drop and supersession rules for multi-graph safety
  - the `10B` scope boundary versus later `10C`, `AS`, `SP 11`, and `GE 12` work
- Added a compact `10B Locked Answers So Far` summary block under the resolved sections.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10B` now has a partially locked family-doc decision surface instead of a fully open question draft.

#### Verification Steps
- Re-read the `10B` section in the `SP` family doc to confirm the resolved questions and numbering now align cleanly with the new locked answers.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [172] - 2026-03-11 03:20 - `SP - Phase 10B - Question Block Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a dedicated \`10B\` question block to the \`SP\` family phase doc so graph-local preview/build memory now has its own open implementation-prep checklist covering runtime ownership, shared-viewer projection, non-focused graph result handling, seam cuts, proof-bar testing, and scope boundaries.`

#### Scope / Constraints Honored
- Updated planning docs only.
- Kept the new `10B` block open rather than pretending the phase is already decision-complete.
- Left `10C` and later project-ownership work untouched.

#### Summary of Implementation
- Added a `10B`-specific decision checklist under the `SP - Phase 10B` family section.
- Added seven open `10B` questions covering:
  - graph-local preview/build runtime ownership
  - allowed remaining app-global bridge state
  - shared viewer projection rules versus build truth
  - non-focused graph result storage behavior
  - current seam cuts across `useAppStore`, `ViewerHost`, `bootstrapBuildWiring`, and `useSpaghettiStore`
  - minimum automated proof bar
  - out-of-scope boundaries
- Added short `Why This Matters` and `Humanized Read` subsections for each question so the planning surface is easier to review before the answer-lock pass.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10B` now has its own question-driven planning section in the family phase doc.

#### Verification Steps
- Re-read the updated `10B` section in the `SP` family doc to confirm the new questions stay focused on graph-local preview/build memory and do not reopen already-locked `10A` routing decisions.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [171] - 2026-03-11 03:10 - `SP - Phase 10B - Plan Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`10B\` task doc in normalized `01.3B` form so graph-local preview/build memory now has its own planning surface, and refreshed the roadmap and `SP` family trackers so `[1.3B]` now counts as having a created plan doc.`

#### Scope / Constraints Honored
- Updated planning/tracking docs only.
- Kept `10B` as a setup scaffold, not an implementation-ready spec.
- Left `10C` and later `GE - Phase 12` work untouched.

#### Summary of Implementation
- Added `docs/Phase-Plans/Tasks/Future/01.3B - SP - Phase 10B.md`.
- Set up the new task doc with:
  - a progress checklist
  - progress rules
  - a done check
  - doc history
  - purpose
  - scope
  - source inputs
  - placeholder `Arch Spec` sections for the later implementation-ready pass
- Updated the `SP` family doc to mark `10B` as clear enough to justify its own dedicated task doc.
- Updated the roadmap `Plan.md Status` tracker so `[1.3B]` now shows as having a created task doc.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.3B - SP - Phase 10B.md`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10B` now has its own dedicated planning doc in the normalized subphase naming scheme.

#### Verification Steps
- Re-read the new `10B` task doc to confirm it matches the basic task-doc setup pattern used before the implementation-ready pass.
- Re-read the roadmap and `SP` family trackers to confirm `[1.3B]` now shows `Plan.md Status` as created.
- No tests were run because this was a docs-only setup update.

<!-- ============================================================ -->
### [170] - 2026-03-11 03:00 - `SP - Phase 10A - Graph-Aware Build Identity And Routing`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the first real \`10A\` routing cut by carrying graph identity through build requests, worker progress/results, dispatcher stale-drop, graph-local runtime guards, and explicit graph-routed app entry points, then verified the new isolation behavior with targeted tests and a full build.`

#### Scope / Constraints Honored
- Implemented `10A` only.
- Kept compile locally handled in the first pass.
- Kept build routed through the shared worker path.
- Kept `10B` preview/build-memory expansion and `10C` output handoff work out of scope.

#### Summary of Implementation
- Extended `BuildRequest`, `BuildResult`, `BuildProgress`, and build-side worker errors with:
  - `projectFileId`
  - `graphDocumentId`
  - `buildRequestId`
- Reworked `buildDispatcher` stale-drop handling so build routing is keyed per graph instead of one global build bucket, with request-id matching for accepted progress/results/errors.
- Removed the worker's old one-global build drop behavior so concurrent graph builds can complete without stomping each other, while keeping assemble latest-only behavior separate.
- Added graph-local routing truth and defensive accept/clear guards in `useSpaghettiStore` through:
  - `latestIssuedBuildSeq`
  - `latestAcceptedBuildSeq`
  - `inFlightBuildRequestId`
  - `inFlightBuildSeq`
- Added canonical graph-routed app entry points in `useAppStore`:
  - `compileGraphDocument(graphDocumentId)`
  - `requestGraphDocumentBuild(graphDocumentId)`
- Kept `compileSpaghetti()` and `requestSpaghettiBuild()` only as thin wrappers over the new graph-routed entry points.
- Updated `SpaghettiPanel` compile/build actions to pass explicit viewport graph identity.
- Extended automated coverage for:
  - wrong-graph rejection
  - stale same-graph rejection
  - concurrent graph isolation
  - focus-change safety
  - viewport-switch safety
  - direct stale-write rejection in graph runtime setters
  - compatibility-wrapper forwarding into the graph-routed build path

#### Files Changed
- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.3A - SP - Phase 10A.md`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- Spaghetti build requests and worker results now carry explicit graph routing identity.
- Concurrent builds for different graph documents no longer share one global stale-drop path.
- Spaghetti compile/build actions now route through explicit graph-document entry points even though compatibility wrapper names remain.
- Non-focused graph build results no longer overwrite the currently projected global spaghetti parts/viewer bridge.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/buildDispatcher.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/worker/pipeline/buildPipeline.test.ts`.
- Ran `npm.cmd run build`.

<!-- ============================================================ -->
### [169] - 2026-03-11 01:40 - `SP - Phase 10A - Implementation Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`10A\` implementation doc in normalized `01.3A` form, rewriting the stub into a code-grounded execution spec for graph-aware build identity and routing and updating the roadmap tracker so `[1.3A]` now counts as having its own task doc.`

#### Scope / Constraints Honored
- Updated only planning/tracking docs.
- Kept `10A` as the routing-identity and stale-drop cut only.
- Left `10B` and `10C` planning untouched.

#### Summary of Implementation
- Renamed the stub task doc from `01.3 - SP - Phase 10a.md` to `01.3A - SP - Phase 10A.md`.
- Replaced the basic scaffold with a real implementation-ready execution spec that now defines:
  - the `10A` problem statement and phase boundary
  - the shared request/result routing contracts
  - graph-local routing runtime ownership
  - wrapper migration rules for compile/build entry points
  - current seam findings across `useAppStore`, `buildDispatcher`, `bootstrapBuildWiring`, `useSpaghettiStore`, and `protocol.ts`
  - the ordered implementation sequence and automated proof bar
- Updated the roadmap `Plan.md Status` tracker and dedicated-plan totals so `[1.3A]` now shows as having a created task doc.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.3A - SP - Phase 10A.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10A` now has its own implementation-ready task doc in the normalized subphase naming scheme.

#### Verification Steps
- Re-read the new `10A` task doc against the locked family-doc answers to confirm the execution spec stays within `10A` scope.
- Re-read the roadmap tracker to confirm `[1.3A]` now shows `Plan.md Status` as created and the dedicated-doc totals increment accordingly.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [168] - 2026-03-11 01:20 - `SP - Phase 10A - Family Doc Decision Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked the \`SP - Phase 10A\` routing section in the family phase doc by converting all seven open \`10A\` questions into resolved planning answers, adding the first-pass synthetic \`projectFileId\` rule, the graph-local routing-state contract, the compatibility-wrapper policy, and the minimum automated proof bar for a future task doc.`

#### Scope / Constraints Honored
- Updated only planning docs.
- Locked `10A` at the family-doc level without creating or implementing a dedicated task doc yet.
- Kept `10B` and `10C` open.

#### Summary of Implementation
- Converted the `10A` checklist from open questions to resolved decisions.
- Rewrote `10A.Q1` through `10A.Q7` into locked-answer sections covering:
  - shared request/result routing envelopes
  - synthetic runtime `projectFileId`
  - graph-local `buildSeq` ownership
  - stale-drop ownership split
  - in-flight result ownership during focus changes
  - wrapper-vs-canonical API policy
  - minimum automated routing proof bar
- Added a `10A` readiness note describing what the future task doc must cover.
- Marked `10A` as clear enough to justify a dedicated task doc in the family readiness checklist.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10A` is now decision-complete enough in the family phase doc to support a dedicated implementation task doc.

#### Verification Steps
- Re-read the updated `10A` section to confirm all seven questions are now locked and internally consistent with the existing `SP - Phase 10` family direction.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [167] - 2026-03-11 01:10 - `SP - Phase 10A - Routing Question Block`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a dedicated \`10A\` question block inside the \`SP - Phase 10\` family section so the graph-aware routing subphase now explicitly tracks the remaining request-envelope, result-envelope, build-sequence, stale-drop, focus-change, API-entry, and test-bar questions before task-doc creation.`

#### Scope / Constraints Honored
- Updated only planning docs.
- Kept the new questions under the existing `10A` subphase instead of reopening the full `SP - Phase 10` family scope.
- Did not answer or lock the `10A` questions yet.

#### Summary of Implementation
- Added a `10A`-specific open-question checklist under the `SP - Phase 10A` working breakdown.
- Added seven `10A` question subsections covering:
  - request envelope shape
  - result envelope shape
  - `buildSeq` ownership
  - stale-drop ownership
  - focus changes during in-flight builds
  - compile/build API entry-point ownership
  - minimum automated test bar
- Updated the `SP` family doc history and main `Phase 10` checklist to reflect that the `10A` question block now exists.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10A` now has a dedicated implementation-question block in the family phase doc.

#### Verification Steps
- Re-read the updated `10A` block in the `SP` family doc to confirm the new questions are phase-specific and do not duplicate the broader family direction locks.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [166] - 2026-03-11 01:00 - `SP - Phase 10 - Working Subphase Split`
<!-- ============================================================ -->
HUMAN SUMMARY: `Split the active \`SP - Phase 10\` family planning surface into explicit working subphases \`10A\`, \`10B\`, and \`10C\` so routing identity, graph-local runtime memory, and output handoff can be tracked and prepared separately in the dependency order they actually need.`

#### Scope / Constraints Honored
- Updated only planning docs.
- Kept the existing roadmap-aligned `10A / 10B / 10C` structure rather than inventing a new split.
- Did not mark any `SP - Phase 10` subphase as implemented.

#### Summary of Implementation
- Updated the `SP` family phase doc so `Phase 10` now explicitly includes:
  - a three-part working breakdown section
  - one subsection each for `10A`, `10B`, and `10C`
  - minimum win conditions for each subphase
  - explicit out-of-scope boundaries for each subphase
  - a subphase-readiness checklist for future task-doc creation
- Updated the `Phase 10` checklist and small-achievements block to reflect that the split is now part of the canonical family planning surface.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10` is now structured in the family doc as three working subphases instead of one undifferentiated planning block.

#### Verification Steps
- Re-read the updated `SP - Phase 10` section to confirm the `10A -> 10B -> 10C` dependency order and boundaries are explicit.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [165] - 2026-03-11 00:50 - `SP - Phase 10 - Graph Aware Worker And Preview Routing`
<!-- ============================================================ -->
HUMAN SUMMARY: `Promoted the \`SP - Phase 10\` family section from a placeholder into an active planning surface by carrying forward the already-locked \`[1.3A] / [1.3B] / [1.3C]\` direction and writing the remaining implementation-prep questions around request/result routing, viewer targeting, stale-drop safety, and first-pass seam cuts.`

#### Scope / Constraints Honored
- Updated only the family planning docs for `SP - Phase 10`.
- Reused locked direction from the roadmap, decisions file, and Codex notes instead of reopening settled scope.
- Kept later `AS`, `GE - Phase 12`, and `SP - Phase 11` work explicitly out of the phase-10 setup.

#### Summary of Implementation
- Replaced the old `SP - Phase 10` placeholder block in the `SP` family phase doc with:
  - an active summary
  - a small achievements block
  - a carried-forward family-level decision lock section
  - a remaining-question checklist focused on implementation readiness
- Added one subsection per remaining question so the next pass can lock:
  - current seam ownership
  - request/result contract shape
  - shared viewer target rules
  - stale-drop/overwrite rules
  - out-of-scope boundaries
- Added a matching doc-history entry to the `SP` family file.

#### Files Changed
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

#### Behavior Changes (if any)
- No runtime behavior changed.
- `SP - Phase 10` is now tracked in the family phase doc as an active planning surface rather than a future placeholder.

#### Verification Steps
- Re-read the updated `SP - Phase 10` section to confirm it now separates locked family direction from the unresolved implementation-prep questions.
- No tests were run because this was a docs-only planning update.

<!-- ============================================================ -->
### [164] - 2026-03-11 00:35 - `GE - Phase 11C - Save/Load Interaction With Editors`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the first explicit \`11C\` editor-action layer by adding Browser row secondary actions for opening a second editor or swapping the focused editor, splitting file load into clone-as-new-graph behavior, and routing editor save through the focused viewport's cached graph entry without disturbing the shipped \`11A\` and \`11B\` seams.`

#### Scope / Constraints Honored
- Implemented `11C` only.
- Kept raw graph-document file IO in `11A`.
- Kept Browser cached-entry lifecycle core in `11B`.
- Kept `Import Into Current Graph` deferred and explicit rather than collapsing it into `Load Into New Graph`.
- Kept project ownership and Browser hierarchy growth deferred to later phases.

#### Summary of Implementation
- Added explicit `11C` store actions in `useSpaghettiStore` for:
  - opening a graph in a new viewport even when that graph is already open elsewhere
  - swapping the focused viewport to another graph
  - loading a graph file into a fresh dirty graph copy
  - saving the graph bound to the focused editor viewport
- Preserved `openGraphDocumentInViewport(...)` as the Browser row-click `open-or-focus` path.
- Updated `BrowserPanel` so graph rows now expose:
  - `Save`
  - `New Editor`
  - `Swap Editor`
  - and so top-level file load now means `Load Into New Graph`
- Updated `SpaghettiPanel` with a first-pass editor-side `Save Graph` action routed through the focused viewport binding.
- Extended store tests to cover same-graph multi-viewport opens, focused-viewport swap behavior, clone-on-load identity rules, and focused-editor save behavior.
- Tightened the `11C` task doc and the `GE` family phase doc to reflect that `11C` is now implemented.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.2c - GE - Phase 11C.md`
- `docs/Phase-Plans/01_GE - Phase-Plans.md`

#### Behavior Changes (if any)
- Browser graph rows still open-or-focus on row click, but now also expose explicit `New Editor` and `Swap Editor` actions.
- The Browser file-load button now creates a fresh dirty graph copy instead of preserving the file's live `graphDocumentId`.
- The app now supports multiple editor viewports bound to the same graph document.
- Editor-side save now targets the graph bound to the focused viewport through the cached-entry save seam.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts`.
- Ran `npm.cmd run build`.
- Re-read the updated `11C` task doc and `GE` family phase doc after implementation to confirm they now reflect shipped behavior rather than planned behavior.

<!-- ============================================================ -->
### [163] - 2026-03-11 00:20 - `GE - Phase 11C - Task Doc Tightening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Tightened the dedicated \`11C\` task doc into a code-grounded implementation-ready spec by using Codex notes as the primary decision source, locking the first-pass editor action model, and naming the exact Browser/store seams that must change for explicit open/new-editor/swap/save behavior.`

#### Scope / Constraints Honored
- Updated the `11C` task-planning surface only.
- Kept `11C` implementation itself deferred.
- Kept raw file IO in `11A`, cached-graph lifecycle in `11B`, and project ownership in `GE 12`.
- Kept `Import Into Current Graph` explicit but out of first-pass `11C` implementation scope.

#### Summary of Implementation
- Renamed the task-doc identity from `01.08` wording to canonical `01.2C`.
- Reworked the `11C` task doc to match the shipped `11A` / `11B` implementation-ready spec format.
- Marked the planning/read/lock progress checklist complete while leaving the implementation done-check open.
- Added explicit locked behavior for:
  - `Open Graph`
  - `Load Into New Graph`
  - `Open In New Editor`
  - `Swap Current Editor`
  - focused-editor save targeting
  - Browser focus follow behavior
- Added code-grounded seam analysis for:
  - `useSpaghettiStore`
  - `BrowserPanel`
  - `SpaghettiEditor`
- Replaced generic file/ordering notes with a concrete implementation sequence and a targeted test/verification plan.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.2c - GE - Phase 11C.md`

#### Verification Steps
- Re-read the rewritten `11C` task doc after the replacement to confirm the file now follows the `11A` / `11B` execution-spec pattern.
- Verified the doc now locks:
  - same-graph multi-viewport behavior
  - focused-viewport swap behavior
  - `Load Into New Graph` clone-and-dirty semantics
  - focused-editor save routing through the cached-entry save seam
- Cross-checked the rewrite against the carry-forward decisions in:
  - `docs/Human-Plans/CodexNotes/5_CodexChatNotes.md`
  - `docs/Human-Plans/CodexNotes/6_CodexChatNotes.md`
  - `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`
  - `docs/Human-Plans/CodexNotes/8_CodexChatNotes.md`

<!-- ============================================================ -->
### [162] - 2026-03-10 22:15 - `GE - Phase 11 - 11C Family Decision Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked the remaining family-level \`GE - Phase 11C\` editor-interaction answers in the \`GE\` phase-family doc so Browser row click, graph-copy identity, viewport rebinding, save target, and Browser/editor focus rules are now explicit before \`11C\` implementation starts.`

#### Scope / Constraints Honored
- Updated the family planning surface only.
- Kept `11C` implementation work deferred.
- Kept `11C` scoped to editor interaction policy rather than raw file IO, cached-graph core, or `GE 12` ownership work.

#### Summary of Implementation
- Added a new family-doc history entry for the `11C` answer-lock pass.
- Replaced the Phase 11 `11C` question block's open state with explicit locked answers for:
  - `Open Graph`
  - `Load Into New Graph`
  - `Open In New Editor`
  - `Swap Current Editor`
  - save targeting
  - Browser/editor focus follow behavior
- Marked the family-level `11C` decision checklist and identity-policy checklist items complete while leaving implementation pending.

#### Files Changed
- `docs/Phase-Plans/01_GE - Phase-Plans.md`

#### Verification Steps
- Re-read the `GE - Phase 11` family section after the update to confirm all seven `11C` questions now have explicit answers.
- Cross-checked the locked answers against the carry-forward decisions in:
  - `docs/Human-Plans/CodexNotes/5_CodexChatNotes.md`
  - `docs/Human-Plans/CodexNotes/6_CodexChatNotes.md`
  - `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`

<!-- ============================================================ -->
### [161] - 2026-03-10 20:40 - `GE - Phase 11B - Cached Graph Lifecycle`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the first cached-graph lifecycle layer by adding Browser-owned cached graph entries in \`useSpaghettiStore\`, moving Browser graph rows to cached-entry-backed rendering with simple dirty/saved state, and wiring first-pass Browser load/save actions without pulling \`11C\` editor policy forward.`

#### Scope / Constraints Honored
- Implemented `11B` only.
- Kept the live graph document as the authored source of truth.
- Kept `Open In New Editor`, `Swap Current Editor`, and `Load Into New Graph` deferred to `11C`.
- Kept richer Browser row build/loading bars deferred to later Browser/build-control phases.

#### Summary of Implementation
- Added `CachedGraphEntry` state and selectors to `useSpaghettiStore`.
- Seeded one cached entry per live graph document, with:
  - startup/new/duplicate in-memory graphs starting dirty
  - file-loaded graphs starting clean
- Marked cached entries dirty on committed graph edits.
- Added first-pass store actions to:
  - save a cached graph entry through the shipped `11A` persistence seam
  - load a graph document from file into a cached entry
- Updated `BrowserPanel` so graph rows are backed by cached entries instead of direct graph-document enumeration.
- Kept Browser row click behavior as `open-or-focus`.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`

#### Behavior Changes (if any)
- Browser graph rows now show simple `Dirty` / `Saved` lifecycle state alongside `Closed` / `Open` / `Focused`.
- The Browser now exposes first-pass `Load Graph File` and per-row `Save` actions.
- Loading a graph file creates or refreshes a cached Browser graph entry while keeping the same `graphDocumentId` in first pass.

#### Verification Steps
- Ran `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/io/graphDocumentPersistence.test.ts`
- Ran `npm.cmd run build`

<!-- ============================================================ -->
### [160] - 2026-03-10 00:08 - `OO - Phase 13 - Roadmap Setup Companion Doc`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created a new \`Roadmap-Setup.md\` companion doc so roadmap format/meta/tracker guidance can gradually move out of \`roadmap.md\`, and added a small pointer link in the live roadmap so the lane body can become the main reading surface over time.`

#### Scope / Constraints Honored
- Added roadmap/docs structure only.
- Did not change lane meaning or roadmap ordering.
- Kept the live lane body in `roadmap.md`.

#### Summary of Implementation
- Added `docs/Human-Plans/roadmap/Roadmap-Setup.md`.
- Used the new file to define:
  - why the roadmap is noisy
  - what should stay in `roadmap.md`
  - what should move out later
  - a preferred future roadmap shape
  - a first cleanup direction
- Added a small pointer in `docs/Human-Plans/roadmap/roadmap.md` so the new setup companion is discoverable from the live roadmap.

#### Files Changed
- `docs/Human-Plans/roadmap/Roadmap-Setup.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Documentation/structure only.

#### Verification Steps
- Read the new `Roadmap-Setup.md` and confirmed the live roadmap now points to it near the top.

<!-- ============================================================ -->
### [159] - 2026-03-10 00:00 - `GE - Phase 11C - Save/Load Interaction With Editors Task Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`11C\` task doc for save/load interaction with editors so the editor-facing open/swap/load behavior now has its own execution-planning surface after \`11A\` and \`11B\`, and refreshed the roadmap plan-doc tracker to count that new doc.`

#### Scope / Constraints Honored
- Added planning/task-doc and roadmap-tracking updates only.
- Kept `11C` scoped to editor-facing save/load behavior rather than raw file IO or Browser cached lifecycle.
- Did not start `11C` implementation.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.08 - GE - Phase 11C.md`.
- Framed `11C` around:
  - `Open Graph`
  - `Load Into New Graph`
  - `Open In New Editor`
  - `Swap Current Editor`
  - Browser/editor coordination during save/load actions
- Grounded the doc in the current seams:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/panels/SpaghettiPanel.tsx`
  - `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- Updated roadmap `Plan.md Status` for `[1.2C]` and refreshed the dedicated plan-doc totals.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.08 - GE - Phase 11C.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Planning/docs only.

#### Verification Steps
- Re-read the roadmap `11C` section, the `GE` family phase doc, and the existing `11A` / `11B` task docs before creating the new task file.
- Read back the updated roadmap tracker sections after the patch.

<!-- ============================================================ -->
### [158] - 2026-03-09 22:37 - `OO - Phase 13 - Explicit 2.3 Carry-Forward Note For Browser Build Bars`
<!-- ============================================================ -->
HUMAN SUMMARY: `Expanded the roadmap text inside \`[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface\` so the later home for richer Browser row loading/build bars is now explicit there, rather than only implied by the earlier \`11B\` scope note.`

#### Scope / Constraints Honored
- Changed roadmap/docs only.
- Kept `11B` and `[2.3]` scope boundaries intact.
- Did not start any implementation work.

#### Summary of Implementation
- Added a new roadmap doc-history note for the `[2.3]` clarification.
- Expanded the `[2.3]` section with an explicit carry-forward block that says:
  - `11B` owns simple Browser row `dirty/saved` state
  - `[2.3]` owns later richer Browser row loading/build bars
- Added a checklist reminder in `[2.3]` so that richer row bars stay anchored to the later build-control lane.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Roadmap/planning only.

#### Verification Steps
- Read back the updated `[2.3]` section after the patch.

<!-- ============================================================ -->
### [157] - 2026-03-09 22:36 - `OO - Phase 13 - Roadmap Note For 11B Dirty State Versus Later Build Bars`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the roadmap to keep \`11B\` focused on Browser cached-entry dirty/saved state only, while explicitly deferring richer Browser row loading/build bars to the later Browser/build-control lane instead of letting that UI scope leak into cached graph lifecycle work.`

#### Scope / Constraints Honored
- Changed roadmap/docs only.
- Kept `11B` narrow and did not start implementation work.
- Preserved the later Browser/build-control phase as the home for richer row activity bars.

#### Summary of Implementation
- Added a roadmap doc-history note for the new `11B` scope clarification.
- Expanded the `[1.2B] GE - Phase 11B - Cached Graph Lifecycle` summary and checklist to include:
  - simple dirty/saved Browser row state in scope
  - richer loading/build bars deferred out of scope
- Added a carry-forward note under `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface` so later Browser row build bars have an explicit roadmap home.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Roadmap/planning only.

#### Verification Steps
- Read back the updated `11B` and `[2.3]` roadmap sections after the patch.

<!-- ============================================================ -->
### [156] - 2026-03-09 22:32 - `GE - Phase 11B - Cached Graph Lifecycle Task Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`11B\` task doc for cached graph lifecycle so the Browser-owned saved-versus-live graph layer now has its own execution-planning surface after the shipped \`11A\` persistence core, and refreshed the roadmap plan-doc tracker to count that new doc.`

#### Scope / Constraints Honored
- Added planning/task-doc and roadmap-tracking updates only.
- Kept `11B` scoped to cached graph lifecycle rather than raw file IO or editor interaction policy.
- Did not start `11B` implementation.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.07 - GE - Phase 11B.md`.
- Framed `11B` around:
  - Browser-owned cached graph entries
  - saved graph versus cached live graph behavior
  - reopen/focus behavior for cached graphs
  - keeping editor interaction policy deferred to `11C`
- Grounded the doc in the current seams:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/io/graphDocumentPersistence.ts`
- Updated roadmap `Plan.md Status` for `[1.2B]` and refreshed the dedicated plan-doc totals.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.07 - GE - Phase 11B.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Planning/docs only.

#### Verification Steps
- Re-read the roadmap `11B` section, the `GE` family phase doc, and the shipped `11A` task doc before creating the new task file.
- Read back the updated roadmap tracker sections after the patch.

<!-- ============================================================ -->
### [155] - 2026-03-09 22:26 - `GE - Phase 11A - Graph Document Persistence Core`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the first real graph-document persistence core by adding stable serialize/deserialize helpers plus browser file save/load services for one \`GraphDocument\`, routing load validation through \`parseGraphDocument()\`, and verifying the new persistence surface with targeted tests and a production build.`

#### Scope / Constraints Honored
- Kept `11A` limited to one graph-document persistence core.
- Kept Browser cache lifecycle, editor open/swap/import behavior, and project-file ownership out of this phase.
- Reused the existing graph-document schema/parse boundary instead of introducing a second persistence schema.

#### Summary of Implementation
- Added `src/app/io/graphDocumentPersistence.ts` as the first dedicated graph-document persistence module.
- Implemented:
  - `serializeGraphDocument()`
  - `deserializeGraphDocument()`
  - `saveGraphDocumentToFile()`
  - `loadGraphDocumentFromFile()`
  - supporting filename and persisted-shape helpers
- Locked the saved unit to the canonical runtime `GraphDocument` shape:
  - `graphDocumentId`
  - `name`
  - `version`
  - `graph`
- Routed load validation through the existing `parseGraphDocument()` path so malformed JSON and malformed graph-document payloads fail at the correct boundary.
- Added targeted persistence tests covering:
  - stable JSON serialization
  - deserialize roundtrip
  - invalid JSON failure
  - invalid shape failure
  - browser-file save path
  - browser-file load path
  - no-file-selected rejection
- Updated the `11A` task doc and roadmap to reflect the shipped persistence-core cut.

#### Files Changed
- `src/app/io/graphDocumentPersistence.ts`
- `src/app/io/graphDocumentPersistence.test.ts`
- `docs/Phase-Plans/Tasks/Future/01.06 - GE - Phase 11A.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- The app now has a dedicated low-level persistence surface for saving and loading one `GraphDocument` as JSON.
- Persisted graph files exclude runtime-only graph buckets, viewport/browser state, and editor interaction state.
- Later Browser/editor save-load UX can now build on a stable persistence seam instead of inventing file behavior ad hoc.

#### Verification Steps
- `cmd /c npm test -- src/app/io/graphDocumentPersistence.test.ts src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `cmd /c npm run build`

<!-- ============================================================ -->
### [154] - 2026-03-09 22:02 - `GE - Phase 11A - Graph Document Persistence Core Spec Tightening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Tightened the \`11A\` task doc into a code-grounded implementation-ready spec by locking the live \`GraphDocument\` contract, the existing \`parseGraphDocument()\` load boundary, and the first pure-helper plus browser-file-IO persistence surface while keeping \`11B\`, \`11C\`, and \`GE 12\` work deferred.`

#### Scope / Constraints Honored
- Updated only the `11A` task doc and changelog.
- Kept `11A` limited to persistence core planning/spec work.
- Did not start `11A` implementation.

#### Summary of Implementation
- Reframed `11A` around one persisted `GraphDocument`, one load boundary, and one browser file IO seam.
- Grounded the doc in the live schema/runtime seams:
  - `src/app/spaghetti/schema/spaghettiTypes.ts`
  - `src/app/spaghetti/schema/spaghettiSchema.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
- Locked the persistence split to:
  - pure helpers: `serializeGraphDocument()` / `deserializeGraphDocument()`
  - browser file IO: `saveGraphDocumentToFile()` / `loadGraphDocumentFromFile()`
- Added tighter acceptance checks and explicit deferred boundaries for `11B`, `11C`, and `GE 12`.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.06 - GE - Phase 11A.md`

#### Behavior Changes (if any)
- None. Spec/docs only.

#### Verification Steps
- Read the updated `11A` task doc against the live schema/runtime seams before patching.

<!-- ============================================================ -->
### [153] - 2026-03-09 21:55 - `GE - Phase 11A - Graph Document Persistence Core Task Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`11A\` task doc for graph-document persistence core and updated the roadmap plan-doc tracker so the first save/load core phase now has its own implementation-planning surface before code work starts.`

#### Scope / Constraints Honored
- Added planning/task-doc and roadmap-tracking updates only.
- Kept `11A` scoped to graph-document persistence core.
- Did not start `11A` implementation.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.06 - GE - Phase 11A.md`.
- Locked the first-pass `11A` direction around:
  - one durable graph-document file contract
  - validation and parse behavior on load
  - save/load core entry points
  - keeping viewport/browser/editor runtime state out of the persisted graph-document contract
- Updated roadmap `Plan.md Status` for `[1.2A]` and refreshed the dedicated plan-doc totals.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.06 - GE - Phase 11A.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Planning/docs only.

#### Verification Steps
- Read the new `11A` task doc and refreshed roadmap plan-doc sections after the patch.

<!-- ============================================================ -->
### [152] - 2026-03-09 21:43 - `OO - Phase 13 - Roadmap Checklist Refresh After 9C`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the roadmap checklist state after the real \`9C\` cut, marking the immediate single-graph-cleanup track complete now that \`9A\`, \`9B\`, and \`9C\` have all landed while leaving later routing, persistence, and ownership work pending.`

#### Scope / Constraints Honored
- Changed only roadmap-tracking docs.
- Kept the checklist strict to what actually landed.
- Did not re-order future phases.

#### Summary of Implementation
- Added a roadmap doc-history note for the post-`9C` checklist refresh.
- Marked `Immediate CheckList` item `5. Single-Graph Cleanup In Service Of Browser` complete.
- Tightened the note under that item so it now points forward to routing, persistence, and project-ownership work instead of more single-graph cleanup.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- None. Documentation/tracking only.

#### Verification Steps
- Read the updated roadmap checklist sections after the patch.

<!-- ============================================================ -->
### [151] - 2026-03-09 21:43 - `SP - Phase 9C - Graph-Local Compile / Preview Preparation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Moved spaghetti compile/build memory and preview-preparation memory into graph-local runtime owned by \`useSpaghettiStore\`, reconnected the app-store/build-wiring/viewer bridge to those graph-keyed buckets, and verified the bridge cut with targeted store/preview tests plus a full production build.`

#### Scope / Constraints Honored
- Kept `9C` as a bridge phase only.
- Left full worker/result routing redesign for `SP - Phase 10`.
- Left Browser-facing output hierarchy and later `AS` structure work out of this cut.
- Kept one shared worker lifecycle and one shared viewer shell.

#### Summary of Implementation
- Added graph-local runtime buckets in `useSpaghettiStore` for:
  - compile/build memory
  - preview-preparation memory
  - light build-seq to graph-document tracking
- Removed the old spaghetti-global compile/build buckets from `useAppStore`.
- Reconnected `compileSpaghetti()` and `requestSpaghettiBuild()` so they operate through graph-local runtime while preserving the active-graph bridge for this phase.
- Reconnected `bootstrapBuildWiring.ts` to read graph-keyed pending build state from `useSpaghettiStore`.
- Added a reusable preview-preparation builder and switched `ViewerHost` to consume graph-local preview-prep instead of one global active-graph path.
- Reconnected `SpaghettiPanel` and `DebugInspectorDrawer` to graph-local compile state.

#### Files Changed
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/store/useAppStore.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `docs/Phase-Plans/Tasks/Future/01.05 - SP - Phase 9C.md`
- `docs/Human-Plans/roadmap/roadmap.md`

#### Behavior Changes (if any)
- Spaghetti compile/build memory is now stored per graph document instead of in one global app-store bucket.
- Preview-preparation memory is now graph-local and reused by the viewer bridge.
- Build-seq tracking now resolves through graph identity so `9C` has a clean handoff into later routing work.

#### Verification Steps
- `cmd /c npm test -- src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `cmd /c npm run build`

<!-- ============================================================ -->
### [150] - 2026-03-09 21:16 - `SP - Phase 9C - Task Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`9C\` task doc for graph-local compile/build and preview-preparation bridge work, carrying forward the locked decisions from the roadmap, Decisions file, and Codex notes so the next bridge phase now has its own implementation-planning surface.`

#### Scope / Constraints Honored
- Added only planning/task-doc and roadmap tracking updates.
- Kept `9C` scoped as a bridge phase.
- Did not start `9C` runtime implementation.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.05 - SP - Phase 9C.md`.
- Locked the `9C` implementation target around:
  - graph-local compile/build memory
  - graph-local preview-preparation memory
  - shared worker/viewer infrastructure
  - softened global compile/build seams
- Recorded the live seam focus around:
  - `useAppStore.ts`
  - `bootstrapBuildWiring.ts`
  - `ViewerHost.tsx`
  - `useSpaghettiStore.ts`
- Updated the roadmap dedicated-plan tracker so `[1.1C]` now counts as having its own plan/task doc.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.05 - SP - Phase 9C.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Re-read the locked `9C` roadmap, decisions, and Codex notes sections before writing the task doc.
- Confirmed the roadmap totals after marking `[1.1C]` as having a dedicated plan doc.

<!-- ============================================================ -->
### [149] - 2026-03-09 21:10 - `SP - Phase 9B - Browser Startup Render Loop Fix`
<!-- ============================================================ -->
HUMAN SUMMARY: `Fixed the black-screen startup regression in the new `9B` Browser shell by removing unstable Zustand array selectors from the live React components, which was causing the UI to collapse into an external-store snapshot loop right after mount.`

#### Scope / Constraints Honored
- Kept the fix inside the existing `9B` Browser/runtime surface.
- Did not change the phase boundary, persistence, or graph-routing work.
- Touched only the live React subscription pattern that was causing the startup failure.

#### Summary of Implementation
- Reworked `BrowserPanel` so it subscribes to raw graph/viewport state and derives ordered arrays locally with `useMemo` instead of subscribing with selectors that allocate new arrays every render.
- Reworked `SpaghettiEditor` the same way for the graph-document dropdown source.
- Verified that the store tests still pass and the production build succeeds after removing the unstable selector pattern.

#### Files Changed
- `src/app/panels/BrowserPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The `9B` Browser shell should now stay mounted instead of flashing and then collapsing to a black screen on startup.

#### Verification Steps
- Ran `cmd /c npm run build`
- Ran `cmd /c npm test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`

<!-- ============================================================ -->
### [148] - 2026-03-09 21:06 - `SP - Phase 9B - Browser First Startup Fix`
<!-- ============================================================ -->
HUMAN SUMMARY: `Fixed the first `9B` startup regression where an auto-seeded spaghetti viewport could push the app into an empty graph scene too early, by switching the Browser-first flow to boot with no open spaghetti viewport and keeping the viewer on legacy parts until a real graph viewport is opened.`

#### Scope / Constraints Honored
- Kept the fix inside the existing `9B` Browser-first phase boundary.
- Did not pull in persistence, project ownership, or graph-local compile/build routing.
- Preserved the Browser-first open/focus structure from the main `9B` cut.

#### Summary of Implementation
- Changed the spaghetti store boot path so the app no longer auto-seeds an open editor viewport on startup.
- Kept the active graph-document bridge intact even when no viewport is open.
- Updated `ViewerHost` so spaghetti mode only switches the viewer onto graph preview output when a real active editor viewport exists; otherwise it keeps showing the legacy parts path.
- Updated the store tests to match the new Browser-first/no-auto-open startup behavior.
- Added the carry-forward note to the `9B` task doc close-out section.

#### Files Changed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/components/ViewerHost.tsx`
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The app now boots with Browser available but no automatically opened spaghetti viewport.
- Spaghetti mode no longer forces the viewer into an empty graph preview path unless a real graph viewport is open/focused.

#### Verification Steps
- Ran `cmd /c npm test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`
- Ran `cmd /c npm run build`

<!-- ============================================================ -->
### [147] - 2026-03-09 20:58 - `SP - Phase 9B - Browser First Multi-Viewport Foundation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the first real `9B` Browser-first runtime cut by adding a permanent left-dock Browser tree, expanding `useSpaghettiStore` into a real open/focus viewport manager, moving floating viewport geometry into store-managed viewport state, and wiring the editor header to switch graph bindings per viewport while keeping compile/build routing and project ownership out of scope.`

#### Scope / Constraints Honored
- Implemented only the `9B` Browser/open-focus structural cut.
- Kept graph truth graph-owned and viewport coordination viewport-owned.
- Kept persistence, project ownership, and graph-local compile/build routing out of this phase.
- Kept the first `9B` pass to one visible floating spaghetti surface while allowing more than one live viewport record.

#### Summary of Implementation
- Expanded the shared `EditorViewport` contract to include window mode, position, size, and z-order.
- Reworked `useSpaghettiStore` so it can:
  - create additional graph documents
  - open/focus/close editor viewports
  - bind a viewport to a different graph document
  - keep the active graph bridge/cache synchronized with the focused viewport
- Added a new Browser panel as a permanent left-dock Fusion-style hierarchy shell backed by the current graph/viewport runtime.
- Moved floating spaghetti window position/size ownership out of `AppShell` local state and into viewport-managed store state.
- Added the graph dropdown in `SpaghettiEditor` so one viewport can switch which graph document it is showing.
- Added `useSpaghettiStore` tests covering multi-document and multi-viewport bridge behavior.
- Updated the `9B` task doc and roadmap status to reflect the shipped phase.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/AppShell.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Browser is now a permanent left dock surface instead of only an implied future phase target.
- The focused spaghetti viewport is now chosen from Browser/open-focus viewport state rather than only a one-window shell assumption.
- Floating spaghetti window geometry is now viewport-managed state.
- The editor header can now switch the current viewport to another graph document.
- Multiple live viewport records can exist even though the first pass still renders only one visible floating spaghetti surface.

#### Verification Steps
- Ran `cmd /c npm test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`
- Ran `cmd /c npm run build`

<!-- ============================================================ -->
### [146] - 2026-03-09 20:36 - `OO - Phase 13 - 9B Browser-First Implementation Preference`
<!-- ============================================================ -->
HUMAN SUMMARY: `Recorded the `9B` implementation preference to build the Browser/open-focus structure first and keep only one visible floating spaghetti surface in the first pass, deferring true multiple visible windows until after the Browser coordination model is real.`

#### Scope / Constraints Honored
- Added only planning/reference doc updates.
- Did not change runtime code or implementation order.
- Kept the decision tightly scoped to first-pass `9B` sequencing.

#### Summary of Implementation
- Updated `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md` with the first-pass `9B` implementation preference.
- Recorded the same decision in `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`.
- Locked the sequence as:
  - Browser/open-focus structure first
  - one visible floating surface first
  - true multi-window later

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Confirmed the decision fits the existing `9B` phase boundary and strengthens sequencing without pulling extra scope into the phase.

<!-- ============================================================ -->
### [145] - 2026-03-09 20:34 - `OO - Phase 13 - Browser Visual Direction Capture`
<!-- ============================================================ -->
HUMAN SUMMARY: `Captured the Browser visual direction as a Fusion360-style left hierarchy tree and folded that guidance into the \`9B\` task doc plus active Codex notes, so the Browser phase now has a clearer UI target instead of only an abstract viewport-manager description.`

#### Scope / Constraints Honored
- Added only planning/reference doc updates.
- Did not change runtime code or implementation order.
- Kept the note focused on Browser shape and future row-level controls.

#### Summary of Implementation
- Updated `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md` with a new Browser surface direction section.
- Recorded the same direction in `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`.
- Locked the working Browser mental model as:
  - docked left-side hierarchy tree
  - Fusion360-style navigation surface
  - expandable rows
  - future support for loading bars and richer row-level controls

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Confirmed the new Browser direction note fits the existing `9B` phase boundary and does not pull in unrelated `9C`, persistence, or project-ownership work.

<!-- ============================================================ -->
### [144] - 2026-03-09 18:59 - `SP - Phase 9B - Decision-Complete Plan Doc`
<!-- ============================================================ -->
HUMAN SUMMARY: `Completed the \`9B\` task doc as a decision-complete implementation spec, grounding it in the live \`9A.3\` runtime seams and locking the Browser/viewport/editor coordination model, the viewport-owned vs graph-owned split, the focus and z-order rules, and the deferred boundary with \`9C\`, persistence, and project ownership.`

#### Scope / Constraints Honored
- Completed only the planning/task-doc work for `9B`.
- Kept the phase scoped to Browser-coordinated multi-editor foundation work.
- Did not start the `9B` runtime implementation.
- Preserved `9C`, persistence, and project ownership as deferred work.

#### Summary of Implementation
- Reworked `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md` into a decision-complete execution spec.
- Added explicit carry-forward rules from `9A`.
- Locked the first real `9B` runtime model:
  - multiple editor viewports
  - one focused viewport
  - one `meatball editor view` maximum
  - viewport-managed position/size/z-order
- Locked the Browser -> viewport -> panel -> editor flow and graph-switching behavior.
- Tightened the current seam findings using the live `AppShell`, `useSpaghettiStore`, `SpaghettiPanel`, and `SpaghettiEditor` runtime shape.
- Tightened acceptance criteria and deferred boundaries so `9B` does not collapse into `9C`, `GE 11`, or `GE 12`.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Re-read the live `9A.3` runtime seams in `AppShell.tsx`, `useSpaghettiStore.ts`, `SpaghettiPanel.tsx`, and `SpaghettiEditor.tsx`.
- Re-read `CHANGELOG.md`, `6_CodexChatNotes.md`, `7_CodexChatNotes.md`, `roadmap.md`, and `Decisions.MD` before tightening the `9B` task doc.

<!-- ============================================================ -->
### [143] - 2026-03-09 18:51 - `SP - Phase 9B - Task Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`9B\` task doc for the multi-editor Browser foundation, carrying forward the locked viewport, focus, z-order, graph-switching, and single-\`meatball editor view\` rules so the next Browser-foundation phase now has its own execution-planning surface.`

#### Scope / Constraints Honored
- Added only the planning/task-doc setup for `9B`.
- Kept the phase scoped to Browser-coordinated multi-editor foundation work.
- Did not start the `9B` runtime implementation.
- Updated the roadmap and changelog in the same change set.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`.
- Locked the core `9B` direction:
  - more than one graph editor surface
  - Browser-coordinated open/focused viewport state
  - graph switching inside one editor viewport
  - focus/z-order rules
  - single `meatball editor view` rule
- Kept graph truth graph-owned and viewport state viewport-owned.
- Updated the roadmap dedicated-plan tracker so `9B` is counted as having its own task doc.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Re-read the locked `9B` roadmap and decisions sections before writing the task doc.
- Reused the current `9A.x` task-doc structure so the new phase doc matches the existing planning workflow.

<!-- ============================================================ -->
### [142] - 2026-03-09 18:13 - `OO - Phase 13 - Roadmap 9A Status Refresh`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the roadmap so the `9A` lane-body checklists now reflect the real `9A.2` and `9A.3` implementation work, and refreshed the dedicated plan-doc tracker to count the finished `9A.3` task file.`

#### Scope / Constraints Honored
- Updated only roadmap tracking/docs state.
- Kept the refresh strict to work that actually landed.
- Did not mark broader `9B`, `9C`, or later lane items complete.

#### Summary of Implementation
- Added a new roadmap doc-history note for the refresh.
- Marked the `9A` phase-level lane-body checklist as partly landed where appropriate:
  - empty graph documents valid
  - minimum graph document shape locked
  - authored graph/canvas persistence truth defined
- Marked the `9A.2` lane-body checklist complete for:
  - node positions
  - edge wiring/connections
  - node values/config
  - node row mode
- Marked the `9A.3` lane-body checklist complete for:
  - viewport binding by `graphDocumentId`
  - first singleton graph/store split
  - moving spaghetti document memory out of one app-global bucket
  - keeping Browser/persistence work out of the slice
- Updated the dedicated plan-doc checklist and totals so `9A.3` is counted as having its own task doc.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Re-read the `9A` lane-body roadmap entries against the completed `9A.1`, `9A.2`, and `9A.3` task docs and the landed implementation state before marking items complete.

<!-- ============================================================ -->
### [141] - 2026-03-09 18:09 - `OO - Phase 13 - 9A Carry-Forward Lessons Capture`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a compact carry-forward note in \`7_CodexChatNotes.md\` capturing the main lessons from \`9A.1\` through \`9A.3\`, including the working store split, the usefulness of narrow temporary bridges, the authored-vs-local state boundary, and the main future pressure seams for \`9B\` and \`9C\`.`

#### Scope / Constraints Honored
- Added only planning/reference notes.
- Did not change runtime code or roadmap ordering.
- Kept the notes focused on reusable architectural lessons instead of repeating task-doc detail.

#### Summary of Implementation
- Added one new numbered notes entry in `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`.
- Captured the main `9A` carry-forward lessons:
  - `useSpaghettiStore` vs `useAppStore` ownership split
  - narrow temporary bridges are acceptable when explicit
  - graph-owned vs local presentation state boundary
  - hidden active-graph consumers across the runtime chain
  - value of phase-pure cuts
  - likely next pressure seams for `9B` and `9C`

#### Files Changed
- `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Continued the active notes numbering from `[88]` to `[89]`.
- Confirmed the note was added to the current active `7_CodexChatNotes.md` surface.

<!-- ============================================================ -->
### [140] - 2026-03-09 18:07 - `OO - Phase 13 - Codex Notes Naming Decision Capture`
<!-- ============================================================ -->
HUMAN SUMMARY: `Seeded the new active \`7_CodexChatNotes.md\` file and recorded the decision to keep the current spaghetti/app store and editor names for now, deferring any rename pass until the ownership seams settle enough to make better names obvious.`

#### Scope / Constraints Honored
- Added only a small durable notes update.
- Did not change runtime code or phase implementation state.
- Preserved the decision as a carry-forward note instead of starting a rename pass.

#### Summary of Implementation
- Created the active `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md` notes surface.
- Added one new numbered note:
  - keep current store/editor names for now
  - revisit only if the names become a real source of confusion later
  - likely first rename candidate remains `useSpaghettiUiStore`

#### Files Changed
- `docs/Human-Plans/CodexNotes/7_CodexChatNotes.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Confirmed `7_CodexChatNotes.md` was empty before seeding it.
- Continued the absolute numbered notes path after `[87]` in `6_CodexChatNotes.md`.

<!-- ============================================================ -->
### [139] - 2026-03-09 18:01 - `SP - Phase 9A.3 - Viewport Binding And First Singleton Split`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the \`9A.3\` viewport-binding cut by adding the first editor viewport container in \`useSpaghettiStore\`, keeping it synchronized with the active graph-document bridge, and rewiring the spaghetti shell/panel/editor path to consume explicit \`editorViewportId\` and \`graphDocumentId\` binding without pulling full Browser or graph-routing work forward.`

#### Scope / Constraints Honored
- Implemented only the narrow `9A.3` viewport-binding cut.
- Kept viewport state in `useSpaghettiStore`, not `useAppStore`.
- Preserved `activeGraphDocumentId` as a temporary compatibility bridge.
- Kept floating window position/size in `AppShell`.
- Did not pull in multi-viewport coordination, graph switching UX, persistence, or graph-local compile/build routing.

#### Summary of Implementation
- Added the first viewport runtime seam:
  - `EditorViewport` type
  - `editorViewportsById`
  - `editorViewportOrder`
  - `activeEditorViewportId`
  - `setActiveEditorViewportId`
- Added explicit viewport/document selectors in `useSpaghettiStore` for:
  - active viewport
  - viewport by id
  - graph document by id
  - graph by document id
- Seeded one default floating viewport bound to the active graph document and kept `activeGraphDocumentId` synchronized as the current compatibility bridge.
- Rewired the runtime component flow so:
  - `AppShell` renders spaghetti through the active viewport seam
  - `SpaghettiPanel` receives `editorViewportId`
  - `SpaghettiEditor` receives `editorViewportId` and `graphDocumentId`
  - `ExpandedEditor`, `CollapsedEditor`, and `SpaghettiCanvas` read graph data by explicit `graphDocumentId`
- Updated the `9A.3` task doc to mark the implementation complete and record close-out notes.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/AppShell.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/ui/ExpandedEditor.tsx`
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The spaghetti editor surface now mounts through an explicit editor viewport binding instead of relying only on one implicit global graph/editor seam.
- The compile/build bridge still uses the active graph document, so behavior remains stable while the editor-binding seam becomes explicit.

#### Verification Steps
- `cmd /c npm test -- src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `cmd /c npm run build`

<!-- ============================================================ -->
### [138] - 2026-03-09 17:50 - `SP - Phase 9A.3 - Decision-Complete Plan Doc`
<!-- ============================================================ -->
HUMAN SUMMARY: `Completed the \`9A.3\` task doc as a decision-complete implementation spec, locking the first \`EditorViewport\` contract, its runtime placement in \`useSpaghettiStore\`, the explicit \`AppShell -> SpaghettiPanel -> SpaghettiEditor\` binding flow, and the temporary \`activeGraphDocumentId\` bridge so viewport binding can be implemented without dragging in \`9B\` or \`9C\`.`

#### Scope / Constraints Honored
- Completed only the planning/task-doc work for `9A.3`.
- Kept the phase narrow to single-viewport binding and the first singleton split.
- Did not start runtime implementation for viewport binding.
- Preserved `9B`, `9C`, persistence, and routing as deferred work.

#### Summary of Implementation
- Completed `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md` as an implementation-ready execution spec.
- Locked the first-pass runtime placement:
  - graph documents stay in `useSpaghettiStore`
  - the first viewport container also lives in `useSpaghettiStore`
  - `useAppStore` stays as temporary app-shell mode and compile/build bridge state
- Added explicit first-pass contracts for:
  - `EditorViewport`
  - `SpaghettiViewportState`
  - `SpaghettiPanelProps`
  - `SpaghettiEditorProps`
- Added the explicit binding flow and temporary compatibility rule so `activeGraphDocumentId` remains synchronized with the active viewport binding during `9A.3`.
- Tightened the implementation sequence, guardrails, and acceptance checks so the implementer does not need to choose where viewport state lives or how panel/editor binding should flow.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Reviewed `src/app/AppShell.tsx`, `src/app/panels/SpaghettiPanel.tsx`, `src/app/spaghetti/ui/SpaghettiEditor.tsx`, `src/app/spaghetti/store/useSpaghettiStore.ts`, and `src/app/store/useAppStore.ts` to ground the plan in the current runtime seams.
- Rechecked `docs/Human-Plans/roadmap/roadmap.md`, `docs/Human-Plans/Decisions.MD`, and `docs/Human-Plans/CodexNotes/6_CodexChatNotes.md` to keep the final `9A.3` task doc aligned with the locked roadmap direction.

<!-- ============================================================ -->
### [137] - 2026-03-09 17:43 - `SP - Phase 9A.3 - Viewport Binding Plan Doc Setup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the dedicated \`9A.3\` task doc for viewport binding and the first singleton split, aligning it with the locked roadmap and decisions so the next editor-binding cut now has its own implementation-ready planning surface. Also refreshed the roadmap plan-doc status counts so Lane \`[1.1A.3]\` is tracked as having a dedicated task file.`

#### Scope / Constraints Honored
- Added only the planning/task-doc setup for `9A.3`.
- Kept the new doc aligned with the existing `9A.1` / `9A.2` task-doc structure.
- Did not start implementation code for viewport binding.
- Updated the roadmap and changelog in the same change set per repo maintenance rules.

#### Summary of Implementation
- Created `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md`.
- Narrowed the plan to the intended `9A.3` cut:
  - first explicit `EditorViewport` contract
  - binding editor viewport identity to `graphDocumentId`
  - breaking the one-window spaghetti assumption without absorbing `9B`
- Documented current seams in:
  - `AppShell.tsx`
  - `SpaghettiPanel.tsx`
  - `SpaghettiEditor.tsx`
- Added the standard execution sections:
  - progress checklist
  - architecture spec
  - master checklist
  - implementation plan
  - close-out notes
- Updated roadmap `Plan.md Status` for `[1.1A.3]` and refreshed the dedicated-doc totals.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changed.

#### Verification Steps
- Reviewed `docs/Human-Plans/roadmap/roadmap.md` and `docs/Human-Plans/Decisions.MD` to align the new task doc with the current `9A.3` planning boundary.
- Reviewed `src/app/AppShell.tsx`, `src/app/panels/SpaghettiPanel.tsx`, and `src/app/spaghetti/ui/SpaghettiEditor.tsx` to ground the new plan in the current singleton seams.

<!-- ============================================================ -->
### [136] - 2026-03-09 17:25 - `SP - Phase 9A.2 - Graph-Owned Node Row Mode`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented the narrow \`9A.2\` authored-canvas cut by moving per-node row mode into graph-owned state under \`SpaghettiGraph.ui.nodeModesByNodeId\`. Kept section/group/composite collapse, composite expansion, and other viewport-local interaction state out of canonical graph truth, removed node-mode ownership from \`useSpaghettiUiStore\`, and verified the change with targeted Vitest coverage plus a full build.`

#### Scope / Constraints Honored
- Implemented only the narrow `9A.2` move.
- Kept `SpaghettiGraph.ui` as the state home instead of adding a new top-level authored-canvas object.
- Kept section/group/composite collapse local.
- Kept composite expansion, selection, hover, drag, pan/zoom, menus, and `edgeWaypoints` out of canonical graph-owned truth.
- Kept `inputMode` as temporary UI mode state.

#### Summary of Implementation
- Extended `SpaghettiGraph.ui` with sparse `nodeModesByNodeId` support.
- Added schema parsing support for graph-owned node modes.
- Added store-side node-mode selector and mutation helpers in `useSpaghettiStore`.
- Normalized node-mode storage so default `essentials` entries are omitted and stale node-mode entries are pruned during graph normalization.
- Reconnected `SpaghettiCanvas` to write node mode through graph-owned store actions.
- Reconnected `NodeView` to render from graph-owned node mode passed down from the canvas runtime.
- Removed node-mode ownership from `useSpaghettiUiStore`, leaving it responsible only for local collapse state.
- Updated tests for schema parsing, store behavior, UI-store behavior, and `NodeView` rendering.
- Marked the `9A.2` task doc as complete.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Per-node row mode is now graph-owned authored state.
- Default `essentials` mode is implicit and no longer needs explicit storage.
- `useSpaghettiUiStore` no longer owns node-mode truth.

#### Verification Steps
- Ran `cmd /c npm test -- src/app/spaghetti/schema/spaghettiSchema.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- Ran `cmd /c npm run build`

<!-- ============================================================ -->
### [135] - 2026-03-09 17:10 - `DOC - Phase 14 - Tighten SP 9A.2 Into Implementation-Ready Spec`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reworked the \`SP 9A.2\` task doc into a decision-complete implementation spec. Narrowed the phase to one concrete authored-canvas move: per-node row mode becomes graph-owned under \`SpaghettiGraph.ui\`, while section/group/composite collapse and other viewport-local canvas state stay out of scope for this cut.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept `9A.2` phase-pure and intentionally narrow.
- Did not fold `9A.3`, `9B`, persistence, or routing work into the spec.
- Kept section/group/composite collapse, composite expansion, and other viewport-local state out of canonical graph-owned truth for this phase.

#### Summary of Implementation
- Rewrote `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md` into an implementation-ready spec.
- Locked the canonical `9A.2` state contract to extend existing `SpaghettiGraph.ui` with `nodeModesByNodeId`.
- Replaced broad authored-canvas wording with code-grounded seams from `spaghettiUiStore`, `NodeView`, and `SpaghettiCanvas`.
- Locked the execution sequence around moving only node-mode ownership from `useSpaghettiUiStore` into the graph-owned seam.
- Added precise acceptance checks for schema parsing, sparse-default storage, store updates, UI reads/writes, and boundary preservation.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The `9A.2` task doc is now specific enough to implement directly without leaving ownership decisions to the implementer.

#### Verification Steps
- Re-read the current runtime seams in:
  - `src/app/spaghetti/schema/spaghettiTypes.ts`
  - `src/app/spaghetti/canvas/state/spaghettiUiStore.ts`
  - `src/app/spaghetti/canvas/NodeView.tsx`
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- Confirmed the rewritten task doc now matches the real code seams and the already-locked `Decisions.MD` direction.

<!-- ============================================================ -->
### [134] - 2026-03-09 16:20 - `DOC - Phase 14 - Create SP 9A.2 Task Doc`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created the next phase-task planning doc for \`[1.1A.2] SP - Phase 9A.2 - Graph-Owned Authored Canvas State\` and updated the roadmap to show that the dedicated doc now exists. The new plan stays phase-pure: it focuses on graph-authored canvas truth, node row mode ownership, and keeping viewport/editor-local state out of canonical graph state.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept the new task doc scoped to `9A.2` only.
- Did not fold `9A.3`, `9B`, or `9C` work into this file.

#### Summary of Implementation
- Added `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md`.
- Built the new file in the same planning shape used for `9A.1`:
  - `Progress CheckList`
  - `Doc Header`
  - `Arch Spec`
  - `Master CheckList`
  - `Plan.md`
  - `Close Out notes`
- Locked the `9A.2` planning focus around graph-owned authored canvas truth, especially node row mode, while keeping `selection`, `hover`, drag, pan/zoom, menu state, and `edgeWaypoints` out of canonical graph-owned truth by default.
- Updated the roadmap `Plan.md Status` for `[1.1A.2]` and refreshed the dedicated-plan totals.

#### Files Changed
- `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md`
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The planning system now has dedicated future task docs for both `9A.1` and `9A.2`.

#### Verification Steps
- Reviewed `docs/Phase-Plans/00_Phase-Setup.md` for task-doc placement and naming context.
- Reviewed `docs/Phase-Plans/Tasks/Future/01.01 - SP - Phase 9.md` and mirrored its planning structure for the next phase.
- Updated the roadmap to reflect the new dedicated `9A.2` task doc.

<!-- ============================================================ -->
### [133] - 2026-03-09 16:20 - `DOC - Phase 14 - Roadmap Checkbox Refresh After SP 9A.1`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the human roadmap checklists to reflect the real state after the \`SP 9A.1\` implementation cut. Marked the dedicated \`9A.1\` plan doc as created, updated the dedicated-plan totals, and checked only the specific roadmap bullets that were actually completed by the first graph-document pass.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept roadmap status strict to the work that is actually done.
- Did not mark broader `1.1`, `1.1A`, or later phases complete just because `9A.1` landed.

#### Summary of Implementation
- Added a new roadmap doc-history line explaining the post-`9A.1` checklist refresh.
- Marked `Plan.md Status` complete for `[1.1A.1] SP - Phase 9A.1 - Graph Document Shape And Identity`.
- Updated the dedicated-plan totals from `0 / 27` to `1 / 26`.
- Checked the specific `9A.1` lane-body checklist bullets that are now true:
  - `graphDocumentId`, `name`, and `version`
  - `graph.nodes` and `graph.edges` as the core payload
  - empty graph documents valid

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The roadmap now more accurately shows that `9A.1` has both a real task doc and a completed first implementation pass.

#### Verification Steps
- Reviewed the roadmap `Plan.md Status` and `Dedicated Plan.md CheckList Total` sections against the existing `01.01 - SP - Phase 9.md` task doc.
- Checked only the `9A.1` checklist bullets that are directly supported by the landed implementation.

<!-- ============================================================ -->
### [132] - 2026-03-09 16:11 - `SP - Phase 9 - Graph Document Foundations 9A.1 Cut`
<!-- ============================================================ -->
HUMAN SUMMARY: `Introduced the first canonical \`GraphDocument\` contract for spaghetti graphs, added a runtime active-document container in the spaghetti store, and re-routed app/editor/viewer consumers through the document layer while keeping viewport-only state out of the first-pass document shape. Added direct schema/store tests for the new document behavior and verified the cut with build plus targeted Vitest runs.`

#### Scope / Constraints Honored
- Implemented only the `9A.1` graph-document foundation cut.
- Kept `inputMode` as temporary UI mode state.
- Kept `edgeWaypoints` outside canonical `GraphDocument` state.
- Kept viewport/editor-local state outside canonical `GraphDocument` state.
- Did not introduce persistence, multi-viewport binding, or Browser/project ownership work.

#### Summary of Implementation
- Added `GraphDocument` and `GraphDocumentVersion` to the spaghetti schema types.
- Added `graphDocumentSchema` and `parseGraphDocument` so the first-pass document contract is validated separately from raw `SpaghettiGraph`.
- Added `graphDocumentsById`, `graphDocumentOrder`, and `activeGraphDocumentId` to `useSpaghettiStore`.
- Wrapped the current singleton graph as the first runtime `GraphDocument` and kept the legacy `graph` bridge synchronized to the active document graph during the refactor cut.
- Added `selectActiveGraphDocument` and `selectActiveGraph` selectors and switched `useAppStore`, `ViewerHost`, `PartsListPanel`, `CollapsedEditor`, `DebugInspectorDrawer`, `SpaghettiEditor`, and `SpaghettiCanvas` to consume canonical graph data through the document layer.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/Phase-Plans/Tasks/Future/01.01 - SP - Phase 9.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The spaghetti runtime now has explicit active graph-document identity instead of relying only on the singleton graph field.
- Compile/build and UI graph consumers now resolve the active graph through the document layer.
- The first-pass document contract remains limited to `graphDocumentId`, `name`, `version`, and `graph`.

#### Verification Steps
- Ran `cmd /c npm run build`
- Ran `cmd /c npm test -- src/app/spaghetti/schema/spaghettiSchema.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts`
- Added close-out implementation notes to `docs/Phase-Plans/Tasks/Future/01.01 - SP - Phase 9.md`

<!-- ============================================================ -->
### [131] - 2026-03-07 12:08 - `DOC - Phase 13 - Canonical Changelog Rewrite - Draft Recovered Entry Shapes From History Log`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reworked the Reference - Planned CHANGELOG.md Entry Shapes section in docs/Phases/OO - Phase 13 - Canonical Changelog Rewrite.md so it reads like actual draft recovered changelog entries instead of thin placeholder shapes. Used docs/History/0 - History-TaskLog.md as the main source for the early recovered Conv 8 band and tightened the later recovered entries against the canonical phase log.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Reworked the `Reference - Planned CHANGELOG.md Entry Shapes` section in `docs/Phases/OO - Phase 13 - Canonical Changelog Rewrite.md` so it reads like actual draft recovered changelog entries instead of thin placeholder shapes.
- Used `docs/History/0 - History-TaskLog.md` as the main source for the early recovered Conv 8 band and tightened the later recovered entries against the canonical phase log.
- Added a clear source rule inside the plan doc so the early recovered entries, later recovered entries, and inferred gap entries each point back to the right evidence source.
- Expanded the early recovered entry drafts with more concrete summary bullets and file lists so the phase plan now shows a more realistic preview of what will be written into the canonical rewritten changelog.

#### Files Changed
- `docs/Phases/OO - Phase 13 - Canonical Changelog Rewrite.md` (now DOC - Phase Plans.md)
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The Phase 13 planning doc now gives a much clearer preview of the recovered changelog text that will eventually be inserted into `docs/CHANGELOG.md`.

#### Verification Steps
- Reviewed `docs/History/0 - History-TaskLog.md` and `docs/Phases/00_Phase_Log.md` while revising the draft entry shapes.
- Confirmed the Phase 13 reference section now distinguishes Conv 8 source entries, Conv 9 source entries, and explicitly inferred gap entries.
- Confirmed the updated draft entries still follow the example changelog format shape already defined in the phase plan.
- No build or test run required for this documentation-only update.

<!-- ============================================================ -->
### [130] - 2026-03-07 10:51 - `DOC - Phase 12 - Phase Setup Cleanup - Add Future Phase File Checklist Format Rule`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a Future Phase File Setup Rule to docs/Phases/00_Phase-Setup.md. Defined the required top-of-file structure for future phase planning docs in docs/Phases/Future/.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added a `Future Phase File Setup Rule` to `docs/Phases/00_Phase-Setup.md`.
- Defined the required top-of-file structure for future phase planning docs in `docs/Phases/Future/`.
- Required the high-detail checklist in future phase files to use one visible parent checklist with section items and sub-checklist items underneath.
- Kept the workflow split intact so `AGENTS.md` still owns the enforcement/workflow rule while `00_Phase-Setup.md` now owns the practical setup/template guidance.

#### Files Changed
- `docs/Phases/00_Phase-Setup.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- Future phase files now have an explicit required checklist shape defined in the canonical phase setup doc.

#### Verification Steps
- Reviewed the updated `00_Phase-Setup.md` and confirmed it now includes the future phase-file naming rule, required sections, and checklist format example.
- Confirmed the `Phase Loop Rule` remains in `AGENTS.md` so setup guidance and workflow enforcement stay split cleanly.
- No build or test run required for this documentation-only update.

<!-- ============================================================ -->
### [129] - 2026-03-07 10:37 - `DOC - Phase 12 - Repo Docs And Workflow Cleanup - Consolidate Chill Batch #3`
<!-- ============================================================ -->
HUMAN SUMMARY: `Consolidated the active chill-mode work into one permanent changelog entry and one permanent docs/change-List.md line. Reworked the current phase docs so the canonical setup, checklist, and log now have a cleaner split between phase-system definition, future phase planning, and completed phase history.`

#### Scope / Constraints Honored
- Documentation-only consolidation.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.
- Consolidated only `Chill Batch #3`.

#### Summary of Implementation
- Consolidated the active chill-mode work into one permanent changelog entry and one permanent `docs/change-List.md` line.
- Reworked the current phase docs so the canonical setup, checklist, and log now have a cleaner split between phase-system definition, future phase planning, and completed phase history.
- Expanded the repo-reference docs with a clearer repository snapshot, multi-level hierarchy views, snapshot explanation notes, and a restated ownership-boundary golden rule.
- Tightened the repo workflow rules in `AGENTS.md`, including the phase-doc split, the new phase loop workflow, and a lighter chill-mode diff policy for routine small edits.
- Continued the recovered-history cleanup with formatted `COPY` files, prompt/response summaries, missing-task reconstruction, and stronger compiled history notes around the early `/20/` restart seam.

#### Files Changed
- `AGENTS.md`
- `docs/Chill-Log.md`
- `docs/DOCindex.md`
- `docs/History/0 - compiled-HISTORY.md`
- `docs/History/8 - COPY.md`
- `docs/History/9 - COPY.md`
- `docs/History/12 - COPY.md`
- `docs/History/MISSINGTASKS.md`
- `docs/Phases/00_Phase-CheckList.md`
- `docs/Phases/00_Phase-Setup.md`
- `docs/Phases/00_Phase_Log.md`
- `docs/Phases/00_Phase_List.md`
- `docs/TASKLIST.md`
- `docs/TaskHistoryCompilation.md`
- `docs/repo.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a clearer standing phase workflow: `00_Phase-Setup.md` for classification and future planning, `docs/Phases/Future/*.md` for active phase plans, and `00_Phase_Log.md` for completed detailed phase history.
- `Chill Batch #3` is now permanently recorded in the repo changelog under `[104]`.

#### Verification Steps
- Reviewed the active entries in `Chill Batch #3` and consolidated them into one permanent changelog entry.
- Added the matching one-line permanent entry to `docs/change-List.md`.
- Marked `Chill Batch #3` as compiled in `docs/Chill-Log.md`.
- No build or test run required for this documentation-only consolidation.

<!-- ============================================================ -->
### [128] - 2026-03-06 20:51 - `DOC - Phase 9 - Chill Mode Docs Workflow - Rename Canonical Chill Log To Chill-Log`
<!-- ============================================================ -->
HUMAN SUMMARY: `Renamed the canonical chill-mode file from docs/Chill-Mode-Edits.md to docs/Chill-Log.md. Updated the renamed file so its title, purpose, and canonical note use the new chill-log name.`

#### Scope / Constraints Honored
- Documentation-only update.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Renamed the canonical chill-mode file from `docs/Chill-Mode-Edits.md` to `docs/Chill-Log.md`.
- Updated the renamed file so its title, purpose, and canonical note use the new chill-log name.
- Updated `AGENTS.md` and `docs/Documentation-Rules.md` so the repo's active chill-mode instructions now point to `docs/Chill-Log.md`.

#### Files Changed
- `AGENTS.md`
- `docs/Chill-Log.md`
- `docs/Documentation-Rules.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The canonical chill-mode log path is now `docs/Chill-Log.md`.

#### Verification Steps
- Reviewed the renamed chill-mode file and confirmed the active batch history remained intact.
- Updated the live chill-mode references in `AGENTS.md` and `docs/Documentation-Rules.md` to the new path.
- No build or test run required for this documentation-only rename.

<!-- ============================================================ -->
### [127] - 2026-03-06 20:47 - `DOC - Phase 11 - History And Phase-System Consolidation - Consolidate Chill Batch #2`
<!-- ============================================================ -->
HUMAN SUMMARY: `Consolidated the active chill-mode work into one permanent changelog entry and one permanent docs/change-List.md line. Rebuilt the restored history system around structured historian summaries, compiled-history continuity, ordered restored task logs, and explicit gap tracking between recovered /20/ history and the shipped changelog era.`

#### Scope / Constraints Honored
- Documentation-only consolidation.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.
- Consolidated only `Chill Batch #2`.

#### Summary of Implementation
- Consolidated the active chill-mode work into one permanent changelog entry and one permanent `docs/change-List.md` line.
- Rebuilt the restored history system around structured historian summaries, compiled-history continuity, ordered restored task logs, and explicit gap tracking between recovered `/20/` history and the shipped changelog era.
- Reworked the canonical docs and phase system around one active prefix model, including the canonical phase setup, grouped phase checklist, chronological phase list, and the supporting documentation rules.
- Added and expanded roadmap and planning docs covering the current ParaHook vision, Spaghetti Studio direction, leaving legacy, and the current product/architecture roadmap layers.
- Tightened the chill-mode file itself so the active chill log now matches the current `AGENTS.md` workflow without deleting older chill-history files.

#### Files Changed
- `docs/Chill-Mode-Edits.md`
- `docs/Change-List-COMPILED.md`
- `docs/Documentation-Rules.md`
- `docs/TaskHistoryCompilation.md`
- `docs/Bugs/0_Bug_Report.md`
- `docs/History/0 - compiled-HISTORY.md`
- `docs/History/0 - GIT.md`
- `docs/History/0 - History-TaskList.md`
- `docs/History/0 - History-TaskLog.md`
- `docs/History/1 - chatgpt.md`
- `docs/History/2 - chatgpt.md`
- `docs/History/3 - chatgpt.md`
- `docs/History/4 - chatgpt.md`
- `docs/History/5 - chatgpt.md`
- `docs/History/6 - chatgpt.md`
- `docs/History/7 - chatgpt.md`
- `docs/History/8 - chatgpt.md`
- `docs/History/9 - chatgpt.md`
- `docs/History/10 - chatgpt.md`
- `docs/History/11 - chatgpt.md`
- `docs/Phases/00_Phase-Setup.md`
- `docs/Phases/00_Phase-CheckList.md`
- `docs/Phases/00_Phase_List.md`
- `docs/Phases/00_Phase_Log.md`
- `docs/Plans/README.md`
- `docs/Plans/Architecture/Spaghetti-Editor-Arch/Spaghetti-Editor-Explained.md`
- `docs/Plans/Wish-Features/WISHLIST.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.0 - Master Spaghetti.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.5 - Muliple Spaghetti Bowls.md`
- `docs/roadmap/02_Vision-Roadmap.md`
- `docs/roadmap/03_Spaghetti-Studio.md`
- `docs/roadmap/Focused-Roadmap.md`
- `docs/roadmap/LEAVING-legacy.md`
- `docs/roadmap/Medium ROADMAP.md`
- `docs/tasks/001 - GE - Phase 1 - Clean Restart.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a more coherent history-reconstruction system, a more stable canonical phase system, and clearer roadmap docs for the current ParaHook-to-Spaghetti-Studio direction.
- `Chill Batch #2` is now permanently recorded in the repo changelog under `[102]`.

#### Verification Steps
- Reviewed the active entries in `Chill Batch #2` and consolidated them into one permanent changelog entry.
- Added the matching one-line permanent entry to `docs/change-List.md`.
- Marked `Chill Batch #2` as compiled in `docs/Chill-Mode-Edits.md`.
- No build or test run required for this documentation-only consolidation.

<!-- ============================================================ -->
### [126] - 2026-03-06 02:35 - `DOC - Phase 10 - Docs Planning Sprint - Consolidate Chill Batch #1`
<!-- ============================================================ -->
HUMAN SUMMARY: `Consolidated Chill Batch #1 into one permanent changelog entry and one permanent change-List.md line. Organized the repoï¿½s planning/docs structure around architecture, wish features, Spaghetti editor planning, roadmap cleanup, and unresolved decisions.`

#### Scope / Constraints Honored
- Documentation-only consolidation.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.
- Consolidated only `Chill Batch #1`.

#### Summary of Implementation
- Consolidated `Chill Batch #1` into one permanent changelog entry and one permanent `change-List.md` line.
- Organized the repoï¿½s planning/docs structure around architecture, wish features, Spaghetti editor planning, roadmap cleanup, and unresolved decisions.
- Added and expanded core planning docs for the current `/20/` app, including architecture history, system map, glossary, old-feature wishlist, Jake mode direction, decisions backlog, and Spaghetti editor concept docs.
- Refined the chill-mode workflow itself by adding numbered batch entries, per-doc `Doc History` rules, and timestamped local doc histories.
- Cleaned up several planning docs from pasted transcript form into structured reference notes.

#### Files Changed
- `AGENTS.md`
- `docs/chill-mode-ChangeList.md`
- `docs/change-List.md`
- `docs/Plans/File-List.md`
- `docs/Plans/Temp-CHANGELOG-Entry.md`
- `docs/Plans/Architecture/Glossary.md`
- `docs/Plans/Architecture/History.md`
- `docs/Plans/Architecture/System-Map.md`
- `docs/Plans/Decisions.MD`
- `docs/Plans/Wish-Features/00 - old-Wishes.md`
- `docs/Plans/Wish-Features/04 - Gizmo.md`
- `docs/Plans/Wish-Features/10 - radio-Sampler.md`
- `docs/Plans/Wish-Features/11 - Scenes.md`
- `docs/Plans/Wish-Features/Jake-Mode.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.0 - Master Spaghetti.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.1 - Spaghetti Editor.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.2 - Spaghetti Editor Tool Bar.md`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.3 - Wires ui`
- `docs/Plans/Wish-Features/Spaghetti-Editor/01.4 - Nodes.md`
- `docs/roadmap/LegacyList.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The docs system now has a clearer planning structure and a cleaner distinction between architecture docs, wishlist docs, Spaghetti editor docs, roadmap cleanup notes, and open decisions.
- `Chill Batch #1` is now permanently recorded in the repo changelog under `[101]`.

#### Verification Steps
- Reviewed all numbered entries in `Chill Batch #1` and consolidated them into one coherent permanent changelog entry.
- Added the matching one-line entry to `docs/change-List.md`.
- Marked `Chill Batch #1` as compiled in `docs/chill-mode-ChangeList.md`.
- No build or test run required for this docs-only consolidation.

<!-- ============================================================ -->
### [125] - 2026-03-05 23:57 - `DOC - Phase 9 - Chill Mode Docs Workflow - Add Temporary Chill Change Log File`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/chill-mode-ChangeList.md as a temporary logging file for chill-mode edit batches. Initialized the file with purpose text, batch rules, and a starter Chill Batch #1 template.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/chill-mode-ChangeList.md` as a temporary logging file for chill-mode edit batches.
- Initialized the file with purpose text, batch rules, and a starter `Chill Batch #1` template.
- Left permanent tracking behavior unchanged outside chill mode.

#### Files Changed
- `docs/chill-mode-ChangeList.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a dedicated temporary file for collecting chill-mode edit batches before consolidation.

#### Verification Steps
- Reviewed the new chill-mode log file structure and starter batch template.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [124] - 2026-03-05 23:54 - `DOC - Phase 9 - Chill Mode Docs Workflow - Add Chill Mode To AGENTS.md`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a Chill Mode Rule to AGENTS.md. Defined docs/Chill-Mode-Edits.md as the temporary log file for rapid small edits during chill mode.`

#### Scope / Constraints Honored
- Documentation/process update only.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.

#### Summary of Implementation
- Added a `Chill Mode Rule` to `AGENTS.md`.
- Defined `docs/Chill-Mode-Edits.md` as the temporary log file for rapid small edits during chill mode.
- Defined the active `Chill Batch` workflow, including explicit activation, one active batch at a time, and consolidation into one `docs/CHANGELOG.md` entry plus one `docs/change-List.md` line when the user says `Update changelog`.

#### Files Changed
- `AGENTS.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- `AGENTS.md` now supports a special chill-mode workflow for rapid small edits without creating a permanent changelog entry for each edit.
- Outside chill mode, the normal `docs/CHANGELOG.md` and `docs/change-List.md` rules still apply.

#### Verification Steps
- Reviewed the updated `AGENTS.md` rules for consistency with the requested chill-mode workflow.
- No build or test run required for this docs-only policy update.

<!-- ============================================================ -->
### [123] - 2026-03-05 23:43 - `DOC - Phase 8 - Wish Features Setup - Spaghetti Editor Toolbar Wishlist`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/Wish-Features/3 - Spaghetti Editor Tool Bar.md to capture the desired future cleanup of the Spaghetti Editor toolbar area. Documented the current fragmented control ownership across SpaghettiPanel, SpaghettiEditor, and SpaghettiCanvas.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/Wish-Features/3 - Spaghetti Editor Tool Bar.md` to capture the desired future cleanup of the Spaghetti Editor toolbar area.
- Documented the current fragmented control ownership across `SpaghettiPanel`, `SpaghettiEditor`, and `SpaghettiCanvas`.
- Captured the requested direction: improve help text, redesign sample/load controls, reduce info-window height, move the toolbar drag bar below the toolbar, and move canvas-toolbar controls into the main toolbar.

#### Files Changed
- `docs/Wish-Features/3 - Spaghetti Editor Tool Bar.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a dedicated wishlist doc for the future Spaghetti Editor toolbar cleanup.

#### Verification Steps
- Reviewed the new doc against the current control split in `SpaghettiPanel`, `SpaghettiEditor`, and `SpaghettiCanvas`.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [122] - 2026-03-05 23:37 - `DOC - Phase 8 - Wish Features Setup - Spaghetti Editor Wishlist`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/Wish-Features/Spaghetti Editor.md to capture future Spaghetti Editor ideas discussed in planning. Recorded current window/layout pain points, desired Toolbar/Half/Full/Browser window modes, and the desired top-right control model.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/Wish-Features/Spaghetti Editor.md` to capture future Spaghetti Editor ideas discussed in planning.
- Recorded current window/layout pain points, desired Toolbar/Half/Full/Browser window modes, and the desired top-right control model.
- Documented longer-term ideas for multiple editor instances, browser-window hosting, multi-document ownership, and shared-viewport rendering for multiple independent ParaHooks.

#### Files Changed
- `docs/Wish-Features/Spaghetti Editor.md`
- `docs/CHANGELOG.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a dedicated Spaghetti Editor wishlist doc for future UI and architecture ideas.

#### Verification Steps
- Reviewed the new wishlist doc for consistency with recent Spaghetti windowing and multi-instance architecture discussions.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [121] - 2026-03-05 23:28 - `DOC - Phase 7 - Docs Policy Cleanup - Remove TASKLIST Requirement From AGENTS.md`
<!-- ============================================================ -->
HUMAN SUMMARY: `Removed docs/TASKLIST.md from the required tracking files in AGENTS.md. Removed the dedicated TASKLIST rule block from AGENTS.md.`

#### Scope / Constraints Honored
- Documentation/process update only.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.

#### Summary of Implementation
- Removed `docs/TASKLIST.md` from the required tracking files in `AGENTS.md`.
- Removed the dedicated `TASKLIST` rule block from `AGENTS.md`.
- Updated the required maintenance sequence in `AGENTS.md` so it now requires `docs/CHANGELOG.md` and `docs/change-List.md`, but no longer requires `docs/TASKLIST.md`.

#### Files Changed
- `AGENTS.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- Future Codex implementation changes are no longer required by `AGENTS.md` to update `docs/TASKLIST.md`.
- `docs/CHANGELOG.md` and `docs/change-List.md` remain required tracking files.

#### Verification Steps
- Reviewed the updated `AGENTS.md` instructions for consistency after removing `TASKLIST` maintenance requirements.
- No build or test run required for this docs-only policy update.

<!-- ============================================================ -->
### [120] - 2026-03-05 23:23 - `SP - Phase 7 - Spaghetti Editor Window Update Phase Plan`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/Phases/UI_Window-Update_PhasePlan.md to plan the next Spaghetti window/layout phase. Captured the three current resize/layout bugs plus the new four-mode Spaghetti window feature request.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/Phases/UI_Window-Update_PhasePlan.md` to plan the next Spaghetti window/layout phase.
- Captured the three current resize/layout bugs plus the new four-mode Spaghetti window feature request.
- Recommended an ownership split where `AppShell` owns outer window modes and geometry while `SpaghettiPanel` owns header/canvas/debug split behavior.

#### Files Changed
- `docs/Phases/UI_Window-Update_PhasePlan.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The repo now has a dedicated UI phase plan for Spaghetti window bugs and future window modes.

#### Verification Steps
- Reviewed the new phase plan against the current `AppShell` and `SpaghettiPanel` layout responsibilities.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [119] - 2026-03-05 23:09 - `SP - Phase 6 - Resizable Debug Inspector Drawer`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a second vertical resize handle above the Debug Inspector drawer in SpaghettiPanel. Gave the debug drawer its own height state with drag-to-resize and double-click reset behavior, matching the existing Spaghetti editor resize affordance.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept graph topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no compile, runtime, selector, or viewer behavior changes.

#### Summary of Implementation
- Added a second vertical resize handle above the `Debug Inspector` drawer in `SpaghettiPanel`.
- Gave the debug drawer its own height state with drag-to-resize and double-click reset behavior, matching the existing Spaghetti editor resize affordance.
- Updated the debug drawer layout so the toggle remains fixed while the inspector body fills the drawer and scrolls within the resized area.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- The `Debug Inspector` can now be resized vertically from a handle above the drawer.
- Double-clicking the new resize handle resets the drawer to its default height.

#### Verification Steps
- `npm.cmd run build` (passed, existing Vite chunk-size warning only)

<!-- ============================================================ -->
### [118] - 2026-03-05 22:54 - `DOC - Phase 6 - Docs Task And Phase Setup - Plain-English Engine Architecture Overview`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/Architecture/Engine-Architecture.md to explain the app's engine in plain English. Documented the main layer boundaries: app/state, worker/build execution, viewer/rendering, and shared contracts.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/Architecture/Engine-Architecture.md` to explain the app's engine in plain English.
- Documented the main layer boundaries: app/state, worker/build execution, viewer/rendering, and shared contracts.
- Explained how legacy mode and Spaghetti mode both feed the same worker pipeline, and clarified the preview identity versus build identity split.

#### Files Changed
- `docs/Architecture/Engine-Architecture.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- Repository docs now include a readable explanation of how the engine is structured and how data flows through it.

#### Verification Steps
- Reviewed the new architecture doc against current app, worker, shared, and spaghetti file structure.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [117] - 2026-03-05 22:45 - `DOC - Phase 6 - Docs Task And Phase Setup - Add Changelog-Derived Phase Checklist`
<!-- ============================================================ -->
HUMAN SUMMARY: `Populated docs/Phases/00_Phase-CheckList.md with one-line checklist entries grouped by phase family. Derived the checklist from completed CHANGELOG.md phase entries only, so listed phases are marked completed.`

#### Scope / Constraints Honored
- Documentation-only change.
- Read phase names/status from `docs/CHANGELOG.md`.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.

#### Summary of Implementation
- Populated `docs/Phases/00_Phase-CheckList.md` with one-line checklist entries grouped by phase family.
- Derived the checklist from completed `CHANGELOG.md` phase entries only, so listed phases are marked completed.
- Separated current canonical prefix-based phases from older legacy numbered phases instead of renaming historical work.

#### Files Changed
- `docs/Phases/00_Phase-CheckList.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- The phase checklist now provides a changelog-derived grouped overview of completed phases.

#### Verification Steps
- Reviewed `docs/CHANGELOG.md` phase headings and populated `docs/Phases/00_Phase-CheckList.md` from those entries only.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [116] - 2026-03-05 22:37 - `DOC - Phase 6 - Docs Task And Phase Setup - Add Canonical Phase Setup Guide`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/Phases/01_Phase-Setup.md as a canonical planning-structure guide for the repo. Defined the intended roles of roadmap, phase setup docs, phase plans, task files, changelog, and change-list so each document type has a single responsibility.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Added no product behavior changes.

#### Summary of Implementation
- Added `docs/Phases/01_Phase-Setup.md` as a canonical planning-structure guide for the repo.
- Defined the intended roles of roadmap, phase setup docs, phase plans, task files, changelog, and change-list so each document type has a single responsibility.
- Documented a recommended stable track-prefix system (`GE`, `VM`, `NI`, `FS`, `PT`, `PR`, `AS`, `VR`, `DBG`, `EX`, `ADV`) and naming rules for phases/sub-phases.

#### Files Changed
- `docs/Phases/01_Phase-Setup.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- Repository planning docs now include a higher-level guide for keeping roadmap, phases, tasks, and history separated.

#### Verification Steps
- Reviewed `docs/Phases/01_Phase-Setup.md` for consistency with the current docs structure and naming direction.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [115] - 2026-03-05 22:30 - `DOC - Phase 6 - Docs Task And Phase Setup - Split NI Task Files`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added standalone task files for NI-1, NI-2, and NI-3 under docs/tasks/. Copied the current checklist/status content from docs/TASKLIST.md so the task files match the completed task blocks already tracked there.`

#### Scope / Constraints Honored
- Documentation-only change.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept OutputPreview invariants unchanged.
- Kept existing task wording/status sourced from `docs/TASKLIST.md`.

#### Summary of Implementation
- Added standalone task files for `NI-1`, `NI-2`, and `NI-3` under `docs/tasks/`.
- Copied the current checklist/status content from `docs/TASKLIST.md` so the task files match the completed task blocks already tracked there.
- Restored `docs/tasks/NI-3.md` after deletion and aligned it with the current canonical wording that uses `expanded` rather than `everything`.

#### Files Changed
- `docs/tasks/NI-1.md`
- `docs/tasks/NI-2.md`
- `docs/tasks/NI-3.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- No product behavior changes.
- Documentation now has dedicated task files for the NI-1, NI-2, and NI-3 phases.

#### Verification Steps
- Verified `docs/tasks/NI-1.md`, `docs/tasks/NI-2.md`, and `docs/tasks/NI-3.md` were created from the current `docs/TASKLIST.md` entries.
- No build or test run required for this documentation-only change.

<!-- ============================================================ -->
### [114] - 2026-03-05 22:05 - `DBG - Phase 1 - Debug Inspector Foundation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a read-only Debug Inspector drawer to the Spaghetti panel with a show/hide toggle that only affects panel visibility. Introduced a selector-owned debug aggregation layer that surfaces compile status, received artifacts, deterministic OutputPreview slot mapping, preview render VM entries, and the exact preview renderables ViewerHost receives in spaghetti parts mode.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept graph topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept the Feature Stack IR shape unchanged.
- Kept OutputPreview invariants unchanged.
- Added no graph repair logic, debug mutation actions, selection/drag behavior changes, or part-specific debug branches.

#### Summary of Implementation
- Added a read-only `Debug Inspector` drawer to the Spaghetti panel with a show/hide toggle that only affects panel visibility.
- Introduced a selector-owned debug aggregation layer that surfaces compile status, received artifacts, deterministic OutputPreview slot mapping, preview render VM entries, and the exact preview renderables `ViewerHost` receives in spaghetti parts mode.
- Kept the inspector structured and deterministic with stable slot ordering, stable preview ordering, stable viewer-input ordering, and explicit empty/inactive states for missing artifacts or non-preview viewer modes.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/theme/v15Theme.css`
- `docs/tasks/DBG-1.md`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- Added a developer-facing, read-only debug drawer for spaghetti preview pipeline inspection.
- Showing or hiding the drawer does not change compile, graph, preview selector, worker, or viewer behavior.

#### Verification Steps
- `npx.cmd tsc -p tsconfig.json --noEmit` (passed)
- `npm.cmd run test -- src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts` (passed)
- `npm.cmd run test` (passed)
- `npm.cmd run build` (passed, existing Vite chunk-size warning only)
- Manual browser verification of the new drawer was not run in this terminal-only environment.

<!-- ============================================================ -->
### [113] - 2026-03-05 21:47 - `NI - Phase 5 - Modern Node Interaction Cleanup - Node Section Collapse Consistency`
<!-- ============================================================ -->
HUMAN SUMMARY: `Normalized part-node section shells in NodeView so Drivers, Inputs, Feature Stack, and Outputs share one deterministic body-visibility rule: collapsed node mode hides all section bodies, while section toggles remain node-scoped and independent. Restored deterministic node-title mode cycling through the canonical NI-2 vocabulary (collapsed -> essentials -> expanded -> collapsed) by wiring title clicks through canvas-owned node mode state instead of reintroducing any canvas-global mode owner.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept the Feature Stack IR schema unchanged.
- Kept OutputPreview invariants unchanged.
- Added no section tri-state behavior, nested node behavior, worker/runtime/compile contract expansion, or automatic mode switching.
- Preserved the NI-1 selection/drag interaction model and NI-2 node-scoped mode ownership.

#### Summary of Implementation
- Normalized part-node section shells in `NodeView` so `Drivers`, `Inputs`, `Feature Stack`, and `Outputs` share one deterministic body-visibility rule: collapsed node mode hides all section bodies, while section toggles remain node-scoped and independent.
- Restored deterministic node-title mode cycling through the canonical NI-2 vocabulary (`collapsed -> essentials -> expanded -> collapsed`) by wiring title clicks through canvas-owned node mode state instead of reintroducing any canvas-global mode owner.
- Removed real feature input-port rows from sketch/extrude feature panels, kept status-only linked-input indicators inside Feature Stack, and left actual wireable inputs owned by the `Inputs` section.

#### Files Changed
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`

#### Behavior Changes
- Collapsed mode now renders section shells only for part nodes; section bodies stay hidden until the node returns to `essentials` or `expanded`.
- Feature Stack no longer renders actual `Feature Wire Inputs` or owns wireable port rows; linked feature params now render as status-only indicators while real inputs remain in the `Inputs` section.
- Part nodes keep deterministic section order (`Drivers -> Inputs -> Feature Stack -> Outputs`) and title clicks now cycle the current nodeï¿½s mode without altering NI-1 drag ownership.

#### Verification Steps
- `npx.cmd tsc -p tsconfig.json --noEmit` (passed)
- `npm.cmd run test -- src/app/spaghetti/canvas/rowViewMode.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts src/app/spaghetti/canvas/interactionModel.test.ts` (passed)
- `npm.cmd run test` (passed)
- `npm.cmd run build` (passed, existing Vite chunk-size warning only)

<!-- ============================================================ -->
### [112] - 2026-03-05 20:57 - `NI - Phase 5 - Modern Node Interaction Cleanup - Per-Node View Mode System`
<!-- ============================================================ -->
HUMAN SUMMARY: `Replaced the canvas-global row mode with node-scoped UI-store state by adding nodeModeByNodeId, getNodeMode(nodeId), and setNodeMode(nodeId, mode), with deterministic fallback to essentials. Standardized the view-mode vocabulary to collapsed | essentials | expanded, removed the remaining internal everything token, and updated NodeView to read its mode directly from useSpaghettiUiStore.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept the Feature Stack IR schema unchanged.
- Kept OutputPreview invariants unchanged.
- Added no section tri-state behavior, node rendering refactor, collapse consistency cleanup, or automatic mode changes.
- Preserved the NI-1 selection/drag interaction model.

#### Summary of Implementation
- Replaced the canvas-global row mode with node-scoped UI-store state by adding `nodeModeByNodeId`, `getNodeMode(nodeId)`, and `setNodeMode(nodeId, mode)`, with deterministic fallback to `essentials`.
- Standardized the view-mode vocabulary to `collapsed | essentials | expanded`, removed the remaining internal `everything` token, and updated `NodeView` to read its mode directly from `useSpaghettiUiStore`.
- Removed the canvas-toolbar row-mode selector, converted the node context menu to target the clicked nodeï¿½s stored mode, and removed the old hidden auto-mode switching paths so canvas rendering no longer has a global mode owner.

#### Files Changed
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.ts`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`

#### Verification
- `npx.cmd tsc -p tsconfig.json --noEmit` (passed)
- `npm.cmd run test -- src/app/spaghetti/canvas/rowViewMode.test.ts src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/interactionModel.test.ts` (passed)
- `npm.cmd run test` (passed)
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [111] - 2026-03-05 20:21 - `NI - Phase 5 - Modern Node Interaction Cleanup - Node Selection And Drag Model`
<!-- ============================================================ -->
HUMAN SUMMARY: `Split node interaction ownership into explicit header and body paths in NodeView, with header hits reserved for drag-capable selection and body hits reserved for selection-only behavior. Updated SpaghettiCanvas to treat node-owned pointer paths separately from true empty-canvas deselection, so inside-node clicks no longer leak into stage clearing and drag can only arm from the header path.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged.
- Kept the `PartArtifact` contract unchanged.
- Kept the Feature Stack IR schema unchanged.
- Kept OutputPreview invariants unchanged.
- Added no per-node view modes, section tri-state logic, rendering-mode redesign, or hidden automatic mode cleanup.

#### Summary of Implementation
- Split node interaction ownership into explicit header and body paths in `NodeView`, with header hits reserved for drag-capable selection and body hits reserved for selection-only behavior.
- Updated `SpaghettiCanvas` to treat node-owned pointer paths separately from true empty-canvas deselection, so inside-node clicks no longer leak into stage clearing and drag can only arm from the header path.
- Added deterministic interaction-model tests for selection, drag gating, and empty-canvas clearing, plus a `NodeView` assertion that the component renders distinct header/body interaction zones.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/interactionModel.ts`
- `src/app/spaghetti/canvas/interactionModel.test.ts`

#### Verification
- `npm.cmd run test -- src/app/spaghetti/canvas/interactionModel.test.ts src/app/spaghetti/canvas/NodeView.test.tsx` (passed)
- `npx.cmd tsc -p tsconfig.json --noEmit` (passed)
- `npm.cmd run test` (passed)
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [110] - 2026-03-05 19:36 - `DR - Phase 12 - Param And Input Node Foundation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added authored utility node registry entries for Param/Number, Param/Boolean, and Param/Vec2 with deterministic defaults, stable value outputs, and local evaluation-only compute behavior. Hid legacy Primitive/Number and Primitive/Vec2 from new add-node authoring while keeping them readable/evaluable, and added a selector-owned compact utility VM/render path so authored values no longer rely on the old Primitive/Number output-port editing special case.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept the `PartArtifact` contract unchanged.
- Kept the Feature Stack IR schema unchanged.
- Kept OutputPreview invariants unchanged.
- Kept selector/viewer architecture unchanged.
- Added no Rail Math, pin exposure, profile runtime expansion, worker/runtime geometry changes, or toolbar/palette redesign.

#### Summary of Implementation
- Added authored utility node registry entries for `Param/Number`, `Param/Boolean`, and `Param/Vec2` with deterministic defaults, stable `value` outputs, and local evaluation-only compute behavior.
- Hid legacy `Primitive/Number` and `Primitive/Vec2` from new add-node authoring while keeping them readable/evaluable, and added a selector-owned compact utility VM/render path so authored values no longer rely on the old `Primitive/Number` output-port editing special case.
- Routed utility-node edits through `setNodeParams` graph commands in the canvas, added compact helper-node styling/rendering for number/boolean/vec2 values, and expanded deterministic tests for registry contracts, evaluation, contract parity, selector VM output, and NodeView rendering.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/registry/nodeRegistry.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/__snapshots__/selectNodeVm.test.ts.snap`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/contracts/contractParity.test.ts`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- New graphs can add `Param/Number`, `Param/Boolean`, and `Param/Vec2` nodes from the add menu; legacy primitive number/vec2 nodes remain compatible but are no longer offered for new authoring.
- `Param/Number` now wires directly into existing `number:mm` inputs and `Param/Vec2` wires directly into existing `vec2:mm` inputs through the normal shared endpoint validator.
- Utility value nodes now render as compact helper nodes with selector-owned view-model data and command-routed param edits instead of relying on the old `Primitive/Number` inline output-port editor path.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [109] - 2026-03-05 19:11 - `FS - Phase 15 - Multi-Part Feature Stack Support`
<!-- ============================================================ -->
HUMAN SUMMARY: `Generalized spaghetti part ownership in compileGraph so supported part nodes compile into deterministic canonical partKeyStr values across singleton and multi-instance graphs, while preserving legacy singleton keys where required. Threaded compile-owned ordered part keys into spaghetti build request translation and shared part-key ordering helpers so Build Stats, cache rows, and worker/runtime ordering all use the same canonical source/build identity rules.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept the FS-1 solid/artifact contract unchanged.
- Kept OutputPreview invariants unchanged, including the trailing empty slot rule.
- Kept FS-2 feature ordering / enable-disable semantics unchanged.
- Kept FS-3 internal dependency visualization behavior unchanged.
- Added no boolean operations, mating/alignment systems, subgraphs/containers, export pipeline changes, or new geometry kinds.

#### Summary of Implementation
- Generalized spaghetti part ownership in `compileGraph` so supported part nodes compile into deterministic canonical `partKeyStr` values across singleton and multi-instance graphs, while preserving legacy singleton keys where required.
- Threaded compile-owned ordered part keys into spaghetti build request translation and shared part-key ordering helpers so Build Stats, cache rows, and worker/runtime ordering all use the same canonical source/build identity rules.
- Hardened worker/runtime multi-part execution so part-local sketch/profile/body identities no longer collide across different graph-owned parts, while preserving the existing `PartArtifact` and worker message contracts.
- Preserved explicit OutputPreview slot mapping through `nodeId -> sourcePartKeyStr -> artifact` and added regression coverage for multi-slot preview resolution, unresolved-slot behavior, repeated compile/build parity, and deterministic cache-hit ordering.

#### Files Changed
- `src/app/parts/partKeyResolver.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/shared/buildStatsKeys.ts`
- `src/shared/buildStatsKeys.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- `docs/CHANGELOG.md`
- `docs/TASKLIST.md`
- `docs/change-List.md`

#### Behavior Changes (if any)
- Multiple supported spaghetti part nodes in the same graph now compile into deterministic canonical owned part keys and can build/render together without reusing preview slot ids as artifact identity.
- OutputPreview can now resolve multiple distinct spaghetti artifacts in one graph while preserving slot order, unresolved-slot visibility, and slot-scoped viewer identity.
- Repeated unchanged multi-part spaghetti builds now surface deterministic source/build cache rows keyed by canonical `partKeyStr`, with `assembled` still last.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [108] - 2026-03-05 19:00 - `DOC - Phase 5 - Docs Policy Cleanup - Rewrite AGENTS Into Canonical Rules`
<!-- ============================================================ -->
HUMAN SUMMARY: `Replaced the layered AGENTS.md instructions with a cleaner canonical rule set organized by purpose, required files, and maintenance sequence. Preserved the existing repository requirements for CHANGELOG.md, TASKLIST.md, and change-List.md while rewriting them in a more direct format for Codex consumption.`

#### Scope / Constraints Honored
- Documentation/process update only.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.

#### Summary of Implementation
- Replaced the layered `AGENTS.md` instructions with a cleaner canonical rule set organized by purpose, required files, and maintenance sequence.
- Preserved the existing repository requirements for `CHANGELOG.md`, `TASKLIST.md`, and `change-List.md` while rewriting them in a more direct format for Codex consumption.
- Consolidated duplicate maintenance guidance into a single readable instruction flow.

#### Files Changed
- `AGENTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Repository maintenance rules are now easier to parse, but the required maintenance behavior remains the same: update changelog, tasklist, and change-list for implementation work.

#### Verification Steps
- Reviewed rewritten `AGENTS.md` for rule completeness and consistency.
- No build or test run required for this docs-only policy update.

<!-- ============================================================ -->
### [107] - 2026-03-05 18:53 - `DOC - Phase 5 - Docs Policy Cleanup - Preserve Completed Task Blocks`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated AGENTS.md so tasklist maintenance instructions explicitly forbid deleting old phase task lists after completion. Added a rule that completed phases must remain as full completed checklist blocks with accomplished items marked [x].`

#### Scope / Constraints Honored
- Documentation/process update only.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.

#### Summary of Implementation
- Updated `AGENTS.md` so tasklist maintenance instructions explicitly forbid deleting old phase task lists after completion.
- Added a rule that completed phases must remain as full completed checklist blocks with accomplished items marked `[x]`.
- Clarified that completed phase sections should retain visible phase headers and separator lines in the tasklist, similar in spirit to changelog section boundaries.

#### Files Changed
- `AGENTS.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Future tasklist maintenance is now required to preserve full historical completed phase blocks instead of collapsing them into short summaries or deleting older phase task lists.

#### Verification Steps
- Reviewed updated `AGENTS.md` instructions for tasklist maintenance consistency.
- No build or test run required for this docs-only policy update.

<!-- ============================================================ -->
### [106] - 2026-03-05 18:46 - `FS - Phase 14 - Feature Stack Expansion And Dependency Visualization - Dependency Visualization`
<!-- ============================================================ -->
HUMAN SUMMARY: `Extended the shared FS-2 dependency utility to emit deterministic feature rows plus feature-to-feature and driver-to-feature dependency edges without mutating graph or feature state. Threaded selector-owned feature row ids, row indexes, and internal dependency edges through selectNodeVm so part-node rendering reads deterministic dependency VMs instead of recomputing feature graph logic in the UI.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept the FS-1 solid/artifact contract unchanged.
- Kept FS-2 feature ordering, enable/disable semantics, and compile behavior unchanged.
- Added no multi-part support, boolean operations, sketch solver tooling, or new graph wiring systems.

#### Summary of Implementation
- Extended the shared FS-2 dependency utility to emit deterministic feature rows plus feature-to-feature and driver-to-feature dependency edges without mutating graph or feature state.
- Threaded selector-owned feature row ids, row indexes, and internal dependency edges through `selectNodeVm` so part-node rendering reads deterministic dependency VMs instead of recomputing feature graph logic in the UI.
- Updated the part node UI to register stable driver/feature row anchors and render a local internal dependency overlay only in `everything` mode when the existing `Show internal wiring` toggle is enabled.
- Kept dependency styling structural-only so existing DR-1 warnings/diagnostics remain the status layer, while disabled or ineffective features/wires stay visible in muted form.
- Added deterministic regression coverage for dependency graph analysis, selector VM output, feature row anchors, and node overlay gating.

#### Files Changed
- `src/app/spaghetti/features/featureDependencies.ts`
- `src/app/spaghetti/features/featureDependencies.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Part-template nodes in `everything` mode can now show deterministic internal dependency wires for existing driver-to-feature and feature-to-feature relationships when `Show internal wiring` is enabled.
- Collapsed and compact node modes remain unchanged and do not render the internal dependency overlay.
- Disabled or ineffective features remain visible in the feature stack and dependency visualization without changing compile/runtime behavior.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [105] - 2026-03-05 18:35 - `FS - Phase 14 - Feature Stack Expansion And Dependency Visualization - Core Operations Expansion`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added generic feature-stack enabled-state support with backward-compatible default enable behavior for legacy stored features. Introduced shared feature dependency analysis so compile, validation, diagnostics, and reorder guards all use the same prior-enabled-feature ordering rules.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept the FS-1 solid/artifact contract unchanged.
- Kept selector-driven UI flow unchanged.
- Added no multi-part support, boolean operations, sketch solver tooling, or alternate geometry pipelines.

#### Summary of Implementation
- Added generic feature-stack enabled-state support with backward-compatible default enable behavior for legacy stored features.
- Introduced shared feature dependency analysis so compile, validation, diagnostics, and reorder guards all use the same prior-enabled-feature ordering rules.
- Hardened `compileFeatureStack` to emit deterministic IR from the effective enabled feature order only, while preserving feature ids and current runtime payload shape.
- Added commit-boundary feature editing actions for move-up, move-down, and enable/disable in the Spaghetti store, with deterministic rejection of dependency-breaking reorders.
- Updated the feature stack UI to expose row-level Up/Down and Enable/Disable controls while keeping disabled features visible and locally editable in place.
- Preserved Cubeï¿½s existing render path while ensuring disabled or misordered feature dependencies resolve as unresolved through the current compile/runtime/artifact pipeline.

#### Files Changed
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/featureDependencies.ts`
- `src/app/spaghetti/features/featureDependencies.test.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/app/spaghetti/features/diagnostics.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/theme/v15Theme.css`
- `src/worker/cad/featureStackRuntime.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Feature stacks now support deterministic feature enable/disable state without changing graph topology or the existing render pipeline.
- Feature reorders are allowed only when they preserve valid enabled-feature dependency ordering.
- Disabled features remain visible in the stack UI but are excluded from compiled/runtime feature execution.
- Cube remains renderable through the existing FS-1 pipeline, and disabling its extrude feature leaves it unresolved at runtime instead of producing a render artifact.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [104] - 2026-03-05 18:17 - `FS - Phase 14 - Feature Stack Expansion And Dependency Visualization - Build Stats And Cache Integration`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a shared deterministic build-stats key helper so spaghetti builds derive canonical source/build part rows from the same profile patch content already sent to the worker. Narrowed spaghetti build request translation to a minimal profile patch and carried forward a canonical partKeys list for stats seeding, keeping cube keyed by build identity rather than preview slot identity.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept the FS-1 solid/artifact contract unchanged.
- Kept title-bar stats panel expand/collapse behavior unchanged.
- Added no new node types, geometry features, cache-engine redesign, or multi-part support.

#### Summary of Implementation
- Added a shared deterministic build-stats key helper so spaghetti builds derive canonical source/build part rows from the same profile patch content already sent to the worker.
- Narrowed spaghetti build request translation to a minimal profile patch and carried forward a canonical `partKeys` list for stats seeding, keeping `cube` keyed by build identity rather than preview slot identity.
- Extended app build wiring so `BuildDispatcher` resets stats rows from a provider-driven canonical part-key list, preserving legacy ordering while letting spaghetti builds seed rows like `cube` plus `assembled`.
- Updated worker build progress routing so spaghetti builds emit part progress/cache rows for canonical spaghetti part keys derived from the payload, with `assembled` remaining last.
- Scoped cache/progress routing changes so `sp_*` changed ids invalidate the relevant spaghetti row set without redesigning cache semantics.
- Added deterministic regression coverage for shared key derivation, spaghetti build request translation, dispatcher row seeding, and worker progress/cache output.

#### Files Changed
- `src/shared/buildStatsKeys.ts`
- `src/shared/buildStatsKeys.test.ts`
- `src/app/buildDispatcher.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- `src/worker/pipeline/paramRouting.ts`
- `src/worker/pipeline/signatures.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The Build Stats panel now shows spaghetti build rows using canonical source/build identity such as `cube`, instead of falling back to the legacy fixed row list for spaghetti builds.
- Repeated unchanged spaghetti builds now surface deterministic cache-hit rows aligned with the same canonical spaghetti part keys that drive viewport-visible artifacts.
- Legacy build stats ordering remains unchanged, and `assembled` still appears as the final row.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [103] - 2026-03-05 18:08 - `SP - Phase 5 - Spaghetti Window And Layout Foundations - Split Resize Ownership Fix`
<!-- ============================================================ -->
HUMAN SUMMARY: `Moved the vertical resize handle behavior from SpaghettiEditor into SpaghettiPanel, where the actual header-versus-canvas split is defined. Changed the resize logic to control the canvas wrap height directly so dragging the handle now shrinks the expanded header block instead of only resizing content inside the canvas region.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti panel/editor layout and resize ownership.

#### Summary of Implementation
- Moved the vertical resize handle behavior from `SpaghettiEditor` into `SpaghettiPanel`, where the actual header-versus-canvas split is defined.
- Changed the resize logic to control the canvas wrap height directly so dragging the handle now shrinks the expanded header block instead of only resizing content inside the canvas region.
- Tightened the header block flex rules so the expanded header can collapse into its own scrollbar while the lower editor area grows.
- Removed the old inner-editor resize state and handle ownership from `SpaghettiEditor`.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Dragging the resize bar now resizes the actual panel split between the collapsible header section and the lower editor/canvas section.
- With the header expanded, the handle can move through space that was previously blocked because the header now shrinks and scrolls instead of staying fixed above the editor.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [102] - 2026-03-05 18:04 - `SP - Phase 5 - Spaghetti Window And Layout Foundations - Minimum Height Reduction`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reduced the Spaghetti editor minimum manual resize height from 280px to 100px. Preserved the existing top resize handle behavior and bottom-anchored editor layout while allowing the handle to move higher.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti editor resize clamp behavior.

#### Summary of Implementation
- Reduced the Spaghetti editor minimum manual resize height from `280px` to `100px`.
- Preserved the existing top resize handle behavior and bottom-anchored editor layout while allowing the handle to move higher.

#### Files Changed
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The Spaghetti editor can now be resized much shorter before the top handle hits its minimum-height stop.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [101] - 2026-03-05 17:57 - `SP - Phase 5 - Spaghetti Window And Layout Foundations - Header Scroll Relocation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Moved the scrollable overflow region up from the expanded editor toolbar area into the collapsible Spaghetti panel header block. Added a dedicated header scroll container so the section beginning at How To Use Spaghetti Editor scrolls independently when the panel is short.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti panel/editor layout behavior.

#### Summary of Implementation
- Moved the scrollable overflow region up from the expanded editor toolbar area into the collapsible Spaghetti panel header block.
- Added a dedicated header scroll container so the section beginning at `How To Use Spaghetti Editor` scrolls independently when the panel is short.
- Removed the expanded-toolbar scrollbar so the lower editor controls and canvas region remain separate from the header scroll behavior.

#### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- When the Spaghetti panel header is expanded, the help/sample/compile/status section now owns the scrollbar.
- The expanded/collapsed mode controls and canvas area no longer show that scrollbar.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [100] - 2026-03-05 17:49 - `SP - Phase 5 - Spaghetti Window And Layout Foundations - Minimum Width Tightening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reduced the floating Spaghetti editor minimum width in AppShell from 560 to 320. Tightened the minimum window width so the editor can shrink to roughly the same width footprint as the top-left ParaHook Generator v20 title bar region.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to floating Spaghetti editor window sizing behavior.

#### Summary of Implementation
- Reduced the floating Spaghetti editor minimum width in `AppShell` from `560` to `320`.
- Tightened the minimum window width so the editor can shrink to roughly the same width footprint as the top-left `ParaHook Generator v20` title bar region.

#### Files Changed
- `src/app/AppShell.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The floating Spaghetti editor can now be resized narrower before hitting its minimum width limit.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [099] - 2026-03-05 17:43 - `SP - Phase 5 - Spaghetti Window And Layout Foundations - Vertical Resize Handle`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a drag handle above the Spaghetti editor content so users can resize the full editor block vertically from its top edge while keeping it bottom-anchored. Implemented pointer-driven editor-height resizing in SpaghettiEditor with minimum-height and parent-height clamping.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti editor layout/UI behavior.

#### Summary of Implementation
- Added a drag handle above the Spaghetti editor content so users can resize the full editor block vertically from its top edge while keeping it bottom-anchored.
- Implemented pointer-driven editor-height resizing in `SpaghettiEditor` with minimum-height and parent-height clamping.
- Added double-click reset behavior on the resize bar to restore the default flexible editor height.
- Added scrollable editor-body behavior so header controls and canvas remain reachable when the editor is resized shorter.
- Styled the resize control as a dedicated top splitter/grab bar inside the Spaghetti editor shell.

#### Files Changed
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- The Spaghetti editor block can now be manually dragged taller or shorter from a top resize bar while staying anchored to the bottom of its panel.
- When the editor is resized smaller than its content, the editor body scrolls instead of clipping the header/canvas controls.
- Default behavior remains unchanged until the user drags the handle; double-click resets the manual height.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [098] - 2026-03-05 17:28 - `FS - Phase 13 - Feature Stack Solid Contract Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked src/shared/buildTypes.ts as the canonical solid artifact contract and made PartArtifact require partKey and partKeyStr. Added shared artifact identity helpers for canonical part-key parsing, validation, and viewer-part wrapping.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept selector-driven preview/viewer flow unchanged.
- Added no new geometry kinds, multi-part support, booleans, or graph architecture changes.

#### Summary of Implementation
- Locked `src/shared/buildTypes.ts` as the canonical solid artifact contract and made `PartArtifact` require `partKey` and `partKeyStr`.
- Added shared artifact identity helpers for canonical part-key parsing, validation, and viewer-part wrapping.
- Collapsed `src/shared/partsTypes.ts` onto the canonical shared contract so the repo no longer carries a second competing `PartArtifact` definition.
- Formalized preview resolution as `slotId -> sourceNodeId -> sourcePartKeyStr -> PartArtifact` in the OutputPreview selector path.
- Removed the preview-time `partKeyStr` rewrite and replaced it with explicit slot-scoped `viewerKey` metadata while preserving source artifact identity.
- Updated `ViewerHost` and `Viewer` to consume slot-keyed viewer entries with canonical artifacts, keeping spaghetti-mode slot visibility/selection behavior unchanged.
- Tightened build-result validation to treat current worker artifacts as canonical instead of optional/best-effort identity payloads.
- Added deterministic regression coverage for the shared artifact contract, preview slot/source mapping, and repeated graph-produced Cube artifact builds.

#### Files Changed
- `src/shared/buildTypes.ts`
- `src/shared/buildTypes.test.ts`
- `src/shared/partsTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/parts/partKeyResolver.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.test.ts`
- `src/viewer/Viewer.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/stageAssembler.ts`
- `src/worker/products/foothook/parts/baseplate.ts`
- `src/worker/products/foothook/parts/heelKick.ts`
- `src/worker/products/foothook/parts/toeHook.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Preview slot identity now stays explicit as `viewerKey` instead of being encoded by mutating `PartArtifact.partKeyStr`.
- Canonical artifacts retain source part identity all the way into preview/viewer flow.
- Spaghetti-mode slot visibility, selection, and unresolved-slot exclusion behavior remain unchanged.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [097] - 2026-03-05 17:10 - `FS - Phase 12 - First Renderable Part Through Existing Part Pipeline`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added Part/CubeProof as a minimal cube-aligned proof node with a deterministic rectangle-to-extrude default Feature Stack and the existing OutputPreview-consumable output kind. Extended compile-time part ownership so PART_NODE_SPECS and computeFeatureStackIrParts() map Part/CubeProof to cubeProof.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept selector-driven preview/viewer flow unchanged.
- Added no parallel mesh-output architecture, scripting nodes, or subgraph/container systems.

#### Summary of Implementation
- Added `Part/CubeProof` as a minimal cube-aligned proof node with a deterministic rectangle-to-extrude default Feature Stack and the existing OutputPreview-consumable output kind.
- Extended compile-time part ownership so `PART_NODE_SPECS` and `computeFeatureStackIrParts()` map `Part/CubeProof` to `cubeProof`.
- Documented the two critical path handoffs:
  - part node type to compile-owned `partKey`
  - OutputPreview slot edge to `nodeId -> partKey -> artifact` lookup
- Narrowed worker-side bridging to the existing pipeline:
  - reused `sp_featureStackIR` execution in the worker runtime
  - derived deterministic bounds from runtime geometry
  - emitted graph-produced `cubeProof` output as the existing `PartArtifact { kind: 'box', params }` envelope
- Relaxed shared/app-side artifact validation just enough to accept non-legacy graph-produced part ids like `cubeProof`, while preserving legacy build ordering behavior.
- Added deterministic compile/runtime/selector coverage for the proof part and preserved DR-1 unresolved-slot preview exclusion behavior.

#### Files Changed
- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/parts/partKeyResolver.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Graph-produced `cubeProof` parts now flow through the existing `PartArtifact -> OutputPreview -> selector -> ViewerHost` path.
- Missing proof-part artifacts remain excluded from preview rendering while slot connectivity behavior stays unchanged.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [096] - 2026-03-05 15:37 - `VM - Phase 5 - Selector Contract Hardening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Standardized selector access through src/app/spaghetti/selectors/index.ts and expanded barrel exports for hardened VM contracts/types. Hardened selector contracts and identities.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Added no new node types or geometry features.
- Limited this phase to selector contract hardening and UI import/consumption cleanup.

#### Summary of Implementation
- Standardized selector access through `src/app/spaghetti/selectors/index.ts` and expanded barrel exports for hardened VM contracts/types.
- Hardened selector contracts and identities:
  - `selectNodeVm` now emits full `NodeVm` metadata used by canvas/node rendering (title/template/ports/sections/row-group metadata) with stable `nodeId`.
  - `selectDriverVm` now emits stable `DriverRowVm` identities (`rowId` + `paramId` where applicable) and section-grouped row identity data.
  - `selectPreviewRenderVm` now emits `PreviewRenderVm` (`items` + `viewerParts`) with stable preview ids and viewer-ready artifacts.
  - `selectDiagnosticsVm` now emits stable diagnostics items with deterministic `id` while preserving existing DR-1 status semantics.
- Added same-reference memoization guards across hardened selectors where safe (`selectNodeVm`, `selectDriverVm`, `selectPreviewRenderVm`, `selectDiagnosticsVm`, parts-list panel VM).
- Removed remaining target UI-local shaping from raw graph/state:
  - `SpaghettiCanvas` now passes selector-provided node display metadata to `NodeView` instead of rebuilding from node definitions in render.
  - `NodeView` now consumes selector-provided driver grouping/index metadata and selector-provided OutputPreview row identities for keys.
  - `PartsListPanel` now consumes selector-shaped panel VM (`selectPartsListPanelVm`) from barrel and no longer builds slot labels/secondary text or trailing-empty handling locally.
  - `ViewerHost` now consumes selector-provided preview VM (`viewerParts`) from barrel and no longer reshapes preview artifacts locally.
- Added selector barrel contract test plus VM snapshot coverage for Node/Driver/Preview/Diagnostics contracts.

#### Files Changed
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.ts`
- `src/app/spaghetti/selectors/selectDriverVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/index.test.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.test.ts`
- `src/app/spaghetti/selectors/selectDriverVm.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/__snapshots__/selectDiagnosticsVm.test.ts.snap`
- `src/app/spaghetti/selectors/__snapshots__/selectDriverVm.test.ts.snap`
- `src/app/spaghetti/selectors/__snapshots__/selectNodeVm.test.ts.snap`
- `src/app/spaghetti/selectors/__snapshots__/selectPreviewRenderVm.test.ts.snap`
- `src/app/spaghetti/partsList/selectPartsListItems.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/WireLayer.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No feature-level behavior changes introduced.
- UI rendering now consumes hardened selector VM contracts directly for target surfaces; existing VM-1/DR-1 behavior remains preserved.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
### [095] - 2026-03-05 13:08 - `DR - Phase 11 - Driver Diagnostics And Invalid Wiring Visualization`
<!-- ============================================================ -->
HUMAN SUMMARY: `Extended diagnostics selector VM with deterministic edge + slot state. Kept endpoint-derived helpers secondary-only by documenting buildEndpointGroupingKey(...) for grouping/contract semantics (not diagnostics identity).`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview slot normalization invariant unchanged (exactly one trailing empty slot in graph state).
- Kept selector-driven UI integration pattern.

#### Summary of Implementation
- Extended diagnostics selector VM with deterministic edge + slot state:
  - added `edgeStatusById` keyed by stable `edgeId` identity,
  - added `slotStatus` for OutputPreview slots (`ok` / `unresolved` / `empty`),
  - added deterministic reason precedence (`missingPort > cycle > typeMismatch > unresolved > ok`) and aggregated `reasons`.
- Kept endpoint-derived helpers secondary-only by documenting `buildEndpointGroupingKey(...)` for grouping/contract semantics (not diagnostics identity).
- Updated canvas wire rendering to read diagnostics and apply dashed wire class for non-`ok` edges without changing interaction behavior.
- Updated node VM + node UI:
  - driver rows now surface warning indicators/tooltips from `edgeStatusById`,
  - OutputPreview rows now carry/render slot state and unresolved warning indicator metadata.
- Extended parts-list selector/UI with slot statuses and unresolved warning indicators while preserving panel-only trailing-empty hide behavior.
- Extended preview render selector to skip `unresolved` slots so unresolved entries remain visible in Parts List but are excluded from preview mesh rendering.
- Added deterministic tests for missing-port/type-mismatch/unresolved/cycle status classification and selector/view-model behavior.

#### Files Changed
- `src/app/spaghetti/selectors/selectDiagnosticsVm.ts`
- `src/app/spaghetti/contracts/endpoints.ts`
- `src/app/spaghetti/canvas/WireLayer.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.ts`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Non-`ok` edges now render dashed in Spaghetti canvas.
- Driver rows with non-`ok` driver-input edges now show warning indicators and tooltip diagnostics.
- OutputPreview slot state is explicitly represented as `ok` / `unresolved` / `empty`.
- Preview rendering now skips slots marked `unresolved`; unresolved slots remain visible in Parts List UI.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [094] - 2026-03-05 12:13 - `GE - Phase 10 - Contract Lock - Resolver Validator Canvas Parity`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added shared endpoint contract module at src/app/spaghetti/contracts/endpoints.ts. Rewired canvas cheap-check (validateConnectionCheap) to call shared contract only.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` behavior.
- Did not change OutputPreview invariants.
- Added no topology mutation in evaluator/selector/render/compile paths.
- Kept topology mutation limited to graph commands + deterministic normalization.

#### Summary of Implementation
- Added shared endpoint contract module at `src/app/spaghetti/contracts/endpoints.ts`:
  - driver alias canonicalization (`drv:*`/`drv:in:*` to canonical `out:drv:*`/`in:drv:*`)
  - node-type-aware canonicalization entrypoint
  - canonical endpoint key builder with driver-input param-level collapse for max-connection counting
  - unified endpoint resolver using effective ports + registry defs
  - unified `validateConnectionContract(...)` with deterministic code outcomes for port/path/type/max rules.
- Rewired canvas cheap-check (`validateConnectionCheap`) to call shared contract only:
  - preserved driver input auto-replace drop semantics via projected-edge validation using `planConnectEdgeWithAutoReplace`
  - standardized UI rejection messaging from shared reason codes.
- Rewired `validateGraph` connection decisions to shared contract:
  - added `validateGraphConnectionDecision(...)` test helper export
  - preserved cycle exclusion behavior for feature/driver path-unsupported and feature same-node unsupported edges
  - preserved deterministic edge iteration and diagnostics ordering behavior.
- Updated driver input auto-replace target keying to use shared canonical endpoint key helper.
- Added CT-1 parity test suite asserting canvas cheap-check and validator contract decision agreement (`ok` + `code`) across driver aliases, mixed alias counting behavior, unit mismatch, OutputPreview dynamic slot ports, feature virtual ports, and composite leaf-path rules.

#### Files Changed
- `src/app/spaghetti/contracts/endpoints.ts`
- `src/app/spaghetti/contracts/contractParity.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/driverInputAutoReplace.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Canvas cheap-check now derives rejection codes/messages from the shared contract engine used by `validateGraph`.
- Driver-input drop validation remains replace-friendly by validating projected post-auto-replace topology before command commit.
- Validator and canvas now share deterministic endpoint resolution/canonicalization and connection decision codes, reducing parity drift risk.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [093] - 2026-03-05 11:48 - `VM - Phase 4 - Derived View Model Selectors`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added pure deterministic selector layer under src/app/spaghetti/selectors/. Refactored SpaghettiCanvas node render-data derivation to use selectNodeVm via useMemo, removing large inline derivation logic.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` behavior.
- Did not change OutputPreview behavior/invariants.
- Added no topology mutation in selectors.
- Kept UI integration incremental with selector-backed derivation in existing render flow.

#### Summary of Implementation
- Added pure deterministic selector layer under `src/app/spaghetti/selectors/`:
  - `selectNodeVm` for node-card derived rows/details/composite input state and driver VM assembly.
  - `selectDriverVm` for driven driver row state and numeric offset/effective derivation.
  - `selectPreviewRenderVm` as OP-5 parity wrapper with `isReady` metadata.
  - `selectDiagnosticsVm` for merged/stable/grouped diagnostics VM.
- Refactored `SpaghettiCanvas` node render-data derivation to use `selectNodeVm` via `useMemo`, removing large inline derivation logic.
- Routed cycle-check diagnostics grouping through `selectDiagnosticsVm` (pure derived-only usage).
- Updated viewer preview wiring to use `selectPreviewRenderVm` while preserving render contract.
- Added selector test coverage for deterministic ordering, offset-mode correctness, OP-5 parity, stable diagnostics ordering, and idempotence.

#### Files Changed
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectDriverVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.ts`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/selectDriverVm.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/components/ViewerHost.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No topology/runtime protocol changes.
- UI derivation logic is now selector-backed, improving determinism and testability with behavior parity preserved.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [092] - 2026-03-05 11:28 - `GE - Phase 9 - Graph Command Kernel`
<!-- ============================================================ -->
HUMAN SUMMARY: `Introduced centralized graph command kernel under src/app/spaghetti/graphCommands/ with pure (graph) => nextGraph commands. Added applyGraphCommand(cmd) to useSpaghettiStore and wired it through existing normalization (normalizeGraphForStoreCommit) and waypoint pruning.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` behavior.
- Did not modify OutputPreview behavior/invariants.
- Added no new node types.
- Kept UI refactor minimal by replacing topology mutations with graph command calls.
- Preserved deterministic command behavior and post-command normalization flow.

#### Summary of Implementation
- Introduced centralized graph command kernel under `src/app/spaghetti/graphCommands/` with pure `(graph) => nextGraph` commands:
  - `addNode`, `removeNode`, `addEdge`, `removeEdge`, `replaceEdge`, `setNodeParams`, `setNodePosition`
  - `connectEdgeWithAutoReplace` + `planConnectEdgeWithAutoReplace` wrapper around driver input auto-replace planning.
- Added `applyGraphCommand(cmd)` to `useSpaghettiStore` and wired it through existing normalization (`normalizeGraphForStoreCommit`) and waypoint pruning.
- Updated store legacy `addEdge`/`removeEdge` methods to route topology changes via graph commands.
- Refactored canvas topology writes to command calls:
  - wire connect/replace now uses `planConnectEdgeWithAutoReplace` + `connectEdgeWithAutoReplace`
  - edge detach/delete now uses `removeEdge` command via `applyGraphCommand`
  - node add now uses `addNode` command via `applyGraphCommand`
- Refactored `SpaghettiEditor` node add flow to use `addNode` command.
- Added command-layer tests covering add/remove node/edge, auto-replace connect behavior, determinism, and OutputPreview non-deletable invariant through store command+normalization path.

#### Files Changed
- `src/app/spaghetti/graphCommands/types.ts`
- `src/app/spaghetti/graphCommands/addNode.ts`
- `src/app/spaghetti/graphCommands/removeNode.ts`
- `src/app/spaghetti/graphCommands/addEdge.ts`
- `src/app/spaghetti/graphCommands/removeEdge.ts`
- `src/app/spaghetti/graphCommands/replaceEdge.ts`
- `src/app/spaghetti/graphCommands/setNodeParams.ts`
- `src/app/spaghetti/graphCommands/setNodePosition.ts`
- `src/app/spaghetti/graphCommands/connectEdgeWithAutoReplace.ts`
- `src/app/spaghetti/graphCommands/index.ts`
- `src/app/spaghetti/graphCommands/graphCommands.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Topology mutations are now centralized through graph command functions plus store commit normalization.
- Existing user-facing behavior is preserved; OutputPreview singleton invariant remains enforced after command commits.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [091] - 2026-03-05 11:13 - `DR - Phase 10 - Driven Numeric Driver Offset Mode`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added optional part-node param metadata for driven numeric offsets. Extended store commit normalization to.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` implementation files.
- Did not modify OutputPreview behavior/invariants.
- Introduced no new node types.
- Kept topology mutations out of evaluation/selector/render/compile paths; normalization-only params patching used.
- Did not auto-delete edges for unresolved/invalid driver states.

#### Summary of Implementation
- Added optional part-node param metadata for driven numeric offsets:
  - `driverOffsetByParamId?: Record<string, number>`
  - `driverDrivenByParamId?: Record<string, true>`
- Extended store commit normalization to:
  - detect driven numeric nodeParam drivers via whole-port `in:drv:*` / `drv:in:*` incoming edges,
  - initialize missing numeric offsets to `0` on first driven state,
  - canonicalize and persist `driverDrivenByParamId` for currently driven numeric params,
  - preserve existing offsets on disconnect while clearing stale driven markers.
- Updated driver virtual output resolution so numeric `out:drv:*` emits:
  - base value when not driven,
  - `base + offset` when `driverDrivenByParamId[paramId] === true`.
- Extended driver VM contract for numeric rows with driven offset mode data:
  - `DriverNumberChange` now supports `kind: 'nodeParamOffset'`,
  - numeric rows can expose `offsetMode`, `drivenValue`, `offsetInput`, and `effectiveValue`.
- Updated canvas render data + driver edit path:
  - derives numeric driven/effective values from evaluation + stored offset,
  - patches `params.driverOffsetByParamId[paramId]` for offset edits.
- Updated numeric driver row UI:
  - non-driven numeric rows unchanged,
  - driven numeric rows show read-only driven value, editable offset control, and read-only effective value,
  - unresolved driven behavior remains intact with unresolved messaging.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- Driven numeric driver virtual outputs now emit effective values (`driven + offset`) when driven metadata is present.
- Numeric driver rows in driven mode now expose an editable local offset and read-only effective readout.
- Driven-but-unresolved behavior remains unresolved; offset is not applied in unresolved state.
- Non-numeric drivers and non-driven numeric drivers retain prior behavior.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [090] - 2026-03-05 01:22 - `DOC - Phase 4 - Roadmap Restore - Previous Tree-Backed Layout`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reverted docs/roadmap.md from the condensed execution-queue format back to the prior version. Restored the full trailing history tree and hierarchy sections that were previously present at the end of the file.`

#### Scope / Constraints Honored
- Documentation-only rollback of roadmap structure.
- No source/runtime/schema/protocol changes.
- Preserved existing changelog entries without edits.

#### Summary of Implementation
- Reverted `docs/roadmap.md` from the condensed execution-queue format back to the prior version.
- Restored the full trailing history tree and hierarchy sections that were previously present at the end of the file.
- Preserved prior track ordering and checklist content in the restored roadmap format.

#### Files Changed
- `docs/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Roadmap document returns to the prior tree-inclusive presentation.

#### Verification Steps
- Reviewed `docs/roadmap.md` and confirmed `## History Tree` and trailing hierarchy content are present.
- Confirmed new changelog section inserted at top with next sequential index `[065]`.

<!-- ============================================================ -->
### [089] - 2026-03-05 01:21 - `DR - Phase 9 - Canonical Driver ID Contract`
<!-- ============================================================ -->
HUMAN SUMMARY: `Switched canonical driver virtual port IDs to. Preserved dual-read compatibility for legacy aliases.`

#### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph` or `evaluateGraph` implementation files.
- Did not modify OutputPreview behavior/invariants.
- No new node types introduced.
- Limited canvas changes to minimal driver-wire exposure/parity paths.

#### Summary of Implementation
- Switched canonical driver virtual port IDs to:
  - input: `in:drv:<paramId>`
  - output: `out:drv:<paramId>`
- Preserved dual-read compatibility for legacy aliases:
  - `drv:in:<paramId>`
  - `drv:<paramId>`
- Updated driver virtual port helpers to parse both canonical + legacy forms, emit canonical builders, and provide canonicalization helpers.
- Updated canvas driver-row port mapping to bind by parsed `paramId` (`rowId = drv:<paramId>`) and prefer canonical ports when both aliases are present.
- Updated driver-input auto-replace endpoint keying so canonical/legacy driver-input aliases collapse to one logical replace target.
- Updated full validator endpoint counting to canonicalize driver-input endpoint keys so mixed alias edges respect the single-connection contract.
- Expanded tests to cover canonical contract, compatibility aliases, unit mismatch rejection for `in:drv:*`, and mixed-alias max-connection behavior.

#### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/driverInputAutoReplace.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/features/effectivePorts.test.ts`
- `src/app/spaghetti/canvas/driverInputAutoReplace.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- New canonical IDs are now first-class for driver virtual wiring:
  - `out:drv:*` for driver outputs
  - `in:drv:*` for driver inputs
- Legacy IDs remain accepted for backwards compatibility.
- Mixed canonical/legacy driver-input aliases now resolve as one logical endpoint for max-connection enforcement/auto-replace semantics.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
### [088] - 2026-03-05 01:15 - `DOC - Phase 3 - Roadmap Reorganization - Execution Queue And Track Consolidation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Replaced docs/roadmap.md with a focused working roadmap structure. Aligned current priorities with recent logs.`

#### Scope / Constraints Honored
- Documentation-only update.
- No source code, schema, runtime, worker, or protocol changes.
- Preserved historical implementation detail in existing changelog/archive docs.

#### Summary of Implementation
- Replaced `docs/roadmap.md` with a focused working roadmap structure:
  - explicit `Now`, `Next`, and `After Next` execution queue,
  - grouped active tracks by delivery concern (driver wiring, geometry/feature stack, sketch reliability, architecture hardening),
  - separated recently completed milestones from open work,
  - moved long-form history out of the working document via reference pointers.
- Aligned current priorities with recent logs:
  - OutputPreview track marked complete through `OP-6.1`,
  - recent completions called out for `[060]` and `[062]`,
  - queue centered on open driver and parity work.

#### Files Changed
- `docs/roadmap.md`
- `docs/CHANGELOG.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Planning workflow now has a single concise execution view with reduced duplication/noise.

#### Verification Steps
- Reviewed `docs/roadmap.md` section order and status grouping for consistency.
- Confirmed new entry inserted at top of `docs/CHANGELOG.md` with sequential index `[063]`.

<!-- ============================================================ -->
### [087] - 2026-03-04 22:12 - `GE - Phase 8 - Runtime Bridge Hardening - Tessellation Determinism And CCW Lock`
<!-- ============================================================ -->
HUMAN SUMMARY: `Extracted runtime tessellation into compiler-local helper runtimeTessellation.ts and wired compileGraph to use it. Added deterministic tessellation constants and pipeline.`

#### Scope / Constraints Honored
- Kept tessellation strictly at the compile-to-worker boundary (`compileGraph` payload assembly path).
- Preserved worker protocol and runtime contract:
  - `schemaVersion` remains `1`,
  - runtime ops remain `sketch` and `extrude` only.
- Kept analytic `ProfileLoop.segments` authoritative in app state.
- Did not move tessellation into worker/runtime layers.

#### Summary of Implementation
- Extracted runtime tessellation into compiler-local helper `runtimeTessellation.ts` and wired `compileGraph` to use it.
- Added deterministic tessellation constants and pipeline:
  - canonicalize to 6 decimals,
  - epsilon-based duplicate suppression (`EPSILON = 1e-6`) after canonicalization,
  - closure snap after full segment emission,
  - CCW enforcement using open-ring signed area with implicit closing edge.
- Implemented closure behavior to avoid synthetic close-point appends while normalizing near-closure deterministically.
- Added compile payload determinism test for curved `sketch -> closeProfile -> extrude` fixture:
  - byte-identical payload JSON across runs,
  - `schemaVersion` lock,
  - runtime op set lock (no emitted `closeProfile` op),
  - CCW/non-negative loop area assertion.
- Added focused tessellation unit tests for epsilon join suppression, closure snap/no double-close, CCW enforcement, and repeat determinism.

#### Files Changed
- `src/app/spaghetti/compiler/runtimeTessellation.ts`
- `src/app/spaghetti/compiler/runtimeTessellation.test.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Runtime sketch vertices emitted by compile-time tessellation are now epsilon-hardened and canonicalized deterministically.
- Near-closure endpoints are snapped deterministically; runtime payload remains worker-compatible with unchanged schema/op set.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/compiler/runtimeTessellation.test.ts src/app/spaghetti/compiler/compileGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed and build succeeded.

<!-- ============================================================ -->
### [086] - 2026-03-04 22:01 - `GE - Phase 8 - Runtime Bridge Hardening - Added Next-Task Changelog Entry`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added changelog tracking entry for the queued Phase 4A runtime bridge task. No runtime behavior changes.`

#### Scope / Constraints Honored
- Documentation-only update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.

#### Summary of Implementation
- Added changelog tracking entry for the queued Phase 4A runtime bridge task:
  - analytic `ProfileLoop.segments` bridge to runtime vertex loops,
  - tessellation at compile-to-runtime boundary only,
  - runtime ops contract remains `sketch` + `extrude`.

#### Files Changed
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Change tracking now includes the Phase 4A runtime bridge next task.

#### Verification Steps
- Reviewed `docs/listofchanges.md` for format consistency and sequential section index (`[061]`).

<!-- ============================================================ -->
### [085] - 2026-03-04 20:57 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Expand Extrude Taper And Offset Inputs`
<!-- ============================================================ -->
HUMAN SUMMARY: `Expanded feature virtual input contract from Extrude.depth only to Extrude.depth, Extrude.taper, and Extrude.offset. Added deterministic virtual ID/type handling for.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- Resolver remains single source of truth across validator/canvas/evaluator/UI.
- NodeView remains generic.

#### Summary of Implementation
- Expanded feature virtual input contract from `Extrude.depth` only to `Extrude.depth`, `Extrude.taper`, and `Extrude.offset`.
- Added deterministic virtual ID/type handling for:
  - `fs:in:<featureId>:extrude:depth` (`number:mm`)
  - `fs:in:<featureId>:extrude:taper` (`number:deg`)
  - `fs:in:<featureId>:extrude:offset` (`number:mm`)
- Added optional extrude params `taper`/`offset` using locked literal defaults `{ kind: 'lit', value: 0 }`.
- Added validator + cheap-check parity for feature virtual path rejection with `FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED`.
- Extended compile/evaluate flow so taper/offset overrides are deterministic and IR extrude fields are always present:
  - `depthResolved`, `taperResolved`, `offsetResolved`.
- Extended extrude UI rows and wiring state for depth/taper/offset with driven lock + unresolved behavior consistency.
- Added/updated tests for virtual ports, validation parity, evaluate determinism, compile overrides/defaults, and UI rendering behavior.

#### Files Changed
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/featureVirtualPorts.ts`
- `src/app/spaghetti/features/featureVirtualPorts.test.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Users can now wire into extrude taper/offset feature params using feature virtual inputs.
- Feature virtual inputs remain whole-port only; path-based connections are explicitly rejected.
- Occupied `fs:in:*` endpoints still reject in cheap-check (`maxConnectionsIn = 1`), unchanged from feature input contract.
- Compiled extrude IR now always includes deterministic resolved numeric fields for taper and offset.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
### [084] - 2026-03-04 20:33 - `DOC - Phase 2 - Node Tasking And Checklist Support - Renumber Tasklist Sections`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md section numbering to resolve duplicate 7 and increment subsequent sections. Applied requested sequence adjustment.`

#### Scope / Constraints Honored
- Documentation-only update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.
- Preserved changelog format and top-insert ordering.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` section numbering to resolve duplicate `7` and increment subsequent sections.
- Applied requested sequence adjustment:
  - second `7` -> `8`,
  - all following section numbers incremented by `+1`.
- Resulting section sequence from that point is now monotonic and unambiguous.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Tasklist numbering/readability improved.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` headings to confirm corrected numbering order.
- Confirmed new changelog entry inserted at top with next sequential index `[059]`.

<!-- ============================================================ -->
### [083] - 2026-03-04 20:28 - `DOC - Phase 2 - Node Tasking And Checklist Support - Update Phase 2C v2.1 Status`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md to add Phase 2C v2.1 (Driver Input Auto-Replace) as implemented. Added completed checklist items for.`

#### Scope / Constraints Honored
- Documentation-only checklist update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes in this step.
- Preserved existing changelog format and reverse-chronological insertion.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to add Phase 2C v2.1 (`Driver Input Auto-Replace`) as implemented.
- Added completed checklist items for:
  - scoped auto-replace on `drv:in:*`,
  - duplicate-drop no-op behavior,
  - deterministic replace/heal semantics,
  - whole-port endpoint-key lock,
  - cycle check enforcement at final drop commit.
- Renumbered downstream sections to keep sequence consistent:
  - Feature wiring expansion moved to section 10,
  - Phase 3 moved to section 11,
  - Quality gates moved to section 12.
- Added Phase 2C v2.1 full regression gate completion line.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Planning/checklist documents now reflect Phase 2C v2.1 completion.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for section numbering, status marks, and quality-gate alignment with implemented work.
- Confirmed changelog entry inserted at top with next sequential index `[058]`.

<!-- ============================================================ -->
### [082] - 2026-03-04 20:26 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Driver Input Auto-Replace`
<!-- ============================================================ -->
HUMAN SUMMARY: `Implemented deterministic auto-replace planning for driver virtual input targets (drv:in:*) via a new pure helper module. Added whole-port endpoint-key lock for driver virtual inputs.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- Resolver remains the single source of truth for endpoint typing/availability.
- `maxConnectionsIn` contract for `drv:in:*` remains 1 in final graph state.
- NodeView remained generic (no part-type UI branching added).

#### Summary of Implementation
- Implemented deterministic auto-replace planning for driver virtual input targets (`drv:in:*`) via a new pure helper module.
- Added whole-port endpoint-key lock for driver virtual inputs:
  - endpoint matching ignores path component and uses empty normalized path key.
- Added drop-time replacement semantics:
  - exact duplicate drop on clean occupied target is a no-op (existing edge preserved),
  - otherwise remove all existing incoming edges on same driver endpoint and append one new edge,
  - cycle checks run against the final candidate graph before commit.
- Updated canvas drop commit to use one atomic `applyGraphPatch` for replacement (remove+add together).
- Updated cheap-check semantics for occupied `drv:in:*` targets:
  - allowed when type/unit/path checks pass (replace-allowed),
  - path/type/unit invalid cases still reject as before.
- Added tests for endpoint-key behavior, replacement/no-op/healing logic, and cheap-check scope lock for occupied driver targets.

#### Files Changed
- `src/app/spaghetti/canvas/driverInputAutoReplace.ts` (new)
- `src/app/spaghetti/canvas/driverInputAutoReplace.test.ts` (new)
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Dropping a new compatible wire onto an occupied `drv:in:<paramId>` now replaces prior incoming edge(s) deterministically (`last drop wins`).
- Dropping the exact same connection again on a clean occupied driver input is now a no-op.
- Occupied non-driver inputs continue to enforce max-connection rejection in cheap-check.
- Cycle rejection still occurs at final drop commit (cheap-check still does not perform cycle checks).

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/driverInputAutoReplace.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
### [081] - 2026-03-04 20:13 - `DOC - Phase 2 - Node Tasking And Checklist Support - Update Phase 2C v2 Status`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md to mark Phase 2C v2 (Wire -> Driver) as implemented. Added explicit completed checklist coverage for.`

#### Scope / Constraints Honored
- Documentation-only update for task tracking/checklists.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.
- Preserved existing changelog format and reverse-chronological insertion.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to mark Phase 2C v2 (Wire -> Driver) as implemented.
- Added explicit completed checklist coverage for:
  - strict `drv:in:<paramId>` virtual input contract,
  - path-rejection parity code `DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED`,
  - driven-unresolved lock semantics and parity tests.
- Added Phase 2C v2 regression quality gate completion (`test` + `build` passing).
- Updated `docs/tasks/master-tasks.md` to reflect current state:
  - moved current priority to Phase 2B v2+ expansion work,
  - refreshed active/backlog items,
  - added completed milestones for Phase 2A, 2C v1, and 2C v2.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/tasks/master-tasks.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Project planning/checklist documents now reflect current implementation status.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for phase status and checklist consistency.
- Reviewed `docs/tasks/master-tasks.md` for synchronized priority/active/backlog/completed state.
- Confirmed changelog entry inserted at top with next sequential index `[056]`.

<!-- ============================================================ -->
### [080] - 2026-03-04 20:08 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Driver Virtual Inputs`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added driver virtual input contract for Part nodeParam drivers. Extended effective input resolver to include driver virtual inputs after declared and feature virtual inputs.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag/drop redesign.
- Kept NodeView generic (row-metadata-driven; no part-type branching).
- Preserved resolver parity across validator, cheap-check, evaluator, and UI pin rendering.

#### Summary of Implementation
- Added driver virtual input contract for Part nodeParam drivers:
  - `drv:in:<paramId>` with strict parser lock (`^[A-Za-z0-9_]+$`, non-empty, no extra `:`).
  - input direction, whole-port only, `maxConnectionsIn = 1`.
- Extended effective input resolver to include driver virtual inputs after declared and feature virtual inputs.
- Added deterministic path rejection for driver virtual inputs:
  - `validateGraph` emits `DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED`.
  - `validateConnectionCheap` returns matching code plus locked reason text:
    `Driver virtual inputs do not support path connections.`
- Integrated evaluation override semantics:
  - wired `drv:in:*` overrides `resolvedParams[paramId]` non-mutatively.
  - wired-but-unresolved keeps node driven/unresolved (no fallback to manual param).
  - driver virtual outputs read from resolved params, preserving deterministic order.
- Added UI wiring/render support on driver rows:
  - driver input pins + existing output pins rendered for eligible nodeParam rows.
  - driver row editor locks when driven.
  - deterministic unresolved indicator shown when driven but unresolved.
- Updated tests for parser/listing, validator parity, cheap/full parity, evaluator overrides, unresolved lock behavior, and NodeView pin/lock rendering.

#### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/features/effectivePorts.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/canvas/types.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Users can now wire `node.out -> drv:in:<paramId>` for Part nodeParam number/vec2 drivers with resolver-consistent validation.
- Driver rows can expose both input and output virtual pins; featureParam rows remain excluded.
- Driven drivers become read-only while wired.
- Wired-but-unresolved drivers remain locked and unresolved; manual param value is not silently used.
- Driver virtual input paths are deterministically rejected with parity across cheap and full validation.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/driverVirtualPorts.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/driverVm.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
### [079] - 2026-03-04 19:51 - `DOC - Phase 2 - Node Tasking And Checklist Support - Update Phase 2C v1 Status`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md to mark Phase 2C v1 Driver -> Input wiring as implemented. Marked all Phase 2C v1 checklist items complete.`

#### Scope / Constraints Honored
- Documentation-only tasklist update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler code changes in this step.
- Preserved existing changelog entry format and reverse-chronological insertion rule.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to mark Phase 2C v1 Driver -> Input wiring as implemented.
- Marked all Phase 2C v1 checklist items complete.
- Added explicit completion item for `drv:<paramId>` parser charset lock:
  - `^[A-Za-z0-9_]+$` (non-empty, no `:`).
- Restored/kept downstream future sections (`Phase 2C v2`, `Phase 2B v2+`, `Phase 3`, and quality gates) in correct order after tasklist refresh.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- No runtime behavior changes.
- Project planning/task tracking now reflects Phase 2C v1 as complete.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for:
  - updated Phase 2C v1 status and items,
  - intact section ordering through sections 8-11,
  - checklist legend/difficulty format consistency.

<!-- ============================================================ -->
### [078] - 2026-03-04 19:48 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Driver ParamId Determinism Locks`
<!-- ============================================================ -->
HUMAN SUMMARY: `Hardened drv:<paramId> parsing to enforce v1 param-id charset lock. Retained single-source resolver behavior for driver virtual outputs (effectivePorts) and existing evaluator/canvas/UI integration.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag-and-drop redesign.
- Kept Phase 2C v1 scope lock: nodeParam driver outputs only; featureParam driver outputs excluded.

#### Summary of Implementation
- Hardened `drv:<paramId>` parsing to enforce v1 param-id charset lock:
  - non-empty
  - no `:`
  - regex `^[A-Za-z0-9_]+$`
- Retained single-source resolver behavior for driver virtual outputs (`effectivePorts`) and existing evaluator/canvas/UI integration.
- Added deterministic test coverage for malformed `drv:*` IDs and repeated evaluation equality for driver virtual output wiring.

#### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Malformed driver virtual output IDs (for example `drv:width-mm`, `drv:width mm`, `drv:`) are now rejected deterministically by parser/is-check.
- Deterministic driver virtual output evaluation behavior is now explicitly locked by repeat-equality test coverage.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/driverVirtualPorts.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
### [077] - 2026-03-04 19:06 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Driver Virtual Output Wiring`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added virtual driver output port module with deterministic ID contract drv:<paramId>. Extended Part driver control metadata to support explicit wireOutputType and populated it for Part nodeParam drivers.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag-and-drop redesign.
- Feature stack remains embedded in `node.params.featureStack`.
- v1 lock enforced: nodeParam drivers only (`nodeParamNumber`/`nodeParamVec2`), featureParam drivers excluded.

#### Summary of Implementation
- Added virtual driver output port module with deterministic ID contract `drv:<paramId>`.
- Extended Part driver control metadata to support explicit `wireOutputType` and populated it for Part nodeParam drivers.
- Updated effective output resolver so declared outputs and driver virtual outputs are resolved from one source.
- Updated evaluator to append driver virtual outputs into `outputsByNodeId` from canonical node param values/fallback semantics (no node compute changes).
- Updated canvas render data to expose driver output port metadata by rowId and kept cheap validation parity through shared resolver.
- Updated NodeView to render output pins on nodeParam driver rows (right-end aligned; pin remains before row move controls when present).
- Added tests for helper contract, validator/evaluator behavior, resolver parity, and UI rendering expectations.

#### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts` (new)
- `src/app/spaghetti/features/driverVirtualPorts.test.ts` (new)
- `src/app/spaghetti/features/effectivePorts.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part node nodeParam driver rows now expose wireable output pins when `wireOutputType` metadata is present.
- `drv:<paramId> -> input` edges are now resolved/validated/evaluated consistently across cheap canvas validation and full graph validation.
- Driver virtual outputs are available in evaluation output maps (for example `outputsByNodeId[nodeId]['drv:widthMm']`).
- FeatureParam drivers (for example first extrude depth) remain non-wireable in v1.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/driverVirtualPorts.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
### [076] - 2026-03-04 18:47 - `NI - Phase 4 - Node UI And Wire Layout Pass - Center Reorder Glyph`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated row reorder button text/glyph alignment to centered layout. Increased reorder button glyph size from 2px to 10px.`

#### Scope / Constraints Honored
- App-layer CSS-only UI tweak.
- No worker/protocol/scheduler changes.
- No schema/compiler/runtime behavior changes.
- No drag-and-drop changes.

#### Summary of Implementation
- Updated row reorder button text/glyph alignment to centered layout.
- Increased reorder button glyph size from `2px` to `10px`.
- Added explicit centering properties on `.SpaghettiSectionRowMoveButton`:
  - `display: inline-flex`
  - `align-items: center`
  - `justify-content: center`
  - `text-align: center`

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Up/down arrow glyphs in reorder buttons are now centered and visibly larger.

#### Verification Steps
- Confirmed CSS values in `.SpaghettiSectionRowMoveButton`:
  - `font-size: 10px`
  - centered flex alignment properties present.

<!-- ============================================================ -->
### [075] - 2026-03-04 18:46 - `NI - Phase 4 - Node UI And Wire Layout Pass - Set Reorder Button Size`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated row reorder button dimensions to requested size. Applied to .SpaghettiSectionRowMoveButton hover/non-hover selector block.`

#### Scope / Constraints Honored
- App-layer CSS style tweak only.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.
- No drag-and-drop behavior changes.

#### Summary of Implementation
- Updated row reorder button dimensions to requested size:
  - `width: 20px`
  - `height: 5px`
- Applied to `.SpaghettiSectionRowMoveButton` hover/non-hover selector block.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Reorder up/down controls now render at `20x5` size.

#### Verification Steps
- Confirmed CSS values in `.SpaghettiSectionRowMoveButton`:
  - `min-width: 20px`
  - `width: 20px`
  - `height: 5px`

<!-- ============================================================ -->
### [074] - 2026-03-04 18:46 - `NI - Phase 4 - Node UI And Wire Layout Pass - Align Output Row Reorder Controls`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated output row reorder controls to use the full-height alignment mode already used for top/bottom pinning. Output section up/down buttons now stretch/alignment-match the row container and pin top/bottom consistently instead of staying center-stacked.`

#### Scope / Constraints Honored
- App-layer UI alignment update only.
- No worker/protocol/scheduler changes.
- No schema/validation/compiler/runtime behavior changes.
- No drag-and-drop behavior changes.

#### Summary of Implementation
- Updated output row reorder controls to use the full-height alignment mode already used for top/bottom pinning.
- Output section up/down buttons now stretch/alignment-match the row container and pin top/bottom consistently instead of staying center-stacked.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Output row reorder arrows now align to full row height (top and bottom anchors), matching row container bounds.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx`
- Confirmed output row move wrapper now uses `alignToValueBar: true`.

<!-- ============================================================ -->
### [073] - 2026-03-04 18:44 - `NI - Phase 4 - Node UI And Wire Layout Pass - Pin Row Reorder Arrows`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated the value-bar-aligned row move control container to stretch across the full row height. Removed offset-based positioning that pushed controls downward.`

#### Scope / Constraints Honored
- App-layer CSS alignment tweak only.
- No worker/protocol/scheduler changes.
- No schema/validation/compiler/runtime behavior changes.
- No drag-and-drop changes.

#### Summary of Implementation
- Updated the value-bar-aligned row move control container to stretch across the full row height.
- Removed offset-based positioning that pushed controls downward.
- Kept vertical `space-between` so:
  - up arrow is pinned to row top,
  - down arrow is pinned to row bottom.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Row reorder arrows now align to the top and bottom bounds of the row container instead of being offset toward the bottom.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx`
- Confirmed CSS for `.SpaghettiSectionRowMoveControls--valueBarAligned`:
  - `align-self: stretch`
  - `margin-top: 0`
  - `height: auto`
  - `min-height: 100%`
  - `justify-content: space-between`

<!-- ============================================================ -->
### [072] - 2026-03-04 18:44 - `NI - Phase 4 - Node UI And Wire Layout Pass - Resize Row Reorder Arrows`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated row reorder button dimensions from 5x5 to 8x8. Kept compact glyph sizing.`

#### Scope / Constraints Honored
- App-layer UI styling/layout update only.
- No worker/protocol/scheduler changes.
- No schema/normalization/compiler behavior changes.
- No drag-and-drop implementation changes.

#### Summary of Implementation
- Updated row reorder button dimensions from `5x5` to `8x8`.
- Kept compact glyph sizing.
- Added value-bar alignment mode for row move controls:
  - top button aligned to the top of the value-bar zone,
  - bottom button aligned to the bottom of the value-bar zone.
- Applied this alignment mode for Drivers and number-driven Inputs, while preserving centered controls for rows without value bars (for example many Outputs).

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Reorder up/down arrows are now larger (`8x8`) and vertically pinned to the value-bar bounds where applicable.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx`
- Confirmed CSS values:
  - `.SpaghettiSectionRowMoveButton` width/height `8px`
  - `.SpaghettiSectionRowMoveControls--valueBarAligned` uses `margin-top: 20px`, `height: 24px`, `justify-content: space-between`

<!-- ============================================================ -->
### [071] - 2026-03-04 18:41 - `NI - Phase 4 - Node UI And Wire Layout Pass - Shrink Row Reorder Arrow Controls`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reduced row reorder arrow control dimensions and glyph size for the SpaghettiSectionRowMoveButton style. Applied requested values.`

#### Scope / Constraints Honored
- App-layer styling update only.
- No worker/protocol/scheduler changes.
- No schema/runtime logic changes.
- No drag-and-drop or feature-stack migration changes.

#### Summary of Implementation
- Reduced row reorder arrow control dimensions and glyph size for the `SpaghettiSectionRowMoveButton` style.
- Applied requested values:
  - button size `5px x 5px`
  - `font-size: 2px`

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Reorder up/down arrow controls in Drivers/Inputs/Outputs row move UI now render at much smaller size.

#### Verification Steps
- Confirmed CSS values in `SpaghettiSectionRowMoveButton`:
  - `min-width: 5px`
  - `width: 5px`
  - `height: 5px`
  - `font-size: 2px`

<!-- ============================================================ -->
### [070] - 2026-03-04 18:40 - `DR - Phase 8 - Virtual Feature Wiring Expansion - Row Ordering Metadata`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added partRowOrder metadata support for part params (drivers, inputs, outputs) in Part node params schemas. Added new deterministic helper module partRowOrder.ts for.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag-and-drop added.
- Feature Stack row ordering not introduced in this phase.
- NodeView kept generic (shared row-move controls, no new part-type branching logic).

#### Summary of Implementation
- Added `partRowOrder` metadata support for part params (`drivers`, `inputs`, `outputs`) in Part node params schemas.
- Added new deterministic helper module `partRowOrder.ts` for:
  - stable row ID construction (`drv:*`, `in:*`, `out:*`),
  - deterministic normalize/repair behavior,
  - section ordering application,
  - output endpoint reordering while keeping reserved output rows fixed,
  - deterministic adjacent swap + no-op metadata clearing.
- Refactored `driverVm` row IDs from index-based IDs to stable deterministic IDs.
- Integrated silent canonicalization in store normalization path (no diagnostics emitted from store).
- Integrated single-source diagnostics in `validateGraph`:
  - new warning code `partRowOrder_invalid_shape_repaired`,
  - no warning on metadata absence,
  - params validation uses repaired params for non-fatal malformed metadata handling.
- Integrated ordered VM row rendering in canvas pipeline before `NodeView` render.
- Added up/down reorder controls for Drivers/Inputs/Outputs rows in `NodeView`.
- Added deterministic persistence for row reorder operations in `SpaghettiCanvas`:
  - initializes from current natural order when metadata absent,
  - applies pure adjacent swaps,
  - clears section metadata when returning to natural order,
  - removes `partRowOrder` when all sections are empty/undefined.

#### Files Changed
- `src/app/spaghetti/parts/partRowOrder.ts`
- `src/app/spaghetti/parts/partRowOrder.test.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part VM rows now have stable deterministic IDs used for ordering metadata.
- Part nodes can persist per-section row ordering in `params.partRowOrder`.
- Invalid `partRowOrder` shapes are repaired deterministically; warning emitted only from `validateGraph` with code `partRowOrder_invalid_shape_repaired`.
- Drivers/Inputs/Outputs rows can be reordered via up/down controls; ordering is deterministic and metadata is minimized when equal to natural order.
- Reserved output rows remain fixed in natural positions and are not reorderable in v1.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/parts/partRowOrder.test.ts src/app/spaghetti/canvas/driverVm.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [069] - 2026-03-04 18:23 - `DOC - Phase 2 - Node Tasking And Checklist Support - Update Task Lists After Phase 2`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md to reflect current project status after Phase 2 v1. Updated docs/tasks/master-tasks.md from placeholder state to an actionable board.`

#### Scope / Constraints Honored
- Documentation-only update under `docs/`.
- No worker/protocol/scheduler changes.
- No source/schema/runtime behavior changes in this step.
- No drag-and-drop or feature-stack architecture migration changes in this step.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to reflect current project status after Phase 2 v1:
  - marked Phase 2B v1 virtual feature-input wiring scope as implemented,
  - split future work into Phase 2A (row ordering), Phase 2B v2+ (wiring expansion), and Phase 3 migration path,
  - refreshed quality gates with explicit Phase 2 v1 verification completion.
- Updated `docs/tasks/master-tasks.md` from placeholder state to an actionable board:
  - set current priority to Phase 2A,
  - listed active work for row-ordering metadata,
  - added backlog for Phase 2A/2B v2/Phase 3,
  - recorded completed Phase 1 and Phase 2 v1 milestones.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/tasks/master-tasks.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- None. This change updates task planning/status documents only.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for updated phase status markers and section numbering.
- Reviewed `docs/tasks/master-tasks.md` for synchronized priority/active/backlog/completed state.
- Confirmed changelog entry inserted at top with next sequential index `[044]`.

<!-- ============================================================ -->
### [068] - 2026-03-04 18:21 - `DR - Phase 8 - Virtual Feature Wiring Expansion - External Feature-Input Wiring`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added deterministic virtual feature input port contract. Added shared effective-port resolver utilities and used them across compiler/canvas/UI listing to keep endpoint behavior consistent.`

#### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- Feature Stack remains embedded in `node.params.featureStack`.
- No drag-and-drop implementation.
- Phase 2 v1 scope locked to:
  - inputs only,
  - `Extrude.depth` only,
  - no composite paths,
  - `maxConnectionsIn = 1`,
  - external-only simplification (`from.nodeId !== to.nodeId`) for feature-target edges.

#### Summary of Implementation
- Added deterministic virtual feature input port contract:
  - `fs:in:<featureId>:extrude:depth`,
  - parse/build helpers,
  - virtual input listing in feature-stack order,
  - deterministic compile-time extrude depth override utility.
- Added shared effective-port resolver utilities and used them across compiler/canvas/UI listing to keep endpoint behavior consistent.
- Updated validation/evaluation/compile pipeline:
  - `validateGraph` now resolves virtual feature inputs, enforces max incoming constraints, and emits `FEATURE_WIRE_INTRA_NODE_UNSUPPORTED` for same-node feature-target edges (documented v1 simplification).
  - `evaluateGraph` now resolves virtual feature inputs into `inputsByNodeId[nodeId][virtualPortId]`.
  - `compileGraph` now applies evaluated virtual depth inputs as deterministic in-memory overrides before feature-stack IR compilation.
- Updated UI for Extrude-only wiring row:
  - added wireable depth endpoint inside `ExtrudeFeatureView`,
  - reused canvas pointer/anchor/drop validation handlers,
  - added driven-state UX: wired depth disables manual editing and shows driven value.
- Added/updated tests for virtual port helpers, resolver consistency, validator rules, evaluation mapping, compile determinism/override behavior, and UI rendering/disabled behavior.

#### Files Changed
- `src/app/spaghetti/features/featureVirtualPorts.ts`
- `src/app/spaghetti/features/effectivePorts.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/features/featureVirtualPorts.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part nodes now expose virtual feature input endpoints for extrude depth (`fs:in:<featureId>:extrude:depth`) in app-layer validation/evaluation/UI/compile flow.
- External wires can drive `Extrude.depth`; driven values override embedded depth literals at compile time only.
- Same-node feature-target edges are rejected in v1 with deterministic error code `FEATURE_WIRE_INTRA_NODE_UNSUPPORTED`.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/featureVirtualPorts.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/compiler/compileGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/compiler/compileGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [067] - 2026-03-04 17:55 - `DOC - Phase 2 - Node Tasking And Checklist Support - Create Tasks Master File`
<!-- ============================================================ -->
HUMAN SUMMARY: `Created new directory: docs/tasks/. Added docs/tasks/master-tasks.md as a central task-tracking document.`

#### Scope / Constraints Honored
- Documentation-only update under `docs/`.
- No worker/protocol/scheduler changes.
- No source/schema/runtime behavior changes.
- No drag-and-drop or feature-stack migration work in this step.

#### Summary of Implementation
- Created new directory: `docs/tasks/`.
- Added `docs/tasks/master-tasks.md` as a central task-tracking document.
- Seeded the file with a deterministic baseline structure:
  - legend,
  - current priority,
  - active work,
  - backlog,
  - completed.

#### Files Changed
- `docs/tasks/master-tasks.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- None. Documentation scaffolding only.

#### Verification Steps
- Confirmed `docs/tasks/` exists.
- Confirmed `docs/tasks/master-tasks.md` exists with starter sections.
- Confirmed changelog entry inserted at top with next sequential index `[042]`.

<!-- ============================================================ -->
### [066] - 2026-03-04 17:53 - `DOC - Phase 2 - Node Tasking And Checklist Support - Update Phase 1 Status`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md status markers to reflect completed Phase 1 closure work. Marked all Phase 1 checklist items complete for.`

#### Scope / Constraints Honored
- Documentation-only update in `docs`.
- No worker/protocol/scheduler changes.
- No app runtime, schema, or renderer code changes.
- No drag-and-drop or feature-stack migration implementation in this step.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` status markers to reflect completed Phase 1 closure work.
- Marked all Phase 1 checklist items complete for:
  - Part container contract (`partSlots`) metadata/normalization/invariants/diagnostics.
  - Locked Part section render order.
  - Required tests and verification tasks.
- Marked Quality Gates entries complete to match current verification and changelog compliance state.
- Left future roadmap sections (Phase 2 and Phase 3) unchanged.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- None. This change updates planning/status documentation only.

#### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for updated `[x]` statuses in Sections 2, 3, 4, and 7.
- Confirmed changelog entry inserted at the top with next sequential index `[041]`.

<!-- ============================================================ -->
### [065] - 2026-03-04 17:51 - `PT - Phase 6 - Part Container Contract - Closure Hardening`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated graph schema parsing so malformed legacy partSlots payloads do not hard-fail graph parsing. Kept deterministic normalization and repair architecture unchanged.`

#### Scope / Constraints Honored
- App-layer only changes in spaghetti schema/store/validator/canvas tests.
- No worker/protocol/scheduler changes.
- Feature Stack remains embedded in `node.params.featureStack`.
- No drag-and-drop implementation.
- Drivers/Inputs/Outputs remain VM-row generated.

#### Summary of Implementation
- Updated graph schema parsing so malformed legacy `partSlots` payloads do not hard-fail graph parsing:
  - `spaghettiNodeSchema.partSlots` now accepts unknown payloads at parse boundary.
  - `spaghettiGraphSchema` transform preserves malformed `partSlots` payloads for deterministic downstream repair/validation.
- Kept deterministic normalization and repair architecture unchanged:
  - store canonicalization (`normalizeGraphUiPositions`) still normalizes Part-node `partSlots` silently.
  - validation remains the single warning source for `partSlots` diagnostics.
- Expanded deterministic test coverage:
  - added schema compatibility tests proving malformed `partSlots` payloads parse successfully,
  - added validator invalid-shape matrix tests (`null`, array, string, partial, extra key, false value),
  - added validator reproducibility test for stable warning list/order across runs,
  - added store test proving non-Part nodes are not `partSlots`-normalized.
- Renderer contract remains locked and covered:
  - `Drivers -> Inputs -> Feature Stack -> Outputs`
  - Feature Stack still sourced from embedded `node.params.featureStack`.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Malformed legacy `partSlots` payloads no longer cause parse-time graph rejection.
- Deterministic repair path remains app-driven (store normalization + validator diagnostics), preserving backward compatibility.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/schema/spaghettiSchema.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [064] - 2026-03-04 17:43 - `DOC - Phase 2 - Node Tasking And Checklist Support - Add Easy-To-Hard Scale`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated docs/NODE-tasklist.md to include an explicit difficulty scale definition. Added Easy to Hard: X/100 labels directly on each major checklist section title to provide immediate complexity guidance.`

#### Scope / Constraints Honored
- Documentation-only update in `docs`.
- No worker/protocol/scheduler changes.
- No app runtime or schema behavior changes.
- No drag-and-drop or feature-stack migration implementation.

#### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to include an explicit difficulty scale definition:
  - `1 = easiest`, `100 = hardest`.
- Added `Easy to Hard: X/100` labels directly on each major checklist section title to provide immediate complexity guidance.
- Preserved existing checklist structure and status markers (`[ ]`, `[~]`, `[x]`).

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- None. This is a documentation clarity update only.

#### Verification Steps
- Reviewed all major section headings in `docs/NODE-tasklist.md` to confirm each includes a `1-100` difficulty score.
- Confirmed changelog entry is inserted at the top with next sequential index `[039]`.

<!-- ============================================================ -->
### [063] - 2026-03-04 17:40 - `DOC - Phase 2 - Node Tasking And Checklist Support - Add NODE Tasklist Checklist`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added docs/NODE-tasklist.md with a full status checklist covering. Checklist uses standardized state markers: [ ], [~], [x].`

#### Scope / Constraints Honored
- Documentation-only update in app docs.
- No worker/protocol/scheduler changes.
- No schema/runtime behavior changes.
- No drag-and-drop or feature-stack migration work performed.

#### Summary of Implementation
- Added `docs/NODE-tasklist.md` with a full status checklist covering:
  - locked Phase 1 architectural decisions,
  - Phase 1 container contract tasks (`partSlots` metadata, normalization, invariants, diagnostics),
  - locked part section render order requirements,
  - required tests and verification gates,
  - Phase 2 feature-level wiring roadmap,
  - optional Phase 3 true child-container migration path.
- Checklist uses standardized state markers: `[ ]`, `[~]`, `[x]`.

#### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- None. This change adds planning/documentation only.

#### Verification Steps
- Reviewed checklist structure and status markers for deterministic formatting.
- Confirmed changelog entry inserted at top with next sequential index.

<!-- ============================================================ -->
### [062] - 2026-03-04 17:39 - `PT - Phase 6 - Part Container Contract`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added additive partSlots structural metadata to SpaghettiNode with the Phase 1 contract keys. Added strict graph-schema parsing support for optional partSlots.`

#### Scope / Constraints Honored
- App-layer only changes in schema/store/validator/canvas tests.
- No worker/protocol/scheduler changes.
- Feature Stack remains embedded at `node.params.featureStack`.
- No drag-and-drop implementation was added.
- Node row-generation architecture remains VM-driven.

#### Summary of Implementation
- Added additive `partSlots` structural metadata to `SpaghettiNode` with the Phase 1 contract keys:
  - `drivers: true`
  - `inputs: true`
  - `featureStack: true`
  - `outputs: true`
- Added strict graph-schema parsing support for optional `partSlots`.
- Added new deterministic part-slots utility module:
  - `DEFAULT_PART_SLOTS`
  - `isPartNodeType(...)`
  - `hasValidPartSlots(...)`
  - `normalizePartSlots(...)`
- Integrated deterministic part-slots normalization into graph load canonicalization (`normalizeGraphUiPositions`) for part nodes.
- Added non-fatal deterministic validation warnings for part-slot normalization states:
  - `partSlots_missing_normalized`
  - `partSlots_invalid_shape_repaired`
- Refactored part template section rendering to an explicit ordered descriptor list, locking visible order to:
  - Drivers -> Inputs -> Feature Stack -> Outputs
- Added tests for part-slot normalization/repair, warning-code emission, render-order lock, and Feature Stack embedded-source behavior.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/parts/partSlots.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part nodes are now canonically persisted with `partSlots` metadata after load normalization.
- Legacy part nodes missing `partSlots` are deterministically normalized to the default container contract.
- Invalid `partSlots` shapes are deterministically repaired to the default container contract.
- Validator now emits deterministic warning diagnostics for missing/invalid part-slot metadata.
- Part template section rendering order is explicitly locked by descriptor ordering.

#### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
### [061] - 2026-03-04 03:55 - `NI - Phase 4 - Node UI And Wire Layout Pass - Expand Collapse And Toolbar Visibility`
<!-- ============================================================ -->
HUMAN SUMMARY: `Restored toolbar control visibility by keeping the toolbar toggle button mounted in both open and closed states (show/hide states only). Unified driver section presentation to avoid duplicate top-level and grouped Drivers labels, then adjusted default driver grouping behavior.`

#### Edit Times (HH:MM)
- 03:49
- 03:52
- 03:55
- 03:56
- 04:00

#### Scope / Constraints Honored
- App-layer UI/CSS updates in Spaghetti node template controls and headers.
- No compileGraph, worker, protocol, scheduler, or schema changes.
- Kept behavior metadata-driven with generic section/group collapse interactions.

#### Summary of Implementation
- Restored toolbar control visibility by keeping the toolbar toggle button mounted in both open and closed states (show/hide states only).
- Unified driver section presentation to avoid duplicate top-level and grouped `Drivers` labels, then adjusted default driver grouping behavior.
- Enabled collapsible driver subgroups for default/unlabeled driver rows so drivers expand/collapse consistently with section/group headers (`Properties` bucket used where no explicit group label exists).

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Toolbar control button now remains visible after opening the editor.
- Duplicate `Drivers` headers for Baseplate-style default-group drivers were removed.
- Driver buckets now participate in section/group collapse interactions.
- Node dragging in Spaghetti canvas now requires pointer events to originate in top node chrome (`SpaghettiNodeHeader`, `SpaghettiNodePresetRow`, or toolbar editor region), preventing unintended drags from ports/rows.
- Added a global ï¿½Pin Sizeï¿½ toolbar slider to control port dot diameter for both input and output pins across nodes.
- Port dot size now follows a shared canvas-level CSS variable (`--sp-port-dot-size`) so updates apply instantly and consistently to all node pins (including template and legacy ports).

#### Verification Steps
- `npm.cmd run build` (passed).

<!-- ============================================================ -->
### [060] - 2026-03-04 03:38 - `NI - Phase 4 - Node UI And Wire Layout Pass - Fit Node Preset Picker Width`
<!-- ============================================================ -->
HUMAN SUMMARY: `Changed the node preset picker control width behavior so the dropdown width now shrinks to fit its displayed text (for example > default). Updated .SpaghettiNodePresetControls to auto-width and made the <select> intrinsic-content width with nowrap text.`

#### Edit Times (HH:MM)
- 03:38
- 03:44
- 03:47
- 03:29
- 03:30
- 03:32
- 03:36
- 03:39
- 03:42
- 03:48
- 03:49
- 03:52
- 03:53
- 03:55

#### Scope / Constraints Honored
- UI/CSS-only adjustment in Spaghetti node preset picker.
- No compileGraph, worker protocol, or graph schema changes.
- Added a generic, metadata-driven section/group collapse model for part-node template sections using stable UI-store keys.
- Preserved node drag/select interaction safety by marking section/group headers as `data-sp-interactive="1"` and keeping drag guard centralized.
- Kept behavior deterministic and node-specific by scoping collapse state to `nodeId` and stable section/group IDs.

#### Summary of Implementation
- Changed the node preset picker control width behavior so the dropdown width now shrinks to fit its displayed text (for example `> default`).
- Updated `.SpaghettiNodePresetControls` to auto-width and made the `<select>` intrinsic-content width with nowrap text.
- In output template rows, anchored output header text by position: node output names now align to the top-left corner and output type labels align to the bottom-right near the anchor.
- In output template rows, expanded output header to full row height so type labels can anchor to the row bottom (not only the header token height), reducing the perceived bottom offset from header padding.
- In output template rows, changed the header layout to a 3-row grid so the type sits on a lower row (with extra space) and removed the `â†’` glyph from type labels.
- Mirrored the output node-row styling to template input rows in `v15Theme.css`:
  - input rows now use the slider-driven row height variable (default 40),
  - input row header text is mirrored (name top-right, type bottom-left) with type text using `var(--sp-port-color)`,
  - input composite toggle chevrons are hidden in template sections,
  - input rows keep 50% lane width and are anchored in the left input side while matching output row padding/appearance.
- Updated `Other/Debug (Legacy)` in full part-node mode to match section header styling and added collapse toggles for the parent section and each child section.
- Added a reusable section-header render helper in `NodeView.tsx` so Feature Stack and other collapsible toolbar sections use a common collapse interaction.
- Restored the part-node toolbar control toggle button in `NodeView.tsx` and made toolbar editor rows conditional on that toggle, so the control panel expands on demand rather than always rendering.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/FeatureStackView.tsx`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Template preset picker no longer uses a fixed/stretch width and now matches the selected label width.
- `Other/Debug (Legacy)` and its child sections now support collapse controls in the same format as Drivers/Inputs/Outputs.
- Feature Stack section now collapses via the same shared helper pattern used by other node toolbar headers.
- Added generic top-level section collapse for Drivers/Inputs/Feature Stack/Outputs, plus subgroup collapse in Drivers and Feature Stack.
- Added explicit output composite wire-up for group state while keeping output composite toggle UI removed where requested for output rows.
- Toolbar control button now remains visible after opening the node toolbar editor (toggles between show/hide states rather than disappearing).
- For default unlabeled driver buckets (e.g., Baseplate), suppressed redundant inner `Drivers` group headers so only the top-level section header is shown.
- Restored default/unlabeled driver buckets as collapsible subgroups so drivers can expand/collapse like other section/group headers.
- Default/unlabeled driver bucket header now renders as `Properties` to avoid duplicating the top-level `Drivers` section label while preserving collapse behavior.

#### Verification Steps
- `npm.cmd run build` (passed).

<!-- ============================================================ -->
### [059] - 2026-03-04 03:24 - `NI - Phase 4 - Node UI And Wire Layout Pass - Global Output Height Slider`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added an Output Height slider under existing node toolbar controls (Sensitivity, wiring toggle). Implemented as global shared state in SpaghettiCanvas so changing it in any node updates all output rows.`

#### Scope / Constraints Honored
- App-layer UI/CSS update only for Spaghetti canvas/node editor controls.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Added an `Output Height` slider under existing node toolbar controls (`Sensitivity`, wiring toggle).
- Implemented as global shared state in `SpaghettiCanvas` so changing it in any node updates all output rows.
- Applied the value via CSS custom property (`--sp-output-row-min-height`) on canvas root.
- Updated output row min-height CSS to consume the variable with fallback.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Node toolbar editor now includes an `Output Height` slider.
- Output row minimum height for all nodes updates live from that single slider value.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [058] - 2026-03-04 03:21 - `NI - Phase 4 - Node UI And Wire Layout Pass - Set Output Row Minimum Height`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated output lane row minimum height to a fixed 25px for .SpaghettiTemplateSection--outputs .SpaghettiPort--out. Output endpoint rows in the Outputs section now enforce at least 25px height.`

#### Scope / Constraints Honored
- CSS/UI-only sizing update for template output rows.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Updated output lane row minimum height to a fixed `25px` for `.SpaghettiTemplateSection--outputs .SpaghettiPort--out`.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Output endpoint rows in the Outputs section now enforce at least 25px height.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [057] - 2026-03-04 03:20 - `NI - Phase 4 - Node UI And Wire Layout Pass - Increase Output Row Height`
<!-- ============================================================ -->
HUMAN SUMMARY: `Increased output row vertical size by raising output row minimum height and vertical padding. Increased output header minimum height to keep label/type alignment centered within the taller row.`

#### Scope / Constraints Honored
- CSS/UI-only update in Spaghetti template output row styling.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Increased output row vertical size by raising output row minimum height and vertical padding.
- Increased output header minimum height to keep label/type alignment centered within the taller row.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Output endpoint rows in the Outputs section now render taller than before.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [056] - 2026-03-04 03:19 - `NI - Phase 4 - Node UI And Wire Layout Pass - Half-Width Input Output Lanes`
<!-- ============================================================ -->
HUMAN SUMMARY: `Restored half-width lane behavior for template endpoint rows. Kept output pin offset at the outer right edge while preserving lane anchoring.`

#### Scope / Constraints Honored
- CSS/UI-only layout adjustments for Spaghetti node template lanes.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Restored half-width lane behavior for template endpoint rows:
  - input lane is half-width and anchored left,
  - output lane is half-width and anchored right.
- Kept output pin offset at the outer right edge while preserving lane anchoring.
- Matched output row vertical sizing to input row sizing by aligning output row padding/header min-height with input row baseline.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Input endpoint rows now occupy left half of section width.
- Output endpoint rows now occupy right half of section width.
- Output endpoint row height now visually matches input endpoint row height.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [055] - 2026-03-04 03:17 - `NI - Phase 4 - Node UI And Wire Layout Pass - Align Template Section Widths`
<!-- ============================================================ -->
HUMAN SUMMARY: `Made all template sections use the same width treatment as Drivers by applying the section margin rule to every .SpaghettiTemplateSection instead of only the first section. Matched port-column widths to driver-style full section width.`

#### Scope / Constraints Honored
- CSS/UI-only layout updates for Spaghetti node template.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Made all template sections use the same width treatment as Drivers by applying the section margin rule to every `.SpaghettiTemplateSection` instead of only the first section.
- Matched port-column widths to driver-style full section width:
  - input port column in template sections now full width,
  - outputs port column now full width (removed half-width right-anchored layout).
- Moved output pins farther right to align with the outer section edge:
  - output row overflow set to visible,
  - output pin offset moved outward.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Inputs/Feature Stack/Outputs sections now visually align in width with Drivers.
- Output rows span full section width instead of half-width.
- Output socket pin sits on the outer right edge, matching the driver-side pin feel.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [054] - 2026-03-04 03:14 - `NI - Phase 4 - Node UI And Wire Layout Pass - Fix Right-Side Click Regression`
<!-- ============================================================ -->
HUMAN SUMMARY: `Lowered Spaghetti wire layer stacking order so node surfaces are above wires for pointer interaction. This prevents wire hit targets from stealing right-side node clicks and selection interactions.`

#### Scope / Constraints Honored
- UI-layer CSS interaction fix only.
- No graph/compiler/worker/protocol/schema changes.

#### Summary of Implementation
- Lowered Spaghetti wire layer stacking order so node surfaces are above wires for pointer interaction.
- This prevents wire hit targets from stealing right-side node clicks and selection interactions.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Node selection/highlight interactions now take precedence over overlapping wire strokes on node rows, including right/output side clicks.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [053] - 2026-03-04 03:11 - `NI - Phase 4 - Node UI And Wire Layout Pass - Remove Output Composite Toggle`
<!-- ============================================================ -->
HUMAN SUMMARY: `Removed the output composite toggle button hook from composite output row rendering in NodeView. Inner spline output rows no longer render the right-side chevron/toggle button.`

#### Scope / Constraints Honored
- UI-only change in Spaghetti node view rendering.
- No compile graph, worker protocol, or schema/runtime changes.

#### Summary of Implementation
- Removed the output composite toggle button hook from composite output row rendering in `NodeView`.
- `Inner` spline output rows no longer render the right-side chevron/toggle button.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Composite outputs still render, but their toggle button is no longer shown in output rows.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [052] - 2026-03-04 03:09 - `NI - Phase 4 - Node UI And Wire Layout Pass - Typed Sockets And Wires`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a shared type color source in canvas layer. Updated PortView socket rendering.`

#### Scope / Constraints Honored
- App-layer Spaghetti canvas/view updates only.
- `compileGraph`, worker protocol, and graph schema were not changed.
- Node rendering remains metadata-driven via `port.type.kind` (no node-type branching).

#### Summary of Implementation
- Added a shared type color source in canvas layer:
  - `TYPE_COLOR_MAP` plus `getTypeColor(kind)` in `typeColors.ts`.
- Updated `PortView` socket rendering:
  - socket color now resolves from `getTypeColor(port.type.kind)`,
  - root port row now sets `--sp-port-color` from the same map for consistent color usage.
- Updated wire rendering to inherit source endpoint kind color:
  - `SpaghettiCanvas` resolves source endpoint kind (including composite leaf paths),
  - computes `edgeColorById` using source kind -> `getTypeColor`,
  - passes per-edge colors into `WireLayer`.
- Updated `WireLayer` rendering:
  - each wire path now uses its edge color,
  - crossing loop stroke and waypoint stroke follow the same edge color,
  - preview wire uses source color when available.
- Made compatibility blocking explicit for kind mismatch:
  - connection validation now rejects `from.kind !== to.kind` with a dedicated reason,
  - unit mismatch remains blocked as a separate check.

#### Files Changed
- `src/app/spaghetti/canvas/typeColors.ts` (new)
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/WireLayer.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Socket circles now always color from the shared type map keyed by `port.type.kind`.
- Wires now inherit color from the source endpoint type, including composite leaf-field connections.
- Drag-preview wire color follows the current source endpoint when determinable.
- Connection attempts with mismatched endpoint kinds are rejected with an explicit kind-mismatch message.

#### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [051] - 2026-03-04 03:40 - `NI - Phase 4 - Node UI And Wire Layout Pass - Driver Section Styling And Toolbar Editor`
<!-- ============================================================ -->
HUMAN SUMMARY: `Performed iterative visual cleanup to push node styling toward Blender-like compactness. Unified/expanded section interaction model.`

#### Scope / Constraints Honored
- App-layer UI/view changes only.
- No worker/runtime/protocol/scheduler/compile-payload contract changes.
- `NodeView` remained metadata-driven (no node-type branching introduced).
- Deterministic row ordering preserved (no new sort logic added).

#### Summary of Implementation
- Performed iterative visual cleanup to push node styling toward Blender-like compactness:
  - tighter row density, smaller sockets, cleaner spacing primitives,
  - driver field endcaps redesigned as integrated clickable caps (step down/up),
  - pin/cap alignment tuned to section box boundaries.
- Unified/expanded section interaction model:
  - clickable section header hit-areas for `Drivers`, `Inputs`, `Feature Stack`, `Outputs`,
  - collapsible section behavior with pins-only rendering for driver/input/output sections.
- Added collapsed driver pin-value readout:
  - small numeric labels above output-side pins in pins-only mode.
- Added node-level toolbar editor launcher beside preset:
  - unlabeled toggle button,
  - hidden editor area above `Drivers`,
  - scrub sensitivity slider,
  - internal wiring visibility toggle.
- Reworked number field styling behavior:
  - restored and refined fill/empty contrast,
  - stronger scrub glow while dragging,
  - text casing and typography normalized to chosen header style baseline (then adjusted back to non-uppercase for field content),
  - text selectability enabled.
- Output section style modernization:
  - compact inline text style (`name -> type`),
  - half-width right-anchored output rows,
  - output row background tinted by output type color,
  - overflow/pin containment fixes within section box.
- Wire layering adjustments:
  - raised spaghetti wire layer above node baseplate/output UI surfaces per UX request.

#### Style Standards Established (Current)
- Section headers (`Drivers`, `Inputs`, etc.) define the typography baseline for node control labels.
- Driver number fields:
  - compact single-row control,
  - integrated dark endcaps,
  - distinct empty-area color vs. fill color,
  - pin visibility and line presentation tuned for clarity.
- Outputs:
  - right-anchored half-width compact presentation,
  - no fill-bar treatment for standard output rows,
  - inline directional text emphasis and type-color tinting.
- Preset row controls:
  - toolbar toggle and dropdown match height/border/background family.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/fields/NumberField.tsx`
- `src/app/spaghetti/canvas/fields/Vec2Field.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (UI)
- Drivers/Inputs/Outputs can collapse independently from section headers.
- Driver pins-only mode now shows lightweight numeric value labels near output pins.
- Node toolbar editor is opt-in per node and exposes:
  - scrub sensitivity,
  - internal wiring visibility.
- Endcaps now support click-based incremental stepping.

#### Notes
- This entry captures an iterative polish pass with many micro-adjustments in CSS/layout layering.
- Intentional outcome: preserve existing graph semantics while improving node readability and edit ergonomics.

<!-- ============================================================ -->
### [050] - 2026-03-04 01:02 - `PT - Phase 5 - Part Template Population - Shared NumberField And Driver Refactor`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added evaluator-resolved inputs exposure for UI consumption without Canvas-side partial evaluation. Extended driver VM endpoint row metadata and registry endpoint-driver metadata.`

#### Scope / Constraints Honored
- UI/view-model/compiler-evaluator app-layer changes only.
- No worker runtime, protocol contract, scheduler, or auto-build behavior changes.
- `NodeView` remains generic and metadata-driven (no node-type branching added).
- Deterministic ordering preserved from registry/VM order (no sorting introduced).

#### Summary of Implementation
- Added evaluator-resolved inputs exposure for UI consumption without Canvas-side partial evaluation:
  - `EvaluationResult.inputsByNodeId` now carries the already-resolved per-node inputs map.
- Extended driver VM endpoint row metadata and registry endpoint-driver metadata:
  - endpoint rows now support `displayValue`, `inputWiringDisabled`, and `drivenMessage`,
  - endpoint driver specs now support `wiringDisabled` and `visibility` (`always` / `connectedOnly`).
- Implemented shared numeric controls used by both port rows and driver rows:
  - new `NumberField` with Blender-like square scrub zone + numeric input (single scrub math implementation),
  - new `Vec2Field` composed from two `NumberField` controls with compact `X`/`Y` labels and equal-width layout.
- Refactored `PortView` to consume shared `NumberField` controls and added `resolvedValueLabel` support:
  - input type badge now shows resolved numeric display (e.g. `235.6 mm`) when available,
  - fallback remains type badge when unresolved.
- Refactored `NodeView` driver rows to use shared `NumberField` / `Vec2Field` controls.
- Made collapsed mode editing baseline across modes:
  - `rowViewMode.collapsed.showEditors` set to `true` with tests updated.
- Implemented Baseplate Width/Length driver refactor with selected soft compatibility:
  - Width/Length moved to non-wireable `nodeParam` drivers,
  - legacy width/length input rows preserved as connected-only, read-only migration rows.
- Updated node/port CSS to establish shared row primitives and Blender-style control visuals:
  - driver rows no longer reserve pin gutters or show ghost lane visuals,
  - outputs now support compact right-anchored badge cluster while preserving full-row hit area/wiring behavior.

#### Files Changed
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/canvas/fields/NumberField.tsx` (new)
- `src/app/spaghetti/canvas/fields/Vec2Field.tsx` (new)
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Collapsed/essentials/everything now share the same editable Number/Vec2 control baseline; expanded modes add sections/rows instead of changing control style.
- Driver controls now use a unified Blender-like scrub+input control style with no arrows/spinners.
- Numeric input badges can display resolved values when known; unresolved inputs continue to display type badges.
- Baseplate Width/Length primary editing is now in Drivers; legacy width/length input rows appear only when wired and are read-only/non-wireable.
- Output rows keep full-width interaction/wiring behavior while visually right-anchoring the output badge cluster.

#### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/rowViewMode.test.ts src/app/spaghetti/canvas/driverVm.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts` (passed)
- `npm.cmd run test` (passed)
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
### [049] - 2026-03-04 00:29 - `PT - Phase 5 - Part Template Population - HeelKick Template Population`
<!-- ============================================================ -->
HUMAN SUMMARY: `Converted existing Part/HeelKick node definition to ToeHook-parity part-template shape. Added heel-specific deterministic defaults (different from ToeHook) for profile controls.`

#### Scope / Constraints Honored
- UI/data-model + spaghetti compiler/store compatibility updates only.
- No worker/protocol/scheduler runtime changes.
- `NodeView` remains generic and metadata-driven; no node-type branches added.
- Deterministic ordering preserved via registry driver order and first-seen group order.
- Registry remains the single source of truth for default node params.

#### Summary of Implementation
- Converted existing `Part/HeelKick` node definition to ToeHook-parity part-template shape:
  - Drivers (Global/Profile A/Profile B), non-wireable.
  - Inputs: `anchorSpline`, `railMath` (wireable).
  - Outputs: `hookLoft` with opaque `toeLoft` kind (wireable).
- Added heel-specific deterministic defaults (different from ToeHook) for profile controls:
  - `profileA_end`, `profileA_endCtrl`, `profileA_baseCtrl`,
  - `profileB_end`, `profileB_endCtrl`, `profileB_baseCtrl`.
- Added legacy input alias support on HeelKick:
  - `legacyInputPortAliases: { anchorSpline2: 'anchorSpline' }`.
- Mirrored ToeHook payload compatibility strategy for HeelKick in compiler:
  - added explicit heel anchor mapping helper (`uiPortId: anchorSpline`, `payloadKey: anchorSpline2`) with invariant comment,
  - added fallback resolution order for heel anchor input:
    1) canonical `anchorSpline`, then
    2) legacy `anchorSpline2`.
- Added compile-time canonicalization pass for legacy input aliases before evaluation/validation, enabling raw legacy graphs to compile without requiring store normalization first.
- Added optional dev fixture for quick manual check:
  - `createValidBaseplateHeelKickGraph()`,
  - panel button: `Load Baseplate - HeelKick`.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/dev/sampleGraph.ts`
- `src/app/panels/SpaghettiPanel.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- HeelKick now renders full part template sections with populated grouped drivers and pin-bearing inputs/outputs.
- HeelKick accepts legacy incoming anchor edges targeting `anchorSpline2` and canonicalizes/resolves them to `anchorSpline` paths.
- Build payload contract for heel remains unchanged (`...anchorSpline2`).

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [048] - 2026-03-04 00:20 - `PT - Phase 5 - Part Template Population - ToeHook Template Population`
<!-- ============================================================ -->
HUMAN SUMMARY: `Populated Part/ToeHook template metadata with deterministic default drivers/inputs/outputs. Added registry-level backward compatibility alias metadata.`

#### Scope / Constraints Honored
- UI/data-model and compiler/store compatibility updates for Spaghetti graphing.
- No worker runtime/protocol/scheduler behavior changes.
- Payload key compatibility preserved (`anchorSpline2` remains emitted for ToeHook build inputs).
- Deterministic ordering preserved for driver/input/output rows and grouped drivers (first-seen group order, registry row order).

#### Summary of Implementation
- Populated `Part/ToeHook` template metadata with deterministic default drivers/inputs/outputs:
  - Drivers (non-wireable): Global + Profile A + Profile B rows (number + vec2 param controls),
  - Inputs (wireable): `anchorSpline`, `railMath`,
  - Outputs (wireable): `toeLoft`.
- Added registry-level backward compatibility alias metadata:
  - `legacyInputPortAliases: { anchorSpline2: 'anchorSpline' }` on ToeHook.
- Added store-level canonicalization for incoming edge target input port ids using registry aliases, so legacy edges targeting `anchorSpline2` normalize to canonical `anchorSpline`.
- Added single authoritative default param source in registry:
  - `defaultParams` on node definitions,
  - `getDefaultNodeParams(type)` accessor returning a fresh cloned object,
  - updated both add-node flows (`SpaghettiCanvas`, `SpaghettiEditor`) to consume registry defaults.
- Extended generic driver VM and NodeView rendering:
  - new non-wireable node-param driver rows (number and vec2),
  - grouped Drivers rendering is fully metadata-driven and stable (no sorting),
  - no node-type branching added to `NodeView`.
- Added new opaque port kinds:
  - `railMath`, `toeLoft` in shared type/schema unions and UI color mappings.
- Tightened opaque evaluator validation:
  - accepts only `null` or `{ __opaqueRef: string }`,
  - rejects arbitrary objects to avoid silent type masking.
- Added explicit ToeHook UI-to-payload port mapping function in compiler with hard invariant comment:
  - UI input port id: `anchorSpline`,
  - payload key: `anchorSpline2`.
  - Compile path includes fallback support for legacy-stored `anchorSpline2` input edges.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/dev/sampleGraph.ts`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/driverVm.test.ts` (new)
- `src/app/spaghetti/store/useSpaghettiStore.test.ts` (new)
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- ToeHook part nodes now render meaningful default rows under:
  - Drivers -> Inputs -> Feature Stack -> Outputs.
- ToeHook Drivers are non-wireable controls; Inputs/Outputs remain pin-based wireable endpoints.
- Legacy ToeHook input edge targets using `anchorSpline2` are canonicalized to `anchorSpline` in normalized graph state.
- Build payload contract remains unchanged: ToeHook anchor value still emitted as `anchorSpline2`.
- Opaque kinds `railMath`/`toeLoft` are now wire/display-capable with strict placeholder value validation.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [047] - 2026-03-03 23:05 - `PT - Phase 5 - Part Template Population - Baseplate Outputs Cleanup`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated Part/Baseplate output port declarations to the minimal public set by removing incidental outer spline output exposure. Kept existing output-driver taxonomy unchanged.`

#### Scope / Constraints Honored
- UI/registry-only cleanup.
- No edits under `src/app/spaghetti/features/**`, `src/app/spaghetti/compiler/**`, `src/app/spaghetti/integration/**`, or `src/worker/**`.
- No protocol/scheduler changes.
- Deterministic output ordering behavior preserved.

#### Summary of Implementation
- Updated `Part/Baseplate` output port declarations to the minimal public set by removing incidental outer spline output exposure:
  - kept: `anchorSpline2` (wireable public endpoint),
  - removed from public outputs: `offsetSpline2` (intermediate/internal artifact).
- Kept existing output-driver taxonomy unchanged:
  - `Inner Spline Anchor` endpoint row remains in `Outputs`,
  - reserved `Mesh Output` pending row remains endpoint-less and non-wireable.
- Updated Baseplate compute return shape to remove undeclared `offsetSpline2`, keeping evaluator validation green while preserving compiler/integration code paths unchanged.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Baseplate now exposes only intended public output endpoint (`Inner Spline Anchor`) plus reserved mesh pending row in template output rows.
- In `everything` mode, Baseplate no longer contributes incidental endpoint(s) to `Other Outputs` via port-subtraction.

#### Verification Steps
- `rg -n "offsetSpline2|Base Plate Spline \\(Outer\\)" src/app/spaghetti/registry/nodeRegistry.ts`
- `npm.cmd --prefix parahook run test`
- `npm.cmd --prefix parahook run build`

<!-- ============================================================ -->
### [046] - 2026-03-03 22:56 - `PT - Phase 5 - Part Template Population - Drivers Inputs Outputs Taxonomy`
<!-- ============================================================ -->
HUMAN SUMMARY: `Refactored part-template row taxonomy in VM and NodeView from Input Drivers/Output Drivers to. Updated driverVm output shape to drivers, inputs, outputs, otherOutputs while keeping existing metadata fields (inputDrivers, outputDrivers) unchanged for minimal API churn.`

#### Scope / Constraints Honored
- UI-only refactor in canvas/view-model layers.
- No edits under `src/app/spaghetti/features/**`, `src/app/spaghetti/compiler/**`, `src/app/spaghetti/integration/**`, or `src/worker/**`.
- No protocol/scheduler changes.
- Deterministic ordering preserved from metadata arrays and stable endpoint-key subtraction.

#### Summary of Implementation
- Refactored part-template row taxonomy in VM and `NodeView` from `Input Drivers/Output Drivers` to:
  - `Drivers` (feature-param controls, non-wireable),
  - `Inputs` (wireable endpoint rows),
  - `Outputs` (pinned endpoint rows + reserved rows),
  - `Other Outputs` (everything-only, non-pinned endpoint rows).
- Updated `driverVm` output shape to `drivers`, `inputs`, `outputs`, `otherOutputs` while keeping existing metadata fields (`inputDrivers`, `outputDrivers`) unchanged for minimal API churn.
- Updated part-template render order in `NodeView` to:
  - `Drivers -> Inputs -> Feature Stack -> Outputs`,
- Locked collapsed-mode rendering behavior in UI:
  - drivers rows render,
  - inputs rows render with anchors/pins,
  - feature stack internals are hidden,
  - outputs rows render.
- Updated reserved mesh row interaction markers:
  - row and dot now include both `data-sp-interactive="1"` and `data-sp-disabled-port="1"`,
  - row remains endpoint-less and non-wireable.
- Updated canvas interactive-target guard so disabled reserved port targets are still treated as interactive UI targets (preventing node-drag capture on that control area).

#### Files Changed
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part node sections now display locked taxonomy labels: `Drivers`, `Inputs`, `Feature Stack`, `Outputs`.
- `Outputs` remains the last core section in all modes.
- Reserved mesh pending row remains disabled/non-wireable but no longer behaves like non-interactive empty space for node drag/select hit-testing.

#### Verification Steps
- `rg -n "Baseplate|ToeHook|HeelKick|Part/Baseplate|Part/ToeHook|Part/HeelKick" src/app/spaghetti/canvas/NodeView.tsx` (no matches)
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [045] - 2026-03-03 20:44 - `NI - Phase 3 - Baseplate And Node Surface UI - Remove Title-Click Mode Buttons`
<!-- ============================================================ -->
HUMAN SUMMARY: `Removed Baseplate header click-to-open mode picker from NodeView. Removed associated callback wiring from SpaghettiCanvas.`

#### Scope / Constraints Honored
- Canvas/UI-only cleanup.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Removed Baseplate header click-to-open mode picker from `NodeView`.
- Removed associated callback wiring from `SpaghettiCanvas`.
- Removed now-unused mode-picker styles from theme.
- Right-click node context menu (`collapsed` / `essentials` / `expanded`) remains the active mode-switch UI.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Clicking Baseplate title/top no longer opens row-mode buttons.
- Row mode switching from nodes is now right-click menu driven.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [044] - 2026-03-03 20:39 - `NI - Phase 3 - Baseplate And Node Surface UI - Context Menu Routing`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated viewport right-click behavior in SpaghettiCanvas. Added canvas-level node row-mode context menu using SpaghettiContextMenu with 3 options.`

#### Scope / Constraints Honored
- Canvas/UI-only interaction update.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Updated viewport right-click behavior in `SpaghettiCanvas`:
  - If target is inside a `.SpaghettiNode`, open node row-mode context menu.
  - If target is on blank canvas area, open existing add-node search menu.
- Added canvas-level node row-mode context menu using `SpaghettiContextMenu` with 3 options:
  - `collapsed`
  - `essentials`
  - `expanded` (maps to internal `everything` row mode)
- Menus are mutually exclusive:
  - opening node mode menu closes add-node menu,
  - opening add-node menu closes node mode menu.
- Added Escape handling for the node row-mode context menu.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Right-click on blank node editor space now shows the add-node search menu only.
- Right-click on any node block (Baseplate, Toe Hook, Heel Kick, etc.) now shows row-mode options instead of add-node menu.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [043] - 2026-03-03 20:34 - `NI - Phase 3 - Baseplate And Node Surface UI - Header Mode Picker`
<!-- ============================================================ -->
HUMAN SUMMARY: `Replaced Baseplate title click behavior with a header mode picker. Clicking the top Baseplate header now toggles a 3-button mode menu.`

#### Scope / Constraints Honored
- Canvas/UI-only behavior and styling changes.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Replaced Baseplate title click behavior with a header mode picker.
- Clicking the top Baseplate header now toggles a 3-button mode menu:
  - `collapsed`
  - `essentials`
  - `expanded`
- Mode button mapping:
  - `collapsed` => row mode `collapsed`
  - `essentials` => row mode `essentials`
  - `expanded` => row mode `everything` (internal expanded mode)
- Added compact button styles and active-state highlighting for current row mode.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Clicking the top of a Baseplate node now opens mode options instead of immediately forcing `collapsed`.
- Selecting a mode button switches the canvas into that mode and closes the picker.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [042] - 2026-03-03 20:30 - `NI - Phase 3 - Baseplate And Node Surface UI - Align Scrub Slider Left Edge`
<!-- ============================================================ -->
HUMAN SUMMARY: `Introduced a shared right-column width token for Baseplate controls (clamp(140px, 50%, 170px)). Applied the shared width to.`

#### Scope / Constraints Honored
- UI-only style adjustment.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph semantic changes.

#### Summary of Implementation
- Introduced a shared right-column width token for Baseplate controls (`clamp(140px, 50%, 170px)`).
- Applied the shared width to:
  - `Preset` dropdown (`.SpaghettiNodePresetRow select`),
  - scrub controls row (`.SpaghettiNodeScrubControls`).
- Kept scrub slider at 50% width and right-anchored within that aligned control column.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Scrub slider no longer spans the full node row.
- Slider left edge now aligns with the `default` preset dropdown left edge above.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [041] - 2026-03-03 20:28 - `NI - Phase 3 - Baseplate And Node Surface UI - Scrub Toggle Presets Restored`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reintroduced scrub toggle button in Baseplate sketch header with two presets. Kept continuous slider behavior (0..100) and in-between values.`

#### Scope / Constraints Honored
- UI-only change in canvas layer.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Reintroduced scrub toggle button in Baseplate sketch header with two presets:
  - `low` preset => `0%`,
  - `high` preset => `100%`.
- Kept continuous slider behavior (`0..100`) and in-between values.
- Preset state is derived from current slider position and toggles between the two preset endpoints.
- Existing slider layout remains half-width and right-anchored.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Users can now freely scrub with the slider and also jump instantly between low/high preset values via the toggle button.
- Slider remains half-width and anchored right as requested.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [040] - 2026-03-03 20:27 - `NI - Phase 3 - Baseplate And Node Surface UI - Half-Width Scrub Slider`
<!-- ============================================================ -->
HUMAN SUMMARY: `Replaced binary scrub mode (low/high) with a continuous numeric scrub setting (0..100) in NodeView/PortView. Updated Baseplate scrub control UI.`

#### Scope / Constraints Honored
- UI-only changes in canvas/theme layers.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Replaced binary scrub mode (`low`/`high`) with a continuous numeric scrub setting (`0..100`) in `NodeView`/`PortView`.
- Updated Baseplate scrub control UI:
  - slider range now `0..100` with fractional movement (`step=0.1`),
  - removed low/high toggle button,
  - value display now shows percentage.
- Updated scrub drag behavior in `PortView` to interpolate threshold and sensitivity across the full slider range.
- Updated theme styles so the scrub slider is half-width and remains right-anchored in its row.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Scrub speed now glides smoothly from 0 to 100 and uses in-between values.
- Slider occupies half the scrub row width and stays aligned to the right.
- Scrub mode toggle button is removed in favor of continuous slider control.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [039] - 2026-03-03 20:25 - `NI - Phase 3 - Baseplate And Node Surface UI - Drivers Label Below Scrub Controls`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated Baseplate sketch header layout styles to stack content vertically. Positioned scrub speed controls on the first row and the Drivers label on the second row.`

#### Scope / Constraints Honored
- UI-only layout adjustment.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph compile/evaluate/runtime behavior changes.

#### Summary of Implementation
- Updated Baseplate sketch header layout styles to stack content vertically.
- Positioned scrub speed controls on the first row and the `Drivers` label on the second row.
- Kept existing control behavior and interaction handling unchanged.

#### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- `Drivers` is no longer horizontally aligned with the speed controls; it now appears one row lower.
- Scrub controls remain right-aligned and functionally unchanged.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [038] - 2026-03-03 20:24 - `NI - Phase 3 - Baseplate And Node Surface UI - Title Click Forces Collapsed Mode`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a dedicated onBaseplateTitleClick callback from SpaghettiCanvas to NodeView. In NodeView, made the title text interactive only for Baseplate nodes.`

#### Scope / Constraints Honored
- Canvas/UI-only change.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph compile/evaluate semantic changes.

#### Summary of Implementation
- Added a dedicated `onBaseplateTitleClick` callback from `SpaghettiCanvas` to `NodeView`.
- In `NodeView`, made the title text interactive only for Baseplate nodes:
  - stops pointer-down propagation to avoid node drag initiation from title clicks,
  - invokes the callback on click.
- In `SpaghettiCanvas`, callback sets row mode directly to `collapsed`.

#### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Clicking the `Baseplate` text in the node header now forces canvas row mode to `collapsed`.
- Other node title clicks are unchanged.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [037] - 2026-03-03 22:38 - `PT - Phase 5 - Part Template Population - Driver VM And Template-Flag NodeView`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added explicit part-template metadata to node definitions. Added generic driver VM resolver (driverVm.ts) that maps node metadata + params to render rows without node-type branching in NodeView.`

#### Scope / Constraints Honored
- UI-only refactor in canvas/registry/theme layers.
- No edits under `src/app/spaghetti/compiler/**`, `src/app/spaghetti/integration/**`, or `src/worker/**`.
- No protocol/scheduler changes.
- Deterministic ordering preserved via metadata order and stable endpoint keys.

#### Summary of Implementation
- Added explicit part-template metadata to node definitions:
  - `template?: 'part'`
  - `inputDrivers` and `outputDrivers` specs
  - feature-param driver (`firstExtrudeDepth`) and reserved output (`mesh`, `pending`) support.
- Added generic driver VM resolver (`driverVm.ts`) that maps node metadata + params to render rows without node-type branching in `NodeView`.
- Refactored `NodeView` to a template-driven renderer:
  - chooses part-template path only via `template === 'part'`,
  - renders canonical section order,
  - keeps Output Drivers pinned before everything-only sections,
  - renders Input Drivers rows even in collapsed mode,
  - renders reserved mesh row as disabled (dot visible, non-wireable, no endpoint registration).
- Updated `SpaghettiCanvas` to:
  - precompute and pass compact `driverVm`,
  - handle driver numeric edits generically (`nodeParam` + `featureParam:firstExtrudeDepth`),
  - keep `otherOutputs` deterministic as all outputs minus output-driver endpoints.
- Updated `FeatureStackView` with `mode: 'summary' | 'full'` and wired summary/full behavior by row mode.
- Added disabled-port interaction guard support for reserved rows using `data-sp-disabled-port="1"`.

#### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Part-node layout is now metadata/template driven rather than node-type branching in `NodeView`.
- Collapsed mode keeps Input Driver and Output Driver endpoint anchors visible; hidden internals do not register anchors.
- Essentials mode shows only drivers + feature stack summary (legacy/debug sections hidden).
- Everything mode shows drivers + full feature stack, then other outputs and legacy/debug sections.
- Reserved Mesh Output row is visibly disabled, always shows a dot, and is non-interactive for wiring.

#### Verification Steps
- `rg -n "Baseplate|ToeHook|HeelKick|Part/Baseplate|Part/ToeHook|Part/HeelKick" src/app/spaghetti/canvas/NodeView.tsx` (no matches)
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [036] - 2026-03-03 20:20 - `NI - Phase 3 - Baseplate And Node Surface UI - Input Click Promotes To Essentials`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated handleNodePointerDown in SpaghettiCanvas to resolve the clicked node before drag start. In collapsed row mode, clicking an input/source-style node now schedules setRowViewMode('essentials').`

#### Scope / Constraints Honored
- Canvas/UI-only change in allowed layer.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

#### Summary of Implementation
- Updated `handleNodePointerDown` in `SpaghettiCanvas` to resolve the clicked node before drag start.
- In `collapsed` row mode, clicking an input/source-style node now schedules `setRowViewMode('essentials')`.
- Input/source-style node detection is based on node definition shape: zero inputs and at least one output.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Clicking an input/source node while canvas row mode is `collapsed` now opens row mode to `essentials`.
- Existing node selection and drag initiation behavior for non-interactive node surface remains unchanged.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [035] - 2026-03-03 20:08 - `NI - Phase 3 - Baseplate And Node Surface UI - Chevron Interaction Guard`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added reusable interactive-target predicate in canvas. Updated handleNodePointerDown in SpaghettiCanvas.`

#### Scope / Constraints Honored
- Canvas/UI-only changes.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No row-mode or composite-evaluation semantic changes.

#### Summary of Implementation
- Added reusable interactive-target predicate in canvas:
  - `isSpaghettiInteractiveTarget(target: EventTarget | null)`.
  - Matches `data-sp-interactive="1"` first, then form-control and existing Spaghetti interactive selectors.
- Updated `handleNodePointerDown` in `SpaghettiCanvas`:
  - replaced inline interactive selector logic with predicate call,
  - removed early interactive-branch `stopPropagation`,
  - retained existing drag-init path behavior for non-interactive node surface.
- Marked interactive controls with `data-sp-interactive="1"`:
  - composite chevron button,
  - value bar container/track,
  - range input,
  - context-menu root container.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- When Baseplate node is selected, clicking `Anchor Point 1` (and other composite) chevron now expands/collapses immediately without requiring deselection.
- Node drag still starts from non-interactive node areas.
- Port wire drag, value scrubbing, and context menu interactions remain available through interactive elements.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [034] - 2026-03-03 18:09 - `NI - Phase 3 - Baseplate And Node Surface UI - Anchor Bar Forces Essentials Mode`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a canvas click-capture guard that detects clicks inside Baseplate sketch anchor-point value bars. Detection now resolves to the parent composite group root port label (Anchor Point 1..5) so leaf X/Y bar clicks are included.`

#### Scope / Constraints Honored
- UI-only patch in canvas layer.
- No changes under `features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- Row-mode transition remains render/UI-only behavior.

#### Summary of Implementation
- Added a canvas click-capture guard that detects clicks inside Baseplate sketch anchor-point value bars.
- Detection now resolves to the parent composite group root port label (`Anchor Point 1..5`) so leaf `X/Y` bar clicks are included.
- Mode transition is forced one-way to `essentials` via `requestAnimationFrame` to avoid ending in any other row mode during the same click cycle.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- Clicking any sketch anchor-point value bar now settles row mode to `essentials` deterministically, including clicks on expanded leaf bars.
- No compile/evaluate/runtime behavior changed.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [033] - 2026-03-03 18:03 - `NI - Phase 3 - Baseplate And Node Surface UI - Canvas Drag Rerender Guard`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added a stable connectionDragAnchor snapshot in SpaghettiCanvas derived only from anchor identity fields (direction, nodeId, portId, path). Switched hover validation and input/output drop-state callbacks to depend on the stable anchor snapshot instead of the full connectionDrag object.`

#### Scope / Constraints Honored
- UI repair only in allowed canvas layer.
- No changes in `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler edits.
- Row mode and composite expansion behavior remain render-only concerns.

#### Summary of Implementation
- Added a stable `connectionDragAnchor` snapshot in `SpaghettiCanvas` derived only from anchor identity fields (`direction`, `nodeId`, `portId`, `path`).
- Switched hover validation and input/output drop-state callbacks to depend on the stable anchor snapshot instead of the full `connectionDrag` object.
- This prevents per-pointer-move callback identity churn from propagating into memoized `NodeView` props during wire dragging.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

#### Behavior Changes (if any)
- While dragging a wire, node drop-state rendering now updates based on anchor/hover target changes rather than every pointer-position update, reducing avoidable node rerenders.
- No graph compile/evaluate semantics were changed; no row mode or composite state semantics were changed.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [032] - 2026-03-03 17:55 - `VM - Phase 3 - UI Stabilization - Composite Map State + Output Leaf Rendering`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added row-mode helper flags in rowViewMode limited to row concerns only. Added composite expansion key helper with exact parent-key format.`

#### Scope / Constraints Honored
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No CAD/feature execution logic moved into UI.
- No compiler behavior changes for graph semantics.
- Row modes remain render-only controls.

#### Summary of Implementation
- Added row-mode helper flags in `rowViewMode` limited to row concerns only:
  - `showEditors`
  - `showDebugInfo`
  - `renderLeafRows`
  - `forceLeafRows`
- Added composite expansion key helper with exact parent-key format:
  - `spComp|in|${nodeId}|${portId}`
  - `spComp|out|${nodeId}|${portId}`
- Moved composite expansion state ownership to `SpaghettiCanvas` using `Map<string, boolean>` and map-safe update helpers.
- Removed `evaluateSpaghettiGraph` usage from `NodeView`; node evaluation/derived display data are now prepared in `SpaghettiCanvas` and passed as node-scoped props.
- Kept `NodeView` render-focused and memoized while avoiding broad store subscriptions.
- Implemented composite output leaf rendering with deterministic field-tree traversal and mode-gated visibility:
  - `collapsed`: parent only
  - `essentials`: expansion-gated leaves
  - `everything`: forced leaf visibility without mutating stored expansion state
- Ensured output leaf anchors mount only when leaf rows are rendered; parent anchors remain mounted.
- Replaced per-node inline hover/drop wrappers from canvas render loop with stable shared callbacks.

#### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/canvas/compositeExpansion.ts`
- `src/app/spaghetti/canvas/compositeExpansion.test.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `docs/listofchanges.md`

#### Behavior Changes
- Row mode semantics are now explicit and deterministic for composite leaves across input/output columns.
- Composite expansion state is now parent-row scoped for both directions (`in` and `out`) and stored as canvas-local map state.
- `NodeView` no longer performs graph evaluation; UI rendering is separated from evaluation logic.
- Output composite ports now expose deterministic leaf rows/anchors when visible by mode.
- No compiler/worker/protocol behavior changes.

#### Perf Check
- Method: render-path stability audit focused on `NodeView` subtree invalidation sources.
- Verified changes:
  - node-scoped derived render payload is memoized in `SpaghettiCanvas` (`nodeRenderDataById`),
  - composite expansion mutation bumps revision for the affected node only,
  - shared hover/drop handlers are stable callbacks rather than per-node inline wrappers.
- Result: non-node canvas state updates no longer introduce avoidable node-subtree prop churn from those prior wrapper/data patterns.

#### CSS Impact
- Global theme selectors changed: none.
- Local class strategy retained; no `v15Theme.css` selector edits were required for this pass.

#### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [031] - 2026-03-03 17:04 - `DR - Phase 7 - Expose Fields And View Modes`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added fieldTree composite definitions for spline2 and profileLoop with deterministic leaf traversal. Added deterministic tests for new fieldTree leaf paths.`

#### Scope / Constraints
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No auto-build trigger behavior changes.
- Determinism preserved for composite field ordering and path-aware endpoint handling.
- Composite context menus remain node-scoped (no `createPortal(document.body)`).
- Legacy mixed whole+leaf graphs preserved with warning behavior; no edge deletion.
- Parent composite anchor remains active in collapsed row mode.
- Part panel ordering preserved when visible: `uiSections -> params -> Feature Stack`.

#### Summary
- Added `fieldTree` composite definitions for `spline2` and `profileLoop` with deterministic leaf traversal.
- Added deterministic tests for new `fieldTree` leaf paths.
- Extended `validateGraph` tests with test-local `profileLoop` fixture node defs (no runtime node-type additions).
- Added expanded-canvas row view modes: `collapsed`, `essentials` (default), `everything`.
- Wrapped `NodeView` in `React.memo` and passed `rowViewMode` as a stable union prop from `SpaghettiCanvas`.
- Enforced composite expansion state key scope to parent row only: `spComp|in|${nodeId}|${portId}`.
- Applied mode filters:
  - `collapsed`: parent rows/anchors visible, leaf rows hidden.
  - `essentials`: labels/types/editors/composite expansion visible; debug/info hidden.
  - `everything`: full debug/info visibility and full field disclosure rendering.
- Generalized composite handling beyond vec2 while preserving existing driven-authority behavior.
- Normalized baseplate spline output display labels to:
  - `Base Plate Spline (Inner)`
  - `Base Plate Spline (Outer)`
- Added minimal `spComp_` and `spView_` CSS hooks for mode/control styling.

#### Files Changed
- `src/app/spaghetti/types/fieldTree.ts`
- `src/app/spaghetti/types/fieldTree.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes
- Composite types `spline2` and `profileLoop` now expose deterministic leaf paths in app-layer field tree introspection.
- Row mode now controls node-port disclosure without mutating graph edges or compile/evaluate semantics.
- In collapsed row mode, parent composite anchors remain wireable while leaf anchors are hidden.
- Essentials mode now suppresses debug/info UI while preserving core port labels, type tags, editors, and composite expansion interactions.
- Everything mode shows debug/info panels and full recursive composite leaf rendering.
- Baseplate spline output labels are standardized for UI display without changing port IDs/types.

#### Verification
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [030] - 2026-03-03 16:05 - `FS - Phase 11 - Feature Stack v1 Debug Preview - App-Layer IR-Driven UI`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added deterministic Feature Stack Debug Preview driven by compile-path IR (no UI-side compileFeatureStack calls). Extracted shared compile helper in compileGraph so payload emission and UI cache use the same part IR derivation path.`

#### Scope / Constraints
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No auto-build trigger behavior added.
- Deterministic ordering/labels/rendering enforced for preview and diagnostics.
- Feature Stack panel placement updated to locked order: `uiSections -> params -> Feature Stack`.

#### Summary
- Added deterministic Feature Stack Debug Preview driven by compile-path IR (no UI-side `compileFeatureStack` calls).
- Extracted shared compile helper in `compileGraph` so payload emission and UI cache use the same part IR derivation path.
- Added store-level cache and selector for per-part Feature Stack IR mapped from nodeId.
- Added sketch profile SVG previews with deterministic fit mapping, closed-loop visual enforcement, stable labels, and stable numeric formatting.
- Added extrude preview summary and profile highlight based strictly on `profileRef.profileId`.
- Applied deterministic diagnostics sort/key policy and per-level badge counts.
- Added namespaced `fsPrev_*` styles and pure-function tests for preview determinism.

#### Files Changed
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/ui/features/profilePreview.tsx`
- `src/app/spaghetti/ui/features/profilePreview.test.ts`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

#### Behavior Changes
- Feature previews now consume compile-path part IR via store cache (`getPartFeatureStackIrForNode`) instead of recompiling in UI.
- Sketch preview profile ordering is now deterministic: area descending, then `profileId` ascending.
- Sketch/extrude preview labels now use `A..Z`, then `Profile <n>` fallback.
- Extrude preview highlight now keys only on `profileRef.profileId`.
- Diagnostics display now applies stable ordering (`error`, `warning`, `info`, then message, then featureId) and deterministic keys.
- Part node panel order is now `uiSections -> params -> Feature Stack`.

#### Verification
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
### [029] - 2026-03-03 15:37 - `FS - Phase 10 - Feature Stack v1 Worker Pipeline - Option-B Runtime Execution`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added app compile emission for Option-B sketch payload. Added worker feature stack runtime that.`

#### Scope / Constraints
- Implemented worker + CAD runtime execution for Feature Stack v1 with deterministic in-memory mesh-pack adapter.
- No scheduler behavior changes.
- No shared protocol contract changes.
- No auto-build behavior changes.
- Legacy build result envelope remains `PartArtifact[]`.
- Worker payload handling remains branch-specific flat profile patch (`payload.sp_featureStackIR` namespace).

#### Summary
- Added app compile emission for Option-B sketch payload:
  - `IRSketch.profilesResolved: [{ profileId, area, vertices[] }]`
  - deterministic ordered loop vertices with CCW normalization
  - runtime closes loops when needed
- Added worker feature stack runtime that:
  - executes parts in sorted key order
  - executes features in IR order
  - treats app-emitted `profileId` as authoritative
  - does not re-derive profiles from lines
  - extrudes by `profileRef.profileId` with `bodyId = ir.bodyId ?? ir.featureId`
  - applies first-wins policy on duplicate `bodyId`
  - performs deterministic mesh-pack merge (not CAD boolean fuse)
- Added bounded deterministic diagnostics:
  - dedup key: `${partKey}|${featureId}|${reason}`
  - single flush per build via worker build orchestrator
- Integrated runtime into active worker build path through a new thin `buildModel` coordinator while preserving legacy artifacts output.

#### Files Changed
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/worker/cad/cadTypes.ts`
- `src/worker/cad/cadKernelAdapter.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/products/foothook/buildFoothook.ts`
- `docs/listofchanges.md`

#### Behavior Changes
- App compile IR now includes `profilesResolved` loop geometry for sketch ops (Option-B lock).
- Worker Feature Stack execution is active when `sp_featureStackIR` is present in current payload patch namespace.
- Worker now emits at most one aggregated warning log per build for unique runtime warnings.
- Runtime merge semantics are deterministic mesh concatenation in stable bodyId order; no CAD boolean claims.

#### Verification
- `npm.cmd --prefix parahook run test`
- `npm.cmd --prefix parahook run build`
- Vite large-chunk warning remains unchanged (non-regression).

<!-- ============================================================ -->
### [028] - 2026-03-03 - `FS - Phase 9 - Feature Stack v1 App-Layer Alignment`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added canonical profile derivation exports. Kept compatibility alias.`

#### Scope / Constraints Honored
- App-layer only changes.
- No worker/protocol/scheduler contract changes.
- No auto-build behavior changes.
- `buildRequestSchema.profile` remains `z.record(z.string(), z.unknown())`.
- Existing composite/path/wiring behavior preserved.

#### Feature API Alignment
- Added canonical profile derivation exports:
  - `hashFnv1a32(str)`
  - `profileIdFromSignature(sig)`
  - `deriveProfiles(entities)`
- Kept compatibility alias:
  - `deriveProfilesFromLines = deriveProfiles`
- Added canonical auto-link export:
  - `pickDefaultProfileRef(stack, insertIndex)`
- Kept compatibility alias:
  - `findDefaultExtrudeProfileRef = pickDefaultProfileRef`
- Aligned diagnostics type to canonical shape:
  - `Diagnostic = { featureId, level, message }`
- Kept compatibility type alias:
  - `FeatureDiagnostic = Diagnostic`

#### Determinism and Derivation Contract
- Updated profile derivation to locked deterministic rules:
  - point keys use exact `${String(x)}|${String(y)}`
  - exact literal endpoints (no tolerance rounding path)
  - deterministic adjacency and traversal
  - canonical signature normalization (rotation + direction)
  - stable FNV-1a 32-bit base36 profile IDs
  - zero-area loop rejection
  - stable output sorting: area desc, signature asc, profileId asc

#### Store / UI Alignment
- Store now uses canonical helpers:
  - `deriveProfiles(...)`
  - `pickDefaultProfileRef(...)`
- Added/used part stack helpers:
  - `getPartFeatureStack(node)`
  - `setPartFeatureStack(node, stack)`
- Sketch profile outputs are recomputed immediately after line edits.
- Feature stack UI diagnostics no longer rely on `diagnostic.code`.
- Diagnostics keys are deterministic:
  - `${featureId}|${level}|${message}|${index}`
- Extrude collapsed summary now matches spec format:
  - `Profile: <SketchShort>/<ProfileLabel>, Depth: <value>`
- Profile labels use `A..Z` then `Profile <n>` fallback.

#### Compile / Payload Alignment
- `sp_featureStackIR` compile emission aligned to non-empty feature stack presence.
- Emitted IR payload remains:
  - `{ schemaVersion: 1, parts: Record<PartKey, IR[]> }`
- Existing part-key mapping retained (`baseplate`, `toeHook#1`, `heelKick#1`) with deterministic behavior.
- Patch/change detection path continues using stable hashing and includes `sp_featureStackIR`.

#### Files Changed
- `src/app/spaghetti/features/profileDerivation.ts`
- `src/app/spaghetti/features/autoLink.ts`
- `src/app/spaghetti/features/diagnostics.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/features/profileDerivation.test.ts`
- `src/app/spaghetti/features/autoLink.test.ts`

#### Verification
- `npm.cmd run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

#### Interaction Boundary Guard Fix (2026-03-04)
- Fix: prevent node drag/select from capturing UI control pointerdown; audit interactive markers.
- Added shared interaction helper `src/app/spaghetti/spInteractive.ts`:
  - `isInteractiveTarget(target)` selector guard
  - `SP_INTERACTIVE_PROPS` (`data-sp-interactive` + pointerdown stopPropagation)
- Updated canvas drag/select boundary handling:
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` now uses `isInteractiveTarget` in node pointerdown handling
  - stage deselect pointerdown now ignores interactive targets
- Audited/updated interactive control guards in:
  - `src/app/spaghetti/canvas/PortView.tsx`
  - `src/app/spaghetti/canvas/fields/NumberField.tsx`
  - `src/app/spaghetti/canvas/fields/Vec2Field.tsx`
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
  - `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - `src/app/spaghetti/canvas/NodeView.tsx`

<!-- ============================================================ -->
### [027] - 2026-03-03 - `SP - Phase 4 - Floating Window Follow-up - Default Geometry + Drag`
<!-- ============================================================ -->
HUMAN SUMMARY: `Updated default Spaghetti floating window open anchor to start around 30% down from viewport top. Re-enabled normal dragging immediately on open (removed resize-first drag gating).`

#### Floating Window Behavior
- Updated default Spaghetti floating window open anchor to start around 30% down from viewport top.
- Re-enabled normal dragging immediately on open (removed resize-first drag gating).
- First drag now marks the floating window as user-positioned so it behaves like a normal float window.
- Updated default open width to span from the left side to the left side of the gizmo/right overlay area.
- Updated default open height to span from the 30% top anchor down to the viewport bottom (subject to existing clamp/padding).

#### Files Changed
- `src/app/AppShell.tsx`

<!-- ============================================================ -->
### [026] - 2026-03-03 - `GE - Phase 7 - Early Modern Baseline - Compiled Master Entry`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added Vitest setup and tests for field tree, validator path rules, and evaluator precedence. Added npm run test script and vitest dev dependency.`

#### Scope / Locked Invariants
- App-layer only changes in this phase; no worker/protocol/scheduler contract changes.
- Compile/build remains explicit; canvas interactions do not auto-trigger build.
- Determinism preserved for path-aware logic and composite handling (edge traversal sorted by `edgeId` where required).
- Composite context menus remain node-scoped (no `createPortal(document.body)`).
- Parent composite anchor remains active while collapsed.
- Legacy mixed graphs (whole + leaf edges) are preserved; UI warns but does not delete edges.

#### Canvas and Node Editor UX
- Added right-click canvas node-add menu with search, placing nodes at cursor.
- Added typed color coding for ports/anchors so colors match port kinds.
- Updated anchor measurement to use actual small port-circle elements.
- Fixed floating editor/canvas anchoring so node editor fills/anchors correctly in floating window.
- Added collapsible `Preview Mode` and `Parts List` sections.
- Updated node layout to top-left inputs and bottom-right outputs.
- Baseplate node now presents `Drivers` and `Sketch Inputs` sections with grouped labels.

#### Wire Routing and Editing
- Added wire curviness slider (`0` linear, `25` baseline, `100` highly curved).
- Added reroute-point editing:
  - double-click wire to add point
  - drag point to reshape
  - double-click point to remove
  - supports multiple points per wire
- Enforced node-end tangency:
  - outputs depart right-tangent
  - inputs arrive left-tangent
- Added tangent controls for selected waypoints:
  - `Flip Tangent Side 1`
  - `Flip Tangent Side 2`
- Reworked waypoint segment routing to keep tangency through reroute points.

#### Numeric Controls and Baseplate Sketch UX
- Moved Baseplate `width`/`length` to inline port controls.
- Added matching inline template for `Primitive/Number`.
- Unified value-bar control includes:
  - blue fill by min/max range
  - label + value in one row
  - arrow step nudging
  - horizontal drag-scrub
- Added Baseplate vec2 sketch inputs `anchorPoint1..anchorPoint5` under `Sketch Inputs`.
- Each vec2 sketch input uses 50/50 `X`/`Y` inline layout.
- Width/Length driver updates resync sketch points to canonical rectangle.
- Added Baseplate scrub-speed toggle (`low` blue / `high` green) and increased `high` sensitivity.

#### Composite Field Tree and Path Endpoint System
- Added composite field introspection:
  - `getFieldTree`
  - `getFieldNodeAtPath`
  - `isCompositeFieldNode`
  - `listLeafFieldPaths`
  - vec2 mapping for `vec2:mm` and `vec2:unitless` -> `{ x, y }`
- Upgraded endpoints to optional path:
  - `EdgeEndpoint = { nodeId, portId, path?: string[] }`
  - schema keeps no-path compatibility and validates non-empty path segments when present
- Store normalization updates:
  - empty path -> `undefined`
  - legacy synthetic migrations:
    - `anchorPointNX` -> `anchorPointN` + `path: ['x']`
    - `anchorPointNY` -> `anchorPointN` + `path: ['y']`
  - connection drag now carries `fromPath`
- Canvas anchor keys and wire rendering are path-aware:
  - `buildPortAnchorKey` includes encoded path token
  - `parsePortAnchorKey` added
  - wire lookup/render includes endpoint paths
- Connection flow (`SpaghettiCanvas`) is path-aware:
  - hover compatibility checks full endpoint `(nodeId, portId, path)`
  - duplicate detection checks full endpoint
  - rewire uses exact input endpoint (including leaf path)
  - cycle check remains node-level via `validateGraph`
  - details lines display endpoint paths
- Composite renderer changes:
  - NodeView owns transient expansion map
  - PortView local expansion removed
  - composite leaf rows generated from field tree paths
  - child rows register path endpoints/anchors
  - Baseplate vec2 uses canonical `x`/`y` child paths (no synthetic scalar ports)
- Validator updates:
  - base port/path existence checks
  - path endpoints must resolve to leaf
  - leaf type exact-match
  - duplicate leaf target rejection
  - max connections enforced per endpoint key (`node + port + path`)
  - cycle detection unchanged
- Evaluator updates (deterministic):
  - composite input priority:
    1) leaf-path wires
    2) whole-port wire fallback
    3) literal fallback
    4) type-default fallback
  - respects `from.path`
  - edge ordering sorted by `edgeId`
  - unresolved optional composites inject defaults per locked decisions
- Compile helper updates:
  - whole-port compile lookup ignores target leaf edges
  - source extraction respects optional `from.path`

#### Composite Vec2 Parent UX (Break/Group + Info Menu)
- Collapsed composite vec2 parent rows render inline `X`/`Y` value bars (blue tone, 50/50 split).
- Parent anchor remains active while collapsed.
- Inline editors continue using existing literal param backing values (no new literal store).
- Whole-port driven authority mode:
  - NodeView computes local driven maps from store edges (sorted by `edgeId`)
  - whole-driven: collapsed/expanded leaf editors become read-only
  - whole-driven: leaf drop/rewire blocked with status `Driven by parent wire`
  - leaf-driven (x/y only): per-axis disable on collapsed row
  - whole display prefers evaluated source output; falls back to literal when unresolved
  - legacy whole+leaf preserved with warning badge `Leaf override exists`
- Parent-row context menu (node-scoped absolute menu):
  - `Break composite` / `Group pins`
  - `Show info` / `Hide info`
  - closes on outside click and `Escape`
  - right-click prevents default/propagation so canvas add-node menu is not triggered
- Menu positioning fix:
  - opens under cursor correctly under canvas transforms/zoom
  - coordinates account for node scale
- Removed top-right composite action buttons in favor of context menu actions.
- Added CSS support for inline XY, driven/disabled states, warning badge, and menu visuals.

#### Testing and Tooling
- Added Vitest setup and tests for field tree, validator path rules, and evaluator precedence.
- Added `npm run test` script and `vitest` dev dependency.

#### Files Changed (Grouped by Area)
- Canvas/UI core:
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - `src/app/spaghetti/canvas/WireLayer.tsx`
  - `src/app/spaghetti/canvas/spaghettiWires.ts`
  - `src/app/spaghetti/canvas/types.ts`
- Node/port/composite UI:
  - `src/app/spaghetti/canvas/NodeView.tsx`
  - `src/app/spaghetti/canvas/PortView.tsx`
  - `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
  - `src/app/spaghetti/ui/CollapsedEditor.tsx`
  - `src/app/spaghetti/ui/ExpandedEditor.tsx`
  - `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- Schema/store/types:
  - `src/app/spaghetti/schema/spaghettiTypes.ts`
  - `src/app/spaghetti/schema/spaghettiSchema.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/spaghetti/types/fieldTree.ts`
- Compiler/runtime behavior:
  - `src/app/spaghetti/compiler/validateGraph.ts`
  - `src/app/spaghetti/compiler/evaluateGraph.ts`
  - `src/app/spaghetti/compiler/compileGraph.ts`
- Registry/theme/tooling/tests:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/theme/v15Theme.css`
  - `package.json`
  - `src/app/spaghetti/types/fieldTree.test.ts`
  - `src/app/spaghetti/compiler/validateGraph.test.ts`
  - `src/app/spaghetti/compiler/evaluateGraph.test.ts`

#### Verification
- `npm.cmd run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)


<!-- ============================================================ -->
### Reconstructed from here down
<!-- ============================================================ -->
HUMAN SUMMARY: `This marks the point where the changelog shifts from shipped modern entries into reconstructed earlier history.`


<!-- ============================================================ -->
### Reconstructed `Gap`
HUMAN SUMMARY: `This marks an inferred bridge entry reconstructed from incomplete evidence rather than a fully evidenced historical log.`
### [025] - [Gap] - `First Landed Graph / Feature Stack / Expose Fields Implementation Wave`
<!-- ============================================================ -->
HUMAN SUMMARY: `Likely captured the first landed implementation wave that turned earlier graph, Feature Stack, and expose-fields planning into real shipped work. Likely bridged the restored conversation-era systems into the first visible shipped changelog band.`
#### Scope / Constraints Honored
- Recovered bridge entry with incomplete evidence.
- Preserved the distinction between recovered completed entries and inferred bridge entries.

#### Summary of Implementation
- Likely captured the first landed implementation wave that turned earlier graph, Feature Stack, and expose-fields planning into real shipped work.
- Likely bridged the restored conversation-era systems into the first visible shipped changelog band.
- Likely established enough product/runtime continuity for the later shipped entries to appear as already-standing work.

#### Files Changed
- exact file set unknown
- likely touched early Spaghetti, Feature Stack, driver, and build-integration files

#### Behavior Changes (if any)
- Likely marked the real transition from restored planning/history into the first shipped modern graph wave.

#### Verification Steps
- Review compiled gap row `[025]`.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
### Reconstructed `Gap`
HUMAN SUMMARY: `This marks an inferred bridge entry reconstructed from incomplete evidence rather than a fully evidenced historical log.`
### [024] - [Gap] - `Restored History To First Shipped Changelog Handoff`
<!-- ============================================================ -->
HUMAN SUMMARY: `Likely captured the handoff from the restored conversation-derived restart work into the first shipped changelog era. Likely stabilized enough app/store/panel/runtime behavior for the shipped changelog band to begin.`
#### Scope / Constraints Honored
- Recovered bridge entry with incomplete evidence.
- Preserved the distinction between recovered completed entries and inferred bridge entries.

#### Summary of Implementation
- Likely captured the handoff from the restored conversation-derived restart work into the first shipped changelog era.
- Likely stabilized enough app/store/panel/runtime behavior for the shipped changelog band to begin.

#### Files Changed
- exact file set unknown
- likely touched the app shell, store wiring, and early modern graph/runtime surfaces

#### Behavior Changes (if any)
- Likely marks a continuity handoff more than one single isolated feature.

#### Verification Steps
- Review compiled gap row `[024]`.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [023] - [Conv 9] - `SP - Phase 3 - Spaghetti Editor S3 - Compile To Build Integration`
<!-- ============================================================ -->
HUMAN SUMMARY: `Connected Spaghetti compile output into the live build path. Turned Spaghetti from an isolated graph/editor experiment into a real authoring input mode.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and later canonical phase reconstruction.
- Preserved the existing warm-worker runtime direction.
- Preserved the existing app -> worker -> viewer separation.

#### Summary of Implementation
- Connected Spaghetti compile output into the live build path.
- Turned Spaghetti from an isolated graph/editor experiment into a real authoring input mode.
- Preserved the current worker path while feeding it graph-produced build intent.

#### Files Changed
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/buildDispatcher.ts`
- `src/worker/buildModel.ts`
- `src/shared/buildTypes.ts`

#### Behavior Changes (if any)
- The graph system could now drive the live build path instead of staying only a planning/editor surface.

#### Verification Steps
- Review compiled row `[023]` and the canonical phase log for `SP - Phase 3`.
- Confirm the draft stays consistent with the later shipped changelog wording around early Spaghetti integration.


<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [022] - [Conv 9] - `GE - Phase 6 - Worker Affected-Part Routing And Cache Preference`
<!-- ============================================================ -->
HUMAN SUMMARY: `Defined worker-side affected-part routing as real build input. Added cache-preference thinking around unaffected parts.`
#### Scope / Constraints Honored
- Recovered history entry based on conversation-derived task logs.
- Preserved the one warm worker rule.
- Preserved the current deterministic stub-output baseline while routing work matured.

#### Summary of Implementation
- Defined worker-side affected-part routing as real build input.
- Added cache-preference thinking around unaffected parts.
- Strengthened the engine toward selective recompute without restarting the architecture.

#### Files Changed
- `src/app/buildDispatcher.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/signatures.ts`

#### Behavior Changes (if any)
- The worker could reason more directly about which parts were affected by param changes.

#### Verification Steps
- Review restored `GE - Phase 6` detail in the phase log.
- Confirm the drafted summary matches the compiled title and recovered routing/signature work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [021] - [Conv 9] - `DR - Phase 3 - Param Ownership / Routing v20`
<!-- ============================================================ -->
HUMAN SUMMARY: `Applied modern param ownership and changed-id routing to the /20/ direction. Strengthened the bridge between param namespaces, affected-part routing, and future selective recompute.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored `/20/` restart planning.
- Preserved the new canonical param-ownership direction.
- Preserved the engine-first roadmap ordering.

#### Summary of Implementation
- Applied modern param ownership and changed-id routing to the `/20/` direction.
- Strengthened the bridge between param namespaces, affected-part routing, and future selective recompute.
- Reduced flat global rebuild thinking in favor of controlled routing.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`

#### Behavior Changes (if any)
- Param changes became more explicitly tied to part-owned routing behavior.

#### Verification Steps
- Review the compiled row `[021]` and the phase log entry for `DR - Phase 3`.
- Confirm the draft stays aligned with the earlier `PT` param-ownership phases.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [020] - [Conv 9] - `SP - Phase 2 - Spaghetti Editor S2 - Compute / Evaluate / Compile Skeleton`
<!-- ============================================================ -->
HUMAN SUMMARY: `Added the first compute/evaluate skeleton for the graph system. Introduced compile-shape thinking into the Spaghetti layer.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored Spaghetti phase mapping.
- Preserved the existing app/worker/viewer split.
- Kept Spaghetti as a graph-authoring layer rather than a second runtime.

#### Summary of Implementation
- Added the first compute/evaluate skeleton for the graph system.
- Introduced compile-shape thinking into the Spaghetti layer.
- Prepared the graph to produce deterministic build-facing data.

#### Files Changed
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`

#### Behavior Changes (if any)
- Spaghetti became capable of producing meaningful compile-oriented graph output.

#### Verification Steps
- Review compiled row `[020]` and the phase log entry for `SP - Phase 2`.
- Confirm the draft fits between `SP - Phase 1` store/schema work and `SP - Phase 3` compile-to-build integration.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [019] - [Conv 9] - `SP - Phase 1 - Spaghetti Editor S1 - Schema / Validation / Store`
<!-- ============================================================ -->
HUMAN SUMMARY: `Landed the first serious Spaghetti graph schema and registry foundation. Added validation and cycle-awareness around the graph model.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and conversation-9 reconstruction.
- Preserved the main app/worker/viewer separation.
- Added graph ownership without changing product truth outside the new graph system.

#### Summary of Implementation
- Landed the first serious Spaghetti graph schema and registry foundation.
- Added validation and cycle-awareness around the graph model.
- Gave Spaghetti its own store foundation so it became a real subsystem.

#### Files Changed
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`

#### Behavior Changes (if any)
- Spaghetti became a concrete graph subsystem with real state ownership.

#### Verification Steps
- Review compiled row `[019]` and the phase log entry for `SP - Phase 1`.
- Confirm the draft matches the earliest reconstructed schema/store/validation milestone.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [018] - [Conv 9] - `VM - Phase 2 - Instance-Aware Store And ViewModel Baseline`
<!-- ============================================================ -->
HUMAN SUMMARY: `Made instance-aware state and view-model shaping part of the baseline. Reduced single-instance assumptions across store and UI logic.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored task mapping.
- Preserved the selector-first view-model discipline established earlier.
- Preserved the app/worker separation.

#### Summary of Implementation
- Made instance-aware state and view-model shaping part of the baseline.
- Reduced single-instance assumptions across store and UI logic.
- Prepared the app for more than one owned part/view path.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/store/selectors.ts`
- `src/shared/partsTypes.ts`
- `src/app/panels/PartsListPanel.tsx`

#### Behavior Changes (if any)
- The app could reason more cleanly about multiple part/view identities instead of a single monolithic output path.

#### Verification Steps
- Review compiled row `[018]` and the phase log entry for `VM - Phase 2`.
- Confirm the draft stays consistent with later multi-part and parts-list work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [017] - [Conv 9] - `AS - Phase 4 - Canonical Part Identity And Assembled Direction`
<!-- ============================================================ -->
HUMAN SUMMARY: `Clarified part identity as a canonical concept instead of one loose preview blob. Strengthened the distinction between part outputs and the assembled output.`
#### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored phase summaries.
- Preserved the Parts List and artifact-driven product direction.
- Preserved the move away from scrubber/history UI.

#### Summary of Implementation
- Clarified part identity as a canonical concept instead of one loose preview blob.
- Strengthened the distinction between part outputs and the assembled output.
- Moved the product away from looser `final` wording and toward assembled identity.

#### Files Changed
- `src/shared/partsTypes.ts`
- `src/shared/buildTypes.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/panels/PartsListPanel.tsx`

#### Behavior Changes (if any)
- The output model became easier to reason about in terms of parts versus assembled results.

#### Verification Steps
- Review compiled row `[017]` and the phase log entry for `AS - Phase 4`.
- Confirm the draft fits after the early parts/artifact baseline gap.

<!-- ============================================================ -->
### Reconstructed `Gap`
HUMAN SUMMARY: `This marks an inferred bridge entry reconstructed from incomplete evidence rather than a fully evidenced historical log.`
### [016] - [Gap] - `AS - Phase 3 - First Parts / Artifact Baseline`
<!-- ============================================================ -->
HUMAN SUMMARY: `Likely defined the first stable part/artifact identity layer between the restart and later assembled-direction work. Likely turned the product from one preview mesh into named output parts.`
#### Scope / Constraints Honored
- Recovered gap note with incomplete evidence.
- Preserved the existing parts-list and artifact-driven product direction.

#### Summary of Implementation
- Likely defined the first stable part/artifact identity layer between the restart and later assembled-direction work.
- Likely turned the product from one preview mesh into named output parts.
- Likely gave later part-order and assembled work a concrete baseline to build on.

#### Files Changed
- exact file set unknown
- likely touched `src/shared/partsTypes.ts`
- likely touched `src/shared/buildTypes.ts`
- likely touched `src/worker/pipeline/artifactEmitter.ts`

#### Behavior Changes (if any)
- Likely gave the early restart a clearer part/artifact identity model.

#### Verification Steps
- Review compiled gap row `[016]` and the gap-phase note in the canonical phase log.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
### Reconstructed Gap
HUMAN SUMMARY: `This marks an inferred bridge entry reconstructed from incomplete evidence rather than a fully evidenced historical log.`
### [015] - [Gap] - `GE - Phase 5 - First Running Box Vertical Slice`
<!-- ============================================================ -->
HUMAN SUMMARY: `Likely added the first width / length / height controls. Likely proved the first real end-to-end box slice through app, worker, and viewer.`
#### Scope / Constraints Honored
- Recovered gap note with incomplete evidence.
- Preserved the clean app -> worker -> viewer architecture.
- Preserved the one warm worker rule.

#### Summary of Implementation
- Likely added the first `width / length / height` controls.
- Likely proved the first real end-to-end box slice through app, worker, and viewer.
- Likely hardened the first dispatcher/latest-only rebuild loop around a running vertical slice.

#### Files Changed
- exact file set unknown
- likely touched `src/app/buildDispatcher.ts`
- likely touched `src/app/store/useAppStore.ts`
- likely touched `src/worker/worker.ts`
- likely touched `src/viewer/Viewer.ts`

#### Behavior Changes (if any)
- Likely turned the clean restart from a structural skeleton into a live vertical slice.

#### Verification Steps
- Review compiled gap row `[015]` and the gap-phase note in the canonical phase log.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
### Reconstructed `Gap`
HUMAN SUMMARY: `This marks an inferred bridge entry reconstructed from incomplete evidence rather than a fully evidenced historical log.`
### [014] - [Gap] - `GE - Phase 4 - First Repo Setup Execution`
<!-- ============================================================ -->
HUMAN SUMMARY: `Likely ran the clean restart Codex setup prompt against the real /20/parahook repo. Likely created the actual folder structure and starter app/viewer/worker/shared files.`
#### Scope / Constraints Honored
- Recovered gap note with incomplete evidence.
- Preserved the clean restart architecture direction.
- Preserved the early `/20/` repo setup assumptions.

#### Summary of Implementation
- Likely ran the clean restart Codex setup prompt against the real `/20/parahook` repo.
- Likely created the actual folder structure and starter app/viewer/worker/shared files.
- Likely verified the first executable repo baseline before the box vertical slice.

#### Files Changed
- exact file set unknown
- likely touched the initial repo bootstrap files under `src/`
- likely touched `package.json`, `vite.config.ts`, and `tsconfig*.json`

#### Behavior Changes (if any)
- Likely marks the first real execution step of the `/20/` clean restart.

#### Verification Steps
- Review compiled gap row `[014]` and the gap-phase note in the canonical phase log.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [013] - [Conv 8] - `ADV - Phase 2 - Roadmap Ordering`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked routing and ownership work ahead of UI polish. Locked engine foundation ahead of richer parts-toolbar expansion.`
#### Scope / Constraints Honored
- Recovered history entry based on restored conversation evidence.
- Planning-heavy entry that shaped later implementation order.
- Preserved the clean restart architecture assumptions.

#### Summary of Implementation
- Locked routing and ownership work ahead of UI polish.
- Locked engine foundation ahead of richer parts-toolbar expansion.
- Delayed real toe replacement until the routing foundation was stable enough.
- Produced the first human-readable restart roadmap that connected the clean engine baseline to later real-toe work.

#### Files Changed
- `PLANS.md`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/shared/productSchema.ts`
- `src/shared/buildTypes.ts`

#### Behavior Changes (if any)
- No immediate product behavior change.
- Established the priority order that guided the next phases of the restart.

#### Verification Steps
- Review restored `ADV - Phase 2` in the history task log and phase log.
- Confirm the draft reflects roadmap sequencing rather than shipped UI behavior.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [012] - [Conv 8] - `ADV - Phase 1 - Future-Ready Systems`
<!-- ============================================================ -->
HUMAN SUMMARY: `Identified undo/redo as canonical-state history rather than mesh history. Identified shareable URLs/codes as canonical-state serialization features.`
#### Scope / Constraints Honored
- Recovered history entry based on restored conversation evidence.
- Planning-heavy entry that defined future-ready system direction.
- Preserved the canonical-state rule.

#### Summary of Implementation
- Identified undo/redo as canonical-state history rather than mesh history.
- Identified shareable URLs/codes as canonical-state serialization features.
- Kept delta-style performance as a future goal while using full snapshots plus caching as the safer baseline.
- Preserved these systems as future-ready architecture without forcing them into the first clean restart phase.

#### Files Changed
- `src/shared/productSchema.ts`
- `src/shared/buildTypes.ts`
- `src/shared/canonicalLayout.ts`
- `src/worker/pipeline/signatures.ts`

#### Behavior Changes (if any)
- No immediate product behavior change.
- Established the correct ownership model for future undo/share/performance systems.

#### Verification Steps
- Review restored `ADV - Phase 1` detail in the history task log and phase log.
- Confirm the draft reads as a future-system direction lock, not a shipped feature drop.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [011] - [Conv 8] - `EX - Phase 1 - Future Export Shape`
<!-- ============================================================ -->
HUMAN SUMMARY: `Kept export as a worker-side concern instead of a viewer or UI convenience. Based future export on deterministic assembled/canonical state.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved worker ownership of export.
- Preserved deterministic assembled/canonical state as the export source.

#### Summary of Implementation
- Kept export as a worker-side concern instead of a viewer or UI convenience.
- Based future export on deterministic assembled/canonical state.
- Preserved export as part of the engine pipeline direction.
- Avoided tying export behavior to ad hoc UI or camera/view state.

#### Files Changed
- `src/worker/pipeline/exportService.ts`
- `src/shared/buildTypes.ts`
- `src/shared/exportTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/io/download.ts`

#### Behavior Changes (if any)
- No broad export feature landed yet, but the ownership boundary was locked correctly.

#### Verification Steps
- Review restored `EX - Phase 1` detail in the history task log and phase log.
- Confirm the draft reflects export direction rather than a full export feature rollout.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [010] - [Conv 8] - `VR - Phase 1 - Viewer Ownership`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked viewer-only controls as rebuild-free concerns. Kept camera, materials, and visibility as presentation behavior rather than CAD behavior.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the rule that viewer-only controls remain rebuild-free.
- Preserved the app/worker/viewer boundary.

#### Summary of Implementation
- Locked viewer-only controls as rebuild-free concerns.
- Kept camera, materials, and visibility as presentation behavior rather than CAD behavior.
- Preserved a clean viewer boundary for future workbench systems.
- Kept the worker focused on geometry and export artifacts instead of presentation state.

#### Files Changed
- `src/viewer/Viewer.ts`
- `src/viewer/scene/SceneManager.ts`
- `src/app/viewerBridge.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/viewer/gizmo/`
- `src/viewer/controlViz/`

#### Behavior Changes (if any)
- Viewer controls and presentation ownership were kept out of the geometry execution path.

#### Verification Steps
- Review restored `VR - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft matches the rebuild-free viewer rule.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [009] - [Conv 8] - `VM - Phase 1 - Selector Discipline`
<!-- ============================================================ -->
HUMAN SUMMARY: `Treated selectors as architecture, not late optimization. Used selectors to keep high-frequency UI surfaces subscribed only to the slices they need.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved Zustand state ownership.
- Preserved the clean app/worker separation.

#### Summary of Implementation
- Treated selectors as architecture, not late optimization.
- Used selectors to keep high-frequency UI surfaces subscribed only to the slices they need.
- Established source-state versus read-model discipline early.
- Prevented whole-store subscriptions from becoming the default pattern for the restart UI.

#### Files Changed
- `src/app/store/selectors.ts`
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/panels/BuildStatusPanel.tsx`

#### Behavior Changes (if any)
- UI rerender boundaries became more explicit and scalable.

#### Verification Steps
- Review restored `VM - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft reflects selector discipline rather than a late cleanup pass.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [008] - [Conv 8] - `JK - Phase 1 - Mode Structure`
<!-- ============================================================ -->
HUMAN SUMMARY: `Kept profileEditor as the primary geometry-authoring mode. Defined Jake Mode as a simplified wrapper over the main system.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved Profile Editor as the main geometry truth.
- Avoided creating a separate Jake geometry truth.

#### Summary of Implementation
- Kept `profileEditor` as the primary geometry-authoring mode.
- Defined Jake Mode as a simplified wrapper over the main system.
- Reserved Jake as a real product layer instead of a vague later add-on.
- Kept Jake visible in the clean-slate repo structure so it would not become a bolted-on afterthought.

#### Files Changed
- `src/app/jakeMode/JakeControls.tsx`
- `src/app/jakeMode/jakeConstraints.ts`
- `src/app/jakeMode/jakeAdapter.ts`
- `src/app/profileEditor/ProfileControls.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/productSchema.ts`

#### Behavior Changes (if any)
- The mode model became clearer: advanced authoring in the main editor, simplified control in Jake.

#### Verification Steps
- Review restored `JK - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft stays aligned with the later Jake-mode vision.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [007] - [Conv 8] - `PT - Phase 2 - Param Ownership Direction`
<!-- ============================================================ -->
HUMAN SUMMARY: `Defined the early param namespace direction around bp_*, th1_*, and hk1_*. Extended the same ownership pattern to future part instances.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the move toward part-owned params.
- Preserved routing-first sequencing.

#### Summary of Implementation
- Defined the early param namespace direction around `bp_*`, `th1_*`, and `hk1_*`.
- Extended the same ownership pattern to future part instances.
- Framed param ownership as the base for scalable per-part recompute.
- Kept param identity tied to part-instance thinking instead of falling back to flat global buckets.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/shared/partRouting.ts`
- `src/shared/buildTypes.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/signatures.ts`

#### Behavior Changes (if any)
- Params became more explicitly tied to part ownership rather than one flat namespace.

#### Verification Steps
- Review restored `PT - Phase 2` in the history task log and the canonical phase log.
- Confirm the draft matches the later routing and signature work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [006] - [Conv 8] - `PT - Phase 1 - Independent Part Thinking`
<!-- ============================================================ -->
HUMAN SUMMARY: `Reframed the restarted app around independently buildable parts. Treated parts as focusable, visible, and eventually independently rebuildable.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the shift away from one opaque history stream.
- Preserved the move toward independently buildable parts.

#### Summary of Implementation
- Reframed the restarted app around independently buildable parts.
- Treated parts as focusable, visible, and eventually independently rebuildable.
- Prepared the product for multiple future part instances instead of one monolithic output.
- Tied part-list selection to part-focused controls so the UI could stay organized around real product pieces.

#### Files Changed
- `src/shared/partsTypes.ts`
- `src/shared/productSchema.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/store/useAppStore.ts`

#### Behavior Changes (if any)
- The product mental model shifted from one opaque result to multiple real parts.

#### Verification Steps
- Review restored `PT - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft stays aligned with the later parts-list and artifact phases.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [005] - [Conv 8] - `AS - Phase 2 - Deterministic Part Ordering`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked base parts first as the default visible ordering. Inserted future toe instances after the base parts in deterministic sequence.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the parts-list direction.
- Preserved stable deterministic ordering rules.

#### Summary of Implementation
- Locked base parts first as the default visible ordering.
- Inserted future toe instances after the base parts in deterministic sequence.
- Treated visible part order as a stable product rule rather than arbitrary UI sorting.
- Locked later parts to declared pipeline/build order instead of ad hoc UI order.

#### Files Changed
- `src/shared/partsTypes.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/panels/PartsListPanel.tsx`

#### Behavior Changes (if any)
- Part ordering became a deterministic product rule tied to the pipeline, not just display preference.

#### Verification Steps
- Review restored `AS - Phase 2` in the history task log and the canonical phase log.
- Confirm the draft stays aligned with later assembly and artifact identity work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [004] - [Conv 8] - `AS - Phase 1 - Parts List Replacement`
<!-- ============================================================ -->
HUMAN SUMMARY: `Removed the history scrubber direction from the restart baseline. Replaced it with a Parts List model.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the move away from history scrubber UI.
- Preserved artifact-driven inspection as the main direction.

#### Summary of Implementation
- Removed the history scrubber direction from the restart baseline.
- Replaced it with a Parts List model.
- Made part selection focus relevant controls instead of scrubbing through time.
- Treated future history support as optional later work layered on top of artifacts instead of the base UI.

#### Files Changed
- `src/app/panels/PartsListPanel.tsx`
- `src/app/AppShell.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/partsTypes.ts`
- `src/worker/pipeline/artifactEmitter.ts`

#### Behavior Changes (if any)
- The product moved from time-travel UI toward part-driven inspection.

#### Verification Steps
- Review restored `AS - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft stays consistent with the later deterministic ordering and assembled-direction work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [003] - [Conv 8] - `GE - Phase 3 - Engine Roadmap Foundation`
<!-- ============================================================ -->
HUMAN SUMMARY: `Made param ownership and routing the first real engine milestone after the clean restart. Defined deterministic per-part signatures as the basis for selective recompute and artifact stability.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the clean restart architecture.
- Preserved the routing-first direction for post-restart work.

#### Summary of Implementation
- Made param ownership and routing the first real engine milestone after the clean restart.
- Defined deterministic per-part signatures as the basis for selective recompute and artifact stability.
- Ordered the roadmap as routing first, selective recompute second, and real geometry later.
- Added changed-param thinking so the worker could eventually reason about affected parts without guessing from raw UI churn.

#### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/worker/pipeline/signatures.ts`

#### Behavior Changes (if any)
- The engine roadmap stopped being UI-first and became routing-first.

#### Verification Steps
- Review restored `GE - Phase 3` in the history task log and the canonical phase log.
- Confirm the draft fits between the clean restart and the later worker routing work.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [002] - [Conv 8] - `GE - Phase 2 - Runtime And Rebuild Rules`
<!-- ============================================================ -->
HUMAN SUMMARY: `Locked one warm worker as the restart invariant. Used latest-only scheduling so rapid control churn collapses into the newest valid build request.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the one warm worker rule.
- Preserved the clean app -> worker -> viewer separation.

#### Summary of Implementation
- Locked one warm worker as the restart invariant.
- Used latest-only scheduling so rapid control churn collapses into the newest valid build request.
- Dropped stale worker results and separated render-only changes from geometry-affecting changes.
- Kept worker communication on shared protocol/schema boundaries instead of app-to-runtime reach-in.

#### Files Changed
- `src/app/buildDispatcher.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/intentClassifier.ts`
- `src/app/protocol.ts`
- `src/worker/worker.ts`
- `src/worker/scheduler.ts`
- `src/worker/validation.ts`
- `src/shared/buildTypes.ts`
- `src/shared/productSchema.ts`

#### Behavior Changes (if any)
- The runtime gained clearer rebuild rules and a safer worker scheduling model.

#### Verification Steps
- Review restored `GE - Phase 2` in the history task log and the canonical phase log.
- Confirm the draft reflects the warm-worker, latest-only, stale-drop, and render-vs-geometry split.

<!-- ============================================================ -->
### Reconstructed
HUMAN SUMMARY: `This marks a reconstructed historical entry recovered from compiled logs and later canonical docs.`
### [001] - [Conv 8] - `GE - Phase 1 - Clean Restart Architecture`
<!-- ============================================================ -->
HUMAN SUMMARY: `Initialized the new /20/parahook stack with Vite, React, TypeScript, Three.js, Zustand, and Zod. Created the clean-slate source layout for app, viewer, worker, geometry, runtime, shared, and tests.`
#### Scope / Constraints Honored
- Recovered history entry based on restored restart conversation evidence.
- Preserved the clean app -> worker -> viewer architecture as the foundation.
- Preserved the rule that UI captures intent, worker executes CAD, and viewer renders results.

#### Summary of Implementation
- Initialized the new `/20/parahook` stack with Vite, React, TypeScript, Three.js, Zustand, and Zod.
- Created the clean-slate source layout for `app`, `viewer`, `worker`, `geometry`, `runtime`, `shared`, and `tests`.
- Built the first warm-worker and viewer skeletons and confirmed the clean restart compiled.
- Established the first hard import and ownership boundaries between app, viewer, worker, and geometry before real CAD work started.

#### Files Changed
- `src/index.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/selectors.ts`
- `src/app/buildDispatcher.ts`
- `src/app/protocol.ts`
- `src/app/profileEditor/ProfileControls.tsx`
- `src/app/jakeMode/JakeControls.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/panels/BuildStatusPanel.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/scene/SceneManager.ts`
- `src/viewer/renderers/MeshRenderer.ts`
- `src/worker/worker.ts`
- `src/worker/scheduler.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/exportService.ts`
- `src/shared/productSchema.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partsTypes.ts`
- `src/shared/constants.ts`

#### Behavior Changes (if any)
- Established the clean `/20/` restart architecture and baseline runtime bring-up.

#### Verification Steps
- Review restored `GE - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft reflects the original restart architecture, repo layout, worker skeleton, and viewer skeleton.


