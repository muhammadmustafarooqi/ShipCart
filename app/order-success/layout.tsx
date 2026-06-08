import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed!",
  description:
    "Your order has been placed successfully. Our team will contact you to confirm delivery details. Thank you for shopping at ShipCart Store!",
  robots: { index: false, follow: false },
};

export default function OrderSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
