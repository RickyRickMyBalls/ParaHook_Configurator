# Calandar

<details open>
<summary>Doc Header</summary>

### Purpose

This page is the visual work log for ParaHook.

Use it to:
- summarize the main day-to-day and week-to-week work without dumping every `CHANGELOG.md` entry
- show the major phase color for each day so longer runs are visible at a glance
- keep a cleaner, more visual front-door history than the full permanent changelog

Do not use it for:
- canonical implementation detail
- exhaustive command-by-command history
- replacing `CHANGELOG.md`

### How To Update This Page

- keep each day summary short, ideally `2-6` words
- summarize the main chunk of work for that day, not every micro-fix
- reuse the same phase color across neighboring days when the work stayed in the same lane
- when a day is active, mirror the exact landed phase titles from `CHANGELOG.md` inside that day's details block
- add a new month section when a month gets active enough to deserve its own grid
- let `CHANGELOG.md` stay detailed and permanent while this page stays visual and curated

</details>

## Color Key

<div class="calendar-legend">
  <span class="calendar-chip phase-browser">Browser polish</span>
  <span class="calendar-chip phase-transform">Transform parity</span>
  <span class="calendar-chip phase-workspace-foundation">Workspace foundations</span>
  <span class="calendar-chip phase-split-polish">Split and dock polish</span>
  <span class="calendar-chip phase-parity">Multi-surface parity</span>
  <span class="calendar-chip phase-build-fix">Build and cleanup</span>
</div>

## Recent Weekly Read

<div class="calendar-week-strip">
  <div class="calendar-week-card phase-workspace-foundation">
    <strong>May 1</strong>
    <p>Edit History parity expanded through child restore points, node create/delete history, and timeline grouping before Spaghetti overlay O-mode groundwork opened.</p>
  </div>
  <div class="calendar-week-card phase-workspace-foundation">
    <strong>May 2</strong>
    <p>Spaghetti overlay ownership, Settings shell/defaults, left-dock cleanup, viewport chrome, and Nodes-6 resizing all landed in one dense editor sprint.</p>
  </div>
  <div class="calendar-week-card phase-build-fix">
    <strong>May 5</strong>
    <p>Cleanup Gen3 extraction took over with App root facades, browser policy slices, transform ownership, history adapters, and sketch session seams.</p>
  </div>
  <div class="calendar-week-card phase-split-polish">
    <strong>May 9</strong>
    <p>Workspace-9 turned corner split gestures into a real resize lane with radius settings, continuity proof, and restore toggles.</p>
  </div>
  <div class="calendar-week-card phase-workspace-foundation">
    <strong>May 10</strong>
    <p>Properties and Materials became the main runway, from workspace mounting and section tabs into material targets, presets, compact controls, and multi-object assignment.</p>
  </div>
  <div class="calendar-week-card phase-workspace-foundation">
    <strong>May 11</strong>
    <p>Materials mixed-value editing, shared workspace shells, Settings input priority, and Model Viewport display/render-preview phases all landed in one major sweep.</p>
  </div>
  <div class="calendar-week-card phase-workspace-foundation">
    <strong>May 12</strong>
    <p>Settings-2 opened the Key Bindings lane with shortcut source mapping, normalized preset reads, a dedicated section route, and grouped shortcut rendering.</p>
  </div>
</div>

## April 2026

<details class="calendar-month" open>
<summary>April 2026</summary>

<div class="month-shell">
  <div class="month-header">
    <div>
      <h3>April 2026</h3>
      <p>From Workspace 7.5 parity closeout into dashboard, worker vision, output preview, cleanup, view-toolbar camera and gizmo work, staged import and environment sprint, then Edit History workspace scrubbing and MkDocs cleanup to close the month.</p>
    </div>
  </div>

  <div class="month-grid">
    <div class="weekday">Sun</div>
    <div class="weekday">Mon</div>
    <div class="weekday">Tue</div>
    <div class="weekday">Wed</div>
    <div class="weekday">Thu</div>
    <div class="weekday">Fri</div>
    <div class="weekday">Sat</div>

    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day phase-parity" data-target="april-1">
      <div class="day-head"><div class="day-number">1</div><div class="day-title">Parity</div></div>
      <ul class="day-bullets">
        <li>7.5-3 to 7.5-5 pass</li>
        <li>Host parity</li>
        <li>Graph composition and build green</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+12505</span> <span class="day-diff-minus">-1957</span></div>
      <div class="day-tag">Multi-surface parity</div>
    </div>
    <div class="day phase-split-polish" data-target="april-2">
      <div class="day-head"><div class="day-number">2</div><div class="day-title">Popouts</div></div>
      <ul class="day-bullets">
        <li>7.5-7 closeout</li>
        <li>Spaghetti browser popout</li>
        <li>Popup-local shell adoption</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+11237</span> <span class="day-diff-minus">-879</span></div>
      <div class="day-tag">Split and popout polish</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="april-3">
      <div class="day-head"><div class="day-number">3</div><div class="day-title">Shell Refactor</div></div>
      <ul class="day-bullets">
        <li>Console refactor</li>
        <li>AppShell extraction</li>
        <li>Workspace cleanup</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+27695</span> <span class="day-diff-minus">-9199</span></div>
      <div class="day-tag">App shell and console foundation</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="april-4">
      <div class="day-head"><div class="day-number">4</div><div class="day-title">Dashboard</div></div>
      <ul class="day-bullets">
        <li>Dashboard workspace</li>
        <li>Sticky notes and lanes</li>
        <li>Notepad host and persistence</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+18282</span> <span class="day-diff-minus">-580</span></div>
      <div class="day-tag">Dashboard workspace launch</div>
    </div>

    <div class="day phase-transform" data-target="april-5">
      <div class="day-head"><div class="day-number">5</div><div class="day-title">Extrude</div></div>
      <ul class="day-bullets">
        <li>Extrude surface pass</li>
        <li>Structured wire rows</li>
        <li>Preview and contract cleanup</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+14691</span> <span class="day-diff-minus">-1804</span></div>
      <div class="day-tag">Extrude and node contract pass</div>
    </div>
    <div class="day phase-build-fix" data-target="april-6">
      <div class="day-head"><div class="day-number">6</div><div class="day-title">B-Rep Audit</div></div>
      <ul class="day-bullets">
        <li>B-rep reality check</li>
        <li>Docs and package reset</li>
        <li>Camera and extrude cleanup</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+6481</span> <span class="day-diff-minus">-560</span></div>
      <div class="day-tag">B-rep reality check</div>
    </div>
    <div class="day phase-parity" data-target="april-7">
      <div class="day-head"><div class="day-number">7</div><div class="day-title">Authoritative</div></div>
      <ul class="day-bullets">
        <li>Authoritative viewport path</li>
        <li>Sketch wire-to-face lowering</li>
        <li>Export prep and OC boot</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+10229</span> <span class="day-diff-minus">-655</span></div>
      <div class="day-tag">Authoritative viewport path</div>
    </div>
    <div class="day phase-build-fix" data-target="april-8">
      <div class="day-head"><div class="day-number">8</div><div class="day-title">Handoff</div></div>
      <ul class="day-bullets">
        <li>Extrude 4 handoff</li>
        <li>Closed-profile selection contract</li>
        <li>Compile/runtime routing draft</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+1426</span> <span class="day-diff-minus">-322</span></div>
      <div class="day-tag">Working tree handoff</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="april-9">
      <div class="day-head"><div class="day-number">9</div><div class="day-title">Inspector</div></div>
      <ul class="day-bullets">
        <li>Runtime inspector</li>
        <li>Worker vision 1-3</li>
        <li>Extrude closeout</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+12197</span> <span class="day-diff-minus">-487</span></div>
      <div class="day-tag">Worker and runtime inspector</div>
    </div>
    <div class="day phase-parity" data-target="april-10">
      <div class="day-head"><div class="day-number">10</div><div class="day-title">Worker Vision</div></div>
      <ul class="day-bullets">
        <li>Worker vision 3</li>
        <li>Extrude collection rows</li>
        <li>Build and policy cleanup</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+26428</span> <span class="day-diff-minus">-699</span></div>
      <div class="day-tag">Worker preview and node parity</div>
    </div>
    <div class="day phase-transform" data-target="april-11">
      <div class="day-head"><div class="day-number">11</div><div class="day-title">Output Preview</div></div>
      <ul class="day-bullets">
        <li>OutputPreview 1</li>
        <li>Managed IO shells</li>
        <li>Extrude row convergence</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Output preview surface buildout</div>
    </div>

    <div class="day phase-build-fix" data-target="april-12">
      <div class="day-head"><div class="day-number">12</div><div class="day-title">Cleanup Sprint</div></div>
      <ul class="day-bullets">
        <li>OutputPreview 6.2-6c</li>
        <li>Bug 18 repair</li>
        <li>Cleanup 1-5 passes</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+26593</span> <span class="day-diff-minus">-2720</span></div>
      <div class="day-tag">Cleanup and proof sprint</div>
    </div>
    <div class="day phase-build-fix" data-target="april-13">
      <div class="day-head"><div class="day-number">13</div><div class="day-title">Cleanup Closeout</div></div>
      <ul class="day-bullets">
        <li>Cleanup 6-7</li>
        <li>Accepted-result narrowing</li>
        <li>Console command seam</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Cleanup closeout</div>
    </div>
    <div class="day phase-parity" data-target="april-14">
      <div class="day-head"><div class="day-number">14</div><div class="day-title">Gizmo & Fly</div></div>
      <ul class="day-bullets">
        <li>View Toolbar 5 and 5.1</li>
        <li>Gizmo 2-3 sweep</li>
        <li>Fly camera and worker fixes</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+19794</span> <span class="day-diff-minus">-981</span></div>
      <div class="day-tag">Viewport controls and camera sweep</div>
    </div>
    <div class="day phase-split-polish" data-target="april-15">
      <div class="day-head"><div class="day-number">15</div><div class="day-title">Camera & Resize</div></div>
      <ul class="day-bullets">
        <li>ViewToolbar 7</li>
        <li>Free-cam fixes</li>
        <li>Browser 13 resize seam</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+3882</span> <span class="day-diff-minus">-130</span></div>
      <div class="day-tag">Camera controls and browser resize polish</div>
    </div>
    <div class="day phase-browser" data-target="april-16">
      <div class="day-head"><div class="day-number">16</div><div class="day-title">Import Sprint</div></div>
      <ul class="day-bullets">
        <li>Import-3 closeout</li>
        <li>Import-4 staged window and preview</li>
        <li>Browser-14 explode and hierarchy passes</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+36170</span> <span class="day-diff-minus">-1703</span></div>
      <div class="day-tag">Import window and staged preview buildout</div>
    </div>
    <div class="day phase-browser" data-target="april-17">
      <div class="day-head"><div class="day-number">17</div><div class="day-title">Scale & Environment</div></div>
      <ul class="day-bullets">
        <li>Import 7.5.5-7.5.6</li>
        <li>Environment 1 baseline repair</li>
        <li>Lighting cleanup follow-up</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Import scale controls and environment baseline</div>
    </div>
    <div class="day phase-browser" data-target="april-18">
      <div class="day-head"><div class="day-number">18</div><div class="day-title">Catalog Preview</div></div>
      <ul class="day-bullets">
        <li>Preview asset repair</li>
        <li>Interactive card and page previews</li>
        <li>Add-to-project card action</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">1 commit in this checkout</span></div>
      <div class="day-tag">Catalog preview and commit flow</div>
    </div>

    <div class="day phase-workspace-foundation" data-target="april-19">
      <div class="day-head"><div class="day-number">19</div><div class="day-title">Home & Console</div></div>
      <ul class="day-bullets">
        <li>Environment look persistence</li>
        <li>Home Page launch and storage lanes</li>
        <li>Console workspace actions</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">1 commit in this checkout</span></div>
      <div class="day-tag">Home Page and Console workspace flow</div>
    </div>
    <div class="day phase-browser" data-target="april-20">
      <div class="day-head"><div class="day-number">20</div><div class="day-title">Catalog Intake</div></div>
      <ul class="day-bullets">
        <li>Control deck shell</li>
        <li>External source mapping</li>
        <li>PubParts downloads and Dropbox intake</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">1 commit in this checkout</span></div>
      <div class="day-tag">Catalog external-source intake sprint</div>
    </div>
    <div class="day phase-browser" data-target="april-21">
      <div class="day-head"><div class="day-number">21</div><div class="day-title">Catalog Cleanup</div></div>
      <ul class="day-bullets">
        <li>ZIP entry import review</li>
        <li>Local library mirror and PubParts refresh</li>
        <li>Rail filters and browse cleanup</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">1 commit in this checkout</span></div>
      <div class="day-tag">Catalog cleanup and source tooling</div>
    </div>
    <div class="day phase-build-fix" data-target="april-22">
      <div class="day-head"><div class="day-number">22</div><div class="day-title">Edit History</div></div>
      <ul class="day-bullets">
        <li>Reader UI and filtering</li>
        <li>Checkpoint readiness proof</li>
        <li>Sketch draw undo batches</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">1 commit in this checkout</span></div>
      <div class="day-tag">Edit History sprint</div>
    </div>
    <div class="day phase-time-off" data-target="april-23">
      <div class="day-head"><div class="day-number">23</div><div class="day-title">Shred Fest</div></div>
      <ul class="day-bullets">
        <li>Oak City Shred Fest 2026</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">time off</span></div>
      <div class="day-tag">Oak City Shred Fest 2026</div>
    </div>
    <div class="day phase-time-off" data-target="april-24">
      <div class="day-head"><div class="day-number">24</div><div class="day-title">Shred Fest</div></div>
      <ul class="day-bullets">
        <li>Oak City Shred Fest 2026</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">time off</span></div>
      <div class="day-tag">Oak City Shred Fest 2026</div>
    </div>
    <div class="day phase-time-off" data-target="april-25">
      <div class="day-head"><div class="day-number">25</div><div class="day-title">Shred Fest</div></div>
      <ul class="day-bullets">
        <li>Oak City Shred Fest 2026</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">time off</span></div>
      <div class="day-tag">Oak City Shred Fest 2026</div>
    </div>

    <div class="day phase-time-off" data-target="april-26">
      <div class="day-head"><div class="day-number">26</div><div class="day-title">Shred Fest</div></div>
      <ul class="day-bullets">
        <li>Oak City Shred Fest 2026</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">time off</span></div>
      <div class="day-tag">Oak City Shred Fest 2026</div>
    </div>
    <div class="day phase-build-fix" data-target="april-27">
      <div class="day-head"><div class="day-number">27</div><div class="day-title">MkDocs</div></div>
      <ul class="day-bullets">
        <li>Strict build warning cleanup</li>
        <li>Docs-site warning removal</li>
        <li>MkDocs lane stays green</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">MkDocs strict build cleanup</div>
    </div>
    <div class="day empty">
      <div class="day-number">28</div>
    </div>
    <div class="day empty">
      <div class="day-number">29</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="april-30">
      <div class="day-head"><div class="day-number">30</div><div class="day-title">Timeline</div></div>
      <ul class="day-bullets">
        <li>Edit History timeline UI</li>
        <li>Scrub rail and marker pass</li>
        <li>Camera shortcut repair</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Edit History workspace timeline sprint</div>
    </div>
    <div class="day empty"></div>
    <div class="day empty"></div>
  </div>
</div>

