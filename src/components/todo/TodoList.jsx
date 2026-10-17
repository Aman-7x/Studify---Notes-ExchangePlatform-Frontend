// File: src/components/todo/TodoListPage.jsx (Naya Final Code)

import React, { useState, useMemo, useEffect } from "react";
import "./TodoList.css";
import { EndPoint } from "../apis/EndPoint";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AddTodoModal from "./AddTodoModel";
import { useAuth } from "../auth/Auth";


const TodoList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {user} = useAuth();
  const [todos, setTodos] = useState([]);
  const [studyList, setStudyList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [todosResponse, studyListsResponse] = await Promise.all([
          axios.get(EndPoint.MY_TODO, 
        ),
          axios.get(EndPoint.My_STUDYLIST, 
          ),
        ]);
        setTodos(todosResponse.data);
        setStudyList(studyListsResponse.data);
      } catch (error) {
        toast.error("Failed to load your data.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const { preselectedStudyList } = location.state || {};
    if (preselectedStudyList) {
      setEditingTodo({ studyList: { _id: preselectedStudyList._id } });
      setShowModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTodo(null);
  };

  const handleSaveTodo = async (todoData, todoId) => {
    const isEditMode = Boolean(todoId);
    try {
      if (isEditMode) {
        const res = await axios.put(
          `${EndPoint.UPDATE_TODO}/${todoId}`,
          todoData,
        );
        setTodos((prev) => prev.map((t) => (t._id === todoId ? res.data : t)));
        toast.success("Todo updated successfully!");
      } else {
        const payloadForCreate = {
          ...todoData,
          studyListId: todoData.studyList || null,
        };
        // console.log(payloadForCreate);

        delete payloadForCreate.studyList;

        const res = await axios.post(EndPoint.CREATE_TODO, payloadForCreate,
          );
        setTodos((prev) => [res.data, ...prev]);
        toast.success("Todo added successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleDeleteTodo = async (e, todoId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${EndPoint.DELETE_TODO}/${todoId}`,
        );
        setTodos((prev) => prev.filter((todo) => todo._id !== todoId));
        toast.success("Todo deleted!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete.");
      }
    }
  };

  const toggleTodoCompletion = (todo, todoId) => {
    const updatedTodo = {
      ...todo,
      status: todo.status === "pending" ? "completed" : "pending",
    };
    setTodos(todos.map((t) => (t._id === todoId ? updatedTodo : t)));
    handleSaveTodo(updatedTodo, todoId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedTodos = todos
    ? [...todos].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      )
    : null;

  const pendingTodos = useMemo(
    () => sortedTodos.filter((t) => t.status === "pending"),
    [sortedTodos]
  );
  const completedTodos = useMemo(
    () => sortedTodos.filter((t) => t.status === "completed"),
    [sortedTodos]
  );

  return (
    <div className="todo-page-container">
      <header className="todo-page-header">
        <div className="todo-header-content">
          <div className="todo-page-icon">
            <ListIcon />
          </div>
          <div>
            <h1>My Todos</h1>
            <p>Stay organized and keep track of your tasks.</p>
          </div>
        </div>
        <div className="todo-header-actions">
          <div className="todo-stat-pills">
            <div className="todo-stat-pill">
              Total <span>{todos.length}</span>
            </div>
            <div className="todo-stat-pill pending">
              Pending <span>{pendingTodos.length}</span>
            </div>
            <div className="todo-stat-pill completed">
              Completed <span>{completedTodos.length}</span>
            </div>
          </div>
          <button
            className="todo-add-new-btn"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon /> Add Todo
          </button>
        </div>
      </header>

      <main className="todo-main-content">
        <section className="todo-column">
          <div className="todo-column-header">
            <h2>
              Pending <span>({pendingTodos.length})</span>
            </h2>
          </div>
          <div className="todo-list">
            {pendingTodos.length > 0 ? (
              pendingTodos.map((todo) => (
                <div key={todo._id} className="todo-card">
                  <div
                    className="todo-checkbox-icon"
                    onClick={() => toggleTodoCompletion(todo, todo._id)}
                  ></div>
                  <div className="todo-text">
                    <h4>{todo.title}</h4>
                    <p>{todo.description}</p>
                    {todo.studyList && (
                      <Link
                        className="study-list-tag"
                        to={`/studylist`}
                        state={{ title: todo.studyList.title }}
                      >
                        <BookIcon /> {todo.studyList.title}
                      </Link>
                    )}
                  </div>
                  <div className="todo-meta">
                    {todo.dueDate && (
                      <div className="due-date">
                        <CalendarIcon /> {formatDate(todo.dueDate)}
                      </div>
                    )}
                    <div className={`priority-badge ${todo.priority}`}>
                      {todo.priority}
                    </div>

                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(todo)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDeleteTodo(e, todo._id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>All tasks completed! 🎉</p>
              </div>
            )}
          </div>
        </section>

        <section className="todo-column">
          <div className="todo-column-header">
            <h2>
              Completed <span>({completedTodos.length})</span>
            </h2>
          </div>
          <div className="todo-list">
            {completedTodos.map((todo) => (
              <div key={todo._id} className="todo-card completed">
                <div
                  className="todo-checkbox-icon"
                  onClick={() => toggleTodoCompletion(todo, todo._id)}
                >
                  <CheckCircleIcon />
                </div>
                <div className="todo-text">
                  <h4>{todo.title}</h4>
                  <p>{todo.description}</p>
                  {todo.studyList && (
                    <Link
                      className="study-list-tag"
                      to={`/studylist`}
                      state={{ title: todo.studyList.title }}
                    >
                      <BookIcon /> {todo.studyList.title}
                    </Link>
                  )}
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeleteTodo(e, todo._id)}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showModal && (
        <AddTodoModal
          onClose={handleCloseModal}
          onAddTodo={handleSaveTodo}
          todoToEdit={editingTodo}
          studyList={studyList}
        />
      )}
    </div>
  );
};

export default TodoList;


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
const ListIcon = () => (
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
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
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
