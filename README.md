# TounesPrix

TounesPrix is a Tunisian technology price-comparison platform. It collects product listings from local online stores, normalizes and matches equivalent products, stores prices in MongoDB, and exposes them through an Express API and a Next.js web application.

The application is designed for two audiences:

- **Visitors and authenticated users** can browse products, compare store prices, inspect product offers, and view price statistics.
- **Administrators** can manage products, stores, prices, users, uploaded product images, and dashboard analytics.

## Features

- Product catalogue with search, category, brand, and best-price filtering.
- Product detail pages with all known store offers and the cheapest available price.
- Cross-store price comparison for products sold by MyTek, Tunisianet, Spacenet, and other configured stores.
- Store directory with store details, websites, cities, and logos.
- User registration and login with JWT authentication.
- Role-based access control for administrator operations.
- Admin dashboard for:
  - Product CRUD operations and image uploads.
  - Store CRUD operations.
  - Price creation and maintenance.
  - User listing, role changes, and deletion.
  - Overview, category, brand, best-store, and price-evolution statistics.
- Scraped-listing import pipeline with:
  - Encoding and price normalization.
  - Brand, SKU, RAM, storage, CPU, and GPU extraction.
  - Matching of equivalent products across stores.
  - Cheapest-variant selection per store.
  - Dry-run reporting before database writes.

## Technology Stack

### Frontend

- **Next.js 16** with the App Router.
- **React 19** and **TypeScript**.
- **Axios** for API communication.
- **Recharts** for dashboard charts and analytics.
- **Tailwind CSS 4** with PostCSS.
- **ESLint** and `eslint-config-next` for code quality.

The frontend lives in [`frontend/`](frontend/) and uses service modules in [`frontend/services/`](frontend/services/) for authentication, products, prices, stores, statistics, and users.

### Backend

- **Node.js** with **Express 5**.
- **MongoDB** with **Mongoose 9**.
- **JWT** via `jsonwebtoken` for authentication.
- **bcryptjs** for password hashing.
- **Multer** for product image uploads.
- **Morgan** for HTTP request logging.
- **CORS** for frontend-to-API communication.
- **dotenv** for environment configuration.
- **Nodemon** for development reloads.

The backend lives in [`backend/`](backend/). It follows a controller, route, model, middleware, and service structure.

## Architecture

```text
TounesPrix/
├── backend/
│   ├── app.js                         Express app, middleware, and API routes
│   ├── server.js                      Database connection and HTTP server startup
│   ├── config/db.js                   MongoDB connection
│   ├── controllers/                   Request handlers and business orchestration
│   ├── middleware/                    Authentication, errors, and uploads
│   ├── models/                        User, Product, Store, and Price schemas
│   ├── routes/                        REST API route definitions
│   ├── services/priceService.js       Best-price calculations
│   ├── scripts/importScrapedListings.js
│   ├── data/raw/                      Raw store listing JSON files
│   └── uploads/                       Locally uploaded product images
└── frontend/
    ├── app/                           Next.js routes and pages
    ├── components/                    Shared UI and dashboard components
    ├── contexts/                      Authentication and theme state
    ├── hooks/                         Reusable React hooks
    ├── services/                      Typed API service modules
    └── styles/                         Design tokens
```

### Request flow

1. A user opens a catalogue, comparison, or dashboard page in the Next.js application.
2. The frontend service layer sends an Axios request to the Express API.
3. The API controller reads or updates MongoDB documents through Mongoose models.
4. Protected routes validate the `Authorization: Bearer <token>` header.
5. Administrator routes additionally require the authenticated user to have the `admin` role.
6. The API returns JSON, while uploaded images are served from `/uploads`.

## Data Model

- **User**: name, email, hashed password, and role (`user` or `admin`).
- **Product**: name, brand, category, description, specifications, and optional image path.
- **Store**: name, logo, city, website, and optional metadata.
- **Price**: product reference, store reference, price, source URL, and date.

Products and stores are connected through `Price` documents. This allows one product to have multiple offers and makes it possible to calculate the best price for each product and the stores that most frequently offer the cheapest price.

## API Reference

The API is served under `/api`.

### Health

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Returns the API health status. |

### Authentication and users

| Method | Endpoint | Access | Description |
| --- | --- | --- |
| `POST` | `/api/users/register` | Public | Creates a user account. |
| `POST` | `/api/users/login` | Public | Authenticates a user and returns a JWT. |
| `GET` | `/api/users` | Admin | Lists users. |
| `PUT` | `/api/users/:id/role` | Admin | Changes a user's role. |
| `DELETE` | `/api/users/:id` | Admin | Deletes a user. |

### Products

| Method | Endpoint | Access | Description |
| --- | --- | --- |
| `GET` | `/api/products` | Public | Lists products with optional `category`, `brand`, `search`, `minPrice`, and `maxPrice` filters. |
| `GET` | `/api/products/:id` | Public | Returns a product and its store prices. |
| `POST` | `/api/products` | Admin | Creates a product, optionally with an `image` multipart upload. |
| `PUT` | `/api/products/:id` | Admin | Updates a product and optionally replaces its image. |
| `DELETE` | `/api/products/:id` | Admin | Deletes a product and its associated prices. |

### Stores

