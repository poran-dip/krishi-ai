'use client';

import { useEffect } from "react";

export default function ClientSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("SW registered"))
        .catch((err) => console.error("SW registration failed", err));
    }
  }, []);

  return null;
}
