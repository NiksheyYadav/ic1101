"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Pause, Play, Square, Download, Sparkles, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiFetch, API_BASE } from "../../../lib/api";
import Link from "next/link";

const telemetryInit = [
  { label: "CPU", value: 0, color: "var(--cyan)" },
  { label: "RAM", value: 0, color: "var(--violet)" },
];

interface TrainingStatusData {
  job_id: string;
  status: string;
  epoch: number;
  total_epochs: number;
  loss: number;
  accuracy: number;
  progress: number;
  cpu_usage: number;
  ram_usage: number;
  device: string;
  cuda_status: string;
  current_model: string;
  elapsed_time: number;
  estimated_time_remaining: number;
  training_complete: boolean;
  logs: string[];
  epoch_history: { epoch: number; loss: number; accuracy: number }[];
}

export default function TrainingMonitorPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<TrainingStatusData | null>(null);
  const [telemetry, setTelemetry] = useState(telemetryInit);

  // Fetch list of jobs on mount
  useEffect(() => {
    apiFetch<any[]>("/v1/training-jobs")
      .then((data) => {
        setJobs(data);
        if (data.length > 0) {
          const running = data.find((j: any) => j.status === "running" || j.status === "queued");
          setActiveJobId(running?.id || data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  // Poll /status every 1 second for the active job
  useEffect(() => {
    if (!activeJobId) return;

    const poll = () => {
      apiFetch<TrainingStatusData>(`/v1/training-jobs/${activeJobId}/status`)
        .then((data) => {
          setLiveStatus(data);
          setTelemetry([
            { label: "CPU", value: data.cpu_usage, color: "var(--cyan)" },
            { label: "RAM", value: data.ram_usage, color: "var(--violet)" },
          ]);
        })
        .catch(console.error);
    };

    poll(); // initial fetch
    const interval = setInterval(poll, 1000);
    return () => clearInterval(interval);
  }, [activeJobId]);

  const handleAction = async (action: "pause" | "resume" | "cancel") => {
    if (!activeJobId) return;
    try {
      await apiFetch(`/v1/training-jobs/${activeJobId}/${action}`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = async () => {
    if (!activeJobId) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("aetheris_token") : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/v1/training-jobs/${activeJobId}/download`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aetheris_model_${activeJobId.slice(0, 8)}.zip`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download model:", error);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "—";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const latestEpoch = liveStatus?.epoch_history?.length
    ? liveStatus.epoch_history[liveStatus.epoch_history.length - 1]
    : null;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="flex-row" style={{ gap: 12 }}>
            <h2>{liveStatus?.current_model || "Training Monitor"}</h2>
            <span
              className={`badge badge-${
                liveStatus?.status === "running"
                  ? "cyan"
                  : liveStatus?.status === "completed"
                  ? "emerald"
                  : "amber"
              }`}
              style={{ fontSize: 12, textTransform: "uppercase" }}
            >
              ● {liveStatus?.status || "LOADING"}
            </span>
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            Epoch {liveStatus?.epoch || 0} / {liveStatus?.total_epochs || 0} · Device: {liveStatus?.device?.toUpperCase() || "—"} · CUDA: {liveStatus?.cuda_status || "offline"}
          </div>
        </div>
        <div className="flex-row">
          {liveStatus?.status === "running" ? (
            <button className="btn btn-secondary" onClick={() => handleAction("pause")}>
              <Pause size={14} /> Pause
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => handleAction("resume")}>
              <Play size={14} /> Resume
            </button>
          )}
          <button className="btn btn-danger" onClick={() => handleAction("cancel")}>
            <Square size={14} /> Cancel
          </button>
          {liveStatus?.training_complete && (
            <button className="btn-cinematic" style={{ padding: "8px 20px" }} onClick={handleDownload}>
              <Download size={14} /> Download Model
            </button>
          )}
          <Link
            href="/training/new"
            className="btn-cinematic"
            style={{ padding: "8px 20px", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}
          >
            <Sparkles size={14} /> New Job
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="progress-bar" style={{ height: 8 }}>
          <div
            className="progress-fill"
            style={{ width: `${liveStatus?.progress || 0}%`, transition: "width 0.5s" }}
          />
        </div>
        <div className="flex-between" style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
          <span>{liveStatus?.progress || 0}% complete</span>
          <span>ETA: {formatTime(liveStatus?.estimated_time_remaining || 0)}</span>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Loss</div>
          <div className="kpi-value emerald">{latestEpoch?.loss?.toFixed(4) || "—"}</div>
          <div className="kpi-trend up">↓ decreasing</div>
        </div>
        <div className="kpi-card emerald">
          <div className="kpi-label">Accuracy</div>
          <div className="kpi-value cyan">
            {latestEpoch?.accuracy ? `${(latestEpoch.accuracy * 100).toFixed(2)}%` : "—"}
          </div>
          <div className="kpi-trend up">↑ improving</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">Elapsed</div>
          <div className="kpi-value amber">{formatTime(liveStatus?.elapsed_time || 0)}</div>
          <div className="kpi-trend">{liveStatus?.device || "cpu"}</div>
        </div>
        <div className="kpi-card violet">
          <div className="kpi-label">CPU / RAM</div>
          <div className="kpi-value violet">
            {liveStatus?.cpu_usage?.toFixed(0) || 0}% / {liveStatus?.ram_usage?.toFixed(0) || 0}%
          </div>
          <div className="kpi-trend">live telemetry</div>
        </div>
      </div>

      <div className="grid-2-1 mb-24">
        <div className="chart-card">
          <h3>Training Metrics (Live)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={liveStatus?.epoch_history || []}>
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="epoch" tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0D1225", border: "1px solid #1A2140", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="loss" stroke="#00D4FF" fill="url(#lg1)" strokeWidth={2} dot={false} name="Loss" isAnimationActive={false} />
              <Area type="monotone" dataKey="accuracy" stroke="#8B5CF6" fill="url(#lg2)" strokeWidth={2} dot={false} name="Accuracy" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="card mb-16">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>System Telemetry</h3>
            {telemetry.map((t) => (
              <div key={t.label} style={{ marginBottom: 14 }}>
                <div className="flex-between" style={{ fontSize: 12, marginBottom: 4 }}>
                  <span>{t.label}</span>
                  <span className="mono" style={{ color: t.color }}>
                    {t.value.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    style={{
                      width: `${t.value}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: t.color,
                      boxShadow: `0 0 8px ${t.color}44`,
                      transition: "width 0.5s",
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="flex-between" style={{ fontSize: 12, marginTop: 8 }}>
              <span>Device</span>
              <span className="mono" style={{ color: "var(--amber)" }}>
                {liveStatus?.device?.toUpperCase() || "CPU"}
              </span>
            </div>
            <div className="flex-between" style={{ fontSize: 12, marginTop: 4 }}>
              <span>CUDA</span>
              <span
                className="mono"
                style={{ color: liveStatus?.cuda_status === "active" ? "var(--emerald)" : "var(--text-muted)" }}
              >
                {liveStatus?.cuda_status || "offline"}
              </span>
            </div>
          </div>
          <div className="ai-insight">
            <div className="ai-insight-label">
              <Sparkles size={14} /> AI Insight
            </div>
            <p>
              {liveStatus?.status === "running"
                ? `Training in progress. ${liveStatus?.epoch || 0} of ${liveStatus?.total_epochs || 0} epochs completed. CPU at ${liveStatus?.cpu_usage?.toFixed(0) || 0}%.`
                : liveStatus?.training_complete
                ? "Training completed successfully. Model is ready for download and deployment."
                : "Waiting for training to start..."}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Training Log</h3>
        <div className="log-viewer">
          {(liveStatus?.logs || []).map((l, i) => (
            <div key={i} className="log-line">
              <span className="log-info">{l}</span>
            </div>
          ))}
          {(!liveStatus?.logs || liveStatus.logs.length === 0) && (
            <div className="log-line">
              <span className="log-info" style={{ color: "var(--text-muted)" }}>
                Waiting for training logs...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
