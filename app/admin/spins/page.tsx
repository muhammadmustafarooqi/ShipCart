"use client";

import { useEffect, useState } from "react";
import { Sparkles, Calendar, User, Phone, MapPin, Gift, Trophy, RefreshCw, Search } from "lucide-react";

interface SpinResult {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  spinResult: string;
  spunAt: string;
}

export default function SpinsAdminPage() {
  const [spins, setSpins] = useState<SpinResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSpins = () => {
    setLoading(true);
    fetch("/api/admin/spins")
      .then((r) => r.json())
      .then((data) => {
        setSpins(data.spins || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSpins();
  }, []);

  // Filtered spins
  const filteredSpins = spins.filter((spin) => {
    const term = searchTerm.toLowerCase();
    return (
      (spin.name || "").toLowerCase().includes(term) ||
      (spin.email || "").toLowerCase().includes(term) ||
      (spin.phone || "").includes(term) ||
      (spin.spinResult || "").toLowerCase().includes(term)
    );
  });

  // Calculate statistics
  const totalSpins = spins.length;
  
  // Calculate prize counts
  const prizeCounts: Record<string, number> = {};
  spins.forEach((s) => {
    if (s.spinResult) {
      prizeCounts[s.spinResult] = (prizeCounts[s.spinResult] || 0) + 1;
    }
  });

  // Get top prize
  let topPrize = "None";
  let topPrizeCount = 0;
  Object.entries(prizeCounts).forEach(([prize, count]) => {
    if (count > topPrizeCount) {
      topPrize = prize;
      topPrizeCount = count;
    }
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#1f2937", marginBottom: "8px", fontFamily: "Outfit, sans-serif" }}>
            Spin Results
          </h1>
          <p style={{ color: "#6b7280", fontSize: "15px", fontWeight: 500 }}>
            Monitor real-time customer spins and prizes won from the homepage wheel.
          </p>
        </div>
        <button 
          onClick={fetchSpins} 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            padding: "10px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            transition: "all 0.2s"
          }}
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px", fontWeight: 500 }}>Total Spins</p>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>{totalSpins}</div>
            </div>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #ff6b00, #dd4b00)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(255,107,0,0.25)", color: "white" }}>
              <Sparkles size={24} />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>Prizes claimed by customers</p>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px", fontWeight: 500 }}>Most Common Prize</p>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }} title={topPrize}>
                {topPrize}
              </div>
            </div>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(16,185,129,0.25)", color: "white" }}>
              <Trophy size={24} />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>Won {topPrizeCount} times</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>
        {/* Table list */}
        <div style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937", fontFamily: "Outfit, sans-serif" }}>All Spins</h2>
            
            {/* Search filter */}
            <div style={{ position: "relative", width: "260px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input 
                type="text" 
                placeholder="Search spins..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 36px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "13px",
                  outline: "none",
                  transition: "all 0.2s"
                }}
              />
            </div>
          </div>

          {filteredSpins.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact Info</th>
                    <th>Location</th>
                    <th>Prize Won</th>
                    <th>Date Spun</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpins.map((spin) => (
                    <tr key={spin._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #6b1e2e, #c9a84c)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "13px" }}>
                            {(spin.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "14px", color: "#1f2937" }}>{spin.name}</div>
                            <div style={{ fontSize: "11px", color: "#9ca3af" }}>{spin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6b7280" }}>
                          <Phone size={12} style={{ color: "#9ca3af" }} />
                          {spin.phone}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6b7280" }}>
                          <MapPin size={12} style={{ color: "#9ca3af" }} />
                          {spin.city || "Not set"}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(107, 30, 46, 0.08)", padding: "5px 12px", borderRadius: "20px", border: "1px solid rgba(107, 30, 46, 0.15)" }}>
                          <Gift size={12} style={{ color: "#6b1e2e" }} />
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#6b1e2e" }}>{spin.spinResult}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#9ca3af" }}>
                          <Calendar size={12} />
                          {spin.spunAt ? new Date(spin.spunAt).toLocaleDateString("en-PK") : "N/A"}{" "}
                          {spin.spunAt ? new Date(spin.spunAt).toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit" }) : ""}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
              <Sparkles size={48} style={{ margin: "0 auto 16px", color: "#e5e7eb" }} />
              <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>No spin results found</p>
              <p style={{ fontSize: "14px" }}>
                {searchTerm ? "Try adjusting your search query." : "Results will appear here as customers spin the wheel."}
              </p>
            </div>
          )}
        </div>

        {/* Prize Distribution panel */}
        <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937", marginBottom: "20px", fontFamily: "Outfit, sans-serif" }}>
            Prize Distribution
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(prizeCounts).sort((a,b) => b[1] - a[1]).map(([prize, count]) => {
              const percentage = totalSpins > 0 ? (count / totalSpins) * 100 : 0;
              return (
                <div key={prize}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                    <span style={{ color: "#4b5563" }}>{prize}</span>
                    <span style={{ color: "#1f2937" }}>{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${percentage}%`, background: "linear-gradient(90deg, #6b1e2e, #c9a84c)", borderRadius: "4px" }} />
                  </div>
                </div>
              );
            })}

            {Object.keys(prizeCounts).length === 0 && (
              <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center" }}>No statistics available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
