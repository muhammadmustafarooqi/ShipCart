"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/useSettings";

export default function DynamicFavicon() {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.faviconUrl) {
      // Find the existing favicon element or create a new one
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      
      // Also update shortcut icon if it exists
      let shortcutLink: HTMLLinkElement | null = document.querySelector("link[rel='shortcut icon']");
      if (shortcutLink) {
        shortcutLink.href = settings.faviconUrl;
      }

      link.href = settings.faviconUrl;
    }
  }, [settings?.faviconUrl]);

  return null;
}
