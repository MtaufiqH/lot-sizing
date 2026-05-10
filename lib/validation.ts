import type { CalculatorInputs, ValidationErrors } from "@/types/calculator";

export function validate(inputs: Partial<CalculatorInputs>): ValidationErrors {
  const { modal, riskPlanPct, riskPerUnitPct, entryPrice, rrr } = inputs;

  return {
    modal:
      modal == null || !isFinite(modal) || modal <= 0
        ? "Modal harus lebih dari 0"
        : null,
    riskPlanPct:
      riskPlanPct == null || riskPlanPct <= 0 || riskPlanPct > 100
        ? "Risk Plan harus antara 0–100%"
        : null,
    riskPerUnitPct:
      riskPerUnitPct == null || riskPerUnitPct <= 0 || riskPerUnitPct >= 100
        ? "Risk per Unit harus antara 0–99%"
        : null,
    entryPrice:
      entryPrice == null || !isFinite(entryPrice) || entryPrice <= 0
        ? "Harga entry harus lebih dari 0"
        : null,
    rrr:
      rrr == null || rrr < 0.1
        ? "RRR minimal 0.1"
        : null,
  };
}

export function isValid(errors: ValidationErrors): boolean {
  return (
    errors.modal === null &&
    errors.riskPlanPct === null &&
    errors.riskPerUnitPct === null &&
    errors.entryPrice === null &&
    errors.rrr === null
  );
}
