# ShopEase

An E-commerce platform designed to deliver a seamless shopping experience through intuitive product discovery, wishlist management, cart functionality, and effortless order placement—all within a clean, minimal, and responsive interface.


## Features

- **Product Catalog** — Real-time search, category filters, price range sliders, and live stock indicators.
- **Cart & Quick Undo** — Quantity selector and instant one-click undo directly on the button.
- **Guest & User Cart** — Browse as a guest; cart items automatically merge upon login.
- **User Accounts** — Secure JWT authentication, profile management, and order history.
- **Admin Dashboard** — Product inventory management and live order tracking.
- **Theme Toggle** — Seamless Light and Dark mode with saved preferences.

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Lucide Icons, CSS Variables
- **Backend:** Node.js, Express, Prisma ORM, JWT, bcryptjs
- **Database:** PostgreSQL

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Setup environment variables

In `server/.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shopease?schema=public"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="7d"
```

In `client/.env`:
```env
VITE_API_URL="/api"
```

### 3. Setup database

```bash
npm run db:push
npm run db:seed
```

### 4. Run the project

```bash
# Start backend (http://localhost:5000)
npm run server

# Start frontend (http://localhost:3000)
npm run client
```
