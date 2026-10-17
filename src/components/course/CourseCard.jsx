import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Auth";
import axios from "axios";
import { EndPoint } from "../apis/EndPoint";

function CourseCard({ course, index, setAllCourses, refreshCourses }) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(null);

   
  let isOwnCourse = user?._id == course?.createdBy;
   

  useEffect(() => {
    if (user && course) {
      setIsFollowing(course?.followers?.includes(user._id));
    }
  }, [user, course]);

  // if (!isFollowing) {
  //   console.log("false :::");

  //   console.log(course);
  // }
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        const res = await axios.delete(
          `${EndPoint.UNFOLLOW_COURSE}/${course._id}/unfollow`,
        );

        setIsFollowing(false);
        if (refreshCourses) refreshCourses();
      } else {
        const res = await axios.post(
          `${EndPoint.FOLLOW_COURSE}/${course._id}/follow`,
        );

        setIsFollowing(true);
        if (refreshCourses) refreshCourses();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const colorMap = {
    green: { bg: "#ecfcdac0", icon: "#2CC302" },
    orange: { bg: "#fde1d2ee", icon: "#F36A1C" },
  };

  const currentTheme = colorMap[index % 2 == 0 ? "green" : "orange"];

  const navigate = useNavigate();
  const navigateCourse = () => {
    if (!user) {
      navigate("/signin");
    } else if (user)
      navigate(`/course/${course._id}`, {
        state: { theme: currentTheme, isOwnCourse: isOwnCourse },
      });
  };

  // console.log("course : ",course );
  // console.log("isFollowing : ",isFollowing);

  return (
    <div className="course-card" style={{ backgroundColor: currentTheme.bg }}>
      <div className="card-header">
        <FolderIcon color={currentTheme.icon} />
      </div>
      <div
        className="card-body"
        onClick={navigateCourse}
        style={{ cursor: "pointer" }}
      >
        <h3 className="card-title">
          {course?.name ? course?.name : course?.branch}
        </h3>
        <p className="card-subtitle">
          <BookmarkIcon />
          {course?.name?.length > 15 ? course.code : course.name}
        </p>

        <p className="card-docs">
          <DocumentIcon />
          {course?.notes?.length} documents
        </p>
      </div>
      <div className="card-footer">
        {!isOwnCourse ? (
          <button className={`follow-btn`} style={{}} onClick={handleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        ) : (
          <button className="follow-btn">Edit</button>
        )}
      </div>
    </div>
  );
}

export default CourseCard;

const FolderIcon = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);
const BookmarkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#5f6368"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
  </svg>
);
const DocumentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#5f6368"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#5f6368"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2c-3.3 0-9.9 1.7-9.9 5v2.8h19.8V19c0-3.3-6.6-5-9.9-5z" />
  </svg>
);
