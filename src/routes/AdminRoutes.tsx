import React from "react";
import AdminDashboard from "../pages/AdminDashboard/Index";
import PrivateRoute from "./PrivateRoute";

export default function AdminRoutes() {
  return (
    <PrivateRoute
      exact
      path="/admin"
      component={AdminDashboard}
      adminOnly
    />
  );
}
