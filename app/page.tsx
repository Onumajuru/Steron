"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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
        setTimeout(resolve, 10)
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
        typeof data.reply ===
        "string"
          ? data.reply
          : "No response";

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

          marginBottom: "10px",

          textShadow:
            "0px 0px 20px #00d8ff",
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

          maxWidth: "1300px",

          height: "80vh",

          backgroundColor:
            "rgba(17,17,17,0.95)",

          border:
            "1px solid rgba(0,216,255,0.4)",

          borderRadius: "25px",

          padding: "30px",

          display: "flex",

          flexDirection: "column",

          boxShadow:
            "0px 0px 40px rgba(0,216,255,0.15)",
        }}
      >
        <h2
          style={{
            fontSize: "60px",

            fontWeight: "bold",

            marginBottom: "25px",
          }}
        >
          Chat with Steron
        </h2>

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
                        : "#1e1e1e",

                    color: "white",

                    padding: "22px",

                    borderRadius:
                      "22px",

                    maxWidth: "75%",

                    fontSize: "24px",

                    lineHeight: "1.7",

                    whiteSpace:
                      "pre-wrap",

                    boxShadow:
                      "0px 0px 15px rgba(0,0,0,0.4)",
                  }}
                >
                  {message.content}
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
                  backgroundColor:
                    "#1e1e1e",

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

              padding: "22px",

              borderRadius:
                "18px",

              border:
                "1px solid #00d8ff",

              backgroundColor:
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
              backgroundColor:
                "#00bde3",

              color: "black",

              border: "none",

              padding:
                "22px 45px",

              borderRadius:
                "18px",

              fontWeight:
                "bold",

              fontSize: "22px",

              cursor: "pointer",

              opacity: loading
                ? 0.6
                : 1,
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