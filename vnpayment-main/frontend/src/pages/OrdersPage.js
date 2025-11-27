import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const ORDER_STATUSES = [
  { id: 'all', name: 'Tất cả', color: 'var(--muted)' },
  { id: 'pending', name: 'Chờ xác nhận', color: '#b45309' },
  { id: 'processing', name: 'Đang xử lý', color: '#1e3a8a' },
  { id: 'completed', name: 'Đã hoàn thành', color: '#065f46' },
  { id: 'failed', name: 'Thất bại', color: '#991b1b' }
];

function OrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: '1',
      status: 'completed',
      date: '2023-11-04',
      total: 2500000,
      items: [
        { id: 1, name: 'Đồ án website bán hàng', quantity: 1, price: 1500000 },
        { id: 2, name: 'Đồ án website tin tức', quantity: 1, price: 1000000 }
      ]
    },
    {
      id: '2',
      status: 'processing',
      date: '2023-11-03',
      total: 3000000,
      items: [
        { id: 3, name: 'Đồ án quản lý nhân sự', quantity: 1, price: 3000000 }
      ]
    },
    {
      id: '3',
      status: 'pending',
      date: '2023-11-02',
      total: 2000000,
      items: [
        { id: 4, name: 'Đồ án quản lý kho', quantity: 1, price: 2000000 }
      ]
    }
  ]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  },[orders, selectedStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (selectedStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === selectedStatus));
    }
  };

  const getStatusColor = (status) => {
    const statusInfo = ORDER_STATUSES.find(s => s.id === status);
    return statusInfo ? statusInfo.color : 'var(--muted)';
  };

  const getStatusCounts = () => {
    const counts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    return ORDER_STATUSES.map(status => ({
      ...status,
      count: status.id === 'all' ? orders.length : (counts[status.id] || 0)
    }));
  };

  const createSampleOrders = async () => {
    // Tạo đơn hàng mẫu để demo
    const sampleOrders = [
      {
        customer: { name: 'Khách hàng mẫu', phone: '0123456789', address: 'Hà Nội' },
        items: [
          { id: 'p1', qty: 1 }
        ],
        paymentMethod: 'momo',
        shippingAddress: 'Hà Nội'
      },
      {
        customer: { name: 'Khách hàng mẫu 2', phone: '0987654321', address: 'TP.HCM' },
        items: [
          { id: 'p2', qty: 1 }
        ],
        paymentMethod: 'vnpay',
        shippingAddress: 'TP.HCM'
      }
    ];

    try {
      for (const orderData of sampleOrders) {
        await apiService.createOrder(orderData);
      }
      toast.success('Đã tạo đơn hàng mẫu');
      loadOrders();
    } catch (error) {
      console.error('Error creating sample orders:', error);
      toast.error('Không thể tạo đơn hàng mẫu');
    }
  };

  if (loading) {
    return <Loading text="Đang tải danh sách đơn hàng..." />;
  }

  return (
    <div style={{
      maxWidth: '1500px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '0 0 16px 0',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '400',
          color: 'var(--text)'
        }}>
          Đơn hàng của bạn
        </h1>
        <Link 
          to="/" 
          style={{
            color: 'var(--link)',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      {/* Status filter tabs */}
      <div style={{
        display: 'flex',
        gap: '1px',
        marginBottom: '20px',
        borderBottom: '1px solid #DDD'
      }}>
        {getStatusCounts().map(status => (
          <button
            key={status.id}
            onClick={() => setSelectedStatus(status.id)}
            style={{
              padding: '8px 16px',
              background: selectedStatus === status.id ? '#fff' : '#f3f3f3',
              border: 'none',
              borderBottom: selectedStatus === status.id ? '3px solid #e47911' : '3px solid transparent',
              color: selectedStatus === status.id ? '#e47911' : '#444',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: selectedStatus === status.id ? '700' : '400'
            }}
          >
            {status.name} ({status.count})
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div style={{ 
          padding: '32px 20px',
          textAlign: 'center',
          background: 'var(--bg)',
          border: '1px solid #DDD',
          borderRadius: 'var(--radius)'
        }}>
          {orders.length === 0 ? (
            <>
              <img 
                src="/images/box.png" 
                alt="No Orders"
                style={{
                  width: '64px',
                  marginBottom: '16px'
                }}
              />
              <h3 style={{
                fontSize: '21px',
                fontWeight: '400',
                color: 'var(--text)',
                marginBottom: '8px'
              }}>Chưa có đơn hàng nào</h3>
              <p style={{
                color: 'var(--text-muted)',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <Link 
                  to="/"
                  style={{
                    padding: '8px 30px',
                    background: 'var(--button-yellow)',
                    border: '1px solid #FCD200',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontSize: '13px'
                  }}
                >
                  Bắt đầu mua sắm
                </Link>
                <button 
                  onClick={createSampleOrders}
                  style={{
                    padding: '8px 30px',
                    background: '#f0f2f2',
                    border: '1px solid #d5d9d9',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Tạo đơn mẫu
                </button>
              </div>
            </>
          ) : (
            <div style={{
              color: 'var(--text-muted)',
              fontSize: '14px'
            }}>
              Không có đơn hàng nào với trạng thái "{ORDER_STATUSES.find(s => s.id === selectedStatus)?.name}"
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map(order => (
            <div 
              key={order.id} 
              style={{
                background: 'var(--bg)',
                border: '1px solid #DDD',
                borderRadius: 'var(--radius)',
                padding: '20px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid #DDD'
              }}>
                <div>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    marginBottom: '4px'
                  }}>
                    Đơn hàng #{order.id}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                  }}>
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  fontSize: '13px',
                  backgroundColor: `${getStatusColor(order.status)}15`,
                  color: getStatusColor(order.status),
                  borderRadius: '12px',
                  fontWeight: '500'
                }}>
                  {ORDER_STATUSES.find(s => s.id === order.status)?.name || order.status}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                {order.items?.map(item => (
                  <div 
                    key={item.id} 
                    style={{ 
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                      fontSize: '14px'
                    }}
                  >
                    <img 
                      src={item.img || '/images/product-placeholder.png'} 
                      alt={item.title}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain',
                        background: '#fff',
                        padding: '4px'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: 'var(--link)',
                        marginBottom: '4px'
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        color: 'var(--text-muted)',
                        fontSize: '13px'
                      }}>
                        Số lượng: {item.qty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderTop: '1px solid #DDD'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)'
                }}>
                  Phương thức thanh toán: {order.paymentMethod?.toUpperCase() || 'N/A'}
                  {order.paymentInfo?.transactionId && (
                    <div style={{ marginTop: '4px', fontSize: '12px' }}>
                      Mã giao dịch: {order.paymentInfo.transactionId}
                    </div>
                  )}
                </div>
                <div style={{
                  textAlign: 'right'
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    marginBottom: '4px'
                  }}>
                    Tổng cộng:
                  </div>
                  <div style={{
                    fontSize: '18px',
                    color: '#B12704',
                    fontWeight: '700'
                  }}>
                    ₫{order.total?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;