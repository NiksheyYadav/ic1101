"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { InteractiveMesh } from "./InteractiveMesh";

const initialChartData1 = Array.from({ length: 60 }, (_, i) => ({
  epoch: i,
  loss: +(2 / (i + 5) + Math.random() * 0.05).toFixed(4),
  acc: +(0.6 + (i / 100) + Math.random() * 0.02).toFixed(4),
}));

const initialChartData2 = Array.from({ length: 60 }, (_, i) => ({
  time: i,
  throughput: 400 + Math.random() * 100,
  vram: 10 + Math.random() * 4,
}));

const terminalLines = [
  "[SYS] Initializing neural weights...",
  "[SYS] Connecting to GPU cluster 03...",
  "[WARN] VRAM utilization near 90%",
  "[OK] Checkpoint saved: epoch_482.pt",
  "[NET] Syncing gradients across nodes...",
  "[SYS] Optimizing hyper-parameters...",
  "[OK] Validation accuracy improved +0.02%",
  "[SYS] Analyzing loss landscape...",
  "[NET] Receiving telemetry data...",
];

export function BackgroundSimulation() {
  const [data1, setData1] = useState(initialChartData1);
  const [data2, setData2] = useState(initialChartData2);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData1(prev => {
        const last = prev[prev.length - 1];
        let newLoss = last.loss * 0.98 + (Math.random() * 0.008 - 0.004);
        if (newLoss < 0.001) newLoss = 0.001;
        let newAcc = last.acc + (1 - last.acc) * 0.03 + (Math.random() * 0.006 - 0.003);
        if (newAcc > 0.999) newAcc = 0.999;
        return [...prev.slice(1), { epoch: last.epoch + 1, loss: +newLoss.toFixed(4), acc: +newAcc.toFixed(4) }];
      });

      setData2(prev => {
        const last = prev[prev.length - 1];
        let newT = last.throughput + (Math.random() * 40 - 20);
        if (newT < 100) newT = 100;
        let newV = last.vram + (Math.random() * 1 - 0.5);
        if (newV > 16) newV = 16;
        if (newV < 4) newV = 4;
        return [...prev.slice(1), { time: last.time + 1, throughput: newT, vram: newV }];
      });
      
      // Add random log
      if (Math.random() > 0.6) {
        setLogs(prev => {
          const newLine = terminalLines[Math.floor(Math.random() * terminalLines.length)];
          const newLogs = [...prev, newLine];
          return newLogs.slice(-6); // keep last 6
        });
      }

    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: "hidden", background: "#05050A" }}>
      
      {/* 1. Underlying Interactive Mesh */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}>
        <InteractiveMesh />
      </div>

      {/* 2. Live Dashboard Grid */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gridTemplateRows: "1fr 1fr", gap: 20, padding: 40, opacity: 1, pointerEvents: "none" }}>
        
        {/* Left Column: Terminal */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", borderLeft: "1px solid rgba(0, 212, 255, 0.2)", paddingLeft: 16 }}>
          <div className="mono" style={{ color: "#00D4FF", fontSize: 10, letterSpacing: 2, marginBottom: 16, opacity: 0.7 }}>TERMINAL LOG</div>
          {logs.map((log, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ color: i === logs.length - 1 ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 8, fontFamily: "var(--font-mono)" }}>
              {log}
            </motion.div>
          ))}
        </div>

        {/* Center Top: Big Chart */}
        <div style={{ position: "relative", border: "1px solid rgba(139, 92, 246, 0.1)", borderRadius: 16, background: "rgba(0,0,0,0.2)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 16, left: 16, fontSize: 10, color: "#8B5CF6", letterSpacing: 1 }} className="mono">MODEL ACCURACY OVER TIME</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data1}>
              <defs>
                <linearGradient id="gC1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} /><stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient>
              </defs>
              <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.1']} />
              <Area type="monotone" dataKey="acc" stroke="#8B5CF6" fill="url(#gC1)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right Top: Throughput */}
        <div style={{ position: "relative", border: "1px solid rgba(61, 220, 151, 0.1)", borderRadius: 16, background: "rgba(0,0,0,0.2)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 16, left: 16, fontSize: 10, color: "#3DDC97", letterSpacing: 1 }} className="mono">GPU THROUGHPUT</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data2}>
              <defs>
                <linearGradient id="gC2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3DDC97" stopOpacity={0.4} /><stop offset="100%" stopColor="#3DDC97" stopOpacity={0} /></linearGradient>
              </defs>
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
              <Area type="step" dataKey="throughput" stroke="#3DDC97" fill="url(#gC2)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Left Bottom: Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 40 }}>
           <div>
             <div style={{ fontSize: 10, color: "#A1A1AA", letterSpacing: 1 }} className="mono">EPOCH PROGRESS</div>
             <div style={{ fontSize: 24, color: "#fff" }} className="mono">4,821 / 10k</div>
           </div>
           <div>
             <div style={{ fontSize: 10, color: "#A1A1AA", letterSpacing: 1 }} className="mono">CLUSTER HEALTH</div>
             <div style={{ fontSize: 24, color: "#3DDC97" }} className="mono">99.9%</div>
           </div>
        </div>

        {/* Center Bottom: VRAM */}
        <div style={{ position: "relative", border: "1px solid rgba(0, 212, 255, 0.1)", borderRadius: 16, background: "rgba(0,0,0,0.2)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 16, left: 16, fontSize: 10, color: "#00D4FF", letterSpacing: 1 }} className="mono">VRAM ALLOCATION</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data2}>
              <defs>
                <linearGradient id="gC3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D4FF" stopOpacity={0.4} /><stop offset="100%" stopColor="#00D4FF" stopOpacity={0} /></linearGradient>
              </defs>
              <YAxis hide domain={[0, 20]} />
              <Area type="monotone" dataKey="vram" stroke="#00D4FF" fill="url(#gC3)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Right Bottom: Loss */}
        <div style={{ position: "relative", border: "1px solid rgba(245, 158, 11, 0.1)", borderRadius: 16, background: "rgba(0,0,0,0.2)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 16, left: 16, fontSize: 10, color: "#F59E0B", letterSpacing: 1 }} className="mono">LOSS FUNCTION</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data1}>
              <defs>
                <linearGradient id="gC4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F59E0B" stopOpacity={0.4} /><stop offset="100%" stopColor="#F59E0B" stopOpacity={0} /></linearGradient>
              </defs>
              <YAxis hide domain={[0, 'dataMax + 0.1']} />
              <Area type="stepAfter" dataKey="loss" stroke="#F59E0B" fill="url(#gC4)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 3. Cinematic Scanner Line */}
      <motion.div 
        animate={{ y: ["-10vh", "110vh"] }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        style={{ position: "absolute", left: 0, right: 0, height: "10vh", background: "linear-gradient(to bottom, transparent, rgba(0, 212, 255, 0.05), transparent)", zIndex: 1, pointerEvents: "none" }}
      />

      {/* 4. Heavy Glassmorphism Overlay */}
      <div style={{ 
        position: "absolute", 
        top: 0, left: 0, right: 0, bottom: 0, 
        backdropFilter: "blur(10px)", 
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 2,
        background: "radial-gradient(circle at 50% 50%, rgba(10,10,15,0) 0%, rgba(5,5,10,0.4) 100%)",
        pointerEvents: "none"
      }} />
    </div>
  );
}
