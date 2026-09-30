# Design System: SuaraWarga (Modern Citizen Aspiration & Grievance Platform)

This document is the **Single Source of Truth (SSOT)** for visual design architecture, styling tokens, interface components, and motion interactions for the **SuaraWarga** (`si-waday`) platform. It is structured and maintained based on the implementation across [app/routes/home.tsx](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/routes/home.tsx), modular components under `app/components/`, layouts in `app/components/layout/`, Tailwind CSS v4 styling in [app/app.css](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/app.css), and design directives from **Google Stitch (`stitch-design-taste`)**, **Tailwind CSS v4**, and **React Router v8 (Framework Mode)**.

---

## 1. Visual Theme & Atmosphere

### 1.1 Mood & Visual Character

SuaraWarga embodies the visual identity of **Civic Warmth & High-Agency Transparency**. Rejecting the rigid, cold, and bureaucratic aesthetics of conventional public sector portals, this platform fuses social warmth with operational decisiveness:

- **Warm & Welcoming Canvas**: A soothing _Warm Sand / Cream_ background (`#faf5f0` & `#fdfbf7`) that is gentle on the eyes, creating an approachable, safe, and humane environment for citizens of all generations.
- **Authoritative Contrast**: Navigation bars, modal headers, dark summary cards, primary text, and ticket tracking containers utilize _Obsidian Dark Navy_ (`#191b24`), establishing visual gravitas, institutional credibility, and firm structure.
- **High-Energy Civic Accent**: A single high-energy primary accent, _Sunset Coral / Tangerine_ (`#ff6b4a`), symbolizing community warmth, prompt follow-up urgency, and active civic participation.
- **Tangible Depth**: Soft cards (_soft-cards_) with generous corner radii (`rounded-3xl` / `rounded-4xl` or `2.5rem`), subtle warm-diffused shadows, and delicate organic micro-borders (`border-warm-200`).
- **Editorial Typography**: A harmonious blend of expressive headlines with tight letter-tracking, relaxed leading for descriptive prose, and dedicated monospaced typography for civic grievance ticket numbers.

### 1.2 Metric Density & Variance Spectrum

Conforming to Stitch visual evaluation standards:

- **Density Level**: `4 / 10` (_Daily App Balanced_) — Airy, breathable layout composition; not overcrowded like a complex control cockpit, yet rich in citizen operational data (ticket statuses, upvotes, responsible agencies, timestamps, and SLA indicators).
- **Variance Level**: `7 / 10` (_Offset Asymmetric_) — Split-screen Hero composition featuring an _interactive orbital node cluster_, coupled with an asymmetric zig-zag responsive feature grid where one card serves as a high-contrast _featured focal card_.
- **Motion Level**: `6 / 10` (_Fluid CSS & Spring Dynamics_) — Calm continuous orbital rotation (`40s linear`), tactile hover elevations (`-1px` to `-4px`), instant push feedback (`active:scale-[0.97]`), and smooth color transitions (`180ms ease`).

---

## 2. Color Palette & Roles

