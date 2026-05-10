# Data Model: IDX Lot Sizing Calculator

**Branch**: `001-lot-sizing-calculator` | **Date**: 2026-05-10

## Entities

### 1. `CalculatorInputs` (UI State)

The 5 raw inputs controlled by the user.

| Field | Type | Unit | Validation |
|-------|------|------|-----------|
| `modal` | `number` | IDR | > 0, finite |
| `riskPlanPct` | `number` | % (0–100) | > 0, ≤ 100 |
| `riskPerUnitPct` | `number` | % (0–99) | > 0, < 100 |
| `entryPrice` | `number` | IDR/share | > 0, finite |
| `rrr` | `number` | ratio | ≥ 0.1 |

### 2. `RiskPreset`

Named presets that populate `riskPlanPct`.

| Field | Type | Values |
|-------|------|--------|
| `id` | `'pemula' \| 'standard' \| 'agresif' \| 'risky'` | — |
| `label` | `string` | "Pemula", "Standard", "Agresif", "Risky" |
| `value` | `number` | 0.5, 1.0, 1.5, 2.0 |

**Behavior**: Selecting a preset sets `riskPlanPct` = preset.value and marks preset as active. If user manually edits `riskPlanPct` to any other value, active preset deselects (FR-014).

### 3. `TierAResults` (Theoretical Trade Plan)

Derived from `CalculatorInputs` when all inputs are valid.

| Field | Formula | Unit |
|-------|---------|------|
| `riskByPlan` | `modal × (riskPlanPct / 100)` | IDR |
| `stopLossPrice` | `entryPrice × (1 - riskPerUnitPct / 100)` | IDR/share |
| `entrySizeRp` | `riskByPlan / (riskPerUnitPct / 100)` | IDR |
| `entrySizePctModal` | `(entrySizeRp / modal) × 100` | % |
| `jumlahLembar` | `entrySizeRp / entryPrice` | shares |

### 4. `TierBResults` (Actual Execution — IDX Reality)

Derived from `TierAResults`. Accounts for 1 Lot = 100 shares constraint.

| Field | Formula | Unit |
|-------|---------|------|
| `jumlahLot` | `Math.floor(jumlahLembar / 100)` | lots |
| `lembarAktual` | `jumlahLot × 100` | shares |
| `nilaiInvestasi` | `lembarAktual × entryPrice` | IDR |
| `riskPerLembar` | `entryPrice - stopLossPrice` | IDR/share |
| `risikoAktual` | `lembarAktual × riskPerLembar` | IDR |
| `riskAktualPctModal` | `(risikoAktual / modal) × 100` | % |
| `targetPrice` | `entryPrice + (riskPerLembar × rrr)` | IDR/share |

### 5. `ValidationState`

Per-field validation result.

| Field | Type | Description |
|-------|------|-------------|
| `modal` | `string \| null` | Error message or null if valid |
| `riskPlanPct` | `string \| null` | Error message or null if valid |
| `riskPerUnitPct` | `string \| null` | Error message or null if valid |
| `entryPrice` | `string \| null` | Error message or null if valid |
| `rrr` | `string \| null` | Error message or null if valid |
| `isValid` | `boolean` | `true` only when all fields are null |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|--------------|
| `modal` | Must be > 0 and finite | "Modal harus lebih dari 0" |
| `riskPlanPct` | Must be > 0 and ≤ 100 | "Risk Plan harus antara 0–100%" |
| `riskPerUnitPct` | Must be > 0 and < 100 | "Risk per Unit harus antara 0–99%" |
| `entryPrice` | Must be > 0 and finite | "Harga entry harus lebih dari 0" |
| `rrr` | Must be ≥ 0.1 | "RRR minimal 0.1" |

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| `jumlahLot === 0` (theoretical shares < 100) | Show 0 lots + warning: "Posisi di bawah minimum 1 lot (100 lembar)" |
| `entryPrice === 0 or < 0` | Validation error, no calculation |
| `riskPerUnitPct ≥ 100` | Capped by validation at < 100, error shown |
| `rrr < 0.1` | Validation error |
| Very large `modal` (e.g., Rp 10 billion) | `Intl.NumberFormat` handles formatting, no overflow (JS number precision safe up to 2^53) |
| Empty input on load | All outputs hidden, no errors shown until blur |

## State Transitions

```
INITIAL (inputs empty/default)
  → user fills inputs
    → VALIDATING (on blur per field)
      → INVALID (any field invalid) → outputs hidden, errors shown
      → VALID (all fields valid) → outputs computed and shown
        → user edits preset → preset active state updates
        → user manual edits riskPlanPct → preset deselects
```

## Constants

```typescript
const LOT_SIZE = 100; // shares per lot, fixed for IDX
const RISK_PRESETS = [
  { id: 'pemula',   label: 'Pemula',   value: 0.5  },
  { id: 'standard', label: 'Standard', value: 1.0  },
  { id: 'agresif',  label: 'Agresif',  value: 1.5  },
  { id: 'risky',    label: 'Risky',    value: 2.0  },
] as const;
```
