"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login delay, then redirect to dashboard
    // The BootLoader sitewide component will automatically run if we do a hard navigation,
    // but with router.push it's a soft navigation. We can do window.location.href to trigger
    // the full cinematic boot loader experience!
    window.location.href = "/dashboard";
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

        <form style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }} onSubmit={handleLogin}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>Email</label>
            <input 
              type="email" 
              placeholder="admin@aetheris.ai" 
              required
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

        <button className="btn-outline-cinematic" style={{ width: "100%", justifyContent: "center", color: "#fff", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          Continue with GitHub
        </button>

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 32 }}>
          Don't have an account? <a href="#" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>Request Access</a>
        </p>
      </motion.div>
    </div>
  );
}
