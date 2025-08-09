import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { db } from "~/server/db"; // Import Prisma client

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({ error: "No projectId provided" }, { status: 400 });
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "");
    uploadFormData.append("folder", "meetings");
    uploadFormData.append("resource_type", "video");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: uploadFormData,
      }
    );

    const result = await response.json();
    console.log("Cloudinary response:", result);

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}: ${JSON.stringify(result)}`);
    }

    // Create Meeting record in database
    const meeting = await db.meeting.create({
      data: {
        title: file.name,
        meetingUrl: result.secure_url,
        status: "PROCESSING",
        project: {
          connect: { id: projectId }, // Use connect to link to the project
        },
      },
    });

    return NextResponse.json({ secure_url: result.secure_url, meetingId: meeting.id });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}