<div class="calendar-nested-weeks">
  <details class="calendar-week-details">
  <summary>Week of April 1-4</summary>

  <details class="calendar-day-details" id="april-1">
  <summary>April 1 - Wednesday</summary>
  <ul>
    <li>Ran the Workspace 7.5 parity pass across host behavior and graph composition</li>
    <li>Kept build output green while tightening docs and month-view calendar structure</li>
    <li>Extended the logging surface so April can continue in the same format as March</li>
  </ul>
  <div class="calendar-day-git">Git diff: 4 commits, +12505 / -1957.</div>
  <ul class="calendar-commit-list">
    <li>`2ceb524` workspace modes 7.5</li>
    <li>`b156d72` uhh</li>
    <li>`86d39d5` 9a & mk doc</li>
    <li>`8e0814f` 9a-c & calandar</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (48)</summary>
    <ul class="calendar-commit-list">
      <li>`Workspace 7.5-7 - Browser Single-Click Console Cleanup`</li>
      <li>`Workspace 7.5-7 Phase 2F - Browser Publisher Rollout And Legacy Compatibility Demotion`</li>
      <li>`VR-SP - Console Node Breadcrumb Summary Cleanup`</li>
      <li>`VR-SP - Console Graph Breadcrumb Summary Cleanup`</li>
      <li>`VR-SP - Workspace 7.5-7A Phase 2E - Dedupe Spaghetti Activation Noise`</li>
      <li>`VR-SP - Workspace 7.5-7A Phase 2D Retry - Tagged AppShell Clear Sources`</li>
      <li>`VR-SP - Workspace 7.5-7A Phase 2D - Prevent Late Global Clear Replay`</li>
      <li>`VR-SP - Workspace 7.5-7A Phase 2C - Restore Split Spaghetti Click Publisher Reliability`</li>
      <li>`VR-SP - Workspace 7.5-7A Phase 2A - Prevent Stale Root Replay`</li>
      <li>`VR-SP - Workspace 7.5-7A Phase 1 - Real Console Split Spaghetti Repro`</li>
      <li>`VR-SP - Workspace 7.5-7 Phase 2E Follow-Up - Host-Owned Spaghetti Console Sync`</li>
      <li>`VR-SP - Workspace 7.5-7 Phase 2E - Split-Host Outer Activation Fallback`</li>
      <li>`VR-SP - Workspace 7.5-7 Phase 2D - Direct Spaghetti Graph Focus Command`</li>
      <li>`VR-SP - Workspace 7.5-7 Phase 2C - Unify Spaghetti Activation Publishers`</li>
      <li>`VR-SP - Workspace 7.5-7 Phase 2B - Make ConsoleDock Prefer Explicit Workspace Handoff`</li>
      <li>`VR-SP - Workspace 7.5-7 Phase 2A - Define Explicit Console Workspace Context Handoff`</li>
      <li>`VR-SP - Workspace 7.5-7 Phase 1 - Surface Click Console Refocus Follow-Up`</li>
      <li>`VR-SP - Workspace 7.5-7 Phase 1 - Split Editor Click Focuses Console On That Editor Graph`</li>
      <li>`VR-SP - Workspace 7.5-6 Phase 2 - Constructive Bind When Entering Editor`</li>
      <li>`VR-SP - Workspace 7.5-6 Phase 1 - Destructive Replace When Leaving Editor`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 9C - Keep Top-Level Assemblies Out Of Runtime Root`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 9C - Drop Stale Published Component Shells`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 9B - Console Context Sync Hardening`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 9A - Canonical Rendered Project Parts Truth`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 8 - Restore Build Green And Workspace Host Typing`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 7 - Use Published Runtime Output For Shared Viewer Composition`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 7 - Preserve Runtime Placement Across Browser Policy Sync`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 7 - Browser Reveal Frames Rendered Graph Parts`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 5 - Browser-Owned Multi-Graph Viewer Composition`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 5 - Graph-Qualified Output Viewer Identity`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 4 - Viewport-Local Editor Runtime Selection`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 3 - Per-Viewport Floating Host Stability`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 3 - Cross-Graph Floating Selection Sync Guard`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 3 - Browser Graph Open Intent Cleanup`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 3 - Floating Spawn Overlap Cleanup`</li>
      <li>`VR-SP - Workspace 7.5-5 Phase 2 - Multi-Surface Lifecycle Parity`</li>
      <li>`VR-SP - Workspace 7.5-5 - Per-Surface Spaghetti Shell Targeting`</li>
      <li>`VR-SP - Workspace 7.5-4 - Console And Spaghetti Split Drag-Out Smoothness`</li>
      <li>`VR-SP - Workspace 7.5-4 - Spaghetti Slot Drag-Out Keeps Live Pointer Handoff`</li>
      <li>`VR-SP - Workspace 7.5-4 - Slotted Surface Drag-Out Consumes Source Split`</li>
      <li>`VR-SP - Workspace 7.5-3 Part 6 - AppShell Close-Out And Onboarding Recipe`</li>
      <li>`VR-SP - Workspace 7.5-3 Part 5 - Spaghetti Compatibility Retirement`</li>
      <li>`VR-SP - Workspace 7.5-3 Part 4 - Browser Preview Versus Commit Cleanup`</li>
      <li>`VR-SP - Browser Slotted Drag-Out Float Consumes Source Slot`</li>
      <li>`VR-SP - Workspace 7.5-3 Part 3 - Browser Split Commit Delegation And AppShell Redock Cleanup`</li>
      <li>`VR-SP - Workspace 7.5-3 Part 2 - Shared Host Actions For Console And Further Adapter Thinning`</li>
      <li>`VR-SP - Workspace 7.5-3 - Host Adapter Retirement And Future Surface Onboarding`</li>
      <li>`VR-SP - Workspace 7.5-2 - Spaghetti Edge-Dock Split Truth And Workspace-Owned Resize`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-2">
  <summary>April 2 - Thursday</summary>
  <ul>
    <li>Finished the lingering Workspace 7.5-7 split and console parity cleanup so docked and floating surfaces behaved the same</li>
    <li>Landed the separate spaghetti browser and child-window path, including cross-window boot, relay, and close-path repairs</li>
    <li>Pushed popup-local shell adoption across browser, console, and model viewport surfaces</li>
  </ul>
  <div class="calendar-day-git">Git diff: 2 commits, +11237 / -879.</div>
  <ul class="calendar-commit-list">
    <li>`55e9411` Workspace-Modes 7.5-7 is finally fucking done bro</li>
    <li>`445368b` spaghetti editor in seperate browser</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (44)</summary>
    <ul class="calendar-commit-list">
      <li>`Workspace 7.5 - Floating Model Viewport Drag Repair`</li>
      <li>`Workspace 7.5-12 - Browser Popup Titlebar Split Menu Fallback`</li>
      <li>`Workspace 7.5-12 - Browser Direct Popup Workspace Open`</li>
      <li>`Workspace 7.5-12 - Browser Popout Split Workspace Adoption`</li>
      <li>`Workspace 7.5-12 - Popup Shell Extra Header Row Removal`</li>
      <li>`Workspace 7.5-12 - Popup Workspace Label Cleanup`</li>
      <li>`Workspace 7.5-12 - Popup Split Menu Close And Hover Cleanup`</li>
      <li>`Workspace 7.5-12 - Titlebar Menu Close Action Cleanup`</li>
      <li>`Workspace 7.5-12 - Floating Spaghetti Four-Way Split Menu Cleanup`</li>
      <li>`Workspace 7.5-12 - Popup-Local Split Divider Resize Cleanup`</li>
      <li>`Workspace 7.5-12 - Popout Spaghetti Cross-Window Context Menu Cleanup`</li>
      <li>`Workspace 7.5-12 - Phase 6 - Popup-Local Browser Adoption`</li>
      <li>`Workspace 7.5-12 - Phase 5 - Popup-Local Console Adoption`</li>
      <li>`Workspace 7.5-12 - Popup-Local Spaghetti Graph Binding Cleanup`</li>
      <li>`Workspace 7.5-12 - Phase 4 - Popup-Local Workspace Shell First Implementation`</li>
      <li>`Workspace 7.5-13 - Phase 2 - Non-Primary Model Viewport Child-Window Popout`</li>
      <li>`Workspace 7.5-10 - Spaghetti Popout Sketch Draw Preserve Window Cleanup`</li>
      <li>`Workspace 7.5-10 - Spaghetti Popout Typed Command Relay Cleanup`</li>
      <li>`Workspace 7.5-10 - Spaghetti Popout Arrow Relay Cleanup`</li>
      <li>`Workspace 7.5-10 - Spaghetti Popout Enter Relay Cleanup`</li>
      <li>`Workspace 7.5-10 - Spaghetti Popout Selection-To-Console Sync Repair`</li>
      <li>`Workspace 7.5-10 - Console Global Enter Draft Submit Cleanup`</li>
      <li>`Workspace 7.5-10 - Phase 4 - Popout Verification And Closeout`</li>
      <li>`Workspace 7.5-10 - Attempt 7 - Cross-Window Element Truth Repair`</li>
      <li>`Workspace 7.5-10 - Attempt 6 - Host-Descendant Paint And Visibility Diagnostics`</li>
      <li>`Workspace 7.5-10 - Attempt 5 - Portal Commit Truth Diagnostics`</li>
      <li>`Workspace 7.5-10 - Attempt 4 - Live Host Connectivity Repair`</li>
      <li>`Workspace 7.5-10 - Attempt 3 - Popup Visible Layout Diagnostics And Repair`</li>
      <li>`Workspace 7.5-10 - Attempt 2 - Live Child-Window Mount Diagnostics`</li>
      <li>`Workspace 7.5-10 - Phase 3A - Spaghetti Popout Relay Retirement`</li>
      <li>`Workspace 7.5-10 - Phase 3 - Spaghetti Popout Lifecycle Repair`</li>
      <li>`Workspace 7.5-10 - Phase 2 - Shared Child-Window Boot Truth`</li>
      <li>`Workspace 7.5-8 - Phase 6E - Continuous Console Drag-Out Handoff`</li>
      <li>`Workspace 7.5-8 - Phase 6D - Floating Console Titlebar Clamp Follow-Up`</li>
      <li>`Workspace 7.5-8 - Phase 6C - Floating Console Default Re-Float Size Truth`</li>
      <li>`Workspace 7.5-8 - Phase 6B - Floating Console Re-Dock Drag-Out Reseed Fix`</li>
      <li>`Workspace 7.5-8 - Phase 6A - Floating Console Slot Drag Handoff Polish`</li>
      <li>`Workspace 7.5-8 - Phase 6 - Floating Console Shared Ghost Preview Adoption`</li>
      <li>`Workspace 7.5-8 - Phase 5 - Floating Console Shared Split Menu Alignment`</li>
      <li>`Workspace 7.5-8 - Phase 5 - Floating Console Shared Split Command Adoption`</li>
      <li>`Workspace 7.5-8 - Phase 2 - Shared Global And Local Split Ghost Preview Contract`</li>
      <li>`Workspace 7.5-8 - Phase 1 - Shared Local And Global Spaghetti Split Commands`</li>
      <li>`Workspace 7.5-7 - Browser Row Pointer And Click Selection Dedupe`</li>
      <li>`Workspace 7.5-7 - Docked Browser Click Should Not Replay Root`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-3">
  <summary>April 3 - Friday</summary>
  <ul>
    <li>Cleaned up Workspace 7.5 follow-on tasks around popouts, split actions, and model viewport behavior</li>
    <li>Split the console dock into extracted parsing, prompt, formatting, and command-ownership helpers</li>
    <li>Broke AppShell into focused host, selector, and action helpers so the shell stopped carrying everything directly</li>
  </ul>
  <div class="calendar-day-git">Git diff: 3 commits, +27695 / -9199.</div>
  <ul class="calendar-commit-list">
    <li>`5086c63` Workspace clean up tasks</li>
    <li>`9e6da86` Console Refactor</li>
    <li>`f331c9d` Appshell 4 - phase 0-5</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (43)</summary>
    <ul class="calendar-commit-list">
      <li>`Dashboard - Phase 4 - Add To Do And Completed Board Lanes For Sticky Notes`</li>
      <li>`Dashboard - Phase 3 - Add Sticky Notes As The First Dashboard Widget`</li>
      <li>`Dashboard - Phase 2 - Create Notepad Workspace And Shared Note Model`</li>
      <li>`Dashboard - Phase 1 - Create Dashboard Workspace Foundation`</li>
      <li>`AppShell 4 - Build Cleanup After Phase 6 Extraction`</li>
      <li>`AppShell 4 - Phase 6 - Spawn Menu And Minor Shell Menu Coordination Cleanup`</li>
      <li>`AppShell 4 - Phase 5 - Extract Viewport Tree Composition`</li>
      <li>`AppShell 4 - Phase 4 - Extract Console Transition Host`</li>
      <li>`AppShell 4 - Phase 3 - Extract Viewport Slot Action Host`</li>
      <li>`AppShell 4 - Phase 2 - Extract Surface Activation And Console Handoff`</li>
      <li>`AppShell 4 - Phase 1 - Extract Workspace Shell Selectors`</li>
      <li>`Console 11 - Phase 5.1 - Move Submit Coordinator And Remaining Controller Callbacks Into useConsoleInteraction`</li>
      <li>`Console 11 - Phase 5 - Thin ConsoleDock Composition Shell First Cut`</li>
      <li>`Console 11 - Phase 4.2 - Finish Reference Transform Root Shortcut Cleanup And Coverage`</li>
      <li>`Console 11 - Phase 4.1 - Complete Reference/Content Runtime Extraction Cleanup`</li>
      <li>`Console 11 - Phase 4 - Split Domain Command Families Out Of Submit Dispatch`</li>
      <li>`Console 11 - Phase 3 - Extract Window Host And Surface Placement Logic`</li>
      <li>`Console 11 - Phase 2 - Extract Pure Parsing, Prompt, And Formatting Helpers`</li>
      <li>`Workspace 7.5-16 - Spaghetti Editor Viewport Type Adoption`</li>
      <li>`Workspace 7.5-16 - Split Menu Alias Override`</li>
      <li>`Workspace 7.5-16 - Guided Alias Simplification First Pass`</li>
      <li>`Workspace 7.5-16 - Close Action First Implementation`</li>
      <li>`Workspace 7.5-16 - Float Action First Implementation`</li>
      <li>`Workspace 7.5-16 - Browser Open In New Browser Adoption`</li>
      <li>`Workspace 7.5-16 - Model Viewport Open In New Browser First Implementation`</li>
      <li>`Workspace 7.5-16 - Split Follow-Into-New-Viewport`</li>
      <li>`Workspace 7.5-16 - Workspace Modes Action Menu Cleanup`</li>
      <li>`Workspace 7.5-16 - Browser Alias Cleanup`</li>
      <li>`Workspace 7.5-16 - Console Workspace Modes Viewport Type Submenu`</li>
      <li>`Workspace 7.5-16 - Titlebar Split Console Reporting`</li>
      <li>`Workspace 7.5-16 - Console Workspace Modes Split Direction Commands`</li>
      <li>`Workspace 7.5-16 - Console Workspace Modes Root Branch And Viewport Picker`</li>
      <li>`Workspace 7.5 - AppShell Viewer Camera TypeScript Build Repair`</li>
      <li>`Workspace 7.5-15 - View Toolbar Local Anchor Repair`</li>
      <li>`Workspace 7.5-15 - Model Viewport Local Toolbar Layout Isolation`</li>
      <li>`Workspace 7.5-15 - Model Viewport Local View Toolbar State Phase 2`</li>
      <li>`Workspace 7.5-14 - Model Viewport Split Camera Restore Timing Hardening`</li>
      <li>`Workspace 7.5 - Model Viewport Split Camera Persistence Follow-Up`</li>
      <li>`Workspace 7.5 - Model Viewport Camera Clone Popout`</li>
      <li>`Workspace 7.5 - Titlebar Submenu Click Lock`</li>
      <li>`Workspace 7.5 - Titlebar Viewport Type Submenu`</li>
      <li>`Workspace 7.5 - Titlebar Split Submenu Cleanup`</li>
      <li>`Workspace 7.5 - Viewport Searchable Spawn Menu`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-4">
  <summary>April 4 - Saturday</summary>
  <ul>
    <li>Launched the dashboard workspace foundations plus notepad window host and persistence</li>
    <li>Added sticky notes, board lanes, lane camera movement, and user-managed lane structure</li>
    <li>Pushed attachment, sizing, selection, and polish passes across the new planning surface</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, +18282 / -580.</div>
  <ul class="calendar-commit-list">
    <li>`6b0a48e` sticky notes</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (53)</summary>
    <ul class="calendar-commit-list">
      <li>`Nodes-1B - Shared Structured Wire Row Helper Extraction`</li>
      <li>`Nodes-1A - Shared Shell And Structured Wire Rows Contract Lock`</li>
      <li>`Node Template - Collapsed Mode Pin Visibility Cleanup`</li>
      <li>`Extrude-2.1 - SketchProfile Row Visual Parity`</li>
      <li>`Extrude-2.1 - Extrude Profile Input Row And Pin Parity`</li>
      <li>`Extrude-1A - Graph Preview Grouping Gate`</li>
      <li>`Extrude-1A - Active Draft Extrude Preview Override`</li>
      <li>`Extrude-1A - Active Viewport Freshness Proof`</li>
      <li>`Extrude-1A - Start Face Preview Readability`</li>
      <li>`Extrude-1A - OutputPreview Mesh Alignment`</li>
      <li>`Extrude-1A - Sketch Plane Transform Through Graph-Native Extrude`</li>
      <li>`Dashboard-12 - Smart Align Toggle`</li>
      <li>`Dashboard-12 - Grid Defaults To Three Columns`</li>
      <li>`Dashboard-12 - Lane Grid Arrange Action`</li>
      <li>`Dashboard-12 - New Lane Auto-Name Cleanup`</li>
      <li>`Dashboard-12 - Full-Height Lane Board Cleanup`</li>
      <li>`Dashboard-12 - Lane Toolbar Icon Polish`</li>
      <li>`Dashboard-12 - Lane-Local Create Actions Cleanup`</li>
      <li>`Dashboard-7.10 - Dashboard Hero Copy Cleanup`</li>
      <li>`Dashboard-7.10 - Sticky Note Resize Handle Chrome Cleanup`</li>
      <li>`Dashboard-7.10 - Sticky Note Stack Order Drop Fix`</li>
      <li>`Dashboard-7.10 - Phase 10.5 - Sticky Note Focus Lift`</li>
      <li>`Dashboard-7.10 - Phase 10.4 - Attachment Stack Layering Polish`</li>
      <li>`Dashboard-7.10 - Phase 10.3 - Resizable Sticky Notes Foundation`</li>
      <li>`Dashboard-7.10 - Phase 10.2 - Attachment Bounds Refactor For Variable Note Size`</li>
      <li>`Dashboard-7.10 - Phase 10.1 - Parent Full-Body Attachment Hit Area`</li>
      <li>`Dashboard-7.5 - Sticky Note Overflow Menu Visibility Fix`</li>
      <li>`Dashboard - Phase 10 - Move Attached Note Subtrees`</li>
      <li>`Dashboard - Phase 9 - Attach Notes On Drop By Title-Bar Overlap`</li>
      <li>`Dashboard - Phase 8 - Sticky Attachment Tree Contract`</li>
      <li>`Dashboard - Phase 7.5 - Sticky Note Title Bar Corner Polish`</li>
      <li>`Dashboard - Phase 7.5 - Sticky Note Menu Layering Polish`</li>
      <li>`Dashboard - Phase 7.5 - Sticky Note Burger Menu Foundation`</li>
      <li>`Dashboard - Phase 7.4 - Align Selected Notes`</li>
      <li>`Dashboard - Phase 7.3 - Group Move And Selection Polish`</li>
      <li>`Dashboard - Phase 7.2 - Multi-Note Selection Foundation`</li>
      <li>`Dashboard - Phase 7.1 - Zoom-Unlocked Fit All Notes In Lane`</li>
      <li>`Dashboard - Phase 5.2.4 - Optional Lane Zoom Unlock`</li>
      <li>`Dashboard - Phase 6.3 - Move Lane Title To Front Of Header Row`</li>
      <li>`Dashboard - Phase 6.3 - Remove Duplicate Lane Header Title`</li>
      <li>`Dashboard - Phase 6.3 - Inline Lane Title Rename Polish`</li>
      <li>`Dashboard - Phase 6.3 - Lower Minimum Lane Resize Width`</li>
      <li>`Dashboard - Phase 6.3 - Add Resizable Lane Widths And Layout Polish`</li>
      <li>`Dashboard - Phase 6.2 - Implement User-Managed Lanes`</li>
      <li>`Dashboard - Phase 5.2 - Lane Fit-To-Notes Action`</li>
      <li>`Dashboard - Phase 5.2 - Real Lane Canvas Camera`</li>
      <li>`Dashboard - Phase 5.1 - Pannable Sticky Note Lane Canvases`</li>
      <li>`Dashboard - Phase 5 - Sticky Note Title Bar Color Menu`</li>
      <li>`Dashboard - Phase 5 - Remove Sticky Note Title Bar Mark`</li>
      <li>`Dashboard - Phase 5 - Sticky Note Title Bar Drag Follow-Up`</li>
      <li>`Dashboard - Phase 5 - Dashboard Sticky Note Creation And Inline Editing`</li>
      <li>`Dashboard - Phase 4.1 - Remove Sticky Note Lane Action Buttons`</li>
      <li>`Dashboard - Phase 4.1 - Drag Sticky Notes Between Board Lanes`</li>
    </ul>
  </details>
  </details>

  </details>

  <details class="calendar-week-details" open>
  <summary>Week of April 5-11</summary>

  <details class="calendar-day-details" id="april-5">
  <summary>April 5 - Sunday</summary>
  <ul>
    <li>Switched focus to the Geometry/Extrude surface buildout and structured wire row contract</li>
    <li>Added type-aware extrude controls, preview cleanup, and authored preview helpers around the node surface</li>
    <li>Refreshed docs and node-family planning around extrude, nodes, and build-path contracts</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, +14691 / -1804.</div>
  <ul class="calendar-commit-list">
    <li>`34c82f0` extrude work</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (53)</summary>
    <ul class="calendar-commit-list">
      <li>`Extrude-3.1 Phase 8 - Type Row And Runtime Source Of Truth Trace`</li>
      <li>`Extrude-3.1 Phase 7 - Enum Row Live Write And Render Trace`</li>
      <li>`Extrude-3.1 Phase 6 - Enum Row Integration Verification And Cleanup`</li>
      <li>`Extrude-3.1 Follow-up - Current-State Type Row Param Commit Path`</li>
      <li>`Extrude-3.1 Phase 5 - Primitive Enum Row Value Ownership Parity`</li>
      <li>`Extrude-3.1 Follow-up - Unwired Type Selector State Sync Fix`</li>
      <li>`Extrude-3.1 Follow-up - ParaSelect-Backed Type Row Interaction Parity Repair`</li>
      <li>`Extrude-3.1 Follow-up - Shell-Owned Enum Row Interaction Repair`</li>
      <li>`Extrude-3.2 Phase 3 - Type Surface Honesty Cleanup`</li>
      <li>`Extrude-3.2 Phase 2 - Body Versus Walls Geometry Meaning`</li>
      <li>`Extrude-3.2 Phase 1 - Type Names And Authored State Contract`</li>
      <li>`Extrude-3.1 Phase 4 - Enum Row Fill And Endcap Cleanup`</li>
      <li>`Extrude-3.1 Phase 3 - Whole-Number Driven Enum Input`</li>
      <li>`Extrude-3.1 Phase 2 - Enum Row Interactive Shielding Fix`</li>
      <li>`Extrude-3.1 Phase 2 - Enum Row Visual Shell Parity`</li>
      <li>`Extrude-3.1 - Shared Enum Input Row And Type Selector`</li>
      <li>`Nodes-2.5C - Primitive Row Endcap Width Expansion`</li>
      <li>`Nodes-2.5C - Primitive Row Label Lane Right Nudge`</li>
      <li>`Nodes-2.5C - Primitive Row Wider Endcaps`</li>
      <li>`Nodes-2.5C - Primitive Row Left Chevron Offset`</li>
      <li>`Nodes-2.5C - Primitive Row Right Chevron Offset`</li>
      <li>`Nodes-2.5C - Primitive Row Chevron Horizontal Centering`</li>
      <li>`Nodes-2.5C - Primitive Row SVG Chevron Endcaps`</li>
      <li>`Nodes-2.5C - Primitive Row Centered Chevron Icons`</li>
      <li>`Nodes-2.5C - Primitive Row Shell Inset And Grid Fix`</li>
      <li>`Nodes-2.5C - Primitive Row Height Matches Input Rhythm`</li>
      <li>`Nodes-2.5C - Primitive Row Empty Track Transparency`</li>
      <li>`Nodes-2.5C - Primitive Row Chevron Endcaps`</li>
      <li>`Nodes-2.5C - Primitive Row Fill Color Returns To Port Tint`</li>
      <li>`Nodes-2.5C - Primitive Row Fill Marker Data Sync Fix`</li>
      <li>`Nodes-2.5C - Primitive Row Continuous Track Fix`</li>
      <li>`Nodes-2.5C - Primitive Row ParaSlider Fill Parity`</li>
      <li>`Nodes-2.5C - Primitive Row Fill And Marker Split`</li>
      <li>`Nodes-2.5C - Primitive Row Typography Height Alignment`</li>
      <li>`Nodes-2.5C - Primitive Row Shell Padding And Fill Visibility Follow-Up`</li>
      <li>`Nodes-2.5C - Primitive Row Visual Parity Rebuild`</li>
      <li>`Nodes-2.5 - Primitive Numeric Row Endcap Chrome And Fill Width Polish`</li>
      <li>`Nodes-2.5 - Primitive Numeric Row Style And Reuse`</li>
      <li>`Nodes-2C - Depth Primitive Content Lane Spacing Fix`</li>
      <li>`Nodes-2C - Depth Primitive Fill Visibility And Shell Bounds`</li>
      <li>`Nodes-2C - Depth Primitive Drag And Edge Arrow Alignment`</li>
      <li>`Nodes-2C - Depth Primitive Numeric Row Rebuild`</li>
      <li>`Nodes-2C - Depth Primitive Row Single-Shell Cleanup`</li>
      <li>`Nodes-2C - Depth Primitive Label Typography Match`</li>
      <li>`Nodes-2C - Depth Primitive Row Height Match`</li>
      <li>`Nodes-2C - Depth Primitive Row Height Tightening`</li>
      <li>`Nodes-2C - Depth Primitive Row Cleanup`</li>
      <li>`Nodes-2C - Extrude Depth ParaSlider Adoption`</li>
      <li>`Nodes-2C - Managed Numeric Row Adoption In Extrude`</li>
      <li>`Nodes-2B - Shared Numeric Row Helper Extraction`</li>
      <li>`Nodes-2A - Reference And Numeric Row Contract Lock`</li>
      <li>`Nodes-1 - Sketch Node Shell Simplification`</li>
      <li>`Nodes-1C - Shared Foundation Adoption In Sketch And Extrude`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-6">
  <summary>April 6 - Monday</summary>
  <ul>
    <li>Audited the actual runtime path and reset planning around the fact that the app still was not B-rep-backed</li>
    <li>Reorganized docs, camera-control planning, package snapshotting, and extrude cleanup around that reality</li>
    <li>Set up the next honest push toward authoritative geometry instead of assuming it already existed</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, +6481 / -560.</div>
  <ul class="calendar-commit-list">
    <li>`d1bcbdb` wait what my app isnt b-rep?</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (13)</summary>
    <ul class="calendar-commit-list">
      <li>`Model-Viewport 1.2 Phase 1 - Viewport Result Mode Contract And Ownership`</li>
      <li>`Model-Viewport-1.1 Phase 6 - Bundle-Only Retention Guard And Shared Boundary Cleanup`</li>
      <li>`Model-Viewport-1.1 Phase 4 - Retained Result Adoption And Boundary Cleanup`</li>
      <li>`Model-Viewport-1.1 Phase 3 - Shared Geometry Result Contract`</li>
      <li>`Model-Viewport-1.1 Phase 2 - Shared Geometry Request / IR Contract`</li>
      <li>`Extrude-3.4 Phase 2 - Type-Aware And Direction-Aware Taper Visibility Rules`</li>
      <li>`Extrude-3.4 Phase 1 - Taper Angle Names And Authored State Contract`</li>
      <li>`Extrude-3.3 Follow-up - Symmetric Depth Total-Span Correction`</li>
      <li>`Extrude-3.3 Phase 3 - Direction Runtime Meaning And Surface Honesty Cleanup`</li>
      <li>`Bug 14 - NodeView Test Worker Startup Coupling Harness Repair`</li>
      <li>`Extrude-3.3 Phase 2 Follow-up - TwoSides Depth Row Visibility Source Of Truth Fix`</li>
      <li>`Extrude-3.3 Phase 2 - Depth Row Surface Split And Visibility Rules`</li>
      <li>`Extrude-3.3 Phase 1 - Direction Names And Authored State Contract`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-7">
  <summary>April 7 - Tuesday</summary>
  <ul>
    <li>Added the authoritative model viewport path with worker OC boot, retained results, preview selectors, and export prep</li>
    <li>Started real graph-native sketch B-rep lowering from payload audit through wire and face handoff stages</li>
    <li>Reframed extrude follow-on work around closed-profile selection and consumption ownership</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, +10229 / -655.</div>
  <ul class="calendar-commit-list">
    <li>`9aa1f8b` Model viewport phases 1.1 (phase 1-6) phase 1.2 (phases 1-3) phase 1.3 (phases 1-9) and we still aint really b-rep</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (18)</summary>
    <ul class="calendar-commit-list">
      <li>`SP - Phase Extrude-4.1 - Closed Profile Reference And Surface Contract`</li>
      <li>`SP - Phase Sketch-1.4 - Failure Honesty, Resource Cleanup, And Focused Verification`</li>
      <li>`SP - Phase Sketch-1.3 - Planar Face Construction And Authoritative Extrude Handoff`</li>
      <li>`SP - Phase Sketch-1.2 - Worker-Owned OC Edge And Wire Lowering`</li>
      <li>`SP - Phase Sketch-1.1 - Sketch Profile Payload Audit And Contract Lock`</li>
      <li>`Model-Viewport 1.3 Phase 9 - Export Gating And On-Demand Authoritative Preparation`</li>
      <li>`Model-Viewport 1.3 Phase 8 - Export Input Contract From Authoritative Results`</li>
      <li>`Model-Viewport 1.3 Phase 7 - Final Viewport Source Honesty And Renderable Authoritative Preview`</li>
      <li>`Model-Viewport 1.3 Phase 6C - Backend Failure Honesty And Focused Verification`</li>
      <li>`Model-Viewport 1.3 Phase 6B - First Authoritative Retained Result And Shape-Set Registration`</li>
      <li>`Model-Viewport 1.3 Phase 6A - Worker-Side OpenCascade Boot And Dependency Binding`</li>
      <li>`Model-Viewport 1.3 Phase 5 - Worker-Owned Authoritative Adapter Contract`</li>
      <li>`Model-Viewport 1.3 Phase 4 - Explicit Draft/Authoritative Scheduling From Viewport And Build Policy`</li>
      <li>`Model-Viewport 1.3 Phase 3 - Honest Authoritative Boundary Cleanup`</li>
      <li>`Model-Viewport 1.3 Phase 2 - Authoritative Execution Path And Retained Result Adoption`</li>
      <li>`Model-Viewport 1.3 Phase 1 - Authoritative Result-Class Contract And Honest Placeholder Boundary`</li>
      <li>`Model-Viewport 1.2 Phase 3 - Top-Left Mode Control And User-Facing Status Honesty`</li>
      <li>`Model-Viewport 1.2 Phase 2 - Draft/Final Selection And Swap State Derivation`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-8">
  <summary>April 8 - Wednesday</summary>
  <ul>
    <li>Tightened the closed-profile extrude handoff around explicit `profileSelection` ownership and compile/runtime routing</li>
    <li>Refreshed sketch and extrude future docs plus permanent log entries to match the live code handoff</li>
    <li>Continued working-tree updates across geometry request, compile graph, node view, and authoritative geometry tests</li>
  </ul>
  <div class="calendar-day-git">Working tree diff: 17 files, +1426 / -322.</div>
  <details>
    <summary>Landed phases from CHANGELOG.md (1)</summary>
    <ul class="calendar-commit-list">
      <li>`SP - Phase Extrude-4.2A - Explicit Aggregate Selection Payload Contract`</li>
    </ul>
  </details>
  </details>

  </details>

  <details class="calendar-week-details">
  <summary>April 9-13 Catch-Up</summary>

  <details class="calendar-day-details" id="april-9">
  <summary>April 9 - Thursday</summary>
  <ul>
    <li>Built the viewport runtime inspector from panel shell through task cards, queue and archive reads, accepted impact summaries, and hardening</li>
    <li>Landed Worker Vision 1 through 3 so supersession, draft delay, authoritative waiting, settle flow, and promotion rules became explicit runtime truth</li>
    <li>Closed the extrude follow-on lane with contributor hardening, preview invalidation, and a testing clamp</li>
  </ul>
  <div class="calendar-day-git">Git diff: 2 commits, +12197 / -487.</div>
  <ul class="calendar-commit-list">
    <li>`bd04444` VRI 2</li>
    <li>`ae3baac` Extude clean up, runtime inspector start</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (31)</summary>
    <ul class="calendar-commit-list">
      <li>`WK - Phase Worker-Vision-3 Phase 4 - Accepted Draft Versus Authoritative Promotion Rules`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 3 - Release, Settle, And Explicit Authoritative Trigger Flow`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 2 - Authoritative Waiting State And Latest-Intent Replacement`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 1 - Authoritative Policy Contract And Request-Time Ownership`</li>
      <li>`WK - Phase Worker-Vision-2 Phase 5 - Draft Scheduling Hardening And Family Handoff`</li>
      <li>`WK - Phase Worker-Vision-2 Phase 4 - Draft Delay And Suppression Runtime Truth`</li>
      <li>`WK - Phase Worker-Vision-2 Phase 3 - Release And Settle Trigger Flow`</li>
      <li>`WK - Phase Worker-Vision-2 Phase 2 - Delayed Latest-Intent Placeholder State`</li>
      <li>`WK - Phase Worker-Vision-2 Phase 1 - Draft Policy Contract And Request-Time Ownership`</li>
      <li>`WK - Phase Worker-Vision-1 Phase 3 - Superseded Runtime Truth And Hardening`</li>
      <li>`WK - Phase Worker-Vision-1 Phase 2 - Worker Cooperative Abort Checkpoints`</li>
      <li>`WK - Phase Worker-Vision-1 Phase 1 - Supersession Identity And Dispatcher Contract`</li>
      <li>`SP - Phase Extrude Node Depth Clamp For Testing`</li>
      <li>`WK - Phase VRI-3.5 - Untouched Truth Hardening And Family Handoff`</li>
      <li>`WK - Phase VRI-3.4 - Impact Row Surface`</li>
      <li>`WK - Phase VRI-3.3 - Impact Entry VM And Grouping Contract`</li>
      <li>`WK - Phase VRI-3.2 - Compact Change Impact Summary Surface`</li>
      <li>`WK - Phase VRI-3.1 - Accepted Impact Read Contract And Store Widening`</li>
      <li>`WK - Phase VRI-2.4 - Queue Lifecycle Hardening And Handoff`</li>
      <li>`WK - Phase VRI-2.3 - Archive Truth Surface`</li>
      <li>`WK - Phase VRI-2.2 - Active Queue Surface`</li>
      <li>`WK - Phase VRI-2.1 - Queue Read Contract And Store Widening`</li>
      <li>`WK - Phase VRI-1.4 - Combined Inspector Read Model And Hardening`</li>
      <li>`WK - Phase VRI-1.3 - Active Runtime Task Card`</li>
      <li>`WK - Phase VRI-1.2 - Viewport Stats Foundation`</li>
      <li>`WK - Phase VRI-1.1 - Remove Secondary Inspect Pill`</li>
      <li>`WK - Phase VRI-1.1 - Whole-Card Toggle Interaction`</li>
      <li>`WK - Phase VRI-1.1 - Panel Shell And Expand Collapse Contract`</li>
      <li>`SP - Phase Extrude-7.4 - Preview Invalidation And Family Closeout`</li>
      <li>`SP - Phase Extrude-7.4 - Contributor Runtime Hardening`</li>
      <li>`SP - Phase Extrude-7.3 - Selector And Surface Multi-Wire Parity`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-10">
  <summary>April 10 - Friday</summary>
  <ul>
    <li>Extended Worker Vision 3 across split draft and final workers, relevance gating, presentation controls, preview timing, and retained-geometry hardening</li>
    <li>Built the Output Preview-aware extrude node surface with collection rows, grouped-versus-split publication, per-body expansion, and live payload capture</li>
    <li>Landed supporting cleanup around root content build policy, feature-stack release interaction, build proof, and floating spaghetti resize behavior</li>
  </ul>
  <div class="calendar-day-git">Git diff: 3 commits, +26428 / -699.</div>
  <ul class="calendar-commit-list">
    <li>`dce81c9` nodes stuff</li>
    <li>`44b9adf` Worker previews</li>
    <li>`e9fccc8` dual thread worker i think</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (36)</summary>
    <ul class="calendar-commit-list">
      <li>`WS - Phase Nodes-5.5c - Extrude Live Payload Capture Surface`</li>
      <li>`WS - Phase Nodes-5.5c - Extrude Target Endpoint Canonicalization`</li>
      <li>`WS - Phase Nodes-5.5c - Build Contract Cleanup`</li>
      <li>`WS - Phase Nodes-5.5c - SketchProfiles Aggregate Extrude Readiness Fix`</li>
      <li>`WS - Phase Nodes-5.5b - Placeholder Body Member Rows Before Resolution`</li>
      <li>`WS - Phase Nodes-5.5a - Output Preview Collection Surface Polish`</li>
      <li>`WS - Phase Nodes-5.5 - Per-Body Expansion And Wiring Surface`</li>
      <li>`WS - Phase Nodes-5.4a - Move Extrude Output Mode Row Into Outputs Rail`</li>
      <li>`WS - Phase Nodes-5.4a - Extrude Combine Versus New Objects Authored Contract`</li>
      <li>`WS - Phase Nodes-5.4 - Grouped Versus Split Publication Contract`</li>
      <li>`WS - Phase Nodes-5.3 - Output Preview Collection Input Acceptance`</li>
      <li>`WS - Phase Nodes-5.2 - Extrude Collection Output Contract`</li>
      <li>`WS - Phase Nodes-5.1 - Solid Body Collection Type And Evaluator Contract`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 10.1 - UI-Only Graph Edits Stop Triggering Geometry Build Churn`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 10 - Output Preview-Gated Extrude Worker Relevance`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 9 - Final Mode Retained Geometry Relevance Fix`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 9 - Presentation Default Color And Opacity Cleanup`</li>
      <li>`WK - Floating Spaghetti Window Eight-Way Resize Fix`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 9.2 - Presentation Controls UI Surface`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 9.5b - Distinct Authoritative Preview Lane And Auto Layered Promotion`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 9.5 - Preview Timing And 75 Percent Promotion`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 9.4 - Viewer Application Of Presentation Controls`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 9.3 - Viewport Presentation State Contract`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 9.1 - Presentation Settings Schema And Ownership`</li>
      <li>`WK - Phase Worker Release Interaction Fix For Feature Stack Editors`</li>
      <li>`BR - Phase Root Content Build Policy Header Control`</li>
      <li>`OO - Phase Build - Production Build Pass Cleanup`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 8.4 - Strict Draft Final Hardening And Viewer Proof`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 8.3 - Auto Layered Presentation`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 8.2 - Viewport Result Contract And Relevance Gating`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 8.1 - Draft Worker Versus Authoritative Worker Split`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 7 - Auto Draft Visibility And Final Swap Cleanup`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 7 - Auto Draft Visibility And Final Swap Cleanup`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 6 - Stale Final Geometry Disconnect Fix`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 6 - Display Preference Versus Build Policy Cleanup`</li>
      <li>`WK - Phase Worker-Vision-3 Phase 5 - Hardening And Family Handoff`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-11">
  <summary>April 11 - Saturday</summary>
  <ul>
    <li>Carried OutputPreview-1 from accepted source rows through managed input and output shell extraction, migration, solid-body row convergence, and follow-on polish</li>
    <li>Kept the extrude canvas surface moving with exact payload proof, aggregate member narration, selector and evaluator contracts, refresh invalidation, and row cleanup</li>
    <li>Recorded the completed phase stack in the changelog even though this checkout does not have a matching repo commit for that day</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day in this checkout.</div>
  <details>
    <summary>Landed phases from CHANGELOG.md (31)</summary>
    <ul class="calendar-commit-list">
      <li>`WS - Phase OutputPreview-1 Phase 6.1 - Default Contract Audit And Compat Lock`</li>
      <li>`WS - Phase OutputPreview-1 Follow-On - Full-Width Managed Input Lane`</li>
      <li>`WS - Phase OutputPreview-1 Phase 5c.5 - OutputPreview Migration`</li>
      <li>`WS - Phase OutputPreview-1 Phase 5c.4 - Sketch And Extrude Migration`</li>
      <li>`WS - Phase OutputPreview-1 Phase 5c.3 - Shared Managed Output Shell Extraction`</li>
      <li>`WS - Phase OutputPreview-1 Phase 5c.2 - Shared Managed Input Shell Extraction`</li>
      <li>`WS - Phase OutputPreview-1 Follow-On - Lavender SolidBody Family Retune`</li>
      <li>`WS - Phase OutputPreview-1 Follow-On - SolidBodies Row Tone Fix`</li>
      <li>`WS - Phase OutputPreview-1 Follow-On - Managed Input Surface Polish`</li>
      <li>`WS - Phase OutputPreview-1 Phase 5a - SolidBody Family Color Contract Cleanup`</li>
      <li>`WS - Phase OutputPreview-1 Phase 5a - OutputPreview Collection Row CSS Convergence`</li>
      <li>`WS - Phase OutputPreview-1 Phase 5 - SolidBodies Row Template Convergence`</li>
      <li>`WS - Phase OutputPreview-1 Phase 4 - Hardening And Family Handoff`</li>
      <li>`WS - Phase OutputPreview-1 Phase 3 - Label And Editor Ownership Cleanup`</li>
      <li>`WS - Phase OutputPreview-1 Phase 2 - Published Object Child Rows And Provenance`</li>
      <li>`WS - Phase OutputPreview-1 Phase 1 - Accepted Source Row Contract`</li>
      <li>`WS - Phase Nodes-5.5p - Extrude SolidBodies Essentials Surface Cleanup`</li>
      <li>`WS - Phase Nodes-5.5o - Extrude Profile Row Surface Cleanup`</li>
      <li>`WS - Phase Nodes-5.5n - Preserve Canvas Node Instance During Live Numeric Edits`</li>
      <li>`WS - Phase Nodes-5.5m - Real Canvas Extrude Row Regression`</li>
      <li>`WS - Phase Nodes-5.5l - Canvas Extrude Vm Handoff`</li>
      <li>`WS - Phase Nodes-5.5k - Extrude Canvas Row Refresh Invalidation`</li>
      <li>`WS - Phase Nodes-5.5j - Extrude Connected Row Note Fallback`</li>
      <li>`WS - Phase Nodes-5.5i - Extrude Parent Row Surface And Wire Tone Honesty`</li>
      <li>`WS - Phase Nodes-5.5h - Extrude Evaluator And Selector Collection Contract`</li>
      <li>`WS - Phase Nodes-5.5g - Extrude Mixed-Contributor Validation Contract`</li>
      <li>`WS - Phase Nodes-5.5g - Extrude Parent Input Contract Type Repair`</li>
      <li>`WS - Phase Nodes-5.5f - Canvas Revision-Keyed Extrude Refresh`</li>
      <li>`WS - Phase Nodes-5.5f - Legacy SketchProfiles Target Read Alignment`</li>
      <li>`WS - Phase Nodes-5.5e - Extrude Aggregate Member Surface And Collection-Ready Narration`</li>
      <li>`WS - Phase Nodes-5.5d - Extrude Exact-Payload Regression Lock`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-week-details">
  <summary>Week of April 12-18</summary>

  <details class="calendar-day-details" id="april-12">
  <summary>April 12 - Sunday</summary>
  <ul>
    <li>Finished OutputPreview-1 6.2 through 6c with backend owner flips, selector and publication alignment, singular member filtering, row-owned collection materialization, mixed-row proof, and final flatten and build-fixture repairs</li>
    <li>Repaired Bug 18 across selector visibility, waiting-state geometry retention, auto-draft freshness, and the real interaction path</li>
    <li>Rolled straight into Cleanup 1, 3, 4, 4A, and 5 with startup-path, worker-contract, workspace persistence, compatibility bridge, workspace surface catalog, and browser hierarchy narrowing</li>
  </ul>
  <div class="calendar-day-git">Git diff: 5 commits, +26593 / -2720.</div>
  <ul class="calendar-commit-list">
    <li>`d0ff830` Cleanup 4a</li>
    <li>`8a2407c` Cleanup 4 finish</li>
    <li>`c944888` Cleanup 4</li>
    <li>`2bd7ca3` Output Preview 1 - Phase 6c.1-5 ugh</li>
    <li>`d176002` Bugs on bugs</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (37)</summary>
    <ul class="calendar-commit-list">
      <li>`Cleanup 5 - Phase 4 - Browser Honest Hierarchy Proof`</li>
      <li>`Cleanup 5 - Phase 3 - Browser Content Projection Narrowing`</li>
      <li>`Cleanup 4A - Phase 4 - Workspace Surface Catalog Source And Initial Repoint`</li>
      <li>`Cleanup 4 - Phase 4 - Workspace Compatibility Bridge Isolation`</li>
      <li>`Cleanup 4 - Phase 3 - AppShell Workspace Persistence Extraction`</li>
      <li>`Cleanup 3 - Phase 4 - Worker Import Repoint`</li>
      <li>`Cleanup 3 - Phase 3 - Shared Contract Truth Move`</li>
      <li>`Cleanup 1 - Startup Path Canonicalization`</li>
      <li>`OP - OutputPreview 1 Phase 6c.5 - Build Fixture Compatibility Fix`</li>
      <li>`OP - OutputPreview 1 Phase 6c.5 - Partial Flatten Repair And Final Proof`</li>
      <li>`OP - OutputPreview 1 Phase 6c - Effective SolidBodies Port Detection Fix`</li>
      <li>`OP - OutputPreview 1 Phase 6c.4 - Browser Projection And Mixed-Row Proof`</li>
      <li>`Workspace 7.5-13 - Spaghetti Floating Open Defaults For Header And Canvas Chrome`</li>
      <li>`OP - OutputPreview 1 Phase 6c.3 - Project Content Sync And Runtime Placement`</li>
      <li>`OP - OutputPreview 1 Phase 6c.2 - Output Surface Row-Owned Collection Materialization`</li>
      <li>`OP - OutputPreview 1 Phase 6b.5 - Proof Matrix And Family Handoff`</li>
      <li>`OP - OutputPreview 1 Phase 6b.3f - Same-Row Singular Aggregation Resolution`</li>
      <li>`OP - OutputPreview 1 Phase 6b.3e - Subset Collection Final Re-Proof`</li>
      <li>`OP - OutputPreview 1 Phase 6b.3d - Retained Geometry Subset Guard`</li>
      <li>`OP - OutputPreview 1 Phase 6b.3c - Draft Geometry Mesh Subset Guard`</li>
      <li>`OP - OutputPreview 1 Phase 6b.3b - Explicit Contributor Fallback Guard`</li>
      <li>`OP - OutputPreview 1 Phase 6b.3a - Same-Slot Explicit Contributor Resolution`</li>
      <li>`OP - OutputPreview 1 Phase 6b.3 Follow-Up - Final Singular Member Lane`</li>
      <li>`OP - OutputPreview 1 Phase 6b.3 - Singular SolidBody Membership Filtering`</li>
      <li>`OP - OutputPreview 1 Phase 6b.2 Follow-Up - Browser Child Highlight Rebind`</li>
      <li>`OP - OutputPreview 1 Phase 6b.2 - Published Object Identity Contract Lock`</li>
      <li>`WS - Bug 18 Phase 4 - Real Interaction Regression On The Actual Parameter Path`</li>
      <li>`WS - Bug 18 Phase 3c - Retained Geometry Persistence During Waiting`</li>
      <li>`WS - Bug 18 Phase 3b - Auto Draft Freshness Alignment`</li>
      <li>`WS - Bug 18 Phase 3a - Live Auto Draft Lane Staging Repair`</li>
      <li>`WS - Bug 18 Phase 3 - Viewer Layer And Presentation Re-Proof`</li>
      <li>`WS - Bug 18 Phase 2 - Selector Draft Visibility Repair`</li>
      <li>`WS - Bug 18 Phase 1 - Runtime Timeline Trace`</li>
      <li>`WS - Phase OutputPreview-1 Phase 6.5 - Proof Matrix And Family Handoff`</li>
      <li>`WS - Phase OutputPreview-1 Phase 6.4 - Selector And Publication Surface Alignment`</li>
      <li>`WS - Phase OutputPreview-1 Phase 6.3 - Legacy Graph Compat And Migration Handling`</li>
      <li>`WS - Phase OutputPreview-1 Phase 6.2 - Backend Default Owner Flip`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-13">
  <summary>April 13 - Monday</summary>
  <ul>
    <li>Continued the cleanup lane with Cleanup 6 accepted-result narrowing across app publication handoff, shared viewport-result input prep, and proof tightening</li>
    <li>Added Cleanup 7 Phase 3 to move console command-start ownership behind a store seam instead of rebuilding that flow inline</li>
    <li>Recorded the phase closeout in the changelog even though this checkout does not have a matching repo commit for that day yet</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day in this checkout.</div>
  <details>
    <summary>Landed phases from CHANGELOG.md (4)</summary>
    <ul class="calendar-commit-list">
      <li>`Cleanup 7 - Phase 3 - Console Command Start Ownership Narrowing`</li>
      <li>`Cleanup 6 - Phase 5 - Accepted Result Ownership Proof Tightening`</li>
      <li>`Cleanup 6 - Phase 4 - Viewport Result Input Preparation Unification`</li>
      <li>`Cleanup 6 - Phase 3 - App Project Accepted Publication Handoff Narrowing`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-14">
  <summary>April 14 - Tuesday</summary>
  <ul>
    <li>Drove the view-toolbar lane through bottom-clearance ownership, section collapse behavior, and transform-versus-snap subsection separation so the panel settled cleanly against the viewport and console</li>
    <li>Carried the gizmo lane from connected cage and snap-safety through animated camera snapping, hover feedback, hover-space orbiting, resize behavior, and tighter shell cleanup</li>
    <li>Finished the fly-camera sweep with true mode separation, pointer-lock look, HUD compaction, and worker or auto-draft preview stability follow-ups around repeated commits and slider release handling</li>
  </ul>
  <div class="calendar-day-git">Git diff: 3 commits, +19794 / -981.</div>
  <ul class="calendar-commit-list">
    <li>`5ec0faf` View toolbar & gizmo</li>
    <li>`81bf65d` Fly camera</li>
    <li>`0c5c261` fuck it its a fpv sim now</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (58)</summary>
    <ul class="calendar-commit-list">
      <li>`VT - Fly-Mode 1 Phase 6 - Fly Mode Type Split: Drone And Free Cam`</li>
      <li>`VT - View Toolbar Para Text And Arrows To 5px`</li>
      <li>`VT - View Toolbar Para Text Middle Ground Size`</li>
      <li>`VT - View Toolbar Para Text Rollback From 50 Percent`</li>
      <li>`VT - View Toolbar Para Select Text Size Fix`</li>
      <li>`VT - View Toolbar Para Control Text To 50 Percent`</li>
      <li>`VT - View Toolbar Smaller Para Control Text`</li>
      <li>`VT - Fly-Mode 1 Phase 5 - Fly Mode Activate Select And Always-On Option`</li>
      <li>`VR - Model Viewport Bottom Console Bar Reserve`</li>
      <li>`VT - Fly-Mode 1 Phase 4 - View Toolbar Fly Mode Subsection And Roll Speed Control`</li>
      <li>`VR - View Toolbar Bottom Clearance Follow-Up 2`</li>
      <li>`VR - View Toolbar Bottom Clearance Follow-Up`</li>
      <li>`VR - Phase View-Toolbar 5 Phase 4 Follow-Up - Fix Internal Panel Offset Overcount`</li>
      <li>`VR - Phase View-Toolbar 5 Phase 4 Follow-Up - Restore Truthful Collapse Wake-Up`</li>
      <li>`VR - Phase View-Toolbar 5 Phase 4 - Immediate Section-Collapse Height Snap`</li>
      <li>`VT - Build And Strict Typing Cleanup Follow-Up`</li>
      <li>`VT - Gizmo Viewport Resize Cap Increase`</li>
      <li>`VT - Gizmo Phase 10 Overlay Shell Orbit Drag Follow-Up`</li>
      <li>`VT - Phase Gizmo 2 Phase 10 - Orbit The Model Viewport From Gizmo Hover Space`</li>
      <li>`VT - Gizmo Default Line Opacity Follow-Up`</li>
      <li>`VT - Gizmo Viewport Shadowless Shell Follow-Up`</li>
      <li>`VT - Gizmo Viewport Dolly Default And Borderless Shell Follow-Up`</li>
      <li>`VT - Phase Gizmo Compact Viewport Resize Handle In Collapsed Mode`</li>
      <li>`VT - Phase Gizmo 2 Phase 9 - Gizmo Viewport Camera Dolly And Default Framing`</li>
      <li>`VR - Phase View-Toolbar 5 Phase 3 - Snap Subsection Split`</li>
      <li>`VR - Phase View-Toolbar 5 Phase 2 - Transform Subsection Split And Gizmo Scope Cleanup`</li>
      <li>`VT - Phase Gizmo 2 Phase 8 - Snap-Line Hover Transparency And Highlight Feedback`</li>
      <li>`VT - Phase Gizmo 2 Phase 7 Follow-Up - Gizmo Viewport Background Mode`</li>
      <li>`VT - Phase Gizmo 2 Phase 7 - v15 Style Controls For Orientation Helper`</li>
      <li>`VR - Phase View-Toolbar 5 Follow-Up - Scrollbar Only At Real Height Clamp`</li>
      <li>`VR - Phase View-Toolbar 5 Phase 1c Follow-Up - Restore Root Height Read And Subsection Reflow`</li>
      <li>`VR - Phase View-Toolbar 5 Phase 1c - Collapse Remeasure Loop And Immediate Height Settle`</li>
      <li>`VT - Phase Gizmo 2 Phase 6 - Animated Camera Snapping From Orientation Targets`</li>
      <li>`VT - Phase Gizmo 3 - Immediate Resize Without Dock Or Widget Lag`</li>
      <li>`VR - Phase View-Toolbar 5 Phase 1b - Used-Height Clamp And Console-Bar Reserve`</li>
      <li>`VT - Phase Gizmo 2 Phase 5 - Dense Connector Mesh And Lower Opacity`</li>
      <li>`VR - Phase View-Toolbar 5 Phase 1 - Toolbar Scroll Ownership And Viewport Clamp`</li>
      <li>`VT - Phase Gizmo 2 Phase 4 - Snap-Safety And Interaction Proofs`</li>
      <li>`VT - Phase Gizmo 2 Phase 3 - Complete Connected Cage Read`</li>
      <li>`VT - Phase Gizmo 2 Phase 2 - First Non-Pickable Connector Layer`</li>
      <li>`VR - Phase View-Toolbar 5.1 - Model Viewport Bottom Clamp`</li>
      <li>`VR - Phase View-Toolbar 5.1 - Viewport-Bottom Content Padding`</li>
      <li>`VR - Phase View-Toolbar 5.1 - Bottom Console Clearance`</li>
      <li>`VR - Phase View-Toolbar 5.1 - Whole Toolbar Scroll Ownership Correction`</li>
      <li>`VR - Phase View-Toolbar 5.1 - View Section Scrollbar Visibility Fix`</li>
      <li>`VR - Phase View-Toolbar 5.1 - Inner Scroll Surface Ownership`</li>
      <li>`VR - Phase Camera 6.3.7d - Reduce Fly Speed HUD Arrow Glyph Size`</li>
      <li>`VR - Phase Camera 6.3.7c - Compact Fly Speed HUD Slider`</li>
      <li>`VR - Phase Camera 6.3.7b - Restore Exact Y-Up On Fly Exit`</li>
      <li>`VR - Phase Camera 6.3.8 - Pointer Lock Fly Look`</li>
      <li>`VR - Phase Camera 6.3.7 - True Fly Camera Mode Separation`</li>
      <li>`WK - Phase Worker 10 Phase 5 - Repair Complex Parallel Preview Locality And Settled Sibling Completeness`</li>
      <li>`WK - Phase Worker 10 Phase 4 - Prove Complex Parallel Preview Locality`</li>
      <li>`WK - AutoDraftFinal Phase 9.3 - Clear Stale Baseline Meshes On Layer Replacement`</li>
      <li>`WK - AutoDraftFinal Phase 9.2 - Repeated-Commit Viewer Regression`</li>
      <li>`WK - Viewport Slider Release Interaction Contract Fix`</li>
      <li>`WK - AutoDraftFinal Phase 8.5 - Auto Live Read-Through Proof And Verification`</li>
      <li>`WK - AutoDraftFinal Phase 8.4 - End Comparison On Pointer Release`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-15">
  <summary>April 15 - Wednesday</summary>
  <ul>
    <li>Shifted from fly-mode fixes into the new View-Toolbar 7 camera lane, landing perspective FOV, authored clip range, para sliders, wording cleanup, projection proof, and camera subsection grouping</li>
    <li>Tightened free-cam defaults with upright yaw and default fly-mode type behavior so the camera tooling felt more predictable after the April 14 fly-mode split</li>
    <li>Closed the day on Browser-13 overflow and resize work so long object lists can scroll and both docked and floating browser widths have a reachable shared resize seam</li>
  </ul>
  <div class="calendar-day-git">Git diff: 2 commits, +3882 / -130.</div>
  <ul class="calendar-commit-list">
    <li>`9e5478c` fly mode/free cam</li>
    <li>`5175971` free cam test</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (16)</summary>
    <ul class="calendar-commit-list">
      <li>`BR - Browser-13 Phase 2.3 - Reachable Docked Resize Seam`</li>
      <li>`BR - Browser-13 Phase 2.2 - Floating Resize Affordances`</li>
      <li>`BR - Browser-13 Phase 2.1 - Shared Dock Width Proof`</li>
      <li>`VT - View-Toolbar 7 Phase 7 - Camera Subsection Grouping And Framing Split`</li>
      <li>`VT - View-Toolbar 7 Phase 6 - Projection Toggle Sync Proof And Stop`</li>
      <li>`VT - View-Toolbar 7 Phase 5 - Value Language, Defaults, And Small Safety Polish`</li>
      <li>`VT - View-Toolbar 7 Phase 4 - Clip Start And Clip End ParaSliders`</li>
      <li>`VT - View-Toolbar 7 Phase 3 - Authored Clip Range Runtime Contract`</li>
      <li>`VT - View-Toolbar 7 Phase 2 - Camera Section FOV ParaSlider`</li>
      <li>`VT - View-Toolbar 7 Phase 1 - Perspective FOV Viewer Contract`</li>
      <li>`VT - View-Toolbar 5 Phase 5 - Browser Read-Only Subsection Density Match`</li>
      <li>`VT - Free Cam Default Fly Mode Type`</li>
      <li>`VT - Free Cam Upright Yaw Fix`</li>
      <li>`BRW - Browser-13 - Phase 1 - Scrollable Browser Content When Object Lists Overflow`</li>
      <li>`BRW - Browser-13 - Phase 1 - Unsplit Left Dock Constraint Follow-Up`</li>
      <li>`BRW - Browser-13 - Phase 2.3 - Shared Dock Resize Seam Chrome Cleanup`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-16">
  <summary>April 16 - Thursday</summary>
  <ul>
    <li>Turned Browser-14 into a full explode-aware lane with stable part identity, real per-part runtime records, wrapper replacement, console entry, parity cleanup, and preserved loaded runtime behavior</li>
    <li>Advanced Camera-7 and Import-3 together so animated standard-view and zoom-to-object controls met a full staged import window with intake, review, structure inspection, settings, placement, commit, and cleanup</li>
    <li>Spent the rest of the sprint on Import-4, building the staged per-file feedback flow, partial-result session messaging, third-column object preview, hierarchy tree rendering, staged settings conversion, parts-list cleanup, and the first preview follow-ups through zoom-to-fit, resize repair, up-axis truth, and the 300x300 grid toggle</li>
  </ul>
  <div class="calendar-day-git">Git diff: 3 commits, +36170 / -1703.</div>
  <ul class="calendar-commit-list">
    <li>`9aa3d39` Import 3 - import file stage window</li>
    <li>`f673d01` Catlog part 1</li>
    <li>`796335f` Batch importer and other view stuff</li>
  </ul>
  <details>
    <summary>Landed phases from CHANGELOG.md (65)</summary>
    <ul class="calendar-commit-list">
      <li>`Import-4 - Phase 7.5.4 - 300x300 Preview Grid Toggle`</li>
      <li>`Import-4 - Phase 7.5.3 - Up-Axis Preview Truth Snappy Follow-Up`</li>
      <li>`Import-4 - Phase 7.5.3 - Up-Axis Preview Truth`</li>
      <li>`Import-4 - Phase 7.5.1 - Object Preview Zoom-To-Fit Aspect-Aware Follow-Up`</li>
      <li>`Import-4 - Phase 7.5.2 - Object Preview Resize-Adjust Bug Repair`</li>
      <li>`Import-4 - Phase 7.5.1 - Object Preview Zoom-To-Fit`</li>
      <li>`Import-4 - Phase 7.4.4 - True Tree Connector And Root-Line Fidelity`</li>
      <li>`Import-4 - Phase 7.4.3 - Badge Truth And Helper-Copy Enrichment`</li>
      <li>`Import-4 - Phase 7.4.2 - Hierarchy Tree Header Follow-Up`</li>
      <li>`Import-4 - Phase 7.4.2 - Hierarchy Tree Scroll Follow-Up`</li>
      <li>`Import-4 - Phase 7.4.2 - Hierarchy Tree Rendering`</li>
      <li>`Import-4 - Phase 7.4.1 - Hierarchy Summary Contract`</li>
      <li>`Import-4 - Phase 7.3 - Real ParaSelect Follow-Up`</li>
      <li>`Import-4 - Phase 7.3 - Staged Settings Paraselect Conversion`</li>
      <li>`Import-4 - Phase 7.1 - Parts List Highlight Row Follow-Up`</li>
      <li>`Import-4 - Phase 7.2 - Staged File Card Re-Organization`</li>
      <li>`Import-4 - Phase 7.1 - Parts Summary List Bottom-Edge Resize`</li>
      <li>`Import-4 - Phase 7.1 - Parts Summary List Overflow Cap`</li>
      <li>`Import-4 - Phase 7.1 - Parts Summary List Cleanup`</li>
      <li>`Import-4 - Phase 6.4 - Cleanup And Regression Proof`</li>
      <li>`Import-4 - Phase 6.3 - Orbit Interaction And Divider Resizing`</li>
      <li>`Import-4 - Phase 6.2 - Load Into Preview Viewport Action And Preview Rendering`</li>
      <li>`Import-4 - Phase 6.1 - Preview Selection Contract And Third-Column Shell`</li>
      <li>`Import-4 - Phase 4 - Dialog Recovery And Session Messaging`</li>
      <li>`Import-4 - Phase 3 - Add-To-Project Partial Result Contract`</li>
      <li>`Import-4 - Phase 2 - Per-File Staged Inspection Feedback`</li>
      <li>`Import-4 - Phase 0.1.4 - Regression Proof And Narrow Cleanup`</li>
      <li>`Import-4 - Phase 0.2.3 - Focused Performance Proof And Narrow Cleanup`</li>
      <li>`Import-4 - Phase 0.2.2 - Split-Child Derivation Handoff`</li>
      <li>`Import-4 - Phase 0.2.1 - Shared Source Load Ownership For Direct Split Children`</li>
      <li>`Import-4 - Phase 0.1.3 - Commit Path Wiring For Multiple Objects In 1 Component`</li>
      <li>`Import-4 - Phase 0.1.2 - Part-Backed Child Load Contract`</li>
      <li>`Import-4 - Phase 0.1.1 - Current Split-Import Failure Proof`</li>
      <li>`Import-4 - Phase 1 - Preview Browser Column And Scroll Polish`</li>
      <li>`Import-4 - Phase 1 - Preview Browser Column And Scroll Polish`</li>
      <li>`Import-4 - Phase 1 - Preview Browser Column And Scroll Polish`</li>
      <li>`Import-4 - Phase 1 - Preview Browser Column And Scroll Polish`</li>
      <li>`Import-3 - Phase 12 - Post-Accept Imported Reference Load Failure Research And Fix`</li>
      <li>`Import-3 - Phase 11 - Narrow Cleanup And Regression Pass`</li>
      <li>`Import-3 - Phase 10 - Add-To-Project Commit Path`</li>
      <li>`Import-3 - Phase 9 - New Assembly Placement Option`</li>
      <li>`Import-3 - Phase 8 - Scale And Units Alignment`</li>
      <li>`Import-3 - Phase 7 - Up-Axis Settings`</li>
      <li>`Import-3 - Phase 6 - Preview Browser Organization Before Commit`</li>
      <li>`Import-3 - Phase 5 - Structured Import Mode Choice`</li>
      <li>`Import-3 - Phase 4 - Pre-Add Structure Inspection Contract`</li>
      <li>`Import-3 - Phase 3B - Staged File List Polish Pass`</li>
      <li>`Import-3 - Phase 3 - Staged File List And Multi-File Review`</li>
      <li>`Build - Browser Import Fixture And Viewer Provenance Type Repairs`</li>
      <li>`Import-3 - Phase 2 - Supported Types And Browser Intake`</li>
      <li>`VR - Camera-7 Phase 3.2 - Animated Zoom To Object Through Shared Framing Seam`</li>
      <li>`Import-3 - Phase 1 - Menu Entry And Floating Window Shell`</li>
      <li>`VR - Camera-7 Phase 3.1 - Shift+Z Zoom Object Shortcut Revision`</li>
      <li>`VR - Camera-7 Phase 3.1 - Numpad Decimal Entry Into Shared Zoom To Object`</li>
      <li>`VR - Camera-7 Phase 2.2 - View Toolbar Camera Transition Duration ParaSlider`</li>
      <li>`Browser-14 - Phase 8 - Preserve Loaded Runtime After Explode`</li>
      <li>`VR - Camera-7 Phase 2.1 - Animated Standard View Transitions`</li>
      <li>`BR - Browser-14 Phase 7 - Console Explode Entry`</li>
      <li>`BR - Browser-14 Phase 6 - Naming Cleanup And Focused Regression Proof`</li>
      <li>`BR - Browser-14 Phase 5 - Independent Object Behavior Parity`</li>
      <li>`BR - Browser-14 Phase 4 - Browser Explode Entry And Wrapper Replacement`</li>
      <li>`BR - Browser-14 Phase 3 - Runtime Single-Part Load And Provenance`</li>
      <li>`BR - Browser-14 Phase 2 - Explode Mutation Creates Real Per-Part Object Records`</li>
      <li>`VR - Phase Camera 7 - Active Viewer Camera Control Shortcuts`</li>
      <li>`BR - Browser-14 Phase 1 - Stable Part Identity And Explode Contract`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-17">
  <summary>April 17 - Friday</summary>
  <ul>
    <li>Followed the Import-4 preview work with Phase 7.5.5 and 7.5.6 so staged scale changes now update in place and the new Scale Multiplier row owns truthful numeric scale, proper slider arrows, matching ParaSelect styling, and a segmented low-end-friendly curve</li>
    <li>Opened the first environment lane by shipping the default lighting baseline repair, then restoring the original darker background colors and grid opacity values while keeping the readability-focused exposure and light-rig work</li>
    <li>Finished with Environment-1 Phase 2b so the default rig now uses a cleaner key-fill-rim balance without widening into presets or new toolbar state</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day in this checkout.</div>
  <details>
    <summary>Landed phases from CHANGELOG.md (9)</summary>
    <ul class="calendar-commit-list">
      <li>`Environment-1 - Phase 2b - Default Lighting Cleanup And Balance Polish`</li>
      <li>`Environment-1 - Phase 2 - Restore Original Grid Opacities`</li>
      <li>`Environment-1 - Phase 2 - Restore Original Background Colors`</li>
      <li>`Environment-1 - Phase 2 - Ship The Default Lighting Baseline Repair`</li>
      <li>`Import-4 - Phase 7.5.6 - Segmented Scale Multiplier Slider Curve`</li>
      <li>`Import-4 - Phase 7.5.6 - Scale Multiplier Match Up Axis ParaSelect Style`</li>
      <li>`Import-4 - Phase 7.5.6 - Scale Multiplier Proper ParaSlider Arrows`</li>
      <li>`Import-4 - Phase 7.5.6 - Scale Multiplier Paraselect And Custom Sync`</li>
      <li>`Import-4 - Phase 7.5.5 - Scale Preview Truth And Snappy In-Place Scale Updates`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-18">
  <summary>April 18 - Saturday</summary>
  <ul>
    <li>Repaired Catalog preview assets and base-path resolution so seeded preview media finally loaded truthfully in real runtime</li>
    <li>Built the first interactive Catalog preview viewports across repo-backed cards, then widened that same viewport path onto the item page with warm runtime reuse</li>
    <li>Finished by making the larger unloaded preview surface click-to-load and adding a direct grid-card `Add To Project` action for eligible repo-backed items</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit in this checkout.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (7)</summary>
    <ul class="calendar-commit-list">
      <li>`Catalog-2 - Phase 3 - Reference Family Item Page Read`</li>
      <li>`Catalog-2 - Phase 4 - Reference Family Commit Follow-Through`</li>
      <li>`Catalog - Preview Asset Repair And Base-Path Resolution`</li>
      <li>`Catalog-2 - Phase 5 - Repo-backed Interactive Card Preview Viewports`</li>
      <li>`Catalog-2 - Phase 5.1 - Item Page Interactive Preview Viewport`</li>
      <li>`Catalog - Warm Repo-backed Preview Viewport Reuse`</li>
      <li>`Catalog-1.12 - Phase 1 - Item Card Add To Project Button`</li>
    </ul>
  </details>
  </details>

  </details>

  </details>
