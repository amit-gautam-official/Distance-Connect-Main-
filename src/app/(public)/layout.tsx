import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Navbar from "../_components/Navbar";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import Footer from "../_components/Footer";
import client from "@/lib/contentful";
import { auth } from "@/server/auth";

import { db } from "@/server/db";
import { SessionUser } from "@/types/sessionUser";

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Fetch the user session
  const session = await auth()
  const user = session?.user as SessionUser | null;

  let loggedIn = false;
  let role = "USER";

  if (user) {
    role = user?.role ?? "USER"; 
    loggedIn = true;
  }

  // Fetch blogs once on the server
  const response = await client.getEntries({ content_type: "pageBlogPost" });
  const initialBlogs = response?.items?.sort(
    (a, b) =>
      new Date(b?.sys?.updatedAt).getTime() -
      new Date(a?.sys?.updatedAt).getTime(),
  );
  // console.log("initialBlogs");

  return (
    <>
      <Navbar role={role!} blogs={initialBlogs} loggedId={loggedIn} />
      {children}
      <Footer />
    </>
  );
}
