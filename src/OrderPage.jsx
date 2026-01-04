import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import { getProducts, createOrder } from "./api";
import { Package, User, MapPin, CheckCircle } from "lucide-react";

const OrderPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    productId: searchParams.get("productId") || "",
    quantity: 10,
    buyerName: "",
    deliveryAddress: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const selectedProduct = products.find((p) => p.id === formData.productId);
  const totalPrice = selectedProduct
    ? selectedProduct.price_per_unit * formData.quantity
    : 0;

  const validate = () => {
    const newErrors = {};
    if (!formData.productId) newErrors.productId = "Please select a product";
    if (
      !formData.quantity ||
      formData.quantity < 1 ||
      formData.quantity > 10000
    ) {
      newErrors.quantity = "Quantity must be between 1 and 10,000";
    }
    if (!formData.buyerName || formData.buyerName.trim().length < 2) {
      newErrors.buyerName = "Name must be at least 2 characters";
    }
    if (
      !formData.deliveryAddress ||
      formData.deliveryAddress.trim().length < 10
    ) {
      newErrors.deliveryAddress = "Please provide a complete address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const product = products.find((p) => p.id === formData.productId);
      if (!product) throw new Error("Product not found");

      const order = await createOrder({
        product_id: formData.productId,
        product_name: product.name,
        quantity: formData.quantity,
        buyer_name: formData.buyerName.trim(),
        delivery_address: formData.deliveryAddress.trim(),
      });

      setOrderSuccess(order.order_id);
      setFormData({
        productId: "",
        quantity: 10,
        buyerName: "",
        deliveryAddress: "",
      });
    } catch (error) {
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div>
        <Header />
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="card" style={{ textAlign: "center" }}>
              <CheckCircle
                size={48}
                style={{ color: "#22c55e", margin: "0 auto 1rem" }}
              />
              <h2 style={{ marginBottom: "1rem" }}>Order Placed!</h2>
              <p style={{ marginBottom: "2rem", color: "#6b7280" }}>
                Your order has been successfully submitted.
              </p>
              <div
                style={{
                  background: "#e5f5e0",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    marginBottom: "0.5rem",
                  }}
                >
                  Your Order ID
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#2d5016",
                  }}
                >
                  {orderSuccess}
                </p>
              </div>
              <p
                style={{
                  marginBottom: "1.5rem",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                }}
              >
                Save this ID to track your order status.
              </p>
              <button
                onClick={() => setOrderSuccess(null)}
                className="secondary"
              >
                Place Another Order
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="container">
        <div className="page-header">
          <h1>Place a Bulk Order</h1>
          <p>
            Order fresh produce in bulk quantities for your business or event
          </p>
        </div>

        {isLoading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="card">
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ marginBottom: "0.5rem" }}>Place Your Order</h2>
                <p style={{ color: "#6b7280" }}>
                  Fill in the details below to place a bulk order
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    <Package
                      size={16}
                      style={{ verticalAlign: "middle", marginRight: "4px" }}
                    />
                    Select Product
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                  >
                    <option value="">Choose a vegetable or fruit</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - Rs.{product.price_per_unit.toFixed(2)}/
                        {product.unit}
                      </option>
                    ))}
                  </select>
                  {errors.productId && (
                    <div className="form-error">{errors.productId}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Quantity ({selectedProduct?.unit || "units"})</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter quantity"
                  />
                  {errors.quantity && (
                    <div className="form-error">{errors.quantity}</div>
                  )}
                </div>

                {selectedProduct && formData.quantity > 0 && (
                  <div
                    style={{
                      background: "#f3f4f6",
                      padding: "1rem",
                      borderRadius: "8px",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#6b7280" }}>Estimated Total</span>
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#2d5016",
                        }}
                      >
                        Rs.{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>
                    <User
                      size={16}
                      style={{ verticalAlign: "middle", marginRight: "4px" }}
                    />
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.buyerName}
                    onChange={(e) =>
                      setFormData({ ...formData, buyerName: e.target.value })
                    }
                    placeholder="Enter your full name"
                  />
                  {errors.buyerName && (
                    <div className="form-error">{errors.buyerName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    <MapPin
                      size={16}
                      style={{ verticalAlign: "middle", marginRight: "4px" }}
                    />
                    Delivery Address
                  </label>
                  <textarea
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryAddress: e.target.value,
                      })
                    }
                    placeholder="Enter complete delivery address including city and postal code"
                    rows="4"
                  />
                  {errors.deliveryAddress && (
                    <div className="form-error">{errors.deliveryAddress}</div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ width: "100%" }}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
