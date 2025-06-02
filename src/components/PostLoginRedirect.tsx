// components/PostLoginRedirect.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PostLoginRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const redirectPath = localStorage.getItem("postLoginRedirect");
    if (redirectPath) {
      localStorage.removeItem("postLoginRedirect"); // Clean up after use
      router.push(redirectPath);
    }
  }, [router]);

  return null; // No UI needed
};

export default PostLoginRedirect;
