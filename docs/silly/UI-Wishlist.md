# ParaHook Configurator — UI Wishlist

Legend  
- `[x]` implemented  
- `[~]` in progress  
- `[ ]` planned  
- `[?]` exploratory  

---

# 1. Node Editor Layout

[x] Generic NodeView template system  
[x] Fixed section order: Drivers → Inputs → Feature Stack → Outputs  
[x] Deterministic row rendering via driverVm  
[x] Row ordering metadata (`partRowOrder`)  
[ ] Drag-and-drop row reordering (replace reorder buttons)  
[ ] Compact row mode (reduced row height for dense graphs)  
[ ] Pin visibility toggle (show/hide pins for dense nodes)

---

# 2. Node Toolbar (Hidden Controls Panel)

A small button expands a hidden **Node Toolbar** containing advanced editing tools.

### Parameter Editing

[x] Slider sensitivity control  
[ ] Value step selector (0.01 / 0.1 / 1 / 10 increments)  
[ ] Manual clamp system (Ableton-style)  
- toggle clamp  
- set Min  
- set Max  

[ ] Reset parameter to default  
[ ] Zero offset (when driver is wired)

### Driver / Wiring Tools

[ ] Disconnect driver (remove incoming wire from driver)  
[ ] Show driving source (display upstream node name)  
[ ] Clamp warning indicator when limits reached  

### Visual / Interaction

[x] Node circle size control (pin hit radius)  
[ ] Wire highlight on hover  
[ ] Compact row layout toggle  
[ ] Show/hide port pins  

### Units / Display

[ ] Show/hide units display (mm, etc.)  
[ ] Show resolved values (effective value after wiring/offset)  
[ ] Show driven value vs manual value  

### Debug / Inspection

[ ] Highlight dependency chain (upstream nodes driving this node)  
[ ] Show evaluation state (driven / unresolved / local)  

### Node Utilities

[ ] Duplicate node  
[ ] Freeze node (lock editing)  
[ ] Isolate node (hide unrelated nodes/wires)

---

# 3. Wiring UX

[x] Typed ports and color-coded wires  
[x] Driver output pins (`drv:<paramId>`)  
[~] Driver input pins (`drv:in:<paramId>`)  
[ ] Automatic wire replacement when connecting to a driver input  
[ ] Wire highlight when selecting a row  
[ ] Animated insertion indicator during drag  

---

# 4. Driver Interaction

[x] Driver values editable via drag bar / numeric field  
[~] Driver driven state (lock editor when wired)  
[ ] Offset mode for numeric drivers  
- show driven value  
- editable offset  
- effective value display  

[ ] Driven/unresolved indicator UI  

---

# 5. Graph Visualization

[ ] Dependency highlight (show upstream chain)  
[ ] Internal dependency overlay (Drivers → Feature Stack)  
[ ] Graph debugging overlay (show evaluation flow)  

---

# 6. Editor Modes

[x] Collapsed mode  
[x] Essentials mode  
[x] Everything mode  

[ ] Kitchen mode (full screen editor)  
[ ] Meatball mode (title-bar width micro editor)

---

# 7. Node Creation UX

[ ] Node palette / toolbar  
[ ] Searchable node creation menu  
[ ] Categorized nodes (Part / Param / Utility)

---

# 8. Parameter Utility Nodes

[ ] Param node (number / boolean / vec2)  
[ ] Rail Math node  
[ ] Profile input node  

---

# 9. Visual Polish

[ ] Consistent pin alignment across rows  
[ ] Smooth wire routing and spacing  
[ ] Hover highlights for active nodes/wires  
[ ] Animated node focus / selection

---

# 10. Debug & Determinism Tools

[x] Deterministic diagnostics  
[x] Deterministic evaluation pipeline  
[ ] Show evaluation timing / state per node  
[ ] Toggle display of evaluation errors

---

# Status Snapshot

Core editor functionality: **stable**  
Parametric wiring (Driver → Input): **implemented**  
Wire → Driver (Phase 2C v2): **in progress**

Remaining UI work focuses on:
- editing ergonomics  
- visualization  
- debugging tools




















------------------------------
# ParaHook Configurator — UI Wishlist

Legend  
- `[x]` implemented  
- `[~]` in progress  
- `[ ]` planned  
- `[?]` exploratory  

---

# 1. Node Editor Layout

