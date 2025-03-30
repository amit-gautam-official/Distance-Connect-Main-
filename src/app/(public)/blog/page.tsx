import React from "react";
import Hero from "./_components/Hero";
import BlogCard from "./_components/BlogCard";
import PaginationComponent from "./_components/Pagination";
import Link from "next/link";
import client from "@/lib/contentful";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Distance Connect",
  description:
    "Explore our blog for insights, experiences, and lessons from the Distance Connect community. Find inspiration and share your stories.",
  openGraph: {
    title: "Blog | Distance Connect",
    description:
      "Explore our blog for insights, experiences, and lessons from the Distance Connect community. Find inspiration and share your stories.",
    images: [
      {
        url: "/blog.jpg", // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Distance Connect Blog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Distance Connect",
    description:
      "Explore our blog for insights, experiences, and lessons from the Distance Connect community. Find inspiration and share your stories.",
    images: ["/og-blog.jpg"], // Same image as OpenGraph
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = async () => {
  const response = await client.getEntries({ content_type: "pageBlogPost" });

  const blogsInDescendingOrder = response.items.sort(
    (a, b) =>
      new Date(b.sys.updatedAt).getTime() - new Date(a.sys.updatedAt).getTime(),
  );

  return (
    <div className="mx-auto min-h-screen w-full bg-white pt-[50px] md:pt-[150px]">
      <div className="mb-20">
        <div className="text-center font-inter text-[20px] font-normal leading-normal tracking-[0.6px] [webkit-text-stroke-color:#000] [webkit-text-stroke-width:1px]">
          Find Your Inspiration Here
        </div>
        <div className="text-center font-inter text-[28px] font-normal leading-normal tracking-[1.44px] text-black [webkit-text-stroke-color:#000] [webkit-text-stroke-width:1px] md:text-[48px]">
          Share your experience, cases <br /> and lessons with the Distance{" "}
          <br /> connect community
        </div>
      </div>

      <Hero blog={blogsInDescendingOrder[0]} />

      <div className="mx-auto mb-10 mt-20 grid w-[80%] grid-cols-1 gap-y-10 md:grid-cols-2 md:pl-8 xl:grid-cols-3">
        {blogsInDescendingOrder.map((blog: any) => (
          <Link key={blog?.fileds?.slug} href={`/blog/${blog?.fields?.slug}`}>
            <BlogCard blog={blog?.fields} />
          </Link>
        ))}
      </div>

      <PaginationComponent />
    </div>
  );
};

export default page;
