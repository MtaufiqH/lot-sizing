This is the **Master Project Requirement Document (PRD) v3.0**, consolidating all technical specifications, mandatory risk profiles, and the complete calculation matrix for your IDX Lot Sizing Web App.

---

# PRD: Professional IDX Lot Sizing & Risk Calculator

## 1. Project Objective

To build a high-performance, reactive web application that allows Indonesian stock traders to calculate precise position sizing based on risk-first principles. The tool bridges the gap between **Theoretical Planning** and **Actual Market Execution** (Lot-based rounding).

## 2. User Input Specifications

### 2.1 The "Big 5" Manual Inputs

1. **Modal (Total Capital):** Total IDR available in the trading account.
2. **Risk by Plan (%):** Percentage of total capital at risk (Selected via Presets or Manual).
3. **Risk per Unit (%):** Percentage distance from Entry Price to Stop Loss.
4. **Entry Price:** Planned purchase price per share (Rp).
5. **Risk Reward Ratio (RRR):** Desired profit multiplier (e.g., 2 for 1:2).

### 2.2 Mandatory Risk Profiles (Presets)

The UI must include quick-toggle buttons for these specific risk levels:

* **Pemula (Beginner):** 0.5% risk per trade.
* **Standard:** 1.0% risk per trade.
* **Agresif (Aggressive):** 1.5% risk per trade.
* **Risky:** 2.0% risk per trade.

---

## 3. Automated Calculation Engine

The system must reactively calculate the following variables.

### Tier A: Theoretical Trade Plan

These values represent the "ideal" trade before considering lot constraints:

* **Risk by Plan (Rp):** $Modal \times (Risk\ Plan\ \% / 100)$
* **Stop Loss (SL) Price:** $Entry\ Price \times (1 - (Risk\ per\ Unit\ \% / 100))$
* **Entry Size (Rp):** $Risk\ by\ Plan\ (Rp) / (Risk\ per\ Unit\ \% / 100)$
* **Entry Size (% Modal):** $(Entry\ Size\ (Rp) / Modal) \times 100$
* **Jumlah Lembar:** $Entry\ Size\ (Rp) / Entry\ Price$

### Tier B: Actual Execution (IDX Reality)

These values represent what the user actually executes in the market (1 Lot = 100 Shares):

* **Jumlah Lot:** $\lfloor Jumlah\ Lembar / 100 \rfloor$ (Always rounded down to protect risk).
* **Lembar Aktual:** $Jumlah\ Lot \times 100$
* **Nilai Investasi:** $Lembar\ Aktual \times Entry\ Price$
* **Risk per Lembar (Rp):** $Entry\ Price - Stop\ Loss\ Price$
* **Risiko Aktual (Rp):** $Lembar\ Aktual \times Risk\ per\ Lembar\ (Rp)$
* **Risk Aktual (% Modal):** $(Risiko\ Aktual\ (Rp) / Modal) \times 100$
* **Target Price (TP):** $Entry\ Price + (Risk\ per\ Lembar\ (Rp) \times RRR)$

---

## 4. Technical Specification

### 4.1 The "TypeScript-Native" Stack

* **Framework:** Next.js 16 (App Router) for high-speed performance and SEO.
* **State Management:** **Zustand** (Strictly chosen for sub-10ms reactivity across 10+ calculated fields).
* **Logic Validation:** **Zod** to ensure no `NaN` or `Infinity` errors occur during typing.
* **Styling:** **Tailwind CSS** (Minimalist Flat Design: No gradients, `slate/zinc` palette, `border-1`).
* **API/Database:** Server Actions + Drizzle ORM + PostgreSQL (for the Trading Journal).

### 4.2 Performance & UI Guidelines

* **Reactivity:** Calculations must update **as the user types** (on-change), not on-blur or on-click.
* **Validation UX:** If `Entry Price <= Stop Loss Price`, the UI must block calculations and show a "Check SL" warning.
* **Over-Leverage Alert:** If `Entry Size (% Modal) > 100`, the field must turn flat-red to signal the user is trying to buy more than their total capital allows.

---

## 5. UI Layout Structure

* **Left Column (Inputs):** Grouped "Big 5" inputs with the Risk Profile presets at the top.
* **Right Column (Output Cards):**
* **Primary Card:** Large "Jumlah Lot" and "Nilai Investasi" display.
* **Secondary Card:** "Actual Risk" metrics (Rp and % Modal) to confirm the trade is safe.
* **Exit Strategy Card:** Clearly visible "Stop Loss" and "Target Price" values.