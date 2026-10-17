import { useState } from "react";
import bg1 from "../assets/bg1.png";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import axios from "axios";
import { EndPoint } from "../apis/EndPoint";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../auth/Auth";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const { login } = useAuth();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.repassword)
      newErrors.repassword = "Passwords do not match.";
    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        const response = await axios.post(EndPoint.SIGN_UP, formData);

        setSubmittedData(formData);

        login(response.data);
        toast.success("SignUp Successfully");
        navigate("/home");
      } else {
        console.log("Form validation failed.");
        toast.error("All field are required!");
      }
    } catch (err) {
      console.log("Internal Error");
      toast.error("Something Went Wrong");
    }
  };

  return (
    <>
      <Header />
      <div
        className="sign-up-app-container"
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <div
          className={`sign-up-form-container ${
            Object.keys(errors).length > 0 ? "sign-up-form-error-active" : ""
          }`}
        >
          <div className="sign-up-header">
            <h1>Create Account</h1>
            <p>Join our community of learners!</p>
          </div>

          <form onSubmit={handleSubmit} className="sign-up-form">
            <div className="sign-up-form-grid">
              <div className="sign-up-form-group">
                <label className="sign-up-form-label">
                  First Name<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Name"
                  className="sign-up-form-input"
                />
                {errors.firstName && (
                  <p className="sign-up-form-error">{errors.firstName}</p>
                )}
              </div>
              <div className="sign-up-form-group">
                <label className="sign-up-form-label">
                  Last Name<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Surname"
                  className="sign-up-form-input"
                />
                {errors.lastName && (
                  <p className="sign-up-form-error">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="sign-up-form-group">
              <label className="sign-up-form-label">
                Email Address<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="sign-up-form-input"
              />
              {errors.email && (
                <p className="sign-up-form-error">{errors.email}</p>
              )}
            </div>

            <div className="sign-up-form-grid">
              <div className="sign-up-form-group">
                <label className="sign-up-form-label">
                  Password<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="sign-up-form-input"
                />
                {errors.password && (
                  <p className="sign-up-form-error">{errors.password}</p>
                )}
              </div>
              <div className="sign-up-form-group">
                <label className="sign-up-form-label">
                  Repeat Password<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="password"
                  name="repassword"
                  value={formData.repassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="sign-up-form-input"
                />
                {errors.repassword && (
                  <p className="sign-up-form-error">{errors.repassword}</p>
                )}
              </div>
            </div>

            <div className="sign-up-form-group">
              <div className="sign-up-checkbox-group">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="sign-up-checkbox-input"
                />
                <label htmlFor="agreeTerms" className="sign-up-checkbox-label">
                  I agree to the{" "}
                  <a href="#" className="sign-up-form-link">
                    Terms of Use<span style={{ color: "red" }}>*</span>
                  </a>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="sign-up-form-error">{errors.agreeTerms}</p>
              )}
            </div>

            <div className="sign-up-form-group">
              <button type="submit" className="sign-up-submit-button">
                Sign Up
              </button>
            </div>
          </form>

          <div className="sign-up-divider">OR</div>

          <p className="sign-up-footer-text">
            Already have an account?{" "}
            <Link to={"/signin"} className="sign-up-form-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default SignUp;
