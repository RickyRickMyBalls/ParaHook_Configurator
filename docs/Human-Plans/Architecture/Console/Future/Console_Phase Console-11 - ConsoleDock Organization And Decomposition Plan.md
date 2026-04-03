# Console Phase Console-11 - ConsoleDock Organization And Decomposition Plan

## Doc Header

### Doc History
19. 2026-04-03 17:24: Implemented `Phase 5.1 - Move Submit Coordinator And Remaining Controller Callbacks Into useConsoleInteraction`, moving the submit coordinator and the remaining interaction callback band out of `ConsoleDock.tsx` into `src/app/console/useConsoleInteraction.ts`, rewiring `ConsoleDock.tsx` down to helper seams plus render-shell ownership, and verifying the slice with the targeted console Vitest pass plus a full production build while keeping `Phase 5` open for any final shell-thinning follow-on
18. 2026-04-03 17:04: Prepared `Phase 5.1 - Move Submit Coordinator And Remaining Controller Callbacks Into useConsoleInteraction` for implementation by re-reading the live post-first-cut controller boundary, confirming the remaining heavy seam is now the still-inline submit, cancel or back stepping, transform tab-cycle, and related interaction callback band in `ConsoleDock.tsx`, and locking the exact targets, exclusions, sequencing, and verification around finishing that move into `src/app/console/useConsoleInteraction.ts`
17. 2026-04-03 17:04: Added a new explicit `Phase 5.1 - Move Submit Coordinator And Remaining Controller Callbacks Into useConsoleInteraction`, turning the still-open remainder after the first `Phase 5` controller-hook cut into its own tracked next slice so the next console shell-thinning pass is concrete about moving `handleSubmitCommand(...)`, escape or cancel stepping, transform tab-cycle helpers, and the remaining interaction callbacks out of `ConsoleDock.tsx`
16. 2026-04-03 16:59: Implemented the first `Phase 5 - Thin ConsoleDock Composition Shell` controller-hook cut by extracting guided-root rehydration, radio-choice coordination, duplicated main or pop-out keyboard routing, and prompt or feature or sketch sync effects into `src/app/console/useConsoleInteraction.ts`, rewiring `ConsoleDock.tsx` to consume that hook, and verifying the slice with the targeted console Vitest pass plus a full production build while leaving the phase open because `handleSubmitCommand(...)` and the remaining controller callbacks still live in `ConsoleDock.tsx`
15. 2026-04-03 16:42: Prepared `Phase 5 - Thin ConsoleDock Composition Shell` for implementation by re-reading the live post-`Phase 4.2` `ConsoleDock.tsx` shape, confirming the remaining heavy seam is now the high-level interaction/controller band rather than more domain-family duplication, and locking the next cut around a `useConsoleInteraction`-style hook for submit, escape/back, keyboard routing, and prompt/feature sync while keeping final render composition and windowing local
14. 2026-04-03 16:39: Implemented `Phase 4.2 - Finish Reference Transform Root Shortcut Cleanup And Coverage`, removing the leftover inline `referenceTransformRoot` delete-latest fallback from `ConsoleDock.tsx`, adding direct focused tests for `tryHandleReferenceTransformRootShortcut(...)` and `tryHandleActiveReferenceTransformSubmission(...)`, and verifying the cleanup with the targeted console Vitest pass plus a full production build
13. 2026-04-03 16:34: Added a new narrow `Phase 4.2 - Finish Reference Transform Root Shortcut Cleanup And Coverage`, capturing from the post-`Phase 4.1` code review that the large duplicate runtime seam is gone but one leftover `referenceTransformRoot` delete-latest fallback still lives inline in `ConsoleDock.tsx` and the extracted active reference-transform helper paths still need direct focused tests before `Phase 5`
12. 2026-04-03 16:21: Implemented `Phase 4.1 - Complete Reference/Content Runtime Extraction Cleanup`, removing the stale inline reference/content prompt and staged-execute branches left behind in `ConsoleDock.tsx`, expanding `consoleReferenceContentCommands.test.ts` into direct runtime coverage for delete-latest, content-owner rename prompts, staged prompt creation, and staged execute handling, and verifying the cleanup with the targeted console Vitest pass plus a full production build
11. 2026-04-03 16:04: Added a new follow-on `Phase 4.1 - Complete Reference/Content Runtime Extraction Cleanup`, recording from the post-implementation review that the first `Phase 4` seam landed but left stale inline reference/content runtime ownership inside `ConsoleDock.tsx`, so the cleanup to finish that extraction now has its own explicit implementation-ready slice before `Phase 5` shell-thinning
10. 2026-04-03 15:46: Implemented `Phase 4 - Split Domain Command Families Out Of Submit Dispatch`, extracting the first reference-transform, content-transform, and content-owner rename runtime-family seam into `src/app/console/consoleReferenceContentCommands.ts`, routing the corresponding `ConsoleDock.tsx` submit paths through that module, adding focused runtime-family tests, and verifying the slice with the targeted `ConsoleDock` Vitest pass plus a full production build
9. 2026-04-03 15:21: Prepared `Phase 4 - Split Domain Command Families Out Of Submit Dispatch` for implementation by re-reading the live post-`Phase 3` submit-runtime seam in `ConsoleDock.tsx`, confirming the first real extraction cut should group reference transform, content transform, and browser-adjacent content-owner rename handling together before sketch, radio, or flat-command cleanup, and locking the concrete file targets, exclusions, sequencing, and verification around that narrower first family split
8. 2026-04-03 15:03: Implemented `Phase 3 - Extract Window Host And Surface Placement Logic`, moving the locked floating, pop-out, drag, resize, split-preview, and host-render data mechanics out of `ConsoleDock.tsx` into `src/app/console/useConsoleWindowing.ts`, preserving final JSX ownership in `ConsoleDock.tsx`, and verifying the extraction with the targeted `ConsoleDock` Vitest pass plus a full production build
7. 2026-04-03 14:41: Prepared `Phase 3 - Extract Window Host And Surface Placement Logic` for implementation by re-reading the live post-`Phase 2` `ConsoleDock.tsx` host seam, confirming the windowing direction still holds, and locking the exact `useConsoleWindowing`-style boundary, exclusions, sequencing, and verification around floating rect bounds, drag or resize flow, pop-out host wiring, split preview state, and render-integration outputs
6. 2026-04-03 14:31: Implemented `Phase 2 - Extract Pure Parsing, Prompt, And Formatting Helpers`, moving the locked first-cut parser, prompt-text, and literal helpers out of `ConsoleDock.tsx` into `consoleCommandParser.ts`, `consolePromptText.ts`, and `consoleFormatters.ts`, adding focused helper tests, and verifying the extraction with the targeted console Vitest pass plus a full production build
5. 2026-04-03 14:24: Prepared `Phase 2 - Extract Pure Parsing, Prompt, And Formatting Helpers` for implementation by locking the exact first-cut helper set, file targets, exclusions, sequencing, and verification around the current live `ConsoleDock.tsx` pure-helper band so the next code pass can start without reopening scope
4. 2026-04-03 14:17: Re-ran `Phase 1 - Responsibility Audit And Safe Extraction Boundaries` against the later `ConsoleDock.tsx` shape after more console work, confirming the overall extraction order still holds while refreshing the audit to call out the newer feature-assist helper band, the newer content-owner rename prompt path, and the fact that `Workspace Modes` staged-navigation ownership already lives partly outside `ConsoleDock`
3. 2026-04-03 12:10: Completed `Phase 1 - Responsibility Audit And Safe Extraction Boundaries`, tracing the current `ConsoleDock.tsx` owner seams into concrete extraction groups, locking which helpers are already pure, which context builders are store-derived but still extractable, which window-host seams should stay together, and which command-runtime families should be split later rather than during the first movement pass
2. 2026-04-03 11:55: Renamed this open plan into the future-doc style `Console 11`, removed the legacy `5.1H` label from the document body, and converted the implementation ladder from `5.1H1` style subphases to plain `Phase 1` through `Phase 5`
1. 2026-04-03 11:20: Created this standalone root-level console phase doc so the planned `ConsoleDock.tsx` organization work has its own active planning record with explicit subphases instead of living only as an ad hoc refactor note

