import { Suspense } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CartProvider from "@/components/CartProvider";
import WishlistProvider from "@/components/WishlistProvider";
import MetaPixel from "@/components/MetaPixel";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import AppSessionProvider from "@/components/AppSessionProvider";
import { FAVICON_URL } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta"
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit"
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shipcartstore.pk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ShipCart — Premium Gadgets & Accessories Pakistan",
    template: "%s | ShipCart",
  },
  description:
    "Shop premium gadgets, kitchen tools, personal care devices & tech accessories in Pakistan. Cash on Delivery. Free delivery above Rs. 3000. 100% Original Products.",
  keywords: [
    "online shopping Pakistan","gadgets Pakistan","smart gadgets","kitchen tools Pakistan",
    "personal care devices","electronics Pakistan","COD Pakistan","cash on delivery",
    "baby products Pakistan","fitness equipment Pakistan","home cleaning tools",
    "ShipCart","buy online Pakistan",
  ],
  authors: [{ name: "ShipCart" }],
  creator: "ShipCart",
  publisher: "ShipCart",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: FAVICON_URL, shortcut: FAVICON_URL },
  openGraph: {
    title: "ShipCart — Premium Gadgets & Accessories Pakistan",
    description: "Top quality gadgets for every home. Free delivery on orders above Rs. 3000. COD available.",
    type: "website",
    url: SITE_URL,
    siteName: "ShipCart",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipCart — Premium Gadgets & Accessories Pakistan",
    description: "Top quality gadgets, kitchen tools & personal care devices. COD available across Pakistan.",
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${outfit.variable}`}>
      <body className={jakarta.className} suppressHydrationWarning>
        <AppSessionProvider>
          <CartProvider>
            <WishlistProvider>
            <MetaPixel />
            <Suspense fallback={null}>
              <AnalyticsTracker />
            </Suspense>
            {children}
            <WhatsAppFloat />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#0f172a",
                  color: "#ffffff",
                  border: "1px solid #1e293b",
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
            </WishlistProvider>
          </CartProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}
