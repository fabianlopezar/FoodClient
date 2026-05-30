import { Motion } from "@capacitor/motion";
import { useEffect, useState } from "react";

/**
 * Lee el acelerómetro del dispositivo (sensor de movimiento).
 * Útil para detectar inclinación o agitar el dispositivo.
 */
export function useMotion() {
  const [acceleration, setAcceleration] = useState(null);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let listenerHandle = null;
    let mounted = true;

    async function start() {
      try {
        listenerHandle = await Motion.addListener("accel", (event) => {
          if (!mounted) return;
          setAcceleration({
            x: event.acceleration.x,
            y: event.acceleration.y,
            z: event.acceleration.z,
          });
          setAvailable(true);
        });
      } catch {
        if (mounted) setAvailable(false);
      }
    }

    void start();

    return () => {
      mounted = false;
      if (listenerHandle) {
        void listenerHandle.remove();
      }
    };
  }, []);

  return { acceleration, available };
}
