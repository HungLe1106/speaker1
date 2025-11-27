import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{ 
      width: "100vw",
      marginTop: "auto",
      marginLeft: "calc(-50vw + 50%)",
      marginRight: "calc(-50vw + 50%)",
      overflowX: "hidden"
    }}>
      <div style={{
        background: "#232F3E",
        color: "#fff",
        padding: "40px 0",
        width: "100%"
      }}>
        <div className="container" style={{ 
          maxWidth: "1000px", 
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          padding: "0 20px"
        }}>
          <div>
            <h3 style={{ 
              fontSize: "16px", 
              fontWeight: "700",
              marginBottom: "15px"
            }}>
              Về chúng tôi
            </h3>
            <ul style={{ 
              listStyle: "none",
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: "10px" }}>
                <Link to="/about" style={{ 
                  color: "#DDD",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  Giới thiệu
                </Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <a href="#" style={{ 
                  color: "#DDD",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  Tuyển dụng
                </a>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <Link to="/terms" style={{ 
                  color: "#DDD",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ 
              fontSize: "16px", 
              fontWeight: "700",
              marginBottom: "15px"
            }}>
              Hỗ trợ khách hàng
            </h3>
            <ul style={{ 
              listStyle: "none",
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: "10px" }}>
                <Link to="/services" style={{ 
                  color: "#DDD",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <Link to="/privacy" style={{ 
                  color: "#DDD",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  Chính sách bảo mật
                </Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <Link to="/terms" style={{ 
                  color: "#DDD",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  Chính sách đổi trả
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ 
              fontSize: "16px", 
              fontWeight: "700",
              marginBottom: "15px"
            }}>
              Phương thức thanh toán
            </h3>
            <ul style={{ 
              listStyle: "none",
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: "10px" }}>
                <a href="#" style={{ 
                  color: "#DDD",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  MoMo
                </a>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <a href="#" style={{ 
                  color: "#DDD",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  VNPay
                </a>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <a href="#" style={{ 
                  color: "#DDD",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  Chuyển khoản
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ 
              fontSize: "16px", 
              fontWeight: "700",
              marginBottom: "15px"
            }}>
              Kết nối với chúng tôi
            </h3>
            <div style={{ 
              display: "flex",
              gap: "15px",
              marginBottom: "15px"
            }}>
              <span style={{ fontSize: "24px", cursor: "pointer" }}>📘</span>
              <span style={{ fontSize: "24px", cursor: "pointer" }}>📸</span>
              <span style={{ fontSize: "24px", cursor: "pointer" }}>▶️</span>
              <span style={{ fontSize: "24px", cursor: "pointer" }}>🐦</span>
            </div>
            <p style={{ fontSize: "14px", color: "#DDD", lineHeight: "1.4" }}>
              Liên hệ hỗ trợ: <strong>0833803486</strong>
              <br />
              Email: letuanhung116@gmail.com
              <br />
              Địa chỉ: Tp.Hà Nội – Việt Nam
            </p>
          </div>
        </div>
      </div>

      <div style={{
        background: "#131A22",
        color: "#DDD",
        padding: "20px 0",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "14px" }}>
          © 2025 — TuanHungLe Store | From Hung Le with love ❤️
        </div>
      </div>
    </footer>
  );
}

export default Footer;
