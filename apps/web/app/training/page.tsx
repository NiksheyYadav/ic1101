"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Pause, Play, Square, Download, Sparkles } from "lucide-react";

const epochs = Array.from({ length: 142 }, (_, i) => ({
  epoch: i + 1,
  loss: +(1 / (i + 1) + Math.random() * 0.02).toFixed(4),
  val_acc: +(0.5 + i / 250 + Math.random() * 0.01).toFixed(4),
  lr: +(0.001 * Math.pow(0.99, i)).toFixed(6),
}));
const logs = [
  { time: "14:23:01", level: "info", msg: "Epoch 142/200 completed — loss: 0.086, acc: 94.28%" },
  { time: "14:22:48", level: "info", msg: "Checkpoint saved at epoch 140" },
  { time: "14:21:15", level: "warn", msg: "Validation loss plateau detected (3 epochs)" },
  { time: "14:20:02", level: "info", msg: "GPU temperature stable at 73°C" },
  { time: "14:18:30", level: "info", msg: "Epoch 141/200 completed — loss: 0.088, acc: 94.12%" },
];
const telemetry = [
  { label: "GPU", value: 82, color: "var(--emerald)" },
  { label: "CPU", value: 45, color: "var(--cyan)" },
  { label: "RAM", value: 67, color: "var(--violet)" },
  { label: "VRAM", value: 88, color: "var(--amber)" },
];

export default function TrainingMonitorPage() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="flex-row" style={{ gap: 12 }}>
            <h2>VisionTransformer-v3</h2>
            <span className="badge badge-cyan" style={{ fontSize: 12 }}>● TRAINING</span>
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Epoch 142 / 200 · Started 4h 18m ago</div>
        </div>
        <div className="flex-row">
          <button className="btn btn-secondary"><Pause size={14} /> Pause</button>
          <button className="btn btn-danger"><Square size={14} /> Cancel</button>
          <button className="btn btn-secondary"><Download size={14} /> Checkpoint</button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: "71%" }} />
        </div>
        <div className="flex-between" style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
          <span>71% complete</span><span>ETA: 1h 42m</span>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-label">Loss</div><div className="kpi-value emerald">0.086</div><div className="kpi-trend up">↓ decreasing</div></div>
        <div className="kpi-card emerald"><div className="kpi-label">Accuracy</div><div className="kpi-value cyan">94.28%</div><div className="kpi-trend up">↑ improving</div></div>
        <div className="kpi-card amber"><div className="kpi-label">Learning Rate</div><div className="kpi-value amber">3.1e-4</div><div className="kpi-trend">cosine decay</div></div>
        <div className="kpi-card violet"><div className="kpi-label">Throughput</div><div className="kpi-value violet">847</div><div className="kpi-trend">samples/sec</div></div>
      </div>

      <div className="grid-2-1 mb-24">
        <div className="chart-card">
          <h3>Training Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={epochs}>
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D4FF" stopOpacity={0.25} /><stop offset="100%" stopColor="#00D4FF" stopOpacity={0} /></linearGradient>
                <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} /><stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="epoch" tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0D1225", border: "1px solid #1A2140", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="loss" stroke="#00D4FF" fill="url(#lg1)" strokeWidth={2} dot={false} name="Loss" />
              <Area type="monotone" dataKey="val_acc" stroke="#8B5CF6" fill="url(#lg2)" strokeWidth={2} dot={false} name="Val Accuracy" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="card mb-16">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>System Telemetry</h3>
            {telemetry.map((t) => (
              <div key={t.label} style={{ marginBottom: 14 }}>
                <div className="flex-between" style={{ fontSize: 12, marginBottom: 4 }}>
                  <span>{t.label}</span><span className="mono" style={{ color: t.color }}>{t.value}%</span>
                </div>
                <div className="progress-bar"><div style={{ width: `${t.value}%`, height: "100%", borderRadius: 3, background: t.color, boxShadow: `0 0 8px ${t.color}44` }} /></div>
              </div>
            ))}
            <div className="flex-between" style={{ fontSize: 12, marginTop: 8 }}>
              <span>Temperature</span><span className="mono" style={{ color: "var(--amber)" }}>73°C</span>
            </div>
          </div>
          <div className="ai-insight">
            <div className="ai-insight-label"><Sparkles size={14} /> AI Insight</div>
            <p>Validation loss plateau detected over 3 epochs. Consider reducing learning rate by 12%. GPU memory at 88% — reduce batch size if OOM occurs.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Training Log</h3>
        <div className="log-viewer">
          {logs.map((l, i) => (
            <div key={i} className="log-line">
              <span className="log-time">{l.time}</span>
              <span className={l.level === "warn" ? "log-warn" : "log-info"}>{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
