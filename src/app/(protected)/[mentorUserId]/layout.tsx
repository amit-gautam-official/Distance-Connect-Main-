import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  
   try{
     const user = await api.user.getMe();
     if (!user || user.role !== "STUDENT") {
       redirect("/register");
     }
 
   }catch(err){
    redirect("/auth/login");
   }

  return (

          <div className="w-[calc(100vw-10%)] pb-20 md:w-[calc(100vw-280px)] md:pb-0">
            {children}
          </div>

  );
}
