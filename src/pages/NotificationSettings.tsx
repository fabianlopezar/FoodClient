import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import React, { useCallback, useMemo, useState } from 'react';
import { notificationIntervals } from '../constants/notificationIntervals';
import { useNotifications } from '../hooks/useNotifications';
import {
  computeNextNotificationPreview,
  NOTIFICATION_TITLE,
  requestPermissions,
} from '../services/notificationService';
import type { NotificationScheduleOptions } from '../types/notifications';

const DAY_MINUTES = 1440;

/** Convierte hora local elegida a ISO para IonDatetime (presentation time). */
function wallClockToIso(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function formatPreviewDate(date: Date): string {
  try {
    return date.toLocaleString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return date.toISOString();
  }
}

/**
 * Pantalla de preferencias: toggle, intervalo, hora opcional (modo diario), vista previa y guardado.
 */
const NotificationSettings: React.FC = () => {
  const {
    enabled,
    interval,
    useCustomTime,
    customHour,
    customMinute,
    permissionDisplay,
    setEnabled,
    setInterval,
    setUseCustomTime,
    setCustomTime,
    saveSettings,
    refreshPermissionState,
  } = useNotifications();

  const [saving, setSaving] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const scheduleOptions: NotificationScheduleOptions = useMemo(
    () => ({
      useCustomTime,
      customHour,
      customMinute,
    }),
    [customHour, customMinute, useCustomTime],
  );

  const nextPreview = useMemo(
    () => computeNextNotificationPreview(interval, scheduleOptions),
    [interval, scheduleOptions],
  );

  const native = Capacitor.isNativePlatform();
  const permissionBlocked =
    native && enabled && permissionDisplay !== 'granted';

  useIonViewWillEnter(() => {
    void (async () => {
      await requestPermissions();
      await refreshPermissionState();
    })();
  });

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const result = await saveSettings();
      let msg = 'Configuración guardada.';
      if (enabled && !result.permissionGranted) {
        msg +=
          ' Sin permiso de notificaciones no se pueden programar avisos: revisa los ajustes del sistema.';
      } else if (result.scheduled) {
        msg += ' Las notificaciones quedaron programadas.';
      } else if (!enabled) {
        msg += ' Todas las notificaciones pendientes fueron canceladas.';
      }
      setToastMessage(msg);
      setToastOpen(true);
    } finally {
      setSaving(false);
    }
  }, [enabled, saveSettings]);

  const dailyMode = interval >= DAY_MINUTES;
  const customTimeActive = dailyMode && useCustomTime;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Notificaciones locales</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {!native && (
          <IonNote color="warning">
            Las notificaciones locales de Capacitor no están disponibles en el
            navegador. Ejecuta la app en Android o iOS (`npm run cap:sync` y abre
            el proyecto nativo).
          </IonNote>
        )}

        {permissionBlocked && (
          <IonText color="danger">
            <p>
              Los avisos están activados pero el sistema denegó el permiso.
              Activa las notificaciones para esta app en los ajustes del
              dispositivo.
            </p>
          </IonText>
        )}

        <IonList inset>
          <IonItem>
            <IonLabel>Activar notificaciones</IonLabel>
            <IonToggle
              checked={enabled}
              onIonChange={(e) => setEnabled(e.detail.checked)}
              disabled={!native}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Frecuencia</IonLabel>
            <IonSelect
              interface="popover"
              value={interval}
              placeholder="Elige cada cuánto recibir avisos"
              onIonChange={(e) => {
                const v = e.detail.value;
                if (v === undefined || v === null) return;
                setInterval(Number(v));
              }}
              disabled={!native}
            >
              {notificationIntervals.map((opt) => (
                <IonSelectOption key={opt.value} value={opt.value}>
                  {opt.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem lines="none">
            <IonLabel className="ion-text-wrap">
              <p>
                <strong>Vista previa del próximo aviso</strong>
              </p>
              <p>{formatPreviewDate(nextPreview)}</p>
              <p className="ion-margin-top">
                <IonText color="medium">
                  Título fijo: «{NOTIFICATION_TITLE}». El texto será un mensaje
                  motivacional aleatorio en cada disparo.
                </IonText>
              </p>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonList inset>
          <IonItem>
            <IonLabel>Hora personalizada (solo modo 1 día)</IonLabel>
            <IonToggle
              checked={useCustomTime}
              disabled={!native || !dailyMode}
              onIonChange={(e) => setUseCustomTime(e.detail.checked)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Hora del recordatorio diario</IonLabel>
            <IonDatetime
              presentation="time"
              value={wallClockToIso(customHour, customMinute)}
              onIonChange={(e) => {
                const v = e.detail.value;
                if (v == null || Array.isArray(v)) return;
                const parsed = new Date(String(v));
                if (Number.isNaN(parsed.getTime())) return;
                setCustomTime(parsed.getHours(), parsed.getMinutes());
              }}
              disabled={!native || !customTimeActive}
            />
          </IonItem>
          {!dailyMode && (
            <IonNote className="ion-margin-horizontal">
              La hora personalizada solo aplica cuando la frecuencia es «1 día»
              (recordatorio diario a la misma hora).
            </IonNote>
          )}
        </IonList>

        <div className="ion-padding">
          <IonButton
            expand="block"
            onClick={() => void handleSave()}
            disabled={!native || saving}
          >
            {saving ? <IonSpinner name="crescent" /> : 'Guardar'}
          </IonButton>
        </div>

        <IonToast
          isOpen={toastOpen}
          duration={2600}
          message={toastMessage}
          onDidDismiss={() => setToastOpen(false)}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default NotificationSettings;
