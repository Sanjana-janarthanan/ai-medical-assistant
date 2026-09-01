import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    console.log(
      "========== MEDICAL DOCUMENT UPLOAD =========="
    );

    // =====================================================
    // 1. AUTHENTICATION
    // =====================================================

    const { userId } = await auth();

    console.log("Authenticated user:", userId);

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized. Please sign in.",
        },
        { status: 401 }
      );
    }

    // =====================================================
    // 2. GET FILE
    // =====================================================

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No file was uploaded.",
        },
        { status: 400 }
      );
    }

    console.log("File name:", file.name);
    console.log("File type:", file.type);
    console.log("File size:", file.size);

    // =====================================================
    // 3. VALIDATE FILE
    // =====================================================

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Only PDF, JPG, PNG, and WEBP files are allowed.",
        },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error:
            "File size must be less than 10 MB.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // 4. CHECK CLOUDINARY CONFIG
    // =====================================================

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error(
        "Cloudinary environment variables are missing."
      );

      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured correctly.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // 5. CONVERT FILE TO BUFFER
    // =====================================================

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // =====================================================
    // 6. UPLOAD TO CLOUDINARY
    // =====================================================

    console.log(
      "Uploading file to Cloudinary..."
    );

    const uploadResult =
      await new Promise<any>(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "ai-medical-assistant/medical-documents",

                resource_type: "raw",

                public_id: `${userId}_${Date.now()}_${file.name.replace(
                  /[^a-zA-Z0-9_-]/g,
                  "_"
                )}`,
              },

              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          uploadStream.end(buffer);
        }
      );

    console.log(
      "Cloudinary upload successful."
    );

    console.log(
      "Cloudinary URL:",
      uploadResult.secure_url
    );

    // =====================================================
    // 7. SAVE DOCUMENT IN DATABASE
    // =====================================================

    console.log(
      "Saving document to PostgreSQL..."
    );

    const document =
      await prisma.medicalDocument.create({
        data: {
          clerkUserId: userId,

          fileName: file.name,

          fileUrl:
            uploadResult.secure_url,

          fileType: file.type,

          description: null,
        },
      });

    console.log(
      "Document saved successfully:",
      document.id
    );

    // =====================================================
    // 8. RETURN RESULT
    // =====================================================

    return NextResponse.json(
      {
        message:
          "Medical document uploaded successfully.",

        document,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "========== MEDICAL DOCUMENT UPLOAD ERROR =========="
    );

    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save medical document.",
      },
      {
        status: 500,
      }
    );
  }
}