# Implementation Plan: IDX Lot Sizing Calculator

**Branch**: `001-lot-sizing-calculator` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-lot-sizing-calculator/spec.md`

## Summary

Build a reactive, client-side lot sizing calculator for Indonesian stock traders (IDX). Implemented as a Next.js 15 static export site — no server, no backend. Five inputs drive all outputs reactively via React `useMemo`. Two-tier output: theoretical position (Tier A) and lot-rounded actual execution (Tier B), with a trade summary card. UI follows DESIGN.md (flat, high-density, monospace numerics).

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 15 default)  
**Primary Dependencies**: Next.js 15, React 19, Tailwind CSS v4, next/font/google (Inter + JetBrains Mono)  
**Storage**: None — no persistence in v1 per spec assumption  
**Testing**: N/A — automated testing excluded by constitution (Principle IV). Manual browser verification only.  
**Target Platform**: Static web — any modern browser, minimum 360px viewport width (SC-007)  
**Project Type**: Static web application (Next.js `output: 'export'`)  
**Performance Goals**: <200ms reactive recalculation per SC-002 (synchronous `useMemo`, trivially met)  
**Constraints**: Zero server dependency; deployable as static files; single `out/` directory artifact  
**Scale/Scope**: Single-page calculator; one trade setup at a time; no multi-user state

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Calculation Accuracy | ✅ PASS | All formulas in data-model.md; inline validation blocks calculation on invalid inputs |
| II. Simplicity | ✅ PASS with justified exception | Next.js adds build toolchain; explicitly chosen by user. No abstractions beyond what's required. |
| III. Web-First Delivery | ✅ PASS | `output: 'export'` produces static `out/` — no server required |
| IV. No Automated Testing | ✅ PASS | No test files, no test deps. Manual verification checklist in quickstart.md |

**Post-Phase 1 re-check**: ✅ Design artifacts add no violations. No external APIs, no backend, no test infrastructure introduced.

## Project Structure

### Documentation (this feature)

```text
specs/001-lot-sizing-calculator/
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Phase 0 output — framework/tooling decisions
├── data-model.md        # Phase 1 output — entities, formulas, validation rules
├── quickstart.md        # Phase 1 output — setup, dev, build, deploy, verification
├── contracts/
│   └── ui-contracts.md  # Phase 1 output — TypeScript interfaces and calculation invariants
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
lot-sizing/
├── app/
│   ├── layout.tsx          # Root layout: font setup, metadata, body wrapper
│   ├── page.tsx            # Single page: composes all calculator sections
│   └── globals.css         # Tailwind base directives + CSS custom properties
├── components/
│   ├── RiskPresets.tsx     # Segmented control — Pemula/Standard/Agresif/Risky
│   ├── InputSection.tsx    # The Big 5 inputs with labels, prefix/suffix, validation errors
│   ├── OutputSection.tsx   # Tier A (theoretical) + Tier B (actual) side-by-side cards
│   └── TradeSummaryCard.tsx# Execution summary card (entry/SL/TP/lot/capital/risk/gain/RRR)
├── lib/
│   ├── calculations.ts     # Pure functions: calculate(inputs) → TierA + TierB
│   ├── validation.ts       # validate(inputs) → ValidationErrors; isValid(errors) → boolean
│   └── format.ts           # formatIDR(), formatPct(), parseIDR()
├── types/
│   └── calculator.ts       # Shared interfaces: CalculatorInputs, TierAResults, TierBResults, etc.
├── next.config.ts          # output: 'export', trailingSlash: true
└── tailwind.config.ts      # DESIGN.md design tokens as Tailwind extensions
```

**Structure Decision**: Single Next.js app project. No separate backend. No monorepo. Flat component structure (4 components + 3 lib modules) matches the minimal scope.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Build toolchain (Next.js) | User explicitly requested Next.js | Vanilla HTML/JS would satisfy constitution; user overrode this choice |
