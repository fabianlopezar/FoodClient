import React, { useMemo } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useMotion } from "../../hooks/useMotion";
import { useRestaurants } from "../../hooks/useRestaurants";
import { formatCoordinates } from "../../helpers/formatters";
import s from "./Index.module.scss";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  iconShadow: markerShadow,
});

const DEFAULT_CENTER = [3.4516, -76.532];

export default function MapPage() {
  const { position, error, loading, refresh } = useGeolocation();
  const { acceleration, available } = useMotion();
  const { restaurants } = useRestaurants();

  const center = useMemo(() => {
    if (position) return [position.lat, position.lng];
    return DEFAULT_CENTER;
  }, [position]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Mapa y sensores</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className={s.page}>
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom
            className={s.map}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {position && (
              <>
                <Marker position={center}>
                  <Popup>Tu ubicación actual</Popup>
                </Marker>
                <Circle
                  center={center}
                  radius={position.accuracy ?? 80}
                  pathOptions={{ color: "#3b7302" }}
                />
              </>
            )}
            {restaurants.map((r) => (
              <Marker key={r.id} position={[r.lat, r.lng]}>
                <Popup>
                  <strong>{r.name}</strong>
                  <br />
                  {r.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <div className={s.panel}>
            <p>
              <strong>Geolocalización:</strong>{" "}
              {loading
                ? "Obteniendo…"
                : error
                  ? error
                  : formatCoordinates(position?.lat, position?.lng)}
            </p>
            <IonButton size="small" onClick={() => refresh()}>
              Actualizar ubicación
            </IonButton>
            <div className={s.sensor}>
              <strong>Acelerómetro (Capacitor Motion):</strong>{" "}
              {available && acceleration
                ? `x=${acceleration.x?.toFixed(2)} y=${acceleration.y?.toFixed(2)} z=${acceleration.z?.toFixed(2)}`
                : "No disponible en este entorno"}
            </div>
            <p>
              Restaurantes en tiempo real desde Firestore (o datos demo si Firebase
              no está configurado).
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
