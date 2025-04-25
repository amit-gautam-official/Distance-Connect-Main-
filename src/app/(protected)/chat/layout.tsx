import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

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

    const user = await db.user.findUnique({
            where: {
                id : session?.user?.id,
            }
        }); 
  if (!user) {
      redirect("/register");
  } 
  } catch (err) {
    redirect("/auth/login");
  }


  return (

          <div>
            {children}
          </div>

  );
}
