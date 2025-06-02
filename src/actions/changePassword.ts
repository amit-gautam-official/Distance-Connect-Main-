"use server";
import { db } from "@/server/db";
import { generateVerificationToken } from "@/lib/token";
import { auth } from "@/server/auth";
import { sendChangePasswordVerificationEmail } from "@/lib/emails/change-password-verification";
// import { sendVerificationEmail } from "@/lib/mail";



export const changePassword = async () => {
    
  try {
    const session = await auth();

    const user = await  session?.user;

    if (!user) {
      return { error: "User not authenticated" };
    }
   
 


    // Check to see if user  exists
    const userExists = await db.user.findFirst({
      where: {
        email : user.email,
      },
    });

    if (!userExists) {
      return { error: "User has not registered" };
    }

    const lowerCaseEmail = user.email.toLowerCase();

    

    // Generate Verification Token
    const verificationToken = await generateVerificationToken(lowerCaseEmail);

    await sendChangePasswordVerificationEmail(lowerCaseEmail, verificationToken.token);

    return { success: "Password Verification mail was sent." };


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






