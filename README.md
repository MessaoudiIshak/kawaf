# Kawaf - Animal Adoption & Restaurant Management Platform

This is a [Next.js](https://nextjs.org) full-stack application bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It combines restaurant menu management with an animal adoption platform.

## 📋 Project Overview

Kawaf is a comprehensive web application that manages:
- **Restaurant Menu** - Display and manage menu items with pricing and availability
- **Animal Adoption** - Showcase animals available for adoption with detailed profiles
- **Events** - Create and manage community events
- **Admin Panel** - Secure admin authentication and management features

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16 with React 19 and TypeScript
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Styling**: Tailwind CSS
- **Linting**: ESLint

### Project Structure
```
kawaf/
├── src/
│   └── app/
│       ├── api/                 # API endpoints
│       │   ├── animals/         # Animal CRUD endpoints
│       │   ├── blog/            # Blog post CRUD endpoints
│       │   ├── events/          # Event management endpoints
│       │   ├── menu/            # Menu item CRUD endpoints
│       │   └── user/            # User authentication endpoints
│       ├── (public)/            # Public routes
│       │   ├── layout.tsx       # Public layout (Navbar + Footer)
│       │   └── page.tsx         # Vitrine: Hero, Menu, Cats, Events, Blog
│       ├── (auth)/              # Authentication routes
│       │   ├── layout.tsx       # Auth layout (center-box)
│       │   └── login/
│       │       └── page.tsx     # Login form
│       ├── (dashboard)/         # Dashboard routes (Auth Guard)
│       │   ├── layout.tsx       # Dashboard layout (Sidebar navigation)
│       │   └── dashboard/
│       │       ├── page.tsx     # Overview/Stats
│       │       ├── animals/page.tsx    # Manage Cats (Table)
│       │       ├── menu/page.tsx       # Manage Menu (Table)
│       │       ├── events/page.tsx     # Manage Events (Table)
│       │       └── blog/page.tsx       # Manage Blog Posts (Table)
│       ├── globals.css          # Global styles
│       └── layout.tsx           # Root layout
│   ├── lib/
│   │   ├── auth-guard.ts        # JWT authentication helper
│   │   └── prisma.ts            # Prisma client singleton
│   └── types/
│       └── types.ts             # Shared TypeScript interfaces
├── prisma/
│   ├── schema.prisma            # Database schema definition
│   └── migrations/              # Database migrations
├── public/                      # Static assets
├── package.json                 # Project dependencies
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── .env                         # Environment variables (local)
```

### Database Schema

The application uses 5 main models:

1. **User** - Admin user accounts with role-based access (ADMIN/USER)
2. **MenuItem** - Restaurant menu items with pricing and availability
3. **Animal** - Animals available for adoption with details and adoption status
4. **Event** - Community events with date, location, and description
5. **BlogPost** - Blog articles with publication status and author information

For detailed schema documentation, see [SCHEMA_DOCUMENTATION.md](./SCHEMA_DOCUMENTATION.md)

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **PostgreSQL** 12+ (running locally or via Docker)
- **Git** for version control

### Step 1: Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/MessaoudiIshak/kawaf.git
cd kawaf

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Step 2: Setup Database

#### Option A: Local PostgreSQL
Ensure PostgreSQL is running on your machine, then create a database:
```bash
createdb kawaf
```

#### Option B: Docker (Recommended)
```bash
docker run --name kawaf-db -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=kawaf -p 5432:5432 -d postgres:latest
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):
```bash
DATABASE_URL="postgresql://admin:admin@localhost:5432/kawaf?schema=public"
```

**Note**: Update the connection string with your PostgreSQL credentials if different.

### Step 4: Setup Database Schema
Run Prisma migrations to create tables and structure:
```bash
npx prisma migrate dev
```

This will:
- Create all tables in PostgreSQL
- Generate Prisma Client for database access

### Step 5: (Optional) Seed Database
If a seed script exists, populate initial data:
```bash
npm run seed
```

### Step 6: Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

```bash
npm run dev      # Start development server (with auto-reload)
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint code validation
npm run seed     # Seed database with initial data
```

## 🗄️ Database Management

### View Database in Prisma Studio (GUI)
```bash
npx prisma studio
```
This opens a web interface to view and edit your database at [http://localhost:5555](http://localhost:5555)

### Generate Prisma Client
After schema changes:
```bash
npx prisma generate
```

### Reset Database (Warning: Deletes all data)
```bash
npx prisma migrate reset
```

## 📚 API Endpoints

All endpoints use JWT-based authorization via the `Authorization: Bearer <token>` header.

### Role-Based Access Control

| Role | Description |
|------|-------------|
| `ADMIN` | Full access to all resources |
| `STAFF` | Full access to all resources |
| `USER` | Can create/update/delete, but sees filtered GET results |
| `none` | Public/unauthenticated - read-only with filters |

### Animals
| Method | Endpoint | Access | Notes |
|--------|----------|--------|-------|
| `GET` | `/api/animals` | Public | ADMIN/STAFF see all; others see only `isAdopted: false` |
| `GET` | `/api/animals/:id` | Public | Everyone can view a single animal |
| `POST` | `/api/animals` | Authenticated | Requires USER, STAFF, or ADMIN role |
| `PUT` | `/api/animals/:id` | Authenticated | Requires USER, STAFF, or ADMIN role |
| `DELETE` | `/api/animals/:id` | Authenticated | Requires USER, STAFF, or ADMIN role |

### Menu
| Method | Endpoint | Access | Notes |
|--------|----------|--------|-------|
| `GET` | `/api/menu` | Public | ADMIN/STAFF see all; others see only `isAvailable: true` |
| `GET` | `/api/menu/:id` | Public | Everyone can view a single item |
| `POST` | `/api/menu` | Authenticated | Requires USER, STAFF, or ADMIN role |
| `PUT` | `/api/menu/:id` | Authenticated | Requires USER, STAFF, or ADMIN role |
| `DELETE` | `/api/menu/:id` | Authenticated | Requires USER, STAFF, or ADMIN role |

### Events
| Method | Endpoint | Access | Notes |
|--------|----------|--------|-------|
| `GET` | `/api/events` | Public | ADMIN/STAFF see all; others see events from last 7 days onwards |
| `GET` | `/api/events/:id` | Public | Everyone can view a single event |
| `POST` | `/api/events` | Authenticated | Requires USER, STAFF, or ADMIN role |
| `PUT` | `/api/events/:id` | Authenticated | Requires USER, STAFF, or ADMIN role |
| `DELETE` | `/api/events/:id` | Authenticated | Requires USER, STAFF, or ADMIN role |

### Frontend Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Public vitrine with menu, cats, events, blog sections | No |
| `/login` | User login page | No |
| `/dashboard` | Admin overview & stats | Yes |
| `/dashboard/menu` | Manage menu items (Create, Read, Update, Delete) | Yes |
| `/dashboard/animals` | Manage cats/animals (Create, Read, Update, Delete) | Yes |
| `/dashboard/events` | Manage events (Create, Read, Update, Delete) | Yes |
| `/dashboard/blog` | Manage blog posts (Create, Read, Update, Delete) | Yes |

### Users
| Method | Endpoint | Access | Notes |
|--------|----------|--------|-------|
| `POST` | `/api/user/login` | Public | Returns JWT token on success |

## 🔧 Development Tips

- **Auto-reload**: The dev server auto-reloads when you save files
- **Hot Module Replacement**: React components update without full refresh
- **TypeScript**: Full type safety for better development experience
- **ESLint**: Code validation (run `npm run lint` to check)

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🚢 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables (`DATABASE_URL`)
4. Deploy with one click

For other platforms, build the app:
```bash
npm run build
npm start
```