### Purpose

This phase organizes the future cleanup of `src/app/console/ConsoleDock.tsx`.

Use it to answer:
- what responsibilities `ConsoleDock` currently owns
- which parts should be extracted first versus left alone
- how to split the work into subphases without rewriting console behavior blindly
- what the target ownership shape should be when the work is done

## Doc Body

## [ ] `Console 11` - `ConsoleDock Organization And Decomposition Plan`

### Summary

`Console 11` should turn `ConsoleDock.tsx` from one very large mixed-responsibility entrypoint into a thinner console shell over smaller focused modules.

Current live shape:
- the file is simultaneously a React surface host
- a floating/pop-out/list/split-dock window manager
- a console command parser and submit dispatcher
- a prompt/session coordinator
- a domain glue layer for reference transforms, content transforms, sketch, radio, and view commands

Important rule:
- this phase is not a license for a giant rewrite
- the goal is controlled extraction with behavior preserved at each step

### Why This Phase Exists

The current console architecture is directionally right, but `ConsoleDock.tsx` has become the local accumulation point for too many ownership layers at once.

Current risk:
- UI rendering changes are mixed with command-runtime changes
- domain command work is harder to review because it sits inside one large `handleSubmitCommand(...)` path
- helper extraction and test coverage are harder because many functions are file-local and tightly coupled
- future command growth is likely to keep landing in `ConsoleDock` unless the file gets a cleaner shape first

`Console 11` exists to create a repeatable refactor sequence before more behavior is added.

### Current Responsibility Inventory

The current `ConsoleDock` file mixes at least these responsibility groups:

- render and composition
  - docked row
  - expanded panel
  - floating window
  - pop-out surface
  - list overlay

- console surface hosting
  - input refs and focus rules
  - shared visual style calculation
  - pop-out child-window host wiring

- windowing and placement
  - floating rectangle clamping
  - drag and resize handling
  - split-dock preview and split commit behavior

- prompt and staged-session helpers
  - prompt text builders
  - breadcrumb and choice summary formatting
  - assisted descriptor formatting

- command parsing and normalization
  - root command parsing
  - zoom token parsing
  - vector and float literal parsing
  - radio and transform prompt token normalization

- domain command execution
  - view/camera commands
  - reference transform commands
  - content object transform commands
  - sketch plane and sketch draw commands
  - radio commands
  - workspace split and surface actions

Important rule:
- those groups do not all belong in one file long term
- they also do not all need to move in one phase cut

### Locked Direction

The locked direction for `Console 11` is:
- keep `ConsoleDock` as the composition entry surface
- move pure helpers out first
- move domain command families behind focused modules or hooks next
- isolate window-host behavior from command-runtime behavior
- leave canonical command ownership at the real owner seams already defined by prior console phases

Important non-goal:
- `Console 11` does not move graph, viewer, or workspace ownership into a new console owner
- it only removes accidental accumulation inside `ConsoleDock`

### Target Shape

After `Console 11`, the target shape should look more like:

- `ConsoleDock.tsx`
  - thin composition shell
  - store subscriptions
  - high-level wiring of render surfaces and handler hooks

- console pure helper modules
  - command parsing
  - prompt text
  - formatting and literal parsing

- console window host hook/module
  - floating rect math
  - drag and resize
  - pop-out host coordination
  - split-dock preview and commit helpers

- console command runtime modules
  - reference/content transform command handling
  - sketch command handling
  - radio command handling
  - shared root command dispatch glue

Important rule:
- use extraction boundaries that match responsibilities, not arbitrary line counts

### Proposed File Family

The exact filenames can still change, but the intended family is:

- `src/app/console/ConsoleDock.tsx`
  - thin host and composition surface
- `src/app/console/consoleCommandParser.ts`
  - root command parsing and token normalization
- `src/app/console/consolePromptText.ts`
  - prompt-session, breadcrumb, and assist text builders
- `src/app/console/consoleFormatters.ts`
  - shared display-format helpers and literal parsing that are not command-family specific
- `src/app/console/useConsoleWindowing.ts`
  - floating, pop-out, drag, resize, and split-dock host behavior
- `src/app/console/consoleReferenceContentCommands.ts`
  - reference and content transform command-family handling
- `src/app/console/consoleSketchCommands.ts`
  - sketch plane and sketch draw command-family handling
- `src/app/console/consoleRadioCommands.ts`
  - radio command-family handling
- optional later:
  - `src/app/console/useConsoleSubmission.ts`
  - one high-level submit/runtime coordinator once the family handlers are small enough

Important rule:
- pure helpers should not pull React refs or DOM state unless that is truly required
- domain command modules should prefer explicit inputs and returned outcomes over hidden closure state where possible

## Subphases

## [x] `Phase 1` - `Responsibility Audit And Safe Extraction Boundaries`
### Header
`Phase 1` should freeze the current responsibility map before code movement starts.

Goals:
- inventory which helper functions are pure
- identify which closures are tightly coupled to React state versus store state
- mark which command families can be extracted independently

Deliverables:
- one responsibility inventory for `ConsoleDock.tsx`
- one extraction map grouped by:
  - pure helpers
  - window host behavior
  - domain command families
  - final composition shell

Acceptance shape:
- the team can point at a proposed destination for each major helper/handler block before moving code
- risky cross-cutting closures are called out explicitly instead of being discovered mid-refactor

### Phase 1 Findings

#### Stale check result
- `Phase 1` is not stale in its main conclusion
- the current live `ConsoleDock.tsx` still supports the same extraction order:
  - pure helpers first
  - window-host mechanics second
  - command-family runtime splits later
  - composition-shell thinning last
- the parts that needed refresh were not the broad phase order
- the parts that needed refresh were the finer seam labels inside the helper and runtime bands

#### Pure helper seam
- `src/app/console/ConsoleDock.tsx` already contains a real top-level pure-helper band before the component starts
- the clearest low-risk extract candidates currently include:
  - `parseConsoleCommand(...)`
  - `parseZoomCommandAction(...)`
  - `buildStagedPromptText(...)`
  - `buildConsolePromptSessionText(...)`
  - `buildRootPromptText(...)`
  - top-level literal and formatter helpers such as vec2 or vec3 parsing and display formatting
- these helpers do not depend on React refs or component-local closure state
- `Phase 2` should move this band first because it is the safest file-length reduction with the smallest behavioral risk

#### Feature-assist helper seam
- the live file now has a clearer middle helper band between the lowest-level pure formatters and the later store-derived context builders
- the strongest examples are:
  - `buildSketchPlaneFeatureAssistDescriptor(...)`
  - `buildSketchDrawFeatureAssistDescriptor(...)`
  - `buildSketchDrawCameraAssistDescriptor(...)`
  - `buildSketchDrawCameraProjectionAssistDescriptor(...)`
  - `getActiveFeatureAssistDescriptor(...)`
  - feature-assist token helpers such as `getFeatureAssistChoiceInputText(...)` and `findFeatureAssistChoiceByInput(...)`
- this seam is helper-shaped, but not fully pure:
  - some builders read live prefs through `useUiPrefsStore.getState()`
  - some builders bridge reference-workspace or staged-session truth into console descriptor output
- extraction rule:
  - keep the truly pure parser, prompt-text, and literal helpers as the first `Phase 2` cut
  - treat feature-assist descriptor builders as a nearby second-wave helper seam unless their remaining store reads are removed first
  - do not blur this seam back into the lower-level parser or formatter file just because it sits near the top of `ConsoleDock.tsx`

