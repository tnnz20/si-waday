# SI-WADAY

Wadah Aspirasi & Aduan Warga.

## Stack

- **Framework:** React Router v8.5 (Framework Mode)
- **UI, Maps & Styling:** React v19, Tailwind CSS v4, shadcn/ui, Lucide React, Leaflet (`leaflet`)
- **Database & ORM:** PostgreSQL 16, Drizzle ORM (`drizzle-orm`, `drizzle-kit`), `postgres` (Postgres.js)
- **Tooling & Testing:** Vite v8, TypeScript 5.9, ESLint 9, Prettier, Node.js test runner (`tsx --test`)
- **Logging & Validation:** Winston logger, Zod
- **Infrastructure:** Podman / Docker Compose, SSH tunnel migration runner

---

## Project Structure

```text
.
├── app/
│   ├── components/        # UI components & domain presentation widgets
│   │   ├── dashboard/     # Dashboard domain widgets (admin overview, tabs, user actions/modals)
│   │   ├── aspiration/    # Multi-step aspiration & complaint form wizard
│   │   ├── home/          # Landing page sections (hero, feed, stats, faq, etc.)
│   │   ├── layout/        # Persistent navigation chrome (navbar, footer, admin-sidebar)
│   │   │   └── admin-sidebar/ # Modular sidebar subcomponents (header, nav, user-menu, types)
│   │   ├── shared/        # Cross-route reusable components (table-pagination, etc.)
│   │   └── ui/            # shadcn/ui primitives (button, dialog, sonner, tooltip, etc.)
│   ├── constants/         # App-wide constants & datasets (tapin.ts, admin-data.ts, etc.)
│   ├── db/                # Database layer (PostgreSQL + Drizzle ORM)
│   │   ├── migrations/    # Generated SQL migration files
│   │   ├── schema/        # Drizzle table schemas
│   │   └── index.server.ts# Drizzle DB client instance
│   ├── hooks/             # Custom React hooks (use-ticket-survey.ts)
│   ├── layouts/           # Persistent layout shells with <Outlet /> (home-layout, form-layout, admin-layout, auth-layout)
│   ├── lib/               # Helpers (logger, cn helper, auth, upload, audit, ticket.server, ticket-form, image-compressor, map-utils)
│   ├── middleware/        # Server middlewares (request logger, etc.)
│   ├── routes/            # Route modules (home, form/*, auth/*, dashboard/*, dashboard/users/*)
│   ├── schema/            # Zod validation schemas (auth.ts, form.ts, user.ts)
│   ├── types/             # Shared TypeScript interfaces & types
│   ├── app.css            # Tailwind v4 styles, theme tokens & shadcn variables
│   ├── root.tsx           # Root layout & HTML shell
│   └── routes.ts          # Route manifest configuration
├── public/                # Static assets & uploads (avatars/, ktp/, photos/, documents/)
├── scripts/               # Migration, seeding & utility scripts
│   ├── data/              # Datasets for seeding (dprd-tapin-members.csv, moderators.csv)
│   ├── csv.ts             # Native CSV parser utility
│   ├── db.ts              # Database connection helper for standalone scripts
│   ├── migrate.ts         # Migration runner (local & SSH)
│   ├── seed.ts            # Master database seeder
│   ├── seed-admin.ts      # Super admin seeder
│   ├── seed-moderators.ts # Regional moderators seeder (CSV)
│   ├── seed-representatives.ts # DPRD & DPR RI representatives seeder (CSV)
│   ├── seed-tickets.ts    # Sample citizen tickets & CSAT feedbacks seeder
│   └── tunnel.ts          # SSH port forwarder
├── tests/                 # Automated unit & integration tests (tsx --test)
├── compose.yaml           # Podman / Docker Compose (PostgreSQL 16 Alpine)
├── Dockerfile             # Multi-stage production container
├── drizzle.config.ts      # Drizzle ORM configuration
├── Makefile               # Developer task automation
├── package.json           # Dependencies and scripts
└── README.md
```

---

## Key Pages & Features

- **Beranda (`/`):**
  - Hero banner with quick navigation to citizen forms and ticket tracking.
  - Interactive ticket tracking section (`/#lacak-tiket`).
  - Recent public aspiration feed, real-time activity metrics, and FAQ accordion.
- **Formulir Aspirasi Dapil DPRD (`/form/aspiration`):**
  - **Langkah 1:** Validasi identitas pelapor dengan unggah & kompresi bukti e-KTP/PDF.
  - **Langkah 2:** Pemilihan daerah pemilihan (Dapil), profil & foto anggota dewan DPRD Tapin, kamus usulan Pokir, peta interaktif Leaflet dengan batas wilayah Kabupaten Tapin (`MapPicker`), dokumen proposal opsional, dan unggah multi-foto dokumentasi (`PhotoDropzone` dengan kompresi otomatis).
  - **Pasca-Kirim:** Penerbitan tiket `ASP-2026-XXXX`, survei Indeks Kepuasan Masyarakat (IKM) via `FeedbackAlertDialog`, lalu navigasi ke halaman bukti registrasi resmi (`/form/success/:ticketNumber`).
