import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await api.user.getMe();

  if (!user || user.role !== "STUDENT") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar role="student" />
      <main>
        <SidebarTrigger className="p-4 md:hidden" />
        <div className="flex w-screen justify-center md:w-[calc(100vw-280px)]">
          <div className="w-[calc(100vw-10%)] md:w-[calc(100vw-280px)]">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
