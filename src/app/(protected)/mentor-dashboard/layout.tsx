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
    const session = await auth();

    const user = await db.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    });

    if (!user || user?.role !== "MENTOR" || !user.isRegistered) {
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
