// File: src/components/todo/AddTodoModal.jsx (Nayi File)

import React, { useState, useEffect } from "react";
import "./TodoList.css"; // Is path ko zaroor check kar lein
 
const AddTodoModal = ({
  onClose,
  onAddTodo,
  todoToEdit,
  studyList,
  isStudyListLocked = false,
}) => {
  const isEditMode = Boolean(todoToEdit?._id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    studyList: "",
  });

  useEffect(() => {
    if (todoToEdit) {
      setFormData({
        title: todoToEdit.title || "",
        description: todoToEdit.description || "",
        dueDate: todoToEdit.dueDate
          ? new Date(todoToEdit.dueDate).toISOString().split("T")[0]
          : "",
        priority: todoToEdit.priority || "medium",
        status: todoToEdit.status || "pending",
        studyList: todoToEdit.studyList?._id || "",
      });
    }
  }, [todoToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = {
      ...formData,
      studyList: formData.studyList === "" ? null : formData.studyList,
    };

    onAddTodo(payload, todoToEdit?._id);
    onClose();
  };

  return (
    <div className="todo-modal-container" onClick={onClose}>
      <div className="todo-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className="todo-modal-header">
          <div className="header-icon">
            <ListIcon />
          </div>
          {isEditMode ? <h1>Edit Todo</h1> : <h1>Add a New Todo</h1>}
          <p>What do you need to get done?</p>
        </div>
        <form onSubmit={handleSubmit} className="todo-todo-modal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Finish Physics Lab Report"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Add some details..."
            ></textarea>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="studyList">
              Link to Study List{" "}
              <span style={{ color: "gray" }}>(Optional)</span>
            </label>
            <select
              id="studyList"
              name="studyList"
              value={formData.studyList}
              onChange={handleChange}
              disabled={isStudyListLocked}
            >
              <option value="">None</option>
              {studyList?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div className="todo-form-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {isEditMode ? "Save Changes" : "Add Todo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTodoModal;

//  Icons
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
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);