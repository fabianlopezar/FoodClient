import type { PermissionState } from '@capacitor/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { NOTIFICATION_STORAGE_KEYS } from '../constants/notificationStorage';
import {
  cancelAllNotifications,
  checkPermissionDisplay,
  loadPersistedNotificationConfig,
  reScheduleNotifications,
  requestPermissions,
} from '../services/notificationService';
import type { NotificationScheduleOptions } from '../types/notifications';

const DEFAULT_INTERVAL = 60;

export interface SaveNotificationSettingsResult {
  readonly saved: true;
  readonly scheduled: boolean;
  readonly permissionGranted: boolean;
}

export interface UseNotificationsResult {
  readonly enabled: boolean;
  readonly interval: number;
  readonly useCustomTime: boolean;
  readonly customHour: number;
  readonly customMinute: number;
  /** Último estado conocido del permiso del sistema */
  readonly permissionDisplay: PermissionState;
  readonly setEnabled: (value: boolean) => void;
  readonly setInterval: (value: number) => void;
  readonly setUseCustomTime: (value: boolean) => void;
  readonly setCustomTime: (hour: number, minute: number) => void;
  /** Persiste en Preferences y aplica programación o cancelación */
  readonly saveSettings: () => Promise<SaveNotificationSettingsResult>;
  /** Actualiza solo el estado del permiso (sin diálogo) */
  readonly refreshPermissionState: () => Promise<void>;
}

function optionsFromHookState(
  useCustomTime: boolean,
  customHour: number,
  customMinute: number,
): NotificationScheduleOptions {
  return {
    useCustomTime,
    customHour,
    customMinute,
  };
}

function savedResult(
  scheduled: boolean,
  permissionGranted: boolean,
): SaveNotificationSettingsResult {
  return { saved: true, scheduled, permissionGranted };
}

async function persistAll(params: {
  enabled: boolean;
  interval: number;
  useCustomTime: boolean;
  customHour: number;
  customMinute: number;
}): Promise<void> {
  await Preferences.set({
    key: NOTIFICATION_STORAGE_KEYS.ENABLED,
    value: params.enabled ? 'true' : 'false',
  });
  await Preferences.set({
    key: NOTIFICATION_STORAGE_KEYS.INTERVAL_MINUTES,
    value: String(params.interval),
  });
  await Preferences.set({
    key: NOTIFICATION_STORAGE_KEYS.USE_CUSTOM_TIME,
    value: params.useCustomTime ? 'true' : 'false',
  });
  await Preferences.set({
    key: NOTIFICATION_STORAGE_KEYS.CUSTOM_HOUR,
    value: String(params.customHour),
  });
  await Preferences.set({
    key: NOTIFICATION_STORAGE_KEYS.CUSTOM_MINUTE,
    value: String(params.customMinute),
  });
}

/**
 * Estado y persistencia de la configuración de notificaciones locales.
 * Centraliza lectura inicial, guardado y orquestación del servicio nativo.
 */
export function useNotifications(): UseNotificationsResult {
  const [enabled, setEnabled] = useState(false);
  const [interval, setIntervalState] = useState(DEFAULT_INTERVAL);
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [customHour, setCustomHour] = useState(9);
  const [customMinute, setCustomMinute] = useState(0);
  const [permissionDisplay, setPermissionDisplay] =
    useState<PermissionState>('prompt');

  const refreshPermissionState = useCallback(async () => {
    const display = await checkPermissionDisplay();
    setPermissionDisplay(display);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const cfg = await loadPersistedNotificationConfig();
      const perm = await checkPermissionDisplay();
      if (cancelled) return;
      setPermissionDisplay(perm);
      if (!cfg) return;
      setEnabled(cfg.enabled);
      setIntervalState(cfg.intervalMinutes);
      setUseCustomTime(cfg.options.useCustomTime);
      setCustomHour(cfg.options.customHour);
      setCustomMinute(cfg.options.customMinute);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setIntervalMinutes = useCallback((value: number) => {
    const safe =
      Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_INTERVAL;
    setIntervalState(safe);
  }, []);

  const setCustomTime = useCallback((hour: number, minute: number) => {
    setCustomHour(Math.min(23, Math.max(0, Math.floor(hour))));
    setCustomMinute(Math.min(59, Math.max(0, Math.floor(minute))));
  }, []);

  const saveSettings = useCallback(async () => {
    await persistAll({
      enabled,
      interval,
      useCustomTime,
      customHour,
      customMinute,
    });

    const scheduleOptions = optionsFromHookState(
      useCustomTime,
      customHour,
      customMinute,
    );

    if (!enabled) {
      await cancelAllNotifications();
      return savedResult(false, false);
    }

    const perm = await requestPermissions();
    const granted = perm.granted;
    setPermissionDisplay(perm.display);

    if (!granted) {
      await cancelAllNotifications();
      return savedResult(false, false);
    }

    await reScheduleNotifications(interval, scheduleOptions);
    return savedResult(true, true);
  }, [
    customHour,
    customMinute,
    enabled,
    interval,
    useCustomTime,
  ]);

  return useMemo(
    () => ({
      enabled,
      interval,
      useCustomTime,
      customHour,
      customMinute,
      permissionDisplay,
      setEnabled,
      setInterval: setIntervalMinutes,
      setUseCustomTime,
      setCustomTime,
      saveSettings,
      refreshPermissionState,
    }),
    [
      customHour,
      customMinute,
      enabled,
      interval,
      permissionDisplay,
      saveSettings,
      useCustomTime,
      refreshPermissionState,
      setCustomTime,
      setIntervalMinutes,
    ],
  );
}
