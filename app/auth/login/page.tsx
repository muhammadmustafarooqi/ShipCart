"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogoMark } from "@/components/BrandLogo";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, ShieldCheck, Truck, Star, User, Phone, MapPin, Gift } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { PAKISTANI_CITIES } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    address: "",
  });

  const handleSignupSubmit = async (e: React.FormEvent) => {
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
      if (!res.ok) throw new Error(data.error || "Signup failed");
      toast.success("Account created successfully!");
      
      // Auto login after sign up
      const loginRes = await signIn("credentials", {
        email: form.email.toLowerCase().trim(),
        password: form.password,
        redirect: false
      });

      if (loginRes?.error) {
        throw new Error(loginRes.error || "Authentication failed after sign up");
      }

      toast.success("Logged in successfully!");
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginTab) {
      return handleSignupSubmit(e);
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email.toLowerCase().trim(),
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

  const perks = isLoginTab ? [
    { icon: <Truck size={18} />, text: "Free delivery on orders above Rs. 1500" },
    { icon: <ShieldCheck size={18} />, text: "100% original, quality-guaranteed products" },
    { icon: <Star size={18} />, text: "Exclusive member deals & early access" },
  ] : [
    { icon: <Gift size={18} />, text: "Welcome Offers — exclusive deals for new members" },
    { icon: <ShieldCheck size={18} />, text: "Secure & Private — your data is fully encrypted" },
    { icon: <Sparkles size={18} />, text: "Fast Checkout — save your info for faster orders" },
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
              <p className="auth-mh-eyebrow">ShipCart</p>
              <h1 className="auth-mh-title">
                {isLoginTab ? (
                  <>Welcome<br /><span className="auth-mh-gold">Back</span></>
                ) : (
                  <>Join the<br /><span className="auth-mh-gold">Family</span></>
                )}
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
              <p className="auth-left-eyebrow">{isLoginTab ? "Welcome Back" : "Join ShipCart"}</p>
              <h2 className="auth-left-headline">
                {isLoginTab ? (
                  <>Your Premium<br /><span className="auth-headline-gold">Store Awaits</span></>
                ) : (
                  <>Start Your<br /><span className="auth-headline-gold">Premium Journey</span></>
                )}
              </h2>
              <p className="auth-left-sub">
                {isLoginTab 
                  ? "Sign in to access exclusive deals, track your orders, and enjoy a seamless shopping experience."
                  : "Create your free account and unlock exclusive deals, faster checkouts, and order tracking."}
              </p>
            </div>
            <div className="auth-perks">
              {perks.map((p, i) => (
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

            <div className="auth-form-header" style={{ marginBottom: "20px" }}>
              <div className="auth-form-tag">
                <Sparkles size={13} />
                {isLoginTab ? "Member Login" : "New Account"}
              </div>
              <h2 className="auth-form-title">{isLoginTab ? "Sign In" : "Create Account"}</h2>
            </div>

            {/* Dynamic Tabs */}
            <div className="auth-tabs">
              <button 
                type="button"
                onClick={() => setIsLoginTab(true)} 
                className={`auth-tab ${isLoginTab ? "active" : ""}`}
              >
                Log In
              </button>
              <button 
                type="button"
                onClick={() => setIsLoginTab(false)} 
                className={`auth-tab ${!isLoginTab ? "active" : ""}`}
              >
                Sign Up
              </button>
            </div>

            {/* Google Sign-in Option */}
            <button 
              type="button" 
              onClick={() => signIn("google", { callbackUrl: "/" })} 
              className="google-sign-in-btn"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: "10px", verticalAlign: "middle" }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="auth-or-separator">
              <span>OR</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {isLoginTab ? (
                // LOG IN FORM
                <>
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
                </>
              ) : (
                // SIGN UP FORM
                <>
                  {/* Row 1 */}
                  <div className="auth-row">
                    <div className={`auth-field ${focused === "name" ? "focused" : ""}`}>
                      <label className="auth-label">Full Name *</label>
                      <div className="auth-input-wrap">
                        <User size={16} className="auth-input-icon" />
                        <input 
                          type="text" 
                          value={form.name} 
                          onChange={(e) => setForm({ ...form, name: e.target.value })} 
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused(null)}
                          placeholder="Muhammad Ali" 
                          required 
                          className="auth-input" 
                        />
                      </div>
                    </div>
                    <div className={`auth-field ${focused === "phone" ? "focused" : ""}`}>
                      <label className="auth-label">Phone *</label>
                      <div className="auth-input-wrap">
                        <Phone size={16} className="auth-input-icon" />
                        <input 
                          type="tel" 
                          value={form.phone} 
                          onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                          onFocus={() => setFocused("phone")}
                          onBlur={() => setFocused(null)}
                          placeholder="03001234567" 
                          maxLength={11} 
                          required 
                          className="auth-input" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className={`auth-field ${focused === "email" ? "focused" : ""}`}>
                    <label className="auth-label">Email Address *</label>
                    <div className="auth-input-wrap">
                      <Mail size={16} className="auth-input-icon" />
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

                  {/* Row 2 */}
                  <div className="auth-row">
                    <div className={`auth-field ${focused === "password" ? "focused" : ""}`}>
                      <label className="auth-label">Password *</label>
                      <div className="auth-input-wrap">
                        <Lock size={16} className="auth-input-icon" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={form.password} 
                          onChange={(e) => setForm({ ...form, password: e.target.value })} 
                          onFocus={() => setFocused("password")}
                          onBlur={() => setFocused(null)}
                          placeholder="Min 6 chars" 
                          required 
                          minLength={6} 
                          className="auth-input" 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-eye-btn" tabIndex={-1} aria-label="Toggle">
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div className={`auth-field ${focused === "confirm" ? "focused" : ""}`}>
                      <label className="auth-label">Confirm Password *</label>
                      <div className="auth-input-wrap">
                        <Lock size={16} className="auth-input-icon" />
                        <input 
                          type={showConfirm ? "text" : "password"} 
                          value={form.confirmPassword} 
                          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
                          onFocus={() => setFocused("confirm")}
                          onBlur={() => setFocused(null)}
                          placeholder="Repeat password" 
                          required 
                          minLength={6} 
                          className="auth-input" 
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="auth-eye-btn" tabIndex={-1} aria-label="Toggle">
                          {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* City */}
                  <div className={`auth-field ${focused === "city" ? "focused" : ""}`}>
                    <label className="auth-label">City (Optional)</label>
                    <div className="auth-input-wrap">
                      <MapPin size={16} className="auth-input-icon" />
                      <select 
                        value={form.city} 
                        onChange={(e) => setForm({ ...form, city: e.target.value })} 
                        onFocus={() => setFocused("city")}
                        onBlur={() => setFocused(null)}
                        className="auth-input auth-select"
                      >
                        <option value="">Select your city</option>
                        {PAKISTANI_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div className={`auth-field ${focused === "address" ? "focused" : ""}`}>
                    <label className="auth-label">Delivery Address (Optional)</label>
                    <textarea 
                      value={form.address} 
                      onChange={(e) => setForm({ ...form, address: e.target.value })} 
                      onFocus={() => setFocused("address")}
                      onBlur={() => setFocused(null)}
                      placeholder="House/Flat No, Street, Area — saves time at checkout" 
                      rows={2} 
                      className="auth-textarea" 
                    />
                  </div>
                </>
              )}

              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? (
                  <span className="auth-btn-spinner" />
                ) : isLoginTab ? (
                  <>Sign In <ArrowRight size={18} /></>
                ) : (
                  <>Create Account <ArrowRight size={18} /></>
                )}
              </button>
            </form>

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
          overflow-y: auto;
        }
        @media (min-width: 1024px) {
          .auth-right {
            max-width: 560px;
            align-items: center;
            padding: 48px 40px;
          }
        }

        .auth-form-wrap {
          width: 100%;
          max-width: 460px;
          animation: slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* form header */
        .auth-form-header { margin-bottom: 24px; }
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

        /* Tabs Switch */
        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #FAF3E8;
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 24px;
          border: 2px solid #E8D8BC;
        }
        .auth-tab {
          border: none;
          background: none;
          padding: 12px;
          font-family: "Outfit", sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #9A8878;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.2s ease;
          text-align: center;
        }
        .auth-tab.active {
          background: #6B1E2E;
          color: #FFFDF9;
          box-shadow: 0 4px 12px rgba(107, 30, 46, 0.15);
        }
        .auth-tab:hover:not(.active) {
          color: #6B1E2E;
        }

        /* Google button & separator styling */
        .google-sign-in-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #ffffff;
          border: 2px solid #E8D8BC;
          border-radius: 14px;
          padding: 14px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #2A1518;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          margin-bottom: 8px;
        }
        .google-sign-in-btn:hover {
          background: #fafafa;
          border-color: #6B1E2E;
          transform: translateY(-1px);
        }
        .auth-or-separator {
          display: flex;
          align-items: center;
          text-align: center;
          color: #9a8878;
          font-size: 12px;
          font-weight: 700;
          margin: 18px 0;
        }
        .auth-or-separator::before,
        .auth-or-separator::after {
          content: '';
          flex: 1;
          border-bottom: 2px solid #e8d8bc;
        }
        .auth-or-separator:not(:empty)::before {
          margin-right: .5em;
        }
        .auth-or-separator:not(:empty)::after {
          margin-left: .5em;
        }

        /* Signup Specific Fields */
        .auth-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 520px) {
          .auth-row {
            grid-template-columns: 1fr;
          }
        }
        .auth-select {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239A8878' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
          padding-right: 40px !important;
        }
        .auth-textarea {
          width: 100%;
          background: #FAF3E8;
          border: 2px solid #E8D8BC;
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 15px;
          font-family: "Plus Jakarta Sans", sans-serif;
          color: #2A1518;
          outline: none;
          resize: vertical;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
          font-weight: 500;
          line-height: 1.5;
        }
        .auth-textarea:focus {
          border-color: #6B1E2E;
          background: #FFFDF9;
          box-shadow: 0 0 0 4px rgba(107,30,46,0.1);
        }

        /* fields */
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
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
          z-index: 2;
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

