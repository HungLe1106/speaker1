import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import Loading from '../components/Loading';

function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');
  const message = searchParams.get('message');

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const response = await apiService.getOrder(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'success':
        return {
          icon: '✅',
          title: 'Thanh toán thành công!',
          message: 'Đơn hàng của bạn đã được thanh toán thành công.',
          color: 'var(--success)'
        };
      case 'failed':
        return {
          icon: '❌',
          title: 'Thanh toán thất bại',
          message: 'Đã xảy ra lỗi trong quá trình thanh toán.',
          color: 'var(--error)'
        };
      case 'cancelled':
        return {
          icon: '⚠️',
          title: 'Thanh toán bị hủy',
          message: 'Bạn đã hủy bỏ quá trình thanh toán.',
          color: 'var(--warning)'
        };
      default:
        return {
          icon: '❓',
          title: 'Trạng thái không xác định',
          message: message || 'Không thể xác định trạng thái thanh toán.',
          color: 'var(--muted)'
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return <Loading text="Đang kiểm tra trạng thái thanh toán..." />;
  }

  return (
    <div className="card text-center">
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
        {statusInfo.icon}
      </div>
      
      <h2 style={{ color: statusInfo.color, marginBottom: '8px' }}>
        {statusInfo.title}
      </h2>
      
      <p className="text-muted mb-4">
        {statusInfo.message}
      </p>

      {order && (
        <div className="card" style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
          <h3 className="text-center mb-3">Chi tiết đơn hàng</h3>
          
          <div className="flex justify-between mb-2">
            <strong>Mã đơn hàng:</strong>
            <span>{order.id}</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <strong>Trạng thái:</strong>
            <span className={`status ${order.status}`}>
              {order.status}
            </span>
          </div>
          
          <div className="flex justify-between mb-2">
            <strong>Tổng tiền:</strong>
            <span>{order.total.toLocaleString()} VND</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <strong>Phương thức:</strong>
            <span>{order.paymentMethod}</span>
          </div>
          
          {order.paymentInfo?.transactionId && (
            <div className="flex justify-between mb-2">
              <strong>Mã giao dịch:</strong>
              <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                {order.paymentInfo.transactionId}
              </span>
            </div>
          )}
          
          <div className="flex justify-between mb-3">
            <strong>Thời gian:</strong>
            <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            <strong>Sản phẩm:</strong>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-muted mt-1">
                <span>{item.title} x {item.qty}</span>
                <span>{item.subtotal.toLocaleString()} VND</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center mt-4">
        <Link to="/" className="btn">
          Về trang chủ
        </Link>
        <Link to="/orders" className="btn ghost">
          Xem đơn hàng
        </Link>
      </div>

      {status === 'failed' && (
        <div className="mt-3">
          <p className="text-muted" style={{ fontSize: '14px' }}>
            Nếu bạn gặp vấn đề, vui lòng liên hệ với chúng tôi để được hỗ trợ.
          </p>
        </div>
      )}
    </div>
  );
}

export default PaymentResultPage;