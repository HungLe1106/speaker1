import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AuthForm.css";

function RegisterPage() {
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
        `${process.env.REACT_APP_API || ""}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Register failed");
      
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
      <div className="auth-form-title">Đăng ký</div>
      <form onSubmit={submit}>
        {error && <div className="auth-form-error">{error}</div>}
        <div className="auth-form-group">
          <label className="auth-form-label" htmlFor="register-username">
            Tên đăng nhập
          </label>
          <input
            id="register-username"
            className="auth-form-input"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-form-label" htmlFor="register-password">
            Mật khẩu
          </label>
          <input
            id="register-password"
            className="auth-form-input"
            placeholder="Nhập mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="auth-form-btn" type="submit">
          Đăng ký
        </button>
        <a className="auth-form-link" href="/login">
          Đã có tài khoản? Đăng nhập
        </a>
      </form>
    </div>
  );
}

export default RegisterPage;