The color token system integrates natively into **Tailwind CSS v4** via the `@theme` directive and CSS custom properties in [app/app.css](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/app.css).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                COLOR MATRIX                                 │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│    Warm Sand      │   Dark Navy       │   Sunset Coral    │  Status Chips   │
│   (Background)    │  (Contrast/Ink)   │  (Primary Accent) │ (Feedback/SLA)  │
│  #faf5f0 / #fdfbf7│  #191b24 / #11131a│  #ff6b4a / #f05432│ Emerald / Amber │
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```

### 2.1 Color Tokens Specification

| CSS / Tailwind Token                       | Hex / RGBA Value | Functional Role & Application                                                                                      |
| :----------------------------------------- | :--------------- | :----------------------------------------------------------------------------------------------------------------- |
| `--color-warm-50` (`bg-warm-50`)           | `#fdfbf7`        | Sub-surface backgrounds, light hover element states, avatar badges.                                                |
| `--color-warm-100` (`bg-warm-100`)         | `#faf5f0`        | **Primary Page Canvas** — Main canvas background for pages, input backdrops, FAQ sections.                         |
| `--color-warm-200` (`border-warm-200`)     | `#f4ece1`        | Subtle divider borders, neutral category tags, hover chips, badge containers.                                      |
| `--color-warm-300` (`border-warm-300`)     | `#e8dbcb`        | Decorative orbit lines, search input borders, modal and card timeline dividers.                                    |
| `--color-darknavy-800` (`bg-darknavy-800`) | `#262935`        | Dark button hover states, dark card interiors, emergency hotline footer badges.                                    |
| `--color-darknavy-900` (`bg-darknavy-900`) | `#191b24`        | **Obsidian Primary Ink** — Headings `h1–h4`, tracking CTA containers, modal headers, footer.                       |
| `--color-darknavy-950` (`bg-darknavy-950`) | `#11131a`        | Modal backdrop overlays (`bg-darknavy-950/70 backdrop-blur-sm`).                                                   |
| `--color-accent-50` (`bg-accent-50`)       | `#fff0eb`        | Highlight badge backgrounds, active upvote icon pill backdrops, feature icon boxes.                                |
| `--color-accent-100` (`bg-accent-100`)     | `#ffe0d5`        | Hero highlight badge borders, focus accent rings (`ring-accent-100` on active timelines).                          |
| `--color-accent-500` (`bg-accent-500`)     | `#ff6b4a`        | **Single Brand Accent** — Primary CTA buttons, active links, highlight icons, featured cards, central orbital hub. |
| `--color-accent-600` (`bg-accent-600`)     | `#f05432`        | Primary button hover states, active text emphasis.                                                                 |
| `--color-accent-700` (`bg-accent-700`)     | `#d43d1d`        | Primary button pressed/active states, intense emphasis.                                                            |
| `Pure Surface White` (`bg-white`)          | `#ffffff`        | Aspiration card containers (`soft-card`), statistics strips, modal body containers, FAQ cards.                     |

### 2.2 Functional Status & State Palette

Semantic color palette for citizen grievance ticket statuses in feeds and tracking modals:

- **Resolved (Selesai)**:
  - Background & Text: `bg-emerald-100 text-emerald-700` (`#d1fae5` / `#047857`)
  - Status Dot / Icon: `bg-emerald-500` (`#10b981`), checkmark icon `text-emerald-400`
- **In Progress (Dalam Proses)**:
  - Background & Text: `bg-amber-100 text-amber-700` (`#fef3c7` / `#b45309`)
  - Status Dot: `bg-amber-500` (`#f59e0b`)
- **Verified (Terverifikasi)**:
  - Background & Text: `bg-blue-100 text-blue-700` (`#dbeafe` / `#1d4ed8`)
  - Status Dot: `bg-blue-500` (`#3b82f6`)

### 2.3 Shadow & Elevation System

- **Soft Card Elevation (`.soft-card`)**:
  ```css
  background: #ffffff;
  box-shadow: 0 10px 40px -10px rgba(40, 30, 20, 0.05);
  border: 1px solid rgba(230, 220, 210, 0.6);
  ```
- **Coral Glow Accent (`.coral-glow`)**:
  ```css
  box-shadow: 0 20px 40px -15px rgba(255, 107, 74, 0.35);
  ```
- **Modal Depth**: `shadow-2xl` (`box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)`) coupled with `backdrop-blur-sm` overlay backdrop.

---

## 3. Typography Architecture

The typography system relies on `"Plus Jakarta Sans"` with robust fallbacks, guaranteeing exceptional public legibility alongside technical precision for grievance ticket codes.

### 3.1 Font Stacks & Roles

