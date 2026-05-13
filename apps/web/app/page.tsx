"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Zap, Upload, Rocket, GitCompare, TrendingUp, TrendingDown, Sparkles } from "lucide-react";

const lossData = Array.from({ length: 30 }, (_, i) => ({
  epoch: i + 1, loss: +(1 / (i + 1) + Math.random() * 0.05).toFixed(4),
  acc: +(0.5 + (i / 50) + Math.random() * 0.02).toFixed(4),
}));
const gpuData = Array.from({ length: 12 }, (_, i) => ({ h: `${i * 2}:00`, usage: 60 + Math.random() * 30 }));
const jobs = [
  { name: "VisionTransformer-v3", progress: 71, acc: "94.28%", eta: "1h 42m", status: "running" },
  { name: "BERT-FineTune-v2", progress: 45, acc: "88.71%", eta: "3h 15m", status: "running" },
  { name: "ResNet-50-Retrain", progress: 92, acc: "96.12%", eta: "12m", status: "running" },
];
const experiments = [
  { id: "EXP-042", model: "VisionTransformer", acc: "96.2%", loss: "0.041", status: "completed" },
  { id: "EXP-041", model: "EfficientNet-B4", acc: "94.8%", loss: "0.058", status: "completed" },
  { id: "EXP-039", model: "XGBoost-v3", acc: "91.3%", loss: "0.092", status: "completed" },
];

export default function DashboardPage() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h2>Welcome back, Admin 👋</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Here&apos;s what&apos;s happening across your AI infrastructure.</p>
        </div>
        <div className="flex-row">
          <button className="btn btn-primary"><Zap size={14} /> New Training</button>
          <button className="btn btn-secondary"><Upload size={14} /> Upload Dataset</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-label">Active Trainings</div><div className="kpi-value cyan">3</div><div className="kpi-trend up"><TrendingUp size={12} /> +1 from yesterday</div></div>
        <div className="kpi-card emerald"><div className="kpi-label">GPU Utilization</div><div className="kpi-value emerald">87%</div><div className="kpi-trend up"><TrendingUp size={12} /> Optimal</div></div>
        <div className="kpi-card violet"><div className="kpi-label">Data Volume</div><div className="kpi-value violet">61.3 GB</div><div className="kpi-trend up"><TrendingUp size={12} /> +2.4 GB today</div></div>
        <div className="kpi-card amber"><div className="kpi-label">Models in Production</div><div className="kpi-value amber">12</div><div className="kpi-trend up"><TrendingUp size={12} /> All healthy</div></div>
      </div>

      <div className="grid-2-1 mb-24">
        <div className="chart-card">
          <h3>Training Progress</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={lossData}>
              <defs>
                <linearGradient id="glowCyan" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D4FF" stopOpacity={0.3} /><stop offset="100%" stopColor="#00D4FF" stopOpacity={0} /></linearGradient>
                <linearGradient id="glowViolet" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} /><stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="epoch" tick={{ fill: "#4A5578", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4A5578", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0D1225", border: "1px solid #1A2140", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="loss" stroke="#00D4FF" fill="url(#glowCyan)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="acc" stroke="#8B5CF6" fill="url(#glowViolet)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>GPU Usage (24h)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={gpuData}>
              <XAxis dataKey="h" tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#0D1225", border: "1px solid #1A2140", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="usage" fill="#3DDC9766" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2 mb-24">
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Active Training Jobs</h3>
          {jobs.map((j) => (
            <div key={j.name} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{j.name}</span>
                <span className="badge badge-cyan">{j.status}</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${j.progress}%` }} /></div>
              <div className="flex-between" style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
                <span>Accuracy: <span style={{ color: "var(--emerald)" }}>{j.acc}</span></span>
                <span>ETA: {j.eta}</span>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="card mb-16">
            <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Recent Experiments</h3>
            <table className="data-table">
              <thead><tr><th>ID</th><th>Model</th><th>Accuracy</th><th>Loss</th></tr></thead>
              <tbody>{experiments.map((e) => (
                <tr key={e.id}><td className="mono" style={{ color: "var(--cyan)" }}>{e.id}</td><td>{e.model}</td><td style={{ color: "var(--emerald)" }}>{e.acc}</td><td className="mono">{e.loss}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <div className="ai-insight">
            <div className="ai-insight-label"><Sparkles size={14} /> AI Insight</div>
            <p>Training accuracy is improving steadily. Consider reducing learning rate by 12% after epoch 150 for optimal convergence. GPU memory at 87% — safe for current batch size.</p>
          </div>
        </div>
      </div>

      <div className="flex-row">
        <button className="btn btn-secondary"><GitCompare size={14} /> Compare Runs</button>
        <button className="btn btn-secondary"><Rocket size={14} /> Deploy Model</button>
      </div>
    </div>
  );
}
