"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogoMark } from "@/components/BrandLogo";
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          city: form.city,
          address: form.address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      toast.success("Account created! Please login.");
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80') center/cover",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "40px 20px",
      position: "relative"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
      <div className="signup-card" style={{ maxWidth: "900px", width: "100%", minWidth: 0, background: "rgba(255,255,255,0.98)", borderRadius: "24px", padding: "clamp(22px, 5vw, 48px)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", margin: "0 auto 22px" }}>
            <BrandLogoMark size={88} tone="elevated" />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", marginBottom: "8px", fontFamily: "Outfit, sans-serif" }}>Create Account</h1>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>Join AllInOne Store today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="signup-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Full Name *</label>
              <div style={{ position: "relative" }}>
                <User size={18} color="#9ca3af" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Muhammad Ali"
                  required
                  style={{ width: "100%", padding: "12px 12px 12px 44px", border: "2px solid #e5e7eb", borderRadius: "12px", fontSize: "15px", outline: "none", transition: "border 0.2s", background: "white" }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Email Address *</label>
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

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Phone Number *</label>
              <div style={{ position: "relative" }}>
                <Phone size={18} color="#9ca3af" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="03001234567"
                  maxLength={11}
                  required
                  style={{ width: "100%", padding: "12px 12px 12px 44px", border: "2px solid #e5e7eb", borderRadius: "12px", fontSize: "15px", outline: "none", transition: "border 0.2s", background: "white" }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>City</label>
              <div style={{ position: "relative" }}>
                <MapPin size={18} color="#9ca3af" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Karachi"
                  style={{ width: "100%", padding: "12px 12px 12px 44px", border: "2px solid #e5e7eb", borderRadius: "12px", fontSize: "15px", outline: "none", transition: "border 0.2s", background: "white" }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Password *</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color="#9ca3af" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  style={{ width: "100%", padding: "12px 12px 12px 44px", border: "2px solid #e5e7eb", borderRadius: "12px", fontSize: "15px", outline: "none", transition: "border 0.2s", background: "white" }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Confirm Password *</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color="#9ca3af" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  style={{ width: "100%", padding: "12px 12px 12px 44px", border: "2px solid #e5e7eb", borderRadius: "12px", fontSize: "15px", outline: "none", transition: "border 0.2s", background: "white" }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="House/Flat No, Street, Area"
              rows={2}
              style={{ width: "100%", padding: "12px 16px", border: "2px solid #e5e7eb", borderRadius: "12px", fontSize: "15px", outline: "none", transition: "border 0.2s", resize: "vertical", fontFamily: "inherit", background: "white" }}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "transform 0.2s", opacity: loading ? 0.7 : 1, boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)" }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {loading ? "Creating Account..." : "Sign Up"} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
            Login
          </Link>
        </div>

        <div style={{ marginTop: "20px", padding: "14px", background: "#f9fafb", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <ShieldCheck size={18} color="#10b981" />
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Your data is secure and encrypted</p>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link href="/" style={{ color: "#6b7280", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}>
            ← Back to Store
          </Link>
        </div>
      </div>

      <style>{`
        .signup-card { box-sizing: border-box; }
        @media (max-width: 900px) {
          .signup-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
