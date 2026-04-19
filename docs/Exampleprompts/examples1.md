`can you do a code review how enviroment 1 & 2 landed for me? read only mode - parahook\docs\Human-Plans\Architecture\View-Toolbar\Environment`
10:03 AM



Worked for 2m 48s
Findings

High: local HDRI/EXR browse can persist a dead blob: URL.
CatalogSurface.tsx (line 111) creates an object URL for a local HDRI/EXR and stores it as the active environment assetPath; useUiPrefsPersistenceBridge.ts (line 28) then persists state.view directly to localStorage. After a reload, that blob: URL is no longer valid, so the “persisted environment look” can restore to a broken HDRI. Repo-backed HDRIs are fine; the problem is local browsed files.

Medium: the docs/checklist say “per-viewport environment persistence,” but the landed persistence is global.
Environment-Index.md (line 211) marks Per-Viewport Environment Persistence complete, and the Environment-2 doc also names per-viewport persistence. The code persists one global view under one storage key in uiPrefsPersistence.ts (line 7), hydrated/written from useUiPrefsPersistenceBridge.ts (line 18). If the intended product call is “environment is global,” the docs should be softened; if the intended call is truly per viewport, this did not land yet.

Medium: the Photoshop-like grade surface is visibly present, but several sliders are not semantically Photoshop-like yet.
The viewer maps highlights/shadows/whites/blacks/temperature/tint into one CSS filter string in Viewer.ts (line 370). Highlights and shadows are added together into global brightness, whites/blacks partly affect contrast, and temperature/tint collapse into hue-rotate. That means opposing highlight/shadow changes can cancel out, and the controls do not target tonal ranges. This is an honest v1 grade layer, but the completed docs overstate it as Photoshop-like production polish.

Low/Medium: loaded HDRI textures are not disposed when the viewer is disposed.
The async HDRI load stores this.environmentTexture in Viewer.ts (line 1200), and there is a disposeEnvironmentTexture() helper at Viewer.ts (line 1288), but dispose() does not call it before disposing the renderer at Viewer.ts (line 3003). Switching environments disposes correctly; tearing down the viewer leaks the last environment texture.

What Landed Well

Environment-1 mostly landed cleanly architecturally: environment state is centralized in ViewSettings, presets are defined in shared view settings, Browser/toolbar/viewer read from that same truth, and HDRI lighting/background/intensity/rotation are separated in the viewer runtime. The Browser-facing light helper and selection/transform plumbing also look coherent rather than bolted on.

Environment-2 landed with a real nested environmentGrade seam, visible toolbar controls, persistence hydration for older saved toneMapping/exposure fields, and in-memory capture/recall/A-B helpers. The split between scene source and grade state is much better than the old flat exposure/tone mapping model.

Verification

I ran the focused environment-related tests read-only:

npm.cmd test -- src/app/store/uiPrefsStore.test.ts src/app/store/useUiPrefsPersistenceBridge.test.tsx src/viewer/Viewer.test.ts src/app/components/ViewToolbar.test.tsx

Result: 4 files passed, 77 tests passed. The run still emitted the existing React controlled/uncontrolled input warning from the environment-controls path, so I’d keep that as residual cleanup noise even though it doesn’t currently fail the suite.




10:05 AM
`so phase 2 wasnt that great?`
10:16 AM


Yeah, fair read: Environment-2 landed useful structure, but it’s not “great” if we judge it by the words in the plan.

The good part is real: it created the right ownership shape. environmentGrade is separated from scene/HDRI state, the toolbar exposes the expected controls, old saved view data normalizes forward, and recall/A-B has a clean in-memory workflow. That foundation is worth keeping.

The weak part is that the implementation is more like “Photoshop-shaped controls” than Photoshop-like grading. Most of the sliders are routed into a simple renderer exposure plus CSS filter approximation. So Exposure, Contrast, Saturation are reasonably believable, but Highlights/Shadows/Whites/Blacks/Temperature/Tint are not doing true tonal or color-grade math. They’re UI-complete, but not image-processing-complete.

So I’d phrase it like this:

Environment-1: pretty solid. It appears to have landed the real runtime/state/control ownership it promised.

Environment-2: good scaffold, overclaimed finish. It should probably be treated as Environment-2A: grade surface and persistence foundation, with a follow-up Environment-2B or Environment-3 for real grading behavior, local HDRI persistence honesty, and per-viewport/global wording cleanup.

My instinct: don’t throw it away. Rename the achievement mentally from “production-ready Photoshop-like grading” to “first production-usable grade surface.” Then add one cleanup/follow-up pass to make the docs and behavior honest.




10:16 AM
`enviroment 2 has 4 phases. i can just make phase 5 as a clean up phase. make phase 5 its own dedicated document. and then make internal phases called 5.1, 5.2, 5.3 to do clean up phases. can you set that up for me? the phase 5 plan doc should be the same setup as all the others with a ##doc header, ## doc body, ## vision, ##wishlist organization, & ## for each phase`
10:17 AM



