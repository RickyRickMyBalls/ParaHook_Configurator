# Workspace Repair Attempts Workspace-7.5-10 - Spaghetti Editor Popout Window Repair

## Doc Header

### Doc History
1. 2026-04-02 15:09: Recorded the successful live `Attempt 7` retest, updating this ledger to capture that the popup now visibly mounts in a real child window and that the final blocker was cross-window DOM realm checks rather than host creation or layout collapse, then noting that the temporary diagnostics overlay and shared popup debug plumbing were removed during closeout while the surviving product truth was compiled back into the main `Workspace 7.5-10` phase doc
1. 2026-04-02 14:54: Recorded the live `Attempt 6` repro result and marked `Attempt 7 - Cross-Window Element Truth Repair` implemented in code, capturing that the popup host already contained committed descendants but every popup box and style still showed `missing`, then recording that both `useWorkspaceChildWindow.ts` and `SpaghettiWindowHost.tsx` now use cross-window-safe element checks instead of same-window `instanceof HTMLElement` assumptions so the next live repro can show real popup descendant measurements
1. 2026-04-02 14:47: Recorded the live `Attempt 5` repro result and marked `Attempt 6 - Host-Descendant Paint And Visibility Diagnostics` implemented in code, capturing that the popup host now clearly contains committed `SpaghettiPopoutSurface` and `SpaghettiPopoutWindow` descendants while the old document-level subtree queries still show `missing`, then recording that `SpaghettiWindowHost.tsx` now measures host-descendant boxes and computed styles directly so the next live repro can distinguish zero-size or hidden paint from a missing subtree
1. 2026-04-02 14:44: Recorded the live `Attempt 4` repro result and marked `Attempt 5 - Portal Commit Truth Diagnostics` implemented in code, capturing that the popup host now reports as live and correctly owned while every real subtree node still shows `missing`, then recording that `SpaghettiWindowHost.tsx` now inspects the popup host directly with `hostChildCount`, `hostHtmlLength`, `hostDiagnostics`, `hostSurface`, and `hostWindow` truth plus delayed re-measure passes and a host `MutationObserver`
1. 2026-04-02 14:42: Recorded the live `Attempt 3` repro result and marked `Attempt 4 - Live Host Connectivity Repair` implemented in code, capturing that the popup diagnostics still showed `phase: portal-render-attempted` while every real subtree node remained `missing`, then recording that `useWorkspaceChildWindow.ts` now validates popup host connectivity and re-creates stale hosts while `SpaghettiWindowHost.tsx` now reports `hostConnected` and `hostOwner` truth plus remounts the portal subtree when the live host identity changes
1. 2026-04-02 14:18: Marked `Attempt 3 - Popup Visible Layout Diagnostics And Repair` implemented in code, recording that `SpaghettiWindowHost.tsx` now measures popup subtree layout boxes for `surface`, `window`, `content`, `body`, and `panel`, that the Spaghetti popout shell got explicit full-size flex reinforcement in both the host markup and `src/app/theme/shell/windows.css`, and that the focused popup confidence suite plus build passed while the next required step is a live repro to read the new measured diagnostics and confirm whether visible popout rendering is restored
1. 2026-04-02 14:07: Recorded the first live `Attempt 2` repro result and prepared `Attempt 3 - Popup Visible Layout Diagnostics And Repair`, locking that the remaining bug is no longer popup boot, host creation, portal entry, or an error-boundary crash because the live diagnostics showed `childWindow: yes`, `host: yes`, `portal: attempted`, and `error: none`, so the next slice should inspect and repair the visible popup subtree layout after portal mount
1. 2026-04-02 14:00: Marked `Attempt 2 - Live Child-Window Mount Diagnostics` implemented in code, recording that `SpaghettiWindowHost.tsx` and `useWorkspaceChildWindow.ts` now emit popup-visible diagnostics for child-window observation, host resolution, portal-render attempt, and error-boundary activation while `SpaghettiWindowHost.test.tsx` proves host-missing, portal-attempted, and subtree-crash diagnostics states, leaving only the manual live repro result to fill in before planning `Attempt 3`
1. 2026-04-02 13:44: Prepared `Attempt 2 - Live Child-Window Mount Diagnostics` as the next implementation-ready slice, locking that the next cut should instrument the real `SpaghettiPopoutSurfaceHost` plus shared child-window path to prove whether the live popup failure happens at host creation, portal mount, or a post-mount subtree crash before more blind popout refactors are attempted
1. 2026-04-02 13:39: Added this dedicated repair-attempt tracker for `Workspace 7.5-10` so each new popout-fix cut can be recorded as a separate attempt with its own hypothesis, implementation slice, verification, and live outcome before the surviving truth is later compiled back into the main phase doc

