---
name: Surya Tour Trans Admin
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#4e45d5'
  on-secondary: '#ffffff'
  secondary-container: '#6860ef'
  on-secondary-container: '#fffbff'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#100069'
  on-secondary-fixed-variant: '#372abf'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 2rem
  gutter: 1.5rem
  card-gap: 1.5rem
  sidebar-width: 280px
  unit-xs: 0.25rem
  unit-sm: 0.5rem
  unit-md: 1rem
  unit-lg: 1.5rem
  unit-xl: 2.5rem
---

## Brand & Style
The design system is engineered for a premium, high-efficiency enterprise SaaS experience. It balances the structural rigour of institutional logistics with the fluid, high-end aesthetics found in modern productivity tools like Linear and Metronic. The brand personality is authoritative yet approachable, aiming to evoke feelings of organized control, reliability, and technical sophistication.

The design style follows a **Modern Corporate** aesthetic with a heavy emphasis on "Soft-UI" principles: deep rounded corners, expansive whitespace, and depth created through light and shadow rather than rigid lines. It prioritizes clarity for complex data management while maintaining a luxurious, "boutique" feel through subtle gradients and refined typography.

## Colors
The palette is rooted in a professional "Indigo-Navy" spectrum. 
- **Primary:** A refined gradient from #4F46E5 to #4338CA is used exclusively for high-intent actions, active states, and brand-critical touchpoints.
- **Surface Strategy:** We utilize a dual-layer white approach. The global background is a cool-tinted #F5F7FB to reduce eye strain, while functional containers (cards, sidebars, modals) are pure #FFFFFF to create visual pop and "purity."
- **Typography Colors:** Primary headers use a deep Dark Navy for maximum contrast and authority. Secondary text uses a soft Gray to establish clear information hierarchy.

## Typography
The design system utilizes **Inter** exclusively to achieve a systematic, utilitarian, and clean appearance. 
- **Hierarchy:** We rely on significant weight contrast between titles (Bold/700) and body text (Regular/400).
- **Readability:** Body text is optimized at 14px for dense dashboard views, ensuring that large volumes of logistics data remain legible.
- **Secondary Text:** Use the "text_gray" color for helper text and metadata to ensure the user's eye gravitates toward primary data points first.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. The sidebar remains fixed at 280px, while the main content area fluidly expands using a 12-column grid.

- **Rhythm:** We use a strict 8px (0.5rem) baseline grid.
- **Spaciousness:** Large internal padding (unit-lg or 24px) within cards is mandatory to prevent the "cluttered dashboard" feel common in enterprise software.
- **Breakpoints:** 
  - Desktop: 12 columns, 32px margins.
  - Tablet: 8 columns, 24px margins, collapsed sidebar.
  - Mobile: 4 columns, 16px margins, bottom navigation or hamburger menu.

## Elevation & Depth
Depth is achieved through **Ambient Shadows** rather than borders. This creates a "layered paper" effect that feels light and modern.

- **Level 1 (Cards):** Low-offset, high-blur shadow: `0px 10px 30px rgba(0, 0, 0, 0.03)`.
- **Level 2 (Modals/Dropdowns):** Increased spread: `0px 20px 50px rgba(0, 0, 0, 0.08)`.
- **Borders:** Avoid harsh #000 borders. Use subtle 1px inner strokes of #F1F5F9 only when necessary to define boundaries on white-on-white elements.
- **Interactions:** On hover, cards should subtly lift (decrease shadow blur, slightly shift Y-axis) to provide tactile feedback.

## Shapes
The shape language is the defining characteristic of this design system. We use **hyper-rounded corners** to soften the enterprise experience.

- **Primary Containers:** All dashboard cards and main containers must use a **24px** corner radius.
- **Interactive Elements:** Buttons and form inputs use a slightly tighter radius (10px-12px) to maintain a sense of precision and "clickability."
- **Sidebar Elements:** Active state indicators and menu highlights should be pill-shaped or have a minimum 12px radius to match the modern SaaS aesthetic.

## Components
- **Buttons:**
  - *Primary:* Uses the blue-purple gradient with white text. Soft shadow beneath.
  - *Secondary:* Ghost style (no fill) with a subtle gray outline or light blue tint.
- **Sidebar:**
  - Background is pure white with a thin right-edge separator (#F1F5F9).
  - *Active Item:* Background uses the primary gradient, white text, and a soft glow shadow.
  - *Icons:* Minimal 2pt outline stroke icons.
- **Input Fields:**
  - Background: #F8FAFC (very light gray).
  - No border by default; 2px primary color border on focus.
- **Chips/Badges:**
  - Rounded-pill style. 
  - Status-based: Success (Soft green BG, dark green text), Pending (Soft amber BG, dark amber text).
- **Cards:**
  - Mandatory 24px radius. 
  - No visible border.
  - Use "Level 1" elevation.
- **Data Tables:**
  - Row-based layout with no vertical grid lines.
  - Header row in "label-sm" typography with "text_gray" color.