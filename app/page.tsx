"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "steron-memory"
      );

    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "steron-memory",
      JSON.stringify(messages)
    );

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const typeMessage = async (
    text: string,
    updatedMessages: Message[]
  ) => {
    let currentText = "";

    setMessages([
      ...updatedMessages,
      {
        role: "assistant",
        content: "",
      },
    ]);

    for (let i = 0; i < text.length; i++) {
      currentText += text[i];

      await new Promise((resolve) =>
        setTimeout(resolve, 8)
      );

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: currentText,
        },
      ]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading)
      return;

    const userMessage: Message = {
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

      const assistantReply =
        data.reply ||
        "No response.";

      await typeMessage(
        assistantReply,
        updatedMessages
      );
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

    setLoading(false);
  };

  const clearChat = () => {
    localStorage.removeItem(
      "steron-memory"
    );

    setMessages([]);
  };

  return (
    <main
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(to bottom, #000000, #050816)",

        color: "white",

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        padding: "30px",
      }}
    >
      <h1
        style={{
          fontSize: "80px",

          fontWeight: "bold",

          color: "#00d8ff",

          textShadow:
            "0px 0px 20px #00d8ff",

          marginBottom: "10px",
        }}
      >
        STERON
      </h1>

      <p
        style={{
          fontSize: "22px",

          opacity: 0.8,

          marginBottom: "30px",
        }}
      >
        Your AI Operating System
      </p>

      <div
        style={{
          width: "100%",

          maxWidth: "1400px",

          height: "82vh",

          background:
            "rgba(10,10,10,0.95)",

          border:
            "1px solid rgba(0,216,255,0.3)",

          borderRadius: "25px",

          padding: "30px",

          display: "flex",

          flexDirection: "column",

          boxShadow:
            "0px 0px 40px rgba(0,216,255,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "60px",

              fontWeight: "bold",
            }}
          >
            Chat with Steron
          </h2>

          <button
            onClick={clearChat}
            style={{
              background: "#111",

              color: "#00d8ff",

              border:
                "1px solid #00d8ff",

              padding:
                "12px 20px",

              borderRadius: "12px",

              cursor: "pointer",

              fontSize: "18px",
            }}
          >
            Clear Chat
          </button>
        </div>

        <div
          style={{
            flex: 1,

            overflowY: "auto",

            display: "flex",

            flexDirection: "column",

            gap: "25px",

            paddingRight: "10px",
          }}
        >
          {messages.map(
            (message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",

                  justifyContent:
                    message.role ===
                    "user"
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      message.role ===
                      "user"
                        ? "#00bde3"
                        : "#1a1a1a",

                    color: "white",

                    padding: "22px",

                    borderRadius:
                      "22px",

                    maxWidth: "75%",

                    fontSize: "24px",

                    lineHeight: "1.7",

                    overflowX: "auto",

                    boxShadow:
                      "0px 0px 15px rgba(0,0,0,0.4)",
                  }}
                >
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            )
          )}

          {loading && (
            <div
              style={{
                display: "flex",

                justifyContent:
                  "flex-start",
              }}
            >
              <div
                style={{
                  background:
                    "#1a1a1a",

                  padding: "20px",

                  borderRadius:
                    "20px",

                  fontSize: "22px",
                }}
              >
                Steron is thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        <div
          style={{
            display: "flex",

            gap: "20px",

            marginTop: "25px",
          }}
        >
          <input
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                sendMessage();
              }
            }}
            placeholder="Ask Steron anything..."

            style={{
              flex: 1,

              padding: "24px",

              borderRadius:
                "18px",

              border:
                "1px solid #00d8ff",

              background:
                "#000",

              color: "white",

              fontSize: "22px",

              outline: "none",
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              background:
                "#00bde3",

              color: "black",

              border: "none",

              padding:
                "24px 40px",

              borderRadius:
                "18px",

              fontWeight:
                "bold",

              fontSize: "22px",

              cursor: "pointer",
            }}
          >
            {loading
              ? "Thinking..."
              : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}