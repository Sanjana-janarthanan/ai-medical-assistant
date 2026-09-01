import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

    const [
      profile,
      medications,
      documents,
      conversationCount,
      messageCount,
    ] = await Promise.all([
      prisma.patientProfile.findUnique({
        where: {
          clerkUserId: userId,
        },
      }),

      prisma.medication.findMany({
        where: {
          clerkUserId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),

      prisma.medicalDocument.findMany({
        where: {
          clerkUserId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),

      prisma.conversation.count({
        where: {
          clerkUserId: userId,
        },
      }),

      prisma.message.count({
        where: {
          conversation: {
            clerkUserId: userId,
          },
        },
      }),
    ]);

    return NextResponse.json({
      profile,
      medications,
      documents,
      conversationCount,
      messageCount,
    });
  } catch (error) {
    console.error(
      "Health summary error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load health summary.",
      },
      { status: 500 }
    );
  }
}