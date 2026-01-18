import React, { useState } from "react";
import "./Login.css";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    // Email validation
    if (!email.includes("@")) {
      setEmailError("Enter a valid email");
      valid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        userType,
      });

      const { token, user, message } = res.data;

      login(user, token);
      toast.success(message || "Login successful");

      if (userType === "student") navigate("/student-dashboard");
      else if (userType === "recruiter") navigate("/recruiter-dashboard");
      else if (userType === "admin") navigate("/admin-dashboard");

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Login failed";
      toast.error(msg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className={`form-group icon-input ${emailError ? "error" : ""}`}>
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {emailError && <span className="error-text">{emailError}</span>}

          {/* Password */}
          <div className={`form-group icon-input ${passwordError ? "error" : ""}`}>
            <Lock className="input-icon" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {passwordError && (
            <span className="error-text">{passwordError}</span>
          )}

          {/* User Type */}
          <div className="form-group icon-input">
            <User className="input-icon" size={18} />
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn">
            Login
          </button>
        </form>

        <p>
          Forgot password? <Link to="/forgot">Reset</Link>
        </p>
        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
