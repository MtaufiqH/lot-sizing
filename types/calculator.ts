export interface CalculatorInputs {
  modal: number;
  riskPlanPct: number;
  riskPerUnitPct: number;
  entryPrice: number;
  rrr: number;
}

export interface TierAResults {
  riskByPlan: number;
  stopLossPrice: number;
  entrySizeRp: number;
  entrySizePctModal: number;
  jumlahLembar: number;
}

export interface TierBResults {
  jumlahLot: number;
  lembarAktual: number;
  nilaiInvestasi: number;
  riskPerLembar: number;
  risikoAktual: number;
  riskAktualPctModal: number;
  targetPrice: number;
}

export interface CalculationResult {
  tierA: TierAResults;
  tierB: TierBResults;
  zeroLotWarning: boolean;
}

export interface ValidationErrors {
  modal: string | null;
  riskPlanPct: string | null;
  riskPerUnitPct: string | null;
  entryPrice: string | null;
  rrr: string | null;
}

export type RiskPresetId = "pemula" | "standard" | "agresif" | "risky";

export interface RiskPreset {
  id: RiskPresetId;
  label: string;
  value: number;
}

export const LOT_SIZE = 100;

export const RISK_PRESETS: RiskPreset[] = [
  { id: "pemula", label: "Pemula", value: 0.5 },
  { id: "standard", label: "Standard", value: 1.0 },
  { id: "agresif", label: "Agresif", value: 1.5 },
  { id: "risky", label: "Risky", value: 2.0 },
];
