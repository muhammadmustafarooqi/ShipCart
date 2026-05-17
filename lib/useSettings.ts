import { useEffect, useState } from "react";

interface Settings {
  storeName: string;
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryAbove: number;
  announcementBarText: string;
  announcementBarActive: boolean;
  marqueeItems: Array<{ icon: string; text: string }>;
  offerBanner: {
    isActive: boolean;
    kickerText: string;
    kickerSubtext: string;
    titleLine1: string;
    titleLine2: string;
    highlightText: string;
    description: string;
    perk1Title: string;
    perk1Text: string;
    perk2Title: string;
    perk2Text: string;
    buttonText: string;
    buttonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    statValue: string;
    statLabel: string;
    stat2Value: string;
    stat2Label: string;
    panelNote: string;
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings", { 
          cache: "no-store",
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}
