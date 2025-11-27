import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { apiService } from "../services/api";
import SideMenu from "../components/SideMenu";

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
    display: "flex",
    gap: "32px",
    padding: "32px",
    boxSizing: "border-box",
    margin: "0 auto"
  },
  sidebar: {
    width: "250px",
    flexShrink: 0,
    flexBasis: "250px"
  },
  mainContent: {
    flex: "1 1 auto",
    width: "100%",
    minWidth: "0",
    maxWidth: "100%",
    overflow: "hidden"
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
    color: "var(--muted)"
  },
  sortBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
    alignItems: "center"
  },
  sortButton: {
    padding: "8px 16px",
    border: "2px solid #ddd",
    borderRadius: "20px",
    background: "white",
    cursor: "pointer",
    fontSize: "13px",
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
  }
};

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    loadProducts();
  }, [sortBy, selectedCategory]);

  useEffect(() => {
    filterProductsByBrand();
  }, [selectedBrand, allProducts]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts({
        category: selectedCategory === 'all' ? null : selectedCategory,
        limit: 100
      });
      
      let sorted = response.data.products || [];
      
      // Extract unique brands
      const uniqueBrands = [...new Set(sorted.map(p => p.brand || p.category || 'Khác').filter(Boolean))];
      const brandCounts = {};
      sorted.forEach(p => {
        const brand = p.brand || p.category || 'Khác';
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
      });
      
      const brandsWithCounts = uniqueBrands.map(brand => ({
        name: brand,
        count: brandCounts[brand]
      })).sort((a, b) => b.count - a.count);
      
      setBrands(brandsWithCounts);
      
      // Sort based on selection
      if (sortBy === "newest") {
        sorted = sorted.sort((a, b) => {
          // Assuming newer products have higher IDs or a createdAt field
          return b.id.localeCompare(a.id);
        });
      } else if (sortBy === "price-low") {
        sorted = sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        sorted = sorted.sort((a, b) => b.price - a.price);
      } else if (sortBy === "popular") {
        sorted = sorted.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
      }
      
      setAllProducts(sorted);
      setProducts(sorted);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
      setProducts([]);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProductsByBrand = () => {
    if (!selectedBrand || selectedBrand === 'all') {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => {
        const productBrand = p.brand || p.category || 'Khác';
        return productBrand === selectedBrand;
      });
      setProducts(filtered);
    }
  };

  const getButtonStyle = (sort) => ({
    ...styles.sortButton,
    background: sortBy === sort ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white",
    color: sortBy === sort ? "white" : "#333",
    borderColor: sortBy === sort ? "#667eea" : "#ddd"
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div style={styles.mainContainer}>
      <div style={styles.innerContainer}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          {/* Category Filter */}
          <div className="card" style={{
            padding: "20px 16px",
            borderRadius: "12px",
            marginBottom: "20px"
          }}>
            <h3 style={{ fontSize: "20px", marginBottom: "16px", fontWeight: 700 }}>
              📂 Danh mục
            </h3>
            <SideMenu selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          {/* Brand Filter */}
          <div className="card" style={{
            padding: "20px 16px",
            borderRadius: "12px"
          }}>
            <h3 style={{ fontSize: "20px", marginBottom: "16px", fontWeight: 700 }}>
              🏷️ Thương hiệu
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => setSelectedBrand('all')}
                style={{
                  padding: "10px 14px",
                  border: "2px solid",
                  borderColor: !selectedBrand || selectedBrand === 'all' ? "#667eea" : "#e0e0e0",
                  borderRadius: "8px",
                  background: !selectedBrand || selectedBrand === 'all' 
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                    : "white",
                  color: !selectedBrand || selectedBrand === 'all' ? "white" : "#333",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  textAlign: "left",
                  transition: "all 0.2s",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span>🌐 Tất cả hãng</span>
                <span style={{
                  background: !selectedBrand || selectedBrand === 'all' 
                    ? "rgba(255,255,255,0.3)" 
                    : "#f0f0f0",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "700"
                }}>
                  {allProducts.length}
                </span>
              </button>
              
              {brands.map((brand) => (
                <button
                  key={brand.name}
                  onClick={() => setSelectedBrand(brand.name)}
                  style={{
                    padding: "10px 14px",
                    border: "2px solid",
                    borderColor: selectedBrand === brand.name ? "#667eea" : "#e0e0e0",
                    borderRadius: "8px",
                    background: selectedBrand === brand.name 
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                      : "white",
                    color: selectedBrand === brand.name ? "white" : "#333",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "left",
                    transition: "all 0.2s",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                  onMouseEnter={(e) => {
                    if (selectedBrand !== brand.name) {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.transform = "translateX(4px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBrand !== brand.name) {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.transform = "translateX(0)";
                    }
                  }}
                >
                  <span>{brand.name}</span>
                  <span style={{
                    background: selectedBrand === brand.name 
                      ? "rgba(255,255,255,0.3)" 
                      : "#f0f0f0",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "700"
                  }}>
                    {brand.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={styles.mainContent}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              <span>✨</span>
              Tất cả sản phẩm
            </h1>
            <p style={styles.subtitle}>
              Khám phá bộ sưu tập đầy đủ của chúng tôi
            </p>
          </div>

          <div style={styles.sortBar}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#666" }}>
              Sắp xếp theo:
            </span>
            <button 
              onClick={() => setSortBy("newest")}
              style={getButtonStyle("newest")}
            >
              🆕 Mới nhất
            </button>
            <button 
              onClick={() => setSortBy("popular")}
              style={getButtonStyle("popular")}
            >
              🔥 Phổ biến
            </button>
            <button 
              onClick={() => setSortBy("price-low")}
              style={getButtonStyle("price-low")}
            >
              💰 Giá thấp
            </button>
            <button 
              onClick={() => setSortBy("price-high")}
              style={getButtonStyle("price-high")}
            >
              💎 Giá cao
            </button>
            <span style={{ 
              marginLeft: "auto", 
              fontSize: "14px", 
              color: "#666",
              fontWeight: "600"
            }}>
              {products.length} sản phẩm
            </span>
          </div>

          {products.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
              <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Không có sản phẩm</h2>
              <p>Vui lòng thử lại sau hoặc chọn danh mục khác</p>
            </div>
          ) : (
            <div style={styles.productGrid}>
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProductsPage;
