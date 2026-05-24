"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [input, setInput] =
    useState("");

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [image, setImage] =
    useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = {
      role: "user" as const,
      content: input,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);

    const response = await fetch(
      "/api/chat",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          messages:
            updatedMessages,
        }),
      }
    );

    const data =
      await response.json();

    setMessages([
      ...updatedMessages,
      {
        role: "assistant",
        content:
          data.reply ||
          "No response",
      },
    ]);

    setInput("");
  };

  const generateImage =
    async () => {
      if (!input) return;

      const response = await fetch(
        "/api/image",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            prompt: input,
          }),
        }
      );

      const data =
        await response.json();

      setImage(data.image);
    };

  return (
    <main
      style={{
        background: "black",
        minHeight: "100vh",
        color: "white",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "70px",
          color: "#00d9ff",
        }}
      >
        STERON
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <input
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          placeholder="Ask Steron..."

          style={{
            flex: 1,
            padding: "20px",
            fontSize: "20px",
            background: "#111",
            color: "white",
            border:
              "1px solid #00d9ff",
            borderRadius: "10px",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding:
              "20px 30px",
            background:
              "#00d9ff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          Chat
        </button>

        <button
          onClick={generateImage}
          style={{
            padding:
              "20px 30px",
            background:
              "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          Image
        </button>
      </div>

      {image && (
        <img
          src={image}
          alt="Generated"

          style={{
            width: "500px",
            marginTop: "30px",
            borderRadius: "20px",
          }}
        />
      )}

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection:
            "column",
          gap: "20px",
        }}
      >
        {messages.map(
          (message, index) => (
            <div
              key={index}
              style={{
                alignSelf:
                  message.role ===
                  "user"
                    ? "flex-end"
                    : "flex-start",

                background:
                  message.role ===
                  "user"
                    ? "#00d9ff"
                    : "#1a1a1a",

                color: "white",

                padding: "20px",

                borderRadius:
                  "15px",

                maxWidth: "70%",
              }}
            >
              {message.content}
            </div>
          )
        )}
      </div>
    </main>
  );
}