import React, { useState } from "react";
import "./Register.css";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Mail, Lock, Eye, EyeOff, Building } from "lucide-react";

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "student",
    companyName: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Sending registration request:', formData);
      const res = await api.post("/auth/register", formData);
      console.log('Registration response:', res.data);
      const { token, user, message } = res.data;

      login(user, token);
      toast.success(message || "Registration successful");

      if (user.userType === "student") navigate("/student-dashboard");
      else if (user.userType === "recruiter") navigate("/recruiter-dashboard");
      else navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {/* Full Name */}
        <div className="form-group icon-input">
          <User className="input-icon" size={18} />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group icon-input">
          <Mail className="input-icon" size={18} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="form-group icon-input">
          <Lock className="input-icon" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* User Type */}
        <div className="form-group icon-input">
          <User className="input-icon" size={18} />
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        {/* Company Name (Recruiter only) */}
        {formData.userType === "recruiter" && (
          <div className="form-group icon-input">
            <Building className="input-icon" size={18} />
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button type="submit" className="btn">
          Register
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
