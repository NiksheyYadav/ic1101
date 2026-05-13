"use client";
import { Upload, CloudLightning, Link2, CheckCircle, AlertTriangle, Sparkles, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { apiFetch } from "../../../lib/api";

const distData = Array.from({ length: 10 }, (_, i) => ({ bin: `${i * 10}-${(i + 1) * 10}`, count: Math.floor(Math.random() * 500 + 50) }));

const sources = [
  { name: "CSV Upload", icon: "📄" }, { name: "Amazon S3", icon: "☁️" }, { name: "Google Cloud", icon: "🌐" },
  { name: "Hugging Face", icon: "🤗" }, { name: "Kaggle", icon: "📊" }, { name: "Google Drive", icon: "📁" },
];

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any[]>("/v1/datasets")
      .then(setDatasets)
      .catch(console.error);
  }, []);

  const currentDataset = datasets.length > 0 ? datasets[datasets.length - 1] : null;
  const latestVersion = currentDataset?.versions?.[currentDataset.versions.length - 1] || null;

  const dynamicColumns = latestVersion?.headers?.map((header: string) => ({
    name: header,
    type: "string", // Mocked type
    missing: "0%", // Mocked missing
    status: "ok", // Mocked status
  })) || [
    { name: "age", type: "int64", missing: "0%", status: "ok" },
    { name: "income", type: "float64", missing: "2.1%", status: "ok" },
    { name: "gender", type: "category", missing: "0%", status: "ok" },
    { name: "city", type: "string", missing: "18.3%", status: "warn" },
    { name: "purchase_amount", type: "float64", missing: "0.4%", status: "ok" },
    { name: "last_login", type: "datetime", missing: "12.7%", status: "warn" },
  ];

  return (
    <div className="animate-in">
      <div className="page-header"><h2>Import Dataset</h2><button className="btn btn-primary"><Database size={14} /> My Datasets</button></div>
      <div className="tabs">
        <div className="tab active">Upload Files</div>
        <div className="tab">Connect Source</div>
        <div className="tab">URL Import</div>
      </div>
      <div className="grid-2-1 mb-24">
        <div>
          <div className="drop-zone mb-24">
            <Upload size={40} />
            <h3>Drag & Drop files here</h3>
            <p>Supports CSV, JSON, Parquet, Image folders, Audio files — Max 10 GB</p>
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Connect Sources</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {sources.map((s) => (
              <div key={s.name} className="card" style={{ textAlign: "center", cursor: "pointer", padding: 16 }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{s.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card mb-16">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Import Summary {currentDataset && `(${currentDataset.name})`}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>File Size</div><div className="mono" style={{ fontSize: 18, fontWeight: 700 }}>-</div></div>
              <div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Rows</div><div className="mono" style={{ fontSize: 18, fontWeight: 700 }}>{latestVersion?.rows || "-"}</div></div>
              <div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Columns</div><div className="mono" style={{ fontSize: 18, fontWeight: 700 }}>{latestVersion?.columns || "-"}</div></div>
              <div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Health Score</div><div className="mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--emerald)" }}>94%</div></div>
            </div>
          </div>
          <div className="card mb-16">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Schema Validation</h3>
            <table className="data-table">
              <thead><tr><th>Column</th><th>Type</th><th>Missing</th><th></th></tr></thead>
              <tbody>{dynamicColumns.map((c: any) => (
                <tr key={c.name}>
                  <td className="mono">{c.name}</td><td><span className="badge badge-violet">{c.type}</span></td>
                  <td className={c.status === "warn" ? "" : ""}><span style={{ color: c.status === "warn" ? "var(--amber)" : "var(--emerald)" }}>{c.missing}</span></td>
                  <td>{c.status === "ok" ? <CheckCircle size={14} color="var(--emerald)" /> : <AlertTriangle size={14} color="var(--amber)" />}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="ai-insight">
            <div className="ai-insight-label"><Sparkles size={14} /> AI Recommendation</div>
            <p>2 columns have &gt;12% missing values. Recommend mean imputation for &apos;income&apos; and mode fill for &apos;city&apos;. Consider dropping &apos;last_login&apos; if not predictive.</p>
          </div>
        </div>
      </div>
      <div className="chart-card">
        <h3>Distribution: purchase_amount</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={distData}>
            <XAxis dataKey="bin" tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#4A5578", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0D1225", border: "1px solid #1A2140", borderRadius: 8 }} />
            <Bar dataKey="count" fill="#8B5CF666" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
