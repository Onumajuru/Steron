"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: string;
  content: string;
};

export default function Home() {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!input) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);

    setInput("");

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!response.body) return;

      const reader =
        response.body.getReader();

      const decoder = new TextDecoder();

      let assistantMessage = "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ]);

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) break;

        const chunk =
          decoder.decode(value);

        assistantMessage += chunk;

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          };

          return updated;
        });
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  async function generateImage() {
    if (!input) return;

    const prompt = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: prompt,
      },
    ]);

    setInput("");

    setLoading(true);

    try {
      const response = await fetch(
        "/api/image",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            prompt,
          }),
        }
      );

      const data = await response.json();

      const image =
        `data:image/png;base64,${data.image}`;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: image,
        },
      ]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  async function handleSend() {
    if (
      input.toLowerCase().includes(
        "generate image"
      )
    ) {
      generateImage();
    } else {
      sendMessage();
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-6xl font-bold mb-8 text-cyan-400">
        STERON
      </h1>

      <div className="w-full max-w-6xl h-[80vh] border border-cyan-500 rounded-3xl bg-zinc-950 flex flex-col overflow-hidden shadow-2xl shadow-cyan-500/20">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {msg.content.startsWith(
                "data:image"
              ) ? (
                <img
                  src={msg.content}
                  alt="generated"
                  className="rounded-2xl max-w-md border border-cyan-500"
                />
              ) : (
                <div
                  className={`max-w-[70%] p-5 rounded-3xl text-2xl ${
                    msg.role === "user"
                      ? "bg-cyan-500 text-white"
                      : "bg-zinc-900"
                  }`}
                >
                  {msg.content}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="text-cyan-400">
              Steron is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-cyan-500 flex gap-4">
          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder="Ask Steron something..."
            className="flex-1 bg-black border border-cyan-500 rounded-2xl px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={handleSend}
            className="bg-cyan-500 hover:bg-cyan-400 transition px-8 py-4 rounded-2xl text-black font-bold text-xl"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}