# SI-WADAY

Wadah Aspirasi & Aduan Warga.

## Stack

- **Framework:** React Router v8.4 (Framework Mode)
- **UI & Styling:** React v19, Tailwind CSS v4, shadcn/ui, Lucide React
- **Database & ORM:** PostgreSQL 16, Drizzle ORM (`drizzle-orm`, `drizzle-kit`), `postgres` (Postgres.js)
- **Tooling:** Vite v8, TypeScript 5.9, ESLint 9, Prettier
- **Logging & Validation:** Winston logger, Zod
- **Infrastructure:** Docker & Docker Compose, SSH tunnel migration runner

---

## Project Structure

```text
.
├── app/
│   ├── components/        # UI components & domain presentation widgets
│   │   ├── admin/         # Admin dashboard widgets & tab panels
│   │   ├── aspiration/    # Multi-step aspiration & complaint form wizard
│   │   ├── home/          # Landing page sections (hero, feed, stats, faq, etc.)
│   │   ├── layout/        # Persistent navigation chrome (navbar, footer, admin-sidebar)
│   │   ├── shared/        # Cross-route reusable components
│   │   └── ui/            # shadcn/ui primitives (button, dialog, sonner, tooltip, etc.)
│   ├── constants/         # App-wide constants & datasets (tapin.ts, admin-data.ts, etc.)
│   ├── db/                # Database layer (PostgreSQL + Drizzle ORM)
│   │   ├── migrations/    # Generated SQL migration files
│   │   ├── schema/        # Drizzle table schemas
│   │   └── index.server.ts# Drizzle DB client instance
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Persistent layout shells with <Outlet /> (home-layout, admin-layout)
│   ├── lib/               # Utility functions (logger, cn helper, etc.)
│   ├── middleware/        # Server middlewares (request logger, auth, etc.)
│   ├── routes/            # Route modules (home.tsx, aspiration.tsx, admin.tsx)
│   ├── schema/            # Zod validation schemas
│   ├── types/             # Shared TypeScript interfaces & types
│   ├── app.css            # Tailwind v4 styles, theme tokens & shadcn variables
│   ├── root.tsx           # Root layout & HTML shell
│   └── routes.ts          # Route manifest configuration
├── public/                # Static public assets (icons, favicon, logos)
├── scripts/               # Migration & SSH tunnel scripts
│   ├── migrate.ts         # Migration runner (local & SSH)
│   └── tunnel.ts          # SSH port forwarder
├── compose.yaml           # Docker Compose (PostgreSQL 16 Alpine)
├── Dockerfile             # Multi-stage production container
├── drizzle.config.ts      # Drizzle ORM configuration
├── Makefile               # Development command shortcuts
├── package.json           # Dependencies and scripts
└── README.md
```

---

## Key Pages & Features

- **Beranda (`/`):**
  - Hero banner with quick navigation to citizen forms and ticket tracking.
  - Interactive ticket tracking section (`/#lacak-tiket`).
  - Recent public aspiration feed, real-time activity metrics, and FAQ accordion.
- **Formulir Aspirasi & Aduan Warga (`/aspiration`):**
  - **Langkah 1:** Validasi data pelapor dengan unggah bukti e-KTP.
  - **Langkah 2A (Aspirasi Dapil):** Pemilihan daerah pemilihan (Dapil), profil & foto anggota dewan DPRD Tapin, kamus usulan Pokir, alamat, dan penanda peta koordinat GPS.
  - **Langkah 2B (Aduan Masyarakat):** Laporan keluhan fasilitas umum dengan routing pengawasan Komisi DPRD dan bukti foto pendukung.
  - **Pasca-Kirim:** Survei Indeks Kepuasan Masyarakat (IKM) dan dialog bukti penerimaan tiket resmi.
- **Dashboard Admin & Statistik (`/dashboard`):**
  - Pusat kendali bento-grid untuk rekapitulasi KPI dan tren aduan warga.
  - Tabel filter dan pencarian untuk usulan Pokir dan aduan publik.
  - Modal inspeksi detail tiket, audit pergerakan status, dan analisis kepuasan masyarakat.

---

## Prerequisites

- **Node.js:** `v24.21.0` or newer
- **npm:** `v10` or newer
- **Docker & Docker Compose:** For running PostgreSQL locally
- **GNU Make:** Optional (for `make` shortcuts)

---

## How to Run This Project

### 1. Clone & Set Up Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Review `.env` and adjust database credentials if needed:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Local PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_HOST_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=si_waday
```

### 2. Start PostgreSQL Container

Start the local PostgreSQL service in the background:

```bash
# Default uses Podman:
make compose-up

