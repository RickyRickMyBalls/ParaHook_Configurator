# Toolbar

## Doc Header

### Doc History
5. 2026-03-19 02:05: Tightened the shared auto-height rule so collapsing or expanding any toolbar section or subsection returns the outer window to `auto` height after manual resizing
4. 2026-03-19 01:44: Added the shared auto-height versus manual-height rule so toolbar outer height follows section collapse/expand by default and only locks after explicit height resizing
3. 2026-03-19 01:09: Added the shared title-bar right-click context menu rule and the first built-in `i Menu` behavior for opening a hidden body-level UI customization section
2. 2026-03-19 00:07: Updated the toolbar template doc to include the newer shared shell features: density-cycle modes, accent-tinted body scrollbars, and the reusable horizontal subsection split bar
1. 2026-03-18 23:58: Created this architecture doc to define the reusable viewport toolbar template, its floating-window behavior, and the rule that toolbar color theme should derive from the object type being edited

### Purpose

This doc defines the architecture direction for the ParaHook reusable `Toolbar` template.

Use it to answer:
- what the shared viewport toolbar template is
- what parts of the shell are required for every toolbar
- how drag, resize, title bar, and body sections should behave
- how toolbar color theme should be chosen
- what belongs in shared toolbar chrome versus tool-specific body controls

### Why This Doc Exists

ParaHook now has the first real reusable viewport toolbar shell:
- the shared overlay tool panel
- the sketch-plane toolbar as the first consumer

That shell is important because more viewport tools will follow:
- sketch plane
- later transform-adjacent tools
- future pick/session tools
- future viewer-side authoring surfaces

If the template is not documented now, each new toolbar risks drifting in:
- title-bar layout
- button placement
- color language
- drag behavior
- resize behavior
- body-section structure

This doc exists to lock the shared toolbar contract before more toolbars are built on top of it.

### Scope

This doc covers:
- the reusable toolbar shell
- required title-bar behavior
- title-bar context-menu behavior
- required floating-window behavior
- resize-handle expectations
- title/body layout expectations
- color-theme expectations
- toolbar density-mode expectations
- subsection split-bar expectations
- section and subsection collapse expectations

This doc does not cover:
- final contents of every future tool
- every keyboard shortcut for every tool
- sketch-plane-specific math or viewer helper logic
- browser/panel toolbars outside the viewport overlay family

## Doc Body

### Short Version

ParaHook viewport toolbars should use one shared floating-window template.

That template should provide:
- a draggable title bar
- a close action in the title bar
- optional density controls in the title bar
- adjustable edges
- adjustable corners
- a body split into clear sections
- optional resizable subsection dividers
- a color theme based on the object type being changed

The shell is shared.  
The body controls are tool-specific.

### Core Template Contract

Every viewport toolbar built from this template should have:
- a floating-window shell
- a title bar at the top
- a scrollable body below
- consistent chrome/button language
- shared drag and resize behavior
- shared accent-color behavior

The toolbar should be reusable across tools without rewriting:
- title-bar structure
- resize-handle structure
- panel body layout
- accent-color plumbing
- density-control plumbing
- split-layout plumbing

### Title Bar

The title bar is not decorative. It is part of the interaction contract.

Required behavior:
- dragging the title bar should drag the floating toolbar window
- the title bar should include the toolbar title
- the title bar should include a close action
- the close action should live in the title-bar action area, not in the body
- right-clicking the title bar can open the toolbar-template context menu when the tool exposes title-bar menu features

Current shared direction:
- the title bar should stay compact, closer to the browser-header feel than to a large modal-header feel
- leading and trailing action slots should exist so different tools can place controls cleanly without rewriting the shell
- density/state actions can live beside the close action when the tool needs quick mode switching

### Title Bar Context Menu

The shared toolbar template should allow the title bar to expose a right-click context menu.

This menu is for toolbar-shell features, not for tool-specific geometry actions.

Current first built-in feature:
- `Open i Menu`

That action should:
- open a hidden first body section
- use that first hidden section for `UI Customization`
- keep the customization surface inside the same toolbar rather than spawning a second floating tool

This means the first template-owned hidden section in the body is:
- `i Menu`
- purpose: `UI Customization`

Current first-pass customization content can include:
- the same core appearance controls used by `Console Tools`
- toolbar width
- toolbar height

Current shared control set:
- `Preset`
- `BG Fill`
- `Text`
- `Font`
- `Z Index`
- `Fill Type`
- `BG Color`

Recommended subsection shape inside the `i Menu`:
- `Toolbar Window`
  - shared shell/window controls
- tool-specific UI subsection
  - for example `Sketch Plane UI`
  - tool-owned preview/display controls that do not belong to the generic shell

Current rule:
- if a toolbar exposes template-level customization content, right-clicking the title bar should offer the `Open i Menu` action
- when opened, the `i Menu` section should render as the first body section above the tool-specific sections
- the menu item can change to `Close i Menu` while the hidden section is already open
- once open, the `i Menu` section should use the same text-label-plus-chevron collapse pattern as other toolbar sections so the user can fold it without disabling the feature entirely
- once open, the `i Menu` section should introduce a shared horizontal body divider so the user can resize the customization area against the lower tool content

### Close Action

The `X` button is part of the shared shell.

Rules:
- it belongs in the title bar
- it should stop drag interaction when clicked
- it should close the active toolbar/session cleanly through the owning tool system

The exact left/right placement can remain a template-consumer decision when needed, but it should always stay in the title-bar action area rather than being reintroduced as a body control.

### Density Modes

Some tools need more than one body density.

The shared toolbar template should support compact title-bar density controls when the tool needs them.

