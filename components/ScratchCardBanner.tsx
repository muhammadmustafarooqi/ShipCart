"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { 
  Sparkles, Lock, User, Phone, Mail, Eye, EyeOff, Gift
} from "lucide-react";
import toast from "react-hot-toast";

const SPIN_OPTIONS = [
  "10% OFF", "5% OFF", "Free Delivery", "Rs.150 Voucher", 
  "Buy 2 Get 10% OFF", "Buy 3 Get 15% OFF", "Surprise Gift", "Buy 4 Get 1 Free"
];

export default function ScratchCardBanner() {
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";
  const [hasScratched, setHasScratched] = useState(false);
  const [scratchResult, setScratchResult] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Auth states
  const [isLoginTab, setIsLoginTab] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authForm, setAuthForm] = useState({
    name: "", email: "", phone: "", password: ""
  });

  // Flow steps: "visitor" | "signup" | "otp" | "ready" | "scratching" | "winner"
  const [flowStep, setFlowStep] = useState<"visitor" | "signup" | "otp" | "ready" | "scratching" | "winner">("visitor");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSentCode, setOtpSentCode] = useState("");
  const [otpInputs, setOtpInputs] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(25);
  const [timerActive, setTimerActive] = useState(false);
  const [userCouponCode, setUserCouponCode] = useState("");
  const [isApiFetching, setIsApiFetching] = useState(false);

  // Scratch Canvas states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && countdown > 0) {
      interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, countdown]);

  // Fetch status on session change
  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/user/profile?t=${Date.now()}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (data?.user?.hasSpun) {
            setHasScratched(true);
            setScratchResult(data.user.spinResult);
            setUserCouponCode(data.user.couponCode || "");
            setFlowStep("winner");
          } else {
            setFlowStep("ready");
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
      setFlowStep("visitor");
    }
  }, [session, status]);

  // Init canvas when entering "scratching" step
  useEffect(() => {
    if (flowStep === "scratching" && canvasRef.current) {
      initCanvas();
    }
  }, [flowStep]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Set real size based on container width/height
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    } else {
      canvas.width = 300;
      canvas.height = 400;
    }

    // Draw solid overlay
    ctx.fillStyle = "#102857";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add pattern or text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch to Reveal!", canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.fillStyle = "#FF6102";
    ctx.font = "bold 16px Outfit, sans-serif";
    ctx.fillText("Win Discounts & Gifts", canvas.width / 2, canvas.height / 2 + 20);

    // Prepare for erasing
    ctx.globalCompositeOperation = "destination-out";
  };

  const getPointerPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const scratchMove = (e: any) => {
    if (!isScratching) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    if (e.cancelable) {
      e.preventDefault(); // prevent scroll on touch
    }

    const { x, y } = getPointerPos(e);
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fill();
  };

  const scratchStart = (e: any) => {
    setIsScratching(true);
    scratchMove(e);
  };

  const scratchEnd = () => {
    setIsScratching(false);
    checkScratchProgress();
  };

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    // Check every 4th byte (alpha channel) in steps of 32 for performance
    for (let i = 3; i < pixels.length; i += 4 * 16) {
      if (pixels[i] < 50) {
        transparentPixels++;
      }
    }
    
    const totalPixelsChecked = pixels.length / (4 * 16);
    const percent = (transparentPixels / totalPixelsChecked) * 100;
    setScratchedPercent(percent);

    if (percent > 45) { // Threshold 45-50%
      handleScratchComplete();
    }
  };

  const handleScratchComplete = () => {
    // Canvas will fade out via CSS because flowStep becomes 'winner'
    setFlowStep("winner");
    runConfetti();
    toast.success(`Congratulations! You won: ${scratchResult}`, { duration: 5000 });
  };

  // Auth Methods (Same as before)
  const handleGoogleSignIn = () => signIn("google");

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setAuthLoading(true);
    try {
      const res = await fetch("/api/phone-otp/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send verification code");

      setOtpSentCode(data.otp);
      setCountdown(25);
      setTimerActive(true);
      setFlowStep("otp");
      toast.success(`Code sent! Simulating SMS...`);
      setTimeout(() => {
        toast.success(`💬 SMS Gateway Simulator: Your verification code is: ${data.otp}`, { duration: 15000 });
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const typedCode = otpInputs.join("");
    if (typedCode.length < 4) return toast.error("Please enter the complete 4-digit code");
    if (typedCode !== otpSentCode) return toast.error("Invalid verification code.");

    setAuthLoading(true);
    try {
      const res = await fetch("/api/phone-otp/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, code: typedCode, name: authForm.name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      const signInRes = await signIn("credentials", { email: data.email, password: data.password, redirect: false });
      if (signInRes?.error) throw new Error(signInRes.error || "Authentication failed");

      toast.success("Phone verified and logged in successfully!");
      setFlowStep("ready");
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!phoneNumber.trim() || timerActive) return;
    try {
      const res = await fetch("/api/phone-otp/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send verification code");

      setOtpSentCode(data.otp);
      setCountdown(25);
      setTimerActive(true);
      toast.success(`Code sent! Simulating SMS...`);
      setTimeout(() => {
        toast.success(`💬 SMS Gateway Simulator: Your verification code is: ${data.otp}`, { duration: 15000 });
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newInputs = [...otpInputs];
    newInputs[index] = value.substring(value.length - 1);
    setOtpInputs(newInputs);
    if (value && index < 3) document.getElementById(`otp-${index + 1}`)?.focus();
  };
  
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpInputs[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (isLoginTab) {
        const res = await signIn("credentials", { email: authForm.email.toLowerCase().trim(), password: authForm.password, redirect: false });
        if (res?.error) throw new Error(res.error || "Invalid email or password");
        toast.success("Welcome back! Scratch card unlocked.");
      } else {
        if (!authForm.name.trim() || !authForm.email.trim() || !authForm.phone.trim() || !authForm.password) {
          throw new Error("All fields are required");
        }
        const signupRes = await fetch("/api/auth/signup", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: authForm.name, email: authForm.email, password: authForm.password, phone: authForm.phone })
        });
        const data = await signupRes.json();
        if (!signupRes.ok) throw new Error(data.error || "Sign up failed");

        const loginRes = await signIn("credentials", { email: authForm.email.toLowerCase().trim(), password: authForm.password, redirect: false });
        if (loginRes?.error) throw new Error(loginRes.error || "Authentication failed after sign up");
        toast.success("Account created successfully! Scratch card unlocked.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setAuthLoading(false);
    }
  };

  // Start Scratching - Fetches Prize before allowing scratch
  const handleStartScratching = async () => {
    if (isApiFetching || hasScratched) return;
    setIsApiFetching(true);
    toast.loading("Generating your lucky card...", { id: "scratch-toast" });

    try {
      // NOTE: We keep calling the old 'spin' API to avoid breaking backend compatibility
      const res = await fetch("/api/user/spin", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate scratch card");

      setHasScratched(true);
      setScratchResult(data.prize);
      setUserCouponCode(data.code || "");
      toast.dismiss("scratch-toast");
      
      // Now allow user to scratch
      setFlowStep("scratching");

    } catch (error: any) {
      setIsApiFetching(false);
      toast.dismiss("scratch-toast");
      toast.error(error.message || "Something went wrong. Try again.");
    }
  };

  const runConfetti = () => {
    const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: any[] = [];
    const colors = ["#ff0a54", "#ff477e", "#ff7096", "#ff85a1", "#ffd166", "#06d6a0", "#118ab2", "#FF6102", "#102857"];
    
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4, d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5, tiltAngleIncremental: Math.random() * 0.07 + 0.02, tiltAngle: 0
      });
    }
    
    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 5;
        if (p.y <= canvas.height) active = true;
        else { p.y = -20; p.x = Math.random() * canvas.width; }
        
        ctx.beginPath(); ctx.lineWidth = p.r; ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2); ctx.stroke();
      });
      if (active) animationId = requestAnimationFrame(draw);
    };
    draw();
    setTimeout(() => { cancelAnimationFrame(animationId); ctx.clearRect(0, 0, canvas.width, canvas.height); }, 6000);
  };

  if (loading) return <div className="spinner-loader"><div className="loading-ring" /></div>;

  return (
    <section className="spin-section" id="scratch-and-win">
      <canvas id="confetti-canvas" />
      <div className="spin-bg-grid" aria-hidden />
      <div className="spin-glow spin-glow--gold" aria-hidden />
      <div className="spin-glow spin-glow--maroon" aria-hidden />

      <div className="page-container spin-inner">
        <div className="spin-header">
          <div className="spin-tags">
            <span className="spin-tag-pill tag-primary">✦ FREE DELIVERY + COD</span>
            <span className="spin-tag-pill tag-gold">LIMITED TIME OFFER</span>
          </div>
          <h2 className="spin-heading">✦ SCRATCH & WIN EXCLUSIVE REWARDS! ✦</h2>
          <p className="spin-subheading">Unlock premium discounts, cashback, and gifts instantly.</p>
          <div className="spin-badge-strip">
            <span>🛡️ 100% Real Rewards</span><span>|</span><span>🔑 Sign up to unlock</span><span>|</span><span>👤 One card per customer</span>
          </div>
        </div>

        <div className="spin-layout">
          {/* LEFT COLUMN: GATING FORM or ACTION PROMPT */}
          <div className="spin-details-card">
            {status !== "authenticated" ? (
              flowStep === "visitor" ? (
                <div className="visitor-card" style={{ textAlign: "center", padding: "10px 0" }}>
                  <div className="spin-tag-glow"><Sparkles size={16} /> Exclusive Offers</div>
                  <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "22px", fontWeight: 900, color: "#102857", marginBottom: "12px" }}>Exclusive offers just for you!</h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6", marginBottom: "24px" }}>
                    Scratch the card to win premium discount coupons, cashback vouchers, and free gifts.
                  </p>
                  <button onClick={() => { setFlowStep("signup"); setIsLoginTab(false); }} className="quick-spin-btn" style={{ width: "100%" }}>
                    Sign Up to Scratch 🚀
                  </button>
                </div>
              ) : flowStep === "signup" ? (
                <div className="auth-card">
                  {/* Tabs */}
                  <div className="auth-tabs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#FAFAFA", borderRadius: "10px", padding: "4px", marginBottom: "20px", border: "1px solid #E2E8F0" }}>
                    <button type="button" onClick={() => setIsLoginTab(false)} className={`auth-tab ${!isLoginTab ? "active" : ""}`} style={{ border: "none", background: !isLoginTab ? "#ffffff" : "none", padding: "10px", fontFamily: "Outfit, sans-serif", fontSize: "13px", fontWeight: 700, color: !isLoginTab ? "#102857" : "#64748B", cursor: "pointer", borderRadius: "8px", boxShadow: !isLoginTab ? "0 4px 10px rgba(0,0,0,0.04)" : "none" }}>Sign Up</button>
                    <button type="button" onClick={() => setIsLoginTab(true)} className={`auth-tab ${isLoginTab ? "active" : ""}`} style={{ border: "none", background: isLoginTab ? "#ffffff" : "none", padding: "10px", fontFamily: "Outfit, sans-serif", fontSize: "13px", fontWeight: 700, color: isLoginTab ? "#102857" : "#64748B", cursor: "pointer", borderRadius: "8px", boxShadow: isLoginTab ? "0 4px 10px rgba(0,0,0,0.04)" : "none" }}>Log In</button>
                  </div>
                  
                  {/* Google Login */}
                  <button type="button" onClick={handleGoogleSignIn} className="scratch-google-sign-in-btn">
                    <svg className="google-logo" viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: "10px", verticalAlign: "middle" }}>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                  <div className="auth-or-separator"><span>OR</span></div>

                  {!isLoginTab ? (
                    <form onSubmit={handlePhoneSubmit} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div className="auth-field"><label>Full Name *</label><div className="auth-input-wrap"><User size={16} className="auth-input-icon"/><input type="text" placeholder="Muhammad Ali" required value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}/></div></div>
                      <div className="auth-field"><label>Phone Number *</label><div className="auth-input-wrap"><div className="country-prefix"><span className="pk-flag">🇵🇰</span><span>+92</span></div><input type="tel" placeholder="300 1234567" required value={phoneNumber} onChange={(e) => { let val = e.target.value.replace(/\s+/g, "").replace(/-/g, ""); if (val.startsWith("0")) val = val.substring(1); if (val.startsWith("+92")) val = val.substring(3); setPhoneNumber(val); setAuthForm(prev => ({ ...prev, phone: val })); }}/></div></div>
                      <div className="auth-field"><label>Email Address *</label><div className="auth-input-wrap"><Mail size={16} className="auth-input-icon"/><input type="email" placeholder="you@example.com" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}/></div></div>
                      <div className="auth-field"><label>Password *</label><div className="auth-input-wrap"><Lock size={16} className="auth-input-icon"/><input type={showPassword ? "text" : "password"} placeholder="Min 6 characters" minLength={6} required value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}/><button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-input-eye">{showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}</button></div></div>
                      <button type="submit" disabled={authLoading} className="auth-submit-btn">{authLoading ? <span className="auth-spinner" /> : "Continue"}</button>
                    </form>
                  ) : (
                    <form onSubmit={handleAuthSubmit} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div className="auth-field"><label>Email Address *</label><div className="auth-input-wrap"><Mail size={16} className="auth-input-icon"/><input type="email" placeholder="you@example.com" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}/></div></div>
                      <div className="auth-field"><label>Password *</label><div className="auth-input-wrap"><Lock size={16} className="auth-input-icon"/><input type={showPassword ? "text" : "password"} placeholder="Min 6 characters" minLength={6} required value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}/><button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-input-eye">{showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}</button></div></div>
                      <button type="submit" disabled={authLoading} className="auth-submit-btn">{authLoading ? <span className="auth-spinner" /> : "Log In & Unlock"}</button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="auth-card">
                  <div className="auth-form-header">
                    <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "20px", fontWeight: 800, color: "#102857", marginBottom: "4px" }}>Verify Your Phone</h3>
                    <p style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>Enter 4 digit code sent to +92 {phoneNumber}</p>
                  </div>
                  <form onSubmit={handleOtpVerify} className="auth-form">
                    <div style={{ display: "flex", justifyContent: "center", gap: "12px", margin: "10px 0 20px" }}>
                      {otpInputs.map((digit, idx) => (
                        <input key={idx} id={`otp-${idx}`} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} value={digit} onChange={(e) => handleOtpChange(e.target.value, idx)} onKeyDown={(e) => handleOtpKeyDown(e, idx)} style={{ width: "56px", height: "56px", fontSize: "24px", fontWeight: 800, textAlign: "center", background: "#FAFAFA", border: "2px solid #E2E8F0", borderRadius: "12px", outline: "none", color: "#102857", fontFamily: "Outfit, sans-serif" }} />
                      ))}
                    </div>
                    <button type="submit" disabled={authLoading} className="auth-submit-btn" style={{ width: "100%" }}>{authLoading ? <span className="auth-spinner" /> : "Verify"}</button>
                    <div style={{ textAlign: "center", marginTop: "16px" }}>
                      <button type="button" disabled={timerActive} onClick={handleResendCode} style={{ background: "none", border: "none", color: timerActive ? "#64748B" : "#102857", fontWeight: 700, cursor: timerActive ? "not-allowed" : "pointer", fontSize: "13.5px" }}>
                        {timerActive ? `Resend Code (${countdown}s)` : "Resend Code"}
                      </button>
                    </div>
                  </form>
                </div>
              )
            ) : (
              <div className="actions-card">
                <div className="welcome-banner">
                  <div className="welcome-avatar">{session.user?.name?.startsWith("Guest") ? "G" : (session.user?.name?.charAt(0).toUpperCase() || "U")}</div>
                  <div>
                    <h4>Welcome{session.user?.name?.startsWith("Guest ") ? "!" : `, ${session.user?.name || "Shopper"}!`}</h4>
                    {session.user?.email && !session.user.email.startsWith("phone_") && (
                      <p className="welcome-email">{session.user.email}</p>
                    )}
                  </div>
                </div>

                {flowStep === "ready" ? (
                  <div className="ready-to-spin">
                    <div className="spin-tag-glow"><Gift size={18} /> {isAdmin ? "⚡ Admin Mode: Unlimited Cards" : "1 Card Available"}</div>
                    <h3>Your Scratch Card is Ready!</h3>
                    <p>Unlock premium discounts, cashback, and gifts.</p>
                    <button onClick={handleStartScratching} disabled={isApiFetching} className="quick-spin-btn" style={{ width: "100%" }}>
                      {isApiFetching ? "Generating..." : "Tap to Unlock Card 🚀"}
                    </button>
                  </div>
                ) : flowStep === "scratching" ? (
                  <div className="ready-to-spin">
                    <h3 style={{ color: "#FF6102" }}>Scratch the card on the right!</h3>
                    <p>Use your mouse or finger to scratch off the overlay and reveal your prize.</p>
                  </div>
                ) : (
                  <div className="spin-result-display">
                    <div className="success-badge">🎉 Congratulations!</div>
                    <h3>You Won:</h3>
                    <div className="prize-won-box">{scratchResult}</div>
                    
                    <div className="coupon-ticket-container">
                      <div className="coupon-ticket-top">
                        <div className="coupon-ticket-label">COUPON CODE</div>
                        <div className="coupon-ticket-code">{userCouponCode || "WIN10-ABCD"}</div>
                      </div>
                      <div className="coupon-ticket-bottom">
                        <button onClick={() => { navigator.clipboard.writeText(userCouponCode || "WIN10-ABCD"); toast.success("Coupon code copied to clipboard!"); }} className="coupon-ticket-copy-btn">
                          Copy Code
                        </button>
                        <div className="coupon-ticket-expiry">Valid for 48 Hours</div>
                      </div>
                    </div>
                    
                    <div className="coupon-applied-note">⚡ Applied automatically at checkout!</div>
                    <Link href="/products" className="quick-spin-btn" style={{ display: "inline-block", width: "100%", textDecoration: "none", marginTop: "16px", boxSizing: "border-box" }}>
                      Shop Now & Checkout
                    </Link>

                    {isAdmin && (
                      <button 
                        onClick={() => { setHasScratched(false); setScratchResult(""); setFlowStep("ready"); }} 
                        className="quick-spin-btn"
                        style={{ background: "linear-gradient(135deg, #FF6102 0%, #FF6102 100%)", width: "100%", marginTop: "16px" }}
                      >
                        Try Again! 🔄
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SCRATCH CARD UI */}
          <div className="wheel-outer-wrapper">
            <div 
              className={`scratch-card-container ${status !== "authenticated" ? "locked" : ""}`}
              ref={containerRef}
            >
              {/* Prize Details (Hidden under canvas) */}
              <div className="scratch-prize-reveal">
                {scratchResult ? (
                  <>
                    <h4 className="prize-title">You Won!</h4>
                    <div className="prize-name">{scratchResult}</div>
                    <div className="prize-code">{userCouponCode}</div>
                  </>
                ) : (
                  <div className="locked-card-content">
                    <Lock size={48} color="rgba(16,40,87,0.3)" />
                    <p>Unlock to Reveal</p>
                  </div>
                )}
              </div>

              {/* The Scratchable Canvas Layer */}
              <canvas
                ref={canvasRef}
                className={`scratch-canvas ${flowStep === "winner" ? "faded" : ""} ${(flowStep === "ready" || flowStep === "visitor" || flowStep === "signup" || flowStep === "otp") ? "hidden-canvas" : ""}`}
                onMouseDown={scratchStart}
                onMouseMove={scratchMove}
                onMouseUp={scratchEnd}
                onMouseLeave={scratchEnd}
                onTouchStart={scratchStart}
                onTouchMove={scratchMove}
                onTouchEnd={scratchEnd}
              />
              
              {/* If flow is locked or not ready to scratch, put an overlay */}
              {status !== "authenticated" && (
                <div className="scratch-overlay-locked">
                  <Lock size={32} />
                  <span>Log in to scratch</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* REUSED CSS for Auth and Layout, New CSS for Scratch Card */}
      <style>{`
        .spin-section { position: relative; padding: clamp(52px, 7vw, 84px) 0; background: var(--navy); border-top: 1px solid rgba(255, 255, 255, 0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.05); overflow: hidden; }
        #confetti-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }
        .spin-bg-grid { pointer-events: none; position: absolute; inset: 0; opacity: 0.15; background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px); background-size: 32px 32px; mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 80%); }
        .spin-glow { pointer-events: none; position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.4; }
        .spin-glow--gold { width: 50vw; height: 50vw; top: -20%; right: -10%; background: rgba(255, 131, 58, 0.15); } /* Orange soft glow */
        .spin-glow--maroon { width: 40vw; height: 40vw; bottom: -20%; left: -10%; background: rgba(255, 97, 2, 0.15); } /* Orange glow */
        .spin-inner { position: relative; z-index: 1; }
        .spin-header { text-align: center; margin-bottom: 48px; }
        .spin-tags { display: flex; justify-content: center; gap: 12px; margin-bottom: 16px; }
        .spin-tag-pill { padding: 6px 14px; font-family: "Outfit", sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.15em; border-radius: 999px; text-transform: uppercase; }
        .tag-primary { background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); }
        .tag-gold { background: linear-gradient(135deg, rgba(255, 97, 2, 0.2) 0%, rgba(229, 87, 2, 0.2) 100%); color: var(--white); border: 1px solid rgba(255, 97, 2, 0.3); box-shadow: 0 0 15px rgba(255, 97, 2, 0.15); }
        .spin-heading { font-family: "Outfit", sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 900; color: var(--white); margin-bottom: 12px; letter-spacing: -0.02em; }
        .spin-subheading { font-family: "Plus Jakarta Sans", sans-serif; font-size: 16px; color: rgba(255, 255, 255, 0.8); max-width: 600px; margin: 0 auto 20px; font-weight: 500; line-height: 1.6; }
        .spin-badge-strip { display: flex; justify-content: center; gap: 16px; font-family: "Plus Jakarta Sans", sans-serif; font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.6); }
        
        .spin-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 5vw, 64px); align-items: center; }
        @media (max-width: 900px) { .spin-layout { grid-template-columns: 1fr; gap: 48px; } }
        
        /* Dark Glassmorphism Container */
        .spin-details-card { 
          background: rgba(11, 28, 61, 0.6); /* navy-deep */
          backdrop-filter: blur(16px); 
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08); 
          border-radius: 24px; 
          padding: clamp(24px, 4vw, 40px); 
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1); 
          min-height: 480px; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
          color: var(--white);
        }
        
        .spinner-loader { display: flex; justify-content: center; align-items: center; min-height: 400px; }
        .loading-ring { width: 48px; height: 48px; border: 3.5px solid rgba(255, 255, 255, 0.1); border-top-color: var(--orange); border-radius: 50%; animation: spin 0.8s linear infinite; }
        
        /* Typography overrides for dark mode */
        .visitor-card h3, .auth-form-header h3, .ready-to-spin h3 { color: var(--white) !important; }
        .visitor-card p, .auth-form-header p, .ready-to-spin p { color: rgba(255, 255, 255, 0.7) !important; }
        
        /* Auth styles Dark Mode - Base + Theme */
        .auth-card { width: 100%; }
        
        .auth-tabs { display: grid; grid-template-columns: 1fr 1fr; padding: 4px; border-radius: 14px; margin-bottom: 24px; background: rgba(0, 0, 0, 0.2) !important; border: 1px solid rgba(255, 255, 255, 0.05) !important; }
        .auth-tab { padding: 12px; font-family: "Outfit", sans-serif; font-size: 14px; font-weight: 700; border: none; background: none; cursor: pointer; border-radius: 10px; transition: all 0.2s ease; text-align: center; color: rgba(255, 255, 255, 0.5) !important; }
        .auth-tab.active { background: rgba(255, 255, 255, 0.1) !important; color: var(--white) !important; box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important; }
        
        .auth-field { display: flex; flex-direction: column; gap: 8px; }
        .auth-field label { font-size: 12px; text-transform: uppercase; font-family: "Outfit", sans-serif; color: rgba(255, 255, 255, 0.9) !important; letter-spacing: 1px; font-weight: 600; }
        
        .auth-input-wrap { position: relative; display: flex; align-items: center; }
        .auth-card .auth-input-icon { position: absolute; left: 16px; pointer-events: none; z-index: 1; color: rgba(255, 255, 255, 0.6) !important; }
        .auth-card .auth-input-eye { position: absolute; right: 14px; background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 4px; z-index: 2; color: rgba(255, 255, 255, 0.6) !important; }
        
        .country-prefix { position: absolute; left: 16px; display: flex; align-items: center; gap: 6px; font-weight: 700; color: rgba(255, 255, 255, 0.9); z-index: 1; pointer-events: none; }
        .pk-flag { font-size: 16px; }
        
        .auth-card .auth-input-wrap input { width: 100%; padding: 15px 16px 15px 46px; border-radius: 14px; font-size: 15px; font-family: "Plus Jakarta Sans", sans-serif; font-weight: 500; outline: none; transition: border-color 0.25s, box-shadow 0.25s; background: rgba(0, 0, 0, 0.2) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; color: var(--white) !important; }
        .auth-card .auth-input-wrap input[type="tel"] { padding-left: 90px; }
        .auth-card .auth-input-wrap input:focus { border-color: var(--orange) !important; box-shadow: 0 0 0 3px rgba(255, 97, 2, 0.1); }
        
        .auth-submit-btn { width: 100%; padding: 17px; font-size: 15px; font-weight: 700; font-family: "Plus Jakarta Sans", sans-serif; border: none; border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(135deg, var(--orange) 0%, var(--orange-deep) 100%); color: var(--white); box-shadow: 0 10px 28px rgba(255, 97, 2, 0.32); transition: all 0.3s ease; }
        .auth-submit-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(255, 97, 2, 0.42); }
        .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .auth-spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .scratch-google-sign-in-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: "Plus Jakarta Sans", sans-serif; cursor: pointer; background: rgba(255, 255, 255, 0.05) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; color: var(--white) !important; transition: background 0.2s; margin-bottom: 8px; }
        .scratch-google-sign-in-btn:hover { background: rgba(255, 255, 255, 0.1) !important; }
        
        .auth-or-separator { display: flex; align-items: center; text-align: center; font-size: 12px; font-weight: 700; margin: 18px 0; }
        .auth-or-separator span { background: transparent; color: rgba(255, 255, 255, 0.5) !important; }
        .auth-or-separator::before, .auth-or-separator::after { content: ''; flex: 1; border-bottom: 2px solid rgba(255, 255, 255, 0.1) !important; }
        .auth-or-separator:not(:empty)::before { margin-right: .5em; }
        .auth-or-separator:not(:empty)::after { margin-left: .5em; }
        
        /* OTP Inputs */
        input[id^="otp-"] { background: rgba(0, 0, 0, 0.2) !important; border: 2px solid rgba(255, 255, 255, 0.1) !important; color: var(--white) !important; }
        input[id^="otp-"]:focus { border-color: var(--orange) !important; }

        /* Missing Common UI Elements for Dark Mode */
        .quick-spin-btn { background: var(--gradient-brand); color: var(--white); border: none; border-radius: 12px; padding: 14px 24px; font-family: "Plus Jakarta Sans", sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; box-shadow: 0 8px 20px rgba(255, 97, 2, 0.25); transition: transform 0.2s, box-shadow 0.2s; text-align: center; }
        .quick-spin-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(255, 97, 2, 0.4); }
        
        .welcome-banner { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: left; }
        .welcome-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--gradient-brand); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: "Outfit", sans-serif; font-size: 20px; flex-shrink: 0; box-shadow: 0 4px 10px rgba(255, 97, 2, 0.3); }
        .welcome-banner h4 { margin: 0; font-family: "Outfit", sans-serif; font-size: 16px; color: var(--white); font-weight: 800; line-height: 1.2; }
        .welcome-email { margin: 4px 0 0; font-family: "Plus Jakarta Sans", sans-serif; font-size: 13px; color: rgba(255, 255, 255, 0.7); font-weight: 500; }

        /* Winner display (Left column) */
        .spin-result-display { text-align: center; }
        .spin-result-display h3 { font-family: "Outfit", sans-serif; font-size: 16px; color: rgba(255, 255, 255, 0.7); font-weight: 800; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1.5px; }
        
        .success-badge { display: inline-block; background: rgba(255, 97, 2, 0.15); color: var(--orange); border: 1px solid rgba(255, 97, 2, 0.3); padding: 8px 16px; border-radius: 100px; font-family: "Outfit", sans-serif; font-weight: 800; font-size: 13px; margin-bottom: 24px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 0 15px rgba(255, 97, 2, 0.2); }
        
        .prize-won-box { background: rgba(0, 0, 0, 0.3); color: var(--white); padding: 20px; border-radius: 16px; font-family: "Outfit", sans-serif; font-size: 32px; font-weight: 900; letter-spacing: 0.5px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); border: 1px solid rgba(255, 255, 255, 0.05); margin-bottom: 24px; text-shadow: 0 2px 10px rgba(255, 97, 2, 0.3); }
        
        .coupon-ticket-container { background: rgba(255, 255, 255, 0.03); border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 24px; margin: 16px 0; position: relative; }
        .coupon-ticket-label { font-family: "Plus Jakarta Sans", sans-serif; font-size: 11px; font-weight: 800; color: rgba(255, 255, 255, 0.5); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .coupon-ticket-code { font-family: monospace; font-size: 28px; font-weight: 800; color: var(--orange); margin-bottom: 20px; letter-spacing: 2.5px; text-shadow: 0 0 10px rgba(255, 97, 2, 0.3); }
        .coupon-ticket-bottom { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .coupon-ticket-copy-btn { background: rgba(255, 255, 255, 0.1); color: var(--white); border: 1px solid rgba(255, 255, 255, 0.2); padding: 10px 24px; border-radius: 8px; font-family: "Plus Jakarta Sans", sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .coupon-ticket-copy-btn:hover { background: var(--orange); color: var(--white); border-color: var(--orange); box-shadow: 0 0 15px rgba(255, 97, 2, 0.4); }
        .coupon-ticket-expiry { font-family: "Plus Jakarta Sans", sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.5); font-weight: 600; }
        
        .coupon-applied-note { font-family: "Plus Jakarta Sans", sans-serif; font-size: 13px; color: var(--orange); font-weight: 700; margin: 24px 0 24px; display: flex; align-items: center; justify-content: center; background: rgba(255, 97, 2, 0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(255, 97, 2, 0.2); }

        /* Scratch Card container Dark Mode */
        .wheel-outer-wrapper { display: flex; justify-content: center; align-items: center; width: 100%; }
        
        .scratch-card-container {
          position: relative;
          width: 100%;
          max-width: 320px;
          height: 440px;
          background: linear-gradient(135deg, var(--navy-deep) 0%, #000000 100%);
          border-radius: 24px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Metallic border effect */
        .scratch-card-container::before {
          content: '';
          position: absolute;
          inset: 4px;
          border-radius: 20px;
          border: 1px solid rgba(255, 97, 2, 0.3);
          box-shadow: inset 0 0 20px rgba(255, 97, 2, 0.1);
          pointer-events: none;
          z-index: 1;
        }

        .scratch-prize-reveal {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
          z-index: 2; /* Under canvas */
          background: radial-gradient(circle at center, rgba(255, 97, 2, 0.1) 0%, transparent 70%);
        }

        .prize-title {
          font-family: "Outfit", sans-serif;
          color: rgba(255, 255, 255, 0.7);
          font-size: 18px;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 12px;
          letter-spacing: 3px;
        }

        .prize-name {
          font-family: "Outfit", sans-serif;
          color: var(--white);
          font-size: 38px;
          font-weight: 900;
          margin-bottom: 24px;
          text-shadow: 0 0 20px rgba(255, 97, 2, 0.6);
          line-height: 1.1;
        }

        .prize-code {
          background: rgba(255, 255, 255, 0.05);
          color: var(--orange);
          font-family: monospace;
          font-size: 22px;
          font-weight: 800;
          padding: 12px 24px;
          border-radius: 8px;
          letter-spacing: 2px;
          border: 1px solid rgba(255, 97, 2, 0.2);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .locked-card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: rgba(255, 255, 255, 0.2);
          font-weight: 700;
          font-family: "Outfit", sans-serif;
        }

        .scratch-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          cursor: crosshair;
          touch-action: none;
          transition: opacity 1s ease-out;
        }

        .scratch-canvas.faded {
          opacity: 0;
          pointer-events: none;
        }
        
        .scratch-canvas.hidden-canvas {
          display: none;
        }

        .scratch-overlay-locked {
          position: absolute;
          inset: 0;
          background: rgba(11, 28, 61, 0.8);
          backdrop-filter: blur(8px);
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          font-family: "Outfit", sans-serif;
          font-weight: 700;
          font-size: 20px;
          gap: 12px;
        }
        
      `}</style>
    </section>
  );
}
