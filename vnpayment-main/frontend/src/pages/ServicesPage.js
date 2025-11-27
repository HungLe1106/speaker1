import { useState } from "react";

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
  hero: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "60px 40px",
    borderRadius: "16px",
    color: "white",
    textAlign: "center",
    marginBottom: "40px"
  },
  title: {
    fontSize: "42px",
    fontWeight: "700",
    marginBottom: "16px"
  },
  subtitle: {
    fontSize: "18px",
    opacity: 0.95
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "40px"
  },
  card: {
    background: "white",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s, box-shadow 0.3s"
  },
  cardIcon: {
    fontSize: "48px",
    marginBottom: "16px"
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#333"
  },
  cardText: {
    fontSize: "15px",
    color: "#666",
    lineHeight: "1.6"
  },
  faqSection: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    marginBottom: "40px"
  },
  faqTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "32px",
    color: "#333",
    textAlign: "center"
  },
  faqItem: {
    borderBottom: "1px solid #eee",
    padding: "20px 0"
  },
  question: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  answer: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
    paddingLeft: "20px"
  },
  contactSection: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    padding: "48px 40px",
    borderRadius: "16px",
    color: "white",
    textAlign: "center"
  },
  contactTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "16px"
  },
  contactInfo: {
    fontSize: "18px",
    marginBottom: "24px"
  },
  contactButton: {
    padding: "14px 32px",
    background: "white",
    color: "#f5576c",
    border: "none",
    borderRadius: "24px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.3s"
  }
};

function ServicesPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const services = [
    {
      icon: "🚚",
      title: "Giao hàng nhanh chóng",
      description: "Giao hàng trong vòng 2-3 ngày trên toàn quốc. Miễn phí ship cho đơn hàng trên 500.000đ."
    },
    {
      icon: "🔄",
      title: "Đổi trả dễ dàng",
      description: "Chính sách đổi trả trong 30 ngày. Hoàn tiền 100% nếu sản phẩm lỗi từ nhà sản xuất."
    },
    {
      icon: "💳",
      title: "Thanh toán an toàn",
      description: "Hỗ trợ đa dạng phương thức: MoMo, VNPay, COD, chuyển khoản ngân hàng."
    },
    {
      icon: "🎁",
      title: "Tích điểm thưởng",
      description: "Tích điểm cho mỗi đơn hàng. Đổi điểm lấy voucher và quà tặng hấp dẫn."
    },
    {
      icon: "👥",
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ tư vấn chuyên nghiệp, sẵn sàng hỗ trợ bạn mọi lúc mọi nơi."
    },
    {
      icon: "✅",
      title: "Bảo hành chính hãng",
      description: "Cam kết sản phẩm chính hãng 100%. Bảo hành theo quy định nhà sản xuất."
    }
  ];

  const faqs = [
    {
      question: "Làm thế nào để theo dõi đơn hàng của tôi?",
      answer: "Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và truy cập phần 'Đơn hàng & Lịch sử'. Hoặc sử dụng mã đơn hàng được gửi qua email để tra cứu."
    },
    {
      question: "Chính sách đổi trả như thế nào?",
      answer: "Chúng tôi chấp nhận đổi trả trong vòng 30 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng và có đầy đủ hóa đơn, bao bì."
    },
    {
      question: "Thời gian giao hàng là bao lâu?",
      answer: "Thời gian giao hàng thông thường là 2-3 ngày làm việc tại nội thành và 3-5 ngày tại các tỉnh thành khác. Với đơn hàng gấp, bạn có thể chọn giao hàng hỏa tốc trong 24h."
    },
    {
      question: "Có được thanh toán khi nhận hàng không?",
      answer: "Có, chúng tôi hỗ trợ thanh toán khi nhận hàng (COD) cho tất cả các đơn hàng trên toàn quốc."
    },
    {
      question: "Làm thế nào để liên hệ với bộ phận hỗ trợ?",
      answer: "Bạn có thể liên hệ qua hotline: 0833803486, email: letuanhung116@gmail.com, hoặc chat trực tiếp trên website."
    },
    {
      question: "Sản phẩm có được bảo hành không?",
      answer: "Tất cả sản phẩm đều được bảo hành chính hãng theo quy định của nhà sản xuất. Thời gian bảo hành được ghi rõ trên phiếu bảo hành kèm theo sản phẩm."
    }
  ];

  return (
    <div style={styles.mainContainer}>
      <div style={styles.innerContainer}>
        {/* Hero Section */}
        <div style={styles.hero}>
        <h1 style={styles.title}>🛡️ Dịch Vụ Khách Hàng</h1>
        <p style={styles.subtitle}>
          Chúng tôi luôn đồng hành cùng bạn trong mọi trải nghiệm mua sắm
        </p>
      </div>

      {/* Services Grid */}
      <div style={styles.grid}>
        {services.map((service, index) => (
          <div 
            key={index} 
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            <div style={styles.cardIcon}>{service.icon}</div>
            <h3 style={styles.cardTitle}>{service.title}</h3>
            <p style={styles.cardText}>{service.description}</p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div style={styles.faqSection}>
        <h2 style={styles.faqTitle}>❓ Câu Hỏi Thường Gặp</h2>
        {faqs.map((faq, index) => (
          <div key={index} style={styles.faqItem}>
            <div 
              style={styles.question}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <span>{faq.question}</span>
              <span style={{ fontSize: "20px" }}>
                {openFaq === index ? "−" : "+"}
              </span>
            </div>
            {openFaq === index && (
              <div style={styles.answer}>{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div style={styles.contactSection}>
        <h2 style={styles.contactTitle}>📞 Cần Hỗ Trợ Thêm?</h2>
        <p style={styles.contactInfo}>
          Liên hệ ngay với chúng tôi<br />
          Hotline: <strong>0833803486</strong><br />
          Email: <strong>letuanhung116@gmail.com</strong>
        </p>
        <button 
          style={styles.contactButton}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          onClick={() => window.location.href = "mailto:letuanhung116@gmail.com"}
        >
          Gửi Email Cho Chúng Tôi
        </button>
      </div>
      </div>
    </div>
  );
}

export default ServicesPage;
