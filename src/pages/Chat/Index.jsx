import React, { useState } from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import { sendChatMessage } from "../../services/firebase/firestoreService";
import { formatDate } from "../../helpers/formatters";
import { isFirebaseConfigured } from "../../config/firebase";
import s from "./Index.module.scss";

export default function Chat() {
  const { user } = useAuth();
  const { messages, connected } = useChat();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || !user) return;
    if (!isFirebaseConfigured()) {
      alert("Configura Firebase para el chat en tiempo real.");
      return;
    }
    setSending(true);
    try {
      await sendChatMessage(
        user.uid,
        user.displayName || user.email || "Usuario",
        text.trim()
      );
      setText("");
    } finally {
      setSending(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Chat en tiempo real</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className={s.page}>
          <p className={s.status}>
            {connected ? "Conectado (Firestore onSnapshot)" : "Desconectado"}
          </p>
          <div className={s.messages}>
            {messages.length === 0 ? (
              <p>No hay mensajes. Escribe el primero.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={s.message}>
                  <div className={s.meta}>
                    {msg.displayName} ·{" "}
                    {msg.createdAt
                      ? formatDate(
                          msg.createdAt.toDate?.() ?? msg.createdAt
                        )
                      : "ahora"}
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))
            )}
          </div>
          <form className={s.inputBar} onSubmit={handleSend}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe un mensaje…"
              disabled={sending}
            />
            <button type="submit" disabled={sending}>
              Enviar
            </button>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
}
