# ShopEase — Professional Full-Stack E-Commerce Website

ShopEase is a complete, responsive, full-stack e-commerce web application crafted with a restrained, human-centered design aesthetic. It features an Express REST API backend, PostgreSQL database with Prisma ORM, JWT authentication, and a React (Vite) client with full light and dark theme support.

---

## 1. Key Features

- **Distinctive Visual Design**: Warm ivory palette, deep forest green accents, refined typography, subtle shadows, and authentic product photography.
- **Complete Theme System**: Instant light and dark mode toggling, persistent in `localStorage`, system preference detection, and zero flash on initial load.
- **Catalog & Discovery**:
  - Live search across product names and descriptions.
  - Category filtering (Audio & Electronics, Apparel & Footwear, Home & Living, Carry & Accessories).
  - Price range min/max filtering.
  - Sorting (Newest, Price: Low to High, Price: High to Low, Name: A-Z).
  - Pagination and active filter tag chips.
- **Product Details**:
  - High-res image display, discount indicators, and full specs.
  - Real-time stock status (in stock, low stock alert, sold out).
  - Quantity selector bounded by available stock.
  - Related product recommendations.
- **Cart & Wishlist**:
  - Persistent PostgreSQL storage for authenticated users.
  - Seamless guest cart & wishlist in `localStorage`, automatically merged into account on login.
  - Stock validation and accurate subtotal/shipping calculations.
  - Free shipping progress indicator ($100 threshold).
- **Checkout & Transactional Orders**:
  - Strict server-side verification: prices and totals recalculated from database.
  - Stock availability checked before placement.
  - Atomic database transactions (`prisma.$transaction`) to safely decrement stock and save order items.
  - Address snapshots and purchase-time pricing preserved for historical records.
- **User Account Management**:
  - Registration and Login with bcrypt password hashing and JWT authentication.
  - Personal profile editor and saved delivery addresses manager.
  - Order history tracking with item details and status pills.
- **Administrative Operations**:
  - Protected admin routes with role-based access control (`role === 'ADMIN'`).
  - Real-time analytics cards: Revenue, Orders, Active Products, Customers.
  - Product catalog CRUD: create, edit, and safely delete products.
  - Fulfillment manager: live order status dropdowns (Pending, Processing, Shipped, Delivered, Cancelled).

---

## 2. Technology Stack

### Frontend
- **React 19** with **Vite**
- **React Router DOM 7**
- **Regular CSS with CSS Variables** (No bulky utility frameworks)
- **Axios** (Configured with request/response interceptors)
- **Lucide React** (Vector interface icons, no emojis)

### Backend
- **Node.js** & **Express.js**
- **PostgreSQL** database
- **Prisma ORM** (Schema, migrations, client queries)
- **JWT** (JSON Web Tokens for authentication)
- **bcryptjs** (Secure salt & password hashing)
- **CORS** & **dotenv**

---

## 3. Project Structure

```
shopease/
├── client/                      # React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI components (Navbar, ProductCard, etc.)
│   │   ├── context/             # React Contexts (Auth, Cart, Wishlist, Theme, Toast)
│   │   ├── layouts/             # MainLayout and AdminLayout
│   │   ├── pages/               # Views (Home, Shop, Details, Cart, Checkout, Admin, etc.)
│   │   ├── services/            # Axios API client and domain services
│   │   ├── styles/              # Design system tokens and global CSS
│   │   ├── utils/               # Formatters and constants
│   │   ├── App.jsx              # Routes configuration
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express REST API Backend
│   ├── prisma/
│   │   ├── schema.prisma        # PostgreSQL Prisma schema
│   │   └── seed.js              # Database seed script (Admin, demo user, 20 products)
│   ├── src/
│   │   ├── config/              # Prisma client & database runners
│   │   ├── controllers/         # Request handlers for auth, products, cart, etc.
│   │   ├── middleware/          # Auth, Admin role verification, Error handling
│   │   ├── routes/              # Express API routers
│   │   ├── app.js               # Express application configuration
│   │   └── server.js            # HTTP server startup
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json                 # Root script runner
└── README.md
```

---

## 4. Getting Started & Installation

