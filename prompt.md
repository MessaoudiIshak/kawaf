# 🏗️ KAWAF PROJECT - COMPLETE ARCHITECTURE & CODE STATE

## 📋 Project Overview
- **Project Name:** Kawaf (Cat Café Website)
- **Framework:** Next.js 16.0.8 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS v4
- **Authentication:** bcrypt + jsonwebtoken (JWT)

---

## 📁 Project Structure

```
kawaf/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Admin user seeding script
│   └── migrations/
│       └── 20251210130002_init_enums_and_models/
│           └── migration.sql  # Initial migration
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles (Tailwind)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (default Next.js template)
│   │   └── api/
│   │       ├── animals/
│   │       │   ├── route.ts   # ✅ GET (all), POST
│   │       │   └── [id]/
│   │       │       └── route.ts # ✅ GET, PUT, DELETE
│   │       ├── menu/
│   │       │   ├── route.ts   # ✅ GET (all), POST
│   │       │   └── [id]/
│   │       │       └── route.ts # ✅ GET, PUT, DELETE
│   │       ├── events/
│   │       │   ├── route.ts   # ✅ GET (all), POST
│   │       │   └── [id]/
│   │       │       └── route.ts # ✅ GET, PUT, DELETE
│   │       └── user/
│   │           ├── route.ts   # (empty placeholder)
│   │           └── login/
│   │               └── route.ts # ✅ POST (JWT login)
│   ├── lib/
│   │   ├── auth-guard.ts      # ✅ JWT verification helper (getAuthStatus)
│   │   └── prisma.ts          # ✅ Prisma client singleton
│   └── types/
│       └── types.ts           # ✅ Shared TypeScript interfaces
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── SCHEMA_DOCUMENTATION.md
```

---

## 📦 Dependencies (package.json)

```json
{
  "name": "kawaf",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "seed": "tsx prisma/seed.ts"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^6.19.0",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.3",
    "next": "16.0.8",
    "react": "19.2.1",
    "react-dom": "19.2.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/bcrypt": "^6.0.0",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.0.8",
    "prisma": "^6.19.0",
    "tailwindcss": "^4",
    "tsx": "^4.21.0",
    "typescript": "^5"
  }
}
```

---

## 🗄️ Database Schema (prisma/schema.prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ENUMS
enum Role {
  ADMIN
  USER
}

enum Sex {
  MALE
  FEMALE
}

