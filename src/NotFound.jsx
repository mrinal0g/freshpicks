import { Link } from "react-router-dom";
import Header from "./Header";

const NotFound = () => {
  return (
    <div>
      <Header />
      <div
        className="container"
        style={{ textAlign: "center", padding: "4rem 2rem" }}
      >
        <h1
          style={{ fontSize: "4rem", marginBottom: "1rem", color: "#2d5016" }}
        >
          404
        </h1>
        <h2 style={{ marginBottom: "1rem" }}>Page Not Found</h2>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" style={{ textDecoration: "none" }}>
          <button>Go Home</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
