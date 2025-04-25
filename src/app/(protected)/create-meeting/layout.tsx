import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getUserFromSession } from "@/data/user";

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  try {
    const user = await getUserFromSession();
    if (!user || user?.role !== "MENTOR") {
        redirect("/register");
    } 
    } catch (err) {
      redirect("/auth/login");
    }


  return (
    <>
    {children}
    </>
  );
}
