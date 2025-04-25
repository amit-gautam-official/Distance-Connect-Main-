import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { db } from "@/server/db";



export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {


   try {
       const session = await auth();
   
      const user = await db.user.findUnique({
              where: {
                  id : session?.user?.id,
              }
          }); 
   if (!user || user?.role !== "STUDENT" || !user.isRegistered) {
       redirect("/register");
   } 
   } catch (err) {
     redirect("/auth/login");
   }

  return (
    <SidebarProvider>
      <AppSidebar role="student" />
      <main>
        <div className="flex w-screen h-[calc(100dvh-69px)] justify-center md:w-[calc(100vw-280px)]">
          <div className="w-[calc(100vw-10%)] pb-20 md:w-[calc(100vw-280px)] md:pb-0">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