</div>

</details>

## March 2026

<details class="calendar-month">
<summary>March 2026</summary>

<div class="month-shell">
  <div class="month-header">
    <div>
      <h3>March 2026</h3>
      <p>From Browser and Transform polish into the first full workspace-system sprint.</p>
    </div>
  </div>

  <div class="month-grid">
    <div class="weekday">Sun</div>
    <div class="weekday">Mon</div>
    <div class="weekday">Tue</div>
    <div class="weekday">Wed</div>
    <div class="weekday">Thu</div>
    <div class="weekday">Fri</div>
    <div class="weekday">Sat</div>

    <div class="day empty">
      <div class="day-number">1</div>
    </div>
    <div class="day phase-quiet" data-target="march-2">
      <div class="day-head"><div class="day-number">2</div><div class="day-title">Kickoff</div></div>
      <ul class="day-bullets">
        <li>Project kickoff</li>
        <li>First setup pass</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Start of project</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-3">
      <div class="day-head"><div class="day-number">3</div><div class="day-title">First Buildout</div></div>
      <ul class="day-bullets">
        <li>Feature stack buildout</li>
        <li>Node UI pass</li>
        <li>Drivers and part templates</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">First big implementation day</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-4">
      <div class="day-head"><div class="day-number">4</div><div class="day-title">Foundations</div></div>
      <ul class="day-bullets">
        <li>Node UI cleanup</li>
        <li>Driver wiring</li>
        <li>Runtime bridge hardening</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+32519</span> <span class="day-diff-minus">-2</span></div>
      <div class="day-tag">Foundations sprint</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-5">
      <div class="day-head"><div class="day-number">5</div><div class="day-title">Core Systems</div></div>
      <ul class="day-bullets">
        <li>Feature stack growth</li>
        <li>Param-input groundwork</li>
        <li>Docs and layout polish</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+39219</span> <span class="day-diff-minus">-1911</span></div>
      <div class="day-tag">Core systems and docs</div>
    </div>
    <div class="day phase-build-fix" data-target="march-6">
      <div class="day-head"><div class="day-number">6</div><div class="day-title">History</div></div>
      <ul class="day-bullets">
        <li>History rebuild</li>
        <li>Chill-log setup</li>
        <li>Phase-system consolidation</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Docs and history cleanup</div>
    </div>
    <div class="day phase-build-fix" data-target="march-7">
      <div class="day-head"><div class="day-number">7</div><div class="day-title">Docs Rules</div></div>
      <ul class="day-bullets">
        <li>Changelog rules</li>
        <li>Repo docs cleanup</li>
        <li>Workflow tightening</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Docs process pass</div>
    </div>

    <div class="day phase-build-fix" data-target="march-8">
      <div class="day-head"><div class="day-number">8</div><div class="day-title">Phase Rebuild</div></div>
      <ul class="day-bullets">
        <li>Phase-plan reconstruction</li>
        <li>Planning rules pass</li>
        <li>Legacy planning setup</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Phase system rebuild</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-9">
      <div class="day-head"><div class="day-number">9</div><div class="day-title">Graph Docs</div></div>
      <ul class="day-bullets">
        <li>Graph document persistence</li>
        <li>Browser-first groundwork</li>
        <li>Multi-viewport start</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Graph docs foundation</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-10">
      <div class="day-head"><div class="day-number">10</div><div class="day-title">Lifecycle</div></div>
      <ul class="day-bullets">
        <li>Cached graph lifecycle</li>
        <li>Save/load planning</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+34387</span> <span class="day-diff-minus">-21653</span></div>
      <div class="day-tag">Graph lifecycle</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-11">
      <div class="day-head"><div class="day-number">11</div><div class="day-title">Ownership</div></div>
      <ul class="day-bullets">
        <li>Content ownership</li>
        <li>Preview routing</li>
        <li>Roadmap and task docs</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Ownership and routing</div>
    </div>
    <div class="day phase-split-polish" data-target="march-12">
      <div class="day-head"><div class="day-number">12</div><div class="day-title">Shell Cleanup</div></div>
      <ul class="day-bullets">
        <li>Workspace shell cleanup</li>
        <li>Browser actions</li>
        <li>Split dock and composition</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Workspace shell polish</div>
    </div>
    <div class="day phase-split-polish" data-target="march-13">
      <div class="day-head"><div class="day-number">13</div><div class="day-title">Split Polish</div></div>
      <ul class="day-bullets">
        <li>Graph-row save states</li>
        <li>Build state polish</li>
        <li>Dock and split controls</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+30631</span> <span class="day-diff-minus">-4620</span></div>
      <div class="day-tag">Browser and split polish</div>
    </div>
    <div class="day phase-quiet" data-target="march-14">
      <div class="day-head"><div class="day-number">14</div><div class="day-title">Snowboarding</div></div>
      <ul class="day-bullets">
        <li>Went snowboarding</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Off-project day</div>
    </div>

    <div class="day phase-browser" data-target="march-15">
      <div class="day-head"><div class="day-number">15</div><div class="day-title">Browser Cleanup</div></div>
      <ul class="day-bullets">
        <li>Browser row cleanup</li>
        <li>Roadmap note sync</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Browser cleanup</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-16">
      <div class="day-head"><div class="day-number">16</div><div class="day-title">References</div></div>
      <ul class="day-bullets">
        <li>Reference workspace</li>
        <li>Graph documents</li>
        <li>Viewer grid and imports</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+2748</span> <span class="day-diff-minus">-234</span></div>
      <div class="day-tag">Reference systems</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-17">
      <div class="day-head"><div class="day-number">17</div><div class="day-title">UI Cleanup</div></div>
      <ul class="day-bullets">
        <li>Spaghetti surface cleanup</li>
        <li>Shell polish</li>
        <li>Browser visibility pass</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+831620</span> <span class="day-diff-minus">-4180</span></div>
      <div class="day-tag">UI cleanup wave</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-18">
      <div class="day-head"><div class="day-number">18</div><div class="day-title">SketchPlane</div></div>
      <ul class="day-bullets">
        <li>SketchPlane overlays</li>
        <li>Ghost planes</li>
        <li>Viewport tool panel</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">SketchPlane build-out</div>
    </div>
    <div class="day phase-build-fix" data-target="march-19">
      <div class="day-head"><div class="day-number">19</div><div class="day-title">Console</div></div>
      <ul class="day-bullets">
        <li>Console staged polish</li>
        <li>Sketch toolbar density cleanup</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+36234</span> <span class="day-diff-minus">-4713</span></div>
      <div class="day-tag">Console and UI cleanup</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-20">
      <div class="day-head"><div class="day-number">20</div><div class="day-title">Runtime</div></div>
      <ul class="day-bullets">
        <li>Radio runtime</li>
        <li>Sampler controls</li>
        <li>Sketch session groundwork</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+25033</span> <span class="day-diff-minus">-1394</span></div>
      <div class="day-tag">Runtime and tools</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-21">
      <div class="day-head"><div class="day-number">21</div><div class="day-title">Docs + Sketch</div></div>
      <ul class="day-bullets">
        <li>MkDocs setup</li>
        <li>Sketch ownership</li>
        <li>Move commands and radio polish</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+3092</span> <span class="day-diff-minus">-77</span></div>
      <div class="day-tag">Docs and sketch systems</div>
    </div>

    <div class="day phase-workspace-foundation" data-target="march-22">
      <div class="day-head"><div class="day-number">22</div><div class="day-title">AppShell</div></div>
      <ul class="day-bullets">
        <li>AppShell extraction</li>
        <li>Camera controls</li>
        <li>Sketch draw expansion</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+48246</span> <span class="day-diff-minus">-22153</span></div>
      <div class="day-tag">AppShell and camera</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-23">
      <div class="day-head"><div class="day-number">23</div><div class="day-title">Docs Launch</div></div>
      <ul class="day-bullets">
        <li>Sketch console routing</li>
        <li>Viewer pan fixes</li>
        <li>Docs site publish</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+10644</span> <span class="day-diff-minus">-680</span></div>
      <div class="day-tag">Sketch and docs launch</div>
    </div>
    <div class="day phase-browser" data-target="march-24">
      <div class="day-head"><div class="day-number">24</div><div class="day-title">Policy Truth</div></div>
      <ul class="day-bullets">
        <li>Policy truth</li>
        <li>Browser row surface cleanup</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Browser foundations</div>
    </div>
    <div class="day phase-browser" data-target="march-25">
      <div class="day-head"><div class="day-number">25</div><div class="day-title">Worker Cutover</div></div>
      <ul class="day-bullets">
        <li>Worker cutover</li>
        <li>Browser selection pass</li>
        <li>Reference loading</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+25025</span> <span class="day-diff-minus">-5486</span></div>
      <div class="day-tag">Browser and worker</div>
    </div>
    <div class="day phase-transform" data-target="march-26">
      <div class="day-head"><div class="day-number">26</div><div class="day-title">Transform Shell</div></div>
      <ul class="day-bullets">
        <li>Transform shell</li>
        <li>Grouped history</li>
        <li>Console sync cleanup</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+15240</span> <span class="day-diff-minus">-4295</span></div>
      <div class="day-tag">Transform parity</div>
    </div>
    <div class="day phase-transform" data-target="march-27">
      <div class="day-head"><div class="day-number">27</div><div class="day-title">Transform Polish</div></div>
      <ul class="day-bullets">
        <li>Snap visuals</li>
        <li>History scrub</li>
        <li>Console and toolbar parity</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+20864</span> <span class="day-diff-minus">-2281</span></div>
      <div class="day-tag">Transform polish</div>
    </div>
    <div class="day phase-browser" data-target="march-28">
      <div class="day-head"><div class="day-number">28</div><div class="day-title">Browser Converge</div></div>
      <ul class="day-bullets">
        <li>Unified Browser tree</li>
        <li>Owner routing</li>
        <li>Drag and import cleanup</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+19080</span> <span class="day-diff-minus">-2639</span></div>
      <div class="day-tag">Browser convergence</div>
    </div>

    <div class="day phase-browser" data-target="march-29">
      <div class="day-head"><div class="day-number">29</div><div class="day-title">Browser Rows</div></div>
      <ul class="day-bullets">
        <li>Browser rows</li>
        <li>Visibility polish</li>
        <li>Transform parity</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+1613</span> <span class="day-diff-minus">-309</span></div>
      <div class="day-tag">Browser and transform</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="march-30">
      <div class="day-head"><div class="day-number">30</div><div class="day-title">Workspace Shell</div></div>
      <ul class="day-bullets">
        <li>Workspace shell</li>
        <li>Slots and popouts</li>
        <li>Persistence</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+16558</span> <span class="day-diff-minus">-2317</span></div>
      <div class="day-tag">Workspace foundation</div>
    </div>
    <div class="day phase-split-polish" data-target="march-31">
      <div class="day-head"><div class="day-number">31</div><div class="day-title">Dock Polish</div></div>
      <ul class="day-bullets">
        <li>Dock polish</li>
        <li>Split previews</li>
        <li>Toolbar ownership</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+15321</span> <span class="day-diff-minus">-870</span></div>
      <div class="day-tag">Split and dock polish</div>
    </div>
    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day empty"></div>
  </div>
