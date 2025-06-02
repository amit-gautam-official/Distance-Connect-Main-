"use server";
import { generateVerificationToken } from "@/lib/token";
import { sendChangePasswordVerificationEmail } from "@/lib/emails/change-password-verification";
import { db } from "@/server/db";



export const forgetPassword = async (email : string) => {
    
  try {


    // Check if email is provided
    if (!email) {
        return { error: "Email is required." };
    }
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Please enter a valid email address." };
    }


    const lowerCaseEmail = email.toLowerCase();

    // Check to see if user exists
    const userExists = await db.user.findFirst({
      where: {
        email: lowerCaseEmail,
      },
    });
    if (!userExists) {
      return { error: "User with this email does not exist." };
    }


    

    // Generate Verification Token
    const verificationToken = await generateVerificationToken(lowerCaseEmail);

    await sendChangePasswordVerificationEmail(lowerCaseEmail, verificationToken.token);

    return { success: "Mail is sent to reset/change your password." };


  } catch (error) {
    // Handle the error, specifically check for a 503 error
    console.error("Database error:", error);

    if ((error as { code: string }).code === "ETIMEDOUT") {
      return {
        error: "Unable to connect to the database. Please try again later.",
      };
    } else if ((error as { code: string }).code === "503") {
      return {
        error: "Service temporarily unavailable. Please try again later.",
      };
    } else {
      return { error: "An unexpected error occurred. Please try again later." };
    }
  }
};






