/**
 * Mensajes motivacionales rotativos para el cuerpo de las notificaciones locales.
 */
export const NOTIFICATION_MESSAGES: readonly string[] = [
  'Es momento de practicar inglés',
  'No pierdas tu racha',
  'Escucha una nueva lección',
  'Tu progreso depende de la constancia',
  '¡Un paso más hacia tu meta!',
  'Dedica unos minutos a aprender hoy',
  'La constancia supera el talento',
  'Repasa lo aprendido y sigue adelante',
];

/**
 * Devuelve un mensaje aleatorio de {@link NOTIFICATION_MESSAGES}.
 */
export function pickRandomMotivationalBody(): string {
  if (NOTIFICATION_MESSAGES.length === 0) {
    return '¡Sigue aprendiendo!';
  }
  const index = Math.floor(Math.random() * NOTIFICATION_MESSAGES.length);
  const picked = NOTIFICATION_MESSAGES[index];
  return picked ?? NOTIFICATION_MESSAGES[0];
}
