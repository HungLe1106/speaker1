import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { apiService } from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

function CheckoutPage() {
  const navigate = useNavigate();
  const { getCartItems, total, clearCart } = useCart();
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'momo'
  });

  const cartItems = getCartItems();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    loadPaymentMethods();
  }, [cartItems.length, navigate]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPaymentMethods();
      setPaymentMethods(response.data);
      
      // Set first enabled method as default
      const enabledMethod = response.data.find(method => method.enabled);
      if (enabledMethod) {
        setFormData(prev => ({ ...prev, paymentMethod: enabledMethod.id }));
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error('Không thể tải phương thức thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin giao hàng');
      return;
    }

    try {
      setSubmitting(true);
      
      // Create order
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        },
        items: cartItems.map(item => ({
          id: item.id,
          qty: item.qty
        })),
        paymentMethod: formData.paymentMethod,
        shippingAddress: formData.address
      };

      const orderResponse = await apiService.createOrder(orderData);
      const order = orderResponse.data;

      // Create payment
      const paymentResponse = await apiService.createPayment(
        order.id, 
        formData.paymentMethod
      );

      if (paymentResponse.success) {
        // Clear cart after successful order creation
        clearCart();
        
        // Open payment URL in new tab
        window.open(paymentResponse.data.payUrl, '_blank');
      } else {
        toast.error('Không thể tạo link thanh toán');
      }
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'Không thể tạo đơn hàng');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="card text-center">
        <h2>Giỏ hàng trống</h2>
        <p className="text-muted">Không có sản phẩm nào để thanh toán.</p>
        <Link to="/" className="btn">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  if (loading) {
    return <Loading text="Đang tải thông tin thanh toán..." />;
  }

  return (
    <div style={{ background: "#EAEDED", minHeight: "100vh", padding: "20px" }}>
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "20px"
        }}>
          {/* Main Checkout Form */}
          <div>
            <div style={{ 
              background: "#fff",
              borderRadius: "4px",
              padding: "20px",
              marginBottom: "20px"
            }}>
              <h1 style={{ 
                fontSize: "28px",
                fontWeight: "normal",
                marginBottom: "20px",
                color: "#0F1111"
              }}>
                Thanh toán
              </h1>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "30px" }}>
                  <h2 style={{ 
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#0F1111",
                    marginBottom: "15px"
                  }}>
                    Địa chỉ giao hàng
                  </h2>

                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ 
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      color: "#0F1111"
                    }}>
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #D5D9D9",
                        borderRadius: "8px",
                        fontSize: "14px"
                      }}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ 
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      color: "#0F1111"
                    }}>
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #D5D9D9",
                        borderRadius: "8px",
                        fontSize: "14px"
                      }}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ 
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      color: "#0F1111"
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #D5D9D9",
                        borderRadius: "8px",
                        fontSize: "14px"
                      }}
                      placeholder="Nhập email"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ 
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      color: "#0F1111"
                    }}>
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #D5D9D9",
                        borderRadius: "8px",
                        fontSize: "14px"
                      }}
                      placeholder="Số, đường, phường, quận, thành phố"
                      required
                    />
                  </div>
                </div>

                <div>
                  <h2 style={{ 
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#0F1111",
                    marginBottom: "15px"
                  }}>
                    Phương thức thanh toán
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {paymentMethods.map(method => (
                      <label 
                        key={method.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px",
                          border: `1px solid ${formData.paymentMethod === method.id ? '#D5A569' : '#D5D9D9'}`,
                          borderRadius: "8px",
                          cursor: "pointer",
                          background: formData.paymentMethod === method.id ? '#FEF8F1' : '#fff'
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          disabled={!method.enabled}
                          style={{ width: "20px", height: "20px" }}
                        />
                        <span style={{ fontSize: "24px" }}>{method.icon}</span>
                        <div>
                          <div style={{ 
                            fontSize: "16px",
                            fontWeight: formData.paymentMethod === method.id ? "bold" : "normal",
                            color: "#0F1111"
                          }}>
                            {method.name}
                          </div>
                          <div style={{ fontSize: "14px", color: "#565959" }}>
                            {method.description}
                          </div>
                          {!method.enabled && (
                            <div style={{ fontSize: "12px", color: "var(--error)" }}>
                              Tạm thời không khả dụng
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ 
            background: "#fff",
            borderRadius: "4px",
            padding: "20px",
            height: "fit-content"
          }}>
            <button 
              onClick={handleSubmit}
              disabled={submitting || !paymentMethods.some(m => m.enabled)}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                fontWeight: "500",
                background: submitting ? "#DDD" : "var(--button-yellow)",
                border: "1px solid #FCD200",
                borderRadius: "8px",
                cursor: submitting ? "not-allowed" : "pointer",
                marginBottom: "15px",
                boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)",
                color: "#0F1111"
              }}
              onMouseOver={e => {
                if (!submitting) e.currentTarget.style.background = "var(--button-yellow-hover)";
              }}
              onMouseOut={e => {
                if (!submitting) e.currentTarget.style.background = "var(--button-yellow)";
              }}
            >
              {submitting ? "Đang xử lý..." : "Đặt hàng ngay"}
            </button>

            <div style={{ 
              borderTop: "1px solid #DDD",
              paddingTop: "15px"
            }}>
              <h3 style={{ 
                fontSize: "18px",
                color: "#0F1111",
                marginBottom: "15px"
              }}>
                Chi tiết đơn hàng
              </h3>

              {cartItems.map(item => (
                <div 
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    marginBottom: "10px"
                  }}
                >
                  <div style={{ color: "#565959" }}>
                    {item.title} x {item.qty}
                  </div>
                  <div style={{ color: "#0F1111" }}>
                    ₫{(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
              ))}

              <div style={{
                borderTop: "1px solid #DDD",
                marginTop: "15px",
                paddingTop: "15px",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#0F1111",
                display: "flex",
                justifyContent: "space-between"
              }}>
                <div>Tổng cộng:</div>
                <div style={{ color: "var(--accent)" }}>₫{total.toLocaleString()}</div>
              </div>
            </div>

            <Link 
              to="/cart"
              style={{
                display: "block",
                textAlign: "center",
                color: "var(--link)",
                textDecoration: "none",
                fontSize: "14px",
                marginTop: "15px"
              }}
            >
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;