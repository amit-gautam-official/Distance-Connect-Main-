import RegisterForm from "@/components/auth/forms/register-form";

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";
import { type SessionUser } from "@/types/sessionUser";
const RegisterPage = async () => {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  if (user) {
    if (user?.isRegistered) {
      if (user?.role === "MENTOR") {
        return redirect("/mentor-dashboard");
      }
      if (user?.role === "STUDENT") {
        return redirect("/student-dashboard");
      }
    }
    if (!user?.isRegistered) {
      redirect("/register");
    }
  }

  return <RegisterForm />;
};

export default RegisterPage;
