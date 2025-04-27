"use server";

import * as z from "zod";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { AdminFormSchema } from "@/schemas";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/emails/email-verification";

export const registerAdmin = async (data: z.infer<typeof AdminFormSchema>) => {
  try {
    // Validate the input data
    const validatedData = AdminFormSchema.parse(data);

    //  If the data is invalid, return an error
    if (!validatedData) {
      return { error: "Invalid input data" };
    }

    //  Destructure the validated data
  const { email, name, password, secretKey } = validatedData;

  if (!email || !name || !password || !secretKey) {
    return { error: "All fields are required" };
    }

    // Check if the secret key is valid
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return { error: "Invalid secret key" };
    }
    // Check if email is already in use
    const emailExists = await db.user.findFirst({
      where: {
        email,
      },
    });
    // If the email already exists, return an error
    if (emailExists) {
      return { error: "Email already in use" };
    }
    
    

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

   


    const lowerCaseEmail = email.toLowerCase();

    // Create the user
    const user = await db.user.create({
      data: {
        email: lowerCaseEmail,
        name,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    // Generate Verification Token
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(lowerCaseEmail, verificationToken.token);

    return { success: "Email Verification was sent" };
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
