# Dispatch 2 Home Page Gen1 Pilot

## Doc Header

### Doc History
6. 2026-04-19 14:33:40: Added the Dispatch 2 CLG creation rule to the Home Page Gen1 pilot so Guide-Rail prep mode confirms or repairs Gen1 CLG before producing each Worker handoff.
5. 2026-04-19 14:30:18: Linked the Home Page Gen1 pilot to the Dispatch 2 start-command flow so `start Home Page Gen 1` resolves directly to Guide-Rail prep for `Home-Page-1 / Phase 1 - Surface Registry And Minimal Render` when the current docs remain ready.
4. 2026-04-19 14:20:05: Updated the Home Page Gen1 pilot for the Guide-Rail Codex model, using prep mode before Worker dispatch and coverage review mode after Worker return while Explorer stays optional for future seam research.
3. 2026-04-19 14:08:52: Updated the Home Page Gen1 pilot so Coverage Review owns checklist accounting after each Worker phase and can propose dispatcher-approved follow-up phases if HLG/CLG coverage remains incomplete.
2. 2026-04-19 14:03:18: Simplified the Home Page Gen1 pilot to the flat Dispatch 2 fleet where Workers implement and run focused proof plus `npm run build`, Explorers research later seams, and Reviewers check guide-rail alignment before dispatcher acceptance.
1. 2026-04-19 13:55:15: Added the first Dispatch 2 pilot plan for running Home Page Generation 1 through dispatcher-led manager, worker, explorer, reviewer, and verifier roles.

### Purpose

This file defines the first pilot run for Dispatch 2.

Use it to answer:
- how to implement Home Page Gen 1 with Dispatch 2
- which phases stay linear
- where parallel agents are useful
- what proof closes each phase

Do not use it for:
- replacing `Home-Page-Vision.md`
- replacing `Home-Page-Gen1-Index.md`
- replacing the active Home-Page-1 Family Phase Doc

## Doc Body

### Active Docs

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Home-Page-Vision.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Home-Page-Gen1-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Future/Home-Page_Phase Home-Page-1 - Workspace Landing Surface And Startup Preference.md`

### Pilot Goal

Use Home Page Gen 1 to prove that Dispatch 2 can keep the live dispatcher available while Guide-Rail Codex preps phases, Workers implement and verify one phase at a time, Explorers research future seams in parallel, and Guide-Rail Codex checks HLG/CLG checklist coverage before acceptance.

The command `start Home Page Gen 1` should follow `Dispatch-2-Start-Command-Flow.md` and resolve to the first open implementation phase in this pilot.

Before Worker dispatch, Guide-Rail prep mode should confirm that the Home Page Gen1 CLG still trace back to the Vision HLG. If CLG are missing or stale, Guide-Rail repairs the CLG layer before producing the Worker handoff.

### Phase Queue

1. `Home-Page-1 / Phase 1 - Surface Registry And Minimal Render`
   - Guide-Rail prep mode confirms the Phase 1 spec, no-widening rule, focused tests, and Worker handoff.
   - Worker implements the minimal `homePage` surface kind and registry render path.
   - Worker runs focused surface tests and `npm run build`.
   - Explorer researches Phase 2 zero-viewer seams while Worker runs.
   - Guide-Rail coverage review checks Phase 1 against Vision HLG, Gen1 CLG, Family Phase Doc, implementation spec, no-widening rule, proof, build, and tracking docs before acceptance.
   - Guide-Rail coverage review decides whether `Home-Page-Gen1-CLG-1` is complete, partial, open, or blocked.
   - Guide-Rail coverage review keeps `Home-Page-Gen1-HLG-1` open unless the full first-load behavior is already achieved by later phases.
   - Guide-Rail coverage review proposes a Phase 1 follow-up only if the minimal render does not fully prove the first-class surface contract.

2. `Home-Page-1 / Phase 2 - Zero-Viewer Return`
   - Guide-Rail prep mode folds Explorer seam findings into the Phase 2 implementation spec before Worker dispatch.
   - Worker implements last-model-viewport close return to `Home Page`.
   - Worker runs focused zero-viewer tests and `npm run build`.
   - Explorer researches Phase 3 startup preference seams while Worker runs.
   - Guide-Rail coverage review checks close behavior, guide-rail alignment, no startup widening, and CLG coverage.
   - Guide-Rail coverage review decides whether `Home-Page-Gen1-CLG-2` is complete, partial, open, or blocked.

3. `Home-Page-1 / Phase 3 - Startup Preference`
   - Guide-Rail prep mode folds Explorer seam findings into the Phase 3 implementation spec before Worker dispatch.
   - Worker implements the startup preference and startup branch.
   - Worker runs focused startup preference tests and `npm run build`.
   - Explorer researches Phase 4 launch-action seams while Worker runs.
   - Guide-Rail coverage review checks persistence/default behavior, guide-rail alignment, no storage widening, and HLG/CLG coverage.
   - Guide-Rail coverage review decides whether `Home-Page-Gen1-HLG-1`, `Home-Page-Gen1-HLG-2`, and `Home-Page-Gen1-CLG-3` are complete, partial, open, or blocked.

4. `Home-Page-1 / Phase 4 - First Launch Actions And Closeout`
   - Guide-Rail prep mode confirms which launch actions have real owner commands before Worker dispatch.
   - Worker adds first launch actions into existing workspace owners.
   - Worker runs focused action proof and `npm run build`.
   - Guide-Rail coverage review checks action ownership, guide-rail alignment, checklist accounting, phase docs, changelog, doc-log, and no storage/orientation widening.
   - Guide-Rail coverage review decides whether `Home-Page-Gen1-CLG-4` is complete, partial, open, or blocked.
   - Dispatcher closes `Home-Page-1` only when all tracking surfaces agree.

### Dispatcher Notes

- Keep Phase 1 implementation narrow.
- Do not mix zero-viewer return into Phase 1.
- Do not mix startup preference into Phase 1 or Phase 2.
- Do not add storage cards, GitHub/docs links, version content, or what's-new content during `Home-Page-1`.
- If a sidecar Explorer discovers a later phase is bigger than expected, update the Family Phase Doc before dispatching that later phase.
- If Guide-Rail coverage review finds incomplete HLG/CLG coverage, add a follow-up phase only after dispatcher approval.
