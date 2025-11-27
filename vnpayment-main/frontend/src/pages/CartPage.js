import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

function CartPage() {
  const navigate = useNavigate();
  const { items, total, itemCount, savings, updateCartItem, removeFromCart, clearCart } =
    useCart();

  const cartItems = Object.values(items);

  const handleQuantityChange = (productId, newQuantity) => {
    if (!productId) {
      console.error("Missing productId in handleQuantityChange");
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      console.log("Updating cart item:", productId, newQuantity);
      updateCartItem(productId, parseInt(newQuantity, 10));
    }
  };

  const handleContinueToCheckout = () => {
    navigate("/checkout");
  };

  if (itemCount === 0) {
    return (
      <div style={{ 
        background: "var(--bg)",
        minHeight: "72vh",
        padding: "14px 18px",
        marginTop: "20px"
      }}>
        <div style={{
          maxWidth: "1500px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center"
        }}>
          <img 
            src="/images/empty-cart.png" 
            alt="Empty Cart"
            style={{
              width: "180px",
              marginBottom: "16px"
            }}
          />
          <h2 style={{
            fontSize: "24px",
            fontWeight: "500",
            color: "var(--text)",
            marginBottom: "8px"
          }}>Giỏ hàng trống</h2>
          <p style={{
            color: "var(--text-muted)",
            marginBottom: "16px"
          }}>
            Bạn chưa có sản phẩm nào trong giỏ hàng.
          </p>
          <Link 
            to="/" 
            style={{
              background: "var(--button-yellow)",
              border: "1px solid #FCD200",
              borderRadius: "8px",
              padding: "8px 30px",
              fontSize: "13px",
              color: "var(--text)",
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--surface)", minHeight: "100vh", padding: "20px" }}>
      <div className="container" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>
          {/* Cart Items */}
          <div style={{ 
            background: "var(--bg)",
            padding: "20px",
            borderRadius: "var(--radius)",
            border: "1px solid #d5d9d9" 
          }}>
            <h1 style={{ 
              fontSize: "28px", 
              marginBottom: "20px",
              color: "var(--text)"
            }}>
              Giỏ hàng ({itemCount} sản phẩm)
            </h1>

            <div style={{ borderTop: "1px solid #d5d9d9", paddingTop: "20px" }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr auto",
                    gap: "20px",
                    padding: "15px 0",
                    borderBottom: "1px solid #d5d9d9",
                    alignItems: "center"
                  }}
                >
                  <img
                    src={item.image || "/images/product-placeholder.png"}
                    alt={item.name}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />

                  <div>
                    <h3 style={{ 
                      fontSize: "18px",
                      marginBottom: "8px",
                      color: "var(--text)"
                    }}>
                      {item.name}
                    </h3>
                    <div style={{ 
                      color: "var(--text)",
                      fontSize: "18px",
                      fontWeight: "500",
                      marginBottom: "10px"
                    }}>
                      {item.discount > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ color: "#B12704", fontSize: "20px", fontWeight: "700" }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                              Math.round(item.price * (1 - item.discount / 100))
                            )}
                          </span>
                          <span style={{ textDecoration: "line-through", color: "#565959", fontSize: "14px" }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </span>
                          <span style={{ 
                            background: "#CC0C39", 
                            color: "white", 
                            padding: "2px 6px", 
                            borderRadius: "4px", 
                            fontSize: "12px",
                            fontWeight: "700"
                          }}>
                            -{item.discount}%
                          </span>
                        </div>
                      )}
                      {!item.discount && (
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <select
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        style={{
                          padding: "8px",
                          border: "1px solid #d5d9d9",
                          borderRadius: "8px",
                          width: "70px"
                        }}
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--link)",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div style={{ 
                    color: "var(--text)",
                    fontSize: "18px",
                    fontWeight: "700"
                  }}>
                    {item.discount > 0 ? (
                      <span style={{ color: "#B12704" }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                          Math.round(item.price * (1 - item.discount / 100)) * item.quantity
                        )}
                      </span>
                    ) : (
                      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ 
            background: "var(--bg)",
            padding: "20px",
            borderRadius: "var(--radius)",
            border: "1px solid #d5d9d9",
            height: "fit-content"
          }}>
            <h2 style={{ 
              fontSize: "18px",
              marginBottom: "15px",
              color: "var(--text)"
            }}>
              Tổng giỏ hàng
            </h2>

            <div style={{ 
              borderTop: "1px solid #d5d9d9",
              paddingTop: "15px"
            }}>
              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "var(--text)"
              }}>
                <span>Tạm tính:</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total + savings)}</span>
              </div>

              {savings > 0 && (
                <div style={{ 
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  color: "#00a650",
                  fontWeight: "600"
                }}>
                  <span>💰 Tiết kiệm:</span>
                  <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(savings)}</span>
                </div>
              )}

              <div style={{ 
                borderTop: "1px solid #d5d9d9",
                marginTop: "15px",
                paddingTop: "15px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "20px",
                fontWeight: "700",
                color: "var(--text)"
              }}>
                <span>Tổng cộng:</span>
                <span style={{ color: "#B12704" }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
              </div>

              <button
                onClick={handleContinueToCheckout}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "var(--button-yellow)",
                  border: "1px solid #FCD200",
                  borderRadius: "8px",
                  marginTop: "20px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "var(--button-yellow-hover)"}
                onMouseOut={(e) => e.currentTarget.style.background = "var(--button-yellow)"}
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
          {/* Main Cart Content */}
          <div style={{ 
            background: "var(--bg)", 
            padding: "20px", 
            borderRadius: "var(--radius)",
            border: "1px solid #d5d9d9",
            boxShadow: "var(--shadow)"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "baseline",
              borderBottom: "1px solid #d5d9d9",
              paddingBottom: "15px",
              marginBottom: "15px"
            }}>
              <h1 style={{ 
                fontSize: "28px", 
                fontWeight: "500",
                color: "var(--text)"
              }}>
                Giỏ hàng
              </h1>
              <button 
                onClick={clearCart}
                style={{
                  color: "var(--link)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Xóa tất cả
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "20px",
                    paddingBottom: "20px",
                    borderBottom: "1px solid #d5d9d9"
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{
                      width: "180px",
                      height: "180px",
                      objectFit: "contain",
                      padding: "10px"
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <Link 
                      to={`/product/${item.id}`}
                      style={{ 
                        fontSize: "18px",
                        color: "var(--link)",
                        textDecoration: "none",
                        display: "block",
                        marginBottom: "8px"
                      }}
                    >
                      {item.title}
                    </Link>
                    
                    <div style={{ 
                      color: "#B12704",
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "8px"
                    }}>
                      ₫{item.price.toLocaleString()}
                    </div>

                    <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "12px" }}>
                      {item.desc}
                    </div>

                    <div style={{ 
                      display: "flex",
                      alignItems: "center",
                      gap: "15px"
                    }}>
                      <select
                        value={item.qty}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "var(--radius)",
                          border: "1px solid #d5d9d9",
                          boxShadow: "0 2px 5px rgba(15,17,17,.05)",
                          background: "#F0F2F2"
                        }}
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <option key={num} value={num}>
                            Số lượng: {num}
                          </option>
                        ))}
                      </select>

                      <div style={{ color: "#565959", fontSize: "14px" }}>|</div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          color: "var(--link)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ 
              textAlign: "right",
              padding: "20px 0",
              fontSize: "18px"
            }}>
              Tổng ({itemCount} sản phẩm): 
              <span style={{ 
                color: "var(--accent)",
                fontWeight: "bold",
                marginLeft: "8px"
              }}>
                ₫{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Checkout Sidebar */}
          <div style={{ 
            background: "var(--bg)",
            padding: "20px",
            borderRadius: "var(--radius)",
            height: "fit-content",
            border: "1px solid #d5d9d9",
            boxShadow: "var(--shadow)"
          }}>
            <div style={{ 
              fontSize: "18px",
              marginBottom: "15px",
              color: "var(--text)"
            }}>
              Tổng ({itemCount} sản phẩm): 
              <span style={{ 
                color: "#B12704",
                fontWeight: "700",
                marginLeft: "8px",
                fontSize: "18px"
              }}>
                ₫{total.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleContinueToCheckout}
              style={{
                width: "100%",
                padding: "8px 10px",
                background: "var(--button-yellow)",
                border: "1px solid #FCD200",
                borderRadius: "8px",
                fontSize: "13px",
                cursor: "pointer",
                marginBottom: "10px",
                boxShadow: "0 2px 5px rgba(15,17,17,.15)"
              }}
              onMouseOver={e => e.currentTarget.style.background = "var(--button-yellow-hover)"}
              onMouseOut={e => e.currentTarget.style.background = "var(--button-yellow)"}
            >
              Thanh toán
            </button>

            <Link
              to="/"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                color: "var(--link)",
                textDecoration: "none",
                fontSize: "14px"
              }}
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
