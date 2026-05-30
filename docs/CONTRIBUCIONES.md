# Contribuciones individuales por rama

Evaluación de aportes de cada integrante según el historial Git del repositorio.

## Resumen de ramas

| Rama | Estado | Integrado en `main` |
|------|--------|---------------------|
| `main` | Rama principal | — |
| `Devfab` | Feature — Landing | ✅ PR #1 (`756b4ce`) |
| `DevRoa` | Feature — Responsive | ✅ PR #2 (`8a69afb`) |

## Fabian Esteban López Arias — rama `Devfab`

**Commits representativos:**
- `[Modify] [FL] Modificacion Landing.`
- `[Modify] [FL] Modificacion Landing2.`

**Contribuciones:**
- Diseño e implementación de la pantalla Landing (video, estilos, botón Enter).
- Estructura inicial del proyecto y README.
- Footer, branding y enlaces a redes sociales.
- Integración visual del tema culinario (colores, tipografía Comic Sans).

## [Integrante DevRoa] — rama `DevRoa`

**Commits representativos:**
- `[Modify] [DR] Se le agrego el responsive al landing.`
- `[Modify] [DR] Se actualizo el responsive.`

**Contribuciones:**
- Media queries y diseño responsive del Landing.
- Optimización de la experiencia en tablet y móvil (ocultar video en pantallas pequeñas).
- Ajustes de layout flex/grid en Home y componentes relacionados.

## Trabajo en `main` (post-merge)

**Commits en main:**
- `mejoras.` — Refactor Redux, cliente API único, validaciones Create, accesibilidad.
- `Migracion a ionic` — Migración a Ionic React + Capacitor.
- `Notificaciones.` — Módulo de notificaciones locales con hooks y pantalla de settings.

**Contribuciones consolidadas:**
- Arquitectura Ionic/Capacitor para Android.
- Servicio de notificaciones con ciclo de vida de la app.
- Corrección de bugs Redux (inmutabilidad, manejo de errores).

## Arquitectura actual (reestructuración)

La estructura `helpers/`, `context/`, `pages/`, `components/`, `hooks/`, `routes/` unifica el código de todas las ramas bajo convenciones React/Ionic production-ready, incluyendo Firebase, chat, mapas y autenticación.

---

> **Nota:** Actualiza los nombres de integrantes en este documento si el equipo incluye más miembros con commits en ramas adicionales.
