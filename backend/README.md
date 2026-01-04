# FreshBulk Backend

Node.js backend for bulk vegetable/fruit ordering platform.

## Tech Stack
- Node.js + Express.js
- SQLite (sql.js)
- UUID for unique IDs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| POST | `/api/orders` | Place new order |
| GET | `/api/orders/:orderId` | Track order by ID |
| GET | `/api/admin/orders` | List all orders (admin) |
| PUT | `/api/admin/orders/:id` | Update order status |
| GET | `/api/health` | Health check |

## Run Locally

```bash
npm install
npm start
```

Server runs on `http://localhost:3001`

## Database

SQLite database (`database.sqlite`) is automatically created and seeded with 12 products on first run.
