"use client";

import { useState } from "react";

export default function ChatInput({
  onSubmit,
  disabled = false,
}: {
  onSubmit?: (message: string) => void;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    const text = input.trim();
    if (!text) return;
    onSubmit?.(text);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl 
      bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md 
      border border-zinc-200 dark:border-zinc-700 
      rounded-2xl shadow-lg flex items-center gap-3 px-4 py-3 
      ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 bg-transparent outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 bg-black text-white dark:bg-zinc-100 dark:text-black rounded-xl font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
}
