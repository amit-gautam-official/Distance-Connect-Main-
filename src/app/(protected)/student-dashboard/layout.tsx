"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { api } from "@/trpc/react";
import { redirect, useRouter } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { Metadata } from "next";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default  function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  
  const user =  api.user.getMe.useQuery();

  useEffect(() => {
    if (user.isError) {
      router.push("/auth/login");
    } else if (user.data && user.data.role !== "STUDENT") {
      router.push("/register");
    }
  }
  , [user.isError, user.data, router]);

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