#### Store-derived context seam
- `ConsoleDock.tsx` also has a second pre-component helper band that is not fully pure, but is still already separated from JSX rendering
- the key examples are:
  - `resolveEditorViewportIdForGraphDocumentFromState(...)`
  - `resolveConsoleGraphDocumentIdFromState(...)`
  - `resolveConsoleActionContextFromState(...)`
  - `ensureSpaghettiEditorVisibleForGraphRoot(...)`
  - `buildStagedNavigationContextFromStoreState(...)`
- these helpers depend on app, workspace, or spaghetti store truth, but they are still easier to move than the deeply nested submit handlers because they do not depend on live React refs
- extraction rule:
  - treat these as a second-wave helper seam after the purely stateless parsers and prompt builders
  - do not mix them into the same file as the lowest-level text formatters if that would blur the pure/non-pure boundary again

#### Window host seam
- the component has one identifiable window-host block that should stay together during extraction
- the current seam includes:
  - floating rect and viewport bound resolution
  - pop-out host wiring through `useWorkspaceChildWindow(...)`
  - split-dock preview resolution and split commit behavior
  - floating header drag start and replay
  - floating resize mechanics
  - the final floating and pop-out portal rendering paths
- the strongest current owner slice is:
  - one focused `useConsoleWindowing` style hook or helper family
  - one place that receives the console store setters, current `floatingRect`, workspace slot context, and callback hooks for render integration
- important rule:
  - drag, resize, pop-out, and split-preview behavior should move together
  - do not split those mechanics across several tiny files during the first extraction pass

#### Submit runtime seam
- `handleSubmitCommand(...)` is the largest single concentration of behavior and should not be the first extraction cut
- Phase 1 tracing shows three real layers inside that path:
  - prompt-session handling
    - reference transform axis and plane prompts
    - delete-latest confirmation prompts
    - content-owner rename prompts
    - radio prompt sessions
  - staged-navigation execution
    - root/session advancement
    - session resume and breadcrumb re-entry
    - workspace, sketch, radio, and transform staged action dispatch
  - flat command dispatch
    - `help`
    - `clear`
    - `history`
    - `frame`
    - `zoom`
    - `pan`
    - `orbit`
    - `move`
    - `rotate`
    - `scale`
    - `snap`
    - `echo`
    - `status`
- extraction rule:
  - do not try to move the entire submit dispatcher at once
  - separate the low-risk text helpers and window-host block first, then split command families out of submit dispatch in a later focused phase
  - keep `Workspace Modes` on the existing `stagedNavigation.ts` ownership path instead of re-absorbing that branch into a new monolithic console runtime file

#### Domain family seam
- the runtime helpers immediately above `handleSubmitCommand(...)` already show natural family boundaries
- the strongest current family clusters are:
  - reference and content transform session helpers
    - prompt open and close
    - snap session creation
    - draft commit and delete-latest flow
    - shell exit and mode cycling
  - sketch helpers
    - sketch draw staged-root priming
    - graph-node creation fallback
    - sketch plane and sketch draw follow-up routing
  - view and selection helpers
    - zoom target resolution
    - action-context resolution
    - frame and camera mode command bridging
- an additional newer family edge is now visible:
  - content-owner prompt or browser-adjacent rename handling
    - `content.owner.label` prompt submission
    - rename success or failure reporting
    - return-to-session handoff after rename
- extraction rule:
  - keep browser-adjacent rename prompt handling grouped with the content family seam, not buried as a one-off branch inside the eventual shared submit coordinator
- these should become later command-family modules rather than being flattened into one generic helper bucket

#### Render composition seam
- the actual JSX composition is comparatively narrow and already clustered near the end of the file
- the render surface currently breaks down cleanly into:
  - floating window rendering
  - pop-out surface rendering
  - list overlay rendering
  - docked surface rendering
  - split-dock ghost rendering
- this confirms the long-term direction that `ConsoleDock.tsx` can realistically become a thin composition shell once the helper and runtime seams move out

#### Main extraction risks
- several callbacks close over both console-store setters and live app or workspace store reads
- many `useEffect(...)` blocks synchronize staged navigation with reference-transform shells, sketch sessions, pop-out ownership, and workspace context handoff
- those effects are not good first-move targets because moving them too early would mix ownership cleanup with live behavior changes
- the riskiest near-term mistake would be:
  - extracting `handleSubmitCommand(...)` first
  - while leaving prompt builders, context builders, and host mechanics interleaved in `ConsoleDock.tsx`

### Phase 1 Handoff

Phase 1 now locks this extraction order for later work:

#### Phase 2 handoff
- move the top-level pure helper band first:
  - command parsing
  - prompt text builders
  - breadcrumb and choice formatting
  - literal parsing and display formatting
- keep the exported or imported shape narrow and explicit
- do not include store-derived context builders in the first pure-helper file unless their dependencies are removed first
- do not force the feature-assist descriptor builders into the first pure-helper move just because they are top-level helpers; they now read as a nearby second-wave helper seam

#### Phase 3 handoff
- extract the floating, pop-out, drag, resize, and split-preview mechanics as one window-host seam
- keep these inputs explicit:
  - `floatingRect`
  - console store setters
  - workspace slot context
  - detached console surface state
  - optional header-drag replay callbacks
- preserve the existing render integration points for:
  - floating window
  - pop-out portal
  - split ghost portal

#### Phase 4 handoff
- split runtime behavior by command family rather than by arbitrary line ranges
- the best first family boundary is:
  - reference and content transform command handling
- the next likely family boundary is:
  - sketch plane and sketch draw command handling
- radio and shared flat-command dispatch can stay later if needed
- keep `Workspace Modes` root or viewport menu construction on the existing staged-navigation seam that already lives outside `ConsoleDock.tsx`
- treat content-owner rename prompting as part of the content or browser-adjacent family seam rather than a separate free-floating prompt bucket

#### Phase 5 handoff
- only after the helper and runtime families move out should `ConsoleDock.tsx` be reduced to:
  - store subscriptions
  - ref wiring
  - effect wiring that still truly belongs to the composition shell
  - final render composition

#### Locked conclusions from Phase 1
- `ConsoleDock.tsx` is large because it is carrying four different seams at once:
  - pure console text helpers
  - feature-assist descriptor helpers
  - store-derived console context builders
  - window-host mechanics
  - runtime command-family glue
- the safest first extraction is the pure-helper band, not the submit dispatcher
- the new feature-assist helper band is close to the pure-helper area, but it is not pure enough to collapse into the exact same first file by default
- the safest second extraction is the window-host seam, not the effect synchronization layer
- the document's original Phase 2 through Phase 5 order remains correct after the code read and should stay locked

## [x] `Phase 2` - `Extract Pure Parsing, Prompt, And Formatting Helpers`

### Header
`Phase 2` should move the safest console-generic helper band first without changing command ownership, session behavior, or window-host behavior.

### Implementation Result

- extracted the locked first-cut helper set into:
  - `src/app/console/consoleCommandParser.ts`
  - `src/app/console/consolePromptText.ts`
  - `src/app/console/consoleFormatters.ts`
- updated `src/app/console/ConsoleDock.tsx` to import those helpers instead of owning the inline copies
- kept the nearby feature-assist, store-derived, window-host, and command-family-specific helper seams in `ConsoleDock.tsx` as planned
- added focused helper coverage in:
  - `src/app/console/consoleCommandParser.test.ts`
  - `src/app/console/consolePromptText.test.ts`
  - `src/app/console/consoleFormatters.test.ts`
- verification completed:
  - `npm.cmd test -- consoleCommandParser consoleFormatters consolePromptText ConsoleDock`
  - `npm.cmd run build`

Goals:
- reduce `ConsoleDock.tsx` length with the lowest-risk movement available
- create importable pure helper modules that can be tested directly
- lock the first extraction cut tightly enough that implementation does not drift into feature-assist, windowing, or submit-runtime rewrites

