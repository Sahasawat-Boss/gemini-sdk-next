"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setChat((prev) => [...prev, { role: "bot", text: data.reply }]);
    setMessage("");
    setLoading(false);
  };

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Gemini Chatbot
      </h1>

      {/* Chat box */}
      <div className="w-full max-w-3xl bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-4 h-[500px] overflow-y-auto shadow-lg">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] whitespace-pre-wrap text-sm leading-relaxed ${msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-slate-700 text-slate-100 rounded-bl-sm"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start mb-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-700 text-slate-300 text-sm animate-pulse">
              Gemini is thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="w-full max-w-3xl mt-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition disabled:opacity-50"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </main>
  );
}
