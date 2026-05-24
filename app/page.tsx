"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);

    const currentInput = input;

    setInput("");

    setLoading(true);

    try {
      // IMAGE GENERATION
      if (
        currentInput
          .toLowerCase()
          .includes("generate image") ||
        currentInput
          .toLowerCase()
          .includes("create image") ||
        currentInput
          .toLowerCase()
          .includes("draw")
      ) {
        const imageResponse = await fetch(
          "/api/image",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              prompt: currentInput,
            }),
          }
        );

        const imageData =
          await imageResponse.json();

        const aiMessage = {
          role: "assistant",
          image: `data:image/png;base64,${imageData.image}`,
        };

        setMessages((prev) => [
          ...prev,
          aiMessage,
        ]);
      }

      // CHAT
      else {
        const response = await fetch(
          "/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              messages: updatedMessages,
            }),
          }
        );

        const data =
          await response.json();

        const aiMessage = {
          role: "assistant",
          content: data.reply,
        };

        setMessages((prev) => [
          ...prev,
          aiMessage,
        ]);
      }
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  }

  function startVoiceInput() {
    const SpeechRecognition =
      (window as any)
        .SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice recognition not supported."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = (
      event: any
    ) => {
      const transcript =
        event.results[0][0]
          .transcript;

      setInput(transcript);
    };

    recognition.start();
  }

  return (
    <main
      style={{
        background:
          "linear-gradient(to bottom, black, #050816)",

        minHeight: "100vh",

        color: "white",

        padding: "30px",
      }}
    >
      <h1
        style={{
          textAlign: "center",

          marginBottom: "20px",

          fontSize: "42px",

          fontWeight: "bold",

          color: "#00d9ff",
        }}
      >
        STERON
      </h1>

      <p
        style={{
          textAlign: "center",

          marginBottom: "30px",

          color: "#9ca3af",
        }}
      >
        Your AI Operating System
      </p>

      <div
        style={{
          maxWidth: "1400px",

          margin: "0 auto",

          border:
            "1px solid rgba(0,217,255,0.4)",

          borderRadius: "24px",

          padding: "30px",

          background:
            "rgba(15,23,42,0.65)",

          backdropFilter: "blur(10px)",

          boxShadow:
            "0 0 40px rgba(0,217,255,0.15)",
        }}
      >
        <h1
          style={{
            fontSize: "72px",

            fontWeight: "bold",

            marginBottom: "20px",
          }}
        >
          Chat with Steron
        </h1>

        <div
          style={{
            height: "600px",

            overflowY: "auto",

            paddingRight: "10px",

            display: "flex",

            flexDirection: "column",

            gap: "25px",
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
                    background:
                      message.role ===
                      "user"
                        ? "#06b6d4"
                        : "#1f2937",

                    padding: "20px",

                    borderRadius:
                      "22px",

                    maxWidth: "70%",

                    fontSize: "22px",

                    lineHeight: "1.7",

                    boxShadow:
                      "0 0 20px rgba(0,0,0,0.4)",
                  }}
                >
                  {message.image ? (
                    <img
                      src={message.image}
                      alt="AI"
                      style={{
                        width: "100%",

                        borderRadius:
                          "18px",
                      }}
                    />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            )
          )}

          {loading && (
            <div
              style={{
                color: "#9ca3af",

                fontSize: "20px",
              }}
            >
              Steron is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
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
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask Steron anything..."
            style={{
              flex: 1,

              padding: "24px",

              borderRadius: "20px",

              border:
                "1px solid #00d9ff",

              background: "black",

              color: "white",

              fontSize: "22px",

              outline: "none",
            }}
          />

          <button
            onClick={startVoiceInput}
            style={{
              background: "#111827",

              border:
                "1px solid #00d9ff",

              color: "white",

              padding:
                "0 24px",

              borderRadius: "20px",

              fontSize: "22px",

              cursor: "pointer",
            }}
          >
            🎤
          </button>

          <button
            onClick={sendMessage}
            style={{
              background: "#06b6d4",

              border: "none",

              padding:
                "0 40px",

              borderRadius: "20px",

              fontSize: "22px",

              fontWeight: "bold",

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