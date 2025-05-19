import client from "@/lib/contentful";
import { auth } from "@/server/auth";

import React from "react";
import { redirect } from "next/navigation";
import LandingPage from "./_components/LandingPage";
import { db } from "@/server/db";
import { SessionUser } from "@/types/sessionUser";

const Home = async () => {
  let loggedIn = false;
  let role = "USER";
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  if (user) {
    if (user?.isRegistered) {
      loggedIn = true;
      role = user?.role || "USER";
    }
    if (!user?.isRegistered) {
      redirect("/register");
    }
  }

  const response = await client?.getEntries({ content_type: "pageBlogPost" });

  const initialBlogs = response?.items?.sort(
    (a: any, b: any) =>
      new Date(b?.sys?.updatedAt).getTime() -
      new Date(a?.sys?.updatedAt).getTime(),
  );

  return <LandingPage role={role} blogs={initialBlogs} loggedId={loggedIn} />;
};

export default Home;
