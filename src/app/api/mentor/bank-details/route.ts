import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await req.json();
    const { 
      accountHolderName, 
      bankName, 
      accountNumber, 
      ifscCode, 
      panNumber, 
      bankBranch,
      mentorUserId 
    } = body;
    
    // Verify if the authenticated user is the mentor
    if (session.user.id !== mentorUserId) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    // Check if mentor exists
    const mentor = await db.mentor.findUnique({
      where: { userId: mentorUserId },
      include: { bankDetails: true }
    });
    
    if (!mentor) {
      return new NextResponse("Mentor not found", { status: 404 });
    }
    
    // Update or create bank details using upsert
    const bankDetails = await db.mentorBankDetails.upsert({
      where: { 
        mentorUserId: mentorUserId 
      },
      update: {
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        panNumber,
        bankBranch,
      },
      create: {
        mentorUserId,
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        panNumber,
        bankBranch,
      }
    });
    
    return NextResponse.json(bankDetails);
  } catch (error) {
    console.error("[BANK_DETAILS_API_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