</div>

<div class="calendar-nested-weeks">
  <details class="calendar-week-details">
  <summary>Week of March 2-8</summary>

  <details class="calendar-day-details" id="march-2">
  <summary>March 2 - Monday</summary>
  <ul>
    <li>Project kickoff</li>
    <li>First setup pass</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  <details class="calendar-day-details" id="march-3">
  <summary>March 3 - Tuesday</summary>
  <ul>
    <li>Feature stack buildout</li>
    <li>Node UI pass</li>
    <li>Drivers and part templates</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  <details class="calendar-day-details" id="march-4">
  <summary>March 4 - Wednesday</summary>
  <ul>
    <li>Node UI cleanup</li>
    <li>Driver wiring</li>
    <li>Runtime bridge hardening</li>
  </ul>
  <div class="calendar-day-git">Git diff: 3 commits, 158 files, +32519 / -2.</div>
  <ul class="calendar-commit-list">
    <li>`41a96ea` Add GitHub Pages deployment workflow</li>
    <li>`638ae2e` Spaghetti Editor</li>
    <li>`43834f3` Initial commit - ParaHook configurator architecture</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-5">
  <summary>March 5 - Thursday</summary>
  <ul>
    <li>Feature stack growth</li>
    <li>Param-input groundwork</li>
    <li>Docs and layout polish</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, 163 files, +39219 / -1911.</div>
  <ul class="calendar-commit-list">
    <li>`88d4f73` I got demoted - im scared of boss</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-6">
  <summary>March 6 - Friday</summary>
  <ul>
    <li>History rebuild</li>
    <li>Chill-log setup</li>
    <li>Phase-system consolidation</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  <details class="calendar-day-details" id="march-7">
  <summary>March 7 - Saturday</summary>
  <ul>
    <li>Changelog rules</li>
    <li>Repo docs cleanup</li>
    <li>Workflow tightening</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  <details class="calendar-day-details" id="march-8">
  <summary>March 8 - Sunday</summary>
  <ul>
    <li>Phase-plan reconstruction</li>
    <li>Planning rules pass</li>
    <li>Legacy planning setup</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  </details>

  <details class="calendar-week-details">
  <summary>Week of March 9-15</summary>

  <details class="calendar-day-details" id="march-9">
  <summary>March 9 - Monday</summary>
  <ul>
    <li>Graph document persistence</li>
    <li>Browser-first groundwork</li>
    <li>Multi-viewport start</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  <details class="calendar-day-details" id="march-10">
  <summary>March 10 - Tuesday</summary>
  <ul>
    <li>Cached graph lifecycle</li>
    <li>Save/load planning</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, 158 files, +34387 / -21653.</div>
  <ul class="calendar-commit-list">
    <li>`613ed24` Docs on Docs</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-11">
  <summary>March 11 - Wednesday</summary>
  <ul>
    <li>Content ownership</li>
    <li>Preview routing</li>
    <li>Roadmap and task docs</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  <details class="calendar-day-details" id="march-12">
  <summary>March 12 - Thursday</summary>
  <ul>
    <li>Workspace shell cleanup</li>
    <li>Browser actions</li>
    <li>Split dock and composition</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  <details class="calendar-day-details" id="march-13">
  <summary>March 13 - Friday</summary>
  <ul>
    <li>Graph-row save states</li>
    <li>Build state polish</li>
    <li>Dock and split controls</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, 115 files, +30631 / -4620.</div>
  <ul class="calendar-commit-list">
    <li>`266a553` UI Polish</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-14">
  <summary>March 14 - Saturday</summary>
  <ul>
    <li>Went snowboarding</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  <details class="calendar-day-details" id="march-15">
  <summary>March 15 - Sunday</summary>
  <ul>
    <li>Browser row cleanup</li>
    <li>Roadmap note sync</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  </details>

  <details class="calendar-week-details">
  <summary>Week of March 16-22</summary>

  <details class="calendar-day-details" id="march-16">
  <summary>March 16 - Monday</summary>
  <ul>
    <li>Reference workspace</li>
    <li>Graph documents</li>
    <li>Viewer grid and imports</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, 30 files, +2748 / -234.</div>
  <ul class="calendar-commit-list">
    <li>`4542c1d` Content tree</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-17">
  <summary>March 17 - Tuesday</summary>
  <ul>
    <li>Spaghetti surface cleanup</li>
    <li>Shell polish</li>
    <li>Browser visibility pass</li>
  </ul>
  <div class="calendar-day-git">Git diff: 6 commits, 197 files, +831620 / -4180.</div>
  <ul class="calendar-commit-list">
    <li>`169aa64` some ui</li>
    <li>`8175532` oops</li>
    <li>`1493b37` might fuck this next part up so im gunna commit</li>
    <li>`067aa0a` roadmap stuff</li>
    <li>`1b5c47d` build errors</li>
    <li>`d39cd30` Console</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-18">
  <summary>March 18 - Wednesday</summary>
  <ul>
    <li>SketchPlane overlays</li>
    <li>Ghost planes</li>
    <li>Viewport tool panel</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  <details class="calendar-day-details" id="march-19">
  <summary>March 19 - Thursday</summary>
  <ul>
    <li>Console staged polish</li>
    <li>Sketch toolbar density cleanup</li>
  </ul>
  <div class="calendar-day-git">Git diff: 2 commits, 108 files, +36234 / -4713.</div>
  <ul class="calendar-commit-list">
    <li>`2043f65` console stuff</li>
    <li>`abbbccf` SketchPlane</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-20">
  <summary>March 20 - Friday</summary>
  <ul>
    <li>Radio runtime</li>
    <li>Sampler controls</li>
    <li>Sketch session groundwork</li>
  </ul>
  <div class="calendar-day-git">Git diff: 3 commits, 110 files, +25033 / -1394.</div>
  <ul class="calendar-commit-list">
    <li>`b82d308` sequencer</li>
    <li>`3699f73` RADIO IS BACK!!!!</li>
    <li>`930729a` console stuff more</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-21">
  <summary>March 21 - Saturday</summary>
  <ul>
    <li>MkDocs setup</li>
    <li>Sketch ownership</li>
    <li>Move commands and radio polish</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, 18 files, +3092 / -77.</div>
  <ul class="calendar-commit-list">
    <li>`87f3fb9` Sequencer</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-22">
  <summary>March 22 - Sunday</summary>
  <ul>
    <li>AppShell extraction</li>
    <li>Camera controls</li>
    <li>Sketch draw expansion</li>
  </ul>
  <div class="calendar-day-git">Git diff: 5 commits, 215 files, +48246 / -22153.</div>
  <ul class="calendar-commit-list">
    <li>`0e939f4` Camera stuff</li>
    <li>`a615aea` Appshell break up 2</li>
    <li>`3a6e6e6` app shell break up 1</li>
    <li>`e1d35ea` CSS break up</li>
    <li>`707bcb7` Sketch Draw Lines</li>
  </ul>
  </details>

  </details>

  <details class="calendar-week-details">
  <summary>Week of March 23-29</summary>

  <details class="calendar-day-details" id="march-23">
  <summary>March 23 - Monday</summary>
  <ul>
    <li>Sketch console routing</li>
    <li>Viewer pan fixes</li>
    <li>Docs site publish</li>
  </ul>
  <div class="calendar-day-git">Git diff: 3 commits, 103 files, +10644 / -680.</div>
  <ul class="calendar-commit-list">
    <li>`6910eb4` hrm</li>
    <li>`810a2b0` mk Docs host</li>
    <li>`39e4c89` little bit of this, little bit of that</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-24">
  <summary>March 24 - Tuesday</summary>
  <ul>
    <li>Policy truth</li>
    <li>Browser row surface cleanup</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  </details>

  <details class="calendar-day-details" id="march-25">
  <summary>March 25 - Wednesday</summary>
  <ul>
    <li>Worker cutover</li>
    <li>Browser selection pass</li>
    <li>Reference loading</li>
  </ul>
  <div class="calendar-day-git">Git diff: 5 commits, 171 files, +25025 / -5486.</div>
  <ul class="calendar-commit-list">
    <li>`b0266c1` fallin asleep</li>
    <li>`039e186` Console stuff</li>
    <li>`cf4db8c` WRK/ARCH: Graph-Native Worker Cutover and Legacy Contract Deletion [5.3A-7]</li>
    <li>`0a5d747` Browser Selecting</li>
    <li>`65e6726` Browser Build Policy</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-26">
  <summary>March 26 - Thursday</summary>
  <ul>
    <li>Transform shell</li>
    <li>Grouped history</li>
    <li>Console sync cleanup</li>
  </ul>
  <div class="calendar-day-git">Git diff: 2 commits, 112 files, +15240 / -4295.</div>
  <ul class="calendar-commit-list">
    <li>`7403bc0` Transform Toolbar more</li>
    <li>`7cd7fae` Transform 1-3</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-27">
  <summary>March 27 - Friday</summary>
  <ul>
    <li>Snap visuals</li>
    <li>History scrub</li>
    <li>Console and toolbar parity</li>
  </ul>
  <div class="calendar-day-git">Git diff: 7 commits, 145 files, +20864 / -2281.</div>
  <ul class="calendar-commit-list">
    <li>`f61167d` Transform 14</li>
    <li>`cacfad8` Transform 13 & workspace planning</li>
    <li>`704d3e8` Transform 13</li>
    <li>`a5d1c85` Transform 9 + mk docs</li>
    <li>`d0dee14` mk docs cleanup</li>
    <li>`238783b` Transform 7,8</li>
    <li>`418f192` Transform history</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-28">
  <summary>March 28 - Saturday</summary>
  <ul>
    <li>Unified Browser tree</li>
    <li>Owner routing</li>
    <li>Drag and import cleanup</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, 80 files, +19080 / -2639.</div>
  <ul class="calendar-commit-list">
    <li>`3c9c5e4` fuckin</li>
  </ul>
  </details>

  <details class="calendar-day-details" id="march-29">
  <summary>March 29 - Sunday</summary>
  <ul>
    <li>Browser rows</li>
    <li>Visibility polish</li>
    <li>Transform parity</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, 21 files, +1613 / -309.</div>
  <ul class="calendar-commit-list">
    <li>`7c26def` Browser-11</li>
  </ul>
  </details>

  </details>

  <details class="calendar-week-details">
  <summary>Week of March 30-31</summary>

  <details class="calendar-day-details" id="march-30">
  <summary>March 30 - Monday</summary>
  <ul>
    <li>Workspace shell</li>
    <li>Slots and popouts</li>
    <li>Persistence</li>
  </ul>
  <div class="calendar-day-git">Git diff: 3 commits, 102 files, +16558 / -2317.</div>
  <ul class="calendar-commit-list">
    <li>`0e82373` workspace planning 7</li>
    <li>`b2861dc` workspace modes fail</li>
    <li>`eb1bf6d` Workspace-Modes Phases 1-5</li>
  </ul>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (11)</summary>
    <ul class="calendar-commit-list">
      <li>`Workspace 7.2c-1 - Primary Viewport Left Dock Host Extraction`</li>
      <li>`Workspace 7.1 - Viewport Slot Foundations, Header Shell, And First Split Loop`</li>
      <li>`Workspace 7.2b - Host-Mode Parity And Split-Host Retirement`</li>
      <li>`Workspace 7.2 - Duplicated Surface Instances, Restore Rules, And Host-Mode Parity`</li>
      <li>`Workspace 5.1 - Spaghetti Editor Child-Window Pop-Out And Dock-Back Restore`</li>
      <li>`Workspace 5.2 - Multiple Editor Surface Instances And Graph Binding`</li>
      <li>`Workspace 5 - Multi-Window Surfaces And Detached Browser Pop-Out`</li>
      <li>`Workspace 4 - Persistence, Saved Modes, And Migration`</li>
      <li>`Workspace 3 - Viewport-Local Chrome And Toolbar Host`</li>
      <li>`Workspace 2 - First Hosted Surface Migration And Transitional Adapters`</li>
      <li>`Workspace 1 - Shared Workspace Owner And State Extraction`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="march-31">
  <summary>March 31 - Tuesday</summary>
  <ul>
    <li>Dock polish</li>
    <li>Split previews</li>
    <li>Toolbar ownership</li>
    <li>Run-up into Workspace 7.5-x</li>
  </ul>
  <div class="calendar-day-git">Git diff: 2 commits, 90 files, +15321 / -870.</div>
  <ul class="calendar-commit-list">
    <li>`1a90d36` Browser 7.3 - split model viewports</li>
    <li>`bec692f` Browser Cleanup</li>
  </ul>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (14)</summary>
    <ul class="calendar-commit-list">
      <li>`Workspace 7.5-1 - Shared Surface Placement Contract And Host Route Ownership`</li>
      <li>`Workspace 7.3-2 - Per-Viewport Host Targeting And Viewer Rehome Parity`</li>
      <li>`Workspace 7.3-1 - Second Model Viewport Runtime And Slot Truth`</li>
      <li>`Workspace 7.2f - Dual-Band Edge Intent And Whole-Browser Split Signaling`</li>
      <li>`Workspace 7.2f-2 - Four-Side Expansion And Whole-Browser Ghost Layering`</li>
      <li>`Workspace 7.2f-1 - Dual-Band Edge Intent State And Right-Side Proof`</li>
      <li>`Workspace 7.2d-2 - Browser Toolbar Claim And Rehoming Parity`</li>
      <li>`Workspace 7.2e - Adaptive Split Preview Ghosts And Pane-Aware Nested Docking`</li>
      <li>`Workspace 7.2e-2 - Adaptive Dual Ghost Nested Split Suggestions`</li>
      <li>`Workspace 7.2e-1 - Cursor-Driven Pane Split Preview Precision`</li>
      <li>`Workspace 7.2d-1 - Browser Toolbar Owner State And AppShell Repoint`</li>
      <li>`Workspace 7 - Viewport Slot Architecture And Surface Swapping`</li>
      <li>`Workspace 7.2c-3 - Old Left Dock Shell Retirement And Cleanup`</li>
      <li>`Workspace 7.2c-2 - Left Dock Ref Repoint And Behavior Parity`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-week-details">
  <summary>Week of April 19-26</summary>

  <details class="calendar-day-details" id="april-19">
  <summary>April 19 - Sunday</summary>
  <ul>
    <li>Opened with Environment-2 recall, quick A/B compare helpers, and persisted environment-look workflows</li>
    <li>Launched the Home Page surface with startup return, launch actions, storage transparency, recent-item wiring, and a compact orientation strip</li>
    <li>Closed the day by routing Console workspace modes through the shared surface catalog and unified workspace action eligibility model</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit in this checkout.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (11)</summary>
    <ul class="calendar-commit-list">
      <li>`Environment-2 - Phase 3 - Add Persistence For Environment Look Workflows`</li>
      <li>`Environment-2 - Phase 4 - Add Recall And Quick A/B Compare Helpers`</li>
      <li>`Catalog-7 - Phase 1 - Local Taxonomy Contract And Seed Metadata`</li>
      <li>`Catalog-7 - Phase 2 - Part And Platform Browse Modes`</li>
      <li>`Catalog-7 - Phase 3 - Predictable Filter Semantics`</li>
      <li>`Home-Page-1 - Surface Registry And Minimal Render`</li>
      <li>`Home-Page-1 - First Launch Actions And Closeout`</li>
      <li>`Home-Page-2 - Storage Transparency And Persistence Controls`</li>
      <li>`Home-Page-5 - Recent-Items Inventory And Toggle Wiring`</li>
      <li>`Console-1 - Shared Workspace Action Eligibility Through Runtime Execution`</li>
      <li>`Console-1 - Surface Catalog Expansion Proof And Generation Closeout`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-20">
  <summary>April 20 - Monday</summary>
  <ul>
    <li>Started the Control Deck Home Page shell and then shifted hard into Catalog Gen2 external source, archive, and attribution groundwork</li>
    <li>Added external source page actions, linked archive metadata, platform and fitment mapping, XR PubWheel asset-set contracts, and broader PubParts cache coverage</li>
    <li>Finished with PubParts download storage, staged downloads and inspection flows, selected-file import handoff, local folder discovery, Dropbox chooser repair, and shared direct-file resolution</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit in this checkout.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (15)</summary>
    <ul class="calendar-commit-list">
      <li>`Home-Page-6 - Control Deck Shell And Launch Rail`</li>
      <li>`Catalog-Gen2-0 - Intake Readiness And Source Handoff Closeout`</li>
      <li>`Catalog-Gen2-1 - External Source Contract, Attribution, And Cached Source Repair`</li>
      <li>`Catalog-Gen2-2 - External Source Page Action Support And Archive Classification`</li>
      <li>`Catalog-7 - Wheel-Specific Motor And Tire Fitment Fields`</li>
      <li>`Catalog-Gen2-3 - Platform Mapping And Fitment Notes`</li>
      <li>`Catalog-Gen2-4 - External Type System Mapping Baseline`</li>
      <li>`Catalog-Gen2-4.5 - XR PubWheel Versioned Asset Sets`</li>
      <li>`Catalog-Gen2-7 - Full PubParts Cache Coverage And Eager Preview Images`</li>
      <li>`Catalog-Gen2-8 - External Source Action Boundary Through Selected File Import Handoff`</li>
      <li>`Catalog-Gen2-5 - Catalog Surface Cleanup And Scroll Containment`</li>
      <li>`Catalog-Gen2-9 - Local PubParts Library Folder And Auto-Discovery Handoff`</li>
      <li>`Catalog-Gen2-10 - Dropbox Chooser Add-To-Project Bridge And Diagnostic Repair`</li>
      <li>`Catalog-Gen2-11 - Dropbox Shared Direct File Resolver`</li>
      <li>`Catalog-Gen2-11 - ZIP And Archive Candidate Inspection`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-21">
  <summary>April 21 - Tuesday</summary>
  <ul>
    <li>Built the ZIP-entry catalog path from browser ZIP reading through manifest caching, selected entry extraction, preview candidates, source-option preview, and import-review handoff</li>
    <li>Expanded local library mirror and PubParts metadata refresh work while hardening viewer and runtime ownership around loaded-but-missing references and source fallback behavior</li>
    <li>Closed with a dense Catalog cleanup pass across browse rail density, part and platform section boxes, multi-select group filtering, left-rail facets, ZIP drop acceptance, and in-surface back-forward navigation</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit in this checkout.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (18)</summary>
    <ul class="calendar-commit-list">
      <li>`Catalog-Gen2-12 - ZIP Reader, Entry Listing, Extraction, Cache, And Browser Fallback`</li>
      <li>`Catalog-Gen2-13 - Source Actions, ZIP Entry Staged Importer List, And Preview Affordance`</li>
      <li>`Catalog-Gen2-14 - Runtime Ownership Contract, ViewerHost Rehydration, And Bug 22 Closeout`</li>
      <li>`Catalog-Gen2-15 - OPFS Capability And Optional Local Library Folder Mirror`</li>
      <li>`Catalog-Gen2-16 - Preview Candidate Contract Through Uploaded ZIP Entry Preview`</li>
      <li>`Catalog-Gen2-17 - Direct Source Byte Materialization And Trusted Provider Boundary`</li>
      <li>`Catalog-Gen2-18 - Runtime PubParts Metadata Refresh And Source-Update Preservation`</li>
      <li>`Catalog Cleanup - Resizable Browse Rail Edge`</li>
      <li>`Catalog Cleanup - Compact Browse Rail Rows`</li>
      <li>`Catalog Cleanup - Catalog Info Page And Rail Utility Cleanup`</li>
      <li>`Catalog Cleanup - Part And Platform Browse Section Boxes`</li>
      <li>`Catalog Cleanup - Browse Groups Multi-Select Filtering`</li>
      <li>`Catalog Cleanup - Left Rail Faceted Filters`</li>
      <li>`Catalog Cleanup - Expanded Part Facet Taxonomy`</li>
      <li>`Catalog Cleanup - Facet Selection Mode Toggle`</li>
      <li>`Catalog Cleanup - Store-Style Left Rail Facets`</li>
      <li>`Catalog Cleanup - PubParts ZIP Drop Acceptance`</li>
      <li>`Catalog Cleanup - In-Surface Back Forward Navigation`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-22">
  <summary>April 22 - Wednesday</summary>
  <ul>
    <li>Opened the Edit History reader surface with public metadata, picker reachability, and local source filtering polish</li>
    <li>Added checkpoint ownership and restore-boundary proof without widening into runtime checkpoint UI or storage systems</li>
    <li>Spent the rest of the day on Sketch Draw undo: canonical authored-command entries, viewport `Ctrl+Z`, staged command buffering, focused Console ownership, and durable local history batches</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit in this checkout.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (9)</summary>
    <ul class="calendar-commit-list">
      <li>`Edit-History-Gen3-1 - Reader Contract And UX Shape Proof`</li>
      <li>`Edit-History-Gen3-1 - Read-Only History Reader UI`</li>
      <li>`Edit-History-Gen3-1 - Reader Grouping And Filtering Polish`</li>
      <li>`Edit-History-Gen3-2 - Checkpoint Ownership And Restore Boundary Proof`</li>
      <li>`Edit-History-Gen4-1 - Sketch Draw Authored Command Undo`</li>
      <li>`Edit-History-Gen4-1 - Viewport Ctrl+Z Shortcut Ownership`</li>
      <li>`Edit-History-Gen4-2 - Sketch Draw Staged Command Buffer`</li>
      <li>`Edit-History-Gen4-3 - Console-Focused Sketch Draw Undo Ownership`</li>
      <li>`Edit-History-Gen5-1 - Durable CAD Local History Batches`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-23">
  <summary>April 23 - Thursday</summary>
  <ul>
    <li>Oak City Shred Fest 2026</li>
  </ul>
  <div class="calendar-day-git">Git diff: time off.</div>
  </details>

  <details class="calendar-day-details" id="april-24">
  <summary>April 24 - Friday</summary>
  <ul>
    <li>Oak City Shred Fest 2026</li>
  </ul>
  <div class="calendar-day-git">Git diff: time off.</div>
  </details>

  <details class="calendar-day-details" id="april-25">
  <summary>April 25 - Saturday</summary>
  <ul>
    <li>Oak City Shred Fest 2026</li>
  </ul>
  <div class="calendar-day-git">Git diff: time off.</div>
  </details>

  <details class="calendar-day-details" id="april-26">
  <summary>April 26 - Sunday</summary>
  <ul>
    <li>Oak City Shred Fest 2026</li>
  </ul>
  <div class="calendar-day-git">Git diff: time off.</div>
  </details>

  </details>

  <details class="calendar-week-details">
  <summary>Week of April 27-May 2</summary>

  <details class="calendar-day-details" id="april-27">
  <summary>April 27 - Monday</summary>
  <ul>
    <li>Cleaned up the MkDocs strict-build warning lane so docs-site builds stop carrying the remaining strict-mode warning</li>
    <li>Kept the pass narrow to documentation build hygiene instead of widening into broader docs-structure reshaping</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (1)</summary>
    <ul class="calendar-commit-list">
      <li>`DOCS - MkDocs Strict Build Warning Cleanup`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="april-30">
  <summary>April 30 - Thursday</summary>
  <ul>
    <li>Built Edit-History Workspace 4 from the timeline read model through timeline UI, marker jumps, vertical scrub rail, draggable release, and snapped scrub preview</li>
    <li>Polished the rail visuals with card-slot alignment, blue theme cleanup, compact current-position markers, thin rails, centered dots, and snapshot activity logging</li>
    <li>Closed with viewer shortcut repairs so modified shortcut routing and middle-mouse double-click pan behavior stay honest beside the new history workspace</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (16)</summary>
    <ul class="calendar-commit-list">
      <li>`Edit-History-Workspace-4 - Phase 8 - Rail Dot Card-Center Alignment`</li>
      <li>`Edit-History-Workspace-4 - Phase 8 - Thin Timeline Rail And Entry Dots`</li>
      <li>`Edit-History-Workspace-4 - Phase 7 - Compact Current Position Marker Row`</li>
      <li>`Edit-History-Workspace-4 - Phase 6 - Smooth Scrub Handle With Snapped Preview`</li>
      <li>`Edit-History-Workspace-4 - Phase 5 - Scrub Rail Blue Theme Polish`</li>
      <li>`Edit-History-Workspace-4 - Phase 5 - Scrub Rail Card-Slot Alignment`</li>
      <li>`Edit-History-Workspace-4 - Phase 5 - Draggable Marker Scrub Release`</li>
      <li>`Edit-History-Workspace-4 - Phase 4 - Vertical Scrub Rail And Click Targets`</li>
      <li>`Edit-History-Workspace-4 - Phase 3 - Marker Jump Routing`</li>
      <li>`Edit-History-Workspace-4 - Phase 2 - Timeline UI`</li>
      <li>`Edit-History-Workspace-4 - Phase 1 - Timeline Read Model`</li>
      <li>`Edit-History - Sketch Draw Pending Tab`</li>
      <li>`Edit-History - Snapshot Log Sequence Numbers`</li>
      <li>`Edit-History - Snapshot Activity Log`</li>
      <li>`Camera-Controls - Middle-Mouse Double-Click Pan Separation`</li>
      <li>`Camera-Controls - Modified Viewer Shortcut Routing Repair`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="may-1">
  <summary>May 1 - Friday</summary>
  <ul>
    <li>Expanded Edit-History Workspace 4 with grouped timeline cards, child summaries, scrub-list overflow cleanup, reader text density, newest-first order, and chevron alignment polish</li>
    <li>Shipped the deeper scrub stack with expanded child preview stops, canonical pointer auditing, snapshot activity separation, expanded child boundaries, restore points, and explicit scrub mode</li>
    <li>Added edit-history parity for extrude parameter rows plus node creation and deletion, then opened the next Spaghetti lane with window-density truth and overlay O-mode entry</li>
  </ul>
  <div class="calendar-day-git">Git diff: 1 commit, 65 files, +10632 / -278.</div>
  <ul class="calendar-commit-list">
    <li>`bb36df0` Edit history more after break OCSF</li>
  </ul>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (20)</summary>
    <ul class="calendar-commit-list">
      <li>`SP - Phase 1 - Window Density Truth And O Mode Entry`</li>
      <li>`Edit-History-3 - Phase 7 - Node Deletion Surface History Parity`</li>
      <li>`Edit-History-3 - Phase 6 - Node Creation Surface History Parity`</li>
      <li>`Edit-History-3 - Phase 5 - Extrude Node Template Row Parameter Commits`</li>
      <li>`Edit-History-Workspace-4 - Phase 13 - Sketch Draw History Scrub Mode`</li>
      <li>`Edit-History-Workspace-4 - Phase 12 - Sketch Draw Child Restore Points`</li>
      <li>`Edit-History-Workspace-4 - Phase 11C - Expanded Child Boundary Policy`</li>
      <li>`Edit-History-Workspace-4 - Phase 11B - Snapshot Activity Separation`</li>
      <li>`Edit-History-Workspace-4 - Phase 11A - Canonical Scrub Pointer Audit`</li>
      <li>`Edit-History-Workspace-4 - Phase 11 - Expanded Child Scrub Preview Stops`</li>
      <li>`Edit History Workspace - Inline Chevron Alignment`</li>
      <li>`Edit History Workspace - Timeline Chevron And Entry Numbers`</li>
      <li>`Edit History Workspace - Newest First Timeline Order`</li>
      <li>`Edit History Workspace - Compact Marker Height Polish`</li>
      <li>`Edit History Workspace - Timeline Dot And Handle Polish`</li>
      <li>`Edit History Workspace - Scrub Lane Overflow Fix`</li>
      <li>`Edit History Workspace - Timeline Scrub List Scrollbar`</li>
      <li>`Edit History Workspace - Reader Text Density`</li>
      <li>`Edit-History-Workspace-4 - Phase 10 - Sketch Draw Commit Child Summaries`</li>
      <li>`Edit-History-Workspace-4 - Phase 9 - Expandable Timeline Group Cards`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="may-2">
  <summary>May 2 - Saturday</summary>
  <ul>
    <li>Turned Spaghetti overlay mode into a viewport-owned lane with titlebar controls, essentials background transparency cleanup, maximize and restore polish, and remembered graph reopen behavior</li>
    <li>Added the Settings shell plus Spaghetti editor default settings, then cleaned up meatball dock hosting, left-dock browser sizing, viewport chrome layering, and overlay canvas visibility</li>
    <li>Finished by shipping Nodes-6 phases 1 through 3 and the invisible full-edge resize hit areas so node width persists, resizes live, and commits honest edit-history entries</li>
  </ul>
  <div class="calendar-day-git">Git diff: no repo commit found for this day.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (30)</summary>
    <ul class="calendar-commit-list">
      <li>`SP - Nodes-6 - Invisible Full-Edge Node Resize Hit Areas`</li>
      <li>`SP - Nodes-6 / Phase 3 - Resize Commit Persistence And Edit-History Seam`</li>
      <li>`SP - Nodes-6 / Phase 2 - Selected Node Resize Handles And Pointer Routing`</li>
      <li>`SP - Nodes-6 / Phase 1 - Node Frame State Contract`</li>
      <li>`SP - Phase 3.1 - Overlay Canvas Visibility Toggle`</li>
      <li>`Viewport Chrome - Left Anchor Overlay Titlebar Controls`</li>
      <li>`Viewport Chrome - Raise Left And Right Docks Above Spaghetti Overlay`</li>
      <li>`SP - Phase 9 - Essentials Canvas Background Default To 50 Percent`</li>
      <li>`SP - Phase 9 - Docked Meatball Collapse Occupancy Follow-Up`</li>
      <li>`SP - Phase 9 - Docked Meatball Collapse Retains Left Toolbar Host`</li>
      <li>`Left-Dock - Browser-Only Startup Height Cap Cleanup`</li>
      <li>`Left-Dock - Docked Browser Host Height Cleanup`</li>
      <li>`Left-Dock-1 - Phase 1 - Read-Only Shared Stack Resizing Baseline`</li>
      <li>`SP - Phase 9 - Floating Spaghetti Build Reload Glyph`</li>
      <li>`SP - Phase 9 - Floating Spaghetti Build Glyph Cleanup`</li>
      <li>`SP - Phase 9 - Floating Spaghetti Build Button Reorder`</li>
      <li>`SP - Phase 9 - Floating Spaghetti Popout Glyph Cleanup`</li>
      <li>`SP - Phase 9 - Floating Spaghetti Split Button Cleanup`</li>
      <li>`SP - Phase 9 - Meatball Dock Portal Retargeting Across Split Remounts`</li>
      <li>`SP - Phase 8 - Graph Opens Restore Remembered Viewports And Fall Back To Canvas Fit`</li>
      <li>`Settings-1 - Phase 2 - Spaghetti Editor Window Default Settings`</li>
      <li>`Settings-1 - Viewport Type Menu Adds Settings`</li>
      <li>`Settings-1 - Unreal-Style Settings Shell And Section Router`</li>
      <li>`SP - Smaller Maximized Drag Restore Size`</li>
      <li>`SP - Maximized Editor Restore-On-Drag Behavior`</li>
      <li>`SP - Maximized Editor Topmost Layer Fix`</li>
      <li>`SP - Floating Editor Maximize Icon And Front-Activation Cleanup`</li>
      <li>`SP - Phase 4 - Essentials Canvas Background Transparency Cleanup`</li>
      <li>`SP - Phase 3 - Overlay Titlebar Controls And Surface Cleanup`</li>
      <li>`SP - Phase 2 - Overlay Viewport Ownership And Hit-Testing`</li>
    </ul>
  </details>
  </details>

  </details>

  </details>