### Prerequisites
- **Node.js** v18+ (tested on Node v20+)
- **npm** v9+
- **PostgreSQL** database (a local service or the built-in zero-config embedded instance)

### 1. Clone & Install Dependencies

From the repository root:

```bash
# Install root, client, and server dependencies
npm run install:all
```

Or install individually:

```bash
cd client && npm install
cd ../server && npm install
```

---

## 5. Environment Configuration

### Client Environment (`client/.env`)
Create a `.env` file inside `client/`:

```env
VITE_API_URL=/api
```

*(Vite dev server is preconfigured with a proxy to `http://localhost:5000`)*.

### Server Environment (`server/.env`)
Create a `.env` file inside `server/`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/shopease?schema=public
JWT_SECRET=shopease_super_secure_jwt_secret_key_2026_dev
JWT_EXPIRES_IN=7d
```

---

## 6. Database Setup & Seeding

1. **Push Schema to PostgreSQL**:
   ```bash
   cd server
   npm run prisma:push
   ```

2. **Seed Initial Data**:
   ```bash
   npm run prisma:seed
   ```

The seed script creates:
- **20 realistic curated products** across 4 categories with photography, stock, and descriptions.
- **Default Administrator Account**:
  - Email: `admin@shopease.com`
  - Password: `Admin@12345`
- **Default Customer Account**:
  - Email: `customer@shopease.com`
  - Password: `Customer@12345`
- **A sample fulfilled order** and default saved shipping address.

---

## 7. Running the Application

### Development Mode

Run the backend and frontend concurrently:

```bash
# Terminal 1: Backend API (runs on port 5000)
cd server
npm run dev

# Terminal 2: Frontend Client (runs on port 3000)
cd client
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

## 8. REST API Endpoints Overview

### Authentication
- `POST /api/auth/register` — Create a new customer account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated session
- `PUT /api/auth/profile` — Update account profile and password

### Products
- `GET /api/products` — List catalog products with search, category, price range, and sort query parameters
- `GET /api/products/:id` — Get product details

### Shopping Cart (Authenticated)
- `GET /api/cart` — Get user's cart
- `POST /api/cart` — Add item to cart (with stock validation)
- `PATCH /api/cart/:itemId` — Update item quantity
- `DELETE /api/cart/:itemId` — Remove item from cart
- `DELETE /api/cart` — Clear entire cart

### Wishlist (Authenticated)
- `GET /api/wishlist` — Get user's saved items
- `POST /api/wishlist` — Save item (duplicate prevention)
- `DELETE /api/wishlist/:productId` — Remove item

### Orders & Checkout (Authenticated)
- `POST /api/orders` — Place order in an atomic transaction
- `GET /api/orders` — View customer's personal order history
- `GET /api/orders/:id` — View single order breakdown

### Addresses (Authenticated)
- `GET /api/addresses` — View saved delivery addresses
- `POST /api/addresses` — Save new address
- `PUT /api/addresses/:id` — Update address
- `DELETE /api/addresses/:id` — Remove address

### Admin Routes (Protected: Admin Only)
- `GET /api/admin/stats` — Revenue, orders, catalog count, and customer metrics
- `GET /api/admin/products` — Manage all catalog products
- `POST /api/admin/products` — Add a new product
- `PUT /api/admin/products/:id` — Update product details, price, or stock
- `DELETE /api/admin/products/:id` — Remove product (preserves order history)
- `GET /api/admin/orders` — View all customer orders
- `PATCH /api/admin/orders/:id/status` — Update order fulfillment status

---

## 9. Security & Design Integrity

- **Password Hashing**: Passwords stored as bcrypt hashes with salt rounds.
- **Server-Side Validation**: Stock availability and prices are strictly re-verified on the server during checkout; client prices are treated solely as display data.
- **Role Isolation**: Only accounts with `role: ADMIN` can access administrative routes or modify products/orders. Non-admin users receive HTTP 403 Forbidden.
- **Historical Integrity**: Order items record snapshots of purchase-time product name, image, and price. Deleting an active product will not damage completed orders.
- **No Mock Fallbacks in Core Shopping**: All product browsing, filtering, search, authentication, and purchases communicate directly with PostgreSQL.
