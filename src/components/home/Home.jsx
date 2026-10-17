import { useEffect, useState } from "react";
import TrendingCourses from "../course/trendingCourse/TrendCourse";
import TopDocument from "../documentSection/TopDocument";
import Header from "../header/Header";
import WelcomeSection from "../header/WelcomeSection";
import Search from "../search/Search";
import Sidebar from "../sidebar/Sidebar";
import TopCourses from "../course/TopCourses";
import Footer from "../footer/Footer";
import NewestStudyLists from "../studylist/NewStudyList";
import axios from "axios";
import { EndPoint } from "../apis/EndPoint";
import { useLocation } from "react-router-dom";
function Home() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };
  const location = useLocation();
  const initialQuery = new URLSearchParams(location.search).get("q") || "";
 
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState({
    documents: [],
    courses: [],
    studyLists: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults({ documents: [], courses: [], studyLists: [] });
      return;
    }

    const debounceTimer = setTimeout(() => {
      const fetchAllSearchResults = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const [docRes, courseRes, listRes] = await Promise.all([
            axios.get(`${EndPoint.All_NOTES}`, {
              params: { search: searchQuery },
            }),
            axios.get(`${EndPoint.All_COURSES}`, {
              params: { search: searchQuery },
            }),
            axios.get(`${EndPoint.CREATE_STUDYLIST}`, {
              params: { search: searchQuery },
            }),
          ]);
           
          setResults({
            documents: docRes.data,
            courses: courseRes.data,
            studyLists: listRes.data,
          });
        } catch (err) {
          console.error("Error fetching search results:", err);
          setError("Failed to fetch results. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllSearchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const hasResults =
    results.documents.length > 0 ||
    results.courses.length > 0 ||
    results.studyLists.length > 0;

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
        <main className="main-content-area">
          <Search value={searchQuery} onChange={setSearchQuery} />

          {searchQuery.trim() === "" ? (
            <>
              <WelcomeSection />
              <TopDocument />
              <TrendingCourses />
              <TopCourses />
              <NewestStudyLists />
            </>
          ) : isLoading ? (
            <p>Searching...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : hasResults ? (
            <>
              <h2>Search Results</h2>
              <TopDocument documents={results.documents} />
              <TopCourses courses={results.courses} />
              <NewestStudyLists searchlists={results.studyLists} />
            </>
          ) : (
            <p>No results found for "{searchQuery}"</p>
          )}

          <Footer />
        </main>
      </div>
    </>
  );
}
export default Home;
