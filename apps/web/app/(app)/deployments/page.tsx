"use client";
import { Sparkles, ExternalLink, Play, Copy } from "lucide-react";

const deployments = [
  { name: "VisionTransformer-v3", version: "v4.1", endpoint: "https://api.aetheris.ai/models/vt3/v1/predict", status: "active", latency: "42ms", rps: "1,247", uptime: "99.98%" },
  { name: "TextClassifier-v2", version: "v2.0", endpoint: "https://api.aetheris.ai/models/tc2/v1/predict", status: "active", latency: "28ms", rps: "3,891", uptime: "99.99%" },
  { name: "XGBoost-Churn", version: "v1.3", endpoint: "https://api.aetheris.ai/models/xgb/v1/predict", status: "stopped", latency: "—", rps: "—", uptime: "—" },
];

export default function DeploymentsPage() {
  return (
    <div className="animate-in">
      <div className="page-header"><h2>Deployments</h2><button className="btn btn-primary"><Play size={14} /> New Deployment</button></div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-label">Active Endpoints</div><div className="kpi-value emerald">2</div></div>
        <div className="kpi-card emerald"><div className="kpi-label">Avg Latency (p95)</div><div className="kpi-value cyan">38ms</div></div>
        <div className="kpi-card violet"><div className="kpi-label">Total Requests (24h)</div><div className="kpi-value violet">124K</div></div>
        <div className="kpi-card amber"><div className="kpi-label">Uptime</div><div className="kpi-value emerald">99.98%</div></div>
      </div>
      <div className="card mb-24">
        <table className="data-table">
          <thead><tr><th>Model</th><th>Version</th><th>Status</th><th>Endpoint</th><th>Latency</th><th>RPS</th><th>Uptime</th></tr></thead>
          <tbody>{deployments.map((d) => (
            <tr key={d.name}>
              <td style={{ fontWeight: 600 }}>{d.name}</td><td><span className="badge badge-violet">{d.version}</span></td>
              <td><span className={`badge ${d.status === "active" ? "badge-emerald" : "badge-red"}`}>{d.status}</span></td>
              <td className="mono" style={{ fontSize: 11 }}>{d.endpoint} <Copy size={12} style={{ cursor: "pointer", marginLeft: 4 }} /></td>
              <td className="mono">{d.latency}</td><td className="mono">{d.rps}</td>
              <td className="mono" style={{ color: d.uptime !== "—" ? "var(--emerald)" : "var(--text-muted)" }}>{d.uptime}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Test Inference</h3>
          <textarea className="input-field" rows={4} placeholder='{"features": [0.5, 0.3, 0.8, ...]}' style={{ fontFamily: "var(--font-mono)", fontSize: 12, marginBottom: 12 }} />
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Send Request</button>
          <div style={{ marginTop: 12, padding: 12, background: "var(--bg-primary)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 12 }}>
            <span style={{ color: "var(--text-muted)" }}>Response</span>
            <pre style={{ color: "var(--emerald)", marginTop: 8 }}>{`{"prediction": "churn", "confidence": 0.947, "latency_ms": 42}`}</pre>
          </div>
        </div>
        <div className="ai-insight" style={{ height: "fit-content" }}>
          <div className="ai-insight-label"><Sparkles size={14} /> Deployment Intelligence</div>
          <p>VisionTransformer-v3 handling 1,247 RPS with p95 latency of 42ms. Consider enabling auto-scaling — traffic increased 34% this week. Cost optimization: switch to spot GPU instances for $0.04/hr savings.</p>
        </div>
      </div>
    </div>
  );
}
