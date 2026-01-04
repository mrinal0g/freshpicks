# FreshBulk - Bulk Vegetable/Fruit Ordering Platform

A simple web application for ordering fresh vegetables and fruits in bulk quantities. Buyers can browse products, place orders, and track their delivery status. Admins can manage all orders and update their status.

## Tech Stack

### Frontend
- **React.js** - UI framework
- **JavaScript** - Programming language
- **Vite** - Build tool and dev server
- **Plain CSS** - Styling (no frameworks)
- **React Router** - Routing
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database (using sql.js)
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing

## Features Implemented

### For Buyers
✅ **Browse Vegetables/Fruits**
- Product catalogue displaying name and price per unit
- Search and filter functionality (by category: vegetables/fruits)
- Responsive product grid layout

✅ **Place Orders**
- Order form with validation:
  - Vegetable/Fruit selection
  - Quantity input
  - Buyer name
  - Delivery address
- Automatic Order ID generation (format: ORD-XXXXXXXX)
- Order status defaults to "Pending"

✅ **Order Tracking**
- Track orders using Order ID
- View order details:
  - Product name
  - Quantity
  - Buyer name
  - Delivery address
  - Order status (Pending/Delivered)
  - Order date

### For Admin
✅ **Order Management**
- View all orders in a table with:
  - Order ID
  - Product name
  - Quantity
  - Buyer name
  - Delivery address
  - Order status
- Update order status: Pending → Delivered
- Statistics dashboard:
  - Total orders
  - Pending orders
  - Delivered orders
  - Total units ordered
- No authentication required (admin access via `/admin` route)

## Database Design

### Products Table
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_per_unit REAL NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  image_url TEXT,
  category TEXT DEFAULT 'vegetable',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  buyer_name TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## Steps to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:3001`

The SQLite database (`database.sqlite`) will be automatically created in the `backend` directory on first run, and sample products will be seeded.

### Frontend Setup

1. Navigate to the project root directory (if not already there):
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (optional):
```env
VITE_API_URL=http://localhost:3001/api
```

If not set, the frontend will default to `http://localhost:3001/api`

4. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:8080`

### Access the Application

- **Home/Products**: `http://localhost:8080/`
- **Place Order**: `http://localhost:8080/order`
- **Track Order**: `http://localhost:8080/track`
- **Admin Dashboard**: `http://localhost:8080/admin`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product by ID

### Orders (Buyer)
- `POST /api/orders` - Place a new order
  ```json
  {
    "product_id": "uuid",
    "product_name": "Tomatoes",
    "quantity": 50,
    "buyer_name": "John Doe",
    "delivery_address": "123 Main St, City, 12345"
  }
  ```
- `GET /api/orders/:orderId` - Track order by Order ID

### Orders (Admin)
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
  ```json
  {
    "status": "Delivered"
  }
  ```

### Health Check
- `GET /api/health` - Check backend status

## Project Structure

```
fresh-picks-main/
├── backend/
│   ├── server.js           # Express server with all routes
│   ├── database.sqlite     # SQLite database file (auto-created)
│   ├── view-db.js          # Script to view database contents
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
├── src/
│   ├── App.jsx             # Main app component with routes
│   ├── main.jsx            # Entry point
│   ├── Header.jsx          # Navigation header component
│   ├── ProductsPage.jsx    # Product catalogue page
│   ├── OrderPage.jsx       # Order placement page
│   ├── TrackPage.jsx       # Order tracking page
│   ├── AdminPage.jsx       # Admin dashboard page
│   ├── NotFound.jsx        # 404 error page
│   ├── api.js              # API service functions
│   └── styles.css          # Global styles
├── package.json            # Frontend dependencies
├── vite.config.js          # Vite configuration
└── README.md              # This file
```

## Sample Data

The database is automatically seeded with 12 products on first run:

**Vegetables:**
- Tomatoes ($2.50/kg)
- Potatoes ($1.80/kg)
- Onions ($1.50/kg)
- Carrots ($2.00/kg)
- Spinach ($3.00/kg)
- Cabbage ($1.20/kg)

**Fruits:**
- Apples ($3.50/kg)
- Bananas ($2.20/kg)
- Oranges ($4.00/kg)
- Mangoes ($5.50/kg)
- Grapes ($6.00/kg)
- Watermelon ($1.00/kg)

## Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to Vercel or Netlify

3. Set environment variable:
   - `VITE_API_URL` = Your backend API URL

### Backend (Render)

1. Push backend folder to GitHub

2. Create a new **Web Service** on [Render](https://render.com)

3. Connect your GitHub repository

4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Environment Variables**: 
     - `PORT` (optional, defaults to 3001)

5. Deploy!

## Viewing the Database

The SQLite database file (`backend/database.sqlite`) can be viewed using any SQLite browser tool like [DB Browser for SQLite](https://sqlitebrowser.org/) or via command line:

```bash
cd backend
sqlite3 database.sqlite
.tables
SELECT * FROM products;
SELECT * FROM orders;
```

## Screenshots

_Note: Add screenshots of your application here showing:_
- Product catalogue page
- Order placement form
- Order tracking page
- Admin dashboard

## License

This project is created for educational/demonstration purposes.
