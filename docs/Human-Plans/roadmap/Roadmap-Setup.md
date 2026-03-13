# Roadmap Setup

## Doc Header

### Doc History
1. 2026-03-10 00:08: Created this file as the setup/structure companion to `docs/Human-Plans/roadmap/roadmap.md`, so roadmap formatting rules, tracker-purpose notes, and future extraction targets can live here while `roadmap.md` gets cleaner and more lane-body focused over time

### Purpose

This file is the setup/structure companion for:
- `docs/Human-Plans/roadmap/roadmap.md`

Use it for:
- roadmap formatting rules
- what belongs in `roadmap.md` versus what should be moved out
- tracker-purpose notes
- future cleanup/extraction plans for the roadmap

Do not use it for:
- the live lane body itself
- the main current-roadmap reading surface
- detailed task execution checklists

## Doc Body

### Why This File Exists

`roadmap.md` is currently doing too many jobs at once:
- human-facing roadmap
- lane body
- top-level trackers
- plan-doc status tracker
- roadmap breakdown tracker
- carry-forward notes

That makes the file useful, but noisy.

This setup doc exists so the roadmap can gradually become:
- cleaner at the top
- more lane-body focused
- easier to scan in folded views

### Intended Split

Keep in `roadmap.md`:
- current direction
- lane summaries
- lane body
- phase ordering
- carry-forward notes that directly affect lane meaning

Move or keep in `Roadmap-Setup.md`:
- formatting rules
- what each tracker means
- roadmap cleanup notes
- extraction plans
- “how to read this roadmap” guidance

### Candidate Sections To Pull Out Of `roadmap.md`

Good candidates to move here later:
- large tracker legend blocks
- duplicated plan-doc-status explanations
- roadmap-maintenance notes
- formatting notes that do not change lane meaning
- meta comments about fold strategy and section purpose

Possible keepers inside `roadmap.md` even after cleanup:
- one compact status legend
- one compact immediate checklist
- the lane body

### Preferred Future Shape For `roadmap.md`

Target shape:
1. short doc header
2. short purpose/scope
3. one compact status legend
4. one compact immediate direction block
5. lane bodies

That would make `roadmap.md` read more like:
- “what are we doing and in what order?”

instead of:
- “full roadmap plus all roadmap maintenance infrastructure in one file”

### Preferred Future Shape For This File

This file should eventually hold:
- roadmap format rules
- lane formatting conventions
- tracker meaning
- extraction notes
- cleanup checklist for reducing roadmap noise

### First Cleanup Direction

When you start moving material out of `roadmap.md`, the safest order is:
1. move repeated tracker-explanation text here
2. move format/reading guidance here
3. keep lane bodies in place
4. only then consider slimming the top tracker blocks

That reduces noise without risking lane meaning.

### Roadmap Formatting Intent

Preferred roadmap hierarchy:
- `##`
  - lane
- `###`
  - phase
- `####`
  - section bucket
- `#####`
  - detail bucket

Preferred roadmap reading priority:
1. lane summary
2. lane body
3. phase summary
4. checklist
5. likely files

### Future Cleanup CheckList

- [ ] decide which tracker blocks stay in `roadmap.md`
- [ ] decide which tracker blocks move here
- [ ] reduce duplicated legend text in `roadmap.md`
- [ ] keep lane body as the main live roadmap surface
- [ ] normalize phase formatting across all lanes
