# Collaboration

## Doc Header

### Doc History
5. 2026-03-27 12:12: Added a host-authoritative browser collaboration section describing the lightweight `GitHub Pages + bulletin board service + WebRTC` path, clarifying how the host browser can act as the live source of truth for graph state while a small external service handles room posting, lookup, and connection bootstrapping
4. 2026-03-27 12:01: Added a first planning-phase ladder for the collaboration vision, including a direct feasibility note for browser deployment through GitHub Pages and Actions, clarifying that the browser client is feasible there but persistent live lobby/session infrastructure will still require a real backend beyond static hosting alone
3. 2026-03-27 11:57: Expanded the collaboration browser definition with a first-pass host-room creation flow, adding room naming, guest-permission configuration, and the initial access-state setup between open rooms and password-protected rooms directly from the `Server Browser` surface
2. 2026-03-27 09:44: Reframed this note into more professional planning language so it now reads as a future architecture-facing collaboration feature inventory, replacing the earlier nickname-heavy wording with clearer sections for session discovery, access control, permissions, observer participation, suggestion branches, and later phase-splitting
1. 2026-03-27 09:40: Created this wish-feature planning doc to expand the `Kitchen Browser and room-code collaboration system` direction into a dedicated collaboration surface covering room-code hosting, offline-to-online promotion, shared authored-state sync, presence, and safe return back to local work

### Purpose

This doc defines the future `Collaboration` direction for ParaHook.

Use it to answer:
- what collaboration features are worth capturing before implementation planning begins
- how shared sessions should be discovered, joined, and controlled
- what permissions and participation modes should exist
- how proposed edits should relate to the main authored history
- which feature groups are large enough to become separate sub-phases later

### Why This Doc Exists

`WISHLIST.md` already captured the broad idea of room-code collaboration.

This doc exists to turn that idea into a more professional feature-definition surface that can later move into `docs/Human-Plans/Architecture/` once the scope is clear enough.

The goal here is not to lock implementation details yet.

The goal is to:
- write down the collaboration features in clear product language
- understand the major scope areas
- identify which parts are foundational versus follow-on work
- prepare the later split into architecture sub-phases

### Scope

This doc covers:
- session discovery and join flows
- open, closed, and password-protected collaboration models
- host-controlled permissions
- observer and limited-participation session modes
- suggestion-based editing and merge review concepts
- local-first collaboration boundaries
- scope buckets for later phase planning

This doc does not cover:
- a final backend or hosting provider choice
- a locked CRDT or sync-library decision
- enterprise identity management
- a full moderation or abuse-prevention system
- final UI copy or branding

## Doc Body

### Short Version

ParaHook should eventually support opt-in, local-first collaborative sessions for parametric modeling.

The collaboration model should allow a user to:
- continue working locally by default
- publish an existing local project into a live session when desired
- let others join by short room code or through a session browser
- choose whether a session is open, closed, or password-protected
- control whether guests can observe, comment, suggest, or edit directly
- keep the authoritative history understandable even when multiple people are involved

This should feel closer to collaborative CAD authoring than to a mandatory cloud-only workspace.

### Current Goal For This Doc

This document should stay focused on feature capture first.

The intended workflow is:
1. write down the collaboration features in professional terms
2. estimate which areas are small, medium, or large in scope
3. split the resulting work into sub-phases later under the architecture docs

Until that later phase split happens, this doc should avoid overcommitting to implementation detail.

### Browser Deployment Feasibility

Yes, this is possible in the browser.

More specifically:
- the ParaHook client-side collaboration UI can be built as normal browser application functionality
- GitHub Actions can build and deploy that browser client
- GitHub Pages can host the static browser app

But there is one important boundary:
- GitHub Pages and Actions alone are not a full real-time collaboration backend

The missing backend responsibilities include:
- live lobby registration
- room-code lookup
- password validation
- presence tracking
- real-time session transport
- suggestion storage or merge-review state

So the honest feasibility read is:
- browser client on GitHub Pages: yes
- build/deploy through GitHub Actions: yes
- live multiplayer only with Pages and Actions and nothing else: no

This means the project can absolutely start in-browser while still planning for a separate collaboration backend when live sessions are introduced.

### Host-Authoritative Browser Collaboration Path

One strong early architecture path is a host-authoritative browser collaboration model.

In that model:
- the ParaHook client is hosted as a normal browser application on `GitHub Pages`
- `GitHub Actions` builds and deploys the client
- the host opens a live room from within the browser UI
- the host browser acts as the authoritative live source of truth for the active graph state
- guests connect to that host session rather than to a fully centralized application server

