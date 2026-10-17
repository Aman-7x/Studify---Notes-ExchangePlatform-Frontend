import { lazy, Suspense } from "react";
import Home from "./components/home/Home";
import "./App.css";
import { Route,  Routes } from "react-router-dom";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import CoursePage from "./components/course/CoursePage";
const PdfReader = lazy(()=>import("./components/documentSection/PdfReader"));
const StudyListPage = lazy(()=>import("./components/studylist/StudyListPage")) ;
const TodoListPage = lazy(()=>import("./components/todo/TodoListPage"));
const AskAiPage = lazy(()=>import("./components/askAI/AskAIPage"));
import ProtectedRoute from "./components/auth/ProtectedRoute";
const  ProfilePage = lazy(()=>import("./components/profile/ProfilePage"));
const SettingsPage = lazy(()=>import( "./components/settings/SettingsPage"));
const UploadNotesPage = lazy(()=>import( "./components/documentSection/UploadNotesPage"));
const MyLibraryPage = lazy(()=>import("./components/myLibrary/MyLibraryPage"));
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
