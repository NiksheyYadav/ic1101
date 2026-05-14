const API_BASE = "/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("aetheris_token")
      : null;

  const headers = new Headers(init?.headers);

  if (!(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}`);
  }

  return res.json();
}

async function fetchEventStream(
  path: string,
  onMessage: (data: any) => void,
  signal?: AbortSignal
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("aetheris_token")
      : null;

  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    signal,
  });

  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      if (part.startsWith("data: ")) {
        try {
          const data = JSON.parse(part.substring(6));
          onMessage(data);
        } catch (e) { }
      }
    }
  }
}

export { API_BASE, apiFetch, fetchEventStream };