- **Display & Body Primary**:
  `"Plus Jakarta Sans", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
  - Mapped to `--font-sans` in Tailwind v4.
  - A friendly geometric neo-grotesque with a generous x-height, engineered for civic engagement and crystal-clear mobile viewing.
- **Monospace Code & Ticket Numbers**:
  `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`
  - Mandatory for all **Grievance Ticket IDs** (e.g., `ASP-2026-9081`), status tracking search inputs, and agency analytics codes.

### 3.2 Hierarchy & Scale Spacing

| Hierarchy Level              | Size & Weight                                               | Line-Height & Tracking                                      | Application in Routes                                                             |
| :--------------------------- | :---------------------------------------------------------- | :---------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Hero Title (`h1`)**        | `clamp(2.25rem, 5vw, 3.75rem)` (36px–60px), ExtraBold 800   | `leading-[1.12]`, `tracking-tight` (`-0.025em`)             | _"Do everything in your power for the progress of our city."_                     |
| **Section Title (`h2`)**     | `1.875rem`–`2.25rem` (30px–36px), ExtraBold 800             | `leading-tight`, `tracking-tight`                           | Headers: _"A Single Civic Space"_, _"Recent Aspirations"_, _"FAQ"_.               |
| **Card / Item Title (`h3`)** | `1.125rem` (18px), Bold 700                                 | `leading-snug`                                              | Feed item titles, feature card titles, FAQ question labels.                       |
| **Subtitle / Lead**          | `1.0rem`–`1.125rem` (16px–18px), Normal 400                 | `leading-relaxed` (`1.625`), text `slate-600`               | Hero subheadings and section introductions.                                       |
| **Body / Description**       | `0.875rem`–`0.75rem` (14px / 12px), Normal 400 / Medium 500 | `leading-relaxed`, text `slate-500` / `slate-600`           | Citizen complaint descriptions, FAQ answers, form helper notes.                   |
| **Badge / Eyebrow**          | `0.75rem` (12px), Bold 700 / ExtraBold 800                  | `uppercase`, `tracking-widest` (`0.1em`), text `accent-500` | Eyebrow badges: _"WHY CHOOSE US"_, _"CIVIC ENGAGEMENT"_, _"TICKET TRANSPARENCY"_. |
| **Ticket & Metadata**        | `0.6875rem`–`0.75rem` (11px–12px), Mono & Bold              | `font-mono`, text `slate-400` / `darknavy-900`              | Ticket IDs `ASP-2026-XXXX`, timestamps _"2 hours ago"_.                           |

---

## 4. Component Stylings & Interaction Specifications

### 4.1 Buttons & Action Controls

1. **Primary Button (Coral Pill)**:
   - _Classes_: `rounded-full bg-accent-500 px-8 py-4 text-sm font-bold text-white coral-glow hover:bg-accent-600`
   - _Tactile Feedback_: `button:active { transform: scale(0.97); }` via global CSS, arrow icon micro-translation `group-hover:translate-x-1`.
2. **Secondary Button (Warm White Pill)**:
   - _Classes_: `rounded-full border border-warm-300 bg-white px-7 py-4 text-sm font-bold text-darknavy-900 hover:bg-warm-100`
   - _Role_: _"How It Works"_ trigger, guide buttons.
3. **Contrast Dark Button (Nav & Track)**:
   - _Classes_: `rounded-full bg-darknavy-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-accent-500 shadow-lg`
   - _Role_: Navbar CTA button _"Submit Aspiration"_ and ticket tracker submit button.
4. **Interactive Upvote Button**:
   - _Default State (Unvoted)_: `text-slate-400 hover:bg-warm-100` with an outlined heart icon.
   - _Active State (Voted)_: `bg-accent-50 text-accent-500 font-bold` with a filled heart icon. Vote increments are optimistic with toast confirmation.

### 4.2 Hero Section & Interactive Orbital Cluster

The Hero features an asymmetric split-screen layout (`grid-cols-1 lg:grid-cols-12`):

- **Left Column**:
  - Live pulse badge: `Community & Public Voice Platform` with `animate-ping rounded-full bg-accent-500` indicator dot.
  - Editorial headline with offset underlined accent: `underline decoration-accent-500/30 underline-offset-8`.
  - Primary ("Submit Aspiration") and secondary ("How It Works") action buttons.
  - Overlapping social proof avatar stack (`-space-x-2`) with community counter: _"14,800+ citizens participating"_.
- **Right Column (Orbital Cluster)**:
  - Background Dashed Orbits: Concentric dashed circular tracks spinning slowly (`spin-slow`, subtle 40-second full rotation).
  - Central Core Hub: Focal center circle `SuaraWarga` (`bg-accent-500 shadow-2xl shadow-accent-500/40`) with megaphone icon.
  - Satellite Cards:
    - Citizen Node: Avatar + "Road Repair" grievance tag with gentle bouncing motion (`animate-bounce`).
    - Verification Status Node: Avatar + "Verified" status chip.
    - Agency Progress Card: Mini-container with amber _"In Progress"_ badge and public works department identifier.
    - Dark Stat Badge: Obsidian container `bg-darknavy-900` showcasing `98.4%` monthly resolution rate with a green checkmark.
    - Micro Floating Reactions: Floating pills with like reaction (`text-accent-500`) and comment indicators (`text-blue-500`).

### 4.3 Proof & Statistics Strip

A social proof validation band positioned directly below the Hero with borders: `border-y border-warm-200 bg-white py-12`:

- **Active Citizen Community**: User icon encased within an accent dashed circle (`border-2 border-dashed border-accent-500`).
- **Response Analytics (SLA)**: Smooth interior container (`bg-warm-100 rounded-3xl p-6`) with chart icon and bold `24/7` stat (&lt; 24-hour rapid initial follow-up).
- **Guaranteed Privacy**: Smooth interior container with shield and lock icons, affirming a 100% secure, tamper-proof anonymous reporting guarantee.

### 4.4 Asymmetric Features Grid

A 6-card value proposition layout (`grid-cols-1 md:grid-cols-3 gap-6`) designed to break monotonous grid layouts:

- **5 Standard Soft-Cards**: Containers styled with `soft-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1` featuring icons on `bg-accent-50 text-accent-500` ("Secure & Verified", "Accessible Anywhere", "Real-Time Tracking", "Direct to Agencies", "Community Endorsement").
- **1 High-Contrast Featured Focal Card**: The second card ("Zero Additional Cost") is saturated in full `bg-accent-500 text-white coral-glow` with a semi-transparent divider and action arrow, establishing an immediate visual anchor on the grid.

### 4.5 Aspiration Feed & Filtering System

- **Toolbar & Search**:
  - Instant text filter: Rounded-full input with magnifying glass searching across title, description, citizen name, or district.
  - Horizontal pill category tabs: "All Categories", "Infrastructure" (amber), "Public Services" (blue), "Environment" (emerald), "Healthcare" (rose).
  - Active tab state: `bg-darknavy-900 text-white shadow-md`; inactive tab state: `bg-warm-100 text-slate-600 hover:bg-warm-200`.
- **Feed Cards (`soft-card`)**:
  - Card Header: Citizen avatar + author name + location + relative timestamp + semantic status chip.
  - Title: Interactive bold heading clickable to inspect live ticket tracking.
  - Body: Shortened summary clamped to 3 lines (`line-clamp-3`).
  - Agency Bar: Rounded container (`bg-warm-100 border border-warm-200`) detailing assigned agency and monospaced Ticket ID.
  - Card Footer: Interactive upvote button + comment counter.
- **Empty State**: Dashed container (`border-dashed border-warm-300 bg-warm-100`) with an open folder icon displayed when search/filter queries return no results.

### 4.6 Ticket Tracking CTA Section

A full-bleed dark contrast section placed near the bottom (`bg-darknavy-900 text-white py-20`):

- Visual Effect: Dual ambient blur backdrops (`bg-accent-500/20 blur-3xl`).
- Tracking Form: Semi-transparent monospaced input (`bg-white/10 border-white/20 uppercase font-mono`) paired with coral "Check Status" CTA button, triggering the `TrackModal`.

### 4.7 FAQ Section (Accordion)

A centered, focused container (`max-w-3xl`) featuring clean accordion cards (`overflow-hidden rounded-3xl border border-warm-200 bg-white`):

- Smooth expansion click interaction.
- Arrow icon rotation `rotate-180` over `300ms`.
- Answers covering anonymous privacy, standard 24-hour SLA response timelines, and complaint scope.

### 4.8 Modals & Notification Toasts

- **AspirationModal (Grievance Submission Form)**:
  - Dark header `bg-darknavy-900 text-white` with pencil icon and close button.
  - "Submit Anonymously" toggle switch: When toggled, locks the name field to "Anonymous Citizen".
  - Two-column grid for Name & District, and Category & Target Agency.
  - Problem title input and detailed description textarea with coral focus ring.
  - Submit button with paper plane icon and immediate feedback.
- **TrackModal (Ticket Status Tracking)**:
  - Dark header and prominent monospaced ticket ID with status chip.
  - 4-step vertical timeline visualization:
    - 1. Report Received (Green Checkmark)
    - 2. Admin Verified (Green Checkmark)
    - 3. Field Work In Progress (Active Coral Accent with `ring-4 ring-accent-100`)
    - 4. Resolution Completed (Muted / Pending)
- **ToastContainer (Floating Notifications)**:
  - Fixed bottom-right positioning (`fixed bottom-5 right-5 z-50`).
  - Dark capsule pill `bg-darknavy-900 text-white` with subtle coral border and status icons.
  - Auto-dismisses after 4000ms.

### 4.9 Navigation & Footer Chrome

- **GlobalNav**:
  - Sticky glassmorphic bar (`sticky top-0 z-40 border-b border-warm-300/60 bg-warm-100/90 backdrop-blur-md`).
  - SuaraWarga brand identity with rounded coral megaphone icon container.
  - Desktop navigation items with gentle coral hover accents.
  - Quick action buttons: "Track Ticket" and obsidian "Write Aspiration".
  - Responsive mobile drawer menu for screen widths under 768px.
- **SiteFooter**:
  - Full obsidian backdrop (`bg-darknavy-900 border-t border-darknavy-800 text-slate-400`).
  - 4 columns: Platform overview, Quick navigation links, Partner Government Agencies (Public Works, Transport, Environment, Health), and Emergency 112 Hotline badge.

---

## 5. Layout Principles & Responsive Architecture

### 5.1 Container & Grid Standards

- **Max Width Boundary**: `max-w-7xl` (`80rem` / `1280px`) for all content containers, centered (`mx-auto`), with adaptive horizontal padding (`px-4 sm:px-6 lg:px-8`).
- **Section Spacing Rhythm**:
  - Desktop: `py-20` to `py-24` (80px–96px) ensuring clear visual hierarchy and breathing room between sections.
  - Mobile: `py-12` to `py-16` (48px–64px).
- **Containment & Overflow**: `overflow-x-hidden` on root body and hero wrapper to prevent horizontal scroll jitters from rotating decorative elements.

### 5.2 Mobile-First Breakpoints & Collapse Strategy

- **Small Mobile Devices (`< 640px` / `sm`)**:
  - Hero CTAs and tracking input forms stack vertically (`w-full`).
  - Modal form inputs collapse into a single vertical column.
  - Headline typography scales down proportionally (`text-4xl`).
- **Tablet Devices (`< 768px` / `md`)**:
  - Desktop horizontal navigation collapses into a mobile drawer toggle.
  - 3-column feature and stat grids shift into single vertical columns.
  - Feed cards collapse into 1 or 2 columns.
- **Medium Desktop Displays (`< 1024px` / `lg`)**:
  - Split-screen Hero (copy left + orbital cluster right) stacks cleanly.
  - Orbital cluster scales down proportionally without breaking layout flow.

---

## 6. Motion Philosophy & Animation Engine

The platform utilizes hardware-accelerated CSS utilities in [app/app.css](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/app.css) that are lightweight, smooth, and battery-friendly.

### 6.1 Perpetual Micro-Animations

- **Orbiting Axis (`spin-slow`)**:
  ```css
  @keyframes rotateOrbit {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .spin-slow {
    animation: rotateOrbit 40s linear infinite;
  }
  ```
- **Gentle Floating (`animate-float`)**:
  ```css
  @keyframes float-y {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }
  .animate-float {
    animation: float-y 6s ease-in-out infinite;
  }
  ```
- **Live Status Ping**: Employs `animate-ping` on hero badge indicator dots to signal live platform responsiveness.
- **Bouncing Node**: `animate-bounce` with a softened 4-second custom duration on hero user nodes to provide lifelike ambient depth without distracting reading focus.

### 6.2 Interactive Transitions & Tactile Feedback

```css
/* Unified smooth transitions for all interactive controls */
button,
a,
input,
select,
textarea {
  transition:
    transform 180ms ease,
    opacity 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

/* Tactile push feedback on active clicks */
button:active,
a:active {
  transform: scale(0.97);
}
```

### 6.3 Accessibility & Reduced Motion

In strict compliance with WCAG 2.1 Level AAA guidelines, user motion preferences are fully respected:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## 7. Anti-Patterns & Strict Banned Rules

Strict prohibitions to safeguard premium aesthetics, UX consistency, and performance:

- ❌ **NO Pure Black (`#000000`)**: All dark ink and dark surfaces must use Obsidian Dark Navy (`#191b24` or `#11131a`).
- ❌ **NO Generic Purple / Neon Blue AI Glows**: No clichéd purple-to-blue gradients or neon sci-fi box shadows.
- ❌ **NO Flat Unvaried 3-Card Grids**: Feature grids must maintain visual rhythm; at least one card must serve as a high-contrast _featured focal card_ (`bg-accent-500`).
- ❌ **NO Unstyled Default System Fonts**: Typography must bind to `Plus Jakarta Sans` with `ui-monospace` for ticket codes and analytical metrics.
- ❌ **NO Raw `h-screen` on Mobile Viewports**: Use `min-h-[100dvh]` to eliminate mobile URL bar jump bugs (e.g., iOS Safari).
- ❌ **NO Direct Layout Reflow Property Animations**: Never animate reflow properties such as `top`, `left`, `width`, or `height`. Always animate `transform` and `opacity`.
- ❌ **NO Raw Informal Emojis**: Never render bare emojis in public civic UI; utilize crisp vector icons (Lucide or FontAwesome).
- ❌ **NO Dropped Accessibility Focus States**: All inputs and interactive elements must present clear focus rings (`focus:ring-2 focus:ring-accent-500`).
- ❌ **NO Missing Alt Text & ARIA Labels**: All avatars, status badges, and icon-only buttons must provide explicit `alt` or `aria-label` attributes.

---

## 8. Tech Stack Integration & Code Conventions

### 8.1 Tailwind CSS v4 `@theme` Architecture

In Tailwind CSS v4, tokens are defined centrally in [app/app.css](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/app.css) using the `@theme` directive:

```css
@theme {
  --font-sans:
    'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  --color-warm-50: #fdfbf7;
  --color-warm-100: #faf5f0;
  --color-warm-200: #f4ece1;
  --color-warm-300: #e8dbcb;
  --color-accent-50: #fff0eb;
  --color-accent-100: #ffe0d5;
  --color-accent-500: #ff6b4a;
  --color-accent-600: #f05432;
  --color-accent-700: #d43d1d;
  --color-darknavy-800: #262935;
  --color-darknavy-900: #191b24;
  --color-darknavy-950: #11131a;
  --color-navy-800: #262935;
  --color-navy-900: #191b24;
  --color-navy-950: #11131a;
  --radius-4xl: 2.5rem;
}
```

### 8.2 React Router v8 Route Conventions

- **SEO & Meta Export**: Use declarative `meta()` in route modules such as [app/routes/home.tsx](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/routes/home.tsx):
  ```typescript
  import type { Route } from './+types/home';

  export const meta: Route.MetaFunction = () => [
    { title: 'SuaraWarga - Modern Citizen Aspiration & Grievance Platform' },
    {
      name: 'description',
      content:
        'Transparent, responsive, and inclusive civic engagement platform for modern cities.',
    },
  ];
  ```
- **Component Decomposition & Single-Page Isolation**:
  - Adhere to `AGENTS.md` component placement guidelines: single-page components remain adjacent to their route under `app/routes/` or a subfolder within `app/routes/`.
  - Reusable layout modules (Navbar, Footer, Shell) belong under `app/components/layout/`.
  - Reusable cross-route primitives belong under `app/components/ui/` (shadcn primitives) or `app/components/shared/`.
