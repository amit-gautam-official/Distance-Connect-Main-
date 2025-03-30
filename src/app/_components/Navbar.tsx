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
const Navbar = ({ loggedId, blogs }: { loggedId: boolean; blogs: any }) => {
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

  console.log(blogs);

  console.log(components);

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

  return (
    <div className="m-auto w-full">
      {/* Mobile nav */}
      <div className="relative flex h-[55px] w-full items-center justify-between bg-white p-6 shadow-[0px_1px_3.7px_0px_rgba(0,0,0,0.10)] lg:hidden">
        <Sheet>
          <Link href="/" className="flex items-center justify-center gap-2">
            <img
              src="/logo.png"
              alt="logo"
              className="m-auto h-[37px] w-[35px]"
            />
            <div className="mt-1 text-center font-inter text-[15px] font-semibold leading-normal text-black">
              Distance Connect
            </div>
            <div></div>
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
                  <div className="mt-2 w-full text-[18px] font-normal leading-[18px] text-[#5D5A88]">
                    Home
                  </div>
                  <div className="mt-2 w-full text-[18px] font-normal leading-[18px] text-[#5D5A88]">
                    About
                  </div>
                  <Link
                    href="/blog"
                    className="mt-2 w-full text-[18px] font-normal leading-[18px] text-[#5D5A88]"
                  >
                    Blogs
                  </Link>
                  <div className="mt-2 w-full text-[18px] font-normal leading-[18px] text-[#5D5A88]">
                    Use Cases
                  </div>
                  <div className="mt-2 w-full text-[18px] font-normal leading-[18px] text-[#5D5A88]">
                    Pricing
                  </div>
                  <Link
                    href="/contact-us"
                    className="mt-2 w-full text-[18px] font-normal leading-[18px] text-[#5D5A88]"
                  >
                    Contact
                  </Link>
                </div>
                <div className="flex flex-col gap-16">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-[16px] font-medium leading-[16px] text-[#5D5A88]">
                      <CircleHelp /> <span>FAQs</span>
                    </div>
                    <div className="flex items-center gap-2 text-[16px] font-medium leading-[16px] text-[#5D5A88]">
                      <Headphones /> <span>Support</span>
                    </div>
                    <div className="flex items-center gap-2 text-[16px] font-medium leading-[16px] text-[#5D5A88]">
                      <Settings /> <span>Settings</span>
                    </div>
                  </div>
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
                          href="/register"
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
        className={`fixed left-[50%] z-[200] m-auto hidden h-[68px] w-[80%] translate-x-[-50%] items-center justify-between rounded-[50px] bg-[#9FBAF1] pl-4 pr-6 shadow-md transition-transform duration-300 lg:flex ${
          showNavbar
            ? "translate-y-[30px] transform"
            : "-translate-y-[100px] transform"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <img
            src="/logo.png"
            alt="logo"
            className="m-auto h-[37px] w-[35px]"
          />
          <div className="cursor-pointer font-inter font-bold leading-[24px] tracking-[0.17px] text-white lg:text-[14px] xl:text-[17px]">
            Distance Connect
          </div>
        </div>
        <div className="flex items-center justify-center font-inter font-medium leading-normal text-white lg:gap-4 lg:text-[12px] xl:gap-8 xl:text-[16px]">
          {/* <div className="cursor-pointer">Solutions</div>
        <Link href="/blog" className='cursor-pointer'>Resources</Link>
        <div>Pricing</div>
        <Link href="/contact-us" className='cursor-pointer'>Contact Us</Link> */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="">
                <NavigationMenuTrigger>
                  <Link href="/solutions" className="cursor-pointer">
                    Solutions
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <img src="/logo.png" alt="logo" className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Solutions offered
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Beautifully designed components built with Radix UI
                            and Tailwind CSS.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/solutions/startup" title="Startups">
                      Re-usable components built using Radix UI and Tailwind
                      CSS.
                    </ListItem>
                    <ListItem href="/solutions/mentor" title="Mentors">
                      How to install dependencies and structure your app.
                    </ListItem>
                    <ListItem href="/solutions/student" title="Students">
                      Styles for headings, paragraphs, lists...etc
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
                        // title={component.title}
                        href={component.href}
                      >
                        <div className="flex items-start gap-2">
                          <img
                            src={component.imageUrl}
                            alt={component.imageAlt}
                            className="mt-2 h-[60px] w-[60px] rounded-md"
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
              className="font-roboto flex h-[41px] flex-shrink-0 flex-col items-center justify-center gap-[12px] rounded-[25px] border-[0.5px] border-[rgba(94,127,203,0.6)] bg-white text-[16px] font-medium leading-[24px] text-[#3D568F] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.08)] lg:w-[100px] xl:w-[134px]"
            >
              Login
            </Link>
            <Link
              href="/auth/login?screen_hint=signup"
              className="font-roboto flex h-[41px] flex-shrink-0 flex-col items-center justify-center gap-[12px] rounded-[25px] border-[0.5px] border-[rgba(94,127,203,0.6)] text-[16px] font-medium leading-[24px] text-[#3D568F] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.08)] lg:w-[100px] xl:w-[134px]"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="font-roboto flex h-[41px] flex-shrink-0 flex-col items-center justify-center gap-[12px] rounded-[25px] border-[0.5px] border-[rgba(94,127,203,0.6)] bg-white text-[16px] font-medium leading-[24px] text-[#3D568F] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.08)] lg:w-[100px] xl:w-[134px]"
            >
              Dashboard
            </Link>
            <Link
              href="/auth/logout"
              className="font-roboto flex h-[41px] flex-shrink-0 flex-col items-center justify-center gap-[12px] rounded-[25px] border-[0.5px] border-[rgba(94,127,203,0.6)] bg-white text-[16px] font-medium leading-[24px] text-[#3D568F] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.08)] lg:w-[100px] xl:w-[134px]"
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
