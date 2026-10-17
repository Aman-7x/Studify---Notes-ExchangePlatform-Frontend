// File: src/components/studylist/CreateStudyListModal.jsx

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import "./StudyListCreate.css";
import axios from "axios";
import { EndPoint } from "../apis/EndPoint";
import { useAuth } from "../auth/Auth";



const CreateStudyListModal = ({
  onClose,
  onSuccess,
  listToEdit,
  preSelectedNote,
  setStudyListAll
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [universityId, setUniversityId] = useState(null);
  const isEditMode = Boolean(listToEdit);
  const {user} = useAuth();
  


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addNoteToList = (note) => {
    if (!selectedNotes.find((n) => n._id === note._id)) {
      setSelectedNotes((prev) => [...prev, note]);
    }
  };


  const removeNoteFromList = (noteId) => {
    setSelectedNotes((prev) => prev.filter((n) => n._id !== noteId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      notes: selectedNotes.map((note) => note._id),
    };
    try {
      if (isEditMode) {
       const res =  await axios.put(
          `${EndPoint.UPDATE_STUDYLIST}/${listToEdit._id}`,
          payload,
          
        );
        toast.success("StudyList Updated Successfully");
        if(setStudyListAll)
        setStudyListAll((prev)=>prev.map((item)=>item._id===res.data.studyList._id?res.data.studyList:item))
        // onSuccess();
        onClose();
      } else {
        const res = await axios.post(
          EndPoint.CREATE_STUDYLIST,
          payload,
          
        );
        // onSuccess();
        if(setStudyListAll)
        setStudyListAll((prev)=>[res.data,...prev])
        toast.success("StudyList Created Successfully");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something Went Wrong!");
    }
  };

  useEffect(() => {
    if (!searchQuery) return;
    const timeTake = setTimeout(async () => {
      if (searchQuery && searchQuery.length !== 0) {
        try {
          const res = await axios.get(`${EndPoint.All_NOTES}`, {
            params: { search: searchQuery, universityId: universityId },
          });
          setSearchResults(res.data);
          // console.log(res.data);
        } catch (err) {
          console.log(err);
          toast.error("Something Went Wrong!");
        }
      } else {
        setLoading(false);
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timeTake);
  }, [searchQuery]);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
         
        const userUniversityName = user.university?.name;

        if (userUniversityName) {
          const resUniversity = await axios.get(EndPoint.UNIVERSITY_ALL, {
            params: { search: userUniversityName },
          });
          const foundUniversity = resUniversity.data[0];
          setUniversityId(foundUniversity._id);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something Went Wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  useEffect(() => { 
    // console.log(listToEdit);

    if (isEditMode && listToEdit) {
      setFormData({
        title: listToEdit.title || "",
        description: listToEdit.description || "",
        isPublic: listToEdit.isPublic,
      });
      setSelectedNotes(listToEdit.notes || []);
    } else if (preSelectedNote) {
      setSelectedNotes([preSelectedNote]);
    }
  }, [listToEdit, isEditMode, preSelectedNote]);

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
    <div className="modal-container-nested">
      <div className="modal-content-nested">
        <button className="close-btn" onClick={onClose}>
          <CloseIcon />
        </button>

        <div className="modal-header">
          <div className="header-icon">
            <BookIcon />
          </div>
          {isEditMode ? (
            <h3>Edit your Study List</h3>
          ) : (
            <h3>Create a new Study List</h3>
          )}
          <p>Organize your notes and todos in one place to study smarter.</p>
        </div>

        <form onSubmit={handleSubmit} className="studylist-form">
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Semester 5 Exam Prep"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="What is this study list about?"
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <label>Add Notes</label>
            <div className="notes-grid">
              <div className="notes-search-column">
                <div className="search-input-wrapper">
                  <SearchIcon />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for notes to add..."
                  />
                </div>
                <div className="search-results-list">
                  {searchResults.length > 0 ? (
                    searchResults.map((note) => (
                      <div key={note._id} className="search-result-item">
                        <span>{note.title}</span>
                        <button
                          type="button"
                          onClick={() => addNoteToList(note)}
                          className="add-btn"
                        >
                          <AddIcon />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">Search to find notes.</div>
                  )}
                </div>
              </div>
              <div className="selected-notes-column">
                <div className="selected-notes-list">
                  {selectedNotes.length > 0 ? (
                    selectedNotes.map((note) => (
                      <div key={note._id} className="selected-note-item">
                        <span>{note.title}</span>
                        <button
                          type="button"
                          onClick={() => removeNoteFromList(note._id)}
                          className="remove-btn"
                        >
                          <RemoveIcon />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      Notes you add will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <label htmlFor="isPublic">Make this list public</label>
            </div>
            <button type="submit" className="submit-btn">
              { isEditMode ? "Save Changes" :  "Create Study List"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateStudyListModal;








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
const BookIcon = () => (
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
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);
const SearchIcon = () => (
  <svg
    xmlns="http://www.w.org/2000/svg"
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
);
const AddIcon = () => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const RemoveIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);