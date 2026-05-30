import React, { useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { validateRegisterForm } from "../../helpers/validators";
import { isFirebaseConfigured } from "../../config/firebase";
import s from "./Index.module.scss";

export default function Register() {
  const { user, register } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  if (user) return <Redirect to="/home" />;

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validateRegisterForm({ email, password, displayName });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register(email, password, displayName);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Error al registrarse"
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
            <h1 className={s.title}>Registro</h1>
            <form onSubmit={handleSubmit}>
              <div className={s.field}>
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                {errors.displayName && (
                  <p className={s.error}>{errors.displayName}</p>
                )}
              </div>
              <div className={s.field}>
                <label htmlFor="email">Correo</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {submitting ? "Registrando…" : "Crear cuenta"}
              </button>
            </form>
            <Link className={s.link} to="/login">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
