"use client";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch, AuthError } from "../../../lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any[]>("/v1/projects")
      .then(setProjects)
      .catch((e) => {
        if (!(e instanceof AuthError)) console.error(e);
      });
  }, []);

  return (
    <div className="animate-in">
      <div className="page-header"><h2>Projects</h2><button className="btn btn-primary"><Plus size={14} /> New Project</button></div>
      <div className="grid-2">
        {projects.map((p) => (
          <div key={p.id} className="card" style={{ cursor: "pointer" }}>
            <div className="flex-between mb-16">
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</h3>
              <span className={`badge badge-emerald`}>active</span>
            </div>
            {p.description && <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>{p.description}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--cyan)" }}>-</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Datasets</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--violet)" }}>-</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Training Jobs</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--emerald)" }}>-</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Models</div></div>
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-muted)" }}>Workspace ID: {p.workspace_id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