# Or with Docker:
make compose-up engine=docker
# (or direct: docker compose up -d postgres)
```

### 3. Install Dependencies

```bash
npm install
# or using Makefile:
make install
```

### 4. Run Database Migrations

Apply the existing migrations to your local database:

```bash
npm run db:migrate
# or using Makefile:
make db-migrate
```

### 5. Start Development Server

```bash
npm run dev
# or using Makefile:
make dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

### 6. Production Build & Run

To build and run in production mode:

```bash
# Build client and server bundles
npm run build     # or: make build

# Start production server
npm run start     # or: make start
```

---

## Drizzle ORM Usage Guide

The project uses [Drizzle ORM](https://orm.drizzle.team/) with the `postgres` (Postgres.js) driver. Database configuration is driven by discrete `POSTGRES_*` environment variables in both `drizzle.config.ts` and `app/db/index.server.ts`.

### 1. Defining Schemas

Schemas are stored in `app/db/schema/`. For example, `app/db/schema/schema.ts`:

```typescript
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 2. Querying in Loaders and Actions

Import `db` from `~/db/index.server` and table definitions directly from `~/db/schema/schema`:

```typescript
// app/routes/users.tsx
import { eq } from 'drizzle-orm';
import { db } from '~/db/index.server';
import { users } from '~/db/schema/schema';

import type { Route } from './+types/users';

// Loader: Fetch data on the server
export async function loader({ request }: Route.LoaderArgs) {
  // Relational query syntax:
  const allUsers = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });

  return { users: allUsers };
}

// Action: Handle mutations (POST/PUT/DELETE)
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');

  const [newUser] = await db.insert(users).values({ name, email }).returning();

  return { user: newUser };
}
```

### 3. Migrations Workflow

#### Step A: Generate a migration

Whenever you add or modify a table in `app/db/schema/`:

```bash
npm run db:generate
# or:
make db-generate
```

This creates a new SQL migration in `app/db/migrations/` and updates the journal snapshot.

#### Step B: Apply migrations locally

Execute pending migrations against your local database:

```bash
npm run db:migrate
# or:
make db-migrate
```

#### Step C: Apply migrations over SSH tunnel (Remote / Staging / Production)

To run migrations directly on a remote server behind SSH without exposing PostgreSQL ports publicly:

1. Fill in the SSH variables in your `.env`:

   ```env
   SSH_HOST=203.0.113.10
   SSH_PORT=22
   SSH_USER=ubuntu
   SSH_PASSWORD=your_password       # or leave blank if using key / pageant
   SSH_KNOWN_HOSTS_FILE=

   SSH_POSTGRES_HOST=127.0.0.1
   SSH_POSTGRES_PORT=5432
   SSH_POSTGRES_DATABASE=si_waday_prod
   SSH_POSTGRES_USER=postgres
   SSH_POSTGRES_PASSWORD=secret
   SSH_POSTGRES_SSLMODE=disable
   ```

2. Run migration with the SSH flag:
   ```bash
   make db-migrate ssh=true
   # or with npm:
   npm run db:migrate -- --ssh
   ```

The runner opens an encrypted SSH tunnel, runs pending Drizzle migrations, and cleanly closes the connection upon completion.

### 4. Drizzle Studio

To visually inspect and manage database records:

```bash
npm run db:studio
# or:
make db-studio
```

Opens Drizzle Studio at **[https://local.drizzle.studio](https://local.drizzle.studio)** connected to your local database.

---

## Available Commands

| Command                                         | Makefile                            | Description                                  |
| :---------------------------------------------- | :---------------------------------- | :------------------------------------------- |
| `npm run dev`                                   | `make dev`                          | Start development server on port 5173        |
| `npm run build`                                 | `make build`                        | Build production client & server             |
| `npm run start`                                 | `make start`                        | Run production server                        |
| `npm run typecheck`                             | `make typecheck`                    | Run React Router typegen & TypeScript check  |
| `npm run lint`                                  | `make lint`                         | Run ESLint checks                            |
| `npm run lint:fix`                              | `make lint-fix`                     | Auto-fix ESLint issues                       |
| `npm run format`                                | `make format`                       | Format code with Prettier                    |
| `npm run format:check`                          | `make format-check`                 | Verify code formatting                       |
| `podman compose up -d` / `docker compose up -d` | `make compose-up [engine=docker]`   | Start PostgreSQL container (default: podman) |
| `podman compose down` / `docker compose down`   | `make compose-down [engine=docker]` | Stop PostgreSQL container (default: podman)  |
| `npm run db:generate`                           | `make db-generate`                  | Generate Drizzle migration files             |
| `npm run db:migrate`                            | `make db-migrate`                   | Apply migrations to local DB                 |
| `npm run db:migrate -- --ssh`                   | `make db-migrate ssh=true`          | Apply migrations via SSH tunnel              |
| `npm run db:push`                               | `make db-push`                      | Push schema directly without migration files |
| `npm run db:studio`                             | `make db-studio`                    | Open Drizzle Studio UI                       |
