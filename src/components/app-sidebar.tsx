"use client";
import {
  Inbox,
  LayoutDashboard,
  UserRound,
  Presentation,
  Users,
  BotMessageSquare,
  MessageCircleQuestion,
  LogOut,
  ChevronDown,
  Key,
  RotateCcw,
  MessageCircleReply,
  SquareChartGantt,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";

export function AppSidebar({ role }: { role: string }) {
  const { data: user } = api.user.getMe.useQuery(undefined, {
    // Reduce retries to avoid rate limit issues
    retry: 1,
    // Increase staleTime to reduce refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  // Initialize with null to avoid hydration mismatch
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    // Set initial window width after component mounts (client-side only)
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Student navigation items
  const Studentitems = [
    {
      title: "Dashboard",
      url: "/student-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      url: "/student-dashboard/profile",
      icon: UserRound,
    },
    {
      title: "Meetings",
      url: "/student-dashboard/meetings",
      icon: Presentation,
    },
    {
      title: "Mentors",
      url: "/student-dashboard/mentors",
      icon: Users,
    },
    {
      title: "Inbox",
      url: "/chat",
      icon: Inbox,
    },
    {
      title: "AI career assistant",
      url: "/ai",
      icon: BotMessageSquare,
    },
  ];

  // Student navigation items
  const Mentoritems = [
    {
      title: "Dashboard",
      url: "/mentor-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      url: "/mentor-dashboard/profile",
      icon: UserRound,
    },
    {
      title: "Meetings",
      url: "/mentor-dashboard/meetings",
      icon: Presentation,
    },
    {
      title: "Inbox",
      url: "/chat",
      icon: Inbox,
    },
    {
      title: "Services",
      url: "/mentor-dashboard/services",
      icon: SquareChartGantt,
    },
  ];

  // Bottom navigation items
  const downItems = [
    {
      title: "Help & Support",
      url:
        role === "student"
          ? "/student-dashboard/help-support"
          : "/mentor-dashboard/help-support",
      icon: MessageCircleQuestion,
    },
    {
      title: "Logout",
      url: "/auth/logout",
      icon: LogOut,
    },
  ];

  const path = usePathname();
  const [activePath, setActivePath] = useState(path);

  useEffect(() => {
    path && setActivePath(path);
  }, [path]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Fixed function to check if a URL matches the active path
  const isActive = (url: string) => {
    // For dashboard, only match exact path to prevent it from being active everywhere
    if (url === "/student-dashboard" || url === "/mentor-dashboard") {
      return activePath === url;
    }
    
    // For other URLs, check for exact match or if it's a nested route
    return activePath === url || 
           (url !== "/" && 
            url.length > 1 && 
            activePath.startsWith(url + "/"));
  };

  // Render mobile view only on client-side when windowWidth is available and less than 768px
  if (windowWidth !== null && windowWidth < 768) {
    const navigationItems = role === "student" ? Studentitems : Mentoritems;
    const limitedItems = [...navigationItems.slice(0, 5)]; // Limit to 4 items for mobile (reduced from 5 to make room for logout)

    if (!limitedItems.some((item) => item.title === "Profile")) {
      limitedItems.push({
        title: "Profile",
        url:
          role === "student"
            ? "/student-dashboard/profile"
            : "/mentor-dashboard/profile",
        icon: UserRound,
      });
    }

    // Add the logout item
    const logoutItem = downItems.find((item) => item.title === "Logout");
    //add help and support item
    const helpItem = downItems.find((item) => item.title === "Help & Support");

    return (
      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-sidebar-border bg-sidebar">
        <div className="flex h-12 items-center justify-around">
          {limitedItems.map((item) => {
            const active = isActive(item.url);
            return (
              <Link
                key={item.title}
                href={item.url}
                className={`flex w-1/7 flex-col items-center justify-center py-1 ${
                  active
                    ? "text-sidebar-primary"
                    : "text-sidebar-foreground"
                }`}
              >
                <item.icon className={`h-4 w-4 ${active ? "text-[#5580D6]" : ""}`} />
                <span className={`mt-1 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[8px] ${active ? "font-medium  text-[#5580D6]" : ""}`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
           {helpItem && (
            <Link
              key={helpItem.title}
              href={helpItem.url}
              className="flex w-1/7 flex-col items-center justify-center py-1 text-sidebar-foreground"
            >
              <helpItem.icon className="h-4 w-4" />
              <span className="mt-1 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[8px]">
                support
              </span>
            </Link>
          )}
          {logoutItem && (
            <Link
              key={logoutItem.title}
              href={logoutItem.url}
              className="flex w-1/7 flex-col items-center justify-center py-1 text-sidebar-foreground"
            >
              <logoutItem.icon className="h-4 w-4" />
              <span className="mt-1 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[8px]">
                {logoutItem.title}
              </span>
            </Link>
          )}
         
        </div>
      </div>
    );
  }

  // If windowWidth is null (during SSR) or windowWidth >= 768, render desktop sidebar
  return (
    <Sidebar
      className="group peer hidden text-sidebar-foreground md:block"
      data-state="expanded"
      data-collapsible=""
      data-variant="sidebar"
      data-side="left"
    >
      <SidebarContent className="relative h-svh w-[--sidebar-width] overflow-visible bg-transparent transition-[width] duration-200 ease-linear">
        <SidebarGroup className="overflow-visible">
          <SidebarGroupLabel>
            <Link href="/" className="cursor-pointer">
              <img src="/logo.png" alt="logo" className="w- h-[60px]" />
            </Link>
          </SidebarGroupLabel>

          <SidebarGroupContent className="flex h-[calc(100dvh-4rem)] flex-col justify-between overflow-visible pl-2 pt-4">
            {/* Main navigation */}
            <SidebarMenu>
              {role === "student" &&
                Studentitems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      size="lg"
                      isActive={isActive(item.url)}
                      asChild
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              {role === "mentor" &&
                Mentoritems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      size="lg"
                      isActive={isActive(item.url)}
                      asChild
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>

            {/* Support and settings */}
            <SidebarMenu>
              {downItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={isActive(item.url)}
                    asChild
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            {/* User profile with dropdown */}
            <SidebarMenu className="overflow-visible">
              <SidebarMenuItem className="overflow-visible">
                <div
                  className="relative overflow-visible"
                  ref={profileButtonRef}
                >
                  <SidebarMenuButton
                    onClick={toggleProfileDropdown}
                    className="flex h-10 cursor-pointer items-center justify-center overflow-hidden"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-600 text-white">
                      {user?.name?.[0] || "U"}
                    </div>
                    <div className="w-full truncate">{user?.name}</div>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}