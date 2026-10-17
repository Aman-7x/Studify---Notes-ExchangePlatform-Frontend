import { useState } from "react";
import TrendingImage from "../../assets/image.png";
import CreateCourseModal from "../CreateCourse";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/Auth";


function TrendingCourses() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const {user} = useAuth();
  const handleLogic = () => {
    if (!user) {
      navigate("/signin");
    } else if (user) setOpenModal(true);
  };
  return (
    <section className="trending-section">
      <h2 className="trending-title">Trending in your courses</h2>
      <div className="trending-card">
        <div className="trending-content">
          <h3>Follow courses and get tailored recommendations!</h3>
          <button className="add-courses-btn" onClick={handleLogic}>
            <PlusIcon />
            Add Courses
          </button>
          {openModal && (
            <CreateCourseModal
              onClose={() => {
                setOpenModal(false);
              }}
            />
          )}
        </div>

        <div className="trending-image-container">
          <img src={TrendingImage} alt="Trending courses illustration" />
        </div>
      </div>
    </section>
  );
}

export default TrendingCourses;


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
