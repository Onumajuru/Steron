import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = body.prompt;

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024",
    });

    const image =
      response.data?.[0]?.b64_json || "";

    return Response.json({
      image,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        error: "Error generating image",
      },
      {
        status: 500,
      }
    );
  }
}