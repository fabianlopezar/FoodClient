/**
 * Cliente HTTP centralizado.
 * Una sola fuente de verdad para baseURL y configuración de axios.
 */
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "https://apifood-pi.onrender.com";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
