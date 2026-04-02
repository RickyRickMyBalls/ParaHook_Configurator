# Workspace Phase Workspace-7.5-10 - Spaghetti Editor Popout Window Repair

## Doc Header

### Doc History
1. 2026-04-02 15:09: Marked `Workspace 7.5-10` closed after the final live retest succeeded, recording that the surviving popup fix was the cross-window DOM realm repair in `useWorkspaceChildWindow.ts` and `SpaghettiWindowHost.tsx`, that the temporary popup diagnostics and shared debug plumbing were removed from the shipped path during closeout cleanup, and that the attempt-by-attempt history remains preserved in the companion repair ledger
1. 2026-04-02 13:39: Added the companion attempt tracker `Workspace_Repair Attempts Workspace-7.5-10 - Spaghetti Editor Popout Window Repair.md` and locked that ongoing live-fix slices should now be recorded there attempt-by-attempt until the popout path is actually working, after which the surviving truth should be compiled back into this main phase doc
1. 2026-04-02 13:31: Extended the shipped `Phase 3` truth after the relay-retirement follow-up landed in code, recording that `SpaghettiWindowHost.tsx` no longer pre-opens `about:blank` child windows for later claim and now opens `Spaghetti Editor` popouts directly through `useWorkspaceChildWindow(...)` like Browser while `SpaghettiWindowHost.test.tsx` proves the `PO` button mounts visible popout content through the shared hook without the old pending-window relay
1. 2026-04-02 13:00: Extended `Phase 1` research after live retest showed `Spaghetti Editor` popout still opens a blank child window, recording that the strongest remaining suspect is now the spaghetti-specific preopen or claim-pending popup relay in `SpaghettiWindowHost.tsx` because Browser opens its popout directly through `useWorkspaceChildWindow(...)` while Spaghetti still pre-opens `about:blank` and asks the shared hook to claim that pending window later
1. 2026-04-02 12:44: Marked `Phase 3 - Spaghetti Popout Lifecycle Repair` complete after the lifecycle split landed in code, recording that `SpaghettiWindowHost.tsx` now treats real child-window close as editor close while keeping explicit dock as the only path that restores a popped-out editor to an in-app workspace state and clearing detached-slot bookkeeping before close so popout lifecycle truth no longer drifts across the spaghetti and workspace stores
1. 2026-04-02 12:32: Tightened `Phase 3 - Spaghetti Popout Lifecycle Repair` into an implementation-ready slice after `Phase 2` shipped, locking that the next repair target should stay on `SpaghettiWindowHost.tsx`, `separateWindow` placement truth, detached-surface redock truth, and popout activation or close behavior rather than reopening the shared popup boot seam again
1. 2026-04-02 12:27: Marked `Phase 2 - Shared Child-Window Boot Truth` complete after the shared popup hook was hardened in code, recording that `useWorkspaceChildWindow.ts` now re-syncs popup host creation after open and again on popup load so Browser, Console, and Spaghetti all inherit a stronger visible portal-mount path if the real browser replaces the initial popup document shell during boot
1. 2026-04-02 12:14: Tightened `Phase 2 - Shared Child-Window Boot Truth` into an implementation-ready slice after the first popout research passes, locking that the initial repair target should stay on `useWorkspaceChildWindow.ts` and its immediate Browser, Console, and Spaghetti adopters, that popup-specific CSS is not the main first suspect, and that the first implementation cut should prove real child-window host creation plus visible portal mount before widening into spaghetti-only lifecycle cleanup
1. 2026-04-02 12:09: Expanded this `7.5-10` plan from a single research bucket into a fuller multi-phase ladder after the first popout trace, adding shared child-window boot, spaghetti popout lifecycle, and final cross-surface verification phases while updating the top read to reflect the new evidence-backed direction that the first likely implementation target is the shared popup boot seam rather than a spaghetti-only render rewrite
1. 2026-04-02 12:08: Extended `Phase 1 - Popout Owner Path Research` with the next boot-stage findings, confirming that Browser, Console, and Spaghetti all portal directly into the shared child-window host, that popup-specific CSS does not appear to intentionally hide those surfaces once mounted, and that the live dark `about:blank` symptom therefore most likely means the real child-window host or portal commit path is failing before visible surface content ever paints
1. 2026-04-02 12:00: Started `Phase 1 - Popout Owner Path Research`, recording the current live product truth that popping out `Spaghetti Editor` opens a separate browser window that stays on a dark `about:blank` document with no mounted surface content, then tracing the shared child-window boot path plus the spaghetti-specific pre-open or claim relay so the next repair slice can target the real owner seam instead of guessing
1. 2026-04-02 11:44: Added this future phase doc after chat chose to pull `Workspace 7.5-10` forward as the next planning target, carving the larger `Spaghetti Editor` popout repair out of the workspace cleanup stack and locking `Phase 1` as a research-first slice so the current broken popout path can be traced honestly before implementation guesses

