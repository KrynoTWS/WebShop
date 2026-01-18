import { useContext } from "react";
import { Navigate } from "react-router";
import AuthContext from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (!isAdmin()) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
