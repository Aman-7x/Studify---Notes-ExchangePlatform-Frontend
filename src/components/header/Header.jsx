import { Link, useLocation, useNavigate } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.png";
import logo2 from "../assets/image3.png";
import "../../App.css";
import {  useState } from "react";
import {   useAuth } from "../auth/Auth";
 
 

const DropdownArrow = () => <span className="dropdown-arrow"></span>;


function Header() {
  
  const location = useLocation();
  const navigate = useNavigate();
 
  const currentPage = location.pathname.replace("/", "");
  const {user,logout} = useAuth();
  
  
  const [loading, setLoading] = useState(false);
 
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div class="cap-spinner-container">
          <div class="cap-spinner">
            <div class="cap-top"></div>
            <div class="cap-base"></div>
            <div class="tassel"></div>
          </div>
        </div>
      </div>
    );
  return (
    <header id="main-header" className="main-header">
      <div className="logo-container">
        <img src={logo2} className="logo-icon" alt="Studify Logo" title="Studify Logo" />
      </div>

      <nav className="nav-links">
        <Link to="/home">Home</Link>
        <a onClick={() => navigate("/plans")}>Plans</a>
        <a onClick={() => navigate("/about")}>About Us</a>
        <a onClick={() => navigate("/contact")}>Contact Us</a>
      </nav>
      {!user && currentPage == "signin" ? (
        <div className="action-container">
          <Link to={"/signup"} className="btn-signin">
            Sign Up
          </Link>
        </div>
      ) : (
        !user && (
          <div className="action-container">
            <Link to={"/signin"} className="btn-signin">
              Sign In
            </Link>
          </div>
        )
      )}

      {user && (
        <div className="template">
          <details className="popup button">
            <summary className="popup-header">
              <div className="avatar-wrapper">
                {user?.profilePic?.url ? (
                  <img
                    src={user?.profilePic?.url}
                    alt="User profile"
                    className="profile-img"
                  />
                ) : (
                  <img
                    src={defaultProfile}
                    alt="User profile"
                    className="profile-img"
                  />
                )}
              </div>
            </summary>

            <div className="popup-main">
              <ul className="list-box">
                <button
                  className="button item"
                  onClick={() => navigate("/myprofile")}
                >
                  Profile
                </button>
                {/* <hr /> */}
                <button
                  className="button item"
                  onClick={() => navigate("/uploadnotes")}
                >
                  Upload
                </button>
                <button
                  className="button item"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </button>
                <li
                  className="button item upgrade"
                  onClick={() => navigate("/plans")}
                >
                  Upgrade
                </li>
                <hr />
                <li className="button item quit" onClick={logout}>
                  Quit
                </li>
              </ul>
            </div>
          </details>
        </div>
      )}
    </header>
  );
}

export default Header;
