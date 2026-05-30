/** Formateadores reutilizables para fechas, números y texto. */

export function formatDate(date, locale = "es-ES") {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatScore(score) {
  const n = Number(score);
  if (Number.isNaN(n)) return "—";
  return `${Math.round(n)}/100`;
}

export function truncateText(text, maxLength = 120) {
  if (!text || text.length <= maxLength) return text ?? "";
  return `${text.slice(0, maxLength).trim()}…`;
}

export function formatCoordinates(lat, lng, decimals = 5) {
  if (lat == null || lng == null) return "—";
  return `${Number(lat).toFixed(decimals)}, ${Number(lng).toFixed(decimals)}`;
}
