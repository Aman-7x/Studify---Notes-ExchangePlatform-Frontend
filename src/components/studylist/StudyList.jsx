import "./StudyList.css";
import {
  FaPlus,
  FaBook,
  FaTasks,
  FaShareAlt,
  FaClipboardList,
  FaFileAlt,
  FaSearch,
} from "react-icons/fa";
import CreateStudyListModal from "./StudyListCreate";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { EndPoint } from "../apis/EndPoint";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddTodoModal from "../todo/AddTodoModel";
import { useAuth } from "../auth/Auth";

const StudyList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [studylistAll, setStudyListAll] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(false);

  const [editingList, setEditingList] = useState(null);

  const location = useLocation();
  const { title } = location.state || {};

  const fetchStudyListAll = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${EndPoint.My_STUDYLIST}`);
      setStudyListAll(res.data);

      setSearchQuery(title ? title : "");

      // console.log(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudyListAll();
  }, []);

  const filteredLists = useMemo(() => {
    let results = studylistAll;
    if (activeFilter === true) {
      results = results.filter((list) => list.isPublic === true);
    } else if (activeFilter === false) {
      results = results.filter((list) => list.isPublic === false);
    }

    if (searchQuery) {
      results = results.filter((list) =>
        list.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return results;
  }, [searchQuery, studylistAll, activeFilter]);

  const handleDelete = async (listId) => {
    setOpenMenuId(null);
    if (window.confirm("Are you sure you want to delete this study list?")) {
      try {
        await axios.delete(`${EndPoint.DELETE_STUDYLIST}/${listId}`);

        setStudyListAll((prevLists) =>
          prevLists.filter((list) => list._id !== listId),
        );
        toast.success("Study list deleted successfully!");
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to delete study list.",
        );
      }
    }
  };

  const handleEdit = (list) => {
    if (list) {
      setEditingList(list);
      setOpenModal(true);
    }
    setOpenMenuId(null);
  };

  const handleMenuToggle = (e, studyListId) => {
    e.stopPropagation();
    setOpenMenuId((prevId) => (prevId === studyListId ? null : studyListId));
  };
  const renderTodoStatus = (list) => {
    const FaPlus = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    );
    const FaCheck = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    );

    const todos = list.todos;

    // Case 1: If zero todo
    if (!todos || todos.length === 0) {
      return (
        <button
          className="study-lists-add-todo-btn"
          onClick={() => handleOpenTodoModal(list)}
        >
          <FaPlus />
          TODO
        </button>
      );
    }

    // Saare pending todos ko filter karein
    const pendingTodos = todos.filter((t) => t.status === "pending");

    // Case 2: Agar koi pending todo nahi hai (matlab sab complete hain)
    if (pendingTodos.length === 0) {
      return (
        <button
          style={{ backgroundColor: "#15d97ae8", cursor: "default" }}
          className="study-lists-add-todo-btn"
        >
          <FaCheck style={{ marginRight: "5px" }} />
          Completed
        </button>
      );
    }

    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const mostUrgentTodo = pendingTodos.sort((a, b) => {
      const priorityComparison =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityComparison !== 0) {
        return priorityComparison;
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    })[0];

    let priorityColor = "#15d97ae8";
    if (mostUrgentTodo.priority === "high") {
      priorityColor = "#ff1500a4";
    } else if (mostUrgentTodo.priority === "medium") {
      priorityColor = "#f4b300b9";
    }

    return (
      <button
        style={{ backgroundColor: priorityColor, width: "130px" }}
        className="study-lists-add-todo-btn"
        onClick={() => navigate(`/viewstudylist/${list._id}`)}
      >
        Due: {formatDate(mostUrgentTodo.dueDate)}
      </button>
    );
  };

  const navigate = useNavigate();

  const handleList = (list) => {
    navigate(`/viewstudylist/${list._id}`);
  };

  useEffect(() => {
    const { state } = location;
    if (state?.action) {
      if (state.action === "edit" && state.targetList) {
        handleEdit(state.targetList);
      }

      if (state.action === "delete" && state.targetListId) {
        handleDelete(state.targetListId);
      }

      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const [showTodoModal, setShowTodoModal] = useState(false);
  const [selectedListForTodo, setSelectedListForTodo] = useState(null);

  const handleOpenTodoModal = (list) => {
    setSelectedListForTodo(list);
    setShowTodoModal(true);
  };

  const handleCloseTodoModal = () => {
    setShowTodoModal(false);
    setSelectedListForTodo(null);
  };

  const handleSaveTodo = async (todoData) => {
    const payload = { ...todoData, studyListId: selectedListForTodo._id };
    try {
      await axios.post(EndPoint.CREATE_TODO, payload);
      toast.success("Todo added successfully!");
      fetchStudyListAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add todo.");
    }
    handleCloseTodoModal();
  };

  // if (loading)
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //       }}
  //     >
  //       <div class="cap-spinner-container">
  //         <div class="cap-spinner">
  //           <div class="cap-top"></div>
  //           <div class="cap-base"></div>
  //           <div class="tassel"></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  return (
    <div className="study-lists-page-container">
      <header className="study-lists-page-header">
        <div className="study-lists-header-info">
          <div className="study-lists-header-text">
            <FaClipboardList className="study-lists-header-icon" />
            <span>Study Lists</span>
            <p>Organize your notes and create focused study sessions</p>
          </div>
        </div>
        <div className="study-lists-header-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="search-input"
            />
          </div>
          <div className="study-lists-filter-buttons">
            <button
              className={`study-lists-filter-btn ${
                activeFilter === "All" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("All")}
            >
              All
            </button>
            <button
              className={`study-lists-filter-btn ${
                activeFilter === true ? "active" : ""
              }`}
              onClick={() => setActiveFilter(true)}
            >
              Public
            </button>
            <button
              className={`study-lists-filter-btn ${
                activeFilter === false ? "active" : ""
              }`}
              onClick={() => setActiveFilter(false)}
            >
              Private
            </button>
          </div>
          <button
            className="study-lists-create-btn"
            onClick={() => setOpenModal(true)}
          >
            <FaPlus /> Create Study List
          </button>

          {openModal && (
            <CreateStudyListModal
              onClose={() => {
                setOpenModal(false);
                setEditingList(null);
              }}
              // onSuccess={fetchStudyListAll}
              setStudyListAll={setStudyListAll}
              listToEdit={editingList}
            />
          )}
        </div>
      </header>

      <div className="study-lists-tools-bar">
        <button className="study-lists-tool-btn">
          <FaFileAlt /> Organize your notes
        </button>
        <button className="study-lists-tool-btn">
          <FaTasks /> Add to todo lists
        </button>
        <button className="study-lists-tool-btn">
          <FaShareAlt /> Share with others
        </button>
      </div>

      <main className="study-lists-grid">
        {filteredLists?.map((list) => (
          <div key={list.id} className="study-list-card">
            <div className="study-lists-card-header">
              <div
                className="study-lists-card-title-info"
                onClick={() => handleList(list)}
              >
                <div className="study-lists-card-icon">
                  <FaBook />
                </div>
                <h3 style={{ cursor: "pointer" }}>{list.title}</h3>
                {list.isPublic && (
                  <span className="study-lists-public-badge">Public</span>
                )}
              </div>
              <div className="study-lists-card-actions-dropdown">
                <div
                  className="study-lists-dropdown-btn"
                  style={{ position: " relative" }}
                >
                  <button
                    className="menu-btn"
                    onClick={(e) => handleMenuToggle(e, list._id)}
                  >
                    <Icon name="more" />
                  </button>

                  {openMenuId === list._id && (
                    <div className="options-menu">
                      <button
                        className="menu-item"
                        onClick={() => handleEdit(list)}
                      >
                        <Icon name="edit" />
                        Edit
                      </button>
                      <button
                        className="menu-item delete"
                        style={{ color: "#cd0000" }}
                        onClick={() => handleDelete(list._id)}
                      >
                        <Icon name="delete" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="study-lists-card-description">{list.description}</p>
            <div className="study-lists-card-stats">
              <span className="study-lists-stat-item">
                {list.notes && list.notes.length > 0
                  ? list.notes.slice(0, 3).map((note) => (
                      <div
                        key={note._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <BookIcon />
                        <span>{note.title}</span>
                      </div>
                    ))
                  : "Notes - 0"}{" "}
              </span>
            </div>
            <div className="study-lists-card-footer">
              <span
                className="study-lists-updated-date"
                style={{ width: "100px" }}
              >
                Updated On {formatDate(list.updatedAt)}
              </span>
              <div className="study-lists-card-footer">
                {renderTodoStatus(list)}
              </div>
            </div>
          </div>
        ))}
      </main>
      {showTodoModal && (
        <AddTodoModal
          onClose={handleCloseTodoModal}
          onAddTodo={handleSaveTodo}
          studyList={[selectedListForTodo]}
          isStudyListLocked={true}
          todoToEdit={null}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudyList;

const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const Icon = ({ name, className = "" }) => {
  const icons = {
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
    delete: (
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
    edit: (
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
    ),
  };
  return <div className={`icon ${className}`}>{icons[name]}</div>;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};
