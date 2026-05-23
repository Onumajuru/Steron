import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are Steron, a futuristic AI operating system that remembers conversations and speaks intelligently.",
        },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text =
            chunk.choices[0]?.delta?.content || "";

          controller.enqueue(
            encoder.encode(text)
          );
        }

        controller.close();
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error(error);

    return Response.json({
      error: "Error talking to Steron",
    });
  }
}