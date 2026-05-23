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
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are Steron, a futuristic AI operating system.",
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