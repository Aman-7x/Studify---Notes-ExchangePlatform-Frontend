import { useEffect, useState } from "react";
import DocumentCard from "./DocumentCard";
import axios from "axios";
import { EndPoint } from "../apis/EndPoint";

function TopDocument({ documents }) {
  const [allNotes, setAllNotes] = useState([]);

  const loadNotes = async () => {
    const response = await axios.get(EndPoint.TOP_NOTES);
    // console.log(response.data);
    setAllNotes(response.data);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const ArrowButton = ({ direction = "left" }) => {
    if (!documents || documents.length === 0) {
      return null;
    }
    const isLeft = direction === "left";
    return (
      <button className="arrow-btn">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={isLeft ? "M15 18L9 12L15 6" : "M9 18L15 12L9 6"}
            stroke="#5f6368"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  return (
    <>
      <section className="top-documents-section">
        <div className="section-header">
          <h2>Top documents for you</h2>
          <div className="nav-arrows">
            <ArrowButton direction="left" />
            <ArrowButton direction="right" />
          </div>
        </div>
        <div className="documents-container">
          {(documents ? documents : allNotes).slice(0, 6).map((doc, index) => {
            return <DocumentCard key={doc._id ?? index} doc={doc} />;
          })}
        </div>
      </section>
    </>
  );
}

export default TopDocument;
