# Sovra Design System Specification

## 1. Architectural Philosophy: Modern Editorial Luxury
Sovra's design language couples the clarity and timeless elegance of high-end editorial typography with the mathematical precision of an academic instrument. The visual hierarchy enforces extreme focus, eliminating visual clutter, pill badges, pulsing dots, and decorative icons.

---

## 2. Typography Scale & Font Families

The typography system strictly uses two core typefaces loaded via Google Fonts:

| Family | Role | CSS Variable | Tracking & Features |
| :--- | :--- | :--- | :--- |
| **Instrument Serif** | Display Headlines, Section Titles & Brand Wordmark | `--font-display` | Tight tracking (`-0.03em`), ligatures enabled (`"liga" 1, "dlig" 1`) |
| **Plus Jakarta Sans** | UI Controls, Prose, Navigation, Metrics & Labels | `--font-sans` | Geometric clarity, optical balance; tabular numbers enabled (`.tabular-nums`) |

### Font Hierarchy
- **Brand Wordmark & Display Headlines (H1 - H2)**: `font-display tracking-[-0.03em] font-normal`
- **Section Headers (H3 - H4)**: `font-display tracking-tight font-normal` or `font-sans font-bold`
- **Body & Prose**: `font-sans text-sm sm:text-base leading-relaxed`
- **Numerical Metrics & Timestamps**: `font-sans tabular-nums font-semibold`

---

## 3. Dual Pure Surface Theme + Deep Cobalt Accent

Sovra enforces dual pure surfaces—a zero-tint Pure White mode and an OLED Pure Dark mode—with 1px hairline borders for spatial separation.

### CSS Custom Properties

```css
/* Pure White Mode (Default :root) */
:root {
  --bg: #FFFFFF;
  --surface: #F7F7F7;
  --ink: #0A0A0A;
  --ink-muted: #525252;
  --border: #E5E5E5;
  --accent: #0F3D91;
  --accent-hover: #0A2B66;
  --accent-contrast: #FFFFFF;
}

/* Pure Dark / OLED Black Mode ([data-theme="dark"] & .dark) */
[data-theme="dark"],
.dark {
  --bg: #000000;
  --surface: #0D0D0D;
  --ink: #FAFAFA;
  --ink-muted: #A3A3A3;
  --border: #1F1F1F;
  --accent: #2563EB;
  --accent-hover: #3B82F6;
  --accent-contrast: #FFFFFF;
}
```

---

## 4. Color Discipline & Strict Accent Budget

- **95% Surface Rule**: At least 95% of any screen surface must consist strictly of pure background (`--bg`) and surface (`--surface`) with 1px hairline borders (`--border`).
- **Accent Reservation**: The deep cobalt accent (`--accent`) is strictly reserved for:
  1. Primary call-to-action buttons (`.btn-accent`)
  2. Active sidebar/tab navigation indicators
  3. Keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-[var(--accent)]`)
  4. Active interactive diagram elements
- **Prohibited**: Background gradient washes, pastel badges, pulsing dots, or decorative icons that compete with academic content.

---

## 5. Hairline Borders & Surfaces

All cards, modals, sidebars, and input fields use precision 1px borders:
- `.border-hairline`: `border: 1px solid var(--border);`
- `.surface-card`: `background-color: var(--surface); border: 1px solid var(--border); color: var(--ink);`

---

## 6. Theme Switching & Zero FOUC

The application prevents Flash of Unstyled Content (FOUC) by executing a synchronous script in `<head>` of `index.html` before DOM painting:
- Checks `localStorage.getItem('sovra-theme')`
- Falls back to `window.matchMedia('(prefers-color-scheme: dark)')`
- Sets `document.documentElement.classList.toggle('dark', isDark)` and `data-theme` attribute synchronously
- Interactive toggling is managed by `src/components/ui/ThemeToggle.tsx`.
