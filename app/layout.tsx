import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CartProvider from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "ALLInONE Store - Pakistan's Top Gadgets & Home Essentials",
  description:
    "Shop the best household gadgets, kitchen tools, personal care devices, and tech accessories. Cash on Delivery available across Pakistan. Free delivery above Rs. 1500.",
  keywords:
    "Pakistan online store, gadgets Pakistan, kitchen tools, personal care, COD, cash on delivery",
  openGraph: {
    title: "ALLInONE Store - Smart Shopping for Every Home",
    description:
      "Top quality gadgets and home essentials. Free delivery on orders above Rs. 1500. Cash on Delivery.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CartProvider>
          {children}
          <WhatsAppFloat />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 500,
              },
              success: {
                style: {
                  background: "#10b981",
                  color: "white",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                  color: "white",
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
