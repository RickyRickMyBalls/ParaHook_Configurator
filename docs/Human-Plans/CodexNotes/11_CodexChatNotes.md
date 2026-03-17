# 11 Codex Chat Notes

## Doc Header

### Doc Notes

- This is the active Codex notes file going forward.
- Use this file for raw planning notes before implementation work.
- Current planning focus:
  - post-`2.3` Browser cleanup discoveries
  - where the newer `Graph Documents` child-section idea belongs in the roadmap
  - keeping the completed `AS6` answers historical while still recording later carry-forward
- Primary source docs for this planning pass:
  - `docs/Human-Plans/roadmap/roadmap.md`
  - `docs/Phase-Plans/07_AS - Phase-Plans.md`
  - `docs/Human-Plans/roadmap/Vision-roadmap.md`
- Keep substantive timestamped entries on the absolute `[N]` numbering path from the previous file.

## Doc Body

## Session 1 Notes

##### [173] 2026-03-16 14:12 - Outline idea: `Graph Documents` child sections should become `Needs Rebuild` plus `Nodes`

Suggested Browser shape:

- `Graph Documents`
  - `Graph 1`
    - `Needs Rebuild`
    - `Nodes`

Section order and default state:

- `Needs Rebuild`
  - first
  - normally open
- `Nodes`
  - second
  - normally closed

What `Needs Rebuild` should show:

- only produced graph-owned published objects/outputs that currently need rebuild
- do not show:
  - empty/non-producing entries like `s002`
  - clean/up-to-date rows
- rows should disappear when rebuild is finished and the row is clean again

What `Nodes` should show:

- the authored node inventory for the current graph canvas
- this is the place where the graph can later expose:
  - every node in the canvas
  - authoring/navigation selection
  - later node-focused jump/reveal behavior

Reading rule:

- `Needs Rebuild`
  - work queue / pending impact surface
- `Nodes`
  - authoring inventory surface

Why this split is cleaner:

- it avoids one mixed child list trying to mean both:
  - authored graph structure
  - pending rebuild work
- it keeps the graph side useful without duplicating the full `Content` tree

Implementation boundary:

- if implemented, this should be a small later Browser/graph-documents pass
- not a retroactive change to the completed `AS6` answers
- not part of `2.4`

##### [172] 2026-03-16 14:04 - Post-`2.3` `Graph Documents` follow-up should be a small Browser workspace phase, not part of `2.4`

Current planning read:

- the newer `Graph Documents` idea discovered after `2.3` does not belong in:
  - `[2.4]`
    - reference assets / project view layers
  - a retroactive rewrite of the completed `AS6` answers
- it is better treated as a small later Browser/graph-documents cleanup phase inside Lane `[2.1]`

Recommended roadmap home:

- add a small follow-up slot like:
  - `[2.1F]`
    - `Graph Documents Child Sections`
    - or similar naming around `Needs Rebuild` plus `Nodes`

Why this belongs there:

- it is graph-row / Browser-workspace behavior, not published `Content` structure
- it preserves the completed Phase 6 split:
  - `Graph Documents`
    - authoring/document surface
  - `Content`
    - build/policy surface
- it is a practical cleanup of what graph child rows mean after the first `2.3` ship cut

Preferred later shape:

- under each graph document:
  - `Needs Rebuild`
    - first
    - normally open
    - only produced rows that currently need rebuild
    - rows disappear once rebuilt and clean
    - do not show empty/non-producing rows like `s002`
  - `Nodes`
    - second
    - normally closed
    - full authored node list for the canvas

Important boundary:

- this should be recorded as post-Phase-6 carry-forward
- do not rewrite the locked `AS6.Q2` answer to pretend this was already the Phase 6 rule
- if implemented next, it should be treated as a small new roadmap/item follow-up, not as unfinished `2.3`