Scope:
- command parsing helpers
- prompt text builders
- breadcrumb and choice formatting
- literal parsing and display formatting helpers that do not require component state

### Current Live Read

- the strongest first move is still the console-generic pure helper band that sits before the feature-assist and store-derived helper seams
- the first implementation cut should prefer helpers that are reused across the flat command path, staged-navigation prompts, and multiple submit branches
- the first implementation cut should not try to move every top-level pure function just because it lives above the component

### Locked `Phase 2` File Targets

- `src/app/console/consoleCommandParser.ts`
  - `ConsoleCommandName`
  - `parseConsoleCommand(...)`
  - `normalizeConsoleBranchTokens(...)`
  - `parseZoomCommandAction(...)`
  - `normalizeRadioCommandIdentity(...)`
- `src/app/console/consolePromptText.ts`
  - `formatStagedBreadcrumb(...)`
  - `formatStagedChoiceSummary(...)`
  - `getStagedScopeLabel(...)`
  - `buildStagedPromptText(...)`
  - `buildConsolePromptSessionText(...)`
  - `buildRootPromptText(...)`
  - `ROOT_PROMPT_TEXT`
- `src/app/console/consoleFormatters.ts`
  - `parseConsoleVec2Literal(...)`
  - `parseConsoleVec3Literal(...)`
  - `parseConsoleSignedFloatLiteral(...)`

Important rule:
- keep function names and call signatures stable unless a tiny type-export adjustment is required to make the extraction compile cleanly
- do not add a new shared barrel or abstraction layer just to support this first cut

### Locked `Phase 2` Exclusions

- leave these in `ConsoleDock.tsx` for now:
  - `buildConsoleStyle(...)`
  - `clampFloatingRect(...)`
  - feature-assist descriptor builders such as `buildSketchPlaneFeatureAssistDescriptor(...)`, `buildSketchDrawFeatureAssistDescriptor(...)`, and `getActiveFeatureAssistDescriptor(...)`
  - feature-assist choice helpers such as `buildFeatureAssistPromptText(...)`, `getFeatureAssistChoiceInputText(...)`, and `findFeatureAssistChoiceByInput(...)`
  - store-derived context builders such as `resolveConsoleActionContextFromState(...)` and `buildStagedNavigationContextFromStoreState(...)`
  - reference-transform snap helpers such as `formatReferenceTransformSnapValue(...)`, `getReferenceTransformSnapModeLabel(...)`, and `isValueAlignedToStep(...)`
  - sketch-status display helpers such as `getGeometrySketchDrawStageLabel(...)` and `formatGeometrySketchStatusVec2(...)`
  - radio-specific burst-time helpers such as `parseRadioSampleBurstTime(...)` and `formatRadioSampleBurstTime(...)`

Reason:
- some of these helpers are pure, but they are family-specific enough that moving them now would blur the first cut and make later `Phase 4` family extraction less clear

### Recommended Implementation Order

1. Add the new pure helper modules with copied logic and explicit exports only.
2. Swap `ConsoleDock.tsx` to import those helpers without changing runtime flow or transcript wording.
3. Keep all moved helper behavior byte-equivalent unless a compile-only type fix is required.
4. Add focused unit tests for the new pure modules rather than relying only on indirect `ConsoleDock` coverage.
5. Run the existing console tests after the helper extraction lands.

If `Phase 2` is split into smaller commits, prefer this order:
- parser and prompt-text modules first
- literal parser extraction second

### Test Plan

Add focused tests for:
- `src/app/console/consoleCommandParser.test.ts`
  - command alias parsing such as `f`, `z`, `m`, `r`, and `s`
  - unknown command handling
  - zoom action parsing including `all`, `extents`, `previous`, `window`, and `object`
  - token normalization through `normalizeRadioCommandIdentity(...)`
- `src/app/console/consolePromptText.test.ts`
  - root prompt generation
  - staged breadcrumb formatting
  - `buildStagedPromptText(...)` for normal staged scopes versus snap-value scopes
  - `buildConsolePromptSessionText(...)` for axis, plane, and delete-confirm prompt shapes
- `src/app/console/consoleFormatters.test.ts`
  - vec2, vec3, and signed-float acceptance and rejection cases

Regression pass:
- keep `src/app/console/ConsoleDock.test.tsx` green after the extraction
- avoid changing any existing console transcript strings as part of this phase

Acceptance shape:
- `ConsoleDock.tsx` imports these helpers instead of owning them inline
- the moved helpers are directly testable without rendering `ConsoleDock`
- no render-ownership, windowing, pop-out, floating, split-dock, or domain-command behavior changes land in this subphase

Important non-goal:
- `Phase 2` is not the phase where feature-assist helpers, store-derived context builders, or command-family-specific pure helpers are aggressively normalized
- the job here is a safe first extraction slice, not a maximum-purity cleanup contest

## [x] `Phase 3` - `Extract Window Host And Surface Placement Logic`

### Header
`Phase 3` should isolate console window-host mechanics from command execution without changing the existing floating, pop-out, list, or split behavior.

### Implementation Result

- extracted the locked host-mechanics seam into:
  - `src/app/console/useConsoleWindowing.ts`
- updated `src/app/console/ConsoleDock.tsx` to delegate:
  - floating rect clamping
  - slot-header drag replay
  - floating drag and resize handlers
  - pop-out host creation
  - split preview state and split commit behavior
  - floating, pop-out, and split-ghost render data preparation
- kept final JSX ownership in `ConsoleDock.tsx` for:
  - floating window render
  - pop-out portal render
  - split ghost portal render
- kept the pop-out keyboard-routing effect in `ConsoleDock.tsx` as planned
- verification completed:
  - `npm.cmd test -- ConsoleDock`
  - `npm.cmd run build`

Scope:
- floating rect clamping
- drag and resize interactions
- pop-out host wiring
- split-dock preview and commit logic

Goals:
- make console placement behavior easier to reason about
- keep visual host work separate from command grammar/runtime work
- reduce the number of low-level DOM/event concerns inside `ConsoleDock`

### Current Live Read

- the live window-host seam still sits in one identifiable cluster after the `Phase 2` helper extraction
- the strongest host mechanics currently include:
  - floating viewport size and bound resolution
  - floating rect clamping through `clampConsoleFloatingRect(...)`
  - pop-out child-window setup through `useWorkspaceChildWindow(...)`
  - split preview state plus split commit helpers
  - floating drag start, pointer tracking, and slot-header drag replay
  - floating resize pointer tracking
  - floating, pop-out, and split-ghost render data preparation
- the live seam also has one important adjacent dependency that should stay out of the first host extraction:
  - the pop-out keyboard-routing effect that listens on `popoutWindow`
  - it depends on the pop-out window object, but it is still input-routing logic rather than placement or host behavior

### Locked `Phase 3` File Target

- `src/app/console/useConsoleWindowing.ts`
  - host or windowing hook that receives explicit inputs from `ConsoleDock.tsx`
  - returns host state, callbacks, and render-ready data back to the component

Important rule:
- `Phase 3` should extract mechanics, not hide the console surface behind a giant opaque hook
- `ConsoleDock.tsx` should still visibly own the final JSX composition for:
  - floating window render
  - pop-out portal render
  - split ghost portal render

### Locked `Phase 3` Inputs

The extracted hook or helper family should take explicit inputs for:
- `dockRef`
- `floatingRect`
- `setFloatingRect`
- `windowMode`
- `switchToDocked(...)`
- `switchToFloating()`
- `switchToPopout()`
- `switchToList()`
- `returnFromList()`
- `handlePopoutWindowClosed`
- `slotHeaderDragSeed`
- `suppressSlotHeaderDragSeedReplay`
- `onConsumeSlotHeaderDragSeed`
- `onOpenFloatingSplitMenu`
- detached console surface context
- `viewportSlotsById`

If additional values are required during implementation, prefer adding them explicitly rather than letting the extracted hook read hidden console state ad hoc.

