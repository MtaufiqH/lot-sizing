import type {
  CalculatorInputs,
  CalculationResult,
} from "@/types/calculator";
import { LOT_SIZE } from "@/types/calculator";

export function calculate(inputs: CalculatorInputs): CalculationResult {
  const { modal, riskPlanPct, riskPerUnitPct, entryPrice, rrr } = inputs;

  // Tier A
  const riskByPlan = modal * (riskPlanPct / 100);
  const stopLossPrice = entryPrice * (1 - riskPerUnitPct / 100);
  const entrySizeRp = riskByPlan / (riskPerUnitPct / 100);
  const entrySizePctModal = (entrySizeRp / modal) * 100;
  const jumlahLembar = entrySizeRp / entryPrice;

  // Tier B
  const jumlahLot = Math.floor(jumlahLembar / LOT_SIZE);
  const lembarAktual = jumlahLot * LOT_SIZE;
  const nilaiInvestasi = lembarAktual * entryPrice;
  const riskPerLembar = entryPrice - stopLossPrice;
  const risikoAktual = lembarAktual * riskPerLembar;
  const riskAktualPctModal = (risikoAktual / modal) * 100;
  const targetPrice = entryPrice + riskPerLembar * rrr;

  return {
    tierA: {
      riskByPlan,
      stopLossPrice,
      entrySizeRp,
      entrySizePctModal,
      jumlahLembar,
    },
    tierB: {
      jumlahLot,
      lembarAktual,
      nilaiInvestasi,
      riskPerLembar,
      risikoAktual,
      riskAktualPctModal,
      targetPrice,
    },
    zeroLotWarning: jumlahLot === 0,
  };
}
