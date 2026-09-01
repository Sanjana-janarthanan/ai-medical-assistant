import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function POST(request: Request) {
  try {
    console.log(
      "========== SYMPTOM CHECKER API CALLED =========="
    );

    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized. Please sign in.",
        },
        { status: 401 }
      );
    }

    // Read request
    const body = await request.json();

    const symptoms = body?.symptoms;
    const duration = body?.duration || "Not specified";
    const severity = body?.severity || "Not specified";
    const fever = body?.fever || "Not specified";
    const additionalSymptoms =
      body?.additionalSymptoms || "None";

    if (
      !symptoms ||
      typeof symptoms !== "string" ||
      !symptoms.trim()
    ) {
      return NextResponse.json(
        {
          error: "Symptoms are required.",
        },
        { status: 400 }
      );
    }

    // Create structured prompt
    const prompt = `
You are an AI medical symptom information assistant.

The user has provided the following information:

Main symptoms:
${symptoms}

Duration:
${duration}

Severity:
${severity}

Fever:
${fever}

Additional symptoms:
${additionalSymptoms}

Provide general health information only.

IMPORTANT:
- Do not diagnose the user.
- Do not claim that the user definitely has a disease.
- Do not prescribe medications.
- Do not provide medication dosages.
- Clearly state that this is not a medical diagnosis.
- Consider common possibilities only as general information.
- Mention appropriate general self-care measures.
- Clearly identify warning signs that require urgent medical attention.
- If the symptoms could represent an emergency, clearly advise seeking immediate medical care.

Return ONLY valid JSON in exactly this structure:

{
  "summary": "A short explanation of what the symptoms may generally indicate.",
  "possibleCauses": [
    "Possible consideration 1",
    "Possible consideration 2",
    "Possible consideration 3"
  ],
  "recommendations": [
    "General recommendation 1",
    "General recommendation 2",
    "General recommendation 3"
  ],
  "warningSigns": [
    "Warning sign 1",
    "Warning sign 2",
    "Warning sign 3"
  ]
}
`;

    console.log(
      "Sending symptom analysis request to NVIDIA..."
    );

    const completion =
      await nvidia.chat.completions.create({
        model:
          "nvidia/nemotron-3-super-120b-a12b",

        messages: [
          {
            role: "system",
            content:
              "You are a careful medical information assistant. Always return valid JSON when requested.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.3,
        max_tokens: 1200,
      });

    const answer =
      completion.choices?.[0]?.message?.content;

    if (!answer) {
      return NextResponse.json(
        {
          error:
            "The AI returned an empty response.",
        },
        { status: 500 }
      );
    }

    console.log(
      "Raw symptom checker response:",
      answer
    );

    // Remove markdown code fences if NVIDIA adds them
    const cleanedAnswer = answer
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let result;

    try {
      result = JSON.parse(cleanedAnswer);
    } catch (parseError) {
      console.error(
        "Failed to parse AI JSON:",
        parseError
      );

      return NextResponse.json(
        {
          error:
            "The AI returned an unexpected response format. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.error(
      "========== SYMPTOM CHECKER ERROR =========="
    );
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze symptoms.",
      },
      { status: 500 }
    );
  }
}