# Alcance del Sistema — FoodClient

## 1. Descripción general

**FoodClient** es una aplicación híbrida (Ionic + React + Capacitor) para explorar recetas culinarias, crear platos propios, interactuar en tiempo real con otros usuarios y localizar restaurantes en un mapa. Está orientada al proyecto final de la materia *Desarrollo de Software para Plataformas* (UAO).

## 2. Alcance funcional

| Módulo | Descripción |
|--------|-------------|
| **Landing** | Pantalla de bienvenida con video de fondo y acceso a la app |
| **Home / Recetas** | Listado paginado, búsqueda, filtros por dieta y ordenamiento |
| **Detalle de receta** | Información completa de cada plato; guardado de favoritos en Firestore |
| **Creador de recetas** | Formulario validado con envío al backend REST |
| **Autenticación** | Login y registro con Firebase Auth; sesión en Capacitor Preferences |
| **Chat en tiempo real** | Mensajería con Firestore `onSnapshot` |
| **Mapa** | Leaflet + geolocalización + restaurantes sincronizados desde Firestore |
| **Notificaciones locales** | Recordatorios programados con Capacitor Local Notifications |
| **Panel admin** | Ruta protegida `/admin` para usuarios con rol administrador |
| **Sensores** | Geolocalización (`@capacitor/geolocation`) y acelerómetro (`@capacitor/motion`) |

## 3. Arquitectura de carpetas

```
src/
├── helpers/          # Funciones reutilizables (validación, storage, paginación)
├── context/          # AuthContext (estado global de sesión)
├── pages/            # Una carpeta por pantalla: Index.jsx + Index.module.scss
├── components/       # Subcarpetas (Card, NavBar, Shared/…)
├── hooks/            # useAuth, useChat, useGeolocation, useMotion, useOptimizedList…
├── routes/           # AppRoutes, UserRoutes, AdminRoutes, PrivateRoute
├── config/           # firebase.ts
├── services/         # api.js, firebase/, notificationService.ts
└── redux/            # Estado de recetas (Thunk + reducer inmutable)
```

## 4. Tecnologías utilizadas

| Capa | Tecnología |
|------|------------|
| UI móvil | Ionic React 8, Ionicons |
| Framework | React 18 (hooks, context, StrictMode) |
| Build | Vite 5 |
| Navegación | React Router 5 + IonReactRouter |
| Estado local/API | Redux + Redux Thunk |
| HTTP | Axios → backend Node (`apifood-pi.onrender.com`) |
| Base de datos | Firebase Firestore (CRUD, transacciones, tiempo real) |
| Autenticación | Firebase Auth + Capacitor Preferences |
| Tiempo real | Firestore `onSnapshot` (chat, restaurantes) |
| Mapas | Leaflet + react-leaflet + OpenStreetMap |
| Sensores | Capacitor Geolocation, Capacitor Motion |
| Notificaciones | Capacitor Local Notifications |
| Estilos | SCSS Modules (`.module.scss`) |
| Nativo | Capacitor 8 (Android) |

## 5. Integraciones externas

- **Backend REST**: `GET/POST /recipes`, `/recipe`, `/diets` — ver README.
- **Firebase**: Auth, Firestore (colecciones `chatMessages`, `favorites`, `restaurants`).
- **OpenStreetMap**: tiles para el mapa interactivo.

## 6. Optimización de memoria

- Paginación con `useOptimizedList` (`useMemo` sobre slices).
- Limpieza de suscripciones Firestore y sensores en `useEffect` cleanup.
- Despacho `resetDetail` al desmontar pantalla de detalle.
- Redux con actualizaciones inmutables (`[...state.recipes].sort()`).

## 7. Seguridad

- Tokens JWT de Firebase almacenados con `@capacitor/preferences` (no localStorage plano).
- Rutas privadas (`/chat`, `/map`, `/admin`) con `PrivateRoute`.
- Variables sensibles solo en `.env` (nunca commiteadas).

## 8. Requisitos de despliegue

1. Copiar `.env.example` → `.env` y completar credenciales Firebase.
2. `npm install && npm run dev` (web) o `npm run cap:sync` (Android).
3. Habilitar Authentication (email/password) y Firestore en consola Firebase.

## 9. Estado de ramas Git

Las ramas `Devfab` y `DevRoa` fueron integradas en `main` mediante pull requests (#1 y #2). Ver `docs/CONTRIBUCIONES.md`.
