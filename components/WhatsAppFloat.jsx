"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { api } from "@/lib/api";

export default function WhatsAppFloat() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api("/api/settings")
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch((err) => {
        console.error("Failed to load WhatsApp settings:", err);
      });
  }, []);

  const rawNumber = settings?.whatsapp || SITE.whatsapp || "919917580547";
  const cleanNumber = rawNumber.replace(/[^0-9]/g, "");
  const message =
    settings?.whatsappMessage || "Hi, I would like a free prenatal yoga consultation.";

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition duration-200 hover:scale-110"
      aria-label="WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor">
        <path d="M19.11 17.47c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
        <path d="M16.03 3C9.4 3 4 8.4 4 15.03c0 2.12.55 4.1 1.52 5.83L4 29l8.3-1.48A12 12 0 0 0 16.03 27C22.66 27 28 21.6 28 14.97 28 8.4 22.66 3 16.03 3zm0 21.82c-1.9 0-3.67-.5-5.2-1.38l-.37-.22-4.92.88.9-4.8-.24-.39a9.8 9.8 0 0 1-1.5-5.28c0-5.42 4.41-9.83 9.83-9.83 5.42 0 9.83 4.41 9.83 9.83 0 5.42-4.41 9.83-9.83 9.83z" />
      </svg>
    </a>
  );
}
