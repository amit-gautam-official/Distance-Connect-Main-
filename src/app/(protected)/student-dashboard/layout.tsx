import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";

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

  if (!user || user.role !== "STUDENT") {
    redirect("/register");
  }

  return (
    <SidebarProvider>
      <AppSidebar role="student" />
      <main>
        <div className="flex w-screen h-[calc(100vh-69px)] justify-center md:w-[calc(100vw-280px)]">
          <div className="w-[calc(100vw-10%)] pb-20 md:w-[calc(100vw-280px)] md:pb-0">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
