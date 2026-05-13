import "./marketing.css";
import { CustomCursor } from "../../components/CustomCursor";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-body">
      <CustomCursor />
      <nav className="top-nav">
        <a href="/" className="nav-logo">
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg, var(--cyan), var(--violet))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>A</div>
          Aetheris AI
        </a>
        <div style={{ display: "flex", gap: 32, fontSize: 14, fontWeight: 500 }}>
          <span className="nav-link">Product</span>
          <span className="nav-link">Models</span>
          <span className="nav-link">Enterprise</span>
          <span className="nav-link">Pricing</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/signin" className="btn-outline-cinematic" style={{ padding: "8px 20px", fontSize: 14 }}>Sign In</a>
          <a href="/signin" className="btn-cinematic" style={{ padding: "8px 20px", fontSize: 14, boxShadow: "none" }}>Get Started</a>
        </div>
      </nav>
      {children}
    </div>
  );
}
