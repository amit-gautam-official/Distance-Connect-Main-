import { redirect } from "next/navigation";
import { Metadata } from "next";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { SessionUser } from "@/types/sessionUser";

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  icons: [{ rel: "icon", url: "/smallLogo.png" }],
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {


    const session = await auth();

    const user = session?.user as SessionUser | null;

    if (!user || user?.role !== "MENTOR" || !user.isRegistered) {
        redirect("/register");
    } 



  return (
    <>
    {children}
    </>
  );
}