</div>

</details>

## May 2026

<details class="calendar-month" open>
<summary>May 2026</summary>

<div class="month-shell">
  <div class="month-header">
    <div>
      <h3>May 2026</h3>
      <p>Opened with Edit History and Spaghetti overlay work, then moved through Nodes-6 hardening, Cleanup Gen3 extraction, Workspace-9 corner split gestures, Properties and Materials buildout, Model Viewport display/render-preview work, and Settings-2 Key Bindings.</p>
    </div>
  </div>

  <div class="month-grid">
    <div class="weekday">Sun</div>
    <div class="weekday">Mon</div>
    <div class="weekday">Tue</div>
    <div class="weekday">Wed</div>
    <div class="weekday">Thu</div>
    <div class="weekday">Fri</div>
    <div class="weekday">Sat</div>

    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day phase-workspace-foundation" data-target="may-1">
      <div class="day-head"><div class="day-number">1</div><div class="day-title">History</div></div>
      <ul class="day-bullets">
        <li>Timeline groups and child summaries</li>
        <li>Scrub preview and restore points</li>
        <li>Node parity and O mode</li>
      </ul>
      <div class="day-diff"><span class="day-diff-plus">+10632</span> <span class="day-diff-minus">-278</span></div>
      <div class="day-tag">Edit History parity and Spaghetti O-mode</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="may-2">
      <div class="day-head"><div class="day-number">2</div><div class="day-title">Spaghetti</div></div>
      <ul class="day-bullets">
        <li>Overlay ownership and titlebar controls</li>
        <li>Settings shell and defaults</li>
        <li>Left dock and Nodes-6 resize sprint</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">git none</span></div>
      <div class="day-tag">Spaghetti, Settings, and Nodes-6 sprint</div>
    </div>

    <div class="day empty">
      <div class="day-number">3</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="may-4">
      <div class="day-head"><div class="day-number">4</div><div class="day-title">Nodes</div></div>
      <ul class="day-bullets">
        <li>Output preview shell adoption</li>
        <li>Family frame parity</li>
        <li>Nodes-6 hardening handoff</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">3 changelog entries</span></div>
      <div class="day-tag">Nodes-6 closeout</div>
    </div>
    <div class="day phase-build-fix" data-target="may-5">
      <div class="day-head"><div class="day-number">5</div><div class="day-title">Cleanup</div></div>
      <ul class="day-bullets">
        <li>Cleanup Gen3 extraction</li>
        <li>Browser and transform slices</li>
        <li>Sketch and history adapters</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">25 changelog entries</span></div>
      <div class="day-tag">Cleanup Gen3 extraction sprint</div>
    </div>
    <div class="day phase-build-fix" data-target="may-6">
      <div class="day-head"><div class="day-number">6</div><div class="day-title">Sketch Slices</div></div>
      <ul class="day-bullets">
        <li>Draw draft commit extraction</li>
        <li>Geometry sketch selection actions</li>
        <li>Component edit action extraction</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">3 changelog entries</span></div>
      <div class="day-tag">Geometry sketch cleanup</div>
    </div>
    <div class="day phase-split-polish" data-target="may-7">
      <div class="day-head"><div class="day-number">7</div><div class="day-title">Corners</div></div>
      <ul class="day-bullets">
        <li>Narrow shared split line</li>
        <li>Corner hotspot shell</li>
        <li>Filleted pane start</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">2 changelog entries</span></div>
      <div class="day-tag">Workspace-9 corner split start</div>
    </div>
    <div class="day empty">
      <div class="day-number">8</div>
    </div>
    <div class="day phase-split-polish" data-target="may-9">
      <div class="day-head"><div class="day-number">9</div><div class="day-title">Split Gesture</div></div>
      <ul class="day-bullets">
        <li>Corner gesture phases</li>
        <li>Resize continuity proof</li>
        <li>Corner radius settings</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">13 changelog entries</span></div>
      <div class="day-tag">Workspace-9 split gesture buildout</div>
    </div>

    <div class="day phase-workspace-foundation" data-target="may-10">
      <div class="day-head"><div class="day-number">10</div><div class="day-title">Materials</div></div>
      <ul class="day-bullets">
        <li>Properties workspace mount</li>
        <li>Materials targets and presets</li>
        <li>Compact controls and multi-object scope</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">46 changelog entries</span></div>
      <div class="day-tag">Properties and Materials buildout</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="may-11">
      <div class="day-head"><div class="day-number">11</div><div class="day-title">Render Preview</div></div>
      <ul class="day-bullets">
        <li>Materials mixed-value editing</li>
        <li>Shared shell and Settings priority</li>
        <li>Model Viewport display and render preview</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">40 changelog entries</span></div>
      <div class="day-tag">Materials, shells, Settings, and render preview</div>
    </div>
    <div class="day phase-workspace-foundation" data-target="may-12">
      <div class="day-head"><div class="day-number">12</div><div class="day-title">Key Bindings</div></div>
      <ul class="day-bullets">
        <li>Shortcut inventory source map</li>
        <li>Normalized shortcut read model</li>
        <li>Grouped Key Bindings pane</li>
      </ul>
      <div class="day-diff"><span class="day-diff-neutral">4 changelog entries</span></div>
      <div class="day-tag">Settings-2 Key Bindings start</div>
    </div>
    <div class="day empty">
      <div class="day-number">13</div>
    </div>
    <div class="day empty">
      <div class="day-number">14</div>
    </div>
    <div class="day empty">
      <div class="day-number">15</div>
    </div>
    <div class="day empty">
      <div class="day-number">16</div>
    </div>

    <div class="day empty">
      <div class="day-number">17</div>
    </div>
    <div class="day empty">
      <div class="day-number">18</div>
    </div>
    <div class="day empty">
      <div class="day-number">19</div>
    </div>
    <div class="day empty">
      <div class="day-number">20</div>
    </div>
    <div class="day empty">
      <div class="day-number">21</div>
    </div>
    <div class="day empty">
      <div class="day-number">22</div>
    </div>
    <div class="day empty">
      <div class="day-number">23</div>
    </div>

    <div class="day empty">
      <div class="day-number">24</div>
    </div>
    <div class="day empty">
      <div class="day-number">25</div>
    </div>
    <div class="day empty">
      <div class="day-number">26</div>
    </div>
    <div class="day empty">
      <div class="day-number">27</div>
    </div>
    <div class="day empty">
      <div class="day-number">28</div>
    </div>
    <div class="day empty">
      <div class="day-number">29</div>
    </div>
    <div class="day empty">
      <div class="day-number">30</div>
    </div>

    <div class="day empty">
      <div class="day-number">31</div>
    </div>
    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day empty"></div>
    <div class="day empty"></div>
  </div>
