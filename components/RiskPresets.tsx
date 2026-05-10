"use client";

import { RISK_PRESETS } from "@/types/calculator";

interface RiskPresetsProps {
  activePresetId: string | null;
  onPresetSelect: (value: number, id: string) => void;
}

const PRESET_COLORS: Record<string, { color: string; bg: string; border: string; label: string }> = {
  pemula:   { color: "#22c55e", bg: "#052e16", border: "#196c2e", label: "SAFE" },
  standard: { color: "#58a6ff", bg: "#0d2a4a", border: "#1d4ed8", label: "STD" },
  agresif:  { color: "#f59e0b", bg: "#2d1a00", border: "#92400e", label: "AGR" },
  risky:    { color: "#f85149", bg: "#2d0f0e", border: "#6e2820", label: "HIGH" },
};

export function RiskPresets({ activePresetId, onPresetSelect }: RiskPresetsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-text-muted)" }}
        >
          Profil Risiko
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border-subtle)" }} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {RISK_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          const c = PRESET_COLORS[preset.id];
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPresetSelect(preset.value, preset.id)}
              className="flex flex-col items-center gap-0.5 py-2.5 px-2 rounded transition-all duration-150 border"
              style={{
                backgroundColor: isActive ? c.bg : "var(--color-surface)",
                borderColor: isActive ? c.border : "var(--color-border)",
                boxShadow: isActive ? `0 0 12px ${c.color}22` : "none",
              }}
            >
              <span
                className="text-[9px] font-bold tracking-widest"
                style={{ color: isActive ? c.color : "var(--color-text-muted)" }}
              >
                {c.label}
              </span>
              <span
                className="text-[13px] font-semibold"
                style={{
                  color: isActive ? c.color : "var(--color-text-secondary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {preset.label}
              </span>
              <span
                className="text-[11px] font-mono"
                style={{
                  color: isActive ? c.color : "var(--color-text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {preset.value}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
