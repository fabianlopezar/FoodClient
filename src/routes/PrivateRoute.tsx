import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Shared/Loading/Index";

type PrivateRouteProps = {
  component: React.ComponentType;
  exact?: boolean;
  path: string;
  adminOnly?: boolean;
};

export default function PrivateRoute({
  component: Component,
  adminOnly = false,
  ...rest
}: PrivateRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Route
        {...rest}
        render={() => (
          <div style={{ padding: "2rem" }}>
            <Loading />
          </div>
        )}
      />
    );
  }

  if (!user) {
    return (
      <Route
        {...rest}
        render={() => <Redirect to="/login" />}
      />
    );
  }

  if (adminOnly && user.role !== "admin") {
    return (
      <Route
        {...rest}
        render={() => <Redirect to="/home" />}
      />
    );
  }

  return <Route {...rest} render={() => <Component />} />;
}
