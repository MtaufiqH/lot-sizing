# Research: IDX Lot Sizing Calculator

**Branch**: `001-lot-sizing-calculator` | **Date**: 2026-05-10

## Decisions

### 1. Framework: Next.js 15 (App Router) with Static Export

- **Decision**: Next.js 15, App Router, `output: 'export'` in `next.config.ts`
- **Rationale**: User explicitly requested Next.js. Static export satisfies Constitution Principle III — deliverable is a static `out/` directory deployable on any static host (Vercel, GitHub Pages, local file system).
- **Alternatives considered**: Vanilla HTML + JS (constitution default), Vite + React. Next.js chosen by explicit user requirement.

### 2. Styling: Tailwind CSS v4 (via PostCSS)

- **Decision**: Tailwind CSS, configured to match DESIGN.md tokens.
- **Rationale**: `code.html` reference already uses Tailwind CDN. Moving to proper Tailwind install gives purging, typed config, and aligns with Next.js default setup. No extra cognitive load.
- **Alternatives considered**: Inline styles, CSS Modules. Tailwind chosen for consistency with existing UI reference.

### 3. State Management: React `useState` + derived values via `useMemo`

- **Decision**: Single `useState` for the 5 inputs; all outputs derived via `useMemo` with no extra library.
- **Rationale**: Calculator has no async operations, no global state, no persistence. `useMemo` ensures reactive recalculation on every input change (satisfies FR-009, SC-002). Zero dependencies beyond React.
- **Alternatives considered**: Zustand, Redux, Jotai. All overkill for a single-component calculator.

### 4. Fonts: `next/font/google` (Inter + JetBrains Mono)

- **Decision**: Load Inter and JetBrains Mono via `next/font/google` for zero layout shift and offline optimization.
- **Rationale**: DESIGN.md mandates Inter for UI labels and JetBrains Mono for all numerical data. `next/font` self-hosts automatically, no CORS or CDN dependency.
- **Alternatives considered**: Google Fonts CDN link (as in code.html reference). Not used — build-time self-hosting is strictly better for static output.

### 5. IDR Formatting

- **Decision**: `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`
- **Rationale**: Built-in browser API, zero dependency, handles thousand separators (`.`) correctly per Indonesian convention (e.g., `Rp 1.000.000`). Satisfies FR-011.
- **Alternatives considered**: Custom formatter, `numeral.js`. Built-in is simpler and more correct.

### 6. Input Parsing (IDR Input with Thousand Separators)

- **Decision**: Store raw numeric value internally; display formatted string in input; on change, strip non-numeric characters before parsing.
- **Rationale**: Allows users to type naturally (e.g., `100000000` or `100.000.000`) while ensuring the calculation always uses clean numeric values. Required for FR-001 (Modal input).
- **Alternatives considered**: Controlled numeric-only input (no formatting). Formatting on display is better UX for IDR amounts.

### 7. Validation Strategy

- **Decision**: Inline validation on blur + reactive disable of output section when any input is invalid.
- **Rationale**: FR-010 requires inline error messages and hidden/invalid outputs. Blur validation prevents premature errors while typing. All outputs wrapped in a conditional that checks `isValid` before rendering.
- **Alternatives considered**: Submit-time validation (spec explicitly requires reactive, no-submit flow per FR-009).

### 8. Lot Rounding

- **Decision**: `Math.floor(jumlahLembar / 100)` strictly.
- **Rationale**: Constitution Principle I + spec assumption: always round down to protect risk. Never round up. `Math.floor` is deterministic and correct.

### 9. Tailwind Config Tokens

- **Decision**: Map all DESIGN.md color/spacing/typography tokens into `tailwind.config.ts`.
- **Rationale**: Ensures pixel-perfect match to design system without custom CSS classes. All design tokens from DESIGN.md are expressed as Tailwind extensions.

## Resolved Clarifications

All NEEDS CLARIFICATION items resolved:

| Item | Resolution |
|------|-----------|
| Language/Version | TypeScript 5.x (Next.js default) |
| Framework | Next.js 15, App Router |
| Target Platform | Static web (any browser, ≥360px width per SC-007) |
| Build artifact | `out/` directory via `next build` with `output: 'export'` |
| Storage | None (FR spec: no persistence in v1) |
| Performance goal | <200ms recalculation per SC-002 (useMemo is synchronous, trivially met) |
