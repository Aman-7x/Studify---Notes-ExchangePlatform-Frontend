import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast } from "react-toastify";
import defaultProfile from "../assets/defaultProfile.png";
import {
  FaEdit,
  FaTrash,
  FaFileAlt,
  FaTasks,
  FaGlobe,
  FaLock,
  FaBookOpen,
} from "react-icons/fa";

import "./ViewStudyList.css";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import { EndPoint } from "../apis/EndPoint";
import AddTodoModal from "../todo/AddTodoModel";
import { useAuth } from "../auth/Auth";


const ViewStudyList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
 

  const {user}  = useAuth();

  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [studyList, setStudyList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    const fetchStudyList = async () => {
      if (!id) {
        toast.error("Invalid request.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(`${EndPoint.STUDYLIST_BY_ID}/${id}`
          
        );
        setStudyList(res.data);
      } catch (error) {
        toast.error("Failed to fetch study list data.");
        navigate("/studylist");
      } finally {
        setLoading(false);
      }
    };

    fetchStudyList();
  }, [id]);

  const currentUserId = user?._id;
  const isOwner =
    studyList?.createdBy?._id === currentUserId ||
    studyList?.createdBy === currentUserId;

  const handleOpenTodoModal = (todo = null) => {
    setEditingTodo(todo || { studyList: { _id: studyList._id } });
    setShowTodoModal(true);
  };

  const handleCloseTodoModal = () => {
    setShowTodoModal(false);
    setEditingTodo(null);
  };

  const handleSaveTodo = async (todoData, todoId) => {
    const isEditMode = Boolean(todoId);
    const payload = { ...todoData, studyList: studyList._id };

    try {
      if (isEditMode) {
        const res = await axios.put(
          `${EndPoint.UPDATE_TODO}/${todoId}`,
          payload,
          
        );
        setStudyList((prev) => ({
          ...prev,
          todos: prev.todos.map((t) => (t._id === todoId ? res.data : t)),
        }));
        toast.success("Todo updated successfully!");
      } else {
        const res = await axios.post(
          EndPoint.CREATE_TODO,
          { ...payload, studyListId: studyList._id },
         
        );
        setStudyList((prev) => ({
          ...prev,
          todos: [...(prev.todos || []), res.data],
        }));
        toast.success("Todo added successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        await axios.delete(`${EndPoint.DELETE_TODO}/${todoId}`);

        setStudyList((prev) => ({
          ...prev,
          todos: prev.todos.filter((t) => t._id !== todoId),
        }));
        toast.success("Todo deleted!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete.");
      }
    }
  };

  const handleToggleStatus = (todo) => {
    const newStatus = todo.status === "pending" ? "completed" : "pending";
    handleSaveTodo({ ...todo, status: newStatus }, todo._id);
  };

  const handleDeleteStudyList = () => {
    if (window.confirm("Are you sure?"))
      navigate("/studylist", {
        state: { action: "delete", targetListId: studyList._id },
      });
  };
  const handleEditStudyList = () =>
    navigate("/studylist", {
      state: { action: "edit", targetList: studyList },
    });
  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  const todo =
    studyList?.todos && studyList?.todos.length > 0 ? studyList?.todos : null;
  console.log(todo);

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const sortTodo = studyList?.todos
    ? [...studyList.todos].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      )
    : null;

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
          <div className="profile-container">
            <header className="profile-header">
              <div className="profile-picture-container">
                <div className="study-list-icon-bg">
                  <FaBookOpen size={40} color="#3092FA" />
                </div>
              </div>
              <div className="profile-info">
                <h1>{studyList?.title}</h1>
                <p className="profile-university-name">
                  {isOwner
                    ? `You Created On: ${formatDate(studyList?.createdAt)}`
                    : `Created On ${formatDate(studyList?.createdAt)}`}
                </p>
                <p className="profile-bio">{studyList?.description}</p>
              </div>
              {isOwner ? (
                <div className="header-actions">
                  <button
                    className="edit-studylist-btn"
                    onClick={handleEditStudyList}
                    title="Edit Study List"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-studylist-btn"
                    onClick={handleDeleteStudyList}
                    title="Delete Study List"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                studyList?.createdBy && (
                  <div className="creator-info">
                    <img
                      src={
                        studyList?.createdBy.profilePic
                          ? studyList?.createdBy?.profilePic?.url
                          : defaultProfile
                      }
                      className="creator-avatar"
                      alt="Creator"
                    />
                    <div className="creator-details">
                      <span>Created by</span>
                      <strong>
                        {studyList?.createdBy.firstName +
                          " " +
                          studyList?.createdBy.lastName}
                      </strong>
                    </div>
                  </div>
                )
              )}
            </header>

            {isOwner && (
              <section className="profile-stats">
                <div className="profile-stat-card">
                  <FaFileAlt />
                  <div className="profile-stat-number">
                    {studyList?.notes?.length || 0}
                  </div>
                  <div className="profile-stat-label">Notes</div>
                </div>
                <div className="profile-stat-card">
                  <FaTasks />
                  <div className="profile-stat-number">
                    {todo ? todo.length + " " + "Scheduled" : "Not Set"}
                  </div>
                  <div className="profile-stat-label">To-Do Task</div>
                </div>
                <div className="profile-stat-card">
                  {studyList?.isPublic ? <FaGlobe /> : <FaLock />}
                  <div className="profile-stat-number">
                    {studyList?.isPublic ? "Public" : "Private"}
                  </div>
                  <div className="profile-stat-label">Visibility</div>
                </div>
              </section>
            )}

            <main className="profile-content">
              {isOwner && (
                <section className="profile-content-section">
                  <h2>To-Do Details</h2>
                  {todo && (
                    <button
                      onClick={() => handleOpenTodoModal()}
                      style={{
                        backgroundColor: "#3092FA",
                        color: "#ffffff",
                        margin: "10px 0",
                        marginLeft: "auto",
                        display: "block",
                      }}
                      className="add-todo-btn profile-list-control-btn"
                    >
                      Add To-Do
                    </button>
                  )}
                  <div className="todo-details-container">
                    {todo ? (
                      sortTodo.map((t) => {
                        return (
                          <TodoCard
                            todo={t}
                            onEdit={() => handleOpenTodoModal(t)}
                            onDelete={() => handleDeleteTodo(t._id)}
                            onToggleStatus={() => handleToggleStatus(t)}
                          />
                        );
                      })
                    ) : (
                      <div className="todo-add">
                        <p>No task scheduled for this list.</p>
                        <button
                          onClick={() => handleOpenTodoModal()}
                          className="add-todo-btn profile-list-control-btn"
                        >
                          Add To-Do
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              )}
              <section className="profile-content-section">
                <h2>Attached Notes</h2>
                {studyList?.notes && studyList?.notes.length > 0 ? (
                  <div className="profile-expandable-list-container">
                    {studyList?.notes.map((note) => (
                      <NoteCard key={note._id} note={note} />
                    ))}
                  </div>
                ) : (
                  <p className="no-notes-message">
                    No notes attached to this study list yet.
                  </p>
                )}
              </section>
            </main>
          </div>
        </div>
      </div>

      {showTodoModal && (
        <AddTodoModal
          onClose={handleCloseTodoModal}
          onAddTodo={handleSaveTodo}
          todoToEdit={editingTodo}
          studyList={[studyList]}
          isStudyListLocked={true}
        />
      )}

      {!studyList && !loading && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>Could not find the Study List..</h2>
        </div>
      )}
    </>
  );
};

