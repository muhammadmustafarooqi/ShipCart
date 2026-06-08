"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogoMark } from "@/components/BrandLogo";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  MapPin,
  ShieldCheck,
  Sparkles,
  Gift,
} from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { PAKISTANI_CITIES } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
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
      if (!res.ok) throw new Error(data.error || "Signup failed");
      toast.success("Account created! Please login.");
      router.push("/auth/login");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const fp = (name: string) => ({
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
  });

  return (
    <>
      <div className="signup-page">
        {/* ── MOBILE HERO (hidden on desktop) ── */}
        <div className="signup-mobile-hero">
          <div className="signup-mh-orb signup-mh-orb-1" aria-hidden />
          <div className="signup-mh-orb signup-mh-orb-2" aria-hidden />
          <div className="signup-mh-bar" aria-hidden />
          <div className="signup-mh-inner">
            <Link href="/" className="signup-mh-logo">
              <BrandLogoMark size={68} tone="elevated" decorative />
            </Link>
            <div className="signup-mh-text">
              <p className="signup-mh-eyebrow">ShipCart Store</p>
              <h1 className="signup-mh-title">
                Join the
                <br />
                <span className="signup-mh-gold">Family</span>
              </h1>
            </div>
            <div className="signup-mh-badges">
              {[
                { icon: <Gift size={14} />, label: "Welcome Offers" },
                { icon: <ShieldCheck size={14} />, label: "Secure" },
                { icon: <Sparkles size={14} />, label: "Fast Checkout" },
              ].map((b, i) => (
                <div key={i} className="signup-mh-badge">
                  <span className="signup-mh-badge-icon">{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP LEFT PANEL ── */}
        <div className="signup-left">
          <div className="signup-left-inner">
            <Link href="/" className="signup-logo-link">
              <BrandLogoMark size={72} tone="elevated" decorative />
            </Link>
            <div className="signup-left-text">
              <p className="signup-eyebrow">Join ShipCart Store</p>
              <h2 className="signup-headline">
                Start Your
                <br />
                <span className="signup-headline-gold">Premium Journey</span>
              </h2>
              <p className="signup-sub">
                Create your free account and unlock exclusive deals, faster
                checkouts, and order tracking.
              </p>
            </div>
            <div className="signup-benefits">
              {[
                {
                  icon: <Gift size={18} />,
                  title: "Welcome Offers",
                  desc: "Exclusive deals for new members",
                },
                {
                  icon: <ShieldCheck size={18} />,
                  title: "Secure & Private",
                  desc: "Your data is fully encrypted",
                },
                {
                  icon: <Sparkles size={18} />,
                  title: "Fast Checkout",
                  desc: "Save your info for faster orders",
                },
              ].map((b, i) => (
                <div key={i} className="signup-benefit">
                  <div className="signup-benefit-icon">{b.icon}</div>
                  <div>
                    <div className="signup-benefit-title">{b.title}</div>
                    <div className="signup-benefit-desc">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="signup-orb signup-orb-1" aria-hidden />
            <div className="signup-orb signup-orb-2" aria-hidden />
          </div>
        </div>

        {/* ── RIGHT PANEL — FORM ── */}
        <div className="signup-right">
          <div className="signup-form-wrap">
            <div className="signup-form-header">
              <div className="signup-form-tag">
                <Sparkles size={13} /> New Account
              </div>
              <h2 className="signup-form-title">Create Account</h2>
              <p className="signup-form-sub">
                Already a member?{" "}
                <Link href="/auth/login" className="signup-switch-link">
                  Sign in here
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="signup-form">
              {/* Row 1 */}
              <div className="signup-row">
                <div className={`sf ${focused === "name" ? "focused" : ""}`}>
                  <label className="sl">Full Name *</label>
                  <div className="si-wrap">
                    <User size={16} className="si-icon" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      {...fp("name")}
                      placeholder="Muhammad Ali"
                      required
                      className="si"
                    />
                  </div>
                </div>
                <div className={`sf ${focused === "phone" ? "focused" : ""}`}>
                  <label className="sl">Phone *</label>
                  <div className="si-wrap">
                    <Phone size={16} className="si-icon" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      {...fp("phone")}
                      placeholder="03001234567"
                      maxLength={11}
                      required
                      className="si"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className={`sf ${focused === "email" ? "focused" : ""}`}>
                <label className="sl">Email Address *</label>
                <div className="si-wrap">
                  <Mail size={16} className="si-icon" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    {...fp("email")}
                    placeholder="you@example.com"
                    required
                    className="si"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="signup-row">
                <div
                  className={`sf ${focused === "password" ? "focused" : ""}`}
                >
                  <label className="sl">Password *</label>
                  <div className="si-wrap">
                    <Lock size={16} className="si-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      {...fp("password")}
                      placeholder="Min 6 chars"
                      required
                      minLength={6}
                      className="si"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="si-eye"
                      tabIndex={-1}
                      aria-label="Toggle"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div className={`sf ${focused === "confirm" ? "focused" : ""}`}>
                  <label className="sl">Confirm Password *</label>
                  <div className="si-wrap">
                    <Lock size={16} className="si-icon" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      {...fp("confirm")}
                      placeholder="Repeat password"
                      required
                      minLength={6}
                      className="si"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="si-eye"
                      tabIndex={-1}
                      aria-label="Toggle"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* City */}
              <div className={`sf ${focused === "city" ? "focused" : ""}`}>
                <label className="sl">City (Optional)</label>
                <div className="si-wrap">
                  <MapPin size={16} className="si-icon" />
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    {...fp("city")}
                    className="si si-select"
                  >
                    <option value="">Select your city</option>
                    {PAKISTANI_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className={`sf ${focused === "address" ? "focused" : ""}`}>
                <label className="sl">Delivery Address (Optional)</label>
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  {...fp("address")}
                  placeholder="House/Flat No, Street, Area — saves time at checkout"
                  rows={2}
                  className="si-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="signup-submit-btn"
              >
                {loading ? (
                  <span className="s-spinner" />
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Google signup — temporarily disabled
            <div className="s-divider"><span>or sign up with</span></div>
            <button type="button" onClick={() => signIn("google", { callbackUrl: "/" })} className="s-google-btn">Google</button>
            */}

            <div className="s-back-link">
              <Link href="/">← Back to Store</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ═══════════════════════════════════════
           BASE
        ═══════════════════════════════════════ */
        .signup-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: "Plus Jakarta Sans", sans-serif;
          background: #FFFDF9;
        }
        @media (min-width: 1024px) { .signup-page { flex-direction: row; } }

        /* ═══════════════════════════════════════
           MOBILE HERO
        ═══════════════════════════════════════ */
        .signup-mobile-hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #3A0818 0%, #6B1E2E 55%, #8B3045 100%);
          padding: 38px 24px 32px;
          flex-shrink: 0;
        }
        @media (min-width: 1024px) { .signup-mobile-hero { display: none; } }

        .signup-mh-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #4A1020, #C9A84C 40%, #e8c96e 50%, #C9A84C 60%, #4A1020);
          background-size: 200%; animation: mhBar 4s ease infinite;
        }
        @keyframes mhBar { 0%,100% { background-position: 0%; } 50% { background-position: 100%; } }

        .signup-mh-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(32px); }
        .signup-mh-orb-1 {
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%);
          top: -60px; right: -50px; animation: mhF1 7s ease-in-out infinite;
        }
        .signup-mh-orb-2 {
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(255,253,249,0.07) 0%, transparent 70%);
          bottom: -40px; left: -30px; animation: mhF2 9s ease-in-out infinite;
        }
        @keyframes mhF1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes mhF2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }

        .signup-mh-inner {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 18px; width: 100%;
        }
        .signup-mh-logo { flex-shrink: 0; display: inline-flex; transition: transform 0.25s ease; }
        .signup-mh-logo:hover { transform: scale(1.04); }

        .signup-mh-text { flex: 1; min-width: 0; }
        .signup-mh-eyebrow {
          font-size: 10px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: #C9A84C;
          font-family: "Outfit", sans-serif; margin-bottom: 4px;
        }
        .signup-mh-title {
          font-family: "Outfit", sans-serif; font-size: 1.9rem;
          font-weight: 900; color: #FFFDF9; line-height: 1.1; letter-spacing: -0.03em;
        }
        .signup-mh-gold {
          background: linear-gradient(90deg, #C9A84C, #e8c96e, #C9A84C);
          background-size: 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: shimmer 3s ease infinite;
        }
        @keyframes shimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }

        .signup-mh-badges {
          display: none;
          flex-direction: column; gap: 6px;
        }
        @media (min-width: 480px) { .signup-mh-badges { display: flex; } }
        .signup-mh-badge {
          display: flex; align-items: center; gap: 7px;
          font-size: 11px; color: rgba(255,253,249,0.82);
          font-weight: 600; white-space: nowrap;
          background: rgba(255,253,249,0.07); border: 1px solid rgba(201,168,76,0.2);
          border-radius: 100px; padding: 5px 12px;
        }
        .signup-mh-badge-icon { color: #C9A84C; display: flex; align-items: center; }

        /* ═══════════════════════════════════════
           DESKTOP LEFT
        ═══════════════════════════════════════ */
        .signup-left {
          display: none; position: relative; overflow: hidden;
          background: linear-gradient(145deg, #4A1020 0%, #6B1E2E 50%, #8B3045 100%);
          flex: 1;
        }
        @media (min-width: 1024px) { .signup-left { display: flex; } }

        .signup-left-inner {
          position: relative; z-index: 1; display: flex; flex-direction: column;
          justify-content: center; padding: 64px; height: 100%; gap: 36px;
        }
        .signup-logo-link { display: inline-flex; transition: transform 0.25s ease; }
        .signup-logo-link:hover { transform: scale(1.04); }

        .signup-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #C9A84C; font-family: "Outfit", sans-serif; margin-bottom: 12px; }
        .signup-headline { font-size: clamp(2.2rem, 3vw, 3rem); font-weight: 900; color: #FFFDF9; font-family: "Outfit", sans-serif; line-height: 1.1; letter-spacing: -0.03em; }
        .signup-headline-gold { background: linear-gradient(90deg, #C9A84C, #e8c96e, #C9A84C); background-size: 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 3s ease infinite; }
        .signup-sub { font-size: 14px; color: rgba(255,253,249,0.72); line-height: 1.7; max-width: 360px; font-weight: 500; margin-top: 14px; }

        .signup-benefits { display: flex; flex-direction: column; gap: 18px; }
        .signup-benefit { display: flex; align-items: center; gap: 16px; }
        .signup-benefit-icon { width: 40px; height: 40px; border-radius: 12px; background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3); display: flex; align-items: center; justify-content: center; color: #C9A84C; flex-shrink: 0; }
        .signup-benefit-title { font-size: 14px; font-weight: 700; color: #FFFDF9; font-family: "Outfit", sans-serif; }
        .signup-benefit-desc { font-size: 12px; color: rgba(255,253,249,0.6); margin-top: 2px; }

        .signup-orb { position: absolute; border-radius: 50%; pointer-events: none; }
        .signup-orb-1 { width: 420px; height: 420px; background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%); top: -100px; right: -100px; animation: fl1 8s ease-in-out infinite; }
        .signup-orb-2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,253,249,0.06) 0%, transparent 70%); bottom: -60px; left: -60px; animation: fl2 10s ease-in-out infinite; }
        @keyframes fl1 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.04)} }
        @keyframes fl2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(16px) scale(0.97)} }

        /* ═══════════════════════════════════════
           RIGHT — FORM
        ═══════════════════════════════════════ */
        .signup-right {
          flex: 1; display: flex; align-items: flex-start;
          justify-content: center; background: #FFFDF9; padding: 36px 24px 48px;
          overflow-y: auto;
        }
        @media (min-width: 1024px) { .signup-right { max-width: 560px; align-items: center; padding: 48px 40px; } }

        .signup-form-wrap {
          width: 100%; max-width: 480px;
          animation: slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .signup-form-header { margin-bottom: 28px; }
        .signup-form-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #6B1E2E; background: rgba(107,30,46,0.08); padding: 6px 14px; border-radius: 100px; margin-bottom: 12px; font-family: "Outfit", sans-serif; }
        .signup-form-title { font-family: "Outfit", sans-serif; font-size: 2rem; font-weight: 900; color: #2A1518; letter-spacing: -0.03em; margin-bottom: 8px; line-height: 1; }
        .signup-form-sub { font-size: 14px; color: #9A8878; font-weight: 500; }
        .signup-switch-link { color: #6B1E2E; font-weight: 700; text-decoration: none; border-bottom: 1px solid rgba(107,30,46,0.3); transition: border-color 0.2s; }
        .signup-switch-link:hover { border-color: #6B1E2E; }

        /* form fields */
        .signup-form { display: flex; flex-direction: column; gap: 15px; }
        .signup-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 520px) { .signup-row { grid-template-columns: 1fr; } }

        .sf { display: flex; flex-direction: column; gap: 7px; }
        .sl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #2A1518; font-family: "Outfit", sans-serif; transition: color 0.2s; }
        .sf.focused .sl { color: #6B1E2E; }

        .si-wrap { position: relative; display: flex; align-items: center; }
        .si-icon { position: absolute; left: 14px; color: #9A8878; pointer-events: none; transition: color 0.2s; z-index: 1; }
        .sf.focused .si-icon { color: #6B1E2E; }

        .si {
          width: 100%; background: #FAF3E8; border: 2px solid #E8D8BC;
          border-radius: 12px; padding: 13px 14px 13px 40px;
          font-size: 14px; font-family: "Plus Jakarta Sans", sans-serif;
          color: #2A1518; outline: none;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
          font-weight: 500;
        }
        .si::placeholder { color: #9A8878; }
        .si:focus { border-color: #6B1E2E; background: #FFFDF9; box-shadow: 0 0 0 4px rgba(107,30,46,0.1); }
        .si-select { cursor: pointer; appearance: none; }

        .si-eye { position: absolute; right: 12px; background: none; border: none; cursor: pointer; color: #9A8878; display: flex; align-items: center; padding: 4px; border-radius: 6px; transition: color 0.2s; }
        .si-eye:hover { color: #6B1E2E; }

        .si-textarea {
          width: 100%; background: #FAF3E8; border: 2px solid #E8D8BC;
          border-radius: 12px; padding: 13px 14px; font-size: 14px;
          font-family: "Plus Jakarta Sans", sans-serif; color: #2A1518; outline: none;
          resize: vertical; transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
          font-weight: 500; line-height: 1.5;
        }
        .si-textarea::placeholder { color: #9A8878; }
        .si-textarea:focus { border-color: #6B1E2E; background: #FFFDF9; box-shadow: 0 0 0 4px rgba(107,30,46,0.1); }

        .signup-submit-btn {
          width: 100%; background: linear-gradient(135deg, #6B1E2E 0%, #4A1020 100%);
          color: #FFFDF9; border: none; border-radius: 14px; padding: 16px;
          font-size: 15px; font-weight: 700; font-family: "Plus Jakarta Sans", sans-serif;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-top: 6px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 28px rgba(107,30,46,0.32); letter-spacing: 0.3px;
          position: relative; overflow: hidden;
        }
        .signup-submit-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(201,168,76,0.15) 0%,transparent 60%); opacity:0; transition:opacity 0.3s; }
        .signup-submit-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(107,30,46,0.42); }
        .signup-submit-btn:hover:not(:disabled)::after { opacity: 1; }
        .signup-submit-btn:active:not(:disabled) { transform: scale(0.97); }
        .signup-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .s-spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,253,249,0.3); border-top-color: #FFFDF9; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .s-back-link { text-align: center; margin-top: 24px; }
        .s-back-link a { font-size: 13px; color: #9A8878; text-decoration: none; font-weight: 600; transition: color 0.2s; }
        .s-back-link a:hover { color: #6B1E2E; }
      `}</style>
    </>
  );
}
