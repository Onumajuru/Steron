"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<
    { role: string; content: string }[]
  >([]);

  const sendMessage = async () => {
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

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Error connecting to Steron.",
        },
      ]);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "70px",
          fontWeight: "bold",
          color: "#00d8ff",
        }}
      >
        STERON
      </h1>

      <p
        style={{
          fontSize: "20px",
          marginBottom: "30px",
        }}
      >
        Your AI Operating System
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          backgroundColor: "#111",
          border: "1px solid #00d8ff",
          borderRadius: "20px",
          padding: "30px",
          minHeight: "700px",
        }}
      >
        <h2
          style={{
            fontSize: "60px",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Chat with Steron
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "30px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                alignSelf:
                  message.role === "user"
                    ? "flex-end"
                    : "flex-start",

                backgroundColor:
                  message.role === "user"
                    ? "#00bde3"
                    : "#222",

                color: "white",

                padding: "20px",

                borderRadius: "20px",

                maxWidth: "80%",

                fontSize: "20px",

                lineHeight: "1.6",
              }}
            >
              {message.content}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder="Ask Steron something..."
            style={{
              flex: 1,
              padding: "20px",
              borderRadius: "15px",
              border:
                "1px solid #00d8ff",
              backgroundColor: "black",
              color: "white",
              fontSize: "22px",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              backgroundColor: "#00bde3",
              color: "black",
              border: "none",
              padding: "20px 40px",
              borderRadius: "15px",
              fontWeight: "bold",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}