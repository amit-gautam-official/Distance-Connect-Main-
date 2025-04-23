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
  const session = await auth0.getSession();
 
   if (!session?.user) {
     redirect("/auth/login");
   }

  const user = await api.user.getMe();
  
  if (!user) {
    const synced = await syncUserToDb();
    if (synced) {
      return redirect("/register");
    } else {
      return redirect("/");
    }
  }
  
  if (user?.role !== "MENTOR") {
    redirect("/register");
  }

  return (
    <SidebarProvider>
      <AppSidebar role="mentor" />
      <main>
        <div className="flex h-[calc(100dvh-69px)] w-screen justify-center md:w-[calc(100vw-280px)]">
          <div className="w-[calc(100vw-10%)] pb-20 md:w-[calc(100vw-280px)] md:pb-0">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
