# Design System: Si Waday (Wadah Aspirasi & Aduan Warga)

This document is the **Single Source of Truth (SSOT)** for visual design architecture, styling tokens, interface components, and motion interactions for the **Si Waday** (`si-waday`) platform. It is structured and maintained based on the implementation across [app/layouts/home-layout.tsx](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/layouts/home-layout.tsx), route modules under `app/routes/`, domain components in `app/components/home/`, layout chrome in `app/components/layout/`, shadcn/ui primitives in `app/components/ui/`, Tailwind CSS v4 styling in [app/app.css](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/app.css), and design directives from **Google Stitch (`stitch-design-taste`)**, **Tailwind CSS v4**, and **React Router v8 (Framework Mode)**.

---

## 1. Visual Theme & Atmosphere

### 1.1 Mood & Visual Character

Si Waday embodies the visual identity of **Civic Warmth & High-Agency Transparency**. Rejecting the rigid, cold, and bureaucratic aesthetics of conventional public sector portals, this platform fuses social warmth with operational decisiveness:

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

#### Si Waday Brand & Palette Tokens (@theme)

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

#### shadcn/ui Semantic Token Mapping (:root)

All shadcn primitives consume CSS custom properties configured in `:root` within [app/app.css](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/app.css), seamlessly harmonized with the Si Waday brand:

| shadcn Token       | CSS Variable Value    | Mapped Utility Classes                      | Role in UI                                               |
| :----------------- | :-------------------- | :------------------------------------------ | :------------------------------------------------------- |
| `background`       | `#faf5f0`             | `bg-background`                             | Root application background, page shells, outer wrappers |
| `foreground`       | `#191b24`             | `text-foreground`                           | Primary readable ink across all standard surfaces        |
| `card` / `popover` | `#ffffff`             | `bg-card`, `bg-popover`                     | Soft-card containers, modals, dropdown menus             |
| `primary`          | `#ff6b4a`             | `bg-primary`, `text-primary-foreground`     | Main action buttons, active toggles, highlighted pills   |
| `secondary`        | `#f4ece1`             | `bg-secondary`, `text-secondary-foreground` | Subtle backdrops, chip tags, secondary buttons           |
| `muted`            | `#f4ece1` / `#64748b` | `bg-muted`, `text-muted-foreground`         | Inactive tabs, helper texts, placeholder labels          |
| `accent`           | `#fff0eb` / `#ff6b4a` | `bg-accent`, `text-accent-foreground`       | Hover states, pill badges, selected list options         |
| `border` / `input` | `#e8dbcb`             | `border-border`, `border-input`             | Card outlines, input borders, structural dividers        |
| `ring`             | `#ff6b4a`             | `ring-ring`, `ring-primary`                 | Accessibility focus rings, active step nodes             |

> [!IMPORTANT]
> **Enforce Canonical Classes (`suggestCanonicalClasses`)**: Never use arbitrary color brackets such as `bg-[#FAF5F0]`, `text-[#191B24]`, or `border-[#E8DBCB]`. Always use semantic canonical tokens: `bg-background` (or `bg-warm-100`), `text-foreground` (or `text-darknavy-900`), and `border-border` (or `border-warm-300`). This ensures complete theme coherency and eliminates Tailwind compiler warnings.

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

| Hierarchy Level                     | Size & Weight                                               | Line-Height & Tracking                                      | Application in Routes                                                             |
| :---------------------------------- | :---------------------------------------------------------- | :---------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Hero Title (`h1`)**               | `clamp(2.25rem, 5vw, 3.75rem)` (36px–60px), ExtraBold 800   | `leading-[1.12]`, `tracking-tight` (`-0.025em`)             | _"Do everything in your power for the progress of our city."_                     |
| **Section Title (`h2`)**            | `1.875rem`–`2.25rem` (30px–36px), ExtraBold 800             | `leading-tight`, `tracking-tight`                           | Headers: _"A Single Civic Space"_, _"Recent Aspirations"_, _"FAQ"_.               |
| **Card / Item Title (`h3`)**        | `1.125rem` (18px), Bold 700                                 | `leading-snug`                                              | Feed item titles, feature card titles, FAQ question labels.                       |
| **Subtitle / Lead**                 | `1.0rem`–`1.125rem` (16px–18px), Normal 400                 | `leading-relaxed` (`1.625`), text `slate-600`               | Hero subheadings and section introductions.                                       |
| **Body / Description**              | `0.875rem`–`0.75rem` (14px / 12px), Normal 400 / Medium 500 | `leading-relaxed`, text `slate-500` / `slate-600`           | Citizen complaint descriptions, FAQ answers, form helper notes.                   |
| **Badge / Eyebrow**                 | `0.75rem` (12px), Bold 700 / ExtraBold 800                  | `uppercase`, `tracking-widest` (`0.1em`), text `accent-500` | Eyebrow badges: _"WHY CHOOSE US"_, _"CIVIC ENGAGEMENT"_, _"TICKET TRANSPARENCY"_. |
| **Ticket & Metadata**               | `0.6875rem`–`0.75rem` (11px–12px), Mono & Bold              | `font-mono`, text `slate-400` / `darknavy-900`              | Ticket IDs `ASP-2026-XXXX`, timestamps _"2 hours ago"_.                           |
| **Micro Badges (`text-2xs`)**       | `0.625rem` (10px), Medium / Bold 700                        | `leading-[0.875rem]`, font-sans or font-mono                | Overlapping avatar numbers, compact indicator tags, micro-counter pills.          |
| **Tight Subtext (`text-xs-tight`)** | `0.6875rem` (11px), Medium 500                              | `leading-4` (`1rem`), font-sans                             | Auxiliary timestamps, compact form hints, table metadata.                         |

> [!TIP]
> **Canonical Typography Utilities**: Avoid arbitrary brackets like `text-[10px]` or `text-[11px]`. Always use the registered `@theme` utilities `text-2xs` (10px) and `text-xs-tight` (11px) or standard `text-xs` (12px).

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
  - Central Core Hub: Focal center circle `Si Waday` (`bg-accent-500 shadow-2xl shadow-accent-500/40`) with megaphone icon.
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

- **Section Anchor Target**: Configured with `id="lacak-tiket"` allowing the Navbar "Lacak Tiket" button and deep links to smoothly anchor directly to this tracking tool.
- **Visual Effect**: Dual ambient blur backdrops (`bg-accent-500/20 blur-3xl`).
- **Tracking Form**: Semi-transparent monospaced input (`bg-white/10 border-white/20 uppercase font-mono`) paired with coral "Check Status" CTA button, triggering the `TrackModal`.

### 4.7 FAQ Section (shadcn/ui Accordion)

A centered, focused container (`max-w-3xl`) built upon **shadcn/ui Accordion** primitives (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`):

- **Single Collapsible Mode**: Configured as `type="single" collapsible` to keep cognitive load minimal for citizens.
- **Styling & Anatomy**:
  - `AccordionItem`: Bordered container with `overflow-hidden rounded-3xl border border-warm-200 bg-white mb-4 shadow-sm`.
  - `AccordionTrigger`: Crisp typography (`font-bold text-darknavy-900 hover:no-underline hover:text-accent-500 py-6 px-6 sm:px-8`) with an animated rotating chevron.
  - `AccordionContent`: Relaxed readable body (`text-slate-600 px-6 sm:px-8 pb-6 text-sm leading-relaxed border-t border-warm-100 pt-4`).
- Answers cover anonymous privacy, standard 24-hour SLA response timelines, and complaint scope.

### 4.8 Modals & Global Notifications (shadcn/ui Dialog & Sonner)

- **AspirationModal & TrackModal (shadcn/ui Dialog)**:
  - Both modals are constructed using shadcn **`Dialog`** primitives (`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`).
  - Native accessibility: Screen reader focus management, escape key handlers, backdrop blur, and scroll locking handled declaratively.
  - Modal headers feature dark branding `bg-darknavy-900 text-white rounded-t-3xl p-6 sm:p-8`, with custom styled close buttons.
  - **TrackModal Timeline**: 4-step vertical timeline visualization with interactive status nodes (`Report Received`, `Admin Verified`, `Field Work In Progress`, `Resolution Completed`).
- **Global Toast Notifications (Sonner)**:
  - The application replaces ad-hoc floating containers with **shadcn `sonner`** via `<Toaster position="bottom-right" richColors />` mounted once inside `app/layouts/home-layout.tsx`.
  - Dispatched imperatively from any component or action handler with zero prop drilling:
    ```typescript
    import { toast } from 'sonner';

    toast.success('Aspirasi Terkirim!', {
      description: 'Laporan Anda telah berhasil dicatat dengan ID ASP-2026-9081.',
    });
    ```
  - Displays high-contrast civic alerts with subtle borders, rich status coloring, and fluid entry/exit spring physics.

### 4.9 Navigation, Layout Chrome & Dedicated Routes

- **GlobalNav (`app/components/layout/navbar.tsx`)**:
  - Sticky glassmorphic bar (`sticky top-0 z-40 border-b border-warm-300/60 bg-warm-100/90 backdrop-blur-md`).
  - Si Waday brand identity with rounded coral megaphone icon container.
  - Desktop navigation items with gentle coral hover accents.
  - **Quick Action Links**:
    - **"Lacak Tiket"**: Links smoothly to the in-page anchor `/#lacak-tiket` via `<Link to="/#lacak-tiket">`.
    - **"Tulis Aspirasi"**: Direct navigation to the dedicated aspiration submission route `to="/aspiration"` via `<Link to="/aspiration">`.
  - Responsive mobile drawer menu for screen widths under 768px.
- **Dedicated Submission Page (`app/routes/aspiration.tsx`)**:
  - Full-page citizen form route wrapped seamlessly by `HomeLayout`.
  - Built with shadcn **`Card`**, **`Input`**, **`Textarea`**, **`Switch`**, **`Select`**, and **`Button`**.
  - Features an "Anonymous Submission" toggle that locks identity fields for privacy.
- **SiteFooter (`app/components/layout/footer.tsx`)**:
  - Full obsidian backdrop (`bg-darknavy-900 border-t border-darknavy-800 text-slate-400`).
  - 4 columns: Platform overview, Quick navigation links, Partner Government Agencies (Public Works, Transport, Environment, Health), and Emergency 112 Hotline badge.

---

## 5. Layout Principles & Responsive Architecture

### 5.1 Container & Grid Standards

- **Canonical Dynamic Viewport (`min-h-dvh`)**: All full-height root shells, layouts, and page containers must use `min-h-dvh` instead of arbitrary `min-h-[100dvh]`.
- **Max Width Boundary**: `max-w-7xl` (`80rem` / `1280px`) for all content containers, centered (`mx-auto`), with adaptive horizontal padding (`px-4 sm:px-6 lg:px-8`).
- **Section Spacing Rhythm**:
  - Desktop: `py-20` to `py-24` (80px–96px) ensuring clear visual hierarchy and breathing room between sections.
  - Mobile: `py-12` to `py-16` (48px–64px).
- **Containment & Overflow**: `overflow-x-hidden` on root body and hero wrapper to prevent horizontal scroll jitters from rotating decorative elements.

### 5.2 Mobile-First Breakpoints & Collapse Strategy

- **Small Mobile Devices (`< 640px` / `sm`)**:
  - Hero CTAs and tracking input forms stack vertically (`w-full`).
  - Modal and page form inputs collapse into a single vertical column.
  - Headline typography scales down proportionally (`text-4xl`).
- **Tablet Devices (`< 768px` / `md`)**:
  - Desktop horizontal navigation collapses into a mobile drawer toggle.
  - 3-column feature and stat grids shift into single vertical columns.
  - Feed cards collapse into 1 or 2 columns.
- **Medium Desktop Displays (`< 1024px` / `lg`)**:
  - Split-screen Hero (copy left + orbital cluster right) stacks cleanly.
  - Orbital cluster scales down proportionally without breaking layout flow.

### 5.3 Route Layout Architecture (`app/layouts/` & `<Outlet />`)

Layouts are decoupled into distinct architectural layers:

1. **Route Layout Shells (`app/layouts/`)**:
   - Registered in [app/routes.ts](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/routes.ts) using the `layout()` helper.
   - Render the persistent layout chrome, dynamic child content via React Router v8 **`<Outlet />`**, and global infrastructure providers (such as Sonner's `<Toaster />`).
   - Example: [app/layouts/home-layout.tsx](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/layouts/home-layout.tsx):
     ```tsx
     import { Outlet } from 'react-router';

     import { Footer } from '@/components/layout/footer';
     import { Navbar } from '@/components/layout/navbar';
     import { Toaster } from '@/components/ui/sonner';

     export default function HomeLayout() {
       return (
         <div className="bg-background text-foreground selection:bg-accent-500 flex min-h-dvh flex-col antialiased selection:text-white">
           <Navbar />
           <main className="flex-1">
             <Outlet />
           </main>
           <Footer />
           <Toaster position="bottom-right" richColors />
         </div>
       );
     }
     ```
2. **Structural Layout Blocks (`app/components/layout/`)**:
   - Reusable layout components such as `Navbar`, `Footer`, `Sidebar`, `Breadcrumbs` consumed across multiple route layouts.
3. **Route Modules (`app/routes/`)**:
   - Clean section controllers (`routes/home.tsx`, `routes/aspiration.tsx`) that focus purely on data loading, actions, and page-specific composition.

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

### 6.3 Accessibility & Motion Performance

In strict compliance with WCAG 2.1 accessibility guidelines, motion design in Si Waday is engineered for smooth, performant rendering:

- Animations avoid layout-reflow properties (`width`, `height`, `top`, `left`) and operate strictly on GPU-composited `transform` and `opacity`.
- Perpetual animations (`spin-slow`, `animate-float`, `animate-bounce-slow`) have relaxed, non-distracting cycles (4s to 40s).
- Avoid indiscriminate global wildcard resets (`* { animation: none !important; }`) that could inadvertently degrade or break user interactions on platforms with default system accessibility flags.

---

## 7. Anti-Patterns & Strict Banned Rules

Strict prohibitions to safeguard premium aesthetics, UX consistency, and performance:

- ❌ **NO Pure Black (`#000000`)**: All dark ink and dark surfaces must use Obsidian Dark Navy (`#191b24` or `#11131a`).
- ❌ **NO Generic Purple / Neon Blue AI Glows**: No clichéd purple-to-blue gradients or neon sci-fi box shadows.
- ❌ **NO Flat Unvaried 3-Card Grids**: Feature grids must maintain visual rhythm; at least one card must serve as a high-contrast _featured focal card_ (`bg-accent-500`).
- ❌ **NO Unstyled Default System Fonts**: Typography must bind to `Plus Jakarta Sans` with `ui-monospace` for ticket codes and analytical metrics.
- ❌ **NO Arbitrary CSS Bracket Values When Canonical Exists**:
  - Never use arbitrary `min-h-[100dvh]` — use canonical `min-h-dvh`.
  - Never use arbitrary `bg-[#FAF5F0]` — use canonical `bg-background` or semantic `bg-warm-100`.
  - Never use arbitrary `text-[10px]` — use canonical `text-2xs`.
  - Never use arbitrary `text-[11px]` — use canonical `text-xs-tight` or standard `text-xs`.
- ❌ **NO Custom Wheel Re-inventions for UI Primitives**: Always reuse shadcn/ui components from `app/components/ui/` (`Dialog`, `Accordion`, `Sonner`, `Card`, `Badge`, `Switch`, `Select`, `Button`) customized via `cn()`.
- ❌ **NO Prop-Drilled Floating Toast Containers**: Never pass toast callback functions down component trees; mount Sonner's `<Toaster />` once in route layouts and dispatch imperatively via `toast.*`.
- ❌ **NO Direct Layout Reflow Property Animations**: Never animate reflow properties such as `top`, `left`, `width`, or `height`. Always animate `transform` and `opacity`.
- ❌ **NO Raw Informal Emojis**: Never render bare emojis in public civic UI; utilize crisp vector icons (Lucide or FontAwesome).
- ❌ **NO Dropped Accessibility Focus States**: All inputs and interactive elements must present clear focus rings (`focus:ring-2 focus:ring-accent-500`).
- ❌ **NO Missing Alt Text & ARIA Labels**: All avatars, status badges, and icon-only buttons must provide explicit `alt` or `aria-label` attributes.

---

## 8. Tech Stack Integration & Code Conventions

### 8.1 Tailwind CSS v4 Theme & Token Architecture

In Tailwind CSS v4, tokens are defined centrally in [app/app.css](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/app.css) using `@theme`, `@theme inline`, and `:root` custom properties:

```css
@import 'tailwindcss';

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
  --radius-4xl: 2.5rem;
  --text-2xs: 0.625rem;
  --text-xs-tight: 0.6875rem;
}

:root {
  --background: #faf5f0;
  --foreground: #191b24;
  --card: #ffffff;
  --card-foreground: #191b24;
  --popover: #ffffff;
  --popover-foreground: #191b24;
  --primary: #ff6b4a;
  --primary-foreground: #ffffff;
  --secondary: #f4ece1;
  --secondary-foreground: #191b24;
  --muted: #f4ece1;
  --muted-foreground: #64748b;
  --accent: #fff0eb;
  --accent-foreground: #ff6b4a;
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: #ffffff;
  --border: #e8dbcb;
  --input: #e8dbcb;
  --ring: #ff6b4a;
  --radius: 0.625rem;
}
```

### 8.2 React Router v8 Route Conventions & Layout Manifest

- **Route Layout Nesting (`app/routes.ts`)**:
  Persistent layout shells wrap child routes via `layout()`, providing shared navigation, footers, and toast providers:
  ```typescript
  import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

  export default [
    layout('layouts/home-layout.tsx', [
      index('routes/home.tsx'),
      route('aspiration', 'routes/aspiration.tsx'),
    ]),
  ] satisfies RouteConfig;
  ```
- **SEO & Meta Export**: Use declarative `meta()` in route modules such as [app/routes/home.tsx](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/routes/home.tsx):
  ```typescript
  import type { Route } from './+types/home';

  export const meta: Route.MetaFunction = () => [
    { title: 'Si Waday - Wadah Aspirasi & Aduan Warga' },
    {
      name: 'description',
      content: 'Platform aspirasi dan pengaduan warga yang transparan, responsif, dan akuntabel.',
    },
  ];
  ```
- **Directory Hierarchy & Responsibilities**:
  - `app/layouts/`: Route layout shells hosting `<Outlet />` (e.g. `home-layout.tsx`).
  - `app/components/layout/`: Reusable structural layout blocks (`navbar.tsx`, `footer.tsx`).
  - `app/components/home/`: Domain presentation widgets for the landing route (`hero.tsx`, `features.tsx`, `feed.tsx`, `stats.tsx`, `cta-tracking.tsx`, `faq.tsx`, `modals.tsx`).
  - `app/components/ui/`: shadcn/ui primitives (`dialog.tsx`, `accordion.tsx`, `sonner.tsx`, etc.).
  - `app/components/shared/`: Shared reusable components across multiple routes.
  - `app/routes/`: Route modules (`home.tsx`, `aspiration.tsx`).
  - `app/types/`: Domain TypeScript types (`aspiration.ts`, `ui.ts`).
  - `app/constants/`: Static configuration & datasets (`aspirations.ts`, `faq.ts`, `navigation.ts`).

### 8.3 Favicon & Web Icon System

The application web icon is derived directly from the primary brand identity badge:

- **Vector Web Icon (`public/favicon.svg`)**:
  - High-precision SVG icon formatted at `64x64` with squircle radius `rx="18"`.
  - Background: Linear gradient from `#FF7557` to `#F05432` (`coral-gradient`).
  - Foreground: Centered vector Megaphone path in crisp white (`#FFFFFF`) with `stroke-width="2.2"`.
  - Infinitely scalable, ultra-lightweight (&lt; 1KB), with pixel-sharp rendering on Retina, 4K, dark mode, and light mode browser tab bars.
- **Apple Touch Icon (`public/apple-touch-icon.png`)**:
  - `180x180` high-density PNG for iOS Safari home screen bookmarks and mobile web app manifests.
- **Legacy Fallback Favicon (`public/favicon.ico`)**:
  - Multi-resolution packed binary container housing `16x16`, `32x32`, and `48x48` PNG image payloads.
- **Root Manifest Registration (`app/root.tsx`)**:
  - Registered declaratively in `links: Route.LinksFunction`:
    ```typescript
    export const links: Route.LinksFunction = () => [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      // ...
    ];
    ```
