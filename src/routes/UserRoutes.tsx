import React from "react";
import { Route } from "react-router-dom";
import Landing from "../pages/Landing/Index";
import Home from "../pages/Home/Index";
import RecipeDetails from "../pages/RecipeDetails/Index";
import CreateRecipe from "../pages/CreateRecipe/Index";
import Login from "../pages/Login/Index";
import Register from "../pages/Register/Index";
import Chat from "../pages/Chat/Index";
import Map from "../pages/Map/Index";
import NotificationSettings from "../pages/NotificationSettings/Index";
import PrivateRoute from "./PrivateRoute";

export default function UserRoutes() {
  return (
    <>
      <Route exact path="/" component={Landing} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/recipes/:id" component={RecipeDetails} />
      <Route exact path="/recipe" component={CreateRecipe} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <PrivateRoute exact path="/chat" component={Chat} />
      <PrivateRoute exact path="/map" component={Map} />
      <Route
        exact
        path="/notifications/settings"
        component={NotificationSettings}
      />
    </>
  );
}
