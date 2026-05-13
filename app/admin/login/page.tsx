"use client";

import { useState } from "react";
import { BrandLogoMark } from "@/components/BrandLogo";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Login successful");
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      padding: "20px",
    }}>
      <div style={{
        background: "white",
        borderRadius: "24px",
        padding: "48px 40px",
        width: "100%",
        maxWidth: "460px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", margin: "0 auto 22px" }}>
            <BrandLogoMark size={76} tone="elevated" />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", marginBottom: "8px" }}>
            Admin Portal
          </h1>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>
            Sign in to manage your ALLInONE store
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Email Address</label>
            <div className="search-input" style={{ background: "#f9fafb" }}>
              <Mail size={18} style={{ color: "#9ca3af" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@allinonestore.pk"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Password</label>
            <div className="search-input" style={{ background: "#f9fafb" }}>
              <Lock size={18} style={{ color: "#9ca3af" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "16px", marginTop: "12px" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