### Locked `Phase 3` Outputs

The extracted hook or helper family should return enough data for `ConsoleDock.tsx` to keep render ownership obvious:
- `popoutWindow`
- `popoutHost`
- `splitDockPreview`
- `splitDockGhostStyle`
- `handleFloatingHeaderPointerDown`
- `handleFloatingResizePointerDown`
- `handleFloatToggle`
- `handlePopoutToggle`
- `handleListToggle`
- `handleFloatingClose`
- `handlePopoutClose`
- `handleListPanelClose`
- `handleFloatingHeaderContextMenu`

Optional:
- a small host-state bundle for `floatingWindow` or `popoutSurface` props if that keeps the component readable without hiding final JSX structure

### Locked `Phase 3` Exclusions

- keep these in `ConsoleDock.tsx` for now:
  - `buildConsoleStyle(...)` and the shared style memo
  - transcript or list-surface rendering
  - `ConsolePanel` and `ConsoleBar` JSX composition
  - global keyboard-routing effects for the main window
  - the pop-out keyboard-routing effect, even though it depends on `popoutWindow`
  - staged-navigation, prompt-session, feature-assist, and submit-runtime logic
  - store-derived context builders and command-family helpers

Reason:
- the point of `Phase 3` is to isolate host mechanics, not to mix input ownership cleanup or JSX abstraction into the same slice

### Recommended Implementation Order

1. Move host-only utilities and callbacks into `useConsoleWindowing.ts` while keeping their signatures explicit.
2. Move pop-out host creation, split-preview helpers, drag or resize handlers, and close or toggle handlers into that hook.
3. Keep final floating, pop-out, and split-ghost JSX in `ConsoleDock.tsx`, powered by returned hook data.
4. Leave the pop-out keyboard listener in `ConsoleDock.tsx` for this phase unless the extracted host seam can expose `popoutWindow` cleanly without widening scope.
5. Re-run focused console tests and a full build after the extraction lands.

If `Phase 3` is split into smaller commits, prefer this order:
- floating bounds and split-preview helpers first
- pop-out host wiring and handler extraction second
- final JSX integration cleanup third

### Test Plan

Primary regression target:
- keep `src/app/console/ConsoleDock.test.tsx` green after the window-host extraction

Focused confidence areas:
- floating console still drags and resizes through the same pointer paths
- slot-header drag replay still seeds a floating console correctly
- pop-out open and close behavior still routes through the same child-window seam
- split preview and split commit behavior still work for floating drag-out
- list mode, docked mode, and floating-mode toggles still preserve the current truth

Verification shape:
- targeted `ConsoleDock` Vitest pass
- full `npm.cmd run build`

Acceptance shape:
- floating/pop-out/list/split behavior still works
- `ConsoleDock.tsx` delegates host mechanics to a focused hook or module
- final render composition remains visibly owned by `ConsoleDock.tsx`

Important non-goal:
- `Phase 3` is not where we rewrite the pop-out keyboard path, redesign the console render tree, or start splitting submit-runtime command families

## [x] `Phase 4` - `Split Domain Command Families Out Of Submit Dispatch`

### Header
`Phase 4` should break the current submit path into command-family handlers without turning the shared submit seam into a second monolith.

### Implementation Result

- extracted the first reference-plus-content runtime family into:
  - `src/app/console/consoleReferenceContentCommands.ts`
- updated `src/app/console/ConsoleDock.tsx` to route the locked first-cut submit branches through that new module for:
  - reference transform prompt handling
  - active reference transform entry handling
  - staged reference transform execution
  - staged content transform execution
  - transform delete-latest confirmation flow
  - browser-adjacent `content.owner.label` prompt creation and submission handoff
- moved the family-specific snap helpers and root-session builders that support those branches out of `ConsoleDock.tsx` into the same runtime-family module
- added focused module coverage in:
  - `src/app/console/consoleReferenceContentCommands.test.ts`
- verification completed:
  - `npm.cmd test -- consoleReferenceContentCommands ConsoleDock`
  - `npm.cmd run build`

Carry-forward note:
- the first `Phase 4` seam is real and shipped
- the later review found that stale inline copies of the same reference/content prompt and staged-execute branches still remain inside `ConsoleDock.tsx`
- that cleanup is now intentionally tracked as `Phase 4.1` instead of being hand-waved into `Phase 5`

Scope:
- reference transform flow
- content transform flow
- sketch plane and sketch draw flow
- radio flow
- shared root command handling for view/camera/status/history/help families

Goals:
- reduce the size and risk concentration of `handleSubmitCommand(...)`
- let future command changes land inside the right command-family module
- make domain reviews possible without reading the entire console host

### Current Live Read

- after the `Phase 3` host extraction, the largest remaining concentration in `ConsoleDock.tsx` is still the submit/runtime block
- the live post-`Phase 3` read now points even more strongly at one first extraction cut:
  - reference transform runtime
  - content object transform runtime
  - content-owner rename prompting and return-to-session handoff
- these branches already share:
  - prompt-session handling
  - transform session lifecycle
  - snap session and snap-value handling
  - delete-latest confirmation flow
  - viewer transform bridge calls
  - return-to-root or return-to-session transcript behavior
- the live seam also shows several nearby branches that should stay out of the first family extraction:
  - sketch plane pick and sketch draw runtime
  - radio prompt and staged execution flow
  - workspace modes and workspace viewport action handling
  - flat root commands such as `help`, `clear`, `history`, `frame`, `zoom`, `pan`, `orbit`, `echo`, and `status`

### Locked `Phase 4` First-Cut File Targets

- `src/app/console/consoleReferenceContentCommands.ts`
  - first extracted runtime-family module
  - should own the first moved submit/runtime slice for:
    - reference transform prompt handling
    - active reference transform entry handling
    - staged reference transform execution
    - content object transform staged execution
    - transform delete-latest confirmation prompting
    - transform snap value and toggle handling
    - browser-adjacent `content.owner.label` prompt submission and rename handoff
- optional later follow-ons within the broader `Phase 4` ladder:
  - `src/app/console/consoleSketchCommands.ts`
  - `src/app/console/consoleRadioCommands.ts`
  - `src/app/console/consoleFlatCommands.ts`

Important rule:
- `Phase 4` should not try to move every runtime branch in one commit
- the first implementation cut should extract the reference-plus-content family seam only, then re-evaluate the remaining submit coordinator shape before sketch or radio move out

### Locked `Phase 4` Inputs

The first extracted runtime-family module should prefer explicit inputs for:
- `inputText`
- `trimmedInput`
- `activePromptSession`
- `activeStagedSession`
- staged-navigation context builders or current staged context
- prompt-session and staged-session setters
- transcript appenders and command-history pushers
- radio identity and burst helpers
- current reference workspace and app-store accessors
- current spaghetti-store accessors only where transform or graph-context handoff truly needs them
- any viewer bridge helpers needed for transform handle and override coordination

Important rule:
- prefer one explicit dependency bag or typed handler params object over reaching into `ConsoleDock` closure state ad hoc
- if the extracted family still needs store reads, keep those reads visible in the module inputs or in one narrow runtime adapter layer rather than scattering hidden `getState()` calls through many tiny helpers

### Locked `Phase 4` Outputs

The first extracted runtime-family module should return a typed submit outcome shape back to `ConsoleDock.tsx`, for example:
- `handled`
- optional `nextStagedNavigationSession`
- optional `nextConsolePromptSession`
- optional `nextFeatureAssistDescriptor`
- optional `nextInputText`
- optional `transcriptEntries`
- optional `requestRootReentry`

Important rule:
- do not hide transcript side effects behind opaque internal mutations if returning structured outcomes keeps the seam reviewable
- if a tiny number of shared side-effect callbacks makes the first extraction much safer, that is acceptable, but the top-level contract should still make it obvious what the family handled and what it wants the coordinator to do next

