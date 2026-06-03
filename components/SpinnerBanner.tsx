"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { Sparkles, Gift, Lock, User, Phone, Mail, Eye, EyeOff, HelpCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const SPIN_OPTIONS = [
  "Surprise Gift",
  "Special Discount",
  "Buy 1 Get 5% Off",
  "Buy 2 Get 10% Off",
  "Buy 3 Get 15% Off",
  "Buy 4 Get 1 Free",
  "Free Delivery",
  "Rs. 2,400 Cashback",
  "Rs. 150 Gift Voucher (On Rs. 3,000+)",
  "Next Time",
  "Free Product"
];

const SEGMENT_COLORS = [
  "#6b1e2e", // Maroon (brand color)
  "#FAF3E8", // Light Cream
  "#dfc27d", // Soft Gold (replaced green)
  "#DFD7C2", // Muted Gold/Taupe
  "#ECAFAF", // Pastel Pink
  "#6b1e2e", // Maroon
  "#FAF3E8", // Cream
  "#dfc27d", // Soft Gold (replaced green)
  "#DFD7C2", // Gold
  "#ECAFAF", // Pink
  "#FAF3E8", // Cream (avoid adjacent Maroon)
];

const SEGMENT_TEXT_COLORS = [
  "#FFFFFF", // Maroon -> White
  "#6b1e2e", // Cream -> Maroon
  "#6b1e2e", // Gold -> Maroon (replaced green)
  "#4d3c1a", // Gold -> Dark Gold/Brown
  "#5a2c2c", // Pink -> Dark Red
  "#FFFFFF", // Maroon -> White
  "#6b1e2e", // Cream -> Maroon
  "#6b1e2e", // Gold -> Maroon (replaced green)
  "#4d3c1a", // Gold -> Dark Gold
  "#5a2c2c", // Pink -> Dark Red
  "#6b1e2e", // Cream -> Maroon
];

