import React from "react";
import RegisterForm from "./_components/RegisterForm";
import { auth0 } from "@/lib/auth0";
import { auth } from "@/server/auth";

export default async function RegisterPage() {
  const session = await auth();
  const user = session?.user;
  // console.log("User",user)

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
