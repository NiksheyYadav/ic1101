"use client";
import { Sparkles, Play, Save, ArrowRight } from "lucide-react";

const steps = [
  { label: "Load Dataset", color: "var(--cyan)", icon: "📥" },
  { label: "Clean Missing", color: "var(--emerald)", icon: "🧹" },
  { label: "Encode Categorical", color: "var(--violet)", icon: "🔢" },
  { label: "Normalize Features", color: "var(--cyan)", icon: "📐", active: true },
  { label: "Train/Test Split", color: "var(--amber)", icon: "✂️" },
];
const blocks = [
  { label: "Text Tokenization", icon: "📝" }, { label: "Image Augmentation", icon: "🖼️" },
  { label: "Feature Selection", icon: "🎯" }, { label: "Balancing", icon: "⚖️" },
  { label: "Resizing", icon: "📏" }, { label: "PCA Reduction", icon: "📉" },
];

export default function PreprocessingPage() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <div><h2>Preprocessing Pipeline</h2><div className="breadcrumb">Customer Churn Pipeline</div></div>
        <div className="flex-row"><button className="btn btn-secondary"><Save size={14} /> Save</button><button className="btn btn-primary"><Play size={14} /> Run Pipeline</button></div>
      </div>
      <div className="grid-2-1 mb-24">
        <div>
          <div className="pipeline-canvas mb-24">
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              {steps.map((s, i) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className={`pipeline-node ${s.active ? "active" : ""}`} style={{ borderLeftColor: s.color, borderLeftWidth: 3 }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>{s.label}
                  </div>
                  {i < steps.length - 1 && <div className="pipeline-connector"><ArrowRight size={18} /></div>}
                </div>
              ))}
            </div>
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Available Blocks</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {blocks.map((b) => (
              <div key={b.label} className="card" style={{ padding: 14, cursor: "grab", textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{b.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card mb-16">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Step Configuration</h3>
            <p style={{ fontSize: 12, color: "var(--cyan)", fontWeight: 600, marginBottom: 12 }}>Normalize Features</p>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Method</label>
            <select className="input-field" style={{ marginBottom: 16 }}>
              <option>Min-Max Scaling</option><option>Standard (Z-score)</option><option>Robust Scaling</option>
            </select>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Columns</label>
            <div className="flex-row" style={{ flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {["age", "income", "purchase_amount"].map((c) => (<span key={c} className="badge badge-cyan">{c}</span>))}
            </div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Preview Output</label>
            <div className="toggle on" />
          </div>
          <div className="card mb-16">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Pipeline Preview</h3>
            <table className="data-table">
              <thead><tr><th>Column</th><th>Before</th><th>After</th></tr></thead>
              <tbody>
                <tr><td className="mono">age</td><td className="mono">25</td><td className="mono" style={{ color: "var(--emerald)" }}>0.312</td></tr>
                <tr><td className="mono">income</td><td className="mono">75000</td><td className="mono" style={{ color: "var(--emerald)" }}>0.681</td></tr>
                <tr><td className="mono">purchase</td><td className="mono">249.99</td><td className="mono" style={{ color: "var(--emerald)" }}>0.447</td></tr>
              </tbody>
            </table>
          </div>
          <div className="ai-insight">
            <div className="ai-insight-label"><Sparkles size={14} /> AI Suggestion</div>
            <p>Consider adding feature scaling before encoding for better model convergence. Robust scaling recommended for skewed income distribution.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
