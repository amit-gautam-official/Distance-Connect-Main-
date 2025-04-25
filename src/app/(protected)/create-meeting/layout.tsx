import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getUserById } from "@/data/user";
import { auth } from "@/server/auth";

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
    const session = await auth();

    const user = await getUserById(session?.user?.id);
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
