"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import client from "@/lib/contentful";

const BlogContext = createContext<any[]>([]);

export const useBlogs = () => useContext(BlogContext);

interface BlogProviderProps {
  children: ReactNode;
  initialBlogs: any[];
}

export const BlogProvider = ({ children, initialBlogs }: BlogProviderProps) => {
  const [blogs, setBlogs] = useState<any[]>(initialBlogs);

  // Optional: Refresh logic if needed
  useEffect(() => {
    const refreshBlogs = async () => {
      const response = await client.getEntries({ content_type: "pageBlogPost" });
      const sorted = response.items.sort(
        (a, b) =>
          new Date(b.sys.updatedAt).getTime() -
          new Date(a.sys.updatedAt).getTime(),
      );
      setBlogs(sorted);
    };
    // refreshBlogs(); // Uncomment if you need periodic refreshing
  }, []);

  return (
    <BlogContext.Provider value={blogs}>{children}</BlogContext.Provider>
  );
};