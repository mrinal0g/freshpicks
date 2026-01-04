const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const initSqlJs = require('sql.js');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'database.sqlite');

let db = null;

function resultToObjects(result) {
  if (!result || result.length === 0) return [];
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const obj = {};
    columns.forEach((col, idx) => obj[col] = row[idx]);
    return obj;
  });
}

async function saveDatabase() {
  if (!db) return;
  try {
    await fs.writeFile(DB_FILE, Buffer.from(db.export()));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

async function initDatabase() {
  try {
    const SQL = await initSqlJs();
    try {
      db = new SQL.Database(await fs.readFile(DB_FILE));
    } catch (error) {
      if (error.code === 'ENOENT') {
        db = new SQL.Database();
      } else {
        throw error;
      }
    }

    db.run(`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price_per_unit REAL NOT NULL,
      unit TEXT NOT NULL DEFAULT 'kg',
      image_url TEXT,
      category TEXT DEFAULT 'vegetable',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
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
    )`);

    const count = db.exec('SELECT COUNT(*) as count FROM products');
    if (count.length > 0 && count[0].values[0][0] === 0) {
      const products = [
        ['Tomatoes', 2.50, 'kg', 'vegetable'],
        ['Potatoes', 1.80, 'kg', 'vegetable'],
        ['Onions', 1.50, 'kg', 'vegetable'],
        ['Carrots', 2.00, 'kg', 'vegetable'],
        ['Spinach', 3.00, 'kg', 'vegetable'],
        ['Cabbage', 1.20, 'kg', 'vegetable'],
        ['Apples', 3.50, 'kg', 'fruit'],
        ['Bananas', 2.20, 'kg', 'fruit'],
        ['Oranges', 4.00, 'kg', 'fruit'],
        ['Mangoes', 5.50, 'kg', 'fruit'],
        ['Grapes', 6.00, 'kg', 'fruit'],
        ['Watermelon', 1.00, 'kg', 'fruit'],
      ];

      const stmt = db.prepare('INSERT INTO products (id, name, price_per_unit, unit, category, created_at) VALUES (?, ?, ?, ?, ?, ?)');
      products.forEach(p => stmt.run([uuidv4(), p[0], p[1], p[2], p[3], new Date().toISOString()]));
      stmt.free();
      await saveDatabase();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

initDatabase().catch(console.error);

app.use(cors());
app.use(express.json());

function generateOrderId() {
  return 'ORD-' + uuidv4().substring(0, 8).toUpperCase();
}

app.get('/api/products', (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not initialized' });
    const result = db.exec('SELECT * FROM products ORDER BY name');
    res.json(resultToObjects(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not initialized' });
    const { product_id, product_name, quantity, buyer_name, delivery_address } = req.body;

    if (!product_id || !product_name || !quantity || !buyer_name || !delivery_address) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (quantity < 1 || quantity > 10000) {
      return res.status(400).json({ error: 'Quantity must be between 1 and 10,000' });
    }

    if (buyer_name.trim().length < 2 || delivery_address.trim().length < 10) {
      return res.status(400).json({ error: 'Invalid buyer name or address' });
    }

    const id = uuidv4();
    const order_id = generateOrderId();
    const now = new Date().toISOString();

    const stmt = db.prepare('INSERT INTO orders (id, order_id, product_id, product_name, quantity, buyer_name, delivery_address, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run([id, order_id, product_id, product_name, quantity, buyer_name.trim(), delivery_address.trim(), 'Pending', now, now]);
    stmt.free();
    await saveDatabase();

    res.status(201).json({ id, order_id, message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:orderId', (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not initialized' });
    const stmt = db.prepare('SELECT * FROM orders WHERE order_id = ?');
    stmt.bind([req.params.orderId.toUpperCase()]);
    const result = [];
    while (stmt.step()) result.push(stmt.getAsObject());
    stmt.free();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/orders', (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not initialized' });
    const result = db.exec('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(resultToObjects(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/orders/:id', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not initialized' });
    const { status } = req.body;

    if (!['Pending', 'Delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const checkStmt = db.prepare('SELECT id FROM orders WHERE id = ?');
    checkStmt.bind([req.params.id]);
    if (!checkStmt.step()) {
      checkStmt.free();
      return res.status(404).json({ error: 'Order not found' });
    }
    checkStmt.free();

    const stmt = db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?');
    stmt.run([status, new Date().toISOString(), req.params.id]);
    stmt.free();
    await saveDatabase();

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: db ? 'connected' : 'not initialized' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
