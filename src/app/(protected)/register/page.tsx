import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import React from "react";
import RegisterForm from "./_components/RegisterForm";
import { auth0 } from "@/lib/auth0";

export default async function RegisterPage() {
  const session = await auth0.getSession();
  const user = session?.user;
  //console.log("User",user)

  if (!user) {
    return redirect("/auth/login");
  }

  const dbUser = await api?.user?.checkUser({ kindeId: user?.sub! });
  console.log("--------------------- ",dbUser)
  if (user && dbUser?.isRegistered) {
    if (dbUser?.role === "STUDENT") {
      // return redirect("/student-dashboard");
      return redirect("/student-dashboard");
    }
    if (dbUser.role === "MENTOR") {
      // return redirect("/mentor-dashboard");
      return redirect("/mentor-dashboard");
    }
    if (dbUser.role === "STARTUP") {
      // return redirect("/startup-dashboard");
      return redirect("/startup-dashboard");
    }
    return redirect("/");
  }

  const userInfo = {
    id: user?.sub ?? "",
    firstName: user?.given_name ?? "",
    lastName: user?.family_name ?? "",
  };

  return (
    <>
      <RegisterForm user={userInfo!} />
    </>
  );
}