### Purpose

Use this doc as the running attempt ledger for the still-broken `Spaghetti Editor` popout path.

This doc exists to:
- keep each repair attempt separate and readable
- record what hypothesis each attempt tested
- record whether the attempt helped, failed, or only changed the shape of the bug
- prevent the main `Workspace 7.5-10` phase doc from turning into a noisy attempt-by-attempt scratchpad

When the popout path is finally working:
- compile the surviving product truth back into `Workspace_Phase Workspace-7.5-10 - Spaghetti Editor Popout Window Repair.md`
- keep this file as the attempt history instead of folding every failed step into the main phase narrative

## Doc Body

### Working Rules

- every new repair cut gets one new topmost `Attempt` section
- each attempt should record:
- the hypothesis
- the intended fix
- what was actually changed
- what tests passed
- what the live result was
- whether the next attempt should continue, revert, or pivot
- do not rewrite older attempts after later attempts land unless the user explicitly asks for cleanup

### Status

Current state:
- the shared popup hook has been hardened
- spaghetti lifecycle close versus dock truth has been cleaned up
- the spaghetti pending-popup relay has been retired
- live `Spaghetti Editor` popout now visibly works in a real child window

Current working assumption:
- the final blocker was cross-window DOM realm handling, not popup boot, portal commit, or layout collapse
- this ledger is now preserved as the debugging history while the main phase doc carries the surviving product truth

### Attempt Ledger

## Attempt 7 - Cross-Window Element Truth Repair

Date:
- 2026-04-02

Status:
- shipped and confirmed live

Hypothesis:
- the popup subtree is already committed, but the diagnostics still report popup descendants as `missing` because they are checking child-window DOM nodes with same-window element assumptions that fail across browser window realms

Goal:
- make popup diagnostics and shared popup host checks treat cross-window DOM nodes as real elements so the next live repro reports honest popup boxes and styles instead of false `missing` values

Implementation slice:
- replace same-window element assumptions in:
- `src/app/workspace/useWorkspaceChildWindow.ts`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- use cross-window-safe node-shape plus owning-window checks when a popup `defaultView` exists
- keep a safe fallback for the current mocked popup documents used in jsdom tests

Verification:
- `npm.cmd test -- --run src/app/hosts/SpaghettiWindowHost.test.tsx src/app/workspace/useWorkspaceChildWindow.test.tsx src/app/hosts/BrowserDockHost.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`

Implemented repair:
- `SpaghettiWindowHost.tsx` now recognizes popup descendants from the child window as measurable elements instead of treating them as missing because they came from another DOM realm
- `useWorkspaceChildWindow.ts` now uses the same cross-window-safe element logic for shared host validation and cloned style bookkeeping
- both files now fall back safely when a mocked popup document does not expose a real child-window `defaultView`

Current result:
- focused popup confidence tests passed
- build passed
- live browser repro succeeded and the popped-out `Spaghetti Editor` visibly mounted real content in the child window
- the final live diagnostics showed real `surface`, `window`, `content`, `body`, and `panel` boxes, confirming that the popup subtree had always been there and that the last blocker was the cross-window element checks used to inspect and validate child-window descendants
- the temporary popup diagnostics overlay and shared popup debug-event plumbing were then removed during closeout, leaving the cross-window-safe host and descendant checks as the surviving shipped repair

## Attempt 6 - Host-Descendant Paint And Visibility Diagnostics

Date:
- 2026-04-02

Status:
- implemented, awaiting live repro result

Hypothesis:
- the popup host already contains the committed Spaghetti subtree, but that subtree may still be visually unusable because the committed host descendants are zero-sized, clipped, transparent, or otherwise styled out in the real browser popup

Goal:
- measure the committed host descendants directly and capture their computed visibility or layout truth so the next live popup repro can tell us whether the subtree is present-but-invisible and why

