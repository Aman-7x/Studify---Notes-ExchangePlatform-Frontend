 
import { Document, Page, pdfjs } from "react-pdf";
import { Link, useNavigate } from "react-router-dom";
 
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
function DocumentCard({ doc }) {
  const totalVotes = doc.likesCount + doc.dislikes.length;
  const likePercentage =
    totalVotes > 0 ? Math.round((doc.likesCount / totalVotes) * 100) : 0;


  const ThumbsUpIcon = () => (
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
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
    </svg>
  );

  const navigate = useNavigate();

  return (
    <>
      <div
        className="document-card-new"
        onClick={() => navigate("/document", { state: { pdf: doc } })}
      >
        <div className="card-thumbnail">
          <Document file={doc?.file?.url} loading="" error="">
            <Page
              pageNumber={1}
              width={200}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
        <div className="card-content">
          <h3 className="card-title">{doc.title}</h3>
          <p className="card-branch">
            {doc.branch ? doc?.branch : doc?.description}
          </p>
        </div>
        <div className="card-footer">
          <span className="likes-badge-new">
            <ThumbsUpIcon /> {likePercentage}% (
            {doc.likesCount + doc.dislikes.length})
          </span>
        </div>
      </div>
    </>
  );
}

export default DocumentCard;
