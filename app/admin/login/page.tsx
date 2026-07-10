"use client";

import { useState } from "react";
import { BrandLogoMark } from "@/components/BrandLogo";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Key } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [needs2FA, setNeeds2FA] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        token: needs2FA ? token : undefined,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "2FA_REQUIRED") {
          setNeeds2FA(true);
          toast("Two-Factor Authentication required", { icon: "🛡️" });
        } else if (res.error === "2FA_INVALID") {
          toast.error("Invalid authentication code");
        } else {
          toast.error("Invalid credentials");
        }
      } else if (res?.ok) {
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
            {needs2FA ? "Security Verification" : "Admin Portal"}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>
            {needs2FA ? "Enter the 6-digit code from your authenticator app" : "Sign in to manage your CartShip store"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {!needs2FA ? (
            <>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Email Address</label>
                <div className="search-input" style={{ background: "#f9fafb" }}>
                  <Mail size={18} style={{ color: "#9ca3af" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@cartshipstore.pk"
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
            </>
          ) : (
            <div className="form-group" style={{ margin: 0 }}>
              <label>Authentication Code</label>
              <div className="search-input" style={{ background: "#f9fafb" }}>
                <Key size={18} style={{ color: "#9ca3af" }} />
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  autoFocus
                  style={{ letterSpacing: "4px", fontWeight: 600 }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (needs2FA && token.length < 6)}
            style={{
              background: "#ff6b00",
              color: "white",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              fontWeight: 700,
              fontSize: "16px",
              cursor: loading || (needs2FA && token.length < 6) ? "not-allowed" : "pointer",
              marginTop: "12px",
              opacity: loading || (needs2FA && token.length < 6) ? 0.7 : 1,
              transition: "opacity 0.2s"
            }}
          >
            {loading ? "Authenticating..." : needs2FA ? "Verify Code" : "Sign In"}
          </button>
          
          {needs2FA && (
            <button
              type="button"
              onClick={() => { setNeeds2FA(false); setToken(""); }}
              style={{
                background: "transparent",
                color: "#6b7280",
                border: "none",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                marginTop: "4px",
              }}
            >
              Back to Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
