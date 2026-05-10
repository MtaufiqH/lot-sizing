"use client";

import type { CalculatorInputs, CalculationResult } from "@/types/calculator";
import { formatIDR, formatPct } from "@/lib/format";

interface TradeSummaryCardProps {
  inputs: CalculatorInputs;
  result: CalculationResult;
  isVisible: boolean;
}

export function TradeSummaryCard({ inputs, result, isVisible }: TradeSummaryCardProps) {
  if (!isVisible) {
    return (
      <div
        className="rounded-lg border p-6 text-sm text-center"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <div className="text-2xl mb-2">—</div>
        Lengkapi semua parameter untuk melihat ringkasan
      </div>
    );
  }

  const { tierB } = result;
  const stopLossValue = inputs.entryPrice - tierB.riskPerLembar;
  const expectedGain = tierB.risikoAktual * inputs.rrr;
  const actualRRR = tierB.risikoAktual > 0 ? expectedGain / tierB.risikoAktual : 0;

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: "var(--color-border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface-raised)",
        }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--color-text-muted)" }}
        >
          Trade Summary
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-green)" }} />
          <span className="text-[10px]" style={{ color: "var(--color-green)" }}>
            READY
          </span>
        </div>
      </div>

      {/* Price row — Entry / SL / Target */}
      <div
        className="grid grid-cols-3 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <PriceBlock label="Entry" value={formatIDR(inputs.entryPrice)} />
        <PriceBlock
          label="Stop Loss"
          value={formatIDR(stopLossValue)}
          color="red"
          borderLeft
        />
        <PriceBlock
          label="Target"
          value={formatIDR(tierB.targetPrice)}
          color="green"
          borderLeft
        />
      </div>

      {/* Metrics grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <MetricCell label="Lot" value={`${tierB.jumlahLot} lot`} highlight />
        <MetricCell label="Lembar" value={`${tierB.lembarAktual.toLocaleString("id-ID")} lbr`} />
        <MetricCell label="Modal Pakai" value={formatIDR(tierB.nilaiInvestasi)} />
        <MetricCell label="Maks. Rugi" value={formatIDR(tierB.risikoAktual)} color="red" />
        <MetricCell label="Est. Untung" value={formatIDR(expectedGain)} color="green" />
        <MetricCell label="RRR Aktual" value={`1 : ${actualRRR.toFixed(2)}`} highlight />
        <MetricCell label="Risk % Modal" value={formatPct(tierB.riskAktualPctModal)} color="red" />
        <MetricCell label="Risk/Lembar" value={formatIDR(tierB.riskPerLembar)} />
      </div>
    </div>
  );
}

function PriceBlock({
  label,
  value,
  color,
  borderLeft,
}: {
  label: string;
  value: string;
  color?: "red" | "green";
  borderLeft?: boolean;
}) {
  const textColor =
    color === "red"
      ? "var(--color-red)"
      : color === "green"
      ? "var(--color-green)"
      : "var(--color-text-primary)";

  return (
    <div
      className="flex flex-col items-center py-4 px-3 gap-1"
      style={{
        backgroundColor:
          color === "red"
            ? "var(--color-red-subtle)"
            : color === "green"
            ? "var(--color-green-subtle)"
            : "var(--color-surface-raised)",
        borderLeft: borderLeft ? `1px solid var(--color-border)` : undefined,
      }}
    >
      <span
        className="text-[9px] font-bold uppercase tracking-widest"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </span>
      <span
        className="text-[15px] font-bold tabular-nums"
        style={{ color: textColor, fontFamily: "var(--font-mono)" }}
      >
        {value}
      </span>
    </div>
  );
}

function MetricCell({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color?: "red" | "green";
  highlight?: boolean;
}) {
  const textColor =
    color === "red"
      ? "var(--color-red)"
      : color === "green"
      ? "var(--color-green)"
      : highlight
      ? "var(--color-text-primary)"
      : "var(--color-text-secondary)";

  return (
    <div
      className="px-4 py-3 border-b border-r flex flex-col gap-1"
      style={{ borderColor: "var(--color-border-subtle)" }}
    >
      <span
        className="text-[9px] font-bold uppercase tracking-widest"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </span>
      <span
        className="text-[13px] font-semibold tabular-nums"
        style={{ color: textColor, fontFamily: "var(--font-mono)" }}
      >
        {value}
      </span>
    </div>
  );
}
