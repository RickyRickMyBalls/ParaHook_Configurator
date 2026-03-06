Phase 2C v2.2 — Driven Number Offset Mode

[ ] Data model: add offset storage for number drivers
    - offsetValue (number, same unit as driver)
    - default 0 when first becomes driven (deterministic)

[ ] Evaluation rule (number drivers only)
    - drivenValue = resolved value from drv:in:<paramId>
    - effectiveValue = drivenValue + offsetValue
    - if driven-but-unresolved: keep unresolved semantics (no fallback)

[ ] UI rule
    - show drivenValue read-only
    - show editable offset control (existing drag bar)
    - show effectiveValue display
    - change fill-bar styling/color to indicate “offset mode”

[ ] Validation rule
    - only for kind:number drivers
    - unit must match between driven input and driver

[ ] Tests
    - evaluation determinism (effective = driven + offset)
    - UI displays driven + offset + effective
    - offset defaults to 0 on first drive
    - unresolved behavior unchanged