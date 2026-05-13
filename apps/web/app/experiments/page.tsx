"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Sparkles, Trophy } from "lucide-react";

const runs = [
  { id: "EXP-042", model: "VisionTransformer", acc: "96.2%", loss: "0.041", f1: "0.958", prec: "0.962", recall: "0.954", time: "4h 12m", gpu: "8.2h", cost: "$0.98", winner: true },
  { id: "EXP-041", model: "EfficientNet-B4", acc: "94.8%", loss: "0.058", f1: "0.941", prec: "0.948", recall: "0.935", time: "2h 45m", gpu: "5.4h", cost: "$0.65", winner: false },
  { id: "EXP-039", model: "XGBoost-v3", acc: "91.3%", loss: "0.092", f1: "0.908", prec: "0.915", recall: "0.901", time: "18m", gpu: "0.3h", cost: "$0.04", winner: false },
];
const chartData = Array.from({ length: 100 }, (_, i) => ({
  epoch: i + 1,
  exp042: +(1 / (i + 1) + Math.random() * 0.01).toFixed(4),
  exp041: +(1.2 / (i + 1) + Math.random() * 0.015).toFixed(4),
  exp039: +(1.5 / (i + 1) + Math.random() * 0.02).toFixed(4),
}));

export default function ExperimentsPage() {
  return (
    <div className="animate-in">
      <div className="page-header"><h2>Experiments Comparison</h2>
        <div className="flex-row"><button className="btn btn-secondary">+ Add Run</button><button className="btn btn-primary"><Download size={14} /> Export Report</button></div>
      </div>
      <div className="flex-row mb-24" style={{ gap: 8 }}>
        {runs.map((r) => (<span key={r.id} className={`badge ${r.winner ? "badge-gold" : "badge-cyan"}`}>{r.winner && <Trophy size={10} />} {r.id}</span>))}
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
          <thead><tr><th>Run</th><th>Model</th><th>Accuracy</th><th>Loss</th><th>F1</th><th>Precision</th><th>Recall</th><th>Time</th><th>GPU Hours</th><th>Cost</th></tr></thead>
          <tbody>{runs.map((r) => (
            <tr key={r.id} style={r.winner ? { background: "#FFB80008" } : {}}>
              <td className="mono" style={{ color: r.winner ? "var(--gold)" : "var(--cyan)" }}>{r.winner && <Trophy size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />}{r.id}</td>
              <td>{r.model}</td><td style={{ color: "var(--emerald)" }}>{r.acc}</td><td className="mono">{r.loss}</td>
              <td className="mono">{r.f1}</td><td className="mono">{r.prec}</td><td className="mono">{r.recall}</td>
              <td>{r.time}</td><td className="mono">{r.gpu}</td><td className="mono">{r.cost}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="ai-insight">
        <div className="ai-insight-label"><Sparkles size={14} /> AI Analysis</div>
        <p>EXP-042 achieved <strong style={{ color: "var(--emerald)" }}>2.3% higher accuracy</strong> with <strong style={{ color: "var(--cyan)" }}>18% less compute</strong> than the baseline. Key differentiator: AdamW optimizer with cosine LR scheduler outperformed SGD.</p>
      </div>
    </div>
  );
}
