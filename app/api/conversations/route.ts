import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const conversations =
      await prisma.conversation.findMany({
        where: {
          clerkUserId: userId,
        },
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json({
      conversations,
    });
  } catch (error) {
    console.error(
      "Failed to fetch conversations:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversations",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    let title = "New conversation";

    try {
      const body = await request.json();

      if (
        body?.title &&
        typeof body.title === "string"
      ) {
        title = body.title.trim() || title;
      }
    } catch {
      // No request body is okay.
    }

    const conversation =
      await prisma.conversation.create({
        data: {
          clerkUserId: userId,
          title,
        },
      });

    return NextResponse.json({
      conversation,
    });
  } catch (error) {
    console.error(
      "Failed to create conversation:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create conversation",
      },
      { status: 500 }
    );
  }
}