Implementation slice:
- extend `src/app/hosts/SpaghettiWindowHost.tsx` diagnostics with direct host-descendant measurements for:
- `hostSurfaceBox`
- `hostWindowBox`
- `hostContentBox`
- `hostBodyBox`
- `hostPanelBox`
- also report a compact computed-style summary for the committed popup window and content nodes:
- `hostWindowStyle`
- `hostContentStyle`
- keep the existing host commit counters and document-level subtree checks so the next live repro can compare “host says committed” against “document query still says missing”
- keep the same delayed re-measure passes and host mutation observer while this remains a diagnostics-first slice

Boundaries:
- do not widen into speculative CSS rewrites yet; the next live repro should decide whether the remaining problem is size, visibility, opacity, or a more specific paint layer issue
- do not remove the existing diagnostics because the comparison between host-descendant truth and document-level truth is now part of the diagnosis

Verification:
- `npm.cmd test -- --run src/app/hosts/SpaghettiWindowHost.test.tsx src/app/workspace/useWorkspaceChildWindow.test.tsx src/app/hosts/BrowserDockHost.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`

Implemented diagnostics:
- `SpaghettiWindowHost.tsx` now reports direct host-descendant boxes for the committed popup `surface`, `window`, `content`, `body`, and `panel` nodes
- `SpaghettiWindowHost.tsx` now reports direct computed-style summaries for the committed popup window and content nodes
- host-missing transitions now clear those host-descendant boxes and styles back to `missing`
- `SpaghettiWindowHost.test.tsx` now proves the host-missing path reports missing host-descendant boxes and the normal popup path reports non-missing host descendant boxes and styles

Current result:
- focused popup confidence tests passed
- build passed
- live repro showed:
- `phase: portal-render-attempted`
- `childWindow: yes`
- `host: yes`
- `hostConnected: yes`
- `hostOwner: matches`
- `hostChildCount: 1`
- `hostHtmlLength: 15442`
- `hostDiagnostics: yes`
- `hostSurface: yes`
- `hostWindow: yes`
- `hostSurfaceBox: missing`
- `hostWindowBox: missing`
- `hostContentBox: missing`
- `hostBodyBox: missing`
- `hostPanelBox: missing`
- `hostWindowStyle: missing`
- `hostContentStyle: missing`
- that meant the popup host already contained the committed subtree, but the diagnostics still could not recognize those popup descendants as real measurable elements, which pointed directly at a cross-window element identity bug instead of a true visibility or paint failure

## Attempt 5 - Portal Commit Truth Diagnostics

Date:
- 2026-04-02

Status:
- implemented, awaiting live repro result

Hypothesis:
- the popup host is now live, connected, and correctly owned, but we still do not know whether React is ever committing children into that host or whether the current document-level diagnostics are simply missing already-committed host descendants

Goal:
- inspect the popup host directly so the next live repro can prove whether the host ever receives portal children and whether those children include the expected surface or window descendants

Implementation slice:
- extend `src/app/hosts/SpaghettiWindowHost.tsx` diagnostics to report direct host commit truth:
- `hostChildCount`
- `hostHtmlLength`
- `hostDiagnostics`
- `hostSurface`
- `hostWindow`
- keep the existing document-level subtree measurements, but add delayed re-measure passes after portal render and a host `MutationObserver` so the diagnostics update if portal children arrive slightly later than the first layout pass
- keep the diagnostics overlay in place and continue treating this as an investigation slice, not the final repair

Boundaries:
- do not reopen popup boot or host-connectivity repair unless the new host-level diagnostics contradict `Attempt 4`
- do not remove or consolidate the existing diagnostics yet because the next live repro still needs all of these signals at once
- do not widen into canvas or panel-specific paint fixes until host commit truth is proven

Verification:
- `npm.cmd test -- --run src/app/hosts/SpaghettiWindowHost.test.tsx src/app/workspace/useWorkspaceChildWindow.test.tsx src/app/hosts/BrowserDockHost.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`

Implemented diagnostics:
- `SpaghettiWindowHost.tsx` now tracks direct popup host state:
- host child element count
- host inner HTML length
- whether the host contains `.SpaghettiPopoutDiagnostics`
- whether the host contains `.SpaghettiPopoutSurface`
- whether the host contains `.SpaghettiPopoutWindow`
- host-missing transitions now clear those host-commit counters and descendant flags back to empty truth
- the popup diagnostics pass now re-checks on immediate timeout, delayed timeouts, `requestAnimationFrame`, and host mutations so the next live repro is less likely to miss a late portal commit
- `SpaghettiWindowHost.test.tsx` now proves the diagnostics show empty host truth when the host is missing and surface or window host descendants when the normal popup path renders

