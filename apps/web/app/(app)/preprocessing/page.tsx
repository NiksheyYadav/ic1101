"use client";
import { Sparkles, Play, Save, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch, AuthError } from "../../../lib/api";

const defaultSteps = [
  { label: "Load Dataset", color: "var(--cyan)", icon: "📥", operation: "Load Dataset" },
  { label: "Clean Missing", color: "var(--emerald)", icon: "🧹", operation: "Clean Missing" },
  { label: "Normalize Features", color: "var(--cyan)", icon: "📐", operation: "Normalize Features" },
];

const blocks = [
  { label: "Text Tokenization", icon: "📝" }, { label: "Image Augmentation", icon: "🖼️" },
  { label: "Feature Selection", icon: "🎯" }, { label: "Balancing", icon: "⚖️" },
  { label: "Resizing", icon: "📏" }, { label: "PCA Reduction", icon: "📉" },
  { label: "Encode Categorical", icon: "🔢" }, { label: "Train/Test Split", icon: "✂️" },
];

export default function PreprocessingPage() {
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [currentSteps, setCurrentSteps] = useState<any[]>(defaultSteps);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiFetch<any[]>("/v1/preprocessing-pipelines")
      .then(data => {
        setPipelines(data);
        if (data.length > 0 && data[0].steps) {
          setCurrentSteps(data[0].steps.map((s: any) => ({...s, label: s.operation, color: s.color || "var(--cyan)", icon: s.icon || "⚙️"})));
        }
      })
      .catch((e) => {
        if (!(e instanceof AuthError)) console.error(e);
      });
  }, []);

  const addBlock = (block: any) => {
    setCurrentSteps([...currentSteps, { ...block, operation: block.label, color: "var(--violet)" }]);
    setActiveStepIndex(currentSteps.length);
  };

  const removeStep = (index: number) => {
    setCurrentSteps(currentSteps.filter((_, i) => i !== index));
    if (activeStepIndex >= index) setActiveStepIndex(Math.max(0, activeStepIndex - 1));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiFetch("/v1/preprocessing-pipelines", {
        method: "POST",
        body: JSON.stringify({
          workspace_id: "ws-default",
          name: "Custom Pipeline",
          steps: currentSteps.map(s => ({ operation: s.label, color: s.color, icon: s.icon }))
        })
      });
      alert("Pipeline saved successfully!");
    } catch (e) {
      if (!(e instanceof AuthError)) {
        alert("Failed to save pipeline.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const activeStep = currentSteps[activeStepIndex];

  return (
    <div className="animate-in">
      <div className="page-header">
        <div><h2>Preprocessing Pipeline</h2><div className="breadcrumb">Custom Pipeline Builder</div></div>
        <div className="flex-row">
          <button className="btn btn-secondary" onClick={handleSave} disabled={isSaving}>
            <Save size={14} /> {isSaving ? "Saving..." : "Save"}
          </button>
          <button className="btn btn-primary"><Play size={14} /> Run Pipeline</button>
        </div>
      </div>
      <div className="grid-2-1 mb-24">
        <div>
          <div className="pipeline-canvas mb-24">
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              {currentSteps.map((s: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div 
                    className={`pipeline-node ${i === activeStepIndex ? "active" : ""}`} 
                    onClick={() => setActiveStepIndex(i)}
                    style={{ borderLeftColor: s.color, borderLeftWidth: 3, cursor: "pointer", position: "relative" }}
                  >
                    <span style={{ fontSize: 18 }}>{s.icon}</span>{s.label}
                    {i > 0 && <span onClick={(e) => { e.stopPropagation(); removeStep(i); }} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>×</span>}
                  </div>
                  {i < currentSteps.length - 1 && <div className="pipeline-connector"><ArrowRight size={18} /></div>}
                </div>
              ))}
            </div>
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Available Blocks</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {blocks.map((b) => (
              <div key={b.label} onClick={() => addBlock(b)} className="card" style={{ padding: 14, cursor: "pointer", textAlign: "center", transition: "all 0.2s ease" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{b.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card mb-16">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Step Configuration</h3>
            {activeStep ? (
              <>
                <p style={{ fontSize: 12, color: activeStep.color, fontWeight: 600, marginBottom: 12 }}>{activeStep.icon} {activeStep.label}</p>
                <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Method</label>
                <select className="input-field" style={{ marginBottom: 16 }}>
                  <option>Default Auto-Detect</option>
                  <option>Min-Max Scaling</option><option>Standard (Z-score)</option><option>Robust Scaling</option>
                </select>
                <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Target Columns</label>
                <div className="flex-row" style={{ flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {["age", "income", "purchase_amount"].map((c) => (<span key={c} className="badge badge-cyan">{c}</span>))}
                </div>
                <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Preview Output</label>
                <div className="toggle on" />
              </>
            ) : (
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Select a step to configure.</p>
            )}
          </div>
          <div className="card mb-16">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Pipeline Preview</h3>
            <table className="data-table">
              <thead><tr><th>Column</th><th>Before</th><th>After</th></tr></thead>
              <tbody>
                <tr><td className="mono">age</td><td className="mono">25</td><td className="mono" style={{ color: "var(--emerald)" }}>0.312</td></tr>
                <tr><td className="mono">income</td><td className="mono">75000</td><td className="mono" style={{ color: "var(--emerald)" }}>0.681</td></tr>
                <tr><td className="mono">purchase</td><td className="mono">249.99</td><td className="mono" style={{ color: "var(--emerald)" }}>0.447</td></tr>
              </tbody>
            </table>
          </div>
          <div className="ai-insight">
            <div className="ai-insight-label"><Sparkles size={14} /> AI Suggestion</div>
            <p>Consider adding feature scaling before encoding for better model convergence. Robust scaling recommended for skewed income distribution.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
