import { useEffect, useState } from "react";
import TrendingImage from "../assets/image.png";
import { Link, useNavigate } from "react-router-dom";
import CreateCourseModal from "../course/CreateCourse";
import axios from "axios";
import { EndPoint } from "../apis/EndPoint";
import CourseCard from "../course/CourseCard";
import CreateStudyListModal from "../studylist/StudyListCreate";
import { FaBookOpen } from "react-icons/fa";
import { useAuth } from "../auth/Auth";

function MyLibrary() {
  const { user } = useAuth();
  const [ownCourses, setOwnCourses] = useState([]);
  const [studyList, setStudyList] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [followCourses, setFollowCourses] = useState([]);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get(EndPoint.GET_USER_Data);
      // console.log(res.data);
      setOwnCourses(res.data.courses);
      setFollowCourses(res.data.followedCourses);
      setTodoList(res.data.todos);

      setStudyList(res.data.savedStudyLists);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const [isCreateStudy, setIsCreateStudy] = useState(false);
  return (
    <>
      {/* Upper Panel  */}
      <div className="study-container">
        <p className="main-title" style={{ fontSize: "30px" }}>
          Start your ✨ study session
        </p>
        <div className="options-wrapper">
          <button
            onClick={() => navigate("/uploadnotes")}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <div className="option-card blue">
              <div className="card-header">
                <UploadIcon />
                <h2>Upload a document to start working on it</h2>
              </div>
            </div>
          </button>

          <button
            onClick={() => setIsCreateStudy(true)}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <div className="option-card orange">
              <div className="card-header">
                <PlanIcon />
                <h2> Start a study plan to nail your next exam</h2>
              </div>
            </div>
          </button>
          {isCreateStudy && (
            <CreateStudyListModal
              onClose={() => setIsCreateStudy(false)}
              setStudyListAll={setStudyList}
            />
          )}
        </div>
      </div>

      {/* MyCourse  */}
      <section className="trending-section">
        <h2 className="trending-title">My courses</h2>
        <div className="trending-card">
          <div className="trending-content">
            <h3>
              Find courses to follow or create and start your own library.
            </h3>
            <button
              className="add-courses-btn"
              onClick={() => {
                setOpenModal(true);
                setCourseToEdit(null);
              }}
            >
              <PlusIcon />
              Add Courses
            </button>
          </div>
          {openModal && (
            <CreateCourseModal
              onClose={() => {
                setOpenModal(false);
                fetchUser();
              }}
              courseToEdit={courseToEdit}
            />
          )}

          <div className="trending-image-container">
            <img src={TrendingImage} alt="Trending courses illustration" />
          </div>
        </div>
      </section>
      <div className="course-section">
        {ownCourses?.map((course, index) => {
          return (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              isOwnCourse={true}
              onEdit={() => {
                setCourseToEdit(course);
                setOpenModal(true);
              }}
            />
          );
        })}
      </div>

      {user && followCourses.length > 0 && (
        <>
          <h2 className="trending-title" style={{ marginTop: "50px" }}>
            My Following
          </h2>
          <div className="course-section">
            {followCourses.map((course, index) => {
              return (
                <CourseCard key={course.id} course={course} index={index} />
              );
            })}
          </div>
        </>
      )}
      {/* StudyList  */}

      {user && (
        <div className="quizzes-container">
          <h2 className="title">My StudyList</h2>
          {studyList.length > 0 ? (
            <div>
              <ExpandableList
                items={studyList}
                renderItem={(list, index) => (
                  <StudyListCard key={`${list._id}-${list}`} list={list} />
                )}
              />
            </div>
          ) : (
            <div>
              <div className="empty-state-box">
                <InfoIcon />
                <p>Once you create your Study List, it will appear here.</p>
              </div>

              <button
                onClick={() => setIsCreateStudy(true)}
                className="create-quiz-button"
              >
                <UploadIcon /> Create StudyList
              </button>
            </div>
          )}
        </div>
      )}

      {/* TodoList  */}
      {user && (
        <div className="quizzes-container">
          <h2 className="title">My ToDo</h2>
          {todoList.length > 0 ? (
            <div>
              <ExpandableList
                items={todoList}
                renderItem={(todo, index) => (
                  <TodoCard key={`${todo._id}-${index}`} todo={todo} />
                )}
              />
            </div>
          ) : (
            <div>
              <div className="empty-state-box">
                <InfoIcon />
                <p>Build Your List, Boost Your Focus.</p>
              </div>

              <button className="create-quiz-button">
                <UploadIcon />
                Create ToDO!
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default MyLibrary;

const sampleUser = {
  firstName: "Aman",
  lastName: "Khan",
  profilePic: "https://placehold.co/100x100/E2E8F0/4A5568?text=AK",
  university: { name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya" },
  bio: "Computer Science student passionate about open-source and web development. Sharing my notes to help others learn.",

  uploadedNotes: [
    {
      _id: "note1",
      title: "Introduction to Algorithms",
      course: "CS101",
      description: "Ch. 1–3 Notes with solved examples",
    },
    {
      _id: "note2",
      title: "Operating System Concepts",
      course: "CS202",
      description: "Process management and scheduling",
    },
    {
      _id: "note3",
      title: "Database Management Systems",
      course: "CS303",
      description: "ER Diagrams & SQL Queries",
    },
  ],

  // savedStudyLists: [
  //   { _id: 'saved1', title: 'Data Structures Summary', course: 'CS202', description: 'Linked Lists, Trees, Graphs quick notes' },
  //   { _id: 'saved2', title: 'Computer Networks', course: 'CS404', description: 'OSI layers + TCP/IP overview' }
  // ],

  followedCourses: [
    { _id: "course1", name: "CS101 - Algorithms" },
    { _id: "course2", name: "CS202 - Data Structures" },
    { _id: "course3", name: "CS303 - DBMS" },
  ],

  studyLists: [
    {
      _id: "study1",
      title: "DBMS Preparation",
      subject: "Database Management Systems",
      notes: ["Normalization", "ER Model", "SQL Joins"],
    },
    {
      _id: "study2",
      title: "OS Exam Notes",
      subject: "Operating Systems",
      notes: ["Deadlocks", "Process Scheduling", "Memory Management"],
    },
  ],

  todoList: [
    {
      _id: "task1",
      title: "Revise DBMS normalization",
      description: "Work Before Deadline is must",
      dueDate: "2025-08-30",
      priority: "high",
      completed: false,
    },
    {
      _id: "task2",
      title: "Prepare OS scheduling algorithms",
      description: "Unit 1 to 5 all chapter",
      dueDate: "2025-09-01",
      priority: "medium",
      completed: true,
    },
    {
      _id: "task3",
      title: "Complete CN assignment",
      description: "Unit 1 to 5 all chapter",
      dueDate: "2025-09-02",
      priority: "medium",
      completed: false,
    },
    {
      _id: "task4",
      title: "Update uploaded notes for CS101",
      description: "Unit 1 to 5 all chapter",
      dueDate: "2025-09-03",
      priority: "low",
      completed: false,
    },
  ],
};
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
const SeeMoreIcon = () => (
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
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
const SeeLessIcon = () => (
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
    <polyline points="18 15 12 9 6 15"></polyline>
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
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const NoteCard = ({ note }) => {
  return (
    <div className="profile-note-card-profile">
      <div className="profile-note-icon">📄</div>
      <div className="profile-note-details">
        <h4 className="profile-note-title">{note.title}</h4>
        <p className="profile-note-course">{note.description}</p>
      </div>
    </div>
  );
};
const StudyListCard = ({ list }) => {
  // console.log(list);

  const navigate = useNavigate();
  const handleCardClick = (list) => {
    navigate(`/viewstudylist/${list._id}`);
  };

  return (
    <div className="studylist-card-home" onClick={() => handleCardClick(list)}>
      <div className="studylist-card-home-icon">
        <FaBookOpen />
      </div>
      <div className="studylist-card-home-content">
        <h5 className="studylist-card-home-title">{list?.title}</h5>
        <p className="studylist-card-home-desc">{list?.description}</p>
      </div>
    </div>
  );
};

const TodoCard = ({ todo }) => {
  return (
    <>
      <div className="my-todo-card">
        <div className="my-todo-text">
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          {/* {todo.studyList && (
                              <Link  className="my-study-list-tag" to={`/studylist`}  state={{ title: todo.studyList.title }}>
                                <BookIcon /> {todo.studyList.title}
                            </Link>
                            )} */}
        </div>
        <div className="my-todo-meta">
          {todo.dueDate && (
            <div className="my-due-date">
              <CalendarIcon /> {formatDate(todo.dueDate)}
            </div>
          )}
          <div className={`priority-badge ${todo.priority}`}>
            {todo.priority}
          </div>
          {/* <button className="edit-btn" onClick={(e) => handleEditClick(todo) }><EditIcon /></button> */}
          {/* <button className="delete-btn" onClick={(e) => handleDeleteTodo(e, todo._id)}><TrashIcon /></button>  */}
        </div>
      </div>
    </>
  );
};

const ExpandableList = ({
  items,
  renderItem,
  initialVisible = 3,
  step = 3,
}) => {
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  const visibleItems = items.slice(0, visibleCount);

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + step);
  };

  const handleSeeLess = () => {
    setVisibleCount(initialVisible);
  };

  return (
    <div>
      <div className="profile-expandable-list-container">
        {visibleItems.map((item, index) => renderItem(item, index))}
      </div>
      <div className="profile-list-controls">
        {items.length > visibleCount && (
          <button onClick={handleSeeMore} className="profile-list-control-btn">
            See More <SeeMoreIcon />
          </button>
        )}
        {visibleCount > initialVisible && (
          <button onClick={handleSeeLess} className="profile-list-control-btn">
            See Less <SeeLessIcon />
          </button>
        )}
      </div>
    </div>
  );
};

const UploadIcon = () => (
  <svg
    width="48"
    height="48"
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

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);
const InfoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }} // Prevents the icon from shrinking if the text is long
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
