
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

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

   if (!user || user?.role !== "STUDENT") {
       redirect("/register");
   } 
   } catch (err) {
     redirect("/auth/login");
   }



  return (

          <div className="w-[calc(100vw-10%)] pb-20 md:w-[calc(100vw-280px)] md:pb-0">
            {children}
          </div>

  );
}
