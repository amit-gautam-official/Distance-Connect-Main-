// This layout is used to protect the routes that are protected by Auth0

import { auth0 } from "@/lib/auth0";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}

