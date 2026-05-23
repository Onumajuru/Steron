"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<
    { role: string; content: string }[]
  >([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    const currentMessage = message;

    setMessage("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages,
      }),
    });

    const reader = response.body?.getReader();

    if (!reader) return;

    const decoder = new TextDecoder();

    let aiResponse = "";

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
      },
    ]);

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);

      aiResponse += chunk;

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: "assistant",
          content: aiResponse,
        };

        return updated;
      });
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <h1 className="text-7xl font-bold text-cyan-400 mt-10">
        STERON
      </h1>

      <p className="text-2xl mt-4 text-gray-300">
        Your AI Operating System
      </p>

      <div className="w-full max-w-5xl mt-10 bg-zinc-900 border border-cyan-500 rounded-3xl p-6 shadow-2xl">
        <h2 className="text-5xl font-bold mb-6">
          Chat with Steron
        </h2>

        <div className="space-y-4 mb-6 h-[500px] overflow-y-auto pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-5 rounded-2xl text-lg whitespace-pre-wrap leading-relaxed ${
                msg.role === "user"
                  ? "bg-cyan-600 text-white ml-20 text-right"
                  : "bg-zinc-800 text-gray-200 mr-20"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="bg-zinc-800 text-gray-400 p-5 rounded-2xl mr-20 animate-pulse">
              Steron is thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="flex gap-4">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask Steron something..."
            className="flex-1 p-5 rounded-xl bg-black border border-cyan-500 text-white text-xl outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-cyan-500 hover:bg-cyan-400 transition-all text-black font-bold px-8 rounded-xl text-xl"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}