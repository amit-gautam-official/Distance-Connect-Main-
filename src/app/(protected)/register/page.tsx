import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import React from "react";
import RegisterForm from "./_components/RegisterForm";
import { auth0 } from "@/lib/auth0";

export default async function RegisterPage() {
  const session = await auth0.getSession();
  const user = session?.user;
  //console.log("User",user)


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
