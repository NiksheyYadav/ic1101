"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Sparkles, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "../../../lib/api";

const chartData = Array.from({ length: 100 }, (_, i) => ({
  epoch: i + 1,
  exp042: +(1 / (i + 1) + Math.random() * 0.01).toFixed(4),
  exp041: +(1.2 / (i + 1) + Math.random() * 0.015).toFixed(4),
  exp039: +(1.5 / (i + 1) + Math.random() * 0.02).toFixed(4),
}));

export default function ExperimentsPage() {
  const [runs, setRuns] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any[]>("/v1/experiments")
      .then(setRuns)
      .catch(console.error);
  }, []);

  // Determine winner based on highest accuracy
  const highestAccExp = runs.reduce((prev, current) => {
    return (prev.metrics?.accuracy > current.metrics?.accuracy) ? prev : current;
  }, runs[0] || null);

  return (
    <div className="animate-in">
      <div className="page-header"><h2>Experiments Comparison</h2>
        <div className="flex-row"><button className="btn btn-secondary">+ Add Run</button><button className="btn btn-primary"><Download size={14} /> Export Report</button></div>
      </div>
      <div className="flex-row mb-24" style={{ gap: 8 }}>
        {runs.map((r) => {
          const isWinner = r.id === highestAccExp?.id;
          return <span key={r.id} className={`badge ${isWinner ? "badge-gold" : "badge-cyan"}`}>{isWinner && <Trophy size={10} />} {r.name}</span>
        })}
      </div>
      <div className="chart-card mb-24">
        <h3>Loss Comparison</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D4FF" stopOpacity={0.2} /><stop offset="100%" stopColor="#00D4FF" stopOpacity={0} /></linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} /><stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient>
              <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3DDC97" stopOpacity={0.2} /><stop offset="100%" stopColor="#3DDC97" stopOpacity={0} /></linearGradient>
            </defs>
            <XAxis dataKey="epoch" tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0D1225", border: "1px solid #1A2140", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="exp042" stroke="#00D4FF" fill="url(#g1)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="exp041" stroke="#8B5CF6" fill="url(#g2)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="exp039" stroke="#3DDC97" fill="url(#g3)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card mb-24">
        <table className="data-table">
          <thead><tr><th>Run</th><th>Name</th><th>Accuracy</th><th>Loss</th><th>F1</th><th>Time</th><th>GPU Hours</th><th>Cost</th></tr></thead>
          <tbody>{runs.map((r) => {
            const isWinner = r.id === highestAccExp?.id;
            return (
              <tr key={r.id} style={isWinner ? { background: "#FFB80008" } : {}}>
                <td className="mono" style={{ color: isWinner ? "var(--gold)" : "var(--cyan)" }}>{isWinner && <Trophy size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />}{r.id.substring(0,8)}</td>
                <td>{r.name}</td>
                <td style={{ color: "var(--emerald)" }}>{r.metrics?.accuracy ? `${(r.metrics.accuracy * 100).toFixed(1)}%` : "-"}</td>
                <td className="mono">{r.metrics?.loss || "-"}</td>
                <td className="mono">{r.metrics?.f1 || "-"}</td>
                <td>-</td><td className="mono">-</td><td className="mono">-</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      <div className="ai-insight">
        <div className="ai-insight-label"><Sparkles size={14} /> AI Analysis</div>
        <p>Latest experiment analysis indicates the top performing run optimized accuracy effectively.</p>
      </div>
    </div>
  );
}
