import React, { useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { validateLoginForm } from "../../helpers/validators";
import { isFirebaseConfigured } from "../../config/firebase";
import s from "./Index.module.scss";

export default function Login() {
  const { user, login, firebaseReady } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  if (user) return <Redirect to="/home" />;

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validateLoginForm({ email, password });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setMessage("");
    try {
      await login(email, password);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Error al iniciar sesión"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <IonPage>
      <IonContent>
        <div className={s.formPage}>
          <div className={s.card}>
            <h1 className={s.title}>Iniciar sesión</h1>
            {!firebaseReady && (
              <p className={s.banner}>
                Firebase no está configurado. Añade las variables VITE_FIREBASE_*
                en tu archivo .env para habilitar autenticación segura.
              </p>
            )}
            <form onSubmit={handleSubmit}>
              <div className={s.field}>
                <label htmlFor="email">Correo</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {errors.email && <p className={s.error}>{errors.email}</p>}
              </div>
              <div className={s.field}>
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p className={s.error}>{errors.password}</p>
                )}
              </div>
              {message && <p className={s.error}>{message}</p>}
              <button
                className={s.submit}
                type="submit"
                disabled={submitting || !isFirebaseConfigured()}
              >
                {submitting ? "Entrando…" : "Entrar"}
              </button>
            </form>
            <Link className={s.link} to="/register">
              ¿No tienes cuenta? Regístrate
            </Link>
            <Link className={s.link} to="/home">
              Volver al inicio
            </Link>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
