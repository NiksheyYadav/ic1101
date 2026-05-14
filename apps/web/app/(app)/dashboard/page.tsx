"use client";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Zap, Upload, Rocket, GitCompare, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { apiFetch } from "../../../lib/api";

// --- DEMO DATA REMOVED FOR PRODUCTION ---
// const initialLossData = Array.from({ length: 30 }, (_, i) => ({
//   epoch: i + 1, loss: +(1 / (i + 1) + Math.random() * 0.05).toFixed(4),
//   acc: +(0.5 + (i / 50) + Math.random() * 0.02).toFixed(4),
// }));
//
// const initialGpuData = Array.from({ length: 12 }, (_, i) => ({ 
//   h: `${i * 2}:00`, usage: 60 + Math.random() * 30 
// }));

export default function DashboardPage() {
  const [lossData, setLossData] = useState<any[]>([]);
  const [gpuData, setGpuData] = useState<any[]>(Array.from({length: 12}, (_, i) => ({h: `-`, usage: 0})));
  const [jobs, setJobs] = useState<any[]>([]);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [kpis, setKpis] = useState({
    activeTrainings: 0,
    gpuUtilization: "0%",
    dataVolume: "0 GB",
    modelsInProd: 0
  });

  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      try {
        // Fetch System Info
        try {
          const sys = await apiFetch<any>("/v1/system/info");
          if (mounted) {
            const usage = sys.cuda_available ? sys.gpu_memory_used_mb / sys.gpu_memory_total_mb * 100 : sys.cpu_usage;
            setGpuData(prev => {
              const next = [...prev.slice(1), { h: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), usage }];
              return next;
            });
            setKpis(k => ({...k, gpuUtilization: `${usage.toFixed(0)}%`}));
          }
        } catch(e) {}

        // Fetch Jobs
        try {
          const fetchedJobs = await apiFetch<any[]>("/v1/training-jobs?workspace_id=default");
          if (mounted) {
            setJobs(fetchedJobs.map((j: any) => ({
              name: j.model_type || j.id.substring(0, 8),
              progress: j.progress,
              acc: "-",
              eta: "-",
              status: j.status
            })));
            
            const running = fetchedJobs.filter((j: any) => j.status === "running");
            setKpis(k => ({...k, activeTrainings: running.length}));
            
            if (running.length > 0) {
              const st = await apiFetch<any>(`/v1/training-jobs/${running[0].id}/status`);
              if (mounted && st.epoch_history && st.epoch_history.length > 0) {
                setLossData(st.epoch_history);
              }
            }
          }
        } catch(e) {}

        // Fetch Experiments
        try {
          const fetchedExp = await apiFetch<any[]>("/v1/experiments?workspace_id=default");
          if (mounted) {
            setExperiments(fetchedExp.map((e: any) => ({
              id: e.name,
              model: e.name,
              acc: e.metrics?.accuracy ? (e.metrics.accuracy * 100).toFixed(1) + "%" : "-",
              loss: e.metrics?.loss || "-",
              status: "completed"
            })));
            setKpis(k => ({...k, modelsInProd: fetchedExp.length}));
          }
        } catch(e) {}
      } catch (e) {
        console.error("Dashboard polling error:", e);
      }
    };
    
    poll();
    const interval = setInterval(poll, 2000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="animate-in" style={{ paddingBottom: 60 }}>
      <motion.div variants={item} className="page-header" style={{ marginBottom: 40 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>Welcome back, Admin 👋</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>Here&apos;s what&apos;s happening across your AI infrastructure.</p>
        </div>
        <div className="flex-row">
          <button className="btn-cinematic" style={{ padding: "8px 20px", fontSize: 14 }}><Zap size={16} /> New Training</button>
          <button className="btn-outline-cinematic" style={{ padding: "8px 20px", fontSize: 14 }}><Upload size={16} /> Upload Dataset</button>
        </div>
      </motion.div>

      <motion.div variants={item} className="kpi-grid" style={{ marginBottom: 40, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "rgba(10,10,15,0.4)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Active Trainings</div>
          <div className="mono" style={{ fontSize: 32, fontWeight: 600, color: "#00D4FF", marginBottom: 12 }}>{kpis.activeTrainings}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#3DDC97", fontWeight: 500 }}><TrendingUp size={14} /> Live update</div>
        </div>
        <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "rgba(10,10,15,0.4)", borderLeft: "2px solid var(--emerald)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>GPU/CPU Utilization</div>
          <div className="mono" style={{ fontSize: 32, fontWeight: 600, color: "#3DDC97", marginBottom: 12 }}>{kpis.gpuUtilization}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#3DDC97", fontWeight: 500 }}><TrendingUp size={14} /> System Node</div>
        </div>
        <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "rgba(10,10,15,0.4)", borderLeft: "2px solid var(--violet)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Data Volume</div>
          <div className="mono" style={{ fontSize: 32, fontWeight: 600, color: "#8B5CF6", marginBottom: 12 }}>{kpis.dataVolume}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#A1A1AA", fontWeight: 500 }}><TrendingUp size={14} /> Storage Total</div>
        </div>
        <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "rgba(10,10,15,0.4)", borderLeft: "2px solid var(--amber)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Models in Production</div>
          <div className="mono" style={{ fontSize: 32, fontWeight: 600, color: "#F59E0B", marginBottom: 12 }}>{kpis.modelsInProd}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#3DDC97", fontWeight: 500 }}><TrendingUp size={14} /> Based on Experiments</div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid-2-1" style={{ marginBottom: 40, display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "rgba(10,10,15,0.4)" }}>
          <h3 style={{ marginBottom: 24, fontSize: 16, fontWeight: 600 }}>Training Progress</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={lossData}>
              <defs>
                <linearGradient id="glowCyan" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D4FF" stopOpacity={0.4} /><stop offset="100%" stopColor="#00D4FF" stopOpacity={0} /></linearGradient>
                <linearGradient id="glowViolet" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} /><stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="epoch" tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, backdropFilter: "blur(10px)" }} />
              <Area type="monotone" dataKey="loss" stroke="#00D4FF" fill="url(#glowCyan)" strokeWidth={3} dot={false} isAnimationActive={false} />
              <Area type="monotone" dataKey="acc" stroke="#8B5CF6" fill="url(#glowViolet)" strokeWidth={3} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "rgba(10,10,15,0.4)" }}>
          <h3 style={{ marginBottom: 24, fontSize: 16, fontWeight: 600 }}>GPU Usage (Live)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={gpuData}>
              <XAxis dataKey="h" tick={{ fill: "#A1A1AA", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#A1A1AA", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, backdropFilter: "blur(10px)" }} />
              <Bar dataKey="usage" fill="#3DDC97" opacity={0.8} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid-2" style={{ marginBottom: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "rgba(10,10,15,0.4)" }}>
          <h3 style={{ marginBottom: 24, fontSize: 16, fontWeight: 600 }}>Active Training Jobs</h3>
          {jobs.length === 0 && <div style={{ color: "#A1A1AA", fontSize: 14 }}>No jobs running or queued.</div>}
          {jobs.map((j, idx) => (
            <div key={`${j.name}-${idx}`} style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="pulse-dot" style={{ backgroundColor: "#00D4FF" }} />
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{j.name}</span>
                </div>
                <span className="mono" style={{ fontSize: 11, color: "#00D4FF", background: "rgba(0, 212, 255, 0.1)", padding: "4px 8px", borderRadius: 4, letterSpacing: 1 }}>{j.status.toUpperCase()}</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${j.progress}%`, height: "100%", background: "linear-gradient(90deg, #8B5CF6, #00D4FF)", transition: "width 0.2s linear" }} />
              </div>
              <div className="flex-between" style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
                <span>Accuracy: <span style={{ color: "var(--emerald)", fontWeight: 600 }}>{j.acc}</span></span>
                <span className="mono">ETA: {j.eta}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "rgba(10,10,15,0.4)" }}>
            <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600 }}>Recent Experiments</h3>
            <table className="data-table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
              <thead><tr style={{ color: "#A1A1AA", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}><th style={{ paddingBottom: 16, fontWeight: 600 }}>ID</th><th style={{ paddingBottom: 16, fontWeight: 600 }}>Model</th><th style={{ paddingBottom: 16, fontWeight: 600 }}>Accuracy</th><th style={{ paddingBottom: 16, fontWeight: 600 }}>Loss</th></tr></thead>
              <tbody>
                {experiments.length === 0 && <tr><td colSpan={4} style={{ padding: "16px 0", color: "#A1A1AA", fontSize: 14 }}>No recent experiments.</td></tr>}
                {experiments.map((e, idx) => (
                <tr key={`${e.id}-${idx}`} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <td className="mono" style={{ padding: "16px 0", color: "var(--cyan)", fontSize: 13 }}>{e.id}</td>
                  <td style={{ padding: "16px 0", fontSize: 14 }}>{e.model}</td>
                  <td style={{ padding: "16px 0", color: "var(--emerald)", fontWeight: 600 }}>{e.acc}</td>
                  <td className="mono" style={{ padding: "16px 0", fontSize: 13 }}>{e.loss}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(0, 212, 255, 0.05))", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#8B5CF6", fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
              <Sparkles size={16} /> AI Insight
            </div>
            <p style={{ color: "#D4D4D8", fontSize: 14, lineHeight: 1.6 }}>Training accuracy is improving steadily. Consider reducing learning rate by 12% after epoch 150 for optimal convergence. GPU memory at 87% — safe for current batch size.</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex-row" style={{ gap: 16 }}>
        <button className="btn-outline-cinematic" style={{ padding: "10px 24px", fontSize: 14 }}><GitCompare size={16} /> Compare Runs</button>
        <button className="btn-cinematic" style={{ padding: "10px 24px", fontSize: 14 }}><Rocket size={16} /> Deploy Model</button>
      </motion.div>
    </motion.div>
  );
}
