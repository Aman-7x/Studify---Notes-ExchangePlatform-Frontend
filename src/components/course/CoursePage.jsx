import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../header/Header";
import "../../App.css";
import { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { EndPoint } from "../apis/EndPoint";
import { useAuth } from "../auth/Auth";
import { toast } from "react-toastify";
import CreateCourseModal from "./CreateCourse";
import SaveToStudylistModal from "../studylist/SaveToStudylistModal";

function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [savedNotes, setSavedNotes] = useState(new Set());
  const [searchNotes, setSearchNotes] = useState([]);

  const { theme } = location.state || {};
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [noteToAction, setNoteToAction] = useState(null);

  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const { user } = useAuth();

  const fetchCourseAndSavedStatus = async (id) => {
    setLoading(true);
    try {
      const courseRes = await axios.get(`${EndPoint.COURSE_BY_ID}/${id}`);
      const fetchedNotes = courseRes.data?.notes || [];
      setCourse(courseRes.data);
      setAllNotes(fetchedNotes);

      if (fetchedNotes.length > 0) {
        const noteIds = fetchedNotes.map((n) => n._id);
        const statusRes = await axios.post(
          `${EndPoint.STUDYLIST_BY_ID}/saved-status`,
          { noteIds },
        );
        setSavedNotes(new Set(statusRes.data));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (courseId) {
      fetchCourseAndSavedStatus(courseId);
    }
  }, [courseId]);

  useEffect(() => {
    if (user && course) {
      setIsFollowing(
        course.followers.some((follower) => follower._id === user._id),
      );
    }
  }, [user, course]);

  useEffect(() => {
    const timeTake = setTimeout(() => {
      if (searchQuery && searchQuery.trim().length > 0) {
        setIsSearching(true);
        const filtered = allNotes.filter((note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setSearchNotes(filtered);
      } else {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timeTake);
  }, [searchQuery]);

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    if (openMenuId !== null) {
      document.addEventListener("click", closeMenu);
    }
    return () => document.removeEventListener("click", closeMenu);
  }, [openMenuId]);

  const handleOpenSaveModal = (note) => {
    setNoteToAction(note);
    setShowSaveModal(true);
  };

  const handleSaveSuccess = (savedNoteId) => {
    setSavedNotes((prev) => new Set(prev).add(savedNoteId));
    setShowSaveModal(false);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(
          `${EndPoint.DELETE_NOTE}/${noteId}`,
        );
        setAllNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId),
        );
        toast.success("Note deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete note.");
      }
    }
  };

  const handleMenuToggle = (e, noteId) => {
    e.stopPropagation();
    setOpenMenuId((prevId) => (prevId === noteId ? null : noteId));
  };
 

  const handleFollow = async () => {
   

    try {
      if (isFollowing) {
        const res = await axios.delete(
          `${EndPoint.UNFOLLOW_COURSE}/${course._id}/unfollow`,);
        setIsFollowing(false);
        setCourse((prevCourse) => ({
          ...prevCourse,
          followers: prevCourse.followers.filter(
            (follower) => follower._id !== user._id,
          ),
        }));
      } else {
        const res = await axios.post(
          `${EndPoint.FOLLOW_COURSE}/${course._id}/follow`,);

        setIsFollowing(true);
        setCourse((prevCourse) => ({
          ...prevCourse,
          followers: [
            ...prevCourse.followers,
            {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          ],
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLikeNote = async (noteId) => {
    if (!user || !noteId) {
      return;
    }
    try {
      const res = await axios.post(
        `${EndPoint.LIKE_NOTE}/${noteId}/like`,
        {},
        {
          params: { noteId: noteId },
        },
      );

      const updatedNote = res.data.note;
      setAllNotes((prev) =>
        prev.map((item) => (item._id == noteId ? updatedNote : item)),
      );
      setCourse((prevCourse) => {
        const updatedNotes = prevCourse.notes.map((note) => {
          if (note._id === noteId) {
            return updatedNote;
          }
          return note;
        });
        return { ...prevCourse, notes: updatedNotes };
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (course) => {
    setCourseToEdit(course);
    setOpenModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

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

  const isCourseOwner = course?.createdBy === user?._id;

  return (
    <>
      <Header />
      <div
        className={`home-container ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />

        <div className="main-course-area">
          <div className="course-page">
            {loading ? <p style={{ fontSize: "50px" }}>loading...</p> : ""}
            <header
              className="page-header"
              style={{ backgroundColor: theme?.bg }}
            >
              <button
                onClick={handleGoBack}
                className="back-button"
                style={{
                  backgroundColor: theme.bg,
                  border: "2px solid #4CAF50",
                  borderRadius: "10px",
                  fontWeight: 600,
                  color: "#2e7d32",
                  cursor: "pointer",
                  marginBottom: "1rem",
                  fontSize: "0.95rem",
                  padding: "10px 16px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                ← Back
              </button>

              <div className="breadcrumbs">
                University &gt; {course?.university?.name} &gt; {course?.branch}
              </div>

              <div className="header-content">
                <div
                  className="header-icon"
                  style={{ backgroundColor: theme.iconBg, color: theme.icon }}
                >
                  <Icon name="folder" />
                </div>
                <div className="header-details">
                  <h1>
                    {course?.name} {course?.code && `(${course?.code})`}{" "}
                  </h1>
                  <p>{course?.description}</p>
                  <div className="header-stats">
                    <div className="stat-item">
                      <Icon name="document" /> {course?.notes?.length} documents
                    </div>

                    <div className="stat-item">
                      <Icon name="student" /> {course?.followers?.length}
                      {course?.followers?.length === 1
                        ? ` student`
                        : " students"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="header-actions">
                <div className="action-buttons">
                  {!isCourseOwner ? (
                    <button
                      className={`btn`}
                      style={{
                        color: theme.icon,
                        borderColor: theme.border,
                        backgroundColor: theme.bg,
                      }}
                      disabled={loading}
                      onClick={handleFollow}
                    >
                      {isFollowing ? (
                        <>
                          <Icon name="check" /> Unfollow
                        </>
                      ) : (
                        "Follow"
                      )}
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(course)} className="btn">
                      Edit
                    </button>
                  )}

                  <button className="btn" onClick={() => navigate("/askai")}>
                    <Icon name="question" /> Ask a question
                  </button>
                  <button className="btn">
                    <Icon name="share" /> Share
                  </button>
                </div>

                <div className="search-bar">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </header>
            {openModal && (
              <CreateCourseModal
                onClose={() => {
                  // fetchCourseAndSavedStatus(courseId);
                  setOpenModal(false);
                }}
                courseToEdit={courseToEdit}
                setCourse={setCourse}
              />
            )}

            <main className="page-content">
              <section className="doc-list-section">
                <div className="list-header">
                  <h2 className="section-title">Notes</h2>
                  <div className="filter-controls"></div>
                </div>
                <div className="doc-list">
                  {(isSearching ? searchNotes : allNotes).map((doc) => {
                    const isNoteOwner =
                      doc.uploadedBy === user?._id ||
                      doc.uploadedBy?._id === user?._id;

                    return (
                      <div key={doc._id} className="doc-list-item">
                        <div className="doc-thumbnail">
                          <Icon name="document" />
                        </div>

                        <div className="doc-details">
                          <a
                            className="doc-title-link"
                            onClick={() =>
                              navigate("/document", { state: { pdf: doc } })
                            }
                          >
                            {doc.title}
                          </a>
                          <p className="doc-description">{doc.description}</p>
                        </div>

                        <div className="doc-meta">
                          <span className="doc-year">
                            <Icon name="calendar" />{" "}
                            {formatDate(doc?.createdAt)}
                          </span>
                          <button
                            className="doc-rating-btn"
                            onClick={() => handleLikeNote(doc._id)}
                          >
                            <Icon name="thumb" />({doc.likes?.length || 0})
                          </button>
                        </div>

                        <div className="doc-menu">
                          {isNoteOwner ? (
                            <>
                              <button
                                className="menu-btn"
                                onClick={(e) => handleMenuToggle(e, doc._id)}
                              >
                                <Icon name="more" />
                              </button>
                              {openMenuId === doc._id && (
                                <div className="options-menu">
                                  <button
                                    className="menu-item"
                                    onClick={() => handleOpenSaveModal(doc)}
                                  >
                                    <Icon name="saveIcon" /> Save to Studylist
                                  </button>
                                  <button
                                    className="menu-item delete"
                                    onClick={() => handleDeleteNote(doc._id)}
                                  >
                                    <Icon name="deleteIcon" /> Delete
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <button
                              className="menu-btn save-btn-direct"
                              onClick={() => handleOpenSaveModal(doc)}
                              title="Save to Studylist"
                            >
                              <Icon name="saveIcon" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isSearching && searchNotes.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#777",
                      }}
                    >
                      <p>No documents found for "{searchQuery}"</p>
                    </div>
                  )}
                  {allNotes.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#777",
                      }}
                    >
                      <p>No documents found </p>
                    </div>
                  )}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      {showSaveModal && (
        <SaveToStudylistModal
          noteToSave={noteToAction}
          onClose={() => {
            setShowSaveModal(false);
          }}
          onSuccess={() => handleSaveSuccess(noteToAction._id)}
        />
      )}
    </>
  );
}

export default CoursePage;

const Icon = ({ name, className = "" }) => {
  const icons = {
    deleteIcon: (
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
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    ),

    saveIcon: (
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
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    folder: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M10 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path>
      </svg>
    ),
    document: (
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
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
        <polyline points="13 2 13 9 20 9"></polyline>
      </svg>
    ),
    question: (
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
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    quiz: (
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
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    student: (
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
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    check: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    ),
    share: (
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
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
    ),
    search: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ),
    calendar: (
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
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    thumb: (
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
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
      </svg>
    ),
    more: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="5" r="2" />
        <circle cx="12" cy="19" r="2" />
      </svg>
    ),
    chevronDown: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    ),
  };
  return <div className={`icon ${className}`}>{icons[name]}</div>;
};