### Purpose

Use this phase to repair the `Spaghetti Editor` popout path as a real workspace-owned window mode instead of a half-working follow-on from the floating and split hosts.

The goal is:
- one honest `Spaghetti Editor` popout contract
- one stable owner path for popout open, render, focus, activation, and close behavior
- one repair plan that does not guess at popout semantics before the current seams are fully traced

### Scope

This phase covers:
- `Spaghetti Editor` popout window behavior
- popout lifecycle truth across open, focus, activation, redock or close, and cleanup
- ownership seams between `SpaghettiWindowHost`, AppShell, workspace child-window helpers, and workspace surface actions
- keeping popout behavior aligned with the broader workspace surface model instead of treating it like a one-off compatibility path

This phase does not cover:
- shared split ghost preview work already handled under `Workspace 7.5-8`
- `Spaghetti Editor` presentation-mode truth owned by `Workspace 7.5-9`
- broader Browser or Console popout redesign
- split-versus-floating visual parity polish owned by `Workspace 7.5-11`

## Doc Body

### Summary

`Workspace 7.5-10` is the popout repair follow-on inside the larger `Workspace 7.5` cleanup ladder.

It exists because the `Spaghetti Editor` popout path still reads as broken enough to deserve its own cleanup:
- the live popout behavior is not yet trusted as a first-class workspace mode
- the ownership seam between editor host state, detached surface state, child-window state, and activation or close behavior still needs to be traced cleanly
- trying to implement blind here would risk locking in another compatibility workaround instead of an honest popout contract

So the first step should be research, not immediate implementation:
- trace the real open path
- trace the real render or mount path
- trace focus, activation, and close or return behavior
- identify which parts are salvageable versus which seams are still compatibility-only

Research so far now points at a more specific next direction:
- treat the blank popout as a shared child-window boot or portal-commit failure first
- treat Spaghetti's pre-open or claim relay as the next surface-specific seam after the shared boot path is understood
- keep the final repair honest across Browser, Console, and Spaghetti instead of declaring victory from one mocked popup path
- live retest after `Phase 3` now narrows the strongest remaining spaghetti-specific suspect further: Browser opens its popout directly through the shared child-window hook, while Spaghetti still depends on a pending-window claim relay before portal mount

Final closeout truth:
- live browser retest now confirms `Spaghetti Editor` visibly mounts and stays usable in a real popped-out child window
- the root cause that finally unblocked the live popup was not host creation, portal commit, or layout collapse; it was same-window DOM element assumptions that misclassified child-window descendants as missing across browser realms
- the temporary diagnostics overlay and shared popup debug-event plumbing were useful for diagnosis only and were removed during closeout so the shipped popout path is clean again

### Locked Direction

`Workspace 7.5-10` should be:
- a focused popout repair phase
- a workspace-ownership cleanup for `Spaghetti Editor`
- research-first before code-changing slices are planned

`Workspace 7.5-10` should not be:
- a hidden presentation-mode phase
- a broad multi-window redesign across every surface
- a visual-polish-only task
- a bucket for unrelated AppShell cleanup

### Current Read

Current likely mismatch:
- `Spaghetti Editor` popout behavior exists, but the product truth around who owns the popout lifecycle and how it should rejoin the workspace is still not written down cleanly enough to implement the repair in one shot
- some popout behavior may already be partially shared through workspace child-window and detached-surface helpers, but the exact salvageable seams still need a dedicated pass
- earlier `Workspace 7.5-7` cleanup already clarified split, floating, and popout activation publishing, which means this phase can now focus more honestly on popout ownership and repair instead of re-solving console targeting first
- live repro now says the failure is more basic than editor interaction alone: popping out `Spaghetti Editor` opens a separate browser window titled for the editor, but that child window remains a dark `about:blank` surface with no mounted editor content

