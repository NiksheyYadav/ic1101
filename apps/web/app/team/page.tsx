"use client";
import { UserPlus } from "lucide-react";
const members = [
  { name: "Admin User", role: "Owner", projects: 8, lastActive: "Just now", status: "online", color: "var(--gold)" },
  { name: "Jane Smith", role: "Admin", projects: 5, lastActive: "1h ago", status: "online", color: "var(--violet)" },
  { name: "Alex Johnson", role: "ML Engineer", projects: 12, lastActive: "3h ago", status: "away", color: "var(--cyan)" },
  { name: "Sarah Chen", role: "Data Scientist", projects: 7, lastActive: "1d ago", status: "offline", color: "var(--emerald)" },
  { name: "Mike Brown", role: "Viewer", projects: 2, lastActive: "2d ago", status: "offline", color: "var(--text-muted)" },
];
const activity = [
  { user: "Jane Smith", action: "started training job VisionTransformer-v3", time: "2h ago", color: "var(--cyan)" },
  { user: "Alex Johnson", action: "uploaded dataset medical-scan-v2", time: "4h ago", color: "var(--violet)" },
  { user: "System", action: "checkpoint created for Run-042", time: "6h ago", color: "var(--amber)" },
  { user: "Mike Brown", action: "commented on experiment EXP-092", time: "1d ago", color: "var(--emerald)" },
  { user: "Sarah Chen", action: "deployed XGBoost-Churn to production", time: "1d ago", color: "var(--cyan)" },
];
const statusColor: Record<string, string> = { online: "var(--emerald)", away: "var(--amber)", offline: "var(--text-muted)" };

export default function TeamPage() {
  return (
    <div className="animate-in">
      <div className="page-header"><h2>Team Workspace</h2><button className="btn btn-primary"><UserPlus size={14} /> Invite Member</button></div>
      <div className="grid-2-1">
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Team Members</h3>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Role</th><th>Projects</th><th>Last Active</th><th>Status</th></tr></thead>
            <tbody>{members.map((m) => (
              <tr key={m.name}>
                <td><div className="flex-row" style={{ gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000" }}>{m.name[0]}</div>
                  {m.name}
                </div></td>
                <td><span className="badge" style={{ background: `${m.color}22`, color: m.color }}>{m.role}</span></td>
                <td>{m.projects}</td><td style={{ color: "var(--text-muted)" }}>{m.lastActive}</td>
                <td><div className="flex-row" style={{ gap: 6 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor[m.status] }} /><span style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "capitalize" }}>{m.status}</span></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Activity Feed</h3>
          <div className="timeline">
            {activity.map((a, i) => (
              <div key={i} className="timeline-item" style={{ "--dot-color": a.color } as React.CSSProperties}>
                <div className="tl-text"><strong style={{ color: a.color }}>{a.user}</strong> {a.action}</div>
                <div className="tl-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
