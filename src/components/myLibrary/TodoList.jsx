
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

const PlanIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="24" fill="#FFF5EB" />
    <path
      d="M29.3333 15.1667H28.1667V14C28.1667 13.5398 27.7936 13.1667 27.3333 13.1667H26.1667C25.7064 13.1667 25.3333 13.5398 25.3333 14V15.1667H21.6667V14C21.6667 13.5398 21.2936 13.1667 20.8333 13.1667H19.6667C19.2064 13.1667 18.8333 13.5398 18.8333 14V15.1667H17.6667C16.2985 15.1667 15.1667 16.2985 15.1667 17.6667V31.3333C15.1667 32.7015 16.2985 33.8333 17.6667 33.8333H29.3333C30.7015 33.8333 31.8333 32.7015 31.8333 31.3333V17.6667C31.8333 16.2985 30.7015 15.1667 29.3333 15.1667Z"
      fill="#ED8936"
    />
  </svg>
);

function TodoList(){

  return  <>
     <div className="quizzes-container">
        <h2 className="title">My ToDo</h2>

        
        <div className="empty-state-box">
         
          <p>Build Your List, Boost Your Focus.</p>
        </div>
        
        <button className="create-quiz-button">
            <UploadIcon/>
           Create ToDO!
        </button>
      </div>
      </>

}

export default TodoList;