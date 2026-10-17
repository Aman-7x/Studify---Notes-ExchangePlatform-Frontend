
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PdfReader.css";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
// Styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import { EndPoint } from "../apis/EndPoint";
import { toast } from "react-toastify";
import SaveToStudylistModal from "../studylist/SaveToStudylistModal";
import LimitExceededModal from "./LimitExceededModal";
import { useAuth } from "../auth/Auth";

const Icon = ({ name, size = 16 }) => {
  const icons = {
    course: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="coursesGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#a881f5", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#7a3ff1", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter
            id="coursesShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#7a3ff1"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#coursesShadow)" }}>
          <path
            d="M20 6h-8l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"
            fill="url(#coursesGradient)"
          />
          <path
            d="M20 6h-8l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"
            fill="white"
            fillOpacity="0.1"
          />
        </g>
      </svg>
    ),
    document: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="notesGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#4fd1c5", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#38b2ac", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="notesShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#38b2ac"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#notesShadow)" }}>
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
            fill="url(#notesGradient)"
          />
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
            fill="white"
            fillOpacity="0.1"
          />
          <path d="M14 2v6h6l-6-6z" fill="white" fillOpacity="0.25" />
        </g>
      </svg>
    ),
    university: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: "#4B5563" }}
      >
        <path d="M3,22V8l9-5,9,5v14H3Zm2-2h2V12H5v8Zm4,0h2V12H9v8Zm4,0h2V12h-2v8Zm4,0h2V12h-2v8Z" />
      </svg>
    ),
    student: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
    calendar: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
      </svg>
    ),
    download: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    ),
    ai: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#4dd0e1", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#00acc1", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="aiShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0.5"
              dy="1"
              stdDeviation="1"
              floodColor="#00acc1"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        <g style={{ filter: "url(#aiShadow)" }}>
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            fill="url(#aiGradient)"
          />
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            fill="white"
            fillOpacity="0.1"
          />
        </g>
      </svg>
    ),
    chevronDown: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    ),
    thumbUp: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
      </svg>
    ),
    thumbDown: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm-3-13H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"></path>
      </svg>
    ),
    save: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    upload: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
    ),
    more: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="12" cy="12" r="1.5"></circle>
        <circle cx="19" cy="12" r="1.5"></circle>
        <circle cx="5" cy="12" r="1.5"></circle>
      </svg>
    ),
    arrowUp: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    ),
    arrowDown: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
    ),
    zoomIn: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="11" y1="8" x2="11" y2="14"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
      </svg>
    ),
    zoomOut: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
      </svg>
    ),
    fullscreen: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
      </svg>
    ),
  };
  return <span className="icon">{icons[name]}</span>;
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

