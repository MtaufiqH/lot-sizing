"use client";

import type { CalculationResult } from "@/types/calculator";
import { formatIDR, formatPct } from "@/lib/format";

interface OutputSectionProps {
  result: CalculationResult;
  isVisible: boolean;
}

export function OutputSection({ result, isVisible }: OutputSectionProps) {
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
        Lengkapi semua parameter untuk melihat kalkulasi
      </div>
    );
  }

  const { tierA, tierB, zeroLotWarning } = result;

  return (
    <div className="flex flex-col gap-3">
      {zeroLotWarning && (
        <div
          className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium"
          style={{
            borderColor: "var(--color-red-border)",
            color: "var(--color-red)",
            backgroundColor: "var(--color-red-subtle)",
          }}
        >
          <span className="text-base">⚠</span>
          Posisi di bawah minimum 1 lot (100 lembar)
        </div>
      )}

      {/* Two-column card: Tier A vs Tier B */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Tier A */}
        <div
          className="rounded-lg border p-4 flex flex-col gap-3"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              Tier A — Teoritis
            </span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded border font-semibold"
              style={{
                color: "var(--color-accent)",
                borderColor: "var(--color-accent-subtle)",
                backgroundColor: "var(--color-accent-subtle)",
              }}
            >
              THEORETICAL
            </span>
          </div>
          <MetricRow label="Risk by Plan" value={formatIDR(tierA.riskByPlan)} color="red" />
          <MetricRow label="Stop Loss" value={formatIDR(tierA.stopLossPrice) + " /lbr"} color="red" />
          <MetricRow label="Entry Size" value={formatIDR(tierA.entrySizeRp)} />
          <MetricRow label="Entry Size %" value={formatPct(tierA.entrySizePctModal)} />
          <MetricRow
            label="Jml. Lembar"
            value={`${Math.round(tierA.jumlahLembar).toLocaleString("id-ID")} lbr`}
          />
        </div>

        {/* Tier B */}
        <div
          className="rounded-lg border p-4 flex flex-col gap-3"
          style={{
            borderColor: "var(--color-green-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              Tier B — Aktual IDX
            </span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded border font-semibold"
              style={{
                color: "var(--color-green)",
                borderColor: "var(--color-green-border)",
                backgroundColor: "var(--color-green-subtle)",
              }}
            >
              EXECUTION
            </span>
          </div>
          <MetricRow label="Jumlah Lot" value={`${tierB.jumlahLot} lot`} highlight />
          <MetricRow label="Lembar Aktual" value={`${tierB.lembarAktual.toLocaleString("id-ID")} lbr`} />
          <MetricRow label="Nilai Investasi" value={formatIDR(tierB.nilaiInvestasi)} />
          <MetricRow label="Risk per Lembar" value={formatIDR(tierB.riskPerLembar) + " /lbr"} color="red" />
          <MetricRow label="Risiko Aktual" value={formatIDR(tierB.risikoAktual)} color="red" />
          <MetricRow label="Risk % Modal" value={formatPct(tierB.riskAktualPctModal)} color="red" />
          <MetricRow label="Target Price" value={formatIDR(tierB.targetPrice) + " /lbr"} color="green" />
        </div>
      </div>
    </div>
  );
}

function MetricRow({
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
  const valueColor = color === "red"
    ? "var(--color-red)"
    : color === "green"
    ? "var(--color-green)"
    : highlight
    ? "var(--color-text-primary)"
    : "var(--color-text-secondary)";

  return (
    <div className="flex items-baseline justify-between gap-2">
      <span
        className="text-[11px] shrink-0"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </span>
      <span
        className="text-[13px] font-semibold tabular-nums"
        style={{
          color: valueColor,
          fontFamily: "var(--font-mono)",
          fontWeight: highlight ? 700 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}
