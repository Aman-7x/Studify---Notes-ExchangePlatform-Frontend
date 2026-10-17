
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { EndPoint } from "../apis/EndPoint";
import CreateStudyListModal from "./StudyListCreate";
import "./SaveToStudylistModal.css"; 
import { useAuth } from "../auth/Auth";

const SaveToStudylistModal = ({ noteToSave, onClose,onSuccess }) => {

const [myStudylists, setMyStudylists] = useState([]);
const [loading, setLoading] = useState(true);
const [showCreateView, setShowCreateView] = useState(false);

const [initialSelectedIds, setInitialSelectedIds] = useState(new Set());
const [currentSelectedIds, setCurrentSelectedIds] = useState(new Set());

// 
const {user} = useAuth();

useEffect(() => {
    const fetchInitialState = async () => {
        if (!noteToSave) return;
        setLoading(true);
        try {

            const listsRes = await axios.get(EndPoint.My_STUDYLIST,
            );
            const allLists = listsRes.data || [];
            setMyStudylists(allLists);


            const savedInIds = new Set();
            allLists.forEach(list => {
                if (list.notes.some(note => note._id === noteToSave._id)) {
                    savedInIds.add(list._id);
                }
            });
            

            setInitialSelectedIds(savedInIds);
            setCurrentSelectedIds(savedInIds);

        } catch (error) {
            // toast.error("Could not fetch your studylists.");
        } finally {
            setLoading(false);
        }
    };
    fetchInitialState();
}, [noteToSave]);   
const handleCheckboxChange = (listId) => {
    setCurrentSelectedIds(prev => {
        const newSet = new Set(prev); 
        if (newSet.has(listId)) {
            newSet.delete(listId);  
        } else {
            newSet.add(listId);
        }
        return newSet;
    });
};

const handleDone = async () => {
    setLoading(true);
    try {
        const listsToAddNoteTo = [...currentSelectedIds].filter(id => !initialSelectedIds.has(id));
        const listsToRemoveNoteFrom = [...initialSelectedIds].filter(id => !currentSelectedIds.has(id));

        const addPromises = listsToAddNoteTo.map(listId =>
            axios.post(`${EndPoint.CREATE_STUDYLIST}/${listId}/notes/${noteToSave._id}`, {},
                )
        );

        const removePromises = listsToRemoveNoteFrom.map(listId =>
            axios.delete(`${EndPoint.DELETE_STUDYLIST}/${listId}/notes/${noteToSave._id}`, 
            )
        );

        await Promise.all([...addPromises, ...removePromises]);
                 if (addPromises.length > 0) {
                toast.success(`Note added to ${addPromises.length} list(s)`);
            }
            if (removePromises.length > 0) {
                toast.info(`Note removed from ${removePromises.length} list(s)`);
            }
            if (addPromises.length === 0 && removePromises.length === 0) {
                toast.info("No changes were made.");
            }
       setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 2000); 
    } catch (error) {
        toast.error("An error occurred. Please try again.");
        onClose();
    } finally {
        setLoading(false);
    }
};

const handleCreateSuccess = () => {
    toast.success("New studylist created and note added!");
     setTimeout(() => {
            if (onSuccess) onSuccess();
        }, 500);
};
return (
    <div className="save-modal-overlay" onClick={onClose}>
        <div className="save-modal-content" onClick={(e) => e.stopPropagation()}>
            {showCreateView ? (
                <CreateStudyListModal
                    onClose={() => setShowCreateView(false)}
                    onSuccess={handleCreateSuccess}
                    preSelectedNote={noteToSave}
                />
            ) : (
                <>
                    <div className="save-modal-header">
                        <h3>Save to a Studylist</h3>
                        <button className="close-btn-modal" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <div className="studylist-list-container">
                        {loading ? (
                            <p style={{ textAlign: 'center', color: '#64748b' }}>Loading lists...</p>
                        ) : (
                            myStudylists.map((list) => (
                                <div key={list._id} className="studylist-item">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={currentSelectedIds.has(list._id)}
                                            onChange={() => handleCheckboxChange(list._id)}
                                        />
                                        {list.title}
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="save-modal-actions">
                        <button
                            className="create-new-studylist-btn"
                            onClick={() => setShowCreateView(true)}
                        >
                            + Create New Studylist
                        </button>
                        <button
                            className="done-btn"
                            onClick={handleDone}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Done"}
                        </button>
                    </div>
                </>
            )}
        </div>
        <ToastContainer position="top-right" autoClose={3000}/>
    </div>
);
};

export default SaveToStudylistModal;