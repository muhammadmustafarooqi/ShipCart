import type { Metadata } from "next";

// Static fallback — the client page handles the real title via document.title for dynamic products.
// For proper dynamic metadata on product pages, the page would need to be a Server Component.
// This layout provides a sensible default that search engines will see for the route segment.
export const metadata: Metadata = {
  title: "Product Details",
  description:
    "View product details, images, and pricing. Add to cart or buy now with Cash on Delivery across Pakistan. 100% original products with 7-day easy return policy.",
  openGraph: {
    title: "Product Details | CartShip",
    description: "View product details and buy with COD across Pakistan. Free delivery above Rs. 3000.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Details | CartShip",
    description: "Buy online with Cash on Delivery. Free delivery above Rs. 3000.",
  },
  robots: { index: true, follow: true },
};

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
