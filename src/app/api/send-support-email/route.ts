import { NextRequest, NextResponse } from "next/server";
import { SupportEmailService, SupportRequest } from "@/lib/services/support-email-service";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = (await request.json()) as SupportRequest;
    const { name, email, username, message, phone } = body;

    // Validate required fields
    if (!name || !email || !message ) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Initialize support email service
    const supportEmailService = new SupportEmailService();
    
    // Verify email service connection
    const isConnected = await supportEmailService.verifyConnection();
    if (!isConnected) {
      console.error("Email service connection failed");
      return NextResponse.json(
        { error: "Failed to connect to email service" },
        { status: 500 }
      );
    }

    // Send the email
    const result = await supportEmailService.sendSupportEmail({
      name,
      email,
      username: username || "",
      message,
      phone: phone || "", 
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error sending support email:", error);
    return NextResponse.json(
      { error: "Failed to send support email" },
      { status: 500 }
    );
  }
} 