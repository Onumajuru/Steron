import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const stream = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are Steron, a futuristic AI operating system.",
        },
        ...body.messages,
      ],
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text =
            chunk.choices[0]?.delta?.content || "";

          controller.enqueue(encoder.encode(text));
        }

        controller.close();
      },
    });

    return new Response(readableStream);

  } catch (error) {
    console.error(error);

    return new Response("Error connecting to Steron.", {
      status: 500,
    });
  }
}