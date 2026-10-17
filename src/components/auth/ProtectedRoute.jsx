 
import { useAuth } from "./Auth";
import { Navigate, useLocation } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();
  // console.log("user : " + user);

  if (loading) {
    return <p>loading...</p>;
  }

  return user ? (
    children
  ) : (
    <Navigate to={`/signin?redirect=${location.pathname}`} />
  );
};

export default ProtectedRoute;
