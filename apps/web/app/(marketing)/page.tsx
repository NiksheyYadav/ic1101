"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Layers, Database, Lock, Eye, Zap, Sparkles, Activity, ShieldCheck, Box, Play } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { InteractiveMesh } from "../../components/InteractiveMesh";
import { useState, useEffect } from "react";

const initialChartData = Array.from({ length: 50 }, (_, i) => ({
  epoch: i,
  loss: +(2 / (i + 5) + Math.random() * 0.03).toFixed(4),
  acc: +(0.6 + (i / 100) + Math.random() * 0.01).toFixed(4),
}));

export default function LandingPage() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1200], [0, 300]);
  
  const opacityText = useTransform(scrollY, [200, 600], [1, 0]);
  const opacityChart = useTransform(scrollY, [400, 900], [1, 0]);

  const [data, setData] = useState(initialChartData);
  const [currentAcc, setCurrentAcc] = useState(94.20);
  const [currentLoss, setCurrentLoss] = useState(0.0140);
  const [step, setStep] = useState(4821);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const newEpoch = last.epoch + 1;
        
        let newLoss = last.loss * 0.98 + (Math.random() * 0.004 - 0.002);
        if (newLoss < 0.001) newLoss = 0.001;
        let newAcc = last.acc + (1 - last.acc) * 0.02 + (Math.random() * 0.004 - 0.002);
        if (newAcc > 0.999) newAcc = 0.999;
        
        setCurrentAcc(+(newAcc * 100).toFixed(2));
        setCurrentLoss(+newLoss.toFixed(4));
        setStep(s => s + Math.floor(Math.random() * 10) + 5);

        return [...prev.slice(1), { epoch: newEpoch, loss: +newLoss.toFixed(4), acc: +newAcc.toFixed(4) }];
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="perspective-grid" />
      <InteractiveMesh />
      <div className="glow-orb primary" />
      <div className="glow-orb secondary" />

      <motion.section 
        className="marketing-container"
        style={{ y: yHero, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 100, paddingBottom: 100 }}
      >
        <motion.div style={{ opacity: opacityText, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-badge"
        >
          <div className="pulse-dot" /> SYSTEM ONLINE — AETHERIS OS v2.0
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
          className="hero-h1"
        >
          The Operating System<br/>for Artificial Intelligence.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
          className="hero-p"
        >
          Train, observe, and orchestrate neural networks without writing code. A pristine command center engineered for modern AI teams.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", gap: 20 }}
        >
          <a href="/signin" className="btn-cinematic">
            Start Building <ArrowRight size={18} />
          </a>
          <button className="btn-outline-cinematic">
            <Play size={18} fill="currentColor" /> Watch Live Demo
          </button>
        </motion.div>
        </motion.div>

        <div style={{ position: "relative", width: "100%", marginTop: 80, zIndex: 10, perspective: 1200, display: "flex", justifyContent: "center" }}>
          {/* SIMULATED CHART */}
          <motion.div style={{ opacity: opacityChart, width: "100%", display: "flex", justifyContent: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 80, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative", zIndex: 2 }}
          >
            <div className="pro-glass-panel" style={{ width: "100%", maxWidth: 1100, margin: "0 auto", height: 500 }}>
              <div className="mac-header">
                <div className="mac-dots">
                  <div className="mac-dot r" /><div className="mac-dot y" /><div className="mac-dot g" />
                </div>
                <div className="mono" style={{ margin: "0 auto", color: "#A1A1AA", fontSize: 13, letterSpacing: 1 }}>training_run_v2_llama.log</div>
              </div>
              
              <div style={{ padding: 40, height: "calc(100% - 48px)", position: "relative" }}>
                <div className="scanner-line" />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32, alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 32 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Validation Acc</div>
                      <div className="mono" style={{ fontSize: 32, color: "#fff", fontWeight: 600 }}>{currentAcc.toFixed(2)}<span style={{ color: "#00D4FF" }}>%</span></div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Epoch Loss</div>
                      <div className="mono" style={{ fontSize: 32, color: "#fff", fontWeight: 600 }}>{currentLoss.toFixed(4)}</div>
                    </div>
                  </div>
                  <div className="mono" style={{ color: "#00D4FF", fontSize: 14, background: "rgba(0, 212, 255, 0.1)", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(0, 212, 255, 0.2)" }}>
                    Step {step.toLocaleString()} / 10,000
                  </div>
                </div>

                <ResponsiveContainer width="100%" height="70%" minHeight={200}>
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="glowCyan" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D4FF" stopOpacity={0.5} /><stop offset="100%" stopColor="#00D4FF" stopOpacity={0} /></linearGradient>
                      <linearGradient id="glowViolet" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.5} /><stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="epoch" hide />
                    <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                    <Tooltip contentStyle={{ background: "rgba(10, 10, 15, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)", color: "#fff", fontFamily: "var(--font-mono)" }} itemStyle={{ color: "#fff" }} />
                    <Area type="monotone" dataKey="acc" stroke="#00D4FF" fill="url(#glowCyan)" strokeWidth={3} dot={false} isAnimationActive={false} />
                    <Area type="monotone" dataKey="loss" stroke="#8B5CF6" fill="url(#glowViolet)" strokeWidth={3} dot={false} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section className="marketing-container" style={{ padding: "0 0 80px 0", perspective: 1200 }}>
        <motion.div
          initial={{ opacity: 0, y: 120, rotateX: 20 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%" }}
        >
          <div className="pro-glass-panel" style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: 8, background: "rgba(0,0,0,0.5)" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
              <img 
                src="/dashboard-preview.png" 
                alt="Aetheris OS Dashboard Interface" 
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} 
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, rgba(0,0,0,1), transparent)", pointerEvents: "none" }} />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="marketing-container" style={{ padding: "80px 0" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(32px, 6vw, 80px)", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "40px 0" }}>
          {[
            { icon: ShieldCheck, text: "Enterprise Ready" },
            { icon: Activity, text: "Realtime Observability" },
            { icon: Layers, text: "Multi-Dataset Engine" },
            { icon: Zap, text: "Production Deployment" }
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, color: "#A1A1AA", fontWeight: 600, fontSize: 15, textTransform: "uppercase", letterSpacing: 1 }}>
              <item.icon size={20} color="#fff" /> {item.text}
            </div>
          ))}
        </div>
      </section>

      <section className="marketing-container" style={{ padding: "160px 0", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
          <h2 className="section-title">Observe Intelligence in Realtime.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 80px" }}>A hyper-detailed mission control surface for your models. Track convergence, GPU utilization, and validation metrics live, down to the millisecond.</p>
        </motion.div>

        <div style={{ position: "relative", width: "100%", height: 600 }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="pro-glass-panel" 
            style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "2fr 1fr", overflow: "hidden" }}
          >
            <div style={{ padding: 48, borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column" }}>
               <div style={{ flex: 1, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.3)", padding: 24, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}>
                    <div className="pulse-dot" style={{ backgroundColor: "#3DDC97" }} />
                    <span className="mono" style={{ fontSize: 12, color: "#3DDC97", letterSpacing: 1 }}>LIVE THROUGHPUT</span>
                  </div>
                 <ResponsiveContainer width="100%" height="100%" minHeight={200} style={{ marginTop: 32 }}>
                    <AreaChart data={data}>
                      <defs><linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3DDC97" stopOpacity={0.3} /><stop offset="100%" stopColor="#3DDC97" stopOpacity={0} /></linearGradient></defs>
                      <Area type="step" dataKey="acc" stroke="#3DDC97" fill="url(#gC)" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
            
            <div style={{ padding: 48, background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24, textAlign: "left" }}>
              {[
                { label: "GPU 0 Utilization", val: "88%", color: "#fff" },
                { label: "VRAM Allocated", val: "14.2 GB", color: "#fff" },
                { label: "Learning Rate", val: "1.2e-4", color: "#00D4FF" },
                { label: "Samples / sec", val: "482", color: "#3DDC97" }
              ].map(t => (
                <div key={t.label} style={{ paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 12, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, display: "block", marginBottom: 8 }}>{t.label}</span>
                  <span className="mono" style={{ fontSize: 24, color: t.color, fontWeight: 600 }}>{t.val}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
             className="floating-insight" 
             style={{ top: -30, left: 60, textAlign: "left" }}
          >
            <Sparkles size={24} color="#8B5CF6" style={{ flexShrink: 0 }} />
            <div>
              <span>AI Copilot</span>
              <p>Validation loss plateau detected. Suggested action: Reduce learning rate by 15% to exit local minima.</p>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
             className="floating-insight" 
             style={{ bottom: -30, right: 60, textAlign: "left" }}
          >
            <Cpu size={24} color="#00D4FF" style={{ flexShrink: 0 }} />
            <div>
              <span style={{ color: "#00D4FF" }}>System Alert</span>
              <p>GPU memory nearing limit. Distributed multi-node scaling could improve batch throughput by 31%.</p>
            </div>
          </motion.div>

        </div>
      </section>

      <section className="marketing-container" style={{ padding: "160px 0" }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
          <h2 className="section-title" style={{ textAlign: "center" }}>Infrastructure that scales.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 80px", textAlign: "center" }}>Handle the entire ML lifecycle in one premium interface. From multimodal dataset ingestion to one-click API deployment.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {[
            { icon: Database, title: "Multi-Dataset Engine", desc: "Upload custom datasets, connect external sources, and merge multimodal data instantly. Validate schemas automatically." },
            { icon: Layers, title: "No-Code Control", desc: "A powerful interface with auto-recommendations, cost estimates, and safe VRAM predictions. Complex ML made approachable." },
            { icon: Box, title: "Model Marketplace", desc: "Train state-of-the-art architectures for Computer Vision, NLP, and Time Series tasks with a single click." }
          ].map((card, i) => (
            <motion.div key={i} className="feature-card" initial={{opacity:0, y: 40}} whileInView={{opacity:1, y:0}} viewport={{once:true, margin: "-100px"}} transition={{duration:0.6, delay: i * 0.15}}>
              <div className="f-icon-box"><card.icon size={28} /></div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="marketing-container" style={{ padding: "160px 0", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 800, margin: "0 auto" }}
        >
          <div className="hero-badge" style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff", background: "rgba(255,255,255,0.05)", boxShadow: "none" }}>
            <Lock size={14} /> Built for the Enterprise
          </div>
          <h2 className="section-title">Train here. Deploy here.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 56px" }}>
            Aetheris AI is not just a training platform. It includes a built-in model registry, zero-downtime API deployment, and robust team governance with role-based access controls.
          </p>
          <a href="/signin" className="btn-cinematic" style={{ padding: "20px 48px", fontSize: 18 }}>
            Start Building for Free <ArrowRight size={20} />
          </a>
        </motion.div>
      </section>
      
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 0" }}>
        <div className="marketing-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div className="nav-logo" style={{ fontSize: 18 }}>
             <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #00D4FF, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>A</div>
             Aetheris AI
           </div>
           <div style={{ fontSize: 14, color: "#A1A1AA" }}>© 2026 Aetheris AI. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}
