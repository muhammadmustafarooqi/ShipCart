import CheckoutSessionProvider from "@/components/CheckoutSessionProvider";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CheckoutSessionProvider>{children}</CheckoutSessionProvider>;
}
