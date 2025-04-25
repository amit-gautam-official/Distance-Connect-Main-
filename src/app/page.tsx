import client from "@/lib/contentful";
import { auth } from "@/server/auth";
import { getUserById } from "@/data/user";

import React from 'react'
import { redirect } from "next/navigation";
import LandingPage from "./_components/LandingPage";

const Home = async () => {

  let loggedIn = false;
  let role = "USER";
  const session = await  auth();
  const user = await session?.user;

  if (user) {
    const dbUser = await getUserById(user?.id as string);
    if (dbUser?.isRegistered) {
      loggedIn = true;
      role = dbUser?.role;
    } else {
      redirect("/register");
    }
  }

  const response = await client?.getEntries({ content_type: "pageBlogPost" });

  const initialBlogs = response?.items?.sort(
    (a: any, b: any) =>
      new Date(b?.sys?.updatedAt).getTime() -
      new Date(a?.sys?.updatedAt).getTime()
  );

  return <LandingPage role={role} blogs={initialBlogs} loggedId={loggedIn}/>
}

export default Home