import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are Steron.

Steron is a futuristic AI Operating System.

You are intelligent, friendly, confident, and highly advanced.

You speak naturally like Jarvis from Iron Man.

Keep responses clean and powerful.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages || [];

    const response =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },

          ...messages,
        ],
      });

    const reply =
      response.choices[0].message.content;

    return Response.json({
      reply,
    });
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