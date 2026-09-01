export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const profile = await prisma.patientProfile.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const profile = await prisma.patientProfile.upsert({
      where: {
        clerkUserId: userId,
      },
      update: {
        dateOfBirth: body.dateOfBirth
          ? new Date(body.dateOfBirth)
          : null,
        gender: body.gender || null,
        bloodGroup: body.bloodGroup || null,
        height: body.height ? Number(body.height) : null,
        weight: body.weight ? Number(body.weight) : null,
        allergies: body.allergies || null,
        emergencyContactName:
          body.emergencyContactName || null,
        emergencyContactPhone:
          body.emergencyContactPhone || null,
      },
      create: {
        clerkUserId: userId,
        dateOfBirth: body.dateOfBirth
          ? new Date(body.dateOfBirth)
          : null,
        gender: body.gender || null,
        bloodGroup: body.bloodGroup || null,
        height: body.height ? Number(body.height) : null,
        weight: body.weight ? Number(body.weight) : null,
        allergies: body.allergies || null,
        emergencyContactName:
          body.emergencyContactName || null,
        emergencyContactPhone:
          body.emergencyContactPhone || null,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile creation error:", error);

    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}