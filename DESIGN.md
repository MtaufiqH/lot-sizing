---
name: The Design System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-mono:
    fontFamily: monospace
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-mono:
    fontFamily: monospace
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-xs:
    fontFamily: inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  gutter: 12px
  margin: 20px
---

## Brand & Style

This design system is engineered for high-frequency decision-making and analytical precision. It prioritizes data clarity over aesthetic flourish, utilizing a **Minimalist** and **Corporate** aesthetic with a focus on high information density. The goal is to reduce cognitive load by removing all non-functional decoration—eliminating shadows, gradients, and large border radii in favor of a rigorous, grid-based structure.

The personality is cold, objective, and institutional. It treats every pixel as a carrier of information, ensuring that the user’s focus remains entirely on market movements and risk parameters.

## Colors

The palette utilizes a "Slate and Zinc" foundation to create a neutral environment where color is used strictly as a functional signal. 

- **Neutrals:** A range of Slate grays provides the structural scaffolding. Backgrounds stay within the Zinc-50 to 100 range to maintain a clean "paper" feel.
- **Accents:** Flat Red and Flat Green are reserved exclusively for directional data (Profit/Loss) and risk alerts. These colors are saturated but flat, ensuring high legibility against the neutral background without the distraction of glows or depth.
- **Borders:** All UI boundaries use a consistent 1px border in Slate-200 or Slate-300 to define the high-density grid.

## Typography

This design system employs a dual-font strategy to separate interface metadata from transactional data.

- **Interface UI:** Inter is used for all labels, navigation, and instructional text. It provides a neutral, highly legible sans-serif foundation.
- **Numerical Data:** All currency values, percentages, and calculation fields must use a clean **Monospace** font (ideally JetBrains Mono). This ensures that decimal points align vertically in tables and data cards, allowing for instant visual scanning of value magnitude.
- **Density:** Line heights are kept tight (approx. 1.2x to 1.4x) to support the high-density layout requirements of trading terminals.

## Layout & Spacing

The layout is built on a **Fluid Grid** with a 4px atomic spacing unit. High information density is achieved by utilizing "Compact" spacing (8px to 12px) between functional groups.

- **Grid:** A 12-column system is used for dashboard layouts, while individual tool panels use internal flexbox structures with consistent 12px gutters.
- **Density:** Elements are packed closely to ensure that the maximum amount of relevant data is visible above the fold, minimizing the need for scrolling during high-volatility sessions.

## Elevation & Depth

This design system rejects shadows and depth effects in favor of **Low-contrast Outlines** and **Tonal Layers**.

- **Level 0 (Base):** Zinc-50 background.
- **Level 1 (Panels):** White or Zinc-100 surfaces with a 1px Slate-200 border.
- **Active State:** Elements are brought "forward" using a subtle color shift (e.g., Slate-50 to Slate-100) or a primary-colored 2px border-bottom, rather than a shadow.
- **Hierarchy:** Depth is communicated through structural nesting (containers within containers) rather than Z-axis elevation.

## Shapes

The shape language is strictly functional. A **4px radius (roundedness: 1)** is applied to buttons, inputs, and cards to provide just enough softness to prevent the UI from feeling aggressive, while maintaining a precise, technical look. 

Buttons in toggle groups use sharp internal corners where they meet (joined elements) to emphasize that they are part of a single functional unit.

## Components

- **Inputs:** Use a "Stacked" layout. The label is in `label-xs` (uppercase Slate-500) positioned directly above the input field. The input field itself has a 1px border and uses `body-mono` for the value entry.
- **Toggle Groups:** These are "Segmented Controls" with no gap between buttons. Use a Slate-900 background for the active state with white text, and a Slate-100 background for inactive states.
- **Data Cards:** Cards use 1px borders and no shadows. They feature a clear header with `headline-sm` and a content area that utilizes `body-mono` for all key metrics.
- **Status Indicators:** Use flat, circular indicators (8px) for "Live" connectivity or "System Health" using the accent palette.
- **Buttons:** Primary buttons are solid Slate-900. Secondary buttons are outlined Slate-200 with Slate-900 text. No gradients or hover-grow effects; use simple background-color shifts on hover.