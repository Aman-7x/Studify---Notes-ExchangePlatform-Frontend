import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL|| "http://localhost:5000/api";

// Apply globally to every single axios request
axios.defaults.withCredentials = true;

export const EndPoint = {
  USER: BASE_URL + "/users",
  VERIFY_USER: BASE_URL + "/users/verify",
  SIGN_IN: BASE_URL + "/users/signin",
  GET_USER_Data: BASE_URL + "/users/mylibrary",
  GET_USER: BASE_URL + "/users/profile",
  UPDATE_USER: BASE_URL + "/users/profile",
  DELETE_USER: BASE_URL + "/users/profile",
  UPLOAD_USER_PROFILE: BASE_URL + "/users/profile/upload-pic",
  SIGN_UP: BASE_URL + "/users/signup",
  All_COURSES: BASE_URL + "/courses",
  TOP_COURSES: BASE_URL + "/courses/top",
  CREATE_COURSE: BASE_URL + "/courses",
  COURSE_BY_ID: BASE_URL + "/courses",
  FOLLOW_COURSE: BASE_URL + "/courses",
  UPDATE_COURSE: BASE_URL + "/courses",
  UNFOLLOW_COURSE: BASE_URL + "/courses",
  COURSE_BY_UNIVERSITY: BASE_URL + "/courses/university",
  All_NOTES: BASE_URL + "/notes",
  TOP_NOTES: BASE_URL + "/notes/top",
  NOTES_BY_ID: BASE_URL + "/notes",
  LIKE_NOTE: BASE_URL + "/notes",
  UPLOAD_NOTE: BASE_URL + "/notes/upload",
  DELETE_NOTE: BASE_URL + "/notes",
  FILTER_NOTES_BY_SEARCH: BASE_URL + "/notes/course", //http://localhost:5000/api/notes/course/687ff450e1164e029faa9cdd/?search=mach
  UNIVERSITY_ALL: BASE_URL + "/universities",
  CREATE_STUDYLIST: BASE_URL + "/study-lists",
  UPDATE_STUDYLIST: BASE_URL + "/study-lists",
  SEARCH_STUDYLIST: BASE_URL + "/study-lists",
  PUBLIC_STUDYLIST: BASE_URL + "/study-lists/public",
  DELETE_STUDYLIST: BASE_URL + "/study-lists",
  STUDYLIST_BY_ID: BASE_URL + "/study-lists",
  My_STUDYLIST: BASE_URL + "/study-lists/me",
  MY_TODO: BASE_URL + "/todos/me",
  CREATE_TODO: BASE_URL + "/todos",
  UPDATE_TODO: BASE_URL + "/todos",
  DELETE_TODO: BASE_URL + "/todos",
  GEN_AI: BASE_URL + "/genai/sent-message",
  BACKEND_URL: "http://localhost:5000",
};