Current proven pattern:
- `-` = `collapsed`
- `e` = `essentials`
- `+` = `expanded`

Expected behavior:
- `collapsed`
  - hides the toolbar body
- `essentials`
  - keeps only the most important setup section(s)
- `expanded`
  - shows the full working surface

This should remain a shared template pattern, not a one-off sketch-only button language.

### Resize Behavior

The reusable toolbar template should behave like a real floating tool window.

Required resize behavior:
- all four edges should be adjustable
- all four corners should be adjustable
- resize handles should be part of the shared shell, not reimplemented per tool
- resize should preserve viewport bounds and minimum readable size

This means every tool built on the template inherits:
- north/south/east/west resize
- northeast/northwest/southeast/southwest resize

Height behavior should also follow a shared ownership rule:
- default outer toolbar height should be `auto`
- when body sections or subsections collapse/expand, the toolbar should naturally refit its height in `auto` mode
- explicit outer-height edits should switch the toolbar into `manual` height mode
- if the user later collapses or expands any toolbar section or subsection, that structure change should hand the outer toolbar back to `auto` height so the shell can shrink or grow to match the new content
- auto-height toolbars should still be kept inside viewport bounds as their content grows or shrinks

### Body Structure

The body should be treated as a structured tool surface, not one undifferentiated block.

Default expectations:
- the body is scrollable
- the body is divided into labeled sections when the tool has multiple jobs
- section layout should stay visually consistent across tools
- the body can optionally switch between collapsed, essentials, and expanded densities
- sections can optionally live inside a shared split layout when they need user-adjustable vertical space
- every body section and subsection should be able to collapse/expand from its own text label without requiring a separate visible collapse button

Example shape:
- section 1: selection/setup
- section 2: transform/adjustment
- later additional sections only when the tool honestly needs them

The template should provide:
- one shared body container
- one shared labeled-section pattern
- one shared density-cycle pattern when needed
- one shared subsection split-bar pattern when needed
- one shared text-first collapse pattern for body sections and subsections
- reusable compact compound controls when multiple related channels should read as one row

### Section Collapse

Toolbar body sections and subsections should be collapsible by default.

Rules:
- every top-level body section should be allowed to collapse/expand
- every nested subsection should also be allowed to collapse/expand when the tool uses subsections
- the section/subsection text label itself should be the clickable target
- expandable section/subsection labels should include a left-side chevron that reflects open/closed state
- the collapse interaction should not require adding a separate visible disclosure button unless a future tool truly needs one
- collapse behavior should preserve the same typography/look when possible instead of introducing button chrome just to make the label clickable

This is now a template rule, not a sketch-plane-only behavior.

### Compound Controls

Some toolbar controls should be reusable as compact grouped controls rather than always rendering one full row per channel.

Current shared direction:
- a reusable `Vec3 ParaSlider` can compress related `X / Y / Z` channels into one row
- that grouped row should use three equal-width fill bars
- that grouped row should not require left/right arrow caps
- it should stay reusable outside sketch-plane so other tools can adopt the same compact control language later

### Section Split Bar

When a toolbar has stacked sections that compete for vertical space, the template should support a horizontal divider between them.

The divider should:
- render as a clear horizontal rule
- inherit the toolbar accent color
- be draggable vertically
- resize the section above it relative to the section below it

For a two-section toolbar, that means:
- one horizontal split bar between section 1 and section 2

This is now a shared template feature, not a sketch-plane-only behavior.

### Color Theme

An important part of the toolbar template is the color theme.

The toolbar color theme should be based on the object type being changed.

Examples:
- `SketchPlane` toolbar -> sketch-plane/plane accent
- future content/object toolbar -> object-family accent
- future reference-oriented toolbar -> reference-family accent

This color should drive the shared shell language:
- title-bar accent emphasis
- border tint
- active button state
- selected chip state
- scrollbar tint
- subsection divider tint
- other light chrome accents

The goal is that the user can recognize tool context quickly from the shell itself, not just from the title text.

### Shared Shell Vs Tool-Specific Content

Shared shell owns:
- floating window container
- title bar
- close-action slot
- optional density-action slot
- drag behavior
- resize behavior
- scrollable body
- labeled section layout
- optional density-cycle behavior
- optional split-section layout
- accent-color plumbing

Tool-specific content owns:
- section names
- section controls
- session actions like `Done`
- stage/status messaging
- tool-specific buttons, sliders, chips, and toggles

### Current First Consumer

The first real consumer of this template is the sketch-plane toolbar.

That makes it the proof surface for:
- title-bar drag
- title-bar close action
- title-bar density-cycle action
- all-edge and all-corner resize
- sectioned body
- accent-tinted body scrollbar
- horizontal subsection split bar
- type-colored chrome

But this doc is not sketch-only.  
It exists so later viewport toolbars can reuse the same shell honestly.

### Design Guardrails

When building new toolbars from this template:
- do not clone and fork the shell unless the new tool truly breaks the contract
- do not put close actions back into the body
- do not bypass the shared accent-color system
- do not create one-off resize logic for individual tools
- do not invent a second density-button language if `-/e/+` already fits
- do not invent one-off subsection split bars outside the shared shell
- do not turn the title bar into a tall modal header

### Future Follow-Through

Likely future follow-through for the toolbar template:
- standardize title-bar action placement rules more tightly
- define a small set of toolbar body section archetypes
- move more existing viewport tools onto the same shell
- ensure every viewport toolbar inherits the same type-colored scrollbar and chrome language
- decide when a toolbar should expose density modes versus always stay expanded
- decide when a toolbar should expose split sections versus fixed section heights
