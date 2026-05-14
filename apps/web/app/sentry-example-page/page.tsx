"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh", 
      gap: "20px",
      background: "#000",
      color: "#fff",
      fontFamily: "Inter, sans-serif"
    }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "700" }}>Sentry Test Page</h1>
      <p style={{ color: "rgba(255,255,255,0.6)" }}>Click the button below to trigger a sample error.</p>
      
      <button
        type="button"
        onClick={() => {
          console.log("Triggering Sentry Error...");
          throw new Error("Sentry Test Error from Aetheris Web");
        }}
        style={{
          padding: "12px 24px",
          background: "#00D4FF",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        Trigger Error
      </button>

      <button
        type="button"
        onClick={() => {
          console.log("Incrementing test_metric...");
          Sentry.metrics.count('test_metric', 1);
          Sentry.metrics.distribution('api_response_time_test', Math.random() * 200 + 50);
          alert("Metrics sent to Sentry!");
        }}
        style={{
          padding: "12px 24px",
          background: "transparent",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
      >
        Send Test Metrics
      </button>

      <button
        type="button"
        onClick={() => {
          console.log("Sending a standard console.log...");
          Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' });
          alert("Log and console.log sent to Sentry!");
        }}
        style={{
          padding: "12px 24px",
          background: "transparent",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
      >
        Send Test Log
      </button>

      <button
        type="button"
        onClick={() => {
          Sentry.captureMessage("Test Message from Aetheris");
          alert("Message sent to Sentry!");
        }}
        style={{
          padding: "12px 24px",
          background: "transparent",
          color: "#00D4FF",
          border: "1px solid #00D4FF",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
      >
        Send Test Message
      </button>
    </div>
  );
}
