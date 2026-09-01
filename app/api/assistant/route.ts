import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

console.log(
  "NVIDIA KEY EXISTS:",
  !!process.env.NVIDIA_API_KEY
);

const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

// =====================================================
// GET CONVERSATION
// =====================================================

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized. Please sign in.",
        },
        { status: 401 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const conversationId =
      searchParams.get(
        "conversationId"
      );

    // -------------------------------------------------
    // If a specific conversation was requested
    // -------------------------------------------------

    if (conversationId) {
      const conversation =
        await prisma.conversation.findFirst({
          where: {
            id: conversationId,
            clerkUserId: userId,
          },
          include: {
            messages: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

      if (!conversation) {
        return NextResponse.json(
          {
            error:
              "Conversation not found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        conversation,
        messages:
          conversation.messages,
      });
    }

    // -------------------------------------------------
    // Otherwise load latest conversation
    // -------------------------------------------------

    const conversation =
      await prisma.conversation.findFirst({
        where: {
          clerkUserId: userId,
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    if (!conversation) {
      return NextResponse.json({
        conversation: null,
        messages: [],
      });
    }

    return NextResponse.json({
      conversation,
      messages:
        conversation.messages,
    });

  } catch (error) {
    console.error(
      "Failed to load assistant:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load conversation.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// POST MESSAGE
// =====================================================

export async function POST(
  request: Request
) {
  try {
    console.log(
      "========== ASSISTANT API CALLED =========="
    );

    // =================================================
    // 1. AUTH
    // =================================================

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. Please sign in.",
        },
        { status: 401 }
      );
    }

    // =================================================
    // 2. REQUEST BODY
    // =================================================

    const body =
      await request.json();

    console.log(
      "Request body:",
      body
    );

    const message =
      body?.message;

    const conversationId =
      body?.conversationId;

    const isSymptomChecker =
      body?.isSymptomChecker === true;

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Message is required.",
        },
        { status: 400 }
      );
    }

    const cleanMessage =
      message.trim();

    // =================================================
    // 3. LOAD PROFILE
    // =================================================

    const profile =
      await prisma.patientProfile.findUnique(
        {
          where: {
            clerkUserId: userId,
          },
        }
      );

    // =================================================
    // 4. GET OR CREATE CONVERSATION
    // =================================================

    let conversation;

    // If a conversation ID was supplied,
    // make sure it belongs to this user.
    if (conversationId) {
      conversation =
        await prisma.conversation.findFirst(
          {
            where: {
              id: conversationId,
              clerkUserId: userId,
            },
          }
        );

      if (!conversation) {
        return NextResponse.json(
          {
            error:
              "Conversation not found.",
          },
          { status: 404 }
        );
      }
    }

    // For symptom checker, ALWAYS create
    // a fresh conversation.
    if (
      isSymptomChecker
    ) {
      conversation =
        await prisma.conversation.create(
          {
            data: {
              clerkUserId: userId,
              title:
                "Symptom Checker Analysis",
            },
          }
        );

      console.log(
        "Created symptom conversation:",
        conversation.id
      );
    }

    // Normal chat with no conversation
    if (!conversation) {
      conversation =
        await prisma.conversation.findFirst(
          {
            where: {
              clerkUserId: userId,
            },
            orderBy: {
              updatedAt: "desc",
            },
          }
        );
    }

    // Still nothing? Create one.
    if (!conversation) {
      conversation =
        await prisma.conversation.create(
          {
            data: {
              clerkUserId: userId,
              title:
                cleanMessage.slice(
                  0,
                  50
                ),
            },
          }
        );
    }

    // =================================================
    // 5. LOAD HISTORY
    // =================================================

    const previousMessages =
      await prisma.message.findMany(
        {
          where: {
            conversationId:
              conversation.id,
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 20,
        }
      );

    // =================================================
    // 6. PATIENT CONTEXT
    // =================================================

    let patientContext = `
No patient profile information is available.
`;

    if (profile) {
      patientContext = `
Patient profile information:

- Date of birth: ${
        profile.dateOfBirth
          ? profile.dateOfBirth
              .toISOString()
              .split("T")[0]
          : "Not provided"
      }

- Gender: ${
        profile.gender ||
        "Not provided"
      }

- Blood group: ${
        profile.bloodGroup ||
        "Not provided"
      }

- Height: ${
        profile.height !== null
          ? `${profile.height} cm`
          : "Not provided"
      }

- Weight: ${
        profile.weight !== null
          ? `${profile.weight} kg`
          : "Not provided"
      }

- Known allergies: ${
        profile.allergies ||
        "None reported"
      }
`;
    }

    // =================================================
    // 7. SYSTEM PROMPT
    // =================================================

    const systemPrompt =
      isSymptomChecker
        ? `
You are the Symptom Analysis component of an AI Medical Assistant.

The user has completed a symptom checker questionnaire.

Your job is to carefully analyze the information they provided.

IMPORTANT:

- Do NOT provide a definitive diagnosis.
- Do NOT prescribe medication.
- Do NOT recommend medication dosages.
- Do NOT tell the user to start, stop, or change prescription medication.
- Give general health information only.
- Clearly mention when professional medical attention may be needed.
- If symptoms suggest a possible emergency, clearly tell the user to seek urgent medical care.

Analyze the questionnaire in a structured and easy-to-understand way.

Use this structure:

SYMPTOM SUMMARY
Briefly summarize what the user reported.

WHAT THESE SYMPTOMS MAY BE ASSOCIATED WITH
Explain general possibilities without diagnosing.

COMMON POSSIBLE CAUSES
Mention common, general possibilities where appropriate.

GENERAL SELF-CARE
Give safe general wellness/self-care information.

WARNING SIGNS
Explain symptoms that require urgent medical attention.

WHEN TO SEE A DOCTOR
Explain when the user should contact a healthcare professional.

IMPORTANT
End by reminding the user that this is general health information and not a medical diagnosis.

PATIENT CONTEXT:
${patientContext}
`
        : `
You are an AI Medical Assistant.

Your purpose is to provide general health information,
symptom education, wellness guidance, and safety advice.

IMPORTANT SAFETY RULES:

1. Do not diagnose diseases with certainty.
2. Do not prescribe medications.
3. Do not provide medication dosages.
4. Do not tell users to start, stop, or change prescription medication.
5. If symptoms could indicate an emergency, recommend immediate professional medical attention.
6. Encourage users to consult qualified healthcare professionals when appropriate.
7. Keep responses clear, calm, practical, and easy to understand.
8. Do not unnecessarily repeat private patient information.
9. Use patient profile information only when relevant.
10. Never claim to replace a doctor.

PATIENT CONTEXT:
${patientContext}
`;

    // =================================================
    // 8. AI MESSAGES
    // =================================================

    const aiMessages = [
      {
        role: "system" as const,
        content:
          systemPrompt,
      },

      ...previousMessages.map(
        (msg) => ({
          role:
            msg.role === "user"
              ? ("user" as const)
              : ("assistant" as const),

          content:
            msg.content,
        })
      ),

      {
        role: "user" as const,
        content:
          cleanMessage,
      },
    ];

    // =================================================
    // 9. NVIDIA
    // =================================================

    console.log(
      "Sending request to NVIDIA..."
    );

    const completion =
      await nvidia.chat.completions.create(
        {
          model:
            "nvidia/nemotron-3-super-120b-a12b",

          messages:
            aiMessages,

          temperature: 0.7,

          max_tokens: 1500,
        }
      );

    console.log(
      "NVIDIA response received."
    );

    const answer =
      completion.choices?.[0]
        ?.message?.content;

    if (!answer) {
      return NextResponse.json(
        {
          error:
            "NVIDIA returned an empty answer.",
        },
        { status: 500 }
      );
    }

    // =================================================
    // 10. SAVE USER MESSAGE
    // =================================================

    await prisma.message.create({
      data: {
        conversationId:
          conversation.id,

        role: "user",

        content:
          cleanMessage,
      },
    });

    // =================================================
    // 11. SAVE AI MESSAGE
    // =================================================

    await prisma.message.create({
      data: {
        conversationId:
          conversation.id,

        role: "assistant",

        content: answer,
      },
    });

    // =================================================
    // 12. UPDATE CONVERSATION
    // =================================================

    await prisma.conversation.update({
      where: {
        id: conversation.id,
      },

      data: {
        updatedAt:
          new Date(),
      },
    });

    console.log(
      "Messages saved successfully."
    );

    // =================================================
    // 13. RETURN
    // =================================================

    return NextResponse.json({
      response: answer,

      conversationId:
        conversation.id,
    });

  } catch (error) {
    console.error(
      "========== ASSISTANT ERROR =========="
    );

    console.error(error);

    console.error(
      "====================================="
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}