This is attractive because it preserves the idea that collaborators are synchronizing the actual ParaHook graph state instead of exchanging loose text instructions or independently diverging copies of the project.

### Lightweight External Service Role

Even with a host-authoritative model, a small external coordination service is still useful and likely necessary.

A lightweight service can handle:
- room posting or session registration
- server-browser listing
- room-code lookup
- password-gated room metadata
- connection signaling/bootstrap
- reconnect and presence bookkeeping

This service does not need to be the full authoritative CAD backend in the first pass.

Its role can stay narrow:
- bulletin board
- room directory
- signaling layer
- minimal session metadata store

### Example Early Architecture Shape

A realistic early stack could look like this:

- `GitHub Pages`
  - hosts the ParaHook browser client
- lightweight external session service
  - holds room listings, room codes, password metadata, and signaling records
- `WebRTC`
  - handles live peer-to-peer session connections when possible
- host browser
  - owns the authoritative live graph/session state
- guest browsers
  - receive synchronized graph-state updates and submit edit or suggestion intents back to the host

This is not fully serverless in the strict sense, but it is still a very lightweight and low-cost architecture compared with running a full centralized application server.

### Why This Path Fits ParaHook

- it supports the `Server Browser` vision cleanly
- it keeps the browser app deployable through GitHub Pages
- it allows the host to remain the visible owner of the live session
- it keeps collaboration tied to actual graph-state synchronization
- it reduces the need for a large centralized backend in the earliest phases

### Important Limits Of This Path

This approach still has real technical limits:

- the host browser becomes a reliability bottleneck
- if the host disconnects, the session may end unless later host-migration behavior exists
- some peers may require relay infrastructure rather than direct peer-to-peer connectivity
- security, password enforcement, and permissions still need a trustworthy external layer
- larger sessions may outgrow what is comfortable for a browser-host-authority model

So this should be treated as a strong MVP or early product direction, not an assumption that all long-term collaboration needs disappear.

### Core Product Direction

- collaboration should remain optional and local-first
- a user should be able to promote local work into a live shared session without starting over
- session joining should be low friction
- the system should support both active collaboration and passive observation
- multi-user history should remain reviewable and understandable rather than collapsing into anonymous real-time edits

### Entry Surface And Navigation

- the first collaboration entry surface should sit under `ParaHook Generator`
- selecting `ParaHook Generator` should reveal a hidden or secondary submenu that expands beneath it
- that submenu can become the initial home for collaboration-facing options before the feature grows into a larger dedicated architecture area
- the first option in that submenu should be `Server Browser`

Useful interpretation for now:
- `ParaHook Generator`
  - reveals collaboration submenu
- `Server Browser`
  - opens the session discovery surface for available live collaboration sessions

This is useful because it gives the collaboration system one concrete product entry point early, even before the rest of the feature tree is fully defined.

### Session Discovery And Join Model

- the system should support direct join by short room code
- the system should also support a server-browser or lobby-browser style discovery surface for visible sessions
- readable codes remain valuable even if a browser exists, because they work well in voice chat, streaming, and quick messaging contexts
- the browser should eventually allow users to distinguish between:
  - public/open sessions
  - restricted sessions
  - sessions that require a password
  - sessions that are visible but not editable by default

### First-Pass Server Browser Flow

- when the user selects `Server Browser`, ParaHook should open a new floating window dedicated to collaboration session discovery
- this floating window is a new surface that will need its own design and implementation
- before the user reaches the server list, the first step should be a lightweight sign-in prompt

Useful first-pass sign-in behavior:
- the user provides a display name
- the sign-in step should not require a password in the first pass
- the system can treat this as a lightweight session identity rather than a full account system
- once the user submits a valid name, the sign-in surface closes or advances directly into the server browser

This keeps the first collaboration flow lightweight while still giving every participant a visible identity in-session.

### First-Pass Server Browser Window Structure

After the display-name sign-in step, the server browser window should contain two main sections:

- `Header`
  - session filter controls
  - search input
  - summary or status information about visible sessions
  - controls or entry points for starting a new session
- `Server List`
  - a scrollable list of visible sessions
  - each row shows the host name
  - each row shows the project name
  - each row can show additional session metadata as needed

This gives the browser one clear split:
- top area for search, filtering, and host/start actions
- main body for browsing available sessions

### Host Room Creation From Server Browser

