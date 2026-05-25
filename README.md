# 🚀 TMBill — Full Stack Order Management System

A production-ready, real-time order management system built with **Next.js**, **Node.js/Express**, **PostgreSQL**, and **Socket.IO**.

🌐 **Live Demo**: [tmbill-order-management.vercel.app](https://tmbill-order-management.vercel.app)  
🔧 **Backend API**: Deployed on Render (https://tmbill-order-management.onrender.com)
📦 **Repository**: [github.com/vishal-rathod-sketch/tmbill-order-management](https://github.com/vishal-rathod-sketch/tmbill-order-management)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Real-Time Events](#real-time-events)
- [Docker Setup](#docker-setup)
- [Deployment](#deployment)

---

## ✨ Features

### Task 1 — Multi-Store Order Management

- ✅ Create orders with multiple items
- ✅ Fetch orders by store with pagination
- ✅ Update order status (PLACED → PREPARING → COMPLETED)
- ✅ Zod validation on all API inputs
- ✅ Database indexes on `store_id` and `created_at`

### Task 2 — Real-Time Notification System

- ✅ Socket.IO WebSocket integration
- ✅ New orders appear instantly without page refresh
- ✅ Status updates reflect in real-time across tabs
- ✅ Store-based event filtering (room-based architecture)
- ✅ Automatic reconnect logic with room re-join

### Task 3 — Data Archival & Analytics

- ✅ Archive orders older than 30 days atomically (single CTE query)
- ✅ Orders per day analytics
- ✅ Total revenue per store
- ✅ Top 5 selling items (JSONB aggregation)
- ✅ Analytics Dashboard UI with charts

---

## 🛠 Tech Stack

| Layer                | Technology                                        |
| -------------------- | ------------------------------------------------- |
| **Frontend**         | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **State Management** | React Query (TanStack Query v5)                   |
| **Real-Time**        | Socket.IO Client                                  |
| **Backend**          | Node.js, Express, TypeScript                      |
| **WebSocket**        | Socket.IO                                         |
| **Database**         | PostgreSQL 18                                     |
| **Validation**       | Zod                                               |
| **Charts**           | Recharts                                          |
| **Containerization** | Docker + Docker Compose                           |
| **Frontend Hosting** | Vercel                                            |
| **Backend Hosting**  | Render                                            |
| **Database Hosting** | Render PostgreSQL                                 |

---

## 📁 Project Structure

```
tmbill-order-management/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts              # PostgreSQL pool
│   │   │   └── migrate.ts            # Table migrations
│   │   ├── routes/
│   │   │   ├── order.routes.ts       # Order CRUD + Socket.IO emit
│   │   │   └── archive.routes.ts     # Archive + analytics routes
│   │   ├── services/
│   │   │   ├── order.service.ts      # Order business logic
│   │   │   └── archive.service.ts    # Archive + analytics queries
│   │   ├── validators/
│   │   │   └── order.validator.ts    # Zod schemas
│   │   └── index.ts                  # Express + Socket.IO server
│   ├── Dockerfile                    # Production Docker image
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx              # Home page
│       │   ├── providers.tsx         # React Query provider
│       │   ├── create-order/
│       │   │   └── page.tsx          # Create Order form
│       │   ├── orders/
│       │   │   ├── page.tsx          # Orders list + real-time
│       │   │   └── [id]/page.tsx     # Update order status
│       │   └── analytics/
│       │       └── page.tsx          # Analytics dashboard
│       ├── components/
│       │   └── Navbar.tsx
│       ├── hooks/
│       │   └── useSocket.ts          # Socket.IO hook
│       └── lib/
│           ├── api.ts                # Axios instance
│           └── queryClient.ts        # React Query client
├── docker-compose.yml                # Local development setup
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

| Tool           | Version | Download                                                 |
| -------------- | ------- | -------------------------------------------------------- |
| Node.js        | 20 LTS  | [nodejs.org](https://nodejs.org)                         |
| Docker Desktop | Latest  | [docker.com](https://docker.com/products/docker-desktop) |
| Git            | Latest  | [git-scm.com](https://git-scm.com)                       |

### 1. Clone the repository

```bash
git clone https://github.com/vishal-rathod-sketch/tmbill-order-management.git
cd tmbill-order-management
```

### 2. Set up environment variables

**Backend** — create `backend/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://admin:secret@localhost:5432/orders_db
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** — create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

### 3. Start the database

```bash
# From project root
docker-compose up -d
```

This starts a PostgreSQL instance on port `5432`.

### 4. Run database migration

```bash
cd backend
npm install
npx ts-node src/db/migrate.ts
```

Expected output: `✅ Migration complete`

### 5. Start the backend

```bash
# Inside backend/
npm run dev
```

Expected output: `Server running on port 4000`

### 6. Start the frontend

```bash
# Open a new terminal
cd frontend
npm install
npm run dev
```

Expected output: `▲ Next.js 14 · Local: http://localhost:3000`

### 7. Open in browser

| Page         | URL                                |
| ------------ | ---------------------------------- |
| Home         | http://localhost:3000              |
| Create Order | http://localhost:3000/create-order |
| Orders List  | http://localhost:3000/orders       |
| Analytics    | http://localhost:3000/analytics    |

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                  | Example                          |
| -------------- | ---------------------------- | -------------------------------- |
| `PORT`         | Server port                  | `4000`                           |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `FRONTEND_URL` | Allowed CORS origin          | `http://localhost:3000`          |
| `NODE_ENV`     | Environment                  | `development` / `production`     |

### Frontend (`frontend/.env.local`)

| Variable              | Description               | Example                 |
| --------------------- | ------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend REST API base URL | `http://localhost:4000` |
| `NEXT_PUBLIC_WS_URL`  | Backend WebSocket URL     | `http://localhost:4000` |

---

## 📡 API Documentation

### Base URL

- **Local**: `http://localhost:4000`
- **Production**: `https://tmbill-order-management.onrender.com'

---

### Orders

#### `POST /orders`

Create a new order.

**Request Body:**

```json
{
  "store_id": "store1",
  "items": [
    { "item_id": "item_abc", "qty": 2 },
    { "item_id": "item_xyz", "qty": 1 }
  ],
  "total_amount": 1500.0
}
```

**Response `201`:**

```json
{
  "id": "uuid-here",
  "store_id": "store1",
  "items": [{ "item_id": "item_abc", "qty": 2 }],
  "total_amount": "1500.00",
  "status": "PLACED",
  "created_at": "2026-05-25T06:00:00.000Z"
}
```

---

#### `GET /orders`

Fetch orders with optional store filter and pagination.

**Query Parameters:**

| Param      | Type   | Required | Description                            |
| ---------- | ------ | -------- | -------------------------------------- |
| `store_id` | string | No       | Filter by store                        |
| `page`     | number | No       | Page number (default: 1)               |
| `limit`    | number | No       | Items per page (default: 10, max: 100) |

**Example:** `GET /orders?store_id=store1&page=1&limit=10`

**Response `200`:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}
```

---

#### `PATCH /orders/:id/status`

Update order status.

**Request Body:**

```json
{
  "status": "PREPARING"
}
```

Valid values: `"PLACED"` | `"PREPARING"` | `"COMPLETED"`

**Response `200`:** Returns updated order object.

---

### Archive & Analytics

#### `POST /archive-old-orders`

Move orders older than 30 days to `orders_archive` table.

**Response `200`:**

```json
{ "archived": 5 }
```

---

#### `GET /analytics/orders-per-day`

Orders grouped by day (last 30 days).

**Response `200`:**

```json
[
  { "day": "2026-05-25", "total_orders": "12" },
  { "day": "2026-05-24", "total_orders": "8" }
]
```

---

#### `GET /analytics/revenue-per-store`

Total revenue grouped by store.

**Response `200`:**

```json
[
  { "store_id": "store1", "total_revenue": "45000.00", "order_count": "15" },
  { "store_id": "store2", "total_revenue": "12000.00", "order_count": "6" }
]
```

---

#### `GET /analytics/top-items`

Top 5 items by total quantity sold.

**Response `200`:**

```json
[
  { "item_id": "item_abc", "total_qty": "42" },
  { "item_id": "item_xyz", "total_qty": "28" }
]
```

---

## 🗄 Database Schema

```sql
-- Main orders table
CREATE TABLE orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id     VARCHAR(50) NOT NULL,
  items        JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC(10, 2) NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'PLACED'
               CHECK (status IN ('PLACED', 'PREPARING', 'COMPLETED')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_orders_store_id   ON orders(store_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Archive table (identical structure)
CREATE TABLE orders_archive (LIKE orders INCLUDING ALL);
```

---

## ⚡ Real-Time Events (Socket.IO)

### Architecture

```
Client joins store room:    socket.emit('join:store', 'store1')
Server puts client in room: socket.join('store:store1')

New order created:   io.to('store:store1').emit('order:created', order)
Status updated:      io.to('store:store1').emit('order:statusUpdated', order)
```

### Events Reference

| Event                 | Direction       | Payload              | Description                      |
| --------------------- | --------------- | -------------------- | -------------------------------- |
| `join:store`          | Client → Server | `store_id: string`   | Join a store's notification room |
| `order:created`       | Server → Client | Order object         | Fires when new order is created  |
| `order:statusUpdated` | Server → Client | Updated order object | Fires when status changes        |

### Reconnect Handling

```typescript
// Socket auto-reconnects up to 5 times with 2s delay
const socket = io(WS_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

// Re-join store room after reconnect
socket.on("reconnect", () => {
  socket.emit("join:store", storeId);
});
```

---

## 🐳 Docker Setup

### Local Development

```bash
# Start PostgreSQL
docker-compose up -d

# Stop
docker-compose down

# Stop and wipe data
docker-compose down -v
```

**`docker-compose.yml`:**

```yaml
version: "3.8"
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: orders_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

### Production Docker (Backend)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g typescript
COPY . .
RUN tsc
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

---

## 🌐 Deployment

### Frontend → Vercel

```
Framework Preset:  Next.js
Root Directory:    frontend
Env Variables:     NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL
```

🔗 **Live**: [tmbill-order-management.vercel.app](https://tmbill-order-management.vercel.app)

### Backend → Render

```
Runtime:     Docker
Root Dir:    backend
Dockerfile:  backend/./Dockerfile
Env Vars:    DATABASE_URL, FRONTEND_URL, NODE_ENV
```

### Database → Render PostgreSQL

```
Plan:    Free
Version: PostgreSQL 18
Region:  Oregon (US West)
```

---

## 🔷 TypeScript

The entire codebase — frontend and backend — is written in **TypeScript**:

- Strict mode enabled (`"strict": true` in `tsconfig.json`)
- Zod schemas provide runtime + compile-time type safety
- Typed React Query hooks with generic response interfaces
- Fully typed Express routes and service functions

---

## 📝 Assumptions

- `total_amount` is provided by the client (not server-calculated)
- Archive is triggered on-demand via API (not a scheduled cron)
- Analytics queries only cover the live `orders` table (not archive)
- Store IDs are free-form strings — no separate store management required

---

## 👤 Author

**Vishal Rathod**  
GitHub: [@vishal-rathod-sketch](https://github.com/vishal-rathod-sketch)

---

> Built as part of a Full Stack Developer Assessment — demonstrating clean architecture, real-time WebSocket capabilities, database optimization, and end-to-end production deployment.
