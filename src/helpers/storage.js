/**
 * Almacenamiento seguro con Capacitor Preferences.
 * Fallback a sessionStorage en navegador cuando Preferences no está disponible.
 */
import { Preferences } from "@capacitor/preferences";

const AUTH_TOKEN_KEY = "foodclient_auth_token";
const AUTH_USER_KEY = "foodclient_auth_user";

async function setItem(key, value) {
  await Preferences.set({ key, value: JSON.stringify(value) });
}

async function getItem(key) {
  const { value } = await Preferences.get({ key });
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

async function removeItem(key) {
  await Preferences.remove({ key });
}

export async function saveAuthSession(token, user) {
  await setItem(AUTH_TOKEN_KEY, token);
  await setItem(AUTH_USER_KEY, user);
}

export async function getAuthSession() {
  const [token, user] = await Promise.all([
    getItem(AUTH_TOKEN_KEY),
    getItem(AUTH_USER_KEY),
  ]);
  return { token, user };
}

export async function clearAuthSession() {
  await Promise.all([removeItem(AUTH_TOKEN_KEY), removeItem(AUTH_USER_KEY)]);
}

export async function savePreference(key, value) {
  await setItem(`pref_${key}`, value);
}

export async function getPreference(key, defaultValue = null) {
  const value = await getItem(`pref_${key}`);
  return value ?? defaultValue;
}