[x] Generic NodeView template system  
[x] Fixed section order: Drivers → Inputs → Feature Stack → Outputs  
[x] Deterministic row rendering via driverVm  
[x] Row ordering metadata (`partRowOrder`)  
[ ] Drag-and-drop row reordering (replace reorder buttons)  
[ ] Compact row mode (reduced row height for dense graphs)  
[ ] Pin visibility toggle (show/hide pins for dense nodes)

---

# 2. Node Toolbar (Hidden Controls Panel)

A small button expands a hidden **Node Toolbar** containing advanced editing tools.

### Parameter Editing

[x] Slider sensitivity control  
[ ] Value step selector (0.01 / 0.1 / 1 / 10 increments)  
[ ] Manual clamp system (Ableton-style)  
- toggle clamp  
- set Min  
- set Max  

[ ] Reset parameter to default  
[ ] Zero offset (when driver is wired)

### Driver / Wiring Tools

[ ] Disconnect driver (remove incoming wire from driver)  
[ ] Show driving source (display upstream node name)  
[ ] Clamp warning indicator when limits reached  

### Internal Wiring Display Toggle (NEW)

[ ] “Display internal wiring” 3-way toggle (node-level control)
- Mode 0: **Off** (default in Essentials)
- Mode 1: **Tight** (internal-only wiring diagram)
  - wires stay inside the node panel
  - run parallel + straight like an electrical diagram
  - routing pattern:
    - from Outputs (right) → down
    - back left above the next section → down
    - back right into the next section’s Inputs
  - requires extra horizontal padding/width in node panel when enabled
  - wires are color-coded by type
- Mode 2: **Spaghetti**
  - normal spaghetti wires
  - visually wrap out and back around into the next section’s inputs

### Visual / Interaction

[x] Node circle size control (pin hit radius)  
[ ] Wire highlight on hover  
[ ] Compact row layout toggle  
[ ] Show/hide port pins  

### Units / Display

[ ] Show/hide units display (mm, etc.)  
[ ] Show resolved values (effective value after wiring/offset)  
[ ] Show driven value vs manual value  

### Debug / Inspection

[ ] Highlight dependency chain (upstream nodes driving this node)  
[ ] Show evaluation state (driven / unresolved / local)  

### Node Utilities

[ ] Duplicate node  
[ ] Freeze node (lock editing)  
[ ] Isolate node (hide unrelated nodes/wires)

---

# 3. Wiring UX

[x] Typed ports and color-coded wires  
[x] Driver output pins (`drv:<paramId>`)  
[~] Driver input pins (`drv:in:<paramId>`)  
[ ] Automatic wire replacement when connecting to a driver input  
[ ] Wire highlight when selecting a row  
[ ] Animated insertion indicator during drag  

---

# 4. Driver Interaction

[x] Driver values editable via drag bar / numeric field  
[~] Driver driven state (lock editor when wired)  
[ ] Offset mode for numeric drivers  
- show driven value  
- editable offset  
- effective value display  

[ ] Driven/unresolved indicator UI  

---

# 5. Graph Visualization

[ ] Dependency highlight (show upstream chain)  
[ ] Internal dependency overlay (Drivers → Feature Stack)  
[ ] Graph debugging overlay (show evaluation flow)  

---

# 6. Editor Modes

[x] Collapsed mode  
[x] Essentials mode  
[x] Everything mode  

[ ] Kitchen mode (full screen editor)  
[ ] Meatball mode (title-bar width micro editor)

---

# 7. Node Creation UX

[ ] Node palette / toolbar  
[ ] Searchable node creation menu  
[ ] Categorized nodes (Part / Param / Utility)

---

# 8. Parameter Utility Nodes

[ ] Param node (number / boolean / vec2)  
[ ] Rail Math node  
[ ] Profile input node  

---

# 9. Visual Polish

[ ] Consistent pin alignment across rows  
[ ] Smooth wire routing and spacing  
[ ] Hover highlights for active nodes/wires  
[ ] Animated node focus / selection

---

# 10. Debug & Determinism Tools

[x] Deterministic diagnostics  
[x] Deterministic evaluation pipeline  
[ ] Show evaluation timing / state per node  
[ ] Toggle display of evaluation errors

---

# Status Snapshot

Core editor functionality: **stable**  
Parametric wiring (Driver → Input): **implemented**  
Wire → Driver (Phase 2C v2): **in progress**

Remaining UI work focuses on:
- editing ergonomics  
- visualization  
- debugging tools