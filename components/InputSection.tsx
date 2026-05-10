"use client";

import type { CalculatorInputs, ValidationErrors } from "@/types/calculator";

interface InputSectionProps {
  inputs: CalculatorInputs;
  errors: ValidationErrors;
  touched: Partial<Record<keyof CalculatorInputs, boolean>>;
  onChange: (field: keyof CalculatorInputs, value: number) => void;
  onBlur: (field: keyof CalculatorInputs) => void;
}

interface FieldConfig {
  field: keyof CalculatorInputs;
  label: string;
  hint: string;
  prefix?: string;
  suffix?: string;
  placeholder: string;
  isRupiah?: boolean;
  step?: string;
}

const FIELDS: FieldConfig[] = [
  {
    field: "modal",
    label: "Modal",
    hint: "Total kapital trading",
    prefix: "Rp",
    placeholder: "10.000.000",
    isRupiah: true,
  },
  {
    field: "riskPlanPct",
    label: "Risk per Trade",
    hint: "% dari modal yang dirisiko",
    suffix: "%",
    placeholder: "1.0",
    step: "0.1",
  },
  {
    field: "riskPerUnitPct",
    label: "Stop Loss Distance",
    hint: "% jarak SL dari entry",
    suffix: "%",
    placeholder: "2.0",
    step: "0.1",
  },
  {
    field: "entryPrice",
    label: "Harga Entry",
    hint: "Harga beli per lembar",
    prefix: "Rp",
    placeholder: "1.000",
    isRupiah: true,
  },
  {
    field: "rrr",
    label: "Risk/Reward",
    hint: "Target profit vs risiko",
    placeholder: "2.0",
    step: "0.1",
  },
];

function formatRupiah(value: number): string {
  if (value === 0) return "";
  return value.toLocaleString("id-ID");
}

function parseRupiah(raw: string): number {
  const stripped = raw.replace(/\./g, "").replace(/[^0-9]/g, "");
  return stripped === "" ? 0 : parseInt(stripped, 10);
}

export function InputSection({
  inputs,
  errors,
  touched,
  onChange,
  onBlur,
}: InputSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {FIELDS.map(({ field, label, hint, prefix, suffix, placeholder, isRupiah, step }) => {
        const error = touched[field] ? errors[field] : null;
        const rawValue = inputs[field];

        const displayValue = isRupiah
          ? formatRupiah(rawValue)
          : rawValue === 0
          ? ""
          : String(rawValue);

        return (
          <div key={field} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor={field}
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {label}
              </label>
              <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                {hint}
              </span>
            </div>
            <div
              className="flex items-center rounded border transition-all duration-150 px-3 py-2"
              style={{
                borderColor: error
                  ? "var(--color-red-border)"
                  : "var(--color-border)",
                backgroundColor: error
                  ? "var(--color-red-subtle)"
                  : "var(--color-surface)",
                outline: "none",
              }}
              onFocus={() => {}}
            >
              {prefix && (
                <span
                  className="text-xs font-semibold mr-2 select-none shrink-0"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {prefix}
                </span>
              )}
              <input
                id={field}
                type={isRupiah ? "text" : "number"}
                inputMode={isRupiah ? "numeric" : "decimal"}
                step={isRupiah ? undefined : step}
                placeholder={placeholder}
                value={displayValue}
                className="flex-1 min-w-0 bg-transparent outline-none text-sm font-medium"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "14px",
                }}
                onChange={(e) => {
                  if (isRupiah) {
                    onChange(field, parseRupiah(e.target.value));
                  } else {
                    const raw = e.target.value;
                    const num = raw === "" ? 0 : parseFloat(raw);
                    onChange(field, isNaN(num) ? 0 : num);
                  }
                }}
                onBlur={() => onBlur(field)}
              />
              {suffix && (
                <span
                  className="text-xs font-semibold ml-2 select-none shrink-0"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {suffix}
                </span>
              )}
            </div>
            {error && (
              <span className="text-[11px] font-medium" style={{ color: "var(--color-red)" }}>
                {error}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
