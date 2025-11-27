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
    padding: "32px",
    boxSizing: "border-box",
    margin: "0 auto"
  },
  content: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "white",
    padding: "48px",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  title: {
    fontSize: "42px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#333"
  },
  updateDate: {
    fontSize: "14px",
    color: "#999",
    marginBottom: "32px"
  },
  section: {
    marginBottom: "32px"
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#667eea"
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#666",
    marginBottom: "16px"
  },
  list: {
    paddingLeft: "24px",
    marginBottom: "16px"
  },
  listItem: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#666",
    marginBottom: "12px"
  }
};

function TermsPage() {
  return (
    <div style={styles.mainContainer}>
      <div style={styles.innerContainer}>
        <div style={styles.content}>
        <h1 style={styles.title}>📜 Điều Khoản Sử Dụng</h1>
        <p style={styles.updateDate}>Cập nhật lần cuối: Tháng 11, 2025</p>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Chấp nhận điều khoản</h2>
          <p style={styles.text}>
            Bằng việc truy cập và sử dụng website TuanHungLe Store, bạn đồng ý tuân thủ các điều khoản 
            và điều kiện sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, 
            vui lòng không sử dụng dịch vụ của chúng tôi.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Tài khoản người dùng</h2>
          <p style={styles.text}>Khi tạo tài khoản, bạn cam kết:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Cung cấp thông tin chính xác và đầy đủ</li>
            <li style={styles.listItem}>Bảo mật thông tin đăng nhập của bạn</li>
            <li style={styles.listItem}>Chịu trách nhiệm cho mọi hoạt động trên tài khoản</li>
            <li style={styles.listItem}>Thông báo ngay cho chúng tôi nếu phát hiện sử dụng trái phép</li>
            <li style={styles.listItem}>Không chia sẻ tài khoản cho người khác</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Sử dụng dịch vụ</h2>
          <p style={styles.text}>Bạn đồng ý không:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
            <li style={styles.listItem}>Vi phạm quyền sở hữu trí tuệ của chúng tôi hoặc bên thứ ba</li>
            <li style={styles.listItem}>Gửi spam, virus hoặc mã độc hại</li>
            <li style={styles.listItem}>Can thiệp vào hoạt động của hệ thống</li>
            <li style={styles.listItem}>Thu thập thông tin người dùng khác trái phép</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Đặt hàng và thanh toán</h2>
          <p style={styles.text}>
            Khi đặt hàng trên website, bạn đồng ý:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Cung cấp thông tin giao hàng chính xác</li>
            <li style={styles.listItem}>Thanh toán đầy đủ theo phương thức đã chọn</li>
            <li style={styles.listItem}>Chúng tôi có quyền từ chối hoặc hủy đơn hàng nếu phát hiện bất thường</li>
            <li style={styles.listItem}>Giá và khuyến mãi có thể thay đổi mà không cần báo trước</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Chính sách đổi trả</h2>
          <p style={styles.text}>
            Chúng tôi chấp nhận đổi trả trong vòng 30 ngày với các điều kiện:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
            <li style={styles.listItem}>Có đầy đủ hóa đơn, tem nhãn, bao bì</li>
            <li style={styles.listItem}>Không áp dụng cho sản phẩm khuyến mãi đặc biệt (trừ lỗi nhà sản xuất)</li>
            <li style={styles.listItem}>Phí vận chuyển đổi trả do khách hàng chịu (trừ lỗi từ chúng tôi)</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Giới hạn trách nhiệm</h2>
          <p style={styles.text}>
            Chúng tôi không chịu trách nhiệm cho:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Thiệt hại gián tiếp, ngẫu nhiên hoặc hệ quả</li>
            <li style={styles.listItem}>Mất mát dữ liệu hoặc lợi nhuận</li>
            <li style={styles.listItem}>Gián đoạn dịch vụ do bảo trì hoặc sự cố kỹ thuật</li>
            <li style={styles.listItem}>Nội dung từ bên thứ ba</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Quyền sở hữu trí tuệ</h2>
          <p style={styles.text}>
            Tất cả nội dung trên website (văn bản, hình ảnh, logo, thiết kế) là tài sản của 
            TuanHungLe Store và được bảo vệ bởi luật bản quyền. Bạn không được sao chép, phân phối 
            hoặc sử dụng cho mục đích thương mại mà không có sự cho phép.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Thay đổi điều khoản</h2>
          <p style={styles.text}>
            Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Phiên bản mới nhất sẽ được 
            đăng trên website và có hiệu lực ngay lập tức. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi 
            đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Luật áp dụng</h2>
          <p style={styles.text}>
            Các điều khoản này được điều chỉnh bởi luật pháp Việt Nam. Mọi tranh chấp phát sinh sẽ 
            được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>10. Liên hệ</h2>
          <p style={styles.text}>
            Nếu bạn có câu hỏi về các điều khoản này, vui lòng liên hệ:
          </p>
          <p style={styles.text}>
            📧 Email: <strong>letuanhung116@gmail.com</strong><br />
            📞 Hotline: <strong>0833803486</strong><br />
            📍 Địa chỉ: <strong>Tp. Hà Nội – Việt Nam</strong>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default TermsPage;
