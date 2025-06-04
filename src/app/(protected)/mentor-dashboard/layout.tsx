import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { SessionUser } from "@/types/sessionUser";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;
  


    if (user) {
        if (user?.isRegistered) {
          if (user?.role === "STUDENT") {
            return redirect("/student-dashboard");
          }
        }
        if (!user?.isRegistered) {
          redirect("/register");
        }
      }else{
        redirect("/");
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
