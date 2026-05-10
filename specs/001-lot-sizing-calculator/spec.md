# Feature Specification: Indonesian Stock Lot Sizing Calculator

**Feature Branch**: `001-lot-sizing-calculator`  
**Created**: 2026-05-10  
**Status**: Draft  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Position Sizing Calculation (Priority: P1)

A trader enters their total capital, selects a risk profile preset, inputs their risk per unit percentage, entry price, and desired RRR. The tool instantly displays the theoretically ideal position size in shares, the corresponding stop loss price, target price, maximum loss in IDR, and expected gain in IDR.

**Why this priority**: This is the entire purpose of the tool. Without accurate calculation output, nothing else has value.

**Independent Test**: Trader can open the app, fill in all 5 inputs, and see a complete set of calculated outputs — fully verifiable by manual cross-check.

**Acceptance Scenarios**:

1. **Given** a trader has entered Modal = Rp 10,000,000, Risk by Plan = 1.0%, Risk per Unit = 2%, Entry Price = Rp 1,000, RRR = 2, **When** the calculator runs, **Then** it shows: Risk Amount = Rp 100,000, Stop Loss = Rp 980, Target = Rp 1,040, Theoretical Shares = 5,000, Max Loss = Rp 100,000, Expected Gain = Rp 200,000.
2. **Given** any input changes, **When** the trader modifies a single field, **Then** all outputs update immediately without requiring a submit action.
3. **Given** invalid or empty inputs, **When** the trader leaves required fields blank, **Then** the calculator shows inline validation messages and disables output display.

---

### User Story 2 - Lot-Based Actual Execution Sizing (Priority: P1)

Indonesian stocks trade in lots of 100 shares. The tool translates the theoretical share count into an executable lot count (rounded down to nearest lot), then recalculates the actual capital deployed, actual risk, and actual expected gain based on the rounded lot size.

**Why this priority**: The core gap this tool bridges. Theoretical sizing is useless without lot-rounded execution sizing.

**Independent Test**: Given theoretical output of 5,100 shares, the lot section shows 51 lots (5,100 shares), and if theoretical is 5,050 shares it rounds to 50 lots (5,000 shares) with recalculated actual figures.

**Acceptance Scenarios**:

1. **Given** theoretical position size = 5,050 shares, **When** lot rounding applies, **Then** actual lots = 50, actual shares = 5,000, actual capital deployed and actual risk are recalculated based on 5,000 shares.
2. **Given** theoretical size < 100 shares, **When** lot rounding applies, **Then** the tool shows 0 lots and warns the trader that position size is below minimum executable lot.
3. **Given** lot-rounded actual position, **When** displayed, **Then** both theoretical and actual figures are shown side by side so the trader can see the rounding impact.

---

### User Story 3 - Risk Profile Quick Presets (Priority: P2)

Trader can select from four preset risk levels with a single tap/click: Pemula (0.5%), Standard (1.0%), Agresif (1.5%), Risky (2.0%). Selecting a preset instantly populates the Risk by Plan field and recalculates all outputs.

**Why this priority**: Speeds up workflow significantly for experienced traders who always use the same risk tier. Removes manual entry error.

**Independent Test**: Clicking each preset button changes the Risk by Plan value and updates all outputs in under 1 second, verifiable without other inputs changing.

**Acceptance Scenarios**:

1. **Given** the calculator is loaded, **When** trader taps "Standard", **Then** Risk by Plan = 1.0% and all outputs recalculate immediately.
2. **Given** a preset is active, **When** trader manually edits the Risk by Plan field, **Then** the active preset button deselects (no preset highlighted) to indicate custom mode.
3. **Given** all four presets are visible, **When** one is selected, **Then** it is visually distinguished from the others.

---

### User Story 4 - Summary Trade Card (Priority: P3)

After calculation, the tool presents a concise trade summary card showing all key numbers a trader needs at the moment of order placement: entry price, stop loss, target price, lot count, capital deployed, max loss, expected gain, and actual RRR.

**Why this priority**: Reduces cognitive load at execution time. Trader can screenshot/reference without scrolling through input fields.

**Independent Test**: With complete valid inputs, a summary card renders below the calculator with all listed data points — verifiable by visual inspection.

**Acceptance Scenarios**:

1. **Given** all inputs are valid and calculation is complete, **When** the summary card renders, **Then** it shows entry price, stop loss, target price, lot count, shares, capital deployed, max loss (IDR), expected gain (IDR), and actual RRR.
2. **Given** inputs are incomplete or invalid, **When** summary card would render, **Then** it shows a placeholder state rather than partial data.

