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
    marginBottom: "24px",
    color: "#333"
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
  highlight: {
    background: "#f0f4ff",
    padding: "20px",
    borderRadius: "12px",
    borderLeft: "4px solid #667eea",
    marginBottom: "16px"
  }
};

function AboutPage() {
  return (
    <div style={styles.mainContainer}>
      <div style={styles.innerContainer}>
        <div style={styles.content}>
        <h1 style={styles.title}>👋 Về Chúng Tôi</h1>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Câu chuyện của chúng tôi</h2>
          <p style={styles.text}>
            TuanHungLe Store được thành lập với sứ mệnh mang đến cho khách hàng những sản phẩm chất lượng cao 
            với giá cả hợp lý nhất. Chúng tôi tin rằng mỗi khách hàng đều xứng đáng có được trải nghiệm mua sắm 
            tuyệt vời nhất.
          </p>
          <p style={styles.text}>
            Từ những ngày đầu khởi nghiệp, chúng tôi đã không ngừng nỗ lực để xây dựng một nền tảng thương mại 
            điện tử đáng tin cậy, nơi mọi người có thể tìm thấy những sản phẩm yêu thích của mình một cách dễ dàng.
          </p>
        </div>

        <div style={styles.highlight}>
          <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: "#667eea" }}>
            🎯 Sứ Mệnh
          </h3>
          <p style={{...styles.text, marginBottom: 0}}>
            Trở thành nền tảng thương mại điện tử hàng đầu tại Việt Nam, cung cấp trải nghiệm mua sắm tốt nhất 
            cho khách hàng với sản phẩm đa dạng, chất lượng và dịch vụ tận tâm.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Giá trị cốt lõi</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {[
              { icon: "✨", title: "Chất lượng", desc: "Cam kết sản phẩm chính hãng 100%" },
              { icon: "💙", title: "Uy tín", desc: "Xây dựng niềm tin với khách hàng" },
              { icon: "🚀", title: "Đổi mới", desc: "Không ngừng cải tiến và phát triển" },
              { icon: "🤝", title: "Tận tâm", desc: "Phục vụ khách hàng hết mình" }
            ].map((value, index) => (
              <div key={index} style={{
                padding: "24px",
                background: "#f8f9fa",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>{value.icon}</div>
                <h4 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px", color: "#333" }}>
                  {value.title}
                </h4>
                <p style={{ fontSize: "14px", color: "#666" }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Đội ngũ của chúng tôi</h2>
          <p style={styles.text}>
            Chúng tôi tự hào có đội ngũ nhân viên chuyên nghiệp, nhiệt huyết và giàu kinh nghiệm. 
            Mỗi thành viên đều được đào tạo bài bản và luôn sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Liên hệ với chúng tôi</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={styles.text}>
              <strong>📍 Địa chỉ:</strong> Tp. Hà Nội – Việt Nam
            </p>
            <p style={styles.text}>
              <strong>📞 Hotline:</strong> 0833803486
            </p>
            <p style={styles.text}>
              <strong>📧 Email:</strong> letuanhung116@gmail.com
            </p>
            <p style={styles.text}>
              <strong>⏰ Giờ làm việc:</strong> 8:00 - 22:00 (Tất cả các ngày trong tuần)
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default AboutPage;
