"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Shield, ShieldAlert, Key, Loader2, Info } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function AdminSecurityPage() {
  const [loading, setLoading] = useState(true);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  
  // Setup state
  const [setupMode, setSetupMode] = useState(false);
  const [secret, setSecret] = useState("");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/admin/security/2fa");
      const data = await res.json();
      setIsTwoFactorEnabled(data.isTwoFactorEnabled);
    } catch {
      toast.error("Failed to load security settings");
    } finally {
      setLoading(false);
    }
  };

  const handleStartSetup = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/security/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup" }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSecret(data.secret);
        setOtpauthUrl(data.otpauthUrl);
        setSetupMode(true);
      } else {
        toast.error(data.error || "Failed to start 2FA setup");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    try {
      const res = await fetch("/api/admin/security/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", token, secret }),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Two-Factor Authentication enabled successfully!");
        setIsTwoFactorEnabled(true);
        setSetupMode(false);
        setToken("");
      } else {
        toast.error(data.error || "Invalid authentication code");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setVerifying(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm("Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/security/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable" }),
      });
      if (res.ok) {
        toast.success("Two-Factor Authentication disabled");
        setIsTwoFactorEnabled(false);
      } else {
        toast.error("Failed to disable 2FA");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !setupMode) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <Loader2 className="spinner" size={32} style={{ color: "#ff6b00" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", marginBottom: "8px" }}>Security Settings</h1>
        <p style={{ color: "#6b7280", fontSize: "15px" }}>Manage authentication and security preferences for your admin account.</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
          <div style={{ 
            background: isTwoFactorEnabled ? "#dcfce7" : "#fee2e2", 
            color: isTwoFactorEnabled ? "#16a34a" : "#ef4444", 
            padding: "16px", 
            borderRadius: "12px",
            flexShrink: 0
          }}>
            {isTwoFactorEnabled ? <Shield size={32} /> : <ShieldAlert size={32} />}
          </div>
          
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937", marginBottom: "8px" }}>
              Two-Factor Authentication (2FA)
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
              Two-factor authentication adds an extra layer of security to your account. 
              Once enabled, you'll be required to enter both your password and an authentication code from your mobile app (like Google Authenticator or Authy) to log in.
            </p>
            
            {!isTwoFactorEnabled && !setupMode && (
              <button 
                onClick={handleStartSetup}
                style={{
                  background: "#ff6b00", color: "white", border: "none", padding: "12px 24px",
                  borderRadius: "8px", fontWeight: 600, fontSize: "14px", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: "8px"
                }}
              >
                <Key size={18} /> Enable 2FA
              </button>
            )}

            {isTwoFactorEnabled && (
              <button 
                onClick={handleDisable}
                style={{
                  background: "white", color: "#ef4444", border: "1px solid #ef4444", padding: "12px 24px",
                  borderRadius: "8px", fontWeight: 600, fontSize: "14px", cursor: "pointer",
                }}
              >
                Disable 2FA
              </button>
            )}
          </div>
        </div>

        {setupMode && (
          <div style={{ marginTop: "32px", borderTop: "1px solid #e5e7eb", paddingTop: "32px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1f2937", marginBottom: "16px" }}>Set up Authenticator App</h3>
            
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "16px", maxWidth: "300px" }}>
                  1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc).
                </p>
                <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", display: "inline-block" }}>
                  <QRCodeSVG value={otpauthUrl} size={180} />
                </div>
              </div>
              
              <div style={{ flex: 1, minWidth: "300px" }}>
                <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "16px" }}>
                  2. Enter the 6-digit code generated by the app to verify and enable 2FA.
                </p>
                
                <form onSubmit={handleVerify}>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                      Authentication Code
                    </label>
                    <input 
                      type="text" 
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      required
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #d1d5db",
                        fontSize: "24px", letterSpacing: "4px", textAlign: "center", fontFamily: "monospace"
                      }}
                    />
                  </div>
                  
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button 
                      type="submit" 
                      disabled={verifying || token.length < 6}
                      style={{
                        background: token.length === 6 ? "#10b981" : "#9ca3af", 
                        color: "white", border: "none", padding: "12px 24px",
                        borderRadius: "8px", fontWeight: 600, fontSize: "14px", cursor: token.length === 6 ? "pointer" : "not-allowed",
                        flex: 1, display: "flex", justifyContent: "center", alignItems: "center"
                      }}
                    >
                      {verifying ? <Loader2 size={18} className="spinner" /> : "Verify and Enable"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setSetupMode(false)}
                      style={{
                        background: "white", color: "#4b5563", border: "1px solid #d1d5db", padding: "12px 24px",
                        borderRadius: "8px", fontWeight: 600, fontSize: "14px", cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                
                <div style={{ marginTop: "24px", background: "#f3f4f6", padding: "12px", borderRadius: "8px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <Info size={18} style={{ color: "#6b7280", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontSize: "13px", color: "#4b5563", margin: 0, fontWeight: 600 }}>Can't scan the code?</p>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>Enter this text code manually into your app: <br/><code style={{ background: "#e5e7eb", padding: "2px 6px", borderRadius: "4px", marginTop: "4px", display: "inline-block" }}>{secret}</code></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
