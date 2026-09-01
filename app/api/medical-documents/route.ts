import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// =====================================================
// GET - Get user's medical documents
// =====================================================

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

    const documents =
      await prisma.medicalDocument.findMany({
        where: {
          clerkUserId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(documents);
  } catch (error) {
    console.error(
      "Failed to fetch medical documents:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch medical documents.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - Save medical document information
// =====================================================

export async function POST(request: Request) {
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

    const body = await request.json();

    const {
      fileName,
      fileUrl,
      fileType,
      description,
    } = body;

    if (
      !fileName ||
      typeof fileName !== "string"
    ) {
      return NextResponse.json(
        {
          error: "File name is required.",
        },
        { status: 400 }
      );
    }

    if (
      !fileUrl ||
      typeof fileUrl !== "string"
    ) {
      return NextResponse.json(
        {
          error: "File URL is required.",
        },
        { status: 400 }
      );
    }

    const document =
      await prisma.medicalDocument.create({
        data: {
          clerkUserId: userId,
          fileName: fileName.trim(),
          fileUrl: fileUrl.trim(),
          fileType:
            fileType &&
            typeof fileType === "string"
              ? fileType.trim()
              : null,
          description:
            description &&
            typeof description === "string"
              ? description.trim()
              : null,
        },
      });

    return NextResponse.json(
      document,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Failed to create medical document:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to save medical document.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE - Delete medical document
// =====================================================

export async function DELETE(
  request: Request
) {
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

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Document ID is required.",
        },
        { status: 400 }
      );
    }

    const document =
      await prisma.medicalDocument.findFirst({
        where: {
          id,
          clerkUserId: userId,
        },
      });

    if (!document) {
      return NextResponse.json(
        {
          error: "Document not found.",
        },
        { status: 404 }
      );
    }

    await prisma.medicalDocument.delete({
      where: {
        id: document.id,
      },
    });

    return NextResponse.json({
      message:
        "Medical document deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to delete medical document:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete medical document.",
      },
      { status: 500 }
    );
  }
}