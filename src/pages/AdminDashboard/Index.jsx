import React, { useEffect, useState } from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAuth } from "../../hooks/useAuth";
import { getFavoritesByUser } from "../../services/firebase/firestoreService";
import s from "./Index.module.scss";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ favorites: 0 });

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const favs = await getFavoritesByUser(user.uid);
      setStats({ favorites: favs.length });
    })();
  }, [user]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Panel administrador</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className={s.page}>
          <div className={s.card}>
            <h2>Bienvenido, {user?.displayName || user?.email}</h2>
            <p>Rol: administrador</p>
          </div>
          <div className={s.card}>
            <p>Favoritos sincronizados (Firestore)</p>
            <p className={s.stat}>{stats.favorites}</p>
          </div>
          <div className={s.card}>
            <p>
              Desde aquí se gestionan métricas y sincronización. Configura el
              correo admin con VITE_ADMIN_EMAIL en .env.
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
