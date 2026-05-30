# FoodClient — Proyecto Final UAO

![Captura del proyecto](https://portafolio-fabianlopezar.vercel.app/static/media/PI-Food.d2fb705a4047a5aebc0d.png)

Aplicación híbrida **Ionic + React + Capacitor** para explorar recetas, crear platos, chatear en tiempo real y ver restaurantes en mapa.

---

## Integrantes del equipo

| Nombre | Rol / Rama | Contacto |
|--------|------------|----------|
| Fabian Esteban López Arias | Landing, estructura base (`Devfab`) | fabianlopez928@gmail.com |

Ver detalle de contribuciones en [docs/CONTRIBUCIONES.md](docs/CONTRIBUCIONES.md).

---

## Enlaces al prototipo

| Recurso | URL |
|---------|-----|
| Repositorio GitHub | https://github.com/fabianlopezar/FoodClient |
                      https://github.com/fabianlopezar/ApiFood-Pi
| Demo / Portafolio | https://portafolio-fabianlopezar.vercel.app |
| Prototipo visual (captura) | [Imagen PI-Food](https://portafolio-fabianlopezar.vercel.app/static/media/PI-Food.d2fb705a4047a5aebc0d.png) |

---

## APIs de backend consumidas

### REST — API Food PI (Node.js / Render)

Base URL por defecto: `https://apifood-pi.onrender.com`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/recipes` | Lista todas las recetas |
| `GET` | `/recipes?name={nombre}` | Búsqueda por título |
| `GET` | `/recipes/:id` | Detalle de una receta |
| `GET` | `/diets` | Tipos de dieta disponibles |
| `POST` | `/recipe` | Crear receta nueva |

Configura otra URL con `VITE_API_URL` en `.env`.

### Firebase

| Servicio | Uso |
|----------|-----|
| **Authentication** | Login / registro (email + contraseña) |
| **Firestore** | Chat en tiempo real, favoritos, restaurantes en mapa |
| **Transacciones** | `runTransaction` al guardar favoritos |

Variables: ver [.env.example](.env.example).

### OpenStreetMap

Tiles del mapa: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

---

## Estructura del proyecto

```
src/
├── helpers/       # Utilidades reutilizables
├── context/       # AuthContext
├── pages/         # Landing, Home, Login, Chat, Map…
├── components/    # Card, NavBar, Shared/Footer…
├── hooks/         # useAuth, useChat, useGeolocation…
├── routes/        # AppRoutes, UserRoutes, AdminRoutes
├── config/        # Firebase
└── services/      # API REST, Firebase, notificaciones
```

Documentación completa del alcance: [docs/ALCANCE_SISTEMA.md](docs/ALCANCE_SISTEMA.md).

---

## Tecnologías

- Ionic React 8 · React 18 · Vite · Capacitor 8
- Redux + Thunk · Axios
- Firebase (Auth + Firestore)
- Leaflet · Capacitor Geolocation · Capacitor Motion
- SCSS Modules

---

## Instalación

```bash
git clone https://github.com/fabianlopezar/FoodClient.git
cd FoodClient
npm install
cp .env.example .env
npm run dev
```

### Android

```bash
npm run cap:sync
```

---

## Scripts

| Comando | Acción |
|---------|--------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run cap:sync` | Build + sincronizar Capacitor |

---

## Ramas Git

Todas las ramas de feature (`Devfab`, `DevRoa`) están **mezcladas en `main`**.
