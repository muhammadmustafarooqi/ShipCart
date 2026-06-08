import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart",
  description:
    "Review your selected items, update quantities, and proceed to checkout. Cash on Delivery available across all major cities in Pakistan.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Your Cart | ShipCart Store",
    description: "Review and checkout your selected products. COD available.",
    type: "website",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
