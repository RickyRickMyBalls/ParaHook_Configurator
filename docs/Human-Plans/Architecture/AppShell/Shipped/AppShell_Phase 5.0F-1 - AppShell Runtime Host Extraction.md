# AppShell Phase 5.0F-1 - AppShell Runtime Host Extraction

## Doc Header

### Doc History
2. 2026-03-22 13:10: Marked this phase complete after shipping `RadioRuntimeHost`, moving the radio/sampler runtime cluster out of `AppShell`, adding focused host coverage, and promoting this phase record into `Shipped/`
1. 2026-03-22 12:40: Created this standalone future phase doc for `[5.0F-1]`, translating the AppShell runtime-host cleanup into an implementation-ready plan around a new mounted `RadioRuntimeHost` seam, the concrete `AppShell.tsx` refs/effects to move, and the verification needed to keep radio and sampler behavior stable

### Purpose

This doc defines the first implementation cut under the AppShell cleanup family.

Use it to answer:
- what `[5.0F-1]` should move out of `AppShell`
- what should stay in `AppShell`
- which files are the first safe landing zone
- how to keep the cut narrow enough to land before `[5.0F-2]`

### Why This Phase Exists

The live `AppShell.tsx` file currently mixes top-level composition with app-level audio runtime behavior.

The clearest overload cluster is the radio/sampler runtime seam:
- audio-engine creation and disposal
- SoundCloud bridge ownership
- burst handling
- seek and reload handling
- waveform-capability refresh
- transport polling
- sampler preview and loop scheduling

This phase exists to remove that cluster first because it is the least coupled to the later browser and spaghetti shell-controller cleanup.

### Scope

This phase covers:
- extracting the radio/sampler runtime effect cluster into one mounted host seam
- moving the hidden SoundCloud iframe with that host if it remains runtime-owned
- shrinking `AppShell` selectors, refs, and effects tied only to audio runtime ownership
- preserving the current visible UI and store contract

This phase does not cover:
- browser docking or browser floating extraction
- spaghetti window drag, resize, or titlebar extraction
- workspace split menu cleanup
- workspace modes
- theme or CSS cleanup
- store redesign or transport protocol redesign

## Doc Body

## [x] - `[5.0F-1]` - `AppShell Runtime Host Extraction`

### Header

Purpose:
- move feature-specific app-level runtime behavior out of the main shell body without changing the visible workspace layout

Owns:
- mounted `RadioRuntimeHost` seam
- `AudioEngine` lifecycle
- SoundCloud iframe bridge ownership
- burst, seek, and reload handling
- waveform-capability refresh and transport polling
- sampler preview and loop scheduling

Keeps in `AppShell`:
- top-level surface composition
- `RadioPanel` visibility choice
- workspace active-surface and shell layout behavior
- browser and spaghetti window controllers for the later `[5.0F-2]` cut

### Shipped Result

- `src/app/hosts/RadioRuntimeHost.tsx` now owns the radio/sampler runtime helpers, refs, effect cluster, and hidden SoundCloud bridge iframe.
- `src/app/AppShell.tsx` now mounts `RadioRuntimeHost` beside `RadioPanel` and no longer owns the audio runtime selectors, refs, helpers, or effects directly.
- `src/app/hosts/RadioRuntimeHost.test.tsx` now covers the hidden bridge iframe, supported burst handling, and unmount cleanup of the mounted runtime seam.

### Current Seam Read

- `AppShell` currently selects most runtime inputs from `useAudioSamplerStore` near the top of the component body
- runtime refs and timers live inline in `AppShell`:
  - `radioAudioEngineRef`
  - `radioSoundCloudIframeRef`
  - `lastHandledRadioBurstRequestIdRef`
  - `lastHandledRadioSeekRequestIdRef`
  - `lastHandledRadioReloadRequestIdRef`
  - `lastHandledSamplerStepPreviewRequestIdRef`
  - `samplerLoopTimeoutRef`
  - `samplerRepeatTimeoutIdsRef`
- runtime effects currently live as one large cluster in the shell body:
  - engine dispose
  - disabled reset
  - warmup registration
  - source preload
  - waveform-capability and state refresh
  - burst playback
  - seek handling
  - reload handling
  - step preview
  - transport polling
  - loop scheduling