export default function SpinnerBanner() {
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";
  const [hasSpun, setHasSpun] = useState(false);
  const [spinResult, setSpinResult] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Inline Auth states
  const [isLoginTab, setIsLoginTab] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  // Wheel states
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement | null>(null);

  // Fetch spin status on session change
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/spin-status")
        .then((r) => r.json())
        .then((data) => {
          if (data.hasSpun) {
            setHasSpun(true);
            setSpinResult(data.spinResult);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session, status]);

  // Handle signup/login submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (isLoginTab) {
        // Sign in logic
        const res = await signIn("credentials", {
          email: authForm.email.toLowerCase().trim(),
          password: authForm.password,
          redirect: false
        });

        if (res?.error) {
          throw new Error(res.error || "Invalid email or password");
        }
        toast.success("Welcome back! Wheel unlocked.");
      } else {
        // Sign up logic
        if (!authForm.name.trim() || !authForm.email.trim() || !authForm.phone.trim() || !authForm.password) {
          throw new Error("All fields are required");
        }

        const signupRes = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: authForm.name,
            email: authForm.email,
            password: authForm.password,
            phone: authForm.phone
          })
        });

        const data = await signupRes.json();
        if (!signupRes.ok) {
          throw new Error(data.error || "Sign up failed");
        }

        // Auto login
        const loginRes = await signIn("credentials", {
          email: authForm.email.toLowerCase().trim(),
          password: authForm.password,
          redirect: false
        });

        if (loginRes?.error) {
          throw new Error(loginRes.error || "Authentication failed after sign up");
        }

        toast.success("Account created successfully! Wheel unlocked.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setAuthLoading(false);
    }
  };

  // Execute Spin
  const handleSpin = async () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    toast.loading("Spinning the wheel...", { id: "spin-toast" });

    try {
      const res = await fetch("/api/user/spin", {
        method: "POST"
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Spin failed");
      }

      const N = SPIN_OPTIONS.length;
      const segmentAngle = 360 / N;
      const targetIndex = data.index;
      
      // Calculate rotation to stop at target segment at the top (270 degrees)
      const midAngle = (targetIndex + 0.5) * segmentAngle;
      
      // 5 full rotations + angular distance to target
      const newRotation = 360 * 5 + (270 - midAngle);
      setWheelRotation(newRotation);

      setTimeout(() => {
        setHasSpun(true);
        setSpinResult(data.prize);
        setIsSpinning(false);
        toast.dismiss("spin-toast");
        toast.success(`Congratulations! You won: ${data.prize}`, { duration: 5000 });
        runConfetti();
      }, 5000); // match CSS duration

    } catch (error: any) {
      setIsSpinning(false);
      toast.dismiss("spin-toast");
      toast.error(error.message || "Something went wrong. Try again.");
    }
  };

  // Canvas Confetti
  const runConfetti = () => {
    const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    
    const particles: any[] = [];
    const colors = ["#ff0a54", "#ff477e", "#ff7096", "#ff85a1", "#ffd166", "#06d6a0", "#118ab2", "#c9a84c", "#6b1e2e"];
    
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0
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
        
        if (p.y <= canvas.height) {
          active = true;
        } else {
          // Recycle
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });
      
      if (active) {
        animationId = requestAnimationFrame(draw);
      }
    };
    
    draw();
    setTimeout(() => {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 6000);
  };

  // Generate SVG sectors
  const renderWheelSegments = () => {
    const N = SPIN_OPTIONS.length;
    const radius = 210;
    const cx = 250;
    const cy = 250;

    return SPIN_OPTIONS.map((option, i) => {
      const startPercent = i / N;
      const endPercent = (i + 1) / N;
      
      // Calculate coordinates for pie slice
      const startAngle = startPercent * 2 * Math.PI;
      const endAngle = endPercent * 2 * Math.PI;
      
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      
      const midAngleDeg = (startPercent + (endPercent - startPercent) / 2) * 360;

      // Draw SVG arc
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

      // Break text to display on wheel if too long
      let displayOption = option;
      if (option.length > 20) {
        displayOption = option.substring(0, 18) + "...";
      }

      return (
        <g key={i}>
          <path d={d} fill={SEGMENT_COLORS[i]} stroke="#fffdf9" strokeWidth="1" />
          <g transform={`rotate(${midAngleDeg}, ${cx}, ${cy})`}>
            <text
              x={cx + radius - 15}
              y={cy}
              textAnchor="end"
              alignmentBaseline="middle"
              fill={SEGMENT_TEXT_COLORS[i]}
              style={{
                fontSize: "10px",
                fontWeight: 800,
                fontFamily: "Outfit, sans-serif",
                letterSpacing: "0.2px"
              }}
            >
              {displayOption}
            </text>
          </g>
        </g>
      );
    });
  };

  // Lights on the rim
  const renderRimLights = () => {
    const lightsCount = 22;
    const radius = 218;
    const cx = 250;
    const cy = 250;
    const lights = [];

    for (let i = 0; i < lightsCount; i++) {
      const angle = (i / lightsCount) * 2 * Math.PI;
      const lx = cx + radius * Math.cos(angle);
      const ly = cy + radius * Math.sin(angle);
      
      lights.push(
        <circle
          key={i}
          cx={lx}
          cy={ly}
          r="4.5"
          className={`wheel-light ${i % 2 === 0 ? "light-even" : "light-odd"}`}
        />
      );
    }
    return lights;
  };

  if (loading) {
    return (
      <div className="spinner-loader">
        <div className="loading-ring" />
      </div>
    );
  }

  return (
    <section className="spin-section" id="spin-and-win">
      <canvas id="confetti-canvas" />
      <div className="spin-bg-grid" aria-hidden />
      <div className="spin-glow spin-glow--gold" aria-hidden />
      <div className="spin-glow spin-glow--maroon" aria-hidden />

      <div className="page-container spin-inner">
        {/* Header Tags & Titles */}
        <div className="spin-header">
          <div className="spin-tags">
            <span className="spin-tag-pill tag-primary">✦ FREE DELIVERY + COD</span>
            <span className="spin-tag-pill tag-gold">LIMITED TIME OFFER</span>
          </div>
          <h2 className="spin-heading">
            ✦ SPIN & WIN EXCLUSIVE REWARDS! ✦
          </h2>
          <p className="spin-subheading">
            Unlock premium discounts, cashback, and gifts with just one spin.
          </p>
          <div className="spin-badge-strip">
            <span>🛡️ 100% Real Rewards</span>
            <span>|</span>
            <span>🔑 Sign up to unlock</span>
            <span>|</span>
            <span>👤 One spin per customer</span>
          </div>
        </div>

        <div className="spin-layout">
          {/* LEFT COLUMN: GATING FORM or SPIN ACTIONS */}
          <div className="spin-details-card">
            {status !== "authenticated" ? (
              <div className="auth-card">
                <div className="auth-tabs">
                  <button 
                    onClick={() => setIsLoginTab(false)} 
                    className={`auth-tab ${!isLoginTab ? "active" : ""}`}
                  >
                    Create Account
                  </button>
                  <button 
                    onClick={() => setIsLoginTab(true)} 
                    className={`auth-tab ${isLoginTab ? "active" : ""}`}
                  >
                    Log In
                  </button>
                </div>

                <div className="auth-form-header">
                  <div className="auth-form-tag">
                    <Sparkles size={13} /> {isLoginTab ? "Welcome Back" : "Unlock Spin"}
                  </div>
                  <h3>{isLoginTab ? "Sign In to Your Account" : "Enter Details to Spin"}</h3>
                  <p>Register or log in below to unlock your one-time free spin.</p>
                </div>

                <form onSubmit={handleAuthSubmit} className="auth-form">
                  {!isLoginTab && (
                    <>
                      <div className="auth-field">
                        <label>Full Name *</label>
                        <div className="auth-input-wrap">
                          <User size={16} className="auth-input-icon" />
                          <input 
                            type="text" 
                            placeholder="Muhammad Ali" 
                            required 
                            value={authForm.name}
                            onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="auth-field">
                        <label>Phone Number *</label>
                        <div className="auth-input-wrap">
                          <Phone size={16} className="auth-input-icon" />
                          <input 
                            type="tel" 
                            placeholder="03001234567" 
                            maxLength={11}
                            required 
                            value={authForm.phone}
                            onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="auth-field">
                    <label>Email Address *</label>
                    <div className="auth-input-wrap">
                      <Mail size={16} className="auth-input-icon" />
                      <input 
                        type="email" 
                        placeholder="you@example.com" 
                        required 
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>Password *</label>
                    <div className="auth-input-wrap">
                      <Lock size={16} className="auth-input-icon" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Min 6 characters" 
                        minLength={6}
                        required 
                        value={authForm.password}
                        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="auth-input-eye"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={authLoading} className="auth-submit-btn">
                    {authLoading ? <span className="auth-spinner" /> : (
                      <>{isLoginTab ? "Log In & Unlock" : "Sign Up & Unlock"} <Sparkles size={16} /></>
                    )}
                  </button>
                </form>

                <p className="auth-footer-note">🔒 We respect your privacy. No spam, ever.</p>
              </div>
            ) : (
              <div className="actions-card">
                <div className="welcome-banner">
                  <div className="welcome-avatar">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h4>Welcome, {session.user?.name || "Shopper"}!</h4>
                    <p className="welcome-email">{session.user?.email}</p>
                  </div>
                </div>

                {!hasSpun ? (
                  <div className="ready-to-spin">
                    <div className="spin-tag-glow">
                      <Gift size={18} /> {isAdmin ? "⚡ Admin Mode: Unlimited Spins" : "1 Spin Available"}
                    </div>
                    <h3>Your wheel is unlocked!</h3>
                    <p>
                      Click the **SPIN TO WIN** button in the center of the wheel, or use the quick action button below to trigger the spinner and claim your Pakistani market reward!
                    </p>
                    <button 
                      onClick={handleSpin} 
                      disabled={isSpinning} 
                      className="quick-spin-btn"
                    >
                      {isSpinning ? "Spinning..." : "SPIN NOW! 🚀"}
                    </button>
                  </div>
                ) : (
                  <div className="spin-result-display">
                    <div className="success-badge">🎉 Congratulations!</div>
                    <h3>You Won:</h3>
                    <div className="prize-won-box">
                      {spinResult}
                    </div>
                    <p className="prize-instruction">
                      This reward has been linked to your account (**{session.user?.email}**). Our support team will apply this discount / gift automatically to your next order based on your phone number (**{authForm.phone || "registered contact"}**).
                    </p>
                    <div className="prize-support-tip" style={{ marginBottom: isAdmin ? "16px" : "0" }}>
                      💡 Tip: Share a screenshot on WhatsApp to redeem instantly!
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={() => {
                          setHasSpun(false);
                          setSpinResult("");
                          setWheelRotation(0);
                        }} 
                        className="quick-spin-btn"
                        style={{
                          background: "linear-gradient(135deg, #c9a84c 0%, #a47e2c 100%)",
                          boxShadow: "0 6px 20px rgba(201, 168, 76, 0.25)",
                          width: "100%",
                          marginTop: "16px"
                        }}
                      >
                        Spin Again! 🔄
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: THE WHEEL CONTAINER */}
          <div className="wheel-outer-wrapper">
            <div className="wheel-main-container">
              {/* Top pointer indicator */}
              <div className="wheel-pointer">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <polygon points="20,4 8,32 32,32" fill="#c9a84c" filter="drop-shadow(0px 3px 3px rgba(0,0,0,0.3))" />
                </svg>
              </div>

              {/* The SVG Wheel */}
              <div className="wheel-frame">
                <svg
                  ref={wheelRef}
                  viewBox="0 0 500 500"
                  className="wheel-svg"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transition: isSpinning ? "transform 5.2s cubic-bezier(0.12, 0.8, 0.15, 1.01)" : "transform 0.5s ease"
                  }}
                >
                  {/* Outer dark maroon border ring */}
                  <circle cx="250" cy="250" r="222" fill="#6b1e2e" />
                  
                  {/* Outer golden rim highlights */}
                  <circle cx="250" cy="250" r="214" fill="none" stroke="#c9a84c" strokeWidth="2.5" />

                  {/* SVG slices */}
                  {renderWheelSegments()}

                  {/* Blinking lights */}
                  {renderRimLights()}

                  {/* Inner golden ring border */}
                  <circle cx="250" cy="250" r="48" fill="#c9a84c" />
                </svg>

                {/* Central hub (acts as interactive spin button when logged in) */}
                <button 
                  onClick={handleSpin}
                  disabled={isSpinning || hasSpun || status !== "authenticated"}
                  className={`wheel-hub-btn ${isSpinning ? "spinning" : ""} ${status !== "authenticated" ? "locked" : ""}`}
                >
                  <span className="hub-text">
                    {isSpinning ? "LUCKY" : hasSpun ? "SPUN" : status !== "authenticated" ? "LOCK" : "SPIN"}
                  </span>
                  <span className="hub-subtext">
                    {hasSpun ? "✓" : "TO WIN"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .spin-section {
          position: relative;
          padding: clamp(52px, 7vw, 84px) 0;
          background: linear-gradient(180deg, #fffdf9 0%, #FAF3E8 50%, #fffdf9 100%);
          border-top: 1px solid #e8d8bc;
          border-bottom: 1px solid rgba(107, 30, 46, 0.08);
          overflow: hidden;
        }

        #confetti-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
        }

        .spin-bg-grid {
          pointer-events: none;
          position: absolute;
          inset: 0;
          opacity: 0.35;
          background-image:
            linear-gradient(rgba(107, 30, 46, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107, 30, 46, 0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 75% 65% at 50% 40%, black 20%, transparent 72%);
        }

        .spin-glow {
          pointer-events: none;
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.55;
        }
        .spin-glow--gold {
          width: min(420px, 55vw);
          height: min(320px, 40vw);
          top: -12%;
          right: -8%;
          background: rgba(201, 168, 76, 0.35);
        }
        .spin-glow--maroon {
          width: min(380px, 50vw);
          height: min(280px, 38vw);
          bottom: -18%;
          left: -10%;
          background: rgba(107, 30, 46, 0.12);
        }

        .spin-inner {
          position: relative;
          z-index: 1;
        }

        /* Header design */
        .spin-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .spin-tags {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .spin-tag-pill {
          padding: 6px 14px;
          font-family: "Outfit", sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          border-radius: 999px;
          text-transform: uppercase;
        }

        .tag-primary {
          background: rgba(107, 30, 46, 0.08);
          color: #6b1e2e;
          border: 1px solid rgba(107, 30, 46, 0.2);
        }

        .tag-gold {
          background: linear-gradient(135deg, #fff6d8 0%, #c9a84c 55%, #e8c85c 100%);
          color: #4a1020;
          border: 1px solid rgba(107, 30, 46, 0.15);
          box-shadow: 0 4px 10px rgba(201, 168, 76, 0.3);
        }

        .spin-heading {
          font-family: "Outfit", sans-serif;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 900;
          color: #6b1e2e;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .spin-subheading {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 15px;
          color: rgba(42, 21, 24, 0.65);
          max-width: 600px;
          margin: 0 auto 16px;
          font-weight: 500;
          line-height: 1.5;
        }

        .spin-badge-strip {
          display: flex;
          justify-content: center;
          gap: 12px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: rgba(107, 30, 46, 0.7);
        }

        /* Layout */
        .spin-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(24px, 5vw, 56px);
          align-items: center;
        }

        @media (max-width: 900px) {
          .spin-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* Details Card */
        .spin-details-card {
          background: #fffdf9;
          border: 1px solid rgba(201, 168, 76, 0.3);
          border-radius: 20px;
          padding: clamp(20px, 4vw, 32px);
          box-shadow: 0 10px 30px rgba(107, 30, 46, 0.05);
          min-height: 480px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .spinner-loader {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .loading-ring {
          width: 48px;
          height: 48px;
          border: 3.5px solid rgba(107, 30, 46, 0.1);
          border-top-color: #6b1e2e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Auth styling */
        .auth-card {
          width: 100%;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #faf3e8;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 24px;
          border: 1px solid #e8d8bc;
        }

        .auth-tab {
          border: none;
          background: none;
          padding: 10px;
          font-family: "Outfit", sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #9a8878;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .auth-tab.active {
          background: #ffffff;
          color: #6b1e2e;
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
        }

        .auth-form-header {
          margin-bottom: 20px;
        }

        .auth-form-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 800;
          color: #6b1e2e;
          background: rgba(107, 30, 46, 0.08);
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .auth-form-header h3 {
          font-family: "Outfit", sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #2a1518;
          margin-bottom: 6px;
        }

        .auth-form-header p {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 13px;
          color: #9a8878;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .auth-field label {
          font-family: "Outfit", sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #2a1518;
        }

        .auth-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-input-icon {
          position: absolute;
          left: 12px;
          color: #9a8878;
        }

        .auth-input-wrap input {
          width: 100%;
          background: #faf3e8;
          border: 1.5px solid #e8d8bc;
          border-radius: 10px;
          padding: 11px 12px 11px 36px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 13.5px;
          color: #2a1518;
          outline: none;
          transition: all 0.2s ease;
        }

        .auth-input-wrap input:focus {
          border-color: #6b1e2e;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(107,30,46,0.06);
        }

        .auth-input-eye {
          position: absolute;
          right: 12px;
          border: none;
          background: none;
          cursor: pointer;
          color: #9a8878;
        }

        .auth-submit-btn {
          background: linear-gradient(135deg, #6b1e2e 0%, #4a1020 100%);
          color: #fffdf9;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 18px rgba(107, 30, 46, 0.25);
          transition: all 0.25s ease;
          margin-top: 6px;
        }

        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(107, 30, 46, 0.35);
        }

        .auth-submit-btn:active {
          transform: scale(0.98);
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,253,249,0.3);
          border-top-color: #fffdf9;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .auth-footer-note {
          text-align: center;
          font-size: 11px;
          color: #9a8878;
          margin-top: 14px;
          font-weight: 500;
        }

        /* Actions Card styling (when logged in) */
        .actions-card {
          width: 100%;
        }

        .welcome-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #faf3e8;
          border: 1px solid #e8d8bc;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .welcome-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #6b1e2e, #c9a84c);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 16px;
          box-shadow: 0 4px 10px rgba(107, 30, 46, 0.2);
        }

        .welcome-banner h4 {
          font-family: "Outfit", sans-serif;
          font-size: 16px;
          color: #2a1518;
          margin-bottom: 2px;
        }

        .welcome-email {
          font-size: 12px;
          color: #9a8878;
          font-weight: 500;
        }

        .ready-to-spin {
          text-align: center;
          padding: 10px 0;
        }

        .spin-tag-glow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(201, 168, 76, 0.1);
          color: #c9a84c;
          border: 1px solid rgba(201, 168, 76, 0.25);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .ready-to-spin h3 {
          font-family: "Outfit", sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: #6b1e2e;
          margin-bottom: 12px;
        }

        .ready-to-spin p {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .quick-spin-btn {
          background: linear-gradient(135deg, #6b1e2e 0%, #4a1020 100%);
          color: #ffffff;
          border: none;
          padding: 15px 36px;
          font-size: 15px;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(107, 30, 46, 0.3);
          transition: all 0.2s ease;
        }

        .quick-spin-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(107, 30, 46, 0.4);
        }

        .quick-spin-btn:active {
          transform: scale(0.97);
        }

        /* Result display */
        .spin-result-display {
          text-align: center;
        }

        .success-badge {
          display: inline-block;
          background: rgba(201, 168, 76, 0.12);
          color: #c9a84c;
          border: 1px solid rgba(201, 168, 76, 0.25);
          padding: 6px 14px;
          border-radius: 100px;
          font-weight: 800;
          font-size: 12px;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .spin-result-display h3 {
          font-family: "Outfit", sans-serif;
          font-size: 16px;
          color: #9a8878;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .prize-won-box {
          background: linear-gradient(135deg, #6b1e2e 0%, #4a1020 100%);
          color: #ffffff;
          padding: 20px;
          border-radius: 16px;
          font-family: "Outfit", sans-serif;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -0.5px;
          box-shadow: 0 8px 24px rgba(107, 30, 46, 0.2);
          border: 2.5px solid #c9a84c;
          margin-bottom: 20px;
          animation: pulseGlow 2s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 8px 24px rgba(107, 30, 46, 0.2), 0 0 0 rgba(201, 168, 76, 0); }
          50% { box-shadow: 0 12px 30px rgba(107, 30, 46, 0.35), 0 0 14px rgba(201, 168, 76, 0.3); }
        }

        .prize-instruction {
          font-size: 13.5px;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 18px;
        }

        .prize-support-tip {
          background: #faf3e8;
          border: 1px solid #e8d8bc;
          border-radius: 10px;
          padding: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #6b1e2e;
        }

        /* WHEEL CONTAINER STYLING */
        .wheel-outer-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .wheel-main-container {
          position: relative;
          width: 100%;
          max-width: 450px;
          aspect-ratio: 1;
        }

        .wheel-pointer {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          width: 40px;
          height: 40px;
          pointer-events: none;
        }

        .wheel-frame {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          box-shadow: 0 20px 50px rgba(107, 30, 46, 0.18), 0 8px 20px rgba(0,0,0,0.05);
        }

        .wheel-svg {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: visible;
        }

        /* Blinking lights animation */
        .wheel-light {
          stroke: rgba(255,255,255,0.4);
          stroke-width: 0.5px;
          animation-duration: 0.9s;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        .light-even {
          fill: #ffeb3b;
          filter: drop-shadow(0 0 2px #ffeb3b);
          animation-name: blinkEven;
        }

        .light-odd {
          fill: #c5a059;
          animation-name: blinkOdd;
        }

        @keyframes blinkEven {
          from { fill: #ffeb3b; filter: drop-shadow(0 0 3px #ffeb3b); }
          to { fill: #c5a059; filter: none; }
        }

        @keyframes blinkOdd {
          from { fill: #c5a059; filter: none; }
          to { fill: #ffeb3b; filter: drop-shadow(0 0 3px #ffeb3b); }
        }

        /* Wheel Hub Button */
        .wheel-hub-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: radial-gradient(circle, #fffdf9 0%, #faf3e8 60%, #dfd7c2 100%);
          border: 6px solid #6b1e2e;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.8);
          z-index: 8;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .wheel-hub-btn:hover:not(:disabled) {
          transform: translate(-50%, -50%) scale(1.06);
          box-shadow: 0 10px 24px rgba(107, 30, 46, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.8);
        }

        .wheel-hub-btn:active:not(:disabled) {
          transform: translate(-50%, -50%) scale(0.96);
        }

        .wheel-hub-btn.locked {
          background: #dfd7c2;
          border-color: #9a8878;
          cursor: not-allowed;
        }

        .hub-text {
          font-family: "Outfit", sans-serif;
          font-size: 14px;
          font-weight: 900;
          color: #6b1e2e;
          line-height: 1.1;
          letter-spacing: -0.2px;
        }

        .locked .hub-text {
          color: #9a8878;
        }

        .hub-subtext {
          font-size: 8px;
          font-weight: 800;
          color: #9a8878;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .locked .hub-subtext {
          color: #9a8878;
          content: "LOCKED";
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
