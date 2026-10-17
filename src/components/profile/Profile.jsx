// File: src/components/profile/ProfilePage.jsx

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/defaultProfile.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaBookOpen } from "react-icons/fa";
import "./Profile.css";

import { EndPoint } from "../apis/EndPoint";
import { useAuth } from "../auth/Auth";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);
  const { setUser } = useAuth();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(EndPoint.GET_USER);

      setLocalUser(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("fileUrl", selectedFile);

    try {
      const res = await axios.post(EndPoint.UPLOAD_USER_PROFILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile picture updated!");

      setLocalUser((prevUser) => ({
        ...prevUser,
        profilePic: res.data.profilePic,
      }));

      setUser((prevUser) => ({
        ...prevUser,
        profilePic: res.data.profilePic,
      }));

      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed! Please try again.");
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  if (loading || !user)
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

  return (
    <div className="profile-container">
      {isModalOpen && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content">
            <h2>
              {user?.profilePic
                ? "Update Profile Picture"
                : "Upload Profile Picture"}
            </h2>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            <button
              onClick={triggerFileSelect}
              className="profile-modal-btn profile-choose-btn"
            >
              Choose File
            </button>

            {selectedFile && (
              <p className="profile-file-name">Selected: {selectedFile.name}</p>
            )}

            <div className="profile-modal-actions">
              <button
                onClick={() => setIsModalOpen(false)}
                className="profile-modal-btn profile-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="profile-modal-btn profile-upload-btn"
                disabled={!selectedFile || loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="profile-header">
        <div
          className="profile-picture-container"
          onClick={() => setIsModalOpen(true)}
        >
          {user?.profilePic?.url ? (
            <img
              src={user?.profilePic?.url}
              alt="Profile"
              className="profile-picture"
            />
          ) : (
            <img src={bg1} alt="Profile" className="profile-picture" />
          )}

          <div className="profile-picture-overlay">+</div>
        </div>
        <div className="profile-info">
          <h1>
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="profile-university-name">
            {createAcronym(user?.university?.name)} -{" "}
            {user?.university?.name
              ? user?.university?.name
              : "University Name"}
          </p>
          <p className="profile-bio">{user?.bio}</p>
        </div>
        <button
          className="profile-edit-profile-btn"
          onClick={() => navigate("/settings")}
        >
          <EditIcon />
        </button>
      </div>

      <div className="profile-stats">
        <div className="profile-stat-card">
          <UploadIcon />
          <span className="profile-stat-number">
            {user?.uploadedNotes?.length}
          </span>
          <span className="profile-stat-label">Notes Uploaded</span>
        </div>
        <div className="profile-stat-card">
          <CoursesIcon />
          <span className="profile-stat-number">
            {user?.followedCourses?.length}
          </span>
          <span className="profile-stat-label">Courses Followed</span>
        </div>
        <div className="profile-stat-card">
          <SavedIcon />
          <span className="profile-stat-number">
            {user?.savedStudyLists?.length}
          </span>
          <span className="profile-stat-label">Notes Saved</span>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-content-section">
          <h2>My Uploads</h2>
          <ExpandableList
            items={user?.uploadedNotes}
            renderItem={(note, index) => (
              <NoteCard key={`${note._id}-${index}`} note={note} />
            )}
          />
          {user?.uploadedNotes.length === 0 && (
            <div>
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#777",
                }}
              >
                <p>No uploaded document found !</p>
              </div>
            </div>
          )}
        </div>
        <div className="profile-content-section">
          <h2>My StudyList</h2>
          <ExpandableList
            items={user.savedStudyLists}
            renderItem={(list, index) => (
              <StudyListCard key={`${list._id}-${index}`} list={list} />
            )}
          />
          {user?.savedStudyLists.length === 0 && (
            <div>
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#777",
                }}
              >
                <p>No saved notes found !</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Profile;

const EditIcon = () => (
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
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <polyline points="7 9 12 4 17 9" />
    <line x1="12" y1="4" x2="12" y2="16" />
  </svg>
);
const CoursesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);
const SavedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);
const SeeMoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
const SeeLessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const createAcronym = (name) => {
  if (!name || typeof name !== "string") return "";
  const ignoreWords = ["of", "the", "and", "in"];
  return name
    .split(" ")
    .filter((word) => !ignoreWords.includes(word.toLowerCase()))
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const NoteCard = ({ note }) => {
  const navigate = useNavigate();
  return (
    <div
      className="profile-note-card-profile"
      onClick={() => navigate("/document", { state: { pdf: note } })}
    >
      <div className="profile-note-icon">📄</div>
      <div className="profile-note-details">
        {/* <button onClick={()=>navigate('/document',{state:{pdf:note}})}><h4 className="profile-note-title">{note.title}</h4> */}
        {/* </button> */}
        <h4 className="profile-note-title">{note.title}</h4>
        <p className="profile-note-course">{note.description}</p>
      </div>
    </div>
  );
};

const StudyListCard = ({ list }) => {
  // console.log(list);

  const navigate = useNavigate();
  const handleCardClick = (list) => {
    navigate(`/viewstudylist/${list._id}`);
  };

  return (
    <div className="studylist-card-home" onClick={() => handleCardClick(list)}>
      <div className="studylist-card-home-icon">
        <FaBookOpen />
      </div>
      <div className="studylist-card-home-content">
        <h5 className="studylist-card-home-title">{list.title}</h5>
        <p className="studylist-card-home-desc">{list.description}</p>
      </div>
    </div>
  );
};

const ExpandableList = ({
  items,
  renderItem,
  initialVisible = 3,
  step = 3,
}) => {
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  const visibleItems = items.slice(0, visibleCount);

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + step);
  };

  const handleSeeLess = () => {
    setVisibleCount(initialVisible);
  };

  return (
    <div>
      <div className="profile-expandable-list-container">
        {visibleItems.map((item, index) => renderItem(item, index))}
      </div>
      <div className="profile-list-controls">
        {items.length > visibleCount && (
          <button onClick={handleSeeMore} className="profile-list-control-btn">
            See More <SeeMoreIcon />
          </button>
        )}
        {visibleCount > initialVisible && (
          <button onClick={handleSeeLess} className="profile-list-control-btn">
            See Less <SeeLessIcon />
          </button>
        )}
      </div>
    </div>
  );
};