Current result:
- focused popup confidence tests passed
- build passed
- live repro showed:
- `phase: portal-render-attempted`
- `childWindow: yes`
- `host: yes`
- `hostConnected: yes`
- `hostOwner: matches`
- `hostChildCount: 1`
- `hostHtmlLength: 15207`
- `hostDiagnostics: yes`
- `hostSurface: yes`
- `hostWindow: yes`
- `portal: attempted`
- `error: none`
- `surface: missing`
- `window: missing`
- `content: missing`
- `body: missing`
- `panel: missing`
- that means the popup host definitely contains the committed subtree, so the remaining bug is no longer portal commit; it is now about direct committed-subtree visibility, size, or paint truth

## Attempt 4 - Live Host Connectivity Repair

Date:
- 2026-04-02

Status:
- implemented, awaiting live repro result

Hypothesis:
- the shared child-window hook can still hold or report a popup host that is no longer attached to the live popup document, which leaves the diagnostics overlay visible in the child window while the real `SpaghettiPopoutSurface` subtree never lands there

Goal:
- make the shared popup hook return only a live attached host, recover stale hosts automatically, and expose current host-connectivity truth directly in the popup diagnostics

Implementation slice:
- harden `src/app/workspace/useWorkspaceChildWindow.ts` so popup host recovery validates:
- `host.isConnected`
- `host.ownerDocument === childWindow.document`
- `childWindow.document.body.contains(host)`
- if any of those fail, clear the stale host and recreate a fresh marked host in the live popup document
- add short follow-up host revalidation passes after popup open or reuse so a late document swap can still recover without waiting forever on popup `load`
- extend `src/app/hosts/SpaghettiWindowHost.tsx` popup diagnostics with:
- `hostConnected`
- `hostOwner`
- ensure host-missing transitions clear stale `host` and `portal` truth instead of leaving previous `yes` or `attempted` flags on screen
- remount the portal subtree when the live host identity changes so a recovered host gets a clean React subtree

Boundaries:
- keep this slice on shared popup host validity plus the Spaghetti popup diagnostics surface
- do not remove the diagnostics yet because the next live repro still needs to confirm the real child-window outcome
- do not widen into Browser or Console UI changes beyond inheriting the shared host-validity fix

Verification:
- `npm.cmd test -- --run src/app/hosts/SpaghettiWindowHost.test.tsx src/app/workspace/useWorkspaceChildWindow.test.tsx src/app/hosts/BrowserDockHost.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`

Implemented repair:
- `useWorkspaceChildWindow.ts` now validates whether a candidate popup host is actually usable in the live child window before reusing it
- the shared hook now clears stale host references, recreates the host when needed, and schedules multiple short revalidation passes after popup open or reuse to catch late popup document swaps
- `SpaghettiWindowHost.tsx` now reports `hostConnected` and `hostOwner` truth in the popup diagnostics overlay
- `SpaghettiWindowHost.tsx` now clears stale host-resolved and portal-attempted truth when the host goes missing
- the popup portal subtree now remounts when the live host identity changes so a recovered host gets a fresh render target

Current result:
- focused popup confidence tests passed
- build passed
- live repro showed:
- `phase: portal-render-attempted`
- `childWindow: yes`
- `host: yes`
- `hostConnected: yes`
- `hostOwner: matches`
- `portal: attempted`
- `error: none`
- `surface: missing`
- `window: missing`
- `content: missing`
- `body: missing`
- `panel: missing`
- that means the stale-host theory was ruled out, but the popup still gave us no direct proof yet about whether children were ever committed into the live host itself

## Attempt 2 - Live Child-Window Mount Diagnostics

Date:
- 2026-04-02

Status:
- implemented, awaiting live repro result

Hypothesis:
- popup open is now succeeding, but the remaining live failure happens in one of three places:
- the child-window host is never becoming usable in the real popup
- the host exists but the Spaghetti portal subtree never mounts into it
- the subtree mounts and then crashes or tears down in live browser conditions

Goal:
- make the next code cut prove exactly which stage fails in the real popout path so the follow-up fix is based on live mount truth instead of more speculative refactors