// 1. User Model (Admin Login)
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // HASHED password
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 2. MenuItem Model (Cafe Menu)
model MenuItem {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String?
  price       Decimal  @db.Decimal(6, 2)
  photoUrl    String?
  popularity  Int      @default(0)
  isAvailable Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 3. Animal Model (Adoption/Gallery)
model Animal {
  id          Int      @id @default(autoincrement())
  name        String
  photoUrl    String?
  age         Int?
  weight      Float?
  sex         Sex?
  temperament String?
  story       String?
  isAdopted   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 4. Event Model
model Event {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  date        DateTime
  photoUrl    String?
  location    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## ✅ Implemented Code

### 1. Prisma Client Singleton (src/lib/prisma.ts)

```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : [],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
```

### 2. Auth Guard Helper (src/lib/auth-guard.ts)

```typescript
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

export interface DecodedToken {
  role: Role;
  email: string;
  iat: number;
  exp: number;
}

export interface AuthStatus {
  isAuth: boolean;
  role: Role | 'none';
}

export async function getAuthStatus(request: NextRequest): Promise<AuthStatus> {
  const authHeader = request.headers.get('authorization');
  const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

  const noneState: AuthStatus = {
    isAuth: false,
    role: 'none',
  };

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return noneState;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return {
      isAuth: true,
      role: decoded.role,
    };
  } catch (error) {
    return noneState;
  }
}
```

### 3. Admin Seeding Script (prisma/seed.ts)

```typescript
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  const adminEmail = 'admin@kawaf.fr';
  const adminPassword = process.env.ADMIN_PASSWORD!;
  
  if (!adminPassword) {
    throw new Error("Missing ADMIN_PASSWORD in .env!");
  }

  const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin user seeded with ID: ${adminUser.id}`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 4. Types (src/types/types.ts)

```typescript
export type Context = {
  params: Promise<{ id: string }>;
};
```

### 5. Root Layout (src/app/layout.tsx)

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

### 6. Global CSS (src/app/globals.css)

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

### 7. Home Page (src/app/page.tsx) - Default Next.js Template

```tsx
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        {/* ... default Next.js template content ... */}
      </main>
    </div>
  );
}
```

---

## 🔴 APIs TO IMPLEMENT (Remaining)

| Endpoint | File | HTTP Methods | Purpose |
|----------|------|--------------|---------|
| `/api/user` | `src/app/api/user/route.ts` | POST | Create new user (optional) |

---

## ✅ IMPLEMENTED APIs

All API routes use JWT-based authorization via `getAuthStatus()` from `@/lib/auth-guard`.

### Role-Based Access Control

| Role | GET (list) | GET (single) | POST/PUT/DELETE |
|------|------------|--------------|-----------------|
| `ADMIN` | All records | ✅ Allowed | ✅ Allowed |
| `STAFF` | All records | ✅ Allowed | ✅ Allowed |
| `USER` | Filtered | ✅ Allowed | ✅ Allowed |
| `none` (public) | Filtered | ✅ Allowed | ❌ 401 Unauthorized |

### Filter Rules for GET (list)

| Resource | ADMIN/STAFF | USER/Public |
|----------|-------------|-------------|
| Animals | All animals | `{ isAdopted: false }` |
| Menu | All items | `{ isAvailable: true }` |
| Events | All events | `{ date: { gte: 7 days ago } }` |

### Implemented Endpoints

| Endpoint | Methods | Status |
|----------|---------|--------|
| `/api/animals` | GET, POST | ✅ Complete |
| `/api/animals/[id]` | GET, PUT, DELETE | ✅ Complete |
| `/api/menu` | GET, POST | ✅ Complete |
| `/api/menu/[id]` | GET, PUT, DELETE | ✅ Complete |
| `/api/events` | GET, POST | ✅ Complete |
| `/api/events/[id]` | GET, PUT, DELETE | ✅ Complete |
| `/api/user/login` | POST | ✅ Complete |

**Note:** Menu Items now use `Prisma.Decimal` for price fields to ensure precision.

---

## 🎯 Project Purpose

**Kawaf** is a **Cat Café website** with these features:

1. **Menu Management** - Display café menu items with prices and availability
2. **Animal Adoption Gallery** - Show cats available for adoption with details (name, age, weight, sex, temperament, story)
3. **Events Calendar** - Display upcoming café events with date, location, description
4. **Admin Panel** - Secure admin login to manage all content (CRUD operations)

---

## 🔧 Environment Variables Required

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kawaf"
ADMIN_PASSWORD="your-secure-password-for-seeding"
JWT_SECRET="your-jwt-secret-for-authentication"
```

---

## 📝 What Needs To Be Built

### Backend (Remaining):
1. **User Registration API** (`/api/user`) - Optional POST endpoint to create new users (protected)

### Frontend Pages:
1. **Home Page** - Landing page with café info (replace default template)
2. **Menu Page** - Display café menu items
3. **Animals/Adoption Page** - Gallery of adoptable cats
4. **Events Page** - List of upcoming events
5. **Admin Dashboard** - Login page + CRUD management interface

---

## 🛠️ Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed admin user
npm run seed

# Build for production
npm run build
```

---

## 📚 Schema Documentation (French)

### Table: User
| Attribut | Description |
|----------|-------------|
| id | Identifiant unique auto-généré |
| email | Adresse e-mail unique |
| password | Mot de passe haché (bcrypt) |
| role | ADMIN ou USER |
| createdAt | Date de création |
| updatedAt | Date de modification |

### Table: MenuItem
| Attribut | Description |
|----------|-------------|
| id | Identifiant unique |
| name | Nom unique de l'élément |
| description | Description optionnelle |
| price | Prix (format: 0.00) |
| photoUrl | URL de la photo |
| popularity | Compteur de popularité |
| isAvailable | Disponibilité |

### Table: Animal
| Attribut | Description |
|----------|-------------|
| id | Identifiant unique |
| name | Nom de l'animal |
| photoUrl | URL de la photo |
| age | Âge en années |
| weight | Poids en kg |
| sex | MALE ou FEMALE |
| temperament | Caractère |
| story | Histoire/description |
| isAdopted | Statut d'adoption |

### Table: Event
| Attribut | Description |
|----------|-------------|
| id | Identifiant unique |
| title | Titre de l'événement |
| description | Description détaillée |
| date | Date et heure |
| photoUrl | URL de la photo |
| location | Lieu |

---

**Backend API implementation is complete. Next step: build the frontend pages.**
