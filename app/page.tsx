"use client";

import { useState } from "react";
import { textToGloss } from "@/app/lib/api";
import ChatInput from "../app/components/ChatInput"; // your existing input

export default function Home() {
  const [gloss, setGloss] = useState<string>("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(message: string) {
    try {
      setLoading(true);
      setErr(null);
      const out = await textToGloss(message);
      setGloss(out.gloss);
      setTokens(out.tokens);
    } catch (e: any) {
      setErr(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Text → ASL Gloss</h1>

      <div className="text-sm text-zinc-500">
        Type a sentence below. We’ll show the **gloss** (UPPERCASE tokens).
      </div>

      <ChatInput onSubmit={handleSubmit} />

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