- once the user is inside `Server Browser`, they should have a direct option to host a new room from that same surface
- this creation flow should live in the browser header area or another clearly visible host action region
- the first pass should focus on a small set of fields rather than a large setup wizard

Useful first-pass host-room fields:
- room name
- guest permission configuration
- access mode
- password, when password protection is enabled

Useful first-pass access settings:
- `Open`
  - guests can join without a password
  - actual edit rights still depend on the selected guest permissions
- `Password`
  - guests must provide the room password before entry

Useful first-pass permission setup:
- allow guests to observe only
- allow guests to join and inspect state without editing
- allow guests to edit directly
- allow guests to submit suggestions without direct edit rights

This makes the first host flow explicit:
- open `Server Browser`
- choose to host a room
- name the room
- choose guest permissions
- choose `Open` or `Password`
- provide a password if required
- publish the session

### Server List Behavior

- the user should be able to scroll the list to inspect available sessions
- the list should make open sessions easy to identify
- the list should support mixed availability states without forcing the user into the same join flow for every row

Useful first-pass row content:
- host name
- project name
- session visibility or access indicator
- join action

Useful first-pass row action states:
- `Join`
  - visible when the session is directly joinable
- `Password`
  - visible when the session requires a password before entry
- `Locked`
  - visible when the session is not currently available for open join

This row-level status should help the user understand whether the session is openly joinable, password-gated, or currently closed to them.

### Session Visibility And Access Modes

Useful first session modes:

- `Offline`
  - local-only default state
  - no live network session
- `Open`
  - visible in the session browser
  - guests may join without a password
  - editing rights still depend on host permissions
- `Closed`
  - not generally discoverable
  - intended for direct-code or invite-style access
- `Password Protected`
  - requires a password to join
  - can be public-in-list or restricted, depending on later design

One important rule:
- session visibility and session permissions should be separate concerns

An open session should not automatically imply open editing rights.

### Permission Model

The host should be able to control participation through explicit permissions rather than a single all-or-nothing mode.

Useful early permissions:
- join session
- view project state
- hear shared session audio or radio output if that subsystem is active
- inspect graph, browser, or timeline state
- edit directly on the main working state
- create suggested edits
- approve or merge suggested edits
- manage other guests
- change session settings

This creates useful combinations:
- an open session with all edit permissions disabled so people can observe work in progress
- a collaborative session where guests can edit freely because the host allows it
- a review session where guests cannot edit directly but can submit suggestions

### Observer And Ambient Participation

Not every guest needs to be an editor.

The collaboration system should support lightweight participation modes where people can:
- join to observe ongoing work
- see what the host is currently building
- understand who is present in the session
- optionally hear shared session audio if that becomes relevant through ParaHook's radio/audio systems

This is useful for:
- teaching
- design reviews
- public work sessions
- live demonstrations
- casual drop-in observation

### Presence And Coordination

Presence should be informative rather than decorative.

Useful presence signals:
- who is in the session
- who is currently active versus idle
- what object, node, or area someone is focused on
- whether a specific area is currently being edited
- whether a user is observing, suggesting, or editing

The first pass should prefer local coordination signals over heavy global locking.

### Direct Editing Versus Suggested Editing

Direct editing should not be the only collaboration model.

A strong alternative is a suggestion-based workflow where a guest can propose changes without immediately rewriting the main session history.

That enables:
- low-risk public sessions
- review-oriented collaboration
- collaborative teaching
- gradual trust models for new contributors

### Suggestion Branches

Suggested edits should be treated as isolated proposals attached to the current working history rather than as anonymous transient changes.

A suggestion should ideally capture:
- the author
- the base history position or revision it was created from
- the proposed graph or parameter changes
- whether it is still current or has drifted behind the main line

Conceptually, this is closer to a lightweight branch or patch proposal than to unrestricted live editing.

### Review And Merge Model

The host, or another sufficiently privileged collaborator, should be able to review suggested edits before they affect the main authored history.

Useful later actions:
- preview suggestion
- compare suggestion against current state
- accept and merge
- partially apply selected changes
- reject
- leave unresolved for later review

This is the part of the collaboration model that can borrow ideas from version control without forcing the full complexity of git onto every session.

### History And Authorship

Collaboration should preserve clear authorship and history boundaries.

Useful rules:
- the main session history should remain readable
- suggested edits should not silently overwrite the primary line of work
- authorship should remain attributable at least at the suggestion or edit-session level
- merge points should be visible once suggestion-based workflows exist

This is important if ParaHook is going to feel like collaborative CAD authoring instead of a chaotic whiteboard.

