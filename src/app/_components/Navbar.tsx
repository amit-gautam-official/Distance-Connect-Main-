"use client";

import { User } from "@prisma/client";
import { CircleHelp } from "lucide-react";
import { Headphones } from "lucide-react";
import { Settings } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import Link from "next/link";
import { api } from "@/trpc/react";


const Navbar = ({ role, loggedId, blogs }: {role: string, loggedId: boolean; blogs: any }) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  //get only top 4 blogs
  const top4Blogs = blogs?.slice(0, 4);
  const components = top4Blogs?.map((blog: any) => ({
    title: blog?.fields?.title.trim().substring(0, 20).concat("..."),
    href: `/blog/${blog?.fields?.slug}`,
    description: blog?.fields?.shortDescription
      .trim()
      .substring(0, 50)
      .concat("..."),
    imageUrl: blog?.fields?.featuredImage?.fields?.file?.url,
    imageAlt: blog?.fields?.featuredImage?.fields?.title,
  }));

  // console.log(blogs);

  // console.log(components);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowNavbar(false); // Hide the navbar when scrolling down
    } else {
      setShowNavbar(true); // Show the navbar when scrolling up
    }
    setLastScrollY(window.scrollY); // Update the last scroll position
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup on component unmount
  }, [lastScrollY]);

  const me = api.user.getMe.useQuery()

  return (
    <div className="m-auto w-full">
      {/* Mobile nav */}
      <div className="relative flex h-[55px] w-full items-center justify-between bg-white p-6 shadow-[0px_1px_3.7px_0px_rgba(0,0,0,0.10)] lg:hidden">
        <Sheet>
          <Link href="/" className="flex items-center justify-center gap-2">
            <img src="/logo.png" alt="logo" className="m-auto h-[37px]" />
          </Link>
          <SheetTrigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="18"
              viewBox="0 0 26 18"
              fill="none"
            >
              <line
                x1="24.0713"
                y1="1"
                x2="1.00029"
                y2="0.999998"
                stroke="#3D568F"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="24.0713"
                y1="8.87158"
                x2="1.00029"
                y2="8.87158"
                stroke="#3D568F"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="24.0713"
                y1="16.6738"
                x2="1.00029"
                y2="16.6738"
                stroke="#3D568F"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="h-full">
              <SheetTitle className="hidden">hello</SheetTitle>

              <div className="flex h-full flex-col justify-between gap-4">
                <div className="mt-4 flex flex-col items-center justify-start gap-4 text-left">
                <Link
                    href="/mentors"
                    className="mt-2 w-full text-[18px] font-normal leading-[18px] text-[#5D5A88]"
                  >
                    Mentors
                  </Link>
                  <div className="relative mt-2 w-full">
                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer items-center justify-between text-[18px] font-normal leading-[18px] text-[#5D5A88]">
                        <Link href="/solutions/student">Solutions</Link>
                        <span className="transition group-open:rotate-180">
                          <svg
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 1L5 5L9 1"
                              stroke="#5D5A88"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </summary>
                      <div className="ml-4 mt-3 space-y-2">
                        <Link
                          href="/solutions/student"
                          className="block text-[16px] font-normal text-[#5D5A88]"
                        >
                          Students
                        </Link>
                        <Link
                          href="/solutions/mentor"
                          className="block text-[16px] font-normal text-[#5D5A88]"
                        >
                          Mentors
                        </Link>
                       
                      </div>
                    </details>
                  </div>
                  <Link
                    href="/blog"
                    className="mt-2 w-full text-[18px] font-normal leading-[18px] text-[#5D5A88]"
                  >
                    Blogs
                  </Link>
                  <Link
                  href={"/pricing"}
                  className="mt-2 w-full text-[18px] font-normal leading-[18px] text-[#5D5A88]">
                    Pricing
                  </Link>
                
                 
                  
                  <Link
                    href="/contact-us"
                    className="mt-2 w-full text-[18px] font-normal leading-[18px] text-[#5D5A88]"
                  >
                    Contact
                  </Link>
                </div>
                <div className="flex flex-col gap-16">
                 
                  <div className="flex flex-col items-center justify-center gap-4">
                    {!loggedId ? (
                      <>
                        <Link
                          href="/auth/login"
                          className="flex w-[199px] items-center justify-center gap-1 rounded-lg border border-[#E1E4ED] bg-[#F8FAFF] p-[18px_22px]"
                        >
                          Login
                        </Link>
                        <Link
                          href="/auth/login?screen_hint=signup"
                          className="flex w-[199px] items-center justify-center gap-1 rounded-lg bg-[#6D758F] p-[18px_22px] text-white shadow-md"
                        >
                          Sign up
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href={"/register"}
                          className="flex w-[199px] items-center justify-center gap-1 rounded-lg border border-[#E1E4ED] bg-[#F8FAFF] p-[18px_22px]"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/auth/logout"
                          className="flex w-[199px] items-center justify-center gap-1 rounded-lg bg-[#6D758F] p-[18px_22px] text-white shadow-md"
                        >
                          Logout
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      {/* md --> ipad air vertical
    lg-->ipad pro vertical
    xl--> desktop */}

      <div
        className={`fixed left-[50%] z-[50] w-full   m-auto hidden h-[78px]  translate-x-[-50%] items-center justify-between  bg-white px-[10%]  transition-transform duration-300 lg:flex ${
          showNavbar
            ? "translate-y-[0px] transform "
            : "-translate-y-[100px] transform"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Link href="/" className="cursor-pointer">
            <img src="/logo.png" alt="logo" className="m-auto h-[80px]" />
          </Link>
        </div>
        <div className="flex items-center justify-center font-inter leading-normal text-white lg:gap-4 lg:text-[16px] xl:gap-8 xl:text-[16px] font-[500]">
          <NavigationMenu>
            <NavigationMenuList className="text-black text-[16px] font-[500]">
            <NavigationMenuItem>
                <Link href="/mentors" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Mentors
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="">
                <NavigationMenuTrigger>
                  <Link href="/solutions/student" className="cursor-pointer ">
                    Solutions
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <div
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                          
                        >
                          <img src="/logo.png" alt="logo" className="h-20 w- object-cover"  />
                          <div className="mb-2 mt-4 text-sm font-medium">
                            Solutions offered
                          </div>
                          <p className="text-xs leading-tight text-muted-foreground">
                            Tailored solutions for students and mentors to connect and grow together.
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </li>
                 
                    <ListItem href="/solutions/mentor" title="Mentors">
                      Monetize your expertise, build your personal brand, and
                      mentor on your own terms with full flexibility.
                    </ListItem>
                    <ListItem href="/solutions/student" title="Students">
                      Get AI-powered career guidance, connect with mentors, and
                      ace your interviews with expert preparation.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Link href="/blog" className="cursor-pointer">
                    Blogs
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component: any) => (
                      <ListItem
                        key={component.title}
                        href={component.href}
                      >
                        <div className="flex items-start gap-2">
                          <img
                            src={component.imageUrl}
                            alt={component.imageAlt}
                            className="mt-2 h-[60px] w-[60px] rounded-md object-cover"
                          />
                          <div>
                            <div className="text-[14px] font-medium leading-[24px] text-black">
                              {component.title}
                            </div>
                            {component.description}
                          </div>
                        </div>
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/contact-us" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {!loggedId ? (
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth/login"
              className="font-roboto flex h-[41px] flex-shrink-0 flex-col items-center justify-center gap-[12px] rounded-[25px] border-[0.5px] border-[rgba(94,127,203,0.6)] bg-white text-[16px] font-medium leading-[24px] text-[#3D568F] shadow-md lg:w-[100px] xl:w-[134px]"
            >
              Login
            </Link>
            <Link
              href="/auth/login?screen_hint=signup"
              className="flex w-[102px] h-[41px] p-3 flex-col justify-center items-center shrink-0 rounded-[31px] bg-[#3D568F] shadow-md text-white font-roboto text-[16px] not-italic font-medium leading-[24px]
"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Link
               href={"/register"}

              className="font-roboto flex h-[41px] flex-shrink-0 flex-col items-center justify-center gap-[12px] rounded-[31px] border-[0.5px] border-[rgba(94,127,203,0.6)] bg-white text-[16px] font-medium leading-[24px] text-[#3D568F] shadow-md lg:w-[100px] xl:w-[134px]"
            >
              Dashboard
            </Link>
            <Link
              href="/auth/logout"
              className="flex w-[102px] h-[41px] p-3 flex-col justify-center items-center shrink-0 rounded-[31px] bg-[#3D568F] shadow-md  text-white font-roboto text-[16px] not-italic font-medium leading-[24px]"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
export default Navbar;
