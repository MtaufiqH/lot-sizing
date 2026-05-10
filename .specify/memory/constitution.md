<!--
SYNC IMPACT REPORT
==================
Version change: [UNVERSIONED] → 1.0.0
Principles added:
  - I. Calculation Accuracy (new)
  - II. Simplicity (new)
  - III. Web-First Delivery (new)
  - IV. No Automated Testing (new)
Sections added:
  - Technology Constraints
  - Development Workflow
Sections removed: N/A
Templates updated:
  - .specify/templates/plan-template.md ✅ updated (removed test dirs, updated Testing field guidance)
  - .specify/templates/tasks-template.md ✅ updated (testing tasks marked excluded)
  - .specify/templates/spec-template.md ✅ reviewed (no changes needed; "Independent Test" = manual verification)
Follow-up TODOs: None
-->

# Lot Sizing Calculator Constitution

## Core Principles

### I. Calculation Accuracy

Every lot sizing formula MUST produce mathematically correct results. Inputs MUST be validated at the UI boundary (numeric, positive, within domain range). Invalid inputs MUST surface a clear inline error and block calculation. No calculation may silently produce a wrong result or NaN.

**Rationale**: This is a trade tool. Incorrect lot sizes cost real money.

### II. Simplicity

The implementation MUST be the minimal code that satisfies requirements. No abstractions, libraries, or patterns beyond what the feature demands. YAGNI is law. Every added dependency MUST have explicit justification tied to a functional requirement.

**Rationale**: Minimum bare requirement scope. Complexity compounds maintenance cost with no trade benefit.

### III. Web-First Delivery

The tool MUST run entirely in the browser as a static web page. No backend server, no database, no authentication required. A single `index.html` (with optional co-located JS/CSS) MUST be the deployable artifact.

**Rationale**: Trade tools need fast, zero-friction access. No login, no install, no server dependency.

### IV. No Automated Testing

Automated testing (unit, integration, end-to-end) is EXPLICITLY EXCLUDED from this project. Verification happens through manual browser review. Acceptance scenarios in specs serve as manual verification checklists, not automated test specs.

**Rationale**: User requirement — zero testing overhead for minimum viable tool.

## Technology Constraints

- **Stack**: HTML5, CSS3, vanilla JavaScript (ES2020+) OR a single lightweight framework (e.g., React via CDN, Vue via CDN) — no build toolchain required unless explicitly chosen.
- **No build step by default**: The project MUST work by opening `index.html` directly in a browser OR via a simple static file server.
- **No test files**: Do not create any `*.test.*`, `*.spec.*`, `__tests__/`, `cypress/`, or similar test artifacts.
- **No test dependencies**: Do not add Jest, Vitest, Cypress, Playwright, or any testing library to the project.

## Development Workflow

- **Manual verification**: After each implementation task, open the browser and manually verify the acceptance scenarios defined in `spec.md`.
- **Single deployable**: All implementation MUST converge to a static artifact deployable on any static host (GitHub Pages, Vercel, Netlify, or local file system).
- **Commit discipline**: Commit after each completed task. Commit messages MUST reference the task ID (e.g., `feat: implement EOQ calculator [T003]`).
- **No CI testing gates**: CI (if configured) MUST NOT run test suites. Only lint or build checks are permitted.

## Governance

This constitution supersedes all other practices for this project. Amendments require:
1. Update `constitution.md` with version bump per semantic versioning rules.
2. Update dependent templates if principles change.
3. Document reason for amendment in the Sync Impact Report comment.

All implementation plans MUST include a Constitution Check gate verifying compliance with principles I–IV before Phase 0 begins.

**Version**: 1.0.0 | **Ratified**: 2026-05-10 | **Last Amended**: 2026-05-10
