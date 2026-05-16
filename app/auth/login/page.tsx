"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogoMark } from "@/components/BrandLogo";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, ShieldCheck, Truck, Star } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) throw new Error("Invalid credentials");
      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: <Truck size={16} />, text: "Free delivery above Rs. 1500" },
    { icon: <ShieldCheck size={16} />, text: "100% original products" },
    { icon: <Star size={16} />, text: "Exclusive member deals" },
  ];

  return (
    <>
      <div className="auth-page">

        {/* ── MOBILE HERO (hidden on desktop) ── */}
        <div className="auth-mobile-hero" aria-hidden="false">
          <div className="auth-mh-orb auth-mh-orb-1" aria-hidden />
          <div className="auth-mh-orb auth-mh-orb-2" aria-hidden />
          <div className="auth-mh-bar" aria-hidden />
          <div className="auth-mh-inner">
            <Link href="/" className="auth-mh-logo">
              <BrandLogoMark size={68} tone="elevated" decorative />
            </Link>
            <div className="auth-mh-text">
              <p className="auth-mh-eyebrow">AllInOne Store</p>
              <h1 className="auth-mh-title">
                Welcome<br />
                <span className="auth-mh-gold">Back</span>
              </h1>
            </div>
            <div className="auth-mh-perks">
              {perks.map((p, i) => (
                <div key={i} className="auth-mh-perk">
                  <span className="auth-mh-perk-icon">{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP LEFT PANEL (hidden on mobile) ── */}
        <div className="auth-left">
          <div className="auth-left-inner">
            <Link href="/" className="auth-logo-link">
              <BrandLogoMark size={72} tone="elevated" decorative />
            </Link>
            <div className="auth-left-text">
              <p className="auth-left-eyebrow">Welcome Back</p>
              <h2 className="auth-left-headline">
                Your Premium<br />
                <span className="auth-headline-gold">Store Awaits</span>
              </h2>
              <p className="auth-left-sub">
                Sign in to access exclusive deals, track your orders, and enjoy a seamless shopping experience.
              </p>
            </div>
            <div className="auth-perks">
              {[
                { icon: <Truck size={18} />, text: "Free delivery on orders above Rs. 1500" },
                { icon: <ShieldCheck size={18} />, text: "100% original, quality-guaranteed products" },
                { icon: <Star size={18} />, text: "Exclusive member deals & early access" },
              ].map((p, i) => (
                <div key={i} className="auth-perk">
                  <div className="auth-perk-icon">{p.icon}</div>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
            <div className="auth-orb auth-orb-1" aria-hidden />
            <div className="auth-orb auth-orb-2" aria-hidden />
            <div className="auth-orb auth-orb-3" aria-hidden />
          </div>
        </div>

        {/* ── RIGHT PANEL — FORM ── */}
        <div className="auth-right">
          <div className="auth-form-wrap">

            <div className="auth-form-header">
              <div className="auth-form-tag">
                <Sparkles size={13} />
                Member Login
              </div>
              <h2 className="auth-form-title">Sign In</h2>
              <p className="auth-form-sub">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="auth-switch-link">Create one free</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className={`auth-field ${focused === "email" ? "focused" : ""}`}>
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={17} className="auth-input-icon" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="you@example.com"
                    required
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className={`auth-field ${focused === "password" ? "focused" : ""}`}>
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <Lock size={17} className="auth-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    required
                    className="auth-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-eye-btn"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? <span className="auth-btn-spinner" /> : <>Sign In <ArrowRight size={18} /></>}
              </button>
            </form>

            {/* Google login — temporarily disabled
            <div className="auth-divider"><span>or continue with</span></div>
            <button type="button" onClick={() => signIn("google", { callbackUrl: "/" })} className="auth-google-btn">
              Google
            </button>
            */}

            <div className="auth-back-link">
              <Link href="/">← Back to Store</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ═══════════════════════════════════════
           BASE
        ═══════════════════════════════════════ */
        .auth-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: "Plus Jakarta Sans", sans-serif;
          background: #FFFDF9;
        }
        @media (min-width: 1024px) {
          .auth-page { flex-direction: row; }
        }

        /* ═══════════════════════════════════════
           MOBILE HERO (top banner — mobile only)
        ═══════════════════════════════════════ */
        .auth-mobile-hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #3A0818 0%, #6B1E2E 55%, #8B3045 100%);
          padding: 40px 28px 36px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        @media (min-width: 1024px) {
          .auth-mobile-hero { display: none; }
        }

        /* top gold shimmer bar */
        .auth-mh-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #4A1020, #C9A84C 40%, #e8c96e 50%, #C9A84C 60%, #4A1020);
          background-size: 200%;
          animation: barShimmer 4s ease infinite;
        }
        @keyframes barShimmer {
          0%,100% { background-position: 0%; }
          50% { background-position: 100%; }
        }

        /* decorative orbs */
        .auth-mh-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(36px);
        }
        .auth-mh-orb-1 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%);
          top: -80px; right: -60px;
          animation: mhFloat1 7s ease-in-out infinite;
        }
        .auth-mh-orb-2 {
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(255,253,249,0.08) 0%, transparent 70%);
          bottom: -50px; left: -40px;
          animation: mhFloat2 9s ease-in-out infinite;
        }
        @keyframes mhFloat1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        @keyframes mhFloat2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(12px); } }

        .auth-mh-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 20px;
          width: 100%;
        }

        .auth-mh-logo {
          flex-shrink: 0;
          display: inline-flex;
          transition: transform 0.25s ease;
        }
        .auth-mh-logo:hover { transform: scale(1.04); }

        .auth-mh-text { flex: 1; min-width: 0; }
        .auth-mh-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #C9A84C;
          font-family: "Outfit", sans-serif;
          margin-bottom: 4px;
          opacity: 0.9;
        }
        .auth-mh-title {
          font-family: "Outfit", sans-serif;
          font-size: 2rem;
          font-weight: 900;
          color: #FFFDF9;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 0;
        }
        .auth-mh-gold {
          background: linear-gradient(90deg, #C9A84C, #e8c96e, #C9A84C);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease infinite;
        }
        @keyframes shimmer { 0%,100% { background-position: 0%; } 50% { background-position: 100%; } }

        /* perks row — below on very small screens */
        .auth-mh-perks {
          display: none;
        }
        @media (min-width: 480px) {
          .auth-mh-inner { flex-direction: row; align-items: center; }
          .auth-mh-perks {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-left: auto;
            flex-shrink: 0;
          }
        }
        .auth-mh-perk {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: rgba(255,253,249,0.8);
          font-weight: 600;
          white-space: nowrap;
        }
        .auth-mh-perk-icon {
          color: #C9A84C;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        /* ═══════════════════════════════════════
           DESKTOP LEFT PANEL
        ═══════════════════════════════════════ */
        .auth-left {
          display: none;
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #4A1020 0%, #6B1E2E 45%, #8B3045 100%);
          flex: 1;
        }
        @media (min-width: 1024px) { .auth-left { display: flex; } }

        .auth-left-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px;
          height: 100%;
          gap: 40px;
        }

        .auth-logo-link { display: inline-flex; transition: transform 0.25s ease; }
        .auth-logo-link:hover { transform: scale(1.04); }

        .auth-left-eyebrow {
          font-size: 11px; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; color: #C9A84C;
          font-family: "Outfit", sans-serif; margin-bottom: 12px;
        }
        .auth-left-headline {
          font-size: clamp(2.4rem, 3.5vw, 3.2rem); font-weight: 900;
          color: #FFFDF9; font-family: "Outfit", sans-serif;
          line-height: 1.1; letter-spacing: -0.03em;
        }
        .auth-headline-gold {
          background: linear-gradient(90deg, #C9A84C, #e8c96e, #C9A84C);
          background-size: 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: shimmer 3s ease infinite;
        }
        .auth-left-sub {
          font-size: 15px; color: rgba(255,253,249,0.72); line-height: 1.7;
          max-width: 380px; font-weight: 500; margin-top: 16px;
        }
        .auth-perks { display: flex; flex-direction: column; gap: 16px; }
        .auth-perk {
          display: flex; align-items: center; gap: 14px;
          font-size: 14px; color: rgba(255,253,249,0.85); font-weight: 500;
        }
        .auth-perk-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(201,168,76,0.18); border: 1px solid rgba(201,168,76,0.35);
          display: flex; align-items: center; justify-content: center;
          color: #C9A84C; flex-shrink: 0;
        }
        .auth-orb { position: absolute; border-radius: 50%; pointer-events: none; }
        .auth-orb-1 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%);
          top: -120px; right: -120px; animation: float1 8s ease-in-out infinite;
        }
        .auth-orb-2 {
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(255,253,249,0.06) 0%, transparent 70%);
          bottom: -80px; left: -80px; animation: float2 10s ease-in-out infinite;
        }
        .auth-orb-3 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
          bottom: 40%; right: 20%; animation: float1 6s ease-in-out infinite reverse;
        }
        @keyframes float1 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-24px) scale(1.04); } }
        @keyframes float2 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(20px) scale(0.97); } }

        /* ═══════════════════════════════════════
           RIGHT PANEL — FORM
        ═══════════════════════════════════════ */
        .auth-right {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: #FFFDF9;
          padding: 40px 24px 48px;
        }
        @media (min-width: 1024px) {
          .auth-right {
            max-width: 480px;
            align-items: center;
            padding: 48px 40px;
          }
        }

        .auth-form-wrap {
          width: 100%;
          max-width: 420px;
          animation: slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* form header */
        .auth-form-header { margin-bottom: 32px; }
        .auth-form-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #6B1E2E;
          background: rgba(107,30,46,0.08);
          padding: 6px 14px; border-radius: 100px;
          margin-bottom: 14px; font-family: "Outfit", sans-serif;
        }
        .auth-form-title {
          font-family: "Outfit", sans-serif; font-size: 2.2rem;
          font-weight: 900; color: #2A1518;
          letter-spacing: -0.03em; margin-bottom: 10px; line-height: 1;
        }
        .auth-form-sub { font-size: 14px; color: #9A8878; font-weight: 500; }
        .auth-switch-link {
          color: #6B1E2E; font-weight: 700; text-decoration: none;
          border-bottom: 1px solid rgba(107,30,46,0.3); transition: border-color 0.2s;
        }
        .auth-switch-link:hover { border-color: #6B1E2E; }

        /* fields */
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .auth-field { display: flex; flex-direction: column; gap: 8px; }
        .auth-label {
          font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          color: #2A1518; font-family: "Outfit", sans-serif; transition: color 0.2s;
        }
        .auth-field.focused .auth-label { color: #6B1E2E; }

        .auth-input-wrap { position: relative; display: flex; align-items: center; }
        .auth-input-icon {
          position: absolute; left: 16px; color: #9A8878;
          pointer-events: none; transition: color 0.2s; z-index: 1;
        }
        .auth-field.focused .auth-input-icon { color: #6B1E2E; }

        .auth-input {
          width: 100%; background: #FAF3E8; border: 2px solid #E8D8BC;
          border-radius: 14px; padding: 15px 16px 15px 46px;
          font-size: 15px; font-family: "Plus Jakarta Sans", sans-serif;
          color: #2A1518; outline: none;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
          font-weight: 500;
        }
        .auth-input::placeholder { color: #9A8878; }
        .auth-input:focus {
          border-color: #6B1E2E; background: #FFFDF9;
          box-shadow: 0 0 0 4px rgba(107,30,46,0.1);
        }

        .auth-eye-btn {
          position: absolute; right: 14px; background: none; border: none;
          cursor: pointer; color: #9A8878; display: flex; align-items: center;
          padding: 4px; border-radius: 6px; transition: color 0.2s;
        }
        .auth-eye-btn:hover { color: #6B1E2E; }

        /* submit */
        .auth-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #6B1E2E 0%, #4A1020 100%);
          color: #FFFDF9; border: none; border-radius: 14px;
          padding: 17px; font-size: 15px; font-weight: 700;
          font-family: "Plus Jakarta Sans", sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-top: 8px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 28px rgba(107,30,46,0.32);
          letter-spacing: 0.3px; position: relative; overflow: hidden;
        }
        .auth-submit-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.15) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .auth-submit-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(107,30,46,0.42); }
        .auth-submit-btn:hover:not(:disabled)::after { opacity: 1; }
        .auth-submit-btn:active:not(:disabled) { transform: scale(0.97); }
        .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .auth-btn-spinner {
          width: 20px; height: 20px;
          border: 2.5px solid rgba(255,253,249,0.3); border-top-color: #FFFDF9;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-back-link { text-align: center; margin-top: 28px; }
        .auth-back-link a {
          font-size: 13px; color: #9A8878; text-decoration: none;
          font-weight: 600; transition: color 0.2s;
        }
        .auth-back-link a:hover { color: #6B1E2E; }
      `}</style>
    </>
  );
}
