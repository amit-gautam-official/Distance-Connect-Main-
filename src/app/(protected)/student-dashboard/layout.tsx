import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar role="student" />
      <main className="relative">
        <SidebarTrigger className="p-4 md:hidden" />
        <div className="w-[calc(100vw-280px)]">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
