# Tasks: IDX Lot Sizing Calculator

**Input**: Design documents from `/specs/001-lot-sizing-calculator/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ui-contracts.md ✅ | quickstart.md ✅

**Tests**: Automated testing is EXCLUDED by constitution (Principle IV). No test tasks. Manual browser verification only (quickstart.md checklist).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1–US4)
- Exact file paths included in every task description

---

## Phase 1: Setup (Project Scaffold)

**Purpose**: Bootstrap Next.js 15 project with correct config, fonts, and Tailwind tokens. No user story code yet.

- [X] T001 Scaffold Next.js 15 project at repo root using `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --no-eslint` (see quickstart.md)
- [X] T002 Configure `next.config.ts` with `output: 'export'` and `trailingSlash: true`
- [X] T003 [P] Configure `tailwind.config.ts` with DESIGN.md color, typography, and spacing tokens as Tailwind extensions (done via @theme in globals.css — Tailwind v4 CSS-first approach)
- [X] T004 [P] Configure `app/globals.css` with Tailwind base directives and CSS custom properties from DESIGN.md

**Checkpoint**: `npm run dev` serves a blank page at localhost:3000 with correct fonts and no build errors.

---

## Phase 2: Foundational (Shared Types and Logic)

**Purpose**: TypeScript interfaces, pure calculation/validation/format functions, and root layout. All user story components depend on these.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Define all shared TypeScript interfaces in `types/calculator.ts`: `CalculatorInputs`, `TierAResults`, `TierBResults`, `CalculationResult`, `ValidationErrors`, `RiskPreset` — match exactly the signatures in `contracts/ui-contracts.md`
- [X] T006 [P] Implement `calculate(inputs: CalculatorInputs): CalculationResult` pure function in `lib/calculations.ts` using all TierA and TierB formulas from `data-model.md`; include `zeroLotWarning: jumlahLot === 0`; use `LOT_SIZE = 100` and `RISK_PRESETS` constants
- [X] T007 [P] Implement `validate(inputs)` and `isValid(errors)` in `lib/validation.ts` using all five validation rules and error messages from `data-model.md`
- [X] T008 [P] Implement `formatIDR()`, `formatPct()`, `parseIDR()` in `lib/format.ts` using `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })` per research.md decision #5
- [X] T009 Configure `app/layout.tsx` with `next/font/google` loading Inter (UI labels) and JetBrains Mono (numeric data), root metadata, and body wrapper with font CSS variables

**Checkpoint**: All lib functions importable with no TypeScript errors. `npm run build` succeeds.

---

## Phase 3: User Story 1 — Core Position Sizing Calculation (Priority: P1) 🎯 MVP

**Goal**: Trader enters all 5 inputs and sees a complete set of Tier A calculated outputs. Reactive updates on every keystroke.

**Independent Test**: Modal=10M, RiskPlan=1%, RiskPerUnit=2%, Entry=1000, RRR=2 → riskByPlan=Rp 100.000, SL=Rp 980, Target=Rp 1.040, jumlahLembar=5.000. Change any field → outputs update instantly. Leave Entry blank → inline error shown, outputs hidden.

- [X] T010 [P] [US1] Build `components/InputSection.tsx` implementing `InputSectionProps` from `contracts/ui-contracts.md`: 5 labeled inputs (Modal with Rp prefix, RiskPlanPct %, RiskPerUnitPct %, EntryPrice with Rp prefix, RRR), inline `ValidationErrors` display per field on blur, all values driven by `onChange(field, value)` prop
- [X] T011 [P] [US1] Build `components/OutputSection.tsx` implementing `OutputSectionProps` from `contracts/ui-contracts.md`: render Tier A results (riskByPlan, stopLossPrice, entrySizeRp, entrySizePctModal, jumlahLembar) formatted via `lib/format.ts`; render nothing (or placeholder) when `isVisible=false`
- [X] T012 [US1] Wire `app/page.tsx`: `useState<CalculatorInputs>` for all 5 inputs; `useMemo` for `validate()` and `calculate()`; compose `<InputSection>` + `<OutputSection>`; pass `isVisible={isValid(errors)}` (depends on T010, T011)

**Checkpoint**: Open app, fill all 5 inputs, verify Tier A output values match spec acceptance scenario #1. Modify any field — outputs update with no submit action. Clear a field — inline validation error appears.

---

## Phase 4: User Story 2 — Lot-Based Actual Execution Sizing (Priority: P1)

**Goal**: Tier B (lot-rounded execution) figures displayed side by side with Tier A. Zero-lot warning shown when position is below 1 lot.

**Independent Test**: Theoretical=5050 shares → 50 lots (5000 shares). Theoretical=5100 → 51 lots. Tiny capital → 0 lots + "Posisi di bawah minimum 1 lot (100 lembar)" warning.

- [X] T013 [US2] Extend `components/OutputSection.tsx` to render Tier B results (jumlahLot, lembarAktual, nilaiInvestasi, riskPerLembar, risikoAktual, riskAktualPctModal, targetPrice) side by side with Tier A in a two-column card layout
- [X] T014 [US2] Add zero-lot warning in `components/OutputSection.tsx`: when `result.zeroLotWarning === true`, display "Posisi di bawah minimum 1 lot (100 lembar)" warning banner (depends on T013)

**Checkpoint**: With theoretical=5050 shares, lot section shows 50 lots / 5000 shares. With tiny capital producing <100 theoretical shares, warning banner renders. Both Tier A and Tier B columns visible side by side.

---

## Phase 5: User Story 3 — Risk Profile Quick Presets (Priority: P2)

**Goal**: Segmented control with Pemula/Standard/Agresif/Risky presets. Selecting a preset sets riskPlanPct and recalculates. Manual edit deselects active preset.

**Independent Test**: Click "Standard" → riskPlanPct=1.0, all outputs recalculate. Manually edit the Risk by Plan field → active preset button deselects immediately.

- [X] T015 [US3] Build `components/RiskPresets.tsx` implementing `RiskPresetsProps` from `contracts/ui-contracts.md`: 4 segmented buttons (Pemula 0.5%, Standard 1.0%, Agresif 1.5%, Risky 2.0%) from `RISK_PRESETS` constant; `activePresetId` controls highlight; `onPresetSelect(value, id)` fires on click
- [X] T016 [US3] Add `activePresetId` state in `app/page.tsx`; wire `<RiskPresets>` above `<InputSection>`; in `onChange('riskPlanPct', value)` handler: if value does not match any preset, set `activePresetId = null` (deselect); if `onPresetSelect` fires: set both `riskPlanPct` and `activePresetId` (depends on T015)

**Checkpoint**: Click each preset — riskPlanPct updates and outputs recalculate. Click "Agresif", then manually type a different value in Risk by Plan → preset highlight disappears.

---

## Phase 6: User Story 4 — Summary Trade Card (Priority: P3)

**Goal**: Trade summary card below the calculator shows all key execution-time data points. Placeholder state when inputs are invalid.

**Independent Test**: With all valid inputs, summary card renders entry price, SL, target, lot count, shares, capital deployed, max loss, expected gain, and actual RRR. With any invalid input, card shows placeholder (no partial data).

- [X] T017 [US4] Build `components/TradeSummaryCard.tsx` implementing `TradeSummaryCardProps` from `contracts/ui-contracts.md`: display entry price, stopLossPrice, targetPrice, jumlahLot, lembarAktual, nilaiInvestasi, risikoAktual, expectedGain (risikoAktual × rrr), and actual RRR; format all monetary values with `formatIDR()`, percentages with `formatPct()`
- [X] T018 [US4] Wire `<TradeSummaryCard>` into `app/page.tsx` below OutputSection; pass `isVisible={isValid(errors)}`; render placeholder card (e.g. "Isi semua input untuk melihat ringkasan") when `isVisible=false` (depends on T017)

**Checkpoint**: With complete valid inputs, summary card shows all 9 data points. Remove entry price → card switches to placeholder. Re-enter → card reappears with correct values.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Mobile responsiveness, large-number formatting, static build verification, final manual checklist run.

- [X] T019 [P] Verify and fix responsive layout across all components (`app/page.tsx`, `components/*.tsx`) for ≥360px viewport width with no horizontal scrolling (SC-007); use Tailwind responsive prefixes
- [X] T020 [P] Validate `lib/format.ts` formatIDR output for large values (Rp 10.000.000.000) and edge case 0; confirm no overflow or truncation in Output and Summary card at all valid input magnitudes
- [ ] T021 Run complete manual verification checklist from `specs/001-lot-sizing-calculator/quickstart.md` (all 10 scenarios) against `npm run dev`; fix any discrepancy found
- [X] T022 Run `npm run build`; confirm `out/` directory is generated with no errors; serve with `npx serve out/` and re-verify core calc scenario

**Checkpoint**: All 10 quickstart.md scenarios pass. Static build succeeds. App usable at 360px width.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **blocks all user story phases**
- **Phase 3 (US1)**: Depends on Phase 2 completion
- **Phase 4 (US2)**: Depends on Phase 3 (T012 wires page.tsx; OutputSection must exist)
- **Phase 5 (US3)**: Depends on Phase 2 completion — can start in parallel with Phase 4 after Phase 3 is wired
- **Phase 6 (US4)**: Depends on Phase 4 (needs wired page.tsx with full CalculationResult)
- **Phase 7 (Polish)**: Depends on all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Blocks US2, US3, US4 — must be complete before extending page.tsx
- **US2 (P1)**: Extends US1 OutputSection — sequential after US1
- **US3 (P2)**: Can start after Phase 2; integrates into page.tsx after US1 wired (T012)
- **US4 (P3)**: Depends on US2 (full CalculationResult including TierB used in card)

### Within Each Phase

- T005 before T006, T007, T008 (all lib files import from types/calculator.ts)
- T006, T007, T008 parallel with each other (different files, same dependency on T005)
- T010, T011 parallel with each other (different component files)
- T012 after T010 and T011
- T013 before T014 (same file, sequential edits)
- T015 before T016 (component before wiring)
- T017 before T018 (component before wiring)

### Parallel Opportunities

```bash
# Phase 1 parallel tasks (after T001 scaffolds the project):
T003  # tailwind.config.ts tokens
T004  # globals.css directives

# Phase 2 parallel tasks (after T005 defines types):
T006  # lib/calculations.ts
T007  # lib/validation.ts
T008  # lib/format.ts

# Phase 3 parallel tasks (after Phase 2 complete):
T010  # components/InputSection.tsx
T011  # components/OutputSection.tsx

# Phase 7 parallel tasks:
T019  # responsive layout check
T020  # large-number formatting check
```

---

## Implementation Strategy

### MVP First (US1 only — minimal viable calculator)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Manual check of quickstart.md scenario #1 and #2
5. Deploy preview if ready

### Incremental Delivery

1. Phase 1 + Phase 2 → types and logic complete
2. Phase 3 (US1) → working calculator with Tier A only → **MVP**
3. Phase 4 (US2) → lot rounding added → **core trading utility complete**
4. Phase 5 (US3) → presets → **workflow speed-up**
5. Phase 6 (US4) → summary card → **execution-time convenience**
6. Phase 7 → polish and build → **ship-ready**

### Single-Developer Order (recommended)

T001 → T002 → [T003, T004] → T005 → [T006, T007, T008] → T009 → [T010, T011] → T012 → T013 → T014 → T015 → T016 → T017 → T018 → [T019, T020] → T021 → T022

---

## Notes

- No test tasks — constitution Principle IV forbids automated testing
- [P] = different files, truly parallelizable by agent or developer
- [Story] label maps each task to its acceptance scenario in spec.md
- Each phase checkpoint is independently verifiable via manual browser check
- `calculate()` in lib/calculations.ts handles BOTH TierA and TierB — no split needed
- `formatIDR()` must use `id-ID` locale (dot thousands separator, not comma) per FR-011
- Lot rounding is always `Math.floor` — never round up (Constitution Principle I)