### Locked `Phase 4` Exclusions

- leave these in `ConsoleDock.tsx` for the first implementation cut:
  - sketch plane runtime
  - sketch draw runtime
  - radio prompt and staged execution runtime
  - workspace modes and viewport action execution
  - flat command dispatch for `help`, `clear`, `history`, `frame`, `zoom`, `pan`, `orbit`, `echo`, and `status`
  - feature-assist descriptor builders and feature-assist prompt rendering
  - global key-routing effects
  - pop-out key-routing effects
  - final JSX composition

Reason:
- the safest `Phase 4` first move is not “all runtime”
- the safest first move is the tightly related transform and content family seam that already shares prompt and session machinery

### Recommended Implementation Order

1. Extract the reference transform and content transform runtime branches into one focused `consoleReferenceContentCommands.ts` module.
2. Keep `handleSubmitCommand(...)` in `ConsoleDock.tsx` as the top-level coordinator, but route the reference/content family slice through the extracted module first.
3. Keep transcript wording and prompt wording byte-equivalent unless a compile-only type adjustment is required.
4. Add focused tests around the extracted family seam before moving sketch or radio.
5. Re-read the remaining `handleSubmitCommand(...)` body after the first extraction and only then decide whether sketch or radio should be the second family move.

If `Phase 4` is split into smaller commits, prefer this order:
- reference/content transform family first
- browser-adjacent content-owner rename handoff in the same family module
- sketch family second
- radio family third
- flat root command cleanup last if still worth doing before `Phase 5`

### Test Plan

Primary regression target:
- keep `src/app/console/ConsoleDock.test.tsx` green after the first runtime-family extraction

Focused confidence areas for the first cut:
- reference transform prompt sessions still open, switch mode, accept values, and return to the correct root
- reference transform delete-latest confirmation still protects previous-session deletes and resumes correctly
- content object transform move/rotate/scale and snap flows still publish the same transcript results
- content-owner rename prompt submission still reports success or failure and returns to the right staged session
- staged reference/content transform actions still preserve the existing viewer bridge and session lifecycle behavior

Recommended new coverage:
- add focused tests for the extracted reference/content runtime module once its public contract is stable
- keep transcript-string assertions anchored on existing wording rather than rewriting expected messages during the extraction

Verification shape:
- targeted `ConsoleDock` Vitest pass
- focused tests for the extracted runtime-family module when added
- full `npm.cmd run build`

Acceptance shape:
- the first moved runtime family no longer lives inline inside `ConsoleDock.tsx`
- `handleSubmitCommand(...)` becomes a thinner coordinator for the extracted reference/content family while still owning the overall submit flow
- sketch, radio, workspace, and flat-root runtime stay behaviorally unchanged until their own later cuts

Important non-goal:
- `Phase 4` is not one giant submit rewrite
- the first implementation cut should not simultaneously extract sketch, radio, workspace, and flat commands just because they are all runtime branches

## [x] `Phase 4.1` - `Complete Reference/Content Runtime Extraction Cleanup`

### Header
`Phase 4.1` should finish the first reference/content runtime extraction so the moved family truly stops living inline inside `ConsoleDock.tsx`.

### Why This Follow-On Exists

- the first `Phase 4` implementation successfully created and routed through `consoleReferenceContentCommands.ts`
- the post-implementation code review also showed that the old inline copies of the same prompt and staged-execute branches still remain in `ConsoleDock.tsx`
- that means the landed seam is directionally right but still has split ownership
- this is not just later shell-thinning:
  - `Phase 4` already promised that the first moved runtime family would no longer live inline inside `ConsoleDock.tsx`
  - `Phase 4.1` exists to finish that same extraction truthfully before `Phase 5`

### Locked Scope

`Phase 4.1` should stay narrow:
- remove the stale inline reference/content prompt branches that were superseded by `tryHandleReferenceContentPromptSubmission(...)`
- remove the stale inline content-owner prompt-action and reference/content staged-execute branches that were superseded by `tryHandleContentOwnerPromptAction(...)` and `tryHandleReferenceContentExecuteAction(...)`
- keep the top-level `handleSubmitCommand(...)` coordinator in `ConsoleDock.tsx`
- keep sketch, radio, workspace, and flat-root runtime exactly where they are for now

Important rule:
- do not widen this cleanup into sketch extraction, radio extraction, workspace cleanup, or generic shell-thinning
- the point is to restore single ownership for the already-moved reference/content family

### Current Live Read

- `ConsoleDock.tsx` now routes the reference/content family through `consoleReferenceContentCommands.ts`
- `Phase 4.1` removed the stale inline prompt-session copies for:
  - `transform.delete-latest.confirm`
  - `reference-transform.axis`
  - `reference-transform.plane`
  - `content.owner.label`
- `Phase 4.1` also removed the stale inline content-owner prompt-action and staged reference/content execute copies so `ConsoleDock.tsx` now leaves that family to the extracted helper module
- the helper module coverage now includes direct runtime tests for prompt submission, staged prompt creation, and staged execute handling instead of only helper-shape checks

### Goals

- finish the first runtime-family extraction honestly
- reduce maintenance drift risk by restoring one source of truth for the reference/content family
- add enough focused coverage that later `Phase 4.2` / `Phase 4.3` follow-ons are optional rather than guaranteed

### Recommended Implementation Order

1. Remove the stale inline prompt-session branches in `ConsoleDock.tsx` that immediately follow the delegated reference/content prompt handler call.
2. Remove the stale inline staged content-owner and reference/content execute branches in `ConsoleDock.tsx` once the delegated helper path is confirmed equivalent.
3. Add direct focused tests for the extracted runtime-family module around:
   - delete-latest confirmation
   - content-owner rename prompting/submission
   - staged reference/content transform execute handling
4. Re-run the targeted console tests and full build before touching `Phase 5`.

If this cleanup proves too large for one safe commit, split it like this:
- `Phase 4.2`
  - prompt-session ownership cleanup plus direct prompt-flow tests
- `Phase 4.3`
  - staged-execute ownership cleanup plus direct runtime-flow tests

Important rule:
- only create `Phase 4.2` / `Phase 4.3` if the code pass genuinely needs that split
- do not pre-fragment the plan if `Phase 4.1` stays reviewable as one cleanup cut

### Test Plan

Primary regression target:
- keep `src/app/console/ConsoleDock.test.tsx` green while the stale inline branches are removed

Focused confidence areas:
- delegated reference/content prompt handling still preserves the current transcript and return-session behavior
- delegated staged reference/content runtime still preserves the existing viewer bridge and transform-session lifecycle
- there is no remaining duplicate live ownership of the same reference/content family inside `ConsoleDock.tsx`
- `consoleReferenceContentCommands.test.ts` grows beyond helper-shape coverage and proves the moved runtime seam directly

Verification shape:
- `npm.cmd test -- consoleReferenceContentCommands ConsoleDock`
- full `npm.cmd run build`

Acceptance shape:
- the first moved reference/content runtime family exists in one place only
- `ConsoleDock.tsx` keeps the shared submit coordinator but no longer owns stale inline copies of that family
- `Phase 5` can start from real shell-thinning work instead of deferred `Phase 4` cleanup

### Implementation Result

- `ConsoleDock.tsx` now delegates the Phase 4 reference/content runtime family without keeping the old inline prompt or staged-execute copies beside it
- `consoleReferenceContentCommands.test.ts` now directly covers delete-latest confirmation, content-owner rename prompting/submission, new assembly/component prompt creation, rename prompt creation, and representative staged execute actions for reference and content transforms
- verification completed with:
  - `npm.cmd test -- consoleReferenceContentCommands ConsoleDock`
  - `npm.cmd run build`

## [x] `Phase 4.2` - `Finish Reference Transform Root Shortcut Cleanup And Coverage`

### Header
`Phase 4.2` should clean up the one remaining reference-transform root shortcut duplicate and add direct focused coverage for the remaining extracted reference-transform helper paths.