Implementation slice:
- instrument `SpaghettiPopoutSurfaceHost` in `src/app/hosts/SpaghettiWindowHost.tsx` with temporary, high-signal diagnostics around:
- child window availability
- non-null `host` availability
- portal render attempt
- popout error-boundary activation
- instrument `useWorkspaceChildWindow(...)` in `src/app/workspace/useWorkspaceChildWindow.ts` with temporary diagnostics that make it obvious whether the live popup got:
- the document shell setup
- the marked host element
- any later load or resync pass
- keep the diagnostics scoped to Spaghetti popout debugging rather than widening into a permanent logging system
- prefer debug-visible in-app or console evidence that can be manually checked during a live popout attempt

Boundaries:
- do not change persisted state shape
- do not reopen Browser or Console behavior unless the diagnostics prove the shared hook is still failing there too
- do not treat this attempt as the final fix; this slice exists to lock the real failure stage

Success criteria:
- after one live popout attempt, we can answer all of these concretely:
- did `useWorkspaceChildWindow(...)` create or recover the marked host in the popup?
- did `SpaghettiPopoutSurfaceHost` receive a non-null `host`?
- did the Spaghetti portal subtree attempt to render?
- did `SpaghettiPopoutErrorBoundary` catch a real runtime error?
- did the popup stay blank because the subtree never mounted, or because it mounted and then failed?

Likely files:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/useWorkspaceChildWindow.ts`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

Verification:
- keep the current popup confidence tests green:
- `npm.cmd test -- --run src/app/hosts/SpaghettiWindowHost.test.tsx src/app/workspace/useWorkspaceChildWindow.test.tsx src/app/hosts/BrowserDockHost.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`
- then do one live Spaghetti popout repro and record:
- what diagnostics appeared
- whether the popup host existed
- whether the error boundary fired
- whether the popup ever received visible `SpaghettiPopoutContent`

Implemented diagnostics:
- popup-visible `SpaghettiPopoutDiagnostics` now renders inside the child window and reports:
- phase
- child-window observed truth
- host-resolved truth
- portal-render-attempted truth
- error-boundary truth
- last diagnostic message
- `useWorkspaceChildWindow.ts` now emits internal debug events for popup open or reuse, shell sync, host ready, load resync, blocked, and closed states
- `SpaghettiWindowHost.test.tsx` now proves:
- host missing renders the diagnostics marker in the popup body
- normal popout path reaches the portal-render-attempted state
- forced popup subtree crash flips diagnostics into the error-boundary state

Current result:
- automated tests passed
- build passed
- live popup diagnostics showed:
- `childWindow: yes`
- `host: yes`
- `portal: attempted`
- `error: none`
- the popup still looked black or visually empty in spite of that

Expected output:
- one clean diagnosis statement that says the remaining bug is:
- host creation
- portal mount
- subtree crash
- or some other now-proven stage

Next-step rule:
- once Attempt 2 identifies the real failure stage, create `Attempt 3` as the actual targeted repair for that stage rather than continuing broad popout cleanup
- if Attempt 2 unexpectedly shows the popup works live, record that immediately and move back toward final `Phase 4` closeout

What Attempt 2 now proves:
- the remaining bug is not popup open
- it is not shared host creation
- it is not the portal entry path
- it is not an error-boundary-visible subtree crash
- the remaining bug is now most likely a visible-layout or rendered-subtree measurement problem after portal mount starts

## Attempt 3 - Popup Visible Layout Diagnostics And Repair

Date:
- 2026-04-02

Status:
- implemented, awaiting live repro result

Hypothesis:
- the Spaghetti popup subtree is mounting far enough to reach the portal path, but one or more rendered elements are ending up effectively invisible, zero-sized, clipped, or otherwise non-visible in the live child window

Goal:
- prove which popup subtree elements actually exist live and what their measured dimensions are, then repair the collapsing or non-visible layout node so the popped-out editor becomes visibly usable

Implementation slice:
- extend the popup-visible diagnostics in `src/app/hosts/SpaghettiWindowHost.tsx` so they also report live existence and measured dimensions for:
- `.SpaghettiPopoutSurface`
- `.SpaghettiPopoutWindow`
- `.SpaghettiPopoutContent`
- `.SpaghettiFloatingBody`
- if helpful, also report whether `.MockSpaghettiPanel` or the real `SpaghettiPanel` root exists in the popup DOM
- compare the live popup structure against the simpler Browser popup subtree in `src/app/hosts/BrowserDockHost.tsx`
- inspect `src/app/theme/shell/windows.css` and the popup shell wrappers to find the first collapsing or non-visible node
- repair only the layout or visibility node that is preventing the mounted Spaghetti subtree from becoming visible in the child window

Boundaries:
- do not reopen popup boot or host-creation work unless new live evidence contradicts Attempt 2
- do not remove the diagnostics yet; they should stay until the popup is visibly working
- do not widen into presentation-mode cleanup or unrelated floating-window polish

Success criteria:
- one live repro can answer:
- which popup subtree nodes exist
- which nodes have zero or unexpected size
- whether the Spaghetti content root is present but hidden or clipped
- after the repair, the popped-out Spaghetti editor is visibly rendered in the child window

Likely files:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/theme/shell/windows.css`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

