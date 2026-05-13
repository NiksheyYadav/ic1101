"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Sparkles } from "lucide-react";
const costData = Array.from({ length: 30 }, (_, i) => ({ day: `May ${i + 1}`, compute: 40 + Math.random() * 30, storage: 10 + Math.random() * 8, inference: 5 + Math.random() * 5 }));
const breakdown = [
  { name: "Compute", value: 67, color: "#00D4FF" }, { name: "Storage", value: 20, color: "#8B5CF6" },
  { name: "Inference", value: 8, color: "#3DDC97" }, { name: "Network", value: 5, color: "#FFD166" },
];
const quotas = [
  { label: "GPU Allocation", used: 67, total: 100, unit: "hours", color: "var(--cyan)" },
  { label: "Storage", used: 1.48, total: 2.0, unit: "TB", color: "var(--violet)" },
  { label: "API Calls", used: 145, total: 200, unit: "K", color: "var(--amber)" },
];
export default function BillingPage() {
  return (
    <div className="animate-in">
      <div className="page-header"><h2>Billing & Usage</h2></div>
      <div className="tabs"><div className="tab active">Overview</div><div className="tab">Usage</div><div className="tab">Invoices</div><div className="tab">Budgets</div></div>
      <div className="kpi-grid">
        <div className="kpi-card amber"><div className="kpi-label">Total Spend</div><div className="kpi-value amber">$2,450</div><div className="kpi-trend up">↑ 12% vs last month</div></div>
        <div className="kpi-card"><div className="kpi-label">GPU Hours</div><div className="kpi-value cyan">841</div></div>
        <div className="kpi-card violet"><div className="kpi-label">Storage Used</div><div className="kpi-value violet">1.48 TB</div></div>
        <div className="kpi-card emerald"><div className="kpi-label">Active Models</div><div className="kpi-value emerald">3</div></div>
      </div>
      <div className="grid-2-1 mb-24">
        <div className="chart-card">
          <h3>Cost Over Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={costData}>
              <defs>
                <linearGradient id="bc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D4FF" stopOpacity={0.3} /><stop offset="100%" stopColor="#00D4FF" stopOpacity={0} /></linearGradient>
                <linearGradient id="bs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} /><stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: "#4A5578", fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0D1225", border: "1px solid #1A2140", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="compute" stroke="#00D4FF" fill="url(#bc)" strokeWidth={2} dot={false} stackId="1" />
              <Area type="monotone" dataKey="storage" stroke="#8B5CF6" fill="url(#bs)" strokeWidth={2} dot={false} stackId="1" />
              <Area type="monotone" dataKey="inference" stroke="#3DDC97" fill="none" strokeWidth={1.5} dot={false} stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, alignSelf: "flex-start" }}>Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={breakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                {breakdown.map((e) => (<Cell key={e.name} fill={e.color} />))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0D1225", border: "1px solid #1A2140", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            {breakdown.map((b) => (<div key={b.name} className="flex-row" style={{ gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: b.color }} /><span style={{ fontSize: 11, color: "var(--text-muted)" }}>{b.name} {b.value}%</span></div>))}
          </div>
        </div>
      </div>
      <div className="card mb-24">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Resource Quotas</h3>
        {quotas.map((q) => (
          <div key={q.label} style={{ marginBottom: 14 }}>
            <div className="flex-between" style={{ fontSize: 12, marginBottom: 4 }}>
              <span>{q.label}</span><span className="mono" style={{ color: q.color }}>{q.used} / {q.total} {q.unit}</span>
            </div>
            <div className="progress-bar"><div style={{ width: `${(q.used / q.total) * 100}%`, height: "100%", borderRadius: 3, background: q.color, boxShadow: `0 0 8px ${q.color}44` }} /></div>
          </div>
        ))}
      </div>
      <div className="ai-insight">
        <div className="ai-insight-label"><Sparkles size={14} /> Cost Intelligence</div>
        <p>GPU costs increased 23% this month. Consider spot instances for non-critical training runs — projected savings of $340/month. Storage cleanup could recover 180 GB of unused dataset versions.</p>
      </div>
    </div>
  );
}
