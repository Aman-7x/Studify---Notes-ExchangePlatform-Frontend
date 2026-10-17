import { useState, useEffect } from "react";
import "./UploadNotes.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { EndPoint } from "../apis/EndPoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadNotes = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    universityId: "",
    courseId: "",
    branch: "",
    year: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        const universityResponse = await axios.get(EndPoint.UNIVERSITY_ALL);
        setUniversities(universityResponse.data);
      } catch (error) {
        toast.error("Failed to fetch universities. Please try again.");
        console.error("Fetch universities error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  useEffect(() => {
    const fetchCoursesByUniversity = async () => {
      if (!formData.universityId) {
        setCourses([]);
        return;
      }

      setIsLoadingCourses(true);
      try {
        const courseResponse = await axios.get(
          `${EndPoint.COURSE_BY_UNIVERSITY}/${formData.universityId}`,
        );
        setCourses(courseResponse.data);
      } catch (error) {
        toast.error("Failed to fetch courses for the selected university.");
        console.error("Fetch courses error:", error);
        setCourses([]);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCoursesByUniversity();
  }, [formData.universityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append("noteFile", selectedFile);
    Object.keys(formData).forEach((key) => {
      uploadData.append(key, formData[key]);
    });
    try {
      // console.log(uploadData);

      const res = await axios.post(EndPoint.UPLOAD_NOTE, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Notes Uploaded");
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="cap-spinner-container">
          <div className="cap-spinner">
            <div className="cap-top"></div>
            <div className="cap-base"></div>
            <div className="tassel"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page-container">
      <div className="upload-form-wrapper custom-scrollbar">
        <button
          onClick={handleGoBack}
          className="back-btn"
          aria-label="Go back"
        >
          <ArrowLeftIcon />
        </button>
        <div className="form-header">
          <h1>Upload a New Note</h1>
          <p>Share your knowledge and help your classmates succeed.</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Your Document</label>
            <div className="file-dropzone">
              <UploadCloudIcon />
              <input
                type="file"
                name="noteFile"
                onChange={handleFileChange}
                required
              />
              {selectedFile ? (
                <p>
                  Selected file: <strong>{selectedFile.name}</strong>
                </p>
              ) : (
                <p>
                  <strong>Click to upload</strong> or drag and drop your file
                  here
                </p>
              )}
              <span className="file-types">
                PDF, DOCX, PPT, TXT (MAX. 10MB)
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Introduction to Algorithms - Chapter 1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Briefly describe what this note is about..."
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="universityId">University</label>
            <select
              id="universityId"
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select your university
              </option>
              {universities.map((uni) => (
                <option key={uni._id} value={uni._id}>
                  {uni.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="courseId">Course</label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              disabled={!formData.universityId || isLoadingCourses}
              required
            >
              <option value="" disabled>
                Select the course
              </option>
              {isLoadingCourses ? (
                <option>Loading courses...</option>
              ) : (
                courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="branch">Branch (Optional)</label>
              <input
                type="text"
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="form-group">
              <label htmlFor="year">Year (Optional)</label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g., 2nd Year"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Upload Note
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default UploadNotes;

const UploadCloudIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
    <path d="M12 12v9"></path>
    <path d="m16 16-4-4-4 4"></path>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
