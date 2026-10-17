import React from 'react';

 
const UploadIcon = () => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="24" fill="#EBF5FF" />
    <path
      d="M24.6667 18.6667V30.5H22.3333V18.6667L17.5 23.5L15.8333 21.8333L23.5 14.1667L31.1667 21.8333L29.5 23.5L24.6667 18.6667Z"
      fill="#4299E1"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}  
  >
    <rect width="24" height="24" rx="6" fill="#3B82F6" />
    <path
      d="M12 17.0001V11.0001M12 8.00008H12.01"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


function StudyListTemp(){
  return  <>
         <div className="quizzes-container">
        <h2 className="title">My StudyList</h2>

          
        <div className="empty-state-box">
          <InfoIcon />
          <p>Once you create your Study List, it will appear here.</p>
        </div>
        
      
        <button className="create-quiz-button">
          <UploadIcon/> Create StudyList
        </button>
      </div>
</>
}
    
         

export default StudyListTemp;