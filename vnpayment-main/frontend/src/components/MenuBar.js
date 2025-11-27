import { Link } from "react-router-dom";
import "./MenuBar.css";

const MenuBar = () => (
  <nav className="menu-bar">
    <div className="container">
      <ul>
        <li>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="fas fa-bars"></i> Tất cả
          </Link>
        </li>
        <li>
          <Link to="/products">
            <i className="fas fa-certificate" style={{ marginRight: "6px" }}></i>
            Sản phẩm mới
          </Link>
        </li>
        <li>
          <Link to="/orders">
            <i className="fas fa-box" style={{ marginRight: "6px" }}></i>
            Đơn hàng của bạn
          </Link>
        </li>
        <li>
          <Link to="/best-sellers">
            <i className="fas fa-fire" style={{ marginRight: "6px" }}></i>
            Sản phẩm bán chạy
          </Link>
        </li>
        <li>
          <Link to="/deals">
            <i className="fas fa-tag" style={{ marginRight: "6px" }}></i>
            Khuyến mãi
          </Link>
        </li>
        <li>
          <Link to="/services">
            <i className="fas fa-headset" style={{ marginRight: "6px" }}></i>
            Dịch vụ khách hàng
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default MenuBar;
