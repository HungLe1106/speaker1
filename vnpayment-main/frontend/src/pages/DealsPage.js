import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { apiService } from "../services/api";

const styles = {
  mainContainer: {
    background: "var(--surface)",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "0",
    maxWidth: "100%"
  },
  innerContainer: {
    width: "100%",
    maxWidth: "1600px",
    padding: "32px",
    boxSizing: "border-box",
    margin: "0 auto"
  },
  header: {
    marginBottom: "32px",
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    padding: "40px",
    borderRadius: "16px",
    color: "white",
    textAlign: "center"
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px"
  },
  subtitle: {
    fontSize: "18px",
    opacity: 0.95
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap"
  },
  filterButton: {
    padding: "10px 20px",
    border: "2px solid #ddd",
    borderRadius: "24px",
    background: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s"
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px"
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    color: "var(--muted)"
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px"
  }
};

function DealsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discountFilter, setDiscountFilter] = useState("all");

  useEffect(() => {
    loadDeals();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, discountFilter]);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts({
        limit: 100
      });
      
      // Filter products with discount > 0
      const deals = (response.data.products || [])
        .filter(p => p.discount > 0)
        .sort((a, b) => b.discount - a.discount);
      
      setProducts(deals);
    } catch (error) {
      console.error('Error loading deals:', error);
      toast.error('Không thể tải danh sách khuyến mãi');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    if (discountFilter === "high") {
      filtered = filtered.filter(p => p.discount >= 30);
    } else if (discountFilter === "medium") {
      filtered = filtered.filter(p => p.discount >= 15 && p.discount < 30);
    } else if (discountFilter === "low") {
      filtered = filtered.filter(p => p.discount > 0 && p.discount < 15);
    }
    
    setFilteredProducts(filtered);
  };

  const getButtonStyle = (filter) => ({
    ...styles.filterButton,
    background: discountFilter === filter ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white",
    color: discountFilter === filter ? "white" : "#333",
    borderColor: discountFilter === filter ? "#667eea" : "#ddd"
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div style={styles.mainContainer}>
      <div style={styles.innerContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <span>🏷️</span>
            Khuyến Mãi Đặc Biệt
          </h1>
          <p style={styles.subtitle}>
            Săn ngay các ưu đãi hấp dẫn - Giảm giá lên đến 50%!
          </p>
        </div>

        <div style={styles.filterBar}>
        <button 
          onClick={() => setDiscountFilter("all")}
          style={getButtonStyle("all")}
        >
          🎯 Tất cả ({products.length})
        </button>
        <button 
          onClick={() => setDiscountFilter("high")}
          style={getButtonStyle("high")}
        >
          🔥 Giảm trên 30% ({products.filter(p => p.discount >= 30).length})
        </button>
        <button 
          onClick={() => setDiscountFilter("medium")}
          style={getButtonStyle("medium")}
        >
          ⭐ Giảm 15-30% ({products.filter(p => p.discount >= 15 && p.discount < 30).length})
        </button>
        <button 
          onClick={() => setDiscountFilter("low")}
          style={getButtonStyle("low")}
        >
          ✨ Giảm dưới 15% ({products.filter(p => p.discount > 0 && p.discount < 15).length})
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎁</div>
          <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>
            {products.length === 0 ? "Chưa có chương trình khuyến mãi" : "Không tìm thấy sản phẩm"}
          </h2>
          <p>Vui lòng thử lại sau hoặc chọn bộ lọc khác</p>
        </div>
      ) : (
        <div style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <div key={product.id} style={{ position: "relative" }}>
              {/* Discount badge */}
              <div style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: product.discount >= 30 ? "#f5576c" : product.discount >= 15 ? "#FF9800" : "#4CAF50",
                color: "white",
                padding: "8px 12px",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "16px",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
              }}>
                -{product.discount}%
              </div>
              <ProductCard product={product} />
              {/* Savings info */}
              <div style={{
                marginTop: "8px",
                padding: "8px 12px",
                background: "#fff3e0",
                color: "#e65100",
                borderRadius: "8px",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "13px"
              }}>
                💰 Tiết kiệm: {(product.price * product.discount / 100).toLocaleString('vi-VN')} VND
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default DealsPage;
