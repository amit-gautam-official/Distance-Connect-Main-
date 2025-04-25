

import { auth } from "@/server/auth";
import { db } from "@/server/db";

import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};


export default async function Layout({ children }: { children: React.ReactNode }) {

const session = await auth()

const user = session?.user;
  
  if (!user) {
    return redirect("/auth/login");
  }

  const dbUser = await db.user.findUnique({
    where: {
        id : user.id,
    }
}); 
  
  if (user && dbUser?.isRegistered) {
    if (dbUser?.role === "STUDENT") {
      return redirect("/student-dashboard");
    }
    if (dbUser.role === "MENTOR") {
      return redirect("/mentor-dashboard");
    }
    if (dbUser.role === "STARTUP") {
      return redirect("/startup-dashboard");
    } 
    return redirect("/");
  }

  return <>{children}</>;
}

