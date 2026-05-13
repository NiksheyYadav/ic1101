"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
const cpuData = Array.from({ length: 24 }, (_, i) => ({ h: `${i}:00`, cpu: 30 + Math.random() * 40, gpu: 50 + Math.random() * 40, mem: 40 + Math.random() * 30 }));
const alerts = [
  { level: "warn", msg: "GPU-3 temperature spike: 82°C", time: "2m ago" },
  { level: "ok", msg: "Auto-scaling triggered: +1 worker node", time: "15m ago" },
  { level: "ok", msg: "Checkpoint backup completed", time: "1h ago" },
];
export default function MonitoringPage() {
  return (
    <div className="animate-in">
      <div className="page-header"><h2>Monitoring</h2></div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-label">Cluster Nodes</div><div className="kpi-value cyan">4</div></div>
        <div className="kpi-card emerald"><div className="kpi-label">GPU Avg Temp</div><div className="kpi-value amber">71°C</div></div>
        <div className="kpi-card violet"><div className="kpi-label">Network I/O</div><div className="kpi-value violet">2.4 Gbps</div></div>
        <div className="kpi-card amber"><div className="kpi-label">Active Workers</div><div className="kpi-value emerald">7</div></div>
      </div>
      <div className="chart-card mb-24">
        <h3>Infrastructure Telemetry (24h)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={cpuData}>
            <defs>
              <linearGradient id="mc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D4FF" stopOpacity={0.2} /><stop offset="100%" stopColor="#00D4FF" stopOpacity={0} /></linearGradient>
              <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3DDC97" stopOpacity={0.2} /><stop offset="100%" stopColor="#3DDC97" stopOpacity={0} /></linearGradient>
            </defs>
            <XAxis dataKey="h" tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "#0D1225", border: "1px solid #1A2140", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="cpu" stroke="#00D4FF" fill="url(#mc)" strokeWidth={2} dot={false} name="CPU" />
            <Area type="monotone" dataKey="gpu" stroke="#3DDC97" fill="url(#mg)" strokeWidth={2} dot={false} name="GPU" />
            <Area type="monotone" dataKey="mem" stroke="#8B5CF6" fill="none" strokeWidth={1.5} dot={false} name="Memory" strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>System Alerts</h3>
        {alerts.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
            {a.level === "warn" ? <AlertTriangle size={16} color="var(--amber)" /> : <CheckCircle size={16} color="var(--emerald)" />}
            <span style={{ flex: 1, fontSize: 13 }}>{a.msg}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
