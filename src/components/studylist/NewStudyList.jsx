
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EndPoint } from '../apis/EndPoint'; 
import './NewStudyList.css';  
import { FaBookOpen } from 'react-icons/fa';
import { useAuth } from '../auth/Auth';

const StudyListCard = ({ list }) => {
    const navigate = useNavigate();
    const {user }= useAuth()
    const handleCardClick = (list) => {
        
         
    if(!user){
     navigate("/signin");
    }else if(user)
     navigate(`/viewstudylist/${list._id}`);
    };

    return (
        <div className="studylist-card-home" onClick={()=>handleCardClick(list)}>
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

const NewestStudyLists = ({searchlists}) => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewestPublicLists = async () => {
            try {
                const response = await axios.get(EndPoint.PUBLIC_STUDYLIST);
                setLists(response.data.slice(0, 6));
            } catch (err) {
                console.error("Failed to fetch public study lists:", err);
                setError("Could not load study lists.");
            } finally {
                setLoading(false);
            }
        };

        fetchNewestPublicLists();
    }, []);  

     
  
    return (
        <div className="newest-studylists-section">
            <h4>Explore New Study Lists 📚</h4>
            <div className="studylists-grid-home">
                {lists.length > 0 ? (
                    (searchlists ? searchlists : lists).map(list => <StudyListCard key={list._id} list={list} />)
                ) : (
                    <p>No public study lists found yet.</p>
                )}
            </div>
        </div>
    );
};

export default NewestStudyLists;