Desired invariant:
- opening a `Spaghetti Editor` popout should create one predictable workspace-owned surface state
- the popout should stay interactive and correctly targeted while open
- closing, restoring, or redocking the popout should leave the workspace in one clean, explainable state without ghost ownership or stale window bookkeeping

Current strongest hypothesis:
- the popup browser window opens
- shared child-window setup starts far enough to theme the popup document
- but the real host creation or portal commit does not become visible in live browser conditions
- therefore the first implementation slice should likely target shared popup boot truth before any deeper spaghetti-only subtree change

### Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/useWorkspaceChildWindow.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

### Active Attempt Tracker

- ongoing live repair attempts for the still-broken popup path should now be logged in [Workspace_Repair Attempts Workspace-7.5-10 - Spaghetti Editor Popout Window Repair.md](./docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Repair%20Attempts%20Workspace-7.5-10%20-%20Spaghetti%20Editor%20Popout%20Window%20Repair.md)
- the popout path is now working live, so this main phase doc carries the surviving product truth while the companion attempts file remains the detailed debugging history

### Phase Sections

## [x] Phase 1 - Popout Owner Path Research
### info
Purpose:
- trace the real `Spaghetti Editor` popout seams before any repair slice is planned

Current read:
- the popout path is still broken, but the exact failure shape and ownership boundaries have not yet been written into one clean research surface
- `Workspace 7.5-7` already improved split, floating, and popout activation publishing, so this research can now focus on the remaining popout-specific lifecycle truth

Main work:
- trace the open-popout flow end to end
- identify the real owner files for render, child-window wiring, activation, close, and restore
- separate salvageable shared workspace seams from editor-specific compatibility code
- record the highest-signal verification cases for later repair phases

Done shape:
- the doc names the real popout owner seams
- the doc lists the current failure modes and expected product truth
- the next implementation slice can be planned from evidence instead of guesswork

### Current Product Truth

- live repro from chat: popping out `Spaghetti Editor` opens a separate browser window with the expected title, but the child window stays on a dark `about:blank` document with no visible mounted editor surface
- the user also reports that this broader popout failure is not spaghetti-only in practice; Browser and Console popouts appear broken too, which raises the priority of the shared child-window boot path over any one surface subtree
- the blank popup still appears themed enough to suggest child-window setup is starting, but the actual React surface content never becomes visible in the live popup

### Research Findings

#### Finding 1 - Shared child-window boot is the first likely owner seam

Current traced path:
- `src/app/workspace/useWorkspaceChildWindow.ts` is the shared popup bootstrap seam
- it calls `window.open('', windowName, windowFeatures)`
- it sets child-window title and body styles
- it clones styles from the opener document
- it creates or reuses one marked host element through `ensureChildWindowHost(...)`
- Browser, Console, and Spaghetti all depend on this hook to mount their popout surface through a React portal

Implication:
- because all three surface families reuse this hook, the blank live popup should be treated as a shared child-window boot or mount problem first unless later evidence proves otherwise

#### Finding 2 - Spaghetti adds one extra pre-open or claim relay on top of the shared path

Current traced path:
- `src/app/hosts/SpaghettiWindowHost.tsx` pre-opens a popup through `preopenViewportPopoutWindow(...)`
- that pending popup is stored in `pendingPopoutWindowByViewportIdRef`
- `handleToggleViewportPopout(...)` then either calls `popoutWorkspaceSurface(editorViewportId)` for slotted editors or directly sets `windowMode` to `separateWindow`
- later `SpaghettiPopoutSurfaceHost` calls `useWorkspaceChildWindow(...)` with `claimPendingWindow`
- `claimPendingViewportPopoutWindow(...)` is therefore spaghetti-specific glue on top of the shared popup hook

Implication:
- Browser and Console are the cleaner comparison surfaces because they go more directly through the shared child-window hook
- Spaghetti repair probably still needs this claim relay reviewed, but it should not be assumed to be the first root cause while Browser and Console show the same live symptom

#### Finding 3 - The render owner should already survive older viewport-order drift

Current traced path:
- `SpaghettiWindowHost.tsx` derives detached popout editors from shared workspace `editorSurfacePlacementById` first, then merges ordered viewport state as fallback
- the current detached popup render loop maps `detachedEditorViewportIds`
- it resolves placement plus viewport state just-in-time and renders `SpaghettiPopoutSurfaceHost`

