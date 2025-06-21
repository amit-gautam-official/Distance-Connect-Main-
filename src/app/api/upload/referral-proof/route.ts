import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || "{}"),
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME || "");

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const referralRequestId = formData.get("referralRequestId") as string;
    
    if (!file || !referralRequestId) {
      return new NextResponse("Missing file or referral request ID", { status: 400 });
    }
    
    // Create a buffer from the file
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate a unique filename
    const fileName = `referral-proofs/${referralRequestId}/${uuidv4()}-${file.name.replace(/\s/g, "_")}`;
    
    // Upload to GCP bucket
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.type,
      },
    });
    
    // Return a promise that resolves with the public URL
    const uploadPromise = new Promise((resolve, reject) => {
      blobStream.on("error", (err) => {
        console.error("Upload error:", err);
        reject(err);
      });
      
      blobStream.on("finish", async () => {
        // Make the file publicly accessible
        await blob.makePublic();
        
        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        resolve(publicUrl);
      });
      
      blobStream.end(buffer);
    });
    
    const publicUrl = await uploadPromise;
    
    return NextResponse.json({ success: true, fileUrl: publicUrl });
  } catch (error) {
    console.error("[FILE_UPLOAD_API_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
