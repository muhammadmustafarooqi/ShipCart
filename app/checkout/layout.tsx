import type { Metadata } from "next";
import CheckoutSessionProvider from "@/components/CheckoutSessionProvider";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your order securely. Enter your delivery details and confirm your Cash on Delivery order. Fast delivery across Pakistan.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Checkout | ShipCart Store",
    description: "Complete your order. COD available across Pakistan.",
    type: "website",
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CheckoutSessionProvider>{children}</CheckoutSessionProvider>;
}
