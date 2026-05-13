import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CartProvider from "@/components/CartProvider";
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

export const metadata: Metadata = {
  title: "AllInOne Store — Premium Gadgets & Accessories",
  description:
    "Shop premium gadgets, kitchen tools, personal care devices & tech accessories. Cash on Delivery. Free delivery above Rs. 1500. 100% Original Products.",
  keywords: "Pakistan gadgets, smart gadgets, kitchen tools, personal care, COD, cash on delivery Pakistan",
  icons: {
    icon: FAVICON_URL,
  },
  openGraph: {
    title: "AllInOne Store — Premium Gadgets & Accessories",
    description: "Top quality gadgets for every home. Free delivery on orders above Rs. 1500.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${outfit.variable}`}>
      <body className={jakarta.className} suppressHydrationWarning>
        <CartProvider>
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
        </CartProvider>
      </body>
    </html>
  );
}