| Method | Endpoint | Access | Description |
| --- | --- | --- |
| `GET` | `/api/stores` | Public | Lists stores. |
| `GET` | `/api/stores/:id` | Public | Returns one store. |
| `POST` | `/api/stores` | Admin | Creates a store. |
| `PUT` | `/api/stores/:id` | Admin | Updates a store. |
| `DELETE` | `/api/stores/:id` | Admin | Deletes a store. |

### Prices

| Method | Endpoint | Access | Description |
| --- | --- | --- |
| `POST` | `/api/prices` | Admin | Creates or records a product price. |
| `GET` | `/api/prices/product/:productId` | Public | Lists prices for a product. |
| `GET` | `/api/prices/product/:productId/best` | Public | Returns the best price for a product. |

### Statistics

| Method | Endpoint | Access | Description |
| --- | --- | --- |
| `GET` | `/api/stats/overview` | Public | Returns product/store counts and cheapest, most expensive, and average-price information. |
| `GET` | `/api/stats/by-category` | Public | Counts products by category. |
| `GET` | `/api/stats/by-brand` | Public | Counts products by brand. |
| `GET` | `/api/stats/best-price-stores` | Public | Ranks stores by the number of lowest-price offers. |
| `GET` | `/api/stats/price-evolution/:productId` | Public | Returns the recorded price history for a product. |

Protected requests must include:

```http
Authorization: Bearer <jwt-token>
```

## Frontend Pages

- `/` - Home page.
- `/catalogue` - Product catalogue and filters.
- `/comparaison` - Cross-store price comparison.
- `/produits/[id]` - Product details and offers.
- `/connexion` - Login page.
- `/inscription` - Registration page.
- `/dashboard` - Protected administrator dashboard.
- `/dashboard/produits` - Product management.
- `/dashboard/boutiques` - Store management.
- `/dashboard/utilisateurs` - User and role management.
- `/dashboard/stats` - Analytics and charts.

## Prerequisites

- Node.js 18 or newer.
- npm.
- MongoDB running locally or an accessible MongoDB deployment.
- A browser for the frontend.

On Windows PowerShell, use `npm.cmd` if PowerShell blocks `npm.ps1` or `npx.ps1` through the execution policy.

## Configuration

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/tounesprix
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
```

Create `frontend/.env.local` only when the API is not running at the default address:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

The frontend already defaults to `http://localhost:5000/api` when `NEXT_PUBLIC_API_BASE_URL` is not set.

Do not commit `.env`, `.env.local`, passwords, or production secrets.

## Installation and Local Development

Install backend dependencies:

```powershell
cd backend
npm.cmd install
```

Install frontend dependencies:

```powershell
cd ..\frontend
npm.cmd install
```

Start MongoDB, then start the backend in one terminal:

```powershell
cd backend
npm.cmd run dev
```

Start the frontend in another terminal:

```powershell
cd frontend
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser. The backend runs on port `5000` by default.

## Database Seeding

The seed script clears the existing users, products, stores, and prices, then inserts demo data:

```powershell
cd backend
npm.cmd run seed
```

The seed data includes these development accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@tounesprix.tn` | `Admin123!` |
| User | `user@tounesprix.tn` | `User123!` |

These credentials are for local development only and must be changed or removed before deployment.

## Scraped Data Import

Raw listings are stored in [`backend/data/raw/`](backend/data/raw/) as JSON files for MyTek, Spacenet, and Tunisianet.

Run the importer from the backend directory:

```powershell
cd backend
node scripts/importScrapedListings.js
```

The default mode is a dry run. It parses and matches listings, prints a report, and does not change MongoDB.

To write the matched products and prices to MongoDB:

```powershell
node scripts/importScrapedListings.js --commit
```

The importer creates or updates products using a normalized match key, creates missing stores, and upserts one price per product/store pair. When a store has several variants of the same product, it keeps the cheapest variant.

## Available Scripts

### Backend

| Command | Purpose |
| --- | --- |
| `npm.cmd start` | Starts the API with Node.js. |
| `npm.cmd run dev` | Starts the API with Nodemon. |
| `npm.cmd run seed` | Replaces database contents with development seed data. |
| `npm.cmd test` | Runs the placeholder test command; tests are not configured yet. |

### Frontend

| Command | Purpose |
| --- | --- |
| `npm.cmd run dev` | Starts the Next.js development server. |
| `npm.cmd run build` | Creates a production build. |
| `npm.cmd start` | Serves the production build. |
| `npm.cmd run lint` | Runs ESLint. |

## Security and Deployment Notes

- Set a strong, private `JWT_SECRET` in every non-local environment.
- Restrict MongoDB network access and use a dedicated database user in production.
- Configure CORS for the actual frontend origin instead of allowing every origin by default.
- Use HTTPS so JWT-bearing requests and credentials are encrypted in transit.
- Store uploaded images in durable object storage or a persistent volume when deploying beyond a single local server.
- Replace the development seed credentials before exposing the application publicly.
- Add automated backend and frontend tests before relying on the project in production.

## Project Status

The core catalogue, comparison, authentication, administration, statistics, and JSON import workflows are implemented. The backend test script is currently a placeholder, and the scraper service directories are prepared for future collectors and scheduled scraping improvements.
