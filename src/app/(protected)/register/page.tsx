import React from "react";
import RegisterForm from "./_components/RegisterForm";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth();
  const user = session?.user;
  // console.log("User",user)
  if (!user) {
    redirect('/auth/login');
  }
  const userInfo = {
    id: user?.id ?? "",
    name: user?.name ?? "",
    email: user?.email ?? "",
    image: user?.image ?? "",

  };

  return (
    <>
      <RegisterForm user={userInfo!} />
    </>
  );
}
