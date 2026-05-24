// @ts-ignore
import pdf from "pdf-parse";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file =
      formData.get("file") as File;

    if (!file) {
      return Response.json(
        {
          error: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    let extractedText = "";

    if (
      file.type === "application/pdf"
    ) {
      const data =
        await pdf(buffer);

      extractedText = data.text;
    } else {
      extractedText =
        buffer.toString("utf-8");
    }

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content:
              "You are Steron, an AI document analysis system.",
          },

          {
            role: "user",
            content: `
Analyze this document and summarize it professionally:

${extractedText}
            `,
          },
        ],
      });

    return Response.json({
      reply:
        completion.choices[0].message
          .content,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        error:
          "Error analyzing document",
      },
      {
        status: 500,
      }
    );
  }
}