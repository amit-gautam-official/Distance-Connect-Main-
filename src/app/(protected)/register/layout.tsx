//layout 

import { auth0 } from "@/lib/auth0";
import { api } from "@/trpc/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};


export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();


const user = session?.user;
  if (!session?.user) {
    redirect("/auth/login");
  }
  
  if (!user) {
    return redirect("/auth/login");
  }

  const dbUser = await api?.user?.checkUser({ kindeId: user?.sub! });
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

