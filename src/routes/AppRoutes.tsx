import React from "react";
import { IonRouterOutlet } from "@ionic/react";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";

export default function AppRoutes() {
  return (
    <IonRouterOutlet>
      <UserRoutes />
      <AdminRoutes />
    </IonRouterOutlet>
  );
}
