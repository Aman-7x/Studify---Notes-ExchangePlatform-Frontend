import { useContext, useState } from "react";
import bg1 from "../assets/bg1.png";
import "./Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import axios from "axios";
import { EndPoint } from "../apis/EndPoint";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../auth/Auth";

function Login() {
  const location = useLocation();
  const { login } = useAuth();
  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const navigation = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        const response = await axios.post(EndPoint.SIGN_IN, formData);

        login(response.data);
        if (location.pathname === "/") {
          navigation("/home", { replace: true });
        } else {
          navigation(redirectPath, { replace: true });
        }
      } else {
        toast.error("Validation Error");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Attempting Google Sign-In...");
  };

  return (
    <>
      <Header />
      <div
        className="signin-app-container"
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <div className="signin-form-container">
          <div className="signin-header">
            <h1>Welcome Back!</h1>
            <p>Sign in to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="signin-form">
            <div className="signin-form-group">
              <label className="signin-form-label">
                Email Address <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="signin-form-input"
              />
              {errors.email && (
                <p className="signin-form-error">{errors.email}</p>
              )}
            </div>

            <div className="signin-form-group">
              <label className="signin-form-label">
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="signin-form-input"
              />
              {errors.password && (
                <p className="signin-form-error">{errors.password}</p>
              )}
            </div>

            <div className="signin-extra-options">
              <div className="signin-checkbox-group">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="signin-checkbox-input"
                />
                <label htmlFor="rememberMe" className="signin-checkbox-label">
                  Remember me
                </label>
              </div>
              <a href="#" className="signin-form-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="signin-submit-button">
              Sign In
            </button>
          </form>

          <p className="signin-footer-text">
            Don't have an account?{" "}
            <Link to={"/signup"} className="signin-form-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Login;
