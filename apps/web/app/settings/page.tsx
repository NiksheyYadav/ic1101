"use client";
import { Save } from "lucide-react";
export default function SettingsPage() {
  return (
    <div className="animate-in">
      <div className="page-header"><h2>Settings</h2></div>
      <div className="grid-1-2">
        <div>
          <div className="card" style={{ padding: 0 }}>
            {["General", "Notifications", "Security", "API Keys", "Integrations"].map((t, i) => (
              <div key={t} className="nav-item" style={{ padding: "12px 18px", borderRadius: 0, borderLeft: i === 0 ? "3px solid var(--cyan)" : "3px solid transparent", color: i === 0 ? "var(--cyan)" : "var(--text-secondary)" }}>{t}</div>
            ))}
          </div>
        </div>
        <div>
          <div className="card mb-24">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>General Settings</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Workspace Name</label>
              <input className="input-field" defaultValue="Aetheris Research Lab" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Project Prefix</label>
              <input className="input-field" defaultValue="AET-" style={{ maxWidth: 200 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Default Region</label>
              <select className="input-field"><option>US-East (Virginia)</option><option>EU-West (Ireland)</option><option>AP-South (Mumbai)</option></select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Default Compute</label>
              <select className="input-field"><option>NVIDIA A100</option><option>NVIDIA T4</option><option>NVIDIA V100</option><option>CPU Only</option></select>
            </div>
          </div>
          <div className="card mb-24">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Preferences</h3>
            {[
              { label: "Email Notifications", on: true },
              { label: "Training Job Alerts", on: true },
              { label: "Billing Alerts", on: true },
              { label: "Auto-checkpoint (every 10 epochs)", on: true },
              { label: "Dark Theme", on: true },
            ].map((p) => (
              <div key={p.label} className="flex-between" style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 13 }}>{p.label}</span>
                <div className={`toggle ${p.on ? "on" : ""}`} />
              </div>
            ))}
            <div style={{ marginBottom: 20, marginTop: 20 }}>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Default Learning Rate</label>
              <input className="input-field mono" defaultValue="3e-4" style={{ maxWidth: 200 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Timezone</label>
              <select className="input-field"><option>UTC+5:30 (IST)</option><option>UTC-5:00 (EST)</option><option>UTC+0:00 (GMT)</option></select>
            </div>
          </div>
          <div className="flex-row" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn-ghost">Reset to Defaults</button>
            <button className="btn btn-primary"><Save size={14} /> Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
