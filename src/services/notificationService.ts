import { App } from '@capacitor/app';
import type { PermissionState, PluginListenerHandle } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';
import type { LocalNotificationSchema } from '@capacitor/local-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

import { NOTIFICATION_STORAGE_KEYS } from '../constants/notificationStorage';
import { pickRandomMotivationalBody } from '../constants/notificationMessages';

import type { NotificationScheduleOptions } from '../types/notifications';

/**
 * =========================================================
 * CONFIGURACIÓN GENERAL
 * =========================================================
 */

/** Título visible en la notificación */
export const NOTIFICATION_TITLE = 'FoodClient';

/** Canal Android */
export const ANDROID_CHANNEL_ID =
  'foodclient-motivation-local';

/** Base de IDs */
const BASE_NOTIFICATION_ID = 910_000;

/** Cantidad de notificaciones futuras */
const BATCH_SIZE = 36;

/** Minutos equivalentes a 1 día */
const DAY_MINUTES = 1440;

/** Hora por defecto */
const DEFAULT_DAILY_HOUR = 9;
const DEFAULT_DAILY_MINUTE = 0;

/**
 * =========================================================
 * TEST MODE
 * =========================================================
 * true:
 *   10 = 10 segundos
 *
 * false:
 *   10 = 10 minutos
 */
const TEST_MODE = true;

/**
 * =========================================================
 * TYPES
 * =========================================================
 */

export interface PermissionRequestResult {
  readonly granted: boolean;
  readonly display: PermissionState;
  readonly native: boolean;
}

export interface PersistedNotificationConfig {
  readonly enabled: boolean;
  readonly intervalMinutes: number;
  readonly options: NotificationScheduleOptions;
}

/**
 * =========================================================
 * LISTENERS
 * =========================================================
 */

let resumeListener: PluginListenerHandle | undefined;

/**
 * =========================================================
 * HELPERS
 * =========================================================
 */

function clampHour(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_DAILY_HOUR;
  }

  return Math.min(
    23,
    Math.max(0, Math.floor(value)),
  );
}

function clampMinute(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_DAILY_MINUTE;
  }

  return Math.min(
    59,
    Math.max(0, Math.floor(value)),
  );
}

/**
 * =========================================================
 * DAILY MODE
 * =========================================================
 */

export function buildDailyFireDates(
  hour: number,
  minute: number,
  count: number,
): Date[] {
  const h = clampHour(hour);
  const m = clampMinute(minute);

  const first = new Date();

  first.setHours(h, m, 0, 0);

  if (first.getTime() <= Date.now()) {
    first.setDate(first.getDate() + 1);
  }

  const dates: Date[] = [];

  for (let i = 0; i < count; i++) {
    const d = new Date(first);

    d.setDate(first.getDate() + i);

    dates.push(d);
  }

  return dates;
}

/**
 * =========================================================
 * GENERAR FECHAS DE NOTIFICACIONES
 * =========================================================
 */

export function buildScheduledDates(
  intervalMinutes: number,
  options: NotificationScheduleOptions,
  batchSize: number,
): Date[] {
  const safeInterval = Math.max(
    1,
    Math.floor(intervalMinutes),
  );

  /**
   * El modo diario se desactiva en TEST_MODE
   */
  const dailyMode =
    !TEST_MODE &&
    safeInterval >= DAY_MINUTES;

  /**
   * =====================================================
   * MODO DIARIO
   * =====================================================
   */

  if (dailyMode) {
    const hour = options.useCustomTime
      ? clampHour(options.customHour)
      : DEFAULT_DAILY_HOUR;

    const minute = options.useCustomTime
      ? clampMinute(options.customMinute)
      : DEFAULT_DAILY_MINUTE;

    return buildDailyFireDates(
      hour,
      minute,
      batchSize,
    );
  }

  /**
   * =====================================================
   * INTERVALO
   * =====================================================
   */

  const ms = TEST_MODE
    ? safeInterval * 1000
    : safeInterval * 60 * 1000;

  console.log('================================');
  console.log('[Notifications]');
  console.log('TEST_MODE:', TEST_MODE);
  console.log('Interval:', safeInterval);
  console.log('Milliseconds:', ms);
  console.log('================================');

  /**
   * =====================================================
   * CREAR FECHAS
   * =====================================================
   */

  return Array.from(
    { length: batchSize },
    (_, index) => {
      const fireDate = new Date(
        Date.now() + (index + 1) * ms,
      );

      console.log(
        `Notification #${index + 1}`,
        fireDate.toLocaleString(),
      );

      return fireDate;
    },
  );
}

/**
 * =========================================================
 * PREVIEW
 * =========================================================
 */

export function computeNextNotificationPreview(
  intervalMinutes: number,
  options: NotificationScheduleOptions,
): Date {
  const next =
    buildScheduledDates(
      intervalMinutes,
      options,
      1,
    )[0];

  return next ?? new Date();
}

/**
 * =========================================================
 * CANAL ANDROID
 * =========================================================
 */

async function ensureAndroidChannel(): Promise<void> {
  if (
    Capacitor.getPlatform() !== 'android'
  ) {
    return;
  }

  await LocalNotifications.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: 'Recordatorios',
    description:
      'Notificaciones motivacionales locales',
    importance: 5,
    vibration: true,
    lights: true,
    lightColor: '#488AFF',
  });
}

/**
 * =========================================================
 * PERMISOS
 * =========================================================
 */

