# Informe de análisis y mejoras – FoodClient

## 1. Problemas detectados y soluciones aplicadas

### Críticos (bugs)

| Problema | Ubicación | Solución |
|----------|-----------|----------|
| **`reportWebVitals()` sin importar** | `main.jsx` | Eliminada la llamada (en Vite no existe por defecto). Entrada actualizada a `ReactDOM.createRoot` (React 18). |
| **Mutación de estado en Redux** | `reducer.js` | `state.recipes.sort()` mutaba el array. Redux exige inmutabilidad. Se reemplazó por `[...state.recipes].sort()` y funciones de comparación reutilizables. |
| **Errores no manejados en actions** | `actions.js` | `getTitle`, `getRecipesId`, `getTypeDiet` no hacían `dispatch` en `catch`, dejando la UI colgada. Ahora despachan estado vacío o `RESET_DETAIL` en error. |
| **Typo en Footer** | `Footer.jsx` | `<ui>` corregido a `<ul>`. |
| **Typo en validación Create** | `Create.jsx` | `errors.sumary` corregido a `errors.summary` y validación unificada. |
| **Submit sin esperar API** | `Create.jsx` | El éxito se mostraba antes de que terminara `postRecipes`. Ahora se usa `await dispatch(postRecipes(input))` y mensajes según resultado. |
| **Dependencias de `useEffect`** | `Details.jsx` | Faltaban `id` y `dispatch` en el array de dependencias; al cambiar de receta no se volvía a cargar. Corregido a `[id, dispatch]`. |

### Código duplicado y configuración

| Problema | Solución |
|----------|----------|
| **`axios.defaults.baseURL` en `App.jsx` y `main.jsx`** | Creado `src/services/api.js`: un solo cliente axios con `baseURL` (y opcional `VITE_API_URL`). Eliminado axios de `App.jsx` y `main.jsx`. |
| **Tipos de acciones repetidos en `actions.js` y `reducer.js`** | Creado `src/redux/constants.js` e importado en ambos. Menos typos y refactor más seguro. |

### Buenas prácticas y accesibilidad

| Problema | Solución |
|----------|----------|
| **SearchBar: input no controlado y sin `<form>`** | Input con `value={title}` y formulario que hace submit con Enter; `aria-label` en el input. |
| **Paginado con `<a href="nada">`** | Sustituido por `<button type="button">` para evitar navegación incorrecta y mejor semántica. |
| **Filtro por dieta: variable sombreada** | En el reducer, `el.TypeDiet?.find(el=>...)` sombreaba `el`. Reemplazado por `.some((d) => d.name === action.payload)`. |
| **Details: listas sin `key`** | Añadidos `key` en el map de instrucciones para evitar warnings de React. |
| **Create: validación y flujo** | Validación centralizada en `validateForm`, resumen obligatorio, botón deshabilitado cuando hay errores, submit async con feedback correcto. |

### Reducer

- **GET_ID**: el backend puede devolver objeto o array. Se normaliza a array (`details`) para que el componente pueda usar `myRecipe[0]` siempre.
- Eliminados `console.log` del reducer y de las actions.

---

## 2. Código refactorizado relevante

### `src/services/api.js` (nuevo)

- Cliente axios único con `baseURL` y soporte para `VITE_API_URL` en producción.

### `src/redux/constants.js` (nuevo)

- Todos los action types en un solo archivo para evitar strings mágicos.

### `src/redux/reducer.js`

- Uso de constantes importadas.
- Ordenamientos inmutables: `[...state.recipes].sort(...)` y helpers `compareByTitle` y `compareByHealthScore`.
- `FILTER_DIET` con `.some()` sin sombrear variables.
- `GET_ID` normalizando `details` a array.

### `src/redux/actions.js`

- Uso de `api` (servicio) en lugar de `axios` global.
- Uso de constantes.
- En `catch` se despacha estado coherente (listas vacías o `RESET_DETAIL`).
- `getTitle`: `encodeURIComponent(name.trim())` para evitar problemas con caracteres especiales en la query.

### `src/main.jsx`

- Eliminado `reportWebVitals()` y configuración duplicada de axios.
- Uso de `createRoot` (React 18).

### `src/App.jsx`

- Eliminada configuración de axios (queda en `api.js`).

### `src/components/Create.jsx`

- Validación en `validateForm` (título, resumen, healthScore 0–100).
- Handlers con `useCallback` donde aporta.
- Submit async con `await dispatch(postRecipes(input))` y mensajes de éxito/error.
- Labels con `htmlFor` e ids en inputs.
- Select de dieta con opción vacía y `value=""` para evitar duplicados.
- Typo `errors.sumary` corregido y lógica de errores unificada.

### `src/components/Footer.jsx`

- `<ui>` → `<ul>`.

### `src/components/Details.jsx`

- `useEffect` con dependencias `[id, dispatch]`.
- Keys en el map de instrucciones.

### `src/components/SearchBar.jsx`

- Formulario con input controlado (`value={title}`) y submit por Enter.

### `src/components/Paginado.jsx`

- Enlaces reemplazados por botones para evitar `href` inválidos.

---

## 3. Por qué importan estas mejoras

- **Inmutabilidad en Redux**: Evita bugs sutiles y permite que Redux DevTools y React detecten cambios correctamente.
- **Manejo de errores en actions**: La UI deja de quedarse en estado “cargando” cuando el API falla y puede mostrar listas vacías o reintentar.
- **Un solo cliente API**: Cambiar de entorno (local/producción) se hace con una variable (`VITE_API_URL`) y un único archivo.
- **Constantes de Redux**: Menos errores de tipeo y refactors más seguros al cambiar nombres de actions.
- **Dependencias correctas en `useEffect`**: Al navegar entre recetas, se vuelve a pedir el detalle correspondiente.
- **Formularios controlados y validación**: Comportamiento predecible, mejor UX y menos envíos inválidos.
- **Accesibilidad (labels, botones, aria-label)**: Mejor uso con teclado y lectores de pantalla.

---

## 4. Sugerencias no implementadas (opcional)

- **Testing**: Añadir pruebas unitarias (p. ej. Vitest) para `validateForm`, reducer (casos de filtros y ordenación) y componentes clave (Create, SearchBar).
- **TypeScript**: Migrar a `.tsx` y tipar estado Redux, props y respuestas del API para menos bugs en tiempo de desarrollo.
- **Componentes no usados**: `ContainerCards.jsx` y `MateriasProf.jsx` no se usan; se pueden eliminar o integrar si tienen uso futuro.
- **Layout**: Extraer la barra de navegación/filtros de `Home.jsx` a un layout compartido para no repetir estructura.
- **Variables de entorno**: Usar `.env.example` (ya creado) y en producción definir `VITE_API_URL` si el backend cambia de dominio.

---

## 5. DevOps / deploy

- Añadido `.env.example` con `VITE_API_URL` opcional.
- Para producción, en el host (Vercel, Netlify, etc.) configurar `VITE_API_URL` si el API no es `https://apifood-pi.onrender.com`.
- El build con `npm run build` usa solo variables que empiezan por `VITE_`.
