# ShopEase

A modern full-stack e-commerce store built with React, Node.js, Express, and PostgreSQL.

## Features

- **Storefront & Catalog** — Live search, category filtering, price range filters, and real-time stock indicators.
- **Interactive Cart** — Select quantities directly on product cards and undo additions with a single click right on the button. Supports guest carts with automatic sync upon login.
- **User Accounts** — JWT authentication, profile management, and order history.
- **Admin Dashboard** — Manage products, track inventory, and update order statuses.
- **Theme Support** — Light and dark mode with system preference detection.

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Lucide icons, CSS custom properties
- **Backend:** Node.js, Express, Prisma ORM, JWT, bcryptjs
- **Database:** PostgreSQL

## Quick Start

### 1. Clone & install dependencies

```bash
git clone https://github.com/VinayKrishna-7/E-Commerce_Website.git
cd E-Commerce_Website
npm run install:all
```

### 2. Environment variables

Copy the example environment files:

```bash
# Server (server/.env)
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shopease?schema=public"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"

# Client (client/.env)
VITE_API_URL="/api"
```

### 3. Setup database

Push the schema and seed initial products:

```bash
npm run db:push
npm run db:seed
```

### 4. Run the app

Start the backend and frontend in separate terminals:

```bash
# Terminal 1 — Backend (http://localhost:5000)
npm run server

# Terminal 2 — Frontend (http://localhost:3000)
npm run client
```

## License

MIT
