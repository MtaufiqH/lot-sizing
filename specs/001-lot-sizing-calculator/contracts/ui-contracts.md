# UI Contracts: IDX Lot Sizing Calculator

**Branch**: `001-lot-sizing-calculator` | **Date**: 2026-05-10

## Calculation Module Contract

The pure calculation functions are isolated in `src/lib/calculations.ts` and must satisfy this interface:

```typescript
// src/lib/calculations.ts

export interface CalculatorInputs {
  modal: number;          // IDR total capital
  riskPlanPct: number;    // % risk per trade (e.g. 1.0 for 1%)
  riskPerUnitPct: number; // % stop loss distance from entry
  entryPrice: number;     // IDR per share
  rrr: number;            // risk-reward ratio (e.g. 2.0 for 1:2)
}

export interface TierAResults {
  riskByPlan: number;         // IDR
  stopLossPrice: number;      // IDR/share
  entrySizeRp: number;        // IDR
  entrySizePctModal: number;  // %
  jumlahLembar: number;       // shares (theoretical, non-integer OK)
}

export interface TierBResults {
  jumlahLot: number;          // lots (always integer, floor)
  lembarAktual: number;       // shares (always multiple of 100)
  nilaiInvestasi: number;     // IDR
  riskPerLembar: number;      // IDR/share
  risikoAktual: number;       // IDR
  riskAktualPctModal: number; // %
  targetPrice: number;        // IDR/share
}

export interface CalculationResult {
  tierA: TierAResults;
  tierB: TierBResults;
  zeroLotWarning: boolean;    // true when jumlahLot === 0
}

// Pure function — no side effects, no I/O
export function calculate(inputs: CalculatorInputs): CalculationResult;
```

### Calculation Invariants (manually verifiable)

Given: Modal=10,000,000 | RiskPlan=1% | RiskPerUnit=2% | Entry=1,000 | RRR=2

Expected:
- riskByPlan = 100,000
- stopLossPrice = 980
- entrySizeRp = 5,000,000
- entrySizePctModal = 50
- jumlahLembar = 5,000
- jumlahLot = 50
- lembarAktual = 5,000
- nilaiInvestasi = 5,000,000
- riskPerLembar = 20
- risikoAktual = 100,000
- riskAktualPctModal = 1.0
- targetPrice = 1,040

## Validation Module Contract

```typescript
// src/lib/validation.ts

export interface ValidationErrors {
  modal: string | null;
  riskPlanPct: string | null;
  riskPerUnitPct: string | null;
  entryPrice: string | null;
  rrr: string | null;
}

export function validate(inputs: Partial<CalculatorInputs>): ValidationErrors;

// Derived helper
export function isValid(errors: ValidationErrors): boolean;
// Returns true only when all error fields are null
```

## Formatting Contract

```typescript
// src/lib/format.ts

// Format as Indonesian IDR: Rp 1.000.000
export function formatIDR(value: number): string;

// Format as percentage: 1.00%
export function formatPct(value: number, decimals?: number): string;

// Parse IDR string (strips "Rp", dots, spaces) → number
export function parseIDR(value: string): number;
```

## Component Props Contracts

### `<RiskPresets />`
```typescript
interface RiskPresetsProps {
  activePresetId: string | null;       // null = custom mode
  onPresetSelect: (value: number, id: string) => void;
}
```

### `<InputSection />`
```typescript
interface InputSectionProps {
  inputs: CalculatorInputs;
  errors: ValidationErrors;
  activePresetId: string | null;
  onChange: (field: keyof CalculatorInputs, value: number) => void;
}
```

### `<OutputSection />`
```typescript
interface OutputSectionProps {
  result: CalculationResult;
  isVisible: boolean; // false when inputs invalid
}
```

### `<TradeSummaryCard />`
```typescript
interface TradeSummaryCardProps {
  inputs: CalculatorInputs;
  result: CalculationResult;
  isVisible: boolean;
}
```
