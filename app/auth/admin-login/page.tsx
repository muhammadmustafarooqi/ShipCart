"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPass, setFocusedPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
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
    <>
      <div className="admin-login-page">
        {/* Background grid */}
        <div className="admin-bg-grid" aria-hidden />
        {/* Gradient orbs */}
        <div className="admin-orb admin-orb-tl" aria-hidden />
        <div className="admin-orb admin-orb-br" aria-hidden />

        <div className="admin-card">
          {/* Top accent bar */}
          <div className="admin-card-bar" aria-hidden />

          {/* Logo mark */}
          <div className="admin-logo-wrap">
            <div className="admin-logo-ring">
              <div className="admin-logo-inner">
                <ShieldCheck size={26} strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="admin-header">
            <div className="admin-tag">
              <span className="admin-tag-dot" aria-hidden />
              Secure Portal
            </div>
            <h1 className="admin-title">Admin Login</h1>
            <p className="admin-subtitle">Sign in to manage your ShipCart Store</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="admin-form">
            {/* Email */}
            <div className={`admin-field ${focusedEmail ? "focused" : ""}`}>
              <label className="admin-label">Admin Email</label>
              <div className="admin-input-wrap">
                <Mail size={17} className="admin-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedEmail(true)}
                  onBlur={() => setFocusedEmail(false)}
                  placeholder="admin@shipcartstore.pk"
                  required
                  className="admin-input"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className={`admin-field ${focusedPass ? "focused" : ""}`}>
              <label className="admin-label">Password</label>
              <div className="admin-input-wrap">
                <Lock size={17} className="admin-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedPass(true)}
                  onBlur={() => setFocusedPass(false)}
                  placeholder="••••••••"
                  required
                  className="admin-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-eye-btn"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="admin-submit-btn">
              {loading ? (
                <>
                  <span className="admin-btn-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="admin-card-footer">
            <div className="admin-security-badge">
              <ShieldCheck size={14} />
              <span>256-bit encrypted secure connection</span>
            </div>
            <Link href="/" className="admin-back-link">← Back to Store</Link>
          </div>
        </div>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, var(--navy-deep) 0%, var(--navy) 45%, var(--navy-soft) 100%);
          padding: 24px;
          position: relative;
          overflow: hidden;
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        /* Background grid */
        .admin-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 97, 2, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 97, 2, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Orbs */
        .admin-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
        }
        .admin-orb-tl {
          width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(16,40,87,0.35) 0%, transparent 70%);
          top: -200px; left: -200px;
          animation: orbFloat1 12s ease-in-out infinite;
        }
        .admin-orb-br {
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(255,97,2,0.15) 0%, transparent 70%);
          bottom: -150px; right: -100px;
          animation: orbFloat2 10s ease-in-out infinite;
        }
        @keyframes orbFloat1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px, 30px); } }
        @keyframes orbFloat2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px,-20px); } }

        /* Card */
        .admin-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: rgba(255, 253, 249, 0.03);
          border: 1px solid rgba(255, 97, 2, 0.2);
          border-radius: 24px;
          padding: 48px 40px 40px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255,253,249,0.04) inset,
            0 40px 80px rgba(0,0,0,0.6),
            0 0 80px rgba(16,40,87,0.15);
          animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          overflow: hidden;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Top accent bar */
        .admin-card-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--navy-deep), var(--navy) 30%, var(--orange) 50%, var(--navy) 70%, var(--navy-deep));
          background-size: 200%;
          animation: barShimmer 4s ease infinite;
        }
        @keyframes barShimmer {
          0%,100% { background-position: 0%; }
          50% { background-position: 100%; }
        }

        /* Logo */
        .admin-logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }
        .admin-logo-ring {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--navy), var(--navy-deep));
          border: 2px solid rgba(255,97,2,0.4);
          box-shadow: 0 0 40px rgba(16,40,87,0.5), 0 0 0 8px rgba(16,40,87,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 3s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 40px rgba(16,40,87,0.5), 0 0 0 8px rgba(16,40,87,0.1); }
          50% { box-shadow: 0 0 60px rgba(16,40,87,0.7), 0 0 0 12px rgba(16,40,87,0.08); }
        }
        .admin-logo-inner {
          color: var(--orange);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Header */
        .admin-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .admin-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--orange);
          background: rgba(255,97,2,0.1);
          border: 1px solid rgba(255,97,2,0.25);
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 14px;
          font-family: "Outfit", sans-serif;
        }
        .admin-tag-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 8px var(--orange);
          animation: blinkDot 2s ease-in-out infinite;
        }
        @keyframes blinkDot {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .admin-title {
          font-family: "Outfit", sans-serif;
          font-size: 2rem;
          font-weight: 900;
          color: #FFFDF9;
          letter-spacing: -0.03em;
          margin-bottom: 8px;
          line-height: 1;
        }
        .admin-subtitle {
          font-size: 14px;
          color: rgba(255,253,249,0.5);
          font-weight: 500;
          line-height: 1.5;
        }

        /* Form */
        .admin-form { display: flex; flex-direction: column; gap: 20px; }

        .admin-field { display: flex; flex-direction: column; gap: 8px; }
        .admin-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255,253,249,0.55);
          font-family: "Outfit", sans-serif;
          transition: color 0.2s;
        }
        .admin-field.focused .admin-label { color: var(--orange); }

        .admin-input-wrap { position: relative; display: flex; align-items: center; }
        .admin-input-icon {
          position: absolute;
          left: 16px;
          color: rgba(255,253,249,0.3);
          pointer-events: none;
          transition: color 0.2s;
          z-index: 1;
        }
        .admin-field.focused .admin-input-icon { color: var(--orange); }

        .admin-input {
          width: 100%;
          background: rgba(255,253,249,0.04);
          border: 1px solid rgba(255,253,249,0.1);
          border-radius: 12px;
          padding: 15px 16px 15px 48px;
          font-size: 15px;
          font-family: "Plus Jakarta Sans", sans-serif;
          color: #FFFDF9;
          outline: none;
          transition: all 0.25s ease;
          font-weight: 500;
        }
        .admin-input::placeholder { color: rgba(255,253,249,0.25); }
        .admin-input:focus {
          border-color: rgba(255,97,2,0.5);
          background: rgba(255,253,249,0.06);
          box-shadow: 0 0 0 3px rgba(255,97,2,0.1);
        }

        .admin-eye-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,253,249,0.35);
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .admin-eye-btn:hover { color: var(--orange); }

        /* Submit */
        .admin-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--orange) 0%, var(--orange-deep) 100%);
          color: #FFFDF9;
          border: 1px solid rgba(255,97,2,0.3);
          border-radius: 14px;
          padding: 17px;
          font-size: 15px;
          font-weight: 700;
          font-family: "Plus Jakarta Sans", sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 4px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 32px rgba(255,97,2,0.4), 0 0 0 1px rgba(255,97,2,0.12);
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }
        .admin-submit-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,97,2,0.1), transparent);
          transition: left 0.5s ease;
        }
        .admin-submit-btn:hover:not(:disabled)::before { left: 100%; }
        .admin-submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 20px 48px rgba(255,97,2,0.55), 0 0 0 1px rgba(255,97,2,0.25);
          border-color: rgba(255,97,2,0.5);
        }
        .admin-submit-btn:active:not(:disabled) { transform: scale(0.97); }
        .admin-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .admin-btn-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,253,249,0.25);
          border-top-color: #FFFDF9;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer */
        .admin-card-footer {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .admin-security-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: rgba(255,253,249,0.35);
          font-weight: 500;
        }
        .admin-security-badge svg { color: rgba(255,97,2,0.6); flex-shrink: 0; }
        .admin-back-link {
          font-size: 13px;
          color: rgba(255,253,249,0.4);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .admin-back-link:hover { color: var(--orange); }
      `}</style>
    </>
  );
}
