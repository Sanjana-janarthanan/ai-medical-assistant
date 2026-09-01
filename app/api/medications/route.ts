import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// =====================================================
// GET MEDICATIONS
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

    const medications =
      await prisma.medication.findMany({
        where: {
          clerkUserId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      medications
    );
  } catch (error) {
    console.error(
      "Failed to fetch medications:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch medications.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// CREATE MEDICATION
// =====================================================

export async function POST(
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

    const body = await request.json();

    const {
      name,
      dosage,
      frequency,
      startDate,
      notes,
    } = body;

    if (
      !name ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Medication name is required.",
        },
        { status: 400 }
      );
    }

    const medication =
      await prisma.medication.create({
        data: {
          clerkUserId: userId,

          name: name.trim(),

          dosage:
            dosage &&
            typeof dosage === "string"
              ? dosage.trim()
              : null,

          frequency:
            frequency &&
            typeof frequency === "string"
              ? frequency.trim()
              : null,

          startDate: startDate
            ? new Date(startDate)
            : null,

          notes:
            notes &&
            typeof notes === "string"
              ? notes.trim()
              : null,
        },
      });

    return NextResponse.json(
      medication,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Failed to create medication:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to save medication.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE MEDICATION
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

    const url = new URL(request.url);

    const id =
      url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Medication ID is required.",
        },
        { status: 400 }
      );
    }

    const medication =
      await prisma.medication.findUnique({
        where: {
          id,
        },
      });

    if (!medication) {
      return NextResponse.json(
        {
          error:
            "Medication not found.",
        },
        { status: 404 }
      );
    }

    if (
      medication.clerkUserId !== userId
    ) {
      return NextResponse.json(
        {
          error:
            "You are not allowed to delete this medication.",
        },
        { status: 403 }
      );
    }

    await prisma.medication.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message:
        "Medication deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to delete medication:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete medication.",
      },
      { status: 500 }
    );
  }
}