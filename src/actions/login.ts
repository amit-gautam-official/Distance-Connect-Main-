"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/server/auth";
import { AuthError } from "next-auth";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  // Validate the input data
  const validatedData = LoginSchema.parse(data);

  // If the data is invalid, return an error
  if (!validatedData) {
    return { error: "Invalid input data" };
  }

  // Destructure the validated data
  const { email, password } = validatedData;

  // Check if user exists
  const userExists = await getUserByEmail(email);

  // If the user does not exist, return an error
  if (!userExists || !userExists.email || !userExists.password) {
    return { error: "User does not exist" };
  }

  try {
    await signIn("credentials", {
      email: userExists.email,
      password: password,
      redirectTo: "/register",
    });
  }  catch (error) {
    if (error instanceof AuthError) {
      // console.log("AuthError:", error , error.name);
      switch (error?.name) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Please confirm your email address (check mail)" };
      }
    }

    throw error;
  }

  return { success: "User logged in successfully" };
};