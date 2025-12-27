"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Trash2, Bot, User, Sparkles } from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage(""); // Clear input early for better UX
    setChat((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setChat((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      setChat((prev) => [...prev, { role: "bot", text: "Sorry, I encountered an error." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const clearChat = () => setChat([]);

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-4 md:p-6">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl flex flex-col h-[85vh] z-10">
        {/* Header */}
        <header className="flex items-center justify-between bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-white leading-tight">Gemini AI</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
        </header>

        {/* Chat Window */}
        <div className="flex-1 bg-slate-900/40 backdrop-blur-sm border-x border-slate-800 overflow-y-auto p-4 md:p-6 space-y-6">
          {chat.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <Sparkles size={48} className="text-blue-500" />
              <p className="text-slate-400 max-w-xs">How can I help you today? Send a message to start the conversation.</p>
            </div>
          )}

          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start animate-in fade-in slide-in-from-bottom-2"}`}>
              <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${msg.role === "user" ? "bg-blue-600" : "bg-slate-800 border border-slate-700"}`}>
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-none"
                  }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Bot size={16} className="text-slate-500" />
                </div>
                <div className="bg-slate-800/50 px-4 py-2 rounded-2xl rounded-tl-none border border-slate-700 text-slate-400 text-xs italic">
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <footer className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-b-2xl">
          <div className="relative flex items-center">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything..."
              className="w-full pl-4 pr-14 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-all active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-500 mt-3 font-medium uppercase tracking-widest">
            Sahasawat Boss
          </p>
        </footer>
      </div>
    </main>
  );
}