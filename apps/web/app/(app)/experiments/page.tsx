"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Sparkles, Trophy, UploadCloud, FileText, ImageIcon, Play, Loader2, Activity } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { apiFetch, API_BASE } from "../../../lib/api";

const chartData = Array.from({ length: 100 }, (_, i) => ({
  epoch: i + 1,
  exp042: +(1 / (i + 1) + Math.random() * 0.01).toFixed(4),
  exp041: +(1.2 / (i + 1) + Math.random() * 0.015).toFixed(4),
  exp039: +(1.5 / (i + 1) + Math.random() * 0.02).toFixed(4),
}));

export default function ExperimentsPage() {
  const [runs, setRuns] = useState<any[]>([]);
  
  // Inference State
  const [selectedExpId, setSelectedExpId] = useState<string>("");
  const [inputType, setInputType] = useState<"text" | "image">("image");
  const [inputText, setInputText] = useState("");
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiFetch<any[]>("/v1/experiments")
      .then(data => {
        setRuns(data);
        if (data.length > 0) {
          // Find highest acc to auto-select
          const highestAccExp = data.reduce((prev, current) => {
            return (prev.metrics?.accuracy > current.metrics?.accuracy) ? prev : current;
          }, data[0]);
          setSelectedExpId(highestAccExp.id);
        }
      })
      .catch(console.error);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setInputImage(file);
      setImagePreview(URL.createObjectURL(file));
      setPredictionResult(null);
      setError(null);
    }
  };

  const handleRunPrediction = async () => {
    if (!selectedExpId) return;
    if (inputType === "text" && !inputText.trim()) return;
    if (inputType === "image" && !inputImage) return;

    setIsPredicting(true);
    setPredictionResult(null);
    setError(null);

    try {
      const formData = new FormData();
      if (inputType === "image" && inputImage) {
        formData.append("file", inputImage);
      } else if (inputType === "text") {
        formData.append("text", inputText);
      }

      const token = localStorage.getItem("aetheris_token");
      const res = await fetch(`${API_BASE}/v1/experiments/${selectedExpId}/predict`, {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || `Error ${res.status}`);
      }

      const data = await res.json();
      setPredictionResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to run prediction");
    } finally {
      setIsPredicting(false);
    }
  };

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

      <div className="grid-2 mb-24" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16 }}>
          <div className="flex-between" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Play size={18} color="var(--cyan)" /> Live Inference</h3>
            <select 
              value={selectedExpId} 
              onChange={e => setSelectedExpId(e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "6px 12px", borderRadius: 8, fontSize: 13, outline: "none" }}
            >
              {runs.map(r => <option key={r.id} value={r.id}>{r.name} ({r.id.substring(0,8)})</option>)}
            </select>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button 
              className={`btn ${inputType === 'image' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setInputType('image'); setPredictionResult(null); setError(null); }}
              style={{ flex: 1, padding: "8px 0" }}
            >
              <ImageIcon size={14} /> Image Input
            </button>
            <button 
              className={`btn ${inputType === 'text' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setInputType('text'); setPredictionResult(null); setError(null); }}
              style={{ flex: 1, padding: "8px 0" }}
            >
              <FileText size={14} /> Text Input
            </button>
          </div>

          {inputType === "image" ? (
            <div 
              style={{ 
                border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 12, padding: 32, 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.2)", cursor: "pointer", transition: "all 0.2s",
                position: "relative", overflow: "hidden", minHeight: 200
              }}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--cyan)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            >
              <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageChange} />
              
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: "#000" }} />
              ) : (
                <>
                  <UploadCloud size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Click to upload an image</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Supports PNG, JPG, JPEG</div>
                </>
              )}
            </div>
          ) : (
            <textarea 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Enter text to classify..."
              style={{ 
                width: "100%", height: 200, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: 16, color: "#fff", fontSize: 14, outline: "none", resize: "none"
              }}
            />
          )}

          <button 
            className="btn-cinematic" 
            style={{ width: "100%", marginTop: 20, justifyContent: "center", padding: "12px 0" }}
            onClick={handleRunPrediction}
            disabled={isPredicting || !selectedExpId}
          >
            {isPredicting ? <><Loader2 size={16} className="spin" /> Processing...</> : <><Sparkles size={16} /> Run Prediction</>}
          </button>
        </div>

        <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}><Activity size={18} color="var(--emerald)" /> Prediction Results</h3>
          
          {error && (
            <div style={{ padding: 16, background: "rgba(239, 68, 68, 0.1)", borderLeft: "4px solid #ef4444", borderRadius: 8, color: "#fca5a5", fontSize: 14 }}>
              {error}
            </div>
          )}

          {!predictionResult && !error && !isPredicting && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 14 }}>
              Submit an input to see prediction results.
            </div>
          )}

          {isPredicting && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div className="pulse-dot" style={{ background: "var(--cyan)", width: 24, height: 24 }} />
              <div style={{ color: "var(--cyan)", fontSize: 14, fontWeight: 500, letterSpacing: 1 }}>ANALYZING TENSOR</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Loading weights and running forward pass...</div>
            </div>
          )}

          {predictionResult && !isPredicting && (
            <div className="animate-in" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ padding: 24, background: "rgba(0, 0, 0, 0.3)", borderRadius: 12, border: "1px solid rgba(61, 220, 151, 0.2)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Predicted Class</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "var(--emerald)", textTransform: "capitalize" }}>{predictionResult.prediction}</div>
              </div>

              <div>
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Confidence Score</span>
                  <span className="mono" style={{ fontSize: 13, color: "var(--cyan)" }}>{(predictionResult.confidence * 100).toFixed(2)}%</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                  <div 
                    style={{ 
                      width: `${predictionResult.confidence * 100}%`, height: "100%", 
                      background: "linear-gradient(90deg, #00D4FF, #8B5CF6)", 
                      transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)" 
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: "auto" }}>
                <div style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Inference Latency</div>
                  <div className="mono" style={{ fontSize: 18, color: "#fff" }}>{predictionResult.latency_ms} <span style={{ fontSize: 12, color: "var(--text-muted)" }}>ms</span></div>
                </div>
                <div style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Model Architecture</div>
                  <div className="mono" style={{ fontSize: 14, color: "#fff", textTransform: "capitalize" }}>{predictionResult.model_type}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="ai-insight">
        <div className="ai-insight-label"><Sparkles size={14} /> AI Analysis</div>
        <p>Latest experiment analysis indicates the top performing run optimized accuracy effectively.</p>
      </div>
    </div>
  );
}
