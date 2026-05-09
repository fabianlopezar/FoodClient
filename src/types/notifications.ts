/**
 * Opciones al programar la cadencia (hora del día solo aplica al modo ~diario).
 */
export interface NotificationScheduleOptions {
  readonly useCustomTime: boolean;
  /** 0–23; si useCustomTime es false se usa una hora por defecto */
  readonly customHour: number;
  /** 0–59 */
  readonly customMinute: number;
}