### Why This Follow-On Exists

- the broad `Phase 4` / `Phase 4.1` duplicate runtime seam is now gone
- a later code review still found one smaller leftover inline branch in `ConsoleDock.tsx`:
  - the `referenceTransformRoot` `DeleteLatest` fallback that now duplicates `tryHandleReferenceTransformRootShortcut(...)`
- that same review also showed the extracted active reference-transform submit paths still rely mostly on indirect protection instead of direct helper tests
- this is now a narrow seam cleanup, not another large runtime-family extraction

### Locked Scope

`Phase 4.2` should stay intentionally small:
- remove the leftover inline `referenceTransformRoot` delete-latest fallback from `ConsoleDock.tsx`
- keep `tryHandleReferenceTransformRootShortcut(...)` as the only owner for that root shortcut path
- add direct focused tests for:
  - `tryHandleReferenceTransformRootShortcut(...)`
  - `tryHandleActiveReferenceTransformSubmission(...)`

Important rule:
- do not reopen prompt-session cleanup, staged execute cleanup, or generic shell-thinning here
- do not widen this into sketch, radio, workspace, or broader `Phase 5` work

### Current Live Read

- `ConsoleDock.tsx` now calls `tryHandleReferenceTransformRootShortcut(...)` from the extracted runtime module
- the leftover inline `DELETELATEST / DELETE / DEL / D` fallback has been removed so the extracted helper now owns that root shortcut alone
- the extracted active reference-transform helper paths now have direct focused tests in `consoleReferenceContentCommands.test.ts`

### Goals

- restore true single ownership for the reference-transform root delete-latest shortcut
- tighten direct regression coverage around the remaining extracted reference-transform helper seam
- leave `Phase 5` for actual shell thinning rather than small leftover runtime cleanup

### Recommended Implementation Order

1. Remove the leftover inline `referenceTransformRoot` delete-latest fallback from `ConsoleDock.tsx`.
2. Add direct focused tests for `tryHandleReferenceTransformRootShortcut(...)`.
3. Add direct focused tests for `tryHandleActiveReferenceTransformSubmission(...)`.
4. Re-run the targeted console tests and full build before moving on.

### Test Plan

Primary regression target:
- keep `src/app/console/ConsoleDock.test.tsx` green while the final root-shortcut duplicate is removed

Focused confidence areas:
- `tryHandleReferenceTransformRootShortcut(...)` owns the root delete-latest shortcut alone
- `tryHandleActiveReferenceTransformSubmission(...)` preserves current submit, prompt-open, vec3, scalar, and snap behavior
- the extracted reference-transform helper seam is directly tested instead of depending only on `ConsoleDock` integration coverage

Verification shape:
- `npm.cmd test -- consoleReferenceContentCommands ConsoleDock`
- full `npm.cmd run build`

Acceptance shape:
- there is no remaining inline `referenceTransformRoot` delete-latest duplicate in `ConsoleDock.tsx`
- the remaining extracted reference-transform helper paths have direct focused tests
- `Phase 5` starts from shell work, not leftover shortcut cleanup

### Implementation Result

- `ConsoleDock.tsx` no longer keeps the leftover inline `referenceTransformRoot` delete-latest fallback beneath the delegated helper call
- `consoleReferenceContentCommands.test.ts` now directly covers `tryHandleReferenceTransformRootShortcut(...)` plus representative `tryHandleActiveReferenceTransformSubmission(...)` paths for snap entry, vec3 commit, and prompt opening
- verification completed with:
  - `npm.cmd test -- consoleReferenceContentCommands ConsoleDock`
  - `npm.cmd run build`

## [ ] `Phase 5` - `Thin ConsoleDock Composition Shell`

`Phase 5` should finish the reorganization by leaving `ConsoleDock.tsx` as a thin composition layer.

### Why This Final Phase Exists

- after `Phase 2` through `Phase 4.2`, `ConsoleDock.tsx` no longer owns the biggest pure-helper, window-host, or first runtime-family duplication seams
- the file is still very large because it still owns one broad high-level interaction/controller band:
  - guided root entry and rehydration
  - submit dispatch coordination
  - escape/back/cancel stepping
  - transform tab cycling
  - global and pop-out keyboard routing
  - prompt, feature-assist, and sketch-draw sync effects
- that means the file is cleaner, but still reads like a local subsystem instead of a shell entrypoint

Scope:
- keep only high-level store subscriptions, ref wiring, and render composition in the component
- route submission, prompt, and window-host concerns through focused helpers/hooks
- remove stale inline helpers left behind from earlier subphases

### Current Live Read

- the final render shell and window-host composition are already much clearer after `Phase 3`
- the strongest remaining heavy band is now the interaction/controller layer in the middle of `ConsoleDock.tsx`
- the most obvious current clusters are:
  - guided-root, radio-burst, transform-session, and cancel/exit callbacks
  - the large `handleSubmitCommand(...)` coordinator
  - duplicated main-window and pop-out keyboard routing effects
  - sketch-draw idle, feature-assist, and reference-transform prompt sync effects
- this is no longer a good phase for more family-level extraction first; it is now a shell-thinning/controller extraction phase

### Locked Direction

- the first `Phase 5` cut should extract one high-level interaction/controller hook, tentatively `src/app/console/useConsoleInteraction.ts`
- that hook should own the remaining non-windowing, non-render interaction layer:
  - submit coordination
  - guided root/session stepping
  - escape/back/cancel logic
  - tab-cycle transform mode helpers
  - global and pop-out keyboard routing effects
  - prompt/feature/sketch sync effects
- `ConsoleDock.tsx` should keep:
  - store subscriptions that feed rendering
  - refs and focus wiring
  - final docked, floating, list, split-ghost, and pop-out JSX composition
  - consumption of `useConsoleWindowing(...)`

Important rule:
- do not reopen parser, formatter, window-host, or reference/content family extraction here
- do not hide the final console JSX behind an opaque hook
- keep this as shell thinning, not another command-language rewrite

### Implementation Status

- first cut shipped in `src/app/console/useConsoleInteraction.ts`
- that hook now owns:
  - guided-root entry or rehydration helpers
  - radio-choice coordination helpers used by the interaction layer
  - duplicated main-window and pop-out keyboard routing effects
  - prompt, feature-assist, and sketch-draw sync effects
- `Phase 5.1` shipped as the second controller move
- `useConsoleInteraction.ts` now also owns:
  - the submit coordinator
  - escape or cancel stepping
  - transform tab-cycle behavior
  - the remaining interaction callback band that supported those flows
- `ConsoleDock.tsx` now consumes that hook and keeps the final render shell plus the local helper seams it still legitimately supplies
- `Phase 5` stays open only for any final shell-thinning follow-on that is still worth doing after this controller move

### `Phase 5.1` - `Move Submit Coordinator And Remaining Controller Callbacks Into useConsoleInteraction`

`Phase 5.1` is the next explicit slice inside the still-open shell-thinning phase.

Why this follow-on exists:
- the first `Phase 5` cut removed the duplicated keyboard and sync-effect band from `ConsoleDock.tsx`
- the strongest remaining controller weight is now the submit and interaction callback band still living inline in `ConsoleDock.tsx`
- naming that remainder explicitly keeps the next pass honest and avoids pretending the rest of `Phase 5` is just vague cleanup

Locked scope:
- move the still-local controller remainder into `src/app/console/useConsoleInteraction.ts`, specifically:
  - `handleSubmitCommand(...)`
  - `handleEscCancelCommand(...)`
  - staged prompt or staged navigation stepping helpers that only support interaction flow
  - transform tab-cycle helpers
  - the remaining guided-root, cancel or exit, radio-burst, and interaction callbacks that are still owned inline only because the first cut stopped early
