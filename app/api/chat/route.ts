import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages || [];

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content: `
You are Steron.

A futuristic AI operating system.

You are intelligent, friendly, highly advanced,
and helpful.

You remember previous conversation context.

You respond naturally like ChatGPT.

You are conversational, confident,
and futuristic.
            `,
          },

          ...messages,
        ],

        temperature: 0.8,

        max_tokens: 1000,
      });

    const reply =
      completion.choices[0].message.content;

    return Response.json({
      reply,
    });
  } catch (error) {
    console.error(error);

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