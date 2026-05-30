import { useEffect, useState } from "react";
import {
  subscribeChatMessages,
  type ChatMessage,
} from "../services/firebase/firestoreService";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(true);
    const unsubscribe = subscribeChatMessages((next) => {
      setMessages(next);
    });
    return () => {
      setConnected(false);
      unsubscribe();
    };
  }, []);

  return { messages, connected };
}

export type { ChatMessage };
