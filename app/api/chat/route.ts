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
            content:
              "You are Steron, a futuristic AI operating system. Be smart, friendly, and conversational.",
          },

          ...messages,
        ],
      });

    const reply =
      completion.choices[0].message.content;

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