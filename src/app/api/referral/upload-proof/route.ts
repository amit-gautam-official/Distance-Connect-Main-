import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/server/db";
import { storage } from "@/lib/gcp-storage";

// Constants
const BUCKET_NAME = "dc-public-files";
const FOLDER_PREFIX = "referral-proofs";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const bucket = storage.bucket(BUCKET_NAME);

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { status: 401 });
    }
    
    const body = await req.json();
    const { referralRequestId, fileType, fileName } = body;
    
    if (!referralRequestId || !fileType) {
      return NextResponse.json({ 
        error: "Missing referral request ID or file type" 
      }, { status: 400 });
    }
    
    // Validate file type
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"];
    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ 
        error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}` 
      }, { status: 400 });
    }
    
    // Check if mentor exists
    const mentor = await db.mentor.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!mentor) {
      return NextResponse.json({ 
        error: "Mentor not found" 
      }, { status: 404 });
    }
    
    // Check if referral request belongs to this mentor
    const referralRequest = await db.referralRequest.findUnique({
      where: { id: referralRequestId },
      select: { mentorUserId: true }
    });
      if (!referralRequest || referralRequest.mentorUserId !== session.user.id) {
      return NextResponse.json({ 
        error: "Referral request not found or not owned by this mentor" 
      }, { status: 403 });
    }
    
    // Generate a unique filename with extension from the file type
    const fileExt = fileType.split('/')[1] || 'jpg';
    const cleanFileName = fileName ? fileName.replace(/\s/g, "_") : `file.${fileExt}`;
    const uniqueFileName = `${FOLDER_PREFIX}/${referralRequestId}/${cleanFileName}`;
    
    // Create a reference to the file in the bucket
    const file = bucket.file(uniqueFileName);
    
    try {
      // Generate a signed URL for uploading the file
      const [signedUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
        contentType: fileType,
        extensionHeaders: {
          "x-goog-content-length-range": `0,${MAX_FILE_SIZE}`, // Limit file size on upload
        },
      });
      
      // Generate a read URL that will be used after the upload
      const [readUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      return NextResponse.json({
        success: true,
        uploadUrl: signedUrl,
        readUrl: readUrl,
        fileName: uniqueFileName,
        message: "Upload URL generated successfully"
      });
    } catch (error) {
      console.error("GCP Signed URL generation error:", error);
      return NextResponse.json({ 
        error: "Failed to generate upload URL" 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("[REFERRAL_PROOF_URL_ERROR]", error);
    
    // Return a more specific error message based on the error type
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: `Failed to generate upload URL: ${error.message}` 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
