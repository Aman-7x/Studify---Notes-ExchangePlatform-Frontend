import { lazy, Suspense } from "react";
import Home from "./components/home/Home";
import "./App.css";
import { Route,  Routes } from "react-router-dom";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import CoursePage from "./components/course/CoursePage";
const PdfReader = lazy(()=>import("./components/documentSection/PdfReader"));
import StudyListPage from "./components/studylist/StudyListPage" ;
import TodoListPage from "./components/todo/TodoListPage" ;
import AskAiPage from "./components/askAI/AskAIPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import  ProfilePage from "./components/profile/ProfilePage";
import SettingsPage from "./components/settings/SettingsPage";
import UploadNotesPage from "./components/documentSection/UploadNotesPage";
import MyLibraryPage from "./components/myLibrary/MyLibraryPage";
import CreateCourseModal from "./components/course/CreateCourse";
import ViewStudyList from "./components/studylist/ViewStudyList";
import LandingPage from "./components/studyy/landing";
import PlansSection from "./components/studyy/PlansSection";
import AboutSection from "./components/studyy/AboutSection";
import ContactSection from "./components/studyy/ContactSection";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/mylibrary" element={<MyLibraryPage />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute>
              <CoursePage />
            </ProtectedRoute>
          }
        />
        <Route path="/document" element={<PdfReader />} />

        <Route
          path="/studylist"
          element={
            <ProtectedRoute>
              <StudyListPage />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/todo"
          element={
            <ProtectedRoute>
              {" "}
              <TodoListPage />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/askai"
          element={
            <ProtectedRoute>
              {" "}
              <AskAiPage />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/myprofile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadnotes"
          element={
            <ProtectedRoute>
              <UploadNotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewstudylist/:id"
          element={
            <ProtectedRoute>
              <ViewStudyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recent"
          element={
            <ProtectedRoute>
              <CreateCourseModal />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LandingPage />} />
        <Route path="/plans" element={<PlansSection />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/contact" element={<ContactSection />} />
      </Routes>
    </>
  );
}

export default App;
