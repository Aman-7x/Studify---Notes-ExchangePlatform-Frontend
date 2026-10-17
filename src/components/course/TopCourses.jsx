import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import axios from "axios";
import { EndPoint } from "../apis/EndPoint";
 

function TopCourses({ courses }) {
  const [allCourses, setAllCourses] = useState([]);
 
  const loadCourses = async () => {
    try { 
      const response = await axios.get(EndPoint.TOP_COURSES);
     
      setAllCourses(response.data);
    } catch (err) {
      console.error("Error : " + err.message);
    }
  };
  useEffect(() => {
    loadCourses();
  }, []);

  // console.log(courses);

  return (
    <section className="top-courses-section">
      <h3 className="section-title">Top courses</h3>
      <div className="course-cards-container">
        {(courses ? courses : allCourses).slice(0, 6).map((course, index) => (          
          <CourseCard
          key={course._id}
          course={course}
          index={index}
          setAllCourses={setAllCourses}
          refreshCourses={loadCourses}
          />
        ))}
      </div>
    </section>
  );
}

export default TopCourses;
