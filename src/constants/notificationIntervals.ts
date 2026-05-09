/**
 * Opciones de intervalo mostradas en la UI.
 * `value` son minutos entre disparos (1440 = 1 día).
 */
export const notificationIntervals = [
  { label: '15 minutos', value: 15 },
  { label: '30 minutos', value: 30 },
  { label: '1 hora', value: 60 },
  { label: '2 horas', value: 120 },
  { label: '1 día', value: 1440 },
] as const;

export type NotificationIntervalMinutes =
  (typeof notificationIntervals)[number]['value'];
