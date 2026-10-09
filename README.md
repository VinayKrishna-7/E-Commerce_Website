# ShopEase

> A sleek, high-performance full-stack e-commerce platform built with React, Node.js, Express, and PostgreSQL.

---

## Overview

**ShopEase** is a modern, responsive e-commerce web application crafted with a focus on speed, elegant design, and smooth user experience. It features full catalog exploration, real-time cart controls with inline quantity selection and instant undo, secure user authentication, order tracking, and an administrative dashboard.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router 7, Lucide Icons, CSS Variables (Design Tokens) |
| **Backend** | Node.js, Express.js, JWT Authentication, bcryptjs |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Tooling** | Axios, Dotenv, CORS, ESLint |

---

## Key Features

- **Catalog & Discovery**: Instant search, category filters, price range sliders, sorting (price, newest, name), and real-time stock availability.
- **Smart Cart Controls**:
  - Direct quantity selector on product cards and product details.
  - One-click inline **Undo** right on the button to instantly reverse accidental additions.
  - Guest cart support that automatically synchronizes upon login.
- **Wishlist & Saved Items**: Save favorite items across browsing sessions.
- **Authentication & Security**: Secure registration and login using JWT tokens and bcrypt password encryption.
- **Order Management & Checkout**: End-to-end checkout with atomic database transactions and historical price snapshots.
- **Admin Dashboard**: Real-time store analytics, product catalog management (add, edit, delete), and order fulfillment tracking.
- **Themes**: Seamless Light and Dark mode switching with persistent user preference.

---

## Project Structure

```
├── client/              # React frontend application (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth, Cart, Wishlist, Theme & Toast state
│   │   ├── pages/       # Application views
│   │   ├── services/    # API integration services
│   │   └── styles/      # Design system & CSS tokens
│   └── package.json
│
├── server/              # Express REST API backend
│   ├── prisma/          # Database schema and seed data
│   ├── src/
│   │   ├── controllers/ # Request controllers
│   │   ├── middleware/  # Auth & error handling middleware
│   │   ├── routes/      # API endpoints
│   │   └── server.js    # Server entry point
│   └── package.json
│
└── package.json         # Root workspace scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** database instance
- **npm** (v9 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**:
   
   - In `server/.env`:
     ```env
     PORT=5000
     NODE_ENV=development
     DATABASE_URL=postgresql://user:password@localhost:5432/shopease?schema=public
     JWT_SECRET=your_super_secret_jwt_key
     JWT_EXPIRES_IN=7d
     ```
   
   - In `client/.env`:
     ```env
     VITE_API_URL=/api
     ```

4. **Initialize Database**:
   ```bash
   cd server
   npm run prisma:push
   npm run prisma:seed
   ```

5. **Start Development Servers**:

   - **Backend API** (runs on `http://localhost:5000`):
     ```bash
     cd server
     npm run dev
     ```

   - **Frontend Client** (runs on `http://localhost:3000`):
     ```bash
     cd client
     npm run dev
     ```

---

## License

This project is licensed under the MIT License.
