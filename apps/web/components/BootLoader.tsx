"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function BootLoader() {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  const isDashboard = pathname?.includes("/dashboard");

  const sequence = isDashboard 
    ? [
        { text: "AUTHENTICATING SESSION...", status: "OK" },
        { text: "FETCHING CLUSTER TELEMETRY...", status: "14.2GB" },
        { text: "INITIALIZING WORKSPACE...", status: "READY" },
      ]
    : [
        { text: "INITIALIZING NEURAL KERNEL...", status: "OK" },
        { text: "ALLOCATING VRAM...", status: "14.2GB" },
        { text: "ESTABLISHING SECURE UPLINK...", status: "READY" },
      ];

  const finalMessage = isDashboard ? "AETHERIS COMMAND CENTER ONLINE." : "AETHERIS OS v2.0 ONLINE.";

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setStage(1), 400);
    const t2 = setTimeout(() => setStage(2), 800);
    const t3 = setTimeout(() => setStage(3), 1200);
    const t4 = setTimeout(() => {
      setIsVisible(false);
      // Restore scrolling after fade out
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 800);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#050505",
            zIndex: 9999999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
          }}
        >
          <div style={{ width: 340, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                style={{ width: 24, height: 24, border: "2px solid rgba(0, 212, 255, 0.1)", borderTopColor: "#00D4FF", borderRadius: "50%" }}
              />
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, letterSpacing: 2 }}>
                {isDashboard ? "AETHERIS SECURE LOGIN" : "AETHERIS BOOT"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "#A1A1AA" }}>
              <div style={{ opacity: stage >= 0 ? 1 : 0 }}>{'>'} {sequence[0].text} <span style={{ color: "#3DDC97" }}>{sequence[0].status}</span></div>
              <div style={{ opacity: stage >= 1 ? 1 : 0 }}>{'>'} {sequence[1].text} <span style={{ color: "#3DDC97" }}>{sequence[1].status}</span></div>
              <div style={{ opacity: stage >= 2 ? 1 : 0 }}>{'>'} {sequence[2].text} <span style={{ color: "#3DDC97" }}>{sequence[2].status}</span></div>
              
              {stage >= 3 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ color: "#00D4FF", marginTop: 16, fontWeight: 600 }}
                >
                  {finalMessage}
                </motion.div>
              )}
            </div>

            <div style={{ width: "100%", height: 2, backgroundColor: "rgba(255,255,255,0.05)", marginTop: 40, borderRadius: 2, overflow: "hidden" }}>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: stage === 0 ? "30%" : stage === 1 ? "60%" : stage === 2 ? "90%" : "100%" }}
                transition={{ duration: 0.4 }}
                style={{ height: "100%", backgroundColor: "#00D4FF" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