- keep in `ConsoleDock.tsx`:
  - store subscriptions that feed rendering
  - refs and focus wiring
  - `useConsoleWindowing(...)` consumption
  - final docked, floating, list, split-ghost, and pop-out JSX composition

Important rule:
- do not widen `Phase 5.1` into a new domain-family extraction
- do not move final render composition out of `ConsoleDock.tsx`
- keep callback contracts truthful; if some helper needs to stay local for now, document that instead of silently broadening the hook API

Acceptance shape:
- `ConsoleDock.tsx` no longer owns `handleSubmitCommand(...)`
- the remaining interaction/controller callback band is primarily owned by `useConsoleInteraction.ts`
- `ConsoleDock.tsx` reads mainly as subscriptions, refs, windowing, and JSX composition

### Current Live Read

- `Phase 5.1` is now shipped
- `useConsoleInteraction.ts` owns the controller band that was still inline at prep time, including:
  - `handleSubmitCommand(...)`
  - `handleEscCancelCommand(...)`
  - transform tab-cycle behavior
  - staged prompt or staged navigation back or cancel helpers
  - the remaining guided-root or cancel or exit or keyboard interaction callbacks that support that flow
- `ConsoleDock.tsx` now reads primarily as:
  - store subscriptions and memoized render data
  - helper seams still shared with the interaction hook
  - `useConsoleWindowing(...)` consumption
  - refs, focus plumbing, and final JSX composition

### Implementation Result

- `src/app/console/useConsoleInteraction.ts` now owns the submit coordinator and the remaining controller callback band that `Phase 5.1` targeted
- `src/app/console/ConsoleDock.tsx` no longer keeps the large inline submit or escape/controller band that made the shell still read like a local subsystem
- verification completed with:
  - `npm.cmd test -- ConsoleDock consoleReferenceContentCommands`
  - `npm.cmd run build`

### Proposed File Target

- `src/app/console/useConsoleInteraction.ts`
  - expand the existing controller hook instead of creating a second interaction hook
  - move the remaining callback band into this file and return the needed render-facing handlers to `ConsoleDock.tsx`

### Recommended Implementation Order

1. Move the callback primitives that the remaining controller band depends on into `useConsoleInteraction.ts` first:
   - `dispatchImmediateShortcut(...)`
   - `clearReferenceTransformPrompt(...)`
   - transform-session cancel or exit helpers
   - staged prompt or staged navigation back or cancel helpers
2. Move `routeConsoleGlobalKey(...)`, `primeSketchDrawStagedRootForTyping(...)`, and the transform tab-cycle helpers into the hook so the remaining handler surface becomes locally coherent there.
3. Move `handleEscCancelCommand(...)` into the hook once its supporting helpers already live beside it.
4. Move `handleSubmitCommand(...)` last in the same pass so it can close over the already-moved controller helpers instead of exploding the hook API with temporary callback refs.
5. Shrink `ConsoleDock.tsx` to:
   - render and store subscriptions
   - refs and focus helpers
   - `useConsoleWindowing(...)` consumption
   - `useConsoleInteraction(...)` consumption
   - final JSX composition

### Explicit Exclusions

- do not reopen parser, formatter, prompt-text, or window-host extraction
- do not move the final docked, floating, list, split-ghost, or pop-out JSX out of `ConsoleDock.tsx`
- do not widen the pass into new command-family extraction work
- do not redesign the existing side-effect callback contracts unless the live code move genuinely requires a narrow helper signature cleanup

### Test Plan

Primary regression target:
- keep `src/app/console/ConsoleDock.test.tsx` green while the callback band moves

Focused confidence areas:
- submit dispatch still preserves prompt, staged, feature-assist, sketch, radio, and flat-command behavior
- escape or back handling still unwinds prompt, staged, and transform states the same way
- transform tab-cycle behavior still works in both reference and content-object transform modes
- main-window and pop-out keyboard routing remain behaviorally identical after the callback owners move behind the hook

Verification:
- `npm.cmd test -- ConsoleDock consoleReferenceContentCommands`
- `npm.cmd run build`

### Proposed File Target

- `src/app/console/useConsoleInteraction.ts`
  - high-level console interaction/controller hook
  - returns render-facing handlers such as:
    - `handleSubmitCommand`
    - `handleEscCancelCommand`
    - `handleGuidedChoiceCycle`
    - `rehydrateGuidedRootSession`
    - focus helpers or focused-input routing callbacks if they are needed by the keyboard effects

Goals:
- make `ConsoleDock.tsx` readable as a shell entrypoint
- keep future console work from defaulting back into one giant file
- leave a stable base for later tests and command-family expansion

### Recommended Implementation Order

1. Define the hook boundary and returned handler surface for a `useConsoleInteraction`-style owner.
2. Move the guided-root, radio-burst, cancel/exit, transform-tab-cycle, and submit coordinator callbacks into that hook.
3. Move the duplicated main-window and pop-out keyboard-routing effects into that same hook without changing behavior.
4. Move the remaining prompt, feature-assist, and sketch-draw sync effects into the hook if they only support interaction/controller flow.
5. Leave final JSX, shared styles, refs, and window-host composition in `ConsoleDock.tsx`.

If this proves too large for one safe cut, split only like this:
- `Phase 5.1`
  - interaction/controller callbacks plus `handleSubmitCommand(...)`
- `Phase 5.2`
  - duplicated keyboard-routing effects plus remaining controller-sync effects

Important rule:
- only split if the live code pass genuinely needs it
- do not pre-fragment the final shell-thinning phase if one reviewable controller extraction is still practical

Acceptance shape:
- `ConsoleDock.tsx` reads as a console composition surface instead of a local subsystem dump
- the file no longer owns the majority of parser, formatter, and command-family internals inline
- the remaining middle-band interaction/controller logic is owned by a dedicated hook instead of sitting inline between render setup and JSX

### Test Plan

Primary regression target:
- keep `src/app/console/ConsoleDock.test.tsx` green through the controller extraction

Focused confidence areas:
- guided root entry/rehydration still behaves the same
- submit, escape, staged stepping, and prompt recovery still behave the same
- main-window and pop-out keyboard routing still match each other
- sketch-draw idle staging and reference-transform prompt sync still stay truthful after the hook move

Verification shape:
- `npm.cmd test -- ConsoleDock consoleReferenceContentCommands`
- full `npm.cmd run build`

### Sequencing Rule

The intended order is:

1. `Phase 1` audits the current file and locks extraction targets
2. `Phase 2` moves pure helpers first
3. `Phase 3` separates window-host behavior
4. `Phase 4` splits the first domain command family seam out of submit dispatch
5. `Phase 4.1` completes the first reference/content runtime extraction if stale inline ownership remains
6. `Phase 4.2` cleans up any leftover reference-transform root shortcut duplication and closes the remaining direct coverage gap if that seam still remains after `Phase 4.1`
7. `Phase 5` finishes by thinning the component shell

Important rule:
- do not start with `handleSubmitCommand(...)` extraction before the pure-helper and host seams are cleaner
- the earliest slices should be the least behaviorally risky ones

### Verification Rule

Each subphase should preserve these behaviors unless the subphase explicitly changes them:

- docked, floating, pop-out, and list console surfaces still render
- staged navigation and prompt sessions still advance and recover correctly
- reference and content transform command flows still commit, cancel, and prompt correctly
- sketch plane and sketch draw command flows still route to their real owner seams
- radio and view commands still publish transcript feedback through the console

Recommended verification shape:
- manual smoke pass for console entry and surface modes after every extraction cut
- targeted tests for newly extracted pure helper modules when practical
- avoid mixing large behavior changes with extraction-only subphases

### Non-Goals

`Console 11` does not include:
- redesigning the console UI
- changing the console command language
- changing the canonical owner seams defined by `[5.1F]` and `[5.1G]`
- adding brand-new console features as part of the extraction work

Important rule:
- if a new command feature is needed, it should usually land as a separate follow-on phase rather than being hidden inside this organization work
