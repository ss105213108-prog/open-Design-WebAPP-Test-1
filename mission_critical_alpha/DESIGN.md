---
name: Mission Critical Alpha
colors:
  surface: '#111316'
  surface-dim: '#111316'
  surface-bright: '#37393d'
  surface-container-lowest: '#0c0e11'
  surface-container-low: '#1a1c1f'
  surface-container: '#1e2023'
  surface-container-high: '#282a2d'
  surface-container-highest: '#333538'
  on-surface: '#e2e2e6'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#e2e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#ecffe3'
  on-secondary: '#003907'
  secondary-container: '#13ff43'
  on-secondary-container: '#007117'
  tertiary: '#ffead2'
  on-tertiary: '#452b00'
  tertiary-container: '#ffc779'
  on-tertiary-container: '#7b5000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#72ff70'
  secondary-fixed-dim: '#00e639'
  on-secondary-fixed: '#002203'
  on-secondary-fixed-variant: '#00530e'
  tertiary-fixed: '#ffddb3'
  tertiary-fixed-dim: '#ffb950'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#624000'
  background: '#111316'
  on-background: '#e2e2e6'
  surface-variant: '#333538'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.05em
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
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
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system is engineered for high-stakes industrial environments where cognitive load management and rapid data synthesis are paramount. The brand personality is **authoritative, precise, and vigilant**. It adopts a **Mission Control** aesthetic, utilizing a "Dark Mode First" philosophy to reduce eye strain in low-light monitoring centers.

The visual style merges **Modern Minimalism** with **Technological Brutalism**. It prioritizes structural clarity through a modular grid, using crisp neon accents against deep obsidian surfaces to create a clear visual hierarchy of alerts. Elements are designed to feel like high-precision instruments rather than consumer software, evoking a sense of absolute reliability and technical sophistication.

## Colors

The palette is anchored in **Deep Charcoal (#121417)** and **Slate (#1E2227)** to provide a non-distracting background that makes data "pop." 

- **Primary (Tech Blue):** Used for interactive elements, focus states, and primary navigation.
- **Success (Green):** Reserved strictly for "System Nominal" states and positive confirmations.
- **Warning (Amber):** Used for non-critical anomalies requiring operator attention.
- **Critical (Red):** High-intensity hue for immediate hazards or system failures.
- **Surface Tiers:** Use incremental shifts in slate values to define container nesting without relying on heavy shadows.

## Typography

The system utilizes a dual-font approach to distinguish between narrative content and technical telemetry. 

- **Hanken Grotesk** is used for all UI headers, labels, and instructional text. Its contemporary, sharp geometry ensures readability at various scales.
- **JetBrains Mono** is used exclusively for numerical data, timestamps, and status readouts. The monospaced nature prevents "jumping" layouts during real-time data updates and emphasizes the "Mission Control" aesthetic.
- All technical labels should be set in **Label-Caps** (uppercase) to mimic industrial hardware labeling.

## Layout & Spacing

The layout follows a **Strict Fluid Grid** model. For desktop monitoring, the screen is divided into a 12-column grid with a fixed 16px gutter. 

- **Information Density:** High. Use a 4px base unit to allow for compact data-rich views.
- **Modular Dashboard:** Content is organized into "Modules" or "Cards" that can reflow. On mobile, these stack vertically. 
- **Scanning Lines:** Use horizontal 1px lines (20% opacity of border color) across wide data tables to guide the eye across rows, reinforcing the industrial "monitor" feel.

## Elevation & Depth

This system avoids traditional soft shadows in favor of **Tonal Layering** and **Subtle Glows**.

- **Depth levels:** Are achieved by lightening the background hex by 2-4% for each elevated layer.
- **Interactive State (Glow):** Active buttons or critical alerts use a subtle outer glow (0px 0px 8px) matching the element's accent color to simulate a luminous display.
- **Borders:** Use 1px solid borders for all containers. Containers should feel like "frames" within a machine.
- **Glassmorphism:** Apply exclusively to transient overlays (modals/drawers) using a heavy background blur (12px) and 80% opacity to maintain context of the dashboard underneath.

## Shapes

The shape language is **Soft (0.25rem)** to maintain a professional, engineered look while avoiding the harshness of a purely 0px-radius system. 

- **Standard Elements:** Buttons and Input fields use a 4px (0.25rem) radius.
- **Large Modules:** Dashboard cards use an 8px (0.5rem) radius.
- **Status Indicators:** Small status pips (e.g., "Active") remain perfectly circular.
- **Geometric Accents:** Use 45-degree chamfered corners on secondary decorative elements (like header accents) to reinforce the aerospace/industrial theme.

## Components

- **Buttons:** Primary buttons are solid "Tech Blue" with black text. Secondary buttons are ghost-style with primary borders. All buttons use a subtle hover glow.
- **Data Cards:** Cards feature a 2px top-border color-coded to the status of the data within (e.g., a card monitoring a failing turbine gets a Red top-border).
- **Micro-interactions:** Use "scanning" animations on data loaders—a horizontal line that moves vertically through a card to indicate active data fetching.
- **Input Fields:** Dark backgrounds (#000000) with thin grey borders. On focus, the border turns "Tech Blue" with a 2px glow.
- **Status Indicators:** Icons should be paired with a text label (e.g., [!] CRITICAL) to ensure accessibility.
- **Telemetry Charts:** Use thin line weights (1px to 1.5px) for graphs. Grid lines within charts should be barely visible (10% opacity).