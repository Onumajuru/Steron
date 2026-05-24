import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are Steron.

A futuristic AI Operating System.

You are intelligent, calm, advanced, and helpful.

Respond naturally and clearly.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages || [];

    const response =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        stream: true,

        messages: [
          {
            role: "system",
            content: systemPrompt,
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
    console.log(error);

    return Response.json(
      {
        error: "Error talking to Steron",
      },
      {
        status: 500,
      }
    );
  }
}