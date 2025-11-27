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
    marginBottom: "32px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "var(--accent)",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  subtitle: {
    fontSize: "16px",
    color: "var(--muted)",
    marginBottom: "16px"
  },
  statsBar: {
    display: "flex",
    gap: "16px",
    marginTop: "16px",
    flexWrap: "wrap"
  },
  statCard: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "16px 24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    marginTop: "24px"
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

function BestSellersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, totalSales: 0 });

  useEffect(() => {
    loadBestSellers();
  }, []);

  const loadBestSellers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts({
        limit: 100 // Load more products to filter
      });
      
      // Sort by purchaseCount descending
      const sorted = (response.data.products || [])
        .filter(p => p.purchaseCount > 0)
        .sort((a, b) => b.purchaseCount - a.purchaseCount);
      
      setProducts(sorted);
      
      // Calculate stats
      const totalSales = sorted.reduce((sum, p) => sum + (p.purchaseCount || 0), 0);
      setStats({ total: sorted.length, totalSales });
    } catch (error) {
      console.error('Error loading best sellers:', error);
      toast.error('Không thể tải danh sách sản phẩm bán chạy');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div style={styles.mainContainer}>
      <div style={styles.innerContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <span>🔥</span>
            Sản phẩm bán chạy
          </h1>
          <p style={styles.subtitle}>
            Top sản phẩm được khách hàng yêu thích và mua nhiều nhất
          </p>
          
          <div style={styles.statsBar}>
            <div style={styles.statCard}>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>Tổng sản phẩm</div>
              <div style={{ fontSize: "28px", fontWeight: "700", marginTop: "4px" }}>
                {stats.total}
              </div>
            </div>
            <div style={{...styles.statCard, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"}}>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>Tổng lượt mua</div>
              <div style={{ fontSize: "28px", fontWeight: "700", marginTop: "4px" }}>
                {stats.totalSales.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Chưa có sản phẩm bán chạy</h2>
            <p>Các sản phẩm được mua nhiều sẽ xuất hiện ở đây</p>
          </div>
        ) : (
          <div style={styles.productGrid}>
            {products.map((product, index) => (
              <div key={product.id} style={{ position: "relative" }}>
                {/* Ranking badge */}
                {index < 3 && (
                  <div style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    background: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32",
                    color: "#000",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: "700",
                    fontSize: "14px",
                    zIndex: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                  }}>
                    #{index + 1}
                  </div>
                )}
                <ProductCard product={product} />
                {/* Purchase count badge */}
                <div style={{
                  marginTop: "8px",
                  padding: "8px 12px",
                  background: "#e8f5e9",
                  color: "#2e7d32",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "13px"
                }}>
                  ✅ Đã bán: {product.purchaseCount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BestSellersPage;