</div>

<div class="calendar-nested-weeks">
  <details class="calendar-week-details">
  <summary>Week of May 3-9</summary>

  <details class="calendar-day-details" id="may-4">
  <summary>May 4 - Monday</summary>
  <ul>
    <li>Closed the Nodes-6 resizing family through Output Preview shell adoption, family frame parity, overflow honesty, hardening, regression proof, and family handoff.</li>
  </ul>
  <div class="calendar-day-git">Changelog coverage: 3 entries.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (3)</summary>
    <ul class="calendar-commit-list">
      <li>`SP - Nodes-6 / Phase 6 - Hardening, Regression Proof, And Family Handoff`</li>
      <li>`SP - Nodes-6 / Phase 5 - Family Frame Parity And Overflow Honesty`</li>
      <li>`SP - Nodes-6 / Phase 4 - Output Preview Shared Shell Adoption`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="may-5">
  <summary>May 5 - Tuesday</summary>
  <ul>
    <li>Kept Spaghetti overlay ownership moving with split-restore memory, overlay z-stack fixes, dock-stack cleanup, and wire-surface history parity.</li>
    <li>Ran a large Cleanup Gen3 extraction sprint across App root helpers, project/reference slices, transform ownership, browser build/release/export/request seams, accepted runtime helpers, graph and part history adapters, and sketch plane/session extraction.</li>
  </ul>
  <div class="calendar-day-git">Changelog coverage: 25 entries.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (25)</summary>
    <ul class="calendar-commit-list">
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 4.5.1 - Draw Session Control Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 4.4 - Geometry Sketch Session Lifecycle Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 4.3 - Geometry Sketch Plane Graph Write Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 4.2 - Sketch Plane Pick Draft Transform Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 4.1 - Sketch Plane Pick Command Session Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 3.4 - Graph Node History Adapter Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 3.3 - Part Feature History Adapter Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 3.2 - Geometry Sketch Commit Adapter Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 3.1 - Geometry Sketch History Helper Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 2 - Pure Types And Accepted Runtime Helper Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 1 / Phase 6.1 - Root Facade Shrink`</li>
      <li>`Cleanup Gen3 - Cleanup 1 / Phase 5.4 - Project Sync And File-Tail Subscription Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 1 / Phase 5.3 - Browser Release And Export Flow Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 1 / Phase 5.2 - Delayed Placeholder And Request Intent Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 1 / Phase 5.1 - Browser Build Policy Slice Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 1 / Phase 4.1 - Transform Session Action Slice Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 1 / Phase 4 - Transform Selection And Context Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 1 / Phase 3 - Project Content And Reference Workspace Slice Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 1 / Phase 2 - Pure Types Helpers And Selector Extraction`</li>
      <li>`SP - Overlay Z Stack Follow-Up - Raise Overlay Presentation Window Layer`</li>
      <li>`SP - Overlay Z Stack - Raise Spaghetti Above Viewport Chrome`</li>
      <li>`SP - Split Restore Memory - Meatball Editor View Support`</li>
      <li>`SP - Build Cleanup - Dock Stack, Node Resize Test, And Overlay State Drift`</li>
      <li>`SP - Edit-History-2 / Phase 1.1 - Wire Surface History Parity`</li>
      <li>`SP - Graph Edit History - Node Move Label Width Fallback Repair`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="may-6">
  <summary>May 6 - Wednesday</summary>
  <ul>
    <li>Finished the geometry sketch cleanup tail by extracting draw draft commit/undo, sketch selection actions, and component edit actions.</li>
  </ul>
  <div class="calendar-day-git">Changelog coverage: 3 entries.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (3)</summary>
    <ul class="calendar-commit-list">
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 4.7 - Geometry Sketch Component Edit Action Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 4.6 - Geometry Sketch Selection Action Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 4.5.2 - Draw Draft Commit And Undo Extraction`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="may-7">
  <summary>May 7 - Thursday</summary>
  <ul>
    <li>Opened the Workspace-9 corner-split lane with a narrower shared split divider plus the first corner hotspot and filleted pane shell.</li>
  </ul>
  <div class="calendar-day-git">Changelog coverage: 2 entries.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (2)</summary>
    <ul class="calendar-commit-list">
      <li>`Workspace-9 / Phase 1 - Corner Hotspot And Filleted Pane Shell`</li>
      <li>`Workspace Split Divider - Narrow Shared Split Line To 5px`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="may-9">
  <summary>May 9 - Saturday</summary>
  <ul>
    <li>Built Workspace-9 corner split gestures through deadzone entry, dominant-axis preview, release/cancel behavior, resize continuity proof, and Settings-owned corner radius preferences.</li>
    <li>Added follow-ups for corner radius consumption, hit-area tracking, nested divider keep-far-pane behavior, and Home Page restore-toggle persistence.</li>
  </ul>
  <div class="calendar-day-git">Changelog coverage: 13 entries.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (13)</summary>
    <ul class="calendar-commit-list">
      <li>`Home-Page / Follow-Up - Workspace Restore Toggle Honors Persisted Refresh State`</li>
      <li>`Workspace / Follow-Up - Keep-Far-Pane Resize Toggle Defaults On`</li>
      <li>`Workspace / Follow-Up - Nested Divider Resize Keep-Far-Pane Toggle`</li>
      <li>`Workspace-9 / Follow-Up - Corner Split Hit Area Tracks Fillet Radius`</li>
      <li>`Workspace-9 / Follow-Up - Workspace Corner Radius Slider Max To 100`</li>
      <li>`Workspace-9 / Phase 8 - Shared Workspace Corner Radius Consumption`</li>
      <li>`Workspace-9 / Phase 7 - Settings-Owned Workspace Corner Radius Preference`</li>
      <li>`Workspace-9 / Phase 5 - Gesture Regression Proof And Resize Continuity`</li>
      <li>`Workspace-9 / Phase 4 - Release Commit And Cancel Behavior`</li>
      <li>`Workspace-9 / Phase 3 - Dominant-Axis Preview Orientation And Footprint`</li>
      <li>`Workspace-9 / Phase 2 - Corner Gesture Session And Deadzone Entry`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction`</li>
      <li>`Cleanup Gen3 - Cleanup 2 / Phase 5.1.1 - Graph Document And Runtime Selector Extraction`</li>
    </ul>
  </details>
  </details>

  </details>

  <details class="calendar-week-details">
  <summary>Week of May 10-12</summary>

  <details class="calendar-day-details" id="may-10">
  <summary>May 10 - Sunday</summary>
  <ul>
    <li>Built Properties-2 into a mounted workspace with tab framing, child section shell states, and viewport type picker reachability.</li>
    <li>Expanded Materials from focused-object intake through editable material controls, assignment flows, imported object fallback, richer fields, project material presets, compact controls, color controls, action rails, search, and multi-object assignment scope.</li>
    <li>Continued Workspace-9 with outer-corner split entry, corner glyph/layering repairs, pane ownership routing, and four-corner split restoration.</li>
  </ul>
  <div class="calendar-day-git">Changelog coverage: 46 entries.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (46)</summary>
    <ul class="calendar-commit-list">
      <li>`Materials-5 / Phase 1 - Multi Object Target Read And Assignment Scope`</li>
      <li>`Materials-4 / Phase 5 Follow-Up - Project Material Search Label Removal`</li>
      <li>`Materials-4 / Phase 5 Follow-Up - Project Material Search`</li>
      <li>`Materials-4 / Phase 5 Follow-Up - Stable Project Material List Height`</li>
      <li>`Materials-4 / Phase 5 - Compact Material Action Rail`</li>
      <li>`Materials-4 / Phase 4.1 Follow-Up - White Emissive Defaults`</li>
      <li>`Materials-4 / Phase 4.1 - Reusable Material Color Control Template`</li>
      <li>`Materials-4 / Phase 4 Follow-Up - Muted Hue Track Styling`</li>
      <li>`Materials-4 / Phase 4 Follow-Up - Hue Slider Rainbow Track`</li>
      <li>`Materials-4 / Phase 4 Follow-Up - Base Color Saturation And Brightness`</li>
      <li>`Materials-4 / Phase 4 Follow-Up - Expandable Base Color Controls`</li>
      <li>`Materials-4 / Phase 4 Follow-Up - Compact Para Control Styling`</li>
      <li>`Materials-4 / Phase 4 - Inline Material Source And Compact Control Layout`</li>
      <li>`Materials-4 / Phase 3 - Project Material Preset List`</li>
      <li>`Materials-4 / Phase 2 Follow-Up - Compact Scroll List Defaults`</li>
      <li>`Materials-4 / Phase 2 Follow-Up - Resizable Focused Item List`</li>
      <li>`Materials-4 / Phase 2 - Focused Item List And Target Header Simplification`</li>
      <li>`Materials-4 / Phase 1 - Diagnostic And Reference-Proof Row Removal`</li>
      <li>`Materials-4 / Cleanup Follow-Through - Remove Phase-Proof Headers`</li>
      <li>`Materials-4 / Cleanup Follow-Through - Resizable Material Target List`</li>
      <li>`Materials-4 / Cleanup Follow-Through - Compact Material Target List`</li>
      <li>`Materials-3 / Phase 3 - Hosted Field Projection And Library Handoff`</li>
      <li>`Materials-3 / Phase 2 - First Typed Richer Field Expansion`</li>
      <li>`Materials-3 / Phase 0.1 - Whole Imported Object Material Target Fallback`</li>
      <li>`Materials-3 / Phase 0 - Imported Object Material Target Discovery`</li>
      <li>`Materials-2 / Phase 3 - Wider Assignment Reuse And Richer Field Follow-Through`</li>
      <li>`Materials-2 / Phase 2 - New Material Assign And Duplicate Flows`</li>
      <li>`Materials-2 / Phase 1 - First Editable Material Property Controls`</li>
      <li>`Materials-1 / Phase 3 - First Material Property Projection And Action Handoff`</li>
      <li>`Materials-1 / Phase 2 - Material-Bearing Target List Projection And Selection Flow`</li>
      <li>`Materials-1 / Phase 1 - Focused Object Intake And Current Material Truth Read`</li>
      <li>`Properties-2 / Phase 3 - Child Section Contract And Shell States`</li>
      <li>`Properties-2 / Phase 2 - Section Registry And Tab Framing`</li>
      <li>`Workspace-10 / Phase 4 - Canonical Viewport Type Menu Reads`</li>
      <li>`Properties / Follow-Up - Viewport Type Picker Availability`</li>
      <li>`Properties-2 / Phase 1 - Workspace Mount And Focus Context`</li>
      <li>`Workspace-9 / Follow-Up - Restore Four-Corner Split Contract`</li>
      <li>`Workspace-9 / Phase 11 - Shared Corner Contract And Shell-Layer Consistency`</li>
      <li>`Workspace-9 / Phase 10 - Explicit Pane Ownership And Target Routing Cleanup`</li>
      <li>`Workspace-9 / Follow-Up - Split Corner Pane Ownership Routing`</li>
      <li>`Workspace-9 / Follow-Up - Split Pane Outside Corner Availability`</li>
      <li>`Workspace-9 / Follow-Up - Root Top Corner Split Availability`</li>
      <li>`Workspace-9 / Follow-Up - Split Corner Glyph Visibility`</li>
      <li>`Workspace-9 / Follow-Up - Top Split Corner Handle Layering`</li>
      <li>`Workspace-9 / Follow-Up - Root Split Pane Restores Main Viewport Sizing`</li>
      <li>`Workspace-9 / Phase 9 - Main Model Viewport Outer-Corner Split Entry`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="may-11">
  <summary>May 11 - Monday</summary>
  <ul>
    <li>Finished the Materials-5 mixed-value and multi-edit ladder, including focused-item inclusion semantics, list pinning, project-list highlighting, copy toggles, and mixed selected material reads.</li>
    <li>Extracted and adopted shared panel shells across Settings, Properties, Catalog, and Workspace-10 split/popup close controls.</li>
    <li>Added Settings-3 Console input priority routing and shortcut priority hardening, then shipped Model-Viewport-3 from display-mode contracts through Shift+D radial menu, render-preview HUD/backend/settings, Properties Render controls, presets, and material-mode lighting fixes.</li>
  </ul>
  <div class="calendar-day-git">Changelog coverage: 40 entries.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (40)</summary>
    <ul class="calendar-commit-list">
      <li>`Model-Viewport-3 - Phase 10.1 - Material Mode Neutral Fill Lighting Fix-Up`</li>
      <li>`Model-Viewport-3 - Phase 10 - Material Mode Lighting Separation`</li>
      <li>`Model-Viewport-3 - Phase 9 - Render Quality Presets And Cleanup`</li>
      <li>`Model-Viewport-3 - Phase 8 Cleanup - Render Properties Control Styling`</li>
      <li>`Model-Viewport-3 - Phase 8 - Render Settings Runtime Wiring`</li>
      <li>`Model-Viewport-3 - Phase 7 - Properties Render Section`</li>
      <li>`Model-Viewport-3 - Phase 6 - Render Preview Settings Contract`</li>
      <li>`Model-Viewport-3 - Phase 5 - Progressive Render Preview Backend`</li>
      <li>`Model-Viewport-3 - Phase 4 - Render Preview Status And HUD Contract`</li>
      <li>`Model-Viewport-3 - Phase 3 - Fast Display Mode Viewer Application`</li>
      <li>`Model-Viewport-3 - Phase 2 - Shift+D Radial Menu`</li>
      <li>`Model-Viewport-3 - Phase 1 - Display Mode Contract`</li>
      <li>`Settings-3 - Phase 5 Follow-Up - Viewer-Local Zoom Object Priority`</li>
      <li>`Settings-3 - Phase 5 - Shortcut Priority Hardening And Handoff`</li>
      <li>`Settings-3 - Phase 4 - Input Priority Routing`</li>
      <li>`Settings-3 - Phase 3 - Settings Console Input Priority Control`</li>
      <li>`Settings-3 - Phase 2 - Console Input Priority Preference Contract`</li>
      <li>`Workspace-10 - Phase 5 - Popup Parity Decision And Final Shell Closeout`</li>
      <li>`Workspace-10 - Phase 3 - Protected-Pane Eligibility And Close Continuity`</li>
      <li>`Workspace-10 - Phase 2 - Shared Shell Control Strip Ordering`</li>
      <li>`Workspace-10 - Phase 1 - Anchored Split-Pane Close Button`</li>
      <li>`Gen 4 - Cleanup 1 Follow-Up - Workspace Panel Shell Padding Slider`</li>
      <li>`Gen 4 - Cleanup 1 Follow-Up - Settings And Properties Shell Padding Match`</li>
      <li>`Gen 4 - Cleanup 1 / Phase 5 - Shell CSS Cleanup And Future Split Handoff`</li>
      <li>`Gen 4 - Cleanup 1 / Phase 4 - Catalog Outer Shell Adoption`</li>
      <li>`Gen 4 - Cleanup 1 / Phase 3 - Settings And Properties Section Shell Migration`</li>
      <li>`Gen 4 - Cleanup 1 / Phase 2 - Shared Panel Split Shell Extraction`</li>
      <li>`Materials-5 / Phase 2.1 Follow-Up - Focused List Selection Pinning`</li>
      <li>`Materials-5 / Phase 2.1 Follow-Up - Focused Row Inclusion Toggle`</li>
      <li>`Materials-5 / Phase 4 Follow-Up - Multi Material Project List Highlight`</li>
      <li>`Materials-5 / Phase 4 Follow-Up - Multi Edit Copy Toggle`</li>
      <li>`Materials-5 / Phase 4 - Multi Object Field Editing`</li>
      <li>`Materials-5 / Phase 3 - Mixed Selected Material Read`</li>
      <li>`Materials-4 Follow-Up - Selected Material Name Input Padding`</li>
      <li>`Materials-4 Follow-Up - Full Width Selected Material Name Input`</li>
      <li>`Materials-5 / Phase 2.1 Follow-Up - Single Focused Item Clear Selection`</li>
      <li>`Materials-5 / Phase 2.1 - Focused Item Inclusion And Global Deselect Semantics`</li>
      <li>`Materials-5 / Phase 2 Follow-Up - Focused Item Remove Truth Proof`</li>
      <li>`Materials-5 / Phase 2 Follow-Up - Focused Item Inclusion Controls`</li>
      <li>`Materials-5 / Phase 2 - Project Material Batch Assignment`</li>
    </ul>
  </details>
  </details>

  <details class="calendar-day-details" id="may-12">
  <summary>May 12 - Tuesday</summary>
  <ul>
    <li>Opened Settings-2 with a read-only shortcut inventory source map over viewer camera bindings, routing-only seams, Console input-priority ownership, and fragmented shortcut handlers.</li>
    <li>Normalized the shortcut read model into groups, rows, and copied Default/Blender preset reads, then routed the Settings rail into a real Key Bindings section with the Console first input priority control relocated there.</li>
    <li>Rendered the grouped shortcut pane with a read-only preset selector, cataloged viewport camera shortcut rows, deferred shortcut groups, and local-only preset switching proof.</li>
  </ul>
  <div class="calendar-day-git">Changelog coverage: 4 entries.</div>
  <details>
    <summary>Condensed landed phases from CHANGELOG.md (4)</summary>
    <ul class="calendar-commit-list">
      <li>`Settings-2 - Phase 4 - Grouped Shortcut Pane Rendering`</li>
      <li>`Settings-2 - Phase 3 - Key Bindings Section Entry And Routing`</li>
      <li>`Settings-2 - Phase 2 - Shared Shortcut Read Model And Mode Normalization`</li>
      <li>`Settings-2 - Phase 1 - Shortcut Inventory Source Map`</li>
    </ul>
  </details>
  </details>

  </details>
</div>

</details>

## Source Notes

- The calendar is a curated summary layer fed by the main work in [CHANGELOG](../CHANGELOG.md).
- This page is intentionally shorter, more visual, and easier to scan week-to-week.
