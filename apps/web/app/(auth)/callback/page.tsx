"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("aetheris_token", token);
      window.location.href = "/dashboard";
    } else {
      console.error("No token received from OAuth callback");
      router.push("/signin");
    }
  }, [router, searchParams]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="pro-glass-panel"
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(10,10,15,0.3)",
        }}
      >
        <Loader2
          className="spin"
          size={32}
          color="#00D4FF"
          style={{ marginBottom: 16 }}
        />

        <h2 style={{ fontSize: 18, color: "#fff" }}>
          Authenticating...
        </h2>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 14,
            marginTop: 8,
          }}
        >
          Securing your session.
        </p>
      </motion.div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthCallbackContent />
    </Suspense>
  );
}