## [ ] `4.1J` Input Ownership And Coordination Cleanup

#### Summary

`4.1J` should clean up the coordination seam between:
- the `Console`
- the `Browser`
- the `Spaghetti Editor`
- `ViewportOverlay`
- `Viewer`
- active toolbars and tool sessions

The goal is not to centralize all behavior in one file.

The goal is:
- centralize input ownership decisions
- keep feature/session behavior in domain seams
- remove ambiguous key ownership

#### Target Outcome

`4.1J` should establish:
- one explicit input-priority model
- one shared routing seam that decides who owns a key
- domain-owned session behavior after ownership is resolved
- fewer ad hoc `keydown` listeners with overlapping authority

Important rule:
- do not turn `ConsoleDock` into a god object
- do not turn `AppShell` into a god object

## Subphases


