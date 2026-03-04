# CODEX_RULES.md — ParaHook Configurator

These rules govern how Codex operates inside the ParaHook repository.  
The system supports **two operating profiles** depending on the task type.

Codex must **always be told which profile is active** before beginning work.

---

# PROFILE A — UI REPAIR MODE
Used when fixing behavior inside the Spaghetti Editor UI.

Typical tasks:
- row mode rendering
- composite expansion
- port interactions
- drag behavior
- rerender storms
- visual bugs

This mode is **surgical and constrained**.

---

## A0) PRIMARY GOAL

Restore correct Spaghetti Editor UI behavior without modifying graph semantics or compile/runtime logic.

Focus areas:

- Row modes
- Composite expansion
- Canvas interaction behavior
- Anchor hit targets
- Rerender performance

---

## A1) HARD SCOPE LOCK (READ-ONLY AREAS)

DO NOT modify:
