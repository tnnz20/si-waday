# Agent Instructions

## Repository

- **Project:** `si-waday` (Wadah Aspirasi & Aduan Warga).
- **Architecture:** Full-stack React Router v8.5 in Framework Mode, powered by Vite v8, React 19, and Tailwind CSS v4.
- **Runtime:** Node.js `>=24.0.0` (Alpine container runtime: `node:26.13.1-alpine`).
- **Database:** PostgreSQL 16 (Alpine) via discrete credentials and Drizzle ORM (`postgres` driver).

---

## Directory Structure & Responsibilities

```text
.
├── app/
│   ├── components/
│   │   ├── dashboard/admin/   # Admin dashboard widgets & tab views (overview, aspirations, complaints, user tables & modals)
│   │   ├── aspiration/        # Aspiration & complaint multi-step form wizard (identity, proposal, map-picker, modals)
│   │   ├── home/              # Landing page sections & presentation widgets (hero, feed, stats, faq, etc.)
│   │   ├── layout/            # Structural layout blocks (navbar, footer, admin-sidebar, breadcrumbs)
│   │   │   └── admin-sidebar/ # Decomposed sidebar subcomponents (header, nav, user-menu, types)
│   │   ├── shared/            # Reusable UI components shared across 2+ routes (table-pagination, etc.)
│   │   └── ui/                # shadcn/ui primitive components (button, dialog, sonner, input, avatar, tooltip, etc.)
│   ├── constants/             # Static constants & datasets (aspirations.ts, faq.ts, navigation.ts, tapin.ts, admin-data.ts)
│   ├── db/
│   │   ├── migrations/        # Generated SQL migrations and metadata snapshots
│   │   ├── schema/            # Drizzle table schema definitions (*.ts)
│   │   └── index.server.ts    # Drizzle client singleton with discrete credentials
│   ├── hooks/                 # Custom React client hooks
│   ├── layouts/               # Route shell layouts with <Outlet /> (home-layout.tsx, admin-layout.tsx, auth-layout.tsx)
│   ├── lib/                   # Utility helpers (cn(), logger.server.ts, auth.server.ts, upload.server.ts, audit.server.ts)
│   ├── middleware/            # React Router 8 server middlewares (logger.server.ts, auth, etc.)
│   ├── routes/                # Route modules (loaders, actions, page components)
│   │   ├── auth/              # Auth routes (login.tsx, logout.tsx)
│   │   ├── dashboard/         # Nested dashboard routes (overview, complaints, aspirations, users-*, users-*-detail)
│   │   ├── form/              # Dedicated public form routes (aspiration.tsx, complaint.tsx)
│   │   └── home.tsx           # Landing page route
│   ├── schema/                # Zod validation schemas
│   ├── types/                 # Shared TypeScript interfaces & types (aspiration.ts, ui.ts)
│   ├── app.css                # Tailwind CSS v4 imports, theme tokens & shadcn variables
│   ├── root.tsx               # Root document layout, HTML shell, and global middleware
│   └── routes.ts              # Route manifest & URL configuration
├── public/
│   └── uploads/               # User uploaded files (avatars, attachments)
├── scripts/
│   ├── data/                  # Source CSV datasets (dprd-tapin-members.csv, moderators.csv)
│   ├── csv.ts                 # Native Node.js CSV parsing utility
│   ├── db.ts                  # Database connection utility for standalone scripts
│   ├── migrate.ts             # Programmatic migration runner (supports local & SSH tunnel)
│   ├── seed.ts                # Master database seeder orchestrator
│   ├── seed-admin.ts          # Super admin seeder (from .env)
│   ├── seed-moderators.ts     # Regional moderators seeder (from CSV)
│   ├── seed-representatives.ts# DPRD & DPR RI representatives seeder (from CSV)
│   └── tunnel.ts              # SSH port forwarding utility (ssh2)
├── compose.yaml               # Container configuration for PostgreSQL
├── Dockerfile                 # Multi-stage production container
├── drizzle.config.ts          # Drizzle Kit configuration (PostgreSQL dialect)
├── Makefile                   # Developer task automation
└── README.md                  # Project overview and run guides
```

---

## Rules of Thumb & Engineering Directives

### 1. Routing & Route Modules (React Router Framework Mode)

