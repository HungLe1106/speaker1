import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { formatVND, calculateDiscountPrice, formatDiscount } from '../utils/priceUtils';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProduct(id);
      setProduct(response.data);
      // Set initial selected image to main img
      setSelectedImage(response.data.img);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Không thể tải thông tin sản phẩm');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return <Loading text="Đang tải thông tin sản phẩm..." />;
  }

  if (!product) {
    return (
      <div className="card text-center">
        <h2>Không tìm thấy sản phẩm</h2>
        <p className="text-muted">Sản phẩm bạn đang tìm không tồn tại.</p>
        <Link to="/" className="btn">Về trang chủ</Link>
      </div>
    );
  }

  const hasDiscount = product.discount && product.discount > 0;
  const finalPrice = hasDiscount ? calculateDiscountPrice(product.price, product.discount) : product.price;
  const savings = hasDiscount ? product.price - finalPrice : 0;

  // Combine all images (main + additional images)
  const allImages = product.images && product.images.length > 0 
    ? [product.img, ...product.images.filter(img => img !== product.img)]
    : [product.img];

  // Handle image selection
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', background: 'white' }}>
      <Link to="/" className="btn ghost mb-3" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px',
        color: '#007185',
        textDecoration: 'none',
        padding: '8px 0',
        fontWeight: '600'
      }}>
        ← Trở về
      </Link>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '500px 1fr', 
        gap: '48px',
        padding: '20px 0'
      }}>
          {/* Left: Image Gallery */}
          <div style={{ position: 'relative', padding: '20px', border: '1px solid #D5D9D9', borderRadius: '8px', background: '#FFFFFF' }}>
            {hasDiscount && (
              <div style={{
                position: 'absolute',
                top: '30px',
                left: '30px',
                background: '#CC0C39',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '700',
                zIndex: 10
              }}>
                {formatDiscount(product.discount)} OFF
              </div>
            )}
            
            {/* Main Image Display */}
            <div style={{
              width: '100%',
              height: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFFFFF',
              borderRadius: '4px',
              marginBottom: '16px'
            }}>
              <img 
                src={selectedImage || product.img} 
                alt={product.title}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  cursor: 'zoom-in'
                }}
                onClick={() => window.open(selectedImage || product.img, '_blank')}
              />
            </div>
            
            {/* Image Thumbnails */}
            {allImages.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                padding: '8px 0'
              }}>
                {allImages.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleImageClick(img)}
                    style={{
                      minWidth: '60px',
                      width: '60px',
                      height: '60px',
                      border: selectedImage === img ? '2px solid #FF9900' : '1px solid #D5D9D9',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      background: '#FFFFFF'
                    }}
                    onMouseOver={(e) => {
                      if (selectedImage !== img) {
                        e.currentTarget.style.borderColor = '#FF9900';
                        e.currentTarget.style.opacity = '0.8';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedImage !== img) {
                        e.currentTarget.style.borderColor = '#D5D9D9';
                        e.currentTarget.style.opacity = '1';
                      }
                    }}
                  >
                    <img 
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right: Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Title */}
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '400',
              lineHeight: '1.4',
              color: '#0F1111',
              margin: 0
            }}>
              {product.title}
            </h1>

            {/* Divider */}
            <div style={{ height: '1px', background: '#D5D9D9' }} />

            {/* Rating & Sold */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {product.rating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: '#FFA41C', fontSize: '16px' }}>
                    {'★'.repeat(Math.round(product.rating))}
                    {'☆'.repeat(5 - Math.round(product.rating))}
                  </div>
                  <span style={{ color: '#007185', fontSize: '14px', cursor: 'pointer' }}>
                    {product.ratingCount || 0} ratings
                  </span>
                </div>
              )}
              {product.sold > 0 && (
                <div style={{ 
                  color: '#565959', 
                  fontSize: '14px'
                }}>
                  | {product.sold} bought in past month
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#D5D9D9' }} />

            {/* Price Section */}
            <div style={{
              padding: '16px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                {hasDiscount && (
                  <div style={{
                    fontSize: '14px',
                    color: '#565959',
                    textDecoration: 'line-through'
                  }}>
                    List Price: {formatVND(product.price)}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                {hasDiscount && (
                  <div style={{
                    background: '#CC0C39',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}>
                    {formatDiscount(product.discount)}
                  </div>
                )}
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: '400',
                  color: '#B12704',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px'
                }}>
                  {formatVND(finalPrice)}
                </div>
              </div>
              
              {hasDiscount && (
                <div style={{
                  marginTop: '8px',
                  color: '#067D62',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  You Save: {formatVND(savings)} ({formatDiscount(product.discount)})
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#D5D9D9' }} />

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: product.stock === 0 ? '#FEF5F5' : product.stock < 10 ? '#FFF8E1' : '#F2FAF3',
                border: `1px solid ${product.stock === 0 ? '#F4CFCF' : product.stock < 10 ? '#FFE082' : '#C6EFCE'}`,
                fontSize: '14px',
                fontWeight: '600',
                color: product.stock === 0 ? '#B12704' : product.stock < 10 ? '#B86E00' : '#067D62'
              }}>
                {product.stock === 0 ? 'Currently unavailable' : product.stock < 10 ? `Only ${product.stock} left in stock - order soon` : 'In Stock'}
              </div>
            )}
            
            {/* Quantity Selector */}
            <div style={{
              padding: '16px',
              border: '1px solid #D5D9D9',
              borderRadius: '8px',
              background: '#F7F8F8'
            }}>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '8px',
                color: '#0F1111'
              }}>
                Quantity:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select 
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(15,17,17,.15) inset'
                  }}
                >
                  {[...Array(Math.min(product.stock || 10, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '12px',
              marginTop: '8px'
            }}>
              <button 
                className="btn" 
                onClick={handleAddToCart}
                disabled={isInCart(product.id) || product.stock === 0}
                style={{
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '20px',
                  background: isInCart(product.id) || product.stock === 0 
                    ? '#D5D9D9' 
                    : 'linear-gradient(to bottom, #FFD814, #F7CA00)',
                  color: '#0F1111',
                  border: '1px solid',
                  borderColor: isInCart(product.id) || product.stock === 0 ? '#D5D9D9' : '#FCD200',
                  cursor: isInCart(product.id) || product.stock === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: isInCart(product.id) || product.stock === 0 ? 'none' : '0 2px 5px rgba(213,217,217,.5)'
                }}
              >
                {isInCart(product.id) 
                  ? `✓ In Cart (${getItemQuantity(product.id)})`
                  : product.stock === 0
                  ? 'Out of Stock'
                  : 'Add to Cart'
                }
              </button>
              <button 
                className="btn" 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                style={{
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '20px',
                  background: product.stock === 0 
                    ? '#D5D9D9' 
                    : 'linear-gradient(to bottom, #FFA724, #FF8F00)',
                  color: '#0F1111',
                  border: '1px solid',
                  borderColor: product.stock === 0 ? '#D5D9D9' : '#FF8F00',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: product.stock === 0 ? 'none' : '0 2px 5px rgba(213,217,217,.5)'
                }}
              >
                {product.stock === 0 ? 'Currently Unavailable' : 'Buy Now'}
              </button>
            </div>

            {/* Brand & Specifications */}
            {(product.brand || product.specifications || product.desc) && (
              <>
                <div style={{ height: '1px', background: '#D5D9D9', margin: '16px 0' }} />
                <div>
                  <h2 style={{ 
                    fontSize: '16px', 
                    fontWeight: '700', 
                    marginBottom: '12px',
                    color: '#0F1111'
                  }}>
                    Product Details
                  </h2>
                  
                  {product.desc && (
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#0F1111',
                      lineHeight: '1.6',
                      marginBottom: '16px'
                    }}>
                      {product.desc}
                    </p>
                  )}
                  
                  <div style={{
                    fontSize: '14px',
                    color: '#0F1111'
                  }}>
                    {product.brand && (
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '140px 1fr',
                        marginBottom: '8px',
                        padding: '8px 0',
                        borderTop: '1px solid #E7E7E7'
                      }}>
                        <span style={{ fontWeight: '700' }}>Brand</span>
                        <span>{product.brand}</span>
                      </div>
                    )}
                    {product.category && (
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '140px 1fr',
                        marginBottom: '8px',
                        padding: '8px 0',
                        borderTop: '1px solid #E7E7E7'
                      }}>
                        <span style={{ fontWeight: '700' }}>Category</span>
                        <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
                      </div>
                    )}
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '140px 1fr',
                        marginBottom: '8px',
                        padding: '8px 0',
                        borderTop: '1px solid #E7E7E7'
                      }}>
                        <span style={{ fontWeight: '700' }}>{key}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      {/* Remove pulse animation */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductDetailPage;