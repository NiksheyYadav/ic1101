"use client";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Cpu, Database, Box, Settings2, Zap, Rocket, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, AuthError } from "../../../../lib/api";

export default function NewTrainingJobPage() {
  const router = useRouter();
  
  const [model, setModel] = useState("image");
  const [dataset, setDataset] = useState("imagenet-1k-subset");
  
  const [epochs, setEpochs] = useState(10);
  const [batchSize, setBatchSize] = useState("32");
  const [learningRate, setLearningRate] = useState("0.001");
  const [optimizer, setOptimizer] = useState("AdamW");
  
  const [gpus, setGpus] = useState(1);
  const [precision, setPrecision] = useState("fp32");
  
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLaunch = async () => {
    setLaunching(true);
    setError(null);
    try {
      const job = await apiFetch<{ id: string }>("/v1/training-jobs", {
        method: "POST",
        body: JSON.stringify({
          workspace_id: "default",
          model_type: model,
          epochs,
          batch_size: parseInt(batchSize),
          learning_rate: parseFloat(learningRate),
          optimizer,
          precision,
          dataset_s3_key: dataset === "hymenoptera" ? "datasets/hymenoptera.zip" : undefined,
        }),
      });
      // Redirect to the training monitor page
      router.push("/training");
    } catch (err: any) {
      if (!(err instanceof AuthError)) {
        setError(err.message || "Failed to start training");
      }
      setLaunching(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="animate-in" style={{ paddingBottom: 60, maxWidth: 1000, margin: "0 auto" }}>
      
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <Link href="/training" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#A1A1AA", fontSize: 13, textDecoration: "none", marginBottom: 16, transition: "color 0.2s" }} className="hover:text-white">
            <ChevronLeft size={14} /> Back to Training
          </Link>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 12 }}>
            <Settings2 size={28} color="#00D4FF" /> Configure Training Job
          </h2>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
        
        {/* Foundation */}
        <motion.div variants={itemVariants} className="pro-glass-panel" style={{ padding: 32, borderRadius: 16, background: "rgba(10,10,15,0.4)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <Box size={20} color="#8B5CF6"/> Foundation
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#A1A1AA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Model Type</label>
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", appearance: "none", fontFamily: "var(--font-sans)", fontSize: 14 }}
              >
                <option value="image">MobileNetV2 — Image Classification</option>
                <option value="text">TextCNN — Text Classification</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#A1A1AA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Target Dataset</label>
              <select 
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", appearance: "none", fontFamily: "var(--font-sans)", fontSize: 14 }}
              >
                <option value="synthetic">Synthetic Data (Demo)</option>
                <option value="hymenoptera">Hymenoptera (Ants vs Bees - 45MB)</option>
                <option value="imagenet-1k-subset">ImageNet 1K (Subset)</option>
                <option value="cifar-10">CIFAR-10</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Hyperparameters */}
        <motion.div variants={itemVariants} className="pro-glass-panel" style={{ padding: 32, borderRadius: 16, background: "rgba(10,10,15,0.4)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, rgba(0,0,0,0) 70%)", pointerEvents: "none" }} />
          
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={20} color="#00D4FF"/> Hyperparameters
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1 }}>Epochs</label>
                <span className="mono" style={{ color: "#00D4FF", fontSize: 14 }}>{epochs}</span>
              </div>
              <input 
                type="range" 
                min="1" max="100" 
                value={epochs} 
                onChange={(e) => setEpochs(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#00D4FF", cursor: "pointer" }} 
              />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#A1A1AA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Learning Rate</label>
              <input 
                type="text" 
                value={learningRate} 
                onChange={(e) => setLearningRate(e.target.value)}
                placeholder="e.g. 0.001"
                style={{ width: "100%", padding: "12px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "var(--font-mono)", fontSize: 14 }} 
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#A1A1AA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Batch Size</label>
              <select 
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", appearance: "none", fontFamily: "var(--font-mono)", fontSize: 14 }}
              >
                <option value="8">8</option>
                <option value="16">16</option>
                <option value="32">32</option>
                <option value="64">64</option>
                <option value="128">128</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#A1A1AA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Optimizer</label>
              <select 
                value={optimizer}
                onChange={(e) => setOptimizer(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", appearance: "none", fontFamily: "var(--font-sans)", fontSize: 14 }}
              >
                <option value="AdamW">AdamW</option>
                <option value="Adam">Adam</option>
                <option value="SGD">SGD (Momentum)</option>
                <option value="RMSprop">RMSprop</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div variants={itemVariants} className="pro-glass-panel" style={{ padding: 32, borderRadius: 16, background: "rgba(10,10,15,0.4)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <Cpu size={20} color="#F59E0B"/> Compute Allocation
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1 }}>Device</label>
                <span className="mono" style={{ color: "#F59E0B", fontSize: 14 }}>Auto-detect</span>
              </div>
              <p style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.6 }}>
                The backend will automatically use CUDA if available, otherwise CPU. Training runs server-side on the Elastic Beanstalk instance.
              </p>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#A1A1AA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Precision</label>
              <div style={{ display: "flex", gap: 12 }}>
                {["fp32", "fp16", "bf16"].map(p => (
                  <button 
                    key={p}
                    onClick={() => setPrecision(p)}
                    style={{ 
                      flex: 1, 
                      padding: "10px 0", 
                      borderRadius: 6, 
                      background: precision === p ? "rgba(245, 158, 11, 0.15)" : "rgba(0,0,0,0.4)", 
                      border: precision === p ? "1px solid #F59E0B" : "1px solid rgba(255,255,255,0.1)", 
                      color: precision === p ? "#F59E0B" : "#A1A1AA", 
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div variants={itemVariants} style={{ padding: 16, borderRadius: 8, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#EF4444", fontSize: 14 }}>
            ⚠ {error}
          </motion.div>
        )}

        {/* Action */}
        <motion.div variants={itemVariants} style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button 
            onClick={handleLaunch} 
            disabled={launching}
            className="btn-cinematic" 
            style={{ padding: "16px 32px", fontSize: 16, display: "flex", alignItems: "center", gap: 12, opacity: launching ? 0.7 : 1, cursor: launching ? "not-allowed" : "pointer" }}
          >
            {launching ? <Loader2 size={20} className="spin" /> : <Rocket size={20} />}
            {launching ? "Initializing..." : "Initialize Training Cluster"}
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
