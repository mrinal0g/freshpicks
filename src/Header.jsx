import { Link, useLocation } from "react-router-dom";
import { Leaf, ShoppingCart, Search, Settings } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Products", icon: Leaf },
    { href: "/order", label: "Order", icon: ShoppingCart },
    { href: "/track", label: "Track", icon: Search },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

  return (
    <header>
      <nav className="container">
        <Link to="/" className="logo">
          FreshBulk
        </Link>
        <ul className="nav-links">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <li key={link.href}>
                <Link to={link.href} className={isActive ? "active" : ""}>
                  <Icon
                    size={16}
                    style={{
                      display: "inline",
                      verticalAlign: "middle",
                      marginRight: "4px",
                    }}
                  />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
