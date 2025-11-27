import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';
import { formatVND } from '../utils/priceUtils';

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'orders' | 'settings'

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Load orders error:', error);
      toast.error('Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Đăng xuất thành công!');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff8800',
      confirmed: '#667eea',
      completed: '#00a650',
      cancelled: '#ff3e3e'
    };
    return colors[status] || '#999';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  return (
    <div style={{ 
      background: 'var(--surface)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '32px',
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(15,17,17,.15)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: 'white',
            fontWeight: '700',
            textTransform: 'uppercase'
          }}>
            {user.username?.charAt(0) || 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#0F1111',
              marginBottom: '8px'
            }}>
              {user.username}
            </h1>
            <div style={{
              display: 'flex',
              gap: '16px',
              color: '#565959',
              fontSize: '14px'
            }}>
              {user.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📧</span>
                  <span>{user.email}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🎖️</span>
                <span style={{
                  background: user.role === 'admin' ? '#ff3e3e' : '#667eea',
                  color: 'white',
                  padding: '2px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {user.role === 'admin' ? 'Admin' : 'Khách hàng'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              background: '#f0f0f0',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#e0e0e0'}
            onMouseOut={(e) => e.currentTarget.style.background = '#f0f0f0'}
          >
            <span>🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 32px',
          marginBottom: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          display: 'flex',
          gap: '24px'
        }}>
          {[
            { id: 'profile', icon: '👤', label: 'Thông tin cá nhân' },
            { id: 'orders', icon: '📦', label: 'Đơn hàng của tôi' },
            { id: 'settings', icon: '⚙️', label: 'Cài đặt' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#565959',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          minHeight: '400px'
        }}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0F1111',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>👤</span>
                <span>Thông tin cá nhân</span>
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div style={{
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#565959',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    Tên đăng nhập
                  </div>
                  <div style={{
                    fontSize: '18px',
                    color: '#0F1111',
                    fontWeight: '600'
                  }}>
                    {user.username}
                  </div>
                </div>

                <div style={{
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#565959',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    Email
                  </div>
                  <div style={{
                    fontSize: '18px',
                    color: '#0F1111',
                    fontWeight: '600'
                  }}>
                    {user.email || 'Chưa cập nhật'}
                  </div>
                </div>

                <div style={{
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#565959',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    Vai trò
                  </div>
                  <div style={{
                    fontSize: '18px',
                    color: '#0F1111',
                    fontWeight: '600'
                  }}>
                    {user.role === 'admin' ? '👑 Admin' : '🛍️ Khách hàng'}
                  </div>
                </div>

                <div style={{
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#565959',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    Số điện thoại
                  </div>
                  <div style={{
                    fontSize: '18px',
                    color: '#0F1111',
                    fontWeight: '600'
                  }}>
                    {user.profile?.phone || 'Chưa cập nhật'}
                  </div>
                </div>

                <div style={{
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  gridColumn: '1 / -1'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#565959',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    Địa chỉ
                  </div>
                  <div style={{
                    fontSize: '18px',
                    color: '#0F1111',
                    fontWeight: '600'
                  }}>
                    {user.profile?.address?.fullAddress || 'Chưa cập nhật'}
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '32px',
                padding: '24px',
                background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f5 100%)',
                borderRadius: '12px',
                border: '2px solid #e8e8ff'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#0F1111',
                  marginBottom: '16px'
                }}>
                  📊 Thống kê tài khoản
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                      {orders.length}
                    </div>
                    <div style={{ fontSize: '14px', color: '#565959' }}>
                      Tổng đơn hàng
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#00a650' }}>
                      {orders.filter(o => o.status === 'completed').length}
                    </div>
                    <div style={{ fontSize: '14px', color: '#565959' }}>
                      Hoàn thành
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#ff8800' }}>
                      {orders.filter(o => o.status === 'pending').length}
                    </div>
                    <div style={{ fontSize: '14px', color: '#565959' }}>
                      Đang xử lý
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0F1111',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>📦</span>
                <span>Đơn hàng của tôi</span>
              </h2>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <div style={{
                    display: 'inline-block',
                    width: '50px',
                    height: '50px',
                    border: '5px solid #f3f3f3',
                    borderTop: '5px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <p style={{ marginTop: '16px', color: '#565959' }}>Đang tải đơn hàng...</p>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
                </div>
              ) : orders.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px',
                  color: '#565959'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Chưa có đơn hàng nào</h3>
                  <p style={{ marginBottom: '24px' }}>Hãy mua sắm ngay để nhận ưu đãi!</p>
                  <Link
                    to="/"
                    style={{
                      display: 'inline-block',
                      padding: '12px 32px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '10px',
                      fontWeight: '600'
                    }}
                  >
                    🛍️ Khám phá sản phẩm
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        padding: '24px',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        border: '2px solid #e0e0e0',
                        transition: 'all 0.3s'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#0F1111',
                            marginBottom: '4px'
                          }}>
                            Đơn hàng #{order.orderNumber || order.id}
                          </div>
                          <div style={{ fontSize: '14px', color: '#565959' }}>
                            {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div style={{
                          padding: '6px 16px',
                          background: getStatusColor(order.status),
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          {getStatusText(order.status)}
                        </div>
                      </div>

                      <div style={{
                        padding: '16px',
                        background: 'white',
                        borderRadius: '8px',
                        marginBottom: '16px'
                      }}>
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              gap: '12px',
                              paddingBottom: '12px',
                              marginBottom: '12px',
                              borderBottom: idx < order.items.length - 1 ? '1px solid #e0e0e0' : 'none'
                            }}
                          >
                            <img
                              src={item.img}
                              alt={item.title}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '6px'
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#0F1111',
                                marginBottom: '4px'
                              }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: '13px', color: '#565959' }}>
                                Số lượng: {item.qty}
                              </div>
                            </div>
                            <div style={{
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#ff3e3e'
                            }}>
                              {formatVND(item.price * item.qty)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '14px', color: '#565959' }}>
                          Phương thức: <strong>{order.paymentMethod === 'momo' ? 'MoMo' : order.paymentMethod === 'cod' ? 'COD' : 'Khác'}</strong>
                        </div>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#ff3e3e'
                        }}>
                          Tổng: {formatVND(order.total)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0F1111',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>⚙️</span>
                <span>Cài đặt tài khoản</span>
              </h2>

              <div style={{
                padding: '24px',
                background: '#fff8e1',
                borderRadius: '12px',
                border: '2px solid #ffe082',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Đang phát triển</h3>
                <p style={{ color: '#565959', fontSize: '14px' }}>
                  Tính năng cài đặt tài khoản sẽ sớm được cập nhật
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;