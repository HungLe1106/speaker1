import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { formatVND, calculateDiscountPrice, formatDiscount } from "../utils/priceUtils";

function ProductCard({ product }) {
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const hasDiscount = product.discount && product.discount > 0;
  const finalPrice = hasDiscount ? calculateDiscountPrice(product.price, product.discount) : product.price;

  return (
    <div 
      className="product-card"
      style={{
        background: "#fff",
        padding: "16px",
        borderRadius: "8px",
        transition: "all 0.2s",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        border: "1px solid #D5D9D9",
        boxShadow: "0 0 0 1px rgba(0,0,0,.05)"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(15,17,17,.15)";
        e.currentTarget.style.borderColor = "#C7511F";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 0 0 1px rgba(0,0,0,.05)";
        e.currentTarget.style.borderColor = "#D5D9D9";
      }}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          background: '#CC0C39',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '700',
          zIndex: 10
        }}>
          {formatDiscount(product.discount)}
        </div>
      )}

      <Link 
        to={`/product/${product.id}`} 
        style={{ textDecoration: "none", color: "inherit", flex: 1, display: "flex", flexDirection: "column" }}
      >
        <div style={{ 
          height: "180px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          marginBottom: "12px",
          overflow: "hidden",
          background: "#f8f8f8",
          borderRadius: "4px",
          padding: "8px"
        }}>
          <img 
            src={product.img} 
            alt={product.title} 
            style={{ 
              maxHeight: "100%", 
              maxWidth: "100%", 
              objectFit: "contain"
            }}
          />
        </div>
        
        <h3 style={{ 
          fontSize: "14px", 
          margin: "0 0 8px 0",
          color: "#0F1111",
          fontWeight: "400",
          lineHeight: "1.3",
          minHeight: "37px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }}>
          {product.title}
        </h3>
        
        {/* Price Section */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ 
            fontSize: "20px", 
            fontWeight: "400",
            color: "#B12704",
            marginBottom: hasDiscount ? "4px" : "0"
          }}>
            <span style={{ fontSize: "12px", position: "relative", top: "-5px" }}>₫</span>
            {finalPrice.toLocaleString()}
          </div>
          {hasDiscount && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span style={{
                fontSize: "13px",
                color: "#565959",
                textDecoration: "line-through"
              }}>
                ₫{product.price.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Rating */}
        {product.rating > 0 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            marginBottom: "8px"
          }}>
            <span style={{ color: "#FFA41C", letterSpacing: "1px" }}>
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span style={{ color: "#007185" }}>
              {product.ratingCount || 0}
            </span>
          </div>
        )}

        {/* Stock & Sold Info */}
        {(product.stock > 0 || product.sold > 0) && (
          <div style={{
            fontSize: "12px",
            color: "#565959",
            marginBottom: "8px"
          }}>
            {product.stock > 0 && product.stock < 10 && (
              <div style={{ color: "#B12704", fontWeight: "500" }}>
                Chỉ còn {product.stock} sản phẩm
              </div>
            )}
            {product.sold > 0 && (
              <div>
                Đã bán: {product.sold}+
              </div>
            )}
          </div>
        )}
      </Link>

      <div style={{ marginTop: "auto", paddingTop: "8px" }}>
        <button
          onClick={handleAddToCart}
          disabled={isInCart(product.id) || product.stock === 0}
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: "13px",
            fontWeight: "400",
            borderRadius: "8px",
            border: isInCart(product.id) || product.stock === 0 ? "1px solid #D5D9D9" : "1px solid #FCD200",
            background: isInCart(product.id) || product.stock === 0 
              ? "#F0F0F0" 
              : "#FFD814",
            color: isInCart(product.id) || product.stock === 0 ? "#888" : "#0F1111",
            cursor: isInCart(product.id) || product.stock === 0 ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)"
          }}
          onMouseOver={(e) => {
            if (!isInCart(product.id) && product.stock > 0) {
              e.currentTarget.style.background = "#F7CA00";
            }
          }}
          onMouseOut={(e) => {
            if (!isInCart(product.id) && product.stock > 0) {
              e.currentTarget.style.background = "#FFD814";
            }
          }}
        >
          {product.stock === 0 
            ? "Hết hàng"
            : isInCart(product.id)
              ? `Trong giỏ (${getItemQuantity(product.id)})`
              : "Thêm vào giỏ"
          }
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
