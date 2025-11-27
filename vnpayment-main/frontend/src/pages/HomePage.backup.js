import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import SideMenu from "../components/SideMenu";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { apiService } from "../services/api";

// // Reusable styles
// const productGridStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(4, 1fr)", // Thay đổi để hiển thị chính xác 4 cột
//   gap: "24px",
//   width: "100%",
//   maxWidth: "100%"
// };

// Reusable styles object moved outside component
const productGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "24px",
  width: "100%"
};

const styles = {
  mainContainer: {
    background: "var(--surface)",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  innerContainer: {
    width: "100%",
    display: "flex",
    gap: "32px",
    padding: "32px",
    boxSizing: "border-box"
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
    width: "100%"
  },
  sidebar: {
    width: "250px",
    flexShrink: 0,
    flexBasis: "250px"
  },
  card: {
    width: "100%",
    padding: "24px",
    borderRadius: "12px",
    background: "var(--card)",
    boxShadow: "var(--shadow)",
    marginBottom: "32px"
  }
};

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerImages, setBannerImages] = useState(["/images/banner1.jpg", "/images/a2.jpg"]);
  const [brandImages] = useState(["/images/a3.jpg", "/images/a4.jpg"]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrentSlide((s) => Math.max(0, s - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((s) => Math.min(bannerImages.length - 1, s + 1));
  }, [bannerImages.length]);

  const filterProducts = useCallback(
    (list) => {
      let filteredList = list || [];
      
      // Filter by category
      if (selectedCategory && selectedCategory !== 'all') {
        if (selectedCategory === 'khac') {
          filteredList = filteredList.filter(p => !p.category || p.category === 'khac');
        } else {
          filteredList = filteredList.filter(p => p.category === selectedCategory);
        }
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filteredList = filteredList.filter(p => 
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
        );
      }

      return filteredList;
    },
    [selectedCategory, searchQuery]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts({
        category: selectedCategory === 'all' ? null : selectedCategory,
        search: searchQuery.trim(),
        page: currentPage,
        limit: 12
      });
      console.log('Products response:', response);
      setProducts(response.data.products);
      const total = response.data.total || response.data.products.length;
      setTotalPages(Math.ceil(total / 12));
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div style={styles.mainContainer}>
      <div style={styles.innerContainer}>
        {/* Sidebar */}
        <aside style={{ width: "250px", flexShrink: 0, flexBasis: "250px" }}>
          <div className="card" style={{
            padding: "20px 16px",
            borderRadius: "12px",
            marginBottom: "24px",
            width: "100%"
          }}>
            <h3 style={{ fontSize: "20px", marginBottom: "16px", fontWeight: 700 }}>Danh mục đồ án</h3>
            <SideMenu selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
        </aside>

        {/* Main content */}
        <main style={{
          flex: "1 1 auto",
          minWidth: 0,
          width: "100%"
        }}>
          {/* Banner */}
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="banner" style={{ 
                marginBottom: "32px",
                position: "relative",
                width: "100%",
                height: "360px",
                overflow: "hidden",
                borderRadius: "16px"
              }}>
                <div className="banner-track" style={{
                  width: `${bannerImages.length * 100}%`,
                  height: "100%",
                  display: "flex",
                  transform: `translateX(-${currentSlide * (100 / bannerImages.length)}%)`,
                  transition: "transform 0.6s ease"
                }}>
                  {bannerImages.map((img, i) => (
                    <div className="banner-slide" key={i} style={{
                      flex: "0 0 100%",
                      height: "100%",
                      position: "relative"
                    }}>
                      <img src={img} alt={`Banner ${i + 1}`} style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }} />
                    </div>
                  ))}
                </div>
                <button onClick={prevSlide} style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "40px 12px",
                  cursor: "pointer",
                  opacity: 0.5,
                  transition: "opacity 0.2s"
                }}>
                  {"\u25C0"}
                </button>
                <button onClick={nextSlide} style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "40px 12px",
                  cursor: "pointer",
                  opacity: 0.5,
                  transition: "opacity 0.2s"
                }}>
                  {"\u25B6"}
                </button>
              </div>

              {/* Product Grid */}
              <div className="card" style={{ 
                marginBottom: "32px", 
                borderRadius: "16px", 
                padding: "24px",
                width: "100%"
              }}>
                {/* Search bar */}
                <div style={{
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <input
                    type="search"
                    placeholder="Tìm kiếm đồ án..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      fontSize: "16px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      backgroundColor: "var(--input-bg)",
                      color: "var(--text)"
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        cursor: "pointer",
                        color: "var(--text)",
                        fontSize: "14px"
                      }}
                    >
                      Xóa
                    </button>
                  )}
                </div>

                <div style={styles.productGrid}>
                  {products.map((product) => (
                    <div key={product.id} style={{ width: "100%" }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '24px',
                    gap: '12px'
                  }}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: currentPage === 1 ? '#f5f5f5' : '#fff',
                        cursor: currentPage === 1 ? 'default' : 'pointer'
                      }}>
                      Trang trước
                    </button>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {[...Array(totalPages)].map((_, index) => (
                        <button key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            background: currentPage === (index + 1) ? 'var(--accent)' : '#fff',
                            color: currentPage === (index + 1) ? '#fff' : '#000',
                            cursor: 'pointer'
                          }}>
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                        cursor: currentPage === totalPages ? 'default' : 'pointer'
                      }}>
                      Trang sau
                    </button>
                  </div>
                )}
              </div>

              {/* Featured Products */}
              <div className="card" style={{ 
                marginBottom: "32px",
                borderRadius: "16px",
                padding: "24px",
                width: "100%"
              }}>
                <h2 style={{ 
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--accent)",
                  marginBottom: "16px",
                  letterSpacing: "0.5px"
                }}>
                  Đồ án nổi bật
                </h2>
                {loading ? (
                  <Loading text="Đang tải sản phẩm..." />
                ) : (
                  <div style={styles.productGrid}>
                    {products.slice(0, 4).map((product) => (
                      <div key={product.id} style={{ width: "100%" }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}
                {filterProducts(products).length === 0 && !loading && (
                  <div style={{ padding: "40px", color: "var(--muted)", textAlign: "center" }}>
                    Không có sản phẩm nào để hiển thị
                  </div>
                )}
              </div>

              {/* Brand Grid */}
              <div style={styles.productGrid}>
                {brandImages.map((img, i) => (
                  <div key={i} className="card" style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "4px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    width: "100%"
                  }}>
                    <img src={img} alt={`Brand ${i + 1}`} style={{
                      width: "100%",
                      maxWidth: "200px",
                      height: "auto",
                      objectFit: "contain"
                    }} />
                    <span style={{ color: "var(--link)", fontSize: "14px" }}>
                      Xem thêm
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default HomePage;