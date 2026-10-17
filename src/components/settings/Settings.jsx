// File: src/components/settings/SettingsPage.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Settings.css";
import { EndPoint } from "../apis/EndPoint";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Auth";

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    university: { name: "", startYear: "" },
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [universityAll, setUniversityAll] = useState([]);
  const navigate = useNavigate();
  const { logout, setUser } = useAuth();

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [userResponse, universityResponse] = await Promise.all([
          axios.get(EndPoint.GET_USER),
          axios.get(EndPoint.UNIVERSITY_ALL),
        ]);

        const user = userResponse.data;
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          bio: user.bio || "",
          university: {
            name: user.university?.name || "",
            startYear: user.university?.startYear || "",
          },
        });
        setUniversityAll(universityResponse.data);
      } catch (error) {
        toast.error("Failed to fetch page data. Please try again.");
        console.error("Fetch data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "universityName" || name === "startYear") {
      setFormData((prev) => ({
        ...prev,
        university: {
          ...prev.university,
          [name === "universityName" ? "name" : name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await axios.put(EndPoint.UPDATE_USER, formData);
      setUser((prev) => ({
        ...prev,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        university: res.data.university,
      }));
      toast.success(res.data.message || "Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      setIsSaving(true);
      try {
        const res = await axios.delete(EndPoint.UPDATE_USER);
        // console.log(res.data);

        toast.success("Account deleted successfully!");
        logout();
        navigate("/signin");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete account.",
        );
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="cap-spinner-container">
          <div className="cap-spinner">
            <div className="cap-top"></div>
            <div className="cap-base"></div>
            <div className="tassel"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleSave}>
        <SettingsSection title="Account">
          <InputField
            label="First name"
            name="firstName"
            value={formData.firstName}
            placeholder="Your first name"
            onChange={handleChange}
          />
          <InputField
            label="Last name"
            name="lastName"
            value={formData.lastName}
            placeholder="Your surname"
            onChange={handleChange}
          />
          <TextareaField
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us a little about yourself"
            maxLength={250}
          />
          <InputField
            label="Email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <button type="submit" className="save-btn" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Account"}
          </button>
        </SettingsSection>

        <SettingsSection title="Study">
          <SelectField
            label="I study at"
            name="universityName"
            value={formData.university.name}
            onChange={handleChange}
          >
            <option value="">-- Select University --</option>
            {universityAll.map((university) => (
              <option key={university._id} value={university.name}>
                {university.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="I started studying in"
            name="startYear"
            value={formData.university.startYear}
            onChange={handleChange}
          >
            <option value="">-- Select Year --</option>
            <option value="2025">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2022">2021</option>
          </SelectField>
          <button type="submit" className="save-btn" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Study Info"}
          </button>
        </SettingsSection>
      </form>

      <SettingsSection title="">
        <button
          style={{
            backgroundColor: "#fffbfbb0",
            border: "2px solid #d70000ff",
            color: "#d70000ff",
          }}
          className="btn"
          onClick={handleDelete}
          disabled={isSaving}
        >
          <DeleteIcon /> Delete account
        </button>
      </SettingsSection>
    </div>
  );
};

export default Settings;

const DeleteIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    ></path>
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    ></path>
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    ></path>
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    ></path>
  </svg>
);

const SettingsSection = ({ title, subtitle, children }) => (
  <div className="settings-section">
    <div className="section-header">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
    <div className="section-content">{children}</div>
  </div>
);
const InputField = ({
  label,
  type = "text",
  value,
  name,
  onChange,
  placeholder,
  disabled = false,
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);
const TextareaField = ({
  label,
  value,
  name,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
}) => (
  <div className="form-group">
    <div className="label-container">
      <label htmlFor={name}>{label}</label>
      {maxLength && (
        <span className="char-counter">
          {value.length} / {maxLength}
        </span>
      )}
    </div>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
    />
  </div>
);
const SelectField = ({ label, value, name, onChange, children }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <select id={name} name={name} value={value} onChange={onChange}>
      {children}
    </select>
  </div>
);
