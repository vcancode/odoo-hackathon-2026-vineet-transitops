import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no JWT is present, redirect to the login page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
