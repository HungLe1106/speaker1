import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AuthForm.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_API || ""}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Login failed");
      
      // Handle both old format (data.token, data.user) and new format (data.data.token, data.data.user)
      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;
      
      if (!token || !user) {
        throw new Error("Invalid response format");
      }
      
      login(token, user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-form-container">
      <img src="/images/logo.png" alt="Logo" className="logo" />
      <div className="auth-form-title">Đăng nhập</div>
      <form onSubmit={submit}>
        {error && <div className="auth-form-error">{error}</div>}
        <div className="auth-form-group">
          <label className="auth-form-label" htmlFor="login-username">
            Tên đăng nhập
          </label>
          <input
            id="login-username"
            className="auth-form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-form-label" htmlFor="login-password">
            Mật khẩu
          </label>
          <input
            id="login-password"
            className="auth-form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="auth-form-btn" type="submit">
          Tiếp tục
        </button>
        
        <p style={{ fontSize: "12px", lineHeight: "1.5", margin: "18px 0", color: "#111" }}>
          Bằng cách đăng nhập, bạn đồng ý với các{" "}
          <a href="#" style={{ color: "var(--link)", textDecoration: "none" }}>
            điều khoản sử dụng
          </a>{" "}
          của chúng tôi
        </p>

        <div className="auth-form-divider">
          <span>Bạn chưa có tài khoản?</span>
        </div>

        <a href="/register" className="auth-form-new-btn" style={{ display: "inline-block", textAlign: "center", textDecoration: "none", lineHeight: "29px" }}>
          Tạo tài khoản mới
        </a>
      </form>
    </div>
  );
}

export default LoginPage;
