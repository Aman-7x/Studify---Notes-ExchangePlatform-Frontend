import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bg1 from "../assets/defaultProfile.png";
import axios from "axios";
import { EndPoint } from "../apis/EndPoint";
import { useAuth } from "../auth/Auth";

function Sidebar({ isCollapsed, toggleSidebar }) {
  const [openSections, setOpenSections] = useState({ courses: false });
  const mockCourses = [
    {
      id: "mech-1",
      name: "BE Mechanical Engineering SEM 01",
      path: "/courses/mech-1",
    },
    { id: "cs-1", name: "Computer Science", path: "/courses/cs-1" },
    { id: "comp", name: "Computer", path: "/courses/comp" },
  ];
  const [userCourses, setUserCourses] = useState(mockCourses);

  const handleSectionToggle = (sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const navItems = [
    { id: "home", icon: "home", text: "Home", path: "/home" },
    { id: "library", icon: "library", text: "My Library", path: "/mylibrary" },
    {
      id: "mystudylist",
      icon: "studylist",
      text: "Study List",
      path: "/studylist",
    },
    { id: "mytodo", icon: "todo", text: "To Do", path: "/todo" },
    { id: "ask_ai", icon: "ask_ai", text: "Ask AI", path: "/askai" },
    // { id: "recent", icon: "recent", text: "Recent", path: "/recent" },

    { id: "library_header", text: "My Library", isHeader: true },
    { id: "courses", icon: "courses", text: "Courses", contentType: "courses" },
    // { id: "books", icon: "books", text: "Books", contentType: "books" },
    {
      id: "studylists",
      icon: "studylists",
      text: "Studylists",
      contentType: "studylists",
    },
    {
      id: "questions",
      icon: "questions",
      text: "Questions",
      // path: "/askai",
    },
  ];

  const { user } = useAuth();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // console.log(loading);

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
    <>
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <nav className="sidebar-nav-container">
          <div className="sidebar-header">
            <div className="user-profile">
              <div className="avatar-wrapper">
                {user?.profilePic?.url ? (
                  <img
                    src={user?.profilePic?.url}
                    alt="User profile"
                    className="profile-img"
                  />
                ) : (
                  <img src={bg1} alt="User profile" className="profile-img" />
                )}
              </div>{" "}
              <div className="user-info">
                <span className="user-name">
                  {user?.firstName
                    ? user?.firstName + " " + user?.lastName
                    : "User Name"}
                </span>
                <span className="user-university">
                  <Icon name="university" />
                  {user?.university?.name
                    ? createAcronym(user?.university?.name)
                    : "University"}
                </span>
              </div>
            </div>

            <button
              className="new-button"
              onClick={() => navigate("/uploadnotes")}
            >
              <Icon name="plus" />
              {!isCollapsed && <span className="link-text">New</span>}
            </button>
          </div>
          <ul className="sidebar-nav">
            {navItems.map((item) => {
              if (item.isHeader) {
                return isCollapsed ? (
                  <li key={item.id + "-divider"} className="nav-divider" />
                ) : (
                  <li key={item.id} className="nav-header">
                    {item.text}
                  </li>
                );
              }

              if (item.contentType) {
                const isOpen = !!openSections[item.id];
                return (
                  <li key={item.id} className="nav-section">
                    <button
                      onClick={() => handleSectionToggle(item.id)}
                      className="nav-section-toggle"
                    >
                      <div className="icon">
                        <Icon name={item.icon} />
                      </div>
                      {!isCollapsed && (
                        <span className="link-text">{item.text}</span>
                      )}
                      {!isCollapsed && (
                        <div
                          className={`dropdown-icon ${isOpen ? "open" : ""}`}
                        >
                          <Icon name="chevron" />
                        </div>
                      )}
                    </button>
                    {!isCollapsed && (
                      <div
                        className={`sub-menu-dynamic ${isOpen ? "open" : ""}`}
                      >
                        <div className="sub-menu-content">
                          {item.contentType === "courses" &&
                            userCourses.map((course) => (
                              <Link
                                key={course.id}
                                to={course.path}
                                className="sub-menu-item"
                              >
                                {course.name}
                              </Link>
                            ))}
                          <button className="btn-add-courses">
                            <Icon name="plus" />
                            <span>Add Courses</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              }

              const isActive = location.pathname === item.path;
              return (
                <li
                  key={item.id}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <Link to={item.path} title={item.text}>
                    <span className="icon">
                      <Icon name={item.icon} />
                    </span>
                    {!isCollapsed && (
                      <span className="link-text">{item.text}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <Icon name="toggle" />
      </button>
    </>
  );
}

export default Sidebar;

const createAcronym = (name) => {
  if (!name || typeof name !== "string") {
    return "";
  }
  const ignoreWords = ["of", "the", "and", "in"];
  const words = name.split(" ");
  const acronym = words
    .filter((word) => !ignoreWords.includes(word.toLowerCase()))
    .map((word) => word[0])
    .join("");
  return acronym.toUpperCase();
};
const Icon = ({ name }) => {
  const icons = {
    university: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: "#4B5563" }}
      >
        <path d="M3,22V8l9-5,9,5v14H3Zm2-2h2V12H5v8Zm4,0h2V12H9v8Zm4,0h2V12h-2v8Zm4,0h2V12h-2v8Z" />
      </svg>
    ),
    plus: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    ),
    home: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#5ea2ef", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#3092Fa", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="homeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#3092Fa"
              floodOpacity="0.3"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#homeShadow)" }}>
          <path
            d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            fill="url(#homeGradient)"
          />
          <path
            d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            fill="white"
            fillOpacity="0.1"
          />
          <polyline
            points="9 22 9 12 15 12 15 22"
            fill="white"
            fillOpacity="0.3"
          />
        </g>
      </svg>
    ),
    studylist: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="studyGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#5ea2ef", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#3092Fa", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="studyShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#3092Fa"
              floodOpacity="0.3"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#studyShadow)" }}>
          <path
            d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"
            fill="url(#studyGradient)"
            stroke="none"
          />
          <path
            d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"
            fill="white"
            fillOpacity="0.1"
            stroke="none"
          />
          <path
            d="M6 19v-2h12v2M6 15v-2h12v2M6 11V9h12v2"
            fill="white"
            fillOpacity="0.3"
            stroke="none"
          />
        </g>
      </svg>
    ),
    todo: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="todoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#5ea2ef", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#3092Fa", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="todoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#3092Fa"
              floodOpacity="0.3"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#todoShadow)" }}>
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            ry="2"
            fill="url(#todoGradient)"
            stroke="none"
          />
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            ry="2"
            fill="white"
            fillOpacity="0.1"
            stroke="none"
          />
          <polyline
            points="9 11 12 14 15 8"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="8"
            y1="18"
            x2="16"
            y2="18"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="8"
            y1="15"
            x2="16"
            y2="15"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      </svg>
    ),
    library: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="libGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#a881f5", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#7a3ff1", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="libShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#7a3ff1"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#libShadow)" }}>
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            ry="2"
            fill="url(#libGradient)"
          />
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            ry="2"
            fill="white"
            fillOpacity="0.1"
          />
          <line
            x1="3"
            y1="9"
            x2="21"
            y2="9"
            stroke="white"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <line
            x1="9"
            y1="21"
            x2="9"
            y2="3"
            stroke="white"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
        </g>
      </svg>
    ),
    notes: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="notesGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#4fd1c5", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#38b2ac", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="notesShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#38b2ac"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#notesShadow)" }}>
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
            fill="url(#notesGradient)"
          />
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
            fill="white"
            fillOpacity="0.1"
          />
          <path d="M14 2v6h6l-6-6z" fill="white" fillOpacity="0.25" />
          <line
            x1="16"
            y1="13"
            x2="8"
            y2="13"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          <line
            x1="16"
            y1="17"
            x2="8"
            y2="17"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
        </g>
      </svg>
    ),
    ask_ai: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#4dd0e1", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#00acc1", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="aiShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#00acc1"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#aiShadow)" }}>
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            fill="url(#aiGradient)"
          />
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            fill="white"
            fillOpacity="0.1"
          />
        </g>
      </svg>
    ),
    recent: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="recentGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#f78f4b", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#f36d36", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter
            id="recentShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#f36d36"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#recentShadow)" }}>
          <circle cx="12" cy="12" r="10" fill="url(#recentGradient)" />
          <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.1" />
          <polyline
            points="12 6 12 12 16 14"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeOpacity="0.8"
          />
        </g>
      </svg>
    ),
    toggle: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="11 17 6 12 11 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <polyline
          points="18 17 13 12 18 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    chevron: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="6 9 12 15 18 9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    // --- STYLISH ICONS START HERE ---
    courses: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="coursesGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#a881f5", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#7a3ff1", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter
            id="coursesShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#7a3ff1"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#coursesShadow)" }}>
          <path
            d="M20 6h-8l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"
            fill="url(#coursesGradient)"
          />
          <path
            d="M20 6h-8l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"
            fill="white"
            fillOpacity="0.1"
          />
        </g>
      </svg>
    ),
    books: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="booksGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#fb923c", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#ea580c", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="booksShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#ea580c"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#booksShadow)" }}>
          <path
            d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"
            fill="url(#booksGradient)"
          />
          <path
            d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"
            fill="white"
            fillOpacity="0.1"
          />
          <path d="M6 4h5v8l-2.5-1.5L6 12V4z" fill="white" fillOpacity="0.4" />
        </g>
      </svg>
    ),
    studylists: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="studylistsGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#48bdecff", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#4695efff", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter
            id="studylistsShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#46a0efff"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#studylistsShadow)" }}>
          <path
            d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z"
            fill="url(#studylistsGradient)"
          />
          <path
            d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z"
            fill="white"
            fillOpacity="0.1"
          />
        </g>
      </svg>
    ),
    questions: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="questionsGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#a3e635", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#65a30d", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter
            id="questionsShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#65a30d"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#questionsShadow)" }}>
          <rect
            x="4"
            y="2"
            width="16"
            height="20"
            rx="2"
            ry="2"
            fill="url(#questionsGradient)"
          />
          <rect
            x="4"
            y="2"
            width="16"
            height="20"
            rx="2"
            ry="2"
            fill="white"
            fillOpacity="0.1"
          />
          <line
            x1="7"
            y1="8"
            x2="17"
            y2="8"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          <line
            x1="7"
            y1="12"
            x2="17"
            y2="12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          <line
            x1="7"
            y1="16"
            x2="13"
            y2="16"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
        </g>
      </svg>
    ),
  };
  return icons[name] || null;
};
