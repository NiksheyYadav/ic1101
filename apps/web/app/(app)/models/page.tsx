"use client";
import { Sparkles, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "../../../lib/api";

const recommended = [
  { name: "Vision Transformer", task: "Image Classification", acc: "96.2%", speed: "Medium", cost: "$0.12/hr", framework: "PyTorch", vram: "8 GB", color: "var(--violet)" },
  { name: "EfficientNet-B4", task: "Image Classification", acc: "94.8%", speed: "Fast", cost: "$0.04/hr", framework: "TensorFlow", vram: "4 GB", color: "var(--cyan)" },
  { name: "XGBoost", task: "Tabular", acc: "91.3%", speed: "Very Fast", cost: "$0.02/hr", framework: "XGBoost", vram: "2 GB", color: "var(--emerald)" },
];

const tags = ["All", "Computer Vision", "NLP", "Tabular", "Audio", "Time Series"];

export default function ModelSelectionPage() {
  const [allModels, setAllModels] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any[]>("/v1/models")
      .then(setAllModels)
      .catch(console.error);
  }, []);

  return (
    <div className="animate-in">
      <div className="page-header"><h2>Select a Model</h2></div>
      <div className="ai-insight mb-24">
        <div className="ai-insight-label"><Sparkles size={14} /> AI Recommendation</div>
        <p>Based on your tabular dataset with 34K rows and 21 features, we recommend <strong style={{ color: "var(--cyan)" }}>XGBoost</strong> for best accuracy-speed balance.</p>
      </div>
      <div className="flex-row mb-24" style={{ gap: 8 }}>
        {tags.map((t, i) => (<div key={t} className={`tab ${i === 0 ? "active" : ""}`} style={{ border: "1px solid var(--border)", borderRadius: 20, padding: "6px 16px" }}>{t}</div>))}
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Recommended for You</h3>
      <div className="grid-3 mb-32">
        {recommended.map((m) => (
          <div key={m.name} className="model-card" style={{ borderTopColor: m.color, borderTopWidth: 2 }}>
            <div className="flex-between mb-16"><Star size={16} color={m.color} /><span className="badge badge-violet">{m.framework}</span></div>
            <h4>{m.name}</h4>
            <div className="model-meta">{m.task}</div>
            <div className="model-stats">
              <div className="stat"><div className="stat-val" style={{ color: "var(--emerald)" }}>{m.acc}</div><div className="stat-label">Accuracy</div></div>
              <div className="stat"><div className="stat-val" style={{ color: "var(--cyan)" }}>{m.speed}</div><div className="stat-label">Speed</div></div>
              <div className="stat"><div className="stat-val" style={{ color: "var(--amber)" }}>{m.cost}</div><div className="stat-label">Cost</div></div>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12 }}>VRAM: {m.vram}</div>
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 14, justifyContent: "center" }}>Use This Model</button>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>All Models</h3>
      <div className="grid-3">
        {allModels.map((m) => (
          <div key={m.id} className="model-card">
            <h4>{m.name}</h4>
            <div className="model-meta">Version: {m.version} · Size: {m.model_size_mb ? `${m.model_size_mb} MB` : "-"}</div>
            <div className="model-stats">
              <div className="stat"><div className="stat-val" style={{ color: "var(--emerald)" }}>{m.accuracy ? `${(m.accuracy * 100).toFixed(1)}%` : "-"}</div><div className="stat-label">Accuracy</div></div>
              <div className="stat"><div className="stat-val" style={{ color: "var(--cyan)" }}>-</div><div className="stat-label">Speed</div></div>
              <div className="stat"><div className="stat-val" style={{ color: "var(--amber)" }}>-</div><div className="stat-label">Cost</div></div>
            </div>
            <button className="btn btn-secondary" style={{ width: "100%", marginTop: 14, justifyContent: "center" }}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}
