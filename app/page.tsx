const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: input,
  }),
});

if (!response.body) return;

const reader = response.body.getReader();
const decoder = new TextDecoder();

let assistantMessage = "";

setMessages((prev) => [
  ...prev,
  { role: "assistant", content: "" },
]);

while (true) {
  const { done, value } = await reader.read();

  if (done) break;

  const chunk = decoder.decode(value);

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