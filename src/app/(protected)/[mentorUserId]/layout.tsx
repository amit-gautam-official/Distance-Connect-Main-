
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { SessionUser } from "@/types/sessionUser";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  
  
    const session = await auth();

   const user = session?.user as SessionUser | null;

   if (!user || user?.role !== "STUDENT" || !user?.isRegistered) {
       redirect("/register");
   }
   



  return (

          <div className=" pb-20  md:pb-0">
            {children}
          </div>

  );
}
