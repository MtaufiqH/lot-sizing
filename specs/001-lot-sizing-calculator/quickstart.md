# Quickstart: IDX Lot Sizing Calculator

**Branch**: `001-lot-sizing-calculator` | **Date**: 2026-05-10

## Prerequisites

- Node.js 20+ (LTS)
- npm or pnpm

## Setup

```bash
# From repo root
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-eslint

# OR if already scaffolded:
npm install
```

## Development

```bash
npm run dev
# Open http://localhost:3000
```

## Build (Static Export)

```bash
npm run build
# Output: ./out/ (static HTML/CSS/JS, no server needed)
```

## Deploy

```bash
# Vercel (auto-detects Next.js static export)
vercel --prod

# Or any static host — just serve the ./out/ directory
npx serve out/
```

## Project Layout

```text
lot-sizing/
├── app/
│   ├── layout.tsx          # Root layout, font setup
│   ├── page.tsx            # Single page: assembles calculator
│   └── globals.css         # Tailwind base + custom vars
├── components/
│   ├── RiskPresets.tsx     # Segmented control: Pemula/Standard/Agresif/Risky
│   ├── InputSection.tsx    # The Big 5 inputs with validation
│   ├── OutputSection.tsx   # Tier A (theoretical) + Tier B (actual) output cards
│   └── TradeSummaryCard.tsx # Execution summary card
├── lib/
│   ├── calculations.ts     # Pure calculation functions (Tier A + Tier B)
│   ├── validation.ts       # Input validation rules
│   └── format.ts           # IDR formatter, percentage formatter
├── types/
│   └── calculator.ts       # Shared TypeScript interfaces
├── next.config.ts          # output: 'export'
└── tailwind.config.ts      # DESIGN.md tokens mapped to Tailwind
```

## Manual Verification Checklist

After `npm run dev`, verify these scenarios from `spec.md`:

1. **Core calc**: Modal=10M, RiskPlan=1%, RiskPerUnit=2%, Entry=1000, RRR=2 → Lot=50, Nilai=5M, Target=1040, SL=980
2. **Reactive**: Change any field → all outputs update instantly (no submit)
3. **Validation**: Leave Entry Price blank → inline error appears, outputs hidden
4. **Lot rounding**: If theoretical=5050 shares → 50 lots (5000 shares), not 51
5. **Zero lot warning**: Very small capital → 0 lots + "Posisi di bawah minimum 1 lot" warning
6. **Presets**: Click "Standard" → riskPlanPct=1.0, all outputs update
7. **Preset deselect**: After clicking "Standard", manually edit Risk Per Trade field → preset unhighlights
8. **Summary card**: Valid inputs → trade summary card shows all key fields
9. **Mobile**: Viewport 360px wide → no horizontal scroll
10. **Large numbers**: Modal=10,000,000,000 → displays "Rp 10.000.000.000" without overflow

## Key Config

`next.config.ts`:
```typescript
const nextConfig = {
  output: 'export',   // static HTML export
  trailingSlash: true,
};
```

`tailwind.config.ts` extends with DESIGN.md tokens — see `tailwind.config.ts` for full token mapping.