export default ViewStudyList;


const TrashIcon = () => (
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
);
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
const CalendarIcon = () => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const CheckCircleIcon = () => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
        <h4 className="profile-note-title">{note.title}</h4>
        <p className="profile-note-course">{note.description}</p>
      </div>
    </div>
  );
};

const TodoCard = ({ todo, onEdit, onDelete, onToggleStatus }) => {
  if (!todo) return null;
  const isCompleted = todo.status === "completed";
  return (
    <div className={`my-todo-card ${isCompleted ? "completed" : ""}`}>
      <div className="my-todo-status-icon" onClick={onToggleStatus}>
        {isCompleted ? (
          <CheckCircleIcon />
        ) : (
          <div className="todo-checkbox-icon"></div>
        )}
      </div>
      <div className={` my-todo-text ${isCompleted ? "line-through" : ""}`}>
        <h3>{todo.title}</h3>
        <p>{todo.description}</p>
      </div>
      {/* <div className="view-card__meta">  */}
      {todo.dueDate && (
        <div className="my-due-date">
          <CalendarIcon /> {formatDate(todo.dueDate)}
        </div>
      )}
      <div className={`priority-badge ${todo.priority}`}>{todo.priority}</div>

      <button
        className="card-action-btn"
        onClick={onEdit}
        disabled={isCompleted}
      >
        <EditIcon />
      </button>
      <button className="card-action-btn delete" onClick={onDelete}>
        <TrashIcon />
      </button>
    </div>
    // </div>
  );
};
