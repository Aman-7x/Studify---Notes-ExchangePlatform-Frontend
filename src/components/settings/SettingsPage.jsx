import { useState } from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Footer from "../footer/Footer";
import Settings from "./Settings";

function SettingsPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <Header />
      <div
        className={`home-container ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />

        <div className="main-content-area">
          <Settings />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default SettingsPage;
