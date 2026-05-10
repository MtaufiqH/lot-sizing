const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatIDR(value: number): string {
  return idrFormatter.format(value);
}

export function formatPct(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function parseIDR(value: string): number {
  const stripped = value.replace(/Rp\.?\s*/gi, "").replace(/\./g, "").replace(/,/g, "").trim();
  return parseFloat(stripped) || 0;
}
