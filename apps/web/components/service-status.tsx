"use client";

import { useEffect, useState } from "react";

type Props = {
  name: string;
  url: string;
};

export function ServiceStatus({ name, url }: Props) {
  const [status, setStatus] = useState<"loading" | "ok" | "down">("loading");

  useEffect(() => {
    let mounted = true;

    fetch(`${url}/healthz`)
      .then((res) => {
        if (!mounted) return;
        setStatus(res.ok ? "ok" : "down");
      })
      .catch(() => {
        if (!mounted) return;
        setStatus("down");
      });

    return () => {
      mounted = false;
    };
  }, [url]);

  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{url}</p>
      <strong data-status={status}>{status.toUpperCase()}</strong>
    </div>
  );
}
