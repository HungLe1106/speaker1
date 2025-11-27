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

function PrivacyPage() {
  return (
    <div style={styles.mainContainer}>
      <div style={styles.innerContainer}>
        <div style={styles.content}>
        <h1 style={styles.title}>🔒 Chính Sách Bảo Mật</h1>
        <p style={styles.updateDate}>Cập nhật lần cuối: Tháng 11, 2025</p>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Thu thập thông tin</h2>
          <p style={styles.text}>
            Chúng tôi thu thập thông tin của bạn khi bạn đăng ký tài khoản, đặt hàng, đăng ký nhận bản tin, 
            hoặc tham gia vào các hoạt động khác trên website của chúng tôi.
          </p>
          <p style={styles.text}>Thông tin được thu thập bao gồm:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Họ tên, địa chỉ email, số điện thoại</li>
            <li style={styles.listItem}>Địa chỉ giao hàng và thanh toán</li>
            <li style={styles.listItem}>Thông tin thanh toán (được mã hóa bảo mật)</li>
            <li style={styles.listItem}>Lịch sử mua hàng và tương tác với website</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Sử dụng thông tin</h2>
          <p style={styles.text}>Thông tin của bạn được sử dụng để:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Xử lý đơn hàng và giao hàng</li>
            <li style={styles.listItem}>Cải thiện dịch vụ khách hàng</li>
            <li style={styles.listItem}>Cá nhân hóa trải nghiệm người dùng</li>
            <li style={styles.listItem}>Gửi thông tin về sản phẩm mới và khuyến mãi (nếu bạn đồng ý)</li>
            <li style={styles.listItem}>Phát hiện và ngăn chặn gian lận</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Bảo vệ thông tin</h2>
          <p style={styles.text}>
            Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt để bảo vệ thông tin cá nhân của bạn:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Mã hóa SSL/TLS cho tất cả giao dịch</li>
            <li style={styles.listItem}>Hệ thống firewall và phần mềm diệt virus</li>
            <li style={styles.listItem}>Giới hạn quyền truy cập vào dữ liệu cá nhân</li>
            <li style={styles.listItem}>Định kỳ kiểm tra và cập nhật hệ thống bảo mật</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Chia sẻ thông tin</h2>
          <p style={styles.text}>
            Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba 
            trừ khi:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Cần thiết để hoàn thành giao dịch (vận chuyển, thanh toán)</li>
            <li style={styles.listItem}>Tuân thủ yêu cầu pháp lý</li>
            <li style={styles.listItem}>Bảo vệ quyền lợi của chúng tôi và khách hàng</li>
            <li style={styles.listItem}>Có sự đồng ý của bạn</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Cookies</h2>
          <p style={styles.text}>
            Website của chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng. Cookies giúp 
            chúng tôi hiểu cách bạn sử dụng website và tùy chỉnh nội dung phù hợp.
          </p>
          <p style={styles.text}>
            Bạn có thể chọn từ chối cookies thông qua cài đặt trình duyệt, tuy nhiên điều này có thể 
            ảnh hưởng đến một số tính năng của website.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Quyền của bạn</h2>
          <p style={styles.text}>Bạn có quyền:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Truy cập và xem thông tin cá nhân của mình</li>
            <li style={styles.listItem}>Yêu cầu sửa đổi thông tin không chính xác</li>
            <li style={styles.listItem}>Yêu cầu xóa thông tin cá nhân</li>
            <li style={styles.listItem}>Từ chối nhận email marketing</li>
            <li style={styles.listItem}>Rút lại sự đồng ý bất cứ lúc nào</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Liên hệ</h2>
          <p style={styles.text}>
            Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi:
          </p>
          <p style={styles.text}>
            📧 Email: <strong>letuanhung116@gmail.com</strong><br />
            📞 Hotline: <strong>0833803486</strong>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default PrivacyPage;