- **Formulir Aduan Masyarakat (`/form/complaint`):**
  - **Langkah 1:** Validasi identitas pelapor dengan unggah & kompresi bukti e-KTP/PDF.
  - **Langkah 2:** Laporan keluhan fasilitas umum dengan routing pengawasan Komisi DPRD, peta interaktif Leaflet (`MapPicker`), multi-foto bukti kejadian, dan dokumen lampiran opsional.
  - **Pasca-Kirim:** Penerbitan tiket `ADU-2026-XXXX`, survei IKM, lalu tanda terima resmi di `/form/success/:ticketNumber`.
- **Bukti Registrasi Tiket (`/form/success/:ticketNumber`):**
  - Tanda terima publik dengan proyeksi data aman (NIK disamarkan di server, tanpa mengekspos kontak/dokumen KTP pribadi), status tindak lanjut awal, hasil survei IKM, salin nomor tiket, serta cetak/simpan PDF.
- **Dashboard Admin & Statistik (`/dashboard`):**
  - Pusat kendali bento-grid untuk rekapitulasi KPI dan tren aduan warga.
  - Tabel filter dan pencarian untuk usulan Pokir (`/dashboard/aspirations`) dan aduan publik (`/dashboard/complaints`) _(sementara masih menggunakan data mock `MOCK_ADMIN_TICKETS`)_, serta analitik CSAT/IKM langsung dari `ticket_feedbacks` (`/dashboard/satisfaction`).
  - Modal inspeksi detail tiket, audit pergerakan status, unduh dokumen lampiran, dan riwayat survei multi-tahap.
- **Manajemen Pengguna Dewan & Moderator (`/dashboard/users/legislators` & `/dashboard/users/moderators`):**
  - **Kelola Anggota Dewan:** Tabel 7 kolom terpisah (_Anggota Dewan_, _Tingkat_, _Partai_, _Dapil_, _Komisi_, _Status_, _Aksi_) lengkap dengan identitas visual resmi partai politik, badge Dapil (Tapin 1, 2, 3 & DPR RI Kalsel 1), filter komisi, dan status aktif/nonaktif.
  - **Kelola Moderator:** Pemantauan akun moderator wilayah per kecamatan se-Kabupaten Tapin.
  - **Tambah Pengguna Baru:** Dialog pendaftaran pengguna (`CreateUserDialog`) dengan pembuatan slug otomatis, validasi unik email, dan hashing kata sandi aman berbasis `DEFAULT_USER_PASSWORD`.
  - **Halaman Detail Pengguna (`/dashboard/users/*/:slug`):** Formulir edit profil, unggah foto avatar server-side dengan preview dan proteksi kebocoran memori (`URL.revokeObjectURL`), reset kata sandi instan, serta riwayat audit lengkap (_audit trail_) via tabel `audit_logs`.
  - **Kontrol Paginasi Interaktif (`TablePagination`):** Navigasi halaman tabel responsif dengan tombol numerik, ellipsis, dan indikator rentang data aktif (e.g. _Menampilkan 1-10 dari 36 dewan_).
- **Otentikasi Administrator (`/auth/login`):**
  - Sesi login aman berbasis JSON Web Token (JWT) dengan cookie HTTP-only secure (`si_waday_token`).
  - Proteksi server middleware otomatis untuk seluruh rute `/dashboard/*`.

---

## Prerequisites

- **Node.js:** `v24.0.0` or newer
- **npm:** `v10` or newer
- **Podman / Docker & Docker Compose:** For running PostgreSQL locally
- **GNU Make:** Optional (for `make` shortcuts)

---

## How to Run This Project

### 1. Clone & Set Up Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Review `.env` and adjust database credentials, JWT secret, and seed/default user passwords if needed:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# JWT Configuration (min 32 chars)
JWT_SECRET=super-secret-jwt-key-min-32-chars-long-siwaday-2026

# Super Admin Seed Configuration
ADMIN_EMAIL=admin@siwaday.tapinkab.go.id
ADMIN_PASSWORD=admin123
ADMIN_NAME=Administrator Si-Waday

# Default User Password for Created & Password-Reset Accounts
DEFAULT_USER_PASSWORD=Tapin2026!

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

### 5. Seed Initial Data (Optional)

Populate default administrative accounts, regional moderators, legislative representatives (DPRD & DPR RI), and sample citizen tickets/feedbacks:

```bash
npm run db:seed
# or using Makefile:
make db-seed
```

> [!TIP]
> You can also seed individual datasets via `make db-seed-admin`, `make db-seed-representatives`, `make db-seed-moderators`, or `make db-seed-tickets`.

### 6. Start Development Server