Implication:
- the older “viewport order dropped the popup editor” seam was already explicitly repaired and should not be treated as the default first guess for the current live blank popup

#### Finding 4 - Several earlier popup-specific repairs already landed

Relevant prior shipped work from `docs/CHANGELOG.md`:
- `[748]` popup non-overlay layout override
- `[749]` detached popup render ownership fallback
- `[750]` child-window-native panel and canvas window ownership
- `[751]` popup crash visibility boundary
- `[752]` detached popup host reuse and body preservation

Implication:
- `Phase 1` should explicitly treat those as prior attempted repairs, not open questions
- the next repair slice should start from “what still fails after these landed?” rather than repeating the same theories

#### Finding 5 - Current tests prove mocked popup ownership, not necessarily real-browser popup paint

Current traced evidence:
- `src/app/hosts/SpaghettiWindowHost.test.tsx`, `src/app/console/ConsoleDock.test.tsx`, and Browser popout tests all use mocked `window.open` child-window objects with in-memory `HTMLDocument` instances
- those tests prove the intended portal contract against a mocked popup document
- they do not prove that the same mount path survives a real browser popup lifecycle

Implication:
- one likely gap in the current quality bar is that the automated tests can pass while the live popup still fails in an actual browser child window
- later repair verification should include a real manual popout boot check across Browser, Console, and Spaghetti

#### Finding 6 - No traced popup-specific CSS currently explains a fully blank dark child window by itself

Current traced evidence:
- `src/app/theme/shell/windows.css` gives `SpaghettiPopoutSurface`, `SpaghettiPopoutWindow`, and `SpaghettiPopoutContent` full-width or full-height flex layout
- `src/app/hosts/BrowserDockHost.tsx` portals a simple `BrowserPanel` subtree directly into `browserPopoutHost`
- `src/app/console/ConsoleDock.tsx` portals a simple `ConsoleDock--popoutSurface` subtree directly into `popoutHost`
- `src/app/hosts/SpaghettiWindowHost.tsx` portals the detached editor shell directly into the host returned by `useWorkspaceChildWindow(...)`

Implication:
- once the child-window host exists and the portal subtree commits, the traced CSS does not obviously force the surfaces into invisibility or zero-size layout
- the live black `about:blank` symptom is therefore more likely to mean “host creation or portal commit never becomes visible in the real popup” than “content mounted correctly but popup-only CSS hid it”

#### Finding 7 - Browser and Console are strong control cases because they avoid the spaghetti pre-open relay

Current traced evidence:
- Browser opens its popout directly through `useWorkspaceChildWindow(...)`
- Console also opens directly through `useWorkspaceChildWindow(...)`
- only Spaghetti adds the extra pre-open or claim-pending popup relay before the shared hook claims the child window

Implication:
- if Browser and Console are blank live too, then the first repair target should not assume the spaghetti pre-open relay is the root cause
- the stronger first hypothesis is now:
- `window.open` succeeds
- shared child-window setup begins and darkens the popup document
- but the real host-state or portal-commit path does not become visible in the live child window

#### Finding 8 - Browser and Spaghetti now diverge at the popup-open seam

Current traced evidence:
- `src/app/hosts/BrowserDockHost.tsx` opens its popout by setting `isBrowserPoppedOut` and letting `useWorkspaceChildWindow(...)` own popup creation and host mount directly
- `src/app/hosts/SpaghettiWindowHost.tsx` still calls `preopenViewportPopoutWindow(...)`, stores the raw popup in `pendingPopoutWindowByViewportIdRef`, and only later asks `SpaghettiPopoutSurfaceHost` to claim that pending popup through `claimPendingWindow`
- both surfaces eventually depend on the same shared child-window hook, but Spaghetti alone adds a blank-window preopen or claim handoff before visible portal mount

Implication:
- after the live retest that still shows blank `Spaghetti Editor` popout behavior, the strongest remaining spaghetti-specific suspect is now the pending-window claim relay rather than the shared popup hook by itself
- the next repair should either retire that relay and let Spaghetti open directly through `useWorkspaceChildWindow(...)` like Browser, or add targeted tests that prove the claimed-pending-window path can mount content with the same visible contract as the direct Browser path

### Owner Seams To Carry Forward

