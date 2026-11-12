# Sovra Design System & Engineering Rules

## 1. Foundational Design Rules

### Typography
- **Display Headlines**: Always use `--font-display` (`Instrument Serif`) with tight `-0.03em` tracking.
- **UI & Body**: Always use `--font-sans` (`Plus Jakarta Sans`).
- **Metrics, Badges & Timers**: Always use `--font-mono` (`JetBrains Mono`) with tabular numbers (`tabular-nums`).

### Dual Surface & 95% Pure Color Discipline
- **Pure White Mode**:
  - `--bg: #FFFFFF`
  - `--surface: #F7F7F7`
  - `--ink: #0A0A0A`
  - `--ink-muted: #525252`
  - `--border: #E5E5E5`
  - `--accent: #0F3D91`
  - `--accent-hover: #0A2B66`
  - `--accent-contrast: #FFFFFF`
- **Pure Dark / OLED Black Mode**:
  - `--bg: #000000`
  - `--surface: #0D0D0D`
  - `--ink: #FAFAFA`
  - `--ink-muted: #A3A3A3`
  - `--border: #1F1F1F`
  - `--accent: #2563EB`
  - `--accent-hover: #3B82F6`
  - `--accent-contrast: #FFFFFF`

- **Surface Rule**: 95% of surfaces must remain pure white or OLED black with 1px hairline borders (`--border`).
- **Accent Rule**: Deep cobalt accent is strictly reserved for primary CTAs, active navigation items, focus rings, and key diagram telemetry. No pastel or gradient background washes.

---

## 2. Permanent Engineering Gate: Verification & Code Review

> [!IMPORTANT]
> **MANDATORY STEP GATE**:
> At the end of EVERY future step or code modification in this repository, the agent MUST automatically run:
> 1. `npx tsc --noEmit` to verify type safety with zero compiler errors.
> 2. `npm run build` to verify production bundle generation without regressions.
> 3. A code-review pass verifying accessibility (`aria-label`, keyboard focus indicators, WCAG color contrast) and adherence to `DESIGN.md`.
> 
> No completion claim or commit may be made without fresh verification evidence from these checks.
