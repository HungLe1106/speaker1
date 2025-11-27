import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import SideMenu from "../components/SideMenu";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { apiService } from "../services/api";

// Styles configuration
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
  mainContent: {
    flex: "1 1 auto",
    width: "100%",
    minWidth: "0",
    maxWidth: "100%",
    overflow: "hidden"
  },
  sidebar: {
    width: "250px",
    flexShrink: 0,
    flexBasis: "250px"
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    width: "100%"
  }
};

function HomePage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bannerImages] = useState([
    "/images/banner1.jpg", 
    "/images/a2.jpg",
    "/images/banner2.jpg", 
    "/images/banner3.jpg"
  ]);
  const [brandImages] = useState(["/images/banner2.jpg", "/images/banner3.jpg"]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const prevSlide = useCallback(() => {
    setCurrentSlide((s) => (s === 0 ? bannerImages.length - 1 : s - 1));
  }, [bannerImages.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((s) => (s === bannerImages.length - 1 ? 0 : s + 1));
  }, [bannerImages.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play banner
  useEffect(() => {
    if (!isAutoPlaying || bannerImages.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, bannerImages.length]);

  // Sync category from URL params
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && category !== selectedCategory) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, searchParams]);

  // Filter products by brand
  useEffect(() => {
    if (!selectedBrand || selectedBrand === 'all') {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => {
        const productBrand = p.brand || p.category || 'Khác';
        return productBrand === selectedBrand;
      });
      setProducts(filtered);
    }
  }, [selectedBrand, allProducts]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const search = searchParams.get("search");

      const response = await apiService.getProducts({
        category: selectedCategory === 'all' ? null : selectedCategory,
        search: search ? search.trim() : "",
        page: currentPage,
        limit: 12
      });
      
      console.log('Products response:', response);
      const loadedProducts = response.data.products || [];
      
      // Extract unique brands
      const uniqueBrands = [...new Set(loadedProducts.map(p => p.brand || p.category || 'Khác').filter(Boolean))];
      const brandCounts = {};
      loadedProducts.forEach(p => {
        const brand = p.brand || p.category || 'Khác';
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
      });
      
      const brandsWithCounts = uniqueBrands.map(brand => ({
        name: brand,
        count: brandCounts[brand]
      })).sort((a, b) => b.count - a.count);
      
      setBrands(brandsWithCounts);
      setAllProducts(loadedProducts);
      setProducts(loadedProducts);
      
      const total = response.data.total || loadedProducts.length || 0;
      setTotalPages(Math.ceil(total / 12));
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
      setProducts([]);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage, searchParams]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const searchQuery = searchParams.get("search");
  const isSearchMode = !!searchQuery;

  // Featured products - only first 4
  const featuredProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  return (
    <div style={styles.mainContainer}>
      <div style={styles.innerContainer}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          {/* Category Filter */}
          <div className="card" style={{
            padding: "20px 16px",
            borderRadius: "12px",
            marginBottom: "20px",
            width: "100%"
          }}>
            <h3 style={{ fontSize: "20px", marginBottom: "16px", fontWeight: 700 }}>
              📂 Danh mục đồ án
            </h3>
            <SideMenu selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          {/* Brand Filter */}
          <div className="card" style={{
            padding: "20px 16px",
            borderRadius: "12px",
            width: "100%"
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

        {/* Main content */}
        <main style={styles.mainContent}>
          {loading ? (
            <Loading />
          ) : (
            <>
              {/* Show banner only on home page (not in search mode) */}
              {!isSearchMode && (
                <div 
                  className="banner" 
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  style={{ 
                    marginBottom: "32px",
                    position: "relative",
                    width: "100%",
                    paddingTop: "42.857%", // 21:9 ratio (ultra-wide cinematic)
                    // paddingTop: "56.25%" for 16:9 ratio
                    // paddingTop: "75%" for 4:3 ratio
                    // paddingTop: "50%" for 2:1 ratio
                    overflow: "hidden",
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                >
                  <div className="banner-track" style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${bannerImages.length * 100}%`,
                    height: "100%",
                    display: "flex",
                    transform: `translateX(-${currentSlide * (100 / bannerImages.length)}%)`,
                    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}>
                    {bannerImages.map((img, i) => (
                      <div className="banner-slide" key={i} style={{
                        flex: `0 0 ${100 / bannerImages.length}%`,
                        height: "100%",
                        position: "relative",
                        background: "#f0f0f0" // Background color nếu ảnh không đầy
                      }}>
                        <img src={img} alt={`Banner ${i + 1}`} style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain", // Hiển thị toàn bộ ảnh, giữ nguyên tỷ lệ
                          objectPosition: "center" // Căn giữa ảnh
                          // objectFit options:
                          // "contain" - Hiển thị toàn bộ ảnh, có thể có khoảng trống
                          // "cover" - Phủ đầy khung, có thể cắt ảnh
                          // "fill" - Kéo dãn ảnh đầy khung (làm méo ảnh)
                          // "scale-down" - Giống contain nhưng không phóng to
                        }} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Previous Button */}
                  <button 
                    onClick={prevSlide}
                    style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "50%",
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "#333",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 1)";
                      e.target.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.9)";
                      e.target.style.transform = "translateY(-50%) scale(1)";
                    }}
                  >
                    ‹
                  </button>
                  
                  {/* Next Button */}
                  <button 
                    onClick={nextSlide}
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "50%",
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "#333",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 1)";
                      e.target.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.9)";
                      e.target.style.transform = "translateY(-50%) scale(1)";
                    }}
                  >
                    ›
                  </button>

                  {/* Dots Navigation */}
                  <div style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "10px",
                    zIndex: 10
                  }}>
                    {bannerImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        style={{
                          width: currentSlide === i ? "32px" : "12px",
                          height: "12px",
                          borderRadius: "6px",
                          border: "none",
                          background: currentSlide === i 
                            ? "rgba(255, 255, 255, 0.95)" 
                            : "rgba(255, 255, 255, 0.5)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                        }}
                        onMouseEnter={(e) => {
                          if (currentSlide !== i) {
                            e.target.style.background = "rgba(255, 255, 255, 0.7)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentSlide !== i) {
                            e.target.style.background = "rgba(255, 255, 255, 0.5)";
                          }
                        }}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Slide Counter */}
                  <div style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    zIndex: 10
                  }}>
                    {currentSlide + 1} / {bannerImages.length}
                  </div>
                </div>
              )}

              {/* Product Grid */}
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
                  {isSearchMode ? `Kết quả tìm kiếm: "${searchQuery}"` : "Tất cả sản phẩm"}
                </h2>
                
                {products.length === 0 ? (
                  <div style={{ padding: "40px", color: "var(--muted)", textAlign: "center" }}>
                    Không có sản phẩm nào để hiển thị
                  </div>
                ) : (
                  <div style={styles.productGrid}>
                    {products.map((product) => (
                      <div key={product.id} style={{ width: "100%", minWidth: 0 }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '24px',
                    gap: '12px'
                  }}>
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: currentPage === 1 ? '#f5f5f5' : '#fff',
                        cursor: currentPage === 1 ? 'default' : 'pointer'
                      }}
                    >
                      Trang trước
                    </button>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {[...Array(totalPages)].map((_, index) => (
                        <button 
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            background: currentPage === (index + 1) ? 'var(--accent)' : '#fff',
                            color: currentPage === (index + 1) ? '#fff' : '#000',
                            cursor: 'pointer'
                          }}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                        cursor: currentPage === totalPages ? 'default' : 'pointer'
                      }}
                    >
                      Trang sau
                    </button>
                  </div>
                )}
              </div>

              {/* Featured Products - only show if not in search mode and have products */}
              {!isSearchMode && featuredProducts.length > 0 && (
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
                    Sản phẩm nổi bật
                  </h2>
                  <div style={styles.productGrid}>
                    {featuredProducts.map((product) => (
                      <div key={`featured-${product.id}`} style={{ width: "100%" }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Grid - only show if not in search mode */}
              {!isSearchMode && (
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
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default HomePage;