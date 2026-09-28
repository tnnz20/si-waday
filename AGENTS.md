# Agent Instructions

## Repository

- **Project:** `si-waday` (Wadah Aspirasi & Aduan Warga).
- **Architecture:** Full-stack React Router v8.4 in Framework Mode, powered by Vite v8, React 19, and Tailwind CSS v4.
- **Runtime:** Node.js `>=24.0.0` (Alpine container runtime: `node:24-alpine`).
- **Database:** PostgreSQL 16 (Alpine) via discrete credentials and Drizzle ORM (`postgres` driver).

---

## Directory Structure & Responsibilities

```text
.
├── app/
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitive components (button, dialog, input, etc.)
│   │   ├── layout/            # App-wide layouts (navbar, sidebar, footer)
│   │   └── shared/            # Reusable UI components shared across 2+ routes
│   ├── constants/             # Static constants (APP_NAME, APP_DESCRIPTION, etc.)
│   ├── db/
│   │   ├── migrations/        # Generated SQL migrations and metadata snapshots
│   │   ├── schema/            # Drizzle table schema definitions (*.ts)
│   │   └── index.server.ts    # Drizzle client singleton with discrete credentials
│   ├── hooks/                 # Custom React client hooks
│   ├── lib/                   # Utility helpers (cn(), logger.server.ts, etc.)
│   ├── middleware/            # React Router 8 server middlewares (logger.server.ts, auth, etc.)
│   ├── routes/                # Route modules (loaders, actions, page components)
│   ├── schema/                # Zod validation schemas
│   ├── types/                 # Shared TypeScript interfaces & types
│   ├── app.css                # Tailwind CSS v4 imports & theme tokens
│   ├── root.tsx               # Root document layout, HTML shell, and global middleware
│   └── routes.ts              # Route manifest & URL configuration
├── scripts/
│   ├── migrate.ts             # Programmatic migration runner (supports local & SSH tunnel)
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

- Define all routes in [`app/routes.ts`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/routes.ts) using `@react-router/dev/routes` helpers (`index`, `route`, `layout`, `prefix`).
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
- Use `useNavigation().state` in [`app/root.tsx`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/root.tsx) for page transition indicators.
- Use `HydrateFallback` for routes requiring client-side initialization skeletons.

### 2. Components Organization

- **`app/components/ui/`**: Reserved exclusively for shadcn/ui primitives. Standard shadcn primitives use `React.forwardRef` and are excluded from React 19 ref refactorings.
- **`app/components/layout/`**: Layout blocks (Navbar, Sidebar, Footer, Breadcrumbs).
- **`app/components/shared/`**: Reusable custom components utilized by two or more pages.
- **Single-page components**: If a component is only used by one route, keep it adjacent to that route in `app/routes/` or a subfolder within `app/routes/`.

### 3. Avoid Barrel Files (`bundle-barrel-imports`)

- **Do not create single re-export `index.ts` files** (e.g. `app/middleware/index.ts` or `app/db/schema/index.ts`).
- Consumers must import directly from module files:
  - `import { requestLogger } from '@/middleware/logger.server';`
  - `import { users } from '~/db/schema/schema';`
  - `import * as schema from './schema/schema';`
- This ensures maximum tree-shaking efficiency and avoids bundle bloat.

### 4. JSX & Conditional Rendering (`rendering-conditional-render`)

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

### 5. TypeScript Best Practices (`typescript-advanced-types`)

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

### 6. Database & Drizzle ORM

- **No `DATABASE_URL`**: Never introduce monolithic connection strings. The project uses discrete environment variables:
  `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_HOST_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
- Drizzle schemas live in [`app/db/schema/`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/db/schema/) and are registered directly with the client in [`app/db/index.server.ts`](file:///c:/Users/tnnz/Documents/projects/freelancer/si-waday/app/db/index.server.ts).
- Migrations are generated into `app/db/migrations/` via `npm run db:generate` (`make db-generate`).
- Migrations support SSH tunneling for remote deployment:
  - Local migration: `make db-migrate` (or `npm run db:migrate`)
  - Remote migration over SSH: `make db-migrate ssh=true` (or `npm run db:migrate -- --ssh`)
  - SSH tunnel credentials use `SSH_*` and `SSH_POSTGRES_*` variables in `.env`.

### 7. Containerization & Compose

- Default container engine is **Podman**.
- `compose.yaml` services: `postgres` service on top attached to `si-waday-net` network with persistent volume `postgres-data`.
- Makefile supports switching engine:
  - Default: `make compose-up` / `make compose-down` (executes `podman compose`)
  - Docker: `make compose-up engine=docker` / `make compose-down engine=docker` (executes `docker compose`)

### 8. Minimalism & YAGNI (`ponytail`)

- Follow the simplicity ladder:
  1. Does this need to exist? (Skip speculative code).
  2. Does an existing helper/type in this repo solve it?
  3. Does standard library or native platform solve it?
  4. Does an installed package solve it?
  5. Shortest diff wins.
- Do not create empty boilerplate, placeholder types, or unrequested scaffolding.

### 9. Git Commits (`caveman-commit`)

- Follow Conventional Commits format: `<type>(<scope>): <summary>`
- Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`, `style`, `revert`.
- Imperative mood, ≤50-72 characters, no trailing period.
- No AI attribution, no filler. Body only for breaking changes or non-obvious rationale.

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
