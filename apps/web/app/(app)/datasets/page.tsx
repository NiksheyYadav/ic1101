"use client";
import { Upload, CloudLightning, Link2, CheckCircle, AlertTriangle, Sparkles, Database, Server, Key, Box } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect, useRef } from "react";
import { apiFetch, AuthError } from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

const distData = Array.from({ length: 10 }, (_, i) => ({ bin: `${i * 10}-${(i + 1) * 10}`, count: Math.floor(Math.random() * 500 + 50) }));

const sources = [
  { name: "CSV Upload", img: "/logos/csv.png" }, 
  { name: "Amazon S3", img: "/logos/amazon-s3.png" }, 
  { name: "Google Cloud", img: "/logos/google-cloud.png" },
  { name: "Hugging Face", icon: "🤗" }, 
  { name: "Kaggle", img: "/logos/kaggle.png" }, 
  { name: "Google Drive", img: "/logos/google-drive.png" },
];

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"upload" | "connect" | "url">("upload");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    apiFetch<any[]>("/v1/datasets")
      .then(setDatasets)
      .catch((e) => {
        if (!(e instanceof AuthError)) console.error(e);
      });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("workspace_id", "ws-default");
      const name = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      formData.append("name", name);
      formData.append("file", file);

      const res = await apiFetch<any>("/v1/datasets", {
        method: "POST",
        body: formData,
      });
      
      setDatasets((prev) => [...prev.filter(d => d.name !== res.name), res]);
    } catch (err) {
      if (!(err instanceof AuthError)) {
        console.error("Upload failed", err);
        alert("Failed to upload dataset.");
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const currentDataset = datasets.length > 0 ? datasets[datasets.length - 1] : null;
  const latestVersion = currentDataset?.versions?.[currentDataset.versions.length - 1] || null;

  const dynamicColumns = Array.isArray(latestVersion?.headers) && latestVersion.headers.length > 0 && typeof latestVersion.headers[0] === 'object' 
    ? latestVersion.headers 
    : [
    { name: "age", type: "int64", missing: "0%", status: "ok" },
    { name: "income", type: "float64", missing: "2.1%", status: "ok" },
    { name: "gender", type: "category", missing: "0%", status: "ok" },
    { name: "city", type: "string", missing: "18.3%", status: "warn" },
    { name: "purchase_amount", type: "float64", missing: "0.4%", status: "ok" },
    { name: "last_login", type: "datetime", missing: "12.7%", status: "warn" },
  ];

  return (
    <div className="animate-in" style={{ paddingBottom: 60 }}>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>Import Dataset</h2>
        <button className="btn-cinematic" style={{ padding: "8px 20px" }}><Database size={16} /> My Datasets</button>
      </div>

      <div className="tabs" style={{ marginBottom: 32, display: "flex", gap: 32, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div 
          className={`tab ${activeTab === "upload" ? "active" : ""}`} 
          onClick={() => setActiveTab("upload")}
          style={{ paddingBottom: 16, cursor: "pointer", position: "relative", color: activeTab === "upload" ? "#00D4FF" : "#A1A1AA", fontWeight: activeTab === "upload" ? 600 : 400 }}
        >
          Upload Files
          {activeTab === "upload" && <motion.div layoutId="tabIndicator" style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 2, background: "#00D4FF" }} />}
        </div>
        <div 
          className={`tab ${activeTab === "connect" ? "active" : ""}`} 
          onClick={() => setActiveTab("connect")}
          style={{ paddingBottom: 16, cursor: "pointer", position: "relative", color: activeTab === "connect" ? "#00D4FF" : "#A1A1AA", fontWeight: activeTab === "connect" ? 600 : 400 }}
        >
          Connect Source
          {activeTab === "connect" && <motion.div layoutId="tabIndicator" style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 2, background: "#00D4FF" }} />}
        </div>
        <div 
          className={`tab ${activeTab === "url" ? "active" : ""}`} 
          onClick={() => setActiveTab("url")}
          style={{ paddingBottom: 16, cursor: "pointer", position: "relative", color: activeTab === "url" ? "#00D4FF" : "#A1A1AA", fontWeight: activeTab === "url" ? 600 : 400 }}
        >
          URL Import
          {activeTab === "url" && <motion.div layoutId="tabIndicator" style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 2, background: "#00D4FF" }} />}
        </div>
      </div>

      <div className="grid-2-1 mb-24" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        
        {/* Dynamic Left Column based on Tab State */}
        <div style={{ position: "relative", minHeight: 460 }}>
          <AnimatePresence mode="wait">
            
            {activeTab === "upload" && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ position: "absolute", inset: 0 }}
              >
                <div 
                  className="pro-glass-panel" 
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  style={{ padding: "48px 24px", textAlign: "center", borderRadius: 16, background: "rgba(10,10,15,0.4)", border: "2px dashed rgba(255,255,255,0.1)", marginBottom: 24, cursor: isUploading ? "wait" : "pointer", opacity: isUploading ? 0.5 : 1 }}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept=".csv,.zip" />
                  <Upload size={48} color="#00D4FF" style={{ margin: "0 auto 16px auto", opacity: 0.8 }} />
                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{isUploading ? "Uploading..." : "Click or Drag & Drop files here"}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Supports CSV, ZIP (Images) — Max 100 MB</p>
                </div>
                
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#E4E4E7" }}>Connect Sources</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {sources.map((s) => (
                    <div key={s.name} className="pro-glass-panel" style={{ textAlign: "center", cursor: "pointer", padding: "24px 16px", borderRadius: 12, background: "rgba(10,10,15,0.4)", transition: "all 0.2s ease" }}>
                      <div style={{ height: 32, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {s.img ? (
                          <img src={s.img} alt={s.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }} />
                        ) : (
                          <span style={{ fontSize: 28 }}>{s.icon}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#E4E4E7" }}>{s.name}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "connect" && (
              <motion.div 
                key="connect"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ position: "absolute", inset: 0 }}
              >
                <div className="pro-glass-panel" style={{ padding: 32, borderRadius: 16, background: "rgba(10,10,15,0.4)", height: "100%" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><Server size={20} color="#00D4FF"/> Configure Database Connection</h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#A1A1AA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Connection Name</label>
                      <input type="text" placeholder="e.g. Production Data Lake" style={{ width: "100%", padding: "12px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "var(--font-sans)" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#A1A1AA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Provider</label>
                      <select style={{ width: "100%", padding: "12px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "var(--font-sans)" }}>
                        <option>Amazon S3</option>
                        <option>Google Cloud Storage</option>
                        <option>Snowflake</option>
                        <option>PostgreSQL</option>
                      </select>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#A1A1AA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Access Key / Username</label>
                        <input type="text" placeholder="Enter access key" style={{ width: "100%", padding: "12px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "var(--font-sans)" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#A1A1AA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Secret Key / Password</label>
                        <input type="password" placeholder="••••••••••••" style={{ width: "100%", padding: "12px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "var(--font-sans)" }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#A1A1AA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Bucket / Database Name</label>
                      <input type="text" placeholder="e.g. telemetry-logs-2026" style={{ width: "100%", padding: "12px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "var(--font-sans)" }} />
                    </div>
                    
                    <button className="btn-cinematic" style={{ padding: "12px", width: "100%", marginTop: 8 }}><CloudLightning size={16} /> Test & Connect Source</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "url" && (
              <motion.div 
                key="url"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ position: "absolute", inset: 0 }}
              >
                <div className="pro-glass-panel" style={{ padding: 48, borderRadius: 16, background: "rgba(10,10,15,0.4)", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                  <Link2 size={48} color="#8B5CF6" style={{ marginBottom: 24, opacity: 0.8 }} />
                  <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Import from Public URL</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32, maxWidth: 400 }}>Enter a direct link to a CSV, JSON, or ZIP file. The dataset will be downloaded and ingested automatically.</p>
                  
                  <div style={{ display: "flex", width: "100%", maxWidth: 480, gap: 12 }}>
                    <input type="text" placeholder="https://raw.githubusercontent.com/.../dataset.csv" style={{ flex: 1, padding: "14px 20px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "var(--font-sans)", fontSize: 14 }} />
                    <button className="btn-cinematic" style={{ padding: "0 24px" }}>Fetch</button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Static Right Column (Summary & Validation) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "rgba(10,10,15,0.4)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Import Summary {currentDataset && `(${currentDataset.name})`}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div><div style={{ fontSize: 12, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>File Size</div><div className="mono" style={{ fontSize: 20, fontWeight: 600 }}>-</div></div>
              <div><div style={{ fontSize: 12, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Rows</div><div className="mono" style={{ fontSize: 20, fontWeight: 600 }}>{latestVersion?.rows || "-"}</div></div>
              <div><div style={{ fontSize: 12, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Columns</div><div className="mono" style={{ fontSize: 20, fontWeight: 600 }}>{latestVersion?.columns || "-"}</div></div>
              <div><div style={{ fontSize: 12, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Health Score</div><div className="mono" style={{ fontSize: 20, fontWeight: 600, color: "var(--emerald)" }}>94%</div></div>
            </div>
          </div>
          
          <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "rgba(10,10,15,0.4)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Schema Validation</h3>
            <table className="data-table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
              <thead><tr style={{ color: "#A1A1AA", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}><th style={{ paddingBottom: 16, fontWeight: 500 }}>Column</th><th style={{ paddingBottom: 16, fontWeight: 500 }}>Type</th><th style={{ paddingBottom: 16, fontWeight: 500 }}>Missing</th><th style={{ paddingBottom: 16, fontWeight: 500 }}></th></tr></thead>
              <tbody>{dynamicColumns.map((c: any) => (
                <tr key={c.name} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <td className="mono" style={{ padding: "12px 0", fontSize: 13 }}>{c.name}</td>
                  <td style={{ padding: "12px 0" }}><span className="mono" style={{ fontSize: 11, background: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6", padding: "4px 8px", borderRadius: 4 }}>{c.type}</span></td>
                  <td style={{ padding: "12px 0" }}><span className="mono" style={{ color: c.status === "warn" ? "var(--amber)" : "var(--emerald)", fontSize: 13 }}>{c.missing}</span></td>
                  <td style={{ padding: "12px 0", textAlign: "right" }}>{c.status === "ok" ? <CheckCircle size={16} color="var(--emerald)" /> : <AlertTriangle size={16} color="var(--amber)" />}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          
          <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(0, 212, 255, 0.05))", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#8B5CF6", fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
              <Sparkles size={16} /> AI Recommendation
            </div>
            <p style={{ color: "#D4D4D8", fontSize: 14, lineHeight: 1.6 }}>2 columns have &gt;12% missing values. Recommend mean imputation for &apos;income&apos; and mode fill for &apos;city&apos;. Consider dropping &apos;last_login&apos; if not predictive.</p>
          </div>
        </div>
      </div>
      
      <div className="pro-glass-panel" style={{ padding: 24, borderRadius: 16, background: "rgba(10,10,15,0.4)" }}>
        <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600 }}>Distribution: purchase_amount</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={distData}>
            <XAxis dataKey="bin" tick={{ fill: "#A1A1AA", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#A1A1AA", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, backdropFilter: "blur(10px)" }} />
            <Bar dataKey="count" fill="#8B5CF6" opacity={0.8} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