export async function requestPermissions(): Promise<PermissionRequestResult> {
  if (!Capacitor.isNativePlatform()) {
    return {
      granted: false,
      display: 'denied',
      native: false,
    };
  }

  const existing =
    await LocalNotifications.checkPermissions();

  if (existing.display === 'granted') {
    return {
      granted: true,
      display: 'granted',
      native: true,
    };
  }

  const result =
    await LocalNotifications.requestPermissions();

  return {
    granted: result.display === 'granted',
    display: result.display,
    native: true,
  };
}

export async function checkPermissionDisplay(): Promise<PermissionState> {
  if (!Capacitor.isNativePlatform()) {
    return 'denied';
  }

  const status =
    await LocalNotifications.checkPermissions();

  return status.display;
}

/**
 * =========================================================
 * CANCELAR NOTIFICACIONES
 * =========================================================
 */

export async function cancelAllNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  const pending =
    await LocalNotifications.getPending();

  if (
    pending.notifications.length === 0
  ) {
    return;
  }

  await LocalNotifications.cancel({
    notifications:
      pending.notifications.map((n) => ({
        id: n.id,
      })),
  });

  console.log(
    '[Notifications] Todas canceladas',
  );
}

/**
 * =========================================================
 * PAYLOAD
 * =========================================================
 */

function buildNotificationPayload(
  fireDate: Date,
  slotIndex: number,
): LocalNotificationSchema {
  const platform =
    Capacitor.getPlatform();

  return {
    id: BASE_NOTIFICATION_ID + slotIndex,

    title: NOTIFICATION_TITLE,

    body: pickRandomMotivationalBody(),

    channelId:
      platform === 'android'
        ? ANDROID_CHANNEL_ID
        : undefined,

    schedule: {
      at: fireDate,
      allowWhileIdle: true,
    },

    autoCancel: true,
  };
}

/**
 * =========================================================
 * PROGRAMAR NOTIFICACIONES
 * =========================================================
 */

export async function scheduleNotification(
  intervalMinutes: number,
  options: NotificationScheduleOptions,
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  await ensureAndroidChannel();

  const dates =
    buildScheduledDates(
      intervalMinutes,
      options,
      BATCH_SIZE,
    );

  const notifications = dates.map(
    (at, i) =>
      buildNotificationPayload(at, i),
  );

  await LocalNotifications.schedule({
    notifications,
  });

  console.log(
    '[Notifications] Programadas:',
    notifications.length,
  );

  /**
   * Android exact alarms
   */

  if (
    Capacitor.getPlatform() === 'android'
  ) {
    const exact =
      await LocalNotifications.checkExactNotificationSetting();

    if (
      exact.exact_alarm !== 'granted'
    ) {
      console.warn(
        '[Notifications] Exact alarms no concedidas',
      );
    }
  }
}

/**
 * =========================================================
 * REPROGRAMAR
 * =========================================================
 */

export async function reScheduleNotifications(
  intervalMinutes: number,
  options: NotificationScheduleOptions,
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  await cancelAllNotifications();

  await scheduleNotification(
    intervalMinutes,
    options,
  );
}

/**
 * =========================================================
 * PREFERENCES
 * =========================================================
 */

async function readBoolPref(
  key: string,
  defaultValue: boolean,
): Promise<boolean> {
  const { value } =
    await Preferences.get({ key });

  if (
    value === null ||
    value === undefined
  ) {
    return defaultValue;
  }

  return value === 'true';
}

async function readNumberPref(
  key: string,
  defaultValue: number,
): Promise<number> {
  const { value } =
    await Preferences.get({ key });

  if (
    value === null ||
    value === undefined
  ) {
    return defaultValue;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : defaultValue;
}

/**
 * =========================================================
 * CARGAR CONFIG
 * =========================================================
 */

export async function loadPersistedNotificationConfig(): Promise<PersistedNotificationConfig | null> {
  const intervalMinutes =
    await readNumberPref(
      NOTIFICATION_STORAGE_KEYS.INTERVAL_MINUTES,
      NaN,
    );

  if (!Number.isFinite(intervalMinutes)) {
    return null;
  }

  const enabled =
    await readBoolPref(
      NOTIFICATION_STORAGE_KEYS.ENABLED,
      false,
    );

  const useCustomTime =
    await readBoolPref(
      NOTIFICATION_STORAGE_KEYS.USE_CUSTOM_TIME,
      false,
    );

  const customHour =
    await readNumberPref(
      NOTIFICATION_STORAGE_KEYS.CUSTOM_HOUR,
      DEFAULT_DAILY_HOUR,
    );

  const customMinute =
    await readNumberPref(
      NOTIFICATION_STORAGE_KEYS.CUSTOM_MINUTE,
      DEFAULT_DAILY_MINUTE,
    );

  return {
    enabled,

    intervalMinutes,

    options: {
      useCustomTime,

      customHour:
        clampHour(customHour),

      customMinute:
        clampMinute(customMinute),
    },
  };
}

/**
 * =========================================================
 * SYNC
 * =========================================================
 */

export async function syncFromStoredPreferences(): Promise<void> {
  const cfg =
    await loadPersistedNotificationConfig();

  if (!cfg?.enabled) {
    return;
  }

  const perm =
    await checkPermissionDisplay();

  if (perm !== 'granted') {
    return;
  }

  await reScheduleNotifications(
    cfg.intervalMinutes,
    cfg.options,
  );
}

/**
 * =========================================================
 * APP LIFECYCLE
 * =========================================================
 */

export async function registerAppLifecycleSync(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  if (resumeListener) {
    return;
  }

  resumeListener =
    await App.addListener(
      'resume',
      () => {
        void syncFromStoredPreferences();
      },
    );
}