import { useState } from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Footer from "../footer/Footer";

import UploadNotes from "./UploadNotes";

function UploadNotesPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <Header />
      <div
        className={`home-container ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />

        <div className="main-content-area">
          <UploadNotes />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default UploadNotesPage;
