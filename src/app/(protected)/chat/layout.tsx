import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { Metadata } from "next";
import { syncUserToDb } from "@/lib/syncUser";

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
    if (!user) {
      redirect("/register");
    }

  }catch(err){
   redirect("/auth/login");
  }


  return (

          <div>
            {children}
          </div>

  );
}