- **Official Documentation & Reference:** [React Router Docs](https://reactrouter.com/home).
- Define all routes in [`app/routes.ts`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/routes.ts) using `@react-router/dev/routes` helpers (`index`, `route`, `layout`, `prefix`).
- Wrap route groups inside persistent layout shells using `layout()`:
  ```tsx
  layout('layouts/home-layout.tsx', [
    index('routes/home.tsx'),
  ]),
  layout('layouts/form-layout.tsx', [
    ...prefix('form', [
      route('aspiration', 'routes/form/aspiration.tsx'),
      route('complaint', 'routes/form/complaint.tsx'),
    ]),
  ]),
  layout('layouts/auth-layout.tsx', [
    route('auth/login', 'routes/auth/login.tsx'),
    route('auth/logout', 'routes/auth/logout.tsx'),
  ]),
  layout('layouts/admin-layout.tsx', [
    route('dashboard', 'routes/dashboard/overview.tsx'),
    route('dashboard/complaints', 'routes/dashboard/complaints.tsx'),
    route('dashboard/aspirations', 'routes/dashboard/aspirations.tsx'),
    route('dashboard/satisfaction', 'routes/dashboard/satisfaction.tsx'),
    ...prefix('dashboard/users', [
      route('legislators', 'routes/dashboard/users-legislators.tsx'),
      route('legislators/:slug', 'routes/dashboard/users-legislators-detail.tsx'),
      route('moderators', 'routes/dashboard/users-moderators.tsx'),
      route('moderators/:slug', 'routes/dashboard/users-moderators-detail.tsx'),
    ]),
  ]),
  ```
- Route files must live inside [`app/routes/`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/routes/).
- Route-level code splitting is **automatic**; do not wrap route modules with manual `React.lazy()`.
- Always import and type route functions using auto-generated types from `./+types/<route-filename>`:
  ```tsx
  import type { Route } from './+types/home';
  export const meta: Route.MetaFunction = () => [...];
  export async function loader({ request }: Route.LoaderArgs) { ... }
  export async function action({ request }: Route.ActionArgs) { ... }
  export default function Home({ loaderData }: Route.ComponentProps) { ... }
  ```
- Use React Router `<Link>` and `<NavLink>` for client-side navigation (e.g. `<Link to="/aspiration">`). Use hash anchor links for in-page section scrolling (e.g. `<Link to="/#lacak-tiket">`).
- Use `useNavigation().state` in [`app/root.tsx`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/root.tsx) for page transition indicators.
- Use `HydrateFallback` for routes requiring client-side initialization skeletons.

### 2. Layout Architecture (`app/layouts/` vs `app/components/layout/`)

- **`app/layouts/` (Route Layout Shells)**:
  - Registered via `layout(...)` in `app/routes.ts`.
  - Must render React Router v8 `<Outlet />` to host active child routes.
  - Hosts persistent page chrome (`Navbar`, `Footer`, `AdminSidebar`) and layout-level providers (such as Sonner's `<Toaster />`).
  - Examples: [`app/layouts/home-layout.tsx`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/layouts/home-layout.tsx), [`app/layouts/form-layout.tsx`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/layouts/form-layout.tsx), [`app/layouts/admin-layout.tsx`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/layouts/admin-layout.tsx), [`app/layouts/auth-layout.tsx`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/layouts/auth-layout.tsx).
- **`app/components/layout/` (Structural Layout Blocks)**:
  - Reserved for reusable visual layout blocks: `Navbar`, `Footer`, `AdminSidebar`, `Breadcrumbs`.
  - Complex widgets decompose into subdirectories (e.g., `app/components/layout/admin-sidebar/`).
  - Consumed by route layouts across the application.

### 3. Components Organization & shadcn/ui

- **`app/components/ui/`**: Reserved exclusively for official shadcn/ui primitives (`Button`, `Dialog`, `DropdownMenu`, `Accordion`, `Sonner`, `Card`, `Badge`, `Switch`, `Select`, `Input`, `Textarea`, `Avatar`, `Tooltip`).
  - **Official Component Documentation & Source Reference:** [shadcn/ui Components](https://ui.shadcn.com/docs/components).
  - **Strict rule against custom primitives:** Never invent or build custom primitive components by yourself (e.g. manual dropdowns, floating menus, custom backdrops, or bespoke select boxes). Always refer to and install official shadcn/ui component specifications backed by `@radix-ui` primitives.
  - Standard shadcn primitives use `React.forwardRef` and are excluded from React 19 ref refactorings.
  - When adapting styling, use the `cn()` utility (`app/lib/utils.ts`) at the component call site or configure custom primitive defaults.
- **`app/components/<domain>/`**: Domain/page presentation widgets belong in domain folders (e.g., `app/components/home/`, `app/components/aspiration/`, `app/components/dashboard/admin/`).
- **`app/components/shared/`**: Reusable custom components utilized by two or more distinct features/routes.
- **`app/types/` & `app/constants/`**: Keep data structures and static mock datasets centralized in dedicated files (e.g., `app/types/aspiration.ts`, `app/constants/tapin.ts`, `app/constants/admin-data.ts`). Do not mix static content inside route component files.

### 4. Global Toast Notifications (Sonner)

- Standardized on **shadcn `sonner`** via `<Toaster position="bottom-right" richColors />` mounted inside persistent layout shells (`home-layout.tsx`, `admin-layout.tsx`, `auth-layout.tsx`).
- Never build custom floating toast containers or pass toast state down through prop drilling.
- Dispatch toast notifications imperatively from anywhere:
  ```typescript
  import { toast } from 'sonner';

  toast.success('Aspirasi Terkirim!', {
    description: 'Laporan Anda telah berhasil dicatat dengan ID ASP-2026-9081.',
  });
  ```

### 5. Tailwind CSS v4 & Canonical Classes (`suggestCanonicalClasses`)

- **Strictly enforce canonical classes**: Never use arbitrary bracket classes when standard Tailwind v4 utilities or project tokens exist:
  - Use `min-h-dvh` instead of arbitrary `min-h-[100dvh]`.
  - Use `bg-background` (or semantic `bg-warm-100`) instead of arbitrary `bg-[#FAF5F0]`.
  - Use `text-2xs` (0.625rem / 10px) instead of arbitrary `text-[10px]`.
  - Use `text-xs-tight` (0.6875rem / 11px) instead of arbitrary `text-[11px]`.
  - Use project color tokens (`border-warm-200`, `bg-darknavy-900`, `text-accent-500`) instead of raw hex values (`border-[#e8dbcb]`, `bg-[#191b24]`).
- Design tokens and shadcn custom properties are mapped in `:root` and `@theme inline` in [`app/app.css`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/app.css).

### 6. Client-Side & Server-Side File Uploads (`URL.revokeObjectURL` & `upload.server.ts`)

- **Client-Side File Uploads & Memory Management**:
  - When handling image/document file uploads that produce preview URLs via `URL.createObjectURL(file)`:
  - Always verify whether an existing preview URL begins with `blob:`.
  - Safely revoke obsolete URLs using `URL.revokeObjectURL(url)` before creating a new one or upon file deletion.
  - This prevents browser memory leaks when citizens repeatedly browse or swap attachments.
- **Server-Side File Persistence (`app/lib/upload.server.ts`)**:
  - Validates avatar uploads strictly against allowed MIME types (`image/jpeg`, `image/png`, `image/webp`) and size limits (max 2MB).
  - Generates secure random UUID filenames to prevent collisions and path traversal attacks.
  - Persists files directly into `public/uploads/avatars/`.

### 7. Avoid Barrel Files (`bundle-barrel-imports`)

- **Do not create single re-export `index.ts` files** (e.g. `app/middleware/index.ts` or `app/db/schema/index.ts`).
- Consumers must import directly from module files:
  - `import { requestLogger } from '@/middleware/logger.server';`
  - `import { users } from '~/db/schema/schema';`
  - `import * as schema from './schema/schema';`
- This ensures maximum tree-shaking efficiency and avoids bundle bloat.

### 8. JSX & Conditional Rendering (`rendering-conditional-render`)

- Never use `&&` for conditional JSX rendering when the condition can be a number, string, or falsy primitive (`{count && <Badge />}` can render `0`).
- Always use explicit ternary expressions:
  ```tsx
  {
    error ? <ErrorMessage message={error} /> : null;
  }
  {
    stack ? (
      <pre>
        <code>{stack}</code>
      </pre>
    ) : null;
  }
  ```

### 9. TypeScript Best Practices (`typescript-advanced-types`)

- Avoid double unsafe casting (`globalThis as unknown as { ... }`).
- For global singletons, use ambient declarations:
  ```typescript
  declare global {
    var __postgresClient: postgres.Sql | undefined;
  }
  ```
- Use type guards (`instanceof`, `typeof`, discriminated unions) instead of unchecked type assertions:
  ```typescript
  const status = response instanceof Response ? response.status : 200;
  ```

### 10. Database & Drizzle ORM

- **No `DATABASE_URL`**: Never introduce monolithic connection strings. The project uses discrete environment variables:
  `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_HOST_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
- Drizzle schemas live in [`app/db/schema/`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/db/schema/) and are registered directly with the client in [`app/db/index.server.ts`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/db/index.server.ts).
- Migrations are generated into `app/db/migrations/` via `npm run db:generate` (`make db-generate`).
- Migrations support SSH tunneling for remote deployment:
  - Local migration: `make db-migrate` (or `npm run db:migrate`)
  - Remote migration over SSH: `make db-migrate ssh=true` (or `npm run db:migrate -- --ssh`)
  - SSH tunnel credentials use `SSH_*` and `SSH_POSTGRES_*` variables in `.env`.
- **Database Seeding & CSV Datasets**:
  - Master seeder: `npm run db:seed` (`make db-seed`).
  - Granular seeders: `npm run db:seed:admin`, `npm run db:seed:representatives`, `npm run db:seed:moderators` (all support `ssh=true`).
  - Source data for representatives and moderators are stored as CSV files in [`scripts/data/`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/scripts/data/) and parsed at runtime via [`scripts/csv.ts`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/scripts/csv.ts). Never maintain hardcoded array constants for tabular seed data.
- **Audit Logging Subsystem (`audit_logs`)**:
  - Administrative operations (status toggle, password reset, profile update, user deletion, user creation, avatar upload) are tracked in the `audit_logs` table.
  - Enumerated in `audit_action` enum: `STATUS_CHANGE`, `PASSWORD_RESET`, `PROFILE_UPDATE`, `USER_DELETE`, `USER_CREATE`, `AVATAR_UPLOAD`.
  - Captured via `createAuditLog()` in [`app/lib/audit.server.ts`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/lib/audit.server.ts) with JSONB `details` (before/after snapshots) wrapped in fail-safe try/catch so audit failures never break primary user actions.
- **Default User Password Policy (`DEFAULT_USER_PASSWORD`)**:
  - Passwords generated during user creation (`CreateUserDialog`) or password reset actions are strictly sourced from `process.env.DEFAULT_USER_PASSWORD`.
  - Never introduce insecure fallback passwords in application code. If `DEFAULT_USER_PASSWORD` is missing in the environment, the action must fail closed and return an explicit error notification.

### 11. Containerization, Compose & CI/CD

- Default local container engine is **Podman**.
- `compose.yaml` services: `postgres` service on top attached to `si-waday-net` network with persistent volume `postgres-data`.
- In repository `compose.yaml`, the `app` service is kept commented out for local database-only development, and uncommented on the VPS for full stack orchestration.
- **Full-Stack Container Architecture:** The application image (`Dockerfile`) uses `node:26.13.1-alpine` running `react-router-serve ./build/server/index.js` on port 3000 under `NODE_ENV=production`. Node.js acts as the native web server; do not bundle Nginx inside the container.
- **CI/CD Deployment:** Automated GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and publishes container images to GHCR (`ghcr.io/<repo>/app`) on release tags (`v*.*.*`) or manual dispatch, and deploys via SSH using Podman.
- Makefile supports switching engine:
  - Default: `make compose-up` / `make compose-down` (executes `podman compose`)
  - Docker: `make compose-up engine=docker` / `make compose-down engine=docker` (executes `docker compose`)

### 12. Minimalism & YAGNI (`ponytail`)

- Follow the simplicity ladder:
  1. Does this need to exist? (Skip speculative code).
  2. Does an existing helper/type in this repo solve it?
  3. Does standard library or native platform solve it?
  4. Does an installed package solve it?
  5. Shortest diff wins.
- Do not create empty boilerplate, placeholder types, or unrequested scaffolding.

### 13. Git Commits (`caveman-commit`)

- Follow Conventional Commits format: `<type>(<scope>): <summary>`
- Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`, `style`, `revert`.
- Imperative mood, ≤50-72 characters, no trailing period.
- No AI attribution, no filler. Body only for breaking changes or non-obvious rationale.

### 14. Form Validation & Zod Schemas (`app/schema/`)

- **Mandatory Zod Validation**: All application forms (authentication, user creation/modification, citizen aspirations, complaints) MUST be strictly validated using Zod schemas located in `app/schema/` (e.g., `app/schema/auth.ts`, `app/schema/user.ts`).
- **End-to-End Validation**:
  - **Server-Side**: Route `action` functions must validate raw `FormData` via `schema.safeParse()`. If invalid, return HTTP status 400 with structured `fieldErrors` (`{ [fieldName]: errorMessage }`).
  - **Client-Side**: Forms must validate on submit with `schema.safeParse()` for instant feedback and clear errors on input change.
- **Field-Level Error Rendering**:
  - Always render error messages directly at the bottom of the corresponding input field using `text-2xs font-semibold text-rose-500` (or `text-red-500`).
  - Highlight the input border when an error exists: `border-rose-500 focus-visible:ring-rose-500`.
  - Set `aria-invalid="true"` and `aria-describedby="<field>-error"` for accessibility.
  - Never rely solely on generic top banners or browser native tooltips (`noValidate` attribute recommended on `<Form>`).

---

## Verification & Quality Gates

Before pushing code or claiming completion, execute all quality gates:

```bash
# 1. Format with Prettier
npm run format
npm run format:check

# 2. Lint with ESLint 9
npm run lint

# 3. Type check React Router types & TypeScript
npm run typecheck

# 4. Production build check
npm run build
```
