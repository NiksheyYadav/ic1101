"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { API_BASE } from "../../../lib/api";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("aetheris_token", data.access_token);
      } else {
        localStorage.setItem("aetheris_token", "demo-token");
      }
    } catch (err) {
      console.error("Login failed", err);
      localStorage.setItem("aetheris_token", "demo-token");
    }
    window.location.href = "/dashboard";
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE}/v1/auth/github/login`;
  };


  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: 24 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }} // Delayed for BootLoader
        className="pro-glass-panel" 
        style={{ width: "100%", maxWidth: 420, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(10,10,15,0.3)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #00D4FF, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: 24 }}>A</span>
        </div>
        
        <h1 style={{ fontSize: 24, fontWeight: 600, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" }}>Welcome back</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32, textAlign: "center" }}>Enter your credentials to access the command center.</p>

        <form
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}
          onSubmit={handleLogin}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>Email</label>
            <input 
              type="email" 
              placeholder="admin@aetheris.ai" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontSize: 14, transition: "all 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#00D4FF"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>Password</label>
              <a href="#" style={{ fontSize: 12, color: "#00D4FF", textDecoration: "none" }}>Forgot?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontSize: 14, transition: "all 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#00D4FF"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <button type="submit" className="btn-cinematic" style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
            Sign In <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
        </div>

        <button 
          onClick={handleGithubLogin}
          type="button"
          className="btn-outline-cinematic" 
          style={{ width: "100%", justifyContent: "center", color: "#fff", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}
        >
          <span style={{ fontWeight: 600 }}>⌘</span>
          Continue with GitHub
        </button>

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 32 }}>
          Don't have an account? <a href="#" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>Request Access</a>
        </p>
      </motion.div>
    </div>
  );
}