- shared popup bootstrap owner: `src/app/workspace/useWorkspaceChildWindow.ts`
- shared action seam for slotted surfaces: `src/app/workspace/workspaceSurfaceActions.ts`
- spaghetti popout open or claim owner: `src/app/hosts/SpaghettiWindowHost.tsx`
- workspace placement truth used to discover detached editor popouts: `src/app/workspace/useWorkspaceStore.ts` plus `src/app/spaghetti/store/useSpaghettiStore.ts`
- comparison adopters for the same shared popup seam:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/console/ConsoleDock.tsx`

### Suggested Next Slice

- keep `Phase 1` open long enough to verify one more concrete shared-popout truth:
- whether the child-window host element is being created in the real popup but the portal content never paints, or whether the host-creation or claim step itself is failing in live browser conditions
- after that, the first implementation slice should likely target the shared child-window boot seam before any spaghetti-only subtree rewrite
- after the latest live retest, the strongest next cut is now:
- compare Browser's direct `useWorkspaceChildWindow(...)` path against Spaghetti's `preopenViewportPopoutWindow(...)` plus `claimPendingWindow` relay
- prefer retiring the spaghetti-specific pending-window relay if no surviving product constraint still requires it
- if proof is needed before implementation, add one focused regression for the claimed-pending-window branch in `useWorkspaceChildWindow.ts` and one `SpaghettiWindowHost` test that exercises the current preopen handoff

### Questions / Decisions

#### [ ] Question 1 - What files actually own `Spaghetti Editor` popout open, mount, activation, and return behavior today?

##### Suggestion
- research first and write the owner path explicitly before planning any code slice

##### Why
- this is the seam most likely to produce another partial fix if we guess
- the popout path likely crosses AppShell, host, workspace action, and child-window layers
- `Phase 1` should make later repair work start from the real owners instead of assumptions

#### [ ] Question 2 - Which parts of the current popout path are reusable shared workspace infrastructure versus spaghetti-only compatibility behavior?

##### Suggestion
- split the findings into:
- shared workspace child-window or detached-surface infrastructure
- spaghetti-specific host or lifecycle code
- legacy compatibility paths that should be retired or bypassed

##### Why
- the repair should reuse honest shared window infrastructure where it already exists
- the phase should avoid turning `Workspace 7.5-10` into a pile of spaghetti-only patches if the deeper seam is actually generic

#### [ ] Question 3 - What exact user-facing popout scenarios must later repair phases verify?

##### Suggestion
- document at least:
- open popout from a live editor
- activate and interact inside the popout
- keep console or workspace targeting correct while the popout is active
- close or return the popout cleanly
- ensure no stale detached surface or child-window bookkeeping remains after cleanup

##### Why
- popout bugs often hide in lifecycle edges rather than only in first render
- capturing the later verification matrix during research will make the actual repair phase much sharper

### Notes To Carry Forward

- treat this as a research-first planning phase, not a disguised implementation slice
- prefer tracing the shipped code path exactly as it exists today over proposing ideal architecture too early
- keep later phases small once the research is done:
- one likely next slice should lock the owner path
- one later slice can repair the broken behavior with focused tests

## [x] Phase 2 - Shared Child-Window Boot Truth
### info
Purpose:
- repair the first shared popup boot seam once `Phase 1` finishes proving where the live child-window host or portal commit actually fails

Current read:
- Browser, Console, and Spaghetti all depend on `useWorkspaceChildWindow.ts`
- live repro suggests the popup document gets opened and themed, but visible mounted surface content never arrives
- that makes the shared child-window boot path the first likely implementation target
- popup-specific CSS now reads as a weak suspect compared with the host creation or portal commit seam
- this slice should therefore stay centered on shared popup boot truth before touching spaghetti-only subtree logic

Main work:
- lock the real host-creation and portal-commit truth for live browser child windows
- fix the shared popup boot seam without widening into surface-specific subtree rewrites first
- keep the repair compatible with Browser, Console, and Spaghetti

Done shape:
- the shared popup host exists reliably in the live child window
- Browser, Console, and Spaghetti can all visibly mount their popout surface into that host
- the blank dark `about:blank` boot symptom is gone at the shared infrastructure level

Shipped outcome:
- `src/app/workspace/useWorkspaceChildWindow.ts` now re-applies shared popup shell setup through one host-sync helper, ensures popup head and body availability more defensively, and re-validates the child-window host both immediately after open and again on popup `load`
- Browser, Console, and Spaghetti now all inherit the same stronger shared popup host recovery path instead of trusting the first popup document shell to stay stable
- `src/app/workspace/useWorkspaceChildWindow.test.tsx` now contains a focused regression that simulates popup document body replacement and proves the shared child-window hook recreates the host and re-mounts visible portal content
- focused Browser, Console, Spaghetti, and AppShell popup-related test suites plus a full build passed against the shared boot fix

Likely files:
- `src/app/workspace/useWorkspaceChildWindow.ts`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`

