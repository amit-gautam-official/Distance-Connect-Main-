import React from "react";
import client from "@/lib/contentful";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Entry } from "contentful";
import RichText from "../_components/RichText";

// Add type for generating metadata
type Props = {
  params: Promise<{ blogId: string }>;
};

// Generate dynamic metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { blogId } = await params;
  const blog: any = await getBlogPost(blogId);
  const seoFields = blog?.fields?.seoFields?.fields;
 

  if (!blog) {
    return {
      title: "Blog Post Not Found | Distance Connect",
    };
  }

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ),
    title: `${seoFields?.internalName} | Distance Connect`,
    description: seoFields?.pageDescription || "Blog Distance Connect",
    openGraph: {
      title: `${seoFields?.internalName} | Distance Connect`,
      description: seoFields?.pageDescription || "Blog Distance Connect",
      images: [
        {
          url: `${seoFields?.shareImages[0]?.fields?.file?.url}`,
          width: 1200,
          height: 630,
          alt: seoFields?.shareImages[0]?.fields?.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoFields?.internalName} | Distance Connect`,
      description: seoFields?.pageDescription || "Blog Distance Connect",
      images: [seoFields?.shareImages[0]?.fields?.file?.url || "/blog.jpg"],
    },
  };
}

interface BlogPost {
  title: string;
  slug: string;
  seoFields?: {
    fields: {
      internalName: string;
    };
  };
  // Add other fields as needed
}

// Helper function to fetch blog post
async function getBlogPost(slug: string) {
  const response = await client.getEntries({
    content_type: "pageBlogPost",
    "fields.slug": slug,
  });

  return response.items[0];
}

export default async function BlogPost({ params }: Props) {
  const { blogId } = await params;
  const blog: any = await getBlogPost(blogId);
  // console.log(blog?.fields?.seoFields?.fields.shareImage);
  if (!blog) {
    notFound();
  }

  console.log(blog?.fields);

  return (
    <div className="mx-auto min-h-screen w-[80%] pt-[150px]">
      <div className="mb-[100px] flex flex-col gap-4">
        <div className="tracking-[0.6px text-center font-inter text-xl font-normal text-[#9FBAF1]">
          {blog?.fields?.publishedDate}
        </div>
        <div className="text-center font-inter text-5xl font-normal tracking-[1.44px] text-black">
          {blog?.fields?.title}
        </div>
        <div className="text-center font-inter text-base font-normal leading-6 text-black">
          {blog?.fields?.shortDescription}
        </div>
      </div>

      <div className="mb-[80px] flex flex-col gap-y-[40px]">
        <img
          src={blog?.fields?.featuredImage?.fields?.file?.url}
          alt="blog"
          className="mx-auto object-cover h-[516px] w-[1106px] flex-shrink-0 rounded-[40px]"
        />
        <div className="mx-auto w-[80%] font-inter text-xl font-normal leading-[30px] text-black">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          ullamcorper mattis lorem non. Ultrices praesent amet ipsum justo
          massa. Eu dolor aliquet risus gravida nunc at feugiat consequat purus.
          Non massa enim vitae duis mattis. Vel in ultricies vel fringilla.
        </div>
      </div>

      <div className="mx-auto my-5 h-[1px] w-[60%] bg-black"></div>

      <div className="w-[8text-black leading-[30px]0%] overflow-hidden   mx-auto font-inter text-xl font-normal">
        <RichText content={blog?.fields?.content} />
      </div>
    </div>
  );
}
