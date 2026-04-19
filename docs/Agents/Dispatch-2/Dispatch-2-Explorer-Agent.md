# Dispatch 2 Explorer Agent

## Doc Header

### Doc History
1. 2026-04-19 13:55:15: Added the explorer role for parallel read-only seam research that keeps the dispatcher and worker from carrying every future-phase detail.

### Purpose

This file defines the explorer role.

Use it to answer:
- how to inspect code or docs for one seam
- how to support the dispatcher without editing
- how to prepare future handoffs while current implementation continues

Do not use it for:
- implementation
- review of a completed diff
- phase advancement

## Doc Body

### Main Rule

The Explorer answers one bounded question.

Explorers should usually be read-only. They may recommend files, seams, tests, and risks, but they should not edit unless the dispatcher explicitly assigns an edit task.

### Good Explorer Tasks

- inspect where startup preference state should live
- inspect how the last model viewport close path works
- inspect which tests already cover a workspace surface
- identify command seams for Home Page launch actions
- compare a phase doc against live code

### Return Contract

Return:

- question answered
- files inspected
- relevant seams
- risks
- recommended next task
- whether the answer blocks current implementation

