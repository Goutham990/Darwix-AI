# Design System Specification: The Architectural Intelligence

## 1. Overview & Creative North Star
### Creative North Star: "The Editorial Command Center"
This design system moves beyond the "SaaS dashboard" trope to embrace a high-end, editorial aesthetic. We are not just building a tool; we are building a sophisticated environment for decision-making. By combining the precision of Material 3 with the spatial confidence of modern architectural journals, we achieve a look that is **Trustworthy, Data-Driven, and Sophisticated.**

We break the "template" look through **Intentional Asymmetry**. Large Display type is used as a structural anchor, while content blocks are layered with varying tonal depths rather than rigid lines. The result is a UI that feels curated and authoritative, mirroring the intelligence of the platform it represents.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in a professional Deep Blue (`primary`) and a grounding Sage Green (`secondary`). To achieve a premium feel, we rely on tonal shifts rather than structural borders.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined solely through background color shifts. 
*   Example: A `surface-container-low` (#f5f3f3) side panel sitting against a `surface` (#fbf9f9) canvas.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface tiers to create "nested" depth:
*   **Base Canvas:** `surface` (#fbf9f9)
*   **Primary Containers:** `surface-container-low` (#f5f3f3) for secondary content areas.
*   **Active Workspaces:** `surface-container` (#efeded) or `surface-container-high` (#e9e8e7) to highlight focal points.
*   **Elevated Elements:** `surface-container-lowest` (#ffffff) for high-contrast cards that need to "pop" off a grey background.

### The "Glass & Gradient" Rule
To avoid a flat, "out-of-the-box" feel, use **Glassmorphism** for floating elements (e.g., Command Palettes or Tooltips). Use `surface` colors at 80% opacity with a `20px` backdrop-blur. 
*   **Signature Textures:** For Hero CTAs, use a subtle linear gradient from `primary` (#00488d) to `primary_container` (#005fb8) at a 135-degree angle. This adds "soul" and a sense of movement to static data.

---

## 3. Typography: The Authority of Serif & Sans
We use a dual-font approach to balance data precision with editorial elegance.

*   **Display & Headline (Manrope):** Chosen for its geometric modernism. Use `display-lg` (3.5rem) with tighter letter-spacing (-0.02em) for high-impact stats. This font conveys the "Sophisticated" brand pillar.
*   **Body & Label (Inter):** The workhorse. Use `body-md` (0.875rem) for all data-dense grids. It provides the "High Legibility" required for enterprise AI tools.
*   **Scale Hierarchy:**
    *   **Display Sm/Md:** Used for primary dashboard headings.
    *   **Title Lg:** Used for card titles; always set in semi-bold to ensure authority.
    *   **Label Sm:** Used for micro-data and metadata; use `on-surface-variant` (#424752) to create a clear visual hierarchy.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "muddy." We achieve depth through the **Layering Principle.**

*   **Stacking Surfaces:** Place a `surface-container-lowest` (#ffffff) card on top of a `surface-container-low` (#f5f3f3) section. This creates a soft, natural lift without a single pixel of shadow.
*   **Ambient Shadows:** If a floating effect is required (e.g., a Modal), use an extra-diffused shadow: `0px 12px 32px rgba(0, 72, 141, 0.06)`. The tint of `primary` in the shadow mimics natural light.
*   **The "Ghost Border":** If a container is placed on a background of the same color, use a 1px border with `outline-variant` (#c2c6d4) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components: Precision Built

### Buttons (The Primary Action)
*   **Primary:** Fill with `primary` (#00488d), text in `on-primary` (#ffffff). Use a `12px` (xl) radius for a modern, approachable feel.
*   **Secondary:** Fill with `secondary_container` (#cfe5d2), text in `on-secondary_container` (#536758). 
*   **Hover State:** Increase tonal depth by shifting to the next darkest container token (e.g., `primary_container` becomes `primary`).

### Input Fields & Search
*   **Styling:** Forgo the bottom-line Material default. Use a subtle fill of `surface-container-high` (#e9e8e7) with a `12px` corner radius.
*   **Focus State:** A 2px "Ghost Border" using `surface_tint` (#005db5) at 40% opacity.

### Data Cards (The Core AI Insight)
*   **Rule:** Forbid divider lines within cards.
*   **Structure:** Use `spacing-6` (1.5rem) of vertical white space to separate the header from the data visualization.
*   **Background:** Use `surface-container-lowest` (#ffffff) to ensure high contrast for AI-generated charts.

### AI Suggestion Chips
*   **Style:** Use `secondary_fixed` (#d2e8d5) backgrounds with `on_secondary_fixed_variant` (#384b3d) text. These should feel like "calm" additions to the UI, not loud interruptions.

---

## 6. Do’s and Don'ts

### Do
*   **Do** use asymmetrical layouts. Place a large headline on the left and a dense data table on the right to create a "newspaper" feel.
*   **Do** use `spacing-12` (3rem) or `spacing-16` (4rem) for section breathing room. High-end design requires "wasteful" space.
*   **Do** use Sage Green (`secondary`) exclusively for "growth," "success," or "AI-assistant" related insights to build a cognitive association.

### Don't
*   **Don't** use pure black (#000000) for text. Use `on_surface` (#1b1c1c) for optimal readability and a softer, premium feel.
*   **Don't** use standard Material 3 shadows. They are too heavy for this "Editorial" aesthetic. Stick to Tonal Layering.
*   **Don't** use icons without a clear purpose. Every icon should be paired with a label or have a tooltip to ensure the platform remains "Trustworthy" and clear.
