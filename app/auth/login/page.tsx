"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid credentials");
      }

      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "url('https://images.unsplash.com/photo-1557821552-17105176677c?w=1920&q=80') center/cover",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "20px",
      position: "relative"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
      <div style={{ maxWidth: "440px", width: "100%", background: "rgba(255,255,255,0.98)", borderRadius: "24px", padding: "48px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", overflow: "hidden", background: "white", boxShadow: "0 8px 20px rgba(99,102,241,0.4)" }}>
            <Image 
              src="/logo.webp" 
              alt="AllInOne Store Logo" 
              width={64} 
              height={64}
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", marginBottom: "8px", fontFamily: "Outfit, sans-serif" }}>Welcome Back</h1>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>Login to your AllInOne account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} color="#9ca3af" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                style={{ width: "100%", padding: "12px 12px 12px 44px", border: "2px solid #e5e7eb", borderRadius: "12px", fontSize: "15px", outline: "none", transition: "border 0.2s", background: "white" }}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} color="#9ca3af" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{ width: "100%", padding: "12px 12px 12px 44px", border: "2px solid #e5e7eb", borderRadius: "12px", fontSize: "15px", outline: "none", transition: "border 0.2s", background: "white" }}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "transform 0.2s", opacity: loading ? 0.7 : 1, boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)" }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {loading ? "Logging in..." : "Login"} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
          Don't have an account?{" "}
          <Link href="/auth/signup" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
            Sign Up
          </Link>
        </div>

        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
          <Link href="/" style={{ color: "#6b7280", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}>
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
