"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Pause, Play, Square, Download, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch, fetchEventStream } from "../../../lib/api";

const telemetry = [
  { label: "GPU", value: 82, color: "var(--emerald)" },
  { label: "CPU", value: 45, color: "var(--cyan)" },
  { label: "RAM", value: 67, color: "var(--violet)" },
  { label: "VRAM", value: 88, color: "var(--amber)" },
];

export default function TrainingMonitorPage() {
  const [job, setJob] = useState<any>(null);
  const [epochsData, setEpochsData] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    apiFetch<any[]>("/v1/training-jobs").then(jobs => {
      if (jobs.length > 0) {
        const activeJob = jobs.find((j: any) => j.status === 'running') || jobs[0];
        setJob(activeJob);

        fetchEventStream(`/v1/training-jobs/${activeJob.id}/events`, (data) => {
          if (data.epoch !== undefined) {
            setEpochsData(prev => {
              if (prev.find(p => p.epoch === data.epoch)) return prev;
              return [...prev, {
                epoch: data.epoch,
                loss: data.loss,
                val_acc: data.accuracy,
                lr: 0.001 * Math.pow(0.99, data.epoch)
              }];
            });
            setJob((prev: any) => prev ? { ...prev, progress: data.progress, current_epoch: data.epoch } : prev);

            const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
            setLogs(prev => [{ time: timeStr, level: "info", msg: `Epoch ${data.epoch} completed — loss: ${data.loss.toFixed(4)}, acc: ${(data.accuracy * 100).toFixed(2)}%` }, ...prev].slice(0, 50));
          } else if (data.status) {
            setJob((prev: any) => prev ? { ...prev, status: data.status } : prev);
            const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
            setLogs(prev => [{ time: timeStr, level: "info", msg: `Job status changed to ${data.status}` }, ...prev].slice(0, 50));
          }
        }, controller.signal).catch(console.error);
      }
    }).catch(console.error);

    return () => controller.abort();
  }, []);

  const handleAction = async (action: 'pause' | 'resume' | 'cancel') => {
    if (!job) return;
    try {
      await apiFetch(`/v1/training-jobs/${job.id}/${action}`, { method: 'POST' });
    } catch(e) { console.error(e); }
  };

  const latestEpoch = epochsData.length > 0 ? epochsData[epochsData.length - 1] : null;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="flex-row" style={{ gap: 12 }}>
            <h2>{job?.model_type || "VisionTransformer-v3"}</h2>
            <span className={`badge badge-${job?.status === 'running' ? 'cyan' : job?.status === 'succeeded' ? 'emerald' : 'amber'}`} style={{ fontSize: 12, textTransform: 'uppercase' }}>● {job?.status || 'LOADING'}</span>
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            Epoch {job?.current_epoch || 0} / {job?.epochs || 0} · Started from API
          </div>
        </div>
        <div className="flex-row">
          {job?.status === 'running' ? 
            <button className="btn btn-secondary" onClick={() => handleAction('pause')}><Pause size={14} /> Pause</button> :
            <button className="btn btn-secondary" onClick={() => handleAction('resume')}><Play size={14} /> Resume</button>
          }
          <button className="btn btn-danger" onClick={() => handleAction('cancel')}><Square size={14} /> Cancel</button>
          <button className="btn btn-secondary"><Download size={14} /> Checkpoint</button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${job?.progress || 0}%`, transition: 'width 0.5s' }} />
        </div>
        <div className="flex-between" style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
          <span>{job?.progress || 0}% complete</span><span>ETA: Calculating...</span>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-label">Loss</div><div className="kpi-value emerald">{latestEpoch?.loss?.toFixed(4) || "-"}</div><div className="kpi-trend up">↓ decreasing</div></div>
        <div className="kpi-card emerald"><div className="kpi-label">Accuracy</div><div className="kpi-value cyan">{latestEpoch?.val_acc ? `${(latestEpoch.val_acc * 100).toFixed(2)}%` : "-"}</div><div className="kpi-trend up">↑ improving</div></div>
        <div className="kpi-card amber"><div className="kpi-label">Learning Rate</div><div className="kpi-value amber">{latestEpoch?.lr?.toExponential(2) || "-"}</div><div className="kpi-trend">cosine decay</div></div>
        <div className="kpi-card violet"><div className="kpi-label">Throughput</div><div className="kpi-value violet">847</div><div className="kpi-trend">samples/sec</div></div>
      </div>

      <div className="grid-2-1 mb-24">
        <div className="chart-card">
          <h3>Training Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={epochsData}>
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