Implementation boundaries:
- do fix the shared popup open, claim, host-create, and visible portal mount path
- do verify the same fix works for Browser, Console, and Spaghetti
- do not widen this slice into spaghetti panel or canvas runtime rewrites unless the shared boot fix proves insufficient
- do not use this slice to redesign popout lifecycle, docking, or return semantics; those belong in `Phase 3`
- do not treat popup-specific CSS as the first target unless new evidence shows host creation and portal mount are already healthy

Verification target:
- Browser popout opens a real child window and visibly mounts its panel content
- Console popout opens a real child window and visibly mounts its console surface
- Spaghetti popout opens a real child window and visibly mounts its detached editor shell
- the child-window host remains stable across rerender or remount conditions
- no immediate fallback to a dark blank `about:blank` window remains in the live repro

### Questions / Decisions

#### [ ] Question 1 - What exact shared boot seam should this first implementation cut own?

##### Suggestion
- own only the shared child-window boot seam:
- popup open or claim
- host creation or reuse
- visible portal mount into that host

##### Why
- Phase 1 research currently points to that seam as the first shared failure stage
- keeping the first cut there gives the highest chance of fixing Browser, Console, and Spaghetti together

#### [ ] Question 2 - Which adopters should be treated as the minimum confidence set for this slice?

##### Suggestion
- Browser
- Console
- Spaghetti

##### Why
- all three currently depend on the same shared popup hook
- Browser and Console are important control cases because they do not rely on Spaghetti's extra pre-open relay

#### [ ] Question 3 - What counts as enough proof before moving on to `Phase 3`?

##### Suggestion
- the slice should prove:
- the child window opens
- the popup host exists
- visible portal content mounts in that host
- the content survives the first rerender path

##### Why
- `Phase 3` should inherit a trustworthy shared popup substrate instead of debugging lifecycle edges on top of an unproven boot seam

## [x] Phase 3 - Spaghetti Popout Lifecycle Repair
### info
Purpose:
- clean up the remaining spaghetti-specific popout lifecycle seams after the shared child-window boot path is trustworthy again

Current read:
- Spaghetti still layers a pre-open or claim-pending relay on top of the shared popup hook
- even after shared boot repair, that relay and the `separateWindow` lifecycle still needed cleanup around explicit dock versus real child-window close behavior
- this slice should assume the shared popup host can now boot and visibly mount, and focus only on the remaining spaghetti-specific ownership seams that happen after that boot succeeds

Main work:
- review the pre-open or claim relay in `SpaghettiWindowHost.tsx`
- align `separateWindow` placement truth, detached-surface truth, and return-to-workspace behavior
- keep activation and console-target handoff honest while the popout is open

Done shape:
- `Spaghetti Editor` popout open, focus, close, and redock behavior all read as one clean lifecycle
- spaghetti-specific popout ownership no longer depends on brittle compatibility glue beyond what the shared popup seam genuinely needs

