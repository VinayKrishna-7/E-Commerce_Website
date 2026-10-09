# ShopEase

ShopEase is a full-stack e-commerce web application built for browsing, discovering, and purchasing vintage and curated everyday products. The platform covers the entire shopping journey from product discovery and cart management to user authentication, checkout, and store administration.

The frontend is built with React and Vite for a fast, responsive user interface, while the backend is powered by Node.js, Express, and PostgreSQL using Prisma ORM to handle data storage, authentication, and order workflows.

---

## Features

### 1. Storefront & Product Discovery
- **Search & Filtering:** Search products by keywords in real time, filter by categories, and set price ranges.
- **Sorting Options:** Sort products by newest additions, price (low to high / high to low), or alphabetically.
- **Stock Tracking:** Visual badges display whether items are in stock, low in stock, or sold out.
- **Product Details:** Dedicated detail pages with high-resolution imagery, pricing, descriptions, stock counts, and related product recommendations.

### 2. Cart & Interactive Controls
- **In-Button Quantity Stepper:** Select the exact number of items to add directly on product cards and product detail pages.
- **Inline Undo Action:** After adding an item to the bag, the button temporarily shifts to an "Added • Undo" state, letting you cancel or take back the addition in a single click.
- **In-Bag Indicators:** Clear badges show how many units of an item are already inside your cart as you browse.
- **Guest Cart & Account Sync:** Add items as a guest; items automatically synchronize with your account when you log in.

### 3. Wishlist & User Accounts
- **Wishlist:** Save items to your personal wishlist for quick access later.
- **User Authentication:** Registration and login secured with encrypted passwords and JSON Web Tokens (JWT).
- **Profile & Order History:** View past orders, track order fulfillment statuses, and manage saved delivery addresses.

### 4. Admin Management
- **Dashboard Overview:** Monitor store performance metrics including total revenue, order count, and inventory numbers.
- **Product Management:** Add new products, update prices and stock levels, or remove items from the catalog.
- **Order Management:** View incoming customer orders and update shipping and fulfillment statuses.

### 5. Design & Themes
- **Theme Toggle:** Switch between Light Mode and Dark Mode with preferences saved automatically.
- **Responsive Layout:** Optimized for mobile phones, tablets, and desktop displays.

---

## Tech Stack

### Frontend
- **React 19:** Component-based UI library
- **Vite:** Build tool and fast development server
- **React Router 7:** Client-side routing and navigation
- **Lucide React:** Icon library
- **CSS Custom Properties:** Modular styling using design tokens without utility framework bloat

### Backend
- **Node.js:** JavaScript runtime environment
- **Express.js:** Web server and REST API framework
- **PostgreSQL:** Relational database for products, users, carts, and orders
- **Prisma ORM:** Database modeling, migrations, and query handling
- **JWT (JSON Web Tokens):** Stateless user authentication
- **bcryptjs:** Password hashing and encryption

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (version 18 or above)
- **npm** (version 9 or above)
- **PostgreSQL** (running locally on port 5432 or via a remote database URL)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/VinayKrishna-7/E-Commerce_Website.git
cd E-Commerce_Website
```

---

### Step 2: Install Dependencies

Install all root, client, and server packages with a single command:

```bash
npm run install:all
```

---

### Step 3: Configure Environment Variables

#### Backend Configuration (`server/.env`)
Create a `.env` file inside the `server/` folder:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shopease?schema=public
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

*(Replace the `DATABASE_URL` with your PostgreSQL username, password, and database name).*

#### Frontend Configuration (`client/.env`)
Create a `.env` file inside the `client/` folder:

```env
VITE_API_URL=/api
```

---

### Step 4: Setup Database & Seed Products

Run Prisma commands to create the database schema and populate it with initial curated products:

```bash
# Push Prisma schema to your PostgreSQL database
npm run db:push

# Seed the database with catalog products
npm run db:seed
```

---

### Step 5: Run the Project

Open two terminal windows to run the backend API and frontend client concurrently:

#### Terminal 1 — Start the Backend API:
```bash
npm run server
```
The API server will start on **`http://localhost:5000`**.

#### Terminal 2 — Start the Frontend Client:
```bash
npm run client
```
The client app will launch on **`http://localhost:3000`**.