- the hidden `Radio SoundCloud Bridge` iframe is still rendered by `AppShell`

### Questions / Decisions

#### [x] - `q1` What is the first host boundary?

##### Suggestion
- create `src/app/hosts/RadioRuntimeHost.tsx`
- move the radio/sampler runtime refs, helper functions, and `useEffect` cluster into that one mounted component
- have `AppShell` mount `<RadioRuntimeHost />` near the bottom of the shell tree where the hidden iframe currently lives
- keep the first cut to one host component rather than splitting radio and sampler immediately

#### [x] - `q2` Should the new host take props or read stores directly?

##### Suggestion
- let `RadioRuntimeHost` read `useAudioSamplerStore` internally for the first cut
- keep `AppShell` out of the runtime-selector path as much as possible
- only keep `AppShell` selectors that it still needs for visible shell composition, such as whether `RadioPanel` is open

#### [x] - `q3` Where should the hidden SoundCloud iframe live?

##### Suggestion
- move the iframe into `RadioRuntimeHost`
- keep the SoundCloud bridge physically attached to the runtime seam so lifecycle, refs, and cleanup stay in one place
- do not leave the iframe in `AppShell` once the rest of the runtime cluster has moved

#### [x] - `q4` Should helper functions stay in `AppShell`?

##### Suggestion
- move `createRadioAudioEngine`, `resolveActiveRadioDescriptor`, `resolveSamplerStepPlaybackInput`, and `playRadioBurstFromSource` into `RadioRuntimeHost.tsx` in the first cut
- do not create a generic shared utility file yet
- only split helpers again later if another non-AppShell caller truly needs them

### Implementation Spec

Recommended file changes:
- edit `src/app/AppShell.tsx`
- create `src/app/hosts/RadioRuntimeHost.tsx`
- optional only if the host grows too large during implementation:
  - create `src/app/hosts/useRadioRuntimeHost.ts`
- no CSS changes planned

Implementation steps:
1. create `src/app/hosts/RadioRuntimeHost.tsx`
2. move the four runtime helper functions from `AppShell.tsx` into that new host file
3. move the runtime-only refs and timers into the host:
   - `radioAudioEngineRef`
   - `radioSoundCloudIframeRef`
   - last-handled request refs
   - sampler timeout refs
4. move the runtime-only `useAudioSamplerStore` selectors into the host
5. move the runtime `useEffect` cluster into the host in the same behavior order it has today
6. render the hidden SoundCloud iframe from the host instead of `AppShell`
7. replace the removed shell-body runtime block with one mounted `<RadioRuntimeHost />`
8. leave visible surface rendering, shell menus, browser state, and spaghetti window logic in `AppShell`

Required behavior-preservation rules:
- do not rename public store fields in this phase
- do not redesign `AudioEngine`
- do not change the `RadioPanel` UI contract
- do not widen into browser or spaghetti shell-controller extraction
- treat current runtime behavior as canonical, even if the internal organization improves

Expected `AppShell` cleanup after this phase:
- the runtime-only store selector cluster near the top of `AppShell` shrinks
- the audio-engine and iframe refs disappear from `AppShell`
- the large effect block around the radio/sampler runtime is removed from `AppShell`
- `AppShell` becomes more obviously a composition root plus shell controller, not a runtime orchestrator

Verification:
- run:
  - `src/app/AppShell.test.tsx`
  - `src/app/hosts/RadioRuntimeHost.test.tsx`
  - `src/app/panels/RadioPanel.test.tsx`
  - `src/app/panels/AudioSamplerPanel.test.tsx`
- run any existing audio/runtime-focused tests if present
- manually smoke-check:
  - open and close the radio toolbar
  - radio source preload
  - burst playback
  - seek
  - reload
  - sampler step preview
  - sampler transport play and stop
  - loop and repeat scheduling
- run a production build if the repo is otherwise buildable, and record unrelated pre-existing failures separately instead of widening this phase

Definition of done:
- `AppShell` mounts one runtime host seam instead of directly owning the radio/sampler runtime cluster
- the hidden SoundCloud iframe is no longer rendered by `AppShell`
- visible shell layout is materially unchanged
- radio and sampler behavior still work through the existing stores and panels
