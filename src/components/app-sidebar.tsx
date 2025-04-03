"use client";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
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
      url: "/student-dashboard/inbox",
      icon: Inbox,
    },

    {
      title: "AI career assistant",
      url: "/student-dashboard/ai",
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
      url: "/mentor-dashboard/inbox",
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
      url: role === "student" ? "/student-dashboard/help-support" : "/mentor-dashboard/help-support",
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

  return (
    <Sidebar className="overflow-visible">
      <SidebarContent className="overflow-visible">
        <SidebarGroup className="overflow-visible">
          <SidebarGroupLabel>
          <Link href="/" className="cursor-pointer">
          <img src="/logo.png" alt="logo" className="h-[60px] w-" />
          </Link>
          </SidebarGroupLabel>

          <SidebarGroupContent className="flex h-[calc(100vh-4rem)] flex-col justify-between overflow-visible pl-2 pt-4">
            {/* Main navigation */}
            <SidebarMenu>
              {role === "student" &&
                Studentitems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      size="lg"
                      isActive={item.url === activePath}
                      asChild
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {
                role === "mentor" &&
                Mentoritems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      size="lg"
                      isActive={item.url === activePath}
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
                  <SidebarMenuButton asChild>
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