Worked for 6m 33s
Set it up.

I created the dedicated Phase 5 cleanup plan here: Environment-2 Phase 5 cleanup doc.

It has the requested structure:

## Doc Header
## Doc Body
## Vision
## Wishlist Organization
## [ ] Environment-2 / Phase 5.1
## [ ] Environment-2 / Phase 5.2
## [ ] Environment-2 / Phase 5.3
The internal cleanup phases are:

5.1 - Grade runtime honesty and slider fidelity
5.2 - Persistence and local HDRI honesty
5.3 - Closeout proof and family language cleanup
I also updated Environment-Index.md so Environment-2 is no longer treated as fully polished after Phase 4. It now points at Phase 5 as the active cleanup lane while preserving Phases 1-4 as shipped scaffold history.

I added a small handoff note to the original Environment-2 Phase 1-4 doc so it does not contradict the new cleanup plan, and recorded the docs change in Doc-Log.md. No code changed, so I did not run tests.




10:24 AM
4 files changed
+392
-15
Undo

Review
docs/Doc-Log.md
docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md
docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-2 - Photoshop-Like Grade Controls, Persistence, And Workflow Polish.md
docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-2 Phase 5 - Cleanup, Grade Fidelity, And Persistence Honesty.md


`can you dispath codex workers from here?`
10:24 AM


Yes. From here I can dispatch Codex worker agents.

Best shape for this cleanup would be:

Worker 1: Environment-2 / Phase 5.1

Own grade runtime honesty and slider fidelity.
Likely files: viewSettingsTypes.ts, uiPrefsStore.ts, ViewToolbar.tsx, Viewer.ts, focused tests.
Worker 2: Environment-2 / Phase 5.2

Own persistence and local HDRI honesty.
Likely files: uiPrefsPersistence.ts, useUiPrefsPersistenceBridge.ts, CatalogSurface.tsx, persistence/catalog tests.
Main thread or Worker 3 after those land: Environment-2 / Phase 5.3

Own final doc/index closeout and verification language.
Better done after 5.1 and 5.2 are real, so it does not close out imaginary work.
If you want, I can dispatch workers now for 5.1 and 5.2 in parallel, then I’ll review/integrate their changes and handle 5.3 closeout here.




10:25 AM
`what are the main problems in simple terms?`
10:32 AM


The main problems are pretty simple:

The grading sliders look more advanced than they really are.
The UI has Photoshop-style sliders like Highlights, Shadows, Whites, Blacks, Temperature, and Tint, but under the hood most of them are just being approximated with broad brightness/contrast/saturation/hue effects. So the controls exist, but they are not yet “real Photoshop-like grading.”

Local HDRI files do not persist safely.
If you browse to a local .hdr or .exr, the app stores a temporary browser URL. That URL can die after reload, so the app may remember an environment that it can no longer actually load.

The docs overclaimed the finish.
The docs said Environment-2 was fully production-ready, but it is more accurate to say: “the scaffold landed, now it needs cleanup.” Phase 5 fixes that honesty gap.

Per-viewport persistence is unclear.
The docs say “per-viewport” in places, but the code looks like it saves one global environment/view preference. Either the code needs to become per-viewport, or the docs should say global.

Final closeout happened too early.
Phase 4 landed useful recall/A-B helpers, but it should not have been the final “done done” moment. Phase 5 is the cleanup pass that makes the finish believable.

So the short version: Environment-2 has the right skeleton, but it needs Phase 5 to make the behavior honest, durable, and not overpromised.