Verification:
- keep the current popup confidence set green:
- `npm.cmd test -- --run src/app/hosts/SpaghettiWindowHost.test.tsx src/app/workspace/useWorkspaceChildWindow.test.tsx src/app/hosts/BrowserDockHost.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`
- live repro must show:
- popup diagnostics with measured popup subtree nodes
- visible Spaghetti popup content after the repair lands

Implemented repair:
- `SpaghettiWindowHost.tsx` now extends `SpaghettiPopoutDiagnostics` with measured popup subtree boxes for:
- `.SpaghettiPopoutSurface`
- `.SpaghettiPopoutWindow`
- `.SpaghettiPopoutContent`
- `.SpaghettiFloatingBody`
- `.SpaghettiPanelRoot` or `.MockSpaghettiPanel`
- when the popup body exists but the shared host is still missing, those measurements now report `missing` immediately instead of staying stuck at a misleading `pending` state
- the detached Spaghetti popout wrappers now carry explicit full-size flex styles in markup so the popup content shell can occupy the full child-window area even if inherited shell rules were not enough in live browser conditions
- `src/app/theme/shell/windows.css` now reinforces `.SpaghettiPopoutWindow` and `.SpaghettiPopoutContent` with full-size flex layout rules so the mounted subtree has a clearer visible layout contract in the child window
- `SpaghettiWindowHost.test.tsx` now proves the new diagnostics surface reports host-missing layout truth, non-missing popup subtree measurements on the normal portal path, and `panel: missing` when a forced popup subtree crash occurs

Current result:
- focused popup confidence tests passed
- build passed
- live repro showed:
- `phase: portal-render-attempted`
- `childWindow: yes`
- `host: yes`
- `portal: attempted`
- `error: none`
- `surface: missing`
- `window: missing`
- `content: missing`
- `body: missing`
- `panel: missing`
- that means the popup diagnostics overlay was visible, but the real popup subtree still never appeared in the live child document

Next-step rule:
- if Attempt 3 restores visible popout rendering, record the surviving truth here and then compile it back into the main `7.5-10` phase doc for closeout planning
- if Attempt 3 proves the subtree exists and has expected size but is still black, the next attempt should pivot from layout to canvas or panel paint-specific diagnostics

## Attempt 1 - Relay Retirement

Date:
- 2026-04-02

Hypothesis:
- the blank popout was caused by the spaghetti-only `preopenViewportPopoutWindow(...)` plus `claimPendingWindow` relay
- removing that relay and opening directly through `useWorkspaceChildWindow(...)` like Browser would allow visible child-window mount

Implementation slice:
- retire the pending popup ref and preopen helpers in `SpaghettiWindowHost.tsx`
- let `SpaghettiPopoutSurfaceHost` open directly through the shared child-window hook
- keep the existing `Phase 3` close versus dock lifecycle truth unchanged

Verification:
- `npm.cmd test -- --run src/app/hosts/SpaghettiWindowHost.test.tsx src/app/workspace/useWorkspaceChildWindow.test.tsx src/app/hosts/BrowserDockHost.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`
- focused regression added for the real `PO` button path mounting visible `SpaghettiPopoutContent` through the shared hook

Result:
- automated tests passed
- build passed
- live user retest still reports that `Spaghetti Editor` popout does not work

What this means:
- the old pending-popup relay was a reasonable suspect, but it was not the full remaining root cause
- the next attempt should diagnose the live child-window mount path more directly instead of continuing blind refactors

Next-attempt direction:
- inspect whether the popup host exists live
- inspect whether `SpaghettiPopoutSurfaceHost` receives a real host but the portal subtree crashes or never paints
- compare the live popup subtree path against Browser's simpler popout subtree if Browser still works
