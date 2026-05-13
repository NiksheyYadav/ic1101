"use client";
import { Plus } from "lucide-react";
const projects = [
  { name: "Churn Prediction", datasets: 3, jobs: 12, models: 2, status: "active", updated: "2h ago" },
  { name: "Image Classification", datasets: 5, jobs: 24, models: 4, status: "active", updated: "1d ago" },
  { name: "Sentiment Analysis", datasets: 2, jobs: 8, models: 1, status: "active", updated: "3d ago" },
  { name: "Fraud Detection", datasets: 4, jobs: 18, models: 3, status: "paused", updated: "1w ago" },
];
export default function ProjectsPage() {
  return (
    <div className="animate-in">
      <div className="page-header"><h2>Projects</h2><button className="btn btn-primary"><Plus size={14} /> New Project</button></div>
      <div className="grid-2">
        {projects.map((p) => (
          <div key={p.name} className="card" style={{ cursor: "pointer" }}>
            <div className="flex-between mb-16">
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</h3>
              <span className={`badge ${p.status === "active" ? "badge-emerald" : "badge-amber"}`}>{p.status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--cyan)" }}>{p.datasets}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Datasets</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--violet)" }}>{p.jobs}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Training Jobs</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--emerald)" }}>{p.models}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Models</div></div>
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-muted)" }}>Updated {p.updated}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