export default function PdfReader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { pdf } = location.state || {};
  const [showLimitModal, setShowLimitModal] = useState(false);
  //  console.log(pdf);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [noteData, setNoteData] = useState([]);

  useEffect(() => {
    const fetchDetailsAndStatus = async () => {
      if (!pdf?._id) return;
      try {
        const noteRes = await axios.get(`${EndPoint.NOTES_BY_ID}/${pdf._id}`);
        // console.log(noteRes);

        setNoteData(noteRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDetailsAndStatus();
  }, [pdf]);

  const handleOpenSaveModal = () => {
    if (!user) {
      navigate("/signin");
      return;
    }
    setShowSaveModal(true);
  };

  const handleUnsaveNote = async (noteId) => {
    if (!noteId) return;
    try {
      await axios.delete(
        `${EndPoint.CREATE_STUDYLIST}/unsave-note/${noteId}`,
      );
      setIsSaved(false);
      toast.info("Note unsaved from all studylists.");
    } catch (err) {
      toast.error("Failed to unsave note.");
    }
  };

  const handleSaveSuccess = () => {
    setIsSaved(false);
    setShowSaveModal(false);
  };
  // console.log(pdf?.file?.url);

  const pdfUrl = pdf?.file?.url;

  // like notes
  const handleLikeNote = async (noteId) => {
    // console.log(noteId);
    if (!user || !noteId) {
      return;
    }
    try {
      const res = await axios.post(
        `${EndPoint.LIKE_NOTE}/${noteId}/like`,
        {},
        {
          params: { noteId: noteId },
        },
      );

      // console.log(res.data);
      setNoteData((prevNoteData) => ({
        ...prevNoteData,
        likes: res.data.note.likes,
        dislikes: res.data.note.dislikes,
      }));
    } catch (err) {
      console.error(err);
    }
  };
  // dislike notes
  const handleDislikeNote = async (noteId) => {
    // console.log(noteId);
    if (!user || !noteId) {
      return;
    }
    try {
      const res = await axios.post(
        `${EndPoint.LIKE_NOTE}/${noteId}/dislike`,
        {},
        {
          params: { noteId: noteId },
        },
      );

      // console.log(res.data);
      setNoteData((prevNoteData) => ({
        ...prevNoteData,
        likes: res.data.note.likes,
        dislikes: res.data.note.dislikes,
      }));
    } catch (err) {
      console.error(err);
    }
  };
  // download notes
  const handleDownloadNote = async (noteId) => {
    // console.log(noteId);
    if (!user || !noteId) {
      navigate("/signin");
      return;
    }
    try {
      const res = await axios.get(`${EndPoint.LIKE_NOTE}/${noteId}/download`, {
        responseType: "blob",
      });

      const fileURL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `note-${noteId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      // setNoteData(res.data.note);
    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 403) {
        const errText = await error.response.data.text();
        console.log(errText);

        try {
          const errJson = JSON.parse(errText);
          if (errJson.code === "LIMIT_EXCEEDED") {
            setShowLimitModal(true);
          }
        } catch (e) {
          toast.error("An unknown error occurred.");
        }
      } else {
        console.error("Download error:", error);
        toast.error("File could not be downloaded.");
      }
    }
  };

  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoom = (direction) => {
    setZoomLevel((prev) => {
      if (direction === "in") return Math.min(prev + 0.1, 2);
      if (direction === "out") return Math.max(prev - 0.1, 0.5);
      return 1;
    });
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const pageNavigationPluginInstance = pageNavigationPlugin();
  // console.log(noteData?.uploadedBy?.firstName);

  const { CurrentPageLabel, NumberOfPages } = pageNavigationPluginInstance;
  return (
    <>
      <div className="pdf-reader-container">
        <header className="document-header">
          <h1>{noteData?.title}</h1>
          <p>{noteData?.description}</p>
        </header>

        <div className="info-bar">
          <button onClick={() => navigate(-1)} className="piche">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
          <div className="info-bar-left">
            <div className="info-item">
              <Icon name="course" size={20} />
              <span>Course: {noteData?.course?.name} </span>
            </div>
            <div className="info-item">
              <Icon name="document" size={20} />
              <span>
                <NumberOfPages /> Pages
              </span>
            </div>
            <div className="info-item">
              <Icon name="university" size={20} />
              <span>University: {noteData?.university?.name} </span>
            </div>
          </div>
          <div className="info-bar-right">
            <div className="info-item">
              <div className="student-avatar"></div>
              <span>
                {noteData?.uploadedBy?.firstName
                  ? noteData?.uploadedBy?.firstName
                  : ""}{" "}
                {noteData?.uploadedBy?.lastName
                  ? noteData?.uploadedBy?.lastName
                  : ""}
              </span>
            </div>
            <div className="info-item">
              <Icon name="calendar" size={18} />
              <span>{formatDate(noteData?.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="info-bar">
          <div className="info-bar-left">
            <button
              className="btn-d btn-download"
              onClick={() => handleDownloadNote(noteData._id)}
            >
              <Icon name="download" size={16} /> Download
            </button>
            <button className="btn" onClick={() => navigate("/askai")}>
              <Icon name="ai" size={16} />
              Ask AI
            </button>
          </div>
          <div className="info-bar-right">
            <button
              className="btn-action"
              onClick={() => handleLikeNote(pdf?._id)}
            >
              <Icon name="thumbUp" size={18} />
              {noteData?.likes?.length}
            </button>
            <button
              className="btn-action"
              onClick={() => handleDislikeNote(pdf?._id)}
            >
              <Icon name="thumbDown" size={18} />
              {noteData?.dislikes?.length}
            </button>
            <button
              className="btn-action"
              onClick={() =>
                isSaved ? handleUnsaveNote(noteData._id) : handleOpenSaveModal()
              }
            >
              <Icon name={isSaved ? "saveIconFilled" : "save"} size={18} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button className="btn-action">
              <Icon name="download" size={18} />({noteData?.downloadCount})
            </button>
          </div>
        </div>

        <main className="content-area">
          <div className="pdf-view-wrapper">
            <div
              className="pdf-view"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* {samplePdf.find(p => p.page === currentPage).content} */}
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={pdfUrl}
                  plugins={[pageNavigationPluginInstance]}
                />
              </Worker>
            </div>
          </div>
        </main>

        <div className="floating-controls">
          <div className="page-indicator">
            <CurrentPageLabel /> out of <NumberOfPages />
          </div>
          <div className="control-divider"></div>
          <button className="control-btn" onClick={() => handleZoom("out")}>
            <Icon name="zoomOut" size={18} />
          </button>
          <button className="control-btn" onClick={() => handleZoom("in")}>
            <Icon name="zoomIn" size={18} />
          </button>
          <button className="control-btn" onClick={handleFullscreen}>
            <Icon name="fullscreen" size={18} />
          </button>
          <div className="control-divider"></div>
          <button
            className="btn-d btn-download"
            onClick={() => handleDownloadNote(noteData._id)}
            style={{ padding: "0.4rem 0.8rem" }}
          >
            <Icon name="download" size={14} /> Download
          </button>
        </div>
      </div>

      {showLimitModal && (
        <LimitExceededModal onClose={() => setShowLimitModal(false)} />
      )}

      {showSaveModal && (
        <SaveToStudylistModal
          noteToSave={noteData}
          onClose={() => setShowSaveModal(false)}
          onSuccess={handleSaveSuccess}
        />
      )}
    </>
  );
}
