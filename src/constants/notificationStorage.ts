/**
 * Claves únicas para persistencia en Capacitor Preferences (evita typos y duplicación).
 */
export const NOTIFICATION_STORAGE_KEYS = {
  ENABLED: 'notifications_enabled',
  INTERVAL_MINUTES: 'notifications_interval_minutes',
  USE_CUSTOM_TIME: 'notifications_use_custom_time',
  CUSTOM_HOUR: 'notifications_custom_hour',
  CUSTOM_MINUTE: 'notifications_custom_minute',
} as const;