10:32 AM
`i think the model viewport should stay 1 - "`Per-viewport persistence is unclear.
The docs say “per-viewport” in places, but the code looks like it saves one global environment/view preference. Either the code needs to become per-viewport, or the docs should say global.`"`
10:33 AM`


That makes sense: one model viewport means global environment persistence is the honest product shape right now. I’ll update the Phase 5 cleanup plan so 5.2 is about making the docs/code honest as global persistence, not debating per-viewport behavior.


10:33 AM
what things are "not" a shared viewport right now? that maybe could be
10:34 AM



Worked for 27s
Yep. In simple terms, the stuff that is not shared across model viewports right now is mostly viewport chrome and a few viewport-specific view choices.

Currently per-viewport in WorkspaceViewportLocalViewState:

Projection mode

perspective vs orthographic
This is currently local per model viewport.
This is probably the biggest “maybe it could be shared” item if you want the model viewport to behave like one unified viewer.
Axis overlay on/off

The actual axis overlay style is more global-ish, but whether it is enabled is per viewport.
This could maybe be shared with the rest of View settings.
View toolbar open/closed

Whether the toolbar is expanded or compact.
I would probably keep this per viewport because it is UI layout, not model state.
View toolbar presentation

classic vs tabs
Could be shared as a user preference, but not necessary.
View toolbar host/dock mode

docked/floating, below-axis/top-right cluster, floating rect.
I would keep this per viewport/window. This is layout chrome.
Active View toolbar tab

camera/environment/shadows/etc.
I would keep this local. Different viewport windows could be looking at different tool sections.
Axis widget sizes

compact/expanded axis widget sizing.
Probably local UI chrome.
Viewport result mode

auto, draft, final
This is per viewport.
This one could go either way. If the app only conceptually has one model viewport, shared makes sense. If split view later compares draft/final side by side, per-viewport is useful.
Camera pose / framing

camera position, zoom, orbit state, frame history.
This is viewer-runtime local.
I would keep this local. Even if there is “one model,” different viewport windows often want different camera angles.
Already shared/global through useUiPrefsStore.view:

Environment preset/source/HDRI
Environment grade
Environment lights
Ground
Materials
Grid visible
Axes visible
Shadows enabled
Wireframe
Most scene/view look settings
My take: if you want “model viewport should stay one,” the cleanup should probably say:

Keep environment, grade, lights, ground, materials, grid/axes/shadows/wireframe shared.
Consider moving projection mode and maybe axis overlay enabled into the shared model viewport state.
Leave camera, toolbar layout, toolbar active tab, floating rects, and result mode per viewport unless you explicitly want no split-viewport comparison behavior later.



10:34 AM
`maybe we do set it up for different enviroment settings per model viewport. but we give the user control how it works. by default there will be a checkbox checked that locks the viewport's evniroment settings. but if the user unchecks it, they model viewports become "seperate" so they can load in different hdri / different photoshop controls. `


the enviroment lights, need to stay consistant because they live in the browser. if anything we could make the different viewports be able to turn on/off different lights if the user has the button un-checked. - give suggestion
10:39 AM



I like that direction. It gives you the best of both worlds: default simple shared model viewport, with an opt-in “separate look per viewport” mode for power use.

I’d frame it like this:

Default Behavior

Environment is locked/shared across all model viewports.
One HDRI, one grade look, one background visibility/intensity/orientation, one environment preset.
This keeps the app understandable and avoids “why does this viewport look different?” confusion.
Unlock Behavior

A checkbox/toggle says something like:
Lock Environment Across Viewports
checked by default
When unchecked for a viewport, that viewport gets its own local environment look:
HDRI/source
background visible
HDRI lighting intensity
background intensity
orientation
grade controls: exposure, contrast, highlights, shadows, whites, blacks, temperature, tint, saturation
maybe preset identity/custom read
Environment Lights
I agree: the lights themselves should stay shared because they live as Browser objects. They are scene objects, not just a viewport filter.

So shared:

light list
light names
light types
light positions
light colors
light intensities
adding/deleting lights
selected light identity, probably shared unless later selection becomes viewport-local
Maybe viewport-local when unlocked:

light visibility contribution per viewport
possibly “mute this light in this viewport”
maybe per-viewport light solo/isolate later
That means a light object still exists once in the Browser, but each viewport can decide whether it contributes to that viewport’s render.

I’d avoid per-viewport edits to light position/intensity/color at first. That gets confusing fast because the Browser row would show one light, but two viewports would disagree on what the light “is.” Visibility overrides are easier to explain.

Suggested UX:

In the Environment section:

[✓] Lock Environment Across Viewports
When checked:

show normal shared controls
maybe small read: Shared with all model viewports
When unchecked:

show read: This viewport has its own environment look
add a button:
Copy Shared Look To This Viewport
Reset To Shared
HDRI and grade controls affect only this viewport
Browser environment light rows could show shared lights, but viewport-local visibility overrides live in the Environment section or Browser eye behavior could target active viewport only with clear wording.
My recommendation for Phase 5 cleanup split:

5.1 - Environment Scope Mode

Add the state model:
global/shared environment look
per-viewport environment look overrides
lockEnvironmentAcrossViewports: true default
Do not change light object ownership.
5.2 - Per-Viewport HDRI And Grade Overrides

Make HDRI/source/grade/background/orientation apply to either shared state or active viewport override depending on lock state.
Fix local HDRI persistence honesty here too.
5.3 - Per-Viewport Light Visibility Overrides

Keep light objects shared.
Add optional per-viewport light visibility overrides only when environment is unlocked.
Browser remains the object truth; viewport override is just “this viewport mutes/shows this light.”
5.4 or closeout

Clean up docs/UI wording and add focused tests.
One important naming suggestion: don’t say “separate model viewports” in the UI. Say “Unlock environment for this viewport” or “Use separate environment look”. It’s clearer that only the look changes, not the model or Browser objects.