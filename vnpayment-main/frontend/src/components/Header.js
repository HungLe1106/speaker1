import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useCallback, useState, useEffect } from "react";

function Header() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [searchCategory, setSearchCategory] = useState("all");

  // Sync search term with URL params
  useEffect(() => {
    const search = searchParams.get("search");
    if (search !== searchTerm) {
      setSearchTerm(search || "");
    }
  }, [searchParams]);

  // Handle search submission
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}&category=${searchCategory}`);
    } else {
      navigate("/");
    }
  }, [searchTerm, searchCategory, navigate]);

  return (
    <header
      className="header"
      style={{
        width: "100vw",
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "#131921",
        color: "#ffffff",
        padding: "0",
        boxSizing: "border-box",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)"
      }}
    >
      <div className="container">
        <div
          className="topbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            height: "60px",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="logo"
            style={{
              display: "flex",
              alignItems: "center",
              color: "#fff",
              textDecoration: "none",
              padding: "2px 8px",
              border: "1px solid transparent",
              borderRadius: "2px",
              height: "60px", // Fixed height to match the header
              overflow: "hidden", // Add this to clip the logo
              position: "relative", // Add this for proper z-index handling
              zIndex: 1 // Keep logo below menubar items
            }}
            onMouseOver={(e) => e.currentTarget.style.border = "1px solid #ffffff"}
            onMouseOut={(e) => e.currentTarget.style.border = "1px solid transparent"}
          >
            <img 
              src="/images/logo.png" 
              alt="Logo"
              style={{ 
                height: "150px",
                objectFit: "contain",
                marginTop: "-10px",
                marginBottom: "-10px"
              }}
            />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="search" style={{ 
              flex: "1", 
              maxWidth: "900px", 
              display: "flex",
              backgroundColor: "#2c3e50",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
            <select 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              style={{
                padding: "8px 10px",
                border: "none",
                background: "#34495e",
                borderRight: "1px solid #455d7a",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                width: "100px"
              }}
            >
              <option value="all">Tất cả</option>
              <option value="products">Sản phẩm</option>
              <option value="services">Dịch vụ</option>
            </select>
            <div style={{ flex: 1, display: "flex" }}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  border: "none",
                  outline: "none",
                  fontSize: "15px",
                  color: "#fff",
                  backgroundColor: "#2c3e50",
                  '::placeholder': {
                    color: "#95a5a6"
                  }
                }}/>
              <button
                type="submit"
                style={{
                  width: "70px",
                  background: "#e74c3c",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#c0392b"}
                onMouseOut={(e) => e.currentTarget.style.background = "#e74c3c"}
              >
                <i className="fas fa-search" style={{ color: "#fff", fontSize: "20px" }}></i>
              </button>
            </div>
          </form>

          {/* Actions */}
          <div
            className="top-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {user ? (
              <Link
                to="/profile"
                style={{
                  color: "#ffffff",
                  textDecoration: "none",
                  padding: "5px 8px",
                  border: "1px solid transparent",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseOver={(e) => e.currentTarget.style.border = "1px solid #ffffff"}
                onMouseOut={(e) => e.currentTarget.style.border = "1px solid transparent"}
              >
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "700",
                  textTransform: "uppercase"
                }}>
                  {user.username?.charAt(0) || 'U'}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "12px", color: "#cccccc" }}>Xin chào,</span>
                  <span style={{ fontWeight: "700", fontSize: "14px" }}>{user.username}</span>
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                style={{
                  color: "#ffffff",
                  textDecoration: "none",
                  padding: "5px 8px",
                  border: "1px solid transparent",
                  borderRadius: "2px",
                }}
                onMouseOver={(e) => e.currentTarget.style.border = "1px solid #ffffff"}
                onMouseOut={(e) => e.currentTarget.style.border = "1px solid transparent"}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i className="fas fa-user" style={{ marginRight: "5px", fontSize: "20px" }}></i>
                  <div>
                    <span style={{ fontSize: "12px", color: "#cccccc" }}>Đăng nhập</span>
                    <div style={{ fontWeight: "700" }}>Tài khoản</div>
                  </div>
                </div>
              </Link>
            )}

            <Link
              to="/orders"
              style={{
                color: "#ffffff",
                textDecoration: "none",
                padding: "5px 8px",
                border: "1px solid transparent",
                borderRadius: "2px",
              }}
              onMouseOver={(e) => e.currentTarget.style.border = "1px solid #ffffff"}
              onMouseOut={(e) => e.currentTarget.style.border = "1px solid transparent"}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i className="fas fa-box" style={{ marginRight: "5px", fontSize: "20px" }}></i>
                <div>
                  <span style={{ fontSize: "12px", color: "#cccccc" }}>Đơn hàng</span>
                  <div style={{ fontWeight: "700" }}>& Lịch sử</div>
                </div>
              </div>
            </Link>

            <Link
              to="/cart"
              style={{
                color: "#ffffff",
                textDecoration: "none",
                display: "flex",
                alignItems: "flex-end",
                padding: "5px 8px",
                border: "1px solid transparent",
                borderRadius: "2px",
              }}
              onMouseOver={(e) => e.currentTarget.style.border = "1px solid #ffffff"}
              onMouseOut={(e) => e.currentTarget.style.border = "1px solid transparent"}
            >
              <div style={{ position: "relative" }}>
                <span style={{ 
                  position: "absolute",
                  top: "-8px",
                  right: "-10px",
                  background: "var(--button-orange)",
                  borderRadius: "50%",
                  padding: "0 6px",
                  fontSize: "16px",
                  fontWeight: "700"
                }}>
                  {itemCount}
                </span>
                <i className="fas fa-shopping-cart" style={{ fontSize: "25px" }}></i>
                <span style={{ fontWeight: "700", marginLeft: "5px" }}>Giỏ hàng</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