---

### Edge Cases

- What happens when Entry Price = 0 or negative? → Validation error, no calculation.
- What happens when Risk per Unit exceeds 100%? → Validation error, capped at 99%.
- What happens when theoretical shares = 0 due to very small capital? → Show 0 lots with "Insufficient capital for minimum lot" warning.
- What happens when RRR < 0.1? → Validation error (risk-reward must be positive).
- How does the tool handle very large numbers (e.g., Modal = Rp 10 billion)? → Displays formatted IDR values with thousand separators without overflow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept Modal (total capital) as IDR numeric input.
- **FR-002**: System MUST accept Risk by Plan as a percentage input, either via preset buttons or manual entry.
- **FR-003**: System MUST provide four preset risk buttons: Pemula (0.5%), Standard (1.0%), Agresif (1.5%), Risky (2.0%).
- **FR-004**: System MUST accept Risk per Unit as a percentage representing the stop loss distance from entry.
- **FR-005**: System MUST accept Entry Price as IDR per share.
- **FR-006**: System MUST accept Risk Reward Ratio (RRR) as a positive decimal number.
- **FR-007**: System MUST calculate and display: Risk Amount (IDR), Stop Loss Price, Target Price, Theoretical Share Count, Theoretical Capital Deployed, Max Loss (IDR), Expected Gain (IDR).
- **FR-008**: System MUST calculate lot-rounded execution values: Lot Count (rounded down), Actual Share Count, Actual Capital Deployed, Actual Max Loss, Actual Expected Gain.
- **FR-009**: System MUST recalculate all outputs reactively whenever any input changes, without requiring a submit button.
- **FR-010**: System MUST validate all inputs and show inline error messages for invalid values; outputs must be hidden or clearly marked invalid when inputs are incomplete.
- **FR-011**: System MUST display monetary values in IDR format with thousand separators (e.g., Rp 1.000.000).
- **FR-012**: System MUST display a warning when lot-rounded size results in 0 lots.
- **FR-013**: System MUST show both theoretical and lot-rounded actual figures side by side in the output section.
- **FR-014**: Selecting a preset MUST deselect when the user manually overrides the Risk by Plan field.
- **FR-015**: System MUST display a trade summary card with all key execution-time data when calculation is valid.

### Key Entities

- **Trade Setup**: A single calculation instance defined by the 5 inputs (Modal, Risk by Plan, Risk per Unit, Entry Price, RRR).
- **Theoretical Position**: Calculated ideal position in shares, derived from risk-first math — not constrained by lot size.
- **Actual Position**: Lot-rounded execution position — shares rounded down to nearest 100-share lot.
- **Risk Profile Preset**: Named risk level (Pemula/Standard/Agresif/Risky) with a fixed Risk by Plan percentage.
- **Trade Summary**: Consolidated view of all key figures needed at order placement time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Traders can complete a full position sizing calculation in under 30 seconds from opening the tool.
- **SC-002**: All outputs update within 200 milliseconds of any input change (reactive recalculation feels instant).
- **SC-003**: Lot-rounded figures match manual calculation (rounded-down lots × 100 shares) with 100% accuracy across all valid inputs.
- **SC-004**: 95% of first-time users can identify the preset buttons and understand their purpose without instruction.
- **SC-005**: The trade summary card contains all data a trader needs to place an order without referring back to the input section.
- **SC-006**: Zero incorrect calculations on valid inputs — calculation accuracy is 100% verifiable by formula cross-check.
- **SC-007**: Tool is fully usable on mobile screen widths (≥ 360px) without horizontal scrolling.

## Assumptions

- Indonesian lot size is fixed at 100 shares per lot for all calculations.
- The tool operates entirely client-side — no account data, trade history, or API connectivity is required or in scope.
- Users are individual retail traders, not institutional; single trade setup at a time (no batch/portfolio mode).
- No persistent storage of inputs between sessions is required for v1 (inputs reset on page load).
- All monetary values are in IDR (Indonesian Rupiah); no multi-currency support is in scope.
- Stop loss is always below entry price (long positions only); short selling is out of scope.
- Risk per Unit represents percentage distance from entry to stop loss: `Stop Loss = Entry × (1 - Risk per Unit%)`.
- Target Price is derived from RRR: `Target = Entry + (Entry - Stop Loss) × RRR`.
- The tool is a single-page calculator; no navigation, login, or user accounts required.
