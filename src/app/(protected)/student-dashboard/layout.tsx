import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { SessionUser } from "@/types/sessionUser";
import { SessionProvider } from "next-auth/react";
import PostLoginRedirect from "@/components/PostLoginRedirect";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  if (user) {
    if (user?.isRegistered) {
      if (user?.role === "MENTOR") {
        return redirect("/mentor-dashboard");
      }
    }
    if (!user?.isRegistered) {
      redirect("/register");
    }
  }else{
    redirect("/");
  }

  


  return (
     <SessionProvider session={session}>
    <PostLoginRedirect/>
    <SidebarProvider>
      <AppSidebar role="student" />
      <main>
        <div className="flex h-[calc(100dvh-69px)] w-screen justify-center md:w-[calc(100vw-280px)]">
          <div className="w-[calc(100vw-10%)] pb-20 md:w-[calc(100vw-280px)] md:pb-0">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
     </SessionProvider>
  );
}
