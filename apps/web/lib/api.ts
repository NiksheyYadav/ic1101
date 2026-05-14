import { getSession, signIn } from "next-auth/react";

const API_BASE = "/api/proxy";

/** Thrown on 401 — polling loops should catch this and stop retrying. */
export class AuthError extends Error {
  constructor() {
    super("Unauthorized – session has no access token");
    this.name = "AuthError";
  }
}

let redirecting = false;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // Get token exclusively from NextAuth session
  let token: string | null = null;

  if (typeof window !== "undefined") {
    const session = await getSession();
    if ((session as any)?.accessToken) {
      token = (session as any).accessToken;
    }
  }

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

  if (res.status === 401) {
    // Redirect to sign-in once (avoid redirect storm)
    if (typeof window !== "undefined" && !redirecting) {
      redirecting = true;
      signIn(undefined, { callbackUrl: window.location.pathname });
    }
    throw new AuthError();
  }

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
  // Get token exclusively from NextAuth session
  let token: string | null = null;

  if (typeof window !== "undefined") {
    const session = await getSession();
    if ((session as any)?.accessToken) {
      token = (session as any).accessToken;
    }
  }

  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    signal,
  });

  if (res.status === 401) {
    if (typeof window !== "undefined" && !redirecting) {
      redirecting = true;
      signIn(undefined, { callbackUrl: window.location.pathname });
    }
    throw new AuthError();
  }

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
