"use client";

import {
  useState,
  useRef,
  useEffect,
} from "react";

type Message = {
  role: string;
  content: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

export default function Home() {
  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [chats, setChats] = useState<
    Chat[]
  >([
    {
      id: 1,
      title: "New Chat",
      messages: [],
    },
  ]);

  const [activeChatId, setActiveChatId] =
    useState(1);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const activeChat =
    chats.find(
      (chat) => chat.id === activeChatId
    )!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeChat.messages]);

  function updateMessages(
    newMessages: Message[]
  ) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: newMessages,
            }
          : chat
      )
    );
  }

  async function sendMessage() {
    if (!input) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages = [
      ...activeChat.messages,
      userMessage,
    ];

    updateMessages(updatedMessages);

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

      updateMessages([
        ...updatedMessages,
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

        updateMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: assistantMessage,
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  async function generateImage() {
    if (!input) return;

    const prompt = input;

    const updatedMessages = [
      ...activeChat.messages,
      {
        role: "user",
        content: prompt,
      },
    ];

    updateMessages(updatedMessages);

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

      updateMessages([
        ...updatedMessages,
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

  function createNewChat() {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [
      newChat,
      ...prev,
    ]);

    setActiveChatId(newChat.id);
  }

  function startVoiceInput() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice recognition not supported"
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (
      event: any
    ) => {
      const transcript =
        event.results[0][0].transcript;

      setInput(transcript);
    };
  }

  return (
    <main className="h-screen bg-black text-white flex">

      <div className="w-80 bg-zinc-950 border-r border-cyan-500 flex flex-col">

        <div className="p-4 border-b border-cyan-500">
          <button
            onClick={createNewChat}
            className="w-full bg-cyan-500 hover:bg-cyan-400 transition text-black font-bold py-3 rounded-xl"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">

          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() =>
                setActiveChatId(chat.id)
              }
              className={`w-full text-left p-4 rounded-xl transition ${
                activeChatId === chat.id
                  ? "bg-cyan-500 text-black"
                  : "bg-zinc-900 hover:bg-zinc-800"
              }`}
            >
              {chat.title}
            </button>
          ))}

        </div>
      </div>

      <div className="flex-1 flex flex-col">

        <div className="p-6 border-b border-cyan-500">
          <h1 className="text-6xl font-bold text-cyan-400">
            STERON
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">

          {activeChat.messages.map(
            (msg, index) => (
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
                    className="rounded-2xl max-w-lg border border-cyan-500 shadow-xl shadow-cyan-500/20"
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
            )
          )}

          {loading && (
            <div className="text-cyan-400 animate-pulse text-xl">
              Steron is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />

        </div>

        <div className="p-6 border-t border-cyan-500 flex gap-4">

          <button
            onClick={startVoiceInput}
            className="bg-purple-500 hover:bg-purple-400 transition px-6 rounded-2xl text-xl"
          >
            🎤
          </button>

          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder="Ask Steron something..."
            className="flex-1 bg-black border border-cyan-500 rounded-2xl px-6 py-4 text-xl outline-none focus:border-cyan-300"
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