"use client";

import { useEffect } from "react";

/** Enregistre le Service Worker de mise en cache (images + vidéos) */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          console.log("[SW] Enregistré :", reg.scope);
        })
        .catch((err) => {
          console.warn("[SW] Erreur d'enregistrement :", err);
        });
    }
  }, []);

  return null;
}
