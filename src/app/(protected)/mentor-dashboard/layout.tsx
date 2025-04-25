import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {  getUserFromSession } from "@/data/user";
import { redirect } from "next/navigation";



export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  try {
  const user = await getUserFromSession();

  if (!user || user?.role !== "MENTOR" || !user.isRegistered) {
      redirect("/register");
  } 
  } catch (err) {
    redirect("/");
  }
 

  

  return (
    <SidebarProvider>
      <AppSidebar role="mentor" />
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
