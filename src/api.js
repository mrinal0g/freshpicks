// API service for Express backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Fetch all products
export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  return response.json();
}

// Place a new order
export async function createOrder(order) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(error.error || "Failed to place order");
  }

  return response.json();
}

// Track order by order ID
export async function getOrderByOrderId(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Order not found");
    }
    throw new Error(`Failed to fetch order: ${response.statusText}`);
  }
  return response.json();
}

// Get all orders (admin)
export async function getAllOrders() {
  const response = await fetch(`${API_BASE_URL}/admin/orders`);
  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }
  return response.json();
}

// Update order status (admin)
export async function updateOrderStatus(orderId, status) {
  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(error.error || "Failed to update order status");
  }
}
