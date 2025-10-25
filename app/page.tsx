"use client";

import { useState } from "react";
import ChatInput from "./components/ChatInput";

type GlossResponse = {
  gloss?: string;
  tokens?: string[];
  // If your backend returns something else (e.g., {data: {...}}) add it here
  error?: string;
  details?: string;
};

export default function Home() {
  const [gloss, setGloss] = useState<string>("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (message: string) => {
    if (!message?.trim()) return;

    setLoading(true);
    setErr(null);
    setGloss("");
    setTokens([]);

    try {
      const res = await fetch("/api/text-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // If your Python service expects a different key (e.g., { text: message }),
        // this body will be forwarded unchanged by your Next.js route:
        body: JSON.stringify({ text: message }),
        cache: "no-store",
      });

      const text = await res.text();
      // Try to parse JSON; if it fails, surface raw text so you can see what you got
      let data: GlossResponse;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Non-JSON response from API (status ${res.status}): ${text}`
        );
      }

      if (!res.ok) {
        // backend error surfaced as JSON
        throw new Error(data.error || data.details || `HTTP ${res.status}`);
      }

      // Adjust these to match your backend's payload shape
      const g = data.gloss ?? "";
      const t = Array.isArray(data.tokens) ? data.tokens : [];

      setGloss(g);
      setTokens(t);
    } catch (e: any) {
      setErr(e?.message || "Something went wrong contacting /api/text-sign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Text → ASL Gloss</h1>

      <div className="text-sm text-zinc-500">
        Type a sentence below. We’ll show the gloss (UPPERCASE tokens).
      </div>

      {/* Ensure ChatInput calls handleSubmit(message). 
          If your ChatInput uses a different prop name (e.g. onSend), change it here. */}
      <ChatInput onSubmit={handleSubmit} disabled={loading} />

      {loading && <div className="text-sm text-zinc-500">Translating…</div>}
      {err && <div className="text-sm text-red-500">{err}</div>}

      {gloss && (
        <div className="space-y-3">
          <div className="text-lg font-mono">{gloss}</div>
          <div className="flex flex-wrap gap-2">
            {tokens.map((t) => (
              <span
                key={t}
                className="rounded-full border px-3 py-1 text-sm bg-white"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
