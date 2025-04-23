import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Navbar from "../_components/Navbar";
import { api } from "@/trpc/server";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import Footer from "../_components/Footer";
import client from "@/lib/contentful";
import { BlogProvider } from "@/contexts/BlogContext";

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Fetch the user session
  const session = await auth0.getSession();
  const user = session?.user;

  let loggedIn = false;
  let role = "USER";

  if (user) {
    const dbUser = await api.user.getMe();
    role = dbUser?.role ?? "USER"; 
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
