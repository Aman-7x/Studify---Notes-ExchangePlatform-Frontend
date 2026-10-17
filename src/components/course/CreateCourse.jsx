import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateCourse.css";
import axios from "axios";
import { EndPoint } from "../apis/EndPoint"; // Ensure EndPoint.UNIVERSITY_ALL is available
import { useAuth } from "../auth/Auth";

const CreateCourseModal = ({ onClose, onSuccess, setCourse, courseToEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    branch: "",
    university: "",
  });
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const isEditMode = Boolean(courseToEdit);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axios.get(EndPoint.UNIVERSITY_ALL);
        setUniversities(res.data);
      } catch (error) {
        console.error("Failed to fetch universities", error);
        toast.error("Could not load universities.");
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (isEditMode && courseToEdit) {
      setFormData({
        name: courseToEdit.name || "",
        code: courseToEdit.code || "",
        description: courseToEdit.description || "",
        branch: courseToEdit.branch || "",
        university:
          courseToEdit.university?._id || courseToEdit.university || "",
      });
    }
  }, [courseToEdit, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await axios.put(
          `${EndPoint.UPDATE_COURSE}/${courseToEdit._id}`,
          formData,
        );
        toast.success("Course Updated Successfully");
      } else {
        const res = await axios.post(EndPoint.CREATE_COURSE, formData);
        setCourse((prev) => [res.data.course, ...prev]);
        toast.success("Course Created Successfully");
      }
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message || "Something Went Wrong!";
      toast.error(errorMessage);
    } finally {
      //   onSuccess();
      onClose();
    }
  };

  return (
    <div className="course-modal-container">
      <div className="course-modal-content">
        <button className="course-close-btn" onClick={onClose}>
          <CloseIcon />
        </button>

        <div className="course-modal-header">
          <div className="course-header-icon">
            <GraduationCapIcon />
          </div>
          <h3>{isEditMode ? "Edit Course Details" : "Create a New Course"}</h3>
          <p>Add a new course to organize your notes and resources.</p>
        </div>

        <form onSubmit={handleSubmit} className="course-create-form">
          <div className="course-form-group">
            <label htmlFor="university">University</label>
            <select
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Select a University --
              </option>
              {universities.map((uni) => (
                <option key={uni._id} value={uni._id}>
                  {uni.name}
                </option>
              ))}
            </select>
          </div>

          <div className="course-form-grid">
            <div className="course-form-group">
              <label htmlFor="name">Course Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Data Structures"
                required
              />
            </div>
            <div className="course-form-group">
              <label htmlFor="code">Course Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., CS201"
                required
              />
            </div>
          </div>
          <div className="course-form-group">
            <label htmlFor="branch">Branch / Department (Optional)</label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
            />
          </div>
          <div className="course-form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Briefly describe this course..."
            ></textarea>
          </div>

          <button type="submit" className="course-submit-btn">
            {isEditMode ? "Save Changes" : "Create Course"}
          </button>
          {/* </div> */}
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateCourseModal;

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
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
const GraduationCapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);
