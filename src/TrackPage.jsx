import { useState } from "react";
import Header from "./Header";
import { getOrderByOrderId } from "./api";
import { Search, Clock, CheckCircle, AlertCircle } from "lucide-react";

const TrackPage = () => {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsSearching(true);
    setOrderDetails(null);
    setNotFound(false);

    try {
      const order = await getOrderByOrderId(orderId.trim().toUpperCase());
      setOrderDetails(order);
    } catch (error) {
      setNotFound(true);
      console.error("Failed to fetch order:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div>
      <Header />

      <div className="container">
        <div className="page-header">
          <h1>Track Your Order</h1>
          <p>Enter your order ID to check delivery status</p>
        </div>

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="card">
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ marginBottom: "0.5rem" }}>Track Your Order</h2>
              <p style={{ color: "#6b7280" }}>
                Enter your order ID to check the status
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <input
                type="text"
                placeholder="e.g., ORD-A1B2C3D4"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                style={{ flex: 1 }}
              />
              <button type="submit" disabled={isSearching}>
                {isSearching ? (
                  "Searching..."
                ) : (
                  <>
                    <Search
                      size={16}
                      style={{ verticalAlign: "middle", marginRight: "4px" }}
                    />
                    Track
                  </>
                )}
              </button>
            </form>
          </div>

          {notFound && (
            <div
              className="error"
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <AlertCircle size={24} />
              <div>
                <h3 style={{ marginBottom: "0.25rem" }}>Order Not Found</h3>
                <p style={{ margin: 0 }}>
                  Please check your order ID and try again.
                </p>
              </div>
            </div>
          )}

          {orderDetails && (
            <div className="card">
              <div
                style={{
                  borderBottom: "2px solid #e5e7eb",
                  paddingBottom: "1rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Order ID
                  </p>
                  <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    {orderDetails.order_id}
                  </p>
                </div>
                <span className={`badge ${orderDetails.status.toLowerCase()}`}>
                  {orderDetails.status === "Delivered" ? (
                    <CheckCircle
                      size={16}
                      style={{ verticalAlign: "middle", marginRight: "4px" }}
                    />
                  ) : (
                    <Clock
                      size={16}
                      style={{ verticalAlign: "middle", marginRight: "4px" }}
                    />
                  )}
                  {orderDetails.status}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Product
                  </p>
                  <p style={{ fontWeight: "500" }}>
                    {orderDetails.product_name}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Quantity
                  </p>
                  <p style={{ fontWeight: "500" }}>
                    {orderDetails.quantity} units
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Buyer Name
                  </p>
                  <p style={{ fontWeight: "500" }}>{orderDetails.buyer_name}</p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Order Date
                  </p>
                  <p style={{ fontWeight: "500" }}>
                    {new Date(orderDetails.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    marginBottom: "0.25rem",
                  }}
                >
                  Delivery Address
                </p>
                <p style={{ fontWeight: "500" }}>
                  {orderDetails.delivery_address}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