Likely files:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/AppShell.test.tsx`

Implementation boundaries:
- do review and simplify the spaghetti-specific pre-open or claim-pending popup relay if it still creates lifecycle drift after `Phase 2`
- do align `separateWindow` state, detached workspace-surface state, and restore or redock behavior
- do keep popout activation and console-target handoff honest while the editor is open in a child window
- do not reopen the shared popup host-boot problem unless new evidence shows `Phase 2` was insufficient
- do not widen into Browser or Console popout redesign
- do not use this slice to finish final manual cross-surface closeout; that remains `Phase 4`

Verification target:
- opening a spaghetti popout from a live editor enters one stable `separateWindow` lifecycle
- the popped-out editor remains interactive and correctly targeted while open
- explicit dock returns the editor to one clean in-app workspace state while real popout-window close closes the editor instead of silently restoring it
- detached-surface bookkeeping and `editorSurfacePlacementById` truth do not drift apart during the popout lifecycle
- AppShell and focused Spaghetti host tests prove the repaired lifecycle path without depending on manual-only confidence

Shipped outcome:
- `SpaghettiWindowHost.tsx` now splits explicit dock from real child-window close, keeping `onBlocked` on the existing dock-back fallback while routing `onClosed` through the editor close path instead of the old restore or redock callback.
- popout close now clears detached-slot bookkeeping before closing the editor, so a popped-out slotted `Spaghetti Editor` no longer leaves stale detached-surface state behind when the child window is dismissed.
- `SpaghettiWindowHost.test.tsx` now proves the new lifecycle truth directly: child-window close closes the editor, detached popout close does not redock it, and the explicit dock button is still the only path that redocks a detached editor into the workspace slot tree.
- `SpaghettiWindowHost.tsx` no longer pre-opens `about:blank` child windows for later claim, so `Spaghetti Editor` now uses the same direct shared child-window opening path as Browser instead of the old pending-popup relay.
- `SpaghettiWindowHost.test.tsx` now also proves the real `PO` button path opens visible `SpaghettiPopoutContent` through the shared hook without any pre-open or claim dependency.
- Focused `SpaghettiWindowHost` tests passed, and `npm.cmd run build` stayed green after the lifecycle split.

### Questions / Decisions

#### [ ] Question 1 - What exact seams does `Phase 3` own now that `Phase 2` is shipped?

##### Suggestion
- own only the spaghetti-specific lifecycle seams:
- pre-open or claim-pending popup relay
- `separateWindow` placement truth
- detached-surface redock or restore behavior
- activation and console-target handoff while the popout is open

##### Why
- those are the highest-signal remaining seams after the shared popup boot path was hardened
- keeping this boundary prevents `Phase 3` from turning back into another generic popup-boot pass

#### [ ] Question 2 - What should count as success for this slice before `Phase 4`?

##### Suggestion
- the slice should prove:
- spaghetti popout opens and stays alive through normal use
- focus and activation stay on the correct editor viewport while popped out
- close or dock-back returns to one consistent workspace state

##### Why
- `Phase 4` should be a verification and closeout phase, not the first time the core lifecycle works

#### [ ] Question 3 - Which state surfaces must remain aligned through the popout lifecycle?

##### Suggestion
- keep these in sync:
- Spaghetti `windowMode === 'separateWindow'`
- workspace `editorSurfacePlacementById`
- workspace `detachedSlotSurfaceById` when the editor came from a slotted surface
- active editor or activation handoff truth used by AppShell and Console

##### Why
- the most likely remaining popout bugs now live in cross-store or cross-owner drift rather than simple popup visibility

## [x] Phase 4 - Popout Verification And Closeout
### info
Purpose:
- verify the repaired popout system through the highest-signal user-facing cases before calling `7.5-10` done

Current read:
- mocked popup tests already prove the intended contract against in-memory documents
- live browser retest now also proves the repaired `Spaghetti Editor` popout visibly mounts and stays usable in a real child window
- the remaining work for this phase was cleanup and closeout, not another repair attempt

Main work:
- add the final focused regressions for shared popup boot plus spaghetti lifecycle repair
- manually verify Browser, Console, and Spaghetti popouts in real browser conditions
- record the final product truth and any still-deferred follow-up seams

Done shape:
- automated tests cover the repaired shared popup boot and spaghetti lifecycle paths
- manual checks confirm Browser, Console, and Spaghetti all visibly mount and behave correctly in real popout windows
- `Workspace 7.5-10` closes with one honest popout contract instead of another partial workaround

Shipped outcome:
- live browser verification confirmed that `Spaghetti Editor` now visibly mounts and remains interactive in a real popped-out child window instead of sitting on a dark `about:blank` shell
- the surviving popup fix is the cross-window-safe element handling in `src/app/workspace/useWorkspaceChildWindow.ts` and `src/app/hosts/SpaghettiWindowHost.tsx`, which stopped child-window hosts and descendants from being misclassified as missing just because they came from a different browser window realm
- the temporary popup diagnostics overlay and shared `onDebugEvent` plumbing used to isolate that bug were removed during closeout, leaving the shipped popout path on the smaller permanent code surface
- focused `SpaghettiWindowHost`, `useWorkspaceChildWindow`, Browser host, and Console popup confidence tests passed, and `npm.cmd run build` stayed green through the cleanup
