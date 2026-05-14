"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { API_BASE } from "../../../lib/api";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error === "github_not_configured") {
      setErrorMsg("GitHub Login is currently unavailable. Please use email/password.");
    } else if (error === "CredentialsSignin") {
      setErrorMsg("Invalid email or password. Please try again.");
    } else if (error) {
      setErrorMsg("An authentication error occurred. Please try again.");
    }
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setErrorMsg("Invalid credentials. Please try again.");
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleGithubLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
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
        <div style={{ marginBottom: 40, position: "relative", display: "inline-block" }}>
          {/* Magnetic Aura */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ 
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
              width: 140, height: 140, borderRadius: "50%", 
              background: "radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)",
              filter: "blur(30px)", zIndex: -1 
            }} 
          />
          <motion.img 
            src="/aetheris-logo.png" 
            alt="Aetheris Logo" 
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
            style={{ 
              width: 90, height: 90, borderRadius: 24, 
              boxShadow: "0 0 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 212, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          />
        </div>
        
        <h1 style={{ fontSize: 24, fontWeight: 600, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" }}>Welcome back</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32, textAlign: "center" }}>Enter your credentials to access the command center.</p>

        <form
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}
          onSubmit={handleLogin}
        >
          {errorMsg && !window.location.search.includes("github") && (
            <div style={{ width: "100%", padding: "10px 12px", background: "rgba(255, 68, 68, 0.1)", border: "1px solid rgba(255, 68, 68, 0.2)", borderRadius: 8, color: "#ff4444", fontSize: 12, textAlign: "center", marginBottom: 8 }}>
              {errorMsg}
            </div>
          )}

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
              suppressHydrationWarning
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

        {errorMsg && window.location.search.includes("github") && (
          <div style={{ width: "100%", padding: "10px 12px", background: "rgba(255, 68, 68, 0.1)", border: "1px solid rgba(255, 68, 68, 0.2)", borderRadius: 8, color: "#ff4444", fontSize: 12, textAlign: "center", marginBottom: 16 }}>
            {errorMsg}
          </div>
        )}

        <button 
          onClick={handleGithubLogin}
          type="button"
          className="btn-outline-cinematic" 
          style={{ width: "100%", justifyContent: "center", color: "#fff", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", gap: 12 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span style={{ fontWeight: 600 }}>Continue with GitHub</span>
        </button>

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 32 }}>
          Don't have an account? <a href="#" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>Request Access</a>
        </p>
      </motion.div>
    </div>
  );
}
