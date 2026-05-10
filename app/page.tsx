"use client";

import { useState, useMemo } from "react";
import type { CalculatorInputs } from "@/types/calculator";
import { RISK_PRESETS } from "@/types/calculator";
import { calculate } from "@/lib/calculations";
import { validate, isValid } from "@/lib/validation";
import { RiskPresets } from "@/components/RiskPresets";
import { InputSection } from "@/components/InputSection";
import { OutputSection } from "@/components/OutputSection";
import { TradeSummaryCard } from "@/components/TradeSummaryCard";

const DEFAULT_INPUTS: CalculatorInputs = {
  modal: 0,
  riskPlanPct: 0,
  riskPerUnitPct: 0,
  entryPrice: 0,
  rrr: 0,
};

const FALLBACK_INPUTS: CalculatorInputs = {
  modal: 1,
  riskPlanPct: 1,
  riskPerUnitPct: 1,
  entryPrice: 1,
  rrr: 1,
};

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [touched, setTouched] = useState<Partial<Record<keyof CalculatorInputs, boolean>>>({});
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const errors = useMemo(() => validate(inputs), [inputs]);
  const valid = useMemo(() => isValid(errors), [errors]);
  const result = useMemo(() => (valid ? calculate(inputs) : null), [valid, inputs]);
  const displayResult = result ?? calculate(FALLBACK_INPUTS);

  function handleChange(field: keyof CalculatorInputs, value: number) {
    setInputs((prev) => ({ ...prev, [field]: value }));
    if (field === "riskPlanPct") {
      const match = RISK_PRESETS.find((p) => p.value === value);
      setActivePresetId(match ? match.id : null);
    }
  }

  function handleBlur(field: keyof CalculatorInputs) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handlePresetSelect(value: number, id: string) {
    setActivePresetId(id);
    setInputs((prev) => ({ ...prev, riskPlanPct: value }));
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Top bar */}
      <header
        className="border-b px-4 sm:px-6 py-3 flex items-center justify-between shrink-0"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--color-green)" }}
          />
          <span
            className="text-[13px] font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}
          >
            IDX LOT SIZING
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded border"
            style={{
              color: "var(--color-accent)",
              borderColor: "var(--color-accent-subtle)",
              backgroundColor: "var(--color-accent-subtle)",
            }}
          >
            v1.0
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Stat label="1 Lot" value="100 lbr" />
          <Stat label="IDX" value="BEI" />
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[360px_1fr] min-h-0">
        {/* Left panel: inputs */}
        <aside
          className="border-r p-4 sm:p-5 flex flex-col gap-5 overflow-y-auto"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <RiskPresets
            activePresetId={activePresetId}
            onPresetSelect={handlePresetSelect}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-text-muted)" }}
              >
                Parameter
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border-subtle)" }} />
            </div>
            <InputSection
              inputs={inputs}
              errors={errors}
              touched={touched}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          {/* Validation status */}
          <div
            className="flex items-center gap-2 text-[11px] font-medium px-3 py-2 rounded"
            style={{
              backgroundColor: valid ? "var(--color-green-subtle)" : "var(--color-surface-raised)",
              color: valid ? "var(--color-green)" : "var(--color-text-muted)",
            }}
          >
            <span>{valid ? "●" : "○"}</span>
            <span>{valid ? "Input valid — kalkulasi aktif" : "Lengkapi semua field"}</span>
          </div>
        </aside>

        {/* Right panel: outputs */}
        <main className="p-4 sm:p-5 flex flex-col gap-5 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <SectionLabel label="Kalkulasi Posisi" />
            <OutputSection result={displayResult} isVisible={valid && result !== null} />
          </div>

          <div className="flex flex-col gap-2">
            <SectionLabel label="Ringkasan Eksekusi" />
            <TradeSummaryCard
              inputs={inputs}
              result={displayResult}
              isVisible={valid && result !== null}
            />
          </div>

          <p
            className="text-[10px] text-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            Kalkulasi bersifat teoritis · Bukan rekomendasi investasi · IDX 2026
          </p>
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[9px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </span>
      <span
        className="text-[11px] font-semibold"
        style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}
      >
        {value}
      </span>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border-subtle)" }} />
    </div>
  );
}
