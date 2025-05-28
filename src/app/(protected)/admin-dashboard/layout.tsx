
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { SessionUser } from "@/types/sessionUser";

import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  icons: [{ rel: "icon", url: "/smallLogo.png" }],
};


export default async function Layout({ children }: { children: React.ReactNode }) {

  const session = await auth();
  const user = session?.user as SessionUser | undefined;
  const dbUser = await db.user.findUnique({
    where: { id: user?.id },
    select: {
      role: true,
    }
  });
  
  if(dbUser?.role !== "ADMIN" || user?.role !== "ADMIN"){
    return redirect("/auth/login");
}

  return <>{children}</>;
}

