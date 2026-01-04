import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { getProducts } from "./api";
import { Search, Leaf, Apple, ShoppingCart, Carrot } from "lucide-react";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

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

  const handleOrder = (productId, productName) => {
    navigate(
      `/order?productId=${productId}&productName=${encodeURIComponent(
        productName
      )}`
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || product.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const vegetables = products.filter((p) => p.category === "vegetable").length;
  const fruits = products.filter((p) => p.category === "fruit").length;

  return (
    <div>
      <Header />

      <div className="container">
        <div className="page-header">
          <h1>Fresh Produce, Bulk Prices</h1>
          <p>Order farm-fresh vegetables and fruits in bulk quantities</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280",
              }}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "40px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveFilter("all")}
              className={activeFilter === "all" ? "" : "secondary"}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setActiveFilter("vegetable")}
              className={activeFilter === "vegetable" ? "" : "secondary"}
            >
              <Leaf
                size={16}
                style={{ verticalAlign: "middle", marginRight: "4px" }}
              />
              Vegetables ({vegetables})
            </button>
            <button
              onClick={() => setActiveFilter("fruit")}
              className={activeFilter === "fruit" ? "" : "secondary"}
            >
              <Apple
                size={16}
                style={{ verticalAlign: "middle", marginRight: "4px" }}
              />
              Fruits ({fruits})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div
            className="text-center"
            style={{ padding: "3rem", color: "#6b7280" }}
          >
            No products found matching your search.
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const Icon = product.category === "fruit" ? Apple : Carrot;
              return (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleOrder(product.id, product.name)}
                >
                  <div style={{ marginBottom: "1rem" }}>
                    <Icon
                      size={32}
                      style={{
                        color:
                          product.category === "fruit" ? "#f97316" : "#2d5016",
                      }}
                    />
                  </div>
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    ${product.price_per_unit.toFixed(2)}{" "}
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: "normal",
                        color: "#6b7280",
                      }}
                    >
                      / {product.unit}
                    </span>
                  </div>
                  <button
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <ShoppingCart size={16} />
                    Order Now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