### Local-First Sync Boundary

The collaboration layer should share authored state, not rendered frames.

Each client should continue to render geometry locally whenever practical.

Healthy system boundaries:
- local project state
- shared session state
- suggestion branches or pending proposals
- presence and session metadata

This keeps collaboration aligned with ParaHook's local-first direction instead of turning it into a cloud-streamed viewer.

### Architecture Notes Worth Preserving

- a session broker can map a readable room code to the underlying session identity
- the collaboration channel should primarily exchange authored changes such as graph edits, parameter changes, presence, and review state
- direct-edit sessions and suggestion-based sessions may share the same technical sync foundation while exposing different permission policies
- observer participation should not force the same synchronization cost as full editing rights

### Proposed Planning Phases

The collaboration vision appears large enough to split into several phased steps.

The most practical first planning ladder is:

- `Phase 1 - Browser Entry Surface And Identity`
  - add the `ParaHook Generator` collaboration submenu entry
  - add `Server Browser` as the first option
  - build the floating browser window shell
  - add lightweight display-name sign-in
  - no real live collaboration yet

- `Phase 2 - Session Browser And Host Setup`
  - build the server list UI
  - add search and filter controls
  - add host-room creation from the same surface
  - support room name, guest-permission presets, and `Open` versus `Password` access setup
  - this phase can still use mocked or limited backend data during development if needed

- `Phase 3 - Lobby Registry And Join Flow`
  - add real room publication to a backend lobby registry
  - support room-code generation and lookup
  - support open-room join
  - support password-gated join flow
  - establish the first honest live room lifecycle
  - use a lightweight external coordination service rather than assuming static hosting alone can do this work

- `Phase 4 - Presence And Observer Mode`
  - add presence state for connected users
  - show who is present, active, idle, or observing
  - support observer-only sessions and view-only permission setups
  - optionally include shared session audio participation later if that remains desirable

- `Phase 5 - Direct Multi-User Editing Foundation`
  - add the first real shared authored-state synchronization layer
  - keep the first pass narrow
  - allow the host browser to act as the first authoritative live session owner
  - support direct guest editing only under explicit host permission
  - add first coordination safeguards around active-focus or busy-state behavior

- `Phase 6 - Permission Hardening`
  - expand permission controls into a more explicit policy model
  - separate join permission, observe permission, suggest permission, and direct-edit permission
  - allow hosts to run open public rooms with all modification rights disabled
  - allow more trusted rooms with direct edit rights enabled

- `Phase 7 - Suggestion Branches`
  - allow guests to create proposed edits without changing the main line immediately
  - attach suggestions to a known history position
  - show authorship and suggestion status
  - treat suggested edits as lightweight branch or patch proposals

- `Phase 8 - Review And Merge`
  - allow hosts to preview, accept, reject, or partially merge suggestions
  - make merge points visible in the authored history
  - preserve understandable authorship rather than flattening all contributions together

- `Phase 9 - Collaboration Stabilization And Promotion To Architecture`
  - review what has become foundational versus optional
  - move the matured design from `Wish-Features` into `Architecture`
  - split the remaining work into narrower long-term architecture docs or execution tasks

### Recommended First Cut

If the goal is to make this real in the browser with the least risk, the best first implementation target is probably:

- `Phase 1`
- `Phase 2`
- the smallest viable slice of `Phase 3`

That would give ParaHook:
- a real collaboration entry point
- a floating `Server Browser`
- display-name sign-in
- hosted room creation UI
- a real or semi-real lobby list
- open/password room join flow

That is enough to prove the product shape before attempting full live co-editing.

### Good First Non-Goals

- mandatory always-online project ownership
- unrestricted anonymous editing by default
- streaming rendered pixels instead of syncing authored state
- solving every enterprise role or compliance feature in the first pass
- locking the entire app around one collaboration metaphor too early

### Scope Buckets For Later Phase Splitting

Likely feature groups to evaluate later as separate sub-phases:

- session creation, room codes, and browser discovery
- lightweight display-name sign-in and participant identity
- floating collaboration browser window and layout
- host-room creation and access configuration
- lobby registry and room-code resolution backend
- signaling/bootstrap service for host-authoritative browser sessions
- session visibility modes and password access
- host-controlled permission flags
- presence and focus indicators
- direct multi-user editing foundation
- suggestion branches and review UI
- merge behavior and history integration
- observer mode and optional shared audio/session-media participation

These buckets should help determine what belongs in the first foundation phase versus later collaboration phases.
