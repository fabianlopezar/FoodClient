import { Geolocation } from "@capacitor/geolocation";
import { useCallback, useEffect, useState } from "react";

export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== "granted") {
        const req = await Geolocation.requestPermissions();
        if (req.location !== "granted") {
          throw new Error("Permiso de ubicación denegado");
        }
      }
      const coords = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      setPosition({
        lat: coords.coords.latitude,
        lng: coords.coords.longitude,
        accuracy: coords.coords.accuracy,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de geolocalización");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { position, error, loading, refresh };
}
