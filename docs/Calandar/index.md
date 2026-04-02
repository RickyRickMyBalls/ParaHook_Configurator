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
  <div class="calendar-week-card phase-browser">
    <strong>Mar 29</strong>
    <p>Browser cleanup and transform parity day.</p>
  </div>
  <div class="calendar-week-card phase-workspace-foundation">
    <strong>Mar 30</strong>
    <p>Workspace architecture jump: shared shell, popouts, slots, persistence.</p>
  </div>
  <div class="calendar-week-card phase-split-polish">
    <strong>Mar 31</strong>
    <p>Heavy split, dock, toolbar, and multi-viewport polish across Workspace 7.x.</p>
  </div>
  <div class="calendar-week-card phase-parity">
    <strong>Apr 1</strong>
    <p>Workspace 7.5-x parity push across multi-surface graph, viewer, and host behavior.</p>
  </div>
</div>

## April 2026

<details class="calendar-month" open>
<summary>April 2026</summary>

<div class="month-shell">
  <div class="month-header">
    <div>
      <h3>April 2026</h3>
      <p>Dedicated Workspace 7.5-x parity run focused on host behavior, graph composition, and cleanup.</p>
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
    <div class="day empty">
      <div class="day-number">2</div>
    </div>
    <div class="day empty">
      <div class="day-number">3</div>
    </div>
    <div class="day empty">
      <div class="day-number">4</div>
    </div>

    <div class="day empty">
      <div class="day-number">5</div>
    </div>
    <div class="day empty">
      <div class="day-number">6</div>
    </div>
    <div class="day empty">
      <div class="day-number">7</div>
    </div>
    <div class="day empty">
      <div class="day-number">8</div>
    </div>
    <div class="day empty">
      <div class="day-number">9</div>
    </div>
    <div class="day empty">
      <div class="day-number">10</div>
    </div>
    <div class="day empty">
      <div class="day-number">11</div>
    </div>

    <div class="day empty">
      <div class="day-number">12</div>
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
    <div class="day empty"></div>
    <div class="day empty"></div>
  </div>
</div>

<div class="calendar-nested-weeks">
  <details class="calendar-week-details" open>
  <summary>Week of April 1-4</summary>

  <details class="calendar-day-details" id="april-1">
  <summary>April 1 - Wednesday</summary>
  <ul>
    <li>Ran the Workspace 7.5 parity pass across host behavior and graph composition</li>
    <li>Kept build output green while tightening docs and month-view calendar structure</li>
    <li>Extended the logging surface so April can continue in the same format as March</li>
  </ul>
  <div class="calendar-day-git">Git diff: 4 commits, 92 files, +12505 / -1957.</div>
  <ul class="calendar-commit-list">
    <li>`2ceb524` workspace modes 7.5</li>
    <li>`b156d72` uhh</li>
    <li>`86d39d5` 9a & mk doc</li>
    <li>`8e0814f` 9a-c & calandar</li>
  </ul>
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
  </details>

  </details>
</div>

</details>

## Source Notes

- The calendar is a curated summary layer fed by the main work in [CHANGELOG](../CHANGELOG.md).
- This page is intentionally shorter, more visual, and easier to scan week-to-week.
