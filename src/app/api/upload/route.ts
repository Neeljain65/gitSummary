import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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
    console.log("Cloudinary response:", result); // Keep general response logging for debugging

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}: ${JSON.stringify(result)}`);
    }

    return NextResponse.json({ secure_url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}