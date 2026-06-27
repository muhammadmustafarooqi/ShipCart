import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your ShipCart account to track orders, save your details, and enjoy faster checkout.",
  robots: { index: false, follow: false },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
