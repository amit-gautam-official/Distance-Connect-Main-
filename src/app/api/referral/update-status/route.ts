import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { status: 401 });
    }
    
    const body = await req.json();
    const { referralRequestId, proofUrl, additionalNotes } = body;
    
    if (!referralRequestId || !proofUrl) {
      return NextResponse.json({ 
        error: "Missing referral request ID or proof URL" 
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
    
    // Update the referral request with the proof URL and change status
    const updatedReferral = await db.referralRequest.update({
      where: { id: referralRequestId },
      data: {
        referralProofUrl: proofUrl,
        status: "REFERRAL_SENT",
        mentorFeedback: additionalNotes || undefined,
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      referral: updatedReferral,
      message: "Referral marked as sent successfully" 
    });
  } catch (error) {
    console.error("[REFERRAL_UPDATE_ERROR]", error);
    
    // Return a more specific error message based on the error type
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: `Update failed: ${error.message}` 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Internal server error during referral update" 
    }, { status: 500 });
  }
}
