"use server";

import { db } from "@/server/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import bcrypt from "bcryptjs";

interface ChangePasswordTokenPayload {
  token: string;
  newPassword: string;
}

export const changePasswordToken = async ({
  token,
  newPassword,
}: ChangePasswordTokenPayload) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User not found" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
      emailVerified: new Date().toISOString(), // Assuming you want to mark email as verified after password change
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password updated successfully" };
};