```bash
npm run dev
# or using Makefile:
make dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

### 7. Production Build & Run

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

### 5. Database Seeding & Datasets

Initial data (super admin, moderators, and legislative representatives) can be seeded into the database using TSX scripts that ingest datasets from CSV files:

- **Master Seeder (All Tables):**
  ```bash
  npm run db:seed
  # or using Makefile:
  make db-seed
  # or over remote SSH tunnel:
  make db-seed ssh=true
  ```
- **Granular Seeders:**
  ```bash
  npm run db:seed:admin            # make db-seed-admin
  npm run db:seed:representatives  # make db-seed-representatives
  npm run db:seed:moderators       # make db-seed-moderators
  npm run db:seed:tickets          # make db-seed-tickets
  ```

Datasets are cleanly managed as CSV files inside [`scripts/data/`](scripts/data/) (`dprd-tapin-members.csv` and `moderators.csv`) and parsed at runtime via [`scripts/csv.ts`](scripts/csv.ts).

---

## Available Commands

| Command                                         | Makefile                                  | Description                                   |
| :---------------------------------------------- | :---------------------------------------- | :-------------------------------------------- |
| `npm run dev`                                   | `make dev`                                | Start development server on port 5173         |
| `npm run build`                                 | `make build`                              | Build production client & server              |
| `npm run start`                                 | `make start`                              | Run production server                         |
| `npm test`                                      | `make test`                               | Run unit and integration tests (`tsx --test`) |
| `npm run typecheck`                             | `make typecheck`                          | Run React Router typegen & TypeScript check   |
| `npm run lint`                                  | `make lint`                               | Run ESLint checks                             |
| `npm run lint:fix`                              | `make lint-fix`                           | Auto-fix ESLint issues                        |
| `npm run format`                                | `make format`                             | Format code with Prettier                     |
| `npm run format:check`                          | `make format-check`                       | Verify code formatting                        |
| `podman compose up -d` / `docker compose up -d` | `make compose-up [engine=docker]`         | Start PostgreSQL container (default: podman)  |
| `podman compose down` / `docker compose down`   | `make compose-down [engine=docker]`       | Stop PostgreSQL container (default: podman)   |
| `npm run db:generate`                           | `make db-generate`                        | Generate Drizzle migration files              |
| `npm run db:migrate`                            | `make db-migrate`                         | Apply migrations to local DB                  |
| `npm run db:migrate -- --ssh`                   | `make db-migrate ssh=true`                | Apply migrations via SSH tunnel               |
| `npm run db:seed`                               | `make db-seed [ssh=true]`                 | Run full database seeding workflow            |
| `npm run db:seed:admin`                         | `make db-seed-admin [ssh=true]`           | Seed Super Admin account from `.env`          |
| `npm run db:seed:representatives`               | `make db-seed-representatives [ssh=true]` | Seed regions & legislators from CSV           |
| `npm run db:seed:moderators`                    | `make db-seed-moderators [ssh=true]`      | Seed regional moderators from CSV             |
| `npm run db:seed:tickets`                       | `make db-seed-tickets [ssh=true]`         | Seed sample citizen tickets & feedbacks       |
| `npm run db:push`                               | `make db-push`                            | Push schema directly without migration files  |
| `npm run db:studio`                             | `make db-studio`                          | Open Drizzle Studio UI                        |

---

## CI/CD & Deployment (GitHub Actions)

The repository includes an automated deployment workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that builds a production Docker image, pushes it to GitHub Container Registry (GHCR), and deploys it to your VPS over SSH.

### 1. Deployment Triggers

- **Git Tag:** Pushing any release tag matching `v*.*.*` (e.g. `v1.0.0`).
- **Manual Dispatch:** In the GitHub repository, navigate to **Actions** > **Deploy Application** > **Run workflow** (specifying optional version tag).

### 2. Required GitHub Repository Secrets

Configure the following secrets in **Settings** > **Secrets and variables** > **Actions**:

| Secret           | Description                             | Example                                  |
| :--------------- | :-------------------------------------- | :--------------------------------------- |
| `SSH_HOST`       | VPS IP address or domain                | `203.0.113.10`                           |
| `SSH_PORT`       | SSH port (defaults to 22)               | `22`                                     |
| `SSH_USER`       | SSH user                                | `ubuntu`                                 |
| `SSH_KEY`        | SSH private key (Ed25519 or RSA)        | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SSH_PASSPHRASE` | _(Optional)_ SSH private key passphrase |                                          |
| `DEPLOY_PATH`    | Deployment path on the remote VPS       | `/opt/si-waday`                          |

### 3. VPS Setup Instructions

On the remote server:

1. Clone or copy the repository to `DEPLOY_PATH` (e.g., `/opt/si-waday`).
2. Set up your production `.env` file with discrete `POSTGRES_*` credentials and `NODE_ENV=production`.
3. In `compose.yaml`, uncomment the `app` service block to enable the application container.
4. The deployment workflow will automatically:
   - Pull the new container image (`ghcr.io/<owner>/si-waday/app:<tag>`) via `podman compose`.
   - Gracefully restart the `app` container via `podman compose`.
   - Clean up dangling images (`podman image prune -f`).
